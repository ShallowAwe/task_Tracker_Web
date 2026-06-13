import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHome } from '../../../shared/store/HomeContext';
import { ticketService } from '../api/ticketService';
import TicketFilters from '../components/TicketFilters';
import TicketList from '../components/TicketList';
import TicketBoard from '../components/TicketBoard';
import TicketDetailDrawer from '../components/TicketDetailDrawer';
import CreateTicketModal from '../components/CreateTicketModal';

import { Plus, RefreshCw, FolderKanban } from 'lucide-react';
import type { Ticket, ProjectMember, CreateIssuePayload, TicketStatus } from '../types';


function TicketScreen() {
  const { homeData } = useHome();
  const projectKey = homeData?.defaultProjectKey;
  
  // Find current numeric project ID
  const currentProject = homeData?.projects?.find(p => p.key === projectKey);
  const projectId = currentProject?.id;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // View mode persistence in localStorage
  const [viewMode, setViewMode] = useState<'list' | 'board'>(() => {
    const saved = localStorage.getItem('ticketViewMode');
    return (saved === 'list' || saved === 'board') ? saved : 'list';
  });

  const handleViewModeChange = (mode: 'list' | 'board') => {
    setViewMode(mode);
    localStorage.setItem('ticketViewMode', mode);
  };

  // Drag and drop status update with optimistic UI state update
  const handleUpdateTicketStatus = async (ticketId: number | string, newStatus: TicketStatus) => {
    if (!projectId) return;

    // Cache original list to roll back in case of error
    const originalTickets = [...tickets];

    // Optimistically update status in state
    setTickets(prev =>
      prev.map(t => {
        if ((t.dbId || t.id) === ticketId || t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );

    try {
      await ticketService.updateIssueStatus(projectId, ticketId, newStatus);
      // Reload in background to ensure source-of-truth syncing
      const fetchedTickets = await ticketService.getIssuesByProject(projectId);
      setTickets(fetchedTickets);
    } catch (err) {
      console.error('Failed to update ticket status via drag-and-drop:', err);
      setError('Could not update status. Please try again.');
      setTickets(originalTickets);
    }
  };

  // ----------------------------------------------------
  // Fetching Data
  // ----------------------------------------------------
  const loadData = useCallback(async () => {
    if (!projectId || !projectKey) {
      setTickets([]);
      setMembers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTickets, fetchedMembers] = await Promise.all([
        ticketService.getIssuesByProject(projectId),
        ticketService.getProjectMembers(projectId)
      ]);
      setTickets(fetchedTickets);
      setMembers(fetchedMembers);

      // Keep selected ticket in sync if drawer is open
      if (selectedTicket) {
        const updated = fetchedTickets.find(t => t.id === selectedTicket.id);
        if (updated) {
          setSelectedTicket(updated);
        } else {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      console.error('Failed to load project tickets:', err);
      setError('Could not retrieve tickets for this project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, projectKey, selectedTicket]);

  useEffect(() => {
    loadData();
  }, [projectId, projectKey]);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleCreateTicket = async (payload: CreateIssuePayload) => {
    if (!projectId) return;
    await ticketService.createIssue(projectId, payload);
    await loadData();
  };

  const handleRefresh = async () => {
    await loadData();
  };

  // ----------------------------------------------------
  // Filtering Logic
  // ----------------------------------------------------
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.title.toLowerCase().includes(search.toLowerCase()) || 
        ticket.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  // ----------------------------------------------------
  // Render States
  // ----------------------------------------------------
  if (!projectKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center animate-fade-in">
        <div className="bg-slate-100 p-4 rounded-full text-slate-400">
          <FolderKanban size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Project Selected</h2>
        <p className="text-slate-500 max-w-sm text-sm">
          Please select or create a project from the top navigation context to view its issues.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden animate-[fade-in-down_0.4s_ease-out]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and track tasks for project <span className="font-semibold text-blue-600">{projectKey}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh tickets"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <TicketFilters 
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Main List/Board Area with Loading & Error States */}
      {isLoading && tickets.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-4 overflow-y-auto">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="flex flex-col gap-2 p-5 border-b border-slate-100 last:border-0 animate-pulse">
              <div className="flex gap-2 w-1/4 h-4 bg-slate-200 rounded" />
              <div className="w-3/4 h-5 bg-slate-200 rounded" />
              <div className="w-1/2 h-4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex-1 bg-red-50/50 rounded-2xl border border-red-200 p-8 text-center flex flex-col items-center justify-center gap-3">
          <p className="text-red-700 font-semibold">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : viewMode === 'board' ? (
        <TicketBoard
          tickets={filteredTickets}
          onTicketClick={setSelectedTicket}
          onStatusUpdate={handleUpdateTicketStatus}
        />
      ) : (
        <TicketList 
          tickets={filteredTickets} 
          onTicketClick={setSelectedTicket}
        />
      )}

      {/* Ticket Detail Drawer */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailDrawer
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={handleRefresh}
            members={members}
            projectId={projectId || 0}
          />
        )}
      </AnimatePresence>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectKey={projectKey}
        members={members}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}

export default TicketScreen;