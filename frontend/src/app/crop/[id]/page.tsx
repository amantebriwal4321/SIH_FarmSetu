import { notFound } from "next/navigation";
import { fetchCropDetail, fetchMatches, fetchAlert, fetchUnits } from "@/lib/api";
import CropClient from "./CropClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await fetchCropDetail(id).catch(() => null);
  if (!detail) notFound();

  const [matchRes, alert, unitsRes] = await Promise.all([
    fetchMatches(id).catch(() => ({ matches: [], totals: null })),
    fetchAlert(id).catch(() => null),
    fetchUnits().catch(() => ({ units: [] })),
  ]);

  return (
    <CropClient
      detail={detail}
      matches={matchRes.matches}
      totals={matchRes.totals}
      alert={alert}
      units={unitsRes.units}
    />
  );
}
