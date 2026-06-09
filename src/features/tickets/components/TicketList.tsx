import React from 'react';
import type { Ticket } from '../types';
import { AlertTriangle, Clock, CheckCircle, ChevronRight, User, Search } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketClick }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return '';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="text-red-600 font-bold animate-pulse" size={16} />;
      case 'High': return <AlertTriangle className="text-orange-500" size={16} />;
      case 'Medium': return <Clock className="text-blue-500" size={16} />;
      case 'Low': return <CheckCircle className="text-slate-400" size={16} />;
      default: return null;
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto p-12 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No tickets found</h3>
        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className="group flex flex-col md:flex-row md:items-center gap-4 p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer"
          onClick={() => onTicketClick(ticket)}
        >
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">{ticket.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {ticket.title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                {getPriorityIcon(ticket.priority)}
                <span className="text-xs font-medium text-slate-500">{ticket.priority}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400">
                Updated {new Date(ticket.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3 md:w-48">
              {ticket.assignee.avatar ? (
                <img src={ticket.assignee.avatar} alt={ticket.assignee.name} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center bg-slate-100">
                  <User size={14} className="text-slate-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Assignee</span>
                <span className="text-sm font-medium text-slate-700">{ticket.assignee.name}</span>
              </div>
            </div>
            
            <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
