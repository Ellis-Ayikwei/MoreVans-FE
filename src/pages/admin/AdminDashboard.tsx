import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faTruck, 
  faClipboardList, 
  faMoneyBillWave, 
  faChartLine, 
  faUserShield, 
  faSearch, 
  faFilter 
} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  completedBookings: number;
  joinDate: string;
}

interface Booking {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  amount: number;
}

interface RevenueData {
  month: string;
  amount: number;
}

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  activeProviders: number;
  pendingProviders: number;
  recentBookings: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    // Fetch data
    fetchStats();
    fetchUsers();
    fetchProviders();
    fetchBookings();
    fetchRevenueData();
  }, []);
  
  const fetchStats = () => {
    // Mock data for admin stats
    const mockStats: AdminStats = {
      totalUsers: 1250,
      totalProviders: 85,
      totalBookings: 3750,
      totalRevenue: 125000,
      activeUsers: 980,
      activeProviders: 72,
      pendingProviders: 8,
      recentBookings: 145
    };
    
    setStats(mockStats);
  };
  
  const fetchUsers = () => {
    // Mock data for users
    const mockUsers: User[] = [
      {
        id: 'U-1001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2023-01-15T10:30:00'
      },
      // Add more mock users as needed
    ];
    
    setUsers(mockUsers);
  };
  
  const fetchProviders = () => {
    // Mock data for providers
    const mockProviders: Provider[] = [
      {
        id: 'P-101',
        name: 'Express Movers',
        email: 'contact@expressmovers.com',
        phone: '(555) 123-4567',
        status: 'active',
        rating: 4.8,
        completedBookings: 156,
        joinDate: '2023-02-10T14:20:00'
      },
      // Add more mock providers as needed
    ];
    
    setProviders(mockProviders);
  };
  
  const fetchBookings = () => {
    // Mock data for bookings
    const mockBookings: Booking[] = [
      {
        id: 'BK-10045',
        userId: 'U-1001',
        userName: 'John Smith',
        providerId: 'P-101',
        providerName: 'Express Movers',
        status: 'completed',
        date: '2023-05-20T09:00:00',
        amount: 120
      },
      // Add more mock bookings as needed
    ];
    
    setBookings(mockBookings);
  };
  
  const fetchRevenueData = () => {
    // Mock data for revenue chart
    const mockRevenueData: RevenueData[] = [
      { month: 'Jan', amount: 3200 },
      { month: 'Feb', amount: 3800 },
      { month: 'Mar', amount: 4100 },
      { month: 'Apr', amount: 4800 },
      { month: 'May', amount: 5200 },
      { month: 'Jun', amount: 3700 }
    ];
    
    setRevenueData(mockRevenueData);
  };
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'providers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Providers
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
              Revenue
            </button>
          </nav>
        </div>
        
        {activeTab === 'dashboard' && stats && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                    <FontAwesomeIcon icon={faUsers} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                    <FontAwesomeIcon icon={faTruck} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Providers</p>
                    <p className="text-2xl font-bold">{stats.totalProviders}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                    <FontAwesomeIcon icon={faClipboardList} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold mb-4">User Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold">{stats.activeUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600">Active Providers</span>
                    <span className="font-semibold">{stats.activeProviders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(stats.activeProviders / stats.totalProviders) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600">Pending Providers</span>
                    <span className="font-semibold">{stats.pendingProviders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-600 h-2.5 rounded-full" 
                      style={{ width: `${(stats.pendingProviders / stats.totalProviders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Bookings (Last 7 days)</span>
                    <span className="font-semibold">{stats.recentBookings}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Monthly Revenue</h4>
                    <div className="h-48 flex items-end space-x-2">
                      {revenueData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ 
                              height: `${(data.amount / Math.max(...revenueData.map(d => d.amount))) * 100}%`,
                              minHeight: '10px'
                            }}
                          ></div>
                          <span className="text-xs mt-1">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other tabs would be implemented here */}
      </div>
    </div>
  );
};

export default AdminDashboard; 