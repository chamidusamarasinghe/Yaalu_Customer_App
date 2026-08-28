import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function UserProfileScreen() {
  const router = useRouter();

  // Profile Form States
  const [fullName, setFullName] = useState('Nimal Perera');
  const [email, setEmail] = useState('nimal.perera@gmail.com');
  const [phone, setPhone] = useState('077 123 4567');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Sinhala' | 'Tamil'>('English');

  // Preferences Switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleSaveProfile = () => {
    Alert.alert('Profile Updated', 'Your profile details have been saved successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of YAALU?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/auth/login') },
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
        {/* Profile Hero Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.cameraEditBtn}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroName}>{fullName}</Text>
          <Text style={styles.heroEmail}>{email}</Text>
          <Text style={styles.heroPhone}>{phone}</Text>

          <View style={styles.vipBadge}>
            <Ionicons name="star" size={14} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.vipBadgeText}>Gold Customer • 1,250 Pts</Text>
          </View>
        </View>

        {/* Quick Metrics Bar */}
        <View style={styles.metricsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.metricCard}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Ionicons name="receipt-outline" size={22} color="#059669" />
            <Text style={styles.metricVal}>14</Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.metricCard}
            onPress={() => router.push('/register/add-address')}
          >
            <Ionicons name="location-outline" size={22} color="#2563EB" />
            <Text style={styles.metricVal}>3</Text>
            <Text style={styles.metricLabel}>Saved Places</Text>
          </TouchableOpacity>

          <View style={styles.metricCard}>
            <Ionicons name="wallet-outline" size={22} color="#D97706" />
            <Text style={styles.metricVal}>1,250</Text>
            <Text style={styles.metricLabel}>Yaalu Points</Text>
          </View>
        </View>

        {/* Personal Info Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardHeaderTitle}>Personal Information</Text>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Phone */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Preferred Language */}
          <Text style={styles.inputLabel}>Preferred Language</Text>
          <View style={styles.languageChipsRow}>
            {(['English', 'Sinhala', 'Tamil'] as const).map((lang) => {
              const isActive = selectedLanguage === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  activeOpacity={0.8}
                  style={[styles.langChip, isActive && styles.langChipActive]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={[styles.langText, isActive && styles.langTextActive]}>
                    {lang === 'Sinhala' ? 'සිංහල' : lang === 'Tamil' ? 'தமிழ்' : 'English'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Saved Addresses Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Saved Addresses</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/register/add-address')}
            >
              <Text style={styles.addLinkText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Address Item 1 */}
          <View style={styles.addressItemRow}>
            <View style={styles.addressIconCircle}>
              <Ionicons name="home-outline" size={18} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.addressTypeTitle}>Home</Text>
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultPillText}>DEFAULT</Text>
                </View>
              </View>
              <Text style={styles.addressBody}>123, Flower Road, Colombo 07</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Address Item 2 */}
          <View style={styles.addressItemRow}>
            <View style={styles.addressIconCircle}>
              <Ionicons name="briefcase-outline" size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTypeTitle}>Work</Text>
              <Text style={styles.addressBody}>No. 45, Galle Road, Colombo 03</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Payment Methods</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/checkout/add-card')}
            >
              <Text style={styles.addLinkText}>+ Add Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressItemRow}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="card-outline" size={18} color="#061138" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTypeTitle}>Visa •••• 4242</Text>
              <Text style={styles.addressBody}>Expires 08/28</Text>
            </View>
          </View>
        </View>

        {/* Preferences & Settings */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardHeaderTitle}>App Settings</Text>

          <View style={styles.settingSwitchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtext}>Receive real-time order delivery updates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingSwitchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>SMS Order Alerts</Text>
              <Text style={styles.settingSubtext}>Get SMS notifications for driver assignment</Text>
            </View>
            <Switch
              value={smsAlertsEnabled}
              onValueChange={setSmsAlertsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingSwitchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>GPS Location Services</Text>
              <Text style={styles.settingSubtext}>Allow app to detect current store distance</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#CBD5E1', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Legal & Support Links */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardHeaderTitle}>Support & Legal</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.legalLinkRow}
            onPress={() => router.push('/legal/terms')}
          >
            <Ionicons name="document-text-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
            <Text style={styles.legalLinkText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.legalLinkRow}
            onPress={() => router.push('/legal/privacy')}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.legalLinkRow}
            onPress={() => router.push('/orders/status')}
          >
            <Ionicons name="help-circle-outline" size={20} color="#475569" style={{ marginRight: 12 }} />
            <Text style={styles.legalLinkText}>Customer Support & FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity activeOpacity={0.88} style={styles.saveBtn} onPress={handleSaveProfile}>
          <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>Save Profile Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.88} style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#061138',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  heroEmail: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 1,
  },
  heroPhone: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  addLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  languageChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  langChipActive: {
    backgroundColor: '#061138',
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  addressItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTypeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  defaultPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  defaultPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  addressBody: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  settingSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  legalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalLinkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  saveBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DC2626',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '800',
  },
});
