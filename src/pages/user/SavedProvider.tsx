import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, 
  faStar, 
  faStarHalfAlt,
  faTruck, 
  faMapMarkedAlt, 
  faPhone,
  faEnvelope,
  faTimesCircle,
  faCheckCircle,
  faSearch,
  faFilter,
  faSort,
  faShieldAlt,
  faCommentAlt,
  faExternalLinkAlt,
  faCalendarAlt,
  faThumbsUp,
  faArrowRight,
  faInfoCircle,
  faEye,
  faListUl,
  faThLarge,
  faExclamationTriangle,
  faSync,
  faDownload,
  faTrashAlt,
  faCaretDown,
  faEllipsisV,
  faHeart,
  faHistory,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProviderModal from '../../components/Provider/ProviderPopup';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Custom debounce hook implementation
const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Review interface for provider
interface ProviderReview {
  text: string;
  rating: number;
  author: string;
  date: string;
}

// Provider interface that matches what ProviderModal expects
interface Provider {
  id: string | number;
  name: string;
  rating: number;
  verified: boolean;
  vehicleType: string;
  capacity: string;
  serviceRadius: string;
  price: string | number;
  additionalInfo?: string;
  phone?: string;
  email?: string;
  description?: string;
  joinedDate?: string;
  serviceTypes?: string[];
  reviews: ProviderReview[];
  profileImage: string;
  vehicleImages?: string[];
  documents?: {verified: boolean}[];
  availability?: string;
  completionRate?: number;
  responseTime?: string;
  location?: string;
}

// Simple saved provider interface (extends Provider to be compatible with modal)
interface SavedProvider extends Provider {
  lastBooked?: string;
  isFavorite?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'rating' | 'price' | 'lastBooked';
type SortDirection = 'asc' | 'desc';

// Create a skeleton loading card component
const ProviderCardSkeleton: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse";
  
  return viewMode === 'grid' ? (
    <div className={baseClasses}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
            <div>
              <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
          <div className="h-6 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="mt-5 flex gap-2">
          <div className="h-9 w-16 bg-green-200 dark:bg-green-900/30 rounded"></div>
          <div className="h-9 w-24 bg-purple-200 dark:bg-purple-900/30 rounded"></div>
          <div className="h-9 w-28 ml-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="mt-3 h-12 bg-blue-200 dark:bg-blue-900/30 rounded"></div>
      </div>
    </div>
  ) : (
    <div className={`${baseClasses} flex`}>
      <div className="p-4 flex-shrink-0">
        <div className="h-20 w-20 rounded-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="p-4 flex-1">
        <div className="flex justify-between">
          <div>
            <div className="h-5 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
          <div className="h-6 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
      <div className="p-4 flex-shrink-0 flex flex-col justify-between border-l border-gray-200 dark:border-gray-700">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-32 bg-blue-200 dark:bg-blue-900/30 rounded"></div>
      </div>
    </div>
  );
};

// Error state component
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 mb-4">
      <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl" />
    </div>
    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Unable to load providers</h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
      {message}
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FontAwesomeIcon icon={faSync} className="mr-2" />
      Retry
    </button>
  </div>
);

// Empty state component with enhanced design
const EmptyState: React.FC = () => (
  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-50"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 dark:bg-yellow-500/10 rounded-full opacity-20"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-200 dark:bg-green-500/10 rounded-full opacity-20"></div>
    </div>
    
    <div className="relative z-10">
      <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faBookmark} className="text-blue-500 dark:text-blue-400 text-3xl" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No saved providers yet</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        You haven't saved any service providers yet. When you find providers you like, 
        save them here for quick access whenever you need their services.
      </p>
      
      <Link
        to="/providers"
        className="inline-flex items-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
      >
        <FontAwesomeIcon icon={faSearch} className="mr-2" />
        Browse Available Providers
      </Link>
    </div>
  </div>
);

// Provider Card Component
const ProviderCard: React.FC<{
  provider: SavedProvider;
  onRemove: (id: string) => void;
  onView: (provider: SavedProvider) => void;
  viewMode: ViewMode;
  onFavoriteToggle: (id: string) => void;
}> = ({ provider, onRemove, onView, viewMode, onFavoriteToggle }) => {
  // Use intersection observer for lazy loading and animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  
  // Animation variants for staggered appearance
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  // Format price display
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `GHS ${price.toLocaleString()}`;
    }
    return price;
  };
  
  // Last booked date formatter
  const formatLastBooked = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };
  
  // List view rendering
  if (viewMode === 'list') {
    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex"
      >
        {/* Provider Image & Status */}
        <div className="p-4 border-r border-gray-100 dark:border-gray-700 flex items-center">
          <div className="relative">
            <img 
              src={provider.profileImage} 
              alt={provider.name}
              loading="lazy"
              className="h-20 w-20 object-cover rounded-lg shadow-sm" 
            />
            {provider.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-white dark:ring-gray-700">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
              </div>
            )}
          </div>
        </div>
        
        {/* Provider Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg inline-flex items-center">
                {provider.name}
                <button 
                  onClick={() => onFavoriteToggle(provider.id.toString())}
                  className={`ml-2 focus:outline-none ${
                    provider.isFavorite 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400'
                  }`}
                  aria-label={provider.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </h3>
              <div className="flex items-center text-sm mt-1">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => {
                    if (i < Math.floor(provider.rating)) {
                      return <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />;
                    } else if (i === Math.floor(provider.rating) && provider.rating % 1 >= 0.5) {
                      return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400" />;
                    } else {
                      return <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 dark:text-gray-600" />;
                    }
                  })}
                </div>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {provider.rating} ({provider.reviews.length} reviews)
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => onView(provider)}
                className="mr-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                title="View provider profile"
              >
                <FontAwesomeIcon icon={faEye} className="text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onRemove(provider.id.toString())}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full"
                title="Remove from saved providers"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
              </button>
            </div>
          </div>
          
          {/* Service Types & Info */}
          <div className="flex flex-wrap gap-2 mt-3">
            {provider.serviceTypes?.slice(0, 3).map((service, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium inline-flex items-center"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1 text-blue-500 dark:text-blue-400 text-xs" />
                {service}
              </span>
            ))}
            {(provider.serviceTypes?.length || 0) > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                +{(provider.serviceTypes?.length || 0) - 3} more
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <div className="flex items-start text-sm">
              <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{provider.vehicleType}</span>
            </div>
            <div className="flex items-start text-sm">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{provider.location}</span>
            </div>
            {provider.completionRate && (
              <div className="flex items-start text-sm">
                <FontAwesomeIcon icon={faThumbsUp} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{provider.completionRate}% Completion</span>
              </div>
            )}
          </div>
          
          {provider.lastBooked && (
            <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 mt-2">
              <FontAwesomeIcon icon={faHistory} className="mt-0.5 mr-2 w-3 flex-shrink-0" />
              Last booked: {formatLastBooked(provider.lastBooked)}
            </div>
          )}
        </div>
        
        {/* Actions Column */}
        <div className="p-4 border-l border-gray-100 dark:border-gray-700 flex flex-col items-center justify-between">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Starting at</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatPrice(provider.price)}</div>
          </div>
          
          <button
            onClick={() => window.location.href = `/book/${provider.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center w-full"
          >
            Book Now
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </motion.div>
    );
  }
  
  // Grid view rendering (default)
  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10"></div>
        <div className="p-6">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src={provider.profileImage} 
                  alt={provider.name}
                  loading="lazy"
                  className="h-16 w-16 rounded-full object-cover mr-4 ring-2 ring-white dark:ring-gray-700 shadow-sm" 
                />
                {provider.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-white dark:ring-gray-700">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{provider.name}</h3>
                  <button 
                    onClick={() => onFavoriteToggle(provider.id.toString())}
                    className={`ml-2 focus:outline-none ${
                      provider.isFavorite 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400'
                    }`}
                    aria-label={provider.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(provider.rating)) {
                        return <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />;
                      } else if (i === Math.floor(provider.rating) && provider.rating % 1 >= 0.5) {
                        return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400" />;
                      } else {
                        return <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 dark:text-gray-600" />;
                      }
                    })}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {provider.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={() => onRemove(provider.id.toString())}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Remove from saved providers"
                title="Remove from saved"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
          </div>
          
          {/* Price Tag */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium shadow-sm">
            {formatPrice(provider.price)}
          </div>
          
          {/* Service Type Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {provider.serviceTypes?.slice(0, 2).map((service, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium inline-flex items-center"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1 text-blue-500 dark:text-blue-400 text-xs" />
                {service}
              </span>
            ))}
            {(provider.serviceTypes?.length || 0) > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                +{(provider.serviceTypes?.length || 0) - 2} more
              </span>
            )}
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-start text-sm">
              <FontAwesomeIcon icon={faTruck} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{provider.vehicleType}</span>
            </div>
            <div className="flex items-start text-sm">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{provider.location}</span>
            </div>
            {provider.completionRate && (
              <div className="flex items-start text-sm">
                <FontAwesomeIcon icon={faThumbsUp} className="text-gray-400 dark:text-gray-500 mt-0.5 mr-2 w-4 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{provider.completionRate}% Completion Rate</span>
              </div>
            )}
            
            {provider.lastBooked && (
              <div className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faHistory} className="mt-0.5 mr-2 w-3 flex-shrink-0" />
                Last booked: {formatLastBooked(provider.lastBooked)}
              </div>
            )}
          </div>
          
          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => window.location.href = `tel:${provider.phone}`}
              className="flex items-center justify-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              <FontAwesomeIcon icon={faPhone} className="mr-1" />
              Call
            </button>
            <button
              onClick={() => alert(`Message functionality to ${provider.name}`)}
              className="flex items-center justify-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              <FontAwesomeIcon icon={faCommentAlt} className="mr-1" />
              Message
            </button>
            <button
              onClick={() => onView(provider)}
              className="flex items-center justify-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm ml-auto transition-colors"
            >
              <FontAwesomeIcon icon={faEye} className="mr-1" />
              Profile
            </button>
          </div>
          
          {/* Main Action Button */}
          <button
            onClick={() => window.location.href = `/book/${provider.id}`}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow"
          >
            Book This Provider
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Sort menu component
const SortMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSort: (option: SortOption, direction: SortDirection) => void;
  currentSort: { option: SortOption; direction: SortDirection };
  buttonRef: React.RefObject<HTMLButtonElement>;
}> = ({ isOpen, onClose, onSort, currentSort, buttonRef }) => {
  if (!isOpen) return null;
  
  const options: Array<{ value: SortOption; label: string }> = [
    { value: 'name', label: 'Provider Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'price', label: 'Price' },
    { value: 'lastBooked', label: 'Last Booked' },
  ];

  const handleOptionClick = (option: SortOption) => {
    const newDirection = currentSort.option === option && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(option, newDirection);
    onClose();
  };

  // Calculate position based on button
  const buttonRect = buttonRef.current?.getBoundingClientRect();
  const top = buttonRect ? buttonRect.bottom + window.scrollY + 5 : 0;
  const right = buttonRect ? window.innerWidth - buttonRect.right : 0;

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-30 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2 w-48"
        style={{ top, right }}
      >
        <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          Sort by
        </div>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className="px-3 py-2 w-full text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300"
          >
            <span>{option.label}</span>
            {currentSort.option === option.value && (
              <FontAwesomeIcon 
                icon={faCaretDown} 
                className={`ml-2 transform ${currentSort.direction === 'desc' ? '' : 'rotate-180'}`} 
              />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
};

// Main component
const SavedProviders: React.FC = () => {
  const [providers, setProviders] = useState<SavedProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<SavedProvider | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'top-rated' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [savedFeedback, setSavedFeedback] = useState<{id: string, message: string} | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    // Simulate API call to fetch saved providers
    const fetchSavedProviders = async () => {
      try {
        // Mock data
        const mockProviders: SavedProvider[] = [
          {
            id: 'prov1',
            name: "Kwame's Moving Services",
            rating: 4.8,
            serviceTypes: ['Furniture Moving', 'Office Relocation'],
            location: 'Accra, Ghana',
            phone: '+233 50 123 4567',
            verified: true,
            profileImage: 'https://via.placeholder.com/150',
            lastBooked: '2024-12-10',
            vehicleType: 'Large Moving Van',
            capacity: '1500kg',
            serviceRadius: '50km',
            price: 500,
            joinedDate: 'January 2022',
            description: 'We specialize in residential and commercial moves with careful handling of your belongings.',
            reviews: [
              {
                text: "Very professional service. On time and careful with my furniture.",
                rating: 5,
                author: "John D.",
                date: "January 2025"
              },
              {
                text: "Great service, would use again!",
                rating: 4.5,
                author: "Sarah M.",
                date: "December 2024"
              }
            ],
            completionRate: 98,
            responseTime: '< 1 hour'
          },
          {
            id: 'prov2',
            name: "Fast Track Logistics",
            rating: 4.5,
            serviceTypes: ['Home Moving', 'Furniture Assembly'],
            location: 'Kumasi, Ghana',
            phone: '+233 55 987 6543',
            verified: true,
            profileImage: 'https://via.placeholder.com/150',
            lastBooked: '2025-01-15',
            vehicleType: 'Medium Van',
            capacity: '800kg',
            serviceRadius: '30km',
            price: 350,
            joinedDate: 'March 2023',
            description: 'Fast and reliable moving services with furniture assembly options available.',
            reviews: [
              {
                text: "Quick service but was a bit rough with my items.",
                rating: 3,
                author: "Michael K.",
                date: "January 2025"
              },
              {
                text: "Great assembly service, saved me hours of work!",
                rating: 5,
                author: "Patricia L.",
                date: "November 2024"
              }
            ],
            completionRate: 95,
            responseTime: '< 2 hours'
          },
          {
            id: 'prov3',
            name: "Eagle Transport Solutions",
            rating: 4.9,
            serviceTypes: ['Commercial Moving', 'Storage Solutions'],
            location: 'Tamale, Ghana',
            phone: '+233 24 111 2222',
            verified: false,
            profileImage: 'https://via.placeholder.com/150',
            vehicleType: 'Large Truck',
            capacity: '3000kg',
            serviceRadius: '100km',
            price: 800,
            description: 'Specializing in large commercial moves and businesses relocations with storage options.',
            joinedDate: 'May 2021',
            reviews: [
              {
                text: "Excellent for our office move. Very organized and efficient.",
                rating: 5,
                author: "Corporate Client",
                date: "February 2025"
              }
            ],
            completionRate: 99,
            responseTime: 'Same day'
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        setProviders(mockProviders);
        setLoading(false);
      } catch (err) {
        setError('Failed to load providers. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchSavedProviders();
  }, []);

  const openProviderModal = (provider: SavedProvider) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const removeProvider = (id: string) => {
    // Store the provider name before removing it
    const providerToRemove = providers.find(p => p.id === id);
    if (!providerToRemove) return;
    
    setProviders(prevProviders => prevProviders.filter(provider => provider.id !== id));
    
    // Show feedback message
    setSavedFeedback({
      id: id,
      message: `${providerToRemove.name} removed from saved providers`
    });
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setSavedFeedback(null);
    }, 3000);
  };
  
  const toggleFavorite = (id: string) => {
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.id === id ? { ...provider, isFavorite: !provider.isFavorite } : provider
      )
    );
  };
  
  // Apply filters and search
  const getFilteredProviders = () => {
    let filtered = [...providers];
    
    // Apply search term
    filtered = filtered.filter(provider => 
      provider.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      provider.serviceTypes?.some(service => service.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      provider.location?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    
    // Apply active filter
    if (activeFilter === 'recent') {
      filtered.sort((a, b) => {
        if (!a.lastBooked && !b.lastBooked) return 0;
        if (!a.lastBooked) return 1;
        if (!b.lastBooked) return -1;
        return new Date(b.lastBooked).getTime() - new Date(a.lastBooked).getTime();
      });
    } else if (activeFilter === 'top-rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === 'favorites') {
      filtered = filtered.filter(provider => provider.isFavorite);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortOption];
      const bValue = b[sortOption];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };
  
  const filteredProviders = getFilteredProviders();

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Feedback Toast */}
      {savedFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>{savedFeedback.message}</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Providers</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Quick access to your favorite service providers
          </p>
        </div>
        
        {/* Search and filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search for providers or services..."
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-sm ${
                  activeFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-2 text-sm ${
                  activeFilter === 'recent' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650'
                }`}
              >
                Recently Used
              </button>
              <button 
                onClick={() => setActiveFilter('top-rated')}
                className={`px-4 py-2 text-sm ${
                  activeFilter === 'top-rated' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650'
                }`}
              >
                Top Rated
              </button>
              <button 
                onClick={() => setActiveFilter('favorites')}
                className={`px-4 py-2 text-sm ${
                  activeFilter === 'favorites' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650'
                }`}
              >
                Favorites
              </button>
            </div>
            
            <div className="relative">
              <button 
                ref={sortButtonRef}
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center"
              >
                <FontAwesomeIcon icon={faSort} className="mr-2" />
                Sort
              </button>
              <AnimatePresence>
                {isSortMenuOpen && (
                  <SortMenu 
                    isOpen={isSortMenuOpen} 
                    onClose={() => setIsSortMenuOpen(false)} 
                    onSort={(option, direction) => {
                      setSortOption(option);
                      setSortDirection(direction);
                    }}
                    currentSort={{ option: sortOption, direction: sortDirection }}
                    buttonRef={sortButtonRef}
                  />
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center"
            >
              <FontAwesomeIcon icon={viewMode === 'grid' ? faListUl : faThLarge} className="mr-2" />
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProviderCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : filteredProviders.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'gap-4'}`}>
            {filteredProviders.map((provider) => (
              <ProviderCard 
                key={provider.id}
                provider={provider}
                onRemove={removeProvider}
                onView={openProviderModal}
                viewMode={viewMode}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      
      {/* Provider Modal */}
      {selectedProvider && (
        <ProviderModal 
          isOpen={showProviderModal} 
          onClose={() => setShowProviderModal(false)} 
          provider={selectedProvider} 
          onSave={(id) => {
            // Handle save action
            toggleFavorite(id.toString());
          }}
          onContact={(id) => {
            // Handle contact action
            window.location.href = `tel:${selectedProvider.phone}`;
          }}
        />
      )}
    </div>
  );
};

export default SavedProviders;