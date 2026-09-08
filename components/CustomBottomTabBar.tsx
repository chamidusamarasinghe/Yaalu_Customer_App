import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export type TabKey = 'HOME' | 'SHOP' | 'ACTIVITIES' | 'CART' | 'ORDERS';

interface CustomBottomTabBarProps {
  activeTab?: TabKey;
}

export default function CustomBottomTabBar({ activeTab = 'HOME' }: CustomBottomTabBarProps) {
  const router = useRouter();

  const isHomeActive = activeTab === 'HOME';
  const isShopActive = activeTab === 'SHOP';
  const isActivitiesActive = activeTab === 'ACTIVITIES';
  const isCartActive = activeTab === 'CART';

  const footerTabs = [
    {
      key: 'HOME',
      label: 'Home',
      icon: 'home',
      iconOutline: 'home-outline',
      route: '/(tabs)',
      isActive: isHomeActive,
    },
    {
      key: 'SHOP',
      label: 'Shop',
      icon: 'storefront',
      iconOutline: 'storefront-outline',
      route: '/(tabs)/explore',
      isActive: isShopActive,
    },
    {
      key: 'ACTIVITIES',
      label: 'Activities',
      icon: 'time',
      iconOutline: 'time-outline',
      route: '/(tabs)/orders',
      isActive: isActivitiesActive,
    },
    {
      key: 'CART',
      label: 'Cart',
      icon: 'cart',
      iconOutline: 'cart-outline',
      route: '/(tabs)/cart',
      isActive: isCartActive,
    },
  ];

  return (
    <View style={styles.tabContainer}>
      {footerTabs.map((tab) => {
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            style={styles.tabItem}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={(tab.isActive ? tab.icon : tab.iconOutline) as keyof typeof Ionicons.glyphMap}
              size={24}
              color={tab.isActive ? '#061138' : '#7A6800'}
            />
            <Text style={[styles.tabLabel, tab.isActive ? styles.tabLabelActive : styles.tabLabelInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FDB813',
    height: Platform.OS === 'ios' ? 88 : 65,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 6,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#061138',
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: '#7A6800',
  },
});
