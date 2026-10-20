import { describe, expect, it } from "vitest";
import { insertChar } from "./insert-char";

const ACUTE = "́";
const GRAVE = "̀";

describe("insertChar", () => {
  it("inserts a letter at the caret and moves the caret after it", () => {
    expect(insertChar("mlo", 1, "ọ")).toEqual({ value: "mọlo", caret: 2 });
  });
  it("puts an acute on the letter before the caret as NFC", () => {
    const r = insertChar("ma", 2, ACUTE);
    expect(r.value).toBe("má");
    expect(r.value).toBe(r.value.normalize("NFC"));
    expect(r.caret).toBe(2);
  });
  it("puts a grave on a dotted vowel", () => {
    const r = insertChar("lọ", 2, GRAVE);
    expect(r.value).toBe("lọ̀".normalize("NFC"));
  });
  it("ignores a tone mark with nothing before the caret", () => {
    expect(insertChar("ma", 0, ACUTE)).toEqual({ value: "ma", caret: 0 });
  });
  it("ignores a tone mark right after a space", () => {
    expect(insertChar("mo lọ", 3, GRAVE)).toEqual({ value: "mo lọ", caret: 3 });
  });
  it("clamps the caret to the string", () => {
    expect(insertChar("mo", 99, "ṣ")).toEqual({ value: "moṣ", caret: 3 });
    expect(insertChar("mo", -4, "ẹ")).toEqual({ value: "ẹmo", caret: 1 });
  });
});
