import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    IconTruck,
    IconCalendar,
    IconClipboardList,
    IconMapPin,
    IconStar,
    IconClock,
    IconBell,
    IconUser,
    IconSettings,
    IconChevronRight,
    IconPackage,
    IconRoute,
    IconCash,
    IconCheck,
    IconAlertCircle,
    IconPhone,
    IconMail,
    IconGasStation,
    IconMap,
    IconTruckDelivery,
    IconUsers,
    IconChartLine,
    IconPackages,
    IconClipboard,
    IconLocation,
    IconToolsKitchen2,
    IconShield,
    IconTarget,
    IconActivity,
    IconTrendingUp,
} from '@tabler/icons-react';

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
    paymentStatus: 'paid' | 'pending' | 'partial' | 'overdue';
    isHighPriority?: boolean;
    distance?: number;
    weight?: string;
    urgency?: 'standard' | 'express' | 'same-day';
}

interface Vehicle {
    id: string;
    type: string;
    registration: string;
    status: 'available' | 'on-route' | 'maintenance';
    location: string;
    capacity: string;
    driver?: string;
}

const ProviderDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
    const navigate = useNavigate();
    const notificationsRef = useRef<HTMLDivElement>(null);

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
                name: 'Patrick',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                company: 'MoreVans Logistics',
                verificationBadges: ['Verified', 'Premium Fleet'],
            });
        }, 500);

        // Fetch bookings data
        setTimeout(() => {
            const mockBookings: Booking[] = [
                {
                    id: 'MV-23457',
                    status: 'pending',
                    date: '2025-04-10T09:00:00',
                    time: '09:00',
                    pickupLocation: '123 Main St, London, UK',
                    dropoffLocation: '456 Oxford St, London, UK',
                    itemType: 'Furniture',
                    itemSize: 'Large',
                    price: 120,
                    customerName: 'Emma Thompson',
                    customerRating: 4.8,
                    paymentStatus: 'pending',
                    isHighPriority: true,
                    distance: 12.5,
                    weight: '250kg',
                    urgency: 'express',
                },
                {
                    id: 'MV-23458',
                    status: 'accepted',
                    date: '2025-04-11T13:30:00',
                    time: '13:30',
                    pickupLocation: '10 Downing St, London, UK',
                    dropoffLocation: '221B Baker St, London, UK',
                    itemType: 'Electronics',
                    itemSize: 'Medium',
                    price: 85,
                    customerName: 'John Davis',
                    customerRating: 4.9,
                    paymentStatus: 'paid',
                    distance: 8.2,
                    weight: '45kg',
                    urgency: 'standard',
                },
                {
                    id: 'MV-23459',
                    status: 'in_progress',
                    date: '2025-04-12T10:00:00',
                    time: '10:00',
                    pickupLocation: '15 Abbey Road, London, UK',
                    dropoffLocation: '33 Carnaby St, London, UK',
                    itemType: 'Commercial Goods',
                    itemSize: 'Large',
                    price: 150,
                    customerName: 'Sophie Wilson',
                    customerRating: 4.7,
                    paymentStatus: 'paid',
                    distance: 15.8,
                    weight: '180kg',
                    urgency: 'same-day',
                },
            ];

            const mockVehicles: Vehicle[] = [
                {
                    id: 'VH-001',
                    type: 'Transit Van',
                    registration: 'LN65 ABC',
                    status: 'on-route',
                    location: 'Central London',
                    capacity: '1200kg',
                    driver: 'James Smith',
                },
                {
                    id: 'VH-002',
                    type: 'Large Van',
                    registration: 'LN66 DEF',
                    status: 'available',
                    location: 'North London',
                    capacity: '1800kg',
                },
                {
                    id: 'VH-003',
                    type: 'Box Truck',
                    registration: 'LN67 GHI',
                    status: 'maintenance',
                    location: 'Depot',
                    capacity: '3500kg',
                },
            ];

            setBookings(mockBookings);
            setVehicles(mockVehicles);
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
                return 'In Transit';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getVehicleStatusColor = (status: string): string => {
        switch (status) {
            case 'available':
                return 'text-green-600 bg-green-100';
            case 'on-route':
                return 'text-blue-600 bg-blue-100';
            case 'maintenance':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getUrgencyColor = (urgency: string): string => {
        switch (urgency) {
            case 'express':
                return 'text-orange-600 bg-orange-100';
            case 'same-day':
                return 'text-red-600 bg-red-100';
            case 'standard':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-6 py-8">
                {/* Enhanced Logistics Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hi {providerInfo?.name || 'Patrick'} - Logistics Command Center</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your fleet, optimize routes, and coordinate deliveries across your network</p>
                        </div>
                    </div>
                </div>

                {/* Main Action Cards - Full Width */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Find Work Card */}
                    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <IconTruckDelivery size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Cargo</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">Browse available loads, contracts and delivery routes that match your fleet capacity</p>
                            <Link
                                to="/provider/find-work"
                                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Browse Loads
                                <IconChevronRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Fleet Scheduling Card */}
                    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <IconCalendar size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fleet Scheduling</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">Schedule your fleet availability and optimize vehicle utilization across routes</p>
                            <Link
                                to="/provider/fleet-scheduling"
                                className="inline-flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Manage Schedule
                                <IconChevronRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Dispatch Operations Card */}
                    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <IconClipboardList size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dispatch Center</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">Monitor active deliveries, coordinate drivers, and track shipments in real-time</p>
                            <Link
                                to="/provider/dispatch"
                                className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Open Dispatch
                                <IconChevronRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Logistics Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{vehicles.filter((v) => v.status === 'available').length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Available Vehicles</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{vehicles.filter((v) => v.status === 'on-route').length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">On Route</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{bookings.filter((b) => b.status === 'completed').length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{bookings.reduce((sum, b) => sum + (b.distance || 0), 0).toFixed(1)} km</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Distance Today</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">£{bookings.reduce((sum, booking) => sum + booking.price, 0)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">95%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Fleet Efficiency</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Section - Active Operations */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Fleet Status */}
                        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconTruck className="text-blue-600" />
                                    Fleet Status
                                </h2>
                                <Link to="/provider/fleet" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                    Manage Fleet
                                    <IconChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-100/50 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <IconTruck size={20} className="text-blue-500" />
                                                <span className="font-semibold text-gray-900">{vehicle.type}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVehicleStatusColor(vehicle.status)}`}>{vehicle.status.replace('-', ' ')}</span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Registration:</span>
                                                <span className="font-medium">{vehicle.registration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Capacity:</span>
                                                <span className="font-medium">{vehicle.capacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Location:</span>
                                                <span className="font-medium">{vehicle.location}</span>
                                            </div>
                                            {vehicle.driver && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Driver:</span>
                                                    <span className="font-medium">{vehicle.driver}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Shipments */}
                        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconPackages className="text-green-600" />
                                    Active Shipments
                                </h2>
                                <Link to="/provider/shipments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                    View All
                                    <IconChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {bookings.slice(0, 3).map((booking) => (
                                    <div key={booking.id} className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-100/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>{getStatusText(booking.status)}</span>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(booking.urgency || 'standard')}`}>
                                                        {booking.urgency?.toUpperCase()}
                                                    </span>
                                                    <span className="text-sm text-gray-500 font-mono">{booking.id}</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                            <IconMapPin size={16} className="text-green-500" />
                                                            <span className="font-medium">Pickup:</span>
                                                            <span>{booking.pickupLocation.split(',')[0]}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                            <IconMapPin size={16} className="text-red-500" />
                                                            <span className="font-medium">Delivery:</span>
                                                            <span>{booking.dropoffLocation.split(',')[0]}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <IconPackage size={16} />
                                                                {booking.itemType}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <IconClock size={16} />
                                                                {booking.time}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                            <span>{booking.distance} km</span>
                                                            <span>{booking.weight}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">£{booking.price}</div>
                                                <div className="text-sm text-gray-500">{booking.customerName}</div>
                                                {booking.customerRating && (
                                                    <div className="flex items-center gap-1 justify-end mt-1">
                                                        <IconStar size={14} className="text-yellow-400 fill-current" />
                                                        <span className="text-xs text-gray-600">{booking.customerRating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Logistics Tools */}
                    <div className="space-y-6">
                        {/* Route Optimization */}
                        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <IconRoute className="text-purple-600" />
                                Route Optimization
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-purple-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Today's Routes</span>
                                        <span className="text-sm text-purple-600">92% Efficient</span>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-2">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Optimize Current Routes</button>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <IconTrendingUp className="text-green-600" />
                                Performance
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700">On-Time Delivery</span>
                                        <span className="text-sm font-medium text-gray-900">96%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700">Fleet Utilization</span>
                                        <span className="text-sm font-medium text-gray-900">88%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700">Customer Rating</span>
                                        <span className="text-sm font-medium text-gray-900">4.8/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
