import { Link, useParams } from "@tanstack/react-router";
import { NotFound } from "@/components/NotFound";
import { getVocabLevel } from "@/content/vocab";
import { useVocabProgress } from "@/hooks/useVocabProgress";

export function VocabLevelPage() {
  const { levelId } = useParams({ strict: false }) as { levelId: string };
  const { progress, loaded } = useVocabProgress();
  const level = getVocabLevel(levelId);
  if (!level) return <NotFound what="level" />;
  if (!loaded) return <main className="page" aria-busy="true" />;

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/vocab">All vocab levels</Link>
      <h1 style={{ margin: 0 }}>{level.title}</h1>
      {level.topics.length === 0 && <p className="muted">Topics for this level are on the way.</p>}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {level.topics.map((t) => {
          const best = progress.topics[t.id];
          return (
            <Link
              key={t.id}
              to="/vocab/$levelId/$topicId"
              params={{ levelId: level.id, topicId: t.id }}
              className="card"
              style={{ textDecoration: "none", color: "var(--text)", display: "grid", gap: "0.25rem" }}
            >
              <strong>{t.title}</strong>
              <span className="muted">{t.blurb}</span>
              {best?.quiz && <span className="muted">Best quiz {Math.round(best.quiz.bestScore * 100)}%</span>}
              {best?.gap && <span className="muted">Best gap-fill {Math.round(best.gap.bestScore * 100)}%</span>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
