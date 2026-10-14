import { useEffect, useRef, useState } from "react";
import type { VocabWord } from "@/content/vocab/types";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";

export function Flashcards({ words }: { words: VocabWord[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const backRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (flipped) backRef.current?.focus();
  }, [flipped]);
  const w = words[i]!;
  const go = (n: number) => {
    setI(n);
    setFlipped(false);
  };
  return (
    <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <p className="muted" style={{ margin: 0 }}>Card {i + 1} of {words.length}</p>
      <p className="yo" style={{ margin: 0, fontSize: "2rem" }} data-testid="flashcard-word">{w.yoruba}</p>
      {!/\s/.test(w.yoruba) && <PitchLine word={w.yoruba} />}
      <div><AudioButton text={w.yoruba} /></div>
      {flipped ? (
        <div ref={backRef} tabIndex={-1} style={{ display: "grid", gap: "0.5rem", outline: "none" }} data-testid="flashcard-back">
          <p style={{ margin: 0 }}><strong>{w.english}</strong> <span className="muted">({w.pos})</span></p>
          <p className="yo" style={{ margin: 0 }}>{w.sentence.yoruba}</p>
          <p className="muted" style={{ margin: 0 }}>{w.sentence.english}</p>
          <div><AudioButton text={w.sentence.yoruba} /></div>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setFlipped(true)}>Flip</button>
      )}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn" disabled={i === 0} onClick={() => go(i - 1)}>Previous</button>
        <button className="btn" disabled={i === words.length - 1} onClick={() => go(i + 1)}>Next</button>
      </div>
    </section>
  );
}
