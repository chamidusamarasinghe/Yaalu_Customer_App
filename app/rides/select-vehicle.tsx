import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap from '../../components/InteractiveMap';

interface VehicleOption {
  id: string;
  name: string;
  capacity: number;
  eta: string;
  price: string;
  priceValue: number;
  rewardStars: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const VEHICLES: VehicleOption[] = [
  {
    id: 'bike',
    name: 'Bike',
    capacity: 1,
    eta: 'In 1 min',
    price: 'LKR 710.07',
    priceValue: 710.07,
    rewardStars: 'Earn 7.1 stars',
    iconName: 'bicycle',
  },
  {
    id: 'flex',
    name: 'Flex',
    capacity: 3,
    eta: 'In 1 min',
    price: 'LKR 1439.30',
    priceValue: 1439.3,
    rewardStars: 'Earn 14.4 stars',
    iconName: 'car-sport',
  },
  {
    id: 'mini',
    name: 'Mini',
    capacity: 3,
    eta: 'In 1 min',
    price: 'LKR 1891.55',
    priceValue: 1891.55,
    rewardStars: 'Earn 18.9 stars',
    iconName: 'bus',
  },
];

export default function SelectVehicleScreen() {
  const router = useRouter();
  const { mode, tripCategory, pickup, dropoff } = useLocalSearchParams<{
    mode?: string;
    tripCategory?: string;
    pickup?: string;
    dropoff?: string;
  }>();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('bike');

  const handleBookNow = () => {
    const routeParams = {
      mode: mode || 'standard',
      tripCategory: tripCategory || 'ONE_WAY',
      vehicleType: selectedVehicleId,
      pickup: pickup || 'Homagama',
      dropoff: dropoff || 'Moratuwa',
    };

    if (mode === 'bidding') {
      router.push({ pathname: '/rides/bidding-timer' as any, params: routeParams });
    } else {
      router.push({ pathname: '/rides/confirm-pickup' as any, params: routeParams });
    }
  };

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
            center={{ latitude: 6.8413, longitude: 79.9654 }}
            zoom={12}
            markers={[
              { id: '1', latitude: 6.8413, longitude: 79.9654, title: 'Your Location', type: 'pickup' },
              { id: '2', latitude: 6.7106, longitude: 79.9074, title: 'Moratuwa', type: 'drop' },
            ]}
            showRoute={true}
          />
        </View>

        {/* Lower Screen: Bottom-Anchored Vehicle Options & Booking Section */}
        <View style={styles.vehicleOptionsPanel}>
          {/* Section Subheader */}
          <Text style={styles.panelTitle}>Select Vehicle</Text>

          {/* Compact Vehicle Cards Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compactCardsRow}
          >
            {VEHICLES.map((vehicle) => {
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

          {/* Payment Options Strip */}
          <View style={styles.paymentStripRow}>
            <TouchableOpacity activeOpacity={0.8} style={styles.stripOptionBtn}>
              <Ionicons name="cash" size={18} color="#059669" style={{ marginRight: 5 }} />
              <Text style={styles.stripOptionText}>Cash</Text>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity activeOpacity={0.8} style={styles.stripOptionBtn}>
              <Ionicons name="create-outline" size={16} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.stripOptionText}>Add note</Text>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity activeOpacity={0.8} style={styles.stripOptionBtn}>
              <Ionicons name="pricetag-outline" size={16} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.stripOptionText}>Add Promo</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button: Request Driver Bids */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.bookNowBtn}
            onPress={handleBookNow}
          >
            <Text style={styles.bookNowBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

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
});

