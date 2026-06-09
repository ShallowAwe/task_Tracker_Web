import React from 'react';
import { Users, Shield, UserCheck } from 'lucide-react';
import type { TeamStats, MemberRole } from '../types';

interface MemberStatsProps {
  stats: TeamStats;
}

const roleLabelMap: Record<MemberRole, string> = {
  OWNER: 'Owners',
  MAINTAINER: 'Maintainers',
  DEVELOPER: 'Developers',
  TESTER: 'Testers',
  VIEWER: 'Viewers',
};

const roleColorMap: Record<MemberRole, string> = {
  OWNER: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  MAINTAINER: 'bg-violet-50 text-violet-700 border-violet-100',
  DEVELOPER: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  TESTER: 'bg-amber-50 text-amber-700 border-amber-100',
  VIEWER: 'bg-slate-50 text-slate-700 border-slate-100',
};

const MemberStats: React.FC<MemberStatsProps> = ({ stats }) => {
  const activePercentage = stats.totalCount > 0 
    ? Math.round((stats.activeCount / stats.totalCount) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Members Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
        <div className="space-y-1">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Members</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalCount}</h3>
          <p className="text-xs text-slate-500 font-medium">Assigned to project</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Users size={24} />
        </div>
      </div>

      {/* Role Distribution Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Role Distribution</p>
          <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
            <Shield size={16} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(roleLabelMap) as MemberRole[]).map((role) => {
            const count = stats.roleCounts[role] || 0;
            if (count === 0) return null;
            return (
              <span 
                key={role} 
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 ${roleColorMap[role]}`}
              >
                <span>{count}</span>
                <span className="font-medium opacity-90">{roleLabelMap[role]}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Active Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Status</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">
              {stats.activeCount} <span className="text-xs font-medium text-slate-500">Active</span>
              {stats.pendingCount > 0 && (
                <span className="text-xs font-medium text-amber-600 ml-2">
                  ({stats.pendingCount} pending)
                </span>
              )}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserCheck size={20} />
          </div>
        </div>
        
        {/* Sleek Progress Indicator */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${activePercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>{activePercentage}% COMMITTED</span>
            <span>{stats.activeCount}/{stats.totalCount} MEMBERS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStats;
