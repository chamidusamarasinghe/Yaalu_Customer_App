import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ShopItem {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  deliveryTime: string;
  openingHours: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
  image: any;
  isPreferred?: boolean;
}

const SHOPS: ShopItem[] = [
  {
    id: '1',
    name: 'Green Mart',
    subtitle: 'Fresh groceries & more',
    rating: 4.6,
    reviewsCount: 320,
    distance: '0.8 km',
    deliveryTime: '15 min',
    openingHours: '7:00 AM - 10:00 PM',
    status: 'Open',
    image: require('../../assets/images/fresh_products.png'),
    isPreferred: true,
  },
  {
    id: '2',
    name: 'Fresh Basket',
    subtitle: 'All your daily needs',
    rating: 4.4,
    reviewsCount: 210,
    distance: '1.2 km',
    deliveryTime: '20 min',
    openingHours: '6:30 AM - 9:30 PM',
    status: 'Open',
    image: require('../../assets/images/yaalu_logo.png'),
  },
  {
    id: '3',
    name: 'Daily Picks',
    subtitle: 'Quality you can trust',
    rating: 4.2,
    reviewsCount: 180,
    distance: '1.6 km',
    deliveryTime: '25 min',
    openingHours: '7:00 AM - 9:00 PM',
    status: 'Closing Soon',
    image: require('../../assets/images/fast_delivery.png'),
  },
  {
    id: '4',
    name: 'Happy Grocers',
    subtitle: 'Happy shopping everyday',
    rating: 4.5,
    reviewsCount: 250,
    distance: '2.4 km',
    deliveryTime: '30 min',
    openingHours: '6:00 AM - 10:00 PM',
    status: 'Open',
    image: require('../../assets/images/secure_payments.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const preferredShop = SHOPS.find((s) => s.isPreferred) || SHOPS[0];
  const nearbyShops = SHOPS.filter((s) => !s.isPreferred);

  const handleShopPress = (shopId: string) => {
    router.push(`/store/${shopId}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Yellow Header Banner */}
        <View style={styles.headerBanner}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerTopRow}>
              {/* Brand Logo & Notification/Profile */}
              <View style={styles.brandGroup}>
                <View style={styles.logoBadgeCircle}>
                  <Ionicons name="bicycle" size={20} color="#061138" />
                </View>
                <Text style={styles.brandTitle}>YAALU</Text>
              </View>

              <View style={styles.headerRightGroup}>
                <TouchableOpacity activeOpacity={0.7} style={styles.bellBtn}>
                  <Ionicons name="notifications-outline" size={20} color="#061138" />
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.avatarBtn}
                  onPress={() => router.push('/profile' as any)}
                >
                  <Ionicons name="person" size={20} color="#061138" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Greeting Header */}
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingTitle}>Hi Chamidu Jayanga,</Text>
              <Text style={styles.greetingSubtitle}>Good Morning!</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Top Category / Service Cards (Rides, Bidding, Shop) */}
          <View style={styles.serviceCardsRow}>
            {/* Card 1: Rides */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.serviceCard}
              onPress={() => router.push('/rides' as any)}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="car-sport" size={26} color="#F59E0B" />
              </View>
              <Text style={styles.serviceCardTitle}>Rides</Text>
            </TouchableOpacity>

            {/* Card 2: Bidding */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.serviceCard}
              onPress={() => router.push('/orders/status')}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="hammer" size={26} color="#3B82F6" />
              </View>
              <Text style={styles.serviceCardTitle}>Bidding</Text>
            </TouchableOpacity>

            {/* Card 3: Shop */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.serviceCard}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="cart" size={26} color="#10B981" />
              </View>
              <Text style={styles.serviceCardTitle}>Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Destination Search Bar ("Where are you going?") */}
          <View style={styles.destinationSearchBar}>
            <TextInput
              style={styles.destinationInput}
              placeholder="Where are you going?"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={22} color="#94A3B8" style={styles.searchIconRight} />
          </View>

          {/* Recently Visited Container Card */}
          <View style={styles.recentVisitedCard}>
            {/* Item 1: Home */}
            <TouchableOpacity activeOpacity={0.7} style={styles.recentRow}>
              <View style={styles.recentIconBadge}>
                <Ionicons name="home" size={18} color="#D97706" />
              </View>
              <View style={styles.recentTextCol}>
                <Text style={styles.recentTitle}>Home</Text>
                <Text style={styles.recentSubtitle}>Polonnaruwa</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.recentDivider} />

            {/* Item 2: Galle Samanala Ground */}
            <TouchableOpacity activeOpacity={0.7} style={styles.recentRow}>
              <View style={styles.recentIconBadge}>
                <Ionicons name="location-sharp" size={18} color="#D97706" />
              </View>
              <View style={styles.recentTextCol}>
                <Text style={styles.recentTitle} numberOfLines={1}>
                  Galle Samanala Ground - ...
                </Text>
                <Text style={styles.recentSubtitle}>Galle</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.recentDivider} />

            {/* Item 3: Ceylon Fishery Harbors Corporation */}
            <TouchableOpacity activeOpacity={0.7} style={styles.recentRow}>
              <View style={styles.recentIconBadge}>
                <Ionicons name="location-sharp" size={18} color="#D97706" />
              </View>
              <View style={styles.recentTextCol}>
                <Text style={styles.recentTitle} numberOfLines={1}>
                  Ceylon Fishery Harbors Corporation
                </Text>
                <Text style={styles.recentSubtitle}>Matara Road, Galle</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Lotus Tower Dark Promo Banner Card */}
          <TouchableOpacity activeOpacity={0.88} style={styles.lotusBannerCard}>
            <Text style={styles.lotusTitle}>Lotus Tower</Text>
            <Text style={styles.lotusSubtitle}>Tickets Are Now Available on...</Text>
          </TouchableOpacity>

          {/* Preferred Shops Section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleGroup}>
              <Text style={styles.sectionTitleEmoji}>🧡</Text>
              <Text style={styles.sectionTitle}>Preferred Shops</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Preferred Shop Card */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.preferredShopCard}
            onPress={() => handleShopPress(preferredShop.id)}
          >
            <View style={styles.shopTopRow}>
              <View style={styles.shopLogoSquare}>
                <Image source={preferredShop.image} style={styles.shopLogoImage} resizeMode="contain" />
              </View>

              <View style={styles.shopInfoCol}>
                <View style={styles.shopTitleRow}>
                  <Text style={styles.shopName}>{preferredShop.name}</Text>
                  <View style={styles.openTag}>
                    <Text style={styles.openTagText}>{preferredShop.status}</Text>
                  </View>
                </View>
                <Text style={styles.shopSubtitle}>{preferredShop.subtitle}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={15} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {preferredShop.rating} ({preferredShop.reviewsCount}+)
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#94A3B8" style={styles.chevronIcon} />
            </View>

            {/* Shop Details Footer Strip */}
            <View style={styles.shopFooterStrip}>
              <View style={styles.footerItem}>
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text style={styles.footerItemText}>{preferredShop.distance}</Text>
              </View>

              <View style={styles.footerDividerDot} />

              <View style={styles.footerItem}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.footerItemText}>{preferredShop.deliveryTime}</Text>
              </View>

              <View style={styles.footerDividerDot} />

              <View style={styles.footerItem}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text style={styles.footerItemText}>{preferredShop.openingHours}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Nearby Shops Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Nearby Shops</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.viewAllText}>See All ({nearbyShops.length})</Text>
            </TouchableOpacity>
          </View>

          {nearbyShops.map((shop) => (
            <TouchableOpacity
              key={shop.id}
              activeOpacity={0.88}
              style={styles.nearbyShopCard}
              onPress={() => handleShopPress(shop.id)}
            >
              <View style={styles.nearbyLogoSquare}>
                <Image source={shop.image} style={styles.nearbyLogoImage} resizeMode="contain" />
              </View>

              <View style={styles.nearbyInfoCol}>
                <Text style={styles.nearbyName}>{shop.name}</Text>
                <Text style={styles.nearbySubtitle}>{shop.subtitle}</Text>
                <View style={styles.nearbyStatsRow}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.nearbyRatingText}>{shop.rating}</Text>
                  </View>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.nearbyMetaText}>{shop.distance}</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.nearbyMetaText}>{shop.deliveryTime}</Text>
                </View>
              </View>

              <View style={styles.goBtnCircle}>
                <Ionicons name="chevron-forward" size={18} color="#061138" />
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  headerBanner: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  safeArea: {},
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: 1.5,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    marginTop: 4,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A0E1A',
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A0E1A',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  contentBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  serviceCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  destinationSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  destinationInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  searchIconRight: {
    marginLeft: 8,
  },
  recentVisitedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  recentTextCol: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  recentDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  lotusBannerCard: {
    backgroundColor: '#061138',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  lotusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FDB813',
    marginBottom: 4,
  },
  lotusSubtitle: {
    fontSize: 13,
    color: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  preferredShopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  shopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopLogoSquare: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shopLogoImage: {
    width: 38,
    height: 38,
  },
  shopInfoCol: {
    flex: 1,
  },
  shopTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  openTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  openTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  shopSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 4,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  shopFooterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItemText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 4,
  },
  footerDividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  nearbyShopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nearbyLogoSquare: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nearbyLogoImage: {
    width: 32,
    height: 32,
  },
  nearbyInfoCol: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  nearbySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  nearbyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  nearbyRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 3,
  },
  dotSeparator: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  nearbyMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  goBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
