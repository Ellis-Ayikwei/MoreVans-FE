import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../helper/axiosInstance';

interface PricingFactor {
    id: number;
    name: string;
    category: string;
    is_active: boolean;
}

interface PricingConfiguration {
    id?: number;
    name: string;
    is_active: boolean;
    is_default: boolean;
    base_price: number;
    base_price_per_mile: number;
    base_price_per_kg: number;
    base_price_per_cubic_meter: number;
    base_price_per_hour: number;
    min_price: number;
    max_price_multiplier: number;
    fuel_surcharge_percentage: number;
    carbon_offset_rate: number;
    active_factors: {
        [category: string]: number[];
    };
}

interface PricingConfigurationFormProps {
    initialData?: PricingConfiguration;
    onClose: () => void;
    onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    is_active: Yup.boolean(),
    is_default: Yup.boolean(),
    base_price: Yup.number().required('Base price is required').min(0),
    base_price_per_mile: Yup.number().required('Base price per mile is required').min(0),
    base_price_per_kg: Yup.number().required('Base price per kg is required').min(0),
    base_price_per_cubic_meter: Yup.number().required('Base price per cubic meter is required').min(0),
    base_price_per_hour: Yup.number().required('Base price per hour is required').min(0),
    min_price: Yup.number().required('Minimum price is required').min(0),
    max_price_multiplier: Yup.number().required('Maximum price multiplier is required').min(1),
    fuel_surcharge_percentage: Yup.number().required('Fuel surcharge percentage is required').min(0),
    carbon_offset_rate: Yup.number().required('Carbon offset rate is required').min(0),
    active_factors: Yup.object().test('has-factors', 'At least one factor must be selected', (value) => {
        if (!value) return false;
        const factors = value as { [key: string]: number[] };
        return Object.values(factors).some((factorIds) => factorIds.length > 0);
    }),
});

const PricingConfigurationForm: React.FC<PricingConfigurationFormProps> = ({ initialData, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [factors, setFactors] = useState<{ [category: string]: PricingFactor[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFactors();
    }, []);

    const fetchFactors = async () => {
        try {
            const response = await axiosInstance.get('/admin/pricing/factors/');
            const categorizedFactors: { [category: string]: PricingFactor[] } = {};

            Object.entries(response.data).forEach(([category, items]) => {
                if (category !== 'configuration' && Array.isArray(items)) {
                    const typedItems = items as PricingFactor[];
                    categorizedFactors[category] = typedItems.filter((item) => item.is_active);
                }
            });

            setFactors(categorizedFactors);
        } catch (err) {
            console.error('Error fetching factors:', err);
            setError('Failed to load pricing factors');
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: initialData?.name || '',
            is_active: initialData?.is_active ?? true,
            is_default: initialData?.is_default ?? false,
            base_price: initialData?.base_price || 0,
            base_price_per_mile: initialData?.base_price_per_mile || 0,
            base_price_per_kg: initialData?.base_price_per_kg || 0,
            base_price_per_cubic_meter: initialData?.base_price_per_cubic_meter || 0,
            base_price_per_hour: initialData?.base_price_per_hour || 0,
            min_price: initialData?.min_price || 0,
            max_price_multiplier: initialData?.max_price_multiplier || 1,
            fuel_surcharge_percentage: initialData?.fuel_surcharge_percentage || 0,
            carbon_offset_rate: initialData?.carbon_offset_rate || 0,
            active_factors: initialData?.active_factors || {},
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                setError(null);

                const endpoint = initialData?.id ? `/admin/pricing/configurations/${initialData.id}/` : `/admin/pricing/configurations/`;

                const method = initialData?.id ? 'put' : 'post';
                await axiosInstance[method](endpoint, values);

                onSuccess();
                onClose();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to save pricing configuration');
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleFactorToggle = (category: string, factorId: number) => {
        const currentFactors = formik.values.active_factors[category] || [];
        const newFactors = currentFactors.includes(factorId) ? currentFactors.filter((id) => id !== factorId) : [...currentFactors, factorId];

        formik.setFieldValue('active_factors', {
            ...formik.values.active_factors,
            [category]: newFactors,
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{initialData?.id ? 'Edit' : 'Add'} Pricing Configuration</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {error && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
                            <input
                                type="number"
                                name="base_price"
                                value={formik.values.base_price}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price per Mile</label>
                            <input
                                type="number"
                                name="base_price_per_mile"
                                value={formik.values.base_price_per_mile}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price per KG</label>
                            <input
                                type="number"
                                name="base_price_per_kg"
                                value={formik.values.base_price_per_kg}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price per Cubic Meter</label>
                            <input
                                type="number"
                                name="base_price_per_cubic_meter"
                                value={formik.values.base_price_per_cubic_meter}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price per Hour</label>
                            <input
                                type="number"
                                name="base_price_per_hour"
                                value={formik.values.base_price_per_hour}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Price</label>
                            <input
                                type="number"
                                name="min_price"
                                value={formik.values.min_price}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Price Multiplier</label>
                            <input
                                type="number"
                                name="max_price_multiplier"
                                value={formik.values.max_price_multiplier}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Surcharge Percentage</label>
                            <input
                                type="number"
                                name="fuel_surcharge_percentage"
                                value={formik.values.fuel_surcharge_percentage}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbon Offset Rate</label>
                            <input
                                type="number"
                                name="carbon_offset_rate"
                                value={formik.values.carbon_offset_rate}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formik.values.is_active}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_default"
                                checked={formik.values.is_default}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Default Configuration</label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Active Factors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(factors).map(([category, categoryFactors]) => (
                                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3 capitalize">{category}</h4>
                                    <div className="space-y-2">
                                        {categoryFactors.map((factor) => (
                                            <div key={factor.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={(formik.values.active_factors[category] || []).includes(factor.id)}
                                                    onChange={() => handleFactorToggle(category, factor.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{factor.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PricingConfigurationForm;
