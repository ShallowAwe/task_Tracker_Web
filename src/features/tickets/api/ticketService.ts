import apiClient from '../../../shared/api/apiClient';
import {
  mapStatusFromBackend,
  mapStatusToBackend,
  mapPriorityFromBackend,
  mapPriorityToBackend,
} from '../../../shared/api/adapters';
import type { BackendStatus, BackendPriority } from '../../../shared/api/adapters';
import type {
  Ticket,
  TicketStatus,
  CreateIssuePayload,
  UpdateIssuePayload,
  Comment,
  ProjectMember,
} from '../types';

// ─────────────────────────────────────────────────────────────
// Backend Response Shape Interfaces
// ─────────────────────────────────────────────────────────────

interface BackendIssueResponse {
  id: number;
  projectId: number;
  projectKey: string;
  title: string;
  description: string;
  status: BackendStatus;
  priority: BackendPriority;
  reporterId: number;
  reporterName: string;
  assigneeId: number | null;
  assigneeName: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendCommentResponse {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedTicketsResponse {
  content: BackendIssueResponse[];
}

// ─────────────────────────────────────────────────────────────
// Ticket Adapter
// Converts a raw backend ticket into the Ticket shape used by the UI.
// Also resolves the assignee name/avatar from the project members list.
// ─────────────────────────────────────────────────────────────
const adaptTicket = (
  backend: BackendIssueResponse,
  members: ProjectMember[] = []
): Ticket => {
    const assigneeMember = members.find((m) => m.userId === backend.assigneeId);

    const assigneeName =
      backend.assigneeName ||
      assigneeMember?.userName ||
      (backend.assigneeId ? `User #${backend.assigneeId}` : 'Unassigned');

    const assigneeAvatar =
      assigneeMember?.userAvatar ||
      (backend.assigneeId
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName)}&background=eff6ff&color=1d4ed8`
        : undefined);

    return {
      id: String(backend.id),
      dbId: backend.id,
      projectKey: backend.projectKey,
      title: backend.title,
      description: backend.description || '',
      status: mapStatusFromBackend(backend.status),
      priority: mapPriorityFromBackend(backend.priority),
      assignee: {
        id: backend.assigneeId ?? undefined,
        name: assigneeName,
        avatar: assigneeAvatar,
      },
      reporter: backend.reporterName || `User #${backend.reporterId}`,
      reporterId: backend.reporterId,
      createdAt: backend.createdAt,
      updatedAt: backend.updatedAt,
      dueDate: backend.dueDate ? backend.dueDate.split('T')[0] : undefined,
    };
  };

/** Converts a raw backend comment into the Comment shape used by the UI. */
const adaptComment = (backend: BackendCommentResponse): Comment => {
    return {
      id: backend.id,
      authorId: backend.authorId,
      authorName: backend.authorName,
      content: backend.content,
      createdAt: backend.createdAt,
      updatedAt: backend.updatedAt,
      ticketId: String(backend.ticketId),
    };
  };

// ─────────────────────────────────────────────────────────────
// Payload Transformers
// Transform frontend payloads into the shape the backend expects.
// ─────────────────────────────────────────────────────────────

/** Transforms CreateIssuePayload → backend request body (maps priority enum to uppercase string) */
const mapCreatePayloadToBackend = (payload: CreateIssuePayload) => {
    return {
      title: payload.title,
      description: payload.description,
      priority: mapPriorityToBackend(payload.priority),
      assigneeId: payload.assigneeId ?? null,
      dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : null,
    };
  };

/** Transforms UpdateIssuePayload → backend request body (omits undefined fields) */
const mapUpdatePayloadToBackend = (payload: UpdateIssuePayload) => {
    return {
      title: payload.title,
      description: payload.description,
      priority: payload.priority ? mapPriorityToBackend(payload.priority) : undefined,
      dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : undefined,
    };
  };

// ─────────────────────────────────────────────────────────────
// Ticket Service
// All API calls related to tickets go through this object.
// Each method fetches project members in parallel so that the
// returned Ticket objects always have resolved assignee info.
// ─────────────────────────────────────────────────────────────
export const ticketService = {
  // GET /api/projects/:id/members
  // Fetches all members of a project (used internally to resolve assignee names).
  getProjectMembers: async (projectId: number): Promise<ProjectMember[]> => {
      try {
        const response = await apiClient.get<ProjectMember[]>(`/api/projects/${projectId}/members`);
        return response.data;
      } catch (err) {
        console.error(`Failed to fetch project members for project ${projectId}:`, err);
        return [];
      }
    },

  // GET /api/projects/:id/tickets
  // Returns all tickets for a project, mapped to the frontend Ticket shape.
  getIssuesByProject: async (projectId: number): Promise<Ticket[]> => {
      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.get<PaginatedTicketsResponse>(`/api/projects/${projectId}/tickets`),
      ]);

      const ticketsArray = response.data?.content || [];
      return ticketsArray.map((ticket) => adaptTicket(ticket, members));
    },

  // GET /api/projects/:projectId/tickets/:ticketId
  // Fetches a single ticket by its ID.
  getIssueById: async (projectId: number, ticketId: number | string): Promise<Ticket> => {
      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.get<BackendIssueResponse>(`/api/projects/${projectId}/tickets/${ticketId}`),
      ]);

      return adaptTicket(response.data, members);
    },

  // POST /api/projects/:id/tickets/createTicket
  // Creates a new ticket and returns the created ticket.
  createIssue: async (projectId: number, payload: CreateIssuePayload): Promise<Ticket> => {
      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.post<BackendIssueResponse>(
          `/api/projects/${projectId}/tickets/createTicket`,
          mapCreatePayloadToBackend(payload)
        ),
      ]);

      return adaptTicket(response.data, members);
    },

  // PATCH /api/projects/:projectId/tickets/:ticketId
  // Updates ticket fields (title, description, priority, due date, etc.).
  updateIssue: async (
    projectId: number,
    ticketId: number | string,
    payload: UpdateIssuePayload
  ): Promise<Ticket> => {
      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.patch<BackendIssueResponse>(
          `/api/projects/${projectId}/tickets/${ticketId}`,
          mapUpdatePayloadToBackend(payload)
        ),
      ]);

      return adaptTicket(response.data, members);
    },

  // PATCH /api/projects/:projectId/tickets/:ticketId/status?status=IN_PROGRESS
  // Changes the status of a ticket via a query param (backend requirement).
  updateIssueStatus: async (
    projectId: number,
    ticketId: number | string,
    status: TicketStatus
  ): Promise<Ticket> => {
      const backendStatus = mapStatusToBackend(status);

      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.patch<BackendIssueResponse>(
          `/api/projects/${projectId}/tickets/${ticketId}/status`,
          undefined,
          { params: { status: backendStatus } }
        ),
      ]);

      return adaptTicket(response.data, members);
    },

  // PATCH /api/projects/:projectId/tickets/:ticketId/assign?assigneeId=...
  // Reassigns a ticket to a different user (or unassigns with null).
  updateIssueAssignee: async (
    projectId: number,
    ticketId: number | string,
    assigneeId: number | null
  ): Promise<Ticket> => {
      const [members, response] = await Promise.all([
        ticketService.getProjectMembers(projectId),
        apiClient.patch<BackendIssueResponse>(
          `/api/projects/${projectId}/tickets/${ticketId}/assign`,
          undefined,
          { params: { assigneeId } }
        ),
      ]);

      return adaptTicket(response.data, members);
    },

  // DELETE /api/projects/:projectId/tickets/:ticketId
  // Permanently deletes a ticket.
  deleteIssue: async (projectId: number, ticketId: number | string): Promise<void> => {
      await apiClient.delete(`/api/projects/${projectId}/tickets/${ticketId}`);
    },

  // GET /api/projects/:projectId/tickets/:ticketId/comments
  // Fetches all comments for a ticket.
  getComments: async (projectId: number, ticketId: number | string): Promise<Comment[]> => {
      const response = await apiClient.get<BackendCommentResponse[]>(
        `/api/projects/${projectId}/tickets/${ticketId}/comments`
      );
      return response.data.map(adaptComment);
    },

  // POST /api/projects/:projectId/tickets/:ticketId/comments
  // Posts a new comment on a ticket.
  addComment: async (
    projectId: number,
    ticketId: number | string,
    content: string
  ): Promise<Comment> => {
      const response = await apiClient.post<BackendCommentResponse>(
        `/api/projects/${projectId}/tickets/${ticketId}/comments`,
        { content }
      );
      return adaptComment(response.data);
    },

  // DELETE /api/projects/:projectId/tickets/:ticketId/comments/:commentId
  // Deletes a specific comment from a ticket.
  deleteComment: async (
    projectId: number,
    ticketId: number | string,
    commentId: number
  ): Promise<void> => {
      await apiClient.delete(`/api/projects/${projectId}/tickets/${ticketId}/comments/${commentId}`);
    },
  };

export { mapStatusToBackend, mapStatusFromBackend, mapPriorityToBackend, mapPriorityFromBackend };
