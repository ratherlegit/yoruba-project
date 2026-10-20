import { describe, expect, it } from "vitest";
import { emptyStats, recordProverbAnswer, recordToneAnswer } from "./stats";
import { buildStrip } from "./stats-summary";

const base = { lessonsDone: 0, lessonsTotal: 20, topicsDone: 0, topicsTotal: 25, stats: emptyStats };
const now = new Date(2026, 9, 3, 12);

describe("buildStrip", () => {
  it("is empty when there is no data anywhere", () => {
    expect(buildStrip({ ...base, now })).toEqual([]);
  });
  it("shows only the figures that have data", () => {
    expect(buildStrip({ ...base, lessonsDone: 3, now })).toEqual([{ label: "Lessons done", value: "3 of 20" }]);
  });
  it("shows four figures in order when everything has data", () => {
    let stats = recordToneAnswer(emptyStats, "words", true, new Date(2026, 9, 1, 12));
    stats = recordToneAnswer(stats, "words", false, new Date(2026, 9, 2, 12));
    stats = recordProverbAnswer(stats, "p1", true, new Date(2026, 9, 3, 12));
    stats = recordProverbAnswer(stats, "p2", true, new Date(2026, 9, 3, 12));
    const strip = buildStrip({ lessonsDone: 3, lessonsTotal: 20, topicsDone: 2, topicsTotal: 25, stats, now });
    expect(strip.map((f) => f.label)).toEqual(["Lessons done", "Vocab topics done", "Practice answers right", "Days practised"]);
    expect(strip.map((f) => f.value)).toEqual(["3 of 20", "2 of 25", "75%", "3"]);
  });
  it("hides the accuracy figure when nothing has been answered", () => {
    const strip = buildStrip({ ...base, topicsDone: 1, now });
    expect(strip.map((f) => f.label)).toEqual(["Vocab topics done"]);
  });
});
