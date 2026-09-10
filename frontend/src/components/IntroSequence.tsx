"use client";

import { useEffect, useState } from "react";

// A ~4s cinematic entrance: (1) a line about the project, (2) a journey panning across the
// fields at dawn, (3) a fade into the main page. Plays once per browser session, skippable,
// and skipped entirely for users who prefer reduced motion.
const TOTAL = 4200;

export default function IntroSequence() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("ks_intro") === "1"; } catch {}
    if (reduced || seen) return;
    setShow(true);
    try { sessionStorage.setItem("ks_intro", "1"); } catch {}
    const t = setTimeout(() => setShow(false), TOTAL);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro-root" onClick={() => setShow(false)} aria-hidden>
      {/* the journey across the fields */}
      <svg className="intro-cam" viewBox="0 0 2000 620" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="isky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7f0e2" />
            <stop offset="55%" stopColor="#f2efe1" />
            <stop offset="100%" stopColor="#f7edcf" />
          </linearGradient>
          <radialGradient id="isun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe7a0" />
            <stop offset="45%" stopColor="#f6cf65" />
            <stop offset="100%" stopColor="#f6cf65" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="2000" height="620" fill="url(#isky)" />
        <g className="intro-sun">
          <circle cx="1420" cy="320" r="170" fill="url(#isun)" />
          <circle cx="1420" cy="320" r="58" fill="#f7c948" />
        </g>
        {/* panning field layers */}
        <g className="intro-field">
          <path d="M0 380 C 360 320, 720 360, 1080 340 C 1440 320, 1720 366, 2000 342 L2000 620 L0 620 Z" fill="#d6e6c9" />
          <path d="M0 440 C 420 390, 780 430, 1180 412 C 1560 396, 1780 434, 2000 420 L2000 620 L0 620 Z" fill="#b6d6a3" />
          <path d="M0 486 C 460 452, 900 486, 1360 478 C 1680 472, 1840 488, 2000 480 L2000 620 L0 620 Z" fill="var(--brand)" opacity="0.94" />
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 90 + i * 138, s = 1 + (i % 3) * 0.18;
            return (
              <g key={i} transform={`translate(${x} ${500 - (i % 2) * 8}) scale(${s})`} style={{ transformOrigin: "bottom", animation: `sway 4s ease-in-out ${(i % 5) * 0.3}s infinite` }}>
                <path d="M0 0 L0 -44" stroke="var(--brand-deep)" strokeWidth="2.4" strokeLinecap="round" />
                {[0, 1, 2, 3].map((k) => (
                  <g key={k} transform={`translate(0 ${-18 - k * 8})`}>
                    <path d="M0 0 q8 -5 11 -12" stroke="var(--brand-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M0 0 q-8 -5 -11 -12" stroke="var(--brand-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                ))}
                <circle cx="0" cy="-46" r="2.6" fill="var(--turmeric)" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* the line about the project */}
      <div className="intro-copy">
        <div className="intro-eyebrow">किसान सेतु · KISAN SETU</div>
        <div className="intro-title display">Saving the harvest before it’s lost.</div>
        <div className="intro-sub">A crop that would be dumped → a fair price for the farmer.</div>
      </div>

      <div className="intro-skip">tap to skip</div>

      <style>{`
        .intro-root {
          position: fixed; inset: 0; z-index: 100; overflow: hidden; cursor: pointer;
          background: linear-gradient(180deg,#e7f0e2,#f2efe1 55%,#f7edcf);
          animation: introOut .7s ease 3.5s forwards;
        }
        .intro-cam {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0; transform: scale(1.02);
          animation: camIn .8s ease 1.1s forwards, camPan 2.4s cubic-bezier(.4,0,.2,1) 1.5s forwards;
        }
        .intro-sun { transform: translateY(70px); opacity: 0; animation: sunUp 1.6s cubic-bezier(.2,.8,.2,1) 1.2s forwards; }
        .intro-copy {
          position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 24px; z-index: 2; color: var(--ink);
        }
        .intro-eyebrow { font-size: 12px; letter-spacing: .22em; font-weight: 600; color: var(--brand-deep); opacity: 0; animation: copyIn .7s ease .2s forwards; }
        .intro-title { font-size: clamp(26px,5vw,48px); font-weight: 700; margin-top: 14px; max-width: 720px; opacity: 0; animation: copyIn .8s cubic-bezier(.2,.7,.2,1) .45s forwards, copyOut .6s ease 2.1s forwards; }
        .intro-eyebrow { animation: copyIn .7s ease .2s forwards, copyOut .6s ease 2.1s forwards; }
        .intro-sub { font-size: 15px; color: var(--ink-2); margin-top: 12px; opacity: 0; animation: copyIn .8s ease .8s forwards, copyOut .6s ease 2.1s forwards; }
        .intro-skip { position: absolute; bottom: 20px; right: 22px; font-size: 11px; letter-spacing: .1em; color: var(--ink-3); z-index: 2; opacity: 0; animation: copyIn .6s ease 1.4s forwards; }
        @keyframes camIn { to { opacity: 1; transform: scale(1); } }
        @keyframes camPan { from { transform: translateX(0) scale(1); } to { transform: translateX(-13%) scale(1.08); } }
        @keyframes sunUp { to { transform: translateY(0); opacity: 1; } }
        @keyframes copyIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes copyOut { to { opacity: 0; transform: translateY(-12px); } }
        @keyframes introOut { to { opacity: 0; visibility: hidden; } }
        @keyframes sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @media (prefers-reduced-motion: reduce) { .intro-root { display: none; } }
      `}</style>
    </div>
  );
}
