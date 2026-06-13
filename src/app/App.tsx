import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import { HomeProvider } from '../shared/store/HomeContext';
import HomeGuard from '../shared/components/HomeGuard';
import MainLayout from '../shared/layouts/MainLayout';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const DashboardScreen = lazy(() => import('../features/dashboard/pages/DashboardScreen'));
const TicketScreen = lazy(() => import('../features/tickets/pages/TicketScreen'));
const TeamScreen = lazy(() => import('../features/members/pages/TeamScreen'));
const SprintScreen = lazy(() => import('../features/sprints/pages/SprintScreen'));

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <HomeProvider>
                <HomeGuard />
              </HomeProvider>
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/issues" element={<TicketScreen />} />
              <Route path="/sprints" element={<SprintScreen />} />
              <Route path="/team" element={<TeamScreen />} />
              <Route path="/settings" element={<div className="flex flex-col h-full gap-6 p-6 overflow-hidden"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings Page</h1><p>Coming soon...</p></div>} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
