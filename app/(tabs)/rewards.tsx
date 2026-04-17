import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/ui/brand-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Reward = {
  id: string;
  title: string;
  subtitle: string;
  cost: number;
  icon: string;
  color: string;
};

const REWARDS: Reward[] = [
  { id: 'voucher', title: '₱50 Eco Voucher', subtitle: 'Use at partner stores', cost: 250, icon: 'gift.fill', color: '#10B981' },
  { id: 'badge', title: 'Eco Badge: Trailblazer', subtitle: 'Profile badge + streak boost', cost: 120, icon: 'star.fill', color: '#F59E0B' },
  { id: 'tree', title: 'Plant a Tree', subtitle: 'We donate to reforestation', cost: 400, icon: 'tree.fill', color: '#3B82F6' },
];

const HISTORY = [
  { id: 'h1', title: 'Plastic Bottle', subtitle: 'Recyclable', points: 10, icon: 'arrow.3.trianglepath' },
  { id: 'h2', title: 'Banana Peel', subtitle: 'Organic', points: 5, icon: 'leaf.fill' },
  { id: 'h3', title: 'Old Batteries', subtitle: 'Hazardous', points: 20, icon: 'exclamationmark.triangle' },
];

export default function RewardsScreen() {
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  const [points, setPoints] = useState(320);
  const tier = useMemo(() => {
    if (points >= 800) return { name: 'Platinum', min: 800, max: 1200 };
    if (points >= 400) return { name: 'Gold', min: 400, max: 800 };
    if (points >= 150) return { name: 'Silver', min: 150, max: 400 };
    return { name: 'Bronze', min: 0, max: 150 };
  }, [points]);

  const nextTierLabel = useMemo(() => {
    if (tier.name === 'Platinum') return 'Max tier reached';
    const nextName =
      tier.name === 'Bronze' ? 'Silver' : tier.name === 'Silver' ? 'Gold' : 'Platinum';
    const remaining = Math.max(0, tier.max - points);
    return `${remaining} points to ${nextName}`;
  }, [points, tier.max, tier.name]);

  const progress = useMemo(() => {
    const denom = Math.max(1, tier.max - tier.min);
    return Math.min(1, Math.max(0, (points - tier.min) / denom));
  }, [points, tier.max, tier.min]);

  const redeem = (reward: Reward) => {
    if (points < reward.cost) return;
    setPoints((p) => p - reward.cost);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader title="Rewards" subtitle="Earn points, redeem perks" icon="trophy.fill" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.balanceCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.balanceTop}>
            <View style={[styles.balanceIcon, { backgroundColor: c.brandSoft }]}>
              <IconSymbol size={22} name="gift.fill" color={c.brand} />
            </View>
            <View style={styles.balanceText}>
              <ThemedText style={[styles.balanceLabel, { color: c.mutedText }]}>Eco Points</ThemedText>
              <ThemedText style={[styles.balanceValue, { color: c.text }]}>{points.toLocaleString()}</ThemedText>
            </View>
            <View style={[styles.tierPill, { backgroundColor: c.surface2 }]}>
              <ThemedText style={[styles.tierText, { color: c.brand }]}>{tier.name}</ThemedText>
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={[styles.progressTrack, { backgroundColor: c.surface2 }]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: c.brand }]} />
            </View>
            <View style={styles.progressMeta}>
              <ThemedText style={[styles.progressHint, { color: c.mutedText }]}>{nextTierLabel}</ThemedText>
              <ThemedText style={[styles.progressRange, { color: c.mutedText }]}>
                {tier.min}–{tier.max}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: c.text }]}>Redeem</ThemedText>
          {REWARDS.map((reward) => {
            const disabled = points < reward.cost;
            return (
              <View
                key={reward.id}
                style={[styles.rewardRow, { backgroundColor: c.surface, borderColor: c.border }]}
              >
                <View style={[styles.rewardIcon, { backgroundColor: reward.color + '18' }]}>
                  <IconSymbol size={20} name={reward.icon} color={reward.color} />
                </View>
                <View style={styles.rewardText}>
                  <ThemedText style={[styles.rewardTitle, { color: c.text }]}>{reward.title}</ThemedText>
                  <ThemedText style={[styles.rewardSubtitle, { color: c.mutedText }]}>{reward.subtitle}</ThemedText>
                </View>
                <View style={styles.rewardRight}>
                  <ThemedText style={[styles.cost, { color: c.mutedText }]}>{reward.cost}</ThemedText>
                  <TouchableOpacity
                    onPress={() => redeem(reward)}
                    disabled={disabled}
                    activeOpacity={0.9}
                    style={[
                      styles.redeemButton,
                      { backgroundColor: disabled ? c.surface2 : c.brand, borderColor: c.border },
                    ]}>
                    <ThemedText style={[styles.redeemText, { color: disabled ? c.mutedText : '#fff' }]}>
                      Redeem
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: c.text }]}>Recent Points</ThemedText>
          <View style={[styles.historyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            {HISTORY.map((h, idx) => (
              <View key={h.id} style={[styles.historyRow, idx !== HISTORY.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
                <View style={[styles.historyIcon, { backgroundColor: c.surface2 }]}>
                  <IconSymbol size={18} name={h.icon} color={c.brand} />
                </View>
                <View style={styles.historyText}>
                  <ThemedText style={[styles.historyTitle, { color: c.text }]}>{h.title}</ThemedText>
                  <ThemedText style={[styles.historySubtitle, { color: c.mutedText }]}>{h.subtitle}</ThemedText>
                </View>
                <View style={[styles.pointsPill, { backgroundColor: c.brandSoft }]}>
                  <ThemedText style={[styles.pointsPillText, { color: c.brand }]}>+{h.points}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  balanceCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  balanceValue: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  tierPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '900',
  },
  progressWrap: {
    marginTop: 14,
  },
  progressTrack: {
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    borderRadius: 6,
  },
  progressMeta: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressHint: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressRange: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  rewardRow: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardText: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  rewardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  rewardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  cost: {
    fontSize: 12,
    fontWeight: '800',
  },
  redeemButton: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  redeemText: {
    fontSize: 12,
    fontWeight: '900',
  },
  historyCard: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  historySubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  pointsPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: '900',
  },
});

