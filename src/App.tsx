import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import DashboardOverview from './features/dashboard/pages/DashboardScreen';
import MainLayout from './shared/layouts/MainLayout';
import TicketScreen from './features/tickets/pages/TicketScreen';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { HomeProvider } from './shared/store/HomeContext';
import HomeGuard from './shared/components/HomeGuard';
import TeamScreen from './features/members/pages/TeamScreen';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <HomeProvider>
              <HomeGuard />
            </HomeProvider>
          }
        >
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/issues" element={<TicketScreen />} />
            {/* Placeholder for other routes */}
            <Route path="/sprints" element={<div className="flex flex-col h-full gap-6 p-6 overflow-hidden"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sprints Page</h1><p>Coming soon...</p></div>} />
            <Route path="/team" element={<TeamScreen />} />
            <Route path="/settings" element={<div className="flex flex-col h-full gap-6 p-6 overflow-hidden"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings Page</h1><p>Coming soon...</p></div>} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
