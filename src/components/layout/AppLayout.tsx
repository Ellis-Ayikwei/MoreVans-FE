import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faBars, faLaptop, faPalette, faFont, faHome, faTruck, faClipboardList, faCreditCard, faCalendarAlt, faCog, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toggleTheme, setAccentColor, setFontSize } from '../../store/themeConfigSlice';

const AppLayout: React.FC = () => {
    const dispatch = useDispatch();
    const { isDarkMode, theme, accentColor, fontSize } = useSelector((state: any) => state.themeConfig);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const [showThemeSettings, setShowThemeSettings] = React.useState(false);

    useEffect(() => {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                dispatch(toggleTheme('system'));
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, dispatch]);

    useEffect(() => {
        // Apply accent color and font size on mount
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [accentColor, fontSize]);

    const handleThemeToggle = () => {
        if (theme === 'light') {
            dispatch(toggleTheme('dark'));
        } else if (theme === 'dark') {
            dispatch(toggleTheme('system'));
        } else {
            dispatch(toggleTheme('light'));
        }
    };

    const handleAccentColorChange = (color: string) => {
        dispatch(setAccentColor(color));
    };

    const handleFontSizeChange = (size: number) => {
        dispatch(setFontSize(size));
    };

    const getThemeIcon = () => {
        if (theme === 'system') return faLaptop;
        return isDarkMode ? faSun : faMoon;
    };

    const navigation = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: faHome,
        },
        {
            name: 'Vehicles',
            path: '/vehicles',
            icon: faTruck,
        },
        {
            name: 'Service Requests',
            path: '/service-requests',
            icon: faClipboardList,
        },
        {
            name: 'Payments',
            path: '/payments',
            icon: faCreditCard,
        },
        {
            name: 'Bookings',
            path: '/bookings',
            icon: faCalendarAlt,
        },
        {
            name: 'Settings',
            path: '/settings',
            icon: faCog,
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: faUser,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between h-16 px-4 bg-gray-800 dark:bg-gray-900">
                    <span className="text-white font-semibold text-lg">MoreVans</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white focus:outline-none">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <nav className="mt-5 px-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                location.pathname === item.path
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FontAwesomeIcon icon={item.icon} className={`mr-3 h-5 w-5 ${location.pathname === item.path ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : ''} transition-all duration-200 ease-in-out`}>
                {/* Top bar */}
                <div className="h-16 bg-white dark:bg-gray-800 shadow">
                    <div className="flex items-center h-full px-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
