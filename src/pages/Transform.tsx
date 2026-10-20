import { useLayoutEffect, useRef, useState } from "react";
import { Hero } from "@/components/Hero";
import { YorubaKeys } from "@/components/YorubaKeys";
import { useStats } from "@/hooks/useStats";
import { INSTRUCTIONS, TRANSFORMS, type Transform as Item } from "@/content/transforms";
import { insertChar } from "@/lib/insert-char";
import { recordTransformResult } from "@/lib/stats";
import { gradeTransform, type TransformMode, type TransformResult } from "@/lib/transform-grade";

const MESSAGE: Record<TransformResult, string> = {
  right: "Correct.",
  close: "Right words, check the dots and tones.",
  wrong: "Not quite.",
};

export function Transform({ items = TRANSFORMS }: { items?: Item[] }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<TransformMode>("easy");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, { given: string; result: TransformResult }>>({});
  const { update: updateStats } = useStats();
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caretRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  });

  const item = items[index];
  if (!item) {
    return (
      <>
        <Hero first="Transform sentences," second="form by form" />
        <main className="page" style={{ display: "grid", gap: "1rem" }}>
          <p className="muted">No sentences yet. Check back soon.</p>
        </main>
      </>
    );
  }

  const done = checked[item.id];
  const value = done ? done.given : drafts[item.id] ?? "";

  function check() {
    if (!item || done || !value.trim()) return;
    const result = gradeTransform(value, item.answers, mode);
    setChecked((c) => ({ ...c, [item.id]: { given: value, result } }));
    updateStats((st) => recordTransformResult(st, item.id, item.kind, mode, result));
  }

  function insert(ch: string) {
    if (!item || done) return;
    const el = inputRef.current;
    const r = insertChar(value, el?.selectionStart ?? value.length, ch);
    caretRef.current = r.caret;
    setDrafts((d) => ({ ...d, [item.id]: r.value }));
    el?.focus();
  }

  return (
    <>
      <Hero first="Transform sentences," second="form by form" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <div className="transform-bar">
          <p className="muted" data-testid="transform-position" style={{ margin: 0 }}>
            Sentence {index + 1} of {items.length}
          </p>
          <div className="transform-modes" role="group" aria-label="Mode">
            {(["easy", "advanced"] as const).map((m) => (
              <button key={m} type="button" className="btn" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m === "easy" ? "Easy" : "Advanced"}
              </button>
            ))}
          </div>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {mode === "easy" ? "Easy: dots and tone marks are optional." : "Advanced: dots and tone marks must be exact."}
        </p>
        <section className="card transform-card" data-testid="transform-card" key={item.id}>
          <p className="yo transform-base">{item.base}</p>
          <p className="muted" style={{ margin: 0 }}>{item.baseEnglish}</p>
          <p style={{ margin: 0 }}><strong>{INSTRUCTIONS[item.kind]}</strong></p>
          <input
            ref={inputRef}
            className="transform-input yo"
            data-testid="transform-input"
            type="text"
            lang="yo"
            aria-label="Your answer"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            disabled={!!done}
            onChange={(e) => setDrafts((d) => ({ ...d, [item.id]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
          />
          <YorubaKeys onInsert={insert} disabled={!!done} />
          {!done && (
            <button type="button" className="btn btn-primary" onClick={check}>Check</button>
          )}
          {done && (
            <div className="transform-reveal" data-testid="transform-reveal">
              <p data-testid="transform-result" role="status" style={{ margin: 0 }}>
                <strong>{MESSAGE[done.result]}</strong>
              </p>
              {done.result !== "right" && (
                <p style={{ margin: 0 }}><span className="muted">Your answer </span><span className="yo">{done.given}</span></p>
              )}
              <p style={{ margin: 0 }}><span className="muted">Model answer </span><strong className="yo">{item.answers[0]}</strong></p>
              {item.answers.length > 1 && (
                <p style={{ margin: 0 }}><span className="muted">Also accepted </span><span className="yo">{item.answers.slice(1).join(", ")}</span></p>
              )}
              <p style={{ margin: 0 }}>{item.rule}</p>
            </div>
          )}
        </section>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
          <button className="btn" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</button>
          <button className="btn btn-primary" disabled={!done || index === items.length - 1} onClick={() => setIndex(index + 1)}>Next</button>
        </div>
      </main>
    </>
  );
}
