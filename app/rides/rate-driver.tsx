import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomTabBar from "../../components/CustomBottomTabBar";
import { rideService } from "../../services/api/ride-service";

interface Compliment {
  id: string;
  label: string;
  icon: string;
}

const COMPLIMENTS: Compliment[] = [
  { id: "clean", label: "Clean Car", icon: "sparkles" },
  { id: "route", label: "Great Route", icon: "map" },
  { id: "polite", label: "Polite & Kind", icon: "happy" },
  { id: "safe", label: "Safe Driving", icon: "shield-checkmark" },
];

export default function RateDriverScreen() {
  const router = useRouter();
  const { rideRequestId, rating: initialRating, comments, tripCategory } = useLocalSearchParams<{ rideRequestId?: string; rating?: string; comments?: string; tripCategory?: string }>();
  const isReturnTrip = tripCategory === 'RETURN';
  const [rating, setRating] = useState<number>(initialRating ? parseInt(initialRating, 10) : 5);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>(["clean", "safe"]);

  const toggleCompliment = (id: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDone = async () => {
    if (!rideRequestId) {
      Alert.alert("Feedback Submitted", "Thank you for rating your experience with YAALU!", [
        { text: "OK", onPress: () => router.push("/(tabs)") },
      ]);
      return;
    }
    await rideService.submitFeedback({
      rideRequestId,
      rating,
      compliments: selectedCompliments,
      comment: comments,
    });

    Alert.alert("Feedback Submitted", "Thank you for rating your experience with YAALU!", [
      { text: "OK", onPress: () => router.push("/(tabs)") },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Top Yellow Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#061138" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate & Feedback</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.skipBtn}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver Profile Card Hero */}
        <View style={styles.driverHero}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
              }}
              style={styles.avatarImage}
            />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 3 }} />
              <Text style={styles.ratingBadgeText}>4.7</Text>
            </View>
          </View>

          <Text style={styles.driverName}>Ravi S.</Text>
          <Text style={styles.vehicleSubtitle}>Toyota Prius - White (WP CAH-1234)</Text>
        </View>

        {/* Rate Driver Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your driver</Text>
          <Text style={styles.ratingSubtext}>
            What do you think about your driver's service?
          </Text>

          {/* 5 Interactive Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <TouchableOpacity
                key={starIdx}
                activeOpacity={0.7}
                onPress={() => setRating(starIdx)}
                style={{ padding: 6 }}
              >
                <Ionicons
                  name={starIdx <= rating ? "star" : "star-outline"}
                  size={36}
                  color={starIdx <= rating ? "#F59E0B" : "#CBD5E1"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Give a Compliment Section */}
        <View style={styles.complimentSection}>
          <Text style={styles.complimentTitle}>Give a compliment</Text>

          <View style={styles.complimentsWrapRow}>
            {COMPLIMENTS.map((item) => {
              const isSelected = selectedCompliments.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[styles.complimentChip, isSelected && styles.complimentChipSelected]}
                  onPress={() => toggleCompliment(item.id)}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={isSelected ? "#FFFFFF" : "#475569"}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.complimentText, isSelected && styles.complimentTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fare & Download Receipt Section */}
        <View style={styles.fareCard}>
          <Text style={styles.fareCardTitle}>Trip Fare Summary</Text>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Trip Type</Text>
            <Text style={{ fontSize: 13, fontWeight: "900", color: isReturnTrip ? "#D97706" : "#2563EB" }}>
              {isReturnTrip ? "Return Trip 🔄" : "One Way ➔"}
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Final Accepted Bidding Fare</Text>
            <Text style={styles.fareAmount}>LKR 1,350.00</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.downloadReceiptBtn}
            onPress={() => Alert.alert("Receipt Downloaded", "Trip receipt saved to your device as PDF.")}
          >
            <Ionicons name="download-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.downloadReceiptText}>Download Receipt PDF</Text>
          </TouchableOpacity>

          {/* Submit Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.doneBtn, rating > 0 && styles.doneBtnActive]}
            onPress={handleDone}
          >
            <Text style={[styles.doneBtnText, rating > 0 && styles.doneBtnTextActive]}>
              Submit Rating & Return Home
            </Text>
          </TouchableOpacity>
        </View>
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
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#061138",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  driverHero: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ratingBadge: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  driverName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 4,
  },
  vehicleSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
  },
  ratingSubtext: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
  },
  complimentSection: {
    marginBottom: 24,
  },
  complimentTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    textAlign: "center",
  },
  complimentsWrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  complimentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  complimentChipSelected: {
    backgroundColor: "#061138",
    borderColor: "#061138",
  },
  complimentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  complimentTextSelected: {
    color: "#FFFFFF",
  },
  fareCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  fareCardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  fareLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  downloadReceiptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  downloadReceiptText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },
  doneBtn: {
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnActive: {
    backgroundColor: "#FDB813",
    shadowColor: "#FDB813",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#94A3B8",
  },
  doneBtnTextActive: {
    color: "#061138",
  },
});
