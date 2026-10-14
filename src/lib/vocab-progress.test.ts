import { describe, expect, it } from "vitest";
import {
  emptyVocabProgress, isTopicComplete, loadVocabProgress, recordVocabCompletion, saveVocabProgress, topicsDone,
} from "./vocab-progress";

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

const KEY = "yp:vocab-progress:v1";
const T1 = new Date("2026-10-13T00:00:00Z");
const T2 = new Date("2026-10-14T00:00:00Z");

describe("loadVocabProgress / saveVocabProgress", () => {
  it("returns empty progress for empty storage", () => {
    expect(loadVocabProgress(memoryStorage())).toEqual(emptyVocabProgress);
  });
  it("round-trips a recorded completion", () => {
    const s = memoryStorage();
    const p = recordVocabCompletion(emptyVocabProgress, "food", "quiz", 0.8, T1);
    saveVocabProgress(p, s);
    expect(loadVocabProgress(s)).toEqual(p);
  });
  it.each([
    ["corrupt JSON", "{not json"],
    ["JSON null", "null"],
    ["a string", '"hello"'],
    ["an empty object", "{}"],
    ["non-object topics", '{"topics": 5}'],
    ["array topics", '{"topics": []}'],
  ])("returns empty for %s", (_name, raw) => {
    expect(loadVocabProgress(memoryStorage({ [KEY]: raw }))).toEqual(emptyVocabProgress);
  });
  it("drops malformed entries but keeps valid ones", () => {
    const raw = JSON.stringify({
      topics: {
        food: { quiz: { bestScore: 1, completedAt: "x" }, gap: { bestScore: "hi" } },
        bad: { quiz: 3 },
        worse: 7,
      },
    });
    expect(loadVocabProgress(memoryStorage({ [KEY]: raw }))).toEqual({
      topics: { food: { quiz: { bestScore: 1, completedAt: "x" } } },
    });
  });
  it("returns empty when getItem throws", () => {
    expect(loadVocabProgress(throwingStorage)).toEqual(emptyVocabProgress);
  });
  it("does not throw when setItem throws", () => {
    expect(() => saveVocabProgress(emptyVocabProgress, throwingStorage)).not.toThrow();
  });
  it("does not write the grammar progress key", () => {
    const s = memoryStorage();
    saveVocabProgress(recordVocabCompletion(emptyVocabProgress, "food", "gap", 1, T1), s);
    expect(s.getItem("yp:progress:v1")).toBeNull();
    expect(s.getItem(KEY)).not.toBeNull();
  });
});

describe("recordVocabCompletion", () => {
  it("keeps the best score and first completedAt per mode", () => {
    let p = recordVocabCompletion(emptyVocabProgress, "food", "quiz", 0.6, T1);
    p = recordVocabCompletion(p, "food", "quiz", 0.9, T2);
    p = recordVocabCompletion(p, "food", "quiz", 0.4, T2);
    expect(p.topics.food?.quiz).toEqual({ bestScore: 0.9, completedAt: T1.toISOString() });
  });
  it("does not touch the other mode", () => {
    const a = recordVocabCompletion(emptyVocabProgress, "food", "quiz", 0.6, T1);
    const b = recordVocabCompletion(a, "food", "gap", 0.5, T2);
    expect(b.topics.food?.quiz).toEqual(a.topics.food?.quiz);
    expect(b.topics.food?.gap).toEqual({ bestScore: 0.5, completedAt: T2.toISOString() });
  });
  it("does not mutate its input", () => {
    recordVocabCompletion(emptyVocabProgress, "food", "quiz", 1, T1);
    expect(emptyVocabProgress).toEqual({ topics: {} });
  });
});

describe("isTopicComplete / topicsDone", () => {
  const p = recordVocabCompletion(
    recordVocabCompletion(emptyVocabProgress, "food", "quiz", 1, T1), "family", "gap", 0.5, T1,
  );
  it("is true when either mode is recorded", () => {
    expect(isTopicComplete(p, "food")).toBe(true);
    expect(isTopicComplete(p, "family")).toBe(true);
    expect(isTopicComplete(p, "colors")).toBe(false);
  });
  it("counts completed topics among the given ids", () => {
    expect(topicsDone(p, ["food", "family", "colors"])).toBe(2);
    expect(topicsDone(p, ["colors"])).toBe(0);
    expect(topicsDone(emptyVocabProgress, [])).toBe(0);
  });
});
