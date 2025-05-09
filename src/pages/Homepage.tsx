import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faStar,
    faStarHalf,
    faTruck,
    faUsers,
    faShieldAlt,
    faClock,
    faMapMarkerAlt,
    faChevronRight,
    faChevronLeft,
    faQuoteRight,
    faCheck,
    faSearch,
    faUser,
    faCalendarAlt,
    faEnvelope,
    faPhone,
    faArrowRight,
    faTruckLoading,
    faHandshake,
    faBusinessTime,
    faAward,
    faTools,
    faBell,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/homepage/Navbar';
import Hero from '../components/homepage/Hero';
import HowItWorks from '../components/homepage/HowItWorks';
import FeaturedProviders from '../components/homepage/FeaturedProviders';
import Footer from '../components/homepage/Footer';
import { IconClipboardList, IconUsers, IconTruck, IconArrowRight } from '@tabler/icons-react';

interface FeaturedProvider {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    description: string;
    services: string[];
    location: string;
    backgroundImage: string;
}

interface Testimonial {
    id: number;
    name: string;
    image: string;
    text: string;
    rating: number;
    date: string;
    service: string;
}

interface ServiceType {
    id: number;
    title: string;
    icon: string;
    description: string;
}

const Homepage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-advance testimonial carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Service types - more detailed data for production
    const serviceTypes: ServiceType[] = [
        {
            id: 1,
            title: 'Home Moves',
            icon: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Full house or apartment relocations with professional packing services and setup assistance',
        },
        {
            id: 2,
            title: 'Office Relocations',
            icon: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Minimize downtime with our efficient commercial moves including IT equipment and furniture',
        },
        {
            id: 3,
            title: 'Furniture Delivery',
            icon: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Safe delivery, assembly, and placement of furniture pieces from stores or between locations',
        },
        {
            id: 4,
            title: 'International Moves',
            icon: 'https://images.unsplash.com/photo-1531237570470-1b48560f2c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Cross-border relocations with customs handling, paperwork assistance, and international logistics',
        },
        {
            id: 5,
            title: 'Specialty Items',
            icon: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Expert handling of pianos, antiques, artwork, and other high-value or fragile possessions',
        },
        {
            id: 6,
            title: 'Storage Solutions',
            icon: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Secure short and long-term storage facilities with climate control and 24/7 security options',
        },
    ];

    // Enhanced featured providers with more realistic data
    const featuredProviders: FeaturedProvider[] = [
        {
            id: 1,
            name: 'Express Movers Ltd',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.8,
            reviewCount: 1246,
            description: 'Award-winning residential moving specialists with over 10 years of experience and 50+ trained staff',
            services: ['Residential Moves', 'Packing & Unpacking', 'Furniture Assembly', 'Piano Moving'],
            location: 'London, UK',
        },
        {
            id: 2,
            name: 'City Logistics Solutions',
            image: 'https://images.unsplash.com/photo-1618077360395-f6a9ce8a19e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.7,
            reviewCount: 983,
            description: 'Fast and reliable commercial moving services with national coverage and specialized equipment',
            services: ['Office Relocations', 'IT Infrastructure', 'Commercial Equipment', 'Storage'],
            location: 'Manchester, UK',
        },
        {
            id: 3,
            name: 'Safe Transport & Delivery',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1584535236953-40a52eb2fe76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.9,
            reviewCount: 1567,
            description: 'Specialized in fragile item transportation with comprehensive insurance coverage and expert handling',
            services: ['Fine Electronics', 'Antiques', 'Artwork', 'Grand Pianos', 'Luxury Items'],
            location: 'Birmingham, UK',
        },
    ];

    // Enhanced testimonials with more realistic content
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'MoreVans transformed what could have been a stressful house move into a seamless experience. The provider arrived punctually, handled all our belongings with care, and even helped arrange furniture in our new home. The transparent pricing meant no surprises, and the app let me track everything in real-time.',
            rating: 5,
            date: '12 Mar 2025',
            service: 'Home Relocation',
        },
        {
            id: 2,
            name: 'Michael Brown',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'As a small business owner, I needed our office relocation to happen with minimal disruption. The team at MoreVans found us a provider that worked overnight and weekend hours to ensure we were operational by Monday morning. Their business moving checklist was invaluable for our planning process.',
            rating: 5,
            date: '2 Apr 2025',
            service: 'Office Relocation',
        },
        {
            id: 3,
            name: 'Jennifer Lee',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: "I needed to transport my grandmother's antique piano that's been in our family for generations. The specialist provider MoreVans matched me with arrived with custom equipment, thoroughly wrapped and secured the piano, and delivered it without a scratch. The insurance coverage gave me complete peace of mind throughout.",
            rating: 5,
            date: '18 Mar 2025',
            service: 'Specialty Moving',
        },
    ];

    // Enhanced stats with more specific metrics
    const stats = [
        { value: '15,742', label: 'Happy Customers' },
        { value: '5,612', label: 'Verified Providers' },
        { value: '98.3%', label: 'Satisfaction Rate' },
        { value: '£10M+', label: 'Insurance Coverage' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
        

            {/* Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</p>
                                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section ref={servicesRef} className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Moving Services</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            From single items to full house moves, we connect you with the right van operators for any transport need.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {serviceTypes.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        type: 'spring',
                                        stiffness: 100,
                                        damping: 20,
                                    }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <motion.img
                                            src={service.icon}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                        />
                                        {/* Add a subtle overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                                        <motion.div
                                            className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: 'tween' }}
                                        >
                                            Learn more
                                            <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-sm" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Providers */}
            <FeaturedProviders providers={featuredProviders} />

            {/* Testimonials */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-5 dark:opacity-[0.03]">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                        <path d="M25,30 Q35,30 40,20 T65,20 T90,40 T100,60" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M0,50 Q20,40 40,50 T80,50 T100,40" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M0,70 Q25,60 50,70 T100,70" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Customer Stories</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Hear what our customers have to say about their moving experiences.</p>
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl p-8 mb-6 relative">
                                    <div className="absolute top-4 right-5 text-5xl text-blue-100 dark:text-blue-900/30">
                                        <FontAwesomeIcon icon={faQuoteRight} />
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} className={i < testimonials[currentSlide].rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} />
                                            ))}
                                        </div>
                                        <p className="text-xl text-gray-700 dark:text-gray-200 italic">"{testimonials[currentSlide].text}"</p>
                                    </div>
                                    <div className="flex items-center">
                                        <img src={testimonials[currentSlide].image} alt={testimonials[currentSlide].name} className="w-14 h-14 rounded-full object-cover" />
                                        <div className="ml-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">{testimonials[currentSlide].name}</p>
                                            <div className="flex text-sm text-gray-500 dark:text-gray-400 items-center">
                                                <span>{testimonials[currentSlide].service}</span>
                                                <span className="mx-2">•</span>
                                                <span>{testimonials[currentSlide].date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial controls */}
                                <div className="flex items-center justify-center space-x-3">
                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                        aria-label="Previous testimonial"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600 dark:text-gray-300" />
                                    </button>

                                    <div className="flex space-x-2">
                                        {testimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                aria-label={`Go to testimonial ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
                                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                        aria-label="Next testimonial"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Trust & Safety */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Peace of Mind is Our Priority</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                We thoroughly vet all providers on our platform to ensure they meet our high standards for reliability and professionalism.
                            </p>

                            <div className="space-y-6">
                                <div className="flex">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Insurance Coverage</h3>
                                        <p className="text-gray-600 dark:text-gray-400">All moves are covered by our comprehensive insurance policy for added protection.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faUsers} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Verified Providers</h3>
                                        <p className="text-gray-600 dark:text-gray-400">We check credentials, licenses, and reviews before approving any provider on our platform.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faClock} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Reliable Service</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Our providers maintain a 98% on-time arrival rate and excellent service standards.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link to="/safety" className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    Learn more about our safety measures
                                    <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-sm" />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Safe moving"
                                    className="w-full rounded-xl shadow-xl"
                                />

                                <div className="absolute -bottom-10 -right-10 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl max-w-xs">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 dark:text-green-400 text-xl" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Protected Moves</h3>
                                            <p className="text-green-600 dark:text-green-400 font-medium">Goods in Transit Insurance</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Every booking includes coverage up to £50,000 for added peace of mind.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to <span className="text-6xl md:text-7xl lg:text-8xl">Simple</span> Your Move?
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">Join thousands of satisfied customers who have transformed their moving experience with MoreVans.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                to="/service-request"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg inline-block shadow-lg hover:shadow-xl transition-all"
                            >
                                Request a Move
                            </Link>
                            <Link
                                to="/register"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-lg inline-block transition-colors"
                            >
                                Become a Provider
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Homepage;
