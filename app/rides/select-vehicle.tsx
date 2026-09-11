import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap from '../../components/InteractiveMap';
import { cardService } from '../../services/api/card-service';
import { rideService } from '../../services/api/ride-service';

interface VehicleOption {
  id: string;
  name: string;
  backendType: string;
  capacity: number;
  eta: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const VEHICLE_CONFIGS: VehicleOption[] = [
  {
    id: 'bike',
    name: 'Bike',
    backendType: 'MOTORBIKE',
    capacity: 1,
    eta: 'In 1 min',
    iconName: 'bicycle',
  },
  {
    id: 'flex',
    name: 'Flex',
    backendType: 'THREE_WHEEL',
    capacity: 3,
    eta: 'In 1 min',
    iconName: 'car-sport',
  },
  {
    id: 'mini',
    name: 'Normal Car',
    backendType: 'CAR',
    capacity: 3,
    eta: 'In 2 min',
    iconName: 'car',
  },
  {
    id: 'luxury',
    name: 'Luxury Car',
    backendType: 'LUXURY_CAR',
    capacity: 4,
    eta: 'In 3 min',
    iconName: 'sparkles',
  },
  {
    id: 'van',
    name: 'Van',
    backendType: 'VAN',
    capacity: 6,
    eta: 'In 3 min',
    iconName: 'cube-outline',
  },
];

// Mathematical fare formula matching PostgreSQL fare_settings database table
function computeDbFare(distanceKm: number, vehicleType: string): number {
  const dist = Math.max(1.0, distanceKm);
  let B = 370.0;
  let C = 0.0;
  let D = 1500.0;
  let F = 45.0;
  let G = 3.0;
  let H = 2.0;
  let multiplier = 3.0;
  let K = 100.0;
  let minFare = 100.0;

  if (vehicleType === 'THREE_WHEEL') {
    C = 0.02;
    F = 25.0;
    G = 5.0;
    H = 3.0;
    K = 150.0;
    minFare = 150.0;
  } else if (vehicleType === 'CAR') {
    C = 0.0;
    F = 14.0;
    G = 10.0;
    H = 6.0;
    K = 250.0;
    minFare = 250.0;
  } else if (vehicleType === 'LUXURY_CAR') {
    C = 0.0;
    F = 9.0;
    G = 20.0;
    H = 12.0;
    K = 500.0;
    minFare = 500.0;
  } else if (vehicleType === 'VAN') {
    C = 0.0;
    F = 10.0;
    G = 15.0;
    H = 8.0;
    K = 350.0;
    minFare = 350.0;
  }

  const A = B + (C * D);
  const E = F > 0 ? A / F : 0;
  const I = E + G + H;
  const J = multiplier * I;

  let L = K;
  if (dist > 1.0) {
    L = K + J * (dist - 1.0);
  }
  L = Math.max(L, minFare);
  return Math.round(L * 100) / 100;
}

// Calculate Haversine distance between 2 geo coordinates in Kilometers
function calculateDistanceKm(lat1?: string, lon1?: string, lat2?: string, lon2?: string): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 7.0; // Default fallback distance 7km
  const p1 = parseFloat(lat1);
  const l1 = parseFloat(lon1);
  const p2 = parseFloat(lat2);
  const l2 = parseFloat(lon2);
  if (isNaN(p1) || isNaN(l1) || isNaN(p2) || isNaN(l2)) return 7.0;

  const R = 6371; // Earth radius in km
  const dLat = ((p2 - p1) * Math.PI) / 180;
  const dLon = ((l2 - l1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1 * Math.PI) / 180) * Math.cos((p2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance > 0.5 ? distance : 1.0;
}

export default function SelectVehicleScreen() {
  const router = useRouter();
  const { mode, tripCategory, pickup, dropoff, pickupLat, pickupLng, dropoffLat, dropoffLng } = useLocalSearchParams<{
    mode?: string;
    tripCategory?: string;
    pickup?: string;
    dropoff?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropoffLat?: string;
    dropoffLng?: string;
  }>();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('bike');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [defaultCardMask, setDefaultCardMask] = useState<string>('');

  // Modals & User Selection state
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [driverNote, setDriverNote] = useState('');

  // Resolved coordinates with fallbacks
  const pLatNum = pickupLat ? parseFloat(pickupLat) : 6.9271;
  const pLngNum = pickupLng ? parseFloat(pickupLng) : 79.8612;
  const dLatNum = dropoffLat ? parseFloat(dropoffLat) : 6.8413;
  const dLngNum = dropoffLng ? parseFloat(dropoffLng) : 79.9654;

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number }>({ lat: pLatNum, lng: pLngNum });
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number }>({ lat: dLatNum, lng: dLngNum });

  // Calculate distance in km dynamically from map parameters
  const tripDistanceKm = calculateDistanceKm(
    String(pickupCoords.lat),
    String(pickupCoords.lng),
    String(dropoffCoords.lat),
    String(dropoffCoords.lng)
  );

  // Load customer's default payment card from DB
  useEffect(() => {
    cardService.getUserCards().then((cards) => {
      if (cards && cards.length > 0) {
        setDefaultCardMask(cards[0].cardNumberMask);
      }
    }).catch(() => {});
  }, []);

  // State for live backend API calculated fares
  const [backendFares, setBackendFares] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch live mathematical fare calculation from backend api-gateway controller
    VEHICLE_CONFIGS.forEach((v) => {
      rideService.calculateFare(tripDistanceKm, v.backendType).then((res) => {
        if (res && typeof res.totalFare === 'number') {
          setBackendFares((prev) => ({ ...prev, [v.id]: res.totalFare }));
        }
      }).catch(() => {});
    });
  }, [tripDistanceKm]);

  // Compute calculated vehicles with dynamic fares from database and promo discounts
  const calculatedVehicles = VEHICLE_CONFIGS.map((v) => {
    let rawPrice = backendFares[v.id] !== undefined
      ? backendFares[v.id]
      : computeDbFare(tripDistanceKm, v.backendType);

    if (appliedPromo) {
      rawPrice = rawPrice * (1 - appliedPromo.discountPercent / 100);
    }
    const finalPrice = Math.max(100, Math.round(rawPrice * 100) / 100);
    const stars = (finalPrice * 0.01).toFixed(1);
    return {
      ...v,
      priceValue: finalPrice,
      price: `LKR ${finalPrice.toFixed(2)}`,
      rewardStars: `Earn ${stars} stars`,
    };
  });

  const handleApplyPromo = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    if (cleanCode === 'WELCOME20' || cleanCode === 'YAALU20') {
      setAppliedPromo({ code: cleanCode, discountPercent: 20 });
      setPromoModalVisible(false);
      Alert.alert('Promo Applied!', 'You saved 20% on this trip.');
    } else if (cleanCode === 'SAVE50' || cleanCode === 'FREE50') {
      setAppliedPromo({ code: cleanCode, discountPercent: 50 });
      setPromoModalVisible(false);
      Alert.alert('Promo Applied!', '50% discount applied to your fare.');
    } else {
      Alert.alert('Invalid Promo', 'Code not recognized. Try YAALU20 or SAVE50.');
    }
  };

  const handleSaveNote = () => {
    setDriverNote(noteInput.trim());
    setNoteModalVisible(false);
  };

  const handleBookNow = () => {
    const routeParams = {
      mode: mode || 'standard',
      tripCategory: tripCategory || 'ONE_WAY',
      vehicleType: selectedVehicleId,
      pickup: pickup || 'Pickup Location',
      dropoff: dropoff || 'Dropoff Location',
      pickupLat: String(pickupCoords.lat),
      pickupLng: String(pickupCoords.lng),
      dropoffLat: String(dropoffCoords.lat),
      dropoffLng: String(dropoffCoords.lng),
      paymentMethod,
      promoCode: appliedPromo?.code,
      driverNote,
    };

    if (mode === 'bidding') {
      router.push({ pathname: '/rides/bidding-timer' as any, params: routeParams });
    } else {
      router.push({ pathname: '/rides/confirm-pickup' as any, params: routeParams });
    }
  };

  // Build dynamic markers from resolved coordinates
  const vehicleMarkers: any[] = [
    {
      id: 'p1',
      latitude: pickupCoords.lat,
      longitude: pickupCoords.lng,
      title: pickup || 'Pickup Location',
      type: 'pickup',
    },
    {
      id: 'd1',
      latitude: dropoffCoords.lat,
      longitude: dropoffCoords.lng,
      title: dropoff || 'Destination',
      type: 'drop',
    },
  ];

  const mapCenter = { latitude: pickupCoords.lat, longitude: pickupCoords.lng };

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

      {/* Main Flex Layout */}
      <View style={styles.mainContent}>
        {/* Upper Screen: Full Flex Real Interactive Route Map */}
        <View style={styles.mapContainer}>
          <InteractiveMap
            height="100%"
            center={mapCenter}
            zoom={12}
            markers={vehicleMarkers}
            showRoute={vehicleMarkers.length >= 2}
          />
        </View>

        {/* Lower Screen: Bottom-Anchored Vehicle Options & Booking Section */}
        <View style={styles.vehicleOptionsPanel}>
          {/* Section Subheader */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.panelTitle}>Select Vehicle</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Est. Distance: {tripDistanceKm.toFixed(1)} km
            </Text>
          </View>

          {/* Compact Vehicle Cards Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compactCardsRow}
          >
            {calculatedVehicles.map((vehicle) => {
              const isSelected = selectedVehicleId === vehicle.id;
              return (
                <TouchableOpacity
                  key={vehicle.id}
                  activeOpacity={0.88}
                  style={[styles.compactVehicleCard, isSelected && styles.compactVehicleCardSelected]}
                  onPress={() => setSelectedVehicleId(vehicle.id)}
                >
                  <View style={styles.compactEtaBadge}>
                    <Text style={styles.compactEtaText}>{vehicle.eta}</Text>
                  </View>

                  <View style={styles.compactIconCircle}>
                    <Ionicons name={vehicle.iconName} size={24} color="#061138" />
                  </View>

                  <Text style={styles.compactNameText}>
                    {vehicle.name} <Ionicons name="person" size={10} color="#64748B" /> {vehicle.capacity}
                  </Text>

                  <View style={styles.compactPriceRow}>
                    <Text style={styles.compactPriceText}>{vehicle.price}</Text>
                  </View>

                  <View style={styles.compactRewardChip}>
                    <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 2 }} />
                    <Text style={styles.compactRewardText}>{vehicle.rewardStars}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Payment & Promo Strip Row */}
          <View style={styles.paymentStripRow}>
            {/* Payment Method Switcher (Cash vs Card) */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.stripOptionBtn}
              onPress={() => setPaymentMethod(prev => prev === 'CASH' ? 'CARD' : 'CASH')}
            >
              <Ionicons
                name={paymentMethod === 'CASH' ? 'cash' : 'card'}
                size={18}
                color={paymentMethod === 'CASH' ? '#059669' : '#2563EB'}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.stripOptionText}>
                {paymentMethod === 'CASH' ? 'Cash' : (defaultCardMask ? `Card (${defaultCardMask.slice(-4)})` : 'Card')}
              </Text>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            {/* Add Driver Note */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.stripOptionBtn}
              onPress={() => setNoteModalVisible(true)}
            >
              <Ionicons
                name={driverNote ? 'checkmark-circle' : 'create-outline'}
                size={16}
                color={driverNote ? '#059669' : '#64748B'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.stripOptionText, driverNote && { color: '#059669' }]} numberOfLines={1}>
                {driverNote ? `Note: ${driverNote}` : 'Add note'}
              </Text>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            {/* Add Promo Code */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.stripOptionBtn}
              onPress={() => setPromoModalVisible(true)}
            >
              <Ionicons
                name={appliedPromo ? 'pricetag' : 'pricetag-outline'}
                size={16}
                color={appliedPromo ? '#D97706' : '#64748B'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.stripOptionText, appliedPromo && { color: '#D97706' }]}>
                {appliedPromo ? appliedPromo.code : 'Add Promo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button: Book Now */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.bookNowBtn}
            onPress={handleBookNow}
          >
            <Text style={styles.bookNowBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PROMO CODE MODAL */}
      <Modal visible={promoModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Promo Code</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Promo Code (e.g. YAALU20)"
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#F1F5F9' }]}
                onPress={() => setPromoModalVisible(false)}
              >
                <Text style={{ fontWeight: '700', color: '#475569' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#FDB813' }]}
                onPress={handleApplyPromo}
              >
                <Text style={{ fontWeight: '900', color: '#061138' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DRIVER NOTE MODAL */}
      <Modal visible={noteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Note for Driver</Text>
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="e.g. Please wait near the main gate"
              multiline
              value={noteInput}
              onChangeText={setNoteInput}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#F1F5F9' }]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={{ fontWeight: '700', color: '#475569' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#FDB813' }]}
                onPress={handleSaveNote}
              >
                <Text style={{ fontWeight: '900', color: '#061138' }}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 88 : 65,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#CBD5E1',
    position: 'relative',
  },
  vehicleOptionsPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  compactCardsRow: {
    gap: 10,
    paddingBottom: 12,
  },
  compactVehicleCard: {
    width: 108,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  compactVehicleCardSelected: {
    borderColor: '#061138',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactEtaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  compactEtaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  compactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  compactNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  compactPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactPriceText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  compactRewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  compactRewardText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
  },
  paymentStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  stripOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stripOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  verticalDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E2E8F0',
  },
  bookNowBtn: {
    backgroundColor: '#FDB813',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bookNowBtnText: {
    color: '#061138',
    fontSize: 17,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

