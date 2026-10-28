# Maths Test Prep — Year 8 (Vanshika)

A focused test-prep web app for a Year 8 maths class test covering
**Unit 1 — Fractions, Percentages, Ratio & Proportion** and **Unit 2 — Expressions, Substitution, Sequences**,
built from the school's own objectives grids and class worksheets (see `docs/syllabus.md`).

**Live:** https://vanshika-maths-test.vercel.app

## What's inside
- **Revision guide per topic** — one section per OneNote lesson: a puzzle first, the method and *why*
  it works, worked examples from the class notes (try first, then reveal), key points, exam tips and
  an auto-marked quick check.
- **Question bank** — for each of the 6 topics: **4 multiple-choice sets × 10** and **4 written sets × 6**
  (multi-part, show-your-method), from Foundations to Stretch & challenge, incl. the class's own
  questions and UKMT problems.
- **Marking that understands maths** — fractions, mixed numbers, ratios, money, percentages and
  algebra are checked by value *and* form (simplest form, mixed number, fully factorised, expanded),
  with targeted feedback on classic slips; a wrong MCQ choice explains the exact slip behind it.
- **Saves everything as she goes** — every answer, half-typed working, hint and the question she
  was on, plus the guide section she was reading. "Continue where you left off" on the home page.
- **Mistakes list**, practise-one-skill runs, flashcards, interactive labs, printable cram sheet,
  a study plan that ticks itself off, test-date countdown and a "send my scores" button.

Progress is stored on the device (localStorage) — no login needed.

## Content workflow
- `docs/syllabus.md` — transcription of the school's objectives and class questions.
- `docs/content-spec.md`, `docs/topic-notes.md` — authoring rules; `docs/audit-spec.md` — the fresh-eyes audit.
- `lib/content/<topic>/{guide,mcq,written}.ts` — typed content (type-checked at build).
- `npm run validate` — structure checks plus **machine checks of every answer key**: each question
  carries a `verify` expression rebuilt from the question's numbers/algebra, evaluated independently
  and compared with the key (and with every distractor).
- `node --no-warnings scripts/try-answer.ts fr-w1-q03 b "1 7/15"` — mark a sample typed answer.
- `npm test` — unit tests for the answer checker, explanation marker, progress merging and verify.

## Develop
```bash
npm install
npm run dev
```

## Deploy
`npm run deploy` (needs `VERCEL_TOKEN`) validates the content, deploys to production and checks key
pages on the live site. To let Claude Code run it without asking, the repo owner adds
`.claude/settings.json` with the allow rule `Bash(npm run deploy)`.
