import React, { useState, useRef } from 'react';
import type { Ticket, TicketStatus } from '../types';
import { AlertTriangle, Clock, CheckCircle, User, ArrowRightLeft } from 'lucide-react';

interface TicketBoardProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string | number, newStatus: TicketStatus) => Promise<void>;
}

const COLUMNS: { status: TicketStatus; label: string; theme: { dot: string; bgHeader: string; borderHeader: string; textHeader: string } }[] = [
  { 
    status: 'Open', 
    label: 'To Do', 
    theme: { dot: 'bg-blue-500 shadow-blue-200', bgHeader: 'bg-blue-50/50', borderHeader: 'border-blue-100', textHeader: 'text-blue-700' } 
  },
  { 
    status: 'In Progress', 
    label: 'In Progress', 
    theme: { dot: 'bg-amber-500 shadow-amber-200', bgHeader: 'bg-amber-50/50', borderHeader: 'border-amber-100', textHeader: 'text-amber-700' } 
  },
  { 
    status: 'Resolved', 
    label: 'Resolved', 
    theme: { dot: 'bg-emerald-500 shadow-emerald-200', bgHeader: 'bg-emerald-50/50', borderHeader: 'border-emerald-100', textHeader: 'text-emerald-700' } 
  },
  { 
    status: 'Closed', 
    label: 'Closed', 
    theme: { dot: 'bg-slate-500 shadow-slate-200', bgHeader: 'bg-slate-100/50', borderHeader: 'border-slate-200', textHeader: 'text-slate-600' } 
  },
];

const TicketBoard: React.FC<TicketBoardProps> = ({ tickets, onTicketClick, onStatusUpdate }) => {
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [activeOverCol, setActiveOverCol] = useState<TicketStatus | null>(null);
  
  // Use a Ref to synchronously and reliably track the dragged ticket across all drop zones
  const draggedTicketRef = useRef<string | null>(null);

  // Helper for priority icons
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold">
            <AlertTriangle className="text-rose-600 animate-pulse" size={12} />
            <span>Critical</span>
          </div>
        );
      case 'High':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold">
            <AlertTriangle className="text-amber-500" size={12} />
            <span>High</span>
          </div>
        );
      case 'Medium':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold">
            <Clock className="text-blue-500" size={12} />
            <span>Medium</span>
          </div>
        );
      case 'Low':
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">
            <CheckCircle className="text-slate-400" size={12} />
            <span>Low</span>
          </div>
        );
    }
  };

  // Helper for type badges
  const getTypeBadge = (type?: string) => {
    const t = type?.toUpperCase() || 'TASK';
    switch (t) {
      case 'BUG':
        return <span className="px-1.5 py-0.5 rounded bg-rose-100/70 text-rose-700 border border-rose-200 text-[9px] font-extrabold tracking-wider uppercase">Bug</span>;
      case 'EPIC':
        return <span className="px-1.5 py-0.5 rounded bg-purple-100/70 text-purple-700 border border-purple-200 text-[9px] font-extrabold tracking-wider uppercase">Epic</span>;
      case 'STORY':
      case 'USER STORY':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold tracking-wider uppercase">Story</span>;
      case 'SUBTASK':
        return <span className="px-1.5 py-0.5 rounded bg-cyan-100/70 text-cyan-700 border border-cyan-200 text-[9px] font-extrabold tracking-wider uppercase">Subtask</span>;
      case 'TASK':
      default:
        return <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-700 border border-blue-200 text-[9px] font-extrabold tracking-wider uppercase">Task</span>;
    }
  };

  // HTML5 Drag and Drop events
  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
    draggedTicketRef.current = ticketId;
    setDraggedTicketId(ticketId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    // Delayed clearing of dragged ticket state to ensure that standard drops complete successfully first
    setTimeout(() => {
      draggedTicketRef.current = null;
      setDraggedTicketId(null);
    }, 100);
    setActiveOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TicketStatus) => {
    e.preventDefault();
    if (activeOverCol !== status) {
      setActiveOverCol(status);
    }
  };

  const handleDragLeave = () => {
    setActiveOverCol(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    const ticketId = draggedTicketRef.current || e.dataTransfer.getData('text/plain');
    setActiveOverCol(null);
    
    if (!ticketId) return;

    // Reset dragging state immediately on drop
    draggedTicketRef.current = null;
    setDraggedTicketId(null);

    // Find ticket and update status
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== targetStatus) {
      await onStatusUpdate(ticket.dbId || ticket.id, targetStatus);
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 h-full min-h-[450px]">
      {COLUMNS.map((column) => {
        const columnTickets = tickets.filter(t => t.status === column.status);
        const isOver = activeOverCol === column.status;

        return (
          <div
            key={column.status}
            className={`flex flex-col h-full bg-slate-50/50 rounded-2xl border transition-all duration-300 p-4 min-w-[260px] ${
              isOver 
                ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-100 shadow-inner' 
                : 'border-slate-200/80 shadow-sm'
            }`}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${column.theme.borderHeader}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${column.theme.dot}`} />
                <span className="font-bold text-slate-800 text-sm tracking-tight">{column.label}</span>
              </div>
              <span className="bg-white border border-slate-200 text-slate-500 font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                {columnTickets.length}
              </span>
            </div>

            {/* Column Body / Cards List */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 max-h-[calc(100vh-27rem)] scrollbar-thin">
              {columnTickets.length > 0 ? (
                columnTickets.map((ticket) => {
                  const isDraggingThis = draggedTicketId === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onTicketClick(ticket)}
                      className={`group relative bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-grab active:cursor-grabbing ${
                        isDraggingThis ? 'opacity-40 border-dashed scale-95 shadow-none' : ''
                      }`}
                    >
                      {/* Top metadata */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase leading-none">
                          {ticket.id}
                        </span>
                        {getTypeBadge(ticket.type)}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {ticket.title}
                      </h4>

                      {/* Description */}
                      {ticket.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {ticket.description}
                        </p>
                      )}

                      {/* Bottom line: Assignee avatar & Priority */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 gap-2">
                        {/* Assignee */}
                        <div className="flex items-center gap-2">
                          {ticket.assignee.avatar ? (
                            <img 
                              src={ticket.assignee.avatar} 
                              alt={ticket.assignee.name} 
                              className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 shadow-sm" 
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-200 shadow-sm flex items-center justify-center bg-slate-100">
                              <User size={10} className="text-slate-400" />
                            </div>
                          )}
                          <span className="text-[11px] font-medium text-slate-600 truncate max-w-[80px]">
                            {ticket.assignee.name.split(' ')[0]}
                          </span>
                        </div>

                        {/* Priority */}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200/60 rounded-xl p-6 text-center text-slate-400 bg-slate-50/30 min-h-[120px]">
                  <ArrowRightLeft size={16} className="text-slate-300 mb-2 rotate-90" />
                  <span className="text-[11px] font-medium">Drag issue here</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketBoard;
