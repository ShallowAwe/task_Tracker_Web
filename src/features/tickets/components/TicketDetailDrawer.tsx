import React, { useEffect, useState } from 'react';
import { X, User, Clock, AlertTriangle, CheckCircle, MessageSquare, Send, Paperclip } from 'lucide-react';
import type { Ticket, Comment } from '../types';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
}

const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ ticket, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ticket) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [ticket]);

  if (!ticket) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      default: return '';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="priority-critical" size={18} />;
      case 'High': return <AlertTriangle className="priority-high" size={18} />;
      case 'Medium': return <Clock className="priority-medium" size={18} />;
      case 'Low': return <CheckCircle className="priority-low" size={18} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-out flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
              {ticket.id}
            </span>
            <span className={`ticket-badge ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
            {ticket.title}
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignee</label>
                <div className="flex items-center gap-3 mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {ticket.assignee.avatar ? (
                    <img src={ticket.assignee.avatar} alt={ticket.assignee.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User size={14} className="text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700">{ticket.assignee.name}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Priority</label>
                <div className="flex items-center gap-2 mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {getPriorityIcon(ticket.priority)}
                  <span className="text-sm font-semibold text-slate-700">{ticket.priority}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reporter</label>
                <div className="flex items-center gap-3 mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={14} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{ticket.reporter}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Created At</label>
                <div className="flex items-center gap-2 mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700">
                  <Clock size={16} className="text-slate-400" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Description</label>
            <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed text-sm">
              {ticket.description}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900">Comments</h3>
              <span className="ml-auto bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {ticket.comments?.length || 0}
              </span>
            </div>

            <div className="space-y-6">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800">{comment.authorName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 text-sm">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Add Comment */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Write a comment..."
              className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md shadow-blue-100">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetailDrawer;
