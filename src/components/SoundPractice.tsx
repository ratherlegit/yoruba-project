import { useMemo, useState } from "react";
import type { MinimalPair } from "@/content/sounds";
import { buildPractice } from "@/lib/sound-practice";
import { AudioButton } from "./AudioButton";
import { ChoiceQuestion } from "./ChoiceQuestion";

export function SoundPractice({ pairs }: { pairs: MinimalPair[] }) {
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const questions = useMemo(() => buildPractice(pairs, `sounds#${attempt}`), [pairs, attempt]);

  if (questions.length === 0) {
    return <p className="muted" data-testid="practice">Listening practice needs audio, which is still being added. Check back soon.</p>;
  }
  const done = index >= questions.length;
  if (done) {
    return (
      <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
        <p className="yo" style={{ margin: 0 }}>You got {score} of {questions.length} right.</p>
        <div>
          <button className="btn" onClick={() => { setAttempt((a) => a + 1); setIndex(0); setScore(0); setChosen(null); }}>Try again</button>
        </div>
      </section>
    );
  }
  const q = questions[index]!;
  return (
    <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
      <p className="muted" style={{ margin: 0 }}>Question {index + 1} of {questions.length}</p>
      <div className="with-audio">
        <span>Listen, then pick the word you heard.</span>
        <AudioButton text={q.audioText} label="Play the word" />
      </div>
      <ChoiceQuestion
        key={q.id}
        prompt="Which word did you hear?"
        choices={q.choices}
        chosen={chosen}
        correct={q.answer}
        onChoose={(c) => { setChosen(c); if (c === q.answer) setScore((s) => s + 1); }}
      />
      {chosen !== null && (
        <div>
          <button className="btn btn-primary" onClick={() => { setIndex((i) => i + 1); setChosen(null); }}>
            {index + 1 === questions.length ? "See score" : "Next"}
          </button>
        </div>
      )}
    </section>
  );
}
