import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { cardService } from '../../services/api/card-service';
import { authService } from '../../services/api/auth-service';

export default function AddCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ total?: string }>();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleAddCardAndPay = async () => {
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');

    if (!cardName.trim()) {
      Alert.alert('Validation Error', 'Please enter the cardholder name.');
      return;
    }
    if (!cleanCardNumber || cleanCardNumber.length < 12) {
      Alert.alert('Validation Error', 'Please enter a valid card number (at least 12 digits).');
      return;
    }
    if (!expiryDate || !expiryDate.includes('/')) {
      Alert.alert('Validation Error', 'Please enter a valid expiry date (MM/YY).');
      return;
    }

    setSubmitting(true);
    try {
      const user = authService.getCurrentUser();

      // 1. Save user card to PostgreSQL database via API
      const savedCard = await cardService.saveCard({
        userId: user.id || 'cust_dev_1',
        cardholderName: cardName.trim(),
        cardNumber: cleanCardNumber,
        expiryDate: expiryDate.trim(),
        isDefault: saveCard,
      });

      console.log('[Card Saved to DB]:', savedCard);

      // 2. Redirect to Checkout Page with saved card selected
      router.push({
        pathname: '/checkout/checkout-page',
        params: {
          selectedMethod: 'card',
          cardId: savedCard.id,
          cardMask: savedCard.cardNumberMask,
        },
      } as any);
    } catch (err: any) {
      console.warn('[AddCard Error]:', err);
      Alert.alert('Payment Error', 'Failed to save card. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Credit Card Graphic Banner */}
        <View style={styles.cardGraphicWrapper}>
          <Image
            source={require('../../assets/images/credit_card_bg.png')}
            style={styles.cardGraphicImage}
            resizeMode="cover"
          />
        </View>

        {/* Form Input Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chamindu Silva"
              placeholderTextColor="#94A3B8"
              value={cardName}
              onChangeText={setCardName}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="4242 4242 4242 4242"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={19}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <Ionicons name="card-outline" size={20} color="#94A3B8" style={styles.inputIconRight} />
          </View>
        </View>

        {/* Expiry Date & CVV Row */}
        <View style={styles.rowTwoFields}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={5}
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                value={cvv}
                onChangeText={setCvv}
              />
              <Ionicons name="help-circle-outline" size={18} color="#94A3B8" style={styles.inputIconRight} />
            </View>
          </View>
        </View>

        {/* Save Card Toggle Box */}
        <View style={styles.saveCardBox}>
          <View style={styles.saveCardLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#059669" style={{ marginRight: 10 }} />
            <Text style={styles.saveCardText}>Save card to database for future payments</Text>
          </View>
          <Switch
            value={saveCard}
            onValueChange={setSaveCard}
            trackColor={{ false: '#CBD5E1', true: '#FDB813' }}
            thumbColor={saveCard ? '#FFFFFF' : '#F4F4F5'}
          />
        </View>

        {/* Security Subtext */}
        <View style={styles.secureSubtextRow}>
          <Ionicons name="lock-closed" size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.secureSubtext}>SECURE SSL ENCRYPTED TRANSACTION</Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.addCardBtn}
          onPress={handleAddCardAndPay}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="card" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addCardBtnText}>Add Card & Save</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.legalSubtext}>
          By adding this card, you agree to YAALU's{' '}
          <Text style={{ textDecorationLine: 'underline', color: '#059669' }} onPress={() => router.push('/legal/terms')}>
            Payment Terms
          </Text>{' '}
          &{' '}
          <Text style={{ textDecorationLine: 'underline', color: '#059669' }} onPress={() => router.push('/legal/privacy')}>
            Privacy Policy
          </Text>
          .
        </Text>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  cardGraphicWrapper: {
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGraphicImage: { width: '100%', height: '100%' },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    height: 52,
  },
  input: { flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '500' },
  inputIconRight: { marginLeft: 8 },
  rowTwoFields: { flexDirection: 'row', gap: 14 },
  saveCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 10,
  },
  saveCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  saveCardText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  secureSubtextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  secureSubtext: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 },
  addCardBtn: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addCardBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  legalSubtext: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, paddingHorizontal: 16 },
});
