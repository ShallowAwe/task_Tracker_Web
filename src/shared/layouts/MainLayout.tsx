import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <DashboardHeader />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
