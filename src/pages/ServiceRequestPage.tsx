import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ServiceRequestList from '../components/ServiceRequest/ServiceRequestList';
import { ServiceRequest } from '../types';
import { ServiceRequestDetail } from '../components/ServiceRequest/ServiceRequestDetail';

const ServiceRequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    const handleCreateRequest = () => {
        navigate('/service-requests/new');
    };

    const handleSelectRequest = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setSelectedRequest(null);
        setViewMode('list');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{viewMode === 'list' ? 'Service Requests' : 'Request Details'}</h1>
                {viewMode === 'list' && (
                    <button
                        onClick={handleCreateRequest}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        New Request
                    </button>
                )}
                {viewMode === 'detail' && (
                    <button
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Back to List
                    </button>
                )}
            </div>

            {viewMode === 'list' ? <ServiceRequestList onSelectRequest={handleSelectRequest} /> : selectedRequest && <ServiceRequestDetail />}
        </div>
    );
};

export default ServiceRequestPage;
