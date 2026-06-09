import React from "react";
import type { LucideIcon } from "lucide-react";

export type MetricVariant = "primary" | "success" | "danger" | "warning";

export interface MetricCardProps {
  title: string;
  count: number | string;
  icon: LucideIcon;
  variant?: MetricVariant;
  extra?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

const variantStyles = {
  primary: {
    icon: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  success: {
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  danger: {
    icon: "text-rose-600",
    bg: "bg-rose-50",
    badge: "bg-rose-50 text-rose-600 border border-rose-100",
  },
  warning: {
    icon: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-50 text-amber-600 border border-amber-100",
  },
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  count,
  icon: Icon,
  variant = "primary",
  extra,
  trend,
}) => {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[150px] hover:-translate-y-1">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2 ${styles.bg}`}>
          <Icon size={22} className={styles.icon} />
        </div>

        {extra && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${styles.badge}`}>{extra}</span>
        )}
      </div>

      {/* Bottom */}
      <div className="mt-4">
        <div className="flex items-end gap-2 flex-wrap">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{count}</h3>

          {trend && (
            <span className={trend.isUp ? "text-xs font-bold flex items-center text-emerald-500" : "text-xs font-bold flex items-center text-rose-500"}>
              <span className="mr-1">{trend.isUp ? "↑" : "↓"}</span>
              {trend.value}
            </span>
          )}
        </div>

        <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-slate-600">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;