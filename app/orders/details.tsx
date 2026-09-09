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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { orderService, OrderResponse } from '../../services/api/order-service';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      if (params.orderId) {
        const data = await orderService.getCustomerOrders();
        const found = data.find((o) => o.id === params.orderId);
        if (found) {
          setOrder(found);
        }
      }
    } catch (err) {
      console.warn('[OrderDetails fetch error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const orderIdDisplay = order ? `#${order.id.slice(0, 8).toUpperCase()}` : (params.orderId ? `#${params.orderId.slice(0, 8).toUpperCase()}` : '#YA12345');
  const dateStr = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : '7 May 2023, 10:30 AM';

  const orderItems = order?.items && order.items.length > 0 ? order.items : [
    { id: '1', productName: 'Red Apple 1kg', quantity: 1, unitPrice: 650, subtotal: 650, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80' },
    { id: '2', productName: 'Banana 1kg', quantity: 1, unitPrice: 280, subtotal: 280, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80' },
    { id: '3', productName: 'Fresh Milk 1L', quantity: 1, unitPrice: 350, subtotal: 350, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80' },
  ];

  const subtotalVal = orderItems.reduce((sum, item) => sum + (typeof item.subtotal === 'number' ? item.subtotal : parseFloat(item.subtotal as string) || 0), 0);
  const deliveryFee = 150;
  const convenienceFee = 60;
  const totalVal = subtotalVal + deliveryFee + convenienceFee;

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
              <Text style={styles.orderIdTitle}>Order {orderIdDisplay}</Text>
              <Text style={styles.orderPlacedSubtext}>Placed on {dateStr}</Text>
            </View>
            <View style={styles.preparingBadge}>
              <Text style={styles.preparingText}>{(order?.status || 'PREPARING').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Store Name Row */}
        <View style={styles.storeRowCard}>
          <View style={styles.smallStoreIcon}>
            <Ionicons name="leaf-outline" size={18} color="#059669" />
          </View>
          <Text style={styles.storeNameText}>{order?.customerName || 'Green Mart'}</Text>
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
            <Text style={styles.estimatedValue}>Today, 20-30 mins</Text>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Items ({orderItems.length})</Text>
        </View>

        <View style={styles.itemsCard}>
          {orderItems.map((item, index) => {
            const priceVal = typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice as string) || 0;
            const imgUri = item.imageUrl || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80';

            return (
              <React.Fragment key={item.id || index}>
                <View style={styles.itemRow}>
                  <Image
                    source={{ uri: imgUri }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemInfoCol}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemPrice}>LKR {priceVal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyText}>x{item.quantity}</Text>
                  </View>
                </View>
                {index < orderItems.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Delivery Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="location-outline" size={22} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressName}>Delivery Address</Text>
              <Text style={styles.addressSubtext}>No. 42, Green Avenue, Colombo 03</Text>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({orderItems.length} items)</Text>
            <Text style={styles.summaryVal}>LKR {subtotalVal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>LKR {deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Convenience Fee</Text>
            <Text style={styles.summaryVal}>LKR {convenienceFee.toFixed(2)}</Text>
          </View>

          <View style={styles.dottedDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValGreen}>LKR {totalVal.toFixed(2)}</Text>
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
            <Ionicons name="location-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.navyBtnText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topCardRow: { flexDirection: 'row', alignItems: 'center' },
  storeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderIdTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  orderPlacedSubtext: { fontSize: 12, color: '#64748B', marginTop: 2 },
  preparingBadge: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  preparingText: { fontSize: 11, fontWeight: '800', color: '#D97706' },
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
  storeNameText: { fontSize: 16, fontWeight: '800', color: '#059669' },
  viewShopText: { fontSize: 14, fontWeight: '700', color: '#059669' },
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
  estimatedLabel: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  estimatedValue: { fontSize: 15, fontWeight: '800', color: '#B45309', marginTop: 1 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginTop: 6 },
  itemsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemImage: { width: 52, height: 52, borderRadius: 12, marginRight: 12, backgroundColor: '#F1F5F9' },
  itemInfoCol: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  qtyBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  qtyText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  infoCardRow: { flexDirection: 'row', alignItems: 'center' },
  greenIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  addressSubtext: { fontSize: 13, color: '#64748B', marginTop: 2 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#64748B' },
  summaryVal: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  dottedDivider: { height: 1, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  totalValGreen: { fontSize: 18, fontWeight: '900', color: '#059669' },
  actionButtonsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  navyActionBtn: {
    flex: 1,
    backgroundColor: '#061138',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navyBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
