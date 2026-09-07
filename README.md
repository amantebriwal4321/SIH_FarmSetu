# Kisan Setu — Glut-to-Value engine

**SIH 2026 · Theme: Agriculture, FoodTech & Rural Development**

The farmer gets ₹5, you pay ₹25, and the crop still rots. Kisan Setu predicts a crop
price crash **before** it happens and routes the surplus to nearby SHG/FPO processing
units, so a crop that would be dumped becomes a product that lasts — made by rural women.

It covers all three parts of the theme at once:
- **Agriculture** — a crop about to be dumped
- **FoodTech** — turned into paste / flakes / pulp that keeps
- **Rural Development** — income and work for village women's units

Every piece is already funded by the government (Operation Greens ₹500 cr, PMFME,
the 10,000-FPO scheme). We are the missing wire that connects them in real time.

## What's in the prototype

- **Crash predictor** — a transparent rule (arrivals surge + price slide + harvest
  season → 0–100 risk). No claimed future price.
- **Matching engine** — routes the surplus to the nearest processing units by distance
  and capacity, and computes the impact (₹ saved, kg rescued, units engaged).
- **Dashboard** — district map, at-risk crops, KPIs.
- **Crop page** — 60-day price/arrivals/risk chart, the signal breakdown, the
  intervention ("Route this crop" → impact meter + routed map), a simulated
  farmer SMS/voice alert (English + Hindi), and a feedback loop with a live trust score.

Demo runs **offline** on a deterministic seed dataset modelled on a real Kolar tomato crash.

## Run it

Two terminals.

**Backend** (FastAPI + SQLite):
```bash
cd backend
python -m venv venv
venv/Scripts/python.exe -m pip install -r requirements.txt   # Windows
# source venv/bin/activate && pip install -r requirements.txt  # macOS/Linux
venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
API at http://127.0.0.1:8000/docs

**Frontend** (Next.js):
```bash
cd frontend
npm install
npm run dev
```
App at http://localhost:3000 (it proxies `/api/v1/*` to the backend, no CORS).

To reseed, delete `backend/kisan.db` and restart the backend.

## Architecture

```
seed / Agmarknet ─► predictor (risk 0-100) ─► matching engine ─► dashboard + alerts + feedback
        (backend, FastAPI + SQLite)                              (frontend, Next.js + recharts)
```

- `backend/app/predictor.py` — the transparent risk rule
- `backend/app/matching.py` — haversine + capacity matching + impact
- `backend/app/seed.py` — the deterministic demo dataset
- `backend/app/api.py` — the `/api/v1` endpoints
- `frontend/src/lib/api.ts` — the ONLY place the frontend talks to the backend

## Not built yet (roadmap, say in the pitch)

- Live Agmarknet + sowing feeds (seed replaces them for now)
- Prevention layer (warn before planting)
- Real SMS/voice gateway (alerts are simulated, shown on screen)
- Multi-district, multi-crop scale-out
