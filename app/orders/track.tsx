import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function TrackOrderScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Your Order</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estimated Time Card */}
        <View style={styles.etaCard}>
          <View style={styles.etaLeftCol}>
            <Text style={styles.etaLabel}>Estimated Time of Arrival</Text>
            <Text style={styles.etaTimeText}>12 min</Text>
            <Text style={styles.etaSubtext}>Your driver is on the way</Text>
          </View>
          <View style={styles.scooterBadge}>
            <Ionicons name="bicycle" size={32} color="#854D0E" />
          </View>
        </View>

        {/* Map Preview Card with Live Route Overlay */}
        <View style={styles.mapContainer}>
          <Image
            source={require('../../assets/images/map_bg.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Overlay Map Route Simulation */}
          <View style={styles.mapOverlay}>
            {/* Scooter Marker Pin */}
            <View style={styles.scooterMarkerPosition}>
              <View style={styles.markerBubble}>
                <Ionicons name="bicycle" size={18} color="#FFFFFF" />
              </View>
            </View>

            {/* Destination Red Pin Marker */}
            <View style={styles.destinationMarkerPosition}>
              <Ionicons name="location-sharp" size={36} color="#EF4444" />
            </View>

            {/* Location Labels */}
            <Text style={[styles.mapLabelText, { top: 40, right: 30 }]}>Thalawatugoda</Text>
            <Text style={[styles.mapLabelText, { top: 90, left: 60 }]}>Havelock Town</Text>
            <Text style={[styles.mapLabelText, { top: 100, right: 80 }]}>Nawala</Text>
            <Text style={[styles.mapLabelText, { top: 160, left: 40 }]}>Rajagiriya</Text>
            <Text style={[styles.mapLabelText, { bottom: 30, left: 70 }]}>Kotte</Text>

            {/* Live Indicator Badge */}
            <View style={styles.liveBadge}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
        </View>

        {/* Driver Profile Card */}
        <View style={styles.driverCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.driverAvatar}
            />
            <View style={styles.starBadge}>
              <Text style={styles.starText}>★</Text>
            </View>
          </View>

          <View style={styles.driverInfoCol}>
            <View style={styles.driverNameRow}>
              <Text style={styles.driverName}>Dinesh Perera</Text>
              <Text style={styles.driverRatingText}>★ 4.8</Text>
            </View>
            <Text style={styles.vehicleText}>BAJ-1234 • Honda Dio</Text>
          </View>

          <View style={styles.driverButtonsRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionIconBtn}>
              <Ionicons name="call-outline" size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionIconBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Details Summary Card */}
        <View style={styles.detailsCard}>
          <View style={styles.deliveryToRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.deliveringLabel}>Delivering to</Text>
              <Text style={styles.addressText}>123, Flower Road, Colombo 07</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.changeLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.infoGridRow}>
            <View style={styles.infoGridCol}>
              <Text style={styles.gridLabel}>Order ID</Text>
              <Text style={styles.gridValueBold}>#YA12345</Text>
              <Text style={styles.gridValueBold}>678</Text>
            </View>
            <View style={styles.infoGridCol}>
              <Text style={styles.gridLabel}>Order Time</Text>
              <Text style={styles.gridValueBold}>10:30 AM</Text>
            </View>
            <View style={styles.infoGridCol}>
              <Text style={styles.gridLabel}>Items</Text>
              <Text style={styles.gridValueBold}>3 Items</Text>
            </View>
          </View>
        </View>

        {/* Primary Action: Order Delivered Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.deliveredActionBtn}
          onPress={() => router.push('/orders/delivered')}
        >
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.deliveredActionBtnText}>Order Delivered • View Summary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <CustomBottomTabBar activeTab="ORDERS" />
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  etaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  etaLeftCol: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  etaTimeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 2,
  },
  etaSubtext: {
    fontSize: 13,
    color: '#64748B',
  },
  scooterBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scooterMarkerPosition: {
    position: 'absolute',
    top: 50,
    left: '42%',
    alignItems: 'center',
  },
  markerBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  destinationMarkerPosition: {
    position: 'absolute',
    bottom: 50,
    left: '48%',
  },
  mapLabelText: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  liveBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FDB813',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  driverInfoCol: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  driverRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  vehicleText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  driverButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  deliveryToRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deliveringLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  changeLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0036AA',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  infoGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoGridCol: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  gridValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  deliveredActionBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  deliveredActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
