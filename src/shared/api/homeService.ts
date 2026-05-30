import apiClient from './apiClient';
import type { HomeResponse } from '../types/home.types';

export const homeService = {
  /**
   * Fetches the primary app entry data.
   */
  getHome: async (): Promise<HomeResponse> => {
    const response = await apiClient.get<HomeResponse>('/v1/home');
    return response.data;
  },

  /**
   * Selects a project for the current user.
   */
  selectProject: async (projectKey: string): Promise<void> => {
    await apiClient.post('/v1/projects/select', { projectKey });
  }
};
