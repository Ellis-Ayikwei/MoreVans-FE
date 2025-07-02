import { IconArrowRight, IconCheck, IconClock, IconShieldCheck, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import QuickQuoteModal from '../QuickQuotePrice/QuickQuoteModal';

// Mock AddressAutocomplete component
interface AddressAutocompleteProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ name, value, onChange, placeholder, className }) => (
    <div className={className}>
        <input type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
);

interface QuickFormData {
    pickup_location: string;
    dropoff_location: string;
    serviceType: string;
    move_date: string;
    name: string;
    phone: string;
    email: string;
}

const Hero: React.FC = () => {
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [formError, setFormError] = useState('');
    const [isQuickQuoteModalOpen, setIsQuickQuoteModalOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState('home');
    const [quickFormData, setQuickFormData] = useState<QuickFormData>({
        pickup_location: '',
        dropoff_location: '',
        serviceType: 'home',
        move_date: '',
        name: '',
        phone: '',
        email: '',
    });

    // Service cards matching the modal services
    const serviceCards = [
        {
            id: 1,
            title: 'Home Removals',
            description: 'Complete household relocations',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 'Get Instant Prices',
            serviceType: 'home',
        },
        {
            id: 2,
            title: 'Furniture Removal',
            description: 'Professional furniture moving service',
            image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 'Get Instant Prices',
            serviceType: 'furniture',
        },
        {
            id: 3,
            title: 'Car Transport',
            description: 'Safe and secure vehicle transportation',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 'Get Instant Prices',
            serviceType: 'cars',
        },
        {
            id: 4,
            title: 'Piano Transport',
            description: 'Expert piano moving service',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 'Get Instant Prices',
            serviceType: 'pianos',
        },
    ];

    const handleQuickFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setQuickFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formError) setFormError('');
    };

    const handleQuickFormSubmit = async () => {
        if (!quickFormData.pickup_location || !quickFormData.dropoff_location) {
            setFormError('Please enter both pickup and delivery locations');
            return;
        }
        if (!quickFormData.move_date) {
            setFormError('Please select a moving date');
            return;
        }

        setIsLoadingQuote(true);
        setFormError('');

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.href = '/service-request';
        } catch (error) {
            console.error('Error submitting quote request:', error);
            setFormError('There was a problem submitting your request. Please try again.');
        } finally {
            setIsLoadingQuote(false);
        }
    };

    return (
        <section className="relative overflow-hidden">
            {/* Blue Brand Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/85 via-blue-700/90 to-blue-800/95"></div>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating orbs with subtle animations */}
                <motion.div
                    className="absolute top-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl shadow-2xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-10 w-24 h-24 bg-white/15 rounded-full blur-lg shadow-xl"
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                        scale: [1, 0.9, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/4 w-20 h-20 bg-blue-300/25 rounded-full blur-md shadow-lg"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Floating particles */}
                <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-200/60 rounded-full animate-ping shadow-sm"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-blue-100/50 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                {/* Trust indicators */}
                <motion.div className="flex items-center justify-center space-x-8 mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center text-sm text-white/90 drop-shadow-sm">
                        <IconShieldCheck className="w-4 h-4 text-green-400 mr-2 drop-shadow-sm" />
                        Licensed & Insured
                    </div>
                    <div className="flex items-center text-sm text-white/90 drop-shadow-sm">
                        <IconStar className="w-4 h-4 text-yellow-400 mr-1 drop-shadow-sm" />
                        4.8 (15,742 reviews)
                    </div>
                    <div className="flex items-center text-sm text-white/90 drop-shadow-sm">
                        <IconClock className="w-4 h-4 text-blue-200 mr-2 drop-shadow-sm" />
                        24/7 Support
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Column */}
                    <motion.div className="space-y-8" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                        <div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                                Moving Made
                                <span className="block text-blue-200 drop-shadow-md">Simple & Safe</span>
                            </h1>
                            <p className="text-xl text-blue-100 mt-6 leading-relaxed drop-shadow-sm">
                                Get instant prices from verified moving professionals. Compare prices, read reviews, and book with confidence.
                            </p>
                        </div>

                        {/* Key benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                    <IconCheck className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-sm font-medium text-white drop-shadow-sm">Instant prices</span>
                            </motion.div>
                            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                    <IconShieldCheck className="w-4 h-4 text-blue-200" />
                                </div>
                                <span className="text-sm font-medium text-white drop-shadow-sm">Verified movers</span>
                            </motion.div>
                            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                    <IconStar className="w-4 h-4 text-yellow-400" />
                                </div>
                                <span className="text-sm font-medium text-white drop-shadow-sm">Best prices</span>
                            </motion.div>
                        </div>

                        {/* Mobile CTA */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => {
                                    setSelectedServiceType('home');
                                    setIsQuickQuoteModalOpen(true);
                                }}
                                className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center shadow-xl"
                            >
                                Get Prices Now
                                <IconArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>

                        {/* Desktop quote form */}
                        <motion.div
                            className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Your Free Price</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">What are you moving?</label>
                                    <select
                                        name="serviceType"
                                        value={quickFormData.serviceType}
                                        onChange={handleQuickFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="home">Home Removals</option>
                                        <option value="furniture">Furniture Removal</option>
                                        <option value="cars">Car Transport</option>
                                        <option value="pianos">Piano Transport</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                        <AddressAutocomplete
                                            name="pickup_location"
                                            value={quickFormData.pickup_location}
                                            onChange={(value: string) => {
                                                setQuickFormData((prev) => ({
                                                    ...prev,
                                                    pickup_location: value,
                                                }));
                                            }}
                                            placeholder="Enter pickup address"
                                            className="[&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-lg [&_input]:focus:ring-2 [&_input]:focus:ring-blue-500 [&_input]:focus:border-transparent [&_input]:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                        <AddressAutocomplete
                                            name="dropoff_location"
                                            value={quickFormData.dropoff_location}
                                            onChange={(value: string) => {
                                                setQuickFormData((prev) => ({
                                                    ...prev,
                                                    dropoff_location: value,
                                                }));
                                            }}
                                            placeholder="Enter delivery address"
                                            className="[&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-lg [&_input]:focus:ring-2 [&_input]:focus:ring-blue-500 [&_input]:focus:border-transparent [&_input]:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">When do you need to move?</label>
                                    <input
                                        type="date"
                                        name="move_date"
                                        value={quickFormData.move_date}
                                        onChange={handleQuickFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>

                                {formError && <div className="text-red-600 text-sm font-medium">{formError}</div>}

                                <button
                                    type="button"
                                    onClick={handleQuickFormSubmit}
                                    disabled={isLoadingQuote}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg"
                                >
                                    {isLoadingQuote ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Getting prices...
                                        </>
                                    ) : (
                                        <>
                                            Get Prices Now
                                            <IconArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">Free prices • No obligations • Compare and save</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Service Cards Column */}
                    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}>
                        <div className="grid grid-cols-2 gap-4">
                            {serviceCards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-white group relative"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    onClick={() => {
                                        setSelectedServiceType(card.serviceType);
                                        setIsQuickQuoteModalOpen(true);
                                    }}
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">{card.price}</div>

                                        {/* Hover overlay with "Get Price Now" */}
                                        <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <IconArrowRight className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-white font-semibold text-sm">Get Price Now</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                                        <p className="text-sm text-gray-600">{card.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Simple stats */}
                        <motion.div
                            className="bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <div className="grid grid-cols-3 gap-4">
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <div className="text-2xl font-bold text-blue-600">15K+</div>
                                    <div className="text-sm text-gray-600">Moves completed</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <div className="text-2xl font-bold text-blue-600">4.8★</div>
                                    <div className="text-sm text-gray-600">Average rating</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <div className="text-2xl font-bold text-blue-600">98%</div>
                                    <div className="text-sm text-gray-600">Satisfaction</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <QuickQuoteModal isOpen={isQuickQuoteModalOpen} onClose={() => setIsQuickQuoteModalOpen(false)} serviceType={selectedServiceType} />
        </section>
    );
};

export default Hero;
