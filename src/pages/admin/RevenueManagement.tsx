import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faDownload,
  faChartLine,
  faDollarSign,
  faPercent,
  faExchangeAlt,
  faCalendarAlt,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  type: 'payment' | 'refund' | 'payout' | 'fee';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  date: string;
  description: string;
}

interface RevenueStats {
  totalRevenue: number;
  platformFees: number;
  providerPayouts: number;
  netIncome: number;
  pendingPayments: number;
  refundsIssued: number;
  transactionCount: number;
  averageBookingValue: number;
  revenueByMonth: { [key: string]: number };
  revenueByPaymentMethod: { [key: string]: number };
}

const RevenueManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [timeRange, setTimeRange] = useState('6months');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    fetchTransactions();
    fetchRevenueStats();
  }, []);
  
  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRangeFilter]);
  
  const fetchTransactions = () => {
    // Mock data for transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'TXN-1001',
        bookingId: 'BK-10045',
        customerId: 'U-1001',
        customerName: 'John Smith',
        providerId: 'P-101',
        providerName: 'Express Movers',
        type: 'payment',
        amount: 120,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2023-05-15T14:30:00',
        description: 'Payment for booking BK-10045'
      },
      {
        id: 'TXN-1002',
        bookingId: 'BK-10045',
        customerId: 'U-1001',
        customerName: 'John Smith',
        providerId: 'P-101',
        providerName: 'Express Movers',
        type: 'fee',
        amount: 24,
        status: 'completed',
        paymentMethod: 'System',
        date: '2023-05-15T14:30:05',
        description: 'Platform fee for booking BK-10045'
      },
      {
        id: 'TXN-1003',
        bookingId: 'BK-10045',
        customerId: 'U-1001',
        customerName: 'John Smith',
        providerId: 'P-101',
        providerName: 'Express Movers',
        type: 'payout',
        amount: 96,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        date: '2023-05-21T10:15:00',
        description: 'Payout to provider for booking BK-10045'
      },
      {
        id: 'TXN-1004',
        bookingId: 'BK-10046',
        customerId: 'U-1002',
        customerName: 'Sarah Johnson',
        providerId: 'P-102',
        providerName: 'Quick Transport',
        type: 'payment',
        amount: 95,
        status: 'pending',
        paymentMethod: 'PayPal',
        date: '2023-05-18T16:45:00',
        description: 'Payment for booking BK-10046'
      },
      {
        id: 'TXN-1005',
        bookingId: 'BK-10047',
        customerId: 'U-1005',
        customerName: 'Robert Wilson',
        providerId: 'P-103',
        providerName: 'City Movers',
        type: 'payment',
        amount: 210,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2023-05-17T11:30:00',
        description: 'Payment for booking BK-10047'
      },
      {
        id: 'TXN-1006',
        bookingId: 'BK-10047',
        customerId: 'U-1005',
        customerName: 'Robert Wilson',
        providerId: 'P-103',
        providerName: 'City Movers',
        type: 'fee',
        amount: 42,
        status: 'completed',
        paymentMethod: 'System',
        date: '2023-05-17T11:30:05',
        description: 'Platform fee for booking BK-10047'
      },
      {
        id: 'TXN-1007',
        bookingId: 'BK-10049',
        customerId: 'U-1003',
        customerName: 'Michael Brown',
        providerId: 'P-104',
        providerName: 'Premier Van Service',
        type: 'payment',
        amount: 85,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2023-05-15T12:00:00',
        description: 'Payment for booking BK-10049'
      },
      {
        id: 'TXN-1008',
        bookingId: 'BK-10049',
        customerId: 'U-1003',
        customerName: 'Michael Brown',
        providerId: 'P-104',
        providerName: 'Premier Van Service',
        type: 'refund',
        amount: 85,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2023-05-16T14:20:00',
        description: 'Refund for cancelled booking BK-10049'
      },
      {
        id: 'TXN-1009',
        bookingId: 'BK-10050',
        customerId: 'U-1006',
        customerName: 'Jennifer Miller',
        providerId: 'P-106',
        providerName: 'ABC Van Rentals',
        type: 'payment',
        amount: 110,
        status: 'completed',
        paymentMethod: 'PayPal',
        date: '2023-05-19T15:30:00',
        description: 'Payment for booking BK-10050'
      },
      {
        id: 'TXN-1010',
        bookingId: 'BK-10050',
        customerId: 'U-1006',
        customerName: 'Jennifer Miller',
        providerId: 'P-106',
        providerName: 'ABC Van Rentals',
        type: 'fee',
        amount: 22,
        status: 'completed',
        paymentMethod: 'System',
        date: '2023-05-19T15:30:05',
        description: 'Platform fee for booking BK-10050'
      },
      {
        id: 'TXN-1011',
        bookingId: 'BK-10050',
        customerId: 'U-1006',
        customerName: 'Jennifer Miller',
        providerId: 'P-106',
        providerName: 'ABC Van Rentals',
        type: 'payout',
        amount: 88,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        date: '2023-05-25T09:00:00',
        description: 'Pending payout to provider for booking BK-10050'
      },
      {
        id: 'TXN-1012',
        bookingId: 'BK-10051',
        customerId: 'U-1007',
        customerName: 'David Garcia',
        providerId: 'P-102',
        providerName: 'Quick Transport',
        type: 'payment',
        amount: 135,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        date: '2023-05-21T11:45:00',
        description: 'Payment for booking BK-10051'
      },
      {
        id: 'TXN-1013',
        bookingId: 'BK-10052',
        customerId: 'U-1009',
        customerName: 'James Martinez',
        providerId: 'P-103',
        providerName: 'City Movers',
        type: 'payment',
        amount: 90,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2023-05-14T10:30:00',
        description: 'Payment for booking BK-10052'
      },
      {
        id: 'TXN-1014',
        bookingId: 'BK-10052',
        customerId: 'U-1009',
        customerName: 'James Martinez',
        providerId: 'P-103',
        providerName: 'City Movers',
        type: 'fee',
        amount: 18,
        status: 'completed',
        paymentMethod: 'System',
        date: '2023-05-14T10:30:05',
        description: 'Platform fee for booking BK-10052'
      },
      {
        id: 'TXN-1015',
        bookingId: 'BK-10052',
        customerId: 'U-1009',
        customerName: 'James Martinez',
        providerId: 'P-103',
        providerName: 'City Movers',
        type: 'payout',
        amount: 72,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        date: '2023-05-20T11:00:00',
        description: 'Payout to provider for booking BK-10052'
      }
    ];
    
    setTransactions(mockTransactions);
  };
  
  const fetchRevenueStats = () => {
    // Mock data for revenue statistics
    const mockStats: RevenueStats = {
      totalRevenue: 845,
      platformFees: 106,
      providerPayouts: 256,
      netIncome: 106,
      pendingPayments: 230,
      refundsIssued: 85,
      transactionCount: 15,
      averageBookingValue: 120.71,
      revenueByMonth: {
        'Jan 2023': 2800,
        'Feb 2023': 3200,
        'Mar 2023': 2900,
        'Apr 2023': 3500,
        'May 2023': 845,
        'Jun 2023': 0
      },
      revenueByPaymentMethod: {
        'Credit Card': 505,
        'PayPal': 205,
        'Bank Transfer': 135
      }
    };
    
    setRevenueStats(mockStats);
  };
  
  const filterTransactions = () => {
    let filtered = transactions;
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(transaction => 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
      const startDate = new Date(dateRangeFilter.startDate);
      const endDate = new Date(dateRangeFilter.endDate);
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRangeFilter({
      ...dateRangeFilter,
      [name]: value
    });
  };
  
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };
  
  const handleExportCSV = () => {
    // In a real app, this would create a CSV file for download
    alert('Exporting transactions as CSV...');
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeBadgeClass = (type: string): string => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      case 'payout': return 'bg-purple-100 text-purple-800';
      case 'fee': return 'bg-green-100 text-green-800';
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
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Chart data
  const months = Object.keys(revenueStats?.revenueByMonth || {});
  const monthlyRevenue = Object.values(revenueStats?.revenueByMonth || {});
  
  const revenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const paymentMethodLabels = Object.keys(revenueStats?.revenueByPaymentMethod || {});
  const paymentMethodValues = Object.values(revenueStats?.revenueByPaymentMethod || {});
  
  const paymentMethodChartData = {
    labels: paymentMethodLabels,
    datasets: [
      {
        label: 'Revenue by Payment Method',
        data: paymentMethodValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(251, 146, 60, 0.5)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 146, 60, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Revenue Management</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <select
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            onClick={handleExportCSV}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>
      
      {revenueStats && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                  <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                  <FontAwesomeIcon icon={faPercent} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Platform Fees</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.platformFees)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                  <FontAwesomeIcon icon={faExchangeAlt} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Provider Payouts</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.providerPayouts)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                  <FontAwesomeIcon icon={faReceipt} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Net Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.netIncome)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Pending Payments</p>
              <p className="text-xl font-bold">{formatCurrency(revenueStats.pendingPayments)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Refunds Issued</p>
              <p className="text-xl font-bold">{formatCurrency(revenueStats.refundsIssued)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Transaction Count</p>
              <p className="text-xl font-bold">{revenueStats.transactionCount}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Avg. Booking Value</p>
              <p className="text-xl font-bold">{formatCurrency(revenueStats.averageBookingValue)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-4">Monthly Revenue</h3>
              <div className="h-64">
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-4">Revenue by Payment Method</h3>
              <div className="h-64 flex justify-center">
                <Pie
                  data={paymentMethodChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                placeholder="Search transactions by ID, booking, customer, or provider..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="md:w-48">
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                >
                  <option value="all">All Types</option>
                  <option value="payment">Payment</option>
                  <option value="refund">Refund</option>
                  <option value="payout">Payout</option>
                  <option value="fee">Fee</option>
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
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
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
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-xs text-gray-500">
                        {transaction.type === 'payment' || transaction.type === 'refund'
                          ? transaction.customerName
                          : transaction.providerName
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'refund' ? 'text-orange-600' : 
                        transaction.type === 'payout' ? 'text-purple-600' : 
                        transaction.type === 'payment' ? 'text-blue-600' : 'text-green-600'}>
                        {transaction.type === 'refund' || transaction.type === 'payout' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found. Try adjusting your filters.
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
                    {indexOfLastItem > filteredTransactions.length ? filteredTransactions.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredTransactions.length}</span> results
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

export default RevenueManagement;