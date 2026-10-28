# Topic notes — scope, methods and accuracy guardrails (read the section for your topic)

General: Year 8, non-calculator unless stated. Use the class methods in `docs/syllabus.md`.
Answers in simplest form unless the question says otherwise. Every question must be answerable from
the syllabus — no Year 9+ content except clearly-labelled `challenge` stretch that still only uses
these methods.

## fr — Fractions (sections: fr-equivalent, fr-addsub, fr-muldiv, fr-problems, fr-algebraic)
- **fr-equivalent**: equivalent fractions, simplifying (divide by the HCF), ordering by rewriting with a
  common denominator (LCM), improper ↔ mixed numbers, comparing (e.g. which is bigger {{5/8}} or {{3/5}}).
- **fr-addsub**: + and − with different denominators and mixed numbers (two methods: convert to improper,
  or whole numbers and fractions separately — careful with borrowing, e.g. {{3 2/5 - 1 2/3}} = {{1 11/15}}).
- **fr-muldiv**: multiply (tops × tops, bottoms × bottoms; cancel first), fraction of an amount,
  divide = multiply by the reciprocal ("Keep, Change, Flip"); mixed numbers → improper first
  ({{2 1/4 ÷ 3 1/2 = 9/14}}, {{1 1/5 × 2 1/3 = 2 4/5}}). Whole number ÷ fraction ({{3 ÷ 2/5 = 7 1/2}}).
- **fr-problems**: "fraction of what's left" (monkeys and peanuts → {{1/5}}), smallest possible number
  (badminton club → 24 = LCM(12, 8)), order of operations ({{1/3 - (1/3 × 1/3) + (1/3 ÷ 1/3) = 1 2/9}}),
  fraction magic squares, shaded-region puzzles ({{4/7 + 3/5 - 1 = 6/35}}), "If a > b then {{1/a > 1/b}}?"
  (false for positive numbers), reverse ("{{3/5}} of a number is 24 — find the number" → 40).
- **fr-algebraic**: simplify by cancelling common factors of numbers and letters
  ({{3xy/xz = 3y/z}}, {{42xyz/56 = 3xyz/4}}, {{17cf/(34c^2) = f/(2c)}}); multiply (multiply tops and bottoms,
  then cancel: {{2a/3 × 9/(4a) = 3/2}}); divide (flip the second: {{x/4 ÷ x/8 = 2}},
  {{3x/y ÷ 6x^2/y^2 = y/(2x)}}). **Monomials only** — no adding algebraic fractions, no factorising
  brackets. Assume letters are non-zero. In written answers, the student types e.g. `3y/z` or
  `y/(2x)` — tell them to bracket a denominator with more than one factor.
- Mixed-number answers: say "Give your answer as a mixed number in its simplest form" and use
  `{ type: "fraction", n, d, form: "mixed", simplest: true }`.

## pc — Percentages (sections: pc-fdp, pc-of-amount, pc-change, pc-percent-change, pc-multipliers)
- **pc-fdp**: know {{1/2}} = 0.5 = 50%, {{1/4}}, {{3/4}}, {{1/5}}, {{1/10}}, {{1/8}} = 0.125 = 12.5%,
  {{1/3}} ≈ 33.3%, {{2/3}}; convert F → D → P; denominators that are factors of 100; ordering mixed lists
  (0.31, 36%, {{7/20}}, 0.309 → 0.309, 0.31, {{7/20}}, 36%). Recurring decimals: only {{1/3}}, {{2/3}}.
- **pc-of-amount**: 10%/5%/1% building blocks without a calculator; with a calculator × decimal;
  one number as a percentage of another = part ÷ whole × 100 (e.g. 18 out of 24 = 75%).
- **pc-change**: increase/decrease by r% (find r% then add/subtract, or use a multiplier); VAT 20%
  (UK, class worksheets) or GST 9% (Singapore); depreciation; pay rises; increases > 100%
  (increase 40 by 150% → 100).
- **pc-percent-change**: (change ÷ ORIGINAL) × 100; increases > 100% (5 kg → 50 kg is a 900% increase);
  decrease to zero = 100% decrease; profit/loss as a percentage of the original price.
- **pc-multipliers**: increase r% → × (1 + r/100); decrease r% → × (1 − r/100); successive changes
  multiply (discount 10% then VAT 20% → × 0.9 × 1.2 = × 1.08; +10% then −10% → × 0.99, not back to the
  start); percentage of a percentage (UKMT purple blazers: 20% of 80% = 16%). **Reverse percentages are
  NOT in the objectives** — only as a clearly-labelled `challenge` (e.g. time when speed +25% → × 0.8,
  i.e. a 20% decrease).
- Percentage answers: `{ type: "number", value: 25 }` (student may type 25 or 25%).

## ra — Ratio & Proportion (sections: ra-basics, ra-sharing, ra-proportion, ra-problems)
- **ra-basics**: simplify by dividing by the HCF; with units convert first (50 cm : 2 m = 1 : 4); with
  decimals/fractions scale to whole numbers (1.5 : 2 = 3 : 4; {{1/2}} : {{1/3}} = 3 : 2); link to
  fractions (a : b = 2 : 5 → a is {{2/7}} of the total, {{a/b = 2/5}}); 1 : n and n : 1 (4 : 10 = 1 : 2.5).
- **ra-sharing**: share a total in a ratio (bar model: total ÷ parts); given one share (Mo & Mae 3 : 5,
  Mae £45 → total £72); given the difference (child : adult = 7 : 13, 42 more adults → 49 children);
  three-part ratios.
- **ra-proportion**: part : part vs part : whole (fraction of the whole); comparing ratios ("which
  squash is stronger?" — compare as fractions of the whole or scale to a common part); combining ratios
  a : b and b : c by making the shared part equal (red : blue 2 : 3, blue : green 2 : 1 → 4 : 6 : 3);
  "x : y = 4 : 9 → y is 125% larger than x; x = {{4/9}}y".
- **ra-problems**: the class's Ratio Puzzles (Dean's Mountain, Printer Ink, Speed over a Bridge,
  Athletics Club, Leg It, How Many Swimmers, Ratio Swap, Fruit Basket), changing ratios (one quantity
  changes, the other doesn't), mixing paints, Lucy/Mary/Nancy, football fans, profit : cost = 7 : 4.
  Speed = distance ÷ time only as used in those puzzles.
- List answers for shares: `ordered: true` and the prompt names the order.

## ex — Expressions (sections: ex-simplify, ex-expand, ex-factorise, ex-double, ex-forming)
- **ex-simplify**: like terms have the same letters AND powers (3x² + 4x³ − 4x² = 4x³ − x²; x² and x
  are NOT like terms); simplifying products/quotients (2x × 3x = 6x²; 3a × 4b = 12ab; 12ab ÷ 4b = 3a);
  algebra notation (a × a = a², 5 × n = 5n).
- **ex-expand**: multiply every term inside by the term outside (grid method); negative outside:
  −3(2k − 4) = −6k + 12 (classic error: −6k − 12); sums and differences of brackets:
  5(2x + 3) + 6(3x − 4) = 28x − 9; x(2x + 1) − 3(2x − 4) = 2x² − 5x + 12; contexts: perimeter and area of
  rectangles/triangles (area of triangle = {{1/2}} × base × height).
- **ex-factorise**: take out the HCF of numbers AND letters, fully: 6x² + 9x = 3x(2x + 3) (not
  3(2x² + 3x) or x(6x + 9)); w² − 5w = w(w − 5); check by expanding; equivalence of expanded /
  factorised / unsimplified forms; identity ≡ (true for every value) vs equation (true for some values).
- **ex-double**: (x + a)(x + b) by the grid; (2x + 3)(3x − 4) = 6x² + x − 12; squares (2x − 3)² =
  4x² − 12x + 9 (classic error: 4x² + 9); area contexts (rectangle with sides x + 4 and x + 2;
  shaded/border areas). Factorising quadratics is NOT required (no x² + 5x + 6 = (x + 2)(x + 3)
  factorising questions except as a challenge "work backwards from the grid").
- **ex-forming**: write expressions for perimeters/areas, angles (angles in a triangle sum to 180°, on a
  straight line 180°), "think of a number", consecutive integers (n, n + 1, n + 2 sum to 3n + 3),
  ages, costs ("pens cost p pence…"); algebraic magic squares.
- Expression answers: `{ type: "expression", expr: "...", form: "expanded" | "factorised" | "simplified" }`.

## su — Substitution (sections: su-basics, su-negatives, su-formulae, su-powers)
- **su-basics**: substitute positive integers; BIDMAS; implied multiplication (3ab = 3 × a × b);
  2x² = 2 × x² (not (2x)²); (b + 2)/3 means divide the whole top by 3.
- **su-negatives**: negatives, decimals and fractions (class recap: a = 1.5, b = 4, c = 6, d = 0.5,
  e = −3: e³ = −27, 8e² + 3 = 75, (2c − e)/4 = 3.75); if x = −3 then x² = 9 but −x² = −9;
  5 − e = 5 − (−3) = 8.
- **su-formulae**: perimeter/area formulas, K = {{1/2}}mv² (m = 10, v = 2 → 20 J), v = u + at,
  s = ut + {{1/2}}at², P = 2(l + w), A = {{1/2}}bh, C = {{5(F - 32)/9}}, roots like {{sqrt(b^2 + 9)}};
  perimeters of shapes with algebraic sides for a given x.
- **su-powers**: squaring/cubing/rooting different numbers: negatives (square → positive, cube →
  negative, square root of a negative → not a real number in Year 8 terms: "you can't"), numbers
  between 0 and 1 get SMALLER when squared or cubed but BIGGER when square-rooted (0.25² = 0.0625,
  {{sqrt(0.25)}} = 0.5); 1 and 0 stay the same; "always / sometimes / never" reasoning.
  √ means the positive square root.

## sq — Sequences (sections: sq-terms, sq-nth, sq-generate, sq-quadratic)
- **sq-terms**: term-to-term rules; times-table sequences 2n, 3n, 4n; filling gaps with or without
  consecutive terms (4, 7, _, _, 16 → difference 3; 6, _, _, _, 18 → difference 3); descending sequences;
  pictorial sequences (matchsticks: 4, 7, 10 …).
- **sq-nth**: nth term an + b where a = common difference, b = zeroth term (first term − a):
  5, 8, 11, 14 → 3n + 2; decreasing sequences (20, 17, 14 → 23 − 3n); generate terms from an nth term;
  "Is 100 a term of 3n + 2?" (solve 3n + 2 = 100 → n = 32.67…, not whole → no); pictorial sequences;
  algebraic arithmetic sequences (p + r, p, p − r → (p + 2r) − rn) as challenge.
- **sq-generate**: generate sequences from linear and non-linear rules (n² + 3, 2n² − 1, n(n + 1),
  (n + 1)², n³, 2ⁿ as a contrast); recognise a quadratic sequence from constant second differences;
  which expressions give quadratic sequences (n² + 3, 3(n² − 4), n(2n − 3) yes; (n − 3)(n² − 1) no — cubic);
  1, 2, 4, 8, 16 is NOT quadratic (doubling).
- **sq-quadratic**: next term via differences; nth term: coefficient of n² = second difference ÷ 2;
  subtract an² from each term and find the rest (constant or linear). **Tests use two-term quadratics**
  (an² + b like n² + 2, 2n², n² − 5; an² + bn like n² + n, n² − 3n) — make most questions this kind;
  three-term (an² + bn + c like 3n² − 3n + 1, n² + 2n + 7) only as `challenge`. Pictorial quadratic
  sequences (centred hexagonal numbers 1, 7, 19, 37, 61 → 3n² − 3n + 1; squares-with-border patterns).
- nth-term answers: `{ type: "expression", expr: "3n+2" }` with `verify: "terms:5,8,11,14"`.
