import { 
  faBox, faCalendarAlt, faLocationDot, faMoneyBill, faSearch, faStar, 
  faTruck, faFilter, faMapMarkedAlt, faExchangeAlt, faTag, faClock,
  faListAlt, faChevronDown, faChevronUp, faInfoCircle, faToolbox,
  faSortAmountUp, faSortAmountDown, faBell, faLayerGroup, faArrowRight,
  faBolt, faGavel, faRoute, faEye, faThumbsUp, faHeart, faHeartBroken,
  faAward, faSave, faBookmark,
  faSyncAlt,
  faExclamationCircle,
  faUser,
  faWeight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash'; // Add this to your dependencies if not already there

// Improved interfaces
interface Stop {
  pickup: string;
  dropoff: string;
  time?: string;
}

interface Job {
  id: string;
  jobType: 'instant' | 'auction' | 'journey';
  status: 'open' | 'bidding' | 'assigned' | 'completed' | 'cancelled';
  createdAt: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  stops?: Stop[];
  itemType: string;
  itemSize: string;
  preferredDate: string;
  preferredTime: string;
  description?: string;
  customerName: string;
  customerRating?: number;
  estimatedValue: number;
  bids: Bid[];
  distance: number;
  priority?: boolean;
  expiresAt?: string;
  itemCount?: number;
  weight?: string;
  dimensions?: string;
  urgency?: 'low' | 'medium' | 'high';
  image?: string;
  customerAvatar?: string;
}

interface Bid {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  estimatedTime: string;
  message?: string;
  createdAt: string;
}

interface FilterState {
  jobType: string;
  distance: number | null;
  minValue: number | null;
  maxValue: number | null;
  date: string | null;
  itemType: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

// Enhanced job board component
const JobBoard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    jobType: 'all',
    distance: null,
    minValue: null,
    maxValue: null,
    date: null,
    itemType: null,
    sortBy: 'date',
    sortDirection: 'desc'
  });
  
  const filtersRef = useRef<HTMLDivElement>(null);

  // Setup debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    fetchJobs();
    
    // Load saved jobs from localStorage
    const savedJobsFromStorage = localStorage.getItem('savedJobs');
    if (savedJobsFromStorage) {
      setSavedJobs(JSON.parse(savedJobsFromStorage));
    }
    
    // Close filters when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced fetch jobs function with more detailed mock data
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockJobs: Job[] = [
        {
          id: 'JOB-12345',
          jobType: 'instant',
          status: 'open',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          pickupLocation: '123 Main St, London, UK',
          dropoffLocation: '456 Park Ave, London, UK',
          itemType: 'furniture',
          itemSize: 'large',
          preferredDate: '2025-04-15',
          preferredTime: '14:00',
          description: 'Large sofa and coffee table, need careful handling',
          customerName: 'John Smith',
          customerRating: 4.7,
          estimatedValue: 120,
          bids: [],
          distance: 3.2,
          priority: true,
          expiresAt: new Date(Date.now() + 3600000 * 5).toISOString(),
          itemCount: 2,
          weight: '200 lbs',
          dimensions: '6ft x 4ft x 3ft',
          urgency: 'high',
          image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          customerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 'JOB-12346',
          jobType: 'auction',
          status: 'bidding',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          pickupLocation: '78 Oxford Street, London, UK',
          dropoffLocation: '23 Camden High St, London, UK',
          itemType: 'electronics',
          itemSize: 'medium',
          preferredDate: '2025-04-20',
          preferredTime: '10:00',
          description: 'Computer equipment including monitors and desktop PCs',
          customerName: 'Emily Johnson',
          customerRating: 4.9,
          estimatedValue: 200,
          bids: [
            {
              id: 'BID-001',
              providerId: 'PROV-1',
              providerName: 'Fast Movers Ltd',
              amount: 180,
              estimatedTime: '2 hours',
              message: 'We can handle this with care and efficiency',
              createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
            },
            {
              id: 'BID-002',
              providerId: 'PROV-2',
              providerName: 'City Transport Co',
              amount: 195,
              estimatedTime: '1.5 hours',
              message: 'Premium service with insurance coverage',
              createdAt: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
            }
          ],
          distance: 5.7,
          priority: false,
          itemCount: 4,
          weight: '150 lbs',
          dimensions: 'Various sizes',
          urgency: 'medium',
          customerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 'JOB-12347',
          jobType: 'journey',
          status: 'open',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          stops: [
            {
              pickup: '10 Downing St, London, UK',
              dropoff: '20 Charing Cross Rd, London, UK',
              time: '09:00'
            },
            {
              pickup: '30 Leicester Square, London, UK',
              dropoff: '45 Covent Garden, London, UK',
              time: '11:00'
            },
            {
              pickup: '15 Mayfair, London, UK',
              dropoff: '5 Piccadilly Circus, London, UK',
              time: '13:00'
            }
          ],
          itemType: 'boxes',
          itemSize: 'small',
          preferredDate: '2025-04-18',
          preferredTime: '09:00',
          description: 'Multiple package pickup and delivery for a retail chain',
          customerName: 'London Retail Co.',
          customerRating: 4.8,
          estimatedValue: 350,
          bids: [],
          distance: 12.5,
          priority: true,
          itemCount: 15,
          weight: '300 lbs total',
          urgency: 'high',
          customerAvatar: 'https://randomuser.me/api/portraits/men/65.jpg'
        },
        {
          id: 'JOB-12348',
          jobType: 'instant',
          status: 'open',
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          pickupLocation: '55 Baker Street, London, UK',
          dropoffLocation: '102 Regent Street, London, UK',
          itemType: 'appliances',
          itemSize: 'large',
          preferredDate: '2025-04-15',
          preferredTime: '16:30',
          description: 'Washing machine delivery with installation service required',
          customerName: 'Michael Brown',
          customerRating: 4.2,
          estimatedValue: 95,
          bids: [],
          distance: 2.1,
          expiresAt: new Date(Date.now() + 3600000 * 3).toISOString(), // 3 hours from now
          itemCount: 1,
          weight: '180 lbs',
          dimensions: '25in x 25in x 35in',
          urgency: 'medium',
          customerAvatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        {
          id: 'JOB-12349',
          jobType: 'auction',
          status: 'bidding',
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          pickupLocation: '200 Westminster Bridge Rd, London, UK',
          dropoffLocation: '10 Grosvenor Square, London, UK',
          itemType: 'specialty',
          itemSize: 'medium',
          preferredDate: '2025-04-30',
          preferredTime: '11:00',
          description: 'Antique furniture pieces that require special care and handling',
          customerName: 'Victoria Hughes',
          customerRating: 5.0,
          estimatedValue: 500,
          bids: [
            {
              id: 'BID-003',
              providerId: 'PROV-3',
              providerName: 'Elite Moving Services',
              amount: 450,
              estimatedTime: '3 hours',
              message: 'Specialized in antique transportation with insurance',
              createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ],
          distance: 4.3,
          priority: false,
          itemCount: 3,
          weight: '250 lbs',
          dimensions: 'Various antique pieces',
          urgency: 'low',
          image: 'https://images.unsplash.com/photo-1569597970494-7013ab6be3a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          customerAvatar: 'https://randomuser.me/api/portraits/women/12.jpg'
        },
        {
          id: 'JOB-12350',
          jobType: 'journey',
          status: 'open',
          createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          stops: [
            {
              pickup: '30 Euston Rd, London, UK',
              dropoff: '45 Kings Cross Rd, London, UK',
              time: '10:00'
            },
            {
              pickup: '15 Liverpool St, London, UK',
              dropoff: '8 Canary Wharf, London, UK',
              time: '13:00'
            }
          ],
          itemType: 'boxes',
          itemSize: 'medium',
          preferredDate: '2025-04-22',
          preferredTime: '10:00',
          description: 'Office relocation project with multiple pickups and dropoffs',
          customerName: 'Global Tech Ltd',
          customerRating: 4.5,
          estimatedValue: 280,
          bids: [],
          distance: 8.7,
          priority: false,
          itemCount: 22,
          weight: '450 lbs total',
          urgency: 'medium',
          customerAvatar: 'https://randomuser.me/api/portraits/women/28.jpg'
        },
        {
          id: 'JOB-12351',
          jobType: 'instant',
          status: 'open',
          createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          pickupLocation: '17 Notting Hill Gate, London, UK',
          dropoffLocation: '200 Kensington High St, London, UK',
          itemType: 'furniture',
          itemSize: 'small',
          preferredDate: '2025-04-16',
          preferredTime: '09:30',
          description: 'Small dining table and chairs set',
          customerName: 'David Wilson',
          customerRating: 4.1,
          estimatedValue: 75,
          bids: [],
          distance: 1.8,
          expiresAt: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
          itemCount: 5,
          weight: '120 lbs',
          dimensions: '4ft x 3ft x 3ft',
          urgency: 'high',
          customerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
          id: 'JOB-12352',
          jobType: 'auction',
          status: 'bidding',
          createdAt: new Date(Date.now() - 129600000).toISOString(), // 36 hours ago
          pickupLocation: '25 Brixton Rd, London, UK',
          dropoffLocation: '37 Clapham High St, London, UK',
          itemType: 'electronics',
          itemSize: 'large',
          preferredDate: '2025-04-25',
          preferredTime: '13:00',
          description: 'Home theater system with large screen TV and audio equipment',
          customerName: 'Sarah Parker',
          customerRating: 4.6,
          estimatedValue: 300,
          bids: [
            {
              id: 'BID-004',
              providerId: 'PROV-4',
              providerName: 'Tech Transport Specialists',
              amount: 285,
              estimatedTime: '2.5 hours',
              message: 'We specialize in electronics transportation',
              createdAt: new Date(Date.now() - 86400000).toISOString() // 24 hours ago
            },
            {
              id: 'BID-005',
              providerId: 'PROV-5',
              providerName: 'Reliable Movers',
              amount: 310,
              estimatedTime: '2 hours',
              message: 'Premium service with full insurance',
              createdAt: new Date(Date.now() - 64800000).toISOString() // 18 hours ago
            }
          ],
          distance: 3.9,
          priority: false,
          itemCount: 6,
          weight: '200 lbs',
          dimensions: 'Various sizes, largest 65" TV',
          urgency: 'medium',
          image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          customerAvatar: 'https://randomuser.me/api/portraits/women/33.jpg'
        },
        {
          id: 'JOB-12353',
          jobType: 'instant',
          status: 'open',
          createdAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
          pickupLocation: '100 Shoreditch High St, London, UK',
          dropoffLocation: '55 Old Street, London, UK',
          itemType: 'boxes',
          itemSize: 'small',
          preferredDate: '2025-04-15',
          preferredTime: '18:00',
          description: 'Urgent delivery of business documents and small packages',
          customerName: 'Tech Startup Inc',
          customerRating: 4.9,
          estimatedValue: 60,
          bids: [],
          distance: 1.2,
          priority: true,
          expiresAt: new Date(Date.now() + 3600000 * 1).toISOString(), // 1 hour from now
          itemCount: 3,
          weight: '15 lbs',
          dimensions: 'Document boxes',
          urgency: 'high',
          customerAvatar: 'https://randomuser.me/api/portraits/men/54.jpg'
        },
        {
          id: 'JOB-12354',
          jobType: 'journey',
          status: 'open',
          createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          stops: [
            {
              pickup: '10 Hammersmith Broadway, London, UK',
              dropoff: '22 Shepherd\'s Bush, London, UK',
              time: '09:00'
            },
            {
              pickup: '45 Ealing Broadway, London, UK',
              dropoff: '18 Acton High Street, London, UK',
              time: '11:30'
            },
            {
              pickup: '5 Chiswick High Rd, London, UK',
              dropoff: '90 Turnham Green, London, UK',
              time: '14:00'
            },
            {
              pickup: '33 Richmond Rd, London, UK',
              dropoff: '27 Kew Gardens, London, UK',
              time: '16:00'
            }
          ],
          itemType: 'specialty',
          itemSize: 'medium',
          preferredDate: '2025-04-28',
          preferredTime: '09:00',
          description: 'Delivery route for specialty plant nursery - fragile plant specimens',
          customerName: 'London Gardens Ltd',
          customerRating: 4.7,
          estimatedValue: 400,
          bids: [],
          distance: 18.3,
          priority: false,
          itemCount: 20,
          weight: '350 lbs total',
          urgency: 'medium',
          image: 'https://images.unsplash.com/photo-1466692476655-9df18258f2d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          customerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg'
        },
        {
          id: 'JOB-12355',
          jobType: 'auction',
          status: 'bidding',
          createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          pickupLocation: '10 Harley Street, London, UK',
          dropoffLocation: '25 Wimpole Street, London, UK',
          itemType: 'specialty',
          itemSize: 'small',
          preferredDate: '2025-05-05',
          preferredTime: '10:00',
          description: 'Medical equipment transportation requiring careful handling',
          customerName: 'London Medical Center',
          customerRating: 5.0,
          estimatedValue: 700,
          bids: [
            {
              id: 'BID-006',
              providerId: 'PROV-6',
              providerName: 'Medical Transport Specialists',
              amount: 650,
              estimatedTime: '1.5 hours',
              message: 'Specialized in medical equipment transportation',
              createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
            },
            {
              id: 'BID-007',
              providerId: 'PROV-7',
              providerName: 'Premium Logistics',
              amount: 680,
              estimatedTime: '1 hour',
              message: 'Expedited service with medical equipment handling certification',
              createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
            },
            {
              id: 'BID-008',
              providerId: 'PROV-8',
              providerName: 'Healthcare Logistics',
              amount: 630,
              estimatedTime: '2 hours',
              message: 'Most affordable option with proper medical equipment handling',
              createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ],
          distance: 0.5,
          priority: true,
          itemCount: 8,
          weight: '120 lbs',
          dimensions: 'Precision medical instruments',
          urgency: 'medium',
          customerAvatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        {
          id: 'JOB-12356',
          jobType: 'instant',
          status: 'open',
          createdAt: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
          pickupLocation: '55 Greenwich Park, London, UK',
          dropoffLocation: '20 Blackheath Hill, London, UK',
          itemType: 'furniture',
          itemSize: 'medium',
          preferredDate: '2025-04-17',
          preferredTime: '12:00',
          description: 'Mid-century modern armchair and side table',
          customerName: 'Laura Phillips',
          customerRating: 4.5,
          estimatedValue: 85,
          bids: [],
          distance: 2.7,
          expiresAt: new Date(Date.now() + 3600000 * 4).toISOString(), // 4 hours from now
          itemCount: 2,
          weight: '90 lbs',
          dimensions: 'Chair and small table',
          urgency: 'low',
          image: 'https://images.unsplash.com/photo-1532372576444-dda954cf5aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          customerAvatar: 'https://randomuser.me/api/portraits/women/50.jpg'
        }
      ];

      setJobs(mockJobs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load jobs. Please try again.');
      setLoading(false);
    }
  };

  // Toggle saved job status
  const toggleSaveJob = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const updatedSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
      
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  // Handle job card click
  const handleJobCardClick = (job: Job) => {
    navigate(`/provider/job/${job.id}`);
  };

  // Apply all filters and search
  const filteredJobs = jobs.filter((job) => {
    // Search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        job.id.toLowerCase().includes(searchLower) ||
        (job.pickupLocation && job.pickupLocation.toLowerCase().includes(searchLower)) ||
        (job.dropoffLocation && job.dropoffLocation.toLowerCase().includes(searchLower)) ||
        (job.stops && job.stops.some(stop => 
          stop.pickup.toLowerCase().includes(searchLower) || 
          stop.dropoff.toLowerCase().includes(searchLower)
        )) ||
        job.itemType.toLowerCase().includes(searchLower) ||
        job.customerName.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    // Job type filter
    if (filters.jobType !== 'all' && job.jobType !== filters.jobType) {
      return false;
    }
    
    // Distance filter
    if (filters.distance !== null && job.distance > filters.distance) {
      return false;
    }
    
    // Value range filter
    if (filters.minValue !== null && job.estimatedValue < filters.minValue) {
      return false;
    }
    
    if (filters.maxValue !== null && job.estimatedValue > filters.maxValue) {
      return false;
    }
    
    // Date filter
    if (filters.date !== null) {
      const jobDate = new Date(job.preferredDate).toISOString().split('T')[0];
      if (jobDate !== filters.date) {
        return false;
      }
    }
    
    // Item type filter
    if (filters.itemType !== null && job.itemType !== filters.itemType) {
      return false;
    }
    
    return true;
  });

  // Apply sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const direction = filters.sortDirection === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'date':
        return direction * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'value':
        return direction * (a.estimatedValue - b.estimatedValue);
      case 'distance':
        return direction * (a.distance - b.distance);
      case 'urgency':
        const urgencyMap: {[key: string]: number} = { high: 3, medium: 2, low: 1, undefined: 0 };
        return direction * ((urgencyMap[b.urgency || 'undefined'] || 0) - (urgencyMap[a.urgency || 'undefined'] || 0));
      default:
        return 0;
    }
  });

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'instant': return <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />;
      case 'auction': return <FontAwesomeIcon icon={faGavel} className="text-purple-500" />;
      case 'journey': return <FontAwesomeIcon icon={faRoute} className="text-blue-500" />;
      default: return null;
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'instant': return 'Instant Booking';
      case 'auction': return 'Auction';
      case 'journey': return 'Multi-Stop Journey';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType.toLowerCase()) {
      case 'furniture': return faTruck;
      case 'electronics': return faToolbox;
      case 'boxes': return faBox;
      case 'appliances': return faExchangeAlt;
      case 'specialty': return faAward;
      default: return faBox;
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;
    
    switch (urgency) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>;
      case 'low':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Flexible</span>;
      default:
        return null;
    }
  };

  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced header with stats and notification area */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Job Board</h1>
                <p className="text-blue-100">Find and bid on delivery jobs in your area</p>
                <div className="flex flex-wrap mt-4 gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                    <FontAwesomeIcon icon={faTruck} className="mr-1" /> 
                    {jobs.filter(j => j.jobType === 'instant').length} Instant Jobs
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    <FontAwesomeIcon icon={faGavel} className="mr-1" /> 
                    {jobs.filter(j => j.jobType === 'auction').length} Auctions
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                    <FontAwesomeIcon icon={faRoute} className="mr-1" /> 
                    {jobs.filter(j => j.jobType === 'journey').length} Journeys
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filtering - Enhanced version */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          {/* Top row with search and view toggles */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Search bar with icon */}
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by location, item type, customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* View mode toggles and filter button */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title="Grid View"
                >
                  <FontAwesomeIcon icon={faLayerGroup} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title="List View"
                >
                  <FontAwesomeIcon icon={faListAlt} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md ${
                    viewMode === 'map'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title="Map View"
                >
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                    : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filters</span>
                <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-1" />
              </button>
            </div>
          </div>
          
          {/* Enhanced filters panel */}
          {showFilters && (
            <div ref={filtersRef} className="border-t border-gray-200 dark:border-gray-700 pt-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, jobType: 'all' })}
                      className={`px-3 py-2 text-sm text-center rounded-md ${
                        filters.jobType === 'all'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All Jobs
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, jobType: 'instant' })}
                      className={`px-3 py-2 text-sm text-center rounded-md ${
                        filters.jobType === 'instant'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FontAwesomeIcon icon={faBolt} className="mr-1" />
                      Instant
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, jobType: 'auction' })}
                      className={`px-3 py-2 text-sm text-center rounded-md ${
                        filters.jobType === 'auction'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FontAwesomeIcon icon={faGavel} className="mr-1" />
                      Auction
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, jobType: 'journey' })}
                      className={`px-3 py-2 text-sm text-center rounded-md ${
                        filters.jobType === 'journey'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FontAwesomeIcon icon={faRoute} className="mr-1" />
                      Journey
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distance</label>
                  <select
                    value={filters.distance?.toString() || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      distance: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any distance</option>
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                    <option value="20">Within 20 miles</option>
                    <option value="50">Within 50 miles</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Type</label>
                  <select
                    value={filters.itemType || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      itemType: e.target.value || null 
                    })}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All item types</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="boxes">Boxes</option>
                    <option value="appliances">Appliances</option>
                    <option value="specialty">Specialty Items</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={filters.date || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      date: e.target.value || null 
                    })}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minValue || ''}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        minValue: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                                focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxValue || ''}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        maxValue: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                                focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        sortBy: e.target.value 
                      })}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                              focus:outline-none focus:ring-blue-500 focus:border-blue-500
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="value">Value</option>
                      <option value="distance">Distance</option>
                      <option value="urgency">Urgency</option>
                    </select>
                    <button
                      onClick={() => setFilters({
                        ...filters,
                        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
                      })}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <FontAwesomeIcon 
                        icon={filters.sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active filters and clear button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">Active Filters:</div>
                
                {filters.jobType !== 'all' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full px-3 py-1 flex items-center">
                    Job Type: {getJobTypeLabel(filters.jobType)}
                    <button 
                      onClick={() => setFilters({ ...filters, jobType: 'all' })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                {filters.distance !== null && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full px-3 py-1 flex items-center">
                    Within {filters.distance} miles
                    <button 
                      onClick={() => setFilters({ ...filters, distance: null })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                {filters.itemType !== null && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full px-3 py-1 flex items-center">
                    {filters.itemType.charAt(0).toUpperCase() + filters.itemType.slice(1)}
                    <button 
                      onClick={() => setFilters({ ...filters, itemType: null })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                {filters.date !== null && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full px-3 py-1 flex items-center">
                    Date: {filters.date}
                    <button 
                      onClick={() => setFilters({ ...filters, date: null })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                {(filters.minValue !== null || filters.maxValue !== null) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full px-3 py-1 flex items-center">
                    Price: {filters.minValue !== null ? `$${filters.minValue}` : '$0'} - {filters.maxValue !== null ? `$${filters.maxValue}` : 'Any'}
                    <button 
                      onClick={() => setFilters({ ...filters, minValue: null, maxValue: null })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setFilters({
                    jobType: 'all',
                    distance: null,
                    minValue: null,
                    maxValue: null,
                    date: null,
                    itemType: null,
                    sortBy: 'date',
                    sortDirection: 'desc'
                  })}
                  className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading jobs...' : `Found ${sortedJobs.length} job${sortedJobs.length === 1 ? '' : 's'}`}
          </div>
          
          {viewMode !== 'map' && sortedJobs.length > 0 && (
            <button 
              className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => fetchJobs()}
            >
              <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          )}
        </div>
        
        {/* Jobs display based on view mode */}
        {loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md flex items-start">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mt-1 mr-3" />
            <div>
              <h3 className="font-medium">Error loading jobs</h3>
              <p className="mt-1">{error}</p>
              <button 
                onClick={fetchJobs} 
                className="mt-3 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : sortedJobs.length === 0 ? (
          // Empty state
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faSearch} className="text-blue-500 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              {debouncedSearchTerm || Object.values(filters).some(value => value !== null && value !== 'all')
                ? "We couldn't find any jobs matching your filters. Try adjusting your search criteria."
                : "There are no available jobs at the moment. Check back later or adjust your search parameters."}
            </p>
            {(debouncedSearchTerm || Object.values(filters).some(value => value !== null && value !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    jobType: 'all',
                    distance: null,
                    minValue: null,
                    maxValue: null,
                    date: null,
                    itemType: null,
                    sortBy: 'date',
                    sortDirection: 'desc'
                  });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid view of jobs
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Enhanced Grid View Job Cards */}
            {sortedJobs.map(job => (
              <div key={job.id} 
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
                onClick={() => handleJobCardClick(job)}
              >
                {/* Job banner with animated gradient background */}
                <div className={`px-4 py-2 flex justify-between items-center bg-opacity-95 ${
                  job.jobType === 'instant' 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                    : job.jobType === 'auction' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                } relative overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,0 L100,0 L100,5 C80,15 70,30 60,50 C45,85 30,75 0,95 L0,0 Z" fill="white"></path>
                    </svg>
                  </div>
                  
                  <div className="flex items-center z-10">
                    <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm mr-2.5">
                      {getJobTypeIcon(job.jobType)}
                    </div>
                    <span className="text-sm font-medium tracking-wide">{getJobTypeLabel(job.jobType)}</span>
                  </div>
                  
                  <div className="z-10">
                    {job.urgency && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                        job.urgency === 'high' 
                          ? 'bg-red-100/80 text-red-800 dark:bg-red-900/60 dark:text-red-200' 
                          : job.urgency === 'medium'
                            ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200'
                            : 'bg-green-100/80 text-green-800 dark:bg-green-900/60 dark:text-green-200'
                      }`}>
                        {job.urgency === 'high' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-1.5"></span>}
                        {job.urgency === 'high' ? 'Urgent' : job.urgency === 'medium' ? 'Medium' : 'Flexible'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main content with improved layout */}
                <div className="p-5 relative">
                  {/* Save/bookmark button with enhanced animation */}
                  <button 
                    onClick={(e) => toggleSaveJob(job.id, e)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform hover:scale-110"
                    title={savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}
                  >
                    <FontAwesomeIcon 
                      icon={savedJobs.includes(job.id) ? faHeartBroken : faHeart}
                      className={`transition-all ${savedJobs.includes(job.id) ? "text-red-500" : ""}`}
                    />
                  </button>

                  {/* Item info with enhanced design */}
                  <div className="flex items-center mb-4">
                    <div className={`p-2.5 rounded-lg mr-3 ${
                      job.jobType === 'instant' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                      job.jobType === 'auction' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                      'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      <FontAwesomeIcon icon={getItemTypeIcon(job.itemType)} className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.itemType.charAt(0).toUpperCase() + job.itemType.slice(1)} 
                        {job.itemSize && <span className="text-gray-600 dark:text-gray-300"> • {job.itemSize.charAt(0).toUpperCase() + job.itemSize.slice(1)}</span>}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="mr-2">{job.id}</span>
                        <span className="bg-gray-200 dark:bg-gray-700 w-1 h-1 rounded-full"></span>
                        <span className="ml-2">{formatRelativeTime(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Locations with enhanced visual presentation */}
                  {job.jobType !== 'journey' ? (
                    <div className="relative mb-5">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      
                      <div className="flex items-start mb-3 relative">
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 z-10 border-2 border-white dark:border-gray-800">
                          <FontAwesomeIcon icon={faLocationDot} className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pickup</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{job.pickupLocation}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start relative">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 z-10 border-2 border-white dark:border-gray-800">
                          <FontAwesomeIcon icon={faLocationDot} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Dropoff</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{job.dropoffLocation}</p>
                        </div>
                      </div>
                      
                      {/* Distance indicator */}
                      <div className="mt-2 ml-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faRoute} className="mr-1.5" />
                        <span>{job.distance} miles</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-5">
                      <div className="flex items-center text-sm mb-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                          <FontAwesomeIcon icon={faRoute} className="text-blue-500" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">Multi-stop Journey</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                          {job.stops?.length} stops
                        </span>
                      </div>
                      
                      <div className="pl-8 text-sm text-gray-600 dark:text-gray-400">
                        <div>Total distance: <span className="font-medium text-gray-800 dark:text-gray-200">{job.distance} miles</span></div>
                        {job.stops && job.stops.length > 0 && (
                          <div className="mt-1">
                            First stop: <span className="font-medium text-gray-800 dark:text-gray-200">{job.stops[0].pickup}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Details section */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm mb-5">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(job.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{job.preferredTime}</span>
                    </div>
                    
                    {job.itemCount && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBox} className="text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{job.itemCount} items</span>
                      </div>
                    )}
                    
                    {job.weight && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faWeight} className="text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{job.weight}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer info and rating */}
                  <div className="flex items-center mb-5">
                    {job.customerAvatar ? (
                      <img 
                        src={job.customerAvatar} 
                        alt={job.customerName}
                        className="h-7 w-7 rounded-full mr-2 object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{job.customerName}</div>
                      {job.customerRating && (
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <FontAwesomeIcon 
                              key={i} 
                              icon={faStar} 
                              className={`text-xs ${i < Math.round(job?.customerRating) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                          <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">{job.customerRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and action button */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">${job.estimatedValue.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {job.jobType === 'auction' ? 'Starting Bid' : 'Estimated Value'}
                      </div>
                    </div>
                    
                    <button className={`px-5 py-2.5 rounded-lg text-white font-medium text-sm shadow-sm transform transition-all duration-200 hover:scale-105 hover:shadow-md group-hover:shadow ${
                      job.jobType === 'instant' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700' :
                      job.jobType === 'auction' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' :
                      'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                    }`}>
                      {job.jobType === 'auction' ? 'Place Bid' : 
                       job.jobType === 'instant' ? 'Book Now' : 'View Journey'}
                      <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 transition-transform transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Expiration countdown for instant jobs */}
                  {job.jobType === 'instant' && job.expiresAt && (
                    <div className="mt-3 text-xs">
                      <div className="flex items-center justify-center">
                        <div className="py-1.5 px-3 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                          <span>
                            Expires in {Math.max(0, Math.round((new Date(job.expiresAt).getTime() - Date.now()) / 60000))} minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Auction status for auction jobs */}
                  {job.jobType === 'auction' && (
                    <div className="mt-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {job.bids.length} {job.bids.length === 1 ? 'bid' : 'bids'} so far
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          Ends in 2 days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-purple-500" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'list' ? (
          // List view of jobs
          <div className="space-y-4">
            {sortedJobs.map(job => (
              <div key={job.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleJobCardClick(job)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left side - job type indicator */}
                  <div className={`md:w-16 p-4 flex md:flex-col items-center justify-center ${
                    job.jobType === 'instant' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                    job.jobType === 'auction' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    <div className="text-2xl mb-2">{getJobTypeIcon(job.jobType)}</div>
                    <span className="text-xs font-medium uppercase rotate-90 md:rotate-0">
                      {job.jobType}
                    </span>
                  </div>
                  
                  {/* Main content */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white mr-3">
                            {job.itemType.charAt(0).toUpperCase() + job.itemType.slice(1)} {job.itemSize && `• ${job.itemSize.charAt(0).toUpperCase() + job.itemSize.slice(1)}`}
                          </h3>
                          {job.urgency && getUrgencyBadge(job.urgency)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Job #{job.id} • Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="mt-2 md:mt-0 flex items-center">
                        <div className="mr-4">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">${job.estimatedValue.toFixed(2)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {job.jobType === 'auction' ? 'Starting Bid' : 'Estimated Value'}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id, e);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                        >
                          <FontAwesomeIcon 
                            icon={savedJobs.includes(job.id) ? faBookmark : faBookmark} 
                            className={`${savedJobs.includes(job.id) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Location details */}
                      <div className="md:col-span-2">
                        {job.jobType !== 'journey' ? (
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mt-1 mr-2 w-4" />
                              <div className="text-sm text-gray-600 dark:text-gray-300">{job.pickupLocation}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-5 ml-2"></div>
                            </div>
                            <div className="flex items-start">
                              <FontAwesomeIcon icon={faLocationDot} className="text-green-500 mt-1 mr-2 w-4" />
                              <div className="text-sm text-gray-600 dark:text-gray-300">{job.dropoffLocation}</div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                              <FontAwesomeIcon icon={faRoute} className="mr-2" />
                              Multi-stop Journey • {job.stops?.length} stops
                            </div>
                            <div className="space-y-4 max-h-32 overflow-y-auto pr-2">
                              {job.stops?.slice(0, 2).map((stop, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex items-start">
                                    <div className="flex flex-col items-center mr-2">
                                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                        {index + 1}
                                      </div>
                                      {index < (job.stops?.length || 0) - 1 && (
                                        <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-8"></div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Pickup</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-300">{stop.pickup}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="flex flex-col items-center mr-2">
                                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Dropoff</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-300">{stop.dropoff}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(job.stops?.length || 0) > 2 && (
                                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                  + {(job.stops?.length || 0) - 2} more stops
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Right side info */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(job.preferredDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {job.preferredTime}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faRoute} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {job.distance} miles away
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="text-gray-400 dark:text-gray-500 mr-2 w-4" />
                          <div className="flex items-center">
                            {job.customerAvatar && (
                              <img 
                                src={job.customerAvatar} 
                                alt={job.customerName}
                                className="h-5 w-5 rounded-full mr-2 object-cover"
                              />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {job.customerName}
                            </span>
                            {job.customerRating && (
                              <div className="flex items-center ml-2">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{job.customerRating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button className={`w-full px-4 py-2 rounded-lg text-white font-medium text-sm ${
                          job.jobType === 'instant' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          job.jobType === 'auction' ? 'bg-purple-600 hover:bg-purple-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        }`}>
                          {job.jobType === 'auction' ? 'Place Bid' : 
                           job.jobType === 'instant' ? 'Book Now' : 'View Journey'}
                        </button>
                        
                        {job.jobType === 'instant' && job.expiresAt && (
                          <div className="text-xs text-center">
                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                              <FontAwesomeIcon icon={faClock} className="mr-1" />
                              Expires in {Math.max(0, Math.round((new Date(job.expiresAt).getTime() - Date.now()) / 60000))} minutes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Map view
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-center p-12">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-400 text-5xl mb-3" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Map View Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on an interactive map view of nearby jobs. Stay tuned for this feature!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
