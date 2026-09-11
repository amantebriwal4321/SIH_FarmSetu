import FieldConsole from "./FieldConsole";
import { getCrops, getOverview, getCrop, getMatches, alertText, UNITS } from "@/lib/engine";
import { getBaseUrl } from "@/lib/baseUrl";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ crop?: string; role?: string; partner?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const initialCrop = sp.crop || "tomato";
  const initialPartner = sp.partner || "";
  const initialRole = sp.role || "";

  const crops = getCrops();
  const overview = getOverview();
  const { url: qrBase, isLan } = await getBaseUrl();
  const details = Object.fromEntries(
    crops.map((c) => {
      const m = getMatches(c.slug)!;
      return [
        c.slug,
        {
          detail: getCrop(c.slug)!,
          matches: m.matches,
          totals: m.totals,
          alert: alertText(c.slug)!,
        },
      ];
    })
  );

  return (
    <FieldConsole
      crops={crops}
      details={details}
      overview={overview}
      qrBase={qrBase}
      isLan={isLan}
      initialCrop={initialCrop}
      initialPartnerId={initialPartner}
      initialRole={initialRole}
    />
  );
}
