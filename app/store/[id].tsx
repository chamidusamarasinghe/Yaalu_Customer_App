import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StoreDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Top Bar */}
      <View style={styles.topBar}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topBarRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#061138" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.searchBtn}>
              <Ionicons name="search-outline" size={22} color="#061138" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Hero Image Banner */}
        <View style={styles.heroWrapper}>
          <Image
            source={require('../../assets/images/green_mart_hero.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.storeHeroTitle}>Green Mart</Text>
            <Text style={styles.storeHeroRating}>⭐ 4.6 (320+ reviews)</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.favoriteBtn}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Card 1: About Green Mart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Green Mart</Text>
          <Text style={styles.cardDescription}>
            Fresh and organic produce delivered straight from the farm to your doorstep. We prioritize local farmers and sustainable practices to ensure you get the most nutrient-dense food while supporting our community.
          </Text>
        </View>

        {/* Section 2: Featured Products */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.viewAllText}>View All Products</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuredRow}>
          {/* Featured 1 */}
          <View style={styles.featuredCard}>
            <Image source={require('../../assets/images/fresh_products.png')} style={styles.featuredImage} resizeMode="contain" />
            <Text style={styles.featuredTitle}>Organic Kale</Text>
            <View style={styles.featuredPriceRow}>
              <Text style={styles.featuredPrice}>LKR 450</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.plusBtn}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured 2 */}
          <View style={styles.featuredCard}>
            <Image source={require('../../assets/images/red_apples.png')} style={styles.featuredImage} resizeMode="contain" />
            <Text style={styles.featuredTitle}>Vine Tomatoes</Text>
            <View style={styles.featuredPriceRow}>
              <Text style={styles.featuredPrice}>LKR 320</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.plusBtn}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section 3: Customer Reviews */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
        </View>

        <View style={styles.card}>
          {/* Review 1 */}
          <View style={styles.reviewHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>SM</Text>
            </View>
            <View style={styles.reviewerCol}>
              <Text style={styles.reviewerName}>Sarah M.</Text>
              <Text style={styles.starsText}>⭐⭐⭐⭐⭐</Text>
            </View>
          </View>
          <Text style={styles.reviewBody}>
            The quality of the vegetables is unmatched. Everything arrived super fresh and the delivery was exactly on time!
          </Text>

          <View style={styles.divider} />

          {/* Review 2 */}
          <View style={styles.reviewHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: '#BBF7D0' }]}>
              <Text style={[styles.avatarInitials, { color: '#166534' }]}>JR</Text>
            </View>
            <View style={styles.reviewerCol}>
              <Text style={styles.reviewerName}>Jason R.</Text>
              <Text style={styles.starsText}>⭐⭐⭐⭐☆</Text>
            </View>
          </View>
          <Text style={styles.reviewBody}>
            Great local store. I love that they carry exotic fruits that are hard to find elsewhere in Colombo.
          </Text>

          <TouchableOpacity activeOpacity={0.8} style={styles.readReviewsBtn}>
            <Text style={styles.readReviewsBtnText}>Read All Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Store Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Store Location</Text>
          <View style={styles.mapSnippetWrapper}>
            <Image source={require('../../assets/images/map_preview.png')} style={styles.mapSnippetImage} resizeMode="cover" />
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={20} color="#059669" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>Address</Text>
              <Text style={styles.addressSub}>Galle Road, Colombo 04</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.directionsBtn}>
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Card 5: Contact Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Info</Text>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color="#2563EB" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+94 11 234 5678</Text>
            </View>
          </View>
          <View style={[styles.contactRow, { marginTop: 12 }]}>
            <Ionicons name="mail-outline" size={20} color="#2563EB" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>contact@greenmart.lk</Text>
            </View>
          </View>
        </View>

        {/* Card 6: Opening Hours */}
        <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <View style={styles.hoursTitleRow}>
            <Ionicons name="time-outline" size={22} color="#166534" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#166534', marginBottom: 0 }]}>Opening Hours</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDays}>Mon - Sun</Text>
            <Text style={styles.hoursTime}>7:00 AM – 10:00 PM</Text>
          </View>
          <View style={styles.openNowBadge}>
            <Text style={styles.openNowDot}>● </Text>
            <Text style={styles.openNowText}>OPEN NOW</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat Message Button */}
      <TouchableOpacity activeOpacity={0.88} style={styles.chatFloatingBtn}>
        <Ionicons name="chatbox-ellipses" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    backgroundColor: '#FDB813',
  },
  safeArea: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 40,
  },
  topBarRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  searchBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroWrapper: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  storeHeroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  storeHeroRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0036AA',
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featuredCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredImage: {
    width: '100%',
    height: 90,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  featuredPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#061138',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C2410C',
  },
  reviewerCol: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  starsText: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  readReviewsBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  readReviewsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0036AA',
  },
  mapSnippetWrapper: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapSnippetImage: {
    width: '100%',
    height: '100%',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  addressSub: {
    fontSize: 13,
    color: '#64748B',
  },
  directionsBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  directionsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  hoursTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hoursDays: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  hoursTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#166534',
  },
  openNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openNowDot: {
    color: '#166534',
    fontSize: 14,
  },
  openNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  chatFloatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#061138',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
