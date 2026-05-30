import { useState, useMemo } from 'react';

import TicketFilters from '../components/TicketFilters';
import TicketList from '../components/TicketList';
import TicketDetailDrawer from '../components/TicketDetailDrawer';
import { MOCK_TICKETS } from '../api/mockData';
import { Plus } from 'lucide-react';
import type { Ticket } from '../types';

function TicketScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) || 
                           ticket.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="ticket-page">
      {/* Top Bar */}
      <div className="ticket-topbar">
        <div>
          <h1 className="ticket-page-title">Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your project tasks</p>
        </div>
        <button className="ticket-create-btn">
          <Plus size={18} />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* 
      // Stats Summary
      <TicketStats tickets={MOCK_TICKETS} /> 
      */}

      {/* Filters & Search */}
      <TicketFilters 
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Ticket List */}
      <TicketList 
        tickets={filteredTickets} 
        onTicketClick={setSelectedTicket}
      />

      {/* Ticket Detail Drawer */}
      <TicketDetailDrawer 
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}

export default TicketScreen;