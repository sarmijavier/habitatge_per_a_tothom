import type { ChartPayload } from "../lib/types";

function buildPath(points: { x: string; y?: number | null }[], width: number, height: number) {
  const valid = points.filter((point) => typeof point.y === "number") as {
    x: string;
    y: number;
  }[];
  if (valid.length < 2) {
    return "";
  }

  const values = valid.map((point) => point.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return valid
    .map((point, index) => {
      const x = (index / (valid.length - 1)) * width;
      const y = height - ((point.y - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function MiniChart({ chart }: { chart: ChartPayload }) {
  const width = 640;
  const height = 160;
  const colors = ["#b2552e", "#355d4e", "#395f8c"];

  return (
    <section className="card chart-frame stack">
      <div>
        <div className="eyebrow">Datos</div>
        <h3 style={{ marginBottom: 4 }}>{chart.title}</h3>
        {chart.subtitle ? <p className="muted">{chart.subtitle}</p> : null}
      </div>
      <svg
        className="chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={chart.title}
      >
        <line x1="0" y1={height} x2={width} y2={height} stroke="#c5b1a1" strokeWidth="1" />
        {chart.series.map((series, index) => (
          <path
            key={series.label}
            d={buildPath(series.points, width, height)}
            fill="none"
            stroke={colors[index % colors.length]}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="cluster">
        {chart.series.map((series, index) => (
          <span key={series.label} className="pill">
            <span style={{ color: colors[index % colors.length], fontWeight: 700 }}>
              {series.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
