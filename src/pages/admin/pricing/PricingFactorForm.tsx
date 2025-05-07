import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../helper/axiosInstance';

interface PricingFactorFormProps {
    initialData?: {
        id?: number;
        name: string;
        description: string;
        is_active: boolean;
        category?: string;
        [key: string]: any;
    };
    onClose: () => void;
    onSuccess: () => void;
}

interface PricingFactorFormValues {
    name: string;
    description: string;
    is_active: boolean;
    category: string;
    base_rate_per_km?: number;
    min_distance?: number;
    max_distance?: number;
    zone_multipliers?: {
        urban: number;
        suburban: number;
        rural: number;
    };
    base_rate?: number;
    property_types?: {
        house: {
            rate_multiplier: number;
            room_rate: number;
            floor_rate: number;
        };
        apartment: {
            rate_multiplier: number;
            floor_rate: number;
            elevator_discount: number;
            stairs_rate: number;
        };
        office: {
            rate_multiplier: number;
            floor_rate: number;
            elevator_discount: number;
            stairs_rate: number;
            after_hours_multiplier: number;
        };
        storage: {
            rate_multiplier: number;
            unit_size_multipliers: {
                small: number;
                medium: number;
                large: number;
            };
        };
    };
    service_types?: {
        residential_moving: {
            rate_multiplier: number;
            room_based_pricing: boolean;
            min_rooms: number;
            max_rooms: number;
        };
        office_relocation: {
            rate_multiplier: number;
            employee_based_pricing: boolean;
            min_employees: number;
            max_employees: number;
        };
        storage: {
            rate_multiplier: number;
            duration_multipliers: {
                short_term: number;
                medium_term: number;
                long_term: number;
            };
        };
    };
    vehicle_types?: {
        motorcycle: {
            rate_multiplier: number;
            max_weight: number;
            max_volume: number;
        };
        car: {
            rate_multiplier: number;
            max_weight: number;
            max_volume: number;
        };
        suv: {
            rate_multiplier: number;
            max_weight: number;
            max_volume: number;
        };
        truck: {
            rate_multiplier: number;
            max_weight: number;
            max_volume: number;
            requires_special_license: boolean;
        };
        van: {
            rate_multiplier: number;
            max_weight: number;
            max_volume: number;
        };
    };
    requirements?: {
        fragile_items: {
            rate_multiplier: number;
            requires_special_handling: boolean;
            requires_insurance: boolean;
        };
        disassembly: {
            rate_multiplier: number;
            requires_tools: boolean;
            requires_expertise: boolean;
        };
        special_equipment: {
            rate_multiplier: number;
            equipment_types: string[];
        };
    };
}

const factorTypeSchemas = {
    distance: Yup.object().shape({
        base_rate_per_km: Yup.number().required('Base rate per km is required').min(0),
        min_distance: Yup.number().required('Minimum distance is required').min(0),
        max_distance: Yup.number().required('Maximum distance is required').min(0),
    }),
    weight: Yup.object().shape({
        base_rate_per_kg: Yup.number().required('Base rate per kg is required').min(0),
        min_weight: Yup.number().required('Minimum weight is required').min(0),
        max_weight: Yup.number().required('Maximum weight is required').min(0),
    }),
    time: Yup.object().shape({
        peak_hour_multiplier: Yup.number().required('Peak hour multiplier is required').min(1),
        weekend_multiplier: Yup.number().required('Weekend multiplier is required').min(1),
        holiday_multiplier: Yup.number().required('Holiday multiplier is required').min(1),
    }),
    weather: Yup.object().shape({
        rain_multiplier: Yup.number().required('Rain multiplier is required').min(1),
        snow_multiplier: Yup.number().required('Snow multiplier is required').min(1),
        extreme_weather_multiplier: Yup.number().required('Extreme weather multiplier is required').min(1),
    }),
    vehicle_type: Yup.object().shape({
        vehicle_type: Yup.string().required('Vehicle type is required'),
        base_rate: Yup.number().required('Base rate is required').min(0),
        capacity_multiplier: Yup.number().required('Capacity multiplier is required').min(1),
    }),
    special_requirements: Yup.object().shape({
        fragile_items_multiplier: Yup.number().required('Fragile items multiplier is required').min(1),
        assembly_required_rate: Yup.number().required('Assembly required rate is required').min(0),
        special_equipment_rate: Yup.number().required('Special equipment rate is required').min(0),
    }),
    location: Yup.object().shape({
        city_name: Yup.string().required('City name is required'),
        zone_multiplier: Yup.number().required('Zone multiplier is required').min(1),
        congestion_charge: Yup.number().required('Congestion charge is required').min(0),
        parking_fee: Yup.number().required('Parking fee is required').min(0),
    }),
    service_level: Yup.object().shape({
        service_level: Yup.string().required('Service level is required'),
        price_multiplier: Yup.number().required('Price multiplier is required').min(1),
    }),
    staff_required: Yup.object().shape({
        base_rate_per_staff: Yup.number().required('Base rate per staff is required').min(0),
        min_staff: Yup.number().required('Minimum staff is required').min(1),
        max_staff: Yup.number().required('Maximum staff is required').min(1),
    }),
    property_type: Yup.object().shape({
        property_type: Yup.string().required('Property type is required'),
        base_rate: Yup.number().required('Base rate is required').min(0),
        rate_per_room: Yup.number().required('Rate per room is required').min(0),
        elevator_discount: Yup.number().required('Elevator discount is required').min(0).max(1),
        floor_rate: Yup.number().required('Floor rate is required').min(0),
    }),
    insurance: Yup.object().shape({
        base_rate: Yup.number().required('Base rate is required').min(0),
        value_percentage: Yup.number().required('Value percentage is required').min(0),
        min_premium: Yup.number().required('Minimum premium is required').min(0),
    }),
    loading_time: Yup.object().shape({
        base_rate_per_hour: Yup.number().required('Base rate per hour is required').min(0),
        min_hours: Yup.number().required('Minimum hours is required').min(0),
        overtime_multiplier: Yup.number().required('Overtime multiplier is required').min(1),
    }),
};

const PricingFactorForm: React.FC<PricingFactorFormProps> = ({ initialData, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category || '');

    const baseValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        is_active: Yup.boolean(),
        category: Yup.string().required('Category is required'),
    });

    const formik = useFormik<PricingFactorFormValues>({
        initialValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            is_active: initialData?.is_active ?? true,
            category: initialData?.category || '',
            ...initialData,
        },
        validationSchema: Yup.lazy((values) => {
            if (!values.category) return baseValidationSchema;
            return baseValidationSchema.concat(factorTypeSchemas[values.category as keyof typeof factorTypeSchemas]);
        }),
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                setError(null);

                const endpoint = initialData?.id ? `/admin/pricing/factors/${initialData.id}/` : `/admin/pricing/factors/`;
                const method = initialData?.id ? 'put' : 'post';

                const response = await axiosInstance[method](endpoint, values);

                if (response.data) {
                    onSuccess();
                    onClose();
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to save pricing factor');
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setSelectedCategory(category);
        formik.setFieldValue('category', category);

        // Reset category-specific fields when changing categories
        const categoryFields = Object.keys(factorTypeSchemas[category as keyof typeof factorTypeSchemas]?.fields || {});
        categoryFields.forEach((field) => {
            formik.setFieldValue(field, undefined);
        });
    };

    const renderCategoryFields = () => {
        if (!selectedCategory) return null;

        switch (selectedCategory) {
            case 'distance':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per KM</label>
                            <input
                                type="number"
                                name="base_rate_per_km"
                                value={formik.values.base_rate_per_km || ''}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Distance</label>
                            <input
                                type="number"
                                name="min_distance"
                                value={formik.values.min_distance || ''}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Distance</label>
                            <input
                                type="number"
                                name="max_distance"
                                value={formik.values.max_distance || ''}
                                onChange={formik.handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </>
                );
            // Add cases for other factor types...
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{initialData?.id ? 'Edit' : 'Add'} Pricing Factor</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {error && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            name="category"
                            value={formik.values.category}
                            onChange={handleCategoryChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select a category</option>
                            <option value="distance">Distance</option>
                            <option value="weight">Weight</option>
                            <option value="time">Time</option>
                            <option value="weather">Weather</option>
                            <option value="vehicle_type">Vehicle Type</option>
                            <option value="special_requirements">Special Requirements</option>
                            <option value="location">Location</option>
                            <option value="service_level">Service Level</option>
                            <option value="staff_required">Staff Required</option>
                            <option value="property_type">Property Type</option>
                            <option value="insurance">Insurance</option>
                            <option value="loading_time">Loading Time</option>
                        </select>
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {renderCategoryFields()}

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

export default PricingFactorForm;
