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

export function useYorubaVoice(): SpeechSynthesisVoice | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    const synth = globalThis.speechSynthesis;
    setVoice(findVoice());
    if (!synth?.addEventListener) return;
    const onChange = () => setVoice(findVoice());
    synth.addEventListener("voiceschanged", onChange);
    return () => synth.removeEventListener("voiceschanged", onChange);
  }, []);
  return voice;
}
