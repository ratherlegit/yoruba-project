import type { Sound } from "@/content/sounds";
import { AudioButton } from "./AudioButton";

export function SoundCard({ sound }: { sound: Sound }) {
  return (
    <article className="card sound-card" data-testid={`sound-${sound.id}`}>
      <div className="sound-head">
        <h3 className="sound-letter yo" style={{ margin: 0 }}>{sound.letter}</h3>
        <p className="muted" style={{ margin: 0 }}>{sound.compare}</p>
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
          </li>
        ))}
      </ul>
    </article>
  );
}
