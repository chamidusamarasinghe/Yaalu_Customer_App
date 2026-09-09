import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function RateScreen() {
  const router = useRouter();

  const [driverRating, setDriverRating] = useState(5);
  const [driverReview, setDriverReview] = useState('');

  const [shopRating, setShopRating] = useState(5);
  const [shopReview, setShopReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    Alert.alert(
      'Feedback Submitted!',
      'Thank you for rating your driver and shop. Your review helps us maintain quality service.',
      [
        {
          text: 'View Receipt',
          onPress: () => router.push('/orders/receipt'),
        },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const handleDownloadReceipt = () => {
    router.push('/orders/receipt');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate & Feedback</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Thank You Top Banner */}
        <View style={styles.thankYouBanner}>
          <View style={styles.bannerHeaderRow}>
            <Ionicons name="heart-circle" size={22} color="#059669" style={{ marginRight: 6 }} />
            <Text style={styles.thankYouTitle}>How was your overall experience?</Text>
          </View>
          <Text style={styles.thankYouSubtext}>Your rating helps us improve our service & reward drivers</Text>
        </View>

        {/* Card 1: Rate the driver */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainTitle}>Rate the driver</Text>

          {/* Driver Row */}
          <View style={styles.profileRow}>
            <View style={styles.driverAvatarContainer}>
              <Ionicons name="person" size={24} color="#061138" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.profileName}>Dinesh Perera</Text>
                <Text style={styles.ratingText}>★ 4.9</Text>
              </View>
              <Text style={styles.profileSubtext}>Your Delivery Partner</Text>
            </View>
          </View>

          {/* Rate Driver Stars */}
          <Text style={styles.sectionLabel}>Rate Driver</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setDriverRating(star)} activeOpacity={0.7}>
                <Ionicons
                  name={star <= driverRating ? 'star' : 'star-outline'}
                  size={32}
                  color="#FDB813"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Text Input */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewLabel}>
              Write a review <Text style={styles.optionalText}>(optional)</Text>
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience with the driver..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={200}
              value={driverReview}
              onChangeText={setDriverReview}
              textAlignVertical="top"
            />
            <Text style={styles.charCounter}>{driverReview.length}/200</Text>
          </View>
        </View>

        {/* Card 2: Rate the shop */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainTitle}>Rate the shop</Text>

          {/* Shop Row */}
          <View style={styles.profileRow}>
            <View style={styles.storeIconCircle}>
              <Ionicons name="storefront-outline" size={22} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Green Mart - Nugegoda</Text>
              <Text style={styles.profileSubtext}>Merchant / Shop</Text>
            </View>
          </View>

          {/* Rate Shop Stars */}
          <Text style={styles.sectionLabel}>Rate Shop</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setShopRating(star)} activeOpacity={0.7}>
                <Ionicons
                  name={star <= shopRating ? 'star' : 'star-outline'}
                  size={32}
                  color="#FDB813"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Text Input */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewLabel}>
              Write a review <Text style={styles.optionalText}>(optional)</Text>
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience with the shop..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={200}
              value={shopReview}
              onChangeText={setShopReview}
              textAlignVertical="top"
            />
            <Text style={styles.charCounter}>{shopReview.length}/200</Text>
          </View>
        </View>

        {/* Primary Buttons */}
        <TouchableOpacity activeOpacity={0.88} style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* Download / View Receipt Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.downloadBtn}
          onPress={handleDownloadReceipt}
        >
          <Ionicons name="download-outline" size={20} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <CustomBottomTabBar activeTab="ORDERS" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0A0E1A' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 100 : 80 },
  thankYouBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  thankYouTitle: { fontSize: 16, fontWeight: '800', color: '#059669' },
  thankYouSubtext: { fontSize: 13, color: '#475569', textAlign: 'center' },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardMainTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  driverAvatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF08A', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  storeIconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  profileName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#D97706', marginLeft: 6 },
  profileSubtext: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  starsRow: { flexDirection: 'row', marginBottom: 14 },
  reviewHeaderRow: { marginBottom: 6 },
  reviewLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  optionalText: { fontSize: 13, fontWeight: '400', color: '#94A3B8' },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  textArea: { fontSize: 14, color: '#0F172A', minHeight: 64 },
  charCounter: { fontSize: 11, color: '#94A3B8', alignSelf: 'flex-end', marginTop: 4 },
  submitBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  downloadBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#061138',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  downloadBtnText: { color: '#061138', fontSize: 16, fontWeight: '800' },
});
