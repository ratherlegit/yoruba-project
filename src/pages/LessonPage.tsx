import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Activity, type ActivityResult } from "@/components/Activity";
import { LockedLevel } from "@/components/LockedLevel";
import { NotFound } from "@/components/NotFound";
import { Primer } from "@/components/Primer";
import { Results } from "@/components/Results";
import { LEVELS, getLesson, getLevel, nextLessonPath } from "@/content/levels";
import type { Question } from "@/content/types";
import { useProgress } from "@/hooks/useProgress";
import { isLevelUnlocked, recordCompletion } from "@/lib/progress";

type View =
  | { name: "primer" }
  | { name: "activity"; questions: Question[]; attempt: number; full: boolean }
  | { name: "results"; result: ActivityResult };

// Keyed by lesson so moving to the next lesson resets the view state.
export function LessonPage() {
  const { levelId, lessonId } = useParams({ strict: false }) as { levelId: string; lessonId: string };
  return <LessonView key={`${levelId}/${lessonId}`} levelId={levelId} lessonId={lessonId} />;
}

function LessonView({ levelId, lessonId }: { levelId: string; lessonId: string }) {
  const { progress, update, loaded } = useProgress();
  const [view, setView] = useState<View>({ name: "primer" });
  const [showPrimer, setShowPrimer] = useState(false);

  const level = getLevel(levelId);
  const lesson = getLesson(levelId, lessonId);
  if (!level || !lesson) return <NotFound what="lesson" />;
  // Wait for saved progress so a saved "unlock all" never flashes the not-found state.
  if (!loaded) return <main className="page" aria-busy="true" />;
  if (!isLevelUnlocked(LEVELS, progress, level.id)) {
    const prev = LEVELS[LEVELS.findIndex((l) => l.id === level.id) - 1];
    return <LockedLevel levelTitle={level.title} prevTitle={prev?.title ?? level.title} />;
  }
  const upcoming = nextLessonPath(level.id, lesson.id);
  const nextOpen = upcoming !== null && isLevelUnlocked(LEVELS, progress, upcoming.levelId);

  function finish(result: ActivityResult, wasFullRun: boolean) {
    if (wasFullRun) update((p) => recordCompletion(p, lesson!.id, result.correct / result.total));
    setView({ name: "results", result });
  }

  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/level/$levelId" params={{ levelId: level.id }}>{level.title}</Link>
      <h1 style={{ margin: 0 }}>{lesson.title}</h1>

      {view.name === "primer" && (
        <Primer
          lesson={lesson}
          onStart={() => setView({ name: "activity", questions: lesson.questions, attempt: 0, full: true })}
        />
      )}

      {view.name === "activity" && (
        <>
          <button className="btn" onClick={() => setShowPrimer((s) => !s)}>
            {showPrimer ? "Hide instructions" : "Show instructions"}
          </button>
          {showPrimer && <Primer lesson={lesson} />}
          <Activity
            key={view.attempt}
            questions={view.questions}
            onDone={(r) => finish(r, view.full)}
          />
        </>
      )}

      {view.name === "results" && (
        <Results
          correct={view.result.correct}
          total={view.result.total}
          missedCount={view.result.missed.length}
          levelId={level.id}
          next={nextOpen ? upcoming : null}
          nextLockedAfter={upcoming && !nextOpen ? level.title : null}
          onReviewInstructions={() => setView({ name: "primer" })}
          onRetryMissed={() =>
            setView({ name: "activity", questions: view.result.missed, attempt: Date.now(), full: false })
          }
        />
      )}
    </main>
  );
}
