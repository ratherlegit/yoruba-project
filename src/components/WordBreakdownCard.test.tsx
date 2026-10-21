import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Rule, WordBreakdown } from "@/content/types";
import { WordBreakdownCard } from "./WordBreakdownCard";

vi.mock("@/lib/audio", () => ({
  audioUrlFor: (text: string) => (text === "ọmọ" || text === "ẹ káàárọ̀" ? "/audio/x.mp3" : null),
}));

const rules: Rule[] = [{ id: "u-to-a", title: "u becomes a before a", explanation: "e" }];
const word: WordBreakdown = {
  id: "k", surface: "ẹ káàárọ̀", english: "good morning",
  parts: [
    { text: "ẹ", gloss: "you (respect)", role: "pronoun" },
    { text: "kú", gloss: "greet", role: "verb" },
    { text: "àárọ̀", gloss: "morning", role: "noun" },
  ],
  steps: [
    { kind: "join", result: "ẹ kú àárọ̀" },
    { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "u-to-a" },
  ],
  confidence: "needs-review", note: "Check the vowel change.",
};

describe("WordBreakdownCard", () => {
  it("shows every component and every step from the start, naming the rule", () => {
    render(<WordBreakdownCard word={word} rules={rules} />);
    expect(screen.getByText("kú")).toBeInTheDocument();
    expect(screen.getByText("morning")).toBeInTheDocument();
    expect(screen.getByText("ẹ kú àárọ̀")).toBeInTheDocument();
    expect(screen.getByText("u becomes a before a")).toBeInTheDocument();
    expect(screen.getAllByText("ẹ káàárọ̀").length).toBeGreaterThan(0);
  });

  it("marks the join step as an illustration, not the final word", () => {
    render(<WordBreakdownCard word={word} rules={rules} />);
    expect(screen.getByText(/illustration only/i)).toBeInTheDocument();
  });

  it("has no stepper buttons", () => {
    render(<WordBreakdownCard word={word} rules={rules} />);
    for (const name of ["Next step", "Show all", "Reset"]) {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    }
  });

  it("shows the final form immediately for a word with real parts but no steps", () => {
    const real: WordBreakdown = { ...word, id: "r", surface: "olùkọ́", steps: [], parts: [
      { text: "olù", gloss: "one who", role: "noun" }, { text: "kọ́", gloss: "teach", role: "verb" },
    ] };
    render(<WordBreakdownCard word={real} rules={rules} />);
    expect(screen.getByText("olù")).toBeInTheDocument();
    expect(screen.getByText("olùkọ́")).toBeInTheDocument();
  });

  describe("simple card (syllables only, nothing combines)", () => {
    const plain: WordBreakdown = { ...word, id: "p", surface: "ọmọ", english: "child", steps: [], parts: [
      { text: "ọ", gloss: "o", role: "syllable" }, { text: "mọ", gloss: "mo", role: "syllable" },
    ] };

    it("shows English, the word and Listen, with no tiles, steps or buttons", () => {
      render(<WordBreakdownCard word={plain} rules={rules} />);
      expect(screen.getByText("child")).toBeInTheDocument();
      expect(screen.getByText("ọmọ")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Listen to ọmọ" })).toBeInTheDocument();
      expect(screen.queryByLabelText("Components")).not.toBeInTheDocument();
      expect(screen.queryByText("mo")).not.toBeInTheDocument();
      expect(document.querySelector(".part-tile, .steps")).toBeNull();
      for (const name of ["Next step", "Show all", "Reset"]) {
        expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
      }
    });

    it("omits Listen when there is no clip", () => {
      render(<WordBreakdownCard word={{ ...plain, surface: "gbọ́", parts: [{ text: "gbọ́", gloss: "hear", role: "syllable" }] }} rules={rules} />);
      expect(screen.getAllByText("gbọ́").length).toBeGreaterThan(0);
      expect(screen.queryByRole("button", { name: /Listen/ })).not.toBeInTheDocument();
    });

    it("keeps the review marker", () => {
      render(<WordBreakdownCard word={plain} rules={rules} showReviewMarker />);
      expect(screen.getByText(/pending review/i)).toBeInTheDocument();
    });
  });

  it("shows the review marker only when asked", () => {
    const { rerender } = render(<WordBreakdownCard word={word} rules={rules} showReviewMarker={false} />);
    expect(screen.queryByText(/pending review/i)).not.toBeInTheDocument();
    rerender(<WordBreakdownCard word={word} rules={rules} showReviewMarker />);
    expect(screen.getByText(/pending review/i)).toBeInTheDocument();
  });
});
