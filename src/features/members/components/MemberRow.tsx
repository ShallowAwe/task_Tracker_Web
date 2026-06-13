import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, MessageCircle, ChevronDown, Check } from 'lucide-react';
import type { TeamMember, MemberRole } from '../types';

export const ROLE_RANKS: Record<MemberRole, number> = {
  OWNER: 5,
  MAINTAINER: 4,
  DEVELOPER: 3,
  TESTER: 2,
  VIEWER: 1,
};

const roleLabelMap: Record<MemberRole, string> = {
  OWNER: 'OWNER',
  MAINTAINER: 'MAINTAINER',
  DEVELOPER: 'DEVELOPER',
  TESTER: 'TESTER',
  VIEWER: 'VIEWER',
};

const roleColorMap: Record<MemberRole, string> = {
  OWNER: 'text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-100',
  MAINTAINER: 'text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-100',
  DEVELOPER: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100',
  TESTER: 'text-amber-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-100',
  VIEWER: 'text-slate-700 bg-slate-50 hover:bg-slate-150/80 border border-slate-200',
};

interface MemberRowProps {
  member: TeamMember;
  currentUserRole: MemberRole;
  currentUserId: number;
  onUpdateRole: (memberId: number, role: MemberRole) => Promise<void>;
  onRemove: (memberId: number) => Promise<void>;
  onChatOpen: (name: string, initial: string, bgClass: string) => void;
  animationDelay?: number;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  currentUserRole,
  currentUserId,
  onUpdateRole,
  onRemove,
  onChatOpen,
  animationDelay = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const currentUserRank = ROLE_RANKS[currentUserRole] || 1;
  const targetUserRank = ROLE_RANKS[member.role] || 1;
  const isSelf = member.userId === currentUserId;

  // Rule: Can manage only if current user rank is higher than target user's rank. Also cannot manage oneself.
  const canManage = !isSelf && currentUserRank > targetUserRank;

  // Roles available for the current user to assign: must be strictly lower than current user's own rank
  const assignableRoles = (Object.keys(ROLE_RANKS) as MemberRole[]).filter(
    (role) => ROLE_RANKS[role] < currentUserRank
  );

  const handleRoleChange = async (newRole: MemberRole) => {
    setIsMenuOpen(false);
    setIsUpdating(true);
    try {
      await onUpdateRole(member.id, newRole);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveClick = async () => {
    if (window.confirm(`Are you sure you want to remove ${member.userName} from this project?`)) {
      setIsUpdating(true);
      try {
        await onRemove(member.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const initial = member.userName.charAt(0).toUpperCase() || '?';
  
  // Deterministic avatar background class based on userName to look premium
  const getAvatarBgClass = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-cyan-600',
    ];
    return colors[hash % colors.length];
  };

  const avatarBgClass = getAvatarBgClass(member.userName);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, type: 'spring', stiffness: 300, damping: 24 }}
      className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Member Column */}
      <td className="px-6 py-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm ${avatarBgClass}`}>
          {initial}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm truncate">{member.userName}</span>
            {isSelf && (
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 rounded">
                You
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 block truncate mt-0.5">{member.userEmail}</span>
        </div>
      </td>

      {/* Role Column */}
      <td className="px-6 py-4">
        {canManage && assignableRoles.length > 0 ? (
          <div className="relative inline-block text-left" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer uppercase ${roleColorMap[member.role]}`}
            >
              <span>{roleLabelMap[member.role]}</span>
              <ChevronDown size={14} className="opacity-80" />
            </button>

            {/* Dropdown Menu Sheet */}
            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl p-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-0.5">
                  {assignableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                        member.role === role 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-850'
                      }`}
                    >
                      <span>{roleLabelMap[role]}</span>
                      {member.role === role && <Check size={12} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className={`px-2.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide inline-block ${roleColorMap[member.role]}`}>
            {roleLabelMap[member.role]}
          </span>
        )}
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2.5">
          {/* Chat bubble button */}
          <button
            onClick={() => onChatOpen(member.userName, initial, avatarBgClass)}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title={`Chat with ${member.userName}`}
          >
            <MessageCircle size={18} />
          </button>

          {/* Delete action */}
          {canManage ? (
            <button
              onClick={handleRemoveClick}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer active:scale-95"
              title={`Remove ${member.userName}`}
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div className="w-9 h-9" /> // placeholder
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default MemberRow;
