import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface CurvedHeaderProps {
  onBackPress?: () => void;
  children?: React.ReactNode;
  height?: number;
}

export default function CurvedHeader({ onBackPress, children, height = 180 }: CurvedHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/auth/login');
      }
    }
  };

  return (
    <View style={[styles.headerWrapper, { height }]}>
      {/* Yellow Curved Background Arch */}
      <View style={styles.yellowArch} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={28} color="#0A0E1A" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Central Badge Cutout Circle */}
      {children && <View style={styles.badgeContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: width,
    position: 'relative',
    alignItems: 'center',
  },
  yellowArch: {
    position: 'absolute',
    top: 0,
    left: -width * 0.15,
    right: -width * 0.15,
    height: '100%',
    backgroundColor: '#FDB813',
    borderBottomLeftRadius: width * 0.6,
    borderBottomRightRadius: width * 0.6,
  },
  safeArea: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
  },
  headerContent: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -36,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
});
