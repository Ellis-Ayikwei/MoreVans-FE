import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GetAppProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AppForm {
    name: string;
    email: string;
    phone: string;
    company?: string;
    projectType: 'website' | 'mobile-app' | 'web-app' | 'e-commerce';
    budget: 'basic' | 'standard' | 'premium' | 'custom';
    description: string;
    timeline: 'flexible' | '1-3months' | '3-6months' | 'urgent';
    features: string[];
}

const featureOptions = {
    website: ['Responsive Design', 'Content Management', 'Blog Integration', 'SEO Optimization', 'Contact Forms', 'Analytics', 'Social Media Integration', 'Custom Domain'],
    'mobile-app': ['iOS App', 'Android App', 'Push Notifications', 'User Authentication', 'Offline Mode', 'In-App Purchases', 'Social Integration', 'Analytics'],
    'web-app': ['User Dashboard', 'Real-time Updates', 'Data Visualization', 'API Integration', 'File Upload/Download', 'User Management', 'Payment Integration'],
    'e-commerce': ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Inventory System', 'Customer Accounts', 'Mobile Commerce', 'Analytics'],
};

const initialFormState: AppForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'website',
    budget: 'standard',
    description: '',
    timeline: 'flexible',
    features: [],
};

const GetApp: React.FC<GetAppProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<AppForm>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Project request submitted:', formData);

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

    const handleFeatureToggle = (feature: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.includes(feature) ? prev.features.filter((f) => f !== feature) : [...prev.features, feature],
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto py-10"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 h-full overflow-y-scroll overflow-x-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#dc711a] p-6 text-white absolute w-full  mb-10">
                            <h2 className="text-2xl font-bold">Start Your Digital Project</h2>
                            <p className="text-white/80">Tell us about your website or app idea</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className=" p-6 space-y-6 mt-28">
                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    >
                                        <option value="website">Website</option>
                                        <option value="mobile-app">Mobile App</option>
                                        <option value="web-app">Web Application</option>
                                        <option value="e-commerce">E-commerce Platform</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                        required
                                    >
                                        <option value="basic">Basic ($1,000 - $5,000)</option>
                                        <option value="standard">Standard ($5,000 - $15,000)</option>
                                        <option value="premium">Premium ($15,000 - $30,000)</option>
                                        <option value="custom">Custom (Above $30,000)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Timeline</label>
                                <select
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                    required
                                >
                                    <option value="flexible">Flexible</option>
                                    <option value="1-3months">1-3 Months</option>
                                    <option value="3-6months">3-6 Months</option>
                                    <option value="urgent">Urgent (ASAP)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Desired Features</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {featureOptions[formData.projectType].map((feature) => (
                                        <label key={feature} className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={formData.features.includes(feature)}
                                                onChange={() => handleFeatureToggle(feature)}
                                                className="rounded border-gray-300 text-[#dc711a] focus:ring-[#dc711a]"
                                            />
                                            <span className="text-gray-700">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#dc711a] focus:border-[#dc711a]"
                                    placeholder="Tell us about your project idea, goals, and any specific requirements..."
                                    required
                                ></textarea>
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

export default GetApp;
