import { useId } from "react";
import { demandChart, demandContext } from "../engine/fishwife";
import { number, percent } from "../engine/formatters";
import { DataTable } from "./ui";
export function DemandChart({
  learning = false,
  sku = "TUN-SL",
  channel = "ALL",
}: {
  learning?: boolean;
  sku?: string;
  channel?: string;
}) {
  const id = useId();
  const rows = demandChart(sku, channel);
  const context = demandContext(sku, channel);
  const max =
    Math.ceil(
      Math.max(
        ...rows.flatMap((r) => [r.baseline, r.actual ?? 0, r.forward ?? 0]),
      ) / 500,
    ) * 500 || 500;
  const x = (i: number) => 62 + i * 41;
  const y = (value: number) => 247 - (value / max) * 180;
  const path = (key: "baseline" | "actual" | "forward") => {
    if (key === "forward") {
      const startPoint = rows[12];
      if (startPoint && startPoint.actual !== null) {
        let d = `M${x(12)} ${y(startPoint.actual)}`;
        for (let i = 13; i < rows.length; i++) {
          if (rows[i].forward !== null) {
            d += ` L${x(i)} ${y(rows[i].forward!)}`;
          }
        }
        return d;
      }
    }
    return rows.reduce(
      (text, row, i) =>
        row[key] === null
          ? text
          : `${text} ${i === 0 || rows[i - 1][key] === null ? "M" : "L"}${x(i)} ${y(row[key]!)}`,
      "",
    );
  };
  return (
    <div className="chart-frame">
      <div
        className="plot-scroll"
        role="region"
        aria-label={`${context.product.short} demand chart`}
        tabIndex={0}
      >
        <svg
          className="planning-plot"
          viewBox="0 0 735 310"
          role="img"
          aria-labelledby={id}
        >
          <title
            id={id}
          >{`${context.product.short} demand · ${channel}. 13 weeks of illustrative history, followed by 3 forward planning weeks. Current ${number(context.current)}, baseline ${number(context.baseline)} tins/week.`}</title>
          <text x="62" y="22">
            TINS / WEEK ·{" "}
            {learning ? "EVENT-AWARE LEARNING" : "ILLUSTRATIVE HISTORY"}
          </text>
          {sku === "TUN-SL" && (
            <g>
              <rect
                x={x(4)}
                y="38"
                width={x(6) - x(4)}
                height="209"
                fill="#f0e6bf"
              />
              <text x={x(4) + 4} y="51" fontSize="10">
                Sweetgreen
              </text>
              <text x={x(4) + 4} y="64" fontSize="10">
                11–24 Aug
              </text>
            </g>
          )}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line
                x1="62"
                x2="690"
                y1={y(max * t)}
                y2={y(max * t)}
                stroke="#d4d0bf"
              />
              <text x="52" y={y(max * t) + 4} textAnchor="end">
                {number(max * t)}
              </text>
            </g>
          ))}
          <line
            x1={x(12) + 20}
            x2={x(12) + 20}
            y1="38"
            y2="250"
            stroke="#263fc1"
            strokeDasharray="3 4"
          />
          <text x={x(13)} y="51" fill="#263fc1">
            FORWARD
          </text>
          {(["baseline", "actual", "forward"] as const).map((key) => (
            <path
              key={key}
              d={path(key)}
              fill="none"
              stroke={
                key === "actual"
                  ? "#af3529"
                  : key === "forward"
                    ? "#263fc1"
                    : "#65665b"
              }
              strokeWidth={key === "baseline" ? 1.5 : 2.5}
              strokeDasharray={key === "actual" ? undefined : "5 4"}
            />
          ))}
          {rows.map((row, i) => (
            <g key={row.week}>
              {row.actual !== null && (
                <circle cx={x(i)} cy={y(row.actual)} r="3" fill="#af3529">
                  <title>{`${row.label}: ${number(row.actual)} tins`}</title>
                </circle>
              )}
              <text x={x(i)} y="270" textAnchor="middle" fontSize="9">
                {row.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-line plan" />
          Previous plan
        </span>
        <span>
          <i className="legend-line actual" />
          Synthetic demand history
        </span>
        <span>
          <i className="legend-line forward" />
          Forward assumption
        </span>
      </div>
      <p className="chart-summary">
        {context.product.short} · {channel}: {number(context.current)} current
        tins/week; {percent(context.variance)} vs baseline. Recent four-week
        uplift {percent(context.uplift)}. Future periods are assumptions, not
        observations.
      </p>
      <details className="chart-data">
        <summary>View weekly observations and assumptions</summary>
        <DataTable
          caption="Weekly observations"
          headers={[
            "Week",
            "Baseline · tins",
            "Modeled demand · tins",
            "Forward · tins",
          ]}
          numeric={[1, 2, 3]}
          rows={rows.map((r) => [
            r.label,
            number(r.baseline),
            r.actual === null ? "Forward period" : number(r.actual),
            number(r.forward),
          ])}
        />
      </details>
    </div>
  );
}
