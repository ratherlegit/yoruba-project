import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/content/audio-manifest.json";
import { LEVELS } from "@/content/levels";
import { VOCAB_LEVELS } from "@/content/vocab";
import { audioKey, audioUrlFor, lookupClip, voiceKey } from "./audio";
import { MINIMAL_PAIRS, SOUNDS } from "@/content/sounds";
import { CONSONANT_SETS, TONE_COMPARE } from "@/content/sound-focus";
import { NUMBERS } from "@/content/numbers";
import { collectAudioStrings, collectNumbersAudioStrings, collectSoundAudioStrings, collectVocabAudioStrings } from "./audio-strings";

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
  it("has no manifest entries without a lesson, vocab or sound string", () => {
    const keys = new Set([...strings, ...collectVocabAudioStrings(VOCAB_LEVELS), ...collectNumbersAudioStrings(NUMBERS), ...collectSoundAudioStrings(SOUNDS, MINIMAL_PAIRS, TONE_COMPARE, CONSONANT_SETS)].map((s) => s.key));
    expect(Object.keys(manifest).filter((k) => !keys.has(k))).toEqual([]);
  });
});

describe("audio matches vocab content", () => {
  const vocab = collectVocabAudioStrings(VOCAB_LEVELS);
  const files = manifest as Record<string, string>;
  it("has a file on disk for every vocab string that has a manifest entry", () => {
    const missing = vocab.filter((s) => files[s.key] && !existsSync(join("public", "audio", files[s.key]!))).map((s) => s.key);
    expect(missing).toEqual([]);
  });
  it("reports how many vocab strings still have no clip (never fails)", () => {
    const pending = vocab.filter((s) => !files[s.key]).length;
    console.info(`vocab audio: ${pending} of ${vocab.length} strings still without a clip`);
    expect(pending).toBeGreaterThanOrEqual(0);
  });
});

describe("audio matches sound bank content", () => {
  const sounds = collectSoundAudioStrings(SOUNDS, MINIMAL_PAIRS, TONE_COMPARE, CONSONANT_SETS);
  const files = manifest as Record<string, string>;
  it("has a file on disk for every sound word that has a manifest entry", () => {
    const missing = sounds.filter((s) => files[s.key] && !existsSync(join("public", "audio", files[s.key]!))).map((s) => s.key);
    expect(missing).toEqual([]);
  });
  it("reports how many sound words still have no clip (never fails)", () => {
    const pending = sounds.filter((s) => !files[s.key]).length;
    console.info(`sound audio: ${pending} of ${sounds.length} words still without a clip`);
    expect(pending).toBeGreaterThanOrEqual(0);
  });
});

describe("voiceKey and lookupClip", () => {
  const files = { "ẹ káàárọ̀": "female1.mp3", "male|ẹ káàárọ̀": "male1.mp3", "ọmọ": "female2.mp3" };
  it("uses the plain audio key for the female voice and a male| prefix for the male voice", () => {
    expect(voiceKey("Ẹ káàárọ̀.", "female")).toBe("ẹ káàárọ̀");
    expect(voiceKey("Ẹ káàárọ̀.")).toBe("ẹ káàárọ̀");
    expect(voiceKey("Ẹ káàárọ̀.", "male")).toBe("male|ẹ káàárọ̀");
  });
  it("finds different clips for the same text in the two voices", () => {
    expect(lookupClip(files, "Ẹ káàárọ̀.", "female")).toBe("/audio/female1.mp3");
    expect(lookupClip(files, "Ẹ káàárọ̀.", "male")).toBe("/audio/male1.mp3");
  });
  it("never falls back to the female clip for the male voice", () => {
    expect(lookupClip(files, "ọmọ", "female")).toBe("/audio/female2.mp3");
    expect(lookupClip(files, "ọmọ", "male")).toBeNull();
  });
  it("audioUrlFor accepts a voice and defaults to female", () => {
    expect(audioUrlFor("a text that has no clip anywhere", "male")).toBeNull();
    expect(audioUrlFor("a text that has no clip anywhere")).toBeNull();
  });
});
