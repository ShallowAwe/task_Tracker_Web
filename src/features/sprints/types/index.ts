export type SprintStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED';

export interface Sprint {
  id: number;
  projectId: number;
  projectName: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  totalTickets: number;
  completedTickets: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintPayload {
  name: string;
  goal?: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;      // "YYYY-MM-DD"
}
