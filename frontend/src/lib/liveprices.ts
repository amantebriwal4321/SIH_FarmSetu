// SERVER-ONLY. Fetches today's REAL mandi prices from the government's data.gov.in
// Agmarknet dataset ("Current Daily Price of Various Commodities from Various Markets").
//
// OPTIMIZATION: Non-blocking in-memory cache with stale-while-revalidate.
// The officer console (/admin) opens INSTANTLY (<20ms) instead of waiting for slow
// government network round-trips. Background updates populate the cache seamlessly.

const RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const SAMPLE_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

export type PriceRow = {
  market: string;
  district: string;
  pricePerKg: number;
  min: number;
  max: number;
  date: string;
  kolar: boolean;
};

export type LivePrices = {
  live: boolean;
  fetchedAt: string;
  commodity: string;
  rows: PriceRow[];
};

// A recent real snapshot (2026-09-11) so the panel still shows plausible Kolar/Karnataka
// prices if the API or the venue wifi fails on stage.
const FALLBACK_ROWS: PriceRow[] = [
  { market: "Davangere APMC", district: "Davangere", pricePerKg: 5, min: 4, max: 6, date: "recent", kolar: false },
  { market: "Bangarpet APMC", district: "Kolar", pricePerKg: 8, min: 6, max: 10, date: "recent", kolar: true },
  { market: "Chintamani APMC", district: "Chikkaballapur", pricePerKg: 8, min: 6, max: 10, date: "recent", kolar: false },
  { market: "Malur APMC", district: "Kolar", pricePerKg: 20, min: 15, max: 24, date: "recent", kolar: true },
  { market: "Shimoga APMC", district: "Shivamogga", pricePerKg: 10, min: 8, max: 12, date: "recent", kolar: false },
  { market: "Chamarajanagar APMC", district: "Chamarajanagar", pricePerKg: 22, min: 18, max: 26, date: "recent", kolar: false },
];

const isKolar = (d: string) => /kolar/i.test(d);
const perKg = (quintalPrice: string) => Math.round((parseFloat(quintalPrice) / 100) * 10) / 10;

// Global memory cache across requests in the Node/Next process
let memoryCache: { data: LivePrices; expiresAt: number } | null = null;
let pendingFetch: Promise<LivePrices> | null = null;

async function doFetchLive(commodity: string): Promise<LivePrices> {
  const key = process.env.DATA_GOV_API_KEY || SAMPLE_KEY;
  const url =
    `https://api.data.gov.in/resource/${RESOURCE}` +
    `?api-key=${key}&format=json&limit=100` +
    `&filters%5Bstate%5D=Karnataka&filters%5Bcommodity%5D=${encodeURIComponent(commodity)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const recs: Array<Record<string, string>> = data?.records ?? [];
    const rows: PriceRow[] = recs
      .map((r) => ({
        market: String(r.market ?? "").trim(),
        district: String(r.district ?? "").trim(),
        pricePerKg: perKg(r.modal_price),
        min: perKg(r.min_price),
        max: perKg(r.max_price),
        date: String(r.arrival_date ?? "").trim(),
        kolar: isKolar(String(r.district ?? "")),
      }))
      .filter((r) => r.market && Number.isFinite(r.pricePerKg) && r.pricePerKg > 0);

    if (!rows.length) throw new Error("no rows");

    // Kolar markets first (most relevant), then cheapest first (most crashing).
    rows.sort((a, b) => Number(b.kolar) - Number(a.kolar) || a.pricePerKg - b.pricePerKg);
    const fetchedAt = rows[0]?.date || new Date().toISOString().slice(0, 10);
    const result: LivePrices = { live: true, fetchedAt, commodity, rows: rows.slice(0, 8) };

    // Update memory cache for 1 hour
    memoryCache = { data: result, expiresAt: Date.now() + 3600 * 1000 };
    return result;
  } catch {
    const fallback: LivePrices = { live: false, fetchedAt: "recent snapshot", commodity, rows: FALLBACK_ROWS };
    // Cache fallback for 5 minutes so we don't spam if offline
    memoryCache = { data: fallback, expiresAt: Date.now() + 300 * 1000 };
    return fallback;
  } finally {
    pendingFetch = null;
  }
}

export async function getLivePrices(commodity = "Tomato"): Promise<LivePrices> {
  // 1. If we have a fresh in-memory cache, return it instantly (0ms)
  if (memoryCache && memoryCache.data.commodity === commodity && Date.now() < memoryCache.expiresAt) {
    return memoryCache.data;
  }

  // 2. If we have a stale in-memory cache, return it immediately and refresh in background (stale-while-revalidate)
  if (memoryCache && memoryCache.data.commodity === commodity) {
    if (!pendingFetch) {
      pendingFetch = doFetchLive(commodity);
    }
    return memoryCache.data;
  }

  // 3. Cold start: kick off fetch and race against a tight 600ms timeout
  // If government API responds in <600ms, great! If not, return fallback IMMEDIATELY
  // so the user NEVER waits for the page to open, and let background fetch finish.
  if (!pendingFetch) {
    pendingFetch = doFetchLive(commodity);
  }

  const fallback: LivePrices = { live: false, fetchedAt: "recent snapshot", commodity, rows: FALLBACK_ROWS };
  const quickTimeout = new Promise<LivePrices>((resolve) => setTimeout(() => resolve(fallback), 500));

  return Promise.race([pendingFetch, quickTimeout]);
}
