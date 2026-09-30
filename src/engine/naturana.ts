import {
  allocations,
  baseInputs,
  scenarios,
  setRisks,
  variants,
  urgency,
} from "../data/naturana";
import type {
  DecisionAction,
  PresetId,
  ScenarioInputs,
  Variant,
} from "../data/naturana.types";
export const retainedDemand = (v: Variant) =>
  v.grossLaunchSales - v.returns - v.exchangeOut + v.exchangeIn;
export const fitAdjustedDemand = retainedDemand;
export const weeksOfCover = (v: Variant) => v.onHand / v.forecastWeeklyUnits;
export const displayedCover = (v: Variant) => v.sourceWeeksOfCover.toFixed(1);
export const exchangeOutRate = (v: Variant) =>
  v.grossLaunchSales ? (v.exchangeOut / v.grossLaunchSales) * 100 : 0;
export const demandIndex = (v: Variant) =>
  v.initialExpectedRetainedDemand
    ? Math.round((retainedDemand(v) / v.initialExpectedRetainedDemand) * 100)
    : null;
export const getVariant = (id: string) => {
  const v = variants.find((v) => v.demoVariantId === id);
  if (!v) throw new Error(`Unknown variant: ${id}`);
  return v;
};
export const setRiskFor = (v: Variant) =>
  setRisks.find(
    (r) => r.topId === v.demoVariantId || r.bottomId === v.demoVariantId,
  );
export const counts = variants.reduce(
  (acc, v) => {
    acc[v.analystRecommendation]++;
    return acc;
  },
  {
    BUY_DEEPER: 0,
    REPLENISH: 0,
    INVESTIGATE: 0,
    WATCH: 0,
    REDUCE_NEXT_BUY: 0,
    HOLD: 0,
  } satisfies Record<DecisionAction, number>,
);
export const immediateActions =
  counts.BUY_DEEPER + counts.REPLENISH + counts.INVESTIGATE;
export const committedAllocation = allocations.reduce(
  (sum, a) => sum + a.amount,
  0,
);
export const reserve = baseInputs.openToBuyBudgetEUR - committedAllocation;
export const sortByUrgency = (items: readonly Variant[]) =>
  [...items].sort(
    (a, b) =>
      urgency[a.analystRecommendation] - urgency[b.analystRecommendation],
  );
export interface PlanningState {
  presetId: PresetId | "CUSTOM";
  inputs: ScenarioInputs;
  selectedVariantId: string | null;
}
export const initialState = (): PlanningState => ({
  presetId: "BASE",
  inputs: { ...baseInputs },
  selectedVariantId: null,
});
export type PlanningAction =
  | { type: "preset"; id: PresetId }
  | { type: "update"; patch: Partial<ScenarioInputs> }
  | { type: "select"; id: string | null }
  | { type: "reset" };
export function planningReducer(
  state: PlanningState,
  action: PlanningAction,
): PlanningState {
  switch (action.type) {
    case "reset":
      return initialState();
    case "select":
      return { ...state, selectedVariantId: action.id };
    case "preset": {
      const preset = scenarios.find((s) => s.id === action.id)!;
      return { ...state, presetId: preset.id, inputs: { ...preset.inputs } };
    }
    case "update":
      return {
        ...state,
        presetId: "CUSTOM",
        inputs: { ...state.inputs, ...action.patch },
      };
  }
}
export function activeScenario(state: PlanningState) {
  return state.presetId === "CUSTOM"
    ? undefined
    : scenarios.find((s) => s.id === state.presetId);
}
