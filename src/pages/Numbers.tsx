import { Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { NUMBER_STEPS } from "@/content/numbers";
import { useStats } from "@/hooks/useStats";
import { numbersSummary } from "@/lib/stats";

const firstSentence = (s: string) => s.split(/(?<=[.!?])\s/)[0] ?? s;

export function Numbers() {
  const { stats } = useStats();
  const best = numbersSummary(stats).steps;
  return (
    <>
      <Hero first="Count in Yoruba," second="twenty by twenty" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <p className="muted" style={{ margin: 0 }}>
          Yoruba counts in twenties. Work through the steps in any order: a short explanation first, then typed practice.
        </p>
        <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
          {NUMBER_STEPS.map((s, i) => (
            <Link
              key={s.id}
              to="/numbers/$stepId"
              params={{ stepId: s.id }}
              className="card row-card numbers-step-card"
              data-testid="numbers-step-card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <span className="row-main" style={{ display: "grid", gap: "0.2rem" }}>
                <strong>{i + 1}. {s.title}</strong>
                <span className="muted">{firstSentence(s.rule)}</span>
              </span>
              {best[s.id] !== undefined && (
                <span className="status-cell"><span className="status-done">Best {Math.round(best[s.id]! * 100)}%</span></span>
              )}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
