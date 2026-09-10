import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap from '../../components/InteractiveMap';

export default function RideDestinationScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const [tripType, setTripType] = useState<'ONE_WAY' | 'RETURN'>('ONE_WAY');
  const [pickupLocation, setPickupLocation] = useState('Your Location');
  const [dropLocation, setDropLocation] = useState('Moratuwa');

  const handleSelectDestination = (destinationName: string) => {
    setDropLocation(destinationName);
  };

  const handleProceedToVehicle = () => {
    router.push({
      pathname: '/rides/select-vehicle' as any,
      params: {
        mode: mode || 'standard',
        tripCategory: tripType,
        pickup: pickupLocation,
        dropoff: dropLocation,
      },
    });
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Real Interactive Leaflet OpenStreetMap Container */}
        <View style={styles.mapContainer}>
          <InteractiveMap
            height={360}
            center={{ latitude: 6.8413, longitude: 79.9654 }}
            zoom={12}
            markers={[
              { id: '1', latitude: 6.8413, longitude: 79.9654, title: pickupLocation, type: 'pickup' },
              { id: '2', latitude: 6.7106, longitude: 79.9074, title: dropLocation, type: 'drop' },
            ]}
            showRoute={true}
          />

          {/* Floating Action Buttons */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.mapBackFloatingBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#061138" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.laterFloatingBadge}>
            <Ionicons name="time-outline" size={16} color="#061138" style={{ marginRight: 4 }} />
            <Text style={styles.laterBadgeText}>Later</Text>
          </TouchableOpacity>
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
            <View style={styles.locationInputRow}>
              <Text style={styles.locationLabelPickup}>PICKUP</Text>
              <TextInput
                style={styles.locationInput}
                value={pickupLocation}
                onChangeText={setPickupLocation}
                placeholder="Enter pickup location"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="locate-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* Dotted Line Connector */}
            <View style={styles.dottedConnectorContainer}>
              <View style={styles.dottedLine} />
            </View>

            {/* Drop Row */}
            <View style={styles.locationInputRow}>
              <Text style={styles.locationLabelDrop}>DROP</Text>
              <TextInput
                style={styles.locationInput}
                value={dropLocation}
                onChangeText={setDropLocation}
                placeholder="Where are you going?"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="add-outline" size={24} color="#061138" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Frequent Destinations Quick Chips */}
          <View style={styles.quickChipsScroll}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickLocationChip}
              onPress={() => handleSelectDestination('Galle Samanala Ground')}
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
              onPress={() => handleSelectDestination('Ceylon Fishery Harbors')}
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
  mapBackFloatingBtn: {
    position: 'absolute',
    top: 16,
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
});

