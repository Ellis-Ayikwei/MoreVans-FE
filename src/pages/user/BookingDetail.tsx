import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faBox, faCalendar, faCheckCircle, faChevronDown, 
  faChevronRight, faClock, faComment, faDollarSign, faExclamationTriangle, 
  faFileAlt, faInfoCircle, faLocationDot, faMoneyBill, faPhone, faStar, 
  faTruckMoving, faUser, faEdit, faBan, faEye, faCamera, faShieldAlt,
  faTimes, faMapMarkerAlt, faBoxOpen, faQuestionCircle, faPrint,
  faCheck,
  faEnvelope,
  faGavel
} from '@fortawesome/free-solid-svg-icons';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

// Types
interface ItemDetail {
  name: string;
  quantity: number;
  dimensions: string;
  weight: string;
  photos?: string[];
  specialInstructions?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
}

interface Provider {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verifiedProvider: boolean;
}

interface BookingMilestone {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  datetime?: string;
  description?: string;
}

interface PaymentDetail {
  id: string;
  type: 'deposit' | 'final' | 'additional';
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'refunded';
  date?: string;
  dueDate?: string;
  paymentMethod?: string;
  receiptUrl?: string;
}

interface Message {
  id: string;
  sender: 'customer' | 'provider' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: {
    url: string;
    name: string;
    type: string;
  }[];
}

interface Bidder {
  id: string;
  name: string;
  companyName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verifiedProvider: boolean;
}

interface Bid {
  id: string;
  bidder: Bidder;
  amount: number;
  currency: string;
  estimatedTime: string;
  message?: string;
  createdAt: string;
  expires?: string;
  isInstantBook?: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: 'pending' | 'bidding' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  
  // Locations
  pickupAddress: Address;
  deliveryAddress: Address;
  distance: number;
  
  // Timing
  pickupDate: string;
  pickupWindow: string;
  estimatedTravelTime: string;
  deliveryDate: string;
  deliveryWindow: string;
  
  // Items
  itemDetails: ItemDetail[];
  totalVolume: string;
  personsRequired: string;
  vehicleType: string;
  
  // Provider
  provider?: Provider;
  
  // Customer
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  
  // Other details
  specialInstructions?: string;
  milestones: BookingMilestone[];
  
  // Financial
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
  payments: PaymentDetail[];
  
  // Communication
  messages: Message[];

  // Bids
  bids?: Bid[];
  totalBids?: number;
}

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    items: true,
    timeline: true,
    payments: true,
    messages: true,
    bids: true
  });
  const [activeTab, setActiveTab] = useState<'details' | 'messages'>('details');
  const [userRole, setUserRole] = useState<'customer' | 'provider'>('customer');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Determine user role (in a real app, this would come from auth context)
    // For demo, let's add a URL param ?role=provider to test provider view
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'provider') {
      setUserRole('provider');
    }
    
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Conditional mock data based on a query parameter for testing
      const params = new URLSearchParams(window.location.search);
      let mockStatus = params.get('request_type') || 'bidding';

      // Validate the status
      if (!['pending', 'bidding', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(mockStatus)) {
        mockStatus = 'confirmed';
      }

      const mockBooking: Booking = {
        id: "BK-12345",
        bookingNumber: "MV-89735462",
        status: mockStatus as any,
        createdAt: "2025-03-15T10:30:00Z",
        
        // Add mock bids data when status is 'bidding'
        ...(mockStatus === 'bidding' ? {
          totalBids: 4,
          bids: [
            {
              id: 'bid-001',
              bidder: {
                id: 'prov-001',
                name: 'Michael Johnson',
                companyName: 'Express Movers Ltd',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                rating: 4.8,
                reviewCount: 176,
                verifiedProvider: true
              },
              amount: 380,
              currency: 'GBP',
              estimatedTime: '2025-04-10T17:00:00Z',
              message: 'We can offer a premium service with 2 experienced movers and all necessary packing materials included. We\'re available on your preferred date.',
              createdAt: '2025-03-16T11:20:00Z',
              expires: '2025-03-23T11:20:00Z',
              status: 'pending'
            },
            {
              id: 'bid-002',
              bidder: {
                id: 'prov-002',
                name: 'Sarah Williams',
                companyName: 'Swift Relocations',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                rating: 4.6,
                reviewCount: 89,
                verifiedProvider: true
              },
              amount: 320,
              currency: 'GBP',
              estimatedTime: '2025-04-10T18:30:00Z',
              message: 'We can provide a cost-effective service with 2 movers. We have availability on your preferred date.',
              createdAt: '2025-03-17T09:15:00Z',
              expires: '2025-03-24T09:15:00Z',
              status: 'pending'
            },
            {
              id: 'bid-003',
              bidder: {
                id: 'prov-003',
                name: 'David Thompson',
                companyName: 'Premier Movers',
                avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                rating: 5.0,
                reviewCount: 42,
                verifiedProvider: true
              },
              amount: 450,
              currency: 'GBP',
              estimatedTime: '2025-04-10T16:00:00Z',
              isInstantBook: true,
              message: 'Our premium service includes 3 skilled movers, comprehensive insurance, full packing service, and extra protection for fragile items.',
              createdAt: '2025-03-16T15:45:00Z',
              expires: '2025-03-23T15:45:00Z',
              status: 'pending'
            }
          ]
        } : {}),

        // Locations
        pickupAddress: {
          street: "123 Main Street",
          city: "Manchester",
          state: "Greater Manchester",
          zipCode: "M1 2WD",
          additionalInfo: "Ring the doorbell at entrance, 3rd floor"
        },
        deliveryAddress: {
          street: "456 Park Avenue",
          city: "London",
          state: "Greater London",
          zipCode: "W1T 7HF",
          additionalInfo: "Building has elevator access"
        },
        distance: 257,
        
        // Timing
        pickupDate: "2025-04-10",
        pickupWindow: "12:00 PM - 3:00 PM",
        estimatedTravelTime: "4 hours 30 minutes",
        deliveryDate: "2025-04-10",
        deliveryWindow: "6:00 PM - 9:00 PM",
        
        // Items
        itemDetails: [
          { name: "Sofa (3-seater)", quantity: 1, dimensions: "220 × 90 × 80 cm", weight: "45 kg", photos: ["https://via.placeholder.com/150"] },
          { name: "Dining Table", quantity: 1, dimensions: "180 × 90 × 75 cm", weight: "30 kg" },
          { name: "Dining Chairs", quantity: 6, dimensions: "45 × 50 × 90 cm", weight: "5 kg each" },
          { name: "Bedroom Wardrobe", quantity: 1, dimensions: "150 × 58 × 200 cm", weight: "65 kg", specialInstructions: "Needs to be disassembled" },
          { name: "Queen-size Bed", quantity: 1, dimensions: "160 × 200 × 40 cm", weight: "50 kg" },
          { name: "Boxes (small)", quantity: 10, dimensions: "40 × 40 × 40 cm", weight: "5-10 kg each" },
          { name: "Boxes (medium)", quantity: 8, dimensions: "60 × 60 × 60 cm", weight: "10-15 kg each" },
          { name: "Television (50-inch)", quantity: 1, dimensions: "112 × 10 × 65 cm", weight: "15 kg", specialInstructions: "Fragile" }
        ],
        totalVolume: "22.5 cubic meters",
        personsRequired: "2 people",
        vehicleType: "Large Van (3.5t Luton)",
        
        // Provider
        provider: {
          id: "PRV-789",
          name: "Michael Johnson",
          companyName: "Express Movers Ltd",
          phone: "+44 7700 900123",
          email: "contact@expressmovers.co.uk",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          rating: 4.8,
          reviewCount: 176,
          verifiedProvider: true
        },
        
        // Customer
        customerName: "Emma Wilson",
        customerPhone: "+44 7700 900456",
        customerEmail: "emma.wilson@example.com",
        
        // Other details
        specialInstructions: "Please handle the TV with extra care. The wardrobe needs to be disassembled before moving. Both buildings have elevators, but please bring furniture protection blankets for the walls just in case.",
        milestones: [
          { id: "m1", title: "Booking Created", status: "completed", datetime: "2025-03-15T10:30:00Z", description: "Booking was created and confirmed" },
          { id: "m2", title: "Driver Assigned", status: "completed", datetime: "2025-03-16T14:22:00Z", description: "Professional mover assigned to your booking" },
          { id: "m3", title: "Pickup", status: "upcoming", datetime: "2025-04-10T12:00:00Z", description: "Items will be collected from origin" },
          { id: "m4", title: "In Transit", status: "upcoming", description: "Your items are being transported" },
          { id: "m5", title: "Delivery", status: "upcoming", datetime: "2025-04-10T18:00:00Z", description: "Items will be delivered to destination" },
          { id: "m6", title: "Completed", status: "upcoming", description: "Booking completed successfully" }
        ],
        
        // Financial
        subtotal: 375.00,
        taxes: 75.00,
        fees: 25.00,
        total: 475.00,
        currency: "GBP",
        payments: [
          { id: "pay1", type: "deposit", amount: 95.00, currency: "GBP", status: "paid", date: "2025-03-15T10:45:00Z", paymentMethod: "Credit Card (Visa **** 1234)", receiptUrl: "#" },
          { id: "pay2", type: "final", amount: 380.00, currency: "GBP", status: "pending", dueDate: "2025-04-10T12:00:00Z" }
        ],
        
        // Communication
        messages: [
          { id: "msg1", sender: "system", senderName: "MoreVans System", content: "Your booking has been confirmed. Your confirmation number is MV-89735462.", timestamp: "2025-03-15T10:35:00Z" },
          { id: "msg2", sender: "provider", senderName: "Michael Johnson", content: "Hello! I'm Michael and I'll be handling your move. Do you have any specific requirements I should know about?", timestamp: "2025-03-16T15:10:00Z" },
          { id: "msg3", sender: "customer", senderName: "Emma Wilson", content: "Hi Michael, thanks for reaching out! Yes, the TV is quite new and expensive, so extra padding would be appreciated.", timestamp: "2025-03-16T15:45:00Z" },
          { id: "msg4", sender: "provider", senderName: "Michael Johnson", content: "No problem at all. We'll bring extra protective materials for the TV. Looking forward to helping with your move!", timestamp: "2025-03-16T16:20:00Z", attachments: [{ url: "https://via.placeholder.com/150", name: "packing_guide.pdf", type: "application/pdf" }] }
        ]
      };

      setBooking(mockBooking);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details. Please try again.');
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !booking) return;
    
    // Generate a new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: userRole,
      senderName: userRole === 'customer' ? booking.customerName : (booking.provider?.name || 'Provider'),
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Update state with the new message
    setBooking({
      ...booking,
      messages: [...booking.messages, newMsg]
    });
    
    // Clear the input field
    setNewMessage('');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = () => {
    if (!booking) return null;
    
    if (userRole === 'customer') {
      switch (booking.status) {
        case 'bidding':
          return (
            <>
              <button 
                onClick={() => navigate(`/account/bids/${booking.id}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View & Compare Bids
              </button>
              <button 
                onClick={() => navigate(`/edit-request/${booking.id}`, { state: { bookingData: booking } })}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Request
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faBan} className="mr-2" />
                Cancel Request
              </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Contact Customer
            </button>
            </>
          );
        case 'pending':
          return (
            <>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2">
                Confirm Booking
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
            </>
          );
        case 'confirmed':
          return (
            <>
              <button 
                onClick={() => navigate(`/edit-request/${booking.id}`, { state: { bookingData: booking } })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Modify Details
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faBan} className="mr-2" />
                Cancel Booking
              </button>
            </>
          );
        case 'in_progress':
          return (
            <>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Contact Driver
              </button>
            </>
          );
        case 'completed':
          return (
            <>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Leave Review
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                View Receipt
              </button>
              <Link to={`/disputes?bookingId=${booking.id}`} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faGavel} className="mr-2" />
                Raise Dispute
              </Link>
            </>
          );
        default:
          return null;
      }
    } else {
      // Provider actions
      switch (booking.status) {
        case 'bidding':
          return (
            <>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Submit Bid
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View Job Details
              </button>
            </>
          );
        case 'confirmed':
          return (
            <>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Complete Job
              </button>
            </>
          );
        case 'in_progress':
          return (
            <>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faCamera} className="mr-2" />
                Upload Photos
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Complete Job
              </button>
            </>
          );
        case 'completed':
          return (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              View Job Summary
            </button>
          );
        default:
          return null;
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'p');
    } catch (e) {
      return '';
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPp');
    } catch (e) {
      return dateString;
    }
  };
  
  const getRelativeTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full p-4 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
            <p>{error || 'Booking not found'}</p>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-red-700 hover:text-red-900 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile tabs */}
        <div className="md:hidden mb-4">
          <div className="flex rounded-lg bg-white shadow overflow-hidden">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'details' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'messages' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {booking.messages.length}
              </span>
            </button>
          </div>
        </div>

        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to={userRole === 'customer' ? "/account/bookings" : "/provider/jobs"} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            {userRole === 'customer' ? 'Back to My Bookings' : 'Back to Job Board'}
          </Link>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column - booking details */}
          <div className={`lg:col-span-2 space-y-6 ${activeTab !== 'details' && 'hidden md:block'}`}>
            {/* Booking header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.bookingNumber}</h1>
                    <p className="text-gray-500 mt-1">Created on {formatDateTime(booking.createdAt)}</p>
                  </div>
                  <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                  </div>
                </div>
                
                {/* Status actions */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {getStatusActions()}
                </div>
              </div>
            </div>

            {/* Booking summary */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Move Summary</h2>
                  <button onClick={() => toggleSection('details')} className="text-gray-500">
                    <FontAwesomeIcon icon={expandedSections.details ? faChevronDown : faChevronRight} />
                  </button>
                </div>
                
                {expandedSections.details && (
                  <div className="space-y-6">
                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start mb-2">
                          <FontAwesomeIcon icon={faLocationDot} className="text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-gray-900">Pickup Location</h3>
                            <p className="text-gray-700 text-sm">
                              {booking.pickupAddress.street}, {booking.pickupAddress.city}, {booking.pickupAddress.state}, {booking.pickupAddress.zipCode}
                            </p>
                            {booking.pickupAddress.additionalInfo && (
                              <p className="text-gray-600 text-xs mt-1 italic">
                                Note: {booking.pickupAddress.additionalInfo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 mt-1">
                          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                          {booking.pickupDate}, {booking.pickupWindow}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start mb-2">
                          <FontAwesomeIcon icon={faLocationDot} className="text-green-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-gray-900">Delivery Location</h3>
                            <p className="text-gray-700 text-sm">
                              {booking.deliveryAddress.street}, {booking.deliveryAddress.city}, {booking.deliveryAddress.state}, {booking.deliveryAddress.zipCode}
                            </p>
                            {booking.deliveryAddress.additionalInfo && (
                              <p className="text-gray-600 text-xs mt-1 italic">
                                Note: {booking.deliveryAddress.additionalInfo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 mt-1">
                          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                          {booking.deliveryDate}, {booking.deliveryWindow}
                        </div>
                      </div>
                    </div>
                    
                    {/* Journey details */}
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-50 p-3 rounded-md flex items-center">
                        <FontAwesomeIcon icon={faTruckMoving} className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-xs text-gray-500">Vehicle Type</div>
                          <div className="text-sm font-medium">{booking.vehicleType}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md flex items-center">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-xs text-gray-500">Staff Required</div>
                          <div className="text-sm font-medium">{booking.personsRequired}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-xs text-gray-500">Distance</div>
                          <div className="text-sm font-medium">{booking.distance} miles</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-xs text-gray-500">Est. Travel Time</div>
                          <div className="text-sm font-medium">{booking.estimatedTravelTime}</div>
                        </div>
                      </div>
                    </div>
                    
                    {booking.specialInstructions && (
                      <div className="bg-yellow-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-900 flex items-center mb-2">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-600 mr-2" />
                          Special Instructions
                        </h3>
                        <p className="text-sm text-gray-700">{booking.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Item details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Items to Move</h2>
                  <button onClick={() => toggleSection('items')} className="text-gray-500">
                    <FontAwesomeIcon icon={expandedSections.items ? faChevronDown : faChevronRight} />
                  </button>
                </div>
                
                {expandedSections.items && (
                  <div>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qty
                            </th>
                            <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dimensions
                            </th>
                            <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Weight
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {booking.itemDetails.map((item, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faBox} className="text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <span className="text-sm text-gray-700">{item.quantity}</span>
                              </td>
                              <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-700">{item.dimensions}</span>
                              </td>
                              <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-700">{item.weight}</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex justify-center space-x-2">
                                  {item.specialInstructions && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                      Special
                                    </span>
                                  )}
                                  {item.photos && item.photos.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      <FontAwesomeIcon icon={faCamera} className="mr-1" />
                                      Photos
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-4 rounded-md flex flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Total Volume</span>
                        <div className="text-sm font-medium">{booking.totalVolume}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Total Items</span>
                        <div className="text-sm font-medium">
                          {booking.itemDetails.reduce((acc, item) => acc + item.quantity, 0)} items
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            
            

{/* Move timeline */}
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Move Timeline</h2>
      <button onClick={() => toggleSection('timeline')} className="text-gray-500">
        <FontAwesomeIcon icon={expandedSections.timeline ? faChevronDown : faChevronRight} />
      </button>
    </div>
    
    {expandedSections.timeline && (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Milestone items */}
        <div className="space-y-6 ml-9">
          {booking.milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {/* Timeline circle */}
              <div className={`absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 ${
                milestone.status === 'completed'
                  ? 'bg-green-500 border-green-500'
                  : milestone.status === 'current'
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
              }`}>
                {milestone.status === 'completed' && (
                  <FontAwesomeIcon icon={faCheck} className="text-white text-xs absolute inset-0 m-auto" />
                )}
              </div>
              
              <div>
                <h3 className={`text-base font-medium ${
                  milestone.status === 'current' ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {milestone.title}
                </h3>
                {milestone.datetime && (
                  <p className="text-xs text-gray-500">{formatDateTime(milestone.datetime)}</p>
                )}
                {milestone.description && (
                  <p className="text-sm text-gray-700 mt-1">{milestone.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
            

{/* Payment details */}
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
      <button onClick={() => toggleSection('payments')} className="text-gray-500">
        <FontAwesomeIcon icon={expandedSections.payments ? faChevronDown : faChevronRight} />
      </button>
    </div>
    
    {expandedSections.payments && (
      <div>
        {/* Payment summary */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-medium">{booking.currency} {booking.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taxes & Fees</p>
              <p className="text-lg font-medium">{booking.currency} {(booking.taxes + booking.fees).toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-xl font-bold text-gray-900">{booking.currency} {booking.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment transactions */}
        <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Transactions</h3>
        <div className="space-y-3">
          {booking.payments.map(payment => (
            <div key={payment.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.date 
                      ? `Paid on ${formatDate(payment.date)}` 
                      : payment.dueDate 
                        ? `Due on ${formatDate(payment.dueDate)}` 
                        : ''
                    }
                  </p>
                  {payment.paymentMethod && (
                    <p className="text-xs text-gray-500 mt-1">{payment.paymentMethod}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base font-medium">{payment.currency} {payment.amount.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Payment actions */}
              {payment.status === 'pending' && userRole === 'customer' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md">
                    <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                    Pay Now
                  </button>
                </div>
              )}
              
              {payment.status === 'paid' && payment.receiptUrl && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <a 
                    href={payment.receiptUrl} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="mr-1" />
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

{/* Quick Actions Sidebar */}
<div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'details' && 'hidden md:block'}`}>
  <div className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div className="space-y-2">
      <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center">
        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gray-500" />
        View Booking Details
      </button>
      <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center">
        <FontAwesomeIcon icon={faPrint} className="mr-2 text-gray-500" />
        Print Booking Summary
      </button>
      <Link 
        to={`/disputes?bookingId=${booking.id}`} 
        className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faGavel} className="mr-2 text-gray-500" />
        Raise or View Disputes
      </Link>
      <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center">
        <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
        Contact Support
      </button>
    </div>
  </div>
</div>
          </div>
          
          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Provider/Customer info */}
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'details' && 'hidden md:block'}`}>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {userRole === 'customer' ? 'Your Provider' : 'Customer Information'}
                </h2>
                
                {userRole === 'customer' && booking.provider ? (
                  <div className="flex items-start">
                    <img 
                      src={booking.provider.avatar || 'https://via.placeholder.com/60'} 
                      alt={booking.provider.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{booking.provider.name}</h3>
                        {booking.provider.verifiedProvider && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                            <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{booking.provider.companyName}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon 
                              key={i}
                              icon={faStar} 
                              className={i < Math.floor(booking.provider.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 text-sm">
                          {booking.provider.rating} ({booking.provider.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <a href={`tel:${booking.provider.phone}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                          <FontAwesomeIcon icon={faPhone} className="mr-2" />
                          {booking.provider.phone}
                        </a>
                        <a href={`mailto:${booking.provider.email}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                          {booking.provider.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : userRole === 'provider' ? (
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.customerName}</h3>
                    <div className="mt-3 space-y-2">
                      <a href={`tel:${booking.customerPhone}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        {booking.customerPhone}
                      </a>
                      <a href={`mailto:${booking.customerEmail}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        {booking.customerEmail}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Provider information not available yet.</p>
                )}
                
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    <FontAwesomeIcon icon={faComment} className="mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bid summary for sidebar - only shown for bidding status */}
            {booking.status === 'bidding' && (
              <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'details' && 'hidden md:block'}`}>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Current Bids
                  </h2>
                  
                  {booking.bids && booking.bids.length > 0 ? (
                    <div>
                      <div className="space-y-3 mb-4">
                        {booking.bids.slice(0, 2).map(bid => (
                          <div key={bid.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center">
                              <img 
                                src={bid.bidder.avatar || 'https://via.placeholder.com/40'} 
                                alt={bid.bidder.name}
                                className="w-8 h-8 rounded-full object-cover mr-2"
                              />
                              <div>
                                <p className="text-sm font-medium">{bid.bidder.companyName}</p>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <FontAwesomeIcon 
                                        key={i}
                                        icon={faStar} 
                                        className={i < Math.floor(bid.bidder.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                                        size="xs"
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-1 text-xs text-gray-500">{bid.bidder.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{bid.currency} {bid.amount.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {booking.totalBids && booking.totalBids > 2 && (
                        <p className="text-sm text-center text-gray-500 mb-4">
                          +{booking.totalBids - 2} more bids
                        </p>
                      )}
                      
                      <button 
                        onClick={() => navigate(`/account/bids/${booking.id}`)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                      >
                        Compare All Bids
                      </button>
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-purple-700">
                        Waiting for providers to submit bids
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Quick actions */}
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'details' && 'hidden md:block'}`}>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gray-500" />
                    View Booking Details
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center">
                    <FontAwesomeIcon icon={faPrint} className="mr-2 text-gray-500" />
                    Print Booking Summary
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
            
            {/* Message section - always visible on mobile when messages tab is active */}
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'messages' && 'hidden md:block'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                  <button onClick={() => toggleSection('messages')} className="text-gray-500 hidden md:block">
                    <FontAwesomeIcon icon={expandedSections.messages ? faChevronDown : faChevronRight} />
                  </button>
                </div>
                
                {(expandedSections.messages || activeTab === 'messages') && (
                  <div>
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                      {booking.messages.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <FontAwesomeIcon icon={faComment} className="text-gray-400 text-lg" />
                          </div>
                          <p className="text-gray-500 text-sm">No messages yet</p>
                        </div>
                      ) : (
                        booking.messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`p-3 rounded-lg ${
                              message.sender === 'system' 
                                ? 'bg-gray-100 border border-gray-200' 
                                : message.sender === userRole
                                  ? 'bg-blue-100 ml-6' 
                                  : 'bg-gray-100 mr-6'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-xs">
                                {message.senderName} {message.sender === 'system' && '(System)'}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {getRelativeTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.attachments.map((attachment, i) => (
                                  <a 
                                    key={i}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 bg-white rounded border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                                  >
                                    <FontAwesomeIcon 
                                      icon={attachment.type.includes('image') ? faEye : faFileAlt} 
                                      className="mr-1" 
                                    />
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="mt-4">
                      <div className="flex">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
            // Fix for Need Help section and Messages

{/* Need help section */}
<div className={`bg-yellow-50 rounded-lg shadow-sm overflow-hidden border border-yellow-200 ${activeTab !== 'details' && 'hidden md:block'}`}>
  <div className="p-6">
    <h2 className="text-lg font-semibold text-yellow-800 flex items-center mb-2">
      <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
      Need Help?
    </h2>
    <p className="text-sm text-yellow-800 mb-4">
      Our support team is available 24/7 to assist with any questions about your booking.
    </p>
    <div className="space-y-2">
      <a href="tel:+448001234567" className="block bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-center">
        Call Support
      </a>
      <a href="/help-center" className="block bg-transparent hover:bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-center">
        Visit Help Center
      </a>
    </div>
  </div>
</div>

{/* Message section - always visible on mobile when messages tab is active */}
<div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'messages' && 'hidden md:block'}`}>
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      <button onClick={() => toggleSection('messages')} className="text-gray-500 hidden md:block">
        <FontAwesomeIcon icon={expandedSections.messages ? faChevronDown : faChevronRight} />
      </button>
    </div>
    
    {(expandedSections.messages || activeTab === 'messages') && (
      <div>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {booking.messages.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faComment} className="text-gray-400 text-lg" />
              </div>
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          ) : (
            booking.messages.map(message => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.sender === 'system'
                    ? 'bg-gray-100 border border-gray-200'
                    : message.sender === userRole
                      ? 'bg-blue-100 ml-6'
                      : 'bg-gray-100 mr-6'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-xs">
                    {message.senderName} {message.sender === 'system' && '(System)'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {getRelativeTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{message.content}</p>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.attachments.map((attachment, i) => (
                      <a
                        key={i}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-white rounded border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <FontAwesomeIcon 
                          icon={attachment.type.includes('image') ? faEye : faFileAlt} 
                          className="mr-1" 
                        />
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="mt-4">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;