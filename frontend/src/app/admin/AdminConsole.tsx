"use client";

import { useEffect, useState } from "react";
import DashShell from "@/components/dash/DashShell";
import KpiCard from "@/components/dash/KpiCard";
import PriceDrop from "@/components/PriceDrop";
import SvgMap from "@/components/SvgMap";
import RiskBadge, { riskColor } from "@/components/RiskBadge";
import QRCodeView from "@/components/QRCodeView";
import Toast from "@/components/Toast";
import { sendDispatch, onConfirm } from "@/lib/dispatch";
import { inr, num, type CropSummary, type CropDetail, type Match, type MatchTotals, type Unit, type AlertBundle } from "@/lib/engine";

type Detail = { detail: CropDetail; matches: Match[]; totals: MatchTotals; alert: AlertBundle };
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
  const [origin, setOrigin] = useState("");

  const d = details[selected];
  const farmers = Math.max(120, Math.round(d.detail.surplusTonnes * 1.7));

  useEffect(() => { setRouted(false); setConfirmed(false); }, [selected]);
  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => onConfirm((p) => { if (p.status === "accepted") setConfirmed(true); }), []);

  function routeIt() {
    const best = d.matches[0];
    setRouted(true);
    setConfirmed(false);
    if (best) {
      sendDispatch({
        id: `${selected}-${Date.now()}`, cropSlug: selected, cropNames: d.alert.cropNames,
        unitName: best.unitName, offer: best.offerPrice, crash: d.totals.crashPrice, farmers,
        texts: d.alert.texts, ts: Date.now(), status: "pending",
      });
    }
    setToast(`Alert sent to ${num(farmers)} farmers`);
  }

  const farmerUrl = origin ? `${origin}/farmer?crop=${selected}&auto=1` : "";

  return (
    <DashShell title="Overview" subtitle="Spot crops about to crash, then route the surplus before it’s dumped." active="overview">
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard filled label="Rupees rescuable" value={inr(overview.potentialRupeesSaved)} caption="this week, vs dumping" />
        <KpiCard label="Crops at risk" value={String(overview.cropsAtRisk)} caption={`of ${overview.cropsTracked} tracked`} />
        <KpiCard label="Surplus at risk" value={num(Math.round(overview.kgAtRisk / 1000)) + " t"} caption="about to flood the mandi" />
        <KpiCard label="Farmers reachable" value={num(overview.farmersReached)} caption="by phone, in their language" />
      </section>

      {/* main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* selected crop */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <h2 className="display" style={{ fontSize: 22, fontWeight: 700 }}>{d.detail.name}</h2>
                <RiskBadge label={d.detail.label} />
              </div>
              {!routed ? (
                <button className="btn btn-primary" onClick={routeIt}>Alert farmers & route surplus →</button>
              ) : (
                <button className="btn" onClick={() => setRouted(false)}>Reset</button>
              )}
            </div>

            <PriceDrop were={d.detail.series[0].price} now={d.detail.latestPrice} risk={d.detail.risk} />

            <div className="grid grid-cols-3 gap-3 mt-5">
              <Fact label="Surplus about to be dumped" value={`${num(d.detail.surplusTonnes)} t`} />
              <Fact label="Farmers we can warn" value={num(farmers)} />
              <Fact label="Units that can take it" value={String(d.totals.unitsEngaged)} />
            </div>

            <p className="muted" style={{ fontSize: 13.5, marginTop: 16, lineHeight: 1.5 }}>
              Why now: arrivals are far above a normal season and the price has already collapsed —
              in the harvest month. If nothing happens, this crop gets dumped within days.
            </p>
          </div>

          {routed && (
            <div className="card p-6">
              <div className="eyebrow mb-4">Routed — the surplus is saved</div>
              <div className="grid grid-cols-3 gap-3">
                <Big label="Rupees saved" value={inr(d.totals.rupeesSaved)} accent="var(--brand-deep)" />
                <Big label="Kg rescued" value={num(d.totals.kgRescued)} />
                <Big label="Units engaged" value={String(d.totals.unitsEngaged)} />
              </div>
              {confirmed && (
                <div className="panel p-3 mt-4" style={{ borderColor: "var(--brand)", color: "var(--brand-deep)", fontSize: 13, fontWeight: 600 }}>
                  ✓ A farmer just accepted — the deal is confirmed.
                </div>
              )}
              <div className="mt-5">
                <SvgMap district={{ lat: d.detail.districtLat, lng: d.detail.districtLng, name: d.detail.district }} units={units} matched={d.matches} routed />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {d.matches.slice(0, 4).map((m) => (
                  <div key={m.unitSlug} className="flex items-center justify-between" style={{ fontSize: 13.5 }}>
                    <span style={{ fontWeight: 600 }}>{m.unitName} <span className="faint" style={{ fontWeight: 400 }}>· {m.distanceKm} km</span></span>
                    <span className="mono" style={{ color: "var(--brand-deep)", fontWeight: 600 }}>₹{m.offerPrice}/kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right column */}
        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <div className="eyebrow mb-3">At-risk crops · pick one</div>
            <div className="flex flex-col gap-1">
              {crops.map((c) => (
                <button key={c.slug} onClick={() => setSelected(c.slug)} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-left"
                  style={{ background: selected === c.slug ? "var(--dash-bg)" : "transparent", border: "none", cursor: "pointer" }}>
                  <div className="flex items-center gap-3">
                    <div className="kpi-num" style={{ fontSize: 20, color: riskColor(c.label), width: 34 }}>{Math.round(c.risk)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div className="faint" style={{ fontSize: 12 }}>₹{c.latestPrice}/kg</div>
                    </div>
                  </div>
                  <RiskBadge label={c.label} />
                </button>
              ))}
            </div>
          </div>

          {routed && (
            <div className="card p-5 flex flex-col items-center text-center">
              <div className="eyebrow" style={{ alignSelf: "flex-start" }}>Deliver to a farmer’s phone</div>
              <div className="my-3"><QRCodeView url={farmerUrl} size={148} /></div>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>
                Scan with any phone to open the farmer’s app — it rings and speaks this alert.
              </p>
            </div>
          )}
        </div>
      </section>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </DashShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-3.5">
      <div className="kpi-num" style={{ fontSize: 20 }}>{value}</div>
      <div className="faint" style={{ fontSize: 11.5, marginTop: 3, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
function Big({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="panel p-4 text-center">
      <div className="kpi-num" style={{ fontSize: 22, color: accent || "var(--ink)" }}>{value}</div>
      <div className="faint" style={{ fontSize: 11, marginTop: 3 }}>{label}</div>
    </div>
  );
}
