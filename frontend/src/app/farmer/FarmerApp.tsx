"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AlertCard from "@/components/AlertCard";
import IncomingCall from "@/components/IncomingCall";
import LanguageSwitch from "@/components/LanguageSwitch";
import { onDispatch, readLatestDispatch, respondDispatch, type Dispatch } from "@/lib/dispatch";
import { stopSpeak } from "@/lib/speak";
import { STR, loadLang, saveLang, loadMode, saveMode, type Lang, type Mode } from "@/lib/i18n";
import type { AlertBundle } from "@/lib/engine";

type Phase = "home" | "ringing" | "details" | "accepted" | "declined";

function toContent(d: Dispatch): AlertBundle {
  return {
    cropSlug: d.cropSlug, cropNames: d.cropNames, unitName: d.unitName, offer: d.offer, crash: d.crash,
    productName: d.productName ?? "", productPrice: d.productPrice ?? 0, texts: d.texts,
  };
}

export default function FarmerApp({ sample, incoming, auto }: { sample: AlertBundle; incoming: AlertBundle | null; auto: boolean }) {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("basic");
  const [phase, setPhase] = useState<Phase>("home");
  const [alert, setAlert] = useState<AlertBundle | null>(null);
  const [dispatchId, setDispatchId] = useState<string | null>(null);

  useEffect(() => { setLang(loadLang()); setMode(loadMode()); }, []);

  // ring on: URL handoff (scanned QR), a live dispatch, or a persisted pending one
  useEffect(() => {
    if (incoming && auto) {
      setAlert(incoming);
      setPhase("ringing");
      return;
    }
    const latest = readLatestDispatch();
    if (latest && latest.status === "pending") {
      setAlert(toContent(latest));
      setDispatchId(latest.id);
      setPhase("ringing");
    }
    return onDispatch((d) => {
      setAlert(toContent(d));
      setDispatchId(d.id);
      setPhase("ringing");
    });
  }, [incoming, auto]);

  function answer() {
    setPhase("details"); // the alert card auto-plays the message itself
  }
  function respond(status: "accepted" | "declined") {
    stopSpeak();
    if (dispatchId) respondDispatch(dispatchId, status);
    setPhase(status);
  }
  function changeLang(l: Lang) {
    setLang(l);
    saveLang(l);
  }
  function changeMode(m: Mode) {
    setMode(m);
    saveMode(m);
  }

  const t = STR[lang];
  const sc = lang === "hi" ? "deva" : lang === "kn" ? "kn" : "";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--dash-bg)", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#fff", minHeight: "100dvh", display: "flex", flexDirection: "column", boxShadow: "0 0 40px rgba(20,35,26,.06)" }}>
        {/* app top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--dash-line)" }}>
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden><rect width="32" height="32" rx="8" fill="var(--brand)" /><path d="M6 22c4-7 16-7 20 0" stroke="#fff" strokeWidth="2.3" fill="none" strokeLinecap="round" /><rect x="8" y="22" width="2.3" height="4.5" rx="1" fill="#fff" /><rect x="21.7" y="22" width="2.3" height="4.5" rx="1" fill="#fff" /><circle cx="16" cy="12" r="2.3" fill="var(--turmeric)" /></svg>
            <span className={`display ${sc}`} style={{ fontWeight: 700, fontSize: 15 }}>{t.saathi}</span>
          </div>
          <LanguageSwitch value={lang} onChange={changeLang} />
        </div>

        {/* interface mode: basic keypad phone (default) vs smartphone app */}
        <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: "1px solid var(--dash-line)", background: "var(--dash-bg)" }}>
          <ModePill active={mode === "basic"} label={t.modeBasic} onClick={() => changeMode("basic")} sc={sc} />
          <ModePill active={mode === "app"} label={t.modeApp} onClick={() => changeMode("app")} sc={sc} />
        </div>

        {/* screen */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {phase === "home" && <Home lang={lang} onSample={() => { setAlert(sample); setDispatchId(null); setPhase("ringing"); }} />}
          {phase === "ringing" && alert && (
            <IncomingCall cropName={alert.cropNames[lang]} lang={lang} onAnswer={answer} onDecline={() => respond("declined")} />
          )}
          {phase === "details" && alert && (
            <AlertCard a={alert} lang={lang} status="pending" autoPlay mode={mode} onAccept={() => respond("accepted")} onDecline={() => respond("declined")} />
          )}
          {phase === "accepted" && alert && <AlertCard a={alert} lang={lang} status="accepted" />}
          {phase === "declined" && alert && <AlertCard a={alert} lang={lang} status="declined" />}
        </div>

        {(phase === "accepted" || phase === "declined") && (
          <button className="btn" style={{ margin: 16 }} onClick={() => setPhase("home")}>← Back</button>
        )}
      </div>
    </div>
  );
}

function ModePill({ active, label, onClick, sc }: { active: boolean; label: string; onClick: () => void; sc: string }) {
  return (
    <button
      onClick={onClick}
      className={sc}
      style={{
        flex: 1, padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
        border: `1px solid ${active ? "var(--brand)" : "var(--border)"}`,
        background: active ? "var(--brand)" : "var(--surface)",
        color: active ? "#fff" : "var(--ink-2)",
      }}
    >
      {label}
    </button>
  );
}

function Home({ lang, onSample }: { lang: Lang; onSample: () => void }) {
  const t = STR[lang];
  const sc = lang === "hi" ? "deva" : lang === "kn" ? "kn" : "";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30, gap: 6 }}>
      <div style={{ fontSize: 44 }}>📞</div>
      <div className={`display ${sc}`} style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{t.saathi}</div>
      <p className={`muted ${sc}`} style={{ fontSize: 14, marginTop: 4 }}>{t.waiting}</p>
      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onSample}>Show a sample alert</button>
      <Link href="/admin" className="link" style={{ fontSize: 12.5, marginTop: 14 }}>Officer console →</Link>
    </div>
  );
}
