import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faInfoCircle, faClock, faMapMarkerAlt, faBox, faTruck, faShieldAlt, faCheckCircle, faRoute, faStar, faCalculator, faPercent, faCalendarAlt, faUsers, faTools, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconClipboardCheck, IconShieldCheck, IconThumbUp, IconDiscount2 } from '@tabler/icons-react';

type ServiceType = 'instant' | 'bidding' | 'journey';

interface PriceData {
    price: number;
    savings: number;
    deliveryTime: string;
    features: string[];
    basePrice: number;
    additionalFees: {
        name: string;
        amount: number;
        description: string;
    }[];
    discounts: {
        name: string;
        amount: number;
        description: string;
    }[];
    rating: number;
    reviews: number;
}

interface PriceDataMap {
    [key: string]: PriceData;
}

interface PriceForecastProps {
    onBack: () => void;
    onAccept: (selectedPrice: any) => void;
    requestData: any;
}

const PriceForecast: React.FC<PriceForecastProps> = ({ onBack, onAccept, requestData }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState<ServiceType>('instant');
    const [showBreakdown, setShowBreakdown] = useState(false);
    const forecastRef = useRef<HTMLDivElement>(null);

    // Add useEffect for auto-scrolling
    useEffect(() => {
        if (forecastRef.current) {
            forecastRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, []);

    // Mock data - replace with actual data from your backend
    const priceData: PriceDataMap = {
        instant: {
            price: 299.99,
            savings: 50,
            deliveryTime: '2-3 hours',
            basePrice: 349.99,
            rating: 4.8,
            reviews: 1245,
            features: [
                'Immediate service availability',
                'Fixed price guarantee',
                'Professional movers',
                'Insurance coverage',
                'Real-time tracking',
                'Priority support'
            ],
            additionalFees: [
                {
                    name: 'Distance Fee',
                    amount: 25.00,
                    description: 'Based on pickup to dropoff distance'
                },
                {
                    name: 'Floor Access',
                    amount: 15.00,
                    description: 'For locations above ground floor'
                }
            ],
            discounts: [
                {
                    name: 'First-time User',
                    amount: 25.00,
                    description: 'Special discount for new customers'
                },
                {
                    name: 'Weekday Booking',
                    amount: 10.00,
                    description: 'Discount for weekday service'
                }
            ]
        },
        bidding: {
            price: 249.99,
            savings: 100,
            deliveryTime: '24-48 hours',
            basePrice: 349.99,
            rating: 4.6,
            reviews: 892,
            features: [
                'Competitive pricing',
                'Multiple mover options',
                'Price comparison',
                'Flexible scheduling',
                'Custom quotes',
                'Negotiation options'
            ],
            additionalFees: [
                {
                    name: 'Multiple Quotes',
                    amount: 0.00,
                    description: 'Free price comparison'
                },
                {
                    name: 'Express Processing',
                    amount: 20.00,
                    description: 'Faster quote processing'
                }
            ],
            discounts: [
                {
                    name: 'Bulk Booking',
                    amount: 50.00,
                    description: 'Discount for multiple items'
                },
                {
                    name: 'Seasonal Offer',
                    amount: 30.00,
                    description: 'Limited time discount'
                }
            ]
        },
        journey: {
            price: 399.99,
            savings: 150,
            deliveryTime: 'Custom schedule',
            basePrice: 549.99,
            rating: 4.9,
            reviews: 567,
            features: [
                'Multi-stop service',
                'Customized route',
                'Flexible timing',
                'Premium support',
                'Dedicated coordinator',
                'Priority handling'
            ],
            additionalFees: [
                {
                    name: 'Additional Stops',
                    amount: 35.00,
                    description: 'Per additional stop'
                },
                {
                    name: 'Route Optimization',
                    amount: 20.00,
                    description: 'Optimal route planning'
                }
            ],
            discounts: [
                {
                    name: 'Long-term Booking',
                    amount: 75.00,
                    description: 'For advance bookings'
                },
                {
                    name: 'Premium Service',
                    amount: 40.00,
                    description: 'Premium service package'
                }
            ]
        }
    };

    const calculateTotal = (type: ServiceType) => {
        const data = priceData[type];
        const fees = data.additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
        const discounts = data.discounts.reduce((sum, discount) => sum + discount.amount, 0);
        return data.basePrice + fees - discounts;
    };

    const handleAccept = () => {
        const selectedData = priceData[selectedTimeframe];
        onAccept({
            type: selectedTimeframe,
            basePrice: selectedData.basePrice,
            totalPrice: calculateTotal(selectedTimeframe),
            savings: selectedData.savings,
            deliveryTime: selectedData.deliveryTime,
            features: selectedData.features,
            additionalFees: selectedData.additionalFees,
            discounts: selectedData.discounts,
            rating: selectedData.rating,
            reviews: selectedData.reviews
        });
    };

    return (
        <div ref={forecastRef} className="space-y-8">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Price Forecast
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Choose your preferred service type and get an instant price estimate
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faCalculator} className="text-blue-500 text-xl" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Price Calculator
                        </span>
                    </div>
                </div>
            </div>

            {/* Service Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Select Service Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(priceData).map(([type, data]) => (
                        <button
                            key={type}
                            onClick={() => setSelectedTimeframe(type as ServiceType)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedTimeframe === type
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {type === 'instant' ? 'Instant Service' :
                                     type === 'bidding' ? 'Competitive Bidding' :
                                     'Multi-Stop Journey'}
                                </span>
                                <div className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className="text-yellow-400 mr-1"
                                    />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {data.rating}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {data.deliveryTime}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${data.price}
                                </span>
                                <span className="text-sm text-green-600 dark:text-green-400">
                                    Save ${data.savings}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Price Breakdown
                    </h2>
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                        {showBreakdown ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Base Price */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faTruck}
                                className="text-blue-500 mr-3"
                            />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Base Price</p>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    ${priceData[selectedTimeframe].basePrice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {showBreakdown && (
                        <>
                            {/* Additional Fees */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Additional Fees
                                </h3>
                                {priceData[selectedTimeframe].additionalFees.map((fee, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {fee.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {fee.description}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${fee.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Discounts */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Available Discounts
                                </h3>
                                {priceData[selectedTimeframe].discounts.map((discount, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {discount.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {discount.description}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            -${discount.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Total Price</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                ${calculateTotal(selectedTimeframe).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">You Save</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ${priceData[selectedTimeframe].savings}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start">
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-blue-500 mt-1 mr-3"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This is an estimated price based on your request details. Final price may vary based on actual service requirements and any additional services needed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={handleAccept}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                    Accept Price & Continue
                </button>
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors font-medium"
                >
                    Back to Request
                </button>
            </div>
        </div>
    );
};

export default PriceForecast; 