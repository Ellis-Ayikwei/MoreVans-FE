'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTruck, faClock, faStar, faHandshake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, showBackButton = true }) => {
    const features = [
        {
            icon: faShieldAlt,
            title: 'Secure & Reliable',
            description: 'Your data is protected with enterprise-grade security',
        },
        {
            icon: faTruck,
            title: 'Nationwide Coverage',
            description: 'Access to trusted van operators across the UK',
        },
        {
            icon: faClock,
            title: 'Quick & Efficient',
            description: 'Fast booking and real-time tracking',
        },
        {
            icon: faStar,
            title: 'Verified Providers',
            description: 'All our van operators are thoroughly vetted',
        },
        {
            icon: faHandshake,
            title: 'Trusted Platform',
            description: 'Join thousands of satisfied customers',
        },
        {
            icon: faMapMarkerAlt,
            title: 'Local & National',
            description: 'Services available in your area and beyond',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/75 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 via-transparent to-primary/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 via-transparent to-secondary/40 z-10"></div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10"></div>

                {/* Enhanced gradient orbs */}
                <motion.div
                    className="absolute w-[50rem] h-[50rem] rounded-full bg-secondary/20 -top-40 -left-20 blur-3xl z-10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 12,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute w-[60rem] h-[60rem] rounded-full bg-primary/20 -bottom-40 -right-20 blur-3xl z-10"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 15,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />

                {/* Additional gradient orbs for mobile */}
                <motion.div
                    className="absolute w-[35rem] h-[35rem] rounded-full bg-secondary/20 top-1/2 -left-20 blur-3xl z-10 sm:hidden"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 10,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute w-[30rem] h-[30rem] rounded-full bg-primary/20 top-1/3 -right-20 blur-3xl z-10 sm:hidden"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.25, 0.1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Features (Only visible on large screens) */}
                <motion.div
                    className="hidden lg:flex  lg:flex-col lg:justify-center lg:items-center lg:px-12 lg:py-8 lg:border-r lg:border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="flex-none p-4 sm:p-6 lg:absolute lg:top-0 lg:left-0 w-full lg:w-auto">
                        {showBackButton && (
                            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors lg:px-6 lg:py-4">
                                <IconArrowLeft className="w-5 h-5 mr-2" />
                                <span className="text-sm">Back to home</span>
                            </Link>
                        )}
                    </div>
                    <div className="max-w-lg w-full">
                        <motion.h3
                            className="text-3xl font-bold text-white mb-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                        >
                            Why Choose MoreVans?
                        </motion.h3>
                        <div className="grid grid-cols-1 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="flex items-start space-x-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <FontAwesomeIcon icon={feature.icon} className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                                        <p className="text-base text-white/80 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex flex-col lg:items-center lg:justify-center">
                    {/* Main Content */}
                    <motion.div
                        className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 -mt-8 sm:mt-0 lg:mt-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="sm:mx-auto w-full max-w-[700px] lg:max-w-[720px]">
                            {/* Logo */}
                            <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                                <img src="/assets/images/morevanstext.png" alt="MoreVans" className="h-16 w-auto" />
                            </motion.div>

                            <motion.h2 className="text-3xl font-bold text-white text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                                {title}
                            </motion.h2>
                            {subtitle && (
                                <motion.p className="mt-2 text-center text-sm text-white/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                                    {subtitle}
                                </motion.p>
                            )}
                        </div>

                        {/* Mobile App-like Container */}
                        <motion.div
                            className="mt-8 sm:mx-auto w-full max-w-[700px] lg:max-w-[720px]"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                                delay: 0.7,
                            }}
                        >
                            <div className="bg-white/10 backdrop-blur-lg rounded-t-3xl sm:rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">{children}</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
