import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YellowHeader from '../../components/YellowHeader';
import InteractiveMap from '../../components/InteractiveMap';

type AddressCategory = 'Home' | 'Work' | 'Other';

export default function AddAddressScreen() {
  const router = useRouter();

  const [category, setCategory] = useState<AddressCategory>('Home');
  const [houseNo, setHouseNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSaveAddress = () => {
    router.push('/register/step2');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />
      <YellowHeader title="Add Address" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Real Interactive Leaflet OpenStreetMap View */}
        <View style={styles.mapCardWrapper}>
          <InteractiveMap
            height={180}
            center={{ latitude: 6.8413, longitude: 79.9654 }}
            zoom={14}
            markers={[
              { id: 'addr', latitude: 6.8413, longitude: 79.9654, title: 'Pin Address Location', type: 'pickup' },
            ]}
            showRoute={false}
          />
        </View>

        {/* Address Title Pill Selector */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionLabel}>Address Title</Text>
          <View style={styles.pillsRow}>
            {(['Home', 'Work', 'Other'] as AddressCategory[]).map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.8}
                  style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, isSelected ? styles.pillTextSelected : styles.pillTextUnselected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Form Input Cards */}
        <View style={styles.formContainer}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>House / Flat / Block No. *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 42A, Green Towers"
              placeholderTextColor="#94A3B8"
              value={houseNo}
              onChangeText={setHouseNo}
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Street Name / Area *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Galle Road"
              placeholderTextColor="#94A3B8"
              value={streetName}
              onChangeText={setStreetName}
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Near Unity Plaza"
              placeholderTextColor="#94A3B8"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>
        </View>

        {/* Save Address Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.saveButton}
          onPress={handleSaveAddress}
        >
          <Ionicons name="save-outline" size={20} color="#FFFFFF" style={styles.saveIcon} />
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
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
  mapCardWrapper: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pillSelected: {
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
  },
  pillUnselected: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#059669',
    fontWeight: '700',
  },
  pillTextUnselected: {
    color: '#334155',
  },
  formContainer: {
    gap: 14,
    marginBottom: 28,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 4,
  },
  saveButton: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
