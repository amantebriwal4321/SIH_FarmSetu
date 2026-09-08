"use client";

import { useEffect, useRef, useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import AlertCard from "@/components/AlertCard";
import PriceChart from "@/components/PriceChart";
import SvgMap from "@/components/SvgMap";
import ImpactMeter from "@/components/ImpactMeter";
import RiskBadge from "@/components/RiskBadge";
import { speak, stopSpeak } from "@/lib/speak";
import { num, UNITS, type CropDetail, type Match, type MatchTotals } from "@/lib/engine";

const STEP_MS = 4000;

const STEPS = [
  { t: "Detect", c: "Kolar’s tomato price is collapsing — arrivals flooded the mandi and the price fell from ₹18 to ₹4/kg. The crash-risk score hits 100." },
  { t: "Route", c: "Kisan Setu instantly matches the surplus to the nearest processing units. Crop that would be dumped can now be saved instead." },
  { t: "Alert", c: "An alert leaves the officer’s console and travels to the farmer — as a voice call and SMS, in the farmer’s own language." },
  { t: "Listen", c: "The phone speaks the offer in Hindi. No app, no reading — the farmer just listens and taps once." },
  { t: "Confirmed", c: "The farmer accepts. The officer sees it confirmed. The crop becomes paste at a women’s unit — farmer paid, food saved." },
];

export default function FlowClient({
  detail, matches, totals, alert,
}: {
  detail: CropDetail; matches: Match[]; totals: MatchTotals; alert: { crop: string; english: string; hindi: string };
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // auto-advance
  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, step]);

  // phone speaks on the "Listen" step
  useEffect(() => {
    if (step === 3) speak(alert.hindi, "hi-IN");
    return () => stopSpeak();
  }, [step, alert.hindi]);

  const routed = step >= 1;
  const content = {
    cropName: detail.name, english: alert.english, hindi: alert.hindi,
    unitName: matches[0].unitName, offer: matches[0].offerPrice, crash: totals.crashPrice,
  };

  function go(n: number) {
    setPlaying(false);
    stopSpeak();
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  }
  function restart() { stopSpeak(); setStep(0); setPlaying(true); }

  return (
    <main className="mx-auto max-w-6xl w-full px-5 py-8 flex flex-col gap-6">
      {/* caption */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow">The full flow</span>
          <span className="faint" style={{ fontSize: 11 }}>· step {step + 1} of {STEPS.length}</span>
        </div>
        <h1 className="display" style={{ fontSize: "clamp(22px,3.2vw,30px)", fontWeight: 700 }}>
          {step + 1}. {STEPS[step].t}
        </h1>
        <p className="muted" style={{ fontSize: 16, marginTop: 8, maxWidth: 760, lineHeight: 1.55, minHeight: 52 }}>
          {STEPS[step].c}
        </p>
      </section>

      {/* scene */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* officer */}
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <div className="eyebrow">Officer console</div>
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 600, fontSize: 14 }}>{detail.name}</span>
              <RiskBadge label={detail.label} />
            </div>
          </div>
          <PriceChart series={detail.series} height={200} />
          <div className="mt-4" style={{ opacity: routed ? 1 : 0.35, transition: "opacity .5s" }}>
            <ImpactMeter active={routed} rupees={totals.rupeesSaved} kg={totals.kgRescued} units={totals.unitsEngaged} />
          </div>
          <div className="mt-4">
            <SvgMap district={{ lat: detail.districtLat, lng: detail.districtLng, name: detail.district }} units={UNITS} matched={matches} routed={routed} />
          </div>
          {step >= 4 && (
            <div className="panel p-3 mt-4" style={{ borderColor: "var(--brand)", color: "var(--brand-deep)", fontSize: 13, fontWeight: 600 }}>
              ✓ Confirmed — {num(Math.max(120, Math.round(detail.surplusTonnes * 1.7)))} farmers notified, 1 accepted live
            </div>
          )}
        </div>

        {/* travel + phone */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4">
          {step === 2 && (
            <div className="pill" style={{ fontSize: 13, animation: "pulse 1s ease-in-out infinite" }}>
              📨 alert travelling to the farmer…
            </div>
          )}
          <PhoneFrame height={460}>
            {step < 2 && <Waiting />}
            {step === 2 && <Ringing crop={detail.name} />}
            {step === 3 && <AlertCard a={content} status="pending" />}
            {step >= 4 && <AlertCard a={content} status="accepted" />}
          </PhoneFrame>
        </div>
      </section>

      {/* controls */}
      <section className="card p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => go(step - 1)} disabled={step === 0}>‹ Prev</button>
          <button className="btn btn-primary" onClick={() => (step >= STEPS.length - 1 ? restart() : setPlaying((p) => !p))}>
            {step >= STEPS.length - 1 ? "↻ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
          </button>
          <button className="btn" onClick={() => go(step + 1)} disabled={step >= STEPS.length - 1}>Next ›</button>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <button key={s.t} onClick={() => go(i)} aria-label={s.t}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 999, background: i <= step ? "var(--brand)" : "var(--border)", transition: "all .3s" }} />
            </button>
          ))}
        </div>
      </section>

      <style>{`@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}`}</style>
    </main>
  );
}

function Waiting() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 26, color: "var(--ink-2)" }}>
      <div style={{ fontSize: 34 }}>📞</div>
      <div className="display" style={{ fontSize: 18, fontWeight: 600, marginTop: 10, color: "var(--ink)" }}>Krishi Saathi</div>
      <p style={{ fontSize: 13, marginTop: 6 }}>Waiting for a price alert…</p>
    </div>
  );
}

function Ringing({ crop }: { crop: string }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 26, background: "linear-gradient(180deg,#0f3d24,#0a2416)", color: "#eafaf0" }}>
      <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: "0.1em" }}>INCOMING CALL</div>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginTop: 16, animation: "pulse 1s ease-in-out infinite" }}>📞</div>
      <div className="display" style={{ fontSize: 20, fontWeight: 700, marginTop: 14 }}>Krishi Saathi</div>
      <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{crop} price alert · voice</div>
    </div>
  );
}
