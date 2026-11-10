import { describe, expect, it } from "vitest";
import { DIFFICULTIES, GENRES, MAX_LINES, SONGS } from "./songs";
import { validateSongs } from "./validate-songs";

describe("SONGS", () => {
  it("passes the validator", () => {
    expect(validateSongs(SONGS)).toEqual([]);
  });
  it("has the ten starter songs", () => {
    expect(SONGS.map((s) => s.id)).toEqual([
      "okunkun", "sade", "awe", "organise", "ojuelegba", "duduke", "motigbana", "labe-igi-oronbo", "iya-ni-wura", "daju",
    ]);
  });
  it("uses only known genres, and has two children's songs", () => {
    for (const s of SONGS) expect(GENRES).toContain(s.genre);
    expect(SONGS.filter((s) => s.genre === "Children's")).toHaveLength(2);
  });
  it("gives every song a known difficulty, using all three levels", () => {
    for (const s of SONGS) expect(DIFFICULTIES).toContain(s.difficulty);
    for (const d of DIFFICULTIES) expect(SONGS.some((s) => s.difficulty === d)).toBe(true);
  });
  it("never shows more than the excerpt limit, and links each song to its published lyrics", () => {
    for (const s of SONGS) {
      expect(s.lines.length).toBeLessThanOrEqual(MAX_LINES);
      expect(s.lyricsUrl).toMatch(/^https:\/\//);
    }
  });
  it("marks every song needs-review", () => {
    expect(SONGS.every((s) => s.confidence === "needs-review")).toBe(true);
  });
});
