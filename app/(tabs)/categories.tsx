import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

const CATEGORIES = [
  {
    id: "recyclable",
    name: "Recyclable",
    icon: "arrow.3.trianglepath",
    color: "#00C853",
    description: "Materials that can be processed and reused",
    items: ["Paper", "Plastic", "Glass", "Metal"],
    tip: "Rinse containers before recycling",
  },
  {
    id: "organic",
    name: "Organic",
    icon: "leaf",
    color: "#76FF03",
    description: "Biodegradable waste for composting",
    items: ["Food", "Garden", "Paper towels"],
    tip: "Mix greens with browns for best compost",
  },
  {
    id: "hazardous",
    name: "Hazardous",
    icon: "exclamationmark.triangle",
    color: "#FF3D00",
    description: "Special handling required",
    items: ["Batteries", "Chemicals", "Electronics"],
    tip: "Never dispose in regular trash",
  },
  {
    id: "electronic",
    name: "E-Waste",
    icon: "cpu",
    color: "#00B0FF",
    description: "Electronic devices and components",
    items: ["Phones", "Computers", "Cables"],
    tip: "Delete personal data first",
  },
  {
    id: "general",
    name: "General Waste",
    icon: "trash",
    color: "#78909C",
    description: "Non-recyclable, non-hazardous waste",
    items: ["Food-contaminated packaging", "Styrofoam", "Ceramics"],
    tip: "Minimize volume when possible",
  },
];

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const category = CATEGORIES.find((c) => c.id === selectedCategory);

  if (category) {
    return (
      <ThemedView style={styles.container}>
        {/* Detail Header */}
        <View
          style={[styles.detailHeader, { backgroundColor: category.color }]}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={styles.backButton}
          >
            <IconSymbol size={24} name="chevron.left" color="#fff" />
          </TouchableOpacity>
          <View style={styles.detailHeaderContent}>
            <View style={styles.detailIconCircle}>
              <IconSymbol
                size={40}
                name={category.icon}
                color={category.color}
              />
            </View>
            <ThemedText style={styles.detailTitle}>{category.name}</ThemedText>
            <ThemedText style={styles.detailDescription}>
              {category.description}
            </ThemedText>
          </View>
        </View>

        <ScrollView
          style={styles.detailContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Items Grid */}
          <View style={styles.itemsSection}>
            <ThemedText style={styles.sectionLabel}>Accepted Items</ThemedText>
            <View style={styles.itemsGrid}>
              {category.items.map((item, index) => (
                <View key={index} style={styles.itemChip}>
                  <ThemedText style={styles.itemChipText}>{item}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Tip */}
          <View style={[styles.tipBox, { borderLeftColor: category.color }]}>
            <IconSymbol
              size={20}
              name="lightbulb.fill"
              color={category.color}
            />
            <ThemedText style={styles.tipBoxText}>{category.tip}</ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Categories</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Learn how to sort your waste
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: cat.color + "15" },
                ]}
              >
                <IconSymbol size={32} name={cat.icon} color={cat.color} />
              </View>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
              <ThemedText style={styles.categoryDesc} numberOfLines={2}>
                {cat.description}
              </ThemedText>
              <View
                style={[
                  styles.categoryIndicator,
                  { backgroundColor: cat.color },
                ]}
              />
            </TouchableOpacity>
          ))}
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
  // List View Styles
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
    flex: 1,
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  categoryIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  // Detail View Styles
  detailHeader: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  detailHeaderContent: {
    alignItems: "center",
  },
  detailIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  itemChip: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemChipText: {
    fontSize: 14,
    color: "#00C853",
    fontWeight: "500",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tipBoxText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
