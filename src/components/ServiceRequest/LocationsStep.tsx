import React, { useEffect } from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faBuilding,
    faCalendarAlt,
    faLocationDot,
    faTruck,
    faDollarSign,
    faPhone,
    faEnvelope,
    faWarehouse,
    faElevator,
    faCar,
    faImage,
    faClipboardList,
    faUser,
    faRulerCombined,
    faFileUpload,
    faGlobe,
    faMusic,
    faPalette,
    faCheckCircle,
    faShieldAlt,
    faThumbsUp,
    faCheck,
    faMoneyBill,
    faTag,
    faGavel,
    faArrowRight,
    faArrowLeft,
    faCamera,
    faCalendarCheck,
    faClock,
    faClipboardCheck,
    faFilePdf,
    faFile,
    faTimes,
    faCouch,
    faList,
    faPlus,
    faChevronUp,
    faChevronDown,
    faTv,
    faBlender,
    faInfoCircle,
    faWineGlassAlt,
    faDumbbell,
    faLeaf,
    faMapMarkedAlt,
    faGripLines,
    faRoute,
    faMapMarkerAlt,
    faTrash,
    faArrowUp,
    faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { useServiceRequest } from '../../hooks/useServiceRequest';
import { JourneyStop } from '../../store/slices/serviceRequestSice';
import JourneyPlanning from './JourneryPlanning';
import StepNavigation from './stepNavigation';
import { useDispatch } from 'react-redux';
import { IRootState } from '../../store';
import { useSelector } from 'react-redux';
import { setStepData, updateFormValues } from '../../store/slices/createRequestSlice';

const propertyTypes = ['house', 'apartment', 'office', 'storage'];
const vehicleTypes = ['motorcycle', 'car', 'suv', 'truck', 'van'];
const storageDurations = ['<1 month', '1-3 months', '3-6 months', '6+ months'];

interface LocationsStepProps {
    onNext: () => void;
    onBack: () => void;
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    errors: any;
    touched: any;
}

const LocationsStep: React.FC<LocationsStepProps> = ({ onNext, onBack, values, handleChange, handleBlur, setFieldValue, errors, touched }) => {
    const { addStop, updateStop, removeStop, currentRequest } = useServiceRequest();
    const dispatch = useDispatch();
    const { formValues, isEditing } = useSelector((state: IRootState) => state.serviceRequest);
    const isInstant = formValues.request_type === 'instant';

    console.log('formValues', formValues);
    console.log('values', values);

    // Update form values in Redux when they change
    useEffect(() => {
        dispatch(updateFormValues(values));
    }, [values, dispatch]);

    // Initialize journey_stops as an empty array if it doesn't exist
    useEffect(() => {
        if (!values.journey_stops && values.request_type === 'journey') {
            setFieldValue('journey_stops', []);
        }
    }, [values.request_type, values.journey_stops, setFieldValue]);

    const handleRequestTypeChange = (newType: 'instant' | 'journey') => {
        if (newType === 'instant' && values.request_type !== 'instant') {
            setFieldValue('request_type', 'instant');

            // If we have more than 2 stops, keep only one pickup and one dropoff
            if (values.journey_stops && values.journey_stops.length > 2) {
                const pickup = values.journey_stops.find((s: JourneyStop) => s.type === 'pickup');
                const dropoff = values.journey_stops.find((s: JourneyStop) => s.type === 'dropoff');

                if (pickup && dropoff) {
                    setFieldValue('journey_stops', [pickup, dropoff]);
                }
            }
        } else if (newType === 'journey' && values.request_type !== 'journey') {
            setFieldValue('request_type', 'journey');
        }
    };

    const handleStopUpdate = async (index: number, updatedStop: JourneyStop) => {
        try {
            // Update in Redux
            await updateStop(index, updatedStop);

            // Update in formik
            const updatedStops = [...values.journey_stops];
            updatedStops[index] = updatedStop;
            setFieldValue('journey_stops', updatedStops);
        } catch (error) {
            console.error('Error updating stop:', error);
        }
    };

    const handleStopAdd = async (newStop: JourneyStop) => {
        try {
            // Add to Redux
            await addStop(newStop);

            // Add to formik
            setFieldValue('journey_stops', [...(values.journey_stops || []), newStop]);
        } catch (error) {
            console.error('Error adding stop:', error);
        }
    };

    const handleStopRemove = async (index: number) => {
        try {
            // Remove from Redux
            await removeStop(index);

            // Remove from formik
            const updatedStops = values.journey_stops.filter((_: JourneyStop, i: number) => i !== index);
            setFieldValue('journey_stops', updatedStops);
        } catch (error) {
            console.error('Error removing stop:', error);
        }
    };

    const handleNext = async () => {
        try {
            // Validate form values
            // if (!values.pickup_location || !values.dropoff_location) {
            //     console.error('Required fields are missing');
            //     return;
            // }
            console.log('values from handleNext ---------', values);
            // Update step data in Redux
            dispatch(setStepData({ step: 2, data: values }));

            // Call the parent's onNext handler
            if (onNext) {
                await onNext();
            }
        } catch (error) {
            console.error('Error moving to next step:', error);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {isInstant && (
                    <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                            Your Move
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4 mt-1">
                                    <FontAwesomeIcon icon={faArrowUp} className="text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Pickup Location</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{values.pickup_location}</p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Floor {values.pickup_floor}
                                        {values.pickup_has_elevator ? ' (with elevator)' : ' (no elevator)'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start mt-5">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Dropoff Location</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{values.dropoff_location}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Floor {values.dropoff_floor}
                                        {values.dropoff_has_elevator ? ' (with elevator)' : ' (no elevator)'}
                                    </p>
                                </div>
                            </div>
                            {values.estimated_distance && (
                                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <FontAwesomeIcon icon={faRoute} className="mr-2" />
                                        <span>Estimated Distance: {values.estimated_distance} km</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Location Information</h2>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {values.request_type === 'journey' ? 'Plan Your Multi-Stop Journey' : 'Specify Pickup & Dropoff Locations'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {values.request_type === 'journey'
                                ? 'Add multiple pickup and dropoff points with complete flexibility for complex moves.'
                                : "Your journey starts with a pickup and dropoff location. Need more stops? Just add them and we'll automatically convert to a multi-stop journey."}
                        </p>
                    </div>

                    {/* Show request type indicator */}
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 flex items-center">
                        <FontAwesomeIcon icon={values.request_type === 'journey' ? faRoute : faArrowRight} className={values.request_type === 'journey' ? 'text-purple-500' : 'text-blue-500'} />
                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{values.request_type === 'journey' ? 'Multi-Stop Journey' : 'Direct Route'}</span>
                    </div>

                    {/* Journey Planning - show only if request_type is 'journey' */}
                    {values.request_type === 'journey' && (
                        <JourneyPlanning values={values} setFieldValue={setFieldValue} onStopUpdate={handleStopUpdate} onStopAdd={handleStopAdd} onStopRemove={handleStopRemove} />
                    )}

                    {/* Type selector - visible but shows current selection */}
                    <div className="mt-6">
                        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">Request Type</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleRequestTypeChange('instant')}
                                className={`py-4 px-5 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-colors 
                      ${
                          values.request_type === 'instant'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                      }`}
                            >
                                <FontAwesomeIcon icon={faArrowRight} className={`text-2xl mb-2 ${values.request_type === 'instant' ? 'text-blue-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${values.request_type === 'instant' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>Direct Route</span>
                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Simple pickup and dropoff locations</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRequestTypeChange('journey')}
                                className={`py-4 px-5 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-colors 
                      ${
                          values.request_type === 'journey'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                      }`}
                            >
                                <FontAwesomeIcon icon={faRoute} className={`text-2xl mb-2 ${values.request_type === 'journey' ? 'text-purple-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${values.request_type === 'journey' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Multi-Stop Journey
                                </span>
                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Multiple pickup, dropoff and intermediate stops</p>
                            </button>
                        </div>

                        {/* Info message about type conversion */}
                        <div className="mt-4 flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 mr-2 text-blue-500" />
                            <p>
                                You can switch between direct route and multi-stop journey at any time.
                                {values.request_type === 'instant'
                                    ? ' When you add more than two stops, your request will automatically convert to a multi-stop journey.'
                                    : ' Converting to a direct route will keep only one pickup and one dropoff location if you have multiple stops.'}
                            </p>
                        </div>
                    </div>

                    <StepNavigation onNext={handleNext} onBack={handleBack} showBackButton={true} isLastStep={false} isSubmitting={false} />
                </div>
            </div>
        </div>
    );
};

export default LocationsStep;
