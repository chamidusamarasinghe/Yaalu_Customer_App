import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Header Card */}
        <View style={styles.docHeaderCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text-outline" size={28} color="#059669" />
          </View>
          <Text style={styles.docTitle}>Terms of Service</Text>
          <Text style={styles.docMeta}>Last updated: August 18, 2026 • Version 2.4</Text>
        </View>

        {/* Info Alert Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#0036AA" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Please read these Terms of Service carefully before using the YAALU Customer Application.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionBody}>
            By downloading, registering, or accessing the YAALU mobile app, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using our application immediately.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Account Registration & Security</Text>
          <Text style={styles.sectionBody}>
            You must be at least 18 years old or possess legal parental consent to create an account. You are responsible for safeguarding your login credentials and for all actions taken under your account.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Orders & Pricing</Text>
          <Text style={styles.sectionBody}>
            All orders placed through YAALU are subject to item availability and confirmation from partner stores. Prices listed include applicable store taxes. YAALU reserves the right to adjust delivery fees prior to checkout.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Payments & Billing</Text>
          <Text style={styles.sectionBody}>
            We support secure payments via Credit/Debit cards (Visa, MasterCard, Amex) and Cash on Delivery (COD). Electronic transactions are encrypted using industry-standard SSL encryption.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Delivery Services & Live Tracking</Text>
          <Text style={styles.sectionBody}>
            Estimated delivery times are estimates based on traffic and weather conditions. Real-time GPS location tracking is provided for your convenience while your driver is en route.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Cancellation & Refunds</Text>
          <Text style={styles.sectionBody}>
            Orders can be cancelled free of charge before store confirmation. In the event of missing or damaged items, refund requests must be submitted within 24 hours of delivery.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>7. Code of Conduct</Text>
          <Text style={styles.sectionBody}>
            Abusive behavior or harassment toward delivery partners or merchant staff will lead to immediate account termination and potential legal action.
          </Text>
        </View>

        {/* Section 8 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>8. Contact Legal Support</Text>
          <Text style={styles.sectionBody}>
            For inquiries regarding our Terms & Conditions, please email legal@yaalu.lk or contact our support team in-app.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.acceptBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.acceptBtnText}>I Understand & Agree</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  docHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  docTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  acceptBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
