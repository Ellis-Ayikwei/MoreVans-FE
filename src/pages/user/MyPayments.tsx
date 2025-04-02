import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faCreditCard,
  faMoneyBillWave,
  faCalendarAlt,
  faDownload,
  faReceipt,
  faSearch,
  faFilter,
  faWallet,
  faInfoCircle,
  faChevronDown,
  faChevronUp,
  faPlus,
  faCheck,
  faTimes,
  faHistory,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
  brand?: string;
}

interface Payment {
  id: string;
  bookingId: string;
  serviceType: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethodId: string;
  invoiceUrl: string;
  description: string;
}

// Mock data for customer payments
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    lastFour: '4242',
    expiryDate: '04/2026',
    isDefault: true,
    brand: 'Visa'
  },
  {
    id: 'pm_2',
    type: 'card',
    lastFour: '5555',
    expiryDate: '09/2025',
    isDefault: false,
    brand: 'Mastercard'
  },
  {
    id: 'pm_3',
    type: 'paypal',
    lastFour: 'user@example.com',
    isDefault: false
  }
];

const mockPayments: Payment[] = [
  {
    id: 'pay_1',
    bookingId: 'REQ-12345',
    serviceType: 'Residential Moving',
    amount: 249.99,
    status: 'paid',
    date: '2025-04-01',
    paymentMethodId: 'pm_1',
    invoiceUrl: '#',
    description: 'Full payment for residential moving service'
  },
  {
    id: 'pay_2',
    bookingId: 'REQ-23456',
    serviceType: 'Office Relocation',
    amount: 649.99,
    status: 'pending',
    date: '2025-04-03',
    paymentMethodId: 'pm_1',
    invoiceUrl: '#',
    description: 'Deposit for office relocation (50%)'
  },
  {
    id: 'pay_3',
    bookingId: 'REQ-23456',
    serviceType: 'Office Relocation',
    amount: 650.00,
    status: 'pending',
    date: '2025-04-05',
    paymentMethodId: 'pm_1',
    invoiceUrl: '#',
    description: 'Remaining balance for office relocation'
  },
  {
    id: 'pay_4',
    bookingId: 'REQ-34567',
    serviceType: 'Piano Moving',
    amount: 399.99,
    status: 'paid',
    date: '2025-03-18',
    paymentMethodId: 'pm_2',
    invoiceUrl: '#',
    description: 'Full payment for piano moving service'
  },
  {
    id: 'pay_5',
    bookingId: 'REQ-56789',
    serviceType: 'Vehicle Transportation',
    amount: 129.99,
    status: 'refunded',
    date: '2025-03-10',
    paymentMethodId: 'pm_3',
    invoiceUrl: '#',
    description: 'Refunded due to service cancellation'
  }
];

const CustomerPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [addingNewMethod, setAddingNewMethod] = useState(false);

  // Filter payments based on status and search query
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const togglePaymentDetails = (paymentId: string) => {
    if (expandedPayment === paymentId) {
      setExpandedPayment(null);
    } else {
      setExpandedPayment(paymentId);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return faCreditCard;
      case 'bank': return faMoneyBillWave;
      case 'paypal': return faWallet;
      default: return faMoneyBillWave;
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with gradient background */}
      <div className="relative py-8 mb-8 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            My Payments
          </h1>
          <p className="text-white text-opacity-90 mt-2">Manage your payment history and methods</p>
        </div>
      </div>

      {/* Content container */}
      <div className="w-full max-w-[90rem] mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faWallet} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Paid</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalPaid.toFixed(2)}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Pending Payments</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalPending.toFixed(2)}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faCreditCard} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Payment Methods</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{paymentMethods.length}</div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg dark:shadow-gray-900/30 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Payment Methods</h2>
            <button 
              onClick={() => setAddingNewMethod(!addingNewMethod)} 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={addingNewMethod ? faTimes : faPlus} className="mr-1" />
              {addingNewMethod ? 'Cancel' : 'Add New'}
            </button>
          </div>
          
          {addingNewMethod && (
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 animate-fadeIn">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="•••• •••• •••• ••••"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                    <input 
                      type="text" 
                      placeholder="•••"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name on Card</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600 w-full">
                    Add Card
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={getPaymentMethodIcon(method.type)} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                      {method.type === 'card' ? (
                        <>
                          {method.brand} •••• {method.lastFour}
                          {method.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          PayPal ({method.lastFour})
                          {method.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {method.type === 'card' && method.expiryDate && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">Expires {method.expiryDate}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                      Set as Default
                    </button>
                  )}
                  <button className="px-2 py-1 text-xs border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg dark:shadow-gray-900/30 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Search by payment ID, booking ID or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-500 dark:text-gray-400" />
              <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <select 
                className="border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden">
                {/* Payment Header */}
                <div 
                  className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                           hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => togglePaymentDetails(payment.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 mr-3">
                          {payment.serviceType}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">{payment.id}</span> • Booking {payment.bookingId}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 gap-y-1 sm:gap-x-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500 dark:text-blue-400" />
                          ${payment.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <FontAwesomeIcon 
                        icon={expandedPayment === payment.id ? faChevronUp : faChevronDown} 
                        className="text-gray-500 dark:text-gray-400" 
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPayment === payment.id && (
                  <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-750 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Payment Details</h3>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Payment ID</p>
                              <p className="text-sm font-medium dark:text-gray-200">{payment.id}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Booking ID</p>
                              <p className="text-sm font-medium dark:text-gray-200">{payment.bookingId}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                              <p className="text-sm font-medium dark:text-gray-200">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                              <p className="text-sm font-medium dark:text-gray-200">${payment.amount.toFixed(2)}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                              <p className="text-sm font-medium dark:text-gray-200">
                                {paymentMethods.find(m => m.id === payment.paymentMethodId)?.type === 'card' 
                                  ? `${paymentMethods.find(m => m.id === payment.paymentMethodId)?.brand} •••• ${paymentMethods.find(m => m.id === payment.paymentMethodId)?.lastFour}`
                                  : 'PayPal'
                                }
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                              <p className={`text-sm font-medium ${
                                payment.status === 'paid' ? 'text-green-600 dark:text-green-400' :
                                payment.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                                payment.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                                'text-purple-600 dark:text-purple-400'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-md font-semibold mt-4 mb-3 text-gray-700 dark:text-gray-300">Service Details</h3>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Service Type</p>
                            <p className="text-sm font-medium dark:text-gray-200">{payment.serviceType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                            <p className="text-sm dark:text-gray-300">{payment.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Actions</h3>
                        
                        <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                          <div className="flex flex-wrap gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
                                            text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                              <FontAwesomeIcon icon={faDownload} className="mr-2" />
                              Download Invoice
                            </button>
                            
                            <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                                            text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
                                            px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                              <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                              View Receipt
                            </button>
                            
                            {payment.status === 'pending' && (
                              <button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                                              text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>

                        {payment.status === 'failed' && (
                          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-md">
                            <div className="flex">
                              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mr-3 mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Payment Failed</h3>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                  There was an issue processing your payment. Please try again or use a different payment method.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {payment.status === 'pending' && (
                          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-md mt-4">
                            <div className="flex">
                              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-3 mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Payment Information</h3>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                  This payment is scheduled for automatic processing on {new Date(payment.date).toLocaleDateString()}.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No payments found</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || filterStatus !== 'all' ? 
                  'Try adjusting your filters or search terms' : 
                  'You haven\'t made any payments yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPayments;