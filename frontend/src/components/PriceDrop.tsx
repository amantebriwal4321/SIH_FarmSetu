// A dead-simple price read — no line chart. "Was → Now", the % drop, and a plain risk bar.
export default function PriceDrop({
  were,
  now,
  risk,
}: {
  were: number;
  now: number;
  risk: number;
}) {
  const drop = Math.round(((were - now) / were) * 100);
  const riskColor = risk >= 66 ? "var(--alarm)" : risk >= 40 ? "var(--watch)" : "var(--brand)";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <div className="faint" style={{ fontSize: 12 }}>A month ago</div>
          <div className="kpi-num" style={{ fontSize: 24, color: "var(--ink-3)", textDecoration: "line-through" }}>₹{were}</div>
        </div>
        <svg width="30" height="24" viewBox="0 0 30 24" fill="none" stroke="var(--alarm)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 8l11 10 11-10" />
        </svg>
        <div>
          <div className="faint" style={{ fontSize: 12 }}>Today</div>
          <div className="kpi-num" style={{ fontSize: 30, color: "var(--alarm-text)" }}>₹{now}<span style={{ fontSize: 14 }}>/kg</span></div>
        </div>
        <div className="badge badge-high" style={{ fontSize: 14, padding: "6px 12px" }}>▼ {drop}%</div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="faint" style={{ fontSize: 12 }}>Crash risk</span>
          <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: riskColor }}>{Math.round(risk)}/100</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ width: `${risk}%`, height: "100%", background: riskColor, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}
