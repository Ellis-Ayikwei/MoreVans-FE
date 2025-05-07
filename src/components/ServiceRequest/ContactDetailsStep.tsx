import React, { useEffect } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faGavel, faRoute, faLocationDot, faCar, faBuilding, faElevator, faUser, faPhone, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ServiceRequest } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import StepNavigation from './stepNavigation';
import { v4 as uuidv4 } from 'uuid';

const propertyTypes = ['house', 'apartment', 'office', 'storage'];

interface ContactDetailsStepProps {
    values: ServiceRequest;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    onNext: () => void;
    errors: any;
    touched: any;
    validateForm: () => Promise<any>;
    setTouched: (touched: { [field: string]: boolean }, shouldValidate?: boolean) => void;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ values, handleChange, handleBlur, setFieldValue, onNext, errors, touched, validateForm, setTouched }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleRequestTypeChange = (type: 'instant' | 'bidding' | 'journey') => {
        setFieldValue('request_type', type);

        if (type === 'journey' && (!values.journey_stops || values.journey_stops.length === 0)) {
            const initialStops = [
                {
                    id: uuidv4(),
                    type: 'pickup',
                    location: values.pickup_location || '',
                    unit_number: values.pickup_unit_number || '',
                    floor: values.pickup_floor || 0,
                    parking_info: values.pickup_parking_info || '',
                    has_elevator: values.pickup_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
                {
                    id: uuidv4(),
                    type: 'dropoff',
                    location: values.dropoff_location || '',
                    unit_number: values.dropoff_unit_number || '',
                    floor: values.dropoff_floor || 0,
                    parking_info: values.dropoff_parking_info || '',
                    has_elevator: values.dropoff_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
            ];
            setFieldValue('journey_stops', initialStops);
        }
    };

    // Initialize journey stops when selecting journey type
    useEffect(() => {
        if (values.request_type === 'journey' && (!values.journey_stops || values.journey_stops.length === 0)) {
            handleRequestTypeChange('journey');
        }
    }, [values.request_type, setFieldValue]);

    // Initialize service type if not present
    useEffect(() => {
        if (!values.service_type) {
            setFieldValue('service_type', '');
        }
    }, [setFieldValue, values.service_type]);

    const handleNextClick = async () => {
        // Mark all fields as touched to show validation errors
        const touchedFields: { [key: string]: boolean } = {
            request_type: true,
            service_type: true,
        };

        // If it's an instant request, mark location fields as touched
        if (values.request_type === 'instant') {
            touchedFields.pickup_location = true;
            touchedFields.dropoff_location = true;
            touchedFields.pickup_floor = true;
            touchedFields.dropoff_floor = true;
            touchedFields.pickup_unit_number = true;
            touchedFields.dropoff_unit_number = true;
            touchedFields.pickup_parking_info = true;
            touchedFields.dropoff_parking_info = true;

            // If it's a residential or office move, mark property details as touched
            if (values.service_type && ['Residential Moving', 'Office Relocation'].includes(values.service_type)) {
                touchedFields.pickup_number_of_floors = true;
                touchedFields.dropoff_number_of_floors = true;
                touchedFields.pickup_has_elevator = true;
                touchedFields.dropoff_has_elevator = true;
            }
        }

        // Mark all fields as touched and trigger validation
        setTouched(touchedFields, true);

        // Validate the form
        const validationErrors = await validateForm();

        // If there are no errors, proceed to next step
        if (Object.keys(validationErrors).length === 0) {
            onNext();
        }
    };

    type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Request Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <FontAwesomeIcon icon={faGavel} className="mr-2 text-purple-600 dark:text-purple-400" />
                        Request Type <span className="text-red-500">*</span>
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center p-4 border ${
                                values.request_type === 'instant' ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}
                        >
                            <input
                                type="radio"
                                name="request_type"
                                value="instant"
                                checked={values.request_type === 'instant'}
                                onChange={(e: InputChangeEvent) => {
                                    handleRequestTypeChange('instant');
                                }}
                                className="mr-3 h-4 w-4 text-blue-600"
                            />
                            <div>
                                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                    <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-600 dark:text-blue-400" />
                                    instant
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get immediate binding quotes from providers. Fast and straightforward.</p>
                            </div>
                        </label>

                        <label
                            className={`flex items-center p-4 border ${
                                values.request_type === 'journey' ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}
                        >
                            <input
                                type="radio"
                                name="request_type"
                                value="journey"
                                checked={values.request_type === 'journey'}
                                onChange={(e: InputChangeEvent) => {
                                    handleRequestTypeChange('journey');
                                }}
                                className="mr-3 h-4 w-4 text-green-600"
                            />
                            <div>
                                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                    <FontAwesomeIcon icon={faRoute} className="mr-2 text-green-600 dark:text-green-400" />
                                    Multi-Stop Journey
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Plan a route with multiple pickups and dropoffs for complex moves.</p>
                            </div>
                        </label>
                    </div>
                    {errors.request_type && touched.request_type && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.request_type}</p>}
                </div>
            </div>

            {/* Service Type Section - Based on Request Type */}
            {values.request_type === 'instant' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                            <FontAwesomeIcon icon={faTag} className="mr-2 text-green-600 dark:text-green-400" />
                            Service Type <span className="text-red-500">*</span>
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">what are you moving?</label>
                            <select
                                name="service_type"
                                value={values.service_type || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-select w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                                ${errors.service_type && touched.service_type ? 'border-red-300 dark:border-red-700' : ''}`}
                            >
                                <option value="">Select a service type</option>
                                {[
                                    'Residential Moving',
                                    'Office Relocation',
                                    'Piano Moving',
                                    'Antique Moving',
                                    'Storage Services',
                                    'Packing Services',
                                    'Vehicle Transportation',
                                    'International Moving',
                                    'Furniture Assembly',
                                    'Fragile Items',
                                    'Artwork Moving',
                                    'Industrial Equipment',
                                    'Electronics',
                                    'Appliances',
                                    'Boxes/Parcels',
                                ].map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.service_type && touched.service_type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.service_type}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Location Information - Only for instant requests */}
            {values.request_type === 'instant' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Location Information</h2>
                    </div>

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
                                            className={`block w-full border ${
                                                errors.pickup_location && touched.pickup_location ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
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
                                            className={`block w-full border ${
                                                errors.pickup_floor && touched.pickup_floor ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="0"
                                        />
                                        <ErrorMessage name="pickup_floor" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apt #</label>
                                        <Field
                                            name="pickup_unit_number"
                                            className={`block w-full border ${
                                                errors.pickup_unit_number && touched.pickup_unit_number ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="e.g., Apt 42"
                                        />
                                        <ErrorMessage name="pickup_unit_number" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                            Parking Info
                                        </label>
                                        <Field
                                            name="pickup_parking_info"
                                            className={`block w-full border ${
                                                errors.pickup_parking_info && touched.pickup_parking_info ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="e.g., Street parking"
                                        />
                                        <ErrorMessage name="pickup_parking_info" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Additional pickup property details */}
                                {values.service_type && ['Residential Moving', 'Office Relocation'].includes(values.service_type) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
                                            Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                                <Field
                                                    as="select"
                                                    name="propertyType"
                                                    className={`block w-full border ${
                                                        errors.propertyType && touched.propertyType ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {propertyTypes.map((type: string) => (
                                                        <option key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="propertyType" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    Number of Floors <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="pickup_number_of_floors"
                                                    min="1"
                                                    className={`block w-full border ${
                                                        errors.pickup_number_of_floors && touched.pickup_number_of_floors
                                                            ? 'border-red-300 dark:border-red-700'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                />
                                                <ErrorMessage name="pickup_number_of_floors" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                    <Field
                                                        type="checkbox"
                                                        name="pickup_has_elevator"
                                                        className={`rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 ${
                                                            errors.pickup_has_elevator && touched.pickup_has_elevator ? 'border-red-300 dark:border-red-700' : ''
                                                        }`}
                                                    />
                                                    <span className="ml-2 flex items-center">
                                                        <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                                        Elevator Access
                                                    </span>
                                                </label>
                                                <ErrorMessage name="pickup_has_elevator" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                            className={`block w-full border ${
                                                errors.dropoff_location && touched.dropoff_location ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
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
                                            className={`block w-full border ${
                                                errors.dropoff_floor && touched.dropoff_floor ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="0"
                                        />
                                        <ErrorMessage name="dropoff_floor" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apt #</label>
                                        <Field
                                            name="dropoff_unit_number"
                                            className={`block w-full border ${
                                                errors.dropoff_unit_number && touched.dropoff_unit_number ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="e.g., Apt 42"
                                        />
                                        <ErrorMessage name="dropoff_unit_number" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                            Parking Info
                                        </label>
                                        <Field
                                            name="dropoff_parking_info"
                                            className={`block w-full border ${
                                                errors.dropoff_parking_info && touched.dropoff_parking_info ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                            placeholder="e.g., Private driveway"
                                        />
                                        <ErrorMessage name="dropoff_parking_info" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Additional dropoff property details */}
                                {values.service_type && ['Residential Moving', 'Office Relocation'].includes(values.service_type) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-green-600 dark:text-green-400" />
                                            Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                                <Field
                                                    as="select"
                                                    name="dropoffPropertyType"
                                                    className={`block w-full border ${
                                                        errors.dropoffPropertyType && touched.dropoffPropertyType ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {propertyTypes.map((type: string) => (
                                                        <option key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="dropoffPropertyType" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    Number of Floors <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="dropoff_number_of_floors"
                                                    min="1"
                                                    className={`block w-full border ${
                                                        errors.dropoff_number_of_floors && touched.dropoff_number_of_floors
                                                            ? 'border-red-300 dark:border-red-700'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                />
                                                <ErrorMessage name="dropoff_number_of_floors" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                    <Field
                                                        type="checkbox"
                                                        name="dropoff_has_elevator"
                                                        className={`rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 ${
                                                            errors.dropoff_has_elevator && touched.dropoff_has_elevator ? 'border-red-300 dark:border-red-700' : ''
                                                        }`}
                                                    />
                                                    <span className="ml-2 flex items-center">
                                                        <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                                        Elevator Access
                                                    </span>
                                                </label>
                                                <ErrorMessage name="dropoff_has_elevator" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <StepNavigation onNext={handleNextClick} showBackButton={false} />
        </div>
    );
};

export default ContactDetailsStep;
