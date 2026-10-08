import { useId } from "react";
import type { InventoryPoint } from "../engine/fishwife";
import { date, number } from "../engine/formatters";
import { DataTable } from "./ui";
export function InventoryChart({
  rows,
  comparison,
  opening,
  safety,
  title,
}: {
  rows: InventoryPoint[];
  comparison?: InventoryPoint[];
  opening: number;
  safety: number;
  title: string;
}) {
  const id = useId();
  const values = [opening, ...rows.map((r) => r.physical)];
  const alternative = comparison
    ? [opening, ...comparison.map((r) => r.physical)]
    : null;
  const max =
    Math.ceil(Math.max(safety, ...values, ...(alternative ?? [])) / 2000) *
      2000 || 2000;
  const x = (i: number) => 65 + i * (600 / rows.length);
  const y = (value: number) => 255 - (value / max) * 185;
  const path = (series: number[]) =>
    series.map((value, i) => `${i ? "L" : "M"}${x(i)} ${y(value)}`).join(" ");
  return (
    <div className="chart-frame">
      <div
        className="plot-scroll"
        role="region"
        aria-label={title}
        tabIndex={0}
      >
        <svg
          className="planning-plot"
          viewBox="0 0 735 340"
          role="img"
          aria-labelledby={id}
        >
          <title
            id={id}
          >{`${title}. Physical inventory in tins; receipts are available before demand. Final point shows opening inventory after receipt, before that week’s demand.`}</title>
          <text x="65" y="24">
            PHYSICAL INVENTORY · TINS
          </text>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line
                x1="65"
                x2="678"
                y1={y(max * t)}
                y2={y(max * t)}
                stroke="#d4d0bf"
              />
              <text x="55" y={y(max * t) + 4} textAnchor="end">
                {number(max * t)}
              </text>
            </g>
          ))}
          <line
            x1="65"
            x2="678"
            y1={y(safety)}
            y2={y(safety)}
            stroke="#956817"
            strokeDasharray="4 4"
          />
          <text x="68" y={y(safety) - 7} fill="#655016">
            Safety {number(safety)}
          </text>
          <path
            d={path(values)}
            fill="none"
            stroke="#af3529"
            strokeWidth="2.5"
          />
          {alternative && (
            <path
              d={path(alternative)}
              fill="none"
              stroke="#263fc1"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />
          )}
          <text x={x(0)} y="275" textAnchor="middle">
            Open
          </text>
          {rows.map((row, i) => (
            <g key={row.week}>
              <circle cx={x(i + 1)} cy={y(row.physical)} r="3.5" fill="#af3529">
                <title>{`${row.label}: ${number(row.physical)} inventory; ${number(row.unmet)} unmet; ${number(row.receipt)} received`}</title>
              </circle>
              {row.receipt > 0 && (
                <>
                  <line
                    x1={x(i + 1)}
                    x2={x(i + 1)}
                    y1="45"
                    y2="255"
                    stroke="#36573e"
                    strokeDasharray="2 5"
                  />
                  <text x={x(i + 1)} y="40" textAnchor="middle" fill="#36573e">
                    +{number(row.receipt)}
                  </text>
                </>
              )}
              {comparison &&
                comparison[i].receipt > 0 &&
                comparison[i].receipt !== row.receipt && (
                  <g>
                    <line
                      x1={x(i + 1) + 4}
                      x2={x(i + 1) + 4}
                      y1="58"
                      y2="255"
                      stroke="#263fc1"
                      strokeDasharray="3 4"
                    />
                    <text
                      x={x(i + 1)}
                      y="56"
                      textAnchor="middle"
                      fill="#263fc1"
                    >
                      R +{number(comparison[i].receipt)}
                    </text>
                  </g>
                )}
              {row.unmet > 0 && (
                <text x={x(i + 1)} y="322" textAnchor="middle" fill="#af3529">
                  −{number(row.unmet)}
                </text>
              )}
              <text x={x(i + 1)} y="275" textAnchor="middle">
                {row.label}
                {i === rows.length - 1 ? " open" : " end"}
              </text>
              <text x={x(i + 1)} y="293" textAnchor="middle">
                {date(row.date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-line actual" />
          {comparison ? "Without intervention" : "Selected recovery"}
        </span>
        {comparison && (
          <span>
            <i className="legend-line forward" />
            Recommended response
          </span>
        )}
        <span>Dashed gold: safety reserve</span>
        <span>
          Green markers: {comparison ? "current-plan receipts" : "receipts"}
        </span>
        {comparison && <span>Blue R markers: changed recovery receipts</span>}
        <span>Red numbers: unmet tins</span>
      </div>
      <p className="chart-summary">
        Weekly dates mark period starts. Inventory points show period-end stock,
        except the final opening receipt. Unmet demand is tracked separately;
        physical stock never becomes negative.
      </p>
      <details className="chart-data">
        <summary>View inventory, receipts and service gap</summary>
        <DataTable
          caption={title + " data"}
          headers={[
            "Period starts",
            "Demand",
            "Receipts",
            "Physical tins",
            "Unmet tins",
            ...(comparison
              ? ["Recovery receipts", "Recovery inventory", "Recovery unmet"]
              : []),
          ]}
          numeric={[1, 2, 3, 4, 5, 6, 7]}
          rows={rows.map((r, i) => [
            `${r.label} · ${date(r.date)}${i === rows.length - 1 ? " · opening" : ""}`,
            number(r.demand),
            number(r.receipt),
            number(r.physical),
            number(r.unmet),
            ...(comparison
              ? [
                  number(comparison[i].receipt),
                  number(comparison[i].physical),
                  number(comparison[i].unmet),
                ]
              : []),
          ])}
        />
      </details>
    </div>
  );
}
