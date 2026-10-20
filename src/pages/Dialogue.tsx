import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AudioButton } from "@/components/AudioButton";
import { ChoiceQuestion } from "@/components/ChoiceQuestion";
import { DIALOGUES, SITUATIONS } from "@/content/dialogues";
import { LEVELS } from "@/content/levels";
import { audioUrlFor } from "@/lib/audio";
import { stopClip } from "@/lib/clip";
import { playSequence } from "@/lib/play-sequence";

export function Dialogue() {
  const { dialogueId } = useParams({ strict: false }) as { dialogueId: string };
  const dialogue = DIALOGUES.find((d) => d.id === dialogueId);
  const [showEnglish, setShowEnglish] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Leaving the page stops a conversation that is still playing.
  useEffect(() => () => stopClip(), []);

  if (!dialogue) {
    return (
      <main className="page">
        <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
          <h1 style={{ margin: 0 }}>We couldn't find that conversation</h1>
          <p className="muted" style={{ margin: 0 }}>The link may be old or mistyped.</p>
          <Link className="btn btn-primary" to="/dialogues">Back to Dialogues</Link>
        </div>
      </main>
    );
  }

  const level = LEVELS.find((l) => l.id === dialogue.level);
  const situation = SITUATIONS.find((s) => s.id === dialogue.situationId);
  const anyClip = dialogue.lines.some((l) => audioUrlFor(l.yoruba, l.voice));
  const answered = Object.keys(answers).length;
  const right = dialogue.questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/dialogues" className="muted">Back to Dialogues</Link>
      <div style={{ display: "grid", gap: "0.3rem" }}>
        <h1 style={{ margin: 0 }}>{dialogue.title}</h1>
        <p className="muted" style={{ margin: 0 }}>{level?.title}: {situation?.title}</p>
      </div>
      <p style={{ margin: 0 }}>{dialogue.setting}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        {anyClip && (
          <button className="btn btn-primary" onClick={() => void playSequence(dialogue.lines.map((l) => ({ text: l.yoruba, voice: l.voice })))}>
            Play all
          </button>
        )}
        <button className="btn" onClick={() => setShowEnglish((v) => !v)}>{showEnglish ? "Hide English" : "Show English"}</button>
      </div>
      <ol className="dlg-lines">
        {dialogue.lines.map((l, i) => (
          <li key={i} className={`dlg-line dlg-${l.voice}`} data-testid="dialogue-line">
            <span className="dlg-speaker">{l.speaker}</span>
            <span className="dlg-row">
              <span className="dlg-text">
                <span className="yo">{l.yoruba}</span>
                {showEnglish && <span className="muted" data-testid="dialogue-english">{l.english}</span>}
              </span>
              <AudioButton text={l.yoruba} voice={l.voice} />
            </span>
          </li>
        ))}
      </ol>
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Check yourself</h2>
        {dialogue.questions.map((q, i) => (
          <ChoiceQuestion
            key={`${dialogue.id}:${i}`}
            prompt={q.prompt}
            choices={q.choices}
            chosen={answers[i] ?? null}
            correct={q.answer}
            onChoose={(c) => setAnswers((a) => ({ ...a, [i]: c }))}
          />
        ))}
        {answered === dialogue.questions.length && (
          <p style={{ margin: 0 }}><strong>You got {right} of {dialogue.questions.length} right.</strong></p>
        )}
      </section>
    </main>
  );
}
