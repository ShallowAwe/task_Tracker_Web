import type { LucideIcon } from 'lucide-react';

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export type TicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

export interface Task {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
}

export interface Metric {
  title: string;
  count: number | string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  extra?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export interface ActivityItem {
  id: string;
  user: string | { name: string; avatar: string };
  action: string;
  target: string;
  time: string;
  avatar: string;
  badge?: string;
}

export interface Deadline {
  id: string;
  title: string;
  tag: string;
  time: string;
  priority?: "high" | "medium" | "low";
}

export interface WorkflowStat {
  id: string;
  label: string;
  count: number;
  percentage: number;
  variant?: "success" | "warning" | "danger" | "neutral";
}
