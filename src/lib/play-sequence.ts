import type { Voice } from "@/content/dialogues";
import { audioUrlFor } from "./audio";
import { isCurrentClip, playClip } from "./clip";

let run = 0;

// Resolves true when the clip ended on its own, false when something else took over the player.
function playUntilEnded(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const clip = playClip(url, () => resolve(true));
    if (!clip) return resolve(true); // could not play: skip it and carry on
    const done = () => resolve(isCurrentClip(clip));
    clip.addEventListener("ended", done, { once: true });
    clip.addEventListener("error", done, { once: true });
    clip.addEventListener("pause", done, { once: true });
  });
}

export type SequenceItem = string | { text: string; voice: Voice };

// Plain strings are played in the female voice; a dialogue passes each line with its own voice.
export async function playSequence(
  items: SequenceItem[],
  opts: { lookup?: (text: string, voice: Voice) => string | null; play?: (url: string) => Promise<boolean> } = {},
): Promise<void> {
  const id = ++run;
  const lookup = opts.lookup ?? audioUrlFor;
  const play = opts.play ?? playUntilEnded;
  for (const item of items) {
    if (id !== run) return;
    const { text, voice } = typeof item === "string" ? { text: item, voice: "female" as Voice } : item;
    const url = lookup(text, voice);
    if (!url) continue;
    if (!(await play(url))) return;
  }
}
