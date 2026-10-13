import { describe, expect, it } from "vitest";
import {
  emptyProgress, isLevelUnlocked, loadProgress, recordCompletion, saveProgress,
} from "./progress";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = { ...initial };
  return {
    get length() { return Object.keys(data).length; },
    clear: () => { for (const k of Object.keys(data)) delete data[k]; },
    getItem: (k) => (k in data ? data[k]! : null),
    key: (i) => Object.keys(data)[i] ?? null,
    removeItem: (k) => { delete data[k]; },
    setItem: (k, v) => { data[k] = v; },
  };
}

const throwingStorage: Storage = {
  length: 0,
  clear() { throw new Error("blocked"); },
  getItem() { throw new Error("blocked"); },
  key() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
};

const LEVELS = [
  { id: "l1", lessons: [{ id: "a" }, { id: "b" }] },
  { id: "l2", lessons: [{ id: "c" }] },
  { id: "l3", lessons: [{ id: "d" }] },
];

describe("loadProgress / saveProgress", () => {
  it("round-trips", () => {
    const s = memoryStorage();
    const p = recordCompletion(emptyProgress, "a", 0.75, new Date("2026-10-13T00:00:00Z"));
    saveProgress(p, s);
    expect(loadProgress(s)).toEqual(p);
  });
  it("returns empty progress when storage throws", () => {
    expect(loadProgress(throwingStorage)).toEqual(emptyProgress);
  });
  it("does not throw when saving to blocked storage", () => {
    expect(() => saveProgress(emptyProgress, throwingStorage)).not.toThrow();
  });
  it("returns empty progress for corrupt JSON", () => {
    expect(loadProgress(memoryStorage({ "yp:progress:v1": "{not json" }))).toEqual(emptyProgress);
  });
  it("returns empty progress for the wrong shape", () => {
    expect(loadProgress(memoryStorage({ "yp:progress:v1": '{"completedLessons":5}' }))).toEqual(emptyProgress);
  });
  it("falls back to system for an unknown theme", () => {
    const s = memoryStorage({ "yp:progress:v1": '{"completedLessons":{},"skipAhead":false,"theme":"neon"}' });
    expect(loadProgress(s).theme).toBe("system");
  });
});

describe("recordCompletion", () => {
  it("keeps the higher score", () => {
    const first = recordCompletion(emptyProgress, "a", 0.9);
    const second = recordCompletion(first, "a", 0.5);
    expect(second.completedLessons["a"]!.bestScore).toBe(0.9);
  });
  it("does not mutate its input", () => {
    recordCompletion(emptyProgress, "a", 1);
    expect(emptyProgress.completedLessons).toEqual({});
  });
});

describe("isLevelUnlocked", () => {
  it("always unlocks the first level", () => {
    expect(isLevelUnlocked(LEVELS, emptyProgress, "l1")).toBe(true);
  });
  it("locks a level until every lesson of the previous level is complete", () => {
    let p = recordCompletion(emptyProgress, "a", 1);
    expect(isLevelUnlocked(LEVELS, p, "l2")).toBe(false);
    p = recordCompletion(p, "b", 1);
    expect(isLevelUnlocked(LEVELS, p, "l2")).toBe(true);
    expect(isLevelUnlocked(LEVELS, p, "l3")).toBe(false);
  });
  it("unlocks everything with skipAhead", () => {
    expect(isLevelUnlocked(LEVELS, { ...emptyProgress, skipAhead: true }, "l3")).toBe(true);
  });
  it("returns false for an unknown level", () => {
    expect(isLevelUnlocked(LEVELS, emptyProgress, "nope")).toBe(false);
  });
});
