// Public engine surface. Pure, synchronous, deterministic — safe to call from server or
// client components. Replaces the Python API for the deployed single-app build.

import { CROPS, UNITS, BUYERS, DISTRICT, type Crop } from "./seed";
import { computeRiskSeries, riskLabel, type RiskLabel, type RiskPoint } from "./predictor";
import { match, type Match, type MatchTotals } from "./matching";

const SEASON_BASELINE_DAYS = 14;
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const r1 = (x: number) => Math.round(x * 10) / 10;

// precompute risk per crop once
const RISK: Record<string, RiskPoint[]> = {};
for (const c of CROPS) {
  RISK[c.slug] = computeRiskSeries(
    c.series.map((s) => ({ date: s.date, month: s.month, price: s.price, arrivals: s.arrivals })),
    c.harvestMonths
  );
}

function surplusTonnes(c: Crop): number {
  const arr = c.series.map((s) => s.arrivals);
  const base = mean(arr.slice(0, SEASON_BASELINE_DAYS));
  const latest = arr[arr.length - 1];
  return r1(Math.max(0, latest - base));
}

export type CropSummary = {
  slug: string;
  name: string;
  district: string;
  state: string;
  unit: string;
  latestPrice: number;
  latestArrivals: number;
  risk: number;
  label: RiskLabel;
  surplusTonnes: number;
};

export type SeriesPoint = { date: string; price: number; arrivals: number; risk: number };

export type CropDetail = CropSummary & {
  series: SeriesPoint[];
  signals: { arrivals: number; price: number; season: number };
  districtLat: number;
  districtLng: number;
};

function summary(c: Crop): CropSummary {
  const last = c.series[c.series.length - 1];
  const risk = RISK[c.slug][RISK[c.slug].length - 1].score;
  return {
    slug: c.slug,
    name: c.name,
    district: DISTRICT.name,
    state: DISTRICT.state,
    unit: c.unit,
    latestPrice: last.price,
    latestArrivals: last.arrivals,
    risk,
    label: riskLabel(risk),
    surplusTonnes: surplusTonnes(c),
  };
}

export function getCrops(): CropSummary[] {
  return CROPS.map(summary).sort((a, b) => b.risk - a.risk);
}

export function getCrop(slug: string): CropDetail | null {
  const c = CROPS.find((x) => x.slug === slug);
  if (!c) return null;
  const risks = RISK[c.slug];
  const series: SeriesPoint[] = c.series.map((s, i) => ({
    date: s.date,
    price: s.price,
    arrivals: s.arrivals,
    risk: risks[i].score,
  }));
  const lastRisk = risks[risks.length - 1];
  return {
    ...summary(c),
    series,
    signals: { arrivals: lastRisk.arrivalsSignal, price: lastRisk.priceSignal, season: lastRisk.seasonSignal },
    districtLat: DISTRICT.lat,
    districtLng: DISTRICT.lng,
  };
}

export function getMatches(slug: string): { matches: Match[]; totals: MatchTotals } | null {
  const c = CROPS.find((x) => x.slug === slug);
  if (!c) return null;
  const s = summary(c);
  return match(c.slug, DISTRICT.lat, DISTRICT.lng, s.surplusTonnes, s.latestPrice, UNITS);
}

export function getOverview() {
  const sums = getCrops();
  const atRisk = sums.filter((s) => s.risk >= 40);
  let kgAtRisk = 0;
  let rupeesSaved = 0;
  for (const s of atRisk) {
    const m = getMatches(s.slug);
    kgAtRisk += Math.round(s.surplusTonnes * 1000);
    rupeesSaved += m?.totals.rupeesSaved ?? 0;
  }
  return {
    district: `${DISTRICT.name}, ${DISTRICT.state}`,
    cropsTracked: sums.length,
    cropsAtRisk: atRisk.length,
    kgAtRisk,
    potentialRupeesSaved: rupeesSaved,
    unitsAvailable: UNITS.length,
    buyers: BUYERS.length,
    farmersReached: 1240, // representative for the demo district
  };
}

export function alertText(slug: string): { crop: string; english: string; hindi: string } | null {
  const c = CROPS.find((x) => x.slug === slug);
  if (!c) return null;
  const res = getMatches(slug)!;
  const best = res.matches[0];
  const offer = res.totals.offerPrice;
  const crash = res.totals.crashPrice;
  if (!best) {
    return {
      crop: c.name,
      english: `${c.name} prices are crashing. No processing unit is free nearby yet.`,
      hindi: `${c.name} के दाम गिर रहे हैं। अभी पास में कोई यूनिट खाली नहीं है।`,
    };
  }
  const nearEn = best.distanceKm < 1 ? "in your area" : `${Math.round(best.distanceKm)} km away`;
  const nearHi = best.distanceKm < 1 ? "आपके पास" : `${Math.round(best.distanceKm)} किमी दूर`;
  return {
    crop: c.name,
    english: `${c.name} prices are crashing (now ₹${crash}/kg). Do not dump your crop. ${best.unitName}, ${nearEn}, will buy it at ₹${offer}/kg.`,
    hindi: `${c.name} के दाम गिर रहे हैं (अभी ₹${crash}/किलो)। फसल मत फेंकिए। ${best.unitName}, ${nearHi}, ₹${offer}/किलो में खरीदेगा।`,
  };
}

// formatting helpers (Indian grouping)
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");

export type { Match, MatchTotals } from "./matching";
export type { RiskLabel } from "./predictor";
export type { Unit, District, Buyer } from "./seed";
export { DISTRICT, UNITS, BUYERS } from "./seed";
