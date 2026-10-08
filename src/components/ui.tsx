import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  GitBranch,
  FlaskConical,
  Info,
  MoveRight,
  Package,
  TriangleAlert,
} from "lucide-react";
import { type Sku, type Confidence } from "../data/fishwife.v1";
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {children}
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
export function Badge({
  label,
  tone = "ink",
}: {
  label: string;
  tone?: string;
}) {
  const Icon =
    label.includes("HOLD") ||
    label.includes("CONFIRMED") ||
    label === "PROTECTED COMMITMENTS" ||
    label === "REVIEWED RECOMMENDATION"
      ? CheckCircle2
      : label.includes("WATCH") || label === "MODERATE"
        ? Eye
        : label.includes("SPLIT")
          ? GitBranch
          : label.includes("RESEQUENCE") || label.includes("REALLOCATE")
            ? MoveRight
            : label === "ILLUSTRATIVE SCENARIO"
              ? FlaskConical
              : label === "PLANNING ASSUMPTION"
                ? Info
                : TriangleAlert;
  return (
    <span className={`badge badge-${tone}`}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}
export function ConfidenceValue({ value }: { value: Confidence | null }) {
  const Icon = value === "LOW" ? TriangleAlert : Eye;
  return value ? (
    <span className="confidence-value">
      <Icon size={15} aria-hidden="true" />
      {value}
    </span>
  ) : (
    "—"
  );
}
export function Reviewed() {
  return (
    <span className="reviewed">
      <CheckCircle2 size={13} aria-hidden="true" />
      Reviewed by ScaleSight
    </span>
  );
}
export function Stamp() {
  return (
    <span className="stamp">
      <TriangleAlert size={10} aria-hidden="true" />
      Needs Fishwife decision
    </span>
  );
}
export function ProductImage({
  sku,
  large = false,
}: {
  sku: Sku;
  large?: boolean;
}) {
  return sku.image ? (
    <Image
      className={`product-image ${large ? "large" : ""}`}
      src={sku.image}
      alt={`${sku.name} product packaging`}
      width={large ? 250 : 88}
      height={large ? 250 : 88}
      unoptimized
    />
  ) : (
    <span className="product-placeholder">
      <Package size={24} />
      <span>Product image pending</span>
    </span>
  );
}
export function PlanLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link className="text-link" href={href} onNavigate={onNavigate}>
      {children}
      <ArrowRight size={15} />
    </Link>
  );
}
export function Missing({ children }: { children?: React.ReactNode }) {
  return (
    <div className="missing-state">
      <TriangleAlert size={18} />
      <div>
        <strong>Not specified in demo source.</strong>
        {children && <p>{children}</p>}
        <Link href="/assumptions#confirmation">
          View source inputs needed
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
export function Metric({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  tone?: string;
}) {
  return (
    <div className={`metric ${tone ?? ""}`}>
      <span>{label}</span>
      <strong>
        {value}
        {unit && <small>{unit}</small>}
      </strong>
    </div>
  );
}
export function AnalystNote({
  title = "ScaleSight recommendation",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="analyst-note">
      <span className="eyebrow">PREPARED & REVIEWED</span>
      <h2>{title}</h2>
      <div className="note-body">{children}</div>
      <Reviewed />
    </aside>
  );
}
export function DataTable({
  headers,
  rows,
  caption,
  numeric = [],
  onRowSelect,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  caption: string;
  numeric?: number[];
  onRowSelect?: (index: number) => void;
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
            {headers.map((h, i) => (
              <th
                className={numeric.includes(i) ? "numeric" : ""}
                scope="col"
                key={h}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={onRowSelect ? "selectable-row" : undefined}
              onClick={
                onRowSelect
                  ? (event) => {
                      if (
                        !(event.target as HTMLElement).closest(
                          "button,a,input,select",
                        )
                      )
                        onRowSelect(i);
                    }
                  : undefined
              }
            >
              {row.map((cell, j) => (
                <td className={numeric.includes(j) ? "numeric" : ""} key={j}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
