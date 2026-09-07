"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PriceChart from "@/components/PriceChart";
import RiskSignals from "@/components/RiskSignals";
import SvgMap from "@/components/SvgMap";
import RiskBadge from "@/components/RiskBadge";
import ImpactMeter from "@/components/ImpactMeter";
import PhoneView from "@/components/PhoneView";
import Feedback from "@/components/Feedback";
import { inr, num, type CropDetail, type Match, type MatchTotals, type AlertText, type Unit } from "@/lib/api";

export default function CropClient({
  detail,
  matches,
  totals,
  alert,
  units,
}: {
  detail: CropDetail;
  matches: Match[];
  totals: MatchTotals | null;
  alert: AlertText | null;
  units: Unit[];
}) {
  const [routed, setRouted] = useState(false);
  const district = { lat: detail.district_lat, lng: detail.district_lng, name: detail.district };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-5 py-8 flex flex-col gap-6">
        <Link href="/" className="link" style={{ fontSize: 13 }}>← All crops</Link>

        {/* title */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{detail.name}</h1>
              <RiskBadge label={detail.label} />
            </div>
            <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              {detail.district}, {detail.state} · crash risk score{" "}
              <b className="mono" style={{ color: "var(--high-text)" }}>{Math.round(detail.risk)}/100</b>
            </div>
          </div>
          <div className="flex gap-5">
            <Metric label="Current price" value={`₹${detail.latest_price}/kg`} />
            <Metric label="Arrivals today" value={`${num(Math.round(detail.latest_arrivals || 0))} t`} />
            <Metric label="Routable surplus" value={`${num(Math.round(detail.surplus_tonnes))} t`} />
          </div>
        </section>

        {/* chart + signals */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-5 lg:col-span-2">
            <div className="eyebrow mb-1">60 days · price, arrivals and crash-risk</div>
            <div className="muted mb-3" style={{ fontSize: 13 }}>
              Risk rises as arrivals flood in and price slides — the alarm goes off before the bottom.
            </div>
            <PriceChart series={detail.series} />
          </div>
          <div className="card p-5">
            <div className="eyebrow mb-1">Why the alarm fired</div>
            <div className="muted mb-4" style={{ fontSize: 13 }}>Three transparent signals, fixed weights.</div>
            <RiskSignals signals={detail.signals} />
          </div>
        </section>

        {/* intervention */}
        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="eyebrow">The intervention</div>
              <div className="muted" style={{ fontSize: 13 }}>
                Route the surplus to the nearest processing units instead of dumping it.
              </div>
            </div>
            <button className={`btn ${routed ? "" : "btn-primary"}`} onClick={() => setRouted((r) => !r)}>
              {routed ? "Reset" : "Route this crop →"}
            </button>
          </div>

          {totals && (
            <ImpactMeter
              active={routed}
              rupees={totals.rupees_saved}
              kg={totals.kg_rescued}
              units={totals.units_engaged}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
            <SvgMap district={district} units={units} matched={matches} routed={routed} />
            <div className="flex flex-col gap-2">
              {matches.map((m) => (
                <div
                  key={m.unit_slug}
                  className="panel p-3 flex items-center justify-between"
                  style={{ opacity: routed ? 1 : 0.55, transition: "opacity .4s" }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {m.unit_name} <span className="pill" style={{ marginLeft: 6 }}>{m.kind}</span>
                    </div>
                    <div className="faint" style={{ fontSize: 12 }}>
                      {m.distance_km} km · takes {m.allocated_tonnes} t · {m.products.join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono" style={{ fontWeight: 600, color: "var(--brand-deep)" }}>₹{m.offer_price}/kg</div>
                    <div className="faint" style={{ fontSize: 11 }}>saves {inr(m.rupees_saved)}</div>
                  </div>
                </div>
              ))}
              {totals && totals.tonnes_unmatched > 0 && (
                <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>
                  {num(Math.round(totals.tonnes_unmatched))} t still unmatched — more local capacity is
                  exactly what Operation Greens & PMFME fund.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* farmer phone + feedback */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="card p-5">{alert && <PhoneView alert={alert} />}</div>
          <div className="card p-5"><Feedback cropSlug={detail.slug} /></div>
        </section>
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="kpi-num" style={{ fontSize: 20, marginTop: 2 }}>{value}</div>
    </div>
  );
}
