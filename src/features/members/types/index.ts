export type MemberRole = 'OWNER' | 'MAINTAINER' | 'DEVELOPER' | 'TESTER' | 'VIEWER';

export interface TeamMember {
  id: number; // member relationship ID
  projectId: number;
  projectKey: string;
  projectName: string;
  userId: number;
  userName: string;
  userEmail: string;
  role: MemberRole;
  createdAt: string;
  updatedAt: string | null;
  status?: 'Active' | 'Pending'; // For mock and UI visual representation
}

export interface InviteMemberPayload {
  email: string;
  role: MemberRole;
  name?: string;
}

export interface TeamStats {
  totalCount: number;
  roleCounts: Record<MemberRole, number>;
  activeCount: number;
  pendingCount: number;
}
