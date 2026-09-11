"use client";

import { useEffect, useState } from "react";
import DashShell from "@/components/dash/DashShell";
import KpiCard from "@/components/dash/KpiCard";
import PriceDrop from "@/components/PriceDrop";
import SvgMap from "@/components/SvgMap";
import RiskBadge, { riskColor } from "@/components/RiskBadge";
import QRCodeView from "@/components/QRCodeView";
import ValueChain from "@/components/ValueChain";
import LivePrices, { type LivePricesData } from "@/components/LivePrices";
import Toast from "@/components/Toast";
import { sendDispatch, onConfirm, type PickupFarmer } from "@/lib/dispatch";
import { inr, num, type CropSummary, type CropDetail, type Match, type MatchTotals, type Unit, type AlertBundle } from "@/lib/engine";

type Detail = { detail: CropDetail; matches: Match[]; totals: MatchTotals; alert: AlertBundle };
type Overview = {
  district: string; cropsTracked: number; cropsAtRisk: number; kgAtRisk: number;
  potentialRupeesSaved: number; unitsAvailable: number; buyers: number; farmersReached: number;
};

export default function AdminConsole({
  overview, crops, units, details, qrBase, isLan, live,
}: {
  overview: Overview; crops: CropSummary[]; units: Unit[]; details: Record<string, Detail>; qrBase: string; isLan: boolean; live: LivePricesData;
}) {
  const [selected, setSelected] = useState(crops[0]?.slug);
  const [routed, setRouted] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [pickups, setPickups] = useState<PickupFarmer[]>([]);

  const d = details[selected];
  const farmers = Math.max(120, Math.round(d.detail.surplusTonnes * 1.7));

  useEffect(() => { setRouted(false); setConfirmed(false); setPickups([]); }, [selected]);
  useEffect(() => onConfirm((p) => {
    if (p.status === "accepted") {
      setConfirmed(true);
      if (p.farmer) setPickups((prev) => [p.farmer!, ...prev].slice(0, 12));
    }
  }), []);

  function routeIt() {
    const best = d.matches[0];
    setRouted(true);
    setConfirmed(false);
    if (best) {
      sendDispatch({
        id: `${selected}-${Date.now()}`, cropSlug: selected, cropNames: d.alert.cropNames,
        unitName: best.unitName, offer: best.offerPrice, crash: d.totals.crashPrice, farmers,
        productName: d.alert.productName, productPrice: d.alert.productPrice,
        collectionPoint: d.alert.collectionPoint, unitPhone: d.alert.unitPhone,
        texts: d.alert.texts, ts: Date.now(), status: "pending",
      });
    }
    setToast(`Alert sent to ${num(farmers)} farmers`);
  }

  const farmerUrl = `${qrBase}/farmer?crop=${selected}&auto=1`;

  return (
    <DashShell title="Overview" subtitle="Spot a crop about to crash, then route the surplus before it’s dumped." active="overview">
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard filled label="Rupees rescuable" value={inr(overview.potentialRupeesSaved)} caption="this week, vs dumping" />
        <KpiCard label="Crops at risk" value={String(overview.cropsAtRisk)} caption={`of ${overview.cropsTracked} tracked`} />
        <KpiCard label="Surplus at risk" value={num(Math.round(overview.kgAtRisk / 1000)) + " t"} caption="about to flood the mandi" />
        <KpiCard label="Farmers reachable" value={num(overview.farmersReached)} caption="by phone, in their language" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* selected crop */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <h2 className="display" style={{ fontSize: 22, fontWeight: 700 }}>{d.detail.name}</h2>
                <RiskBadge label={d.detail.label} />
              </div>
              {!routed
                ? <button className="btn btn-primary" onClick={routeIt}>Alert farmers & route surplus →</button>
                : <button className="btn" onClick={() => setRouted(false)}>Reset</button>}
            </div>

            <PriceDrop were={d.detail.series[0].price} now={d.detail.latestPrice} risk={d.detail.risk} />

            {!routed ? (
              <p style={{ fontSize: 15.5, marginTop: 18, lineHeight: 1.6 }}>
                <b>{num(d.detail.surplusTonnes)} t</b> of {d.detail.name.toLowerCase()} is about to be dumped.
                Routing it now saves about <b style={{ color: "var(--brand-deep)" }}>{inr(d.totals.rupeesSaved)}</b> and
                reaches <b>{num(farmers)}</b> farmers with a fair price of ₹{d.totals.offerPrice}/kg.
              </p>
            ) : (
              <p style={{ fontSize: 15.5, marginTop: 18, lineHeight: 1.6 }}>
                Done. <b>{num(d.totals.tonnesMatched)} t</b> is now going to <b>{d.totals.unitsEngaged}</b> nearby
                units at <b style={{ color: "var(--brand-deep)" }}>₹{d.totals.offerPrice}/kg</b> — instead of the
                ₹{d.totals.crashPrice} mandi crash. <b>{num(farmers)}</b> farmers were alerted by phone.
              </p>
            )}
          </div>

          {routed && (
            <div className="card p-6">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Big label="Rupees saved" value={inr(d.totals.rupeesSaved)} accent="var(--brand-deep)" />
                <Big label="Kg rescued" value={num(d.totals.kgRescued)} />
                <Big label="Units that took it" value={String(d.totals.unitsEngaged)} />
              </div>
              <div className="mb-5">
                <ValueChain crash={d.totals.crashPrice} offer={d.totals.offerPrice} productName={d.alert.productName} productPrice={d.alert.productPrice} cropSlug={d.alert.cropSlug} lang="en" />
              </div>
              {pickups.length > 0 ? (
                <div className="panel p-4 mb-4" style={{ borderColor: "var(--brand)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--brand-deep)" }}>✓ Confirmed pickups ({pickups.length})</div>
                    <div className="faint" style={{ fontSize: 11.5 }}>who to expect at the collection point</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {pickups.map((f, i) => (
                      <div key={i} className="flex items-center justify-between" style={{ fontSize: 13.5 }}>
                        <span style={{ fontWeight: 600 }}>{f.name} <span className="faint" style={{ fontWeight: 400 }}>· {f.village}</span></span>
                        <span className="mono" style={{ fontWeight: 600 }}>{f.tonnes} t</span>
                      </div>
                    ))}
                  </div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                    Committed so far: <b style={{ color: "var(--brand-deep)" }}>{pickups.reduce((a, f) => a + f.tonnes, 0).toFixed(1)} t</b> — the FPO van routes through these villages.
                  </div>
                </div>
              ) : confirmed ? (
                <div className="panel p-3 mb-4" style={{ borderColor: "var(--brand)", color: "var(--brand-deep)", fontSize: 13, fontWeight: 600 }}>
                  ✓ A farmer just accepted — the deal is confirmed.
                </div>
              ) : null}
              <SvgMap district={{ lat: d.detail.districtLat, lng: d.detail.districtLng, name: d.detail.district }} units={units} matched={d.matches} routed />
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

          <LivePrices live={live} />

          {routed && (
            <div className="card p-5 flex flex-col items-center text-center">
              <div className="eyebrow" style={{ alignSelf: "flex-start" }}>Deliver to a farmer’s phone</div>
              <div className="my-3"><QRCodeView url={farmerUrl} size={150} /></div>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>
                Scan with a phone{isLan ? " on the same Wi-Fi" : ""} — it opens the farmer’s app, rings and speaks this alert.
              </p>
              <div className="mono faint" style={{ fontSize: 10.5, marginTop: 8, wordBreak: "break-all" }}>{farmerUrl}</div>
            </div>
          )}
        </div>
      </section>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </DashShell>
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
