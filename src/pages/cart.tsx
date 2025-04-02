'use client';

import { faMinus, faPlus, faShoppingBag, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import CheckoutModal from '../components/Checkout/CheckoutModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    maxQuantity: number;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'iPhone 15 Pro',
            price: 999.99,
            image: 'https://images.unsplash.com/photo-1696426505229-c77d2448c210',
            quantity: 1,
            maxQuantity: 5,
        },
        // Add more items...
    ]);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const updateQuantity = (id: string, newQuantity: number) => {
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(Math.max(1, newQuantity), item.maxQuantity) } : item)));
    };

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 9.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    const handleGuestCheckout = () => {
        // Implement guest checkout logic
        console.log('Proceeding with guest checkout');
    };

    const handleSignInCheckout = () => {
        // Implement sign-in checkout logic
        console.log('Proceeding with sign-in checkout');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
            </div>

            {cartItems.length === 0 ? (
                <Card className="text-center py-12">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Add some items to your cart!</p>
                    <Button variant="primary" size="lg" className="animate-float">
                        Continue Shopping
                    </Button>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="flex gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                        <p className="text-lg font-bold text-primary-500 mt-1">${item.price.toLocaleString()}</p>
                                        <div className="flex items-center space-x-4 mt-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-crypto-border"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-crypto-border"
                                                    disabled={item.quantity >= item.maxQuantity}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                        <span className="font-medium">${shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                        <span className="font-medium">${tax.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t dark:border-gray-700 pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary-500">${total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setIsCheckoutModalOpen(true)}>
                                    Proceed to Checkout
                                </Button>
                            </Card>
                        </div>
                    </div>

                    <CheckoutModal
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                        total={total}
                        onGuestCheckout={handleGuestCheckout}
                        onSignInCheckout={handleSignInCheckout}
                    />
                </>
            )}
        </div>
    );
}
