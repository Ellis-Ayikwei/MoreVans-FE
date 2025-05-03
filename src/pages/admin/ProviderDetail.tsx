import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faStar,
  faCheckCircle,
  faBan,
  faEdit,
  faTrash,
  faTruck,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faClipboardList,
  faUserShield,
  faMoneyBillWave,
  faExclamationTriangle,
  faHistory,
  faFileContract,
  faShieldAlt,
  faCarAlt,
  faAddressCard,
  faCertificate,
  faIdCard,
  faUser,
  faPlus,
  faEye
} from '@fortawesome/free-solid-svg-icons';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinDate: string;
  lastActive: string;
  rating: number;
  completedBookings: number;
  vehicleCount: number;
  verificationStatus: 'verified' | 'unverified' | 'in_progress';
  businessInfo?: {
    registrationNumber: string;
    taxId: string;
    businessType: string;
    foundedYear: number;
    website: string;
    operatingAreas: string[];
  };
  contactPerson?: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  documents?: {
    id: string;
    type: 'business_license' | 'insurance' | 'vehicle_registration' | 'identity_proof';
    name: string;
    uploadDate: string;
    status: 'approved' | 'pending' | 'rejected';
    fileUrl: string;
  }[];
  vehicles?: {
    id: string;
    type: string;
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    capacity: string;
    status: 'active' | 'maintenance' | 'inactive';
    lastInspection: string;
  }[];
  recentBookings?: {
    id: string;
    date: string;
    customer: string;
    amount: number;
    status: string;
  }[];
  paymentHistory?: {
    id: string;
    date: string;
    amount: number;
    type: 'payout' | 'refund' | 'fee';
    status: 'completed' | 'pending' | 'failed';
  }[];
  reviews?: {
    id: string;
    customerName: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

const ProviderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetchProviderDetails();
  }, [id]);
  
  const fetchProviderDetails = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for provider details
      const mockProvider: Provider = {
        id: id || 'P-101',
        name: 'Express Movers',
        email: 'contact@expressmovers.com',
        phone: '(555) 123-4567',
        address: '1234 Transport Ave, New York, NY 10001',
        status: 'active',
        joinDate: '2023-02-10T14:20:00',
        lastActive: '2023-05-22T09:15:00',
        rating: 4.8,
        completedBookings: 156,
        vehicleCount: 8,
        verificationStatus: 'verified',
        businessInfo: {
          registrationNumber: 'BRN-123456',
          taxId: 'TAX-987654321',
          businessType: 'Limited Liability Company',
          foundedYear: 2018,
          website: 'https://expressmovers.com',
          operatingAreas: ['New York', 'New Jersey', 'Connecticut']
        },
        contactPerson: {
          name: 'John Smith',
          position: 'Operations Manager',
          email: 'john.smith@expressmovers.com',
          phone: '(555) 234-5678'
        },
        bankDetails: {
          accountHolder: 'Express Movers LLC',
          accountNumber: '****4321',
          bankName: 'Chase Bank',
          routingNumber: '***7890'
        },
        documents: [
          {
            id: 'doc-1',
            type: 'business_license',
            name: 'Business License',
            uploadDate: '2023-01-15T10:30:00',
            status: 'approved',
            fileUrl: '#'
          },
          {
            id: 'doc-2',
            type: 'insurance',
            name: 'Insurance Certificate',
            uploadDate: '2023-01-16T11:20:00',
            status: 'approved',
            fileUrl: '#'
          },
          {
            id: 'doc-3',
            type: 'vehicle_registration',
            name: 'Vehicle Registration',
            uploadDate: '2023-01-17T09:45:00',
            status: 'approved',
            fileUrl: '#'
          },
          {
            id: 'doc-4',
            type: 'identity_proof',
            name: 'Identity Proof',
            uploadDate: '2023-01-18T14:10:00',
            status: 'approved',
            fileUrl: '#'
          }
        ],
        vehicles: [
          {
            id: 'veh-1',
            type: 'Box Truck',
            make: 'Ford',
            model: 'E-450',
            year: 2020,
            registrationNumber: 'NY-ABC-1234',
            capacity: '16 ft / 3,000 lbs',
            status: 'active',
            lastInspection: '2023-01-10T10:00:00'
          },
          {
            id: 'veh-2',
            type: 'Van',
            make: 'Mercedes-Benz',
            model: 'Sprinter',
            year: 2021,
            registrationNumber: 'NY-DEF-5678',
            capacity: '12 ft / 2,000 lbs',
            status: 'active',
            lastInspection: '2023-01-12T11:30:00'
          },
          {
            id: 'veh-3',
            type: 'Box Truck',
            make: 'Chevrolet',
            model: 'Express',
            year: 2019,
            registrationNumber: 'NY-GHI-9012',
            capacity: '14 ft / 2,500 lbs',
            status: 'maintenance',
            lastInspection: '2023-01-08T09:15:00'
          }
        ],
        recentBookings: [
          {
            id: 'book-1',
            date: '2023-05-20T09:00:00',
            customer: 'Sarah Johnson',
            amount: 350.00,
            status: 'completed'
          },
          {
            id: 'book-2',
            date: '2023-05-18T14:30:00',
            customer: 'Michael Brown',
            amount: 275.50,
            status: 'completed'
          },
          {
            id: 'book-3',
            date: '2023-05-22T10:15:00',
            customer: 'David Wilson',
            amount: 420.75,
            status: 'in_progress'
          },
          {
            id: 'book-4',
            date: '2023-05-25T13:00:00',
            customer: 'Jennifer Lee',
            amount: 315.25,
            status: 'scheduled'
          }
        ],
        paymentHistory: [
          {
            id: 'pay-1',
            date: '2023-05-21T15:10:00',
            amount: 332.50,
            type: 'payout',
            status: 'completed'
          },
          {
            id: 'pay-2',
            date: '2023-05-19T11:45:00',
            amount: 261.73,
            type: 'payout',
            status: 'completed'
          },
          {
            id: 'pay-3',
            date: '2023-05-17T09:30:00',
            amount: 50.00,
            type: 'refund',
            status: 'completed'
          },
          {
            id: 'pay-4',
            date: '2023-05-15T14:20:00',
            amount: 35.00,
            type: 'fee',
            status: 'completed'
          }
        ],
        reviews: [
          {
            id: 'rev-1',
            customerName: 'Sarah Johnson',
            rating: 5,
            date: '2023-05-20T16:30:00',
            comment: 'Excellent service! The movers were professional, on time, and handled all my belongings with care.'
          },
          {
            id: 'rev-2',
            customerName: 'Michael Brown',
            rating: 4.5,
            date: '2023-05-18T17:45:00',
            comment: 'Great experience overall. They were a bit late to arrive but made up for it with quick and efficient moving.'
          },
          {
            id: 'rev-3',
            customerName: 'Emily Davis',
            rating: 5,
            date: '2023-05-15T11:20:00',
            comment: 'Would definitely recommend! They made my moving day stress-free and were very accommodating.'
          }
        ]
      };
      
      setProvider(mockProvider);
      setLoading(false);
    }, 1000);
  };
  
  const handleActivateProvider = () => {
    if (provider) {
      setProvider({ ...provider, status: 'active' });
    }
  };
  
  const handleSuspendProvider = () => {
    if (provider) {
      setProvider({ ...provider, status: 'suspended' });
    }
  };
  
  const handleVerifyProvider = () => {
    if (provider) {
      setProvider({ ...provider, verificationStatus: 'verified' });
    }
  };
  
  const handleDeleteProvider = () => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      // In a real app, make API call to delete provider
      navigate('/admin/providers');
    }
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getVerificationBadgeClass = (status: string): string => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'unverified': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="relative inline-block">
            <FontAwesomeIcon icon={faStar} className="text-gray-300" />
            <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            </span>
          </span>
        );
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !provider) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
          <p>{error || 'Provider not found'}</p>
        </div>
        <div className="mt-4">
          <Link 
            to="/admin/providers"
            className="text-red-700 hover:text-red-900 font-medium"
          >
            Back to Providers
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/admin/providers" className="text-blue-600 hover:text-blue-800 mr-4">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h2 className="text-xl font-semibold">Provider Details</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/admin/providers/${provider.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Provider
            </Link>
            {provider.status !== 'active' ? (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleActivateProvider}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Activate
              </button>
            ) : (
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleSuspendProvider}
              >
                <FontAwesomeIcon icon={faBan} className="mr-2" />
                Suspend
              </button>
            )}
            {provider.verificationStatus !== 'verified' && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleVerifyProvider}
              >
                <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                Verify
              </button>
            )}
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleDeleteProvider}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Provider Summary Card */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6 p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center md:justify-start">
            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faTruck} className="text-gray-500 text-4xl" />
            </div>
          </div>
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{provider.name}</h3>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(provider.status)}`}>
                    {provider.status}
                  </span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getVerificationBadgeClass(provider.verificationStatus)}`}>
                    {provider.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <StarRating rating={provider.rating} />
                  <span className="ml-2 text-sm text-gray-500">({provider.completedBookings} bookings)</span>
                </div>
                <div className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Joined: {formatDate(provider.joinDate)}
                </div>
                <div className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faClock} className="mr-1" /> Last Active: {formatDate(provider.lastActive)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm">{provider.email}</div>
                </div>
              </div>
              <div className="flex items-start">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm">{provider.phone}</div>
                </div>
              </div>
              <div className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="text-sm">{provider.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'vehicles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('vehicles')}
            >
              Vehicles
            </button>
            <button
              className={`${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button
              className={`${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </nav>
        </div>
      </div>
      
      {/* Content Based on Active Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <FontAwesomeIcon icon={faAddressCard} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Business Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Business Type</div>
                  <div className="w-2/3 text-sm">{provider.businessInfo?.businessType || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Registration Number</div>
                  <div className="w-2/3 text-sm">{provider.businessInfo?.registrationNumber || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Tax ID</div>
                  <div className="w-2/3 text-sm">{provider.businessInfo?.taxId || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Founded Year</div>
                  <div className="w-2/3 text-sm">{provider.businessInfo?.foundedYear || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Website</div>
                  <div className="w-2/3 text-sm">
                    {provider.businessInfo?.website ? (
                      <a href={provider.businessInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {provider.businessInfo.website}
                      </a>
                    ) : 'N/A'}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Operating Areas</div>
                  <div className="w-2/3 text-sm">
                    {provider.businessInfo?.operatingAreas?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {provider.businessInfo.operatingAreas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Person */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Contact Person</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Name</div>
                  <div className="w-2/3 text-sm">{provider.contactPerson?.name || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Position</div>
                  <div className="w-2/3 text-sm">{provider.contactPerson?.position || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Email</div>
                  <div className="w-2/3 text-sm">{provider.contactPerson?.email || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Phone</div>
                  <div className="w-2/3 text-sm">{provider.contactPerson?.phone || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Banking Information */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Banking Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Account Holder</div>
                  <div className="w-2/3 text-sm">{provider.bankDetails?.accountHolder || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Bank Name</div>
                  <div className="w-2/3 text-sm">{provider.bankDetails?.bankName || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Account Number</div>
                  <div className="w-2/3 text-sm">{provider.bankDetails?.accountNumber || 'N/A'}</div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm text-gray-500">Routing Number</div>
                  <div className="w-2/3 text-sm">{provider.bankDetails?.routingNumber || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Quick Stats</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-500 text-lg font-semibold">{provider.completedBookings}</div>
                  <div className="text-sm text-gray-500">Completed Bookings</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-500 text-lg font-semibold">{provider.rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-yellow-500 text-lg font-semibold">{provider.vehicleCount}</div>
                  <div className="text-sm text-gray-500">Vehicles</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-purple-500 text-lg font-semibold">
                    {Math.floor((new Date().getTime() - new Date(provider.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} mo
                  </div>
                  <div className="text-sm text-gray-500">Member For</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'vehicles' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCarAlt} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Provider Vehicles</h3>
            </div>
            <Link
              to={`/admin/providers/${provider.id}/vehicles/add`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add Vehicle
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Inspection
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {provider.vehicles && provider.vehicles.length > 0 ? (
                  provider.vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vehicle.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</div>
                        <div className="text-sm text-gray-500">{vehicle.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vehicle.registrationNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vehicle.capacity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(vehicle.lastInspection)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/vehicles/${vehicle.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                          <Link
                            to={`/admin/vehicles/${vehicle.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Vehicle"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No vehicles found for this provider.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'bookings' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFileContract} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
            </div>
            <Link
              to={`/admin/bookings?providerId=${provider.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Bookings
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {provider.recentBookings && provider.recentBookings.length > 0 ? (
                  provider.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(booking.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${booking.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found for this provider.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'payments' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Payment History</h3>
            </div>
            <Link
              to={`/admin/revenue?providerId=${provider.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Payments
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {provider.paymentHistory && provider.paymentHistory.length > 0 ? (
                  provider.paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(payment.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${payment.type === 'refund' || payment.type === 'fee' ? 'text-red-600' : 'text-green-600'}`}>
                          {payment.type === 'refund' || payment.type === 'fee' ? '-' : ''}${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/revenue/transactions/${payment.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No payment history found for this provider.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <FontAwesomeIcon icon={faStar} className="text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
          </div>
          <div className="p-6">
            {provider.reviews && provider.reviews.length > 0 ? (
              <div className="space-y-6">
                {provider.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{review.customerName}</div>
                      <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No reviews found for this provider.
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'documents' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Verification Documents</h3>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Upload Document
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {provider.documents && provider.documents.length > 0 ? (
                  provider.documents.map((document) => (
                    <tr key={document.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={
                              document.type === 'business_license' ? faCertificate :
                              document.type === 'insurance' ? faShieldAlt :
                              document.type === 'vehicle_registration' ? faCarAlt :
                              faIdCard
                            } 
                            className="text-gray-400 mr-2" 
                          />
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(document.uploadDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(document.status)}`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Document"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </a>
                          {document.status === 'pending' && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Approve Document"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Reject Document"
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No documents found for this provider.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetail;