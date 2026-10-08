"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fixture } from "../data/fishwife.v1";
import {
  initialScenario,
  scenarioOutputs,
  validateScenario,
  type ScenarioState,
} from "../engine/fishwife";
import { number, usd } from "../engine/formatters";
import { AnalystNote, Badge, Metric, Missing, PageHeading } from "./ui";
type Field = Exclude<keyof ScenarioState, "preset">;
const fields: [
  Field,
  string,
  string,
  number | undefined,
  number | undefined,
  string,
][] = [
  [
    "demandChange",
    "Demand change",
    "%",
    -20,
    40,
    "−20% to +40% · relative to current FBJ demand",
  ],
  [
    "delay",
    "Receipt delay",
    "weeks",
    0,
    6,
    "Whole weeks, 0 to 6 · exploratory override",
  ],
  [
    "protectedDemand",
    "Protected demand",
    "tins",
    0,
    undefined,
    "Baseline not specified · whole nonnegative tins",
  ],
  [
    "premium",
    "Expedite premium",
    "USD incremental",
    0,
    undefined,
    "Nonnegative USD amount · threshold not supplied",
  ],
];
export function ScenarioView() {
  const [state, setState] = useState<ScenarioState>(initialScenario);
  const [drafts, setDrafts] = useState<Record<Field, string>>({
    demandChange: "0",
    delay: "0",
    protectedDemand: "",
    premium: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const outputs = scenarioOutputs(state);
  const reset = () => {
    setState(initialScenario());
    setDrafts({
      demandChange: "0",
      delay: "0",
      protectedDemand: "",
      premium: "",
    });
    setErrors({});
  };
  const update = (key: Field, text: string) => {
    setDrafts((d) => ({ ...d, [key]: text }));
    const result = validateScenario(key, text);
    if (result.error) {
      setErrors((e) => ({ ...e, [key]: result.error! }));
      return;
    }
    setErrors((e) => ({ ...e, [key]: undefined }));
    setState((s) => ({ ...s, [key]: result.value }));
  };
  return (
    <>
      <PageHeading title="What would actually change the decision?" />
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
        {fixture.scenario.presets.map((p, i) => (
          <button
            key={p.label}
            role="tab"
            aria-selected={state.preset === i}
            aria-controls="scenario-panel"
            id={`scenario-tab-${i}`}
            tabIndex={state.preset === i ? 0 : -1}
            onClick={() => setState((s) => ({ ...s, preset: i }))}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (state.preset + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setState((s) => ({ ...s, preset: next }));
                document.getElementById(`scenario-tab-${next}`)?.focus();
              }
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="two-col">
        <section
          className="panel"
          id="scenario-panel"
          role="tabpanel"
          aria-labelledby={`scenario-tab-${state.preset}`}
        >
          <div className="panel-title">
            <h2>{outputs.context}</h2>
            <span>FBJ SALMON · ILLUSTRATIVE ASSUMPTIONS</span>
          </div>
          <p className="small-copy" style={{ marginBottom: 22 }}>
            Preset narrative selected. Exact preset values are not supplied;
            selecting a tab retains your last valid assumptions and does not
            invent calibration.
          </p>
          <div className="scenario-controls">
            {fields.map(([key, label, unit, min, max, hint]) => (
              <div className="field" key={key}>
                <label htmlFor={key}>
                  {label} <span className="small-copy">· {unit}</span>
                </label>
                <input
                  id={key}
                  type="text"
                  inputMode={
                    key === "protectedDemand" || key === "delay"
                      ? "numeric"
                      : "decimal"
                  }
                  value={drafts[key]}
                  aria-invalid={!!errors[key]}
                  aria-describedby={`${key}-hint${errors[key] ? ` ${key}-error` : ""}`}
                  data-min={min}
                  data-max={max}
                  placeholder={
                    key === "premium" || key === "protectedDemand"
                      ? "Not specified"
                      : ""
                  }
                  onChange={(e) => update(key, e.target.value)}
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
            <Metric label="Projected stockout" value="—" />
            <Metric label="Safety-stock breach" value="—" />
            <Metric label="Units exposed" value="—" />
            <Metric label="Incremental cash" value="—" />
          </div>
          <p className="source-context" aria-live="polite">
            Last valid demand assumption: {number(outputs.demand)} tins/week.{" "}
            Receipt delay override: {state.delay} weeks. Protected demand:{" "}
            {state.protectedDemand === null
              ? "Not specified"
              : `${number(state.protectedDemand)} tins`}
            . Expedite premium:{" "}
            {state.premium === null
              ? "Not specified"
              : `${usd(state.premium)} USD`}
            . Exact operational outputs: Not specified in demo source.
          </p>
          <button className="secondary-button scenario-reset" onClick={reset}>
            <RotateCcw size={14} />
            Reset to current plan
          </button>
        </section>
        <AnalystNote title="ScaleSight view">
          <Badge label="SPLIT" tone="blue" />
          <p>
            Reviewed current-plan response: bring 4,000 units forward, retain
            2,000 on standard freight and remove incremental DTC promotional
            demand.
          </p>
          <p>
            The supplied HOLD-to-SPLIT example requires a confirmed recovery
            threshold. Exploratory inputs do not change the reviewed
            recommendation.
          </p>
          <Missing>
            {outputs.missing.join(" · ")}. Exact preset values are also pending
            (Q3 / Q5).
          </Missing>
          <p className="small-copy">
            Fishwife determines the recovery commitment and account priorities.
            Reset clears every exploratory override; canonical inventory and PO
            records stay immutable.
          </p>
        </AnalystNote>
      </div>
    </>
  );
}
