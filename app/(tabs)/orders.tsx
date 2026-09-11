import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { orderService, OrderResponse } from '../../services/api/order-service';
import { authService } from '../../services/api/auth-service';

export default function ActivitiesScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Ongoing' | 'Completed' | 'Cancelled'>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadActivities = async () => {
    try {
      const user = authService.getUser();
      const customerId = user?.id;
      const fetchedOrders = await orderService.getCustomerOrders(customerId);
      setOrders(fetchedOrders || []);
    } catch (err) {
      console.warn('[ActivitiesScreen Load Error]:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  const filteredOrders = orders.filter((o) => {
    const statusLower = (o.status || '').toLowerCase();
    if (activeTab === 'Ongoing') {
      return statusLower === 'pending' || statusLower === 'confirmed' || statusLower === 'processing' || statusLower === 'shipped';
    }
    if (activeTab === 'Completed') {
      return statusLower === 'delivered';
    }
    if (activeTab === 'Cancelled') {
      return statusLower === 'cancelled';
    }
    return true;
  });

  const handleCardPress = (orderId: string) => {
    router.push({
      pathname: '/orders/details',
      params: { orderId },
    } as any);
  };

  const handleStatusPress = (orderId: string) => {
    router.push({
      pathname: '/orders/status',
      params: { orderId },
    } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#061138" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activities</Text>
          <View style={{ width: 34 }} />
        </View>

        {/* Filter Navigation Tabs */}
        <View style={styles.tabsRow}>
          {(['All', 'Ongoing', 'Completed', 'Cancelled'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                {isActive && <View style={styles.activeIndicatorBar} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Activities Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FDB813']} />}
      >
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FDB813" />
            <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Loading user activities...</Text>
          </View>
        ) : (
          <View>
            {/* Rides & Driver Bidding Activity Section */}
            {(activeTab === 'All' || activeTab === 'Completed') && (
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.orderCard}
                onPress={() => router.push('/rides/trip-completed' as any)}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="car-sport" size={22} color="#D97706" />
                  </View>

                  <View style={styles.cardMainCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.orderIdText}>Ride #RIDE-1001</Text>
                      <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginLeft: 6, borderWidth: 1, borderColor: '#BFDBFE' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563EB' }}>One Way ➔</Text>
                      </View>
                    </View>
                    <Text style={styles.storeNameText}>City Ride • Driver Ravi S.</Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#166534' }]}>
                      COMPLETED
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryBottomRow}>
                  <View>
                    <Text style={styles.summaryText}>Bidding Ride • LKR 1,350.00</Text>
                    <Text style={styles.dateText}>Today, 10:30 AM</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.statusBtn, { borderColor: '#D97706', backgroundColor: '#FFFBEB' }]}
                    onPress={() => router.push('/rides/rate-driver' as any)}
                  >
                    <Ionicons name="star" size={14} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBtnText, { color: '#D97706' }]}>View Receipt</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}

            {filteredOrders.length === 0 && activeTab !== 'All' && activeTab !== 'Completed' ? (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={64} color="#CBD5E1" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No activities yet</Text>
                <Text style={styles.emptySubtitle}>You haven't completed any rides or shop purchases yet.</Text>
              </View>
            ) : (
              filteredOrders.map((order) => {
                const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Recent';

                const itemsCount = order.items ? order.items.length : 0;
                const totalVal = typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(order.totalAmount as string) || 0;

                return (
                  <TouchableOpacity
                    key={order.id}
                    activeOpacity={0.88}
                    style={styles.orderCard}
                    onPress={() => handleCardPress(order.id)}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={[styles.iconCircle, { backgroundColor: '#E6F4EA' }]}>
                        <Ionicons name="cart-outline" size={22} color="#059669" />
                      </View>

                      <View style={styles.cardMainCol}>
                        <Text style={styles.orderIdText}>Order #{order.id.substring(0, 8).toUpperCase()}</Text>
                        <Text style={styles.storeNameText}>{order.customerName || 'Fresh Harvest Shop'}</Text>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: order.status === 'delivered' ? '#DCFCE7' : '#FEF3C7' }]}>
                        <Text style={[styles.statusBadgeText, { color: order.status === 'delivered' ? '#166534' : '#D97706' }]}>
                          {(order.status || 'PENDING').toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.summaryBottomRow}>
                      <View>
                        <Text style={styles.summaryText}>
                          {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} • LKR {totalVal.toFixed(2)}
                        </Text>
                        <Text style={styles.dateText}>{dateStr}</Text>
                      </View>

                      {/* Section Order Status Button */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.statusBtn}
                        onPress={() => handleStatusPress(order.id)}
                      >
                        <Ionicons name="time-outline" size={15} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.statusBtnText}>Order Status</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0A0E1A' },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  tabChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabChipActive: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A6800',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  activeIndicatorBar: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardMainCol: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  storeNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  summaryBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
});
