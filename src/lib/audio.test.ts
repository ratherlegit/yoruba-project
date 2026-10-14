import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/content/audio-manifest.json";
import { LEVELS } from "@/content/levels";
import { audioKey, audioUrlFor } from "./audio";
import { collectAudioStrings } from "./audio-strings";

describe("audioKey", () => {
  it("lowercases and trims", () => {
    expect(audioKey("  Ẹ Kú Àárọ̀  ")).toBe("ẹ kú àárọ̀");
  });
  it("removes punctuation and collapses whitespace", () => {
    expect(audioKey('Kí ni orúkọ rẹ?  "Ṣé" (o) fẹ́, jẹun; ok: yes! ok.')).toBe("kí ni orúkọ rẹ ṣé o fẹ́ jẹun ok yes ok");
  });
  it("keeps apostrophes and hyphens", () => {
    expect(audioKey("Òní l'a rí")).toBe("òní l'a rí");
    expect(audioKey("ilé-ìwé")).toBe("ilé-ìwé");
    expect(audioKey("l’a")).toBe("l'a");
  });
  it("gives NFC for NFD input", () => {
    const nfd = "ọkọ̀".normalize("NFD");
    expect(nfd).not.toBe("ọkọ̀");
    expect(audioKey(nfd)).toBe("ọkọ̀");
    expect(audioKey(nfd)).toBe(audioKey("ọkọ̀"));
  });
  it("keeps tone marks that tell words apart", () => {
    expect(new Set(["ọkọ", "ọkọ̀", "ọkọ́", "oko"].map(audioKey)).size).toBe(4);
  });
});

describe("audioUrlFor", () => {
  it("returns a /audio/ path for a known string, ignoring case and punctuation", () => {
    expect(audioUrlFor("Ọmọ!")).toMatch(/^\/audio\/[0-9a-f]{12}\.(mp3|ogg|wav)$/);
  });
  it("returns null for an unknown string", () => {
    expect(audioUrlFor("not a yoruba clip")).toBeNull();
  });
});

describe("audio matches lesson content", () => {
  const strings = collectAudioStrings(LEVELS);
  it("lists strings", () => {
    expect(strings.length).toBeGreaterThan(50);
  });
  // Strings added since the last clip batch. Each key here still needs a clip
  // (see tools/audio/README.md). Shrink this list as clips are generated.
  const PENDING_AUDIO = new Set<string>([]);
  it.each(strings.filter((s) => !PENDING_AUDIO.has(s.key)).map((s) => [s.key]))("has a manifest entry and file for %s (run npm run audio:generate if this fails)", (key) => {
    const file = (manifest as Record<string, string>)[key];
    expect(file, `no manifest entry for "${key}"`).toBeTruthy();
    expect(existsSync(join("public", "audio", file!)), `missing public/audio/${file}`).toBe(true);
  });
  it("has no manifest entries without a lesson string", () => {
    const keys = new Set(strings.map((s) => s.key));
    expect(Object.keys(manifest).filter((k) => !keys.has(k))).toEqual([]);
  });
});
