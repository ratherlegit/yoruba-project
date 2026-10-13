import manifest from "@/content/audio-manifest.json";

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

export function audioUrlFor(text: string): string | null {
  const file = files[audioKey(text)];
  return file ? `/audio/${file}` : null;
}
