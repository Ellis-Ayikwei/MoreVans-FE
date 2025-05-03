import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { ServiceRequest } from '../types';
import { RequestItem, JourneyStop } from '../store/slices/serviceRequestSice';
import axiosInstance from '../helper/axiosInstance';
import showMessage from '../helper/showMessage';
import { fetchServiceRequestById } from '../store/slices/serviceRequestSice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

interface AuthUser {
    id: string;
    // Add other user properties as needed
}

interface ExtendedJourneyStop {
    id?: string;
    type: string;
    location: string;
    unit_number?: string;
    floor?: number;
    parking_info?: string;
    has_elevator?: boolean;
    instructions?: string;
    estimated_time?: string;
    property_type?: string;
    number_of_rooms?: number;
    number_of_floors?: number;
    items?: RequestItem[];
    linked_items?: RequestItem[];
}

const initialValues: ServiceRequest = {
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    pickup_location: '',
    dropoff_location: '',
    service_type: 'Residential Moving',
    item_size: 'medium',
    preferred_date: '',
    preferred_time: '',
    estimated_value: '',
    description: '',
    pickup_floor: 0,
    pickup_unit_number: '',
    pickup_parking_info: '',
    dropoff_floor: 0,
    dropoff_unit_number: '',
    dropoff_parking_info: '',
    number_of_rooms: 1,
    number_of_floors: 1,
    property_type: 'house',
    has_elevator: false,
    dropoff_property_type: 'house',
    dropoff_number_of_rooms: 1,
    dropoff_number_of_floors: 1,
    dropoff_has_elevator: false,
    storage_duration: undefined,
    vehicle_type: 'van',
    international_destination: undefined,
    special_handling: undefined,
    is_flexible: false,
    needs_insurance: false,
    request_type: 'instant',
    photo_urls: [],
    inventory_list: undefined,
    item_weight: '',
    item_dimensions: '',
    needs_disassembly: false,
    is_fragile: false,
    pickup_number_of_floors: 1,
    pickup_has_elevator: false,
    moving_items: [],
    journey_stops: [],
};

export const useServiceRequestForm = (isEditing = false, bookingId?: string) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState<ServiceRequest>(initialValues);
    const { user } = useAuthUser<AuthUser>();

    // Fetch request data when in edit mode
    useEffect(() => {
        const initializeEditForm = async () => {
            if (isEditing && bookingId) {
                setIsLoading(true);
                try {
                    const authUser = user as AuthUser;
                    if (!authUser) {
                        throw new Error('User not authenticated');
                    }
                    const userId = authUser.id;
                    if (!userId) {
                        throw new Error('User ID not found');
                    }

                    const requestData = await fetchRequestById(bookingId, userId);
                    console.log('Raw request data:', requestData);

                    if (requestData) {
                        // Ensure all required fields are present
                        const populatedData = {
                            ...initialValues, // Start with default values
                            ...requestData, // Override with fetched data
                            // Ensure journey_stops is properly formatted
                            journey_stops:
                                requestData.journey_stops?.map((stop: ExtendedJourneyStop) => {
                                    console.log('Processing stop:', stop);
                                    return {
                                        id: stop.id || uuidv4(),
                                        type: stop.type,
                                        location: stop.location,
                                        unit_number: stop.unit_number || '',
                                        floor: stop.floor || 0,
                                        parking_info: stop.parking_info || '',
                                        has_elevator: stop.has_elevator || false,
                                        instructions: stop.instructions || '',
                                        estimated_time: stop.estimated_time || '',
                                        property_type: stop.property_type || 'house',
                                        number_of_rooms: stop.number_of_rooms || 1,
                                        number_of_floors: stop.number_of_floors || 1,
                                        items: (stop.items || []).map((item: RequestItem) => {
                                            console.log('Processing item:', item);
                                            return {
                                                ...item,
                                                id: item.id || uuidv4(),
                                                quantity: item.quantity || 1,
                                                weight: item.weight || '',
                                                dimensions: item.dimensions || '',
                                                fragile: item.fragile || false,
                                                needs_disassembly: item.needs_disassembly || false,
                                            };
                                        }),
                                        linked_items: Array.isArray(stop.linked_items)
                                            ? stop.linked_items.map((item: RequestItem) => {
                                                  console.log('Processing linked item:', item);
                                                  return {
                                                      ...item,
                                                      id: item.id || uuidv4(),
                                                      quantity: item.quantity || 1,
                                                      weight: item.weight || '',
                                                      dimensions: item.dimensions || '',
                                                      fragile: item.fragile || false,
                                                      needs_disassembly: item.needs_disassembly || false,
                                                  };
                                              })
                                            : [],
                                    };
                                }) || [],
                            // Ensure moving_items is properly formatted
                            moving_items:
                                requestData.moving_items?.map((item: RequestItem) => {
                                    console.log('Processing moving item:', item);
                                    return {
                                        ...item,
                                        id: item.id || uuidv4(),
                                        quantity: item.quantity || 1,
                                        weight: item.weight || '',
                                        dimensions: item.dimensions || '',
                                        fragile: item.fragile || false,
                                        needs_disassembly: item.needs_disassembly || false,
                                    };
                                }) || [],
                            // Ensure all required fields have default values
                            service_type: requestData.service_type || 'Residential Moving',
                            item_size: requestData.item_size || 'medium',
                            request_type: requestData.request_type || 'instant',
                            is_flexible: requestData.is_flexible || false,
                            needs_insurance: requestData.needs_insurance || false,
                            needs_disassembly: requestData.needs_disassembly || false,
                            is_fragile: requestData.is_fragile || false,
                            pickup_floor: requestData.pickup_floor || 0,
                            dropoff_floor: requestData.dropoff_floor || 0,
                            number_of_rooms: requestData.number_of_rooms || 1,
                            number_of_floors: requestData.number_of_floors || 1,
                            dropoff_number_of_rooms: requestData.dropoff_number_of_rooms || 1,
                            dropoff_number_of_floors: requestData.dropoff_number_of_floors || 1,
                            pickup_has_elevator: requestData.pickup_has_elevator || false,
                            dropoff_has_elevator: requestData.dropoff_has_elevator || false,
                            property_type: requestData.property_type || 'house',
                            dropoff_property_type: requestData.dropoff_property_type || 'house',
                            vehicle_type: requestData.vehicle_type || 'van',
                        };

                        console.log('Final populated data:', populatedData);
                        setFormValues(populatedData);
                    }
                } catch (error) {
                    console.error('Error initializing edit form:', error);
                    showMessage('Failed to load request data', 'error');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initializeEditForm();
    }, [isEditing, bookingId, user]);

    // Step navigation
    const moveToNextStep = ({ values }: any) => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
        console.log('the form values', values);
        window.scrollTo(0, 0);
    };

    const moveToPreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        console.log('the form values', formValues);
        window.scrollTo(0, 0);
    };

    // Form submission
    const handleSubmit = async (values: ServiceRequest) => {
        try {
            console.log('submitting values', values);

            // Function to estimate time based on stop index and type
            const estimateTimeForStop = (index: number, type: string) => {
                // Base time is 9:00 AM
                const baseHour = 9;
                const baseMinutes = 0;

                // Add 30 minutes for each stop
                const minutesToAdd = index * 30;

                // Calculate total minutes
                const totalMinutes = baseHour * 60 + baseMinutes + minutesToAdd;

                // Convert back to hours and minutes
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                // Format as HH:MM
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };

            // Ensure journey_stops is always present
            if (!values.journey_stops || values.journey_stops.length === 0) {
                values.journey_stops = [
                    {
                        id: uuidv4(),
                        type: 'pickup',
                        address: values.pickup_location || '',
                        location: values.pickup_location || '',
                        unit_number: values.pickup_unit_number || '',
                        floor: values.pickup_floor || 0,
                        parking_info: values.pickup_parking_info || '',
                        has_elevator: values.pickup_has_elevator || false,
                        instructions: '',
                        estimated_time: estimateTimeForStop(0, 'pickup'),
                        property_type: values.property_type || 'house',
                        number_of_rooms: values.number_of_rooms || 1,
                        number_of_floors: values.number_of_floors || 1,
                        items: (values.moving_items || []).map((item) => ({
                            ...item,
                            id: item.id || uuidv4(),
                        })),
                    },
                    {
                        id: uuidv4(),
                        type: 'dropoff',
                        address: values.dropoff_location || '',
                        location: values.dropoff_location || '',
                        unit_number: values.dropoff_unit_number || '',
                        floor: values.dropoff_floor || 0,
                        parking_info: values.dropoff_parking_info || '',
                        has_elevator: values.dropoff_has_elevator || false,
                        instructions: '',
                        estimated_time: estimateTimeForStop(1, 'dropoff'),
                        property_type: values.dropoff_property_type || 'house',
                        number_of_rooms: values.dropoff_number_of_rooms || 1,
                        number_of_floors: values.dropoff_number_of_floors || 1,
                    },
                ];
            } else {
                values.journey_stops = values.journey_stops.map((stop, index) => {
                    // Format the estimated_time to HH:MM format or use estimated time if empty
                    let formattedTime = '';
                    if (stop.estimated_time) {
                        const [hours, minutes] = stop.estimated_time.split(':');
                        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
                    } else {
                        formattedTime = estimateTimeForStop(index, stop.type);
                    }

                    return {
                        ...stop,
                        id: stop.id || uuidv4(),
                        address: stop.location || '',
                        items: (stop.items || []).map((item) => ({
                            ...item,
                            id: item.id || uuidv4(),
                        })),
                        estimated_time: formattedTime,
                    };
                });
            }

            if (values.request_type === 'instant') {
                const pickupStop = values.journey_stops.find((stop) => stop.type === 'pickup');
                if (pickupStop) {
                    pickupStop.items = (values.moving_items || []).map((item) => ({
                        ...item,
                        id: item.id || uuidv4(),
                    }));
                }
            }

            const movingItems = values?.journey_stops
                ?.flatMap((stop) => (stop.type === 'pickup' ? stop.items || [] : []))
                .map((item) => ({
                    ...item,
                    id: item.id || uuidv4(),
                }));

            const apiPayload = {
                contact_name: values.contact_name,
                contact_phone: values.contact_phone,
                contact_email: values.contact_email,
                service_type: values.service_type,
                item_size: values.item_size,
                preferred_date: values.preferred_date,
                preferred_time: values.preferred_time,
                estimated_value: values.estimated_value,
                description: values.description,
                storage_duration: values.storage_duration,
                vehicle_type: values.vehicle_type,
                international_destination: values.international_destination,
                special_handling: values.special_handling,
                is_flexible: values.is_flexible,
                needs_insurance: values.needs_insurance,
                request_type: values.request_type || 'instant',
                photo_urls: values.photo_urls,
                inventory_list: values.inventory_list,
                item_weight: values.item_weight,
                item_dimensions: values.item_dimensions,
                needs_disassembly: values.needs_disassembly,
                is_fragile: values.is_fragile,
                moving_items:
                    movingItems.length > 0
                        ? movingItems
                        : values.moving_items?.map((item) => ({
                              ...item,
                              id: item.id || uuidv4(),
                          })),
                journey_stops: values.journey_stops,
                price_check: true,
            };

            let response;
            console.log('submitting values', apiPayload);
            if (isEditing && bookingId) {
                response = await axiosInstance.patch(`/requests/${bookingId}`, apiPayload);
                if (response.status === 200) {
                    showMessage('Request updated successfully.', 'success');
                    // navigate(`/account/bookings/${bookingId}`);
                    console.log('Request updated successfully.', response.data);
                }
            } else {
                response = await axiosInstance.post('/requests/?price_check=true', apiPayload);
                if (response.status === 201 || response.status === 200) {
                    showMessage('Request created successfully.', 'success');
                    const requestId = response.data.id || `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
                    // navigate(`/my-bookings`);
                    console.log('Request created successfully.', response.data);
                    return response;
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            showMessage('Failed to save request.', 'error');
        }
    };

    // Initialize journey stops when selecting journey type
    useEffect(() => {
        if (formValues.request_type === 'journey' && formValues?.journey_stops?.length === 0) {
            const initialStops = [
                {
                    id: uuidv4(),
                    type: 'pickup' as const,
                    location: formValues.pickup_location || '',
                    unit_number: formValues.pickup_unit_number || '',
                    floor: formValues.pickup_floor || 0,
                    parking_info: formValues.pickup_parking_info || '',
                    has_elevator: formValues.pickup_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
                {
                    id: uuidv4(),
                    type: 'dropoff' as const,
                    location: formValues.dropoff_location || '',
                    unit_number: formValues.dropoff_unit_number || '',
                    floor: formValues.dropoff_floor || 0,
                    parking_info: formValues.dropoff_parking_info || '',
                    has_elevator: formValues.dropoff_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
            ];
            setFormValues((prevValues) => ({ ...prevValues, journey_stops: initialStops }));
        }
    }, [formValues.request_type]);

    const fetchRequestById = async (requestId: string, userId: string) => {
        try {
            const result = await dispatch(fetchServiceRequestById({ requestId, userId })).unwrap();
            return result;
        } catch (error) {
            console.error('Error fetching request:', error);
            throw error;
        }
    };

    const formTypeOptions = [
        {
            id: 'instant',
            label: 'instant',
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
        },
    ];

    // Handle request type change and initialize appropriate fields
    const handlerequestTypeChange = (type: 'instant' | 'bidding' | 'journey', currentValues: any, setFieldValue: any) => {
        // Initialize specific fields based on request type
        if (type === 'journey' && (!currentValues.journey_stops || currentValues.journey_stops.length === 0)) {
            // Add default pickup and dropoff based on existing pickup/dropoff addresses
            const initialStops = [
                {
                    id: uuidv4(),
                    type: 'pickup',
                    location: currentValues.pickup_location || '',
                    unit_number: currentValues.pickup_unit_number || '',
                    floor: currentValues.pickup_floor || 0,
                    parking_info: currentValues.pickup_parking_info || '',
                    has_elevator: currentValues.pickup_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
                {
                    id: uuidv4(),
                    type: 'dropoff',
                    location: currentValues.dropoff_location || '',
                    unit_number: currentValues.dropoff_unit_number || '',
                    floor: currentValues.dropoff_floor || 0,
                    parking_info: currentValues.dropoff_parking_info || '',
                    has_elevator: currentValues.dropoff_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
            ];

            // Update the field value
            setFieldValue('journey_stops', initialStops);
        }
    };

    return {
        currentStep,
        formValues,
        isLoading,
        fetchRequestById,
        moveToNextStep,
        moveToPreviousStep,
        handleSubmit,
        setFormValues,
        handlerequestTypeChange,
        formTypeOptions,
    };
};
