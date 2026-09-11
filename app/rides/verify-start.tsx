import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  Share,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';
import InteractiveMap, { MapMarker } from '../../components/InteractiveMap';
import { rideService } from '../../services/api/ride-service';

export default function VerifyStartCodeScreen() {
  const router = useRouter();
  const { rideRequestId, tripCategory, pickup, dropoff, fare, pickupLat, pickupLng, dropoffLat, dropoffLng, startPin } = useLocalSearchParams<{
    rideRequestId?: string;
    tripCategory?: string;
    pickup?: string;
    dropoff?: string;
    fare?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropoffLat?: string;
    dropoffLng?: string;
    startPin?: string;
  }>();

  const otpCode = (startPin || '4200').slice(0, 4);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: 'Hello! I am on my way to your pickup location.', time: '10:14 AM' },
  ]);

  const handlePinDigitChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text.slice(-1);
    setPin(newPin);
  };

  const handleCallDriver = () => {
    Linking.openURL('tel:+94771234567').catch(() => {
      Alert.alert('Call Driver', 'Calling Driver Ravi K. (+94 77 123 4567)');
    });
  };

  const handleShareStatus = async () => {
    try {
      await Share.share({
        message: `Tracking my Yaalu ride! Pickup: ${pickup || 'Pickup Location'}, Destination: ${dropoff || 'Dropoff Location'}. Ride Status: Driver Arrived.`,
      });
    } catch (e) {
      Alert.alert('Share Trip', 'Sharing link generated: https://yaalu.app/track/ride-101');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: chatInput.trim(), time: 'Now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'driver', text: 'Got it! I am waiting near your spot.', time: 'Now' }
      ]);
    }, 1200);
  };

  const handleVerifyAndStart = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      Alert.alert('Enter Complete OTP', 'Please enter all 4 digits of the OTP code received via SMS message.');
      return;
    }
    if (rideRequestId) {
      try {
        await rideService.verifyStartPin(rideRequestId, enteredPin);
      } catch (e: any) {
        Alert.alert('Verification Failed', e.message || 'Incorrect OTP code. Please check your SMS message and try again.');
        return;
      }
    } else if (enteredPin !== otpCode && enteredPin !== '4200') {
      Alert.alert('Invalid OTP', `Incorrect OTP code (${enteredPin}). Please check your SMS message and enter ${otpCode}.`);
      return;
    }
    router.push({
      pathname: '/rides/in-trip' as any,
      params: {
        rideRequestId,
        tripCategory: tripCategory || 'ONE_WAY',
        pickup,
        dropoff,
        fare,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Brand Banner */}
      <View style={styles.topBrandHeader}>
        <Text style={styles.brandText}>yaalu</Text>
      </View>

      {/* Title Subheader */}
      <View style={styles.subHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Pickup Ready</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Pickup & Driver Arrival Map View */}
        <View style={{ height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <InteractiveMap
            height="100%"
            center={{ latitude: pickupLat ? parseFloat(pickupLat) : 6.9271, longitude: pickupLng ? parseFloat(pickupLng) : 79.8612 }}
            zoom={14}
            showRoute={true}
            markers={[
              {
                id: 'pickup_pin',
                latitude: pickupLat ? parseFloat(pickupLat) : 6.9271,
                longitude: pickupLng ? parseFloat(pickupLng) : 79.8612,
                title: pickup || 'Pickup Spot',
                type: 'pickup',
              },
              {
                id: 'driver_pin',
                latitude: (pickupLat ? parseFloat(pickupLat) : 6.9271) + 0.001,
                longitude: (pickupLng ? parseFloat(pickupLng) : 79.8612) + 0.001,
                title: 'Ravi K. (Driver)',
                type: 'driver',
              },
              {
                id: 'drop_pin',
                latitude: dropoffLat ? parseFloat(dropoffLat) : 6.8413,
                longitude: dropoffLng ? parseFloat(dropoffLng) : 79.9654,
                title: dropoff || 'Destination',
                type: 'drop',
              },
            ]}
          />
        </View>

        {/* Incoming SMS Notification Toast */}
        <View style={styles.smsNotificationBanner}>
          <Ionicons name="chatbox-ellipses" size={22} color="#D97706" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.smsBannerTitle}>📩 SMS MESSAGE RECEIVED</Text>
            <Text style={styles.smsBannerText}>
              "Your Yaalu Ride OTP is <Text style={{ fontWeight: '900', color: '#D97706' }}>{otpCode}</Text>. Share with driver to start ride."
            </Text>
          </View>
        </View>

        {/* Driver Arrival Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeMainTitle}>Driver is Here!</Text>
          <Text style={styles.noticeSubText}>
            Please find Ravi K. and his white Toyota Axio (WP-AB-1234).
          </Text>
        </View>

        {/* Verification Code Box */}
        <View style={styles.verifyCard}>
          <Text style={styles.verifyCardTitle}>ENTER START OTP CODE</Text>

          {/* 4 Digit Interactive PIN Inputs */}
          <View style={styles.pinInputsRow}>
            {pin.map((digit, idx) => (
              <TextInput
                key={idx}
                style={styles.pinBoxInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                placeholder="•"
                placeholderTextColor="#CBD5E1"
                onChangeText={(text) => handlePinDigitChange(text, idx)}
              />
            ))}
          </View>

          <Text style={styles.pinSubtext}>Enter the 4-digit OTP code received in your SMS above.</Text>

          {/* Price Banner Strip inside box */}
          <View style={styles.ridePriceStrip}>
            <Text style={styles.ridePriceText}>
              Ride Price: LKR {fare ? Number(fare).toFixed(2) : '710.07'}
            </Text>
          </View>
        </View>

        {/* Driver Communication Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol} onPress={handleCallDriver}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="call" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol} onPress={() => setChatModalVisible(true)}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Chat with Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.actionCol} onPress={handleShareStatus}>
            <View style={styles.actionCircleBtn}>
              <Ionicons name="share-social" size={22} color="#0F172A" />
            </View>
            <Text style={styles.actionBtnLabel}>Share Status</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.verifyStartBtn}
          onPress={handleVerifyAndStart}
        >
          <Text style={styles.verifyStartBtnText}>VERIFY & START RIDE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DRIVER CHAT MODAL */}
      <Modal visible={chatModalVisible} transparent animationType="slide">
        <View style={styles.chatModalOverlay}>
          <View style={styles.chatModalContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Chat with Driver Ravi K.</Text>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.chatBody}>
              {chatMessages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.chatBubble,
                    msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleDriver,
                  ]}
                >
                  <Text style={[styles.chatText, msg.sender === 'user' && { color: '#061138' }]}>{msg.text}</Text>
                  <Text style={styles.chatTime}>{msg.time}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Type a message..."
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
                <Ionicons name="send" size={18} color="#061138" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Yellow Bottom Footer Navigation Bar */}
      <CustomBottomTabBar activeTab="HOME" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBrandHeader: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#061138',
    letterSpacing: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  mapSnippetContainer: {
    height: 120,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapSnippetInner: {
    flex: 1,
    backgroundColor: '#CBD5E1',
    justifyContent: 'flex-end',
    padding: 10,
  },
  googleBrandBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  googleBrandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  noticeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  noticeSubText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  verifyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0F172A',
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 14,
  },
  pinInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pinBoxInput: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
  },
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModalContainer: {
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  chatBody: {
    flex: 1,
    paddingVertical: 12,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  chatBubbleDriver: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  chatBubbleUser: {
    backgroundColor: '#FDB813',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  chatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  chatTime: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chatSendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FDB813',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  pinSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  ridePriceStrip: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    alignItems: 'center',
  },
  ridePriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionCol: {
    alignItems: 'center',
  },
  actionCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  verifyStartBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  verifyStartBtnText: {
    color: '#FDB813',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  stepperTrackLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 10,
    height: 3,
    backgroundColor: '#10B981',
  },
  stepperStepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircleCompleted: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerActiveDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
  },
  stepCirclePending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  stepLabelActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  smsNotificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  smsBannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  smsBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350F',
    lineHeight: 18,
  },
});
