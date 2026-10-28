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
        question: "In a survey of Year 8, {{1/3}} of the students walk to school, {{1/4}} cycle and {{1/6}} come by bus. The rest come by car. What fraction of the students come by car?",
        options: ["{{1/4}}", "{{10/13}}", "{{3/4}}", "{{5/12}}"],
        answerIndex: 0,
        optionFeedback: [
          "{{1/3 + 1/4 + 1/6 = 4/12 + 3/12 + 2/12 = 9/12 = 3/4}}, so {{1 - 3/4 = 1/4}} come by car.",
          "{{10/13}} comes from adding the tops and the bottoms ({{3/13}}) and taking that from 1. Thirds, quarters and sixths must be changed to twelfths before you add.",
          "{{3/4}} is the fraction who walk, cycle or take the bus. The question asks about **the rest**, so take it away from 1.",
          "{{5/12}} leaves out the bus group: {{1 - 1/3 - 1/4 = 5/12}}. Take away all three fractions: {{5/12 - 1/6 = 3/12 = 1/4}}.",
        ],
        explanation:
          "First add the fractions you know, using twelfths: {{1/3 + 1/4 + 1/6 = 4/12 + 3/12 + 2/12 = 9/12 = 3/4}}. The whole year group is 1, so the car group is {{1 - 3/4 = 1/4}}. Check: {{4/12 + 3/12 + 2/12 + 3/12 = 12/12}}, the whole year ✓",
        hints: [
          "What fraction walk, cycle or take the bus altogether? Use a common denominator.",
          "The whole year group is 1. Take away the fraction you found.",
        ],
        strategy: "Find a common denominator",
        verify: "1-(1/3+1/4+1/6)",
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
          "{{2/5}} comes from adding each whole number to the top: {{1 1/5}} becomes {{2/5}} and {{2 1/3}} becomes {{3/3}} = 1. One whole is 5 fifths, so {{1 1/5 = 6/5}} (and {{2 1/3 = 7/3}}).",
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
        question: "What number is the arrow pointing to?",
        diagram: `<svg viewBox="0 0 480 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A number line from 2 to 3 divided into 8 equal parts. An arrow points to the 6th mark after 2.">
<rect x="0" y="0" width="480" height="120" fill="#ffffff"/>
<g stroke="#1f2937" stroke-width="2">
<line x1="40" y1="70" x2="440" y2="70"/>
<line x1="40" y1="56" x2="40" y2="84"/>
<line x1="440" y1="56" x2="440" y2="84"/>
<line x1="90" y1="62" x2="90" y2="78"/>
<line x1="140" y1="62" x2="140" y2="78"/>
<line x1="190" y1="62" x2="190" y2="78"/>
<line x1="240" y1="62" x2="240" y2="78"/>
<line x1="290" y1="62" x2="290" y2="78"/>
<line x1="340" y1="62" x2="340" y2="78"/>
<line x1="390" y1="62" x2="390" y2="78"/>
<line x1="340" y1="14" x2="340" y2="46"/>
</g>
<polygon points="340,58 333,45 347,45" fill="#1f2937"/>
<g font-family="sans-serif" font-size="16" fill="#1f2937" text-anchor="middle">
<text x="40" y="104">2</text>
<text x="440" y="104">3</text>
</g>
</svg>`,
        options: ["{{2 6/7}}", "{{3/4}}", "{{2 3/5}}", "{{2 3/4}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{2 6/7}} comes from counting the 7 small marks instead of the 8 gaps. Count the spaces: there are 8 equal parts, so each one is {{1/8}}.",
          "The arrow is {{3/4}} of the way from 2 to 3, but the line starts at 2, not 0. Add the whole number: {{2 3/4}}.",
          "{{2 3/5}} treats each mark as 0.1, like a ruler marked in tenths. There are only 8 equal parts between 2 and 3, so each one is {{1/8}}.",
          "8 equal gaps make each one {{1/8}}. The arrow is 6 gaps past 2: {{2 6/8 = 2 3/4}}.",
        ],
        explanation:
          "Count the gaps, not the marks: there are 8 equal gaps between 2 and 3, so each gap is {{1/8}}. The arrow is 6 gaps past 2, so it points to {{2 6/8}}. Simplify by dividing the top and bottom by 2: {{6/8 = 3/4}}, so the answer is {{2 3/4}}.",
        hints: [
          "How many equal gaps (not marks) are there between 2 and 3?",
          "Each gap is {{1/8}}. How many gaps past 2 is the arrow, and can that fraction be simplified?",
        ],
        strategy: "Draw a diagram",
        verify: "2+6/8",
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
          "{{1 6/35}} is {{4/7 + 3/5}}. The two shaded parts together are more than one whole rectangle, so take away 1: the extra is the overlap, which is rectangle B's strip.",
          "{{1/35}} is the difference {{3/5 - 4/7}}. Subtracting the two shaded fractions doesn't give the strip; add them and take away the whole rectangle.",
          "{{4/7 + 3/5 = 41/35}}, which is {{6/35}} more than one whole rectangle. That overlap is exactly the strip shaded in rectangle B.",
          "{{29/35}} is the **unshaded** part of rectangle B ({{1 - 6/35}}). The question asks for the shaded strip.",
        ],
        explanation:
          "Rectangle A is shaded from the bottom up to the upper line, and rectangle C is shaded from the top down to the lower line. Put together, they cover the whole rectangle once and the strip between the lines twice, so the strip is {{4/7 + 3/5 - 1 = 20/35 + 21/35 - 35/35 = 6/35}}. Check: the lower line is {{2/5}} of the way up, so the strip is {{4/7 - 2/5 = 20/35 - 14/35 = 6/35}} ✓",
        hints: [
          "Imagine laying rectangle C's shading on top of rectangle A's. What do they cover between them?",
          "{{4/7 + 3/5}} is more than 1. Which part of the rectangle has been counted twice?",
          "The part counted twice is rectangle B's strip. Work out {{4/7 + 3/5 - 1}} using 35ths.",
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
        question: "Work out the value of {{a/b × b/c × c/d × d/e}} when a = 6 and e = 2. The letters b, c and d stand for non-zero numbers that you are not told.",
        options: ["12", "3", "{{1/3}}", "It can't be found without knowing b, c and d"],
        answerIndex: 1,
        optionFeedback: [
          "12 is a × e. After cancelling, a is on the top and e is on the bottom, so divide: {{6/2 = 3}}.",
          "b, c and d each appear once on top and once underneath, so they cancel and leave {{a/e = 6/2 = 3}}.",
          "{{1/3}} is {{e/a}}, which is upside down. a is on top of the first fraction and e is underneath the last one, so the product is {{a/e}}.",
          "You don't need them: b, c and d each appear once on top and once underneath, so they cancel whatever their values are.",
        ],
        explanation:
          "Multiply the tops and the bottoms: {{(a × b × c × d)/(b × c × d × e)}}. Each of b, c and d appears once on top and once underneath, so they cancel, leaving {{a/e}}. With a = 6 and e = 2 the value is {{6/2 = 3}}, whatever b, c and d are. Check with b = 5, c = 1 and d = 10: {{6/5 × 5/1 × 1/10 × 10/2 = 3}} ✓",
        hints: [
          "Write the product as one fraction: multiply all the tops and all the bottoms.",
          "Which letters appear on both the top and the bottom?",
          "Once they cancel, only a and e are left. Which one is on top?",
        ],
        strategy: "Spot the common factor",
        verify: "6/5*5/1*1/10*10/2",
      },
    ],
  },
  // ===========================================================================
  // SET 4 · Stretch & challenge  (warm-up 0 / core 5 / challenge 5)
  // ===========================================================================
  {
    id: "fr-mcq-4",
    title: "Set 4 · Stretch & challenge",
    subtitle: "Stretch problems: dividing by fractions, borrowing, magic squares, counterexamples, fraction patterns and dividing algebraic fractions",
    topic: "fr",
    questions: [
      {
        id: "fr-m4-q01",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "Work out {{3 ÷ 2/5}}.",
        options: ["{{1 1/5}}", "{{7 1/2}}", "{{2/15}}", "15"],
        answerIndex: 1,
        optionFeedback: [
          "{{1 1/5}} is {{3 × 2/5 = 6/5}}: you multiplied without flipping. Dividing by {{2/5}} means multiplying by {{5/2}}.",
          "Keep, Change, Flip: {{3/1 × 5/2 = 15/2 = 7 1/2}}.",
          "{{2/15}} comes from flipping the 3 (to {{1/3}}) instead of the {{2/5}}. Keep the first number and flip the one you are dividing by.",
          "15 is the number of fifths in 3 wholes. Each group of {{2/5}} uses two of those fifths, so there are 15 ÷ 2 = {{7 1/2}} groups.",
        ],
        explanation:
          "Dividing by a fraction is the same as multiplying by its reciprocal: {{3 ÷ 2/5 = 3/1 × 5/2 = 15/2 = 7 1/2}}. Picture it: 3 wholes contain 15 fifths, and each {{2/5}} uses 2 of them, so {{7 1/2}} groups fit. Sense check: dividing by a number less than 1 gives an answer bigger than 3 ✓",
        hints: [
          "How many fifths are there in 3 wholes?",
          "Each {{2/5}} uses two of those fifths. How many groups can you make? (Or use Keep, Change, Flip.)",
        ],
        strategy: "Draw a diagram",
        verify: "3/(2/5)",
        source: "Class worksheet",
      },
      {
        id: "fr-m4-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "A jug holds {{5 1/3}} litres of lemonade. Wei Ling pours out {{2 3/4}} litres. How many litres are left in the jug?",
        options: ["{{3 5/12}}", "{{3 7/12}}", "{{2 5/12}}", "{{2 7/12}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{3 5/12}} comes from taking the smaller fraction from the bigger one ({{9/12 - 4/12}}) to avoid borrowing. A subtraction can't be swapped round, so borrow 1 whole instead.",
          "You borrowed 1 whole to get {{16/12 - 9/12 = 7/12}}, but forgot to take it off the 5. The wholes become 4 − 2 = 2.",
          "Wholes first gives 5 − 2 = 3, and then you must take away {{5/12}} more. 3 − {{5/12}} is 2 and {{7/12}} (a whole is {{12/12}}, and 12 − 5 = 7), not 2 and {{5/12}}.",
          "Borrow a whole: {{5 4/12 - 2 9/12 = 4 16/12 - 2 9/12 = 2 7/12}}.",
        ],
        explanation:
          "Use twelfths: {{5 1/3 = 5 4/12}} and {{2 3/4 = 2 9/12}}. You can't take 9 twelfths from 4 twelfths, so borrow a whole: {{5 4/12 = 4 16/12}}, and {{4 16/12 - 2 9/12 = 2 7/12}}. Check with improper fractions: {{64/12 - 33/12 = 31/12 = 2 7/12}} ✓",
        hints: [
          "Write both fractions as twelfths. Can you take {{9/12}} away from {{4/12}}?",
          "Borrow 1 whole from the 5: {{5 4/12 = 4 16/12}}.",
        ],
        strategy: "Find a common denominator",
        verify: "(5+1/3)-(2+3/4)",
      },
      {
        id: "fr-m4-q03",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify {{4m/(3n) × 9n^2/(2m^2)}}.",
        options: ["{{6n/m}}", "{{6mn}}", "{{6}}", "{{8m^3/27n^3}}"],
        answerIndex: 0,
        optionFeedback: [
          "Multiply to get {{(36mn^2)/(6m^2n)}}, then cancel the common factor 6mn: {{6n/m}}.",
          "You put both leftover letters on top. {{n^2}} over n leaves n on the top, but m over {{m^2}} leaves m on the **bottom**.",
          "{{6}} cancels the letters completely. One n is left on top (from {{n^2}}) and one m is left underneath (from {{m^2}}).",
          "{{8m^3/27n^3}} comes from flipping {{9n^2/2m^2}}, but flipping is only for ÷. For × just multiply the tops and the bottoms.",
        ],
        explanation:
          "Multiply the tops and the bottoms: {{4m/3n × 9n^2/2m^2 = (36mn^2)/(6m^2n)}}. Cancel the common factor 6mn: 36 ÷ 6 = 6, {{n^2 ÷ n = n}} stays on top and {{m^2 ÷ m = m}} stays on the bottom, giving {{6n/m}}. Quicker: cancel before multiplying (4 with 2, 9 with 3, m with {{m^2}}, n with {{n^2}}) to get {{2/1 × 3n/m = 6n/m}}.",
        hints: [
          "Multiply the tops together and the bottoms together.",
          "Cancel the numbers, then deal with each letter. Where does the leftover m go? And the leftover n?",
        ],
        strategy: "Spot the common factor",
        verify: "4m/(3n)*9n^2/(2m^2)",
        source: "Class worksheet",
      },
      {
        id: "fr-m4-q04",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "core",
        question: "Which of these fractions is closest to {{1/2}}?",
        options: ["{{5/9}}", "{{4/7}}", "{{7/15}}", "{{6/11}}"],
        answerIndex: 2,
        optionFeedback: [
          "{{5/9}} is half a ninth above {{1/2}} ({{5/9 - 1/2 = 1/18}}). Ninths are bigger pieces than fifteenths, so this gap is bigger.",
          "{{4/7}} is the furthest away: half a seventh, {{1/14}}, above {{1/2}}. Sevenths are the biggest pieces in the list.",
          "Half of 15 is 7.5, so {{7/15}} is only half a fifteenth, {{1/30}}, below {{1/2}}: the smallest gap of the four.",
          "{{6/11}} is close ({{1/22}} above {{1/2}}), but {{7/15}} is closer. Did you rule out {{7/15}} because it is *below* a half? Distance counts both ways.",
        ],
        explanation:
          "Compare each numerator with half its denominator: half of 9 is 4.5, half of 7 is 3.5, half of 15 is 7.5 and half of 11 is 5.5. Every numerator is exactly half a piece away, so the gaps from {{1/2}} are {{1/18}}, {{1/14}}, {{1/30}} and {{1/22}}. The smallest pieces give the smallest gap, so {{7/15}} is closest.",
        hints: [
          "What is half of each denominator? How far is each numerator from it?",
          "Each fraction is exactly half a piece away from {{1/2}}. Which fraction has the smallest pieces?",
        ],
        strategy: "Look at the differences",
        verify: "1/2-1/(2*15)",
      },
      {
        id: "fr-m4-q05",
        topic: "fr",
        section: "fr-problems",
        difficulty: "core",
        question: "In this magic square, every row, every column and both diagonals add up to the same total. Some squares are empty. What number goes in the square marked P?",
        diagram: `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 3 by 3 fraction magic square. Top row: 1 and a half, P, 1 and a third. Middle row: 1 and five sixths, 2, 2 and one sixth. Bottom row: empty, five sixths, empty.">
<rect x="0" y="0" width="320" height="210" fill="#ffffff"/>
<rect x="115" y="8" width="90" height="64" fill="#fde68a"/>
<rect x="25" y="8" width="270" height="192" fill="none" stroke="#1f2937" stroke-width="2"/>
<g stroke="#1f2937" stroke-width="1.5">
<line x1="115" y1="8" x2="115" y2="200"/>
<line x1="205" y1="8" x2="205" y2="200"/>
<line x1="25" y1="72" x2="295" y2="72"/>
<line x1="25" y1="136" x2="295" y2="136"/>
<line x1="72" y1="40" x2="86" y2="40"/>
<line x1="252" y1="40" x2="266" y2="40"/>
<line x1="72" y1="104" x2="86" y2="104"/>
<line x1="252" y1="104" x2="266" y2="104"/>
<line x1="153" y1="168" x2="167" y2="168"/>
</g>
<g font-family="sans-serif" fill="#1f2937">
<g font-size="18" text-anchor="end">
<text x="67" y="46">1</text>
<text x="247" y="46">1</text>
<text x="67" y="110">1</text>
<text x="247" y="110">2</text>
</g>
<g font-size="13" text-anchor="middle">
<text x="79" y="36">1</text>
<text x="79" y="54">2</text>
<text x="259" y="36">1</text>
<text x="259" y="54">3</text>
<text x="79" y="100">5</text>
<text x="79" y="118">6</text>
<text x="259" y="100">1</text>
<text x="259" y="118">6</text>
<text x="160" y="164">5</text>
<text x="160" y="182">6</text>
</g>
<g font-size="18" text-anchor="middle">
<text x="160" y="46" font-weight="bold">P</text>
<text x="160" y="110">2</text>
</g>
</g>
</svg>`,
        options: ["{{2 5/6}}", "{{3 5/6}}", "{{3 3/5}}", "{{3 1/6}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{2 5/6}} is {{1 1/2 + 1 1/3}}, the two numbers already in P's row. You still need to take that away from the magic total, 6.",
          "{{3 5/6}} is a borrowing slip: 6 − 2 − {{5/6}} = 4 − {{5/6}}, and taking {{5/6}} from a whole leaves {{1/6}}, not {{5/6}}. So P = {{3 1/6}}.",
          "{{3 3/5}} comes from adding tops and bottoms: {{1 1/2 + 1 1/3}} is not {{2 2/5}}. In sixths it is {{1 3/6 + 1 2/6 = 2 5/6}}, and 6 − {{2 5/6}} = {{3 1/6}}.",
          "The full middle row gives the magic total: {{1 5/6 + 2 + 2 1/6 = 6}}. Down the middle column, P = 6 − 2 − {{5/6}} = {{3 1/6}}.",
        ],
        explanation:
          "First find the magic total from a line with no gaps. The middle row is complete: {{1 5/6 + 2 + 2 1/6}} = 5 + {{6/6}} = 6. P's column also contains 2 and {{5/6}}, so P = 6 − 2 − {{5/6}} = {{3 1/6}}. Check with the top row: {{1 3/6 + 3 1/6 + 1 2/6 = 5 6/6 = 6}} ✓",
        hints: [
          "Find a row, column or diagonal with no gaps. What is its total?",
          "Every line has that same total. Which line through P has only one gap?",
        ],
        strategy: "Work backwards",
        verify: "((1+5/6)+2+(2+1/6))-2-5/6",
        source: "Class worksheet",
      },
      {
        id: "fr-m4-q06",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "challenge",
        question: "Arjun takes a proper fraction (a positive fraction less than 1) and adds 1 to **both** its numerator and its denominator. For example, {{2/5}} becomes {{3/6}}. What happens to the size of the fraction?",
        options: ["It always stays the same.", "It always gets bigger.", "It always gets smaller.", "It can get bigger or smaller."],
        answerIndex: 1,
        optionFeedback: [
          "That's true when you **multiply** the top and bottom by the same number, not when you add. {{2/5}} is 0.4 but {{3/6}} is 0.5.",
          "A proper fraction is a few pieces short of 1. Adding 1 to the top and bottom keeps the same number of pieces missing, but each piece is smaller, so the fraction moves closer to 1.",
          "The bigger denominator alone would make it smaller, but the numerator grows too. Test it: {{1/2}} becomes {{2/3}} and {{3/4}} becomes {{4/5}}, both bigger.",
          "It can go down for fractions **bigger** than 1 ({{3/2}} becomes {{4/3}}), but for a proper fraction it goes up every time.",
        ],
        explanation:
          "Look at how far the fraction is from 1. {{3/4}} is {{1/4}} short of 1, but {{4/5}} is only {{1/5}} short. In general, a proper fraction that is k pieces short of 1 is still k pieces short after adding 1 to the top and bottom, but the pieces are smaller, so the gap shrinks and the fraction always gets bigger.",
        hints: [
          "Try some examples: {{1/2}}, {{3/4}}, {{2/5}}, {{9/10}}. What happens each time?",
          "Compare each fraction with 1. How much is missing before, and how much after?",
          "{{3/4}} is a quarter short of 1. How far short of 1 is {{4/5}}? Will that always happen?",
        ],
        strategy: "Try small cases",
      },
      {
        id: "fr-m4-q07",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "challenge",
        question: "Work out {{1/2 ÷ 1/4 ÷ 1/8}}.",
        options: ["16", "{{1/4}}", "{{1/64}}", "64"],
        answerIndex: 0,
        optionFeedback: [
          "Left to right: {{1/2 ÷ 1/4 = 2}}, then {{2 ÷ 1/8 = 16}}.",
          "{{1/4}} comes from working right to left: {{1/4 ÷ 1/8 = 2}} first, then {{1/2 ÷ 2}}. Divisions in a row are done from left to right.",
          "{{1/64}} comes from multiplying all three fractions. Dividing by {{1/4}} means multiplying by 4, not by {{1/4}}.",
          "64 comes from flipping all three fractions, including the first. Keep the first fraction and only flip the ones you divide by: {{1/2 × 4 × 8}}.",
        ],
        explanation:
          "Divisions in a row are worked out from left to right, and dividing by a fraction means multiplying by its reciprocal. {{1/2 ÷ 1/4 = 1/2 × 4 = 2}} (two quarters fit into a half), then {{2 ÷ 1/8 = 2 × 8 = 16}} (sixteen eighths fit into 2). In one line: {{1/2 × 4/1 × 8/1 = 16}}. Sense check: dividing by numbers less than 1 makes the answer bigger, so it must be more than {{1/2}} ✓",
        hints: [
          "Work from left to right. How many quarters fit into a half?",
          "Now divide that answer by {{1/8}}. How many eighths fit into it?",
          "Only the fractions you divide BY get flipped; the first one stays as it is.",
        ],
        strategy: "Estimate first",
        verify: "1/2/(1/4)/(1/8)",
      },
      {
        id: "fr-m4-q08",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "Siti says: “If a > b, then {{1/a > 1/b}}.” Here a and b are positive numbers. Is Siti's statement true?",
        options: [
          "Yes: a bigger number on the bottom makes a bigger fraction.",
          "Yes: try a = 3 and b = 2, and {{1/3}} is bigger than {{1/2}}.",
          "No: a = 2 and b = 1 give {{1/a = 1/2}}, less than {{1/b = 1}}.",
          "No: a = 1 and b = 2 give {{1/a = 1}}, more than {{1/b = 1/2}}.",
        ],
        answerIndex: 2,
        optionFeedback: [
          "This mixes up the size of the denominator with the size of the fraction. Sharing 1 between more people gives each a **smaller** share: {{1/3}} is less than {{1/2}}.",
          "{{1/3}} is less than {{1/2}}: a third of a pizza is smaller than a half. So this example actually shows the statement is false.",
          "One counterexample is enough: a > b is true (2 > 1), but {{1/2}} is less than 1, so the 'then' part fails.",
          "Here a is **smaller** than b, so this example doesn't test the statement. A counterexample must make the 'if' part (a > b) true and the 'then' part false.",
        ],
        explanation:
          "To show a statement is false, you need one **counterexample**: numbers that make the 'if' part true but the 'then' part false. With a = 2 and b = 1, a > b, but {{1/a = 1/2}} is less than {{1/b = 1}}. In fact, for positive numbers it is always the other way round: dividing 1 by a bigger number gives a smaller answer, so {{1/a < 1/b}}.",
        hints: [
          "Choose some actual numbers for a and b, with a bigger than b.",
          "Which is bigger: one pizza shared between 2 people, or a whole pizza for 1 person?",
          "A counterexample must make 'a > b' true. Check that your numbers do.",
        ],
        strategy: "Try small cases",
        source: "Class worksheet",
      },
      {
        id: "fr-m4-q09",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "challenge",
        question: "Work out {{1/2 + 1/6 + 1/12 + 1/20 + 1/30}}.",
        options: ["{{1/14}}", "{{1/6}}", "{{4/5}}", "{{5/6}}"],
        answerIndex: 3,
        optionFeedback: [
          "{{1/14}} = {{5/70}} comes from adding all the tops and all the bottoms. Fractions can only be added once their denominators match.",
          "{{1/6}} = {{5/30}} comes from adding the tops (1 + 1 + 1 + 1 + 1) and keeping the biggest denominator, 30. The tops must be scaled up to a common denominator, and 30 won't do (12 and 20 don't go into it): use 60, so {{1/2 = 30/60}}.",
          "{{4/5}} is the running total after only four of the fractions. You still need to add {{1/30}}: {{4/5 + 1/30 = 24/30 + 1/30 = 5/6}}.",
          "The running totals go {{1/2}}, {{2/3}}, {{3/4}}, {{4/5}}, {{5/6}}: five fractions give {{5/6}}.",
        ],
        explanation:
          "Add one fraction at a time and watch the running total: {{1/2}}, then {{2/3}}, then {{3/4}}, then {{4/5}}, then {{5/6}}. For example, {{2/3 + 1/12 = 8/12 + 1/12 = 9/12 = 3/4}}. Check with the LCM, 60: {{30/60 + 10/60 + 5/60 + 3/60 + 2/60 = 50/60 = 5/6}} ✓",
        hints: [
          "Add the first two fractions. Then add the third to your answer. What do you notice?",
          "The running totals start {{2/3}}, {{3/4}}, … What comes next?",
          "Each denominator is two consecutive numbers multiplied together: 2 = 1 × 2, 6 = 2 × 3, 12 = 3 × 4, …",
        ],
        strategy: "Find a pattern",
        verify: "1/2+1/6+1/12+1/20+1/30",
      },
      {
        id: "fr-m4-q10",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "challenge",
        question: "Simplify {{8p^2/(3q) ÷ 4p/(9q^2)}}.",
        options: ["{{6pq}}", "{{32p^3/27q^3}}", "{{1/6pq}}", "{{6p^3/q^3}}"],
        answerIndex: 0,
        optionFeedback: [
          "Keep, Change, Flip: {{8p^2/3q × 9q^2/4p = (72p^2q^2)/(12pq) = 6pq}}.",
          "{{32p^3/27q^3}} comes from multiplying straight across without flipping. To divide, flip the second fraction first.",
          "{{1/6pq}} comes from flipping the **first** fraction instead of the second, which works out {{4p/9q^2 ÷ 8p^2/3q}}. Keep the first and flip the second.",
          "{{6p^3/q^3}} comes from flipping only the numbers (4 and 9) and leaving p and {{q^2}} where they were. The whole fraction flips: {{4p/9q^2}} becomes {{9q^2/4p}}.",
        ],
        explanation:
          "Keep the first fraction, change ÷ to × and flip the second: {{8p^2/3q × 9q^2/4p}}. Multiply the tops and the bottoms to get {{(72p^2q^2)/(12pq)}}. Then cancel: 72 ÷ 12 = 6, {{p^2 ÷ p = p}} and {{q^2 ÷ q = q}}, which leaves 6pq.",
        hints: [
          "Dividing by a fraction means multiplying by its reciprocal. Which fraction do you flip?",
          "Work out {{8p^2/3q × 9q^2/4p}} by multiplying the tops and the bottoms.",
          "Cancel the numbers first, then the p's, then the q's.",
        ],
        strategy: "Spot the common factor",
        verify: "(8p^2/(3q))/(4p/(9q^2))",
        source: "Class worksheet",
      },
    ],
  },
];
