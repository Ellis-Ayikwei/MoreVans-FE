import { faCheck, faClipboardList, faIdCard, faTruck, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface OnboardingFormValues {
  businessName: string;
  businessType: string;
  vehicleType: string;
  vehiclePlate: string;
  serviceArea: string;
  serviceTypes: string[];
  bio: string;
  idVerification: File | null;
  vehicleRegistration: File | null;
  insurance: File | null;
  termsAccepted: boolean;
}

const ProviderOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormValues>>({});

  const serviceTypeOptions = [
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'boxes', label: 'Boxes & Packages' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'specialty', label: 'Specialty Items' },
  ];

  const vehicleTypeOptions = [
    { value: 'car', label: 'Car' },
    { value: 'van', label: 'Van' },
    { value: 'truck_small', label: 'Small Truck' },
    { value: 'truck_medium', label: 'Medium Truck' },
    { value: 'truck_large', label: 'Large Truck' },
  ];

  const businessTypeOptions = [
    { value: 'individual', label: 'Individual/Sole Proprietor' },
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
  ];

  const validationSchemas = [
    // Step 1 validation
    Yup.object({
      businessName: Yup.string().required('Business name is required'),
      businessType: Yup.string().required('Business type is required'),
      bio: Yup.string().required('Bio is required').max(500, 'Bio must be 500 characters or less'),
    }),
    
    // Step 2 validation
    Yup.object({
      vehicleType: Yup.string().required('Vehicle type is required'),
      vehiclePlate: Yup.string().required('Vehicle plate number is required'),
      serviceArea: Yup.string().required('Service area is required'),
      serviceTypes: Yup.array().min(1, 'Select at least one service type').required('Service types are required'),
    }),
    
    // Step 3 validation
    Yup.object({
      idVerification: Yup.mixed().required('ID verification is required'),
      vehicleRegistration: Yup.mixed().required('Vehicle registration is required'),
      insurance: Yup.mixed().required('Insurance proof is required'),
      termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    }),
  ];

  const handleSubmit = async (values: Partial<OnboardingFormValues>) => {
    const mergedValues = { ...formData, ...values };
    
    if (step < 3) {
      setFormData(mergedValues);
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      try {
        // In a real app, this would be an API call
        console.log('Submitting provider onboarding data:', mergedValues);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update user role if needed
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.role = 'provider';
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Redirect to provider dashboard
        navigate('/provider/dashboard');
      } catch (error) {
        console.error('Error submitting onboarding data:', error);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Information</h2>
            <p className="text-gray-600">Tell us about your business</p>
            
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <Field
                id="businessName"
                name="businessName"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="businessName" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <Field
                as="select"
                id="businessType"
                name="businessType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Business Type</option>
                {businessTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="businessType" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Business Description
              </label>
              <Field
                as="textarea"
                id="bio"
                name="bio"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your business and services..."
              />
              <ErrorMessage name="bio" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Service Details</h2>
            <p className="text-gray-600">Tell us about your services and vehicle</p>
            
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <Field
                as="select"
                id="vehicleType"
                name="vehicleType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Vehicle Type</option>
                {vehicleTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="vehicleType" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700">
                Vehicle Plate Number
              </label>
              <Field
                id="vehiclePlate"
                name="vehiclePlate"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="vehiclePlate" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-700">
                Service Area (City/Region)
              </label>
              <Field
                id="serviceArea"
                name="serviceArea"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="serviceArea" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Types
              </label>
              <div className="space-y-2">
                {serviceTypeOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <Field
                      type="checkbox"
                      name="serviceTypes"
                      value={option.value}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={option.value} className="ml-2 block text-sm text-gray-900">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="serviceTypes" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Verification Documents</h2>
            <p className="text-gray-600">Upload required documents for verification</p>
            
            <div>
              <label htmlFor="idVerification" className="block text-sm font-medium text-gray-700">
                ID Verification (Driver's License or Passport)
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="idVerification" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <Field
                          id="idVerification"
                          name="idVerification"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </label>
              </div>
              <ErrorMessage name="idVerification" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="vehicleRegistration" className="block text-sm font-medium text-gray-700">
                Vehicle Registration
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="vehicleRegistration" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <Field
                          id="vehicleRegistration"
                          name="vehicleRegistration"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </label>
              </div>
              <ErrorMessage name="vehicleRegistration" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">
                Insurance Proof
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="insurance" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <Field
                          id="insurance"
                          name="insurance"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </label>
              </div>
              <ErrorMessage name="insurance" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div className="flex items-center">
              <Field
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>
            <ErrorMessage name="termsAccepted" component="p" className="text-red-500 text-xs mt-1" />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Provider Onboarding</h1>
        <p className="text-gray-600 mt-2">Complete your profile to start offering services</p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faIdCard} />}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Business Info</div>
            </div>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 2 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTruck} />}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Service Details</div>
            </div>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Verification</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={{
            ...formData,
            businessName: formData.businessName || '',
            businessType: formData.businessType || '',
            vehicleType: formData.vehicleType || '',
            vehiclePlate: formData.vehiclePlate || '',
            serviceArea: formData.serviceArea || '',
            serviceTypes: formData.serviceTypes || [],
            bio: formData.bio || '',
            idVerification: formData.idVerification || null,
            vehicleRegistration: formData.vehicleRegistration || null,
            insurance: formData.insurance || null,
            termsAccepted: formData.termsAccepted || false,
          }}
          validationSchema={validationSchemas[step - 1]}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {renderStep()}
              
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : step < 3 ? 'Next' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProviderOnboarding; 