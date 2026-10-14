import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Lesson, WordBreakdown } from "@/content/types";
import { Primer } from "./Primer";

vi.mock("@/lib/audio", () => ({ audioUrlFor: () => null }));

const word = (steps: WordBreakdown["steps"], parts: WordBreakdown["parts"]): WordBreakdown => ({
  id: "w", surface: "ọmọ", english: "child", parts, steps, confidence: "verified",
});
const lesson = (examples: WordBreakdown[]): Lesson => ({
  id: "t", level: "getting-started", title: "T", sources: [],
  primer: {
    rule: "Rule", formula: "a + b", rules: [], examples,
    commonMistake: { wrong: "x", right: "y", why: "z" },
  },
  questions: [],
});

describe("Primer heading", () => {
  it("says words are built when an example has construction", () => {
    const w = word([{ kind: "join", result: "ab" }], [
      { text: "a", gloss: "a", role: "noun" }, { text: "b", gloss: "b", role: "verb" },
    ]);
    render(<Primer lesson={lesson([w])} />);
    expect(screen.getByRole("heading", { name: "Words and how they are built" })).toBeInTheDocument();
  });
  it("says words in this lesson otherwise", () => {
    const w = word([], [{ text: "ọmọ", gloss: "child", role: "syllable" }]);
    render(<Primer lesson={lesson([w])} />);
    expect(screen.getByRole("heading", { name: "Words in this lesson" })).toBeInTheDocument();
  });
});
