import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YellowHeader from '../../components/YellowHeader';
import { authService } from '../../services/api/auth-service';

export default function CreatePasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation Rules
  const isMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getStrengthLevel = () => {
    let score = 0;
    if (isMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: '#EF4444' };
    if (score <= 4) return { level: 2, label: 'Medium', color: '#F59E0B' };
    return { level: 3, label: 'Strong', color: '#10B981' };
  };

  const strength = getStrengthLevel();

  const handleCreatePassword = async () => {
    if (!isMinLength) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match. Please check again.');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser.email) {
      Alert.alert('Registration Error', 'Missing registration details. Please restart registration.');
      router.push('/register/step1');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        email: currentUser.email,
        password: password,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phoneNumber: currentUser.phoneNumber,
        nicNumber: currentUser.nicNumber,
        city: currentUser.city,
        profilePicture: currentUser.profilePicture,
        address: currentUser.address,
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
      });

      Alert.alert(
        'Registration Successful 🎉',
        'Your account has been created! Welcome to Yaalu.',
        [{ text: 'Go to Home', onPress: () => router.push('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Unable to register user account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />
      <YellowHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header Badge */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBadge}>
            <Ionicons name="lock-closed" size={32} color="#059669" />
          </View>
        </View>

        <Text style={styles.title}>Create Password</Text>
        <Text style={styles.subtitle}>
          Set a secure password for your Yaalu Customer Account
        </Text>

        {/* New Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>New Password *</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter secure password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Strength Meter */}
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthTitle}>Password Strength</Text>
          <View style={styles.barsRow}>
            <View
              style={[
                styles.strengthBar,
                strength.level >= 1 && { backgroundColor: strength.color },
              ]}
            />
            <View
              style={[
                styles.strengthBar,
                strength.level >= 2 && { backgroundColor: strength.color },
              ]}
            />
            <View
              style={[
                styles.strengthBar,
                strength.level >= 3 && { backgroundColor: strength.color },
              ]}
            />
          </View>
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        </View>

        {/* Rules Checklist */}
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Password Requirements:</Text>

          <View style={styles.ruleItem}>
            <Ionicons
              name={isMinLength ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={isMinLength ? '#10B981' : '#CBD5E1'}
            />
            <Text style={[styles.ruleText, isMinLength && styles.ruleTextActive]}>
              At least 6 characters
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons
              name={hasUppercase ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={hasUppercase ? '#10B981' : '#CBD5E1'}
            />
            <Text style={[styles.ruleText, hasUppercase && styles.ruleTextActive]}>
              At least one uppercase letter (A-Z)
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons
              name={hasNumber ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={hasNumber ? '#10B981' : '#CBD5E1'}
            />
            <Text style={[styles.ruleText, hasNumber && styles.ruleTextActive]}>
              At least one number (0-9)
            </Text>
          </View>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm Password *</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
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

        {/* Create Password Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.createButton, isLoading && { opacity: 0.7 }]}
          onPress={handleCreatePassword}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Text>
        </TouchableOpacity>

        {/* Footer Legal Terms */}
        <Text style={styles.footerLegalText}>
          By creating an account, you agree to our{' '}
          <Text style={styles.legalLink} onPress={() => router.push('/legal/terms')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.legalLink} onPress={() => router.push('/legal/privacy')}>
            Privacy Policy
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 18,
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
    paddingHorizontal: 16,
    paddingVertical: 4,
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
  strengthContainer: {
    marginBottom: 20,
  },
  strengthTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  rulesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleText: {
    fontSize: 13,
    color: '#64748B',
  },
  ruleTextActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  footerLegalText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#059669',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
