"use client";

import type { Unit, Match } from "@/lib/engine";

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
  const W = 640, H = 420, pad = 60;
  const pts = [district, ...units];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 0.1, spanLng = maxLng - minLng || 0.1;
  const px = (lng: number) => pad + ((lng - minLng) / spanLng) * (W - 2 * pad);
  const py = (lat: number) => pad + ((maxLat - lat) / spanLat) * (H - 2 * pad);

  const matchedSlugs = new Set((matched || []).map((m) => m.unitSlug));
  const dcx = px(district.lng), dcy = py(district.lat);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${district.name} district map`}>
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--surface-2)" />
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="13" fill="url(#grid)" />

      {routed && (matched || []).map((m) => (
        <line key={"r" + m.unitSlug} x1={dcx} y1={dcy} x2={px(m.lng)} y2={py(m.lat)}
          stroke="var(--brand)" strokeWidth="2" strokeDasharray="5 5" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
        </line>
      ))}

      {units.map((u) => {
        const active = routed && matchedSlugs.has(u.slug);
        const cx = px(u.lng), cy = py(u.lat);
        return (
          <g key={u.slug}>
            <circle cx={cx} cy={cy} r={active ? 9 : 7} fill={active ? "var(--brand)" : "var(--surface)"} stroke="var(--brand-deep)" strokeWidth="2" />
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

      <g>
        <circle cx={dcx} cy={dcy} r="13" fill="var(--alarm)" opacity="0.15" />
        <circle cx={dcx} cy={dcy} r="7" fill="var(--alarm)" stroke="#fff" strokeWidth="2" />
        <text x={dcx} y={dcy - 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--alarm-text)">
          {district.name} mandi
        </text>
      </g>
    </svg>
  );
}
