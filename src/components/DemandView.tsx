"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fixture, learningCopy } from "../data/fishwife.v1";
import { demandContext, lemonLearning, skuMetrics } from "../engine/fishwife";
import { number, percent } from "../engine/formatters";
import {
  Badge,
  ConfidenceValue,
  Metric,
  PageHeading,
  Reviewed,
  SectionHeading,
} from "./ui";
import { DemandChart } from "./DemandChart";
export function DemandView() {
  const [sku, setSku] = useState("TUN-SL");
  const [channel, setChannel] = useState("ALL");
  const m = skuMetrics(sku);
  const context = demandContext(sku, channel);
  const hasSeries = context.modeled;
  return (
    <>
      <PageHeading
        title="Which demand signals deserve a change in the plan?"
        description="Separate durable demand movement from launches, collaborations, retailer fill and short-term noise."
      />
      <div className="toolbar">
        <label>
          Product context
          <select
            aria-label="Product context"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          >
            {fixture.skus.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="secondary-button"
          onClick={() => {
            setSku("TUN-SL");
            setChannel("ALL");
          }}
        >
          <RotateCcw size={13} />
          Reset to current plan
        </button>
      </div>
      <div className="channel-tabs" aria-label="Channel context">
        {fixture.channels.map((c) => (
          <button
            key={c.name}
            aria-pressed={channel === c.name}
            onClick={() => setChannel(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <div className="panel-title">
            <h2>{m.sku.short}</h2>
            <span>13-WEEK HISTORY + 3-WEEK PLAN</span>
          </div>
          {hasSeries ? (
            <DemandChart sku={sku} channel={channel} />
          ) : (
            <div className="empty-state">
              No modeled observations.
              <p className="chart-summary">
                This channel has a 0% share in the approved illustrative mix. It
                is not evidence of zero actual Fishwife demand.
              </p>
            </div>
          )}
        </section>
        <aside className="panel" aria-label="ScaleSight demand interpretation">
          <p className="eyebrow">SCALESIGHT INTERPRETATION</p>
          <div className="metric-grid">
            <Metric
              label="Current signal"
              value={number(context.current)}
              unit="tins/week"
            />
            <Metric
              label="Baseline plan"
              value={number(context.baseline)}
              unit="tins/week"
            />
            <Metric
              label="Variance vs baseline"
              value={percent(context.variance)}
            />
            <Metric
              label={
                sku === "TUN-SL"
                  ? "Post-event persistence"
                  : "Recent 4-week uplift"
              }
              value={percent(context.uplift)}
            />
            <Metric
              label="Confidence"
              value={<ConfidenceValue value={context.confidence} />}
            />
          </div>
          <p className="interpretation-copy">
            {!hasSeries
              ? "No modeled observations for this channel."
              : sku === "TUN-SL"
                ? "Demand remains elevated after the collaboration. Reserve capacity while reviewing the next retailer reorder cycle."
                : sku === "TRT-ORIG"
                  ? "Demand-learning confidence is LOW: constrained availability can censor true demand."
                  : sku === "MUS-BP"
                    ? "Recent acceleration supports review of existing packing capacity before adding a new commitment."
                    : "The complete illustrative history shows how demand has evolved against the baseline. Keep the supplied SKU recommendation in view."}
          </p>
          <p className="small-copy">
            {channel === "ALL"
              ? "All modeled channels combined."
              : `${context.share}% synthetic channel share; rounded channel quantities reconcile to the total.`}{" "}
            Channel histories use fixed illustrative shares, not independent
            retailer observations.
          </p>
          <div className="recommendation-block">
            <p className="eyebrow">REVIEWED CURRENT-PLAN RECOMMENDATION</p>
            <Badge label={m.sku.label} tone="blue" />
            <p>
              {sku === "TUN-SL" && hasSeries
                ? "Reserve the next production slot. Confirm final incremental quantity after the next retailer reorder cycle."
                : "The supplied SKU recommendation is retained; channel selection does not create a new commercial decision."}
            </p>
          </div>
          <Reviewed />
        </aside>
      </div>
      <p className="source-context">
        Synthetic demo inputs · Approved fixture v1.1. Channel shares and
        history are illustrative, not Fishwife actuals.
      </p>
    </>
  );
}
export function ForecastLearning() {
  const l = lemonLearning();
  const m = skuMetrics("TUN-SL");
  return (
    <>
      <PageHeading title="Not every spike deserves a new production plan." />
      <div className="two-col">
        <section className="panel">
          <div className="panel-title">
            <h2>Spanish Lemon Tuna</h2>
            <span>EVENT-AWARE DEMAND LEARNING</span>
          </div>
          <DemandChart learning />
        </section>
        <aside className="panel" aria-label="What ScaleSight is learning">
          <SectionHeading title="What ScaleSight is learning" />
          <div className="metric-grid">
            <Metric
              label="Pre-event baseline"
              value={number(m.sku.baseline)}
              unit="tins/week"
            />
            <Metric
              label="Recent 4-week average"
              value={number(l.average)}
              unit="tins/week"
            />
            <Metric label="Post-event persistence" value={percent(l.uplift)} />
            <Metric
              label="Confidence"
              value={<ConfidenceValue value={l.confidence} />}
            />
          </div>
          <p className="interpretation-copy">{learningCopy}</p>
          <Badge label="REVIEW BUY" tone="blue" />
          <div>
            <Reviewed />
          </div>
        </aside>
      </div>
      <aside
        className="watch-panel"
        aria-label="A spike we would not yet act on"
      >
        <div>
          <Badge label="WATCH" tone="yellow" />
        </div>
        <div>
          <h2>A spike we would NOT yet act on</h2>
          <p>
            The supplied 17 Aug collaboration observation is 6,400 tins. That
            single active-event spike alone does not establish a permanent new
            production requirement. The later four-week mean provides the
            persistence evidence.
          </p>
          <p className="draft-label">
            ScaleSight interpretation of supplied history · The Scenario
            Planning page now includes a separate Gold Label retailer
            pull-forward example from fixture v1.1.
          </p>
          <p className="small-copy">
            Monitoring next cycle · Review another retailer reorder cycle before
            final incremental quantity.
          </p>
        </div>
      </aside>
    </>
  );
}
