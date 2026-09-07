import type { AlertText } from "@/lib/api";

export default function AlertPreview({ alert }: { alert: AlertText }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow">Farmer alert</span>
        <span className="faint" style={{ fontSize: 11 }}>{alert.channel}</span>
      </div>
      <div
        className="p-4"
        style={{ background: "#0f1a13", borderRadius: 12, color: "#eafaf0" }}
      >
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{alert.english}</div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "10px 0" }} />
        <div style={{ fontSize: 13, lineHeight: 1.6, color: "#bfeecd" }}>{alert.hindi}</div>
      </div>
      <div className="faint mt-2" style={{ fontSize: 11 }}>
        Sent as SMS + voice call, so a basic phone with no app and no reading still gets it.
      </div>
    </div>
  );
}
