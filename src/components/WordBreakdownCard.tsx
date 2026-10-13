import { useState } from "react";
import type { Rule, WordBreakdown } from "@/content/types";
import { hasConstruction } from "@/lib/construction";
import { SHOW_REVIEW_MARKERS } from "@/lib/flags";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";

type Props = { word: WordBreakdown; rules: Rule[]; showReviewMarker?: boolean };

export function WordBreakdownCard({ word, rules, showReviewMarker = SHOW_REVIEW_MARKERS }: Props) {
  const [shown, setShown] = useState(0);
  const total = word.steps.length;
  const finished = shown >= total;
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
      <article className="card" style={{ display: "grid", gap: "0.75rem" }}>
        {header}
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div className="yo"><strong>{word.surface}</strong></div>
          <PitchLine word={word.surface} />
          <AudioButton text={word.surface} />
        </div>
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

      {total > 0 && (
        <>
          <ol className="steps" aria-live="polite">
            {word.steps.slice(0, shown).map((s, i) => (
              <li key={i}>
                <span aria-hidden="true">→ </span>
                <span className="yo">{s.result}</span>
                <span className="muted" style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
                  {s.kind === "join" ? "Join the parts" : ruleTitle(s.ruleId)}
                </span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setShown((n) => Math.min(n + 1, total))} disabled={finished}>
              Next step
            </button>
            <button className="btn" onClick={() => setShown(total)} disabled={finished}>Show all</button>
            <button className="btn" onClick={() => setShown(0)} disabled={shown === 0}>Reset</button>
          </div>
        </>
      )}

      {finished && (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div className="yo"><strong>{word.surface}</strong></div>
          <PitchLine word={word.surface} />
          <AudioButton text={word.surface} />
        </div>
      )}
    </article>
  );
}
