import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { LEVELS } from "@/content/levels";
import { PROVERBS } from "@/content/proverbs";
import type { TransformKind } from "@/content/transforms";
import { VOCAB_LEVELS } from "@/content/vocab";
import { useProgress } from "@/hooks/useProgress";
import { useStats } from "@/hooks/useStats";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { NUMBER_STEPS } from "@/content/numbers";
import { accuracy, currentRun, numbersSummary, practiceDays, proverbSummary, toneSummary, transformSummary, withExtraDays } from "@/lib/stats";
import type { ToneMode } from "@/lib/tone-practice";

const pct = (score: number) => `${Math.round(score * 100)}%`;
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DASH = "\u2013";

function StatsTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <table className="stats-table">
      <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function StatsSection({ id, title, empty, link, children }: {
  id: string; title: string; empty: boolean; link: { to: string; text: string }; children: ReactNode;
}) {
  return (
    <section className="card stats-section" data-testid={`stats-${id}`}>
      <h2 className="stats-heading">{title}</h2>
      {empty ? (
        <>
          <p className="muted" style={{ margin: 0 }}>Start a lesson to see your stats</p>
          <Link to={link.to}>{link.text}</Link>
        </>
      ) : (
        children
      )}
    </section>
  );
}

export function Stats() {
  const { progress } = useProgress();
  const { progress: vocab } = useVocabProgress();
  const { stats } = useStats();

  const lessonsDone = LEVELS.flatMap((l) => l.lessons).filter((ls) => progress.completedLessons[ls.id]).length;
  const vocabLevels = VOCAB_LEVELS.filter((l) => l.topics.length > 0);
  const vocabDone = vocabLevels.flatMap((l) => l.topics).filter((t) => vocab.topics[t.id]).length;
  const tone = toneSummary(stats);
  const toneModes = (["words", "sentences", "sounds"] as ToneMode[]).filter((m) => tone[m].answered > 0);
  const prov = proverbSummary(stats);
  const trans = transformSummary(stats);
  const kinds = (Object.keys(trans.byKind) as TransformKind[]).filter((k) => trans.byKind[k].total > 0);
  const modes = (["easy", "advanced"] as const).filter((m) => trans.byMode[m].total > 0);
  const completedAt = [
    ...Object.values(progress.completedLessons).map((l) => l.completedAt),
    ...Object.values(vocab.topics).flatMap((t) => [t.quiz?.completedAt, t.gap?.completedAt].filter((x): x is string => !!x)),
  ];
  const allDays = withExtraDays(stats, completedAt);
  const nums = numbersSummary(stats);
  const numberKinds = (["to-yoruba", "to-numeral", "counting", "hear"] as const).filter((k) => nums.kinds[k].answered > 0);
  const KIND_LABEL = { "to-yoruba": "Numeral to Yoruba", "to-numeral": "Yoruba to numeral", counting: "Counting things", hear: "Listening" } as const;
  const days = practiceDays(allDays);
  const run = currentRun(allDays);

  return (
    <>
      <Hero first="Your stats" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <StatsSection id="grammar" title="Grammar" empty={lessonsDone === 0} link={{ to: "/grammar", text: "Go to Grammar" }}>
          {LEVELS.map((lv) => {
            const done = lv.lessons.filter((ls) => progress.completedLessons[ls.id]);
            return (
              <div key={lv.id} className="stats-block">
                <p className="stats-level"><strong>{lv.title}</strong> <span className="muted">{done.length} of {lv.lessons.length} lessons done</span></p>
                {done.length > 0 && (
                  <StatsTable head={["Lesson", "Best score"]}>
                    {done.map((ls) => (
                      <tr key={ls.id}><td>{ls.title}</td><td>{pct(progress.completedLessons[ls.id]!.bestScore)}</td></tr>
                    ))}
                  </StatsTable>
                )}
              </div>
            );
          })}
        </StatsSection>

        <StatsSection id="vocab" title="Vocab" empty={vocabDone === 0} link={{ to: "/vocab", text: "Go to Vocab" }}>
          {vocabLevels.map((lv) => {
            const done = lv.topics.filter((t) => vocab.topics[t.id]);
            return (
              <div key={lv.id} className="stats-block">
                <p className="stats-level"><strong>{lv.title}</strong> <span className="muted">{done.length} of {lv.topics.length} topics done</span></p>
                {done.length > 0 && (
                  <StatsTable head={["Topic", "Quiz", "Gap fill"]}>
                    {done.map((t) => {
                      const e = vocab.topics[t.id]!;
                      return (
                        <tr key={t.id}>
                          <td>{t.title}</td>
                          <td>{e.quiz ? pct(e.quiz.bestScore) : DASH}</td>
                          <td>{e.gap ? pct(e.gap.bestScore) : DASH}</td>
                        </tr>
                      );
                    })}
                  </StatsTable>
                )}
              </div>
            );
          })}
        </StatsSection>

        <StatsSection id="tone" title="Tone practice" empty={toneModes.length === 0} link={{ to: "/sounds", text: "Go to Sound Bank" }}>
          <StatsTable head={["Mode", "Right", "Answered", "Accuracy"]}>
            {toneModes.map((m) => {
              const a = accuracy(tone[m].correct, tone[m].answered);
              return (
                <tr key={m}><td>{label(m)}</td><td>{tone[m].correct}</td><td>{tone[m].answered}</td><td>{a !== null ? `${a}%` : DASH}</td></tr>
              );
            })}
          </StatsTable>
        </StatsSection>

        <StatsSection id="proverbs" title="Proverbs" empty={prov.guessed === 0} link={{ to: "/proverbs", text: "Go to Proverbs" }}>
          <StatsTable head={["Measure", "Count"]}>
            <tr><td>Proverbs guessed</td><td>{prov.guessed} of {PROVERBS.length}</td></tr>
            <tr><td>Right on the first try</td><td>{prov.right}</td></tr>
          </StatsTable>
        </StatsSection>

        <StatsSection id="transform" title="Transform" empty={kinds.length === 0} link={{ to: "/transform", text: "Go to Transform" }}>
          <StatsTable head={["Type", "Right", "Close", "Wrong"]}>
            {kinds.map((k) => (
              <tr key={k}><td>{label(k)}</td><td>{trans.byKind[k].right}</td><td>{trans.byKind[k].close}</td><td>{trans.byKind[k].wrong}</td></tr>
            ))}
          </StatsTable>
          <StatsTable head={["Mode", "Right", "Close", "Wrong"]}>
            {modes.map((m) => (
              <tr key={m}><td>{label(m)}</td><td>{trans.byMode[m].right}</td><td>{trans.byMode[m].close}</td><td>{trans.byMode[m].wrong}</td></tr>
            ))}
          </StatsTable>
        </StatsSection>

        <StatsSection id="numbers" title="Numbers" empty={nums.stepsDone === 0 && numberKinds.length === 0} link={{ to: "/numbers", text: "Go to Numbers" }}>
          <p className="stats-level">{nums.stepsDone} of {NUMBER_STEPS.length} steps done</p>
          <StatsTable head={["Step", "Best score"]}>
            {NUMBER_STEPS.filter((s) => nums.steps[s.id] !== undefined).map((s) => (
              <tr key={s.id}><td>{s.title}</td><td>{pct(nums.steps[s.id]!)}</td></tr>
            ))}
          </StatsTable>
          <StatsTable head={["Question type", "Right", "Answered", "Accuracy"]}>
            {numberKinds.map((k) => {
              const a = accuracy(nums.kinds[k].correct, nums.kinds[k].answered);
              return (
                <tr key={k}><td>{KIND_LABEL[k]}</td><td>{nums.kinds[k].correct}</td><td>{nums.kinds[k].answered}</td><td>{a !== null ? `${a}%` : DASH}</td></tr>
              );
            })}
          </StatsTable>
        </StatsSection>

        <StatsSection id="days" title="Practice days" empty={days === 0} link={{ to: "/grammar", text: "Start with Grammar" }}>
          <StatsTable head={["Measure", "Days"]}>
            <tr><td>Days practised</td><td>{days}</td></tr>
            {run > 0 && <tr><td>Day run</td><td>{run}</td></tr>}
          </StatsTable>
        </StatsSection>
      </main>
    </>
  );
}
