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

interface CartItem {
  id: string;
  title: string;
  unitPriceStr: string;
  unitLabel: string;
  priceValue: number;
  quantity: number;
  image: any;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    title: 'Red Apple (1kg)',
    unitPriceStr: 'LKR 650.00',
    unitLabel: '/kg',
    priceValue: 650,
    quantity: 1,
    image: require('../../assets/images/red_apples.png'),
  },
  {
    id: '2',
    title: 'Banana (1kg)',
    unitPriceStr: 'LKR 350.00',
    unitLabel: '/kg',
    priceValue: 350,
    quantity: 1,
    image: require('../../assets/images/bananas.png'),
  },
  {
    id: '3',
    title: 'Fresh Milk (1L)',
    unitPriceStr: 'LKR 290.00',
    unitLabel: '/L',
    priceValue: 290,
    quantity: 1,
    image: require('../../assets/images/fresh_milk.png'),
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 250 : 0;
  const convenienceFee = items.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee + convenienceFee;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn} onPress={clearAll}>
          <View style={styles.clearBadge}>
            <Ionicons name="trash-outline" size={20} color="#64748B" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={72} color="#94A3B8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Explore nearby shops and add fresh products to your cart!</Text>
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.shopNowBtn}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.shopNowBtnText}>Explore Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                  </View>

                  <View style={styles.itemInfo}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => removeItem(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemUnitPrice}>
                      {item.unitPriceStr} <Text style={styles.unitLabel}>{item.unitLabel}</Text>
                    </Text>

                    <View style={styles.itemBottomRow}>
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Ionicons name="remove" size={14} color="#0F172A" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Ionicons name="add" size={14} color="#0F172A" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.itemTotalPrice}>
                        LKR {(item.priceValue * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub Total</Text>
                <Text style={styles.summaryValue}>LKR {subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.summaryLabel}>Delivery Fee </Text>
                  <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
                </View>
                <Text style={styles.summaryValue}>LKR {deliveryFee.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.summaryLabel}>Convenience Fee </Text>
                  <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
                </View>
                <Text style={styles.summaryValue}>LKR {convenienceFee.toFixed(2)}</Text>
              </View>

              <View style={styles.dividerDashed} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>LKR {total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Payment Method Selector Card */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.paymentMethodCard}
              onPress={() => router.push('/checkout/payment' as any)}
            >
              <View style={styles.paymentIconSquare}>
                <Ionicons name="wallet-outline" size={22} color="#D97706" />
              </View>

              <View style={styles.paymentInfoCol}>
                <Text style={styles.paymentTitle}>Payment Method</Text>
                <Text style={styles.paymentSubtext}>Cash on Delivery</Text>
              </View>

              <View style={styles.changeLinkRow}>
                <Text style={styles.changeLinkText}>Change</Text>
                <Ionicons name="chevron-forward" size={16} color="#0036AA" />
              </View>
            </TouchableOpacity>

            {/* Primary Action Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.proceedBtn}
              onPress={() => router.push('/checkout/checkout-page' as any)}
            >
              <Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.proceedBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            {/* Trust Badges Row */}
            <View style={styles.trustBadgesRow}>
              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
                </View>
                <Text style={styles.badgeText}>100% Secure{'\n'}Payments</Text>
              </View>

              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="bus-outline" size={18} color="#0036AA" />
                </View>
                <Text style={styles.badgeText}>Fast Delivery{'\n'}at your doorstep</Text>
              </View>

              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="star-outline" size={18} color="#D97706" />
                </View>
                <Text style={styles.badgeText}>Best Quality{'\n'}Guaranteed</Text>
              </View>
            </View>
          </>
        )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#061138' },
  clearBtn: { padding: 4 },
  clearBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  shopNowBtn: { backgroundColor: '#061138', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 },
  shopNowBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  itemsList: { gap: 14, marginBottom: 16 },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemImage: { width: 68, height: 68 },
  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  itemUnitPrice: { fontSize: 13, fontWeight: '700', color: '#0036AA', marginTop: 2 },
  unitLabel: { fontSize: 12, fontWeight: '500', color: '#64748B' },
  itemBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: { width: 26, height: 26, borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  qtyText: { fontSize: 14, fontWeight: '800', color: '#0F172A', paddingHorizontal: 10 },
  itemTotalPrice: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  dividerDashed: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#0036AA' },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfoCol: { flex: 1 },
  paymentTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  paymentSubtext: { fontSize: 13, color: '#64748B', marginTop: 2 },
  changeLinkRow: { flexDirection: 'row', alignItems: 'center' },
  changeLinkText: { fontSize: 14, fontWeight: '700', color: '#0036AA', marginRight: 2 },
  proceedBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  trustBadgesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  badgeItem: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  badgeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeText: { fontSize: 10, color: '#64748B', textAlign: 'center', fontWeight: '600', lineHeight: 14 },
});
