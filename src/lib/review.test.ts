import { describe, expect, it } from "vitest";
import type { Level, WordBreakdown } from "@/content/types";
import { buildReviewMarkdown } from "./review";

const word = (id: string, confidence: "verified" | "needs-review"): WordBreakdown => ({
  id, surface: "ẹ káàárọ̀", english: "good morning",
  parts: [{ text: "ẹ", gloss: "you", role: "pronoun" }, { text: "kú", gloss: "greet", role: "verb" }, { text: "àárọ̀", gloss: "morning", role: "noun" }],
  steps: [{ kind: "join", result: "ẹ kú àárọ̀" }, { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "r" }],
  confidence, note: confidence === "needs-review" ? "Check kú to ká." : undefined,
});

const levels = [{
  id: "getting-started", title: "Getting Started", summary: "s",
  lessons: [{
    id: "gs-3", level: "getting-started", title: "Greetings", sources: ["x"],
    primer: { rule: "r", formula: "f", rules: [], examples: [word("a", "needs-review"), word("b", "verified")], commonMistake: { wrong: "w", right: "r", why: "y" } },
    questions: [],
  }],
}] as unknown as Level[];

describe("buildReviewMarkdown", () => {
  it("lists only needs-review words, with parts, steps, and the doubt", () => {
    const md = buildReviewMarkdown(levels);
    expect(md).toContain("Getting Started");
    expect(md).toContain("Greetings");
    expect(md).toContain("ẹ + kú + àárọ̀");
    expect(md).toContain("ẹ kú àárọ̀ > ẹ káàárọ̀");
    expect(md).toContain("Check kú to ká.");
    expect(md).not.toContain("`b`");
    expect(md).toMatch(/1 item/);
  });
  it("says everything is verified when nothing needs review", () => {
    const only = JSON.parse(JSON.stringify(levels)) as Level[];
    only[0]!.lessons[0]!.primer.examples = [word("b", "verified")];
    expect(buildReviewMarkdown(only)).toMatch(/All items are verified/);
  });
  it("contains no em dash", () => {
    expect(buildReviewMarkdown(levels)).not.toContain("\u2014");
  });
});
