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
  faLock
} from '@fortawesome/free-solid-svg-icons';
import PlacesAutocomplete from 'react-places-autocomplete'; // You would need to install this package

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
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [formError, setFormError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    
    const navigate = useNavigate();
    const [quickFormData, setQuickFormData] = useState({
        pickup_location: '',
        dropoff_location: '',
        serviceType: 'home',
        date: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
    });

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
            title: "Home Moves",
            icon: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Full house or apartment relocations with professional packing services and setup assistance"
        },
        {
            id: 2,
            title: "Office Relocations",
            icon: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Minimize downtime with our efficient commercial moves including IT equipment and furniture"
        },
        {
            id: 3,
            title: "Furniture Delivery",
            icon: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Safe delivery, assembly, and placement of furniture pieces from stores or between locations"
        },
        {
            id: 4,
            title: "International Moves",
            icon: "https://images.unsplash.com/photo-1531237570470-1b48560f2c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Cross-border relocations with customs handling, paperwork assistance, and international logistics"
        },
        {
            id: 5,
            title: "Specialty Items",
            icon: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Expert handling of pianos, antiques, artwork, and other high-value or fragile possessions"
        },
        {
            id: 6,
            title: "Storage Solutions",
            icon: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "Secure short and long-term storage facilities with climate control and 24/7 security options"
        }
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
            location: 'London, UK'
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
            location: 'Manchester, UK'
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
            location: 'Birmingham, UK'
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
            service: 'Home Relocation'
        },
        {
            id: 2,
            name: 'Michael Brown',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'As a small business owner, I needed our office relocation to happen with minimal disruption. The team at MoreVans found us a provider that worked overnight and weekend hours to ensure we were operational by Monday morning. Their business moving checklist was invaluable for our planning process.',
            rating: 5,
            date: '2 Apr 2025',
            service: 'Office Relocation'
        },
        {
            id: 3,
            name: 'Jennifer Lee',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'I needed to transport my grandmother\'s antique piano that\'s been in our family for generations. The specialist provider MoreVans matched me with arrived with custom equipment, thoroughly wrapped and secured the piano, and delivered it without a scratch. The insurance coverage gave me complete peace of mind throughout.',
            rating: 5,
            date: '18 Mar 2025',
            service: 'Specialty Moving'
        },
    ];

    // Enhanced stats with more specific metrics
    const stats = [
        { value: '15,742', label: 'Happy Customers' },
        { value: '5,612', label: 'Verified Providers' },
        { value: '98.3%', label: 'Satisfaction Rate' },
        { value: '£10M+', label: 'Insurance Coverage' },
    ];

    // Handle input changes for quick quote form
    const handleQuickFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setQuickFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear any previous error when user starts typing
        if (formError) setFormError('');
    };

    // Handle address selection from Places Autocomplete
    const handleAddressSelect = (address: string, field: 'pickup_location' | 'dropoff_location') => {
        setQuickFormData(prev => ({
            ...prev,
            [field]: address
        }));
        if (formError) setFormError('');
    };

    // Scroll to services section
    const scrollToServices = () => {
        servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Submit handler for quick quote form with enhanced validation and UX
    const handleQuickFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic form validation
        if (!quickFormData.pickup_location || !quickFormData.dropoff_location) {
            setFormError('Please enter both pickup and delivery locations');
            return;
        }
        
        if (!quickFormData.date) {
            setFormError('Please select a moving date');
            return;
        }
        
        if (!quickFormData.contact_name || !quickFormData.contact_phone || !quickFormData.contact_email) {
            setFormError('Please complete all contact information');
            return;
        }
        
        setIsLoadingQuote(true);
        setFormError('');
        
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Map the quick form data to match the structure of the full service request form
            const fullFormData = {
                contact_name: quickFormData.contact_name,
                contact_phone: quickFormData.contact_phone,
                contact_email: quickFormData.contact_email,
                pickup_location: quickFormData.pickup_location,
                dropoff_location: quickFormData.dropoff_location,
                itemType: mapServiceType(quickFormData.serviceType),
                preferred_date: quickFormData.date,
                // Set some reasonable defaults
                item_size: 'medium',
                preferred_time: '',
                description: '',
                request_type: 'instant',
            };
            
            // Navigate to the service request form with the collected data
            navigate('/service-request', { state: { initialFormData: fullFormData } });
        } catch (error) {
            console.error('Error submitting quote request:', error);
            setFormError('There was a problem submitting your request. Please try again.');
        } finally {
            setIsLoadingQuote(false);
        }
    };
    
    // Map the select dropdown values to match the full form's expected values
    const mapServiceType = (type: string): string => {
        switch (type) {
            case 'home': return 'Residential Moving';
            case 'office': return 'Office Relocation';
            case 'furniture': return 'Furniture Assembly';
            case 'vehicle': return 'Vehicle Transportation';
            case 'international': return 'International Moving';
            case 'specialty': return 'Specialty Items';
            case 'storage': return 'Storage Services';
            default: return 'Residential Moving';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white dark:bg-gray-800 shadow-md py-2' 
                    : 'bg-transparent py-4 !text-white'
            }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4,10H20V18H4V10M8,14H14V12H8V14M4,4H20V8H4V4M9.5,6A1,1 0 0,0 8.5,7A1,1 0 0,0 9.5,8A1,1 0 0,0 10.5,7A1,1 0 0,0 9.5,6M14.5,6A1,1 0 0,0 13.5,7A1,1 0 0,0 14.5,8A1,1 0 0,0 15.5,7A1,1 0 0,0 14.5,6M4,20V22H20V20" />
                            </svg>
                            MoreVans
                        </Link>
                        <div className="hidden md:flex ml-10 space-x-6">
                            <Link to="/" className={`font-medium ${activeTab === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}>Home</Link>
                            <Link to="/services" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Services</Link>
                            <Link to="/how-it-works" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How it Works</Link>
                            <Link to="/providers" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Providers</Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Log In</Link>
                        <Link to="/service-request" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                            Request a Move
                        </Link>
                    </div>
                    <button
                        className="md:hidden text-gray-700 dark:text-gray-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Enhanced Mobile menu with animation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden bg-white dark:bg-gray-800 shadow-md"
                        >
                            <div className="px-4 py-2 space-y-2">
                                <Link 
                                    to="/" 
                                    className="block py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link 
                                    to="/services" 
                                    className="block py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Services
                                </Link>
                                <Link 
                                    to="/how-it-works" 
                                    className="block py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    How it Works
                                </Link>
                                <Link 
                                    to="/providers" 
                                    className="block py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Providers
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="block py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/service-request"
                                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center my-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Request a Move
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Premium Production-Ready Hero Section */}
            <section className="relative min-h-[90vh] pt-28 lg:pt-32 pb-24 lg:pb-32 bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 via-blue-700/90 to-indigo-800/90 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1603624910536-e1a268321bcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt=""
                        className="w-full h-full object-cover opacity-30 scale-105"
                        style={{ objectPosition: '50% 65%' }}
                        loading="eager"
                    />
                    
                    {/* Animated grid pattern overlay */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10"></div>
                    
                    {/* Enhanced animated visual elements */}
                    <motion.div 
                        className="absolute w-[40rem] h-[40rem] rounded-full bg-blue-500/20 -top-40 -left-20 blur-3xl z-10"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.25, 0.15] 
                        }}
                        transition={{ 
                            repeat: Infinity,
                            duration: 12,
                            ease: "easeInOut" 
                        }}
                    />
                    <motion.div 
                        className="absolute w-[50rem] h-[50rem] rounded-full bg-indigo-600/20 -bottom-40 -right-20 blur-3xl z-10"
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.15, 0.3, 0.15] 
                        }}
                        transition={{ 
                            repeat: Infinity,
                            duration: 15,
                            ease: "easeInOut",
                            delay: 1 
                        }}
                    />
                    
                    {/* Enhanced floating particles */}
                    <div className="absolute inset-0 z-10">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white"
                                style={{
                                    width: Math.random() * 6 + 2 + "px",
                                    height: Math.random() * 6 + 2 + "px",
                                    left: Math.random() * 100 + "%",
                                    top: Math.random() * 100 + "%",
                                    filter: "blur(1px)",
                                }}
                                animate={{
                                    y: [0, -(30 + Math.random() * 80)],
                                    opacity: [0, 0.7, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5 + Math.random() * 10,
                                    delay: Math.random() * 10,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="container mx-auto px-4 relative z-20">
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* Enhanced Content Column */}
                        <motion.div 
                            className="lg:w-1/2 mb-16 lg:mb-0 text-white"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative">
                                {/* Pre-heading accent */}
                                <motion.div 
                                    className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                        Trusted by 15,000+ customers
                                    </span>
                                </motion.div>

                                {/* Main heading with enhanced animation */}
                                <motion.h1
                                    className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <div className="overflow-hidden">
                                        <motion.div
                                            initial={{ y: 100 }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                        >
                                            Moving Made 
                                        </motion.div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <motion.div
                                            initial={{ y: 100 }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
                                            className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200"
                                        >
                                            Simple
                                            <span className="relative">
                                                <motion.svg
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}
                                                    className="absolute w-full -bottom-2 left-0 stroke-[3] stroke-yellow-300"
                                                    viewBox="0 0 120 10"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path 
                                                        d="M3 8C20 -3 40 12 60 8C80 4 100 8 117 3" 
                                                        strokeLinecap="round" 
                                                        style={{ pathLength: 1 }}
                                                    />
                                                </motion.svg>
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.h1>
                                
                                <motion.p 
                                    className="text-xl lg:text-2xl mb-8 lg:pr-12 text-blue-100/90 leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    Find reliable van operators for your move or delivery, all verified and ready to help you move with confidence.
                                </motion.p>
                                
                                {/* Enhanced Trust Badges */}
                                <motion.div 
                                    className="flex flex-wrap gap-3 mb-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1 }}
                                >
                                    <motion.div 
                                        className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                                        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.15)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-green-400" />
                                        </div>
                                        <span>Verified Providers</span>
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                                        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.15)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                            <FontAwesomeIcon icon={faLock} className="text-green-400" />
                                        </div>
                                        <span>£10M+ Insurance</span>
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                                        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.15)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                                            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                        </div>
                                        <span>4.8/5 (15K+ Reviews)</span>
                                    </motion.div>
                                </motion.div>
                                
                                {/* Enhanced Quick Quote Form */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10"
                                >
                                    <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/60 flex items-center justify-center mr-3 shadow-inner shadow-white/10">
                                            <FontAwesomeIcon icon={faTruck} className="text-white/90" />
                                        </div>
                                        Get an Instant Quote
                                    </h3>
                                    
                                    <form ref={formRef} onSubmit={handleQuickFormSubmit} className="space-y-5">
                                        {/* Service Type Select - Enhanced with premium styling */}
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-300" />
                                                What are you moving?
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    name="serviceType"
                                                    value={quickFormData.serviceType}
                                                    onChange={handleQuickFormChange}
                                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none transition"
                                                >
                                                    <option value="home" className="bg-gray-800 text-white">Home Move</option>
                                                    <option value="office" className="bg-gray-800 text-white">Office Move</option>
                                                    <option value="furniture" className="bg-gray-800 text-white">Single Item/Furniture</option>
                                                    <option value="vehicle" className="bg-gray-800 text-white">Vehicle Transport</option>
                                                    <option value="international" className="bg-gray-800 text-white">International Move</option>
                                                    <option value="specialty" className="bg-gray-800 text-white">Specialty Item</option>
                                                    <option value="storage" className="bg-gray-800 text-white">Storage Service</option>
                                                </select>
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                                                    {quickFormData.serviceType === 'home' && <FontAwesomeIcon icon={faTruck} />}
                                                    {quickFormData.serviceType === 'office' && <FontAwesomeIcon icon={faBusinessTime} />}
                                                    {quickFormData.serviceType === 'furniture' && <FontAwesomeIcon icon={faTruckLoading} />}
                                                    {quickFormData.serviceType === 'vehicle' && <FontAwesomeIcon icon={faTruck} />}
                                                    {quickFormData.serviceType === 'international' && <FontAwesomeIcon icon={faHandshake} />}
                                                    {quickFormData.serviceType === 'specialty' && <FontAwesomeIcon icon={faTools} />}
                                                    {quickFormData.serviceType === 'storage' && <FontAwesomeIcon icon={faWarehouse} />}
                                                </div>
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/50">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Locations Grid - Enhanced with glass morphism style */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-300" />
                                                    Moving From
                                                </label>
                                                <div className="relative">
                                                    <FontAwesomeIcon 
                                                        icon={faMapMarkerAlt} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="pickup_location"
                                                        value={quickFormData.pickup_location}
                                                        onChange={handleQuickFormChange}
                                                        placeholder="Enter postcode or address"
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/80 text-sm font-medium mb-2">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-300" />
                                                    Moving To
                                                </label>
                                                <div className="relative">
                                                    <FontAwesomeIcon 
                                                        icon={faMapMarkerAlt} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="dropoff_location"
                                                        value={quickFormData.dropoff_location}
                                                        onChange={handleQuickFormChange}
                                                        placeholder="Enter postcode or address"
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Date field - Enhanced with premium styling */}
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-300" />
                                                When do you need this service?
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon 
                                                    icon={faCalendarAlt} 
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={quickFormData.date}
                                                    onChange={handleQuickFormChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Contact details in a flex layout */}
                                        <div>
                                            <label className="block text-white/80 text-sm font-medium mb-2">
                                                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-300" />
                                                Contact Information
                                            </label>
                                            <div className="space-y-4">
                                                {/* Name field */}
                                                <div className="relative">
                                                    <FontAwesomeIcon 
                                                        icon={faUser} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="contact_name"
                                                        value={quickFormData.contact_name}
                                                        onChange={handleQuickFormChange}
                                                        placeholder="Your full name"
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Phone field */}
                                                    <div className="relative">
                                                        <FontAwesomeIcon 
                                                            icon={faPhone} 
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                        />
                                                        <input
                                                            type="tel"
                                                            name="contact_phone"
                                                            value={quickFormData.contact_phone}
                                                            onChange={handleQuickFormChange}
                                                            placeholder="Phone number"
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    {/* Email field */}
                                                    <div className="relative">
                                                        <FontAwesomeIcon 
                                                            icon={faEnvelope} 
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                        />
                                                        <input
                                                            type="email"
                                                            name="contact_email"
                                                            value={quickFormData.contact_email}
                                                            onChange={handleQuickFormChange}
                                                            placeholder="Email address"
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Error message with animation */}
                                        <AnimatePresence>
                                            {formError && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="bg-red-500/20 border border-red-500/30 text-white px-4 py-3 rounded-lg text-sm flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                                                    {formError}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Submit button with enhanced styling and animations */}
                                        <motion.button
                                            type="submit"
                                            disabled={isLoadingQuote}
                                            className="w-full py-4 rounded-lg font-medium text-lg flex items-center justify-center transition-all"
                                            initial={{ background: "linear-gradient(to right, #3b82f6, #6366f1)" }}
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                                                background: "linear-gradient(to right, #2563eb, #4f46e5)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{ 
                                                background: isLoadingQuote 
                                                    ? "linear-gradient(to right, #60a5fa, #818cf8)" 
                                                    : "linear-gradient(to right, #3b82f6, #6366f1)",
                                            }}
                                        >
                                            {isLoadingQuote ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Get Free Quotes</span>
                                                    <motion.span 
                                                        className="ml-2 z-10"
                                                        animate={{ x: [0, 4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowRight} />
                                                    </motion.span>
                                                </>
                                            )}
                                        </motion.button>
                                        
                                        <p className="text-xs text-center text-white/70 mt-3">
                                            Free, no-obligation quotes. Compare and save.
                                            <span className="block mt-2 opacity-80">
                                                By continuing, you agree to our <a href="/terms" className="underline hover:text-white transition-colors">Terms</a> and <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>
                                            </span>
                                        </p>
                                    </form>
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        {/* Enhanced Service Cards Column */}
                        <motion.div 
                            className="lg:w-1/2 lg:pl-12"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Hero service grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Service Card 1 - Home Moves */}
                                <motion.div
                                    className="rounded-2xl overflow-hidden relative group cursor-pointer h-[240px]"
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                        alt="Home Moving" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                        <h3 className="font-bold text-xl group-hover:text-yellow-300 transition-colors duration-300">Home Moves</h3>
                                        <div className="flex items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <FontAwesomeIcon icon={faTruck} className="text-blue-300 mr-2" />
                                            <span className="text-sm text-gray-300">Full house relocations</span>
                                        </div>
                                        <motion.div 
                                            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-80"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "70%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                                        />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-white">Most popular</div>
                                </motion.div>

                                {/* Service Card 2 - Office Moves */}
                                <motion.div
                                    className="rounded-2xl overflow-hidden relative group cursor-pointer h-[240px]"
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                        alt="Office Moving" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                        <h3 className="font-bold text-xl group-hover:text-yellow-300 transition-colors duration-300">Office Moves</h3>
                                        <div className="flex items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <FontAwesomeIcon icon={faBusinessTime} className="text-blue-300 mr-2" />
                                            <span className="text-sm text-gray-300">Minimize business downtime</span>
                                        </div>
                                        <motion.div 
                                            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-80"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "60%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Service Card 3 - Furniture Delivery */}
                                <motion.div
                                    className="rounded-2xl overflow-hidden relative group cursor-pointer h-[240px]"
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                        alt="Furniture Delivery" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                        <h3 className="font-bold text-xl group-hover:text-yellow-300 transition-colors duration-300">Furniture Delivery</h3>
                                        <div className="flex items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <FontAwesomeIcon icon={faTruckLoading} className="text-blue-300 mr-2" />
                                            <span className="text-sm text-gray-300">Assembly & placement</span>
                                        </div>
                                        <motion.div 
                                            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-80"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "50%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Service Card 4 - Specialty Items */}
                                <motion.div
                                    className="rounded-2xl overflow-hidden relative group cursor-pointer h-[240px]"
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                        alt="Specialty Items" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                        <h3 className="font-bold text-xl group-hover:text-yellow-300 transition-colors duration-300">Specialty Items</h3>
                                        <div className="flex items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <FontAwesomeIcon icon={faTools} className="text-blue-300 mr-2" />
                                            <span className="text-sm text-gray-300">Pianos, art & antiques</span>
                                        </div>
                                        <motion.div 
                                            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-80"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "80%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Enhanced Stats Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 mt-8 transform"
                            >
                                <div className="flex items-center justify-between">
                                    <motion.div 
                                        className="flex items-center"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-white/70">Service Categories</p>
                                            <p className="font-bold text-white text-lg">6+ Categories</p>
                                        </div>
                                    </motion.div>
                                    
                                    <div className="w-px h-12 bg-white/20"></div>
                                    
                                    <motion.div 
                                        className="flex items-center"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-white/70">Customer Satisfaction</p>
                                            <p className="font-bold text-white text-lg">98.3%</p>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                <div className="mt-6 flex justify-center">
                                    <motion.button
                                        onClick={scrollToServices}
                                        className="flex items-center text-white rounded-full px-6 py-3 backdrop-blur-sm transition-all overflow-hidden group relative"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/40 to-purple-500/40 group-hover:from-blue-500/40 group-hover:to-purple-600/40 transition-colors"></span>
                                        <span className="relative flex items-center">
                                            View all services
                                            <motion.span
                                                className="ml-2"
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </motion.span>
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                            
                            {/* Customer satisfaction badge */}
                            <motion.div
                                className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:right-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full p-1 shadow-xl"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.4, duration: 0.8, type: "spring" }}
                            >
                                <motion.div 
                                    className="bg-white rounded-full p-3 flex items-center justify-center"
                                    animate={{ rotate: [0, 10, 0] }}
                                    transition={{ 
                                        rotate: { 
                                            repeat: Infinity, 
                                            duration: 5, 
                                            ease: "easeInOut",
                                            type: "tween"
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center text-amber-500 text-lg">
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStarHalf} />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm">15,742 Moves</p>
                                        <p className="text-xs text-gray-600">and counting!</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Enhanced wave separator with animation */}
                <div className="absolute bottom-0 left-0 right-0">
                    <motion.svg 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 1440 200" 
                        className="fill-white dark:fill-gray-900 w-full"
                    >
                        <path d="M0,128L48,133.3C96,139,192,149,288,138.7C384,128,480,96,576,90.7C672,85,768,107,864,122.7C960,139,1056,149,1152,133.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </motion.svg>
                </div>
                
                {/* Fixed scroll indicator animation and enhanced hero section */}
                <motion.div 
                    className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white cursor-pointer z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ 
                        y: { 
                            delay: 2, 
                            duration: 2, 
                            repeat: Infinity, 
                            type: "tween" 
                        },
                        opacity: { delay: 2, duration: 1 }
                    }}
                    onClick={scrollToServices}
                >
                    <span className="text-xs mb-2 text-white/70">Scroll to explore</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </motion.div>
            </section>

            {/* Add this CSS */}
            <style>{`
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>

            <style jsx>{`
                /* Animation utilities */
                .animation-tween {
                    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .animation-spring {
                    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                /* Prevent animation conflicts */
                .no-animation-override {
                    animation: none !important;
                    transform: none !important;
                    transition: none !important;
                }
            `}</style>

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
                                    type: "spring", 
                                    stiffness: 100, 
                                    damping: 20 
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
                                        transition={{ duration: 0.6, ease: "easeOut" }}
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
                                        transition={{ type: "tween" }}
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

            {/* How It Works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How MoreVans Works</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Get your items moved in three simple steps with our efficient platform.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div 
                            className="relative text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 dark:text-blue-400 text-3xl" />
                                <span className="absolute -right-2 -top-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tell Us About Your Move</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">
                                Fill out our simple form with your moving details, items, and specific requirements.
                            </p>
                            
                            {/* Connector line (hidden on mobile) */}
                            <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-8"></div>
                        </motion.div>
                        
                        <motion.div 
                            className="relative text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FontAwesomeIcon icon={faUsers} className="text-blue-600 dark:text-blue-400 text-3xl" />
                                <span className="absolute -right-2 -top-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Compare & Choose</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">
                                Review quotes from verified providers, compare ratings and choose your perfect match.
                            </p>
                            
                            {/* Connector line (hidden on mobile) */}
                            <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-8"></div>
                        </motion.div>
                        
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FontAwesomeIcon icon={faTruck} className="text-blue-600 dark:text-blue-400 text-3xl" />
                                <span className="absolute -right-2 -top-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Track Your Move</h3>
                            <p className="text-gray-600 dark:text-gray-400 px-4">
                                Monitor your service in real-time, communicate with your provider, and rate them after completion.
                            </p>
                        </motion.div>
                    </div>
                    
                    <div className="mt-16 text-center">
                        <Link to="/how-it-works" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Learn More About Our Process
                            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Providers */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Top-Rated Moving Partners</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our network of verified and insured van operators ensures quality service for every move.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProviders.map((provider, index) => (
                            <motion.div 
                                key={provider.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div 
                                    className="h-48 relative bg-gradient-to-b from-transparent to-black/60"
                                    style={{ 
                                        backgroundImage: `url(${provider.backgroundImage})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <div className="flex items-center">
                                            <img 
                                                src={provider.image} 
                                                alt={provider.name} 
                                                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                            />
                                            <div className="ml-3">
                                                <h3 className="font-semibold text-lg">{provider.name}</h3>
                                                <div className="flex items-center text-sm">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-300" />
                                                    {provider.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="flex text-yellow-500 mr-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon 
                                                    key={i} 
                                                    icon={i < Math.floor(provider.rating) ? faStar : (i < provider.rating ? faStarHalf : faStar)} 
                                                    className={i < Math.floor(provider.rating) ? 'text-yellow-500' : (i < provider.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600')}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                                            {provider.rating} ({provider.reviewCount} reviews)
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{provider.description}</p>
                                    <div className="flex flex-wrap mb-4">
                                        {provider.services.map((service, index) => (
                                            <span 
                                                key={index} 
                                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                    <Link 
                                        to={`/providers/${provider.id}`}
                                        className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Link 
                            to="/providers" 
                            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View all providers
                            <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-sm" />
                        </Link>
                    </div>
                </div>
            </section>

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
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Hear what our customers have to say about their moving experiences.
                        </p>
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
                                                <FontAwesomeIcon 
                                                    key={i} 
                                                    icon={faStar} 
                                                    className={i < testimonials[currentSlide].rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} 
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xl text-gray-700 dark:text-gray-200 italic">
                                            "{testimonials[currentSlide].text}"
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <img 
                                            src={testimonials[currentSlide].image} 
                                            alt={testimonials[currentSlide].name} 
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
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
                                                className={`w-3 h-3 rounded-full ${
                                                    index === currentSlide 
                                                        ? 'bg-blue-600 dark:bg-blue-400' 
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
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
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
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
                                        <p className="text-gray-600 dark:text-gray-400">
                                            All moves are covered by our comprehensive insurance policy for added protection.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faUsers} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Verified Providers</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            We check credentials, licenses, and reviews before approving any provider on our platform.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faClock} className="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Reliable Service</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Our providers maintain a 98% on-time arrival rate and excellent service standards.
                                        </p>
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
                        
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
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
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Every booking includes coverage up to £50,000 for added peace of mind.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to Simplify Your Move?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
                            Join thousands of satisfied customers who have transformed their moving experience with MoreVans.
                        </p>
                        
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
                        
                        {/* App download links */}
                        <div className="mt-12">
                            <p className="text-blue-100 mb-4">Get our mobile app for easier booking and tracking</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <a href="#" className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg inline-flex items-center">
                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5227 19.3949C16.9479 20.0553 16.2573 19.9784 15.6006 19.6989C14.9054 19.4116 14.27 19.4021 13.5354 19.6989C12.6077 20.0784 12.1053 19.9858 11.5894 19.3949C8.76535 16.4644 9.17127 11.8492 12.3406 11.6831C13.1226 11.731 13.6737 12.1269 14.1289 12.1633C14.7926 12.0521 15.4205 11.6424 16.1435 11.7177C17.0665 11.8171 17.7586 12.2071 18.1867 12.8811C15.9438 14.146 16.3605 17.0324 18.3932 17.7846C17.9745 18.3694 17.5277 18.9459 17.5227 19.3949ZM13.9754 11.2977C13.9084 9.98302 14.9371 8.96029 16.1955 8.8513C16.3298 10.3593 14.8647 11.4609 13.9754 11.2977Z"/>
                                    </svg>
                                    <span>
                                        <span className="block text-xs">Download on the</span>
                                        <span className="block text-lg font-semibold">App Store</span>
                                    </span>
                                </a>
                                <a href="#" className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg inline-flex items-center">
                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6743 15.8921L19.1801 13.3863C19.3843 13.1821 19.5 12.9078 19.5 12.6213C19.5 12.3348 19.3843 12.0605 19.1801 11.8562L16.6743 9.35049C16.5618 9.23803 16.4088 9.17449C16.25 9.17449C16.0912 9.17449 15.9382 9.23803 15.8257 9.35049C15.7133 9.46296 15.6497 9.61598 15.6497 9.77479C15.6497 9.9336 15.7133 10.0866 15.8257 10.1991L17.7466 12.12H8.85711C8.69786 12.12 8.54458 12.1837 8.43192 12.2964C8.31926 12.409 8.25557 12.5623 8.25557 12.7216C8.25557 12.8808 8.31926 13.0341 8.43192 13.1468C8.54458 13.2594 8.69786 13.3231 8.85711 13.3231H17.7463L15.8257 15.2437C15.7133 15.3562 15.6497 15.5092 15.6497 15.668C15.6497 15.8268 15.7133 15.9798 15.8257 16.0923C15.9382 16.2048 16.0912 16.2683 16.25 16.2683C16.4088 16.2683 16.5618 16.2048 16.6743 16.0923L16.6743 15.8921Z"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.31901 7.052C6.76101 6.611 7.45901 6.5 7.99901 6.5H9.06601C9.30101 6.5 9.51401 6.358 9.62601 6.148L10.402 4.685C10.7391 4.033 11.391 3.599 12.124 3.584H12.143C12.888 3.584 13.558 4.018 13.905 4.69L14.641 6.142C14.753 6.354 14.966 6.5 15.201 6.5H16.5C17.039 6.5 17.738 6.611 18.18 7.052C18.628 7.493 18.75 8.186 18.75 8.735V17.083C18.75 17.612 18.628 18.288 18.18 18.729C17.738 19.17 17.039 19.25 16.5 19.25H7.99901C7.45901 19.25 6.76101 19.17 6.31901 18.729C5.87501 18.288 5.75 17.612 5.75 17.083V8.735C5.75 8.186 5.87501 7.493 6.31901 7.052ZM7.41101 8.154C7.32801 8.236 7.24901 8.426 7.24901 8.735V17.083C7.24901 17.384 7.32801 17.564 7.41101 17.646C7.49701 17.729 7.67701 17.75 7.99901 17.75H16.5C16.822 17.75 17.001 17.729 17.087 17.646C17.171 17.564 17.25 17.384 17.25 17.083V8.735C17.25 8.426 17.171 8.236 17.087 8.154C17.001 8.071 16.822 8 16.5 8H15.201C14.496 8 13.858 7.562 13.522 6.925L12.786 5.471C12.708 5.317 12.555 5.084 12.143 5.084H12.134C11.731 5.09 11.594 5.313 11.516 5.466L10.74 6.929C10.404 7.566 9.76601 8 9.06601 8H7.99901C7.67701 8 7.49701 8.071 7.41101 8.154Z"/>
                                    </svg>
                                    <span>
                                        <span className="block text-xs">GET IT ON</span>
                                        <span className="block text-lg font-semibold">Google Play</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
