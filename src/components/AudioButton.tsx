import { useYorubaVoice } from "@/hooks/useYorubaVoice";

export function AudioButton({ text }: { text: string }) {
  const voice = useYorubaVoice();
  if (!voice) return null;

  function play() {
    const synth = globalThis.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice!.lang;
    synth.speak(u);
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
      <button className="btn" onClick={play} aria-label={`Listen to ${text}`}>Listen</button>
      <span className="muted" style={{ fontSize: "0.8rem" }}>approximate pronunciation</span>
    </span>
  );
}
