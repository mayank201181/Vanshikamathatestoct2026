import type { MCQ, QuestionSet } from "../../types";

// Fractions (Unit 1) — multiple-choice sets 3–4 (sets 1–2 are in mcq-a.ts; mcq.ts combines them).
// Sections: fr-equivalent, fr-addsub, fr-muldiv, fr-problems, fr-algebraic (2 per set).
// Every numeric or algebraic key has a `verify` expression built from the question's own numbers.

export const MCQ_FR_B: QuestionSet<MCQ>[] = [
  // ===========================================================================
  // SET 3 · Exam practice  (warm-up 1 / core 6 / challenge 3)
  // ===========================================================================
  {
    id: "fr-mcq-3",
    title: "Set 3 · Exam practice",
    subtitle: "Exam-style practice: the class 'show that' calculations, BIDMAS with fractions, the shaded-shapes puzzle and algebraic fractions",
    topic: "fr",
    questions: [
      {
        id: "fr-m3-q01",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "warmup",
        question: "Fill in the box to make the two fractions equivalent: {{5/8 = □/56}}",
        options: ["53", "40", "35", "7"],
        answerIndex: 2,
        optionFeedback: [
          "53 comes from adding 48 to the top because 8 + 48 = 56. Equivalent fractions come from **multiplying** the top and the bottom by the same number, not adding.",
          "40 is 5 × 8: you multiplied the top by the old denominator. The bottom was multiplied by 7 (8 × 7 = 56), so the top must be multiplied by 7 too.",
          "8 × 7 = 56, so multiply the top by 7 as well: 5 × 7 = 35.",
          "7 is the multiplier (56 ÷ 8), not the new numerator. Use it on the top: 5 × 7 = 35.",
        ],
        explanation:
          "To make an equivalent fraction, multiply the top and the bottom by the **same** number. The bottom goes from 8 to 56, and 56 ÷ 8 = 7, so the multiplier is 7. The top becomes 5 × 7 = 35, giving {{35/56}}. Check: dividing 35 and 56 by 7 takes you back to {{5/8}} ✓",
        hints: ["What do you multiply 8 by to get 56?"],
        strategy: "Use the multiplier",
        verify: "5*56/8",
      },
      {
        id: "fr-m3-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "Work out {{2 5/6 + 1 3/4}}. Give your answer as a mixed number.",
        options: ["{{4 7/12}}", "{{3 4/5}}", "{{3 7/12}}", "{{3 2/3}}"],
        answerIndex: 0,
        optionFeedback: [
          "Wholes: 2 + 1 = 3. Fractions: {{10/12 + 9/12 = 19/12 = 1 7/12}}. Altogether 3 + {{1 7/12}} = {{4 7/12}}.",
          "{{3 4/5}} comes from adding the tops and the bottoms ({{8/10 = 4/5}}). Sixths and quarters are different-sized pieces, so rewrite both as twelfths first.",
          "You found {{19/12}} but forgot it is more than 1. {{19/12 = 1 7/12}}, so carry the extra whole: 3 + {{1 7/12}} = {{4 7/12}}.",
          "You changed both denominators to 12 but left the tops as 5 and 3. Scale each top too: {{5/6 = 10/12}} and {{3/4 = 9/12}}.",
        ],
        explanation:
          "Add the whole numbers and the fractions separately. Wholes: 2 + 1 = 3. Fractions: the LCM of 6 and 4 is 12, so {{5/6 + 3/4 = 10/12 + 9/12 = 19/12 = 1 7/12}}, and 3 + {{1 7/12}} = {{4 7/12}}. Check with improper fractions: {{17/6 + 7/4 = 34/12 + 21/12 = 55/12 = 4 7/12}} ✓",
        hints: [
          "Add the whole numbers first, then work out {{5/6 + 3/4}}.",
          "Use twelfths: {{5/6 = 10/12}}. What is {{3/4}} in twelfths? Is your fraction total more than 1?",
        ],
        strategy: "Find a common denominator",
        verify: "(2+5/6)+(1+3/4)",
      },
      {
        id: "fr-m3-q03",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "Work out {{1 1/5 × 2 1/3}}.",
        options: ["{{2 1/15}}", "{{18/35}}", "{{2/5}}", "{{2 4/5}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{2 1/15}} multiplies the wholes (1 × 2) and the fractions ({{1/5 × 1/3}}) separately. That misses the parts 1 × {{1/3}} and {{1/5}} × 2 (think of the grid method), so convert to improper fractions first.",
          "{{18/35}} comes from flipping {{7/3}} as if you were dividing. Only flip for ÷; for × just multiply tops and bottoms: {{6/5 × 7/3}}.",
          "{{2/5}} comes from turning {{1 1/5}} into {{2/5}} by adding the whole number to the top. One whole is 5 fifths, so {{1 1/5 = 6/5}} (and {{2 1/3 = 7/3}}).",
          "Convert first, then multiply: {{6/5 × 7/3 = 42/15 = 14/5 = 2 4/5}}.",
        ],
        explanation:
          "Mixed numbers must become improper fractions before you multiply: {{1 1/5 = 6/5}} and {{2 1/3 = 7/3}}. Multiply tops and bottoms: {{6/5 × 7/3 = 42/15}}, which simplifies (÷ 3) to {{14/5 = 2 4/5}}. Quicker: cancel the 6 with the 3 first, giving {{2/5 × 7/1 = 14/5}}. Estimate: 1.2 × 2.3 is about 2.8 ✓",
        hints: [
          "Before you multiply, what must you do to each mixed number?",
          "{{1 1/5 = 6/5}}. Write {{2 1/3}} as an improper fraction, then multiply tops and bottoms.",
        ],
        strategy: "Spot the common factor",
        verify: "(1+1/5)*(2+1/3)",
        source: "Class worksheet",
      },
      {
        id: "fr-m3-q04",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify {{17cf/(34c^2)}} fully.",
        options: ["{{f/2}}", "{{f/2c}}", "{{2f/c}}", "{{f/2c^2}}"],
        answerIndex: 1,
        optionFeedback: [
          "You cancelled the c on top with the whole of {{c^2}}. But {{c^2}} = c × c, so cancelling one c leaves one c on the bottom.",
          "17 goes into 34 twice, and the c on top cancels one of the two c's underneath, leaving {{f/2c}}.",
          "34 ÷ 17 = 2, but the 34 is on the bottom, so the 2 stays on the bottom: {{17/34 = 1/2}}, not 2.",
          "You crossed out the c on top without taking a c away from the bottom. Cancelling divides the top AND the bottom by c, so {{c^2}} becomes c.",
        ],
        explanation:
          "Write the top and the bottom as factors: {{(17 × c × f)/(2 × 17 × c × c)}}. Cancel the common factors 17 and c (divide the top and the bottom by 17c), which leaves {{f/(2 × c)}}, so {{17cf/(34c^2) = f/2c}}. Check with c = 2 and f = 4: the original is {{136/136 = 1}} and {{f/2c = 4/4 = 1}} ✓",
        hints: [
          "Write 34 as 2 × 17 and {{c^2}} as c × c.",
          "Cancel every factor that appears on both the top and the bottom. What is left?",
        ],
        strategy: "Spot the common factor",
        verify: "17cf/(34c^2)",
        source: "Class worksheet",
      },
      {
        id: "fr-m3-q05",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "Work out {{2 1/4 ÷ 3 1/2}}.",
        options: ["{{1 5/9}}", "{{7 7/8}}", "{{9/14}}", "{{1 1/6}}"],
        answerIndex: 2,
        optionFeedback: [
          "{{1 5/9}} comes from flipping the wrong fraction ({{4/9 × 7/2}}), which works out {{3 1/2 ÷ 2 1/4}} instead. Keep the first fraction and flip the second.",
          "{{7 7/8}} comes from multiplying {{9/4 × 7/2}} without flipping. Dividing by {{7/2}} means multiplying by {{2/7}}.",
          "Keep, Change, Flip: {{9/4 × 2/7 = 18/28 = 9/14}}.",
          "{{1 1/6}} comes from dividing the whole numbers (2 ÷ 3 = {{2/3}}) and the fractions ({{1/4 ÷ 1/2 = 1/2}}) separately, then adding. Convert both mixed numbers to improper fractions first.",
        ],
        explanation:
          "Convert to improper fractions first: {{2 1/4 = 9/4}} and {{3 1/2 = 7/2}}. Then Keep, Change, Flip: {{9/4 ÷ 7/2 = 9/4 × 2/7 = 18/28 = 9/14}}. Sense check: {{2 1/4}} is smaller than {{3 1/2}}, so the answer must be less than 1 ✓",
        hints: [
          "Change both mixed numbers into improper fractions first.",
          "{{9/4 ÷ 7/2}}: keep the first fraction, change ÷ to × and flip the second.",
        ],
        strategy: "Estimate first",
        verify: "(2+1/4)/(3+1/2)",
        source: "Class worksheet",
      },
      {
        id: "fr-m3-q06",
        topic: "fr",
        section: "fr-problems",
        difficulty: "core",
        question: "Work out {{1/3 - (1/3 × 1/3) + (1/3 ÷ 1/3)}}.",
        options: ["{{1 2/9}}", "{{2/9}}", "{{1/3}}", "{{-7/9}}"],
        answerIndex: 0,
        optionFeedback: [
          "Brackets first: {{1/3 × 1/3 = 1/9}} and {{1/3 ÷ 1/3 = 1}}. Then {{1/3 - 1/9 + 1 = 2/9 + 1 = 1 2/9}}.",
          "{{2/9}} treats {{1/3 ÷ 1/3}} as 0. A number divided by itself is 1 (a third fits into a third exactly once); it's subtracting that gives 0.",
          "{{1/3}} comes from working out {{1/3 ÷ 1/3}} as {{1/9}}, as if it were ×. Keep, Change, Flip: {{1/3 × 3/1 = 1}}.",
          "{{-7/9}} comes from adding before subtracting: {{1/3 - (1/9 + 1)}}. Addition and subtraction have equal priority, so go left to right: {{1/3 - 1/9}} first, then add 1.",
        ],
        explanation:
          "Brackets first: {{1/3 × 1/3 = 1/9}}, and {{1/3 ÷ 1/3 = 1}} because any number (except 0) divided by itself is 1. Then work left to right: {{1/3 - 1/9 = 3/9 - 1/9 = 2/9}}, and {{2/9 + 1 = 1 2/9}}.",
        hints: [
          "Work out the two brackets first. How many thirds fit into one third?",
          "Now go left to right: {{1/3 - 1/9}} first (use ninths), then add the second bracket.",
        ],
        strategy: "Find a common denominator",
        verify: "1/3-(1/3*1/3)+(1/3)/(1/3)",
        source: "Class worksheet",
      },
      {
        id: "fr-m3-q07",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "core",
        question: "Which fraction is exactly halfway between {{2/3}} and {{3/4}}?",
        options: ["{{5/7}}", "{{17/12}}", "{{1/24}}", "{{17/24}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{5/7}} comes from adding the tops and adding the bottoms. It does lie between {{2/3}} and {{3/4}}, but not exactly halfway, so use a common denominator instead.",
          "{{17/12}} is the **sum** {{2/3 + 3/4}}. For the halfway point you still need to halve it: {{17/12 ÷ 2 = 17/24}}.",
          "{{1/24}} is half of the gap between them. Add it on to the smaller fraction: {{16/24 + 1/24 = 17/24}}.",
          "{{2/3 = 16/24}} and {{3/4 = 18/24}}, and 17 is exactly halfway between 16 and 18.",
        ],
        explanation:
          "Rewrite both with a common denominator: {{2/3 = 8/12}} and {{3/4 = 9/12}}. There is no whole number between 8 and 9, so double the denominator: {{16/24}} and {{18/24}}. Halfway between them is {{17/24}}. Check: the mean is {{(2/3 + 3/4) ÷ 2 = 17/12 ÷ 2 = 17/24}} ✓",
        hints: [
          "Write both fractions with the same denominator. Is there a whole number between the two numerators?",
          "If not, double the denominator: twelfths become twenty-fourths.",
        ],
        strategy: "Find a common denominator",
        verify: "(2/3+3/4)/2",
      },
      {
        id: "fr-m3-q08",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "challenge",
        question: "Two fractions add up to 1. The difference between them is {{1/6}}. What is the larger fraction?",
        options: ["{{5/12}}", "{{7/12}}", "{{7/6}}", "{{5/6}}"],
        answerIndex: 1,
        optionFeedback: [
          "{{5/12}} is the **smaller** fraction. Check: {{7/12 - 5/12 = 2/12 = 1/6}}, and the question asks for the larger one.",
          "Take the {{1/6}} difference off the total: {{1 - 1/6 = 5/6}} is two equal parts of {{5/12}}. The larger fraction is {{5/12 + 2/12 = 7/12}}.",
          "{{7/6}} is the total plus the difference, {{1 + 1/6}}. That's **two** copies of the larger fraction, so halve it.",
          "{{5/6}} is {{1 - 1/6}}, what's left after removing the difference. That's two copies of the smaller fraction: halve it, then add the {{1/6}} back on.",
        ],
        explanation:
          "Draw a bar model: the larger fraction is the smaller one plus an extra {{1/6}}. Take that extra away from the total: {{1 - 1/6 = 5/6}} is two equal bars, so the smaller fraction is {{5/6 ÷ 2 = 5/12}}. The larger is {{5/12 + 2/12 = 7/12}}. Check: {{7/12 + 5/12 = 1}} and {{7/12 - 5/12 = 2/12 = 1/6}} ✓",
        hints: [
          "Draw two bars: the larger fraction is the smaller one plus an extra {{1/6}}.",
          "Take the extra {{1/6}} away from the total of 1. What is left, and how many equal bars is that?",
          "Halve what is left to get the smaller fraction, then add the {{1/6}} back on.",
        ],
        strategy: "Use a bar model",
        verify: "(1+1/6)/2",
      },
      {
        id: "fr-m3-q09",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "Here are three identical rectangles, each crossed by the same two dashed lines. {{4/7}} of rectangle A is shaded and {{3/5}} of rectangle C is shaded. What fraction of rectangle B is shaded?",
        diagram: `<svg viewBox="0 0 440 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three identical rectangles A, B and C, each crossed by the same two dashed lines. In A everything below the upper line is shaded. In C everything above the lower line is shaded. In B only the strip between the two lines is shaded, marked with a question mark.">
<rect x="0" y="0" width="440" height="210" fill="#ffffff"/>
<rect x="30" y="90" width="100" height="80" fill="#c7d2fe"/>
<rect x="170" y="90" width="100" height="24" fill="#fde68a"/>
<rect x="310" y="30" width="100" height="84" fill="#bbf7d0"/>
<g stroke="#334155" stroke-width="1.5" stroke-dasharray="5 4">
<line x1="30" y1="90" x2="130" y2="90"/>
<line x1="30" y1="114" x2="130" y2="114"/>
<line x1="170" y1="90" x2="270" y2="90"/>
<line x1="170" y1="114" x2="270" y2="114"/>
<line x1="310" y1="90" x2="410" y2="90"/>
<line x1="310" y1="114" x2="410" y2="114"/>
</g>
<g fill="none" stroke="#1f2937" stroke-width="2">
<rect x="30" y="30" width="100" height="140"/>
<rect x="170" y="30" width="100" height="140"/>
<rect x="310" y="30" width="100" height="140"/>
</g>
<g font-family="sans-serif" font-size="14" font-weight="bold" fill="#1f2937" text-anchor="middle">
<text x="80" y="194">A</text>
<text x="220" y="194">B</text>
<text x="360" y="194">C</text>
<text x="220" y="107">?</text>
</g>
</svg>`,
        options: ["{{1 6/35}}", "{{1/35}}", "{{6/35}}", "{{29/35}}"],
        answerIndex: 2,
        optionFeedback: [
          "{{1 6/35}} is {{4/7 + 3/5}}. The two shaded parts together are more than one whole rectangle, so take away 1: the extra is the overlap, which is B's strip.",
          "{{1/35}} is the difference {{3/5 - 4/7}}. Subtracting the two shaded fractions doesn't give the strip; add them and take away the whole rectangle.",
          "{{4/7 + 3/5 = 41/35}}, which is {{6/35}} more than one whole rectangle. That overlap is exactly the strip shaded in B.",
          "{{29/35}} is the **unshaded** part of B ({{1 - 6/35}}). The question asks for the shaded strip.",
        ],
        explanation:
          "A is shaded from the bottom up to the upper line, and C is shaded from the top down to the lower line. Put together, they cover the whole rectangle once and the strip between the lines twice, so the strip is {{4/7 + 3/5 - 1 = 20/35 + 21/35 - 35/35 = 6/35}}. Check: the lower line is {{2/5}} of the way up, so the strip is {{4/7 - 2/5 = 20/35 - 14/35 = 6/35}} ✓",
        hints: [
          "Imagine laying C's shading on top of A's. What do they cover between them?",
          "{{4/7 + 3/5}} is more than 1. Which part of the rectangle has been counted twice?",
          "The part counted twice is B's strip. Work out {{4/7 + 3/5 - 1}} using 35ths.",
        ],
        strategy: "Draw a diagram",
        verify: "4/7+3/5-1",
        source: "Class worksheet",
      },
      {
        id: "fr-m3-q10",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "challenge",
        question: "A rectangle has area {{6x^2/5}}. One of its sides has length {{3x/10}}. Which expression gives the length of the other side?",
        options: ["{{9x^3/25}}", "{{4x}}", "{{1/4x}}", "{{4/x}}"],
        answerIndex: 1,
        optionFeedback: [
          "{{9x^3/25}} comes from **multiplying** the area by the side. Area = length × width, so to find the missing side you divide the area by the side you know.",
          "Other side = area ÷ side = {{6x^2/5 × 10/3x = 60x^2/15x = 4x}}.",
          "{{1/4x}} comes from dividing the wrong way round ({{3x/10 ÷ 6x^2/5}}). Divide the **area** by the side you know.",
          "You reached {{60x^2/15x}}, but {{x^2 ÷ x = x}} and that x stays on the **top**: the answer is 4x, not {{4/x}}.",
        ],
        explanation:
          "Area = length × width, so the missing side is area ÷ known side. Keep, Change, Flip: {{6x^2/5 ÷ 3x/10 = 6x^2/5 × 10/3x = 60x^2/15x}}. Cancel 15x: 60 ÷ 15 = 4 and {{x^2 ÷ x = x}}, so the other side is 4x. Check: {{4x × 3x/10 = 12x^2/10 = 6x^2/5}} ✓",
        hints: [
          "If you know the area of a rectangle and one side, how do you find the other side?",
          "You need {{6x^2/5 ÷ 3x/10}}. Keep the first fraction, change ÷ to × and flip the second.",
          "Simplify {{60x^2/15x}} by cancelling the numbers and the x's.",
        ],
        strategy: "Work backwards",
        verify: "(6x^2/5)/(3x/10)",
      },
    ],
  },
  // SET 4 — appended below
];
