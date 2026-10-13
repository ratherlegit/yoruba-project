type Props = {
  prompt: string;
  choices: string[];
  chosen: string | null;
  correct: string;
  onChoose: (choice: string) => void;
};

export function ChoiceQuestion({ prompt, choices, chosen, correct, onChoose }: Props) {
  const answered = chosen !== null;
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <p className="yo" style={{ margin: 0 }}>{prompt}</p>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {choices.map((c) => {
          const state = !answered ? undefined : c === correct ? "correct" : c === chosen ? "wrong" : undefined;
          return (
            <button
              key={c}
              className="btn choice yo"
              data-testid="choice"
              data-state={state}
              disabled={answered}
              onClick={() => onChoose(c)}
            >
              {state === "correct" && <span aria-hidden="true">{"✓ "}</span>}
              {state === "wrong" && <span aria-hidden="true">{"✗ "}</span>}
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
