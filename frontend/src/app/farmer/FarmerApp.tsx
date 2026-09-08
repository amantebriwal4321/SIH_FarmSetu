"use client";

import { useEffect, useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import AlertCard from "@/components/AlertCard";
import LanguageSwitch from "@/components/LanguageSwitch";
import { onDispatch, readLatestDispatch, respondDispatch, type Dispatch } from "@/lib/dispatch";
import { STR, loadLang, saveLang, type Lang } from "@/lib/i18n";
import type { AlertBundle } from "@/lib/engine";

type Cur = { id: string; content: AlertBundle; status: "pending" | "accepted" | "declined" } | null;

function toContent(d: Dispatch): AlertBundle {
  return { cropNames: d.cropNames, unitName: d.unitName, offer: d.offer, crash: d.crash, texts: d.texts };
}

export default function FarmerApp({ sample }: { sample: AlertBundle }) {
  const [cur, setCur] = useState<Cur>(null);
  const [live, setLive] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => setLang(loadLang()), []);

  useEffect(() => {
    const latest = readLatestDispatch();
    if (latest && latest.status === "pending") {
      setCur({ id: latest.id, content: toContent(latest), status: "pending" });
      setLive(true);
    }
    return onDispatch((d) => {
      setCur({ id: d.id, content: toContent(d), status: "pending" });
      setLive(true);
    });
  }, []);

  function respond(status: "accepted" | "declined") {
    if (!cur) return;
    if (cur.id !== "sample") respondDispatch(cur.id, status);
    setCur({ ...cur, status });
  }

  function changeLang(l: Lang) { setLang(l); saveLang(l); }

  return (
    <main className="mx-auto max-w-6xl w-full px-5 py-10 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* explainer */}
        <div className="order-2 lg:order-1">
          <div className="eyebrow">The farmer’s side</div>
          <h1 className="display" style={{ fontSize: 30, fontWeight: 700, marginTop: 10 }}>
            No app. No reading.<br />Just a phone call.
          </h1>
          <p className="muted" style={{ fontSize: 16, marginTop: 14, maxWidth: 460, lineHeight: 1.55 }}>
            When a crash is coming, the farmer’s phone rings and <b>speaks the offer in their own
            language</b>. They tap once to accept. Pick a language to see and hear it:
          </p>

          <div className="mt-5"><LanguageSwitch value={lang} onChange={changeLang} /></div>

          <div className="flex items-center gap-2 mt-6">
            <span className="pill">
              <span className="badge-dot" style={{ background: live ? "var(--brand)" : "var(--ink-3)" }} />
              {live ? "Live alert received" : "Waiting for an alert"}
            </span>
          </div>

          {!live && (
            <>
              <p className="faint" style={{ fontSize: 13, marginTop: 14, lineHeight: 1.5, maxWidth: 460 }}>
                Open the <b>Officer console</b> in another window and route a crop — it will appear on
                this phone instantly. Or preview one now:
              </p>
              <button className="btn btn-primary mt-3" onClick={() => setCur({ id: "sample", content: sample, status: "pending" })}>
                Show a sample alert
              </button>
            </>
          )}
        </div>

        {/* the phone */}
        <div className="order-1 lg:order-2 flex justify-center">
          <PhoneFrame>
            {cur ? (
              <AlertCard a={cur.content} lang={lang} status={cur.status} onAccept={() => respond("accepted")} onDecline={() => respond("declined")} />
            ) : (
              <Waiting lang={lang} />
            )}
          </PhoneFrame>
        </div>
      </div>
    </main>
  );
}

function Waiting({ lang }: { lang: Lang }) {
  const t = STR[lang];
  const sc = lang === "hi" ? "deva" : lang === "kn" ? "kn" : "";
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 26, color: "var(--ink-2)" }}>
      <div style={{ fontSize: 34 }}>📞</div>
      <div className={`display ${sc}`} style={{ fontSize: 18, fontWeight: 600, marginTop: 10, color: "var(--ink)" }}>{t.saathi}</div>
      <p className={sc} style={{ fontSize: 13, marginTop: 6 }}>{t.waiting}</p>
    </div>
  );
}
