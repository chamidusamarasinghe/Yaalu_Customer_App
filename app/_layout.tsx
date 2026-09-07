import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="modal" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
