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

export const SRI_LANKA_CITIES: Record<string, { lat: number; lng: number }> = {
  // Western Province
  colombo: { lat: 6.9271, lng: 79.8612 },
  nugegoda: { lat: 6.8726, lng: 79.8886 },
  maharagama: { lat: 6.8480, lng: 79.9265 },
  kottawa: { lat: 6.8413, lng: 79.9654 },
  homagama: { lat: 6.8433, lng: 80.0031 },
  moratuwa: { lat: 6.7730, lng: 79.8816 },
  dehiwala: { lat: 6.8517, lng: 79.8660 },
  'mount lavinia': { lat: 6.8301, lng: 79.8654 },
  ratmalana: { lat: 6.8164, lng: 79.8804 },
  bambalapitiya: { lat: 6.8886, lng: 79.8587 },
  wellawatte: { lat: 6.8744, lng: 79.8610 },
  kollupitiya: { lat: 6.9100, lng: 79.8517 },
  'galle face': { lat: 6.9271, lng: 79.8450 },
  fort: { lat: 6.9344, lng: 79.8428 },
  pettah: { lat: 6.9380, lng: 79.8530 },
  battaramulla: { lat: 6.8983, lng: 79.9224 },
  malabe: { lat: 6.9061, lng: 79.9686 },
  kaduwela: { lat: 6.9345, lng: 79.9840 },
  rajagiriya: { lat: 6.9094, lng: 79.8920 },
  borella: { lat: 6.9147, lng: 79.8778 },
  nawala: { lat: 6.8860, lng: 79.8950 },
  pelawatte: { lat: 6.8920, lng: 79.9320 },
  thalawathugoda: { lat: 6.8760, lng: 79.9480 },
  pannipitiya: { lat: 6.8470, lng: 79.9530 },
  godagama: { lat: 6.8460, lng: 80.0150 },
  padukka: { lat: 6.8533, lng: 80.1017 },
  hanwella: { lat: 6.9022, lng: 80.0864 },
  avissawella: { lat: 6.9531, lng: 80.2070 },
  gampaha: { lat: 7.0840, lng: 79.9925 },
  pasyala: { lat: 7.1419, lng: 80.1263 },
  nittambuwa: { lat: 7.1436, lng: 80.0994 },
  veyangoda: { lat: 7.1558, lng: 80.0630 },
  mirigama: { lat: 7.2435, lng: 80.1264 },
  warakapola: { lat: 7.2253, lng: 80.1974 },
  ambepussa: { lat: 7.2660, lng: 80.1980 },
  kegalle: { lat: 7.2513, lng: 80.3464 },
  mawanella: { lat: 7.2520, lng: 80.4468 },
  kadugannawa: { lat: 7.2547, lng: 80.5284 },
  minuwangoda: { lat: 7.1678, lng: 79.9542 },
  divulapitiya: { lat: 7.2117, lng: 80.0150 },
  katunayake: { lat: 7.1706, lng: 79.8864 },
  seeduwa: { lat: 7.1264, lng: 79.8870 },
  ragama: { lat: 7.0274, lng: 79.9198 },
  kandana: { lat: 7.0467, lng: 79.8978 },
  ganemulla: { lat: 7.0674, lng: 79.9576 },
  biyagama: { lat: 6.9583, lng: 79.9917 },
  delgoda: { lat: 6.9744, lng: 80.0078 },
  pugoda: { lat: 6.9689, lng: 80.1214 },
  dompe: { lat: 6.9583, lng: 80.0520 },
  negombo: { lat: 7.2008, lng: 79.8737 },
  wattala: { lat: 6.9890, lng: 79.8920 },
  'ja-ela': { lat: 7.0750, lng: 79.8910 },
  kadawatha: { lat: 7.0010, lng: 79.9510 },
  kiribathgoda: { lat: 6.9800, lng: 79.9290 },
  kelaniya: { lat: 6.9583, lng: 79.9194 },
  kalutara: { lat: 6.5854, lng: 79.9607 },
  panadura: { lat: 6.7130, lng: 79.9074 },
  horana: { lat: 6.7150, lng: 80.0630 },
  matugama: { lat: 6.5230, lng: 80.1140 },
  aluthgama: { lat: 6.4340, lng: 79.9990 },
  piliyandala: { lat: 6.8017, lng: 79.9228 },
  kesbewa: { lat: 6.7890, lng: 79.9430 },

  // Southern Province
  galle: { lat: 6.0535, lng: 80.2210 },
  matara: { lat: 5.9549, lng: 80.5550 },
  hambantota: { lat: 6.1246, lng: 81.1185 },
  hikkaduwa: { lat: 6.1390, lng: 80.1010 },
  unawatuna: { lat: 6.0100, lng: 80.2490 },
  weligama: { lat: 5.9730, lng: 80.4280 },
  mirissa: { lat: 5.9480, lng: 80.4570 },
  tangalle: { lat: 6.0240, lng: 80.7940 },
  ambalangoda: { lat: 6.2360, lng: 80.0540 },
  bentota: { lat: 6.4260, lng: 79.9960 },

  // Central Province
  kandy: { lat: 7.2906, lng: 80.6337 },
  peradeniya: { lat: 7.2710, lng: 80.5960 },
  gampola: { lat: 7.1640, lng: 80.5730 },
  matale: { lat: 7.4670, lng: 80.6230 },
  dambulla: { lat: 7.8731, lng: 80.6517 },
  sigiriya: { lat: 7.9570, lng: 80.7603 },
  'nuwara eliya': { lat: 6.9497, lng: 80.7891 },
  hatton: { lat: 6.8940, lng: 80.5970 },

  // Northern & Eastern
  vavuniya: { lat: 8.7542, lng: 80.4982 },
  jaffna: { lat: 9.6615, lng: 80.0255 },
  kilinochchi: { lat: 9.3800, lng: 80.4000 },
  mannar: { lat: 8.9800, lng: 79.9000 },
  mullaitivu: { lat: 9.2670, lng: 80.8140 },
  trincomalee: { lat: 8.5874, lng: 81.2152 },
  batticaloa: { lat: 7.7310, lng: 81.6747 },
  ampara: { lat: 7.2970, lng: 81.6720 },

  // North Western & North Central & Others
  kurunegala: { lat: 7.4863, lng: 80.3623 },
  chilaw: { lat: 7.5750, lng: 79.7950 },
  puttalam: { lat: 8.0330, lng: 79.8260 },
  anuradhapura: { lat: 8.3114, lng: 80.4037 },
  polonnaruwa: { lat: 7.9403, lng: 81.0188 },
  ratnapura: { lat: 6.6828, lng: 80.4012 },
  badulla: { lat: 6.9934, lng: 81.0550 },
  bandarawela: { lat: 6.8322, lng: 80.9847 },
  ella: { lat: 6.8667, lng: 81.0466 },
};

/**
 * Geocode text address query into latitude and longitude coordinates.
 * Supports embedded numbers (e.g. "(6.9271, 79.8612)"), Sri Lanka city dictionary, and OpenStreetMap Nominatim.
 */
export async function geocodeAddress(query: string): Promise<{ latitude: number; longitude: number } | null> {
  if (!query || query.trim().length < 2) {
    return null;
  }
  const clean = query.trim().toLowerCase();

  // 1. Check if string contains explicit coordinates like "(6.9271, 79.8612)" or "6.9271, 79.8612"
  const coordMatch = query.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 5.0 && lat <= 10.0 && lng >= 79.0 && lng <= 82.0) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 2. Exact or partial match from Sri Lankan cities dictionary
  for (const [cityKey, coords] of Object.entries(SRI_LANKA_CITIES)) {
    if (clean === cityKey || clean.includes(cityKey) || (clean.length >= 3 && cityKey.startsWith(clean))) {
      return { latitude: coords.lat, longitude: coords.lng };
    }
  }

  // 3. OpenStreetMap Nominatim lookup
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Sri Lanka')}`, {
      headers: { 'User-Agent': 'YaaluCustomerApp/1.0' },
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
      }
    }
  } catch (err) {
    // Ignore network errors
  }

  return null;
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
