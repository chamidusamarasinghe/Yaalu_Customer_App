import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productService, ProductItem } from '../../services/api/product-service';
import { shopService, ShopItem } from '../../services/api/shop-service';
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

export default function ShopCatalogScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [cartQuantities, setCartQuantities] = useState<{ [productId: string]: number }>({});

  const loadData = async () => {
    try {
      const [fetchedProducts, fetchedShops] = await Promise.all([
        productService.getProducts(),
        shopService.getShops(),
      ]);
      setProducts(fetchedProducts);
      setShops(fetchedShops);
    } catch (err) {
      console.warn('[ExploreScreen Load Error]:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to global cart updates
    const syncCartState = () => {
      const qMap: { [id: string]: number } = {};
      cartService.getItems().forEach((item) => {
        qMap[item.productId] = item.quantity;
      });
      setCartQuantities(qMap);
    };

    syncCartState();
    return cartService.subscribe(syncCartState);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/store/${shopId}` as any);
  };

  const handleIncrement = (item: ProductItem) => {
    cartService.addItem(item);
  };

  const handleDecrement = (item: ProductItem) => {
    cartService.updateQuantity(item.id, -1);
  };

  const cartCount = cartService.getTotalCount();
  const cartTotal = cartService.getSubtotal();

  // Filter products by category & search query
  const filteredProducts = products.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = nameMatch || descMatch;

    const matchesCategory = isCategoryMatch(item, activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar with "Products" Title */}
      <View style={styles.topHeader}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#061138" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Products</Text>
            <View style={{ width: 34 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FDB813']} />}
      >
        {/* Shops Available Horizontal Banner */}
        {shops.length > 0 && (
          <View style={styles.shopsSection}>
            <Text style={styles.sectionHeaderTitle}>Shops & Marts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shopsHorizontalList}>
              {shops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  activeOpacity={0.85}
                  style={styles.shopPillCard}
                  onPress={() => handleShopPress(shop.id)}
                >
                  <View style={styles.shopPillIcon}>
                    <Ionicons name="storefront" size={20} color="#0036AA" />
                  </View>
                  <View style={styles.shopPillTextCol}>
                    <Text style={styles.shopPillName} numberOfLines={1}>{shop.shopName}</Text>
                    <Text style={styles.shopPillSub} numberOfLines={1}>{shop.businessType || shop.shopAddress}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter Chips */}
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

        {/* Loading Spinner */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FDB813" />
            <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Loading products from database...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Ionicons name="basket-outline" size={48} color="#94A3B8" />
            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '700', color: '#334155' }}>No products found in "{activeCategory}"</Text>
            <Text style={{ marginTop: 4, fontSize: 13, color: '#94A3B8' }}>Select another category or clear search</Text>
          </View>
        ) : (
          /* 2-Column Product Grid */
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => {
              const qty = cartQuantities[item.id] || 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.88}
                  style={styles.productCard}
                  onPress={() => handleProductPress(item.id)}
                >
                  {/* In Stock Badge */}
                  <View style={styles.inStockBadge}>
                    <Text style={styles.inStockText}>{item.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</Text>
                  </View>

                  {/* Product Image */}
                  <View style={styles.productImageContainer}>
                    <Image
                      source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/red_apples.png')}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Title & Subtitle */}
                  <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productSubtitle} numberOfLines={1}>{item.unit || item.description || 'Fresh Produce'}</Text>

                  {/* Price & Cart Control Row */}
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>LKR {item.price}</Text>

                    {qty > 0 ? (
                      <View style={styles.qtyControlRow}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.qtyMinusBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDecrement(item);
                          }}
                        >
                          <Ionicons name="remove" size={16} color="#061138" />
                        </TouchableOpacity>

                        <Text style={styles.qtyBadgeText}>{qty}</Text>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.qtyPlusBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleIncrement(item);
                          }}
                        >
                          <Ionicons name="add" size={16} color="#061138" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.addPlusBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleIncrement(item);
                        }}
                      >
                        <Ionicons name="add" size={22} color="#061138" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

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
  topHeader: { backgroundColor: '#FDB813', paddingBottom: 8 },
  headerSafeArea: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 40 },
  headerRow: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#061138', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  shopsSection: { marginBottom: 16 },
  sectionHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  shopsHorizontalList: { gap: 10 },
  shopPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 160,
  },
  shopPillIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  shopPillTextCol: { flex: 1 },
  shopPillName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  shopPillSub: { fontSize: 11, color: '#64748B' },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },
  chipsRow: { gap: 10, marginBottom: 20 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 },
  chipSelected: { backgroundColor: '#FDB813' },
  chipUnselected: { backgroundColor: '#E2E8F0' },
  chipText: { fontSize: 14, fontWeight: '700' },
  chipTextSelected: { color: '#061138' },
  chipTextUnselected: { color: '#475569' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between' },
  productCard: {
    width: (width - 46) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  inStockBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#86EFAC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },
  inStockText: { fontSize: 9, fontWeight: '900', color: '#14532D' },
  productImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: '100%' },
  productTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  productSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#059669' },
  addPlusBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FDB813', justifyContent: 'center', alignItems: 'center' },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB813',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 6,
  },
  qtyMinusBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyPlusBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBadgeText: { fontSize: 14, fontWeight: '900', color: '#061138', paddingHorizontal: 2 },
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
