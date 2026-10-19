import { describe, expect, it } from "vitest";
import { MINIMAL_PAIRS, SOUNDS, soundsBySection } from "./sounds";
import type { MinimalPair, Sound } from "./sounds";
import { validateSounds } from "./validate-sounds";

const ok: Sound = {
  id: "c-x", section: "consonants", letter: "b", compare: "like 'b' in 'bat'",
  examples: [{ yoruba: "bàbá", english: "father" }, { yoruba: "bàtà", english: "shoe" }],
  confidence: "needs-review", note: "Check.",
};
const pair: MinimalPair = {
  id: "p-x", contrast: "tone", explain: "Only the tone changes.",
  words: [{ yoruba: "ọkọ", english: "husband" }, { yoruba: "ọkọ̀", english: "vehicle" }],
  confidence: "needs-review", note: "Check.",
};

describe("shipped sound content", () => {
  it("passes the validator", () => {
    expect(validateSounds(SOUNDS, MINIMAL_PAIRS)).toEqual([]);
  });
  it("covers vowels plus nasals and consonants, with no tone cards left", () => {
    expect(soundsBySection("vowels").length).toBeGreaterThanOrEqual(12);
    expect(soundsBySection("consonants").length).toBeGreaterThanOrEqual(18);
    expect(SOUNDS.some((s) => s.id.startsWith("t-"))).toBe(false);
  });
  it("words every vowel comparison as like, not close to", () => {
    for (const s of soundsBySection("vowels")) expect(s.compare, s.id).not.toMatch(/close to/i);
    expect(SOUNDS.find((s) => s.id === "v-a")?.compare).toBe("like 'a' in 'father'");
  });
  it("keeps the cards the key consonant section reads", () => {
    for (const id of ["c-gb", "c-p", "c-s", "c-sh"]) expect(SOUNDS.some((s) => s.id === id), id).toBe(true);
  });
  it("has 6 to 10 minimal pairs", () => {
    expect(MINIMAL_PAIRS.length).toBeGreaterThanOrEqual(6);
    expect(MINIMAL_PAIRS.length).toBeLessThanOrEqual(10);
  });
});

describe("validateSounds", () => {
  it("accepts a valid sound and pair", () => {
    expect(validateSounds([ok], [pair])).toEqual([]);
  });
  it("rejects NFD strings", () => {
    const bad = { ...ok, examples: [{ yoruba: "ọkọ̀".normalize("NFD"), english: "x" }, ok.examples[1]!] };
    expect(validateSounds([bad], [])).toEqual(expect.arrayContaining([expect.stringContaining("not NFC")]));
  });
  it("rejects em dashes", () => {
    expect(validateSounds([{ ...ok, compare: "like b \u2014 bat" }], [])).toEqual(
      expect.arrayContaining([expect.stringContaining("em dash")]),
    );
  });
  it("rejects needs-review without a note", () => {
    expect(validateSounds([{ ...ok, note: undefined }], [])).toEqual(expect.arrayContaining([expect.stringContaining("note")]));
  });
  it("rejects duplicate ids and wrong example counts", () => {
    const errs = validateSounds([ok, { ...ok, examples: [ok.examples[0]!] }], []);
    expect(errs.join("\n")).toMatch(/duplicate id/);
    expect(errs.join("\n")).toMatch(/2 to 3 examples/);
  });
  it("allows at most 3 examples on a card", () => {
    const four = [...ok.examples, { yoruba: "bàtà", english: "x" }, { yoruba: "fìlà", english: "y" }];
    expect(validateSounds([{ ...ok, examples: four }], []).join("\n")).toMatch(/2 to 3 examples/);
  });
  it("rejects pairs with identical words or the wrong size", () => {
    const same = { ...pair, words: [pair.words[0]!, pair.words[0]!] };
    expect(validateSounds([], [same]).join("\n")).toMatch(/words must be distinct/);
    expect(validateSounds([], [{ ...pair, words: [pair.words[0]!] }]).join("\n")).toMatch(/2 to 3 words/);
  });
});
