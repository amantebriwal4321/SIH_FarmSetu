// Emotional hero backdrop: a farmer's field at dawn — a rising sun, rolling hills,
// furrows, swaying wheat and drifting light. Pure SVG + CSS (respects reduced motion via
// the global prefers-reduced-motion rule). No client JS, no dependencies.

function Wheat({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ transformOrigin: "bottom", animation: `sway 4.2s ease-in-out ${delay}s infinite` }}>
      <path d="M0 0 L0 -46" stroke="var(--brand-deep)" strokeWidth="2.4" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0 ${-20 - i * 9})`}>
          <path d={`M0 0 q9 -5 12 -13`} stroke="var(--brand-deep)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d={`M0 0 q-9 -5 -12 -13`} stroke="var(--brand-deep)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="0" cy="-48" r="3" fill="var(--turmeric)" />
    </g>
  );
}

export default function FieldScene() {
  const wheat = [
    { x: 120, y: 470, s: 1.1, delay: 0 },
    { x: 300, y: 486, s: 1.35, delay: 0.6 },
    { x: 520, y: 476, s: 1.0, delay: 0.2 },
    { x: 760, y: 490, s: 1.4, delay: 0.9 },
    { x: 980, y: 478, s: 1.1, delay: 0.4 },
    { x: 1180, y: 486, s: 1.25, delay: 0.75 },
    { x: 1330, y: 472, s: 1.0, delay: 0.3 },
  ];
  const motes = [
    { x: 240, y: 300, d: 0 }, { x: 470, y: 220, d: 2 }, { x: 690, y: 340, d: 1 },
    { x: 900, y: 250, d: 3 }, { x: 1120, y: 300, d: 1.5 }, { x: 1290, y: 210, d: 2.5 },
  ];

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf2e6" />
            <stop offset="52%" stopColor="#f2efe1" />
            <stop offset="100%" stopColor="#f7efd8" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="40%" stopColor="#f6d271" />
            <stop offset="100%" stopColor="#f6d271" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1440" height="520" fill="url(#sky)" />

        {/* rising sun */}
        <g style={{ animation: "sunrise 2.4s cubic-bezier(.2,.8,.2,1) both" }}>
          <circle cx="1030" cy="300" r="150" fill="url(#sun)" style={{ animation: "glow 6s ease-in-out infinite" }} />
          <circle cx="1030" cy="300" r="52" fill="#f7c948" opacity="0.9" />
        </g>

        {/* rolling hills */}
        <path d="M0 360 C 260 300, 520 340, 760 320 C 1020 300, 1240 350, 1440 322 L1440 520 L0 520 Z" fill="#d6e6c9" />
        <path d="M0 410 C 300 360, 560 400, 840 384 C 1120 368, 1300 408, 1440 392 L1440 520 L0 520 Z" fill="#b6d6a3" />
        <path d="M0 452 C 320 420, 640 452, 980 444 C 1200 439, 1330 456, 1440 448 L1440 520 L0 520 Z" fill="var(--brand)" opacity="0.92" />

        {/* furrows on the front field (converging = a plowed field) */}
        <g stroke="var(--brand-deep)" strokeWidth="1.6" opacity="0.22">
          {[-360, -160, 60, 300, 560, 840, 1120, 1420, 1760].map((fx, i) => (
            <line key={i} x1={720} y1={470} x2={fx} y2={520} />
          ))}
        </g>

        {/* drifting light */}
        {motes.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r="3" fill="var(--turmeric)" opacity="0.55" style={{ animation: `drift 9s ease-in-out ${m.d}s infinite` }} />
        ))}

        {/* swaying wheat */}
        {wheat.map((w, i) => <Wheat key={i} {...w} />)}

        <style>{`
          @keyframes sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
          @keyframes drift { 0%{transform:translateY(0);opacity:.15} 50%{opacity:.6} 100%{transform:translateY(-40px);opacity:0} }
          @keyframes glow { 0%,100%{opacity:.85} 50%{opacity:1} }
          @keyframes sunrise { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
        `}</style>
      </svg>
      {/* soft fade so text stays readable over the scene */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(244,247,244,.55) 0%, rgba(244,247,244,.15) 34%, rgba(244,247,244,0) 60%)" }} />
    </div>
  );
}
