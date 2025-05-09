import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    IconTruck,
    IconBuilding,
    IconPackage,
    IconPiano,
    IconWorld,
    IconBox,
    IconShieldCheck,
    IconStar,
    IconClock,
    IconMapPin,
    IconPhone,
    IconMail,
    IconArrowRight,
    IconCheck,
    IconUsers,
    IconCertificate,
} from '@tabler/icons-react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';
import QuickQuoteButton from '../components/buttons/QuickQuoteButton';

interface ServiceCard {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    features: string[];
    image: string;
    price: string;
    duration: string;
    category: string;
    popular?: boolean;
}

const Services: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const services: ServiceCard[] = [
        {
            id: 1,
            title: 'Man & Van',
            description: 'Perfect for small moves, single items, or urgent deliveries. Fast, flexible, and affordable.',
            icon: IconTruck,
            features: ['Same day delivery available', 'Up to 2 cubic meters', 'Loading & unloading included', 'No hidden charges', 'Instant quotes'],
            image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £30',
            duration: '1-2 hours',
            category: 'manvan',
            popular: true,
        },
        {
            id: 2,
            title: 'Furniture Delivery',
            description: 'Professional delivery and assembly of your new furniture. We handle everything from pickup to setup.',
            icon: IconPackage,
            features: ['Assembly included', 'Old furniture removal', 'Protection of floors and walls', 'Quality inspection', 'Waste disposal'],
            image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £45',
            duration: '2-4 hours',
            category: 'furniture',
            popular: true,
        },
        {
            id: 3,
            title: 'House Removals',
            description: 'Full-service house moving with professional packing, loading, and unpacking.',
            icon: IconBuilding,
            features: ['Professional packing services', 'Furniture disassembly & assembly', 'Specialty item handling', 'Storage solutions available', 'Insurance coverage included'],
            image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £299',
            duration: '4-8 hours',
            category: 'removals',
            popular: true,
        },
        {
            id: 4,
            title: 'Office Removals',
            description: 'Minimize business downtime with our efficient office moving services.',
            icon: IconBuilding,
            features: ['After-hours moving available', 'IT equipment handling', 'Furniture reconfiguration', 'Document security', 'Minimal business disruption'],
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'Custom Quote',
            duration: '1-3 days',
            category: 'office',
            popular: false,
        },
        {
            id: 5,
            title: 'Piano Moving',
            description: 'Expert piano moving service with specialized equipment and trained professionals.',
            icon: IconPiano,
            features: ['Specialized piano equipment', 'Trained piano movers', 'Insurance coverage', 'Careful handling', 'Setup & tuning available'],
            image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £150',
            duration: '2-4 hours',
            category: 'specialty',
            popular: false,
        },
        {
            id: 6,
            title: 'Motorbike Transport',
            description: 'Safe and secure motorbike transportation service.',
            icon: IconTruck,
            features: ['Secure strapping', 'Insurance included', 'Nationwide coverage', 'Tracking available', 'Door-to-door service'],
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £75',
            duration: '1-2 days',
            category: 'vehicles',
            popular: false,
        },
        {
            id: 7,
            title: 'Car Transport',
            description: 'Reliable car transportation service for any vehicle type.',
            icon: IconTruck,
            features: ['Enclosed transport available', 'Insurance included', 'Nationwide coverage', 'Tracking available', 'Door-to-door service'],
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £150',
            duration: '1-3 days',
            category: 'vehicles',
            popular: false,
        },
        {
            id: 8,
            title: 'Storage Solutions',
            description: 'Secure, flexible storage solutions for your belongings.',
            icon: IconBox,
            features: ['Flexible terms', '24/7 access available', 'Insurance options', 'Collection & delivery', 'Secure facilities'],
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            price: 'From £20/week',
            duration: 'Flexible',
            category: 'storage',
            popular: false,
        },
    ];

    const categories = [
        { id: 'all', name: 'All Services' },
        { id: 'manvan', name: 'Man & Van' },
        { id: 'furniture', name: 'Furniture' },
        { id: 'removals', name: 'Removals' },
        { id: 'office', name: 'Office' },
        { id: 'specialty', name: 'Specialty' },
        { id: 'vehicles', name: 'Vehicles' },
        { id: 'storage', name: 'Storage' },
    ];

    const filteredServices = selectedCategory === 'all' ? services : services.filter((service) => service.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Delivery & Moving Services</h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">From man & van to full house removals, we've got you covered. Fast, reliable, and affordable delivery services.</p>
                        <QuickQuoteButton size="lg" />
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="service-card bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="relative h-48">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    {/* Popular Badge */}
                                    {service.popular && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="bg-secondary text-white text-xs px-4 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm">Popular</span>
                                        </div>
                                    )}
                                    {/* Service Info */}
                                    <div className="absolute bottom-4 left-4">
                                        <service.icon className="w-8 h-8 text-white mb-2" />
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">{service.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-primary font-bold">{service.price}</span>
                                        <span className="text-gray-500 text-sm">{service.duration}</span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="flex items-center text-gray-600">
                                                <IconCheck className="w-5 h-5 text-primary mr-2" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {service.category === 'office' || service.category === 'removals' ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                                            onClick={() => (window.location.href = '/contact')}
                                        >
                                            Contact for Quote
                                            <IconArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    ) : (
                                        <QuickQuoteButton serviceType={service.category} className="w-full" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Moving Services?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the difference with our professional moving services</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: IconShieldCheck,
                                title: 'Licensed & Insured',
                                description: 'Fully licensed and insured for your peace of mind',
                            },
                            {
                                icon: IconUsers,
                                title: 'Expert Team',
                                description: 'Professional movers with years of experience',
                            },
                            {
                                icon: IconStar,
                                title: '5-Star Service',
                                description: 'Consistently rated 5 stars by our customers',
                            },
                            {
                                icon: IconClock,
                                title: 'On-Time Delivery',
                                description: 'Punctual service guaranteed',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <feature.icon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Move?</h2>
                                <p className="text-xl text-gray-600 mb-8">Get a free quote for your move today. Our team is ready to help you with your relocation needs.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <IconMapPin className="w-5 h-5 text-primary mr-3" />
                                        <span>Available in all major cities</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <IconPhone className="w-5 h-5 text-primary mr-3" />
                                        <span>24/7 Customer Support</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <IconCertificate className="w-5 h-5 text-primary mr-3" />
                                        <span>Licensed & Insured</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-8">
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Get Free Quote
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <style jsx>{`
                @media (max-width: 768px) {
                    .service-card {
                        font-size: 0.875rem; /* Smaller font size for smaller devices */
                    }
                }
            `}</style>
        </div>
    );
};

export default Services;
