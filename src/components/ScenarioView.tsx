"use client";
import { RotateCcw } from "lucide-react";
import { usePlanning } from "../context/PlanningContext";
import { scenarios, allocations, products } from "../data/naturana";
import { pages } from "../data/naturana.copy";
import type { ScenarioInputs } from "../data/naturana.types";
import { committedAllocation, reserve } from "../engine/naturana";
import { money } from "../engine/formatters";
import {
  PageHeading,
  SectionHeading,
  AnalystNote,
  PlanLink,
  DataTable,
  Interpretation,
} from "./ui";
import { MetricCard } from "./MetricCard";
import { SetAvailability } from "./NaturanaOverview";
function NumericControl({
  field,
  label,
  min,
  max,
  step = 1,
  suffix = "",
}: {
  field: keyof ScenarioInputs;
  label: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  const { state, dispatch } = usePlanning();
  return (
    <label className="range-label">
      <span>
        {label}
        <output>
          {Number(state.inputs[field]).toLocaleString("en-IE")}
          {suffix}
        </output>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Number(state.inputs[field])}
        onChange={(e) =>
          dispatch({
            type: "update",
            patch: { [field]: Number(e.target.value) },
          })
        }
      />
      <small>
        {min.toLocaleString("en-IE")}
        {suffix} → {max.toLocaleString("en-IE")}
        {suffix}
      </small>
    </label>
  );
}
function Toggle({
  field,
  label,
}: {
  field:
    | "promotionExtensionEnabled"
    | "fitAdjustedDemandEnabled"
    | "exchangeAdjustmentEnabled";
  label: string;
}) {
  const { state, dispatch } = usePlanning();
  return (
    <label className="toggle-label">
      <input
        type="checkbox"
        checked={state.inputs[field]}
        onChange={(e) =>
          dispatch({ type: "update", patch: { [field]: e.target.checked } })
        }
      />
      {label}
    </label>
  );
}
function PresetSelector() {
  const { state, dispatch } = usePlanning();
  return (
    <div className="preset-controls">
      <div className="segmented" aria-label="Scenario presets">
        {scenarios.map((s) => (
          <button
            key={s.id}
            aria-pressed={state.presetId === s.id}
            onClick={() => dispatch({ type: "preset", id: s.id })}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        className="button secondary"
        onClick={() => dispatch({ type: "reset" })}
      >
        <RotateCcw size={15} />
        Reset to Base Plan
      </button>
    </div>
  );
}
function CustomNotice() {
  return (
    <div className="uncalibrated" role="status">
      <h2>Custom: not calibrated in V1</h2>
      <p>
        These inputs can be reviewed with ScaleSight. A calculation rule is
        needed before this combination can produce a demand forecast, allocation
        or recommendation. Select a supplied preset to see its reviewed outputs.
      </p>
    </div>
  );
}
export function ScenarioView() {
  const { state, scenario } = usePlanning();
  const outputRows: React.ReactNode[][] = scenario
    ? [
        ...(scenario.actions !== undefined
          ? [["Variants requiring action", 18, scenario.actions]]
          : []),
        ...(scenario.setRisks !== undefined
          ? [["Set risks", 2, scenario.setRisks]]
          : []),
        [
          "Available open-to-buy",
          money(50000),
          money(state.inputs.openToBuyBudgetEUR),
        ],
        ...(scenario.commitment !== undefined
          ? [
              [
                "Recommended commitment",
                money(committedAllocation),
                money(scenario.commitment),
              ],
            ]
          : []),
        ...(scenario.reserve !== undefined
          ? [["Reserve", money(reserve), money(scenario.reserve)]]
          : []),
        ...(scenario.requirement !== undefined
          ? [
              [
                "Required inventory investment",
                "—",
                money(scenario.requirement),
              ],
            ]
          : []),
        ...(scenario.gap !== undefined
          ? [["Planning gap", "—", money(scenario.gap)]]
          : []),
        ...(scenario.incrementalRequirement !== undefined
          ? [
              [
                "Incremental required commitment",
                "—",
                money(scenario.incrementalRequirement),
              ],
            ]
          : []),
        ...(scenario.lDemandChangePct !== undefined
          ? [
              [
                "L fit-adjusted demand",
                "Baseline",
                `${scenario.lDemandChangePct}%`,
              ],
              [
                "M retained demand",
                "Baseline",
                `+${scenario.mRetainedChangePct}%`,
              ],
            ]
          : []),
      ]
    : [];
  return (
    <>
      <PageHeading {...pages.scenario} />
      <PresetSelector />
      <div className="scenario-layout">
        <section className="panel scenario-controls">
          <SectionHeading
            title="Planning assumptions"
            description="Preset values are supplied. Custom inputs need calibration."
          />
          <NumericControl
            field="overallDemandUpliftPct"
            label="Overall demand uplift"
            min={-20}
            max={40}
            suffix="%"
          />
          <NumericControl
            field="mDemandAdjustmentPct"
            label="M demand adjustment"
            min={-20}
            max={30}
            suffix="%"
          />
          <NumericControl
            field="lDemandAdjustmentPct"
            label="L demand adjustment"
            min={-20}
            max={30}
            suffix="%"
          />
          <NumericControl
            field="returnRateAdjustmentPP"
            label="Return-rate adjustment"
            min={-5}
            max={10}
            suffix=" pp"
          />
          <NumericControl
            field="exchangeRateAdjustmentPP"
            label={
              state.presetId === "FIT_FRICTION"
                ? "L exchange-rate adjustment"
                : "Size-exchange adjustment"
            }
            min={-5}
            max={10}
            suffix=" pp"
          />
          <NumericControl
            field="leadTimeAdjustmentWeeks"
            label="Lead-time change"
            min={-2}
            max={4}
            suffix=" weeks"
          />
          <NumericControl
            field="openToBuyBudgetEUR"
            label="Open-to-buy (€)"
            min={25000}
            max={100000}
            step={500}
          />
          <NumericControl
            field="setAttachRatePct"
            label="Matching-set attach rate"
            min={40}
            max={80}
            suffix="%"
          />
          <p className="chart-note">
            62% base attach rate is a synthetic planning assumption.
          </p>
          <Toggle
            field="promotionExtensionEnabled"
            label="Promotion extension"
          />
        </section>
        <div className="scenario-results">
          {scenario ? (
            <section className="panel scenario-output">
              <p className="eyebrow">ILLUSTRATIVE ASSUMPTION-BASED SCENARIO</p>
              <SectionHeading
                title={`${scenario.label} · supplied preset`}
                description="Illustrative assumption-based scenario"
              />
              <DataTable
                caption="Base versus selected scenario"
                headers={["Planning output", "Base reference", scenario.label]}
                rows={outputRows}
              />
              <p className="chart-note">
                Only supplied preset outputs are shown. Projected 8-week demand
                and unprovided output fields are not calibrated in V1.
              </p>
            </section>
          ) : (
            <CustomNotice />
          )}
          {scenario && (
            <AnalystNote title="Key decision changes">
              <p>{scenario.recommendation}</p>
              <p className="chart-note">
                Illustrative assumption-based scenario
              </p>
            </AnalystNote>
          )}
          <section className="panel">
            <h2>Test the decision before committing.</h2>
            <p>
              Base, Upside, Supplier Delay and Fit Friction are the supplied V1
              presets. Downside and arbitrary combinations need additional
              calculation rules.
            </p>
            <PlanLink href="/next-buy">Review the planning allocation</PlanLink>
            <PlanLink href="/managed-intelligence">
              How ScaleSight reviews the trade-offs
            </PlanLink>
          </section>
        </div>
      </div>
    </>
  );
}
export function NextBuy() {
  const { state, dispatch, scenario } = usePlanning();
  const isBase = state.presetId === "BASE";
  return (
    <>
      <PageHeading {...pages.buy} />
      <PresetSelector />
      <section className="panel buy-controls">
        <SectionHeading
          title="Planning assumptions"
          description="Changes outside the supplied presets need calibration."
        />
        <div className="variant-filters">
          <label>
            OTB budget (€)
            <input
              type="number"
              min={25000}
              max={100000}
              step={500}
              value={state.inputs.openToBuyBudgetEUR}
              onChange={(e) => {
                if (e.target.value && Number.isFinite(e.target.valueAsNumber))
                  dispatch({
                    type: "update",
                    patch: {
                      openToBuyBudgetEUR: Math.max(
                        25000,
                        Math.min(100000, e.target.valueAsNumber),
                      ),
                    },
                  });
              }}
            />
          </label>
          <label>
            Target coverage — tops
            <input
              type="number"
              min={1}
              max={26}
              value={state.inputs.topTargetCoverWeeks}
              onChange={(e) => {
                if (e.target.value)
                  dispatch({
                    type: "update",
                    patch: {
                      topTargetCoverWeeks: Math.max(
                        1,
                        Math.min(26, e.target.valueAsNumber),
                      ),
                    },
                  });
              }}
            />
          </label>
          <label>
            Target coverage — bottoms
            <input
              type="number"
              min={1}
              max={26}
              value={state.inputs.bottomTargetCoverWeeks}
              onChange={(e) => {
                if (e.target.value)
                  dispatch({
                    type: "update",
                    patch: {
                      bottomTargetCoverWeeks: Math.max(
                        1,
                        Math.min(26, e.target.valueAsNumber),
                      ),
                    },
                  });
              }}
            />
          </label>
          <label>
            Planning horizon
            <select
              aria-label="Planning horizon"
              value={state.inputs.planningHorizonWeeks}
              onChange={(e) =>
                dispatch({
                  type: "update",
                  patch: {
                    planningHorizonWeeks: Number(e.target.value) as 4 | 8 | 13,
                  },
                })
              }
            >
              {[4, 8, 13].map((h) => (
                <option key={h} value={h}>
                  {h} weeks
                </option>
              ))}
            </select>
          </label>
          <label>
            Reserve percentage
            <input
              type="number"
              min={0}
              max={100}
              value={state.inputs.reservePct}
              onChange={(e) => {
                if (e.target.value)
                  dispatch({
                    type: "update",
                    patch: {
                      reservePct: Math.max(
                        0,
                        Math.min(100, e.target.valueAsNumber),
                      ),
                    },
                  });
              }}
            />
          </label>
        </div>
        <div className="buy-toggles">
          <Toggle
            field="fitAdjustedDemandEnabled"
            label="Fit-adjusted demand"
          />
          <Toggle
            field="exchangeAdjustmentEnabled"
            label="Exchange-adjusted demand"
          />
        </div>
      </section>
      {isBase ? (
        <>
          <div className="metrics three">
            <MetricCard
              label="Available open-to-buy"
              value={money(50000)}
              qualifier="Synthetic planning budget"
            />
            <MetricCard
              label="Recommended commitment"
              value={money(committedAllocation)}
              qualifier="Across eight products"
              accent
            />
            <MetricCard
              label="Uncommitted reserve"
              value={money(reserve)}
              qualifier="5% of available budget"
            />
          </div>
          <section className="panel">
            <SectionHeading
              title="Recommended planning allocation under current assumptions."
              description="Planning budget, not a literal purchase-order recommendation."
            />
            <div
              className="allocation-bar"
              role="img"
              aria-label="95% committed, 5% reserve"
            >
              <span />
              <span />
            </div>
            <DataTable
              caption="Product-level planning allocation"
              headers={[
                "Product",
                "Synthetic unit cost",
                "Planning quantity",
                "Recommended allocation",
              ]}
              rows={allocations
                .map((a) => {
                  const p = products.find((p) => p.productId === a.productId)!;
                  return [
                    p.naturanaProductName,
                    money(p.syntheticUnitCostEUR),
                    a.quantity,
                    money(a.amount),
                  ];
                })
                .concat([
                  ["Uncommitted reserve", "—", "—", money(reserve)],
                  ["Total", "—", "—", money(committedAllocation + reserve)],
                ])}
            />
          </section>
          <AnalystNote title="ScaleSight recommendation">
            <p>{scenarios[0].recommendation}</p>
            <p>
              Matching bottoms are funded alongside the strongest tops so the
              buy does not create avoidable set constraints.
            </p>
            <PlanLink href="/scenario">Stress-test this buy</PlanLink>
          </AnalystNote>
        </>
      ) : scenario ? (
        <section className="panel scenario-output">
          <p className="eyebrow">ILLUSTRATIVE ASSUMPTION-BASED SCENARIO</p>
          <h2>{scenario.label}</h2>
          <p>{scenario.recommendation}</p>
          {scenario.requirement !== undefined && (
            <p>
              Requirement: <strong>{money(scenario.requirement)}</strong> · Gap:{" "}
              <strong>{money(scenario.gap!)}</strong>
            </p>
          )}
          {scenario.incrementalRequirement !== undefined && (
            <p>
              Incremental requirement:{" "}
              <strong>{money(scenario.incrementalRequirement)}</strong>
            </p>
          )}
          {scenario.lDemandChangePct !== undefined && (
            <p>L fit-adjusted demand: −12% · M retained demand: +6%</p>
          )}
          <Interpretation>
            No product-level allocation is supplied for this preset. Return to
            Base to review the €50,000 planning allocation.
          </Interpretation>
          <PlanLink href="/scenario">Review scenario outputs</PlanLink>
        </section>
      ) : (
        <CustomNotice />
      )}
      <SetAvailability />
    </>
  );
}
