import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { VocabWord } from "@/content/vocab/types";
import { Flashcards } from "./Flashcards";

const word = (id: string, yoruba: string, english: string): VocabWord => ({
  id,
  yoruba,
  english,
  pos: "noun",
  sentence: { yoruba: `${yoruba} wà níbí.`, english: `The ${english} is here.` },
  confidence: "verified",
});

const words = [word("a", "ilé", "house"), word("b", "omi", "water"), word("c", "ata", "pepper")];

describe("Flashcards", () => {
  it("shows the first card and counter", () => {
    render(<Flashcards words={words} />);
    expect(screen.getByText("Card 1 of 3")).toBeInTheDocument();
    expect(screen.getByTestId("flashcard-word")).toHaveTextContent("ilé");
    expect(screen.queryByTestId("flashcard-back")).not.toBeInTheDocument();
  });

  it("Flip reveals gloss, part of speech, sentence and translation", async () => {
    const user = userEvent.setup();
    render(<Flashcards words={words} />);
    await user.click(screen.getByRole("button", { name: "Flip" }));
    const back = screen.getByTestId("flashcard-back");
    expect(back).toHaveTextContent("house");
    expect(back).toHaveTextContent("(noun)");
    expect(back).toHaveTextContent("ilé wà níbí.");
    expect(back).toHaveTextContent("The house is here.");
  });

  it("Next and Previous move through cards and are disabled at the ends", async () => {
    const user = userEvent.setup();
    render(<Flashcards words={words} />);
    const prev = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(prev).toBeDisabled();
    await user.click(next);
    expect(screen.getByText("Card 2 of 3")).toBeInTheDocument();
    expect(screen.getByTestId("flashcard-word")).toHaveTextContent("omi");
    await user.click(next);
    expect(screen.getByTestId("flashcard-word")).toHaveTextContent("ata");
    expect(next).toBeDisabled();
    await user.click(prev);
    expect(screen.getByTestId("flashcard-word")).toHaveTextContent("omi");
  });

  it("moving to another card shows its front again", async () => {
    const user = userEvent.setup();
    render(<Flashcards words={words} />);
    await user.click(screen.getByRole("button", { name: "Flip" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByTestId("flashcard-back")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Flip" })).toBeInTheDocument();
  });

  it("a multi-word entry renders without a pitch line", () => {
    render(<Flashcards words={[word("m", "ọjọ́ ìbí", "birthday")]} />);
    expect(screen.getByTestId("flashcard-word")).toHaveTextContent("ọjọ́ ìbí");
    expect(screen.queryByLabelText(/Pitch pattern/)).not.toBeInTheDocument();
  });

  it("a single word renders a pitch line", () => {
    render(<Flashcards words={words} />);
    expect(screen.getByLabelText("Pitch pattern for ilé")).toBeInTheDocument();
  });
});
