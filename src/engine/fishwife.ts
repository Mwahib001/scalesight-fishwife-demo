import { fixture, type Confidence, type Sku } from "../data/fishwife.v1";
type N = number | null | undefined;
const finite = (v: N): v is number =>
  typeof v === "number" && Number.isFinite(v);
export const weeksOfCover = (onHand: N, demand: N) =>
  finite(onHand) && finite(demand) && demand > 0 ? onHand / demand : null;
export const demandVariance = (current: N, baseline: N) =>
  finite(current) && finite(baseline) && baseline > 0
    ? ((current - baseline) / baseline) * 100
    : null;
export const mean = (values: readonly N[]) =>
  values.length && values.every(finite)
    ? values.reduce<number>((s, n) => s + (n as number), 0) / values.length
    : null;
export const persistence = (average: N, baseline: N) => {
  const ratio =
    finite(average) && finite(baseline) && baseline > 0
      ? average / baseline
      : null;
  return { ratio, uplift: ratio === null ? null : (ratio - 1) * 100 };
};
export const shortage = (requirement: N, available: N) =>
  finite(requirement) && finite(available)
    ? Math.max(0, requirement - available)
    : null;
export const supplyGap = (demand: N, safety: N, available: N) =>
  finite(demand) && finite(safety) && finite(available)
    ? Math.max(0, demand + safety - available)
    : null;
export const bundleCapacity = (
  components: readonly { free: N; quantity: N }[],
) =>
  components.length &&
  components.every(
    (c) =>
      finite(c.free) && c.free >= 0 && finite(c.quantity) && c.quantity > 0,
  )
    ? Math.floor(
        Math.min(
          ...components.map((c) => (c.free as number) / (c.quantity as number)),
        ),
      )
    : null;
export const recoveryCost = (freight: N, premium: N, displacement: N) =>
  [freight, premium, displacement].every(finite)
    ? (freight as number) + (premium as number) + (displacement as number)
    : null;
export const serviceUnitsProtected = (baseline: N, scenario: N) =>
  finite(baseline) && finite(scenario)
    ? Math.max(0, baseline - scenario)
    : null;
export const sopGap = (demand: N, supply: N) =>
  finite(demand) && finite(supply) ? demand - supply : null;
export const incrementalCash = (quantity: N, cost: N) =>
  finite(quantity) && finite(cost) ? quantity * cost : null;
export const safetyUnits = (demand: N, weeks: N) =>
  finite(demand) && finite(weeks) ? demand * weeks : null;
export function confidence(
  cleanWeeks: number,
  recentEvent: boolean,
  censored: boolean,
): Confidence {
  return censored || cleanWeeks < 4
    ? "LOW"
    : cleanWeeks >= 8 && !recentEvent
      ? "HIGH"
      : "MODERATE";
}
export type Projection = {
  week: number;
  book: number;
  physical: number;
  unmet: number;
  safetyBreach: boolean;
};
/** Convention explicit. Demand already includes protected allocation; no second subtraction. */
export function projectedInventory(
  onHand: N,
  demand: readonly N[],
  receipts: readonly N[],
  safety: N,
  order: "receipt-before-demand" | "receipt-after-demand" | null,
): Projection[] | null {
  if (
    !finite(onHand) ||
    !finite(safety) ||
    !order ||
    demand.length !== receipts.length ||
    !demand.every(finite) ||
    !receipts.every(finite)
  )
    return null;
  let physical = onHand,
    book = onHand;
  return demand.map((d, i) => {
    const r = receipts[i] as number,
      required = d as number;
    let unmet: number;
    if (order === "receipt-before-demand") {
      unmet = Math.max(0, required - physical - r);
      physical = Math.max(0, physical + r - required);
    } else {
      unmet = Math.max(0, required - physical);
      physical = Math.max(0, physical - required) + r;
    }
    book += r - required;
    return {
      week: i + 1,
      book,
      physical,
      unmet,
      safetyBreach: physical < safety,
    };
  });
}
export const stockoutWeek = (p: readonly Projection[] | null) =>
  p?.find((x) => x.physical <= 0 || x.unmet > 0)?.week ?? null;
export const safetyBreachWeek = (p: readonly Projection[] | null) =>
  p?.find((x) => x.safetyBreach)?.week ?? null;
export const skuById = (id: string): Sku => {
  const sku = fixture.skus.find((s) => s.id === id);
  if (!sku) throw new Error("Analysis unavailable; return to current plan.");
  return sku;
};
export const skuMetrics = (id: string) => {
  const s = skuById(id);
  return {
    sku: s,
    cover: weeksOfCover(s.onHand, s.current),
    variance: demandVariance(s.current, s.baseline),
    safety: safetyUnits(s.current, s.safetyWeeks),
  };
};
export function totals() {
  const baseline = fixture.skus.reduce((s, r) => s + r.baseline, 0),
    current = fixture.skus.reduce((s, r) => s + r.current, 0);
  return {
    baseline,
    current,
    variance: demandVariance(current, baseline),
    skus: fixture.skus.length,
    decisions: fixture.decisions.length,
    supplySituations: fixture.pos.filter((p) =>
      ["AT RISK", "RECOVERY REQUIRED", "CAPACITY REVIEW"].includes(p.status),
    ).length,
    constrained: fixture.skus.filter((s) => s.leadWeeks === null).length,
  };
}
export function lemonLearning() {
  const average = mean(fixture.history.slice(-4).map((h) => h.units));
  return {
    average,
    ...persistence(average, skuById("TUN-SL").baseline),
    confidence: confidence(4, true, false),
  };
}
export function allocationSummary(includeDiscretionary = false) {
  return {
    total: fixture.allocation.requirements.reduce((n, r) => n + r.units, 0),
    gap: shortage(fixture.allocation.demand, fixture.allocation.inventory),
    available: fixture.allocation.inventory,
    requiresPriority: includeDiscretionary,
    displaced: includeDiscretionary ? null : 0,
  };
}
export function bundleSummary(protect = true) {
  const capacity = bundleCapacity(fixture.bundle.components);
  return {
    capacity: protect ? capacity : null,
    currentCapacity: capacity,
    gap: protect ? shortage(fixture.bundle.planned, capacity) : null,
    protectedService: protect
      ? "Current protected commitments preserved"
      : "Protected service falls; quantity not specified",
    needsRelease: !protect,
  };
}
export const costDifference = () =>
  fixture.fbj.options[1].cost - fixture.fbj.options[3].cost;
export function demandChart() {
  const weeks = [
    "2026-08-03",
    ...fixture.history.map((h) => h.week),
    "2026-10-12",
    "2026-10-19",
    "2026-10-26",
  ];
  return weeks.map((week) => ({
    week,
    label: new Date(week + "T12:00:00Z").toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
    baseline: skuById("TUN-SL").baseline,
    actual: fixture.history.find((h) => h.week === week)?.units ?? null,
    forward: week > fixture.timeline.week ? lemonLearning().average : null,
  }));
}
export type ScenarioState = {
  preset: number;
  demandChange: number;
  delay: number;
  protectedDemand: number | null;
  premium: number | null;
};
export const initialScenario = (): ScenarioState => ({
  preset: 0,
  demandChange: 0,
  delay: 0,
  protectedDemand: null,
  premium: null,
});
export function validateScenario(
  key: Exclude<keyof ScenarioState, "preset">,
  value: string,
): { value: number | null; error: string | null } {
  if (value.trim() === "" && (key === "protectedDemand" || key === "premium"))
    return { value: null, error: null };
  const n = Number(value);
  let ok = value.trim() !== "" && Number.isFinite(n);
  if (key === "demandChange") ok = ok && n >= -20 && n <= 40;
  else if (key === "delay") ok = ok && Number.isInteger(n) && n >= 0 && n <= 6;
  else ok = ok && n >= 0 && (key !== "protectedDemand" || Number.isInteger(n));
  return ok
    ? { value: n, error: null }
    : {
        value: null,
        error:
          key === "demandChange"
            ? "Enter a finite value from −20% to +40%."
            : key === "delay"
              ? "Enter a whole number from 0 to 6 weeks."
              : "Enter a finite nonnegative " +
                (key === "protectedDemand"
                  ? "whole number of tins."
                  : "USD amount."),
      };
}
export function scenarioOutputs(state: ScenarioState) {
  return {
    demand: skuById("SAL-FBJ").current * (1 + state.demandChange / 100),
    stockout: null,
    safetyBreach: null,
    exposure: null,
    cash: null,
    response: "SPLIT",
    reviewedChanged: false,
    missing: [
      "Receipt dates and ordering convention",
      "Protected-demand baseline and promo reduction",
      "Landed costs and recovery-cost threshold",
    ],
    context: fixture.scenario.presets[state.preset].label,
  };
}
