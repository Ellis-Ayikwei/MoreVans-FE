import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCashBanknotes from '../Icon/IconCashBanknotes';
import IconHome from '../Icon/IconHome';
import IconMinus from '../Icon/IconMinus';
import IconOpenBook from '../Icon/IconOpenBook';
import IconSettings from '../Icon/IconSettings';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconUser from './../Icon/IconUser';
import { Switch } from '@headlessui/react';
import {
    IconTruck,
    IconBox,
    IconHistory,
    IconCalendar,
    IconCreditCard,
    IconHelp,
    IconSettings as IconSettingsTabler,
    IconChartLine,
    IconList,
    IconCar,
    IconStar,
    IconTools,
    IconMap,
    IconExchange,
    IconId,
    IconReceipt,
    IconHeadset,
    IconMessage,
    IconScale,
    IconCalculator,
    IconChecklist,
    IconBulb,
    IconShield,
    IconBell,
    IconMinus as IconMinusTabler,
    IconClipboard,
    IconBookmark,
    IconUsers,
    IconMessages,
    IconInbox,
    IconUserCircle,
    IconSend,
    IconMessage2,
    IconLogout,
    IconEye,
    IconListDetails,
    IconHome2,
} from '@tabler/icons-react';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // State to track if we're in provider mode
    const [isProviderMode, setIsProviderMode] = useState(false);

    const userRole = localStorage.getItem('userRole') || '';
    const adminUsers = ['SUPER_ADMIN', 'ADMIN', 'UNDERWRITER', 'PREMIUM_ADMIN', 'SALES'];
    const personalUsers = ['MEMBER', 'REGULAR'];

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // Customer navigation items - only Book a Move has dropdowns
    const customerNavItems = [
        {
            name: 'dashboard',
            path: '/dashboard',
            icon: <IconHome2 className="!w-8 !h-8 !text-white" />,
            label: 'Home ',
            children: null,
        },
        {
            name: 'booking',
            path: '/service-request',
            icon: <IconTruck className="!w-8 !h-8 !text-white" />,
            label: 'Book a Move ',
            children: null,
        },
        {
            name: 'my-moves',
            path: '/my-bookings',
            icon: <IconBox className="!w-8 !h-8 !text-white" />,
            label: 'My Moves ',
            children: null,
        },
        // {
        //     name: 'saved-providers',
        //     path: '/saved-providers',
        //     icon: <IconBookmark className="!w-8 !h-8 !text-white" />,
        //     label: 'Saved Providers ',
        //     badge: '3',
        //     children: null,
        // },
        {
            name: 'messages',
            path: '/chat',
            icon: <IconMessages className="!w-8 !h-8 !text-white" />,
            label: 'Messages ',
            badge: '2',
            children: null,
        },
        {
            name: 'payments',
            path: '/payments',
            icon: <IconCreditCard className="!w-8 !h-8 !text-white" />,
            label: 'Payments ',
            children: null,
        },
        {
            name: 'support',
            icon: <IconHeadset className="!w-8 !h-8 !text-white" />,
            label: 'Support',
            children: [
                { path: '/help-center', icon: <IconHelp className="!w-6 !h-6 text-white" />, label: 'Help Center' },
                { path: '/live-chat', icon: <IconMessage className="!w-6 !h-6 text-white" />, label: 'Live Chat' },
                { path: '/disputes', icon: <IconScale className="!w-6 !h-6 text-white" />, label: 'Dispute Resolution' },
            ],
        },
        {
            name: 'account-settings',
            path: '/profile',
            icon: <IconSettings className="!w-8 !h-8 !text-white" />,
            label: 'Account Settings ',
            children: null,
        },
    ];

    // Provider navigation items - only Ratings & Reviews and Support have dropdowns
    const providerNavItems = [
        {
            name: 'provider-dashboard',
            path: '/provider/jobs',
            icon: <IconTruck className="!w-8 !h-8 !text-white" />,
            label: 'Find Jobs',
            children: null,
            className: 'bg-secondary text-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 transform hover:-translate-y-0.5',
        },
        {
            name: 'provider-dashboard',
            path: '/provider/dashboard',
            icon: <IconHome2 className="!w-8 !h-8 !text-white" />,
            label: 'Home',
            children: null,
        },
        {
            name: 'job-management',
            path: '/provider/jobs',
            icon: <IconCalendar className="!w-8 !h-8 !text-white" />,
            label: 'Job Management',
            children: [
                {
                    path: '/provider/my-jobs',
                    icon: <IconInbox className="!w-6 !h-6 !text-white" />,
                    label: 'My Jobs',
                    badge: '3',
                },
                {
                    path: '/provider/my-jobs-bidding',
                    icon: <IconChecklist className="!w-6 !h-6 !text-white" />,
                    label: 'Bidding',
                },
                {
                    path: '/provider/my-jobs-watching',
                    icon: <IconEye className="!w-6 !h-6 !text-white" />,
                    label: 'Watching Job',
                },
            ],
        },
        {
            name: 'client-messages',
            icon: <IconMessages className="!w-8 !h-8 !text-white" />,
            label: 'Client Messages ',
            badge: '3',
            children: [
                {
                    path: '/provider/messages/inbox',
                    icon: <IconInbox className="!w-6 !h-6 !text-white" />,
                    label: 'Inbox',
                    badge: '3',
                },
                {
                    path: '/provider/messages/active',
                    icon: <IconMessage className="!w-6 !h-6 !text-white" />,
                    label: 'Active Chats',
                },
                {
                    path: '/provider/messages/sent',
                    icon: <IconSend className="!w-6 !h-6 !text-white" />,
                    label: 'Sent',
                },
            ],
        },
        {
            name: 'vehicle-management',
            path: '/provider/vehicles',
            icon: <IconCar className="!w-8 !h-8 !text-white" />,
            label: 'Vehicle Management ',
            children: null,
        },
        {
            name: 'provider-payments',
            path: '/provider/payouts',
            icon: <IconCreditCard className="!w-8 !h-8 !text-white" />,
            label: 'Payments ',
            children: null,
        },
        {
            name: 'ratings',
            path: '/providers/:providerId/ratings',
            icon: <IconStar className="!w-8 !h-8 !text-white" />,
            label: 'Ratings & Reviews ',
            children: null,
        },
        {
            name: 'provider-support',
            icon: <IconTools className="!w-8 !h-8 !text-white" />,
            label: 'Support ',
            children: [
                { path: '/provider/help-center', icon: <IconHelp className="!w-6 !h-6 !text-white" />, label: 'Provider Help Center' },
                { path: '/provider/live-chat', icon: <IconMessage className="!w-6 !h-6 !text-white" />, label: 'Live Chat' },
            ],
        },
    ];

    // Use provider or customer navigation based on mode
    const navItems = isProviderMode ? providerNavItems : customerNavItems;

    // Render a menu item with potential children and optional badge
    const renderMenuItem = (item: any) => {
        if (!item.children) {
            return (
                <li key={item.path} className="menu nav-item border-primary-dark dark:border-primary-dark last:border-b-0">
                    <NavLink to={item.path} className={`group hover:bg-primary/10 dark:hover:bg-primary/20 ${item.className || ''}`}>
                        <div className="flex items-center justify-between w-full py-1">
                            <div className="flex items-center">
                                {item.icon}
                                <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{item.label}</span>
                            </div>
                            {item.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-primary dark:bg-white dark:text-primary">{item.badge}</span>}
                        </div>
                    </NavLink>
                </li>
            );
        }

        return (
            <li key={item.name} className="menu nav-item border-primary-dark dark:border-primary-dark last:border-b-0">
                <button
                    type="button"
                    className={`nav-link group w-full hover:bg-primary/10 dark:hover:bg-primary/20 ${currentMenu === item.name ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.name)}
                >
                    <div className="flex items-center justify-between w-full py-1">
                        <div className="flex items-center">
                            {item.icon}
                            <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                            {item.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-primary dark:bg-white dark:text-primary mr-2">{item.badge}</span>}
                            <div className={`rtl:rotate-180 ${currentMenu === item.name ? 'rotate-90' : ''}`}>
                                <IconCaretsDown className="!text-white" />
                            </div>
                        </div>
                    </div>
                </button>

                {currentMenu === item.name && (
                    <ul className="sub-menu">
                        {item.children.map((child: any) => (
                            <li key={child.path} className="border-b border-primary-dark dark:border-primary-dark last:border-b-0 py-1">
                                <NavLink to={child.path} className="group hover:bg-primary/10 dark:hover:bg-primary/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {child.icon}
                                            <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{child.label}</span>
                                        </div>
                                        {child.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-primary dark:bg-white dark:text-primary mr-2">{child.badge}</span>}
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full !rounded-r-xl top-0 bottom-0 w-[290px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
                    semidark ? 'text-white-dark' : ''
                }`}
            >
                <div className="bg-primary dark:bg-primary h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-[200px] ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevanstext.png" alt="logo" />
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-primary-dark dark:hover:bg-primary-dark dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90 text-white" />
                        </button>
                    </div>

                    {/* Role toggle switch */}
                    <div className="px-4 pt-2 pb-4 border-b border-primary-dark dark:border-primary-dark">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white dark:text-white">{isProviderMode ? 'Provider View' : 'Customer View'}</span>
                            <Switch
                                checked={isProviderMode}
                                onChange={setIsProviderMode}
                                className={`${
                                    isProviderMode ? 'bg-secondary' : 'bg-white/20'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}
                            >
                                <span className="sr-only">Switch to {isProviderMode ? 'Customer' : 'Provider'} view</span>
                                <span className={`${isProviderMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>
                        <div className="flex items-center mt-2">
                            <IconExchange className="text-xs text-white/70 dark:text-white/70 mr-2" />
                            <p className="text-xs text-white/70 dark:text-white/70">Switch to {isProviderMode ? 'customer' : 'provider'} dashboard</p>
                        </div>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-130px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-3 text-lg">
                            <li className="nav-item">
                                <ul>{navItems.map((item) => renderMenuItem(item))}</ul>
                            </li>
                        </ul>

                        <div className="absolute bottom-0 w-full p-4 border-t border-primary-dark dark:border-primary-dark">
                            <button
                                onClick={() => {
                                    /* Add logout logic */
                                    localStorage.removeItem('userRole');
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center w-full px-4 py-3 text-white hover:bg-white hover:text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-lg transition-colors duration-200"
                            >
                                <IconLogout className="w-7 h-7 !text-white group-hover:!text-primary" />
                                <span className="ml-4 text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
