import {
    faCalendarAlt,
    faMoneyBillWave,
    faSearch,
    faStar,
    faTruck,
    faBell,
    faCommentAlt,
    faUser,
    faChartLine,
    faClipboardCheck,
    faMapMarkerAlt,
    faShieldAlt,
    faExclamationCircle,
    faTimes,
    faAngleRight,
    faEllipsisV,
    faArrowUp,
    faArrowDown,
    faFilter,
    faSortAmountUp,
    faSyncAlt,
    faCheckCircle,
    faEye,
    faClock,
    faPaperPlane,
    faBox,
    faChevronUp,
    faChevronDown,
    faLocationDot,
    faRoute,
    faWallet,
    faExclamationTriangle,
    faHandshake,
    faTruckLoading,
    faReceipt,
    faInfoCircle,
    faTools,
    faPlus,
    faList,
    faCog,
    faDownload,
    faChartBar,
    faClipboardList,
    faFileInvoice,
    faGasPump,
    faWrench,
    faFileAlt,
    faUsers,
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

interface Vehicle {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    capacity: string;
    status: 'active' | 'maintenance';
    lastInspection: string;
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
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        // Simulating API call to fetch provider info
        setTimeout(() => {
            setProviderInfo({
                name: 'Ellis Rockefeller',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                company: 'MoreVans Logistics',
                verificationBadges: ['Verified', 'Top Rated'],
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
                        bookingsCount: 3,
                    },
                    notes: 'Contains fragile items, please handle with care.',
                    distance: 3.2,
                    duration: '25 min',
                    isHighPriority: true,
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
                        bookingsCount: 7,
                    },
                    notes: 'Office equipment, includes monitor and desktop.',
                    distance: 2.5,
                    duration: '18 min',
                    trackingUpdates: [
                        { timestamp: '2025-04-01 15:30', message: 'Booking confirmed' },
                        { timestamp: '2025-04-02 10:25', message: 'Payment received' },
                    ],
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
                        bookingsCount: 2,
                    },
                    notes: 'Entire apartment move, estimated 15 boxes.',
                    distance: 4.8,
                    duration: '35 min',
                    trackingUpdates: [
                        { timestamp: '2025-04-03 08:30', message: 'Booking confirmed' },
                        { timestamp: '2025-04-03 16:45', message: 'Payment received' },
                        { timestamp: '2025-04-12 09:15', message: 'Driver en route to pickup location' },
                        { timestamp: '2025-04-12 10:00', message: 'Loading started' },
                    ],
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
                        bookingsCount: 5,
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
                    ],
                },
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
    const filteredBookings = bookings.filter((booking) => {
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
                        onClick={() => {
                            /* Accept booking logic */
                        }}
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
                        onClick={() => {
                            /* Decline booking logic */
                        }}
                        className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Decline
                    </button>
                );
            case 'accepted':
                return (
                    <button
                        onClick={() => {
                            /* Start journey logic */
                        }}
                        className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                        Start Journey
                    </button>
                );
            case 'in_progress':
                return (
                    <button
                        onClick={() => {
                            /* Message customer logic */
                        }}
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
                {/* Enhanced Header with Logistics Focus */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white animate-pulse delay-700"></div>
                    </div>

                    <div className="p-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                {providerInfo && (
                                    <>
                                        <div className="mr-4">
                                            <img src={providerInfo.avatar} alt={providerInfo.name} className="w-16 h-16 rounded-full border-2 border-white" />
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
                                    to="/provider/fleet"
                                    className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                    Fleet Management
                                </Link>
                                <Link
                                    to="/provider/routes"
                                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faRoute} className="mr-2" />
                                    Route Planning
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Section with Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 rounded-lg p-3">
                                <FontAwesomeIcon icon={faTruck} className="text-2xl" />
                            </div>
                            <div className="text-right">
                                <span className="text-sm opacity-80">Active Vehicles</span>
                                <p className="text-2xl font-bold">{vehicles.filter((v) => v.status === 'active').length}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                            <span className="text-green-300 mr-2">↑ 12%</span>
                            <span className="opacity-80">vs last month</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add Vehicle
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faList} className="mr-2" />
                                View All
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-800 dark:to-emerald-900 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 rounded-lg p-3">
                                <FontAwesomeIcon icon={faRoute} className="text-2xl" />
                            </div>
                            <div className="text-right">
                                <span className="text-sm opacity-80">Today's Routes</span>
                                <p className="text-2xl font-bold">
                                    {
                                        bookings.filter((b) => {
                                            const today = new Date();
                                            const bookingDate = new Date(b.date);
                                            return bookingDate.toDateString() === today.toDateString();
                                        }).length
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                            <span className="text-green-300 mr-2">↑ 8%</span>
                            <span className="opacity-80">vs yesterday</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faRoute} className="mr-2" />
                                Plan Route
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                View Map
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-pink-700 dark:from-purple-800 dark:to-pink-900 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 rounded-lg p-3">
                                <FontAwesomeIcon icon={faBox} className="text-2xl" />
                            </div>
                            <div className="text-right">
                                <span className="text-sm opacity-80">Total Deliveries</span>
                                <p className="text-2xl font-bold">{bookings.filter((b) => b.status === 'completed').length}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                            <span className="text-green-300 mr-2">↑ 15%</span>
                            <span className="opacity-80">vs last week</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                                View Details
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                                Analytics
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600 to-amber-700 dark:from-yellow-800 dark:to-amber-900 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 rounded-lg p-3">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl" />
                            </div>
                            <div className="text-right">
                                <span className="text-sm opacity-80">Weekly Revenue</span>
                                <p className="text-2xl font-bold">£{bookings.reduce((sum, booking) => sum + booking.price, 0)}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                            <span className="text-green-300 mr-2">↑ 10%</span>
                            <span className="opacity-80">vs last week</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
                                Invoices
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                                Reports
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Logistics Overview */}
                    <div className="w-full lg:w-3/4 space-y-6">
                        {/* Route Optimization & Live Tracking */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Route Optimization & Live Tracking</h2>
                                <div className="flex gap-3">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faRoute} className="mr-2" />
                                        Optimize Routes
                                    </button>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                        View Map
                                    </button>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar-like Actions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Schedule</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faTruckLoading} className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Loads</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faUsers} className="text-purple-600 dark:text-purple-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Drivers</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faClipboardCheck} className="text-yellow-600 dark:text-yellow-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Checklist</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Active Deliveries */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Active Deliveries</h3>
                                    <div className="space-y-3">
                                        {bookings
                                            .filter((b) => b.status === 'in_progress')
                                            .map((booking) => (
                                                <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                                                                <FontAwesomeIcon icon={faTruck} className="text-blue-500 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800 dark:text-white">{booking.itemType}</p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {booking.pickupLocation.split(',')[0]} → {booking.dropoffLocation.split(',')[0]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{booking.time}</span>
                                                            <button
                                                                onClick={() => goToBookingDetail(booking.id)}
                                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            <span>Pickup</span>
                                                            <span>In Transit</span>
                                                            <span>Delivery</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Route Efficiency */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Route Efficiency</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Route Optimization</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Fuel Efficiency</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">88%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Time Optimization</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">95%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fleet Management */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Fleet Management</h2>
                                <div className="flex gap-3">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                        Add Vehicle
                                    </button>
                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faTools} className="mr-2" />
                                        Maintenance
                                    </button>
                                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faCog} className="mr-2" />
                                        Settings
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar-like Actions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faGasPump} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Fuel</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faWrench} className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Service</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faFileAlt} className="text-purple-600 dark:text-purple-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Documents</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-600 dark:text-yellow-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Insurance</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faTruck} className="text-blue-500 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-white">
                                                        {vehicle.make} {vehicle.model}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.registrationNumber}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    vehicle.status === 'active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : vehicle.status === 'maintenance'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
                                                <span className="ml-1 text-gray-700 dark:text-gray-300">{vehicle.capacity}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Last Inspection:</span>
                                                <span className="ml-1 text-gray-700 dark:text-gray-300">{vehicle.lastInspection}</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>Fuel Level: 85%</span>
                                                <span>Odometer: 45,678 km</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Analytics */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delivery Analytics</h2>
                                <div className="flex gap-3">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                        Export Data
                                    </button>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faFilter} className="mr-2" />
                                        Filter
                                    </button>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                        Date Range
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar-like Actions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faChartLine} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Performance</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faStar} className="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Reviews</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-purple-600 dark:text-purple-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Payments</span>
                                </button>
                                <button className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-2">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 dark:text-yellow-400 text-xl" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Issues</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Delivery Performance</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">On-Time Delivery Rate</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">98%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Customer Satisfaction</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">4.9/5</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Revenue Analytics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Daily Revenue</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">£2,450</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Monthly Growth</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">+12%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Analytics & Actions */}
                    <div className="w-full lg:w-1/4 space-y-6">
                        {/* Performance Metrics */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Performance Metrics</h2>
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                    <FontAwesomeIcon icon={faCog} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">On-Time Delivery</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">98%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Route Efficiency</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Fleet Utilization</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/provider/fleet/add"
                                        className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faTruck} className="text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <span>Add Vehicle</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/provider/routes/plan"
                                        className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faRoute} className="text-green-500 dark:text-green-400" />
                                        </div>
                                        <span>Plan Route</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/provider/maintenance"
                                        className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faTools} className="text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                        <span>Schedule Maintenance</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Alerts & Notifications */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Alerts & Notifications</h2>
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                    <FontAwesomeIcon icon={faBell} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">Vehicle Maintenance Required</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Vehicle #1234 needs immediate inspection</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faClock} className="text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">Route Delay</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Delivery #5678 is running 15 minutes behind schedule</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{unreadNotifications}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div ref={notificationsRef} className="absolute bottom-14 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
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
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You have a new booking request for delivery on April 10</p>
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
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Payment of £85 has been deposited in your account</p>
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
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Robert Brown left you a 5-star review on your recent delivery</p>
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
