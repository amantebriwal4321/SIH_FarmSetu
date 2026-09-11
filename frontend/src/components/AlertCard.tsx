"use client";

import { stopSpeak } from "@/lib/speak";
import SpeakButton from "@/components/SpeakButton";
import { STR, voiceCode, type Lang } from "@/lib/i18n";
import type { AlertBundle } from "@/lib/engine";

function scriptClass(lang: Lang) {
  return lang === "hi" ? "deva" : lang === "kn" ? "kn" : "";
}

export default function AlertCard({
  a,
  lang,
  status,
  autoPlay = false,
  onAccept,
  onDecline,
}: {
  a: AlertBundle;
  lang: Lang;
  status: "pending" | "accepted" | "declined";
  autoPlay?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const t = STR[lang];
  const sc = scriptClass(lang);
  const crop = a.cropNames[lang];

  if (status === "accepted") {
    return (
      <Screen tone="ok">
        <div style={{ fontSize: 40 }}>✓</div>
        <div className={`display ${sc}`} style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{t.booked}</div>
        <p className={sc} style={{ fontSize: 13.5, marginTop: 10, opacity: 0.9, lineHeight: 1.55 }}>
          {t.bring(crop, a.unitName, a.offer)}
        </p>
      </Screen>
    );
  }
  if (status === "declined") {
    return (
      <Screen tone="muted">
        <div style={{ fontSize: 34 }}>—</div>
        <div className={`display ${sc}`} style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{t.okNotNow}</div>
      </Screen>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: "#0f3d24", color: "#eafaf0", padding: "22px 16px 14px" }}>
        <div className={sc} style={{ fontSize: 11, letterSpacing: "0.08em", opacity: 0.7 }}>{t.saathi} · {t.alertTag}</div>
        <div className={`display ${sc}`} style={{ fontSize: 21, fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>
          {t.header(crop)}
        </div>
        <div className={sc} style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{t.mandi(a.crash)}</div>
      </div>

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="panel" style={{ padding: 12 }}>
          <div className={`faint ${sc}`} style={{ fontSize: 11 }}>{t.sellHere}</div>
          <div style={{ fontWeight: 600, marginTop: 3 }}>{a.unitName}</div>
          <div className="kpi-num" style={{ fontSize: 26, color: "var(--brand-deep)", marginTop: 2 }}>₹{a.offer}/kg</div>
        </div>

        {/* Who gains what — resolves "why would the unit pay ₹9?" */}
        {a.productPrice > 0 && (
          <div className="panel" style={{ padding: 12 }}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
              <ChainCell className={sc} label={t.mandiLbl} value={`₹${a.crash}`} tone="bad" />
              <Arrow />
              <ChainCell className={sc} label={t.youGetLbl} value={`₹${a.offer}`} tone="good" strong />
              <Arrow />
              <ChainCell className={sc} label={t.citySellsLbl} value={`₹${a.productPrice}`} tone="city" />
            </div>
            <p className={`faint ${sc}`} style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 10 }}>
              {t.winWhy(a.productName, a.productPrice)}
            </p>
          </div>
        )}

        <SpeakButton
          text={a.texts[lang]}
          voice={voiceCode[lang]}
          autoPlay={autoPlay}
          labels={{ play: t.play, pause: t.pause, resume: t.resume }}
          className="btn btn-ghost"
          style={{ alignSelf: "flex-start", padding: "8px 14px", fontSize: 13 }}
        />

        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`btn ${sc}`} style={{ flex: 1 }} onClick={() => { stopSpeak(); onDecline?.(); }}>
            {t.notNow}
          </button>
          <button className={`btn btn-primary ${sc}`} style={{ flex: 1.4 }} onClick={() => { stopSpeak(); onAccept?.(); }}>
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChainCell({ label, value, tone, strong, className }: { label: string; value: string; tone: "bad" | "good" | "city"; strong?: boolean; className?: string }) {
  const color = tone === "bad" ? "var(--alarm-text)" : tone === "good" ? "var(--brand-deep)" : "var(--ink)";
  return (
    <div style={{ flex: 1, textAlign: "center", background: strong ? "var(--brand-soft)" : "transparent", borderRadius: 8, padding: "6px 2px" }}>
      <div className="kpi-num" style={{ fontSize: strong ? 20 : 17, color }}>{value}</div>
      <div className={`faint ${className || ""}`} style={{ fontSize: 9.5, marginTop: 2, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
}

function Arrow() {
  return <div style={{ alignSelf: "center", color: "var(--ink-3)", fontSize: 13 }}>→</div>;
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
