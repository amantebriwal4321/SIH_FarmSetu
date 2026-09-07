"use client";

import Link from "next/link";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import SvgMap from "@/components/SvgMap";
import RiskBadge, { riskColor } from "@/components/RiskBadge";
import { inr, num, type CropSummary, type Overview, type Unit } from "@/lib/api";

const KOLAR = { lat: 13.1367, lng: 78.1292, name: "Kolar" };

export default function DashboardClient({
  overview,
  crops,
  units,
}: {
  overview: Overview | null;
  crops: CropSummary[];
  units: Unit[];
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-5 py-8 flex flex-col gap-6">
        {/* hero */}
        <section>
          <div className="eyebrow">Agriculture · FoodTech · Rural Development</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, marginTop: 6 }}>
            The farmer gets ₹5, you pay ₹25, and the crop still rots.
          </h1>
          <p className="muted" style={{ fontSize: 15, marginTop: 8, maxWidth: 680 }}>
            Kisan Setu predicts a price crash before it happens and routes the surplus to nearby
            processing units, so a crop that would be dumped becomes a product that lasts.
          </p>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Crops at risk" value={overview ? String(overview.crops_at_risk) : "—"} sub={overview ? `of ${overview.crops_tracked} tracked in ${overview.district}` : ""} accent="var(--high-text)" />
          <StatCard label="Surplus at risk" value={overview ? num(Math.round(overview.kg_at_risk / 1000)) + " t" : "—"} sub="about to flood the mandi" />
          <StatCard label="Rupees rescuable" value={overview ? inr(overview.potential_rupees_saved) : "—"} sub="vs dumping, this week" accent="var(--brand-deep)" />
          <StatCard label="Processing units" value={overview ? String(overview.units_available) : "—"} sub={overview ? `${overview.buyers} city buyers linked` : ""} />
        </section>

        {/* map + list */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="card p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="eyebrow">District map</div>
                <div className="muted" style={{ fontSize: 13 }}>The crashing mandi and the units that can absorb the surplus</div>
              </div>
            </div>
            <SvgMap district={KOLAR} units={units} />
            <div className="flex items-center gap-4 mt-3 faint" style={{ fontSize: 11 }}>
              <span className="inline-flex items-center gap-1.5"><span className="badge-dot" style={{ background: "var(--high)" }} /> mandi (price crashing)</span>
              <span className="inline-flex items-center gap-1.5"><span className="badge-dot" style={{ background: "var(--brand)" }} /> processing unit</span>
            </div>
          </div>

          <div className="card p-5 lg:col-span-2">
            <div className="eyebrow mb-3">At-risk crops · click to open</div>
            <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
              {crops.map((c) => (
                <Link key={c.slug} href={`/crop/${c.slug}`} className="flex items-center justify-between py-3 group">
                  <div className="flex items-center gap-3">
                    <div className="kpi-num" style={{ fontSize: 22, color: riskColor(c.label), width: 42 }}>{Math.round(c.risk)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }} className="group-hover:underline">{c.name}</div>
                      <div className="faint" style={{ fontSize: 12 }}>
                        ₹{c.latest_price}/kg · {num(Math.round(c.surplus_tonnes))} t surplus
                      </div>
                    </div>
                  </div>
                  <RiskBadge label={c.label} />
                </Link>
              ))}
              {crops.length === 0 && (
                <div className="muted py-6" style={{ fontSize: 14 }}>
                  Backend not reachable. Start it on port 8000.
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="faint" style={{ fontSize: 12, paddingTop: 8 }}>
          Prototype · Kolar demo on real-shaped mandi data. Prediction is a transparent rule
          (arrivals surge + price slide + harvest season), never a claimed future price.
        </footer>
      </main>
    </>
  );
}
