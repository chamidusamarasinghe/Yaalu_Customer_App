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
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YellowHeader from '../../components/YellowHeader';
import { authService } from '../../services/api/auth-service';

const CITIES_LIST = [
  { name: 'Colombo 01 (Fort)', district: 'Colombo' },
  { name: 'Colombo 03 (Colpetty)', district: 'Colombo' },
  { name: 'Colombo 04 (Bambalapitiya)', district: 'Colombo' },
  { name: 'Colombo 05 (Havelock Town)', district: 'Colombo' },
  { name: 'Colombo 07 (Cinnamon Gardens)', district: 'Colombo' },
  { name: 'Dehiwala', district: 'Colombo' },
  { name: 'Mount Lavinia', district: 'Colombo' },
  { name: 'Nugegoda', district: 'Colombo' },
  { name: 'Maharagama', district: 'Colombo' },
  { name: 'Kottawa', district: 'Colombo' },
  { name: 'Kaduwela', district: 'Colombo' },
  { name: 'Battaramulla', district: 'Colombo' },
  { name: 'Gampaha', district: 'Gampaha' },
  { name: 'Negombo', district: 'Gampaha' },
  { name: 'Kadawatha', district: 'Gampaha' },
  { name: 'Kiribathgoda', district: 'Gampaha' },
  { name: 'Ja-Ela', district: 'Gampaha' },
  { name: 'Wattala', district: 'Gampaha' },
  { name: 'Veyangoda', district: 'Gampaha' },
  { name: 'Kandana', district: 'Gampaha' },
];

export default function RegistrationStep2Screen() {
  const router = useRouter();

  const currentUser = authService.getUser();
  const [email, setEmail] = useState(currentUser.email || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [latitude] = useState<number>(currentUser.latitude || 6.9271);
  const [longitude] = useState<number>(currentUser.longitude || 79.8612);

  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = CITIES_LIST.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinueToVerification = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid Email Address.');
      return;
    }
    if (!city) {
      Alert.alert('Validation Error ⚠️', 'Please select your City.');
      return;
    }

    // Save Step 2 state (Contact & Address)
    authService.setCurrentUser({
      ...authService.getUser(),
      email: email.trim(),
      city: city,
      address: address.trim() || `${city}, Sri Lanka`,
      latitude: latitude,
      longitude: longitude,
    });

    // Step 2 -> Step 3 (Verification Page)
    router.push('/register/verify');
  };

  const handleBackToStep1 = () => {
    router.push('/register/step1');
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
        {/* Progress Bar Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.stepText}>Step 2 of 3</Text>
            <Text style={styles.stepTitle}>Contact & Address Location</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Contact & Location Details Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={26} color="#0B2384" style={styles.headerIcon} />
            <Text style={styles.cardTitle}>Contact & Delivery Address</Text>
          </View>

          {/* Email Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="example@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* City Selection Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>City (Colombo & Gampaha Districts) *</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.dropdownInputContainer, city && styles.dropdownSelectedBorder]}
              onPress={() => setIsCityModalVisible(true)}
            >
              <View style={styles.dropdownLeftRow}>
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={city ? '#061138' : '#64748B'}
                  style={styles.inputLeftIcon}
                />
                <Text style={city ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {city || 'Select your City...'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Street Address / Landmark Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Street Address & Landmark</Text>
            <View style={styles.inputWithIconContainer}>
              <Ionicons name="home-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="House No, Street Name, Apartment"
                placeholderTextColor="#94A3B8"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          {/* Map Location Card Badge */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Delivery Pin Location</Text>
            {Platform.OS === 'web' ? (
              <iframe
                title="OpenStreetMap Pin"
                width="100%"
                height="160"
                style={{ border: 0, borderRadius: 14 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
              />
            ) : (
              <View style={styles.nativeLocationBadge}>
                <Ionicons name="map" size={32} color="#0B2384" />
                <Text style={styles.nativeLocationTitle}>{city || 'Selected Location'}</Text>
                <Text style={styles.nativeLocationCoords}>Lat: {latitude.toFixed(4)} | Long: {longitude.toFixed(4)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.continueButton}
          onPress={handleContinueToVerification}
        >
          <Text style={styles.continueButtonText}>Continue to Verification Page</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButtonOutline}
          onPress={handleBackToStep1}
        >
          <Text style={styles.backButtonOutlineText}>Back to Step 1</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for City Selector */}
      <Modal
        visible={isCityModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your City</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsCityModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={20} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search city in Colombo or Gampaha..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item.name}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = city === item.name;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.cityListItem, isSelected && styles.cityListItemSelected]}
                    onPress={() => {
                      setCity(item.name);
                      setIsCityModalVisible(false);
                      setSearchQuery('');
                    }}
                  >
                    <View style={styles.cityTextRow}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={isSelected ? '#061138' : '#64748B'}
                        style={{ marginRight: 10 }}
                      />
                      <View>
                        <Text style={[styles.cityNameText, isSelected && styles.cityNameTextSelected]}>
                          {item.name}
                        </Text>
                        <Text style={styles.districtBadgeText}>{item.district} District</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={22} color="#061138" />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
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
    width: '66%',
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
  dropdownSelectedBorder: {
    borderColor: '#061138',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  dropdownLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownTextPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  dropdownTextSelected: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
  },
  nativeLocationBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  nativeLocationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  nativeLocationCoords: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    borderColor: '#061138',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonOutlineText: {
    color: '#061138',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  cityListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cityListItemSelected: {
    backgroundColor: '#FEF3C7',
  },
  cityTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  cityNameTextSelected: {
    color: '#061138',
    fontWeight: '800',
  },
  districtBadgeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
