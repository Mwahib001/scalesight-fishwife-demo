"use client";
import { useState } from "react";
import { fixture } from "../data/fishwife.v1";
import { costDifference, skuMetrics } from "../engine/fishwife";
import { number, usd } from "../engine/formatters";
import { AnalystNote, Badge, Metric, Missing, PageHeading } from "./ui";
export function POIntervention() {
  const [option, setOption] = useState("split-promo");
  const selected = fixture.fbj.options.find((o) => o.id === option)!;
  const s = skuMetrics("SAL-FBJ");
  return (
    <>
      <PageHeading title="When a PO slips, which recovery option is worth its cost?" />
      <p className="eyebrow">
        SMOKED SALMON WITH FLY BY JING CHILI CRISP · FW-1184
      </p>
      <div className="metrics five">
        <Metric
          label="Current inventory"
          value={number(s.sku.onHand)}
          unit="tins"
        />
        <Metric
          label="Current demand"
          value={number(s.sku.current)}
          unit="tins/week"
        />
        <Metric
          label="Incoming PO"
          value={number(s.sku.incoming)}
          unit="tins"
        />
        <Metric
          label="Illustrative receipt delay"
          value={`+${fixture.fbj.delayWeeks}`}
          unit="week"
        />
        <Metric
          label="Service exposure"
          value={number(fixture.fbj.exposure)}
          unit="tins"
          tone="red"
        />
      </div>
      <div className="option-grid" aria-label="Compare recovery options">
        {fixture.fbj.options.map((o) => (
          <button
            key={o.id}
            className={`option-card ${o.id === "split-promo" ? "recommended" : ""}`}
            aria-pressed={option === o.id}
            onClick={() => setOption(o.id)}
          >
            <strong>{o.label}</strong>
            <span className="option-cost">
              {o.cost ? "+" : ""}
              {usd(o.cost)}
            </span>
            <small>USD incremental</small>
            <span className="option-effect">{o.effect}</span>
            {o.id === "split-promo" && (
              <span className="option-recommendation">
                SCALESIGHT-REVIEWED RECOMMENDATION
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="two-col">
        <section className="panel" aria-live="polite">
          <div className="panel-title">
            <h2>{selected.label}</h2>
            <Badge label="COMPARISON SELECTED" tone="yellow" />
          </div>
          <div className="trajectory-pending">
            <div className="safety-line">
              Safety reserve · {number(s.safety)} tins (derived)
            </div>
            <strong>
              Exact inventory trajectory is awaiting receipt inputs.
            </strong>
            <p>
              {number(selected.early)} tins on early freight ·{" "}
              {number(selected.standard)} on standard freight. Receipt dates:
              Not specified.
            </p>
            <p>
              Exact service gap:{" "}
              {selected.shortage === null
                ? "Not specified"
                : `${number(selected.shortage)} tins (supplied narrative)`}
            </p>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-line plan" />
              Inventory trajectory · pending
            </span>
            <span>
              <i className="legend-line actual" />
              Service gap · pending
            </span>
            <span>
              <i className="legend-line forward" />
              Incoming receipt · unconfirmed
            </span>
          </div>
          <div className="metric-grid">
            <Metric
              label="Selected incremental cost"
              value={usd(selected.cost)}
              unit="USD"
            />
            <Metric label="Exact service units protected" value="—" />
          </div>
          <Missing>
            Q3: receipt-before-demand convention and early / full receipt dates.
            Q5: promo reduction and protected-demand baseline. The selected
            comparison updates quantity and cost; exact trajectory is withheld.
          </Missing>
          <p className="small-copy">
            6,200 is service exposure before the delayed receipt. It excludes
            the required safety reserve and is not the safety-inclusive supply
            gap.
          </p>
        </section>
        <AnalystNote>
          <Badge label="SPLIT" tone="blue" />
          <p>
            Bring 4,000 units forward, keep 2,000 on standard freight and
            temporarily remove incremental DTC promotional demand from the
            protected plan.
          </p>
          <div className="recommendation-block">
            <p className="eyebrow">WHY THIS OPTION</p>
            <p>
              The supplied narrative closes the protected-account gap at +$5,600
              vs +$8,400 for a full expedite.
            </p>
            <p>
              <strong>{usd(costDifference())} less incremental cost</strong> ·
              DERIVED from supplied option costs. Exact protected units remain
              unconfirmed.
            </p>
            <p>Cash impact beyond incremental freight: Not specified.</p>
            <p>Remaining exact exposure: Not specified.</p>
          </div>
          <div className="recommendation-block">
            <p className="eyebrow">FISHWIFE DECISION</p>
            <p>
              Approve the recovery option and incremental freight before the
              supplier cut-off.
            </p>
          </div>
          <p className="source-context">
            ScaleSight-reviewed recommendation stays unchanged when another
            comparison is selected.
          </p>
        </AnalystNote>
      </div>
    </>
  );
}
