import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faLocationDot,
    faTruck,
    faClock,
    faBox,
    faMoneyBillWave,
    faShieldAlt,
    faClipboardCheck,
    faClipboardList,
    faEllipsisV,
    faStar,
    faSearch,
    faFilter,
    faChevronDown,
    faChevronUp,
    faMapMarkerAlt,
    faBell,
    faFileInvoiceDollar,
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTruckLoading,
    faHistory,
    faArrowRight,
    faEye,
    faPeopleCarry,
    faHandshake,
    faUserCheck,
    faLightbulb,
    faCommentDots,
    faReceipt,
    faExternalLinkAlt,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../helper/fetcher';
import { MyBookingCard } from './UserBookings/myBookingCard';
import { Booking, Provider, Bid } from '../../types/booking';

// Enhanced mock data with more status variations and types
const mockBookings: Booking[] = [
    {
        id: 'REQ-12345',
        tracking_number: 'TRK-12345',
        created_at: '2025-04-01T10:00:00Z',
        request_type: 'instant',
        service_type: 'Residential Moving',
        status: 'confirmed',
        vehicle_type: 'van',
        persons_required: 2,
        distance: 5.2,
        estimated_travel_time: '30 minutes',
        journey_stops: [
            {
                id: 'stop-1',
                type: 'pickup',
                address: '123 Main St, Boston, MA',
                contact_name: 'John Doe',
                contact_phone: '+1234567890',
            },
            {
                id: 'stop-2',
                type: 'dropoff',
                address: '456 Pine Ave, Cambridge, MA',
                contact_name: 'John Doe',
                contact_phone: '+1234567890',
            },
        ],
        items: [
            {
                id: 'item-1',
                name: 'Furniture',
                quantity: 1,
                dimensions: '80x60x30',
                weight: 50,
                needs_disassembly: false,
                fragile: false,
            },
        ],
        date: '2025-04-15',
        time: '09:30',
        pickup_location: '123 Main St, Boston, MA',
        dropoff_location: '456 Pine Ave, Cambridge, MA',
        amount: 249.99,
        provider_name: 'Elite Movers',
        provider_rating: 4.8,
        item_size: 'medium',
        booking_date: '2025-04-01',
        has_insurance: true,
        notes: 'Please handle the piano with extra care.',
        booking_type: 'instant',
        is_paid: true,
        selected_provider: {
            id: 'prov-001',
            name: 'Michael Johnson',
            rating: 4.8,
            vehicle_type: 'van',
            profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
            phone_number: '+1234567890',
            email: 'michael@elitemovers.com',
        },
        tracking_updates: [
            { timestamp: '2025-04-01 14:22', message: 'Booking confirmed' },
            { timestamp: '2025-04-02 10:15', message: 'Provider assigned' },
        ],
    },
    {
        id: 'REQ-23456',
        tracking_number: 'TRK-23456',
        created_at: '2025-03-15T10:00:00Z',
        request_type: 'scheduled',
        service_type: 'Office Relocation',
        status: 'in_transit',
        vehicle_type: 'truck',
        persons_required: 4,
        distance: 10.5,
        estimated_travel_time: '45 minutes',
        journey_stops: [
            {
                id: 'stop-3',
                type: 'pickup',
                address: '780 Broadway, New York, NY',
                contact_name: 'Jane Smith',
                contact_phone: '+1234567890',
            },
            {
                id: 'stop-4',
                type: 'dropoff',
                address: '350 5th Ave, New York, NY',
                contact_name: 'Jane Smith',
                contact_phone: '+1234567890',
            },
        ],
        items: [
            {
                id: 'item-2',
                name: 'Office Equipment',
                quantity: 1,
                dimensions: '100x80x40',
                weight: 100,
                needs_disassembly: true,
                fragile: false,
            },
        ],
        date: '2025-04-05',
        time: '08:00',
        pickup_location: '780 Broadway, New York, NY',
        dropoff_location: '350 5th Ave, New York, NY',
        amount: 1299.99,
        provider_name: 'Corporate Moving Solutions',
        provider_rating: 4.9,
        item_size: 'large',
        booking_date: '2025-03-15',
        has_insurance: true,
        notes: 'IT equipment needs to be set up at the destination.',
        booking_type: 'standard',
        is_paid: true,
        selected_provider: {
            id: 'prov-002',
            name: 'Sarah Williams',
            rating: 4.9,
            vehicle_type: 'truck',
            profile_picture: 'https://randomuser.me/api/portraits/women/44.jpg',
            phone_number: '+44 7700 900456',
            email: 'info@cmsmoving.co.uk',
        },
        tracking_updates: [
            { timestamp: '2025-03-15 09:45', message: 'Booking confirmed' },
            { timestamp: '2025-03-20 11:30', message: 'Provider assigned' },
            { timestamp: '2025-04-05 08:15', message: 'Movers arrived at pickup location' },
            { timestamp: '2025-04-05 12:30', message: 'Loading complete, en route to destination' },
        ],
    },
    {
        id: 'REQ-34567',
        tracking_number: 'TRK-34567',
        created_at: '2025-03-01T10:00:00Z',
        request_type: 'scheduled',
        service_type: 'Piano Moving',
        status: 'completed',
        vehicle_type: 'van',
        persons_required: 3,
        distance: 3.5,
        estimated_travel_time: '20 minutes',
        journey_stops: [
            {
                id: 'stop-5',
                type: 'pickup',
                address: '555 Oak Dr, San Francisco, CA',
                contact_name: 'David Lee',
                contact_phone: '+1234567890',
            },
            {
                id: 'stop-6',
                type: 'dropoff',
                address: '888 Market St, San Francisco, CA',
                contact_name: 'David Lee',
                contact_phone: '+1234567890',
            },
        ],
        items: [
            {
                id: 'item-3',
                name: 'Grand Piano',
                quantity: 1,
                dimensions: '150x100x50',
                weight: 500,
                needs_disassembly: true,
                fragile: true,
            },
        ],
        date: '2025-03-20',
        time: '13:00',
        pickup_location: '555 Oak Dr, San Francisco, CA',
        dropoff_location: '888 Market St, San Francisco, CA',
        amount: 399.99,
        provider_name: 'Precision Piano Movers',
        provider_rating: 5.0,
        item_size: 'medium',
        booking_date: '2025-03-01',
        has_insurance: true,
        notes: 'Grand piano, needs specialized handling',
        booking_type: 'auction',
        is_paid: true,
        selected_provider: {
            id: 'prov-003',
            name: 'David Thompson',
            rating: 5.0,
            vehicle_type: 'van',
            profile_picture: 'https://randomuser.me/api/portraits/men/67.jpg',
        },
        tracking_updates: [
            { timestamp: '2025-03-01 16:22', message: 'Booking confirmed' },
            { timestamp: '2025-03-05 10:15', message: 'Provider assigned' },
            { timestamp: '2025-03-20 13:05', message: 'Movers arrived at pickup location' },
            { timestamp: '2025-03-20 15:30', message: 'Delivery completed' },
            { timestamp: '2025-03-20 15:45', message: 'Service completed successfully' },
        ],
    },
    {
        id: 'REQ-45678',
        tracking_number: 'TRK-45678',
        created_at: '2025-04-02T10:00:00Z',
        request_type: 'scheduled',
        service_type: 'Storage Services',
        status: 'bidding',
        vehicle_type: 'van',
        persons_required: 2,
        distance: 8.0,
        estimated_travel_time: '25 minutes',
        journey_stops: [
            {
                id: 'stop-7',
                type: 'pickup',
                address: '123 College Ave, Austin, TX',
                contact_name: 'Student Name',
                contact_phone: '+1234567890',
            },
            {
                id: 'stop-8',
                type: 'dropoff',
                address: 'SecureStore Facility, Austin, TX',
                contact_name: 'Student Name',
                contact_phone: '+1234567890',
            },
        ],
        items: [
            {
                id: 'item-4',
                name: 'Student Belongings',
                quantity: 1,
                dimensions: '60x40x30',
                weight: 30,
                needs_disassembly: false,
                fragile: false,
            },
        ],
        date: '2025-04-22',
        time: '10:00',
        pickup_location: '123 College Ave, Austin, TX',
        dropoff_location: 'SecureStore Facility, Austin, TX',
        amount: 89.99,
        provider_name: '',
        provider_rating: 0,
        item_size: 'small',
        booking_date: '2025-04-02',
        has_insurance: false,
        notes: 'Student belongings for summer storage',
        booking_type: 'auction',
        total_bids: 4,
        bids: [
            {
                id: 'bid-001',
                provider: {
                    id: 'prov-004',
                    name: 'SecureStore',
                    rating: 4.7,
                    vehicle_type: 'van',
                    profile_picture: 'https://randomuser.me/api/portraits/men/45.jpg',
                },
                amount: 89.99,
                created_at: '2025-04-02T12:30:00',
                status: 'pending',
                notes: 'We can handle your storage needs with secure climate-controlled units.',
            },
            {
                id: 'bid-002',
                provider: {
                    id: 'prov-005',
                    name: 'StudentBox Storage',
                    rating: 4.5,
                    vehicle_type: 'van',
                    profile_picture: 'https://randomuser.me/api/portraits/women/32.jpg',
                },
                amount: 75.5,
                created_at: '2025-04-02T14:45:00',
                status: 'pending',
                notes: 'Specialized in student storage with free pickup from campus.',
            },
        ],
        tracking_updates: [
            { timestamp: '2025-04-02 11:22', message: 'Booking request received' },
            { timestamp: '2025-04-02 15:45', message: 'Bids started coming in' },
        ],
    },
    {
        id: 'REQ-56789',
        tracking_number: 'TRK-56789',
        created_at: '2025-04-05T10:00:00Z',
        request_type: 'instant',
        service_type: 'Furniture Delivery',
        status: 'pending',
        vehicle_type: 'van',
        persons_required: 2,
        distance: 4.5,
        estimated_travel_time: '20 minutes',
        journey_stops: [
            {
                id: 'stop-9',
                type: 'pickup',
                address: 'IKEA, Brooklyn, NY',
                contact_name: 'Customer Name',
                contact_phone: '+1234567890',
            },
            {
                id: 'stop-10',
                type: 'dropoff',
                address: '123 Broadway, New York, NY',
                contact_name: 'Customer Name',
                contact_phone: '+1234567890',
            },
        ],
        items: [
            {
                id: 'item-5',
                name: 'IKEA Furniture',
                quantity: 1,
                dimensions: '120x80x40',
                weight: 40,
                needs_disassembly: true,
                fragile: false,
            },
        ],
        date: '2025-04-18',
        time: '14:00',
        pickup_location: 'IKEA, Brooklyn, NY',
        dropoff_location: '123 Broadway, New York, NY',
        amount: 129.99,
        provider_name: '',
        provider_rating: 0,
        item_size: 'medium',
        booking_date: '2025-04-05',
        has_insurance: true,
        notes: 'Assembly service requested',
        booking_type: 'instant',
        allow_instant_booking: true,
        is_paid: false,
        payment_due: '2025-04-12',
        tracking_updates: [
            { timestamp: '2025-04-05 16:30', message: 'Booking request received' },
            { timestamp: '2025-04-05 16:35', message: 'Payment pending' },
        ],
    },
];

// Update the transformation function

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('upcoming');
    const navigate = useNavigate();
    const { user } = useAuthUser() as { user: { id: string } };

    const { data: bookings1, isLoading: loading, error } = useSWR(`/requests?user_id=${user?.id}`, fetcher);
    useEffect(() => {
        if (bookings1) {
            const transformedBookings = Array.isArray(bookings1) ? bookings1 : [bookings1];
            setBookings(transformedBookings);
        }
        console.log('the bookings 1', bookings1);
    }, [bookings1]);

    // Filter bookings based on status, search query, and active tab
    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch =
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.dropoff_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.provider_name?.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        if (activeTab === 'upcoming') {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            matchesTab = bookingDate >= today && booking.status !== 'completed' && booking.status !== 'cancelled';
        } else if (activeTab === 'past') {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            matchesTab = bookingDate < today || booking.status === 'completed' || booking.status === 'cancelled';
        }

        return matchesStatus && matchesSearch && matchesTab;
    });

    // In a real app, fetch bookings from API
    // useEffect(() => {
    //     // Simulate API call
    //     const fetchBookings = async () => {
    //         try {
    //             // In a real app: const response = await api.getBookings();
    //             // setBookings(response.data);
    //             setBookings(mockBookings);
    //         } catch (error) {
    //             console.error('Error fetching bookings', error);
    //         }
    //     };

    //     fetchBookings();
    // }, []);

    const toggleBookingDetails = (bookingId: string) => {
        if (expandedBooking === bookingId) {
            setExpandedBooking(null);
        } else {
            setExpandedBooking(bookingId);
        }
    };

    // Navigates to the booking detail page

    return (
        <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header - gradient works well in both modes */}
            <div className="relative py-8 mb-8 bg-gradient-to-r from-blue-600 to-teal-500">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                    <p className="text-white text-opacity-90 mt-2">Track and manage your moving services</p>
                </div>
            </div>

            {/* Content container with responsive sizing */}
            <div className="w-full max-w-[90rem] mx-auto">
                {/* Filters and Search - Updated with dark mode */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg dark:shadow-gray-900/30 mb-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="Search bookings by ID, location, or provider"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-500 dark:text-gray-400" />
                            <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                            <select
                                className="border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Bookings</option>
                                <option value="pending">Pending</option>
                                <option value="bidding">Awaiting Bids</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timeline tabs - new feature for better organization */}
                <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                        Upcoming
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('past')}
                    >
                        <FontAwesomeIcon icon={faHistory} className="mr-2" />
                        Past
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Bookings
                    </button>
                </div>

                {/* Bookings List - Updated with dark mode */}
                <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => <MyBookingCard key={booking.id} booking={booking} expandedBooking={expandedBooking} toggleBookingDetails={toggleBookingDetails} />)
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 text-center">
                            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No bookings found</div>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters or search terms' : "You haven't made any bookings yet"}
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Create New Booking</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
