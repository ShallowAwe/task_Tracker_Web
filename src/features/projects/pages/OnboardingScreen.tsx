import { Plus, Users, Layout, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth/store/AuthContext';

const OnboardingScreen = () => {
  const { logout } = useAuth();

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
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Welcome to Horizon Blueprint
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your workspace for ambitious projects. To get started, you'll need to create a new project or join an existing team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Project Card */}
          <button className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Plus size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Project</h2>
            <p className="text-slate-500 mb-8">
              Start fresh with a new project workspace. Define your goals, invite teammates, and begin building.
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
              Launch project wizard <Zap size={14} className="ml-1" />
            </div>
          </button>

          {/* Join Project Card */}
          <button className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Join Existing Project</h2>
            <p className="text-slate-500 mb-8">
              Already have an invitation? Enter a project key or link to join your team's ongoing workspace.
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
              Find your team <Layout size={14} className="ml-1" />
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400">
            Need help getting started? <a href="#" className="text-blue-500 font-medium hover:underline">Check out our quick start guide</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
