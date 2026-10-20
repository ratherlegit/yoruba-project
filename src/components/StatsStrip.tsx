import { Link } from "@tanstack/react-router";
import type { StripFigure } from "@/lib/stats-summary";

export function StatsStrip({ figures }: { figures: StripFigure[] }) {
  if (figures.length === 0) {
    return (
      <section className="card stats-strip" aria-label="Your stats">
        <p style={{ margin: 0 }}>Start a lesson to see your stats</p>
        <Link to="/grammar">Start with Grammar</Link>
      </section>
    );
  }
  return (
    <section className="card stats-strip" aria-label="Your stats">
      <dl className="stats-figures">
        {figures.map((f) => (
          <div key={f.label}>
            <dd>{f.value}</dd>
            <dt className="muted">{f.label}</dt>
          </div>
        ))}
      </dl>
      <Link to="/stats">See all stats</Link>
    </section>
  );
}
