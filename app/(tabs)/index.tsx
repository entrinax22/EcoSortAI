import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// --- Mock Data ---
const WASTE_TYPES = [
  {
    id: "recyclable",
    name: "Recyclable",
    icon: "arrow.3.trianglepath",
    color: "#3B82F6",
    bgColor: "#DBEAFE",
    count: 186,
  },
  {
    id: "organic",
    name: "Organic",
    icon: "leaf",
    color: "#10B981",
    bgColor: "#D1FAE5",
    count: 42,
  },
  {
    id: "hazardous",
    name: "Hazardous",
    icon: "exclamationmark.triangle",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    count: 8,
  },
  {
    id: "electronic",
    name: "E-Waste",
    icon: "cpu",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    count: 11,
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    item: "Plastic Water Bottle",
    category: "Recyclable",
    time: "2m ago",
    icon: "arrow.3.trianglepath",
    color: "#3B82F6",
    bgColor: "#DBEAFE",
    points: "+10",
  },
  {
    id: 2,
    item: "Banana Peel",
    category: "Organic",
    time: "15m ago",
    icon: "leaf",
    color: "#10B981",
    bgColor: "#D1FAE5",
    points: "+5",
  },
  {
    id: 3,
    item: "Old Batteries",
    category: "Hazardous",
    time: "1h ago",
    icon: "exclamationmark.triangle",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    points: "+20",
  },
];

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#10B981" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vibrant Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
              <ThemedText style={styles.userName}>
                {user?.full_name || user?.first_name || user?.username || "Eco Warrior"}
              </ThemedText>
              {!!user?.role_label && (
                <View style={styles.roleBadge}>
                  <ThemedText style={styles.roleText}>{user.role_label}</ThemedText>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/profile")}
            >
              <ThemedText style={styles.profileInitial}>
                {(user?.full_name || user?.username || "?")[0].toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Impact Stats Card */}
          <View style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <ThemedText style={styles.impactTitle}>
                Your Eco Impact
              </ThemedText>
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
                <IconSymbol
                  size={28}
                  name="checkmark.circle.fill"
                  color="#4ADE80"
                />
                <ThemedText style={styles.statValue}>85%</ThemedText>
                <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Vibrant AI Scan Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
          >
            <View style={styles.scanButtonContent}>
              <View style={styles.scanIconContainer}>
                <IconSymbol size={36} name="camera.fill" color="#FFF" />
              </View>
              <View style={styles.scanTextContainer}>
                <ThemedText style={styles.scanTitle}>Smart AI Scan</ThemedText>
                <ThemedText style={styles.scanSubtitle}>
                  Identify & sort waste instantly
                </ThemedText>
              </View>
              <View style={styles.scanActionIcon}>
                <IconSymbol
                  size={24}
                  name="chevron.right.circle.fill"
                  color="#FFF"
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Waste Categories
              </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllText}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {WASTE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: type.bgColor },
                  ]}
                >
                  <View style={styles.categoryIconWrapper}>
                    <IconSymbol size={28} name={type.icon} color={type.color} />
                  </View>
                  <ThemedText
                    style={[styles.categoryCount, { color: type.color }]}
                  >
                    {type.count}
                  </ThemedText>
                  <ThemedText style={styles.categoryName}>
                    {type.name}
                  </ThemedText>
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
                    <View
                      style={[
                        styles.activityIcon,
                        { backgroundColor: activity.bgColor },
                      ]}
                    >
                      <IconSymbol
                        size={22}
                        name={activity.icon}
                        color={activity.color}
                      />
                    </View>
                    <View style={styles.activityDetails}>
                      <ThemedText style={styles.activityTitle}>
                        {activity.item}
                      </ThemedText>
                      <View style={styles.activityMeta}>
                        <ThemedText
                          style={[
                            styles.activityCategory,
                            { color: activity.color },
                          ]}
                        >
                          {activity.category}
                        </ThemedText>
                        <ThemedText style={styles.activityDot}>•</ThemedText>
                        <ThemedText style={styles.activityTime}>
                          {activity.time}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.pointsBadge}>
                      <ThemedText style={styles.pointsText}>
                        {activity.points}
                      </ThemedText>
                    </View>
                  </View>
                  {index < RECENT_ACTIVITY.length - 1 && (
                    <View style={styles.activityDivider} />
                  )}
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
    backgroundColor: "#F8FAFC",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  roleBadge: {
    marginTop: 6,
    backgroundColor: "rgba(52, 211, 153, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  roleText: {
    color: "#4ADE80",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E3A5F",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  profileInitial: {
    color: "#4ADE80",
    fontSize: 22,
    fontWeight: "900",
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
    marginBottom: 40,
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
