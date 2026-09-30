"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { curves, confidenceNote } from "../data/naturana";
import { pages } from "../data/naturana.copy";
import {
  PageHeading,
  SectionHeading,
  AnalystNote,
  PlanLink,
  DataTable,
} from "./ui";
const series = [
  { key: "initial", label: "Initial translated mix", color: "#7b8da6" },
  { key: "gross", label: "Gross launch mix", color: "#3b82f6" },
  { key: "adjusted", label: "Fit-adjusted mix", color: "#12816c" },
] as const;
export function SizeDemand() {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    initial: true,
    gross: true,
    adjusted: true,
  });
  return (
    <>
      <PageHeading {...pages.demand} />
      <section className="panel">
        <SectionHeading
          title="Expected vs observed alpha-size mix"
          description="Canonical illustrative planning curves · Share of demand (%)"
        />
        <div className="chart-legend">
          {series.map((s) => (
            <button
              key={s.key}
              aria-pressed={visible[s.key]}
              onClick={() => setVisible((v) => ({ ...v, [s.key]: !v[s.key] }))}
            >
              <span style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
        <div
          className="size-curve-chart"
          role="img"
          aria-label="Initial, gross and fit-adjusted alpha-size mix. M increases from 24% to 33%; L falls from 25% to 22%. Exact values in the table below."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={curves}
              margin={{ top: 15, right: 8, left: -12, bottom: 8 }}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} stroke="#e3e8f0" />
              <XAxis dataKey="size" tickLine={false} axisLine={false} />
              <YAxis
                unit="%"
                domain={[0, 40]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                cursor={{ fill: "#f5f7fb" }}
              />
              {series
                .filter((s) => visible[s.key])
                .map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable
          caption="Exact canonical size curves"
          headers={[
            "Size",
            "Initial translated mix",
            "Gross launch mix",
            "Fit-adjusted mix",
          ]}
          rows={curves.map((c) => [
            c.size,
            `${c.initial}%`,
            `${c.gross}%`,
            `${c.adjusted}%`,
          ])}
        />
      </section>
      <div className="two-col">
        <article className="panel curve-insight">
          <p className="eyebrow">M · RETAINED DEMAND</p>
          <strong>24% → 33%</strong>
          <h2>M is +9 pts above the initial planning curve.</h2>
        </article>
        <article className="panel curve-insight">
          <p className="eyebrow">L · FIT-ADJUSTED DEMAND</p>
          <strong>25% → 22%</strong>
          <p>
            L looks close to plan if gross sales are used. Once exchanges are
            incorporated, the retained demand signal is weaker.
          </p>
        </article>
      </div>
      <AnalystNote title="Size-curve confidence: Moderate">
        <p>{confidenceNote}</p>
        <PlanLink href="/fit-signal">Inspect the fit signal</PlanLink>
      </AnalystNote>
    </>
  );
}
