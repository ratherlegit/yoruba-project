import { LEVELS } from "../levels";
import type { LevelId } from "../types";
import { advancedTopics } from "./advanced";
import { beginnerTopics } from "./beginner";
import { gettingStartedTopics } from "./getting-started";
import { intermediateTopics } from "./intermediate";
import { masteryTopics } from "./mastery";
import type { VocabLevel, VocabTopic, VocabWord } from "./types";

const TOPICS: Record<LevelId, VocabTopic[]> = {
  "getting-started": gettingStartedTopics,
  beginner: beginnerTopics,
  intermediate: intermediateTopics,
  advanced: advancedTopics,
  mastery: masteryTopics,
};

export const VOCAB_LEVELS: VocabLevel[] = LEVELS.map((lv) => ({ id: lv.id, title: lv.title, topics: TOPICS[lv.id] }));

export const getVocabLevel = (id: string): VocabLevel | undefined => VOCAB_LEVELS.find((l) => l.id === id);

export const getVocabTopic = (levelId: string, topicId: string): VocabTopic | undefined =>
  getVocabLevel(levelId)?.topics.find((t) => t.id === topicId);

export const allVocabWords = (): VocabWord[] => VOCAB_LEVELS.flatMap((l) => l.topics.flatMap((t) => t.words));

export function nextVocabTopicPath(levelId: string, topicId: string): { levelId: string; topicId: string } | null {
  const flat = VOCAB_LEVELS.flatMap((lv) => lv.topics.map((t) => ({ levelId: lv.id as string, topicId: t.id })));
  const i = flat.findIndex((x) => x.levelId === levelId && x.topicId === topicId);
  return i >= 0 && i + 1 < flat.length ? flat[i + 1]! : null;
}
