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
  return censored || !Number.isInteger(cleanWeeks) || cleanWeeks < 4
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
  stockout: boolean;
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
    onHand < 0 ||
    safety < 0 ||
    !order ||
    demand.length !== receipts.length ||
    !demand.every((value) => finite(value) && value >= 0) ||
    !receipts.every((value) => finite(value) && value >= 0)
  )
    return null;
  let physical = onHand,
    book = onHand;
  return demand.map((d, i) => {
    const r = receipts[i] as number,
      required = d as number;
    let unmet: number;
    let afterDemand: number;
    if (order === "receipt-before-demand") {
      unmet = Math.max(0, required - physical - r);
      physical = Math.max(0, physical + r - required);
      afterDemand = physical;
    } else {
      unmet = Math.max(0, required - physical);
      afterDemand = Math.max(0, physical - required);
      physical = afterDemand + r;
    }
    book += r - required;
    return {
      week: i + 1,
      book,
      physical,
      unmet,
      safetyBreach: afterDemand < safety,
      stockout: afterDemand <= 0,
    };
  });
}
export const stockoutWeek = (p: readonly Projection[] | null) =>
  p?.find((x) => x.stockout || x.unmet > 0)?.week ?? null;
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
export function addWeeks(date: string, weeks: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}
export function channelUnits(total: number, shares: readonly number[]) {
  const values = shares.map((share) => Math.round((total * share) / 100));
  const largest = shares.indexOf(Math.max(...shares));
  values[largest] += total - values.reduce((sum, value) => sum + value, 0);
  return values;
}
export function demandContext(sku = "TUN-SL", channel = "ALL") {
  const product = skuById(sku);
  const model = fixture.modeledDemand.find((row) => row.sku === sku)!;
  const channelIndex =
    fixture.channels.findIndex((c) => c.name === channel) - 1;
  const all = channel === "ALL";
  const modeled = all || (channelIndex >= 0 && model.shares[channelIndex] > 0);
  const portion = (total: number) =>
    all ? total : channelUnits(total, model.shares)[channelIndex];
  const weekly = modeled ? model.weekly.map(portion) : [];
  const baseline = modeled ? portion(product.baseline) : null;
  const current = modeled ? weekly.at(-1)! : null;
  const average = mean(weekly.slice(-4));
  const forward = modeled
    ? portion(sku === "TUN-SL" ? lemonLearning().average! : product.current)
    : null;
  return {
    product,
    modeled,
    weekly,
    baseline,
    current,
    average,
    forward,
    variance: demandVariance(current, baseline),
    uplift: persistence(average, baseline).uplift,
    confidence: modeled ? model.confidence : null,
    share: all ? 100 : (model.shares[channelIndex] ?? 0),
  };
}
export function demandChart(sku = "TUN-SL", channel = "ALL") {
  const context = demandContext(sku, channel);
  if (!context.modeled) return [];
  return Array.from({ length: 16 }, (_, i) => {
    const week = addWeeks(fixture.historyStart, i);
    return {
      week,
      label: new Date(week + "T12:00:00Z").toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      baseline: context.baseline!,
      actual: i < 13 ? context.weekly[i] : null,
      forward: i >= 13 ? context.forward : null,
    };
  });
}
export type InventoryPoint = Projection & {
  date: string;
  label: string;
  demand: number;
  receipt: number;
  protectedUnmet: number;
};
export function simulate(
  onHand: number,
  demand: readonly number[],
  receipts: readonly number[],
  safety: number,
  protectedDemand: number,
): InventoryPoint[] {
  const projected = projectedInventory(
    onHand,
    demand,
    receipts,
    safety,
    "receipt-before-demand",
  )!;
  return projected.map((row, i) => {
    const available =
      (i === 0 ? onHand : projected[i - 1].physical) + receipts[i];
    return {
      ...row,
      date: addWeeks(fixture.timeline.planningDate, i),
      label: `W${i + 1}`,
      demand: demand[i],
      receipt: receipts[i],
      protectedUnmet: Math.max(
        0,
        Math.min(demand[i], protectedDemand) - available,
      ),
    };
  });
}
export function fbjComparison(id: string) {
  const option = fixture.fbj.options.find((o) => o.id === id);
  if (!option) throw new Error("Unknown recovery option");
  const sku = skuById("SAL-FBJ");
  // Five complete demand periods, followed by the opening receipt on Nov 12.
  const demand = Array.from({ length: 6 }, (_, i) =>
    i === 5
      ? 0
      : sku.current -
        (id === "split-promo" ? fixture.fbj.promoReduction[i] : 0),
  );
  const receipts = [0, 0, 0, option.early, 0, option.standard];
  const rows = simulate(
    sku.onHand,
    demand,
    receipts,
    sku.current * sku.safetyWeeks,
    fixture.fbj.protectedDemand,
  );
  const exposure = rows.slice(0, 5).reduce((sum, row) => sum + row.unmet, 0);
  return {
    option,
    rows,
    exposure,
    protected: serviceUnitsProtected(fixture.fbj.exposure, exposure)!,
    remaining: rows[4].physical,
    safety: sku.current * sku.safetyWeeks,
    stockout: stockoutWeek(rows.slice(0, 5)),
    safetyBreach: safetyBreachWeek(rows.slice(0, 5)),
    cost: option.cost,
    promoRemoved: sku.current * 5 - demand.reduce((sum, n) => sum + n, 0),
  };
}
export type ScenarioState = {
  preset: number;
  demandChange: number;
  delay: number;
  protectedDemand: number;
  premium: number;
};
export const initialScenario = (): ScenarioState => ({
  preset: -1,
  demandChange: 0,
  delay: 0,
  protectedDemand: fixture.scenario.protectedBaseline,
  premium: fixture.scenario.splitPremium,
});
export function scenarioPreset(index: number): ScenarioState {
  const p = fixture.scenario.presets[index];
  return {
    ...initialScenario(),
    preset: index,
    demandChange: p.demandChange,
    delay: p.delay,
  };
}
export function validateScenario(
  key: Exclude<keyof ScenarioState, "preset">,
  value: string,
): { value: number; error: string | null } {
  const n = Number(value);
  let ok =
    value.trim() !== "" &&
    Number.isFinite(n) &&
    Math.abs(n) <= Number.MAX_SAFE_INTEGER;
  if (key === "demandChange") ok = ok && n >= -20 && n <= 40;
  else if (key === "delay") ok = ok && Number.isInteger(n) && n >= 0 && n <= 6;
  else ok = ok && n >= 0 && (key !== "protectedDemand" || Number.isInteger(n));
  return {
    value: n,
    error: ok
      ? null
      : key === "demandChange"
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
  const config = fixture.scenario;
  const sku = skuById(config.sku);
  const demand = sku.current * (1 + state.demandChange / 100);
  const safety = demand * sku.safetyWeeks;
  const receiptIndex = 4 + state.delay;
  // Custom cases recover no later than the original Nov 5 date; with no delay use Oct 29.
  const earlyIndex = Math.min(receiptIndex - 1, 4);
  const demands = Array.from({ length: receiptIndex + 1 }, (_, i) =>
    i === receiptIndex
      ? 0
      : (state.preset === 2
          ? (config.pullForward[i] ?? sku.current)
          : sku.current) *
        (1 + state.demandChange / 100),
  );
  const receiptSeries = (early: number) =>
    demands.map((_, i) =>
      i === earlyIndex ? early : i === receiptIndex ? sku.incoming - early : 0,
    );
  const base = simulate(
    sku.onHand,
    demands,
    receiptSeries(0),
    safety,
    state.protectedDemand,
  );
  const split = simulate(
    sku.onHand,
    demands,
    receiptSeries(config.splitQuantity),
    safety,
    state.protectedDemand,
  );
  const before = base.slice(0, receiptIndex);
  const exposure = before.reduce((sum, row) => sum + row.unmet, 0);
  const stockout = stockoutWeek(before);
  const preReceipt = before.at(-1)!.physical;
  const splitProtectedExposure = split
    .slice(0, receiptIndex)
    .reduce((sum, row) => sum + row.protectedUnmet, 0);
  const intervention = stockout !== null || preReceipt < state.protectedDemand;
  const response =
    exposure > config.exposureThreshold || splitProtectedExposure > 0
      ? "EXPEDITE"
      : intervention
        ? state.premium <= config.threshold
          ? "SPLIT"
          : "INVESTIGATE"
        : state.preset === 2
          ? "WATCH / HOLD"
          : "HOLD";
  const selected =
    response === "EXPEDITE"
      ? simulate(
          sku.onHand,
          demands,
          receiptSeries(sku.incoming),
          safety,
          state.protectedDemand,
        )
      : response === "SPLIT"
        ? split
        : base;
  const cash =
    response === "EXPEDITE"
      ? config.expeditePremium
      : response === "SPLIT"
        ? state.premium
        : 0;
  return {
    demand,
    safety,
    stockout,
    safetyBreach: safetyBreachWeek(before),
    exposure,
    cash,
    response,
    preReceipt,
    base,
    selected,
    splitProtectedExposure,
    remainingExposure: selected
      .slice(0, receiptIndex)
      .reduce((sum, row) => sum + row.unmet, 0),
    receiptDate: addWeeks(fixture.timeline.planningDate, receiptIndex),
    earlyDate: addWeeks(fixture.timeline.planningDate, earlyIndex),
    poValue: sku.incoming * sku.unitCost!,
    context: config.presets[state.preset]?.label ?? "Current plan",
    reasoning:
      response === "EXPEDITE"
        ? "Exposure exceeds 4,000 tins or split recovery leaves protected demand unserved. Compare a full expedite; residual exposure remains visible below."
        : response === "SPLIT"
          ? "Inventory before receipt falls below one week of protected demand, or stock runs out. The split premium is within the $4,000 demo threshold."
          : response === "INVESTIGATE"
            ? "Service risk warrants intervention, but the entered split premium exceeds the $4,000 demo threshold. Review recovery cost before committing."
            : state.preset === 2
              ? "Demand moved forward in time without increasing the total requirement. Monitor the next reorder cycle; do not add production solely because early weeks are stronger."
              : "The current commitment covers demand through receipt and retains at least one week of protected demand. Keep the current plan.",
  };
}

/** Proposed schedules supplement original PO records; they do not mutate the commitments. */
export function recoverySchedule(
  sku: string,
): { date: string; quantity: number }[] | null {
  if (sku === "SAL-FBJ")
    return [
      { date: fixture.fbj.earlyDate, quantity: 4000 },
      { date: fixture.fbj.delayedDate, quantity: 2000 },
    ];
  if (sku === "MUS-BP")
    return [
      { date: fixture.mussels.earlyDate, quantity: 8000 },
      { date: fixture.mussels.remainingDate, quantity: 4000 },
    ];
  if (sku === "MUS-SPG")
    return [
      { date: fixture.mussels.sweetPepperRetainedDate, quantity: 4000 },
      { date: fixture.mussels.displacedDate, quantity: 8000 },
    ];
  return null;
}
