import { apiFetch } from "./api";

export type CollectorLocation = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  waste_types: string[];
  operating_hours: string;
};

export type CollectorResponse =
  | CollectorLocation[]
  | { count: number; results: CollectorLocation[] };

export const getCollectorLocations = () =>
  apiFetch<CollectorResponse>("/dashboard/api/collector-locations/");

// ── Collection types ──────────────────────────────────────────────────────────

export type WasteCategory =
  | "paper"
  | "metal"
  | "plastic"
  | "hazardous"
  | "biodegradable";

export type CreateCollectionPayload = {
  // Required
  household_name: string;
  household_id: string;
  street: string;
  barangay: string;
  category: WasteCategory;
  weight_kg: string;
  // Optional photo metadata
  photo_proof_data?: string; // base64 data URL e.g. "data:image/jpeg;base64,..."
  photo_timestamp?: number;
  photo_latitude?: number;
  photo_longitude?: number;
  photo_altitude?: number;
};

export type Collection = {
  id: number;
  household_name: string;
  household_id: string;
  street: string;
  barangay: string;
  category: WasteCategory;
  weight_kg: string;
  photo_proof?: string;
  photo_timestamp?: number;
  photo_latitude?: number;
  photo_longitude?: number;
  photo_altitude?: number;
  collected_at: string;
  collector: number;
};

export type ChangeRequestPayload = {
  request_type: "EDIT" | "DELETE";
  reason: string;
  // Required only when request_type === "EDIT"
  category?: WasteCategory;
  weight_kg?: string;
};

export type UpdateCollectionPayload = {
  // Required
  category: WasteCategory;
  weight_kg: string;
  // Optional photo metadata
  photo_proof_data?: string;
  photo_timestamp?: number;
  photo_latitude?: number;
  photo_longitude?: number;
  photo_altitude?: number;
};

export type CollectorDashboard = {
  recent_collections: Collection[];
  [key: string]: unknown;
};

// ── API methods ───────────────────────────────────────────────────────────────

/** Submit a scanned collection record (called after QR scan + form fill). */
export const createCollection = (payload: CreateCollectionPayload) =>
  apiFetch<Collection>("/collector-dashboard/api/collections/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

/**
 * Load the collector dashboard.
 * recent_collections contains the top 20 submissions by this collector.
 */
export const getCollectorDashboard = () =>
  apiFetch<CollectorDashboard>("/collector-dashboard/");

/** Apply an already-approved edit to a collection record. */
export const updateCollection = (
  collectionId: number,
  payload: UpdateCollectionPayload,
) =>
  apiFetch<Collection>(
    `/collector-dashboard/api/collections/${collectionId}/update/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

/** Request an edit or delete approval for a submitted collection. */
export const requestCollectionChange = (
  collectionId: number,
  payload: ChangeRequestPayload,
) =>
  apiFetch<{ detail: string }>(
    `/collector-dashboard/api/collections/${collectionId}/change-request/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
