import { faBookmark, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface ProviderReview {
    text: string;
    rating: number;
    author: string;
    date: string;
}

interface Provider {
    id: number;
    name: string;
    rating: number;
    verified: boolean;
    vehicleType: string;
    capacity: string;
    serviceRadius: string;
    price: string;
    reviews: ProviderReview[];
    profileImage: string;
}

interface ProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: Provider;
}

const ProviderModal: React.FC<ProviderModalProps> = ({ isOpen, onClose, provider }) => {
    const [showFullReviews, setShowFullReviews] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const renderRatingStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-400" />
                ))}
                {hasHalfStar && <FontAwesomeIcon icon={faStar} className="text-yellow-400 opacity-50" />}
                <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
            <div className="bg-white rounded-xl w-full max-w-lg relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close modal">
                    <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Provider Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <img src={provider.profileImage} alt={provider.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-100" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-800">{provider.name}</h2>
                                {provider.verified && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">✅ Verified</span>}
                            </div>
                            <div className="mt-1">
                                {renderRatingStars(provider.rating)}
                                <p className="text-sm text-gray-500 mt-1">50+ Trips Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Vehicle Type</p>
                            <p className="font-medium">🚚 {provider.vehicleType}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Capacity</p>
                            <p className="font-medium">📦 {provider.capacity}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Service Area</p>
                            <p className="font-medium">📍 {provider.serviceRadius}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Starting Price</p>
                            <p className="font-medium">💰 {provider.price}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button onClick={() => (window.location.href = `/book/${provider.id}`)} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Book Now
                        </button>
                        <button
                            className="px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => {
                                /* Implement save functionality */
                            }}
                        >
                            <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                            Save
                        </button>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                        {provider.reviews.slice(0, showFullReviews ? undefined : 1).map((review, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {renderRatingStars(review.rating)}
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-gray-800">"{review.text}"</p>
                                <p className="text-sm text-gray-500 mt-1">- {review.author}</p>
                            </div>
                        ))}

                        {provider.reviews.length > 1 && (
                            <button onClick={() => setShowFullReviews(!showFullReviews)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                {showFullReviews ? 'Show fewer reviews' : `View all ${provider.reviews.length} reviews →`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderModal;
