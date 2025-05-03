import { Booking } from '../../../types/booking';
import { getPrimaryActionButton, getSecondaryActionButton, getStatusBadgeClass, getStatusTag } from './getActions';
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

interface MyBookingCardProps {
    booking: Booking;
    expandedBooking: string | null;
    toggleBookingDetails: (id: string) => void;
}

export const MyBookingCard: React.FC<MyBookingCardProps> = ({ booking }) => {
    const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
    const navigate = useNavigate();

    const toggleBookingDetails = (id: string) => {
        setExpandedBooking(expandedBooking === id ? null : id);
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/50 hover:border-gray-200 dark:hover:border-gray-600">
            {/* Booking Header */}
            <div
                className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer 
                             hover:bg-gray-50/50 dark:hover:bg-gray-750/50 transition-colors"
                onClick={() => toggleBookingDetails(booking.id)}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 tracking-tight">{booking.service_type}</span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            {booking.booking_type === 'instant' && (
                                <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2.5 py-1 rounded-full font-medium">Instant</span>
                            )}
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{booking.id}</span> • Booked on {new Date(booking.booking_date).toLocaleDateString()}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                                {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </div>
                            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-500 dark:text-blue-400" />
                                {booking.item_size?.charAt(0).toUpperCase() + booking.item_size?.slice(1)} Load
                            </div>
                            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500 dark:text-blue-400" />${booking.amount?.toFixed(2)}
                                {!booking.is_paid && booking.status !== 'bidding' && <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-medium">(Payment Required)</span>}
                            </div>
                        </div>

                        {/* Status-specific information */}
                        <div className="mt-3 text-sm">{getStatusTag(booking)}</div>
                    </div>

                    <div className="flex items-center gap-4">
                        {booking.status !== 'bidding' && booking.status !== 'pending' && booking.provider_name && (
                            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-full px-3 py-1.5">
                                {booking.selected_provider?.profile_picture && (
                                    <img
                                        src={booking.selected_provider.profile_picture}
                                        alt={booking.provider_name}
                                        className="h-6 w-6 rounded-full mr-2 object-cover border border-gray-200 dark:border-gray-600"
                                    />
                                )}
                                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">{booking.provider_name}</span>
                                <div className="flex items-center text-yellow-400">
                                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                                    <span className="ml-1 text-xs text-gray-700 dark:text-gray-300">{booking.provider_rating?.toFixed(1)}</span>
                                </div>
                            </div>
                        )}
                        <FontAwesomeIcon
                            icon={expandedBooking === booking.id ? faChevronUp : faChevronDown}
                            className="text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {expandedBooking === booking.id && (
                <div className="p-5 md:p-6 bg-gray-50/50 dark:bg-gray-850 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-blue-500 dark:text-blue-400" />
                                Locations
                            </h3>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900/20 mb-4 border border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-4">
                                    {booking.stops?.map((stop: { id: string; type: string; address: string; contact_name?: string; contact_phone?: string; notes?: string }, index: number) => (
                                        <div key={stop.id} className="flex items-start group/item">
                                            <div className="mt-1 mr-3">
                                                <div
                                                    className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${
                                                        stop.type === 'pickup' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`}
                                                >
                                                    {stop.type === 'pickup' ? 'A' : 'B'}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{stop.type === 'pickup' ? 'Pickup' : 'Dropoff'}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{stop.address}</p>
                                                {stop.contact_name && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Contact: {stop.contact_name}
                                                        {stop.contact_phone && ` (${stop.contact_phone})`}
                                                    </p>
                                                )}
                                                {stop.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stop.notes}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                                    <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Service Details
                                </h3>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Service Provider</p>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{booking.provider_name || 'Not assigned yet'}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Insurance</p>
                                            <p className="text-sm font-medium">
                                                {booking.has_insurance ? (
                                                    <span className="text-green-600 dark:text-green-400 flex items-center">
                                                        <FontAwesomeIcon icon={faShieldAlt} className="mr-1" /> Protected
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 dark:text-gray-400">No insurance</span>
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Moving Date</p>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{booking.time}</p>
                                        </div>

                                        {booking.status === 'pending' && !booking.is_paid && (
                                            <div className="col-span-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
                                                <p className="text-sm text-red-700 dark:text-red-400 flex items-center">
                                                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                                    Payment required by {booking.payment_due} to confirm this booking.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {booking.notes && (
                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{booking.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faBell} className="mr-2 text-blue-500 dark:text-blue-400" />
                                Tracking Updates
                            </h3>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700/50">
                                {booking.tracking_updates && booking.tracking_updates.length > 0 ? (
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 h-full w-px bg-blue-100 dark:bg-blue-900"></div>
                                        {booking.tracking_updates.map((update, index) => (
                                            <div key={index} className="ml-9 mb-4 relative pb-1 group/item">
                                                <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{update.timestamp}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{update.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No tracking updates available</p>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                                    <FontAwesomeIcon icon={faClipboardCheck} className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Actions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {getPrimaryActionButton(booking, navigate)}
                                    {getSecondaryActionButton(booking, navigate)}
                                    {booking.status === 'pending' && (
                                        <button className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-750 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
    );
};
