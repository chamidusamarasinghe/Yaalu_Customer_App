import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomTabBar from "../../components/CustomBottomTabBar";
import { rideService, RideRequestRecord } from "../../services/api/ride-service";

export default function BiddingTimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string; vehicleType?: string; tripCategory?: string }>();
  const [secondsLeft, setSecondsLeft] = useState(480); // 8:00
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rideRecord, setRideRecord] = useState<RideRequestRecord | null>(null);

  useEffect(() => {
    // Create initial bidding ride request in backend
    rideService.createRideRequest({
      pickupAddress: params.pickup || 'Homagama',
      dropoffAddress: params.dropoff || 'Moratuwa',
      rideType: 'BIDDING',
      selectedVehicleType: params.vehicleType || 'bike',
      tripCategory: (params.tripCategory as any) || 'ONE_WAY',
    }).then((record) => {
      setRideRecord(record);
    });
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto navigate to confirm bid after 4.5 seconds
  useEffect(() => {
    const autoNav = setTimeout(() => {
      const targetId = rideRecord?.id || 'RIDE-DEMO-1001';
      router.push({
        pathname: "/rides/bidding-confirm" as any,
        params: {
          rideRequestId: targetId,
          tripCategory: params.tripCategory || 'ONE_WAY',
        }
      });
    }, 4500);
    return () => clearTimeout(autoNav);
  }, [rideRecord, params.tripCategory]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
        <Text style={styles.headerTitle}>Driver Bidding</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Countdown Digital Timer */}
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>{formatTimer(secondsLeft)}</Text>
        </View>

        {/* Animated Searching Radar Ring */}
        <View style={styles.radarContainer}>
          <Animated.View
            style={[
              styles.radarPulseRing,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View style={styles.radarCenterCircle}>
            <Ionicons name="car-sport" size={38} color="#061138" />
          </View>
        </View>

        {/* Status Text Block */}
        <Text style={styles.statusTitle}>Searching for driver...</Text>
        <Text style={styles.statusSubtext}>
          Wait a short while to find a driver who is more favorable to you.
        </Text>

        {/* Cancel Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.demoSimulateBtn}
          onPress={() => router.push("/rides/bidding-confirm" as any)}
        >
          <Text style={styles.demoSimulateText}>? View Accepted Driver Bid (Frame 5)</Text>
        </TouchableOpacity>
      </View>

      {/* Yellow Bottom Footer Navigation Bar */}
      <CustomBottomTabBar activeTab="HOME" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FDB813",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 4 : 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  timerBadge: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 36,
  },
  timerText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#D97706",
    letterSpacing: 2,
  },
  radarContainer: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  radarPulseRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(253, 184, 19, 0.25)",
    borderWidth: 1.5,
    borderColor: "#FDB813",
  },
  radarCenterCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FDB813",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#FDB813",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "center",
  },
  statusSubtext: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  cancelBtn: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#475569",
  },
  demoSimulateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  demoSimulateText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    textDecorationLine: "underline",
  },
});
