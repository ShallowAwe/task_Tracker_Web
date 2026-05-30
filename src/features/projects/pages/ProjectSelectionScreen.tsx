import { useHome } from '../../../shared/store/HomeContext';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { ArrowRight, Box, LayoutGrid, LogOut } from 'lucide-react';

const ProjectSelectionScreen = () => {
  const { homeData, selectProject, isLoading } = useHome();
  const { logout } = useAuth();

  if (!homeData?.projects) return null;

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-slate-50/50">
      {/* Sign Out Button */}
      <button 
        onClick={logout}
        className="absolute top-8 right-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
            Workspace Selector
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Select your project
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the workspace you want to focus on today. You can always switch later from the sidebar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeData.projects.map((project) => (
            <button
              key={project.id}
              disabled={isLoading}
              onClick={() => selectProject(project.key)}
              className="group relative p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 text-left disabled:opacity-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Box size={24} />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {project.key}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                Active development workspace for the {project.name} project.
              </p>

              <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                Open Workspace <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}

          {/* Create New Option */}
          <button className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500/50 hover:bg-white transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 mb-4 transition-colors">
              <LayoutGrid size={20} />
            </div>
            <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
              Create New Workspace
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectionScreen;
