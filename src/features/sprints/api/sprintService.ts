import apiClient from '../../../shared/api/apiClient';
import type { Sprint, CreateSprintPayload } from '../types';

export const sprintService = {
  getSprints: async (projectId: number): Promise<Sprint[]> => {
    const response = await apiClient.get<Sprint[]>(
      `/api/projects/${projectId}/sprints`
    );
    return response.data;
  },

  getSprint: async (projectId: number, sprintId: number): Promise<Sprint> => {
    const response = await apiClient.get<Sprint>(
      `/api/projects/${projectId}/sprints/${sprintId}`
    );
    return response.data;
  },

  createSprint: async (projectId: number, payload: CreateSprintPayload): Promise<Sprint> => {
    const response = await apiClient.post<Sprint>(
      `/api/projects/${projectId}/sprints`,
      payload
    );
    return response.data;
  },

  startSprint: async (projectId: number, sprintId: number): Promise<Sprint> => {
    const response = await apiClient.patch<Sprint>(
      `/api/projects/${projectId}/sprints/${sprintId}/start`
    );
    return response.data;
  },

  completeSprint: async (projectId: number, sprintId: number): Promise<Sprint> => {
    const response = await apiClient.patch<Sprint>(
      `/api/projects/${projectId}/sprints/${sprintId}/complete`
    );
    return response.data;
  },

  addTicket: async (projectId: number, sprintId: number, ticketId: number): Promise<void> => {
    await apiClient.put(
      `/api/projects/${projectId}/sprints/${sprintId}/tickets/${ticketId}`
    );
  },

  removeTicket: async (projectId: number, sprintId: number, ticketId: number): Promise<void> => {
    await apiClient.delete(
      `/api/projects/${projectId}/sprints/${sprintId}/tickets/${ticketId}`
    );
  },

  deleteSprint: async (projectId: number, sprintId: number): Promise<void> => {
    await apiClient.delete(
      `/api/projects/${projectId}/sprints/${sprintId}`
    );
  },
};
