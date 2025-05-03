import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    UserIcon,
    CurrencyPoundIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon,
    TruckIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import axiosInstance from '../../helper/axiosInstance';
import ConfirmationModal from './ConfirmationModal';

interface StaffPrice {
    total_price: number;
    currency: string;
    price_breakdown: {
        base_price: number;
        distance_cost: number;
        weight_cost: number;
        staff_cost: number;
        [key: string]: number;
    };
}

interface DayPrice {
    date: string;
    day_of_week: string;
    is_weekend: boolean;
    is_holiday: boolean;
    weather_condition: string;
    traffic_multiplier: number;
    staff_prices: {
        [key: string]: StaffPrice;
    };
    request_id: string;
}

interface PriceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayPrice: DayPrice;
    onAccept: (staffCount: string, price: number) => void;
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
};

const StaffCountIcon: React.FC<{ count: number }> = ({ count }) => {
    const users = Array.from({ length: count }, (_, i) => i);
    return (
        <div className="flex -space-x-2">
            {users.map((index) => (
                <motion.div key={index} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="relative">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const LoadingModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { icon: TruckIcon, label: 'Checking Vehicle Availability', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { icon: ClipboardDocumentCheckIcon, label: 'Verifying Route', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { icon: ClockIcon, label: 'Calculating Time', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { icon: BuildingOfficeIcon, label: 'Confirming Location', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        { icon: MapPinIcon, label: 'Checking Traffic', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { icon: DocumentCheckIcon, label: 'Finalizing Details', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    ];

    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setStep((prev) => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 500);
            return () => clearInterval(interval);
        } else {
            setStep(0);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-75">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">Preparing Your Quote</h3>
                                <p className="text-gray-600">We're gathering all the necessary information...</p>
                            </div>

                            <div className="w-full">
                                <div className="grid grid-cols-3 gap-4">
                                    {steps.map(({ icon: Icon, label, bgColor, iconColor }, index) => (
                                        <motion.div
                                            key={label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex flex-col items-center space-y-2"
                                        >
                                            <div className={`p-3 rounded-full ${bgColor}`}>
                                                <Icon className={`h-6 w-6 ${iconColor}`} />
                                            </div>
                                            <AnimatePresence>
                                                {index <= step && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-green-600">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <span className="text-xs text-gray-600 text-center">{label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} className="h-1 bg-blue-600 rounded-full" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PriceDetailsModal: React.FC<PriceDetailsModalProps> = ({ isOpen, onClose, dayPrice, onAccept }) => {
    console.log('the day price 1', dayPrice);
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAccept = async () => {
        try {
            setShowLoadingModal(true);
            setError(null);

            const selectedPrice = dayPrice.staff_prices[selectedStaff];
            const staffCount = selectedStaff;
            console.log('Selected day price:', dayPrice);
            console.log('Selected staff and price:', staffCount, selectedPrice);

            const response = await axiosInstance.post(`/requests/${dayPrice.request_id}/submit/`, {
                staff_count: staffCount,
                total_price: selectedPrice.total_price,
                price_breakdown: selectedPrice.price_breakdown,
                requestid: dayPrice.request_id,
            });

            if (response.status === 200) {
                setShowLoadingModal(false);
                onAccept(staffCount, selectedPrice.total_price);
            }
        } catch (err) {
            setError('Failed to confirm price. Please try again.');
            console.error('Error confirming price:', err);
            setShowLoadingModal(false);
        }
    };

    if (!isOpen) return null;

    const staffOptions = Object.keys(dayPrice.staff_prices);
    const selectedPrice = dayPrice.staff_prices[selectedStaff];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                when: 'afterChildren',
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
    };

    return (
        <>
            <LoadingModal isOpen={showLoadingModal} />

            <AnimatePresence>
                {!isLoading && (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-[60] overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.75 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800"
                            onClick={onClose}
                        />

                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <motion.div
                                variants={itemVariants}
                                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[61]"
                            >
                                <div className="bg-white px-6 pt-6 pb-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <motion.h3 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                                            {format(new Date(dayPrice.date), 'EEEE, MMMM d, yyyy')}
                                        </motion.h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                                        >
                                            <XCircleIcon className="h-6 w-6" />
                                        </motion.button>
                                    </div>

                                    {/* Staff Selection Tabs */}
                                    <motion.div variants={itemVariants} className="mb-6">
                                        <nav className="flex space-x-2" aria-label="Staff selection">
                                            {staffOptions.map((staff) => {
                                                const staffCount = parseInt(staff.split('_')[1]);
                                                return (
                                                    <motion.button
                                                        key={staff}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedStaff(staff)}
                                                        className={`${
                                                            selectedStaff === staff ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        } px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex-1 flex items-center justify-center space-x-2`}
                                                    >
                                                        <StaffCountIcon count={staffCount} />
                                                        <span>{staff.replace('_', ' ').toUpperCase()}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </nav>
                                    </motion.div>

                                    {/* Main Price Display */}
                                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl mb-6 shadow-inner">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-4xl font-bold text-gray-900 mb-2">{formatCurrency(selectedPrice.total_price)}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {dayPrice.is_weekend && (
                                                        <motion.span whileHover={{ scale: 1.05 }} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium shadow-sm">
                                                            Weekend Rate
                                                        </motion.span>
                                                    )}
                                                    {dayPrice.is_holiday && (
                                                        <motion.span whileHover={{ scale: 1.05 }} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium shadow-sm">
                                                            Holiday Rate
                                                        </motion.span>
                                                    )}
                                                    {dayPrice.weather_condition !== 'normal' && (
                                                        <motion.span whileHover={{ scale: 1.05 }} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium shadow-sm">
                                                            {dayPrice.weather_condition}
                                                        </motion.span>
                                                    )}
                                                    {dayPrice.traffic_multiplier > 1 && (
                                                        <motion.span whileHover={{ scale: 1.05 }} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium shadow-sm">
                                                            Traffic x{dayPrice.traffic_multiplier}
                                                        </motion.span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-4">
                                                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                                                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                                                    <span className="text-green-700 font-medium">42% saving vs other companies</span>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                                                    <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                                                    <span className="text-blue-700 font-medium">Money Back Guarantee & Free Cancellation!</span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Price Breakdown Toggle */}
                                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowBreakdown(!showBreakdown)}>
                                        <h4 className="text-lg font-semibold text-gray-900">Price Breakdown</h4>
                                        <InformationCircleIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showBreakdown ? 'rotate-180' : ''}`} />
                                    </motion.div>

                                    {/* Price Breakdown Content */}
                                    <AnimatePresence>
                                        {showBreakdown && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                                    {Object.entries(selectedPrice.price_breakdown).map(([key, value]) => (
                                                        <motion.div key={key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-between items-center">
                                                            <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                                                            <span className="text-gray-900 font-medium">{formatCurrency(value)}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Action Buttons */}
                                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAccept}
                                        disabled={isLoading}
                                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />}
                                        <span>{isLoading ? 'Confirming...' : 'Accept Price'}</span>
                                    </motion.button>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PriceDetailsModal;
