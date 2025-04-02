'use client';

import { useState } from 'react';

interface SellerSettings {
    storeName: string;
    storeDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    shippingMethods: {
        id: string;
        name: string;
        price: number;
        estimatedDays: string;
        isActive: boolean;
    }[];
    paymentMethods: {
        id: string;
        name: string;
        isActive: boolean;
    }[];
    returnPolicy: string;
    autoAcceptOrders: boolean;
    minimumOrderAmount: number;
}

export default function SellerSettings() {
    const [settings, setSettings] = useState<SellerSettings>({
        storeName: '',
        storeDescription: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        shippingMethods: [
            {
                id: '1',
                name: 'Standard Shipping',
                price: 5.99,
                estimatedDays: '3-5',
                isActive: true,
            },
            {
                id: '2',
                name: 'Express Shipping',
                price: 15.99,
                estimatedDays: '1-2',
                isActive: true,
            },
        ],
        paymentMethods: [
            { id: '1', name: 'Credit Card', isActive: true },
            { id: '2', name: 'PayPal', isActive: true },
            { id: '3', name: 'Bank Transfer', isActive: false },
        ],
        returnPolicy: '',
        autoAcceptOrders: true,
        minimumOrderAmount: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle settings update
        console.log('Updated settings:', settings);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Store Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Store Information */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">Store Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Description</label>
                        <textarea
                            name="storeDescription"
                            rows={4}
                            value={settings.storeDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Shipping Methods */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">Shipping Methods</h3>

                    {settings.shippingMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h4 className="font-medium dark:text-white">{method.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    ${method.price} • {method.estimatedDays} days
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={method.isActive}
                                    onChange={() => {
                                        setSettings((prev) => ({
                                            ...prev,
                                            shippingMethods: prev.shippingMethods.map((m) => (m.id === method.id ? { ...m, isActive: !m.isActive } : m)),
                                        }));
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#dc711a]/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc711a]"></div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">Payment Methods</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {settings.paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="font-medium dark:text-white">{method.name}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={method.isActive}
                                        onChange={() => {
                                            setSettings((prev) => ({
                                                ...prev,
                                                paymentMethods: prev.paymentMethods.map((m) => (m.id === method.id ? { ...m, isActive: !m.isActive } : m)),
                                            }));
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#dc711a]/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc711a]"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">Additional Settings</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-accept Orders</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="autoAcceptOrders"
                                    checked={settings.autoAcceptOrders}
                                    onChange={(e) => setSettings((prev) => ({ ...prev, autoAcceptOrders: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#dc711a]/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc711a]"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Order Amount ($)</label>
                            <input
                                type="number"
                                name="minimumOrderAmount"
                                value={settings.minimumOrderAmount}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Policy</label>
                            <textarea
                                name="returnPolicy"
                                rows={4}
                                value={settings.returnPolicy}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Enter your store's return policy..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc711a]">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
