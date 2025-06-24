import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faCheckCircle, faBookmark, faEye, faRoute } from '@fortawesome/free-solid-svg-icons';
import JobDetailsTab from '../../components/Provider/JobDetailTabs/JobDetailsTab';
import RouteTab from '../../components/Provider/JobDetailTabs/RouteTab';
import ItemsTab from '../../components/Provider/JobDetailTabs/ItemsTab';
import TimelineTab from '../../components/Provider/JobDetailTabs/TimelineTab';
import DocumentsTab from '../../components/Provider/JobDetailTabs/DocumentsTab';
import ChatTab from '../../components/Provider/JobDetailTabs/ChatTab';
import JobBidding from '../../components/Provider/JobBidding';
import JobMap from '../../components/Provider/JobMap';
import { Job } from '../../types/job';
import axiosInstance from '../../helper/axiosInstance';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('details');
    const authUser = useAuthUser();

    const {
        data: job,
        error,
        isLoading,
    } = useSWR<Job>(id ? `/jobs/${id}/` : null, async (url: string) => {
        const response = await axiosInstance.get(url);
        console.log('job', response.data);
        return response.data;
    });

    const handleSendMessage = async (message: string, attachments?: File[]) => {
        if (!job) return;

        try {
            const formData = new FormData();
            formData.append('message', message);
            if (attachments) {
                attachments.forEach((file) => {
                    formData.append('attachments', file);
                });
            }

            const response = await axiosInstance.post(`/jobs/${job.id}/messages/`, formData);
            const newMessage = response.data;

            // Note: In a real application, you would want to invalidate the SWR cache
            // to trigger a re-fetch of the job data. This is just a temporary solution.
            if (job.chat_messages) {
                job.chat_messages.push(newMessage);
            } else {
                job.chat_messages = [newMessage];
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleAcceptJob = async () => {
        if (!job) return;

        try {
            const response = await axiosInstance.post(`/jobs/${job.id}/accept/`, {
                provider_id: authUser?.id,
            });
            if (response.status === 200) {
                showMessage('success', 'Job accepted successfully');
            }
            console.log('Job accepted:', response.data);
        } catch (err) {
            console.error('Error accepting job:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-700/30">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-red-50/80 dark:bg-red-900/30 rounded-3xl p-12 shadow-2xl border-2 border-red-200/50 dark:border-red-700/50">
                        <div className="text-red-600 dark:text-red-400 text-xl font-semibold text-center">{error.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-700/30">
                        <div className="text-slate-600 dark:text-slate-400 text-xl font-semibold text-center">Job not found</div>
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

            {/* Enhanced Header */}
            <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 shadow-2xl border-b border-white/20 dark:border-slate-700/30">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-slate-700/80 
                                         text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 
                                         hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 backdrop-blur-sm
                                         border border-slate-200/50 dark:border-slate-600/50 hover:border-orange-300 dark:hover:border-orange-600"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job #{job.request.tracking_number}</h1>
                                <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">{job.request.service_type}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-4 py-2 rounded-2xl text-lg font-bold backdrop-blur-sm border-2 ${
                                    job.status === 'completed'
                                        ? 'bg-green-100/80 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700'
                                        : job.status === 'cancelled'
                                        ? 'bg-red-100/80 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700'
                                        : 'bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700'
                                }`}
                            >
                                {job.status.replace(/_/g, ' ')}
                            </span>
                            <button
                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-slate-700/80 
                                           text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 
                                           hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 backdrop-blur-sm
                                           border border-slate-200/50 dark:border-slate-600/50 hover:border-orange-300 dark:hover:border-orange-600"
                            >
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Enhanced Tabs */}
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
                            <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30">
                                <nav className="flex -mb-px overflow-x-auto">
                                    {[
                                        { id: 'details', label: 'Details' },
                                        { id: 'route', label: 'Route' },
                                        { id: 'items', label: 'Items' },
                                        { id: 'timeline', label: 'Timeline' },
                                        { id: 'documents', label: 'Documents' },
                                        { id: 'chat', label: 'Chat' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-4 text-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? 'border-b-4 border-orange-500 text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-slate-700/50'
                                                    : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/30'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab content */}
                            <div className="p-8">
                                {activeTab === 'details' && (
                                    <div className="space-y-8">
                                        {/* Core Job Details */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Job Information */}
                                            <div className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                    Job Information
                                                </h3>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Service Type:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.service_type}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Request Type:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold capitalize">{job.request.request_type}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Priority:</span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                job.request.priority === 'high'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                    : job.request.priority === 'normal'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {job.request.priority?.toUpperCase() || 'NORMAL'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Base Price:</span>
                                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">£{job.request.base_price}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Distance:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.estimated_distance || 0} miles</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Insurance:</span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                job.request.insurance_required
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {job.request.insurance_required ? 'REQUIRED' : 'NOT REQUIRED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Information */}
                                            <div className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Customer Details
                                                </h3>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Name:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.contact_name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Phone:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.contact_phone}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Email:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold text-sm">{job.request.contact_email}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Pickup Date:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.preferred_pickup_date || 'TBD'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Pickup Time:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.preferred_pickup_time || 'TBD'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Description */}
                                        <div className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                Job Description
                                            </h3>

                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/30 dark:border-slate-700/30">
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{job.request.notes || 'No description provided.'}</p>
                                            </div>

                                            {job.request.special_instructions && (
                                                <div className="mt-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Special Instructions:</h4>
                                                    <p className="text-slate-700 dark:text-slate-300">{job.request.special_instructions}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'route' && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                                            Route Information
                                        </h3>

                                        <div className="space-y-4">
                                            {job.request.all_locations?.map((location, index) => (
                                                <div
                                                    key={location.id || index}
                                                    className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${
                                                                location.type === 'pickup' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                        location.type === 'pickup'
                                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    }`}
                                                                >
                                                                    {location.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}
                                                                </span>
                                                                <span className="text-xl font-bold text-slate-900 dark:text-white">{location.address}</span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                {location.unit_number && (
                                                                    <div>
                                                                        <span className="text-slate-500 dark:text-slate-400">Unit:</span>
                                                                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">{location.unit_number}</span>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Floor:</span>
                                                                    <span className="ml-2 font-semibold text-slate-900 dark:text-white">{(location as any).floor || 'Ground'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Elevator:</span>
                                                                    <span
                                                                        className={`ml-2 font-semibold ${
                                                                            (location as any).has_elevator ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                                        }`}
                                                                    >
                                                                        {(location as any).has_elevator ? 'Available' : 'Not Available'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Property:</span>
                                                                    <span className="ml-2 font-semibold text-slate-900 dark:text-white capitalize">
                                                                        {(location as any).property_type || 'Standard'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {location.instructions && (
                                                                <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Instructions: </span>
                                                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{location.instructions}</span>
                                                                </div>
                                                            )}

                                                            {(location as any).parking_info && (
                                                                <div className="mt-2 p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
                                                                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">Parking: </span>
                                                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{(location as any).parking_info}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'items' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                                Cargo Details
                                            </h3>
                                            <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                                                {(job.request.moving_items || []).length} Items •{' '}
                                                {(job.request.moving_items || []).reduce((sum, item) => {
                                                    const weight = typeof item.weight === 'string' ? parseFloat(item.weight) || 0 : item.weight || 0;
                                                    return sum + weight;
                                                }, 0)}{' '}
                                                lbs Total
                                            </div>
                                        </div>

                                        {job.request.moving_items && job.request.moving_items.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {job.request.moving_items.map((item, index) => (
                                                    <div
                                                        key={item.id || index}
                                                        className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                                                {item.notes && <p className="text-slate-600 dark:text-slate-400 mt-1">{item.notes}</p>}
                                                            </div>
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-bold">
                                                                ×{item.quantity}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Weight</span>
                                                                <p className="font-bold text-slate-900 dark:text-white text-lg">{item.weight} lbs</p>
                                                            </div>
                                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Value</span>
                                                                <p className="font-bold text-green-600 dark:text-green-400 text-lg">£{item.declared_value || 'N/A'}</p>
                                                            </div>
                                                            <div className="col-span-2 bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Dimensions</span>
                                                                <p className="font-bold text-slate-900 dark:text-white">{item.dimensions}</p>
                                                            </div>
                                                        </div>

                                                        {(item.fragile || item.needs_disassembly) && (
                                                            <div className="flex gap-2">
                                                                {item.fragile && (
                                                                    <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full font-semibold">
                                                                        FRAGILE
                                                                    </span>
                                                                )}
                                                                {item.needs_disassembly && (
                                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full font-semibold">
                                                                        DISASSEMBLY REQUIRED
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Journey type request - No moving items */
                                            <div className="text-center py-16">
                                                <div className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/50 rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/30 max-w-md mx-auto">
                                                    <div className="w-20 h-20 bg-slate-200/80 dark:bg-slate-700/80 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                        <FontAwesomeIcon icon={faRoute} className="text-4xl text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Journey Type Request</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        This is a journey-type request focusing on route and transportation rather than specific items. Please check the Route tab for detailed location
                                                        information.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'timeline' && <TimelineTab job={job} userType="provider" />}
                                {activeTab === 'documents' && <DocumentsTab job={job} />}
                                {activeTab === 'chat' && <ChatTab job={job} onSendMessage={handleSendMessage} />}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-8">
                        {/* Job Map */}
                        <JobMap job={job} height="400px" />

                        {/* Enhanced Bidding section */}
                        {job.request.request_type === 'auction' && (
                            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
                                <JobBidding
                                    job={job}
                                    onBidSubmit={(bid) => {
                                        // Note: In a real application, you would want to use SWR's mutate
                                        // to update the cache or trigger a re-fetch
                                        if (job.bids) {
                                            job.bids.push(bid);
                                        } else {
                                            job.bids = [bid];
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {/* Enhanced Action buttons for all job types */}
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                                    Job Actions
                                </h2>

                                {job.request.request_type === 'instant' ? (
                                    /* Instant job actions */
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => {
                                                console.log('Accepting job:', job.id);
                                            }}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                                     text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 
                                                     transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 
                                                     hover:scale-105 border-2 border-green-400/50"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                                            Accept Job - £{job.request.base_price}
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => {
                                                    console.log('Saving job:', job.id);
                                                }}
                                                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                                         text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                         transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 
                                                         hover:scale-105 border-2 border-blue-400/50"
                                            >
                                                <FontAwesomeIcon icon={faBookmark} />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    console.log('Watching job:', job.id);
                                                }}
                                                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                                         text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                         transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 
                                                         hover:scale-105 border-2 border-purple-400/50"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                                Watch
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Auction and journey job actions */
                                    <div className="space-y-4">
                                        <div className="text-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{job.request.request_type === 'auction' ? 'Auction Job' : 'Journey Request'}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {job.request.request_type === 'auction' ? 'Submit your bid to compete for this job' : 'Multi-stop journey opportunity'}
                                            </p>
                                            {job.request.request_type === 'auction' && job.bidding_end_time && (
                                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-2">Bidding ends: {new Date(job.bidding_end_time).toLocaleDateString()}</p>
                                            )}
                                        </div>

                                        {job.request.request_type === 'journey' ? (
                                            /* Journey request actions - can be accepted */
                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => {
                                                        console.log('Accepting journey job:', job.id);
                                                    }}
                                                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                                             text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 
                                                             transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 
                                                             hover:scale-105 border-2 border-green-400/50"
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                                                    Accept Journey - £{job.request.base_price}
                                                </button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => {
                                                            console.log('Saving job:', job.id);
                                                        }}
                                                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                                 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 
                                                                 hover:scale-105 border-2 border-blue-400/50"
                                                    >
                                                        <FontAwesomeIcon icon={faBookmark} />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log('Watching job:', job.id);
                                                        }}
                                                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                                                 text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                                 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 
                                                                 hover:scale-105 border-2 border-purple-400/50"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                        Watch
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Auction job actions - bidding only */
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        console.log('Saving job:', job.id);
                                                    }}
                                                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                                             text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                             transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 
                                                             hover:scale-105 border-2 border-blue-400/50"
                                                >
                                                    <FontAwesomeIcon icon={faBookmark} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        console.log('Watching job:', job.id);
                                                    }}
                                                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                                             text-white font-bold rounded-xl flex items-center justify-center gap-2 
                                                             transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 
                                                             hover:scale-105 border-2 border-purple-400/50"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                    Watch
                                                </button>
                                            </div>
                                        )}
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

export default JobDetail;
