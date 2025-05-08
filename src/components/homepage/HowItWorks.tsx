import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconClipboardList, IconUsers, IconTruck, IconArrowRight } from '@tabler/icons-react';

interface Step {
    number: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        number: 1,
        icon: <IconClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
        title: 'Tell Us About Your Move',
        description: 'Fill out our simple form with your moving details, items, and specific requirements.',
    },
    {
        number: 2,
        icon: <IconUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
        title: 'Compare & Choose',
        description: 'Review quotes from verified providers, compare ratings and choose your perfect match.',
    },
    {
        number: 3,
        icon: <IconTruck className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
        title: 'Track Your Move',
        description: 'Monitor your service in real-time, communicate with your provider, and rate them after completion.',
    },
];

const HowItWorks: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How MoreVans Works</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Get your items moved in three simple steps with our efficient platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Decorative line connecting steps */}
                    <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="relative text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">{step.number}</div>
                            </div>
                            <div className="mt-6 mb-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">{step.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/how-it-works"
                        className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        Learn More About Our Process
                        <IconArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
