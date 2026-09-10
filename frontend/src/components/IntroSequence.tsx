"use client";

import { useState, useEffect } from "react";

// A continuous ~14s walk-through of the countryside — fields → mandi → processing units →
// village → a bright dawn field — with captions arriving as you pass each place, then a fade
// into the landing. Skippable, once per session, skipped for reduced motion.
const TOTAL = 14500;

export default function IntroSequence() {
  const [skip] = useState(() => {
    if (typeof window === "undefined") return true;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("ks_intro") === "1"; } catch {}
    return Boolean(reduced || seen);
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (skip) return;
    setShow(true);
    try { sessionStorage.setItem("ks_intro", "1"); } catch {}
    const t = setTimeout(() => setShow(false), TOTAL);
    return () => clearTimeout(t);
  }, [skip]);

  if (!show) return null;

  const caps = [
    { t: "Every year, India dumps ₹1.5 lakh crore of food.", s: "Perfectly good crops, left to rot." },
    { t: "When the harvest floods the market, the price crashes.", s: "The farmer can't even cover his cost." },
    { t: "So we send the surplus to nearby processing units.", s: "Matched by distance and capacity, before it rots." },
    { t: "And we call the farmer, in their own language.", s: "No app, no reading — just a phone call." },
    { t: "Kisan Setu — saving the harvest, and the farmer's price.", s: "" },
  ];

  return (
    <div className="intro-root" onClick={() => setShow(false)} aria-hidden>
      <div className="intro-sky" />
      <Sun />

      {/* the travelling world */}
      <svg className="intro-far" viewBox="0 0 6000 560" preserveAspectRatio="xMinYMax slice">
        <path d="M0 300 C 400 250, 800 290, 1200 270 C 1700 246, 2200 296, 2800 270 C 3600 250, 4400 296, 5200 268 C 5600 258, 5900 280, 6000 272 L6000 560 L0 560 Z" fill="#cfe3c2" opacity="0.75" />
      </svg>

      <svg className="intro-world" viewBox="0 0 5600 560" preserveAspectRatio="xMinYMax slice">
        {/* rolling ground the whole way */}
        <path d="M0 430 C 500 405, 1000 430, 1500 420 C 2200 408, 2800 432, 3600 422 C 4300 414, 5000 432, 5600 424 L5600 560 L0 560 Z" fill="#bcdba7" />
        <path d="M0 470 C 700 452, 1600 474, 2600 466 C 3600 458, 4700 476, 5600 468 L5600 560 L0 560 Z" fill="var(--brand)" opacity="0.9" />
        {/* a dirt path the walker follows */}
        <path d="M0 540 C 1200 520, 2400 536, 3600 524 C 4600 516, 5200 534, 5600 528" stroke="#e6d6b4" strokeWidth="26" fill="none" opacity="0.8" />

        {trees([250, 780, 1650, 2500, 3250, 4150, 5050])}

        {/* station 1 — a field of dumped crops */}
        <g transform="translate(1000 0)">
          {rows(0, 420)}
          <ellipse cx="150" cy="430" rx="70" ry="15" fill="#d8b9a0" opacity="0.5" />
          {[[120, 420], [150, 424], [180, 420], [135, 408], [166, 408], [150, 396]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="13" fill="var(--alarm)" opacity="0.85" />
          ))}
        </g>

        {/* station 2 — the mandi stall + crashing price board */}
        <g transform="translate(1950 0)">
          <rect x="70" y="360" width="150" height="70" fill="#e7d3ac" />
          <path d="M55 360 L145 320 L235 360 Z" fill="#b5763a" />
          <rect x="250" y="336" width="120" height="70" rx="6" fill="#fff" stroke="var(--dash-line)" />
          <text x="310" y="366" textAnchor="middle" fontSize="16" fill="var(--ink-3)" className="mono" style={{ textDecoration: "line-through" }}>₹18</text>
          <text x="310" y="394" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--alarm-text)" className="kpi-num">₹3.82</text>
        </g>

        {/* station 3 — two processing units + arrows */}
        <g transform="translate(2820 0)">
          {[0, 200].map((dx, i) => (
            <g key={i} transform={`translate(${dx} 0)`}>
              <rect x="60" y="352" width="96" height="78" fill="#d9e6cf" stroke="var(--brand-deep)" strokeWidth="2" />
              <rect x="92" y="326" width="18" height="28" fill="#b9c7ad" />
              <path d="M70 352 L108 336 L146 352" fill="var(--brand)" />
            </g>
          ))}
          <path d="M20 470 q120 -40 210 -110" stroke="var(--brand-deep)" strokeWidth="3" fill="none" markerEnd="url(#iar)" opacity="0.8" />
          <defs><marker id="iar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--brand-deep)" /></marker></defs>
        </g>

        {/* station 4 — a village hut with a ringing phone */}
        <g transform="translate(3700 0)">
          <rect x="80" y="372" width="120" height="58" fill="#e7d3ac" />
          <path d="M64 372 L140 330 L216 372 Z" fill="#b5763a" />
          <rect x="122" y="398" width="36" height="32" fill="#8a6b3f" />
          {[26, 40, 54].map((r, i) => (
            <circle key={i} cx="266" cy="392" r={r} fill="none" stroke="var(--brand)" strokeWidth="2.4" opacity="0.5"
              style={{ transformOrigin: "266px 392px", animation: `wave 1.6s ease ${i * 0.4}s infinite` }} />
          ))}
          <rect x="254" y="372" width="24" height="40" rx="6" fill="#0f3d24" />
          <text x="266" y="398" textAnchor="middle" fontSize="12" fill="#eafaf0">📞</text>
        </g>

        {/* station 5 — a bright field + brand */}
        <g transform="translate(4560 0)">
          {wheatRow(0, 430)}
        </g>
      </svg>

      {/* the walker (stays centred; world moves behind) */}
      <svg className="intro-walker" viewBox="0 0 80 120" width="66" height="99">
        <g style={{ transformOrigin: "40px 118px", animation: "bob .55s ease-in-out infinite" }}>
          <ellipse cx="40" cy="34" rx="20" ry="6" fill="var(--ink)" />
          <circle cx="40" cy="30" r="11" fill="var(--ink)" />
          <path d="M28 46 q12 -8 24 0 l-3 44 h-18 z" fill="var(--brand-deep)" />
          <line x1="34" y1="90" x2="30" y2="116" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: "34px 90px", animation: "legA .55s ease-in-out infinite" }} />
          <line x1="46" y1="90" x2="50" y2="116" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: "46px 90px", animation: "legB .55s ease-in-out infinite" }} />
          <line x1="52" y1="60" x2="64" y2="118" stroke="#7a5a2f" strokeWidth="3.4" strokeLinecap="round" />
        </g>
      </svg>

      {/* captions arrive as we pass each place */}
      <div className="intro-caps">
        {caps.map((c, i) => (
          <div key={i} className="intro-cap" style={{ animation: `capCycle 3s ease ${0.4 + i * 2.7}s both` }}>
            <div className="intro-title display">{c.t}</div>
            {c.s && <div className="intro-sub">{c.s}</div>}
          </div>
        ))}
      </div>

      <div className="intro-skip">tap to skip →</div>

      <style>{`
        .intro-root { position: fixed; inset: 0; z-index: 100; overflow: hidden; cursor: pointer;
          animation: introOut .8s ease ${TOTAL - 800}ms forwards; }
        .intro-sky { position: absolute; inset: 0; background: linear-gradient(180deg,#e3eede 0%,#eef0e2 46%,#f8eccf 100%);
          animation: skyShift 14s ease forwards; }
        .intro-far { position: absolute; left: 0; bottom: 0; height: 62vh; min-height: 320px; width: auto;
          animation: panFar 12.8s cubic-bezier(.36,0,.24,1) forwards; }
        .intro-world { position: absolute; left: 0; bottom: 0; height: 70vh; min-height: 380px; width: auto;
          animation: panWorld 12.8s cubic-bezier(.36,0,.24,1) forwards; }
        .intro-walker { position: absolute; left: 50%; bottom: 8vh; transform: translateX(-50%); z-index: 3; }
        .intro-caps { position: absolute; left: 0; right: 0; top: 16%; display: flex; justify-content: center; z-index: 4; padding: 0 24px; }
        .intro-cap { position: absolute; text-align: center; max-width: 680px; opacity: 0; }
        .intro-title { font-size: clamp(22px,4.2vw,38px); font-weight: 700; color: var(--ink); line-height: 1.14; }
        .intro-sub { font-size: 15px; color: var(--ink-2); margin-top: 10px; }
        .intro-skip { position: absolute; bottom: 18px; right: 20px; font-size: 11px; letter-spacing: .08em; color: var(--ink-3); z-index: 5; }

        @keyframes panWorld { from { transform: translateX(0); } to { transform: translateX(calc(100vw - 700vh)); } }
        @keyframes panFar { from { transform: translateX(0); } to { transform: translateX(calc((100vw - 700vh) * 0.45)); } }
        @keyframes skyShift { 0% { filter: hue-rotate(-6deg) saturate(.95); } 60% { filter: none; } 100% { filter: brightness(1.03); } }
        @keyframes capCycle { 0% { opacity: 0; transform: translateY(16px); } 16% { opacity: 1; transform: none; } 78% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-12px); } }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes legA { 0%,100% { transform: rotate(14deg); } 50% { transform: rotate(-14deg); } }
        @keyframes legB { 0%,100% { transform: rotate(-14deg); } 50% { transform: rotate(14deg); } }
        @keyframes wave { 0% { transform: scale(.5); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes introOut { to { opacity: 0; visibility: hidden; } }
        @media (prefers-reduced-motion: reduce) { .intro-root { display: none; } }
      `}</style>
    </div>
  );
}

function Sun() {
  return (
    <svg className="intro-sun" viewBox="0 0 200 200" width="220" height="220"
      style={{ position: "absolute", right: "16%", top: "10%", zIndex: 0, animation: "sunUp 3s cubic-bezier(.2,.8,.2,1) both" }}>
      <defs><radialGradient id="isun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe7a0" /><stop offset="42%" stopColor="#f6cf65" /><stop offset="100%" stopColor="#f6cf65" stopOpacity="0" /></radialGradient></defs>
      <circle cx="100" cy="100" r="98" fill="url(#isun)" />
      <circle cx="100" cy="100" r="34" fill="#f7c948" />
      <style>{`@keyframes sunUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </svg>
  );
}

function trees(xs: number[]) {
  return xs.map((x, i) => (
    <g key={i} transform={`translate(${x} 0)`} style={{ transformOrigin: `${x + 14}px 430px`, animation: `bob 4s ease-in-out ${(i % 4) * 0.5}s infinite` }}>
      <rect x="10" y="392" width="8" height="44" rx="3" fill="#7a5a2f" />
      <circle cx="14" cy="384" r="24" fill="#8fc078" />
      <circle cx="0" cy="392" r="16" fill="#9dcb86" />
      <circle cx="28" cy="392" r="16" fill="#9dcb86" />
    </g>
  ));
}

function rows(x: number, y: number) {
  return (
    <g stroke="var(--brand-deep)" strokeWidth="1.4" opacity="0.25">
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={x - 40 + i * 20} y1={y + 20} x2={x - 120 + i * 60} y2={y + 70} />)}
    </g>
  );
}

function wheatRow(x: number, y: number) {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const wx = x + 20 + i * 62;
        return (
          <g key={i} transform={`translate(${wx} ${y}) scale(1.1)`} style={{ transformOrigin: "bottom", animation: `sway 4s ease-in-out ${(i % 4) * 0.3}s infinite` }}>
            <path d="M0 0 L0 -40" stroke="var(--brand-deep)" strokeWidth="2.2" strokeLinecap="round" />
            {[0, 1, 2].map((k) => (
              <g key={k} transform={`translate(0 ${-16 - k * 8})`}>
                <path d="M0 0 q7 -4 10 -11" stroke="var(--brand-deep)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M0 0 q-7 -4 -10 -11" stroke="var(--brand-deep)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </g>
            ))}
            <circle cx="0" cy="-42" r="2.4" fill="var(--turmeric)" />
          </g>
        );
      })}
      <style>{`@keyframes sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }`}</style>
    </g>
  );
}
