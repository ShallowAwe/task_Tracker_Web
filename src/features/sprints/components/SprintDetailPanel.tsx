import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Target,
  Calendar,
  Ticket,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import type { Sprint } from '../types';
import type { Ticket as TicketType } from '../../tickets/types';
import { sprintService } from '../api/sprintService';
import { ticketService } from '../../tickets/api/ticketService';
import { useAlertStore } from '../../../shared/store/AlertStore';

interface SprintDetailPanelProps {
  sprint: Sprint | null;
  projectId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const SprintDetailPanel: React.FC<SprintDetailPanelProps> = ({
  sprint,
  projectId,
  onClose,
  onUpdate,
}) => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const [allTickets, setAllTickets] = useState<TicketType[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Load project tickets so we can show which are NOT in the sprint
  const loadTickets = useCallback(async () => {
    if (!projectId) return;
    setLoadingTickets(true);
    try {
      const tickets = await ticketService.getIssuesByProject(projectId);
      setAllTickets(tickets);
    } catch {
      // silent — non-critical
    } finally {
      setLoadingTickets(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (sprint) loadTickets();
  }, [sprint, loadTickets]);

  if (!sprint) return null;

  // We don't have a dedicated "sprint tickets" endpoint, so we rely on
  // totalTickets/completedTickets from the sprint response and the full
  // ticket list for the add-ticket picker.
  const backlogTickets = allTickets.filter(
    (t) => t.status === 'Open' || t.status === 'In Progress'
  );

  const handleAddTicket = async (ticketDbId: number) => {
    setActionLoading(ticketDbId);
    try {
      await sprintService.addTicket(projectId, sprint.id, ticketDbId);
      showAlert({
        variant: 'success',
        message: 'Ticket added to sprint.',
      });
      setShowAddDropdown(false);
      onUpdate();
    } catch (err: any) {
      showAlert({
        variant: 'error',
        title: 'Failed to add ticket',
        message: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveTicket = async (ticketDbId: number) => {
    setActionLoading(ticketDbId);
    try {
      await sprintService.removeTicket(projectId, sprint.id, ticketDbId);
      showAlert({
        variant: 'success',
        message: 'Ticket removed from sprint.',
      });
      onUpdate();
    } catch (err: any) {
      showAlert({
        variant: 'error',
        title: 'Failed to remove ticket',
        message: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isEditable = sprint.status !== 'COMPLETED';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {sprint.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                sprint.status === 'ACTIVE'
                  ? 'bg-blue-50 text-blue-700'
                  : sprint.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {sprint.status === 'ACTIVE' && 'Active'}
              {sprint.status === 'COMPLETED' && 'Completed'}
              {sprint.status === 'PLANNING' && 'Planning'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Goal */}
          {sprint.goal && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Goal
              </h4>
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                <Target size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700">{sprint.goal}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Timeline
            </h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar size={15} className="text-slate-400" />
              {formatDate(sprint.startDate)} &mdash; {formatDate(sprint.endDate)}
            </div>
          </div>

          {/* Progress */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Progress
            </h4>
            <div className="flex items-center gap-3">
              <Ticket size={15} className="text-slate-400" />
              <span className="text-sm text-slate-700 font-medium">
                {sprint.completedTickets} / {sprint.totalTickets} tickets completed
              </span>
            </div>
            {sprint.totalTickets > 0 && (
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sprint.completedTickets === sprint.totalTickets
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${Math.round(
                      (sprint.completedTickets / sprint.totalTickets) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Add Ticket */}
          {isEditable && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Manage Tickets
                </h4>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={14} /> Add Ticket
                </button>
              </div>

              {showAddDropdown && (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm max-h-52 overflow-y-auto mb-3">
                  {loadingTickets ? (
                    <div className="p-4 text-center text-slate-400 text-sm">
                      <Loader2 size={16} className="animate-spin mx-auto" />
                    </div>
                  ) : backlogTickets.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">
                      No open tickets available.
                    </div>
                  ) : (
                    backlogTickets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleAddTicket(t.dbId ?? Number(t.id))}
                        disabled={actionLoading === (t.dbId ?? Number(t.id))}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 disabled:opacity-50"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-700 truncate block">
                            {t.title}
                          </span>
                          <span className="text-xs text-slate-400">
                            {t.id} &middot; {t.status} &middot; {t.priority}
                          </span>
                        </div>
                        {actionLoading === (t.dbId ?? Number(t.id)) ? (
                          <Loader2 size={14} className="animate-spin text-blue-500 shrink-0" />
                        ) : (
                          <Plus size={14} className="text-blue-500 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Quick remove hint */}
              {sprint.totalTickets > 0 && (
                <p className="text-xs text-slate-400">
                  To remove a ticket, use the ticket detail panel or the button below.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SprintDetailPanel;
