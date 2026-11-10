import { ActivityCard } from "@/components/ActivityCard";
import { HomeToday } from "@/components/HomeToday";
import { Hero } from "@/components/Hero";
import { LEVELS } from "@/content/levels";
import { PROVERBS } from "@/content/proverbs";
import { TRANSFORMS } from "@/content/transforms";
import { VOCAB_LEVELS, allVocabWords } from "@/content/vocab";
import { useProgress } from "@/hooks/useProgress";
import { useStats } from "@/hooks/useStats";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { NUMBER_STEPS } from "@/content/numbers";
import { nextLesson, wordOfTheDay } from "@/lib/home";
import { numbersSummary, proverbSummary } from "@/lib/stats";
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

  return (
    <>
      <Hero first="Learn Yoruba," second="tone by tone" decor />
      <main className="page home-texture" style={{ display: "grid", gap: "1rem" }}>
        <HomeToday next={nextLesson(LEVELS, progress.completedLessons)} word={wordOfTheDay(allVocabWords())} />
        <div className="activity-grid rise-in">
          <ActivityCard
            activity="grammar" to="/grammar" title="Grammar"
            blurb="Sounds to sentences"
            ring={{ done: lessonsDone, total: lessonIds.length }}
            progress={lessonsDone > 0 ? `${lessonsDone} of ${lessonIds.length} lessons done` : undefined}
          />
          <ActivityCard
            activity="vocab" to="/vocab" title="Vocab"
            blurb="Words by topic"
            ring={{ done: vocabDone, total: topicIds.length }}
            progress={vocabDone > 0 ? `${vocabDone} of ${topicIds.length} topics done` : undefined}
          />
          <ActivityCard
            activity="numbers" to="/numbers" title="Numbers"
            blurb="One to a thousand"
            ring={{ done: numbersDone, total: NUMBER_STEPS.length }}
            progress={numbersDone > 0 ? `${numbersDone} of ${NUMBER_STEPS.length} steps done` : undefined}
          />
          <ActivityCard
            activity="sounds" to="/sounds" title="Sound Bank"
            blurb="Vowels, consonants, tones"
            progress={toneAnswers > 0 ? plural(toneAnswers, "practice answer", "practice answers") : undefined}
          />
          <ActivityCard
            activity="proverbs" to="/proverbs" title="Proverbs"
            blurb="Guess the meaning"
            ring={{ done: proverbsGuessed, total: PROVERBS.length }}
            progress={proverbsGuessed > 0 ? `${proverbsGuessed} of ${PROVERBS.length} proverbs guessed` : undefined}
          />
          <ActivityCard
            activity="transform" to="/transform" title="Transform"
            blurb="Change a sentence"
            ring={{ done: sentences, total: TRANSFORMS.length }}
            progress={sentences > 0 ? `${plural(sentences, "sentence", "sentences")} checked` : undefined}
          />
          <ActivityCard
            activity="songs" to="/songs" title="Songs"
            blurb="Learn from lyrics"
          />
          <ActivityCard
            activity="dialogues" to="/dialogues" title="Dialogues"
            blurb="Everyday conversations"
          />
        </div>
      </main>
    </>
  );
}
