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
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: {
    name: string;
    avatar?: string;
  };
  reporter: string;
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
