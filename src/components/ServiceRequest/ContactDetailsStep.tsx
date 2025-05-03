import React, { useEffect } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faTag, faGavel, faRoute, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

// Import custom hooks
import { useServiceRequestForm } from '../../hooks/useServiceRequestForm';

import StepNavigation from './stepNavigation';

interface ContactDetailsStepProps extends FormikProps<any> {
    onNext: () => void;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ values, errors, touched, onNext, setFieldValue }) => {
    // Use our custom hook to access service request functionality
    const { formTypeOptions, handlerequestTypeChange } = useServiceRequestForm();

    // Initialize journey stops when selecting journey type
    useEffect(() => {
        if (values.request_type === 'journey' && (!values.journeyStops || values.journeyStops.length === 0)) {
            handlerequestTypeChange('journey', values, setFieldValue);
        }
    }, [values.request_type, setFieldValue]);

    // Initialize service type if not present
    useEffect(() => {
        if (!values.service_type) {
            setFieldValue('service_type', '');
        }
    }, [setFieldValue, values.service_type]);

    type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Contact Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600 dark:text-blue-400" />
                        Contact Information
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <Field
                                    type="text"
                                    name="contact_name"
                                    placeholder="Your full name"
                                    className={`block form-input w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contact_name && touched.contact_name ? 'border-red-300 dark:border-red-700' : ''}`}
                                />
                            </div>
                            <ErrorMessage name="contact_name" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                        </div>

                        <div>
                            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <Field
                                    type="tel"
                                    name="contact_phone"
                                    placeholder="Your phone number"
                                    className={`block form-input w-full pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contact_phone && touched.contact_phone ? 'border-red-300 dark:border-red-700' : ''}`}
                                />
                            </div>
                            <ErrorMessage name="contact_phone" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <Field
                                    type="email"
                                    name="contact_email"
                                    onChange={(e: InputChangeEvent) => {
                                        setFieldValue('contact_email', e.target.value);
                                    }}
                                    placeholder="your.email@example.com"
                                    className={`block form-input w-full pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contact_email && touched.contact_email ? 'border-red-300 dark:border-red-700' : ''}`}
                                />
                            </div>
                            <ErrorMessage name="contact_email" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <FontAwesomeIcon icon={faGavel} className="mr-2 text-purple-600 dark:text-purple-400" />
                        Request Type
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center p-4 border ${
                                values.request_type === 'instant' ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}
                        >
                            <Field
                                type="radio"
                                name="request_type"
                                value="instant"
                                className="mr-3 h-4 w-4 text-blue-600"
                                onChange={(e: InputChangeEvent) => {
                                    // First update the Formik field
                                    setFieldValue('request_type', e.target.value);
                                    // Then use our hook to handle any side effects
                                    handlerequestTypeChange('instant', values, setFieldValue);
                                }}
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
                            <Field
                                type="radio"
                                name="request_type"
                                value="journey"
                                className="mr-3 h-4 w-4 text-green-600"
                                onChange={(e: InputChangeEvent) => {
                                    setFieldValue('request_type', e.target.value);
                                    handlerequestTypeChange('journey', values, setFieldValue);
                                }}
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
                </div>
            </div>

            {/* Service Type Section - Based on Request Type */}
            {values.request_type && values.request_type === 'instant' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                            <FontAwesomeIcon icon={faTag} className="mr-2 text-green-600 dark:text-green-400" />
                            Service Type
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">what are you moving?</label>
                            <Field
                                as="select"
                                name="service_type"
                                className="form-select w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select a service type</option>
                                {values.request_type === 'instant' ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
                                        <option value="multi_pickup">Multi-Pickup Moving</option>
                                        <option value="multi_delivery">Multi-Delivery Service</option>
                                        <option value="complex_move">Complex Moving Logistics</option>
                                        <option value="route_optimization">Route Optimization</option>
                                        <option value="scheduled_deliveries">Scheduled Multiple Deliveries</option>
                                        <option value="distributed_moving">Distributed Moving Services</option>
                                    </>
                                )}
                            </Field>
                            <ErrorMessage name="service_type" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>
            )}

            <StepNavigation onNext={onNext} showBackButton={false} />
        </div>
    );
};

export default ContactDetailsStep;
