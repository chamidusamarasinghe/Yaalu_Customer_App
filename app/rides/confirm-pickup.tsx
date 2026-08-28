import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

const { width, height } = Dimensions.get('window');

export default function ConfirmPickupScreen() {
  const router = useRouter();

  const handleConfirmPickup = () => {
    router.push('/rides/select-vehicle' as any);
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

      {/* Full Screen Interactive Map Area */}
      <View style={styles.mapArea}>
        {/* Map Simulation Graphics */}
        <View style={styles.mapBackground}>
          <View style={styles.roadMainHorizontal} />
          <View style={styles.roadMainVertical} />

          {/* Location Compass Pin Marker */}
          <View style={styles.compassMarkerWrapper}>
            <View style={styles.compassPulseRing} />
            <View style={styles.compassCenterCircle}>
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </View>
          </View>

          {/* Floating Map Controls Left */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.floatingMapBtnTopLeft}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#061138" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.floatingMapBtnBottomLeft}>
            <Ionicons name="arrow-back" size={20} color="#061138" />
          </TouchableOpacity>

          {/* Floating Map Controls Right */}
          <TouchableOpacity activeOpacity={0.85} style={styles.floatingMapBtnTopRight}>
            <Ionicons name="eye-outline" size={20} color="#061138" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.floatingMapBtnBottomRight}>
            <Ionicons name="locate" size={20} color="#061138" />
          </TouchableOpacity>
        </View>

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
    ...StyleSheet.absoluteFillObject,
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
