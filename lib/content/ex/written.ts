import type { QA, QuestionSet } from "../../types";

// Written (show-your-method) questions for Unit 2 · Expressions.
// Sections: ex-simplify, ex-expand, ex-factorise, ex-double, ex-forming.
// Every algebraic key is machine-checked against `verify` (the question's own expression).
// "Expand and simplify" parts use form "simplified" (no brackets AND like terms collected);
// plain "expand" parts use form "expanded"; "factorise" parts use form "factorised" (fully).

const GRID_X4_X3 = `<svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rectangle split by a grid into four smaller rectangles. Along the top the widths are x and 4. Down the left side the heights are x and 3. Each small rectangle has a question mark in it.">
<rect x="0" y="0" width="340" height="240" fill="#ffffff"/>
<rect x="70" y="40" width="160" height="120" fill="#c7d2fe" stroke="#1f2937" stroke-width="2"/>
<rect x="230" y="40" width="70" height="120" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<rect x="70" y="160" width="160" height="55" fill="#bbf7d0" stroke="#1f2937" stroke-width="2"/>
<rect x="230" y="160" width="70" height="55" fill="#fecaca" stroke="#1f2937" stroke-width="2"/>
<g font-family="sans-serif" font-size="14" fill="#1f2937" text-anchor="middle">
<text x="150" y="30" font-style="italic">x</text>
<text x="265" y="30">4</text>
<text x="52" y="105" font-style="italic">x</text>
<text x="52" y="193">3</text>
<text x="150" y="105">?</text>
<text x="265" y="105">?</text>
<text x="150" y="193">?</text>
<text x="265" y="193">?</text>
</g>
</svg>`;

const RECT_3X2_BY_4 = `<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rectangle. The long side is labelled (3x + 2) cm and the short side is labelled 4 cm.">
<rect x="0" y="0" width="360" height="190" fill="#ffffff"/>
<rect x="90" y="50" width="230" height="100" fill="#bae6fd" stroke="#1f2937" stroke-width="2"/>
<g font-family="sans-serif" font-size="14" fill="#1f2937">
<text x="205" y="38" text-anchor="middle">(3x + 2) cm</text>
<text x="80" y="105" text-anchor="end">4 cm</text>
</g>
</svg>`;

const TWO_RECTANGLES = `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rectangle A is 4 cm wide with area 12x − 8 and an unknown length. Rectangle B is x cm wide with area x squared + 7x and an unknown length.">
<rect x="0" y="0" width="460" height="190" fill="#ffffff"/>
<rect x="45" y="70" width="165" height="60" fill="#bbf7d0" stroke="#1f2937" stroke-width="2"/>
<rect x="270" y="45" width="165" height="110" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<g font-family="sans-serif" font-size="14" fill="#1f2937">
<text x="127" y="60" text-anchor="middle">length = ?</text>
<text x="38" y="105" text-anchor="end">4 cm</text>
<text x="127" y="96" text-anchor="middle" font-weight="bold">A</text>
<text x="127" y="117" text-anchor="middle">Area 12x − 8</text>
<text x="352" y="35" text-anchor="middle">length = ?</text>
<text x="262" y="105" text-anchor="end">x cm</text>
<text x="352" y="94" text-anchor="middle" font-weight="bold">B</text>
<text x="352" y="117" text-anchor="middle">Area x² + 7x</text>
</g>
</svg>`;

const TRIANGLE_ANGLES = `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A triangle with angles labelled (2x + 10) degrees at the bottom left, (3x − 5) degrees at the bottom right and (x + 25) degrees at the top.">
<rect x="0" y="0" width="360" height="300" fill="#ffffff"/>
<polygon points="60,280 300,280 207,25" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<g fill="none" stroke="#334155" stroke-width="1.5">
<path d="M88,280 A28,28 0 0 0 74,255.7"/>
<path d="M272,280 A28,28 0 0 1 290.4,253.7"/>
<path d="M192,51 A30,30 0 0 0 217.3,53.2"/>
</g>
<g font-family="sans-serif" font-size="13" fill="#1f2937">
<text x="95" y="266">(2x + 10)°</text>
<text x="265" y="266" text-anchor="end">(3x − 5)°</text>
<text x="200" y="105" text-anchor="middle">(x + 25)°</text>
</g>
</svg>`;

const PYRAMID = `<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An algebra pyramid. The bottom row has bricks 2x + 1, 3x − 4 and x + 6. The middle row has bricks (a) and (b). The top brick is (c).">
<rect x="0" y="0" width="420" height="200" fill="#ffffff"/>
<g stroke="#1f2937" stroke-width="2">
<rect x="30" y="140" width="120" height="44" fill="#bae6fd"/>
<rect x="150" y="140" width="120" height="44" fill="#bae6fd"/>
<rect x="270" y="140" width="120" height="44" fill="#bae6fd"/>
<rect x="90" y="96" width="120" height="44" fill="#fde68a"/>
<rect x="210" y="96" width="120" height="44" fill="#fde68a"/>
<rect x="150" y="52" width="120" height="44" fill="#bbf7d0"/>
</g>
<g font-family="sans-serif" font-size="14" fill="#1f2937" text-anchor="middle">
<text x="90" y="167">2x + 1</text>
<text x="210" y="167">3x − 4</text>
<text x="330" y="167">x + 6</text>
<text x="150" y="123">(a)</text>
<text x="270" y="123">(b)</text>
<text x="210" y="79">(c)</text>
</g>
</svg>`;

const TRIANGLE_BASE_HEIGHT = `<svg viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A triangle with its base labelled 4x cm and a dashed perpendicular height labelled (3x + 6) cm.">
<rect x="0" y="0" width="380" height="260" fill="#ffffff"/>
<polygon points="40,220 340,220 190,40" fill="#c7d2fe" stroke="#1f2937" stroke-width="2"/>
<line x1="190" y1="40" x2="190" y2="220" stroke="#1f2937" stroke-width="1.5" stroke-dasharray="6 4"/>
<polyline points="190,208 202,208 202,220" fill="none" stroke="#1f2937" stroke-width="1.5"/>
<g font-family="sans-serif" font-size="13" fill="#1f2937">
<text x="190" y="242" text-anchor="middle">4x cm</text>
<text x="198" y="170">(3x + 6) cm</text>
</g>
</svg>`;

const CARD_AND_TILE = `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A square of card with sides (2x + 1) cm. A smaller square tile with sides (2x − 3) cm is cut from its bottom-left corner.">
<rect x="0" y="0" width="360" height="240" fill="#ffffff"/>
<rect x="60" y="20" width="198" height="198" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<rect x="60" y="92" width="126" height="126" fill="#c7d2fe" stroke="#1f2937" stroke-width="2"/>
<g font-family="sans-serif" font-size="13" fill="#1f2937">
<text x="266" y="124">(2x + 1) cm</text>
<text x="123" y="84" text-anchor="middle">(2x − 3) cm</text>
<text x="123" y="160" text-anchor="middle">tile</text>
<text x="222" y="56" text-anchor="middle">card</text>
</g>
</svg>`;

const L_SHAPE = `<svg viewBox="0 0 440 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An L-shape. The bottom edge is (2x + 5) cm and the left edge is (x + 6) cm. A rectangle x cm wide and 2 cm tall has been cut from the top-right corner, shown dashed. The top edge is labelled P and the right-hand edge is labelled Q.">
<rect x="0" y="0" width="440" height="290" fill="#ffffff"/>
<rect x="278" y="30" width="88" height="44" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 4"/>
<path d="M80,250 L366,250 L366,74 L278,74 L278,30 L80,30 Z" fill="#bbf7d0" stroke="#1f2937" stroke-width="2"/>
<g font-family="sans-serif" font-size="13" fill="#1f2937">
<text x="223" y="272" text-anchor="middle">(2x + 5) cm</text>
<text x="72" y="144" text-anchor="end">(x + 6) cm</text>
<text x="179" y="22" text-anchor="middle" font-weight="bold">P</text>
<text x="376" y="166" font-weight="bold">Q</text>
<text x="322" y="66" text-anchor="middle">x</text>
<text x="286" y="57">2</text>
</g>
</svg>`;

export const WRITTEN_EX: QuestionSet<QA>[] = [
  // -------------------------------------------------------------------------
  // Set 1 · Foundations — 2 warm-up / 3 core / 1 challenge
  // -------------------------------------------------------------------------
  {
    id: "ex-written-1",
    title: "Written 1 · Foundations",
    subtitle: "Collecting like terms, single brackets, factorising, the area grid and rectangle perimeters.",
    topic: "ex",
    questions: [
      {
        id: "ex-w1-q01",
        topic: "ex",
        section: "ex-simplify",
        difficulty: "warmup",
        question: "Simplify each expression by collecting like terms.",
        parts: [
          {
            label: "a",
            prompt: "{{5a + 3b - 2a + b}}",
            marks: 1,
            answer: { type: "expression", expr: "3a+4b", form: "simplified" },
            verify: "5a+3b-2a+b",
            traps: [
              { spec: { type: "expression", expr: "7a+4b" }, feedback: "The minus sign belongs to the 2a, so the a terms are 5a − 2a = 3a, not 5a + 2a." },
              { spec: { type: "expression", expr: "3a+3b" }, feedback: "A b on its own means 1b, so the b terms are 3b + b = 4b." },
            ],
          },
          {
            label: "b",
            prompt: "{{3x^2 + 4x^3 - 4x^2}}",
            marks: 1,
            answer: { type: "expression", expr: "4x^3-x^2", form: "simplified" },
            verify: "3x^2+4x^3-4x^2",
            traps: [
              { spec: { type: "expression", expr: "3x^3" }, feedback: "{{x^3}} and {{x^2}} are not like terms, so they can't be combined. Only the {{x^2}} terms collect: {{3x^2 - 4x^2 = -x^2}}. The {{4x^3}} stays as it is." },
              { spec: { type: "expression", expr: "3x^2" }, feedback: "{{4x^3}} is not an {{x^2}} term — the powers must match for terms to be alike. Only {{3x^2 - 4x^2 = -x^2}} combines." },
            ],
          },
          {
            label: "c",
            prompt: "{{4y + 7 - y - 10}}",
            marks: 1,
            answer: { type: "expression", expr: "3y-3", form: "simplified" },
            verify: "4y+7-y-10",
            traps: [
              { spec: { type: "expression", expr: "5y-3" }, feedback: "The minus belongs to the y: 4y − y = 3y (take one y away, don't add it)." },
              { spec: { type: "expression", expr: "3y+3" }, feedback: "Check the numbers: 7 − 10 = −3, not +3." },
            ],
          },
        ],
        hints: [
          "Like terms have exactly the same letters with the same powers. Which terms in each expression belong together?",
          "Ring each group of like terms together with the sign in front of it — in (b) that's {{3x^2}} and {{-4x^2}}. Then combine each group.",
        ],
        solution: [
          "(a) a terms: 5a − 2a = 3a. b terms: 3b + b = 3b + 1b = 4b. Answer: **3a + 4b**.",
          "(b) Only the {{x^2}} terms are alike: {{3x^2 - 4x^2 = -x^2}}. The {{4x^3}} has no partner, so the answer is {{4x^3 - x^2}} (or {{-x^2 + 4x^3}}).",
          "(c) y terms: 4y − y = 3y. Numbers: 7 − 10 = −3. Answer: **3y − 3**.",
          "Check (b) by substituting x = 2: {{3 * 4 + 4 * 8 - 4 * 4 = 28}} and {{4 * 8 - 4 = 28}} ✓",
        ],
        commonError: "Treating {{x^2}} and {{x^3}} as like terms, or losing the sign in front of a term (5a − 2a is 3a, not 7a).",
        strategy: "Check by substituting",
      },
      {
        id: "ex-w1-q02",
        topic: "ex",
        section: "ex-expand",
        difficulty: "warmup",
        question: "Expand (multiply out) the brackets.",
        parts: [
          {
            label: "a",
            prompt: "{{3(p - 4)}}",
            marks: 1,
            answer: { type: "expression", expr: "3p-12", form: "expanded" },
            verify: "3(p-4)",
            traps: [{ spec: { type: "expression", expr: "3p-4" }, feedback: "Multiply **every** term inside the bracket by 3: 3 × p = 3p and 3 × (−4) = −12." }],
          },
          {
            label: "b",
            prompt: "{{2(3a + b - 3c)}}",
            marks: 1,
            answer: { type: "expression", expr: "6a+2b-6c", form: "expanded" },
            verify: "2(3a+b-3c)",
            traps: [{ spec: { type: "expression", expr: "6a+b-3c" }, feedback: "The 2 multiplies all three terms: 2 × b = 2b and 2 × (−3c) = −6c." }],
          },
          {
            label: "c",
            prompt: "{{4b(1 + 2b)}}",
            marks: 1,
            answer: { type: "expression", expr: "4b+8b^2", form: "expanded" },
            verify: "4b(1+2b)",
            traps: [
              { spec: { type: "expression", expr: "4b+8b" }, feedback: "b × b = {{b^2}}, so 4b × 2b = {{8b^2}}, not 8b." },
              { spec: { type: "expression", expr: "4b+2b" }, feedback: "Multiply both terms by 4b — including the 2b: 4b × 2b = {{8b^2}}." },
            ],
          },
        ],
        hints: [
          "Multiply the term outside by **each** term inside the bracket. A grid helps: the outside term on the side, the inside terms along the top.",
          "In (c), 4b × 1 = 4b, and 4b × 2b means (4 × 2) and (b × b).",
        ],
        solution: [
          "Grid method: the term outside goes on the side, the terms inside go along the top, and you multiply each pair.",
          "(a) 3 × p = 3p and 3 × (−4) = −12, so {{3(p - 4) = 3p - 12}}.",
          "(b) 2 × 3a = 6a, 2 × b = 2b and 2 × (−3c) = −6c, so {{2(3a + b - 3c) = 6a + 2b - 6c}}.",
          "(c) The grid for 4b(1 + 2b):\n\n| × | 1 | +2b |\n|---|---|---|\n| 4b | 4b | {{+8b^2}} |\n\nSo {{4b(1 + 2b) = 4b + 8b^2}}.",
        ],
        commonError: "Multiplying only the first term in the bracket, e.g. writing 3(p − 4) = 3p − 4.",
        strategy: "Use the grid method",
        source: "Class worksheet — Expanding, Task 1",
      },
      {
        id: "ex-w1-q03",
        topic: "ex",
        section: "ex-factorise",
        difficulty: "core",
        question: "Factorise each expression fully. Check each answer by expanding it again.",
        parts: [
          {
            label: "a",
            prompt: "{{22a + 55}}",
            marks: 1,
            answer: { type: "expression", expr: "11(2a+5)", form: "factorised" },
            verify: "22a+55",
            traps: [{ spec: { type: "expression", expr: "11(2a+55)" }, feedback: "Divide **every** term by 11: 55 ÷ 11 = 5. (Expanding 11(2a + 55) would give 22a + 605.)" }],
          },
          {
            label: "b",
            prompt: "{{25y - 35z}}",
            marks: 1,
            answer: { type: "expression", expr: "5(5y-7z)", form: "factorised" },
            verify: "25y-35z",
            traps: [{ spec: { type: "expression", expr: "5(5y-35z)" }, feedback: "Divide every term by 5: 35z ÷ 5 = 7z. Expand to check: 5 × 7z = 35z ✓" }],
          },
          {
            label: "c",
            prompt: "{{w^2 - 5w}}",
            marks: 1,
            answer: { type: "expression", expr: "w(w-5)", form: "factorised" },
            verify: "w^2-5w",
            traps: [{ spec: { type: "expression", expr: "w(w-5w)" }, feedback: "Expand to check: w × 5w = {{5w^2}}, not 5w. When you take w out of −5w, only −5 is left." }],
          },
          {
            label: "d",
            prompt: "{{6x^2 + 9x}}",
            marks: 2,
            answer: { type: "expression", expr: "3x(2x+3)", form: "factorised" },
            verify: "6x^2+9x",
            traps: [{ spec: { type: "expression", expr: "3x(2x+9)" }, feedback: "9x ÷ 3x = 3, so the bracket is (2x + 3). Expand to check: 3x × 3 = 9x ✓" }],
          },
        ],
        hints: [
          "Find the highest common factor (HCF) of the numbers **and** of the letters. That goes outside the bracket.",
          "In (d), the HCF of 6 and 9 is 3, and both terms contain x. What is left of each term when you divide it by 3x?",
        ],
        solution: [
          "(a) The HCF of 22 and 55 is 11. 22a ÷ 11 = 2a and 55 ÷ 11 = 5, so {{22a + 55 = 11(2a + 5)}}.",
          "(b) The HCF of 25 and 35 is 5, so {{25y - 35z = 5(5y - 7z)}}. Nothing else divides both 5 and 7, so it's fully factorised.",
          "(c) Both terms contain w: {{w^2 ÷ w = w}} and 5w ÷ w = 5, so {{w^2 - 5w = w(w - 5)}}.",
          "(d) The HCF of 6 and 9 is 3, and both terms contain x, so take out 3x: {{6x^2 ÷ 3x = 2x}} and 9x ÷ 3x = 3. So {{6x^2 + 9x = 3x(2x + 3)}}.",
          "Check (d) by expanding: {{3x * 2x = 6x^2}} and {{3x * 3 = 9x}} ✓",
        ],
        commonError: "Not factorising fully — writing 3(2x² + 3x) or x(6x + 9) for 6x² + 9x. If the bracket still has a common factor, you haven't finished.",
        strategy: "Spot the common factor",
        source: "Class worksheet — Factorising",
      },
      {
        id: "ex-w1-q04",
        topic: "ex",
        section: "ex-double",
        difficulty: "core",
        question: "The diagram shows a rectangle measuring (x + 4) by (x + 3), split into four smaller rectangles.",
        diagram: GRID_X4_X3,
        parts: [
          {
            label: "a",
            prompt: "Find the area of each small rectangle. Then write the area of the whole rectangle as a simplified expression with no brackets.",
            marks: 2,
            answer: { type: "expression", expr: "x^2+7x+12", form: "simplified" },
            verify: "(x+4)(x+3)",
            traps: [
              { spec: { type: "expression", expr: "x^2+12" }, feedback: "You've missed the two middle rectangles: x × 4 = 4x and 3 × x = 3x. Together they add 7x." },
              { spec: { type: "expression", expr: "x^2+7x+7" }, feedback: "The bottom-right rectangle is 4 by 3, so its area is 4 × 3 = 12, not 4 + 3." },
            ],
          },
          {
            label: "b",
            prompt: "Use the same grid method to expand and simplify {{(x + 4)^2}}.",
            marks: 2,
            answer: { type: "expression", expr: "x^2+8x+16", form: "simplified" },
            verify: "(x+4)^2",
            traps: [
              { spec: { type: "expression", expr: "x^2+16" }, feedback: "{{(x + 4)^2}} means (x + 4)(x + 4). Its grid has four parts — {{x^2}}, 4x, 4x and 16 — so don't lose the two 4x's." },
              { spec: { type: "expression", expr: "x^2+4x+16" }, feedback: "There are **two** 4x rectangles in the grid, so the middle term is 4x + 4x = 8x." },
            ],
          },
        ],
        hints: [
          "The area of each small rectangle is its width × its height. Start with the top-left one: x × x.",
          "Top-left is {{x^2}} and top-right is 4 × x = 4x. Find the other two, add all four, then collect the x terms. For (b), draw the grid for (x + 4)(x + 4).",
        ],
        solution: [
          "Grid method for (x + 4)(x + 3):\n\n| × | x | +4 |\n|---|---|---|\n| x | {{x^2}} | +4x |\n| +3 | +3x | +12 |",
          "Add the four areas: {{x^2 + 4x + 3x + 12}}. Collect the like terms (4x + 3x = 7x), so the area is {{x^2 + 7x + 12}}.",
          "(b) {{(x + 4)^2}} means (x + 4)(x + 4):\n\n| × | x | +4 |\n|---|---|---|\n| x | {{x^2}} | +4x |\n| +4 | +4x | +16 |",
          "So {{(x + 4)^2 = x^2 + 4x + 4x + 16 = x^2 + 8x + 16}}.",
          "Check (b) with x = 1: {{(1 + 4)^2 = 25}} and 1 + 8 + 16 = 25 ✓",
        ],
        commonError: "Writing {{(x + 4)^2 = x^2 + 16}} — squaring each term separately. A squared bracket always has a middle term: here 4x + 4x = 8x.",
        strategy: "Use the grid method",
      },
      {
        id: "ex-w1-q05",
        topic: "ex",
        section: "ex-forming",
        difficulty: "core",
        question: "A rectangle is (3x + 2) cm long and 4 cm wide.",
        diagram: RECT_3X2_BY_4,
        parts: [
          {
            label: "a",
            prompt: "Write an expression for the perimeter of the rectangle. Simplify it fully, with no brackets.",
            marks: 2,
            answer: { type: "expression", expr: "6x+12", form: "simplified" },
            verify: "2(3x+2)+2*4",
            traps: [
              { spec: { type: "expression", expr: "3x+6" }, feedback: "That's only one length and one width. A rectangle has **four** sides: two lengths and two widths." },
              { spec: { type: "expression", expr: "12x+8" }, feedback: "That's the area (length × width). The perimeter is the distance all the way round — add the four sides." },
            ],
          },
          {
            label: "b",
            prompt: "Write an expression for the area of the rectangle. Expand the bracket.",
            marks: 1,
            answer: { type: "expression", expr: "12x+8", form: "expanded" },
            verify: "4(3x+2)",
            traps: [
              { spec: { type: "expression", expr: "12x+2" }, feedback: "Multiply **both** terms by 4: 4 × 3x = 12x and 4 × 2 = 8." },
              { spec: { type: "expression", expr: "6x+12" }, feedback: "That's the perimeter. Area = length × width = 4(3x + 2)." },
            ],
          },
          {
            label: "c",
            prompt: "Work out the area of the rectangle when x = 5. Give your answer in cm².",
            marks: 1,
            answer: { type: "number", value: 68, display: "68 cm²" },
            verify: "4*(3*5+2)",
            traps: [
              { spec: { type: "number", value: 62 }, feedback: "62 comes from 12 × 5 + 2 — the 2 must be multiplied by 4 too. When x = 5 the length is 17 cm, so the area is 4 × 17 = 68 cm²." },
              { spec: { type: "number", value: 42 }, feedback: "42 cm is the perimeter when x = 5. For the area, multiply length × width: 17 × 4." },
            ],
          },
        ],
        hints: [
          "Label all four sides: two of them are (3x + 2) cm and two are 4 cm.",
          "Perimeter: add all four sides. Area: length × width = 4 × (3x + 2) — multiply both terms by 4.",
        ],
        solution: [
          "Perimeter = (3x + 2) + 4 + (3x + 2) + 4 = 2(3x + 2) + 2 × 4.",
          "= 6x + 4 + 8 = **6x + 12** cm.",
          "Area = length × width = 4(3x + 2) = **12x + 8** cm².",
          "(c) When x = 5 the length is 3 × 5 + 2 = 17 cm, so the area is 4 × 17 = **68 cm²**. Check with (b): 12 × 5 + 8 = 68 ✓",
        ],
        commonError: "Mixing up perimeter (add all four sides) and area (length × width), or adding just two sides for the perimeter.",
        strategy: "Draw a diagram",
      },
      {
        id: "ex-w1-q06",
        topic: "ex",
        section: "ex-expand",
        difficulty: "challenge",
        question: "Expand and simplify. Watch the signs: the second bracket is being **subtracted**.",
        parts: [
          {
            label: "a",
            prompt: "{{4(x + 1) - 2(2x - 3)}}",
            marks: 2,
            answer: { type: "expression", expr: "10", form: "simplified" },
            verify: "4(x+1)-2(2x-3)",
            traps: [
              { spec: { type: "expression", expr: "-2" }, feedback: "−2 × (−3) = **+6**, not −6: a negative times a negative is positive. So it's 4x + 4 − 4x + 6." },
              { spec: { type: "expression", expr: "8x-2" }, feedback: "You've added 2(2x − 3) instead of subtracting it. Multiply the bracket by **−2**: −2 × 2x = −4x and −2 × (−3) = +6." },
            ],
          },
          {
            label: "b",
            prompt: "{{3(x - 2) - 4(x - 2)}}",
            marks: 2,
            answer: { type: "expression", expr: "2-x", form: "simplified" },
            verify: "3(x-2)-4(x-2)",
            traps: [
              { spec: { type: "expression", expr: "-x-14" }, feedback: "−4 × (−2) = **+8**, so it's 3x − 6 − 4x + 8." },
              { spec: { type: "expression", expr: "7x-14" }, feedback: "The second bracket is subtracted, so multiply it by −4, not +4: −4 × x = −4x and −4 × (−2) = +8." },
            ],
          },
          {
            label: "c",
            prompt: "Priya says: \"In part (a) the x's disappear, so 4(x + 1) − 2(2x − 3) gives the same answer whatever number x is.\" Test her claim by substituting x = 0 and then x = 5 into the **original** expression. Is she right?",
            marks: 2,
            markScheme: [
              {
                point: "Substitutes correctly: x = 0 gives 4 + 6 = 10 and x = 5 gives 24 − 14 = 10",
                keywords: ["4+6", "24+14", "24 14"],
                feedback: "Put each value into the original expression: x = 0 gives 4 × 1 − 2 × (−3) = 4 + 6 = 10, and x = 5 gives 4 × 6 − 2 × 7 = 24 − 14 = 10.",
              },
              {
                point: "Concludes that she is right: the x terms cancel (4x − 4x = 0), so it always equals 10 — an identity",
                keywords: ["yes", "she is right", "is right", "correct", "always 10", "cancel", "identity", "every value", "all values", "any value", "4x+4x"],
                feedback: "Finish with a conclusion: yes, she's right — 4x − 4x = 0, so the expression is 10 for every value of x. It's an identity: 4(x + 1) − 2(2x − 3) ≡ 10.",
              },
            ],
            model: "x = 0: 4(0 + 1) − 2(0 − 3) = 4 + 6 = 10. x = 5: 4(5 + 1) − 2(10 − 3) = 24 − 14 = 10. Yes, she is right: when you expand, 4x − 4x = 0, so the x terms cancel and the expression is always 10. It is an identity: {{4(x + 1) - 2(2x - 3) ≡ 10}}.",
          },
        ],
        hints: [
          "Expand each bracket separately first. The second bracket is multiplied by **−2** in (a) and by **−4** in (b) — keep the minus with the number.",
          "Negative × negative = positive: −2 × (−3) = +6 and −4 × (−2) = +8. Then collect the x terms and the number terms.",
          "For (c), x = 0 gives 4 × (0 + 1) − 2 × (0 − 3). Work that out, then try x = 5.",
        ],
        solution: [
          "(a) {{4(x + 1) = 4x + 4}} and {{-2(2x - 3) = -4x + 6}}.",
          "So {{4(x + 1) - 2(2x - 3) = 4x + 4 - 4x + 6 = 10}}. The x terms cancel: 4x − 4x = 0.",
          "(b) {{3(x - 2) = 3x - 6}} and {{-4(x - 2) = -4x + 8}}.",
          "So {{3(x - 2) - 4(x - 2) = 3x - 6 - 4x + 8 = -x + 2}}, which is **2 − x**.",
          "(c) x = 0: 4 × 1 − 2 × (−3) = 4 + 6 = 10. x = 5: 4 × 6 − 2 × 7 = 24 − 14 = 10. Priya is right — it is **always** 10, so {{4(x + 1) - 2(2x - 3) ≡ 10}} is an identity.",
        ],
        altMethod: {
          label: "Count the brackets in (b)",
          steps: [
            "Both brackets are (x − 2), so treat (x − 2) as one object.",
            "3 lots of it minus 4 lots of it leaves −1 lot of it: −(x − 2).",
            "−(x − 2) = −x + 2 = 2 − x ✓",
          ],
        },
        commonError: "Writing −2(2x − 3) = −4x − 6, forgetting that a negative times a negative gives a positive.",
        strategy: "Check by substituting",
        source: "Class worksheet — Expanding, Task 2",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Set 2 · Core skills — 1 warm-up / 4 core / 1 challenge
  // -------------------------------------------------------------------------
  {
    id: "ex-written-2",
    title: "Written 2 · Core skills",
    subtitle: "Simplifying products, negatives outside brackets, area models, (2x + 3)(3x − 4), triangle angles and the six-card puzzle.",
    topic: "ex",
    questions: [
      {
        id: "ex-w2-q01",
        topic: "ex",
        section: "ex-simplify",
        difficulty: "warmup",
        question: "Simplify each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{3a * 4b}}",
            marks: 1,
            answer: { type: "expression", expr: "12ab", form: "simplified" },
            verify: "3a*4b",
            traps: [{ spec: { type: "expression", expr: "7ab" }, feedback: "When terms are multiplied, multiply the numbers: 3 × 4 = 12. (7 comes from adding them.)" }],
          },
          {
            label: "b",
            prompt: "{{12ab ÷ 4b}}",
            marks: 1,
            answer: { type: "expression", expr: "3a", form: "simplified" },
            verify: "12ab/(4b)",
            traps: [{ spec: { type: "expression", expr: "3ab" }, feedback: "The b's cancel as well: b ÷ b = 1. So 12ab ÷ 4b = 3a." }],
          },
          {
            label: "c",
            prompt: "{{5p * 2p * p}}",
            marks: 1,
            answer: { type: "expression", expr: "10p^3", form: "simplified" },
            verify: "5p*2p*p",
            traps: [
              { spec: { type: "expression", expr: "10p^2" }, feedback: "There are **three** p's multiplied together (p on its own is 1p), so p × p × p = {{p^3}}." },
              { spec: { type: "expression", expr: "8p^3" }, feedback: "Multiply the numbers, don't add them: 5 × 2 × 1 = 10." },
            ],
          },
        ],
        hints: [
          "Deal with the numbers first, then the letters. A letter on its own, like p, means 1p.",
          "a × b is written ab, and a letter multiplied by itself makes a power: p × p = {{p^2}}. When you divide, a letter divided by itself cancels: b ÷ b = 1.",
        ],
        solution: [
          "(a) Numbers: 3 × 4 = 12. Letters: a × b = ab. So {{3a * 4b = 12ab}}.",
          "(b) Write it as a fraction and cancel: in {{12ab/4b}} the numbers give 12 ÷ 4 = 3 and the b's cancel, leaving **3a**.",
          "(c) Numbers: 5 × 2 × 1 = 10. Letters: {{p * p * p = p^3}}. So {{5p * 2p * p = 10p^3}}.",
          "Quick check of (a) with a = 2 and b = 1: 3 × 2 × 4 × 1 = 24 and 12 × 2 × 1 = 24 ✓",
        ],
        commonError: "Adding the numbers when the terms are multiplied (3a × 4b = 7ab), or forgetting that p means 1p, so p × p × p = p³.",
        strategy: "Check by substituting",
      },
      {
        id: "ex-w2-q02",
        topic: "ex",
        section: "ex-expand",
        difficulty: "core",
        question: "Expand and simplify. Take care with the negative numbers.",
        parts: [
          {
            label: "a",
            prompt: "{{-4(4f - 5)}}",
            marks: 1,
            answer: { type: "expression", expr: "20-16f", form: "expanded" },
            verify: "-4(4f-5)",
            traps: [
              { spec: { type: "expression", expr: "-16f-20" }, feedback: "−4 × (−5) = **+20**: a negative times a negative is positive." },
              { spec: { type: "expression", expr: "-16f-5" }, feedback: "Multiply **both** terms by −4: −4 × (−5) = +20." },
            ],
          },
          {
            label: "b",
            prompt: "{{5(a - 3) + 2(4 - a)}}",
            marks: 2,
            answer: { type: "expression", expr: "3a-7", form: "simplified" },
            verify: "5(a-3)+2(4-a)",
            traps: [
              { spec: { type: "expression", expr: "7a-7" }, feedback: "2 × (−a) = −2a, so the a terms are 5a − 2a = 3a." },
              { spec: { type: "expression", expr: "3a+5" }, feedback: "Multiply both terms of 5(a − 3) by 5: 5 × (−3) = −15. Then the numbers are −15 + 8 = −7." },
            ],
          },
          {
            label: "c",
            prompt: "{{8k - 3(2k - 4) + 7}}",
            marks: 2,
            answer: { type: "expression", expr: "2k+19", form: "simplified" },
            verify: "8k-3(2k-4)+7",
            traps: [
              { spec: { type: "expression", expr: "2k-5" }, feedback: "−3 × (−4) = **+12**, so it's 8k − 6k + 12 + 7." },
              { spec: { type: "expression", expr: "14k+19" }, feedback: "−3 × 2k = −6k, so the k terms are 8k − 6k = 2k." },
            ],
          },
        ],
        hints: [
          "Expand each bracket on its own first. Keep the sign in front of a bracket with its number: −3(2k − 4) means multiply by −3.",
          "Negative × negative = positive: −4 × (−5) = +20 and −3 × (−4) = +12. Then collect the letter terms and the number terms separately.",
        ],
        solution: [
          "(a) −4 × 4f = −16f and −4 × (−5) = +20, so {{-4(4f - 5) = -16f + 20}}, which is the same as **20 − 16f**.",
          "(b) {{5(a - 3) = 5a - 15}} and {{2(4 - a) = 8 - 2a}}.",
          "Collect: 5a − 2a = 3a and −15 + 8 = −7, so the answer is **3a − 7**.",
          "(c) {{-3(2k - 4) = -6k + 12}}, so {{8k - 3(2k - 4) + 7 = 8k - 6k + 12 + 7}}.",
          "Collect: 8k − 6k = 2k and 12 + 7 = 19, so the answer is **2k + 19**.",
          "Check (c) with k = 1: 8 − 3 × (−2) + 7 = 8 + 6 + 7 = 21, and 2 + 19 = 21 ✓",
        ],
        commonError: "Getting the sign wrong when a negative multiplies a negative: −3(2k − 4) is −6k **+** 12, not −6k − 12.",
        strategy: "Use the grid method",
        source: "Class worksheet — Expanding Brackets (examples and Task 2)",
      },
      {
        id: "ex-w2-q03",
        topic: "ex",
        section: "ex-factorise",
        difficulty: "core",
        question: "Factorising is expanding in reverse. Each rectangle below shows its area and its width.",
        diagram: TWO_RECTANGLES,
        parts: [
          {
            label: "a",
            prompt: "Rectangle A has area {{(12x - 8)}} cm² and width 4 cm. Write an expression for its length.",
            marks: 1,
            answer: { type: "expression", expr: "3x-2", form: "simplified" },
            verify: "(12x-8)/4",
            traps: [
              { spec: { type: "expression", expr: "3x-8" }, feedback: "Divide **both** terms by 4: 12x ÷ 4 = 3x and 8 ÷ 4 = 2. Check: 4(3x − 2) = 12x − 8 ✓" },
              { spec: { type: "expression", expr: "48x-32" }, feedback: "Length = area ÷ width, so divide by 4 — don't multiply." },
            ],
          },
          {
            label: "b",
            prompt: "Rectangle B has area {{(x^2 + 7x)}} cm² and width x cm. Write an expression for its length.",
            marks: 1,
            answer: { type: "expression", expr: "x+7", form: "simplified" },
            verify: "(x^2+7x)/x",
            traps: [
              { spec: { type: "expression", expr: "x+7x" }, feedback: "7x ÷ x = 7 (the x's cancel), so the length is x + 7. Check: x(x + 7) = {{x^2 + 7x}} ✓" },
              { spec: { type: "expression", expr: "x^3+7x^2" }, feedback: "Length = area ÷ width, so divide each term by x — don't multiply." },
            ],
          },
          {
            label: "c",
            prompt: "Factorise fully {{3x^2 - 12x}}.",
            marks: 2,
            answer: { type: "expression", expr: "3x(x-4)", form: "factorised" },
            verify: "3x^2-12x",
            traps: [{ spec: { type: "expression", expr: "3x(x-12)" }, feedback: "Divide **every** term by 3x: 12x ÷ 3x = 4. Expand to check: 3x × 4 = 12x ✓" }],
          },
        ],
        hints: [
          "Area = length × width, so length = area ÷ width. Divide **each** term of the area by the width.",
          "For (c), find the biggest thing that divides both {{3x^2}} and 12x: look at the numbers (3 and 12) and the letters (both have an x).",
        ],
        solution: [
          "(a) Length = (12x − 8) ÷ 4. 12x ÷ 4 = 3x and 8 ÷ 4 = 2, so the length is **3x − 2** cm. In factorised form: {{12x - 8 = 4(3x - 2)}}.",
          "(b) Length = {{(x^2 + 7x) ÷ x}}. {{x^2 ÷ x = x}} and 7x ÷ x = 7, so the length is **x + 7** cm. In factorised form: {{x^2 + 7x = x(x + 7)}}.",
          "(c) The HCF of 3 and 12 is 3, and both terms contain x, so take out 3x: {{3x^2 ÷ 3x = x}} and 12x ÷ 3x = 4. So {{3x^2 - 12x = 3x(x - 4)}}.",
          "Check (c) with the grid: 3x × x = {{3x^2}} and 3x × (−4) = −12x ✓",
        ],
        commonError: "Taking out only part of the common factor, e.g. 3(x² − 4x) or x(3x − 12). Both are equivalent but **not fully** factorised — the HCF is 3x.",
        strategy: "Spot the common factor",
      },
      {
        id: "ex-w2-q04",
        topic: "ex",
        section: "ex-double",
        difficulty: "core",
        question: "Expand and simplify. Use the grid method and keep each sign with its term.",
        parts: [
          {
            label: "a",
            prompt: "{{(x + 5)(x - 2)}}",
            marks: 2,
            answer: { type: "expression", expr: "x^2+3x-10", form: "simplified" },
            verify: "(x+5)(x-2)",
            traps: [
              { spec: { type: "expression", expr: "x^2-10" }, feedback: "You've missed the middle terms. The grid gives four terms: {{x^2}}, +5x, −2x and −10." },
              { spec: { type: "expression", expr: "x^2+3x+10" }, feedback: "+5 × (−2) = −10, not +10." },
            ],
          },
          {
            label: "b",
            prompt: "{{(2x + 3)(3x - 4)}}",
            marks: 2,
            answer: { type: "expression", expr: "6x^2+x-12", form: "simplified" },
            verify: "(2x+3)(3x-4)",
            traps: [
              { spec: { type: "expression", expr: "6x^2-12" }, feedback: "Don't forget the middle terms: 2x × (−4) = −8x and 3 × 3x = +9x, which together make +x." },
              { spec: { type: "expression", expr: "6x^2-x-12" }, feedback: "Check the middle terms: −8x + 9x = **+x**." },
            ],
          },
        ],
        hints: [
          "Draw a 2 × 2 grid: one bracket along the top, the other down the side. The −2 and the −4 go in with their minus signs.",
          "Fill in all four boxes, then collect the two x terms. In (b), 2x × 3x = {{6x^2}} and 3 × (−4) = −12.",
        ],
        solution: [
          "(a) Grid for (x + 5)(x − 2):\n\n| × | x | +5 |\n|---|---|---|\n| x | {{x^2}} | +5x |\n| −2 | −2x | −10 |",
          "So {{(x + 5)(x - 2) = x^2 + 5x - 2x - 10 = x^2 + 3x - 10}}.",
          "(b) Grid for (2x + 3)(3x − 4):\n\n| × | 2x | +3 |\n|---|---|---|\n| 3x | {{6x^2}} | +9x |\n| −4 | −8x | −12 |",
          "So {{(2x + 3)(3x - 4) = 6x^2 + 9x - 8x - 12 = 6x^2 + x - 12}}.",
          "Check (b) with x = 1: (2 + 3)(3 − 4) = 5 × (−1) = −5, and 6 + 1 − 12 = −5 ✓",
        ],
        altMethod: {
          label: "FOIL (First, Outer, Inner, Last)",
          steps: [
            "First: 2x × 3x = {{6x^2}}. Outer: 2x × (−4) = −8x.",
            "Inner: 3 × 3x = +9x. Last: 3 × (−4) = −12.",
            "Total: {{6x^2 - 8x + 9x - 12 = 6x^2 + x - 12}}. FOIL is quicker once you're confident; the grid makes it harder to miss a term.",
          ],
        },
        commonError: "Losing the middle terms — writing (2x + 3)(3x − 4) = 6x² − 12 — or a sign slip when collecting −8x + 9x.",
        strategy: "Use the grid method",
        source: "Class objectives — Expanding Double Brackets",
      },
      {
        id: "ex-w2-q05",
        topic: "ex",
        section: "ex-forming",
        difficulty: "core",
        question: "The angles of a triangle are (2x + 10)°, (3x − 5)° and (x + 25)°.",
        diagram: TRIANGLE_ANGLES,
        parts: [
          {
            label: "a",
            prompt: "Write an expression for the sum of the three angles. Simplify your answer.",
            marks: 1,
            answer: { type: "expression", expr: "6x+30", form: "simplified" },
            verify: "(2x+10)+(3x-5)+(x+25)",
            traps: [
              { spec: { type: "expression", expr: "6x+40" }, feedback: "Careful with the −5: the numbers are 10 − 5 + 25 = 30." },
              { spec: { type: "expression", expr: "5x+30" }, feedback: "x on its own means 1x, so the x terms are 2x + 3x + x = 6x." },
            ],
          },
          {
            label: "b",
            prompt: "The angles in a triangle add up to 180°. Use this to find the value of x.",
            marks: 2,
            answer: { type: "number", value: 25, display: "x = 25" },
            verify: "(180-30)/6",
            traps: [
              { spec: { type: "number", value: 35 }, feedback: "6x + 30 = 180, so subtract 30 (don't add it): 6x = 150." },
              { spec: { type: "number", value: 30 }, feedback: "Don't forget the + 30: 6x + 30 = 180 gives 6x = 150, so x = 150 ÷ 6." },
            ],
          },
          {
            label: "c",
            prompt: "Work out the size of the largest angle.",
            marks: 1,
            answer: { type: "number", value: 70, display: "70°" },
            verify: "3*((180-30)/6)-5",
            traps: [
              { spec: { type: "number", value: 75 }, feedback: "Don't forget the − 5: 3x − 5 = 75 − 5 = 70." },
              { spec: { type: "number", value: 60 }, feedback: "60° is the angle 2x + 10. Work out all three angles — 60°, 70° and 50° — then pick the largest." },
            ],
          },
        ],
        hints: [
          "Add the three expressions: collect the x terms and the number terms separately.",
          "Set your simplified sum equal to 180, then undo it step by step: take away 30, then divide by 6.",
        ],
        solution: [
          "(a) x terms: 2x + 3x + x = 6x. Numbers: 10 − 5 + 25 = 30. Sum = **6x + 30**.",
          "(b) The angles add up to 180°, so 6x + 30 = 180.",
          "Subtract 30 from both sides: 6x = 150. Divide by 6: **x = 25**.",
          "(c) The angles are 2 × 25 + 10 = 60°, 3 × 25 − 5 = 70° and 25 + 25 = 50°. Check: 60 + 70 + 50 = 180 ✓. The largest angle is **70°**.",
        ],
        commonError: "Counting x as 0x instead of 1x when collecting terms, or adding the 30 instead of subtracting it when finding x.",
        strategy: "Check by substituting",
      },
      {
        id: "ex-w2-q06",
        topic: "ex",
        section: "ex-expand",
        difficulty: "challenge",
        question: "Here are six expression cards from the class puzzle:\n\n- **Card 1:** {{2(9b - 13a)}}\n- **Card 2:** {{3(2b - 11a)}}\n- **Card 3:** {{4(3a - 5b)}}\n- **Card 4:** {{5(2a - 3b)}}\n- **Card 5:** {{6(3a - b)}}\n- **Card 6:** {{7(3a + 2b)}}",
        parts: [
          {
            label: "a",
            prompt: "Expand and simplify Card 4 + Card 5.",
            marks: 2,
            answer: { type: "expression", expr: "28a-21b", form: "simplified" },
            verify: "5(2a-3b)+6(3a-b)",
            traps: [
              { spec: { type: "expression", expr: "28a-9b" }, feedback: "6 × (−b) = −6b, so the b terms are −15b − 6b = −21b (both are negative)." },
              { spec: { type: "expression", expr: "28a-16b" }, feedback: "Multiply both terms of Card 5 by 6: 6 × (−b) = −6b, not −b." },
            ],
          },
          {
            label: "b",
            prompt: "Factorise your answer to part (a) fully.",
            marks: 1,
            answer: { type: "expression", expr: "7(4a-3b)", form: "factorised" },
            verify: "5(2a-3b)+6(3a-b)",
            traps: [{ spec: { type: "expression", expr: "7(4a-21b)" }, feedback: "Divide **every** term by 7: 21b ÷ 7 = 3b." }],
          },
          {
            label: "c",
            prompt: "Show that Card 2 + Card 3 + Card 6 = 0.",
            marks: 2,
            markScheme: [
              {
                point: "Expands all three cards correctly: 6b − 33a, 12a − 20b and 21a + 14b",
                keywords: ["6b+33a", "12a+20b", "21a+14b"],
                feedback: "Start by expanding each card: 3(2b − 11a) = 6b − 33a, 4(3a − 5b) = 12a − 20b and 7(3a + 2b) = 21a + 14b.",
              },
              {
                point: "Collects like terms: −33a + 12a + 21a = 0 and 6b − 20b + 14b = 0, so the total is 0",
                keywords: ["33a 12a 21a", "12a 21a 33a", "33a 33a", "6b 20b 14b", "6b 14b 20b", "20b 20b", "cancel", "a terms+0", "b terms+0"],
                feedback: "Then collect: the a terms give −33a + 12a + 21a = 0 and the b terms give 6b − 20b + 14b = 0, so everything cancels to 0.",
              },
            ],
            model: "Card 2: 3(2b − 11a) = 6b − 33a. Card 3: 4(3a − 5b) = 12a − 20b. Card 6: 7(3a + 2b) = 21a + 14b. The a terms: −33a + 12a + 21a = −33a + 33a = 0. The b terms: 6b − 20b + 14b = 20b − 20b = 0. So Card 2 + Card 3 + Card 6 = 0.",
          },
        ],
        hints: [
          "Expand each card first, then collect the a terms and the b terms separately.",
          "Card 5 is 6(3a − b), and 6 × (−b) = −6b. For (b), find the HCF of 28 and 21.",
          "For (c), the a terms are −33a, +12a and +21a. What do they add up to? Now do the same for the b terms.",
        ],
        solution: [
          "(a) Card 4: {{5(2a - 3b) = 10a - 15b}}. Card 5: {{6(3a - b) = 18a - 6b}}.",
          "Add: 10a + 18a = 28a and −15b − 6b = −21b, so Card 4 + Card 5 = **28a − 21b**.",
          "(b) The HCF of 28 and 21 is 7, so {{28a - 21b = 7(4a - 3b)}} — one of the target answers in the class puzzle!",
          "(c) Card 2: {{3(2b - 11a) = 6b - 33a}}. Card 3: {{4(3a - 5b) = 12a - 20b}}. Card 6: {{7(3a + 2b) = 21a + 14b}}.",
          "a terms: −33a + 12a + 21a = −33a + 33a = 0. b terms: 6b − 20b + 14b = 20b − 20b = 0. So the total is 0 ✓",
          "Quick check with a = 1 and b = 1: Card 2 = 3 × (−9) = −27, Card 3 = 4 × (−2) = −8, Card 6 = 7 × 5 = 35, and −27 − 8 + 35 = 0 ✓",
        ],
        commonError: "Treating 6(3a − b) as 18a − b (forgetting to multiply the b by 6), or dropping a minus sign when collecting the a terms.",
        strategy: "Check by substituting",
        source: "Class worksheet — Expanding, Task 4",
      },
    ],
  },
];
