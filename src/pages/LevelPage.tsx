import { Link, useParams } from "@tanstack/react-router";
import { NotFound } from "@/components/NotFound";
import { LEVELS, getLevel } from "@/content/levels";
import { useProgress } from "@/hooks/useProgress";
import { isLevelUnlocked } from "@/lib/progress";

export function LevelPage() {
  const { levelId } = useParams({ strict: false }) as { levelId: string };
  const { progress, loaded } = useProgress();
  const level = getLevel(levelId);
  if (!level) return <NotFound what="level" />;
  // Wait for saved progress so a saved "unlock all" never flashes the locked state.
  if (!loaded) return <main className="page" aria-busy="true" />;

  const idx = LEVELS.findIndex((l) => l.id === level.id);
  if (!isLevelUnlocked(LEVELS, progress, level.id)) {
    const prev = LEVELS[idx - 1]!;
    return (
      <main className="page">
        <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
          <h1 style={{ margin: 0 }}>{level.title} is locked</h1>
          <p style={{ margin: 0 }}>Finish all of {prev.title} to open this level, or turn on "Unlock all levels" on the home page.</p>
          <Link className="btn btn-primary" to="/">Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/">All levels</Link>
      <h1 style={{ margin: 0 }}>{level.title}</h1>
      <p className="muted" style={{ margin: 0 }}>{level.summary}</p>
      {level.lessons.length === 0 && <p className="muted">Lessons for this level are on the way.</p>}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {level.lessons.map((ls, n) => {
          const done = progress.completedLessons[ls.id];
          return (
            <Link
              key={ls.id}
              to="/lesson/$levelId/$lessonId"
              params={{ levelId: level.id, lessonId: ls.id }}
              className="card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <strong>Lesson {n + 1}: {ls.title}</strong>
              {done && <span className="muted"> · best {Math.round(done.bestScore * 100)}%</span>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
