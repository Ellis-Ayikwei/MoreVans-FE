import { faClipboardList, faStar, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

interface FeaturedProvider {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    description: string;
    services: string[];
}

interface Testimonial {
    id: number;
    name: string;
    image: string;
    text: string;
    rating: number;
}

const Homepage: React.FC = () => {
    // Mock featured providers
    const featuredProviders: FeaturedProvider[] = [
        {
            id: 1,
            name: 'Express Movers',
            image: 'https://via.placeholder.com/150',
            rating: 4.8,
            reviewCount: 124,
            description: 'Specializing in residential moves with 5+ years of experience',
            services: ['Furniture', 'Boxes', 'Electronics'],
        },
        {
            id: 2,
            name: 'City Logistics',
            image: 'https://via.placeholder.com/150',
            rating: 4.6,
            reviewCount: 98,
            description: 'Fast and reliable commercial moving services',
            services: ['Commercial', 'Office Equipment', 'Furniture'],
        },
        {
            id: 3,
            name: 'Safe Transport',
            image: 'https://via.placeholder.com/150',
            rating: 4.9,
            reviewCount: 156,
            description: 'Specialized in fragile item transportation',
            services: ['Electronics', 'Antiques', 'Artwork'],
        },
    ];

    // Mock testimonials
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            image: 'https://via.placeholder.com/80',
            text: 'MoveIt made my apartment move so easy! The provider was professional and everything arrived safely.',
            rating: 5,
        },
        {
            id: 2,
            name: 'Michael Brown',
            image: 'https://via.placeholder.com/80',
            text: 'Great service for my office relocation. Competitive pricing and excellent communication throughout.',
            rating: 4,
        },
        {
            id: 3,
            name: 'Jennifer Lee',
            image: 'https://via.placeholder.com/80',
            text: 'I needed to transport a fragile antique, and they handled it with extreme care. Highly recommend!',
            rating: 5,
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fast & Reliable Logistics Solutions</h1>
                            <p className="text-xl mb-8">Connect with trusted providers to move your items safely and efficiently.</p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/service-request" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg inline-block text-center">
                                    Request a Move
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium text-lg inline-block text-center"
                                >
                                    Become a Provider
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="/images/hero-image.svg"
                                alt="Logistics illustration"
                                className="w-full"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/600x400?text=Logistics+Service';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Request a Service</h3>
                            <p className="text-gray-600">Fill out our simple form with your moving details and requirements.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                            <p className="text-gray-600">Review quotes from verified providers and choose the best fit.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faTruck} className="text-blue-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Track Your Move</h3>
                            <p className="text-gray-600">Monitor your service in real-time and communicate with your provider.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Providers Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Providers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProviders.map((provider) => (
                            <div key={provider.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <img src={provider.image} alt={provider.name} className="w-16 h-16 rounded-full mr-4" />
                                        <div>
                                            <h3 className="font-semibold text-lg">{provider.name}</h3>
                                            <div className="flex items-center">
                                                <div className="flex text-yellow-500 mr-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} className={i < Math.floor(provider.rating) ? 'text-yellow-500' : 'text-gray-300'} />
                                                    ))}
                                                </div>
                                                <span className="text-gray-600 text-sm">
                                                    {provider.rating} ({provider.reviewCount} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{provider.description}</p>
                                    <div className="flex flex-wrap">
                                        {provider.services.map((service, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Move?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who have simplified their moving experience with MoveIt.</p>
                    <Link to="/service-request" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg inline-block mr-4">
                        Request a Move
                    </Link>
                    <Link to="/register" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-lg inline-block">
                        Become a Provider
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
