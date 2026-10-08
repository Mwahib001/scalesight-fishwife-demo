"use client";
import { useState } from "react";
import { fixture } from "../data/fishwife.v1";
import { allocationSummary, bundleSummary, skuById } from "../engine/fishwife";
import { number } from "../engine/formatters";
import {
  AnalystNote,
  Badge,
  Metric,
  Missing,
  PageHeading,
  ProductImage,
  Reviewed,
  SectionHeading,
} from "./ui";
const allocationColors = [
  "#263fc1",
  "#3f654b",
  "#af3529",
  "#655016",
  "#66665a",
];
export function AllocationView() {
  const [include, setInclude] = useState(false);
  const s = allocationSummary(include);
  const trout = skuById("TRT-ORIG");
  return (
    <>
      <PageHeading
        eyebrow="CONSTRAINED SUPPLY"
        title="When supply cannot cover every channel, what should we protect?"
      />
      <div className="allocation-hero">
        <div>
          <h2>Smoked Rainbow Trout</h2>
          <p className="small-copy">
            <span className="public-tag">PUBLIC CONTEXT</span>Current public
            Fishwife messaging indicates responsible-sourcing availability is
            constrained and expected back in stock in early 2027. Network
            inventory and allocations below are illustrative.
          </p>
        </div>
        <ProductImage sku={trout} large />
      </div>
      <div className="metrics">
        <Metric
          label="Available illustrative inventory"
          value={number(s.available)}
          unit="tins"
        />
        <Metric
          label="4-week unconstrained demand"
          value={number(fixture.allocation.demand)}
          unit="tins"
        />
        <Metric
          label="Unmet demand gap"
          value={number(s.gap)}
          unit="tins"
          tone="red"
        />
      </div>
      <div className="two-col">
        <section className="panel">
          <SectionHeading
            title="Every remaining tin has a job."
            description="Protected allocations · one conserved 4,200-tin pool"
          />
          <div
            className="allocation-bar"
            aria-label="Allocation totals 4,200 tins"
          >
            {fixture.allocation.requirements.map((r, i) => (
              <span
                key={r.name}
                style={{ flex: r.units, background: allocationColors[i] }}
              >
                {number(r.units)}
              </span>
            ))}
          </div>
          <div className="allocation-legend">
            {fixture.allocation.requirements.map((r, i) => (
              <div key={r.name}>
                <span>
                  <i
                    className="swatch"
                    style={{ background: allocationColors[i] }}
                  />
                  {r.name}
                </span>
                <strong>{number(r.units)}</strong>
              </div>
            ))}
          </div>
          <div className="toggle-row">
            <div>
              <strong id="allocation-toggle">
                Include discretionary bundle allocation
              </strong>
              <p>Adding bundle demand competes with protected commitments.</p>
            </div>
            <button
              className="switch"
              role="switch"
              aria-labelledby="allocation-toggle"
              aria-checked={include}
              onClick={() => setInclude(!include)}
            />
          </div>
          {include && (
            <div className="tradeoff" role="status">
              <strong>No unallocated tins remain.</strong>
              <p>
                Costco, Target, Kroger / wholesale, subscriptions and the
                service buffer already reserve all 4,200 tins. Any discretionary
                bundle allocation makes at least part of this protected pool
                impossible to fulfill.
              </p>
              <Missing>
                Which account loses inventory, and how much, requires the
                discretionary quantity and displacement priority (Q5). The bar
                retains the reviewed allocation.
              </Missing>
            </div>
          )}
          <p className="source-context">
            Allocation context only · The Starter Pack’s separate 400-free-tin
            snapshot is not subtracted from this pool.
          </p>
        </section>
        <AnalystNote>
          <Badge label="REALLOCATE" tone="blue" />
          <p>
            Protect committed accounts and subscriptions first. Remove
            discretionary trout demand from bundle assembly until reliable
            replenishment timing returns.
          </p>
          <p>
            <strong>
              2,600 tins cannot be bought, so the decision is who to protect.
            </strong>
          </p>
          <p>
            Demand-learning confidence: <strong>LOW</strong>. Constrained
            availability can censor true demand.
          </p>
          <div className="recommendation-block">
            <p className="eyebrow">FISHWIFE DECISION</p>
            <p>
              Confirm protected account priorities and suspend discretionary
              demand while reliable supply timing remains unconfirmed.
            </p>
          </div>
        </AnalystNote>
      </div>
    </>
  );
}
export function BundlesView() {
  const [protect, setProtect] = useState(true);
  const b = bundleSummary(protect);
  return (
    <>
      <PageHeading title="The bundle is only as available as its tightest tin." />
      <div className="section-heading">
        <h2>Starter Pack</h2>
        <span className="small-copy">PUBLIC BOM · ONE TIN OF EACH PRODUCT</span>
      </div>
      <div className="bundle-grid">
        {fixture.bundle.components.map((c) => {
          const s = skuById(c.sku);
          return (
            <article
              className={`component-tile ${c.sku === "TRT-ORIG" ? "constrained" : ""}`}
              key={c.sku}
            >
              <ProductImage sku={s} />
              <h3>{s.short}</h3>
              <strong className="component-units">{number(c.free)}</strong>
              <span>Free illustrative tins</span>
              <div className="component-detail">
                Protected elsewhere: —<br />
                Available to assembly: {number(c.free)}
                <br />
                BOM: 1 tin / pack
              </div>
              {c.sku === "TRT-ORIG" && (
                <p className="constraint-label">CONSTRAINED COMPONENT</p>
              )}
            </article>
          );
        })}
      </div>
      <div className="bundle-capacity">
        <div className="metrics">
          <Metric
            label="Starter Pack capacity"
            value={protect ? number(b.capacity) : "Above 400*"}
            unit="packs"
          />
          <Metric
            label="Planned assembly"
            value={number(fixture.bundle.planned)}
            unit="packs"
          />
          <Metric
            label="Assembly gap"
            value={number(b.gap)}
            unit="packs"
            tone="red"
          />
        </div>
        <p>Constrained by Smoked Rainbow Trout</p>
      </div>
      <div className="two-col">
        <section className="panel">
          <SectionHeading title="The capacity / service trade-off" />
          <div
            className="toggle-row"
            style={{ marginTop: 0, borderTop: 0, paddingTop: 5 }}
          >
            <div>
              <strong id="bundle-toggle">
                Protect constrained-account inventory
              </strong>
              <p>
                Preserve standalone and channel commitments before bundle
                assembly.
              </p>
            </div>
            <button
              className="switch"
              role="switch"
              aria-labelledby="bundle-toggle"
              aria-checked={protect}
              onClick={() => setProtect(!protect)}
            />
          </div>
          <div aria-live="polite">
            <Badge
              label={
                protect ? "PROTECTED COMMITMENTS" : "PROTECTED SERVICE AT RISK"
              }
              tone={protect ? "green" : "red"}
            />
            <p className="interpretation-copy">{b.protectedService}.</p>
            {!protect && (
              <Missing>
                *Capacity rises only by releasing protected trout. The
                releasable quantity and protected-service loss are not supplied;
                an exact higher capacity is withheld (Q2 / Q5).
              </Missing>
            )}
          </div>
          <p className="source-context">
            Separate Starter Pack snapshot: seven free-inventory values are
            supplied after protected commitments. Protected quantities
            themselves are not supplied. Allocation reservations are not
            subtracted again.
          </p>
          <Reviewed />
        </section>
        <AnalystNote>
          <Badge label="PROTECT COMPONENT" tone="blue" />
          <p>
            Preserve trout for protected standalone/channel commitments and
            reduce Starter Pack availability rather than allow bundle assembly
            to consume constrained supply.
          </p>
          <p>One constrained tin caps 1,200 planned packs at 400.</p>
          <div className="recommendation-block">
            <p className="eyebrow">FISHWIFE DECISION</p>
            <p>
              Protect standalone/channel service or release constrained
              component inventory into Starter Pack assembly.
            </p>
          </div>
        </AnalystNote>
      </div>
    </>
  );
}
