import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";

type InfoRowProps = {
  label: string;
  value?: string | null;
  icon: string;
  c: (typeof Colors)["light"];
};

function InfoRow({ label, value, icon, c }: InfoRowProps) {
  if (!value) return null;
  return (
    <View style={[styles.row, { borderBottomColor: c.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: c.brandSoft }]}>
        <IconSymbol size={16} name={icon as any} color={c.brand} />
      </View>
      <View style={styles.rowText}>
        <ThemedText style={[styles.rowLabel, { color: c.mutedText }]}>{label}</ThemedText>
        <ThemedText style={[styles.rowValue, { color: c.text }]}>{value}</ThemedText>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];
  const { user, loading, logout, refresh } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const initials = (user?.full_name || user?.username || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header bar */}
      <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol size={22} name="chevron.left" color={c.brand} />
        </TouchableOpacity>
        <ThemedText style={[styles.topBarTitle, { color: c.text }]}>My Profile</ThemedText>
        <TouchableOpacity onPress={refresh} style={styles.backBtn}>
          <IconSymbol size={20} name="arrow.clockwise" color={c.brand} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + name block */}
        <View style={[styles.heroCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={[styles.avatar, { backgroundColor: c.brand }]}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>

          <ThemedText style={[styles.fullName, { color: c.text }]}>
            {user?.full_name || `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.username}
          </ThemedText>

          <ThemedText style={[styles.username, { color: c.mutedText }]}>
            @{user?.username}
          </ThemedText>

          <View style={[styles.rolePill, { backgroundColor: c.brandSoft }]}>
            <ThemedText style={[styles.rolePillText, { color: c.brand }]}>
              {user?.role_label ?? user?.role}
            </ThemedText>
          </View>
        </View>

        {/* Account info */}
        <ThemedText style={[styles.section, { color: c.mutedText }]}>ACCOUNT</ThemedText>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <InfoRow label="Email" value={user?.email} icon="envelope.fill" c={c} />
          <InfoRow label="Username" value={user?.username} icon="person.fill" c={c} />
          <InfoRow
            label="Status"
            value={user?.is_active ? "Active" : "Inactive"}
            icon="checkmark.seal.fill"
            c={c}
          />
        </View>

        {/* Address info (only if present) */}
        {(user?.household_id || user?.street || user?.barangay) && (
          <>
            <ThemedText style={[styles.section, { color: c.mutedText }]}>ADDRESS</ThemedText>
            <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
              <InfoRow label="Household ID" value={user?.household_id} icon="house.fill" c={c} />
              <InfoRow label="Street / Purok" value={user?.street} icon="map.fill" c={c} />
              <InfoRow label="Barangay" value={user?.barangay} icon="building.2.fill" c={c} />
            </View>
          </>
        )}

        {/* Sign out */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: c.danger }]}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <IconSymbol size={18} name="rectangle.portrait.and.arrow.right" color={c.danger} />
          <ThemedText style={[styles.logoutText, { color: c.danger }]}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  topBarTitle: { fontSize: 17, fontWeight: "800" },
  scroll: { padding: 20, paddingBottom: 60 },

  heroCard: {
    borderWidth: 1, borderRadius: 24, padding: 24,
    alignItems: "center", marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "900" },
  fullName: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  username: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
  rolePill: {
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10,
  },
  rolePillText: { fontSize: 12, fontWeight: "800" },

  section: {
    fontSize: 11, fontWeight: "900", letterSpacing: 0.8,
    marginBottom: 8, marginLeft: 4,
  },
  card: {
    borderWidth: 1, borderRadius: 18, overflow: "hidden", marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  rowIcon: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 11, fontWeight: "700", marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: "600" },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5,
    marginTop: 4,
  },
  logoutText: { fontSize: 15, fontWeight: "800" },
});
