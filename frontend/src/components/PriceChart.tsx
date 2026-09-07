"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SeriesPoint } from "@/lib/api";

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function PriceChart({ series }: { series: SeriesPoint[] }) {
  const data = series.map((p) => ({ ...p, label: fmtDate(p.date) }));
  const tick = { fontSize: 11, fill: "var(--ink-2)" };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={tick} interval={9} tickLine={false} axisLine={{ stroke: "var(--border)" }} minTickGap={20} />
        <YAxis yAxisId="price" tick={tick} tickLine={false} axisLine={false} width={38}
          label={{ value: "₹/kg", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--ink-3)" }} />
        <YAxis yAxisId="risk" orientation="right" domain={[0, 100]} tick={tick} tickLine={false} axisLine={false} width={34} />
        <YAxis yAxisId="arr" hide domain={[0, "dataMax"]} />
        <Tooltip
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: "var(--ink-2)", fontWeight: 600 }}
          formatter={(v: number, name: string) => {
            if (name === "Price") return [`₹${v}/kg`, name];
            if (name === "Arrivals") return [`${Math.round(v)} t`, name];
            return [`${v}`, name];
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
        <Area yAxisId="arr" dataKey="arrivals" name="Arrivals" fill="var(--brand)" fillOpacity={0.1} stroke="var(--brand)" strokeOpacity={0.35} strokeWidth={1} />
        <Line yAxisId="price" dataKey="price" name="Price" stroke="var(--ink)" strokeWidth={2.4} dot={false} />
        <Line yAxisId="risk" dataKey="risk" name="Crash risk" stroke="var(--high)" strokeWidth={2.2} strokeDasharray="4 3" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
