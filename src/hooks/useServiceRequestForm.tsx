import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { ServiceRequest } from '../types';



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


export const useServiceRequestForm = (isEditing = false, bookingId?: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formValues, setFormValues] = useState<ServiceRequest>(initialValues);
  
  // Step navigation
  const moveToNextStep = ({values}: any) => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    console.log("the form values", values);
    window.scrollTo(0, 0);
  };

  const moveToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    console.log("the form values", formValues);
    window.scrollTo(0, 0);
  };

  // Form submission
  const handleSubmit = async (values: ServiceRequest, { setSubmitting }: any) => {
    console.log("values", values);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        console.log('Updating booking:', bookingId, values);
        navigate(`/account/bookings/${bookingId}`);
      } else {
        const requestId = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
        navigate(values.requestType === 'fixed' ? `/providers/${requestId}` : `/jobs/${requestId}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
    setSubmitting(false);
  };

  // Initialize journey stops when selecting journey type
  useEffect(() => {
    if (formValues.requestType === 'journey' && formValues?.journeyStops?.length === 0) {
      const initialStops = [
        {
          id: uuidv4(),
          type: 'pickup' as const,
          location: formValues.pickupLocation || '',
          unitNumber: formValues.pickupUnitNumber || '',
          floor: formValues.pickupFloor || 0,
          parkingInfo: formValues.pickupParkingInfo || '',
          hasElevator: formValues.pickupHasElevator || false,
          instructions: '',
          estimatedTime: ''
        },
        {
          id: uuidv4(),
          type: 'dropoff' as const,
          location: formValues.dropoffLocation || '',
          unitNumber: formValues.dropoffUnitNumber || '',
          floor: formValues.dropoffFloor || 0,
          parkingInfo: formValues.dropoffParkingInfo || '',
          hasElevator: formValues.dropoffHasElevator || false,
          instructions: '',
          estimatedTime: ''
        }
      ];
      setFormValues(prevValues => ({ ...prevValues, journeyStops: initialStops }));
    }
  }, [formValues.requestType]);

  // Fetch booking details if editing
  useEffect(() => {
    if (isEditing && bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [isEditing, bookingId]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookingData = location.state?.bookingData;
      
      if (bookingData) {
        const mappedValues: ServiceRequest = {
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
            requestType: bookingData.requestType,
            photoURLs: [],
            isFlexible: false,
            needsInsurance: false,
            pickupNumberOfFloors: 1,
            pickupHasElevator: false,
            movingItems: [],
            journeyStops: [],
            storageDuration: undefined,
            vehicleType: 'van',
            internationalDestination: undefined,
            specialHandling: undefined,
            itemWeight: '',
            itemDimensions: '',
            needsDisassembly: false,
            isFragile: false,
        };
        
        setFormValues(mappedValues);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setIsLoading(false);
    }
  };


  const formTypeOptions = [
    {
      id: 'fixed',
      label: 'Fixed Price',
      icon: 'faTag', 
      color: 'blue',
      description: 'Get immediate binding quotes from providers. Fast and straightforward.',
    },
    {
      id: 'bidding',
      label: 'Competitive Bidding',
      icon: 'faGavel',
      color: 'purple',
      description: 'Compare multiple offers from providers. Best for complex jobs.',
    },
    {
      id: 'journey',
      label: 'Multi-Stop Journey',
      icon: 'faRoute',
      color: 'green',
      description: 'Plan a route with multiple pickups and dropoffs for complex moves.',
    }
  ];
  
  // Handle request type change and initialize appropriate fields
  const handleRequestTypeChange = (type: 'fixed' | 'bidding' | 'journey', currentValues: any, setFieldValue: any) => {
    // Initialize specific fields based on request type
    if (type === 'journey' && (!currentValues.journeyStops || currentValues.journeyStops.length === 0)) {
      // Add default pickup and dropoff based on existing pickup/dropoff addresses
      const initialStops = [
        {
          id: `pickup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'pickup',
          location: currentValues.pickupLocation || '',
          unitNumber: currentValues.pickupUnitNumber || '',
          floor: currentValues.pickupFloor || 0,
          parkingInfo: currentValues.pickupParkingInfo || '',
          hasElevator: currentValues.pickupHasElevator || false,
          instructions: '',
          estimatedTime: ''
        },
        {
          id: `dropoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'dropoff',
          location: currentValues.dropoffLocation || '',
          unitNumber: currentValues.dropoffUnitNumber || '',
          floor: currentValues.dropoffFloor || 0,
          parkingInfo: currentValues.dropoffParkingInfo || '',
          hasElevator: currentValues.dropoffHasElevator || false,
          instructions: '',
          estimatedTime: ''
        }
      ];
      
      // Update the field value
      setFieldValue('journeyStops', initialStops);
    }
  };


 
  // Load booking data if editing
  useEffect(() => {
    if (isEditing && bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [isEditing, bookingId]);



  return {
    currentStep,
    formValues,
    isLoading,
    moveToNextStep,
    moveToPreviousStep,
    handleSubmit,
    setFormValues,
    handleRequestTypeChange,
    formTypeOptions,
  };
};