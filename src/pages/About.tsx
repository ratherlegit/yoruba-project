export function About() {
  return (
    <main className="page" style={{ display: "grid", gap: "1rem" }}>
      <h1 style={{ marginBottom: 0 }}>About this guide</h1>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Reading tone marks</h2>
        <p>Yoruba is tonal: the pitch of a syllable changes the word. Three tones are written.</p>
        <ul>
          <li>High tone is an acute accent, as in ká.</li>
          <li>Low tone is a grave accent, as in rọ̀.</li>
          <li>Mid tone has no mark, as in ma.</li>
        </ul>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Reading a word breakdown</h2>
        <p>Each tile is one component with its meaning. The steps show how the parts join and then change in speech. Each change names the rule behind it.</p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Content review</h2>
        <p>Lessons are drafted carefully and checked against published sources, but tone marks are easy to get wrong. Items still waiting on review by a Yoruba speaker are tracked in the project's review list.</p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Vocab</h2>
        <p>The Vocab section groups common words by topic, at the same five levels as the grammar lessons. All vocabulary and example sentences are still waiting on a native speaker to confirm, the same review status as the grammar lessons. Audio clips are being added in batches, so most Listen buttons will be missing at first.</p>
      </section>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Audio</h2>
        {/* Owner: check ElevenLabs's current terms for your plan (for example attribution requirements) and adjust this sentence. */}
        <p>Audio pronunciation clips were generated with ElevenLabs text-to-speech.</p>
      </section>
    </main>
  );
}
