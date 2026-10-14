// ElevenLabs credits are characters pasted. Mirrors line_for() in
// tools/audio/prepare_paste.py: the text (trailing space trimmed), a period if it
// does not already end in . ! ? … ; or :, then a blank line (two newlines).
// Counted in NFC code points, like Python's len() on the NFC text.
const END_PUNCT = [".", "!", "?", "\u2026", ";", ":"];

export function audioCost(text: string): number {
  const t = text.normalize("NFC").trimEnd();
  const period = END_PUNCT.some((p) => t.endsWith(p)) ? 0 : 1;
  return [...t].length + period + 2;
}
