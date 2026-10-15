import type { Sound } from "@/content/sounds";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";
import { ToneChip } from "./ToneChip";

export function SoundCard({ sound }: { sound: Sound }) {
  return (
    <article className="card sound-card" data-testid={`sound-${sound.id}`}>
      <div className="sound-head">
        {sound.tone ? (
          <>
            <span className="sound-letter yo" aria-hidden="true">{sound.letter}</span>
            <h3 style={{ margin: 0 }}>{`${sound.tone[0]!.toUpperCase()}${sound.tone.slice(1)} tone`}</h3>
          </>
        ) : (
          <h3 className="sound-letter yo" style={{ margin: 0 }}>{sound.letter}</h3>
        )}
        <p className="muted" style={{ margin: 0 }}>{sound.compare}</p>
        {sound.tone && <ToneChip tone={sound.tone} />}
      </div>
      <ul className="sound-examples" role="list">
        {sound.examples.map((e) => (
          <li key={e.yoruba}>
            <div className="sound-row">
              <span className="sound-word">
                <span className="yo"><strong>{e.yoruba}</strong></span>{" "}
                <span className="muted">{e.english}</span>
              </span>
              <AudioButton text={e.yoruba} />
            </div>
            {sound.section === "tones" && <PitchLine word={e.yoruba} />}
          </li>
        ))}
      </ul>
    </article>
  );
}
