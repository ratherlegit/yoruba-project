import { syllabify, toneOf } from "@/lib/tone";
import type { Tone } from "@/content/types";

const Y: Record<Tone, number> = { high: 6, mid: 16, low: 26 };

export function PitchLine({ word }: { word: string }) {
  let syllables: string[];
  try {
    syllables = word.split(/\s+/).filter(Boolean).flatMap(syllabify);
  } catch {
    return null;
  }
  return (
    <div className="pitch" aria-label={`Pitch pattern for ${word}`}>
      {syllables.map((s, i) => {
        const tone = toneOf(s);
        return (
          <div key={i} className="pitch-col" data-testid="pitch-col">
            <svg width="28" height="32" aria-hidden="true">
              <circle cx="14" cy={Y[tone]} r="4" fill="currentColor" />
            </svg>
            <span className="yo" style={{ fontSize: "1rem" }}>{s}</span>
            <span className="muted" style={{ fontSize: "0.75rem" }}>{tone}</span>
          </div>
        );
      })}
    </div>
  );
}
