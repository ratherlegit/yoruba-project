const nfc = (s: string) => s.normalize("NFC");

type Key = { ch: string; label: string; shown: string };

const letter = (c: string): Key => ({ ch: nfc(c), label: nfc(c), shown: nfc(c) });

// Letters that need a dot under them, then the two tone marks, which attach to the letter before the cursor.
const BASE: Key[] = [
  letter("ẹ"), letter("ọ"), letter("ṣ"),
  { ch: "́", label: "Acute accent", shown: "´" },
  { ch: "̀", label: "Grave accent", shown: "`" },
];

// Every vowel (and n) with a high or low tone, as one key, so a tone letter is one tap.
const TONED: Key[] = ["a", "e", "i", "o", "u", "ẹ", "ọ", "n"].flatMap((b) =>
  ["́", "̀"].map((m) => letter(b + m)),
);

export function YorubaKeys({ onInsert, disabled = false }: { onInsert: (ch: string) => void; disabled?: boolean }) {
  const row = (keys: Key[], label: string) => (
    <div className="yo-keys-row" role="group" aria-label={label}>
      {keys.map((k) => (
        <button
          key={k.label}
          type="button"
          className="btn yo-key yo"
          aria-label={k.label}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(k.ch)}
        >
          {k.shown}
        </button>
      ))}
    </div>
  );
  return (
    <div className="yo-keys" data-testid="yoruba-keys" role="group" aria-label="Yoruba letters and tone marks">
      {row(BASE, "Dotted letters and tone marks")}
      {row(TONED, "Letters with a high or low tone")}
      <p className="muted yo-keys-hint">Tap a tone mark after a letter to add it, or tap a letter that already has one.</p>
    </div>
  );
}
