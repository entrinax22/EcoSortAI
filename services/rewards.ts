import { apiFetch, BASE_URL } from "./api";
import { getCsrfToken } from "./session";

// ── Types ─────────────────────────────────────────────────────────────────────

export type RewardHistoryRow = {
  id: number;
  collection_id: number;
  category: string;
  weight_kg: string;
  points_earned: number;
  status: "approved" | "pending" | "disapproved" | string;
  collected_at: string;
  remarks?: string;
};

export type HouseholdRewards = {
  total_points: number;
  pending_points: number;
  level: string;
  progress: number; // 0–100
  history: RewardHistoryRow[];
};

export type RewardRate = {
  category: string;
  points_per_kg: number;
};

export type PendingCollection = {
  id: number;
  household_name: string;
  household_id: string;
  category: string;
  weight_kg: string;
  collected_at: string;
  status: string;
  collector_name?: string;
};

export type AdminRewardsData = {
  rates: RewardRate[];
  pending_collections: PendingCollection[];
};

// ── Household endpoint ────────────────────────────────────────────────────────

/** GET /rewards/ — household user's points, pending, history, level, progress */
export const getHouseholdRewards = () =>
  apiFetch<HouseholdRewards>("/rewards/", {
    headers: { Accept: "application/json" },
  });

// ── Admin endpoints ───────────────────────────────────────────────────────────

/** GET /admin-dashboard/rewards-management/ — rates + pending collections */
export const getAdminRewards = () =>
  apiFetch<AdminRewardsData>("/admin-dashboard/rewards-management/", {
    headers: { Accept: "application/json" },
  });

/**
 * Submits a form POST to /admin-dashboard/rewards-management/.
 * All three admin actions (update-rate, approve, disapprove) share this base.
 */
async function postAdminRewards(
  fields: Record<string, string>,
): Promise<{ data: unknown; error: string | null }> {
  try {
    const csrf = await getCsrfToken();
    const body = new URLSearchParams(fields).toString();

    const response = await fetch(
      `${BASE_URL}/admin-dashboard/rewards-management/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(csrf ? { "X-CSRFToken": csrf } : {}),
        },
        body,
      },
    );

    const contentType = response.headers.get("content-type") ?? "";
    const json = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      return {
        data: null,
        error: json?.detail ?? json?.message ?? `Error ${response.status}`,
      };
    }

    return { data: json ?? { ok: true }, error: null };
  } catch {
    return { data: null, error: "Network error. Please check your connection." };
  }
}

/** action=update-rate — set points per kg for a waste category */
export const updateRewardRate = (
  category: string,
  points_per_kg: string,
  return_query?: string,
) =>
  postAdminRewards({
    action: "update-rate",
    category,
    points_per_kg,
    ...(return_query ? { return_query } : {}),
  });

/** action=approve — approve a pending collection */
export const approveCollection = (
  collection_id: string,
  remarks?: string,
) =>
  postAdminRewards({
    action: "approve",
    collection_id,
    ...(remarks ? { remarks } : {}),
  });

/** action=disapprove — disapprove a pending collection (remarks required) */
export const disapproveCollection = (
  collection_id: string,
  remarks: string,
) =>
  postAdminRewards({ action: "disapprove", collection_id, remarks });
