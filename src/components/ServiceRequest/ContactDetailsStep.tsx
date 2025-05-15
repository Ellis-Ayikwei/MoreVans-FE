import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faGavel, faRoute, faLocationDot, faCar, faBuilding, faElevator, faUser, faPhone, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ServiceRequest } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import StepNavigation from './stepNavigation';
import { v4 as uuidv4 } from 'uuid';
import { submitStepToAPI, updateFormValues } from '../../store/slices/createRequestSlice';
import showMessage from '../../helper/showMessage';
import AddressAutocomplete from './AddressAutocomplete';

const propertyTypes = [
    { value: 'house_1', label: '1 Bed House' },
    { value: 'house_2', label: '2 Bed House' },
    { value: 'house_3', label: '3 Bed House' },
    { value: 'house_4', label: '4 Bed House' },
    { value: 'house_5plus', label: '5+ Bed House' },
    { value: 'flat_1', label: '1 Bed Flat' },
    { value: 'flat_2', label: '2 Bed Flat' },
    { value: 'flat_3', label: '3 Bed Flat' },
    { value: 'flat_4plus', label: '4+ Bed Flat' },
    { value: 'studio', label: 'Studio' },
    { value: 'storage', label: 'Storage Unit' },
    { value: 'flatshare', label: 'Flatshare' },
    { value: 'other', label: 'Other' }
];

const floorLevelOptions = [
    { value: 'basement', label: 'Basement' },
    { value: 'ground', label: 'Ground Floor' },
    ...Array.from({ length: 100 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`
    }))
];

const totalFloorsOptions = Array.from({ length: 100 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1} ${i === 0 ? 'Floor' : 'Floors'}`
}));

function getOrdinalSuffix(n: number): string {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

interface ContactDetailsStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    validateForm: () => Promise<any>;
    onNext: () => void;
    errors: any;
    touched: any;
    isEditing?: boolean;
    stepNumber: number;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setTouched,
    validateForm,
    onNext,
    errors,
    touched,
    isEditing = false,
    stepNumber,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const errors = await validateForm();
            if (Object.keys(errors).length > 0) {
                setTouched(
                    Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                    }, {} as { [key: string]: boolean })
                );
                return;
            }
            dispatch(updateFormValues(values));
            const result = await dispatch(
                submitStepToAPI({
                    step: stepNumber,
                    payload: {
                        contact_name: values.contact_name,
                        contact_phone: values.contact_phone,
                        contact_email: values.contact_email,
                        request_type: values.request_type,
                    },
                    isEditing,
                    request_id: values.id,
                })
            ).unwrap();

            if (result.status === 201) {
                onNext();
            } else {
                showMessage('Failed to save contact details. Please try again.', 'error');
            }
        } catch (error: any) {
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
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
                                    <AddressAutocomplete
                                        name="pickup_location"
                                        value={values.pickup_location}
                                        onChange={(value, coords) => {
                                            setFieldValue('pickup_location', value);
                                            if (coords) {
                                                setFieldValue('pickup_coordinates', coords);
                                            }
                                        }}
                                        error={errors.pickup_location}
                                        touched={touched.pickup_location}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Level</label>
                                        <Field
                                            as="select"
                                            name="pickup_floor"
                                            className={`block w-full border ${
                                                errors.pickup_floor && touched.pickup_floor ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                        >
                                            {floorLevelOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="pickup_floor" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Additional pickup property details */}
                                {values.service_type && ['Residential Moving', 'Office Relocation'].includes(values.service_type) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
                                            Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                                <Field
                                                    as="select"
                                                    name="propertyType"
                                                    className={`block w-full border ${
                                                        errors.propertyType && touched.propertyType ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {propertyTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="propertyType" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Floors in Building <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="pickup_number_of_floors"
                                                    className={`block w-full border ${
                                                        errors.pickup_number_of_floors && touched.pickup_number_of_floors
                                                            ? 'border-red-300 dark:border-red-700'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {totalFloorsOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="pickup_number_of_floors" component="p" className="text-red-500 text-xs mt-1" />
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
                                    <AddressAutocomplete
                                        name="dropoff_location"
                                        value={values.dropoff_location}
                                        onChange={(value, coords) => {
                                            setFieldValue('dropoff_location', value);
                                            if (coords) {
                                                setFieldValue('dropoff_coordinates', coords);
                                            }
                                        }}
                                        error={errors.dropoff_location}
                                        touched={touched.dropoff_location}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Level</label>
                                        <Field
                                            as="select"
                                            name="dropoff_floor"
                                            className={`block w-full border ${
                                                errors.dropoff_floor && touched.dropoff_floor ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                            } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                        >
                                            {floorLevelOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="dropoff_floor" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Additional dropoff property details */}
                                {values.service_type && ['Residential Moving', 'Office Relocation'].includes(values.service_type) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-green-600 dark:text-green-400" />
                                            Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                                <Field
                                                    as="select"
                                                    name="dropoffPropertyType"
                                                    className={`block w-full border ${
                                                        errors.dropoffPropertyType && touched.dropoffPropertyType ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {propertyTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="dropoffPropertyType" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Floors in Building <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="dropoff_number_of_floors"
                                                    className={`block w-full border ${
                                                        errors.dropoff_number_of_floors && touched.dropoff_number_of_floors
                                                            ? 'border-red-300 dark:border-red-700'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    } rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    {totalFloorsOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="dropoff_number_of_floors" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <StepNavigation onBack={() => {}} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Continue' : 'Continue'} isLastStep={false} isSubmitting={isSubmitting} />
        </div>
    );
};

export default ContactDetailsStep;
