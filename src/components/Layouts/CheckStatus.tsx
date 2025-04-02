import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckStatusProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RepairStatus {
    status: 'pending' | 'in-progress' | 'completed' | 'ready';
    details: string;
    estimatedCompletion?: string;
    technician?: string;
    cost?: string;
}

const CheckStatus: React.FC<CheckStatusProps> = ({ isOpen, onClose }) => {
    const [trackingId, setTrackingId] = useState('');
    const [repairStatus, setRepairStatus] = useState<RepairStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (trackingId.trim() === '') {
                setError('Please enter a valid tracking ID');
                setIsLoading(false);
                return;
            }

            // Mock response - replace with actual API call
            setRepairStatus({
                status: 'in-progress',
                details: 'Device diagnosis completed. Parts ordered.',
                estimatedCompletion: '2024-02-20',
                technician: 'John Doe',
                cost: '$150',
            });
            setIsLoading(false);
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'ready':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#dc711a] p-6 text-white">
                            <h2 className="text-2xl font-bold">Check Repair Status</h2>
                            <p className="text-white/80">Track your device repair progress</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Repair Tracking ID</label>
                                    <input
                                        type="text"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        placeholder="Enter your tracking ID"
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-600 text-sm">{error}</p>}

                                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-[#dc711a] text-white rounded-full hover:bg-[#b95d13] transition-colors disabled:opacity-50">
                                    {isLoading ? 'Checking...' : 'Check Status'}
                                </button>
                            </form>

                            {/* Status Display */}
                            {repairStatus && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 sm:mt-8 space-y-4">
                                    <div className="border-t pt-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <h3 className="font-semibold text-gray-900">Repair Status</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block sm:inline ${getStatusColor(repairStatus.status)}`}>
                                                {repairStatus.status.charAt(0).toUpperCase() + repairStatus.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <p className="text-gray-600">{repairStatus.details}</p>

                                            {repairStatus.estimatedCompletion && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Estimated Completion:</span>
                                                    <span className="text-gray-900">{repairStatus.estimatedCompletion}</span>
                                                </div>
                                            )}

                                            {repairStatus.technician && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Technician:</span>
                                                    <span className="text-gray-900">{repairStatus.technician}</span>
                                                </div>
                                            )}

                                            {repairStatus.cost && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Estimated Cost:</span>
                                                    <span className="text-gray-900">{repairStatus.cost}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 flex justify-end">
                            <button onClick={onClose} className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CheckStatus;
