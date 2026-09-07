"use client";

import { useState } from "react";
import type { AlertText } from "@/lib/api";

export default function PhoneView({ alert }: { alert: AlertText }) {
  const [mode, setMode] = useState<"call" | "sms">("call");

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="eyebrow">What the farmer actually sees</div>
          <div className="muted" style={{ fontSize: 13 }}>
            No app. No reading. A basic ₹800 phone is enough.
          </div>
        </div>
        <div className="flex gap-1 p-1" style={{ background: "var(--surface-2)", borderRadius: 999, border: "1px solid var(--border)" }}>
          <Tab label="Voice call" active={mode === "call"} onClick={() => setMode("call")} />
          <Tab label="SMS" active={mode === "sms"} onClick={() => setMode("sms")} />
        </div>
      </div>

      <div className="flex justify-center">
        <div style={phoneFrame}>
          <div style={notch} />
          {mode === "call" ? <CallScreen alert={alert} /> : <SmsScreen alert={alert} />}
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 12px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        background: active ? "var(--surface)" : "transparent",
        color: active ? "var(--ink)" : "var(--ink-2)",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,.08)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function CallScreen({ alert }: { alert: AlertText }) {
  return (
    <div style={{ ...screen, background: "linear-gradient(180deg,#0f3d24,#0a2416)", color: "#eafaf0", padding: "26px 18px 20px" }}>
      <div style={{ textAlign: "center", fontSize: 12, opacity: 0.7, letterSpacing: "0.06em" }}>
        INCOMING VOICE ALERT
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
        <div style={avatar}>📞</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>Krishi Saathi</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>Govt price helpline · voice</div>
      </div>

      <div style={{ ...bubbleDark, marginTop: 18 }}>
        <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 4 }}>🔊 Speaking in your language</div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{alert.hindi}</div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 14 }}>
        <CallBtn color="#e4483d" glyph="✕" label="Decline" />
        <CallBtn color="#1fbf5a" glyph="✓" label="Answer" />
      </div>
    </div>
  );
}

function SmsScreen({ alert }: { alert: AlertText }) {
  return (
    <div style={{ ...screen, background: "#e7ece7" }}>
      <div style={{ background: "#075e54", color: "#fff", padding: "22px 14px 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ ...avatar, width: 34, height: 34, fontSize: 16, marginTop: 0 }}>🌾</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Krishi Alert</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>SMS · 1800-KISAN</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
        <div style={bubbleSms}>{alert.english}</div>
        <div style={bubbleSms}>{alert.hindi}</div>
        <div style={{ fontSize: 10, color: "#5b6b5b", textAlign: "center", marginTop: 2 }}>delivered · just now</div>
      </div>
      <div style={{ background: "#fff", borderTop: "1px solid #d5dcd5", padding: "10px 12px", fontSize: 12, color: "#8a8f84" }}>
        Reply <b style={{ color: "#075e54" }}>YES</b> to book →
      </div>
    </div>
  );
}

function CallBtn({ color, glyph, label }: { color: string; glyph: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        {glyph}
      </div>
      <span style={{ fontSize: 11, opacity: 0.85 }}>{label}</span>
    </div>
  );
}

const phoneFrame: React.CSSProperties = {
  width: 244,
  height: 496,
  background: "#0b0f0c",
  borderRadius: 34,
  padding: 9,
  position: "relative",
  boxShadow: "0 14px 40px rgba(20,30,22,.28)",
};
const notch: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: "50%",
  transform: "translateX(-50%)",
  width: 96,
  height: 20,
  background: "#0b0f0c",
  borderRadius: 999,
  zIndex: 2,
};
const screen: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: 26,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};
const avatar: React.CSSProperties = {
  width: 74,
  height: 74,
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
};
const bubbleDark: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  padding: "12px 14px",
};
const bubbleSms: React.CSSProperties = {
  background: "#fff",
  borderRadius: "4px 14px 14px 14px",
  padding: "10px 12px",
  fontSize: 12.5,
  lineHeight: 1.5,
  color: "#1b231d",
  boxShadow: "0 1px 1px rgba(0,0,0,.06)",
  maxWidth: "92%",
};
