import { describe, expect, it } from "vitest";
import { seededShuffle, seededShuffleAvoiding } from "./shuffle";

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

describe("seededShuffleAvoiding", () => {
  it("never equals the avoid order, for two words", () => {
    for (let n = 0; n < 40; n++) {
      expect(seededShuffleAvoiding(["a", "b"], `s${n}`, ["a", "b"])).toEqual(["b", "a"]);
      expect(seededShuffleAvoiding(["b", "a"], `s${n}`, ["a", "b"])).toEqual(["b", "a"]);
    }
  });
  it("avoids the order even with duplicate words when another arrangement exists", () => {
    for (let n = 0; n < 40; n++) {
      const out = seededShuffleAvoiding(["a", "a", "b"], `d${n}`, ["a", "a", "b"]);
      expect(out).not.toEqual(["a", "a", "b"]);
      expect([...out].sort()).toEqual(["a", "a", "b"]);
    }
  });
  it("returns the only arrangement when all words are identical", () => {
    expect(seededShuffleAvoiding(["a", "a"], "x", ["a", "a"])).toEqual(["a", "a"]);
  });
  it("is deterministic and does not mutate the input", () => {
    const items = ["a", "b", "c", "d"];
    expect(seededShuffleAvoiding(items, "k", ["a", "b", "c", "d"])).toEqual(seededShuffleAvoiding(items, "k", ["a", "b", "c", "d"]));
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});
