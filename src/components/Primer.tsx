import type { Lesson } from "@/content/types";
import { primerHeading } from "@/lib/construction";
import { ToneChip } from "./ToneChip";
import { WordBreakdownCard } from "./WordBreakdownCard";

export function Primer({ lesson, onStart }: { lesson: Lesson; onStart?: () => void }) {
  const { primer } = lesson;
  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{primer.rule}</h2>
        <p className="yo">{primer.formula}</p>
        {primer.toneFocus && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {primer.toneFocus.map((t) => <ToneChip key={t} tone={t} />)}
          </div>
        )}
      </section>

      {primer.rules.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3>How it works</h3>
          {primer.rules.map((r) => (
            <div key={r.id} className="card">
              <strong>{r.title}</strong>
              <p style={{ margin: "0.25rem 0 0" }}>{r.explanation}</p>
            </div>
          ))}
        </section>
      )}

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h3>{primerHeading(primer.examples)}</h3>
        {primer.examples.map((w) => (
          <WordBreakdownCard key={w.id} word={w} rules={primer.rules} />
        ))}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Common mistake</h3>
        <p className="yo" style={{ margin: 0 }}>
          <span style={{ color: "var(--danger)" }}>✗ {primer.commonMistake.wrong}</span>{"   "}
          <span style={{ color: "var(--accent)" }}>✓ {primer.commonMistake.right}</span>
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>{primer.commonMistake.why}</p>
      </section>

      {onStart && (
        <button className="btn btn-primary" onClick={onStart}>Start practice</button>
      )}
    </div>
  );
}
