// The ONLY place the frontend talks to the backend (mirrors StackRadar's trends.ts).
// Client: same-origin, proxied by next.config rewrite. Server: hit backend directly.

export const API_BASE =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.BACKEND_ORIGIN || "http://127.0.0.1:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed: ${path} (${res.status})`);
  return res.json();
}

// ---------- types ----------
export type RiskLabel = "HIGH" | "WATCH" | "STABLE";

export interface CropSummary {
  slug: string;
  name: string;
  district: string;
  state: string;
  unit: string;
  latest_price: number | null;
  latest_arrivals: number | null;
  risk: number;
  label: RiskLabel;
  surplus_tonnes: number;
}

export interface Overview {
  district: string;
  crops_tracked: number;
  crops_at_risk: number;
  kg_at_risk: number;
  potential_rupees_saved: number;
  units_available: number;
  buyers: number;
}

export interface SeriesPoint {
  date: string;
  price: number;
  arrivals: number;
  risk: number;
}

export interface CropDetail extends CropSummary {
  series: SeriesPoint[];
  signals: { arrivals: number; price: number; season: number };
  district_lat: number;
  district_lng: number;
}

export interface Match {
  unit_slug: string;
  unit_name: string;
  kind: string;
  products: string[];
  distance_km: number;
  allocated_tonnes: number;
  offer_price: number;
  rupees_saved: number;
  lat: number;
  lng: number;
}

export interface MatchTotals {
  surplus_tonnes: number;
  tonnes_matched: number;
  tonnes_unmatched: number;
  kg_rescued: number;
  rupees_saved: number;
  units_engaged: number;
  offer_price: number;
  crash_price: number;
}

export interface Unit {
  slug: string;
  name: string;
  kind: string;
  lat: number;
  lng: number;
  crops: string[];
  weekly_capacity: number;
  products: string[];
  contact: string;
}

export interface AlertText {
  crop: string;
  channel: string;
  english: string;
  hindi: string;
}

export interface Trust {
  trust_score: number | null;
  count: number;
  avg_rating: number | null;
}

// ---------- fetchers ----------
export const fetchOverview = () => get<Overview>("/overview");
export const fetchCrops = () => get<{ crops: CropSummary[] }>("/crops");
export const fetchUnits = () => get<{ units: Unit[] }>("/units");
export const fetchCropDetail = (slug: string) => get<CropDetail>(`/crops/${slug}`);
export const fetchMatches = (slug: string) =>
  get<{ matches: Match[]; totals: MatchTotals }>(`/crops/${slug}/matches`);
export const fetchAlert = (slug: string) => get<AlertText>(`/crops/${slug}/alert`);
export const fetchTrust = () => get<Trust>("/trust");

export async function postFeedback(body: {
  crop_slug?: string;
  role?: string;
  rating: number;
  note?: string;
}): Promise<Trust> {
  const res = await fetch(`${API_BASE}/api/v1/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("feedback failed");
  return res.json();
}

// ---------- formatting ----------
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const num = (n: number) => n.toLocaleString("en-IN");
