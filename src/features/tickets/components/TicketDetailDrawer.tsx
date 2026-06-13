import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock, AlertTriangle, CheckCircle, MessageSquare, Send, Trash2 } from 'lucide-react';
import type { Ticket, Comment, ProjectMember, TicketStatus, TicketPriority } from '../types';
import { ticketService } from '../api/ticketService';
import { useAuth } from '../../auth/store/AuthContext';
import { useConfirm } from '../../../shared/components/PermissionModal'; // adjust path

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdate: () => void;
  members: ProjectMember[];
  projectId: number;
}

const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ 
  ticket, 
  onClose, 
  onUpdate,
  members,
  projectId
}) => {
  const { user } = useAuth();
  const confirm = useConfirm();
  const [isVisible, setIsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Local mirror of status so we can force the select back on cancel
  const [statusValue, setStatusValue] = useState<TicketStatus | ''>('');

  const ticketId = ticket ? (ticket.dbId || ticket.id) : '';

  useEffect(() => {
    if (ticket) {
      setIsVisible(true);
      setStatusValue(ticket.status);
      document.body.style.overflow = 'hidden';
      fetchComments();
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      setComments([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [ticket]);

  const fetchComments = async () => {
    if (!ticket || !projectId) return;
    try {
      const fetched = await ticketService.getComments(projectId, ticketId);
      setComments(fetched);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  // Render nothing when no ticket — AnimatePresence handles exit animation
  if (!ticket) return null;

  // ----------------------------------------------------
  // Inline Updates (Project-centric routes)
  // ----------------------------------------------------
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === ticket.status) return;

    // Optimistically reflect selection in the dropdown
    setStatusValue(newStatus);

    const ok = await confirm({
      title: 'Change status?',
      description: `Move ticket ${ticket.id} from "${ticket.status}" to "${newStatus}"?`,
      confirmText: 'Change',
      cancelText: 'Cancel',
    });

    if (!ok) {
      setStatusValue(ticket.status); // force select back
      return;
    }

    setIsUpdating(true);
    try {
      await ticketService.updateIssueStatus(projectId, ticketId, newStatus);
      onUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
      setStatusValue(ticket.status); // revert on failure too
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    setIsUpdating(true);
    try {
      await ticketService.updateIssue(projectId, ticketId, {
        priority: newPriority
      });
      onUpdate();
    } catch (err) {
      console.error('Failed to update priority:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssigneeChange = async (newAssigneeId: number | null) => {
    setIsUpdating(true);
    try {
      await ticketService.updateIssueAssignee(projectId, ticketId, newAssigneeId);
      onUpdate();
    } catch (err) {
      console.error('Failed to update assignee:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // ----------------------------------------------------
  // Comment Actions
  // ----------------------------------------------------
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !projectId) return;

    setIsSubmittingComment(true);
    try {
      await ticketService.addComment(projectId, ticketId, newComment.trim());
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user || !projectId) return;

    const ok = await confirm({
      title: 'Delete comment?',
      description: 'Are you sure you want to delete this comment?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!ok) return;

    try {
      await ticketService.deleteComment(projectId, ticketId, commentId);
      await fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  // ----------------------------------------------------
  // Ticket Deletion
  // ----------------------------------------------------
  const handleDeleteTicket = async () => {
    const ok = await confirm({
      title: `Delete ticket ${ticket.id}?`,
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!ok) return;

    setIsDeleting(true);
    try {
      await ticketService.deleteIssue(projectId, ticketId);
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      alert('Failed to delete this ticket. Please check your permissions.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="text-red-600 font-bold animate-pulse" size={18} />;
      case 'High': return <AlertTriangle className="text-orange-500" size={18} />;
      case 'Medium': return <Clock className="text-blue-500" size={18} />;
      case 'Low': return <CheckCircle className="text-slate-400" size={18} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
              {ticket.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
            {isUpdating && (
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
            {ticket.title}
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignee</label>
                <div className="flex items-center gap-2 mt-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100">
                  <select
                    className="w-full bg-transparent p-1 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                    value={ticket.assignee.id || ''}
                    onChange={(e) => handleAssigneeChange(e.target.value ? Number(e.target.value) : null)}
                    disabled={isUpdating}
                  >
                    <option value="">Unassigned</option>
                    {members.map(member => (
                      <option key={member.userId} value={member.userId}>
                        {member.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Priority</label>
                <div className="flex items-center gap-2 mt-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="pl-2">{getPriorityIcon(ticket.priority)}</span>
                  <select
                    className="w-full bg-transparent p-1 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                    disabled={isUpdating}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</label>
                <div className="flex items-center gap-2 mt-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100">
                  <select
                    className="w-full bg-transparent p-1 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                    value={statusValue}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    disabled={isUpdating}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Created At</label>
                <div className="flex items-center gap-2 mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700">
                  <Clock size={16} className="text-slate-400" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Description</label>
            <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed text-sm">
              {ticket.description || <span className="text-slate-400 italic">No description provided.</span>}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900">Comments</h3>
              <span className="ml-auto bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {comments.length}
              </span>
            </div>

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1 border border-slate-200">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800">{comment.authorName}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                          {user && user.id === comment.authorId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                              title="Delete comment"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 text-sm">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Add Comment & Delete Ticket */}
        <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-4">
          <form onSubmit={handlePostComment} className="relative">
            <input 
              type="text" 
              placeholder="Write a comment..."
              className="w-full pl-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmittingComment}
            />
            <div className="absolute right-2 top-1.5 flex items-center">
              <button 
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all shadow-md shadow-blue-100 cursor-pointer"
              >
                {isSubmittingComment ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              * Assignee, Priority, and Status edits save automatically.
            </span>
            <button
              onClick={handleDeleteTicket}
              disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-all px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>Delete Ticket</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TicketDetailDrawer;