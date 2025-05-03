import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faPlus,
    faTimes,
    faGripLines,
    faRoute,
    faChevronUp,
    faChevronDown,
    faCar,
    faElevator,
    faLocationDot,
    faBox,
    faCouch,
    faWarehouse,
    faCamera,
    faTrash,
    faBuilding,
    faRulerCombined,
    faInfoCircle,
    faTags,
    faBoxes,
    faHome,
    faHandHolding,
    faClipboardList,
    faTools,
    faWeightHanging,
    faMusic,
    faHistory,
    faTruck,
    faGlobe,
    faPalette,
    faIndustry,
    faLaptop,
    faPlug,
    faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { commonItems } from '../../data/commonItems';
import { getItemIcon } from '../../utilities/getItemIcon';
import CommonItemsModal from './CommonItemsModal';

const JourneyPlanning = ({ values, setFieldValue }: any) => {
    const [expandedStopIndex, setExpandedStopIndex] = useState<number | null>(null);
    const [expandedItemIndex, setExpandedItemIndex] = useState<{ [stopIndex: number]: number | null }>({});
    const [showCommonItems, setShowCommonItems] = useState<number | null>(null);
    const [expandedServiceSection, setExpandedServiceSection] = useState<{ [stopIndex: number]: boolean }>({});

    const propertyTypes = ['house', 'apartment', 'office', 'storage'];

    // Define service types
    const serviceTypes = [
        { id: 'residential_moving', name: 'Residential Moving', icon: faHome },
        { id: 'office_relocation', name: 'Office Relocation', icon: faBuilding },
        { id: 'piano_moving', name: 'Piano Moving', icon: faMusic },
        { id: 'antique_moving', name: 'Antique Moving', icon: faHistory },
        { id: 'storage_services', name: 'Storage Services', icon: faWarehouse },
        { id: 'packing_services', name: 'Packing Services', icon: faBoxes },
        { id: 'vehicle_transportation', name: 'Vehicle Transportation', icon: faTruck },
        { id: 'international_moving', name: 'International Moving', icon: faGlobe },
        { id: 'furniture_assembly', name: 'Furniture Assembly', icon: faTools },
        { id: 'fragile_items', name: 'Fragile Items', icon: faBox },
        { id: 'artwork_moving', name: 'Artwork Moving', icon: faPalette },
        { id: 'industrial_equipment', name: 'Industrial Equipment', icon: faIndustry },
        { id: 'electronics', name: 'Electronics', icon: faLaptop },
        { id: 'appliances', name: 'Appliances', icon: faPlug },
        { id: 'boxes_parcels', name: 'Boxes/Parcels', icon: faBoxOpen },
    ];

    // Helper to check if a service type requires property details
    const requiresPropertyDetails = (serviceType: string) => {
        return ['house_removal', 'office_removal', 'storage'].includes(serviceType);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(values.journey_stops || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFieldValue('journey_stops', items);
    };

    const getStopColor = (type: string) => {
        switch (type) {
            case 'pickup':
                return 'bg-blue-600 dark:bg-blue-500';
            case 'dropoff':
                return 'bg-green-600 dark:bg-green-500';
            case 'stop':
                return 'bg-orange-600 dark:bg-orange-500';
            default:
                return 'bg-gray-600 dark:bg-gray-500';
        }
    };

    const getStopTypeLabel = (type: string) => {
        switch (type) {
            case 'pickup':
                return 'Pickup';
            case 'dropoff':
                return 'Dropoff';
            case 'stop':
                return 'Stop';
            default:
                return 'Unknown';
        }
    };

    const toggleServiceSection = (stopIndex: number) => {
        setExpandedServiceSection({
            ...expandedServiceSection,
            [stopIndex]: !expandedServiceSection[stopIndex],
        });
    };

    const addItemToPickup = (stopIndex: number, item: any) => {
        const currentItems = values.journey_stops[stopIndex].items || [];

        // Add the new item with all properties from the common item
        setFieldValue(`journey_stops.${stopIndex}.items`, [
            ...currentItems,
            {
                id: uuidv4(),
                name: item.name || '',
                category: item.category || 'furniture',
                category_id: item.category_id || null,
                quantity: item.quantity || 1,
                weight: item.weight || '',
                dimensions: item.dimensions || '',
                value: item.value || '',
                fragile: item.fragile || false,
                needs_disassembly: item.needs_disassembly || false,
                notes: item.notes || '',
                photo: item.photo || null,
                special_instructions: item.special_instructions || '',
                requires_special_handling: item.requires_special_handling || false,
                insurance_required: item.insurance_required || false,
                declared_value: item.declared_value || '',
                dimensions_length: item.dimensions_length || '',
                dimensions_width: item.dimensions_width || '',
                dimensions_height: item.dimensions_height || '',
            },
        ]);

        // Expand the newly added item
        const newItemIndex = currentItems.length;
        setExpandedItemIndex({
            ...expandedItemIndex,
            [stopIndex]: newItemIndex,
        });
    };

    const toggleItemExpansion = (stopIndex: number, itemIndex: number) => {
        setExpandedItemIndex({
            ...expandedItemIndex,
            [stopIndex]: expandedItemIndex[stopIndex] === itemIndex ? null : itemIndex,
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                    <FontAwesomeIcon icon={faRoute} className="mr-2 text-purple-600 dark:text-purple-400" />
                    Journey Planning
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add multiple stops to your journey. For pickup points, specify what items will be collected.</p>
            </div>

            <div className="p-6">
                <FieldArray
                    name="journey_stops"
                    render={(arrayHelpers) => (
                        <div>
                            {values.journey_stops && values.journey_stops.length > 0 ? (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="journey-stops">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 mb-6">
                                                {values.journey_stops.map((stop: any, index: number) => (
                                                    <Draggable key={stop.id} draggableId={stop.id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`border ${
                                                                    stop.type === 'pickup'
                                                                        ? 'border-blue-200 dark:border-blue-800'
                                                                        : stop.type === 'dropoff'
                                                                        ? 'border-green-200 dark:border-green-800'
                                                                        : 'border-orange-200 dark:border-orange-800'
                                                                } rounded-lg ${
                                                                    expandedStopIndex === index
                                                                        ? stop.type === 'pickup'
                                                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                                                            : stop.type === 'dropoff'
                                                                            ? 'bg-green-50 dark:bg-green-900/20'
                                                                            : 'bg-orange-50 dark:bg-orange-900/20'
                                                                        : 'bg-white dark:bg-gray-800'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-center p-3">
                                                                    <div className="flex items-center">
                                                                        <div {...provided.dragHandleProps} className="mr-3 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                                            <FontAwesomeIcon icon={faGripLines} />
                                                                        </div>
                                                                        <div className={`h-7 w-7 rounded-full ${getStopColor(stop.type)} flex items-center justify-center text-white text-xs mr-3`}>
                                                                            {String.fromCharCode(65 + index)}
                                                                        </div>
                                                                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                                                            {getStopTypeLabel(stop.type)}: {stop.location || '(No address)'}
                                                                        </h4>

                                                                        {/* Show item count badge for pickup points */}
                                                                        {stop.items && stop.items.length > 0 && (
                                                                            <div className="ml-3 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                                                {stop.items.length} {stop.items.length === 1 ? 'item' : 'items'}
                                                                            </div>
                                                                        )}

                                                                        {/* Show linked items count for dropoff points */}
                                                                        {stop.type === 'dropoff' && stop.linked_items && stop.linked_items.length > 0 && (
                                                                            <div className="ml-3 px-2 py-0.5 bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs rounded-full">
                                                                                {stop.linked_items.length} {stop.linked_items.length === 1 ? 'item' : 'items'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setExpandedStopIndex(expandedStopIndex === index ? null : index)}
                                                                            className={`text-gray-500 dark:text-gray-400 hover:${
                                                                                stop.type === 'pickup' ? 'text-blue-500' : stop.type === 'dropoff' ? 'text-green-500' : 'text-orange-500'
                                                                            } p-1`}
                                                                        >
                                                                            <FontAwesomeIcon icon={expandedStopIndex === index ? faChevronUp : faChevronDown} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 p-1"
                                                                        >
                                                                            <FontAwesomeIcon icon={faTimes} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {expandedStopIndex === index && (
                                                                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stop Type</label>
                                                                                <Field
                                                                                    as="select"
                                                                                    name={`journey_stops.${index}.type`}
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                >
                                                                                    <option value="pickup">Pickup Point</option>
                                                                                    <option value="dropoff">Dropoff Point</option>
                                                                                    <option value="stop">Intermediate Stop</option>
                                                                                </Field>
                                                                            </div>

                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                                    Street Address <span className="text-red-500">*</span>
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <FontAwesomeIcon
                                                                                        icon={faLocationDot}
                                                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                                                                    />
                                                                                    <Field
                                                                                        name={`journey_stops.${index}.location`}
                                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                        placeholder="Enter full address"
                                                                                    />
                                                                                </div>
                                                                                <ErrorMessage name={`journey_stops.${index}.location`} component="p" className="text-red-500 text-sm mt-1" />
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor</label>
                                                                                <Field
                                                                                    name={`journey_stops.${index}.floor`}
                                                                                    type="number"
                                                                                    min="0"
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                    placeholder="0"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit/Apt #</label>
                                                                                <Field
                                                                                    name={`journey_stops.${index}.unit_number`}
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                    placeholder="e.g., Apt 42"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                                    <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                                                    Parking Info
                                                                                </label>
                                                                                <Field
                                                                                    name={`journey_stops.${index}.parking_info`}
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                    placeholder="e.g., Street parking"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Service Type section */}
                                                                        {stop.type === 'pickup' && (
                                                                            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                                                    What type of service do you need?
                                                                                </label>
                                                                                <Field
                                                                                    as="select"
                                                                                    name={`journey_stops.${index}.service_type`}
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-3"
                                                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                                        const serviceType = e.target.value;
                                                                                        setFieldValue(`journey_stops.${index}.service_type`, serviceType);

                                                                                        // Reset property fields if changing to a service that doesn't need them
                                                                                        if (!requiresPropertyDetails(serviceType)) {
                                                                                            setFieldValue(`journey_stops.${index}.property_type`, 'house');
                                                                                            setFieldValue(`journey_stops.${index}.number_of_rooms`, 1);
                                                                                            setFieldValue(`journey_stops.${index}.number_of_floors`, 1);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="">Select service type</option>
                                                                                    {serviceTypes.map((type) => (
                                                                                        <option key={type.id} value={type.id}>
                                                                                            {type.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </Field>

                                                                                {stop.service_type && (
                                                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start">
                                                                                        <FontAwesomeIcon
                                                                                            icon={serviceTypes.find((t) => t.id === stop.service_type)?.icon || faInfoCircle}
                                                                                            className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2"
                                                                                        />
                                                                                        <div>
                                                                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                                                <strong>{serviceTypes.find((t) => t.id === stop.service_type)?.name}</strong>
                                                                                            </p>
                                                                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                                                {stop.service_type === 'house_removal' &&
                                                                                                    "We'll help move all items from your house to your new location."}
                                                                                                {stop.service_type === 'office_removal' &&
                                                                                                    "We'll relocate your office equipment and furniture efficiently."}
                                                                                                {stop.service_type === 'storage' && "We'll transport your items to our secure storage facilities."}
                                                                                                {stop.service_type === 'furniture' && "We'll carefully transport your furniture items."}
                                                                                                {stop.service_type === 'packing' && 'Our team will help pack your belongings professionally.'}
                                                                                                {stop.service_type === 'single_item' && "We'll transport individual items with care."}
                                                                                                {stop.service_type === 'fragile' && 'We specialize in safely moving delicate and fragile items.'}
                                                                                                {stop.service_type === 'heavy' && 'We have equipment to move heavy and bulky items safely.'}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {/* Service Details section */}
                                                                        <div className="mb-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => toggleServiceSection(index)}
                                                                                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors"
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                                                    Property & Service Details
                                                                                </div>
                                                                                <FontAwesomeIcon icon={expandedServiceSection[index] ? faChevronUp : faChevronDown} className="ml-2" />
                                                                            </button>

                                                                            {expandedServiceSection[index] && (
                                                                                <div className="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-750">
                                                                                    {/* Property Details */}
                                                                                    {(stop.type === 'pickup' && stop.service_type && requiresPropertyDetails(stop.service_type)) ||
                                                                                    (stop.type === 'dropoff' &&
                                                                                        values.journey_stops.some(
                                                                                            (s: any) => s.type === 'pickup' && s.service_type && requiresPropertyDetails(s.service_type)
                                                                                        )) ? (
                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                                            <div>
                                                                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                                                                                <Field
                                                                                                    as="select"
                                                                                                    name={`journey_stops.${index}.property_type`}
                                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                >
                                                                                                    {stop.service_type === 'office_removal' ? (
                                                                                                        <>
                                                                                                            <option value="office">Office</option>
                                                                                                            <option value="retail">Retail Space</option>
                                                                                                            <option value="industrial">Industrial Space</option>
                                                                                                            <option value="storage">Storage Unit</option>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        propertyTypes.map((type) => (
                                                                                                            <option key={type} value={type}>
                                                                                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                                                            </option>
                                                                                                        ))
                                                                                                    )}
                                                                                                </Field>
                                                                                            </div>

                                                                                            <div>
                                                                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Number of Rooms</label>
                                                                                                <Field
                                                                                                    type="number"
                                                                                                    name={`journey_stops.${index}.number_of_rooms`}
                                                                                                    min="1"
                                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                />
                                                                                            </div>

                                                                                            <div>
                                                                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Number of Floors</label>
                                                                                                <Field
                                                                                                    type="number"
                                                                                                    name={`journey_stops.${index}.number_of_floors`}
                                                                                                    min="1"
                                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="col-span-3">
                                                                                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                                                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                                                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                                                                                    {stop.type === 'pickup'
                                                                                                        ? 'Please select a service type that requires property details.'
                                                                                                        : "Property details aren't required for this stop type or based on the selected service."}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {['pickup', 'dropoff'].includes(stop.type) && (
                                                                                        <div className="space-y-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                                <div>
                                                                                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                                                                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                                                                        Dimensions (Optional)
                                                                                                    </label>
                                                                                                    <Field
                                                                                                        name={`journey_stops.${index}.dimensions`}
                                                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                        placeholder="L × W × H"
                                                                                                    />
                                                                                                </div>

                                                                                                <div>
                                                                                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Weight (Optional)</label>
                                                                                                    <Field
                                                                                                        name={`journey_stops.${index}.weight`}
                                                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                        placeholder="kg"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                                                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                                    <Field
                                                                                                        type="checkbox"
                                                                                                        name={`journey_stops.${index}.needs_disassembly`}
                                                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                                                                                    />
                                                                                                    <span className="ml-2">Needs Disassembly</span>
                                                                                                </label>

                                                                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                                    <Field
                                                                                                        type="checkbox"
                                                                                                        name={`journey_stops.${index}.is_fragile`}
                                                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                                                                                    />
                                                                                                    <span className="ml-2">Fragile Items</span>
                                                                                                </label>
                                                                                            </div>

                                                                                            <div className="mt-4">
                                                                                                {stop.needs_disassembly && (
                                                                                                    <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                                                                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-3" />
                                                                                                        <p className="text-blue-600 dark:text-blue-300">
                                                                                                            Some items will need to be disassembled before transport. Our team can help with this.
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Items section - different UI for each stop type */}
                                                                        {stop.type === 'pickup' && (
                                                                            <div className="mb-4">
                                                                                <div className="flex justify-between items-center mb-3">
                                                                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                                                        <FontAwesomeIcon icon={faBox} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                                                        Items to Pickup
                                                                                    </h4>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setShowCommonItems(index)}
                                                                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faCouch} className="mr-1.5" />
                                                                                        {showCommonItems === index ? 'Hide Common Items' : 'Show Common Items'}
                                                                                    </button>
                                                                                </div>

                                                                                {/* Common items modal - only for pickup points */}
                                                                                <CommonItemsModal
                                                                                    isOpen={showCommonItems === index}
                                                                                    onClose={() => setShowCommonItems(null)}
                                                                                    onSelectItem={(item) => {
                                                                                        addItemToPickup(index, {
                                                                                            ...item,
                                                                                            id: uuidv4(),
                                                                                        });
                                                                                        setShowCommonItems(null);
                                                                                    }}
                                                                                />

                                                                                {/* Full item management for pickup points */}
                                                                                <FieldArray
                                                                                    name={`journey_stops.${index}.items`}
                                                                                    render={(itemArrayHelpers) => (
                                                                                        <div>
                                                                                            {/* Existing items list with expandable details */}
                                                                                            {stop.items && stop.items.length > 0 ? (
                                                                                                <div className="space-y-3 mb-3">
                                                                                                    {stop.items.map((item: any, itemIndex: number) => (
                                                                                                        <div
                                                                                                            key={item.id || itemIndex}
                                                                                                            className={`border ${
                                                                                                                item.fragile
                                                                                                                    ? 'border-red-200 dark:border-red-800'
                                                                                                                    : item.needs_disassembly
                                                                                                                    ? 'border-purple-200 dark:border-purple-800'
                                                                                                                    : 'border-gray-200 dark:border-gray-700'
                                                                                                            } rounded-lg ${
                                                                                                                expandedItemIndex[index] === itemIndex
                                                                                                                    ? item.fragile
                                                                                                                        ? 'bg-red-50 dark:bg-red-900/20'
                                                                                                                        : item.needs_disassembly
                                                                                                                        ? 'bg-purple-50 dark:bg-purple-900/20'
                                                                                                                        : 'bg-gray-50 dark:bg-gray-750'
                                                                                                                    : 'bg-white dark:bg-gray-800'
                                                                                                            }`}
                                                                                                        >
                                                                                                            <div className="flex justify-between items-center p-3">
                                                                                                                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                                                                                    <FontAwesomeIcon
                                                                                                                        icon={getItemIcon(item.category || 'furniture').icon}
                                                                                                                        className={`mr-2 ${
                                                                                                                            item.fragile
                                                                                                                                ? 'text-red-600 dark:text-red-400'
                                                                                                                                : item.needs_disassembly
                                                                                                                                ? 'text-purple-600 dark:text-purple-400'
                                                                                                                                : 'text-blue-600 dark:text-blue-400'
                                                                                                                        }`}
                                                                                                                    />
                                                                                                                    {item.name || 'New Item'}
                                                                                                                    {item.quantity > 1 && (
                                                                                                                        <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                                                                                                            x{item.quantity}
                                                                                                                        </span>
                                                                                                                    )}

                                                                                                                    {/* Add visual indicators for item properties */}
                                                                                                                    {item.fragile && (
                                                                                                                        <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">
                                                                                                                            Fragile
                                                                                                                        </span>
                                                                                                                    )}
                                                                                                                    {item.needs_disassembly && (
                                                                                                                        <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
                                                                                                                            Disassembly
                                                                                                                        </span>
                                                                                                                    )}
                                                                                                                </h4>
                                                                                                                <div className="flex items-center space-x-3">
                                                                                                                    <button
                                                                                                                        type="button"
                                                                                                                        onClick={() => toggleItemExpansion(index, itemIndex)}
                                                                                                                        className={`text-gray-500 dark:text-gray-400 hover:${
                                                                                                                            item.fragile
                                                                                                                                ? 'text-red-500'
                                                                                                                                : item.needs_disassembly
                                                                                                                                ? 'text-purple-500'
                                                                                                                                : 'text-blue-500'
                                                                                                                        } p-1`}
                                                                                                                    >
                                                                                                                        <FontAwesomeIcon
                                                                                                                            icon={expandedItemIndex[index] === itemIndex ? faChevronUp : faChevronDown}
                                                                                                                        />
                                                                                                                    </button>
                                                                                                                    <button
                                                                                                                        type="button"
                                                                                                                        onClick={() => itemArrayHelpers.remove(itemIndex)}
                                                                                                                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 p-1"
                                                                                                                    >
                                                                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {expandedItemIndex[index] === itemIndex && (
                                                                                                                <div className="p-3 pt-0 border-t border-gray-200 dark:border-gray-700">
                                                                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                                                                                        <div>
                                                                                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                Item Name <span className="text-red-500">*</span>
                                                                                                                            </label>
                                                                                                                            <Field
                                                                                                                                name={`journey_stops.${index}.items.${itemIndex}.name`}
                                                                                                                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                                placeholder="e.g., Sofa, Dining Table, TV"
                                                                                                                            />
                                                                                                                        </div>

                                                                                                                        <div>
                                                                                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                Category
                                                                                                                            </label>
                                                                                                                            <Field
                                                                                                                                as="select"
                                                                                                                                name={`journey_stops.${index}.items.${itemIndex}.category`}
                                                                                                                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                            >
                                                                                                                                <option value="">Select category</option>
                                                                                                                                <option value="furniture">Furniture</option>
                                                                                                                                <option value="electronics">Electronics</option>
                                                                                                                                <option value="appliances">Appliances</option>
                                                                                                                                <option value="boxes">Boxes</option>
                                                                                                                                <option value="fragile">Fragile Items</option>
                                                                                                                                <option value="exercise">Exercise Equipment</option>
                                                                                                                                <option value="garden">Garden/Outdoor</option>
                                                                                                                                <option value="other">Other</option>
                                                                                                                            </Field>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                                                                                        <div>
                                                                                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                Quantity
                                                                                                                            </label>
                                                                                                                            <Field
                                                                                                                                type="number"
                                                                                                                                name={`journey_stops.${index}.items.${itemIndex}.quantity`}
                                                                                                                                min="1"
                                                                                                                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                            />
                                                                                                                        </div>

                                                                                                                        {/* Conditionally show weight based on service type */}
                                                                                                                        {(!stop.service_type ||
                                                                                                                            ['heavy', 'single_item', 'furniture'].includes(stop.service_type)) && (
                                                                                                                            <div>
                                                                                                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                    Weight{' '}
                                                                                                                                    {stop.service_type === 'heavy' && (
                                                                                                                                        <span className="text-red-500">*</span>
                                                                                                                                    )}
                                                                                                                                </label>
                                                                                                                                <Field
                                                                                                                                    name={`journey_stops.${index}.items.${itemIndex}.weight`}
                                                                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                                    placeholder="e.g., 50kg"
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                        )}

                                                                                                                        <div>
                                                                                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                Dimensions
                                                                                                                            </label>
                                                                                                                            <Field
                                                                                                                                name={`journey_stops.${index}.items.${itemIndex}.dimensions`}
                                                                                                                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                                placeholder="L × W × H"
                                                                                                                            />
                                                                                                                        </div>

                                                                                                                        {/* Conditionally show value based on service type */}
                                                                                                                        {(!stop.service_type ||
                                                                                                                            ['fragile', 'single_item'].includes(stop.service_type)) && (
                                                                                                                            <div>
                                                                                                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                    Value{' '}
                                                                                                                                    {stop.service_type === 'fragile' && (
                                                                                                                                        <span className="text-red-500">*</span>
                                                                                                                                    )}
                                                                                                                                </label>
                                                                                                                                <Field
                                                                                                                                    name={`journey_stops.${index}.items.${itemIndex}.value`}
                                                                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                                    placeholder="e.g., $500"
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                        )}
                                                                                                                    </div>

                                                                                                                    {/* Rest of the existing item fields */}
                                                                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                                                        <div className="space-y-2">
                                                                                                                            <div className="flex items-center">
                                                                                                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                                                                    <Field
                                                                                                                                        type="checkbox"
                                                                                                                                        name={`journey_stops.${index}.items.${itemIndex}.fragile`}
                                                                                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                                                                                                                    />
                                                                                                                                    <span className="ml-2">Fragile Item</span>
                                                                                                                                </label>
                                                                                                                            </div>

                                                                                                                            <div className="flex items-center">
                                                                                                                                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                                                                    <Field
                                                                                                                                        type="checkbox"
                                                                                                                                        name={`journey_stops.${index}.items.${itemIndex}.needs_disassembly`}
                                                                                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                                                                                                                    />
                                                                                                                                    <span className="ml-2">Needs Disassembly</span>
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div>
                                                                                                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                                Notes
                                                                                                                            </label>
                                                                                                                            <Field
                                                                                                                                as="textarea"
                                                                                                                                name={`journey_stops.${index}.items.${itemIndex}.notes`}
                                                                                                                                rows={2}
                                                                                                                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                                                                placeholder="Any specific notes about this item"
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-span-2 mt-4">
                                                                                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                                                                            Item Photo
                                                                                                                        </label>
                                                                                                                        <div className="mt-1 flex items-center">
                                                                                                                            {item.photo ? (
                                                                                                                                <div className="relative">
                                                                                                                                    <img
                                                                                                                                        src={
                                                                                                                                            typeof item.photo === 'string'
                                                                                                                                                ? item.photo
                                                                                                                                                : URL.createObjectURL(item.photo)
                                                                                                                                        }
                                                                                                                                        alt={item.name || 'Item preview'}
                                                                                                                                        className="h-24 w-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                                                                                                                    />
                                                                                                                                    <button
                                                                                                                                        type="button"
                                                                                                                                        onClick={() => {
                                                                                                                                            setFieldValue(
                                                                                                                                                `journey_stops.${index}.items.${itemIndex}.photo`,
                                                                                                                                                null
                                                                                                                                            );
                                                                                                                                        }}
                                                                                                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700"
                                                                                                                                    >
                                                                                                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                                                                                                    </button>
                                                                                                                                </div>
                                                                                                                            ) : (
                                                                                                                                <label className="flex items-center justify-center h-24 w-24 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors">
                                                                                                                                    <input
                                                                                                                                        type="file"
                                                                                                                                        accept="image/*"
                                                                                                                                        className="sr-only"
                                                                                                                                        onChange={(e) => {
                                                                                                                                            const file = e.currentTarget.files?.[0];
                                                                                                                                            if (file) {
                                                                                                                                                setFieldValue(
                                                                                                                                                    `journey_stops.${index}.items.${itemIndex}.photo`,
                                                                                                                                                    file
                                                                                                                                                );
                                                                                                                                            }
                                                                                                                                        }}
                                                                                                                                    />
                                                                                                                                    <div className="text-center">
                                                                                                                                        <FontAwesomeIcon
                                                                                                                                            icon={faCamera}
                                                                                                                                            className="text-gray-400 dark:text-gray-500 text-xl mb-1"
                                                                                                                                        />
                                                                                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                                                                            Add Photo
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </label>
                                                                                                                            )}

                                                                                                                            <div className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                                                                                                                                <p>Upload a photo of this item.</p>
                                                                                                                                <p>This helps our team prepare appropriately.</p>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-3">
                                                                                                    <FontAwesomeIcon icon={faBox} className="text-gray-400 text-2xl mb-2" />
                                                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">No items added yet.</p>
                                                                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                                                        Click "Add Custom Item" or "Show Common Items" to add items.
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}

                                                                                            {/* Add Custom Item button - only for pickup points */}
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    const newItem = {
                                                                                                        id: uuidv4(),
                                                                                                        name: '',
                                                                                                        category: 'furniture',
                                                                                                        quantity: 1,
                                                                                                        weight: '',
                                                                                                        dimensions: '',
                                                                                                        value: '',
                                                                                                        fragile: false,
                                                                                                        needs_disassembly: false,
                                                                                                        notes: '',
                                                                                                        photo: null,
                                                                                                    };

                                                                                                    itemArrayHelpers.push(newItem);

                                                                                                    // Expand the newly added item
                                                                                                    setTimeout(() => {
                                                                                                        const newItemIndex = stop.items?.length || 0;
                                                                                                        setExpandedItemIndex({
                                                                                                            ...expandedItemIndex,
                                                                                                            [index]: newItemIndex,
                                                                                                        });
                                                                                                    }, 100);
                                                                                                }}
                                                                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md flex items-center text-sm"
                                                                                            >
                                                                                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                                                                                Add Custom Item
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {/* Dropoff points - Select items from pickups */}
                                                                        {stop.type === 'dropoff' && (
                                                                            <div className="mb-4">
                                                                                <div className="flex justify-between items-center mb-3">
                                                                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                                                        <FontAwesomeIcon icon={faBox} className="mr-2 text-green-600 dark:text-green-400" />
                                                                                        Items to Dropoff
                                                                                    </h4>
                                                                                </div>

                                                                                {/* Select which items from pickup points should be dropped off here */}
                                                                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                                                    <div className="flex justify-between items-center mb-3">
                                                                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select items from pickup points:</h5>

                                                                                        {/* Add Select All checkbox */}
                                                                                        {values.journey_stops.filter((s) => s.type === 'pickup' && s.items && s.items.length > 0).length > 0 && (
                                                                                            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                                                                                                    checked={values.journey_stops
                                                                                                        .filter((s: any) => s.type === 'pickup')
                                                                                                        .flatMap((s: any) => s.items || [])
                                                                                                        .every((item: any) => (stop.linked_items || []).includes(item.id))}
                                                                                                    onChange={(e) => {
                                                                                                        const allPickupItemIds = values.journey_stops
                                                                                                            .filter((s: any) => s.type === 'pickup')
                                                                                                            .flatMap((s: any) => (s.items || []).map((item: any) => item.id));

                                                                                                        if (e.target.checked) {
                                                                                                            // Select all items
                                                                                                            setFieldValue(`journey_stops.${index}.linked_items`, allPickupItemIds);
                                                                                                        } else {
                                                                                                            // Deselect all items
                                                                                                            setFieldValue(`journey_stops.${index}.linked_items`, []);
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                                <span className="ml-2 font-medium text-green-700 dark:text-green-400">Select All Items</span>
                                                                                            </label>
                                                                                        )}
                                                                                    </div>

                                                                                    {values.journey_stops.filter((s) => s.type === 'pickup' && s.items && s.items.length > 0).length > 0 ? (
                                                                                        <div className="space-y-4">
                                                                                            {values.journey_stops
                                                                                                .filter((s: any) => s.type === 'pickup' && s.items && s.items.length > 0)
                                                                                                .map((pickupStop: any, pickupIdx: number) => (
                                                                                                    <div
                                                                                                        key={pickupStop.id}
                                                                                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-green-300 dark:hover:border-green-600 transition-colors"
                                                                                                    >
                                                                                                        <div className="flex justify-between items-center mb-2">
                                                                                                            <h6 className="font-medium text-gray-800 dark:text-gray-200">
                                                                                                                Pickup{' '}
                                                                                                                {String.fromCharCode(
                                                                                                                    65 + values.journey_stops.findIndex((s: any) => s.id === pickupStop.id)
                                                                                                                )}
                                                                                                                : {pickupStop.location || '(No address)'}
                                                                                                            </h6>

                                                                                                            {/* Add Select All for this pickup point */}
                                                                                                            <label className="flex items-center text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                                                                                                                <input
                                                                                                                    type="checkbox"
                                                                                                                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                                                                                                                    checked={pickupStop.items.every((item: any) =>
                                                                                                                        (stop.linked_items || []).includes(item.id)
                                                                                                                    )}
                                                                                                                    onChange={(e) => {
                                                                                                                        const pickupItemIds = pickupStop.items.map((item: any) => item.id);
                                                                                                                        const currentLinkedItems = stop.linked_items || [];

                                                                                                                        if (e.target.checked) {
                                                                                                                            // Add all items from this pickup
                                                                                                                            const newLinkedItems = [
                                                                                                                                ...new Set([...currentLinkedItems, ...pickupItemIds]),
                                                                                                                            ];
                                                                                                                            setFieldValue(`journey_stops.${index}.linked_items`, newLinkedItems);
                                                                                                                        } else {
                                                                                                                            // Remove all items from this pickup
                                                                                                                            const newLinkedItems = currentLinkedItems.filter(
                                                                                                                                (id: string) => !pickupItemIds.includes(id)
                                                                                                                            );
                                                                                                                            setFieldValue(`journey_stops.${index}.linked_items`, newLinkedItems);
                                                                                                                        }
                                                                                                                    }}
                                                                                                                />
                                                                                                                <span className="ml-2">Select All from this Pickup</span>
                                                                                                            </label>
                                                                                                        </div>

                                                                                                        <div className="space-y-2 pl-2">
                                                                                                            {pickupStop.items.map((item: any) => (
                                                                                                                <div key={item.id} className="flex items-center">
                                                                                                                    <Field
                                                                                                                        type="checkbox"
                                                                                                                        name={`journey_stops.${index}.linked_items`}
                                                                                                                        value={item.id}
                                                                                                                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                                                                                                                    />
                                                                                                                    <label className="ml-2 flex items-center">
                                                                                                                        <FontAwesomeIcon
                                                                                                                            icon={getItemIcon(item.category || 'furniture').icon}
                                                                                                                            className="mr-2 text-gray-500 dark:text-gray-400"
                                                                                                                        />
                                                                                                                        <span>
                                                                                                                            {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                                                                                                                        </span>
                                                                                                                    </label>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-center py-4">
                                                                                            <p className="text-sm text-gray-500 dark:text-gray-400">No items available from pickup points.</p>
                                                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add items to your pickup locations first.</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Intermediate stops - no item management */}
                                                                        {stop.type === 'stop' && (
                                                                            <div className="mb-4">
                                                                                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                                                        <FontAwesomeIcon icon={faBox} className="mr-2 text-orange-500 dark:text-orange-400" />
                                                                                        <p>
                                                                                            Intermediate stops don't have their own items. Items are collected at pickup points and delivered to dropoff
                                                                                            points.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
                                                                                <Field
                                                                                    as="textarea"
                                                                                    name={`journey_stops.${index}.instructions`}
                                                                                    rows={3}
                                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                    placeholder="Any specific instructions for this stop"
                                                                                />
                                                                            </div>

                                                                            <div className="space-y-4">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Time</label>
                                                                                    <Field
                                                                                        type="time"
                                                                                        name={`journey_stops.${index}.estimated_time`}
                                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                                    />
                                                                                </div>

                                                                                <div className="flex items-center">
                                                                                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                                        <Field
                                                                                            type="checkbox"
                                                                                            name={`journey_stops.${index}.has_elevator`}
                                                                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                                                                                        />
                                                                                        <span className="ml-2 flex items-center">
                                                                                            <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                                                                            Elevator Access
                                                                                        </span>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-6">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-4xl mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No stops added yet.</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">Add pickup, dropoff, and intermediate stops.</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newStop = {
                                            id: uuidv4(),
                                            type: 'pickup',
                                            location: '',
                                            unit_number: '',
                                            floor: 0,
                                            parking_info: '',
                                            has_elevator: false,
                                            instructions: '',
                                            estimated_time: '',
                                            property_type: 'house',
                                            number_of_rooms: 1,
                                            number_of_floors: 1,
                                            needs_disassembly: false,
                                            is_fragile: false,
                                            pickup_type: 'full_property',
                                            service_type: '',
                                            selected_rooms: [],
                                            other_rooms: '',
                                            items: [],
                                        };
                                        arrayHelpers.push(newStop);
                                        // Auto expand the newly added stop
                                        setTimeout(() => {
                                            setExpandedStopIndex(values.journey_stops?.length || 0);
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add Pickup
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const newStop = {
                                            id: uuidv4(),
                                            type: 'stop',
                                            location: '',
                                            unit_number: '',
                                            floor: 0,
                                            parking_info: '',
                                            has_elevator: false,
                                            instructions: '',
                                            estimated_time: '',
                                            property_type: 'house',
                                            number_of_rooms: 1,
                                            number_of_floors: 1,
                                        };
                                        arrayHelpers.push(newStop);
                                        // Auto expand the newly added stop
                                        setTimeout(() => {
                                            setExpandedStopIndex(values.journey_stops?.length || 0);
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center text-sm"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add Stop
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const newStop = {
                                            id: uuidv4(),
                                            type: 'dropoff',
                                            location: '',
                                            unit_number: '',
                                            floor: 0,
                                            parking_info: '',
                                            has_elevator: false,
                                            instructions: '',
                                            estimated_time: '',
                                            property_type: 'house',
                                            number_of_rooms: 1,
                                            number_of_floors: 1,
                                            needs_disassembly: false,
                                            is_fragile: false,
                                            dimensions: '',
                                            weight: '',
                                            linked_items: [], // Array to store item IDs from pickup points
                                            items: [], // Keep this for consistency, but we won't use it directly
                                        };
                                        arrayHelpers.push(newStop);
                                        // Auto expand the newly added stop
                                        setTimeout(() => {
                                            setExpandedStopIndex(values.journey_stops?.length || 0);
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center text-sm"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add Dropoff
                                </button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default JourneyPlanning;
