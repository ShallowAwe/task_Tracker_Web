import type { Task, ActivityItem, Deadline, WorkflowStat } from '../../features/dashboard/types/dashboard.types';

export interface ProjectSummary {
  id: number;
  key: string;
  name: string;
}

export interface DashboardSummary {
  metrics: {
    openIssues: number;
    dueToday: number;
    inProgress: number;
    highPriority: number;
  };
  workflowStats: WorkflowStat[];
  totalCompletion: number;
}

export interface HomeResponse {
  hasProjects: boolean;
  defaultProjectKey: string | null;
  projects?: ProjectSummary[] | null;
  summary?: DashboardSummary | null;
  myWork?: Task[] | null;
  activities?: ActivityItem[] | null;
  deadlines?: Deadline[] | null;
}

export interface SelectProjectRequest {
  projectKey: string;
}
