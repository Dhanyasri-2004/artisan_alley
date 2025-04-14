
import './styles/DashboardAdmin.css'
import React from 'react';
import Sidebar  from './pages/Sidebar'
import DashboardAdmin from './pages/DashboardAdmin'

function MainLayout() {
  return (
    <div className="grid-container">
      <Sidebar />
      <DashboardAdmin />
    </div>
  );
}

export default MainLayout;