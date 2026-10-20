import { describe, expect, it } from "vitest";
import {
  accuracy, currentRun, dayKey, emptyStats, loadStats, practiceAnswers, practiceDays, proverbSummary,
  recordProverbAnswer, recordToneAnswer, recordTransformResult, saveStats, toneSummary, transformSummary,
  type Stats, withExtraDays, recordNumbersAnswer, recordNumbersRound, numbersSummary,
} from "./stats";

const d = (s: string) => new Date(`${s}T12:00:00`);

function memory(initial: Record<string, string> = {}): Storage {
  const m = { ...initial };
  return {
    getItem: (k: string) => m[k] ?? null,
    setItem: (k: string, v: string) => { m[k] = v; },
    removeItem: (k: string) => { delete m[k]; },
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage;
}
const throwing = {
  getItem: () => { throw new Error("blocked"); },
  setItem: () => { throw new Error("blocked"); },
} as unknown as Storage;

describe("load and save", () => {
  it("starts empty", () => {
    expect(emptyStats.tone.words).toEqual({ answered: 0, correct: 0 });
    expect(emptyStats.days).toEqual([]);
  });
  it("loads empty from null, missing, malformed, wrong-shaped and throwing storage", () => {
    expect(loadStats(null)).toEqual(emptyStats);
    expect(loadStats(memory())).toEqual(emptyStats);
    expect(loadStats(memory({ "yp:stats:v1": "{nope" }))).toEqual(emptyStats);
    expect(loadStats(memory({ "yp:stats:v1": "[1,2]" }))).toEqual(emptyStats);
    expect(loadStats(memory({ "yp:stats:v1": JSON.stringify({ tone: 4, days: "x" }) }))).toEqual(emptyStats);
    expect(loadStats(throwing)).toEqual(emptyStats);
  });
  it("drops bad entries but keeps good ones", () => {
    const raw = JSON.stringify({
      tone: { words: { answered: 2, correct: 1 }, sentences: { answered: "x" } },
      proverbs: { good: { correct: true }, bad: { correct: "yes" } },
      transform: {
        "easy:a": { kind: "negative", mode: "easy", result: "right" },
        "easy:b": { kind: "nope", mode: "easy", result: "right" },
      },
      days: ["2026-10-01", 5, "2026-10-01", "not a day"],
    });
    const s = loadStats(memory({ "yp:stats:v1": raw }));
    expect(s.tone.words).toEqual({ answered: 2, correct: 1 });
    expect(s.tone.sentences).toEqual({ answered: 0, correct: 0 });
    expect(Object.keys(s.proverbs)).toEqual(["good"]);
    expect(Object.keys(s.transform)).toEqual(["easy:a"]);
    expect(s.days).toEqual(["2026-10-01"]);
  });
  it("round-trips and tolerates a throwing store", () => {
    const store = memory();
    const s = recordProverbAnswer(emptyStats, "p1", true, d("2026-10-02"));
    saveStats(s, store);
    expect(loadStats(store)).toEqual(s);
    expect(() => saveStats(s, throwing)).not.toThrow();
  });
});

describe("recording", () => {
  it("counts every tone answer and the day once", () => {
    let s = recordToneAnswer(emptyStats, "words", true, d("2026-10-02"));
    s = recordToneAnswer(s, "words", false, d("2026-10-02"));
    s = recordToneAnswer(s, "sounds", true, d("2026-10-02"));
    expect(s.tone.words).toEqual({ answered: 2, correct: 1 });
    expect(s.tone.sounds).toEqual({ answered: 1, correct: 1 });
    expect(s.days).toEqual(["2026-10-02"]);
  });
  it("keeps the first proverb answer", () => {
    let s = recordProverbAnswer(emptyStats, "p1", false, d("2026-10-02"));
    s = recordProverbAnswer(s, "p1", true, d("2026-10-03"));
    expect(s.proverbs.p1).toEqual({ correct: false });
    expect(proverbSummary(s)).toEqual({ guessed: 1, right: 0 });
  });
  it("records a transform item once per mode", () => {
    let s = recordTransformResult(emptyStats, "t1", "negative", "easy", "right", d("2026-10-02"));
    s = recordTransformResult(s, "t1", "negative", "easy", "wrong", d("2026-10-02"));
    s = recordTransformResult(s, "t1", "negative", "advanced", "close", d("2026-10-02"));
    expect(s.transform["easy:t1"]!.result).toBe("right");
    expect(s.transform["advanced:t1"]!.result).toBe("close");
  });
  it("keeps days sorted, unique and capped at 400", () => {
    let s: Stats = emptyStats;
    for (let i = 0; i < 405; i++) {
      s = recordToneAnswer(s, "words", true, new Date(2025, 0, 1 + i, 12));
    }
    expect(s.days).toHaveLength(400);
    expect([...s.days].sort()).toEqual(s.days);
    expect(s.days[399]).toBe(dayKey(new Date(2025, 0, 405, 12)));
  });
});

describe("summaries", () => {
  it("accuracy is null with no answers", () => {
    expect(accuracy(0, 0)).toBeNull();
    expect(accuracy(3, 4)).toBe(75);
  });
  it("tallies transform kinds and modes, with close on its own", () => {
    let s = recordTransformResult(emptyStats, "a", "negative", "easy", "right");
    s = recordTransformResult(s, "b", "negative", "advanced", "close");
    s = recordTransformResult(s, "c", "future", "advanced", "wrong");
    const t = transformSummary(s);
    expect(t.byKind.negative).toEqual({ right: 1, close: 1, wrong: 0, total: 2 });
    expect(t.byKind.future).toEqual({ right: 0, close: 0, wrong: 1, total: 1 });
    expect(t.byMode.advanced).toEqual({ right: 0, close: 1, wrong: 1, total: 2 });
  });
  it("combines practice answers and counts only right as correct", () => {
    let s = recordToneAnswer(emptyStats, "words", true);
    s = recordToneAnswer(s, "words", false);
    s = recordProverbAnswer(s, "p1", true);
    s = recordTransformResult(s, "t1", "past", "easy", "close");
    expect(practiceAnswers(s)).toEqual({ answered: 4, correct: 2 });
    expect(toneSummary(s).words).toEqual({ answered: 2, correct: 1 });
  });
  it("counts practice days and the current run", () => {
    const days = (list: string[]): Stats => ({ ...emptyStats, days: list });
    expect(practiceDays(days(["2026-10-01", "2026-10-03"]))).toBe(2);
    expect(currentRun(days(["2026-10-01", "2026-10-02", "2026-10-03"]), d("2026-10-03"))).toBe(3);
    expect(currentRun(days(["2026-10-01", "2026-10-02", "2026-10-03"]), d("2026-10-04"))).toBe(3);
    expect(currentRun(days(["2026-10-01", "2026-10-02", "2026-10-03"]), d("2026-10-05"))).toBe(0);
    expect(currentRun(days(["2026-02-27", "2026-02-28", "2026-03-01"]), d("2026-03-01"))).toBe(3);
    expect(currentRun(days(["2025-12-31", "2026-01-01"]), d("2026-01-01"))).toBe(2);
    expect(currentRun(emptyStats, d("2026-10-03"))).toBe(0);
  });
});

describe("withExtraDays", () => {
  it("adds local days from ISO timestamps, sorted, unique and capped", () => {
    const base: Stats = { ...emptyStats, days: ["2026-10-03"] };
    const iso = (y: number, m: number, day: number) => new Date(y, m - 1, day, 12).toISOString();
    const s = withExtraDays(base, [iso(2026, 10, 1), iso(2026, 10, 3), iso(2026, 10, 2), "not a date"]);
    expect(s.days).toEqual(["2026-10-01", "2026-10-02", "2026-10-03"]);
    expect(withExtraDays(emptyStats, [])).toBe(emptyStats);
  });
});

describe("numbers stats", () => {
  it("starts with no steps and zeroed kinds", () => {
    expect(emptyStats.numbers.steps).toEqual({});
    expect(emptyStats.numbers.kinds["to-yoruba"]).toEqual({ answered: 0, correct: 0 });
    expect(numbersSummary(emptyStats).stepsDone).toBe(0);
  });
  it("loads a store saved before numbers existed as empty numbers", () => {
    const raw = JSON.stringify({ tone: { words: { answered: 2, correct: 1 } }, days: ["2026-10-01"] });
    const s = loadStats(memory({ "yp:stats:v1": raw }));
    expect(s.numbers).toEqual(emptyStats.numbers);
    expect(s.tone.words).toEqual({ answered: 2, correct: 1 });
  });
  it("drops bad numbers entries but keeps good ones", () => {
    const raw = JSON.stringify({
      numbers: {
        steps: { good: { best: 0.75 }, bad: { best: "x" }, over: { best: 2 }, nan: { best: null } },
        kinds: { "to-yoruba": { answered: 3, correct: 2 }, nope: { answered: 1, correct: 1 }, hear: { answered: "x" } },
      },
    });
    const s = loadStats(memory({ "yp:stats:v1": raw }));
    expect(Object.keys(s.numbers.steps)).toEqual(["good"]);
    expect(s.numbers.kinds["to-yoruba"]).toEqual({ answered: 3, correct: 2 });
    expect(s.numbers.kinds.hear).toEqual({ answered: 0, correct: 0 });
  });
  it("counts every answer by kind and adds the day once", () => {
    let s = recordNumbersAnswer(emptyStats, "to-yoruba", true, d("2026-10-02"));
    s = recordNumbersAnswer(s, "to-yoruba", false, d("2026-10-02"));
    s = recordNumbersAnswer(s, "counting", true, d("2026-10-02"));
    expect(s.numbers.kinds["to-yoruba"]).toEqual({ answered: 2, correct: 1 });
    expect(s.numbers.kinds.counting).toEqual({ answered: 1, correct: 1 });
    expect(s.days).toEqual(["2026-10-02"]);
  });
  it("keeps the best round score and ignores impossible scores", () => {
    let s = recordNumbersRound(emptyStats, "tens", 0.5, d("2026-10-02"));
    s = recordNumbersRound(s, "tens", 0.25, d("2026-10-02"));
    expect(s.numbers.steps.tens).toEqual({ best: 0.5 });
    s = recordNumbersRound(s, "tens", 0.875, d("2026-10-02"));
    expect(s.numbers.steps.tens).toEqual({ best: 0.875 });
    for (const bad of [1.5, -1, Number.NaN]) {
      expect(recordNumbersRound(s, "other", bad, d("2026-10-02")).numbers.steps.other, String(bad)).toBeUndefined();
    }
  });
  it("summarises steps done", () => {
    let s = recordNumbersRound(emptyStats, "a", 1);
    s = recordNumbersRound(s, "b", 0.5);
    expect(numbersSummary(s)).toMatchObject({ stepsDone: 2, steps: { a: 1, b: 0.5 } });
  });
  it("counts numbers answers in the combined practice figure", () => {
    let s = recordToneAnswer(emptyStats, "words", true);
    s = recordNumbersAnswer(s, "to-numeral", true);
    s = recordNumbersAnswer(s, "to-numeral", false);
    expect(practiceAnswers(s)).toEqual({ answered: 3, correct: 2 });
  });
});
