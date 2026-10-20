import { describe, expect, it } from "vitest";
import type { Transform } from "./transforms";
import { validateTransforms } from "./validate-transforms";

const entry = (over: Partial<Transform> = {}): Transform => ({
  id: "t-one",
  kind: "negative",
  base: "Mo lọ",
  baseEnglish: "I went",
  answers: ["Mi ò lọ"],
  rule: "kò goes before the verb and shortens to ò after a pronoun.",
  source: "Test source",
  confidence: "needs-review",
  note: "Check the tones.",
  ...over,
});
const errs = (entries: Transform[]) => validateTransforms(entries).join("\n");

describe("validateTransforms", () => {
  it("accepts a valid entry", () => {
    expect(validateTransforms([entry()])).toEqual([]);
  });
  it("rejects a duplicate id", () => {
    expect(errs([entry(), entry()])).toContain("duplicate id");
  });
  it("rejects a missing source", () => {
    expect(errs([entry({ source: " " })])).toContain("needs a source");
  });
  it("rejects needs-review without a note", () => {
    expect(errs([entry({ note: undefined })])).toContain("needs-review needs a note");
  });
  it("rejects empty fields", () => {
    for (const f of ["base", "baseEnglish", "rule"] as const) {
      expect(errs([entry({ [f]: " " })])).toContain(`empty field: ${f}`);
    }
  });
  it("rejects an entry with no answers", () => {
    expect(errs([entry({ answers: [] })])).toContain("needs at least one answer");
  });
  it("rejects a duplicate answer", () => {
    expect(errs([entry({ answers: ["Mi ò lọ", "Mi ò lọ"] })])).toContain("duplicate answer");
  });
  it("rejects strings that are not NFC", () => {
    expect(errs([entry({ answers: ["Mi ò lọ".normalize("NFD")] })])).toContain("not NFC");
  });
  it("rejects an em dash", () => {
    expect(errs([entry({ rule: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
  });
  it("rejects an answer that equals the base once marks are ignored", () => {
    expect(errs([entry({ answers: ["mo lo"] })])).toContain("unchanged sentence would pass");
  });
});
