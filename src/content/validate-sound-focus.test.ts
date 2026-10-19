import { describe, expect, it } from "vitest";
import type { Tone } from "./types";
import type { ConsonantSet, ToneCompareRow, ToneCompareWord } from "./sound-focus";
import { validateConsonantSets, validateToneCompare } from "./validate-sound-focus";

const w = (yoruba: string, tone: Tone): ToneCompareWord => ({ yoruba, english: "x", tone });
const row = (over: Partial<ToneCompareRow> = {}): ToneCompareRow => ({
  id: "tc-a", vowel: "a", words: [w("wa", "mid"), w("wá", "high"), w("wà", "low")],
  source: "Test source", confidence: "needs-review", note: "Check.", ...over,
});
const set = (words: string[], over: Partial<ConsonantSet> = {}): ConsonantSet => ({
  id: "cs-x", focus: ["gb"], explain: "Listen for the sound.",
  words: words.map((yoruba) => ({ yoruba, english: "x" })),
  source: "Test source", confidence: "needs-review", note: "Check.", ...over,
});
const rowErrs = (rows: ToneCompareRow[]) => validateToneCompare(rows).join("\n");
const setErrs = (sets: ConsonantSet[]) => validateConsonantSets(sets).join("\n");

describe("validateToneCompare", () => {
  it("accepts valid oral and nasal rows", () => {
    expect(validateToneCompare([
      row(),
      row({ id: "tc-an", vowel: "an", words: [w("kan", "mid"), w("kán", "high"), w("kàn", "low")] }),
      row({ id: "tc-on", vowel: "ọn", words: [w("wọn", "mid"), w("wọ́n", "high"), w("wọ̀n", "low")] }),
    ])).toEqual([]);
  });
  it("rejects tones out of order", () => {
    expect(rowErrs([row({ words: [w("wá", "high"), w("wa", "mid"), w("wà", "low")] })])).toContain("mid, high, low");
  });
  it("rejects words with different letters", () => {
    expect(rowErrs([row({ words: [w("wa", "mid"), w("wá", "high"), w("wi", "low")] })])).toContain("same letters");
  });
  it("rejects a word of more than one syllable", () => {
    expect(rowErrs([row({ words: [w("wa", "mid"), w("wá", "high"), w("wàwà", "low")] })])).toContain("one syllable");
  });
  it("rejects a declared tone that does not match the word", () => {
    expect(rowErrs([row({ words: [w("wa", "mid"), w("wá", "low"), w("wà", "high")] })])).toContain("tone");
  });
  it("rejects a vowel that does not match the row", () => {
    expect(rowErrs([row({ vowel: "e" })])).toContain("vowel");
  });
  it("rejects duplicate ids, an empty source, needs-review without a note", () => {
    expect(rowErrs([row(), row()])).toContain("duplicate");
    expect(rowErrs([row({ source: "" })])).toContain("source");
    expect(rowErrs([row({ note: "" })])).toContain("note");
  });
  it("rejects non-NFC text and em dashes", () => {
    const nfd = w("ṣi".normalize("NFD"), "mid");
    expect(rowErrs([row({ vowel: "i", words: [nfd, w("ṣí", "high"), w("ṣì", "low")] })])).toContain("NFC");
    expect(rowErrs([row({ note: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
  });
});

describe("validateConsonantSets", () => {
  it("accepts bà, gà, gbà and sé, ṣé", () => {
    expect(validateConsonantSets([set(["bà", "gà", "gbà"]), set(["sé", "ṣé"], { id: "cs-y", focus: ["s-sh"] })])).toEqual([]);
  });
  it("rejects 1 word and 5 words", () => {
    expect(setErrs([set(["bà"])])).toContain("2 to 4 words");
    expect(setErrs([set(["bà", "gà", "gbà", "pà", "kà"])])).toContain("2 to 4 words");
  });
  it("rejects words with a different vowel or tone", () => {
    expect(setErrs([set(["bà", "gé"])])).toContain("vowel and tone");
  });
  it("rejects the same onset twice", () => {
    expect(setErrs([set(["bà", "bà"])])).toContain("different consonants");
  });
  it("rejects a multi-syllable word, an empty source, a missing note, bad text", () => {
    expect(setErrs([set(["bàbà", "gàgà"])])).toContain("one syllable");
    expect(setErrs([set(["bà", "gà"], { source: "" })])).toContain("source");
    expect(setErrs([set(["bà", "gà"], { note: "" })])).toContain("note");
    expect(setErrs([set(["bà", "gà"], { explain: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
    expect(setErrs([set(["bà".normalize("NFD"), "gà"])])).toContain("NFC");
  });
});
