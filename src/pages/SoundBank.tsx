import { Hero } from "@/components/Hero";
import { KeyConsonants } from "@/components/KeyConsonants";
import { PairCard } from "@/components/PairCard";
import { SoundCard } from "@/components/SoundCard";
import { ToneCompare } from "@/components/ToneCompare";
import { TonePractice } from "@/components/TonePractice";
import { CONSONANT_SETS, TONE_COMPARE } from "@/content/sound-focus";
import { MINIMAL_PAIRS, SOUNDS, soundsBySection } from "@/content/sounds";
import { TONE_TWINS } from "@/content/tone-twins";
import { VOCAB_LEVELS } from "@/content/vocab";

const SECTIONS = ["Tones", "Key consonants", "Minimal pairs", "Letters reference", "Practice"] as const;
const anchor = (name: string) => name.toLowerCase().replace(" ", "-");

// The four sounds that get focused cards; every other consonant stays in the collapsed reference.
const KEY_IDS = new Set(["c-gb", "c-p", "c-s", "c-sh"]);
const PRACTICE_SOURCES = { pairs: MINIMAL_PAIRS, twins: TONE_TWINS, vocab: VOCAB_LEVELS, sets: CONSONANT_SETS };

export function SoundBank() {
  return (
    <>
      <Hero first="Sound Bank," second="hear every sound" wide />
      <main className="page page-wide" style={{ display: "grid", gap: "1.5rem" }}>
        <nav aria-label="Sections" className="jump-bar">
          {SECTIONS.map((name) => <a key={name} href={`#${anchor(name)}`}>{name}</a>)}
        </nav>
        <section id="tones" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Tones</h2>
          <ToneCompare rows={TONE_COMPARE} sounds={SOUNDS} />
        </section>
        <section id="key-consonants" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Key consonants</h2>
          <p className="muted" style={{ margin: 0 }}>The three sounds worth the most practice. Listen for the difference between the words in each set.</p>
          <KeyConsonants sounds={SOUNDS} sets={CONSONANT_SETS} />
        </section>
        <section id="minimal-pairs" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Minimal pairs</h2>
          <p className="muted" style={{ margin: 0 }}>Words that differ only in one tone or sound. Listen for the difference.</p>
          <div className="sound-grid pairs">{MINIMAL_PAIRS.map((p) => <PairCard key={p.id} pair={p} />)}</div>
        </section>
        <section id="letters-reference" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Letters reference</h2>
          <details className="reference">
            <summary>Show vowels and other consonants</summary>
            <div style={{ display: "grid", gap: "1rem", paddingTop: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>Vowels</h3>
              <div className="sound-grid rise-in">{soundsBySection("vowels").map((s) => <SoundCard key={s.id} sound={s} />)}</div>
              <h3 style={{ margin: 0 }}>Consonants</h3>
              <div className="sound-grid rise-in">
                {soundsBySection("consonants").filter((s) => !KEY_IDS.has(s.id)).map((s) => <SoundCard key={s.id} sound={s} />)}
              </div>
            </div>
          </details>
        </section>
        <section id="practice" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Practice</h2>
          <div className="practice-wrap"><TonePractice sources={PRACTICE_SOURCES} /></div>
        </section>
      </main>
    </>
  );
}
