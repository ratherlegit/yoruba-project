import type { Lesson } from "@/content/types";
import { primerHeading } from "@/lib/construction";
import { ToneChip } from "./ToneChip";
import { WordBreakdownCard } from "./WordBreakdownCard";

export function Primer({ lesson, onStart }: { lesson: Lesson; onStart?: () => void }) {
  const { primer } = lesson;
  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <section className="card">
        <p className="primer-rule">{primer.rule}</p>
        <div className="yo primer-formula">
          {primer.formula.split(";").map((line) => <p key={line}>{line.trim()}</p>)}
        </div>
        {primer.toneFocus && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {primer.toneFocus.map((t) => <ToneChip key={t} tone={t} />)}
          </div>
        )}
      </section>

      {primer.tables?.map((t) => (
        <section key={t.id} className="card">
          <h3 style={{ marginTop: 0 }}>{t.title}</h3>
          <table className="primer-table" data-testid={`primer-table-${t.id}`}>
            <thead>
              <tr>{t.columns.map((c) => <th key={c.label} scope="col">{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {t.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => {
                    const label = t.columns[i]!.label;
                    const cls = t.columns[i]!.yo ? "yo" : undefined;
                    return i === 0
                      ? <th key={label} scope="row" className={cls}>{cell}</th>
                      : <td key={label} data-label={label} className={cls}>{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {t.note && <p className="muted" style={{ marginBottom: 0 }}>{t.note}</p>}
        </section>
      ))}

      {primer.rules.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3>How it works</h3>
          {primer.rules.map((r) => (
            <div key={r.id} className="card">
              <strong className="rule-title">{r.title}</strong>
              {typeof r.explanation === "string"
                ? <p style={{ margin: "0.25rem 0 0" }}>{r.explanation}</p>
                : <ul className="rule-points">{r.explanation.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
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
