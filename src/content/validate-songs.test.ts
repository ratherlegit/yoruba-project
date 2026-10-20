import { describe, expect, it } from "vitest";
import type { Song } from "./songs";
import { validateSongs } from "./validate-songs";

const song = (over: Partial<Song> = {}): Song => ({
  id: "s-one",
  title: "Test Song",
  artist: "Test Artist",
  genre: "Afrobeats",
  videoId: "abcDEF12345",
  videoLabel: "Official video",
  lyricsUrl: "https://example.com/lyrics",
  lyricsSite: "Example Lyrics",
  about: "A short note about the song.",
  lines: [{ yoruba: "Mo ní ọmọ.", english: "I have a child." }],
  source: "Test source",
  confidence: "needs-review",
  note: "Check the tones.",
  ...over,
});
const errs = (songs: Song[]) => validateSongs(songs).join("\n");
const line = (n: number) => Array.from({ length: n }, (_, i) => ({ yoruba: `Ìlà ${i}`, english: `Line ${i}` }));

describe("validateSongs", () => {
  it("accepts a valid song", () => {
    expect(validateSongs([song()])).toEqual([]);
  });
  it("rejects a duplicate id", () => {
    expect(errs([song(), song({ videoId: "zzzzzzzzzzz" })])).toContain("duplicate id");
  });
  it("rejects a duplicate video id", () => {
    expect(errs([song(), song({ id: "s-two" })])).toContain("duplicate video id");
  });
  it("rejects a malformed YouTube id", () => {
    expect(errs([song({ videoId: "short" })])).toContain("videoId");
    expect(errs([song({ videoId: "has space!!" })])).toContain("videoId");
  });
  it("rejects a lyrics link that is not https", () => {
    expect(errs([song({ lyricsUrl: "http://example.com" })])).toContain("lyricsUrl");
  });
  it("keeps the excerpt to one to twelve lines", () => {
    expect(errs([song({ lines: [] })])).toContain("lines");
    expect(errs([song({ lines: line(13) })])).toContain("lines");
    expect(validateSongs([song({ lines: line(12) })])).toEqual([]);
  });
  it("rejects an empty Yoruba or English line", () => {
    expect(errs([song({ lines: [{ yoruba: " ", english: "x" }] })])).toContain("empty");
    expect(errs([song({ lines: [{ yoruba: "x", english: "" }] })])).toContain("empty");
  });
  it("rejects strings that are not NFC, have an em dash, or a stray ɡ", () => {
    expect(errs([song({ about: "ẹ" })])).toContain("NFC");
    expect(errs([song({ about: `a ${String.fromCharCode(0x2014)} b` })])).toContain("em dash");
    expect(errs([song({ lines: [{ yoruba: "ɡba", english: "x" }] })])).toContain("U+0261");
  });
  it("needs a source, and a note while needs-review", () => {
    expect(errs([song({ source: " " })])).toContain("needs a source");
    expect(errs([song({ note: "" })])).toContain("needs-review needs a note");
  });
});
