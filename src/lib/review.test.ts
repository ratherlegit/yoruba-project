import { readFileSync } from "node:fs";
import { LEVELS } from "@/content/levels";
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
    primer: { rule: "r", formula: "f", rules: [], examples: [word("a", "needs-review"), word("b", "verified")], commonMistake: { wrong: "ẹ ku", right: "ẹ kú", why: "Mind the tone." } },
    questions: [
      { type: "blank", prompt: "Ẹ ___ àárọ̀", answer: "kú", choices: ["kú", "ku"] },
      { type: "pick", prompt: "Which is fish?", choices: ["ọmọ", "ẹja"], answer: 1 },
      { type: "order", english: "Good morning", words: ["àárọ̀", "kú"], answer: ["kú", "àárọ̀"] },
    ],
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
  it("lists the common mistake and every question's Yoruba for every lesson", () => {
    const md = buildReviewMarkdown(levels);
    expect(md).toContain("All learner-facing Yoruba");
    expect(md).toContain("- Wrong: ẹ ku");
    expect(md).toContain("- Right: ẹ kú");
    expect(md).toContain("- Why: Mind the tone.");
    expect(md).toContain("Q1 (blank): Ẹ ___ àárọ̀");
    expect(md).toContain("Choices: kú | ku");
    expect(md).toContain("Answer: kú");
    expect(md).toContain("Q2 (pick): Which is fish?");
    expect(md).toContain("Answer: ẹja");
    expect(md).toContain("Q3 (order): Good morning");
    expect(md).toContain("Answer: kú àárọ̀");
  });
  it("still lists lessons with no needs-review words in the full section", () => {
    const only = JSON.parse(JSON.stringify(levels)) as Level[];
    only[0]!.lessons[0]!.primer.examples = [word("b", "verified")];
    expect(buildReviewMarkdown(only)).toContain("#### Greetings (`gs-3`)");
  });
  it("matches the committed content/REVIEW.md", () => {
    expect(readFileSync("content/REVIEW.md", "utf8")).toBe(buildReviewMarkdown(LEVELS));
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
