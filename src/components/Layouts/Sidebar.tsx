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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faTruck, 
  faBox, 
  faHistory, 
  faCalendarAlt, 
  faCreditCard, 
  faTicketAlt,
  faQuestionCircle, 
  faUserCog, 
  faChartLine, 
  faClipboardList,
  faCar,
  faStar,
  faTools,
  faMoneyBillWave,
  faMapMarkedAlt,
  faExchangeAlt,
  faIdCard,
  faFileInvoiceDollar,
  faHeadset,
  faCommentDots,
  faBalanceScale,
  faCalculator,
  faClipboardCheck,
  faLightbulb,
  faShieldAlt,
  faBell,
  faMinus,
  faCog,
  faTasks,
  faSave,
  faWarehouse,
  faBookmark,
  faUserFriends,
  faComments,
  faInbox,
  faUserCircle,
  faPaperPlane,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { Switch } from '@headlessui/react';

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
            icon: <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />,
            label: 'Dashboard ',
            children: null
        },
        {
            name: 'booking',
            path: '/service-request',
            icon: <FontAwesomeIcon icon={faTruck} className="w-5 h-5" />,
            label: 'Book a Move ',
            children: null
        },
        {
            name: 'my-moves',
            path: '/bookings',
            icon: <FontAwesomeIcon icon={faBox} className="w-5 h-5" />,
            label: 'My Moves ',
            children: null
        },
        // Add Saved Providers here
        {
            name: 'saved-providers',
            path: '/saved-providers',
            icon: <FontAwesomeIcon icon={faBookmark} className="w-5 h-5" />,
            label: 'Saved Providers ',
            badge: '3', // Optional: Show how many providers are saved
            children: null
        },
        // Add Messages section here
        {
            name: 'messages',
            path: '/chat',
            icon: <FontAwesomeIcon icon={faComments} className="w-5 h-5" />,
            label: 'Messages ',
            badge: '2', // Shows number of unread messages
            children: null
        },
        {
            name: 'payments',
            path: '/payments',
            icon: <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5" />,
            label: 'Payments ',
            children: null
        },
        {
            name: 'support',
            icon: <FontAwesomeIcon icon={faHeadset} className="w-5 h-5" />,
            label: 'Support',
            children: [
                { path: '/help-center', icon: <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4" />, label: 'Help Center' },
                { path: '/live-chat', icon: <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4" />, label: 'Live Chat' },
                { path: '/disputes', icon: <FontAwesomeIcon icon={faBalanceScale} className="w-4 h-4" />, label: 'Dispute Resolution' },
            ]
        },
        {
            name: 'account-settings',
            path: '/profile',
            icon: <FontAwesomeIcon icon={faCog} className="w-5 h-5" />,
            label: 'Account Settings ',
            children: null
        }
    ];

    // Provider navigation items - only Ratings & Reviews and Support have dropdowns
    const providerNavItems = [
        {
            name: 'provider-dashboard',
            path: '/provider/dashboard',
            icon: <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />,
            label: 'Provider Dashboard ',
            children: null
        },
        {
            name: 'job-management',
            path: '/provider/jobs',
            icon: <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />,
            label: 'Job Management ',
            children: null
        },
        // Add Client Messages section here
        {
            name: 'client-messages',
            icon: <FontAwesomeIcon icon={faComments} className="w-5 h-5" />,
            label: 'Client Messages ',
            badge: '3', // Shows number of unread client messages
            children: [
                { 
                    path: '/provider/messages/inbox', 
                    icon: <FontAwesomeIcon icon={faInbox} className="w-4 h-4" />, 
                    label: 'Inbox',
                    badge: '3'
                },
                { 
                    path: '/provider/messages/active', 
                    icon: <FontAwesomeIcon icon={faComment} className="w-4 h-4" />, 
                    label: 'Active Chats' 
                },
                { 
                    path: '/provider/messages/sent', 
                    icon: <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />, 
                    label: 'Sent' 
                }
            ]
        },
        {
            name: 'vehicle-management',
            path: '/provider/vehicles',
            icon: <FontAwesomeIcon icon={faTruck} className="w-5 h-5" />,
            label: 'Vehicle Management ',
            children: null
        },
        {
            name: 'provider-payments',
            path: '/provider/payouts',
            icon: <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5" />,
            label: 'Payments ',
            children: null
        },
        {
            name: 'ratings',
            icon: <FontAwesomeIcon icon={faStar} className="w-5 h-5" />,
            label: 'Ratings & Reviews ',
            children: null
        },
        {
            name: 'provider-support',
            icon: <FontAwesomeIcon icon={faTools} className="w-5 h-5" />,
            label: 'Support ',
            children: [
                { path: '/provider/help-center', icon: <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4" />, label: 'Provider Help Center' },
                { path: '/provider/live-chat', icon: <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4" />, label: 'Live Chat' },
            ]
        },
       
    ];

    // Use provider or customer navigation based on mode
    const navItems = isProviderMode ? providerNavItems : customerNavItems;

    // Render a menu item with potential children and optional badge
    const renderMenuItem = (item: any) => {
        if (!item.children) {
            return (
                <li key={item.path} className="menu nav-item">
                    <NavLink to={item.path} className="group">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <div className="text-primary">{item.icon}</div>
                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    </NavLink>
                </li>
            );
        }

        return (
            <li key={item.name} className="menu nav-item">
                <button 
                    type="button" 
                    className={`nav-link group w-full ${currentMenu === item.name ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.name)}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <div className="text-primary">{item.icon}</div>
                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                            {item.badge && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                                    {item.badge}
                                </span>
                            )}
                            <div className={`rtl:rotate-180 ${currentMenu === item.name ? 'rotate-90' : ''}`}>
                                <IconCaretsDown />
                            </div>
                        </div>
                    </div>
                </button>
                
                <ul className={`sub-menu ${currentMenu === item.name ? 'block' : 'hidden'}`}>
                    {item.children.map((child: any) => (
                        <li key={child.path}>
                            <NavLink to={child.path}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="ltr:pl-7 rtl:pr-7 text-primary">{child.icon}</div>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{child.label}</span>
                                    </div>
                                    {child.badge && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                                            {child.badge}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </li>
        );
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-36 ml-[5px] flex-none brightness-0 text-blue" src="/assets/images/morevanstext.png" alt="logo" />                           
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    {/* Role toggle switch */}
                    <div className="px-4 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isProviderMode ? 'Provider View' : 'Customer View'}
                            </span>
                            <Switch
                                checked={isProviderMode}
                                onChange={setIsProviderMode}
                                className={`${
                                    isProviderMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className="sr-only">Switch to {isProviderMode ? 'Customer' : 'Provider'} view</span>
                                <span
                                    className={`${
                                        isProviderMode ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </Switch>
                        </div>
                        <div className="flex items-center mt-2">
                            <FontAwesomeIcon icon={faExchangeAlt} className="text-xs text-gray-500 dark:text-gray-400 mr-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Switch to {isProviderMode ? 'customer' : 'provider'} dashboard
                            </p>
                        </div>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-130px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-3">
                            <li className="nav-item">
                                <ul>
                                    {navItems.map((item) => renderMenuItem(item))}
                                </ul>
                            </li>
                        </ul>
                        
                        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    /* Add logout logic */
                                }}
                                className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
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
