"use client";

import { speak, stopSpeak, canSpeak } from "@/lib/speak";

export type AlertContent = {
  cropName: string;
  english: string;
  hindi: string;
  unitName: string;
  offer: number;
  crash: number;
};

export default function AlertCard({
  a,
  status,
  onAccept,
  onDecline,
}: {
  a: AlertContent;
  status: "pending" | "accepted" | "declined";
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  if (status === "accepted") {
    return (
      <Screen tone="ok">
        <div style={{ fontSize: 40 }}>✓</div>
        <div className="display" style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>Booked</div>
        <p style={{ fontSize: 14, marginTop: 8, opacity: 0.92 }}>
          Bring your {a.cropName.toLowerCase()} to <b>{a.unitName}</b>. You’ll get <b>₹{a.offer}/kg</b>.
        </p>
        <p className="deva" style={{ fontSize: 13, marginTop: 10, opacity: 0.85 }}>
          बुकिंग हो गई। अपनी फसल {a.unitName} ले जाइए। ₹{a.offer}/किलो मिलेगा।
        </p>
      </Screen>
    );
  }
  if (status === "declined") {
    return (
      <Screen tone="muted">
        <div style={{ fontSize: 34 }}>—</div>
        <div className="display" style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>Okay, not now</div>
        <p style={{ fontSize: 13, marginTop: 8, opacity: 0.8 }}>We’ll alert you if a better price comes up.</p>
      </Screen>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: "#0f3d24", color: "#eafaf0", padding: "22px 16px 14px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", opacity: 0.7 }}>KRISHI SAATHI · PRICE ALERT</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>
          {a.cropName} price crashing
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>Mandi is paying only ₹{a.crash}/kg today</div>
      </div>

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="panel" style={{ padding: 12 }}>
          <div className="faint" style={{ fontSize: 11 }}>Don’t dump it — sell here instead</div>
          <div style={{ fontWeight: 600, marginTop: 3 }}>{a.unitName}</div>
          <div className="kpi-num" style={{ fontSize: 26, color: "var(--brand-deep)", marginTop: 2 }}>₹{a.offer}/kg</div>
        </div>
        <p className="deva" style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{a.hindi}</p>

        {canSpeak() && (
          <button className="btn btn-ghost" style={{ alignSelf: "flex-start", padding: "8px 14px", fontSize: 13 }}
            onClick={() => speak(a.hindi, "hi-IN")}>
            🔊 Play message
          </button>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" style={{ flex: 1 }} onClick={() => { stopSpeak(); onDecline?.(); }}>
            Not now
          </button>
          <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => { stopSpeak(); onAccept?.(); }}>
            Accept · हाँ
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen({ children, tone }: { children: React.ReactNode; tone: "ok" | "muted" }) {
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "28px 22px",
      background: tone === "ok" ? "linear-gradient(180deg,#eafaf0,#ffffff)" : "#fff",
      color: tone === "ok" ? "var(--brand-deep)" : "var(--ink-2)",
    }}>
      {children}
    </div>
  );
}
