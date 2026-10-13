import { describe, expect, it } from "vitest";
import { cleanAnswer, nfc, stripMarks, stripTones } from "./normalize";

describe("normalize", () => {
  it("nfc composes decomposed input", () => {
    expect(nfc("ọ")).toBe("ọ");
  });
  it("stripTones removes tone marks but keeps under-dots", () => {
    expect(stripTones("ọkọ̀")).toBe("ọkọ");
    expect(stripTones("ṣọ́ra")).toBe("ṣọra");
  });
  it("stripMarks removes every diacritic", () => {
    expect(stripMarks("ṣọ́ra")).toBe("sora");
  });
  it("cleanAnswer trims, collapses spaces, lowercases, and composes", () => {
    expect(cleanAnswer("  Ẹja   ni ")).toBe("ẹja ni");
    expect(cleanAnswer("ọmọ")).toBe("ọmọ");
  });
});
