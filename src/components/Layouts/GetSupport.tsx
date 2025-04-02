import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GetSupportProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SupportForm {
    name: string;
    email: string;
    phone: string;
    company?: string;
    supportType: 'hardware' | 'software' | 'network' | 'security' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    preferredContact: 'email' | 'phone' | 'both';
}

const initialFormState: SupportForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    supportType: 'hardware',
    priority: 'medium',
    description: '',
    preferredContact: 'email',
};

const GetSupport: React.FC<GetSupportProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<SupportForm>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Support request submitted:', formData);

        setIsSubmitting(false);
        setFormData(initialFormState);
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 h-full overflow-y-scroll overflow-x-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#dc711a] p-6 text-white">
                            <h2 className="text-2xl font-bold">Request IT Support</h2>
                            <p className="text-white/80">Tell us about your technical issue</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Contact Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Support Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Type</label>
                                    <select
                                        name="supportType"
                                        value={formData.supportType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a] text-sm sm:text-base"
                                        required
                                    >
                                        <option value="hardware">Hardware Support</option>
                                        <option value="software">Software Support</option>
                                        <option value="network">Network Support</option>
                                        <option value="security">Security Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                                <select
                                    name="preferredContact"
                                    value={formData.preferredContact}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                    required
                                >
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#dc711a] text-white rounded-full hover:bg-[#b95d13] transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GetSupport;
