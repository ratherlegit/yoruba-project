import { useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Activity, type ActivityResult } from "@/components/Activity";
import { Flashcards } from "@/components/Flashcards";
import { NotFound } from "@/components/NotFound";
import { VocabResults } from "@/components/VocabResults";
import type { Question } from "@/content/types";
import { getVocabLevel, getVocabTopic, nextVocabTopicPath } from "@/content/vocab";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { buildGap, buildQuiz } from "@/lib/vocab-questions";
import { recordVocabCompletion } from "@/lib/vocab-progress";

type Mode = "flashcards" | "quiz" | "gap";
const MODES: { id: Mode; label: string }[] = [
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz", label: "Quiz" },
  { id: "gap", label: "Gap fill" },
];

// Keyed by topic so moving to the next topic resets mode, attempt and results.
export function VocabTopicPage() {
  const { levelId, topicId } = useParams({ strict: false }) as { levelId: string; topicId: string };
  return <TopicView key={`${levelId}/${topicId}`} levelId={levelId} topicId={topicId} />;
}

function TopicView({ levelId, topicId }: { levelId: string; topicId: string }) {
  const { update, loaded } = useVocabProgress();
  const [mode, setMode] = useState<Mode>("flashcards");
  const [attempt, setAttempt] = useState(0);
  const [retry, setRetry] = useState<Question[] | null>(null);
  const [result, setResult] = useState<ActivityResult | null>(null);

  const level = getVocabLevel(levelId);
  const topic = getVocabTopic(levelId, topicId);
  const seed = `${topicId}#${attempt}`;
  const questions = useMemo(() => {
    if (!topic || mode === "flashcards") return [];
    return mode === "quiz" ? buildQuiz(topic, seed) : buildGap(topic, seed);
  }, [topic, mode, seed]);

  if (!level || !topic) return <NotFound what="topic" />;
  if (!loaded) return <main className="page" aria-busy="true" />;

  const t = topic;
  function chooseMode(m: Mode) {
    setMode(m);
    setAttempt(0);
    setRetry(null);
    setResult(null);
  }
  function finish(r: ActivityResult) {
    // Only a full run counts. Retrying the missed questions never records.
    if (retry === null && mode !== "flashcards") {
      update((p) => recordVocabCompletion(p, t.id, mode, r.correct / r.total));
    }
    setResult(r);
  }

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/vocab/$levelId" params={{ levelId: level.id }}>Back to level</Link>
      <h1 style={{ margin: 0 }}>{topic.title}</h1>
      <p className="muted" style={{ margin: 0 }}>{topic.blurb}</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button key={m.id} className="btn" aria-pressed={mode === m.id} onClick={() => chooseMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === "flashcards" && <Flashcards words={topic.words} />}

      {mode !== "flashcards" && !result && (
        <Activity key={`${mode}-${attempt}-${retry ? "r" : "f"}`} questions={retry ?? questions} onDone={finish} />
      )}

      {mode !== "flashcards" && result && (
        <VocabResults
          correct={result.correct}
          total={result.total}
          missedCount={result.missed.length}
          levelId={level.id}
          next={nextVocabTopicPath(level.id, topic.id)}
          onRetryMissed={() => {
            setRetry(result.missed);
            setResult(null);
          }}
          onTryAgain={() => {
            setAttempt((a) => a + 1);
            setRetry(null);
            setResult(null);
          }}
          onFlashcards={() => chooseMode("flashcards")}
        />
      )}
    </main>
  );
}
