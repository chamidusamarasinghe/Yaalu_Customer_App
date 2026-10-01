import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions, Platform, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { authService } from '../../services/api/auth-service';

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
  image?: any;
  isPreferred?: boolean;
}

export default function CustomerHomeScreen() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>({});
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLatestProfile() {
      const cached = await authService.ensureInitialized();
      if (isMounted && cached) {
        setCurrentUser(cached);
      }
      try {
        const fresh = await authService.fetchProfile();
        if (isMounted && fresh) {
          setCurrentUser(fresh);
        }
      } catch (e) {}
    }

    async function loadOnlinePreference() {
      try {
        const val = await AsyncStorage.getItem('customer_is_online');
        if (isMounted && val !== null) {
          setIsOnline(val === 'true');
        }
      } catch (e) {}
    }

    async function checkDeviceLocationService() {
      try {
        const isServicesEnabled = await Location.hasServicesEnabledAsync();
        const { status } = await Location.getForegroundPermissionsAsync();
        if (!isServicesEnabled || status !== 'granted') {
          if (isMounted) {
            setLocationModalVisible(true);
          }
        }
      } catch (e) {
        // Fallback for iframe web environment
      }
    }

    loadLatestProfile();
    loadOnlinePreference();
    checkDeviceLocationService();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleOnlineStatus = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    await AsyncStorage.setItem('customer_is_online', String(nextState)).catch(() => {});
  };

  const handleEnableLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (status === 'granted' && isEnabled) {
        setLocationModalVisible(false);
        Alert.alert('📍 Location Enabled', 'Your location is active so nearby riders can find you!');
      } else {
        Alert.alert(
          'Location Required',
          'Riders locate nearby customers using live GPS coordinates. Please turn on Location Services in your phone settings.'
        );
      }
    } catch (e) {
      setLocationModalVisible(false);
    }
  };
  
    const userName = currentUser.fullName || currentUser.name || (currentUser.firstName ? (currentUser.firstName + ' ' + (currentUser.lastName || '')).trim() : 'Customer');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Yellow Header Hero Banner */}
        <View style={styles.headerHero}>
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerTopRow}>
              {/* Profile Avatar Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.profileAvatarBtn}
                onPress={() => router.push('/profile' as any)}
              >
                {(currentUser?.profilePicture || currentUser?.avatar || currentUser?.profilePhoto) ? (
                  <Image source={{ uri: currentUser.profilePicture || currentUser.avatar || currentUser.profilePhoto }} style={styles.headerAvatarImage} />
                ) : (
                  <Ionicons name="person-circle" size={40} color="#061138" />
                )}
              </TouchableOpacity>

              {/* Header Right Action Icons & Status Toggle */}
              <View style={styles.headerActionsRight}>
                {/* Online / Offline Status Toggle Badge */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.statusToggleBadge, isOnline ? styles.onlineBadgeBg : styles.offlineBadgeBg]}
                  onPress={toggleOnlineStatus}
                >
                  <View style={[styles.statusDot, isOnline ? styles.onlineDotBg : styles.offlineDotBg]} />
                  <Text style={[styles.statusBadgeText, isOnline ? styles.onlineBadgeText : styles.offlineBadgeText]}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.headerIconBtn}>
                  <Ionicons name="notifications-outline" size={22} color="#061138" />
                  <View style={styles.notifBadgeDot} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.headerIconBtn}
                  onPress={() => router.push('/(tabs)/cart' as any)}
                >
                  <Ionicons name="cart-outline" size={22} color="#061138" />
                  <View style={styles.cartCountBadge}>
                    <Text style={styles.cartCountText}>2</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dynamic Greeting Header */}
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingTitle}>Hi {userName},</Text>
              <Text style={styles.greetingSubtitle}>Good Morning!</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Primary Service Cards Row (Rides, Bidding, Shop) */}
        <View style={styles.serviceCardsContainer}>
          <View style={styles.serviceRow}>
            {/* Rides Card */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.serviceCard, styles.ridesCardBg]}
              onPress={() => router.push('/rides' as any)}
            >
              <View style={styles.serviceIconCircle}>
                <Ionicons name="car" size={26} color="#061138" />
              </View>
              <Text style={styles.serviceCardTitle}>Rides</Text>
              <Text style={styles.serviceCardSubtext}>Quick city taxi</Text>
            </TouchableOpacity>

            {/* Bidding Card */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.serviceCard, styles.biddingCardBg]} onPress={() => router.push('/rides?mode=bidding' as any)}
            >
              <View style={styles.serviceIconCircle}>
                <Ionicons name="pricetag" size={24} color="#061138" />
              </View>
              <Text style={styles.serviceCardTitle}>Bidding</Text>
              <Text style={styles.serviceCardSubtext}>Offer your fare</Text>
            </TouchableOpacity>

            {/* Shops Card */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.serviceCard, styles.shopsCardBg]}
              onPress={() => router.push('/(tabs)/explore' as any)}
            >
              <View style={styles.serviceIconCircle}>
                <Ionicons name="storefront" size={24} color="#061138" />
              </View>
              <Text style={styles.serviceCardTitle}>Shops</Text>
              <Text style={styles.serviceCardSubtext}>Groceries & mart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Global Destination Search Bar */}
        <View style={styles.searchSection}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.searchBarBox}
            onPress={() => router.push('/rides' as any)}
          >
            <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholderText}>Where are you going?</Text>
            <View style={styles.searchRightBadge}>
              <Ionicons name="options-outline" size={18} color="#061138" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recently Visited Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Recently Visited</Text>

          <View style={styles.visitedList}>
            {/* Visited Item 1: Home */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.visitedItemCard}
              onPress={() => router.push('/rides' as any)}
            >
              <View style={styles.visitedIconBadge}>
                <Ionicons name="home-sharp" size={20} color="#061138" />
              </View>
              <View style={styles.visitedTextCol}>
                <Text style={styles.visitedName}>Home</Text>
                <Text style={styles.visitedAddress}>Polonnaruwa</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Visited Item 2: Galle Samanala Ground */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.visitedItemCard}
              onPress={() => router.push('/rides' as any)}
            >
              <View style={[styles.visitedIconBadge, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="location-sharp" size={20} color="#D97706" />
              </View>
              <View style={styles.visitedTextCol}>
                <Text style={styles.visitedName}>Galle Samanala Ground</Text>
                <Text style={styles.visitedAddress}>Galle</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Visited Item 3: Ceylon Fishery Harbors */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.visitedItemCard}
              onPress={() => router.push('/rides' as any)}
            >
              <View style={[styles.visitedIconBadge, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="business-sharp" size={20} color="#0284C7" />
              </View>
              <View style={styles.visitedTextCol}>
                <Text style={styles.visitedName}>Ceylon Fishery Harbors Corporation</Text>
                <Text style={styles.visitedAddress}>Matara Road, Galle</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Banner Container */}
        <View style={styles.promoSection}>
          <View style={styles.promoBannerCard}>
            <View style={styles.promoTextCol}>
              <View style={styles.promoTagChip}>
                <Text style={styles.promoTagText}>SPECIAL OFFER</Text>
              </View>
              <Text style={styles.promoTitle}>Ride to Lotus Tower</Text>
              <Text style={styles.promoSubtext}>Get 20% OFF on your next city ride</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.promoActionBtn}
                onPress={() => router.push('/rides' as any)}
              >
                <Text style={styles.promoActionBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.promoGraphicBox}>
              <Ionicons name="car-sport" size={44} color="#FDB813" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* LOCATION ENABLE PROMPT MODAL */}
      <Modal visible={locationModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.locationModalCard}>
            <View style={styles.locationIconCircle}>
              <Ionicons name="location" size={36} color="#2563EB" />
            </View>

            <Text style={styles.locationModalTitle}>Turn On Location Services</Text>
            <Text style={styles.locationModalSubtext}>
              Yaalu requires your active device location so nearby riders can find your pickup spot accurately. Please enable location services.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.enableLocationBtn}
              onPress={handleEnableLocation}
            >
              <Ionicons name="navigate-sharp" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.enableLocationBtnText}>ENABLE LOCATION</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dismissLocationBtn}
              onPress={() => setLocationModalVisible(false)}
            >
              <Text style={styles.dismissLocationBtnText}>I'll Do It Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  statusToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  onlineBadgeBg: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  offlineBadgeBg: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDotBg: {
    backgroundColor: '#16A34A',
  },
  offlineDotBg: {
    backgroundColor: '#64748B',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  onlineBadgeText: {
    color: '#15803D',
  },
  offlineBadgeText: {
    color: '#475569',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  locationIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  locationModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  locationModalSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  enableLocationBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 10,
  },
  enableLocationBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dismissLocationBtn: {
    paddingVertical: 10,
  },
  dismissLocationBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  headerHero: {
    backgroundColor: '#FDB813',
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileAvatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#061138',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  cartCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  greetingContainer: {
    marginTop: 4,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  serviceCardsContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  ridesCardBg: {
    backgroundColor: '#FFFFFF',
  },
  biddingCardBg: {
    backgroundColor: '#FFFFFF',
  },
  shopsCardBg: {
    backgroundColor: '#FFFFFF',
  },
  serviceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  serviceCardSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  searchRightBadge: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  visitedList: {
    gap: 10,
  },
  visitedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  visitedIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  visitedTextCol: {
    flex: 1,
  },
  visitedName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  visitedAddress: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  promoSection: {
    paddingHorizontal: 20,
  },
  promoBannerCard: {
    backgroundColor: '#061138',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoTextCol: {
    flex: 1,
  },
  promoTagChip: {
    backgroundColor: '#FDB813',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#061138',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },
  promoActionBtn: {
    backgroundColor: '#FDB813',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoActionBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#061138',
  },
  promoGraphicBox: {
    marginLeft: 10,
  },
});

