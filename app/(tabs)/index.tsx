import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// --- Mock Data ---
const WASTE_TYPES = [
  { id: "recyclable", name: "Recyclable", icon: "arrow.3.trianglepath", color: "#3B82F6", bgColor: "#DBEAFE", count: 186 },
  { id: "organic", name: "Organic", icon: "leaf", color: "#10B981", bgColor: "#D1FAE5", count: 42 },
  { id: "hazardous", name: "Hazardous", icon: "exclamationmark.triangle", color: "#EF4444", bgColor: "#FEE2E2", count: 8 },
  { id: "electronic", name: "E-Waste", icon: "cpu", color: "#F59E0B", bgColor: "#FEF3C7", count: 11 },
];

const RECENT_ACTIVITY = [
  { id: 1, item: "Plastic Water Bottle", category: "Recyclable", time: "2m ago", icon: "arrow.3.trianglepath", color: "#3B82F6", bgColor: "#DBEAFE", points: "+10" },
  { id: 2, item: "Banana Peel", category: "Organic", time: "15m ago", icon: "leaf", color: "#10B981", bgColor: "#D1FAE5", points: "+5" },
  { id: 3, item: "Old Batteries", category: "Hazardous", time: "1h ago", icon: "exclamationmark.triangle", color: "#EF4444", bgColor: "#FEE2E2", points: "+20" },
];

export default function HomeScreen() {
  // Authentication ready state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Vibrant Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.greeting}>{isAuthenticated ? "Welcome back," : "Hello, Eco Warrior!"}</ThemedText>
              <ThemedText style={styles.userName}>{isAuthenticated ? "Alex Johnson" : "Let's save the planet"}</ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => setIsAuthenticated(!isAuthenticated)} // Toggle auth for demo
            >
              <IconSymbol size={24} name="person.fill" color="#FFF" />
            </TouchableOpacity>
          </View>

          {!isAuthenticated ? (
            /* Auth Promo Card */
            <View style={styles.authCard}>
              <View style={styles.authCardIcon}>
                <IconSymbol size={32} name="star.fill" color="#FFD700" />
              </View>
              <View style={styles.authCardContent}>
                <ThemedText style={styles.authCardTitle}>Join the Movement</ThemedText>
                <ThemedText style={styles.authCardDesc}>Sign in to track your recycling impact and earn rewards!</ThemedText>
                <TouchableOpacity style={styles.authButton} onPress={() => router.push('/login')}>
                  <ThemedText style={styles.authButtonText}>Sign In / Register</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Impact Stats Card (Authenticated) */
            <View style={styles.impactCard}>
              <View style={styles.impactHeader}>
                <ThemedText style={styles.impactTitle}>Your Eco Impact</ThemedText>
                <View style={styles.streakBadge}>
                  <IconSymbol size={16} name="flame.fill" color="#FF9800" />
                  <ThemedText style={styles.streakText}>12 Day Streak</ThemedText>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <IconSymbol size={28} name="trash.fill" color="#4ADE80" />
                  <ThemedText style={styles.statValue}>247</ThemedText>
                  <ThemedText style={styles.statLabel}>Items Sorted</ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <IconSymbol size={28} name="leaf.fill" color="#4ADE80" />
                  <ThemedText style={styles.statValue}>18.5</ThemedText>
                  <ThemedText style={styles.statLabel}>kg CO₂ Saved</ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <IconSymbol size={28} name="checkmark.circle.fill" color="#4ADE80" />
                  <ThemedText style={styles.statValue}>85%</ThemedText>
                  <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          
          {/* Vibrant AI Scan Button */}
          <TouchableOpacity style={styles.scanButton} onPress={() => router.push("/scan")}>
            <View style={styles.scanButtonContent}>
              <View style={styles.scanIconContainer}>
                <IconSymbol size={36} name="camera.fill" color="#FFF" />
              </View>
              <View style={styles.scanTextContainer}>
                <ThemedText style={styles.scanTitle}>Smart AI Scan</ThemedText>
                <ThemedText style={styles.scanSubtitle}>Identify & sort waste instantly</ThemedText>
              </View>
              <View style={styles.scanActionIcon}>
                <IconSymbol size={24} name="chevron.right.circle.fill" color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Waste Categories</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {WASTE_TYPES.map((type) => (
                <TouchableOpacity key={type.id} style={[styles.categoryCard, { backgroundColor: type.bgColor }]}>
                  <View style={styles.categoryIconWrapper}>
                    <IconSymbol size={28} name={type.icon} color={type.color} />
                  </View>
                  <ThemedText style={[styles.categoryCount, { color: type.color }]}>{type.count}</ThemedText>
                  <ThemedText style={styles.categoryName}>{type.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Recent Scans</ThemedText>
            <View style={styles.activityContainer}>
              {RECENT_ACTIVITY.map((activity, index) => (
                <View key={activity.id}>
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: activity.bgColor }]}>
                      <IconSymbol size={22} name={activity.icon} color={activity.color} />
                    </View>
                    <View style={styles.activityDetails}>
                      <ThemedText style={styles.activityTitle}>{activity.item}</ThemedText>
                      <View style={styles.activityMeta}>
                        <ThemedText style={[styles.activityCategory, { color: activity.color }]}>{activity.category}</ThemedText>
                        <ThemedText style={styles.activityDot}>•</ThemedText>
                        <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
                      </View>
                    </View>
                    <View style={styles.pointsBadge}>
                      <ThemedText style={styles.pointsText}>{activity.points}</ThemedText>
                    </View>
                  </View>
                  {index < RECENT_ACTIVITY.length - 1 && <View style={styles.activityDivider} />}
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Light grayish blue background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#0F172A", // Deep Slate for vibrant contrast
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 4,
  },
  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  authCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  authCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  authCardContent: {
    flex: 1,
  },
  authCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  authCardDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    lineHeight: 18,
  },
  authButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  authButtonText: {
    color: "#3B82F6",
    fontWeight: "bold",
    fontSize: 14,
  },
  impactCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  impactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#334155",
  },
  mainContent: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  scanButton: {
    backgroundColor: "#10B981", // Vibrant Emerald
    borderRadius: 24,
    marginBottom: 30,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  scanButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  scanIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  scanActionIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 4,
  },
  categoryIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryCount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  activityContainer: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityCategory: {
    fontSize: 13,
    fontWeight: "500",
  },
  activityDot: {
    color: "#94A3B8",
    marginHorizontal: 6,
  },
  activityTime: {
    fontSize: 13,
    color: "#64748B",
  },
  pointsBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
  },
  activityDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 64,
  },
});
