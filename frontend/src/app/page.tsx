import Link from "next/link";
import TopBar from "@/components/TopBar";
import { getOverview, inr, num } from "@/lib/engine";

export default function Page() {
  const o = getOverview();
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-6xl w-full px-5 flex-1">
        {/* hero */}
        <section className="pt-14 pb-10">
          <div className="eyebrow">Agriculture · FoodTech · Rural Development</div>
          <h1 className="display" style={{ fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.05, marginTop: 12, maxWidth: 900 }}>
            The farmer gets ₹5. You pay ₹25.<br />
            And the crop still <span className="mark">rots</span>.
          </h1>
          <p className="muted" style={{ fontSize: 17, marginTop: 18, maxWidth: 620, lineHeight: 1.55 }}>
            Kisan Setu spots a crop price crash before it happens and routes the surplus to
            nearby processing units — so a crop that would be dumped becomes a product that lasts,
            made by rural women.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link href="/flow" className="btn btn-primary btn-lg">▶ Watch the 60-second flow</Link>
            <Link href="/admin" className="btn btn-lg">Open officer console</Link>
            <Link href="/farmer" className="btn btn-lg">Open farmer app</Link>
          </div>
        </section>

        {/* the two sides */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4">
          <Door
            href="/admin"
            tag="For the officer"
            title="Officer console"
            body="See which crops are about to crash across the district, then route the surplus to processing units in one click. This is the control room."
            cta="Open console →"
            tone="ink"
          />
          <Door
            href="/farmer"
            tag="For the farmer"
            title="Farmer app"
            body="No dashboard, no reading. A phone call and a message in your own language: don’t dump your crop — sell it here for a fair price. Tap to accept."
            cta="Open farmer app →"
            tone="brand"
          />
        </section>

        {/* the loop */}
        <section className="py-12">
          <div className="eyebrow mb-4">How it works</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Step n="1" title="Detect" body="Public mandi data shows arrivals flooding in and price sliding. We score the crash risk 0–100." />
            <Step n="2" title="Route" body="We match the surplus to the nearest processing units by distance and capacity, before it’s dumped." />
            <Step n="3" title="Alert" body="The farmer’s phone rings and speaks the offer in their language. They tap accept. The crop is saved." />
          </div>
        </section>

        {/* quiet stat line */}
        <section className="pb-16">
          <div className="card p-6 flex flex-wrap items-center gap-x-10 gap-y-4 justify-between">
            <Stat big={inr(o.potentialRupeesSaved)} small="rescuable this week vs dumping" />
            <Stat big={num(Math.round(o.kgAtRisk / 1000)) + " t"} small="surplus about to flood one district" />
            <Stat big={String(o.unitsAvailable)} small="idle processing units nearby" />
            <Stat big={num(o.farmersReached)} small="farmers reachable by phone" />
          </div>
          <p className="faint" style={{ fontSize: 12, marginTop: 12 }}>
            Demo on real-shaped data for {o.district}. Every piece — Operation Greens, PMFME, the
            10,000-FPO scheme — is already funded; Kisan Setu is the missing wire that connects them.
          </p>
        </section>
      </main>
    </>
  );
}

function Door({ href, tag, title, body, cta, tone }: { href: string; tag: string; title: string; body: string; cta: string; tone: "ink" | "brand" }) {
  const dark = tone === "ink";
  return (
    <Link href={href} className="card p-7 group" style={{
      background: dark ? "var(--ink)" : "var(--brand)",
      borderColor: dark ? "var(--ink)" : "var(--brand-deep)",
      color: "#fff", display: "block",
    }}>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600 }}>{tag}</div>
      <div className="display" style={{ fontSize: 26, fontWeight: 700, marginTop: 10 }}>{title}</div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 10, opacity: 0.9 }}>{body}</p>
      <div style={{ marginTop: 16, fontWeight: 600, fontSize: 15 }} className="group-hover:underline">{cta}</div>
    </Link>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="kpi-num" style={{ fontSize: 15, color: "var(--turmeric-deep)" }}>{n}</div>
      <div className="display" style={{ fontSize: 19, fontWeight: 600, marginTop: 8 }}>{title}</div>
      <p className="muted" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div>
      <div className="kpi-num" style={{ fontSize: 26 }}>{big}</div>
      <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>{small}</div>
    </div>
  );
}
