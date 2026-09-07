import { fetchOverview, fetchCrops, fetchUnits } from "@/lib/api";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [overview, cropsRes, unitsRes] = await Promise.all([
    fetchOverview().catch(() => null),
    fetchCrops().catch(() => ({ crops: [] })),
    fetchUnits().catch(() => ({ units: [] })),
  ]);

  return (
    <DashboardClient
      overview={overview}
      crops={cropsRes.crops}
      units={unitsRes.units}
    />
  );
}
