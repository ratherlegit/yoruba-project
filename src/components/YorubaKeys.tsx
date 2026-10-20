const KEYS: { ch: string; label: string; shown: string }[] = [
  { ch: "ẹ", label: "ẹ", shown: "ẹ" },
  { ch: "ọ", label: "ọ", shown: "ọ" },
  { ch: "ṣ", label: "ṣ", shown: "ṣ" },
  { ch: "́", label: "Acute accent", shown: "◌́" },
  { ch: "̀", label: "Grave accent", shown: "◌̀" },
];

export function YorubaKeys({ onInsert, disabled = false }: { onInsert: (ch: string) => void; disabled?: boolean }) {
  return (
    <div className="yo-keys" data-testid="yoruba-keys" role="group" aria-label="Yoruba letters and tone marks">
      {KEYS.map((k) => (
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
}
