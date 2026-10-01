import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface YellowHeaderProps {
  title?: string;
  onBackPress?: () => void;
  showLogo?: boolean;
  showStatusBadge?: boolean;
}

export default function YellowHeader({ title, onBackPress, showLogo = false, showStatusBadge = true }: YellowHeaderProps) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('customer_is_online').then((val) => {
      if (val !== null) {
        setIsOnline(val === 'true');
      }
    }).catch(() => {});
  }, []);

  const toggleOnlineStatus = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    await AsyncStorage.setItem('customer_is_online', String(nextState)).catch(() => {});
  };

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

          {showStatusBadge ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.statusToggleBadge, isOnline ? styles.onlineBadgeBg : styles.offlineBadgeBg]}
              onPress={toggleOnlineStatus}
            >
              <View style={[styles.statusDot, isOnline ? styles.onlineDotBg : styles.offlineDotBg]} />
              <Text style={[styles.statusBadgeText, isOnline ? styles.onlineBadgeText : styles.offlineBadgeText]}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0E1A',
    letterSpacing: -0.2,
    flex: 1,
  },
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A0E1A',
    letterSpacing: 2,
  },
  statusToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    marginLeft: 'auto',
  },
  onlineBadgeBg: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  offlineBadgeBg: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  onlineDotBg: {
    backgroundColor: '#16A34A',
  },
  offlineDotBg: {
    backgroundColor: '#64748B',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  onlineBadgeText: {
    color: '#15803D',
  },
  offlineBadgeText: {
    color: '#475569',
  },
});
