import React, { useState, useEffect } from 'react';
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
import { cartService, CartItem } from '../../services/api/cart-service';
import { orderService } from '../../services/api/order-service';
import { authService } from '../../services/api/auth-service';

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(cartService.getItems());
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to dynamic cart updates
    const unsubscribe = cartService.subscribe((updatedItems) => {
      setItems(updatedItems);
    });
    return () => unsubscribe();
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    cartService.updateQuantity(productId, delta);
  };

  const removeItem = (productId: string) => {
    cartService.removeItem(productId);
  };

  const clearAll = () => {
    cartService.clearCart();
  };

  const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 250 : 0;
  const convenienceFee = items.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee + convenienceFee;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const user = authService.getUser();
      const customerId = user?.id || 'guest_user';
      const customerName = user?.fullName || 'Customer';

      // Group items for order payload
      const orderPayload = {
        merchantId: items[0]?.merchantId || 'default',
        customerId,
        customerName,
        notes: 'Customer App Mobile Order',
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.title,
          quantity: i.quantity,
          unitPrice: i.priceValue,
        })),
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      cartService.clearCart();

      Alert.alert(
        'Order Placed Successfully!',
        `Order #${createdOrder.id?.substring(0, 8) || 'YAALU'} has been saved to your account.`,
        [
          {
            text: 'View Activities',
            onPress: () => router.push('/(tabs)/orders' as any),
          },
        ]
      );
    } catch (err: any) {
      console.warn('[Checkout Error]:', err);
      Alert.alert('Checkout Failed', err?.message || 'Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {items.length > 0 ? (
          <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn} onPress={clearAll}>
            <View style={styles.clearBadge}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          /* Empty Cart State */
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={72} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No products in the cart</Text>
            <Text style={styles.emptySubtitle}>Add items from your favorite shops to start your order.</Text>
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.shopNowBtn}
              onPress={() => router.push('/(tabs)/explore' as any)}
            >
              <Text style={styles.shopNowBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/red_apples.png')}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.itemInfo}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => removeItem(item.productId)}>
                        <Ionicons name="close" size={18} color="#94A3B8" />
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
                          onPress={() => updateQuantity(item.productId, -1)}
                        >
                          <Ionicons name="remove" size={16} color="#0F172A" />
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.quantity}</Text>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.productId, 1)}
                        >
                          <Ionicons name="add" size={16} color="#0F172A" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.itemTotalPrice}>LKR {(item.priceValue * item.quantity).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Bill Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>LKR {subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>LKR {deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>LKR {convenienceFee.toFixed(2)}</Text>
              </View>

              <View style={styles.dividerDashed} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>LKR {total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Payment Method Selector */}
            <TouchableOpacity activeOpacity={0.88} style={styles.paymentMethodCard}>
              <View style={styles.paymentIconSquare}>
                <Ionicons name="wallet-outline" size={22} color="#D97706" />
              </View>

              <View style={styles.paymentInfoCol}>
                <Text style={styles.paymentTitle}>Payment Method</Text>
                <Text style={styles.paymentSubtext}>Cash on Delivery</Text>
              </View>

              <View style={styles.changeLinkRow}>
                <Text style={styles.changeLinkText}>Active</Text>
              </View>
            </TouchableOpacity>

            {/* Checkout Action Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.proceedBtn}
              onPress={handleCheckout}
              disabled={submitting}
            >
              {submitting ? (
                <Text style={styles.proceedBtnText}>Saving Order to Database...</Text>
              ) : (
                <>
                  <Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.proceedBtnText}>Place Order (LKR {total.toFixed(2)})</Text>
                </>
              )}
            </TouchableOpacity>
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
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
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
  },
  itemImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  itemImage: { width: '100%', height: '100%' },
  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
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
  changeLinkText: { fontSize: 13, fontWeight: '700', color: '#059669' },
  proceedBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  proceedBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
