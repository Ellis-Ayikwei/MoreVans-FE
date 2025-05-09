import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconTruck, IconPackage, IconPiano, IconBox, IconMapPin, IconCalendar, IconMail, IconPhone, IconCheck, IconShield, IconShieldCheck } from '@tabler/icons-react';

interface QuickQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceType?: string;
}

const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({ isOpen, onClose, serviceType = 'manvan' }) => {
    const [formData, setFormData] = useState({
        pickupPostcode: '',
        deliveryPostcode: '',
        moveDate: '',
        items: '',
        email: '',
        phone: '',
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        pianoType: '',
        storageDuration: '',
        storageSize: '',
    });

    const getServiceInfo = () => {
        switch (serviceType) {
            case 'manvan':
                return {
                    title: 'Man & Van Service',
                    description: 'Perfect for small moves and single items',
                    icon: IconTruck,
                    color: 'from-secondary to-secondary/90',
                    accent: 'bg-secondary/10',
                    features: ['Same day delivery available', 'Up to 2 cubic meters', 'Loading & unloading included'],
                    warranty: '100% Satisfaction',
                    insurance: 'Full Insurance ',
                    iconColor: 'text-secondary',
                };
            case 'vehicles':
                return {
                    title: 'Vehicle Transport',
                    description: 'Safe and secure vehicle transportation',
                    icon: IconTruck,
                    color: 'from-secondary to-secondary/90',
                    accent: 'bg-secondary/10',
                    features: ['Secure strapping', 'Insurance included', 'Nationwide coverage'],
                    warranty: 'Damage Protection ',
                    insurance: ' Vehicle Insurance',
                    iconColor: 'text-secondary',
                };
            case 'piano':
                return {
                    title: 'Piano Moving',
                    description: 'Expert piano moving service',
                    icon: IconPiano,
                    color: 'from-secondary to-secondary/90',
                    accent: 'bg-secondary/10',
                    features: ['Specialized equipment', 'Trained professionals', 'Insurance coverage'],
                    warranty: 'Professional Handling ',
                    insurance: 'Specialized  Insurance',
                    iconColor: 'text-secondary',
                };
            case 'storage':
                return {
                    title: 'Storage Solutions',
                    description: 'Secure storage for your belongings',
                    icon: IconBox,
                    color: 'from-secondary to-secondary/90',
                    accent: 'bg-secondary/10',
                    features: ['Flexible terms', '24/7 access', 'Insurance options'],
                    warranty: 'Secure ',
                    insurance: 'Storage Insurance',
                    iconColor: 'text-secondary',
                };
            default:
                return {
                    title: 'Quick Quote',
                    description: 'Get a quote for your move',
                    icon: IconPackage,
                    color: 'from-secondary to-secondary/90',
                    accent: 'bg-secondary/10',
                    features: ['Fast response', 'Competitive pricing', 'Professional service'],
                    warranty: 'Service Satisfaction',
                    insurance: 'Insurance Coverage',
                    iconColor: 'text-secondary',
                };
        }
    };

    const serviceInfo = getServiceInfo();
    const ServiceIcon = serviceInfo.icon;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Here you would typically make an API call to your backend
            const response = await fetch('/api/request-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    serviceType,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            // Show success message or redirect
            alert('Your move request has been submitted successfully! We will contact you shortly.');
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const renderServiceSpecificFields = () => {
        switch (serviceType) {
            case 'manvan':
                return (
                    <div>
                        <label htmlFor="items" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Items to Move
                        </label>
                        <input
                            type="text"
                            id="items"
                            name="items"
                            value={formData.items}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 2 beds, 1 sofa, 3 boxes"
                            required
                        />
                    </div>
                );

            case 'vehicles':
                return (
                    <>
                        <div>
                            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Type
                            </label>
                            <select
                                id="vehicleType"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select vehicle type</option>
                                <option value="car">Car</option>
                                <option value="motorbike">Motorbike</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Make
                            </label>
                            <input
                                type="text"
                                id="vehicleMake"
                                name="vehicleMake"
                                value={formData.vehicleMake}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Toyota, Honda"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Model
                            </label>
                            <input
                                type="text"
                                id="vehicleModel"
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Corolla, Civic"
                                required
                            />
                        </div>
                    </>
                );

            case 'piano':
                return (
                    <div>
                        <label htmlFor="pianoType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Piano Type
                        </label>
                        <select
                            id="pianoType"
                            name="pianoType"
                            value={formData.pianoType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select piano type</option>
                            <option value="upright">Upright Piano</option>
                            <option value="grand">Grand Piano</option>
                            <option value="digital">Digital Piano</option>
                        </select>
                    </div>
                );

            case 'storage':
                return (
                    <>
                        <div>
                            <label htmlFor="storageSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Storage Size Needed
                            </label>
                            <select
                                id="storageSize"
                                name="storageSize"
                                value={formData.storageSize}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select storage size</option>
                                <option value="small">Small (1-2 rooms)</option>
                                <option value="medium">Medium (2-3 rooms)</option>
                                <option value="large">Large (3+ rooms)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="storageDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Storage Duration
                            </label>
                            <select
                                id="storageDuration"
                                name="storageDuration"
                                value={formData.storageDuration}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select duration</option>
                                <option value="1month">1 Month</option>
                                <option value="3months">3 Months</option>
                                <option value="6months">6 Months</option>
                                <option value="1year">1 Year</option>
                                <option value="longer">Longer</option>
                            </select>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                    >
                        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            {/* Header with gradient */}
                            <div className={`bg-gradient-to-r ${serviceInfo.color} p-6 text-white relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10">
                                    <div className="flex flex-col space-y-4">
                                        {/* Title and Close Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`${serviceInfo.accent} p-3 rounded-xl backdrop-blur-sm`}>
                                                    <ServiceIcon className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-2xl font-bold truncate">{serviceInfo.title}</h2>
                                                    <p className="text-white/90 truncate">{serviceInfo.description}</p>
                                                </div>
                                            </div>
                                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm flex-shrink-0 ml-4">
                                                <IconX className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Features */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap gap-3">
                                    {/* Warranty and Insurance Info */}
                                    <div className="flex flex-wrap gap-4 mt-2 mx-auto">
                                        <div className="flex items-center gap-2  backdrop-blur-sm px-4 py-2 rounded-lg bg-primary/10 text-primary">
                                            <IconShield className="w-5 h-5" />
                                            <span className="text-sm font-medium">{serviceInfo.warranty}</span>
                                        </div>
                                        <div className="flex items-center gap-2  backdrop-blur-sm px-4 py-2 rounded-lg bg-primary/10 text-primary">
                                            <IconShieldCheck className="w-5 h-5" />
                                            <span className="text-sm font-medium">{serviceInfo.insurance}</span>
                                        </div>
                                        <div className="flex items-center gap-2  backdrop-blur-sm px-4 py-2 rounded-lg bg-primary/10 text-primary">
                                            <IconCheck className="w-5 h-5" />
                                            <span className="text-sm font-medium">Licensed & Insured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Main Form */}
                                    <div className="lg:col-span-7">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label
                                                        htmlFor="pickupPostcode"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-secondary transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <IconMapPin className={`w-4 h-4 flex-shrink-0 ${serviceInfo.iconColor}`} />
                                                            <span>Pickup Postcode</span>
                                                        </div>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id="pickupPostcode"
                                                            name="pickupPostcode"
                                                            value={formData.pickupPostcode}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm group-hover:shadow-md group-hover:border-secondary/50"
                                                            placeholder="Enter pickup postcode"
                                                            required
                                                        />
                                                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary/50 transition-all pointer-events-none"></div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label
                                                        htmlFor="deliveryPostcode"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-secondary transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <IconMapPin className={`w-4 h-4 flex-shrink-0 ${serviceInfo.iconColor}`} />
                                                            <span>Delivery Postcode</span>
                                                        </div>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id="deliveryPostcode"
                                                            name="deliveryPostcode"
                                                            value={formData.deliveryPostcode}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm group-hover:shadow-md group-hover:border-secondary/50"
                                                            placeholder="Enter delivery postcode"
                                                            required
                                                        />
                                                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary/50 transition-all pointer-events-none"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label htmlFor="moveDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-secondary transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <IconCalendar className={`w-4 h-4 flex-shrink-0 ${serviceInfo.iconColor}`} />
                                                            <span>Preferred Move Date</span>
                                                        </div>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            id="moveDate"
                                                            name="moveDate"
                                                            value={formData.moveDate}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm group-hover:shadow-md group-hover:border-secondary/50"
                                                            required
                                                        />
                                                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary/50 transition-all pointer-events-none"></div>
                                                    </div>
                                                </div>

                                                {renderServiceSpecificFields()}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-secondary transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <IconMail className={`w-4 h-4 flex-shrink-0 ${serviceInfo.iconColor}`} />
                                                            <span>Email Address</span>
                                                        </div>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm group-hover:shadow-md group-hover:border-secondary/50"
                                                            placeholder="Enter your email"
                                                            required
                                                        />
                                                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary/50 transition-all pointer-events-none"></div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-secondary transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <IconPhone className={`w-4 h-4 flex-shrink-0 ${serviceInfo.iconColor}`} />
                                                            <span>Phone Number</span>
                                                        </div>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm group-hover:shadow-md group-hover:border-secondary/50"
                                                            placeholder="Enter your phone number"
                                                            required
                                                        />
                                                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary/50 transition-all pointer-events-none"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    className={`px-8 py-4 bg-gradient-to-r ${serviceInfo.color} text-white rounded-xl font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                                                >
                                                    Request a Move
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickQuoteModal;
