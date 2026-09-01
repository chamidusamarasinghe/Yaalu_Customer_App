import { apiClient } from './api-client';

export interface BookRidePayload {
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType?: string;
  estimatedFare: number;
}

export interface RideRecord {
  id: string;
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedFare: number;
  status: string;
  driverName?: string;
  driverPhone?: string;
  createdAt?: string;
}

export const rideService = {
  async bookRide(payload: BookRidePayload): Promise<RideRecord> {
    try {
      return await apiClient.post<RideRecord>('/deliveries/book', payload);
    } catch (error) {
      console.warn('[rideService] Falling back to local ride booking for demo:', error);
      return {
        id: `RIDE-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: payload.userId,
        pickupLocation: payload.pickupLocation,
        dropoffLocation: payload.dropoffLocation,
        estimatedFare: payload.estimatedFare,
        status: 'SEARCHING_DRIVER',
        driverName: 'Ravi K.',
        driverPhone: '077 123 4567',
        createdAt: new Date().toISOString(),
      };
    }
  },

  async getRideStatus(id: string): Promise<RideRecord> {
    try {
      return await apiClient.get<RideRecord>(`/deliveries/${id}/status`);
    } catch (error) {
      console.warn(`[rideService] Fallback for ride ${id}:`, error);
      return {
        id,
        userId: 'a1a1a1a1-1111-1111-1111-a1a1a1a1a1a1',
        pickupLocation: 'Your Location',
        dropoffLocation: 'Moratuwa',
        estimatedFare: 710.07,
        status: 'IN_TRIP',
        driverName: 'Sampath Krishantha',
        driverPhone: '077 987 6543',
        createdAt: new Date().toISOString(),
      };
    }
  },
};
