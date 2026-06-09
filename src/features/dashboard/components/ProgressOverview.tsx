import React from "react";
import { TrendingUp } from "lucide-react";
import type { WorkflowStat } from "../types/dashboard.types";

interface ProgressOverviewProps {
  stats: WorkflowStat[];
  totalCompletion: number;
}

const variantStyles = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  neutral: "bg-slate-400",
};

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  stats,
  totalCompletion,
}) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (circumference * totalCompletion) / 100;

  return (
    <section className="space-y-6">
      {/* TOTAL COMPLETION */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl p-5 sm:p-6 lg:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Glow */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />

        {/* Left */}
        <div className="relative z-10 text-center lg:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Completion</p>

          <div className="mt-2 flex flex-wrap items-end justify-center lg:justify-start gap-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums">{totalCompletion}%</h2>
            {totalCompletion > 0 ? (
              <span className="text-xs sm:text-sm font-bold text-emerald-400">
                +4% <span className="hidden sm:inline">vs last week</span>
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                0% <span className="hidden sm:inline">vs last week</span>
              </span>
            )}
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-300">
            Sprint 14 Ends in{" "}
            <span className="font-bold text-white">4 days</span>
          </p>

          <button className="mt-6 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition-all">Settle Sprint</button>
        </div>

        {/* Right Circular Progress */}
        <div className="relative z-10 shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              className="text-white/10"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-emerald-400 transition-all duration-1000"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg sm:text-xl font-black">GOAL</span>
            <span className={`text-[9px] font-bold tracking-[0.2em] ${totalCompletion > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {totalCompletion > 0 ? 'ON TRACK' : 'STARTING'}
            </span>
          </div>
        </div>
      </div>

      {/* WORKFLOW BREAKDOWN */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-6">Workflow Breakdown</h3>

        <div className="space-y-5">
          {stats.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-semibold">
              No active workflow metrics.
            </div>
          ) : (
            stats.map((stat) => {
              const barColor =
                variantStyles[stat.variant || "neutral"] || variantStyles.neutral;

              return (
                <div key={`stat-${stat.id}`}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                    <span className="font-bold tabular-nums text-slate-900">{stat.count} items</span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Velocity */}
        <div className="mt-8 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
          <div className="rounded-lg bg-emerald-50 p-2">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Team Velocity</p>
            <p className="text-xs font-medium text-slate-500">+12.5% from last sprint</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressOverview;