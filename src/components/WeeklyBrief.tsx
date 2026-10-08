"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Eye } from "lucide-react";
import { fixture, planningNote, type Decision } from "../data/fishwife.v1";
import {
  lemonLearning,
  skuById,
  totals,
  skuMetrics,
  bundleSummary,
  costDifference,
  allocationSummary,
} from "../engine/fishwife";
import { compact, decimal, number, percent, usd } from "../engine/formatters";
import {
  AnalystNote,
  Badge,
  PageHeading,
  PlanLink,
  ProductImage,
  Reviewed,
  SectionHeading,
  Stamp,
} from "./ui";
import { DecisionDrawer } from "./DecisionDrawer";
export function WeeklyBrief() {
  const [selected, setSelected] = useState<Decision | null>(null);
  const t = totals();
  const learning = lemonLearning();
  const changes = [
    {
      text: `Spanish Lemon: ${percent(learning.uplift)} persisted above baseline across the latest four supplied weeks.`,
      href: "/demand",
    },
    {
      text: `Current demand totals ${number(t.current)} tins/week, ${percent(t.variance)} against the baseline plan.`,
      href: "/demand",
    },
    {
      text: `Trout: ${number(allocationSummary().gap)} tins of unconstrained demand exceed available supply.`,
      href: "/allocation",
    },
    {
      text: `FBJ Salmon: ${number(fixture.fbj.exposure)} tins exposed under the supplied delayed-receipt narrative.`,
      href: "/po-intervention",
    },
    {
      text: `FBJ split + reduce promo: ${usd(costDifference())} less incremental cost than a full expedite.`,
      href: "/po-intervention",
    },
    {
      text: `Mussels: ${decimal(skuMetrics("MUS-BP").cover)} vs ${decimal(skuMetrics("MUS-SPG").cover)} weeks of cover; resequence ${number(fixture.mussels.moved)} tins.`,
      href: "/supply-commitments",
    },
    {
      text: `Starter Pack: one constrained component limits ${number(fixture.bundle.planned)} planned packs to ${number(bundleSummary().capacity)}.`,
      href: "/bundles",
    },
  ];
  return (
    <>
      <div className="issue-line">
        <span>Week commencing 5 Oct 2026</span>
        <span>THE WEEKLY ISSUE / 08 OCT 2026</span>
      </div>
      <div className="brief-heading">
        <PageHeading
          eyebrow="FISHWIFE × SCALESIGHT"
          title="Weekly Supply Planning Brief"
          description="What changed, what could break the current plan, and which decisions deserve attention this week."
        />
        <div className="brief-meta">
          <Reviewed />
          <span>08 Oct 2026</span>
          <span>Next planning review · 12 Oct</span>
        </div>
      </div>
      <section aria-labelledby="attention-heading">
        <div className="section-heading">
          <h2 id="attention-heading" className="attention-title">
            <span className="attention-number">4</span> decisions need attention
            this week
          </h2>
          <Stamp />
        </div>
        <div className="decision-grid">
          {fixture.decisions.map((d, i) => {
            const s = skuById(d.sku);
            return (
              <article className="decision-card" key={d.sku}>
                <div className={`product-band band-${s.color}`} />
                <div className="decision-card-top">
                  <ProductImage sku={s} />
                  <div>
                    <p className="product-card-id">
                      0{i + 1} / {s.id}
                    </p>
                    <h3>{s.short}</h3>
                  </div>
                </div>
                <div className="decision-card-content">
                  <Badge
                    label={d.label}
                    tone={
                      i === 0
                        ? "blue"
                        : i === 1
                          ? "red"
                          : i === 2
                            ? "red"
                            : "green"
                    }
                  />
                  <dl>
                    <dt>What changed</dt>
                    <dd>{d.changed}</dd>
                    <dt>Why now</dt>
                    <dd>{d.whyNow}</dd>
                    <dt>Decision required</dt>
                    <dd>{d.decision}</dd>
                  </dl>
                </div>
                <button
                  className="card-review"
                  aria-label={`Review decision: ${s.short}`}
                  onClick={() => setSelected(d)}
                >
                  Review decision
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>
      <div className="metric-strip" aria-label="Supporting planning context">
        <div>
          <strong>{t.skus}</strong>
          <span>SKUs monitored</span>
        </div>
        <div>
          <strong>{compact(t.current)}</strong>
          <span>Current weekly demand · tins</span>
        </div>
        <div>
          <strong>{t.supplySituations}</strong>
          <span>Supply situations</span>
        </div>
        <div>
          <strong>{t.constrained}</strong>
          <span>Constrained product</span>
        </div>
        <div>
          <strong className="strip-confidence">
            <Eye size={14} aria-hidden="true" />
            Moderate
          </strong>
          <span>Planning confidence</span>
        </div>
      </div>
      <div className="brief-bottom">
        <section>
          <SectionHeading title="What changed since the last planning review" />
          <ol className="change-list">
            {changes.map((c, i) => (
              <li key={c.text}>
                <span>0{i + 1}</span>
                <p>{c.text}</p>
                <Link href={c.href} aria-label={`Explore: ${c.text}`}>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            ))}
          </ol>
          <p className="draft-label">
            Fixture-supported observations · Draft copy for Arman’s approval.
            Previous-review snapshot not supplied.
          </p>
        </section>
        <AnalystNote title="ScaleSight Planning Note">
          <p>{planningNote}</p>
          <div className="note-signature">
            <span>Monitoring next cycle</span>
            <span>Mon 12 Oct</span>
          </div>
          <div style={{ marginTop: 18 }}>
            <PlanLink href="/managed-intelligence">
              The team behind the analysis
            </PlanLink>
          </div>
        </AnalystNote>
      </div>
      {selected && (
        <DecisionDrawer decision={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
