import { useMemo, useState } from "react";
import { useStats } from "@/hooks/useStats";
import { audioUrlFor } from "@/lib/audio";
import { playClip } from "@/lib/clip";
import { recordToneAnswer } from "@/lib/stats";
import { buildToneRound, type ToneMode, type ToneSources } from "@/lib/tone-practice";
import { AudioButton } from "./AudioButton";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { PitchLine } from "./PitchLine";

const MODES: { id: ToneMode; label: string }[] = [
  { id: "words", label: "Words" },
  { id: "sentences", label: "Sentences" },
  { id: "sounds", label: "Sounds" },
];

export function TonePractice({ sources }: { sources: ToneSources }) {
  const [mode, setMode] = useState<ToneMode>("words");
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { update: updateStats } = useStats();
  const questions = useMemo(() => buildToneRound(mode, sources, `tone#${mode}#${attempt}`), [mode, sources, attempt]);

  const restart = () => { setAttempt((a) => a + 1); setIndex(0); setScore(0); setChosen(null); };
  const switcher = (
    <div role="group" aria-label="Mode" style={{ display: "flex", gap: "0.5rem" }}>
      {MODES.map((m) => (
        <button key={m.id} className="btn" aria-pressed={mode === m.id} onClick={() => { if (m.id !== mode) { setMode(m.id); restart(); } }}>{m.label}</button>
      ))}
    </div>
  );

  if (questions.length === 0) {
    return (
      <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
        {switcher}
        <p className="muted" style={{ margin: 0 }}>Listening practice needs audio, which is still being added. Check back soon.</p>
      </section>
    );
  }
  if (index >= questions.length) {
    return (
      <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
        {switcher}
        <p className="yo" style={{ margin: 0 }}>You got {score} of {questions.length} right.</p>
        <div><button className="btn" onClick={restart}>Try again</button></div>
      </section>
    );
  }

  const q = questions[index]!;
  const sentences = q.mode === "sentences";
  const answered = chosen !== null;
  return (
    <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
      {switcher}
      <p className="muted" style={{ margin: 0 }}>Question {index + 1} of {questions.length}</p>
      <div className="with-audio">
        <span>{sentences ? "Listen to the sentence, then pick the word that fills the gap." : "Listen, then pick the word you heard."}</span>
        <AudioButton text={q.audioText} label={sentences ? "Play the sentence" : "Play the word"} />
      </div>
      {sentences && (
        <div>
          <p className="yo" style={{ margin: 0 }}>{answered ? q.sentence : q.prompt}</p>
          <p className="muted" style={{ margin: 0 }}>{q.english}</p>
        </div>
      )}
      <ChoiceQuestion
        key={q.id}
        prompt={sentences ? "Which word fills the gap?" : "Which word did you hear?"}
        choices={q.choices}
        chosen={chosen}
        correct={q.answer}
        onChoose={(c) => {
          setChosen(c);
          if (c === q.answer) setScore((s) => s + 1);
          updateStats((st) => recordToneAnswer(st, mode, c === q.answer));
          const url = audioUrlFor(q.audioText);
          if (url) playClip(url);
        }}
      />
      {answered && (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div className="with-audio">
            <span className="yo"><strong>{q.answer}</strong></span>
            <AudioButton text={q.audioText} label="Listen again" />
          </div>
          <PitchLine word={q.answer} />
          {chosen !== q.answer && (
            <div>
              <div className="with-audio">
                <span className="muted">You chose {chosen}</span>
                <AudioButton text={chosen!} label={`Listen to ${chosen}`} />
              </div>
              <PitchLine word={chosen!} />
            </div>
          )}
          <div>
            <button className="btn btn-primary" onClick={() => { setIndex((i) => i + 1); setChosen(null); }}>
              {index + 1 === questions.length ? "See score" : "Next"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
