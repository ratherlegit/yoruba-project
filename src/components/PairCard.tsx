import type { MinimalPair } from "@/content/sounds";
import { audioUrlFor } from "@/lib/audio";
import { playSequence } from "@/lib/play-sequence";
import { AudioButton } from "./AudioButton";

export function PairCard({ pair }: { pair: MinimalPair }) {
  const anyAudio = pair.words.some((w) => audioUrlFor(w.yoruba));
  return (
    <article className="card" data-testid={`pair-${pair.id}`} style={{ display: "grid", gap: "0.5rem" }}>
      <p style={{ margin: 0 }}>{pair.explain}</p>
      <ul className="sound-examples">
        {pair.words.map((w) => (
          <li key={w.yoruba} className="sound-row">
            <span className="sound-word">
              <span className="yo"><strong>{w.yoruba}</strong></span>{" "}
              <span className="muted">{w.english}</span>
            </span>
            <AudioButton text={w.yoruba} />
          </li>
        ))}
      </ul>
      {anyAudio && (
        <div>
          <button className="btn" onClick={() => void playSequence(pair.words.map((w) => w.yoruba))}>Play all</button>
        </div>
      )}
    </article>
  );
}
