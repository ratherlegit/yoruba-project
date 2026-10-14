import type { BlankQuestion, PickQuestion } from "@/content/types";
import type { VocabTopic } from "@/content/vocab/types";
import { blankOf, locateBlank } from "@/content/vocab/validate";
import { stripTones } from "./normalize";
import { seededShuffle } from "./shuffle";

export function distractors(answer: string, pool: string[], seed: string, n = 3): string[] {
  const a = answer.toLowerCase();
  const uniq = [...new Set(pool.filter((p) => p.toLowerCase() !== a))];
  const shuffled = seededShuffle(uniq, `${seed}|d`);
  const similar = shuffled.filter((p) => stripTones(p) === stripTones(answer));
  const rest = shuffled.filter((p) => stripTones(p) !== stripTones(answer));
  return [...similar, ...rest].slice(0, n);
}

function choicesFor(answer: string, pool: string[], seed: string): string[] {
  return seededShuffle([answer, ...distractors(answer, pool, seed)], `${seed}|c`);
}

export function buildQuiz(topic: VocabTopic, seed: string = topic.id): PickQuestion[] {
  const order = seededShuffle(topic.words, `${seed}|quiz`);
  const english = topic.words.map((w) => w.english);
  const yoruba = topic.words.map((w) => w.yoruba);
  return order.map((w, i) => {
    const toEnglish = i % 2 === 0;
    const answer = toEnglish ? w.english : w.yoruba;
    const choices = choicesFor(answer, toEnglish ? english : yoruba, `${seed}|${w.id}`);
    return {
      type: "pick" as const,
      prompt: toEnglish ? `What does ${w.yoruba} mean?` : `Which word means "${w.english}"?`,
      choices,
      answer: choices.indexOf(answer),
      wordId: w.id,
    };
  });
}

export function buildGap(topic: VocabTopic, seed: string = topic.id): BlankQuestion[] {
  const order = seededShuffle(topic.words, `${seed}|gap`);
  const pool = topic.words.map((w) => blankOf(w));
  return order.map((w) => {
    const answer = blankOf(w);
    const s = w.sentence.yoruba;
    const { start, end } = locateBlank(s, answer);
    if (start === -1) throw new Error(`${w.id}: blank not found`);
    const prompt = `${s.slice(0, start)}___${s.slice(end)} (${w.sentence.english})`;
    return { type: "blank" as const, prompt, answer, choices: choicesFor(answer, pool, `${seed}|${w.id}`), wordId: w.id };
  });
}
