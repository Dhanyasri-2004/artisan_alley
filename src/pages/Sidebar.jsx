import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Users, Clock, Wallet,
  ChevronLeft,
  ChevronRight, LogOut,
  Package
} from 'lucide-react';
import '../styles/Sidebar.css';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={24} />, label: 'Products', path: '/products' },
    { icon: <FolderTree size={24} />, label: 'Categories', path: '/categories' },
    { icon: <Package size={24} />, label: 'Orders', path: '/adminorders' },
    { icon: <Users size={24} />, label: 'Artisans', path: '/artisans' },
    { icon: <Clock size={24} />, label: 'Worker Attendance', path: '/attendancePage' },
    { icon: <Wallet size={24} />, label: 'Pay Slip', path: '/artisanSummaryPage' },
  ];

  return (
    <div className="unique-app-container">
      <div className={`unique-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="unique-toggle-button"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="unique-logo-container">
          <div className="unique-logo">
            <img src="/images/logo.png" alt="Maan Meal Logo" className="logo-image" />
            {!isCollapsed && (
              <div>
                <h1 className="unique-logo-title">Artisan Alley</h1>
                <p className="unique-logo-subtitle">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <nav className="unique-nav">
          <ul className="unique-nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="unique-nav-item">
                <Link to={item.path} className={`unique-nav-link ${index === 0 ? 'active' : ''}`}>
                  <span>{item.icon}</span>
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            ))}
            {/* Logout Item */}
            <li className="unique-nav-item">
              <button onClick={handleLogout} className="unique-nav-link logout-button">
                <span><LogOut size={24} /></span>
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
