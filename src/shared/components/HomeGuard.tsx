import React from 'react';
import { Outlet } from 'react-router-dom';
import { useHome } from '../store/HomeContext';
import { useAuth } from '../../features/auth/store/AuthContext';
import { LogOut } from 'lucide-react';
import OnboardingScreen from '../../features/projects/pages/OnboardingScreen';
import ProjectSelectionScreen from '../../features/projects/pages/ProjectSelectionScreen';

const HomeGuard: React.FC = () => {
  const { homeData, isLoading, error } = useHome();
  const { logout } = useAuth();

  if (isLoading && !homeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Synchronizing workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
            <button 
              onClick={logout}
              className="w-full px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!homeData) return null;

  // STATE A: No projects
  if (!homeData.hasProjects) {
    return <OnboardingScreen />;
  }

  // STATE B: Has projects, none selected
  if (homeData.hasProjects && !homeData.defaultProjectKey) {
    return <ProjectSelectionScreen />;
  }

  // STATE C: Has default project
  return <Outlet />;
};

export default HomeGuard;
