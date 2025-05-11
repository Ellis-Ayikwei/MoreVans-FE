import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    IconLayoutDashboard,
    IconUsers,
    IconTruck,
    IconClipboardList,
    IconMoneybag,
    IconCurrencyDollar,
    IconExchange,
    IconHeadset,
    IconSettings,
    IconShieldLock,
    IconServer,
    IconMenu2,
    IconX,
    IconHelp,
    IconLogout,
    IconChevronDown,
    IconChevronRight,
    IconUser,
} from '@tabler/icons-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

interface MenuItem {
    path: string;
    icon: React.ElementType;
    label: string;
    subItems?: MenuItem[];
}

const AdminSidebar = ({ isOpen, onClose, onOpen }: SidebarProps) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const menuItems: MenuItem[] = [
        { path: '/admin/dashboard', icon: IconLayoutDashboard, label: 'Dashboard' },
        {
            path: '/admin/users',
            icon: IconUsers,
            label: 'User Management',
            subItems: [
                { path: '/admin/users/list', icon: IconUsers, label: 'All Users' },
                { path: '/admin/users/roles', icon: IconShieldLock, label: 'User Roles' },
            ],
        },
        {
            path: '/admin/providers',
            icon: IconTruck,
            label: 'Provider Management',
            subItems: [
                { path: '/admin/providers/list', icon: IconTruck, label: 'All Providers' },
                { path: '/admin/providers/verification', icon: IconShieldLock, label: 'Verification' },
            ],
        },
        { path: '/admin/bookings', icon: IconClipboardList, label: 'Bookings' },
        {
            path: '/admin/revenue',
            icon: IconMoneybag,
            label: 'Revenue & Payments',
            subItems: [
                { path: '/admin/revenue/overview', icon: IconMoneybag, label: 'Overview' },
                { path: '/admin/revenue/transactions', icon: IconCurrencyDollar, label: 'Transactions' },
            ],
        },
        { path: '/admin/pricing', icon: IconCurrencyDollar, label: 'Pricing Management' },
        { path: '/admin/disputes', icon: IconExchange, label: 'Disputes' },
        { path: '/admin/support', icon: IconHeadset, label: 'Support Tickets' },
        { path: '/admin/settings', icon: IconSettings, label: 'Settings' },
        { path: '/admin/permissions', icon: IconShieldLock, label: 'Roles & Permissions' },
        { path: '/admin/maintenance', icon: IconServer, label: 'System Maintenance' },
    ];

    const toggleSection = (path: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const isPathActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const renderMenuItem = (item: MenuItem, isSubItem = false) => {
        const isActive = isPathActive(item.path);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedSections[item.path];

        return (
            <div key={item.path}>
                <Link
                    to={item.path}
                    className={`flex items-center py-3 px-4 transition-colors duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'} ${isSubItem ? 'pl-8' : ''}`}
                    onClick={() => hasSubItems && toggleSection(item.path)}
                >
                    <item.icon className={`${isOpen ? 'mr-3' : 'mx-auto'} w-6 h-6`} />
                    {isOpen && (
                        <div className="flex items-center justify-between flex-1">
                            <span>{item.label}</span>
                            {hasSubItems && (isExpanded ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />)}
                        </div>
                    )}
                </Link>
                {isOpen && hasSubItems && isExpanded && <div className="bg-white/5">{item.subItems?.map((subItem) => renderMenuItem(subItem, true))}</div>}
            </div>
        );
    };

    const SidebarContent = () => (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-secondary text-white transition-all duration-300 ease-in-out h-screen fixed flex flex-col`}>
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                {isOpen ? (
                    <div className="text-xl font-bold">
                        <img className="w-[200px] ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevanstext.png" alt="logo" />
                    </div>
                ) : (
                    <div className="text-xl font-bold">
                        <img className="w-[30px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />
                    </div>
                )}

                <button onClick={onClose} className="focus:outline-none hover:bg-white/10 p-1 rounded">
                    {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
                </button>
            </div>

            {user && (
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <IconUser className="w-6 h-6" />
                        </div>
                        {isOpen && (
                            <div>
                                <p className="font-medium">{user.name || 'Admin User'}</p>
                                <p className="text-sm text-white/70">{user.role || 'Administrator'}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-4">
                    <span className="text-2xl font-bold">Admin</span>
                </div>

                {menuItems.map((item) => renderMenuItem(item))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <Link to="/help" className="flex items-center py-2 px-4 text-white/70 hover:bg-white/5 transition-colors duration-200 rounded">
                    <IconHelp className={`${isOpen ? 'mr-3' : 'mx-auto'} w-6 h-6`} />
                    {isOpen && <span>Help & Support</span>}
                </Link>

                <button
                    onClick={() => {
                        localStorage.removeItem('userRole');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="flex items-center w-full py-2 px-4 text-white/70 hover:bg-white/5 transition-colors duration-200 rounded mt-2"
                >
                    <IconLogout className={`${isOpen ? 'mr-3' : 'mx-auto'} w-6 h-6`} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <>
                <button onClick={onOpen} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-secondary text-white md:hidden hover:bg-secondary/90 transition-colors">
                    <IconMenu2 className="w-6 h-6" />
                </button>

                {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity" onClick={onClose} />}

                <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                    <SidebarContent />
                </div>
            </>
        );
    }

    return <SidebarContent />;
};

export default AdminSidebar;
