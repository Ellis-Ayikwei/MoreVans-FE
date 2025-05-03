// Example implementation using the new utilities
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../helper/axiosInstance';
import { ServiceRequest } from '../../types';
import { safeApiCall } from '../../helper/apiDataConverter';

export const ServiceRequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [request, setRequest] = useState<ServiceRequest | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServiceRequest = async () => {
            try {
                setLoading(true);

                // Use the safeApiCall utility to handle the API call and convert snake_case to camelCase
                const data = await safeApiCall<ServiceRequest>(() => axiosInstance.get(`/service-requests/${id}`).then((response) => response.data));

                if (!data) {
                    setError('Failed to load service request');
                    return;
                }

                setRequest(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching service request:', err);
                setError('An error occurred while loading the service request');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchServiceRequest();
        }
    }, [id]);

    if (loading) {
        return <div>Loading service request details...</div>;
    }

    if (error || !request) {
        return <div className="text-red-500">Error: {error || 'Service request not found'}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Service Request: {request.id}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Name:</span> {request.contactName}
                        </p>
                        <p>
                            <span className="font-medium">Phone:</span> {request.contactPhone}
                        </p>
                        <p>
                            <span className="font-medium">Email:</span> {request.contactEmail}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Type:</span> {request.requestType}
                        </p>
                        <p>
                            <span className="font-medium">Status:</span> {request.status}
                        </p>
                        <p>
                            <span className="font-medium">Priority:</span> {request.priority}
                        </p>
                        <p>
                            <span className="font-medium">Service Level:</span> {request.serviceLevel}
                        </p>
                        <p>
                            <span className="font-medium">Created:</span> {request.createdAt && new Date(request.createdAt).toLocaleString()}
                        </p>
                        <p>
                            <span className="font-medium">Updated:</span> {request.updatedAt && new Date(request.updatedAt).toLocaleString()}
                        </p>
                        <p>
                            <span className="font-medium">Tracking Number:</span> {request.trackingNumber}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Schedule</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Preferred Pickup Date:</span> {request.preferredPickupDate}
                        </p>
                        <p>
                            <span className="font-medium">Preferred Pickup Time:</span> {request.preferredPickupTime}
                        </p>
                        <p>
                            <span className="font-medium">Preferred Pickup Time Window:</span> {request.preferredPickupTimeWindow}
                        </p>
                        <p>
                            <span className="font-medium">Preferred Delivery Date:</span> {request.preferredDeliveryDate}
                        </p>
                        <p>
                            <span className="font-medium">Preferred Delivery Time:</span> {request.preferredDeliveryTime}
                        </p>
                        <p>
                            <span className="font-medium">Is Flexible:</span> {request.isFlexible ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Pricing & Insurance</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Base Price:</span> ${request.basePrice}
                        </p>
                        <p>
                            <span className="font-medium">Final Price:</span> ${request.finalPrice}
                        </p>
                        <p>
                            <span className="font-medium">Insurance Required:</span> {request.insuranceRequired ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <span className="font-medium">Insurance Value:</span> ${request.insuranceValue}
                        </p>
                        <p>
                            <span className="font-medium">Payment Status:</span> {request.paymentStatus}
                        </p>
                    </div>
                </div>
            </div>

            {request.stops && request.stops.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Journey Stops ({request.stops.length})</h2>
                    <div className="space-y-4">
                        {request.stops.map((stop, index) => (
                            <div key={stop.id} className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg">
                                    Stop {index + 1}: {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                                </h3>
                                <div className="mt-2 space-y-2">
                                    <p>
                                        <span className="font-medium">Address:</span> {stop.address}
                                    </p>
                                    <p>
                                        <span className="font-medium">Unit Number:</span> {stop.unit_number}
                                    </p>
                                    <p>
                                        <span className="font-medium">Floor:</span> {stop.floor}
                                    </p>
                                    <p>
                                        <span className="font-medium">Has Elevator:</span> {stop.has_elevator ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Parking Info:</span> {stop.parking_info}
                                    </p>
                                    <p>
                                        <span className="font-medium">Instructions:</span> {stop.instructions}
                                    </p>
                                    <p>
                                        <span className="font-medium">Estimated Time:</span> {stop.estimated_time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {request.moving_items && request.movingItems.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Moving Items ({request.movingItems.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {request.movingItems.map((item) => (
                            <div key={item.id} className="border rounded-lg p-3">
                                <h3 className="font-medium">{item.name}</h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>Quantity: {item.quantity}</p>
                                    {item.dimensions && <p>Dimensions: {item.dimensions}</p>}
                                    {item.weight && <p>Weight: {item.weight}</p>}
                                    {item.fragile && <p className="text-red-500">Fragile Item</p>}
                                    {item.needsDisassembly && <p className="text-orange-500">Needs Disassembly</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {request.special_ + instructions && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
                    <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
                    <p className="text-gray-600 dark:text-gray-400">{request.specialInstructions}</p>
                </div>
            )}
        </div>
    );
};
