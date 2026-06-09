import React from 'react';
import { CheckCircle } from 'lucide-react';
import { TicketStatus, TicketPriority } from '../types/dashboard.types';

interface Task {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
}

interface TasksTableProps {
  tasks: Task[];
}

const getPriorityStyles = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.CRITICAL:
      return {
        dot: 'bg-rose-600 ring-4 ring-rose-500/20 animate-pulse',
        text: 'text-rose-700 font-bold uppercase tracking-tight',
      };
    case TicketPriority.HIGH:
      return {
        dot: 'bg-orange-500 ring-4 ring-orange-500/20',
        text: 'text-orange-700 font-bold uppercase tracking-tight',
      };
    case TicketPriority.MEDIUM:
      return {
        dot: 'bg-blue-500 ring-4 ring-blue-500/20',
        text: 'text-blue-700 font-semibold uppercase tracking-tight',
      };
    case TicketPriority.LOW:
      return {
        dot: 'bg-slate-400 ring-4 ring-slate-400/20',
        text: 'text-slate-600 font-medium uppercase tracking-tight',
      };
    default:
      return {
        dot: 'bg-slate-200 ring-2 ring-slate-200/50',
        text: 'text-slate-400 font-medium uppercase tracking-tight',
      };
  }
};

const getStatusStyles = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:       return 'text-amber-700';
    case TicketStatus.IN_PROGRESS: return 'text-blue-700';
    case TicketStatus.RESOLVED:   return 'text-emerald-700';
    case TicketStatus.CLOSED:     return 'bg-slate-100/80 text-slate-600 border border-slate-200';
    default:                      return 'bg-slate-50 text-slate-400';
  }
};

const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden min-h-[300px] h-[400px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-lg font-bold text-slate-800">Recent Assignments</h3>
        <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] border border-slate-100 px-3 py-1.5 rounded-lg active:scale-95">View All Work</button>
      </div>

      <div className="overflow-x-auto flex-1 flex flex-col">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
              <CheckCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">No Active Assignments</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              You are all caught up! Any new issues assigned to you will show up here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="pb-4 pt-1 font-bold">Task Title</th>
                <th className="pb-4 pt-1 font-bold text-center">Status</th>
                <th className="pb-4 pt-1 font-bold text-center hidden sm:table-cell">Priority</th>
                <th className="pb-4 pt-1 font-bold text-right tabular-nums hidden md:table-cell">Due Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tasks.map((task) => {
                const pStyles = getPriorityStyles(task.priority);
                const sStyles = getStatusStyles(task.status);

                return (
                  <tr key={task.id} className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="py-4 pr-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 mb-0.5 transition-colors uppercase tracking-widest group-hover:text-blue-500">{task.id}</span>
                        <span className="text-slate-800 font-bold transition-colors truncate max-w-[150px] sm:max-w-[300px] lg:max-w-none inline-block group-hover:text-slate-900">{task.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black tracking-widest shadow-sm ${sStyles}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 hidden sm:table-cell">
                      <div className="flex items-center justify-center space-x-2.5">
                        <div className={`w-2 h-2 rounded-full ring-4 transition-all duration-500 ${pStyles.dot}`}></div>
                        <span className={`text-[10px] transition-colors ${pStyles.text}`}>{task.priority}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-slate-500 font-bold text-[11px] tabular-nums tracking-tighter hidden md:table-cell">{task.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TasksTable;
