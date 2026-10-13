import { WordBreakdownCard } from "@/components/WordBreakdownCard";
import type { Rule, WordBreakdown } from "@/content/types";

// Dev-only fixture so the step-by-step breakdown can be screenshotted (no shipped lesson has steps yet).
const RULES: Rule[] = [
  { id: "u-to-a", title: "u becomes a before a", explanation: "When kú meets a word starting with a, the u changes to match the vowel that follows." },
];

const WORD: WordBreakdown = {
  id: "e-kaaaro",
  surface: "ẹ káàárọ̀",
  english: "good morning (respectful)",
  parts: [
    { text: "ẹ", gloss: "you (respect)", role: "pronoun" },
    { text: "kú", gloss: "greet", role: "verb" },
    { text: "àárọ̀", gloss: "morning", role: "noun" },
  ],
  steps: [
    { kind: "join", result: "ẹ kú àárọ̀" },
    { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "u-to-a" },
  ],
  confidence: "needs-review",
  note: "Fixture for the design check. The contraction steps are not yet reviewed by a Yoruba speaker.",
};

export function Breakdown() {
  return (
    <main className="page">
      <h1>Breakdown card check</h1>
      <WordBreakdownCard word={WORD} rules={RULES} />
    </main>
  );
}
