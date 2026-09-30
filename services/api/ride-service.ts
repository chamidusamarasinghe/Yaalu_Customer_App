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
  fareAmount?: number | string;
  finalFare: number | string;
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

export interface CalculatedFareResponse {
  distanceKm: number;
  vehicleType: string;
  perKmRate: number;
  baseCharge: number;
  totalFare: number;
  commissionPercent: number;
  commissionAmount: number;
  riderNetEarnings: number;
  bidTimeoutMinutes: number;
  bidTimeoutSeconds: number;
}

export interface NearbyRiderItem {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  vehicleType: string;
  normalizedVehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  rating: number;
  deliveriesCompleted: number;
  currentLatitude: number;
  currentLongitude: number;
  distanceKm: number;
  etaMinutes: number;
  etaText: string;
}

export const rideService = {
  async getFareRates(): Promise<any[]> {
    return await apiClient.get('/deliveries/fare-rates');
  },

  async calculateFare(distanceKm: number, vehicleType?: string): Promise<CalculatedFareResponse> {
    return await apiClient.post<CalculatedFareResponse>('/deliveries/calculate-fare', { distanceKm, vehicleType });
  },

  async getNearbyRiders(params: { pickupLat?: number; pickupLng?: number; vehicleType?: string; radiusKm?: number }): Promise<NearbyRiderItem[]> {
    const query = new URLSearchParams();
    if (params.pickupLat !== undefined) query.append('pickupLat', String(params.pickupLat));
    if (params.pickupLng !== undefined) query.append('pickupLng', String(params.pickupLng));
    if (params.vehicleType) query.append('vehicleType', params.vehicleType);
    if (params.radiusKm !== undefined) query.append('radiusKm', String(params.radiusKm));
    return await apiClient.get<NearbyRiderItem[]>(`/deliveries/nearby-riders?${query.toString()}`);
  },

  async createRideRequest(payload: CreateRidePayload): Promise<RideRequestRecord> {
    const result = await apiClient.post<RideRequestRecord>('/deliveries/rides/request', payload);
    console.log('[rideService] Created real backend ride request:', result.id);
    return result;
  },

  async getRideDetails(id: string): Promise<RideRequestRecord> {
    return await apiClient.get<RideRequestRecord>(`/deliveries/rides/${id}`);
  },

  async fetchBids(rideRequestId: string): Promise<DriverBidItem[]> {
    return await apiClient.get<DriverBidItem[]>(`/deliveries/rides/${rideRequestId}/bids`);
  },

  async acceptBid(rideRequestId: string, bidId: string): Promise<any> {
    const res = await apiClient.post(`/deliveries/rides/${rideRequestId}/accept-bid`, { bidId });
    console.log('[rideService] Accepted bid on backend:', rideRequestId);
    return res;
  },

  async verifyStartPin(rideRequestId: string, pin: string): Promise<any> {
    const res = await apiClient.post(`/deliveries/rides/${rideRequestId}/verify-pin`, { pin });
    console.log('[rideService] Verified PIN on backend:', rideRequestId);
    return res;
  },

  async completeRide(rideRequestId: string): Promise<any> {
    const res = await apiClient.post(`/deliveries/rides/${rideRequestId}/complete`, {});
    console.log('[rideService] Completed ride on backend:', rideRequestId);
    return res;
  },

  async submitFeedback(payload: SubmitFeedbackPayload): Promise<any> {
    const res = await apiClient.post(`/deliveries/rides/${payload.rideRequestId}/feedback`, payload);
    console.log('[rideService] Submitted feedback on backend:', payload.rideRequestId);
    return res;
  },
};

