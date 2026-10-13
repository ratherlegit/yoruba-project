import { Link } from "@tanstack/react-router";
import { ProgressRing } from "@/components/ProgressRing";
import { LEVELS } from "@/content/levels";
import { useProgress } from "@/hooks/useProgress";
import { isLevelUnlocked } from "@/lib/progress";

export function Home() {
  const { progress, update, loaded } = useProgress();
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>Learn Yoruba grammar</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Five levels. Every lesson starts with a short guide that shows how words are built, then practice.
      </p>
      <label style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={progress.skipAhead}
          onChange={(e) => update((p) => ({ ...p, skipAhead: e.target.checked }))}
        />
        Unlock all levels
      </label>
      <div style={{ display: "grid", gap: "0.75rem" }}>
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
              <ProgressRing done={done} total={lv.lessons.length} />
              <span style={{ display: "grid" }}>
                <strong>{lv.title}</strong>
                <span className="muted">{lv.summary}</span>
                {!unlocked && <span className="muted" style={{ fontSize: "0.85rem" }}>Locked</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
