"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  FileText,
  FlaskConical,
  Layers3,
  Menu,
  Settings2,
  Workflow,
  X,
  ScanLine,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";
import { PlanningProvider, usePlanning } from "../context/PlanningContext";
import { disclaimer, tagline } from "../data/naturana";
export const nav = [
  ["/", "Weekly Brief", FileText],
  ["/size-translation", "Size Translation", ScanLine],
  ["/size-demand", "Size Demand", ChartNoAxesCombined],
  ["/sku-planning", "SKU & Size Planning", Layers3],
  ["/fit-signal", "Fit Signal", Activity],
  ["/next-buy", "Next Buy", ShoppingBag],
  ["/scenario", "Scenario Planning", Settings2],
  ["/forecast-learning", "Forecast Learning", GraduationCap],
  ["/managed-intelligence", "Managed Intelligence", Workflow],
  ["/assumptions", "Assumptions & Customisation", BookOpen],
] as const;
function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const { state, scenario, dispatch } = usePlanning();
  useEffect(() => {
    if (!menu) return;
    const trigger = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const sidebar = document.querySelector<HTMLElement>(".sidebar");
    sidebar?.querySelector<HTMLButtonElement>(".mobile-close")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (event.key === "Tab" && sidebar) {
        const focusable = Array.from(
          sidebar.querySelectorAll<HTMLElement>("a,button"),
        ).filter((el) => el.offsetParent !== null);
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [menu]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {menu && (
        <div
          className="nav-backdrop"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${menu ? "is-open" : ""}`}
        role={menu ? "dialog" : undefined}
        aria-modal={menu ? true : undefined}
        aria-label="Workspace navigation"
      >
        <Link href="/" className="brand" onClick={() => setMenu(false)}>
          <Image
            className="brand-logo"
            src="/logos/scalesight logo coloured bg.svg"
            alt="ScaleSight"
            width={1135.14}
            height={395.86}
            loading="eager"
          />
          <small>MANAGED INTELLIGENCE</small>
        </Link>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X size={20} />
        </button>
        <div className="client-switch">
          <span className="client-avatar">N</span>
          <div>
            <strong>NATURANA</strong>
            <small>Size-to-Buy Planning</small>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          {nav.map(([href, label, Icon], i) => (
            <div key={href}>
              {(i === 0 || i === 8) && (
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
                <Icon size={18} strokeWidth={1.7} />
                <span>{label}</span>
              </Link>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="analyst-status">
            <span className="status-dot" />
            Managed by ScaleSight
          </div>
          <p>
            Workspace = planning environment
            <br />
            ScaleSight = analytical team
          </p>
          <Link
            href="/assumptions#customisation"
            onClick={() => setMenu(false)}
          >
            Configured for NATURANA <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="menu-toggle icon-button"
            aria-label="Open navigation"
            onClick={() => setMenu(!menu)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <strong>NATURANA × Understatement</strong>
            <span>/</span>Size-to-Buy Planning
          </div>
          <div className="topbar-right">
            <span className="refresh">Refreshed 30 Sep · 06:00 CEST</span>
            <span className="demo-badge" tabIndex={0}>
              <FlaskConical size={13} />
              Illustrative Data
              <span className="badge-tooltip" role="tooltip">
                {disclaimer}
              </span>
            </span>
          </div>
        </header>
        <div
          className="persistent-disclaimer"
          role="region"
          aria-label="Illustrative data disclaimer"
          data-testid="illustrative-disclaimer"
        >
          <FlaskConical size={16} aria-hidden="true" />
          <p>
            <strong>Illustrative Planning Concept</strong> · {disclaimer}
          </p>
        </div>
        <main id="main-content">
          {state.presetId !== "BASE" && (
            <div className="scenario-banner">
              <FlaskConical size={16} />
              <span>
                {scenario
                  ? `${scenario.label} preset selected · Catalog decisions remain the reviewed base plan`
                  : "Custom: not calibrated in V1"}
              </span>
              <button onClick={() => dispatch({ type: "reset" })}>
                Reset to Base Plan
              </button>
            </div>
          )}
          {children}
          <footer className="page-footer">
            <span>{tagline}</span>
            <span>NATURANA · Illustrative data</span>
          </footer>
        </main>
      </div>
    </>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PlanningProvider>
      <Shell>{children}</Shell>
    </PlanningProvider>
  );
}
