"use client";
import { useState } from "react";
import { fixture, type PO } from "../data/fishwife.v1";
import { skuById, skuMetrics, totals } from "../engine/fishwife";
import { date, decimal, number, usd } from "../engine/formatters";
import {
  AnalystNote,
  Badge,
  DataTable,
  Missing,
  PageHeading,
  PlanLink,
  Reviewed,
  SectionHeading,
} from "./ui";
import { DecisionDrawer } from "./DecisionDrawer";
export function SupplyView() {
  const [selected, setSelected] = useState<PO | null>(null);
  return (
    <>
      <PageHeading
        title="What is already committed - and what is beginning to move?"
        description="Connect demand changes to production slots, open POs and expected arrival timing."
      />
      <div className="two-col">
        <section className="panel">
          <div className="panel-title">
            <h2>Committed supply</h2>
            <span>7 SYNTHETIC PURCHASE ORDERS</span>
          </div>
          <div className="timeline-wrap">
            <div className="timeline">
              {[
                "Product",
                "Production",
                "Ready",
                "Transit",
                "Expected receipt",
                "Status",
              ].map((h) => (
                <div className="timeline-head" key={h}>
                  {h}
                </div>
              ))}
              {fixture.pos.flatMap((p) => [
                <div key={p.id + "name"}>
                  <button
                    className="timeline-row-button"
                    onClick={() => setSelected(p)}
                  >
                    {skuById(p.sku).short}
                  </button>
                </div>,
                ...["production", "ready", "transit"].map((stage) => (
                  <div className="stage-unspecified" key={p.id + stage}>
                    Not specified
                  </div>
                )),
                <div key={p.id + "eta"}>
                  <span>Original: {date(p.originalArrival)}</span>
                </div>,
                <div key={p.id + "status"}>
                  <Badge
                    label={p.status}
                    tone={
                      p.status === "CONFIRMED"
                        ? "green"
                        : p.status === "RESEQUENCE CANDIDATE"
                          ? "yellow"
                          : "red"
                    }
                  />
                </div>,
              ])}
            </div>
          </div>
          <p className="chart-summary">
            Production → Ready → Transit → Expected receipt. Supplied dates are
            original date-only arrival records. Stage timing, updated receipt
            dates and exact projected position remain unconfirmed.
          </p>
        </section>
        <AnalystNote
          title={`ScaleSight sees ${totals().supplySituations} commitments worth reviewing`}
        >
          <p>
            Spanish Lemon demand, FBJ receipt exposure and Basil Pesto capacity
            timing deserve selective review.
          </p>
          <div className="recommendation-block">
            <p>
              <strong>Mussel capacity trade-off</strong>
            </p>
            <p>
              Basil Pesto {decimal(skuMetrics("MUS-BP").cover)} weeks of cover
              vs Sweet Pepper {decimal(skuMetrics("MUS-SPG").cover)}.
            </p>
            <p>
              Resequence {number(fixture.mussels.moved)} tins by{" "}
              {fixture.mussels.advanceWeeks} weeks for{" "}
              {usd(fixture.mussels.cost)} USD incremental. Total packing
              capacity stays unchanged.
            </p>
            <p>Cost of adding capacity: Not specified.</p>
          </div>
          <PlanLink href="/po-intervention">
            Compare FBJ recovery options
          </PlanLink>
        </AnalystNote>
      </div>
      <section style={{ marginTop: 28 }}>
        <SectionHeading
          title="The commitments behind the decisions"
          description="Read-only records. Click a row or product to review the decision context."
        />
        <DataTable
          headers={[
            "SKU / Product",
            "PO",
            "Quantity · tins",
            "On hand · tins",
            "Demand / week",
            "Expected arrival",
            "Projected position at receipt",
            "Status",
            "ScaleSight action",
          ]}
          numeric={[2, 3, 4, 6]}
          caption="Canonical purchase orders"
          onRowSelect={(index) => setSelected(fixture.pos[index])}
          rows={fixture.pos.map((p) => {
            const s = skuById(p.sku);
            const d = fixture.decisions.find((d) => d.sku === s.id);
            return [
              <button
                className="table-action"
                key={p.id}
                onClick={() => setSelected(p)}
              >
                {s.id}
                <br />
                {s.short}
              </button>,
              p.id,
              number(p.quantity),
              number(s.onHand),
              number(s.current),
              <span key="date">
                Original {date(p.originalArrival)}
                <br />
                <span className="small-copy">Updated: Not specified</span>
              </span>,
              "Not specified",
              <Badge
                key="status"
                label={p.status}
                tone={
                  p.status === "CONFIRMED"
                    ? "green"
                    : p.status === "RESEQUENCE CANDIDATE"
                      ? "yellow"
                      : "red"
                }
              />,
              d?.label ?? s.label,
            ];
          })}
        />
        <Missing>
          Exact projected position and mussel resequence dates need Q3 / Q4 / Q6
          confirmation. A date-only ETA is kept separate from the SKU’s
          elapsed-week incoming assumption.
        </Missing>
      </section>
      <section className="panel" style={{ marginTop: 24 }}>
        <SectionHeading title="Aggregate incoming without a supplied PO" />
        <DataTable
          caption="Aggregate incoming records"
          headers={[
            "SKU",
            "Incoming · tins",
            "Elapsed-week assumption",
            "PO detail",
          ]}
          numeric={[1, 2]}
          rows={fixture.skus
            .filter(
              (s) => !fixture.pos.some((p) => p.sku === s.id) && s.incoming > 0,
            )
            .map((s) => [
              s.short,
              number(s.incoming),
              `${s.etaWeeks} weeks`,
              "Not specified in demo source.",
            ])}
        />
        <p className="source-context">
          Aggregate source inputs are preserved. No new PO IDs or supplier
          records are created.
        </p>
        <Reviewed />
      </section>
      {selected && (
        <DecisionDrawer po={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
