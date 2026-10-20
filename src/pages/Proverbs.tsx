import { useState } from "react";
import { ChoiceQuestion } from "@/components/ChoiceQuestion";
import { Hero } from "@/components/Hero";
import { useStats } from "@/hooks/useStats";
import { proverbChoices } from "@/lib/proverb-choices";
import { recordProverbAnswer } from "@/lib/stats";
import { PROVERBS, type Proverb } from "@/content/proverbs";

export function Proverbs({ proverbs = PROVERBS }: { proverbs?: Proverb[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { update: updateStats } = useStats();

  const proverb = proverbs[index];
  if (!proverb) {
    return (
      <>
        <Hero first="Learn Yoruba proverbs," second="òwe by òwe" />
        <main className="page" style={{ display: "grid", gap: "1rem" }}>
          <p className="muted">No proverbs yet. Check back soon.</p>
        </main>
      </>
    );
  }

  const chosen = answers[proverb.id] ?? null;
  return (
    <>
      <Hero first="Learn Yoruba proverbs," second="òwe by òwe" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
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
            choices={proverbChoices(proverb)}
            chosen={chosen}
            correct={proverb.meaning}
            onChoose={(c) => {
              setAnswers((a) => ({ ...a, [proverb.id]: c }));
              updateStats((st) => recordProverbAnswer(st, proverb.id, c === proverb.meaning));
            }}
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
    </>
  );
}
