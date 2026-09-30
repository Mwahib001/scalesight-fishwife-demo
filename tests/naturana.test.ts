import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  products,
  variants,
  curves,
  allocations,
  setRisks,
  scenarios,
  exchangeStory,
  baseInputs,
  disclaimer,
  tagline,
  braTranslation,
  bottomTranslation,
  learning,
} from "../src/data/naturana";
import { operatingRows } from "../src/data/naturana.rows";
import {
  counts,
  immediateActions,
  retainedDemand,
  fitAdjustedDemand,
  demandIndex,
  getVariant,
  exchangeOutRate,
  weeksOfCover,
  displayedCover,
  committedAllocation,
  reserve,
  initialState,
  planningReducer,
  activeScenario,
  sortByUrgency,
} from "../src/engine/naturana";
import { money } from "../src/engine/formatters";
import type { Variant, ScenarioInputs } from "../src/data/naturana.types";
let checks = 0;
function check(label: string, run: () => void) {
  run();
  checks++;
  console.log(`PASS ${label}`);
}
const fixture = <T>(name: string): T =>
  JSON.parse(readFileSync(`tests/fixtures/${name}.json`, "utf8"));
check("Exactly 8 products and 85 unique variants; exact product sizes", () => {
  assert.equal(products.length, 8);
  assert.equal(variants.length, 85);
  assert.equal(new Set(variants.map((v) => v.demoVariantId)).size, 85);
  assert.equal(new Set(variants.map((v) => v.publicSku)).size, 85);
  assert.equal(new Set(variants.map((v) => v.barcode)).size, 85);
  assert.deepEqual(
    products.map(
      (p) => variants.filter((v) => v.productId === p.productId).length,
    ),
    [24, 7, 19, 7, 7, 7, 7, 7],
  );
  assert.equal(
    variants.some((v) => v.productId === "PL-BRA" && v.size === "90" + "E"),
    false,
  );
  assert.equal(new Set(products.map((p) => p.matchingSetId)).size, 4);
});
check(
  "All public SKUs/barcodes/NATURANA observed IDs exactly match independent Appendix B",
  () => {
    const actual = variants.map(
      ({ productId, size, publicSku, barcode, naturanaPublicSku }) => ({
        productId,
        size,
        publicSku,
        barcode,
        naturanaPublicSku,
      }),
    );
    assert.deepEqual(actual, fixture("naturana-public"));
    assert.equal(variants.filter((v) => v.naturanaPublicSku).length, 4);
  },
);
check(
  "Every supplied operating field and final action matches the cross-checked PDF fixture",
  () => {
    assert.deepEqual(operatingRows, fixture("naturana-operating"));
    for (const row of operatingRows) {
      const v = getVariant(`${row.productId}-${row.size}`);
      for (const [k, val] of Object.entries(row))
        assert.equal(v[k as keyof Variant], val);
    }
    for (const v of variants)
      for (const field of [
        v.onHand,
        v.incoming,
        v.grossLaunchSales,
        v.returns,
        v.exchangeOut,
        v.exchangeIn,
        v.forecastWeeklyUnits,
      ])
        assert.ok(Number.isFinite(field) && field >= 0);
  },
);
check(
  "Final action counts 6 / 11 / 1 / 9 / 9 / 49; 18 immediate interventions",
  () => {
    assert.deepEqual(counts, {
      BUY_DEEPER: 6,
      REPLENISH: 11,
      INVESTIGATE: 1,
      WATCH: 9,
      REDUCE_NEXT_BUY: 9,
      HOLD: 49,
    });
    assert.equal(immediateActions, 18);
    assert.equal(
      sortByUrgency(variants)
        .slice(0, 6)
        .every((v) => v.analystRecommendation === "BUY_DEEPER"),
      true,
    );
  },
);
check(
  "Retained demand, fit-adjusted demand, commercial indices and source cover",
  () => {
    for (const [id, retained, index] of [
      ["CH-BRA-L", 25, 86],
      ["CH-BRA-M", 31, 119],
      ["CP-BRA-M", 37, 128],
    ] as const) {
      const v = getVariant(id);
      assert.equal(retainedDemand(v), retained);
      assert.equal(fitAdjustedDemand(v), retained);
      assert.equal(demandIndex(v), index);
    }
    assert.equal(Math.round(exchangeOutRate(getVariant("CH-BRA-L"))), 18);
    for (const v of variants) {
      assert.equal(displayedCover(v), v.sourceWeeksOfCover.toFixed(1));
      assert.ok(Math.abs(weeksOfCover(v) - v.sourceWeeksOfCover) <= 0.051);
      assert.ok(retainedDemand(v) >= 0);
    }
  },
);
check(
  "All OTB allocations and quantities reconcile to €47,500 + €2,500 = €50,000",
  () => {
    assert.deepEqual(
      allocations.map((a) => a.amount),
      [11500, 5000, 9500, 4500, 7500, 3000, 5000, 1500],
    );
    assert.deepEqual(
      allocations.map((a) => a.quantity),
      [500, 500, 380, 450, 300, 300, 200, 150],
    );
    for (const a of allocations)
      assert.equal(
        a.quantity *
          products.find((p) => p.productId === a.productId)!
            .syntheticUnitCostEUR,
        a.amount,
      );
    assert.equal(committedAllocation, 47500);
    assert.equal(reserve, 2500);
    assert.equal(committedAllocation + reserve, 50000);
    assert.equal((reserve / 50000) * 100, 5);
  },
);
check(
  "All canonical scenarios exactly match; absent outputs stay absent",
  () => {
    assert.deepEqual(
      scenarios.map((preset) =>
        Object.fromEntries(
          Object.entries(preset).filter(
            ([key]) => !["label", "inputs", "recommendation"].includes(key),
          ),
        ),
      ),
      [
        {
          id: "BASE",
          actions: 18,
          setRisks: 2,
          commitment: 47500,
          reserve: 2500,
        },
        {
          id: "UPSIDE",
          actions: 24,
          setRisks: 3,
          requirement: 57500,
          gap: 7500,
        },
        {
          id: "SUPPLIER_DELAY",
          actions: 26,
          setRisks: 4,
          incrementalRequirement: 8500,
        },
        { id: "FIT_FRICTION", lDemandChangePct: -12, mRetainedChangePct: 6 },
      ],
    );
    assert.equal(scenarios[1].requirement! - 50000, scenarios[1].gap);
    assert.equal(scenarios[1].inputs.overallDemandUpliftPct, 15);
    assert.equal(scenarios[1].inputs.mDemandAdjustmentPct, 10);
    assert.equal(scenarios[2].inputs.leadTimeAdjustmentWeeks, 2);
    assert.equal(scenarios[3].inputs.exchangeRateAdjustmentPP, 5);
  },
);
check(
  "Custom combinations suppress outputs; reset restores every input atomically",
  () => {
    for (const preset of scenarios) {
      let state = planningReducer(initialState(), {
        type: "preset",
        id: preset.id,
      });
      assert.equal(activeScenario(state)?.id, preset.id);
      assert.deepEqual(state.inputs, preset.inputs);
      const changed: ScenarioInputs = {
        ...baseInputs,
        overallDemandUpliftPct: 40,
        mDemandAdjustmentPct: 30,
        lDemandAdjustmentPct: -20,
        returnRateAdjustmentPP: 10,
        exchangeRateAdjustmentPP: 10,
        leadTimeAdjustmentWeeks: 4,
        openToBuyBudgetEUR: 75000,
        setAttachRatePct: 80,
        promotionExtensionEnabled: true,
        fitAdjustedDemandEnabled: false,
        exchangeAdjustmentEnabled: false,
        planningHorizonWeeks: 13,
        topTargetCoverWeeks: 10,
        bottomTargetCoverWeeks: 8,
        reservePct: 10,
      };
      state = planningReducer(state, { type: "update", patch: changed });
      assert.equal(state.presetId, "CUSTOM");
      assert.equal(activeScenario(state), undefined);
      state = planningReducer(state, { type: "select", id: "CH-BRA-L" });
      assert.deepEqual(
        planningReducer(state, { type: "reset" }),
        initialState(),
      );
    }
    assert.equal(baseInputs.openToBuyBudgetEUR, 50000);
  },
);
check("Exact initial/gross/fit-adjusted curves; each totals 100", () => {
  assert.deepEqual(
    curves.map((c) => c.size),
    ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  );
  assert.deepEqual(
    curves.map((c) => c.initial),
    [9, 18, 24, 25, 13, 7, 4],
  );
  assert.deepEqual(
    curves.map((c) => c.gross),
    [7, 17, 31, 26, 10, 6, 3],
  );
  assert.deepEqual(
    curves.map((c) => c.adjusted),
    [7.5, 17.5, 33, 22, 10.5, 6, 3.5],
  );
  for (const key of ["initial", "gross", "adjusted"] as const)
    assert.equal(
      curves.reduce((sum, c) => sum + c[key], 0),
      100,
    );
  assert.equal(braTranslation.length, 12);
  assert.equal(bottomTranslation.length, 7);
  assert.equal(learning.length, 6);
});
check(
  "Only two canonical set risks and one supplied exchange direction",
  () => {
    assert.deepEqual(
      setRisks.map((r) => [r.label, r.topCover, r.bottomCover]),
      [
        ["Candy Pink M", 2, 1.8],
        ["Cherry M", 2.2, 1.7],
      ],
    );
    for (const r of setRisks) {
      assert.equal(getVariant(r.topId).sourceWeeksOfCover, r.topCover);
      assert.equal(getVariant(r.bottomId).sourceWeeksOfCover, r.bottomCover);
    }
    assert.deepEqual(exchangeStory, {
      from: "CH-BRA-L",
      to: "CH-BRA-M",
      exchangeOut: 6,
      moved: 4,
    });
    assert.equal(
      Math.round((exchangeStory.moved / exchangeStory.exchangeOut) * 100),
      67,
    );
    assert.ok(variants.every((v) => v.incomingDate === undefined));
  },
);
check(
  "NATURANA storefront prices are primary; reference prices remain metadata",
  () => {
    assert.deepEqual(
      products.map((p) => p.publicPriceEUR),
      [64.95, 34.95, 59.9, 34.95, 69, 35, 79, 35],
    );
    assert.deepEqual(
      products.map((p) => p.referencePriceEUR),
      [65, 35, 65, 35, 69, 35, 79, 35],
    );
    for (const v of variants)
      assert.equal(
        v.publicPriceEUR,
        products.find((p) => p.productId === v.productId)!.publicPriceEUR,
      );
    assert.equal(money(59.9, 2), "€59.90");
  },
);
check(
  "Cherry L human override is represented; no fabricated ordinary-row evidence",
  () => {
    const v = getVariant("CH-BRA-L");
    assert.equal(v.overrideType, "FIT_SIGNAL");
    assert.equal(v.modelRecommendation, "BUY_DEEPER");
    assert.equal(v.analystRecommendation, "INVESTIGATE");
    assert.equal(
      v.analystReason,
      "Elevated L→M exchanges materially weaken retained L demand.",
    );
    for (const ordinary of variants.filter((v) =>
      ["HOLD", "WATCH"].includes(v.analystRecommendation),
    )) {
      assert.equal(ordinary.analystReason, undefined);
      assert.equal(ordinary.modelRecommendation, undefined);
      assert.equal(ordinary.initialExpectedRetainedDemand, undefined);
      assert.equal(ordinary.confidence, undefined);
    }
    assert.match(
      readFileSync("src/data/naturana.types.ts", "utf8"),
      /overrideType\?: string/,
    );
  },
);
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? sources(join(dir, e.name))
      : /\.(tsx?|css)$/.test(e.name)
        ? [join(dir, e.name)]
        : [],
  );
}
check(
  "Runtime copy contains no private-data claims, forbidden size, legacy brand or reference prices",
  () => {
    const files = sources("src");
    for (const f of files) {
      const s = readFileSync(f, "utf8");
      for (const phrase of [
        /your data/i,
        /your sales/i,
        /connected to your ERP/i,
        /Kelarune/i,
        /Plum\s+90E/i,
        /U-296-001-90E/i,
      ])
        assert.doesNotMatch(s, phrase, f);
      if (f.includes("components")) assert.doesNotMatch(s, /referencePriceEUR/);
    }
    assert.match(disclaimer, /synthetic assumptions/);
    assert.equal(
      tagline,
      "Analysis maintained by ScaleSight. Decisions made with NATURANA.",
    );
    const shell = readFileSync("src/components/AppShell.tsx", "utf8");
    assert.match(shell, /illustrative-disclaimer/);
    assert.match(shell, /\/managed-intelligence/);
    assert.match(shell, /Assumptions & Customisation/);
    assert.match(
      readFileSync("src/components/ManagedWorkflow.tsx", "utf8"),
      /Built around how NATURANA actually plans/,
    );
  },
);
check("Exactly the ten specified routes; obsolete modules removed", () => {
  const routes = readdirSync("src/app", { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => `/${e.name}`)
    .sort();
  assert.deepEqual(
    routes,
    [
      "/assumptions",
      "/fit-signal",
      "/forecast-learning",
      "/managed-intelligence",
      "/next-buy",
      "/scenario",
      "/size-demand",
      "/size-translation",
      "/sku-planning",
    ].sort(),
  );
});
console.log(`\n${checks} NATURANA acceptance groups passed.`);
