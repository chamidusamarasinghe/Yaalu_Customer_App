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

export default function OrderDetailsScreen() {
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Top Card */}
        <View style={styles.topCard}>
          <View style={styles.topCardRow}>
            <View style={styles.storeIconCircle}>
              <Ionicons name="storefront-outline" size={24} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderIdTitle}>Order #YA12345</Text>
              <Text style={styles.orderPlacedSubtext}>Placed on 7 May 2023, 10:30 AM</Text>
            </View>
            <View style={styles.preparingBadge}>
              <Text style={styles.preparingText}>PREPARING</Text>
            </View>
          </View>
        </View>

        {/* Store Name Row */}
        <View style={styles.storeRowCard}>
          <View style={styles.smallStoreIcon}>
            <Ionicons name="leaf-outline" size={18} color="#059669" />
          </View>
          <Text style={styles.storeNameText}>Green Mart</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ marginLeft: 'auto' }}
            onPress={() => router.push('/store/1')}
          >
            <Text style={styles.viewShopText}>View Shop ›</Text>
          </TouchableOpacity>
        </View>

        {/* Estimated Delivery Box */}
        <View style={styles.estimatedDeliveryBox}>
          <View style={styles.clockIconCircle}>
            <Ionicons name="time-outline" size={20} color="#D97706" />
          </View>
          <View>
            <Text style={styles.estimatedLabel}>Estimated delivery</Text>
            <Text style={styles.estimatedValue}>Today, 12:00 PM - 12:30 PM</Text>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Items (3)</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsCard}>
          {/* Item 1 */}
          <View style={styles.itemRow}>
            <Image
              source={require('../../assets/images/red_apples.png')}
              style={styles.itemImage}
            />
            <View style={styles.itemInfoCol}>
              <Text style={styles.itemName}>Red Apple 1kg</Text>
              <Text style={styles.itemPrice}>LKR 650.00</Text>
            </View>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x1</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Item 2 */}
          <View style={styles.itemRow}>
            <Image
              source={require('../../assets/images/bananas.png')}
              style={styles.itemImage}
            />
            <View style={styles.itemInfoCol}>
              <Text style={styles.itemName}>Banana 1kg</Text>
              <Text style={styles.itemPrice}>LKR 280.00</Text>
            </View>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x1</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Item 3 */}
          <View style={styles.itemRow}>
            <Image
              source={require('../../assets/images/fresh_milk.png')}
              style={styles.itemImage}
            />
            <View style={styles.itemInfoCol}>
              <Text style={styles.itemName}>Fresh Milk 1L</Text>
              <Text style={styles.itemPrice}>LKR 350.00</Text>
            </View>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x1</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Section */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="location-outline" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressName}>Customer</Text>
              <Text style={styles.addressSubtext}>12/3, Flower Road, Colombo 07</Text>
              <Text style={styles.addressSubtext}>077 123 4567</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="wallet-outline" size={20} color="#059669" />
            </View>
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </View>
        </View>

        {/* Order Summary Section */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal (3 items)</Text>
            <Text style={styles.summaryVal}>LKR 1,280.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>LKR 150.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Convenience Fee</Text>
            <Text style={styles.summaryVal}>LKR 60.00</Text>
          </View>

          <View style={styles.dottedDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValGreen}>LKR 1,490.00</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.navyActionBtn}
            onPress={() => router.push('/orders/status')}
          >
            <Ionicons name="flash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.navyBtnText}>Order Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.navyActionBtn}
            onPress={() => router.push('/orders/track')}
          >
            <Ionicons name="flash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.navyBtnText}>Track Order</Text>
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
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderIdTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderPlacedSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  preparingBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  preparingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  storeRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallStoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  storeNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  viewShopText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  estimatedDeliveryBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  clockIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  estimatedLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  estimatedValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfoCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  qtyBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  addressName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  addressSubtext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  paymentText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  dottedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValGreen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  navyActionBtn: {
    flex: 1,
    backgroundColor: '#061138',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  navyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
