import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandHeader } from "@/components/ui/brand-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ChatScreen() {
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader title="AI Assistant" subtitle="Smart eco guidance" icon="brain" />
      <View style={styles.centered}>
        <View style={[styles.iconWrap, { backgroundColor: c.brandSoft }]}>
          <IconSymbol size={48} name="brain" color={c.brand} />
        </View>
        <ThemedText style={[styles.title, { color: c.text }]}>Coming Soon</ThemedText>
        <ThemedText style={[styles.sub, { color: c.mutedText }]}>
          The AI Assistant feature is currently under development.{"\n"}
          Stay tuned for smart recycling guidance!
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: c.brandSoft }]}>
          <IconSymbol size={14} name="clock.fill" color={c.brand} />
          <ThemedText style={[styles.badgeText, { color: c.brand }]}>In Development</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, gap: 16 },
  iconWrap: { width: 96, height: 96, borderRadius: 32, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "900", letterSpacing: -0.3 },
  sub: { fontSize: 14, fontWeight: "500", textAlign: "center", lineHeight: 22 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "800" },
});
