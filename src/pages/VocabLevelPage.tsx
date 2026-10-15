import { LevelIcon } from "@/components/LevelIcon";
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
      <div className="level-head"><LevelIcon level={level.id} size="lg" /><h1 style={{ margin: 0 }}>{level.title}</h1></div>
      {level.topics.length === 0 && <p className="muted">Topics for this level are on the way.</p>}
      <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
        {level.topics.map((t) => {
          const best = progress.topics[t.id];
          return (
            <Link
              key={t.id}
              to="/vocab/$levelId/$topicId"
              params={{ levelId: level.id, topicId: t.id }}
              className="card row-card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <span className="row-main" style={{ display: "grid", gap: "0.25rem" }}>
                <strong>{t.title}</strong>
                <span className="muted">{t.blurb}</span>
              </span>
              <span className="status-cell">
                {best?.quiz && <span className="status-done">Best quiz {Math.round(best.quiz.bestScore * 100)}%</span>}
                {best?.gap && <span className="status-done">Best gap-fill {Math.round(best.gap.bestScore * 100)}%</span>}
                {!best?.quiz && !best?.gap && <span className="status-todo">Incomplete</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
