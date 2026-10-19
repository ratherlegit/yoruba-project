import type { Confidence } from "./types";

// Real Yoruba words with the same letters as a vocab word and different tone marks.
// Text only: twins are shown as wrong choices in tone practice and need no audio.
// Every entry is needs-review until a native speaker checks it.

export type ToneTwin = {
  yoruba: string;
  english: string; // for the reviewer only, never rendered in the app
};

export type ToneTwinEntry = {
  vocabId: string;
  twins: ToneTwin[];
  source: string;
  confidence: Confidence;
  note?: string;
};

export const TONE_TWINS: ToneTwinEntry[] = [];
