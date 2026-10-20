import { Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { LevelIcon } from "@/components/LevelIcon";
import { ProgressRing } from "@/components/ProgressRing";
import { LEVELS } from "@/content/levels";
import { useProgress } from "@/hooks/useProgress";
import { isLevelUnlocked } from "@/lib/progress";

export function Grammar() {
  const { progress, update, loaded } = useProgress();
  return (
    <>
    <Hero first="Learn Yoruba grammar," second="level by level" />
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <label style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={progress.skipAhead}
          onChange={(e) => update((p) => ({ ...p, skipAhead: e.target.checked }))}
        />
        Unlock all levels
      </label>
      <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
        {LEVELS.map((lv) => {
          // Until saved progress has loaded, do not present any level as locked.
          const unlocked = !loaded || isLevelUnlocked(LEVELS, progress, lv.id);
          const done = lv.lessons.filter((l) => progress.completedLessons[l.id]).length;
          return (
            <Link
              key={lv.id}
              to="/level/$levelId"
              params={{ levelId: lv.id }}
              className="card"
              style={{ display: "flex", gap: "1rem", alignItems: "center", textDecoration: "none", color: "var(--text)", borderStyle: unlocked ? "solid" : "dashed" }}
            >
              <LevelIcon level={lv.id} />
              <span style={{ display: "grid", flex: 1 }}>
                <strong>{lv.title}</strong>
                <span className="muted">{lv.summary}</span>
                {!unlocked && <span className="muted" style={{ fontSize: "0.85rem" }}>Locked</span>}
              </span>
              <ProgressRing done={done} total={lv.lessons.length} />
            </Link>
          );
        })}
      </div>
    </main>
    </>
  );
}
