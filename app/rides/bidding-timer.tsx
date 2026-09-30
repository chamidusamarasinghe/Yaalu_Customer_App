import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomTabBar from "../../components/CustomBottomTabBar";
import InteractiveMap from "../../components/InteractiveMap";
import { rideService, RideRequestRecord, NearbyRiderItem } from "../../services/api/ride-service";

export default function BiddingTimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideRequestId?: string;
    pickup?: string;
    dropoff?: string;
    vehicleType?: string;
    tripCategory?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropoffLat?: string;
    dropoffLng?: string;
    fare?: string;
  }>();

  const [secondsLeft, setSecondsLeft] = useState(60); // 60 seconds timeout window
  const [rideRecord, setRideRecord] = useState<RideRequestRecord | null>(null);
  const [nearbyRiders, setNearbyRiders] = useState<NearbyRiderItem[]>([]);
  const [timeoutModalVisible, setTimeoutModalVisible] = useState(false);
  const createdRideIdRef = useRef<string | null>(params.rideRequestId || null);

  const pLatNum = params.pickupLat ? parseFloat(params.pickupLat) : 6.9271;
  const pLngNum = params.pickupLng ? parseFloat(params.pickupLng) : 79.8612;
  const dLatNum = params.dropoffLat ? parseFloat(params.dropoffLat) : 6.8413;
  const dLngNum = params.dropoffLng ? parseFloat(params.dropoffLng) : 79.9654;

  // 1. Create or fetch ride request
  useEffect(() => {
    if (params.rideRequestId) {
      createdRideIdRef.current = params.rideRequestId;
      rideService.getRideDetails(params.rideRequestId).then(setRideRecord).catch(() => {});
    } else {
      rideService.createRideRequest({
        pickupAddress: params.pickup || 'Pickup Location',
        dropoffAddress: params.dropoff || 'Dropoff Location',
        pickupLat: pLatNum,
        pickupLng: pLngNum,
        dropoffLat: dLatNum,
        dropoffLng: dLngNum,
        rideType: 'BIDDING',
        selectedVehicleType: params.vehicleType || 'THREE_WHEEL',
        tripCategory: (params.tripCategory as any) || 'ONE_WAY',
      }).then((record) => {
        createdRideIdRef.current = record.id;
        setRideRecord(record);
      }).catch((e) => console.warn('[createRideRequest error]:', e));
    }
  }, [params.rideRequestId]);

  // 2. Load nearby available riders with blinking vehicle markers
  useEffect(() => {
    rideService.getNearbyRiders({
      pickupLat: pLatNum,
      pickupLng: pLngNum,
      vehicleType: params.vehicleType || 'THREE_WHEEL',
      radiusKm: 5.0,
    }).then((riders) => {
      if (Array.isArray(riders)) {
        setNearbyRiders(riders);
      }
    }).catch(() => {});
  }, [params.vehicleType, pLatNum, pLngNum]);

  // 3. Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeoutModalVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Poll backend for Rider Acceptance in real-time every 2 seconds
  useEffect(() => {
    const statusPoll = setInterval(async () => {
      const targetId = createdRideIdRef.current || rideRecord?.id;
      if (!targetId) return;

      try {
        const details = await rideService.getRideDetails(targetId);
        // STRICT CHECK: Only proceed when driver has actually ACCEPTED the ride request
        if (details && (details.status === 'ACCEPTED' || Boolean(details.acceptedDriverId))) {
          clearInterval(statusPoll);

          // Instant Notification Alert to Customer
          Alert.alert(
            '🎉 Rider Accepted!',
            `A driver has accepted your ride request! View driver details now.`,
            [
              {
                text: 'View Driver Details',
                onPress: () => navigateToConfirmedPage(details),
              },
            ],
            { cancelable: false }
          );

          setTimeout(() => {
            navigateToConfirmedPage(details);
          }, 1500);
        }
      } catch (e) {}
    }, 2000);

    return () => clearInterval(statusPoll);
  }, [rideRecord?.id]);

  const navigateToConfirmedPage = (details: any) => {
    const targetId = createdRideIdRef.current || details?.id;
    router.push({
      pathname: '/rides/bidding-confirm' as any,
      params: {
        rideRequestId: targetId,
        tripCategory: params.tripCategory || details?.tripCategory || 'ONE_WAY',
        pickup: details?.pickupAddress || params.pickup,
        dropoff: details?.dropoffAddress || params.dropoff,
        fare: details?.finalFare ? String(details.finalFare) : params.fare,
        startPin: details?.startPin || '4200',
      },
    });
  };

  const handleRetrySearch = () => {
    setTimeoutModalVisible(false);
    router.push({
      pathname: '/rides/select-vehicle' as any,
      params: {
        pickup: params.pickup,
        dropoff: params.dropoff,
        pickupLat: params.pickupLat,
        pickupLng: params.pickupLng,
        dropoffLat: params.dropoffLat,
        dropoffLng: params.dropoffLng,
      },
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Build dynamic markers with blinking 3D vehicle icons
  const mapMarkers: any[] = [
    {
      id: 'pickup_spot',
      latitude: pLatNum,
      longitude: pLngNum,
      title: params.pickup || 'Pickup Location',
      type: 'pickup',
    },
    ...nearbyRiders.map((r, i) => ({
      id: `searching_rider_${r.id}_${i}`,
      latitude: r.currentLatitude,
      longitude: r.currentLongitude,
      title: `${r.fullName} • ${r.etaText}`,
      type: 'vehicle',
      vehicleType: params.vehicleType || r.normalizedVehicleType || r.vehicleType,
      blinking: true, // Blinking vehicle icons while searching
    })),
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Searching for Riders...</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Interactive Searching Map Section */}
      <View style={styles.mapSection}>
        <InteractiveMap
          height="100%"
          center={{ latitude: pLatNum, longitude: pLngNum }}
          zoom={14}
          markers={mapMarkers}
        />
      </View>

      {/* Bottom Floating Searching Control Panel */}
      <View style={styles.bottomSearchingPanel}>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={22} color="#D97706" style={{ marginRight: 6 }} />
          <Text style={styles.timerText}>{formatTimer(secondsLeft)}</Text>
        </View>

        <Text style={styles.statusTitle}>Notifying Nearby Drivers...</Text>
        <Text style={styles.statusSubtext}>
          Blinking vehicle icons show active riders near your pickup spot. Please wait while a driver accepts your request.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Cancel Search</Text>
        </TouchableOpacity>
      </View>

      {/* TIMEOUT ERROR MODAL: No Available Riders */}
      <Modal visible={timeoutModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert-circle" size={38} color="#E11D48" />
            </View>

            <Text style={styles.errorTitle}>No Available Riders Now</Text>
            <Text style={styles.errorSubtext}>
              None of the nearby riders accepted the request in time. Please try again or select a different vehicle type.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.retryBtn}
              onPress={handleRetrySearch}
            >
              <Text style={styles.retryBtnText}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Footer Navigation Bar */}
      <CustomBottomTabBar activeTab="HOME" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FDB813",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#061138",
  },
  mapSection: {
    flex: 1,
    position: "relative",
  },
  bottomSearchingPanel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 90 : 70,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#D97706",
    letterSpacing: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
    textAlign: "center",
  },
  statusSubtext: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 14,
  },
  cancelBtn: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#475569",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFE4E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  retryBtn: {
    width: "100%",
    backgroundColor: "#061138",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});

