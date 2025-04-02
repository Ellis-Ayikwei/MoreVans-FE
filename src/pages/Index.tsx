'use client';

import { useState } from 'react';
import PromoBanner from '../components/Banner/PromoBanner';
import FilterSidebar from '../components/Filters/FilterSidebar';
import Hero from '../components/Layouts/Hero';
import Sidebar from '../components/Navigation/Sidebar';
import ProductList from '../components/Products/ProductList';
import ScrollToTop from '../components/ScrollToTop';
import { products } from '../data/products';

// Featured collections for the grid
const collections = [
    {
        id: 1,
        title: 'Latest Phones',
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179',
        link: '/category/phones',
        description: 'Discover the newest smartphones',
    },
    {
        id: 2,
        title: 'Gaming Laptops',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
        link: '/category/laptops',
        description: 'Ultimate gaming machines',
    },
    {
        id: 3,
        title: 'Premium Audio',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
        link: '/category/accessories',
        description: 'Immersive sound experience',
    },
];

export default function Home() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sampleProducts] = useState(products);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Hero />

            <div id="products-section" className="max-w-screen-xl mx-auto px-4 py-8">
                {/* Featured Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {collections.map((collection) => (
                        <div key={collection.id} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                            <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-bold">{collection.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promo Banner */}
                <div className="mb-12">
                    <PromoBanner />
                </div>

                {/* Products Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1">
                        <FilterSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex gap-8">
                            <aside className="hidden md:block w-64 sticky top-4 h-fit">
                                <Sidebar
                                    categories={['Phones', 'Laptops', 'Accessories', 'Tablets', 'Smartwatches']}
                                    brands={['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo']}
                                    onCategoryChange={setSelectedCategories}
                                    onBrandChange={setSelectedBrands}
                                    onPriceChange={setPriceRange}
                                />
                            </aside>

                            <main className="flex-1">
                                <ProductList products={sampleProducts} selectedCategories={selectedCategories} selectedBrands={selectedBrands} priceRange={priceRange} />
                            </main>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
}
