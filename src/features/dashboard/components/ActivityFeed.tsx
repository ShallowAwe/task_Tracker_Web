import React from 'react';
import { Activity } from 'lucide-react';
import type { ActivityItem } from '../types/dashboard.types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
        Recent Activity
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">See All</button>
      </h3>
      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Activity size={20} />
            </div>
            <p className="text-sm font-bold text-slate-700">No Recent Activity</p>
            <p className="text-xs text-slate-400 max-w-[240px] mx-auto mt-0.5">
              Workspace actions and updates will show up here.
            </p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="group flex items-start space-x-3 md:space-x-4">
              <div className="relative shrink-0">
                <img
                  src={typeof act.avatar === 'string' ? act.avatar : (act.user as any)?.avatar}
                  alt={typeof act.user === 'string' ? act.user : (act.user as any)?.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:ring-blue-100"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed break-words">
                  <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                    {typeof act.user === 'string' ? act.user : (act.user as any)?.name}
                  </span>
                  <span className="mx-1">{act.action}</span>
                  {act.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide mx-1 shadow-sm">{act.badge}</span>
                  )}
                  <span className="font-semibold text-slate-800 transition-colors group-hover:text-blue-700">{act.target}</span>
                </p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold uppercase tracking-tighter">{act.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
