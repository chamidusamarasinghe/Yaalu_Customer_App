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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = () => {
    router.push('/modal');
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Store Header Bar */}
      <View style={styles.topHeader}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#061138" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.storeTitleCol}
              onPress={() => router.push('/store/1' as any)}
            >
              <View style={styles.storeLogoBadge}>
                <Image
                  source={require('../../assets/images/fresh_products.png')}
                  style={styles.storeLogoImg}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.storeHeaderName}>Green Mart</Text>
                <Text style={styles.storeHeaderRating}>⭐ 4.6 (320+)</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerRightIcons}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setIsFavorite(!isFavorite)}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? '#EF4444' : '#061138'}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={{ marginLeft: 12 }}>
                <Ionicons name="share-social-outline" size={22} color="#061138" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Strip Bar */}
        <View style={styles.infoStripBar}>
          <View style={styles.infoStripItem}>
            <Ionicons name="car-outline" size={16} color="#2563EB" />
            <Text style={styles.infoStripTitle}>15-20 min</Text>
            <Text style={styles.infoStripSub}>Estimated Time</Text>
          </View>
          <View style={styles.infoStripDivider} />
          <View style={styles.infoStripItem}>
            <Ionicons name="location-outline" size={16} color="#2563EB" />
            <Text style={styles.infoStripTitle}>0.8 km</Text>
            <Text style={styles.infoStripSub}>Galle Road, Colombo 04</Text>
          </View>
          <View style={styles.infoStripDivider} />
          <View style={styles.infoStripItem}>
            <Ionicons name="bus-outline" size={16} color="#2563EB" />
            <Text style={styles.infoStripTitle}>LKR 250</Text>
            <Text style={styles.infoStripSub}>Delivery Fee</Text>
          </View>
        </View>

        {/* Search Bar inside Store */}
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="options-outline" size={20} color="#94A3B8" />
        </View>

        {/* Product Image Gallery */}
        <View style={styles.imageGalleryWrapper}>
          <Image
            source={require('../../assets/images/red_apples.png')}
            style={styles.productHeroImage}
            resizeMode="contain"
          />
          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotInactive]} />
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productTitle}>Red Apple (1kg)</Text>

          <View style={styles.priceBadgeRow}>
            <Text style={styles.productPrice}>LKR 650.00</Text>
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockText}>In Stock</Text>
            </View>
          </View>

          <Text style={styles.productDescription}>
            Fresh and juicy red apples. Rich in fiber and vitamin C. Perfect for a healthy diet.
          </Text>

          {/* Quantity Counter Card & Add to Cart */}
          <View style={styles.counterCard}>
            <View style={styles.quantityRow}>
              <TouchableOpacity activeOpacity={0.8} style={styles.counterBtn} onPress={decrementQty}>
                <Ionicons name="remove" size={18} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.counterBtn} onPress={incrementQty}>
                <Ionicons name="add" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.88} style={styles.addToCartBtn} onPress={handleAddToCart}>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addToCartBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      <View style={styles.floatingCartBarContainer}>
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.floatingCartBar}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <View style={styles.cartBarLeft}>
            <Ionicons name="cart-outline" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.cartBarTitle}>View Cart</Text>
            <View style={styles.cartBadgeCircle}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={styles.cartBarPrice}>LKR 1,220.00</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    backgroundColor: '#FDB813',
    paddingBottom: 8,
  },
  headerSafeArea: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 40,
  },
  headerRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  storeTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  storeLogoImg: {
    width: 26,
    height: 26,
  },
  storeHeaderName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061138',
  },
  storeHeaderRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A6800',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  infoStripBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoStripItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoStripTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  infoStripSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  infoStripDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  imageGalleryWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productHeroImage: {
    width: '75%',
    height: 180,
    maxHeight: 200,
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#2563EB',
  },
  dotInactive: {
    backgroundColor: '#CBD5E1',
  },
  productDetailsContainer: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  priceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0036AA',
    marginRight: 12,
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inStockText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  productDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  counterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  addToCartBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
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
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  floatingCartBarContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  floatingCartBar: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  cartBadgeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FDB813',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#061138',
    fontSize: 12,
    fontWeight: '900',
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
