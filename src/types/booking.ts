export interface Provider {
    id: string;
    name: string;
    rating: number;
    vehicle_type: string;
    profile_picture?: string;
    phone_number?: string;
    email?: string;
}

export interface Bid {
    id: string;
    provider: Provider;
    amount: number;
    created_at: string;
    status: 'pending' | 'accepted' | 'rejected';
    notes?: string;
}

export interface Booking {
    id: string;
    tracking_number: string;
    created_at: string;
    request_type: 'instant' | 'scheduled';
    status: 'draft' | 'pending' | 'bidding' | 'accepted' | 'assigned' | 'in_transit' | 'completed' | 'cancelled' | 'confirmed';
    service_type: string;
    vehicle_type: string;
    persons_required: number;
    distance: number;
    estimated_travel_time: string;
    stops: JourneyStop[];
    items: Item[];
    special_instructions?: string;
    total_volume?: number;
    date: string;
    time: string;
    pickup_location: string;
    dropoff_location: string;
    amount: number;
    provider_name: string;
    provider_rating: number;
    item_size: string;
    booking_date: string;
    has_insurance: boolean;
    notes: string;
    allow_instant_booking?: boolean;
    booking_type?: 'instant' | 'auction' | 'standard';
    tracking_updates?: Array<{
        timestamp: string;
        message: string;
    }>;
    selected_provider?: Provider;
    bids?: Bid[];
    total_bids?: number;
    is_paid?: boolean;
    payment_due?: string;
}

export interface JourneyStop {
    id: string;
    type: 'pickup' | 'dropoff';
    address: string;
    contact_name: string;
    contact_phone: string;
    notes?: string;
}

export interface Item {
    id: string;
    name: string;
    quantity: number;
    dimensions: string;
    weight: number;
    needs_disassembly: boolean;
    fragile: boolean;
    special_instructions?: string;
}
