import { describe, expect, it } from "vitest";
import type { ConsonantSet } from "@/content/sound-focus";
import type { MinimalPair } from "@/content/sounds";
import type { ToneTwinEntry } from "@/content/tone-twins";
import type { VocabLevel, VocabWord } from "@/content/vocab/types";
import { buildToneRound, TONE_ROUND_SIZE, type ToneSources } from "./tone-practice";

const n = (s: string) => s.normalize("NFC");
const word = (id: string, yoruba: string, sentence: string, english: string, blank?: string): VocabWord => ({
  id, yoruba: n(yoruba), english: "x", pos: "noun", confidence: "verified",
  sentence: { yoruba: n(sentence), english, ...(blank ? { blank: n(blank) } : {}) },
});
const level = (words: VocabWord[]): VocabLevel[] => [
  { id: "getting-started", title: "t", topics: [{ id: "t1", level: "getting-started", title: "t", blurb: "b", sources: ["s"], words }] },
];
const entry = (vocabId: string, twins: string[]): ToneTwinEntry => ({
  vocabId, twins: twins.map((t) => ({ yoruba: n(t), english: "x" })), source: "s", confidence: "needs-review", note: "n",
});
const pair = (id: string, contrast: "tone" | "sound", words: string[]): MinimalPair => ({
  id, contrast, explain: "x", confidence: "needs-review", note: "n", words: words.map((w) => ({ yoruba: n(w), english: "x" })),
});
const clips = (...texts: string[]) => {
  const set = new Set(texts.map(n));
  return (t: string) => set.has(n(t));
};

const vehicle = word("w-vehicle", "ọkọ̀", "Ọkọ̀ mi pupa.", "My car is red.");
const one = word("w-one", "ọ̀kan", "Imú kan ṣoṣo ni mo ní.", "I have only one nose.", "kan");
const back = word("w-back", "ẹ̀yìn", "Ó wà ní ẹ̀yìn ilé.", "It is behind the house.");
const sources: ToneSources = {
  vocab: level([vehicle, one, back]),
  twins: [entry("w-vehicle", ["ọkọ", "ọkọ́"]), entry("w-one", ["ọkàn"]), entry("w-back", ["ẹyin"])],
  pairs: [pair("p-igba", "tone", ["igba", "ìgbà", "igbá"]), pair("p-oko", "tone", ["ọkọ", "ọkọ̀"]), pair("p-sound", "sound", ["oko", "ọkọ"])],
  sets: [],
};
const allClips = clips("ọkọ̀", "ọ̀kan", "ẹ̀yìn", "igba", "ìgbà", "igbá", "ọkọ", "ọkọ́", "oko", "Ọkọ̀ mi pupa.", "Imú kan ṣoṣo ni mo ní.", "Ó wà ní ẹ̀yìn ilé.");
const round = (mode: "words" | "sentences", has = allClips, src = sources) => buildToneRound(mode, src, "seed", has, 100);
const byAnswer = (qs: ReturnType<typeof round>, a: string) => qs.filter((q) => q.answer === n(a));

describe("buildToneRound, words mode", () => {
  it("gives a vocab entry's word as audioText and answer, with word plus twins as choices", () => {
    const q = byAnswer(round("words"), "ọkọ̀")[0]!;
    expect(q.mode).toBe("words");
    expect(q.audioText).toBe(n("ọkọ̀"));
    expect([...q.choices].sort()).toEqual(["ọkọ", "ọkọ̀", "ọkọ́"].map(n).sort());
    expect(q.prompt).toBeNull();
    expect(q.english).toBeNull();
    expect(q.sentence).toBeNull();
  });
  it("skips a vocab word that has no word clip", () => {
    const qs = round("words", clips("ọkọ̀", "ọ̀kan"));
    expect(byAnswer(qs, "ẹ̀yìn")).toHaveLength(0);
  });
  it("adds one question per word of a tone pair with at least two clips, and skips weaker pairs and sound pairs", () => {
    const qs = round("words");
    expect(["igba", "ìgbà", "igbá"].map((w) => byAnswer(qs, w).length)).toEqual([1, 1, 1]);
    expect(byAnswer(qs, "igba")[0]!.choices).toHaveLength(3);
    expect(byAnswer(round("words", clips("igba")), "igba")).toHaveLength(0);
    expect(byAnswer(qs, "oko")).toHaveLength(0);
  });
  it("asks a pair word that is also a vocab entry word only once, using the vocab entry's choices", () => {
    const qs = round("words");
    const hits = byAnswer(qs, "ọkọ̀");
    expect(hits).toHaveLength(1);
    expect(hits[0]!.choices).toHaveLength(3);
    expect(new Set(qs.map((q) => q.answer)).size).toBe(qs.length);
  });
});

describe("buildToneRound, sentences mode", () => {
  it("plays the sentence, blanks the word once, and carries the English translation", () => {
    const q = byAnswer(round("sentences"), "ẹ̀yìn")[0]!;
    expect(q.audioText).toBe(n("Ó wà ní ẹ̀yìn ilé."));
    expect(q.prompt).toBe(n("Ó wà ní ___ ilé."));
    expect(q.english).toBe("It is behind the house.");
  });
  it("finds a capitalized target at the start of the sentence and keeps the answer lowercase", () => {
    const q = byAnswer(round("sentences"), "ọkọ̀")[0]!;
    expect(q.prompt).toBe(n("___ mi pupa."));
    expect(q.answer).toBe(n("ọkọ̀"));
    expect(q.sentence).toBe(n("Ọkọ̀ mi pupa."));
  });
  it("skips a word whose blank differs from the word, which words mode still includes", () => {
    expect(byAnswer(round("sentences"), "ọ̀kan")).toHaveLength(0);
    expect(byAnswer(round("words"), "ọ̀kan")).toHaveLength(1);
  });
  it("skips a word without a sentence clip and never uses pair-only words", () => {
    const qs = round("sentences", clips("ọkọ̀", "ẹ̀yìn", "igba", "ìgbà", "Ọkọ̀ mi pupa."));
    expect(qs.map((q) => q.answer)).toEqual([n("ọkọ̀")]);
  });
});

describe("buildToneRound, rounds", () => {
  const big: ToneSources = {
    vocab: level(Array.from({ length: 15 }, (_, i) => word(`w${i}`, `bá${i}`, `Mo rí bá${i} ná.`, "x"))),
    twins: Array.from({ length: 15 }, (_, i) => entry(`w${i}`, [`bà${i}`])),
    pairs: [],
    sets: [],
  };
  const all = () => true;
  it("is at most the round size, honours max, and has unique ids", () => {
    const qs = buildToneRound("words", big, "a", all);
    expect(qs).toHaveLength(TONE_ROUND_SIZE);
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    expect(buildToneRound("words", big, "a", all, 3)).toHaveLength(3);
  });
  it("is shorter when the pool is smaller than the round size", () => {
    expect(buildToneRound("words", sources, "a", allClips).length).toBeLessThan(TONE_ROUND_SIZE);
  });
  it("is deterministic for a seed and differs between seeds", () => {
    const ids = (seed: string) => buildToneRound("words", big, seed, all).map((q) => q.id);
    expect(ids("a")).toEqual(ids("a"));
    expect(ids("a")).not.toEqual(ids("b"));
  });
});

describe("buildToneRound, sounds mode", () => {
  const cset = (id: string, words: string[]): ConsonantSet => ({
    id, focus: ["gb"], explain: "e", source: "s", confidence: "needs-review", note: "n",
    words: words.map((w) => ({ yoruba: n(w), english: "meaning" })),
  });
  const withSets = (sets: ConsonantSet[]): ToneSources => ({ ...sources, sets });
  const sounds = (src: ToneSources, has: (t: string) => boolean) => buildToneRound("sounds", src, "seed", has, 100);

  it("asks one question per word with a clip, with the set's words as choices and no English", () => {
    const qs = sounds(withSets([cset("cs-gb", ["bà", "gà", "gbà"])]), clips("bà", "gà", "gbà"));
    expect(qs.map((q) => q.answer).sort()).toEqual(["bà", "gà", "gbà"].map(n).sort());
    const q = byAnswer(qs, "gbà")[0]!;
    expect(q.mode).toBe("sounds");
    expect(q.audioText).toBe(n("gbà"));
    expect([...q.choices].sort()).toEqual(["bà", "gà", "gbà"].map(n).sort());
    expect(q.prompt).toBeNull();
    expect(q.english).toBeNull();
    expect(q.sentence).toBeNull();
  });
  it("skips a set with fewer than two clips", () => {
    expect(sounds(withSets([cset("cs-sh", ["sé", "ṣé"])]), clips("sé"))).toEqual([]);
  });
  it("never includes vocab twin or tone pair questions", () => {
    const qs = sounds(withSets([cset("cs-gb", ["bà", "gà"])]), allClips);
    expect(qs.map((q) => q.answer).sort()).toEqual([]);
    const both = sounds(withSets([cset("cs-gb", ["bà", "gà"])]), clips("bà", "gà", "ọkọ̀", "igba", "ìgbà"));
    expect(both.map((q) => q.answer).sort()).toEqual(["bà", "gà"].map(n).sort());
  });
  it("asks a word that is in two sets only once", () => {
    const qs = sounds(withSets([cset("cs-a", ["gbọ́", "bọ́"]), cset("cs-b", ["gbọ́", "kọ́"])]), clips("gbọ́", "bọ́", "kọ́"));
    expect(qs.map((q) => q.answer).sort()).toEqual(["bọ́", "gbọ́", "kọ́"].map(n).sort());
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
  });
});
