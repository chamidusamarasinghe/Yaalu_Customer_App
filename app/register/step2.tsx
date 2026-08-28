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

export default function RegistrationStep2Screen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleContinueToVerification = () => {
    router.push('/register/verify');
  };

  const handleBackToStep1 = () => {
    router.push('/register/step1');
  };

  const handleSelectLocation = () => {
    router.push('/register/select-location');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />
      <YellowHeader onBackPress={handleBackToStep1} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Header Row */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.stepText}>Step 2 of 2</Text>
            <Text style={styles.stepTitle}>Contact & Address</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Ionicons name="card-outline" size={24} color="#0B2384" style={styles.headerIcon} />
            <Text style={styles.cardTitle}>Your Information</Text>
          </View>

          {/* Email Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="eg : rider@yalu.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* City / Region Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>City / Region</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdownInputContainer}
              onPress={() => {}}
            >
              <View style={styles.dropdownLeftRow}>
                <Ionicons name="business-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                <Text style={city ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {city || 'Select your city'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Select Your Location Trigger */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Select Your Location</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.locationButtonBox}
              onPress={handleSelectLocation}
            >
              <Ionicons name="location-sharp" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Continue Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.continueButton}
          onPress={handleContinueToVerification}
        >
          <Text style={styles.continueButtonText}>continue to Verification</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Secondary Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButtonOutline}
          onPress={handleBackToStep1}
        >
          <Text style={styles.backButtonOutlineText}>Back to Personal Details</Text>
        </TouchableOpacity>

        {/* Watermark Illustration Graphic */}
        <View style={styles.watermarkContainer}>
          <Ionicons name="bus-outline" size={100} color="#E2E8F0" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2384',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#061138',
    borderRadius: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  dropdownInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dropdownLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTextPlaceholder: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  dropdownTextSelected: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  locationButtonBox: {
    width: 64,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
  backButtonOutline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonOutlineText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  watermarkContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    opacity: 0.7,
  },
});
