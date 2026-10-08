"use client";
import { useState } from "react";
import { fixture } from "../data/fishwife.v1";
import { costDifference, skuMetrics, fbjComparison } from "../engine/fishwife";
import { number, usd, date, usdPerTin } from "../engine/formatters";
import { AnalystNote, Badge, Metric, PageHeading } from "./ui";
import { InventoryChart } from "./InventoryChart";
export function POIntervention() {
  const [option, setOption] = useState("split-promo");
  const selected = fixture.fbj.options.find((o) => o.id === option)!;
  const comparison = fbjComparison(option);
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
          <InventoryChart
            rows={comparison.rows}
            opening={s.sku.onHand}
            safety={comparison.safety}
            title="FBJ recovery inventory trajectory"
          />
          <div className="metric-grid">
            <Metric
              label="Service exposure"
              value={number(comparison.exposure)}
              unit="tins"
            />
            <Metric
              label="Service units protected"
              value={number(comparison.protected)}
              unit="vs accept delay"
            />
            <Metric
              label="Selected incremental cost"
              value={usd(comparison.cost)}
              unit="USD"
            />
            <Metric
              label="Inventory before 12 Nov receipt"
              value={number(comparison.remaining)}
              unit="tins"
            />
          </div>
          <p className="source-context">
            {number(selected.early)} tins on early freight ·{" "}
            {number(selected.standard)} on standard freight.{" "}
            {selected.early > 0 &&
              `Early receipt: ${date(fixture.fbj.earlyDate)}.`}{" "}
            {selected.standard > 0 &&
              `Standard receipt: ${date(fixture.fbj.delayedDate)}.`}
          </p>
          <p className="small-copy">
            {number(comparison.promoRemoved)} promotional tins removed. Exposure
            is unmet demand over W1–W5, before the delayed 12 Nov receipt; it
            excludes the safety reserve. Receipts are available before that
            period’s demand.
          </p>
          <p className="source-context">
            Approved synthetic fixture v1.1 · Exact demo calculations, not
            Fishwife actuals.
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
              DERIVED from supplied option costs. 6,200 service units protected
              versus accepting the delay.
            </p>
            <p>
              Existing PO value: {usd(s.sku.incoming * s.sku.unitCost!)} at{" "}
              {usdPerTin(s.sku.unitCost!)} per tin. This committed purchase is
              not incremental recovery spend.
            </p>
            <p>
              Recommended split + reduce promo: 0 tins exposed; 200 tins remain
              before the final receipt.
            </p>
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
