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
  faEdit
} from '@fortawesome/free-solid-svg-icons';

interface Provider {
  id: string;
  name: string;
  companyName: string;
  avatar?: string;
  rating: number;
  phone?: string;
  email?: string;
  isInstantBookProvider?: boolean;
}

interface Bid {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  estimatedTime: string;
  message?: string;
  createdAt: string;
  isSelected?: boolean;
}

interface Booking {
  id: string;
  serviceType: string;
  status: 'pending' | 'bidding' | 'confirmed' | 'in-progress' | 'completed' | 'canceled';
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  amount: number;
  providerName: string;
  providerRating: number;
  itemSize: string;
  bookingDate: string;
  hasInsurance: boolean;
  notes: string;
  allowInstantBooking?: boolean;
  bookingType?: 'instant' | 'auction' | 'standard';
  trackingUpdates?: Array<{
    timestamp: string;
    message: string;
  }>;
  selectedProvider?: Provider;
  bids?: Bid[];
  totalBids?: number;
  isPaid?: boolean;
  paymentDue?: string;
}

// Enhanced mock data with more status variations and types
const mockBookings: Booking[] = [
  {
    id: 'REQ-12345',
    serviceType: 'Residential Moving',
    status: 'confirmed',
    date: '2025-04-15',
    time: '09:30',
    pickupLocation: '123 Main St, Boston, MA',
    dropoffLocation: '456 Pine Ave, Cambridge, MA',
    amount: 249.99,
    providerName: 'Elite Movers',
    providerRating: 4.8,
    itemSize: 'medium',
    bookingDate: '2025-04-01',
    hasInsurance: true,
    notes: 'Please handle the piano with extra care.',
    bookingType: 'instant',
    isPaid: true,
    selectedProvider: {
      id: 'prov-001',
      name: 'Michael Johnson',
      companyName: 'Elite Movers',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      isInstantBookProvider: true
    },
    trackingUpdates: [
      { timestamp: '2025-04-01 14:22', message: 'Booking confirmed' },
      { timestamp: '2025-04-02 10:15', message: 'Provider assigned' },
    ]
  },
  {
    id: 'REQ-23456',
    serviceType: 'Office Relocation',
    status: 'in-progress',
    date: '2025-04-05',
    time: '08:00',
    pickupLocation: '780 Broadway, New York, NY',
    dropoffLocation: '350 5th Ave, New York, NY',
    amount: 1299.99,
    providerName: 'Corporate Moving Solutions',
    providerRating: 4.9,
    itemSize: 'large',
    bookingDate: '2025-03-15',
    hasInsurance: true,
    notes: 'IT equipment needs to be set up at the destination.',
    bookingType: 'standard',
    isPaid: true,
    selectedProvider: {
      id: 'prov-002',
      name: 'Sarah Williams',
      companyName: 'Corporate Moving Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.9,
      phone: '+44 7700 900456',
      email: 'info@cmsmoving.co.uk'
    },
    trackingUpdates: [
      { timestamp: '2025-03-15 09:45', message: 'Booking confirmed' },
      { timestamp: '2025-03-20 11:30', message: 'Provider assigned' },
      { timestamp: '2025-04-05 08:15', message: 'Movers arrived at pickup location' },
      { timestamp: '2025-04-05 12:30', message: 'Loading complete, en route to destination' },
    ]
  },
  {
    id: 'REQ-34567',
    serviceType: 'Piano Moving',
    status: 'completed',
    date: '2025-03-20',
    time: '13:00',
    pickupLocation: '555 Oak Dr, San Francisco, CA',
    dropoffLocation: '888 Market St, San Francisco, CA',
    amount: 399.99,
    providerName: 'Precision Piano Movers',
    providerRating: 5.0,
    itemSize: 'medium',
    bookingDate: '2025-03-01',
    hasInsurance: true,
    notes: 'Grand piano, needs specialized handling',
    bookingType: 'auction',
    isPaid: true,
    selectedProvider: {
      id: 'prov-003',
      name: 'David Thompson',
      companyName: 'Precision Piano Movers',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 5.0
    },
    trackingUpdates: [
      { timestamp: '2025-03-01 16:22', message: 'Booking confirmed' },
      { timestamp: '2025-03-05 10:15', message: 'Provider assigned' },
      { timestamp: '2025-03-20 13:05', message: 'Movers arrived at pickup location' },
      { timestamp: '2025-03-20 15:30', message: 'Delivery completed' },
      { timestamp: '2025-03-20 15:45', message: 'Service completed successfully' },
    ]
  },
  {
    id: 'REQ-45678',
    serviceType: 'Storage Services',
    status: 'bidding',
    date: '2025-04-22',
    time: '10:00',
    pickupLocation: '123 College Ave, Austin, TX',
    dropoffLocation: 'SecureStore Facility, Austin, TX',
    amount: 89.99,
    providerName: '',
    providerRating: 0,
    itemSize: 'small',
    bookingDate: '2025-04-02',
    hasInsurance: false,
    notes: 'Student belongings for summer storage',
    bookingType: 'auction',
    totalBids: 4,
    bids: [
      {
        id: 'bid-001',
        providerId: 'prov-004',
        providerName: 'SecureStore',
        amount: 89.99,
        estimatedTime: '2025-04-22T10:00:00',
        message: 'We can handle your storage needs with secure climate-controlled units.',
        createdAt: '2025-04-02T12:30:00'
      },
      {
        id: 'bid-002',
        providerId: 'prov-005',
        providerName: 'StudentBox Storage',
        amount: 75.50,
        estimatedTime: '2025-04-22T11:30:00',
        message: 'Specialized in student storage with free pickup from campus.',
        createdAt: '2025-04-02T14:45:00'
      }
    ],
    trackingUpdates: [
      { timestamp: '2025-04-02 11:22', message: 'Booking request received' },
      { timestamp: '2025-04-02 15:45', message: 'Bids started coming in' },
    ]
  },
  {
    id: 'REQ-56789',
    serviceType: 'Furniture Delivery',
    status: 'pending',
    date: '2025-04-18',
    time: '14:00',
    pickupLocation: 'IKEA, Brooklyn, NY',
    dropoffLocation: '123 Broadway, New York, NY',
    amount: 129.99,
    providerName: '',
    providerRating: 0,
    itemSize: 'medium',
    bookingDate: '2025-04-05',
    hasInsurance: true,
    notes: 'Assembly service requested',
    bookingType: 'instant',
    allowInstantBooking: true,
    isPaid: false,
    paymentDue: '2025-04-12',
    trackingUpdates: [
      { timestamp: '2025-04-05 16:30', message: 'Booking request received' },
      { timestamp: '2025-04-05 16:35', message: 'Payment pending' },
    ]
  }
];

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const navigate = useNavigate();

  // Filter bookings based on status, search query, and active tab
  const filteredBookings = bookings.filter(booking => {
    // Status filter
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    // Search filter
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.providerName && booking.providerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'upcoming') {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      matchesTab = bookingDate >= today && booking.status !== 'completed' && booking.status !== 'canceled';
    } else if (activeTab === 'past') {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      matchesTab = bookingDate < today || booking.status === 'completed' || booking.status === 'canceled';
    }
    
    return matchesStatus && matchesSearch && matchesTab;
  });

  // In a real app, fetch bookings from API
  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        // In a real app: const response = await api.getBookings();
        // setBookings(response.data);
        setBookings(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    };

    fetchBookings();
  }, []);

  const toggleBookingDetails = (bookingId: string) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  // Navigates to the booking detail page
  const goToBookingDetail = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };


  //Navigates to the review page 
  const goToLeaveAReview = (bookingId: string) => {
    navigate(`/bookings/${bookingId}/review`);
  }
  // Navigates to the bid selection page
  const goToBidSelection = (bookingId: string) => {
    navigate(`/bidding/${bookingId}`);
  };

  // Updated status badge classes with dark mode support
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'bidding':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get status-specific action button
  const getPrimaryActionButton = (booking: Booking) => {
    switch (booking.status) {
      case 'bidding':
        return (
          <button 
            onClick={() => goToBidSelection(booking.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            {booking.totalBids 
              ? `View ${booking.totalBids} Bids`
              : 'View Bids'}
          </button>
        );
      case 'pending':
        if (booking.allowInstantBooking) {
          return (
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-2" />
              Book Instantly
            </button>
          );
        }
        return (
          <button 
            onClick={() => goToBookingDetail(booking.id)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            View Booking
          </button>
        );
      case 'confirmed':
        return (
          <button 
            onClick={() => goToBookingDetail(booking.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            View Details
          </button>
        );
      case 'in-progress':
        return (
          <button 
            onClick={() => goToBookingDetail(booking.id)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faTruckLoading} className="mr-2" />
            Track Move
          </button>
        );
      case 'completed':
        return (
          <button 
            onClick={() => goToLeaveAReview(booking.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Leave Review
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

  // Get secondary action button based on booking status
  const getSecondaryActionButton = (booking: Booking) => {
    switch (booking.status) {
      case 'bidding':
        return (
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Request
          </button>
        );
      case 'pending':
        if (!booking.isPaid) {
          return (
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
              Complete Payment
            </button>
          );
        }
        return (
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Modify Booking
          </button>
        );
      case 'confirmed':
        return (
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Message Provider
          </button>
        );
      case 'in-progress':
        return (
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Contact Driver
          </button>
        );
      case 'completed':
        return (
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
            <FontAwesomeIcon icon={faReceipt} className="mr-2" />
            View Receipt
          </button>
        );
      default:
        return null;
    }
  };

  // Get status tag with icon
  const getStatusTag = (booking: Booking) => {
    let icon;
    let message = '';
    
    switch (booking.status) {
      case 'bidding':
        icon = faClock;
        message = booking.totalBids 
          ? `${booking.totalBids} Bids Available` 
          : 'Awaiting Bids';
        break;
      case 'pending':
        icon = faInfoCircle;
        message = booking.isPaid 
          ? 'Pending Confirmation' 
          : `Payment Due: ${booking.paymentDue}`;
        break;
      case 'confirmed':
        icon = faCheckCircle;
        message = 'Provider Confirmed';
        break;
      case 'in-progress':
        icon = faTruckLoading;
        message = 'Move in Progress';
        break;
      case 'completed':
        icon = faClipboardCheck;
        message = 'Service Completed';
        break;
      case 'canceled':
        icon = faExclamationCircle;
        message = 'Booking Canceled';
        break;
      default:
        icon = faInfoCircle;
    }
    
    return (
      <div className="flex items-center text-xs">
        <FontAwesomeIcon icon={icon} className="mr-1" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header - gradient works well in both modes */}
      <div className="relative py-8 mb-8 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            My Bookings
          </h1>
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
              activeTab === 'upcoming' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'past' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('past')}
          >
            <FontAwesomeIcon icon={faHistory} className="mr-2" />
            Past
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
        </div>

        {/* Bookings List - Updated with dark mode */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden">
                {/* Booking Header */}
                <div 
                  className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                             hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => toggleBookingDetails(booking.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 mr-3">
                          {booking.serviceType}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.bookingType === 'instant' && (
                          <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                            Instant
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">{booking.id}</span> • Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 gap-y-1 sm:gap-x-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-500 dark:text-blue-400" />
                          {booking.itemSize.charAt(0).toUpperCase() + booking.itemSize.slice(1)} Load
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500 dark:text-blue-400" />
                          ${booking.amount.toFixed(2)}
                          {!booking.isPaid && booking.status !== 'bidding' && (
                            <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-medium">
                              (Payment Required)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Status-specific information */}
                      <div className="mt-2 text-sm">
                        {getStatusTag(booking)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      {booking.status !== 'bidding' && booking.status !== 'pending' && booking.providerName && (
                        <div className="flex items-center mr-4 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                          {booking.selectedProvider?.avatar && (
                            <img 
                              src={booking.selectedProvider.avatar} 
                              alt={booking.providerName}
                              className="h-5 w-5 rounded-full mr-2 object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">{booking.providerName}</span>
                          <div className="flex items-center text-yellow-400">
                            <FontAwesomeIcon icon={faStar} className="text-xs" />
                            <span className="ml-1 text-xs text-gray-700 dark:text-gray-300">{booking.providerRating.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                      <FontAwesomeIcon 
                        icon={expandedBooking === booking.id ? faChevronUp : faChevronDown} 
                        className="text-gray-500 dark:text-gray-400" 
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Updated with dark mode and contextual information */}
                {expandedBooking === booking.id && (
                  <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-850 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Locations</h3>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm dark:shadow-gray-900/20 mb-4">
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
                        
                        {/* Provider or bid information - show different content based on status */}
                        {booking.status === 'bidding' ? (
                          <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Bid Information</h3>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                                  You have received {booking.totalBids} bids for this service.
                                </p>
                              </div>
                              
                              {booking.bids && booking.bids.length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Latest Bids:</h4>
                                  {booking.bids.slice(0, 2).map((bid, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-750 p-2 rounded border border-gray-100 dark:border-gray-700">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">{bid.providerName}</span>
                                        <span className="text-sm font-bold">${bid.amount.toFixed(2)}</span>
                                      </div>
                                      {bid.message && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{bid.message}</p>
                                      )}
                                    </div>
                                  ))}
                                  <div className="text-center mt-4">
                                    <button 
                                      onClick={() => goToBidSelection(booking.id)}
                                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                                    >
                                      View and compare all bids
                                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Service Details</h3>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Service Provider</p>
                                  <p className="text-sm font-medium">{booking.providerName || 'Not assigned yet'}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Insurance</p>
                                  <p className="text-sm font-medium">
                                    {booking.hasInsurance ? (
                                      <span className="text-green-600 dark:text-green-400 flex items-center">
                                        <FontAwesomeIcon icon={faShieldAlt} className="mr-1" /> Protected
                                      </span>
                                    ) : 'No insurance'}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Moving Date</p>
                                  <p className="text-sm font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                  <p className="text-sm font-medium">{booking.time}</p>
                                </div>
                                
                                {booking.status === 'pending' && !booking.isPaid && (
                                  <div className="col-span-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800/30">
                                    <p className="text-sm text-red-700 dark:text-red-400 flex items-center">
                                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                      Payment required by {booking.paymentDue} to confirm this booking.
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              {booking.notes && (
                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
                                  <p className="text-sm mt-1">{booking.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Tracking Updates</h3>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm dark:shadow-gray-900/20">
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">No tracking updates available</p>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Actions</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            {getPrimaryActionButton(booking)}
                            {getSecondaryActionButton(booking)}
                            
                            {booking.status === 'pending' && (
                              <button className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-750 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No bookings found</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || filterStatus !== 'all' ? 
                  'Try adjusting your filters or search terms' : 
                  'You haven\'t made any bookings yet'
                }
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Create New Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;