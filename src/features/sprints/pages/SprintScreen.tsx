import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHome } from '../../../shared/store/HomeContext';
import { sprintService } from '../api/sprintService';
import { useAlertStore } from '../../../shared/store/AlertStore';
import { useConfirm } from '../../../shared/components/PermissionModal';
import SprintCard from '../components/SprintCard';
import SprintDetailPanel from '../components/SprintDetailPanel';
import CreateSprintModal from '../components/CreateSprintModal';
import type { Sprint, CreateSprintPayload } from '../types';
import {
  Plus,
  RefreshCw,
  Zap,
  FolderKanban,
} from 'lucide-react';

function SprintScreen() {
  const { homeData } = useHome();
  const showAlert = useAlertStore((s) => s.showAlert);
  const confirm = useConfirm();

  const projectKey = homeData?.defaultProjectKey;
  const currentProject = homeData?.projects?.find((p) => p.key === projectKey);
  const projectId = currentProject?.id;

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch ─────────────────────────────────────────
  const loadSprints = useCallback(async () => {
    if (!projectId) {
      setSprints([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await sprintService.getSprints(projectId);
      setSprints(data);

      // Keep selected sprint in sync
      if (selectedSprint) {
        const updated = data.find((s) => s.id === selectedSprint.id);
        setSelectedSprint(updated ?? null);
      }
    } catch (err) {
      console.error('Failed to load sprints:', err);
      setError('Could not load sprints. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, selectedSprint]);

  useEffect(() => {
    loadSprints();
  }, [projectId]);

  // ── Handlers ──────────────────────────────────────
  const handleCreate = async (payload: CreateSprintPayload) => {
    if (!projectId) return;
    await sprintService.createSprint(projectId, payload);
    showAlert({ variant: 'success', message: `Sprint "${payload.name}" created.` });
    await loadSprints();
  };

  const handleStart = async (sprintId: number) => {
    if (!projectId) return;
    const hasActive = sprints.some((s) => s.status === 'ACTIVE');
    if (hasActive) {
      showAlert({
        variant: 'warning',
        title: 'Cannot start sprint',
        message: 'Only one sprint can be active at a time. Complete the current sprint first.',
      });
      return;
    }

    const ok = await confirm({
      title: 'Start Sprint',
      description: 'Once started, the sprint becomes active and tickets can be tracked. Continue?',
      confirmText: 'Start',
    });
    if (!ok) return;

    setActionLoading(true);
    try {
      await sprintService.startSprint(projectId, sprintId);
      showAlert({ variant: 'success', message: 'Sprint started.' });
      await loadSprints();
    } catch (err: any) {
      showAlert({
        variant: 'error',
        title: 'Failed to start sprint',
        message: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (sprintId: number) => {
    if (!projectId) return;

    const ok = await confirm({
      title: 'Complete Sprint',
      description:
        'Completing this sprint will move any incomplete tickets back to the backlog. This action cannot be undone.',
      confirmText: 'Complete',
    });
    if (!ok) return;

    setActionLoading(true);
    try {
      await sprintService.completeSprint(projectId, sprintId);
      showAlert({ variant: 'success', message: 'Sprint completed.' });
      await loadSprints();
    } catch (err: any) {
      showAlert({
        variant: 'error',
        title: 'Failed to complete sprint',
        message: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (sprintId: number) => {
    if (!projectId) return;

    const ok = await confirm({
      title: 'Delete Sprint',
      description: 'Are you sure you want to delete this sprint? This cannot be undone.',
      confirmText: 'Delete',
    });
    if (!ok) return;

    setActionLoading(true);
    try {
      await sprintService.deleteSprint(projectId, sprintId);
      showAlert({ variant: 'success', message: 'Sprint deleted.' });
      if (selectedSprint?.id === sprintId) setSelectedSprint(null);
      await loadSprints();
    } catch (err: any) {
      showAlert({
        variant: 'error',
        title: 'Failed to delete sprint',
        message: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Derived ───────────────────────────────────────
  const activeSprints = sprints.filter((s) => s.status === 'ACTIVE');
  const planningSprints = sprints.filter((s) => s.status === 'PLANNING');
  const completedSprints = sprints.filter((s) => s.status === 'COMPLETED');

  // ── No project guard ──────────────────────────────
  if (!projectKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center animate-fade-in">
        <div className="bg-slate-100 p-4 rounded-full text-slate-400">
          <FolderKanban size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Project Selected</h2>
        <p className="text-slate-500 max-w-sm text-sm">
          Please select or create a project to view its sprints.
        </p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden animate-[fade-in-down_0.4s_ease-out]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sprints</h1>
          <p className="text-slate-500 text-sm mt-1">
            Plan and manage iterations for{' '}
            <span className="font-semibold text-blue-600">{projectKey}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSprints}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh sprints"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Plus size={18} />
            <span>New Sprint</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-4">
        {/* Loading skeleton */}
        {isLoading && sprints.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-4" />
                <div className="h-2 bg-slate-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50/50 rounded-2xl border border-red-200 p-8 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-red-700 font-semibold">{error}</p>
            <button
              onClick={loadSprints}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : sprints.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="bg-blue-50 p-5 rounded-2xl text-blue-400">
              <Zap size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No sprints yet</h2>
            <p className="text-slate-500 max-w-sm text-sm">
              Create your first sprint to start organizing tickets into iterations.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 mt-2 cursor-pointer"
            >
              <Plus size={18} /> Create Sprint
            </button>
          </div>
        ) : (
          <>
            {/* Active */}
            {activeSprints.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Active Sprint
                </h2>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
                >
                  {activeSprints.map((s) => (
                    <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
                      <SprintCard
                        sprint={s}
                        onStart={handleStart}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onClick={setSelectedSprint}
                        disabled={actionLoading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Planning */}
            {planningSprints.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Planning ({planningSprints.length})
                </h2>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
                >
                  {planningSprints.map((s) => (
                    <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
                      <SprintCard
                        sprint={s}
                        onStart={handleStart}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onClick={setSelectedSprint}
                        disabled={actionLoading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Completed */}
            {completedSprints.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Completed ({completedSprints.length})
                </h2>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
                >
                  {completedSprints.map((s) => (
                    <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
                      <SprintCard
                        sprint={s}
                        onStart={handleStart}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onClick={setSelectedSprint}
                        disabled={actionLoading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedSprint && (
          <SprintDetailPanel
            sprint={selectedSprint}
            projectId={projectId!}
            onClose={() => setSelectedSprint(null)}
            onUpdate={loadSprints}
          />
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <CreateSprintModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default SprintScreen;
