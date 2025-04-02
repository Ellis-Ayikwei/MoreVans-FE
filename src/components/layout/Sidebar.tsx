import { faBox, faChartLine, faCog, faHistory, faHome, faSignOutAlt, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: faHome, label: 'Dashboard' },
        { path: '/profile', icon: faUser, label: 'My Profile' },
        { path: '/bookings', icon: faTruck, label: 'My Bookings' },
        { path: '/service-request', icon: faBox, label: 'Request Service' },
        { path: '/history', icon: faHistory, label: 'History' },
        { path: '/analytics', icon: faChartLine, label: 'Analytics' },
        { path: '/settings', icon: faCog, label: 'Settings' },
        { path: '/provider/jobs', icon: faBox, label: 'Work' },
    ];

    const isActivePath = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-center border-b">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                        Your Logo
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="mt-6">
                    <div className="px-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-lg ${
                                    isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                                <span className="ml-4 text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button
                        onClick={() => {
                            /* Add logout logic */
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                        <span className="ml-4 text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
