import { Link, useParams } from "@tanstack/react-router";
import { AudioButton } from "@/components/AudioButton";
import { NumbersPractice } from "@/components/NumbersPractice";
import { NUMBERS, NUMBER_STEPS, PHRASES } from "@/content/numbers";
import { showBuild, showBuildWords } from "@/lib/show-build";

// The audio button is glued to the sentence's last word, so a sentence that wraps never strands it.
function SentenceWithAudio({ text }: { text: string }) {
  const at = text.lastIndexOf(" ");
  const head = at === -1 ? "" : text.slice(0, at + 1);
  const last = at === -1 ? text : text.slice(at + 1);
  return (
    <span className="yo audio-sentence">
      {head}
      <span className="audio-tail">{last}<AudioButton text={text} /></span>
    </span>
  );
}

export function NumbersStep() {
  const { stepId } = useParams({ strict: false }) as { stepId: string };
  const stepIndex = NUMBER_STEPS.findIndex((s) => s.id === stepId);
  const step = NUMBER_STEPS[stepIndex];
  if (!step) {
    return (
      <main className="page">
        <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
          <h1 style={{ margin: 0 }}>We couldn't find that step</h1>
          <p className="muted" style={{ margin: 0 }}>The link may be old or mistyped.</p>
          <Link className="btn btn-primary" to="/numbers">Back to Numbers</Link>
        </div>
      </main>
    );
  }
  const entries = step.entryIds.map((id) => NUMBERS.find((n) => n.id === id)!).filter(Boolean);
  const phrases = step.phraseIds.map((id) => PHRASES.find((p) => p.id === id)!).filter(Boolean);
  const first = step.id === "one-to-ten";

  return (
    <main className="page page-wide" style={{ display: "grid", gap: "1rem" }}>
      <Link to="/numbers">Back to Numbers</Link>
      <h1 style={{ margin: 0 }}>{step.title}</h1>
      <p className="numbers-intro" style={{ margin: 0 }}>{step.rule}</p>

      {entries.length > 0 && (
        <table className="numbers-table" data-testid="numbers-examples">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Yoruba</th>
              <th scope="col">{first ? "After a noun" : "How it is built"}</th>
              {first && <th scope="col">Example after a noun</th>}
              {first && <th scope="col">Example on its own</th>}
            </tr>
          </thead>
          <tbody>
            {entries.map((n) => (
              <tr key={n.id}>
                <td>{n.value}</td>
                <td data-label="Yoruba">
                  <span className="with-audio"><span className="yo">{n.yoruba}</span><AudioButton text={n.yoruba} /></span>
                  {n.answers.length > 1 && <span className="muted"> also {n.answers.slice(1).join(", ")}</span>}
                </td>
                <td data-label={first ? "After a noun" : "How it is built"}>
                  {first ? (
                    <span className="with-audio"><span className="yo">{n.after.join(", ")}</span>{n.after[0] && <AudioButton text={n.after[0]} />}</span>
                  ) : n.build ? (
                    <>
                      {showBuild(n.build)}
                      <span className="yo muted audio-english">{showBuildWords(n.build)}</span>
                    </>
                  ) : (
                    <span className="muted">a base word</span>
                  )}
                </td>
                {first && (
                  <td data-label="Example after a noun">
                    {n.example && (
                      <>
                        <SentenceWithAudio text={n.example.yoruba} />
                        <span className="muted audio-english">{n.example.english}</span>
                      </>
                    )}
                  </td>
                )}
                {first && (
                  <td data-label="Example on its own">
                    {n.plainExample && (
                      <>
                        <SentenceWithAudio text={n.plainExample.yoruba} />
                        <span className="muted audio-english">{n.plainExample.english}</span>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {phrases.length > 0 && (
        <ul className="numbers-phrases" data-testid="numbers-examples">
          {phrases.map((p) => (
            <li key={p.id}>
              <span className="with-audio"><span className="yo">{p.answers[0]}</span><AudioButton text={p.answers[0]!} /></span>
              <span className="muted">{p.prompt}</span>
            </li>
          ))}
        </ul>
      )}

      <section className="card numbers-practice" data-testid="numbers-practice" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Practice</h2>
        <NumbersPractice stepId={step.id} />
      </section>
    </main>
  );
}
