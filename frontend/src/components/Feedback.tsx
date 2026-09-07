"use client";

import { useEffect, useState } from "react";
import { postFeedback, fetchTrust, type Trust } from "@/lib/api";

export default function Feedback({ cropSlug }: { cropSlug: string }) {
  const [trust, setTrust] = useState<Trust | null>(null);
  const [hover, setHover] = useState(0);
  const [picked, setPicked] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchTrust().then(setTrust).catch(() => {});
  }, []);

  async function submit(rating: number) {
    setPicked(rating);
    try {
      const t = await postFeedback({ crop_slug: cropSlug, role: "farmer", rating });
      setTrust(t);
      setSent(true);
    } catch {
      /* ignore for demo */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Was this alert useful?</span>
        {trust?.trust_score != null && (
          <span className="pill">
            Trust score <b className="mono" style={{ color: "var(--brand-deep)" }}>{trust.trust_score}</b>
            <span className="faint">· {trust.count} ratings</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => submit(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star`}
            style={{
              fontSize: 26,
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: (hover || picked) >= n ? "var(--watch)" : "var(--border)",
              transition: "color .1s",
            }}
          >
            ★
          </button>
        ))}
        {sent && <span className="muted ml-2" style={{ fontSize: 13 }}>Thanks — the model learns from this.</span>}
      </div>
      <div className="faint" style={{ fontSize: 11 }}>
        Every rating feeds the trust score and tunes the alert thresholds. This is how the
        system improves from real use.
      </div>
    </div>
  );
}
