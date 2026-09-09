import AdminConsole from "./AdminConsole";
import { getCrops, getOverview, getCrop, getMatches, alertText, UNITS } from "@/lib/engine";
import { getBaseUrl } from "@/lib/baseUrl";

export const dynamic = "force-dynamic";

export default async function Page() {
  const crops = getCrops();
  const overview = getOverview();
  const { url: qrBase, isLan } = await getBaseUrl();
  const details = Object.fromEntries(
    crops.map((c) => {
      const m = getMatches(c.slug)!;
      return [c.slug, { detail: getCrop(c.slug)!, matches: m.matches, totals: m.totals, alert: alertText(c.slug)! }];
    })
  );
  return <AdminConsole overview={overview} crops={crops} units={UNITS} details={details} qrBase={qrBase} isLan={isLan} />;
}
