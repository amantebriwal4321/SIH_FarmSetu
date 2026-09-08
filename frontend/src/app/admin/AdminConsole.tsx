"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import RiskBadge, { riskColor } from "@/components/RiskBadge";
import PriceChart from "@/components/PriceChart";
import RiskSignals from "@/components/RiskSignals";
import SvgMap from "@/components/SvgMap";
import ImpactMeter from "@/components/ImpactMeter";
import Toast from "@/components/Toast";
import { sendDispatch, onConfirm } from "@/lib/dispatch";
import { inr, num, type CropSummary, type CropDetail, type Match, type MatchTotals, type Unit } from "@/lib/engine";

type Detail = { detail: CropDetail; matches: Match[]; totals: MatchTotals; alert: { crop: string; english: string; hindi: string } };
type Overview = {
  district: string; cropsTracked: number; cropsAtRisk: number; kgAtRisk: number;
  potentialRupeesSaved: number; unitsAvailable: number; buyers: number; farmersReached: number;
};

export default function AdminConsole({
  overview, crops, units, details,
}: {
  overview: Overview; crops: CropSummary[]; units: Unit[]; details: Record<string, Detail>;
}) {
  const [selected, setSelected] = useState(crops[0]?.slug);
  const [routed, setRouted] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const d = details[selected];

  useEffect(() => setRouted(false), [selected]);
  useEffect(() => setConfirmed(false), [selected]);

  useEffect(() => {
    return onConfirm((p) => {
      if (p.status === "accepted") setConfirmed(true);
    });
  }, []);

  function routeIt() {
    const best = d.matches[0];
    const farmers = Math.max(120, Math.round(d.detail.surplusTonnes * 1.7));
    setRouted(true);
    setConfirmed(false);
    if (best) {
      sendDispatch({
        id: `${selected}-${Date.now()}`,
        cropSlug: selected,
        cropName: d.detail.name,
        unitName: best.unitName,
        offer: best.offerPrice,
        crash: d.totals.crashPrice,
        farmers,
        english: d.alert.english,
        hindi: d.alert.hindi,
        ts: Date.now(),
        status: "pending",
      });
    }
    setToast(`Alert sent to ${num(farmers)} farmers · open the Farmer app to see it`);
  }

  return (
    <main className="mx-auto max-w-6xl w-full px-5 py-8 flex flex-col gap-6">
      <section>
        <h1 className="display" style={{ fontSize: 26, fontWeight: 700 }}>District control · {overview.district}</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 4 }}>
          Spot crops about to crash, then route the surplus to processing units before it’s dumped.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Crops at risk" value={String(overview.cropsAtRisk)} sub={`of ${overview.cropsTracked} tracked`} accent="var(--alarm-text)" />
        <StatCard label="Surplus at risk" value={num(Math.round(overview.kgAtRisk / 1000)) + " t"} sub="about to flood the mandi" />
        <StatCard label="Rupees rescuable" value={inr(overview.potentialRupeesSaved)} sub="vs dumping, this week" accent="var(--brand-deep)" />
        <StatCard label="Units ready" value={String(overview.unitsAvailable)} sub={`${overview.buyers} city buyers linked`} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* crop list */}
        <div className="card p-5 lg:col-span-2">
          <div className="eyebrow mb-3">At-risk crops · pick one</div>
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
            {crops.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelected(c.slug)}
                className="flex items-center justify-between py-3 text-left"
                style={{ background: "none", border: "none", cursor: "pointer", opacity: selected === c.slug ? 1 : 0.62 }}
              >
                <div className="flex items-center gap-3">
                  <div className="kpi-num" style={{ fontSize: 22, color: riskColor(c.label), width: 40 }}>{Math.round(c.risk)}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="faint" style={{ fontSize: 12 }}>₹{c.latestPrice}/kg · {num(c.surplusTonnes)} t surplus</div>
                  </div>
                </div>
                <RiskBadge label={c.label} />
              </button>
            ))}
          </div>
          <p className="faint" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
            The big number is the crash-risk score (0–100). Higher means the price is collapsing now.
          </p>
        </div>

        {/* selected crop */}
        <div className="card p-5 lg:col-span-3 flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="display" style={{ fontSize: 22, fontWeight: 700 }}>{d.detail.name}</h2>
                <RiskBadge label={d.detail.label} />
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                ₹{d.detail.latestPrice}/kg now · {num(d.detail.surplusTonnes)} t routable surplus
              </div>
            </div>
            <button className={`btn ${routed ? "" : "btn-primary"}`} onClick={routed ? () => setRouted(false) : routeIt}>
              {routed ? "Reset" : "Alert farmers & route surplus →"}
            </button>
          </div>

          {routed && (
            <ImpactMeter active={routed} rupees={d.totals.rupeesSaved} kg={d.totals.kgRescued} units={d.totals.unitsEngaged} />
          )}
          {routed && confirmed && (
            <div className="panel p-3" style={{ borderColor: "var(--brand)", color: "var(--brand-deep)", fontSize: 13, fontWeight: 600 }}>
              ✓ A farmer just accepted in the Farmer app — the deal is confirmed.
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div>
              <div className="eyebrow mb-2">60-day price, arrivals & crash risk</div>
              <PriceChart series={d.detail.series} height={230} />
            </div>
            <div>
              <div className="eyebrow mb-2">Why the alarm fired</div>
              <RiskSignals signals={d.detail.signals} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div>
              <div className="eyebrow mb-2">Where the surplus goes</div>
              <SvgMap district={{ lat: d.detail.districtLat, lng: d.detail.districtLng, name: d.detail.district }} units={units} matched={d.matches} routed={routed} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="eyebrow mb-1">Matched units</div>
              {d.matches.map((m) => (
                <div key={m.unitSlug} className="panel p-3 flex items-center justify-between" style={{ opacity: routed ? 1 : 0.6, transition: "opacity .4s" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.unitName} <span className="pill" style={{ marginLeft: 6 }}>{m.kind}</span></div>
                    <div className="faint" style={{ fontSize: 12 }}>{m.distanceKm} km · takes {m.allocatedTonnes} t · {m.products.join(", ")}</div>
                  </div>
                  <div className="text-right">
                    <div className="mono" style={{ fontWeight: 600, color: "var(--brand-deep)" }}>₹{m.offerPrice}/kg</div>
                    <div className="faint" style={{ fontSize: 11 }}>saves {inr(m.rupeesSaved)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </main>
  );
}
