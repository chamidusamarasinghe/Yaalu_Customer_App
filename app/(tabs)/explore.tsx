import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  priceValue: number;
  inStock: boolean;
  category: 'Fruits' | 'Vegetables' | 'Dairy';
  image: any;
}

const PRODUCTS: ProductItem[] = [
  {
    id: '1',
    title: 'Red Apple 1kg',
    subtitle: 'Freshly picked',
    price: 'LKR 650',
    priceValue: 650,
    inStock: true,
    category: 'Fruits',
    image: require('../../assets/images/red_apples.png'),
  },
  {
    id: '2',
    title: 'Banana 500g',
    subtitle: 'Local Cavendish',
    price: 'LKR 280',
    priceValue: 280,
    inStock: true,
    category: 'Fruits',
    image: require('../../assets/images/bananas.png'),
  },
  {
    id: '3',
    title: 'Broccoli 250g',
    subtitle: 'Imported Quality',
    price: 'LKR 420',
    priceValue: 420,
    inStock: true,
    category: 'Vegetables',
    image: require('../../assets/images/broccoli.png'),
  },
  {
    id: '4',
    title: 'Fresh Milk 1L',
    subtitle: 'Pure Highland',
    price: 'LKR 550',
    priceValue: 550,
    inStock: true,
    category: 'Dairy',
    image: require('../../assets/images/fresh_milk.png'),
  },
];

const CATEGORIES = ['All Products', 'Fruits', 'Vegetables', 'Dairy'];

export default function ShopCatalogScreen() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(2);
  const [cartTotal, setCartTotal] = useState(930);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory =
      activeCategory === 'All Products' || item.category === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const handleAddToCart = (item: ProductItem) => {
    setCartCount((prev) => prev + 1);
    setCartTotal((prev) => prev + item.priceValue);
    router.push('/modal');
  };

  const handleStoreInfoPress = () => {
    router.push('/store/1' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#061138" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Banner Header Card */}
        <TouchableOpacity activeOpacity={0.9} style={styles.storeHeaderCard} onPress={handleStoreInfoPress}>
          <View style={styles.storeLogoSquare}>
            <Image source={require('../../assets/images/fresh_products.png')} style={styles.storeLogoImage} resizeMode="contain" />
          </View>
          <View style={styles.storeInfoCol}>
            <View style={styles.storeTitleRow}>
              <Text style={styles.storeTitle}>Green Mart</Text>
              <Ionicons name="information-circle-outline" size={20} color="#64748B" style={{ marginLeft: 6 }} />
            </View>
            <View style={styles.subInfoRow}>
              <Text style={styles.subInfoText}>🕒 15–20 min</Text>
              <Text style={styles.subInfoText}>📍 0.8 km</Text>
              <Text style={styles.subInfoText}>🚚 Fee LKR 250</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Search Bar inside Store */}
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in Green Mart"
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

        {/* 2-Column Product Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              style={styles.productCard}
              onPress={() => handleProductPress(item.id)}
            >
              {/* In Stock Badge */}
              <View style={styles.inStockBadge}>
                <Text style={styles.inStockText}>IN STOCK</Text>
              </View>

              {/* Product Image */}
              <View style={styles.productImageContainer}>
                <Image source={item.image} style={styles.productImage} resizeMode="contain" />
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productSubtitle}>{item.subtitle}</Text>

              {/* Price & Add Button Row */}
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>{item.price}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.addPlusBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <Ionicons name="add" size={22} color="#061138" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
            <Ionicons name="cart" size={22} color="#061138" style={{ marginRight: 8 }} />
            <Text style={styles.cartBarText}>View Cart ({cartCount} items)</Text>
          </View>
          <Text style={styles.cartBarPrice}>LKR {cartTotal}</Text>
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
    height: 44,
    justifyContent: 'center',
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  storeHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  storeLogoSquare: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  storeLogoImage: {
    width: 44,
    height: 44,
  },
  storeInfoCol: {
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subInfoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  subInfoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  chipsRow: {
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#FDB813',
  },
  chipUnselected: {
    backgroundColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#061138',
  },
  chipTextUnselected: {
    color: '#475569',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
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
  inStockText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#14532D',
  },
  productImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  productSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  addPlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FDB813',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCartBarContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
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
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061138',
  },
  cartBarPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#061138',
  },
});
