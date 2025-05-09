import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX, IconHome, IconBriefcase, IconInfoCircle, IconUsers, IconLogin } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { to: '/', label: 'Home', icon: IconHome },
        { to: '/services', label: 'Services', icon: IconBriefcase },
        { to: '/how-it-works', label: 'How it Works', icon: IconInfoCircle },
        { to: '/blog', label: 'Blog', icon: IconInfoCircle },
        { to: '/about', label: 'About', icon: IconInfoCircle },
        { to: '/contact', label: 'Contact', icon: IconInfoCircle },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`fixed top-0 left-0 w-full right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            className={`w-[160px] sm:w-[200px] flex-none transition-all duration-300 ${isScrolled ? ' ' : 'brightness-0 invert'}`}
                            src="/assets/images/morevanstext.png"
                            alt="MoreVans"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const active = isActive(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center text-lg font-medium transition-colors duration-200 ${
                                        active
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : isScrolled
                                            ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                            : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 mr-2 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/login"
                            className={`flex items-center text-lg font-medium transition-colors duration-200 ${
                                isScrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white hover:text-blue-200'
                            }`}
                        >
                            <IconLogin className="w-6 h-6 mr-2" />
                            Log In
                        </Link>
                        <Link
                            to="/service-request"
                            className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                                isScrolled ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' : 'bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                            }`}
                        >
                            Request a Move
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="md:hidden text-gray-700 dark:text-gray-300">
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white dark:bg-gray-900 w-full">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col space-y-4">
                                {navLinks.map(({ to, label, icon: Icon }) => {
                                    const active = isActive(to);
                                    return (
                                        <Link
                                            key={to}
                                            to={to}
                                            className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                                                active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Icon className={`w-6 h-6 mr-3 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                            {label}
                                        </Link>
                                    );
                                })}

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        to="/login"
                                        className="flex items-center px-4 py-3 text-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <IconLogin className="w-6 h-6 mr-3" />
                                        Log In
                                    </Link>
                                    <Link
                                        to="/service-request"
                                        className="block mt-4 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-center text-lg font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Request a Move
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
