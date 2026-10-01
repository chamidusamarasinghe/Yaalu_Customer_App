import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap, { MapMarker } from '../../components/InteractiveMap';
import * as Location from 'expo-location';

const SRI_LANKA_CITIES: Record<string, { lat: number; lng: number }> = {
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

async function geocodeAddress(query: string): Promise<{ latitude: number; longitude: number } | null> {
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

async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  // 1. Try Nominatim reverse geocoding API
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'YaaluCustomerApp/1.0' },
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood;
        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county;

        if (road && city) {
          return `${road}, ${city}`;
        }
        if (road) {
          return `${road}`;
        }
        if (city) {
          return `${city}`;
        }
        if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 2).join(',').trim();
        }
      }
    }
  } catch (err) {
    // Fallback
  }

  // 2. Nearest Sri Lanka City lookup fallback
  let closestCity = '';
  let minDistance = Infinity;
  for (const [cityKey, coords] of Object.entries(SRI_LANKA_CITIES)) {
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
    }
  }

  if (minDistance < 0.05 && closestCity) {
    return `${closestCity} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  return `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

export default function RideDestinationScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const [tripType, setTripType] = useState<'ONE_WAY' | 'RETURN'>('ONE_WAY');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeTarget, setActiveTarget] = useState<'pickup' | 'drop'>('pickup');

  const handlePickupTextChange = async (text: string) => {
    setPickupLocation(text);
    const coords = await geocodeAddress(text);
    if (coords) {
      setPickupCoords(coords);
    }
  };

  const handleDropTextChange = async (text: string) => {
    setDropLocation(text);
    const coords = await geocodeAddress(text);
    if (coords) {
      setDropCoords(coords);
    }
  };

  // Map tap handler with real-time reverse geocoding
  const handleMapTap = async (lat: number, lng: number) => {
    if (activeTarget === 'pickup') {
      setPickupCoords({ latitude: lat, longitude: lng });
      setPickupLocation(`Locating... (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      const resolvedAddress = await reverseGeocodeCoords(lat, lng);
      setPickupLocation(resolvedAddress);
      setActiveTarget('drop'); // Automatically prompt for drop location on next tap
    } else {
      setDropCoords({ latitude: lat, longitude: lng });
      setDropLocation(`Locating... (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      const resolvedAddress = await reverseGeocodeCoords(lat, lng);
      setDropLocation(resolvedAddress);
    }
  };

  const handleUseCurrentGPSLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to detect your current position.');
        return;
      }
      setPickupLocation('Locating GPS position...');
      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      setPickupCoords({ latitude: lat, longitude: lng });
      const address = await reverseGeocodeCoords(lat, lng);
      setPickupLocation(address);
    } catch (e) {
      setPickupCoords({ latitude: 6.9271, longitude: 79.8612 });
      setPickupLocation('Colombo, Sri Lanka');
    }
  };

  // Automatically detect customer's current GPS location on screen mount
  useEffect(() => {
    let isMounted = true;
    async function initCustomerLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          if (isMounted && location && location.coords) {
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;
            setPickupCoords({ latitude: lat, longitude: lng });
            setPickupLocation(`Locating... (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            const address = await reverseGeocodeCoords(lat, lng);
            if (isMounted) {
              setPickupLocation(address);
            }
          }
        } else {
          if (isMounted) {
            setPickupCoords({ latitude: 6.9271, longitude: 79.8612 });
            setPickupLocation('Colombo, Sri Lanka');
          }
        }
      } catch (e) {
        if (isMounted) {
          setPickupCoords({ latitude: 6.9271, longitude: 79.8612 });
          setPickupLocation('Colombo, Sri Lanka');
        }
      }
    }

    initCustomerLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectQuickDestination = (destinationName: string, lat?: number, lng?: number) => {
    setDropLocation(destinationName);
    if (lat && lng) {
      setDropCoords({ latitude: lat, longitude: lng });
    }
  };

  const handleProceedToVehicle = async () => {
    if (!pickupLocation.trim() || !dropLocation.trim()) {
      Alert.alert(
        'Select Locations',
        'Please select both pickup and dropoff locations on the map or type them in before proceeding.'
      );
      return;
    }

    let pCoords = pickupCoords;
    if (!pCoords) {
      pCoords = await geocodeAddress(pickupLocation);
    }

    let dCoords = dropCoords;
    if (!dCoords) {
      dCoords = await geocodeAddress(dropLocation);
    }

    router.push({
      pathname: '/rides/select-vehicle' as any,
      params: {
        mode: mode || 'standard',
        tripCategory: tripType,
        pickup: pickupLocation,
        dropoff: dropLocation,
        pickupLat: pCoords?.latitude ? String(pCoords.latitude) : undefined,
        pickupLng: pCoords?.longitude ? String(pCoords.longitude) : undefined,
        dropoffLat: dCoords?.latitude ? String(dCoords.latitude) : undefined,
        dropoffLng: dCoords?.longitude ? String(dCoords.longitude) : undefined,
      },
    });
  };

  // Build markers list dynamically only when locations are selected
  const activeMarkers: MapMarker[] = [];
  if (pickupCoords) {
    activeMarkers.push({
      id: 'pickup_pin',
      latitude: pickupCoords.latitude,
      longitude: pickupCoords.longitude,
      title: pickupLocation ? `📍 ${pickupLocation}` : '📍 Current Location',
      type: 'user',
    });
  }
  if (dropCoords) {
    activeMarkers.push({
      id: 'drop_pin',
      latitude: dropCoords.latitude,
      longitude: dropCoords.longitude,
      title: dropLocation || 'Dropoff',
      type: 'drop',
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Real Interactive Leaflet OpenStreetMap Container */}
        <View style={styles.mapContainer}>
          <InteractiveMap
            height={360}
            center={activeMarkers.length > 0 ? { latitude: activeMarkers[0].latitude, longitude: activeMarkers[0].longitude } : { latitude: 6.9271, longitude: 79.8612 }}
            zoom={12}
            markers={activeMarkers}
            showRoute={activeMarkers.length >= 2}
            interactivePicker={true}
            onLocationSelect={handleMapTap}
          />

          {/* Floating GPS Location Button directly on Map */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.gpsMapFab}
            onPress={handleUseCurrentGPSLocation}
          >
            <Ionicons name="navigate-circle" size={20} color="#2563EB" />
            <Text style={styles.gpsMapFabText}>My Location</Text>
          </TouchableOpacity>

          {/* Map Selection Target Mode Indicator Strip */}
          <View style={styles.targetSelectionStrip}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.targetChip, activeTarget === 'pickup' && styles.targetChipActive]}
              onPress={() => setActiveTarget('pickup')}
            >
              <Text style={[styles.targetChipText, activeTarget === 'pickup' && styles.targetChipTextActive]}>
                📍 Tap Map for Pickup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.targetChip, activeTarget === 'drop' && styles.targetChipActiveDrop]}
              onPress={() => setActiveTarget('drop')}
            >
              <Text style={[styles.targetChipText, activeTarget === 'drop' && styles.targetChipTextActiveDrop]}>
                🎯 Tap Map for Dropoff
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lower Screen: Destination & Trip Options Card */}
        <View style={styles.searchCardContainer}>
          {/* Trip Selector (One way / Return trip - Mutually Exclusive) */}
          <View style={styles.tripTypeRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tripTypeChip, tripType === 'ONE_WAY' && styles.tripTypeChipActive]}
              onPress={() => setTripType('ONE_WAY')}
            >
              <View style={[styles.radioCircle, tripType === 'ONE_WAY' && styles.radioCircleActive]}>
                {tripType === 'ONE_WAY' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.tripTypeText, tripType === 'ONE_WAY' && styles.tripTypeTextActive]}>
                One way
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tripTypeChip, tripType === 'RETURN' && styles.tripTypeChipActive]}
              onPress={() => setTripType('RETURN')}
            >
              <View style={[styles.radioCircle, tripType === 'RETURN' && styles.radioCircleActive]}>
                {tripType === 'RETURN' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.tripTypeText, tripType === 'RETURN' && styles.tripTypeTextActive]}>
                Return trip*
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pickup & Drop Inputs Block */}
          <View style={styles.locationsBlock}>
            {/* Pickup Row */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.locationInputRow, activeTarget === 'pickup' && styles.activeInputRow]}
              onPress={() => setActiveTarget('pickup')}
            >
              <Text style={styles.locationLabelPickup}>PICKUP</Text>
              <TextInput
                style={styles.locationInput}
                value={pickupLocation}
                onChangeText={handlePickupTextChange}
                onFocus={() => setActiveTarget('pickup')}
                placeholder="Tap map or type pickup..."
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity activeOpacity={0.7} onPress={handleUseCurrentGPSLocation} style={{ padding: 4 }}>
                <Ionicons name="locate-sharp" size={22} color="#2563EB" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Dotted Line Connector */}
            <View style={styles.dottedConnectorContainer}>
              <View style={styles.dottedLine} />
            </View>

            {/* Drop Row */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.locationInputRow, activeTarget === 'drop' && styles.activeInputRowDrop]}
              onPress={() => setActiveTarget('drop')}
            >
              <Text style={styles.locationLabelDrop}>DROP</Text>
              <TextInput
                style={styles.locationInput}
                value={dropLocation}
                onChangeText={handleDropTextChange}
                onFocus={() => setActiveTarget('drop')}
                placeholder="Tap map or type dropoff..."
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setActiveTarget('drop')}>
                <Ionicons name="location-sharp" size={20} color="#EA580C" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Frequent Destinations Quick Chips */}
          <View style={styles.quickChipsScroll}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickLocationChip}
              onPress={() => handleSelectQuickDestination('Galle Samanala Ground', 6.0367, 80.2170)}
            >
              <View style={styles.chipPinBadge}>
                <Ionicons name="location-sharp" size={16} color="#D97706" />
              </View>
              <View>
                <Text style={styles.chipTitle}>Galle Samanala Ground</Text>
                <Text style={styles.chipSubtitle}>Galle</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickLocationChip}
              onPress={() => handleSelectQuickDestination('Ceylon Fishery Harbors', 5.9482, 80.5353)}
            >
              <View style={styles.chipPinBadge}>
                <Ionicons name="location-sharp" size={16} color="#D97706" />
              </View>
              <View>
                <Text style={styles.chipTitle}>Ceylon Fishery...</Text>
                <Text style={styles.chipSubtitle}>Matara Road...</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button: Select Vehicle */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.selectVehicleBtn}
            onPress={handleProceedToVehicle}
          >
            <Ionicons name="car-sport" size={20} color="#061138" style={{ marginRight: 8 }} />
            <Text style={styles.selectVehicleBtnText}>Select Vehicle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Yellow Bottom Footer Navigation Bar */}
      <CustomBottomTabBar activeTab="HOME" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  mapContainer: {
    height: 360,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  targetSelectionStrip: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  targetChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  targetChipActive: {
    backgroundColor: '#061138',
    borderColor: '#FDB813',
  },
  targetChipActiveDrop: {
    backgroundColor: '#EA580C',
    borderColor: '#FFFFFF',
  },
  targetChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  targetChipTextActive: {
    color: '#FDB813',
  },
  targetChipTextActiveDrop: {
    color: '#FFFFFF',
  },
  activeInputRow: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeInputRowDrop: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mapBackFloatingBtn: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  laterFloatingBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  laterBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#061138',
  },
  searchCardContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tripTypeRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tripTypeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tripTypeChipActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioCircleActive: {
    borderColor: '#061138',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#061138',
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tripTypeTextActive: {
    color: '#061138',
  },
  locationsBlock: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabelPickup: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
    width: 55,
  },
  locationLabelDrop: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
    width: 55,
  },
  locationInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 4,
  },
  dottedConnectorContainer: {
    height: 20,
    marginLeft: 26,
    justifyContent: 'center',
  },
  dottedLine: {
    width: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  quickChipsScroll: {
    flexDirection: 'row',
    gap: 10,
  },
  quickLocationChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
  },
  chipPinBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  chipSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  selectVehicleBtn: {
    backgroundColor: '#FDB813',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  selectVehicleBtnText: {
    color: '#061138',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  gpsMapFab: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  gpsMapFabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
});

