// Farmer registry with crop linkage — the local, offline stand-in for an AgriStack
// "Farmer Registry + Crop Sown Registry" export (consent-brokered via the UFSI API in
// production). Shape mirrors those registries so swapping this seed for a real UFSI pull
// is a one-adapter change. Deterministic and server-usable (no randomness at load).
//
// `crops` are engine crop slugs (tomato | onion | beans). Every farmer is reachable
// through THREE existing government channels — a Krishi Sakhi (KSCP), a CSC VLE, and an
// FPO — resolved by village via VILLAGE_PARTNERS below. That is what lets the field
// portal re-scope the same roster by whichever partner is doing the outreach.

export type PartnerRole = "krishi_sakhi" | "vle" | "fpo";

export type FarmerRecord = {
  farmerId: string;   // AgriStack-style Farmer ID
  name: string;
  village: string;
  phone: string;
  crops: string[];    // crop slugs this farmer sowed this season (Crop Sown Registry)
  plotAcres: number;
  fpo: string;        // FPO membership (10,000 FPO scheme)
};

export type FieldPartner = {
  id: string;
  name: string;
  role: PartnerRole;
  villages: string[];
};

// Real scheme roles → named people/bodies, each covering a cluster of villages.
export const FIELD_PARTNERS: FieldPartner[] = [
  // Krishi Sakhi — KSCP trained women para-extension workers (Karnataka is Phase 1)
  { id: "ks-lakshmi", name: "Lakshmi Devi", role: "krishi_sakhi", villages: ["Vemgal", "Sugatur", "Holur"] },
  { id: "ks-gowramma", name: "Gowramma R", role: "krishi_sakhi", villages: ["Narasapura", "Tekal", "Masti"] },
  { id: "ks-shivamma", name: "Shivamma K", role: "krishi_sakhi", villages: ["Huttur", "Arabikothanur", "Vokkaleri", "Dodda Ullarthi"] },
  // CSC Village Level Entrepreneurs
  { id: "vle-manjunath", name: "Manjunath (Vemgal CSC)", role: "vle", villages: ["Vemgal", "Narasapura", "Huttur"] },
  { id: "vle-ravi", name: "Ravi Kumar (Sugatur CSC)", role: "vle", villages: ["Sugatur", "Tekal", "Arabikothanur"] },
  { id: "vle-prakash", name: "Prakash (Masti CSC)", role: "vle", villages: ["Holur", "Masti", "Vokkaleri", "Dodda Ullarthi"] },
  // FPOs (match the processing-side unit names) under the 10,000 FPO scheme
  { id: "fpo-srinivaspura", name: "Srinivaspura Farmer Producer Co.", role: "fpo", villages: ["Vemgal", "Sugatur", "Narasapura", "Holur"] },
  { id: "fpo-chintamani", name: "Chintamani Farmer Producer Co.", role: "fpo", villages: ["Tekal", "Masti", "Huttur"] },
  { id: "fpo-mulbagal", name: "Mulbagal Food Cluster", role: "fpo", villages: ["Arabikothanur", "Vokkaleri", "Dodda Ullarthi"] },
];

// village → the partner for each role (derived from FIELD_PARTNERS)
export const VILLAGE_PARTNERS: Record<string, Record<PartnerRole, string>> = (() => {
  const map: Record<string, Record<PartnerRole, string>> = {};
  for (const p of FIELD_PARTNERS) {
    for (const v of p.villages) {
      map[v] = map[v] || ({} as Record<PartnerRole, string>);
      map[v][p.role] = p.name;
    }
  }
  return map;
})();

// Compact source rows: [name, village, crops(space-separated slugs), plotAcres]
// Distribution is deliberate — tomato dominates (the crash crop), onion is secondary,
// beans minor — so a tomato crash targets a very different set than an onion crash.
type Src = [string, string, string, number];
const ROWS: Src[] = [
  // Vemgal
  ["Ramesh Gowda", "Vemgal", "tomato", 2.5],
  ["Sujatha M", "Vemgal", "tomato onion", 1.8],
  ["Krishnappa", "Vemgal", "tomato", 3.0],
  ["Anitha R", "Vemgal", "onion", 1.2],
  ["Muniraju", "Vemgal", "tomato beans", 2.0],
  ["Lakshminarayana", "Vemgal", "tomato", 1.5],
  ["Devaraj", "Vemgal", "tomato onion", 2.2],
  // Sugatur
  ["Lakshmi Bai", "Sugatur", "tomato", 1.6],
  ["Venkatesh", "Sugatur", "tomato", 2.8],
  ["Nagaraj S", "Sugatur", "onion", 1.4],
  ["Padma", "Sugatur", "tomato onion", 2.0],
  ["Chinnappa", "Sugatur", "tomato", 1.1],
  ["Ravindra", "Sugatur", "beans", 0.9],
  ["Manjula", "Sugatur", "tomato", 1.9],
  // Narasapura
  ["Manjunath H", "Narasapura", "tomato", 2.3],
  ["Gangamma", "Narasapura", "tomato onion", 1.7],
  ["Srinivas", "Narasapura", "tomato", 2.6],
  ["Bhagya Lakshmi", "Narasapura", "onion", 1.0],
  ["Kariyappa", "Narasapura", "tomato", 3.2],
  ["Shanthamma", "Narasapura", "tomato beans", 1.3],
  // Holur
  ["Anand Kumar", "Holur", "tomato", 2.1],
  ["Rathnamma", "Holur", "tomato onion", 1.5],
  ["Govindaraju", "Holur", "tomato", 2.9],
  ["Saroja", "Holur", "onion", 1.2],
  ["Basavaraju", "Holur", "tomato", 1.8],
  ["Nanjundappa", "Holur", "beans", 1.0],
  // Tekal
  ["Venkataramana", "Tekal", "tomato", 2.4],
  ["Jayamma", "Tekal", "tomato", 1.6],
  ["Muniyappa", "Tekal", "tomato onion", 2.0],
  ["Kalavathi", "Tekal", "onion", 1.1],
  ["Shivakumar", "Tekal", "tomato", 2.7],
  ["Narasimhamurthy", "Tekal", "tomato beans", 1.4],
  // Masti
  ["Ramanjaneya", "Masti", "tomato", 2.2],
  ["Lalitha", "Masti", "tomato onion", 1.7],
  ["Chandrappa", "Masti", "tomato", 1.9],
  ["Sumithra", "Masti", "onion", 1.3],
  ["Byrappa", "Masti", "tomato", 3.1],
  ["Vasantha", "Masti", "beans", 0.8],
  // Huttur
  ["Nagaraju M", "Huttur", "tomato", 2.0],
  ["Indiramma", "Huttur", "tomato onion", 1.5],
  ["Prakash Reddy", "Huttur", "tomato", 2.6],
  ["Geetha", "Huttur", "onion", 1.0],
  ["Munikrishna", "Huttur", "tomato", 1.7],
  ["Sharada", "Huttur", "tomato beans", 1.2],
  // Arabikothanur
  ["Venkatappa", "Arabikothanur", "tomato", 2.3],
  ["Roopa", "Arabikothanur", "tomato", 1.4],
  ["Chikkanna", "Arabikothanur", "tomato onion", 2.1],
  ["Yashoda", "Arabikothanur", "onion", 1.1],
  ["Ramakrishna", "Arabikothanur", "tomato", 2.8],
  // Vokkaleri
  ["Doddappa", "Vokkaleri", "tomato", 1.9],
  ["Nirmala", "Vokkaleri", "tomato onion", 1.6],
  ["Sannappa", "Vokkaleri", "tomato", 2.4],
  ["Pushpa", "Vokkaleri", "onion", 1.2],
  ["Hanumantharaya", "Vokkaleri", "tomato beans", 1.5],
  // Dodda Ullarthi
  ["Gowri Shankar", "Dodda Ullarthi", "tomato", 2.2],
  ["Ambika", "Dodda Ullarthi", "tomato", 1.3],
  ["Krishnamurthy", "Dodda Ullarthi", "tomato onion", 2.0],
  ["Vijaya", "Dodda Ullarthi", "onion", 1.0],
  ["Siddaraju", "Dodda Ullarthi", "tomato", 2.7],
  ["Renukamma", "Dodda Ullarthi", "beans", 0.9],
];

function fpoForVillage(village: string): string {
  return VILLAGE_PARTNERS[village]?.fpo ?? "";
}

// Deterministic Farmer IDs (KA = Karnataka, KLR = Kolar) and demo phone numbers.
export const FARMERS: FarmerRecord[] = ROWS.map(([name, village, crops, acres], i) => ({
  farmerId: `KA-KLR-${String(1001 + i).padStart(4, "0")}`,
  name,
  village,
  phone: `9${String(440000000 + i * 137).slice(0, 9)}`,
  crops: crops.split(" "),
  plotAcres: acres,
  fpo: fpoForVillage(village),
}));
