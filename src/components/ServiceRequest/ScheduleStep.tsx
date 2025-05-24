import React, { useEffect, useState } from 'react';
import StepNavigation from './stepNavigation';
import { Formik, Form, Field } from 'formik';
import { IconCalendar, IconCalendarCheck, IconClock, IconClipboardCheck, IconMapPin, IconRocket } from '@tabler/icons-react';
import { ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import { submitStepToAPI, resetForm, setCurrentStep, getPricePreview, updateFormValues } from '../../store/slices/createRequestSlice';
import { useNavigate } from 'react-router-dom';
import PriceForecastModal from '../Booking/PriceForecastPage';
import PreAnimationModal from '../Booking/PreAnimationModal';
import ConfirmationModal from '../Booking/ConfirmationModal';
import { JourneyStop, RequestItem } from '../../store/slices/serviceRequestSice';
import showMessage from '../../helper/showMessage';
import { calculateRouteDetails } from '../../helper/routeCalculator';

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

interface BookingDetails {
    date: string;
    time: string;
    serviceType: string;
    staffCount: number;
    priorityType: string;
    pickupLocation: {
        address: string;
        postcode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    dropoffLocation: {
        address: string;
        postcode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
}

interface ScheduleStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    validateForm: () => Promise<any>;
    onBack: () => void;
    onNext: () => void;
    errors: any;
    touched: any;
    isEditing?: boolean;
    stepNumber: number;
    onPriceAccept: (staffCount: string, price: number, date: string) => void;
    onPriceForecast: (forecast: any) => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setTouched,
    validateForm,
    onBack,
    onNext,
    errors,
    touched,
    isEditing = false,
    stepNumber,
    onPriceAccept,
    onPriceForecast,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { request_id } = useSelector((state: IRootState) => state.serviceRequest);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [forecastData, setForecastData] = useState<any>(null);
    const [showPriceForecast, setShowPriceForecast] = useState(false);
    const [showPreAnimation, setShowPreAnimation] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [priceForecast, setPriceForecast] = useState<any>(null);
    const [requestId, setRequestId] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [selectedStaffCount, setSelectedStaffCount] = useState<number>(0);

    const calculateRouteInfo = async () => {
        try {
            if (values.request_type === 'journey') {
                // For journey requests, calculate route between all stops
                const stops = values.journey_stops || [];
                const routeDetails = await calculateRouteDetails(stops);
                return {
                    total_distance: routeDetails.totalDistance,
                    total_duration: routeDetails.totalDuration,
                    route_details: routeDetails.legs,
                };
            } else {
                // For instant requests, calculate route between pickup and dropoff
                const routeDetails = await calculateRouteDetails([{ address: values.pickup_location }, { address: values.dropoff_location }]);
                return {
                    total_distance: routeDetails.totalDistance,
                    total_duration: routeDetails.totalDuration,
                    route_details: routeDetails.legs,
                };
            }
        } catch (error) {
            console.error('Error calculating route:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        console.log('handleSubmit');
        try {
            setShowLoading(true);
            setIsSubmitting(true);
            const errors = await validateForm();
            if (Object.keys(errors).length > 0) {
                setTouched(
                    Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                    }, {} as { [key: string]: boolean })
                );
                setShowLoading(false);
                return;
            }

            dispatch(
                updateFormValues({
                    ...values,
                    step: stepNumber,
                })
            );

            // Prepare addresses with coordinates
            const addresses: AddressWithCoordinates[] =
                values.request_type === 'journey'
                    ? (values.journey_stops || []).map((stop: JourneyStop) => ({
                          address: stop.address,
                          postcode: stop.postcode,
                          coordinates: stop.coordinates,
                          type: stop.type,
                      }))
                    : [
                          {
                              address: values.pickup_location,
                              postcode: values.pickup_postcode,
                              coordinates: values.pickup_coordinates,
                              type: 'pickup',
                          },
                          {
                              address: values.dropoff_location,
                              postcode: values.dropoff_postcode,
                              coordinates: values.dropoff_coordinates,
                              type: 'dropoff',
                          },
                      ];

            const result = await dispatch(
                submitStepToAPI({
                    step: stepNumber,
                    payload: {
                        preferred_date: values.preferred_date,
                        preferred_time: values.preferred_time,
                        service_level: values.service_speed,
                        addresses, // Send addresses with coordinates
                    },
                    isEditing,
                    request_id: values.request_id,
                })
            ).unwrap();

            if (result.status === 200 || result.status === 201) {
                if (result.data.price_forecast) {
                    setForecastData(result.data.price_forecast);
                    setPriceForecast(result.data.price_forecast);
                    setRequestId(result.data.request_id);
                    setShowPriceForecast(true);
                } else {
                    console.error('No price forecast in response:', result.data);
                    showMessage('Failed to get price forecast. Please try again.', 'error');
                    setShowLoading(false);
                }
            } else {
                console.error('API response error:', result);
                showMessage('Failed to save schedule details. Please try again.', 'error');
                setShowLoading(false);
            }
        } catch (error: any) {
            showMessage('An error occurred. Please try again.', 'error');
            setShowLoading(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnimationComplete = async () => {
        if (forecastData) {
            onPriceForecast(forecastData);
        }
        setShowLoading(false);
    };

    const handlePriceSelect = (staffCount: string, price: number, date: string) => {
        setFieldValue('selected_price', price);
        setFieldValue('staff_count', parseInt(staffCount.split('_')[1]));
        setFieldValue('selected_date', date);

        onPriceAccept?.(staffCount, price, date);
    };

    // Add this helper function inside your component
    const requiresPropertyDetails = (serviceType: string) => {
        return ['house_removal', 'office_removal', 'storage'].includes(serviceType);
    };

    // Add these debug logs at the beginning of your component
    // console.log("Journey items:", values.journey_stops?.map(stop => stop.type === 'pickup' ? stop.items : []));
    // console.log("Moving items:", values.moving_items);

    useEffect(() => {
        console.log('showLoading', showLoading);
    }, [showLoading]);

    const priorityOptions = [
        {
            value: 'standard',
            label: 'Standard',
            description: 'Regular delivery within 2-3 business days',
            icon: <IconClock className="w-6 h-6" />,
            priceMultiplier: 1.0,
        },
        {
            value: 'express',
            label: 'Express',
            description: 'Priority delivery within 1-2 business days (50% premium)',
            icon: <IconRocket className="w-6 h-6" />,
            priceMultiplier: 1.5,
        },
        {
            value: 'same_day',
            label: 'Same Day',
            description: 'Urgent delivery on the same day (100% premium)',
            icon: <IconCalendarCheck className="w-6 h-6" />,
            priceMultiplier: 2.0,
        },
        {
            value: 'scheduled',
            label: 'Scheduled',
            description: 'Flexible date delivery (10% discount)',
            icon: <IconCalendar className="w-6 h-6" />,
            priceMultiplier: 0.9,
        },
    ];

    const handlePreAnimationContinue = () => {
        setShowPreAnimation(false);
        setShowConfirmation(true);
    };

    const handleConfirmation = () => {
        setShowConfirmation(false);
        dispatch(resetForm());
        navigate('/dashboard');
    };

    const getBookingDetails = (): BookingDetails => {
        return {
            date: values.preferred_date,
            time: values.preferred_time,
            serviceType: values.request_type === 'journey' ? 'Multi-Stop Journey' : 'Standard Service',
            staffCount: selectedStaffCount,
            priorityType: values.service_speed,
            pickupLocation: {
                address: values.pickup_location,
                postcode: values.pickup_postcode,
                coordinates: values.pickup_coordinates,
            },
            dropoffLocation: {
                address: values.dropoff_location,
                postcode: values.dropoff_postcode,
                coordinates: values.dropoff_coordinates,
            },
        };
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

                        {/* Service Level Selection */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mt-6">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Select Service Level</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose your preferred delivery speed and pricing</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {priorityOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => setFieldValue('service_speed', option.value)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                                values.service_speed === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                {option.icon}
                                                <h4 className="font-medium text-gray-700 dark:text-gray-300">{option.label}</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                                            {option.priceMultiplier !== 1.0 && (
                                                <p className={`text-sm mt-2 ${option.priceMultiplier > 1 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                                                    {option.priceMultiplier > 1
                                                        ? `+${((option.priceMultiplier - 1) * 100).toFixed(0)}% premium`
                                                        : `${((1 - option.priceMultiplier) * 100).toFixed(0)}% discount`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
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
                    </div>
                </div>
            </div>

            {<PreAnimationModal isOpen={showLoading} onAnimationComplete={handleAnimationComplete} />}

            <StepNavigation onBack={onBack} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Get Prices' : 'Get Prices'} isLastStep={true} isSubmitting={isSubmitting} />

            {showPriceForecast && <PriceForecastModal priceForecast={priceForecast} request_id={requestId} onAccept={handlePriceSelect} onBack={() => setShowPriceForecast(false)} />}

            {showConfirmation && (
                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={handleConfirmation}
                    price={selectedPrice}
                    email={values.contact_email || values.email || 'user@example.com'}
                    bookingDetails={getBookingDetails()}
                    onConfirm={handlePreAnimationContinue}
                />
            )}

            {/* Price Information */}
            {values.selected_price && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Selected Price</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Staff Count:</span>
                            <select
                                value={values.staff_count}
                                onChange={(e) => setFieldValue('staff_count', parseInt(e.target.value))}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4].map((count) => (
                                    <option key={count} value={count}>
                                        {count} {count === 1 ? 'Staff' : 'Staff'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Selected Date</p>
                            <p className="text-base font-medium text-gray-900">{new Date(values.selected_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Price</p>
                            <p className="text-2xl font-bold text-blue-600">${values.selected_price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleStep;
