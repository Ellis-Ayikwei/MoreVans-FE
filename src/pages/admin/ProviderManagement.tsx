import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faEdit,
  faTrash,
  faBan,
  faCheckCircle,
  faEye,
  faStar,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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
}

const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'pending',
    verificationStatus: 'unverified'
  });
  
  useEffect(() => {
    fetchProviders();
  }, []);
  
  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, statusFilter, verificationFilter]);
  
  const fetchProviders = () => {
    // Mock data for providers
    const mockProviders: Provider[] = [
      {
        id: 'P-101',
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
        verificationStatus: 'verified'
      },
      {
        id: 'P-102',
        name: 'Quick Transport',
        email: 'support@quicktransport.com',
        phone: '(555) 234-5678',
        address: '2345 Moving Blvd, Chicago, IL 60007',
        status: 'active',
        joinDate: '2023-01-15T10:30:00',
        lastActive: '2023-05-21T16:45:00',
        rating: 4.5,
        completedBookings: 98,
        vehicleCount: 5,
        verificationStatus: 'verified'
      },
      {
        id: 'P-103',
        name: 'City Movers',
        email: 'info@citymovers.com',
        phone: '(555) 345-6789',
        address: '3456 Relocation St, Los Angeles, CA 90001',
        status: 'active',
        joinDate: '2023-03-22T09:00:00',
        lastActive: '2023-05-20T11:30:00',
        rating: 4.2,
        completedBookings: 76,
        vehicleCount: 4,
        verificationStatus: 'verified'
      },
      {
        id: 'P-104',
        name: 'Premier Van Service',
        email: 'contact@premiervan.com',
        phone: '(555) 456-7890',
        address: '4567 Transport Way, Seattle, WA 98001',
        status: 'inactive',
        joinDate: '2023-02-28T11:45:00',
        lastActive: '2023-04-15T10:20:00',
        rating: 3.9,
        completedBookings: 42,
        vehicleCount: 3,
        verificationStatus: 'verified'
      },
      {
        id: 'P-105',
        name: 'Reliable Transport Co.',
        email: 'support@reliabletransport.com',
        phone: '(555) 567-8901',
        address: '5678 Moving Lane, Dallas, TX 75001',
        status: 'pending',
        joinDate: '2023-05-05T14:00:00',
        lastActive: '2023-05-05T14:00:00',
        rating: 0,
        completedBookings: 0,
        vehicleCount: 6,
        verificationStatus: 'in_progress'
      },
      {
        id: 'P-106',
        name: 'ABC Van Rentals',
        email: 'bookings@abcvans.com',
        phone: '(555) 678-9012',
        address: '6789 Delivery Rd, Boston, MA 02101',
        status: 'active',
        joinDate: '2023-01-20T09:30:00',
        lastActive: '2023-05-21T14:15:00',
        rating: 4.6,
        completedBookings: 122,
        vehicleCount: 12,
        verificationStatus: 'verified'
      },
      {
        id: 'P-107',
        name: 'Moving Experts Inc.',
        email: 'info@movingexperts.com',
        phone: '(555) 789-0123',
        address: '7890 Carrier St, Miami, FL 33101',
        status: 'suspended',
        joinDate: '2023-02-15T11:00:00',
        lastActive: '2023-04-28T16:30:00',
        rating: 2.8,
        completedBookings: 37,
        vehicleCount: 5,
        verificationStatus: 'verified'
      },
      {
        id: 'P-108',
        name: 'Swift Logistics',
        email: 'contact@swiftlogistics.com',
        phone: '(555) 890-1234',
        address: '8901 Transit Ave, Denver, CO 80201',
        status: 'pending',
        joinDate: '2023-05-10T10:15:00',
        lastActive: '2023-05-10T10:15:00',
        rating: 0,
        completedBookings: 0,
        vehicleCount: 4,
        verificationStatus: 'unverified'
      }
    ];
    
    setProviders(mockProviders);
  };
  
  const filterProviders = () => {
    let filtered = providers;
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(provider => provider.status === statusFilter);
    }
    
    // Apply verification filter
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(provider => provider.verificationStatus === verificationFilter);
    }
    
    setFilteredProviders(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleVerificationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerificationFilter(e.target.value);
  };
  
  const handleAddProvider = () => {
    setIsAddModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    // Reset form data
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'pending',
      verificationStatus: 'unverified'
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new provider with mock ID and other default values
    const newProvider: Provider = {
      id: `P-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      status: formData.status as 'active' | 'inactive' | 'pending' | 'suspended',
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      rating: 0,
      completedBookings: 0,
      vehicleCount: 0,
      verificationStatus: formData.verificationStatus as 'verified' | 'unverified' | 'in_progress'
    };
    
    // Add new provider to providers array
    setProviders([...providers, newProvider]);
    
    // Close modal and reset form
    handleCloseModal();
  };
  
  const handleDeleteProvider = (providerId: string) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      setProviders(providers.filter(provider => provider.id !== providerId));
    }
  };
  
  const handleActivateProvider = (providerId: string) => {
    setProviders(providers.map(provider => 
      provider.id === providerId ? { ...provider, status: 'active' } : provider
    ));
  };
  
  const handleSuspendProvider = (providerId: string) => {
    setProviders(providers.map(provider => 
      provider.id === providerId ? { ...provider, status: 'suspended' } : provider
    ));
  };
  
  const handleVerifyProvider = (providerId: string) => {
    setProviders(providers.map(provider => 
      provider.id === providerId ? { ...provider, verificationStatus: 'verified' } : provider
    ));
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
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
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Provider Management</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleAddProvider}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Provider
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search providers by name, email, or ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={verificationFilter}
                onChange={handleVerificationFilterChange}
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="in_progress">In Progress</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faTruck} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.email}</div>
                          <div className="text-sm text-gray-500">{provider.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(provider.status)}`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationBadgeClass(provider.verificationStatus)}`}>
                        {provider.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={provider.rating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.vehicleCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.completedBookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(provider.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/providers/${provider.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link
                          to={`/admin/providers/${provider.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Provider"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        {provider.status !== 'active' ? (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleActivateProvider(provider.id)}
                            title="Activate Provider"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        ) : (
                          <button
                            className="text-orange-600 hover:text-orange-900"
                            onClick={() => handleSuspendProvider(provider.id)}
                            title="Suspend Provider"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        )}
                        {provider.verificationStatus !== 'verified' && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleVerifyProvider(provider.id)}
                            title="Verify Provider"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteProvider(provider.id)}
                          title="Delete Provider"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No providers found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > filteredProviders.length ? filteredProviders.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredProviders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Provider Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Provider</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationStatus">
                  Verification Status
                </label>
                <select
                  id="verificationStatus"
                  name="verificationStatus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.verificationStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="unverified">Unverified</option>
                  <option value="in_progress">In Progress</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderManagement;