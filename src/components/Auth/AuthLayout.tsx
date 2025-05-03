'use client';

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex md:flex-row flex-col bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Left side - Moving/Logistics themed imagery */}
            <div className="hidden md:flex md:w-1/2 bg-blue-600 p-8 flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 z-10"></div>
                <img 
                    src="/assets/images/auth/map.png" 
                    alt="Logistics Map" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
                
                <div className="relative z-20 max-w-md text-center">
                    <img
                        className="mx-auto h-16 w-auto"
                        src="/assets/images/auth/login.svg"
                        alt="Logistics Illustration"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="mt-8 text-4xl font-bold text-white">MoreVans Logistics</h1>
                        <p className="mt-4 text-xl text-blue-100">Your trusted partner for all your moving and logistics needs.</p>
                        
                        <div className="mt-10 flex flex-col space-y-4">
                            <div className="flex items-center text-blue-100">
                                <div className="rounded-full bg-blue-500/30 p-2 mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Fast and reliable transportation</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <div className="rounded-full bg-blue-500/30 p-2 mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Experienced moving professionals</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <div className="rounded-full bg-blue-500/30 p-2 mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Real-time tracking services</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                <div className="absolute bottom-8 left-0 right-0 text-center text-blue-100 text-sm">
                    © {new Date().getFullYear()} MoreVans. All rights reserved.
                </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 md:w-1/2">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link to="/">
                        <img
                            className="mx-auto h-12 w-auto md:hidden"
                            src="/assets/images/morevanstext.png"
                            alt="MoreVans Logo"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/120x40?text=MoreVans';
                            }}
                        />
                    </Link>
                    <motion.h2 
                        className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {title}
                    </motion.h2>
                    <motion.p 
                        className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <motion.div 
                    className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
