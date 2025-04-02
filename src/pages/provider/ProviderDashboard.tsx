import { 
  faCalendarAlt, faMoneyBillWave, faSearch, faStar, faTruck, faBell, 
  faCommentAlt, faUser, faChartLine, faClipboardCheck, faMapMarkerAlt,
  faShieldAlt, faExclamationCircle, faTimes, faAngleRight, faEllipsisV,
  faArrowUp, faArrowDown, faFilter, faSortAmountUp, faSyncAlt,
  faCheckCircle, faEye, faClock, faPaperPlane, faBox,
  faChevronUp, faChevronDown, faLocationDot, faRoute, faWallet,
  faExclamationTriangle, faHandshake, faTruckLoading, faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/ui/statCard';

interface ItemDetail {
    name: string;
    quantity: number;
    dimensions: string;
    weight: string;
}

interface Customer {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    phone?: string;
    email?: string;
    bookingsCount?: number;
}

interface Booking {
    id: string;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    date: string;
    time?: string;
    pickupLocation: string;
    dropoffLocation: string;
    itemType: string;
    itemSize: string;
    price: number;
    customerName: string;
    customerRating?: number;
    customer?: Customer;
    notes?: string;
    distance?: number;
    duration?: string;
    paymentStatus: 'paid' | 'pending' | 'partial' | 'overdue';
    itemDetails?: ItemDetail[];
    trackingUpdates?: Array<{
        timestamp: string;
        message: string;
    }>;
    isHighPriority?: boolean;
}

const ProviderDashboard: React.FC = () => {
    const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('upcoming');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
    const navigate = useNavigate();
    const [providerInfo, setProviderInfo] = useState<{
        name: string;
        avatar: string;
        company: string;
        verificationBadges: string[];
    } | null>(null);

    useEffect(() => {
        // Simulating API call to fetch provider info
        setTimeout(() => {
            setProviderInfo({
                name: 'Ellis Rockefeller',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                company: 'MoreVans Logistics',
                verificationBadges: ['Verified', 'Top Rated']
            });
        }, 500);
    }, []);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Fetch bookings data
    useEffect(() => {
        // Simulating API call
        setTimeout(() => {
            const mockBookings: Booking[] = [
                {
                    id: 'BK-23457',
                    status: 'pending',
                    date: '2025-04-10T09:00:00',
                    time: '09:00',
                    pickupLocation: '123 Main St, London, UK',
                    dropoffLocation: '456 Oxford St, London, UK',
                    itemType: 'Furniture',
                    itemSize: 'Medium',
                    price: 120,
                    customerName: 'Emma Thompson',
                    customerRating: 4.8,
                    paymentStatus: 'pending',
                    customer: {
                        id: 'cus-001',
                        name: 'Emma Thompson',
                        avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
                        rating: 4.8,
                        bookingsCount: 3
                    },
                    notes: 'Contains fragile items, please handle with care.',
                    distance: 3.2,
                    duration: '25 min',
                    isHighPriority: true
                },
                {
                    id: 'BK-23458',
                    status: 'accepted',
                    date: '2025-04-11T13:30:00',
                    time: '13:30',
                    pickupLocation: '10 Downing St, London, UK',
                    dropoffLocation: '221B Baker St, London, UK',
                    itemType: 'Electronics',
                    itemSize: 'Small',
                    price: 85,
                    customerName: 'John Davis',
                    customerRating: 4.9,
                    paymentStatus: 'paid',
                    customer: {
                        id: 'cus-002',
                        name: 'John Davis',
                        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                        rating: 4.9,
                        bookingsCount: 7
                    },
                    notes: 'Office equipment, includes monitor and desktop.',
                    distance: 2.5,
                    duration: '18 min',
                    trackingUpdates: [
                        { timestamp: '2025-04-01 15:30', message: 'Booking confirmed' },
                        { timestamp: '2025-04-02 10:25', message: 'Payment received' },
                    ]
                },
                {
                    id: 'BK-23459',
                    status: 'in_progress',
                    date: '2025-04-12T10:00:00',
                    time: '10:00',
                    pickupLocation: '15 Abbey Road, London, UK',
                    dropoffLocation: '33 Carnaby St, London, UK',
                    itemType: 'Boxes',
                    itemSize: 'Large',
                    price: 150,
                    customerName: 'Sophie Wilson',
                    customerRating: 4.7,
                    paymentStatus: 'paid',
                    customer: {
                        id: 'cus-003',
                        name: 'Sophie Wilson',
                        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
                        rating: 4.7,
                        bookingsCount: 2
                    },
                    notes: 'Entire apartment move, estimated 15 boxes.',
                    distance: 4.8,
                    duration: '35 min',
                    trackingUpdates: [
                        { timestamp: '2025-04-03 08:30', message: 'Booking confirmed' },
                        { timestamp: '2025-04-03 16:45', message: 'Payment received' },
                        { timestamp: '2025-04-12 09:15', message: 'Driver en route to pickup location' },
                        { timestamp: '2025-04-12 10:00', message: 'Loading started' },
                    ]
                },
                {
                    id: 'BK-23460',
                    status: 'completed',
                    date: '2025-04-05T11:00:00',
                    time: '11:00',
                    pickupLocation: '45 Park Lane, London, UK',
                    dropoffLocation: '88 Wood Green, London, UK',
                    itemType: 'Artwork',
                    itemSize: 'Medium',
                    price: 200,
                    customerName: 'Robert Brown',
                    customerRating: 5.0,
                    paymentStatus: 'paid',
                    customer: {
                        id: 'cus-004',
                        name: 'Robert Brown',
                        avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
                        rating: 5.0,
                        bookingsCount: 5
                    },
                    notes: 'Valuable paintings, requires specialized handling.',
                    distance: 6.3,
                    duration: '40 min',
                    trackingUpdates: [
                        { timestamp: '2025-03-30 13:40', message: 'Booking confirmed' },
                        { timestamp: '2025-03-31 09:25', message: 'Payment received' },
                        { timestamp: '2025-04-05 10:30', message: 'Driver arrived at pickup location' },
                        { timestamp: '2025-04-05 11:15', message: 'Loading completed' },
                        { timestamp: '2025-04-05 12:05', message: 'Arrived at destination' },
                        { timestamp: '2025-04-05 12:30', message: 'Delivery completed' },
                    ]
                }
            ];
            
            setBookings(mockBookings);
            setIsLoading(false);
        }, 1000);
        
        // Click outside handler for notifications
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter bookings based on status, search query, and active tab
    const filteredBookings = bookings.filter(booking => {
        // Status filter
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        
        // Search filter
        const matchesSearch = 
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Tab filter
        let matchesTab = true;
        if (activeTab === 'upcoming') {
            matchesTab = booking.status === 'pending' || booking.status === 'accepted';
        } else if (activeTab === 'active') {
            matchesTab = booking.status === 'in_progress';
        } else if (activeTab === 'completed') {
            matchesTab = booking.status === 'completed';
        }
        
        return matchesStatus && matchesSearch && matchesTab;
    });

    const toggleBookingDetails = (bookingId: string) => {
        if (expandedBooking === bookingId) {
            setExpandedBooking(null);
        } else {
            setExpandedBooking(bookingId);
        }
    };

    // Navigate to booking detail
    const goToBookingDetail = (bookingId: string) => {
        navigate(`/provider/bookings/${bookingId}`);
    };

    // Helper functions for UI elements
    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            case 'accepted':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'in_progress':
                return 'In Progress';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        Payment Pending
                    </span>
                );
            case 'partial':
                return (
                    <span className="flex items-center text-orange-600 dark:text-orange-400 text-sm">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        Partially Paid
                    </span>
                );
            case 'overdue':
                return (
                    <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                        Payment Overdue
                    </span>
                );
            default:
                return null;
        }
    };

    // Get appropriate action buttons based on booking status
    const getPrimaryActionButton = (booking: Booking) => {
        switch (booking.status) {
            case 'pending':
                return (
                    <button 
                        onClick={() => { /* Accept booking logic */ }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                        Accept Booking
                    </button>
                );
            case 'accepted':
                return (
                    <button 
                        onClick={() => goToBookingDetail(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View Details
                    </button>
                );
            case 'in_progress':
                return (
                    <button 
                        onClick={() => goToBookingDetail(booking.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faTruckLoading} className="mr-2" />
                        Update Status
                    </button>
                );
            case 'completed':
                return (
                    <button 
                        onClick={() => goToBookingDetail(booking.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                        Invoice & Report
                    </button>
                );
            default:
                return (
                    <button 
                        onClick={() => goToBookingDetail(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View Details
                    </button>
                );
        }
    };

    const getSecondaryActionButton = (booking: Booking) => {
        switch (booking.status) {
            case 'pending':
                return (
                    <button 
                        onClick={() => { /* Decline booking logic */ }}
                        className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Decline
                    </button>
                );
            case 'accepted':
                return (
                    <button 
                        onClick={() => { /* Start journey logic */ }}
                        className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                        Start Journey
                    </button>
                );
            case 'in_progress':
                return (
                    <button 
                        onClick={() => { /* Message customer logic */ }}
                        className="bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faCommentAlt} className="mr-2" />
                        Message Customer
                    </button>
                );
            case 'completed':
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section - Enhanced with gradient and animations */}
                {/* Enhanced Header with Provider Info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg mb-8 overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white animate-pulse delay-700"></div>
                    <div className="absolute top-24 right-32 w-16 h-16 rounded-full bg-white animate-pulse delay-300"></div>
                </div>
                
                <div className="p-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            {providerInfo && (
                                <>
                                    <div className="mr-4">
                                        <img 
                                            src={providerInfo.avatar} 
                                            alt={providerInfo.name} 
                                            className="w-16 h-16 rounded-full border-2 border-white"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1 text-white">Welcome, {providerInfo.name}</h1>
                                        <p className="text-blue-100">{providerInfo.company}</p>
                                        <div className="flex mt-2">
                                            {providerInfo.verificationBadges.map((badge: string, index: number) => (
                                                <span key={index} className="mr-2 bg-blue-500/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                                                    <FontAwesomeIcon icon={faShieldAlt} className="mr-1" /> 
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link 
                                to="/provider/jobs" 
                                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                Find Jobs
                            </Link>
                            <Link 
                                to="/provider/analysis" 
                                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                                Performance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

                {/* Stats Cards - Improved with hover effects and dark mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={faTruck}
                        title="Today's Jobs" 
                        value={bookings.filter(b => {
                            const today = new Date();
                            const bookingDate = new Date(b.date);
                            return bookingDate.toDateString() === today.toDateString();
                        }).length} 
                        color="blue"
                        trend={{ 
                            value: 15, 
                            isPositive: true 
                        }}
                    />
                    
                    <StatCard 
                        icon={faMoneyBillWave} 
                        title="Weekly Earnings" 
                        value={`£${bookings.reduce((sum, booking) => sum + booking.price, 0)}`} 
                        color="green"
                        trend={{ 
                            value: 12, 
                            isPositive: true 
                        }}
                    />
                    
                    <StatCard 
                        icon={faMapMarkerAlt} 
                        title="Pending Jobs" 
                        value={bookings.filter(b => b.status === 'pending').length} 
                        color="yellow"
                    />
                    
                    <StatCard 
                        icon={faStar} 
                        title="Completed Jobs" 
                        value={bookings.filter(b => b.status === 'completed').length} 
                        color="purple"
                        trend={{ 
                            value: 8, 
                            isPositive: true 
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Jobs List */}
                    <div className="w-full lg:w-3/4 space-y-6">
                        {/* Header with filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">My Jobs</h2>
                                
                                <div className="relative">
                                    <div className="flex space-x-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search jobs..."
                                                className="border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tab Navigation - Radio style tabs */}
                            <div className="flex space-x-2 overflow-x-auto">
                                <button 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'upcoming' 
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('upcoming')}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Upcoming Jobs
                                </button>
                                <button 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'active' 
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('active')}
                                >
                                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                    Active Jobs
                                </button>
                                <button 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'completed' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('completed')}
                                >
                                    <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                                    Completed Jobs
                                </button>
                                <button 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'all' 
                                            ? 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white' 
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All Jobs
                                </button>
                            </div>
                        </div>
                        
                        {/* Bookings List - Collapsible cards */}
                        <div className="space-y-4">
                            {isLoading ? (
                                // Loading skeleton
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                            <div className="flex-grow">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                                </div>
                                            </div>
                                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                        {/* Booking Header - Always visible */}
                                        <div 
                                            className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                                                       hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                            onClick={() => toggleBookingDetails(booking.id)}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="flex-grow">
                                                    <div className="flex items-center mb-2">
                                                        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 mr-3">
                                                            {booking.itemType}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                        {booking.isHighPriority && (
                                                            <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 text-xs px-2 py-1 rounded-full flex items-center">
                                                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                                                                Priority
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <span className="font-medium">{booking.id}</span> • {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 gap-y-1 sm:gap-x-4">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                                                            {booking.distance ? `${booking.distance} miles` : 'Distance N/A'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faBox} className="mr-2 text-blue-500 dark:text-blue-400" />
                                                            {booking.itemSize} Load
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500 dark:text-blue-400" />
                                                            £{booking.price.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Payment status */}
                                                    <div className="mt-2">
                                                        {getPaymentStatusBadge(booking.paymentStatus)}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center mt-4 md:mt-0">
                                                    {booking.customer && (
                                                        <div className="flex items-center mr-4 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                                                            {booking.customer.avatar && (
                                                                <img 
                                                                    src={booking.customer.avatar} 
                                                                    alt={booking.customerName}
                                                                    className="h-5 w-5 rounded-full mr-2 object-cover"
                                                                />
                                                            )}
                                                            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">{booking.customerName}</span>
                                                            {booking.customerRating && (
                                                                <div className="flex items-center text-yellow-400">
                                                                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                                                                    <span className="ml-1 text-xs text-gray-700 dark:text-gray-300">{booking.customerRating.toFixed(1)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <FontAwesomeIcon 
                                                        icon={expandedBooking === booking.id ? faChevronUp : faChevronDown} 
                                                        className="text-gray-500 dark:text-gray-400" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details - Only shown when expanded */}
                                        {expandedBooking === booking.id && (
                                            <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-750 animate-fadeIn">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div>
                                                        <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Booking Details</h3>
                                                        
                                                        {/* Locations */}
                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-4">
                                                            <div className="flex items-start mb-3">
                                                                <div className="mt-1 mr-3">
                                                                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">A</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup</p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.pickupLocation}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-start">
                                                                <div className="mt-1 mr-3">
                                                                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">B</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dropoff</p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.dropoffLocation}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Item details */}
                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Information</h4>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Item Type</p>
                                                                    <p className="text-sm font-medium">{booking.itemType}</p>
                                                                </div>
                                                                
                                                                <div>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Size</p>
                                                                    <p className="text-sm font-medium">{booking.itemSize}</p>
                                                                </div>
                                                                
                                                                {booking.notes && (
                                                                    <div className="col-span-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Special Instructions</p>
                                                                        <p className="text-sm mt-1">{booking.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        {/* Customer information */}
                                                        {booking.customer && (
                                                            <div className="mb-4">
                                                                <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Customer Information</h3>
                                                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                                                    <div className="flex items-center mb-3">
                                                                        {booking.customer.avatar ? (
                                                                            <img 
                                                                                src={booking.customer.avatar} 
                                                                                alt={booking.customer.name}
                                                                                className="h-10 w-10 rounded-full mr-3 object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                                                <FontAwesomeIcon icon={faUser} className="text-gray-500 dark:text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="font-medium text-gray-800 dark:text-white">{booking.customer.name}</p>
                                                                            <div className="flex items-center text-sm">
                                                                                <div className="flex items-center text-yellow-400 mr-2">
                                                                                    <FontAwesomeIcon icon={faStar} className="text-xs mr-1" />
                                                                                    <span>{booking.customer.rating}</span>
                                                                                </div>
                                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                                    {booking.customer.bookingsCount} bookings
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {booking.customer.phone && (
                                                                        <button className="w-full mt-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded flex items-center justify-center text-sm font-medium">
                                                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                                            Contact Customer
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Tracking updates */}
                                                        <div>
                                                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Tracking Updates</h3>
                                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                                                {booking.trackingUpdates && booking.trackingUpdates.length > 0 ? (
                                                                    <div className="relative">
                                                                        <div className="absolute left-4 top-0 h-full w-px bg-blue-100 dark:bg-blue-900"></div>
                                                                        
                                                                        {booking.trackingUpdates.map((update, index) => (
                                                                            <div key={index} className="ml-9 mb-4 relative pb-1">
                                                                                <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{update.timestamp}</p>
                                                                                <p className="text-sm">{update.message}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-4">
                                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-2xl mb-2" />
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">No updates yet</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Action buttons */}
                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {getPrimaryActionButton(booking)}
                                                            {getSecondaryActionButton(booking)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-3" />
                                    <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No jobs found</div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        {searchQuery || filterStatus !== 'all' ? 
                                            'Try adjusting your filters or search terms' : 
                                            'You don\'t have any jobs in this category'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Summary & Quick Actions */}
                    <div className="w-full lg:w-1/4 space-y-6">
                        {/* Today's Schedule Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Today's Schedule</h2>
                            {bookings
                                .filter(b => {
                                    const today = new Date();
                                    const bookingDate = new Date(b.date);
                                    return bookingDate.toDateString() === today.toDateString();
                                })
                                .slice(0, 3)
                                .map((booking, index) => (
                                    <div 
                                        key={booking.id} 
                                        className={`p-3 rounded-lg mb-2 border-l-4 ${
                                            booking.status === 'in_progress'
                                                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                                                : booking.status === 'completed'
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                        }`}
                                        onClick={() => goToBookingDetail(booking.id)}
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">{booking.time}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </div>
                                        <p className="text-sm mt-1 font-medium line-clamp-1">{booking.itemType}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                            {booking.pickupLocation.split(",")[0]} → {booking.dropoffLocation.split(",")[0]}
                                        </p>
                                    </div>
                                ))
                            }
                            
                            {bookings.filter(b => {
                                const today = new Date();
                                const bookingDate = new Date(b.date);
                                return bookingDate.toDateString() === today.toDateString();
                            }).length === 0 && (
                                <div className="text-center py-6">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-300 text-3xl mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">No jobs scheduled for today</p>
                                </div>
                            )}
                        </div>

                        {/* Weekly Performance */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Performance Summary</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Completion Rate</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">98%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{width: '98%'}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">On-Time Delivery</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">95%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Customer Satisfaction</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">4.9/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '97%'}}></div>
                                    </div>
                                </div>
                                
                                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                    <Link to="/provider/analytics" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center">
                                        View detailed analytics
                                        <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/provider/earnings" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <span>View Earnings</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/provider/availability" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 dark:text-green-400" />
                                        </div>
                                        <span>Set Availability</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/provider/messages" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faCommentAlt} className="text-purple-500 dark:text-purple-400" />
                                        </div>
                                        <div className="flex justify-between items-center w-full">
                                            <span>Messages</span>
                                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/provider/reviews" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faStar} className="text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                        <span>My Reviews</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Fixed notification bell */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faBell} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>
                    
                    {showNotifications && (
                        <div 
                            ref={notificationsRef}
                            className="absolute bottom-14 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                                <h3 className="font-medium">Notifications</h3>
                                <button className="text-sm text-blue-600 dark:text-blue-400">Clear all</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                                <FontAwesomeIcon icon={faTruck} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">New booking request</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                You have a new booking request for delivery on April 10
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">5 min ago</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                <FontAwesomeIcon icon={faMoneyBillWave} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Payment received</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Payment of £85 has been deposited in your account
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                                                <FontAwesomeIcon icon={faStar} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">New 5-star review</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Robert Brown left you a 5-star review on your recent delivery
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                                <Link to="/provider/notifications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
