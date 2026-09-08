// The farmer's phone actually speaks the alert — free, offline, built into the browser.
// Replaces the Twilio voice call for the demo. Prefers a Hindi (hi-IN) voice, falls back
// to Indian English, then any voice.

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("en-in")) ||
    voices[0]
  );
}

export function speak(text: string, lang = "hi-IN", onEnd?: () => void) {
  if (!canSpeak()) {
    onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.95;
  u.pitch = 1;
  const v = pickVoice(lang);
  if (v) u.voice = v;
  if (onEnd) u.onend = onEnd;
  // some browsers populate voices asynchronously
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => {
      const vv = pickVoice(lang);
      if (vv) u.voice = vv;
      synth.speak(u);
      synth.onvoiceschanged = null;
    };
  } else {
    synth.speak(u);
  }
}

export function stopSpeak() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
