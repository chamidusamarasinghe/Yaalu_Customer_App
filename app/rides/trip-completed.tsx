import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
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

const INITIAL_TAGS = ['On Time', 'Safe Driving', 'Friendly Driver', 'Clean Car'];

export default function TripCompletedScreen() {
  const router = useRouter();

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(INITIAL_TAGS);
  const [comments, setComments] = useState<string>('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRating = () => {
    Alert.alert('Trip Summary Saved', 'Thank you for rating your ride with YAALU!', [
      { text: 'OK', onPress: () => router.push('/(tabs)') },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Brand Banner */}
      <View style={styles.topBrandHeader}>
        <Text style={styles.brandTitleText}>yaalu</Text>
      </View>

      {/* Title Subheader */}
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Trip Completed ✓</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Big Hero Final Fare Banner */}
        <View style={styles.heroFareBanner}>
          <Text style={styles.heroFareText}>Final Fare: LKR 95.00</Text>
        </View>

        {/* Trip Summary Map Card */}
        <View style={styles.tripSummaryMapCard}>
          <View style={styles.mapSnippetBox}>
            <View style={styles.mapRouteGraphic}>
              <View style={styles.greenStartDot} />
              <View style={styles.routeDottedLine} />
              <View style={styles.orangeEndPin}>
                <Ionicons name="location-sharp" size={16} color="#EA580C" />
              </View>
            </View>

            <View style={styles.mapLabelStrip}>
              <Text style={styles.mapLabelText}>
                Trip Summary: Kottawa to Homagama, 4.8 Km, 12 min
              </Text>
            </View>
          </View>
        </View>

        {/* Driver Rating & Review Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingCardTitle}>Rate your ride with Ravi K.</Text>

          {/* Driver Info Row */}
          <View style={styles.driverInfoRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
              }}
              style={styles.driverAvatar}
            />

            <View style={styles.driverTextCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.driverName}>Ravi K.</Text>
                <Text style={styles.driverRatingText}>4.9 ★</Text>
              </View>
              <Text style={styles.vehicleDetails}>Toyota Axio White • WP-AB-1234</Text>
            </View>
          </View>

          {/* 5 Gold Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <TouchableOpacity
                key={starIdx}
                activeOpacity={0.7}
                onPress={() => setRating(starIdx)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={starIdx <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={starIdx <= rating ? '#F59E0B' : '#CBD5E1'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Tag Chips */}
          <View style={styles.tagsWrapRow}>
            {['On Time', 'Safe Driving', 'Friendly Driver', 'Clean Car'].map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  activeOpacity={0.8}
                  style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Optional Comments Input */}
          <View style={styles.commentsBox}>
            <TextInput
              style={styles.commentsInput}
              value={comments}
              onChangeText={setComments}
              placeholder="Add optional comments..."
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>
        </View>

        {/* Fare Details Summary Text */}
        <View style={styles.fareBreakdownBox}>
          <Text style={styles.fareBreakdownText}>
            Fare Details: LKR 95.00 (Trip), LKR 0.00 (Tip),{' '}
            <Text style={{ fontWeight: '900', color: '#0F172A' }}>Total: LKR 95.00</Text>
          </Text>
        </View>

        {/* Dual Action Buttons */}
        <View style={styles.dualButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.submitBtn}
            onPress={handleSubmitRating}
          >
            <Text style={styles.submitBtnText}>Submit Rating & Tip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.addTipLaterBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.addTipLaterBtnText}>Add Tip Later</Text>
          </TouchableOpacity>
        </View>

        {/* Full Ride Stepper Line (All 5 completed) */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperLineCompleted} />

          <View style={styles.stepperItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>Booked</Text>
          </View>

          <View style={styles.stepperItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>Driver En Route</Text>
          </View>

          <View style={styles.stepperItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>Arrived at Pickup</Text>
          </View>

          <View style={styles.stepperItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>In Ride</Text>
          </View>

          <View style={styles.stepperItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>Completed</Text>
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
  topBrandHeader: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: 1,
  },
  subHeaderRow: {
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
    fontWeight: '900',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  heroFareBanner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroFareText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tripSummaryMapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  mapSnippetBox: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  mapRouteGraphic: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 20,
  },
  greenStartDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  routeDottedLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#061138',
    marginHorizontal: 10,
    borderRadius: 2,
  },
  orangeEndPin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabelStrip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  mapLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  ratingCard: {
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
  ratingCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 14,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverTextCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 6,
  },
  driverRatingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  vehicleDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tagsWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagChipSelected: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tagTextSelected: {
    color: '#0F172A',
  },
  commentsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    minHeight: 60,
  },
  commentsInput: {
    fontSize: 13,
    color: '#0F172A',
  },
  fareBreakdownBox: {
    marginBottom: 16,
    alignItems: 'center',
  },
  fareBreakdownText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  dualButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#061138',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FDB813',
    fontSize: 14,
    fontWeight: '900',
  },
  addTipLaterBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDB813',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTipLaterBtnText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '900',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  stepperLineCompleted: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 10,
    height: 3,
    backgroundColor: '#10B981',
  },
  stepperItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextActive: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
    marginTop: 4,
  },
});
