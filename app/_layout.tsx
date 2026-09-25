import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LogBox } from 'react-native';

import { useEffect } from 'react';
import { Platform } from 'react-native';

// Ignore the Chrome extension error overlay for 'M_ID'
LogBox.ignoreLogs([
  /Cannot read properties of undefined \(reading 'M_ID'\)/,
  "Cannot read properties of undefined (reading 'M_ID')"
]);

// Top-level error suppression for Chrome Extensions crashing Expo Web
// Only run on web platform where window APIs are fully available
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (message?.toString().includes('M_ID') || source?.toString().includes('chrome-extension')) {
      return true; // Suppress
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('unhandledrejection', function (event: any) {
      if (event.reason?.toString().includes('M_ID')) {
        event.preventDefault();
      }
    });
  }
}

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
