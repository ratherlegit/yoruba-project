import { useMemo, useState } from "react";
import { seededShuffleAvoiding } from "@/lib/shuffle";

type Props = {
  english: string;
  words: string[];
  answer: string[];
  seed: string;
  disabled: boolean;
  onSubmit: (sentence: string) => void;
};

export function OrderQuestion({ english, words, answer, seed, disabled, onSubmit }: Props) {
  const bank = useMemo(
    () => seededShuffleAvoiding(words.map((w, i) => ({ w, i })), seed, answer.map((a) => a.toLowerCase()), (b) => b.w.toLowerCase()),
    [words, seed, answer],
  );
  const [placed, setPlaced] = useState<number[]>([]);

  const remaining = bank.filter((b) => !placed.includes(b.i));
  const sentence = placed.map((i) => words[i]!).join(" ");

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <p style={{ margin: 0 }}>Put these words in order: <strong>{english}</strong></p>
      <div className="card yo" style={{ minHeight: "3.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }} aria-label="Your sentence">
        {placed.map((i) => (
          <button
            key={i}
            className="btn yo"
            aria-label={`Remove ${words[i]!.toLowerCase()}`}
            disabled={disabled}
            onClick={() => setPlaced((p) => p.filter((x) => x !== i))}
          >
            {words[i]!.toLowerCase()}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {remaining.map((b) => (
          <button
            key={b.i}
            className="btn yo"
            data-testid="bank-word"
            disabled={disabled}
            onClick={() => setPlaced((p) => [...p, b.i])}
          >
            {b.w.toLowerCase()}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary"
        disabled={disabled || placed.length !== words.length}
        onClick={() => onSubmit(sentence)}
      >
        Check
      </button>
    </div>
  );
}
