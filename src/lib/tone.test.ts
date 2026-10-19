import { describe, expect, it } from "vitest";
import { splitOnset, stripTones, syllabify, toneOf } from "./tone";

describe("syllabify", () => {
  it.each([
    ["ọmọ", ["ọ", "mọ"]],
    ["ẹja", ["ẹ", "ja"]],
    ["káàárọ̀", ["ká", "à", "á", "rọ̀"]],
    ["olùkọ́", ["o", "lù", "kọ́"]],
    ["ìgbín", ["ì", "gbín"]],
    ["ń", ["ń"]],
    ["gbọ́", ["gbọ́"]],
    ["ṣọ́ra", ["ṣọ́", "ra"]],
    ["ọ̀nà", ["ọ̀", "nà"]],
  ])("splits %s", (word, expected) => {
    expect(syllabify(word)).toEqual(expected);
  });

  it("accepts decomposed input and returns NFC", () => {
    expect(syllabify("ọmọ".normalize("NFD"))).toEqual(["ọ", "mọ"]);
  });

  it("throws on a consonant with no vowel", () => {
    expect(() => syllabify("kt")).toThrow();
  });
});

describe("toneOf", () => {
  it.each([
    ["ká", "high"],
    ["à", "low"],
    ["ma", "mid"],
    ["ń", "high"],
    ["ǹ", "low"],
    ["gbọ́", "high"],
    ["rọ̀", "low"],
  ] as const)("%s is %s", (syllable, tone) => {
    expect(toneOf(syllable)).toBe(tone);
  });

  it("throws when a syllable has conflicting tone marks", () => {
    expect(() => toneOf("á̀")).toThrow();
  });
});

describe("stripTones", () => {
  it("removes tone marks but keeps under-dots and lowercases", () => {
    expect(stripTones("ọkọ̀")).toBe("ọkọ");
    expect(stripTones("ẹ̀yìn")).toBe("ẹyin");
    expect(stripTones("ÌGBÀ")).toBe("igba");
  });
});

describe("splitOnset", () => {
  it.each([
    ["gbà", "gb", "à"],
    ["pọ́", "p", "ọ́"],
    ["ṣé", "ṣ", "é"],
    ["kàn", "k", "àn"],
    ["ọn", "", "ọn"],
  ])("splits %s into onset %s and rest %s", (word, onset, rest) => {
    expect(splitOnset(word)).toEqual({ onset: onset.normalize("NFC"), rest: rest.normalize("NFC") });
  });
});
