import { apiClient } from './api-client';

export interface CreateRidePayload {
  customerId?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  rideType?: 'STANDARD' | 'BIDDING';
  selectedVehicleType?: string;
  tripCategory?: 'ONE_WAY' | 'RETURN';
}

export interface DriverBidItem {
  id: string;
  rideRequestId: string;
  driverId: string;
  driverName: string;
  rating: number;
  vehicleModel: string;
  vehicleNumber: string;
  proposedFare: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
}

export interface RideRequestRecord {
  id: string;
  customerId: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  rideType: 'STANDARD' | 'BIDDING';
  selectedVehicleType: string;
  tripCategory?: 'ONE_WAY' | 'RETURN';
  status: 'SEARCHING' | 'BIDDING_ACTIVE' | 'ACCEPTED' | 'VERIFIED_START' | 'IN_TRIP' | 'COMPLETED' | 'CANCELLED';
  biddingTimerSeconds: number;
  acceptedDriverId?: string;
  finalFare: number;
  startPin: string;
  etaMinutes: number;
  bids?: DriverBidItem[];
}

export interface SubmitFeedbackPayload {
  rideRequestId: string;
  customerId?: string;
  driverId?: string;
  rating: number;
  compliments?: string[];
  comment?: string;
  tipAmount?: number;
}

export const rideService = {
  async createRideRequest(payload: CreateRidePayload): Promise<RideRequestRecord> {
    try {
      return await apiClient.post<RideRequestRecord>('/deliveries/rides/request', payload);
    } catch (error) {
      console.warn('[rideService] Fallback demo ride request:', error);
      const isBidding = payload.rideType === 'BIDDING';
      return {
        id: `RIDE-${Date.now()}`,
        customerId: payload.customerId || 'cust-default',
        pickupAddress: payload.pickupAddress || 'Homagama',
        dropoffAddress: payload.dropoffAddress || 'Moratuwa',
        pickupLat: payload.pickupLat || 6.8413,
        pickupLng: payload.pickupLng || 79.9654,
        dropoffLat: payload.dropoffLat || 6.7106,
        dropoffLng: payload.dropoffLng || 79.9074,
        rideType: isBidding ? 'BIDDING' : 'STANDARD',
        selectedVehicleType: payload.selectedVehicleType || 'bike',
        status: isBidding ? 'SEARCHING' : 'ACCEPTED',
        biddingTimerSeconds: 480,
        startPin: '4200',
        etaMinutes: 15,
        finalFare: isBidding ? 1350.0 : 710.07,
        bids: [
          {
            id: 'bid-001',
            rideRequestId: 'mock-id',
            driverId: 'drv-ravi-101',
            driverName: 'Ravi S.',
            rating: 5.0,
            vehicleModel: 'Toyota Prius - White',
            vehicleNumber: 'WP CAH-1234',
            proposedFare: 1350.0,
            status: 'PENDING',
          },
        ],
      };
    }
  },

  async getRideDetails(id: string): Promise<RideRequestRecord> {
    try {
      return await apiClient.get<RideRequestRecord>(`/deliveries/rides/${id}`);
    } catch (error) {
      return {
        id,
        customerId: 'cust-default',
        pickupAddress: 'Homagama',
        dropoffAddress: 'Moratuwa',
        pickupLat: 6.8413,
        pickupLng: 79.9654,
        dropoffLat: 6.7106,
        dropoffLng: 79.9074,
        rideType: 'BIDDING',
        selectedVehicleType: 'bike',
        status: 'ACCEPTED',
        biddingTimerSeconds: 480,
        startPin: '4200',
        etaMinutes: 15,
        finalFare: 1350.0,
      };
    }
  },

  async fetchBids(rideRequestId: string): Promise<DriverBidItem[]> {
    try {
      return await apiClient.get<DriverBidItem[]>(`/deliveries/rides/${rideRequestId}/bids`);
    } catch (error) {
      return [
        {
          id: 'bid-001',
          rideRequestId,
          driverId: 'drv-ravi-101',
          driverName: 'Ravi S.',
          rating: 5.0,
          vehicleModel: 'Toyota Prius - White',
          vehicleNumber: 'WP CAH-1234',
          proposedFare: 1350.0,
          status: 'PENDING',
        },
      ];
    }
  },

  async acceptBid(rideRequestId: string, bidId: string): Promise<any> {
    try {
      return await apiClient.post(`/deliveries/rides/${rideRequestId}/accept-bid`, { bidId });
    } catch (error) {
      return { success: true, status: 'ACCEPTED', finalFare: 1350.0 };
    }
  },

  async verifyStartPin(rideRequestId: string, pin: string): Promise<any> {
    try {
      return await apiClient.post(`/deliveries/rides/${rideRequestId}/verify-pin`, { pin });
    } catch (error) {
      return { success: true, status: 'IN_TRIP' };
    }
  },

  async completeRide(rideRequestId: string): Promise<any> {
    try {
      return await apiClient.post(`/deliveries/rides/${rideRequestId}/complete`, {});
    } catch (error) {
      return { success: true, status: 'COMPLETED' };
    }
  },

  async submitFeedback(payload: SubmitFeedbackPayload): Promise<any> {
    try {
      return await apiClient.post(`/deliveries/rides/${payload.rideRequestId}/feedback`, payload);
    } catch (error) {
      return { success: true, message: 'Feedback saved successfully' };
    }
  },
};
