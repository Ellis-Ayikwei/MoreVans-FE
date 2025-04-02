import { 
  faBox, 
  faBuilding, 
  faCalendarAlt, 
  faHome, 
  faLocationDot, 
  faTruck, 
  faDollarSign, 
  faPhone,
  faEnvelope,
  faRulerCombined,
  faWarehouse,
  faElevator,
  faCar,
  faImage,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProviderModal from '../../components/Provider/ProviderPopup';

interface ProviderDetails {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType: string;
    verified: boolean;
    capacity: string;
    serviceRadius: string;
    price: number;
    additionalInfo: string;
    reviews: {
        text: string;
        rating: number;
        author: string;
        date: string;
    }[];
    profileImage: string;
}

interface BookingDetails {
    id: string;
    status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
    date: string;
    pickupLocation: string;
    dropoffLocation: string;
    itemType: string;
    itemSize: string;
    description?: string;
    provider: ProviderDetails;
    estimatedDeliveryTime?: string;
    price: number;
    trackingUpdates: {
        status: string;
        timestamp: string;
        description: string;
    }[];
}

// Update the ServiceRequest interface with additional fields
interface ServiceRequest {
    // Contact Information
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    
    // Existing fields
    pickupLocation: string;
    dropoffLocation: string;
    
    // Additional location details
    pickupFloor?: number;
    pickupUnitNumber?: string;
    pickupParkingInfo?: string;
    dropoffFloor?: number;
    dropoffUnitNumber?: string;
    dropoffParkingInfo?: string;
    
    // Existing fields
    itemType: string;
    itemSize: string;
    preferredDate: string;
    preferredTime: string;
    estimatedValue: string;
    description: string;
    
    // Additional item details
    itemWeight?: string;
    itemDimensions?: string;
    needsDisassembly?: boolean;
    isFragile?: boolean;
    
    // Moving specific fields (existing)
    numberOfRooms?: number;
    numberOfFloors?: number;
    propertyType?: 'house' | 'apartment' | 'office' | 'storage';
    hasElevator?: boolean;
    
    // Schedule options
    isFlexible?: boolean;
    
    // Other options
    needsInsurance?: boolean;
    requestType: 'fixed' | 'bidding';
    photoURLs?: string[];
}

const initialValues: ServiceRequest = {
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  
  pickupLocation: '',
  dropoffLocation: '',
  pickupFloor: 0,
  pickupUnitNumber: '',
  pickupParkingInfo: '',
  dropoffFloor: 0,
  dropoffUnitNumber: '',
  dropoffParkingInfo: '',
  
  itemType: '',
  itemSize: '',
  preferredDate: '',
  preferredTime: '',
  estimatedValue: '',
  description: '',
  
  itemWeight: '',
  itemDimensions: '',
  needsDisassembly: false,
  isFragile: false,
  
  numberOfRooms: 1,
  numberOfFloors: 1,
  propertyType: 'house',
  hasElevator: false,
  
  isFlexible: false,
  needsInsurance: false,
  requestType: 'fixed',
  photoURLs: [],
};

const BookingTracking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockBooking: BookingDetails = {
                    id: id || 'BK-12345',
                    status: 'in_transit',
                    date: '2023-06-15T10:00:00',
                    pickupLocation: '123 Main St, Accra',
                    dropoffLocation: '456 Park Ave, Kumasi',
                    itemType: 'Furniture',
                    itemSize: 'Large',
                    description: '1 sofa, 2 chairs, 1 coffee table',
                    provider: {
                        id: 'P-789',
                        name: "Kwame's Moving Services",
                        phone: '(555) 123-4567',
                        rating: 4.8,
                        vehicleType: 'Large Van',
                        verified: true,
                        capacity: '1000 kg',
                        serviceRadius: '50 km',
                        price: 500,
                        additionalInfo: 'Experienced movers with 5 years in business',
                        reviews: [{
                            text: "Delivered safely and on time!",
                            rating: 4,
                            author: "User123",
                            date: "March 2025"
                        }],
                        profileImage: 'https://via.placeholder.com/150'
                    },
                    estimatedDeliveryTime: '2023-06-15T14:00:00',
                    price: 600.0,
                    trackingUpdates: [
                        {
                            status: 'confirmed',
                            timestamp: '2023-06-14T15:30:00',
                            description: 'Booking confirmed',
                        },
                        {
                            status: 'picked_up',
                            timestamp: '2023-06-15T10:15:00',
                            description: 'Items picked up',
                        },
                        {
                            status: 'in_transit',
                            timestamp: '2023-06-15T11:30:00',
                            description: 'In transit',
                        },
                    ],
                };

                setBooking(mockBooking);
                setError(null);
            } catch (err) {
                setError('Failed to load booking details');
                console.error('Error fetching booking:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const getStatusStep = (status: string): number => {
        const statusSteps = {
            pending: 0,
            confirmed: 1,
            picked_up: 2,
            in_transit: 3,
            delivered: 4
        };
        return statusSteps[status as keyof typeof statusSteps] || 0;
    };

    const moveToNextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };
    
    const moveToPreviousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            const newPreviewImages: string[] = [...previewImages];
            const newPhotoURLs: string[] = [];
            
            fileArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    newPreviewImages.push(result);
                    newPhotoURLs.push(URL.createObjectURL(file));
                    
                    setPreviewImages([...newPreviewImages]);
                    setFieldValue('photoURLs', [...newPhotoURLs]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const renderStepIndicator = () => {
        return (
          <div className="flex justify-between items-center mb-8 px-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    step < currentStep ? 'bg-green-600' : step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {step === 1 ? 'Contact' : 
                   step === 2 ? 'Locations' : 
                   step === 3 ? 'Item Details' : 'Schedule'}
                </span>
              </div>
            ))}
            <div className="absolute left-0 right-0 h-1 top-5 -z-10 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Booking not found
                </div>
            </div>
        );
    }

    const progressWidth = (currentStep / 4) * 100;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Dashboard
                </Link>
            </div>

            {/* Main Booking Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Tracking: {booking.id}</h1>
                        <p className="text-gray-600">
                            Booked on {new Date(booking.date).toLocaleDateString()}
                        </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-4 md:mt-0">
                        {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500" 
                                style={{ width: `${progressWidth}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between">
                            {['confirmed', 'picked_up', 'in_transit', 'delivered'].map((status, index) => (
                                <div 
                                    key={status}
                                    className={`text-center ${currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'}`}
                                >
                                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                                        currentStep >= index + 1 ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                        <FontAwesomeIcon 
                                            icon={[faCheckCircle, faBox, faTruck, faMapMarkerAlt][index]} 
                                            className={currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'} 
                                        />
                                    </div>
                                    <div className="text-xs mt-1 capitalize">{status.replace('_', ' ')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Booking Details */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <DetailItem 
                                label="Item Type"
                                value={`${booking.itemType} - ${booking.itemSize}`}
                            />
                            {booking.description && (
                                <DetailItem label="Description" value={booking.description} />
                            )}
                            <DetailItem 
                                label="Pickup Location" 
                                value={booking.pickupLocation} 
                                icon={faMapMarkerAlt}
                                iconColor="text-red-500"
                            />
                            <DetailItem 
                                label="Dropoff Location" 
                                value={booking.dropoffLocation} 
                                icon={faMapMarkerAlt}
                                iconColor="text-green-500"
                            />
                            <DetailItem 
                                label="Price" 
                                value={`GHS ${booking.price.toFixed(2)}`}
                                valueStyle="text-lg font-semibold"
                            />
                        </div>
                    </div>

                    {/* Provider Details */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Provider Details</h2>
                        <div 
                            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => setShowProviderModal(true)}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{booking.provider.name}</div>
                                    <div className="flex items-center text-sm">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                        <span>{booking.provider.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <DetailItem 
                                label="Contact" 
                                value={booking.provider.phone} 
                                icon={faPhone}
                                link={`tel:${booking.provider.phone}`}
                            />
                            <DetailItem 
                                label="Vehicle Type" 
                                value={booking.provider.vehicleType} 
                                icon={faTruck}
                            />
                            {booking.estimatedDeliveryTime && (
                                <DetailItem 
                                    label="Estimated Delivery" 
                                    value={new Date(booking.estimatedDeliveryTime).toLocaleString()}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking History */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
                <div className="space-y-4">
                    {booking.trackingUpdates.map((update, index) => (
                        <TimelineItem 
                            key={index}
                            status={update.status}
                            timestamp={update.timestamp}
                            description={update.description}
                            isLast={index === booking.trackingUpdates.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* Provider Modal */}
            <ProviderModal 
                isOpen={showProviderModal} 
                onClose={() => setShowProviderModal(false)} 
                provider={booking.provider} 
            />
        </div>
    );
};

// Helper Components
const DetailItem: React.FC<{
    label: string;
    value: string | number;
    icon?: any;
    iconColor?: string;
    valueStyle?: string;
    link?: string;
}> = ({ label, value, icon, iconColor = 'text-gray-400', valueStyle = '', link }) => (
    <div className="mb-4 last:mb-0">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`flex items-start ${valueStyle}`}>
            {icon && <FontAwesomeIcon icon={icon} className={`${iconColor} mt-1 mr-2 flex-shrink-0`} />}
            {link ? (
                <a href={link} className="text-blue-600 hover:text-blue-800">
                    {value}
                </a>
            ) : (
                <span>{value}</span>
            )}
        </div>
    </div>
);

const TimelineItem: React.FC<{
    status: string;
    timestamp: string;
    description: string;
    isLast: boolean;
}> = ({ status, timestamp, description, isLast }) => (
    <div className="flex">
        <div className="mr-4">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            {!isLast && <div className="w-0.5 h-full bg-blue-200 mx-auto my-1"></div>}
        </div>
        <div className="flex-1">
            <div className="font-medium capitalize">
                {status.replace('_', ' ')}
            </div>
            <div className="text-sm text-gray-500">
                {new Date(timestamp).toLocaleString()}
            </div>
            <div className="text-gray-700 mt-1">{description}</div>
        </div>
    </div>
);

export default BookingTracking;