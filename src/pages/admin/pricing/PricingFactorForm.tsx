import React, { useState, useEffect } from 'react';
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
    category: string;
    is_active: boolean;
    // Distance factor fields
    base_rate_per_km: string;
    min_distance: string;
    max_distance: string;
    base_rate_per_mile: string;
    additional_distance_threshold: string;
    additional_distance_multiplier: string;
    // Weight factor fields
    base_rate_per_kg: string;
    min_weight: string;
    max_weight: string;
    base_rate_per_lb: string;
    volume_to_weight_ratio: string;
    heavy_item_threshold: string;
    heavy_item_surcharge: string;
    // Time factor fields
    peak_hour_multiplier: string;
    weekend_multiplier: string;
    holiday_multiplier: string;
    // Weather factor fields
    rain_multiplier: string;
    snow_multiplier: string;
    extreme_weather_multiplier: string;
    // Vehicle type factor fields
    vehicle_type: string;
    vehicle_base_rate: string;
    capacity_multiplier: string;
    capacity_cubic_meters: string;
    capacity_weight_kg: string;
    fuel_efficiency_km_per_liter: string;
    vehicle_hourly_rate: string;
    vehicle_daily_rate: string;
    // Special requirements factor fields
    fragile_items_multiplier: string;
    assembly_required_rate: string;
    special_equipment_rate: string;
    // Location factor fields
    city_name: string;
    zone_multiplier: string;
    congestion_charge: string;
    parking_fee: string;
    // Service level factor fields
    service_level: string;
    price_multiplier: string;
    // Staff required factor fields
    base_rate_per_staff: string;
    min_staff: string;
    max_staff: string;
    staff_hourly_rate: string;
    overtime_rate_multiplier: string;
    specialist_staff_multiplier: string;
    // Property type factor fields
    property_type: string;
    property_base_rate: string;
    rate_per_room: string;
    elevator_discount: string;
    floor_rate: string;
    narrow_access_fee: string;
    stairs_per_flight_fee: string;
    rate_per_sq_meter: string;
    long_carry_distance_fee: string;
    // Insurance factor fields
    insurance_base_rate: string;
    value_percentage: string;
    min_premium: string;
    premium_coverage_multiplier: string;
    high_value_item_threshold: string;
    high_value_item_rate: string;
    deductible_amount: string;
    // Loading time factor fields
    base_rate_per_hour: string;
    min_hours: string;
    overtime_multiplier: string;
    [key: string]: string | boolean; // Add index signature for dynamic field access
}

// Common validation schema for all factor types
const baseValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    is_active: Yup.boolean(),
    category: Yup.string().required('Category is required'),
});

// Define validation schemas for each factor type with their specific fields
const factorTypeSchemas = {
    distance: Yup.object().shape({
        base_rate_per_km: Yup.number().required('Base rate per km is required').min(0.01),
        min_distance: Yup.number().required('Minimum distance is required').min(0),
        max_distance: Yup.number().required('Maximum distance is required').min(0),
        base_rate_per_mile: Yup.number().min(0),
        additional_distance_threshold: Yup.number().min(0),
        additional_distance_multiplier: Yup.number().min(1.0),
    }),

    weight: Yup.object().shape({
        base_rate_per_kg: Yup.number().required('Base rate per kg is required').min(0.01),
        min_weight: Yup.number().required('Minimum weight is required').min(0),
        max_weight: Yup.number().required('Maximum weight is required').min(0),
        base_rate_per_lb: Yup.number().min(0),
        volume_to_weight_ratio: Yup.number().min(0.01),
        heavy_item_threshold: Yup.number().min(0),
        heavy_item_surcharge: Yup.number().min(0),
    }),

    time: Yup.object().shape({
        peak_hour_multiplier: Yup.number().required('Peak hour multiplier is required').min(1.0),
        weekend_multiplier: Yup.number().required('Weekend multiplier is required').min(1.0),
        holiday_multiplier: Yup.number().required('Holiday multiplier is required').min(1.0),
    }),

    weather: Yup.object().shape({
        rain_multiplier: Yup.number().required('Rain multiplier is required').min(1.0),
        snow_multiplier: Yup.number().required('Snow multiplier is required').min(1.0),
        extreme_weather_multiplier: Yup.number().required('Extreme weather multiplier is required').min(1.0),
    }),

    vehicle_type: Yup.object().shape({
        vehicle_type: Yup.string().required('Vehicle type is required'),
        vehicle_base_rate: Yup.number().required('Base rate is required').min(0.01),
        capacity_multiplier: Yup.number().required('Capacity multiplier is required').min(1.0),
        capacity_cubic_meters: Yup.number().min(0),
        capacity_weight_kg: Yup.number().min(0),
        fuel_efficiency_km_per_liter: Yup.number().min(0.01),
        vehicle_hourly_rate: Yup.number().min(0),
        vehicle_daily_rate: Yup.number().min(0),
    }),

    special_requirements: Yup.object().shape({
        fragile_items_multiplier: Yup.number().required('Fragile items multiplier is required').min(1.0),
        assembly_required_rate: Yup.number().required('Assembly required rate is required').min(0.01),
        special_equipment_rate: Yup.number().required('Special equipment rate is required').min(0.01),
    }),

    location: Yup.object().shape({
        city_name: Yup.string().required('City name is required'),
        zone_multiplier: Yup.number().required('Zone multiplier is required').min(0.8).max(3.0),
        congestion_charge: Yup.number().required('Congestion charge is required').min(0),
        parking_fee: Yup.number().required('Parking fee is required').min(0),
    }),

    service_level: Yup.object().shape({
        service_level: Yup.string().required('Service level is required'),
        price_multiplier: Yup.number().required('Price multiplier is required').min(1.0),
    }),

    staff_required: Yup.object().shape({
        base_rate_per_staff: Yup.number().required('Base rate per staff is required').min(0.01),
        min_staff: Yup.number().required('Minimum staff is required').min(1),
        max_staff: Yup.number().required('Maximum staff is required').min(1),
        staff_hourly_rate: Yup.number().min(0.01),
        overtime_rate_multiplier: Yup.number().min(1.0),
        specialist_staff_multiplier: Yup.number().min(1.0),
    }),

    property_type: Yup.object().shape({
        property_type: Yup.string().required('Property type is required'),
        property_base_rate: Yup.number().required('Base rate is required').min(0.01),
        rate_per_room: Yup.number().required('Rate per room is required').min(0.01),
        elevator_discount: Yup.number().required('Elevator discount is required').min(0.5).max(1.0),
        floor_rate: Yup.number().required('Floor rate is required').min(0.01),
        narrow_access_fee: Yup.number().min(0),
        stairs_per_flight_fee: Yup.number().min(0),
        rate_per_sq_meter: Yup.number().min(0.01),
        long_carry_distance_fee: Yup.number().min(0),
    }),

    insurance: Yup.object().shape({
        insurance_base_rate: Yup.number().required('Base rate is required').min(0.01),
        value_percentage: Yup.number().required('Value percentage is required').min(0.01).max(5.0),
        min_premium: Yup.number().required('Minimum premium is required').min(0.01),
        premium_coverage_multiplier: Yup.number().min(1.0),
        high_value_item_threshold: Yup.number().min(0),
        high_value_item_rate: Yup.number().min(0.01),
        deductible_amount: Yup.number().min(0),
    }),

    loading_time: Yup.object().shape({
        base_rate_per_hour: Yup.number().required('Base rate per hour is required').min(0.01),
        min_hours: Yup.number().required('Minimum hours is required').min(0.5),
        overtime_multiplier: Yup.number().required('Overtime multiplier is required').min(1.0),
    }),
};

// Default initial values for each factor type
const defaultInitialValues = {
    distance: {
        base_rate_per_km: 1.0,
        min_distance: 0,
        max_distance: 1000,
        base_rate_per_mile: 0,
        additional_distance_threshold: 50,
        additional_distance_multiplier: 1.2,
    },
    weight: {
        base_rate_per_kg: 0.5,
        min_weight: 0,
        max_weight: 10000,
        base_rate_per_lb: 0,
        volume_to_weight_ratio: 167,
        heavy_item_threshold: 50,
        heavy_item_surcharge: 25,
    },
    time: {
        peak_hour_multiplier: 1.5,
        weekend_multiplier: 1.3,
        holiday_multiplier: 2.0,
    },
    weather: {
        rain_multiplier: 1.2,
        snow_multiplier: 1.5,
        extreme_weather_multiplier: 2.0,
    },
    vehicle_type: {
        vehicle_type: '',
        vehicle_base_rate: 0.01,
        capacity_multiplier: 1.0,
        capacity_cubic_meters: 0,
        capacity_weight_kg: 0,
        fuel_efficiency_km_per_liter: 8.0,
        vehicle_hourly_rate: 0,
        vehicle_daily_rate: 0,
    },
    special_requirements: {
        fragile_items_multiplier: 1.3,
        assembly_required_rate: 50.0,
        special_equipment_rate: 75.0,
    },
    location: {
        city_name: '',
        zone_multiplier: 1.0,
        congestion_charge: 0,
        parking_fee: 0,
    },
    service_level: {
        service_level: 'standard',
        price_multiplier: 1.0,
    },
    staff_required: {
        base_rate_per_staff: 0.01,
        min_staff: 1,
        max_staff: 10,
        staff_hourly_rate: 25.0,
        overtime_rate_multiplier: 1.5,
        specialist_staff_multiplier: 1.5,
    },
    property_type: {
        property_type: '',
        property_base_rate: 0.01,
        rate_per_room: 0.01,
        elevator_discount: 0.9,
        floor_rate: 10.0,
        narrow_access_fee: 25.0,
        stairs_per_flight_fee: 15.0,
        rate_per_sq_meter: 2.0,
        long_carry_distance_fee: 30.0,
    },
    insurance: {
        insurance_base_rate: 0.01,
        value_percentage: 0.5,
        min_premium: 0.01,
        premium_coverage_multiplier: 2.0,
        high_value_item_threshold: 1000.0,
        high_value_item_rate: 1.0,
        deductible_amount: 100.0,
    },
    loading_time: {
        base_rate_per_hour: 0.01,
        min_hours: 1.0,
        overtime_multiplier: 1.5,
    },
};

const PricingFactorForm: React.FC<PricingFactorFormProps> = ({ initialData, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category || '');

    // Determine API endpoint based on category
    const getCategoryEndpoint = (category: string) => {
        const categoryMap: { [key: string]: string } = {
            distance: 'distance',
            weight: 'weight',
            time: 'time',
            weather: 'weather',
            vehicle_type: 'vehicle-type',
            special_requirements: 'special-requirements',
            location: 'location',
            service_level: 'service-level',
            staff_required: 'staff-required',
            property_type: 'property-type',
            insurance: 'insurance',
            loading_time: 'loading-time',
        };

        return categoryMap[category] || category;
    };

    // Initialize form with either initial data or defaults based on category
    const initialValues = {
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || '',
        is_active: initialData?.is_active ?? true,
        // Distance factor fields
        base_rate_per_km: initialData?.base_rate_per_km || '',
        min_distance: initialData?.min_distance || '',
        max_distance: initialData?.max_distance || '',
        base_rate_per_mile: initialData?.base_rate_per_mile || '',
        additional_distance_threshold: initialData?.additional_distance_threshold || '',
        additional_distance_multiplier: initialData?.additional_distance_multiplier || '',
        // Weight factor fields
        base_rate_per_kg: initialData?.base_rate_per_kg || '',
        min_weight: initialData?.min_weight || '',
        max_weight: initialData?.max_weight || '',
        base_rate_per_lb: initialData?.base_rate_per_lb || '',
        volume_to_weight_ratio: initialData?.volume_to_weight_ratio || '',
        heavy_item_threshold: initialData?.heavy_item_threshold || '',
        heavy_item_surcharge: initialData?.heavy_item_surcharge || '',
        // Time factor fields
        peak_hour_multiplier: initialData?.peak_hour_multiplier || '',
        weekend_multiplier: initialData?.weekend_multiplier || '',
        holiday_multiplier: initialData?.holiday_multiplier || '',
        // Weather factor fields
        rain_multiplier: initialData?.rain_multiplier || '',
        snow_multiplier: initialData?.snow_multiplier || '',
        extreme_weather_multiplier: initialData?.extreme_weather_multiplier || '',
        // Vehicle type factor fields
        vehicle_type: initialData?.vehicle_type || '',
        vehicle_base_rate: initialData?.vehicle_base_rate || '',
        capacity_multiplier: initialData?.capacity_multiplier || '',
        capacity_cubic_meters: initialData?.capacity_cubic_meters || '',
        capacity_weight_kg: initialData?.capacity_weight_kg || '',
        fuel_efficiency_km_per_liter: initialData?.fuel_efficiency_km_per_liter || '',
        vehicle_hourly_rate: initialData?.vehicle_hourly_rate || '',
        vehicle_daily_rate: initialData?.vehicle_daily_rate || '',
        // Special requirements factor fields
        fragile_items_multiplier: initialData?.fragile_items_multiplier || '',
        assembly_required_rate: initialData?.assembly_required_rate || '',
        special_equipment_rate: initialData?.special_equipment_rate || '',
        // Location factor fields
        city_name: initialData?.city_name || '',
        zone_multiplier: initialData?.zone_multiplier || '',
        congestion_charge: initialData?.congestion_charge || '',
        parking_fee: initialData?.parking_fee || '',
        // Service level factor fields
        service_level: initialData?.service_level || '',
        price_multiplier: initialData?.price_multiplier || '',
        // Staff required factor fields
        base_rate_per_staff: initialData?.base_rate_per_staff || '',
        min_staff: initialData?.min_staff || '',
        max_staff: initialData?.max_staff || '',
        staff_hourly_rate: initialData?.staff_hourly_rate || '',
        overtime_rate_multiplier: initialData?.overtime_rate_multiplier || '',
        specialist_staff_multiplier: initialData?.specialist_staff_multiplier || '',
        // Property type factor fields
        property_type: initialData?.property_type || '',
        property_base_rate: initialData?.property_base_rate || '',
        rate_per_room: initialData?.rate_per_room || '',
        elevator_discount: initialData?.elevator_discount || '',
        floor_rate: initialData?.floor_rate || '',
        narrow_access_fee: initialData?.narrow_access_fee || '',
        stairs_per_flight_fee: initialData?.stairs_per_flight_fee || '',
        rate_per_sq_meter: initialData?.rate_per_sq_meter || '',
        long_carry_distance_fee: initialData?.long_carry_distance_fee || '',
        // Insurance factor fields
        insurance_base_rate: initialData?.insurance_base_rate || '',
        value_percentage: initialData?.value_percentage || '',
        min_premium: initialData?.min_premium || '',
        premium_coverage_multiplier: initialData?.premium_coverage_multiplier || '',
        high_value_item_threshold: initialData?.high_value_item_threshold || '',
        high_value_item_rate: initialData?.high_value_item_rate || '',
        deductible_amount: initialData?.deductible_amount || '',
        // Loading time factor fields
        base_rate_per_hour: initialData?.base_rate_per_hour || '',
        min_hours: initialData?.min_hours || '',
        overtime_multiplier: initialData?.overtime_multiplier || '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object().shape({
            ...baseValidationSchema.fields,
            ...(selectedCategory ? factorTypeSchemas[selectedCategory as keyof typeof factorTypeSchemas]?.fields : {}),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            setError(null);

            try {
                const endpoint = getCategoryEndpoint(values.category);
                const url = initialData?.id ? `admin/pricing-factors/${endpoint}/${initialData.id}/` : `admin/pricing-factors/${endpoint}/`;
                const method = initialData?.id ? 'put' : 'post';

                // Get category-specific fields based on the selected category
                const categorySpecificFields = {
                    distance: ['base_rate_per_km', 'base_rate_per_mile', 'additional_distance_multiplier', 'min_distance', 'max_distance', 'additional_distance_threshold'],
                    weight: ['base_rate_per_kg', 'base_rate_per_lb', 'min_weight', 'max_weight', 'volume_to_weight_ratio', 'heavy_item_threshold', 'heavy_item_surcharge'],
                    time: ['peak_hour_multiplier', 'weekend_multiplier', 'holiday_multiplier'],
                    weather: ['rain_multiplier', 'snow_multiplier', 'extreme_weather_multiplier'],
                    vehicle_type: [
                        'vehicle_type',
                        'vehicle_base_rate',
                        'capacity_multiplier',
                        'capacity_cubic_meters',
                        'capacity_weight_kg',
                        'fuel_efficiency_km_per_liter',
                        'vehicle_hourly_rate',
                        'vehicle_daily_rate',
                    ],
                    special_requirements: ['fragile_items_multiplier', 'assembly_required_rate', 'special_equipment_rate'],
                    location: ['city_name', 'zone_multiplier', 'congestion_charge', 'parking_fee'],
                    service_level: ['service_level', 'price_multiplier'],
                    staff_required: ['base_rate_per_staff', 'min_staff', 'max_staff', 'staff_hourly_rate', 'overtime_rate_multiplier', 'specialist_staff_multiplier'],
                    property_type: [
                        'property_type',
                        'property_base_rate',
                        'rate_per_room',
                        'elevator_discount',
                        'floor_rate',
                        'narrow_access_fee',
                        'stairs_per_flight_fee',
                        'rate_per_sq_meter',
                        'long_carry_distance_fee',
                    ],
                    loading_time: ['base_rate_per_hour', 'min_hours', 'overtime_multiplier'],
                    insurance: ['insurance_base_rate', 'value_percentage', 'min_premium', 'premium_coverage_multiplier', 'high_value_item_threshold', 'high_value_item_rate', 'deductible_amount'],
                };

                // Create the payload with only the necessary fields
                const payload = {
                    name: values.name,
                    description: values.description,
                    category: values.category,
                    is_active: values.is_active,
                    ...Object.fromEntries(
                        categorySpecificFields[values.category as keyof typeof categorySpecificFields]
                            .map((field) => [field, values[field]])
                            .filter(([_, value]) => value !== undefined && value !== '')
                    ),
                };

                // Convert string values to numbers for numeric fields
                const processedPayload = Object.entries(payload).reduce((acc, [key, value]) => {
                    if (typeof value === 'string' && !isNaN(Number(value))) {
                        acc[key] = Number(value);
                    } else {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as any);

                console.log('Submitting payload:', processedPayload);
                const response = await axiosInstance[method](url, processedPayload);

                if (response.status === 200 || response.status === 201) {
                    onSuccess();
                    onClose();
                }
            } catch (err: any) {
                console.error('Error submitting form:', err);
                setError(err.response?.data?.message || 'An error occurred while saving the pricing factor');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        formik.setFieldValue('category', newCategory);

        // Reset category-specific fields when changing categories
        if (newCategory !== formik.values.category) {
            const categoryFields = Object.keys(factorTypeSchemas[newCategory as keyof typeof factorTypeSchemas]?.fields || {});
            categoryFields.forEach((field) => {
                formik.setFieldValue(field, '');
            });
        }
    };

    // Update error message rendering to handle FormikErrors type
    const renderErrorMessage = (error: any) => {
        if (typeof error === 'string') {
            return error;
        }
        return '';
    };

    // Render fields specific to distance factor
    const renderDistanceFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per KM</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per kilometer for the journey</p>
                    <input
                        type="number"
                        name="base_rate_per_km"
                        value={formik.values.base_rate_per_km || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_km && formik.touched.base_rate_per_km && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_km)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per Mile</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per mile for the journey</p>
                    <input
                        type="number"
                        name="base_rate_per_mile"
                        value={formik.values.base_rate_per_mile || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_mile && formik.touched.base_rate_per_mile && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_mile)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Distance (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The minimum distance for which this rate applies</p>
                    <input
                        type="number"
                        name="min_distance"
                        value={formik.values.min_distance || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_distance && formik.touched.min_distance && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_distance)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Distance (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The maximum distance for which this rate applies</p>
                    <input
                        type="number"
                        name="max_distance"
                        value={formik.values.max_distance || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.max_distance && formik.touched.max_distance && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.max_distance)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Distance Threshold (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Distance after which additional charges apply</p>
                    <input
                        type="number"
                        name="additional_distance_threshold"
                        value={formik.values.additional_distance_threshold || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.additional_distance_threshold && formik.touched.additional_distance_threshold && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.additional_distance_threshold)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Distance Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Multiplier applied to the base rate for distances beyond the threshold</p>
                    <input
                        type="number"
                        name="additional_distance_multiplier"
                        value={formik.values.additional_distance_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.additional_distance_multiplier && formik.touched.additional_distance_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.additional_distance_multiplier)}</p>
                    )}
                </div>
            </div>
        </>
    );

    // Render fields specific to weight factor
    const renderWeightFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per KG</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per kilogram of weight</p>
                    <input
                        type="number"
                        name="base_rate_per_kg"
                        value={formik.values.base_rate_per_kg || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_kg && formik.touched.base_rate_per_kg && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_kg)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per LB</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per pound of weight</p>
                    <input
                        type="number"
                        name="base_rate_per_lb"
                        value={formik.values.base_rate_per_lb || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_lb && formik.touched.base_rate_per_lb && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_lb)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Weight (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The minimum weight for which this rate applies</p>
                    <input
                        type="number"
                        name="min_weight"
                        value={formik.values.min_weight || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_weight && formik.touched.min_weight && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_weight)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Weight (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The maximum weight for which this rate applies</p>
                    <input
                        type="number"
                        name="max_weight"
                        value={formik.values.max_weight || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.max_weight && formik.touched.max_weight && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.max_weight)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volume to Weight Ratio</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The ratio used to convert volume to weight (kg/m³)</p>
                    <input
                        type="number"
                        name="volume_to_weight_ratio"
                        value={formik.values.volume_to_weight_ratio || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.volume_to_weight_ratio && formik.touched.volume_to_weight_ratio && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.volume_to_weight_ratio)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heavy Item Threshold (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Weight threshold after which heavy item surcharge applies</p>
                    <input
                        type="number"
                        name="heavy_item_threshold"
                        value={formik.values.heavy_item_threshold || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.heavy_item_threshold && formik.touched.heavy_item_threshold && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.heavy_item_threshold)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heavy Item Surcharge</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Additional charge applied to items exceeding the heavy item threshold</p>
                <input
                    type="number"
                    name="heavy_item_surcharge"
                    value={formik.values.heavy_item_surcharge || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.heavy_item_surcharge && formik.touched.heavy_item_surcharge && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.heavy_item_surcharge)}</p>}
            </div>
        </>
    );

    // Render fields specific to insurance factor
    const renderInsuranceFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate</label>
                    <input
                        type="number"
                        name="insurance_base_rate"
                        value={formik.values.insurance_base_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.insurance_base_rate && formik.touched.insurance_base_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.insurance_base_rate)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coverage Multiplier</label>
                    <input
                        type="number"
                        name="premium_coverage_multiplier"
                        value={formik.values.premium_coverage_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.premium_coverage_multiplier && formik.touched.premium_coverage_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.premium_coverage_multiplier)}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Coverage</label>
                    <input
                        type="number"
                        name="min_premium"
                        value={formik.values.min_premium || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_premium && formik.touched.min_premium && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_premium)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Coverage</label>
                    <input
                        type="number"
                        name="value_percentage"
                        value={formik.values.value_percentage || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.value_percentage && formik.touched.value_percentage && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.value_percentage)}</p>}
                </div>
            </div>
        </>
    );

    // Render fields specific to time factor
    const renderTimeFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peak Hour Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during peak hours (e.g., rush hour)</p>
                    <input
                        type="number"
                        name="peak_hour_multiplier"
                        value={formik.values.peak_hour_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.peak_hour_multiplier && formik.touched.peak_hour_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.peak_hour_multiplier)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekend Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during weekends</p>
                    <input
                        type="number"
                        name="weekend_multiplier"
                        value={formik.values.weekend_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.weekend_multiplier && formik.touched.weekend_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.weekend_multiplier)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holiday Multiplier</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during holidays</p>
                <input
                    type="number"
                    name="holiday_multiplier"
                    value={formik.values.holiday_multiplier || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.holiday_multiplier && formik.touched.holiday_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.holiday_multiplier)}</p>}
            </div>
        </>
    );

    // Render fields specific to weather factor
    const renderWeatherFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rain Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during rainy conditions</p>
                    <input
                        type="number"
                        name="rain_multiplier"
                        value={formik.values.rain_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.rain_multiplier && formik.touched.rain_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.rain_multiplier)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Snow Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during snowy conditions</p>
                    <input
                        type="number"
                        name="snow_multiplier"
                        value={formik.values.snow_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.snow_multiplier && formik.touched.snow_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.snow_multiplier)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extreme Weather Multiplier</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during extreme weather conditions</p>
                <input
                    type="number"
                    name="extreme_weather_multiplier"
                    value={formik.values.extreme_weather_multiplier || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.extreme_weather_multiplier && formik.touched.extreme_weather_multiplier && (
                    <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.extreme_weather_multiplier)}</p>
                )}
            </div>
        </>
    );

    // Render fields specific to vehicle type factor
    const renderVehicleTypeFields = () => (
        <>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select the type of vehicle for this pricing factor</p>
                <select
                    name="vehicle_type"
                    value={formik.values.vehicle_type || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Select Vehicle Type</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="specialized">Specialized</option>
                </select>
                {formik.errors.vehicle_type && formik.touched.vehicle_type && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_type)}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate for this vehicle type</p>
                    <input
                        type="number"
                        name="vehicle_base_rate"
                        value={formik.values.vehicle_base_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.vehicle_base_rate && formik.touched.vehicle_base_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_base_rate)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Multiplier applied based on vehicle capacity</p>
                    <input
                        type="number"
                        name="capacity_multiplier"
                        value={formik.values.capacity_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_multiplier && formik.touched.capacity_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_multiplier)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Cubic Meters)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Maximum volume capacity of the vehicle</p>
                    <input
                        type="number"
                        name="capacity_cubic_meters"
                        value={formik.values.capacity_cubic_meters || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_cubic_meters && formik.touched.capacity_cubic_meters && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_cubic_meters)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Weight KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Maximum weight capacity of the vehicle</p>
                    <input
                        type="number"
                        name="capacity_weight_kg"
                        value={formik.values.capacity_weight_kg || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_weight_kg && formik.touched.capacity_weight_kg && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_weight_kg)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Efficiency (KM/L)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Vehicle's fuel efficiency in kilometers per liter</p>
                    <input
                        type="number"
                        name="fuel_efficiency_km_per_liter"
                        value={formik.values.fuel_efficiency_km_per_liter || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.fuel_efficiency_km_per_liter && formik.touched.fuel_efficiency_km_per_liter && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.fuel_efficiency_km_per_liter)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rate charged per hour for this vehicle type</p>
                    <input
                        type="number"
                        name="vehicle_hourly_rate"
                        value={formik.values.vehicle_hourly_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.vehicle_hourly_rate && formik.touched.vehicle_hourly_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_hourly_rate)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rate charged per day for this vehicle type</p>
                <input
                    type="number"
                    name="vehicle_daily_rate"
                    value={formik.values.vehicle_daily_rate || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.vehicle_daily_rate && formik.touched.vehicle_daily_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_daily_rate)}</p>}
            </div>
        </>
    );

    // Render fields specific to special requirements factor
    const renderSpecialRequirementsFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fragile Items Multiplier</label>
                    <input
                        type="number"
                        name="fragile_items_multiplier"
                        value={formik.values.fragile_items_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.fragile_items_multiplier && formik.touched.fragile_items_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.fragile_items_multiplier)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assembly Required Rate</label>
                    <input
                        type="number"
                        name="assembly_required_rate"
                        value={formik.values.assembly_required_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.assembly_required_rate && formik.touched.assembly_required_rate && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.assembly_required_rate)}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Equipment Rate</label>
                <input
                    type="number"
                    name="special_equipment_rate"
                    value={formik.values.special_equipment_rate || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.special_equipment_rate && formik.touched.special_equipment_rate && (
                    <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.special_equipment_rate)}</p>
                )}
            </div>
        </>
    );

    // Render fields specific to location factor
    const renderLocationFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City Name</label>
                    <input
                        type="text"
                        name="city_name"
                        value={formik.values.city_name || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.city_name && formik.touched.city_name && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.city_name)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zone Multiplier</label>
                    <input
                        type="number"
                        name="zone_multiplier"
                        value={formik.values.zone_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.zone_multiplier && formik.touched.zone_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.zone_multiplier)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Congestion Charge</label>
                    <input
                        type="number"
                        name="congestion_charge"
                        value={formik.values.congestion_charge || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.congestion_charge && formik.touched.congestion_charge && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.congestion_charge)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parking Fee</label>
                    <input
                        type="number"
                        name="parking_fee"
                        value={formik.values.parking_fee || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.parking_fee && formik.touched.parking_fee && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.parking_fee)}</p>}
                </div>
            </div>
        </>
    );

    // Render fields specific to service level factor
    const renderServiceLevelFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Level</label>
                    <select
                        name="service_level"
                        value={formik.values.service_level || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Select Service Level</option>
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                        <option value="premium">Premium</option>
                    </select>
                    {formik.errors.service_level && formik.touched.service_level && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.service_level)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Multiplier</label>
                    <input
                        type="number"
                        name="price_multiplier"
                        value={formik.values.price_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.price_multiplier && formik.touched.price_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.price_multiplier)}</p>}
                </div>
            </div>
        </>
    );

    // Render fields specific to staff required factor
    const renderStaffRequiredFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per Staff</label>
                    <input
                        type="number"
                        name="base_rate_per_staff"
                        value={formik.values.base_rate_per_staff || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_staff && formik.touched.base_rate_per_staff && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_staff)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Staff</label>
                    <input
                        type="number"
                        name="min_staff"
                        value={formik.values.min_staff || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_staff && formik.touched.min_staff && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_staff)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Staff</label>
                    <input
                        type="number"
                        name="max_staff"
                        value={formik.values.max_staff || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.max_staff && formik.touched.max_staff && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.max_staff)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Overtime Rate Multiplier</label>
                    <input
                        type="number"
                        name="overtime_rate_multiplier"
                        value={formik.values.overtime_rate_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.overtime_rate_multiplier && formik.touched.overtime_rate_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.overtime_rate_multiplier)}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialist Staff Multiplier</label>
                    <input
                        type="number"
                        name="specialist_staff_multiplier"
                        value={formik.values.specialist_staff_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.specialist_staff_multiplier && formik.touched.specialist_staff_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.specialist_staff_multiplier)}</p>
                    )}
                </div>
            </div>
        </>
    );

    // Render fields specific to property type factor
    const renderPropertyTypeFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                    <select
                        name="property_type"
                        value={formik.values.property_type || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Select Property Type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="office">Office</option>
                        <option value="storage">Storage</option>
                        <option value="other">Other</option>
                    </select>
                    {formik.errors.property_type && formik.touched.property_type && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.property_type)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate</label>
                    <input
                        type="number"
                        name="property_base_rate"
                        value={formik.values.property_base_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.property_base_rate && formik.touched.property_base_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.property_base_rate)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate per Room</label>
                    <input
                        type="number"
                        name="rate_per_room"
                        value={formik.values.rate_per_room || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.rate_per_room && formik.touched.rate_per_room && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.rate_per_room)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Elevator Discount</label>
                    <input
                        type="number"
                        name="elevator_discount"
                        value={formik.values.elevator_discount || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.elevator_discount && formik.touched.elevator_discount && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.elevator_discount)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor Rate</label>
                    <input
                        type="number"
                        name="floor_rate"
                        value={formik.values.floor_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.floor_rate && formik.touched.floor_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.floor_rate)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Narrow Access Fee</label>
                    <input
                        type="number"
                        name="narrow_access_fee"
                        value={formik.values.narrow_access_fee || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.narrow_access_fee && formik.touched.narrow_access_fee && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.narrow_access_fee)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stairs per Flight Fee</label>
                    <input
                        type="number"
                        name="stairs_per_flight_fee"
                        value={formik.values.stairs_per_flight_fee || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.stairs_per_flight_fee && formik.touched.stairs_per_flight_fee && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.stairs_per_flight_fee)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate per Square Meter</label>
                    <input
                        type="number"
                        name="rate_per_sq_meter"
                        value={formik.values.rate_per_sq_meter || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.rate_per_sq_meter && formik.touched.rate_per_sq_meter && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.rate_per_sq_meter)}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Long Carry Distance Fee</label>
                <input
                    type="number"
                    name="long_carry_distance_fee"
                    value={formik.values.long_carry_distance_fee || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.long_carry_distance_fee && formik.touched.long_carry_distance_fee && (
                    <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.long_carry_distance_fee)}</p>
                )}
            </div>
        </>
    );

    // Render fields specific to loading time factor
    const renderLoadingTimeFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per Hour</label>
                    <input
                        type="number"
                        name="base_rate_per_hour"
                        value={formik.values.base_rate_per_hour || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_hour && formik.touched.base_rate_per_hour && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_hour)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Hours</label>
                    <input
                        type="number"
                        name="min_hours"
                        value={formik.values.min_hours || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_hours && formik.touched.min_hours && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_hours)}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Overtime Multiplier</label>
                <input
                    type="number"
                    name="overtime_multiplier"
                    value={formik.values.overtime_multiplier || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.overtime_multiplier && formik.touched.overtime_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.overtime_multiplier)}</p>}
            </div>
        </>
    );

    // Render fields specific to each category
    const renderCategoryFields = () => {
        switch (selectedCategory) {
            case 'distance':
                return renderDistanceFields();
            case 'weight':
                return renderWeightFields();
            case 'time':
                return renderTimeFields();
            case 'weather':
                return renderWeatherFields();
            case 'vehicle_type':
                return renderVehicleTypeFields();
            case 'special_requirements':
                return renderSpecialRequirementsFields();
            case 'location':
                return renderLocationFields();
            case 'service_level':
                return renderServiceLevelFields();
            case 'staff_required':
                return renderStaffRequiredFields();
            case 'property_type':
                return renderPropertyTypeFields();
            case 'insurance':
                return renderInsuranceFields();
            case 'loading_time':
                return renderLoadingTimeFields();
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{initialData?.id ? 'Edit' : 'Add'} Pricing Factor</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {error && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}

                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Basic Information</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select the type of pricing factor</p>
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
                                {formik.errors.category && formik.touched.category && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.category)}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">A descriptive name for this pricing factor</p>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.name && formik.touched.name && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.name)}</p>}
                                </div>

                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formik.values.is_active}
                                        onChange={formik.handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Detailed description of this pricing factor</p>
                                <textarea
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                {formik.errors.description && formik.touched.description && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.description)}</p>}
                            </div>
                        </div>
                    </div>

                    {selectedCategory && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Factor Specific Settings</h3>
                            <div className="space-y-6">{renderCategoryFields()}</div>
                        </div>
                    )}

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
                            disabled={isSubmitting || !formik.isValid}
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
