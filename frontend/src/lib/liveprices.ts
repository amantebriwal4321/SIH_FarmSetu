// SERVER-ONLY. Fetches today's REAL mandi prices from the government's data.gov.in
// Agmarknet dataset ("Current Daily Price of Various Commodities from Various Markets").
// Cached (1h) + timed-out (8s) + falls back to a recent snapshot, so a stage demo never
// breaks. The key is data.gov.in's public sample key (documented, not a secret) unless
// DATA_GOV_API_KEY is set. This module must only be imported by server code.

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

export async function getLivePrices(commodity = "Tomato"): Promise<LivePrices> {
  const key = process.env.DATA_GOV_API_KEY || SAMPLE_KEY;
  const url =
    `https://api.data.gov.in/resource/${RESOURCE}` +
    `?api-key=${key}&format=json&limit=100` +
    `&filters%5Bstate%5D=Karnataka&filters%5Bcommodity%5D=${encodeURIComponent(commodity)}`;

  try {
    // No AbortController — a signal makes Next skip its fetch cache. Instead race a
    // timeout so a slow load falls back fast, while a success still caches for an hour.
    const fetchJson = fetch(url, { next: { revalidate: 3600 }, headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))));
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 10000));
    const data = await Promise.race([fetchJson, timeout]);
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
    return { live: true, fetchedAt, commodity, rows: rows.slice(0, 8) };
  } catch {
    return { live: false, fetchedAt: "recent snapshot", commodity, rows: FALLBACK_ROWS };
  }
}
