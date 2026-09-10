import { Stack } from 'expo-router';

export default function RidesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="confirm-pickup" />
      <Stack.Screen name="select-vehicle" />
      <Stack.Screen name="bidding-timer" />
      <Stack.Screen name="bidding-confirm" />
      <Stack.Screen name="verify-start" />
      <Stack.Screen name="in-trip" />
      <Stack.Screen name="rate-driver" />
      <Stack.Screen name="trip-completed" />
    </Stack>
  );
}