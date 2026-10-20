import manifest from "@/content/audio-manifest.json";
import type { Voice } from "@/content/dialogues";

const files: Record<string, string> = manifest;

// Shared by the string lister, the generator's manifest, and the runtime lookup.
// Keeps letters, tone marks, apostrophes and hyphens; drops other punctuation.
export function audioKey(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\s'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

// The female voice keeps the plain key, so every clip made before there was a second voice still
// matches. The male voice lives in the same manifest under a "male|" prefix.
export function voiceKey(text: string, voice: Voice = "female"): string {
  const key = audioKey(text);
  return voice === "male" ? `male|${key}` : key;
}

export function lookupClip(map: Record<string, string>, text: string, voice: Voice = "female"): string | null {
  const file = map[voiceKey(text, voice)];
  return file ? `/audio/${file}` : null;
}

export function audioUrlFor(text: string, voice: Voice = "female"): string | null {
  return lookupClip(files, text, voice);
}
