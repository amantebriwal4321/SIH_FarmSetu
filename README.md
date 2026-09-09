# Kisan Setu — Glut-to-Value engine

**SIH 2026 · Theme: Agriculture, FoodTech & Rural Development**

The farmer gets ₹5, you pay ₹25, and the crop still rots. Kisan Setu spots a crop price
crash **before** it happens and routes the surplus to nearby SHG/FPO processing units — so a
crop that would be dumped becomes a product that lasts, made by rural women.

It covers all three parts of the theme at once: a crop that would rot (**agriculture**)
becomes a product that lasts (**food processing**) made by rural women earning money
(**rural development**). Every piece is already funded by the government (Operation Greens,
PMFME, the 10,000-FPO scheme) — Kisan Setu is the missing wire that connects them in real time.

## Two portals + a guided flow

- **`/` Landing** — what it is, the problem, and the two doors.
- **`/admin` Officer console** — the control room: which crops are about to crash, and one
  click to route the surplus to processing units (fills a live impact meter, sends the alert).
- **`/farmer` Farmer app** — phone-first, bilingual. The phone **speaks the alert in Hindi**
  (browser voice — no app, no reading), with a big Accept / Not now.
- **`/flow` The full flow** — a playable, video-like walkthrough of the whole loop:
  detect → route → alert → farmer accepts → officer sees it confirmed.

**Live handshake, no backend:** open `/admin` and `/farmer` in two windows — routing a crop on
Admin makes the alert appear (and speak) on the Farmer phone instantly, and accepting flips
Admin to "confirmed." This uses the browser's `BroadcastChannel` + `localStorage`.

## Run it (one app, no backend, no database)

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

**To scan the QR and receive the alert on a real phone (same Wi-Fi):** start it bound to the
network and open the console at your laptop's network address so the QR points there —
```bash
npx next dev -H 0.0.0.0 -p 3000
# then on the laptop open  http://<your-lan-ip>:3000/admin  (e.g. http://192.168.1.12:3000/admin)
```
Route a crop → scan the QR with a phone on the same Wi-Fi → the farmer app rings and speaks.
(Deploying to Vercel makes the QR work on any phone, even mobile data — see below.)

That's it — all data and logic live in `src/lib/engine` (a transparent crash-risk rule + a
distance/capacity matching engine over a deterministic Kolar tomato-crash seed). Nothing to
run on a server, works fully offline.

## Deploy (Vercel, ~2 minutes)

1. Go to vercel.com → **Add New → Project** → import the GitHub repo.
2. Set **Root Directory = `frontend`** (framework auto-detects as Next.js).
3. **Deploy.** No environment variables needed. You get a public URL.

## How the prediction works (transparent, not a black box)

`src/lib/engine/predictor.ts` scores each crop 0–100 from three stated signals with fixed weights:
- **arrivals surge** (45%) — today's arrivals vs a normal early-season baseline
- **price slide** (40%) — how fast price fell over 7 days
- **harvest season** (15%) — is it the known glut month

It never claims a future price — only "how likely is a crash right now."

## What's real vs demo

- **Real logic:** the risk scoring, the distance/capacity matching, the rupee/kg impact, the
  bilingual alert, the browser voice, the live two-window handshake.
- **Demo data:** one district (Kolar), three crops, a 60-day series modelled on a real tomato
  crash. Scales by adding data — no new code.

## Roadmap (pitch, not built)

Live Agmarknet + sowing feeds; a "warn before planting" prevention layer; multi-device sync
(a shared KV instead of BroadcastChannel); multi-district, multi-crop.

*A legacy FastAPI backend from an earlier version still lives in `/backend`; the deployed app
does not need it.*
