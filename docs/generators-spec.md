# Fresh-number generators — authoring spec

Why: mock tests used to draw from a fixed bank, so after enough practice the same questions came back
with exactly the same numbers. A **generator** is a template for one skill that picks new numbers each
time and builds the whole question from them. Mocks and the "mock from my mistakes" use generators so
the numbers are never repeated.

Read first: `lib/gen/core.ts` (the contract + helpers), `lib/gen/fr.ts` (the reference generator
`fr-add` — copy its shape), `lib/gen/index.ts` (how a draft becomes an MCQ or written question, and
`draftProblems`, the checks every roll must pass), `lib/types.ts` (AnswerSpec + text format),
`docs/syllabus.md` (stay inside the school's objectives for your topic), `docs/content-spec.md` (house
style), and a few hand-written questions in `lib/content/<topic>/mcq*.ts` and `written.ts` to match
their voice and their misconception feedback.

## Rules

1. **Write only your file**: `lib/gen/<topic>.ts`, exporting `GEN_<TOPIC>: Generator[]`. Touch nothing else.
2. **Deterministic**: use only the `r` passed to `make(r)` for randomness — never `Math.random` or dates.
3. **Correct by construction**: compute every number (answer, each wrong answer, every number in the
   explanation) from the chosen parameters. Never hard-code a result. `verify` must be built from the
   question's own numbers (e.g. `"160*1.2"`, `"4/5+2/3"`, `"3n+2"` with `terms:` for sequences — see
   `lib/verify.ts`), so it is checked independently of your answer.
4. **Nice numbers**: choose parameters so answers come out the way a Year 8 class test would have them
   (whole numbers, simple fractions, money to the penny, terminating decimals) unless the skill itself is
   about decimals. Reject and re-pick awkward combinations inside `make` (loops are fine).
5. **Wrong answers = real misconceptions**: give 4–5 candidate `wrong` entries when you can (at least 3
   must survive: different text and a different value from the answer and from each other — the
   checker drops duplicates). `display` is exactly what the slip produces (use `frRaw` for fractions —
   unreduced). `feedback` names the slip **with these numbers** and says how to fix it, in kind,
   12-year-old-friendly words, like the bank. Add `spec` (the same wrong answer as an AnswerSpec) so the
   written version can give the same feedback when she types it.
6. **Never put an "equal value, wrong form" answer in `wrong`** (e.g. 6/8 when the answer is 3/4, or
   2(6x+9) for 12x+18). Form is policed by the answer spec instead: `fracSpec(..., { simplest: true })`,
   `{ type: "ratio", simplest: true }`, `exprSpec(expr, "factorised")` give "Almost" (marks − 1) for an
   equivalent answer in the wrong form.
7. **Text format** (see `lib/types.ts`): maths inside `{{ }}` in plain ASCII — `{{3/4}}`, `{{2 1/3}}`,
   `{{x^2}}`, `{{3*4}}` (renders ×), `{{-2}}` (renders −). Outside `{{ }}` use real symbols (×, ÷, −).
   Use `m("...")` to wrap, `fr(n, d)` for a reduced fraction, `frRaw` for a slip's raw result, `num`, `money`,
   `poly`/`term` for algebra. **Bold** with `**`. British spelling.
8. **Fields**: `question` is the multiple-choice stem and also the written stem; `prompt` (written only)
   adds the instruction, e.g. "Give your answer in its simplest form." `explanation` teaches the method
   step by step with the actual numbers (2–4 sentences, include a quick check where natural).
   `solution` is the same as numbered steps. `hints`: 2 (ladder, never the answer). `commonError`:
   one sentence. `marks`: 1 for a one-step warm-up, 2 for most, 3 for multi-step challenge.
9. **difficulty**: vary it with the parameters (`warmup` for one-step/simple numbers, `core`,
   `challenge` for multi-step or larger/negative/mixed numbers). Mocks mostly use core and challenge.
10. **sig**: a short canonical string of the numbers that define the question (e.g. `"3/4+2/5"`,
   `"20%of350"`). Normalise symmetric cases (a + b = b + a) so the same question always has the same
   sig. Different context words with the same numbers count as the same question.
11. **kinds**: `["mcq", "qa"]` unless the skill only makes sense as one of them.

## Check every generator

    GEN_ONLY=<id> GEN_SEEDS=2000 node --no-warnings --test tests/generators.test.mts
    node --no-warnings scripts/gen-sample.ts <id> 6

The test must pass (aim for < 5% first-roll failures). Then **read every line of the samples** as a
strict maths teacher: is the answer right, is every wrong option's feedback true for those numbers, is
the wording natural, are there odd numbers (0, 1, negative denominators, "1x", "+-")? Fix and repeat.
Finally run the whole suite once: `GEN_SEEDS=600 node --no-warnings --test tests/generators.test.mts`
(other agents' files may be mid-edit — only your generators must pass).
