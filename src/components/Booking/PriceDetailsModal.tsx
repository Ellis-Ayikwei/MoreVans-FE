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
    CalendarIcon,
    CloudIcon,
} from '@heroicons/react/24/outline';
import axiosInstance from '../../helper/axiosInstance';
import ConfirmationModal from './ConfirmationModal';
import { formatCurrency } from '../../helper/formatCurrency';

interface StaffPrice {
    staff_count: number;
    price: number;
    components: {
        base_price: number;
        distance_cost: number;
        weight_cost: number;
        property_cost: number;
        staff_cost: number;
        vehicle_cost: number;
        service_cost: number;
        time_cost: number;
        weather_cost: number;
        insurance_cost: number;
        fuel_surcharge: number;
        carbon_offset: number;
    };
    multipliers: {
        service_multiplier: number;
        time_multiplier: number;
        weather_multiplier: number;
        vehicle_multiplier: number;
    };
}

interface DayPrice {
    date: string;
    day: number;
    is_weekend: boolean;
    is_holiday: boolean;
    holiday_name: string | null;
    weather_type: string;
    staff_prices: StaffPrice[];
    status: string;
    request_id?: string;
}

interface PriceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayPrice: DayPrice;
    onAccept: (staffCount: string) => void;
}

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
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [selectedPrice, setSelectedPrice] = useState<StaffPrice | null>(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    useEffect(() => {
        if (dayPrice && dayPrice.staff_prices.length > 0) {
            const staffIndex = parseInt(selectedStaff.split('_')[1]) - 1;
            setSelectedPrice(dayPrice.staff_prices[staffIndex as number]);
        }
    }, [dayPrice, selectedStaff]);

    const handleAccept = async () => {
        try {
            setShowLoadingModal(true);
            const staffCount = selectedStaff;
            const response = await axiosInstance.post(`/requests/${dayPrice.request_id}/submit/`, {
                staff_count: staffCount,
                total_price: selectedPrice?.price || 0,
                requestid: dayPrice.request_id,
            });

            if (response.status === 200) {
                setShowLoadingModal(false);
                onAccept(staffCount);
            }
        } catch (err) {
            console.error('Error confirming price:', err);
            setShowLoadingModal(false);
        }
    };

    const handleStaffSelect = (staff: string) => {
        setSelectedStaff(staff);
        const staffIndex = parseInt(staff.split('_')[1]) - 1;
        setSelectedPrice(dayPrice.staff_prices[staffIndex as number]);
    };

    if (!isOpen) return null;

    return (
        <>
            <LoadingModal isOpen={showLoadingModal} />

            <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900" onClick={onClose} />
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10"
                        >
                            {/* Header Section */}
                            <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-xl">
                                            <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Select Staff & Confirm Price</h3>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </motion.button>
                                </div>

                                {/* Date and Status Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                                        <CalendarIcon className="h-4 w-4 text-gray-600 mr-2" />
                                        <span className="text-sm text-gray-700">{format(new Date(dayPrice.date), 'EEEE, MMMM d, yyyy')}</span>
                                    </div>
                                    {dayPrice.is_holiday && (
                                        <div className="flex items-center px-3 py-1.5 bg-red-50 rounded-lg">
                                            <ClipboardDocumentCheckIcon className="h-4 w-4 text-red-600 mr-2" />
                                            <span className="text-sm text-red-700">{dayPrice.holiday_name || 'Holiday'}</span>
                                        </div>
                                    )}
                                    {dayPrice.is_weekend && (
                                        <div className="flex items-center px-3 py-1.5 bg-yellow-50 rounded-lg">
                                            <ClockIcon className="h-4 w-4 text-yellow-600 mr-2" />
                                            <span className="text-sm text-yellow-700">Weekend Rate</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white px-6 py-6">
                                {/* Staff Selection */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Select Staff Count</h4>
                                    <div className="grid grid-cols-4 gap-4">
                                        {dayPrice.staff_prices.map((_, index) => {
                                            const staffOption = `staff_${index + 1}`;
                                            return (
                                                <motion.button
                                                    key={staffOption}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStaffSelect(staffOption)}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                        selectedStaff === staffOption
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                                                            : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex -space-x-2 mb-3">
                                                            {Array.from({ length: index + 1 }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                                                                        selectedStaff === staffOption ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-100'
                                                                    }`}
                                                                >
                                                                    <UserIcon className={`w-4 h-4 ${selectedStaff === staffOption ? 'text-blue-600' : 'text-gray-600'}`} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-sm font-medium">{index + 1} Staff</span>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Total Price Display */}
                                {selectedPrice && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-semibold text-gray-900">Total Price</h4>
                                            <span className="text-3xl font-bold text-blue-600">{formatCurrency(selectedPrice.price)}</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAccept}
                                        className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-100 transition-all duration-200"
                                    >
                                        Accept Price
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
};

export default PriceDetailsModal;
