import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageUpload } from '../../hooks/useImageUpload';
import LoadingSpinner from '../../components/ServiceRequest/LoadingSpinner';
import StepIndicator from '../../components/ServiceRequest/stepIndicator';
import { validationSchema, stepValidationSchemas } from '../../utilities/validationSchema/requestFormValidation';
import ContactDetailsStep from '../../components/ServiceRequest/ContactDetailsStep';
import ServiceDetailsStep from '../../components/ServiceRequest/ServiceDetailsStep';
import LocationsStep from '../../components/ServiceRequest/LocationsStep';
import ScheduleStep from '../../components/ServiceRequest/ScheduleStep';
import RequestReviewPanel from '../../components/ServiceRequest/RequestReviewPanel';
import RequestDetailsPanel from '../../components/ServiceRequest/RequestDetailsPanel';
import { ServiceRequest } from '../../types';
import { IconCheck, IconShieldCheck, IconThumbUp, IconChevronLeft, IconChevronRight, IconStar, IconLock, IconTruck, IconClock, IconMapPin, IconRoute, IconPhone, IconBrandWhatsapp, IconArrowLeft } from '@tabler/icons-react';
import { getPricePreview, setCurrentStep, submitStepToAPI, resetForm, updateFormValues, setStepData } from '../../store/slices/createRequestSlice';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import StepNavigation from '../../components/ServiceRequest/stepNavigation';
import showMessage from '../../helper/showMessage';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PriceForecastPage from '../../components/Booking/PriceForecastPage';
import AddressDetails from '../../components/ServiceRequest/AddressDetails';
// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Add custom marker icons
const pickupIcon = L.icon({
    iconUrl: '/images/pickup-marker.png',
    iconRetinaUrl: '/images/pickup-marker-2x.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const dropoffIcon = L.icon({
    iconUrl: '/images/dropoff-marker.png',
    iconRetinaUrl: '/images/dropoff-marker-2x.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Define payload types for each step
interface Step1Payload {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    request_type: 'instant' | 'journey';
}

interface Step2Payload {
    pickup_location: string;
    pickup_unit_number?: string;
    pickup_floor?: number;
    pickup_number_of_floors?: number;
    pickup_parking_info?: string;
    pickup_has_elevator?: boolean;
    dropoff_location: string;
    inventory_list?: string;
    property_type?: string;
    dropoff_unit_number?: string;
    special_handling?: string;
    dropoff_floor?: number;
    dropoff_number_of_rooms?: number;
    dropoff_property_type?: string;
    dropoff_number_of_floors?: number;
    dropoff_parking_info?: string;
    dropoff_has_elevator?: boolean;
    needs_disassembly?: boolean;
    is_fragile?: boolean;
    number_of_rooms?: number;
    number_of_floors?: number;
    service_type?: string;
    is_flexible?: boolean;
    needs_insurance?: boolean;
    estimated_value?: string;
    service_priority?: string;
    journey_stops?: Array<{
        id: string;
        type: 'pickup' | 'dropoff' | 'stop';
        location: string;
        unit_number?: string;
        floor?: number;
        parking_info?: string;
        has_elevator?: boolean;
        instructions?: string;
        estimated_time?: string;
    }>;
}

interface Step3Payload {
    service_type: string;
    item_size: string;
    description: string;
    photo_urls?: string[];
    moving_items?: Array<{
        id: string;
        name: string;
        description: string;
        quantity: number;
        fragile: boolean;
        needs_disassembly: boolean;
    }>;
}

interface Step4Payload {
    preferred_date: string;
    preferred_time: string;
    is_flexible: boolean;
    needs_insurance: boolean;
    estimated_value?: string;
}

type StepPayload = Step1Payload | Step2Payload | Step3Payload | Step4Payload;

// Helper function to format payload based on step
const formatStepPayload = (step: number, values: any) => {
    switch (step) {
        case 1:
            return {
                request_type: values.request_type,
                service_type: values.service_type,
                pickup_location: values.pickup_location,
                pickup_floor: values.pickup_floor,
                pickup_unit_number: values.pickup_unit_number,
                pickup_parking_info: values.pickup_parking_info,
                pickup_number_of_floors: values.pickup_number_of_floors,
                pickup_has_elevator: values.pickup_has_elevator,
                dropoff_location: values.dropoff_location,
                dropoff_floor: values.dropoff_floor,
                dropoff_unit_number: values.dropoff_unit_number,
                dropoff_parking_info: values.dropoff_parking_info,
                dropoff_number_of_floors: values.dropoff_number_of_floors,
                dropoff_has_elevator: values.dropoff_has_elevator,
                property_type: values.property_type,
                dropoff_property_type: values.dropoff_property_type,
            };
        case 2:
            return {
                journey_stops: values.journey_stops.map((stop: any) => ({
                    id: stop.id,
                    type: stop.type,
                    location: stop.location,
                    unit_number: stop.unit_number,
                    floor: stop.floor,
                    parking_info: stop.parking_info,
                    has_elevator: stop.has_elevator,
                    instructions: stop.instructions,
                    estimated_time: stop.estimated_time,
                    property_type: stop.property_type,
                    number_of_rooms: stop.number_of_rooms,
                    number_of_floors: stop.number_of_floors,
                    service_type: stop.service_type,
                    needs_disassembly: stop.needs_disassembly,
                    is_fragile: stop.is_fragile,
                    dimensions: stop.dimensions,
                    weight: stop.weight,
                    items: stop.items,
                    linked_items: stop.linked_items,
                })),
                request_type: values.request_type,
            };
        case 3:
            return {
                moving_items: values.moving_items.map((item: any) => ({
                    name: item.name,
                    category: item.category,
                    quantity: item.quantity,
                    weight: item.weight,
                    dimensions: item.dimensions,
                    value: item.value,
                    fragile: item.fragile,
                    needs_disassembly: item.needs_disassembly,
                    notes: item.notes,
                    photo: item.photo,
                })),
                inventory_list: values.inventory_list,
                photo_urls: values.photo_urls,
                special_handling: values.special_handling,
                is_flexible: values.is_flexible,
                needs_insurance: values.needs_insurance,
                needs_disassembly: values.needs_disassembly,
                is_fragile: values.is_fragile,
            };
        case 4:
            return {
                preferred_date: values.preferred_date,
                preferred_time: values.preferred_time,
                is_flexible: values.is_flexible,
                service_priority: values.service_speed,
            };
        default:
            return {};
    }
};

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

// Add this new component for handling route fetching
const RouteLayer: React.FC<{
    pickupCoords: [number, number];
    dropoffCoords: [number, number];
    onRouteLoaded: (coordinates: [number, number][]) => void;
}> = ({ pickupCoords, dropoffCoords, onRouteLoaded }) => {
    const map = useMap();

    React.useEffect(() => {
        const fetchRoute = async () => {
            try {
                // Format coordinates for OSRM (longitude, latitude)
                const [pickupLat, pickupLng] = pickupCoords;
                const [dropoffLat, dropoffLng] = dropoffCoords;
                
                // Fetch route from OSRM
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson`
                );
                const data = await response.json();

                if (data.routes && data.routes[0]) {
                    // Extract coordinates from the route and convert to [lat, lng] for Leaflet
                    const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => {
                        // OSRM returns [lng, lat], convert to [lat, lng] for Leaflet
                        return [coord[1], coord[0]] as [number, number];
                    });
                    
                    onRouteLoaded(coordinates);

                    // Create bounds that include both points and the route
                    const bounds = L.latLngBounds([
                        pickupCoords,
                        dropoffCoords,
                        ...coordinates
                    ]);
                    
                    // Add padding to the bounds
                    map.fitBounds(bounds, { 
                        padding: [50, 50],
                        maxZoom: 15 // Prevent zooming in too far
                    });
                }
            } catch (error) {
                console.error('Error fetching route:', error);
                // Fallback to direct line if route fetching fails
                onRouteLoaded([pickupCoords, dropoffCoords]);
            }
        };

        if (pickupCoords && dropoffCoords) {
            fetchRoute();
        }
    }, [pickupCoords, dropoffCoords, map, onRouteLoaded]);

    return null;
};

const ServiceRequestForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentStep, formValues, isLoading, request_id } = useSelector((state: IRootState) => state.serviceRequest);

    // Add state for modals and price forecast
    const [showPreAnimation, setShowPreAnimation] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceForecast, setPriceForecast] = useState<any>(null);
    const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form value changes
    const handleFormChange = (values: any) => {
        dispatch(
            updateFormValues({
                ...values,
                step: currentStep,
            })
        );
    };

    // Adjust StepIndicator count based on request type
    const totalSteps = 4;

    const handleError = (error: any) => {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    };

    const handleNextStep = () => {
        dispatch(setCurrentStep(Math.min(currentStep + 1, totalSteps)));
        window.scrollTo(0, 0);
    };

    const handlePreviousStep = () => {
        dispatch(setCurrentStep(Math.max(currentStep - 1, 1)));
        window.scrollTo(0, 0);
    };

    const handlePriceAccept = (staffCount: string, price: number) => {
        setShowPriceModal(false);
        showMessage('Request created successfully.', 'success');
        dispatch(resetForm());
        navigate('/my-bookings');
    };

    const { previewImages, handleImageUpload, removeImage } = useImageUpload(formValues.photo_urls || []);

    // Get the appropriate validation schema for the current step
    const getCurrentValidationSchema = () => {
        switch (currentStep) {
            case 1:
                return stepValidationSchemas.step1;
            case 2:
                return stepValidationSchemas.step2;
            case 3:
                return stepValidationSchemas.step3;
            case 4:
                return stepValidationSchemas.step4;
            default:
                return validationSchema;
        }
    };

    // Function to geocode addresses
    const geocodeAddress = async (address: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();
            if (data && data[0]) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    // Update map when locations change
    useEffect(() => {
        const updateMap = async () => {
            if (formValues.pickup_location && formValues.dropoff_location) {
                const pickup = await geocodeAddress(formValues.pickup_location);
                const dropoff = await geocodeAddress(formValues.dropoff_location);

                if (pickup && dropoff) {
                    setPickupCoords(pickup);
                    setDropoffCoords(dropoff);
                    setMapCenter([
                        (pickup[0] + dropoff[0]) / 2,
                        (pickup[1] + dropoff[1]) / 2
                    ]);

                    // Calculate route (simplified for demo - in production, use a proper routing service)
                    setRouteCoordinates([pickup, dropoff]);
                }
            }
        };

        updateMap();
    }, [formValues.pickup_location, formValues.dropoff_location]);

    const handleEditStep = (stepNumber: number) => {
        dispatch(setCurrentStep(stepNumber - 1)); // Convert to 0-based index
    };

    const handleRemoveItem = (itemId: string) => {
        const updatedItems = (formValues.moving_items || []).filter((item: any) => item.id !== itemId);
        dispatch(updateFormValues({
            ...formValues,
            moving_items: updatedItems
        }));
    };

    const handlePriceSelect = (selectedPrice: any) => {
        setPriceForecast(selectedPrice);
        setShowPriceModal(false);
        // You can add additional logic here if needed
    };

    return (
        <div className="w-full px-1 md:px-2 py-2 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-3">
             {priceForecast &&   <button
                                onClick={() => setPriceForecast(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 flex items-center gap-2"
                            >
                                <IconArrowLeft className="w-6 h-6 text-gray-600" /> Back to Form
                            </button>}
                    {!priceForecast && (
                        /* Hero Section */
                        <div className="relative py-16 mb-10 overflow-hidden rounded-2xl shadow-2xl">
                            {/* Gradient Overlay + Background Image */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-indigo-900/90 z-10" />
                                <div
                                    className="absolute inset-0 bg-no-repeat bg-center bg-cover filter  opacity-125"
                                    style={{
                                        backgroundImage:
                                            'url(https://images.unsplash.com/photo-1587813369290-091c9d432daf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                                        backgroundPosition: '30% 60%',
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-20 text-center px-6 sm:px-10 lg:px-12  mx-auto">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                    <span className="inline-block transform transition-all animate-fadeIn">Professional Moving Services</span>
                                </h1>

                                <p className="text-xl text-blue-100 mt-6 max-w-3xl mx-auto font-light opacity-90">
                                    Get instant quotes from verified moving professionals in your area
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                                    <div className="flex flex-row items-center gap-1 border border-gray-200/20 rounded-lg p-2 text-green-300">
                                        <IconShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <p className="text-sm font-medium sm:text-base hidden sm:inline">Verified Providers</p>
                                    </div>

                                    <div className="flex flex-row items-center gap-1 border border-gray-200/20 rounded-lg p-2 text-green-300">
                                        <IconLock className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <p className="text-sm font-medium sm:text-base hidden sm:inline">Insured Services</p>
                                    </div>

                                    <div className="flex flex-row items-center gap-1 border border-gray-200/20 rounded-lg p-2 text-green-300">
                                        <IconStar className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <p className="text-sm font-medium sm:text-base hidden sm:inline">Satisfaction Guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!priceForecast && <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2 sm:p-2 relative">
                        {isLoading && currentStep != 4 ? (
                            <LoadingSpinner message="Loading your request details..." />
                        ) : (
                            <>
                                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                                <Formik initialValues={formValues} validationSchema={getCurrentValidationSchema()} onSubmit={() => {}} enableReinitialize>
                                    {(formikProps) => (
                                        <Form className="space-y-6" noValidate>
                                            {currentStep === 1 && (
                                                <ContactDetailsStep
                                                    values={formikProps.values}
                                                    handleChange={formikProps.handleChange}
                                                    handleBlur={formikProps.handleBlur}
                                                    setFieldValue={formikProps.setFieldValue}
                                                    setTouched={formikProps.setTouched}
                                                    validateForm={formikProps.validateForm}
                                                    onNext={handleNextStep}
                                                    errors={formikProps.errors}
                                                    touched={formikProps.touched}
                                                    stepNumber={1}
                                                />
                                            )}

                                            {currentStep === 2 && (
                                                <LocationsStep
                                                    values={formikProps.values}
                                                    handleChange={formikProps.handleChange}
                                                    handleBlur={formikProps.handleBlur}
                                                    setFieldValue={formikProps.setFieldValue}
                                                    setTouched={formikProps.setTouched}
                                                    validateForm={formikProps.validateForm}
                                                    onNext={handleNextStep}
                                                    onBack={handlePreviousStep}
                                                    errors={formikProps.errors}
                                                    touched={formikProps.touched}
                                                    stepNumber={2}
                                                />
                                            )}

                                            {currentStep === 3 && (
                                                <ServiceDetailsStep
                                                    values={formikProps.values}
                                                    handleChange={formikProps.handleChange}
                                                    handleBlur={formikProps.handleBlur}
                                                    setFieldValue={formikProps.setFieldValue}
                                                    setTouched={formikProps.setTouched}
                                                    validateForm={formikProps.validateForm}
                                                    errors={formikProps.errors}
                                                    touched={formikProps.touched}
                                                    onNext={handleNextStep}
                                                    onBack={handlePreviousStep}
                                                    isLoading={isLoading}
                                                    stepNumber={3}
                                                />
                                            )}

                                            {currentStep === totalSteps && (
                                                <ScheduleStep
                                                    values={formikProps.values}
                                                    handleChange={formikProps.handleChange}
                                                    handleBlur={formikProps.handleBlur}
                                                    setFieldValue={formikProps.setFieldValue}
                                                    setTouched={formikProps.setTouched}
                                                    validateForm={formikProps.validateForm}
                                                    onBack={handlePreviousStep}
                                                    onNext={handleNextStep}
                                                    stepNumber={totalSteps}
                                                    errors={formikProps.errors}
                                                    touched={formikProps.touched}
                                                    onPriceAccept={handlePriceAccept}
                                                    onPriceForecast={setPriceForecast}
                                                />
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </div>}

                    {priceForecast && (
                        <PriceForecastPage 
                            priceForecast={priceForecast} 
                            request_id={formValues.id || ''} 
                            onAccept={handlePriceSelect} 
                            onBack={() => setPriceForecast(null)}
                        />
                    )}

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 ">
                    <div className="sticky top-16 space-y-6">
                        {/* Map Component - Only show when locations are set */}
                        {formValues.pickup_location && formValues.dropoff_location && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Route Map</h3>
                                </div>
                                <div className="h-[400px] relative">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        className="h-full w-full"
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {pickupCoords && dropoffCoords && (
                                            <>
                                                <RouteLayer
                    pickupCoords={pickupCoords}
                    dropoffCoords={dropoffCoords}
                                                    onRouteLoaded={setRouteCoordinates}
                                                />
                                                <Marker position={pickupCoords} icon={pickupIcon}>
                                                    <Popup>
                                                        <div className="text-sm">
                                                            <p className="font-medium text-blue-600">Pickup Location</p>
                                                            <p>{formValues.pickup_location}</p>
                                                            {formValues.pickup_floor && (
                                                                <p className="text-gray-600">Floor: {formValues.pickup_floor}</p>
                                                            )}
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                                <Marker position={dropoffCoords} icon={dropoffIcon}>
                                                    <Popup>
                                                        <div className="text-sm">
                                                            <p className="font-medium text-green-600">Dropoff Location</p>
                                                            <p>{formValues.dropoff_location}</p>
                                                            {formValues.dropoff_floor && (
                                                                <p className="text-gray-600">Floor: {formValues.dropoff_floor}</p>
                                                            )}
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                                {routeCoordinates.length > 0 && (
                                                    <Polyline
                                                        positions={routeCoordinates}
                                                        color="#3B82F6"
                                                        weight={4}
                                                        opacity={0.8}
                                                        lineCap="round"
                                                        lineJoin="round"
                                                        dashArray="5, 10"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </MapContainer>
                                </div>
                            </div>
                        )}

                        <RequestDetailsPanel
                            values={formValues}
                            onEditStep={handleEditStep}
                            currentStep={currentStep}
                            onRemoveItem={handleRemoveItem}
                        />
                        
                      

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <button
                                    onClick={() => window.open('tel:+1234567890')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <IconPhone size={20} />
                                    <span>Call Support</span>
                                </button>
                                <button
                                    onClick={() => window.open('https://wa.me/1234567890')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <IconBrandWhatsapp size={20} />
                                    <span>WhatsApp Chat</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
