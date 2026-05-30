import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { Deadline } from "../types/dashboard.types";

interface DeadlineSectionProps {
  deadlines: Deadline[];
}

const priorityStyles = {
  high: {
    bullet: "bg-red-500",
    time: "text-red-500",
  },
  medium: {
    bullet: "bg-yellow-500",
    time: "text-amber-500",
  },
  low: {
    bullet: "bg-slate-300",
    time: "text-slate-400",
  },
} as const;

const DeadlineSection: React.FC<DeadlineSectionProps> = ({ deadlines }) => {
  return (
    <section className="deadline-card">
      {/* Header */}
      <div className="deadline-card-header">
        <h3 className="deadline-card-title">
          Upcoming Deadlines
          <span className="deadline-pulse-dot" />
        </h3>
        <button className="deadline-calendar-btn">
          <Calendar size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Timeline */}
      <div className="deadline-timeline">
        <div className="deadline-timeline-line" />

        {deadlines.map((deadline) => {
          const priority = (deadline.priority || "low").toLowerCase() as keyof typeof priorityStyles;
          const styles = priorityStyles[priority] || priorityStyles.low;

          return (
            <div key={deadline.id} className="deadline-item">
              {/* Bullet */}
              <div className={`deadline-bullet ${styles.bullet}`} />

              {/* Content */}
              <div className="deadline-item-content">
                <div className="deadline-item-row">
                  <p className={`text-[10px] sm:text-xs font-extrabold tracking-widest uppercase ${styles.time}`}>
                    {deadline.time}
                  </p>
                  <span className="deadline-tag">{deadline.tag}</span>
                </div>
                <p className="deadline-title">{deadline.title}</p>
                <p className="deadline-id">{deadline.id}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button className="deadline-footer-btn">
        <Clock size={16} className="deadline-footer-icon" />
        <span className="deadline-footer-label">Adjust Timeline</span>
      </button>
    </section>
  );
};

export default DeadlineSection;