'use client';

import { faEye, faFileDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    variant?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    shippingMethod: string;
    items: OrderItem[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export default function OrdersManagement() {
    const [orders] = useState<Order[]>([
        {
            id: '1',
            orderNumber: 'ORD-2023-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            date: '2023-11-01',
            status: 'pending',
            total: 1299.99,
            paymentStatus: 'paid',
            shippingMethod: 'Express Shipping',
            items: [
                {
                    productId: '1',
                    name: 'iPhone 15 Pro',
                    quantity: 1,
                    price: 1299.99,
                    variant: '256GB - Space Black',
                },
            ],
            shippingAddress: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
            },
        },
        // Add more sample orders
    ]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

    const filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
        });

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status];
    };

    const getPaymentStatusColor = (status: Order['paymentStatus']) => {
        const colors = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        };
        return colors[status];
    };

    const exportOrders = () => {
        // Implement CSV export functionality
        console.log('Exporting orders...');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Orders</h2>
                <button onClick={exportOrders} className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                    Export Orders
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="rounded-lg border-gray-300 focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <select
                    className="rounded-lg border-gray-300 focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value as 'asc' | 'desc')}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedOrder(order)} className="text-[#dc711a] hover:text-[#dc711a]/80">
                                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
}
