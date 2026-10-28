# Content authoring spec (for content agents)

You are writing **one** content file for a maths test-prep web app for **Vanshika**, a strong
**Year 8 student (age 12–13)** at a British international school in **Singapore** (UK KS3 curriculum).
Her class test is **next week** and covers **Unit 1 (Fractions, Percentages, Ratio & Proportion)** and
**Unit 2 (Expressions, Substitution, Sequences)**. Her parents will hand her this app the night you
finish — the maths must be **correct**, the explanations **clear**, and the questions **genuinely useful
practice for that test**.

## Read these first (in this order)
1. `docs/syllabus.md` — the school's objectives grid (levels 5 → 1) and the actual questions/examples
   from her class notebook. **Stay inside this syllabus** and use the class's methods and notation.
2. `lib/types.ts` — the TypeScript contract (read the header comment on text format). Match it exactly.
3. `lib/sections.ts` — the fixed section ids for your topic (every question's `section`).
4. For written questions: `lib/answerCheck.ts` (how typed answers are marked).

## Pedagogy — Art of Problem Solving style (non-negotiable)
- **Problem first.** Guide sections open with a `discovery` puzzle; the `idea` reveals the insight.
- **Derive, don't decree.** Show *why* a method works (a picture, a pattern, a short derivation).
- **Productive struggle.** Hint ladders: rung 1 = a strategic nudge ("What does one part stand for?"),
  later rungs = bigger hints / the key step. Hints never just state the answer.
- **Multiple paths** where illuminating (bar model vs multiplier; grid vs FOIL). Say which is quicker.
- **Mistakes are data.** Every wrong MCQ option is a *specific* real slip, and its feedback names it.
- **Genuine challenge.** `challenge` = needs insight for a strong 13-year-old (UKMT Junior Maths
  Challenge flavour, the class's 1★/2★ ratio puzzles, "always/sometimes/never", spot-the-error,
  working backwards). Not just "more steps".
- **Name strategies** (`strategy`): Use a bar model · Find a common denominator · Use the multiplier ·
  Work backwards · Try small cases · Find a pattern · Draw a diagram · Introduce a variable ·
  Check by substituting · Look at the differences · Eliminate options · Estimate first ·
  Make the shared part equal · Spot the common factor · Use the grid method · Consider extremes.

## Voice and context
- Warm, direct, second person ("you"), short sentences, never babyish. **British spelling**
  (factorise, colour, metre, centre, maths).
- Money: the school's worksheets use **£**; Singapore **$** is also fine. Mix both.
- Names: diverse (Aisha, Wei Ling, Arjun, Priya, Marcus, Siti, Ethan, Mei, Ravi, Hana, Jun, Zara, Omar…).
- **Food is vegetarian** (no meat/fish/eggs-as-meat dishes; paneer, dal, pizza, cakes, fruit are fine).
- Metric units; realistic numbers. Assume **non-calculator** unless the question says
  "You may use a calculator" — keep the arithmetic friendly in non-calculator questions.

## Text format (every rendered string)
Markdown-lite + maths markup (see the header of `lib/types.ts`):
- `**bold**`, `*italic*`, blank line = new paragraph (use `\n\n`), `- ` bullet lines, `1. ` numbered
  lines, `| a | b |` tables, lines starting with 4 spaces = a worked-calculation block.
- **Maths goes in `{{ … }}`**: `{{3/4}}` (stacked fraction), `{{2 1/3}}` (mixed number), `{{x^2}}`,
  `{{sqrt(49)}}`, `{{(2x+1)/3}}`, `{{3 * 4}}` (renders ×), `{{a <= b}}`. A run like `2x` is one term, so
  `{{2x/3}}` is (2x)/3 and `{{3xy/xz}}` is 3xy over xz. Use `{{ }}` for anything with a fraction, power
  or root. **Never write a fraction as a/b in plain text** — always `{{a/b}}`.
- Simple arithmetic can be plain unicode: `3 × 4 = 12`, `−5`, `÷`, `x²`. Use the real minus sign − in
  plain text (inside `{{ }}` a `-` renders as −).
- Ratios in plain text: `3 : 5` (spaces around the colon).
- TypeScript strings: double quotes; backtick template literal **only** for SVG. Allowed escapes: `\n`
  and `\"` only. Never LaTeX (`\frac` breaks). Never put a backtick or `${` inside a backtick string.

## Diagrams (optional, inline SVG)
A backtick string `<svg viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="…">…</svg>`;
white background, dark strokes (#1f2937 / #334155), soft fills (#c7d2fe #fde68a #bbf7d0 #fecaca #bae6fd),
font-size 12–14, font-family sans-serif, ≤ ~60 elements, viewBox ≤ ~480×320, everything inside the
viewBox, no text overlap. Bar models, fraction bars, area/grid models, rectangles with algebraic sides,
dot/matchstick patterns are great. Geometry must be honest; labels must match the text.

## Multiple-choice questions (MCQ) — house style
- Exactly **4 options**, exactly **one** correct. Options are **shuffled at display time**: never write
  "option A", "the first answer", "all/none of the above".
- Distractors = **real slips**: adding tops and bottoms, forgetting to flip, finding 20% instead of
  120%, dividing by the new value, part : whole vs part : part, −3(2k − 4) = −6k − 12, (2x − 3)² = 4x² + 9,
  2x² = (2x)², −3² vs (−3)², nth term = n + d, etc. No silly options. No two options equal in value
  (e.g. `{{1/2}}` and `0.5`).
- Keep options similar in length/format; the correct one must NOT usually be the longest. Vary
  `answerIndex` evenly over 0–3 across your set.
- `optionFeedback` (4 strings, option order): correct option → one sentence why it's right; each wrong
  option → name the exact slip that produces it and the fix ("{{6/8}} comes from adding the tops and the
  bottoms — find a common denominator instead."). Don't start with "Correct"/"Wrong" — the app adds that.
- `explanation`: 2–5 sentences that **teach** the method step by step (worked numbers), plus a memory
  trick or quick check when useful. Never refer to options by letter.
- `hints`: warmup 1, core 2, challenge 3 (ladder; never states the answer).
- **`verify` (required whenever the answer is a number or an expression):**
  - numeric: an ASCII arithmetic expression from the **question's own numbers** that evaluates to the
    keyed option's value, e.g. `"(4/5+2/3)"`, `"20000*0.8"`, `"(200-160)/160*100"`. Write mixed numbers as
    `(2+1/4)`; powers `^`; roots `sqrt(…)`; NO `%` sign (use `/100`). The keyed option must be a plain
    number such as `"{{1 7/15}}"`, `"£16 000"`, `"22%"`, `"0.7"`, `"40 minutes"` for this to work.
  - algebraic: the **question's expression**, e.g. `"5(2x+3)+6(3x-4)"`; the validator checks the keyed
    option is equivalent to it and no other option is. Options must then be plain algebra like
    `"28x − 9"` or `"{{6x^2+x-12}}"` (no words).
  - sequences: `"terms:5,8,11,14"` (the terms given in the question) — the validator checks the keyed
    nth-term option produces exactly those terms for n = 1, 2, 3… and no other option does.
  The validator also rejects an option that has the same value as the answer.
- Difficulty order inside a set: warm-up → core → challenge.

### MCQ example (shape only)
```ts
{
  id: "fr-m1-q03",
  topic: "fr",
  section: "fr-addsub",
  difficulty: "core",
  question: "Work out {{4/5 + 2/3}}.",
  options: ["{{6/8}}", "{{1 7/15}}", "{{6/15}}", "{{1 2/15}}"],
  answerIndex: 1,
  optionFeedback: [
    "{{6/8}} comes from adding the numerators and adding the denominators — you can only add fractions once the denominators match.",
    "{{4/5 = 12/15}} and {{2/3 = 10/15}}, so the total is {{22/15 = 1 7/15}}.",
    "You found the common denominator 15 but then just added 4 + 2 on top — each numerator has to be scaled up too.",
    "Close: {{22/15}} is 1 whole and {{7/15}} left over, not {{2/15}}. Check the subtraction 22 − 15.",
  ],
  explanation: "Make the denominators the same first. The lowest common multiple of 5 and 3 is 15, so {{4/5 = 12/15}} and {{2/3 = 10/15}}. Now add the numerators: {{12/15 + 10/15 = 22/15}}. As a mixed number that's {{1 7/15}} (15 goes into 22 once, remainder 7).",
  hints: ["Can you add fifths and thirds directly, or do they need to be the same size pieces?", "Rewrite both fractions with denominator 15."],
  strategy: "Find a common denominator",
  verify: "4/5+2/3",
  source: "Class worksheet",
},
```

## Written (question-and-answer) questions — house style
These are the maths "show your method" questions. Each has **1–4 `parts`**; each part is either
**auto-marked** (`answer` spec) or an **explanation** (`markScheme` + `model`, self-marked).
- Total marks per question 2–6. Aim for ~75% auto-marked parts; about 1 question in 4 has an
  explain / "show that" / "is it true?" part.
- `question` = the shared stem. Multi-part → every part has `label` ("a", "b", …) and its own `prompt`.
  Single part → omit `label`, `prompt` optional.
- **Say the required form in the question/prompt** and set the spec to match. The checker is strict
  about value and form, forgiving about spacing/units/currency:
  - `number` — `{ type: "number", value: 72 }`. Units/currency are ignored, so put them in the
    question ("Give your answer in £."). Percentages: value is the number (25 for 25%). "As a decimal"
    → `allowFraction: false`. Rounded answers: `value` is the rounded value ("to 2 significant figures").
    `display` e.g. `"£72"` controls how the answer is shown.
  - `fraction` — `{ type: "fraction", n: 22, d: 15, form: "mixed", simplest: true }` when the question
    says "as a mixed number in its simplest form". Don't use `form: "mixed"` if the answer is < 1.
  - `list` — several numbers: shares, "the next two terms", "the first five terms". `ordered: true`
    when order matters — then the prompt must say the order ("Give the amounts in the order Lucy,
    Mary, Nancy.").
  - `ratio` — `{ type: "ratio", parts: [4, 6, 3], simplest: true }`. For "in the form 1 : n" use
    `parts: [1, 2.5], unitForm: "1:n"`.
  - `expression` — plain ASCII algebra: `"28x-9"`, `"3x(2x+3)"`, `"6x^2+x-12"`, `"3n+2"`,
    `"y/(2z)"`. `form: "expanded"` for expand/multiply out, `"factorised"` for factorise (checks *fully*),
    `"simplified"` for simplify/collect like terms. nth-term answers are expressions in `n`
    (students may type "Un = 3n + 2" or "3n+2"). **Algebraic fraction answers:** a typed `y/2x` is read
    as {{y/2}}·x (the input shows "We read this as…"), so tell the student to use brackets:
    "Type the bottom in brackets, e.g. 3/(4x)."
  - `text` — only for single words / yes–no (`{ type: "text", accept: ["no", "no it is not"] }`) — pair a
    yes/no part with an explain part for the reason.
- **`verify` (required on every auto-marked part except `text`)**: an independent expression from the
  question's numbers/algebra: `"4*20*1.15"`; `"4/5+2/3"`; `"5(2x+3)+6(3x-4)"`;
  `"terms:1,7,19,37,61"` (nth term must generate these); lists `"210*2, 20*1.5"`; ratios `"4:6:3"`.
  The validator checks it against your spec and fails on a mismatch. Do not just copy the answer —
  rebuild it from the question.
- `traps` (1–2 per auto part where a classic slip exists): `{ spec: <the wrong answer>, feedback: "…" }`,
  e.g. `{ spec: { type: "number", value: 48 }, feedback: "48 is 20% of 240 — but you need the new price, 240 + 48." }`.
  A trap must be genuinely wrong (the validator checks it isn't accepted as correct).
- Explain parts: `markScheme` = 1–4 points; `marks === markScheme.length`; each point has 3–8
  lower-case `keywords` (words/numbers a 12-year-old would actually write; "+" = all parts must appear,
  e.g. `"40+160"`), and `feedback` that teaches the missing point. `model` = a full-marks answer that
  uses the keywords. Never use a keyword that appears on its own in the question text (copying the
  question must not earn marks) — combine with "+" instead.
- `solution`: the full worked method, one step per string, with the numbers (this is what she reads
  after marking — make it teach). `altMethod` when a second method is illuminating.
- `commonError`: the specific mistake students make on this question.
- `hints`: 2–3 (ladder). `difficulty`, `section`, `strategy`, optional `source`.

### Written example (shape only)
```ts
{
  id: "pc-w2-q04",
  topic: "pc",
  section: "pc-multipliers",
  difficulty: "core",
  question: "Sam is buying a car advertised at £8000. He negotiates a discount of 10%. The dealer then adds 20% VAT to the discounted price.",
  parts: [
    { label: "a", prompt: "Write down the single decimal multiplier for a 10% decrease.", marks: 1,
      answer: { type: "number", value: 0.9, allowFraction: false }, verify: "1-10/100" },
    { label: "b", prompt: "Work out the final price. Give your answer in £.", marks: 2,
      answer: { type: "number", value: 8640, display: "£8640" }, verify: "8000*0.9*1.2",
      traps: [{ spec: { type: "number", value: 8800 }, feedback: "£8800 comes from doing +20% − 10% = +10% in one go. Percentages of different amounts can't be added — apply × 0.9 then × 1.2." }] },
    { label: "c", prompt: "Explain why the final price is not the same as a 10% increase on £8000.", marks: 2,
      markScheme: [
        { point: "The 20% is worked out on the smaller, discounted price (£7200)", keywords: ["7200", "discounted price", "smaller amount", "after the discount"], feedback: "The VAT is 20% of £7200, not 20% of £8000 — the two percentages are of different amounts." },
        { point: "Uses multipliers: 0.9 × 1.2 = 1.08, an 8% increase", keywords: ["1.08", "8 percent", "8%", "0.9+1.2"], feedback: "Combine the multipliers: 0.9 × 1.2 = 1.08, which is an 8% increase, not 10%." },
      ],
      model: "The 20% VAT is added to the discounted price of £7200, not to £8000, so it is a percentage of a smaller amount. As multipliers, 0.9 × 1.2 = 1.08, which is an 8% increase overall, not 10%." },
  ],
  hints: ["Do the discount first: what is 90% of £8000?", "Now increase that amount by 20% (× 1.2)."],
  solution: [
    "A 10% decrease leaves 90%, so the multiplier is 0.9.",
    "Discounted price: £8000 × 0.9 = £7200.",
    "Add 20% VAT: £7200 × 1.2 = £8640.",
    "Check with one multiplier: 0.9 × 1.2 = 1.08, and £8000 × 1.08 = £8640 ✓",
  ],
  altMethod: { label: "Build it from 10%", steps: ["10% of £8000 = £800, so the discounted price is £7200.", "10% of £7200 = £720, so 20% = £1440.", "£7200 + £1440 = £8640."] },
  commonError: "Adding the percentages (−10% + 20% = +10%) and answering £8800.",
  strategy: "Use the multiplier",
  source: "Class worksheet",
},
```

## Sets (MCQ and written files)
- MCQ file: export exactly 4 sets, ids `<t>-mcq-1` … `<t>-mcq-4`, **10 questions each**, question ids
  `<t>-m<set>-q01` … `q10` (zero-padded, in order).
- Written file: exactly 4 sets, ids `<t>-written-1` … `<t>-written-4`, **6 questions each**, ids
  `<t>-w<set>-q01` … `q06`.
- Set themes and difficulty spread (warmup/core/challenge):
  | Set | Title | MCQ (of 10) | Written (of 6) |
  |---|---|---|---|
  | 1 | "Set 1 · Foundations" | 4 / 5 / 1 | 2 / 3 / 1 |
  | 2 | "Set 2 · Core skills" | 2 / 6 / 2 | 1 / 4 / 1 |
  | 3 | "Set 3 · Exam practice" | 1 / 6 / 3 | 1 / 3 / 2 |
  | 4 | "Set 4 · Stretch & challenge" | 0 / 5 / 5 | 0 / 3 / 3 |
  `subtitle`: one line saying what the set covers.
- **Every set covers every section of your topic** (roughly evenly). No near-duplicate questions across
  the 4 sets; vary skill types: fluency, reasoning (explain/always-sometimes-never/spot the error),
  problem solving in context, multi-step, reading a diagram/table.
- **Class material:** about **a third** of questions should be taken from — or closely modelled on —
  the class worksheets/examples in `docs/syllabus.md` for your topic (set `source: "Class worksheet"`,
  `"Class example"`, `"Ratio Puzzles 1★"`, or the UKMT reference like `"UKMT JMC 2009"`). Teachers reuse
  these in tests, so she must be able to do them. Use the rest for fresh questions that test the same
  objectives in new ways (different numbers, reversed questions, contexts).

## Guide file — house style (one `TopicGuide`)
`sections` in exactly the order of your topic's ids in `lib/sections.ts`. Each `GuideSection`:
- `lesson`: the matching OneNote page name from the syllabus (e.g. "Calculations with Fractions").
- `heading`: friendly, specific.
- `discovery`: a curiosity puzzle *before* the explanation + the reveal (`idea`).
- `body`: **250–450 words** that genuinely teach the method: what it is, *why* it works, the steps, the
  vocabulary, and how the class writes it. Short paragraphs, bold keywords, bullets, a small table or a
  4-space calculation block where helpful.
- `diagram` (strongly encouraged): an SVG bar model / fraction bar / area grid / dot pattern that makes
  the idea visible, with `diagramCaption`.
- `workedExamples`: **2–3**, building up (one straight from the class notes where possible), each with
  `problem`, step-by-step `steps`, and `answer`.
- `keyPoints` 3–5 · `whyItWorks` 1–3 sentences · `memoryTrick` when a good one exists · `examTip` (the
  mark-losing mistake) · `thinkDeeper` (a reasoning question).
- `quickChecks`: 1–2 auto-marked "your turn" questions (`answer` spec as for written parts) with a short
  `solution`.
Also: `flashcards` 10–16 (front = a prompt/term/question, back = the fact/method/answer) and `cram`
6–10 one-line must-know facts/methods for the printable cram sheet.

## Hard rules
- Write **exactly one file** — the path and export name in your task. Touch nothing else.
- Start with `import type { … } from "../../types";` and export exactly the named const.
- Do **not** run `npm install`, `npm run build` or `next build`.
- When done, run and fix everything reported for YOUR file (ignore other topics/files):
  - `node --no-warnings scripts/validate.ts <topic> <guide|mcq|written>`
  - `node scripts/typecheck-file.mjs lib/content/<topic>/<file>.ts`
  - For written parts, try realistic student answers:
    `node --no-warnings scripts/try-answer.ts <qid> <part label> "<answer>"` — a correct answer typed
    the way a 12-year-old would (e.g. "1 7/15", "£8640", "Un = 3n+2") must be marked correct; the
    classic wrong answer must not.
- Treat validator **errors** as must-fix; fix **warnings** about your file too unless clearly
  inapplicable (e.g. a deliberate plain "24/7").
