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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Header Card */}
        <View style={styles.docHeaderCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={28} color="#059669" />
          </View>
          <Text style={styles.docTitle}>Privacy Policy</Text>
          <Text style={styles.docMeta}>Last updated: August 18, 2026 • Data Protection Compliant</Text>
        </View>

        {/* Info Alert Box */}
        <View style={styles.infoBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            At YAALU, we prioritize your privacy and ensure your personal data is protected with bank-grade encryption.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionBody}>
            We collect information you provide directly, such as your full name, phone number, email address, saved delivery addresses, payment preferences, and order history.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
          <Text style={styles.sectionBody}>
            Your data is used to process orders, enable live GPS tracking, notify you of delivery status, process payments, and improve customer support responsiveness.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Location Services & Map Data</Text>
          <Text style={styles.sectionBody}>
            Precise GPS location is collected only when selecting delivery addresses or tracking active delivery drivers. You can manage location permissions in your device settings.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Data Sharing & Third Parties</Text>
          <Text style={styles.sectionBody}>
            We share relevant delivery details (such as your address and phone number) with assigned delivery drivers and partner stores strictly to fulfill your order. We never sell your data to third parties.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Data Security & Storage</Text>
          <Text style={styles.sectionBody}>
            All network communication is secured using HTTPS and SSL encryption. Account passwords and sensitive payment credentials are stored in encrypted format on high-security servers.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Cookies & Analytics</Text>
          <Text style={styles.sectionBody}>
            Anonymized usage statistics and crash metrics are collected to help us optimize app stability, screen loading performance, and navigation experience.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>7. Your Data Rights & Deletion</Text>
          <Text style={styles.sectionBody}>
            You have the right to request a copy of your personal data or request permanent account deletion at any time by contacting privacy@yaalu.lk.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.acceptBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.acceptBtnText}>I Understand</Text>
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
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#065F46',
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
