"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  CheckCircle2,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers3,
  Menu,
  Package,
  Route,
  Settings2,
  Truck,
  Workflow,
  X,
} from "lucide-react";
import { disclaimer, fixture } from "../data/fishwife.v1";
export const nav = [
  ["/", "Weekly Brief", FileText],
  ["/demand", "Demand by Channel", ChartNoAxesCombined],
  ["/supply-commitments", "Supply Commitments", Truck],
  ["/allocation", "Allocation", Route],
  ["/po-intervention", "PO Intervention", Package],
  ["/bundles", "Bundles & Assembly", Layers3],
  ["/scenario", "Scenario Planning", Settings2],
  ["/sop", "S&OP Bridge", Workflow],
  ["/forecast-learning", "Forecast Learning", GraduationCap],
  ["/managed-intelligence", "Managed Intelligence", Workflow],
  ["/assumptions", "Assumptions & Data", BookOpen],
] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!menu) return;
    const trigger = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab") {
        const items = Array.from(
          sidebar.current?.querySelectorAll<HTMLElement>("button,a") ?? [],
        ).filter((x) => x.offsetParent !== null);
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      trigger?.focus();
    };
  }, [menu]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-brand">
          <button
            className="menu-toggle icon-button"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <Link href="/">
            FISHWIFE <span>×</span> SCALESIGHT
          </Link>
          <span className="topbar-subtitle">Supply Commitment Planning</span>
        </div>
        <div className="topbar-right">
          <span className="concept">
            <span className="small-dot" />
            Illustrative Planning Concept
          </span>
          <span className="refresh">Refreshed {fixture.timeline.refresh}</span>
        </div>
      </header>
      {menu && (
        <div
          className="nav-backdrop"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebar}
        className={`sidebar ${menu ? "is-open" : ""}`}
        role={menu ? "dialog" : undefined}
        aria-modal={menu ? true : undefined}
        aria-label="Workspace navigation"
      >
        <button
          className="mobile-close icon-button"
          onClick={() => setMenu(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <Link href="/" className="room-identity" onClick={() => setMenu(false)}>
          <span className="room-number">FW / 01</span>
          <strong>The planning room.</strong>
          <span>Prepared for Fishwife</span>
        </Link>
        <nav aria-label="Primary navigation">
          {nav.map(([href, label, Icon], i) => (
            <div key={href}>
              {(i === 0 || i === 9) && (
                <p className="nav-label">
                  {i === 0 ? "PLANNING" : "SCALESIGHT SERVICE"}
                </p>
              )}
              <Link
                href={href}
                className={path === href ? "active" : ""}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <Icon size={17} strokeWidth={1.6} />
                <span>{label}</span>
                {path === href && <span className="nav-active-mark">•</span>}
              </Link>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Image
            src="/logos/scalesight coloured primary logo.svg"
            width={120}
            height={38}
            alt="ScaleSight"
          />
          <p className="managed">
            <CheckCircle2 size={14} />
            Managed by ScaleSight
          </p>
          <p>
            Analysis maintained by ScaleSight.
            <br />
            Decisions made with Fishwife.
          </p>
          <Link href="/managed-intelligence" onNavigate={() => setMenu(false)}>
            How the service works
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="workspace">
        <div
          className="context-line"
          role="region"
          aria-label="Planning context and data disclosure"
        >
          <span>
            FISHWIFE PLANNING ROOM <span className="context-slash">/</span>{" "}
            {nav.find((n) => n[0] === path)?.[1]}
          </span>
          <details
            ref={disclosure}
            className="data-disclosure"
            data-testid="illustrative-disclaimer"
          >
            <summary>
              <FlaskConical size={12} />
              Illustrative Data
            </summary>
            <div className="disclosure-content">
              <strong>Illustrative Planning Concept</strong>
              <p>{disclaimer}</p>
              <Link
                href="/assumptions"
                onNavigate={() => {
                  disclosure.current?.removeAttribute("open");
                }}
              >
                Assumptions & Data <ArrowUpRight size={13} />
              </Link>
            </div>
          </details>
        </div>
        <main id="main-content">
          {children}
          <footer className="page-footer">
            <span>
              Analysis maintained by ScaleSight. Decisions made with Fishwife.
            </span>
            <Link href="/assumptions">
              Illustrative data · Assumptions & Data
              <ArrowUpRight size={12} />
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
