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
import { accuracy, currentRun, practiceDays, proverbSummary, toneSummary, transformSummary, withExtraDays } from "@/lib/stats";
import type { ToneMode } from "@/lib/tone-practice";

const pct = (score: number) => `${Math.round(score * 100)}%`;
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function StatsSection({ id, title, empty, link, children }: {
  id: string; title: string; empty: boolean; link: { to: string; text: string }; children: ReactNode;
}) {
  return (
    <section className="card stats-section" data-testid={`stats-${id}`}>
      <h2 style={{ margin: 0 }}>{title}</h2>
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
                <p style={{ margin: 0 }}><strong>{lv.title}</strong> <span className="muted">{done.length} of {lv.lessons.length} lessons done</span></p>
                {done.length > 0 && (
                  <ul className="stats-list">
                    {done.map((ls) => (
                      <li key={ls.id}>{ls.title} <span className="muted">{pct(progress.completedLessons[ls.id]!.bestScore)}</span></li>
                    ))}
                  </ul>
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
                <p style={{ margin: 0 }}><strong>{lv.title}</strong> <span className="muted">{done.length} of {lv.topics.length} topics done</span></p>
                {done.length > 0 && (
                  <ul className="stats-list">
                    {done.map((t) => {
                      const e = vocab.topics[t.id]!;
                      return (
                        <li key={t.id}>
                          {t.title}{" "}
                          <span className="muted">
                            {[e.quiz && `Quiz ${pct(e.quiz.bestScore)}`, e.gap && `Gap fill ${pct(e.gap.bestScore)}`].filter(Boolean).join(", ")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </StatsSection>

        <StatsSection id="tone" title="Tone practice" empty={toneModes.length === 0} link={{ to: "/sounds", text: "Go to Sound Bank" }}>
          <ul className="stats-list">
            {toneModes.map((m) => {
              const a = accuracy(tone[m].correct, tone[m].answered);
              return (
                <li key={m}>
                  <strong>{label(m)}</strong> <span className="muted">{tone[m].correct} of {tone[m].answered} right{a !== null ? ` (${a}%)` : ""}</span>
                </li>
              );
            })}
          </ul>
        </StatsSection>

        <StatsSection id="proverbs" title="Proverbs" empty={prov.guessed === 0} link={{ to: "/proverbs", text: "Go to Proverbs" }}>
          <p style={{ margin: 0 }}>{prov.guessed} of {PROVERBS.length} proverbs guessed</p>
          <p className="muted" style={{ margin: 0 }}>{prov.right} right on the first try</p>
        </StatsSection>

        <StatsSection id="transform" title="Transform" empty={kinds.length === 0} link={{ to: "/transform", text: "Go to Transform" }}>
          <ul className="stats-list">
            {kinds.map((k) => (
              <li key={k}>{label(k)}: {trans.byKind[k].right} right, {trans.byKind[k].close} close, {trans.byKind[k].wrong} wrong</li>
            ))}
          </ul>
          <ul className="stats-list">
            {modes.map((m) => (
              <li key={m}>{label(m)}: {trans.byMode[m].right} right, {trans.byMode[m].close} close, {trans.byMode[m].wrong} wrong</li>
            ))}
          </ul>
        </StatsSection>

        <StatsSection id="days" title="Practice days" empty={days === 0} link={{ to: "/grammar", text: "Start with Grammar" }}>
          <p style={{ margin: 0 }}>Days practised: {days}</p>
          {run > 0 && <p style={{ margin: 0 }}>Day run: {run}</p>}
        </StatsSection>
      </main>
    </>
  );
}
