import { describe, expect, it } from "vitest";
import { gradeTransform } from "@/lib/transform-grade";
import { TRANSFORMS, type TransformKind } from "./transforms";

describe("TRANSFORMS content", () => {
  it("has at least three items of each kind", () => {
    for (const kind of ["negative", "question", "future", "past"] as TransformKind[]) {
      expect(TRANSFORMS.filter((t) => t.kind === kind).length, kind).toBeGreaterThanOrEqual(3);
    }
  });
  it("never accepts the unchanged base sentence, in either mode", () => {
    for (const t of TRANSFORMS) {
      expect(gradeTransform(t.base, t.answers, "easy"), t.id).toBe("wrong");
      expect(gradeTransform(t.base, t.answers, "advanced"), t.id).toBe("wrong");
    }
  });
  it("accepts every listed answer exactly", () => {
    for (const t of TRANSFORMS) {
      for (const a of t.answers) expect(gradeTransform(a, t.answers, "advanced"), `${t.id}: ${a}`).toBe("right");
    }
  });
  it("has unique ids", () => {
    expect(new Set(TRANSFORMS.map((t) => t.id)).size).toBe(TRANSFORMS.length);
  });
  it("accepts the forms the lessons teach (b-2 and i-1)", () => {
    const accepted: Record<string, string[]> = {
      "neg-mo-lo": ["N kò lọ", "N ò lọ", "Mi ò lọ"],
      "neg-mo-fe-jeun": ["N kò fẹ́ jẹun", "N ò fẹ́ jẹun", "Mi ò fẹ́ jẹun"],
      "fut-mo-ilewe": ["Mo máa lọ sí ilé-ìwé", "Èmi máa lọ sí ilé-ìwé", "Mà á lọ sí ilé-ìwé", "Èmi yóò lọ sí ilé-ìwé"],
      "fut-a-lo": ["A máa lọ", "Àwa máa lọ", "Àwa yóò lọ"],
      "fut-eyin-wa": ["Ẹ̀yin máa wá kí wa", "Ẹ̀yin yóò wá kí wa", "Ẹ máa wá kí wa"],
    };
    for (const [id, answers] of Object.entries(accepted)) {
      const t = TRANSFORMS.find((x) => x.id === id)!;
      for (const a of answers) expect(gradeTransform(a, t.answers, "advanced"), `${id}: ${a}`).toBe("right");
    }
  });
  it("shows the lessons' usual first-person negative, n kò, as the model answer", () => {
    for (const id of ["neg-mo-lo", "neg-mo-fe-jeun"]) {
      expect(TRANSFORMS.find((x) => x.id === id)!.answers[0], id).toMatch(/^N kò /);
    }
  });
});
