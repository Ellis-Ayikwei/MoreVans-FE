import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimes,
  faDownload,
  faCalendarAlt,
  faBox,
  faMapMarkerAlt,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  pickup_location: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partial';
  items: string;
  createdAt: string;
  notes: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, paymentStatusFilter, dateRangeFilter]);
  
  const fetchBookings = () => {
    // Mock data for bookings
    const mockBookings: Booking[] = [
      {
        id: 'BK-10045',
        customerId: 'U-1001',
        customerName: 'John Smith',
        providerId: 'P-101',
        providerName: 'Express Movers',
        pickup_location: '123 Main St, New York, NY 10001',
        deliveryLocation: '456 Park Ave, New York, NY 10022',
        pickupDate: '2023-05-20T09:00:00',
        deliveryDate: '2023-05-20T14:00:00',
        status: 'completed',
        amount: 120,
        paymentStatus: 'paid',
        items: 'Furniture, Boxes (5)',
        createdAt: '2023-05-15T10:30:00',
        notes: 'Customer requested extra padding for furniture'
      },
      {
        id: 'BK-10046',
        customerId: 'U-1002',
        customerName: 'Sarah Johnson',
        providerId: 'P-102',
        providerName: 'Quick Transport',
        pickup_location: '789 Oak St, Chicago, IL 60007',
        deliveryLocation: '321 Elm St, Chicago, IL 60614',
        pickupDate: '2023-05-22T13:30:00',
        deliveryDate: '2023-05-22T17:30:00',
        status: 'confirmed',
        amount: 95,
        paymentStatus: 'pending',
        items: 'Office equipment, Boxes (3)',
        createdAt: '2023-05-18T14:45:00',
        notes: ''
      },
      {
        id: 'BK-10047',
        customerId: 'U-1005',
        customerName: 'Robert Wilson',
        providerId: 'P-103',
        providerName: 'City Movers',
        pickup_location: '555 Pine St, Los Angeles, CA 90001',
        deliveryLocation: '777 Beach Blvd, Los Angeles, CA 90045',
        pickupDate: '2023-05-23T11:00:00',
        deliveryDate: '2023-05-23T16:00:00',
        status: 'in_progress',
        amount: 210,
        paymentStatus: 'partial',
        items: 'Household items, Furniture, Fragile items',
        createdAt: '2023-05-17T09:20:00',
        notes: 'Customer will help with loading'
      },
      {
        id: 'BK-10048',
        customerId: 'U-1004',
        customerName: 'Emily Davis',
        providerId: 'P-101',
        providerName: 'Express Movers',
        pickup_location: '888 Market St, San Francisco, CA 94103',
        deliveryLocation: '999 Mission St, San Francisco, CA 94105',
        pickupDate: '2023-05-25T10:00:00',
        deliveryDate: '2023-05-25T14:30:00',
        status: 'pending',
        amount: 150,
        paymentStatus: 'pending',
        items: 'Studio apartment items',
        createdAt: '2023-05-20T16:30:00',
        notes: 'Building has elevator access'
      },
      {
        id: 'BK-10049',
        customerId: 'U-1003',
        customerName: 'Michael Brown',
        providerId: 'P-104',
        providerName: 'Premier Van Service',
        pickup_location: '444 Thomas St, Seattle, WA 98109',
        deliveryLocation: '222 Spring St, Seattle, WA 98104',
        pickupDate: '2023-05-21T09:00:00',
        deliveryDate: '2023-05-21T12:00:00',
        status: 'cancelled',
        amount: 85,
        paymentStatus: 'refunded',
        items: 'Small furniture items',
        createdAt: '2023-05-15T11:15:00',
        notes: 'Cancelled due to weather'
      },
      {
        id: 'BK-10050',
        customerId: 'U-1006',
        customerName: 'Jennifer Miller',
        providerId: 'P-106',
        providerName: 'ABC Van Rentals',
        pickup_location: '111 Congress Ave, Austin, TX 78701',
        deliveryLocation: '333 Lamar Blvd, Austin, TX 78703',
        pickupDate: '2023-05-24T08:30:00',
        deliveryDate: '2023-05-24T12:30:00',
        status: 'confirmed',
        amount: 110,
        paymentStatus: 'paid',
        items: 'Office relocation, Desks, Chairs',
        createdAt: '2023-05-19T14:00:00',
        notes: 'Business move'
      },
      {
        id: 'BK-10051',
        customerId: 'U-1007',
        customerName: 'David Garcia',
        providerId: 'P-102',
        providerName: 'Quick Transport',
        pickup_location: '555 Liberty St, Boston, MA 02110',
        deliveryLocation: '777 Atlantic Ave, Boston, MA 02111',
        pickupDate: '2023-05-26T14:00:00',
        deliveryDate: '2023-05-26T17:00:00',
        status: 'pending',
        amount: 135,
        paymentStatus: 'pending',
        items: 'Apartment items, Boxes (10)',
        createdAt: '2023-05-21T10:45:00',
        notes: ''
      },
      {
        id: 'BK-10052',
        customerId: 'U-1009',
        customerName: 'James Martinez',
        providerId: 'P-103',
        providerName: 'City Movers',
        pickup_location: '888 Peachtree St, Atlanta, GA 30309',
        deliveryLocation: '999 Piedmont Ave, Atlanta, GA 30309',
        pickupDate: '2023-05-19T10:00:00',
        deliveryDate: '2023-05-19T13:00:00',
        status: 'completed',
        amount: 90,
        paymentStatus: 'paid',
        items: 'Studio apartment move',
        createdAt: '2023-05-14T09:30:00',
        notes: 'Quick move within same neighborhood'
      }
    ];
    
    setBookings(mockBookings);
  };
  
  const filterBookings = () => {
    let filtered = bookings;
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
      const startDate = new Date(dateRangeFilter.startDate);
      const endDate = new Date(dateRangeFilter.endDate);
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.pickupDate);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }
    
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handlePaymentStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatusFilter(e.target.value);
  };
  
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRangeFilter({
      ...dateRangeFilter,
      [name]: value
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    }
  };
  
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };
  
  const handleExportBookings = () => {
    // In a real app, this would create a CSV or PDF file for download
    alert('Exporting bookings...');
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Booking Management</h2>
        <div className="flex space-x-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleExportBookings}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col space-y-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search bookings by ID, customer, provider, or location..."
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                  value={paymentStatusFilter}
                  onChange={handlePaymentStatusFilterChange}
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                  <option value="partial">Partial</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRangeFilter.startDate}
                onChange={handleDateRangeChange}
              />
            </div>
            
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRangeFilter.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
            
            <button
              className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setDateRangeFilter({ startDate: '', endDate: '' })}
            >
              Clear Dates
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(booking.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faBox} className="mr-1" />
                        {booking.items.length > 25 
                          ? `${booking.items.substring(0, 25)}...`
                          : booking.items
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {booking.pickup_location.length > 25 
                          ? `${booking.pickup_location.substring(0, 25)}...`
                          : booking.pickup_location
                        }
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {booking.deliveryLocation.length > 25 
                          ? `${booking.deliveryLocation.substring(0, 25)}...`
                          : booking.deliveryLocation
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.providerName}</div>
                      <div className="text-sm text-gray-500">{booking.providerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                        {booking.amount}
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.pickupDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link
                          to={`/admin/bookings/${booking.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Booking"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            className="text-orange-600 hover:text-orange-900"
                            onClick={() => handleCancelBooking(booking.id)}
                            title="Cancel Booking"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteBooking(booking.id)}
                          title="Delete Booking"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No bookings found. Try adjusting your filters.
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
                    {indexOfLastItem > filteredBookings.length ? filteredBookings.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredBookings.length}</span> results
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
    </div>
  );
};

export default BookingManagement;