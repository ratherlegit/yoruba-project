import type { Confidence } from "./types";

// Numbers section content. Number words are copied from sources, never computed:
// they have contractions and tone shifts. `build` shows how a number is made from
// the base-20 system and is only checked for arithmetic by the validator.
// Every entry is needs-review until a native speaker checks it.

export type NumberEntry = {
  id: string;
  value: number;
  yoruba: string; // the counting form
  after: string[]; // forms used after a noun (méjì, mẹ́ta); empty when none
  answers: string[]; // every accepted counting form, yoruba first
  build: string; // arithmetic such as "20-5"; "" when the number is a base word
  step: 1 | 2 | 3 | 4;
  example?: { yoruba: string; english: string };
  source: string;
  confidence: Confidence;
  note?: string;
};

export type NumberPhrase = {
  id: string;
  step: 5 | 6;
  prompt: string; // the English, for example "two children"
  numeral: string; // digits as a string, or "" when not a price or count to read back
  answers: string[];
  source: string;
  confidence: Confidence;
  note?: string;
};

export type NumberStep = { id: string; title: string; rule: string; entryIds: string[]; phraseIds: string[] };

// Evaluates a build expression: digits, + - * x × and parentheses. No eval.
export function evalBuild(expr: string): number | null {
  if (/[0-9]\s+[0-9]/.test(expr)) return null;
  const src = expr.replace(/\s+/g, "").replace(/[x×]/g, "*");
  if (!src || !/^[0-9+\-*()]+$/.test(src)) return null;
  let i = 0;
  const peek = () => src[i];
  function number(): number | null {
    let j = i;
    while (j < src.length && /[0-9]/.test(src[j]!)) j++;
    if (j === i) return null;
    const n = Number(src.slice(i, j));
    i = j;
    return n;
  }
  function atom(): number | null {
    if (peek() === "(") {
      i++;
      const v = sum();
      if (v === null || peek() !== ")") return null;
      i++;
      return v;
    }
    return number();
  }
  function product(): number | null {
    let v = atom();
    while (v !== null && peek() === "*") {
      i++;
      const r = atom();
      v = r === null ? null : v * r;
    }
    return v;
  }
  function sum(): number | null {
    let v = product();
    while (v !== null && (peek() === "+" || peek() === "-")) {
      const op = src[i++];
      const r = product();
      v = r === null ? null : op === "+" ? v + r : v - r;
    }
    return v;
  }
  const v = sum();
  return v !== null && i === src.length ? v : null;
}

export const NUMBERS: NumberEntry[] = [];
export const PHRASES: NumberPhrase[] = [];
export const NUMBER_STEPS: NumberStep[] = [];
