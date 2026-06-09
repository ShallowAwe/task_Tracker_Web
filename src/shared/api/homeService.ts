import apiClient from './apiClient';
import type { HomeResponse } from '../types/home.types';

/**
 * Interface representing the actual shape of the payload returned by the backend.
 */
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
 * Formats an ISO string timestamp into a premium relative or absolute date representation.
 */
const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) return 'recently';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'recently';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Safeguard against future times or tiny deviations
    if (diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'recently';
  }
};

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
  const workflowStats = backendWorkflow.map(item => {
    const statusLower = item.status.toLowerCase();
    let variant: 'success' | 'warning' | 'neutral' | 'danger' = 'neutral';
    
    if (statusLower.includes('resolved') || statusLower.includes('done') || statusLower.includes('complete')) {
      variant = 'success';
    } else if (statusLower.includes('progress') || statusLower.includes('active')) {
      variant = 'warning';
    } else if (statusLower.includes('closed')) {
      variant = 'danger';
    }

    return {
      id: item.status.toLowerCase().replace(/\s+/g, '-'),
      label: item.status,
      count: item.count,
      percentage: totalWorkflowCount > 0 ? Math.round((item.count / totalWorkflowCount) * 100) : 0,
      variant,
    };
  });

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
