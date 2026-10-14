import { Link } from "@tanstack/react-router";

type Props = {
  correct: number;
  total: number;
  missedCount: number;
  onRetryMissed: () => void;
  onTryAgain: () => void;
  onFlashcards: () => void;
  next: { levelId: string; topicId: string } | null;
  levelId: string;
};

export function VocabResults({ correct, total, missedCount, onRetryMissed, onTryAgain, onFlashcards, next, levelId }: Props) {
  return (
    <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <h2 style={{ margin: 0 }}>Results</h2>
      <p className="yo" style={{ margin: 0 }}>You got {correct} of {total} right.</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {missedCount > 0 && (
          <button className="btn btn-primary" onClick={onRetryMissed}>
            Retry the {missedCount} you missed
          </button>
        )}
        <button className="btn" onClick={onTryAgain}>Try again</button>
        <button className="btn" onClick={onFlashcards}>Back to flashcards</button>
        {next ? (
          <Link className="btn" to="/vocab/$levelId/$topicId" params={{ levelId: next.levelId, topicId: next.topicId }}>
            Next topic
          </Link>
        ) : (
          <Link className="btn" to="/vocab/$levelId" params={{ levelId }}>Back to level</Link>
        )}
      </div>
    </section>
  );
}
