import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircleIcon, CalendarIcon, UserIcon, TruckIcon, ClipboardDocumentCheckIcon, ClockIcon, BuildingOfficeIcon, MapPinIcon, DocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PriceDetailsModal from './PriceDetailsModal';

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
}

interface PriceForecast {
    monthly_calendar: {
        [key: string]: DayPrice[];
    };
    date_range: {
        start_date: string;
        end_date: string;
    };
}

interface PriceForecastModalProps {
    isOpen: boolean;
    onClose: () => void;
    priceForecast: PriceForecast;
    request_id: string;
    onAccept: (staffCount: string, price: number) => void;
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

const LoadingModal: React.FC<{ isOpen: boolean; onComplete: () => void }> = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { icon: TruckIcon, label: 'Checking Vehicle Availability', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { icon: ClipboardDocumentCheckIcon, label: 'Verifying Route', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { icon: ClockIcon, label: 'Calculating Time', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { icon: BuildingOfficeIcon, label: 'Confirming Location', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        { icon: MapPinIcon, label: 'Checking Traffic', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { icon: DocumentCheckIcon, label: 'Finalizing Details', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    ];

    React.useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setStep((prev) => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        onComplete();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 500);
            return () => clearInterval(interval);
        } else {
            setStep(0);
        }
    }, [isOpen, onComplete]);

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

const PriceForecastModal: React.FC<PriceForecastModalProps> = ({ isOpen, onClose, priceForecast, request_id, onAccept }) => {
    const [selectedDay, setSelectedDay] = useState<DayPrice | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowLoading(true);
            const timer = setTimeout(() => {
                setShowLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(amount);
    };

    const getStaffOptions = () => {
        const firstMonth = Object.values(priceForecast.monthly_calendar)[0];
        if (!firstMonth || firstMonth.length === 0) return [];
        return Object.keys(firstMonth[0].staff_prices);
    };

    const handleAccept = (staffCount: string) => {
        if (selectedDay) {
            const selectedPrice = selectedDay.staff_prices[staffCount];
            console.log('Selected day:', selectedDay);
            console.log('Selected price:', staffCount, selectedPrice);
            onAccept(staffCount, selectedPrice.total_price);
        }
    };

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

    const staffOptions = getStaffOptions();
    const monthlyCalendar = priceForecast.monthly_calendar || {};

    // Find the best price for each day
    const getBestPrice = (day: DayPrice) => {
        const prices = Object.values(day.staff_prices).map((price) => price.total_price);
        return Math.min(...prices);
    };

    // Find which staff option has the best price for a day
    const getBestStaffOption = (day: DayPrice) => {
        let bestStaff = '';
        let bestPrice = Infinity;

        Object.entries(day.staff_prices).forEach(([staff, price]) => {
            if (price.total_price < bestPrice) {
                bestPrice = price.total_price;
                bestStaff = staff;
            }
        });

        return bestStaff;
    };

    // Handle price selection and return to API
    const handlePriceSelect = async (day: DayPrice, staffOption: string) => {
        try {
            // Here you would make the API call to save the selection
            const response = await fetch('/api/price-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: day.date,
                    staff_option: staffOption,
                    price: day.staff_prices[staffOption].total_price,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save price selection');
            }

            // Show success message or handle the response
            console.log('Price selection saved successfully');
        } catch (error) {
            console.error('Error saving price selection:', error);
            // Handle error appropriately
        }
    };

    return (
        <>
            <AnimatePresence>
                {showLoading && <LoadingModal isOpen={showLoading} onComplete={() => setShowLoading(false)} />}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 overflow-y-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800" onClick={onClose} />
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <motion.div
                            variants={itemVariants}
                            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10"
                        >
                            <div className="bg-white">
                                {/* Fixed Header Section */}
                                <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 pt-6 pb-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                                            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                                                Price Forecast for Next Two Months
                                            </motion.h3>
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

                                    {/* Staff Selection Tabs - Also Fixed */}
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
                                </div>

                                {/* Scrollable Months Section */}
                                <div className="h-[60vh] overflow-y-auto px-6 py-4">
                                    <div className="space-y-8">
                                        {Object.entries(monthlyCalendar).map(([month, days]) => (
                                            <motion.div key={month} variants={itemVariants} className="space-y-4">
                                                <h4 className="text-lg font-semibold text-gray-900 sticky top-0 bg-white py-2 z-10">{format(new Date(month + '-01'), 'MMMM yyyy')}</h4>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {days.map((day) => {
                                                        const staffPrice = day.staff_prices[selectedStaff];
                                                        const bestPrice = getBestPrice(day);
                                                        const isBestPrice = staffPrice?.total_price === bestPrice;
                                                        const bestStaff = getBestStaffOption(day);

                                                        return (
                                                            <motion.div
                                                                key={day.date}
                                                                whileHover={{ scale: 1.05, y: -5 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    console.log('the day price 2', day);
                                                                    setSelectedDay(day);
                                                                    handlePriceSelect(day, selectedStaff);
                                                                }}
                                                                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                                    day.is_weekend || day.is_holiday ? 'bg-yellow-50 hover:bg-yellow-100 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 shadow-sm'
                                                                }`}
                                                            >
                                                                <div className="flex flex-col items-center">
                                                                    <div className="text-sm font-medium text-gray-900">{format(new Date(day.date), 'd')}</div>
                                                                    <div className="text-xs text-gray-500 mb-2">{format(new Date(day.date), 'EEE')}</div>
                                                                    {staffPrice && (
                                                                        <div className="flex flex-col items-center">
                                                                            <motion.div whileHover={{ scale: 1.1 }} className="text-sm font-semibold text-blue-600">
                                                                                {formatCurrency(staffPrice.total_price)}
                                                                            </motion.div>
                                                                            {isBestPrice && (
                                                                                <motion.div
                                                                                    initial={{ scale: 0 }}
                                                                                    animate={{ scale: 1 }}
                                                                                    className="mt-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                                                                                >
                                                                                    Best Price
                                                                                </motion.div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {day.is_holiday && (
                                                                        <motion.div whileHover={{ scale: 1.1 }} className="mt-1 text-xs text-red-500">
                                                                            Holiday
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
            <AnimatePresence>
                {selectedDay && (
                    <PriceDetailsModal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} dayPrice={{ ...selectedDay, request_id: selectedDay.request_id }} onAccept={handleAccept} />
                )}
            </AnimatePresence>
        </>
    );
};

export default PriceForecastModal;
