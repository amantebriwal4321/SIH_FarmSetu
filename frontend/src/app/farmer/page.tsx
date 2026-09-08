import TopBar from "@/components/TopBar";
import FarmerApp from "./FarmerApp";
import { alertText } from "@/lib/engine";

export const dynamic = "force-dynamic";

export default function Page() {
  const sample = alertText("tomato")!;
  return (
    <>
      <TopBar active="farmer" />
      <FarmerApp sample={sample} />
    </>
  );
}
