import { describe, expect, it } from "vitest";
import { blankOf, locateBlank, validateTopic, validateVocabCatalog, WORDS_PER_TOPIC } from "./validate";
import type { VocabTopic, VocabWord } from "./types";

function word(i: number, over: Partial<VocabWord> = {}): VocabWord {
  return {
    id: `t-w${i}`,
    yoruba: `ọ\u0300rọ\u0300${i}`.replace(/\d/g, (d) => "ábcdefghij"[Number(d)]!),
    english: `meaning ${i}`,
    pos: "noun",
    sentence: { yoruba: "Èyí ni ọ\u0300rọ\u0300", english: "This is a word" },
    confidence: "needs-review",
    note: "test",
    ...over,
  };
}

function topic(over: Partial<VocabTopic> = {}): VocabTopic {
  const words = Array.from({ length: WORDS_PER_TOPIC }, (_, i) => {
    const w = word(i);
    return { ...w, sentence: { yoruba: `Mo rí ${w.yoruba} níbí`, english: `I see it ${i}` } };
  });
  return { id: "t", level: "getting-started", title: "T", blurb: "b", sources: ["test"], words, ...over };
}

describe("locateBlank", () => {
  it("is case-insensitive and reports the original span", () => {
    expect(locateBlank("Bàbá mi ni", "bàbá")).toEqual({ start: 0, end: 4, count: 1 });
  });
  it("returns start -1 when absent and counts repeats", () => {
    expect(locateBlank("mo lọ", "bàbá").start).toBe(-1);
    expect(locateBlank("ọmọ ọmọ", "ọmọ").count).toBe(2);
  });
});

describe("blankOf", () => {
  it("uses sentence.blank when given", () => {
    const w = word(0, { sentence: { yoruba: "x", english: "y", blank: "z" } });
    expect(blankOf(w)).toBe("z");
    expect(blankOf(word(1))).toBe(word(1).yoruba);
  });
});

describe("validateTopic", () => {
  it("accepts a well-formed topic", () => {
    expect(validateTopic(topic())).toEqual([]);
  });
  it("requires exactly 10 words", () => {
    expect(validateTopic(topic({ words: topic().words.slice(0, 9) })).join("\n")).toMatch(/expected 10 words/);
  });
  it("rejects a non-NFC string and an em dash", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, english: "e\u0301 a" };
    t.words[1] = { ...t.words[1]!, english: "a \u2014 b" };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/not NFC/);
    expect(msg).toMatch(/em dash/);
  });
  it("requires a note on needs-review words", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, note: undefined };
    expect(validateTopic(t).join("\n")).toMatch(/needs-review.*note/);
  });
  it("requires the blank to appear exactly once in the sentence", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, sentence: { yoruba: "Mo lọ", english: "I go" } };
    t.words[1] = { ...t.words[1]!, sentence: { yoruba: `${t.words[1]!.yoruba} ${t.words[1]!.yoruba}`, english: "twice" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/t-w0.*does not appear/);
    expect(msg).toMatch(/t-w1.*more than once/);
  });
  it("accepts a sentence-initial capital", () => {
    const t = topic();
    const y = t.words[0]!.yoruba;
    t.words[0] = { ...t.words[0]!, sentence: { yoruba: y[0]!.toUpperCase() + y.slice(1) + " ni", english: "e" } };
    expect(validateTopic(t)).toEqual([]);
  });
  it("rejects duplicate glosses and duplicate Yoruba within a topic", () => {
    const t = topic();
    t.words[1] = { ...t.words[1]!, english: t.words[0]!.english };
    t.words[2] = { ...t.words[2]!, yoruba: t.words[3]!.yoruba, sentence: { yoruba: `Mo rí ${t.words[3]!.yoruba}`, english: "q" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/duplicate gloss/);
    expect(msg).toMatch(/duplicate Yoruba/);
  });
  it("requires non-empty sources, a valid pos, and a sentence translation", () => {
    const t = topic({ sources: [] });
    t.words[0] = { ...t.words[0]!, pos: "bogus" as never, sentence: { ...t.words[0]!.sentence, english: "" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/sources is empty/);
    expect(msg).toMatch(/invalid pos/);
    expect(msg).toMatch(/sentence translation/);
  });
});

describe("validateVocabCatalog", () => {
  it("rejects duplicate word ids across topics and a topic filed under the wrong level", () => {
    const a = topic({ id: "a" });
    const b = topic({ id: "b", level: "beginner" });
    const msg = validateVocabCatalog([{ id: "getting-started", title: "GS", topics: [a, b] }]).join("\n");
    expect(msg).toMatch(/duplicate word id/);
    expect(msg).toMatch(/filed under/);
  });
  it("checks the topics-per-level count only when complete", () => {
    const lv = [{ id: "beginner" as const, title: "B", topics: [{ ...topic(), level: "beginner" as const }] }];
    expect(validateVocabCatalog(lv)).toEqual([]);
    expect(validateVocabCatalog(lv, { complete: true }).join("\n")).toMatch(/expected 5 topics/);
  });
  it("expects four topics in Getting Started, because numbers moved to the Numbers section", () => {
    const lv = [{ id: "getting-started" as const, title: "GS", topics: [topic()] }];
    expect(validateVocabCatalog(lv, { complete: true }).join("\n")).toMatch(/expected 4 topics/);
  });
});
