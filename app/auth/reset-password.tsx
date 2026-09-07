import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurvedHeader from '../../components/CurvedHeader';

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Curved Header */}
      <CurvedHeader height={150}>
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
        {/* New Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputBox}>
            <View style={styles.iconSquare}>
              <Ionicons name="lock-closed" size={18} color="#0036AA" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
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
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <View style={styles.iconSquare}>
              <Ionicons name="lock-closed" size={18} color="#0036AA" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
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
          style={styles.resetButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
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
    marginTop: 12,
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
