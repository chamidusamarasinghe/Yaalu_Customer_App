export interface OSMLocationResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export interface OSMRouteResult {
  routes: Array<{
    distance: number; // in meters
    duration: number; // in seconds
    geometry: {
      coordinates: Array<[number, number]>; // [lon, lat]
      type: string;
    };
  }>;
}

/**
 * Search locations using OpenStreetMap Nominatim API
 */
export async function searchOSMLocation(query: string): Promise<OSMLocationResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YaaluCustomerApp/1.0',
      },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error searching OpenStreetMap location:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to human-readable address using OpenStreetMap Nominatim API
 */
export async function reverseOSMGeocode(lat: number, lng: number): Promise<OSMLocationResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YaaluCustomerApp/1.0',
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error reverse geocoding OpenStreetMap location:', error);
    return null;
  }
}

/**
 * Get route polylines & duration between origin and destination using OSRM API
 */
export async function getOSMRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<OSMRouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching OpenStreetMap route:', error);
    return null;
  }
}
