import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faDollarSign, faCar, faClock, faMapMarkerAlt, faBuilding, faShieldAlt, faCloudSun, faUsers, faBox, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
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
            const [factorsResponse, configsResponse] = await Promise.all([axiosInstance.get('/admin/pricing/factors/'), axiosInstance.get('/admin/pricing/configurations/')]);

            // Ensure configurations is an array
            const configsData = configsResponse.data;
            const configsArray = Array.isArray(configsData) ? configsData : [];
            setConfigurations(configsArray);

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
            await axiosInstance.delete(`/admin/pricing/factors/${id}/`);
            setFactors(factors.filter((factor) => factor.id !== id));
        } catch (err: any) {
            setError('Failed to delete factor: ' + (err.response?.data?.message || err.message));
        }
    };

    const renderConfigurations = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Pricing Configurations</h2>
                <button
                    className="btn-primary"
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
                    <div key={config.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                                <span className="font-medium">${config.base_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Min Price:</span>
                                <span className="font-medium">${config.min_price}</span>
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
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setSelectedConfig(config);
                                    setShowConfigForm(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit
                            </button>
                            <button className="btn-danger" onClick={() => handleConfigDelete(config.id)}>
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Delete
                            </button>
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
                    className="btn-primary"
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
                    <div key={`${factor.category}-${factor.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{factor.name}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{factor.category}</span>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{factor.description || 'No description provided'}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setSelectedFactor(factor);
                                    setShowFactorForm(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit
                            </button>
                            <button className="btn-danger" onClick={() => handleFactorDelete(factor.id)}>
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Delete
                            </button>
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
