import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomTabBar from "../../components/CustomBottomTabBar";
import InteractiveMap from "../../components/InteractiveMap";
import { rideService } from "../../services/api/ride-service";

export default function BiddingConfirmScreen() {
  const router = useRouter();
  const { rideRequestId, tripCategory } = useLocalSearchParams<{ rideRequestId?: string; tripCategory?: string }>();
  const isReturnTrip = tripCategory === 'RETURN';

  const handleConfirmBooking = async () => {
    const rId = rideRequestId || 'RIDE-DEMO-1001';
    await rideService.acceptBid(rId, 'bid-001');
    router.push({
      pathname: "/rides/in-trip" as any,
      params: {
        rideRequestId: rId,
        fare: "1350.00",
        tripCategory: tripCategory || 'ONE_WAY',
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Preview Header */}
        <View style={styles.mapCard}>
          <InteractiveMap
            height="100%"
            center={{ latitude: 6.8413, longitude: 79.9654 }}
            zoom={12}
            markers={[
              { id: "1", latitude: 6.8413, longitude: 79.9654, title: "Your Location", type: "pickup" },
              { id: "2", latitude: 6.7106, longitude: 79.9074, title: "Moratuwa", type: "drop" },
            ]}
            showRoute={true}
          />
        </View>

        {/* Accepted Bid Green Banner (Matching Frame 5 / Image 2) */}
        <View style={styles.acceptedBanner}>
          <View style={styles.checkIconCircle}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.acceptedBannerText}>
            Lowest price bid accepted. This driver's offer is the most beneficial for you.
          </Text>
        </View>

        {/* Driver & Bid Details Card (Matching Image 2 / Frame 5) */}
        <View style={styles.driverCard}>
          <View style={styles.driverTopRow}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfoCol}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>Ravi S.</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>5.0 (124)</Text>
                </View>
              </View>
              <Text style={styles.vehicleModelText}>Toyota Prius - White</Text>
              <Text style={styles.vehicleRegText}>WP CAH-1234</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Accepted Price Box */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Accepted Fare Bid</Text>
            <Text style={styles.priceValue}>LKR 1,350.00</Text>
          </View>
          <Text style={styles.priceSubtext}>Guaranteed fixed price for this trip</Text>
        </View>

        {/* Route Details Box */}
        <View style={styles.routeBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#64748B' }}>TRIP DETAILS</Text>
            <View style={{ backgroundColor: isReturnTrip ? '#FEF3C7' : '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: isReturnTrip ? '#FDE68A' : '#BFDBFE' }}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: isReturnTrip ? '#D97706' : '#2563EB' }}>
                {isReturnTrip ? '🔄 Return Trip' : '➔ One Way'}
              </Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <Ionicons name="ellipse" size={12} color="#2563EB" style={{ marginRight: 10 }} />
            <Text style={styles.routeText}>Pickup: Homagama (Your Location)</Text>
          </View>
          <View style={styles.routeConnectorLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location-sharp" size={14} color="#D97706" style={{ marginRight: 10 }} />
            <Text style={styles.routeText}>Drop-off: Moratuwa</Text>
          </View>
        </View>

        {/* Gold Confirm Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
        >
          <Ionicons name="checkmark-circle" size={22} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.confirmBtnText}>Confirm Ravi's Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Yellow Bottom Footer Navigation Bar */}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  mapCard: {
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  acceptedBanner: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  acceptedBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#15803D",
    lineHeight: 18,
  },
  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  driverTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  driverInfoCol: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B45309",
    marginLeft: 4,
  },
  vehicleModelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  vehicleRegText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#061138",
  },
  priceSubtext: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  routeBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  routeConnectorLine: {
    width: 1,
    height: 12,
    backgroundColor: "#CBD5E1",
    marginLeft: 5,
    marginVertical: 3,
  },
  confirmBtn: {
    backgroundColor: "#FDB813",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FDB813",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: {
    color: "#061138",
    fontSize: 16,
    fontWeight: "900",
  },
});
