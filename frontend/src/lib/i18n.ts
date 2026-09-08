// Farmer-facing strings in the three languages of the demo district.
export type Lang = "en" | "hi" | "kn";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "kn", label: "ಕನ್ನಡ" },
];

export const voiceCode: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", kn: "kn-IN" };

type Str = {
  saathi: string;
  alertTag: string;
  sellHere: string;
  play: string;
  accept: string;
  notNow: string;
  booked: string;
  okNotNow: string;
  waiting: string;
  header: (crop: string) => string;
  mandi: (crash: number) => string;
  bring: (crop: string, unit: string, offer: number) => string;
};

export const STR: Record<Lang, Str> = {
  en: {
    saathi: "Krishi Saathi",
    alertTag: "PRICE ALERT",
    sellHere: "Don’t dump it — sell here instead",
    play: "🔊 Play message",
    accept: "Accept",
    notNow: "Not now",
    booked: "Booked",
    okNotNow: "Okay, not now",
    waiting: "Waiting for a price alert…",
    header: (c) => `${c} price crashing`,
    mandi: (crash) => `Mandi is paying only ₹${crash}/kg today`,
    bring: (c, u, o) => `Bring your ${c} to ${u}. You’ll get ₹${o}/kg.`,
  },
  hi: {
    saathi: "कृषि साथी",
    alertTag: "मूल्य चेतावनी",
    sellHere: "फेंके नहीं — यहाँ बेचिए",
    play: "🔊 संदेश सुनें",
    accept: "स्वीकारें",
    notNow: "अभी नहीं",
    booked: "बुक हो गया",
    okNotNow: "ठीक है, अभी नहीं",
    waiting: "मूल्य चेतावनी की प्रतीक्षा…",
    header: (c) => `${c} के दाम गिर रहे हैं`,
    mandi: (crash) => `मंडी आज सिर्फ ₹${crash}/किलो दे रही है`,
    bring: (c, u, o) => `अपनी ${c} ${u} ले जाइए। ₹${o}/किलो मिलेगा।`,
  },
  kn: {
    saathi: "ಕೃಷಿ ಸಾಥಿ",
    alertTag: "ಬೆಲೆ ಎಚ್ಚರಿಕೆ",
    sellHere: "ಎಸೆಯಬೇಡಿ — ಇಲ್ಲಿ ಮಾರಿ",
    play: "🔊 ಸಂದೇಶ ಕೇಳಿ",
    accept: "ಒಪ್ಪಿ",
    notNow: "ಈಗ ಬೇಡ",
    booked: "ಬುಕ್ ಆಗಿದೆ",
    okNotNow: "ಸರಿ, ಈಗ ಬೇಡ",
    waiting: "ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ…",
    header: (c) => `${c} ಬೆಲೆ ಕುಸಿಯುತ್ತಿದೆ`,
    mandi: (crash) => `ಮಂಡಿ ಇಂದು ₹${crash}/ಕೆಜಿ ಮಾತ್ರ ಕೊಡುತ್ತಿದೆ`,
    bring: (c, u, o) => `ನಿಮ್ಮ ${c} ${u} ಗೆ ತನ್ನಿ. ₹${o}/ಕೆಜಿ ಸಿಗುತ್ತದೆ.`,
  },
};

export function loadLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const v = localStorage.getItem("ks_lang");
    if (v === "en" || v === "hi" || v === "kn") return v;
  } catch {}
  return "en";
}
export function saveLang(l: Lang) {
  try { localStorage.setItem("ks_lang", l); } catch {}
}
