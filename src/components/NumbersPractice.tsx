import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { NUMBERS, NUMBER_STEPS, PHRASES } from "@/content/numbers";
import { useStats } from "@/hooks/useStats";
import { audioUrlFor } from "@/lib/audio";
import { insertChar } from "@/lib/insert-char";
import { buildNumbersRound, gradeNumbers, type NumbersQuestion } from "@/lib/numbers-practice";
import { showBuild } from "@/lib/show-build";
import { recordNumbersAnswer, recordNumbersRound } from "@/lib/stats";
import type { TransformMode, TransformResult } from "@/lib/transform-grade";
import { AudioButton } from "./AudioButton";
import { YorubaKeys } from "./YorubaKeys";

const DATA = { entries: NUMBERS, phrases: PHRASES, steps: NUMBER_STEPS };
const MESSAGE: Record<TransformResult, string> = {
  right: "Correct.",
  close: "Right words, check the dots and tones.",
  wrong: "Not quite.",
};
const hasClip = (text: string) => audioUrlFor(text) !== null;

export function NumbersPractice({ stepId }: { stepId: string }) {
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<TransformMode>("easy");
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [done, setDone] = useState<{ given: string; result: TransformResult } | null>(null);
  const [correct, setCorrect] = useState(0);
  const { update: updateStats } = useStats();
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const round: NumbersQuestion[] = useMemo(
    () => buildNumbersRound(stepId, DATA, `${stepId}#${attempt}`, hasClip),
    [stepId, attempt],
  );

  useLayoutEffect(() => {
    if (caretRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  });

  if (round.length === 0) {
    return <p className="muted" style={{ margin: 0 }}>No practice questions for this step yet.</p>;
  }

  if (index >= round.length) {
    return (
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <p className="yo" data-testid="numbers-score" style={{ margin: 0 }}>You got {correct} of {round.length} right.</p>
        <div>
          <button
            className="btn"
            onClick={() => { setAttempt((a) => a + 1); setIndex(0); setValue(""); setDone(null); setCorrect(0); }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const q = round[index]!;
  const last = index === round.length - 1;

  function check() {
    if (done || !value.trim()) return;
    const result = gradeNumbers(value, q, mode);
    setDone({ given: value, result });
    if (result === "right") setCorrect((c) => c + 1);
    updateStats((st) => recordNumbersAnswer(st, q.kind, result === "right"));
  }

  function next() {
    if (last) {
      updateStats((st) => recordNumbersRound(st, stepId, correct / round.length));
    }
    setIndex(index + 1);
    setValue("");
    setDone(null);
  }

  function insert(ch: string) {
    if (done) return;
    const el = inputRef.current;
    const r = insertChar(value, el?.selectionStart ?? value.length, ch);
    caretRef.current = r.caret;
    setValue(r.value);
    el?.focus();
  }

  return (
    <div style={{ display: "grid", gap: "0.9rem" }} key={q.id}>
      <div className="transform-bar">
        <p className="muted" data-testid="numbers-question" style={{ margin: 0 }}>Question {index + 1} of {round.length}</p>
        <div className="transform-modes" role="group" aria-label="Mode">
          {(["easy", "advanced"] as const).map((m) => (
            <button key={m} type="button" className="btn" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "easy" ? "Easy" : "Advanced"}
            </button>
          ))}
        </div>
      </div>
      <div className="with-audio">
        <p style={{ margin: 0 }}><strong>{q.prompt}</strong></p>
        {q.kind === "hear" && q.audioText && <AudioButton text={q.audioText} label="Play the number" />}
      </div>
      <input
        ref={inputRef}
        className="transform-input yo"
        data-testid="numbers-input"
        type="text"
        lang="yo"
        inputMode={q.kind === "to-numeral" || q.kind === "hear" ? "numeric" : "text"}
        aria-label="Your answer"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        disabled={!!done}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") check();
        }}
      />
      <YorubaKeys onInsert={insert} disabled={!!done} />
      {!done && <button type="button" className="btn btn-primary" onClick={check}>Check</button>}
      {done && (
        <div className="transform-reveal" data-testid="numbers-result" role="status">
          <p style={{ margin: 0 }}><strong>{MESSAGE[done.result]}</strong></p>
          {done.result !== "right" && (
            <p style={{ margin: 0 }}><span className="muted">Your answer </span><span className="yo">{done.given}</span></p>
          )}
          <p style={{ margin: 0 }}><span className="muted">Answer </span><strong className="yo">{q.model}</strong></p>
          {q.answers.length > 1 && q.kind === "to-yoruba" && (
            <p style={{ margin: 0 }}><span className="muted">Also accepted </span><span className="yo">{q.answers.filter((a) => a !== q.model).join(", ")}</span></p>
          )}
          {q.build && <p style={{ margin: 0 }}><span className="muted">How it is built </span>{showBuild(q.build)}</p>}
        </div>
      )}
      <div>
        <button className="btn btn-primary" disabled={!done} onClick={next}>{last ? "See score" : "Next"}</button>
      </div>
    </div>
  );
}
