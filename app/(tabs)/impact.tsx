import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

const IMPACT_STATS = [
  { label: "Total Items", value: "247", icon: "qrcode", color: "#00E676" },
  {
    label: "Recycled",
    value: "186",
    icon: "arrow.3.trianglepath",
    color: "#00B0FF",
  },
  { label: "Composted", value: "42", icon: "leaf", color: "#76FF03" },
  { label: "CO₂ Saved", value: "18.5kg", icon: "cloud.sun", color: "#FF9100" },
];

const WEEKLY_DATA = [
  { day: "Mon", scanned: 12, recycled: 9 },
  { day: "Tue", scanned: 18, recycled: 15 },
  { day: "Wed", scanned: 8, recycled: 6 },
  { day: "Thu", scanned: 22, recycled: 18 },
  { day: "Fri", scanned: 15, recycled: 12 },
  { day: "Sat", scanned: 28, recycled: 22 },
  { day: "Sun", scanned: 20, recycled: 16 },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Eco Starter",
    description: "Scan your first 10 items",
    icon: "star.fill",
    unlocked: true,
    color: "#FFD700",
  },
  {
    id: 2,
    title: "Recycling Pro",
    description: "Recycle 100 items",
    icon: "arrow.3.trianglepath",
    unlocked: true,
    color: "#00E676",
  },
  {
    id: 3,
    title: "Compost Champion",
    description: "Compost 50 organic items",
    icon: "leaf",
    unlocked: false,
    color: "#76FF03",
  },
  {
    id: 4,
    title: "Hazard Hero",
    description: "Properly dispose 10 hazardous items",
    icon: "shield.fill",
    unlocked: true,
    color: "#FF3D00",
  },
  {
    id: 5,
    title: "Earth Defender",
    description: "Save 50kg of CO₂",
    icon: "globe",
    unlocked: false,
    color: "#00B0FF",
  },
];

const RECYCLING_FACTS = [
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
  "It takes 450 years for a plastic bottle to decompose in a landfill.",
  "Paper can be recycled 5-7 times before the fibers become too short.",
  "Glass can be recycled infinitely without losing quality.",
  "Composting at home can reduce household waste by 30%.",
];

export default function ImpactScreen() {
  const maxScanned = Math.max(...WEEKLY_DATA.map((d) => d.scanned));

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Impact</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Track your eco journey
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsRow}>
          {IMPACT_STATS.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + "20" },
                ]}
              >
                <IconSymbol size={20} name={stat.icon} color={stat.color} />
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>This Week</ThemedText>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((data, index) => (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${(data.recycled / maxScanned) * 100}%` },
                    ]}
                  />
                </View>
                <ThemedText style={styles.dayLabel}>{data.day}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsScroll}
          >
            {ACHIEVEMENTS.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementLocked,
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.color + "20" },
                  ]}
                >
                  <IconSymbol
                    size={32}
                    name={achievement.icon}
                    color={achievement.unlocked ? achievement.color : "#999"}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText,
                  ]}
                >
                  {achievement.title}
                </ThemedText>
                <ThemedText style={styles.achievementDesc} numberOfLines={2}>
                  {achievement.description}
                </ThemedText>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <ThemedText style={styles.unlockedText}>
                      Unlocked
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Eco Tip */}
        <View style={[styles.section, styles.tipSection]}>
          <View style={styles.tipHeader}>
            <IconSymbol size={24} name="lightbulb.fill" color="#FFC107" />
            <ThemedText type="subtitle" style={styles.tipTitle}>
              Did You Know?
            </ThemedText>
          </View>
          <ThemedText style={styles.tipText}>
            {
              RECYCLING_FACTS[
                Math.floor(Math.random() * RECYCLING_FACTS.length)
              ]
            }
          </ThemedText>
        </View>

        {/* Environmental Impact Summary */}
        <View style={[styles.section, styles.impactSummary]}>
          <ThemedText type="subtitle">Environmental Impact</ThemedText>
          <View style={styles.impactItem}>
            <IconSymbol size={32} name="tree.fill" color="#4CAF50" />
            <View style={styles.impactInfo}>
              <ThemedText style={styles.impactValue}>2.3 trees</ThemedText>
              <ThemedText style={styles.impactDesc}>
                Equivalent trees saved
              </ThemedText>
            </View>
          </View>
          <View style={styles.impactItem}>
            <IconSymbol size={32} name="drop.fill" color="#2196F3" />
            <View style={styles.impactInfo}>
              <ThemedText style={styles.impactValue}>4,200 L</ThemedText>
              <ThemedText style={styles.impactDesc}>
                Water saved from recycling
              </ThemedText>
            </View>
          </View>
          <View style={styles.impactItem}>
            <IconSymbol size={32} name="bolt.fill" color="#FF9800" />
            <View style={styles.impactInfo}>
              <ThemedText style={styles.impactValue}>156 kWh</ThemedText>
              <ThemedText style={styles.impactDesc}>
                Energy conserved
              </ThemedText>
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
    backgroundColor: "#F0FDF4",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#00C853",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  dayColumn: {
    alignItems: "center",
    flex: 1,
  },
  barTrack: {
    width: 8,
    height: 100,
    backgroundColor: "#E8F5E9",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: 8,
    backgroundColor: "#00E676",
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 16,
  },
  achievementsScroll: {
    marginLeft: -4,
  },
  achievementCard: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#1B5E20",
  },
  achievementDesc: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  lockedText: {
    color: "#999",
  },
  unlockedBadge: {
    backgroundColor: "#00E676",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
  },
  unlockedText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  tipSection: {
    backgroundColor: "#FFF8E1",
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9100",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E65100",
  },
  tipText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  impactSummary: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  impactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  impactInfo: {
    marginLeft: 16,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00C853",
  },
  impactDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
