import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    faBox,
    faMapMarkerAlt,
    faUser,
    faStar,
    faSearch,
    faTruck,
    faCalendarCheck,
    faCalculator,
    faBell,
    faExclamationCircle,
    faInfoCircle,
    faCalendarAlt,
    faHeadset,
    faFileInvoice,
    faSun,
    faCloudRain,
    faCloud,
    faSnowflake,
    faHome,
    faDoorOpen,
    faBuilding,
    faElevator,
    faStairs,
    faClock,
    faUmbrella,
    faGavel,
    faCommentAlt,
    faCheckCircle,
    faPaperPlane,
    faShieldAlt,
    faTimes,
    faExclamationTriangle,
    faCircleNotch,
    faAngleRight,
    faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StatCard from '../../components/ui/statCard';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

interface AuthUser {
    user?: {
        id: string;
        name?: string;
        email?: string;
        // Add other properties as needed
    };
}

interface Booking {
    id: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'in_transit';
    date: string;
    pickup_location: string;
    dropoff_location: string;
    itemType: string;
    item_size: string;
    providerName?: string;
    providerRating?: number;
    price?: number;
    trackingUrl?: string;
    journey_stops?: { id: string; type: string; address: string }[];
}

// Update the ServiceRequest interface with additional fields
interface ServiceRequest {
    // Contact Information
    contact_name: string;
    contact_phone: string;
    contact_email: string;

    // Existing fields
    pickup_location: string;
    dropoff_location: string;

    // Additional location details
    pickup_floor?: number;
    pickup_unit_number?: string;
    pickup_parking_info?: string;
    dropoffFloor?: number;
    dropoff_unit_number?: string;
    dropoff_parking_info?: string;

    // Existing fields
    itemType: string;
    item_size: string;
    preferred_date: string;
    preferred_time: string;
    estimatedValue: string;
    description: string;

    // Additional item details
    item_weight?: string;
    item_dimensions?: string;
    needs_disassembly?: boolean;
    isFragile?: boolean;

    // Moving specific fields (existing)
    numberOfRooms?: number;
    numberOfFloors?: number;
    propertyType?: 'house' | 'apartment' | 'office' | 'storage';
    hasElevator?: boolean;

    // Schedule options
    is_flexible?: boolean;

    // Other options
    needsInsurance?: boolean;
    request_type: 'instant' | 'bidding';
    photoURLs?: string[];
}

import useSWR from 'swr';
import fetcher from '../../helper/fetcher';
import ChatMessage from '../../components/Chat/ChatMessage';
import { use } from 'i18next';

const UserDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('bookings');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    // const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [upcomingMove, setUpcomingMove] = useState<Booking | null>(null);
    const [showChat, setShowChat] = useState<boolean>(false);
    const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);
    const auth = useAuthUser() as AuthUser;
    const user = auth?.user;
    const [activeChatProvider, setActiveChatProvider] = useState<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const [activeDisputes, setActiveDisputes] = useState<any[]>([]);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const navigate = useNavigate();

    const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useSWR(user?.id ? `/requests/?user_id=${user?.id}` : null, fetcher);

    useEffect(() => {
        // // Fetch user data
        // const userData = {"id":"5c0df7e9-473c-4a01-bf09-c601394cb837","email":"7x0pI@example.com","name":"John Doe","address":"123 Main St, Anytown, USA","phone":"555-555-5555","password":"password123","role":"user"};
        // if (userData) {
        //   setUser(userData);
        // }

        // Fetch bookings
        fetchBookings();
        fetchActiveDisputes();

        // Set upcoming move
        const upcoming = bookings.find((b) => b.status === 'confirmed');
        if (upcoming) {
            setUpcomingMove(upcoming);
        }

        // Set initial chat messages for active bookings
        const activeBooking = bookings.find((b) => b.status === 'in_progress');
        if (activeBooking && activeBooking.providerName) {
            setActiveChatProvider({
                name: activeBooking.providerName,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(activeBooking.providerName)}&background=random`,
                bookingId: activeBooking.id,
            });

            setChatMessages([
                {
                    id: 'msg-1',
                    sender: 'provider',
                    text: `Hello! I'm on my way to pick up your items. Is there anything specific I should know?`,
                    time: new Date(Date.now() - 3600000).toISOString(),
                },
            ]);
        }

        // Outside click handler for notifications panel
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

    useEffect(() => {
        if (bookingsData) {
            setBookings(bookingsData);
            console.log('all bookings', bookingsData);
        }
    }, [bookingsData]);

    // Add auto-scroll for chat
    useEffect(() => {
        if (chatEndRef.current && showChat && !isChatMinimized) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, showChat, isChatMinimized]);

    const fetchBookings = () => {
        // Mock data for bookings
        const mockBookings: Booking[] = [
            {
                id: 'BK-12345',
                status: 'completed',
                date: '2023-06-10T14:00:00',
                pickup_location: '123 Main St, New York, NY',
                dropoff_location: '456 Park Ave, New York, NY',
                itemType: 'Furniture',
                item_size: 'Large',
                providerName: 'Express Movers',
                providerRating: 4.8,
                price: 120,
                trackingUrl: '/tracking/BK-12345',
            },
            {
                id: 'BK-12346',
                status: 'in_progress',
                date: '2023-06-15T10:30:00',
                pickup_location: '789 Broadway, New York, NY',
                dropoff_location: '101 5th Ave, New York, NY',
                itemType: 'Electronics',
                item_size: 'Medium',
                providerName: 'Safe Transport',
                providerRating: 4.9,
                price: 85,
                trackingUrl: '/tracking/BK-12346',
            },
            {
                id: 'BK-12347',
                status: 'confirmed',
                date: '2023-06-20T09:00:00',
                pickup_location: '222 E 44th St, New York, NY',
                dropoff_location: '888 7th Ave, New York, NY',
                itemType: 'Boxes',
                item_size: 'Small',
                providerName: 'City Logistics',
                providerRating: 4.6,
                price: 65,
                trackingUrl: '/tracking/BK-12347',
            },
            {
                id: 'BK-12348',
                status: 'pending',
                date: '2023-06-25T13:00:00',
                pickup_location: '350 5th Ave, New York, NY',
                dropoff_location: '1 World Trade Center, New York, NY',
                itemType: 'Artwork',
                item_size: 'Medium',
                trackingUrl: '/tracking/BK-12348',
            },
        ];
    };

    // Add function for active disputes
    const fetchActiveDisputes = () => {
        // Mock data for active disputes
        const mockDisputes = [
            {
                id: 'DSP-001',
                bookingId: 'BK-12345',
                title: 'Damaged furniture during move',
                status: 'under_review',
                createdAt: '2025-03-20T14:30:00Z',
                updatedAt: '2025-03-22T10:15:00Z',
                provider: 'Express Movers',
                responses: 3,
            },
            {
                id: 'DSP-002',
                bookingId: 'BK-12346',
                title: 'Overcharged for service',
                status: 'resolved',
                createdAt: '2025-03-18T16:20:00Z',
                updatedAt: '2025-03-19T14:00:00Z',
                provider: 'Swift Relocations',
                responses: 3,
                resolution: {
                    outcome: 'refunded',
                    amount: 55,
                    currency: 'GBP',
                },
            },
        ];

        setActiveDisputes(mockDisputes);
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearchTerm =
            booking?.id?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            booking?.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking?.dropoff_location?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'bookings') return matchesSearchTerm; // Show all bookings matching the search term
        if (activeTab === 'active') return matchesSearchTerm && (booking.status === 'in_transit' || booking.status === 'accepted');
        if (activeTab === 'completed') return matchesSearchTerm && booking.status === 'completed';
        return false;
    });

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        // Add user message
        const newUserMsg = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: chatInput,
            time: new Date().toISOString(),
        };

        setChatMessages([...chatMessages, newUserMsg]);
        setChatInput('');

        // Simulate response after a short delay
        setTimeout(() => {
            const responses = [
                "I'll check on this and get back to you shortly!",
                "Thanks for letting me know. We're making good progress with your move.",
                'I understand your concern. Let me see how I can help with that.',
                "We'll be arriving at the destination in about 30 minutes.",
                'All your items have been safely loaded into the van.',
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const newProviderMsg = {
                id: `provider-${Date.now()}`,
                sender: 'provider',
                text: randomResponse,
                time: new Date().toISOString(),
            };

            setChatMessages((prev) => [...prev, newProviderMsg]);
        }, 1500);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
        setUnreadNotifications(unreadNotifications > 0 ? unreadNotifications - 1 : 0);
    };

    const getDisputeStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'text-blue-600 bg-blue-100';
            case 'under_review':
                return 'text-purple-600 bg-purple-100';
            case 'waiting_for_info':
                return 'text-yellow-600 bg-yellow-100';
            case 'resolved':
                return 'text-green-600 bg-green-100';
            case 'closed':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getDisputeStatusText = (status: string) => {
        switch (status) {
            case 'under_review':
                return 'Under Review';
            case 'waiting_for_info':
                return 'Waiting for Info';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
        }
    };

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            case 'confirmed':
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

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'sunny':
                return faSun;
            case 'rainy':
                return faCloudRain;
            case 'cloudy':
                return faCloud;
            case 'snowy':
                return faSnowflake;
            default:
                return faCloud;
        }
    };

    const formatChatTime = (timeString: string): string => {
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error('Error formatting chat time:', error);
            return '';
        }
    };

    const groupMessagesByDate = (messages: any[]) => {
        const groups: { [key: string]: any[] } = {};

        messages.forEach((msg) => {
            const date = new Date(msg.time);
            const dateStr = date.toLocaleDateString();

            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(msg);
        });

        return groups;
    };

    const [isProviderTyping, setIsProviderTyping] = useState(false);

    const PropertyDetailsCard = ({ booking }: { booking: Booking }) => {
        const propertyDetails = booking.propertyDetails || {
            type: 'apartment',
            rooms: 2,
            floors: 1,
            hasElevator: true,
            parkingAvailable: true,
            specialInstructions: 'Fragile items in kitchen boxes',
        };

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faHome} className="text-blue-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{propertyDetails.type?.charAt(0).toUpperCase() + propertyDetails.type?.slice(1)}</span>
                    </div>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faDoorOpen} className="text-blue-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{propertyDetails.rooms} Rooms</span>
                    </div>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faBuilding} className="text-blue-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                            {propertyDetails.floors} {propertyDetails.floors > 1 ? 'Floors' : 'Floor'}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={propertyDetails.hasElevator ? faElevator : faStairs} className="text-blue-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{propertyDetails.hasElevator ? 'Elevator Available' : 'No Elevator'}</span>
                    </div>
                </div>
                {propertyDetails.specialInstructions && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Special Instructions:</span> {propertyDetails.specialInstructions}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const UpcomingMoveWeather = ({ booking }: { booking: Booking }) => {
        const [weather, setWeather] = useState({ condition: 'sunny', temp: 72, precipitation: 0 });

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <FontAwesomeIcon icon={getWeatherIcon(weather.condition)} className="text-8xl text-blue-500" />
                </div>

                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Move Day Weather</h2>

                <div className="flex items-center mb-4">
                    <div className="mr-4">
                        <FontAwesomeIcon icon={getWeatherIcon(weather.condition)} className="text-4xl text-blue-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{weather.temp}°F</div>
                        <div className="text-gray-600 dark:text-gray-400 capitalize">{weather.condition}</div>
                    </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faClock} className="mr-2" /> {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {weather.precipitation > 0 && (
                        <p>
                            <FontAwesomeIcon icon={faUmbrella} className="mr-2" /> {weather.precipitation}% chance of rain
                        </p>
                    )}
                </div>

                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Moving Tip:</p>
                    {weather.condition === 'rainy' ? (
                        <p>Pack electronics and furniture in waterproof covers</p>
                    ) : weather.condition === 'sunny' && weather.temp > 85 ? (
                        <p>Stay hydrated and take breaks; protect fragile items from heat</p>
                    ) : (
                        <p>Weather looks good for your move! Make sure to be ready 15 minutes early.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white animate-pulse delay-700"></div>
                        <div className="absolute top-24 right-32 w-16 h-16 rounded-full bg-white animate-pulse delay-300"></div>
                    </div>

                    <div className="p-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="animate-fade-in-up">
                                <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name || 'Customer'}</h1>
                                <p className="text-blue-100">Track your shipments and manage your moving services</p>
                                <div className="flex flex-wrap mt-4 gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800 dark:bg-blue-300 dark:text-blue-900">
                                        <FontAwesomeIcon icon={faTruck} className="mr-1" />
                                        {bookings.filter((b) => b.status === 'in_progress').length} Active Moves
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-300 dark:text-green-900">
                                        <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
                                        Premium Member
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800 dark:bg-purple-300 dark:text-purple-900">
                                        <FontAwesomeIcon icon={faStar} className="mr-1" />
                                        320 Loyalty Points
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => document.getElementById('quick-estimate')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                                    Quick Estimate
                                </button>
                                <Link
                                    to="/service-request"
                                    className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Book a Move
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={faBox}
                        title="Total Bookings"
                        value={bookings.length}
                        color="blue"
                        trend={{
                            value: 12,
                            isPositive: true,
                        }}
                    />

                    <StatCard icon={faMapMarkerAlt} title="Active Moves" value={bookings.filter((b) => b.status === 'in_transit' || b.status === 'accepted').length} color="purple" />

                    <StatCard
                        icon={faUser}
                        title="Completed Moves"
                        value={bookings.filter((b) => b.status === 'completed').length}
                        color="green"
                        trend={{
                            value: 5,
                            isPositive: true,
                        }}
                    />

                    <StatCard icon={faStar} title="Pending Approval" value={bookings.filter((b) => b.status === 'pending').length} color="yellow" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/4 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/service-request"
                                        className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faBox} className="text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <span>Request New Move</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/support" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faHeadset} className="text-purple-500 dark:text-purple-400" />
                                        </div>
                                        <span>Contact Support</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faUser} className="text-green-500 dark:text-green-400" />
                                        </div>
                                        <span>Update Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/invoices" className="flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-2 mr-3">
                                            <FontAwesomeIcon icon={faFileInvoice} className="text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                        <span>View Invoices</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div id="quick-estimate" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Moving Estimate</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Move Size</label>
                                    <select
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select size
                                        </option>
                                        <option value="studio">Studio / 1 Room</option>
                                        <option value="1bedroom">1 Bedroom</option>
                                        <option value="2bedroom">2 Bedrooms</option>
                                        <option value="3bedroom">3+ Bedrooms</option>
                                        <option value="office">Office</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moving Distance</label>
                                    <select
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select distance
                                        </option>
                                        <option value="local">Local (&lt; 50 miles)</option>
                                        <option value="regional">Regional (50-250 miles)</option>
                                        <option value="longDistance">Long Distance (250+ miles)</option>
                                        <option value="international">International</option>
                                    </select>
                                </div>
                                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                    Get Estimate
                                </button>
                            </form>
                        </div>

                        {bookings.some((b) => b.status === 'in_progress') && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Active Move Tracker</h2>
                                {bookings
                                    .filter((b) => b.status === 'in_progress')
                                    .map((booking) => (
                                        <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium text-gray-500">{booking.id}</span>
                                                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">In Progress</span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="text-sm mb-1">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
                                                    <span className="font-medium">From:</span> {booking?.pickup_location?.split(',')[0]}
                                                </div>
                                                <div className="text-sm">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mr-2" />
                                                    <span className="font-medium">To:</span> {booking?.dropoff_location?.split(',')[0]}
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                                <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
                                            </div>
                                            <Link to={booking.trackingUrl || '#'} className="w-full text-center block bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                                View Live Tracking
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {upcomingMove && <UpcomingMoveWeather booking={upcomingMove} />}

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Payments & Refunds</h2>

                            <div className="space-y-3">
                                {activeDisputes.some((d) => d.resolution?.outcome === 'refunded') ? (
                                    <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/40">
                                        <div className="mr-3 text-green-500">
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-green-800 dark:text-green-300">Refund Processed</h3>
                                            <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
                                                Your refund of {activeDisputes.find((d) => d.resolution?.outcome === 'refunded')?.resolution.currency}{' '}
                                                {activeDisputes.find((d) => d.resolution?.outcome === 'refunded')?.resolution.amount}
                                                has been processed and will appear in your account in 3-5 business days.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
                                        <div className="mr-3 text-blue-500">
                                            <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-800 dark:text-blue-300">No Pending Payments</h3>
                                            <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">All your payments are up to date. View your payment history in the Billing section.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">My Bookings</h2>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search bookings..."
                                        className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex">
                                        <button
                                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                            onClick={() => setActiveTab('bookings')}
                                        >
                                            All Bookings
                                        </button>
                                        <button
                                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                            onClick={() => setActiveTab('active')}
                                        >
                                            Active
                                        </button>
                                        <button
                                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'completed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                            onClick={() => setActiveTab('completed')}
                                        >
                                            Completed
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <FontAwesomeIcon icon={faBox} className="mx-auto text-gray-400 text-5xl mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-1">No bookings found</h3>
                                    <p className="text-gray-500">{searchTerm ? `No results matching "${searchTerm}"` : "You haven't made any bookings yet"}</p>
                                    {!searchTerm && (
                                        <Link
                                            to="/service-request"
                                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Create your first booking
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-4 sm:mx-0">
                                    <div className="inline-block min-w-full align-middle">
                                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Booking ID
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Move Type
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Locations
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Provider
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Price
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {filteredBookings.map((booking) => (
                                                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(booking.status)}`}>{getStatusText(booking.status)}</span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{booking?.request_type}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.created_at).toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                                <div className="flex items-start">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                                                                    <div>
                                                                        {booking.journey_stops?.map((stop, index) => (
                                                                            <div key={stop.id} className="truncate max-w-xs">
                                                                                <span className="text-xs font-medium text-gray-400 mr-1">{stop.type === 'pickup' ? 'A' : 'B'}:</span>
                                                                                {stop.address}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {booking.providerName ? (
                                                                    <div>
                                                                        <div>{booking.providerName}</div>
                                                                        {booking.providerRating && (
                                                                            <div className="flex items-center">
                                                                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                                                                <span>{booking.providerRating}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">Not assigned</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.price ? `$${booking.price.toFixed(2)}` : '-'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Link to={`/tracking/${booking.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                                                    Track
                                                                </Link>

                                                                <Link to={`/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-900">
                                                                    Details
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {activeDisputes.length > 0 && (
                            <div className="mb-8 mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0 flex items-center">
                                        <FontAwesomeIcon icon={faGavel} className="mr-2 text-blue-600" />
                                        Active Disputes
                                    </h2>
                                    <Link to="/disputes" className="text-sm text-blue-600 hover:underline flex items-center">
                                        View All Disputes
                                        <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeDisputes.map((dispute) => (
                                        <div
                                            key={dispute.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => navigate(`/disputes?id=${dispute.id}`)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">{dispute.title}</h3>
                                                    <p className="text-sm text-gray-500">Booking: {dispute.bookingId}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${getDisputeStatusColor(dispute.status)}`}>{getDisputeStatusText(dispute.status)}</span>
                                            </div>

                                            <div className="mt-3 flex justify-between items-center text-sm">
                                                <span className="text-gray-500">
                                                    {dispute.provider} • {new Date(dispute.updatedAt).toLocaleDateString()}
                                                </span>

                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faCommentAlt} className="text-gray-400 mr-1" />
                                                    <span>{dispute.responses} messages</span>
                                                </div>
                                            </div>

                                            {dispute.resolution && (
                                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center text-green-600">
                                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                        <span className="text-sm font-medium">
                                                            {dispute.resolution.outcome === 'refunded' ? 'Full refund' : 'Partially refunded'}: {dispute.resolution.currency}{' '}
                                                            {dispute.resolution.amount}
                                                        </span>
                                                    </div>
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

            <div className="fixed bottom-20 right-4 z-50">
                {!showChat ? (
                    <button onClick={() => setShowChat(true)} className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors">
                        <FontAwesomeIcon icon={faCommentAlt} size="lg" />
                    </button>
                ) : (
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col ${isChatMinimized ? 'w-72' : 'w-80 sm:w-96'}`}
                        style={{ height: isChatMinimized ? 'auto' : '420px' }}
                    >
                        <div className="bg-blue-600 text-white p-3 flex items-center justify-between cursor-pointer" onClick={() => setIsChatMinimized(!isChatMinimized)}>
                            {activeChatProvider ? (
                                <div className="flex items-center">
                                    <img src={activeChatProvider.avatar} alt={activeChatProvider.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                                    <div>
                                        <h3 className="font-medium text-sm">{activeChatProvider.name}</h3>
                                        <div className="flex items-center text-xs text-blue-200">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                            Online
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                        <FontAwesomeIcon icon={faHeadset} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">Customer Support</h3>
                                        <p className="text-xs text-blue-200">Typically replies in minutes</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsChatMinimized(!isChatMinimized);
                                    }}
                                    className="text-white hover:text-blue-100 mr-2"
                                >
                                    <FontAwesomeIcon icon={isChatMinimized ? faAngleRight : faAngleRight} className={`transform ${isChatMinimized ? '' : 'rotate-90'}`} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowChat(false);
                                    }}
                                    className="text-white hover:text-blue-100"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>

                        {!isChatMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
                                    {chatMessages.length > 0 ? (
                                        chatMessages.map((msg) => (
                                            <div key={msg.id} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                                {msg.sender === 'provider' && (
                                                    <img src={activeChatProvider?.avatar || `https://ui-avatars.com/api/?name=Support`} alt="Provider" className="w-8 h-8 rounded-full mr-2 mt-2" />
                                                )}
                                                <div
                                                    className={`py-2 px-3 rounded-lg max-w-[80%] ${
                                                        msg.sender === 'user'
                                                            ? 'bg-blue-600 text-white rounded-br-none'
                                                            : msg.sender === 'provider'
                                                            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm rounded-bl-none'
                                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-center w-full text-sm italic'
                                                    }`}
                                                >
                                                    <div>{msg.text}</div>
                                                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{formatChatTime(msg.time)}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center p-6">
                                                <FontAwesomeIcon icon={faCommentAlt} className="text-gray-300 text-4xl mb-3" />
                                                <p className="text-gray-500 dark:text-gray-400">Start chatting with your provider</p>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef}></div>
                                </div>

                                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className={`py-2 px-4 rounded-r-lg flex items-center justify-center ${
                                                chatInput.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </form>
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                                            <span>Messages are encrypted</span>
                                        </div>
                                        {activeChatProvider && <button className="text-blue-600 dark:text-blue-400 hover:underline">View full conversation</button>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
