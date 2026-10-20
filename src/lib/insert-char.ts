const isMark = (ch: string) => /^[̀-ͯ]$/.test(ch);

// Insert a letter or a combining tone mark at the caret. A mark attaches to the
// character before the caret; with no letter there it is dropped. The text before
// the caret is re-normalised to NFC so typed text compares equal to stored text.
export function insertChar(value: string, caret: number, ch: string): { value: string; caret: number } {
  const at = Math.max(0, Math.min(caret, value.length));
  const before = value.slice(0, at);
  const after = value.slice(at);
  if (isMark(ch) && (before === "" || /\s$/.test(before))) return { value, caret: at };
  const next = (before + ch).normalize("NFC");
  return { value: next + after, caret: next.length };
}
