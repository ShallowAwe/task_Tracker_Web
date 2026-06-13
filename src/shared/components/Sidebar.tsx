import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <aside className={`bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className={`h-16 flex items-center border-b border-slate-100 transition-all ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!isCollapsed && (
            <span className="text-xl font-bold text-slate-800 tracking-tight truncate">Horizon Blueprint</span>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="p-4 overflow-hidden">
          <div className="relative">
            <button 
              onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
              className={`flex items-center space-x-3 mb-6 p-2 transition-all w-full hover:bg-slate-800/50 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {currentProject?.name.charAt(0) || 'P'}
              </div>
              {!isCollapsed && (
                <div className="text-left truncate flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{currentProject?.name || 'Select Project'}</h3>
                  <p className="text-xs text-slate-400 truncate">{currentProject?.key || 'ACTIVE'}</p>
                </div>
              )}
            </button>

            {/* Project Switcher Dropdown */}
            <AnimatePresence>
            {isProjectSwitcherOpen && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-full left-0 right-0 mt-2 mx-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
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
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              >
                <NavLink
                  to={item.to}
                  title={isCollapsed ? item.label : ''}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg text-sm font-medium transition-all ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <button
            className={`w-full mt-6 flex items-center bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all overflow-hidden ${isCollapsed ? 'justify-center p-2' : 'space-x-2 px-4 py-2.5'}`}
            title={isCollapsed ? 'New Project' : ''}
          >
            <Plus size={16} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium truncate">New Project</span>}
          </button>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-1 overflow-hidden mt-auto">
          <NavLink
            to="/support"
            title={isCollapsed ? 'Support' : ''}
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-all ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'} ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <HelpCircle size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Support</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : ''}
            className={`w-full flex items-center rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'}`}
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
