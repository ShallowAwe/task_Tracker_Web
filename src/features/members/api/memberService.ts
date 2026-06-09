import apiClient from '../../../shared/api/apiClient';
import type { TeamMember, InviteMemberPayload, MemberRole } from '../types';

// In-memory simulation cache to allow UI mutations even if backend endpoints don't fully support POST/PATCH/DELETE yet.
const projectMembersCache = new Map<number, TeamMember[]>();

export const memberService = {
  getMembers: async (projectId: number): Promise<TeamMember[]> => {
    try {
      const response = await apiClient.get<any[]>(`/api/projects/${projectId}/members`);
      
      const mapped: TeamMember[] = (response.data || []).map(m => ({
        id: m.id,
        projectId: m.projectId,
        projectKey: m.projectKey,
        projectName: m.projectName,
        userId: m.userId,
        userName: m.userName,
        userEmail: m.userEmail || `${m.userName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        role: (m.role || 'DEVELOPER').toUpperCase() as MemberRole,
        createdAt: m.createdAt || new Date().toISOString(),
        updatedAt: m.updatedAt || null,
        status: 'Active'
      }));

      // Sync into simulation cache
      projectMembersCache.set(projectId, mapped);
      return mapped;
    } catch (err) {
      console.warn("Failed to fetch project members from backend, falling back to mock cache:", err);
      // Fallback: if cache is empty, seed it with some default members
      if (!projectMembersCache.has(projectId)) {
        projectMembersCache.set(projectId, getMockMembers(projectId));
      }
      return projectMembersCache.get(projectId) || [];
    }
  },

  inviteMember: async (projectId: number, payload: InviteMemberPayload): Promise<TeamMember> => {
    try {
      // Target endpoint: POST /api/projects/{projectId}/members
      const response = await apiClient.post<any>(`/api/projects/${projectId}/members`, payload);
      
      const newMember: TeamMember = {
        id: response.data.id || Math.floor(Math.random() * 1000000),
        projectId: response.data.projectId || projectId,
        projectKey: response.data.projectKey || 'PROJ',
        projectName: response.data.projectName || 'Project',
        userId: response.data.userId || Math.floor(Math.random() * 1000000),
        userName: response.data.userName || payload.name || payload.email.split('@')[0],
        userEmail: response.data.userEmail || payload.email,
        role: (response.data.role || payload.role).toUpperCase() as MemberRole,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: null,
        status: 'Pending'
      };

      // Sync into simulation cache
      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, [...cached, newMember]);
      return newMember;
    } catch (err: any) {
      console.warn("Invite endpoint failed or unsupported, using simulation fallback:", err);
      
      const newMember: TeamMember = {
        id: Math.floor(Math.random() * 1000000),
        projectId: projectId,
        projectKey: 'PROJ',
        projectName: 'Active Project',
        userId: Math.floor(Math.random() * 1000000),
        userName: payload.name || payload.email.split('@')[0],
        userEmail: payload.email,
        role: payload.role,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        status: 'Pending'
      };

      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, [...cached, newMember]);
      return newMember;
    }
  },

  updateRole: async (projectId: number, memberId: number, role: MemberRole): Promise<TeamMember> => {
    try {
      // Target endpoint: PATCH /api/projects/{projectId}/members/${memberId}
      const response = await apiClient.patch<any>(`/api/projects/${projectId}/members/${memberId}`, { role });
      
      const updated: TeamMember = {
        id: response.data.id || memberId,
        projectId: response.data.projectId || projectId,
        projectKey: response.data.projectKey || 'PROJ',
        projectName: response.data.projectName || 'Project',
        userId: response.data.userId || 0,
        userName: response.data.userName || '',
        userEmail: response.data.userEmail || '',
        role: (response.data.role || role).toUpperCase() as MemberRole,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: response.data.status || 'Active'
      };

      // Update cache
      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, cached.map(m => m.id === memberId ? { ...m, role, updatedAt: new Date().toISOString() } : m));
      return updated;
    } catch (err) {
      console.warn("Update role endpoint failed or unsupported, using simulation fallback:", err);
      
      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, cached.map(m => m.id === memberId ? { ...m, role, updatedAt: new Date().toISOString() } : m));
      
      const updated = cached.find(m => m.id === memberId);
      if (!updated) throw new Error("Member not found");
      return { ...updated, role, updatedAt: new Date().toISOString() };
    }
  },

  removeMember: async (projectId: number, memberId: number): Promise<void> => {
    try {
      // Target endpoint: DELETE /api/projects/{projectId}/members/${memberId}
      await apiClient.delete(`/api/projects/${projectId}/members/${memberId}`);
      
      // Update cache
      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, cached.filter(m => m.id !== memberId));
    } catch (err) {
      console.warn("Remove member endpoint failed or unsupported, using simulation fallback:", err);
      
      const cached = projectMembersCache.get(projectId) || [];
      projectMembersCache.set(projectId, cached.filter(m => m.id !== memberId));
    }
  }
};

// Seeding function in case the backend API is fully down or returns empty
function getMockMembers(projectId: number): TeamMember[] {
  return [
    {
      id: 1,
      projectId,
      projectKey: 'PROJ',
      projectName: 'Horizon Blueprint',
      userId: 101,
      userName: 'Sarah Jenkins',
      userEmail: 'sarah.jenkins@horizon.com',
      role: 'OWNER',
      createdAt: '2026-01-10T09:00:00Z',
      updatedAt: null,
      status: 'Active'
    },
    {
      id: 2,
      projectId,
      projectKey: 'PROJ',
      projectName: 'Horizon Blueprint',
      userId: 102,
      userName: 'Alex Rodriguez',
      userEmail: 'alex.rodriguez@horizon.com',
      role: 'MAINTAINER',
      createdAt: '2026-01-12T10:30:00Z',
      updatedAt: null,
      status: 'Active'
    },
    {
      id: 3,
      projectId,
      projectKey: 'PROJ',
      projectName: 'Horizon Blueprint',
      userId: 103,
      userName: 'Elena Rostova',
      userEmail: 'elena.rostova@horizon.com',
      role: 'DEVELOPER',
      createdAt: '2026-02-01T14:15:00Z',
      updatedAt: null,
      status: 'Active'
    },
    {
      id: 4,
      projectId,
      projectKey: 'PROJ',
      projectName: 'Horizon Blueprint',
      userId: 104,
      userName: 'Marcus Chen',
      userEmail: 'marcus.chen@horizon.com',
      role: 'TESTER',
      createdAt: '2026-02-10T11:00:00Z',
      updatedAt: null,
      status: 'Active'
    },
    {
      id: 5,
      projectId,
      projectKey: 'PROJ',
      projectName: 'Horizon Blueprint',
      userId: 105,
      userName: 'Emma Watson',
      userEmail: 'emma.watson@horizon.com',
      role: 'VIEWER',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: null,
      status: 'Active'
    }
  ];
}
