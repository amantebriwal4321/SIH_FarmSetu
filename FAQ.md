# Kisan Setu — Judge Q&A prep

Quick-reference answers for the questions judges are most likely to ask. Lead with the
**bold one-liner**, then expand only if they want more.

---

## ⭐ 1. "The mandi pays ₹3.82/kg. Why does the SHG pay the farmer ₹9? Why not just buy at the mandi for ₹3.82?"

*(This is the sharpest question. Two reasons — lead with Reason 1.)*

**Reason 1 — ₹3.82 is what the farmer RECEIVES, not what a buyer PAYS.**
Nobody actually buys tomato at ₹3.82. To buy through the mandi you add the commission
agent's cut, mandi fees, loading and transport — a buyer's real landed cost is around
**₹12–15/kg**. So paying the farmer **₹9 direct at the farm gate is actually cheaper for the
unit than buying the same tomato through the mandi** — and the farmer still gets more than
double what the mandi gave him. We cut the middleman, and that margin gets split between the
farmer and the unit instead of going to a trader.

> "₹3.82 is what the farmer receives; a buyer pays ₹12–15 through the mandi. We cut the
> middleman — the farmer gets ₹9, the unit pays less than the mandi, and the trader's margin
> goes back to the people who grew and processed the food."

**Reason 2 — Direct supply is fresher, sorted and guaranteed.**
Mandi glut tomato is a day-old, mixed-quality pile you queue for. Buying direct from a known
farmer means fresher, picked-to-order, sorted produce — better paste yield and quality — plus a
reliable pipeline for the season instead of a one-off scramble. That's worth a small premium.

**Also true (back-up point):** many SHGs/FPOs are *farmer-owned cooperatives* — the members ARE
the farmers, so paying ₹9 keeps the processing value inside the community, not with a trader.

**The value chain (memorise this):** raw tomato in a glut ≈ ₹3.82/kg → turned into **paste** ≈
₹40/kg. The ₹9 is a fair floor in the middle: high enough to rescue the farmer (above his
~₹4–5 harvest+transport cost), low enough the unit still profits. It's tunable per crop.

---

## 2. "Doesn't the government already do this? (FARMS / e-NAM / Operation Greens)"

**We don't compete with those — we're the missing wire that connects them in real time.**
- **Operation Greens** (₹500 cr) funds price stabilisation and processing links.
- **PMFME** funds the SHG/FPO processing units.
- The **10,000-FPO scheme** built the farmer groups (but 80% can't find buyers).
- **e-NAM / FARMS** list markets and machinery — they answer "what exists," not "given a
  crashing crop right now, route the surplus to which unit."
Every piece is funded and sitting there disconnected. We connect a crashing crop → an idle unit
→ a buyer, before it rots. So we're deployable on money already allocated.

---

## 3. "Isn't this just another marketplace / listing app?"

**No — the core is prediction + routing, not a listing.** A marketplace waits for you to search.
We *detect* the crash early from mandi data, *decide* which units can absorb the surplus by
distance and capacity, and *push* the alert to the farmer. The intelligence is the product; the
transaction is the easy part.

---

## 4. "How does the crash prediction work? Is it accurate?"

**It's a transparent rule, not a black box — and it never claims a future price.** Three stated
signals with fixed weights: arrivals surge vs a normal season (45%), price slide over 7 days
(40%), harvest-glut month (15%) → a 0–100 crash-risk score. We only say "how likely is a crash
right now," which is honest and defensible. A judge can read exactly how the number is made.

---

## 5. "Most farmers have no smartphone and can't read. How do they use it?"

**The farmer never opens an app.** They get a phone call that *speaks* the offer in their own
language (English / Hindi / Kannada), plus an SMS — works on a ₹800 keypad phone. The complex
dashboard is for the officer, not the farmer. Adoption goes through the FPO/SHG and the
village-level worker, which is how rural tech actually spreads.

---

## 6. "How do the alerts actually go out? (You're not using Twilio)"

**Sending a voice call/SMS is a solved commodity — any gateway (Twilio/Exotel/MSG91) does it.**
In the demo the phone speaks the alert using the browser's built-in voice, so there's no cost or
dependency on stage. In production it's one integration; a voice call to an Indian number needs
no special registration. We deliberately didn't hard-depend on a paid gateway for the prototype.

---

## 7. "How does it scale to all of India?"

**It's pure software on public data — add a district by adding its data, no new code.** No
hardware in the field, nothing to install per farm. Runs on a free tier. The logic (risk score,
matching) is identical everywhere; only the data changes.

---

## 8. "What's real vs. what's demo?"

**Real:** the risk scoring, the distance/capacity matching, the rupee/kg impact, the trilingual
alert, the browser voice, the live officer→farmer handshake.
**Demo data:** one district (Kolar), three crops, a 60-day series modelled on a real tomato
crash. Scales by adding data.

---

## 9. "Why will the farmer and the unit actually adopt it?"

**Everyone gains — nobody has to give up power.** Farmer beats a total loss; unit gets cheap,
fresh, assured supply and fills idle capacity; officer finally sees and acts across the district.
Contrast with ideas that only give the weak party information — here the deal itself improves for
both sides, so both push the same way.

---

## 10. "Where does the data come from?"

**Public government feeds:** Agmarknet (daily mandi prices + arrivals), sowing/acreage data,
satellite crop health. The demo uses a deterministic seed shaped like a real Kolar tomato crash
so it runs offline and identically every time.

---

## 11. "How do you make money / is it sustainable?"

**It sits inside schemes that are already funded** (Operation Greens, PMFME) — the government
already pays to prevent exactly this waste. A light fee per routed tonne, paid by the processing
unit that gains cheap supply, can sustain it. **It is never a cost to the farmer.**

---

## 12. "What if the prediction is wrong?"

**It's a risk flag that prompts a human officer's decision, not an automated trade.** The officer
reviews and confirms before anything is routed. A false alarm costs nothing; a missed crash is
the status quo we're improving. Over time, officer feedback tunes the thresholds.

---

## 13. "Won't the traders / mandi lobby block this?"

**We route through farmer-owned FPOs/SHGs and government officers — the people the schemes are
built to empower.** We're aligned with the ministry's own mandate, not fighting it. And we don't
ban the mandi; we just give the farmer a better, direct option before the crop is dumped.

---

## 14. "Why Kolar / why tomato?"

**Kolar is a real tomato belt, and tomato is the textbook glut crop** — the 2026 crashes
(farmers dumping tomatoes/onions while retail stayed high) are exactly the pattern we model.
Tomato → paste is a proven value-addition path.

---

## 15. "What's your tech stack?"

**A single Next.js app — no separate server, no database needed to run the demo.** The prediction
and matching engine is transparent TypeScript; the phone voice uses the browser Web Speech API;
the live officer→farmer handshake uses the browser's BroadcastChannel. Deploys to Vercel in one
click. (An earlier FastAPI version exists in the repo but isn't needed.)

---

## 16. "What did you build vs. reuse?"

**Be honest:** the data pipeline/scoring/dashboard patterns come from our own prior open-source
work (StackRadar), repointed at this problem. New for this: the crash-risk model, the matching
engine, the two portals, the trilingual voice alert, and the live handshake.

---

## 17. "What's next / roadmap?" (pitch, don't claim as built)

- Live Agmarknet + sowing feeds (demo uses a seed today)
- **Prevention layer** — warn farmers *before* they plant ("everyone's planting tomato, prices
  will crash, consider X") — genuinely novel
- Real SMS/voice gateway; multi-device sync; multi-district, multi-crop
- Field test with real farmers + an FPO/SHG before finals (put their quotes in the deck)

---

## The 30-second pitch (fallback if you blank)

> The farmer gets ₹5, you pay ₹25, and the crop still rots. When a crop floods the market the
> price crashes, the farmer dumps it, and idle women's processing units sit a few km away. Every
> piece to fix this is already funded by the government — we built the one thing missing: the
> intelligence that spots the crash, routes the surplus to the unit that can save it, and calls
> the farmer in their own language before it rots. One crop that would be wasted becomes a product
> that lasts, made by rural women.
