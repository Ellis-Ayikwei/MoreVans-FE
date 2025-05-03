import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faGavel, faRoute, faBookmark, faLocationDot, faCalendarAlt, faClock, faUser, faStar, faBox } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../types';

interface JobBoardListProps {
    jobs: Job[];
    savedJobs: string[];
    onJobClick: (job: Job) => void;
    onSaveJob: (jobId: string, event: React.MouseEvent) => void;
}

const JobBoardList: React.FC<JobBoardListProps> = ({ jobs, savedJobs, onJobClick, onSaveJob }) => {
    const getJobTypeIcon = (type: string) => {
        switch (type) {
            case 'instant':
                return <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />;
            case 'auction':
                return <FontAwesomeIcon icon={faGavel} className="text-purple-500" />;
            case 'journey':
                return <FontAwesomeIcon icon={faRoute} className="text-blue-500" />;
            default:
                return null;
        }
    };

    const getUrgencyBadge = (urgency?: string) => {
        if (!urgency) return null;

        switch (urgency) {
            case 'high':
                return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>;
            case 'medium':
                return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>;
            case 'low':
                return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Flexible</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => onJobClick(job)}
                >
                    <div className="flex flex-col md:flex-row">
                        <div
                            className={`md:w-16 p-4 flex md:flex-col items-center justify-center ${
                                job.request?.request_type === 'instant'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                    : job.request?.request_type === 'auction'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}
                        >
                            <div className="text-2xl mb-2">{getJobTypeIcon(job.request?.request_type || '')}</div>
                            <span className="text-xs font-medium uppercase rotate-90 md:rotate-0">{job.request?.request_type || ''}</span>
                        </div>

                        <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900 dark:text-white mr-3">
                                            {job.request?.service_type?.charAt(0).toUpperCase() + job.request?.service_type?.slice(1) || 'Unknown Service'}
                                            {job.request?.total_weight && ` • ${job.request.total_weight} kg`}
                                        </h3>
                                        {job.request?.priority && getUrgencyBadge(job.request.priority)}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Job #{job.id} • Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                                    </p>
                                </div>

                                <div className="mt-2 md:mt-0 flex items-center">
                                    <div className="mr-4">
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">${job.request?.base_price || '0.00'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{job.request?.request_type === 'auction' ? 'Starting Bid' : 'Base Price'}</div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSaveJob(job.id, e);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                                    >
                                        <FontAwesomeIcon icon={faBookmark} className={`${savedJobs.includes(job.id) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    {job.request?.request_type !== 'journey' ? (
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mt-1 mr-2 w-4" />
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {job.request?.all_locations?.find((loc) => loc.type === 'pickup')?.address || 'Location not specified'}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-5 ml-2"></div>
                                            </div>
                                            <div className="flex items-start">
                                                <FontAwesomeIcon icon={faLocationDot} className="text-green-500 mt-1 mr-2 w-4" />
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {job.request?.all_locations?.find((loc) => loc.type === 'dropoff')?.address || 'Location not specified'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                                <FontAwesomeIcon icon={faRoute} className="mr-2" />
                                                Multi-stop Journey • {job.request?.journey_stops?.length || 0} stops
                                            </div>
                                            <div className="space-y-4 max-h-32 overflow-y-auto pr-2">
                                                {job.request?.journey_stops?.map((stop, index) => (
                                                    <div key={index} className="space-y-1">
                                                        <div className="flex items-start">
                                                            <div className="flex flex-col items-center mr-2">
                                                                <div
                                                                    className={`w-5 h-5 rounded-full ${
                                                                        stop.type === 'pickup'
                                                                            ? 'bg-blue-600 dark:bg-blue-500'
                                                                            : stop.type === 'dropoff'
                                                                            ? 'bg-green-600 dark:bg-green-500'
                                                                            : 'bg-orange-600 dark:bg-orange-500'
                                                                    } flex items-center justify-center text-white text-xs`}
                                                                >
                                                                    {String.fromCharCode(65 + index)}
                                                                </div>
                                                                {index < (job.request?.journey_stops?.length || 0) - 1 && (
                                                                    <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-8"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {stop.type === 'pickup' ? 'Pickup' : stop.type === 'dropoff' ? 'Dropoff' : 'Stop'}
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-300">{stop.address || 'Location not specified'}</div>
                                                                {stop.items && stop.items.length > 0 && (
                                                                    <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full inline-block">
                                                                        {stop.items.length} {stop.items.length === 1 ? 'item' : 'items'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {job.request?.preferred_pickup_date
                                                ? new Date(job.request.preferred_pickup_date).toLocaleDateString(undefined, {
                                                      weekday: 'short',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : 'Flexible'}{' '}
                                            • {job.request?.preferred_pickup_time || 'Flexible'}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faRoute} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{job.request?.estimated_distance || 'N/A'} miles away</span>
                                    </div>

                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{job.request?.contact_name || 'Unknown Customer'}</span>
                                            {job.request?.contact_phone && (
                                                <div className="flex items-center ml-2">
                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs mr-1" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{job.request.contact_phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={`w-full mt-4 px-4 py-2 rounded-lg text-white font-medium text-sm ${
                                    job.request?.request_type === 'instant'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : job.request?.request_type === 'auction'
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {job.request?.request_type === 'auction' ? 'Place Bid' : job.request?.request_type === 'instant' ? 'Book Now' : 'View Journey'}
                            </button>

                            {job.request?.request_type === 'instant' && job.time_remaining && (
                                <div className="text-xs text-center mt-2">
                                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                                        Expires in {job.time_remaining}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobBoardList;
