import { describe, expect, it } from "vitest";
import { showBuild, showBuildWords } from "./show-build";

describe("showBuild", () => {
  it("reads like arithmetic", () => {
    expect(showBuild("20*2")).toBe("20 × 2");
    expect(showBuild("20*3-10")).toBe("20 × 3 − 10");
    expect(showBuild("10+1")).toBe("10 + 1");
    expect(showBuild("200*5-100")).toBe("200 × 5 − 100");
    expect(showBuild("30-5")).toBe("30 − 5");
  });
});

describe("showBuildWords", () => {
  it("puts the Yoruba word for each number in the expression", () => {
    expect(showBuildWords("20*3-10")).toBe("ogún × ẹ̀ta − ẹ̀wá");
    expect(showBuildWords("10+1")).toBe("ẹ̀wá + ọ̀kan");
  });
  it("keeps digits for a number with no entry", () => {
    expect(showBuildWords("7+1")).toBe("èje + ọ̀kan");
    expect(showBuildWords("999+1")).toBe("999 + ọ̀kan");
  });
});
