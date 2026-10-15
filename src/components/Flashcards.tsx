import { useEffect, useRef, useState } from "react";
import type { VocabWord } from "@/content/vocab/types";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";

export function Flashcards({ words }: { words: VocabWord[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState<"next" | "prev" | null>(null);
  const backRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (flipped) backRef.current?.focus();
  }, [flipped]);
  const w = words[i]!;
  const go = (n: number) => {
    setDir(n > i ? "next" : "prev");
    setI(n);
    setFlipped(false);
  };
  return (
    <section className="card card-feature" style={{ display: "grid", gap: "0.75rem" }}>
      <p className="muted" style={{ margin: 0 }}>Card {i + 1} of {words.length}</p>
      <div key={i} className={dir === "next" ? "slide-next" : dir === "prev" ? "slide-prev" : undefined} style={{ display: "grid", gap: "0.75rem" }}>
      <div className="with-audio">
        <p className="yo" style={{ margin: 0, fontSize: "2rem" }} data-testid="flashcard-word">{w.yoruba}</p>
        <AudioButton text={w.yoruba} />
      </div>
      {!/\s/.test(w.yoruba) && <PitchLine word={w.yoruba} />}
      {flipped ? (
        <div ref={backRef} tabIndex={-1} style={{ display: "grid", gap: "0.5rem", outline: "none" }} data-testid="flashcard-back">
          <p style={{ margin: 0 }}><strong>{w.english}</strong> <span className="muted">({w.pos})</span></p>
          <div className="with-audio">
            <p className="yo" style={{ margin: 0 }}>{w.sentence.yoruba}</p>
            <AudioButton text={w.sentence.yoruba} />
          </div>
          <p className="muted" style={{ margin: 0 }}>{w.sentence.english}</p>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setFlipped(true)}>Flip</button>
      )}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn" disabled={i === 0} onClick={() => go(i - 1)}>Previous</button>
        <button className="btn" disabled={i === words.length - 1} onClick={() => go(i + 1)}>Next</button>
      </div>
    </section>
  );
}
