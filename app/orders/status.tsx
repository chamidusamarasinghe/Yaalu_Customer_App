import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function OrderStatusScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.helpBtn}>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Green Success Alert Banner */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertTitle}>Your order has been placed!</Text>
          <Text style={styles.alertSubtitle}>Order ID: #YA12345678</Text>
        </View>

        {/* Stepper Card */}
        <View style={styles.stepperCard}>
          {/* Step 1: Order Placed */}
          <View style={styles.stepRow}>
            <View style={styles.stepLeftCol}>
              <View style={styles.greenCheckCircle}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>

              <View style={styles.lineGreen} />
            </View>
            <View style={styles.stepRightCol}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Order Placed</Text>
                <Text style={styles.stepTime}>10:30 AM</Text>
              </View>
              <Text style={styles.stepSubtext}>Your order has been placed successfully.</Text>
            </View>
          </View>

          {/* Step 2: Shop Confirmed */}
          <View style={styles.stepRow}>
            <View style={styles.stepLeftCol}>
              <View style={styles.greenCheckCircle}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>

              <View style={styles.lineGreen} />
            </View>
            <View style={styles.stepRightCol}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Shop Confirmed</Text>
                <Text style={styles.stepTime}>10:32 AM</Text>
              </View>
              <Text style={styles.stepSubtext}>The shop has confirmed your order.</Text>
            </View>
          </View>

          {/* Step 3: Packed */}
          <View style={styles.stepRow}>
            <View style={styles.stepLeftCol}>
              <View style={styles.greenCheckCircle}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>

              <View style={styles.lineGreen} />
            </View>
            <View style={styles.stepRightCol}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Packed</Text>
                <Text style={styles.stepTime}>10:45 AM</Text>
              </View>
              <Text style={styles.stepSubtext}>Your order is packed and ready.</Text>
            </View>
          </View>

          {/* Step 4: Driver Assigned (ACTIVE HIGHLIGHTED BOX) */}
          <View style={styles.activeStepCardWrapper}>
            <View style={styles.stepRowNoMargin}>
              <View style={styles.stepLeftCol}>
                <View style={styles.activeBrownCircle}>
                  <View style={styles.activeInnerDot} />
                </View>

                <View style={styles.lineYellow} />
              </View>
              <View style={styles.stepRightCol}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.activeStepTitle}>Driver Assigned</Text>
                  <Text style={styles.activeStepTime}>10:48 AM</Text>
                </View>
                <Text style={styles.activeStepSubtext}>
                  A driver has been assigned to your order.
                </Text>
              </View>
            </View>
          </View>

          {/* Step 5: Out for Delivery */}
          <View style={styles.stepRow}>
            <View style={styles.stepLeftCol}>
              <View style={styles.greyIconCircle}>
                <Ionicons name="bag-handle-outline" size={16} color="#94A3B8" />
              </View>

              <View style={styles.lineGrey} />
            </View>
            <View style={styles.stepRightCol}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.inactiveStepTitle}>Out for Delivery</Text>
                <Text style={styles.inactiveStepTime}>Est. 11:00 AM</Text>
              </View>
              <Text style={styles.inactiveStepSubtext}>Your order is on the way.</Text>
            </View>
          </View>

          {/* Step 6: Delivered */}
          <View style={[styles.stepRow, { marginBottom: 0 }]}>
            <View style={styles.stepLeftCol}>
              <View style={styles.greyIconCircle}>
                <Ionicons name="home-outline" size={16} color="#94A3B8" />
              </View>
            </View>
            <View style={styles.stepRightCol}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.inactiveStepTitle}>Delivered</Text>
                <Text style={styles.inactiveStepTime}>Est. 11:20 AM</Text>
              </View>
              <Text style={styles.inactiveStepSubtext}>Your order will be delivered soon.</Text>
            </View>
          </View>
        </View>

        {/* Driver Profile Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.driverCard}
          onPress={() => router.push('/orders/track')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }}
            style={styles.driverAvatar}
          />
          <View style={styles.driverInfoCol}>
            <View style={styles.driverNameRow}>
              <Text style={styles.driverName}>Dinesh Perera</Text>

              <Text style={styles.driverRating}>★ 4.8</Text>
            </View>
            <Text style={styles.driverDetailText}>Vehicle: BAJ-1234</Text>
            <Text style={styles.driverDetailText}>Phone: 077 123 4567</Text>
          </View>

          <View style={styles.driverActionsRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.driverActionBtn}>
              <Ionicons name="call-outline" size={20} color="#0A0E1A" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.driverActionBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0A0E1A" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <CustomBottomTabBar activeTab="ORDERS" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  helpBtn: {
    padding: 4,
  },
  helpText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  alertBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepRowNoMargin: {
    flexDirection: 'row',
  },
  stepLeftCol: {
    alignItems: 'center',
    marginRight: 14,
    width: 24,
  },
  greenCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  lineGreen: {
    width: 2,
    flex: 1,
    backgroundColor: '#059669',
    marginTop: 4,
    marginBottom: -16,
  },
  lineYellow: {
    width: 2,
    flex: 1,
    backgroundColor: '#FDB813',
    marginTop: 4,
    marginBottom: -16,
  },
  lineGrey: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
    marginBottom: -16,
  },
  stepRightCol: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  stepSubtext: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  activeStepCardWrapper: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FDB813',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginVertical: 4,
    marginBottom: 20,
  },
  activeBrownCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#854D0E',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  activeStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#854D0E',
  },
  activeStepTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#854D0E',
  },
  activeStepSubtext: {
    fontSize: 13,
    color: '#713F12',
    lineHeight: 18,
  },
  greyIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  inactiveStepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
  },
  inactiveStepTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
  inactiveStepSubtext: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  driverInfoCol: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  driverRating: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  driverDetailText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 1,
  },
  driverActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  driverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});
