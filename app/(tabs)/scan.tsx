import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/ui/brand-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ScanScreen() {
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | {
    item: string;
    category: string;
    confidence: number;
    instructions: string[];
  }>(null);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult({
        item: 'Plastic Water Bottle',
        category: 'Recyclable',
        confidence: 97,
        instructions: [
          'Empty any remaining liquid',
          'Rinse if heavily soiled',
          'Crush to save space',
          'Replace cap before recycling',
        ],
      });
    }, 1200);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader title="Scan" subtitle="AI-powered identification" icon="camera.fill" />

      {!hasPermission ? (
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[styles.permissionIcon, { backgroundColor: c.brandSoft }]}>
              <IconSymbol size={40} name="camera.fill" color={c.brand} />
            </View>
            <ThemedText style={[styles.permissionTitle, { color: c.text }]}>Enable Camera</ThemedText>
            <ThemedText style={[styles.permissionText, { color: c.mutedText }]}>
              Allow camera access to identify and classify waste items using AI.
            </ThemedText>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: c.brand, shadowColor: c.brand }]}
              onPress={() => setHasPermission(true)}
              activeOpacity={0.9}>
              <ThemedText style={styles.primaryButtonText}>Allow Access</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.cameraCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[styles.cameraPreview, { backgroundColor: c.surface2, borderColor: c.border }]}>
              <IconSymbol size={56} name="camera.fill" color={c.brand} />
              <ThemedText style={[styles.previewText, { color: c.mutedText }]}>Camera Preview</ThemedText>

              {scanning ? (
                <View style={[styles.scanningOverlay, { backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(16, 185, 129, 0.08)' }]}>
                  <View style={[styles.scannerRing, { borderColor: c.brand }]}>
                    <View style={[styles.scannerCorner, { borderColor: c.brand }]} />
                  </View>
                  <ThemedText style={[styles.scanningText, { color: c.brand }]}>Analyzing…</ThemedText>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.scanButton, { backgroundColor: c.brand, shadowColor: c.brand }, scanning && styles.scanButtonDisabled]}
              onPress={simulateScan}
              disabled={scanning}
              activeOpacity={0.9}>
              <View style={[styles.scanButtonInner, { backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255,255,255,0.22)' }]}>
                <IconSymbol size={28} name="camera.fill" color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {result ? (
            <View style={[styles.resultCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <View style={styles.resultHeader}>
                <View style={[styles.resultIcon, { backgroundColor: c.brandSoft }]}>
                  <IconSymbol size={26} name="checkmark.circle.fill" color={c.brand} />
                </View>
                <View style={styles.resultInfo}>
                  <ThemedText style={[styles.resultItem, { color: c.text }]}>{result.item}</ThemedText>
                  <View style={[styles.resultBadge, { backgroundColor: c.brand }]}>
                    <ThemedText style={styles.resultBadgeText}>{result.category}</ThemedText>
                  </View>
                </View>
                <View style={[styles.confidencePill, { backgroundColor: c.surface2 }]}>
                  <ThemedText style={[styles.confidenceValue, { color: c.brand }]}>{result.confidence}%</ThemedText>
                </View>
              </View>

              <View style={styles.instructionsSection}>
                <ThemedText style={[styles.instructionsTitle, { color: c.text }]}>How to dispose</ThemedText>
                {result.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionRow}>
                    <View style={[styles.stepNumber, { backgroundColor: c.brand }]}>
                      <ThemedText style={styles.stepText}>{index + 1}</ThemedText>
                    </View>
                    <ThemedText style={[styles.instructionText, { color: c.mutedText }]}>{instruction}</ThemedText>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.scanAgainButton, { backgroundColor: c.accent }]}
                onPress={() => setResult(null)}
                activeOpacity={0.9}>
                <IconSymbol size={18} name="arrow.3.trianglepath" color="#fff" />
                <ThemedText style={styles.scanAgainText}>Scan another item</ThemedText>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.tipsContainer}>
            <View style={[styles.tipItem, { backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.12)' : '#FFF8E1', borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.2)' : '#FDE68A' }]}>
              <IconSymbol size={20} name="lightbulb.fill" color={c.warning} />
              <ThemedText style={[styles.tipText, { color: c.mutedText }]}>Good lighting improves scan accuracy.</ThemedText>
            </View>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  scroll: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  permissionIcon: {
    width: 84,
    height: 84,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
    fontWeight: '600',
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  cameraCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
    alignItems: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '700',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  scannerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorner: {
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanningText: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 14,
  },
  scanButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  resultIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  resultInfo: {
    flex: 1,
  },
  resultItem: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  resultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  confidencePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  instructionsSection: {
    marginBottom: 14,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  tipsContainer: {
    marginTop: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});

