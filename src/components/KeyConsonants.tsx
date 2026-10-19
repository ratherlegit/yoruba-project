import type { ConsonantFocus, ConsonantSet } from "@/content/sound-focus";
import type { Sound } from "@/content/sounds";
import { audioUrlFor } from "@/lib/audio";
import { playSequence } from "@/lib/play-sequence";
import { AudioButton } from "./AudioButton";

const CARDS: { key: ConsonantFocus; title: string; soundIds: string[] }[] = [
  { key: "gb", title: "gb", soundIds: ["c-gb"] },
  { key: "p", title: "p", soundIds: ["c-p"] },
  { key: "s-sh", title: "s versus ṣ".normalize("NFC"), soundIds: ["c-s", "c-sh"] },
];

export function KeyConsonants({ sounds, sets }: { sounds: Sound[]; sets: ConsonantSet[] }) {
  return (
    <div className="sound-grid key-grid">
      {CARDS.map((card) => (
        <article key={card.key} className="card" data-testid={`key-${card.key}`} style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}>
          <h3 className="yo" style={{ margin: 0 }}>{card.title}</h3>
          {card.soundIds.map((id) => sounds.find((s) => s.id === id)).filter((s): s is Sound => !!s).map((s) => (
            <p key={s.id} className="muted" style={{ margin: 0 }}><span className="yo"><strong>{s.letter}</strong></span>: {s.compare}</p>
          ))}
          {sets.filter((x) => x.focus.includes(card.key)).map((x) => (
            <div key={x.id} className="key-set">
              <p style={{ margin: 0 }}>{x.explain}</p>
              <ul className="sound-examples" role="list">
                {x.words.map((w) => (
                  <li key={w.yoruba} className="sound-row">
                    <span className="sound-word">
                      <span className="yo"><strong>{w.yoruba}</strong></span>{" "}
                      <span className="muted">{w.english}</span>
                    </span>
                    <AudioButton text={w.yoruba} />
                  </li>
                ))}
              </ul>
              {x.words.some((w) => audioUrlFor(w.yoruba)) && (
                <div><button className="btn" onClick={() => void playSequence(x.words.map((w) => w.yoruba))}>Play all</button></div>
              )}
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
