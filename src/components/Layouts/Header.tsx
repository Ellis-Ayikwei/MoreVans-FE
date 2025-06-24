import i18next from 'i18next';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../../helper/authAxiosInstance';
import { AppDispatch, IRootState } from '../../store';
import { LogoutUser } from '../../store/authSlice';
import { toggleRTL, toggleSidebar, toggleTheme } from '../../store/themeConfigSlice';
import Dropdown from '../Dropdown';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconBellBing from '../Icon/IconBellBing';
import IconCaretDown from '../Icon/IconCaretDown';
import IconHome from '../Icon/IconHome';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconLaptop from '../Icon/IconLaptop';
import IconLogout from '../Icon/IconLogout';
import IconMailDot from '../Icon/IconMailDot';
import IconMenu from '../Icon/IconMenu';
import IconMoon from '../Icon/IconMoon';
import IconSearch from '../Icon/IconSearch';
import IconSun from '../Icon/IconSun';
import IconUser from '../Icon/IconUser';
import IconXCircle from '../Icon/IconXCircle';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import NotificationBell from '../../pages/Notifications/NotificationBell';

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const auth = useAuthUser<any>();
    const location = useLocation();
    const user = auth;
    const userId = user?.id;
    const isLoggedIn = useSelector((state: IRootState) => state.auth.isLoggedIn);
    const signOut = useSignOut();
    const navigate = useNavigate();

    // Add loading state for logout
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-blue-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect></svg></span>',
            title: 'New Shipment Assigned',
            message: 'Shipment MV-23460 ready for pickup.',
            time: '5min',
        },
        {
            id: 2,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-green-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg></span>',
            title: 'Delivery Completed',
            message: 'Package delivered successfully to customer.',
            time: '15min',
        },
        {
            id: 3,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-orange-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>',
            title: 'Route Delay Alert',
            message: 'Traffic delay on Route A-205.',
            time: '1hr',
        },
        {
            id: 4,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-purple-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></span>',
            title: 'Fleet Maintenance',
            message: 'Vehicle LN65 ABC due for service.',
            time: '2hr',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong className="text-sm mr-1">Fleet Manager</strong>assigned you to <strong>Route Optimization</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong className="text-sm mr-1">Dispatch Team</strong>updated <strong>Delivery Schedule</strong>',
            time: '2h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong className="text-sm mr-1">Customer Service</strong>reported delivery confirmation',
            time: '4h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const { t } = useTranslation();

    const handleLogoutClick = async () => {
        if (isLoggingOut) return; // Prevent multiple clicks

        setIsLoggingOut(true);
        try {
            // Call logout action with signOut hook
            const logoutResponse = await dispatch(LogoutUser({ signOut }) as any);

            if (logoutResponse.meta?.requestStatus === 'fulfilled' || logoutResponse.type?.endsWith('/fulfilled')) {
                // Clear all local storage
                localStorage.clear();
                sessionStorage.clear();

                // Navigate to login page
                navigate('/login', { replace: true });

                // Show success message (optional)
                console.log('Logout successful');
            } else {
                // Handle logout failure
                console.error('Logout failed:', logoutResponse.error || 'Unknown error');

                // Force logout on client side even if server call fails
                signOut();
                localStorage.clear();
                sessionStorage.clear();
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Logout error:', error);

            // Force logout on client side even if there's an error
            try {
                signOut();
                localStorage.clear();
                sessionStorage.clear();
                navigate('/login', { replace: true });
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                // Last resort - redirect to login
                window.location.href = '/login';
            }
        } finally {
            setIsLoggingOut(false);
        }
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-lg border-b border-white/20">
                <div className="relative bg-gradient-to-r from-white via-blue-50 to-white dark:from-black dark:via-blue-900/20 dark:to-black flex w-full items-center px-6 py-3 backdrop-blur-sm">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo lg:flex items-center shrink-0 hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                                        <path d="M15 18H9"></path>
                                        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                                        <circle cx="17" cy="18" r="2"></circle>
                                        <circle cx="7" cy="18" r="2"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">MoreVans</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Logistics Platform</p>
                                </div>
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-orange-500 dark:hover:text-orange-400 flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <IconMenu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-2 lg:space-x-3 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>

                        {/* Provider Rating Display */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl dark:bg-gray-800/60 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">4.8</span>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`w-3 h-3 ${star <= 4 ? 'text-orange-500' : 'text-gray-300'}`}
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3 text-orange-500"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                style={{ clipPath: 'inset(0 20% 0 0)' }}
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">1,247 deliveries</div>
                                </div>
                            </div>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                            <div className="text-center">
                                <div className="text-xs font-medium text-green-600 dark:text-green-400">98.5%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">On-time</div>
                            </div>
                        </div>

                        {/* Theme Toggles */}
                        <div className="flex items-center">
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <IconSun className="w-5 h-5" />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                    onClick={() => {
                                        dispatch(toggleTheme('system'));
                                    }}
                                >
                                    <IconMoon className="w-5 h-5" />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconLaptop className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <Link
                            to="/"
                            className="p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                        >
                            <IconHome className="w-5 h-5" />
                        </Link>

                        {/* Language Selector */}
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                button={<img className="w-5 h-5 object-cover rounded-full" src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="flag" />}
                            >
                                <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px] bg-white/80 backdrop-blur-sm border border-white/20 dark:bg-gray-800/80">
                                    {themeConfig.languageList.map((item: any) => {
                                        return (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-orange-500 hover:bg-orange-50 rounded-lg p-2 transition-all duration-300 ${
                                                        i18next.language === item.code ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : ''
                                                    }`}
                                                    onClick={() => {
                                                        i18next.changeLanguage(item.code);
                                                        setLocale(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div>

                        {/* Enhanced Messages */}
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                button={
                                    <div className="relative">
                                        <IconMailDot className="w-5 h-5" />
                                        {messages.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{messages.length}</span>
                                        )}
                                    </div>
                                }
                            >
                                <ul className="!py-0 text-dark dark:text-white-dark w-[350px] sm:w-[400px] text-xs bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                                        <div className="hover:!bg-transparent overflow-hidden relative rounded-t-md p-5 text-white w-full !h-[68px]">
                                            <div className="absolute h-full w-full bg-gradient-to-r from-orange-500 to-blue-600 inset-0"></div>
                                            <h4 className="font-semibold relative z-10 text-lg">Logistics Updates</h4>
                                        </div>
                                    </li>
                                    {messages.length > 0 ? (
                                        <>
                                            <li onClick={(e) => e.stopPropagation()}>
                                                {messages.map((message) => {
                                                    return (
                                                        <div key={message.id} className="flex items-center py-3 px-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                            <div dangerouslySetInnerHTML={createMarkup(message.image)}></div>
                                                            <span className="px-3 dark:text-gray-300">
                                                                <div className="font-semibold text-sm dark:text-white/90">{message.title}</div>
                                                                <div className="text-gray-600 dark:text-gray-400">{message.message}</div>
                                                            </span>
                                                            <span className="font-semibold bg-orange-100 text-orange-600 rounded-full text-xs px-2 py-1 ltr:ml-auto rtl:mr-auto whitespace-nowrap dark:bg-orange-900/30 dark:text-orange-400">
                                                                {message.time}
                                                            </span>
                                                            <button type="button" className="text-gray-300 hover:text-red-500 ml-2 transition-colors" onClick={() => removeMessage(message.id)}>
                                                                <IconXCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </li>
                                            <li className="border-t border-gray-200 dark:border-gray-600 text-center mt-5">
                                                <button type="button" className="text-orange-500 font-semibold group hover:text-orange-600 justify-center !py-4 !h-[48px] transition-colors">
                                                    <span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL UPDATES</span>
                                                    <IconArrowLeft className="group-hover:translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                                            <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                                                <div className="mx-auto ring-4 ring-orange-500/30 rounded-full mb-4 text-orange-500">
                                                    <IconInfoCircle fill={true} className="w-10 h-10" />
                                                </div>
                                                No logistics updates available.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        {/* Enhanced Notifications */}
                        <div className="dropdown shrink-0">
                            <NotificationBell />
                        </div>

                        {/* Enhanced User Profile */}
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                                            <IconUser className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.full_name || 'User'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Member'}</p>
                                        </div>
                                        <IconCaretDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                }
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[450px] font-semibold dark:text-white-light/90 bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                                    <li>
                                        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center mr-4">
                                                <IconUser className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {user?.full_name}
                                                    <span className="text-xs bg-orange-500 text-white rounded-full px-2 py-1 ltr:ml-2 rtl:ml-2">{user?.role}</span>
                                                </h4>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">ID: {user?.id}</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="dark:hover:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors !py-3">
                                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Profile Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" className="dark:hover:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors !py-3">
                                            <IconMenuDashboard className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/fleet" className="dark:hover:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors !py-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                                                <path d="M15 18H9"></path>
                                                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                                                <circle cx="17" cy="18" r="2"></circle>
                                                <circle cx="7" cy="18" r="2"></circle>
                                            </svg>
                                            Fleet Management
                                        </Link>
                                    </li>

                                    <li className="border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            type="button"
                                            className={`text-red-500 !py-3 w-full text-left flex items-center transition-all duration-300 ${
                                                isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                                            }`}
                                            onClick={handleLogoutClick}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? (
                                                <div className="animate-spin w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 border-2 border-red-500 border-t-transparent rounded-full"></div>
                                            ) : (
                                                <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                            )}
                                            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Enhanced Horizontal Menu - Logistics Focused */}
                <ul className="horizontal-menu hidden py-2 font-semibold px-6 lg:space-x-2 xl:space-x-4 rtl:space-x-reverse bg-white/70 backdrop-blur-sm border-t border-white/30 dark:border-gray-700 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300">
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <span className="px-1">Control Center</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                            <li>
                                <NavLink to="/" className="hover:text-orange-500">
                                    Operations Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics" className="hover:text-orange-500">
                                    Fleet Analytics
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/finance" className="hover:text-orange-500">
                                    Financial Reports
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/performance" className="hover:text-orange-500">
                                    Performance Metrics
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                                    <path d="M15 18H9"></path>
                                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                                    <circle cx="17" cy="18" r="2"></circle>
                                    <circle cx="7" cy="18" r="2"></circle>
                                </svg>
                                <span className="px-1">Fleet Management</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                            <li>
                                <NavLink to="/fleet/vehicles" className="hover:text-orange-500">
                                    Vehicle Status
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/fleet/drivers" className="hover:text-orange-500">
                                    Driver Management
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/fleet/maintenance" className="hover:text-orange-500">
                                    Maintenance Schedule
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/fleet/fuel" className="hover:text-orange-500">
                                    Fuel Management
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/fleet/tracking" className="hover:text-orange-500">
                                    Live Tracking
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="7.5,4.21 12,6.81 16.5,4.21"></polyline>
                                    <polyline points="7.5,19.79 7.5,14.6 3,12"></polyline>
                                    <polyline points="21,12 16.5,14.6 16.5,19.79"></polyline>
                                </svg>
                                <span className="px-1">Shipments</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                            <li>
                                <NavLink to="/shipments/active" className="hover:text-orange-500">
                                    Active Shipments
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/shipments/dispatch" className="hover:text-orange-500">
                                    Dispatch Center
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/shipments/schedule" className="hover:text-orange-500">
                                    Delivery Schedule
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/shipments/tracking" className="hover:text-orange-500">
                                    Package Tracking
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/shipments/routes" className="hover:text-orange-500">
                                    Route Planning
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="m22 21-3-3m0 0a6 6 0 1 0-8.485-8.485A6 6 0 0 0 19 18Z"></path>
                                </svg>
                                <span className="px-1">Customer Hub</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                            <li>
                                <NavLink to="/customers/orders" className="hover:text-orange-500">
                                    Order Management
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customers/support" className="hover:text-orange-500">
                                    Customer Support
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customers/feedback" className="hover:text-orange-500">
                                    Feedback & Reviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customers/communications" className="hover:text-orange-500">
                                    Communications
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300">
                            <div className="flex items-center">
                                <IconMenuDatatables className="shrink-0" />
                                <span className="px-1">Reports & Analytics</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                            <li>
                                <NavLink to="/reports/operations" className="hover:text-orange-500">
                                    Operations Report
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/reports/financial" className="hover:text-orange-500">
                                    Financial Analysis
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/reports/performance" className="hover:text-orange-500">
                                    Performance Metrics
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/reports/compliance" className="hover:text-orange-500">
                                    Compliance Reports
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
