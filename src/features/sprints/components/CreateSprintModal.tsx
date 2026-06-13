import React, { useState } from 'react';
import Modal from '../../../shared/components/Modal';
import { Calendar, Target, Loader2 } from 'lucide-react';
import type { CreateSprintPayload } from '../types';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateSprintPayload) => Promise<void>;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Sprint name is required.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (!endDate) {
      setError('End date is required.');
      return;
    }
    if (endDate <= startDate) {
      setError('End date must be after the start date.');
      return;
    }
    if (goal.length > 200) {
      setError('Goal must be 200 characters or fewer.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onCreate({
        name: name.trim(),
        goal: goal.trim() || undefined,
        startDate,
        endDate,
      });
      // Reset and close
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create sprint. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Sprint">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="sprintName" className="block text-sm font-semibold text-slate-700">
            Sprint Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Target size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="sprintName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sprint 1"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
            />
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-1.5">
          <label htmlFor="sprintGoal" className="block text-sm font-semibold text-slate-700">
            Goal <span className="text-slate-400 font-normal">(optional, max 200 chars)</span>
          </label>
          <textarea
            id="sprintGoal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What should be accomplished this sprint?"
            disabled={isSubmitting}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm resize-none"
          />
          <p className="text-xs text-slate-400 text-right">{goal.length}/200</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700">
              Start Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="startDate"
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700">
              End Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create Sprint'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSprintModal;
