import TopBar from "@/components/TopBar";
import { HeroScene, GlutScene, CrashScene, RerouteScene, CallScene, SunriseScene } from "@/components/scroll/scenes";
import { Ribbon } from "@/components/scroll/world";
import { getOverview, inr, num } from "@/lib/engine";

export default function Page() {
  const o = getOverview();
  return (
    <>
      <TopBar />
      <Ribbon />
      <main className="flex-1">
        <HeroScene />
        <GlutScene />
        <CrashScene />
        <RerouteScene />
        <CallScene />
        <SunriseScene />

        {/* quiet coda */}
        <section className="mx-auto max-w-6xl w-full px-5 py-14">
          <div className="card p-6 flex flex-wrap items-center gap-x-10 gap-y-4 justify-between">
            <Stat big={inr(o.potentialRupeesSaved)} small="rescuable this week vs dumping" />
            <Stat big={num(Math.round(o.kgAtRisk / 1000)) + " t"} small="surplus about to flood one district" />
            <Stat big={String(o.unitsAvailable)} small="idle processing units nearby" />
            <Stat big={num(o.farmersReached)} small="farmers reachable by phone" />
          </div>
          <p className="faint" style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.5 }}>
            Demo on real-shaped data for {o.district}. Every piece — Operation Greens, PMFME, the
            10,000-FPO scheme — is already funded by the government; Kisan Setu is the missing wire
            that connects them.
          </p>
        </section>
      </main>
    </>
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
