import { describe, expect, it } from "vitest";
import { NUMBERS, NUMBER_STEPS, PHRASES, type NumberEntry, type NumberPhrase, type NumberStep } from "@/content/numbers";
import { buildNumbersRound, gradeNumbers, ROUND_SIZE, type NumbersData } from "./numbers-practice";

const e = (value: number, yoruba: string, over: Partial<NumberEntry> = {}): NumberEntry => ({
  id: `n-${value}`, value, yoruba, after: [], answers: [yoruba], build: "", step: 3,
  source: "s", confidence: "needs-review", note: "n", ...over,
});
const ph = (id: string, step: 5 | 6, prompt: string, numeral: string, answer: string): NumberPhrase => ({
  id, step, prompt, numeral, answers: [answer], source: "s", confidence: "needs-review", note: "n",
});
const small: NumbersData = {
  entries: [e(40, "ogójì", { build: "20*2" }), e(60, "ọgọ́ta", { build: "20*3" }), e(80, "ọgọ́rin", { build: "20*4" })],
  phrases: [ph("p1", 5, "two children", "", "ọmọ méjì"), ph("p2", 6, "fifty naira", "50", "àádọ́ta náírà")],
  steps: [
    { id: "s3", title: "T", rule: "r", entryIds: ["n-40", "n-60", "n-80"], phraseIds: [] },
    { id: "s5", title: "C", rule: "r", entryIds: [], phraseIds: ["p1"] },
    { id: "s6", title: "M", rule: "r", entryIds: [], phraseIds: ["p2"] },
  ],
};
const real: NumbersData = { entries: NUMBERS, phrases: PHRASES, steps: NUMBER_STEPS as NumberStep[] };

describe("buildNumbersRound", () => {
  it("returns an empty round for an unknown step", () => {
    expect(buildNumbersRound("nope", small, "seed")).toEqual([]);
  });
  it("makes a to-yoruba and a to-numeral question per entry, with the build", () => {
    const round = buildNumbersRound("s3", small, "seed");
    expect(round).toHaveLength(6);
    const q = round.find((x) => x.id === "n-40:to-yoruba")!;
    expect(q.prompt).toBe("Type 40 in Yoruba");
    expect(q.answers).toEqual(["ogójì"]);
    expect(q.model).toBe("ogójì");
    expect(q.build).toBe("20*2");
    const n = round.find((x) => x.id === "n-40:to-numeral")!;
    expect(n.prompt).toBe("What number is ogójì?");
    expect(n.answers).toEqual(["40"]);
    expect(n.model).toBe("40");
  });
  it("also accepts the after-noun forms as Yoruba answers", () => {
    const data: NumbersData = {
      ...small,
      entries: [e(2, "èjì", { after: ["méjì"], answers: ["èjì"], step: 1, build: "" })],
      steps: [{ id: "s1", title: "T", rule: "r", entryIds: ["n-2"], phraseIds: [] }],
    };
    const q = buildNumbersRound("s1", data, "x").find((x) => x.kind === "to-yoruba")!;
    expect(q.answers).toEqual(["èjì", "méjì"]);
  });
  it("makes counting questions for phrase steps, and price steps also read back the amount", () => {
    const counting = buildNumbersRound("s5", small, "seed");
    expect(counting.map((q) => q.kind)).toEqual(["counting"]);
    expect(counting[0]!.prompt).toBe("Say 'two children' in Yoruba");
    expect(counting[0]!.model).toBe("ọmọ méjì");
    const money = buildNumbersRound("s6", small, "seed");
    expect(money.map((q) => q.kind).sort()).toEqual(["counting", "to-numeral"]);
    expect(money.find((q) => q.kind === "to-numeral")!.prompt).toBe("What price is àádọ́ta náírà?");
    expect(money.find((q) => q.kind === "to-numeral")!.answers).toEqual(["50"]);
  });
  it("adds a hear question only when the text has a clip", () => {
    const none = buildNumbersRound("s3", small, "seed", () => false);
    expect(none.some((q) => q.kind === "hear")).toBe(false);
    const some = buildNumbersRound("s3", small, "seed", (t) => t === "ogójì", 20);
    const hear = some.filter((q) => q.kind === "hear");
    expect(hear).toHaveLength(1);
    expect(hear[0]!.audioText).toBe("ogójì");
    expect(hear[0]!.answers).toEqual(["40"]);
    expect(hear[0]!.prompt).toBe("Listen and type the number");
  });
  it("has unique ids and is limited to the round size", () => {
    for (const step of NUMBER_STEPS) {
      const round = buildNumbersRound(step.id, real, "seed", () => true);
      expect(new Set(round.map((q) => q.id)).size, step.id).toBe(round.length);
      expect(round.length, step.id).toBeGreaterThan(0);
      expect(round.length, step.id).toBeLessThanOrEqual(ROUND_SIZE);
    }
    expect(buildNumbersRound("one-to-ten", real, "seed")).toHaveLength(ROUND_SIZE);
  });
  it("gives a shorter round when fewer questions exist", () => {
    expect(buildNumbersRound("s5", small, "seed")).toHaveLength(1);
  });
  it("is stable for a seed and different for another seed", () => {
    const a = buildNumbersRound("tens-and-twenties", real, "alpha").map((q) => q.id);
    expect(buildNumbersRound("tens-and-twenties", real, "alpha").map((q) => q.id)).toEqual(a);
    expect(buildNumbersRound("tens-and-twenties", real, "beta").map((q) => q.id)).not.toEqual(a);
  });
  it("uses the real data for the money step", () => {
    const round = buildNumbersRound("money", real, "seed");
    expect(round.every((q) => q.kind === "counting" || q.kind === "to-numeral")).toBe(true);
  });
});

describe("gradeNumbers", () => {
  const find = (id: string, data = real) => {
    const stepId = data.steps.find((s) => s.entryIds.includes(id.split(":")[0]!) || s.phraseIds.includes(id.split(":")[0]!))!.id;
    return buildNumbersRound(stepId, data, "grade", () => true, 200).find((q) => q.id === id)!;
  };
  it("accepts accepted variants in advanced mode", () => {
    expect(gradeNumbers("oókànlá", find("num-11:to-yoruba"), "advanced")).toBe("right");
    expect(gradeNumbers("méjì", find("num-2:to-yoruba"), "advanced")).toBe("right");
  });
  it("grades digit answers as plain digits", () => {
    const q = find("num-1000:to-numeral");
    for (const ok of ["1000", "1,000", " 1000 ", "₦1000"]) expect(gradeNumbers(ok, q, "advanced"), ok).toBe("right");
    expect(gradeNumbers("100", q, "advanced")).toBe("wrong");
    expect(gradeNumbers("1 000", q, "easy")).toBe("right");
  });
  it("is easy or close on dots and tones as gradeTransform is", () => {
    const q = find("num-20:to-yoruba");
    expect(gradeNumbers("ogun", q, "easy")).toBe("right");
    expect(gradeNumbers("ogun", q, "advanced")).toBe("close");
  });
  it("treats empty input as wrong, and a hear answer as digits", () => {
    expect(gradeNumbers("", find("num-20:to-yoruba"), "easy")).toBe("wrong");
    expect(gradeNumbers(" ", find("num-20:to-numeral"), "advanced")).toBe("wrong");
    expect(gradeNumbers("20", find("num-20:hear"), "advanced")).toBe("right");
  });
  it("ignores hyphens, so unhyphenated spellings of the -ún and -án forms are accepted", () => {
    expect(gradeNumbers("aarundinlogoji", find("num-35:to-yoruba"), "easy")).toBe("right");
    expect(gradeNumbers("aarun-un-dinlogoji", find("num-35:to-yoruba"), "easy")).toBe("right");
    expect(gradeNumbers("marunun", find("num-5:to-yoruba"), "easy")).toBe("right");
    expect(gradeNumbers("mẹ́sànán", find("num-9:to-yoruba"), "easy")).toBe("right");
    expect(gradeNumbers("aárùnúndínlógójì", find("num-35:to-yoruba"), "advanced")).toBe("right");
    expect(gradeNumbers("aarunundinlogoji", find("num-35:to-yoruba"), "advanced")).toBe("close");
  });
});
