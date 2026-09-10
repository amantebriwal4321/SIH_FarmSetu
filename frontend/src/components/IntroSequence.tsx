"use client";

import { useEffect, useState } from "react";

// A ~9s story that explains the app in five animated beats, then a "field grows up and wipes
// to the landing" nature transition. Skippable, plays once per session, skipped for reduced motion.
const BEAT = 1750;
const N = 5;
const TRANS = 1400;

export default function IntroSequence() {
  // capture "should we skip?" during render, BEFORE the effect sets the session flag —
  // otherwise React StrictMode's double-invoked effect would bail on its second run and
  // never re-arm the beat timers.
  const [skip] = useState(() => {
    if (typeof window === "undefined") return true;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("ks_intro") === "1"; } catch {}
    return Boolean(reduced || seen);
  });
  const [show, setShow] = useState(false);
  const [scene, setScene] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (skip) return;
    setShow(true);
    try { sessionStorage.setItem("ks_intro", "1"); } catch {}
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < N; i++) timers.push(setTimeout(() => setScene(i), i * BEAT));
    timers.push(setTimeout(() => setLeaving(true), N * BEAT));
    timers.push(setTimeout(() => setShow(false), N * BEAT + TRANS));
    return () => timers.forEach(clearTimeout);
  }, [skip]);

  if (!show) return null;
  const progress = leaving ? 100 : ((scene + 1) / N) * 100;

  return (
    <div className={`intro-root ${leaving ? "leaving" : ""}`} onClick={() => setShow(false)} aria-hidden>
      <div className="intro-bar"><span style={{ width: `${progress}%` }} /></div>

      {!leaving && (
        <div className="intro-stage" key={scene}>
          <div className="intro-art beat-in">{ART[scene]}</div>
          <div className="intro-cap beat-in-2">
            <div className="intro-title display">{COPY[scene].t}</div>
            {COPY[scene].s && <div className="intro-sub">{COPY[scene].s}</div>}
          </div>
        </div>
      )}

      {/* nature transition: the field grows up and wipes to the landing */}
      {leaving && (
        <div className="intro-grow">
          <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="intro-grow-crest">
            <path d="M0 140 C 150 40, 320 60, 480 44 C 680 24, 900 66, 1200 40 L1200 140 Z" fill="var(--brand)" />
          </svg>
          <div className="intro-grow-fill" />
        </div>
      )}

      <div className="intro-skip">tap to skip →</div>

      <style>{`
        .intro-root { position: fixed; inset: 0; z-index: 100; overflow: hidden; cursor: pointer;
          background: linear-gradient(180deg,#e9f1e4 0%, #f2efe1 55%, #f7edcf 100%); }
        .intro-root.leaving { animation: introOut .5s ease ${TRANS - 500}ms forwards; }
        .intro-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: rgba(20,35,26,.08); z-index: 3; }
        .intro-bar > span { display: block; height: 100%; background: var(--brand); transition: width .55s cubic-bezier(.4,0,.2,1); }
        .intro-stage { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; padding: 28px; text-align: center; z-index: 2; }
        .intro-art { width: min(340px, 74vw); height: 200px; display: flex; align-items: center; justify-content: center; }
        .intro-cap { max-width: 640px; }
        .intro-title { font-size: clamp(22px,4.4vw,40px); font-weight: 700; color: var(--ink); line-height: 1.12; }
        .intro-sub { font-size: 15px; color: var(--ink-2); margin-top: 10px; }
        .beat-in { opacity: 0; animation: beatIn .7s cubic-bezier(.2,.7,.2,1) .05s forwards; }
        .beat-in-2 { opacity: 0; animation: beatIn .7s cubic-bezier(.2,.7,.2,1) .28s forwards; }
        .intro-skip { position: absolute; bottom: 18px; right: 20px; font-size: 11px; letter-spacing: .08em; color: var(--ink-3); z-index: 3; }

        /* grow-up wipe (only during leaving) */
        .intro-grow { position: absolute; left: 0; right: 0; bottom: 0; height: 0; z-index: 4; pointer-events: none;
          animation: growUp ${TRANS - 300}ms cubic-bezier(.5,0,.3,1) forwards; }
        .intro-grow-crest { position: absolute; top: -22px; left: 0; width: 100%; height: 26px; display: block; }
        .intro-grow-fill { position: absolute; inset: 0; background: var(--brand); }

        @keyframes beatIn { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes growUp { from { height: 0; } to { height: 132%; } }
        @keyframes introOut { to { opacity: 0; visibility: hidden; } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes fall { 0% { transform: translateY(-70px); opacity: 0; } 60% { opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes wave { 0% { transform: scale(.5); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes rise { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .intro-root { display: none; } }
      `}</style>
    </div>
  );
}

const COPY = [
  { t: "Every year, India dumps ₹1.5 lakh crore of food.", s: "Perfectly good crops, left to rot." },
  { t: "When the harvest floods the market, the price crashes.", s: "The farmer can't even cover his cost — so he dumps it." },
  { t: "We send the surplus to nearby processing units — before it rots.", s: "Matched by distance and capacity, in seconds." },
  { t: "And we call the farmer, in their own language.", s: "No app, no reading — just a phone call." },
  { t: "Kisan Setu — saving the harvest, and the farmer's price.", s: "" },
];

// per-beat art (inline SVG)
const ART = [
  // 0 — crops tumbling into a dump
  <svg key="0" viewBox="0 0 200 160" width="220" height="176">
    <ellipse cx="100" cy="132" rx="78" ry="18" fill="var(--surface-2)" />
    {[[70, 118], [100, 122], [130, 118], [85, 104], [116, 104], [100, 90]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="15" fill="var(--alarm)" opacity="0.85" style={{ transformOrigin: `${x}px ${y}px`, animation: `pop .5s ease ${i * 0.08}s both` }} />
    ))}
    {[[60, 30], [140, 24], [100, 12]].map(([x, y], i) => (
      <circle key={"f" + i} cx={x} cy={y} r="12" fill="var(--alarm)" opacity="0.55" style={{ animation: `fall 1.1s ease ${0.4 + i * 0.2}s both` }} />
    ))}
  </svg>,
  // 1 — price crash
  <svg key="1" viewBox="0 0 220 150" width="240" height="164">
    <text x="34" y="46" fontSize="22" fill="var(--ink-3)" style={{ textDecoration: "line-through" }} className="mono">₹18</text>
    <polyline points="30,60 70,66 100,78 130,108 175,130" fill="none" stroke="var(--alarm)" strokeWidth="3.5" strokeLinecap="round"
      strokeDasharray="220" strokeDashoffset="220" style={{ animation: "draw 1s ease .2s forwards" }} />
    <g style={{ animation: "rise .7s ease .8s both" }}>
      <text x="120" y="70" fontSize="40" fontWeight="700" fill="var(--alarm-text)" className="kpi-num">₹3.82</text>
      <path d="M186 96 l0 26 m-9 -9 l9 9 l9 -9" stroke="var(--alarm)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>,
  // 2 — reroute: mandi -> units
  <svg key="2" viewBox="0 0 220 170" width="240" height="186">
    {[[40, 40], [180, 46], [30, 130], [190, 128], [110, 24]].map(([x, y], i) => (
      <line key={"l" + i} x1="110" y1="90" x2={x} y2={y} stroke="var(--brand)" strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray="200" strokeDashoffset="200" style={{ animation: `draw .6s ease ${0.2 + i * 0.14}s forwards` }} />
    ))}
    {[[40, 40], [180, 46], [30, 130], [190, 128], [110, 24]].map(([x, y], i) => (
      <circle key={"u" + i} cx={x} cy={y} r="10" fill="var(--brand)" style={{ transformOrigin: `${x}px ${y}px`, animation: `pop .4s ease ${0.5 + i * 0.14}s both` }} />
    ))}
    <circle cx="110" cy="90" r="14" fill="var(--alarm)" stroke="#fff" strokeWidth="3" />
  </svg>,
  // 3 — phone call in your language
  <svg key="3" viewBox="0 0 220 170" width="220" height="170">
    {[38, 58, 78].map((r, i) => (
      <circle key={i} cx="82" cy="86" r={r} fill="none" stroke="var(--brand)" strokeWidth="2.4" opacity="0.5"
        style={{ transformOrigin: "82px 86px", animation: `wave 1.6s ease ${i * 0.35}s infinite` }} />
    ))}
    <rect x="64" y="52" width="46" height="76" rx="10" fill="#0f3d24" />
    <text x="87" y="96" textAnchor="middle" fontSize="20" fill="#eafaf0">📞</text>
    <text x="160" y="66" fontSize="13" className="mono" fill="var(--ink-2)" style={{ animation: "rise .5s ease .3s both" }}>English</text>
    <text x="160" y="90" fontSize="13" className="deva" fill="var(--ink)" style={{ animation: "rise .5s ease .55s both" }}>हिंदी</text>
    <text x="160" y="114" fontSize="13" className="kn" fill="var(--ink)" style={{ animation: "rise .5s ease .8s both" }}>ಕನ್ನಡ</text>
  </svg>,
  // 4 — brand + sun
  <svg key="4" viewBox="0 0 220 160" width="240" height="172">
    <circle cx="110" cy="80" r="60" fill="var(--turmeric)" opacity="0.22" style={{ transformOrigin: "110px 80px", animation: "pop .8s ease both" }} />
    <g style={{ animation: "rise .7s ease .2s both" }}>
      <rect x="82" y="52" width="56" height="56" rx="15" fill="var(--brand)" />
      <path d="M92 96c8-13 28-13 36 0" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="96" y="96" width="4.5" height="9" rx="2" fill="#fff" />
      <rect x="120" y="96" width="4.5" height="9" rx="2" fill="#fff" />
      <circle cx="110" cy="72" r="4.5" fill="var(--turmeric)" />
    </g>
  </svg>,
];
