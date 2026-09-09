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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function DeliveredScreen() {
  const router = useRouter();

  const driverRating = 5;
  const shopRating = 5;

  const handleOpenRateScreen = () => {
    router.push('/orders/rate');
  };

  const handleViewReceipt = () => {
    router.push('/orders/receipt');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Delivered</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Hero Checkmark */}
        <View style={styles.heroContainer}>
          <View style={styles.greenCheckBadge}>
            <Ionicons name="checkmark-sharp" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.orderDeliveredTitle}>Order Delivered!</Text>
          <Text style={styles.orderDeliveredSubtext}>Your package was handed over successfully.</Text>
        </View>

        {/* Order Info & Driver Summary Card */}
        <Text style={styles.sectionHeaderLabel}>DELIVERY SUMMARY</Text>
        <View style={styles.cardContainer}>
          <View style={styles.summaryRowItem}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="bag-check-outline" size={22} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryItemTitle}>Fresh Harvest Goods</Text>
              <Text style={styles.summaryItemSubtext}>Order #YA12345678 • Delivered Today</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.summaryRowItem}>
            <View style={styles.driverAvatarContainer}>
              <Ionicons name="person" size={24} color="#061138" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.summaryItemTitle}>Dinesh Perera</Text>
                <Text style={styles.driverStarRating}>★ 4.9</Text>
              </View>
              <Text style={styles.summaryItemSubtext}>Delivery Driver • Honda Supra (WP BZ-4892)</Text>
            </View>

            <View style={styles.driverActionsRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.lightCallBtn}>
                <Ionicons name="call-outline" size={18} color="#061138" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.darkChatBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValBold}>Paid Online via Card</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Paid</Text>
            <Text style={[styles.detailValBold, { color: '#059669' }]}>LKR 1,570.00</Text>
          </View>
        </View>

        {/* HOW WAS YOUR EXPERIENCE? Card Section (Clickable) */}
        <Text style={styles.sectionHeaderLabel}>RATE YOUR EXPERIENCE</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.experienceCardWrapper}
          onPress={handleOpenRateScreen}
        >
          <View style={styles.experienceHeaderRow}>
            <View style={styles.starIconBadge}>
              <Ionicons name="star" size={20} color="#EAB308" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.experienceTitle}>How was your experience?</Text>
              <Text style={styles.experienceSubtext}>Tap to leave feedback & review the shop/driver</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#059669" />
          </View>

          <View style={styles.dualRatingRow}>
            {/* Rate Driver Box */}
            <View style={styles.ratingSubCard}>
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
            </View>

            {/* Rate Shop Box */}
            <View style={styles.ratingSubCard}>
              <View style={styles.ratingIconCircle}>
                <Ionicons name="storefront-outline" size={20} color="#059669" />
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
            </View>
          </View>
        </TouchableOpacity>

        {/* Action Buttons: Download / View Receipt */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.downloadBtn}
          onPress={handleViewReceipt}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.viewReceiptBtn}
          onPress={handleViewReceipt}
        >
          <Ionicons name="document-text-outline" size={20} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.viewReceiptBtnText}>View Receipt</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 100 : 80 },
  heroContainer: { alignItems: 'center', marginBottom: 20 },
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
  orderDeliveredTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  orderDeliveredSubtext: { fontSize: 14, color: '#64748B' },
  sectionHeaderLabel: { fontSize: 13, fontWeight: '800', color: '#475569', letterSpacing: 0.5, marginBottom: 10, marginTop: 4 },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  greenIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryItemTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  summaryItemSubtext: { fontSize: 12, color: '#64748B', marginTop: 2 },
  driverAvatarContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF08A', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  driverStarRating: { fontSize: 13, fontWeight: '800', color: '#D97706', marginLeft: 6 },
  driverActionsRow: { flexDirection: 'row', gap: 8 },
  lightCallBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  darkChatBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#061138', alignItems: 'center', justifyContent: 'center' },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 14, color: '#64748B' },
  detailValBold: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  experienceCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FDB813',
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  experienceHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  starIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  experienceTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  experienceSubtext: { fontSize: 12, color: '#64748B', marginTop: 2 },
  dualRatingRow: { flexDirection: 'row', gap: 12 },
  ratingSubCard: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, alignItems: 'center' },
  ratingIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  ratingSubTitle: { fontSize: 11, fontWeight: '900', color: '#475569', letterSpacing: 0.5, marginBottom: 6 },
  starsRow: { flexDirection: 'row' },
  downloadBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  downloadBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  viewReceiptBtn: {
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
  viewReceiptBtnText: { color: '#061138', fontSize: 16, fontWeight: '800' },
});
