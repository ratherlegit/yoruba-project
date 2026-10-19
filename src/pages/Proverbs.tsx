import { useState } from "react";
import { ChoiceQuestion } from "@/components/ChoiceQuestion";
import { PROVERBS, type Proverb } from "@/content/proverbs";

export function Proverbs({ proverbs = PROVERBS }: { proverbs?: Proverb[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const proverb = proverbs[index];
  if (!proverb) {
    return (
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <h1 style={{ marginBottom: 0 }}>Proverbs</h1>
        <p className="muted">No proverbs yet. Check back soon.</p>
      </main>
    );
  }

  const chosen = answers[proverb.id] ?? null;
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>Proverbs</h1>
      <p className="muted" data-testid="proverb-position" style={{ margin: 0 }}>
        Proverb {index + 1} of {proverbs.length}
      </p>
      <section className="card proverb-card" data-testid="proverb-card" key={proverb.id}>
        <p className="yo proverb-yoruba">{proverb.yoruba}</p>
        <p className="proverb-literal">
          <span className="muted">Word for word</span>
          <span>{proverb.literal}</span>
        </p>
        <ChoiceQuestion
          prompt="What is this proverb about?"
          choices={[proverb.meaning, ...proverb.wrong]}
          chosen={chosen}
          correct={proverb.meaning}
          onChoose={(c) => setAnswers((a) => ({ ...a, [proverb.id]: c }))}
        />
        {chosen !== null && (
          <div className="proverb-reveal" data-testid="proverb-reveal">
            <p style={{ margin: 0 }}><strong>{proverb.meaning}</strong></p>
            <p style={{ margin: 0 }}>You would say this when {proverb.usedWhen}</p>
          </div>
        )}
      </section>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <button className="btn" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</button>
        <button className="btn btn-primary" disabled={chosen === null || index === proverbs.length - 1} onClick={() => setIndex(index + 1)}>Next</button>
      </div>
    </main>
  );
}
