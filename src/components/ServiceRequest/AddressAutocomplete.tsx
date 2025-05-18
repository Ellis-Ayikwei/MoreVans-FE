import React, { useState, useEffect } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string, coords?: { lat: number; lng: number }) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    touched?: boolean;
    name: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    value,
    onChange,
    placeholder = "Search locations (e.g. 'Notting Hill, London')",
    label,
    error,
    touched,
    name,
    className = '',
    required = false,
    disabled = false,
}) => {
    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    // Configure what data to show in suggestions
    const formatSuggestions = (place: any) => {
        const components = {
            locality: '',
            postalCode: '',
            administrativeArea: '',
            country: '',
        };

        place.address_components.forEach((component: { types: string[]; long_name: string; short_name: string }) => {
            if (component.types.includes('locality')) components.locality = component.long_name;
            if (component.types.includes('postal_code')) components.postalCode = component.short_name;
            if (component.types.includes('administrative_area_level_1')) components.administrativeArea = component.short_name;
            if (component.types.includes('country')) components.country = component.long_name;
        });

        // Format like "Notting Hill, London, UK" or "Westminster, London SW1, UK"
        return [components.locality, components.administrativeArea, components.postalCode ? `${components.postalCode.split(' ')[0]}` : '', components.country]
            .filter(Boolean)
            .join(', ');
    };

    const handlePlaceSelect = async () => {
        setIsLoading(true);
        try {
            const place = await autocomplete.getPlace();

            if (!place.place_id) {
                throw new Error('No place selected');
            }

            const formattedLabel = formatSuggestions(place);
            const coords = {
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng(),
            };

            setInputValue(formattedLabel);
            onChange(formattedLabel, coords);
        } catch (err) {
            console.error('Error fetching place details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    if (loadError) {
        return (
            <div className="text-red-500 text-sm">
                Error loading Google Maps API
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="relative">
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={true}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                    .pac-container {
                        border-radius: 0.5rem;
                        margin-top: 0.5rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        background-color: white;
                    }
                    .pac-container:after {
                        display: none !important;
                    }
                    .pac-item {
                        padding: 0.5rem 1rem;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .pac-item:hover {
                        background-color: #f3f4f6;
                    }
                    .pac-item-query {
                        font-size: 0.875rem;
                        color: #1f2937;
                    }
                    .pac-icon {
                        display: none;
                    }
                    .pac-matched {
                        font-weight: 500;
                    }
                `}
            </style>
            <div className={`space-y-2 ${className}`}>
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                    <div className="relative">
                        <Autocomplete
                            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                            onPlaceChanged={handlePlaceSelect}
                            fields={['address_components', 'geometry', 'name', 'place_id']}
                            options={{
                                types: ['geocode'],
                                componentRestrictions: { country: 'GB' },
                                fields: ['address_components', 'geometry', 'name', 'place_id'],
                            }}
                        >
                            <input
                                type="text"
                                id={name}
                                name={name}
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                                disabled={disabled}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    error && touched
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
                            />
                        </Autocomplete>
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>

                {error && touched && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        </>
    );
};

export default AddressAutocomplete; 