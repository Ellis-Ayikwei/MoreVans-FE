import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faDollarSign, faCar, faClock, faMapMarkerAlt, faBuilding, faShieldAlt, faCloudSun, faUsers, faBox, faEdit, faTrash, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../helper/axiosInstance';
import PricingConfigForm from './PricingConfigForm';
import PricingFactorForm from './PricingFactorForm';
import PricingConfigurationForm from './PricingConfigurationForm';

interface PricingFactor {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    category: string;
    [key: string]: any;
}

interface PricingConfiguration {
    id: number;
    name: string;
    is_active: boolean;
    is_default: boolean;
    base_price: number;
    min_price: number;
    max_price_multiplier: number;
    fuel_surcharge_percentage: number;
    carbon_offset_rate: number;
    active_factors: {
        [category: string]: number[];
    };
}

interface PricingFactorsResponse {
    distance: PricingFactor[];
    weight: PricingFactor[];
    time: PricingFactor[];
    weather: PricingFactor[];
    vehicle_type: PricingFactor[];
    special_requirements: PricingFactor[];
    location: PricingFactor[];
    service_level: PricingFactor[];
    staff_required: PricingFactor[];
    property_type: PricingFactor[];
    insurance: PricingFactor[];
    loading_time: PricingFactor[];
    configuration: PricingConfiguration[];
}

const PricingAdmin = () => {
    const [activeTab, setActiveTab] = useState('config');
    const [configurations, setConfigurations] = useState<PricingConfiguration[]>([]);
    const [factors, setFactors] = useState<PricingFactor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfigForm, setShowConfigForm] = useState(false);
    const [showFactorForm, setShowFactorForm] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<PricingConfiguration | null>(null);
    const [selectedFactor, setSelectedFactor] = useState<PricingFactor | null>(null);

    useEffect(() => {
        fetchPricingData();
    }, []);

    const fetchPricingData = async () => {
        try {
            setLoading(true);
            const [factorsResponse, configsResponse] = await Promise.all([axiosInstance.get('/admin/pricing-factors/'), axiosInstance.get('/admin/price-configurations/')]);

            // Ensure configurations is an array
            const configsData = configsResponse.data;
            const configsArray = Array.isArray(configsData) ? configsData : [];
            setConfigurations(configsArray);
            console.log('configsArray', configsResponse);
            console.log('factorsResponse', factorsResponse.data);

            // Flatten all factors into a single array, filtering for active ones
            const allFactors: PricingFactor[] = [];
            Object.entries(factorsResponse.data).forEach(([category, items]) => {
                if (category !== 'configuration' && Array.isArray(items)) {
                    items.forEach((item) => {
                        if (item.is_active) {
                            allFactors.push({
                                ...item,
                                category,
                            });
                        }
                    });
                }
            });

            setFactors(allFactors);
        } catch (err: any) {
            console.error('Error in fetchPricingData:', err);
            setError('Failed to load pricing data: ' + (err.response?.data?.message || err.message));
            setFactors([]);
            setConfigurations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfigEdit = (config: PricingConfiguration) => {
        setSelectedConfig(config);
        setShowConfigForm(true);
    };

    const handleConfigDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this configuration?')) return;

        try {
            await axiosInstance.delete(`/admin/pricing/configurations/${id}/`);
            setConfigurations(configurations.filter((config) => config.id !== id));
        } catch (err: any) {
            setError('Failed to delete configuration: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleFactorEdit = (factor: PricingFactor) => {
        setSelectedFactor(factor);
        setShowFactorForm(true);
    };

    const handleFactorDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this factor?')) return;

        try {
            await axiosInstance.delete(`/admin/pricing-factors/${id}/`);
            setFactors(factors.filter((factor) => factor.id !== id));
        } catch (err: any) {
            setError('Failed to delete factor: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            // First, unset any existing default
            await axiosInstance.patch('/admin/pricing/configurations/set-default/', {
                configuration_id: id,
            });
            await fetchPricingData(); // Refresh the data
        } catch (err: any) {
            setError('Failed to set default configuration: ' + (err.response?.data?.message || err.message));
        }
    };

    const renderConfigurations = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Pricing Configurations</h2>
                <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                    onClick={() => {
                        setSelectedConfig(null);
                        setShowConfigForm(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Configuration
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {configurations.map((config) => (
                    <div key={config.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{config.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs ${config.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {config.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        {config.is_default && <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Default</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                                    <span className="font-medium">€{config.base_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Min Price:</span>
                                    <span className="font-medium">€{config.min_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Max Multiplier:</span>
                                    <span className="font-medium">{config.max_price_multiplier}x</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Fuel Surcharge:</span>
                                    <span className="font-medium">{config.fuel_surcharge_percentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Carbon Offset:</span>
                                    <span className="font-medium">{config.carbon_offset_rate}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
                            <div className="flex justify-end space-x-3">
                                {!config.is_default && (
                                    <button
                                        className="inline-flex items-center px-3 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                                        onClick={() => handleSetDefault(config.id)}
                                    >
                                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                        Set as Default
                                    </button>
                                )}
                                <button
                                    className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    onClick={() => handleConfigEdit(config)}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    className="inline-flex items-center px-3 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleConfigDelete(config.id)}
                                    disabled={config.is_default}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFactors = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Active Pricing Factors</h2>
                <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                    onClick={() => {
                        setSelectedFactor(null);
                        setShowFactorForm(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Factor
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {factors.map((factor) => (
                    <div key={`${factor.category}-${factor.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{factor.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{factor.category}</span>
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{factor.description || 'No description provided'}</p>

                            {/* Factor-specific details */}
                            <div className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                {factor.category === 'distance' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate per km:</span>
                                            <span className="font-medium">€{factor.base_rate_per_km}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate per mile:</span>
                                            <span className="font-medium">€{factor.base_rate_per_mile}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Additional Distance Multiplier:</span>
                                            <span className="font-medium">{factor.additional_distance_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Distance Range:</span>
                                            <span className="font-medium">
                                                {factor.min_distance}km - {factor.max_distance}km
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Additional Distance Threshold:</span>
                                            <span className="font-medium">{factor.additional_distance_threshold}km</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'weight' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Weight Rate:</span>
                                            <span className="font-medium">€{factor.base_weight_rate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Rate per kg:</span>
                                            <span className="font-medium">€{factor.rate_per_kg}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Weight Range:</span>
                                            <span className="font-medium">
                                                {factor.min_weight}kg - {factor.max_weight}kg
                                            </span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'insurance' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate:</span>
                                            <span className="font-medium">€{factor.base_rate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Coverage Multiplier:</span>
                                            <span className="font-medium">{factor.coverage_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Coverage Range:</span>
                                            <span className="font-medium">
                                                €{factor.min_coverage} - €{factor.max_coverage}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'weather' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Rain Multiplier:</span>
                                            <span className="font-medium">{factor.rain_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Snow Multiplier:</span>
                                            <span className="font-medium">{factor.snow_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Extreme Weather:</span>
                                            <span className="font-medium">{factor.extreme_weather_multiplier}x</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'vehicle_type' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Vehicle Type:</span>
                                            <span className="font-medium capitalize">{factor.vehicle_type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate:</span>
                                            <span className="font-medium">€{factor.base_rate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Capacity Multiplier:</span>
                                            <span className="font-medium">{factor.capacity_multiplier}x</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'special_requirements' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Fragile Items Multiplier:</span>
                                            <span className="font-medium">{factor.fragile_items_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Assembly Required Rate:</span>
                                            <span className="font-medium">€{factor.assembly_required_rate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Special Equipment Rate:</span>
                                            <span className="font-medium">€{factor.special_equipment_rate}</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'location' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">City:</span>
                                            <span className="font-medium capitalize">{factor.city_name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Zone Multiplier:</span>
                                            <span className="font-medium">{factor.zone_multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Congestion Charge:</span>
                                            <span className="font-medium">€{factor.congestion_charge}</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'service_level' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Service Level:</span>
                                            <span className="font-medium capitalize">{factor.service_level}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Price Multiplier:</span>
                                            <span className="font-medium">{factor.price_multiplier}x</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'staff_required' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate per Staff:</span>
                                            <span className="font-medium">€{factor.base_rate_per_staff}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Staff Range:</span>
                                            <span className="font-medium">
                                                {factor.min_staff} - {factor.max_staff}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'property_type' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Property Type:</span>
                                            <span className="font-medium capitalize">{factor.property_type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate:</span>
                                            <span className="font-medium">€{factor.base_rate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Rate per Room:</span>
                                            <span className="font-medium">€{factor.rate_per_room}</span>
                                        </div>
                                    </>
                                )}

                                {factor.category === 'loading_time' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Base Rate per Hour:</span>
                                            <span className="font-medium">€{factor.base_rate_per_hour}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Min Hours:</span>
                                            <span className="font-medium">{factor.min_hours}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Overtime Multiplier:</span>
                                            <span className="font-medium">{factor.overtime_multiplier}x</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    onClick={() => {
                                        setSelectedFactor(factor);
                                        setShowFactorForm(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    className="inline-flex items-center px-3 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    onClick={() => handleFactorDelete(factor.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pricing data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}

            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`${
                                activeTab === 'config'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Configurations
                        </button>
                        <button
                            onClick={() => setActiveTab('factors')}
                            className={`${
                                activeTab === 'factors'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Factors
                        </button>
                    </nav>
                </div>
                <div className="mt-4">
                    {activeTab === 'config' ? (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Manage your pricing configurations. Each configuration defines base prices, multipliers, and which pricing factors to apply. You can set a default configuration that will
                            be used for all new quotes.
                        </p>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Manage individual pricing factors that affect the final price. These include distance, weight, time, weather, vehicle type, and other factors that can be combined in
                            different configurations.
                        </p>
                    )}
                </div>
            </div>

            {activeTab === 'config' ? renderConfigurations() : renderFactors()}

            {showConfigForm && (
                <PricingConfigurationForm
                    initialData={selectedConfig || undefined}
                    onClose={() => {
                        setShowConfigForm(false);
                        setSelectedConfig(null);
                    }}
                    onSuccess={fetchPricingData}
                />
            )}

            {showFactorForm && (
                <PricingFactorForm
                    initialData={selectedFactor || undefined}
                    onClose={() => {
                        setShowFactorForm(false);
                        setSelectedFactor(null);
                    }}
                    onSuccess={fetchPricingData}
                />
            )}
        </div>
    );
};

export default PricingAdmin;
