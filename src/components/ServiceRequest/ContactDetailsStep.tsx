import React, { useEffect } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faPhone, faEnvelope, faTag, faGavel, faRoute
} from '@fortawesome/free-solid-svg-icons';

// Import custom hooks
import { useServiceRequestForm } from '../../hooks/useServiceRequestForm';

import StepNavigation from './stepNavigation';

interface ContactDetailsStepProps extends FormikProps<any> {
  onNext: () => void;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ 
  values, errors, touched, onNext, setFieldValue
}) => {
  // Use our custom hook to access service request functionality
  const { 
    formTypeOptions, 
    handleRequestTypeChange,
  } = useServiceRequestForm();

  // Initialize journey stops when selecting journey type
  useEffect(() => {
    if (values.requestType === 'journey' && (!values.journeyStops || values.journeyStops.length === 0)) {
      handleRequestTypeChange('journey', values, setFieldValue);
    }
  }, [values.requestType, setFieldValue]);


  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
  return (
    <div className="space-y-6 animate-fadeIn">
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
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="contactName"
                  placeholder="Your full name"
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contactName && touched.contactName ? 'border-red-300 dark:border-red-700' : ''}`}
                />
              </div>
              <ErrorMessage name="contactName" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500" />
                </div>
                <Field
                  type="tel"
                  name="contactPhone"
                  placeholder="Your phone number"
                  className={`block w-full pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contactPhone && touched.contactPhone ? 'border-red-300 dark:border-red-700' : ''}`}
                />
              </div>
              <ErrorMessage name="contactPhone" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 dark:text-gray-500" />
                </div>
                <Field
                  type="email"
                  name="contactEmail"
                  onChange={(e: InputChangeEvent ) => {
                    setFieldValue('contactEmail', e.target.value);
                  }}
                  placeholder="your.email@example.com"
                  className={`block w-full pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    ${errors.contactEmail && touched.contactEmail ? 'border-red-300 dark:border-red-700' : ''}`}
                />
              </div>
              <ErrorMessage name="contactEmail" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Type Selection - Using hook data for options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            Service Type
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Now we can map through formTypeOptions instead of hardcoding */}
            <label className={`flex items-center p-4 border ${values.requestType === 'fixed' ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}>
              <Field 
                type="radio" 
                name="requestType" 
                value="fixed" 
                className="mr-3 h-4 w-4 text-blue-600" 
                onChange={(e: InputChangeEvent) => {
                  // First update the Formik field
                  setFieldValue('requestType', e.target.value);
                  // Then use our hook to handle any side effects
                  handleRequestTypeChange('fixed', values, setFieldValue);
                }}
              />
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Fixed Price
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get immediate binding quotes from providers. Fast and straightforward.
                </p>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border ${values.requestType === 'bidding' ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}>
              <Field 
                type="radio" 
                name="requestType" 
                value="bidding" 
                className="mr-3 h-4 w-4 text-purple-600" 
                onChange={(e: InputChangeEvent) => {
                  setFieldValue('requestType', e.target.value);
                  handleRequestTypeChange('bidding', values, setFieldValue);
                }}
              />
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  <FontAwesomeIcon icon={faGavel} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Competitive Bidding
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Compare multiple offers from providers. Best for complex jobs.
                </p>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border ${values.requestType === 'journey' ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}>
              <Field 
                type="radio" 
                name="requestType" 
                value="journey" 
                className="mr-3 h-4 w-4 text-green-600"
                onChange={(e: InputChangeEvent) => {
                  setFieldValue('requestType', e.target.value);
                  handleRequestTypeChange('journey', values, setFieldValue);
                }}
              />
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  <FontAwesomeIcon icon={faRoute} className="mr-2 text-green-600 dark:text-green-400" />
                  Multi-Stop Journey
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Plan a route with multiple pickups and dropoffs for complex moves.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <StepNavigation
        onNext={onNext}
        showBackButton={false}
      />
    </div>
  );
};

export default ContactDetailsStep;