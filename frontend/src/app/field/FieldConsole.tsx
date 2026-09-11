"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashShell from "@/components/dash/DashShell";
import KpiCard from "@/components/dash/KpiCard";
import RiskBadge from "@/components/RiskBadge";
import Toast from "@/components/Toast";
import QRCodeView from "@/components/QRCodeView";
import RegistryUpload from "@/components/RegistryUpload";
import {
  sendDispatch,
  onDispatch,
  readLatestDispatch,
  respondDispatch,
  type Dispatch,
  type PickupFarmer,
} from "@/lib/dispatch";
import {
  inr,
  num,
  farmersForCrop,
  partnersByRole,
  FIELD_PARTNERS,
  type PartnerRole,
  type FarmerRecord,
  type FieldPartner,
  type CropSummary,
  type CropDetail,
  type Match,
  type MatchTotals,
  type AlertBundle,
} from "@/lib/engine";
import { speak, stopSpeak } from "@/lib/speak";
import { STR, loadLang, type Lang } from "@/lib/i18n";

type Detail = { detail: CropDetail; matches: Match[]; totals: MatchTotals; alert: AlertBundle };

export default function FieldConsole({
  crops,
  details,
  overview,
  qrBase,
  isLan,
}: {
  crops: CropSummary[];
  details: Record<string, Detail>;
  overview: { district: string; farmersReached: number };
  qrBase: string;
  isLan: boolean;
}) {
  const [role, setRole] = useState<PartnerRole>("krishi_sakhi");
  const [partnerId, setPartnerId] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>(crops[0]?.slug ?? "tomato");
  const [activeDispatch, setActiveDispatch] = useState<Dispatch | null>(null);
  const [bookedFarmers, setBookedFarmers] = useState<Record<string, { tonnes: number; method: string }>>({});
  const [toast, setToast] = useState<string>("");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(loadLang());
    try {
      const savedRole = localStorage.getItem("ks_field_role") as PartnerRole;
      if (savedRole && (savedRole === "krishi_sakhi" || savedRole === "vle" || savedRole === "fpo")) {
        setRole(savedRole);
      }
      const savedPartner = localStorage.getItem("ks_field_partner_id");
      if (savedPartner) {
        setPartnerId(savedPartner);
      }
    } catch {}

    const latest = readLatestDispatch();
    if (latest) {
      setActiveDispatch(latest);
      if (latest.cropSlug) setSelectedCrop(latest.cropSlug);
    }

    return onDispatch((d) => {
      setActiveDispatch(d);
      if (d.cropSlug) setSelectedCrop(d.cropSlug);
      setToast(`New alert received: ${d.cropNames.en} price crash routed!`);
    });
  }, []);

  const availablePartners = partnersByRole(role);
  const currentPartner =
    availablePartners.find((p) => p.id === partnerId) || availablePartners[0] || FIELD_PARTNERS[0];

  const handleRoleChange = (newRole: PartnerRole) => {
    setRole(newRole);
    try {
      localStorage.setItem("ks_field_role", newRole);
    } catch {}
    const partners = partnersByRole(newRole);
    if (partners[0]) {
      setPartnerId(partners[0].id);
      try {
        localStorage.setItem("ks_field_partner_id", partners[0].id);
      } catch {}
    }
  };

  const handlePartnerChange = (id: string) => {
    setPartnerId(id);
    try {
      localStorage.setItem("ks_field_partner_id", id);
    } catch {}
  };

  const d = details[selectedCrop] || details[crops[0].slug];
  const assignedFarmers = farmersForCrop(selectedCrop, {
    role,
    partnerName: currentPartner.name,
  });

  const handleFarmerAction = (
    farmer: FarmerRecord,
    method: "call" | "visited" | "center"
  ) => {
    const estTonnes = Math.round(farmer.plotAcres * 1.5 * 10) / 10;
    const pickup: PickupFarmer = {
      farmerId: farmer.farmerId,
      name: farmer.name,
      village: farmer.village,
      tonnes: estTonnes,
      method,
    };

    setBookedFarmers((prev) => ({
      ...prev,
      [farmer.farmerId]: { tonnes: estTonnes, method },
    }));

    if (activeDispatch) {
      respondDispatch(activeDispatch.id, "accepted", pickup, method);
    } else {
      respondDispatch(`${selectedCrop}-field-${Date.now()}`, "accepted", pickup, method);
    }

    if (method === "call") {
      const msg = d.alert.texts[lang] || d.alert.texts.en;
      speak(msg, lang);
      setToast(`Calling ${farmer.name} (${farmer.phone}) · Playing offer ₹${d.alert.offer}/kg`);
    } else if (method === "visited") {
      setToast(`Marked ${farmer.name} visited in ${farmer.village} · ${estTonnes} t booked`);
    } else {
      setToast(`${farmer.name} booked in person at center · ${estTonnes} t allocated`);
    }
  };

  const totalBookedTonnes = Object.values(bookedFarmers).reduce((a, b) => a + b.tonnes, 0);
  const bookedCount = Object.keys(bookedFarmers).length;

  return (
    <DashShell
      title="Field Partner Console"
      subtitle="The human bridge: Krishi Sakhis, CSC VLEs, and FPOs reaching farmers without smartphones."
      active="field"
    >
      {/* Role Selection Tabs */}
      <section className="card p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow mb-1">Human Middle Layer · Select Operating Model</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRoleChange("krishi_sakhi")}
                className="btn"
                style={{
                  background: role === "krishi_sakhi" ? "var(--brand)" : "var(--dash-bg)",
                  color: role === "krishi_sakhi" ? "#fff" : "var(--ink)",
                  borderColor: role === "krishi_sakhi" ? "var(--brand)" : "var(--dash-line)",
                  fontWeight: 600,
                  fontSize: 13.5,
                }}
              >
                👩‍🌾 Krishi Sakhi (KSCP)
              </button>
              <button
                onClick={() => handleRoleChange("vle")}
                className="btn"
                style={{
                  background: role === "vle" ? "var(--brand)" : "var(--dash-bg)",
                  color: role === "vle" ? "#fff" : "var(--ink)",
                  borderColor: role === "vle" ? "var(--brand)" : "var(--dash-line)",
                  fontWeight: 600,
                  fontSize: 13.5,
                }}
              >
                🏢 CSC VLE Center
              </button>
              <button
                onClick={() => handleRoleChange("fpo")}
                className="btn"
                style={{
                  background: role === "fpo" ? "var(--brand)" : "var(--dash-bg)",
                  color: role === "fpo" ? "#fff" : "var(--ink)",
                  borderColor: role === "fpo" ? "var(--brand)" : "var(--dash-line)",
                  fontWeight: 600,
                  fontSize: 13.5,
                }}
              >
                🤝 FPO Coordinator
              </button>
            </div>
          </div>

          {/* Assigned Partner dropdown */}
          <div className="flex flex-col gap-1 min-w-[240px]">
            <span className="faint" style={{ fontSize: 12 }}>
              Active {role === "krishi_sakhi" ? "Para-Worker" : role === "vle" ? "VLE Agent" : "Coordinator"}
            </span>
            <select
              value={currentPartner.id}
              onChange={(e) => handlePartnerChange(e.target.value)}
              className="select"
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "#fff",
                fontWeight: 600,
                fontSize: 13.5,
              }}
            >
              {availablePartners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.villages.join(", ")})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scheme explanation banner */}
        <div
          className="panel p-3 mt-4"
          style={{
            background: "rgba(22, 101, 52, 0.04)",
            borderColor: "rgba(22, 101, 52, 0.2)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {role === "krishi_sakhi" && (
            <span>
              <b>Krishi Sakhi Convergence Programme (KSCP)</b>: MoA&FW + MoRD initiative (70,000 certified women para-extension workers, Karnataka in Phase 1). Equipped with the crop-sown registry to visit marginal farmers directly.
            </span>
          )}
          {role === "vle" && (
            <span>
              <b>CSC Village Level Entrepreneurs</b>: 5+ lakh Common Service Centers across rural India. Serves as walk-in touchpoints where smallholders without smartphones verify their mandi alerts.
            </span>
          )}
          {role === "fpo" && (
            <span>
              <b>10,000 FPO Scheme</b>: Coordinates village collection hubs and van routing directly to PMFME processing units.
            </span>
          )}
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KpiCard
          filled
          label="Assigned Farmers"
          value={String(assignedFarmers.length)}
          caption={`${d.detail.name} growers in ${currentPartner.villages.length} villages`}
        />
        <KpiCard
          label="Coverage Area"
          value={String(currentPartner.villages.length) + " villages"}
          caption={currentPartner.villages.slice(0, 3).join(", ")}
        />
        <KpiCard
          label="Booked Farmers"
          value={`${bookedCount} / ${assignedFarmers.length}`}
          caption="via call, field visit, or center"
        />
        <KpiCard
          label="Committed Volume"
          value={`${totalBookedTonnes.toFixed(1)} t`}
          caption="ready for collection van"
        />
      </section>

      {/* Main workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Incoming order banner + Farmer Roster */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Active Dispatch Banner */}
          <div
            className="card p-5"
            style={{
              borderLeft: "5px solid var(--brand)",
              background: "#fff",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="pill" style={{ background: "var(--brand)", color: "#fff", fontSize: 11 }}>
                  DISPATCHED FROM OFFICER
                </span>
                <h3 className="display" style={{ fontSize: 18, fontWeight: 700 }}>
                  {d.detail.name} Surplus Route
                </h3>
              </div>
              <RiskBadge label={d.detail.label} />
            </div>

            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
              Officer routed surplus to <b>{d.alert.unitName || "Processing Unit"}</b> paying{" "}
              <b style={{ color: "var(--brand-deep)" }}>₹{d.alert.offer}/kg</b> (vs Mandi crash of ₹{d.alert.crash}/kg). Collection point:{" "}
              <b>{d.alert.collectionPoint || "Village FPO Hub"}</b>.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="faint" style={{ fontSize: 12 }}>Filter by crop:</span>
              {crops.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCrop(c.slug)}
                  className="pill"
                  style={{
                    cursor: "pointer",
                    border: selectedCrop === c.slug ? "1px solid var(--brand)" : "1px solid var(--border)",
                    background: selectedCrop === c.slug ? "var(--brand)" : "transparent",
                    color: selectedCrop === c.slug ? "#fff" : "var(--ink)",
                    fontSize: 12,
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Farmer Roster */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="display" style={{ fontSize: 18, fontWeight: 700 }}>
                  AgriStack Target Roster ({assignedFarmers.length})
                </h2>
                <div className="faint" style={{ fontSize: 12 }}>
                  Verified growers with sowed {d.detail.name.toLowerCase()} plots under {currentPartner.name}
                </div>
              </div>
              <a
                href="/data/farmers.csv"
                download="farmers.csv"
                className="link"
                style={{ fontSize: 12 }}
              >
                📥 Download AgriStack CSV
              </a>
            </div>

            {assignedFarmers.length === 0 ? (
              <div className="panel p-6 text-center faint">
                No farmers registered for {d.detail.name} in this partner&apos;s covered villages ({currentPartner.villages.join(", ")}).
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {assignedFarmers.map((f) => {
                  const booked = bookedFarmers[f.farmerId];
                  const estTonnes = Math.round(f.plotAcres * 1.5 * 10) / 10;
                  return (
                    <div
                      key={f.farmerId}
                      className="panel p-3.5 flex flex-wrap items-center justify-between gap-3"
                      style={{
                        background: booked ? "#f0fdf4" : "#fff",
                        borderColor: booked ? "#86efac" : "var(--dash-line)",
                      }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{f.name}</span>
                          <span className="mono faint" style={{ fontSize: 11, background: "var(--dash-bg)", padding: "1px 5px", borderRadius: 4 }}>
                            {f.farmerId}
                          </span>
                          {booked && (
                            <span className="pill" style={{ fontSize: 10.5, background: "var(--brand)", color: "#fff", padding: "2px 6px" }}>
                              ✓ Booked ({booked.method === "center" ? "Center" : booked.method === "visited" ? "Visited" : "Call"})
                            </span>
                          )}
                        </div>
                        <div className="faint" style={{ fontSize: 12 }}>
                          📍 {f.village} · {f.plotAcres} acres · ~{estTonnes} t harvest · 📞 {f.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFarmerAction(f, "call")}
                          className="btn"
                          style={{ fontSize: 12, padding: "6px 10px" }}
                          title="Trigger automated audio call"
                        >
                          📞 Call
                        </button>
                        <button
                          onClick={() => handleFarmerAction(f, "visited")}
                          className="btn"
                          style={{ fontSize: 12, padding: "6px 10px" }}
                          title="Mark visited in person"
                        >
                          🚶 Visited
                        </button>
                        <button
                          onClick={() => handleFarmerAction(f, "center")}
                          className="btn btn-primary"
                          style={{ fontSize: 12, padding: "6px 10px" }}
                          title="Walk-in at center"
                        >
                          🏢 At Center
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Delivery Link, QR Code, and Scheme Summary */}
        <div className="flex flex-col gap-5">
          <div className="card p-5 flex flex-col items-center text-center">
            <div className="eyebrow" style={{ alignSelf: "flex-start" }}>
              Test Farmer Interface
            </div>
            <div className="my-3">
              <QRCodeView
                url={`${qrBase}/farmer?crop=${selectedCrop}&auto=1`}
                size={140}
              />
            </div>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45 }}>
              Scan to preview the automated voice alert as experienced by farmers in this cluster.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Link
                href={`/farmer?crop=${selectedCrop}&auto=1`}
                className="btn btn-primary"
                style={{ fontSize: 12 }}
              >
                Open Farmer View →
              </Link>
              <Link href="/admin" className="btn" style={{ fontSize: 12 }}>
                Officer View
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <div className="eyebrow mb-2">Government Integration Pitch</div>
            <div className="flex flex-col gap-2 faint" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              <div>
                🟢 <b>AgriStack UFSI</b>: Provides plot-level crop sown registry without manual survey overhead.
              </div>
              <div>
                👩‍🌾 <b>Krishi Sakhi Yojana</b>: Deploys 70,000 certified village workers (NRLM) as the human touchpoint.
              </div>
              <div>
                🏢 <b>CSC VLE Network</b>: 5 lakh digital centers act as offline booking counters for elderly or non-tech farmers.
              </div>
            </div>
          </div>

          <RegistryUpload />
        </div>
      </section>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </DashShell>
  );
}
