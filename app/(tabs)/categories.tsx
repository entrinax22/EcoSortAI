import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/ui/brand-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CATEGORIES = [
  {
    id: 'recyclable',
    name: 'Recyclable',
    icon: 'arrow.3.trianglepath',
    color: '#3B82F6',
    description: 'Materials that can be processed and reused',
    items: ['Paper', 'Plastic', 'Glass', 'Metal'],
    tip: 'Rinse containers before recycling.',
  },
  {
    id: 'organic',
    name: 'Organic',
    icon: 'leaf.fill',
    color: '#10B981',
    description: 'Biodegradable waste for composting',
    items: ['Food scraps', 'Garden waste', 'Paper towels'],
    tip: 'Mix greens with browns for best compost.',
  },
  {
    id: 'hazardous',
    name: 'Hazardous',
    icon: 'exclamationmark.triangle',
    color: '#EF4444',
    description: 'Special handling required',
    items: ['Batteries', 'Chemicals', 'Electronics'],
    tip: 'Never dispose in regular trash.',
  },
  {
    id: 'electronic',
    name: 'E-Waste',
    icon: 'cpu',
    color: '#F59E0B',
    description: 'Electronic devices and components',
    items: ['Phones', 'Computers', 'Cables'],
    tip: 'Wipe personal data before dropping off.',
  },
  {
    id: 'general',
    name: 'General Waste',
    icon: 'trash',
    color: '#64748B',
    description: 'Non-recyclable, non-hazardous waste',
    items: ['Food-contaminated packaging', 'Styrofoam', 'Ceramics'],
    tip: 'Minimize volume when possible.',
  },
] as const;

export default function CategoriesScreen() {
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]['id'] | null>(
    null
  );

  const category = useMemo(
    () => CATEGORIES.find((x) => x.id === selectedCategory) ?? null,
    [selectedCategory]
  );

  if (category) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <View style={[styles.detailHeader, { backgroundColor: category.color }]}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={styles.backButton}
            activeOpacity={0.85}>
            <IconSymbol size={22} name="chevron.left" color="#fff" />
          </TouchableOpacity>

          <View style={styles.detailHeaderContent}>
            <View style={[styles.detailIconCircle, { backgroundColor: c.surface }]}>
              <IconSymbol size={38} name={category.icon} color={category.color} />
            </View>
            <ThemedText style={styles.detailTitle}>{category.name}</ThemedText>
            <ThemedText style={styles.detailDescription}>{category.description}</ThemedText>
          </View>
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.sectionCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>Accepted Items</ThemedText>
            <View style={styles.itemsGrid}>
              {category.items.map((item) => (
                <View
                  key={item}
                  style={[styles.itemChip, { backgroundColor: theme === 'dark' ? c.surface2 : '#F1F5F9' }]}>
                  <ThemedText style={[styles.itemChipText, { color: c.text }]}>{item}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.tipBox, { backgroundColor: c.surface, borderColor: c.border, borderLeftColor: category.color }]}>
            <IconSymbol size={20} name="lightbulb.fill" color={category.color} />
            <ThemedText style={[styles.tipBoxText, { color: c.mutedText }]}>{category.tip}</ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader title="Categories" subtitle="Learn how to sort your waste" icon="square.grid.2x2.fill" />

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryCard, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => setSelectedCategory(cat.id)}
            activeOpacity={0.9}>
            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
              <IconSymbol size={30} name={cat.icon} color={cat.color} />
            </View>
            <ThemedText style={[styles.categoryName, { color: c.text }]}>{cat.name}</ThemedText>
            <ThemedText style={[styles.categoryDesc, { color: c.mutedText }]} numberOfLines={2}>
              {cat.description}
            </ThemedText>
            <View style={[styles.categoryIndicator, { backgroundColor: cat.color }]} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 120,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  categoryDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '600',
  },
  categoryIndicator: {
    width: 42,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  detailHeader: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailHeaderContent: {
    alignItems: 'center',
  },
  detailIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  detailDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  detailContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 120,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 14,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemChip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  tipBoxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});

