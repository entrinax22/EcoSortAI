import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/ui/brand-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const IMPACT_STATS = [
  { label: 'Total Items', value: '247', icon: 'qrcode', color: '#10B981' },
  { label: 'Recycled', value: '186', icon: 'arrow.3.trianglepath', color: '#3B82F6' },
  { label: 'Composted', value: '42', icon: 'leaf.fill', color: '#10B981' },
  { label: 'CO₂ Saved', value: '18.5kg', icon: 'cloud.sun', color: '#F59E0B' },
];

const WEEKLY_DATA = [
  { day: 'Mon', scanned: 12, recycled: 9 },
  { day: 'Tue', scanned: 18, recycled: 15 },
  { day: 'Wed', scanned: 8, recycled: 6 },
  { day: 'Thu', scanned: 22, recycled: 18 },
  { day: 'Fri', scanned: 15, recycled: 12 },
  { day: 'Sat', scanned: 28, recycled: 22 },
  { day: 'Sun', scanned: 20, recycled: 16 },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Eco Starter', description: 'Scan your first 10 items', icon: 'star.fill', unlocked: true, color: '#F59E0B' },
  { id: 2, title: 'Recycling Pro', description: 'Recycle 100 items', icon: 'arrow.3.trianglepath', unlocked: true, color: '#3B82F6' },
  { id: 3, title: 'Compost Champion', description: 'Compost 50 organic items', icon: 'leaf.fill', unlocked: false, color: '#10B981' },
  { id: 4, title: 'Hazard Hero', description: 'Properly dispose 10 hazardous items', icon: 'shield.fill', unlocked: true, color: '#EF4444' },
  { id: 5, title: 'Earth Defender', description: 'Save 50kg of CO₂', icon: 'globe', unlocked: false, color: '#60A5FA' },
];

const RECYCLING_FACTS = [
  'Recycling one aluminum can saves enough energy to run a TV for 3 hours.',
  'It takes 450 years for a plastic bottle to decompose in a landfill.',
  'Paper can be recycled 5–7 times before fibers become too short.',
  'Glass can be recycled infinitely without losing quality.',
  'Composting at home can reduce household waste by ~30%.',
];

export default function ImpactScreen() {
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];
  const maxScanned = Math.max(...WEEKLY_DATA.map((d) => d.scanned));

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader title="Impact" subtitle="Track your eco journey" icon="leaf.fill" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {IMPACT_STATS.map((stat) => (
            <View key={stat.label} style={[styles.statItem, { backgroundColor: c.surface, borderColor: c.border }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                <IconSymbol size={18} name={stat.icon} color={stat.color} />
              </View>
              <ThemedText style={[styles.statValue, { color: c.text }]}>{stat.value}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: c.mutedText }]}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <ThemedText style={[styles.cardTitle, { color: c.text }]}>This Week</ThemedText>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((data) => (
              <View key={data.day} style={styles.dayColumn}>
                <View style={[styles.barTrack, { backgroundColor: c.surface2 }]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${(data.recycled / maxScanned) * 100}%`, backgroundColor: c.brand },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.dayLabel, { color: c.mutedText }]}>{data.day}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: c.text }]}>Achievements</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {ACHIEVEMENTS.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  { backgroundColor: c.surface, borderColor: c.border },
                  !a.unlocked && styles.achievementLocked,
                ]}>
                <View style={[styles.achievementIcon, { backgroundColor: a.color + '18' }]}>
                  <IconSymbol size={30} name={a.icon} color={a.color} />
                </View>
                <ThemedText style={[styles.achievementTitle, { color: c.text }]}>{a.title}</ThemedText>
                <ThemedText style={[styles.achievementDesc, { color: c.mutedText }]}>{a.description}</ThemedText>
                <View style={[styles.badge, { backgroundColor: a.unlocked ? c.brand : c.surface2 }]}>
                  <ThemedText style={[styles.badgeText, { color: a.unlocked ? '#fff' : c.mutedText }]}>
                    {a.unlocked ? 'Unlocked' : 'Locked'}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.factCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.factHeader}>
            <View style={[styles.factIcon, { backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.16)' : '#FEF3C7' }]}>
              <IconSymbol size={18} name="lightbulb.fill" color={c.warning} />
            </View>
            <ThemedText style={[styles.factTitle, { color: c.text }]}>Did you know?</ThemedText>
          </View>
          {RECYCLING_FACTS.slice(0, 3).map((fact) => (
            <View key={fact} style={styles.factRow}>
              <View style={[styles.dot, { backgroundColor: c.brand }]} />
              <ThemedText style={[styles.factText, { color: c.mutedText }]}>{fact}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <ThemedText style={[styles.cardTitle, { color: c.text }]}>Impact Summary</ThemedText>

          <View style={[styles.impactItem, { borderBottomColor: c.border }]}>
            <IconSymbol size={28} name="tree.fill" color={c.brand} />
            <View style={styles.impactInfo}>
              <ThemedText style={[styles.impactValue, { color: c.text }]}>6</ThemedText>
              <ThemedText style={[styles.impactDesc, { color: c.mutedText }]}>Trees protected (estimate)</ThemedText>
            </View>
          </View>
          <View style={[styles.impactItem, { borderBottomColor: c.border }]}>
            <IconSymbol size={28} name="drop.fill" color={c.accent} />
            <View style={styles.impactInfo}>
              <ThemedText style={[styles.impactValue, { color: c.text }]}>4,200 L</ThemedText>
              <ThemedText style={[styles.impactDesc, { color: c.mutedText }]}>Water saved from recycling</ThemedText>
            </View>
          </View>
          <View style={[styles.impactItem, { borderBottomColor: 'transparent' }]}>
            <IconSymbol size={28} name="bolt.fill" color={c.warning} />
            <View style={styles.impactInfo}>
              <ThemedText style={[styles.impactValue, { color: c.text }]}>156 kWh</ThemedText>
              <ThemedText style={[styles.impactDesc, { color: c.mutedText }]}>Energy conserved</ThemedText>
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
  },
  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    width: '47%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 14,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 9,
    height: 100,
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: 9,
    borderRadius: 5,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  achievementsScroll: {
    marginLeft: -4,
  },
  achievementCard: {
    width: 150,
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  achievementLocked: {
    opacity: 0.55,
  },
  achievementIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
    fontWeight: '600',
  },
  badge: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  factCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  factIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  factRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  factText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  impactInfo: {
    marginLeft: 14,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  impactDesc: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
});

