import type { QA, QuestionSet } from "../../types";

// Substitution (Unit 2) — written "show your method" questions: 4 sets × 6 questions.
// Every auto-marked part has a `verify` that rebuilds the answer from the question's own
// numbers (negatives in brackets), so `npm run validate` machine-checks every answer key.

export const WRITTEN_SU: QuestionSet<QA>[] = [
  // ===========================================================================
  // SET 1 · Foundations — warm-up 2 / core 3 / challenge 1
  // ===========================================================================
  {
    id: "su-written-1",
    title: "Written 1 · Foundations",
    subtitle: "Whole numbers and BIDMAS, perimeters with x = 3, your first negatives, and what squaring a decimal does.",
    topic: "su",
    questions: [
      {
        id: "su-w1-q01",
        topic: "su",
        section: "su-basics",
        difficulty: "warmup",
        question: "{{b = 4}} and {{c = 6}}. Work out the value of each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{5(c + b)}}",
            marks: 1,
            answer: { type: "number", value: 50 },
            verify: "5*(6+4)",
            traps: [
              { spec: { type: "number", value: 34 }, feedback: "34 is 5 × 6 + 4 — only c was multiplied by 5. The 5 multiplies the whole bracket: work out 6 + 4 = 10 first, then 5 × 10." },
            ],
          },
          {
            label: "b",
            prompt: "{{5b^2}}",
            marks: 1,
            answer: { type: "number", value: 80 },
            verify: "5*4^2",
            traps: [
              { spec: { type: "number", value: 400 }, feedback: "400 is (5 × 4)² — you squared the 5 as well. In 5b² only the b is squared: 4² = 16, then 5 × 16 = 80." },
              { spec: { type: "number", value: 40 }, feedback: "40 is 5 × 4 × 2. But b² means b × b, not b × 2: 4² = 16, so 5b² = 5 × 16." },
            ],
          },
          {
            label: "c",
            prompt: "{{(b + 2)/3}}",
            marks: 1,
            answer: { type: "number", value: 2 },
            verify: "(4+2)/3",
            traps: [
              { spec: { type: "number", value: 14 / 3, tolerance: 0.01 }, feedback: "That's 4 + {{2/3}} — only the 2 was divided by 3. The fraction line works like a bracket: the whole top, 4 + 2 = 6, is divided by 3." },
            ],
          },
        ],
        hints: [
          "Write each letter as its number in brackets — b becomes (4) and c becomes (6) — then follow BIDMAS.",
          "In {{5b^2}} only the b is squared. In {{(b + 2)/3}} the fraction line groups the whole top, so work that out first.",
        ],
        solution: [
          "(a) {{5(c + b) = 5 * (6 + 4) = 5 * 10}} = **50**. Work out the bracket first.",
          "(b) {{5b^2 = 5 * (4)^2 = 5 * 16}} = **80**. The power belongs only to b: square 4 first, then multiply by 5.",
          "(c) {{(b + 2)/3 = (4 + 2)/3 = 6/3}} = **2**. Add the top first, then divide the whole of it by 3.",
        ],
        commonError: "Squaring the 5 as well as the b: 5b² means 5 × 4² = 80, not (5 × 4)² = 400.",
        strategy: "Check by substituting",
        source: "Class worksheet",
      },
      {
        id: "su-w1-q02",
        topic: "su",
        section: "su-formulae",
        difficulty: "warmup",
        question: "The side lengths of these shapes are in centimetres. Use {{x = 3}} to work out the perimeter of each shape.",
        diagram: `<svg viewBox="0 0 480 215" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three shapes: a square with sides x + 3, a regular pentagon with sides 3x + 1, and an isosceles triangle with two equal sides of 2x + 2 and a base of x + 2.">
<rect x="0" y="0" width="480" height="215" fill="#ffffff"/>
<text x="8" y="16" font-family="sans-serif" font-size="12" fill="#334155">Not drawn to scale</text>
<rect x="25" y="40" width="100" height="100" fill="#c7d2fe" stroke="#1f2937" stroke-width="2"/>
<text x="75" y="162" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#1f2937">x + 3</text>
<polygon points="240,35 297,76 275,144 205,144 183,76" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<text x="240" y="164" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#1f2937">3x + 1</text>
<polygon points="390,24 345,160 435,160" fill="#bbf7d0" stroke="#1f2937" stroke-width="2"/>
<line x1="362" y1="90" x2="373" y2="94" stroke="#1f2937" stroke-width="2"/>
<line x1="407" y1="94" x2="418" y2="90" stroke="#1f2937" stroke-width="2"/>
<text x="356" y="95" font-family="sans-serif" font-size="14" text-anchor="end" fill="#1f2937">2x + 2</text>
<text x="424" y="95" font-family="sans-serif" font-size="14" text-anchor="start" fill="#1f2937">2x + 2</text>
<text x="390" y="180" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#1f2937">x + 2</text>
<text x="75" y="203" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#334155">square</text>
<text x="240" y="203" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#334155">regular pentagon</text>
<text x="390" y="203" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#334155">isosceles triangle</text>
</svg>`,
        parts: [
          {
            label: "a",
            prompt: "The square has sides of {{(x + 3)}} cm. Work out its perimeter.",
            marks: 1,
            answer: { type: "number", value: 24, display: "24 cm" },
            verify: "4*(3+3)",
            traps: [
              { spec: { type: "number", value: 15 }, feedback: "15 is 4 × 3 + 3 — only the x was multiplied by 4. Each side is the whole of x + 3 = 6 cm, so the perimeter is 4 × 6." },
            ],
          },
          {
            label: "b",
            prompt: "The regular pentagon has sides of {{(3x + 1)}} cm. Work out its perimeter.",
            marks: 1,
            answer: { type: "number", value: 50, display: "50 cm" },
            verify: "5*(3*3+1)",
            traps: [
              { spec: { type: "number", value: 170 }, feedback: "170 comes from reading 3x as 33. 3x means 3 × x = 9, so each side is 9 + 1 = 10 cm." },
              { spec: { type: "number", value: 46 }, feedback: "46 is 5 × 9 + 1 — but the +1 is part of every side. Each side is 10 cm, so the perimeter is 5 × 10." },
            ],
          },
          {
            label: "c",
            prompt: "The isosceles triangle has two equal sides of {{(2x + 2)}} cm and a base of {{(x + 2)}} cm. Work out its perimeter.",
            marks: 1,
            answer: { type: "number", value: 21, display: "21 cm" },
            verify: "2*(2*3+2)+(3+2)",
            traps: [
              { spec: { type: "number", value: 13 }, feedback: "13 is 8 + 5 — but an isosceles triangle has **two** equal sides of 8 cm. Perimeter = 8 + 8 + 5." },
            ],
          },
        ],
        hints: [
          "Find the length of **one** side first by putting {{x = 3}} into its expression.",
          "Perimeter is the total distance around the outside, so add up every side. A square has 4 equal sides and a regular pentagon has 5.",
        ],
        solution: [
          "Square: one side = x + 3 = 3 + 3 = 6 cm. Perimeter = 4 × 6 = **24 cm**.",
          "Pentagon: one side = 3x + 1 = 3 × 3 + 1 = 9 + 1 = 10 cm. Perimeter = 5 × 10 = **50 cm**.",
          "Triangle: each equal side = 2x + 2 = 2 × 3 + 2 = 8 cm and the base = x + 2 = 3 + 2 = 5 cm. Perimeter = 8 + 8 + 5 = **21 cm**.",
        ],
        altMethod: {
          label: "Write a perimeter expression first",
          steps: [
            "Square: 4(x + 3) = 4x + 12, so the perimeter is 4 × 3 + 12 = 24 cm.",
            "Pentagon: 5(3x + 1) = 15x + 5, so the perimeter is 15 × 3 + 5 = 50 cm.",
            "Triangle: 2(2x + 2) + (x + 2) = 5x + 6, so the perimeter is 5 × 3 + 6 = 21 cm.",
            "Same answers — and now you could find the perimeters for any value of x in one step.",
          ],
        },
        commonError: "Reading 3x as 'thirty-three' when x = 3. Letters next to numbers are multiplied: 3x = 3 × 3 = 9.",
        strategy: "Draw a diagram",
        source: "Class worksheet",
      },
      {
        id: "su-w1-q03",
        topic: "su",
        section: "su-basics",
        difficulty: "core",
        question: "{{p = 5}}, {{q = 2}} and {{r = 3}}. Work out the value of each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{3pq}}",
            marks: 1,
            answer: { type: "number", value: 30 },
            verify: "3*5*2",
            traps: [
              { spec: { type: "number", value: 352 }, feedback: "352 is the digits 3, 5 and 2 written side by side. Letters written next to each other are multiplied: 3pq = 3 × 5 × 2." },
              { spec: { type: "number", value: 10 }, feedback: "10 is 3 + 5 + 2 — you added. 3pq means 3 × p × q." },
            ],
          },
          {
            label: "b",
            prompt: "{{p^2 - 4r}}",
            marks: 1,
            answer: { type: "number", value: 13 },
            verify: "5^2-4*3",
            traps: [
              { spec: { type: "number", value: -2 }, feedback: "−2 comes from p² = 5 × 2 = 10. But p² means p × p = 25, so the answer is 25 − 12." },
              { spec: { type: "number", value: 63 }, feedback: "63 is (25 − 4) × 3 — you subtracted before multiplying. Work out 4r = 4 × 3 = 12 first, then 25 − 12." },
            ],
          },
          {
            label: "c",
            prompt: "{{(p + q)^2}}",
            marks: 1,
            answer: { type: "number", value: 49 },
            verify: "(5+2)^2",
            traps: [
              { spec: { type: "number", value: 29 }, feedback: "29 is 5² + 2² — you squared each letter separately. The whole bracket is squared: 5 + 2 = 7 first, then 7² = 49." },
              { spec: { type: "number", value: 14 }, feedback: "14 is 7 × 2 — you doubled instead of squaring. 7² means 7 × 7." },
            ],
          },
          {
            label: "d",
            prompt: "{{2q^3}}",
            marks: 1,
            answer: { type: "number", value: 16 },
            verify: "2*2^3",
            traps: [
              { spec: { type: "number", value: 64 }, feedback: "64 is (2 × 2)³ — the 2 in front got cubed too. Only q is cubed: 2³ = 8, then 2 × 8 = 16." },
              { spec: { type: "number", value: 12 }, feedback: "12 is 2 × 2 × 3. Cubing means multiplying three copies: q³ = 2 × 2 × 2 = 8, so 2q³ = 16." },
            ],
          },
        ],
        hints: [
          "Letters written next to each other are multiplied: {{3pq = 3 * p * q}}.",
          "BIDMAS: brackets, then powers, then × and ÷, then + and −. A power only belongs to the thing it touches — unless there is a bracket.",
        ],
        solution: [
          "(a) {{3pq = 3 * 5 * 2}} = **30**.",
          "(b) {{p^2 - 4r = (5)^2 - 4 * (3) = 25 - 12}} = **13**. Powers first, then ×, then −.",
          "(c) {{(p + q)^2 = (5 + 2)^2 = 7^2}} = **49**. Bracket first, then square.",
          "(d) {{2q^3 = 2 * (2)^3 = 2 * 8}} = **16**. Only q is cubed: 2 × 2 × 2 = 8.",
        ],
        commonError: "Squaring each letter separately in (p + q)²: 5² + 2² = 29. The bracket comes first, so it is 7² = 49.",
        strategy: "Check by substituting",
      },
      {
        id: "su-w1-q04",
        topic: "su",
        section: "su-negatives",
        difficulty: "core",
        question: "{{w = 7}}, {{T = -6}}, {{x = 4}} and {{y = -3}}. Work out the value of each expression. Put each negative number in brackets when you substitute.",
        parts: [
          {
            label: "a",
            prompt: "{{4w + 2x + 2T}}",
            marks: 1,
            answer: { type: "number", value: 24 },
            verify: "4*7+2*4+2*(-6)",
            traps: [
              { spec: { type: "number", value: 48 }, feedback: "48 comes from using T = 6. T is −6, so 2T = 2 × (−6) = −12 and the total is 28 + 8 − 12." },
            ],
          },
          {
            label: "b",
            prompt: "{{5x - 3y + 8}}",
            marks: 1,
            answer: { type: "number", value: 37 },
            verify: "5*4-3*(-3)+8",
            traps: [
              { spec: { type: "number", value: 19 }, feedback: "19 is 20 − 9 + 8. But −3y = −3 × (−3) = +9 — a negative times a negative is positive — so it's 20 + 9 + 8." },
            ],
          },
          {
            label: "c",
            prompt: "{{4(2w + 3y)}}",
            marks: 1,
            answer: { type: "number", value: 20 },
            verify: "4*(2*7+3*(-3))",
            traps: [
              { spec: { type: "number", value: 92 }, feedback: "92 is 4 × (14 + 9). But 3y = 3 × (−3) = −9, so the bracket is 14 − 9 = 5." },
            ],
          },
          {
            label: "d",
            prompt: "{{wx - (x + T)}}",
            marks: 1,
            answer: { type: "number", value: 30 },
            verify: "7*4-(4+(-6))",
            traps: [
              { spec: { type: "number", value: 18 }, feedback: "18 is 28 − 10 (using T = 6) or 28 − 4 − 6. Work out the bracket first: 4 + (−6) = −2. Then 28 − (−2) = 28 + 2." },
              { spec: { type: "number", value: 26 }, feedback: "The bracket is −2 ✓ — but 28 − (−2) is not 26. Subtracting a negative adds: 28 − (−2) = 28 + 2." },
            ],
          },
        ],
        hints: [
          "Write every substitution with brackets, e.g. {{2T = 2 * (-6)}}.",
          "Watch two signs next to each other: −3 × (−3) = +9, and subtracting a negative adds, so 28 − (−2) = 28 + 2.",
        ],
        solution: [
          "(a) {{4w + 2x + 2T = 4 * 7 + 2 * 4 + 2 * (-6) = 28 + 8 - 12}} = **24**.",
          "(b) {{5x - 3y + 8 = 5 * 4 - 3 * (-3) + 8 = 20 + 9 + 8}} = **37**.",
          "(c) {{4(2w + 3y) = 4(2 * 7 + 3 * (-3)) = 4(14 - 9) = 4 * 5}} = **20**.",
          "(d) {{wx - (x + T) = 7 * 4 - (4 + (-6)) = 28 - (-2) = 28 + 2}} = **30**.",
        ],
        commonError: "Losing a minus sign: −3 × (−3) is +9 (not −9), and 28 − (−2) is 30 (not 26).",
        strategy: "Check by substituting",
        source: "Class worksheet",
      },
      {
        id: "su-w1-q05",
        topic: "su",
        section: "su-powers",
        difficulty: "core",
        question: "Work out each of these without a calculator.",
        parts: [
          {
            label: "a",
            prompt: "{{0.6^2}}",
            marks: 1,
            answer: { type: "number", value: 0.36 },
            verify: "0.6^2",
            traps: [
              { spec: { type: "number", value: 1.2 }, feedback: "1.2 is 0.6 × 2. Squaring means multiplying the number by itself: 0.6 × 0.6." },
              { spec: { type: "number", value: 3.6 }, feedback: "Check the decimal point: 6 × 6 = 36, and 0.6 × 0.6 has two decimal places in total, so it is 0.36." },
            ],
          },
          {
            label: "b",
            prompt: "{{(-2)^3}}",
            marks: 1,
            answer: { type: "number", value: -8 },
            verify: "(-2)^3",
            traps: [
              { spec: { type: "number", value: 8 }, feedback: "The size is right but the sign isn't: (−2) × (−2) = 4, then 4 × (−2) = −8. Three negatives multiplied give a negative." },
              { spec: { type: "number", value: -6 }, feedback: "−6 is −2 × 3. Cubing means multiplying three copies: (−2) × (−2) × (−2)." },
            ],
          },
          {
            label: "c",
            prompt: "{{sqrt(0.09)}}",
            marks: 1,
            answer: { type: "number", value: 0.3 },
            verify: "sqrt(0.09)",
            traps: [
              { spec: { type: "number", value: 0.03 }, feedback: "Check: 0.03 × 0.03 = 0.0009, not 0.09. Since 0.3 × 0.3 = 0.09, the square root is 0.3." },
            ],
          },
          {
            label: "d",
            prompt: "Look at your answer to (a). Explain what happens when you square a number between 0 and 1.",
            marks: 2,
            markScheme: [
              {
                point: "Says the answer is smaller than the number you started with",
                keywords: ["smaller", "less than", "decreases", "goes down", "gets less", "lower", "not bigger", "reduces"],
                feedback: "Say clearly what happens: the square is **smaller** than the number you started with (0.36 is less than 0.6).",
              },
              {
                point: "Gives a reason or an example, e.g. multiplying by a number less than 1 only gives part of it, or 0.6² = 0.36",
                keywords: ["0.36", "part of", "fraction of", "less than 1", "smaller than 1", "0.25", "0.01", "half of"],
                feedback: "Back it up with a reason or an example: multiplying by a number less than 1 only gives you part of the number — e.g. {{0.6^2 = 0.36}}, which is less than 0.6.",
              },
            ],
            model: "Squaring a number between 0 and 1 makes it **smaller**. Squaring means multiplying the number by itself, and multiplying by a number less than 1 only gives you part of the number. For example {{0.6^2 = 0.36}}, and 0.36 is less than 0.6.",
          },
        ],
        hints: [
          "{{0.6^2 = 0.6 * 0.6}}. Work out 6 × 6, then count the decimal places.",
          "For (c): which number multiplied by itself gives 0.09?",
          "For (d): compare your answer to (a) with 0.6. Did squaring make it bigger or smaller?",
        ],
        solution: [
          "(a) {{0.6^2 = 0.6 * 0.6}} = **0.36** (6 × 6 = 36, and there are two decimal places in total).",
          "(b) {{(-2)^3 = (-2) * (-2) * (-2) = 4 * (-2)}} = **−8**. Three negatives multiplied give a negative.",
          "(c) {{sqrt(0.09)}} = **0.3**, because 0.3 × 0.3 = 0.09.",
          "(d) 0.36 is **smaller** than 0.6. Squaring a number between 0 and 1 always makes it smaller: you multiply it by a number less than 1, so you only get part of it.",
          "Notice that square-rooting does the opposite: {{sqrt(0.09) = 0.3}} is *bigger* than 0.09.",
        ],
        commonError: "Writing 0.6² = 1.2 (that's 0.6 × 2) or 3.6 (decimal point in the wrong place). 0.6² = 0.6 × 0.6 = 0.36.",
        strategy: "Try small cases",
      },
      {
        id: "su-w1-q06",
        topic: "su",
        section: "su-formulae",
        difficulty: "challenge",
        question: "A taxi company uses the formula {{C = 3 + 2m}} to work out the cost of a journey, where C is the cost in pounds (£) and m is the number of miles.",
        parts: [
          {
            label: "a",
            prompt: "Work out the cost of an 8-mile journey. Give your answer in £.",
            marks: 1,
            answer: { type: "number", value: 19, display: "£19" },
            verify: "3+2*8",
            traps: [
              { spec: { type: "number", value: 40 }, feedback: "£40 is (3 + 2) × 8 — multiplication comes first. 2m = 2 × 8 = 16, then add the £3." },
            ],
          },
          {
            label: "b",
            prompt: "Siti paid £27 for her journey. How many miles was it?",
            marks: 2,
            answer: { type: "number", value: 12, display: "12 miles" },
            verify: "(27-3)/2",
            traps: [
              { spec: { type: "number", value: 15 }, feedback: "15 comes from adding the 3. Work backwards: take the fixed £3 off first (27 − 3 = 24), then divide by 2." },
              { spec: { type: "number", value: 10.5 }, feedback: "10.5 is 27 ÷ 2 − 3 — the right steps in the wrong order. The formula does × 2 then + 3, so undo it the other way round: − 3 first, then ÷ 2." },
            ],
          },
          {
            label: "c",
            prompt: "Wei Ling says, 'A 10-mile journey costs twice as much as a 5-mile journey.' Is she right? Show working to explain your answer.",
            marks: 2,
            markScheme: [
              {
                point: "Works out both costs: £13 for 5 miles and £23 for 10 miles",
                keywords: ["13+23", "26+23", "thirteen+twenty three"],
                feedback: "Use the formula for both journeys: 5 miles costs 3 + 2 × 5 = £13 and 10 miles costs 3 + 2 × 10 = £23.",
              },
              {
                point: "Says she is wrong: twice £13 is £26, not £23 — the £3 is only charged once",
                keywords: ["26", "only once", "fixed", "once", "not doubled", "doesnt double", "isnt doubled", "only the 2m"],
                feedback: "Finish with the comparison: double £13 is £26, but the 10-mile journey is only £23. The fixed £3 is paid once, so the cost doesn't double.",
              },
            ],
            model: "No, she is not right. 5 miles: C = 3 + 2 × 5 = £13. 10 miles: C = 3 + 2 × 10 = £23. Twice £13 is £26, not £23. This is because the £3 is a fixed charge that is only paid once — only the 2m part doubles.",
          },
        ],
        hints: [
          "For (a), multiply before you add: work out 2 × 8 first.",
          "For (b), work backwards. The formula does × 2 then + 3, so undo it: − 3, then ÷ 2.",
          "For (c), work out the cost of a 5-mile journey and of a 10-mile journey, then compare.",
        ],
        solution: [
          "(a) {{C = 3 + 2 * 8 = 3 + 16}} = **£19**.",
          "(b) Work backwards from £27: take off the fixed £3 first, 27 − 3 = 24; then divide by 2: 24 ÷ 2 = **12 miles**.",
          "Check (b): {{3 + 2 * 12 = 3 + 24 = 27}} ✓",
          "(c) 5 miles: {{C = 3 + 2 * 5}} = £13. 10 miles: {{C = 3 + 2 * 10}} = £23.",
          "Twice £13 is £26, not £23, so **Wei Ling is wrong**. The £3 is a fixed charge you pay only once — only the 2m part doubles when the miles double.",
        ],
        altMethod: {
          label: "Try values for part (b)",
          steps: [
            "m = 10: 3 + 20 = £23 — too small.",
            "m = 11: 3 + 22 = £25 — still too small.",
            "m = 12: 3 + 24 = £27 ✓ So the journey was 12 miles.",
            "Working backwards (− 3, then ÷ 2) gets there in one step.",
          ],
        },
        commonError: "Working out (3 + 2) × 8 = 40 in part (a). Multiplication comes before addition, so 2 × 8 = 16 first, then + 3.",
        strategy: "Work backwards",
      },
    ],
  },

  // ===========================================================================
  // SET 2 · Core skills — warm-up 1 / core 4 / challenge 1
  // ===========================================================================
  {
    id: "su-written-2",
    title: "Written 2 · Core skills",
    subtitle: "Negatives in brackets, square roots and fraction lines, K = ½mv², and is a square always bigger?",
    topic: "su",
    questions: [
      {
        id: "su-w2-q01",
        topic: "su",
        section: "su-negatives",
        difficulty: "warmup",
        question: "{{a = 3}}, {{b = 4}} and {{c = -2}}. Work out the value of each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{5 + 2a}}",
            marks: 1,
            answer: { type: "number", value: 11 },
            verify: "5+2*3",
            traps: [
              { spec: { type: "number", value: 21 }, feedback: "21 is (5 + 2) × 3 — multiplication comes first. 2a = 2 × 3 = 6, then 5 + 6." },
              { spec: { type: "number", value: 28 }, feedback: "28 comes from reading 2a as 23. 2a means 2 × a = 6, so 5 + 2a = 5 + 6." },
            ],
          },
          {
            label: "b",
            prompt: "{{b - c}}",
            marks: 1,
            answer: { type: "number", value: 6 },
            verify: "4-(-2)",
            traps: [
              { spec: { type: "number", value: 2 }, feedback: "2 is 4 − 2. But c is −2, and subtracting a negative is the same as adding: 4 − (−2) = 4 + 2." },
            ],
          },
          {
            label: "c",
            prompt: "{{ac}}",
            marks: 1,
            answer: { type: "number", value: -6 },
            verify: "3*(-2)",
            traps: [
              { spec: { type: "number", value: 6 }, feedback: "Check the sign: a positive times a negative is negative, so 3 × (−2) = −6." },
              { spec: { type: "number", value: 1 }, feedback: "1 is a + c. Letters written next to each other are multiplied: ac = 3 × (−2)." },
            ],
          },
          {
            label: "d",
            prompt: "{{c^2}}",
            marks: 1,
            answer: { type: "number", value: 4 },
            verify: "(-2)^2",
            traps: [
              { spec: { type: "number", value: -4 }, feedback: "−4 comes from writing −2² without brackets. Put the negative in brackets: (−2)² = (−2) × (−2) = +4." },
            ],
          },
        ],
        hints: [
          "Put the negative number in brackets: c becomes (−2).",
          "Subtracting a negative is the same as adding. A negative times a negative is positive.",
        ],
        solution: [
          "(a) {{5 + 2a = 5 + 2 * 3 = 5 + 6}} = **11** (multiply before you add).",
          "(b) {{b - c = 4 - (-2) = 4 + 2}} = **6** (taking away a negative adds).",
          "(c) {{ac = 3 * (-2)}} = **−6** (positive × negative = negative).",
          "(d) {{c^2 = (-2)^2 = (-2) * (-2)}} = **4** (negative × negative = positive).",
        ],
        commonError: "Writing b − c = 4 − 2 = 2. Because c is −2, b − c = 4 − (−2) = 6.",
        strategy: "Check by substituting",
        source: "Class example",
      },
      {
        id: "su-w2-q02",
        topic: "su",
        section: "su-basics",
        difficulty: "core",
        question: "{{m = 6}} and {{n = 8}}. Work out the value of each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{sqrt(m^2 + n^2)}}",
            marks: 1,
            answer: { type: "number", value: 10 },
            verify: "sqrt(6^2+8^2)",
            traps: [
              { spec: { type: "number", value: 14 }, feedback: "14 is 6 + 8 — you can't square-root each part separately. Add under the root first: 36 + 64 = 100, and {{sqrt(100) = 10}}." },
            ],
          },
          {
            label: "b",
            prompt: "{{(3m + n)/2}}",
            marks: 1,
            answer: { type: "number", value: 13 },
            verify: "(3*6+8)/2",
            traps: [
              { spec: { type: "number", value: 22 }, feedback: "22 is 18 + 4 — only n was halved. The fraction line divides the whole top: 18 + 8 = 26, then 26 ÷ 2." },
            ],
          },
          {
            label: "c",
            prompt: "{{(n - m)^3}}",
            marks: 1,
            answer: { type: "number", value: 8 },
            verify: "(8-6)^3",
            traps: [
              { spec: { type: "number", value: 6 }, feedback: "6 is 2 × 3. Cubing means multiplying three copies: 2³ = 2 × 2 × 2." },
            ],
          },
          {
            label: "d",
            prompt: "{{(m + n)/(n - m)}}",
            marks: 1,
            answer: { type: "number", value: 7 },
            verify: "(6+8)/(8-6)",
            traps: [
              { spec: { type: "number", value: 1 }, feedback: "1 comes from 6 + 8 ÷ 8 − 6 — ignoring the grouping. The fraction line means (6 + 8) ÷ (8 − 6) = 14 ÷ 2." },
            ],
          },
        ],
        hints: [
          "Anything under a √ sign, inside a bracket, or on the top or bottom of a fraction line is worked out first.",
          "For (a): find {{m^2 + n^2}} first, then square-root the total.",
        ],
        solution: [
          "(a) {{sqrt(m^2 + n^2) = sqrt(6^2 + 8^2) = sqrt(36 + 64) = sqrt(100)}} = **10**.",
          "(b) {{(3m + n)/2 = (3 * 6 + 8)/2 = 26/2}} = **13**.",
          "(c) {{(n - m)^3 = (8 - 6)^3 = 2^3 = 2 * 2 * 2}} = **8**.",
          "(d) {{(m + n)/(n - m) = (6 + 8)/(8 - 6) = 14/2}} = **7**.",
        ],
        commonError: "Square-rooting each part on its own: {{sqrt(36 + 64)}} is {{sqrt(100)}} = 10, not 6 + 8 = 14.",
        strategy: "Check by substituting",
      },
      {
        id: "su-w2-q03",
        topic: "su",
        section: "su-negatives",
        difficulty: "core",
        question: "{{c = 6}} and {{e = -3}}. Work out the value of each expression.",
        parts: [
          {
            label: "a",
            prompt: "{{3(10 - e)}}",
            marks: 1,
            answer: { type: "number", value: 39 },
            verify: "3*(10-(-3))",
            traps: [
              { spec: { type: "number", value: 21 }, feedback: "21 is 3 × 7 — you worked out 10 − 3. But e = −3, so 10 − (−3) = 10 + 3 = 13, and 3 × 13 = 39." },
            ],
          },
          {
            label: "b",
            prompt: "{{e^3}}",
            marks: 1,
            answer: { type: "number", value: -27 },
            verify: "(-3)^3",
            traps: [
              { spec: { type: "number", value: 27 }, feedback: "Check the sign: (−3) × (−3) = 9, then 9 × (−3) = −27. Three negatives multiplied give a negative." },
              { spec: { type: "number", value: -9 }, feedback: "−9 is −3 × 3. Cubing means three copies multiplied: (−3) × (−3) × (−3)." },
            ],
          },
          {
            label: "c",
            prompt: "{{8e^2 + 3}}",
            marks: 1,
            answer: { type: "number", value: 75 },
            verify: "8*(-3)^2+3",
            traps: [
              { spec: { type: "number", value: -69 }, feedback: "−69 uses e² = −9. A negative squared is positive: (−3)² = 9, so 8 × 9 + 3 = 75." },
              { spec: { type: "number", value: 579 }, feedback: "579 is (8 × (−3))² + 3 — the 8 got squared too. Only e is squared: 8 × 9 + 3." },
            ],
          },
          {
            label: "d",
            prompt: "{{(2c - e)/4}}",
            marks: 1,
            answer: { type: "number", value: 3.75, display: "3.75 (or {{3 3/4}})" },
            verify: "(2*6-(-3))/4",
            traps: [
              { spec: { type: "number", value: 2.25 }, feedback: "2.25 is {{9/4}}, from 12 − 3. But e = −3, so 2c − e = 12 − (−3) = 15, and {{15/4}} = 3.75." },
            ],
          },
        ],
        hints: [
          "Put e in brackets every time: e becomes (−3).",
          "(−3)² = +9 but (−3)³ = −27. And taking away −3 is the same as adding 3.",
        ],
        solution: [
          "(a) {{3(10 - e) = 3(10 - (-3)) = 3 * 13}} = **39**.",
          "(b) {{e^3 = (-3)^3 = (-3) * (-3) * (-3) = 9 * (-3)}} = **−27**.",
          "(c) {{8e^2 + 3 = 8 * (-3)^2 + 3 = 8 * 9 + 3 = 72 + 3}} = **75**. Square first, then × 8, then + 3.",
          "(d) {{(2c - e)/4 = (2 * 6 - (-3))/4 = (12 + 3)/4 = 15/4}} = **3.75** (or {{3 3/4}}).",
        ],
        commonError: "Forgetting that e is negative inside a subtraction: 10 − (−3) = 13, not 7, and 12 − (−3) = 15, not 9.",
        strategy: "Check by substituting",
        source: "Class worksheet",
      },
      {
        id: "su-w2-q04",
        topic: "su",
        section: "su-formulae",
        difficulty: "core",
        question: "The kinetic energy, K joules, of a moving object is given by the formula {{K = 1/2 mv^2}}, where m is the mass in kg and v is the speed in m/s.",
        parts: [
          {
            label: "a",
            prompt: "Work out K when {{m = 10}} and {{v = 2}}.",
            marks: 1,
            answer: { type: "number", value: 20, display: "20 J" },
            verify: "1/2*10*2^2",
            traps: [
              { spec: { type: "number", value: 10 }, feedback: "10 is {{1/2}} × 10 × 2 — v wasn't squared. v² = 2² = 4, so K = {{1/2}} × 10 × 4." },
              { spec: { type: "number", value: 200 }, feedback: "200 comes from squaring m as well: {{1/2}} × (10 × 2)². Only v is squared: {{1/2}} × 10 × 4 = 20." },
            ],
          },
          {
            label: "b",
            prompt: "Work out K when {{m = 2}} and {{v = 10}}.",
            marks: 1,
            answer: { type: "number", value: 100, display: "100 J" },
            verify: "1/2*2*10^2",
            traps: [
              { spec: { type: "number", value: 10 }, feedback: "10 is {{1/2}} × 2 × 10 — v must be squared: 10² = 100, so K = {{1/2}} × 2 × 100." },
              { spec: { type: "number", value: 200 }, feedback: "200 is double the answer — either the {{1/2}} was missed (2 × 100) or m was squared too. K = {{1/2}} × 2 × 100 = 100." },
            ],
          },
          {
            label: "c",
            prompt: "Priya says, 'Swapping the mass and the speed makes no difference to the kinetic energy.' Use your answers to (a) and (b) to explain why she is wrong.",
            marks: 2,
            markScheme: [
              {
                point: "Compares the answers: 20 J in (a) but 100 J in (b) — five times as much",
                keywords: ["20+100", "5 times", "five times", "80 more", "not the same"],
                feedback: "Use your numbers: the energy is 20 J in (a) but 100 J in (b), which is 5 times as much — so swapping does change it.",
              },
              {
                point: "Explains that only the speed is squared, not the mass",
                keywords: ["only the speed", "only v", "speed is squared", "v is squared", "speed squared", "v squared", "gets squared", "mass is not squared"],
                feedback: "Give the reason: only v is squared. A speed of 10 becomes 10² = 100, but a mass of 10 is only multiplied once.",
              },
            ],
            model: "She is wrong: in (a) K = 20 J but in (b) K = 100 J, which is 5 times as much. Only the speed is squared, not the mass — a speed of 10 gives {{v^2 = 100}}, but a mass of 10 is only multiplied once. So swapping them changes the answer.",
          },
        ],
        hints: [
          "Square v first, then multiply by m, then halve.",
          "In (b), {{v^2 = 10^2 = 100}}. For (c), compare 20 J and 100 J — which letter in the formula is squared?",
        ],
        solution: [
          "(a) {{K = 1/2 * 10 * 2^2 = 1/2 * 10 * 4 = 1/2 * 40}} = **20 J**.",
          "(b) {{K = 1/2 * 2 * 10^2 = 1/2 * 2 * 100 = 1/2 * 200}} = **100 J**.",
          "(c) 100 J is 5 times as much as 20 J, so swapping m and v **does** change K. Only v is squared: a speed of 10 becomes 10² = 100, but a mass of 10 is just multiplied once.",
        ],
        commonError: "Forgetting to square v ({{1/2}} × 10 × 2 = 10), or squaring the mass too. In {{K = 1/2 mv^2}} only v is squared.",
        strategy: "Check by substituting",
        source: "Class worksheet",
      },
      {
        id: "su-w2-q05",
        topic: "su",
        section: "su-powers",
        difficulty: "core",
        question: "Ethan says, 'When you square a number, the answer is always bigger than the number you started with.'",
        parts: [
          {
            label: "a",
            prompt: "Work out {{(-4)^2}}.",
            marks: 1,
            answer: { type: "number", value: 16 },
            verify: "(-4)^2",
            traps: [
              { spec: { type: "number", value: -16 }, feedback: "(−4)² = (−4) × (−4), and a negative times a negative is positive: +16." },
            ],
          },
          {
            label: "b",
            prompt: "Work out {{0.2^2}}.",
            marks: 1,
            answer: { type: "number", value: 0.04 },
            verify: "0.2^2",
            traps: [
              { spec: { type: "number", value: 0.4 }, feedback: "0.4 is 0.2 × 2, or a decimal-point slip. 0.2 × 0.2: 2 × 2 = 4, with two decimal places in total, gives 0.04." },
            ],
          },
          {
            label: "c",
            prompt: "Is Ethan right? Explain your answer and give an example.",
            marks: 2,
            markScheme: [
              {
                point: "Says no — Ethan is wrong, it is not always true",
                keywords: ["no", "wrong", "not always", "isnt always", "not right", "incorrect", "sometimes"],
                feedback: "Start with a clear verdict: **no**, Ethan is wrong — it is not always true.",
              },
              {
                point: "Gives a counter-example, e.g. 0.2² = 0.04, which is smaller than 0.2 (or 1² = 1)",
                keywords: ["0.04", "0.25", "0.01", "0.09", "0.36", "1 squared", "0 squared", "between 0 and 1"],
                feedback: "Back it up with a counter-example: {{0.2^2 = 0.04}}, which is smaller than 0.2 (or {{1^2 = 1}}, which is not bigger).",
              },
            ],
            model: "No — Ethan is wrong, because it is not always true. If the number is between 0 and 1, its square is smaller: {{0.2^2 = 0.04}}, and 0.04 is less than 0.2. Also {{1^2 = 1}}, which is not bigger.",
          },
        ],
        hints: [
          "{{(-4)^2 = (-4) * (-4)}} and {{0.2^2 = 0.2 * 0.2}} — count the decimal places.",
          "Compare each answer with the number you started with. Is it always bigger?",
        ],
        solution: [
          "(a) {{(-4)^2 = (-4) * (-4)}} = **16**, which is bigger than −4.",
          "(b) {{0.2^2 = 0.2 * 0.2}} = **0.04** (2 × 2 = 4, with two decimal places), which is *smaller* than 0.2.",
          "(c) So Ethan is **wrong**: squaring does not always make a number bigger. Numbers between 0 and 1 get smaller when you square them ({{0.2^2 = 0.04}}), and 0 and 1 stay the same ({{0^2 = 0}}, {{1^2 = 1}}).",
          "Squaring does make negative numbers, and numbers bigger than 1, bigger.",
        ],
        commonError: "Writing 0.2² = 0.4. Squaring means 0.2 × 0.2, and 2 × 2 = 4 with two decimal places gives 0.04.",
        strategy: "Try small cases",
      },
      {
        id: "su-w2-q06",
        topic: "su",
        section: "su-powers",
        difficulty: "challenge",
        question: "Decide whether each statement is **always**, **sometimes** or **never** true. Type one word for each.",
        parts: [
          {
            label: "a",
            prompt: "The square of a negative number is positive.",
            marks: 1,
            answer: { type: "text", accept: ["always", "always true"] },
          },
          {
            label: "b",
            prompt: "Cubing a number makes it bigger.",
            marks: 1,
            answer: { type: "text", accept: ["sometimes", "sometimes true"] },
          },
          {
            label: "c",
            prompt: "The square root of a number between 0 and 1 is smaller than the number.",
            marks: 1,
            answer: { type: "text", accept: ["never", "never true"] },
          },
          {
            label: "d",
            prompt: "Explain your answer to (b) by giving two examples: one where cubing makes the number bigger and one where it doesn't.",
            marks: 2,
            markScheme: [
              {
                point: "An example where the cube is bigger, e.g. 2³ = 8",
                keywords: ["8", "27", "64", "125", "1000", "2 cubed", "3 cubed", "10 cubed"],
                feedback: "Give a case where cubing makes it bigger, e.g. {{2^3 = 8}}, which is bigger than 2.",
              },
              {
                point: "An example where it is not bigger, e.g. 0.5³ = 0.125 (smaller), (−2)³ = −8, or 1³ = 1",
                keywords: ["0.125", "0.001", "0.008", "0.027", "smaller", "less than", "1 cubed", "stays the same"],
                feedback: "Give a case where it doesn't, e.g. {{0.5^3 = 0.125}}, which is smaller than 0.5 (or {{(-2)^3 = -8}}, which is smaller than −2).",
              },
            ],
            model: "Cubing 2 gives {{2^3 = 8}}, which is bigger than 2. But cubing 0.5 gives {{0.5^3 = 0.125}}, which is smaller than 0.5. Negative numbers can get smaller too: {{(-2)^3 = -8}}. So cubing only *sometimes* makes a number bigger.",
          },
        ],
        hints: [
          "Test each statement with different kinds of number: a whole number, a negative number, and a decimal between 0 and 1.",
          "For (c), try {{sqrt(0.25)}} and {{sqrt(0.01)}}, and compare each answer with the number you started with.",
          "For (b), compare {{2^3}} with 2, and {{0.5^3}} with 0.5.",
        ],
        solution: [
          "(a) **Always**: a negative times a negative is positive, e.g. {{(-3)^2 = 9}}.",
          "(b) **Sometimes**: {{2^3 = 8}} is bigger than 2, but {{0.5^3 = 0.125}} is smaller than 0.5, and {{(-2)^3 = -8}} is smaller than −2.",
          "(c) **Never**: square roots of numbers between 0 and 1 are *bigger* than the number, e.g. {{sqrt(0.25) = 0.5}} and {{sqrt(0.01) = 0.1}}.",
          "(d) For 'sometimes' you need one example each way, e.g. {{2^3 = 8}} (bigger) and {{0.5^3 = 0.125}} (smaller).",
        ],
        commonError: "Testing only whole numbers. Always try a negative number and a decimal between 0 and 1 as well — they often behave differently.",
        strategy: "Try small cases",
      },
    ],
  },
];
