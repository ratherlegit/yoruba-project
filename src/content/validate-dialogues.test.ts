import { describe, expect, it } from "vitest";
import type { Dialogue, Situation } from "./dialogues";
import { validateDialogues } from "./validate-dialogues";

const situation: Situation = { id: "meeting", level: "getting-started", title: "Meeting someone", summary: "Greetings." };
const lines = [
  { speaker: "Bùkọ́lá", voice: "female" as const, yoruba: "Ẹ káàárọ̀.", english: "Good morning." },
  { speaker: "Adé", voice: "male" as const, yoruba: "Ẹ káàárọ̀.", english: "Good morning." },
  { speaker: "Bùkọ́lá", voice: "female" as const, yoruba: "Ṣé àlàáfíà ni?", english: "Is it peace?" },
];
const question = { prompt: "What time of day is it?", choices: ["Morning", "Evening"], answer: "Morning" };
const question2 = { prompt: "Who is greeting whom?", choices: ["Neighbours", "Strangers"], answer: "Neighbours" };
const dialogue = (over: Partial<Dialogue> = {}): Dialogue => ({
  id: "d-one", level: "getting-started", situationId: "meeting", title: "Good morning", setting: "Two neighbours meet.",
  lines, questions: [question, question2], source: "Written by the author, no published source", confidence: "needs-review", note: "Check the tones.",
  ...over,
});
const errs = (d: Dialogue[], s: Situation[] = [situation]) => validateDialogues(s, d).join("\n");
const many = (n: number) => Array.from({ length: n }, (_, i) => ({ speaker: i % 2 ? "Adé" : "Bùkọ́lá", voice: (i % 2 ? "male" : "female") as "male" | "female", yoruba: `Ìlà ${i}`, english: `Line ${i}` }));

describe("validateDialogues", () => {
  it("accepts a valid dialogue", () => {
    expect(validateDialogues([situation], [dialogue()])).toEqual([]);
  });
  it("rejects a duplicate id", () => {
    expect(errs([dialogue(), dialogue()])).toContain("duplicate id");
  });
  it("rejects an unknown situation, and a level that does not match it", () => {
    expect(errs([dialogue({ situationId: "nope" })])).toContain("unknown situation");
    expect(errs([dialogue({ level: "beginner" })])).toContain("level");
  });
  it("needs exactly one female and one male speaker", () => {
    const allFemale = lines.map((l) => ({ ...l, voice: "female" as const }));
    expect(errs([dialogue({ lines: allFemale })])).toContain("one female and one male");
    const three = [...lines, { speaker: "Tọ́pẹ́", voice: "female" as const, yoruba: "Ẹ ṣé.", english: "Thanks." }];
    expect(errs([dialogue({ lines: three })])).toContain("one female and one male");
  });
  it("keeps a conversation to three to twelve lines", () => {
    expect(errs([dialogue({ lines: many(2) })])).toContain("lines");
    expect(errs([dialogue({ lines: many(13) })])).toContain("lines");
    expect(validateDialogues([situation], [dialogue({ lines: many(12) })])).toEqual([]);
  });
  it("rejects an empty Yoruba or English line", () => {
    expect(errs([dialogue({ lines: [{ ...lines[0]!, yoruba: " " }, lines[1]!, lines[2]!] })])).toContain("empty");
    expect(errs([dialogue({ lines: [{ ...lines[0]!, english: "" }, lines[1]!, lines[2]!] })])).toContain("empty");
  });
  it("needs two to five questions, each with two to four distinct choices and an answer among them", () => {
    expect(errs([dialogue({ questions: [] })])).toContain("questions");
    expect(errs([dialogue({ questions: Array(6).fill(question) })])).toContain("questions");
    expect(errs([dialogue({ questions: [{ ...question, choices: ["Morning"] }] })])).toContain("choices");
    expect(errs([dialogue({ questions: [{ ...question, choices: ["a", "b", "c", "d", "e"], answer: "a" }] })])).toContain("choices");
    expect(errs([dialogue({ questions: [{ ...question, choices: ["Morning", "Morning"] }] })])).toContain("distinct");
    expect(errs([dialogue({ questions: [{ ...question, answer: "Night" }] })])).toContain("answer");
  });
  it("rejects strings that are not NFC, have an em dash, or a stray ɡ", () => {
    expect(errs([dialogue({ setting: "ẹ" })])).toContain("NFC");
    expect(errs([dialogue({ setting: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
    expect(errs([dialogue({ setting: `${String.fromCharCode(0x0261)}ba` })])).toContain("U+0261");
  });
  it("needs a source, and a note while needs-review", () => {
    expect(errs([dialogue({ source: " " })])).toContain("needs a source");
    expect(errs([dialogue({ note: "" })])).toContain("needs-review needs a note");
  });
});
