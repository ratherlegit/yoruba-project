import { describe, expect, it } from "vitest";
import { comparable, foldMarks, gradeTransform } from "./transform-grade";

const NEG = ["Mi ò lọ"];

describe("gradeTransform", () => {
  it("accepts the exact answer in advanced mode", () => {
    expect(gradeTransform("Mi ò lọ", NEG, "advanced")).toBe("right");
  });
  it("ignores form, case, spacing and final punctuation", () => {
    expect(gradeTransform("Mi ò lọ".normalize("NFD"), NEG, "advanced")).toBe("right");
    expect(gradeTransform("MI Ò LỌ", NEG, "advanced")).toBe("right");
    expect(gradeTransform("  mi   ò  lọ ", NEG, "advanced")).toBe("right");
    expect(gradeTransform("Mi ò lọ.", NEG, "advanced")).toBe("right");
  });
  it("calls missing dots or wrong tones close in advanced mode", () => {
    expect(gradeTransform("Mi o lo", NEG, "advanced")).toBe("close");
    expect(gradeTransform("Mi ò lo", NEG, "advanced")).toBe("close");
    expect(gradeTransform("Mi ò lọ́", NEG, "advanced")).toBe("close");
  });
  it("calls different words wrong", () => {
    expect(gradeTransform("Mo ò lọ", NEG, "advanced")).toBe("wrong");
    expect(gradeTransform("Mo o lo", NEG, "easy")).toBe("wrong");
  });
  it("ignores dots and tones in easy mode", () => {
    expect(gradeTransform("Mi o lo", NEG, "easy")).toBe("right");
    expect(gradeTransform("mi ò lọ", NEG, "easy")).toBe("right");
    expect(gradeTransform("Mi ò lọ́", NEG, "easy")).toBe("right");
  });
  it("accepts any of several answers", () => {
    const fut = ["Mo máa lọ", "Mo yóò lọ"];
    expect(gradeTransform("Mo yóò lọ", fut, "advanced")).toBe("right");
    expect(gradeTransform("Mo máa lọ", fut, "advanced")).toBe("right");
    expect(gradeTransform("mo yoo lo", fut, "advanced")).toBe("close");
    expect(gradeTransform("Mo ń lọ", fut, "advanced")).toBe("wrong");
  });
  it("ignores a final question mark", () => {
    expect(gradeTransform("se o lo", ["Ṣé o lọ?"], "easy")).toBe("right");
    expect(gradeTransform("Ṣé o lọ", ["Ṣé o lọ?"], "advanced")).toBe("right");
  });
  it("treats empty input as wrong", () => {
    expect(gradeTransform("", NEG, "easy")).toBe("wrong");
    expect(gradeTransform("   ", NEG, "advanced")).toBe("wrong");
  });
});

describe("comparable and foldMarks", () => {
  it("normalise as documented", () => {
    expect(comparable("  Ṣé  O lọ? ")).toBe("ṣé o lọ");
    expect(foldMarks("Ṣé o lọ́?")).toBe("se o lo");
  });
});
