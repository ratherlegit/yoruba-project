import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Rule, WordBreakdown } from "@/content/types";
import { WordBreakdownCard } from "./WordBreakdownCard";

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
  it("shows every component with its gloss and no steps at first", () => {
    render(<WordBreakdownCard word={word} rules={rules} />);
    expect(screen.getByText("kú")).toBeInTheDocument();
    expect(screen.getByText("morning")).toBeInTheDocument();
    expect(screen.queryByText("ẹ káàárọ̀")).not.toBeInTheDocument();
  });

  it("reveals one step at a time and names the rule", async () => {
    const user = userEvent.setup();
    render(<WordBreakdownCard word={word} rules={rules} />);
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByText("ẹ kú àárọ̀")).toBeInTheDocument();
    expect(screen.queryByText("u becomes a before a")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByText("u becomes a before a")).toBeInTheDocument();
    expect(screen.getAllByText("ẹ káàárọ̀").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();
  });

  it("show all reveals everything, reset hides it again", async () => {
    const user = userEvent.setup();
    render(<WordBreakdownCard word={word} rules={rules} />);
    await user.click(screen.getByRole("button", { name: "Show all" }));
    expect(screen.getAllByText("ẹ káàárọ̀").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.queryByText("ẹ káàárọ̀")).not.toBeInTheDocument();
  });

  it("shows the final form immediately for a word with no steps and no step buttons", () => {
    const plain: WordBreakdown = { ...word, id: "p", surface: "ọmọ", steps: [], parts: [
      { text: "ọ", gloss: "o", role: "syllable" }, { text: "mọ", gloss: "mo", role: "syllable" },
    ] };
    render(<WordBreakdownCard word={plain} rules={rules} />);
    expect(screen.getByText("ọmọ")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
  });

  it("shows the review marker only when asked", () => {
    const { rerender } = render(<WordBreakdownCard word={word} rules={rules} showReviewMarker={false} />);
    expect(screen.queryByText(/pending review/i)).not.toBeInTheDocument();
    rerender(<WordBreakdownCard word={word} rules={rules} showReviewMarker />);
    expect(screen.getByText(/pending review/i)).toBeInTheDocument();
  });
});
