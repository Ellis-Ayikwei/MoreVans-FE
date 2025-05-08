import React, { useState } from 'react';
import StepNavigation from './stepNavigation';
import { Formik, Form, Field } from 'formik';
import { IconCalendar, IconCalendarCheck, IconClock, IconClipboardCheck, IconMapPin } from '@tabler/icons-react';
import { ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import { submitStepToAPI, resetForm, setCurrentStep } from '../../store/slices/createRequestSlice';
import { useNavigate } from 'react-router-dom';
import PriceForecastModal from '../Booking/PriceForecastModal';
import PreAnimationModal from '../Booking/PreAnimationModal';
import ConfirmationModal from '../Booking/ConfirmationModal';
import { JourneyStop, RequestItem } from '../../store/slices/serviceRequestSice';
import showMessage from '../../helper/showMessage';

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

interface PriceForecastResponse {
    data: {
        message: string;
        price_forecast: {
            monthly_calendar: {
                [key: string]: DayPrice[];
            };
            date_range: {
                start_date: string;
                end_date: string;
            };
        };
    };
}

interface RequestItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    fragile: boolean;
    needs_disassembly: boolean;
    category?: string;
    weight?: string;
    dimensions?: string;
    value?: string;
    notes?: string;
    photos?: string[];
}

// Update the props interface to include formik values and other required props
interface ScheduleStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    onBack: () => void;
    isEditing?: boolean;
    stepNumber?: number;
    errors: any;
    touched: any;
    isLoading: boolean;
    showPreAnimation: boolean;
    showPriceModal: boolean;
    priceForecast: PriceForecastResponse['data']['price_forecast'] | null;
    onPriceAccept: (staffCount: string, price: number) => void;
    onSubmit: () => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    onBack,
    isEditing = false,
    stepNumber = 4,
    errors,
    touched,
    isLoading,
    showPreAnimation,
    showPriceModal,
    priceForecast,
    onPriceAccept,
    onSubmit,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { request_id } = useSelector((state: IRootState) => state.serviceRequest);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [selectedStaffCount, setSelectedStaffCount] = useState<number>(0);
    const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);

    // Add this helper function inside your component
    const requiresPropertyDetails = (serviceType: string) => {
        return ['house_removal', 'office_removal', 'storage'].includes(serviceType);
    };

    // Add these debug logs at the beginning of your component
    // console.log("Journey items:", values.journey_stops?.map(stop => stop.type === 'pickup' ? stop.items : []));
    // console.log("Moving items:", values.moving_items);

    const handlePriceAccept = (staffCount: string, price: number) => {
        setSelectedPrice(price);
        const staffCountNumber = parseInt(staffCount.split('_')[1], 10);
        setSelectedStaffCount(staffCountNumber);
        setShowConfirmationModal(true);
        onPriceAccept(staffCount, price);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Step {stepNumber}: Schedule Your Service</h2>
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                        <IconCalendar size={20} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Scheduling & Instructions</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Preferred Date & Time</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <IconCalendar className="inline-block mr-2 text-blue-600 dark:text-blue-400" size={18} />
                                    Preferred Date <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    name="preferred_date"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                <ErrorMessage name="preferred_date" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <IconClock className="inline-block mr-2 text-blue-600 dark:text-blue-400" size={18} />
                                    Preferred Time <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="select"
                                    name="preferred_time"
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a time slot</option>
                                    <option value="8:00 - 10:00">8:00 - 10:00</option>
                                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                                </Field>
                                <ErrorMessage name="preferred_time" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                <Field
                                    type="checkbox"
                                    name="is_flexible"
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                />
                                <span className="ml-2 flex items-center font-medium">
                                    <IconCalendarCheck className="mr-1.5 text-blue-600 dark:text-blue-400" size={18} />
                                    I'm flexible with scheduling
                                </span>
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">If selected, providers may suggest alternative times that could result in lower pricing</p>
                        </div>

                        <div className="pt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Scheduling Preferences</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                    <Field type="radio" name="service_speed" value="standard" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                                        <span className="font-medium block text-gray-800 dark:text-white">Standard Service</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Regular scheduling and pricing</span>
                                    </span>
                                </label>
                                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                    <Field type="radio" name="service_speed" value="express" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                                        <span className="font-medium block text-gray-800 dark:text-white">Express Service</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Premium rate for faster service</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Additional Instructions</h3>
                    </div>
                    <div className="p-6">
                        <Field
                            as="textarea"
                            name="description"
                            rows={4}
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Please provide any special instructions, access details, or specific requirements for this job..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Include details like access codes, special handling instructions, or any unique requirements.</p>
                    </div>
                </div>

                {/* Review Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                            <IconClipboardCheck className="mr-2 text-green-600 dark:text-green-400" size={20} />
                            Review Your Request
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Details</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                    <li>
                                        <span className="font-medium">Name:</span> {values.contact_name || `${values.first_name || ''} ${values.last_name || ''}`}
                                    </li>
                                    <li>
                                        <span className="font-medium">Phone:</span> {values.contact_phone || values.phone}
                                    </li>
                                    <li>
                                        <span className="font-medium">Email:</span> {values.contact_email || values.email}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Service Details</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                    <li>
                                        <span className="font-medium">Type:</span> {values.itemType || (values.request_type === 'journey' ? 'Multi-Stop Journey' : 'Standard Service')}
                                    </li>
                                    <li>
                                        <span className="font-medium">Size:</span> {values.item_size || 'Not specified'}
                                    </li>
                                    <li>
                                        <span className="font-medium">Pricing:</span>{' '}
                                        {values.request_type === 'instant' ? 'instant' : values.request_type === 'bidding' ? 'Competitive Bidding' : 'Multi-Stop Journey'}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduling</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                    <li>
                                        <span className="font-medium">Date:</span> {values.preferred_date || 'Not selected'}
                                    </li>
                                    <li>
                                        <span className="font-medium">Time:</span> {values.preferred_time || 'Not selected'}
                                    </li>
                                    <li>
                                        <span className="font-medium">Flexible:</span> {values.is_flexible ? 'Yes' : 'No'}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* For non-journey requests, show pickup/dropoff */}
                        {values.request_type !== 'journey' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pickup Location</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{values.pickup_location}</p>
                                    {(values.pickup_unit_number || values.pickup_floor > 0) && (
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                            {values.pickup_unit_number && `Unit ${values.pickup_unit_number}, `}
                                            {values.pickup_floor > 0 && `Floor ${values.pickup_floor}`}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dropoff Location</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{values.dropoff_location}</p>
                                    {(values.dropoff_unit_number || values.dropoff_floor > 0) && (
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                            {values.dropoff_unit_number && `Unit ${values.dropoff_unit_number}, `}
                                            {values.dropoff_floor > 0 && `Floor ${values.dropoff_floor}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Journey Details - only show for journey requests */}
                        {values.request_type === 'journey' && values.journey_stops && values.journey_stops.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Journey Stops ({values.journey_stops.length})</h4>
                                <div className="space-y-4">
                                    {values.journey_stops.map((stop: any, idx: number) => (
                                        <div
                                            key={`summary-${stop.id}`}
                                            className={`p-3 rounded-lg border ${
                                                stop.type === 'pickup'
                                                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                                                    : stop.type === 'dropoff'
                                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`
                  w-6 h-6 rounded-full flex items-center justify-center mr-2
                  ${stop.type === 'pickup' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}
                  ${stop.type === 'dropoff' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : ''}
                  ${stop.type === 'stop' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' : ''}
                `}
                                                >
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}:</span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{stop.location || '(Address not entered)'}</span>
                                                </div>
                                            </div>

                                            {/* Show items for pickup stops */}
                                            {stop.type === 'pickup' && stop.items && stop.items.length > 0 && (
                                                <div className="mt-3 pl-8">
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Items to pickup ({stop.items.length}):</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {stop.items.map((item: any) => (
                                                            <div key={item.id} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                                <div className="font-medium text-gray-700 dark:text-gray-300">
                                                                    {item.name || 'Unnamed item'} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                                                </div>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {item.fragile && (
                                                                        <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded text-[10px]">Fragile</span>
                                                                    )}
                                                                    {item.needs_disassembly && (
                                                                        <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded text-[10px]">
                                                                            Disassembly
                                                                        </span>
                                                                    )}
                                                                    {item.category && (
                                                                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px]">
                                                                            {item.category}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show linked items for dropoff stops */}
                                            {stop.type === 'dropoff' && stop.linked_items && stop.linked_items.length > 0 && (
                                                <div className="mt-3 pl-8">
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Items to drop off ({stop.linked_items.length}):</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {stop.linked_items.map((itemId: string) => {
                                                            // Find the item from pickup stops
                                                            const pickupStops = values.journey_stops.filter((s: any) => s.type === 'pickup');
                                                            let foundItem = null;

                                                            for (const pickupStop of pickupStops) {
                                                                if (pickupStop.items) {
                                                                    foundItem = pickupStop.items.find((item: any) => item.id === itemId);
                                                                    if (foundItem) break;
                                                                }
                                                            }

                                                            return foundItem ? (
                                                                <div key={itemId} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                                    <div className="font-medium text-gray-700 dark:text-gray-300">
                                                                        {foundItem.name || 'Unnamed item'} {foundItem.quantity > 1 ? `(x${foundItem.quantity})` : ''}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {foundItem.fragile && (
                                                                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded text-[10px]">
                                                                                Fragile
                                                                            </span>
                                                                        )}
                                                                        {foundItem.needs_disassembly && (
                                                                            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded text-[10px]">
                                                                                Disassembly
                                                                            </span>
                                                                        )}
                                                                        {foundItem.category && (
                                                                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[10px]">
                                                                                {foundItem.category}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show additional details if available */}
                                            {stop.instructions && (
                                                <div className="mt-2 pl-8 text-xs text-gray-600 dark:text-gray-400">
                                                    <p className="font-medium">Instructions:</p>
                                                    <p className="italic">{stop.instructions}</p>
                                                </div>
                                            )}

                                            {stop.property_type && requiresPropertyDetails(stop.service_type) && (
                                                <div className="mt-2 pl-8 text-xs">
                                                    <p className="font-medium text-gray-600 dark:text-gray-400">Property:</p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {stop.property_type.charAt(0).toUpperCase() + stop.property_type.slice(1)},{stop.number_of_rooms}{' '}
                                                        {stop.number_of_rooms === 1 ? 'room' : 'rooms'},{stop.number_of_floors} {stop.number_of_floors === 1 ? 'floor' : 'floors'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Show both journey items and moving items in review */}
                        <div className="mt-4">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Items Inventory</h4>

                            {/* Show journey items if present */}
                            {values.request_type === 'journey' &&
                                values.journey_stops &&
                                values.journey_stops.some((stop: JourneyStop) => stop.type === 'pickup' && stop.items && Array.isArray(stop.items) && stop.items.length > 0) && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Journey Items:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {values.journey_stops
                                                .filter((stop: JourneyStop) => stop.type === 'pickup')
                                                .flatMap((stop: JourneyStop) =>
                                                    (stop.items || []).map((item: RequestItem) => (
                                                        <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                                                {item.name || 'Unnamed item'} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {item.category && typeof item.category === 'string' && `${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`}
                                                                {item.weight && ` · ${item.weight}kg`}
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {item.fragile && (
                                                                    <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded text-xs">Fragile</span>
                                                                )}
                                                                {item.needs_disassembly && (
                                                                    <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded text-xs">
                                                                        Disassembly
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                        </div>
                                    </div>
                                )}

                            {/* Show moving items if present */}
                            {values.moving_items && Array.isArray(values.moving_items) && values.moving_items.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{values.request_type === 'journey' ? 'Additional Items:' : 'Items:'}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {values.moving_items.map((item: RequestItem, index: number) => (
                                            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-start">
                                                    {item.photos && item.photos.length > 0 && (
                                                        <div className="mr-3">
                                                            <img
                                                                src={typeof item.photos[0] === 'string' ? item.photos[0] : URL.createObjectURL(item.photos[0])}
                                                                alt={item.name}
                                                                className="h-12 w-12 object-cover rounded border border-gray-200 dark:border-gray-700"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-800 dark:text-gray-200">{item.name || 'Unnamed item'}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.category && typeof item.category === 'string' && `${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`}
                                                            {item.quantity > 1 && ` · Qty: ${item.quantity}`}
                                                            {item.weight && ` · ${item.weight}kg`}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {item.fragile && (
                                                                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded text-xs">Fragile</span>
                                                            )}
                                                            {item.needs_disassembly && (
                                                                <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded text-xs">
                                                                    Disassembly
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.notes && (
                                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-1">{item.notes}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Show a message if no items are present */}
                            {(!values.moving_items || !Array.isArray(values.moving_items) || values.moving_items.length === 0) &&
                                (!values.journey_stops ||
                                    !values.journey_stops.some((stop: JourneyStop) => stop.type === 'pickup' && stop.items && Array.isArray(stop.items) && stop.items.length > 0)) && (
                                    <div className="text-center py-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                                        <p className="text-gray-500 dark:text-gray-400">No items have been added to this request.</p>
                                    </div>
                                )}
                        </div>

                        <div className="text-center text-sm mt-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                By submitting this request, you agree to our{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <StepNavigation onBack={onBack} nextLabel={isEditing ? 'Update Request' : 'Get Prices'} isLastStep={true} isSubmitting={isLoading} handleSubmit={onSubmit} />

            {showPreAnimation && <PreAnimationModal isOpen={showPreAnimation} onClose={() => {}} onComplete={() => {}} isLoading={true} />}

            {showPriceModal && priceForecast && (
                <div onClick={(e) => e.stopPropagation()}>
                    <PriceForecastModal isOpen={showPriceModal} onClose={() => {}} priceForecast={priceForecast} request_id={values.id} onAccept={handlePriceAccept} />
                </div>
            )}

            <ConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => {
                    setShowConfirmationModal(false);
                    setSelectedPrice(0);
                    setSelectedStaffCount(0);
                }}
                price={selectedPrice}
                email={values.contact_email || values.email || 'user@example.com'}
                bookingDetails={{
                    date: values.preferred_date,
                    time: values.preferred_time,
                    serviceType: values.request_type === 'journey' ? 'Multi-Stop Journey' : 'Standard Service',
                    staffCount: selectedStaffCount,
                    pickupLocation: values.pickup_location,
                    dropoffLocation: values.dropoff_location,
                }}
            />
        </div>
    );
};

export default ScheduleStep;
