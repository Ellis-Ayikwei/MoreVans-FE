import React, { useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../layout/AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={toggleSidebar} onOpen={toggleSidebar} />

            {/* Main content */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300 ease-in-out`}>
                <header className="bg-white shadow">
                    <div className="max-w-full mx-auto px-4 py-4">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {location.pathname
                                .split('/')
                                .pop()
                                ?.replace(/-/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Admin Panel'}
                        </h1>
                    </div>
                </header>

                <main className="max-w-full mx-auto px-4 py-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
