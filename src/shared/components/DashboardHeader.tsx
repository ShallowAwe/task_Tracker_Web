import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, LayoutGrid } from 'lucide-react';
import Modal from './Modal';
import ProfilePopup from '../../features/auth/components/ProfilePopup';
import { useAuth } from '../../features/auth/store/AuthContext';

import { useHome } from '../store/HomeContext';

const DashboardHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const { homeData } = useHome();

  const currentProject = homeData?.projects?.find(p => p.key === homeData.defaultProjectKey);
  const projectName = currentProject?.name || "Select Project";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <LayoutGrid size={16} className="text-slate-400" />
          <span>{projectName}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search project..."
            className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-64"
          />
        </div>
        <Bell size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
        <HelpCircle size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
        <img
          src={user?.avatar || (user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff` : "https://i.pravatar.cc/150?u=4")}
          alt="User"
          className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all object-cover"
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
