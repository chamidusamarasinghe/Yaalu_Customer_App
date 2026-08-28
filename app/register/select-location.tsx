import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YellowHeader from '../../components/YellowHeader';

const { width } = Dimensions.get('window');

export default function SelectLocationScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleConfirmLocation = () => {
    router.push('/register/step2');
  };

  const handleManualEntry = () => {
    router.push('/register/add-address');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />
      <YellowHeader title="Select Location" />

      {/* Map View Section */}
      <ImageBackground
        source={require('../../assets/images/map_bg.png')}
        style={styles.mapView}
        resizeMode="cover"
      >
        {/* Floating Top Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your area/street"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.targetIconBtn}>
            <Ionicons name="locate-outline" size={22} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Center Pin Indicator */}
        <View style={styles.centerPinContainer} pointerEvents="none">
          <View style={styles.pinWrapper}>
            <Ionicons name="location-sharp" size={44} color="#059669" />
          </View>
        </View>
      </ImageBackground>

      {/* Bottom Sheet Card */}
      <View style={styles.bottomSheetCard}>
        <View style={styles.addressHeaderRow}>
          <View style={styles.locationPinBadge}>
            <Ionicons name="location-sharp" size={20} color="#059669" />
          </View>
          <View style={styles.addressInfoCol}>
            <Text style={styles.currentAddressLabel}>CURRENT ADDRESS</Text>
            <Text style={styles.mainAddressText}>42, Galle Road, Bambalapitiya</Text>
            <Text style={styles.subAddressText}>Colombo 00400, Western Province</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.manualEntryBtn}
          onPress={handleManualEntry}
        >
          <Text style={styles.manualEntryBtnText}>Enter Address Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapView: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  targetIconBtn: {
    padding: 4,
  },
  centerPinContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  locationPinBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  addressInfoCol: {
    flex: 1,
  },
  currentAddressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mainAddressText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subAddressText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  manualEntryBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  manualEntryBtnText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '700',
  },
});
