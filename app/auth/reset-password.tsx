import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurvedHeader from '../../components/CurvedHeader';
import { authService } from '../../services/api/auth-service';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ target?: string; otp?: string }>();
  const target = params.target || '';
  const otp = params.otp || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert('Validation Error ⚠️', 'Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Validation Error ⚠️', 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error ⚠️', 'New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.resetPassword({
        target: target,
        otp: otp || '123456',
        newPassword: newPassword,
      });

      Alert.alert(
        'Password Reset Successful! 🎉',
        res.message || 'Your password has been updated successfully. Please log in with your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (err: any) {
      console.warn('[ResetPassword Error]:', err?.message || err);
      Alert.alert('Reset Failed ⚠️', err?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Curved Header */}
      <CurvedHeader height={150} onBackPress={() => router.back()}>
        <View style={styles.lockBadgeWrapper}>
          <View style={styles.lockBadgeSquare}>
            <Ionicons name="key" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.checkBadgeMini}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        </View>
      </CurvedHeader>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from previously used passwords.
        </Text>

        {/* New Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputBox}>
            <View style={styles.iconSquare}>
              <Ionicons name="lock-closed" size={18} color="#0036AA" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter new password (min. 6 chars)"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.eyeBtn}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputBox}>
            <View style={styles.iconSquare}>
              <Ionicons name="lock-closed" size={18} color="#0036AA" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.resetButton, isLoading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
  },
  lockBadgeWrapper: {
    position: 'relative',
  },
  lockBadgeSquare: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0036AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadgeMini: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
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
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
  },
  eyeBtn: {
    padding: 8,
  },
  resetButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
