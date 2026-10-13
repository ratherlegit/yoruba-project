export type ThemeChoice = "system" | "light" | "dark";

export type Progress = {
  completedLessons: Record<string, { bestScore: number; completedAt: string }>;
  skipAhead: boolean;
  theme: ThemeChoice;
};

export const emptyProgress: Progress = { completedLessons: {}, skipAhead: false, theme: "system" };

const KEY = "yp:progress:v1";
const THEMES: ThemeChoice[] = ["system", "light", "dark"];

function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadProgress(storage: Storage | null = defaultStorage()): Progress {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyProgress;
    const v = JSON.parse(raw) as Partial<Progress>;
    if (!v || typeof v !== "object" || !v.completedLessons || typeof v.completedLessons !== "object") {
      return emptyProgress;
    }
    return {
      completedLessons: v.completedLessons,
      skipAhead: v.skipAhead === true,
      theme: THEMES.includes(v.theme as ThemeChoice) ? (v.theme as ThemeChoice) : "system",
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(p: Progress, storage: Storage | null = defaultStorage()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage can be blocked (private windows). Progress simply will not persist.
  }
}

export function recordCompletion(p: Progress, lessonId: string, score: number, now: Date = new Date()): Progress {
  const prev = p.completedLessons[lessonId];
  const bestScore = prev ? Math.max(prev.bestScore, score) : score;
  return {
    ...p,
    completedLessons: {
      ...p.completedLessons,
      [lessonId]: { bestScore, completedAt: prev?.completedAt ?? now.toISOString() },
    },
  };
}

export function isLevelUnlocked(
  levels: { id: string; lessons: { id: string }[] }[],
  p: Progress,
  levelId: string,
): boolean {
  const idx = levels.findIndex((l) => l.id === levelId);
  if (idx === -1) return false;
  if (idx === 0 || p.skipAhead) return true;
  return levels[idx - 1]!.lessons.every((l) => p.completedLessons[l.id]);
}
