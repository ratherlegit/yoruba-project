import { Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { DIALOGUES, SITUATIONS } from "@/content/dialogues";
import { LEVELS } from "@/content/levels";

export function Dialogues() {
  return (
    <>
      <Hero first="Hear real conversations," second="line by line" />
      <main className="page" style={{ display: "grid", gap: "1.5rem" }}>
        <p className="muted" style={{ margin: 0 }}>
          Short conversations between two people, one level at a time. Read them with the English beside them, listen to each line, then answer a few questions.
        </p>
        {LEVELS.map((level) => {
          const situations = SITUATIONS.filter((s) => s.level === level.id);
          if (situations.length === 0) return null;
          return (
            <section key={level.id} data-testid="dialogue-level" style={{ display: "grid", gap: "0.9rem" }}>
              <h2 style={{ margin: 0 }}>{level.title}</h2>
              {situations.map((s) => (
                <div key={s.id} style={{ display: "grid", gap: "0.6rem" }}>
                  <p style={{ margin: 0 }}>
                    <strong>{s.title}</strong> <span className="muted">{s.summary}</span>
                  </p>
                  <div className="rise-in" style={{ display: "grid", gap: "0.6rem" }}>
                    {DIALOGUES.filter((d) => d.situationId === s.id).map((d) => (
                      <Link
                        key={d.id}
                        to="/dialogues/$dialogueId"
                        params={{ dialogueId: d.id }}
                        className="card row-card"
                        data-testid="dialogue-card"
                        style={{ textDecoration: "none", color: "var(--text)" }}
                      >
                        <span className="row-main" style={{ display: "grid", gap: "0.2rem" }}>
                          <strong>{d.title}</strong>
                          <span className="muted">{d.setting}</span>
                        </span>
                        <span className="status-cell"><span className="genre-chip">{d.lines.length} lines</span></span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </main>
    </>
  );
}
