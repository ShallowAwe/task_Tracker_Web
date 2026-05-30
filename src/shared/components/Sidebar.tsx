import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, AlertCircle, Clock, Users, Settings, 
  Plus, HelpCircle, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../features/auth/store/AuthContext';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', to: '/dashboard' },
  { icon: AlertCircle, label: 'Issues', to: '/issues' },
  { icon: Clock, label: 'Sprints', to: '/sprints' },
  { icon: Users, label: 'Team', to: '/team' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

import { useHome } from '../store/HomeContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
  const { logout } = useAuth();
  const { homeData, selectProject } = useHome();
  const navigate = useNavigate();

  const currentProject = homeData?.projects?.find(p => p.key === homeData.defaultProjectKey);
  const otherProjects = homeData?.projects?.filter(p => p.key !== homeData.defaultProjectKey) || [];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleProjectSelect = async (key: string) => {
    await selectProject(key);
    setIsProjectSwitcherOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className={`sidebar-header ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!isCollapsed && (
            <span className="sidebar-logo">Horizon Blueprint</span>
          )}
          <button
            onClick={toggleSidebar}
            className={`sidebar-toggle-btn ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="sidebar-body">
          <div className="relative">
            <button 
              onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
              className={`sidebar-workspace w-full hover:bg-slate-800/50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="sidebar-workspace-avatar bg-blue-600 text-white">
                {currentProject?.name.charAt(0) || 'P'}
              </div>
              {!isCollapsed && (
                <div className="text-left truncate flex-1">
                  <h3 className="sidebar-workspace-name">{currentProject?.name || 'Select Project'}</h3>
                  <p className="sidebar-workspace-meta">{currentProject?.key || 'ACTIVE'}</p>
                </div>
              )}
            </button>

            {/* Project Switcher Dropdown */}
            {isProjectSwitcherOpen && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-2 mx-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Project</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {otherProjects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project.key)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {project.key}
                      </div>
                      <span className="truncate">{project.name}</span>
                    </button>
                  ))}
                </div>
                <button className="w-full px-4 py-2.5 text-left text-sm text-blue-500 hover:bg-slate-800 transition-colors border-t border-slate-800 flex items-center space-x-2">
                  <Plus size={14} />
                  <span>New Project</span>
                </button>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                title={isCollapsed ? item.label : ''}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} ${
                    isActive ? 'sidebar-nav-link-active' : 'sidebar-nav-link-idle'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <button
            className={`sidebar-new-project-btn ${isCollapsed ? 'justify-center p-2' : 'space-x-2 px-4 py-2.5'}`}
            title={isCollapsed ? 'New Project' : ''}
          >
            <Plus size={16} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium truncate">New Project</span>}
          </button>
        </div>

        <div className="sidebar-footer mt-auto">
          <NavLink
            to="/support"
            title={isCollapsed ? 'Support' : ''}
            className={({ isActive }) =>
              `sidebar-footer-link ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} ${
                isActive ? 'sidebar-footer-link-active' : 'sidebar-footer-link-idle'
              }`
            }
          >
            <HelpCircle size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Support</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : ''}
            className={`sidebar-signout-btn ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
