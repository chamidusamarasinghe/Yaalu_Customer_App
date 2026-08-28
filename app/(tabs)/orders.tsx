import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface OrderItem {
  id: string;
  storeName: string;
  itemsCount: string;
  total: string;
  date: string;
  statusLabel: string;
  statusType: 'preparing' | 'out_for_delivery' | 'ready_for_pickup' | 'delivered' | 'cancelled';
  tabCategory: 'Ongoing' | 'Completed' | 'Cancelled';
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeTextColor: string;
  buttonLabel: string;
  buttonType: 'green' | 'dark';
  statusRoute: string;
  detailsRoute: string;
}

const ORDERS_LIST: OrderItem[] = [
  {
    id: '#YA12345',
    storeName: 'Green Mart',
    itemsCount: '3 Items',
    total: 'LKR 1,570.00',
    date: 'Today, 10:30 AM',
    statusLabel: 'Preparing',
    statusType: 'preparing',
    tabCategory: 'Ongoing',
    iconName: 'cart-outline',
    iconBg: '#E6F4EA',
    iconColor: '#059669',
    badgeBg: '#FEF3C7',
    badgeTextColor: '#D97706',
    buttonLabel: 'Order status',
    buttonType: 'green',
    statusRoute: '/orders/status',
    detailsRoute: '/orders/details',
  },
  {
    id: '#YA12346',
    storeName: 'Fresh Basket',
    itemsCount: '5 Items',
    total: 'LKR 2,340.00',
    date: 'Today, 11:15 AM',
    statusLabel: 'Out for Delivery',
    statusType: 'out_for_delivery',
    tabCategory: 'Ongoing',
    iconName: 'bus-outline',
    iconBg: '#E8F0FE',
    iconColor: '#2563EB',
    badgeBg: '#DBEAFE',
    badgeTextColor: '#1D4ED8',
    buttonLabel: 'Order Status',
    buttonType: 'green',
    statusRoute: '/orders/track',
    detailsRoute: '/orders/details',
  },
  {
    id: '#YA12347',
    storeName: 'Happy Grocers',
    itemsCount: '2 Items',
    total: 'LKR 980.00',
    date: 'Today, 09:20 AM',
    statusLabel: 'Ready for Pickup',
    statusType: 'ready_for_pickup',
    tabCategory: 'Ongoing',
    iconName: 'bag-handle-outline',
    iconBg: '#F3E8FF',
    iconColor: '#7E22CE',
    badgeBg: '#F3E8FF',
    badgeTextColor: '#7E22CE',
    buttonLabel: 'order status',
    buttonType: 'green',
    statusRoute: '/orders/status',
    detailsRoute: '/orders/details',
  },
  {
    id: '#YA12330',
    storeName: 'Super Mart',
    itemsCount: '4 Items',
    total: 'LKR 2,150.00',
    date: 'Yesterday, 06:45 PM',
    statusLabel: 'Delivered',
    statusType: 'delivered',
    tabCategory: 'Completed',
    iconName: 'checkmark-circle-outline',
    iconBg: '#DCFCE7',
    iconColor: '#166534',
    badgeBg: '#DCFCE7',
    badgeTextColor: '#166534',
    buttonLabel: 'View Details',
    buttonType: 'dark',
    statusRoute: '/orders/delivered',
    detailsRoute: '/orders/details',
  },
  {
    id: '#YA12329',
    storeName: 'Daily Needs',
    itemsCount: '6 Items',
    total: 'LKR 3,560.00',
    date: 'Yesterday, 04:30 PM',
    statusLabel: 'Cancelled',
    statusType: 'cancelled',
    tabCategory: 'Cancelled',
    iconName: 'close-circle-outline',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeTextColor: '#DC2626',
    buttonLabel: 'View Details',
    buttonType: 'dark',
    statusRoute: '/orders/details',
    detailsRoute: '/orders/details',
  },
];

export default function MyOrdersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Ongoing' | 'Completed' | 'Cancelled'>('All');

  const filteredOrders = ORDERS_LIST.filter((order) => {
    const matchesTab = activeTab === 'All' || order.tabCategory === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Container */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="chevron-back" size={24} color="#0A0E1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn}>
            <Ionicons name="options-outline" size={22} color="#0A0E1A" />
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search order ID / shop"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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

      {/* Orders Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={60} color="#94A3B8" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>There are no orders matching your selected criteria.</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              activeOpacity={0.9}
              style={styles.orderCard}
              onPress={() => router.push(order.detailsRoute as any)}
            >
              <View style={styles.cardHeaderRow}>
                {/* Store Icon Badge */}
                <View style={[styles.iconCircle, { backgroundColor: order.iconBg }]}>
                  <Ionicons name={order.iconName} size={22} color={order.iconColor} />
                </View>

                {/* Info Col */}
                <View style={styles.cardMainCol}>
                  <Text style={styles.orderIdText}>{order.id}</Text>
                  <Text style={styles.storeNameText}>{order.storeName}</Text>
                </View>

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: order.badgeBg }]}>
                  <Text style={[styles.statusBadgeText, { color: order.badgeTextColor }]}>
                    {order.statusLabel}
                  </Text>
                </View>
              </View>

              {/* Subtext info */}
              <Text style={styles.summaryText}>
                {order.itemsCount} • {order.total}
              </Text>
              <Text style={styles.dateText}>{order.date}</Text>

              {/* Chevron arrow button - Clicking arrow opens Order Details */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.chevronIcon}
                onPress={() => router.push(order.detailsRoute as any)}
              >
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Action Button at bottom right of card */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.cardActionBtn,
                    order.buttonType === 'green' ? styles.btnGreenOutline : styles.btnDarkOutline,
                  ]}
                  onPress={() => router.push(order.statusRoute as any)}
                >
                  <Text
                    style={[
                      styles.btnText,
                      order.buttonType === 'green' ? styles.btnTextGreen : styles.btnTextDark,
                    ]}
                  >
                    {order.buttonLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    paddingHorizontal: 16,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
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
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  summaryText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 56,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 56,
  },
  chevronIcon: {
    position: 'absolute',
    right: 16,
    top: 48,
  },
  actionBtnRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  cardActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  btnGreenOutline: {
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
  },
  btnDarkOutline: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  btnTextGreen: {
    color: '#059669',
  },
  btnTextDark: {
    color: '#0F172A',
  },
});
