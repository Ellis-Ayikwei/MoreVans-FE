'use client';

import { faArrowRight, faShieldAlt, faTruck, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: faTruck,
        title: 'Free Shipping',
        description: 'On orders over $100',
    },
    {
        icon: faShieldAlt,
        title: 'Secure Shopping',
        description: '100% secure payment',
    },
    {
        icon: faUndo,
        title: 'Easy Returns',
        description: '30-day return policy',
    },
];

export default function Hero() {
    const scrollToProducts = () => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative">
                    {/* Hero Content */}
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div className="flex justify-center gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Link to="/deals" className="px-6 py-2 rounded-full text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                                Flash Sale - Up to 50% Off
                            </Link>
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Discover the Latest in
                            <span className="block mt-2 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Tech Innovation</span>
                        </motion.h1>

                        <motion.div className="relative mx-auto max-w-lg mb-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569" alt="Latest iPhone" className="w-full h-64 object-cover rounded-2xl shadow-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl">
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="text-sm font-medium">Featured Product</p>
                                    <p className="text-2xl font-bold">iPhone 15 Pro</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="flex flex-wrap justify-center gap-4 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <button
                                onClick={scrollToProducts}
                                className="px-8 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-all duration-300 flex items-center gap-2"
                            >
                                Shop Now
                                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                            </button>
                            <Link
                                to="/deals"
                                className="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300"
                            >
                                View Deals
                            </Link>
                        </motion.div>
                    </div>

                    {/* Features Section */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ y: -5 }}
                            >
                                <span className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-lg mb-4">
                                    <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-primary-500" />
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
