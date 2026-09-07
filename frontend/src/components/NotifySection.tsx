"use client";

import { useEffect, useState } from "react";
import { fetchNotifyStatus, sendNotify, type NotifyResult } from "@/lib/api";

type Channel = "call" | "sms" | "whatsapp";
const CHANNELS: { id: Channel; label: string }[] = [
  { id: "call", label: "Voice call" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
];

export default function NotifySection({ cropSlug }: { cropSlug: string }) {
  const [live, setLive] = useState<boolean | null>(null);
  const [channel, setChannel] = useState<Channel>("call");
  const [numbers, setNumbers] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<NotifyResult[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifyStatus().then((s) => setLive(s.live)).catch(() => setLive(false));
  }, []);

  async function send() {
    const list = numbers.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) {
      setError("Add at least one phone number.");
      return;
    }
    setError("");
    setSending(true);
    setResults(null);
    try {
      const res = await sendNotify({ crop_slug: cropSlug, numbers: list, channel });
      setResults(res.results);
      setLive(res.live);
    } catch (e) {
      setError(e instanceof Error ? e.message : "send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="eyebrow">Send this alert to real phones</div>
          <div className="muted" style={{ fontSize: 13 }}>
            Type numbers, hit send — the alert goes out on the channel you pick.
          </div>
        </div>
        {live !== null && (
          <span className="pill" style={{ whiteSpace: "nowrap" }}>
            <span className="badge-dot" style={{ background: live ? "var(--brand)" : "var(--watch)" }} />
            {live ? "Live" : "Simulated"}
          </span>
        )}
      </div>

      {/* channel */}
      <div className="flex gap-1 p-1 mb-3" style={{ background: "var(--surface-2)", borderRadius: 999, width: "fit-content", border: "1px solid var(--border)" }}>
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChannel(c.id)}
            style={{
              fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
              border: "none", cursor: "pointer",
              background: channel === c.id ? "var(--surface)" : "transparent",
              color: channel === c.id ? "var(--ink)" : "var(--ink-2)",
              boxShadow: channel === c.id ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <textarea
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        placeholder={"Phone numbers, one per line\n9876543210\n+91 98765 43210"}
        rows={3}
        style={{
          width: "100%", resize: "vertical", fontSize: 14, padding: "10px 12px",
          borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)",
          fontFamily: "var(--font-mono)", color: "var(--ink)",
        }}
      />

      <div className="flex items-center gap-3 mt-3">
        <button className="btn btn-primary" onClick={send} disabled={sending}>
          {sending ? "Sending…" : channel === "call" ? "Place calls →" : "Send →"}
        </button>
        {error && <span style={{ fontSize: 13, color: "var(--high-text)" }}>{error}</span>}
      </div>

      {results && (
        <div className="flex flex-col gap-1.5 mt-4">
          {results.map((r, i) => (
            <div key={i} className="panel p-2.5 flex items-center justify-between" style={{ fontSize: 13 }}>
              <span className="mono">{r.to}</span>
              <StatusPill r={r} />
            </div>
          ))}
        </div>
      )}

      {live === false && (
        <div className="faint" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          Simulated mode — nothing is actually sent. To make calls real, add your Twilio keys
          to <span className="mono">backend/.env</span> (see <span className="mono">.env.example</span>) and restart the backend.
          A voice call to an Indian number needs no extra registration.
        </div>
      )}
    </div>
  );
}

function StatusPill({ r }: { r: NotifyResult }) {
  if (r.status === "sent")
    return <span className="badge badge-stable"><span className="badge-dot" /> sent{r.channel === "call" ? " · ringing" : ""}</span>;
  if (r.status === "simulated")
    return <span className="badge badge-watch"><span className="badge-dot" /> simulated</span>;
  return (
    <span className="badge badge-high" title={r.error || ""}>
      <span className="badge-dot" /> {r.error ? r.error.slice(0, 40) : "error"}
    </span>
  );
}
