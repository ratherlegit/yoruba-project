import { Fragment } from "react";
import { syllabify, toneOf } from "@/lib/tone";
import type { Tone } from "@/content/types";

const Y: Record<Tone, number> = { high: 6, mid: 16, low: 26 };
const W = 48;
const H = 32;

export function PitchLine({ word }: { word: string }) {
  let words: string[][];
  try {
    words = word
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => syllabify(w));
  } catch {
    return null;
  }
  return (
    <div className="pitch" aria-label={`Pitch pattern for ${word}`}>
      {words.map((syls, wi) => {
        const tones = syls.map(toneOf);
        const ys = tones.map((t) => Y[t]);
        return (
          <Fragment key={wi}>
            {wi > 0 && <span className="pitch-gap" data-testid="pitch-gap" />}
            {syls.map((s, i) => {
              const y = ys[i]!;
              const left = i === 0 ? y : (ys[i - 1]! + y) / 2;
              const right = i === ys.length - 1 ? y : (y + ys[i + 1]!) / 2;
              return (
                <div key={i} className="pitch-col" data-testid="pitch-col">
                  <svg
                    width={W}
                    height={H}
                    viewBox={`0 0 ${W} ${H}`}
                    aria-hidden="true"
                  >
                    <path
                      d={`M0 ${left} L${W / 2} ${y} L${W} ${right}`}
                      data-y-left={left}
                      data-y-right={right}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                    <circle cx={W / 2} cy={y} r="4" fill="currentColor" />
                  </svg>
                  <span className="yo pitch-syl">{s}</span>
                  <span className="muted pitch-tone">{tones[i]}</span>
                </div>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
}
