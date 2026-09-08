import TopBar from "@/components/TopBar";
import AdminConsole from "./AdminConsole";
import { getCrops, getOverview, getCrop, getMatches, alertText, UNITS } from "@/lib/engine";

export const dynamic = "force-dynamic";

export default function Page() {
  const crops = getCrops();
  const overview = getOverview();
  const details = Object.fromEntries(
    crops.map((c) => {
      const m = getMatches(c.slug)!;
      return [c.slug, { detail: getCrop(c.slug)!, matches: m.matches, totals: m.totals, alert: alertText(c.slug)! }];
    })
  );
  return (
    <>
      <TopBar active="admin" />
      <AdminConsole overview={overview} crops={crops} units={UNITS} details={details} />
    </>
  );
}
