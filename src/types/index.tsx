export interface Insurance {
    id?: string;
    name: string;
    description: string;
    sum_assured: number;
    monthly_premium_ghs: number;
    annual_premium_ghs: number;
    is_active: boolean;
    benefits: Benefit[];
}


interface Benefit {
    name: string;
    id: string;
    premium_payable: number;
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}


export type Permission = {
        id: string;
        name: string;
        resource_type: string;
        action: string;
        description: string;
        users: Array<{}>
    };

export type PermissionsResponse = {
        resource_type: string;
        permissions: Permission[];
    }[];



    export interface Notification {
        id: string;
        title: string;
        message: string;
        type: 'system' | 'booking' | 'payment' | 'alert' | 'reminder';
        read: boolean;
        createdAt: string;
        actionUrl?: string;
        bookingId?: string;
        metadata?: Record<string, any>;
      }


export interface ServiceRequest {
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    pickupLocation: string;
    dropoffLocation: string;
    itemType: string;
    itemSize: string;
    preferredDate: string;
    preferredTime: string;
    estimatedValue: string;
    description: string;
    pickupFloor: number;
    pickupUnitNumber: string;
    pickupParkingInfo: string;
    dropoffFloor: number;
    dropoffUnitNumber: string;
    dropoffParkingInfo: string;
    numberOfRooms: number;
    numberOfFloors: number;
    propertyType: 'house' | 'apartment' | 'office' | 'storage';
    hasElevator: boolean;
    dropoffPropertyType: 'house' | 'apartment' | 'office' | 'storage';
    dropoffNumberOfRooms: number;
    storageDuration?: string;
    vehicleType?: 'motorcycle' | 'car' | 'suv' | 'truck' | 'van';
    internationalDestination?: string;
    specialHandling?: string;
    isFlexible: boolean;
    needsInsurance: boolean;
    requestType: 'fixed' | 'bidding' | 'journey';
    photoURLs?: string[];
    inventoryList?: File;
    itemWeight?: string;
    itemDimensions?: string;
    needsDisassembly?: boolean;
    isFragile?: boolean;
    pickupNumberOfFloors: number;
    dropoffNumberOfFloors: number;
    pickupHasElevator: boolean;
    dropoffHasElevator: boolean;
    movingItems: Array<{
      name: string;
      category: string;
      quantity: number;
      weight: string;
      dimensions: string;
      value: string;
      fragile: boolean;
      needsDisassembly: boolean;
      notes: string;
      photo: File | string | null;
    }>;
    journeyStops?: Array<{
      id: string;
      type: 'pickup' | 'dropoff' | 'stop';
      location: string;
      unitNumber: string;
      floor: number;
      parkingInfo: string;
      hasElevator: boolean;
      instructions: string;
      estimatedTime: string;
    }>;
  }
  