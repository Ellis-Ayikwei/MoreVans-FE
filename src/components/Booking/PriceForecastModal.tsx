import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, TruckIcon, ClipboardDocumentCheckIcon, ClockIcon, BuildingOfficeIcon, MapPinIcon, DocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PriceDetailsModal from './PriceDetailsModal';
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

interface PriceForecastPageProps {
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

const PriceForecastPage: React.FC<PriceForecastPageProps> = ({ priceForecast, request_id, onAccept }) => {
    const [selectedDay, setSelectedDay] = useState<DayPrice | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!priceForecast) return null;

    const getStaffOptions = () => {
        if (!priceForecast?.monthly_calendar) return [];
        const firstMonth = Object.values(priceForecast.monthly_calendar)[0];
        if (!firstMonth || firstMonth.length === 0) return [];
        const firstDay = firstMonth[0];
        if (!firstDay?.staff_prices || firstDay.staff_prices.length === 0) return [];
        return firstDay.staff_prices.map((_, index) => `staff_${index + 1}`);
    };

    const handleAccept = (staffCount: string) => {
        if (selectedDay) {
            const staffIndex = parseInt(staffCount.split('_')[1]) - 1;
            const selectedPrice = selectedDay.staff_prices[staffIndex as number];
            if (selectedPrice) {
                onAccept(staffCount, selectedPrice.price);
            }
        }
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
        if (!day.staff_prices || day.staff_prices.length === 0) return Infinity;
        const prices = day.staff_prices.map((price) => price.price).filter((price) => !isNaN(price));
        return prices.length > 0 ? Math.min(...prices) : Infinity;
    };

    // Find which staff option has the best price for a day
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

    // Handle price selection and return to API
    const handlePriceSelect = async (day: DayPrice, staffOption: string) => {
        try {
            const response = await fetch('/api/price-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: day.date,
                    staff_option: staffOption,
                    price: day.staff_prices[parseInt(staffOption.split('_')[1]) - 1].price,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save price selection');
            }

            console.log('Price selection saved successfully');
        } catch (error) {
            console.error('Error saving price selection:', error);
        }
    };

    if (showLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-700">Loading Price Forecast...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <CalendarIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Price Forecast for Next Two Months</h1>
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
                </div>

                {/* Calendar Section */}
                <div className="space-y-8">
                    {Object.entries(monthlyCalendar).map(([month, days]) => (
                        <motion.div key={month} variants={itemVariants} className="bg-white rounded-2xl shadow-sm p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">{format(new Date(month + '-01'), 'MMMM yyyy')}</h4>
                            <div className="grid grid-cols-7 gap-2">
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
                                                    handlePriceSelect(day, selectedStaff);
                                                }
                                            }}
                                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                day.is_weekend || day.is_holiday ? 'bg-yellow-50 hover:bg-yellow-100 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 shadow-sm'
                                            } ${!staffPrice || isNaN(staffPrice.price) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="text-xs text-gray-500 mb-2">{format(new Date(day.date), 'EEE')}</div>
                                                {staffPrice && !isNaN(staffPrice.price) && (
                                                    <div className="flex flex-col items-center">
                                                        <motion.div whileHover={{ scale: 1.1 }} className="text-sm font-semibold text-blue-600">
                                                            {formatCurrency(staffPrice.price)}
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
                                                        {day.holiday_name || 'Holiday'}
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

            {/* Price Details Modal */}
            {selectedDay && (
                <PriceDetailsModal 
                    isOpen={!!selectedDay} 
                    onClose={() => setSelectedDay(null)} 
                    dayPrice={{ ...selectedDay, request_id }} 
                    onAccept={handleAccept} 
                />
            )}
        </div>
    );
};

export default PriceForecastPage;
