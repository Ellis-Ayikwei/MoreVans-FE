import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import GetApp from './GetApp';

interface ViewPlansProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
    type: 'single' | 'basic' | 'standard' | 'premium';
}

const pricingPlans: PricingPlan[] = [
    {
        name: 'Single Page',
        price: 'GH₵ 2,500',
        description: 'Perfect for landing pages and simple business websites',
        type: 'single',
        features: ['One-page website', 'Mobile responsive design', 'Contact form', 'Social media integration', '2 rounds of revisions', '3 months support', 'Basic SEO setup', 'Custom domain setup'],
    },
    {
        name: 'Basic Website',
        price: 'GH₵ 5,000',
        description: 'Ideal for small businesses and startups',
        type: 'basic',
        features: [
            'Up to 5 pages',
            'Mobile responsive design',
            'Contact form',
            'Social media integration',
            'Basic animations',
            'Google Maps integration',
            '3 rounds of revisions',
            '6 months support',
            'SEO optimization',
            'Google Analytics setup',
            'Basic content management',
        ],
    },
    {
        name: 'Standard Website',
        price: 'GH₵ 12,000',
        description: 'Perfect for growing businesses',
        type: 'standard',
        popular: true,
        features: [
            'Up to 10 pages',
            'Advanced responsive design',
            'Custom animations',
            'Blog integration',
            'Newsletter signup',
            'Advanced contact forms',
            'Social media feeds',
            'Content management system',
            'E-commerce ready (up to 50 products)',
            'Payment gateway integration',
            'Advanced SEO package',
            '1 year support',
            'Performance optimization',
            'Security features',
        ],
    },
    {
        name: 'Premium E-commerce',
        price: 'GH₵ 25,000+',
        description: 'Full-featured online store solution',
        type: 'premium',
        features: [
            'Unlimited pages',
            'Custom design & branding',
            'Advanced e-commerce features',
            'Unlimited products',
            'Multiple payment gateways',
            'Inventory management',
            'Order tracking system',
            'Customer accounts',
            'Advanced analytics',
            'Multi-currency support',
            'Advanced security features',
            'Premium SEO package',
            '2 years support',
            'Monthly performance reports',
            'Priority support',
        ],
    },
];

const ViewPlans: React.FC<ViewPlansProps> = ({ isOpen, onClose }) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isGetAppOpen, setIsGetAppOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handlePlanSelect = (planType: string) => {
        setSelectedPlan(planType);
        onClose();
        setIsGetAppOpen(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto py-10"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-4 p-6 h-full overflow-y-scroll overflow-x-hidden"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Website Development Plans</h2>
                            <p className="text-gray-600 mt-2">Choose the perfect plan for your business needs</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                            {pricingPlans.map((plan) => (
                                <motion.div
                                    key={plan.type}
                                    className={`relative rounded-xl p-4 sm:p-6 ${
                                        plan.popular ? 'border-2 border-[#dc711a]' : 'border border-gray-200'
                                    } hover:shadow-lg transition-shadow h-full flex flex-col`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#dc711a] text-white px-4 py-1 rounded-full text-sm">Most Popular</span>}
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold text-[#dc711a]">{plan.price}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-grow">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start text-sm">
                                                <svg className="w-5 h-5 text-[#dc711a] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handlePlanSelect(plan.type)}
                                        className={`w-full py-3 px-4 rounded-full text-center font-semibold ${
                                            plan.popular ? 'bg-[#dc711a] text-white hover:bg-[#b95d13]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        } transition-colors mt-auto`}
                                    >
                                        Get Started
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-600">
                                Need a custom solution?{' '}
                                <button onClick={() => setIsContactModalOpen(true)} className="text-[#dc711a] font-semibold hover:underline">
                                    Contact us
                                </button>{' '}
                                for a personalized quote.
                            </p>
                            <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700">
                                Close
                            </button>
                        </div>

                        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
                        <GetApp isOpen={isGetAppOpen} onClose={() => setIsGetAppOpen(false)} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewPlans;
