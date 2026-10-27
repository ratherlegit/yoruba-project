import type { Rule, WordBreakdown } from "@/content/types";
import { hasConstruction } from "@/lib/construction";
import { SHOW_REVIEW_MARKERS } from "@/lib/flags";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";

type Props = { word: WordBreakdown; rules: Rule[]; showReviewMarker?: boolean };

export function WordBreakdownCard({ word, rules, showReviewMarker = SHOW_REVIEW_MARKERS }: Props) {
  const ruleTitle = (id?: string) => rules.find((r) => r.id === id)?.title;

  const header = (
    <header style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <strong>{word.english}</strong>
      {showReviewMarker && word.confidence === "needs-review" && (
        <span className="review-marker" title={word.note}>pending review</span>
      )}
    </header>
  );

  if (!hasConstruction(word)) {
    return (
      <article className="card word-compact">
        <div className="with-audio">
          <div className="yo"><strong>{word.surface}</strong></div>
          <span className="muted">{word.english}</span>
          {showReviewMarker && word.confidence === "needs-review" && (
            <span className="review-marker" title={word.note}>pending review</span>
          )}
          <span className="word-audio"><AudioButton text={word.surface} /></span>
        </div>
        <PitchLine word={word.surface} />
      </article>
    );
  }

  return (
    <article className="card" style={{ display: "grid", gap: "0.75rem" }}>
      {header}

      <div className="parts" aria-label="Components">
        {word.parts.map((p, i) => (
          <div key={i} className="part-tile">
            <span className="yo">{p.text}</span>
            <span className="muted" style={{ fontSize: "0.85rem" }}>{p.gloss}</span>
            <span className="muted" style={{ fontSize: "0.75rem" }}>{p.role}</span>
          </div>
        ))}
      </div>

      {word.steps.length > 0 && (
        <ol className="steps">
          {word.steps.map((s, i) => (
            <li key={i}>
              <span aria-hidden="true">→ </span>
              <span className="yo">{s.result}</span>
              <span className="muted" style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
                {s.kind === "join" ? "Parts joined (illustration only, not the final word)" : ruleTitle(s.ruleId)}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <div className="with-audio">
          <div className="yo"><strong>{word.surface}</strong></div>
          <AudioButton text={word.surface} />
        </div>
        <PitchLine word={word.surface} />
      </div>
    </article>
  );
}
