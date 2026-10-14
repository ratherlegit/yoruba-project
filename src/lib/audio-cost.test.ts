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
  it("counts NFC code points, not decomposed marks", () => {
    expect(audioCost("ọ̀".normalize("NFD"))).toBe(audioCost("ọ̀".normalize("NFC")));
  });
});
