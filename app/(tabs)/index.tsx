import { SafeAreaView } from 'react-native-safe-area-context';
﻿import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

  const currentUser = authService.getCurrentUser();
  const userName = currentUser.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
    : 'Valued Customer';

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
                {currentUser.profilePicture ? (
                  <Image source={{ uri: currentUser.profilePicture }} style={styles.headerAvatarImage} />
                ) : (
                  <Ionicons name="person-circle" size={40} color="#061138" />
                )}
              </TouchableOpacity>

              {/* Header Right Action Icons */}
              <View style={styles.headerActionsRight}>
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
              style={[styles.serviceCard, styles.biddingCardBg]}
              onPress={() => router.push('/rides' as any)}
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
    gap: 10,
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
