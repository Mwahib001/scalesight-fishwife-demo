"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { type Decision, type PO, fixture } from "../data/fishwife.v1";
import { skuById } from "../engine/fishwife";
import { number, date } from "../engine/formatters";
import { Badge, PlanLink, ProductImage, Reviewed, Stamp } from "./ui";
export function DecisionDrawer({
  decision,
  po,
  onClose,
}: {
  decision?: Decision;
  po?: PO;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const sku = skuById(decision?.sku ?? po!.sku);
  useEffect(() => {
    const el = dialog.current;
    const trigger = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el?.showModal();
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  const narrative =
    decision ?? fixture.decisions.find((d) => d.sku === po?.sku);
  const sections = po
    ? [
        [
          "CURRENT COMMITMENT",
          `${po.id} · ${number(po.quantity)} tins · original arrival ${date(po.originalArrival)}. ${po.partner} is a synthetic partner label.`,
        ],
        [
          "WHAT CHANGED",
          narrative?.changed ??
            "The supplied commitment is retained in the current plan. No additional changed state is supplied.",
        ],
        [
          "EXPOSURE",
          narrative?.unchanged ??
            "Exact projected position is not specified: stage dates and receipt ordering remain unconfirmed.",
        ],
        [
          "AVAILABLE RESPONSES",
          narrative?.matters ??
            "Retain the supplied commitment and monitor readiness next cycle.",
        ],
        [
          "SCALESIGHT RECOMMENDATION",
          narrative?.recommendation ?? "HOLD the reviewed current commitment.",
        ],
        [
          "FISHWIFE DECISION REQUIRED",
          narrative?.decision ??
            "Fishwife retains ownership of supplier commitments and execution. No immediate intervention is supplied.",
        ],
      ]
    : [
        ["WHAT CHANGED", decision!.changed],
        ["WHY IT MATTERS", decision!.matters],
        ["IF THE PLAN STAYS UNCHANGED", decision!.unchanged],
        ["SCALESIGHT RECOMMENDATION", decision!.recommendation],
        ["DECISION FISHWIFE NEEDS TO MAKE", decision!.decision],
      ];
  return (
    <dialog
      ref={dialog}
      className="decision-dialog"
      aria-labelledby="drawer-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="decision-drawer">
        <div className="drawer-header">
          <span>
            {po ? "SUPPLY COMMITMENT · READ ONLY" : "THE WEEKLY DECISION BRIEF"}
          </span>
          <button
            className="icon-button"
            aria-label="Close decision"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        <div className="drawer-product">
          <ProductImage sku={sku} />
          <div>
            <p className="product-card-id">{sku.id} · ILLUSTRATIVE DATA</p>
            <h2 id="drawer-title">{sku.name}</h2>
          </div>
        </div>
        <div className="drawer-status">
          <Badge label={decision?.label ?? po!.status} tone="blue" /> <Stamp />
        </div>
        <div className="drawer-sections">
          {sections.map(([title, copy]) => (
            <section
              className={`drawer-section ${title === "SCALESIGHT RECOMMENDATION" ? "recommendation" : ""}`}
              key={title}
            >
              <h3>{title}</h3>
              <p>{copy}</p>
            </section>
          ))}
        </div>
        <div className="drawer-footer">
          <Reviewed />
          {narrative && (
            <PlanLink href={narrative.href}>Explore the analysis</PlanLink>
          )}
        </div>
        <p className="source-context">
          ScaleSight interpretation · {narrative?.source ?? po?.source} · Demo
          narrative, not a live approval.
        </p>
      </div>
    </dialog>
  );
}
