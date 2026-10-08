/** Canonical v1: source values are immutable; IDs are illustrative, not internal Fishwife IDs. */
export type Classification =
  | "PUBLIC FACT"
  | "SYNTHETIC DEMO INPUT"
  | "DERIVED"
  | "SCALESIGHT INTERPRETATION";
export type Confidence = "LOW" | "MODERATE" | "HIGH";
export type Action =
  | "BUY"
  | "HOLD"
  | "WATCH"
  | "REALLOCATE"
  | "SPLIT"
  | "RESEQUENCE"
  | "REDUCE_NEXT_BUY";
export type Lineage = {
  classification: Classification;
  source: string;
  context: string;
};
const input = (section: number, context = "current-plan"): Lineage => ({
  classification: "SYNTHETIC DEMO INPUT",
  source: `Technical specification §${section}`,
  context,
});
const publicFact = (source: string, context = "public-context"): Lineage => ({
  classification: "PUBLIC FACT",
  source,
  context,
});
const reviewed = (section: number, context: string): Lineage => ({
  classification: "SCALESIGHT INTERPRETATION",
  source: `Technical specification §${section}`,
  context,
});
export type Sku = Lineage & {
  id: string;
  name: string;
  short: string;
  category: string;
  onHand: number;
  incoming: number;
  etaWeeks: number | null;
  baseline: number;
  current: number;
  leadWeeks: number | null;
  safetyWeeks: number;
  action: Action;
  label: string;
  color: string;
  image: string | null;
  identity: Lineage;
  unitCost: number | null;
  moq: number | null;
  economicsSource: Lineage;
};
const rows: [
  string,
  string,
  string,
  string,
  number,
  number,
  number | null,
  number,
  number,
  number | null,
  number,
  Action,
  string,
  string,
  boolean,
][] = [
  [
    "TUN-SL",
    "Albacore Tuna with Spanish Lemon",
    "Spanish Lemon Tuna",
    "Tuna",
    15400,
    12000,
    3,
    4300,
    5600,
    10,
    3,
    "BUY",
    "REVIEW BUY",
    "pink",
    true,
  ],
  [
    "TUN-SP",
    "Albacore Tuna in Spicy Olive Oil",
    "Spicy Tuna",
    "Tuna",
    34000,
    18000,
    4,
    6200,
    6500,
    10,
    3,
    "WATCH",
    "HOLD / WATCH",
    "red",
    true,
  ],
  [
    "TUN-OO",
    "Albacore Tuna in Olive Oil",
    "Olive Oil Tuna",
    "Tuna",
    42000,
    18000,
    5,
    5200,
    5000,
    10,
    3,
    "HOLD",
    "HOLD",
    "blue",
    false,
  ],
  [
    "TUN-SG",
    "Albacore Tuna with Soy Ginger",
    "Soy Ginger Tuna",
    "Tuna",
    31000,
    12000,
    7,
    3100,
    3500,
    10,
    3,
    "WATCH",
    "WATCH",
    "pink",
    false,
  ],
  [
    "SAL-GL",
    "Gold Label Smoked Salmon",
    "Gold Label Salmon",
    "Salmon",
    20000,
    9000,
    4,
    3300,
    3600,
    6,
    2.5,
    "HOLD",
    "HOLD",
    "yellow",
    true,
  ],
  [
    "SAL-FBJ",
    "Smoked Salmon with Fly By Jing Chili Crisp",
    "FBJ Salmon",
    "Salmon",
    8800,
    6000,
    4,
    2700,
    3000,
    6,
    2.5,
    "SPLIT",
    "INTERVENE",
    "red",
    true,
  ],
  [
    "TRT-ORIG",
    "Smoked Rainbow Trout",
    "Rainbow Trout",
    "Trout",
    4200,
    0,
    null,
    1900,
    1700,
    null,
    4,
    "REALLOCATE",
    "REALLOCATE",
    "blue",
    true,
  ],
  [
    "SAR-PL",
    "Sardines with Preserved Lemon",
    "Preserved Lemon Sardines",
    "Sardines",
    30000,
    15000,
    6,
    4200,
    4500,
    9,
    3,
    "HOLD",
    "HOLD",
    "yellow",
    true,
  ],
  [
    "SAR-HP",
    "Sardines with Hot Pepper",
    "Hot Pepper Sardines",
    "Sardines",
    28000,
    12000,
    8,
    2500,
    2800,
    9,
    3,
    "REDUCE_NEXT_BUY",
    "REDUCE NEXT BUY",
    "red",
    false,
  ],
  [
    "MUS-BP",
    "Mussels with Basil Pesto",
    "Basil Pesto Mussels",
    "Mussels",
    7800,
    12000,
    5,
    2400,
    3000,
    10,
    3,
    "RESEQUENCE",
    "RESEQUENCE",
    "green",
    true,
  ],
  [
    "MUS-SPG",
    "Mussels with Sweet Pepper + Garlic",
    "Sweet Pepper Mussels",
    "Mussels",
    29000,
    12000,
    7,
    2700,
    2800,
    10,
    3,
    "HOLD",
    "HOLD",
    "pink",
    true,
  ],
  [
    "MAC-CHILI",
    "Slow Smoked Mackerel with Chili Flakes",
    "Chili Mackerel",
    "Mackerel",
    24000,
    10000,
    6,
    2900,
    3100,
    8,
    2.5,
    "HOLD",
    "HOLD",
    "yellow",
    false,
  ],
];
// User-approved illustrative supplement. No values claim to be Fishwife actuals.
const supplementSource: Lineage = {
  classification: "SYNTHETIC DEMO INPUT",
  source:
    "User-supplied Canonical Synthetic Fixture v1.1 · docs/SYNTHETIC_FIXTURE_V1_1.md",
  context: "illustrative-v1.1",
};
const demandHistory: Record<string, number[]> = {
  "TUN-SL": [
    4200, 4300, 4350, 4350, 5900, 6400, 5200, 4800, 5100, 5250, 5450, 5700,
    5600,
  ],
  "TUN-SP": [
    6050, 6100, 6200, 6150, 6250, 6300, 6350, 6250, 6400, 6425, 6475, 6525,
    6500,
  ],
  "TUN-OO": [
    5300, 5250, 5200, 5225, 5150, 5100, 5075, 5050, 5000, 4950, 5000, 4975,
    5000,
  ],
  "TUN-SG": [
    3000, 3050, 3100, 3150, 3200, 3250, 3275, 3300, 3350, 3400, 3450, 3475,
    3500,
  ],
  "SAL-GL": [
    3250, 3300, 3325, 3350, 3375, 3400, 3450, 3475, 3500, 3525, 3550, 3575,
    3600,
  ],
  "SAL-FBJ": [
    2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 2925, 2975, 3025, 3050,
    3000,
  ],
  "TRT-ORIG": [
    1900, 1900, 1850, 1800, 1750, 1700, 1650, 1600, 1550, 1500, 1600, 1650,
    1700,
  ],
  "SAR-PL": [
    4100, 4150, 4200, 4225, 4250, 4300, 4325, 4350, 4400, 4425, 4450, 4475,
    4500,
  ],
  "SAR-HP": [
    2400, 2450, 2500, 2525, 2550, 2600, 2625, 2675, 2700, 2750, 2775, 2825,
    2800,
  ],
  "MUS-BP": [
    2300, 2350, 2400, 2425, 2450, 2500, 2550, 2600, 2700, 2800, 2900, 3050,
    3000,
  ],
  "MUS-SPG": [
    2650, 2675, 2700, 2725, 2680, 2710, 2740, 2760, 2780, 2790, 2810, 2820,
    2800,
  ],
  "MAC-CHILI": [
    2850, 2875, 2900, 2925, 2950, 2975, 3000, 3025, 3050, 3075, 3100, 3125,
    3100,
  ],
};
const channelShares: Record<string, number[]> = {
  "TUN-SL": [30, 40, 0, 0, 10, 20],
  "TUN-SP": [15, 15, 20, 25, 5, 20],
  "TUN-OO": [20, 25, 25, 0, 10, 20],
  "TUN-SG": [45, 0, 0, 0, 20, 35],
  "SAL-GL": [45, 0, 0, 0, 20, 35],
  "SAL-FBJ": [20, 25, 0, 0, 15, 40],
  "TRT-ORIG": [15, 25, 0, 30, 5, 25],
  "SAR-PL": [15, 20, 20, 0, 10, 35],
  "SAR-HP": [40, 0, 0, 0, 20, 40],
  "MUS-BP": [40, 0, 0, 0, 20, 40],
  "MUS-SPG": [40, 0, 0, 0, 20, 40],
  "MAC-CHILI": [15, 20, 20, 0, 10, 35],
};
const economics: Record<string, number[]> = {
  "TUN-SL": [3.4, 18000],
  "TUN-SP": [3.3, 18000],
  "TUN-OO": [3.2, 18000],
  "TUN-SG": [3.6, 15000],
  "SAL-GL": [4.8, 9000],
  "SAL-FBJ": [5.4, 6000],
  "TRT-ORIG": [4.5, 12000],
  "SAR-PL": [3.1, 15000],
  "SAR-HP": [3.2, 12000],
  "MUS-BP": [3.6, 12000],
  "MUS-SPG": [3.5, 12000],
  "MAC-CHILI": [3.7, 10000],
};
const skus: Sku[] = rows.map(
  ([
    id,
    name,
    short,
    category,
    onHand,
    incoming,
    etaWeeks,
    baseline,
    current,
    leadWeeks,
    safetyWeeks,
    action,
    label,
    color,
    hasImage,
  ]) => ({
    ...input(7),
    id,
    name,
    short,
    category,
    onHand,
    incoming,
    etaWeeks,
    baseline,
    current,
    leadWeeks,
    safetyWeeks,
    action,
    label,
    color,
    image: hasImage ? `/brand/products/${id}.webp` : null,
    identity: publicFact("https://eatfishwife.com/collections/tinned-fish"),
    unitCost: economics[id][0],
    moq: economics[id][1],
    economicsSource: supplementSource,
  }),
);
export type PO = Lineage & {
  id: string;
  sku: string;
  quantity: number;
  partner: string;
  originalArrival: string;
  updatedArrival: string | null;
  production: null;
  ready: null;
  transit: null;
  status: string;
};
const poRows = [
  ["FW-2411", "TUN-SL", 12000, "Spain Partner A", "2026-10-29", "AT RISK"],
  ["FW-2412", "TUN-SP", 18000, "Spain Partner A", "2026-11-05", "CONFIRMED"],
  ["FW-2420", "TUN-OO", 18000, "Spain Partner A", "2026-11-12", "CONFIRMED"],
  [
    "FW-1184",
    "SAL-FBJ",
    6000,
    "Washington Partner",
    "2026-11-05",
    "RECOVERY REQUIRED",
  ],
  ["FW-2204", "SAR-PL", 15000, "Galicia Partner", "2026-11-19", "CONFIRMED"],
  [
    "FW-2310",
    "MUS-BP",
    12000,
    "Galicia Partner",
    "2026-11-12",
    "CAPACITY REVIEW",
  ],
  [
    "FW-2311",
    "MUS-SPG",
    12000,
    "Galicia Partner",
    "2026-11-26",
    "RESEQUENCE CANDIDATE",
  ],
] as const;
const pos: PO[] = poRows.map(
  ([id, sku, quantity, partner, originalArrival, status]) => ({
    ...input(9),
    id,
    sku,
    quantity,
    partner,
    originalArrival,
    status,
    updatedArrival: null,
    production: null,
    ready: null,
    transit: null,
  }),
);
const bom = [
  ["SAL-FBJ", 4300],
  ["SAL-GL", 12000],
  ["SAR-PL", 12000],
  ["MUS-SPG", 14000],
  ["TUN-SP", 10000],
  ["TUN-SL", 3400],
  ["TRT-ORIG", 400],
] as const;
const history = [
  ["2026-08-10", 5900],
  ["2026-08-17", 6400],
  ["2026-08-24", 5200],
  ["2026-08-31", 4800],
  ["2026-09-07", 5100],
  ["2026-09-14", 5250],
  ["2026-09-21", 5450],
  ["2026-09-28", 5700],
  ["2026-10-05", 5600],
] as const;
export type Decision = Lineage & {
  sku: string;
  label: string;
  action: Action;
  changed: string;
  whyNow: string;
  decision: string;
  matters: string;
  unchanged: string;
  recommendation: string;
  href: string;
  confidence: Confidence | null;
};
const decisions: Decision[] = [
  {
    ...reviewed(23, "spanish-lemon"),
    sku: "TUN-SL",
    label: "REVIEW BUY",
    action: "BUY",
    changed:
      "Post-collaboration demand remains approximately 28% above the pre-event baseline.",
    whyNow:
      "Current synthetic inventory covers only 2.8 weeks while the next production commitment carries a much longer lead time.",
    decision:
      "Decide whether another Spain production slot should be reserved before the next retailer reorder cycle confirms the full quantity.",
    matters:
      "30.2% on paper vs 27.9% that has actually persisted. The signal supports a capacity reservation, with the final buy quantity still under review.",
    unchanged:
      "The current commitment may not cover persistent elevated demand. Exact stockout timing awaits an agreed receipt convention.",
    recommendation:
      "Reserve the next production slot. Confirm final incremental quantity after the next retailer reorder cycle.",
    href: "/demand",
    confidence: "MODERATE",
  },
  {
    ...reviewed(12, "trout-allocation"),
    sku: "TRT-ORIG",
    label: "REALLOCATE",
    action: "REALLOCATE",
    changed:
      "Supply is constrained across channels: 4,200 tins against 6,800 tins of four-week unconstrained demand.",
    whyNow:
      "The 2,600-tin gap cannot be resolved with reliable new supply inside the planning horizon.",
    decision:
      "Decide which account and subscription commitments to protect and suspend discretionary bundle allocation.",
    matters: "2,600 tins cannot be bought, so the decision is who to protect.",
    unchanged:
      "Discretionary demand competes with a protected allocation that already uses all 4,200 tins.",
    recommendation:
      "Protect committed accounts and subscriptions first. Remove discretionary trout demand from bundle assembly until reliable replenishment timing returns.",
    href: "/allocation",
    confidence: "LOW",
  },
  {
    ...reviewed(13, "fbj-recovery"),
    sku: "SAL-FBJ",
    label: "SPLIT PO",
    action: "SPLIT",
    changed:
      "An illustrative one-week receipt delay creates 6,200 tins of service exposure.",
    whyNow: "8,800 tins on hand cover only 2.9 weeks at 3,000 tins per week.",
    decision:
      "Approve the recovery option and incremental freight before the supplier cut-off.",
    matters:
      "Compare the incremental cost of each response against service protection using the approved synthetic v1.1 receipt dates.",
    unchanged:
      "Accepting the delay leaves approximately 6,200 tins exposed before the delayed receipt, excluding safety stock.",
    recommendation:
      "Bring 4,000 units forward, keep 2,000 on standard freight and temporarily remove incremental DTC promotional demand from the protected plan.",
    href: "/po-intervention",
    confidence: null,
  },
  {
    ...reviewed(14, "mussel-resequence"),
    sku: "MUS-BP",
    label: "RESEQUENCE",
    action: "RESEQUENCE",
    changed:
      "Basil Pesto has 2.6 weeks of cover; Sweet Pepper + Garlic has 10.4.",
    whyNow:
      "Shared illustrative packing capacity is committed to the wrong flavor timing.",
    decision:
      "Decide whether to resequence 8,000 tins before cannery lock, at $2,100 incremental cost.",
    matters:
      "Move existing capacity rather than add net capacity. The cost of adding capacity is not specified.",
    unchanged:
      "The current sequence leaves Basil Pesto more exposed while Sweet Pepper carries materially more cover.",
    recommendation:
      "Move 8,000 Basil Pesto tins forward by three weeks and push the same amount of Sweet Pepper production later.",
    href: "/supply-commitments",
    confidence: null,
  },
];
function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}
export const fixture = deepFreeze({
  version: "fishwife-v1.1",
  supplement: supplementSource,
  modeledDemand: Object.keys(demandHistory).map((sku) => ({
    ...supplementSource,
    sku,
    weekly: demandHistory[sku],
    shares: channelShares[sku],
    confidence: (sku === "TRT-ORIG"
      ? "LOW"
      : ["TUN-SL", "MUS-BP"].includes(sku)
        ? "MODERATE"
        : "HIGH") as Confidence,
  })),
  historyStart: "2026-07-13",
  timeline: {
    ...input(6),
    planningDate: "2026-10-08",
    week: "2026-10-05",
    actualsThrough: "2026-10-07",
    refresh: "08 Oct · 06:00 PT",
    nextReview: "2026-10-12",
    horizon: 13,
    currency: "USD",
    unit: "tin",
  },
  skus,
  pos,
  decisions,
  channels: [
    "ALL",
    "DTC",
    "Target",
    "Whole Foods",
    "Costco / Club",
    "Amazon",
    "Independent / Wholesale",
  ].map((name) => ({
    ...publicFact("Technical specification §24"),
    name,
    modelingSource: supplementSource,
  })),
  history: history.map(([week, units]) => ({
    ...input(11, "spanish-lemon-history"),
    week,
    units,
  })),
  event: {
    ...publicFact("https://www.sweetgreen.com/landing/fishwife"),
    name: "Sweetgreen collaboration",
    start: "2026-08-11",
    end: "2026-08-24",
  },
  allocation: {
    ...input(12, "trout-allocation"),
    inventory: 4200,
    demand: 6800,
    discretionaryQuantity: null,
    displacementPriority: null,
    requirements: [
      ["Costco", 1800],
      ["Target", 1000],
      ["Kroger / wholesale", 500],
      ["DTC subscriptions", 600],
      ["QA / service buffer", 300],
    ].map(([name, units]) => ({
      ...input(12, "trout-allocation"),
      name: String(name),
      units: Number(units),
    })),
  },
  bundle: {
    ...input(15, "starter-pack-separate-snapshot"),
    name: "Starter Pack",
    planned: 1200,
    releasedTrout: null,
    components: bom.map(([sku, free]) => ({
      ...input(15, "starter-pack-separate-snapshot"),
      sku,
      free,
      quantity: 1,
      protectedElsewhere: null,
      composition: publicFact(
        "https://eatfishwife.com/products/the-starter-pack",
        "starter-pack-bom",
      ),
    })),
  },
  fbj: {
    ...input(13, "fbj-recovery"),
    delayWeeks: 1,
    exposure: 6200,
    earlyQuantity: 4000,
    standardQuantity: 2000,
    supplementSource,
    earlyDate: "2026-10-29",
    expeditedDate: "2026-10-29",
    delayedDate: "2026-11-12",
    receiptConvention: "receipt-before-demand" as const,
    promoReduction: [0, 0, 200, 1100, 1100],
    protectedDemand: 1900,
    options: [
      {
        ...input(13, "fbj-accept"),
        id: "accept",
        label: "ACCEPT DELAY",
        cost: 0,
        effect: "6,200 exposed",
        early: 0,
        standard: 6000,
        shortage: 6200,
      },
      {
        ...input(13, "fbj-expedite"),
        id: "expedite",
        label: "FULL EXPEDITE",
        cost: 8400,
        effect: "Nearly full protection",
        early: 6000,
        standard: 0,
        shortage: 200,
        supplementSource,
      },
      {
        ...input(13, "fbj-split"),
        id: "split",
        label: "SPLIT SHIPMENT",
        cost: 5600,
        effect: "Most exposure removed",
        early: 4000,
        standard: 2000,
        shortage: 2200,
        supplementSource,
      },
      {
        ...input(13, "fbj-split-promo"),
        id: "split-promo",
        label: "SPLIT + REDUCE PROMO",
        cost: 5600,
        effect: "Protected-account gap closed",
        early: 4000,
        standard: 2000,
        shortage: 0,
        supplementSource,
      },
    ],
  },
  mussels: {
    ...input(14, "mussel-resequence"),
    moved: 8000,
    advanceWeeks: 3,
    cost: 2100,
    supplementSource,
    earlyDate: "2026-10-22",
    remainingDate: "2026-11-12",
    displacedDate: "2026-12-17",
    sweetPepperRetainedDate: "2026-11-26",
    addedCapacityCost: null,
  },
  scenario: {
    ...supplementSource,
    sku: "SAL-GL",
    originalReceipt: "2026-11-05",
    protectedBaseline: 2500,
    splitQuantity: 5000,
    splitPremium: 3600,
    expeditePremium: 6300,
    threshold: 4000,
    exposureThreshold: 4000,
    pullForward: [5000, 4600, 3000, 1800, 3600, 3600],
    presets: [
      {
        label: "Demand holds higher",
        demandChange: 25,
        delay: 0,
        response: "SPLIT",
      },
      { label: "Supplier slips", demandChange: 0, delay: 2, response: "SPLIT" },
      {
        label: "Retailer pulls demand forward",
        demandChange: 0,
        delay: 0,
        response: "WATCH / HOLD",
      },
    ],
  },
});
export const missing = "Not specified in demo source.";
export const empty = "No supplied observations for this context.";
export const disclaimer =
  "Public product and company facts are based on publicly available information supplied in the research. Inventory, demand, PO quantities and timing, costs, forecasts, allocation and planning numbers are illustrative and do not represent Fishwife internal data. Recommendations are illustrative demonstrations of the ScaleSight planning workflow. The demo does not imply a live integration is deployed.";
export const planningNote =
  "Aggregate demand moved only 8.9%, but the changes are concentrated in a few SKUs where timing, supply and channel commitments make the impact materially different. The current recommendation is to intervene selectively rather than increase inventory broadly.";
export const learningCopy =
  "The collaboration has ended, but demand remains above baseline. That is stronger evidence than the original event spike alone. We would reserve capacity now while keeping the final incremental quantity under review until another reorder cycle confirms the persistence.";
