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
} from '@fortawesome/free-solid-svg-icons';

import JourneyPlanning from './JourneryPlanning';
import StepNavigation from './stepNavigation';

const propertyTypes = ['house', 'apartment', 'office', 'storage'];
const vehicleTypes = ['motorcycle', 'car', 'suv', 'truck', 'van'];
const storageDurations = ['<1 month', '1-3 months', '3-6 months', '6+ months'];

const LocationsStep = ({ onNext, onBack }: any) => {
    const { values, setFieldValue } = useFormikContext<any>();

    // Initialize journey_stops as an empty array if it doesn't exist
    useEffect(() => {
        if (!values.journey_stops && values.request_type === 'journey') {
            setFieldValue('journey_stops', []);
        }
    }, [values.request_type, values.journey_stops, setFieldValue]);

    return (
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

            {/* Only show the standard pickup/dropoff section if not journey type */}
            {values.request_type !== 'journey' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pickup location */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                <span className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 mr-3 flex items-center justify-center text-white text-sm">A</span>
                                Pickup Address
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <Field
                                        name="pickup_location"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter full address"
                                    />
                                </div>
                                <ErrorMessage name="pickup_location" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor</label>
                                    <Field
                                        name="pickup_floor"
                                        type="number"
                                        min="0"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apt #</label>
                                    <Field
                                        name="pickup_unit_number"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Apt 42"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Parking Info
                                    </label>
                                    <Field
                                        name="pickup_parking_info"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Street parking"
                                    />
                                </div>
                            </div>

                            {/* Additional instructions */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
                                <Field
                                    as="textarea"
                                    name="pickup_instructions"
                                    rows={3}
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Any special instructions for pickup?"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dropoff location */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                <span className="h-8 w-8 rounded-full bg-green-600 dark:bg-green-500 mr-3 flex items-center justify-center text-white text-sm">B</span>
                                Dropoff Address
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <Field
                                        name="dropoff_location"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter full address"
                                    />
                                </div>
                                <ErrorMessage name="dropoff_location" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor</label>
                                    <Field
                                        name="dropoff_floor"
                                        type="number"
                                        min="0"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apt #</label>
                                    <Field
                                        name="dropoff_unit_number"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Apt 42"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Parking Info
                                    </label>
                                    <Field
                                        name="dropoff_parking_info"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Private driveway"
                                    />
                                </div>
                            </div>

                            {/* Additional instructions */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
                                <Field
                                    as="textarea"
                                    name="dropoff_instructions"
                                    rows={3}
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Any special instructions for dropoff?"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Journey Planning - show only if request_type is 'journey' */}
            {values.request_type === 'journey' && <JourneyPlanning values={values} setFieldValue={setFieldValue} />}

            {/* Type selector - visible but shows current selection */}
            <div className="mt-6">
                <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">Request Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (values.request_type !== 'instant') {
                                setFieldValue('request_type', 'instant');

                                // If we have more than 2 stops, keep only one pickup and one dropoff
                                if (values.journey_stops && values.journey_stops.length > 2) {
                                    const pickup = values.journey_stops.find((s: any) => s.type === 'pickup');
                                    const dropoff = values.journey_stops.find((s: any) => s.type === 'dropoff');

                                    if (pickup && dropoff) {
                                        setFieldValue('journey_stops', [pickup, dropoff]);
                                    }
                                }
                            }
                        }}
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
                        onClick={() => {
                            if (values.request_type !== 'journey') {
                                setFieldValue('request_type', 'journey');
                            }
                        }}
                        className={`py-4 px-5 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-colors 
              ${
                  values.request_type === 'journey'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'
              }`}
                    >
                        <FontAwesomeIcon icon={faRoute} className={`text-2xl mb-2 ${values.request_type === 'journey' ? 'text-purple-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${values.request_type === 'journey' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>Multi-Stop Journey</span>
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

            <StepNavigation onNext={onNext} onBack={onBack} />
        </div>
    );
};

export default LocationsStep;
