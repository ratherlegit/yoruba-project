import { describe, expect, it } from "vitest";
import { evalBuild, type NumberEntry, type NumberPhrase, type NumberStep } from "./numbers";
import { validateNumbers } from "./validate-numbers";

const entry = (over: Partial<NumberEntry> = {}): NumberEntry => ({
  id: "n-15", value: 15, yoruba: "ẹ̀ẹ́dógún", after: [], answers: ["ẹ̀ẹ́dógún"], build: "20-5", step: 2,
  source: "Test source", confidence: "needs-review", note: "Check the tones.", ...over,
});
const phrase = (over: Partial<NumberPhrase> = {}): NumberPhrase => ({
  id: "p-1", step: 5, prompt: "two children", numeral: "", answers: ["ọmọ méjì"],
  source: "Test source", confidence: "needs-review", note: "n", ...over,
});
const step = (over: Partial<NumberStep> = {}): NumberStep => ({
  id: "s-2", title: "Step", rule: "A rule.", entryIds: ["n-15"], phraseIds: [], ...over,
});
const errs = (e: NumberEntry[], p: NumberPhrase[] = [], s: NumberStep[] = [step()]) => validateNumbers(e, p, s).join("\n");

// A full, valid step 1 (values 1 to 10) with distinct answers.
const ten = (skip?: number): NumberEntry[] =>
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
    .map((w, i) => entry({ id: `n-${i + 1}`, value: i + 1, yoruba: `wor${w}`, answers: [`wor${w}`], build: "", step: 1 }))
    .filter((e) => e.value !== skip);

describe("evalBuild", () => {
  it("evaluates the build expressions", () => {
    expect(evalBuild("20-5")).toBe(15);
    expect(evalBuild("20*3-10")).toBe(50);
    expect(evalBuild("200×5")).toBe(1000);
    expect(evalBuild("20x2")).toBe(40);
    expect(evalBuild("(20-5)*2")).toBe(30);
    expect(evalBuild(" 10 + 1 ")).toBe(11);
  });
  it("returns null for anything that is not an expression", () => {
    for (const bad of ["", "2^3", "20-", "alert(1)", "20 5", "(20-5"]) expect(evalBuild(bad), bad).toBeNull();
  });
});

describe("validateNumbers", () => {
  it("accepts valid data", () => {
    expect(validateNumbers([entry()], [phrase()], [step(), step({ id: "s-5", entryIds: [], phraseIds: ["p-1"] })])).toEqual([]);
  });
  it("rejects duplicate ids and duplicate values", () => {
    expect(errs([entry(), entry()])).toContain("duplicate id");
    expect(errs([entry(), entry({ id: "n-x", answers: ["other"], yoruba: "other" })])).toContain("duplicate value");
    expect(errs([entry()], [phrase(), phrase()], [step()])).toContain("duplicate id");
  });
  it("rejects a missing source and a missing note", () => {
    expect(errs([entry({ source: " " })])).toContain("needs a source");
    expect(errs([entry({ note: undefined })])).toContain("needs-review needs a note");
  });
  it("rejects empty fields", () => {
    expect(errs([entry({ yoruba: " " })])).toContain("empty field: yoruba");
    expect(errs([entry({ answers: [] })])).toContain("needs at least one answer");
  });
  it("rejects non-NFC strings, em dashes and the stray ɡ glyph", () => {
    expect(errs([entry({ answers: ["ẹ̀ẹ́dógún".normalize("NFD")] })])).toContain("not NFC");
    expect(errs([entry({ note: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
    expect(errs([entry({ answers: ["ọɡbọ̀n"] })])).toContain("stray ɡ");
  });
  it("checks that the build equals the value", () => {
    expect(errs([entry({ build: "20-4" })])).toContain("build does not equal value");
    expect(errs([entry({ build: "abc" })])).toContain("build is not an expression");
  });
  it("rejects an answer that belongs to two numbers", () => {
    const a = entry({ id: "n-a", value: 15, answers: ["ẹ̀ẹ́dógún"] });
    const b = entry({ id: "n-b", value: 16, build: "20-4", answers: ["eedogun"] });
    expect(errs([a, b], [], [step({ entryIds: ["n-a", "n-b"] })])).toContain("answer belongs to two numbers");
  });
  it("rejects steps that point at unknown ids", () => {
    expect(errs([entry()], [], [step({ entryIds: ["nope"] })])).toContain("unknown entry id");
    expect(errs([entry()], [], [step({ phraseIds: ["nope"] })])).toContain("unknown phrase id");
  });
  it("requires step 1 to be exactly 1 to 10 when there is data", () => {
    const s = [step({ id: "s-1", entryIds: ten().map((e) => e.id) })];
    expect(validateNumbers(ten(), [], s)).toEqual([]);
    expect(validateNumbers(ten(5), [], s.map((x) => ({ ...x, entryIds: ten(5).map((e) => e.id) })))).toEqual(
      expect.arrayContaining([expect.stringContaining("step 1 must be exactly 1 to 10")]),
    );
  });
});
