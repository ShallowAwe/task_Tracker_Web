import type { TicketStatus, TicketPriority } from '../../features/tickets/types';

// ─────────────────────────────────────────────────────────────
// Backend Enum Types
// Canonical uppercase strings used by the backend API.
// ─────────────────────────────────────────────────────────────

export type BackendStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type BackendPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ─────────────────────────────────────────────────────────────
// Status Mappers
// ─────────────────────────────────────────────────────────────

const STATUS_FROM_BACKEND: Record<BackendStatus, TicketStatus> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const STATUS_TO_BACKEND: Record<TicketStatus, BackendStatus> = {
  'Open': 'OPEN',
  'In Progress': 'IN_PROGRESS',
  'Resolved': 'RESOLVED',
  'Closed': 'CLOSED',
};

export const mapStatusFromBackend = (status: string): TicketStatus =>
  STATUS_FROM_BACKEND[status.toUpperCase() as BackendStatus] ?? 'Open';

export const mapStatusToBackend = (status: TicketStatus): BackendStatus =>
  STATUS_TO_BACKEND[status] ?? 'OPEN';

// ─────────────────────────────────────────────────────────────
// Priority Mappers
// ─────────────────────────────────────────────────────────────

const PRIORITY_FROM_BACKEND: Record<BackendPriority, TicketPriority> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

const PRIORITY_TO_BACKEND: Record<TicketPriority, BackendPriority> = {
  'Low': 'LOW',
  'Medium': 'MEDIUM',
  'High': 'HIGH',
  'Critical': 'CRITICAL',
};

export const mapPriorityFromBackend = (priority: string): TicketPriority =>
  PRIORITY_FROM_BACKEND[priority.toUpperCase() as BackendPriority] ?? 'Medium';

export const mapPriorityToBackend = (priority: TicketPriority): BackendPriority =>
  PRIORITY_TO_BACKEND[priority] ?? 'MEDIUM';

// ─────────────────────────────────────────────────────────────
// Relative Time Formatter
// ─────────────────────────────────────────────────────────────

export const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) return 'recently';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'recently';
  }
};

// ─────────────────────────────────────────────────────────────
// Workflow Variant Resolver
// ─────────────────────────────────────────────────────────────

export const resolveWorkflowVariant = (status: string): 'success' | 'warning' | 'neutral' | 'danger' => {
  const lower = status.toLowerCase();
  if (lower.includes('resolved') || lower.includes('done') || lower.includes('complete')) return 'success';
  if (lower.includes('progress') || lower.includes('active')) return 'warning';
  if (lower.includes('closed')) return 'danger';
  return 'neutral';
};
