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
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik, FieldArray } from 'formik';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';

// Helper functions for the component
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  // If already in format "HH:MM - HH:MM", return as is
  if (timeString.includes('-')) return timeString;
  
  // If in HH:MM format, convert to 12-hour format
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Add this to your Tailwind CSS file or inline styles
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

interface ServiceRequest {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  itemType: string;
  itemSize: string;
  preferredDate: string;
  preferredTime: string;
  estimatedValue: string;
  description: string;
  pickupFloor: number;
  pickupUnitNumber: string;
  pickupParkingInfo: string;
  dropoffFloor: number;
  dropoffUnitNumber: string;
  dropoffParkingInfo: string;
  numberOfRooms: number;
  numberOfFloors: number;
  propertyType: 'house' | 'apartment' | 'office' | 'storage';
  hasElevator: boolean;
  dropoffPropertyType: 'house' | 'apartment' | 'office' | 'storage';
  dropoffNumberOfRooms: number;
  dropoffNumberOfFloors: number;
  dropoffHasElevator: boolean;
  storageDuration?: string;
  vehicleType?: 'motorcycle' | 'car' | 'suv' | 'truck' | 'van';
  internationalDestination?: string;
  specialHandling?: string;
  isFlexible: boolean;
  needsInsurance: boolean;
  requestType: 'fixed' | 'bidding';
  photoURLs?: string[];
  inventoryList?: File;
  itemWeight?: string;
  itemDimensions?: string;
  needsDisassembly?: boolean;
  isFragile?: boolean;
  pickupNumberOfFloors: number;
  dropoffNumberOfFloors: number;
  pickupHasElevator: boolean;
  dropoffHasElevator: boolean;
  movingItems: Array<{
    name: string;
    category: string;
    quantity: number;
    weight: string;
    dimensions: string;
    value: string;
    fragile: boolean;
    needsDisassembly: boolean;
    notes: string;
    photo: File | string | null;
  }>;
}

interface ServiceRequestFormProps {
  isEditing?: boolean;
}

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
  dropoffNumberOfFloors: 1,
  pickupHasElevator: false,
  dropoffHasElevator: false,
  movingItems: [],
};

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formValues, setFormValues] = useState<ServiceRequest>(initialValues);
  const [showCommonItems, setShowCommonItems] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchBookingDetails(id);
    }
  }, [isEditing, id]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookingData = location.state?.bookingData;
      
      if (bookingData) {
        const mappedValues = {
          contactName: bookingData.customerName || '',
          contactPhone: bookingData.customerPhone || '',
          contactEmail: bookingData.customerEmail || '',
          pickupLocation: `${bookingData.pickupAddress?.street || ''}, ${bookingData.pickupAddress?.city || ''}, ${bookingData.pickupAddress?.state || ''}, ${bookingData.pickupAddress?.zipCode || ''}`,
          dropoffLocation: `${bookingData.deliveryAddress?.street || ''}, ${bookingData.deliveryAddress?.city || ''}, ${bookingData.deliveryAddress?.state || ''}, ${bookingData.deliveryAddress?.zipCode || ''}`,
          itemType: 'Residential Moving',
          itemSize: 'medium',
          preferredDate: bookingData.pickupDate || '',
          preferredTime: bookingData.pickupWindow?.split(' - ')[0] || '',
          estimatedValue: '',
          description: bookingData.specialInstructions || '',
          pickupFloor: 0,
          pickupUnitNumber: bookingData.pickupAddress?.additionalInfo || '',
          pickupParkingInfo: '',
          dropoffFloor: 0,
          dropoffUnitNumber: bookingData.deliveryAddress?.additionalInfo || '',
          dropoffParkingInfo: '',
          numberOfRooms: 1,
          numberOfFloors: 1,
          propertyType: 'house',
          hasElevator: false,
          dropoffPropertyType: 'house',
          dropoffNumberOfRooms: 1,
          dropoffNumberOfFloors: 1,
          dropoffHasElevator: false,
          requestType: bookingData.status === 'bidding' ? 'bidding' : 'fixed',
          photoURLs: [],
          isFlexible: false,
          needsInsurance: false,
        };
        
        setFormValues(mappedValues);
        
        if (bookingData.itemDetails && bookingData.itemDetails.some((item: any) => item.photos && item.photos.length > 0)) {
          const photos = bookingData.itemDetails.flatMap((item: any) => item.photos || []);
          setPreviewImages(photos);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setIsLoading(false);
    }
  };

  const itemTypes = [
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
    'Boxes/Parcels'
  ];

  const propertyTypes = ['house', 'apartment', 'office', 'storage'];
  const vehicleTypes = ['motorcycle', 'car', 'suv', 'truck', 'van'];
  const storageDurations = ['<1 month', '1-3 months', '3-6 months', '6+ months'];

  const validationSchema = Yup.object().shape({
    contactName: Yup.string().required('Name is required'),
    contactPhone: Yup.string().required('Phone number is required'),
    contactEmail: Yup.string().email('Invalid email').required('Email required'),
    pickupLocation: Yup.string().required('Pickup location required'),
    dropoffLocation: Yup.string().required('Dropoff location required'),
    itemType: Yup.string().required('Service type required'),
    itemSize: Yup.string().required('Item size required'),
    preferredDate: Yup.string().required('Date required'),
    preferredTime: Yup.string().required('Time required'),
    estimatedValue: Yup.string().required('Value estimate required'),
    pickupNumberOfFloors: Yup.number()
      .when('itemType', {
        is: (itemType: string) => ['Residential Moving', 'Office Relocation'].includes(itemType),
        then: Yup.number().required('Pickup floors required').min(1, 'At least 1 floor'),
      }),
    dropoffNumberOfFloors: Yup.number()
      .when('itemType', {
        is: (itemType: string) => ['Residential Moving', 'Office Relocation'].includes(itemType),
        then: Yup.number().required('Dropoff floors required').min(1, 'At least 1 floor'),
      }),
  });

  const handleSubmit = async (values: ServiceRequest, { setSubmitting }: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        console.log('Updating booking:', id, values);
        navigate(`/account/bookings/${id}`);
      } else {
        const requestId = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
        navigate(values.requestType === 'fixed' ? `/providers/${requestId}` : `/jobs/${requestId}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
    setSubmitting(false);
  };

  const moveToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo(0, 0);
  };

  const moveToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4 sm:px-12 relative max-w-3xl mx-auto">
      {[1, 2, 3, 4].map(step => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            step < currentStep ? 'bg-green-600' : step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            {step < currentStep ? '✓' : step}
          </div>
          <span className="text-xs mt-2 text-gray-600">
            {['Contact', 'Locations', 'Details', 'Schedule'][step - 1]}
          </span>
        </div>
      ))}
      <div className="absolute left-0 right-0 h-1 top-5 -z-10 bg-gray-200">
        <div className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
      </div>
    </div>
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews: string[] = [];
      const newUrls: string[] = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          newUrls.push(URL.createObjectURL(file));
          if (newPreviews.length === files.length) {
            setPreviewImages([...previewImages, ...newPreviews]);
            setFieldValue('photoURLs', [...(initialValues.photoURLs || []), ...newUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const movingServiceTypes = ['Residential Moving', 'Office Relocation'];

  const renderPropertyDetails = (prefix: string, label: string) => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium text-gray-800 mb-3">
        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600" />
        {label} Property Details
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faWarehouse} className="mr-2" />
            Property Type
          </label>
          <Field as="select" name={`${prefix}PropertyType`} className="w-full border rounded-md py-2 px-3">
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </Field>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Number of Floors
          </label>
          <Field 
            type="number" 
            name={`${prefix}NumberOfFloors`} 
            min="1"
            className="w-full border rounded-md py-2 px-3"
          />
          <ErrorMessage name={`${prefix}NumberOfFloors`} component="p" className="text-red-500 text-xs mt-1" />
        </div>

        <div className="flex items-center">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Field 
              type="checkbox" 
              name={`${prefix}HasElevator`} 
              className="h-4 w-4 text-blue-600 mr-2" 
            />
            <FontAwesomeIcon icon={faElevator} className="mr-2" />
            Elevator Access
          </label>
        </div>
      </div>
    </div>
  );

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'furniture':
        return faCouch;
      case 'electronics':
        return faTv;
      case 'appliances':
        return faBlender;
      case 'boxes':
        return faBox;
      case 'fragile':
        return faWineGlassAlt;
      case 'exercise':
        return faDumbbell;
      case 'garden':
        return faLeaf;
      default:
        return faBox;
    }
  };

  const commonItems = {
    furniture: [
      { name: 'Sofa/Couch (3-seater)', dimensions: '200 × 90 × 90 cm', weight: '45', needsDisassembly: false },
      { name: 'Loveseat (2-seater)', dimensions: '150 × 90 × 90 cm', weight: '35', needsDisassembly: false },
      { name: 'Armchair', dimensions: '90 × 85 × 85 cm', weight: '25', needsDisassembly: false },
      { name: 'Coffee Table', dimensions: '120 × 60 × 45 cm', weight: '15', needsDisassembly: true },
      { name: 'Dining Table', dimensions: '180 × 90 × 75 cm', weight: '30', needsDisassembly: true },
      { name: 'Dining Chair', dimensions: '45 × 45 × 90 cm', weight: '5', needsDisassembly: false },
      { name: 'Bed Frame (Double)', dimensions: '140 × 190 × 40 cm', weight: '40', needsDisassembly: true },
      { name: 'Bed Frame (King)', dimensions: '180 × 200 × 40 cm', weight: '50', needsDisassembly: true },
      { name: 'Mattress (Double)', dimensions: '140 × 190 × 25 cm', weight: '25', needsDisassembly: false },
      { name: 'Mattress (King)', dimensions: '180 × 200 × 25 cm', weight: '35', needsDisassembly: false },
      { name: 'Wardrobe', dimensions: '120 × 60 × 200 cm', weight: '60', needsDisassembly: true },
      { name: 'Chest of Drawers', dimensions: '80 × 45 × 90 cm', weight: '30', needsDisassembly: false },
      { name: 'Bookshelf', dimensions: '90 × 30 × 180 cm', weight: '25', needsDisassembly: true },
    ],
    electronics: [
      { name: 'TV (40-50 inch)', dimensions: '120 × 15 × 70 cm', weight: '15', fragile: true },
      { name: 'TV (50-65 inch)', dimensions: '150 × 15 × 90 cm', weight: '20', fragile: true },
      { name: 'Desktop Computer', dimensions: '50 × 25 × 50 cm', weight: '10', fragile: true },
      { name: 'Computer Monitor', dimensions: '60 × 20 × 40 cm', weight: '5', fragile: true },
      { name: 'Printer', dimensions: '50 × 40 × 30 cm', weight: '8', fragile: true },
      { name: 'Gaming Console', dimensions: '35 × 30 × 10 cm', weight: '3', fragile: true },
    ],
    appliances: [
      { name: 'Refrigerator', dimensions: '70 × 70 × 180 cm', weight: '80', fragile: true },
      { name: 'Washing Machine', dimensions: '60 × 60 × 85 cm', weight: '70', fragile: true },
      { name: 'Dishwasher', dimensions: '60 × 60 × 85 cm', weight: '50', fragile: true },
      { name: 'Microwave', dimensions: '50 × 40 × 30 cm', weight: '12', fragile: true },
      { name: 'Oven', dimensions: '60 × 60 × 60 cm', weight: '35', fragile: true },
      { name: 'Vacuum Cleaner', dimensions: '40 × 30 × 30 cm', weight: '7', fragile: false },
    ]
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative py-12 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(10)].map((_, i) => (
              <line key={i} x1="0" y1={i * 10} x2="100" y2={i * 10 + 5} strokeWidth="0.5" stroke="currentColor" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={i} x1={i * 10} y1="0" x2={i * 10 + 5} y2="100" strokeWidth="0.5" stroke="currentColor" />
            ))}
          </svg>
        </div>
        
        <div className="relative text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {isEditing ? 'Edit Your Service Request' : 'Professional Moving Services'}
          </h1>
          <p className="text-xl text-blue-100 mt-4 max-w-3xl mx-auto">
            {isEditing 
              ? 'Update the details of your existing service request below'
              : 'Get instant quotes from verified moving professionals in your area'}
          </p>
          
          {!isEditing && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm px-6 py-3 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-2" />
                <span className="text-white font-medium">Verified Providers</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm px-6 py-3 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-green-300 mr-2" />
                <span className="text-white font-medium">Insured Services</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm px-6 py-3 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faThumbsUp} className="text-green-300 mr-2" />
                <span className="text-white font-medium">Satisfaction Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 relative">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your request details...</p>
            </div>
          ) : (
            <>
              {/* Enhanced Step Indicator */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-2 px-4 sm:px-12 relative max-w-4xl mx-auto">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className="flex flex-col items-center z-10">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium 
                        ${step < currentStep 
                          ? 'bg-green-600 dark:bg-green-500' 
                          : step === currentStep 
                          ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900' 
                          : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        {step < currentStep ? (
                          <FontAwesomeIcon icon={faCheck} className="text-white" />
                        ) : (
                          <span>{step}</span>
                        )}
                      </div>
                      <span className={`text-sm mt-2 hidden sm:block ${
                        step === currentStep 
                          ? 'font-medium text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {['Contact', 'Locations', 'Details', 'Schedule'][step - 1]}
                      </span>
                    </div>
                  ))}
                  <div className="absolute left-0 right-0 h-1 top-6 -z-0 bg-gray-200 dark:bg-gray-700">
                    <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
                  </div>
                </div>
                <div className="sm:hidden flex justify-between px-2 mt-2">
                  {[1, 2, 3, 4].map(step => (
                    <span key={step} className={`text-xs ${
                      step === currentStep 
                        ? 'font-medium text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {['Contact', 'Locations', 'Details', 'Schedule'][step - 1]}
                    </span>
                  ))}
                </div>
              </div>
              <Formik 
                initialValues={formValues} 
                validationSchema={validationSchema} 
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center mb-6">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Contact Details</h2>
                        </div>
                        
                        <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600 dark:text-blue-400" />
                              Full Name
                              </label>
                            </div>
                            <Field 
                              name="contactName" 
                              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                              placeholder="Enter your full name"
                            />
                            <ErrorMessage name="contactName" component="p" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-600 dark:text-blue-400" />
                                Phone Number
                              </label>
                              <Field 
                                name="contactPhone" 
                                type="tel" 
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                placeholder="Enter your phone number"
                              />
                              <ErrorMessage name="contactPhone" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600 dark:text-blue-400" />
                                Email Address
                              </label>
                              <Field 
                                name="contactEmail" 
                                type="email" 
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                placeholder="Enter your email address"
                              />
                              <ErrorMessage name="contactEmail" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center mb-4">
                              <FontAwesomeIcon icon={faMoneyBill} className="text-blue-600 dark:text-blue-400 mr-2" />
                              <h3 className="font-medium text-gray-700 dark:text-gray-300">Choose Your Pricing Model</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <label className={`flex items-center p-4 border ${values.requestType === 'fixed' ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}>
                                <Field type="radio" name="requestType" value="fixed" className="mr-3 h-4 w-4 text-blue-600" />
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
                                <Field type="radio" name="requestType" value="bidding" className="mr-3 h-4 w-4 text-purple-600" />
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
                            </div>
                          </div>

                          <div className="flex justify-end mt-8">
                            <button 
                              type="button" 
                              onClick={moveToNextStep} 
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200"
                            >
                              Next: Locations
                              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </button>
                          </div>
                        </div>
                     
                    )}

                    {currentStep === 2 && (
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
                                    name="pickupLocation" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="Enter full address"
                                  />
                                </div>
                                <ErrorMessage name="pickupLocation" component="p" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Floor
                                  </label>
                                  <Field 
                                    name="pickupFloor" 
                                    type="number" 
                                    min="0" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Unit/Apt #
                                  </label>
                                  <Field 
                                    name="pickupUnitNumber" 
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
                                    name="pickupParkingInfo" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="e.g., Street parking"
                                  />
                                </div>
                              </div>
                              
                              {/* Additional pickup property details */}
                              {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
                                    Property Details
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Property Type
                                      </label>
                                      <Field as="select" name="propertyType" className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                        {propertyTypes.map(type => (
                                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                        ))}
                                      </Field>
                                    </div>

                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Number of Floors <span className="text-red-500">*</span>
                                      </label>
                                      <Field 
                                        type="number" 
                                        name="pickupNumberOfFloors" 
                                        min="1"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      />
                                      <ErrorMessage name="pickupNumberOfFloors" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex items-center">
                                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        <Field 
                                          type="checkbox" 
                                          name="pickupHasElevator" 
                                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                        />
                                        <span className="ml-2 flex items-center">
                                          <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                          Elevator Access
                                        </span>
                                      </label>
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
                                    name="dropoffLocation" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="Enter full address"
                                  />
                                </div>
                                <ErrorMessage name="dropoffLocation" component="p" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Floor
                                  </label>
                                  <Field 
                                    name="dropoffFloor" 
                                    type="number" 
                                    min="0" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Unit/Apt #
                                  </label>
                                  <Field 
                                    name="dropoffUnitNumber" 
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
                                    name="dropoffParkingInfo" 
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                    placeholder="e.g., Private driveway"
                                  />
                                </div>
                              </div>
                              
                              {/* Additional dropoff property details */}
                              {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <FontAwesomeIcon icon={faBuilding} className="mr-2 text-green-600 dark:text-green-400" />
                                    Property Details
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Property Type
                                      </label>
                                      <Field as="select" name="dropoffPropertyType" className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                        {propertyTypes.map(type => (
                                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                        ))}
                                      </Field>
                                    </div>

                                    <div>
                                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Number of Floors <span className="text-red-500">*</span>
                                      </label>
                                      <Field 
                                        type="number" 
                                        name="dropoffNumberOfFloors" 
                                        min="1"
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      />
                                      <ErrorMessage name="dropoffNumberOfFloors" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex items-center">
                                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        <Field 
                                          type="checkbox" 
                                          name="dropoffHasElevator" 
                                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                        />
                                        <span className="ml-2 flex items-center">
                                          <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                          Elevator Access
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Simple route visualization */}
                        <div className="py-4 flex flex-col items-center">
                          <div className="flex items-center w-full max-w-md">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-sm">A</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pickup</div>
                            </div>
                            <div className="flex-1 mx-4 relative">
                              <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400 w-full"></div>
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                                <FontAwesomeIcon icon={faTruck} className="mr-1.5" />
                                {values.pickupLocation && values.dropoffLocation ? 
                                  "~30 miles" : 
                                  "Enter addresses to see estimate"
                                }
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-sm">B</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dropoff</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={moveToPreviousStep} 
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 flex items-center"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Previous: Contact
                          </button>
                          <button 
                            type="button" 
                            onClick={moveToNextStep} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200"
                          >
                            Next: Details
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center mb-6">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faBox} />
                          </div>
                          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Service Details</h2>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Service Type & Size</h3>
                          </div>
                          <div className="p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Service Type <span className="text-red-500">*</span>
                                </label>
                                <Field as="select" 
                                  name="itemType" 
                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="">Select a service type</option>
                                  {itemTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </Field>
                                <ErrorMessage name="itemType" component="p" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Item Size <span className="text-red-500">*</span>
                                </label>
                                <Field as="select" 
                                  name="itemSize" 
                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="small">Small (Fits in a Car)</option>
                                  <option value="medium">Medium (Requires a Van)</option>
                                  <option value="large">Large (Requires a Truck)</option>
                                  <option value="xlarge">Extra Large (Multiple Vehicles)</option>
                                </Field>
                                <ErrorMessage name="itemSize" component="p" className="text-red-500 text-sm mt-1" />
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-600 dark:text-blue-400" />
                                    Dimensions (Optional)
                                  </label>
                                  <Field
                                    name="itemDimensions"
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="L × W × H"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Weight (Optional)
                                  </label>
                                  <Field
                                    name="itemWeight"
                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="kg"
                                  />
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Special Requirements</h4>
                                <div className="flex flex-wrap gap-x-6 gap-y-3">
                                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <Field 
                                      type="checkbox" 
                                      name="needsDisassembly" 
                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                    />
                                    <span className="ml-2">Needs Disassembly</span>
                                  </label>
                                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <Field 
                                      type="checkbox" 
                                      name="isFragile" 
                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                    />
                                    <span className="ml-2">Fragile Items</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Item Selection for Moving Services */}
                        {['Residential Moving', 'Office Relocation', 'Antique Moving', 'Furniture Assembly'].includes(values.itemType) && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                <FontAwesomeIcon icon={faCouch} className="mr-2 text-blue-600 dark:text-blue-400" />
                                Items Inventory
                              </h3>
                            </div>
                            <div className="p-6">
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Add specific items you need moved to help providers better understand your needs and prepare accordingly.
                                </p>
                              </div>
                              
                              <FieldArray
                                name="movingItems"
                                render={arrayHelpers => (
                                  <div>
                                    {values.movingItems && values.movingItems.length > 0 ? (
                                      <div className="space-y-4 mb-6">
                                        {values.movingItems.map((item, index) => (
                                          <div 
                                            key={index} 
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-750"
                                          >
                                            <div className="flex justify-between mb-3">
                                              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                <FontAwesomeIcon icon={getItemIcon(values.movingItems[index].category)} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                {values.movingItems[index].name || 'New Item'}
                                              </h4>
                                              <button
                                                type="button"
                                                onClick={() => arrayHelpers.remove(index)}
                                                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                              >
                                                <FontAwesomeIcon icon={faTimes} />
                                              </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Item Name <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                  name={`movingItems.${index}.name`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  placeholder="e.g., Sofa, Dining Table, TV"
                                                />
                                              </div>
                                              
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Category
                                                </label>
                                                <Field 
                                                  as="select"
                                                  name={`movingItems.${index}.category`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                  <option value="">Select category</option>
                                                  <option value="furniture">Furniture</option>
                                                  <option value="electronics">Electronics</option>
                                                  <option value="appliances">Appliances</option>
                                                  <option value="boxes">Boxes</option>
                                                  <option value="fragile">Fragile Items</option>
                                                  <option value="exercise">Exercise Equipment</option>
                                                  <option value="garden">Garden/Outdoor</option>
                                                  <option value="other">Other</option>
                                                </Field>
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Quantity
                                                </label>
                                                <Field
                                                  type="number"
                                                  name={`movingItems.${index}.quantity`}
                                                  min="1"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                              </div>
                                              
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Weight (kg)
                                                </label>
                                                <Field
                                                  type="number"
                                                  name={`movingItems.${index}.weight`}
                                                  min="0"
                                                  step="0.1"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                              </div>
                                              
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Dimensions
                                                </label>
                                                <Field
                                                  name={`movingItems.${index}.dimensions`}
                                                  placeholder="L × W × H cm"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                              </div>
                                              
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Value (£)
                                                </label>
                                                <Field
                                                  type="number"
                                                  name={`movingItems.${index}.value`}
                                                  min="0"
                                                  step="0.01"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <div className="flex space-x-4">
                                                  <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                                                    <Field 
                                                      type="checkbox" 
                                                      name={`movingItems.${index}.fragile`} 
                                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5" 
                                                    />
                                                    Fragile
                                                  </label>
                                                  <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                                                    <Field 
                                                      type="checkbox" 
                                                      name={`movingItems.${index}.needsDisassembly`} 
                                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5" 
                                                    />
                                                    Needs Disassembly
                                                  </label>
                                                </div>
                                              </div>
                                            
                                              <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Notes
                                                </label>
                                                <Field
                                                  as="textarea"
                                                  rows="2"
                                                  name={`movingItems.${index}.notes`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  placeholder="Any special requirements?"
                                                />
                                              </div>
                                            </div>
                                            
                                            <div className="mt-3">
                                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Photo
                                              </label>
                                              <div className="flex items-center">
                                                {values.movingItems[index].photo ? (
                                                  <div className="relative group mr-3">
                                                    <img 
                                                      src={typeof values.movingItems[index].photo === 'string' ? values.movingItems[index].photo : URL.createObjectURL(values.movingItems[index].photo)}
                                                      alt={values.movingItems[index].name} 
                                                      className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-700" 
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setFieldValue(`movingItems.${index}.photo`, null);
                                                      }}
                                                      className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                      <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <label className="cursor-pointer flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-650 mr-3">
                                                    <input
                                                      type="file"
                                                      accept="image/*"
                                                      onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                          setFieldValue(`movingItems.${index}.photo`, e.target.files[0]);
                                                        }
                                                      }}
                                                      className="sr-only"
                                                    />
                                                    <FontAwesomeIcon icon={faCamera} className="text-gray-400 dark:text-gray-500" />
                                                  </label>
                                                )}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                  Upload an image of this item (optional)
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}
                                    
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => arrayHelpers.push({
                                          name: '',
                                          category: 'furniture',
                                          quantity: 1,
                                          weight: '',
                                          dimensions: '',
                                          value: '',
                                          fragile: false,
                                          needsDisassembly: false,
                                          notes: '',
                                          photo: null
                                        })}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
                                      >
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Add Custom Item
                                      </button>
                                      
                                      <div className="relative group">
                                        <button
                                          type="button"
                                          onClick={() => setShowCommonItems(!showCommonItems)}
                                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 rounded-md flex items-center text-sm"
                                        >
                                          <FontAwesomeIcon icon={faList} className="mr-2" />
                                          Quick Add Common Items
                                          <FontAwesomeIcon icon={showCommonItems ? faChevronUp : faChevronDown} className="ml-2" />
                                        </button>
                                        
                                        {showCommonItems && (
                                          <div className="absolute left-0 top-full mt-1 z-10 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1">
                                            <div className="max-h-64 overflow-y-auto">
                                              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                Furniture
                                              </div>
                                              {commonItems.furniture.map((item, idx) => (
                                                <button
                                                  key={idx}
                                                  type="button"
                                                  onClick={() => {
                                                    arrayHelpers.push({
                                                      name: item.name,
                                                      category: 'furniture',
                                                      quantity: 1,
                                                      weight: item.weight || '',
                                                      dimensions: item.dimensions || '',
                                                      value: '',
                                                      fragile: item.fragile || false,
                                                      needsDisassembly: item.needsDisassembly || false,
                                                      notes: '',
                                                      photo: null
                                                    });
                                                    setShowCommonItems(false);
                                                  }}
                                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                  <FontAwesomeIcon icon={faCouch} className="mr-2 text-gray-400 dark:text-gray-500 w-4" />
                                                  {item.name}
                                                </button>
                                              ))}
                                              
                                              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-t border-gray-200 dark:border-gray-700">
                                                Electronics
                                              </div>
                                              {commonItems.electronics.map((item, idx) => (
                                                <button
                                                  key={idx}
                                                  type="button"
                                                  onClick={() => {
                                                    arrayHelpers.push({
                                                      name: item.name,
                                                      category: 'electronics',
                                                      quantity: 1,
                                                      weight: item.weight || '',
                                                      dimensions: item.dimensions || '',
                                                      value: '',
                                                      fragile: true,
                                                      needsDisassembly: false,
                                                      notes: '',
                                                      photo: null
                                                    });
                                                    setShowCommonItems(false);
                                                  }}
                                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                  <FontAwesomeIcon icon={faTv} className="mr-2 text-gray-400 dark:text-gray-500 w-4" />
                                                  {item.name}
                                                </button>
                                              ))}
                                              
                                              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-t border-gray-200 dark:border-gray-700">
                                                Appliances
                                              </div>
                                              {commonItems.appliances.map((item, idx) => (
                                                <button
                                                  key={idx}
                                                  type="button"
                                                  onClick={() => {
                                                    arrayHelpers.push({
                                                      name: item.name,
                                                      category: 'appliances',
                                                      quantity: 1,
                                                      weight: item.weight || '',
                                                      dimensions: item.dimensions || '',
                                                      value: '',
                                                      fragile: item.fragile || false,
                                                      needsDisassembly: false,
                                                      notes: '',
                                                      photo: null
                                                    });
                                                    setShowCommonItems(false);
                                                  }}
                                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                  <FontAwesomeIcon icon={faBlender} className="mr-2 text-gray-400 dark:text-gray-500 w-4" />
                                                  {item.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {values.movingItems && values.movingItems.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => setFieldValue('movingItems', [])}
                                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md text-sm"
                                        >
                                          Clear All Items
                                        </button>
                                      )}
                                    </div>
                                    
                                    {values.movingItems && values.movingItems.length > 0 && (
                                      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start">
                                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                          <span className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Item Summary
                                          </span>
                                          <span className="block text-sm text-blue-600 dark:text-blue-400">
                                            {values.movingItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)} items · 
                                            Est. weight: {values.movingItems.reduce((sum, item) => sum + ((parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 0)), 0).toFixed(1)} kg ·
                                            {values.movingItems.some(item => item.fragile) && " Includes fragile items ·"}
                                            {values.movingItems.some(item => item.needsDisassembly) && " Some items need disassembly"}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Documentation</h3>
                          </div>
                          <div className="p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Inventory List (PDF)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                                  <div className="space-y-1 text-center">
                                    <FontAwesomeIcon icon={faFileUpload} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                      <label htmlFor="inventoryList" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        <span>Upload a file</span>
                                        <input 
                                          id="inventoryList"
                                          name="inventoryList"
                                          type="file"
                                          accept=".pdf"
                                          onChange={(e) => setFieldValue('inventoryList', e.target.files?.[0])}
                                          className="sr-only"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      PDF up to 10MB
                                    </p>
                                  </div>
                                </div>
                                {values.inventoryList && (
                                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                                    {typeof values.inventoryList === 'string' ? values.inventoryList : values.inventoryList.name}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Item Photos
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                                  <div className="space-y-1 text-center">
                                    <FontAwesomeIcon icon={faCamera} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                      <label htmlFor="photos" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        <span>Upload photos</span>
                                        <input 
                                          id="photos"
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(e, setFieldValue)}
                                          className="sr-only"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      PNG, JPG, GIF up to 5MB each
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {previewImages.length > 0 && (
                              <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                  {previewImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                      <img 
                                        src={img} 
                                        alt={`Preview ${index + 1}`} 
                                        className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newImages = [...previewImages];
                                          newImages.splice(index, 1);
                                          setPreviewImages(newImages);
                                          
                                          // Also update the field value
                                          const newUrls = [...(values.photoURLs || [])];
                                          newUrls.splice(index, 1);
                                          setFieldValue('photoURLs', newUrls);
                                        }}
                                        className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={moveToPreviousStep} 
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 flex items-center"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Previous: Locations
                          </button>
                          <button 
                            type="button" 
                            onClick={moveToNextStep} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200"
                          >
                            Next: Schedule
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center mb-6">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Scheduling & Instructions</h2>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Preferred Date & Time</h3>
                          </div>
                          <div className="p-6 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Preferred Date <span className="text-red-500">*</span>
                                </label>
                                <Field 
                                  name="preferredDate" 
                                  type="date" 
                                  min={new Date().toISOString().split('T')[0]}
                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                />
                                <ErrorMessage name="preferredDate" component="p" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600 dark:text-blue-400" />
                                  Preferred Time <span className="text-red-500">*</span>
                                </label>
                                <Field 
                                  as="select" 
                                  name="preferredTime" 
                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="">Select a time slot</option>
                                  <option value="8:00 - 10:00">8:00 - 10:00</option>
                                  <option value="10:00 - 12:00">10:00 - 12:00</option>
                                  <option value="12:00 - 14:00">12:00 - 14:00</option>
                                  <option value="14:00 - 16:00">14:00 - 16:00</option>
                                  <option value="16:00 - 18:00">16:00 - 18:00</option>
                                  <option value="18:00 - 20:00">18:00 - 20:00</option>
                                </Field>
                                <ErrorMessage name="preferredTime" component="p" className="text-red-500 text-sm mt-1" />
                              </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                <Field 
                                  type="checkbox" 
                                  name="isFlexible" 
                                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                />
                                <span className="ml-2 flex items-center font-medium">
                                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-1.5 text-blue-600 dark:text-blue-400" />
                                  I'm flexible with scheduling
                                </span>
                              </label>
                              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                If selected, providers may suggest alternative times that could result in lower pricing
                              </p>
                            </div>
                            
                            <div className="pt-4">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Scheduling Preferences</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                  <Field 
                                    type="radio" 
                                    name="serviceSpeed" 
                                    value="standard" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" 
                                  />
                                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                                    <span className="font-medium block text-gray-800 dark:text-white">Standard Service</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Regular scheduling and pricing</span>
                                  </span>
                                </label>
                                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                  <Field 
                                    type="radio" 
                                    name="serviceSpeed" 
                                    value="express" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" 
                                  />
                                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                                    <span className="font-medium block text-gray-800 dark:text-white">Express Service</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Premium rate for faster service</span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Additional Instructions</h3>
                          </div>
                          <div className="p-6">
                            <Field
                              as="textarea"
                              name="description"
                              rows={4}
                              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Please provide any special instructions, access details, or specific requirements for this job..."
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Include details like access codes, special handling instructions, or any unique requirements.
                            </p>
                          </div>
                        </div>
                        
                        {/* Review Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                              <FontAwesomeIcon icon={faClipboardCheck} className="mr-2 text-green-600 dark:text-green-400" />
                              Review Your Request
                            </h3>
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Details</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                  <li><span className="font-medium">Name:</span> {values.contactName}</li>
                                  <li><span className="font-medium">Phone:</span> {values.contactPhone}</li>
                                  <li><span className="font-medium">Email:</span> {values.contactEmail}</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Service Details</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                  <li><span className="font-medium">Type:</span> {values.itemType}</li>
                                  <li><span className="font-medium">Size:</span> {values.itemSize}</li>
                                  <li><span className="font-medium">Pricing:</span> {values.requestType === 'fixed' ? 'Fixed Price' : 'Competitive Bidding'}</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduling</h4>
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                  <li><span className="font-medium">Date:</span> {values.preferredDate}</li>
                                  <li><span className="font-medium">Time:</span> {values.preferredTime}</li>
                                  <li><span className="font-medium">Flexible:</span> {values.isFlexible ? 'Yes' : 'No'}</li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pickup Location</h4>
                                <p className="text-gray-600 dark:text-gray-400">{values.pickupLocation}</p>
                                {(values.pickupUnitNumber || values.pickupFloor > 0) && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    {values.pickupUnitNumber && `Unit ${values.pickupUnitNumber}, `}
                                    {values.pickupFloor > 0 && `Floor ${values.pickupFloor}`}
                                  </p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dropoff Location</h4>
                                <p className="text-gray-600 dark:text-gray-400">{values.dropoffLocation}</p>
                                {(values.dropoffUnitNumber || values.dropoffFloor > 0) && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    {values.dropoffUnitNumber && `Unit ${values.dropoffUnitNumber}, `}
                                    {values.dropoffFloor > 0 && `Floor ${values.dropoffFloor}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-center text-sm mt-4">
                              <p className="text-gray-600 dark:text-gray-400">
                                By submitting this request, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={moveToPreviousStep} 
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 flex items-center"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Previous: Details
                          </button>
                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800 focus:ring-4 focus:ring-green-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                {isEditing ? 'Update Request' : 'Submit Request'}
                                <FontAwesomeIcon icon={faCheck} className="ml-2" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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