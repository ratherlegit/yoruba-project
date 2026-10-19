import type { Confidence } from "./types";

// Proverbs (òwe) shown one at a time on the Proverbs page. The learner reads the
// Yoruba and its direct translation, then guesses the social meaning from three
// choices. Text only for now: no audio.
// Every entry is needs-review until a native speaker checks it.

export type Proverb = {
  id: string;
  yoruba: string;
  literal: string; // direct, word for word English translation
  meaning: string; // the social meaning
  usedWhen: string; // finishes "You would say this when ..." (lowercase start, ends with a period)
  wrong: [string, string]; // two plausible but wrong meanings
  source: string;
  confidence: Confidence;
  note?: string;
};

export const PROVERBS: Proverb[] = [];
