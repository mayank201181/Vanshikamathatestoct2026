import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 3, questions 11–20. See docs/papers-blueprint.md. */
export const P3_B: QA[] = [
  // Q11 · expand and simplify a difference of brackets (2 marks)
  {
    id: "p3-q11",
    topic: "ex",
    section: "ex-expand",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{4(a - 6) - 3(2a - 5)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "-2a-9", form: "simplified", display: "{{-2a - 9}}" },
        verify: "4(a-6)-3(2a-5)",
        traps: [
          {
            spec: { type: "expression", expr: "-2a-39" },
            feedback: "−3 × (−5) = **+15**, not −15: a negative times a negative is positive. So the numbers are −24 + 15 = −9.",
          },
          {
            spec: { type: "expression", expr: "10a-9" },
            feedback: "−3 × 2a = **−6a**, not +6a. Keep the minus sign with the 3, so the a terms are 4a − 6a = −2a.",
          },
          {
            spec: { type: "expression", expr: "-2a+9" },
            feedback: "Check the numbers: 4 × (−6) = −24 and −3 × (−5) = +15. Then −24 + 15 = −9, not +9.",
          },
          {
            spec: { type: "expression", expr: "2a-9" },
            feedback: "Check the a terms: 4a − 6a = −2a, not 2a. Taking 6 lots of a away from 4 lots of a leaves −2 lots.",
          },
          {
            spec: { type: "expression", expr: "-2a-29" },
            feedback: "Multiply **both** terms in the second bracket by −3: −3 × 2a = −6a and −3 × (−5) = +15. So the numbers are −24 + 15 = −9.",
          },
        ],
      },
    ],
    hints: [
      "Expand each bracket on its own first. The −3 belongs to the second bracket, so multiply both 2a and −5 by −3.",
      "A negative times a negative is positive. Then collect the a terms and the number terms separately.",
    ],
    solution: [
      "Expand the first bracket. Multiply both terms by 4:\n\n    4 × a = 4a\n    4 × (−6) = −24",
      "Expand the second bracket. Multiply both terms by −3 (the minus sign stays with the 3):\n\n    −3 × 2a = −6a\n    −3 × (−5) = +15",
      "Write the four terms in a row, then collect like terms. Each step goes on a new line:\n\n    4a − 24 − 6a + 15\n    = 4a − 6a − 24 + 15\n    = −2a − 9",
      "Answer: **−2a − 9** (writing −9 − 2a is also correct).",
      "Check by putting a = 1 into the question and into your answer:\n\n    4(1 − 6) − 3(2 − 5)\n    = −20 + 9\n    = −11\n\n    −2 × 1 − 9 = −11 ✓",
    ],
    commonError:
      "A sign slip in the second bracket: −3 × (−5) is +15, not −15 (that gives −2a − 39), and −3 × 2a is −6a, not +6a.",
    strategy: "Check by substituting",
  },

  // Q12 · increase by more than 100% (2 marks)
  {
    id: "p3-q12",
    topic: "pc",
    section: "pc-change",
    difficulty: "warmup",
    question: "Increase $90 by 300%",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 360, display: "$360" },
        verify: "90+90*300/100",
        traps: [
          {
            spec: { type: "number", value: 270 },
            feedback: "$270 is 300% **of** $90, which is only the increase. Add it on to the $90 you started with.",
          },
          {
            spec: { type: "number", value: 117 },
            feedback: "× 1.3 is a 30% increase. An increase of 300% keeps the original 100% and adds 300%, so you end up with 400% of $90.",
          },
        ],
      },
    ],
    hints: [
      "An increase of 100% doubles an amount: you keep the original and add the same again. What does an increase of 300% add on?",
      "Work out 300% of $90, then add it on to the original $90.",
    ],
    solution: [
      "An increase of 300% keeps the original amount (100%) and adds 300% of it on top.",
      "Find the increase. 100% of $90 is $90, so 300% is 3 lots of $90:\n\n    3 × 90 = 270",
      "Add the increase on to the original amount:\n\n    90 + 270 = 360",
      "Answer: **$360**",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "100% + 300% = 400%",
        "400% as a decimal: 400 ÷ 100 = 4, so the multiplier is 4.",
        "90 × 4 = 360, so the answer is $360 ✓",
      ],
    },
    commonError:
      "Stopping at $270. That is 300% **of** $90 (the increase), not the new amount. An increase always adds on to the original 100%.",
    strategy: "Use the multiplier",
  },

  // Q13 · expand a pair of brackets (2 marks)
  {
    id: "p3-q13",
    topic: "ex",
    section: "ex-double",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{(2x + 1)(x + 4)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "2x^2+9x+4", form: "simplified", display: "{{2x^2 + 9x + 4}}" },
        verify: "(2x+1)(x+4)",
        traps: [
          {
            spec: { type: "expression", expr: "2x^2+4" },
            feedback: "You've missed the middle terms. A grid gives four terms: {{2x^2}}, +8x, +x and +4.",
          },
          {
            spec: { type: "expression", expr: "2x^2+8x+4" },
            feedback: "One middle term is missing: as well as 2x × 4 = 8x, there is 1 × x = x. Together they make 9x.",
          },
          {
            spec: { type: "expression", expr: "2x^2+9x+5" },
            feedback: "The last term is 1 × 4 = 4: multiply the two numbers, don't add them.",
          },
          {
            spec: { type: "expression", expr: "x^2+9x+4" },
            feedback: "Check the first box of the grid: 2x × x = {{2x^2}} (2 lots of {{x^2}}), not {{x^2}}.",
          },
        ],
      },
    ],
    hints: [
      "Draw a 2 × 2 grid: 2x and +1 along the top, x and +4 down the side.",
      "Fill in all four boxes, then collect the two x terms.",
    ],
    solution: [
      "Use the grid method:\n\n| × | 2x | +1 |\n|---|---|---|\n| x | {{2x^2}} | +x |\n| +4 | +8x | +4 |",
      "Write down the four terms from the grid:\n\n    {{2x^2 + x + 8x + 4}}",
      "Collect the x terms:\n\n    x + 8x = 9x",
      "Answer: **{{2x^2 + 9x + 4}}**",
      "Check by putting x = 1 into the question and into your answer:\n\n    (2 + 1)(1 + 4)\n    = 3 × 5\n    = 15\n\n    2 + 9 + 4 = 15 ✓",
    ],
    altMethod: {
      label: "FOIL (First, Outer, Inner, Last)",
      steps: [
        "First: 2x × x = {{2x^2}}",
        "Outer: 2x × 4 = 8x",
        "Inner: 1 × x = x",
        "Last: 1 × 4 = 4",
        "Collect: {{2x^2 + 8x + x + 4 = 2x^2 + 9x + 4}}. The grid makes it harder to miss a term.",
      ],
    },
    commonError:
      "Missing the middle terms and writing {{2x^2 + 4}}. Two brackets give four terms before you simplify: here x and 8x combine to make 9x.",
    strategy: "Use the grid method",
  },

  // Q14 · multiplier for an increase of 2½% (2 marks)
  {
    id: "p3-q14",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Ravi is asked to increase $940 by {{2 1/2}}%. Using a calculator, he multiplies 940 by a single number to get the correct answer. What single number does he use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 1.025 },
        verify: "1+(2+1/2)/100",
        traps: [
          {
            spec: { type: "number", value: 1.25 },
            feedback: "1.25 is the multiplier for a 25% increase. As a decimal, {{2 1/2}}% = 2.5% = 0.025 (divide by 100), not 0.25.",
          },
          {
            spec: { type: "number", value: 0.025 },
            feedback: "0.025 is only the {{2 1/2}}% that gets added on. To get the new amount in one step, Ravi needs 100% + 2.5% of the money.",
          },
          {
            spec: { type: "number", value: 102.5 },
            feedback: "102.5% is the right percentage, but the multiplier is a decimal: divide it by 100.",
          },
          {
            spec: { type: "number", value: 0.975 },
            feedback: "0.975 is the multiplier for a 2.5% **decrease**. Ravi is increasing the amount, so add the 2.5% on to 100%.",
          },
          {
            spec: { type: "number", value: 1.02 },
            feedback: "1.02 is the multiplier for a 2% increase: the {{1/2}}% has gone missing. {{1/2}}% = 0.005, so {{2 1/2}}% = 0.025 as a decimal.",
          },
          {
            spec: { type: "number", value: 1.03 },
            feedback: "1.03 is a 3% increase (or 1.025 rounded). A multiplier must be exact: {{2 1/2}}% = 2.5% = 0.025, so keep all three decimal places.",
          },
          {
            spec: { type: "number", value: 963.5 },
            feedback: "963.5 is the new amount after the increase. The question asks for the single number Ravi multiplies 940 by, not the answer he gets.",
          },
        ],
      },
    ],
    hints: [
      "Start from 100%. After the increase, what percentage of $940 does Ravi have?",
      "Divide that percentage by 100 to get a decimal. Careful with place value: 10% = 0.1, so 2.5% is less than 0.1.",
    ],
    solution: [
      "Ravi needs the original amount (100%) plus the increase ({{2 1/2}}% = 2.5%):\n\n    100% + 2.5% = 102.5%",
      "Change the percentage to a decimal by dividing by 100:\n\n    102.5 ÷ 100 = 1.025",
      "So he multiplies 940 by **1.025**.",
      "Check on a calculator, one line at a time:\n\n    940 × 1.025 = 963.5\n    940 × 0.025 = 23.5 (this is 2.5% of 940)\n    940 + 23.5 = 963.5 ✓",
    ],
    altMethod: {
      label: "Build the decimal from 1%",
      steps: [
        "1% = 0.01, so 2% = 0.02 and {{1/2}}% = 0.005.",
        "{{2 1/2}}% = 0.02 + 0.005 = 0.025",
        "An increase adds on to 1 (which is 100%): 1 + 0.025 = 1.025",
      ],
    },
    commonError:
      "Writing 1.25. {{2 1/2}}% is 0.025 as a decimal, not 0.25, so the multiplier is 1.025. (× 1.25 would be a 25% increase.)",
    strategy: "Use the multiplier",
  },

  // Q15 · multiplier for a decrease of 4% (2 marks)
  {
    id: "p3-q15",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Sofia is asked to decrease $760 by 4%. She multiplies 760 by a single number to get the correct answer. What single number does she use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 0.96 },
        verify: "1-4/100",
        traps: [
          {
            spec: { type: "number", value: 0.04 },
            feedback: "0.04 is the 4% that comes off. The multiplier is the part that is **left**: 100% − 4%.",
          },
          {
            spec: { type: "number", value: 0.6 },
            feedback: "4% = 0.04 as a decimal, not 0.4 (divide by 100). So the multiplier is 1 − 0.04.",
          },
          {
            spec: { type: "number", value: 1.04 },
            feedback: "1.04 is the multiplier for a 4% **increase**. For a decrease, take the 4% away from 100%.",
          },
          {
            spec: { type: "number", value: 96 },
            feedback: "96% is the right percentage, but the multiplier is a decimal: divide it by 100.",
          },
          {
            spec: { type: "number", value: 729.6 },
            feedback: "729.6 is the new amount after the decrease. The question asks for the single number Sofia multiplies 760 by, not the answer she gets.",
          },
        ],
      },
    ],
    hints: [
      "Start from 100%. After a 4% decrease, what percentage of $760 is left?",
      "Write that percentage as a decimal by dividing by 100.",
    ],
    solution: [
      "A decrease of 4% leaves:\n\n    100% − 4% = 96%",
      "Change the percentage to a decimal by dividing by 100:\n\n    96 ÷ 100 = 0.96",
      "So she multiplies 760 by **0.96**.",
      "Check, one line at a time:\n\n    760 × 0.96 = 729.6\n    760 × 0.04 = 30.4 (this is 4% of 760)\n    760 − 30.4 = 729.6 ✓",
    ],
    commonError:
      "Using 0.04 (the part taken off) or 0.6 (from writing 4% as 0.4). The multiplier is the part that is left: 96% = 0.96.",
    strategy: "Use the multiplier",
  },

  // Q16 · dividing algebraic fractions (3 marks)
  {
    id: "p3-q16",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "challenge",
    question: "Write the answer to this calculation in its simplest form: {{(16xy^2)/15}} ÷ {{(4x^2y)/9}}",
    parts: [
      {
        prompt: "Type the bottom of your fraction in brackets, e.g. 3/(4x).",
        marks: 3,
        answer: { type: "expression", expr: "12y/(5x)", form: "simplified", display: "{{(12y)/(5x)}}" },
        verify: "(16xy^2/15)/(4x^2y/9)",
        traps: [
          {
            spec: { type: "expression", expr: "12xy/5" },
            feedback:
              "This reads as {{(12xy)/5}}, with the x on top. The x belongs on the bottom, because {{x/x^2 = 1/x}}. If you typed 12y/5x, the computer reads it as {{12y/5}} × x: type the bottom in brackets, 12y/(5x).",
          },
          {
            spec: { type: "expression", expr: "(64x^3y^3)/135" },
            feedback: "You multiplied without flipping. To divide, Keep, Change, Flip: {{(16xy^2)/15 * 9/(4x^2y)}}.",
          },
          {
            spec: { type: "expression", expr: "5x/(12y)" },
            feedback: "That's upside down. Keep the **first** fraction as it is and flip the **second** one.",
          },
          {
            spec: { type: "expression", expr: "12y/5" },
            feedback: "Check the x's: there is one x on top and two underneath ({{x^2}} = x × x), so one x is left on the bottom.",
          },
        ],
      },
    ],
    hints: [
      "Dividing by a fraction is the same as multiplying by its reciprocal: Keep, Change, Flip.",
      "Multiply the tops and multiply the bottoms. Then cancel the numbers (use the HCF) and cancel the letters.",
      "x is on top once and underneath twice; y is on top twice and underneath once. Which side is each leftover letter on?",
    ],
    solution: [
      "Keep, Change, Flip: keep the first fraction, change ÷ to ×, flip the second fraction:\n\n    {{(16xy^2)/15 * 9/(4x^2y)}}",
      "Multiply the tops and multiply the bottoms, one line each:\n\n    top: {{16xy^2 * 9 = 144xy^2}}\n    bottom: {{15 * 4x^2y = 60x^2y}}",
      "So the answer so far is {{(144xy^2)/(60x^2y)}}.",
      "Cancel the numbers. The HCF of 144 and 60 is 12:\n\n    144 ÷ 12 = 12\n    60 ÷ 12 = 5",
      "Cancel the letters:\n\n    {{x/x^2 = 1/x}}, so one x is left on the bottom\n    {{y^2/y = y}}, so one y is left on the top",
      "Answer: **{{(12y)/(5x)}}**",
    ],
    altMethod: {
      label: "Cancel first, then multiply",
      steps: [
        "After flipping: {{(16xy^2)/15 * 9/(4x^2y)}}",
        "16 and 4 share a factor of 4: 16 ÷ 4 = 4 and 4 ÷ 4 = 1.",
        "9 and 15 share a factor of 3: 9 ÷ 3 = 3 and 15 ÷ 3 = 5.",
        "Numbers: 4 × 3 = 12 on top and 5 × 1 = 5 underneath.",
        "Letters: {{x/x^2 = 1/x}} and {{y^2/y = y}}, so the answer is {{(12y)/(5x)}} ✓ (smaller numbers, fewer slips).",
      ],
    },
    commonError:
      "Multiplying without flipping the second fraction, or putting a leftover letter on the wrong side: {{x/x^2}} leaves the x on the **bottom**, so the answer is {{(12y)/(5x)}}, not {{(12xy)/5}}.",
    strategy: "Spot the common factor",
  },

  // Q17 · changing ratio: find the total at the start (3 marks)
  {
    id: "p3-q17",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "Sam has a jar of marbles. Some of them are green, and the rest are yellow. He notices that {{3/5}} of the marbles are green. He takes out 18 green marbles. He observes that the ratio of green marbles to yellow marbles is now 3 : 4. How many marbles were in the jar at the start?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 60, display: "60 marbles" },
        verify: "5*(4*18)/(4*3-3*(5-3))",
        traps: [
          {
            spec: { type: "number", value: 24 },
            feedback: "24 is the number of yellow marbles. The question asks for the total number of marbles at the start.",
          },
          {
            spec: { type: "number", value: 36 },
            feedback: "36 is the number of green marbles at the start. Add on the yellow marbles to get the total.",
          },
          {
            spec: { type: "number", value: 42 },
            feedback: "42 is how many marbles are left after Sam takes 18 out. The question asks how many were in the jar at the start.",
          },
          {
            spec: { type: "number", value: 12 },
            feedback: "12 is the value of x. The total at the start is green + yellow = 3x + 2x = 5x.",
          },
          {
            spec: { type: "number", value: 270 },
            feedback:
              "Check your cross-multiplying: (3x − 18) : 2x = 3 : 4 means 4(3x − 18) = 3 × 2x. With 270 marbles the new ratio would be 144 : 108 = 4 : 3, the wrong way round.",
          },
        ],
      },
    ],
    hints: [
      "{{3/5}} of the marbles are green. What fraction are yellow? Write the ratio green : yellow at the start.",
      "Let green = 3x and yellow = 2x. Sam's 18 marbles come off the green only, so set up (3x − 18) : 2x = 3 : 4.",
      "Write the ratio as fractions and cross-multiply to find x. The question wants the total at the start: 3x + 2x.",
    ],
    solution: [
      "{{3/5}} of the marbles are green, so {{2/5}} are yellow. At the start:\n\n    green : yellow = 3 : 2",
      "Let green = 3x and yellow = 2x.",
      "Sam takes out 18 green marbles. The yellow marbles don't change:\n\n    green now = 3x − 18\n    yellow = 2x",
      "Set the new ratio equal to 3 : 4:\n\n    (3x − 18) : 2x = 3 : 4",
      "Write it as fractions and cross-multiply:\n\n    {{(3x - 18)/(2x) = 3/4}}\n    4(3x − 18) = 3 × 2x\n    12x − 72 = 6x",
      "Solve for x, one step per line:\n\n    12x − 6x = 72\n    6x = 72\n    x = 12",
      "The total at the start is 3x + 2x = 5x:\n\n    5 × 12 = 60",
      "Answer: **60 marbles** (36 green and 24 yellow).",
      "Check: 36 − 18 = 18 green and 24 yellow, and 18 : 24 = 3 : 4 ✓ (divide both by 6).",
    ],
    altMethod: {
      label: "Keep the yellow the same (a table of parts)",
      steps: [
        "The yellow marbles don't change, so make the yellow parts the same in both ratios.",
        "Start: green : yellow = 3 : 2 = 6 : 4 (double both parts).",
        "Now: green : yellow = 3 : 4",
        "Green went from 6 parts to 3 parts, so 3 parts = the 18 marbles Sam took out.",
        "1 part = 18 ÷ 3 = 6 marbles",
        "At the start there were 6 + 4 = 10 parts: 10 × 6 = 60 marbles ✓",
      ],
    },
    commonError:
      "Treating {{3/5}} as the ratio green : yellow = 3 : 5. It means 3 out of every 5 marbles are green, so green : yellow = 3 : 2. Then answer the question asked: the total at the start, not one colour.",
    strategy: "Introduce a variable",
  },

  // Q18 · quadratic sequence: next term and nth term (1 + 4 marks)
  {
    id: "p3-q18",
    topic: "sq",
    section: "sq-quadratic",
    difficulty: "challenge",
    question: "Here are the first six terms of a sequence: 2, 13, 32, 59, 94, 137.",
    parts: [
      {
        label: "a",
        prompt: "Find the next term in the sequence.",
        marks: 1,
        answer: { type: "number", value: 188 },
        verify: "137+(137-94)+((137-94)-(94-59))",
        traps: [
          {
            spec: { type: "number", value: 180 },
            feedback: "180 adds 43 again, as if the sequence were linear. The first differences go up by 8 each time, so the next one is 43 + 8 = 51.",
          },
          {
            spec: { type: "number", value: 145 },
            feedback: "8 is the second difference. Use it to find the next **first** difference (43 + 8), then add that to 137.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the nth term in this sequence.",
        marks: 4,
        answer: { type: "expression", expr: "4n^2-n-1", display: "{{4n^2 - n - 1}}" },
        verify: "terms:2,13,32,59,94,137",
        traps: [
          {
            spec: { type: "expression", expr: "4n^2-n-2" },
            feedback:
              "Check n = 1: 4 − 1 − 2 = 1, but the first term is 2. After subtracting {{4n^2}} the leftovers are −2, −3, −4, … Their zeroth term is −2 − (−1) = −1, so they are −n − 1.",
          },
          {
            spec: { type: "expression", expr: "4n^2+n-1" },
            feedback: "Check n = 1: 4 + 1 − 1 = 4, not 2. The leftovers −2, −3, −4, … go **down** by 1 each time, so the linear part is −n − 1.",
          },
          {
            spec: { type: "expression", expr: "4n^2" },
            feedback: "{{4n^2}} is only the first part. Subtract {{4n^2}} from each term and find the nth term of what's left.",
          },
          {
            spec: { type: "expression", expr: "8n^2" },
            feedback: "8 is the second difference, but the number in front of {{n^2}} is **half** of it: 8 ÷ 2 = 4. Start with {{4n^2}}, then subtract it from each term to find the rest of the rule.",
          },
          {
            spec: { type: "expression", expr: "11n-9" },
            feedback:
              "The first differences (11, 19, 27, …) aren't the same each time, so the sequence isn't linear. The second difference is constant, so it's quadratic: start with an {{n^2}} term.",
          },
        ],
      },
    ],
    hints: [
      "Work out the first differences, then the second differences.",
      "For (a), keep the second difference the same to get the next first difference. For (b), halve the second difference: that's the number in front of {{n^2}}.",
      "Subtract that many lots of {{n^2}} from each term. What's left is linear: find its nth term from its difference and its zeroth term.",
    ],
    solution: [
      "(a) Make a table of differences:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| term | 2 | 13 | 32 | 59 | 94 | 137 | **188** |\n| 1st difference | | +11 | +19 | +27 | +35 | +43 | +51 |\n| 2nd difference | | | +8 | +8 | +8 | +8 | +8 |",
      "The second difference is always +8, so the next first difference is:\n\n    43 + 8 = 51",
      "Next term:\n\n    137 + 51 = 188",
      "(b) Halve the second difference to get the number in front of {{n^2}}:\n\n    8 ÷ 2 = 4\n\nSo the nth term starts with {{4n^2}}.",
      "Subtract {{4n^2}} from each term:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 2 | 13 | 32 | 59 | 94 | 137 |\n| {{4n^2}} | 4 | 16 | 36 | 64 | 100 | 144 |\n| term − {{4n^2}} | −2 | −3 | −4 | −5 | −6 | −7 |",
      "What's left (−2, −3, −4, −5, …) is a linear sequence with difference −1. Its zeroth term is:\n\n    −2 − (−1) = −1\n\nSo what's left is −n − 1.",
      "Put the two parts together. The nth term is **{{4n^2 - n - 1}}**.",
      "Check with n = 4, one step per line:\n\n    {{4^2}} = 16\n    4 × 16 = 64\n    64 − 4 − 1 = 59 ✓",
    ],
    commonError:
      "Using the second difference (8) as the number in front of {{n^2}} instead of halving it, or stopping at {{4n^2}}: the leftovers −2, −3, −4, … go down by 1, so you still need −n − 1.",
    strategy: "Look at the differences",
  },

  // Q19 · extra practice: complete a pattern table, then use the given rule (2 + 2 marks)
  {
    id: "p3-q19",
    topic: "sq",
    section: "sq-generate",
    difficulty: "challenge",
    question:
      "**Extra practice: completing a pattern table** (like 6(a) in your class test).\n\nSiti uses dots to create a growing pattern, as shown below. The first pattern uses 3 dots.",
    diagram: dotPatterns([[3], [4, 4], [5, 5, 5]], "dots"),
    table: {
      headers: ["Pattern number", "1", "2", "3", "4"],
      rows: [["Number of dots", "3", "?", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many dots are used for the other patterns. Pattern 4 is not drawn, so continue the pattern. Type the numbers for patterns 2, 3 and 4 in order, separated by commas.",
        marks: 2,
        answer: { type: "list", values: [8, 15, 24], ordered: true, display: "8, 15, 24" },
        verify: "4+4, 5+5+5, 6+6+6+6",
        traps: [
          {
            spec: { type: "list", values: [8, 15, 22], ordered: true },
            feedback: "8 and 15 are right. For pattern 4, the differences so far are +5 and +7, so the next one is +9, not +7 again.",
          },
          {
            spec: { type: "list", values: [8, 15, 20], ordered: true },
            feedback:
              "8 and 15 are right. Each new pattern gets one more row **and** every row gets one dot longer: pattern 3 has rows of 5, so pattern 4 has rows of 6.",
          },
          {
            spec: { type: "list", values: [3, 8, 15, 24], ordered: true },
            feedback: "Those numbers are right, but pattern 1 is already in the table. Type just the three numbers for patterns 2, 3 and 4.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Siti correctly identifies the rule for the nth term in this pattern as {{n^2 + 2n}}. Use this formula to calculate the number of dots she needs to create the 14th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 224, display: "224 dots" },
        verify: "14^2+2*14",
        traps: [
          {
            spec: { type: "number", value: 56 },
            feedback: "{{n^2}} means n × n, not 2 × n. Work out 14 × 14 first.",
          },
          {
            spec: { type: "number", value: 198 },
            feedback: "2n means 2 × n, so you add 2 × 14, not just 2.",
          },
          {
            spec: { type: "number", value: 196 },
            feedback: "196 is only the {{n^2}} part (14 × 14). The rule is {{n^2 + 2n}}, so add 2 × 14 as well.",
          },
        ],
      },
    ],
    hints: [
      "Fill in **every** cell of the table, including pattern 4. Start by counting the dots in patterns 2 and 3 in the picture.",
      "Pattern 4 isn't drawn: look at how the rows change from one pattern to the next. Then check your table: work out the differences between the numbers. The differences themselves should go up by the same amount each time.",
      "For (b), substitute n = 14. Work out {{n^2}} on one line and 2n on the next line, then add them.",
    ],
    solution: [
      "(a) Count the dots in the pictures, one pattern per line:\n\n    Pattern 2: 4 + 4 = 8\n    Pattern 3: 5 + 5 + 5 = 15",
      "Each new pattern has one more row, and every row is one dot longer. So pattern 4 has 4 rows of 6 dots:\n\n    6 + 6 + 6 + 6 = 24",
      "Check with the differences:\n\n    8 − 3 = 5\n    15 − 8 = 7\n    24 − 15 = 9\n\nThey go up by 2 each time, so the pattern carries on correctly ✓",
      "The completed table:\n\n| Pattern number | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Number of dots | 3 | **8** | **15** | **24** |",
      "(b) Substitute n = 14 into {{n^2 + 2n}}, one calculation per line:\n\n    {{n^2}} = 14 × 14 = 196\n    2n = 2 × 14 = 28\n    {{n^2 + 2n}} = 196 + 28 = 224\n\nDon't run it together as 14 × 14 = 196 + 28 = 224: 14 × 14 is not equal to 196 + 28.",
      "Answer: the 14th pattern needs **224 dots**.",
      "Check with the picture: pattern n has n rows of (n + 2) dots, so pattern 14 has 14 rows of 16:\n\n    14 × 16 = 224 ✓",
    ],
    commonError:
      "Leaving cells of the table blank and jumping straight to (b): the table is worth marks on its own. Fill in **every** cell, including the pattern that isn't drawn, and check with the differences (here +5, +7, +9).",
    strategy: "Look at the differences",
  },

  // Q20 · extra practice: changing ratio when counters are added (3 marks)
  {
    id: "p3-q20",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "**Extra practice: a changing ratio** (like question 17 in your class test).\n\nWei Ling has a bag of counters. Some of them are red, and the rest are blue. She notices that {{2/7}} of the counters are red. She puts 10 more red counters into the bag. She observes that the ratio of red counters to blue counters is now 3 : 5. How many blue counters are in the bag?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 50, display: "50 blue counters" },
        verify: "(7-2)*(5*10)/(3*(7-2)-5*2)",
        traps: [
          {
            spec: { type: "number", value: 20 },
            feedback: "20 is the number of red counters at the start. The question asks for the blue counters.",
          },
          {
            spec: { type: "number", value: 70 },
            feedback: "70 is the total number of counters at the start (red and blue). The question asks for the blue counters only.",
          },
          {
            spec: { type: "number", value: 80 },
            feedback: "80 is the total after the extra red counters go in. The question asks for the blue counters only.",
          },
          {
            spec: { type: "number", value: 30 },
            feedback: "30 is the number of red counters now. The question asks for the blue counters.",
          },
          {
            spec: { type: "number", value: 10 },
            feedback: "10 is the value of x (one part). There are 5x blue counters.",
          },
        ],
      },
    ],
    hints: [
      "Which colour stays the same when the red counters go in? Write the ratio red : blue at the start first.",
      "Let red = 2x and blue = 5x. After 10 red counters are added, set up (2x + 10) : 5x = 3 : 5.",
      "Cross-multiply and solve for x. Then remember the question asks for the blue counters: 5x.",
    ],
    solution: [
      "{{2/7}} of the counters are red, so {{5/7}} are blue. At the start:\n\n    red : blue = 2 : 5",
      "Let red = 2x and blue = 5x. (This is the same method as chocolate = 2x, fruit = 3x in your class test.)",
      "Wei Ling adds 10 red counters. The blue counters don't change:\n\n    red now = 2x + 10\n    blue = 5x",
      "Set the new ratio equal to 3 : 5:\n\n    (2x + 10) : 5x = 3 : 5",
      "Write it as fractions and cross-multiply:\n\n    {{(2x + 10)/(5x) = 3/5}}\n    5(2x + 10) = 3 × 5x\n    10x + 50 = 15x",
      "Solve for x, one step per line:\n\n    50 = 15x − 10x\n    50 = 5x\n    x = 10",
      "The number of blue counters is 5x:\n\n    5 × 10 = 50",
      "Answer: **50 blue counters**.",
      "Check: at the start there are 20 red and 50 blue, and 20 out of 70 is {{2/7}} ✓. After adding 10 red: 30 : 50 = 3 : 5 ✓ (divide both by 10).",
    ],
    altMethod: {
      label: "Keep the blue the same (bar model)",
      steps: [
        "The blue counters don't change, and blue is 5 parts in both ratios: 2 : 5 at the start and 3 : 5 now.",
        "So every part is the same size before and after. Red grew from 2 parts to 3 parts.",
        "The 1 extra part is the 10 counters she added, so 1 part = 10 counters.",
        "Blue = 5 parts = 5 × 10 = 50 counters ✓",
      ],
    },
    commonError:
      "Treating {{2/7}} as the ratio red : blue = 2 : 7. It means 2 out of every 7 counters are red, so red : blue = 2 : 5. Then answer the question asked: the number of blue counters, not the total.",
    strategy: "Make the shared part equal",
  },
];
