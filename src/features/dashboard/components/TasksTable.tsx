import React from 'react';
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
    <div className="tasks-card">
      <div className="tasks-card-header">
        <h3 className="tasks-card-title">Recent Assignments</h3>
        <button className="tasks-card-view-all">View All Work</button>
      </div>

      <div className="overflow-x-auto">
        <table className="tasks-table">
          <thead>
            <tr className="tasks-table-head-row">
              <th className="tasks-table-th">Task Title</th>
              <th className="tasks-table-th-center">Status</th>
              <th className="tasks-table-th-center hidden sm:table-cell">Priority</th>
              <th className="tasks-table-th-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="tasks-table-body">
            {tasks.map((task) => {
              const pStyles = getPriorityStyles(task.priority);
              const sStyles = getStatusStyles(task.status);

              return (
                <tr key={task.id} className="tasks-table-row">
                  <td className="tasks-table-td-title">
                    <div className="flex flex-col">
                      <span className="tasks-table-task-id">{task.id}</span>
                      <span className="tasks-table-task-name">{task.title}</span>
                    </div>
                  </td>
                  <td className="tasks-table-td-center">
                    <span className={`tasks-table-status-badge ${sStyles}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <div className="tasks-table-priority-cell">
                      <div className={`tasks-table-priority-dot ${pStyles.dot}`}></div>
                      <span className={`text-[10px] transition-colors ${pStyles.text}`}>{task.priority}</span>
                    </div>
                  </td>
                  <td className="tasks-table-td-date">{task.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksTable;
