'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: any) => void;
}

interface ProductVariant {
    id: string;
    color?: string;
    size?: string;
    storage?: string;
    price: number;
    stock: number;
    sku: string;
}

interface ProductFormData {
    name: string;
    description: string;
    category: string;
    brand: string;
    condition: 'new' | 'used' | 'refurbished';
    basePrice: number;
    images: File[];
    variants: ProductVariant[];
    specifications: { key: string; value: string }[];
    shippingWeight: number;
    tags: string[];
}

export default function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category: '',
        brand: '',
        condition: 'new',
        basePrice: 0,
        images: [],
        variants: [],
        specifications: [],
        shippingWeight: 0,
        tags: [],
    });

    const [currentVariant, setCurrentVariant] = useState<ProductVariant>({
        id: '',
        color: '',
        size: '',
        storage: '',
        price: 0,
        stock: 0,
        sku: '',
    });

    const addVariant = () => {
        setFormData((prev) => ({
            ...prev,
            variants: [...prev.variants, { ...currentVariant, id: Date.now().toString() }],
        }));
        setCurrentVariant({
            id: '',
            color: '',
            size: '',
            storage: '',
            price: 0,
            stock: 0,
            sku: '',
        });
    };

    const removeVariant = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((v) => v.id !== id),
        }));
    };

    const addSpecification = () => {
        setFormData((prev) => ({
            ...prev,
            specifications: [...prev.specifications, { key: '', value: '' }],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, images: [...prev.images, e.target.files![0]] }));
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Add New Product
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={formData.basePrice}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                        <select
                                            name="category"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a category</option>
                                            <option value="phones">Phones</option>
                                            <option value="laptops">Laptops</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={formData.brand}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
                                        <select
                                            name="condition"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600"
                                            value={formData.condition}
                                            onChange={handleChange}
                                        >
                                            <option value="new">New</option>
                                            <option value="used">Used</option>
                                            <option value="refurbished">Refurbished</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-900">Product Variants</h3>
                                    <div className="space-y-4">
                                        {formData.variants.map((variant) => (
                                            <div key={variant.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                {variant.color && <div className="w-6 h-6 rounded-full" style={{ backgroundColor: variant.color }} />}
                                                <div className="flex-1">
                                                    {variant.size && <span className="text-sm text-gray-600">Size: {variant.size}</span>}
                                                    {variant.storage && <span className="text-sm text-gray-600">Storage: {variant.storage}</span>}
                                                    <span className="text-sm text-gray-600">Price: ${variant.price}</span>
                                                    <span className="text-sm text-gray-600">Stock: {variant.stock}</span>
                                                </div>
                                                <button type="button" onClick={() => removeVariant(variant.id)} className="text-red-500 hover:text-red-700">
                                                    Remove
                                                </button>
                                            </div>
                                        ))}

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Color (hex)"
                                                value={currentVariant.color}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Size"
                                                value={currentVariant.size}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, size: e.target.value })}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Storage"
                                                value={currentVariant.storage}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, storage: e.target.value })}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={currentVariant.price}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, price: Number(e.target.value) })}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={currentVariant.stock}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, stock: Number(e.target.value) })}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                placeholder="SKU"
                                                value={currentVariant.sku}
                                                onChange={(e) => setCurrentVariant({ ...currentVariant, sku: e.target.value })}
                                                className="rounded-md border-gray-300"
                                            />
                                        </div>
                                        <button type="button" onClick={addVariant} className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                            Add Variant
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                                    {formData.specifications.map((spec, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                value={spec.key}
                                                onChange={(e) => {
                                                    const newSpecs = [...formData.specifications];
                                                    newSpecs[index].key = e.target.value;
                                                    setFormData({ ...formData, specifications: newSpecs });
                                                }}
                                                className="rounded-md border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={spec.value}
                                                onChange={(e) => {
                                                    const newSpecs = [...formData.specifications];
                                                    newSpecs[index].value = e.target.value;
                                                    setFormData({ ...formData, specifications: newSpecs });
                                                }}
                                                className="rounded-md border-gray-300"
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addSpecification} className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                        Add Specification
                                    </button>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
