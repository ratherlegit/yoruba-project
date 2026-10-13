export type Tone = "high" | "mid" | "low";

export type LevelId = "getting-started" | "beginner" | "intermediate" | "advanced" | "mastery";
export const LEVEL_IDS: readonly LevelId[] = [
  "getting-started",
  "beginner",
  "intermediate",
  "advanced",
  "mastery",
];

export type Morpheme = { text: string; gloss: string; role: string };

export type BuildKind = "join" | "elide" | "assimilate" | "tone-shift";
// ruleId is required on every step except "join" (joining needs no named rule).
export type BuildStep = { kind: BuildKind; result: string; ruleId?: string };

export type Confidence = "verified" | "needs-review";

export type WordBreakdown = {
  id: string;
  surface: string;
  english: string;
  parts: Morpheme[];
  steps: BuildStep[];
  confidence: Confidence;
  note?: string;
};

export type Rule = { id: string; title: string; explanation: string };

export type BlankQuestion = { type: "blank"; prompt: string; answer: string; choices: string[]; wordId?: string };
export type PickQuestion = { type: "pick"; prompt: string; choices: string[]; answer: number; wordId?: string };
export type OrderQuestion = { type: "order"; english: string; words: string[]; answer: string[] };
export type Question = BlankQuestion | PickQuestion | OrderQuestion;

export type Lesson = {
  id: string;
  level: LevelId;
  title: string;
  sources: string[];
  primer: {
    rule: string;
    formula: string;
    rules: Rule[];
    examples: WordBreakdown[];
    commonMistake: { wrong: string; right: string; why: string };
    toneFocus?: Tone[];
  };
  questions: Question[];
};

export type Level = { id: LevelId; title: string; summary: string; lessons: Lesson[] };
