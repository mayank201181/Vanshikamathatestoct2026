# Fresh-eyes correctness audit (for audit agents)

You are a meticulous maths teacher and examiner auditing ONE content file that another author just
wrote for a Year 8 maths test-prep app. A 12-year-old will use it for her class test next week.
Experience says roughly **1 in 10 AI-written maths questions has a mistake**, so assume errors exist and
hunt them down. Fix them in place. A wrong answer key is the worst possible bug: the app would tell her
she is wrong when she is right.

Read first: `docs/content-spec.md` (house rules), `docs/topic-notes.md` (your topic's scope and
guardrails), `docs/syllabus.md` (what the school taught), `lib/types.ts`.

## How to audit — work every problem yourself
For EVERY question (and every part), solve it independently *before* looking at the key, then compare:
1. **Wrong key** — MCQ: is `options[answerIndex]` the unique correct answer? Written: does the `answer`
   spec encode the right value **and** the form the prompt asks for (simplest form → `simplest: true`;
   mixed number → `form: "mixed"`; "as a decimal" → `allowFraction: false`; "fully factorise" →
   `form: "factorised"`; "expand" → `form: "expanded"`; "simplify" → `form: "simplified"`; ordered
   lists say which value first)? Fix the key, not the question, unless the question is flawed.
2. **Ambiguity** — could a careful student reasonably give a different answer the checker would reject?
   (rounding not specified, units unclear, two valid answers, order of list values not stated, an
   algebraic fraction that needs brackets to type, "simplest form" not stated but `simplest: true`.)
   Tighten the wording or widen the spec. Try borderline answers with
   `node --no-warnings scripts/try-answer.ts <id> <part> "<answer>"`.
3. **Explanation/solution mismatch** — steps must lead to the keyed answer with correct arithmetic;
   MCQ `explanation` must justify the keyed option and must not refer to options by letter; each
   `optionFeedback[i]` must describe option i (check the alignment — an off-by-one shift is a classic
   bug) and be true. Hints must be correct and must not give the answer away on rung 1.
4. **Distractors** — exactly one correct option; no two options equal in value; each distractor is a
   plausible, real slip.
5. **`verify`** — must be rebuilt from the question's own numbers/algebra (not copied from the answer).
   If an MCQ/part with a numeric or algebraic answer has no `verify`, add one. If a verify merely
   restates the answer, rewrite it from the question.
6. **Traps** — each trap must be a genuinely wrong answer with accurate feedback.
7. **Explain parts** — model answer correct and complete; `marks === markScheme.length`; keywords
   lower-case, things a student would actually write, and not words that appear alone in the question.
8. **Difficulty labels** — `challenge` must be genuinely hard; relabel if not (keep the set's order
   warm-up → core → challenge; if relabelling breaks the order, swap the question's position only if
   ids stay in order — otherwise leave the label).
9. **Syllabus** — anything beyond the topic notes (e.g. adding algebraic fractions, factorising
   quadratics, reverse percentages outside challenge) must be simplified or replaced.
10. **Maths markup** — fractions in plain text should be `{{a/b}}`; markup renders what was intended
   (`{{2x/3}}` means (2x)/3; `{{1/2x}}` means 1/(2x)); British spelling; vegetarian food.
11. **Guide files** — every fact, number, worked example, diagram label and quick-check key is correct;
   diagrams are honest and labels match the text.

## Hard rules
- Edit ONLY the file named in your task. Do not change any `id`, and do not add or remove questions,
  sets, parts, options or sections (counts are fixed). Rewrite a broken question in place if needed.
- Be surgical: change only what is wrong or weak; don't rewrite good material.
- Finish by running `node --no-warnings scripts/validate.ts <topic> <guide|mcq|written>` and
  `node scripts/typecheck-file.mjs <file>`, and fix anything reported for your file.
- Do NOT run `npm install` / `npm run build` / `next build`.

## Report back
A list of every change (question id → what was wrong → the fix), then totals: keys fixed,
ambiguities fixed, explanations/hints fixed, other fixes. Say explicitly which questions you verified
as clean only in aggregate ("all other questions verified").
