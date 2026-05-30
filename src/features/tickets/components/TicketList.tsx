import React from 'react';
import type { Ticket } from '../types';
import { AlertTriangle, Clock, CheckCircle, ChevronRight, User } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketClick }) => {
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
      case 'Critical': return <AlertTriangle className="priority-critical" size={16} />;
      case 'High': return <AlertTriangle className="priority-high" size={16} />;
      case 'Medium': return <Clock className="priority-medium" size={16} />;
      case 'Low': return <CheckCircle className="priority-low" size={16} />;
      default: return null;
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="ticket-list-container p-12 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No tickets found</h3>
        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className="ticket-item group"
          onClick={() => onTicketClick(ticket)}
        >
          <div className="ticket-item-main">
            <div className="flex items-center gap-3">
              <span className="ticket-id">{ticket.id}</span>
              <span className={`ticket-badge ${getStatusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h3 className="ticket-title group-hover:text-blue-600 transition-colors">
              {ticket.title}
            </h3>
            <p className="ticket-desc">{ticket.description}</p>
            
            <div className="ticket-meta">
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
            <div className="ticket-assignee">
              {ticket.assignee.avatar ? (
                <img src={ticket.assignee.avatar} alt={ticket.assignee.name} className="assignee-avatar" />
              ) : (
                <div className="assignee-avatar flex items-center justify-center bg-slate-100">
                  <User size={14} className="text-slate-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Assignee</span>
                <span className="assignee-name">{ticket.assignee.name}</span>
              </div>
            </div>
            
            <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Re-importing Search for the empty state
import { Search } from 'lucide-react';

export default TicketList;
