"use client";

import { useEffect, useState } from "react";

type Row = {
  market: string;
  district: string;
  pricePerKg: number;
  min: number;
  max: number;
  date: string;
  kolar: boolean;
};

export type LivePricesData = {
  live: boolean;
  fetchedAt: string;
  commodity: string;
  rows: Row[];
};

export default function LivePrices({ live }: { live: LivePricesData }) {
  const [data, setData] = useState<LivePricesData>(live);

  useEffect(() => {
    setData(live);
    // If initial SSR rendered snapshot for instant page speed, upgrade to live in background
    if (!live.live) {
      fetch(`/api/liveprices?commodity=${encodeURIComponent(live.commodity)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.live) setData(d);
        })
        .catch(() => {});
    }
  }, [live]);

  const { rows, fetchedAt, commodity } = data;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="eyebrow">Live mandi prices · {commodity}</div>
        {data.live ? (
          <span className="badge badge-stable">
            <span className="badge-dot" />
            LIVE · Agmarknet
          </span>
        ) : (
          <span className="pill" style={{ fontSize: 11 }}>
            recent snapshot
          </span>
        )}
      </div>
      <div className="faint" style={{ fontSize: 11.5, marginBottom: 8 }}>
        Karnataka markets · {fetchedAt}
      </div>

      <div className="flex flex-col">
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between"
            style={{ padding: "7px 0", borderBottom: "1px solid var(--dash-line)" }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.market}
                </span>
                {r.kolar && (
                  <span
                    className="badge badge-stable"
                    style={{ fontSize: 9.5, padding: "1px 7px", flexShrink: 0 }}
                  >
                    Kolar
                  </span>
                )}
              </div>
              <div className="faint" style={{ fontSize: 11 }}>
                {r.district}
              </div>
            </div>
            <div
              className="mono"
              style={{ fontWeight: 700, fontSize: 15, flexShrink: 0, paddingLeft: 8 }}
            >
              ₹{r.pricePerKg}
              <span className="faint" style={{ fontSize: 11, fontWeight: 400 }}>
                /kg
              </span>
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
