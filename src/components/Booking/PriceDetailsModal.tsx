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
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gradient-to-br from-gray-900 to-blue-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 50 }}
                            className="inline-block align-bottom bg-white rounded-[1.75rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10"
                        >
                            {/* Enhanced Header Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-200/60">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <motion.div 
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-flat"
                                        >
                                            <DocumentCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Confirm Your Moving Plan</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Select team size and review pricing details</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                                    >
                                        <XCircleIcon className="h-5 w-5 sm:h-7 sm:w-7" />
                                    </motion.button>
                                </div>

                                {/* Date and Status Ribbon */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl shadow-flat border border-gray-200/50"
                                    >
                                        <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1.5 sm:mr-2" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                                            {format(new Date(dayPrice.date), 'EEEE, MMM d')}
                                        </span>
                                    </motion.div>
                                    
                                    {dayPrice.is_weekend && (
                                        <motion.div 
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200"
                                        >
                                            <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-1.5 sm:mr-2" />
                                            <span className="text-xs sm:text-sm font-medium text-yellow-700">
                                                Weekend Rate
                                            </span>
                                        </motion.div>
                                    )}
                                    
                                    {dayPrice.is_holiday && (
                                        <motion.div 
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-lg sm:rounded-xl border border-red-200"
                                        >
                                            <ClipboardDocumentCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-1.5 sm:mr-2" />
                                            <span className="text-xs sm:text-sm font-medium text-red-700">
                                                {dayPrice.holiday_name || 'Public Holiday'}
                                            </span>
                                        </motion.div>
                                    )}
                                    
                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl shadow-flat border border-gray-200/50"
                                    >
                                        <CloudIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-1.5 sm:mr-2" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                                            {dayPrice.weather_type} weather
                                        </span>
                                    </motion.div>

                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl shadow-flat border border-gray-200/50"
                                    >
                                        <TruckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-1.5 sm:mr-2" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                                            {dayPrice.status}
                                        </span>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50">
                                {/* Enhanced Staff Selection */}
                                <div className="mb-6">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 sm:mb-6">
                                        Team Configuration
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 sm:gap-4">
                                        {dayPrice.staff_prices.map((_, index) => {
                                            const staffOption = `staff_${index + 1}`;
                                            const isSelected = selectedStaff === staffOption;
                                            return (
                                                <motion.button
                                                    key={staffOption}
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleStaffSelect(staffOption)}
                                                    className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-white shadow-lg shadow-blue-100/50'
                                                            : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex -space-x-1 sm:-space-x-2 mb-2 sm:mb-3">
                                                            {Array.from({ length: index + 1 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={isSelected ? { 
                                                                        y: [0, -3, 0],
                                                                        transition: { delay: i * 0.1, repeat: Infinity } 
                                                                    } : {}}
                                                                    className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center ${
                                                                        isSelected 
                                                                            ? 'bg-blue-100 border-blue-200 shadow-inner' 
                                                                            : 'bg-gray-50 border-gray-100'
                                                                    }`}
                                                                >
                                                                    <UserIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span className={`text-[10px] sm:text-sm font-medium ${
                                                                isSelected ? 'text-blue-700' : 'text-gray-700'
                                                            }`}>
                                                                {index + 1}
                                                            </span>
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="text-blue-500"
                                                                >
                                                                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Enhanced Price Breakdown */}
                                {selectedPrice && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white rounded-2xl p-6 shadow-flat border border-gray-200/50 mb-8"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                                <h4 className="text-lg font-semibold text-gray-900">Price Breakdown</h4>
                                                <div className="flex items-center space-x-2">
                                                    <CurrencyPoundIcon className="h-6 w-6 text-blue-600" />
                                                    <span className="text-3xl font-bold text-blue-600">
                                                        {formatCurrency(selectedPrice.price)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Cost Components */}
                                                <div className="space-y-3">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Base Costs</h5>
                                                    {selectedPrice.components && Object.entries(selectedPrice.components).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg">
                                                            <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                                            <span className="text-sm font-medium text-gray-700">{formatCurrency(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Multipliers */}
                                                <div className="space-y-3">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Applied Multipliers</h5>
                                                    {selectedPrice.multipliers && Object.entries(selectedPrice.multipliers).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg">
                                                            <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                                            <span className="text-sm font-medium text-blue-600">x{value.toFixed(1)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                                                    <span>Prices include VAT and service charges</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Enhanced Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                                    <motion.button
                                        whileHover={{ x: -3 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={onClose}
                                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-flat transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                        <span>Cancel Selection</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleAccept}
                                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-flat transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                                        <span>Confirm & Book Now</span>
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
