import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SelectPaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cod'>('card');

  const handlePlaceOrder = () => {
    if (selectedMethod === 'card') {
      router.push('/checkout/add-card' as any);
    } else {
      router.push('/checkout/success' as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#061138" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Select a payment method</Text>
        <Text style={styles.pageSubtitle}>Choose your preferred way to pay</Text>

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
              <Text style={styles.methodSubtext}>Pay securely using your card</Text>
            </View>
            <View style={styles.radioOuter}>
              {selectedMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </View>

          {/* Card Brand Logos */}
          <View style={styles.cardLogosRow}>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>VISA</Text></View>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>MC</Text></View>
            <View style={styles.logoChip}><Text style={styles.logoChipText}>AMEX</Text></View>
          </View>
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

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sub Total</Text>
            <Text style={styles.summaryVal}>LKR 1,290.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>LKR 250.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Convenience Fee</Text>
            <Text style={styles.summaryVal}>LKR 30.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValBlue}>LKR 1,570.00</Text>
          </View>
        </View>

        {/* 100% Secure Guarantee Card */}
        <View style={styles.secureGuaranteeCard}>
          <Ionicons name="shield-checkmark-sharp" size={22} color="#059669" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.guaranteeTitle}>Your payment is 100% secure</Text>
            <Text style={styles.guaranteeSub}>We do not store your card details</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity activeOpacity={0.88} style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.placeOrderBtnText}>Place Order</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginVertical: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryCardTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#64748B' },
  summaryVal: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  totalValBlue: { fontSize: 20, fontWeight: '900', color: '#0036AA' },
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
