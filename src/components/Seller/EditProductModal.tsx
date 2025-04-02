'use client';

import { useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    discount: number;
    image: string;
}

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
    const [formData, setFormData] = useState<Product | null>(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData({ ...formData, [name]: name === 'price' || name === 'discount' ? Number(value) : value });
        }
    };

    const handleSubmit = () => {
        if (formData) {
            onSubmit(formData);
        }
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
