const SECTIONS: { name: string; text: string }[] = [
  { name: "Grammar", text: "Five levels, from sounds and greetings to proverbs, one small lesson at a time, each with practice." },
  { name: "Vocab", text: "Common words by topic, with flashcards, quizzes and an example sentence for every word." },
  { name: "Numbers", text: "Counting from one to a thousand, how the twenties work, counting things and naira prices, with typed practice." },
  { name: "Sound Bank", text: "Every vowel, consonant and tone with audio, plus listening and tone practice." },
  { name: "Proverbs", text: "Read a Yoruba proverb, guess what it means, then see when it is used." },
  { name: "Transform", text: "Type the negative, question, future or past form of a sentence, in an easy mode that ignores dots and tone marks or an advanced mode that needs them." },
  { name: "Songs", text: "Yoruba songs with the video embedded, a few lines in Yoruba with their English meaning, and a link to the full lyrics. Filter by genre." },
  { name: "Dialogues", text: "Everyday conversations at every level, read with or without the English, heard line by line in two voices, with a few questions after each." },
  { name: "Stats", text: "A page, and a short summary on the landing page, showing what you have practised." },
];

export function About() {
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>About this site</h1>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>What this is</h2>
        <p>
          Yoruba Project is a free, self-paced web app for learning Yoruba from zero. It is built around reading and hearing real Yoruba, always written with full tone marks and dots, and practising it by typing and answering questions rather than memorising flashcards.
        </p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>What is in it</h2>
        <ul data-testid="about-sections" style={{ display: "grid", gap: "0.6rem", paddingLeft: "1.2rem", margin: 0 }}>
          {SECTIONS.map((s) => (
            <li key={s.name}>
              <strong className="about-name">{s.name}</strong>: {s.text}
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Your progress</h2>
        <p>
          Lesson results, scores and stats are saved in your browser on your own device. There are no accounts and your progress is not sent anywhere, so clearing your browser data clears your progress.
        </p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Audio and video</h2>
        {/* Owner: check ElevenLabs's current terms for your plan (for example attribution requirements) and adjust this sentence. */}
        <p>
          Pronunciation clips were generated with ElevenLabs text-to-speech, with one female and one male voice for the dialogues. Song videos are embedded from YouTube. Song lyrics belong to their artists and publishers: this site shows only a few lines of each and links to the full lyrics.
        </p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Spotting mistakes</h2>
        <p>
          Yoruba is a tonal language and tone marks are easy to get wrong, so there may be mistakes here. The tone marks and dots were added as best guesses on some song lyrics. Corrections are very welcome as issues on the <a href="https://github.com/ratherlegit/yoruba-project/issues" target="_blank" rel="noopener noreferrer">GitHub project</a>.
        </p>
      </section>
    </main>
  );
}
