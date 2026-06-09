import React from 'react';
import { Search, Filter, List, LayoutGrid } from 'lucide-react';

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets by title or key..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
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

      {/* View Mode Segmented Control */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Switch to List view"
        >
          <List size={14} />
          <span>List</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('board')}
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
            viewMode === 'board' 
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Switch to Kanban Board view"
        >
          <LayoutGrid size={14} />
          <span>Board</span>
        </button>
      </div>
    </div>
  );
};

export default TicketFilters;

