import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faClipboardList,
  faCheckCircle,
  faMapMarkerAlt,
  faUser,
  faStar,
  faCircle,
  faArrowRight,
  faTimes,
  faExclamationTriangle,
  faChevronRight,
  faComments,
  faBell,
  faCopy,
  faShare,
  faShieldAlt,
  faFileSignature,
  faMapMarkedAlt,
  faPercent,
  faHandshake,
  faClock,
  faInfoCircle,
  faExternalLinkAlt,
  faTimesCircle,
  faThumbsUp,
  faCloudDownloadAlt,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
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
    const [activeTab, setActiveTab] = useState<'details' | 'tracking' | 'documents'>('details');
    const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
    
    // Track location simulation
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [deliveryEta, setDeliveryEta] = useState<string>('');
    
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Keep your existing mock data here...
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
                            description: 'In transit to destination',
                        },
                    ],
                };

                setBooking(mockBooking);
                setDeliveryEta('2:15 PM');
                setCurrentLocation({ lat: 5.6037, lng: -0.1870 }); // Some location between Accra and Kumasi
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

    // Helper function to calculate delivery progress percentage
    const calculateProgressPercentage = () => {
        if (!booking) return 0;
        
        const statusMap = {
            'pending': 0,
            'confirmed': 25,
            'picked_up': 50,
            'in_transit': 75,
            'delivered': 100,
            'cancelled': 0
        };
        
        return statusMap[booking.status];
    };
    
    // Format the status for display
    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    // Get status color
    const getStatusColor = (status: string, isDark: boolean = false) => {
        const statusColors = {
            'pending': isDark ? 'yellow-400' : 'yellow-500',
            'confirmed': isDark ? 'blue-400' : 'blue-500',
            'picked_up': isDark ? 'indigo-400' : 'indigo-500',
            'in_transit': isDark ? 'purple-400' : 'purple-500',
            'delivered': isDark ? 'green-400' : 'green-500',
            'cancelled': isDark ? 'red-400' : 'red-500'
        };
        
        const colorKey = status as keyof typeof statusColors;
        return statusColors[colorKey] || (isDark ? 'gray-400' : 'gray-500');
    };
    
    // Get status background color for dark mode
    const getStatusBgColor = (status: string, isDark: boolean = false) => {
        const statusBgColors = {
            'pending': isDark ? 'yellow-900/20' : 'yellow-100',
            'confirmed': isDark ? 'blue-900/20' : 'blue-100',
            'picked_up': isDark ? 'indigo-900/20' : 'indigo-100',
            'in_transit': isDark ? 'purple-900/20' : 'purple-100',
            'delivered': isDark ? 'green-900/20' : 'green-100',
            'cancelled': isDark ? 'red-900/20' : 'red-100'
        };
        
        const colorKey = status as keyof typeof statusBgColors;
        return statusBgColors[colorKey] || (isDark ? 'gray-800' : 'gray-100');
    };
    
    // Get status text color
    const getStatusTextColor = (status: string, isDark: boolean = false) => {
        const statusTextColors = {
            'pending': isDark ? 'yellow-300' : 'yellow-800',
            'confirmed': isDark ? 'blue-300' : 'blue-800',
            'picked_up': isDark ? 'indigo-300' : 'indigo-800',
            'in_transit': isDark ? 'purple-300' : 'purple-800',
            'delivered': isDark ? 'green-300' : 'green-800',
            'cancelled': isDark ? 'red-300' : 'red-800'
        };
        
        const colorKey = status as keyof typeof statusTextColors;
        return statusTextColors[colorKey] || (isDark ? 'gray-300' : 'gray-800');
    };
    
    const statusColor = booking ? getStatusColor(booking.status) : 'gray-500';
    const statusColorDark = booking ? getStatusColor(booking.status, true) : 'gray-400';
    const statusBgColor = booking ? getStatusBgColor(booking.status) : 'gray-100';
    const statusBgColorDark = booking ? getStatusBgColor(booking.status, true) : 'gray-800';
    const statusTextColor = booking ? getStatusTextColor(booking.status) : 'gray-800';
    const statusTextColorDark = booking ? getStatusTextColor(booking.status, true) : 'gray-300';

    // Helper to copy tracking ID
    const copyTrackingId = () => {
        if (!booking) return;
        navigator.clipboard.writeText(booking.id);
        // You could add a toast notification here
        alert('Tracking ID copied to clipboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Loading Your Booking</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            Please wait while we fetch the latest information about your delivery.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 dark:text-red-400 text-2xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Booking</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                            {error}
                        </p>
                        <Link 
                            to="/dashboard" 
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mb-4">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 dark:text-yellow-400 text-2xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Booking Not Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                            We couldn't find the booking you're looking for. It may have been deleted or the ID is incorrect.
                        </p>
                        <Link 
                            to="/dashboard" 
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
            {/* Header Bar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center">
                                    <FontAwesomeIcon icon={faChevronRight} className="transform rotate-180 mr-2" />
                                    <span className="font-medium">Back to Dashboard</span>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button 
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="ml-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FontAwesomeIcon icon={faShare} />
                            </button>
                            {showShareOptions && (
                                <div className="absolute right-0 mt-2 top-16 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <button 
                                            onClick={copyTrackingId}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        >
                                            <FontAwesomeIcon icon={faCopy} className="mr-3" />
                                            Copy Tracking ID
                                        </button>
                                        <a 
                                            href={`mailto:?subject=Track my delivery&body=You can track my delivery using this ID: ${booking.id}`}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        >
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                                            Share via Email
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Booking #{booking.id}</h1>
                                <button 
                                    onClick={copyTrackingId}
                                    className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    title="Copy tracking ID"
                                >
                                    <FontAwesomeIcon icon={faCopy} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Placed on {new Date(booking.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-medium bg-${statusBgColor} dark:bg-${statusBgColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}`}>
                                {formatStatus(booking.status)}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                <span className="font-medium">Total:</span> GHS {booking.price.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Status Progress Bar */}
                    <div className="px-6 py-4">
                        <div className="relative pt-4">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 dark:text-blue-300 bg-blue-200 dark:bg-blue-900/30">
                                        Delivery Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                                        {calculateProgressPercentage()}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-gray-700">
                                <div 
                                    style={{ width: `${calculateProgressPercentage()}%` }} 
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${statusColor} dark:bg-${statusColorDark}`}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs md:text-sm pt-2">
                            {['confirmed', 'picked_up', 'in_transit', 'delivered'].map((status, idx) => {
                                const statusIndex = ['confirmed', 'picked_up', 'in_transit', 'delivered'].indexOf(booking.status);
                                const isActive = idx <= statusIndex;
                                return (
                                    <div key={status} className={`text-center ${isActive ? 'text-' + statusTextColor + ' dark:text-' + statusTextColorDark : 'text-gray-400 dark:text-gray-500'}`}>
                                        <div className="mb-1">
                                            <FontAwesomeIcon 
                                                icon={[faCheckCircle, faBox, faTruck, faMapMarkerAlt][idx]} 
                                                className={`text-lg ${isActive ? 'text-' + statusColor + ' dark:text-' + statusColorDark : 'text-gray-300 dark:text-gray-600'}`}
                                            />
                                        </div>
                                        <div className="capitalize font-medium">
                                            {status.replace('_', ' ')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ETA Card (only show for in_transit) */}
                {booking.status === 'in_transit' && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-800/70 dark:to-indigo-900/70 rounded-xl shadow-lg mb-6 overflow-hidden dark:shadow-indigo-900/20">
                        <div className="px-6 py-5 flex justify-between items-center">
                            <div className="text-white">
                                <h2 className="text-lg font-bold">Estimated Arrival</h2>
                                <p className="text-blue-100 dark:text-blue-200">Your delivery is on the way</p>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {deliveryEta}
                            </div>
                        </div>
                        
                        {/* Map placeholder - in a real app, you'd integrate a map API here */}
                        <div className="h-48 bg-blue-400 dark:bg-blue-900 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-4xl mb-2 text-white/90 dark:text-white/80" />
                                    <p className="font-medium">Live tracking map would be displayed here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delivery Location Summary */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delivery Route</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 mb-4 md:mb-0">
                                <div className="flex items-start">
                                    <div className="mt-1 mr-4">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Pickup Location</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-0.5">{booking.pickupLocation}</p>
                                        {booking.trackingUpdates.find(u => u.status === 'picked_up') && (
                                            <div className="text-green-600 dark:text-green-400 text-sm mt-1.5 flex items-center">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                Picked up at {new Date(booking.trackingUpdates.find(u => u.status === 'picked_up')?.timestamp || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-col items-center justify-center px-8">
                                <div className="w-20 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                <div className="my-2">
                                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Est. 3 hrs
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start">
                                    <div className="mt-1 mr-4">
                                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Delivery Location</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-0.5">{booking.dropoffLocation}</p>
                                        {booking.status === 'in_transit' && (
                                            <div className="text-indigo-600 dark:text-indigo-400 text-sm mt-1.5 flex items-center">
                                                <FontAwesomeIcon icon={faClock} className="mr-1" />
                                                Expected at {deliveryEta}
                                            </div>
                                        )}
                                        {booking.status === 'delivered' && (
                                            <div className="text-green-600 dark:text-green-400 text-sm mt-1.5 flex items-center">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                Delivered at {new Date(booking.trackingUpdates.find(u => u.status === 'delivered')?.timestamp || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                    <div className="px-1 border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px">
                            <button
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                    activeTab === 'details'
                                        ? `border-${statusColor} dark:border-${statusColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => setActiveTab('details')}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                Booking Details
                            </button>
                            <button
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                    activeTab === 'tracking'
                                        ? `border-${statusColor} dark:border-${statusColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => setActiveTab('tracking')}
                            >
                                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                Tracking History
                            </button>
                            <button
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                    activeTab === 'documents'
                                        ? `border-${statusColor} dark:border-${statusColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => setActiveTab('documents')}
                            >
                                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                                Documents
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Booking Details */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Information</h3>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 divide-y divide-gray-200 dark:divide-gray-700">
                                            <div className="py-3 flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Booking ID</span>
                                                <span className="text-gray-900 dark:text-white font-medium">{booking.id}</span>
                                            </div>
                                            <div className="py-3 flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Booking Date</span>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="py-3 flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                                <span className={`text-${statusTextColor} dark:text-${statusTextColorDark} font-medium`}>
                                                    {formatStatus(booking.status)}
                                                </span>
                                            </div>
                                            <div className="py-3 flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    GHS {booking.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="py-3 flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Payment Status</span>
                                                <span className="text-green-600 dark:text-green-400 font-medium">
                                                    Paid
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">Items Information</h3>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                            <div className="flex items-start mb-4">
                                                <FontAwesomeIcon icon={faBox} className="text-gray-400 dark:text-gray-500 mt-1 mr-3" />
                                                <div>
                                                    <div className="text-gray-900 dark:text-white font-medium">
                                                        {booking.itemType} - {booking.itemSize}
                                                    </div>
                                                    {booking.description && (
                                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                            {booking.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Add more item-specific details here */}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">Weight</span>
                                                    <span className="text-gray-900 dark:text-white font-medium">Approx. 50kg</span>
                                                </div>
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">Quantity</span>
                                                    <span className="text-gray-900 dark:text-white font-medium">4 items</span>
                                                </div>
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 col-span-2">
                                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">Special Instructions</span>
                                                    <span className="text-gray-900 dark:text-white">Fragile items. Handle with care.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Provider Details */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Provider Information</h3>
                                        <div 
                                            className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                                            onClick={() => setShowProviderModal(true)}
                                        >
                                            <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 mr-4">
                                                    {booking.provider.profileImage ? (
                                                        <img 
                                                            src={booking.provider.profileImage} 
                                                            alt={booking.provider.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-800">
                                                            <FontAwesomeIcon icon={faUser} className="text-blue-600 dark:text-blue-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                        {booking.provider.name}
                                                        {booking.provider.verified && (
                                                            <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full flex items-center">
                                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center text-sm mt-1">
                                                        <div className="flex items-center text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FontAwesomeIcon 
                                                                    key={i} 
                                                                    icon={faStar} 
                                                                    className={i < Math.floor(booking.provider.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                            {booking.provider.rating} ({booking.provider.reviews.length} reviews)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 space-y-3">
                                                <div className="flex">
                                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                                    <div className="ml-3">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                                        <a href={`tel:${booking.provider.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                            {booking.provider.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                                    <div className="ml-3">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Vehicle</div>
                                                        <div className="text-gray-900 dark:text-white">{booking.provider.vehicleType}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <FontAwesomeIcon icon={faShieldAlt} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                                    <div className="ml-3">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Insurance</div>
                                                        <div className="text-gray-900 dark:text-white">Fully Insured Service</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-blue-600 dark:text-blue-400 flex justify-end">
                                                View Full Profile <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">Quick Actions</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 px-4 rounded-md flex items-center justify-center shadow-sm dark:shadow-blue-900/30">
                                                <FontAwesomeIcon icon={faComments} className="mr-2" />
                                                Message Provider
                                            </button>
                                            <button className="bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-md flex items-center justify-center shadow-sm dark:shadow-none">
                                                <FontAwesomeIcon icon={faBell} className="mr-2" />
                                                Get Updates
                                            </button>
                                        </div>

                                        {/* For in-transit only */}
                                        {booking.status === 'in_transit' && (
                                            <div className="mt-4">
                                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-md p-4 flex items-start">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500 dark:text-yellow-400 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-yellow-800 dark:text-yellow-300 font-medium">Delivery in Progress</p>
                                                        <p className="text-yellow-700 dark:text-yellow-400/90 text-sm mt-1">
                                                            Your items are currently being transported to the destination. You'll be notified when they arrive.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* For delivered only */}
                                        {booking.status === 'delivered' && (
                                            <div className="mt-4">
                                                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-md p-4">
                                                    <div className="flex items-start mb-3">
                                                        <FontAwesomeIcon icon={faThumbsUp} className="text-green-500 dark:text-green-400 mt-1 mr-3" />
                                                        <div>
                                                            <p className="text-green-800 dark:text-green-300 font-medium">Delivery Completed</p>
                                                            <p className="text-green-700 dark:text-green-400/90 text-sm mt-1">
                                                                Your items have been delivered successfully. Please rate your experience with the provider.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <button className="mt-2 w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white py-2 px-4 rounded-md shadow-sm dark:shadow-green-900/30">
                                                        Rate Your Experience
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tracking History Tab */}
                        {activeTab === 'tracking' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Tracking History</h3>
                                
                                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 pb-8">
                                    {booking.trackingUpdates.map((update, index) => (
                                        <div 
                                            key={index} 
                                            className={`mb-8 ${index === 0 ? 'relative' : ''}`}
                                        >
                                            <div className="absolute -left-[25px] mt-1.5">
                                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                                    index === 0 
                                                        ? `bg-${statusBgColor} dark:bg-${statusBgColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}` 
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    <FontAwesomeIcon 
                                                        icon={
                                                            update.status === 'confirmed' ? faCheckCircle :
                                                            update.status === 'picked_up' ? faBox :
                                                            update.status === 'in_transit' ? faTruck :
                                                            update.status === 'delivered' ? faMapMarkerAlt :
                                                            faCircle
                                                        } 
                                                        className="text-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className={`bg-white dark:bg-gray-800 p-4 border ${
                                                index === 0 
                                                    ? `border-${statusBgColor} dark:border-${statusColorDark}/30 shadow-sm` 
                                                    : 'border-gray-200 dark:border-gray-700'
                                            } rounded-lg shadow-sm`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className={`font-medium ${
                                                            index === 0 
                                                                ? `text-${statusTextColor} dark:text-${statusTextColorDark}` 
                                                                : 'text-gray-900 dark:text-white'
                                                        }`}>
                                                            {formatStatus(update.status)}
                                                        </span>
                                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                            {update.description}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(update.timestamp).toLocaleDateString()} at{' '}
                                                        {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>

                                                {/* Add additional details for each status as needed */}
                                                {update.status === 'picked_up' && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Picked up from: {booking.pickupLocation}
                                                        </span>
                                                    </div>
                                                )}

                                                {update.status === 'in_transit' && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Currently in transit to: {booking.dropoffLocation}
                                                        </span>
                                                        {booking.estimatedDeliveryTime && (
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                ETA: {new Date(booking.estimatedDeliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Future status placeholders */}
                                    {booking.status !== 'delivered' && (
                                        <>
                                            <div className="mb-8">
                                                <div className="absolute -left-[25px] mt-1.5">
                                                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                                        {booking.status !== 'in_transit' ? (
                                                            <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 text-lg" />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500 text-lg" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-750 p-4 border border-gray-200 dark:border-gray-700 rounded-lg border-dashed">
                                                    <span className="font-medium text-gray-500 dark:text-gray-400">
                                                        {booking.status !== 'in_transit' ? 'In Transit' : 'Delivery'}
                                                    </span>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                        {booking.status !== 'in_transit' ? 'Your items will be on their way soon' : 'Waiting for delivery confirmation'}
                                                    </p>
                                                </div>
                                            </div>

                                            {booking.status === 'confirmed' && (
                                                <div className="mb-8">
                                                    <div className="absolute -left-[25px] mt-1.5">
                                                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 dark:text-gray-500 text-lg" />
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-750 p-4 border border-gray-200 dark:border-gray-700 rounded-lg border-dashed">
                                                        <span className="font-medium text-gray-500 dark:text-gray-400">
                                                            Delivery
                                                        </span>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                            Your items will be delivered to the destination
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Documents & Receipts</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Invoice */}
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm dark:shadow-none">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">Invoice #{booking.id}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                    Generated on {new Date(booking.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex">
                                                <button className="mr-2 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                                    <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 bg-gray-50 dark:bg-gray-750 rounded p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                                                <span className="text-gray-800 dark:text-gray-200">GHS {(booking.price * 0.8).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Insurance</span>
                                                <span className="text-gray-800 dark:text-gray-200">GHS {(booking.price * 0.1).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                                                <span className="text-gray-800 dark:text-gray-200">GHS {(booking.price * 0.1).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                                                <span className="font-medium text-gray-800 dark:text-gray-200">Total</span>
                                                <span className="font-bold text-gray-800 dark:text-gray-200">GHS {booking.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex justify-center">
                                            <button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center shadow-sm dark:shadow-blue-900/20">
                                                <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-2" />
                                                Download Invoice
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Delivery Receipt */}
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm dark:shadow-none">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Delivery Receipt</h4>
                                        
                                        {booking.status === 'delivered' ? (
                                            <>
                                                <div className="mt-4 flex items-center">
                                                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                                                        <FontAwesomeIcon icon={faFileSignature} className="text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-900 dark:text-white font-medium">Delivery Confirmed</div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Signed by: John Doe
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-750 rounded">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                                                        Delivered on 15 June 2023, 2:45 PM
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 flex justify-center">
                                                    <button className="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center shadow-sm dark:shadow-green-900/20">
                                                        <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-2" />
                                                        Download Receipt
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-750 rounded text-center">
                                                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 dark:text-gray-500 text-2xl mb-2" />
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    A delivery receipt will be available once your items have been delivered.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Booking Terms & Conditions */}
                                <div className="mt-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Terms & Conditions</h4>
                                    <p className="mb-2">
                                        This booking is subject to the company's standard terms and conditions for delivery services.
                                    </p>
                                    <p>
                                        For refunds and cancelation policy, please refer to our terms of service or contact customer support.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className={`flex items-start mt-1 ${valueStyle}`}>
            {icon && <FontAwesomeIcon icon={icon} className={`${iconColor} mt-1 mr-2 flex-shrink-0`} />}
            {link ? (
                <a href={link} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {value}
                </a>
            ) : (
                <span className="text-gray-900 dark:text-gray-100">{value}</span>
            )}
        </div>
    </div>
);

export default BookingTracking;