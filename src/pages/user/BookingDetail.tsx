import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faBox,
    faCalendar,
    faCheckCircle,
    faChevronDown,
    faChevronRight,
    faClock,
    faComment,
    faDollarSign,
    faExclamationTriangle,
    faFileAlt,
    faInfoCircle,
    faLocationDot,
    faMoneyBill,
    faPhone,
    faStar,
    faTruckMoving,
    faUser,
    faEdit,
    faBan,
    faEye,
    faCamera,
    faShieldAlt,
    faTimes,
    faMapMarkerAlt,
    faBoxOpen,
    faQuestionCircle,
    faPrint,
    faCheck,
    faEnvelope,
    faGavel,
    faRoute,
    faCar,
    faBuilding,
    faDoorOpen,
    faStairs,
    faElevator,
    faHome,
    faTools,
    faTruck,
    faExternalLinkAlt,
    faComments,
    faBell,
    faCloudDownloadAlt,
    faClipboardList,
    faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSWR from 'swr';
import fetcher from '../../helper/fetcher';
import ProviderModal from '../../components/Provider/ProviderPopup';

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
    profileImage?: string;
    rating: number;
    reviewCount: number;
    verifiedProvider: boolean;
    verified: boolean;
    vehicleType: string;
    capacity: string;
    serviceRadius: number;
    reviews: any[];
}

interface BookingMilestone {
    id: string;
    milestone_type: string;
    status: 'completed' | 'current' | 'upcoming';
    scheduled_start?: string;
    actual_start?: string;
    actual_end?: string;
    notes?: string;
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
    tracking_number: string;
    status: 'draft' | 'bidding' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    request_type: string;
    service_type: string;
    vehicle_type: string;
    persons_required: number;
    estimated_travel_time: string;
    items: {
        id: string;
        name: string;
        quantity: number;
        dimensions?: string;
        weight?: string;
        photos?: string[];
        special_instructions?: string;
        needs_disassembly?: boolean;
        fragile?: boolean;
    }[];
    all_locations: {
        address: string;
        type: string;
        items_count: number;
        instructions: string;
    }[];

    // Locations
    pickupAddress: Address;
    deliveryAddress: Address;
    distance: number;

    // Timing
    pickupDate: string;
    pickupWindow: string;
    deliveryDate: string;
    deliveryWindow: string;

    // Items
    itemDetails: ItemDetail[];
    totalVolume: string;

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

    // Stops
    stops: {
        type: 'pickup' | 'dropoff' | 'waypoint';
        address: string;
        property_type?: string;
        unit_number?: string;
        floor?: string;
        has_elevator?: boolean;
        parking_info?: string;
        number_of_rooms?: string;
        instructions?: string;
    }[];
    estimated_distance?: string;
    special_instructions?: string;
}

interface AuthUser {
    user: {
        id: string;
        user_type: string;
    };
}

const BookingDetail: React.FC = () => {
    const auth = useAuthUser<AuthUser>();
    const user = auth?.user;
    console.log('user', user);
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
        bids: true,
    });
    const [activeTab, setActiveTab] = useState<'details' | 'messages' | 'tracking' | 'documents'>('details');
    const [userRole, setUserRole] = useState<'customer' | 'provider'>('customer');
    const [showProviderModal, setShowProviderModal] = useState(false);

    // Add default values for potentially undefined properties
    const getBookingPrice = (booking: Booking | null) => {
        return booking?.total || 0;
    };

    const getBookingDate = (booking: Booking | null) => {
        return booking?.created_at ? new Date(booking.created_at) : new Date();
    };

    const getProviderRating = (provider: Provider | undefined) => {
        return provider?.rating || 0;
    };

    // Add status color definitions
    const getStatusColors = (status: string) => {
        switch (status) {
            case 'draft':
                return {
                    statusColor: 'gray',
                    statusColorDark: 'gray',
                    statusTextColor: 'gray-800',
                    statusTextColorDark: 'gray-300',
                    statusBgColor: 'gray-100',
                    statusBgColorDark: 'gray-800',
                };
            case 'bidding':
                return {
                    statusColor: 'yellow',
                    statusColorDark: 'yellow',
                    statusTextColor: 'yellow-800',
                    statusTextColorDark: 'yellow-300',
                    statusBgColor: 'yellow-100',
                    statusBgColorDark: 'yellow-900',
                };
            case 'confirmed':
                return {
                    statusColor: 'blue',
                    statusColorDark: 'blue',
                    statusTextColor: 'blue-800',
                    statusTextColorDark: 'blue-300',
                    statusBgColor: 'blue-100',
                    statusBgColorDark: 'blue-900',
                };
            case 'in_progress':
                return {
                    statusColor: 'purple',
                    statusColorDark: 'purple',
                    statusTextColor: 'purple-800',
                    statusTextColorDark: 'purple-300',
                    statusBgColor: 'purple-100',
                    statusBgColorDark: 'purple-900',
                };
            case 'completed':
                return {
                    statusColor: 'green',
                    statusColorDark: 'green',
                    statusTextColor: 'green-800',
                    statusTextColorDark: 'green-300',
                    statusBgColor: 'green-100',
                    statusBgColorDark: 'green-900',
                };
            case 'cancelled':
                return {
                    statusColor: 'red',
                    statusColorDark: 'red',
                    statusTextColor: 'red-800',
                    statusTextColorDark: 'red-300',
                    statusBgColor: 'red-100',
                    statusBgColorDark: 'red-900',
                };
            default:
                return {
                    statusColor: 'gray',
                    statusColorDark: 'gray',
                    statusTextColor: 'gray-800',
                    statusTextColorDark: 'gray-300',
                    statusBgColor: 'gray-100',
                    statusBgColorDark: 'gray-800',
                };
        }
    };

    // Get current status colors
    const statusColors = booking ? getStatusColors(booking.status) : getStatusColors('draft');
    const { statusColor, statusColorDark, statusTextColor, statusTextColorDark, statusBgColor, statusBgColorDark } = statusColors;

    const { data: bookingData, isLoading: bookkingLoading } = useSWR(`/requests/${id}/?user_id=${user?.id}`, fetcher);

    useEffect(() => {
        if (bookingData) {
            console.log('booking data', bookingData);
        }
    }, [bookingData]);
    const navigate = useNavigate();

    useEffect(() => {
        if (bookingData) {
            setBooking(bookingData);
        }
    }, [bookingData]);

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
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Conditional mock data based on a query parameter for testing
            const params = new URLSearchParams(window.location.search);
            let mockStatus = params.get('request_type') || 'bidding';

            // Validate the status
            if (!['pending', 'bidding', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(mockStatus)) {
                mockStatus = 'confirmed';
            }

            const mockBooking: Booking = {
                id: 'BK-12345',
                tracking_number: 'MV-89735462',
                status: mockStatus as any,
                created_at: '2025-03-15T10:30:00Z',
                request_type: 'Residential Moving',
                service_type: 'Large Van (3.5t Luton)',
                vehicle_type: 'Large Van (3.5t Luton)',
                persons_required: 2,
                estimated_travel_time: '4 hours 30 minutes',
                items: [
                    { id: 'item-001', name: 'Sofa (3-seater)', quantity: 1 },
                    { id: 'item-002', name: 'Dining Table', quantity: 1 },
                    { id: 'item-003', name: 'Dining Chairs', quantity: 6 },
                    { id: 'item-004', name: 'Bedroom Wardrobe', quantity: 1 },
                    { id: 'item-005', name: 'Queen-size Bed', quantity: 1 },
                    { id: 'item-006', name: 'Boxes (small)', quantity: 10 },
                    { id: 'item-007', name: 'Boxes (medium)', quantity: 8 },
                    { id: 'item-008', name: 'Television (50-inch)', quantity: 1 },
                ],
                all_locations: [
                    { address: '123 Main Street, Manchester, Greater Manchester, M1 2WD', type: 'pickup', items_count: 3, instructions: 'Ring the doorbell at entrance, 3rd floor' },
                    { address: 'Intermediate Stop 1', type: 'waypoint', items_count: 5, instructions: 'Please call ahead for access' },
                    { address: 'Intermediate Stop 2', type: 'waypoint', items_count: 3, instructions: 'Please bring your keys' },
                    { address: '456 Park Avenue, London, Greater London, W1T 7HF', type: 'dropoff', items_count: 2, instructions: 'Building has elevator access' },
                ],

                // Locations
                pickupAddress: {
                    street: '123 Main Street',
                    city: 'Manchester',
                    state: 'Greater Manchester',
                    zipCode: 'M1 2WD',
                    additionalInfo: 'Ring the doorbell at entrance, 3rd floor',
                },
                deliveryAddress: {
                    street: '456 Park Avenue',
                    city: 'London',
                    state: 'Greater London',
                    zipCode: 'W1T 7HF',
                    additionalInfo: 'Building has elevator access',
                },
                distance: 257,

                // Timing
                pickupDate: '2025-04-10',
                pickupWindow: '12:00 PM - 3:00 PM',
                deliveryDate: '2025-04-10',
                deliveryWindow: '6:00 PM - 9:00 PM',

                // Items
                itemDetails: [
                    { name: 'Sofa (3-seater)', quantity: 1, dimensions: '220 × 90 × 80 cm', weight: '45 kg', photos: ['https://via.placeholder.com/150'] },
                    { name: 'Dining Table', quantity: 1, dimensions: '180 × 90 × 75 cm', weight: '30 kg' },
                    { name: 'Dining Chairs', quantity: 6, dimensions: '45 × 50 × 90 cm', weight: '5 kg each' },
                    { name: 'Bedroom Wardrobe', quantity: 1, dimensions: '150 × 58 × 200 cm', weight: '65 kg', specialInstructions: 'Needs to be disassembled' },
                    { name: 'Queen-size Bed', quantity: 1, dimensions: '160 × 200 × 40 cm', weight: '50 kg' },
                    { name: 'Boxes (small)', quantity: 10, dimensions: '40 × 40 × 40 cm', weight: '5-10 kg each' },
                    { name: 'Boxes (medium)', quantity: 8, dimensions: '60 × 60 × 60 cm', weight: '10-15 kg each' },
                    { name: 'Television (50-inch)', quantity: 1, dimensions: '112 × 10 × 65 cm', weight: '15 kg', specialInstructions: 'Fragile' },
                ],
                totalVolume: '22.5 cubic meters',

                // Provider
                provider: {
                    id: 'PRV-789',
                    name: 'Michael Johnson',
                    companyName: 'Express Movers Ltd',
                    phone: '+44 7700 900123',
                    email: 'contact@expressmovers.co.uk',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    profileImage: 'https://via.placeholder.com/150',
                    rating: 4.8,
                    reviewCount: 176,
                    verifiedProvider: true,
                    verified: true,
                    vehicleType: 'Large Van (3.5t Luton)',
                    capacity: '3.5t',
                    serviceRadius: 100,
                    reviews: [],
                },

                // Customer
                customerName: 'Emma Wilson',
                customerPhone: '+44 7700 900456',
                customerEmail: 'emma.wilson@example.com',

                // Other details
                specialInstructions:
                    'Please handle the TV with extra care. The wardrobe needs to be disassembled before moving. Both buildings have elevators, but please bring furniture protection blankets for the walls just in case.',
                milestones: [
                    { id: 'm1', title: 'Booking Created', status: 'completed', datetime: '2025-03-15T10:30:00Z', description: 'Booking was created and confirmed' },
                    { id: 'm2', title: 'Driver Assigned', status: 'completed', datetime: '2025-03-16T14:22:00Z', description: 'Professional mover assigned to your booking' },
                    { id: 'm3', title: 'Pickup', status: 'upcoming', datetime: '2025-04-10T12:00:00Z', description: 'Items will be collected from origin' },
                    { id: 'm4', title: 'In Transit', status: 'upcoming', description: 'Your items are being transported' },
                    { id: 'm5', title: 'Delivery', status: 'upcoming', datetime: '2025-04-10T18:00:00Z', description: 'Items will be delivered to destination' },
                    { id: 'm6', title: 'Completed', status: 'upcoming', description: 'Booking completed successfully' },
                ],

                // Financial
                subtotal: 375.0,
                taxes: 75.0,
                fees: 25.0,
                total: 475.0,
                currency: 'GBP',
                payments: [
                    { id: 'pay1', type: 'deposit', amount: 95.0, currency: 'GBP', status: 'paid', date: '2025-03-15T10:45:00Z', paymentMethod: 'Credit Card (Visa **** 1234)', receiptUrl: '#' },
                    { id: 'pay2', type: 'final', amount: 380.0, currency: 'GBP', status: 'pending', dueDate: '2025-04-10T12:00:00Z' },
                ],

                // Communication
                messages: [
                    {
                        id: 'msg1',
                        sender: 'system',
                        senderName: 'MoreVans System',
                        content: 'Your booking has been confirmed. Your confirmation number is MV-89735462.',
                        timestamp: '2025-03-15T10:35:00Z',
                    },
                    {
                        id: 'msg2',
                        sender: 'provider',
                        senderName: 'Michael Johnson',
                        content: "Hello! I'm Michael and I'll be handling your move. Do you have any specific requirements I should know about?",
                        timestamp: '2025-03-16T15:10:00Z',
                    },
                    {
                        id: 'msg3',
                        sender: 'customer',
                        senderName: 'Emma Wilson',
                        content: 'Hi Michael, thanks for reaching out! Yes, the TV is quite new and expensive, so extra padding would be appreciated.',
                        timestamp: '2025-03-16T15:45:00Z',
                    },
                    {
                        id: 'msg4',
                        sender: 'provider',
                        senderName: 'Michael Johnson',
                        content: "No problem at all. We'll bring extra protective materials for the TV. Looking forward to helping with your move!",
                        timestamp: '2025-03-16T16:20:00Z',
                        attachments: [{ url: 'https://via.placeholder.com/150', name: 'packing_guide.pdf', type: 'application/pdf' }],
                    },
                ],

                // Stops
                stops: [
                    {
                        type: 'pickup',
                        address: '123 Main Street, Manchester, Greater Manchester, M1 2WD',
                        property_type: 'Residential',
                        unit_number: '3rd floor',
                        floor: 'Ground',
                        has_elevator: true,
                        parking_info: 'Building has elevator access',
                        number_of_rooms: '2',
                        instructions: 'Ring the doorbell at entrance',
                    },
                    {
                        type: 'waypoint',
                        address: 'Intermediate Stop 1',
                        property_type: 'Commercial',
                        unit_number: 'Unit 101',
                        floor: '2nd floor',
                        has_elevator: true,
                        parking_info: 'Parking available',
                        number_of_rooms: '5',
                        instructions: 'Please call ahead for access',
                    },
                    {
                        type: 'waypoint',
                        address: 'Intermediate Stop 2',
                        property_type: 'Residential',
                        unit_number: '4th floor',
                        floor: '3rd floor',
                        has_elevator: true,
                        parking_info: 'Building has elevator access',
                        number_of_rooms: '3',
                        instructions: 'Please bring your keys',
                    },
                    {
                        type: 'dropoff',
                        address: '456 Park Avenue, London, Greater London, W1T 7HF',
                        property_type: 'Residential',
                        unit_number: 'Apartment 123',
                        floor: '1st floor',
                        has_elevator: true,
                        parking_info: 'Building has elevator access',
                        number_of_rooms: '2',
                        instructions: 'Building has elevator access',
                    },
                ],
                estimated_distance: '257 miles',
                special_instructions: 'Handle TV with care, disassemble wardrobe, bring furniture protection blankets.',
            };

            // setBooking(mockBooking);
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
            senderName: userRole === 'customer' ? booking.customerName : booking.provider?.name || 'Provider',
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        // Update state with the new message
        setBooking({
            ...booking,
            messages: [...booking.messages, newMsg],
        });

        // Clear the input field
        setNewMessage('');
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section],
        });
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'bidding':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string): string => {
        switch (status) {
            case 'draft':
                return 'Draft';
            case 'bidding':
                return 'Bidding';
            case 'confirmed':
                return 'Confirmed';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
        }
    };

    const getStatusActions = () => {
        if (!booking) return null;

        if (user?.user_type === 'customer') {
            switch (booking?.status) {
                case 'draft':
                    return (
                        <>
                            <button onClick={() => navigate(`/account/bids/${booking?.id}`)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md mr-2">
                                <FontAwesomeIcon icon={faEye} className="mr-2" />
                                View & Compare Bids
                            </button>
                            <button
                                onClick={() => navigate(`/edit-request/${booking?.id}`, { state: { bookingData: booking } })}
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md mr-2"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit Request
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                                <FontAwesomeIcon icon={faBan} className="mr-2" />
                                Cancel Request
                            </button>
                        </>
                    );
                case 'confirmed':
                    return (
                        <>
                            <button
                                onClick={() => navigate(`/edit-request/${booking?.id}`, { state: { bookingData: booking } })}
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
                            <Link to={`/disputes?bookingId=${booking?.id}`} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
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
            switch (booking?.status) {
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
    };

    const formatDate = (dateString?: string) => {
        try {
            const date = parseISO(dateString || '');
            return format(date, 'PPP');
        } catch (e) {
            return dateString || '';
        }
    };

    const formatTime = (dateString?: string) => {
        try {
            const date = parseISO(dateString || '');
            return format(date, 'p');
        } catch (e) {
            return '';
        }
    };

    const formatDateTime = (dateString?: string) => {
        try {
            const date = parseISO(dateString || '');
            return format(date, 'PPp');
        } catch (e) {
            return dateString || '';
        }
    };

    const getRelativeTime = (dateString?: string) => {
        try {
            const date = parseISO(dateString || '');
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (e) {
            return '';
        }
    };

    // Update the price display sections
    const renderPrice = (price: number | undefined) => {
        return `GHS ${(price || 0).toFixed(2)}`;
    };

    // Add helper functions for provider data
    const getProviderProfileImage = (provider: Provider | undefined) => {
        return provider?.profileImage || provider?.avatar || 'https://via.placeholder.com/60';
    };

    const getProviderName = (provider: Provider | undefined) => {
        return provider?.name || 'Unknown Provider';
    };

    const getProviderPhone = (provider: Provider | undefined) => {
        return provider?.phone || '';
    };

    const getProviderVehicleType = (provider: Provider | undefined) => {
        return provider?.vehicleType || 'Not specified';
    };

    const getProviderReviewsCount = (provider: Provider | undefined) => {
        return provider?.reviewCount || 0;
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
                        <button onClick={() => navigate(-1)} className="text-red-700 hover:text-red-900 font-medium">
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
                            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{booking?.messages?.length}</span>
                        </button>
                    </div>
                </div>

                {/* Back navigation */}
                <div className="mb-6">
                    <Link to={userRole === 'customer' ? '/account/bookings' : '/provider/jobs'} className="inline-flex items-center text-blue-600 hover:text-blue-800">
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
                                        <h1 className="text-2xl font-bold text-gray-900">Booking #{booking?.tracking_number}</h1>
                                        <p className="text-gray-500 mt-1">Created on {formatDateTime(booking?.created_at)}</p>
                                    </div>
                                    <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking?.status)}`}>
                                        {booking?.request_type?.charAt(0).toUpperCase() + booking?.request_type?.slice(1).replace('_', ' ')}
                                    </div>
                                </div>
                                {/* Journey stats */}
                                {booking?.service_type === 'Residential Moving' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faTruckMoving} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Vehicle Type</p>
                                                    <p className="font-medium">{booking?.vehicle_type || 'van'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faUser} className="text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Staff Required</p>
                                                    <p className="font-medium">{booking?.persons_required || 2}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faRoute} className="text-yellow-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Distance</p>
                                                    <p className="font-medium">{booking?.distance || 0} miles</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Est. Travel Time</p>
                                                    <p className="font-medium">{booking?.estimated_travel_time || 'Calculating...'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Stops</p>
                                                    <p className="font-medium">{booking?.stops?.length || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faBox} className="text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Items</p>
                                                    <p className="font-medium">{booking?.items?.length || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faTruckMoving} className="text-yellow-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Service Type</p>
                                                    <p className="font-medium">{booking?.service_type}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                                                    <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Status</p>
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            booking?.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : booking?.status === 'in_progress'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : booking?.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : booking?.status === 'draft'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1).replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                                            <FontAwesomeIcon icon={faTruckMoving} className="text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-xs text-gray-500">Vehicle Type</div>
                                                <div className="text-sm font-medium">{booking?.vehicle_type}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                                            <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-xs text-gray-500">Staff Required</div>
                                                <div className="text-sm font-medium">{booking?.persons_required}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-xs text-gray-500">Distance</div>
                                                <div className="text-sm font-medium">{booking?.distance} miles</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                                            <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-xs text-gray-500">Est. Travel Time</div>
                                                <div className="text-sm font-medium">{booking?.estimated_travel_time}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                dfgdgdfhg
                                {/* Status actions */}
                                <div className="mt-6 flex flex-wrap gap-2">{getStatusActions()}</div>
                            </div>
                        </div>
                        {/* Journey summary - Enhanced for item-specific pickup/dropoff points */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Move Summary - {booking.request_type} -{booking?.service_type}
                            </h2>

                            {/* Journey route visualization with stops */}
                            <div className="relative mb-6">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100"></div>

                                {/* Stop items in sequence */}
                                <div className="space-y-6">
                                    {booking?.stops?.map((stop, index) => (
                                        <div key={stop.type + index} className="relative pl-10">
                                            {/* Timeline marker */}
                                            <div
                                                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                    stop.type === 'pickup' ? 'bg-blue-500 text-white' : stop.type === 'dropoff' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                                }`}
                                            >
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            </div>

                                            {/* Stop details */}
                                            <div className="bg-gray-50 rounded-lg p-4 mb-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-full">
                                                        <div className="flex items-center mb-2">
                                                            <span
                                                                className={`px-2 py-0.5 text-xs rounded-full ${
                                                                    stop.type === 'pickup'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : stop.type === 'dropoff'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-orange-100 text-orange-800'
                                                                }`}
                                                            >
                                                                {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                                                            </span>
                                                            <h3 className="ml-2 font-medium text-gray-900">{stop.address || 'Address not specified'}</h3>
                                                        </div>

                                                        {/* Property Details */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faBuilding} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Property Type:</span>
                                                                    <span className="ml-2 font-medium">{stop.property_type || 'Not specified'}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faDoorOpen} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Unit Number:</span>
                                                                    <span className="ml-2 font-medium">{stop.unit_number || 'Not specified'}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faStairs} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Floor:</span>
                                                                    <span className="ml-2 font-medium">{stop.floor || 'Ground'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faElevator} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Elevator:</span>
                                                                    <span className="ml-2 font-medium">{stop.has_elevator ? 'Yes' : 'No'}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faCar} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Parking Info:</span>
                                                                    <span className="ml-2 font-medium">{stop.parking_info || 'Not specified'}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faHome} className="text-gray-400 mr-2 w-4" />
                                                                    <span className="text-gray-600">Rooms:</span>
                                                                    <span className="ml-2 font-medium">{stop.number_of_rooms || 'Not specified'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Additional Instructions */}
                                                        {stop.instructions && (
                                                            <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                                                                <div className="flex items-center text-sm">
                                                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mr-2" />
                                                                    <span className="text-gray-600">Additional Instructions:</span>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-700">{stop.instructions}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items at this stop - shown when available */}
                                            {index === 0 && booking?.items && booking?.items.length > 0 && (
                                                <div className="ml-4 mt-2 mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items to be picked up:</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {booking?.items?.map((item) => (
                                                            <div key={item.id} className="bg-white p-2 border border-gray-200 rounded-md flex items-center">
                                                                <FontAwesomeIcon icon={faBox} className="text-blue-400 mr-2" />
                                                                <div>
                                                                    <p className="text-sm font-medium">{item.name}</p>
                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* For dropoff stops, indicate what items will be dropped off */}
                                            {stop.type === 'dropoff' && booking?.items && booking?.items.length > 0 && (
                                                <div className="ml-4 mt-2 mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items to be delivered:</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {booking.items.map((item) => (
                                                            <div key={item.id} className="bg-white p-2 border border-gray-200 rounded-md flex items-center">
                                                                <FontAwesomeIcon icon={faBox} className="text-green-400 mr-2" />
                                                                <div>
                                                                    <p className="text-sm font-medium">{item.name}</p>
                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Advanced Journey Details - only if available */}
                            {booking?.all_locations && booking?.all_locations.length > 0 && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">Item-Specific Locations</h3>
                                    <div className="overflow-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Location
                                                    </th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Items
                                                    </th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Instructions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {booking.all_locations.map((location, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{location.address || 'Unknown'}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span
                                                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    location.type === 'pickup'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : location.type === 'dropoff'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-orange-100 text-orange-800'
                                                                }`}
                                                            >
                                                                {location.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{location.items_count || 0} items</td>
                                                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-500 max-w-xs">{location.instructions || 'No special instructions'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Special Instructions */}
                            {booking?.special_instructions && (
                                <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500 mt-1 mr-3" />
                                        <div>
                                            <h3 className="font-medium text-yellow-800 mb-1">Special Instructions</h3>
                                            <p className="text-sm text-yellow-700">{booking.special_instructions}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                                                                Item
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Qty
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Dimensions
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Weight
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Photos
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Fragile
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Needs Disassembly
                                                            </th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Special Requirements
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {booking?.items?.map((item, i) => (
                                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white">
                                                                    <div className="flex items-center">
                                                                        <FontAwesomeIcon icon={faBox} className="text-gray-400 mr-2" />
                                                                        <span className="text-sm font-medium text-gray-900">{item?.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                                    <span className="text-sm text-gray-700">{item?.quantity}</span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className="text-sm text-gray-700">{item?.dimensions}</span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className="text-sm text-gray-700">{item?.weight}</span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {item?.photos && item?.photos?.length > 0 && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                                <FontAwesomeIcon icon={faCamera} className="mr-1" />
                                                                                {item.photos.length} photos
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    {item?.fragile && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                                                                            Fragile
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    {item?.needs_disassembly && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            <FontAwesomeIcon icon={faTools} className="mr-1" />
                                                                            Needs Disassembly
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    {item?.special_instructions && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                                                            {item.special_instructions}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Summary Section */}
                                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Items</p>
                                                    <p className="text-lg font-medium">{booking?.items?.reduce((acc, item) => acc + (item?.quantity || 0), 0)} items</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Volume</p>
                                                    <p className="text-lg font-medium">{booking?.totalVolume || 'Calculating...'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Fragile Items</p>
                                                    <p className="text-lg font-medium">{booking?.items?.filter((item) => item?.fragile).length || 0} items</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Items Needing Disassembly</p>
                                                    <p className="text-lg font-medium">{booking?.items?.filter((item) => item?.needs_disassembly).length || 0} items</p>
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
                                            {booking?.milestones?.map((milestone, index) => (
                                                <div key={milestone?.id} className="relative">
                                                    {/* Timeline circle */}
                                                    <div
                                                        className={`absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 ${
                                                            milestone?.status === 'completed'
                                                                ? 'bg-green-500 border-green-500'
                                                                : milestone?.status === 'current'
                                                                ? 'bg-blue-500 border-blue-500'
                                                                : 'bg-white border-gray-300'
                                                        }`}
                                                    >
                                                        {milestone?.status === 'completed' && <FontAwesomeIcon icon={faCheck} className="text-white text-xs absolute inset-0 m-auto" />}
                                                    </div>

                                                    <div>
                                                        <h3 className={`text-base font-medium ${milestone?.status === 'current' ? 'text-blue-600' : 'text-gray-900'}`}>
                                                            {milestone?.milestone_type?.replace(/_/g, ' ').toUpperCase()}
                                                        </h3>
                                                        {milestone?.scheduled_start && <p className="text-xs text-gray-500">Scheduled: {formatDateTime(milestone.scheduled_start)}</p>}
                                                        {milestone?.actual_start && <p className="text-xs text-gray-500">Started: {formatDateTime(milestone.actual_start)}</p>}
                                                        {milestone?.actual_end && <p className="text-xs text-gray-500">Completed: {formatDateTime(milestone.actual_end)}</p>}
                                                        {milestone?.notes && <p className="text-sm text-gray-700 mt-1">{milestone.notes}</p>}
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
                                                    <p className="text-lg font-medium">
                                                        {booking?.currency} {booking?.subtotal?.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Taxes & Fees</p>
                                                    <p className="text-lg font-medium">
                                                        {booking?.currency} {(booking?.taxes + booking?.fees)?.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="border-t border-gray-300 my-2"></div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-lg font-bold text-gray-900">Total</p>
                                                        <p className="text-xl font-bold text-gray-900">
                                                            {booking?.currency} {booking?.total?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment transactions */}
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Transactions</h3>
                                        <div className="space-y-3">
                                            {booking?.payments?.map((payment) => (
                                                <div key={payment?.id} className="border rounded-md p-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium">{payment?.type?.charAt(0).toUpperCase() + payment?.type?.slice(1)} Payment</p>
                                                            <p className="text-xs text-gray-500">
                                                                {payment?.date ? `Paid on ${formatDate(payment?.date)}` : payment?.dueDate ? `Due on ${formatDate(payment?.dueDate)}` : ''}
                                                            </p>
                                                            {payment?.paymentMethod && <p className="text-xs text-gray-500 mt-1">{payment?.paymentMethod}</p>}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-base font-medium">
                                                                {payment?.currency} {payment?.amount?.toFixed(2)}
                                                            </p>
                                                            <span
                                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                                    payment?.status === 'paid'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : payment?.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : payment?.status === 'overdue'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {payment?.status?.charAt(0).toUpperCase() + payment?.status?.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Payment actions */}
                                                    {payment?.status === 'pending' && userRole === 'customer' && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md">
                                                                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                                                                Pay Now
                                                            </button>
                                                        </div>
                                                    )}

                                                    {payment?.status === 'paid' && payment?.receiptUrl && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <a href={payment?.receiptUrl} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                    </div>

                    {/* Sidebar column */}
                    <div className="space-y-6">
                        {/* Provider/Customer info */}
                        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'details' && 'hidden md:block'}`}>
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">{userRole === 'customer' ? 'Your Provider' : 'Customer Information'}</h2>

                                {userRole === 'customer' && booking?.provider ? (
                                    <div className="flex items-start">
                                        <img src={booking?.provider?.avatar || 'https://via.placeholder.com/60'} alt={booking?.provider?.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                        <div>
                                            <div className="flex items-center">
                                                <h3 className="font-medium text-gray-900">{booking?.provider?.name}</h3>
                                                {booking?.provider?.verifiedProvider && (
                                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                                                        <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm">{booking?.provider?.companyName}</p>
                                            <div className="flex items-center mt-1">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} className={i < Math.floor(booking?.provider?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-600 text-sm">
                                                    {booking?.provider?.rating} ({booking?.provider?.reviewCount} reviews)
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-2">
                                                <a href={`tel:${booking?.provider?.phone}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                                                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                    {booking?.provider?.phone}
                                                </a>
                                                <a href={`mailto:${booking?.provider?.email}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                    {booking?.provider?.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : userRole === 'provider' ? (
                                    <div>
                                        <h3 className="font-medium text-gray-900">{booking?.customerName}</h3>
                                        <div className="mt-3 space-y-2">
                                            <a href={`tel:${booking?.customerPhone}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                {booking?.customerPhone}
                                            </a>
                                            <a href={`mailto:${booking?.customerEmail}`} className="flex items-center text-sm text-gray-700 hover:text-blue-600">
                                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                {booking?.customerEmail}
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
                                        to={`/disputes?bookingId=${booking?.id}`}
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
                                            {booking?.messages?.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                                        <FontAwesomeIcon icon={faComment} className="text-gray-400 text-lg" />
                                                    </div>
                                                    <p className="text-gray-500 text-sm">No messages yet</p>
                                                </div>
                                            ) : (
                                                booking?.messages?.map((message) => (
                                                    <div
                                                        key={message?.id}
                                                        className={`p-3 rounded-lg ${
                                                            message?.sender === 'system' ? 'bg-gray-100 border border-gray-200' : message?.sender === userRole ? 'bg-blue-100 ml-6' : 'bg-gray-100 mr-6'
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-medium text-xs">
                                                                {message?.senderName} {message?.sender === 'system' && '(System)'}
                                                            </span>
                                                            <span className="text-gray-500 text-xs">{getRelativeTime(message?.timestamp)}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800">{message?.content}</p>

                                                        {message?.attachments && message?.attachments?.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {message?.attachments?.map((attachment, i) => (
                                                                    <a
                                                                        key={i}
                                                                        href={attachment?.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center px-2 py-1 bg-white rounded border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                                                                    >
                                                                        <FontAwesomeIcon icon={attachment?.type?.includes('image') ? faEye : faFileAlt} className="mr-1" />
                                                                        {attachment?.name}
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
                                                    onChange={(e) => setNewMessage(e.target.value)}
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
                        {/* Need help section */}
                        <div className={`bg-yellow-50 rounded-lg shadow-sm overflow-hidden border border-yellow-200 ${activeTab !== 'details' && 'hidden md:block'}`}>
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-yellow-800 flex items-center mb-2">
                                    <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                                    Need Help?
                                </h2>
                                <p className="text-sm text-yellow-800 mb-4">Our support team is available 24/7 to assist with any questions about your booking.</p>
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
                                    <img src={getProviderProfileImage(booking?.provider)} alt={getProviderName(booking?.provider)} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                        {getProviderName(booking?.provider)}
                                        {booking?.provider?.verified && (
                                            <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full flex items-center">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm mt-1">
                                        <div className="flex items-center text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} className={i < Math.floor(getProviderRating(booking?.provider)) ? 'text-yellow-400' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                                            {getProviderRating(booking?.provider)} ({getProviderReviewsCount(booking?.provider)} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="flex">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                    <div className="ml-3">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                        <a href={`tel:${getProviderPhone(booking?.provider)}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                            {getProviderPhone(booking?.provider)}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex">
                                    <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                    <div className="ml-3">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Vehicle</div>
                                        <div className="text-gray-900 dark:text-white">{getProviderVehicleType(booking?.provider)}</div>
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
                                                    <span className="text-gray-900 dark:text-white font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                                                    <span className={`text-${statusTextColor} dark:text-${statusTextColorDark} font-medium`}>{formatStatus(booking.status)}</span>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                                                    <span className="text-gray-900 dark:text-white font-medium">{renderPrice(booking?.total)}</span>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <span className="text-gray-500 dark:text-gray-400">Payment Status</span>
                                                    <span className="text-green-600 dark:text-green-400 font-medium">Paid</span>
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
                                                        {booking.description && <p className="text-gray-600 dark:text-gray-400 mt-1">{booking.description}</p>}
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
                                                        {booking?.provider?.profileImage ? (
                                                            <img src={booking?.provider?.profileImage} alt={booking?.provider?.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-800">
                                                                <FontAwesomeIcon icon={faUser} className="text-blue-600 dark:text-blue-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                            {booking?.provider?.name}
                                                            {booking?.provider?.verified && (
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
                                                                        className={i < Math.floor(booking?.provider?.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                                {booking?.provider?.rating} ({booking?.provider?.reviewCount} reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 space-y-3">
                                                    <div className="flex">
                                                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                                        <div className="ml-3">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                                            <a href={`tel:${booking?.provider?.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                                {booking?.provider?.phone}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 mt-1 w-5" />
                                                        <div className="ml-3">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">Vehicle</div>
                                                            <div className="text-gray-900 dark:text-white">{booking?.provider?.vehicleType}</div>
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
                                            <div key={index} className={`mb-8 ${index === 0 ? 'relative' : ''}`}>
                                                <div className="absolute -left-[25px] mt-1.5">
                                                    <div
                                                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                                            index === 0
                                                                ? `bg-${statusBgColor} dark:bg-${statusBgColorDark} text-${statusTextColor} dark:text-${statusTextColorDark}`
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                update.status === 'confirmed'
                                                                    ? faCheckCircle
                                                                    : update.status === 'picked_up'
                                                                    ? faBox
                                                                    : update.status === 'in_transit'
                                                                    ? faTruck
                                                                    : update.status === 'delivered'
                                                                    ? faMapMarkerAlt
                                                                    : faCircle
                                                            }
                                                            className="text-lg"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className={`bg-white dark:bg-gray-800 p-4 border ${
                                                        index === 0 ? `border-${statusBgColor} dark:border-${statusColorDark}/30 shadow-sm` : 'border-gray-200 dark:border-gray-700'
                                                    } rounded-lg shadow-sm`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span
                                                                className={`font-medium ${index === 0 ? `text-${statusTextColor} dark:text-${statusTextColorDark}` : 'text-gray-900 dark:text-white'}`}
                                                            >
                                                                {formatStatus(update.status)}
                                                            </span>
                                                            <p className="text-gray-600 dark:text-gray-400 mt-1">{update.description}</p>
                                                        </div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(update.timestamp).toLocaleDateString()} at{' '}
                                                            {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {/* Add additional details for each status as needed */}
                                                    {update.status === 'picked_up' && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">Picked up from: {booking.pickupLocation}</span>
                                                        </div>
                                                    )}

                                                    {update.status === 'in_transit' && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Currently in transit to: {booking.dropoffLocation}</span>
                                                            {booking.estimatedDeliveryTime && (
                                                                <span className="text-blue-600 dark:text-blue-400">
                                                                    ETA: {new Date(booking.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                                        <span className="font-medium text-gray-500 dark:text-gray-400">{booking.status !== 'in_transit' ? 'In Transit' : 'Delivery'}</span>
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
                                                            <span className="font-medium text-gray-500 dark:text-gray-400">Delivery</span>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your items will be delivered to the destination</p>
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
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Generated on {new Date(booking.date).toLocaleDateString()}</p>
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
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Signed by: John Doe</p>
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
                                                    <p className="text-gray-600 dark:text-gray-400">A delivery receipt will be available once your items have been delivered.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Booking Terms & Conditions */}
                                    <div className="mt-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Terms & Conditions</h4>
                                        <p className="mb-2">This booking is subject to the company's standard terms and conditions for delivery services.</p>
                                        <p>For refunds and cancelation policy, please refer to our terms of service or contact customer support.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {booking?.provider && (
                <ProviderModal
                    isOpen={showProviderModal}
                    onClose={() => setShowProviderModal(false)}
                    provider={{
                        ...booking.provider,
                        price: booking.provider.price || 0, // Add default price if missing
                    }}
                />
            )}
        </div>
    );
};

export default BookingDetail;
