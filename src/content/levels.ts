import type { Level, Lesson } from "./types";
import { gs1 } from "./lessons/gs-1";

export const LEVELS: Level[] = [
  { id: "getting-started", title: "Getting Started", summary: "Sounds, tones, greetings, and pronouns.", lessons: [gs1] },
  { id: "beginner", title: "Beginner", summary: "Simple sentences, negation, and questions.", lessons: [] },
  { id: "intermediate", title: "Intermediate", summary: "Tense, possession, and building nouns.", lessons: [] },
  { id: "advanced", title: "Advanced", summary: "Contraction, verbal nouns, and longer clauses.", lessons: [] },
  { id: "mastery", title: "Mastery", summary: "Fused forms, focus, and proverbs.", lessons: [] },
];

export const getLevel = (id: string): Level | undefined => LEVELS.find((l) => l.id === id);

export const getLesson = (levelId: string, lessonId: string): Lesson | undefined =>
  getLevel(levelId)?.lessons.find((l) => l.id === lessonId);

export function nextLessonPath(levelId: string, lessonId: string): { levelId: string; lessonId: string } | null {
  const flat = LEVELS.flatMap((lv) => lv.lessons.map((ls) => ({ levelId: lv.id, lessonId: ls.id })));
  const i = flat.findIndex((x) => x.levelId === levelId && x.lessonId === lessonId);
  return i >= 0 && i + 1 < flat.length ? flat[i + 1]! : null;
}
