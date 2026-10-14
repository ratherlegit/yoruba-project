import { readFileSync } from "node:fs";
import { LEVELS } from "@/content/levels";
import { VOCAB_LEVELS } from "@/content/vocab";
import { describe, expect, it } from "vitest";
import type { Level, WordBreakdown } from "@/content/types";
import type { VocabLevel, VocabWord } from "@/content/vocab/types";
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
    expect(readFileSync("content/REVIEW.md", "utf8")).toBe(buildReviewMarkdown(LEVELS, VOCAB_LEVELS));
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

const vword = (i: number, confidence: "verified" | "needs-review"): VocabWord => ({
  id: `w${i}`, yoruba: `ọ̀rọ̀${i}`, english: `thing ${i}`, pos: "noun",
  sentence: { yoruba: `Mo rí ọ̀rọ̀${i}.`, english: `I see thing ${i}.` },
  confidence, note: confidence === "needs-review" ? `Doubt ${i}` : undefined,
});
const vocabLevels: VocabLevel[] = [
  {
    id: "getting-started", title: "Getting Started",
    topics: [{
      id: "food", level: "getting-started", title: "Food", blurb: "b", sources: ["Src A", "Src B"],
      words: Array.from({ length: 10 }, (_, i) => vword(i, i < 2 ? "needs-review" : "verified")),
    }],
  },
  { id: "beginner", title: "Beginner", topics: [] },
];

describe("buildReviewMarkdown with vocab", () => {
  it("adds a Vocab section grouped by level then topic, listing only needs-review words", () => {
    const md = buildReviewMarkdown(levels, vocabLevels);
    expect(md).toContain("## Vocab");
    expect(md).toContain("### Getting Started\n\n#### Food (`food`)");
    expect(md).toContain("Sources consulted: Src A; Src B");
    expect(md).toContain("- `w0`: **ọ̀rọ̀0** (thing 0, noun)");
    expect(md).toContain("  - Sentence: Mo rí ọ̀rọ̀0. / I see thing 0.");
    expect(md).toContain("  - Doubt: Doubt 0");
    expect(md).toContain("`w1`");
    expect(md).not.toContain("`w2`");
    expect(md).not.toContain("### Beginner");
  });
  it("counts vocab items in the review total", () => {
    expect(buildReviewMarkdown(levels, vocabLevels)).toMatch(/3 items need review/);
  });
  it("keeps the topic header and sources when every word is verified", () => {
    const v = JSON.parse(JSON.stringify(vocabLevels)) as VocabLevel[];
    v[0]!.topics[0]!.words.forEach((w) => { w.confidence = "verified"; });
    const md = buildReviewMarkdown(levels, v);
    expect(md).toContain("#### Food (`food`)");
    expect(md).toContain("Sources consulted: Src A; Src B");
    expect(md).not.toContain("- `w0`");
    expect(md).toMatch(/1 item need/);
  });
  it("is identical to the one-argument output when there are no vocab topics", () => {
    expect(buildReviewMarkdown(levels, [])).toBe(buildReviewMarkdown(levels));
    expect(buildReviewMarkdown(levels, [{ id: "beginner", title: "Beginner", topics: [] }])).toBe(buildReviewMarkdown(levels));
  });
  it("contains no em dash", () => {
    expect(buildReviewMarkdown(levels, vocabLevels)).not.toContain("\u2014");
  });
});
