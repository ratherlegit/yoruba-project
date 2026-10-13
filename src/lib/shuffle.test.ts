import { describe, expect, it } from "vitest";
import { seededShuffle } from "./shuffle";

describe("seededShuffle", () => {
  const items = ["a", "b", "c", "d", "e"];
  it("is deterministic for a seed", () => {
    expect(seededShuffle(items, "x")).toEqual(seededShuffle(items, "x"));
  });
  it("returns a permutation", () => {
    expect([...seededShuffle(items, "y")].sort()).toEqual([...items].sort());
  });
  it("never returns the input order for two or more items", () => {
    for (const seed of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
      expect(seededShuffle(["x", "y"], seed)).not.toEqual(["x", "y"]);
      expect(seededShuffle(items, seed)).not.toEqual(items);
    }
  });
  it("does not mutate the input", () => {
    const copy = [...items];
    seededShuffle(items, "z");
    expect(items).toEqual(copy);
  });
});
