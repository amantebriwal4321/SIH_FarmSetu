# CLAUDE.md — Kisan Setu (SIH 2026)

Hackathon project for SIH 2026 / Ramaiah. Theme 1: Agriculture, FoodTech & Rural Development.
Concept: **Glut to Value** — predict a crop price crash, route the surplus to nearby SHG/FPO
processing units before it's dumped, and alert the farmer by phone call in their language.

---

## What this is

**Three users, one connected system:**
1. **Officer** (APMC/govt) — sees the district on a screen, clicks one button to route the surplus.
2. **Farmer** — only interaction is receiving a phone call and pressing 1 to accept.
3. **Processing unit** (SHG/FPO factory) — receives the crop, makes paste, pays the farmer.

**Core insight:** The government already funds every piece — the factories (PMFME), the farmer groups
(10,000 FPO scheme), the price data (Agmarknet). We built the one missing wire: the intelligence
that connects a crashing crop to the unit that can save it.

---

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — single self-contained app, no backend/DB
- **No backend at runtime.** All prediction/matching logic is TypeScript in `src/lib/engine/`
- **Deployed:** sih-farm-setu.vercel.app (root = `frontend`)
- **No env vars required** for the demo. `DATA_GOV_API_KEY` is optional (falls back to public sample key)

### Run locally
```bash
cd frontend
npm install
npm run dev       # :3000
npm run build     # verify before pushing
```

---

## Architecture

```
src/lib/engine/
  seed.ts        — deterministic demo data: 3 crops, 6 units, 3 buyers, 10 demo farmers
  predictor.ts   — 3-signal crash risk: arrivals 45% + price slide 40% + harvest season 15% → 0-100
  matching.ts    — haversine distance + capacity matching; offerPrice = max(9, crash+5)
  index.ts       — getCrops, getCrop, getMatches, getOverview, alertText, DEMO_FARMERS

src/lib/
  speak.ts       — Web Speech API wrapper (voiceFor strict match, never wrong-voice fallback)
  i18n.ts        — Lang "en"|"hi"|"kn", Mode "basic"|"app", all string keys
  dispatch.ts    — BroadcastChannel + localStorage: officer→farmer handshake
  baseUrl.ts     — LAN IP in dev, host header in prod (for QR codes)
  liveprices.ts  — SERVER-ONLY: real data.gov.in Agmarknet fetch + fallback snapshot

src/components/
  AlertCard.tsx  — farmer alert; mode="basic" (keypad) or "app" (tap buttons)
  Keypad.tsx     — 3×4 phone keypad, 1=Accept (green), 2=Decline (red)
  ValueChain.tsx — "why ₹9 when mandi is ₹3?" explanation (fresh→paste transformation)
  SpeakButton.tsx — play/pause/resume with voice availability detection
  LivePrices.tsx — presentational card for live mandi prices (props only, no server imports)

src/app/
  page.tsx       — scroll-driven landing (6 scenes: Hero→Glut→Crash→Reroute→Call→Sunrise)
  admin/         — officer console (server component fetches live prices, passes to AdminConsole)
  farmer/        — farmer app (basic phone default, smartphone toggle)
  flow/          — 5-step scripted walkthrough demo
```

---

## The crash predictor — what it actually does

**We do NOT predict a future price.** We score crash RISK 0-100 from three present-tense signals:

1. **Arrivals surge (45%)** — more crop than normal flooding the mandi → supply glut
2. **Price slide (40%)** — price falling fast over last 7 days
3. **Harvest season (15%)** — known glut month for this crop

Output: a **danger meter**, not a price forecast. Say to judges:
> *"We read three public signals and score how likely a crash is right now. Transparent and checkable — not a black-box guess."*

**Honest limit:** the demo runs on 60-day modelled data shaped like a real Kolar tomato crash.
Going fully live just needs the daily arrivals feed from Agmarknet — no new code.

---

## Live data vs demo data

| Thing shown | Real or demo? |
|---|---|
| Today's mandi prices (LivePrices card) | **LIVE** from data.gov.in Agmarknet |
| 60-day price crash curve | **Demo** — modelled, shaped like a real crash |
| Crash risk score (0-100) | **Real method** on demo data |
| SHG/FPO units, collection points, phone numbers | **Illustrative** — real-type names/places |
| Farmer names in pickup list | **Made up** (no farmer login) |
| Government schemes listed | **100% real** |

---

## Farmer registration — how it works (no tech for farmers)

Farmers **never register themselves.** The process already exists:

1. **FPO paper register** — every FPO legally must maintain a member list (name, village, phone,
   crops, land). It exists today on paper/Excel. Government requirement under the 10,000 FPO scheme.
2. **Kisan Mitra digitizes it** — government already employs village-level workers (VLEs, Krishi
   Mitras). Their job is to sit with farmers and help with digital/govt processes. They enter the
   FPO register into the app on **their** phone; the farmer just confirms verbally.
3. **Seasonal crop update** — FPO coordinators already ask "what are you planting?" before each
   sowing season. We capture that answer digitally.

**Result:** alerts are crop-specific. Tomato crashes → only tomato farmers in that area get the call.
We didn't design a new process; we digitized the paper register that already exists.

Judge line:
> *"We're not asking anyone to change their behavior — just upgrade from a notebook to a form."*

---

## Two farmer modes

- **Basic phone (default)** — keypad call mode; shows call banner + Keypad component; press 1/2
- **Smartphone** — tap Accept / Not now buttons
- Toggle in header; persisted to `localStorage` (`ks_mode`)
- The farmer's only real-world interaction is always the phone call — the app demonstrates both paths

---

## Why ₹9 when the mandi is ₹3 (ValueChain)

Two reasons shown in the ValueChain component (everywhere: farmer app, officer console, flow):
1. **₹3 is distress, not supply.** In a glut most crop rots unsold — a unit can't build a paste line
   on collapsing spot lots. Buying direct from the farmer at ₹9 gets it steady, fresh, traceable supply.
2. **The unit doesn't sell it fresh.** Tomato → paste worth ₹48/kg that lasts months. ₹9 raw is cheap.

---

## After a farmer accepts

1. Officer console shows the confirmed farmer in the pickup manifest (name · village · tonnes)
2. FPO van routes through those villages to collect — farmer travels zero or minimal distance
3. The crop goes to the processing unit's collection point
4. Unit makes paste, pays ₹9/kg to the farmer

---

## Key constraints

- **Demo must work offline/on stage** — seed data is deterministic, live API fetch has fallback snapshot
- **Never claim a future price** — only a crash risk score
- **Voice must match language** — strict voiceFor(), never falls back to wrong-language voice
- **API key stays server-side** — LivePrices.tsx imports nothing from liveprices.ts (server-only)
- `npm run build` must pass before any push

---

## Docs

- `SIMPLE-GUIDE.md` — plain-words explanation of the whole project
- `DATA-SOURCES.md` — all data sources with links
- `OVERVIEW.md` — full technical reference
- `FAQ.md` — judge Q&A
