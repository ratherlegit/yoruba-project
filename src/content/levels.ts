import type { Level, Lesson } from "./types";
import { gs1 } from "./lessons/gs-1";
import { gs2 } from "./lessons/gs-2";
import { gs3 } from "./lessons/gs-3";
import { gs4 } from "./lessons/gs-4";
import { b1 } from "./lessons/b-1";
import { b2 } from "./lessons/b-2";
import { b3 } from "./lessons/b-3";
import { b4 } from "./lessons/b-4";
import { i1 } from "./lessons/i-1";
import { i2 } from "./lessons/i-2";
import { i3 } from "./lessons/i-3";
import { i4 } from "./lessons/i-4";
import { a1 } from "./lessons/a-1";
import { a2 } from "./lessons/a-2";
import { a3 } from "./lessons/a-3";
import { a4 } from "./lessons/a-4";
import { m1 } from "./lessons/m-1";
import { m2 } from "./lessons/m-2";
import { m3 } from "./lessons/m-3";
import { m4 } from "./lessons/m-4";

export const LEVELS: Level[] = [
  { id: "getting-started", title: "Getting Started", summary: "Sounds, tones, greetings, and pronouns.", lessons: [gs1, gs2, gs3, gs4] },
  { id: "beginner", title: "Beginner", summary: "Simple sentences, negation, and questions.", lessons: [b1, b2, b3, b4] },
  { id: "intermediate", title: "Intermediate", summary: "Tense, possession, and building nouns.", lessons: [i1, i2, i3, i4] },
  { id: "advanced", title: "Advanced", summary: "Contraction, verbal nouns, and longer clauses.", lessons: [a1, a2, a3, a4] },
  { id: "mastery", title: "Mastery", summary: "Fused forms, focus, and proverbs.", lessons: [m1, m2, m3, m4] },
];

export const getLevel = (id: string): Level | undefined => LEVELS.find((l) => l.id === id);

export const getLesson = (levelId: string, lessonId: string): Lesson | undefined =>
  getLevel(levelId)?.lessons.find((l) => l.id === lessonId);

export function nextLessonPath(levelId: string, lessonId: string): { levelId: string; lessonId: string } | null {
  const flat = LEVELS.flatMap((lv) => lv.lessons.map((ls) => ({ levelId: lv.id, lessonId: ls.id })));
  const i = flat.findIndex((x) => x.levelId === levelId && x.lessonId === lessonId);
  return i >= 0 && i + 1 < flat.length ? flat[i + 1]! : null;
}
