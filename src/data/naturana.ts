import { operatingRows } from "./naturana.rows";
import type {
  Product,
  Variant,
  DecisionAction,
  ScenarioInputs,
  ScenarioPreset,
} from "./naturana.types";

// PDF pp. 5, 21, 97: storefront prices and synthetic planning assumptions are separate.
export const products: readonly Product[] = [
  {
    productId: "DL-BRA",
    understatementProductName: "Micro Mesh Padded Bra",
    naturanaProductName: "Wireless Triangle Bra - Dark Leo",
    colour: "Dark Leo",
    productType: "Top",
    matchingSetId: "DL",
    sizeSystem: "BAND_CUP",
    publicPriceEUR: 64.95,
    referencePriceEUR: 65,
    syntheticUnitCostEUR: 25,
    leadTimeWeeks: 8,
    safetyStockWeeks: 2,
    targetCoverWeeks: 8,
  },
  {
    productId: "DL-BTM",
    understatementProductName: "Micro Mesh Midi Hipster",
    naturanaProductName: "Briefs - Dark Leo",
    colour: "Dark Leo",
    productType: "Bottom",
    matchingSetId: "DL",
    sizeSystem: "EU_NUMERIC",
    publicPriceEUR: 34.95,
    referencePriceEUR: 35,
    syntheticUnitCostEUR: 10,
    leadTimeWeeks: 6,
    safetyStockWeeks: 1.5,
    targetCoverWeeks: 6,
  },
  {
    productId: "PL-BRA",
    understatementProductName: "Micro Mesh Underwired Bra",
    naturanaProductName: "Underwired Plunge Bra - Plum",
    colour: "Plum",
    productType: "Top",
    matchingSetId: "PL",
    sizeSystem: "BAND_CUP",
    publicPriceEUR: 59.9,
    referencePriceEUR: 65,
    syntheticUnitCostEUR: 25,
    leadTimeWeeks: 8,
    safetyStockWeeks: 2,
    targetCoverWeeks: 8,
  },
  {
    productId: "PL-BTM",
    understatementProductName: "Micro Mesh Midi Hipster",
    naturanaProductName: "Briefs - Plum",
    colour: "Plum",
    productType: "Bottom",
    matchingSetId: "PL",
    sizeSystem: "EU_NUMERIC",
    publicPriceEUR: 34.95,
    referencePriceEUR: 35,
    syntheticUnitCostEUR: 10,
    leadTimeWeeks: 6,
    safetyStockWeeks: 1.5,
    targetCoverWeeks: 6,
  },
  {
    productId: "CP-BRA",
    understatementProductName: "Opaque Triangle Scoop Bralette",
    naturanaProductName: "Wireless Triangle Bra - Candy Pink",
    colour: "Candy Pink",
    productType: "Top",
    matchingSetId: "CP",
    sizeSystem: "ALPHA",
    publicPriceEUR: 69,
    referencePriceEUR: 69,
    syntheticUnitCostEUR: 23,
    leadTimeWeeks: 7,
    safetyStockWeeks: 2,
    targetCoverWeeks: 8,
  },
  {
    productId: "CP-BTM",
    understatementProductName: "Opaque Mesh Midi Briefs",
    naturanaProductName: "Midi-Briefs - Candy Pink",
    colour: "Candy Pink",
    productType: "Bottom",
    matchingSetId: "CP",
    sizeSystem: "ALPHA",
    publicPriceEUR: 35,
    referencePriceEUR: 35,
    syntheticUnitCostEUR: 10,
    leadTimeWeeks: 5,
    safetyStockWeeks: 1.5,
    targetCoverWeeks: 6,
  },
  {
    productId: "CH-BRA",
    understatementProductName: "Opaque Mesh Balconette",
    naturanaProductName: "Wire-free Balconette Bra - Cherry",
    colour: "Cherry",
    productType: "Top",
    matchingSetId: "CH",
    sizeSystem: "ALPHA",
    publicPriceEUR: 79,
    referencePriceEUR: 79,
    syntheticUnitCostEUR: 25,
    leadTimeWeeks: 7,
    safetyStockWeeks: 2,
    targetCoverWeeks: 8,
  },
  {
    productId: "CH-BTM",
    understatementProductName: "Opaque Mesh Midi Briefs",
    naturanaProductName: "Midi-Briefs - Cherry",
    colour: "Cherry",
    productType: "Bottom",
    matchingSetId: "CH",
    sizeSystem: "ALPHA",
    publicPriceEUR: 35,
    referencePriceEUR: 35,
    syntheticUnitCostEUR: 10,
    leadTimeWeeks: 5,
    safetyStockWeeks: 1.5,
    targetCoverWeeks: 6,
  },
];
const observedNaturanaSkus: Record<string, string> = {
  "DL-BRA-70A": "5687_842_70A_4_4055403909388",
  "PL-BTM-36": "4687_656_36_3_4055403909265",
  "CP-BRA-S": "15285_630_S_4_7333468033895",
  "CH-BTM-XS": "14260_658_XS_3_7333468034090",
};
const spotlightFields: Record<string, Partial<Variant>> = {
  "CH-BRA-L": {
    initialExpectedRetainedDemand: 29,
    modelRecommendation: "BUY_DEEPER",
    overrideType: "FIT_SIGNAL",
    analystReason:
      "Elevated L→M exchanges materially weaken retained L demand.",
  },
  "CH-BRA-M": { initialExpectedRetainedDemand: 26 },
  "CP-BRA-M": { initialExpectedRetainedDemand: 29 },
};
export const variants: readonly Variant[] = operatingRows.map((row) => {
  const product = products.find((p) => p.productId === row.productId);
  if (!product) throw new Error(`Missing product ${row.productId}`);
  const demoVariantId = `${row.productId}-${row.size}`;
  return {
    ...product,
    ...row,
    demoVariantId,
    naturanaPublicSku: observedNaturanaSkus[demoVariantId] ?? null,
    ...(product.sizeSystem === "BAND_CUP"
      ? { band: Number(row.size.slice(0, 2)), cup: row.size.slice(2) }
      : product.sizeSystem === "EU_NUMERIC"
        ? { numericSize: Number(row.size) }
        : {
            alphaSize: row.size,
            matchingVariantId: `${product.matchingSetId}-${product.productType === "Top" ? "BTM" : "BRA"}-${row.size}`,
          }),
    ...spotlightFields[demoVariantId],
  };
});
export const actionLabels: Record<DecisionAction, string> = {
  BUY_DEEPER: "BUY DEEPER",
  REPLENISH: "REPLENISH",
  INVESTIGATE: "INVESTIGATE",
  WATCH: "WATCH",
  REDUCE_NEXT_BUY: "REDUCE NEXT BUY",
  HOLD: "HOLD",
};
export const urgency: Record<DecisionAction, number> = {
  BUY_DEEPER: 0,
  REPLENISH: 1,
  INVESTIGATE: 2,
  WATCH: 3,
  REDUCE_NEXT_BUY: 4,
  HOLD: 5,
};
export const sizeSystemLabels = {
  BAND_CUP: "Band + cup",
  EU_NUMERIC: "EU numeric",
  ALPHA: "Alpha",
};
export const curves = [
  { size: "XS", initial: 9, gross: 7, adjusted: 7.5 },
  { size: "S", initial: 18, gross: 17, adjusted: 17.5 },
  { size: "M", initial: 24, gross: 31, adjusted: 33 },
  { size: "L", initial: 25, gross: 26, adjusted: 22 },
  { size: "XL", initial: 13, gross: 10, adjusted: 10.5 },
  { size: "XXL", initial: 7, gross: 6, adjusted: 6 },
  { size: "3XL", initial: 4, gross: 3, adjusted: 3.5 },
] as const;
export const braTranslation = [
  ["70A–70B", "60% XS / 40% S"],
  ["70C–70D", "55% S / 45% M"],
  ["75A–75B", "60% S / 40% M"],
  ["75C–75D", "55% M / 45% L"],
  ["80A–80B", "50% M / 50% L"],
  ["80C–80D", "60% L / 40% XL"],
  ["85A–85B", "35% L / 65% XL"],
  ["85C–85D", "60% XL / 40% XXL"],
  ["90A–90B", "40% XL / 60% XXL"],
  ["90C–90D", "65% XXL / 35% 3XL"],
  ["95A–95B", "45% XXL / 55% 3XL"],
  ["95C–95D", "30% XXL / 70% 3XL"],
];
export const bottomTranslation = [
  ["36", "70% XS / 30% S"],
  ["38", "70% S / 30% M"],
  ["40", "70% M / 30% L"],
  ["42", "70% L / 30% XL"],
  ["44", "70% XL / 30% XXL"],
  ["46", "70% XXL / 30% 3XL"],
  ["48", "100% 3XL"],
];
export const learning = [
  ["75C–75D", "55% M / 45% L", "66% M / 34% L", "Increase M weighting"],
  ["80A–80B", "50% M / 50% L", "58% M / 42% L", "Moderate M uplift"],
  ["80C–80D", "60% L / 40% XL", "51% L / 49% XL", "Raise XL assumption"],
  ["85A–85B", "35% L / 65% XL", "37% L / 63% XL", "No material change"],
  ["85C–85D", "60% XL / 40% XXL", "57% XL / 43% XXL", "No material change"],
  ["90C–90D", "65% XXL / 35% 3XL", "62% XXL / 38% 3XL", "Keep under review"],
];
export const setRisks = [
  {
    id: "CP",
    label: "Candy Pink M",
    topId: "CP-BRA-M",
    bottomId: "CP-BTM-M",
    topCover: 2.0,
    bottomCover: 1.8,
  },
  {
    id: "CH",
    label: "Cherry M",
    topId: "CH-BRA-M",
    bottomId: "CH-BTM-M",
    topCover: 2.2,
    bottomCover: 1.7,
  },
] as const;
export const exchangeStory = {
  from: "CH-BRA-L",
  to: "CH-BRA-M",
  exchangeOut: 6,
  moved: 4,
} as const;
export const allocations = [
  { productId: "CP-BRA", amount: 11500, quantity: 500 },
  { productId: "CP-BTM", amount: 5000, quantity: 500 },
  { productId: "CH-BRA", amount: 9500, quantity: 380 },
  { productId: "CH-BTM", amount: 4500, quantity: 450 },
  { productId: "PL-BRA", amount: 7500, quantity: 300 },
  { productId: "PL-BTM", amount: 3000, quantity: 300 },
  { productId: "DL-BRA", amount: 5000, quantity: 200 },
  { productId: "DL-BTM", amount: 1500, quantity: 150 },
] as const;
export const baseInputs: ScenarioInputs = {
  overallDemandUpliftPct: 0,
  mDemandAdjustmentPct: 0,
  lDemandAdjustmentPct: 0,
  returnRateAdjustmentPP: 0,
  exchangeRateAdjustmentPP: 0,
  leadTimeAdjustmentWeeks: 0,
  openToBuyBudgetEUR: 50000,
  setAttachRatePct: 62,
  promotionExtensionEnabled: false,
  fitAdjustedDemandEnabled: true,
  exchangeAdjustmentEnabled: true,
  planningHorizonWeeks: 8,
  topTargetCoverWeeks: 8,
  bottomTargetCoverWeeks: 6,
  reservePct: 5,
};
export const scenarios: readonly ScenarioPreset[] = [
  {
    id: "BASE",
    label: "Base",
    inputs: { ...baseInputs },
    actions: 18,
    setRisks: 2,
    commitment: 47500,
    reserve: 2500,
    recommendation:
      "The current plan increases depth behind Candy Pink M, Cherry M and selected Plum band/cup sizes while keeping part of the budget uncommitted. Cherry L does not receive incremental depth until the exchange signal becomes clearer.",
  },
  {
    id: "UPSIDE",
    label: "Upside",
    inputs: {
      ...baseInputs,
      overallDemandUpliftPct: 15,
      mDemandAdjustmentPct: 10,
    },
    actions: 24,
    setRisks: 3,
    requirement: 57500,
    gap: 7500,
    recommendation:
      "Do not spread the available OTB evenly. Protect M across Candy Pink and Cherry, preserve Plum 75C/80C/85C, and accept lower coverage in slower tail sizes.",
  },
  {
    id: "SUPPLIER_DELAY",
    label: "Supplier Delay",
    inputs: { ...baseInputs, leadTimeAdjustmentWeeks: 2 },
    actions: 26,
    setRisks: 4,
    incrementalRequirement: 8500,
    recommendation:
      "The lead-time delay has more operational impact than the same percentage increase in demand because low-cover M variants lose the opportunity to recover before the next receipt.",
  },
  {
    id: "FIT_FRICTION",
    label: "Fit Friction",
    inputs: { ...baseInputs, exchangeRateAdjustmentPP: 5 },
    lDemandChangePct: -12,
    mRetainedChangePct: 6,
    recommendation:
      "Reduce incremental L commitment and preserve capacity for M until the fit signal stabilises.",
  },
];
export const tagline =
  "Analysis maintained by ScaleSight. Decisions made with NATURANA.";
export const disclaimer =
  "Product, size and catalog information is based on publicly available information. Sales, inventory, returns, exchanges, costs, forecasts and recommendations are synthetic assumptions created solely to demonstrate the ScaleSight planning workflow.";
export const confidenceNote =
  "Confidence remains Moderate because the launch observation window is short and several size relationships are still being learned.";
