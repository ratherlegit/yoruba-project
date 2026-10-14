import { describe, expect, it } from "vitest";
import { VOCAB_LEVELS, getVocabLevel, getVocabTopic, nextVocabTopicPath } from "./index";
import { validateTopic, validateVocabCatalog } from "./validate";

describe("vocab content", () => {
  it("mirrors the five grammar levels in order", () => {
    expect(VOCAB_LEVELS.map((l) => l.id)).toEqual(["getting-started", "beginner", "intermediate", "advanced", "mastery"]);
  });
  it("has a valid catalog", () => {
    expect(validateVocabCatalog(VOCAB_LEVELS)).toEqual([]);
  });
  for (const level of VOCAB_LEVELS) {
    for (const topic of level.topics) {
      it(`${topic.id} passes validation`, () => {
        expect(validateTopic(topic)).toEqual([]);
      });
    }
  }
  it("returns undefined for unknown ids", () => {
    expect(getVocabLevel("nope")).toBeUndefined();
    expect(getVocabTopic("beginner", "nope")).toBeUndefined();
    expect(nextVocabTopicPath("beginner", "nope")).toBeNull();
  });
});
