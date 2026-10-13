import { describe, expect, it } from "vitest";
import { checkAnswer, feedbackFor } from "./answer";

describe("checkAnswer", () => {
  it("accepts an exact match", () => {
    expect(checkAnswer("ọmọ", "ọmọ")).toBe("correct");
  });
  it("accepts decomposed (NFD) input, as pasted from the web", () => {
    expect(checkAnswer("ọmọ".normalize("NFD"), "ọmọ")).toBe("correct");
    expect(checkAnswer("káàárọ̀".normalize("NFD"), "káàárọ̀")).toBe("correct");
  });
  it("ignores case and surrounding whitespace", () => {
    expect(checkAnswer("  Ẹja ", "ẹja")).toBe("correct");
  });
  it("is tone-sensitive and says so", () => {
    expect(checkAnswer("ọkọ", "ọkọ̀")).toBe("tone");
    expect(checkAnswer("ọkọ́", "ọkọ̀")).toBe("tone");
  });
  it("flags missing under-dots as a mark error", () => {
    expect(checkAnswer("omo", "ọmọ")).toBe("mark");
  });
  it("marks different words wrong", () => {
    expect(checkAnswer("ẹja", "ọmọ")).toBe("wrong");
  });
});

describe("feedbackFor", () => {
  it("names the tone problem", () => {
    expect(feedbackFor("tone", "ọkọ̀")).toMatch(/tone/i);
  });
  it("names the under-dot problem", () => {
    expect(feedbackFor("mark", "ọmọ")).toMatch(/dot/i);
  });
  it("shows the correct answer when wrong", () => {
    expect(feedbackFor("wrong", "ọmọ")).toContain("ọmọ");
  });
  it("contains no em dash", () => {
    for (const k of ["correct", "tone", "mark", "wrong"] as const) {
      expect(feedbackFor(k, "x")).not.toContain("—");
    }
  });
});
