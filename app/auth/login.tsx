import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleRegisterNow = () => {
    router.push('/register/step1');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Yellow Header Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.logoBadgeContainer}>
            <Image
              source={require('../../assets/images/yaalu_logo.png')}
              style={styles.logoBadgeImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerBrandTitle}>YAALU</Text>
          <Text style={styles.headerTagline}>Deliver with Trust</Text>
        </View>

        {/* Main Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue delivering smiles</Text>

          {/* Email or Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <View style={styles.inputBox}>
              <View style={styles.iconSquare}>
                <Ionicons name="person" size={18} color="#FFFFFF" />
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

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <View style={styles.iconSquare}>
                <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.forgotPasswordBtn}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Social Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.googleBtn}>
            <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.googleIcon} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to Yaalu? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleRegisterNow}>
            <Text style={styles.registerNowText}>Register Now</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  headerBanner: {
    backgroundColor: '#FDB813',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoBadgeContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoBadgeImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  headerBrandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: 2,
  },
  headerTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#061138',
    marginTop: 2,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  iconSquare: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0036AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 8,
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0036AA',
  },
  loginButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    paddingHorizontal: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  registerNowText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#061138',
  },
});
