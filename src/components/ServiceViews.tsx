import Image from "next/image";
import { number, usdPerTin } from "../engine/formatters";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  RefreshCw,
} from "lucide-react";
import { fixture, disclaimer } from "../data/fishwife.v1";
import { Badge, DataTable, PageHeading, Reviewed, SectionHeading } from "./ui";
const cycle = [
  [
    "Refresh",
    "Inventory · POs · orders · demand · supplier updates · channel forecasts",
  ],
  [
    "Validate",
    "Missing data · conflicting dates · unusual changes · censored demand",
  ],
  ["Reconcile", "Demand · supply · inventory · capacity · commitments · cash"],
  ["Detect", "What changed enough to matter?"],
  [
    "Compare",
    "Hold · produce · reallocate · expedite · resequence · split · cut",
  ],
  [
    "ScaleSight specialist review",
    "Does the analytical answer make commercial sense?",
  ],
  [
    "Weekly decision brief",
    "What changed · why it matters · what happens if nothing changes · ScaleSight recommendation · decision required",
  ],
  [
    "Fishwife decision",
    "Fishwife reviews, changes or rejects the recommendation and executes through existing systems.",
  ],
  [
    "Monitor outcome",
    "Maintain the analysis and bring material exceptions to the next planning review.",
  ],
];
export function ManagedIntelligence() {
  return (
    <>
      <PageHeading
        eyebrow="MANAGED BY SCALESIGHT"
        title="A decision layer above the systems Fishwife already runs."
        description="Cin7 remains the system of record. Fishwife's existing workflows keep execution moving. ScaleSight maintains the analytical layer around demand, inventory, POs, suppliers and channels - then prepares the few decisions that may need action."
      />
      <div className="architecture">
        <section className="architecture-column">
          <p className="eyebrow">FISHWIFE SYSTEMS & INPUTS</p>
          <Image
            className="cin7-logo"
            src="/logos/cin7logo.png"
            alt="Cin7"
            width={160}
            height={60}
            unoptimized
          />
          <p className="system-record">SYSTEM OF RECORD</p>
          <ul>
            {[
              "Jampack",
              "SPS Commerce",
              "WMS / 3PL",
              "Shopify",
              "Amazon",
              "sales forecasts",
              "supplier updates",
              "promotions / launches",
            ].map((x) => (
              <li key={x}>
                <span>—</span>
                {x}
              </li>
            ))}
          </ul>
          <p className="caption">Operational truth + business context</p>
        </section>
        <section className="architecture-column middle">
          <p className="eyebrow">SCALESIGHT MANAGED ANALYTICAL LAYER</p>
          <Layers3 size={30} strokeWidth={1.2} />
          <ul>
            {[
              "Monitor demand shifts",
              "Reconcile demand vs supply",
              "Detect coverage changes",
              "Track PO exposure",
              "Identify channel conflicts",
              "Stress-test scenarios",
              "Quantify cash/service trade-offs",
              "Specialist review",
              "Prioritise exceptions",
            ].map((x) => (
              <li key={x}>
                <Check size={13} />
                {x}
              </li>
            ))}
          </ul>
          <p className="caption">
            Which changes are meaningful enough to challenge the current plan?
          </p>
        </section>
        <section className="architecture-column">
          <p className="eyebrow">FISHWIFE PLANNING & EXECUTION</p>
          <ClipboardCheck size={30} strokeWidth={1.2} />
          <ul>
            {[
              "Review recommendation",
              "Approve / change / reject",
              "Commit production",
              "Change PO",
              "Reallocate inventory",
              "Execute through existing systems",
            ].map((x) => (
              <li key={x}>
                <ArrowRight size={13} />
                {x}
              </li>
            ))}
          </ul>
          <p className="caption">Fishwife retains the decision.</p>
        </section>
      </div>
      <div className="service-callout">
        <div>
          <h2>Not another system for Fishwife to operate.</h2>
          <p>
            ScaleSight keeps the analytical layer current and brings the
            exceptions, scenarios and recommendations to the team.
          </p>
        </div>
        <RefreshCw size={65} strokeWidth={1} />
      </div>
      <section>
        <SectionHeading
          title="The managed cycle"
          description="A continuously maintained analysis, with specialist review before a decision reaches Fishwife."
        />
        <div className="cycle-grid">
          {cycle.map(([title, copy], i) => (
            <article
              className={`cycle-step ${i === 5 ? "review-step" : ""}`}
              key={title}
            >
              <span>0{i + 1}</span>
              <h3>{title.toUpperCase()}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="ownership">
        <section className="panel">
          <h2>What ScaleSight handles</h2>
          <p>
            ScaleSight maintains the analytical layer, refreshes the planning
            logic, monitors exceptions, reconciles demand and supply changes,
            runs scenarios and prepares decision-ready recommendations.
          </p>
        </section>
        <section className="panel">
          <h2>What Fishwife owns</h2>
          <p>
            Fishwife retains ownership of inventory policy, production
            commitments, supplier relationships, account priorities and every
            final commercial decision.
          </p>
        </section>
      </div>
      <section className="specialist-panel">
        <div className="specialist-mark">
          <CheckCircle2 size={42} strokeWidth={1.2} />
        </div>
        <div>
          <p className="eyebrow">HUMAN REVIEW, EVERY CYCLE</p>
          <h2>Your ScaleSight planning specialist</h2>
          <p>
            A ScaleSight planning specialist reviews the analytical output
            through an operations and supply-planning lens, challenges signals
            that may be temporary or incomplete, incorporates business context
            and prepares the decisions that deserve management attention.
          </p>
          <small>
            Supported by ScaleSight&apos;s data-science models and planning
            logic.
          </small>
        </div>
      </section>
      <div className="service-photo-note">
        <Image
          src="/brand/productimage.webp"
          width={180}
          height={180}
          alt="User-supplied Fishwife tuna variety gift box"
          unoptimized
        />
        <div>
          <span className="eyebrow">EXISTING TEAM. EXISTING SYSTEMS.</span>
          <h2>Prepared around Fishwife&apos;s world.</h2>
          <p>
            Cin7 retains transaction truth. Jampack keeps operational workflows
            moving. Fishwife owns the plan. ScaleSight prepares the few
            decisions that deserve intervention.
          </p>
          <Reviewed />
        </div>
      </div>
      <p className="closing-line">
        ANALYSIS MAINTAINED BY SCALESIGHT. DECISIONS MADE WITH FISHWIFE.
      </p>
    </>
  );
}
export function SopBridge() {
  const steps = [
    "APPROVED PLAN",
    "ACTUAL DEMAND + SUPPLY CHANGES",
    "SCALESIGHT EXCEPTION REVIEW",
    "4 MATERIAL DECISIONS",
    "FISHWIFE DECISION",
    "UPDATED COMMITMENT / NEXT S&OP",
  ];
  return (
    <>
      <PageHeading
        title="Between monthly S&OP cycles, which changes deserve intervention?"
        description="ScaleSight keeps the exceptions current so Fishwife's planning process does not need to reopen every assumption every week."
      />
      <div className="process-flow">
        {steps.map((s, i) => (
          <div className="process-step" key={s}>
            <span>
              0{i + 1} {i < 5 ? "→" : ""}
            </span>
            <strong>{s}</strong>
          </div>
        ))}
      </div>
      <SectionHeading title="The exceptions for this planning cycle">
        <Badge label="4 NEED FISHWIFE DECISION" tone="blue" />
      </SectionHeading>
      <DataTable
        caption="S&OP decision bridge"
        headers={[
          "Decision",
          "Current plan",
          "Change",
          "Proposed response",
          "Decision timing",
        ]}
        rows={[
          [
            "Spanish Lemon",
            "Current Spain run",
            "persistent uplift",
            "reserve additional slot",
            "before supplier cutoff",
          ],
          [
            "Trout",
            "normal allocations",
            "supply constrained",
            "protect priority channels",
            "now",
          ],
          [
            "FBJ Salmon",
            "standard receipt",
            "delayed",
            "split shipment",
            "before freight cutoff",
          ],
          [
            "Basil Pesto",
            "planned sequence",
            "coverage imbalance",
            "resequence capacity",
            "before cannery lock",
          ],
        ]}
      />
      <p className="source-context">
        Synthetic operating inputs / ScaleSight interpretation · Exact cutoff
        dates and prior monthly plan versions are not specified.
      </p>
      <p className="process-bottom">
        ScaleSight does not replace the S&OP process. It prepares the exceptions
        that deserve a decision between planning cycles.
      </p>
      <Reviewed />
    </>
  );
}
const classifications = [
  [
    "PUBLIC INFORMATION",
    "blue",
    "Product names · public prices · public sourcing · retailer assortment where verified · Starter Pack composition · public collaboration events · public system/process information",
  ],
  [
    "SYNTHETIC DEMO INPUT",
    "pink",
    "Inventory · sales · forecast · PO quantities · PO timing · cost · MOQ · safety stock · retailer commitments · channel allocations · supplier performance",
  ],
  [
    "DERIVED",
    "green",
    "Weeks of cover · forecast variance · stockout exposure · bundle capacity · service units protected · cash impact · post-event persistence",
  ],
  [
    "SCALESIGHT INTERPRETATION",
    "yellow",
    "What changed · whether it matters · what should stay unchanged · response alternatives · recommendation · confidence · decision required",
  ],
];
export function Assumptions() {
  return (
    <>
      <PageHeading
        eyebrow="TRANSPARENT BY DESIGN"
        title="What is public, what is illustrative, and what a live Fishwife planning cycle would use."
      />
      <div className="classification-grid">
        {classifications.map(([title, color, copy]) => (
          <section className="classification-card" key={title}>
            <div
              className={`product-band band-${color}`}
              style={{ padding: 0 }}
            />
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
              {title === "SYNTHETIC DEMO INPUT" && (
                <p style={{ marginTop: 12 }}>
                  Fixture v1.1 supplies illustrative histories, channel shares,
                  landed costs, MOQs and recovery rules. These values are not
                  researched Fishwife actuals.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="panel pilot-panel">
        <h2>What a 30-day Fishwife pilot would use</h2>
        <div className="pilot-inputs">
          {[
            "Cin7 export",
            "retailer orders / EDI",
            "Shopify / DTC",
            "Amazon",
            "current demand plan",
            "open POs",
            "supplier readiness",
            "costs",
            "inventory policy",
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <p>
          A pilot can begin with existing exports. This demo does not imply a
          live integration is already deployed.
        </p>
      </section>
      <section className="panel confirmation-panel" id="confirmation">
        <SectionHeading
          title="Approved demo assumptions and remaining source gaps"
          description="User-supplied synthetic fixture v1.1 completes demand modeling, FBJ recovery and Gold Label scenarios."
        />
        <ul>
          <li>
            <strong>Resolved Q3 / Q5 / Q7:</strong> 13-week histories for 12
            SKUs, channel mixes, confidence, costs/MOQs, FBJ receipts and promo
            reduction, and three Gold Label presets with explicit response
            thresholds.
          </li>
          <li>
            <strong>Resolved Q2 / Q4:</strong> Separate allocation/bundle
            snapshots and dated mussel resequencing. Exact discretionary trout
            displacement and bundle release quantities remain unspecified.
          </li>
          <li>
            <strong>Remaining Q6 / Q9 / Q10:</strong> Production/ready/transit
            stages, weekly-copy approval and exact supplier/freight/cannery
            cutoffs.
          </li>
          <li>
            <strong>Model conventions:</strong> Receipts precede demand;
            channels reconcile by assigning rounding residual to the largest
            share. Zero-share channels show no modeled observations. Scenario
            recovery is scheduled no later than the original receipt date, as
            disclosed on the scenario page.
          </li>
        </ul>
        <p className="small-copy">
          The full handoff list is maintained in the repository’s
          OPEN_QUESTIONS.md. Reviewed by ScaleSight describes the illustrative
          demo narrative, not a live cycle or named employee.
        </p>
      </section>
      <section className="panel confirmation-panel">
        <h2>How the numbers are maintained</h2>
        <p className="interpretation-copy">
          One immutable fixture ({fixture.version}) supplies every route. Shared
          selectors retain full precision; rounding is applied only for display.
          IDs are stable illustrative demo IDs, not claims about Fishwife
          internal identifiers.
        </p>
        <DataTable
          caption="Canonical source ledger"
          headers={["Record group", "Classification", "Source / context"]}
          rows={[
            [
              "Product identity / Starter Pack BOM",
              "PUBLIC FACT",
              "Official product / Starter Pack pages",
            ],
            [
              "12 SKU positions / 7 POs",
              "SYNTHETIC DEMO INPUT",
              "§7 / §9 · current-plan",
            ],
            [
              "12 SKU histories / channel shares / economics",
              "SYNTHETIC DEMO INPUT",
              "Approved synthetic supplement v1.1",
            ],
            [
              "Trout reservations",
              "SYNTHETIC DEMO INPUT",
              "§12 · trout-allocation",
            ],
            [
              "Starter Pack free inventory",
              "SYNTHETIC DEMO INPUT",
              "§15 · separate bundle snapshot",
            ],
            [
              "WOC / variance / persistence / cost difference",
              "DERIVED",
              "§16 · shared selectors",
            ],
            [
              "Recommendation / confidence",
              "SCALESIGHT INTERPRETATION",
              "§11–15 · reviewed narratives",
            ],
          ]}
        />
      </section>
      <section className="panel confirmation-panel">
        <SectionHeading
          title="Synthetic landed costs and minimum orders"
          description="Approved illustrative economics; not Fishwife actuals."
        />
        <DataTable
          caption="Synthetic SKU economics"
          headers={["SKU", "Cost / tin · USD", "MOQ · tins"]}
          numeric={[1, 2]}
          rows={fixture.skus.map((s) => [
            s.short,
            usdPerTin(s.unitCost),
            number(s.moq),
          ])}
        />
      </section>
      <section className="panel confirmation-panel">
        <h2>Illustrative Planning Concept</h2>
        <p className="interpretation-copy">{disclaimer}</p>
        <p className="small-copy">
          Brand assets: official product photographs and user-supplied Cin7 /
          ScaleSight logos. Albert Sans is self-hosted. Petrona is an open serif
          fallback for licensed Recoleta. Theme colors are interpretive, not
          official Fishwife hex standards.
        </p>
        <div className="sources-list">
          <a href="https://eatfishwife.com/">Official Fishwife storefront</a>
          <a href="https://eatfishwife.com/products/the-starter-pack">
            Starter Pack composition
          </a>
          <a href="https://www.sweetgreen.com/landing/fishwife">
            Sweetgreen collaboration
          </a>
        </div>
      </section>
    </>
  );
}
