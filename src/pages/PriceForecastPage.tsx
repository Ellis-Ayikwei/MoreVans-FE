import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircleIcon, CalendarIcon, UserIcon, TruckIcon, ClipboardDocumentCheckIcon, ClockIcon, BuildingOfficeIcon, MapPinIcon, DocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../helper/formatCurrency';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
}

interface PriceForecast {
    pricing_configuration: string;
    base_parameters: {
        distance: number;
        weight: number;
        service_level: string;
        property_type: string;
        vehicle_type: string;
    };
    monthly_calendar: {
        [key: string]: DayPrice[];
    };
}

const StaffCountIcon: React.FC<{ count: number }> = ({ count }) => {
    const users = Array.from({ length: count }, (_, i) => i);
    return (
        <div className="flex -space-x-2">
            {users.map((index) => (
                <motion.div 
                    key={index} 
                    initial={{ x: -10, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: index * 0.1 }} 
                    className="relative"
                >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center shadow-sm">
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const PriceDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedDay: DayPrice;
    selectedStaff: string;
    onAccept: (staffCount: string) => void;
}> = ({ isOpen, onClose, selectedDay, selectedStaff, onAccept }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Price Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        <XCircleIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            Selected Date: {format(new Date(selectedDay.date), 'MMMM d, yyyy')}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {selectedDay.staff_prices[parseInt(selectedStaff.split('_')[1]) - 1]?.components && 
                            Object.entries(selectedDay.staff_prices[parseInt(selectedStaff.split('_')[1]) - 1].components)
                                .filter(([key]) => key !== 'total')
                                .map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(value)}
                                        </p>
                                    </div>
                                ))
                        }
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onAccept(selectedStaff)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Accept Price
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const PriceForecastPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedDay, setSelectedDay] = useState<DayPrice | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [showLoading, setShowLoading] = useState(true);
    const [priceForecast, setPriceForecast] = useState<PriceForecast | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPriceForecast = async () => {
            try {
                // Get request ID from location state
                const requestId = location.state?.requestId;
                if (!requestId) {
                    throw new Error('No request ID provided');
                }

                // Fetch price forecast data
                const response = await axios.get(`/api/price-forecast/${requestId}`);
                setPriceForecast(response.data);
                setShowLoading(false);
            } catch (err) {
                setError('Failed to load price forecast');
                setShowLoading(false);
                console.error('Error fetching price forecast:', err);
            }
        };

        fetchPriceForecast();
    }, [location.state]);

    const handleAccept = async (staffCount: string) => {
        if (!selectedDay) return;

        try {
            const staffIndex = parseInt(staffCount.split('_')[1]) - 1;
            const selectedPrice = selectedDay.staff_prices[staffIndex];
            
            if (!selectedPrice) {
                throw new Error('Invalid staff selection');
            }

            // Make API call to accept price
            await axios.post('/api/accept-price', {
                requestId: location.state?.requestId,
                date: selectedDay.date,
                staffCount: staffIndex + 1,
                price: selectedPrice.price
            });

            // Navigate to confirmation page
            navigate('/confirmation', {
                state: {
                    requestId: location.state?.requestId,
                    selectedDate: selectedDay.date,
                    staffCount: staffIndex + 1,
                    price: selectedPrice.price
                }
            });
        } catch (err) {
            console.error('Error accepting price:', err);
            // Handle error (show error message, etc.)
        }
    };

    const getStaffOptions = () => {
        if (!priceForecast?.monthly_calendar) return [];
        const firstMonth = Object.values(priceForecast.monthly_calendar)[0];
        if (!firstMonth || firstMonth.length === 0) return [];
        const firstDay = firstMonth[0];
        if (!firstDay?.staff_prices || firstDay.staff_prices.length === 0) return [];
        return firstDay.staff_prices.map((_, index) => `staff_${index + 1}`);
    };

    const getBestPrice = (day: DayPrice) => {
        if (!day.staff_prices || day.staff_prices.length === 0) return Infinity;
        const prices = day.staff_prices.map((price) => price.price).filter((price) => !isNaN(price));
        return prices.length > 0 ? Math.min(...prices) : Infinity;
    };

    const getBestStaffOption = (day: DayPrice) => {
        if (!day.staff_prices || day.staff_prices.length === 0) return '';
        let bestStaff = '';
        let bestPrice = Infinity;

        day.staff_prices.forEach((price, index) => {
            if (price.price < bestPrice && !isNaN(price.price)) {
                bestPrice = price.price;
                bestStaff = `staff_${index + 1}`;
            }
        });

        return bestStaff;
    };

    if (showLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading Price Forecast...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl">
                        <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const staffOptions = getStaffOptions();
    const monthlyCalendar = priceForecast?.monthly_calendar || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                <CalendarIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price Forecast</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred date and staff count</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Distance: {priceForecast?.base_parameters.distance}km
                                </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                    Weight: {priceForecast?.base_parameters.weight}kg
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Staff Selection Tabs */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <nav className="flex space-x-4" aria-label="Staff selection">
                        {staffOptions.map((staff) => {
                            const staffCount = parseInt(staff.split('_')[1]);
                            return (
                                <motion.button
                                    key={staff}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedStaff(staff)}
                                    className={`${
                                        selectedStaff === staff 
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    } px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex-1 flex items-center justify-center space-x-3 shadow-sm`}
                                >
                                    <StaffCountIcon count={staffCount} />
                                    <span>{staffCount} Staff Members</span>
                                </motion.button>
                            );
                        })}
                    </nav>
                </motion.div>

                {/* Calendar Grid */}
                <div className="space-y-8">
                    {Object.entries(monthlyCalendar).map(([month, days]) => (
                        <motion.div
                            key={month}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {format(new Date(month + '-01'), 'MMMM yyyy')}
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-4">
                                    {days.map((day) => {
                                        const staffIndex = parseInt(selectedStaff.split('_')[1]) - 1;
                                        const staffPrice = day.staff_prices?.[staffIndex as number];
                                        const bestPrice = getBestPrice(day);
                                        const isBestPrice = staffPrice?.price === bestPrice && !isNaN(staffPrice.price);
                                        const bestStaff = getBestStaffOption(day);

                                        return (
                                            <motion.div
                                                key={day.date}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    if (staffPrice && !isNaN(staffPrice.price)) {
                                                        setSelectedDay(day);
                                                    }
                                                }}
                                                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    day.is_weekend || day.is_holiday 
                                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' 
                                                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                } ${!staffPrice || isNaN(staffPrice.price) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                        {format(new Date(day.date), 'EEE')}
                                                    </div>
                                                    {staffPrice && !isNaN(staffPrice.price) && (
                                                        <div className="flex flex-col items-center">
                                                            <motion.div 
                                                                whileHover={{ scale: 1.1 }} 
                                                                className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
                                                            >
                                                                {formatCurrency(staffPrice.price)}
                                                            </motion.div>
                                                            {isBestPrice && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="mt-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full"
                                                                >
                                                                    Best Price
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {day.is_holiday && (
                                                        <motion.div 
                                                            whileHover={{ scale: 1.1 }} 
                                                            className="mt-2 text-xs text-red-500 dark:text-red-400"
                                                        >
                                                            {day.holiday_name || 'Holiday'}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Price Details Modal */}
            <AnimatePresence>
                {selectedDay && (
                    <PriceDetailsModal
                        isOpen={!!selectedDay}
                        onClose={() => setSelectedDay(null)}
                        selectedDay={selectedDay}
                        selectedStaff={selectedStaff}
                        onAccept={handleAccept}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PriceForecastPage; 