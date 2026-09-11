"use client";

// Presentational only — receives already-fetched data as props (the fetch happens in a
// server component, so the API key never reaches the browser). Types are declared here
// so this client component imports nothing from the server-only liveprices module.
type Row = { market: string; district: string; pricePerKg: number; min: number; max: number; date: string; kolar: boolean };
export type LivePricesData = { live: boolean; fetchedAt: string; commodity: string; rows: Row[] };

export default function LivePrices({ live }: { live: LivePricesData }) {
  const { rows, fetchedAt, commodity } = live;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="eyebrow">Live mandi prices · {commodity}</div>
        {live.live ? (
          <span className="badge badge-stable"><span className="badge-dot" />LIVE · Agmarknet</span>
        ) : (
          <span className="pill" style={{ fontSize: 11 }}>recent snapshot</span>
        )}
      </div>
      <div className="faint" style={{ fontSize: 11.5, marginBottom: 8 }}>Karnataka markets · {fetchedAt}</div>

      <div className="flex flex-col">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between" style={{ padding: "7px 0", borderBottom: "1px solid var(--dash-line)" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.market}</span>
                {r.kolar && <span className="badge badge-stable" style={{ fontSize: 9.5, padding: "1px 7px", flexShrink: 0 }}>Kolar</span>}
              </div>
              <div className="faint" style={{ fontSize: 11 }}>{r.district}</div>
            </div>
            <div className="mono" style={{ fontWeight: 700, fontSize: 15, flexShrink: 0, paddingLeft: 8 }}>
              ₹{r.pricePerKg}<span className="faint" style={{ fontSize: 11, fontWeight: 400 }}>/kg</span>
            </div>
          </div>
        ))}
      </div>

      <div className="faint" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
        Source: <b>data.gov.in · Agmarknet</b> daily prices. Today’s prices are live; the 60-day crash curve is a modelled replay.
      </div>
    </div>
  );
}
