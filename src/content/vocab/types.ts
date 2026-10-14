import type { Confidence, LevelId } from "../types";

export type VocabPos = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "number" | "other";
export const VOCAB_POS: readonly VocabPos[] = ["noun", "verb", "adjective", "adverb", "phrase", "number", "other"];

// `blank` names the exact substring of `yoruba` to blank in gap-fill when the
// word changes form inside the sentence. Defaults to the word itself.
export type VocabSentence = { yoruba: string; english: string; blank?: string };

export type VocabWord = {
  id: string;
  yoruba: string;
  english: string;
  pos: VocabPos;
  sentence: VocabSentence;
  confidence: Confidence;
  note?: string;
};

export type VocabTopic = {
  id: string;
  level: LevelId;
  title: string;
  blurb: string;
  sources: string[];
  words: VocabWord[];
};

export type VocabLevel = { id: LevelId; title: string; topics: VocabTopic[] };
