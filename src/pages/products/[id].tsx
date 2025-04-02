'use client';

import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductReview from '../../components/Products/ProductReview';

export default function ProductDetail() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState('128GB');
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'John Doe',
            rating: 5,
            comment: 'Absolutely love this phone! The camera is amazing and the performance is top-notch.',
        },
        {
            id: 2,
            name: 'Jane Smith',
            rating: 4,
            comment: 'Great phone, but I wish the battery life was a bit better.',
        },
    ]);

    // Mock product data - replace with actual data fetching
    const product = {
        id,
        name: 'iPhone 13 Pro',
        price: 999,
        description: 'The latest iPhone with amazing features...',
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179', // Random image from the internet
        category: 'Phones',
        brand: 'Apple',
        specs: [
            { label: 'Storage', value: '128GB', price: 999 },
            { label: 'Storage', value: '256GB', price: 1099 },
            { label: 'Storage', value: '512GB', price: 1299 },
        ],
    };

    const handleAddReview = (review: any) => {
        setReviews([...reviews, review]);
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Product Details for Product ID: {id}</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square rounded-lg overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold dark:text-white">{product.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-[#dc711a]">${product.price}</span>
                        <span className="text-gray-500 line-through">${product.price * 1.2}</span>
                    </div>

                    {/* Specification Selector */}
                    <div className="flex items-center space-x-4">
                        <label className="dark:text-white">Select Storage:</label>
                        <select
                            value={selectedSpec}
                            onChange={(e) => {
                                const selected = product.specs.find((spec) => spec.value === e.target.value);
                                setSelectedSpec(selected?.value || '');
                            }}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {product.specs.map((spec) => (
                                <option key={spec.value} value={spec.value}>
                                    {spec.value} - ${spec.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                        <label className="dark:text-white">Quantity:</label>
                        <div className="flex items-center border rounded-md">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border-r hover:bg-gray-100 dark:hover:bg-gray-700">
                                -
                            </button>
                            <span className="px-4 py-1 dark:text-white">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border-l hover:bg-gray-100 dark:hover:bg-gray-700">
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button className="flex-1 bg-[#dc711a] text-white px-6 py-3 rounded-lg hover:bg-[#dc711a]/90 transition-colors">
                            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                            Add to Cart
                        </button>
                        <button className="px-6 py-3 border border-[#dc711a] text-[#dc711a] rounded-lg hover:bg-[#dc711a]/10 transition-colors">
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>

                    {/* Specifications */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Specifications</h3>
                        <dl className="space-y-2">
                            {product.specs.map((spec) => (
                                <div key={spec.label} className="flex">
                                    <dt className="w-1/3 text-gray-600 dark:text-gray-400">{spec.label}</dt>
                                    <dd className="w-2/3 dark:text-white">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-6">More Information</h2>
            <ul className="space-y-2">
                <li>
                    <Link to="/faq" className="text-blue-500 hover:underline">
                        Frequently Asked Questions
                    </Link>
                </li>
                <li>
                    <Link to="/shipping-info" className="text-blue-500 hover:underline">
                        Shipping Information
                    </Link>
                </li>
                <li>
                    <Link to="/returns" className="text-blue-500 hover:underline">
                        Returns Policy
                    </Link>
                </li>
            </ul>

            {/* Product Reviews Section */}
            <ProductReview reviews={reviews} onAddReview={handleAddReview} />
        </div>
    );
}
