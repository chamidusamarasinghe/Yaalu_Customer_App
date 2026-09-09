import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import { authService } from '../../services/api/auth-service';
import { uploadService } from '../../services/api/upload-service';

export default function UserProfileScreen() {
  const router = useRouter();
  const user = authService.getCurrentUser();

  // Dynamic Profile Form States
  const [fullName, setFullName] = useState(
    user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '')
  );
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phoneNumber || user.phone || user.mobile || '');
  const [nic, setNic] = useState(user.nicNumber || user.nic || '');
  const [city, setCity] = useState(user.city || '');
  const [address, setAddress] = useState(user.address || user.deliveryAddress || '');

  useEffect(() => {
    async function loadLatestProfile() {
      if (user.id || user.email) {
        try {
          const res = await authService.updateProfile({ id: user.id, email: user.email });
          if (res && res.user) {
            const u = res.user;
            setFullName(u.fullName || (u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : ''));
            setEmail(u.email || '');
            setPhone(u.phoneNumber || u.phone || u.mobile || '');
            setNic(u.nicNumber || u.nic || '');
            setCity(u.city || '');
            setAddress(u.address || u.deliveryAddress || '');
            if (u.profilePicture) setProfilePicture(u.profilePicture);
          }
        } catch (e) {
          console.log('[Profile Screen]: Loaded cached profile details.');
        }
      }
    }
    loadLatestProfile();
  }, []);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Preferences Switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);

  const processAndUploadPhoto = async (localUri: string) => {
    setIsUploadingPhoto(true);
    setProfilePicture(localUri);

    try {
      const res = await uploadService.uploadImage(localUri, 'yaalu/profiles/customers');
      if (res && res.url) {
        setProfilePicture(res.url);
        console.log('[Cloudinary Profile Photo Uploaded]:', res.url);
          const updateRes = await authService.updateProfile({
            id: user.id,
            profilePicture: res.url,
          });
          if (updateRes && updateRes.user && updateRes.user.profilePicture) {
            setProfilePicture(updateRes.user.profilePicture);
          }
          Alert.alert('Photo Updated', 'Your profile picture has been saved to the database!');
      }
    } catch (err: any) {
      console.warn('[Cloudinary Profile Photo Warning]:', err?.message || err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePickImage = async () => {
    Alert.alert(
      'Update Profile Photo 📸',
      'Choose an option to update your profile photo (Uploaded to Cloudinary CDN):',
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
              Alert.alert('Permission Needed', 'Gallery permission is required to choose a profile photo.');
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

  const handleSaveProfile = async () => {
    if (isLoading || isUploadingPhoto) return;
    setIsLoading(true);
    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await authService.updateProfile({
        id: user.id,
        email: email.trim(),
        firstName,
        lastName,
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        nicNumber: nic.trim(),
        city: city.trim(),
        address: address.trim(),
        profilePicture: profilePicture,
      });

      Alert.alert('Profile Updated 🎉', 'Your profile details and picture have been saved to the database!');
    } catch (error: any) {
      Alert.alert('Save Note', error.message || 'Updated local profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of YAALU?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          authService.logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} onPress={handleSaveProfile}>
          <Ionicons name="checkmark-sharp" size={24} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Hero Avatar Section */}
        <View style={styles.avatarHeroContainer}>
          <TouchableOpacity activeOpacity={0.85} onPress={handlePickImage} style={styles.avatarWrapper}>
            {isUploadingPhoto ? (
              <View style={[styles.avatarImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2E8F0' }]}>
                <ActivityIndicator size="large" color="#0A0E1A" />
              </View>
            ) : (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userNameText}>{fullName || 'Customer Profile'}</Text>
          <Text style={styles.userEmailSubtitle}>{email || 'Not logged in'}</Text>

          <TouchableOpacity activeOpacity={0.7} onPress={handlePickImage} style={styles.membershipBadge}>
            <Ionicons name="cloud-upload-outline" size={14} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.membershipText}>{isUploadingPhoto ? 'Uploading...' : 'Tap photo to change'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Completed Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.9 ★</Text>
            <Text style={styles.statLabel}>User Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Saved Addresses</Text>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Mobile Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* NIC Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NIC Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={nic}
                onChangeText={setNic}
                placeholder="Enter NIC number"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* City / Region */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City / Region</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Street Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={18} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter street address"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          {/* Push Notifications */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Push Notifications</Text>
              <Text style={styles.switchSubtext}>Order status and delivery updates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#FDB813' }}
              thumbColor={notificationsEnabled ? '#0A0E1A' : '#F1F5F9'}
            />
          </View>

          {/* SMS Alerts */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>SMS Order Alerts</Text>
              <Text style={styles.switchSubtext}>Receive SMS for driver arrival</Text>
            </View>
            <Switch
              value={smsAlertsEnabled}
              onValueChange={setSmsAlertsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#FDB813' }}
              thumbColor={smsAlertsEnabled ? '#0A0E1A' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Save & Logout Buttons */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.saveBtn, (isLoading || isUploadingPhoto) && { opacity: 0.7 }]}
          onPress={handleSaveProfile}
          disabled={isLoading || isUploadingPhoto}
        >
          <Text style={styles.saveBtnText}>{isLoading ? 'Saving Changes...' : isUploadingPhoto ? 'Uploading Photo...' : 'Save Profile Changes'}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomBottomTabBar activeTab="HOME" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  avatarHeroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FDB813',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A0E1A',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  userEmailSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membershipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A0E1A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0E1A',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0A0E1A',
    fontWeight: '600',
    paddingVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0E1A',
  },
  switchSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: '#0A0E1A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0A0E1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '800',
  },
});
