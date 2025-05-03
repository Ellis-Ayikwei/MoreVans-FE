import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faTruck,
  faClipboardList,
  faMoneyBillWave,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faBars,
  faTimes,
  faFlag,
  faShieldAlt,
  faWrench,
  faComments
} from '@fortawesome/free-solid-svg-icons';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const menuItems = [
    { path: '/admin/dashboard', icon: faChartLine, label: 'Dashboard' },
    { path: '/admin/users', icon: faUsers, label: 'User Management' },
    { path: '/admin/providers', icon: faTruck, label: 'Provider Management' },
    { path: '/admin/bookings', icon: faClipboardList, label: 'Bookings' },
    { path: '/admin/revenue', icon: faMoneyBillWave, label: 'Revenue & Payments' },
    { path: '/admin/disputes', icon: faFlag, label: 'Disputes' },
    { path: '/admin/settings', icon: faCog, label: 'Settings' },
    { path: '/admin/permissions', icon: faShieldAlt, label: 'Roles & Permissions' },
    { path: '/admin/maintenance', icon: faWrench, label: 'System Maintenance' },
    { path: '/admin/support', icon: faComments, label: 'Support Tickets' }
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out h-screen fixed`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="text-xl font-bold">MoreVans Admin</div>
          ) : (
            <div className="text-xl font-bold">MV</div>
          )}
          <button onClick={toggleSidebar} className="focus:outline-none">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <Link
            to="/help"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span>Help</span>}
          </Link>
          
          <Link
            to="/logout"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300 ease-in-out`}>
        <header className="bg-white shadow">
          <div className="max-w-full mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
        </header>
        
        <main className="max-w-full mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;