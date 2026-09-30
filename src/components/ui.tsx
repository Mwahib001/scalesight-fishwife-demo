import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Info,
  CircleArrowUp,
  CirclePlus,
  Search,
  Eye,
  ArrowDown,
  Minus,
  Link2,
} from "lucide-react";
import { actionLabels } from "../data/naturana";
import type { DecisionAction } from "../data/naturana.types";
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {children ?? (
        <span className="date-chip">
          <CalendarDays size={15} />
          Week of 28 Sep 2026
        </span>
      )}
    </div>
  );
}
export function SectionHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function PlanLink({
  href,
  children,
  className = "text-link",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}
export function Interpretation({ children }: { children: React.ReactNode }) {
  return (
    <div className="interpretation">
      <Info size={17} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
const icons = {
  BUY_DEEPER: CircleArrowUp,
  REPLENISH: CirclePlus,
  INVESTIGATE: Search,
  WATCH: Eye,
  REDUCE_NEXT_BUY: ArrowDown,
  HOLD: Minus,
  SET_RISK: Link2,
};
export function DecisionBadge({
  action,
}: {
  action: DecisionAction | "SET_RISK";
}) {
  const Icon = icons[action];
  return (
    <span className={`decision-badge decision-${action.toLowerCase()}`}>
      <Icon size={13} aria-hidden="true" />
      {action === "SET_RISK" ? "SET RISK" : actionLabels[action]}
    </span>
  );
}
export function AnalystNote({
  children,
  title = "ScaleSight observation",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <aside className="analyst-note panel" aria-label={title}>
      <p className="eyebrow">REVIEWED BY SCALESIGHT</p>
      <h2>{title}</h2>
      <div className="note-body">{children}</div>
    </aside>
  );
}
export function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  caption: string;
}) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
