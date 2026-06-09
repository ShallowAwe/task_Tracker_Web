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
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6 h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          Upcoming Deadlines
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
        </h3>
        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Calendar size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Timeline */}
      <div className="relative flex-1 flex flex-col justify-center">
        {deadlines.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl my-auto">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Calendar size={20} />
            </div>
            <p className="text-sm font-bold text-slate-700">No Upcoming Deadlines</p>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-0.5">
              Excellent! There are no critical dates on your schedule.
            </p>
          </div>
        ) : (
          <div className="relative flex-1 space-y-5 sm:space-y-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
            {deadlines.map((deadline) => {
              const priority = (deadline.priority || "low").toLowerCase() as keyof typeof priorityStyles;
              const styles = priorityStyles[priority] || priorityStyles.low;

              return (
                <div key={deadline.id} className="group relative pl-8 cursor-pointer">
                  {/* Bullet */}
                  <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-100 z-10 transition-transform duration-200 group-hover:scale-110 ${styles.bullet}`} />

                  {/* Content */}
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className={`text-[10px] sm:text-xs font-extrabold tracking-widest uppercase ${styles.time}`}>
                        {deadline.time}
                      </p>
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wide whitespace-nowrap">{deadline.tag}</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug transition-colors group-hover:text-blue-600">{deadline.title}</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-1 tracking-wide">{deadline.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <button className="group mt-6 sm:mt-8 w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
        <Clock size={16} className="text-slate-400 transition-colors group-hover:text-slate-600" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-800">Adjust Timeline</span>
      </button>
    </section>
  );
};

export default DeadlineSection;