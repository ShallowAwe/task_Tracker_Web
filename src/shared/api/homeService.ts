import apiClient from './apiClient';
import { formatRelativeTime, resolveWorkflowVariant } from './adapters';
import type { HomeResponse } from '../types/home.types';

interface BackendHomeResponse {
  hasProjects: boolean;
  defaultProjectKey: string | null;
  projects: Array<{ id: number; key: string; name: string }> | null;
  summary: {
    project: {
      name: string;
      status: string;
      progress: number;
      activeSprint: string | null;
    } | null;
    stats: Array<{
      label: string;
      value: number;
      trend?: string;
      trendUp?: boolean;
      type: 'OPEN' | 'DUE_TODAY' | 'IN_PROGRESS' | 'HIGH_PRIORITY';
    }> | null;
    workflow: Array<{
      status: string;
      count: number;
    }> | null;
    metrics: {
      totalTickets: number;
      overdueTickets: number;
      unassignedTickets: number;
      teamMembers: number;
      completionRate: number;
      activeSprint: string | null;
    } | null;
  } | null;
  myWork: any[] | null;
  activities: Array<{
    id: number | string;
    user: {
      name: string;
      avatar: string | null;
    };
    action: string;
    target: string;
    to?: string;
    timestamp: string;
  }> | null;
  deadlines: any[] | null;
}

/**
 * Adapter mapping actual backend response schema to expected frontend HomeResponse schema.
 */
const adaptHomeResponse = (backend: BackendHomeResponse): HomeResponse => {
  const summaryProject = backend.summary?.project;
  const backendStats = backend.summary?.stats || [];
  const backendWorkflow = backend.summary?.workflow || [];
  const backendMetrics = backend.summary?.metrics;

  // 1. Map Stats list to Metrics object
  const openIssues = backendStats.find(s => s.type === 'OPEN')?.value ?? 0;
  const dueToday = backendStats.find(s => s.type === 'DUE_TODAY')?.value ?? 0;
  const inProgress = backendStats.find(s => s.type === 'IN_PROGRESS')?.value ?? 0;
  const highPriority = backendStats.find(s => s.type === 'HIGH_PRIORITY')?.value ?? 0;

  // 2. Map Workflow stats & calculate dynamic completion percentage per column
  const totalWorkflowCount = backendWorkflow.reduce((sum, item) => sum + item.count, 0);
  const workflowStats = backendWorkflow.map(item => ({
    id: item.status.toLowerCase().replace(/\s+/g, '-'),
    label: item.status,
    count: item.count,
    percentage: totalWorkflowCount > 0 ? Math.round((item.count / totalWorkflowCount) * 100) : 0,
    variant: resolveWorkflowVariant(item.status),
  }));

  // 3. Map Completion rate
  const totalCompletion = backendMetrics?.completionRate ?? summaryProject?.progress ?? 0;

  // 4. Map Activities list, enriching labels and resolving missing avatars safely
  const activities = (backend.activities || []).map(act => {
    const enrichedTarget = act.to ? `${act.target}: ${act.to}` : act.target;

    return {
      id: String(act.id),
      user: {
        name: act.user.name,
        avatar: act.user.avatar || '',
      },
      action: act.action,
      target: enrichedTarget,
      time: formatRelativeTime(act.timestamp),
      avatar: act.user.avatar || '',
    };
  });

  // 5. Map myWork (tasks assigned to user) safely with fallbacks
  const myWork = (backend.myWork || []).map(task => {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      date: task.date || task.dueDate || 'ASAP',
    };
  });

  // 6. Map deadlines safely with fallbacks
  const deadlines = (backend.deadlines || []).map(d => {
    return {
      id: d.id,
      title: d.title,
      tag: d.tag || d.category || 'Task',
      time: d.time || d.dueDate || 'ASAP',
      priority: d.priority || 'low',
    };
  });

  return {
    hasProjects: backend.hasProjects,
    defaultProjectKey: backend.defaultProjectKey,
    projects: backend.projects,
    summary: {
      metrics: {
        openIssues,
        dueToday,
        inProgress,
        highPriority,
      },
      workflowStats,
      totalCompletion,
    },
    myWork,
    activities,
    deadlines,
  };
};

export const homeService = {
  /**
   * Fetches the primary app entry data and adapts it dynamically to match frontend models.
   */
  getHome: async (): Promise<HomeResponse> => {
    const response = await apiClient.get<BackendHomeResponse>('/api/home');
    return adaptHomeResponse(response.data);
  },

  /**
   * Selects a project active context for the current user.
   */
  selectProject: async (projectKey: string): Promise<void> => {
    await apiClient.post('/api/projects/select', { projectKey });
  }
};
