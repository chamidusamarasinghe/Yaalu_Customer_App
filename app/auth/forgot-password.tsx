import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurvedHeader from '../../components/CurvedHeader';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleSendOtp = () => {
    router.push('/auth/verify-otp');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Curved Arch Header */}
      <CurvedHeader height={150}>
        <View style={styles.mailBadgeWrapper}>
          <View style={styles.mailBadgeSquare}>
            <Ionicons name="mail" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.lockBadgeMini}>
            <Ionicons name="lock-closed" size={12} color="#000000" />
          </View>
        </View>
      </CurvedHeader>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email or phone number and we'll send you a verification code.
        </Text>

        {/* Input Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email or Phone Number</Text>
          <View style={styles.inputBox}>
            <View style={styles.iconSquare}>
              <Ionicons name="person" size={18} color="#0036AA" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter email or phone number"
              placeholderTextColor="#94A3B8"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.sendOtpButton}
          onPress={handleSendOtp}
        >
          <Text style={styles.sendOtpButtonText}>Send OTP</Text>
        </TouchableOpacity>
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
    paddingTop: 45,
    paddingBottom: 40,
  },
  mailBadgeWrapper: {
    position: 'relative',
  },
  mailBadgeSquare: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0036AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadgeMini: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FDB813',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#061138',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  fieldContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  sendOtpButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sendOtpButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
