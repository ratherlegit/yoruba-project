import { Link } from "@tanstack/react-router";
import { AudioButton } from "@/components/AudioButton";
import type { NextLesson } from "@/lib/home";
import type { VocabWord } from "@/content/vocab/types";

// The first sentence of the lesson's summary, as a one line topic.
const topic = (rule: string) => rule.split(/(?<=[.!?])\s/)[0] ?? rule;

// The strip above the activity cards: where to pick up, and one word for today.
export function HomeToday({ next, word }: { next: NextLesson; word: VocabWord | null }) {
  return (
    <div className="today">
      {next ? (
        <Link to="/lesson/$levelId/$lessonId" params={{ levelId: next.levelId, lessonId: next.lesson.id }} className="today-continue" data-testid="today-continue">
          <h2>{next.started ? "Continue where you left off" : "Start your first lesson"}</h2>
          <span className="today-yo">{next.lesson.title}</span>
          <span className="today-topic">{topic(next.lesson.primer.rule)}</span>
          <span className="today-go">{next.started ? "Continue" : "Begin"}</span>
        </Link>
      ) : (
        <Link to="/grammar" className="today-continue" data-testid="today-continue">
          <h2>Every lesson is done</h2>
          <span className="today-yo">Well done</span>
          <span className="today-go">Review Grammar</span>
        </Link>
      )}
      <section className="today-word card" aria-label="Word of the day" data-testid="word-of-the-day">
        <h2>Word of the day</h2>
        {word && (
          <div className="today-word-row">
            <span className="today-yo">{word.yoruba}</span>
            <AudioButton text={word.yoruba} />
          </div>
        )}
        {word && <span className="muted">{word.english}</span>}
        {word && (
          <div className="today-example" data-testid="word-example">
            <div className="today-word-row">
              <span className="yo">{word.sentence.yoruba}</span>
              <AudioButton text={word.sentence.yoruba} />
            </div>
            <span className="muted">{word.sentence.english}</span>
          </div>
        )}
      </section>
    </div>
  );
}
