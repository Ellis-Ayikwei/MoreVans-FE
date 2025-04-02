import { 
  faArrowLeft, faBox, faCalendar, faLocationDot, faMoneyBill, faStar, faTruck,
  faMapMarkerAlt, faClock, faRoute, faWeight, faRuler, faUser, faClipboard,
  faInfoCircle, faExclamationTriangle, faBell, faCheckCircle, faTimesCircle,
  faCommentDots, faPhone, faEnvelope, faDollarSign, faBolt, faGavel, faTruckLoading,
  faShieldAlt, faFileInvoiceDollar, faExclamationCircle, faQuestionCircle,
  faMapMarkedAlt, faDirections, faHandshake, faLayerGroup, faChevronRight,
  faChevronUp, faChevronDown, faCircle, faTimes, faPaperPlane, faCamera,
  faFileImage, faPaperclip, faCalendarAlt, faListAlt, faIdCard, faWarehouse,
  faHome, faBuilding, faHistory, faTag,
  faToolbox,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, FormEvent, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Enhanced interfaces
interface ItemDetail {
  name: string;
  quantity: number;
  dimensions: string;
  weight: string;
  image?: string;
  fragile?: boolean;
  notes?: string;
  value?: number;
}

interface Stop {
  id: string;
  location: string;
  address: string;
  timeWindow: string;
  contactName?: string;
  contactPhone?: string;
  instructions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isCompleted?: boolean;
}

interface Job {
  id: string;
  jobType: 'instant' | 'auction' | 'journey';
  status: 'open' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  pickupLocation?: string;
  pickupAddress?: string;
  dropoffLocation?: string;
  dropoffAddress?: string;
  stops?: Stop[];
  itemType: string;
  itemSize: string;
  preferredDate: string;
  preferredTime: string;
  description?: string;
  customerName: string;
  customerRating?: number;
  customerAvatar?: string;
  customerCompany?: string;
  customerPhone?: string;
  customerEmail?: string;
  estimatedValue: number;
  bids: Bid[];
  distance: number;
  // Additional AVB details
  listingId: string;
  amountDue: string;
  collection: string;
  delivery: string;
  personsRequired: string;
  pickupDate?: string;
  pickupWindow: string;
  travelTime: string;
  deliveryDate?: string;
  deliveryWindow: string;
  itemDetails: ItemDetail[];
  purchaseOrder: string;
  instructions: string;
  vehicleRequirements?: string[];
  specialRequirements?: string[];
  deadlineBidding?: string;
  priority?: boolean;
  isInsured?: boolean;
  insuranceValue?: number;
  paymentTerms?: string;
  completionSteps?: string[];
  images?: string[];
  timeline?: TimelineEvent[];
}

interface Bid {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  estimatedTime: string;
  message?: string;
  createdAt: string;
  status?: 'pending' | 'accepted' | 'rejected';
  providerRating?: number;
  providerAvatar?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'customer' | 'provider' | 'system';
  message: string;
  createdAt: string;
  isRead?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  time: string;
  isCompleted: boolean;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('details');
  const [activeAuctionTab, setActiveAuctionTab] = useState<string>('bids');
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    fetchJobDetails();
    // Initialize some realistic chat messages
    setChatMessages([
      { 
        id: 'msg-1', 
        sender: 'Customer Support',
        senderType: 'system',
        message: 'Welcome to the job chat. You can communicate with the customer and our support team here.',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      { 
        id: 'msg-2', 
        sender: 'John Smith',
        senderType: 'customer',
        message: 'Hi there! Is the pickup location accessible with a large van?',
        createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      },
      { 
        id: 'msg-3',
        sender: 'You',
        senderType: 'provider',
        message: 'Hello! Yes, we can access the location with our standard delivery van. Is there parking available nearby?',
        createdAt: new Date(Date.now() - 39600000).toISOString() // 11 hours ago
      },
      { 
        id: 'msg-4',
        sender: 'John Smith',
        senderType: 'customer',
        message: 'Yes, there is street parking and a loading zone in front of the building. The doorman can help coordinate if needed.',
        createdAt: new Date(Date.now() - 36000000).toISOString() // 10 hours ago
      },
      { 
        id: 'msg-5',
        sender: 'Customer Support',
        senderType: 'system',
        message: 'Please remember to take photos at collection and delivery points as per the instructions.',
        createdAt: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
      }
    ]);
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of chat on new messages
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create an enhanced mock job
      const mockJob: Job = {
        id: 'JOB-8746386',
        jobType: 'auction', // Change to test different layouts
        status: 'bidding',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        pickupLocation: 'Manchester, M19',
        pickupAddress: '123 Wilmslow Road, Fallowfield, Manchester, M19 2FN',
        dropoffLocation: 'Maidstone, ME16',
        dropoffAddress: '45 London Road, Maidstone, Kent, ME16 8HS',
        itemType: 'Furniture & Appliances',
        itemSize: 'Various',
        preferredDate: 'Apr 15, 2025',
        preferredTime: '12:00 - 4:00pm',
        description: 'Large collection of kitchen furniture items requiring careful handling and secure transport. Special attention needed for the worktops as they are fragile and expensive.',
        customerName: 'John Smith',
        customerRating: 4.7,
        customerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        customerCompany: 'UK Kitchen Designs Ltd.',
        customerPhone: '+44 20 1234 5678',
        customerEmail: 'john.smith@ukkitchendesigns.com',
        estimatedValue: 211.67,
        bids: [
          {
            id: 'BID-001',
            providerId: 'P-001',
            providerName: 'Fast Movers Ltd',
            providerRating: 4.8,
            providerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            amount: 200,
            estimatedTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            message: 'We can handle this job with our experienced team and specialized equipment for kitchen furniture. We\'ll ensure all items are properly secured for transport.',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'pending'
          },
          {
            id: 'BID-002',
            providerId: 'P-002',
            providerName: 'Express Logistics',
            providerRating: 4.5,
            providerAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
            amount: 195,
            estimatedTime: new Date(Date.now() + 129600000).toISOString(), // Day after tomorrow
            message: 'Available immediately. Our team specializes in kitchen installations and removals with over 5 years of experience.',
            createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
            status: 'pending'
          },
          {
            id: 'BID-003',
            providerId: 'P-003',
            providerName: 'Premium Transport Co',
            providerRating: 4.9,
            providerAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
            amount: 225,
            estimatedTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
            message: 'Premium service with full insurance coverage and specialized packaging for delicate worktops. We have experience with high-end kitchen installations.',
            createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
            status: 'pending'
          }
        ],
        distance: 257,
        listingId: '8746386',
        amountDue: '£211.67',
        collection: 'Manchester, M19',
        delivery: 'Maidstone, ME16',
        personsRequired: 'More than one person',
        pickupDate: 'April 15, 2025',
        pickupWindow: '12 - 4pm',
        travelTime: '4:29 hours',
        deliveryDate: 'April 16, 2025',
        deliveryWindow: '9am - 12pm',
        itemDetails: [
          { 
            name: 'Kitchen Worktop', 
            quantity: 14, 
            dimensions: '300 × 4 × 67 cm', 
            weight: '50 kg',
            fragile: true,
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            value: 2800,
            notes: 'Premium quartz material, scratch resistant'
          },
          { 
            name: 'Corner Worktop', 
            quantity: 2, 
            dimensions: '410 × 4 × 66 cm', 
            weight: '60 kg',
            fragile: true,
            image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            value: 700,
            notes: 'Corner pieces with curved edge'
          },
          { 
            name: 'Glass Splashback', 
            quantity: 9, 
            dimensions: '300 × 8 × 121 cm', 
            weight: '25 kg',
            fragile: true,
            image: 'https://images.unsplash.com/photo-1525802513457-32670b5e4537?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            value: 1350,
            notes: 'Tempered glass, very fragile'
          },
          { 
            name: 'Hardware Kit', 
            quantity: 1, 
            dimensions: '50 × 47 × 50 cm', 
            weight: '5 kg',
            fragile: false,
            image: 'https://images.unsplash.com/photo-1581233135909-57d015fcea28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            value: 150,
            notes: 'Contains all mounting hardware and fixtures'
          }
        ],
        purchaseOrder: 'MSO0197001',
        instructions: 'Read ALL instructions before accepting.\nClear photos of items at collection, in the van and at delivery are mandatory or you may be held liable for damage.\nCall delivery customer when 1 hour away.\nDeliver to room of choice.\nContact AnyVan Business with issues or delays: 02038682704.\nPlease call when near for directions for delivery.\nWear appropriate PPE and bring tools for assembly if required.\nThe kitchen worktops are extremely fragile and expensive - special care must be taken during loading and unloading.\nEnsure all items are properly secured during transit to prevent damage.',
        vehicleRequirements: ['Large Van or Luton', 'Clean interior', 'Ramps or lift gate'],
        specialRequirements: ['Heavy lifting', 'PPE Required', 'Assembly Tools'],
        deadlineBidding: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        priority: true,
        isInsured: true,
        insuranceValue: 5000,
        paymentTerms: 'Net 15 days after successful delivery',
        completionSteps: [
          'Pickup confirmation',
          'Load photos',
          'Delivery confirmation',
          'Customer signature',
          'Invoice submission'
        ],
        images: [
          'https://images.unsplash.com/photo-1556910103-1c02745aec78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        timeline: [
          {
            id: 'event-1',
            type: 'created',
            title: 'Job Posted',
            description: 'Job was created and listed on the platform',
            time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            isCompleted: true
          },
          {
            id: 'event-2',
            type: 'bidding',
            title: 'Bidding Period',
            description: 'Accepting bids from qualified providers',
            time: new Date(Date.now()).toISOString(),
            isCompleted: true
          },
          {
            id: 'event-3',
            type: 'assignment',
            title: 'Provider Assignment',
            description: 'Job will be assigned to the selected provider',
            time: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
            isCompleted: false
          },
          {
            id: 'event-4',
            type: 'pickup',
            title: 'Pickup',
            description: 'Collection from origination point',
            time: new Date(Date.now() + 1123200000).toISOString(), // 13 days from now
            isCompleted: false
          },
          {
            id: 'event-5',
            type: 'delivery',
            title: 'Delivery',
            description: 'Delivery to destination',
            time: new Date(Date.now() + 1209600000).toISOString(), // 14 days from now
            isCompleted: false
          }
        ]
      };

      setJob(mockJob);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load job details. Please try again.');
      setLoading(false);
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      senderType: 'provider',
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      attachments: attachments.length > 0 
        ? attachments.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type
          })) 
        : undefined
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    setAttachments([]);
  };

  const handleSubmitBid = (e: FormEvent) => {
    e.preventDefault();
    if (!bidAmount.trim()) return;
    
    setIsSubmittingBid(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add the new bid to the job
      if (job) {
        const newBid: Bid = {
          id: `BID-${Date.now()}`,
          providerId: 'YOUR-PROVIDER-ID',
          providerName: 'Your Company Name',
          amount: parseFloat(bidAmount),
          estimatedTime: new Date(Date.now() + 86400000).toISOString(), // Example: 1 day from now
          message: bidMessage,
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        
        setJob({
          ...job,
          bids: [...job.bids, newBid]
        });
        
        setBidAmount('');
        setBidMessage('');
        setActiveAuctionTab('bids');
      }
      
      setIsSubmittingBid(false);
    }, 1500);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/provider/jobs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Job Board
          </Link>
          
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-5 rounded-lg flex items-start">
            <FontAwesomeIcon icon={faExclamationCircle} className="h-6 w-6 text-red-500 dark:text-red-400 mr-4 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold">Error Loading Job</h3>
              <p className="mt-1">{error || 'Job not found'}</p>
              <button 
                onClick={fetchJobDetails}
                className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-200 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumbs and back button */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link 
                    to="/provider/dashboard" 
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 dark:text-gray-600 w-3 h-3 mx-1" />
                    <Link 
                      to="/provider/jobs" 
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                    >
                      Jobs
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 dark:text-gray-600 w-3 h-3 mx-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Job {job.listingId}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <Link 
            to="/provider/jobs" 
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium mt-2 sm:mt-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Job Board
          </Link>
        </div>

        {/* Job header with key info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className={`px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 ${
            job.jobType === 'instant' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
            job.jobType === 'auction' ? 'bg-purple-50 dark:bg-purple-900/20' :
            'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={
                  job.jobType === 'instant' ? faBolt :
                  job.jobType === 'auction' ? faGavel :
                  faRoute
                } className={`mr-2 ${
                  job.jobType === 'instant' ? 'text-yellow-600 dark:text-yellow-400' :
                  job.jobType === 'auction' ? 'text-purple-600 dark:text-purple-400' :
                  'text-blue-600 dark:text-blue-400'
                }`} />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Job ID: {job.listingId}
                </h1>
                
                {job.priority && (
                  <span className="ml-3 px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded-full flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    Priority
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Posted {formatDate(job.createdAt)} • {job.jobType === 'instant' ? 'Instant Job' : job.jobType === 'auction' ? 'Auction Job' : 'Multi-Stop Journey'}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {job.distance} <span className="text-lg">miles</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Distance</div>
            </div>
          </div>
          
          {/* Status bar */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                job.status === 'open' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                job.status === 'bidding' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                job.status === 'assigned' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                job.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                job.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Amount Due: <span className="font-bold text-gray-900 dark:text-white">{job.amountDue}</span>
              </span>
            </div>
          </div>
          
          {/* Payment and Insurance Info */}
          <div className="px-6 py-4 flex flex-wrap gap-4 sm:gap-8">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Payment Terms</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{job.paymentTerms || 'Standard Terms'}</div>
              </div>
            </div>
            
            {job.isInsured && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Insurance Coverage</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    £{job.insuranceValue?.toLocaleString() || 'Standard Coverage'}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                <FontAwesomeIcon icon={faIdCard} />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Purchase Order</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{job.purchaseOrder}</div>
              </div>
            </div>
            
            {job.jobType === 'auction' && job.deadlineBidding && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bidding Ends</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(job.deadlineBidding)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Job Details
              </button>
              
              <button
                onClick={() => setActiveTab('route')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'route'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Route & Locations
              </button>
              
              <button
                onClick={() => setActiveTab('items')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Item Details
              </button>
              
              <button
                onClick={() => setActiveTab('chat')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chat'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  Messages
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full px-2 py-0.5">
                    {chatMessages.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Timeline & Steps
              </button>
            </nav>
          </div>
        </div>

        {/* Main content area based on active tab */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - main content based on active tab */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Details</h2>
                
                {/* Job type and requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Job Type</h3>
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-md flex items-center justify-center mr-3 ${
                        job.jobType === 'instant' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                        job.jobType === 'auction' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        <FontAwesomeIcon icon={
                          job.jobType === 'instant' ? faBolt :
                          job.jobType === 'auction' ? faGavel :
                          faRoute
                        } />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {job.jobType === 'instant' ? 'Instant Booking' :
                          job.jobType === 'auction' ? 'Auction Job' :
                          'Multi-Stop Journey'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {job.jobType === 'instant' ? 'Direct booking with fixed price' :
                          job.jobType === 'auction' ? 'Open for competitive bidding' :
                          'Multiple pickup and dropoff points'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Personnel Required</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {job.personsRequired}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Recommended for this job
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Job Description</h3>
                  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>
                
                {/* Special instructions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Instructions</h3>
                    <button 
                      onClick={() => setShowFullInstructions(!showFullInstructions)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {showFullInstructions ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                    <p className={`text-gray-800 dark:text-gray-200 whitespace-pre-line ${!showFullInstructions && 'line-clamp-5'}`}>
                      {job.instructions}
                    </p>
                  </div>
                </div>
                
                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {job.vehicleRequirements && job.vehicleRequirements.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Vehicle Requirements</h3>
                      <ul className="space-y-2">
                        {job.vehicleRequirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.specialRequirements && job.specialRequirements.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Special Requirements</h3>
                      <ul className="space-y-2">
                        {job.specialRequirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500 mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Customer information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Customer Information</h3>
                  <div className="flex items-center mb-4">
                    {job.customerAvatar ? (
                      <img 
                        src={job.customerAvatar} 
                        alt={job.customerName}
                        className="h-12 w-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{job.customerName}</h4>
                      {job.customerCompany && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.customerCompany}</p>
                      )}
                      {job.customerRating && (
                        <div className="flex items-center mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <FontAwesomeIcon 
                              key={i} 
                              icon={faStar} 
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(job.customerRating) 
                                  ? 'text-yellow-400' 
                                  : i < job.customerRating 
                                    ? 'text-yellow-300' 
                                    : 'text-gray-300 dark:text-gray-600'
                              }`} 
                            />
                          ))}
                          <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">
                            {job.customerRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.customerPhone && (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faPhone} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {job.customerPhone}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {job.customerEmail && (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {job.customerEmail}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'route' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Map placeholder */}
                <div className="h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gray-400 dark:text-gray-500 text-5xl mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Interactive Map
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        A map showing the route would appear here
                      </p>
                    </div>
                  </div>
                  
                  {/* Map overlay with route info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.distance} miles</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Estimated travel time: {job.travelTime}</div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center">
                      <FontAwesomeIcon icon={faDirections} className="mr-2" />
                      Get Directions
                    </button>
                  </div>
                </div>
                
                {/* Location details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Route & Locations</h2>
                  
                  {job.jobType !== 'journey' ? (
                    <div className="space-y-8">
                      {/* Pickup location */}
                      <div className="border-l-4 border-red-500 dark:border-red-600 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                              <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-2" />
                              Pickup Location
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{job.pickupLocation}</p>
                            {job.pickupAddress && (
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.pickupAddress}</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{job.pickupDate || job.preferredDate}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{job.pickupWindow || job.preferredTime}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                            <FontAwesomeIcon icon={faDirections} className="mr-1.5" />
                            Get Directions
                          </button>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                            <FontAwesomeIcon icon={faPhone} className="mr-1.5" />
                            Call Location
                          </button>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          <strong>Special instructions:</strong> Please call 30 minutes before arrival.
                        </div>
                      </div>

                      {/* Visual connector */}
                      <div className="flex justify-center">
                        <div className="h-20 border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                      </div>
                      
                      {/* Dropoff location */}
                      <div className="border-l-4 border-green-500 dark:border-green-600 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                              <FontAwesomeIcon icon={faLocationDot} className="text-green-500 mr-2" />
                              Dropoff Location
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{job.dropoffLocation}</p>
                            {job.dropoffAddress && (
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.dropoffAddress}</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{job.deliveryDate}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{job.deliveryWindow}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                            <FontAwesomeIcon icon={faDirections} className="mr-1.5" />
                            Get Directions
                          </button>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                            <FontAwesomeIcon icon={faPhone} className="mr-1.5" />
                            Call Location
                          </button>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          <strong>Special instructions:</strong> Please call customer 1 hour before arrival.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <FontAwesomeIcon icon={faRoute} className="text-blue-500 mr-2" />
                        Multi-Stop Journey
                      </h3>

                      {job.stops && job.stops.map((stop, index) => (
                        <div key={stop.id || index} 
                          className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 relative border-l-4 border-blue-500 dark:border-blue-600 pl-4">
                          <div className="absolute -left-6 top-4 w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{stop.location}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stop.address}</p>
                              {stop.contactName && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                  Contact: {stop.contactName}
                                  {stop.contactPhone && ` (${stop.contactPhone})`}
                                </p>
                              )}
                              {stop.instructions && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  <strong>Instructions:</strong> {stop.instructions}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{stop.timeWindow}</div>
                              {stop.isCompleted !== undefined && (
                                <span className={`text-xs ${
                                  stop.isCompleted 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {stop.isCompleted ? 'Completed' : 'Pending'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center">
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                              <FontAwesomeIcon icon={faDirections} className="mr-1.5" />
                              Get Directions
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Item Details</h2>
                  
                  {/* Summary stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {job.itemDetails.reduce((sum, item) => sum + item.quantity, 0)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Est. Weight</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {job.itemDetails.reduce((sum, item) => sum + parseInt(item.weight) * item.quantity, 0)} kg
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Est. Volume</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        4.1 m³
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Job Value</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {job.amountDue}
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed item list */}
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Item List</h3>
                    
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Dimensions
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Weight
                            </th>
                            {job.itemDetails.some(item => item.fragile !== undefined) && (
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Special
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {job.itemDetails.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                {item.image ? (
                                  <img 
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 rounded object-cover mr-3"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                    <FontAwesomeIcon icon={faBox} className="text-gray-500 dark:text-gray-400" />
                                  </div>
                                )}
                                {item.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.dimensions}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.weight}
                              </td>
                              {job.itemDetails.some(item => item.fragile !== undefined) && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {item.fragile && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                      Fragile
                                    </span>
                                  )}
                                  {item.notes && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {item.notes}
                                    </div>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Vehicle requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Vehicle Requirements</h3>
                      <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                        <ul className="space-y-3">
                          {job.vehicleRequirements ? (
                            job.vehicleRequirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 dark:text-green-400 mt-1 mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start">
                              <FontAwesomeIcon icon={faTruck} className="text-gray-500 mt-1 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Large Van or Luton recommended</span>
                            </li>
                          )}
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faWeight} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Total weight: {
                                job.itemDetails.reduce((sum, item) => sum + parseInt(item.weight) * item.quantity, 0)
                              } kg</span>
                              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full bg-blue-500" 
                                  style={{ width: `${Math.min(
                                    job.itemDetails.reduce((sum, item) => sum + parseInt(item.weight) * item.quantity, 0) / 15, 
                                    100
                                  )}%` }}
                                ></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Vehicle capacity needed: {
                                  job.itemDetails.reduce((sum, item) => sum + parseInt(item.weight) * item.quantity, 0) > 1000 
                                  ? 'High' 
                                  : job.itemDetails.reduce((sum, item) => sum + parseInt(item.weight) * item.quantity, 0) > 500 
                                  ? 'Medium' 
                                  : 'Low'
                                }
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Special Considerations</h3>
                      <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                        <ul className="space-y-3">
                          {job.itemDetails.some(item => item.fragile) && (
                            <li className="flex items-start">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500 dark:text-orange-400 mt-1 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Contains fragile items requiring special handling</span>
                            </li>
                          )}
                          {job.isInsured && (
                            <li className="flex items-start">
                              <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500 dark:text-blue-400 mt-1 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Insurance coverage: £{job.insuranceValue?.toLocaleString() || '5,000'}
                              </span>
                            </li>
                          )}
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faUser} className="text-gray-500 dark:text-gray-400 mt-1 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{job.personsRequired}</span>
                          </li>
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faToolbox} className="text-gray-500 dark:text-gray-400 mt-1 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Tools required: Basic handling equipment</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'timeline' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Timeline & Steps</h2>
                  
                  {/* Interactive timeline */}
                  <div className="relative py-6">
                    {job.timeline && job.timeline.map((event, index) => (
                      <div key={event.id} className={`mb-8 flex ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                        <div className="flex flex-col items-center w-16">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            event.isCompleted 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            <FontAwesomeIcon icon={
                              event.type === 'created' ? faListAlt :
                              event.type === 'bidding' ? faGavel :
                              event.type === 'assignment' ? faHandshake :
                              event.type === 'pickup' ? faTruckLoading :
                              event.type === 'delivery' ? faLocationDot :
                              faCircle
                            } />
                          </div>
                          {index < job.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                          )}
                        </div>
                        <div className={`bg-gray-50 dark:bg-gray-750 rounded-lg p-4 flex-1 ml-4 ${index % 2 === 0 ? '' : 'mr-4'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                              )}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.isCompleted 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                            }`}>
                              {event.isCompleted ? 'Completed' : 'Pending'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {formatDate(event.time)} at {formatTime(event.time)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Completion steps */}
                  {job.completionSteps && job.completionSteps.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Required Steps for Completion
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6">
                        <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                          {job.completionSteps.map((step, index) => (
                            <li key={index} className="ml-6">
                              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <span className="text-blue-800 dark:text-blue-300 text-xs font-medium">{index + 1}</span>
                              </span>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{step}</h3>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Job Photos */}
                  {job.images && job.images.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Job Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {job.images.map((image, index) => (
                          <div key={index} className="relative h-40 rounded-lg overflow-hidden group">
                            <img 
                              src={image} 
                              alt={`Job image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button className="p-2 bg-white rounded-full">
                                <FontAwesomeIcon icon={faEye} className="text-gray-800" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="h-[600px] flex flex-col">
                  {/* Chat header */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Message Center</h2>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                        {chatMessages.length} messages
                      </span>
                    </div>
                    <div>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderType === 'provider' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg p-4 ${
                            message.senderType === 'provider' 
                              ? 'bg-blue-600 text-white' 
                              : message.senderType === 'system' 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600' 
                              : 'bg-gray-100 dark:bg-gray-750 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-medium text-sm ${
                              message.senderType === 'provider' 
                                ? 'text-blue-100' 
                                : message.senderType === 'system' 
                                ? 'text-gray-600 dark:text-gray-300' 
                                : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {message.sender}
                            </span>
                            <span className={`text-xs ml-2 ${
                              message.senderType === 'provider' 
                                ? 'text-blue-200' 
                                : message.senderType === 'system' 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-sm whitespace-pre-line ${
                            message.senderType === 'provider' 
                              ? 'text-white' 
                              : message.senderType === 'system' 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {message.message}
                          </p>
                          
                          {/* Display any attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} 
                                  className={`flex items-center p-2 rounded ${
                                    message.senderType === 'provider' 
                                      ? 'bg-blue-700' 
                                      : 'bg-white dark:bg-gray-700'
                                  }`}
                                >
                                  <FontAwesomeIcon 
                                    icon={
                                      attachment.type.startsWith('image/') ? faFileImage : 
                                      attachment.type === 'application/pdf' ? faFilePdf : 
                                      faFile
                                    } 
                                    className={message.senderType === 'provider' ? 'text-blue-200' : 'text-blue-500 dark:text-blue-400'} 
                                  />
                                  <span className={`ml-2 text-xs truncate ${
                                    message.senderType === 'provider' 
                                      ? 'text-blue-100' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {attachment.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                  
                  {/* Chat input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    {attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full px-3 py-1">
                            <FontAwesomeIcon 
                              icon={
                                file.type.startsWith('image/') ? faFileImage : 
                                file.type === 'application/pdf' ? faFilePdf : 
                                faFile
                              } 
                              className="mr-1" 
                            />
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <button 
                              onClick={() => removeAttachment(index)}
                              className="ml-1.5 text-blue-500 hover:text-blue-700"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={handleAttachmentClick}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-750 rounded-full"
                      >
                        <FontAwesomeIcon icon={faPaperclip} />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() && attachments.length === 0}
                        className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-full"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - auction details */}
          {job.jobType === 'auction' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auction Details</h2>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bidding Ends</h3>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(job.deadlineBidding!)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Bids</h3>
                  <div className="space-y-4">
                    {job.bids.map((bid) => (
                      <div key={bid.id} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          {bid.providerAvatar ? (
                            <img 
                              src={bid.providerAvatar} 
                              alt={bid.providerName}
                              className="h-10 w-10 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                              <FontAwesomeIcon icon={faUser} />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{bid.providerName}</h4>
                            <div className="flex items-center mt-1">
                              {Array(5).fill(0).map((_, i) => (
                                <FontAwesomeIcon 
                                  key={i} 
                                  icon={faStar} 
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(bid.providerRating || 0) 
                                      ? 'text-yellow-400' 
                                      : i < (bid.providerRating || 0) 
                                        ? 'text-yellow-300' 
                                        : 'text-gray-300 dark:text-gray-600'
                                  }`} 
                                />
                              ))}
                              <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">
                                {(bid.providerRating || 0).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">£{bid.amount.toFixed(2)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Bid placed {formatDate(bid.createdAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Place Your Bid</h3>
                  <form onSubmit={handleSubmitBid} className="space-y-4">
                    <div>
                      <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bid Amount (£)</label>
                      <input
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message (optional)</label>
                      <textarea
                        id="bidMessage"
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingBid}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:bg-blue-300 dark:disabled:bg-blue-900 disabled:cursor-not-allowed"
                      >
                        {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
