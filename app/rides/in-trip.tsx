import React, { useState } from "react";
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

export default function InTripScreen() {
  const router = useRouter();
  const { rideRequestId, fare, tripCategory } = useLocalSearchParams<{ rideRequestId?: string; fare?: string; tripCategory?: string }>();

  const handleFinishTrip = async () => {
    const rId = rideRequestId || 'RIDE-DEMO-1001';
    await rideService.completeRide(rId);
    router.push({
      pathname: "/rides/trip-completed" as any,
      params: {
        rideRequestId: rId,
        fare: fare || "1,350.00",
        tripCategory: tripCategory || 'ONE_WAY',
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Yellow Header Bar (Matching user requirement for Header) */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Trip in Progress</Text>
          <Text style={styles.headerSubtext}>15 min to destination</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Upper Route Map Container with Floating Tooltip (Matching Image 1 / Frame 6) */}
        <View style={styles.mapContainer}>
          <InteractiveMap
            height="100%"
            center={{ latitude: 6.8413, longitude: 79.9654 }}
            zoom={13}
            markers={[
              { id: "1", latitude: 6.8413, longitude: 79.9654, title: "Pickup", type: "pickup" },
              { id: "2", latitude: 6.7106, longitude: 79.9074, title: "Moratuwa", type: "drop" },
            ]}
            showRoute={true}
          />
          {/* Floating Map Pin Tooltip */}
          <View style={styles.mapFloatingTooltip}>
            <Ionicons name="location-sharp" size={18} color="#FDB813" style={{ marginRight: 6 }} />
            <Text style={styles.tooltipText}>15 min to destination</Text>
          </View>
        </View>

        {/* Driver Profile & Vehicle Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverTopRow}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfoCol}>
              <View style={styles.nameStatusRow}>
                <Text style={styles.driverName}>Ravi S.</Text>
                <View style={styles.onTripBadge}>
                  <Text style={styles.onTripBadgeText}>On Trip</Text>
                </View>
              </View>
              <Text style={styles.vehicleModelText}>Toyota Prius - White</Text>
              <Text style={styles.vehicleRegText}>WP CAH-1234</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.7</Text>
            </View>
          </View>
        </View>

        {/* Trip Progress & ETA Section (Frame 6) */}
        <View style={styles.progressCard}>
          <View style={styles.destinationHeaderRow}>
            <View style={styles.destPinCircle}>
              <Ionicons name="navigate-sharp" size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dropLabel}>DROP-OFF</Text>
              <Text style={styles.destName}>Moratuwa</Text>
            </View>
            <Text style={styles.etaText}>ETA: 15 min</Text>
          </View>

          {/* 40% Route Progress Bar with Car Icon */}
          <View style={styles.progressTrackWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: "40%" }]} />
            </View>
            {/* Moving Car Icon at 40% position */}
            <View style={[styles.progressCarIconBadge, { left: "38%" }]}>
              <Ionicons name="car-sport" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.progressPercentRow}>
            <Text style={styles.progressPercentText}>Trip 40% Completed</Text>
            <Text style={styles.distanceRemainingText}>5.2 km remaining</Text>
          </View>
        </View>

        {/* Quick Action Buttons Row: Share & Safety */}
        <View style={styles.actionsRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnOutline}>
            <Ionicons name="share-social-outline" size={18} color="#061138" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Share Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnOutline}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#061138" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Safety Toolkit</Text>
          </TouchableOpacity>
        </View>

        {/* Full-width Contact Driver Button */}
        <TouchableOpacity activeOpacity={0.88} style={styles.contactDriverBtn}>
          <Ionicons name="call" size={20} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.contactDriverBtnText}>Contact Driver</Text>
        </TouchableOpacity>

        {/* Contact Support Link */}
        <TouchableOpacity activeOpacity={0.7} style={styles.supportLinkTouch}>
          <Text style={styles.supportLinkText}>Contact Support</Text>
        </TouchableOpacity>

        {/* Complete Journey Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.endTripBtn}
          onPress={handleFinishTrip}
        >
          <Text style={styles.endTripBtnText}>End Trip & Pay Fare</Text>
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
    paddingBottom: 12,
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
  headerTitleCol: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#061138",
  },
  headerSubtext: {
    fontSize: 12,
    fontWeight: "800",
    color: "#061138",
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  mapContainer: {
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mapFloatingTooltip: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "#061138",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  driverTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  driverInfoCol: {
    flex: 1,
  },
  nameStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginRight: 8,
  },
  onTripBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  onTripBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
  vehicleModelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  vehicleRegText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D97706",
    marginLeft: 3,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  destinationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  destPinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dropLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#2563EB",
    letterSpacing: 0.5,
  },
  destName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  etaText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#061138",
  },
  progressTrackWrapper: {
    height: 24,
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FDB813",
    borderRadius: 4,
  },
  progressCarIconBadge: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#061138",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  progressPercentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  distanceRemainingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingVertical: 12,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#061138",
  },
  contactDriverBtn: {
    backgroundColor: "#FDB813",
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#FDB813",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  contactDriverBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#061138",
  },
  supportLinkTouch: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 14,
  },
  supportLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  endTripBtn: {
    backgroundColor: "#061138",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  endTripBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
