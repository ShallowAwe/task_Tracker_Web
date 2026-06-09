
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
    <div className="mx-auto max-w-[1500px] p-4 lg:p-6 xl:p-8 space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <Home size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{projectName}</span>
          </div>
          <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-slate-900">Project Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 w-[220px] xl:w-[260px]">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search project..."
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left content */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <ProgressOverview stats={workflowStats} totalCompletion={totalCompletion} />
          <DeadlineSection deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
}