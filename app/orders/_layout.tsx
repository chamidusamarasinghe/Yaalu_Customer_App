import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="status" />
      <Stack.Screen name="track" />
      <Stack.Screen name="details" />
      <Stack.Screen name="delivered" />
      <Stack.Screen name="rate" />
      <Stack.Screen name="receipt" />
    </Stack>
  );
}
