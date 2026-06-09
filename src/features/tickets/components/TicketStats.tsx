import React from 'react';
import type { Ticket } from '../types';
import { Layers, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TicketStatsProps {
  tickets: Ticket[];
}

const TicketStats: React.FC<TicketStatsProps> = ({ tickets }) => {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  const statItems = [
    {
      label: 'Total Tickets',
      value: total,
      icon: Layers,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      gradientClass: 'from-indigo-500/5 to-transparent',
    },
    {
      label: 'Open',
      value: open,
      icon: AlertCircle,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100',
      gradientClass: 'from-blue-500/5 to-transparent',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: RefreshCw,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      gradientClass: 'from-amber-500/5 to-transparent',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle2,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      gradientClass: 'from-emerald-500/5 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
      {statItems.map((item, idx) => (
        <div 
          key={idx}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm overflow-hidden hover:border-slate-300 hover:shadow-md active:scale-[0.99] transition-all duration-300 cursor-default"
        >
          {/* Accent Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="space-y-1 z-10">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              {item.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight transition-transform group-hover:translate-x-1 duration-300">
              {item.value}
            </h3>
          </div>

          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 z-10 ${item.colorClass}`}>
            <item.icon size={22} className={item.label === 'In Progress' && item.value > 0 ? 'animate-[spin_10s_linear_infinite]' : ''} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketStats;
