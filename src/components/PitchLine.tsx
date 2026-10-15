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
                    {/* Faint dotted guides for all three pitch levels, so a flat line still shows which level it is on. */}
                    {(Object.keys(Y) as Tone[]).map((level) => (
                      <line
                        key={level}
                        className="pitch-guide"
                        x1="0" x2={W} y1={Y[level]} y2={Y[level]}
                        stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5"
                        strokeLinecap="round" strokeDasharray="0.1 4"
                      />
                    ))}
                    <path
                      d={`M0 ${left} L${W / 2} ${y} L${W} ${right}`}
                      data-y-left={left}
                      data-y-right={right}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeOpacity="0.9"
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
