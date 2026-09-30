"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  variants,
  products,
  actionLabels,
  sizeSystemLabels,
  confidenceNote,
} from "../data/naturana";
import {
  pages,
  priorities,
  cherryAnalysis,
  cherryDecision,
  fitConclusion,
  setAnalysis,
} from "../data/naturana.copy";
import type { Variant } from "../data/naturana.types";
import {
  counts,
  immediateActions,
  retainedDemand,
  displayedCover,
  demandIndex,
  setRiskFor,
  sortByUrgency,
} from "../engine/naturana";
import { money } from "../engine/formatters";
import { PageHeading, SectionHeading, DecisionBadge, PlanLink } from "./ui";
import { SetAvailability } from "./NaturanaOverview";
import { AnalystOverride } from "./FitSignal";
function VariantDecisionDrawer({
  variant: v,
  onClose,
}: {
  variant: Variant;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  const risk = setRiskFor(v);
  const spotlight = priorities.find((p) => p.id === v.demoVariantId);
  const hasAnalysis = !!spotlight || v.demoVariantId === "CH-BRA-M" || !!risk;
  const matching = products.find(
    (p) => p.matchingSetId === v.matchingSetId && p.productId !== v.productId,
  )!;
  return (
    <dialog
      ref={ref}
      className="variant-drawer"
      aria-labelledby="variant-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="drawer-content">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">VARIANT DECISION</p>
            <h2 id="variant-title">
              {v.colour} · {v.size}
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close variant decision"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <p>{v.naturanaProductName}</p>
        <div className="drawer-status">
          <DecisionBadge action={v.analystRecommendation} />
          <span>
            NATURANA storefront price{" "}
            <strong data-testid="storefront-price">
              {money(v.publicPriceEUR, 2)}
            </strong>
          </span>
        </div>
        <dl className="identifiers">
          <div>
            <dt>Public SKU</dt>
            <dd>{v.publicSku}</dd>
          </div>
          <div>
            <dt>Barcode</dt>
            <dd>{v.barcode}</dd>
          </div>
          <div>
            <dt>NATURANA public SKU</dt>
            <dd>
              {v.naturanaPublicSku ??
                "Not publicly recorded in canonical source"}
            </dd>
          </div>
        </dl>
        <section>
          <SectionHeading title="Current position" />
          <dl className="drawer-metrics">
            {[
              ["On hand", v.onHand],
              ["Incoming", v.incoming],
              ["Forward demand", `${v.forecastWeeklyUnits} / week`],
              ["Weeks cover", displayedCover(v)],
              ["Lead time", `${v.leadTimeWeeks} weeks`],
              ["Target cover", `${v.targetCoverWeeks} weeks`],
            ].map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
          <p className="chart-note">
            Current cover excludes incoming units. Receipt dates are not
            supplied.
          </p>
        </section>
        <section>
          <SectionHeading
            title="Launch signal"
            description="Illustrative 18–29 Sep gross units"
          />
          <dl className="drawer-metrics">
            {[
              ["Gross sales", v.grossLaunchSales],
              ["Returns", v.returns],
              ["Exchange out", v.exchangeOut],
              ["Exchange in", v.exchangeIn],
              ["Retained demand", retainedDemand(v)],
            ].map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <SectionHeading title="Planning context" />
          <dl className="data-list">
            {v.initialExpectedRetainedDemand !== undefined && (
              <>
                <div>
                  <dt>Initial retained-demand expectation</dt>
                  <dd>{v.initialExpectedRetainedDemand}</dd>
                </div>
                <div>
                  <dt>Commercial demand index</dt>
                  <dd>{demandIndex(v)} vs plan</dd>
                </div>
              </>
            )}
            <div>
              <dt>Matching product</dt>
              <dd>{matching.naturanaProductName}</dd>
            </div>
            <div>
              <dt>Set availability</dt>
              <dd>
                {risk ? (
                  <DecisionBadge action="SET_RISK" />
                ) : (
                  "No canonical set risk"
                )}
              </dd>
            </div>
            {v.confidence && (
              <div>
                <dt>Confidence</dt>
                <dd>{v.confidence}</dd>
              </div>
            )}
          </dl>
          {v.sizeSystem === "ALPHA" && (
            <p className="chart-note">
              Common size-curve confidence: Moderate. {confidenceNote}
            </p>
          )}
          {risk && <p>{setAnalysis}</p>}
          {v.matchingVariantId && (
            <PlanLink href={`/sku-planning?variant=${v.matchingVariantId}`}>
              Open matching variant
            </PlanLink>
          )}
        </section>
        {hasAnalysis && (
          <section className="drawer-analysis">
            <p className="eyebrow">REVIEWED BY SCALESIGHT</p>
            <SectionHeading title="ScaleSight Analysis" />
            <p>
              {v.demoVariantId === "CH-BRA-L"
                ? cherryAnalysis
                : spotlight
                  ? spotlight.change
                  : v.demoVariantId === "CH-BRA-M"
                    ? fitConclusion
                    : setAnalysis}
            </p>
            <h3>Recommended Decision</h3>
            <p>
              {v.demoVariantId === "CH-BRA-L"
                ? cherryDecision
                : spotlight
                  ? spotlight.recommendation
                  : v.demoVariantId === "CH-BRA-M"
                    ? "BUY DEEPER"
                    : setAnalysis}
            </p>
            {spotlight && (
              <p>
                <strong>Decision required:</strong>{" "}
                {v.demoVariantId === "CH-BRA-L"
                  ? "Review again after another week of retained-demand data."
                  : spotlight.decision}
              </p>
            )}
          </section>
        )}
        {v.overrideType && <AnalystOverride />}
        <section>
          <SectionHeading title="Assumptions" />
          <p>
            Sales, stock, exchanges, forecasts, costs and final actions are
            synthetic demonstration inputs. Public SKU and barcode are the
            supplied Understatement identifiers.
          </p>
          <p className="chart-note">
            Synthetic unit cost: {money(v.syntheticUnitCostEUR, 2)} · Safety
            stock: {v.safetyStockWeeks} weeks
          </p>
          <PlanLink href="/assumptions">
            Review assumptions & customisation
          </PlanLink>
        </section>
      </div>
    </dialog>
  );
}
type Filters = Record<
  | "product"
  | "colour"
  | "type"
  | "system"
  | "size"
  | "decision"
  | "set"
  | "risk",
  string
>;
const emptyFilters: Filters = {
  product: "",
  colour: "",
  type: "",
  system: "",
  size: "",
  decision: "",
  set: "",
  risk: "",
};
function VariantTable({ initialId }: { initialId: string | null }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("urgency");
  const [selected, setSelected] = useState<string | null>(initialId);
  const filtered = variants.filter(
    (v) =>
      (!filters.product || v.productId === filters.product) &&
      (!filters.colour || v.colour === filters.colour) &&
      (!filters.type || v.productType === filters.type) &&
      (!filters.system || v.sizeSystem === filters.system) &&
      (!filters.size || v.size === filters.size) &&
      (!filters.decision || v.analystRecommendation === filters.decision) &&
      (!filters.set || v.matchingSetId === filters.set) &&
      (!filters.risk ||
        (filters.risk === "risk" ? !!setRiskFor(v) : !setRiskFor(v))),
  );
  const sorted =
    sort === "urgency"
      ? sortByUrgency(filtered)
      : [...filtered].sort((a, b) =>
          sort === "cover"
            ? a.sourceWeeksOfCover - b.sourceWeeksOfCover
            : retainedDemand(b) - retainedDemand(a),
        );
  const totalPages = Math.max(1, Math.ceil(sorted.length / 20));
  const pageIndex = Math.min(page, totalPages - 1);
  const rows = sorted.slice(pageIndex * 20, pageIndex * 20 + 20);
  const current = variants.find((v) => v.demoVariantId === selected);
  const options: {
    key: keyof Filters;
    label: string;
    values: readonly (readonly [string, string])[];
  }[] = [
    {
      key: "product",
      label: "Product",
      values: products.map((p) => [p.productId, p.naturanaProductName]),
    },
    {
      key: "colour",
      label: "Colour",
      values: [...new Set(products.map((p) => p.colour))].map((v) => [v, v]),
    },
    {
      key: "type",
      label: "Product type",
      values: [
        ["Top", "Top"],
        ["Bottom", "Bottom"],
      ],
    },
    {
      key: "system",
      label: "Size system",
      values: Object.entries(sizeSystemLabels),
    },
    {
      key: "size",
      label: "Size",
      values: [...new Set(variants.map((v) => v.size))].map((v) => [v, v]),
    },
    {
      key: "decision",
      label: "Decision",
      values: Object.entries(actionLabels),
    },
    {
      key: "set",
      label: "Set",
      values: [
        ["DL", "Dark Leo"],
        ["PL", "Plum"],
        ["CP", "Candy Pink"],
        ["CH", "Cherry"],
      ],
    },
    {
      key: "risk",
      label: "Risk",
      values: [
        ["risk", "Canonical set risk"],
        ["none", "No canonical set risk"],
      ],
    },
  ];
  return (
    <>
      <section className="panel">
        <div className="variant-filters">
          {options.map((o) => (
            <label key={o.key}>
              {o.label}
              <select
                aria-label={o.label}
                value={filters[o.key]}
                onChange={(e) => {
                  setFilters({ ...filters, [o.key]: e.target.value });
                  setPage(0);
                }}
              >
                <option value="">All</option>
                {o.values.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="table-toolbar">
          <label>
            Sort by
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
            >
              <option value="urgency">Decision urgency</option>
              <option value="cover">Lowest weeks cover</option>
              <option value="retained">Highest retained demand</option>
            </select>
          </label>
          <p role="status">{filtered.length} variants</p>
          <button
            className="button secondary"
            onClick={() => {
              setFilters(emptyFilters);
              setPage(0);
              setSort("urgency");
            }}
          >
            <RotateCcw size={14} />
            Clear filters
          </button>
        </div>
        <div
          className="table-scroll"
          role="region"
          aria-label="Variant planning table"
          tabIndex={0}
        >
          <table className="variant-table">
            <caption className="sr-only">
              All 85 variants, paginated. Reviewed base decisions.
            </caption>
            <thead>
              <tr>
                {[
                  "Product",
                  "Colour",
                  "Size",
                  "Public SKU",
                  "On hand",
                  "Incoming",
                  "Launch sales",
                  "Retained demand",
                  "Forecast / week",
                  "Weeks cover",
                  "Set status",
                  "Decision",
                  "Confidence",
                ].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.demoVariantId}>
                  <td>
                    <button
                      className="table-variant-link"
                      onClick={() => setSelected(v.demoVariantId)}
                      aria-label={`Review ${v.naturanaProductName} ${v.size}`}
                    >
                      {v.naturanaProductName}
                    </button>
                  </td>
                  <td>{v.colour}</td>
                  <td>
                    <strong>{v.size}</strong>
                  </td>
                  <td className="sku-code">{v.publicSku}</td>
                  <td>{v.onHand}</td>
                  <td>{v.incoming}</td>
                  <td>{v.grossLaunchSales}</td>
                  <td>{retainedDemand(v)}</td>
                  <td>{v.forecastWeeklyUnits}</td>
                  <td>{displayedCover(v)}</td>
                  <td>
                    {setRiskFor(v) ? <DecisionBadge action="SET_RISK" /> : "—"}
                  </td>
                  <td>
                    <DecisionBadge action={v.analystRecommendation} />
                  </td>
                  <td>{v.confidence ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="empty-state">
              <h3>No variants match these filters.</h3>
              <p>Clear the filters to return to the complete capsule.</p>
            </div>
          )}
        </div>
        <div className="pagination">
          <span>
            {rows.length
              ? `${pageIndex * 20 + 1}–${pageIndex * 20 + rows.length}`
              : "0"}{" "}
            of {filtered.length} variants · Page {pageIndex + 1} of {totalPages}
          </span>
          <div>
            <button
              className="button secondary"
              aria-label="Previous page"
              disabled={pageIndex === 0}
              onClick={() => setPage(pageIndex - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              className="button secondary"
              aria-label="Next page"
              disabled={pageIndex >= totalPages - 1}
              onClick={() => setPage(pageIndex + 1)}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="chart-note">
          — indicates no supplied per-variant confidence or canonical set risk.
          Final decisions are supplied demo states; no analyst detail is
          inferred.
        </p>
      </section>
      {current && (
        <VariantDecisionDrawer
          key={current.demoVariantId}
          variant={current}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
export function VariantPlanning() {
  const params = useSearchParams();
  const query = params.get("variant");
  return (
    <>
      <PageHeading {...pages.sku} />
      <div className="assumption-summary">
        <span>
          <strong>{variants.length}</strong> variants
        </span>
        <span>
          <strong>{immediateActions}</strong> immediate actions
        </span>
        <span>
          <strong>{counts.WATCH}</strong> watch
        </span>
        <span>
          <strong>{counts.REDUCE_NEXT_BUY}</strong> reduce next buy
        </span>
        <span>
          <strong>{counts.HOLD}</strong> hold
        </span>
      </div>
      <VariantTable key={query} initialId={query} />
      <SetAvailability />
    </>
  );
}
