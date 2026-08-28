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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function DeliveryCompletedScreen() {
  const router = useRouter();
  const [driverRating, setDriverRating] = useState(5);
  const [shopRating, setShopRating] = useState(5);

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
        <Text style={styles.headerTitle}>Delivery Completed</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Header */}
        <View style={styles.heroContainer}>
          {/* Confetti Dots Simulation */}
          <View style={styles.confettiContainer}>
            <View style={[styles.confettiDot, { top: 4, left: '25%', backgroundColor: '#EC4899' }]} />
            <View style={[styles.confettiDot, { top: 12, right: '28%', backgroundColor: '#EAB308' }]} />
            <View style={[styles.confettiDot, { bottom: 8, left: '20%', backgroundColor: '#3B82F6' }]} />
            <View style={[styles.confettiDot, { bottom: 16, right: '22%', backgroundColor: '#A855F7' }]} />
          </View>

          {/* Big Green Check Circle */}
          <View style={styles.greenCheckBadge}>
            <Ionicons name="checkmark" size={38} color="#FFFFFF" />
          </View>

          <Text style={styles.orderDeliveredTitle}>Order Delivered!</Text>
          <Text style={styles.orderDeliveredSubtext}>Thank you for shopping with YAALU.</Text>
        </View>

        {/* Section Header */}
        <Text style={styles.sectionHeaderLabel}>DELIVERY SUMMARY</Text>

        {/* Card 1: Delivery Summary Locations & Driver */}
        <View style={styles.cardContainer}>
          {/* Store Row */}
          <TouchableOpacity activeOpacity={0.7} style={styles.summaryRowItem}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="storefront-outline" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryItemTitle}>Green Mart - Nugegoda</Text>
              <Text style={styles.summaryItemSubtext}>Shop</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Address Row */}
          <TouchableOpacity activeOpacity={0.7} style={styles.summaryRowItem}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="location-outline" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryItemTitle}>123, Flower Road, Colombo 07</Text>
              <Text style={styles.summaryItemSubtext}>Delivery Address</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Driver Row */}
          <View style={styles.summaryRowItem}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.driverAvatarImage}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.summaryItemTitle}>Dinesh Perera</Text>
                <Text style={styles.driverStarRating}>★ 4.8</Text>
              </View>
              <Text style={styles.summaryItemSubtext}>Your Delivery Partner</Text>
            </View>

            <View style={styles.driverActionsRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.lightCallBtn}>
                <Ionicons name="call-outline" size={18} color="#475569" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.darkChatBtn}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card 2: Delivery Details */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardHeaderTitle}>Delivery Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeftRow}>
              <Ionicons name="time-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.detailLabel}>Time Delivered</Text>
            </View>
            <Text style={styles.detailValBold}>11:18 AM</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeftRow}>
              <Ionicons name="bag-handle-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.detailLabel}>Items</Text>
            </View>
            <Text style={styles.detailValBold}>3 Items</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeftRow}>
              <Ionicons name="receipt-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.detailLabel}>Total Cost</Text>
            </View>
            <Text style={styles.detailValBold}>LKR 1,570.00</Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValBold}>Cash on Delivery</Text>
          </View>
        </View>

        {/* Success Alert Banner */}
        <View style={styles.successBanner}>
          <View style={styles.bannerCheckCircle}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.bannerText}>Your order has been delivered successfully.</Text>
        </View>

        {/* Card 3: Experience Rating */}
        <View style={styles.cardContainer}>
          <Text style={styles.experienceTitle}>How was your experience?</Text>
          <Text style={styles.experienceSubtext}>Rate your experience with the driver and shop.</Text>

          <View style={styles.dualRatingRow}>
            {/* Rate Driver Box */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.ratingSubCard}
              onPress={() => router.push('/orders/rate')}
            >
              <View style={styles.ratingIconCircle}>
                <Ionicons name="person-outline" size={20} color="#059669" />
              </View>
              <Text style={styles.ratingSubTitle}>RATE DRIVER</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= driverRating ? 'star' : 'star-outline'}
                    size={14}
                    color="#EAB308"
                    style={{ marginHorizontal: 1 }}
                  />
                ))}
              </View>
            </TouchableOpacity>

            {/* Rate Shop Box */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.ratingSubCard}
              onPress={() => router.push('/orders/rate')}
            >
              <View style={styles.ratingIconCircle}>
                <Ionicons name="cart-outline" size={20} color="#059669" />
              </View>
              <Text style={styles.ratingSubTitle}>RATE SHOP</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= shopRating ? 'star' : 'star-outline'}
                    size={14}
                    color="#EAB308"
                    style={{ marginHorizontal: 1 }}
                  />
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.downloadBtn}
          onPress={() => router.push('/orders/receipt')}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.viewReceiptBtn}
          onPress={() => router.push('/orders/receipt')}
        >
          <Text style={styles.viewReceiptBtnText}>View Receipt</Text>
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
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greenCheckBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  orderDeliveredTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  orderDeliveredSubtext: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionHeaderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
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
  summaryRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  greenIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryItemSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  driverAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  driverStarRating: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
    marginLeft: 6,
  },
  driverActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  lightCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#061138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  detailValBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 2,
  },
  experienceSubtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  dualRatingRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingSubCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  ratingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingSubTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
  },
  downloadBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  viewReceiptBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#061138',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  viewReceiptBtnText: {
    color: '#061138',
    fontSize: 16,
    fontWeight: '800',
  },
});
