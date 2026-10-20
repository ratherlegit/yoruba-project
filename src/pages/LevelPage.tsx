import { LevelIcon } from "@/components/LevelIcon";
import { Link, useParams } from "@tanstack/react-router";
import { LockedLevel } from "@/components/LockedLevel";
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
    return <LockedLevel levelTitle={level.title} prevTitle={prev.title} />;
  }

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/grammar">All levels</Link>
      <div className="level-head"><LevelIcon level={level.id} size="lg" /><h1 style={{ margin: 0 }}>{level.title}</h1></div>
      <p className="muted" style={{ margin: 0 }}>{level.summary}</p>
      {level.lessons.length === 0 && <p className="muted">Lessons for this level are on the way.</p>}
      <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
        {level.lessons.map((ls, n) => {
          const done = progress.completedLessons[ls.id];
          return (
            <Link
              key={ls.id}
              to="/lesson/$levelId/$lessonId"
              params={{ levelId: level.id, lessonId: ls.id }}
              className="card row-card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <strong className="row-main">Lesson {n + 1}: {ls.title}</strong>
              <span className="status-cell">
                {done
                  ? <span className="status-done">Best {Math.round(done.bestScore * 100)}%</span>
                  : <span className="status-todo">Incomplete</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
