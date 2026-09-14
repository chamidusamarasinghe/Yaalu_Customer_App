import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurvedHeader from '../../components/CurvedHeader';
import { authService } from '../../services/api/auth-service';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ target?: string }>();
  const target = params.target || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto-focus next box
    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(target);
      setTimer(30);
      if (res.otp) {
        Alert.alert('New Code Sent 📩', `Your new 6-digit verification code is: ${res.otp}`);
      } else {
        Alert.alert('New Code Sent 📩', res.message || 'Check your SMS or email for the new code.');
      }
    } catch (err: any) {
      Alert.alert('Resend Failed ⚠️', err?.message || 'Could not resend OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Validation Error ⚠️', 'Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.verifyOtp({
        target: target,
        code: code,
      });

      if (result.verified) {
        router.push(`/auth/reset-password?target=${encodeURIComponent(target)}&otp=${encodeURIComponent(code)}`);
      } else {
        Alert.alert('Verification Failed ⚠️', result.message || 'Invalid or expired OTP code. Please check and try again.');
      }
    } catch (err: any) {
      console.warn('[VerifyOtp Error]:', err?.message || err);
      Alert.alert('Verification Error ⚠️', err?.message || 'Failed to verify OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Curved Header */}
      <CurvedHeader height={150} onBackPress={() => router.back()}>
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
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phoneText}>{target || 'your registered contact'}</Text>
        </Text>

        {/* 6-Digit Code Input Boxes */}
        <View style={styles.otpBoxesRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpBox,
                otp[index] ? styles.otpBoxFilled : styles.otpBoxEmpty,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Resend Timer Text */}
        <View style={styles.timerRow}>
          <Text style={styles.resendText}>
            Resend OTP in{' '}
            <Text style={styles.timerText}>
              {`00:${timer < 10 ? `0${timer}` : timer}`}
            </Text>
          </Text>

          {timer === 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleResend} style={styles.resendBtn}>
              <Text style={styles.resendBtnText}>Resend Code Now</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify OTP Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.verifyOtpButton, isLoading && { opacity: 0.7 }]}
          onPress={handleVerifyOtp}
          disabled={isLoading}
        >
          <Text style={styles.verifyOtpButtonText}>
            {isLoading ? 'Verifying Code...' : 'Verify OTP'}
          </Text>
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
    alignItems: 'center',
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
    marginBottom: 36,
  },
  phoneText: {
    color: '#0036AA',
    fontWeight: '700',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  otpBoxEmpty: {
    borderColor: '#CBD5E1',
  },
  otpBoxFilled: {
    borderColor: '#0036AA',
    borderWidth: 2,
  },
  timerRow: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#64748B',
  },
  timerText: {
    color: '#0036AA',
    fontWeight: '800',
  },
  resendBtn: {
    marginTop: 12,
  },
  resendBtnText: {
    color: '#0036AA',
    fontWeight: '700',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  verifyOtpButton: {
    width: '100%',
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  verifyOtpButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
