// ---------- Shared data for the EcoSort-Vision landing page ----------

export type CategoryKey = "plastic" | "metal" | "organic" | "paper" | "glass" | "other";

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  plastic: "#38bdf8",
  metal: "#cbd5e1",
  organic: "#34d399",
  paper: "#fbbf24",
  glass: "#67e8f9",
  other: "#a78bfa",
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  plastic: "Plastic",
  metal: "Metal",
  organic: "Organic",
  paper: "Paper",
  glass: "Glass",
  other: "Other",
};

export const CATEGORY_ORDER: CategoryKey[] = ["plastic", "metal", "organic", "paper", "glass", "other"];

// ---------- Live sorting demo ----------

export interface DemoItem {
  id: number;
  name: string;
  category: CategoryKey;
  confidence: number;
  detail: string;
}

export const DEMO_ITEMS: DemoItem[] = [
  { id: 1, name: "PET Bottle", category: "plastic", confidence: 98.2, detail: "rPET feedstock · high grade" },
  { id: 2, name: "Aluminium Can", category: "metal", confidence: 96.7, detail: "non-ferrous · smelt ready" },
  { id: 3, name: "Banana Peel", category: "organic", confidence: 99.1, detail: "compost stream · 3–4 wk cycle" },
  { id: 4, name: "Corrugated Box", category: "paper", confidence: 97.4, detail: "OCC · fiber 92% intact" },
  { id: 5, name: "Glass Jar", category: "glass", confidence: 95.9, detail: "cullet · color sorted" },
  { id: 6, name: "E-waste PCB", category: "other", confidence: 93.6, detail: "hazmat · certified recovery" },
];

// ---------- Pipeline stepper ----------

export interface PipelineStep {
  icon: "truck" | "grid" | "brain" | "cogs" | "factory" | "shield" | "store" | "refresh";
  title: string;
  description: string;
  stat: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { icon: "truck", title: "Collection", description: "Curbside & smart-bin pickup routed by fill-level telemetry.", stat: "92% route efficiency" },
  { icon: "grid", title: "Size Separation", description: "Screening grids split the stream before the optics even start.", stat: "3-stage trommel" },
  { icon: "brain", title: "AI Identification", description: "Vision models classify every item at conveyor speed — 8ms per object.", stat: "8ms / object" },
  { icon: "cogs", title: "Automated Segregation", description: "Air jets and robotic arms route each item to its material stream.", stat: "96.8% purity" },
  { icon: "factory", title: "Processing", description: "Washing, shredding and extrusion turn waste into clean feedstock.", stat: "5 processing lines" },
  { icon: "shield", title: "Verification", description: "Every batch is lab-tested for grade and purity before listing.", stat: "Lab certified" },
  { icon: "store", title: "Marketplace", description: "Recovered materials are listed for B2B purchase with full history.", stat: "1,200+ buyers" },
  { icon: "refresh", title: "Reuse", description: "Manufacturers buy feedstock and close the loop on new products.", stat: "CO₂ avoided" },
];

// ---------- Marketplace ----------

export interface Listing {
  id: string;
  material: string;
  grade: string;
  purity: number;
  quantity: string;
  price: string;
  location: string;
  category: CategoryKey;
  supplier: string;
}

export const LISTINGS: Listing[] = [
  { id: "ECO-PET-2026-001", material: "Recycled PET Flakes", grade: "Food-Grade A", purity: 99.2, quantity: "24.5 t", price: "$0.62", location: "Mumbai, IN", category: "plastic", supplier: "GreenLoop Polymers" },
  { id: "ECO-ALU-2026-014", material: "Aluminium Scrap", grade: "UBC 99.7%", purity: 98.1, quantity: "8.2 t", price: "$1.84", location: "Bengaluru, IN", category: "metal", supplier: "RecoverAll Metals" },
  { id: "ECO-HDPE-2026-031", material: "HDPE Granules", grade: "Natural GP", purity: 97.4, quantity: "16.0 t", price: "$0.78", location: "Pune, IN", category: "plastic", supplier: "Circular Plastics Co." },
  { id: "ECO-ORG-2026-009", material: "Mature Compost", grade: "FCO Grade I", purity: 94.6, quantity: "42.0 t", price: "$0.11", location: "Chennai, IN", category: "organic", supplier: "SoilCycle Farms" },
  { id: "ECO-PAP-2026-022", material: "OCC Paper Bales", grade: "Grade 11", purity: 96.3, quantity: "30.0 t", price: "$0.19", location: "Delhi, IN", category: "paper", supplier: "FibreFirst" },
  { id: "ECO-GLS-2026-007", material: "Glass Cullet", grade: "Clear", purity: 98.7, quantity: "12.8 t", price: "$0.09", location: "Hyderabad, IN", category: "glass", supplier: "CulletWorks" },
];

export const MARKETPLACE_FILTERS: { label: string; value: CategoryKey | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Plastic", value: "plastic" },
  { label: "Metal", value: "metal" },
  { label: "Organic", value: "organic" },
  { label: "Paper", value: "paper" },
  { label: "Glass", value: "glass" },
];

// ---------- Traceability ----------

export interface TraceStep {
  icon: "truck" | "brain" | "cogs" | "factory" | "shield" | "store" | "package";
  title: string;
  detail: string;
  meta: string;
}

export const TRACE_STEPS: TraceStep[] = [
  { icon: "truck", title: "Waste Collection", detail: "Collected via bin route BLR-07, sealed with GPS custody chain.", meta: "Jul 28 · 06:12 IST" },
  { icon: "brain", title: "AI Identification", detail: "Classified PET with 98.2% confidence, 3 camera passes.", meta: "Jul 28 · 09:40 IST" },
  { icon: "cogs", title: "Segregation", detail: "Air-jet routed to stream 3 · purity check inline 97.9%.", meta: "Jul 28 · 09:41 IST" },
  { icon: "factory", title: "Processing", detail: "Washed ×2, hot-washed, dried, extruded to flake 12mm.", meta: "Jul 30 · 14:05 IST" },
  { icon: "shield", title: "Quality Verification", detail: "Lab batch test passed · IV 0.78 · moisture 0.3% · food-safe.", meta: "Aug 02 · 11:22 IST" },
  { icon: "store", title: "Marketplace Listing", detail: "Listed as ECO-PET-2026-001 · 24.5 t · $0.62/kg.", meta: "Aug 03 · 10:00 IST" },
  { icon: "package", title: "Business Purchase", detail: "Ordered by GreenLoop Polymers · dispatch due Aug 14.", meta: "Aug 12 · 16:48 IST" },
];

// ---------- Impact ----------

export interface ImpactStat {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  note: string;
}

export const IMPACT_STATS: ImpactStat[] = [
  { label: "Waste Processed", value: 48_600, suffix: "kg", note: "this quarter" },
  { label: "Materials Recovered", value: 34_200, suffix: "kg", note: "back in circulation" },
  { label: "CO₂ Emissions Avoided", value: 61.4, suffix: "t", decimals: 1, note: "vs. virgin production" },
  { label: "Active Marketplace Buyers", value: 1284, suffix: "", note: "across 6 cities" },
];

export const MATERIAL_COMPOSITION = [
  { name: "Plastic", value: 34, color: "#38bdf8" },
  { name: "Paper", value: 22, color: "#fbbf24" },
  { name: "Organic", value: 18, color: "#34d399" },
  { name: "Glass", value: 14, color: "#67e8f9" },
  { name: "Metal", value: 12, color: "#cbd5e1" },
];

// ---------- Footer / SDGs ----------

export interface Sdg {
  number: string;
  title: string;
  description: string;
}

export const SDGS: Sdg[] = [
  { number: "9", title: "Industry, Innovation & Infrastructure", description: "Automated sorting infrastructure modernises waste value chains." },
  { number: "11", title: "Sustainable Cities & Communities", description: "Smart bins and pickup routing keep cities cleaner with less effort." },
  { number: "12", title: "Responsible Consumption & Production", description: "Recovered feedstock displaces virgin materials in new products." },
  { number: "13", title: "Climate Action", description: "Every tonne recycled avoids the emissions of landfilling and virgin production." },
];
