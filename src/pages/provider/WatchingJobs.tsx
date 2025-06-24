import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconEye,
    IconBookmark,
    IconHeart,
    IconClock,
    IconTruck,
    IconRoute,
    IconMapPin,
    IconCalendar,
    IconCurrencyPound,
    IconPhone,
    IconMail,
    IconBox,
    IconArrowRight,
    IconTrash,
    IconPlus,
    IconBell,
    IconStar,
    IconUsers,
    IconTarget,
    IconTrendingUp,
    IconShieldCheck,
    IconLoader,
    IconBookmarkPlus,
    IconEyePlus,
} from '@tabler/icons-react';
import { Job } from '../../types/job';
import useSWR from 'swr';
import axiosInstance from '../../helper/axiosInstance';

const WatchingJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('watching');
    const navigate = useNavigate();

    // Fetch provider's watched jobs
    const {
        data: jobsData,
        error,
        isLoading,
    } = useSWR('/provider/watching-jobs/', async (url: string) => {
        const response = await axiosInstance.get(url);
        return response.data;
    });

    // Mock data for now - replace with real data when backend is ready
    const mockJobs = {
        watching: [
            {
                id: '1',
                status: 'watching',
                watch_created_at: '2024-01-16T09:00:00Z',
                created_at: '2024-01-15T10:00:00Z',
                request: {
                    tracking_number: 'MV-2024-007',
                    request_type: 'auction',
                    service_type: 'Electronics Moving',
                    priority: 'high',
                    base_price: 420,
                    contact_name: 'Alice Thompson',
                    contact_phone: '+44 7700 900111',
                    contact_email: 'alice.thompson@tech.com',
                    estimated_distance: 18,
                    preferred_pickup_date: '2024-01-22',
                    preferred_pickup_time: '11:00',
                    insurance_required: true,
                    moving_items: [
                        { id: '1', name: 'Gaming Setup', quantity: 1, weight: '35kg' },
                        { id: '2', name: 'Office Equipment', quantity: 4, weight: '80kg' },
                    ],
                    all_locations: [
                        { id: '1', type: 'pickup', address: '456 Tech Hub, Bristol BS1 6NA' },
                        { id: '2', type: 'dropoff', address: '789 Innovation Park, Reading RG6 1AZ' },
                    ],
                },
                bidding_end_time: '2024-01-21T16:00:00Z',
                current_lowest_bid: 390,
                total_bids: 7,
                watch_reason: 'competitive_pricing',
            },
            {
                id: '2',
                status: 'watching',
                watch_created_at: '2024-01-15T14:30:00Z',
                created_at: '2024-01-14T08:00:00Z',
                request: {
                    tracking_number: 'MV-2024-008',
                    request_type: 'instant',
                    service_type: 'Furniture Delivery',
                    priority: 'normal',
                    base_price: 280,
                    contact_name: 'Mark Davis',
                    contact_phone: '+44 7700 900222',
                    contact_email: 'mark.davis@home.co.uk',
                    estimated_distance: 12,
                    preferred_pickup_date: '2024-01-20',
                    preferred_pickup_time: '13:00',
                    insurance_required: false,
                    moving_items: [
                        { id: '3', name: 'Sofa Set', quantity: 1, weight: '85kg' },
                        { id: '4', name: 'Coffee Table', quantity: 1, weight: '25kg' },
                    ],
                    all_locations: [
                        { id: '3', type: 'pickup', address: '123 Furniture Store, Birmingham B3 2TA' },
                        { id: '4', type: 'dropoff', address: '654 Residential Close, Wolverhampton WV1 1AA' },
                    ],
                },
                watch_reason: 'good_route',
            },
        ],
        saved: [
            {
                id: '3',
                status: 'saved',
                save_created_at: '2024-01-12T16:45:00Z',
                created_at: '2024-01-10T12:00:00Z',
                request: {
                    tracking_number: 'MV-2024-009',
                    request_type: 'journey',
                    service_type: 'Multi-Stop Collection',
                    priority: 'normal',
                    base_price: 350,
                    contact_name: 'Sophie Wilson',
                    contact_phone: '+44 7700 900333',
                    contact_email: 'sophie.wilson@logistics.com',
                    estimated_distance: 28,
                    preferred_pickup_date: '2024-01-18',
                    preferred_pickup_time: '08:00',
                    insurance_required: true,
                    moving_items: [{ id: '5', name: 'Business Equipment', quantity: 6, weight: '150kg' }],
                    all_locations: [
                        { id: '5', type: 'pickup', address: '321 Business District, Newcastle NE1 4ST' },
                        { id: '6', type: 'stop', address: '987 Commerce Ave, Sunderland SR1 3HZ' },
                        { id: '7', type: 'dropoff', address: '147 Industrial Estate, Middlesbrough TS1 2JK' },
                    ],
                },
                save_reason: 'future_reference',
            },
        ],
    };

    const jobs = jobsData || mockJobs;

    const tabs = [
        {
            id: 'watching',
            name: 'Watching',
            count: jobs.watching?.length || 0,
            icon: IconEye,
            color: 'text-blue-500',
        },
        {
            id: 'saved',
            name: 'Saved',
            count: jobs.saved?.length || 0,
            icon: IconBookmark,
            color: 'text-green-500',
        },
    ];

    const getTimeLeft = (endTime: string) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h left`;
        }

        return `${hours}h ${minutes}m left`;
    };

    const getWatchReasonText = (reason: string) => {
        switch (reason) {
            case 'competitive_pricing':
                return 'Competitive pricing';
            case 'good_route':
                return 'Good route match';
            case 'preferred_customer':
                return 'Preferred customer';
            case 'future_reference':
                return 'Future reference';
            default:
                return 'Interested';
        }
    };

    const getWatchReasonColor = (reason: string) => {
        switch (reason) {
            case 'competitive_pricing':
                return 'text-green-600 dark:text-green-400';
            case 'good_route':
                return 'text-blue-600 dark:text-blue-400';
            case 'preferred_customer':
                return 'text-purple-600 dark:text-purple-400';
            case 'future_reference':
                return 'text-orange-600 dark:text-orange-400';
            default:
                return 'text-slate-600 dark:text-slate-400';
        }
    };

    const getWatchReasonIcon = (reason: string) => {
        switch (reason) {
            case 'competitive_pricing':
                return IconTrendingUp;
            case 'good_route':
                return IconRoute;
            case 'preferred_customer':
                return IconStar;
            case 'future_reference':
                return IconBookmark;
            default:
                return IconTarget;
        }
    };

    const handleUnwatch = (jobId: string) => {
        console.log('Unwatch job:', jobId);
        // API call to unwatch job
    };

    const handleUnsave = (jobId: string) => {
        console.log('Unsave job:', jobId);
        // API call to unsave job
    };

    const handleMoveToSaved = (jobId: string) => {
        console.log('Move to saved:', jobId);
        // API call to move from watching to saved
    };

    const handleMoveToWatching = (jobId: string) => {
        console.log('Move to watching:', jobId);
        // API call to move from saved to watching
    };

    const JobCard: React.FC<{ job: any }> = ({ job }) => {
        const timeLeft = job.bidding_end_time ? getTimeLeft(job.bidding_end_time) : null;
        const isWatching = activeTab === 'watching';
        const ReasonIcon = getWatchReasonIcon(job.watch_reason || job.save_reason);

        return (
            <div className="group backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/40 overflow-hidden hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600/50">
                {/* Enhanced Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-50/80 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-900/30 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">#{job.request.tracking_number}</h3>
                                {job.request.priority === 'high' && <IconShieldCheck className="w-5 h-5 text-red-500" />}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2">
                                <IconTruck className="w-4 h-4" />
                                {job.request.service_type}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-md ${
                                    isWatching ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}
                            >
                                {isWatching ? <IconEye className="w-4 h-4" /> : <IconBookmark className="w-4 h-4" />}
                                {isWatching ? 'WATCHING' : 'SAVED'}
                            </span>
                            {timeLeft && isWatching && (
                                <span
                                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                                        timeLeft.includes('left')
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                                    }`}
                                >
                                    <IconClock className="w-3 h-3" />
                                    {timeLeft}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-6 space-y-5">
                    {/* Price and Route Info */}
                    <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <IconCurrencyPound className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{job.request.base_price}</p>
                                {job.request.request_type === 'auction' && <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">starting price</p>}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                <IconRoute className="w-4 h-4" />
                                <span className="font-bold text-lg">{job.request.estimated_distance}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">miles</p>
                        </div>
                    </div>

                    {/* Watch/Save Reason */}
                    <div
                        className={`bg-gradient-to-r rounded-2xl p-4 border ${
                            isWatching
                                ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/30'
                                : 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30'
                        }`}
                    >
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <div className={`p-1 rounded-lg ${isWatching ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                <ReasonIcon className={`w-4 h-4 ${isWatching ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
                            </div>
                            {isWatching ? 'Watch Reason' : 'Save Reason'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Reason</p>
                                <p className={`font-semibold ${getWatchReasonColor(job.watch_reason || job.save_reason)}`}>{getWatchReasonText(job.watch_reason || job.save_reason)}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{isWatching ? 'Watching since' : 'Saved on'}</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300">{new Date(job.watch_created_at || job.save_created_at).toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>
                        {isWatching && job.total_bids && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Bids</p>
                                    <p className="font-bold text-orange-600 dark:text-orange-400">{job.total_bids} bids</p>
                                </div>
                                {job.current_lowest_bid && (
                                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Lowest Bid</p>
                                        <p className="font-bold text-red-600 dark:text-red-400">£{job.current_lowest_bid}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/30">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <IconStar className="w-4 h-4 text-purple-500" />
                            Customer Details
                        </h4>
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{job.request.contact_name}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1">
                                    <IconPhone className="w-3 h-3" />
                                    {job.request.contact_phone}
                                </span>
                                <span className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1">
                                    <IconMail className="w-3 h-3" />
                                    {job.request.contact_email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-orange-50/50 dark:bg-orange-900/20 rounded-xl p-3">
                        <IconCalendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">Pickup Schedule</p>
                            <p className="text-sm">
                                {job.request.preferred_pickup_date} at {job.request.preferred_pickup_time}
                            </p>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-3">
                        {job.request.all_locations?.slice(0, 2).map((location: any, index: number) => (
                            <div key={location.id} className="flex items-start gap-3 text-sm bg-white/30 dark:bg-slate-800/30 rounded-xl p-3">
                                <IconMapPin
                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${location.type === 'pickup' ? 'text-blue-500' : location.type === 'dropoff' ? 'text-green-500' : 'text-orange-500'}`}
                                />
                                <div className="min-w-0">
                                    <span
                                        className={`font-semibold text-sm ${
                                            location.type === 'pickup'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : location.type === 'dropoff'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-orange-600 dark:text-orange-400'
                                        }`}
                                    >
                                        {location.type === 'pickup' ? 'Pickup:' : location.type === 'dropoff' ? 'Delivery:' : 'Stop:'}
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{location.address}</p>
                                </div>
                            </div>
                        ))}
                        {job.request.all_locations && job.request.all_locations.length > 2 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 ml-6">+{job.request.all_locations.length - 2} more stops</p>
                        )}
                    </div>

                    {/* Items Summary */}
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl p-3">
                        <IconBox className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">
                            {job.request.moving_items?.length || 0} items • Total weight:{' '}
                            {job.request.moving_items?.reduce((sum: number, item: any) => {
                                const weight = parseFloat(item.weight?.replace('kg', '') || '0');
                                return sum + weight;
                            }, 0)}
                            kg
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => navigate(`/provider/jobs/${job.id}`)}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                                     text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                     transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 
                                     hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <IconEye className="w-4 h-4" />
                            View Details
                            <IconArrowRight className="w-4 h-4" />
                        </button>

                        {/* Enhanced Action buttons based on tab */}
                        <div className="flex gap-2">
                            {isWatching ? (
                                <>
                                    <button
                                        onClick={() => handleMoveToSaved(job.id)}
                                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 
                                                 hover:scale-[1.02] active:scale-[0.98]"
                                        title="Save for later"
                                    >
                                        <IconBookmarkPlus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleUnwatch(job.id)}
                                        className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 
                                                 hover:scale-[1.02] active:scale-[0.98]"
                                        title="Stop watching"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleMoveToWatching(job.id)}
                                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 
                                                 hover:scale-[1.02] active:scale-[0.98]"
                                        title="Start watching"
                                    >
                                        <IconEyePlus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleUnsave(job.id)}
                                        className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 
                                                 hover:scale-[1.02] active:scale-[0.98]"
                                        title="Remove from saved"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-700/30">
                            <IconLoader className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                            <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">Loading your watchlist...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 transition-all duration-300">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>

            <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                            <IconHeart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Watching Jobs</h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">Keep track of interesting jobs and save them for later</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/30">
                            <div className="flex items-center gap-3">
                                <IconEye className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{jobs.watching?.length || 0}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Currently Watching</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/30">
                            <div className="flex items-center gap-3">
                                <IconBookmark className="w-6 h-6 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{jobs.saved?.length || 0}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Saved Jobs</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/30">
                            <div className="flex items-center gap-3">
                                <IconBell className="w-6 h-6 text-orange-500" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{jobs.watching?.filter((job: any) => job.bidding_end_time).length || 0}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Active Auctions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Tabs */}
                <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden mb-8">
                    <div className="flex border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-b-4 border-orange-500 text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-slate-700/50'
                                        : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/30'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <tab.icon className={`w-5 h-5 ${tab.color}`} />
                                    <span>{tab.name}</span>
                                    {tab.count > 0 && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-sm font-bold">{tab.count}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs[activeTab as keyof typeof jobs]?.length > 0 ? (
                        jobs[activeTab as keyof typeof jobs].map((job: any) => <JobCard key={job.id} job={job} />)
                    ) : (
                        <div className="col-span-full">
                            <div className="text-center py-16">
                                <div className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/50 rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/30 max-w-md mx-auto">
                                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl w-fit mx-auto mb-6">
                                        {activeTab === 'watching' ? (
                                            <IconEye className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        ) : (
                                            <IconBookmark className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No {tabs.find((t) => t.id === activeTab)?.name} Jobs</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {activeTab === 'watching' && "You're not watching any jobs yet. Start watching jobs from the job board to keep track of them here."}
                                        {activeTab === 'saved' && "You haven't saved any jobs yet. Save interesting jobs for future reference."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchingJobs;
