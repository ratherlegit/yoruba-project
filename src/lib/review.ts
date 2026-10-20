import type { Level, Question } from "@/content/types";
import type { VocabLevel } from "@/content/vocab/types";
import type { MinimalPair, Sound } from "@/content/sounds";
import type { ConsonantSet, ToneCompareRow } from "@/content/sound-focus";
import type { ToneTwinEntry } from "@/content/tone-twins";
import type { Proverb } from "@/content/proverbs";
import type { Transform } from "@/content/transforms";

function questionLines(q: Question, n: number): string[] {
  if (q.type === "blank") {
    return [
      `- Q${n} (blank): ${q.prompt}`,
      `  - Choices: ${q.choices.join(" | ")}`,
      `  - Answer: ${q.answer}`,
    ];
  }
  if (q.type === "pick") {
    return [
      `- Q${n} (pick): ${q.prompt}`,
      `  - Choices: ${q.choices.join(" | ")}`,
      `  - Answer: ${q.choices[q.answer] ?? "(missing)"}`,
    ];
  }
  return [`- Q${n} (order): ${q.english}`, `  - Answer: ${q.answer.join(" ")}`];
}

export function buildReviewMarkdown(levels: Level[], vocabLevels: VocabLevel[] = [], soundData?: { sounds: Sound[]; pairs: MinimalPair[]; compare?: ToneCompareRow[]; sets?: ConsonantSet[] }, toneTwins: ToneTwinEntry[] = [], proverbs: Proverb[] = [], transforms: Transform[] = []): string {
  const lines: string[] = [];
  let total = 0;

  for (const level of levels) {
    const lessonBlocks: string[] = [];
    for (const lesson of level.lessons) {
      const items = lesson.primer.examples.filter((w) => w.confidence === "needs-review");
      if (items.length === 0) continue;
      total += items.length;
      lessonBlocks.push(`### ${lesson.title} (\`${lesson.id}\`)`);
      lessonBlocks.push(`Sources consulted: ${lesson.sources.join("; ")}`);
      lessonBlocks.push("");
      for (const w of items) {
        lessonBlocks.push(`- \`${w.id}\`: **${w.surface}** (${w.english})`);
        lessonBlocks.push(`  - Parts: ${w.parts.map((p) => p.text).join(" + ")}`);
        if (w.steps.length) lessonBlocks.push(`  - Steps: ${w.steps.map((s) => s.result).join(" > ")}`);
        lessonBlocks.push(`  - Doubt: ${w.note ?? "(none recorded)"}`);
      }
      lessonBlocks.push("");
    }
    if (lessonBlocks.length) lines.push(`## ${level.title}`, "", ...lessonBlocks);
  }

  // Vocab section: only levels that have topics. Omitted entirely when there are none.
  const vocabLines: string[] = [];
  for (const level of vocabLevels) {
    if (level.topics.length === 0) continue;
    vocabLines.push(`### ${level.title}`, "");
    for (const topic of level.topics) {
      vocabLines.push(`#### ${topic.title} (\`${topic.id}\`)`);
      vocabLines.push(`Sources consulted: ${topic.sources.join("; ")}`);
      vocabLines.push("");
      for (const w of topic.words.filter((x) => x.confidence === "needs-review")) {
        total += 1;
        vocabLines.push(`- \`${w.id}\`: **${w.yoruba}** (${w.english}, ${w.pos})`);
        vocabLines.push(`  - Sentence: ${w.sentence.yoruba} / ${w.sentence.english}`);
        if (w.sentence.blank) vocabLines.push(`  - Blank in gap-fill: ${w.sentence.blank}`);
        vocabLines.push(`  - Doubt: ${w.note ?? "(none recorded)"}`);
      }
      vocabLines.push("");
    }
  }
  const vocabSection = vocabLines.length ? ["## Vocab", "", ...vocabLines] : [];

  const soundLines: string[] = [];
  if (soundData) {
    for (const x of soundData.sounds.filter((s) => s.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${x.id}\`: **${x.letter}** (${x.section}): ${x.compare}`);
      soundLines.push(`  - Examples: ${x.examples.map((e) => `${e.yoruba} (${e.english})`).join(", ")}`);
      soundLines.push(`  - Doubt: ${x.note ?? "(none recorded)"}`);
    }
    for (const p of soundData.pairs.filter((q) => q.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${p.id}\`: minimal pair (${p.contrast}): ${p.explain}`);
      soundLines.push(`  - Words: ${p.words.map((e) => `${e.yoruba} (${e.english})`).join(", ")}`);
      soundLines.push(`  - Doubt: ${p.note ?? "(none recorded)"}`);
    }
    for (const r of (soundData.compare ?? []).filter((x) => x.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${r.id}\`: tone comparison for **${r.vowel}**`);
      soundLines.push(`  - Words (mid, high, low): ${r.words.map((w) => `${w.yoruba} (${w.english})`).join(", ")}`);
      soundLines.push(`  - Source: ${r.source}`);
      soundLines.push(`  - Doubt: ${r.note}`);
    }
    for (const x of (soundData.sets ?? []).filter((y) => y.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${x.id}\`: consonant contrast (${x.focus.join(", ")}): ${x.explain}`);
      soundLines.push(`  - Words: ${x.words.map((w) => `${w.yoruba} (${w.english})`).join(", ")}`);
      soundLines.push(`  - Source: ${x.source}`);
      soundLines.push(`  - Doubt: ${x.note}`);
    }
  }
  const soundSection = soundLines.length ? ["## Sound Bank", "", ...soundLines, ""] : [];

  const vocabById = new Map(vocabLevels.flatMap((l) => l.topics.flatMap((t) => t.words.map((w) => [w.id, w] as const))));
  const twinLines: string[] = [];
  for (const e of toneTwins.filter((x) => x.confidence === "needs-review")) {
    total += 1;
    const w = vocabById.get(e.vocabId);
    twinLines.push(`- \`${e.vocabId}\`: **${w?.yoruba ?? "(unknown word)"}** (${w?.english ?? "?"})`);
    twinLines.push(`  - Twins: ${e.twins.map((t) => `${t.yoruba} (${t.english})`).join(", ")}`);
    twinLines.push(`  - Source: ${e.source}`);
    twinLines.push(`  - Doubt: ${e.note ?? "(none recorded)"}`);
  }
  const twinSection = twinLines.length ? ["## Tone twins", "", ...twinLines, ""] : [];

  const proverbLines: string[] = [];
  for (const p of proverbs.filter((x) => x.confidence === "needs-review")) {
    total += 1;
    proverbLines.push(`- \`${p.id}\`: **${p.yoruba}**`);
    proverbLines.push(`  - Word for word: ${p.literal}`);
    proverbLines.push(`  - Meaning: ${p.meaning}`);
    proverbLines.push(`  - Wrong options: ${p.wrong.join(" / ")}`);
    proverbLines.push(`  - Source: ${p.source}`);
    proverbLines.push(`  - Doubt: ${p.note ?? "(none recorded)"}`);
  }
  const proverbSection = proverbLines.length ? ["## Proverbs", "", ...proverbLines, ""] : [];

  const transformLines: string[] = [];
  for (const t of transforms.filter((x) => x.confidence === "needs-review")) {
    total += 1;
    transformLines.push(`- \`${t.id}\` (${t.kind}): **${t.base}** (${t.baseEnglish})`);
    transformLines.push(`  - Accepted answers: ${t.answers.join(" | ")}`);
    transformLines.push(`  - Rule: ${t.rule}`);
    transformLines.push(`  - Source: ${t.source}`);
    transformLines.push(`  - Doubt: ${t.note ?? "(none recorded)"}`);
  }
  const transformSection = transformLines.length ? ["## Transformations", "", ...transformLines, ""] : [];

  const header = [
    "# Content review list",
    "",
    "Generated by `npm run review`. Do not edit by hand.",
    "",
    total === 0 ? "All items are verified." : `${total} item${total === 1 ? "" : "s"} need review.`,
    "",
  ];
  const all: string[] = [
    "## All learner-facing Yoruba",
    "",
    "Every lesson's common mistake and practice questions, so a native speaker can review all Yoruba a learner sees.",
    "",
  ];
  for (const level of levels) {
    all.push(`### ${level.title}`, "");
    for (const lesson of level.lessons) {
      const m = lesson.primer.commonMistake;
      all.push(`#### ${lesson.title} (\`${lesson.id}\`)`, "");
      all.push("Common mistake:", `- Wrong: ${m.wrong}`, `- Right: ${m.right}`, `- Why: ${m.why}`, "");
      all.push("Questions:");
      lesson.questions.forEach((q, i) => all.push(...questionLines(q, i + 1)));
      all.push("");
    }
  }

  return [...header, ...lines, ...vocabSection, ...soundSection, ...twinSection, ...proverbSection, ...transformSection, ...all].join("\n");
}
