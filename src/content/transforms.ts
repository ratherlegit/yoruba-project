import type { Confidence } from "./types";

// Sentences for the Transform page. The learner is shown a Yoruba sentence and an
// instruction, then types the transformed sentence. Text only: no audio.
// Every entry is needs-review until a native speaker checks it.

export type TransformKind = "negative" | "question" | "future" | "past";

export type Transform = {
  id: string;
  kind: TransformKind;
  base: string; // the sentence shown
  baseEnglish: string;
  answers: string[]; // every accepted answer; answers[0] is the model answer
  rule: string; // one line on what changed and why
  source: string;
  confidence: Confidence;
  note?: string;
};

export const INSTRUCTIONS: Record<TransformKind, string> = {
  negative: "Make this negative",
  question: "Turn this into a question",
  future: "Say this in the future",
  past: "Say this in the past",
};

export const TRANSFORMS: Transform[] = [];
