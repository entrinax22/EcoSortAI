import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandHeader } from "@/components/ui/brand-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import {
  ScannedHousehold,
  parseHouseholdQR,
  useCollectionScan,
} from "@/hooks/use-collection-scan";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { WasteCategory } from "@/services/collector";

// ─────────────────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES: { value: WasteCategory; label: string; icon: string }[] = [
  { value: "plastic", label: "Plastic", icon: "drop.fill" },
  { value: "paper", label: "Paper", icon: "doc.fill" },
  { value: "metal", label: "Metal", icon: "wrench.fill" },
  { value: "biodegradable", label: "Biodegradable", icon: "leaf.fill" },
  {
    value: "hazardous",
    label: "Hazardous",
    icon: "exclamationmark.triangle.fill",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Household QR screen  (role === "user")
// ─────────────────────────────────────────────────────────────────────────────

function HouseholdQRScreen() {
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];
  const { user } = useAuth();

  const qrPayload = JSON.stringify({
    household_id: user?.household_id ?? "",
    household_name: user?.full_name ?? user?.username ?? "",
    street: user?.street ?? "",
    barangay: user?.barangay ?? "",
    role: "household",
  });

  const handleShare = async () => {
    try {
      await Share.share({ message: qrPayload, title: "My Household QR" });
    } catch {
      // user cancelled
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
      <BrandHeader
        title="My QR Code"
        subtitle="Show this to your waste collector"
        icon="qrcode"
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.qrCard,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <View style={[styles.qrBox, { backgroundColor: "#fff" }]}>
            <QRCode
              value={qrPayload}
              size={220}
              color="#0F172A"
              backgroundColor="#ffffff"
            />
          </View>

          <ThemedText style={[styles.qrName, { color: c.text }]}>
            {user?.full_name || user?.username}
          </ThemedText>
          <ThemedText style={[styles.qrSub, { color: c.mutedText }]}>
            {[user?.street, user?.barangay].filter(Boolean).join(", ")}
          </ThemedText>

          {!!user?.household_id && (
            <View style={[styles.idPill, { backgroundColor: c.brandSoft }]}>
              <ThemedText style={[styles.idText, { color: c.brand }]}>
                ID: {user.household_id}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={[styles.hint, { color: c.mutedText }]}>
          Let your waste collector scan this QR code to record your collection.
        </ThemedText>

        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: c.brand }]}
          onPress={handleShare}
          activeOpacity={0.9}
        >
          <IconSymbol size={18} name="square.and.arrow.up" color="#fff" />
          <ThemedText style={styles.shareBtnText}>Share QR</ThemedText>
        </TouchableOpacity>

        {/* Info rows */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          {[
            { label: "Household ID", value: user?.household_id },
            { label: "Name", value: user?.full_name || user?.username },
            { label: "Street / Purok", value: user?.street },
            { label: "Barangay", value: user?.barangay },
          ]
            .filter((r) => r.value)
            .map((r) => (
              <View
                key={r.label}
                style={[styles.infoRow, { borderBottomColor: c.border }]}
              >
                <ThemedText style={[styles.infoLabel, { color: c.mutedText }]}>
                  {r.label}
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: c.text }]}>
                  {r.value}
                </ThemedText>
              </View>
            ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collector scanner screen  (role === "collector")
// ─────────────────────────────────────────────────────────────────────────────

type CollectorStep = "qr" | "form" | "photo" | "success";

function CollectorScanScreen() {
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];
  const [permission, requestPermission] = useCameraPermissions();
  const { submitState, errorMessage, submit, reset } = useCollectionScan();

  const [step, setStep] = useState<CollectorStep>("qr");
  const [household, setHousehold] = useState<ScannedHousehold | null>(null);
  const [category, setCategory] = useState<WasteCategory>("plastic");
  const [weight, setWeight] = useState("");
  const [qrScanned, setQrScanned] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Permission gate
  if (!permission) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={c.brand} size="large" />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <BrandHeader
          title="Scan QR"
          subtitle="Collector scanner"
          icon="qrcode.viewfinder"
        />
        <View style={styles.content}>
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: c.brandSoft }]}>
              <IconSymbol size={40} name="qrcode.viewfinder" color={c.brand} />
            </View>
            <ThemedText style={[styles.cardTitle, { color: c.text }]}>
              Camera Required
            </ThemedText>
            <ThemedText style={[styles.cardSub, { color: c.mutedText }]}>
              Camera access is needed to scan household QR codes and capture
              photo proof.
            </ThemedText>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.brand }]}
              onPress={requestPermission}
              activeOpacity={0.9}
            >
              <ThemedText style={styles.btnText}>Allow Camera</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <BrandHeader
          title="Scan QR"
          subtitle="Collector scanner"
          icon="qrcode.viewfinder"
        />
        <View style={styles.content}>
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: c.brandSoft }]}>
              <IconSymbol
                size={40}
                name="checkmark.circle.fill"
                color={c.brand}
              />
            </View>
            <ThemedText style={[styles.cardTitle, { color: c.text }]}>
              Collection Submitted!
            </ThemedText>
            <ThemedText style={[styles.cardSub, { color: c.mutedText }]}>
              Record for {household?.household_name} has been saved
              successfully.
            </ThemedText>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.brand }]}
              onPress={() => {
                reset();
                setHousehold(null);
                setWeight("");
                setQrScanned(false);
                setStep("qr");
              }}
              activeOpacity={0.9}
            >
              <ThemedText style={styles.btnText}>
                Scan Next Household
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  // ── Step: QR Scan ──────────────────────────────────────────────────────────
  if (step === "qr") {
    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <BrandHeader
          title="Scan QR"
          subtitle="Point at household QR code"
          icon="qrcode.viewfinder"
        />
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={({ data }) => {
              if (qrScanned) return;
              const parsed = parseHouseholdQR(data);
              if (!parsed) {
                Alert.alert(
                  "Invalid QR",
                  "This QR code is not a recognized household code.",
                );
                return;
              }
              setQrScanned(true);
              setHousehold(parsed);
              setStep("form");
            }}
          />
          {/* non-interactive overlay: frame + hint */}
          <View style={styles.qrOverlay} pointerEvents="none">
            <View style={[styles.qrFrame, { borderColor: c.brand }]}>
              <View
                style={[
                  styles.corner,
                  styles.cornerTL,
                  { borderColor: c.brand },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.cornerTR,
                  { borderColor: c.brand },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.cornerBL,
                  { borderColor: c.brand },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.cornerBR,
                  { borderColor: c.brand },
                ]}
              />
            </View>
            <ThemedText style={[styles.qrHint, { color: "#fff" }]}>
              Align household QR code within the frame
            </ThemedText>
          </View>

          {/* Cancel button — tappable, sits at the bottom of the camera */}
          <TouchableOpacity
            style={[styles.cancelScanBtn, { backgroundColor: "rgba(0,0,0,0.55)" }]}
            onPress={() => setQrScanned(false)}
            activeOpacity={0.8}
          >
            <IconSymbol size={16} name="xmark" color="#fff" />
            <ThemedText style={styles.cancelScanText}>Cancel Scan</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // ── Step: Form ─────────────────────────────────────────────────────────────
  if (step === "form") {
    const weightNum = parseFloat(weight);
    const weightValid = !isNaN(weightNum) && weightNum > 0;

    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <BrandHeader
          title="Collection Details"
          subtitle={household?.household_name ?? ""}
          icon="list.clipboard.fill"
          right={
            <TouchableOpacity
              onPress={() => {
                setHousehold(null);
                setWeight("");
                setQrScanned(false);
                setStep("qr");
              }}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <IconSymbol size={18} name="qrcode.viewfinder" color={c.brand} />
              <ThemedText style={[styles.backBtnText, { color: c.brand }]}>Re-scan</ThemedText>
            </TouchableOpacity>
          }
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.infoCard,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <ThemedText style={[styles.infoLabel, { color: c.mutedText }]}>
                HOUSEHOLD
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: c.text }]}>
                {household?.household_name}
              </ThemedText>
              <ThemedText
                style={[styles.infoLabel, { color: c.mutedText, marginTop: 6 }]}
              >
                ID
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: c.text }]}>
                {household?.household_id}
              </ThemedText>
              {!!household?.street && (
                <>
                  <ThemedText
                    style={[
                      styles.infoLabel,
                      { color: c.mutedText, marginTop: 6 },
                    ]}
                  >
                    ADDRESS
                  </ThemedText>
                  <ThemedText style={[styles.infoValue, { color: c.text }]}>
                    {household.street}, {household.barangay}
                  </ThemedText>
                </>
              )}
            </View>

            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>
              Waste Category
            </ThemedText>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const selected = category === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.catBtn,
                      { backgroundColor: c.surface, borderColor: c.border },
                      selected && {
                        backgroundColor: c.brand,
                        borderColor: c.brand,
                      },
                    ]}
                    onPress={() => setCategory(cat.value)}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      size={20}
                      name={cat.icon as any}
                      color={selected ? "#fff" : c.brand}
                    />
                    <ThemedText
                      style={[
                        styles.catLabel,
                        { color: selected ? "#fff" : c.text },
                      ]}
                    >
                      {cat.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>
              Weight (kg)
            </ThemedText>
            <TextInput
              style={[
                styles.weightInput,
                {
                  backgroundColor: c.surface,
                  borderColor: weightValid || !weight ? c.border : c.danger,
                  color: c.text,
                },
              ]}
              placeholder="e.g. 2.50"
              placeholderTextColor={c.mutedText}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
            {!!weight && !weightValid && (
              <ThemedText style={[styles.errorText, { color: c.danger }]}>
                Weight must be greater than 0
              </ThemedText>
            )}

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: c.brand },
                !weightValid && { opacity: 0.45 },
              ]}
              onPress={() => weightValid && setStep("photo")}
              disabled={!weightValid}
              activeOpacity={0.9}
            >
              <ThemedText style={styles.btnText}>
                Next: Add Photo Proof
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: c.border }]}
              onPress={async () => {
                if (!weightValid || !household) return;
                const ok = await submit(household, {
                  category,
                  weight_kg: weight,
                });
                if (ok) setStep("success");
              }}
              disabled={!weightValid || submitState === "submitting"}
              activeOpacity={0.8}
            >
              {submitState === "submitting" ? (
                <ActivityIndicator color={c.brand} size="small" />
              ) : (
                <ThemedText
                  style={[styles.btnOutlineText, { color: c.mutedText }]}
                >
                  Skip Photo & Submit
                </ThemedText>
              )}
            </TouchableOpacity>

            {!!errorMessage && (
              <ThemedText
                style={[
                  styles.errorText,
                  { color: c.danger, textAlign: "center" },
                ]}
              >
                {errorMessage}
              </ThemedText>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }

  // ── Step: Photo proof ──────────────────────────────────────────────────────
  if (step === "photo") {
    const capture = async () => {
      if (!cameraRef.current || capturing) return;
      setCapturing(true);
      try {
        // Take photo with base64 payload for photo_proof_data
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false,
        });
        // submit() will also attach photo_timestamp + GPS coords (photo_latitude/longitude/altitude)
        const ok = await submit(household!, {
          category,
          weight_kg: weight,
          photoBase64: photo?.base64 ?? undefined,
        });
        if (ok) setStep("success");
      } finally {
        setCapturing(false);
      }
    };

    const overlayLabel = capturing
      ? "Capturing photo…"
      : submitState === "submitting"
        ? "Getting location & submitting…"
        : "";

    return (
      <ThemedView style={[styles.container, { backgroundColor: c.background }]}>
        <BrandHeader
          title="Photo Proof"
          subtitle="Capture the collected waste"
          icon="camera.fill"
          right={
            <TouchableOpacity
              onPress={() => {
                setHousehold(null);
                setWeight("");
                setQrScanned(false);
                setStep("qr");
              }}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <IconSymbol size={18} name="qrcode.viewfinder" color={c.brand} />
              <ThemedText style={[styles.backBtnText, { color: c.brand }]}>Re-scan</ThemedText>
            </TouchableOpacity>
          }
        />
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
          {(capturing || submitState === "submitting") && (
            <View style={styles.capturingOverlay}>
              <ActivityIndicator color={c.brand} size="large" />
              <ThemedText
                style={{ color: "#fff", marginTop: 12, fontWeight: "700" }}
              >
                {overlayLabel}
              </ThemedText>
            </View>
          )}
        </View>
        <View
          style={[
            styles.photoActions,
            { backgroundColor: c.surface, borderTopColor: c.border },
          ]}
        >
          {!!errorMessage && (
            <ThemedText
              style={[
                styles.errorText,
                { color: c.danger, textAlign: "center", marginBottom: 8 },
              ]}
            >
              {errorMessage}
            </ThemedText>
          )}
          <TouchableOpacity
            style={[
              styles.captureBtn,
              { backgroundColor: c.brand },
              (capturing || submitState === "submitting") && { opacity: 0.5 },
            ]}
            onPress={capture}
            disabled={capturing || submitState === "submitting"}
            activeOpacity={0.9}
          >
            <IconSymbol size={28} name="camera.fill" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => setStep("form")}
            disabled={capturing || submitState === "submitting"}
          >
            <ThemedText style={[styles.skipText, { color: c.mutedText }]}>
              ← Back to form
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — role router
// ─────────────────────────────────────────────────────────────────────────────

export default function ScanScreen() {
  const { user, loading } = useAuth();
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];

  if (loading || !user) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={c.brand} size="large" />
      </ThemedView>
    );
  }

  if (user.role === "collector") return <CollectorScanScreen />;
  return <HouseholdQRScreen />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  content: { flex: 1, padding: 20, paddingTop: 16 },
  scroll: { padding: 20, paddingTop: 8, paddingBottom: 100 },

  // QR display (user)
  qrCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  qrBox: { padding: 16, borderRadius: 16, marginBottom: 18 },
  qrName: { fontSize: 20, fontWeight: "900", marginBottom: 4 },
  qrSub: { fontSize: 13, fontWeight: "600", marginBottom: 12 },
  idPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  idText: { fontSize: 12, fontWeight: "800" },
  hint: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  shareBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  // Camera
  cameraContainer: { flex: 1, position: "relative" },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  qrFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderRadius: 16,
    position: "relative",
  },
  corner: { position: "absolute", width: 24, height: 24, borderWidth: 3 },
  cornerTL: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  qrHint: {
    fontSize: 13,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  capturingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Cards / form
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 0.8 },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  catBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  catLabel: { fontSize: 13, fontWeight: "800" },
  weightInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: { fontSize: 12, fontWeight: "700", marginBottom: 10 },
  btn: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  btnOutline: {
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
  },
  btnOutlineText: { fontSize: 14, fontWeight: "700" },

  // Photo step
  photoActions: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: "center",
    gap: 12,
    paddingBottom: 40,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 40,
  },
  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 14, fontWeight: "700" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  backBtnText: { fontSize: 13, fontWeight: "800" },
  cancelScanBtn: { position: "absolute", bottom: 32, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  cancelScanText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
