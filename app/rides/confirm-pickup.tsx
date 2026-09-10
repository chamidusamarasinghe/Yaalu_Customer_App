import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap from '../../components/InteractiveMap';

const { width, height } = Dimensions.get('window');

export default function ConfirmPickupScreen() {
  const router = useRouter();
  const { mode, tripCategory } = useLocalSearchParams<{ mode?: string; tripCategory?: string }>();
  const [pickupCoords, setPickupCoords] = useState({ latitude: 6.8413, longitude: 79.9654 });

  const handleConfirmPickup = () => {
    router.push({
      pathname: '/rides/verify-start' as any,
      params: { tripCategory: tripCategory || 'ONE_WAY' }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
      </View>

      {/* Full Screen OpenStreetMap Area */}
      <View style={styles.mapArea}>
        <InteractiveMap
          height="100%"
          center={pickupCoords}
          zoom={15}
          interactivePicker={true}
          onLocationSelect={(lat, lng) => setPickupCoords({ latitude: lat, longitude: lng })}
          markers={[
            {
              id: 'pickup_pin',
              latitude: pickupCoords.latitude,
              longitude: pickupCoords.longitude,
              title: 'Pickup Location',
              type: 'pickup',
            },
          ]}
        />

        {/* Bottom Floating Card: Confirm Pickup */}
        <View style={styles.bottomCardContainer}>
          <Text style={styles.cardHeaderTitle}>Confirm your pickup</Text>

          <View style={styles.addressRow}>
            <View style={styles.bluePinCircle}>
              <Ionicons name="location-sharp" size={20} color="#2563EB" />
            </View>
            <View style={styles.addressTextCol}>
              <Text style={styles.addressStreetTitle}>High Level Road</Text>
              <Text style={styles.addressAreaSubtitle}>Makumbura, Colombo</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.confirmBtn}
            onPress={handleConfirmPickup}
          >
            <Text style={styles.confirmBtnText}>CONFIRM PICKUP</Text>
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
    backgroundColor: '#F8FAFC',
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
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadMainHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 48,
    backgroundColor: '#CBD5E1',
    top: '40%',
  },
  roadMainVertical: {
    position: 'absolute',
    height: '100%',
    width: 48,
    backgroundColor: '#CBD5E1',
    left: '46%',
  },
  compassMarkerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  compassPulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  compassCenterCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingMapBtnTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingMapBtnBottomLeft: {
    position: 'absolute',
    bottom: 230,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingMapBtnTopRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingMapBtnBottomRight: {
    position: 'absolute',
    bottom: 230,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 95 : 75,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bluePinCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTextCol: {
    flex: 1,
  },
  addressStreetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  addressAreaSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

