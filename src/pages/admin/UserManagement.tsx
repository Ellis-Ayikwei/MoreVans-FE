import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBuilding,
  faFilter,
  faSearch,
  faBan,
  faCheck,
  faEdit,
  faTrash,
  faEye,
  faUserShield,
  faExclamationTriangle,
  faSort,
  faSortUp,
  faSortDown,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface UserAccount {
  id: string;
  accountType: 'customer' | 'provider';
  accountStatus: 'active' | 'pending' | 'suspended' | 'inactive';
  verificationStatus: 'verified' | 'unverified' | 'pending' | 'rejected';
  name: string;
  email: string;
  phone: string;
  dateRegistered: string;
  lastLogin: string;
  businessName?: string;
  businessAddress?: string;
  vatNumber?: string;
  companyRegistrationNumber?: string;
  numberOfVehicles?: number;
  numberOfCompletedBookings: number;
  rating: number;
  notes?: string;
  suspensionReason?: string;
}

interface SortConfig {
  key: keyof UserAccount;
  direction: 'ascending' | 'descending';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'dateRegistered', 
    direction: 'descending' 
  });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Fetch mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers: UserAccount[] = [
        {
          id: 'U-1001',
          accountType: 'customer',
          accountStatus: 'active',
          verificationStatus: 'verified',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+44 7123 456789',
          dateRegistered: '2024-03-15T10:30:00',
          lastLogin: '2025-04-11T14:25:00',
          numberOfCompletedBookings: 7,
          rating: 4.8
        },
        {
          id: 'U-1002',
          accountType: 'customer',
          accountStatus: 'active',
          verificationStatus: 'verified',
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com',
          phone: '+44 7234 567890',
          dateRegistered: '2024-02-23T15:45:00',
          lastLogin: '2025-04-10T09:15:00',
          numberOfCompletedBookings: 4,
          rating: 4.5
        },
        {
          id: 'U-1003',
          accountType: 'customer',
          accountStatus: 'suspended',
          verificationStatus: 'verified',
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          phone: '+44 7345 678901',
          dateRegistered: '2024-05-07T11:20:00',
          lastLogin: '2025-03-28T16:40:00',
          numberOfCompletedBookings: 2,
          rating: 3.2,
          suspensionReason: 'Multiple payment failures and disputed charges'
        },
        {
          id: 'U-1004',
          accountType: 'customer',
          accountStatus: 'pending',
          verificationStatus: 'pending',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+44 7456 789012',
          dateRegistered: '2025-04-09T13:10:00',
          lastLogin: '2025-04-09T13:15:00',
          numberOfCompletedBookings: 0,
          rating: 0
        },
        {
          id: 'P-1001',
          accountType: 'provider',
          accountStatus: 'active',
          verificationStatus: 'verified',
          name: 'Fast Movers Ltd',
          businessName: 'Fast Movers Ltd',
          email: 'contact@fastmovers.com',
          phone: '+44 20 1234 5678',
          dateRegistered: '2024-01-10T09:00:00',
          lastLogin: '2025-04-11T11:30:00',
          businessAddress: '123 Business Park, London, UK',
          vatNumber: 'GB123456789',
          companyRegistrationNumber: '12345678',
          numberOfVehicles: 12,
          numberOfCompletedBookings: 156,
          rating: 4.6
        },
        {
          id: 'P-1002',
          accountType: 'provider',
          accountStatus: 'active',
          verificationStatus: 'verified',
          name: 'City Logistics',
          businessName: 'City Logistics',
          email: 'info@citylogistics.com',
          phone: '+44 20 2345 6789',
          dateRegistered: '2024-02-05T14:20:00',
          lastLogin: '2025-04-10T16:15:00',
          businessAddress: '456 Industrial Estate, Manchester, UK',
          vatNumber: 'GB234567890',
          companyRegistrationNumber: '23456789',
          numberOfVehicles: 8,
          numberOfCompletedBookings: 98,
          rating: 4.2
        },
        {
          id: 'P-1003',
          accountType: 'provider',
          accountStatus: 'pending',
          verificationStatus: 'pending',
          name: 'Express Delivery Services',
          businessName: 'Express Delivery Services',
          email: 'contact@expressdelivery.com',
          phone: '+44 20 3456 7890',
          dateRegistered: '2025-04-05T10:45:00',
          lastLogin: '2025-04-05T11:20:00',
          businessAddress: '789 Business Center, Birmingham, UK',
          vatNumber: 'GB345678901',
          companyRegistrationNumber: '34567890',
          numberOfVehicles: 5,
          numberOfCompletedBookings: 0,
          rating: 0
        },
        {
          id: 'P-1004',
          accountType: 'provider',
          accountStatus: 'suspended',
          verificationStatus: 'verified',
          name: 'Quick Transport',
          businessName: 'Quick Transport',
          email: 'info@quicktransport.com',
          phone: '+44 20 4567 8901',
          dateRegistered: '2024-03-12T13:30:00',
          lastLogin: '2025-03-20T15:10:00',
          businessAddress: '101 Business Park, Leeds, UK',
          vatNumber: 'GB456789012',
          companyRegistrationNumber: '45678901',
          numberOfVehicles: 7,
          numberOfCompletedBookings: 42,
          rating: 3.8,
          suspensionReason: 'Multiple customer complaints about late deliveries and damaged goods'
        },
        {
          id: 'P-1005',
          accountType: 'provider',
          accountStatus: 'inactive',
          verificationStatus: 'rejected',
          name: 'Budget Movers',
          businessName: 'Budget Movers',
          email: 'contact@budgetmovers.com',
          phone: '+44 20 5678 9012',
          dateRegistered: '2024-04-20T11:15:00',
          lastLogin: '2025-04-01T09:30:00',
          businessAddress: '222 Industrial Park, Bristol, UK',
          vatNumber: 'GB567890123',
          companyRegistrationNumber: '56789012',
          numberOfVehicles: 3,
          numberOfCompletedBookings: 12,
          rating: 2.7,
          notes: 'Failed verification. Insurance documents appear to be fraudulent.'
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter and search users
  useEffect(() => {
    let result = [...users];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'customers') {
        result = result.filter(user => user.accountType === 'customer');
      } else if (activeFilter === 'providers') {
        result = result.filter(user => user.accountType === 'provider');
      } else {
        result = result.filter(user => 
          user.accountStatus === activeFilter || 
          user.verificationStatus === activeFilter
        );
      }
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        (user.businessName && user.businessName.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, activeFilter, searchQuery, sortConfig]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  const handleSort = (key: keyof UserAccount) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };
  
  const handleSuspend = (user: UserAccount) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
    setSuspensionReason(user.suspensionReason || '');
  };
  
  const handleConfirmSuspend = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            accountStatus: user.accountStatus === 'suspended' ? 'active' : 'suspended',
            suspensionReason: user.accountStatus === 'suspended' ? undefined : suspensionReason
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setShowSuspendModal(false);
      setSuspensionReason('');
      setSelectedUser(null);
    }
  };
  
  const handleDelete = (user: UserAccount) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedUser) {
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };
  
  const handleVerifyUser = (user: UserAccount) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          verificationStatus: 'verified'
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'unverified': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <Link
            to="/admin/customer-management/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Customer
          </Link>
          <Link
            to="/admin/provider-management/new"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add Provider
          </Link>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('all')}
            >
              All Users
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'customers'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('customers')}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Customers
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'providers'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('providers')}
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Providers
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('active')}
            >
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Active
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'suspended'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('suspended')}
            >
              <FontAwesomeIcon icon={faBan} className="mr-2" />
              Suspended
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${
                activeFilter === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('pending')}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Pending
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    <span>User</span>
                    {sortConfig.key === 'name' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('accountType')}
                >
                  <div className="flex items-center">
                    <span>Type</span>
                    {sortConfig.key === 'accountType' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dateRegistered')}
                >
                  <div className="flex items-center">
                    <span>Registered</span>
                    {sortConfig.key === 'dateRegistered' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('accountStatus')}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {sortConfig.key === 'accountStatus' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('numberOfCompletedBookings')}
                >
                  <div className="flex items-center">
                    <span>Bookings</span>
                    {sortConfig.key === 'numberOfCompletedBookings' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center">
                    <span>Rating</span>
                    {sortConfig.key === 'rating' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon 
                            icon={user.accountType === 'provider' ? faBuilding : faUsers} 
                            className={user.accountType === 'provider' ? 'text-purple-500' : 'text-blue-500'} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountType === 'provider' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.accountType}
                      </span>
                      {user.businessName && (
                        <div className="text-xs text-gray-500 mt-1">{user.businessName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.dateRegistered)}</div>
                      <div className="text-xs text-gray-500">
                        Last login: {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.accountStatus)}`}>
                          {user.accountStatus}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.verificationStatus)}`}>
                          {user.verificationStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.numberOfCompletedBookings}
                      {user.accountType === 'provider' && user.numberOfVehicles && (
                        <div className="text-xs text-gray-500">
                          Vehicles: {user.numberOfVehicles}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {user.rating > 0 ? user.rating.toFixed(1) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/${user.accountType === 'provider' ? 'providers' : 'customers'}/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link
                          to={`/admin/${user.accountType === 'provider' ? 'providers' : 'customers'}/${user.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        {user.verificationStatus === 'pending' && (
                          <button
                            onClick={() => handleVerifyUser(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Verify User"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}
                        <button
                          onClick={() => handleSuspend(user)}
                          className={`${user.accountStatus === 'suspended' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                          title={user.accountStatus === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                        >
                          <FontAwesomeIcon icon={user.accountStatus === 'suspended' ? faCheck : faBan} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
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
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>
      
      {/* Suspend User Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {selectedUser.accountStatus === 'suspended' ? 'Reactivate User Account' : 'Suspend User Account'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {selectedUser.accountStatus === 'suspended' 
                  ? 'Are you sure you want to reactivate this user account?' 
                  : 'Are you sure you want to suspend this user account? Please provide a reason:'}
              </p>
              
              {selectedUser.accountStatus !== 'suspended' && (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Enter reason for suspension"
                ></textarea>
              )}
              
              <div className="mt-4 border-t pt-4 text-sm">
                <p className="font-bold">User Details:</p>
                <p>{selectedUser.name} ({selectedUser.id})</p>
                <p>{selectedUser.email}</p>
                <p>{selectedUser.accountType.charAt(0).toUpperCase() + selectedUser.accountType.slice(1)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSelectedUser(null);
                  setSuspensionReason('');
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white text-sm ${
                  selectedUser.accountStatus === 'suspended'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={handleConfirmSuspend}
                disabled={selectedUser.accountStatus !== 'suspended' && !suspensionReason.trim()}
              >
                {selectedUser.accountStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Delete User Account</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to permanently delete this user account? This action cannot be undone.
              </p>
              
              <div className="mt-4 border-t pt-4 text-sm">
                <p className="font-bold">User Details:</p>
                <p>{selectedUser.name} ({selectedUser.id})</p>
                <p>{selectedUser.email}</p>
                <p>{selectedUser.accountType.charAt(0).toUpperCase() + selectedUser.accountType.slice(1)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded text-white text-sm hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;