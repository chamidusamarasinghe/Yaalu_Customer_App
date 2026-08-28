import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        const routeName = props.state.routes[props.state.index]?.name || 'index';
        const activeTabMap: Record<string, 'HOME' | 'ACTIVITIES' | 'CART' | 'ORDERS'> = {
          index: 'HOME',
          explore: 'ACTIVITIES',
          cart: 'CART',
          orders: 'ORDERS',
        };
        return <CustomBottomTabBar activeTab={activeTabMap[routeName] || 'HOME'} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'SHOP',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'storefront' : 'storefront-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'CART',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'ORDERS',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
