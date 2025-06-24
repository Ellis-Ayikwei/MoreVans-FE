import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useSWR from 'swr';
import axiosInstance from '../../helper/axiosInstance';
import fetcher from '../../helper/fetcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faCalendarAlt,
    faLocationDot,
    faMoneyBill,
    faSearch,
    faStar,
    faTruck,
    faFilter,
    faMapMarkedAlt,
    faExchangeAlt,
    faTag,
    faClock,
    faListAlt,
    faChevronDown,
    faChevronUp,
    faInfoCircle,
    faToolbox,
    faSortAmountUp,
    faSortAmountDown,
    faBell,
    faLayerGroup,
    faArrowRight,
    faBolt,
    faGavel,
    faRoute,
    faEye,
    faThumbsUp,
    faHeart,
    faHeartBroken,
    faAward,
    faSave,
    faBookmark,
    faSyncAlt,
    faExclamationCircle,
    faUser,
    faWeight,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import JobBoardHeader from './components/JobBoardHeader';
import { FilterState, Job } from './types';
import JobBoardList from './components/JobBoardList';
import JobBoardMap from './components/JobBoardMap';
import JobBoardGrid from './components/JobBoardGrid';
import JobBoardFilters from './components/JobBoardFilters';

const JobBoard: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        jobType: 'all',
        distance: null,
        minValue: null,
        maxValue: null,
        date: null,
        itemType: null,
        sortBy: 'date',
        sortDirection: 'desc',
    });
    const [activeTab, setActiveTab] = useState('all');

    const filtersRef = useRef<HTMLDivElement>(null);
    const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useSWR('/jobs/', fetcher);
    console.log('jobs', jobsData);

    // Setup debounced search
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setDebouncedSearchTerm(term);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        fetchJobs();

        // Load saved jobs from localStorage
        const savedJobsFromStorage = localStorage.getItem('savedJobs');
        if (savedJobsFromStorage) {
            setSavedJobs(JSON.parse(savedJobsFromStorage));
        }

        // Close filters when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (jobsData) {
            setJobs(jobsData);
            setLoading(false);
        } else if (jobsError) {
            setError('Failed to load jobs');
            setLoading(false);
        }
    }, [jobsData, jobsError]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockJobs: Job[] = [
                {
                    id: 'JOB-12345',
                    request: {
                        id: 'REQ-12345',
                        user: 'USER-12345',
                        driver: null,
                        request_type: 'instant',
                        status: 'open',
                        priority: 'high',
                        service_type: 'Residential Moving',
                        contact_name: 'John Smith',
                        contact_phone: '1234567890',
                        contact_email: 'john@example.com',
                        preferred_pickup_date: '2025-04-15',
                        preferred_pickup_time: '14:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: false,
                        estimated_completion_time: null,
                        items_description: 'Large sofa and coffee table, need careful handling',
                        total_weight: 200,
                        dimensions: '6ft x 4ft x 3ft',
                        requires_special_handling: false,
                        special_instructions: '',
                        moving_items: [
                            {
                                id: 'ITEM-1',
                                name: 'Sofa',
                                notes: 'Large 3-seater',
                                photo: null,
                                value: '1200',
                                weight: 150,
                                fragile: false,
                                category: 'furniture',
                                quantity: 1,
                                dimensions: '6ft x 4ft x 3ft',
                                category_id: 'CAT-1',
                                declared_value: '1200',
                                dimensions_width: '4ft',
                                dimensions_height: '3ft',
                                dimensions_length: '6ft',
                                needs_disassembly: true,
                                insurance_required: false,
                                special_instructions: '',
                                requires_special_handling: false,
                            },
                            {
                                id: 'ITEM-2',
                                name: 'Coffee Table',
                                notes: 'Glass top',
                                photo: null,
                                value: '300',
                                weight: 50,
                                fragile: true,
                                category: 'furniture',
                                quantity: 1,
                                dimensions: '3ft x 2ft x 1.5ft',
                                category_id: 'CAT-1',
                                declared_value: '300',
                                dimensions_width: '2ft',
                                dimensions_height: '1.5ft',
                                dimensions_length: '3ft',
                                needs_disassembly: false,
                                insurance_required: true,
                                special_instructions: 'Handle with care - glass top',
                                requires_special_handling: true,
                            },
                        ],
                        photo_urls: [],
                        base_price: '120.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12345',
                        insurance_required: true,
                        insurance_value: 1500,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'standard',
                        estimated_distance: 3.2,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 80,
                            staff_cost: 20,
                            property_cost: 20,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-1',
                                type: 'pickup',
                                address: '123 Main St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'apartment',
                                number_of_rooms: 2,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-2',
                                type: 'dropoff',
                                address: '456 Park Ave, London, UK',
                                unit_number: '4B',
                                floor: 4,
                                has_elevator: true,
                                parking_info: 'Underground parking available',
                                instructions: 'Use service elevator',
                                estimated_time: null,
                                property_type: 'apartment',
                                number_of_rooms: 2,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        updated_at: new Date(Date.now() - 3600000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'open',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    updated_at: new Date(Date.now() - 3600000).toISOString(),
                    bidding_end_time: null,
                    minimum_bid: '63.00',
                    preferred_vehicle_types: null,
                    required_qualifications: null,
                    notes: '',
                    time_remaining: null,
                },
                {
                    id: 'JOB-12346',
                    request: {
                        id: 'REQ-12346',
                        user: 'USER-12346',
                        driver: null,
                        request_type: 'auction',
                        status: 'bidding',
                        priority: 'normal',
                        service_type: 'Office Moving',
                        contact_name: 'Emily Johnson',
                        contact_phone: '2345678901',
                        contact_email: 'emily@example.com',
                        preferred_pickup_date: '2025-04-20',
                        preferred_pickup_time: '10:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: false,
                        estimated_completion_time: null,
                        items_description: 'Computer equipment including monitors and desktop PCs',
                        total_weight: 150,
                        dimensions: 'Various sizes',
                        requires_special_handling: true,
                        special_instructions: 'Handle with care - sensitive equipment',
                        moving_items: [
                            {
                                id: 'ITEM-3',
                                name: 'Desktop PC',
                                notes: 'High-end workstation',
                                photo: null,
                                value: '2000',
                                weight: 20,
                                fragile: true,
                                category: 'electronics',
                                quantity: 1,
                                dimensions: '18in x 8in x 18in',
                                category_id: 'CAT-2',
                                declared_value: '2000',
                                dimensions_width: '8in',
                                dimensions_height: '18in',
                                dimensions_length: '18in',
                                needs_disassembly: false,
                                insurance_required: true,
                                special_instructions: 'Handle with care - sensitive equipment',
                                requires_special_handling: true,
                            },
                        ],
                        photo_urls: [],
                        base_price: '200.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12346',
                        insurance_required: true,
                        insurance_value: 2000,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'premium',
                        estimated_distance: 5.7,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 150,
                            staff_cost: 30,
                            property_cost: 20,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-3',
                                type: 'pickup',
                                address: '78 Oxford Street, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-4',
                                type: 'dropoff',
                                address: '23 Camden High St, London, UK',
                                unit_number: 'Suite 5',
                                floor: 2,
                                has_elevator: true,
                                parking_info: 'Loading dock available',
                                instructions: 'Use loading dock entrance',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        updated_at: new Date(Date.now() - 86400000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'bidding',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    updated_at: new Date(Date.now() - 86400000).toISOString(),
                    bidding_end_time: new Date(Date.now() + 86400000).toISOString(),
                    minimum_bid: '150.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: ['electronics_handling'],
                    notes: 'Sensitive equipment - handle with care',
                    time_remaining: '24h',
                },
                {
                    id: 'JOB-12347',
                    request: {
                        id: 'REQ-12347',
                        user: 'USER-12347',
                        driver: null,
                        request_type: 'journey',
                        status: 'open',
                        priority: 'low',
                        service_type: 'Multi-Stop Moving',
                        contact_name: 'Michael Brown',
                        contact_phone: '3456789012',
                        contact_email: 'michael@example.com',
                        preferred_pickup_date: '2025-04-25',
                        preferred_pickup_time: '09:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: true,
                        estimated_completion_time: null,
                        items_description: 'Office furniture and equipment',
                        total_weight: 500,
                        dimensions: 'Various sizes',
                        requires_special_handling: false,
                        special_instructions: '',
                        moving_items: [
                            {
                                id: 'ITEM-4',
                                name: 'Office Chair',
                                notes: 'Ergonomic',
                                photo: null,
                                value: '300',
                                weight: 25,
                                fragile: false,
                                category: 'furniture',
                                quantity: 1,
                                dimensions: '24in x 24in x 40in',
                                category_id: 'CAT-1',
                                declared_value: '300',
                                dimensions_width: '24in',
                                dimensions_height: '40in',
                                dimensions_length: '24in',
                                needs_disassembly: false,
                                insurance_required: false,
                                special_instructions: '',
                                requires_special_handling: false,
                            },
                        ],
                        photo_urls: [],
                        base_price: '300.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12347',
                        insurance_required: false,
                        insurance_value: null,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'standard',
                        estimated_distance: 12.5,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 200,
                            staff_cost: 50,
                            property_cost: 50,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-5',
                                type: 'pickup',
                                address: '12 Regent St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-6',
                                type: 'dropoff',
                                address: '45 Piccadilly, London, UK',
                                unit_number: 'Floor 3',
                                floor: 3,
                                has_elevator: true,
                                parking_info: 'Loading bay available',
                                instructions: 'Use service entrance',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 172800000).toISOString(),
                        updated_at: new Date(Date.now() - 172800000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'open',
                    created_at: new Date(Date.now() - 172800000).toISOString(),
                    updated_at: new Date(Date.now() - 172800000).toISOString(),
                    bidding_end_time: null,
                    minimum_bid: '150.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: null,
                    notes: '',
                    time_remaining: null,
                },
                {
                    id: 'JOB-12348',
                    request: {
                        id: 'REQ-12348',
                        user: 'USER-12348',
                        driver: null,
                        request_type: 'instant',
                        status: 'open',
                        priority: 'normal',
                        service_type: 'Residential Moving',
                        contact_name: 'Sarah Wilson',
                        contact_phone: '4567890123',
                        contact_email: 'sarah@example.com',
                        preferred_pickup_date: '2025-04-22',
                        preferred_pickup_time: '13:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: false,
                        estimated_completion_time: null,
                        items_description: 'Household items and furniture',
                        total_weight: 800,
                        dimensions: 'Various sizes',
                        requires_special_handling: false,
                        special_instructions: '',
                        moving_items: [
                            {
                                id: 'ITEM-5',
                                name: 'Dining Table',
                                notes: '6-seater',
                                photo: null,
                                value: '800',
                                weight: 100,
                                fragile: false,
                                category: 'furniture',
                                quantity: 1,
                                dimensions: '72in x 36in x 30in',
                                category_id: 'CAT-1',
                                declared_value: '800',
                                dimensions_width: '36in',
                                dimensions_height: '30in',
                                dimensions_length: '72in',
                                needs_disassembly: true,
                                insurance_required: false,
                                special_instructions: '',
                                requires_special_handling: false,
                            },
                        ],
                        photo_urls: [],
                        base_price: '400.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12348',
                        insurance_required: false,
                        insurance_value: null,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'standard',
                        estimated_distance: 8.2,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 300,
                            staff_cost: 50,
                            property_cost: 50,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-7',
                                type: 'pickup',
                                address: '34 Baker St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'house',
                                number_of_rooms: 3,
                                number_of_floors: 2,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-8',
                                type: 'dropoff',
                                address: '67 Marylebone High St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'house',
                                number_of_rooms: 3,
                                number_of_floors: 2,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 259200000).toISOString(),
                        updated_at: new Date(Date.now() - 259200000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'open',
                    created_at: new Date(Date.now() - 259200000).toISOString(),
                    updated_at: new Date(Date.now() - 259200000).toISOString(),
                    bidding_end_time: null,
                    minimum_bid: '200.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: null,
                    notes: '',
                    time_remaining: null,
                },
                {
                    id: 'JOB-12349',
                    request: {
                        id: 'REQ-12349',
                        user: 'USER-12349',
                        driver: null,
                        request_type: 'auction',
                        status: 'bidding',
                        priority: 'high',
                        service_type: 'Commercial Moving',
                        contact_name: 'David Lee',
                        contact_phone: '5678901234',
                        contact_email: 'david@example.com',
                        preferred_pickup_date: '2025-04-28',
                        preferred_pickup_time: '08:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: false,
                        estimated_completion_time: null,
                        items_description: 'Office equipment and furniture',
                        total_weight: 1200,
                        dimensions: 'Various sizes',
                        requires_special_handling: true,
                        special_instructions: 'Handle with care - expensive equipment',
                        moving_items: [
                            {
                                id: 'ITEM-6',
                                name: 'Server Rack',
                                notes: 'Full height',
                                photo: null,
                                value: '5000',
                                weight: 300,
                                fragile: true,
                                category: 'electronics',
                                quantity: 1,
                                dimensions: '42U x 24in x 36in',
                                category_id: 'CAT-2',
                                declared_value: '5000',
                                dimensions_width: '24in',
                                dimensions_height: '42U',
                                dimensions_length: '36in',
                                needs_disassembly: true,
                                insurance_required: true,
                                special_instructions: 'Handle with extreme care',
                                requires_special_handling: true,
                            },
                        ],
                        photo_urls: [],
                        base_price: '600.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12349',
                        insurance_required: true,
                        insurance_value: 5000,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'premium',
                        estimated_distance: 15.3,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 400,
                            staff_cost: 100,
                            property_cost: 100,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-9',
                                type: 'pickup',
                                address: '89 Fleet St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-10',
                                type: 'dropoff',
                                address: '23 Holborn Viaduct, London, UK',
                                unit_number: 'Floor 5',
                                floor: 5,
                                has_elevator: true,
                                parking_info: 'Loading dock available',
                                instructions: 'Use service elevator',
                                estimated_time: null,
                                property_type: 'office',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 345600000).toISOString(),
                        updated_at: new Date(Date.now() - 345600000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'bidding',
                    created_at: new Date(Date.now() - 345600000).toISOString(),
                    updated_at: new Date(Date.now() - 345600000).toISOString(),
                    bidding_end_time: new Date(Date.now() + 172800000).toISOString(),
                    minimum_bid: '300.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: ['electronics_handling'],
                    notes: 'High-value equipment - requires special handling',
                    time_remaining: '48h',
                },
                {
                    id: 'JOB-12350',
                    request: {
                        id: 'REQ-12350',
                        user: 'USER-12350',
                        driver: null,
                        request_type: 'journey',
                        status: 'open',
                        priority: 'normal',
                        service_type: 'Retail Delivery',
                        contact_name: 'Rachel Green',
                        contact_phone: '6789012345',
                        contact_email: 'rachel@example.com',
                        preferred_pickup_date: '2025-05-01',
                        preferred_pickup_time: '09:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: true,
                        estimated_completion_time: null,
                        items_description: 'Multiple retail store deliveries',
                        total_weight: 600,
                        dimensions: 'Various sizes',
                        requires_special_handling: false,
                        special_instructions: '',
                        moving_items: [
                            {
                                id: 'ITEM-7',
                                name: 'Clothing Racks',
                                notes: 'Retail display units',
                                photo: null,
                                value: '1000',
                                weight: 50,
                                fragile: false,
                                category: 'retail',
                                quantity: 4,
                                dimensions: '60in x 24in x 72in',
                                category_id: 'CAT-3',
                                declared_value: '1000',
                                dimensions_width: '24in',
                                dimensions_height: '72in',
                                dimensions_length: '60in',
                                needs_disassembly: true,
                                insurance_required: false,
                                special_instructions: '',
                                requires_special_handling: false,
                            },
                        ],
                        photo_urls: [],
                        base_price: '500.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12350',
                        insurance_required: false,
                        insurance_value: null,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'standard',
                        estimated_distance: 20.5,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 350,
                            staff_cost: 75,
                            property_cost: 75,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-11',
                                type: 'pickup',
                                address: '45 Oxford St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'retail',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-12',
                                type: 'dropoff',
                                address: '78 Bond St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'retail',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                        ],
                        created_at: new Date(Date.now() - 432000000).toISOString(),
                        updated_at: new Date(Date.now() - 432000000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'open',
                    created_at: new Date(Date.now() - 432000000).toISOString(),
                    updated_at: new Date(Date.now() - 432000000).toISOString(),
                    bidding_end_time: null,
                    minimum_bid: '250.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: null,
                    notes: '',
                    time_remaining: null,
                },
                {
                    id: 'JOB-12351',
                    request: {
                        id: 'REQ-12351',
                        user: 'USER-12351',
                        driver: null,
                        request_type: 'journey',
                        status: 'open',
                        priority: 'high',
                        service_type: 'Multi-Stop Delivery',
                        contact_name: 'London Retail Co.',
                        contact_phone: '7890123456',
                        contact_email: 'operations@londonretail.com',
                        preferred_pickup_date: '2025-05-05',
                        preferred_pickup_time: '07:00',
                        preferred_pickup_time_window: null,
                        preferred_delivery_date: null,
                        preferred_delivery_time: null,
                        is_flexible: false,
                        estimated_completion_time: null,
                        items_description: 'Multiple retail store deliveries',
                        total_weight: 300,
                        dimensions: 'Various sizes',
                        requires_special_handling: false,
                        special_instructions: '',
                        moving_items: [
                            {
                                id: 'ITEM-8',
                                name: 'Retail Boxes',
                                notes: 'Mixed merchandise',
                                photo: null,
                                value: '5000',
                                weight: 20,
                                fragile: false,
                                category: 'retail',
                                quantity: 15,
                                dimensions: '24in x 24in x 24in',
                                category_id: 'CAT-3',
                                declared_value: '5000',
                                dimensions_width: '24in',
                                dimensions_height: '24in',
                                dimensions_length: '24in',
                                needs_disassembly: false,
                                insurance_required: true,
                                special_instructions: '',
                                requires_special_handling: false,
                            },
                        ],
                        photo_urls: [],
                        base_price: '350.00',
                        final_price: null,
                        price_factors: null,
                        tracking_number: 'MV-12351',
                        insurance_required: true,
                        insurance_value: 5000,
                        payment_status: 'pending',
                        cancellation_reason: '',
                        cancellation_time: null,
                        cancellation_fee: null,
                        service_level: 'express',
                        estimated_distance: 25.8,
                        route_waypoints: null,
                        loading_time: null,
                        unloading_time: null,
                        price_breakdown: {
                            base_price: 250,
                            staff_cost: 50,
                            property_cost: 50,
                            service_level_cost: 0,
                        },
                        items: [],
                        all_locations: [
                            {
                                id: 'LOC-13',
                                type: 'pickup',
                                address: '10 Downing St, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'warehouse',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 0,
                            },
                            {
                                id: 'LOC-14',
                                type: 'dropoff',
                                address: '20 Charing Cross Rd, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'retail',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 1,
                            },
                            {
                                id: 'LOC-15',
                                type: 'dropoff',
                                address: '30 Leicester Square, London, UK',
                                unit_number: '',
                                floor: 0,
                                has_elevator: false,
                                parking_info: '',
                                instructions: '',
                                estimated_time: null,
                                property_type: 'retail',
                                number_of_rooms: 1,
                                number_of_floors: 1,
                                service_type: null,
                                sequence: 2,
                            },
                        ],
                        created_at: new Date(Date.now() - 518400000).toISOString(),
                        updated_at: new Date(Date.now() - 518400000).toISOString(),
                        stops: [],
                        milestones: [],
                        journey_stops: [],
                    },
                    status: 'open',
                    created_at: new Date(Date.now() - 518400000).toISOString(),
                    updated_at: new Date(Date.now() - 518400000).toISOString(),
                    bidding_end_time: null,
                    minimum_bid: '200.00',
                    preferred_vehicle_types: ['van'],
                    required_qualifications: null,
                    notes: '',
                    time_remaining: null,
                },
            ];

            // setJobs(mockJobs);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load jobs. Please try again.');
            setLoading(false);
        }
    };

    const toggleSaveJob = (jobId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const updatedSavedJobs = savedJobs.includes(jobId) ? savedJobs?.filter((id) => id !== jobId) : [...savedJobs, jobId];

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    };

    const handleJobCardClick = (job: Job) => {
        navigate(`/provider/job/${job.id}`);
    };

    // Apply all filters and search
    const filteredJobs = React.useMemo(() => {
        let filtered = jobs.filter((job) => {
            // Tab filter
            if (activeTab !== 'all') {
                if (activeTab === 'recommended') {
                    // TODO: Implement recommended jobs logic
                    return false;
                }
                if (job.request.request_type !== activeTab) {
                    return false;
                }
            }

            // Search term filter
            if (debouncedSearchTerm) {
                const searchLower = debouncedSearchTerm.toLowerCase();
                const matchesSearch =
                    job.id.toLowerCase().includes(searchLower) ||
                    job.request.tracking_number.toLowerCase().includes(searchLower) ||
                    job.request.contact_name.toLowerCase().includes(searchLower) ||
                    job.request.items_description.toLowerCase().includes(searchLower) ||
                    job.request.service_type.toLowerCase().includes(searchLower) ||
                    job.request.all_locations.some((location) => location.address.toLowerCase().includes(searchLower)) ||
                    job.request.moving_items.some((item) => item.name.toLowerCase().includes(searchLower) || item.category.toLowerCase().includes(searchLower));

                if (!matchesSearch) return false;
            }

            // Job type filter (from filters panel)
            if (filters.jobType !== 'all' && job.request.request_type !== filters.jobType) {
                return false;
            }

            // Distance filter
            if (filters.distance !== null && job.request.estimated_distance && job.request.estimated_distance > filters.distance) {
                return false;
            }

            // Value range filter
            const jobValue = parseFloat(job.request.base_price);
            if (filters.minValue !== null && jobValue < filters.minValue) {
                return false;
            }
            if (filters.maxValue !== null && jobValue > filters.maxValue) {
                return false;
            }

            // Date filter
            if (filters.date !== null && job.request.preferred_pickup_date) {
                const jobDate = new Date(job.request.preferred_pickup_date).toISOString().split('T')[0];
                if (jobDate !== filters.date) {
                    return false;
                }
            }

            // Item type filter
            if (filters.itemType !== null) {
                const hasMatchingItem = job.request.moving_items.some((item) => item.category.toLowerCase() === filters.itemType?.toLowerCase());
                if (!hasMatchingItem) return false;
            }

            return true;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const direction = filters.sortDirection === 'asc' ? 1 : -1;

            switch (filters.sortBy) {
                case 'date':
                    return direction * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                case 'value':
                    return direction * (parseFloat(b.request.base_price) - parseFloat(a.request.base_price));
                case 'distance':
                    return direction * ((b.request.estimated_distance || 0) - (a.request.estimated_distance || 0));
                case 'urgency':
                    const priorityMap: { [key: string]: number } = { high: 3, normal: 2, low: 1 };
                    return direction * ((priorityMap[b.request.priority] || 0) - (priorityMap[a.request.priority] || 0));
                default:
                    return 0;
            }
        });

        return filtered;
    }, [jobs, debouncedSearchTerm, filters, activeTab]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="mx-auto px-4 sm:px-6 py-8">
                <JobBoardHeader jobs={jobs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="relative flex-grow max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by location, item type, customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="Grid View"
                                >
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="List View"
                                >
                                    <FontAwesomeIcon icon={faListAlt} />
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`p-2 rounded-md ${
                                        viewMode === 'map'
                                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                    title="Map View"
                                >
                                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                    showFilters
                                        ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                                        : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={faFilter} />
                                <span>Filters</span>
                                <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {showFilters && <JobBoardFilters filters={filters} setFilters={setFilters} filtersRef={filtersRef} />}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{loading ? 'Loading jobs...' : `Found ${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'}`}</div>

                    {viewMode !== 'map' && filteredJobs.length > 0 && (
                        <button className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" onClick={() => fetchJobs()}>
                            <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                                <div className="h-20 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-5">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md flex items-start">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mt-1 mr-3" />
                        <div>
                            <h3 className="font-medium">Error loading jobs</h3>
                            <p className="mt-1">{error}</p>
                            <button
                                onClick={fetchJobs}
                                className="mt-3 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faSearch} className="text-blue-500 text-2xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                            {debouncedSearchTerm || Object.values(filters).some((value) => value !== null && value !== 'all')
                                ? "We couldn't find any jobs matching your filters. Try adjusting your search criteria."
                                : 'There are no available jobs at the moment. Check back later or adjust your search parameters.'}
                        </p>
                        {(debouncedSearchTerm || Object.values(filters).some((value) => value !== null && value !== 'all')) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({
                                        jobType: 'all',
                                        distance: null,
                                        minValue: null,
                                        maxValue: null,
                                        date: null,
                                        itemType: null,
                                        sortBy: 'date',
                                        sortDirection: 'desc',
                                    });
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <JobBoardGrid jobs={filteredJobs} savedJobs={savedJobs} onJobClick={handleJobCardClick} onSaveJob={toggleSaveJob} />
                ) : viewMode === 'list' ? (
                    <JobBoardList jobs={filteredJobs} savedJobs={savedJobs} onJobClick={handleJobCardClick} onSaveJob={toggleSaveJob} />
                ) : (
                    <JobBoardMap />
                )}
            </div>
        </div>
    );
};

export default JobBoard;
