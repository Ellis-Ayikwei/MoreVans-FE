import React, { useState } from 'react';
import StepNavigation from './stepNavigation';
import { Formik, Form, Field } from 'formik';
import { IconCalendar, IconCalendarCheck, IconClock, IconClipboardCheck, IconMapPin } from '@tabler/icons-react';
import { ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import { submitStepToAPI, resetForm, setCurrentStep, getPricePreview, updateFormValues } from '../../store/slices/createRequestSlice';
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
    onPriceAccept: (staffCount: string, price: number) => void;
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
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { request_id } = useSelector((state: IRootState) => state.serviceRequest);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceForecast, setPriceForecast] = useState<any>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [selectedStaffCount, setSelectedStaffCount] = useState<number>(0);
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setShowLoading(true);
            setIsSubmitting(true);
            console.log('validation values', values);
            const errors = await validateForm();
            console.log('after validation');
            console.log('the errors', errors);
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

            // Update form values before submission
            dispatch(
                updateFormValues({
                    ...values,
                    step: stepNumber,
                })
            );

            const result = await dispatch(
                submitStepToAPI({
                    step: stepNumber,
                    payload: {
                        preferred_date: values.preferred_date,
                        preferred_time: values.preferred_time,
                        is_flexible: values.is_flexible,
                        service_priority: values.service_speed,
                    },
                    isEditing,
                    request_id: values.request_id,
                })
            ).unwrap();

            if (result.status === 200 || result.status === 201) {
                if (result.data.price_forecast) {
                    const forecastData = result.data.price_forecast;
                    console.log('Setting forecast data:', forecastData);
                    setPriceForecast(forecastData);
                    // Keep loading state true for animation
                    setTimeout(() => {
                        setShowLoading(false);
                        setShowPriceModal(true);
                    }, 3000); // Increased delay to allow animation to complete
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

    const handlePriceSelect = (staffCount: string, price: number) => {
        setSelectedPrice(price);
        setSelectedStaffCount(parseInt(staffCount));
        setShowPriceModal(false);
        setShowConfirmationModal(true);
    };

    const handlePriceAccept = () => {
        onPriceAccept(selectedStaffCount.toString(), selectedPrice);
    };

    // Add this helper function inside your component
    const requiresPropertyDetails = (serviceType: string) => {
        return ['house_removal', 'office_removal', 'storage'].includes(serviceType);
    };

    // Add these debug logs at the beginning of your component
    // console.log("Journey items:", values.journey_stops?.map(stop => stop.type === 'pickup' ? stop.items : []));
    // console.log("Moving items:", values.moving_items);

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
                
            </div>

            {showLoading && <PreAnimationModal isOpen={showLoading} onClose={() => setShowLoading(false)} onComplete={() => setShowLoading(false)} isLoading={showLoading} />}

            <StepNavigation onBack={onBack} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Get Prices' : 'Get Prices'} isLastStep={true} isSubmitting={isSubmitting} />

            <PriceForecastModal showPriceModal={showPriceModal}      onClose={() => setShowPriceModal(false)} priceForecast={priceForecast} request_id={values.id} onAccept={handlePriceSelect} />

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
                onConfirm={handlePriceAccept}
            />
        </div>
    );
};

export default ScheduleStep;
