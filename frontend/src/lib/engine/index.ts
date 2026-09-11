// Public engine surface. Pure, synchronous, deterministic — safe to call from server or
// client components. Replaces the Python API for the deployed single-app build.

import { CROPS, UNITS, BUYERS, DISTRICT, type Crop } from "./seed";
import { computeRiskSeries, riskLabel, type RiskLabel, type RiskPoint } from "./predictor";
import { match, type Match, type MatchTotals } from "./matching";
import type { Lang } from "../i18n";

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

export type AlertBundle = {
  cropNames: Record<Lang, string>;
  unitName: string;
  offer: number;
  crash: number;
  productName: string;   // what the unit turns the crop into (e.g. "paste")
  productPrice: number;  // ₹/kg the unit sells that product for in the city (0 = unknown)
  texts: Record<Lang, string>;
};

// Best city price the matched unit can get for the product it makes — this is why
// the unit can afford to pay the farmer above the crashing mandi price.
function productValue(products: string[]): { name: string; price: number } {
  const buyer = BUYERS
    .filter((b) => b.wants.some((w) => products.includes(w)))
    .sort((a, b) => b.pricePerKg - a.pricePerKg)[0];
  return { name: products[0] ?? "paste", price: buyer?.pricePerKg ?? 0 };
}

export function alertText(slug: string): AlertBundle | null {
  const c = CROPS.find((x) => x.slug === slug);
  if (!c) return null;
  const res = getMatches(slug)!;
  const best = res.matches[0];
  const offer = res.totals.offerPrice;
  const crash = res.totals.crashPrice;
  const cropNames: Record<Lang, string> = { en: c.name, hi: c.nameHi, kn: c.nameKn };

  if (!best) {
    return {
      cropNames, unitName: "", offer, crash, productName: "", productPrice: 0,
      texts: {
        en: `${c.name} prices are crashing. No processing unit is free nearby yet.`,
        hi: `${c.nameHi} के दाम गिर रहे हैं। अभी पास में कोई यूनिट खाली नहीं है।`,
        kn: `${c.nameKn} ಬೆಲೆ ಕುಸಿಯುತ್ತಿದೆ. ಸಮೀಪದಲ್ಲಿ ಯಾವ ಘಟಕವೂ ಖಾಲಿ ಇಲ್ಲ.`,
      },
    };
  }

  const km = Math.round(best.distanceKm);
  const nearEn = best.distanceKm < 1 ? "in your area" : `${km} km away`;
  const nearHi = best.distanceKm < 1 ? "आपके पास" : `${km} किमी दूर`;
  const nearKn = best.distanceKm < 1 ? "ನಿಮ್ಮ ಹತ್ತಿರ" : `${km} ಕಿಮೀ ದೂರ`;
  const prod = productValue(best.products || []);

  return {
    cropNames, unitName: best.unitName, offer, crash, productName: prod.name, productPrice: prod.price,
    texts: {
      en: `${c.name} prices are crashing (now ₹${crash}/kg). Do not dump your crop. ${best.unitName}, ${nearEn}, will buy it at ₹${offer}/kg.`,
      hi: `${c.nameHi} के दाम गिर रहे हैं (अभी ₹${crash}/किलो)। फसल मत फेंकिए। ${best.unitName}, ${nearHi}, ₹${offer}/किलो में खरीदेगा।`,
      kn: `${c.nameKn} ಬೆಲೆ ಕುಸಿಯುತ್ತಿದೆ (ಈಗ ₹${crash}/ಕೆಜಿ). ಬೆಳೆ ಎಸೆಯಬೇಡಿ. ${best.unitName}, ${nearKn}, ₹${offer}/ಕೆಜಿಗೆ ಖರೀದಿಸುತ್ತದೆ.`,
    },
  };
}

// formatting helpers (Indian grouping)
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");

export type { Match, MatchTotals } from "./matching";
export type { RiskLabel } from "./predictor";
export type { Unit, District, Buyer } from "./seed";
export { DISTRICT, UNITS, BUYERS } from "./seed";
