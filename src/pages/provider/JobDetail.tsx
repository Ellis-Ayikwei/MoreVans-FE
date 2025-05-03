import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faCheckCircle, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons';
import JobDetailsTab from '../../components/Provider/JobDetailTabs/JobDetailsTab';
import RouteTab from '../../components/Provider/JobDetailTabs/RouteTab';
import ItemsTab from '../../components/Provider/JobDetailTabs/ItemsTab';
import TimelineTab from '../../components/Provider/JobDetailTabs/TimelineTab';
import DocumentsTab from '../../components/Provider/JobDetailTabs/DocumentsTab';
import ChatTab from '../../components/Provider/JobDetailTabs/ChatTab';
import JobBidding from '../../components/Provider/JobBidding';
import { Job } from '../../types/job';
import axiosInstance from '../../helper/axiosInstance';
import useSWR from 'swr';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('details');

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error.message}</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Job not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job #{job.request.tracking_number}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    job.status === 'completed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                        : job.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                }`}
                            >
                                {job.status.replace(/_/g, ' ')}
                            </span>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex -mb-px">
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
                                            className={`px-4 py-3 text-sm font-medium ${
                                                activeTab === tab.id
                                                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab content */}
                            <div className="p-6">
                                {activeTab === 'details' && <JobDetailsTab job={job} />}
                                {activeTab === 'route' && <RouteTab job={job} />}
                                {activeTab === 'items' && <ItemsTab job={job} />}
                                {activeTab === 'timeline' && <TimelineTab job={job} userType="provider" />}
                                {activeTab === 'documents' && <DocumentsTab job={job} />}
                                {activeTab === 'chat' && <ChatTab job={job} onSendMessage={handleSendMessage} />}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-8">
                        {/* Bidding section */}
                        {job.request.request_type === 'auction' && (
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
                        )}

                        {/* Action buttons for instant jobs */}
                        {job.request.request_type === 'instant' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Actions</h2>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                // Handle accept job
                                                console.log('Accepting job:', job.id);
                                            }}
                                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            Accept Job
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Handle save job
                                                console.log('Saving job:', job.id);
                                            }}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                                            Save Job
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Handle watch job
                                                console.log('Watching job:', job.id);
                                            }}
                                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                                            Watch Job
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Job summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Summary</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Job Type</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{job.request.request_type.replace(/_/g, ' ')}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{new Date(job.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.request.moving_items.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Distance</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.request.estimated_distance || 0} miles</div>
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

export default JobDetail;
