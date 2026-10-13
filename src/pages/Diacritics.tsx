const VOWELS = ["a", "e", "ẹ", "i", "o", "ọ", "u"];
const MARKS = [
  { label: "mid", mark: "" },
  { label: "high", mark: "́" },
  { label: "low", mark: "̀" },
];
const WORDS = ["ọmọ", "ẹja", "ṣọ́ra", "gbọ́", "káàárọ̀", "olùkọ́", "ìgbín", "ń", "ǹ", "ọkọ", "ọkọ̀", "ọkọ́", "ẹ kú àárọ̀", "ẹ káàárọ̀"];

export function Diacritics() {
  return (
    <main className="page">
      <h1>Diacritic rendering check</h1>
      <p className="muted">Every mark should sit cleanly on its letter with no clipping.</p>
      <div className="card" style={{ display: "grid", gap: "0.5rem" }}>
        {MARKS.map(({ label, mark }) => (
          <div key={label} className="yo">
            <span className="muted" style={{ fontSize: "0.9rem", marginRight: "0.75rem" }}>{label}</span>
            {VOWELS.map((v) => (v + mark).normalize("NFC")).join("  ")}
          </div>
        ))}
        <div className="yo">ṣ  Ṣ  gb  Gb  ẹ  Ẹ  ọ  Ọ</div>
      </div>
      <div className="card yo" style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {WORDS.map((w) => <span key={w}>{w}</span>)}
      </div>
    </main>
  );
}
