import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | {
    item: string;
    category: string;
    confidence: number;
    instructions: string[];
    color: string;
  }>(null);

  if (!hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Camera Access</ThemedText>
        </View>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <IconSymbol size={48} name="camera.fill" color="#00C853" />
          </View>
          <ThemedText style={styles.permissionTitle}>Enable Camera</ThemedText>
          <ThemedText style={styles.permissionText}>
            Allow camera access to identify and classify waste items using AI
          </ThemedText>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => setHasPermission(true)}
          >
            <ThemedText style={styles.permissionButtonText}>
              Allow Access
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult({
        item: "Plastic Water Bottle",
        category: "Recyclable",
        confidence: 97,
        color: "#00C853",
        instructions: [
          "Empty any remaining liquid",
          "Rinse if heavily soiled",
          "Crush to save space",
          "Replace cap before recycling",
        ],
      });
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Scan Waste</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          AI-powered identification
        </ThemedText>
      </View>

      {/* Camera View */}
      <View style={styles.cameraCard}>
        <View style={styles.cameraPreview}>
          <IconSymbol size={64} name="camera.fill" color="#00C853" />
          <ThemedText style={styles.previewText}>Camera Preview</ThemedText>

          {scanning && (
            <View style={styles.scanningOverlay}>
              <View style={styles.scannerRing}>
                <View style={styles.scannerCorner} />
              </View>
              <ThemedText style={styles.scanningText}>Analyzing...</ThemedText>
            </View>
          )}
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
          onPress={simulateScan}
          disabled={scanning}
        >
          <View style={styles.scanButtonInner}>
            <IconSymbol size={28} name="camera.fill" color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Result Card */}
      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View
              style={[
                styles.resultIcon,
                { backgroundColor: result.color + "20" },
              ]}
            >
              <IconSymbol
                size={28}
                name="checkmark.circle.fill"
                color={result.color}
              />
            </View>
            <View style={styles.resultInfo}>
              <ThemedText style={styles.resultItem}>{result.item}</ThemedText>
              <View
                style={[styles.resultBadge, { backgroundColor: result.color }]}
              >
                <ThemedText style={styles.resultBadgeText}>
                  {result.category}
                </ThemedText>
              </View>
            </View>
            <View style={styles.confidencePill}>
              <ThemedText style={styles.confidenceValue}>
                {result.confidence}%
              </ThemedText>
            </View>
          </View>

          <View style={styles.instructionsSection}>
            <ThemedText style={styles.instructionsTitle}>
              How to dispose
            </ThemedText>
            {result.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View
                  style={[styles.stepNumber, { backgroundColor: result.color }]}
                >
                  <ThemedText style={styles.stepText}>{index + 1}</ThemedText>
                </View>
                <ThemedText style={styles.instructionText}>
                  {instruction}
                </ThemedText>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.scanAgainButton, { backgroundColor: result.color }]}
            onPress={() => setResult(null)}
          >
            <IconSymbol size={20} name="camera.fill" color="#fff" />
            <ThemedText style={styles.scanAgainText}>Scan Another</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Tips */}
      {!result && (
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <IconSymbol size={20} name="lightbulb.fill" color="#FF9100" />
            <ThemedText style={styles.tipText}>
              Hold item 6-12 inches from camera
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <IconSymbol size={20} name="lightbulb.fill" color="#FF9100" />
            <ThemedText style={styles.tipText}>
              Ensure good lighting for best results
            </ThemedText>
          </View>
        </View>
      )}
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
  cameraCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    alignItems: "center",
  },
  cameraPreview: {
    width: "100%",
    height: 280,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    color: "#00C853",
    marginTop: 12,
    fontWeight: "500",
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,200,83,0.1)",
    borderRadius: 20,
  },
  scannerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerCorner: {
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#00C853",
  },
  scanningText: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  scanButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00E676",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F0FDF4",
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#00E676",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resultIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultItem: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 6,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  resultBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  confidencePill: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00C853",
  },
  instructionsSection: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 16,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scanAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tipsContainer: {
    margin: 20,
    marginTop: 0,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
});
