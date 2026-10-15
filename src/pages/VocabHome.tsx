import { Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { LevelIcon } from "@/components/LevelIcon";
import { ProgressRing } from "@/components/ProgressRing";
import { VOCAB_LEVELS } from "@/content/vocab";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { topicsDone } from "@/lib/vocab-progress";

export function VocabHome() {
  const { progress } = useVocabProgress();
  return (
    <>
    <Hero first="Learn Yoruba words," second="topic by topic" />
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <div className="rise-in" style={{ display: "grid", gap: "0.75rem" }}>
        {VOCAB_LEVELS.map((lv) =>
          lv.topics.length === 0 ? (
            <div
              key={lv.id}
              className="card"
              style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}
            >
              <strong>{lv.title}</strong>
              <span className="muted">Coming soon</span>
            </div>
          ) : (
            <Link
              key={lv.id}
              to="/vocab/$levelId"
              params={{ levelId: lv.id }}
              className="card"
              style={{ display: "flex", gap: "1rem", alignItems: "center", textDecoration: "none", color: "var(--text)" }}
            >
              <LevelIcon level={lv.id} />
              <strong style={{ flex: 1 }}>{lv.title}</strong>
              <ProgressRing
                done={topicsDone(progress, lv.topics.map((t) => t.id))}
                total={lv.topics.length}
                unit="topics"
              />
            </Link>
          ),
        )}
      </div>
    </main>
    </>
  );
}
