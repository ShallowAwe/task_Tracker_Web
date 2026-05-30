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
    <div className="metric-card">
      {/* Top */}
      <div className="metric-card-top">
        <div className={`metric-card-icon-wrap ${styles.bg}`}>
          <Icon size={22} className={styles.icon} />
        </div>

        {extra && (
          <span className={`metric-card-badge ${styles.badge}`}>{extra}</span>
        )}
      </div>

      {/* Bottom */}
      <div className="metric-card-bottom">
        <div className="metric-card-count-row">
          <h3 className="metric-card-count">{count}</h3>

          {trend && (
            <span className={trend.isUp ? "metric-card-trend-up" : "metric-card-trend-down"}>
              <span className="mr-1">{trend.isUp ? "↑" : "↓"}</span>
              {trend.value}
            </span>
          )}
        </div>

        <p className="metric-card-title">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;