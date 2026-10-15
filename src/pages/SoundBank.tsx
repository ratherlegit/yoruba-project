import { Hero } from "@/components/Hero";
import { PairCard } from "@/components/PairCard";
import { SoundCard } from "@/components/SoundCard";
import { SoundPractice } from "@/components/SoundPractice";
import { MINIMAL_PAIRS, soundsBySection } from "@/content/sounds";

const SECTIONS = ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"] as const;
const anchor = (name: string) => name.toLowerCase().replace(" ", "-");

export function SoundBank() {
  return (
    <>
      <Hero first="Sound Bank," second="hear every sound" wide />
      <main className="page page-wide" style={{ display: "grid", gap: "1.5rem" }}>
        <nav aria-label="Sections" className="jump-bar">
          {SECTIONS.map((name) => <a key={name} href={`#${anchor(name)}`}>{name}</a>)}
        </nav>
        {(["vowels", "consonants", "tones"] as const).map((section) => (
          <section key={section} id={section} style={{ display: "grid", gap: "0.75rem" }}>
            <h2 style={{ margin: 0 }}>{section[0]!.toUpperCase() + section.slice(1)}</h2>
            <div className={`sound-grid rise-in${section === "tones" ? " tones" : ""}`}>
              {soundsBySection(section).map((s) => <SoundCard key={s.id} sound={s} />)}
            </div>
          </section>
        ))}
        <section id="minimal-pairs" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Minimal pairs</h2>
          <p className="muted" style={{ margin: 0 }}>Words that differ only in one tone or sound. Listen for the difference.</p>
          <div className="sound-grid pairs">{MINIMAL_PAIRS.map((p) => <PairCard key={p.id} pair={p} />)}</div>
        </section>
        <section id="practice" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Practice</h2>
          <div className="practice-wrap"><SoundPractice pairs={MINIMAL_PAIRS} /></div>
        </section>
      </main>
    </>
  );
}
