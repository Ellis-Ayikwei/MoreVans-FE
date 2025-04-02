import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GetApp from './GetApp';

interface Product {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    demoLink?: string;
    githubLink?: string;
    features: string[];
    category: 'web' | 'mobile' | 'desktop';
    status: 'completed' | 'in-progress' | 'maintenance';
    price?: string;
}

const products: Product[] = [
    {
        title: 'School Management System',
        description: 'A comprehensive school management solution with modules for administration, teachers, students, and parents.',
        image: '/src/assets/images/products/school.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        features: [
            'Student Information Management',
            'Attendance Tracking',
            'Grade Management',
            'Timetable Scheduling',
            'Fee Management',
            'Parent Communication Portal',
            'Library Management',
            'Online Assignments',
            'Report Generation',
        ],
        category: 'web',
        status: 'completed',
        price: 'GH₵ 15,000',
    },
    {
        title: 'TradeHut E-commerce',
        description: 'A full-featured e-commerce platform for electronic devices and accessories.',
        image: '/src/assets/images/products/tradehut.png',
        technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        demoLink: 'https://tradehut.demo.com',
        githubLink: 'https://github.com/yourusername/tradehut',
        features: ['User authentication', 'Product catalog', 'Shopping cart', 'Payment integration', 'Order tracking'],
        category: 'web',
        status: 'completed',
    },
    {
        title: 'Sprout Collab',
        description: 'A collaborative project management platform focused on goal tracking and team productivity.',
        image: '/src/assets/images/products/sprout.png',
        technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
        demoLink: 'https://sproutcollab.demo.com',
        githubLink: 'https://github.com/Ellis-Ayikwei/sprout-collab',
        features: ['Team collaboration', 'Goal tracking', 'Task management', 'Real-time updates', 'Progress analytics'],
        category: 'mobile',
        status: 'completed',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const Products = () => {
    const [isGetAppOpen, setIsGetAppOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleUseApp = (product: Product) => {
        setSelectedProduct(product);
        setIsGetAppOpen(true);
    };

    return (
        <section id="products" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden mt-10 mx-2 md:mx-10 border-2 border-gray-200 rounded-3xl">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/src/assets/images/pattern-light.svg')] opacity-[0.03]" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-100/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-100/10 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative">
                {/* Section Header */}
                <motion.div className="text-center mb-16" initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} ref={ref}>
                    <div className="inline-flex items-center justify-center space-x-2 mb-6">
                        <span className="w-12 h-1 bg-[#dc711a]/30 rounded-full" />
                        <span className="text-[#dc711a] font-semibold">Our Products</span>
                        <span className="w-12 h-1 bg-[#dc711a]/30 rounded-full" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Featured{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-[#dc711a]">Projects</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-200 -z-0" />
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover our innovative solutions and successful implementations</p>
                </motion.div>

                {/* Products Grid */}
                <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={staggerChildren} initial="hidden" animate="visible">
                    {products.map((product) => (
                        <motion.div
                            key={product.title}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={fadeInUp}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid md:grid-cols-2 gap-0 h-full">
                                {/* Image Section */}
                                <div className="relative h-full min-h-[300px] overflow-hidden">
                                    <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <motion.button
                                                onClick={() => handleUseApp(product)}
                                                className="w-full bg-white text-[#dc711a] py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <span>Use App</span>
                                                <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                                            </motion.button>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {product.status === 'completed' ? 'Available' : 'Coming Soon'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col h-full">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 text-xs font-medium text-[#dc711a] bg-orange-100/50 rounded-full mb-3">{product.category}</span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                                        <p className="text-gray-600 text-sm">{product.description}</p>
                                    </div>

                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                                        <ul className="space-y-2">
                                            {product.features.slice(0, 5).map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm text-gray-600">
                                                    <i className="fas fa-check text-[#dc711a] mr-2 text-xs"></i>
                                                    {feature}
                                                </li>
                                            ))}
                                            {product.features.length > 5 && <li className="text-sm text-[#dc711a]">+ {product.features.length - 5} more features</li>}
                                        </ul>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {product.technologies.map((tech, index) => (
                                                    <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-[#dc711a] font-semibold">{product.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* GetApp Modal */}
            <GetApp
                isOpen={isGetAppOpen}
                onClose={() => {
                    setIsGetAppOpen(false);
                    setSelectedProduct(null);
                }}
            />
        </section>
    );
};

export default Products;
