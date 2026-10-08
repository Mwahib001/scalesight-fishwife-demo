"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { empty, fixture, learningCopy } from "../data/fishwife.v1";
import { lemonLearning, skuMetrics } from "../engine/fishwife";
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
  const learning = lemonLearning();
  const hasSeries = sku === "TUN-SL" && channel === "ALL";
  const aggregate = channel === "ALL";
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
            <span>13-WEEK VIEW · TINS / WEEK</span>
          </div>
          {hasSeries ? (
            <DemandChart />
          ) : (
            <div className="empty-state">
              {empty}
              <p className="chart-summary">
                {aggregate
                  ? "Aggregate current and baseline inputs are supplied, but dated weekly observations are absent."
                  : "Channel-level observations, variance, confidence and interpretation are not supplied."}
              </p>
            </div>
          )}
        </section>
        <aside className="panel" aria-label="ScaleSight demand interpretation">
          <p className="eyebrow">SCALESIGHT INTERPRETATION</p>
          <div className="metric-grid">
            <Metric
              label="Current signal"
              value={aggregate ? number(m.sku.current) : "—"}
              unit="tins/week"
            />
            <Metric
              label={sku === "TUN-SL" ? "Pre-event baseline" : "Baseline plan"}
              value={aggregate ? number(m.sku.baseline) : "—"}
              unit="tins/week"
            />
            <Metric
              label="Variance vs baseline"
              value={aggregate ? percent(m.variance) : "—"}
            />
            <Metric
              label="Post-event persistence"
              value={hasSeries ? percent(learning.uplift) : "—"}
            />
            <Metric
              label="Confidence"
              value={
                <ConfidenceValue
                  value={
                    hasSeries
                      ? learning.confidence
                      : sku === "TRT-ORIG" && aggregate
                        ? "LOW"
                        : null
                  }
                />
              }
            />
          </div>
          {hasSeries ? (
            <>
              <p className="interpretation-copy">
                Demand has remained elevated after the collaboration ended. The
                signal is persistent enough to reserve capacity, but not yet
                strong enough to treat the entire uplift as permanent demand.
              </p>
              <p className="small-copy">
                {percent(m.variance)} on paper vs {percent(learning.uplift)}{" "}
                that has actually persisted.
              </p>
            </>
          ) : (
            <p className="small-copy">
              {sku === "TRT-ORIG" && aggregate
                ? "Demand-learning confidence is LOW: constrained availability can censor true demand."
                : empty}
            </p>
          )}
          <div className="recommendation-block">
            <p className="eyebrow">REVIEWED CURRENT-PLAN RECOMMENDATION</p>
            <Badge label={m.sku.label} tone="blue" />
            <p>
              {hasSeries
                ? "Reserve the next production slot. Confirm final incremental quantity after the next retailer reorder cycle."
                : "The supplied SKU recommendation is retained. This selected context has no separately reviewed recommendation."}
            </p>
          </div>
          <Reviewed />
        </aside>
      </div>
      <p className="source-context">
        Synthetic demo inputs · Technical specification §7 / §11. Channel
        selections never divide aggregate demand.
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
            ScaleSight interpretation of supplied history · A separate retailer
            pull-forward example requires an approved fixture addition (Q5 /
            Q9).
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
