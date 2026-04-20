import * as Location from "expo-location";
import { useState } from "react";

import {
  CreateCollectionPayload,
  WasteCategory,
  createCollection,
} from "@/services/collector";

export type ScannedHousehold = {
  household_name: string;
  household_id: string;
  street: string;
  barangay: string;
};

export type ScanFormData = {
  category: WasteCategory;
  weight_kg: string;
  /** Raw base64 string from takePictureAsync (no data-URL prefix) */
  photoBase64?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Parses the raw QR string into household fields.
 *
 * Supported formats:
 * 1. JSON  — { household_id, household_name/name/full_name, street/address/household_street,
 *              barangay/village/household_barangay, role }
 * 2. Pipe  — "name|household_id|street|barangay"
 */
export function parseHouseholdQR(raw: string): ScannedHousehold | null {
  const s = raw.trim();
  if (!s) return null;

  // ── 1. JSON format ─────────────────────────────────────────────────────────
  try {
    const p = JSON.parse(s);
    const household_id = p.household_id ?? p.id ?? p.householdId ?? "";
    const household_name = p.household_name ?? p.name ?? p.full_name ?? "";
    const street = p.street ?? p.address ?? p.household_street ?? "";
    const barangay = p.barangay ?? p.village ?? p.household_barangay ?? "";

    if (household_id || household_name) {
      return { household_id, household_name, street, barangay };
    }
  } catch {
    // not JSON — fall through
  }

  // ── 2. Pipe-delimited: name|household_id|street|barangay ──────────────────
  const parts = s.split("|");
  if (parts.length >= 2) {
    return {
      household_name: parts[0] ?? "",
      household_id: parts[1] ?? "",
      street: parts[2] ?? "",
      barangay: parts[3] ?? "",
    };
  }

  // ── 3. Plain-text fallback ────────────────────────────────────────────────
  return { household_id: s, household_name: s, street: "", barangay: "" };
}

/** Requests foreground location permission and returns the current position, or null on failure. */
async function getLocationSnapshot(): Promise<{
  latitude: number;
  longitude: number;
  altitude: number;
} | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      altitude: pos.coords.altitude ?? 0,
    };
  } catch {
    return null;
  }
}

export function useCollectionScan() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (
    household: ScannedHousehold,
    form: ScanFormData,
  ): Promise<boolean> => {
    setSubmitState("submitting");
    setErrorMessage(null);

    // Capture timestamp + GPS coordinates at the moment of submission
    const timestamp = Date.now();
    const location = await getLocationSnapshot();

    const payload: CreateCollectionPayload = {
      household_name: household.household_name,
      household_id: household.household_id,
      street: household.street,
      barangay: household.barangay,
      category: form.category,
      weight_kg: form.weight_kg,
      photo_timestamp: timestamp,
      ...(location && {
        photo_latitude: location.latitude,
        photo_longitude: location.longitude,
        photo_altitude: location.altitude,
      }),
    };

    if (form.photoBase64) {
      payload.photo_proof_data = `data:image/jpeg;base64,${form.photoBase64}`;
    }

    const { error } = await createCollection(payload);

    if (error) {
      setSubmitState("error");
      setErrorMessage(error);
      return false;
    }

    setSubmitState("success");
    return true;
  };

  const reset = () => {
    setSubmitState("idle");
    setErrorMessage(null);
  };

  return { submitState, errorMessage, submit, reset };
}
