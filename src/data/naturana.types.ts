export type DecisionAction =
  | "BUY_DEEPER"
  | "REPLENISH"
  | "INVESTIGATE"
  | "WATCH"
  | "REDUCE_NEXT_BUY"
  | "HOLD";
export type Confidence = "LOW" | "MODERATE" | "HIGH";
export type SizeSystem = "BAND_CUP" | "EU_NUMERIC" | "ALPHA";
export interface Product {
  productId: string;
  understatementProductName: string;
  naturanaProductName: string;
  colour: string;
  productType: "Top" | "Bottom";
  matchingSetId: string;
  sizeSystem: SizeSystem;
  publicPriceEUR: number;
  referencePriceEUR: number;
  syntheticUnitCostEUR: number;
  leadTimeWeeks: number;
  safetyStockWeeks: number;
  targetCoverWeeks: number;
}
export interface OperatingRow {
  productId: string;
  size: string;
  publicSku: string;
  barcode: string;
  onHand: number;
  incoming: number;
  grossLaunchSales: number;
  returns: number;
  exchangeOut: number;
  exchangeIn: number;
  forecastWeeklyUnits: number;
  sourceWeeksOfCover: number;
  analystRecommendation: DecisionAction;
}
export interface Variant extends Product, OperatingRow {
  demoVariantId: string;
  naturanaPublicSku: string | null;
  incomingDate?: string;
  band?: number;
  cup?: string;
  numericSize?: number;
  alphaSize?: string;
  initialExpectedRetainedDemand?: number;
  confidence?: Confidence;
  modelRecommendation?: DecisionAction;
  analystReason?: string;
  overrideType?: string;
  matchingVariantId?: string;
}
export type PresetId = "BASE" | "UPSIDE" | "SUPPLIER_DELAY" | "FIT_FRICTION";
export interface ScenarioInputs {
  overallDemandUpliftPct: number;
  mDemandAdjustmentPct: number;
  lDemandAdjustmentPct: number;
  returnRateAdjustmentPP: number;
  exchangeRateAdjustmentPP: number;
  leadTimeAdjustmentWeeks: number;
  openToBuyBudgetEUR: number;
  setAttachRatePct: number;
  promotionExtensionEnabled: boolean;
  fitAdjustedDemandEnabled: boolean;
  exchangeAdjustmentEnabled: boolean;
  planningHorizonWeeks: 4 | 8 | 13;
  topTargetCoverWeeks: number;
  bottomTargetCoverWeeks: number;
  reservePct: number;
}
export interface ScenarioPreset {
  id: PresetId;
  label: string;
  inputs: ScenarioInputs;
  actions?: number;
  setRisks?: number;
  commitment?: number;
  reserve?: number;
  requirement?: number;
  gap?: number;
  incrementalRequirement?: number;
  lDemandChangePct?: number;
  mRetainedChangePct?: number;
  recommendation: string;
}
