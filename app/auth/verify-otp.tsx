import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurvedHeader from '../../components/CurvedHeader';

export default function VerifyOtpScreen() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next box
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto navigate on fill
    if (newOtp.every((digit) => digit.length > 0)) {
      setTimeout(() => {
        router.push('/auth/reset-password');
      }, 300);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
    }
  };

  const handleverifyOtp = () => {
    router.push ('/auth/reset-password');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Curved Header */}
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
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phoneText}>+94 77 123 4567</Text>
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

        {/* Send Verify OTP Button */}
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.verifyOtpButton}
                  onPress={handleverifyOtp}
                >
                  <Text style={styles.verifyOtpButtonText}>Verify OTP</Text>
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
    marginBottom: 40,
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
    borderColor: '#0F172A',
    borderWidth: 1.5,
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
