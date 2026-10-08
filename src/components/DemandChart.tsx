import { demandChart, lemonLearning, skuById } from "../engine/fishwife";
import { number, percent } from "../engine/formatters";
export function DemandChart({ learning = false }: { learning?: boolean }) {
  const rows = demandChart();
  const x = (i: number) => 55 + i * 52;
  const y = (v: number) => 240 - (v / 7000) * 175;
  const segments = (key: "baseline" | "actual" | "forward") => {
    const paths: string[] = [];
    let path = "";
    rows.forEach((r, i) => {
      const v = r[key];
      if (v === null) {
        if (path) paths.push(path);
        path = "";
      } else path += `${path ? " L" : "M"}${x(i)} ${y(v)}`;
    });
    if (path) paths.push(path);
    return paths;
  };
  return (
    <div className="chart-frame">
      <svg
        className="chart-svg"
        viewBox="0 0 735 310"
        role="img"
        aria-labelledby={
          learning ? "learning-chart-title" : "demand-chart-title"
        }
      >
        <title id={learning ? "learning-chart-title" : "demand-chart-title"}>
          Spanish Lemon demand in tins per week. Baseline 4,300, current 5,600,
          recent four-week average 5,500. Missing weeks are not observations.
        </title>
        {learning && (
          <>
            <rect x="30" y="25" width="72" height="225" fill="#eeebde" />
            <rect x="102" y="25" width="133" height="225" fill="#f0e6bf" />
            <rect x="235" y="25" width="453" height="225" fill="#e9eddf" />
            <text x="36" y="40" style={{ fontSize: 8 }}>
              BEFORE EVENT
            </text>
            <text x="109" y="40" style={{ fontSize: 8 }}>
              COLLABORATION
            </text>
            <text x="248" y="40" style={{ fontSize: 8 }}>
              AFTER EVENT
            </text>
          </>
        )}
        {[0, 2000, 4000, 6000].map((v) => (
          <g key={v}>
            <line
              x1="55"
              x2="683"
              y1={y(v)}
              y2={y(v)}
              stroke="#cecbbc"
              strokeWidth="1"
            />
            <text x="40" y={y(v) + 4} textAnchor="end">
              {v === 0 ? "0" : `${v / 1000}K`}
            </text>
          </g>
        ))}
        <text x="55" y="18" style={{ fontSize: 9 }}>
          TINS / WEEK
        </text>
        {!learning && (
          <>
            <rect x="98" y="25" width="136" height="217" fill="#f0e6bf" />
            <line
              x1="109"
              x2="109"
              y1="31"
              y2="243"
              stroke="#887230"
              strokeDasharray="3 4"
            />
            <text x="113" y="42" style={{ fontSize: 9, fill: "#66501b" }}>
              Sweetgreen collaboration
            </text>
            <text x="113" y="56" style={{ fontSize: 8, fill: "#66501b" }}>
              11–24 Aug · public event
            </text>
          </>
        )}
        {(["baseline", "actual", "forward"] as const).map((key) =>
          segments(key).map((d, i) => (
            <path
              key={key + i}
              d={d}
              fill="none"
              stroke={
                key === "baseline"
                  ? "#65665b"
                  : key === "actual"
                    ? "#af3529"
                    : "#263fc1"
              }
              strokeWidth={key === "baseline" ? 1.5 : 2.8}
              strokeDasharray={
                key === "forward"
                  ? "6 4"
                  : key === "baseline"
                    ? "3 4"
                    : undefined
              }
            />
          )),
        )}
        {rows.map((r, i) => (
          <g key={r.week}>
            {r.actual !== null && (
              <circle cx={x(i)} cy={y(r.actual)} r="3.6" fill="#af3529" />
            )}
            <text x={x(i)} y="263" textAnchor="middle" style={{ fontSize: 9 }}>
              {r.label}
            </text>
            {r.actual === null && r.forward === null && (
              <text
                x={x(i)}
                y="280"
                textAnchor="middle"
                style={{ fontSize: 8 }}
              >
                no observation
              </text>
            )}
          </g>
        ))}
        <line
          x1="544"
          x2="544"
          y1="65"
          y2="242"
          stroke="#263fc1"
          strokeDasharray="2 5"
        />
        <text x="555" y="76" style={{ fill: "#263fc1", fontSize: 9 }}>
          FORWARD ASSUMPTION
        </text>
        <text x="555" y="90" style={{ fontSize: 8 }}>
          Current case · 5,500 tins/week
        </text>
      </svg>
      <div className="chart-legend">
        <span>
          <i className="legend-line plan" />
          Previous plan
        </span>
        <span>
          <i className="legend-line actual" />
          Actual / current signal
        </span>
        <span>
          <i className="legend-line forward" />
          Current forward assumption
        </span>
      </div>
      <p className="chart-summary">
        Synthetic observations: {number(skuById("TUN-SL").baseline)} baseline →{" "}
        {number(skuById("TUN-SL").current)} current tins/week. Post-event
        persistence {percent(lemonLearning().uplift)}. Forward line is the
        supplied current-case planning assumption; missing actuals remain
        unobserved.
      </p>
      <details className="chart-data">
        <summary>View weekly observations and source gaps</summary>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Spanish Lemon weekly chart data
            </caption>
            <thead>
              <tr>
                <th scope="col">Week</th>
                <th scope="col">Previous plan</th>
                <th scope="col">Observed tins</th>
                <th scope="col">Forward assumption</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.week}>
                  <th scope="row">{r.label}</th>
                  <td>{number(r.baseline)}</td>
                  <td>
                    {r.actual === null
                      ? "no supplied observation"
                      : number(r.actual)}
                  </td>
                  <td>{r.forward === null ? "—" : number(r.forward)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
