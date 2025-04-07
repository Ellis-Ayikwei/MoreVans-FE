import React from 'react';
import { Formik, Form } from 'formik';
import { useParams } from 'react-router-dom';
import { useServiceRequestForm } from '../../hooks/useServiceRequestForm';
import { useImageUpload } from '../../hooks/useImageUpload';
import LoadingSpinner from '../../components/ServiceRequest/LoadingSpinner';
import StepIndicator from '../../components/ServiceRequest/stepIndicator';
import { validationSchema } from '../../utilities/validationSchema/requestFormValidation';
import ContactDetailsStep from '../../components/ServiceRequest/ContactDetailsStep';
import ServiceDetailsStep from '../../components/ServiceRequest/ServiceDetailsStep';
import LocationsStep from '../../components/ServiceRequest/LocationStep';
import ScheduleStep from '../../components/ServiceRequest/ScheduleStep';
import { ServiceRequest } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShieldAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';


const initialValues: ServiceRequest = {
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    pickupLocation: '',
    dropoffLocation: '',
    itemType: 'Residential Moving',
    itemSize: 'medium',
    preferredDate: '',
    preferredTime: '',
    estimatedValue: '',
    description: '',
    pickupFloor: 0,
    pickupUnitNumber: '',
    pickupParkingInfo: '',
    dropoffFloor: 0,
    dropoffUnitNumber: '',
    dropoffParkingInfo: '',
    numberOfRooms: 1,
    numberOfFloors: 1,
    propertyType: 'house',
    hasElevator: false,
    dropoffPropertyType: 'house',
    dropoffNumberOfRooms: 1,
    dropoffNumberOfFloors: 1,
    dropoffHasElevator: false,
    storageDuration: undefined,
    vehicleType: 'van',
    internationalDestination: undefined,
    specialHandling: undefined,
    isFlexible: false,
    needsInsurance: false,
    requestType: 'fixed',
    photoURLs: [],
    inventoryList: undefined,
    itemWeight: '',
    itemDimensions: '',
    needsDisassembly: false,
    isFragile: false,
    pickupNumberOfFloors: 1,
    pickupHasElevator: false,
    movingItems: [],
    journeyStops: [],
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
  const { 
    currentStep, 
    formValues, 
    isLoading, 
    moveToNextStep, 
    moveToPreviousStep, 
    handleSubmit 
  } = useServiceRequestForm(isEditing, id);
  

  console.log("formValues",  formValues);
  const { 
    previewImages, 
    handleImageUpload, 
    removeImage 
  } = useImageUpload(formValues.photoURLs || []);

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
        backgroundImage: 'url(https://images.unsplash.com/photo-1587813369290-091c9d432daf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundPosition: '30% 60%'
      }}
    />
  </div>
  
  {/* Content */}
  <div className="relative z-20 text-center px-6 sm:px-10 lg:px-12 max-w-5xl mx-auto">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
      <span className="inline-block transform transition-all animate-fadeIn">
        {isEditing ? 'Edit Your Service Request' : 'Professional Moving Services'}
      </span>
    </h1>
    
    <p className="text-xl text-blue-100 mt-6 max-w-3xl mx-auto font-light opacity-90">
      {isEditing 
        ? 'Update the details of your existing service request below'
        : 'Get instant quotes from verified moving professionals in your area'}
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
              {/* Enhanced Step Indicator */}
              <StepIndicator currentStep={currentStep} />
              
              <Formik 
                initialValues={formValues} 
                validationSchema={validationSchema} 
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {(formikProps) => (
                  <Form className="space-y-6">
                    {currentStep === 1 && (
                      <ContactDetailsStep
                        {...formikProps}
                        onNext={()=>moveToNextStep(formikProps.values)}
                      />
                    )}

                    {currentStep === 2 && (
                      <LocationsStep
                        {...formikProps}
                        onNext={moveToNextStep}
                        onBack={moveToPreviousStep}
                      />
                    )}

                    {currentStep === 3 && (
                      <ServiceDetailsStep
                        {...formikProps}
                        onNext={moveToNextStep}
                        onBack={moveToPreviousStep}
                        previewImages={previewImages}
                        handleImageUpload={handleImageUpload}
                        removeImage={removeImage}
                      />
                    )}

                    {currentStep === 4 && (
                      <ScheduleStep
                        {...formikProps}
                        onBack={moveToPreviousStep}
                        isEditing={isEditing}
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