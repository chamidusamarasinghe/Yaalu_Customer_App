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
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import YellowHeader from '../../components/YellowHeader';
import { authService } from '../../services/api/auth-service';
import { uploadService } from '../../services/api/upload-service';

export default function RegistrationStep1Screen() {
  const router = useRouter();

  const currentUser = authService.getUser();
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [nicNumber, setNicNumber] = useState(currentUser.nicNumber || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(currentUser.profilePicture || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const processAndUploadPhoto = async (localUri: string) => {
    setIsUploadingPhoto(true);
    setProfilePicture(localUri);

    try {
      // Upload image to Cloudinary CDN
      const res = await uploadService.uploadImage(localUri, 'yaalu/profiles');
      if (res && res.url) {
        setProfilePicture(res.url);
        console.log('[Cloudinary Upload Success]:', res.url);
      }
    } catch (err: any) {
      console.warn('[Cloudinary Upload Info]:', err?.message || err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePickImage = async () => {
    Alert.alert(
      'Profile Photo 📷',
      'Select an option to add your profile photo (Uploaded to Cloudinary CDN):',
      [
        {
          text: 'Take Photo (Camera)',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Needed', 'Camera permission is required to take a profile photo.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
              const uriOrBase64 = result.assets[0].base64
                ? `data:image/jpeg;base64,${result.assets[0].base64}`
                : result.assets[0].uri;
              await processAndUploadPhoto(uriOrBase64);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Needed', 'Photo gallery permission is required to select a photo.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
              const uriOrBase64 = result.assets[0].base64
                ? `data:image/jpeg;base64,${result.assets[0].base64}`
                : result.assets[0].uri;
              await processAndUploadPhoto(uriOrBase64);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNext = () => {
    // Form Data Validation
    if (!firstName.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your First Name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Last Name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid Sri Lankan Phone Number.');
      return;
    }
    if (!nicNumber.trim() || nicNumber.trim().length < 9) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid NIC Number.');
      return;
    }

    // Save Step 1 state (including Cloudinary HTTPS photo URL)
    authService.setCurrentUser({
      ...authService.getUser(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      nicNumber: nicNumber.trim(),
      profilePicture: profilePicture || undefined,
    });

    // Step 1 -> Step 2 (Contact & Address Location Page)
    router.push('/register/step2');
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
        {/* Progress Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.stepText}>Step 1 of 3</Text>
            <Text style={styles.stepTitle}>Personal Details & Photo</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Profile Picture Camera / Gallery Picker with Cloudinary Upload */}
        <View style={styles.avatarSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage} style={styles.avatarWrapper}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholderCircle}>
                {isUploadingPhoto ? (
                  <ActivityIndicator size="large" color="#0B2384" />
                ) : (
                  <Ionicons name="camera-outline" size={32} color="#0B2384" />
                )}
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="cloud-upload" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHintText} onPress={handlePickImage}>
            {isUploadingPhoto
              ? 'Uploading to Cloudinary CDN...'
              : profilePicture
              ? 'Photo Uploaded to Cloudinary ☁️ (Tap to change)'
              : 'Tap to add profile photo (Uploaded to Cloudinary CDN)'}
          </Text>
        </View>

        {/* Form Card Container */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="person-circle-outline" size={26} color="#0B2384" style={styles.headerIcon} />
            <Text style={styles.cardTitle}>Create Account</Text>
          </View>

          {/* First Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>First Name *</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter First Name"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          {/* Last Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter Last Name"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Phone Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagEmoji}>🇱🇰</Text>
                <Text style={styles.countryCodeText}>+94</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="77 123 4567"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {/* NIC Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>NIC Number *</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="card-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter National Identity Card No."
                placeholderTextColor="#94A3B8"
                value={nicNumber}
                onChangeText={setNicNumber}
              />
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.continueButton}
          onPress={handleNext}
        >
          <Text style={styles.continueButtonText}>Continue to Contact & Address Page</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Existing Account Footer Link */}
        <View style={styles.loginLinkRow}>
          <Text style={styles.alreadyHaveText}>Already have an account?</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLinkText}> Log In</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
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
    width: '33%',
    height: '100%',
    backgroundColor: '#061138',
    borderRadius: 4,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FDB813',
  },
  avatarPlaceholderCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#061138',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarHintText: {
    fontSize: 13,
    color: '#0B2384',
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'center',
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
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginRight: 10,
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
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
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyHaveText: {
    fontSize: 14,
    color: '#64748B',
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2384',
  },
});
