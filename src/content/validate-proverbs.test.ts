import { describe, expect, it } from "vitest";
import type { Proverb } from "./proverbs";
import { validateProverbs } from "./validate-proverbs";

const entry = (over: Partial<Proverb> = {}): Proverb => ({
  id: "p-one",
  yoruba: "Ẹni tó bá jẹun pẹ̀lú ọba ni yóò mọ̀ ọ̀rọ̀ rẹ̀.",
  literal: "The one who eats with the king will know his affairs.",
  meaning: "Closeness to a person teaches you what they are really like.",
  usedWhen: "When someone claims to know a person well without having spent time with them.",
  wrong: ["Kings should always eat alone.", "Food tastes better in company."],
  source: "Test source",
  confidence: "needs-review",
  note: "Check tones.",
  ...over,
});
const errs = (entries: Proverb[]) => validateProverbs(entries).join("\n");

describe("validateProverbs", () => {
  it("accepts a valid entry", () => {
    expect(validateProverbs([entry()])).toEqual([]);
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
  it("rejects two identical wrong options", () => {
    expect(errs([entry({ wrong: ["Same.", "Same."] })])).toContain("wrong must be two distinct options");
  });
  it("rejects a wrong option equal to the meaning", () => {
    const e = entry();
    expect(errs([entry({ wrong: [e.meaning, "Other."] })])).toContain("wrong option equals the meaning");
  });
  it("rejects a string that is not NFC", () => {
    expect(errs([entry({ yoruba: "ọ" })])).toContain("not NFC");
  });
  it("rejects an em dash", () => {
    expect(errs([entry({ meaning: "Be kind " + String.fromCharCode(0x2014) + " always." })])).toContain("em dash");
  });
  it.each(["yoruba", "literal", "meaning", "usedWhen"] as const)("rejects an empty %s", (field) => {
    expect(errs([entry({ [field]: " " })])).toContain("empty field");
  });
});
