import type { ToneCompareRow } from "@/content/sound-focus";
import type { Sound } from "@/content/sounds";
import type { Tone } from "@/content/types";
import { audioUrlFor } from "@/lib/audio";
import { playSequence } from "@/lib/play-sequence";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";
import { ToneChip } from "./ToneChip";

const EXPLAIN = (
  "Two marks do two different jobs. A dot under e or o changes the vowel sound (ẹ as in 'bed', ọ as in 'saw'). " +
  "A mark above the vowel changes its pitch: no mark is mid, an acute accent is high, a grave accent is low. " +
  "They are independent, so ẹ, ẹ́ and ẹ̀ are the same vowel at three pitches, and so are ọ, ọ́ and ọ̀. " +
  "In a nasal vowel the mark goes on the vowel, not the n, as in ọ́n."
).normalize("NFC");

// How each tone is said, shown in every cell next to the vowel's own comparison.
const PITCH: Record<Tone, string> = {
  mid: "said at a level, middle pitch (no mark)",
  high: "said at a higher pitch (acute accent)",
  low: "said at a lower pitch (grave accent)",
};
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const LEGEND: { tone: Tone; mark: string }[] = [
  { tone: "mid", mark: "unmarked" },
  { tone: "high", mark: "acute accent" },
  { tone: "low", mark: "grave accent" },
];

export function ToneCompare({ rows, sounds }: { rows: ToneCompareRow[]; sounds: Sound[] }) {
  const hint = (vowel: string) =>
    sounds.find((s) => s.section === "vowels" && s.letter.normalize("NFC") === vowel.normalize("NFC"))?.compare;
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <article className="card" data-testid="tone-explain" style={{ display: "grid", gap: "0.5rem" }}>
        <p style={{ margin: 0 }}>{EXPLAIN}</p>
        <ul className="tone-legend" role="list">
          {LEGEND.map((l) => (
            <li key={l.tone}><ToneChip tone={l.tone} /> <span className="muted">{l.mark}</span></li>
          ))}
        </ul>
      </article>
      {rows.map((row) => {
        const words = row.words.map((w) => w.yoruba);
        return (
          <article key={row.id} className="card tone-row" data-testid={row.id}>
            <div className="tone-row-head">
              <h3 className="sound-letter yo" style={{ margin: 0 }}>{row.vowel}</h3>
              {words.some((w) => audioUrlFor(w)) && (
                <button className="btn" onClick={() => void playSequence(words)}>Play all</button>
              )}
            </div>
            <div className="tone-cells">
              {row.words.map((w) => (
                <div key={w.tone} className="tone-cell" data-testid="tone-cell">
                  <ToneChip tone={w.tone} />
                  <div className="sound-row">
                    <span className="sound-word">
                      <span className="yo"><strong>{w.yoruba}</strong></span>
                      <span className="muted word-gloss" data-testid="word-gloss">{w.english}</span>
                    </span>
                    <AudioButton text={w.yoruba} />
                  </div>
                  <PitchLine word={w.yoruba} />
                  <p className="muted tone-desc" data-testid="tone-desc">
                    {capital(hint(row.vowel) ? `${hint(row.vowel)}, ${PITCH[w.tone]}.` : `${PITCH[w.tone]}.`)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
