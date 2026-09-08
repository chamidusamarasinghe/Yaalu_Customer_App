import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { shopService, ShopItem } from '../../services/api/shop-service';
import { ProductItem } from '../../services/api/product-service';
import { cartService } from '../../services/api/cart-service';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All Products', 'Fruits', 'Vegetables', 'Dairy', 'Bakery'];

const isCategoryMatch = (item: ProductItem, category: string): boolean => {
  if (!category || category === 'All Products') return true;

  const catLower = category.toLowerCase();
  const nameLower = item.name.toLowerCase();
  const descLower = (item.description || '').toLowerCase();
  const unitLower = (item.unit || '').toLowerCase();

  if (catLower === 'fruits') {
    const fruitKeywords = ['fruit', 'apple', 'banana', 'strawberry', 'strawberries', 'mango', 'orange', 'grape', 'papaya', 'pineapple'];
    return fruitKeywords.some((k) => nameLower.includes(k) || descLower.includes(k) || unitLower.includes(k));
  }

  if (catLower === 'vegetables' || catLower === 'veggies') {
    const vegKeywords = ['veg', 'vegetable', 'broccoli', 'carrot', 'carrots', 'spinach', 'potato', 'onion', 'tomato', 'cabbage', 'leek', 'pumpkin'];
    return vegKeywords.some((k) => nameLower.includes(k) || descLower.includes(k) || unitLower.includes(k));
  }

  if (catLower === 'dairy') {
    const dairyKeywords = ['dairy', 'milk', 'cheese', 'butter', 'yogurt', 'curd', 'cream'];
    return dairyKeywords.some((k) => nameLower.includes(k) || descLower.includes(k) || unitLower.includes(k));
  }

  if (catLower === 'bakery') {
    const bakeryKeywords = ['bakery', 'bread', 'bun', 'cake', 'pastry', 'toast', 'loaf', 'biscuit'];
    return bakeryKeywords.some((k) => nameLower.includes(k) || descLower.includes(k) || unitLower.includes(k));
  }

  return nameLower.includes(catLower) || descLower.includes(catLower) || unitLower.includes(catLower);
};

export default function StoreDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [shop, setShop] = useState<ShopItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Products');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cartQuantities, setCartQuantities] = useState<{ [productId: string]: number }>({});

  useEffect(() => {
    if (id) {
      loadStoreData(id as string);
    }

    // Subscribe to cart changes
    const syncCartState = () => {
      const qMap: { [id: string]: number } = {};
      cartService.getItems().forEach((item) => {
        qMap[item.productId] = item.quantity;
      });
      setCartQuantities(qMap);
    };

    syncCartState();
    return cartService.subscribe(syncCartState);
  }, [id]);

  const loadStoreData = async (storeId: string) => {
    setLoading(true);
    try {
      const [fetchedShop, fetchedProducts] = await Promise.all([
        shopService.getShopById(storeId),
        shopService.getShopProducts(storeId),
      ]);
      setShop(fetchedShop);
      setProducts(fetchedProducts);
    } catch (err) {
      console.warn('[StoreDetailsScreen Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const handleIncrement = (item: ProductItem) => {
    cartService.addItem(item);
  };

  const handleDecrement = (item: ProductItem) => {
    cartService.updateQuantity(item.id, -1);
  };

  const cartCount = cartService.getTotalCount();
  const cartTotal = cartService.getSubtotal();

  const filteredProducts = products.filter((p) => isCategoryMatch(p, activeCategory));

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
            <Text style={styles.headerTitle} numberOfLines={1}>{shop?.shopName || 'Shop Details'}</Text>
            <View style={{ width: 34 }} />
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FDB813" />
          <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Loading shop details...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Store Hero Banner */}
          <View style={styles.heroWrapper}>
            <Image
              source={require('../../assets/images/green_mart_hero.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.storeHeroTitle}>{shop?.shopName || 'Shop Details'}</Text>
              <Text style={styles.storeHeroRating}>{shop?.businessType || 'Verified Merchant'}</Text>
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

          {/* Card 1: About Shop */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About {shop?.shopName || 'Shop'}</Text>
            <Text style={styles.cardDescription}>
              {shop?.businessType ? `Specialized in ${shop.businessType}.` : 'Quality fresh produce and daily essentials delivered to your doorstep.'} Located at {shop?.shopAddress || shop?.outletAddress || 'Colombo, Sri Lanka'}.
            </Text>
          </View>

          {/* Category Filter Chips */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Shop Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.8}
                    style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                    onPress={() => setActiveCategory(cat)}
                  >
                    <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Card 2: Shop Products */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'All Products' ? 'All Shop Products' : activeCategory} ({filteredProducts.length})
            </Text>
          </View>

          {filteredProducts.length === 0 ? (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
              <Ionicons name="basket-outline" size={36} color="#94A3B8" />
              <Text style={{ marginTop: 8, color: '#64748B', fontWeight: '600' }}>No products found in "{activeCategory}".</Text>
            </View>
          ) : (
            <View style={styles.featuredGrid}>
              {filteredProducts.map((p) => {
                const qty = cartQuantities[p.id] || 0;
                return (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.88}
                    style={styles.featuredCard}
                    onPress={() => handleProductPress(p.id)}
                  >
                    <Image
                      source={p.imageUrl ? { uri: p.imageUrl } : require('../../assets/images/red_apples.png')}
                      style={styles.featuredImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.featuredTitle} numberOfLines={1}>{p.name}</Text>
                    <View style={styles.featuredPriceRow}>
                      <Text style={styles.featuredPrice}>LKR {p.price}</Text>

                      {qty > 0 ? (
                        <View style={styles.qtyControlRow}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.qtyMinusBtn}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDecrement(p);
                            }}
                          >
                            <Ionicons name="remove" size={14} color="#FFFFFF" />
                          </TouchableOpacity>

                          <Text style={styles.qtyBadgeTextDark}>{qty}</Text>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.qtyPlusBtn}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleIncrement(p);
                            }}
                          >
                            <Ionicons name="add" size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.plusBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleIncrement(p);
                          }}
                        >
                          <Ionicons name="add" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Card 3: Address & Location */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={22} color="#0036AA" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressTitle}>{shop?.shopName}</Text>
                <Text style={styles.addressSub}>{shop?.shopAddress || shop?.outletAddress || 'Sri Lanka'}</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Contact Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Info</Text>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={20} color="#2563EB" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{shop?.ownerPhone || '+94 11 234 5678'}</Text>
              </View>
            </View>
            <View style={[styles.contactRow, { marginTop: 12 }]}>
              <Ionicons name="mail-outline" size={20} color="#2563EB" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{shop?.ownerEmail || 'contact@yaalu.lk'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <View style={styles.floatingCartBarContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.floatingCartBar}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <View style={styles.cartBarLeft}>
              <Ionicons name="cart" size={22} color="#061138" style={{ marginRight: 8 }} />
              <Text style={styles.cartBarText}>View Cart ({cartCount} items)</Text>
            </View>
            <Text style={styles.cartBarPrice}>LKR {cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { backgroundColor: '#FDB813' },
  safeArea: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 40 },
  topBarRow: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#061138', textAlign: 'center', flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
  heroWrapper: { height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 16, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.5)' },
  storeHeroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  storeHeroRating: { color: '#FFD700', fontSize: 13, fontWeight: '700', marginTop: 2 },
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  cardDescription: { fontSize: 14, color: '#475569', lineHeight: 22 },
  sectionHeaderRow: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  chipsRow: { gap: 10, marginVertical: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  chipSelected: { backgroundColor: '#FDB813' },
  chipUnselected: { backgroundColor: '#E2E8F0' },
  chipText: { fontSize: 13, fontWeight: '700' },
  chipTextSelected: { color: '#061138' },
  chipTextUnselected: { color: '#475569' },
  featuredGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  featuredCard: { width: (width - 44) / 2, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  featuredImage: { width: '100%', height: 100, borderRadius: 12, marginBottom: 8 },
  featuredTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  featuredPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredPrice: { fontSize: 14, fontWeight: '800', color: '#059669' },
  plusBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#061138', justifyContent: 'center', alignItems: 'center' },
  qtyControlRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#061138', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2, gap: 4 },
  qtyMinusBtn: { width: 20, height: 20, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  qtyPlusBtn: { width: 20, height: 20, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  qtyBadgeTextDark: { fontSize: 12, fontWeight: '900', color: '#FFFFFF', paddingHorizontal: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  addressSub: { fontSize: 13, color: '#64748B' },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  contactValue: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  floatingCartBarContainer: { position: 'absolute', bottom: 12, left: 16, right: 16 },
  floatingCartBar: {
    backgroundColor: '#FDB813',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center' },
  cartBarText: { fontSize: 16, fontWeight: '800', color: '#061138' },
  cartBarPrice: { fontSize: 16, fontWeight: '900', color: '#061138' },
});
