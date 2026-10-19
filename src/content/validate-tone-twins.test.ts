import { describe, expect, it } from "vitest";
import type { VocabLevel, VocabWord } from "./vocab/types";
import type { ToneTwinEntry } from "./tone-twins";
import { validateToneTwins } from "./validate-tone-twins";

const word = (id: string, yoruba: string): VocabWord => ({
  id, yoruba, english: "x", pos: "noun", confidence: "verified",
  sentence: { yoruba: `${yoruba} wà.`, english: "x" },
});
const vocab: VocabLevel[] = [
  { id: "getting-started", title: "t", topics: [{ id: "t1", level: "getting-started", title: "t", blurb: "b", sources: ["s"], words: [word("word-vehicle", "ọkọ̀"), word("phrase", "ẹ kú àárọ̀")] }] },
];
const entry = (over: Partial<ToneTwinEntry> = {}): ToneTwinEntry => ({
  vocabId: "word-vehicle",
  twins: [{ yoruba: "ọkọ", english: "husband" }, { yoruba: "ọkọ́", english: "hoe" }],
  source: "Test source",
  confidence: "needs-review",
  note: "Check tones.",
  ...over,
});
const errs = (entries: ToneTwinEntry[]) => validateToneTwins(entries, vocab).join("\n");

describe("validateToneTwins", () => {
  it("accepts a valid entry", () => {
    expect(validateToneTwins([entry()], vocab)).toEqual([]);
  });
  it("rejects an unknown vocab id", () => {
    expect(errs([entry({ vocabId: "nope" })])).toContain("unknown vocab id");
  });
  it("rejects a multi-word vocab word", () => {
    expect(errs([entry({ vocabId: "phrase", twins: [{ yoruba: "ẹ kú àárọ́", english: "x" }] })])).toContain("single word");
  });
  it("rejects a twin that differs in more than tone", () => {
    expect(errs([entry({ twins: [{ yoruba: "oko", english: "farm" }] })])).toContain("same letters");
  });
  it("rejects a twin equal to the word or to another twin", () => {
    expect(errs([entry({ twins: [{ yoruba: "ọkọ̀", english: "x" }] })])).toContain("distinct");
    expect(errs([entry({ twins: [{ yoruba: "ọkọ", english: "x" }, { yoruba: "ọkọ", english: "y" }] })])).toContain("distinct");
  });
  it("rejects 0 twins and 4 twins", () => {
    expect(errs([entry({ twins: [] })])).toContain("1 to 3 twins");
    const four = ["ọkọ", "ọkọ́", "ọ̀kọ̀", "ọ̀kọ"].map((y) => ({ yoruba: y, english: "x" }));
    expect(errs([entry({ twins: four })])).toContain("1 to 3 twins");
  });
  it("rejects a duplicate vocabId", () => {
    expect(errs([entry(), entry()])).toContain("duplicate");
  });
  it("rejects an empty source and needs-review without a note", () => {
    expect(errs([entry({ source: "" })])).toContain("source");
    expect(errs([entry({ note: undefined })])).toContain("note");
  });
  it("rejects non-NFC text and em dashes", () => {
    expect(errs([entry({ twins: [{ yoruba: "ọkọ".normalize("NFD"), english: "x" }] })])).toContain("NFC");
    expect(errs([entry({ note: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
  });
  it("rejects a twin whose tone pattern cannot be computed", () => {
    expect(errs([entry({ twins: [{ yoruba: "xq", english: "x" }] })])).toContain("tone pattern");
  });
});
