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
  pause: string;
  resume: string;
  noVoice: string;
  accept: string;
  notNow: string;
  booked: string;
  okNotNow: string;
  waiting: string;
  header: (crop: string) => string;
  mandi: (crash: number) => string;
  bring: (crop: string, unit: string, offer: number) => string;
  // value chain (who gains what)
  mandiLbl: string;
  youGetLbl: string;
  citySellsLbl: string;
  winWhy: (product: string, price: number) => string;
};

export const STR: Record<Lang, Str> = {
  en: {
    saathi: "Krishi Saathi",
    alertTag: "PRICE ALERT",
    sellHere: "Don’t dump it — sell here instead",
    play: "🔊 Play message",
    pause: "❚❚ Pause",
    resume: "▶ Resume",
    noVoice: "🔇 No English voice on this device — open on an Android phone to hear it",
    accept: "Accept",
    notNow: "Not now",
    booked: "Booked",
    okNotNow: "Okay, not now",
    waiting: "Waiting for a price alert…",
    header: (c) => `${c} price crashing`,
    mandi: (crash) => `Mandi is paying only ₹${crash}/kg today`,
    bring: (c, u, o) => `Bring your ${c} to ${u}. You’ll get ₹${o}/kg.`,
    mandiLbl: "Mandi today",
    youGetLbl: "You get",
    citySellsLbl: "Unit sells for",
    winWhy: (product, price) =>
      `The unit turns it into ${product} and sells it in the city at ₹${price}/kg — that’s how it can pay you well above the mandi and still earn. Both of you win.`,
  },
  hi: {
    saathi: "कृषि साथी",
    alertTag: "मूल्य चेतावनी",
    sellHere: "फेंके नहीं — यहाँ बेचिए",
    play: "🔊 संदेश सुनें",
    pause: "❚❚ रोकें",
    resume: "▶ जारी रखें",
    noVoice: "🔇 इस डिवाइस में हिंदी आवाज़ नहीं है — एंड्रॉइड फ़ोन पर सुनें",
    accept: "स्वीकारें",
    notNow: "अभी नहीं",
    booked: "बुक हो गया",
    okNotNow: "ठीक है, अभी नहीं",
    waiting: "मूल्य चेतावनी की प्रतीक्षा…",
    header: (c) => `${c} के दाम गिर रहे हैं`,
    mandi: (crash) => `मंडी आज सिर्फ ₹${crash}/किलो दे रही है`,
    bring: (c, u, o) => `अपनी ${c} ${u} ले जाइए। ₹${o}/किलो मिलेगा।`,
    mandiLbl: "मंडी आज",
    youGetLbl: "आपको मिलेगा",
    citySellsLbl: "यूनिट बेचती है",
    winWhy: (product, price) =>
      `यूनिट इसे ${product} बनाकर शहर में ₹${price}/किलो में बेचती है — इसी से वह आपको मंडी से कहीं अच्छा दाम दे पाती है और उसे भी फायदा होता है। दोनों का फायदा।`,
  },
  kn: {
    saathi: "ಕೃಷಿ ಸಾಥಿ",
    alertTag: "ಬೆಲೆ ಎಚ್ಚರಿಕೆ",
    sellHere: "ಎಸೆಯಬೇಡಿ — ಇಲ್ಲಿ ಮಾರಿ",
    play: "🔊 ಸಂದೇಶ ಕೇಳಿ",
    pause: "❚❚ ನಿಲ್ಲಿಸಿ",
    resume: "▶ ಮುಂದುವರಿಸಿ",
    noVoice: "🔇 ಈ ಸಾಧನದಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಇಲ್ಲ — ಆಂಡ್ರಾಯ್ಡ್ ಫೋನ್‌ನಲ್ಲಿ ಕೇಳಿ",
    accept: "ಒಪ್ಪಿ",
    notNow: "ಈಗ ಬೇಡ",
    booked: "ಬುಕ್ ಆಗಿದೆ",
    okNotNow: "ಸರಿ, ಈಗ ಬೇಡ",
    waiting: "ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ…",
    header: (c) => `${c} ಬೆಲೆ ಕುಸಿಯುತ್ತಿದೆ`,
    mandi: (crash) => `ಮಂಡಿ ಇಂದು ₹${crash}/ಕೆಜಿ ಮಾತ್ರ ಕೊಡುತ್ತಿದೆ`,
    bring: (c, u, o) => `ನಿಮ್ಮ ${c} ${u} ಗೆ ತನ್ನಿ. ₹${o}/ಕೆಜಿ ಸಿಗುತ್ತದೆ.`,
    mandiLbl: "ಮಂಡಿ ಇಂದು",
    youGetLbl: "ನಿಮಗೆ ಸಿಗುತ್ತದೆ",
    citySellsLbl: "ಘಟಕ ಮಾರುತ್ತದೆ",
    winWhy: (product, price) =>
      `ಘಟಕ ಇದನ್ನು ${product} ಮಾಡಿ ನಗರದಲ್ಲಿ ₹${price}/ಕೆಜಿಗೆ ಮಾರುತ್ತದೆ — ಹಾಗಾಗಿ ಅದು ನಿಮಗೆ ಮಂಡಿಗಿಂತ ಉತ್ತಮ ಬೆಲೆ ಕೊಟ್ಟು ತಾನೂ ಲಾಭ ಗಳಿಸುತ್ತದೆ. ಇಬ್ಬರಿಗೂ ಲಾಭ.`,
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
