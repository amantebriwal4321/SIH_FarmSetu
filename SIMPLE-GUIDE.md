# Kisan Setu — The Simple Guide (read this first)

Plain-words explanation of the whole project. Read it top to bottom and you'll
understand exactly what we built, what every number means, and what is real vs demo.

---

## 1. What is this app? (one line)

When too much of a crop comes to the market at once, the price crashes and farmers
throw the crop away. **Our app spots that crash early, finds a nearby factory that can
use the crop, and calls the farmer to sell it there for a fair price instead of
dumping it.**

**A few words first:**
- **Mandi** = the government market where farmers sell crops.
- **Glut** = too much crop arrives at once → the price falls.
- **SHG** = a village women's group that runs a small food factory.
- **FPO** = a group of farmers that sells together.
- **Processing unit** = a small factory that turns tomato into **paste** (which lasts
  months and sells for more).

---

## 2. Who uses it? (three people)

1. **The officer** (government / APMC) — sees the whole district on a computer screen
   and clicks to help.
2. **The farmer** — just gets a **phone call**. Never touches a computer.
3. **The processing unit** (the SHG/FPO factory) — receives the crop and turns it into
   paste.

---

## 3. The officer screen — every number explained

When you open `/admin`, here is what each thing means:

| What you see | What it means (simple) |
|---|---|
| **Rupees rescuable** (₹19,63,300) | Money that can be saved this week if we act, instead of the crop being dumped. |
| **Crops at risk** | How many crops are close to crashing right now. |
| **Surplus at risk** (tonnes) | How much extra crop is about to flood the market. |
| **Farmers reachable** (1,240) | How many farmers we could call by phone. |
| **Crop list with a number 0–100** | Each crop's **crash score**. 100 = crashing badly now, 0 = safe. |
| **Price drop (₹18 → ₹3.82)** | What the price *was* vs what it is *now*. |
| **"Alert farmers & route surplus" button** | One click: send the crop to nearby factories + call the farmers. |
| **Map (red dot → green dots)** | Red = the crashing mandi. Green = factories the crop is sent to (with tonnes). |
| **Rupees saved / Kg rescued / Units** | The result after you click — the "good you did." |
| **"Why ₹9 when mandi is ₹3?" box** | Explains why the factory pays more than the mandi. |
| **"Who's coming" pickup list** | Names of farmers who said yes (name, village, tonnes). |
| **QR code** | Scan it with a phone to open the farmer's app. |

---

## 4. Where does the data come from? Real or fake? (the honest answer)

**This is the most important thing to say correctly to judges.**

> **The app does NOT pull live data from any website right now.** It uses a
> **hand-made dataset** built to look exactly like a **real 2026 Kolar tomato crash.**
> The *method* is real; the *numbers on screen* are a realistic demo.

Each piece, honestly:

| Thing on screen | Real or demo? |
|---|---|
| The prices + arrivals (₹18 → ₹3.82 over 60 days) | **Demo** — hand-built, but shaped like a real crash. Not fetched live. |
| The crash score (0–100) | **Real method** — a real formula, run on the demo data. |
| The factories (SHG/FPO names, places) | **Realistic but illustrative** — real-type names/places in Kolar, not a verified live list. |
| Collection points + phone numbers | **Made up for the demo** (fake numbers). |
| Farmer names in the pickup list (Ramesh, Lakshmi…) | **Made up for the demo** (there is no farmer login). |
| Paste selling price (₹42–48) | **Realistic market value** (illustrative). |
| The government schemes (below) | **100% real.** |
| The big statistics (₹5–7/kg, 43%, ₹1.5 lakh crore) | **Real** — from public reports. |

**What to say:** *"The prediction and matching logic is real and transparent. The demo
runs on one district with data shaped like a real tomato crash, so it works offline and
never breaks on stage. To go live, we just plug in the government's Agmarknet feed — no
new code."*

---

## 5. The websites & offices — what each one is

**Where the real version gets its data:**
- **Agmarknet** (agmarknet.gov.in) — the government's daily **mandi price + arrivals**
  data. This is our main fuel.
- **data.gov.in** — the government's open-data website that hosts the Agmarknet numbers.
- **eNAM** (enam.gov.in) — another government market-price source.

**The government money already funding the pieces (we just connect them):**
- **Operation Greens** (Ministry of Food Processing) — govt scheme to stop
  tomato/onion/potato prices crashing.
- **PMFME** — govt money that builds the small SHG/FPO factories.
- **10,000 FPO Scheme** — govt scheme that created the farmer groups.

**Your line:** *"The government already pays for the factories, the farmer groups, and
the price data. Nobody connected them in real time. That's the one thing we built."*

(Full clickable links are in `DATA-SOURCES.md`.)

---

## 6. How we solve it — the whole thing in 4 steps

1. **Detect** — read the price data, give each crop a crash score.
2. **Route** — find nearby factories that can take the extra crop.
3. **Call** — phone the farmer in their own language; they press 1 to say yes.
4. **Deliver** — the crop goes to the factory (via the FPO van); the farmer gets paid
   ₹9/kg; the factory makes paste.

**One crop that would rot → becomes a product that lasts → made by rural women → farmer
earns instead of losing.** That is the whole idea.

---

## 7. What you can point to on screen (say "we built this")

- **Landing page** — a scrolling story with real farm graphics, then a clear
  "what this is / how it works" section.
- **Officer page** — district numbers, crop list with a 0–100 crash score, the price
  drop, one action button, the map, impact numbers, the "why ₹9" box, the "who's coming"
  pickup list, and a QR code.
- **Farmer page** — works like a real phone call (not a complex app); **Basic phone**
  mode (press 1/2 on a keypad) and **Smartphone** mode; **speaks aloud in English, Hindi
  and Kannada**; a pause button; the "why ₹9" box; a "Booked" screen telling the farmer
  where the crop is collected.
- **Flow page** — a play-button, 5-step walkthrough + a "how the deal works" strip.
- **Three languages** everywhere on the farmer side, with real voice.

---

*More detail, if you want it: `OVERVIEW.md` (full reference), `FAQ.md` (judge Q&A),
`DATA-SOURCES.md` (links).*
