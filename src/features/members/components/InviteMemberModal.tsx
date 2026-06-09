import React, { useState } from 'react';
import Modal from '../../../shared/components/Modal';
import { Mail, User, Shield, AlertCircle } from 'lucide-react';
import type { InviteMemberPayload, MemberRole } from '../types';
import { ROLE_RANKS } from './MemberRow';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: MemberRole;
  onInvite: (payload: InviteMemberPayload) => Promise<void>;
}

const roleLabelMap: Record<MemberRole, string> = {
  OWNER: 'Owner',
  MAINTAINER: 'Maintainer',
  DEVELOPER: 'Developer',
  TESTER: 'Tester',
  VIEWER: 'Viewer',
};

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onInvite,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('DEVELOPER');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserRank = ROLE_RANKS[currentUserRole] || 1;

  // Filter roles strictly below current user's rank
  const inviteableRoles = (Object.keys(ROLE_RANKS) as MemberRole[]).filter(
    (r) => ROLE_RANKS[r] < currentUserRank
  );

  // Fallback to Viewer or Developer if no roles are lower (e.g. if viewer tries to invite somehow)
  const defaultRole = inviteableRoles.length > 0 ? inviteableRoles[0] : 'VIEWER';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite({
        name: name.trim() || undefined,
        email: email.trim(),
        role: role,
      });
      
      // Reset form on success
      setName('');
      setEmail('');
      setRole('DEVELOPER');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-5 text-slate-800">
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-[fade-in_0.2s_ease-out]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
          <div className="relative rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 flex items-center transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <User size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
          <div className="relative rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 flex items-center transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Mail size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="email"
              placeholder="e.g. john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Role Select Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Role</label>
          <div className="relative rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 flex items-center transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Shield size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 cursor-pointer appearance-none"
            >
              {inviteableRoles.map((r) => (
                <option key={r} value={r}>
                  {roleLabelMap[r]} (Rank {ROLE_RANKS[r]})
                </option>
              ))}
              {inviteableRoles.length === 0 && (
                <option value={defaultRole}>{roleLabelMap[defaultRole as MemberRole]}</option>
              )}
            </select>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            *You can only invite members with a project role strictly lower than your own ({roleLabelMap[currentUserRole]}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm text-slate-500 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Inviting...</span>
              </>
            ) : (
              <span>Send Invitation</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteMemberModal;
