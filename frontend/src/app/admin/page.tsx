import AdminConsole from "./AdminConsole";
import { packAll } from "@/lib/engine";
import { loadEngine } from "@/lib/aws/catalog";
import { getBaseUrl } from "@/lib/baseUrl";
import { getLivePrices } from "@/lib/liveprices";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { engine, source } = await loadEngine();
  const { crops, overview, units, details } = packAll(engine);
  const { url: qrBase, isLan } = await getBaseUrl();
  const live = await getLivePrices("Tomato");
  return (
    <AdminConsole
      overview={overview}
      crops={crops}
      units={units}
      details={details}
      qrBase={qrBase}
      isLan={isLan}
      live={live}
      dataSource={source}
    />
  );
}
