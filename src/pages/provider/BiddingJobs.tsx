import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import JobCard from '../../components/JobCard';
import { Job } from '../../types/job';

const BiddingJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Mock data - replace with actual API calls
    const jobs = {
        active_bids: [
            {
                id: '1',
                status: 'bidding',
                created_at: '2024-03-20T10:00:00Z',
                updated_at: '2024-03-20T10:00:00Z',
                request: {
                    id: 'REQ-001',
                    user: 'user1',
                    driver: null,
                    request_type: 'auction',
                    status: 'open',
                    priority: 'high',
                    service_type: 'Moving',
                    contact_name: 'John Doe',
                    contact_phone: '1234567890',
                    contact_email: 'john@example.com',
                    tracking_number: 'JOB-001',
                    base_price: 150.0,
                    payment_status: 'pending',
                    insurance_required: false,
                    estimated_distance: 10,
                    moving_items: [
                        {
                            id: '1',
                            name: 'Furniture',
                            quantity: 1,
                            dimensions: 'Large',
                            weight: '50kg',
                            category_id: 'furniture',
                        },
                    ],
                    all_locations: [
                        {
                            id: '1',
                            type: 'pickup',
                            address: '123 Main St',
                            preferred_pickup_time: '09:00 AM',
                        },
                        {
                            id: '2',
                            type: 'dropoff',
                            address: '456 Oak Ave',
                            preferred_delivery_time: '11:00 AM',
                        },
                    ],
                    preferred_pickup_date: '2024-03-20',
                    preferred_pickup_time: '09:00 AM',
                },
                bidding_end_time: '2024-03-21T10:00:00Z',
                bids: [
                    {
                        id: '1',
                        provider: 'provider1',
                        amount: 120.0,
                        message: 'I can handle this job efficiently',
                        createdAt: '2024-03-20T11:00:00Z',
                        status: 'pending',
                    },
                ],
            },
        ],
        past_bids: [],
    };

    const tabs = [
        { name: 'Active Bids', key: 'active_bids', count: jobs.active_bids.length },
        { name: 'Past Bids', key: 'past_bids', count: jobs.past_bids.length },
    ];

    const handleJobClick = (job: Job) => {
        // Handle job click - navigate to job details
        console.log('Job clicked:', job);
    };

    const handlePlaceBid = (jobId: string) => {
        // Handle place bid action
        console.log('Place bid for job:', jobId);
    };

    const handleWithdrawBid = (jobId: string) => {
        // Handle withdraw bid action
        console.log('Withdraw bid for job:', jobId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bidding Jobs</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your active and past bids</p>
            </div>

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.key}
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected ? 'bg-white dark:bg-gray-700 text-primary shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary'}`
                            }
                        >
                            <div className="flex items-center justify-center">
                                <span>{tab.name}</span>
                                {tab.count > 0 && <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">{tab.count}</span>}
                            </div>
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels className="mt-6">
                    {tabs.map((tab) => (
                        <Tab.Panel key={tab.key} className="rounded-xl bg-white dark:bg-gray-800 p-6">
                            {jobs[tab.key as keyof typeof jobs].length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs[tab.key as keyof typeof jobs].map((job) => (
                                        <div key={job.id} className="relative">
                                            <div className="absolute top-2 right-2 flex space-x-2">
                                                {tab.key === 'active_bids' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handlePlaceBid(job.id)}
                                                            className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark"
                                                        >
                                                            Place Bid
                                                        </button>
                                                        <button onClick={() => handleWithdrawBid(job.id)} className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">{job.bids[0]?.status === 'accepted' ? 'Won' : 'Lost'}</div>
                                                )}
                                            </div>
                                            <JobCard job={job} onClick={handleJobClick} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 dark:text-gray-400">No {tab.name.toLowerCase()} at the moment</div>
                                </div>
                            )}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default BiddingJobs;
