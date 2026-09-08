// Deterministic seed data (ported from backend/app/seed.py). A real-shaped Kolar tomato
// crash: arrivals climb through the harvest peak while price collapses ~₹18 → ₹4/kg.
// Everything is computed at module load so the demo is identical every run, fully offline.

export type District = { slug: string; name: string; state: string; lat: number; lng: number };
export type SeriesRow = { date: string; month: number; price: number; arrivals: number };
export type Crop = {
  slug: string;
  name: string;
  nameHi: string;
  nameKn: string;
  unit: string;
  harvestMonths: number[];
  series: SeriesRow[];
};
export type Unit = {
  slug: string;
  name: string;
  kind: "SHG" | "FPO";
  lat: number;
  lng: number;
  crops: string[];
  weeklyCapacity: number;
  products: string[];
  contact: string;
};
export type Buyer = { name: string; city: string; wants: string[]; pricePerKg: number };

const DAYS = 60;
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;

function isoDaysAgo(daysAgo: number): { date: string; month: number } {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  const date = d.toISOString().slice(0, 10);
  return { date, month: d.getMonth() + 1 };
}

type SeriesParams = {
  pStart: number; pEnd: number; pSlideStart: number; pSlideLen: number;
  aBase: number; aPeakExtra: number; aRampStart: number; aRampLen: number;
};

function genSeries(p: SeriesParams): SeriesRow[] {
  const rows: SeriesRow[] = [];
  for (let i = 0; i < DAYS; i++) {
    const slide = clamp((i - p.pSlideStart) / p.pSlideLen, 0, 1);
    let price = p.pStart - slide * (p.pStart - p.pEnd) + 0.4 * Math.sin(i * 0.7);
    price = Math.max(price, p.pEnd - 0.5);
    const ramp = clamp((i - p.aRampStart) / p.aRampLen, 0, 1);
    let arrivals = p.aBase + ramp * p.aPeakExtra + 0.05 * p.aBase * Math.sin(i * 0.9);
    arrivals = Math.max(arrivals, 10);
    const { date, month } = isoDaysAgo(DAYS - 1 - i);
    rows.push({ date, month, price: r2(price), arrivals: r1(arrivals) });
  }
  return rows;
}

const CROP_DEFS: { slug: string; name: string; nameHi: string; nameKn: string; params: SeriesParams }[] = [
  { slug: "tomato", name: "Tomato", nameHi: "टमाटर", nameKn: "ಟೊಮೇಟೊ", params: { pStart: 18, pEnd: 4, pSlideStart: 30, pSlideLen: 28, aBase: 200, aPeakExtra: 720, aRampStart: 28, aRampLen: 24 } },
  { slug: "onion", name: "Onion", nameHi: "प्याज़", nameKn: "ಈರುಳ್ಳಿ", params: { pStart: 22, pEnd: 13, pSlideStart: 30, pSlideLen: 24, aBase: 150, aPeakExtra: 240, aRampStart: 32, aRampLen: 20 } },
  { slug: "beans", name: "Beans", nameHi: "बीन्स", nameKn: "ಬೀನ್ಸ್", params: { pStart: 40, pEnd: 36, pSlideStart: 35, pSlideLen: 20, aBase: 60, aPeakExtra: 45, aRampStart: 40, aRampLen: 18 } },
];

export const DISTRICT: District = {
  slug: "kolar", name: "Kolar", state: "Karnataka", lat: 13.1367, lng: 78.1292,
};

export const CROPS: Crop[] = CROP_DEFS.map((d) => {
  const series = genSeries(d.params);
  const harvestMonths = Array.from(new Set(series.slice(-20).map((r) => r.month))).sort((a, b) => a - b);
  return { slug: d.slug, name: d.name, nameHi: d.nameHi, nameKn: d.nameKn, unit: "kg", harvestMonths, series };
});

export const UNITS: Unit[] = [
  { slug: "kolar-mahila-foods", name: "Kolar Mahila SHG Foods", kind: "SHG", lat: 13.1367, lng: 78.1292, crops: ["tomato"], weeklyCapacity: 30, products: ["paste", "puree"], contact: "Kolar town" },
  { slug: "srinivaspura-fpo", name: "Srinivaspura Farmer Producer Co.", kind: "FPO", lat: 13.341, lng: 78.214, crops: ["tomato", "onion"], weeklyCapacity: 55, products: ["paste", "flakes"], contact: "Srinivaspura" },
  { slug: "malur-womens-unit", name: "Malur Women's Agro Unit", kind: "SHG", lat: 13.004, lng: 77.937, crops: ["tomato", "beans"], weeklyCapacity: 25, products: ["puree", "dried"], contact: "Malur" },
  { slug: "chintamani-fpo", name: "Chintamani Farmer Producer Co.", kind: "FPO", lat: 13.402, lng: 78.053, crops: ["tomato", "onion"], weeklyCapacity: 60, products: ["paste", "ketchup"], contact: "Chintamani" },
  { slug: "bangarpet-shg", name: "Bangarpet SHG Kitchen", kind: "SHG", lat: 12.991, lng: 78.178, crops: ["tomato"], weeklyCapacity: 20, products: ["paste"], contact: "Bangarpet" },
  { slug: "mulbagal-cluster", name: "Mulbagal Food Cluster", kind: "FPO", lat: 13.165, lng: 78.393, crops: ["tomato", "onion"], weeklyCapacity: 40, products: ["flakes", "powder"], contact: "Mulbagal" },
];

export const BUYERS: Buyer[] = [
  { name: "Bangalore Fresh Foods", city: "Bengaluru", wants: ["paste", "puree"], pricePerKg: 42 },
  { name: "Chennai Retail Chain", city: "Chennai", wants: ["paste", "ketchup"], pricePerKg: 48 },
  { name: "South Foods Processors", city: "Hosur", wants: ["flakes", "powder"], pricePerKg: 55 },
];
