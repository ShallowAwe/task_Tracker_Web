export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  ticketId: number | string;
}

export interface Ticket {
  id: string; // This corresponds to the ticket key (e.g. "PROJ-1")
  dbId?: number; // Backend numeric ID if needed
  projectKey?: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type?: string;
  assignee: {
    id?: number;
    name: string;
    avatar?: string;
  };
  reporter: string;
  reporterId?: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments?: Comment[];
}

export interface TicketFilters {
  status: TicketStatus | 'All';
  priority: TicketPriority | 'All';
  search: string;
}

export interface CreateIssuePayload {
  projectKey: string;
  title: string;
  description: string;
  typeId: number; // 1: EPIC, 2: STORY, 3: TASK, 4: BUG, 5: SUBTASK
  priority: TicketPriority;
  reporterId: number;
  assigneeId: number | null;
  dueDate?: string; // ISO date-time or date string
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigneeId?: number | null;
  dueDate?: string; // ISO date string "YYYY-MM-DD"
}

export interface ProjectMember {
  id: number;
  projectId: number;
  projectKey: string;
  projectName: string;
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
  userAvatar?: string;
}

