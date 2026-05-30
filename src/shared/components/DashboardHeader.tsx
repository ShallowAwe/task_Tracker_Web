import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, LayoutGrid } from 'lucide-react';
import Modal from './Modal';
import ProfilePopup from '../../features/auth/components/ProfilePopup';
import { useAuth } from '../../features/auth/store/AuthContext';

const DashboardHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <button className="dash-header-project-btn">
          <LayoutGrid size={16} className="text-slate-400" />
          <span>Alpha Core Project</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="dash-header-right">
        <div className="dash-header-search-wrap">
          <Search className="dash-header-search-icon" size={16} />
          <input
            type="text"
            placeholder="Search project..."
            className="dash-header-search-input"
          />
        </div>
        <Bell size={20} className="dash-header-icon" />
        <HelpCircle size={20} className="dash-header-icon" />
        <img
          src={user?.avatar || (user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff` : "https://i.pravatar.cc/150?u=4")}
          alt="User"
          className="dash-header-avatar hover:ring-2 hover:ring-indigo-500 transition-all object-cover cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        />
      </div>

      <Modal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        title="My Profile"
      >
        <ProfilePopup />
      </Modal>
    </header>
  );
};

export default DashboardHeader;
