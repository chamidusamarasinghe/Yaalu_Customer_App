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

export default function RegistrationStep1Screen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nicNumber, setNicNumber] = useState('');

  const handleNext = () => {
    router.push('/register/step2');
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
        {/* Progress Bar Header */}
        <View style={styles.progressContainer}>
          <Text style={styles.stepText}>Step 1 of 2</Text>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Main Card Container */}
        <View style={styles.cardContainer}>
          {/* Card Title */}
          <View style={styles.cardHeaderRow}>
            <Ionicons name="person-outline" size={24} color="#0B2384" style={styles.headerIcon} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          {/* Profile Photo Uploader */}
          <View style={styles.photoUploadSection}>
            <TouchableOpacity activeOpacity={0.8} style={styles.dashedPhotoCircle}>
              <Ionicons name="camera-outline" size={32} color="#1D4ED8" />
              <Text style={styles.photoUploadLabel}>PROFILE PHOTO</Text>
            </TouchableOpacity>
            <Text style={styles.photoSubtext}>Clear face photo for your rider profile</Text>
          </View>

          {/* Names Row (First Name & Last Name) */}
          <View style={styles.namesRow}>
            <View style={styles.halfField}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Phone Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+94 7X XXX XXXX"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* NIC Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>NIC Number</Text>
            <TextInput
              style={styles.input}
              placeholder="XXXXXXXXXV / 20XXXXXXXXXX"
              placeholderTextColor="#94A3B8"
              value={nicNumber}
              onChangeText={setNicNumber}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.continueButton}
          onPress={handleNext}
        >
          <Text style={styles.continueButtonText}>Continue to Step 2</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Footer Legal Terms */}
        <Text style={styles.footerLegalText}>
          By continuing, you agree to Yalu's{' '}
          <Text style={styles.legalLink} onPress={() => router.push('/legal/terms')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.legalLink} onPress={() => router.push('/legal/privacy')}>
            Privacy Policy
          </Text>
          .
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2384',
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#061138',
    borderRadius: 4,
  },
  cardContainer: {
    backgroundColor: '#F0F5FF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2384',
  },
  photoUploadSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dashedPhotoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginBottom: 10,
  },
  photoUploadLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  photoSubtext: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
  },
  namesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  continueButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  footerLegalText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#0284C7',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
