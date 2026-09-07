"use client";

import type { Unit, Match } from "@/lib/api";

type Pt = { lat: number; lng: number };

export default function SvgMap({
  district,
  units,
  matched,
  routed,
}: {
  district: { lat: number; lng: number; name: string };
  units: Unit[];
  matched?: Match[];
  routed?: boolean;
}) {
  const W = 640;
  const H = 420;
  const pad = 60;

  const pts: Pt[] = [district, ...units];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 0.1;
  const spanLng = maxLng - minLng || 0.1;

  const px = (lng: number) => pad + ((lng - minLng) / spanLng) * (W - 2 * pad);
  const py = (lat: number) => pad + ((maxLat - lat) / spanLat) * (H - 2 * pad);

  const matchedSlugs = new Set((matched || []).map((m) => m.unit_slug));
  const dcx = px(district.lng);
  const dcy = py(district.lat);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="District map">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--surface-2)" />
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="13" fill="url(#grid)" />

      {/* routes from district to matched units */}
      {routed &&
        (matched || []).map((m) => (
          <line
            key={"r" + m.unit_slug}
            x1={dcx}
            y1={dcy}
            x2={px(m.lng)}
            y2={py(m.lat)}
            stroke="var(--brand)"
            strokeWidth="2"
            strokeDasharray="5 5"
            opacity="0.8"
          >
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
          </line>
        ))}

      {/* units */}
      {units.map((u) => {
        const isMatched = matchedSlugs.has(u.slug);
        const active = routed && isMatched;
        const cx = px(u.lng);
        const cy = py(u.lat);
        return (
          <g key={u.slug}>
            <circle
              cx={cx}
              cy={cy}
              r={active ? 9 : 7}
              fill={active ? "var(--brand)" : "var(--surface)"}
              stroke="var(--brand-deep)"
              strokeWidth="2"
            />
            {active && (
              <circle cx={cx} cy={cy} r="9" fill="none" stroke="var(--brand)" strokeWidth="2">
                <animate attributeName="r" from="9" to="18" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fill="var(--ink-2)" className="mono">
              {u.name.split(" ")[0]}
            </text>
          </g>
        );
      })}

      {/* district (the crashing market) */}
      <g>
        <circle cx={dcx} cy={dcy} r="13" fill="var(--high)" opacity="0.15" />
        <circle cx={dcx} cy={dcy} r="7" fill="var(--high)" stroke="#fff" strokeWidth="2" />
        <text x={dcx} y={dcy - 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--high-text)">
          {district.name} mandi
        </text>
      </g>
    </svg>
  );
}
