# Kisan Setu — Complete Project Reference

**SIH 2026 · Theme: Agriculture, FoodTech & Rural Development**
**Repo:** https://github.com/amantebriwal4321/SIH_FarmSetu

> One master document for the whole team — read this and you can answer almost any question.
> For the sharp Q&A (pricing, "doesn't the govt already do this", etc.) see `FAQ.md`.

---

## Contents
1. The 30-second pitch
2. The problem (with real numbers)
3. The solution — how it works
4. Who it helps (three users)
5. The economics (why ₹3.82 → ₹9 → ₹40)
6. Government schemes we plug into
7. Why this is strong / our differentiators
8. What we built (the app, screen by screen)
9. How the prediction works
10. How the matching works
11. Tech architecture
12. Data sources & resources
13. What's real vs demo vs roadmap
14. How to run & deploy
15. Team roles
16. The demo script
17. Key facts & sources (cheat sheet)
18. Glossary

---

## 1. The 30-second pitch
> The farmer sells his tomato for ₹5. You buy it for ₹25. And the crop **still rots** on the
> roadside — everyone loses. When a crop floods the market the price crashes, the farmer dumps it,
> and idle women's processing units sit a few km away. Every piece to fix this is already funded by
> the government. We built the one thing missing: the intelligence that spots the crash, routes the
> surplus to the unit that can save it, and calls the farmer in their own language before it rots.
> One crop that would be wasted becomes a product that lasts, made by rural women.

---

## 2. The problem (with real numbers)
- In a glut, everyone harvests at once → the mandi floods → **price collapses**.
- Real 2026 numbers: onion farmers got **₹5–7/kg** while retail was **₹25/kg**; in Maharashtra
  farmers received only ~**43%** of the retail price. Farmers dumped tomatoes/onions on roadsides.
- Selling costs the farmer more than dumping (harvest + transport + mandi commission ≈ ₹4–5/kg),
  and the crop **rots in days** — so dumping is the cheaper choice.
- India loses roughly **₹1.53 lakh crore (~$18 bn) of food a year** after harvest (NABCONS study
  for the Ministry of Food Processing).
- Meanwhile **processing units run by women's SHGs / FPOs sit half empty**, and city buyers want the
  finished product (paste, flakes, pulp). All three exist in the same district and never connect.

**The gap in one line:** a crop being dumped, an idle processing unit, and a buyer — all in the same
place, with no system to introduce them fast enough before the crop rots.

---

## 3. The solution — how it works
A four-step loop:

1. **Detect** — read public mandi data (arrivals + price) and the season → score each crop's
   **crash risk 0–100**.
2. **Route** — match the surplus to the **nearest processing units** by distance and capacity.
3. **Alert** — the farmer's phone **rings and speaks the offer** in their language (voice + SMS) —
   no app, no reading.
4. **Confirm** — the farmer **presses 1** on any phone (or taps in the smartphone app) → the "yes" is
   recorded and the **unit is notified** → the officer sees it confirmed → the farmer brings the crop
   to the unit (via their FPO / a village aggregation point), which makes paste and **pays ₹9/kg**.
   The app makes the match and captures the commitment; it never moves the crop itself.

The crop that would rot (**agriculture**) becomes a product that lasts (**food processing**) made by
rural women earning money (**rural development**) — all three theme parts in one system.

---

## 4. Who it helps (three users)
- **The farmer** — warned *before* the crash; gets a real buyer at a fair price instead of dumping;
  needs only a basic phone and a voice call in their language. *Turns a total loss into income.*
- **The processing unit (women's SHGs / FPOs)** — gets cheap, fresh, assured raw material delivered
  and fills idle capacity; turns it into product worth far more. *Work and earnings for rural women.*
- **The government officer / APMC** — sees which crops are crashing across the district and routes
  the surplus with one click; finally makes the funded schemes act together in real time. *Their own
  programmes finally connect.*

The farmer never uses the dashboard — the complicated screen is the **officer's** control room; the
farmer just gets a **phone call**.

---

## 5. The economics (why ₹3.82 → ₹9 → ₹40)
Follow the tomato's value: raw in a glut ≈ **₹3.82/kg** (crashing, rotting) → turned into **paste**
≈ **₹40/kg** to a city buyer. That ~₹36 gap is created by *processing*. The question is who keeps it.
Today middlemen do. We reroute it so the **farmer** gets a fair cut (**₹9**), the **unit** still
profits (buys at ₹9, sells paste at ₹40 minus processing cost), and the **trader's margin** goes back
to the people who grew and processed the food.

**Why the unit pays ₹9 and not the ₹3.82 mandi price (the sharp question):**
1. **₹3.82 is what the farmer *receives*, not what a buyer *pays*.** Through the mandi (commission +
   fees + transport) a buyer's real landed cost is **₹12–15/kg** — so paying the farmer ₹9 direct is
   actually **cheaper** for the unit, and the farmer still gets **double**. We cut the middleman.
2. **Direct supply is fresher, sorted and guaranteed** — worth a small premium over the mandi scramble.
- Also: many SHGs/FPOs are **farmer-owned cooperatives** — the members *are* the farmers, so the
  value stays in the community.

The **₹9 is a fair-price floor** (in code: crash price + a margin, min ₹9): high enough to rescue the
farmer (above his ~₹4–5 cost), low enough the unit still profits. It's tunable per crop.

---

## 6. Government schemes we plug into (we don't compete — we're the missing wire)
- **Operation Greens** (Ministry of Food Processing, **₹500 cr**) — exists specifically to stabilise
  Tomato-Onion-Potato prices, promote FPOs, build processing links and cut post-harvest loss;
  expanded ("TOP to TOTAL") to 22 perishables.
- **PMFME** (PM Formalisation of Micro Food Processing Enterprises) — funds the SHG/FPO micro
  processing units: ~**₹40,000 seed per member**, up to **₹10 lakh** subsidy, One-District-One-Product.
- **10,000-FPO scheme** — built the farmer producer organisations, but ~**80% can't find buyers**.
- **e-NAM / FARMS** — government platforms that *list* markets and machinery; they answer "what
  exists," not "given a crashing crop right now, route the surplus to which unit."

**Our line:** every piece is funded and sitting there disconnected — we connect a crashing crop → an
idle unit → a buyer, in real time. So we're deployable on money already allocated.

---

## 7. Why this is strong / our differentiators
- **Solves two big problems at once** — farmer distress **and** food inflation.
- **Covers all three theme parts** — agriculture + food processing + rural development.
- **Survives the "doesn't the govt already do this?" question** — we complete their funded schemes.
- **Everyone gains** — nobody has to give up power (unlike ideas that just hand the weak party info).
- **The farmer needs no app / no literacy** — a voice call in their language.
- **Real, working prototype** — two portals + a live officer→phone handshake, not slideware.

---

## 8. What we built (the app, screen by screen)
A single Next.js web app, five connected routes:
- **`/` Landing** — the problem + three doors (Officer / Field Partner / Farmer) + Scheme & Gaps Matrix + "See the flow."
- **`/flow`** — a playable walkthrough (Detect → Route → Field Bridge / Krishi Sakhi → Listen / Visit → Confirmed).
- **`/admin` Officer console** — a clean dashboard: KPI cards, at-risk crops, crop-specific AgriStack farmer counts (e.g. 42 tomato growers across Vemgal, Sugatur, Narasapura), routing action, SvgMap of matched units, and confirmed pickup list with AgriStack IDs and outreach methods.
- **`/field` Field Partner console** — the human middle layer for smallholders without smartphones:
  - Role switcher: **Krishi Sakhi (KSCP)**, **CSC VLE**, and **FPO Coordinator**.
  - Village-scoped rosters filtered by crop and covered villages.
  - One-tap actions: 📞 **Call farmer**, 🚶 **Mark visited**, 🏢 **Came to center** (walk-in).
  - Built-in AgriStack CSV import / export.
- **`/farmer` Farmer app** — a full-screen **incoming call** that **speaks the alert** in English / Hindi / Kannada, displays the targeted AgriStack farmer identity, provides keypad response (1 = accept, 2 = decline), and highlights the "visit nearest center" zero-tech path.

**Live 3-layer handshake (no backend):** Officer routes surplus → `/field` receives crop roster → Field partner calls/visits farmer or farmer visits center → Farmer accepts → Real AgriStack identity relays back up to the Officer console pickup manifest. Cross-device via a **QR code**.

---

## 9. How the prediction works (transparent — a judge can read it)
For each crop we compute a **0–100 crash-risk score** from three stated signals with fixed weights:
- **Arrivals surge (45%)** — today's arrivals vs a normal early-season baseline.
- **Price slide (40%)** — how fast the price fell over the last 7 days.
- **Harvest season (15%)** — is it the crop's known glut month.
It never claims a future price — only "how likely is a crash right now." Code: `src/lib/engine/predictor.ts`.

---

## 10. How the matching works
Given a crop's surplus (tonnes) we find units that can process that crop, sort by **distance**
(haversine), and greedily fill their **weekly capacity**. For each match we compute the **offer price**
(fair floor) and the **impact** — rupees saved vs dumping, kg rescued, units engaged. Code:
`src/lib/engine/matching.ts`.

---

## 11. Tech architecture
- **One Next.js app** (Next 16, React 19, TypeScript) — no separate backend, no database.
- **Engine** (`src/lib/engine/`) — prediction + matching + seed data, all pure TypeScript.
- **Voice** — the phone speaks via the browser **Web Speech API** (`speechSynthesis`), en-IN / hi-IN /
  kn-IN. Free, offline, no Twilio.
- **Live handshake** — `BroadcastChannel` + `localStorage` (same browser) and a **QR** for a real second
  device. No server needed.
- **Fonts** — Space Grotesk (display) + IBM Plex Sans / Devanagari + Noto Sans Kannada (real Hindi &
  Kannada) + IBM Plex Mono.
- **Deploys to Vercel** in one click (root = `frontend`, no env vars).
- *(A legacy FastAPI backend from an earlier version is in `/backend`; the deployed app doesn't need it.)*

---

## 12. Data sources & resources (for the real version)
- **Agmarknet / data.gov.in** — daily mandi **prices + arrivals** per commodity per market (the fuel
  for the crash predictor).
- **Sowing / acreage data** (Agriculture Ministry) — for the "warn before planting" prevention layer.
- **Satellite crop health** (Bhuvan / Sentinel) — optional supporting signal.
- **PMFME / Operation Greens cluster lists** — the real directory of SHG/FPO processing units.
- **Bhashini** — government language-AI (voice/translation) for the alert in any Indian language.
- Demo today uses a **deterministic seed** shaped like a real **Kolar (Karnataka) tomato crash** so it
  runs offline and identically every time.

---

## 13. What's real vs demo vs roadmap
- **Real logic:** the crash-risk scoring, the distance/capacity matching, the rupee/kg impact, the
  trilingual alert, the browser voice, the live handshake, the QR handoff.
- **Demo data:** one district (Kolar), three crops (tomato/onion/beans), a 60-day series modelling a
  real tomato crash. Scales by adding data — no new code.
- **Roadmap (pitch, not built):** live Agmarknet + sowing feeds; the **prevention layer** (warn before
  planting); a real SMS/voice gateway; multi-device cloud sync; multi-district, multi-crop.

---

## 14. How to run & deploy
**Run locally:**
```
cd frontend
npm install
npm run dev        # http://localhost:3000
```
**Test on a real phone (same Wi-Fi)** — use a *production* build (dev doesn't hydrate on a 2nd device):
```
npm run build
npx next start -H 0.0.0.0 -p 3000
# open http://<your-lan-ip>:3000/admin on the laptop, route a crop, scan the QR on the phone
```
**Deploy (Vercel, ~2 min):** vercel.com → Add New → Project → import the repo → **Root Directory =
`frontend`** → Deploy. No env vars. Public HTTPS URL → the QR works on any phone (even mobile data) and
the farmer app installs to the home screen.

---

## 15. Team roles (6)
| Person | Owns |
|---|---|
| **Lead (Aman)** | Architecture, the demo, the story, keeping it on track |
| **Deploy + frontend polish** | Get it live on Vercel; own the deployed link; fix rough UI |
| **Data / engine** | Wire real Agmarknet data for a real district; keep the prediction defensible |
| **Pitch deck** | ~10 slides: problem → solution → demo → impact |
| **Field test** *(the differentiator)* | Test with 2–3 real farmers + an FPO/SHG or agri officer; record names + quotes |
| **Q&A + domain** | Own `FAQ.md`; know the schemes cold; anticipate judge questions |

---

## 16. The demo script (~2–3 min)
1. **Hook** — say the ₹5 / ₹25 line.
2. **Officer console** — point at the crash-risk score + price read; say "this crop is about to be dumped."
3. **Route it** — one click → impact numbers + the map (mandi → units) → "₹11.9 L saved, 6 units, 1,240 farmers alerted."
4. **The phone** — scan the QR on a real phone → it **rings and speaks** the offer in Hindi/Kannada → Accept → **Booked**.
5. **Close** — "The government funds every piece; we built the intelligence that connects them. And we tested it with real farmers — here's what they said."

---

## 17. Key facts & sources (cheat sheet)
- Onion farmers ₹5–7/kg vs ₹25 retail; ~43% of retail to farmers (Maharashtra), 2026 — *Down To Earth,
  govt price data.*
- Post-harvest loss ~₹1.53 lakh crore/year — *NABCONS study for MoFPI (data.gov.in).*
- Operation Greens ₹500 cr, TOP→TOTAL (22 perishables) — *Ministry of Food Processing (mofpi.gov.in).*
- PMFME: ₹40k/member seed, up to ₹10 lakh subsidy, ODOP — *MoFPI PMFME scheme.*
- 10,000-FPO scheme; ~80% struggle to find buyers — *NABARD / press coverage.*
- India's farmers going digital; Digital Agriculture Mission ₹2,817 cr; rural digital-literacy gap — *AMNEX, KPI Academy 2026.*
- Manual quality grading ~60% accurate (context for fair pricing) — *FOSS Analytics.*
> Always say a number's source if you can, and mark our on-screen numbers as an **illustrative demo**
> for one district.

---

## 18. Glossary
- **Mandi** — the government market yard where farmers sell their crop.
- **Glut** — too much of a crop arriving at once, crashing the price.
- **SHG (Self Help Group)** — a village women's savings + small-business group; often runs a processing unit.
- **FPO (Farmer Producer Organisation)** — a registered group/company of farmers, to sell in bulk.
- **APMC** — the committee that runs a mandi.
- **Arhtiya** — the mandi commission agent who buys the farmer's crop (often also his moneylender).
- **PMFME / Operation Greens / e-NAM / FARMS** — the government schemes/platforms above.
- **Agmarknet** — the government's daily mandi price + arrivals data portal.
- **Bhashini** — the government Indian-language AI (voice/translation).
- **Crash-risk score** — our 0–100 measure of how likely a crop's price is crashing now.
- **Processing / value addition** — turning raw crop into paste/flakes/pulp that lasts and sells for more.
