
import {
  AlertCircle,
  Calendar as CalendarIcon,
  RefreshCw,
  AlertTriangle,
  Home,
  Search,
} from "lucide-react";

import MetricCard, { type MetricCardProps } from "../components/MetricCard";
import TasksTable from "../components/TasksTable";
import ProgressOverview from "../components/ProgressOverview";
import ActivityFeed from "../components/ActivityFeed";
import DeadlineSection from "../components/DeadlineSection";



import { useHome } from "../../../shared/store/HomeContext";

type MetricEntry = MetricCardProps & { id: string };

export default function DashboardOverview() {
  const { homeData } = useHome();
  const summary = homeData?.summary;
  
  const myWork = homeData?.myWork || [];
  const activities = homeData?.activities || [];
  const deadlines = homeData?.deadlines || [];
  const workflowStats = summary?.workflowStats || [];
  const totalCompletion = summary?.totalCompletion || 0;
  
  const currentProject = homeData?.projects?.find(p => p.key === homeData.defaultProjectKey);
  const projectName = currentProject?.name || "Project Overview";

  const metrics: MetricEntry[] = [
    {
      id: "open",
      title: "Open Issues",
      count: summary?.metrics?.openIssues ?? 0,
      icon: AlertCircle,
      variant: "primary",
      extra: "+2 new",
      trend: { value: "12%", isUp: true },
    },
    {
      id: "due",
      title: "Due Today",
      count: summary?.metrics?.dueToday ?? 0,
      icon: CalendarIcon,
      variant: "danger",
      extra: "critical",
    },
    {
      id: "progress",
      title: "In Progress",
      count: summary?.metrics?.inProgress ?? 0,
      icon: RefreshCw,
      variant: "success",
      trend: { value: "5%", isUp: true },
    },
    {
      id: "priority",
      title: "High Priority",
      count: summary?.metrics?.highPriority ?? 0,
      icon: AlertTriangle,
      variant: "warning",
    },
  ];

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <div className="dash-page-breadcrumb">
            <Home size={14} />
            <span className="dash-page-breadcrumb-label">{projectName}</span>
          </div>
          <h1 className="dash-page-title">Project Overview</h1>
        </div>

        <div className="dash-page-actions">
          <div className="dash-page-search-wrap">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search project..."
              className="dash-page-search-input"
            />
          </div>
          <button className="dash-page-health-badge">Health: On Track</button>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Left content */}
        <div className="dash-grid-left">
          {/* Metrics */}
          <div className="dash-metrics-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} {...metric} />
            ))}
          </div>

          {/* Table */}
          <TasksTable tasks={myWork} />

          {/* Activity */}
          <ActivityFeed activities={activities} />
        </div>

        {/* Right rail */}
        <div className="dash-grid-right">
          <ProgressOverview stats={workflowStats} totalCompletion={totalCompletion} />
          <DeadlineSection deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
}