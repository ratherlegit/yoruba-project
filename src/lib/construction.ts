import type { WordBreakdown } from "@/content/types";

// Decides whether a word's construction (component tiles and steps) is worth showing.
// Syllable-level splits like j + a are noise, so they are hidden. Show construction when
// a real join or contraction exists (steps), or when the parts are meaning-bearing units.
// To use the strict reading (only show words that have steps), remove the second clause.
export function hasConstruction(word: WordBreakdown): boolean {
  if (word.steps.length > 0) return true;
  return word.parts.length > 1 && word.parts.some((p) => p.role !== "syllable");
}

export function primerHeading(examples: WordBreakdown[]): string {
  return examples.some(hasConstruction) ? "Words and how they are built" : "Words in this lesson";
}
