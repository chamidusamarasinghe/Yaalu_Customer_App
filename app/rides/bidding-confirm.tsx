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
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomTabBar from "../../components/CustomBottomTabBar";
import InteractiveMap from "../../components/InteractiveMap";
import { rideService } from "../../services/api/ride-service";

export default function BiddingConfirmScreen() {
  const router = useRouter();
  const {
    rideRequestId,
    tripCategory,
    pickup,
    dropoff,
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
    fare,
    startPin,
    vehicleType,
  } = useLocalSearchParams<{
    rideRequestId?: string;
    tripCategory?: string;
    pickup?: string;
    dropoff?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropoffLat?: string;
    dropoffLng?: string;
    fare?: string;
    startPin?: string;
    vehicleType?: string;
  }>();

  const isReturnTrip = tripCategory === 'RETURN';

  const [rideDetails, setRideDetails] = React.useState<any>(null);
  const [selectedBid, setSelectedBid] = React.useState<any>(null);

  React.useEffect(() => {
    if (rideRequestId) {
      rideService.getRideDetails(rideRequestId).then((details) => {
        setRideDetails(details);
        if (details.bids && details.bids.length > 0) {
          const acceptedBid = details.bids.find((b: any) => b.status === 'ACCEPTED') || details.bids[0];
          setSelectedBid(acceptedBid);
        }
      }).catch((e) => console.warn('[BiddingConfirm fetch error]:', e));
    }
  }, [rideRequestId]);

  const handleConfirmBooking = async () => {
    if (!rideRequestId) return;
    try {
      const bidId = selectedBid?.id || 'bid-001';
      await rideService.acceptBid(rideRequestId, bidId);
    } catch (e) {}

    const fareValue = selectedBid?.proposedFare || rideDetails?.finalFare || fare || "710.00";
    router.push({
      pathname: "/rides/in-trip" as any,
      params: {
        rideRequestId,
        fare: String(fareValue),
        tripCategory: tripCategory || rideDetails?.tripCategory || 'ONE_WAY',
        pickup: rideDetails?.pickupAddress || pickup || 'Pickup Location',
        dropoff: rideDetails?.dropoffAddress || dropoff || 'Dropoff Location',
        pickupLat: rideDetails?.pickupLat ? String(rideDetails.pickupLat) : pickupLat,
        pickupLng: rideDetails?.pickupLng ? String(rideDetails.pickupLng) : pickupLng,
        dropoffLat: rideDetails?.dropoffLat ? String(rideDetails.dropoffLat) : dropoffLat,
        dropoffLng: rideDetails?.dropoffLng ? String(rideDetails.dropoffLng) : dropoffLng,
        startPin: rideDetails?.startPin || startPin || '4200',
      }
    });
  };

  const pLatNum = rideDetails?.pickupLat ?? (pickupLat ? parseFloat(pickupLat) : 6.9271);
  const pLngNum = rideDetails?.pickupLng ?? (pickupLng ? parseFloat(pickupLng) : 79.8612);
  const dLatNum = rideDetails?.dropoffLat ?? (dropoffLat ? parseFloat(dropoffLat) : 6.8413);
  const dLngNum = rideDetails?.dropoffLng ?? (dropoffLng ? parseFloat(dropoffLng) : 79.9654);

  const pickupText = rideDetails?.pickupAddress || pickup || 'Pickup Location';
  const dropoffText = rideDetails?.dropoffAddress || dropoff || 'Dropoff Location';
  const rawFareNum = selectedBid?.proposedFare || rideDetails?.finalFare || (fare ? parseFloat(fare) : 710.00);
  const displayFare = `LKR ${Number(rawFareNum).toFixed(2)}`;

  // Driver details extraction
  const driverName = selectedBid?.driverName || rideDetails?.acceptedDriver?.fullName || 'Kasun Perera';
  const vehicleModel = selectedBid?.vehicleModel || rideDetails?.acceptedDriver?.vehicleModel || rideDetails?.acceptedDriver?.vehicleType || 'Bajaj RE Three-Wheeler';
  const vehicleNumber = selectedBid?.vehicleNumber || rideDetails?.acceptedDriver?.vehicleNumber || 'WP CB-4829';
  const driverRating = selectedBid?.rating || rideDetails?.acceptedDriver?.rating || 4.9;
  const driverDeliveries = rideDetails?.acceptedDriver?.deliveriesCompleted || 142;
  const driverPhone = rideDetails?.acceptedDriver?.phoneNumber || '0771234567';
  const driverPhoto = selectedBid?.profilePhotoUrl || rideDetails?.acceptedDriver?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  const activePin = rideDetails?.startPin || startPin || '4200';

  const handleCallDriver = () => {
    if (driverPhone) {
      Linking.openURL(`tel:${driverPhone}`).catch(() => {});
    }
  };

  const driverLat = rideDetails?.acceptedDriver?.currentLatitude || pLatNum + 0.003;
  const driverLng = rideDetails?.acceptedDriver?.currentLongitude || pLngNum + 0.002;

  const mapMarkers: any[] = [
    { id: 'pickup_spot', latitude: pLatNum, longitude: pLngNum, title: pickupText, type: 'pickup' },
    { id: 'dropoff_spot', latitude: dLatNum, longitude: dLngNum, title: dropoffText, type: 'drop' },
    {
      id: 'driver_vehicle_spot',
      latitude: driverLat,
      longitude: driverLng,
      title: `${driverName} (${vehicleNumber})`,
      type: 'vehicle',
      vehicleType: vehicleType || 'THREE_WHEEL',
    },
  ];

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
        <Text style={styles.headerTitle}>Driver Confirmed</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Preview Header */}
        <View style={styles.mapCard}>
          <InteractiveMap
            height="100%"
            center={{ latitude: pLatNum, longitude: pLngNum }}
            zoom={13}
            markers={mapMarkers}
            showRoute={true}
          />
        </View>

        {/* Accepted Bid Green Banner */}
        <View style={styles.acceptedBanner}>
          <View style={styles.checkIconCircle}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.acceptedBannerText}>
            🎉 Driver Accepted Your Ride Request! Your driver is on the way to your pickup location.
          </Text>
        </View>

        {/* Prominent Driver & Vehicle Details Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverTopRow}>
            <Image
              source={{ uri: driverPhoto }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfoCol}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{driverName}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>{Number(driverRating).toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.vehicleModelText}>{vehicleModel}</Text>
              <View style={styles.regBadgeRow}>
                <View style={styles.licensePill}>
                  <Ionicons name="car-sport" size={12} color="#061138" style={{ marginRight: 4 }} />
                  <Text style={styles.licenseText}>{vehicleNumber}</Text>
                </View>
                <Text style={styles.deliveriesText}>• {driverDeliveries} trips</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Row: Phone & OTP PIN */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.callBtn}
              onPress={handleCallDriver}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.callBtnText}>Call Driver</Text>
            </TouchableOpacity>

            <View style={styles.otpPinContainer}>
              <Text style={styles.otpLabel}>OTP PIN</Text>
              <Text style={styles.otpValue}>{activePin}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Fare Summary Box */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Confirmed Fare</Text>
            <Text style={styles.priceValue}>{displayFare}</Text>
          </View>
          <Text style={styles.priceSubtext}>Guaranteed fixed fare for this ride</Text>
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
            <Text style={styles.routeText} numberOfLines={1}>Pickup: {pickupText}</Text>
          </View>
          <View style={styles.routeConnectorLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location-sharp" size={14} color="#D97706" style={{ marginRight: 10 }} />
            <Text style={styles.routeText} numberOfLines={1}>Drop-off: {dropoffText}</Text>
          </View>
        </View>

        {/* Gold Confirm & Start Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
        >
          <Ionicons name="checkmark-circle" size={22} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.confirmBtnText}>Confirm Hire</Text>
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
    height: 170,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#FDB813",
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
  regBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  licensePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginRight: 6,
  },
  licenseText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#061138",
  },
  deliveriesText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  otpPinContainer: {
    alignItems: "flex-end",
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE047",
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#854D0E",
    letterSpacing: 0.5,
  },
  otpValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#854D0E",
    letterSpacing: 2,
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
    flex: 1,
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
