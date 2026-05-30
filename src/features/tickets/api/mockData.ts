import type { Ticket } from '../types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Auth login session timeout bug',
    description: 'Users are being logged out unexpectedly after 5 minutes of inactivity.',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    reporter: 'Admin',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-02T14:30:00Z',
    dueDate: '2026-05-10T17:00:00Z',
    comments: [
      {
        id: 1,
        authorId: 1,
        authorName: "Bruce Wayne",
        content: "I already have 14 contingency plans for this. Also, I'm Batman.",
        createdAt: "2026-05-06T21:00:56.729427",
        ticketId: "TKT-001",
        updatedAt: "2026-05-06T21:00:56.729427"
      }
    ]
  },
  {
    id: 'TKT-002',
    title: 'Implement dashboard charts',
    description: 'Add line charts to show weekly activity on the main dashboard.',
    status: 'Open',
    priority: 'Medium',
    assignee: {
      name: 'Me',
      avatar: 'https://i.pravatar.cc/150?u=me'
    },
    reporter: 'Manager',
    createdAt: '2026-05-03T09:15:00Z',
    updatedAt: '2026-05-03T09:15:00Z',
    comments: []
  },
  {
    id: 'TKT-003',
    title: 'Database migration failure',
    description: 'The latest migration script failed on production staging environment.',
    status: 'Closed',
    priority: 'Critical',
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=john'
    },
    reporter: 'DevOps',
    createdAt: '2026-04-28T22:10:00Z',
    updatedAt: '2026-04-30T11:00:00Z'
  },
  {
    id: 'TKT-004',
    title: 'Update privacy policy',
    description: 'Legal team requested updates to the privacy policy page.',
    status: 'Resolved',
    priority: 'Low',
    assignee: {
      name: 'Emily Chen',
      avatar: 'https://i.pravatar.cc/150?u=emily'
    },
    reporter: 'Legal',
    createdAt: '2026-04-25T14:00:00Z',
    updatedAt: '2026-05-04T16:45:00Z'
  },
  {
    id: 'TKT-005',
    title: 'API endpoint optimization',
    description: 'The /tickets/list endpoint is slow when fetching many records.',
    status: 'Open',
    priority: 'High',
    assignee: {
      name: 'Unassigned',
    },
    reporter: 'QA',
    createdAt: '2026-05-05T08:30:00Z',
    updatedAt: '2026-05-05T08:30:00Z',
    dueDate: '2026-05-15T12:00:00Z'
  }
];
