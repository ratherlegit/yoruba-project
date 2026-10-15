import { describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import type { VocabLevel, VocabWord } from "@/content/vocab/types";
import { audioKey } from "./audio";
import { collectAudioStrings, collectVocabAudioStrings } from "./audio-strings";

describe("collectAudioStrings", () => {
  const strings = collectAudioStrings(LEVELS);
  it("excludes one-letter strings", () => {
    for (const k of ["a", "ẹ", "o", "ó"]) expect(strings.map((s) => s.key)).not.toContain(k);
    expect(strings.every((s) => [...s.key].length > 1)).toBe(true);
  });
  it("has unique NFC keys", () => {
    expect(new Set(strings.map((s) => s.key)).size).toBe(strings.length);
    expect(strings.every((s) => s.key === s.key.normalize("NFC"))).toBe(true);
  });
});

const vw = (id: string, yoruba: string, sentence: string): VocabWord => ({
  id, yoruba, english: "x", pos: "noun", sentence: { yoruba: sentence, english: "y" }, confidence: "verified",
});
const fixture: VocabLevel[] = [{
  id: "getting-started", title: "GS",
  topics: [{
    id: "t", level: "getting-started", title: "T", blurb: "b", sources: ["s"],
    words: [
      vw("a", "ìdí", "Ìdí rẹ̀ dára."),
      vw("b", "ilé ẹ̀kọ́", "Mo lọ sí ilé ẹ̀kọ́."),
      vw("c", "ẹ", "Ẹ jókòó."),
      vw("d", "ìdí", "Ìdí mi nìyí."),
      vw("e", "is", "Ọmọ náà wà ní ilé."),
    ],
  }],
}];

describe("collectVocabAudioStrings", () => {
  const out = collectVocabAudioStrings(fixture);
  it("returns words and sentences with the right groups", () => {
    expect(out.filter((s) => s.group === "vocab-word").map((s) => s.text)).toEqual(["ìdí", "ilé ẹ̀kọ́", "is"]);
    expect(out.filter((s) => s.group === "vocab-sentence").map((s) => s.text)).toContain("Mo lọ sí ilé ẹ̀kọ́.");
  });
  it("uses audioKey of the text as the key", () => {
    for (const s of out) expect(s.key).toBe(audioKey(s.text));
  });
  it("has unique NFC keys", () => {
    expect(new Set(out.map((s) => s.key)).size).toBe(out.length);
    expect(out.every((s) => s.key === s.key.normalize("NFC"))).toBe(true);
  });
  it("keeps spaces in multi-word entries", () => {
    expect(out.map((s) => s.key)).toContain("ilé ẹ̀kọ́");
  });
  it("drops one-letter words but does not apply the English-word filter", () => {
    const keys = out.map((s) => s.key);
    expect(keys).not.toContain("ẹ");
    expect(keys).toContain("ìdí");
    expect(keys).toContain("is");
  });
  it("records the first level that uses each string", () => {
    expect(out.every((s) => s.level === "getting-started")).toBe(true);
    const two: VocabLevel[] = [
      { ...fixture[0]! },
      { id: "beginner", title: "B", topics: [{ ...fixture[0]!.topics[0]!, id: "u", level: "beginner",
        words: [vw("z", "ìdí", "Ìdí tuntun."), vw("y", "ọgbà", "Mo wà nínú ọgbà.")] }] },
    ];
    const byKey = Object.fromEntries(collectVocabAudioStrings(two).map((s) => [s.key, s.level]));
    expect(byKey["ìdí"]).toBe("getting-started");
    expect(byKey["ọgbà"]).toBe("beginner");
  });
});
