import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

const TIP_OPTIONS = ['No tip', 'LKR 50', 'LKR 100', 'LKR 150', 'LKR 200', 'LKR 250', 'LKR 500'];

export default function InTripTrackingScreen() {
  const router = useRouter();

  const [selectedTip, setSelectedTip] = useState('No tip');
  const [rating, setRating] = useState(0);

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex);
    router.push('/rides/rate-driver' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Banner Header */}
      <View style={styles.topYellowHeader}>
        <Text style={styles.tripStatusTitle}>Trip Started</Text>
        <Text style={styles.tripEtaSubtext}>06 min to drop</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver & Vehicle Details Card */}
        <View style={styles.cardContainer}>
          <View style={styles.driverTopRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
              }}
              style={styles.driverAvatar}
            />

            <View style={styles.driverInfoCol}>
              <View style={styles.vehicleRegRow}>
                <Text style={styles.vehicleModelText}>Green Bajaj 4 stroke</Text>
                <Text style={styles.vehicleRegText}>ABH 4140</Text>
              </View>

              <Text style={styles.driverName}>Sampath Krishantha</Text>

              <View style={styles.ratingBadgeRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingValueText}>4.7</Text>
              </View>
            </View>

            <View style={styles.commButtonsCol}>
              <TouchableOpacity activeOpacity={0.7} style={styles.commBtnCircle}>
                <Ionicons name="chatbubble-outline" size={18} color="#0F172A" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.commBtnCircle}>
                <Ionicons name="call-outline" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add a Tip Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderTitle}>Add a tip.</Text>
          <Text style={styles.sectionSubtext}>100% of your tip goes to the driver.</Text>

          <View style={styles.tipWrapRow}>
            {TIP_OPTIONS.map((tip) => {
              const isActive = selectedTip === tip;
              return (
                <TouchableOpacity
                  key={tip}
                  activeOpacity={0.8}
                  style={[styles.tipPill, isActive && styles.tipPillActive]}
                  onPress={() => setSelectedTip(tip)}
                >
                  <Text style={[styles.tipPillText, isActive && styles.tipPillTextActive]}>
                    {tip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rate Driver Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderTitle}>Rate your driver while on trip</Text>
          <Text style={styles.sectionSubtext}>What do you think about your driver's service?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <TouchableOpacity
                key={starIndex}
                activeOpacity={0.7}
                onPress={() => handleStarPress(starIndex)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={starIndex <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={starIndex <= rating ? '#F59E0B' : '#CBD5E1'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fare Summary Breakdown */}
        <View style={styles.cardContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Trip Fare</Text>
            <Text style={styles.summaryValueBold}>LKR 236.11</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>7 min</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>2.14 Km</Text>
          </View>
        </View>

        {/* Fare Info Notice Banner */}
        <View style={styles.infoBannerBox}>
          <Ionicons name="information-circle" size={20} color="#2563EB" style={{ marginRight: 10 }} />
          <Text style={styles.infoBannerText}>
            Your final trip fare will be calculated based on actual trip distance, actual duration and
            other applicable charges
          </Text>
        </View>

        {/* Insurance Banner */}
        <View style={styles.insuranceCardRow}>
          <View style={styles.shieldIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.insuranceTitle}>Your PickMe trip is insured</Text>
            <Text style={styles.insuranceSubtext}>*Terms and conditions applied</Text>
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
    backgroundColor: '#F8FAFC',
  },
  topYellowHeader: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripStatusTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  tripEtaSubtext: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  driverInfoCol: {
    flex: 1,
  },
  vehicleRegRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  vehicleModelText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  vehicleRegText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  ratingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginLeft: 4,
  },
  commButtonsCol: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  commBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  tipWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tipPillActive: {
    backgroundColor: '#061138',
    borderColor: '#061138',
  },
  tipPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  tipPillTextActive: {
    color: '#FFFFFF',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  summaryValueBold: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoBannerBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    lineHeight: 18,
  },
  insuranceCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shieldIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insuranceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  insuranceSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
