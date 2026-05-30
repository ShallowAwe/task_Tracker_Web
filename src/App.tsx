import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import DashboardOverview from './features/dashboard/pages/DashboardScreen';
import MainLayout from './shared/layouts/MainLayout';
import TicketScreen from './features/tickets/pages/TicketScreen';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { HomeProvider } from './shared/store/HomeContext';
import HomeGuard from './shared/components/HomeGuard';
import './App.css';

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
            <Route path="/sprints" element={<div className="ticket-page"><h1 className="ticket-page-title">Sprints Page</h1><p>Coming soon...</p></div>} />
            <Route path="/team" element={<div className="ticket-page"><h1 className="ticket-page-title">Team Page</h1><p>Coming soon...</p></div>} />
            <Route path="/settings" element={<div className="ticket-page"><h1 className="ticket-page-title">Settings Page</h1><p>Coming soon...</p></div>} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
