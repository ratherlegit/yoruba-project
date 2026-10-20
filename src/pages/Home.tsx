import { ActivityCard } from "@/components/ActivityCard";
import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/StatsStrip";
import { LEVELS } from "@/content/levels";
import { PROVERBS } from "@/content/proverbs";
import { VOCAB_LEVELS } from "@/content/vocab";
import { useProgress } from "@/hooks/useProgress";
import { useStats } from "@/hooks/useStats";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { NUMBER_STEPS } from "@/content/numbers";
import { numbersSummary, proverbSummary, withExtraDays } from "@/lib/stats";
import { buildStrip } from "@/lib/stats-summary";
import { topicsDone } from "@/lib/vocab-progress";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function Home() {
  const { progress } = useProgress();
  const { progress: vocab } = useVocabProgress();
  const { stats } = useStats();

  const lessonIds = LEVELS.flatMap((l) => l.lessons.map((ls) => ls.id));
  const topicIds = VOCAB_LEVELS.flatMap((l) => l.topics.map((t) => t.id));
  const lessonsDone = lessonIds.filter((id) => progress.completedLessons[id]).length;
  const vocabDone = topicsDone(vocab, topicIds);
  const toneAnswers = Object.values(stats.tone).reduce((n, t) => n + t.answered, 0);
  const proverbsGuessed = proverbSummary(stats).guessed;
  const numbersDone = numbersSummary(stats).stepsDone;
  const sentences = new Set(Object.keys(stats.transform).map((k) => k.slice(k.indexOf(":") + 1))).size;
  const completedAt = [
    ...Object.values(progress.completedLessons).map((l) => l.completedAt),
    ...Object.values(vocab.topics).flatMap((t) => [t.quiz?.completedAt, t.gap?.completedAt].filter((x): x is string => !!x)),
  ];
  const figures = buildStrip({
    lessonsDone, lessonsTotal: lessonIds.length, topicsDone: vocabDone, topicsTotal: topicIds.length,
    stats: withExtraDays(stats, completedAt),
  });

  return (
    <>
      <Hero first="Learn Yoruba," second="tone by tone" />
      <main className="page" style={{ display: "grid", gap: "1rem" }}>
        <StatsStrip figures={figures} />
        <div className="activity-grid rise-in">
          <ActivityCard
            activity="grammar" to="/grammar" title="Grammar"
            description="Five levels from sounds to sentences, one small lesson at a time."
            progress={lessonsDone > 0 ? `${lessonsDone} of ${lessonIds.length} lessons done` : undefined}
          />
          <ActivityCard
            activity="vocab" to="/vocab" title="Vocab"
            description="Common words by topic, with flashcards and practice."
            progress={vocabDone > 0 ? `${vocabDone} of ${topicIds.length} topics done` : undefined}
          />
          <ActivityCard
            activity="numbers" to="/numbers" title="Numbers"
            description="Count in Yoruba, from one to a thousand, and see how the twenties work."
            progress={numbersDone > 0 ? `${numbersDone} of ${NUMBER_STEPS.length} steps done` : undefined}
          />
          <ActivityCard
            activity="sounds" to="/sounds" title="Sound Bank"
            description="Every vowel, consonant and tone, with audio and listening practice."
            progress={toneAnswers > 0 ? plural(toneAnswers, "practice answer", "practice answers") : undefined}
          />
          <ActivityCard
            activity="proverbs" to="/proverbs" title="Proverbs"
            description="Read a proverb, guess what it means, then see when you would say it."
            progress={proverbsGuessed > 0 ? `${proverbsGuessed} of ${PROVERBS.length} proverbs guessed` : undefined}
          />
          <ActivityCard
            activity="transform" to="/transform" title="Transform"
            description="Type the negative, question, future or past form of a sentence."
            progress={sentences > 0 ? `${plural(sentences, "sentence", "sentences")} checked` : undefined}
          />
        </div>
      </main>
    </>
  );
}
