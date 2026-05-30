import React from 'react';
import { Search, Filter } from 'lucide-react';

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}) => {
  return (
    <div className="ticket-filters-bar">
      <div className="search-input-wrap">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search tickets..."
          className="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
        </div>
        
        <select
          className="filter-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">Status: All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="filter-select"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="All">Priority: All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>
  );
};

export default TicketFilters;
