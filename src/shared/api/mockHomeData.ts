import type { HomeResponse } from '../types/home.types';
import { TicketStatus, TicketPriority } from '../../features/dashboard/types/dashboard.types';

// STATE A: User has NO projects
export const MOCK_HOME_STATE_A: HomeResponse = {
  hasProjects: false,
  defaultProjectKey: null
};

// STATE B: User has projects but no selected project yet
export const MOCK_HOME_STATE_B: HomeResponse = {
  hasProjects: true,
  defaultProjectKey: null,
  projects: [
    { id: 1, key: "ABC", name: "Alpha Core" },
    { id: 2, key: "XYZ", name: "Beta Bridge" },
    { id: 3, key: "GAMA", name: "Gamma Gateway" }
  ]
};

// STATE C: User has default project
export const MOCK_HOME_STATE_C: HomeResponse = {
  hasProjects: true,
  defaultProjectKey: "ABC",
  projects: [
    { id: 1, key: "ABC", name: "Alpha Core" },
    { id: 2, key: "XYZ", name: "Beta Bridge" },
    { id: 3, key: "GAMA", name: "Gamma Gateway" }
  ],
  summary: {
    metrics: {
      openIssues: 24,
      dueToday: 3,
      inProgress: 12,
      highPriority: 5
    },
    workflowStats: [
      { id: "resolved", label: "Resolved", count: 42, percentage: 80, variant: "success" },
      { id: "progress", label: "In Progress", count: 12, percentage: 25, variant: "warning" },
      { id: "open", label: "Open", count: 24, percentage: 50, variant: "neutral" },
      { id: "closed", label: "Closed", count: 88, percentage: 100, variant: "danger" },
    ],
    totalCompletion: 68
  },
  myWork: [
    {
      id: "ABC-666",
      title: "URGENT: Database Connection Leak",
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.CRITICAL,
      date: "ASAP",
    },
    {
      id: "ABC-142",
      title: "Design System Audit",
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.HIGH,
      date: "Oct 24, 2023",
    },
    {
      id: "ABC-156",
      title: "Refactor Auth Service",
      status: TicketStatus.OPEN,
      priority: TicketPriority.MEDIUM,
      date: "Oct 28, 2023",
    }
  ],
  deadlines: [
    { title: "Final API Review", id: "ABC-410", tag: "Backend", time: "TODAY", priority: "high" },
    { title: "Onboarding Docs", id: "ABC-382", tag: "Product", time: "TOMORROW", priority: "medium" },
  ],
  activities: [
    {
      id: "act-1",
      user: "Alex Chen",
      action: "updated",
      target: "ABC-123: Secure Tunneling",
      time: "24 minutes ago",
      avatar: "https://i.pravatar.cc/150?u=1",
    }
  ]
};
