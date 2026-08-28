import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

type LanguageCode = 'en' | 'si' | 'ta';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');

  const handleContinue = () => {
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Hero Background Image */}
      <ImageBackground
        source={require('../assets/images/delivery_bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark Overlay */}
        <View style={styles.overlay}>
          {/* Top / Center Branding Area */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircleWrapper}>
              <Image
                source={require('../assets/images/yaalu_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeText}>Welcome to</Text>

            <View style={styles.brandTitleBox}>
              <Text style={styles.brandTitleText}>YAALU</Text>
            </View>

            <Text style={styles.taglineText}>- Deliver with Trust -</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Bottom Language Picker Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Select your language</Text>
        <Text style={styles.cardSubtitle}>Choose your preferred language to continue</Text>

        <View style={styles.optionsContainer}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;

            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text style={styles.optionText}>{lang.label}</Text>

                {isSelected ? (
                  <View style={styles.checkCircleSelected}>
                    <Ionicons name="checkmark" size={16} color="#000000" />
                  </View>
                ) : (
                  <View style={styles.radioCircleUnselected} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFC400" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 16,
  },
  brandContainer: {
    alignItems: 'center',
  },
  logoCircleWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FDB813',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  brandTitleBox: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginVertical: 2,
  },
  brandTitleText: {
    color: '#FFC400',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  taglineText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomCard: {
    backgroundColor: '#EEF3FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#071033',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#556080',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0A153A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#FFFFFF',
    shadowOpacity: 0.08,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1332',
  },
  checkCircleSelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDB813',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D9E1EC',
    borderWidth: 0,
  },
  continueButton: {
    backgroundColor: '#061138',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFC400',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  arrowIcon: {
    marginTop: 1,
  },
});
