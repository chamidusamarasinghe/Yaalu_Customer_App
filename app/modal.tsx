import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddedToCartModal() {
  const router = useRouter();

  const handleViewCart = () => {
    router.replace('/(tabs)/cart');
  };

  const handleContinueShopping = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/explore');
    }
  };

  return (
    <View style={styles.overlayContainer}>
      {/* Semi-transparent Dimmed Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdrop}
        onPress={handleContinueShopping}
      />

      {/* Modal Dialog Box */}
      <View style={styles.modalCard}>
        {/* Close Button X */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.closeBtn}
          onPress={handleContinueShopping}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-outline" size={24} color="#059669" />
        </TouchableOpacity>

        {/* Green Circle Checkmark Badge */}
        <View style={styles.checkmarkBadge}>
          <Ionicons name="checkmark-sharp" size={36} color="#FFFFFF" />
        </View>

        {/* Title & Message */}
        <Text style={styles.modalTitle}>Added to Cart!</Text>
        <Text style={styles.modalMessage}>
          Red Apple (1kg) has been added to your cart.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.viewCartBtn}
          onPress={handleViewCart}
        >
          <Text style={styles.viewCartBtnText}>View Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.continueShoppingBtn}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 16 : 48,
    paddingBottom: 32,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 4,
  },
  checkmarkBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  viewCartBtn: {
    width: '100%',
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  viewCartBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  continueShoppingBtn: {
    paddingVertical: 6,
  },
  continueShoppingText: {
    color: '#0036AA',
    fontSize: 15,
    fontWeight: '700',
  },
});
