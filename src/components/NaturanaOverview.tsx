import { ArrowRight, Layers3, Ruler, Users, Workflow } from "lucide-react";
import {
  pages,
  priorities,
  changes,
  setAnalysis,
  translationAnalysis,
  learningAnalysis,
  earlyAnalysis,
} from "../data/naturana.copy";
import {
  variants,
  confidenceNote,
  setRisks,
  braTranslation,
  bottomTranslation,
  learning,
  tagline,
} from "../data/naturana";
import { immediateActions } from "../engine/naturana";
import {
  PageHeading,
  SectionHeading,
  PlanLink,
  AnalystNote,
  DecisionBadge,
  DataTable,
  Interpretation,
} from "./ui";
import { MetricCard } from "./MetricCard";
export function SetAvailability() {
  return (
    <section id="sets" className="set-section">
      <SectionHeading
        title="Matching-set availability"
        description="Set availability is limited by whichever matching component is expected to constrain first."
      />
      <div className="two-col">
        {setRisks.map((r) => (
          <article className="panel set-card" key={r.id}>
            <div className="section-heading">
              <h3>{r.label}</h3>
              <DecisionBadge action="SET_RISK" />
            </div>
            <div className="cover-pair">
              <div>
                <span>Top cover</span>
                <strong>
                  {r.topCover.toFixed(1)} <small>weeks</small>
                </strong>
              </div>
              <ArrowRight size={20} />
              <div>
                <span>Bottom cover</span>
                <strong>
                  {r.bottomCover.toFixed(1)} <small>weeks</small>
                </strong>
              </div>
            </div>
            <p className="chart-note">Matching brief constrains first</p>
            <PlanLink href={`/sku-planning?variant=${r.bottomId}`}>
              Review matching brief
            </PlanLink>
          </article>
        ))}
      </div>
      <Interpretation>
        {setAnalysis} Set attach rate: 62% — synthetic planning assumption.
      </Interpretation>
    </section>
  );
}
export function WeeklyBrief() {
  return (
    <>
      <PageHeading {...pages.brief} />
      <div className="brief-status">
        <span>
          <strong>Illustrative launch review</strong> · Actuals through 29 Sep
        </span>
        <span>8 products · 3 size systems · 4 matching sets</span>
      </div>
      <div className="metrics five">
        <MetricCard
          label="Variants monitored"
          value={String(variants.length)}
          qualifier="Complete public capsule"
        />
        <MetricCard
          label="Need a planning action"
          value={String(immediateActions)}
          qualifier="6 buy deeper · 11 replenish · 1 investigate"
          accent
        />
        <MetricCard
          label="Matching-set risks"
          value={String(setRisks.length)}
          qualifier="Candy Pink M · Cherry M"
        />
        <MetricCard
          label="Open-to-buy under review"
          value="€50K"
          qualifier="Synthetic planning budget"
        />
        <MetricCard
          label="Size-curve confidence"
          value="Moderate"
          qualifier="Short launch observation window"
        />
      </div>
      <SectionHeading
        title="Four decisions for this planning cycle"
        description="From size signal to next-buy decision."
      />
      <div className="naturana-priorities">
        {priorities.map((p, i) => (
          <article className={`priority-card priority-${i + 1}`} key={p.id}>
            <div className="priority-top">
              <span className="priority-number">PRIORITY 0{i + 1}</span>
              <DecisionBadge action={p.action} />
            </div>
            <h2>{p.title}</h2>
            <dl className="priority-copy">
              {[
                ["What changed", p.change],
                ["Why it matters", p.meaning],
                ["Recommendation", p.recommendation],
                ["Decision required", p.decision],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <PlanLink href={p.href} className="priority-link">
              {p.cta}
            </PlanLink>
          </article>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <SectionHeading title="What changed since last review" />
          <ol className="change-list">
            {changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </section>
        <AnalystNote title="From size signal to next-buy decision">
          <p>{earlyAnalysis}</p>
          <p className="chart-note">{confidenceNote}</p>
          <PlanLink href="/size-translation">
            Explore the planning translation
          </PlanLink>
        </AnalystNote>
      </div>
      <div className="managed-strip">
        <Workflow size={26} />
        <div>
          <strong>{tagline}</strong>
          <p>
            The workspace is the planning environment. ScaleSight maintains the
            analytical layer.
          </p>
        </div>
        <PlanLink href="/managed-intelligence">How the service works</PlanLink>
      </div>
      <section className="panel customisation-preview">
        <h2>Built around how NATURANA actually plans</h2>
        <p>
          Assortment · Size curves · Exchange handling · Set rules · Open-to-buy
          · Scenarios
        </p>
        <PlanLink href="/assumptions#customisation">
          See what could be customised
        </PlanLink>
      </section>
    </>
  );
}
export function LearningTable() {
  return (
    <DataTable
      caption="Initial planning translation vs launch behaviour"
      headers={[
        "Historical cohort",
        "Initial",
        "Early illustrative behaviour",
        "Planning change",
      ]}
      rows={learning.map(([cohort, initial, early, change]) => [
        cohort,
        initial,
        <span key={cohort} className="learning-change">
          <ArrowRight size={14} />
          {early}
        </span>,
        change,
      ])}
    />
  );
}
export function SizeTranslation() {
  return (
    <>
      <PageHeading {...pages.translation} />
      <section className="translation-flow">
        <article className="panel">
          <Layers3 size={23} />
          <p className="eyebrow">TRADITIONAL NATURANA STRUCTURE</p>
          <h2>Band, cup & EU sizes</h2>
          <dl className="data-list">
            <div>
              <dt>Dark Leo</dt>
              <dd>70A → 95D</dd>
            </div>
            <div>
              <dt>Plum</dt>
              <dd>75–85 A–E; 90 A–D</dd>
            </div>
            <div>
              <dt>Bottoms</dt>
              <dd>36 → 48</dd>
            </div>
          </dl>
        </article>
        <article className="panel translation-centre">
          <Ruler size={23} />
          <p className="eyebrow">COMMON FIT / MEASUREMENT LAYER</p>
          <h2>Planning translation</h2>
          <p>Underbust · Bust · Waist / hip</p>
          <p>Fit cohort · Sister-size relationships</p>
          <span className="subtle-badge">Synthetic planning translation</span>
        </article>
        <article className="panel">
          <Users size={23} />
          <p className="eyebrow">ALPHA-SIZED CAPSULE</p>
          <h2>XS → 3XL</h2>
          <dl className="data-list">
            <div>
              <dt>Candy Pink</dt>
              <dd>XS → 3XL</dd>
            </div>
            <div>
              <dt>Cherry</dt>
              <dd>XS → 3XL</dd>
            </div>
          </dl>
        </article>
      </section>
      <Interpretation>
        The common layer is used for planning translation. It is not presented
        as official customer-facing size guidance.
      </Interpretation>
      <section className="panel">
        <SectionHeading
          title="Initial planning translation vs launch behaviour"
          description="Synthetic planning weights, not customer fit recommendations."
        />
        <LearningTable />
      </section>
      <div className="two-col">
        <section className="panel">
          <SectionHeading title="Bra cohorts" />
          <DataTable
            caption="Synthetic bra translation"
            headers={["Historical fit cohort", "Initial alpha allocation"]}
            rows={braTranslation}
          />
        </section>
        <section className="panel">
          <SectionHeading title="Bottom translation" />
          <DataTable
            caption="Synthetic bottom translation"
            headers={["EU size", "Synthetic alpha translation"]}
            rows={bottomTranslation}
          />
        </section>
      </div>
      <AnalystNote>
        <p>{translationAnalysis}</p>
        <PlanLink href="/size-demand">See the updated size curve</PlanLink>
      </AnalystNote>
    </>
  );
}
export function ForecastLearning() {
  return (
    <>
      <PageHeading {...pages.learning} />
      <section className="learning-hero panel">
        <p className="eyebrow">75C–75D · SYNTHETIC PLANNING TRANSLATION</p>
        <div className="before-after">
          <div>
            <span>Initial</span>
            <strong>55% M / 45% L</strong>
          </div>
          <ArrowRight size={28} />
          <div>
            <span>Early</span>
            <strong>66% M / 34% L</strong>
          </div>
        </div>
        <span className="subtle-badge">Increase M weighting</span>
      </section>
      <section className="panel">
        <SectionHeading title="Initial planning translation vs launch behaviour" />
        <LearningTable />
      </section>
      <AnalystNote>
        <p>{learningAnalysis}</p>
        <p>{earlyAnalysis}</p>
        <h3>Confidence: Moderate</h3>
        <p>
          <strong>Why not High?</strong> Short launch window, limited
          observations in tail sizes and continuing exchange behaviour.
        </p>
        <PlanLink href="/next-buy">Review the next-buy allocation</PlanLink>
      </AnalystNote>
    </>
  );
}
