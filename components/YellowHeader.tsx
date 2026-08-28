import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface YellowHeaderProps {
  title?: string;
  onBackPress?: () => void;
  showLogo?: boolean;
}

export default function YellowHeader({ title, onBackPress, showLogo = false }: YellowHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/onboarding');
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
          </TouchableOpacity>

          {showLogo ? (
            <View style={styles.logoTitleContainer}>
              <Text style={styles.logoText}>YAALU</Text>
            </View>
          ) : title ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  safeArea: {
    backgroundColor: '#FDB813',
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A0E1A',
    letterSpacing: -0.2,
  },
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A0E1A',
    letterSpacing: 2,
  },
});
