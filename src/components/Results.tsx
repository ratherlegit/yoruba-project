import { Link } from "@tanstack/react-router";
import { ResultsBanner } from "./ResultsBanner";

type Props = {
  correct: number;
  total: number;
  missedCount: number;
  onRetryMissed: () => void;
  onReviewInstructions: () => void;
  next: { levelId: string; lessonId: string } | null;
  levelId: string;
  nextLockedAfter?: string | null;
};

export function Results({ correct, total, missedCount, onRetryMissed, onReviewInstructions, next, levelId, nextLockedAfter }: Props) {
  return (
    <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <h2 style={{ margin: 0 }}>Results</h2>
      <ResultsBanner correct={correct} total={total} />
      <p className="yo results-line">You got {correct} of {total} right.</p>
      {nextLockedAfter && (
        <p className="muted" style={{ margin: 0 }}>The next level opens after you finish every lesson in {nextLockedAfter}.</p>
      )}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {missedCount > 0 && (
          <button className="btn btn-primary" onClick={onRetryMissed}>
            Retry the {missedCount} you missed
          </button>
        )}
        <button className="btn" onClick={onReviewInstructions}>Review instructions</button>
        {next ? (
          <Link className="btn" to="/lesson/$levelId/$lessonId" params={{ levelId: next.levelId, lessonId: next.lessonId }}>
            Next lesson
          </Link>
        ) : (
          <Link className="btn" to="/level/$levelId" params={{ levelId }}>Back to level</Link>
        )}
      </div>
    </section>
  );
}
