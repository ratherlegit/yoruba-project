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
});
