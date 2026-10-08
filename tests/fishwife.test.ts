import assert from "node:assert/strict";
import { fixture } from "../src/data/fishwife.v1";
import * as e from "../src/engine/fishwife";
let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log("PASS " + name);
}
const near = (a: number | null, b: number, tolerance = 1e-5) =>
  assert.ok(a !== null && Math.abs(a - b) < tolerance, `${a} vs ${b}`);
test("12 unique SKUs, seven unique POs, seven one-tin BOM components", () => {
  assert.equal(fixture.skus.length, 12);
  assert.equal(new Set(fixture.skus.map((s) => s.id)).size, 12);
  assert.equal(fixture.pos.length, 7);
  assert.equal(new Set(fixture.pos.map((p) => p.id)).size, 7);
  assert.equal(fixture.bundle.components.length, 7);
  assert.ok(fixture.bundle.components.every((c) => c.quantity === 1));
});
test("All source operating rows and canonical PO identifiers match the PDF", () => {
  const expected = [
    ["TUN-SL", 15400, 12000, 3, 4300, 5600, 10, 3, "REVIEW BUY"],
    ["TUN-SP", 34000, 18000, 4, 6200, 6500, 10, 3, "HOLD / WATCH"],
    ["TUN-OO", 42000, 18000, 5, 5200, 5000, 10, 3, "HOLD"],
    ["TUN-SG", 31000, 12000, 7, 3100, 3500, 10, 3, "WATCH"],
    ["SAL-GL", 20000, 9000, 4, 3300, 3600, 6, 2.5, "HOLD"],
    ["SAL-FBJ", 8800, 6000, 4, 2700, 3000, 6, 2.5, "INTERVENE"],
    ["TRT-ORIG", 4200, 0, null, 1900, 1700, null, 4, "REALLOCATE"],
    ["SAR-PL", 30000, 15000, 6, 4200, 4500, 9, 3, "HOLD"],
    ["SAR-HP", 28000, 12000, 8, 2500, 2800, 9, 3, "REDUCE NEXT BUY"],
    ["MUS-BP", 7800, 12000, 5, 2400, 3000, 10, 3, "RESEQUENCE"],
    ["MUS-SPG", 29000, 12000, 7, 2700, 2800, 10, 3, "HOLD"],
    ["MAC-CHILI", 24000, 10000, 6, 2900, 3100, 8, 2.5, "HOLD"],
  ];
  assert.deepEqual(
    fixture.skus.map((s) => [
      s.id,
      s.onHand,
      s.incoming,
      s.etaWeeks,
      s.baseline,
      s.current,
      s.leadWeeks,
      s.safetyWeeks,
      s.label,
    ]),
    expected,
  );
  assert.deepEqual(
    fixture.pos.map((p) => [
      p.id,
      p.sku,
      p.quantity,
      p.originalArrival,
      p.status,
    ]),
    [
      ["FW-2411", "TUN-SL", 12000, "2026-10-29", "AT RISK"],
      ["FW-2412", "TUN-SP", 18000, "2026-11-05", "CONFIRMED"],
      ["FW-2420", "TUN-OO", 18000, "2026-11-12", "CONFIRMED"],
      ["FW-1184", "SAL-FBJ", 6000, "2026-11-05", "RECOVERY REQUIRED"],
      ["FW-2204", "SAR-PL", 15000, "2026-11-19", "CONFIRMED"],
      ["FW-2310", "MUS-BP", 12000, "2026-11-12", "CAPACITY REVIEW"],
      ["FW-2311", "MUS-SPG", 12000, "2026-11-26", "RESEQUENCE CANDIDATE"],
    ],
  );
  assert.deepEqual(
    fixture.bundle.components.map((c) => c.free),
    [4300, 12000, 12000, 14000, 10000, 3400, 400],
  );
});
test("WOC 2.75 displays 2.8; variance 30.2326 displays 30.2%", () => {
  const m = e.skuMetrics("TUN-SL");
  assert.equal(m.cover, 2.75);
  assert.equal(m.cover?.toFixed(1), "2.8");
  near(m.variance, 30.2325581395);
  assert.equal(m.variance?.toFixed(1), "30.2");
});
test("4-week mean 5,500; persistence ratio and uplift remain separate", () => {
  const l = e.lemonLearning();
  assert.equal(l.average, 5500);
  near(l.uplift, 27.906976744);
  near(l.ratio, 1.2790697674);
  assert.equal(l.uplift?.toFixed(1), "27.9");
});
test("Trout allocation conserves 4,200; unmet gap 2,600", () => {
  assert.equal(e.allocationSummary().total, 4200);
  assert.equal(e.allocationSummary().gap, 2600);
  assert.equal(e.allocationSummary(true).displaced, null);
});
test("Separate Starter Pack capacity 400, planned 1,200, gap 800", () => {
  assert.equal(e.bundleSummary().capacity, 400);
  assert.equal(e.bundleSummary().gap, 800);
  assert.equal(e.bundleSummary(false).capacity, null);
  assert.notEqual(fixture.bundle.context, fixture.allocation.context);
});
test("SKU totals 41,400 / 45,100 / +8.9%; four decisions and three situations", () => {
  const t = e.totals();
  assert.equal(t.baseline, 41400);
  assert.equal(t.current, 45100);
  assert.equal(t.variance?.toFixed(1), "8.9");
  assert.equal(t.decisions, 4);
  assert.equal(t.supplySituations, 3);
});
test("Mussels 8,000 moved, $2,100; FBJ options exact and difference $2,800", () => {
  assert.equal(fixture.mussels.moved, 8000);
  assert.equal(fixture.mussels.cost, 2100);
  assert.deepEqual(
    fixture.fbj.options.map((o) => o.cost),
    [0, 8400, 5600, 5600],
  );
  assert.equal(e.costDifference(), 2800);
  assert.equal(e.recoveryCost(1000, 1100, 0), 2100);
  assert.equal(e.recoveryCost(1000, null, 0), null);
});
test("Every grouped record carries source, classification and context; frozen inputs", () => {
  for (const r of [
    ...fixture.skus,
    ...fixture.pos,
    ...fixture.decisions,
    ...fixture.history,
    ...fixture.bundle.components,
    ...fixture.allocation.requirements,
    ...fixture.fbj.options,
  ]) {
    assert.ok(r.source && r.classification && r.context);
    assert.ok(Object.isFrozen(r));
  }
  assert.ok(Object.isFrozen(fixture));
});
test("Absent denominators and costs remain null, never zero/Infinity", () => {
  assert.equal(e.weeksOfCover(100, 0), null);
  assert.equal(e.demandVariance(5, 0), null);
  assert.equal(e.persistence(undefined, 5).uplift, null);
  assert.equal(e.incrementalCash(50, null), null);
  assert.equal(e.bundleCapacity([]), null);
  assert.equal(e.mean([]), null);
});
test("Projection floors physical stock, tracks exposure and avoids double subtraction", () => {
  const p = e.projectedInventory(
    100,
    [120, 40],
    [0, 60],
    30,
    "receipt-before-demand",
  )!;
  assert.equal(p[0].physical, 0);
  assert.equal(p[0].book, -20);
  assert.equal(p[0].unmet, 20);
  assert.equal(p[1].physical, 20);
  assert.equal(p[1].unmet, 0);
  assert.equal(e.stockoutWeek(p), 1);
  assert.equal(e.safetyBreachWeek(p), 1);
  assert.equal(e.projectedInventory(100, [120], [0], 30, null), null);
  assert.equal(e.supplyGap(15000, 7500, 8800), 13700);
  assert.equal(e.shortage(15000, 8800), 6200);
});
test("Deterministic confidence and current-plan scenario outputs", () => {
  assert.equal(e.confidence(4, true, false), "MODERATE");
  assert.equal(e.confidence(9, false, true), "LOW");
  assert.equal(e.confidence(9, false, false), "HIGH");
  assert.equal(
    e.scenarioOutputs({ ...e.initialScenario(), demandChange: 40 }).response,
    "SPLIT",
  );
  assert.equal(e.scenarioOutputs(e.initialScenario()).exposure, 0);
});
test("Bounded inputs reject malformed state; reset clears all overrides", () => {
  for (const v of ["7", "1.5", "NaN", "Infinity", "-1", ""])
    assert.ok(e.validateScenario("delay", v).error);
  assert.ok(e.validateScenario("demandChange", "41").error);
  assert.equal(e.validateScenario("demandChange", "-20").value, -20);
  assert.ok(e.validateScenario("premium", "-1").error);
  assert.ok(e.validateScenario("protectedDemand", "2.5").error);
  assert.equal(e.initialScenario().protectedDemand, 2500);
});
test("Complete histories conserve integer units across every modeled channel", () => {
  assert.equal(e.demandChart().filter((r) => r.actual !== null).length, 13);
  assert.equal(e.demandChart()[0].week, "2026-07-13");
  assert.equal(e.demandChart()[12].week, "2026-10-05");
  for (const model of fixture.modeledDemand) {
    assert.equal(model.weekly.length, 13);
    assert.equal(
      model.shares.reduce((a, b) => a + b, 0),
      100,
    );
    assert.equal(model.weekly[12], e.skuById(model.sku).current);
    for (let week = 0; week < 13; week++) {
      const values = e.channelUnits(model.weekly[week], model.shares);
      assert.ok(values.every(Number.isInteger));
      assert.equal(
        values.reduce((a, b) => a + b, 0),
        model.weekly[week],
      );
    }
    for (let channel = 1; channel < fixture.channels.length; channel++) {
      const context = e.demandContext(
        model.sku,
        fixture.channels[channel].name,
      );
      assert.equal(context.modeled, model.shares[channel - 1] > 0);
      assert.equal(
        context.confidence,
        context.modeled ? model.confidence : null,
      );
      if (!context.modeled) {
        assert.equal(context.current, null);
        assert.deepEqual(
          e.demandChart(model.sku, fixture.channels[channel].name),
          [],
        );
      }
    }
  }
  assert.equal(e.mean(fixture.modeledDemand[0].weekly.slice(0, 4)), 4300);
  assert.deepEqual(
    fixture.modeledDemand[0].weekly.slice(4),
    fixture.history.map((h) => h.units),
  );
  for (const id of ["TUN-SG", "SAR-HP", "MAC-CHILI"])
    assert.ok(!fixture.pos.some((p) => p.sku === id));
});
test("FBJ chronology reproduces every supplied exposure and protected-unit result", () => {
  for (const [id, exposure, protectedUnits, cost] of [
    ["accept", 6200, 0, 0],
    ["expedite", 200, 6000, 8400],
    ["split", 2200, 4000, 5600],
    ["split-promo", 0, 6200, 5600],
  ] as const) {
    const result = e.fbjComparison(id);
    assert.equal(result.exposure, exposure);
    assert.equal(result.protected, protectedUnits);
    assert.equal(result.cost, cost);
    assert.equal(
      result.rows.reduce((sum, row) => sum + row.receipt, 0),
      6000,
    );
    assert.equal(result.rows[3].date, "2026-10-29");
    assert.equal(result.rows[5].date, "2026-11-12");
    assert.ok(result.rows.every((row) => row.physical >= 0));
  }
  assert.equal(e.fbjComparison("split-promo").promoRemoved, 2400);
  assert.equal(e.fbjComparison("split-promo").remaining, 200);
  assert.equal(e.fbjComparison("split-promo").stockout, 3);
});
test("Gold Label presets reproduce supplied risks, receipts, cash and responses", () => {
  const base = e.scenarioOutputs(e.initialScenario());
  assert.equal(base.response, "HOLD");
  assert.equal(base.cash, 0);
  assert.equal(base.preReceipt, 5600);
  const higher = e.scenarioOutputs(e.scenarioPreset(0));
  assert.equal(higher.demand, 4500);
  assert.equal(higher.safety, 11250);
  assert.equal(higher.preReceipt, 2000);
  assert.equal(higher.safetyBreach, 2);
  assert.equal(higher.stockout, null);
  assert.equal(higher.exposure, 0);
  assert.equal(higher.response, "SPLIT");
  assert.equal(higher.cash, 3600);
  assert.equal(higher.earlyDate, "2026-10-29");
  assert.equal(higher.receiptDate, "2026-11-05");
  const delay = e.scenarioOutputs(e.scenarioPreset(1));
  assert.equal(delay.exposure, 1600);
  assert.equal(delay.stockout, 6);
  assert.equal(delay.safetyBreach, 4);
  assert.equal(delay.earlyDate, "2026-11-05");
  assert.equal(delay.receiptDate, "2026-11-19");
  assert.equal(delay.response, "SPLIT");
  assert.equal(delay.remainingExposure, 0);
  assert.equal(delay.cash, 3600);
  const pull = e.scenarioOutputs(e.scenarioPreset(2));
  assert.equal(pull.response, "WATCH / HOLD");
  assert.equal(pull.cash, 0);
  assert.equal(pull.exposure, 0);
  assert.equal(pull.safetyBreach, 3);
  assert.equal(pull.stockout, null);
  assert.deepEqual(
    pull.base.slice(0, 4).map((r) => r.physical),
    [15000, 10400, 7400, 5600],
  );
  assert.equal(
    fixture.scenario.pullForward.reduce((a, b) => a + b, 0),
    6 * 3600,
  );
});
test("Scenario thresholds, overrides and long-delay exposure stay coherent", () => {
  const higher = e.scenarioPreset(0);
  assert.equal(
    e.scenarioOutputs({ ...higher, premium: 4000 }).response,
    "SPLIT",
  );
  assert.equal(
    e.scenarioOutputs({ ...higher, premium: 4001 }).response,
    "INVESTIGATE",
  );
  assert.equal(
    e.scenarioOutputs({ ...higher, protectedDemand: 2000 }).response,
    "HOLD",
  );
  assert.equal(
    e.scenarioOutputs({ ...higher, protectedDemand: 2001 }).response,
    "SPLIT",
  );
  const extreme = e.scenarioOutputs({ ...higher, delay: 6, demandChange: 40 });
  assert.equal(extreme.response, "EXPEDITE");
  assert.equal(extreme.cash, 6300);
  assert.ok(extreme.remainingExposure > 0);
  assert.equal(
    extreme.selected.reduce((sum, row) => sum + row.receipt, 0),
    9000,
  );
  for (const value of ["", "Infinity", "NaN", "-1", "1e100"])
    assert.ok(e.validateScenario("premium", value).error);
});
test("Supplement costs, MOQ and mussel receipt schedules are sourced and immutable", () => {
  assert.equal(fixture.version, "fishwife-v1.1");
  for (const sku of fixture.skus) {
    assert.ok(sku.unitCost! > 0 && sku.moq! > 0);
    assert.equal(sku.economicsSource.classification, "SYNTHETIC DEMO INPUT");
  }
  assert.equal(e.skuById("SAL-GL").unitCost, 4.8);
  assert.deepEqual(e.recoverySchedule("MUS-BP"), [
    { date: "2026-10-22", quantity: 8000 },
    { date: "2026-11-12", quantity: 4000 },
  ]);
  assert.deepEqual(e.recoverySchedule("MUS-SPG"), [
    { date: "2026-11-26", quantity: 4000 },
    { date: "2026-12-17", quantity: 8000 },
  ]);
  assert.ok(Object.isFrozen(fixture.modeledDemand[0].weekly));
});
test("Late receipts cannot hide an earlier stockout or safety breach", () => {
  const late = e.projectedInventory(
    100,
    [100],
    [100],
    30,
    "receipt-after-demand",
  )!;
  assert.equal(late[0].physical, 100);
  assert.equal(late[0].unmet, 0);
  assert.equal(e.stockoutWeek(late), 1);
  assert.equal(e.safetyBreachWeek(late), 1);
  const early = e.projectedInventory(
    100,
    [100],
    [100],
    30,
    "receipt-before-demand",
  )!;
  assert.equal(e.stockoutWeek(early), null);
  assert.equal(e.safetyBreachWeek(early), null);
  assert.equal(
    e.projectedInventory(100, [-1], [0], 30, "receipt-before-demand"),
    null,
  );
  assert.equal(
    e.projectedInventory(-1, [1], [0], 30, "receipt-before-demand"),
    null,
  );
  for (const weeks of [NaN, Infinity, -1, 4.5])
    assert.equal(e.confidence(weeks, false, false), "LOW");
});
console.log(`\n${passed} Fishwife acceptance groups passed.`);
