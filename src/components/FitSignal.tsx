import { ArrowRight } from "lucide-react";
import { exchangeStory } from "../data/naturana";
import {
  pages,
  fitConclusion,
  cherryAnalysis,
  cherryDecision,
} from "../data/naturana.copy";
import {
  getVariant,
  retainedDemand,
  demandIndex,
  exchangeOutRate,
} from "../engine/naturana";
import {
  PageHeading,
  SectionHeading,
  DecisionBadge,
  AnalystNote,
  PlanLink,
} from "./ui";
export function AnalystOverride() {
  const v = getVariant("CH-BRA-L");
  return (
    <section className="judgment-banner">
      <div className="override-heading">
        <div>
          <p className="eyebrow">
            SYSTEM OUTPUT → SCALESIGHT-REVIEWED DECISION
          </p>
          <h2>Human planning judgment changes the decision.</h2>
        </div>
        <span className="subtle-badge">Fit signal review</span>
      </div>
      <div className="override-comparison">
        <div>
          <span>Model-only interpretation</span>
          <strong>Cherry L · 34 units sold</strong>
          <DecisionBadge action={v.modelRecommendation!} />
          <p>Highest gross sales. Possible model recommendation.</p>
        </div>
        <ArrowRight size={22} />
        <div>
          <span>Final ScaleSight recommendation</span>
          <strong>25 retained L · 31 retained M</strong>
          <DecisionBadge action={v.analystRecommendation} />
          <p>6 exchange-outs · 4 moved to M · 4 outright returns</p>
        </div>
      </div>
      <p>
        Gross sell-through is being distorted by size movement. Hold incremental
        L commitment until another planning cycle confirms the retained-demand
        signal.
      </p>
    </section>
  );
}
export function FitSignal() {
  return (
    <>
      <PageHeading {...pages.fit} />
      <div className="fit-grid">
        {["CH-BRA-L", "CH-BRA-M", "CP-BRA-M"].map((id) => {
          const v = getVariant(id);
          return (
            <article className="panel fit-card" key={id}>
              <div className="section-heading">
                <h2>
                  {v.colour} {v.size}
                </h2>
                <DecisionBadge action={v.analystRecommendation} />
              </div>
              <span className="muted">{v.understatementProductName}</span>
              <dl className="data-list">
                {[
                  ["Gross units", v.grossLaunchSales],
                  ["Returns", `− ${v.returns}`],
                  ["Exchange out", `− ${v.exchangeOut}`],
                  ["Exchange in", `+ ${v.exchangeIn}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                <div className="retained-row">
                  <dt>Retained demand</dt>
                  <dd>{retainedDemand(v)}</dd>
                </div>
                <div>
                  <dt>Initial retained-demand expectation</dt>
                  <dd>{v.initialExpectedRetainedDemand}</dd>
                </div>
                <div>
                  <dt>Commercial demand index</dt>
                  <dd>{demandIndex(v)} vs plan</dd>
                </div>
              </dl>
              {id === exchangeStory.from && (
                <p className="fit-warning">
                  {Math.round(exchangeOutRate(v))}% exchange-out rate
                </p>
              )}
              <PlanLink href={`/sku-planning?variant=${id}`}>
                Open variant decision
              </PlanLink>
            </article>
          );
        })}
      </div>
      <section className="exchange-story panel">
        <SectionHeading
          title="The supplied exchange movement"
          description="Illustrative Cherry L → M story"
        />
        <div className="before-after">
          <div>
            <span>Cherry L exchange-outs</span>
            <strong>{exchangeStory.exchangeOut} units</strong>
          </div>
          <ArrowRight size={28} />
          <div>
            <span>Moved L → M</span>
            <strong>
              {exchangeStory.moved} of {exchangeStory.exchangeOut} ·{" "}
              {Math.round(
                (exchangeStory.moved / exchangeStory.exchangeOut) * 100,
              )}
              %
            </strong>
          </div>
        </div>
        <p className="chart-note">
          Destinations for the other two are unspecified. Catalog exchange
          inputs are not a reconciled transaction ledger.
        </p>
      </section>
      <AnalystOverride />
      <AnalystNote title="ScaleSight Analysis">
        <p>{cherryAnalysis}</p>
        <h3>Recommended Decision · INVESTIGATE</h3>
        <p>{cherryDecision}</p>
        <p>
          <strong>Decision required:</strong> Review again after another week of
          retained-demand data.
        </p>
        <p>{fitConclusion}</p>
        <PlanLink href="/sku-planning#sets">
          See the inventory implication
        </PlanLink>
      </AnalystNote>
    </>
  );
}
