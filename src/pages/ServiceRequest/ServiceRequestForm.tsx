import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useParams } from 'react-router-dom';
import { useServiceRequestForm } from '../../hooks/useServiceRequestForm';
import { useImageUpload } from '../../hooks/useImageUpload';
import LoadingSpinner from '../../components/ServiceRequest/LoadingSpinner';
import StepIndicator from '../../components/ServiceRequest/stepIndicator';
import { validationSchema } from '../../utilities/validationSchema/requestFormValidation';
import ContactDetailsStep from '../../components/ServiceRequest/ContactDetailsStep';
import ServiceDetailsStep from '../../components/ServiceRequest/ServiceDetailsStep';
import LocationsStep from '../../components/ServiceRequest/LocationsStep';
import ScheduleStep from '../../components/ServiceRequest/ScheduleStep';
import { ServiceRequest } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShieldAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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

/**
 * ServiceRequestForm is a reusable React component that renders a form for creating a new or editing an existing service request.
 * It takes an optional `isEditing` prop which if true, loads the service request data from the server and enables the form to be edited.
 * The component is designed to be used in a route where the service request ID is passed as a URL parameter.
 * The component handles all the form validation and submission logic and provides an interface for the parent component to get the form values.
 * @param {object} props
 * @param {boolean} [props.isEditing=false] - If true, the form is in edit mode and the component will load the service request data from the server.
 * @returns {React.ReactElement} - A React element representing the ServiceRequestForm component.
 */
const ServiceRequestForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
    const { id } = useParams<{ id: string }>();
    const { currentStep, formValues, isLoading, moveToNextStep, moveToPreviousStep, handleSubmit, setCurrentStep } = useServiceRequestForm(isEditing, id);

    // Determine if we should skip step 3 based on request_type
    const isJourneyRequest = formValues.request_type === 'journey';

    // Adjust StepIndicator count based on request type
    const totalSteps = isJourneyRequest ? 3 : 4;

    // Custom step handler that skips step 3 if it's a journey request
    const handleNextStep = (values?: any) => {
        // If moving from step 2 to 3 and it's a journey request, skip to step 4 (which becomes step 3)
        if (currentStep === 2 && isJourneyRequest) {
            moveToNextStep(values, 4); // Skip to step 4
        } else {
            moveToNextStep(values);
        }
    };

    // Custom back handler for when on step 4 (schedule) with journey request
    const handlePreviousStep = () => {
        if (currentStep === 4 && isJourneyRequest) {
            setCurrentStep(2); // Go back to step 2
        } else {
            moveToPreviousStep();
        }
    };

    // Effect to handle step adjustment if request_type changes
    useEffect(() => {
        // If we're on step 3 and request type changes to journey, move to step 4
        if (currentStep === 3 && isJourneyRequest) {
            setCurrentStep(4);
        }
    }, [isJourneyRequest, currentStep, setCurrentStep]);

    const { previewImages, handleImageUpload, removeImage } = useImageUpload(formValues.photo_urls || []);

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
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-300" />
                                    </div>
                                    <span className="ml-3 text-white font-medium">Verified Providers</span>
                                </div>
                            </div>

                            <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 transition-all hover:bg-white/20 group">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-green-300" />
                                    </div>
                                    <span className="ml-3 text-white font-medium">Insured Services</span>
                                </div>
                            </div>

                            <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 transition-all hover:bg-white/20 group">
                                <div className="flex items-center justify-center sm:justify-start">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FontAwesomeIcon icon={faThumbsUp} className="text-green-300" />
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
                            {/* Enhanced Step Indicator - adjust total steps */}
                            <StepIndicator currentStep={isJourneyRequest && currentStep === 4 ? 3 : currentStep} totalSteps={totalSteps} />

                            <Formik initialValues={formValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                                {(formikProps) => (
                                    <Form className="space-y-6">
                                        {currentStep === 1 && <ContactDetailsStep {...formikProps} onNext={() => handleNextStep(formikProps.values)} />}

                                        {currentStep === 2 && <LocationsStep {...formikProps} onNext={handleNextStep} onBack={handlePreviousStep} />}

                                        {/* Only show ServiceDetailsStep if not a journey request */}
                                        {currentStep === 3 && !isJourneyRequest && (
                                            <ServiceDetailsStep
                                                {...formikProps}
                                                onNext={handleNextStep}
                                                onBack={handlePreviousStep}
                                                previewImages={previewImages}
                                                handleImageUpload={handleImageUpload}
                                                removeImage={removeImage}
                                            />
                                        )}

                                        {currentStep === 4 && (
                                            <ScheduleStep
                                                {...formikProps}
                                                onBack={handlePreviousStep}
                                                isEditing={isEditing}
                                                // Display as step 3 for journey requests
                                                stepNumber={isJourneyRequest ? 3 : 4}
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
