'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface OrderDetailsModalProps {
    order: any; // Use the Order interface from OrdersManagement
    onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    const updateOrderStatus = (newStatus: string) => {
        // Implement status update logic
        console.log('Updating order status to:', newStatus);
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Order Details - {order.orderNumber}
                            </Dialog.Title>

                            <div className="space-y-6">
                                {/* Customer Information */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Customer Information</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Name: {order.customerName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Email: {order.customerEmail}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress.street}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress.country}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Order Items</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.productId} className="flex justify-between items-center py-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    {item.variant && <p className="text-sm text-gray-500 dark:text-gray-400">{item.variant}</p>}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {item.quantity} x ${item.price}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.quantity * item.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t dark:border-gray-600 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Status Update */}
                                <div className="border-t dark:border-gray-600 pt-4">
                                    <div className="flex items-center justify-between">
                                        <select
                                            className="rounded-lg border-gray-300 focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
