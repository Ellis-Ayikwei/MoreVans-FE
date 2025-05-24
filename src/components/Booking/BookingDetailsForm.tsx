import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from '../../helper/formatCurrency';
import { UserIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOfficeIcon, ArrowLeftIcon, TruckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../helper/axiosInstance';
import { Autocomplete } from '@react-google-maps/api';

interface Stop {
    type: 'pickup' | 'dropoff' | 'stop';
    location: string;
    unit_number?: string;
    floor?: string;
    instructions?: string;
    postcode?: string;
}

interface BookingDetailsFormProps {
    selectedPrice: {
        price: number;
        staff_count: number;
        date: string;
    };
    requestId: string;
    onBack: () => void;
    initialPostcode?: string;
    isVisible: boolean;
}

const FormBanner = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-8 mb-8 shadow-sm dark:shadow-gray-900"
    >
        {/* Decorative elements */}
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 dark:from-gray-700/20 dark:to-gray-700/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.05),transparent_50%)]"></div>
        </div>

        <div className="relative flex items-center space-x-6">
            <div className="flex-shrink-0">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-gray-700 p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                >
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </motion.div>
            </div>
            <div className="flex-1">
                <motion.h4 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </motion.h4>
                <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </motion.p>
            </div>
        </div>

        {/* Animated bottom border */}
        <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-500"
        />
    </motion.div>
);

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({ selectedPrice, requestId, onBack, initialPostcode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [requestType, setRequestType] = useState<'instant' | 'journey'>('instant');
    const [stops, setStops] = useState<Stop[]>([
        { type: 'pickup', location: '', unit_number: '', floor: '', instructions: '', postcode: initialPostcode },
        { type: 'dropoff', location: '', unit_number: '', floor: '', instructions: '', postcode: initialPostcode },
    ]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        staffCount: selectedPrice.staff_count,
    });

    useEffect(() => {
        // Fetch request details to determine type and initial stops
        const fetchRequestDetails = async () => {
            try {
                const response = await axiosInstance.get(`/requests/${requestId}`);
                const { request_type, journey_stops } = response.data;
                setRequestType(request_type);

                if (request_type === 'journey' && journey_stops) {
                    // Ensure each stop has the initial postcode
                    const stopsWithPostcode = journey_stops.map((stop) => ({
                        ...stop,
                        postcode: initialPostcode,
                    }));
                    setStops(stopsWithPostcode);
                }
            } catch (error) {
                console.error('Error fetching request details:', error);
            }
        };

        fetchRequestDetails();
    }, [requestId, initialPostcode]);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        // Set the search area to the initial postcode
        if (initialPostcode) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: initialPostcode }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(results[0].geometry.location);

                    // Set the search area to the postcode bounds
                    autocomplete.setBounds(bounds);

                    // Set the component restrictions to UK
                    autocomplete.setComponentRestrictions({
                        country: 'gb',
                    });
                }
            });
        }
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = (index: number) => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const addressComponents = place.address_components || [];
            let postcode = '';

            for (const component of addressComponents) {
                if (component.types.includes('postal_code')) {
                    postcode = component.long_name;
                    break;
                }
            }

            // Verify that the selected address is within the initial postcode
            if (postcode !== initialPostcode) {
                alert('Please select an address within the initially selected postcode area.');
                return;
            }

            setStops((prevStops) => {
                const newStops = [...prevStops];
                newStops[index] = {
                    ...newStops[index],
                    location: place.formatted_address || '',
                    postcode,
                };
                return newStops;
            });
        }
    };

    const addStop = () => {
        setStops((prevStops) => [
            ...prevStops,
            {
                type: 'stop',
                location: '',
                unit_number: '',
                floor: '',
                instructions: '',
                postcode: initialPostcode,
            },
        ]);
    };

    const removeStop = (index: number) => {
        setStops((prevStops) => prevStops.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const requestData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                request_type: requestType,
                journey_stops: stops,
                staff_count: formData.staffCount,
            };

            const response = await axiosInstance.post(`/requests/${requestId}/update_details/`, requestData);

            if (response.status === 200) {
                navigate('/guest-payment', {
                    state: {
                        selectedPrice: {
                            ...selectedPrice,
                            staff_count: formData.staffCount,
                        },
                        bookingDetails: { ...formData, stops },
                        requestId,
                    },
                });
            }
        } catch (error) {
            console.error('Error updating request details:', error);
        }
    };

    const renderStopForm = (stop: Stop, index: number) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <MapPinIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                    {stop.type === 'pickup' ? 'Pickup Location' : stop.type === 'dropoff' ? 'Dropoff Location' : `Stop ${index + 1}`}
                </h3>
                {stop.type === 'stop' && (
                    <button type="button" onClick={() => removeStop(index)} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address (within {initialPostcode})</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <Autocomplete onLoad={onLoad} onPlaceChanged={() => onPlaceChanged(index)} restrictions={{ country: 'gb' }}>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                value={stop.location}
                                onChange={(e) => {
                                    const newStops = [...stops];
                                    newStops[index].location = e.target.value;
                                    setStops(newStops);
                                }}
                                placeholder={`Enter address in ${initialPostcode}`}
                            />
                        </Autocomplete>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Please select an address within {initialPostcode}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apartment Number</label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={stop.unit_number}
                            onChange={(e) => {
                                const newStops = [...stops];
                                newStops[index].unit_number = e.target.value;
                                setStops(newStops);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor</label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={stop.floor}
                            onChange={(e) => {
                                const newStops = [...stops];
                                newStops[index].floor = e.target.value;
                                setStops(newStops);
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Instructions</label>
                    <textarea
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows={3}
                        value={stop.instructions}
                        onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].instructions = e.target.value;
                            setStops(newStops);
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <FormBanner icon={TruckIcon} title="Complete Your Booking Details" description="Please provide the following information to complete your booking" />

                {/* Price Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Details</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Staff Count: {selectedPrice.staff_count}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Selected Date</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{new Date(selectedPrice.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Total Price</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(selectedPrice.price)}</p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <UserIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stops */}
                    {stops.map((stop, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <FormBanner
                                    icon={TruckIcon}
                                    title={stop.type === 'dropoff' ? 'Final Destination' : `Stop ${index + 1}`}
                                    description={stop.type === 'dropoff' ? 'Tell us where we should deliver your items' : 'Additional stop location'}
                                />
                            )}
                            {renderStopForm(stop, index)}
                        </React.Fragment>
                    ))}

                    {/* Add Stop Button */}
                    {requestType === 'journey' && (
                        <motion.button
                            type="button"
                            onClick={addStop}
                            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Add Another Stop</span>
                        </motion.button>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end mt-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Complete Booking
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingDetailsForm;
