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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COMPLIMENTS = [
  { id: '1', label: 'Great Conversation', icon: 'chatbubbles-outline' },
  { id: '2', label: 'Clean Car', icon: 'car-sport-outline' },
  { id: '3', label: 'Smooth Driving', icon: 'shield-checkmark-outline' },
  { id: '4', label: 'On Time Pickup', icon: 'time-outline' },
];

export default function RateDriverScreen() {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);

  const toggleCompliment = (id: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    router.push('/rides/trip-completed' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Row with Skip Button */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.skipBtn}
          onPress={handleDone}
        >
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver Profile Card Hero */}
        <View style={styles.driverHero}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 3 }} />
              <Text style={styles.ratingBadgeText}>4.7</Text>
            </View>
          </View>

          <Text style={styles.driverName}>Arunasalam</Text>
        </View>

        {/* Rate Driver Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your driver</Text>
          <Text style={styles.ratingSubtext}>
            What do you think about your driver's service?
          </Text>

          {/* 5 Interactive Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <TouchableOpacity
                key={starIdx}
                activeOpacity={0.7}
                onPress={() => setRating(starIdx)}
                style={{ padding: 6 }}
              >
                <Ionicons
                  name={starIdx <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={starIdx <= rating ? '#F59E0B' : '#CBD5E1'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Give a Compliment Section */}
        <View style={styles.complimentSection}>
          <Text style={styles.complimentTitle}>Give a compliment</Text>

          <View style={styles.complimentsWrapRow}>
            {COMPLIMENTS.map((item) => {
              const isSelected = selectedCompliments.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[styles.complimentChip, isSelected && styles.complimentChipSelected]}
                  onPress={() => toggleCompliment(item.id)}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.complimentText, isSelected && styles.complimentTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fare Details Card */}
        <View style={styles.fareCard}>
          <Text style={styles.fareCardTitle}>Fare Details</Text>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
            <Text style={styles.fareAmount}>LKR 312.80</Text>
          </View>

          {/* Done Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.doneBtn, rating > 0 && styles.doneBtnActive]}
            onPress={handleDone}
          >
            <Text style={[styles.doneBtnText, rating > 0 && styles.doneBtnTextActive]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  driverHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  driverName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  ratingSubtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  complimentSection: {
    marginBottom: 24,
  },
  complimentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  complimentsWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  complimentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  complimentChipSelected: {
    backgroundColor: '#061138',
    borderColor: '#061138',
  },
  complimentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  complimentTextSelected: {
    color: '#FFFFFF',
  },
  fareCard: {
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
  fareCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  doneBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnActive: {
    backgroundColor: '#061138',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#94A3B8',
  },
  doneBtnTextActive: {
    color: '#FFFFFF',
  },
});
