import TopBar from "@/components/TopBar";
import FlowClient from "./FlowClient";
import { getCrop, getMatches, alertText } from "@/lib/engine";

export const dynamic = "force-dynamic";

export default function Page() {
  const detail = getCrop("tomato")!;
  const m = getMatches("tomato")!;
  const a = alertText("tomato")!;
  return (
    <>
      <TopBar active="flow" />
      <FlowClient detail={detail} matches={m.matches} totals={m.totals} alert={a} />
    </>
  );
}
