import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YellowHeader from '../../components/YellowHeader';

type VerifyMethod = 'phone' | 'email';

export default function VerifyAccountScreen() {
  const router = useRouter();

  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerify = () => {
    router.replace('/auth/create-password');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />
      <YellowHeader showLogo />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shield Icon Badge */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBadge}>
            <Ionicons name="shield-checkmark" size={32} color="#059669" />
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Verify Account</Text>
        <Text style={styles.subtitle}>
          We need to verify your identity to ensure a safe shopping experience. A 6-digit verification code will be sent to you.
        </Text>

        {/* Segmented Toggle Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabSegment, verifyMethod === 'phone' && styles.tabSegmentActive]}
            onPress={() => setVerifyMethod('phone')}
          >
            <Text style={[styles.tabText, verifyMethod === 'phone' && styles.tabTextActive]}>
              Phone Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabSegment, verifyMethod === 'email' && styles.tabSegmentActive]}
            onPress={() => setVerifyMethod('email')}
          >
            <Text style={[styles.tabText, verifyMethod === 'email' && styles.tabTextActive]}>
              Email Address
            </Text>
          </TouchableOpacity>
        </View>

        {/* Send OTP Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.sendOtpButton}
          onPress={handleSendOtp}
        >
          <Text style={styles.sendOtpButtonText}>Send OTP</Text>
          <Ionicons name="send" size={16} color="#FFFFFF" style={styles.sendIcon} />
        </TouchableOpacity>

        {/* Enter OTP Field */}
        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <View style={styles.otpInputBox}>
            <TextInput
              style={styles.otpInput}
              placeholder="------"
              placeholderTextColor="#CBD5E1"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />
          </View>
        </View>

        {/* Verify Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.verifyButton}
          onPress={handleVerify}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Footer Link */}
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink} onPress={() => router.push('/legal/terms')}>
            Terms of Service
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    padding: 4,
    width: '100%',
    marginBottom: 32,
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSegmentActive: {
    backgroundColor: '#061138',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sendOtpButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  sendOtpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  sendIcon: {
    transform: [{ rotate: '-20deg' }],
  },
  otpSection: {
    width: '100%',
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  otpInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 12,
    textAlign: 'center',
    width: '100%',
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  termsLink: {
    color: '#059669',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
