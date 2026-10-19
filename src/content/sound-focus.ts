import type { Confidence, Tone } from "./types";

// Content for the Sound Bank's tone comparison grid and consonant contrast sets.
// Every row and set is needs-review until a native speaker checks it.

export type ToneCompareWord = { yoruba: string; english: string; tone: Tone };

export type ToneCompareRow = {
  id: string;
  vowel: string; // "a", "ẹ", ..., or a nasal vowel such as "an", "ọn"
  words: [ToneCompareWord, ToneCompareWord, ToneCompareWord]; // mid, high, low
  source: string;
  confidence: Confidence;
  note: string;
};

export type ConsonantFocus = "gb" | "p" | "s-sh";

export type ConsonantSet = {
  id: string;
  focus: ConsonantFocus[]; // the key consonant cards this set appears on
  explain: string; // one line saying what to listen for
  words: { yoruba: string; english: string }[]; // 2 to 4, same vowel and tone, different consonants
  source: string;
  confidence: Confidence;
  note: string;
};

export const TONE_COMPARE: ToneCompareRow[] = [];
export const CONSONANT_SETS: ConsonantSet[] = [];
