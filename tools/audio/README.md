# Audio pipeline

Clips are pre-generated offline with ElevenLabs text-to-speech and shipped as static files. The app makes no model or network calls for speech. The old Meta MMS-TTS scripts are unused and kept in `legacy-mms/`.

Setup (once):

    python3 -m venv tools/audio/.venv
    tools/audio/.venv/bin/pip install -r tools/audio/requirements.txt
    cp tools/audio/.env.example tools/audio/.env

Then edit `tools/audio/.env` with your API key, voice id and model id. That file is git-ignored; never commit it.

Steps:

    # 1. Write tools/audio/strings.json from the lesson content
    npm run audio:list

    # 2. Dry run: no network, prints string count and total characters, flags strings over 200 characters
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --dry-run

    # 3. Audition a few clips into a scratch folder (manifest is not touched)
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --only "ọmọ" "ọkọ̀" --out-dir /tmp/yo-audition

    # 4. Full run (lists strings, then generates into public/audio and merges the manifest)
    npm run audio:generate

    # 5. Check that manifest and files match the lessons
    npm run validate && npx vitest run

Every full run REPLACES the existing clips when you pass `--force` (the default skips files that already exist, so an interrupted run resumes). The first real run must use `--force`, because the current files are old MMS clips:

    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --force

Other options: `--limit N`, `--sleep SECONDS` (default 0.3). Keys are NFC lowercase from `audioKey()` in `src/lib/audio.ts`. Text is sent as NFC so tone marks and dot-below letters survive.

## Free-plan workflow (ElevenLabs web tool, no API)

Use this when the API is not available on your plan. You paste prepared text into the ElevenLabs website, download the audio, and a script cuts it into one clip per word or phrase. About 15 minutes of work.

Before you start: open the ElevenLabs site and check your remaining credits. The grammar clips already exist. The vocab set still needs about 13,114 credits: words 2,029 and sentences 11,085 (per level, words/sentences: getting-started 361/1185, beginner 407/1498, intermediate 361/2253, advanced 429/2982, mastery 471/3167). One credit is one character pasted, counting the added period and the blank line after each item, and every generation counts against the allowance, retries included. Generate the words first (about 2,029), then the sentences level by level as credits allow; a missing clip just hides that Listen button. `prepare_paste.py` prints exact totals per part and per group. The test file is a small extra sample whose strings are also in the parts, so pasting it costs a few extra credits (skip it with `--no-test`). Keep a spare, and do the short test first.

1. `npm run audio:list`
2. `python tools/audio/prepare_paste.py` (use `tools/audio/.venv/bin/python` if plain `python` is missing). This writes `tools/audio/paste/` (test.txt, part-1.txt, part-2.txt, ..., order.json) and prints the character counts. By default it lists only strings that are still missing from `src/content/audio-manifest.json` (all groups), and `test.txt` then draws a 5-string sample from those pending ones (the same strings also stay in the parts, so their clips are saved). Options: `--group grammar|vocab-word|vocab-sentence` (repeatable) and `--no-test` (see the vocab section at the end). If nothing is missing it clears the paste folder and says so. Each item is its own paragraph: the text, a period (left off when the text already ends in . ! ? or similar), a blank line. That folder is git-ignored, so run this command again any time to regenerate it.
3. Open the ElevenLabs text-to-speech web tool. Choose the voice "Olufunmilola - Classy, Poised and Clear" and the model Multilingual v2. Paste all of `tools/audio/paste/test.txt`, generate, and listen. Check the voice sounds right and there is a clear, short pause between items. Download it as `test.mp3` into a work folder such as `tools/audio/workspace/split-work/<batch>/` (see Workspace below).
4. Split the test file: `python tools/audio/split_clips.py --parts-dir tools/audio/workspace/split-work/<batch>`. The test clips go to `tools/audio/paste/test-clips/` (never into the app). Listen to them.
5. If they sound good, repeat step 3 for each `part-N.txt` (same voice and model), saving as `part-1.mp3`, `part-2.mp3`, ... in the same folder.
6. Run the splitter on the folder again: `python tools/audio/split_clips.py --parts-dir tools/audio/workspace/split-work/<batch>`. This writes the final clips to `public/audio/` and merges `src/content/audio-manifest.json`. Add `--dry-run` to preview, or `--out-dir DIR` to write somewhere else without touching the manifest.
7. `npm run validate`, `npx vitest run`, then rebuild (`npm run build`).

How the splitting works: the script knows how many items each file holds (from order.json), finds every silence, and treats the longest ones (one fewer than the number of items) as the gaps between items. It prints a separation margin: the shortest chosen gap divided by the longest gap it did not choose. If the margin is below 1.5, the pauses between items are not clearly longer than pauses inside items; it prints a warning and the list of segments, and writes nothing for that file. Listen to the download, then either regenerate it, try `--noise -40dB` or `-30dB`, or pass `--accept-low-margin` to write the clips anyway (check them by ear). If there are too few pauses, it lists what it found and writes nothing. An optional `--min-gap SECONDS` switches to a fixed pause length instead. Offline self-test: `npm run audio:test`.

Note: `generate_elevenlabs.py` (and `npm run audio:generate`) is the paid API path. It reads all of `strings.json`, including vocab, and is not group-aware, so on the free plan do not use it.

### Vocab clips: words first, then sentences

`npm run audio:list` now writes a `group` for every string: `grammar`, `vocab-word` or `vocab-sentence`. `prepare_paste.py` only pastes strings that are not yet in `src/content/audio-manifest.json`, so after a partial batch just re-run it and it offers what is still missing. Use `--group` (repeatable) to choose what to generate, so the cheap, high-value words go first and sentences second, within the free-plan limit (10,000 credits per month, one credit per character):

    python tools/audio/prepare_paste.py --group vocab-word --no-test
    # generate, split (steps 3 to 7 above), then:
    python tools/audio/prepare_paste.py --group vocab-sentence --no-test

The printed output lists characters per part and per group (each item counts its text, any added period and a blank line), so you can check the total against your remaining credits before generating anything. `--no-test` skips `test.txt`; the test strings are only auditioned and never saved into the app, so use it once the voice is vetted. Re-run `npm run audio:list` first whenever vocab content changes.


## Workspace (not in git)

All the big audio working files live in `tools/audio/workspace/`, which is git-ignored (about 28 MB). Nothing in it is needed to run the app; the final clips are in `public/audio/`. Keep it as a record of what was generated and in case a clip needs re-splitting.

- `raw-downloads/`: the mp3 files exactly as downloaded from the ElevenLabs web tool, by kind (`grammar/`, `vocab-words/`, `sentences/`, which also holds `sounds-1.mp3`).
- `split-work/`: one folder per batch with the `part-N.mp3` files and the `order.json` that `split_clips.py --parts-dir` reads (`vocab-words`, `sentences-gs-beginner-a`, `sentences-gs-beginner-b`, `sentences-intermediate`, `sound-words`).
- `listening-checks/`: numbered copies of each batch's clips for listening before committing, one folder per batch.

New batch routine: save the web tool's download anywhere, copy it into `raw-downloads/`, then copy it as `part-N.mp3` with the matching `order.json` into a new `split-work/<batch>/` folder.
