import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle2,
  Trash2,
  Calendar,
  Target,
  Ticket,
} from 'lucide-react';
import type { Sprint } from '../types';

interface SprintCardProps {
  sprint: Sprint;
  onStart: (sprintId: number) => void;
  onComplete: (sprintId: number) => void;
  onDelete: (sprintId: number) => void;
  onClick: (sprint: Sprint) => void;
  disabled?: boolean;
}

const STATUS_THEME = {
  PLANNING: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    accent: 'border-l-slate-400',
  },
  ACTIVE: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500 animate-pulse',
    accent: 'border-l-blue-500',
  },
  COMPLETED: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
  },
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate + 'T23:59:59');
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  return diff;
};

const SprintCard: React.FC<SprintCardProps> = ({
  sprint,
  onStart,
  onComplete,
  onDelete,
  onClick,
  disabled,
}) => {
  const theme = STATUS_THEME[sprint.status];
  const progress =
    sprint.totalTickets > 0
      ? Math.round((sprint.completedTickets / sprint.totalTickets) * 100)
      : 0;
  const daysLeft = sprint.status === 'ACTIVE' ? getDaysRemaining(sprint.endDate) : null;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => onClick(sprint)}
      className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-[box-shadow,border-color] cursor-pointer border-l-4 ${theme.accent}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {sprint.name}
            </h3>
            {sprint.goal && (
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{sprint.goal}</p>
            )}
          </div>
          <span
            className={`shrink-0 ml-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
            {sprint.status === 'PLANNING' && 'Planning'}
            {sprint.status === 'ACTIVE' && 'Active'}
            {sprint.status === 'COMPLETED' && 'Completed'}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} />
            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ticket size={13} />
            {sprint.completedTickets}/{sprint.totalTickets} tickets
          </span>
          {daysLeft !== null && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                daysLeft <= 2 ? 'text-red-600' : daysLeft <= 5 ? 'text-amber-600' : 'text-slate-500'
              }`}
            >
              <Target size={13} />
              {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {sprint.totalTickets > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className="font-bold text-slate-700">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress === 100
                    ? 'bg-emerald-500'
                    : progress > 50
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center gap-2 pt-3 border-t border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {sprint.status === 'PLANNING' && (
            <button
              onClick={() => onStart(sprint.id)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Play size={13} /> Start Sprint
            </button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button
              onClick={() => onComplete(sprint.id)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={13} /> Complete
            </button>
          )}
          {sprint.status !== 'ACTIVE' && (
            <button
              onClick={() => onDelete(sprint.id)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors ml-auto disabled:opacity-50"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SprintCard;
