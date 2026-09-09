import React from 'react';
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

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ total?: string; orderId?: string }>();

  const handleTrackOrder = () => {
    router.push({
      pathname: '/orders/track',
      params: {
        orderId: params.orderId || '#YA12345678',
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Placed</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#061138" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Big Centered Checkmark Badge */}
        <View style={styles.checkmarkOuterCircle}>
          <View style={styles.checkmarkInnerCircle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for your order. Your fresh harvest is being prepared and delivered to your doorstep.
        </Text>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValBold}>{params.orderId ? `#${params.orderId.slice(0, 8)}` : '#YA12345678'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Delivery</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={16} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.detailValTime}>20–30 mins</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValGreen}>LKR {params.total || '1,570.00'}</Text>
          </View>
        </View>

        {/* Live Tracking Banner Card */}
        <View style={styles.liveTrackingCard}>
          <View style={styles.trackingTextCol}>
            <Text style={styles.liveTrackingLabel}>LIVE TRACKING ACTIVE</Text>
            <Text style={styles.trackingTitle}>Delivery Partner Assigned</Text>
            <Text style={styles.trackingSubtext}>Ravi is on his way with your order</Text>
          </View>
          <View style={styles.truckIconBadge}>
            <Ionicons name="bus-outline" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* Primary Action Button: Track Your Order */}
        <TouchableOpacity activeOpacity={0.88} style={styles.trackBtn} onPress={handleTrackOrder}>
          <Ionicons name="location-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.trackBtnText}>Track Your Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#061138' },
  helpBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40, alignItems: 'center' },
  checkmarkOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmarkInnerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  detailValBold: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  detailValTime: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  detailValGreen: { fontSize: 18, fontWeight: '900', color: '#059669' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  liveTrackingCard: {
    width: '100%',
    backgroundColor: '#0036AA',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#0036AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  trackingTextCol: { flex: 1 },
  liveTrackingLabel: { fontSize: 11, fontWeight: '900', color: '#93C5FD', letterSpacing: 1, marginBottom: 4 },
  trackingTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  trackingSubtext: { fontSize: 13, color: '#BFDBFE' },
  truckIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  trackBtn: {
    width: '100%',
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  trackBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
