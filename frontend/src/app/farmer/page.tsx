import TopBar from "@/components/TopBar";
import FarmerApp from "./FarmerApp";
import { getCrop, getMatches, alertText } from "@/lib/engine";
import type { AlertContent } from "@/components/AlertCard";

export const dynamic = "force-dynamic";

export default function Page() {
  const c = getCrop("tomato")!;
  const m = getMatches("tomato")!;
  const a = alertText("tomato")!;
  const sample: AlertContent = {
    cropName: c.name,
    english: a.english,
    hindi: a.hindi,
    unitName: m.matches[0].unitName,
    offer: m.matches[0].offerPrice,
    crash: m.totals.crashPrice,
  };
  return (
    <>
      <TopBar active="farmer" />
      <FarmerApp sample={sample} />
    </>
  );
}
