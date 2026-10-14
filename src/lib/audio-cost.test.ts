import { describe, expect, it } from "vitest";
import { audioCost } from "./audio-cost";

describe("audioCost", () => {
  it("counts text plus the blank line when the text already ends with a period", () => {
    expect(audioCost("Mo rí ọkọ̀ níbí.")).toBe(16 + 2);
  });
  it("adds one for the period the paste file appends when there is no end punctuation", () => {
    expect(audioCost("ọmọ")).toBe(3 + 1 + 2);
  });
  it("adds no period after a question mark", () => {
    expect(audioCost("Báwo ni ara rẹ?")).toBe(15 + 2);
  });
  it.each(["!", "\u2026", ";", ":"])("adds no period after %s", (p) => {
    expect(audioCost(`omi${p}`)).toBe(4 + 2);
  });
  it("ignores trailing space, like rstrip in prepare_paste.py", () => {
    expect(audioCost("omi.  ")).toBe(audioCost("omi."));
    expect(audioCost("omi ")).toBe(3 + 1 + 2);
  });
  it("costs a period and a blank line for an empty string", () => {
    expect(audioCost("")).toBe(0 + 1 + 2);
  });
  it("counts NFC code points, not decomposed marks", () => {
    // o + dot below + grave, decomposed: NFC folds it to U+1ECD + U+0300 (2 code points).
    const decomposed = "o\u0323\u0300";
    expect([...decomposed].length).toBe(3);
    expect(audioCost(decomposed)).toBe(2 + 1 + 2);
  });
});
