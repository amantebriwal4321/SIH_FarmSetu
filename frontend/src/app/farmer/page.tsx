import FarmerApp from "./FarmerApp";
import { alertText } from "@/lib/engine";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cropParam = typeof sp.crop === "string" ? sp.crop : undefined;
  const auto = sp.auto === "1";
  const incoming = cropParam ? alertText(cropParam) : null;
  const sample = alertText("tomato")!;
  return <FarmerApp sample={sample} incoming={incoming} auto={auto} />;
}
