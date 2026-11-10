import { useProgress } from "@/hooks/useProgress";
import { playSfx } from "@/lib/sfx";

function Switch({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="setting-row">
      <div className="setting-text">
        <label htmlFor={id}><strong>{label}</strong></label>
        <span className="muted" id={`${id}-hint`}>{hint}</span>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-hint`}
        className="switch"
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" aria-hidden="true" />
        <span className="switch-label">{checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}

export function Settings() {
  const { progress, update } = useProgress();
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>Settings</h1>
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <Switch
          id="setting-sounds"
          label="Answer sounds"
          hint="A short chime for a right answer, a soft tone for a wrong one, and a flourish when you finish."
          checked={progress.sounds}
          onChange={(on) => {
            update((p) => ({ ...p, sounds: on }));
            if (on) playSfx("correct");
          }}
        />
        <Switch
          id="setting-motion"
          label="Animations"
          hint="Moving patterns, bounces and slides. Turn this off for a still page. It is already off if your device asks for reduced motion."
          checked={progress.motion}
          onChange={(on) => update((p) => ({ ...p, motion: on }))}
        />
      </section>
      <p className="muted" style={{ margin: 0 }}>Settings are saved in your browser, like your progress. Word and sentence audio is separate and always plays when you press its button.</p>
    </main>
  );
}
