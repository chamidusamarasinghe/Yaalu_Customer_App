import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { cardService, UserCard } from '../../services/api/card-service';
import { cartService } from '../../services/api/cart-service';
import { authService } from '../../services/api/auth-service';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedMethod?: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cod'>(
    params.selectedMethod === 'card' ? 'card' : 'card'
  );
  const [savedCards, setSavedCards] = useState<UserCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [loadingCards, setLoadingCards] = useState(true);

  // Dynamic values
  const cartSubtotal = cartService.getSubtotal();
  const items = cartService.getItems();
  const deliveryFeeVal = items.length > 0 ? 250 : 0;
  const convenienceFeeVal = items.length > 0 ? 30 : 0;
  const totalVal = cartSubtotal + deliveryFeeVal + convenienceFeeVal;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const user = authService.getCurrentUser();
      const cards = await cardService.getUserCards(user.id);
      setSavedCards(cards || []);
      if (cards && cards.length > 0) {
        const defaultCard = cards.find((c) => c.isDefault) || cards[0];
        setSelectedCardId(defaultCard.id);
      }
    } catch (err) {
      console.warn('[PaymentScreen fetchCards error]:', err);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleAddNewCard = () => {
    router.push({
      pathname: '/checkout/add-card',
      params: {
        total: totalVal.toFixed(2),
      },
    } as any);
  };

  const handleConfirmPaymentMethod = () => {
    if (selectedMethod === 'card' && savedCards.length === 0) {
      handleAddNewCard();
      return;
    }

    const selectedCard = savedCards.find((c) => c.id === selectedCardId);
    router.push({
      pathname: '/checkout/checkout-page',
      params: {
        selectedMethod,
        cardId: selectedCard?.id || '',
        cardMask: selectedCard?.cardNumberMask || '',
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#061138" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Payment Option</Text>
        <Text style={styles.pageSubtitle}>Select your preferred way to pay</Text>

        {/* Option 1: Card Payment */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconCircle}>
              <Ionicons name="card-outline" size={22} color="#0F172A" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.methodTitle}>Card Payment</Text>
                <View style={styles.secureTag}>
                  <Text style={styles.secureTagText}>Secure</Text>
                </View>
              </View>
              <Text style={styles.methodSubtext}>Pay securely using your credit or debit card</Text>
            </View>
            <View style={styles.radioOuter}>
              {selectedMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </View>

          {/* Card Brand Logos */}
          <View style={styles.cardLogosRow}>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>VISA</Text></View>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>MASTERCARD</Text></View>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>AMEX</Text></View>
          </View>

          {/* Saved Cards List */}
          {selectedMethod === 'card' && (
            <View style={styles.savedCardsContainer}>
              {loadingCards ? (
                <ActivityIndicator size="small" color="#D97706" style={{ marginVertical: 10 }} />
              ) : savedCards.length > 0 ? (
                <View style={{ gap: 10, marginTop: 12 }}>
                  <Text style={styles.savedCardsTitle}>Saved Cards in Database:</Text>
                  {savedCards.map((card) => (
                    <TouchableOpacity
                      key={card.id}
                      activeOpacity={0.8}
                      style={[
                        styles.savedCardItem,
                        selectedCardId === card.id && styles.savedCardItemSelected,
                      ]}
                      onPress={() => setSelectedCardId(card.id)}
                    >
                      <Ionicons
                        name={card.cardType === 'MASTERCARD' ? 'card' : 'card-outline'}
                        size={20}
                        color="#0036AA"
                        style={{ marginRight: 10 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.savedCardMask}>{card.cardNumberMask}</Text>
                        <Text style={styles.savedCardSub}>{card.cardholderName} • Exp: {card.expiryDate}</Text>
                      </View>
                      {selectedCardId === card.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#059669" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noCardsText}>No saved cards found in database.</Text>
              )}

              {/* Add New Card Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addCardRowBtn}
                onPress={handleAddNewCard}
              >
                <Ionicons name="add-circle-outline" size={20} color="#0036AA" style={{ marginRight: 6 }} />
                <Text style={styles.addCardRowBtnText}>+ Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Option 2: Cash on Delivery */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.methodCard, selectedMethod === 'cod' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('cod')}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconCircle}>
              <Ionicons name="cash-outline" size={22} color="#0F172A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Cash on Delivery</Text>
              <Text style={styles.methodSubtext}>Pay in cash when your order is delivered</Text>
            </View>
            <View style={styles.radioOuter}>
              {selectedMethod === 'cod' && <View style={styles.radioInner} />}
            </View>
          </View>
        </TouchableOpacity>

        {/* 100% Secure Guarantee Card */}
        <View style={styles.secureGuaranteeCard}>
          <Ionicons name="shield-checkmark-sharp" size={22} color="#059669" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.guaranteeTitle}>Your payment is 100% secure</Text>
            <Text style={styles.guaranteeSub}>Encrypted transaction & SSL protected</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.placeOrderBtn}
          onPress={selectedMethod === 'card' && savedCards.length === 0 ? handleAddNewCard : handleConfirmPaymentMethod}
        >
          <Text style={styles.placeOrderBtnText}>
            {selectedMethod === 'card' && savedCards.length === 0
              ? 'Proceed to Add Card'
              : 'Use Selected Payment Method'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#061138' },
  helpBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  methodCardSelected: {
    borderColor: '#D97706',
    backgroundColor: '#FFFDF5',
  },
  methodTopRow: { flexDirection: 'row', alignItems: 'center' },
  methodIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  secureTag: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  secureTagText: { fontSize: 10, fontWeight: '800', color: '#14532D' },
  methodSubtext: { fontSize: 13, color: '#64748B', marginTop: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D97706',
  },
  cardLogosRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginLeft: 56 },
  logoChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  logoChipText: { fontSize: 10, fontWeight: '900', color: '#334155' },
  savedCardsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  savedCardsTitle: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 6 },
  noCardsText: { fontSize: 13, color: '#94A3B8', marginVertical: 8, fontStyle: 'italic' },
  savedCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  savedCardItemSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  savedCardMask: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  savedCardSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  addCardRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  addCardRowBtnText: { fontSize: 14, fontWeight: '800', color: '#0036AA' },
  secureGuaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  guaranteeTitle: { fontSize: 14, fontWeight: '800', color: '#166534' },
  guaranteeSub: { fontSize: 12, color: '#15803D', marginTop: 1 },
  placeOrderBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
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
  placeOrderBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
