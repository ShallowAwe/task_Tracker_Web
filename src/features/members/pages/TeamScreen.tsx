import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHome } from '../../../shared/store/HomeContext';
import { useAuth } from '../../auth/store/AuthContext';
import { memberService } from '../api/memberService';
import MemberRow from '../components/MemberRow';
import InviteMemberModal from '../components/InviteMemberModal';
import ChatDrawer from '../components/ChatDrawer';
import type { TeamMember, MemberRole, InviteMemberPayload } from '../types';
import { 
  UserPlus, Search, RefreshCw, FolderKanban, 
  Sparkles, SlidersHorizontal, ShieldAlert, CheckCircle2 
} from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

const roleLabelMap: Record<MemberRole, string> = {
  OWNER: 'OWNER',
  MAINTAINER: 'MAINTAINER',
  DEVELOPER: 'DEVELOPER',
  TESTER: 'TESTER',
  VIEWER: 'VIEWER',
};

const TeamScreen: React.FC = () => {
  const { homeData } = useHome();
  const { user: authUser } = useAuth();
  
  const projectKey = homeData?.defaultProjectKey;
  const currentProject = homeData?.projects?.find(p => p.key === projectKey);
  const projectId = currentProject?.id;

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  
  // Modals, Chat Drawer & Toasts
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Chat drawer state
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatMemberName, setChatMemberName] = useState('');
  const [chatMemberInitial, setChatMemberInitial] = useState('');
  const [chatAvatarBg, setChatAvatarBg] = useState('');

  // Show Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Fetch Team Members
  const fetchMembers = useCallback(async (showIndicator = true) => {
    if (!projectId) {
      setMembers([]);
      return;
    }
    
    if (showIndicator) setIsLoading(true);
    setError(null);
    
    try {
      const fetched = await memberService.getMembers(projectId);
      setMembers(fetched);
    } catch (err) {
      console.error("Failed to load members:", err);
      setError("Could not load project members. Please check your connection.");
      showToast("Failed to load team members", "error");
    } finally {
      if (showIndicator) setIsLoading(false);
    }
  }, [projectId, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [projectId, fetchMembers]);

  // Determine current user's role in this project
  const currentMember = useMemo(() => {
    return members.find(m => m.userId === authUser?.id);
  }, [members, authUser]);

  const currentUserRole: MemberRole = currentMember?.role || 'DEVELOPER';

  // Handlers
  const handleInvite = async (payload: InviteMemberPayload) => {
    if (!projectId) return;
    try {
      const invited = await memberService.inviteMember(projectId, payload);
      // Refresh list
      await fetchMembers(false);
      showToast(`Successfully invited ${invited.userName} to the project!`);
    } catch (err: any) {
      showToast(err.message || "Failed to invite member", "error");
      throw err;
    }
  };

  const handleUpdateRole = async (memberId: number, newRole: MemberRole) => {
    if (!projectId) return;
    try {
      const updated = await memberService.updateRole(projectId, memberId, newRole);
      // Refresh list
      await fetchMembers(false);
      showToast(`Updated ${updated.userName}'s role to ${newRole}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update member role", "error");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!projectId) return;
    try {
      const target = members.find((m) => m.id === memberId);
      await memberService.removeMember(projectId, memberId);
      // Refresh list
      await fetchMembers(false);
      showToast(`Removed ${target?.userName || 'member'} from the project`);
    } catch (err: any) {
      showToast(err.message || "Failed to remove member", "error");
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchMembers(false);
    // Subtle delay to show premium loading experience
    setTimeout(() => {
      setIsLoading(false);
      showToast("Team list synchronized");
    }, 450);
  };

  // Searching & Filtering logic
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = 
        m.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'All' || m.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const handleChatOpen = (name: string, initial: string, bgClass: string) => {
    setChatMemberName(name);
    setChatMemberInitial(initial);
    setChatAvatarBg(bgClass);
    setChatDrawerOpen(true);
  };

  if (!projectKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center animate-fade-in text-slate-800">
        <div className="bg-slate-100 p-4 rounded-full text-slate-400">
          <FolderKanban size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Project Selected</h2>
        <p className="text-slate-500 max-w-sm text-sm">
          Please select or create a project from the sidebar to manage its team members.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden animate-[fade-in-down_0.4s_ease-out] text-slate-800">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            <span>Projects</span>
            <span>/</span>
            <span className="text-blue-600 font-black">{projectKey}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Team Members
            <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg">
              Viewed as: {roleLabelMap[currentUserRole]}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage who can access this project and what they can do
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Synchronize members"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          {currentUserRole !== 'VIEWER' && (
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 cursor-pointer"
            >
              <UserPlus size={18} />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters, Search & Tools */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm shrink-0">
        
        {/* Search Input */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 w-full sm:w-[320px] transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={16} className="text-slate-400 mr-2.5 shrink-0" />
          <input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Role Filters dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 bg-white text-sm text-slate-600">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-medium outline-none cursor-pointer text-xs"
            >
              <option value="All">All Roles</option>
              <option value="OWNER">Owners</option>
              <option value="MAINTAINER">Maintainers</option>
              <option value="DEVELOPER">Developers</option>
              <option value="TESTER">Testers</option>
              <option value="VIEWER">Viewers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Members Grid/Table Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-150 shadow-sm flex flex-col overflow-hidden min-h-0">
        
        {/* Loading Skeleton */}
        {isLoading && members.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-center justify-between p-5 border-b border-slate-100 animate-pulse">
                <div className="flex items-center gap-4 w-1/3">
                  <div className="w-11 h-11 rounded-xl bg-slate-200" />
                  <div className="space-y-2 w-full">
                    <div className="w-3/4 h-4 bg-slate-200 rounded" />
                    <div className="w-1/2 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-24 h-6 bg-slate-200 rounded-lg" />
                <div className="w-20 h-4 bg-slate-100 rounded hidden md:block" />
                <div className="w-16 h-4 bg-slate-200 rounded" />
                <div className="w-8 h-8 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error && members.length === 0 ? (
          <div className="flex-1 p-8 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-red-600 font-semibold">{error}</p>
            <button 
              onClick={() => fetchMembers()}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-xl border border-red-200 transition-all cursor-pointer"
            >
              Reload Dashboard
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <Sparkles size={32} className="text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No results found</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              We couldn't find any team members matching your search query or filters.
            </p>
          </div>
        ) : (
          /* Members Table (Mockup Style) */
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-left">Member</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-left">Role</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    currentUserRole={currentUserRole}
                    currentUserId={authUser?.id || 0}
                    onUpdateRole={handleUpdateRole}
                    onRemove={handleRemoveMember}
                    onChatOpen={handleChatOpen}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Member Modal Sheet */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        currentUserRole={currentUserRole}
        onInvite={handleInvite}
      />

      {/* Chat Side Panel Drawer */}
      <ChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        memberName={chatMemberName}
        memberInitial={chatMemberInitial}
        avatarBg={chatAvatarBg}
      />

      {/* Dynamic Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold animate-[slide-in-right_0.25s_ease-out] pointer-events-auto bg-white ${
              toast.type === 'error' 
                ? 'border-red-100 text-red-700' 
                : 'border-emerald-100 text-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <ShieldAlert size={14} className="shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
            )}
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamScreen;
