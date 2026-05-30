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
    <section className="progress-section">
      {/* TOTAL COMPLETION */}
      <div className="progress-completion-card">
        {/* Glow */}
        <div className="progress-glow" />

        {/* Left */}
        <div className="progress-left">
          <p className="progress-label">Total Completion</p>

          <div className="progress-count-row">
            <h2 className="progress-count">{totalCompletion}%</h2>
            <span className="progress-trend">
              +4% <span className="hidden sm:inline">vs last week</span>
            </span>
          </div>

          <p className="progress-sprint-text">
            Sprint 14 Ends in{" "}
            <span className="font-bold text-white">4 days</span>
          </p>

          <button className="progress-settle-btn">Settle Sprint</button>
        </div>

        {/* Right Circular Progress */}
        <div className="progress-svg-wrap">
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

          <div className="progress-center-label">
            <span className="progress-goal-text">GOAL</span>
            <span className="progress-ontrack-text">ON TRACK</span>
          </div>
        </div>
      </div>

      {/* WORKFLOW BREAKDOWN */}
      <div className="workflow-card">
        <h3 className="workflow-title">Workflow Breakdown</h3>

        <div className="workflow-list">
          {stats.map((stat) => {
            const barColor =
              variantStyles[stat.variant || "neutral"] || variantStyles.neutral;

            return (
              <div key={`stat-${stat.id}`}>
                <div className="workflow-item-header">
                  <span className="workflow-item-label">{stat.label}</span>
                  <span className="workflow-item-count">{stat.count} items</span>
                </div>

                <div className="workflow-bar-track">
                  <div
                    className={`workflow-bar-fill ${barColor}`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Velocity */}
        <div className="velocity-row">
          <div className="velocity-icon-wrap">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="velocity-title">Team Velocity</p>
            <p className="velocity-subtitle">+12.5% from last sprint</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressOverview;