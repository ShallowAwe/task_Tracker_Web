import React, { useState } from 'react';
import Modal from '../../../shared/components/Modal';
import type { CreateIssuePayload, ProjectMember, TicketPriority } from '../types';
import { useAuth } from '../../auth/store/AuthContext';
import { Calendar, User, FileText, AlertCircle } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectKey: string;
  members: ProjectMember[];
  onCreate: (payload: CreateIssuePayload) => Promise<void>;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  projectKey,
  members,
  onCreate,
}) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [typeId, setTypeId] = useState(3); // Default to TASK (3)
  const [priority, setPriority] = useState<TicketPriority>('Medium'); // Default to MEDIUM
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please provide a summary for the ticket.');
      return;
    }
    if (!user) {
      setError('You must be logged in to create a ticket.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload: CreateIssuePayload = {
        projectKey,
        title: summary.trim(),
        description: description.trim(),
        typeId,
        priority,
        reporterId: user.id,
        assigneeId,
        dueDate: dueDate ? `${dueDate}T00:00:00` : undefined,
      };

      await onCreate(payload);
      
      // Reset form
      setSummary('');
      setDescription('');
      setTypeId(3);
      setPriority('Medium');
      setAssigneeId(null);
      setDueDate('');
      onClose();
    } catch (err: any) {
      console.error('Failed to create ticket:', err);
      setError(err?.response?.data?.message || 'Failed to create the ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Ticket">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Summary *</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="e.g. Build login screen"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Description</label>
          <textarea
            placeholder="Describe the task or issue details..."
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Type</label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={typeId}
              onChange={(e) => setTypeId(Number(e.target.value))}
              disabled={isSubmitting}
            >
              <option value={3}>Task</option>
              <option value={4}>Bug</option>
              <option value={2}>User Story</option>
              <option value={1}>Epic</option>
              <option value={5}>Subtask</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Priority</label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Assignee</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                value={assigneeId || ''}
                onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : null)}
                disabled={isSubmitting}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Due Date</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                type="date"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>Create Ticket</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
