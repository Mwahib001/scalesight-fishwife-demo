"use client";
import { useState } from "react";
import { CheckCheck, Mail, Users, Workflow } from "lucide-react";
import { pages, workflow, customizationCopy } from "../data/naturana.copy";
import {
  tagline,
  products,
  sizeSystemLabels,
  baseInputs,
} from "../data/naturana";
import { money } from "../engine/formatters";
import {
  PageHeading,
  SectionHeading,
  AnalystNote,
  PlanLink,
  DataTable,
  Interpretation,
} from "./ui";
import { AnalystOverride } from "./FitSignal";
import { BookCallButton } from "./BookCallButton";
export function CommercialEndpoint() {
  return (
    <section className="pilot-panel" id="pilot">
      <p className="eyebrow">FROM CONCEPT TO LIVE PLANNING</p>
      <h2>Build the planning layer around NATURANA’s actual business.</h2>
      <p>
        This example uses public product structure and illustrative operating
        assumptions. A live ScaleSight engagement would connect the same
        planning logic to NATURANA’s actual sales, inventory, returns, purchase
        orders, supplier timing and commercial context - then our team would
        maintain the analysis and work with your team on the recurring decisions
        that matter.
      </p>
      <div className="endpoint-actions">
        <a
          className="button secondary"
          href="mailto:arman@scalesight.org?subject=NATURANA%20Planning%20Pilot"
        >
          <Mail size={16} aria-hidden="true" /> Email us
        </a>
        <BookCallButton />
        <PlanLink href="/assumptions#customisation">
          See what could be customised
        </PlanLink>
      </div>
    </section>
  );
}
export function ManagedIntelligence() {
  const [active, setActive] = useState(0);
  return (
    <>
      <PageHeading {...pages.managed} />
      <section className="service-hero">
        <div>
          <p className="eyebrow">WORKSPACE + SCALESIGHT PLANNING SPECIALIST</p>
          <h2>{tagline}</h2>
          <p>
            Your team does not need to monitor another dashboard every day.
            ScaleSight keeps the planning layer current and brings forward the
            decisions that warrant attention.
          </p>
        </div>
        <div className="service-equation">
          <span>
            <Workflow size={22} />
            Planning environment
          </span>
          <b>+</b>
          <span>
            <Users size={22} />
            Specialist review
          </span>
          <b>=</b>
          <span>
            <CheckCheck size={22} />
            Management-ready decisions
          </span>
        </div>
      </section>
      <div className="service-status">
        {[
          ["Data refreshed", "30 Sep · 06:00 CEST"],
          ["Variants monitored", "85"],
          ["Material changes reviewed", "7"],
          ["Priority decisions prepared", "4"],
          ["Set risks under review", "2"],
          ["Next planning review", "5 Oct"],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <p className="chart-note">
        Illustrative operating cycle · No live systems are connected.
      </p>
      <section className="panel managed-workflow">
        <SectionHeading
          title="A maintained planning layer. A recurring decision cycle."
          description="Select a step to see what happens through the planning cycle."
        />
        <div
          className="workflow-grid"
          role="tablist"
          aria-label="Managed planning workflow"
          onKeyDown={(e) => {
            if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 9
                    : (active + (e.key === "ArrowRight" ? 1 : 9)) % 10;
              setActive(next);
              document.getElementById(`workflow-${next}`)?.focus();
            }
          }}
        >
          {workflow.map(([name], i) => (
            <button
              role="tab"
              id={`workflow-${i}`}
              key={name}
              aria-selected={active === i}
              aria-controls="workflow-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{name}</strong>
            </button>
          ))}
        </div>
        <div
          className="workflow-detail"
          role="tabpanel"
          id="workflow-panel"
          aria-labelledby={`workflow-${active}`}
        >
          <div>
            <p className="eyebrow">
              {active === 7 || active === 8 ? "NATURANA" : "SCALESIGHT"} ·
              PLANNING CYCLE
            </p>
            <h2>{workflow[active][0]}</h2>
            {workflow[active][1] && <p>{workflow[active][1]}</p>}
          </div>
          <CheckCheck size={28} />
        </div>
      </section>
      <div className="two-col">
        <article className="panel ownership-card">
          <p className="eyebrow">THE ANALYTICAL TEAM</p>
          <h2>ScaleSight handles</h2>
          <p>
            Maintaining the analytical layer, refreshing planning assumptions,
            monitoring exceptions, running scenarios and interpreting the
            resulting operational trade-offs.
          </p>
        </article>
        <article className="panel ownership-card">
          <p className="eyebrow">THE BUSINESS DECISION</p>
          <h2>NATURANA decides</h2>
          <p>
            Purchasing commitments, supplier decisions, assortment changes and
            the final commercial trade-offs.
          </p>
        </article>
      </div>
      <AnalystNote title="Your ScaleSight Planning Specialist">
        <p>
          A dedicated ScaleSight planning specialist reviews the workspace
          through a merchandise and supply-chain planning lens. The specialist
          challenges unusual signals, incorporates business context and turns
          the analytical output into management-ready recommendations.
        </p>
        <p>Supported by ScaleSight’s data-science models and planning logic.</p>
      </AnalystNote>
      <AnalystOverride />
      <CommercialEndpoint />
    </>
  );
}
const classifications = [
  [
    "Public information",
    "Product names · Colour · Public prices · Sizes · Variants · SKUs · Barcodes · Collaboration structure · Public sizing guidance",
  ],
  [
    "Synthetic assumptions",
    "Inventory · Sell-through · Returns · Exchanges · Costs · Lead times · Forecasts · Open-to-buy · Purchase orders · Recommendations",
  ],
  [
    "Derived planning metrics",
    "Weeks cover · Retained demand · Fit-adjusted size mix · Set availability · Projected inventory · Reorder gap · Scenario outputs",
  ],
  [
    "Analyst interpretation",
    "Why a change matters · Whether evidence is strong enough · What decision is recommended · Which assumption still needs validation",
  ],
];
export function Assumptions() {
  return (
    <>
      <PageHeading {...pages.assumptions} />
      <div className="classification-grid">
        {classifications.map(([title, body], i) => (
          <article className="panel" key={title}>
            <span className="source-type">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <Interpretation>
        The common size curves, two set-risk states and scenario summaries are
        supplied canonical illustrations. They are not recalculated from catalog
        totals. Dated projected inventory and reorder gaps are not shown because
        receipt dates are unavailable.
      </Interpretation>
      <section className="panel">
        <SectionHeading
          title="Public product structure"
          description="8 products · 85 public variants · 4 matching sets. Prices shown are NATURANA storefront prices."
        />
        <DataTable
          caption="Public NATURANA product catalog"
          headers={[
            "NATURANA public name",
            "Understatement public name",
            "Colour",
            "Size system",
            "NATURANA price",
          ]}
          rows={products.map((p) => [
            p.naturanaProductName,
            p.understatementProductName,
            p.colour,
            sizeSystemLabels[p.sizeSystem],
            money(p.publicPriceEUR, 2),
          ])}
        />
        <p className="chart-note">
          Dark Leo top is treated as a padded wireless triangle bra. Public
          identifiers use the supplied Understatement SKU and shared barcode.
          NATURANA SKU is recorded only where directly observed.
        </p>
      </section>
      <section className="panel">
        <SectionHeading
          title="Product-level planning assumptions"
          description="Synthetic demo inputs"
        />
        <DataTable
          caption="Synthetic product assumptions"
          headers={[
            "Product",
            "Unit cost",
            "Lead time",
            "Safety stock",
            "Target cover",
          ]}
          rows={products.map((p) => [
            p.naturanaProductName,
            money(p.syntheticUnitCostEUR),
            `${p.leadTimeWeeks} weeks`,
            `${p.safetyStockWeeks.toFixed(1)} weeks`,
            `${p.targetCoverWeeks} weeks`,
          ])}
        />
      </section>
      <div className="two-col">
        <section className="panel">
          <SectionHeading title="Canonical planning cycle" />
          <dl className="data-list">
            {[
              ["Capsule launch", "18 September 2026"],
              ["Planning week", "28 September 2026"],
              ["Actuals through", "29 September 2026"],
              ["Data refresh", "30 September 2026 · 06:00 CEST"],
              ["Observation window", "18–29 September"],
              ["Default horizon", "8 weeks; alternatives 4 / 13"],
              ["Next planning review", "Monday · 5 October 2026"],
              ["Currency", "EUR"],
            ].map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="panel">
          <SectionHeading title="Planning rules in this concept" />
          <dl className="data-list">
            <div>
              <dt>Retained demand</dt>
              <dd>Gross − returns − exchange out + exchange in</dd>
            </div>
            <div>
              <dt>V1 fit-adjusted demand</dt>
              <dd>Retained demand</dd>
            </div>
            <div>
              <dt>Current weeks cover</dt>
              <dd>On hand ÷ forward weekly demand</dd>
            </div>
            <div>
              <dt>Commercial demand index</dt>
              <dd>Retained ÷ supplied expectation × 100</dd>
            </div>
            <div>
              <dt>Open-to-buy</dt>
              <dd>{money(baseInputs.openToBuyBudgetEUR)}</dd>
            </div>
            <div>
              <dt>Set attach rate</dt>
              <dd>62% · synthetic assumption</dd>
            </div>
          </dl>
          <p className="chart-note">
            Final actions are preserved from the supplied operating table.
            Evidence needed to independently infer all actions is not provided.
          </p>
        </section>
      </div>
      <section className="panel" id="customisation">
        <p className="eyebrow">CONFIGURED FOR NATURANA</p>
        <h2>Built around how NATURANA actually plans</h2>
        <p className="customisation-intro">{customizationCopy}</p>
        <div className="customisation-grid">
          {[
            [
              "Your assortment",
              "Products · Collections · Markets · Size systems",
            ],
            [
              "Your operating model",
              "Suppliers · Lead times · MOQs · Warehouses · Channels",
            ],
            [
              "Your decision rules",
              "Safety stock · Buying thresholds · Replenishment rules · Markdown rules · Set logic",
            ],
            [
              "Your planning cadence",
              "Weekly · Monthly · Seasonal · Launch-specific · Management reporting",
            ],
          ].map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <h3>How this concept is set up for NATURANA</h3>
        <DataTable
          caption="NATURANA workspace configuration"
          headers={["Planning area", "Current concept", "Live configuration"]}
          rows={[
            [
              "Assortment",
              "8 capsule products / 85 variants",
              "Product hierarchy, collections, markets",
            ],
            [
              "Size curves",
              "3 canonical illustrative alpha curves",
              "Business-specific size systems and learning",
            ],
            [
              "Exchange handling",
              "Supplied inputs; Cherry L → M spotlight",
              "Validated returns and exchanges",
            ],
            [
              "Set rules",
              "4 public pairings; 2 canonical risks",
              "Attach-rate and threshold rules to confirm",
            ],
            [
              "OTB",
              "€50,000 illustrative budget",
              "Buying calendars, budgets and decision rules",
            ],
            [
              "Scenarios",
              "4 supplied presets",
              "Additional calculation rules to confirm",
            ],
            [
              "Systems",
              "No live connection",
              "Sales, stock, returns and purchase-order sources to be confirmed",
            ],
          ]}
        />
        <p className="customisation-statement">
          ScaleSight should adapt to the planning problem. The business should
          not have to adapt itself to a fixed software workflow.
        </p>
      </section>
      <CommercialEndpoint />
    </>
  );
}
