import React, { useState } from 'react';
import Sidebar from '../Layouts/Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Sidebar />

            {/* Main Content */}
            <div className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <div className="container mx-auto p-4">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
