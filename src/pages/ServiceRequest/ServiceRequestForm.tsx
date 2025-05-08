import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageUpload } from '../../hooks/useImageUpload';
import LoadingSpinner from '../../components/ServiceRequest/LoadingSpinner';
import StepIndicator from '../../components/ServiceRequest/stepIndicator';
import { validationSchema, stepValidationSchemas } from '../../utilities/validationSchema/requestFormValidation';
import ContactDetailsStep from '../../components/ServiceRequest/ContactDetailsStep';
import ServiceDetailsStep from '../../components/ServiceRequest/ServiceDetailsStep';
import LocationsStep from '../../components/ServiceRequest/LocationsStep';
import ScheduleStep from '../../components/ServiceRequest/ScheduleStep';
import { ServiceRequest } from '../../types';
import { IconCheck, IconShieldCheck, IconThumbUp } from '@tabler/icons-react';
import { getPricePreview, setCurrentStep, submitStepToAPI, resetForm, updateFormValues, setStepData } from '../../store/slices/createRequestSlice';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import StepNavigation from '../../components/ServiceRequest/stepNavigation';
import showMessage from '../../helper/showMessage';
// Define payload types for each step
interface Step1Payload {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    request_type: 'instant' | 'bidding' | 'journey';
}

interface Step2Payload {
    pickup_location: string;
    pickup_unit_number?: string;
    pickup_floor?: number;
    pickup_number_of_floors?: number;
    pickup_parking_info?: string;
    pickup_has_elevator?: boolean;
    dropoff_location: string;
    inventory_list?: string;
    property_type?: string;
    dropoff_unit_number?: string;
    special_handling?: string;
    dropoff_floor?: number;
    dropoff_number_of_rooms?: number;
    dropoff_property_type?: string;
    dropoff_number_of_floors?: number;
    dropoff_parking_info?: string;
    dropoff_has_elevator?: boolean;
    needs_disassembly?: boolean;
    is_fragile?: boolean;
    number_of_rooms?: number;
    number_of_floors?: number;
    service_type?: string;
    is_flexible?: boolean;
    needs_insurance?: boolean;
    estimated_value?: string;
    service_priority?: string;
    journey_stops?: Array<{
        id: string;
        type: 'pickup' | 'dropoff' | 'stop';
        location: string;
        unit_number?: string;
        floor?: number;
        parking_info?: string;
        has_elevator?: boolean;
        instructions?: string;
        estimated_time?: string;
    }>;
}

interface Step3Payload {
    service_type: string;
    item_size: string;
    description: string;
    photo_urls?: string[];
    moving_items?: Array<{
        id: string;
        name: string;
        description: string;
        quantity: number;
        fragile: boolean;
        needs_disassembly: boolean;
    }>;
}

interface Step4Payload {
    preferred_date: string;
    preferred_time: string;
    is_flexible: boolean;
    needs_insurance: boolean;
    estimated_value?: string;
}

type StepPayload = Step1Payload | Step2Payload | Step3Payload | Step4Payload;

// Helper function to format payload based on step
const formatStepPayload = (step: number, values: any) => {
    switch (step) {
        case 1:
            return {
                request_type: values.request_type,
                service_type: values.service_type,
                pickup_location: values.pickup_location,
                pickup_floor: values.pickup_floor,
                pickup_unit_number: values.pickup_unit_number,
                pickup_parking_info: values.pickup_parking_info,
                pickup_number_of_floors: values.pickup_number_of_floors,
                pickup_has_elevator: values.pickup_has_elevator,
                dropoff_location: values.dropoff_location,
                dropoff_floor: values.dropoff_floor,
                dropoff_unit_number: values.dropoff_unit_number,
                dropoff_parking_info: values.dropoff_parking_info,
                dropoff_number_of_floors: values.dropoff_number_of_floors,
                dropoff_has_elevator: values.dropoff_has_elevator,
                property_type: values.property_type,
                dropoff_property_type: values.dropoff_property_type,
            };
        case 2:
            return {
                journey_stops: values.journey_stops.map((stop: any) => ({
                    id: stop.id,
                    type: stop.type,
                    location: stop.location,
                    unit_number: stop.unit_number,
                    floor: stop.floor,
                    parking_info: stop.parking_info,
                    has_elevator: stop.has_elevator,
                    instructions: stop.instructions,
                    estimated_time: stop.estimated_time,
                    property_type: stop.property_type,
                    number_of_rooms: stop.number_of_rooms,
                    number_of_floors: stop.number_of_floors,
                    service_type: stop.service_type,
                    needs_disassembly: stop.needs_disassembly,
                    is_fragile: stop.is_fragile,
                    dimensions: stop.dimensions,
                    weight: stop.weight,
                    items: stop.items,
                    linked_items: stop.linked_items,
                })),
                request_type: values.request_type,
            };
        case 3:
            return {
                moving_items: values.moving_items.map((item: any) => ({
                    name: item.name,
                    category: item.category,
                    quantity: item.quantity,
                    weight: item.weight,
                    dimensions: item.dimensions,
                    value: item.value,
                    fragile: item.fragile,
                    needs_disassembly: item.needs_disassembly,
                    notes: item.notes,
                    photo: item.photo,
                })),
                inventory_list: values.inventory_list,
                photo_urls: values.photo_urls,
                special_handling: values.special_handling,
                is_flexible: values.is_flexible,
                needs_insurance: values.needs_insurance,
                needs_disassembly: values.needs_disassembly,
                is_fragile: values.is_fragile,
            };
        case 4:
            return {
                preferred_date: values.preferred_date,
                preferred_time: values.preferred_time,
                is_flexible: values.is_flexible,
                service_priority: values.service_speed,
            };
        default:
            return {};
    }
};

const initialValues: ServiceRequest = {
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    pickup_location: '',
    dropoff_location: '',
    service_type: 'Residential Moving',
    item_size: 'medium',
    preferred_date: '',
    preferred_time: '',
    estimated_value: '',
    description: '',
    pickup_floor: 0,
    pickup_unit_number: '',
    pickup_parking_info: '',
    dropoff_floor: 0,
    dropoff_unit_number: '',
    dropoff_parking_info: '',
    number_of_rooms: 1,
    number_of_floors: 1,
    property_type: 'house',
    has_elevator: false,
    dropoff_property_type: 'house',
    dropoff_number_of_rooms: 1,
    dropoff_number_of_floors: 1,
    dropoff_has_elevator: false,
    storage_duration: undefined,
    vehicle_type: 'van',
    international_destination: undefined,
    special_handling: undefined,
    is_flexible: false,
    needs_insurance: false,
    request_type: 'instant',
    photo_urls: [],
    inventory_list: undefined,
    item_weight: '',
    item_dimensions: '',
    needs_disassembly: false,
    is_fragile: false,
    pickup_number_of_floors: 1,
    pickup_has_elevator: false,
    moving_items: [],
    journey_stops: [],
};

const ServiceRequestForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentStep, formValues, isLoading, request_id } = useSelector((state: IRootState) => state.serviceRequest);
    const isJourneyRequest = formValues.request_type === 'journey';

    // Add state for modals and price forecast
    const [showPreAnimation, setShowPreAnimation] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceForecast, setPriceForecast] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form value changes
    const handleFormChange = (values: any) => {
        dispatch(
            updateFormValues({
                ...values,
                step: currentStep,
            })
        );
    };

    // Adjust StepIndicator count based on request type
    const totalSteps = isJourneyRequest ? 3 : 4;

    const handleError = (error: any) => {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    };

    const handleNextStep = async (values: any) => {
        try {
            setIsSubmitting(true);

            // Update form state before API call
            handleFormChange(values);

            // Skip API call for step 2 if request type is instant
            if (currentStep === 2 && values.request_type === 'instant') {
                dispatch(
                    setStepData({
                        step: currentStep,
                        data: {
                            ...values,
                            journey_stops: values.journey_stops || [],
                            moving_items: values.moving_items || [],
                        },
                    })
                );
                dispatch(setCurrentStep(Math.min(currentStep + 1, totalSteps)));
                window.scrollTo(0, 0);
                return;
            }

            // Format the payload based on the current step
            const formattedPayload = formatStepPayload(currentStep, values);

            // Submit the current step to the API
            const result = await dispatch(
                submitStepToAPI({
                    step: currentStep,
                    payload: formattedPayload,
                    isEditing,
                    request_id: id || values.id,
                })
            ).unwrap();

            // Handle step 4 submission (Get Prices)
            if (currentStep === totalSteps) {
                if (result.data?.price_forecast) {
                    setPriceForecast(result.data.price_forecast);
                    setShowPriceModal(true);
                } else {
                    showMessage('Unable to get price forecast. Please try again.', 'error');
                }
                return; // Stay on current step
            }

            // For all other steps, move to next step
            dispatch(setCurrentStep(Math.min(currentStep + 1, totalSteps)));
            window.scrollTo(0, 0);
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreviousStep = () => {
        dispatch(setCurrentStep(Math.max(currentStep - 1, 1)));
        window.scrollTo(0, 0);
    };

    const handlePriceAccept = (staffCount: string, price: number) => {
        setShowPriceModal(false);
        showMessage(isEditing ? 'Request updated successfully.' : 'Request created successfully.', 'success');
        dispatch(resetForm());
        navigate(isEditing ? `/account/bookings/${request_id}` : '/my-bookings');
    };

    const handleStepSubmit = async (values: any) => {
        await handleNextStep(values);
    };

    const { previewImages, handleImageUpload, removeImage } = useImageUpload(formValues.photo_urls || []);

    // Get the appropriate validation schema for the current step
    const getCurrentValidationSchema = () => {
        switch (currentStep) {
            case 1:
                return stepValidationSchemas.step1;
            case 2:
                return stepValidationSchemas.step2;
            case 3:
                return stepValidationSchemas.step3;
            case 4:
                return stepValidationSchemas.step4;
            default:
                return validationSchema;
        }
    };

    return (
        <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <div className="relative py-16 mb-10 overflow-hidden rounded-2xl shadow-2xl">
                {/* Gradient Overlay + Background Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-indigo-900/90 z-10" />
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-cover filter  opacity-125"
                        style={{
                            backgroundImage:
                                'url(https://images.unsplash.com/photo-1587813369290-091c9d432daf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                            backgroundPosition: '30% 60%',
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 text-center px-6 sm:px-10 lg:px-12 max-w-5xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        <span className="inline-block transform transition-all animate-fadeIn">{isEditing ? 'Edit Your Service Request' : 'Professional Moving Services'}</span>
                    </h1>

                    <p className="text-xl text-blue-100 mt-6 max-w-3xl mx-auto font-light opacity-90">
                        {isEditing ? 'Update the details of your existing service request below' : 'Get instant quotes from verified moving professionals in your area'}
                    </p>

                    {!isEditing && (
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 transition-all hover:bg-white/20 group">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <IconCheck className="text-green-300" size={24} />
                                    </div>
                                    <span className="ml-3 text-white font-medium">Verified Providers</span>
                                </div>
                            </div>

                            <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 transition-all hover:bg-white/20 group">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <IconShieldCheck className="text-green-300" size={24} />
                                    </div>
                                    <span className="ml-3 text-white font-medium">Insured Services</span>
                                </div>
                            </div>

                            <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 transition-all hover:bg-white/20 group">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <IconThumbUp className="text-green-300" size={24} />
                                    </div>
                                    <span className="ml-3 text-white font-medium">Satisfaction Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 relative">
                    {isLoading ? (
                        <LoadingSpinner message="Loading your request details..." />
                    ) : (
                        <>
                            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                            <Formik initialValues={formValues} validationSchema={getCurrentValidationSchema()} onSubmit={handleStepSubmit} enableReinitialize>
                                {(formikProps) => (
                                    <Form className="space-y-6" noValidate>
                                        {currentStep === 1 && (
                                            <ContactDetailsStep
                                                values={formikProps.values}
                                                handleChange={formikProps.handleChange}
                                                handleBlur={formikProps.handleBlur}
                                                setFieldValue={formikProps.setFieldValue}
                                                setTouched={formikProps.setTouched}
                                                validateForm={formikProps.validateForm}
                                                onNext={() => handleStepSubmit(formikProps.values)}
                                                errors={formikProps.errors}
                                                touched={formikProps.touched}
                                            />
                                        )}

                                        {currentStep === 2 && (
                                            <LocationsStep
                                                values={formikProps.values}
                                                handleChange={formikProps.handleChange}
                                                handleBlur={formikProps.handleBlur}
                                                setFieldValue={formikProps.setFieldValue}
                                                onNext={() => handleStepSubmit(formikProps.values)}
                                                onBack={handlePreviousStep}
                                                errors={formikProps.errors}
                                                touched={formikProps.touched}
                                            />
                                        )}

                                        {currentStep === 3 && !isJourneyRequest && (
                                            <ServiceDetailsStep
                                                values={formikProps.values}
                                                setFieldValue={formikProps.setFieldValue}
                                                onNext={() => handleStepSubmit(formikProps.values)}
                                                onBack={handlePreviousStep}
                                                isLoading={isLoading}
                                            />
                                        )}

                                        {currentStep === totalSteps && (
                                            <ScheduleStep
                                                values={formikProps.values}
                                                handleChange={formikProps.handleChange}
                                                handleBlur={formikProps.handleBlur}
                                                setFieldValue={formikProps.setFieldValue}
                                                onBack={handlePreviousStep}
                                                isEditing={isEditing}
                                                stepNumber={totalSteps}
                                                errors={formikProps.errors}
                                                touched={formikProps.touched}
                                                isLoading={isSubmitting}
                                                showPreAnimation={showPreAnimation}
                                                showPriceModal={showPriceModal}
                                                priceForecast={priceForecast}
                                                onPriceAccept={handlePriceAccept}
                                                onSubmit={() => handleStepSubmit(formikProps.values)}
                                            />
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
