import { faBox, faCalendarAlt, faLocationDot, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface ServiceRequestFormValues {
  pickupLocation: string;
  dropoffLocation: string;
  itemType: string;
  itemSize: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
}

const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    pickupLocation: Yup.string().required('Pickup location is required'),
    dropoffLocation: Yup.string().required('Dropoff location is required'),
    itemType: Yup.string().required('Item type is required'),
    itemSize: Yup.string().required('Item size is required'),
    preferredDate: Yup.string().required('Preferred date is required'),
    preferredTime: Yup.string().required('Preferred time is required'),
  });

  const handleSubmit = async (values: ServiceRequestFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call
      console.log('Service request values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock request ID
      const requestId = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // Redirect to providers listing
      navigate(`/providers/${requestId}`);
    } catch (error) {
      console.error('Error submitting service request:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Request a Moving Service</h1>
        <p className="text-gray-600 mt-2">Fill out the form below to get matched with providers</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={{
            pickupLocation: '',
            dropoffLocation: '',
            itemType: '',
            itemSize: '',
            preferredDate: '',
            preferredTime: '',
            description: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                  </div>
                  <Field
                    id="pickupLocation"
                    name="pickupLocation"
                    type="text"
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pickup address"
                  />
                </div>
                <ErrorMessage name="pickupLocation" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              
              <div>
                <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                  Dropoff Location
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                  </div>
                  <Field
                    id="dropoffLocation"
                    name="dropoffLocation"
                    type="text"
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter dropoff address"
                  />
                </div>
                <ErrorMessage name="dropoffLocation" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">
                    Item Type
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faBox} className="text-gray-400" />
                    </div>
                    <Field
                      as="select"
                      id="itemType"
                      name="itemType"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Item Type</option>
                      <option value="furniture">Furniture</option>
                      <option value="electronics">Electronics</option>
                      <option value="boxes">Boxes & Packages</option>
                      <option value="appliances">Appliances</option>
                      <option value="specialty">Specialty Items</option>
                    </Field>
                  </div>
                  <ErrorMessage name="itemType" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                
                <div>
                  <label htmlFor="itemSize" className="block text-sm font-medium text-gray-700">
                    Item Size
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-400" />
                    </div>
                    <Field
                      as="select"
                      id="itemSize"
                      name="itemSize"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Size</option>
                      <option value="small">Small (fits in car)</option>
                      <option value="medium">Medium (fits in van)</option>
                      <option value="large">Large (requires truck)</option>
                      <option value="extra_large">Extra Large (multiple items)</option>
                    </Field>
                  </div>
                  <ErrorMessage name="itemSize" component="p" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                    Preferred Date
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                    <Field
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <ErrorMessage name="preferredDate" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                    Preferred Time
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                    <Field
                      id="preferredTime"
                      name="preferredTime"
                      type="time"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <ErrorMessage name="preferredTime" component="p" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Additional Details (Optional)
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your items or any special requirements"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Find Providers'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceRequestForm; 