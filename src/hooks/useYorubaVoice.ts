import { useEffect, useState } from "react";

function findVoice(): SpeechSynthesisVoice | null {
  try {
    const synth = globalThis.speechSynthesis;
    if (!synth) return null;
    return synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("yo")) ?? null;
  } catch {
    return null;
  }
}

// `checked` is false until the first look for a voice, so callers can avoid a flash of "no voice".
export function useYorubaVoiceState(): { voice: SpeechSynthesisVoice | null; checked: boolean } {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const synth = globalThis.speechSynthesis;
    setVoice(findVoice());
    setChecked(true);
    if (!synth?.addEventListener) return;
    const onChange = () => setVoice(findVoice());
    synth.addEventListener("voiceschanged", onChange);
    return () => synth.removeEventListener("voiceschanged", onChange);
  }, []);
  return { voice, checked };
}

export function useYorubaVoice(): SpeechSynthesisVoice | null {
  return useYorubaVoiceState().voice;
}
