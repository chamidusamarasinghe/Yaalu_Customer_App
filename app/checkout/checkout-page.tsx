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

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: any;
}

const CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: '1',
    title: 'Red Apple (1kg)',
    price: 650,
    quantity: 1,
    image: require('../../assets/images/red_apples.png'),
  },
  {
    id: '2',
    title: 'Banana (1kg)',
    price: 350,
    quantity: 1,
    image: require('../../assets/images/bananas.png'),
  },
  {
    id: '3',
    title: 'Fresh Milk (1L)',
    price: 290,
    quantity: 1,
    image: require('../../assets/images/fresh_milk.png'),
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CheckoutItem[]>(CHECKOUT_ITEMS);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 250;
  const convenienceFee = 30;
  const total = subtotal + deliveryFee + convenienceFee;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Top Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#061138" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changeGreenText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.addressRow}>
            <View style={styles.pinCircle}>
              <Ionicons name="location" size={20} color="#059669" />
            </View>
            <View style={styles.addressCol}>
              <Text style={styles.addressName}>Home</Text>
              <Text style={styles.addressSub}>
                No. 42, Green Avenue, Colombo 07, Sri Lanka
              </Text>
              <View style={styles.estRow}>
                <Ionicons name="time-outline" size={14} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.estText}>Est. Delivery: 20 – 30 mins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>{items.length} Items</Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>LKR {item.price.toFixed(2)}</Text>
                <View style={styles.qtyContainer}>
                  <Text style={styles.qtyText}>-  {item.quantity}  +</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7} style={styles.trashBtn}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Payment Method Selector Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.card}
          onPress={() => router.push('/checkout/payment' as any)}
        >
          <View style={styles.paymentRow}>
            <View style={styles.walletSquare}>
              <Ionicons name="cash-outline" size={22} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>Cash on Delivery</Text>
              <Text style={styles.paymentSub}>Pay when your order arrives</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/checkout/payment' as any)}>
              <Text style={styles.changeGreenText}>Change</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Price Breakdown Card */}
        <View style={styles.priceBreakdownCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sub Total</Text>
            <Text style={styles.priceVal}>LKR {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.priceLabel}>Delivery Fee </Text>
              <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
            </View>
            <Text style={styles.priceVal}>LKR {deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.priceLabel}>Convenience Fee </Text>
              <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
            </View>
            <Text style={styles.priceVal}>LKR {convenienceFee.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValGreen}>LKR {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustItem}>
            <View style={styles.trustCircle}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
            </View>
            <Text style={styles.trustText}>100% Secure{'\n'}Payments</Text>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.trustCircle}>
              <Ionicons name="bus-outline" size={18} color="#059669" />
            </View>
            <Text style={styles.trustText}>Fast Doorstep{'\n'}Delivery</Text>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.trustCircle}>
              <Ionicons name="star-outline" size={18} color="#059669" />
            </View>
            <Text style={styles.trustText}>Best Quality{'\n'}Guaranteed</Text>
          </View>
        </View>

        {/* Primary Confirm Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.confirmBtn}
          onPress={() => router.push('/checkout/success' as any)}
        >
          <Ionicons name="bag-handle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.confirmBtnText}>Confirm Order</Text>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  changeGreenText: { fontSize: 14, fontWeight: '800', color: '#059669' },
  itemBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  itemBadgeText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressRow: { flexDirection: 'row' },
  pinCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressCol: { flex: 1 },
  addressName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  addressSub: { fontSize: 13, color: '#64748B', marginTop: 2, lineHeight: 18 },
  estRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  estText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  itemsList: { gap: 12, marginBottom: 18 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemImage: { width: 56, height: 56, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#059669', marginVertical: 2 },
  qtyContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  qtyText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  trashBtn: { padding: 4 },
  paymentRow: { flexDirection: 'row', alignItems: 'center' },
  walletSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  paymentSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  priceBreakdownCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 14, color: '#64748B' },
  priceVal: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#CBD5E1', marginVertical: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  totalValGreen: { fontSize: 20, fontWeight: '900', color: '#059669' },
  trustBadgesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  trustItem: { flex: 1, alignItems: 'center' },
  trustCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  trustText: { fontSize: 10, color: '#475569', textAlign: 'center', fontWeight: '600', lineHeight: 14 },
  confirmBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
