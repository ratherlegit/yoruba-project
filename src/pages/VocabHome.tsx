import { Link } from "@tanstack/react-router";
import { ProgressRing } from "@/components/ProgressRing";
import { VOCAB_LEVELS } from "@/content/vocab";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { topicsDone } from "@/lib/vocab-progress";

export function VocabHome() {
  const { progress } = useVocabProgress();
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>Learn Yoruba words</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Common words grouped by topic. Study the flashcards, then test yourself with a quiz or gap fill.
      </p>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {VOCAB_LEVELS.map((lv) => (
          <Link
            key={lv.id}
            to="/vocab/$levelId"
            params={{ levelId: lv.id }}
            className="card"
            style={{ display: "flex", gap: "1rem", alignItems: "center", textDecoration: "none", color: "var(--text)" }}
          >
            <ProgressRing
              done={topicsDone(progress, lv.topics.map((t) => t.id))}
              total={lv.topics.length}
              unit="topics"
            />
            <strong>{lv.title}</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
