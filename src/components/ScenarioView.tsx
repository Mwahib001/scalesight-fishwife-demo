"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fixture } from "../data/fishwife.v1";
import {
  initialScenario,
  scenarioPreset,
  scenarioOutputs,
  validateScenario,
  type ScenarioState,
} from "../engine/fishwife";
import { number, usd, date } from "../engine/formatters";
import { AnalystNote, Badge, Metric, PageHeading } from "./ui";
import { InventoryChart } from "./InventoryChart";
type Field = Exclude<keyof ScenarioState, "preset">;
const fields: [Field, string, string][] = [
  [
    "demandChange",
    "Demand change",
    "−20% to +40% · relative to 3,600 tins/week",
  ],
  [
    "delay",
    "Receipt delay",
    "0–6 whole weeks after the original 5 Nov receipt",
  ],
  [
    "protectedDemand",
    "Protected demand",
    "Whole tins per week · served before discretionary demand",
  ],
  [
    "premium",
    "Expedite premium",
    "USD incremental for split recovery · full expedite fixed at $6,300",
  ],
];
const draftsFor = (state: ScenarioState): Record<Field, string> => ({
  demandChange: String(state.demandChange),
  delay: String(state.delay),
  protectedDemand: String(state.protectedDemand),
  premium: String(state.premium),
});
export function ScenarioView() {
  const [state, setState] = useState(initialScenario);
  const [drafts, setDrafts] = useState(() => draftsFor(initialScenario()));
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const outputs = scenarioOutputs(state);
  const load = (next: ScenarioState) => {
    setState(next);
    setDrafts(draftsFor(next));
    setErrors({});
  };
  const update = (key: Field, value: string) => {
    setDrafts((d) => ({ ...d, [key]: value }));
    const result = validateScenario(key, value);
    if (result.error) {
      setErrors((e) => ({ ...e, [key]: result.error! }));
      return;
    }
    setErrors((e) => ({ ...e, [key]: undefined }));
    setState((s) => ({ ...s, [key]: result.value }));
  };
  const week = (value: number | null) =>
    value === null ? "None" : `Week ${value}`;
  return (
    <>
      <PageHeading
        title="What would actually change the decision?"
        description="Gold Label Smoked Salmon · Start from the current HOLD plan, then test the commitments that could change it."
      />
      <div className="scenario-tags">
        <Badge label="ILLUSTRATIVE SCENARIO" tone="blue" />
        <Badge label="PLANNING ASSUMPTION" tone="yellow" />
        <Badge label="REVIEWED RECOMMENDATION" tone="green" />
      </div>
      <div
        className="scenario-tabs"
        role="tablist"
        aria-label="Scenario narrative"
      >
        {fixture.scenario.presets.map((preset, i) => (
          <button
            key={preset.label}
            role="tab"
            id={`scenario-tab-${i}`}
            aria-selected={state.preset === i}
            aria-controls="scenario-panel"
            tabIndex={
              state.preset === i || (state.preset < 0 && i === 0) ? 0 : -1
            }
            onClick={() => load(scenarioPreset(i))}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 2
                    : (i + (event.key === "ArrowRight" ? 1 : 2)) % 3;
              load(scenarioPreset(next));
              document.getElementById(`scenario-tab-${next}`)?.focus();
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="two-col">
        <section
          className="panel"
          id="scenario-panel"
          role="tabpanel"
          aria-labelledby={
            state.preset < 0
              ? "current-scenario-title"
              : `scenario-tab-${state.preset}`
          }
        >
          <div className="panel-title">
            <h2 id="current-scenario-title">{outputs.context}</h2>
            <span>SAL-GL · SYNTHETIC FIXTURE v1.1</span>
          </div>
          <p className="small-copy">
            20,000 tins on hand · 9,000 incoming · $4.80 landed cost/tin · MOQ
            9,000. Select a tab to load its exact preset; Reset restores the
            current plan.
          </p>
          <div className="scenario-controls">
            {fields.map(([key, label, hint]) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type="text"
                  inputMode={
                    key === "delay" || key === "protectedDemand"
                      ? "numeric"
                      : "decimal"
                  }
                  value={drafts[key]}
                  aria-invalid={!!errors[key]}
                  aria-describedby={`${key}-hint${errors[key] ? ` ${key}-error` : ""}`}
                  onChange={(event) => update(key, event.target.value)}
                />
                <small id={`${key}-hint`}>{hint}</small>
                {errors[key] && (
                  <p className="input-error" id={`${key}-error`} role="alert">
                    {errors[key]} Last valid assumption retained.
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="scenario-outputs" aria-live="polite">
            <Metric label="Projected stockout" value={week(outputs.stockout)} />
            <Metric
              label="Safety-stock breach"
              value={week(outputs.safetyBreach)}
            />
            <Metric
              label="Units exposed"
              value={number(outputs.exposure)}
              unit="tins"
            />
            <Metric
              label="Incremental cash"
              value={usd(outputs.cash)}
              unit="USD recovery"
            />
          </div>
          <p className="source-context" aria-live="polite">
            Last valid demand assumption: {number(outputs.demand)} tins/week.
            Receipt: {date(outputs.receiptDate)}. Safety reserve:{" "}
            {number(outputs.safety)} tins. Pre-receipt inventory:{" "}
            {number(outputs.preReceipt)} tins. Risk metrics describe the plan
            without intervention; cash describes the response below.
          </p>
          <InventoryChart
            rows={outputs.base}
            comparison={outputs.selected}
            opening={20000}
            safety={outputs.safety}
            title="Gold Label scenario inventory trajectory"
          />
          <button
            className="secondary-button scenario-reset"
            onClick={() => load(initialScenario())}
          >
            <RotateCcw size={14} />
            Reset to current plan
          </button>
        </section>
        <AnalystNote title="ScaleSight view">
          <p className="eyebrow">CALCULATED SCENARIO RESPONSE</p>
          <div aria-live="polite" data-testid="scenario-response">
            <Badge
              label={outputs.response}
              tone={outputs.response === "HOLD" ? "green" : "blue"}
            />
            <p>{outputs.reasoning}</p>
          </div>
          <div className="recommendation-block">
            <p className="eyebrow">WHAT CHANGES</p>
            <p>
              {outputs.response === "SPLIT"
                ? `Move 5,000 tins to ${date(outputs.earlyDate)}; retain 4,000 for ${date(outputs.receiptDate)}.`
                : outputs.response === "EXPEDITE"
                  ? `Compare moving all 9,000 tins to ${date(outputs.earlyDate)} for $6,300 incremental.`
                  : `Retain the 9,000-tin receipt on ${date(outputs.receiptDate)} while reviewing the signal.`}
            </p>
            <p>
              After response:{" "}
              <strong>{number(outputs.remainingExposure)} tins exposed</strong>{" "}
              before the standard receipt.
            </p>
            <p>
              Incremental recovery: <strong>{usd(outputs.cash)}</strong>.
              Existing PO value: {usd(outputs.poValue)}; already committed, not
              added recovery cash.
            </p>
          </div>
          <div className="recommendation-block">
            <p className="eyebrow">REVIEWED CURRENT PLAN</p>
            <Badge label="HOLD" tone="green" />
            <p>
              The reviewed base commitment stays HOLD. Calculated scenario
              responses use the approved illustrative decision rule; Fishwife
              retains the commercial decision.
            </p>
          </div>
          <details className="chart-data">
            <summary>How this scenario is calculated</summary>
            <p>
              Receipts are available before demand. SPLIT applies when stockout
              occurs or pre-receipt inventory falls below one week of entered
              protected demand, with a split premium at or below $4,000.
              EXPEDITE takes priority above 4,000 exposed tins or if split
              leaves protected demand unserved. An over-threshold split cost
              otherwise requires INVESTIGATE.
            </p>
            <p>
              For custom delays, early recovery is scheduled one period before
              standard receipt, capped at the original 5 Nov date. This explicit
              demo convention extends the supplied presets. The final chart
              point is the opening receipt, not another demand period.
            </p>
            <p>
              Retailer pull-forward uses the supplied six-week shape;
              demand-change overrides scale that shape. Beyond six weeks, demand
              returns to the scaled baseline. Safety is 2.5 weeks of scaled
              baseline demand.
            </p>
          </details>
          <p className="source-context">
            Synthetic fixture v1.1 · Demo policy, not Fishwife actuals or a live
            approval.
          </p>
        </AnalystNote>
      </div>
    </>
  );
}
