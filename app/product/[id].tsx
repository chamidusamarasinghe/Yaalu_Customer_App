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
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productService, ProductItem } from '../../services/api/product-service';
import { cartService } from '../../services/api/cart-service';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddedModal, setShowAddedModal] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      loadProduct(id as string);
    }
  }, [id]);

  const loadProduct = async (prodId: string) => {
    setLoading(true);
    try {
      const fetched = await productService.getProductById(prodId);
      setProduct(fetched);
    } catch (err) {
      console.warn('[ProductDetailsScreen Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      cartService.addItem(product);
    }
    setShowAddedModal(true);
  };

  const cartCount = cartService.getTotalCount();
  const cartTotal = cartService.getSubtotal();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#061138" />
            </TouchableOpacity>
            <View style={styles.storeTitleCol}>
              <Text style={styles.storeHeaderName}>{product?.name || 'Product Details'}</Text>
            </View>
            <View style={{ width: 26 }} />
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FDB813" />
          <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Loading product details...</Text>
        </View>
      ) : !product ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '700', color: '#0F172A' }}>Product Not Found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={styles.imageGalleryWrapper}>
            <Image
              source={product.imageUrl ? { uri: product.imageUrl } : require('../../assets/images/red_apples.png')}
              style={styles.productHeroImage}
              resizeMode="contain"
            />
          </View>

          {/* Details */}
          <View style={styles.productDetailsContainer}>
            <Text style={styles.productTitle}>{product.name}</Text>

            <View style={styles.priceBadgeRow}>
              <Text style={styles.productPrice}>LKR {product.price}</Text>
              <View style={styles.inStockBadge}>
                <Text style={styles.inStockText}>{product.stock > 0 ? `In Stock (${product.stock} ${product.unit})` : 'Out of Stock'}</Text>
              </View>
            </View>

            <Text style={styles.productDescription}>
              {product.description || 'Fresh quality produce sourced from verified local vendors.'}
            </Text>

            {/* Quantity Counter */}
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
              <Ionicons name="cart-outline" size={22} color="#061138" style={{ marginRight: 8 }} />
              <Text style={styles.cartBarTitle}>View Cart ({cartCount})</Text>
            </View>
            <View style={styles.cartBarRight}>
              <Text style={styles.cartBarPrice}>LKR {cartTotal.toFixed(2)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#061138" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Added to Cart Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAddedModal}
        onRequestClose={() => setShowAddedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.modalCloseBtn}
              onPress={() => setShowAddedModal(false)}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.checkCircleBox}>
              <Ionicons name="checkmark-sharp" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitleText}>Added to Cart!</Text>
            <Text style={styles.modalSubtitleText}>
              {product?.name || 'Product'} has been added to your cart.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.modalViewCartBtn}
              onPress={() => {
                setShowAddedModal(false);
                router.push('/(tabs)/cart');
              }}
            >
              <Text style={styles.modalViewCartText}>View Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.modalContinueBtn}
              onPress={() => {
                setShowAddedModal(false);
                router.push('/(tabs)/explore');
              }}
            >
              <Text style={styles.modalContinueText}>Continue Shopping</Text>
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
  storeHeaderName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061138',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  imageGalleryWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productHeroImage: {
    width: '100%',
    height: 200,
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
    backgroundColor: '#FDB813',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061138',
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#061138',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  checkCircleBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  modalTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 8,
  },
  modalSubtitleText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalViewCartBtn: {
    width: '100%',
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalViewCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalContinueBtn: {
    paddingVertical: 8,
  },
  modalContinueText: {
    color: '#0036AA',
    fontSize: 15,
    fontWeight: '700',
  },
});
