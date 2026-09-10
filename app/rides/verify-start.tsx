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
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import { rideService } from '../../services/api/ride-service';

export default function VerifyStartCodeScreen() {
  const router = useRouter();
  const { rideRequestId, tripCategory } = useLocalSearchParams<{ rideRequestId?: string; tripCategory?: string }>();

  const [pin, setPin] = useState(['4', '2', '0', '0']);

  const handleVerifyAndStart = async () => {
    const rId = rideRequestId || 'RIDE-DEMO-1001';
    await rideService.verifyStartPin(rId, pin.join(''));
    router.push({
      pathname: '/rides/in-trip' as any,
      params: {
        rideRequestId: rId,
        tripCategory: tripCategory || 'ONE_WAY',
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Brand Banner */}
      <View style={styles.topBrandHeader}>
        <Text style={styles.brandText}>yaalu</Text>
      </View>

      {/* Title Subheader */}
      <View style={styles.subHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Pickup Ready</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Snippet Preview */}
        <View style={styles.mapSnippetContainer}>
          <View style={styles.mapSnippetInner}>
            <View style={styles.googleBrandBadge}>
              <Text style={styles.googleBrandText}>Google</Text>
            </View>
          </View>
        </View>

        {/* Driver Arrival Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeMainTitle}>Driver is Here!</Text>
          <Text style={styles.noticeSubText}>
            Please find Ravi K. and his white Toyota Axio (WP-AB-1234).
          </Text>
        </View>

        {/* Verification Code Box */}
        <View style={styles.verifyCard}>
          <Text style={styles.verifyCardTitle}>VERIFY START CODE</Text>

          {/* 4 Digit PIN Inputs */}
          <View style={styles.pinInputsRow}>
            {pin.map((digit, idx) => (
              <View key={idx} style={styles.pinBox}>
                <Text style={styles.pinBoxText}>{digit}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.pinSubtext}>Ask driver for 4-digit code and enter below.</Text>

          {/* Price Banner Strip inside box */}
          <View style={styles.ridePriceStrip}>
            <Text style={styles.ridePriceText}>Ride Price: LKR 420.00</Text>
          </View>
        </View>

        {/* Driver Communication Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="call" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Chat with Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="share-social" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Share Status</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.verifyStartBtn}
          onPress={handleVerifyAndStart}
        >
          <Text style={styles.verifyStartBtnText}>VERIFY & START RIDE</Text>
        </TouchableOpacity>

        {/* Timeline Progress Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperTrackLine} />

          <View style={styles.stepperStepItem}>
            <View style={styles.stepCircleCompleted}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepLabel}>Booked</Text>
          </View>

          <View style={styles.stepperStepItem}>
            <View style={styles.stepCircleCompleted}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepLabel}>Driver En Route</Text>
          </View>

          <View style={styles.stepperStepItem}>
            <View style={styles.stepCircleActive}>
              <View style={styles.innerActiveDot} />
            </View>
            <Text style={styles.stepLabelActive}>Arrived at Pickup</Text>
          </View>

          <View style={styles.stepperStepItem}>
            <View style={styles.stepCirclePending} />
            <Text style={styles.stepLabel}>In Ride</Text>
          </View>

          <View style={styles.stepperStepItem}>
            <View style={styles.stepCirclePending} />
            <Text style={styles.stepLabel}>Completed</Text>
          </View>
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
  topBrandHeader: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  mapSnippetContainer: {
    height: 120,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapSnippetInner: {
    flex: 1,
    backgroundColor: '#CBD5E1',
    justifyContent: 'flex-end',
    padding: 10,
  },
  googleBrandBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  googleBrandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  noticeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  noticeSubText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  verifyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0F172A',
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 14,
  },
  pinInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pinBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  pinBoxText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  pinSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  ridePriceStrip: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    alignItems: 'center',
  },
  ridePriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionCol: {
    alignItems: 'center',
  },
  actionCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  verifyStartBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  verifyStartBtnText: {
    color: '#FDB813',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  stepperTrackLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 10,
    height: 3,
    backgroundColor: '#10B981',
  },
  stepperStepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircleCompleted: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerActiveDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
  },
  stepCirclePending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  stepLabelActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
});
