export type VocabMode = "quiz" | "gap";
type Entry = { bestScore: number; completedAt: string };
export type VocabProgress = { topics: Record<string, Partial<Record<VocabMode, Entry>>> };

export const emptyVocabProgress: VocabProgress = { topics: {} };
const KEY = "yp:vocab-progress:v1";

function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validEntry(e: unknown): e is Entry {
  return !!e && typeof e === "object" && typeof (e as Entry).bestScore === "number" && typeof (e as Entry).completedAt === "string";
}

export function loadVocabProgress(storage: Storage | null = defaultStorage()): VocabProgress {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyVocabProgress;
    const v = JSON.parse(raw) as { topics?: unknown };
    if (!v || typeof v !== "object" || !v.topics || typeof v.topics !== "object" || Array.isArray(v.topics)) {
      return emptyVocabProgress;
    }
    const topics: VocabProgress["topics"] = {};
    for (const [id, modes] of Object.entries(v.topics as Record<string, unknown>)) {
      if (!modes || typeof modes !== "object") continue;
      const m = modes as Record<string, unknown>;
      const kept: Partial<Record<VocabMode, Entry>> = {};
      if (validEntry(m.quiz)) kept.quiz = m.quiz;
      if (validEntry(m.gap)) kept.gap = m.gap;
      if (kept.quiz || kept.gap) topics[id] = kept;
    }
    return { topics };
  } catch {
    return emptyVocabProgress;
  }
}

export function saveVocabProgress(p: VocabProgress, storage: Storage | null = defaultStorage()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage can be blocked. Progress simply will not persist.
  }
}

export function recordVocabCompletion(
  p: VocabProgress, topicId: string, mode: VocabMode, score: number, now: Date = new Date(),
): VocabProgress {
  const prev = p.topics[topicId]?.[mode];
  const entry: Entry = {
    bestScore: prev ? Math.max(prev.bestScore, score) : score,
    completedAt: prev?.completedAt ?? now.toISOString(),
  };
  return { topics: { ...p.topics, [topicId]: { ...p.topics[topicId], [mode]: entry } } };
}

export const isTopicComplete = (p: VocabProgress, topicId: string): boolean => {
  const t = p.topics[topicId];
  return !!(t?.quiz || t?.gap);
};

export const topicsDone = (p: VocabProgress, topicIds: string[]): number =>
  topicIds.filter((id) => isTopicComplete(p, id)).length;
