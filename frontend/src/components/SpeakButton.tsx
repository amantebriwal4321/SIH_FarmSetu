"use client";

import { useEffect, useRef, useState } from "react";
import { speak, pauseSpeak, resumeSpeak, stopSpeak, canSpeak, hasVoiceFor } from "@/lib/speak";

// One button that plays the spoken alert and lets the presenter PAUSE it mid-message
// (so they can say "and it's also in Hindi and Kannada"), then resume or replay.
// Switching language resets it to idle so each language is played deliberately.
// If the device has NO voice for this language, it never fakes it in English — it
// shows a clear note instead (Kannada, for example, needs an Android phone).
export default function SpeakButton({
  text,
  voice,
  labels,
  autoPlay = false,
  className = "btn btn-ghost",
  style,
}: {
  text: string;
  voice: string; // e.g. "hi-IN"
  labels: { play: string; pause: string; resume: string; noVoice: string };
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [available, setAvailable] = useState(true); // optimistic until voices load
  const first = useRef(true);
  const key = `${voice}|${text}`;

  // voice availability for this language (recheck when the voice list loads)
  useEffect(() => {
    const check = () => setAvailable(hasVoiceFor(voice));
    check();
    if (!canSpeak()) return;
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, [voice]);

  // play once on mount if asked and a voice exists
  useEffect(() => {
    if (autoPlay && canSpeak() && hasVoiceFor(voice)) start();
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // language / text changed → stop and reset so the new one is played on purpose
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    stopSpeak();
    setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function start() {
    speak(text, voice, () => setState("idle"));
    setState("playing");
  }
  function toggle() {
    if (state === "idle") start();
    else if (state === "playing") { pauseSpeak(); setState("paused"); }
    else { resumeSpeak(); setState("playing"); }
  }

  if (!canSpeak()) return null;

  if (!available) {
    return (
      <div className="faint" style={{ fontSize: 11.5, lineHeight: 1.4, ...style, alignSelf: "flex-start" }}>
        {labels.noVoice}
      </div>
    );
  }

  const label = state === "playing" ? labels.pause : state === "paused" ? labels.resume : labels.play;
  return (
    <button className={className} style={style} onClick={toggle} aria-live="polite">
      {label}
    </button>
  );
}
