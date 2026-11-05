import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 1, questions 11–20. See docs/papers-blueprint.md. */
export const P1_B: QA[] = [
  {
    id: "p1-q11",
    topic: "ex",
    section: "ex-expand",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{3(2x + 5) - 4(x - 2)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "2x+23", form: "simplified" },
        verify: "3(2x+5)-4(x-2)",
        traps: [
          {
            spec: { type: "expression", expr: "2x+7" },
            feedback: "Check the last term: −4 × (−2) = **+8**, not −8. A negative times a negative is positive, so you get 6x + 15 − 4x + 8.",
          },
          {
            spec: { type: "expression", expr: "10x+7" },
            feedback: "The second bracket is being **taken away**, so multiply it by −4: −4 × x = −4x and −4 × (−2) = +8. That gives 6x + 15 − 4x + 8.",
          },
          {
            spec: { type: "expression", expr: "2x+13" },
            feedback: "Multiply **every** term inside each bracket: 3 × 5 = 15 and −4 × (−2) = +8. Then the numbers are 15 + 8 = 23.",
          },
        ],
      },
    ],
    hints: [
      "Expand each bracket on its own first. The −4 belongs to the second bracket, so it multiplies both the x and the −2.",
      "Negative × negative = positive. Then collect the x terms and the number terms separately.",
    ],
    solution: [
      "Expand the first bracket with a grid:\n\n| × | 2x | +5 |\n|---|---|---|\n| 3 | 6x | +15 |\n\nSo 3(2x + 5) = 6x + 15.",
      "Expand the second bracket, keeping the minus sign with the 4:\n\n| × | x | −2 |\n|---|---|---|\n| −4 | −4x | +8 |\n\nSo −4(x − 2) = −4x + 8.",
      "Put them together: 6x + 15 − 4x + 8.",
      "Collect the x terms: 6x − 4x = 2x.",
      "Collect the numbers: 15 + 8 = 23.",
      "Answer: **2x + 23**.",
      "Check with x = 1: 3 × 7 − 4 × (−1) = 21 + 4 = 25, and 2 × 1 + 23 = 25 ✓",
    ],
    commonError: "Getting the sign of the last term wrong: −4(x − 2) is −4x **+** 8, not −4x − 8.",
    strategy: "Use the grid method",
  },
  {
    id: "p1-q12",
    topic: "pc",
    section: "pc-change",
    difficulty: "warmup",
    question: "Increase $600 by 250%.",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 2100, display: "$2100" },
        verify: "600+600*250/100",
        traps: [
          {
            spec: { type: "number", value: 1500 },
            feedback: "$1500 is 250% of $600 — that's only the increase. Add it on to the original amount: $600 + $1500.",
          },
          {
            spec: { type: "number", value: 850 },
            feedback: "That adds on $250, not 250%. 250% of $600 means 2.5 lots of $600.",
          },
        ],
      },
    ],
    hints: [
      "Build 250% from blocks you know: 100% of $600 is $600, and 50% is $300.",
      "250% of $600 is only the increase. What do you do with it to get the new amount?",
    ],
    solution: [
      "100% of $600 = $600.",
      "50% of $600 = $300.",
      "250% = 100% + 100% + 50%, so 250% of $600 = $600 + $600 + $300 = $1500.",
      "That is the increase. Add it to the original amount: $600 + $1500 = **$2100**.",
      "Write the two steps on separate lines. A chain like 600 × 2.5 = 1500 + 600 = 2100 says 1500 = 2100, which isn't true.",
    ],
    altMethod: {
      label: "Use a multiplier",
      steps: [
        "The new amount is 100% + 250% = 350% of the original.",
        "350% = 3.5 as a decimal.",
        "$600 × 3.5 = $2100.",
      ],
    },
    commonError: "Stopping at $1500 (250% of $600), which is only the increase, or multiplying by 2.5 instead of 3.5. The new amount is $600 + $1500 = $2100.",
    strategy: "Use the multiplier",
  },
  {
    id: "p1-q13",
    topic: "ex",
    section: "ex-double",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{(x + 8)(x - 3)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "x^2+5x-24", form: "simplified" },
        verify: "(x+8)(x-3)",
        traps: [
          {
            spec: { type: "expression", expr: "x^2-24" },
            feedback: "You've multiplied the first terms and the last terms but missed the two middle ones: x × (−3) = −3x and 8 × x = 8x. The grid has **four** boxes.",
          },
          {
            spec: { type: "expression", expr: "x^2+5x+24" },
            feedback: "Check the number term: 8 × (−3) = **−24**, because a positive times a negative is negative.",
          },
          {
            spec: { type: "expression", expr: "x^2+11x-24" },
            feedback: "One of the middle terms is negative: x × (−3) = −3x. So the x terms are −3x + 8x = 5x.",
          },
          {
            spec: { type: "expression", expr: "x^2-5x-24" },
            feedback: "Check the x terms: −3x + 8x = **+5x**. You have more positive x's than negative ones.",
          },
        ],
      },
    ],
    hints: [
      "Use the grid method: x and +8 down the side, x and −3 along the top. Fill in all four boxes.",
      "Keep each sign with its term, so 8 × (−3) is negative. Then collect the two x terms.",
    ],
    solution: [
      "Grid method:\n\n| × | x | −3 |\n|---|---|---|\n| x | {{x^2}} | −3x |\n| +8 | +8x | −24 |",
      "Add the four boxes: x² − 3x + 8x − 24.",
      "Collect the like terms: −3x + 8x = 5x.",
      "Answer: **x² + 5x − 24**.",
      "Check with x = 1: (1 + 8)(1 − 3) = 9 × (−2) = −18, and 1 + 5 − 24 = −18 ✓",
    ],
    altMethod: {
      label: "Multiply each term by each term",
      steps: [
        "x × x = x²",
        "x × (−3) = −3x",
        "8 × x = 8x",
        "8 × (−3) = −24",
        "Add them and collect the x terms: x² − 3x + 8x − 24 = x² + 5x − 24.",
      ],
    },
    commonError: "Missing the two middle terms (writing x² − 24), or leaving x² − 3x + 8x − 24 without collecting −3x + 8x = 5x.",
    strategy: "Use the grid method",
  },
  {
    id: "p1-q14",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Priya is asked to increase $520 by {{12 1/2}}%. Using a calculator, she multiplies 520 by a single number to get the correct answer. What single number does she use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 1.125 },
        verify: "1+(12+1/2)/100",
        traps: [
          {
            spec: { type: "number", value: 1.25 },
            feedback: "1.25 is the multiplier for a 25% increase. {{12 1/2}}% = 12.5 ÷ 100 = 0.125, so the multiplier is 1 + 0.125.",
          },
          {
            spec: { type: "number", value: 0.125 },
            feedback: "0.125 is just the {{12 1/2}}% that is added on. Priya keeps the 100% she started with as well, so add 1.",
          },
          {
            spec: { type: "number", value: 112.5 },
            feedback: "112.5% is the right percentage, but the single number she multiplies by is a decimal: divide 112.5 by 100.",
          },
          {
            spec: { type: "number", value: 585 },
            feedback: "$585 is the new amount. The question asks for the single number Priya multiplies 520 by.",
          },
        ],
      },
    ],
    hints: [
      "After the increase, Priya has all of the original amount (100%) plus another {{12 1/2}}%. What percentage is that altogether?",
      "Change that percentage into a decimal by dividing by 100. Careful with the place value: {{12 1/2}}% is 12.5%.",
    ],
    solution: [
      "The new amount is 100% + {{12 1/2}}% = 112.5% of the original.",
      "As a decimal: 112.5 ÷ 100 = 1.125.",
      "Priya multiplies by **1.125**.",
      "Check: 520 × 1.125 = 585.",
      "Check without the multiplier: 10% of 520 = 52 and 2.5% of 520 = 13.",
      "So {{12 1/2}}% of 520 = 52 + 13 = 65, and 520 + 65 = 585 ✓",
    ],
    commonError: "Writing {{12 1/2}}% as 0.25 (giving 1.25) instead of 0.125, or forgetting the original 100% and using 0.125.",
    strategy: "Use the multiplier",
  },
  {
    id: "p1-q15",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Daniel is asked to decrease $2400 by 8%. He multiplies 2400 by a single number to get the correct answer. What single number does he use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 0.92 },
        verify: "1-8/100",
        traps: [
          {
            spec: { type: "number", value: 0.08 },
            feedback: "0.08 is the 8% that is taken off. The multiplier is what is left: 100% − 8%.",
          },
          {
            spec: { type: "number", value: 1.08 },
            feedback: "1.08 would increase the amount by 8%. For a decrease, take the 8% away from 100%.",
          },
          {
            spec: { type: "number", value: 0.2 },
            feedback: "8% = 8 ÷ 100 = 0.08, not 0.8. So the multiplier is 1 − 0.08.",
          },
          {
            spec: { type: "number", value: 0.8 },
            feedback: "0.8 would take off 20%. 8% = 8 ÷ 100 = 0.08, so the multiplier is 1 − 0.08.",
          },
          {
            spec: { type: "number", value: 92 },
            feedback: "92% is the right percentage, but the single number he multiplies by is a decimal: divide 92 by 100.",
          },
          {
            spec: { type: "number", value: 2208 },
            feedback: "$2208 is the new amount. The question asks for the single number Daniel multiplies 2400 by.",
          },
        ],
      },
    ],
    hints: [
      "After an 8% decrease, what percentage of the original $2400 is left?",
      "Write that percentage as a decimal by dividing by 100.",
    ],
    solution: [
      "A decrease of 8% leaves 100% − 8% = 92% of the original.",
      "As a decimal: 92 ÷ 100 = 0.92.",
      "Daniel multiplies by **0.92**.",
      "Check: 2400 × 0.92 = 2208.",
      "Check without the multiplier: 1% of 2400 = 24, so 8% of 2400 = 24 × 8 = 192.",
      "2400 − 192 = 2208 ✓",
    ],
    commonError: "Using 0.08 (the 8% that comes off) instead of 0.92 (the 92% that is left). 1.08 would be an 8% increase.",
    strategy: "Use the multiplier",
  },
  {
    id: "p1-q16",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "challenge",
    question: "Write the answer to this calculation in its simplest form: {{(12a^2b)/7}} ÷ {{(9a)/(14b)}}",
    parts: [
      {
        prompt: "If the bottom of your answer has more than one factor, type it in brackets, e.g. 5/(2a).",
        marks: 3,
        answer: { type: "expression", expr: "8ab^2/3", form: "simplified", display: "{{(8ab^2)/3}}" },
        verify: "((12a^2b)/7)/((9a)/(14b))",
        traps: [
          {
            spec: { type: "expression", expr: "54a^3/49" },
            feedback: "You multiplied without flipping. To divide, keep the first fraction, change ÷ to × and flip the second: {{(12a^2b)/7 * (14b)/(9a)}}.",
          },
          {
            spec: { type: "expression", expr: "3/(8ab^2)" },
            feedback: "That's upside down: you flipped the first fraction instead of the second. Keep {{(12a^2b)/7}} as it is and flip {{(9a)/(14b)}}.",
          },
          {
            spec: { type: "expression", expr: "3ab^2/8" },
            feedback: "This is read as {{3/8}} × ab². If you meant 3 over 8ab², that's upside down: you flipped the first fraction instead of the second. (Type a bottom with more than one factor in brackets.)",
          },
          {
            spec: { type: "expression", expr: "8a^2b^2/3" },
            feedback: "Don't forget the a on the bottom (from the 9a). It cancels one of the a's on the top: {{a^2/a = a}}.",
          },
          {
            spec: { type: "expression", expr: "8a/3" },
            feedback: "The b's don't cancel. Once you flip the second fraction, both b's are on the top, so they multiply to make {{b^2}}.",
          },
          {
            spec: { type: "expression", expr: "8b^2/3" },
            feedback: "Only one a cancels: {{a^2}} on the top and a on the bottom leave one a on the top, {{a^2/a = a}}.",
          },
        ],
      },
    ],
    hints: [
      "To divide by a fraction, multiply by its reciprocal: keep the first fraction, change ÷ to ×, and flip the second one.",
      "Now you have {{(12a^2b)/7 * (14b)/(9a)}}. Multiply the tops and multiply the bottoms (or cancel common factors first).",
      "Simplify the numbers and the letters separately. How many a's cancel? Where do the two b's end up?",
    ],
    solution: [
      "Keep, Change, Flip: {{(12a^2b)/7 ÷ (9a)/(14b) = (12a^2b)/7 * (14b)/(9a)}}",
      "Multiply the tops: 12a²b × 14b = 168a²b²",
      "Multiply the bottoms: 7 × 9a = 63a",
      "So the calculation gives {{(168a^2b^2)/(63a)}}",
      "Numbers: the HCF of 168 and 63 is 21. 168 ÷ 21 = 8 and 63 ÷ 21 = 3, so {{168/63 = 8/3}}.",
      "Letters: {{a^2/a = a}}, and {{b^2}} has nothing to cancel with, so it stays on the top.",
      "Answer: {{(8ab^2)/3}}",
    ],
    altMethod: {
      label: "Cancel before you multiply",
      steps: [
        "After flipping: {{(12a^2b)/7 * (14b)/(9a)}}",
        "12 and 9 share a factor of 3: 12 ÷ 3 = 4 and 9 ÷ 3 = 3.",
        "14 and 7 share a factor of 7: 14 ÷ 7 = 2 and 7 ÷ 7 = 1.",
        "a² on the top and a on the bottom: one a cancels, leaving a on the top.",
        "That leaves {{(4ab)/1 * (2b)/3 = (8ab^2)/3}}",
      ],
    },
    commonError:
      "Forgetting to flip the second fraction (which gives {{(54a^3)/49}}), or cancelling the b's. After flipping, both b's are on the top, so they make {{b^2}}.",
    strategy: "Spot the common factor",
  },
  {
    id: "p1-q17",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "Marcus has a box of pens. Some of them are red, and the rest are blue. He notices that 30% of the pens are red. He takes out 12 red pens. He observes that the ratio of red pens to blue pens is now 1 : 7. How many blue pens does he have in the box?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 42 },
        verify: "(1-30/100)*(12*7/(7*30/100-(1-30/100)))",
        traps: [
          {
            spec: { type: "number", value: 6 },
            feedback: "6 is x, the size of one part (it's also the number of red pens left). The blue pens are 7x, so multiply by 7.",
          },
          {
            spec: { type: "number", value: 60 },
            feedback: "60 is the total number of pens at the start. The question asks how many **blue** pens there are.",
          },
          {
            spec: { type: "number", value: 48 },
            feedback: "48 is the number of pens left in the box (red and blue together). The question asks how many **blue** pens there are.",
          },
          {
            spec: { type: "number", value: 18 },
            feedback: "18 is the number of red pens at the start. The question asks for the blue pens.",
          },
          {
            spec: { type: "number", value: 84 },
            feedback: "84 isn't the number of blue pens. If it came from 84 = 14x, divide by 14 to find x first. (And the 12 pens aren't one part: they are the 2 parts red loses, going from 3 parts to 1.)",
          },
        ],
      },
    ],
    hints: [
      "Which colour doesn't change? Use the percentages to write red : blue at the start as a ratio.",
      "At the start red : blue = 3 : 7, so let red = 3x and blue = 7x. After 12 red pens are taken out, (3x − 12) : 7x = 1 : 7.",
      "1 : 7 means there are 7 times as many blue pens as red pens: 7x = 7(3x − 12). Solve for x, then work out the blue pens.",
    ],
    solution: [
      "30% are red, so 70% are blue. Red : blue = 30 : 70 = 3 : 7.",
      "Let red = 3x and blue = 7x.",
      "Marcus takes out 12 red pens and the blue pens don't change, so now (3x − 12) : 7x = 1 : 7.",
      "1 : 7 means blue = 7 × red:",
      "7x = 7(3x − 12)",
      "7x = 21x − 84",
      "84 = 14x",
      "x = 6",
      "Blue pens = 7x = 7 × 6 = **42**.",
      "Check:\n\n| | Red | Blue | Total |\n|---|---|---|---|\n| Start | 18 | 42 | 60 |\n| After 12 red pens are taken out | 6 | 42 | 48 |",
      "18 out of 60 is 30% ✓ and 6 : 42 = 1 : 7 ✓",
      "Question 17 in your class test works the same way: chocolate = 2x, fruit = 3x and (2x − 20) : 3x = 1 : 4 give x = 16, so there are 3 × 16 = 48 fruit sweets.",
    ],
    altMethod: {
      label: "Bar model (the blue pens stay the same)",
      steps: [
        "At the start red : blue = 3 : 7. At the end red : blue = 1 : 7.",
        "The blue pens don't change, and blue is 7 parts in both ratios, so the parts are the same size.",
        "Red goes from 3 parts to 1 part, so the 12 pens taken out are 2 parts.",
        "1 part = 12 ÷ 2 = 6 pens.",
        "Blue = 7 parts = 7 × 6 = 42 pens.",
      ],
    },
    commonError:
      "Giving the wrong number at the end: x (6), the total at the start (60) or the pens left (48) instead of the blue pens. Label what each number stands for, then read the last sentence of the question again.",
    strategy: "Introduce a variable",
  },
  {
    id: "p1-q18",
    topic: "sq",
    section: "sq-quadratic",
    difficulty: "challenge",
    question: "Here are the first six terms of a sequence: 4, 13, 26, 43, 64, 89.",
    parts: [
      {
        label: "a",
        prompt: "Find the next term in the sequence.",
        marks: 1,
        answer: { type: "number", value: 118 },
        verify: "89+(89-64)+((89-64)-(64-43))",
        traps: [
          {
            spec: { type: "number", value: 114 },
            feedback: "114 adds 25 again, as if the sequence were linear. The first differences go up by 4 each time, so the next one is 25 + 4 = 29.",
          },
          {
            spec: { type: "number", value: 93 },
            feedback: "93 adds the second difference (4) to the last term. Add the next **first** difference instead: 25 + 4 = 29.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the nth term in this sequence.",
        marks: 4,
        answer: { type: "expression", expr: "2n^2+3n-1" },
        verify: "terms:4,13,26,43,64,89",
        traps: [
          {
            spec: { type: "expression", expr: "2n^2+3n+2" },
            feedback: "After subtracting {{2n^2}} you get 2, 5, 8, 11, … The 2 is its 1st term, not its zeroth term. The zeroth term is 2 − 3 = −1, so that part is 3n − 1.",
          },
          {
            spec: { type: "expression", expr: "2n^2+3n+1" },
            feedback: "Check the sign of the number at the end: the zeroth term of 2, 5, 8, 11, … is 2 − 3 = −1, so that part is 3n − 1.",
          },
          {
            spec: { type: "expression", expr: "2n^2+3n" },
            feedback: "Check with n = 1: 2 + 3 = 5, but the 1st term is 4. What's left after subtracting {{2n^2}} is 2, 5, 8, 11, …, which is 3n − 1, not 3n.",
          },
          {
            spec: { type: "expression", expr: "9n-5" },
            feedback: "9n − 5 only works if the terms go up by 9 every time. Here the differences 9, 13, 17, … keep growing, so the sequence is quadratic: start with the second difference.",
          },
        ],
      },
    ],
    hints: [
      "Work out the first differences, then the second differences.",
      "Halve the second difference: that's the number in front of {{n^2}}. Subtract that many lots of {{n^2}} from each term.",
      "What's left is a linear sequence. Find its nth term the usual way: (difference)n + (zeroth term).",
    ],
    solution: [
      "Make a differences table:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| term | 4 | 13 | 26 | 43 | 64 | 89 | **118** |\n| 1st difference | | +9 | +13 | +17 | +21 | +25 | +29 |\n| 2nd difference | | | +4 | +4 | +4 | +4 | +4 |",
      "(a) The second difference is always 4, so the next first difference is 25 + 4 = 29.",
      "Next term: 89 + 29 = **118**.",
      "(b) Second difference ÷ 2 = 4 ÷ 2 = 2, so the nth term starts with {{2n^2}}.",
      "Subtract {{2n^2}} from each term:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 4 | 13 | 26 | 43 | 64 | 89 |\n| {{2n^2}} | 2 | 8 | 18 | 32 | 50 | 72 |\n| term − {{2n^2}} | 2 | 5 | 8 | 11 | 14 | 17 |",
      "What's left, 2, 5, 8, 11, …, goes up by 3 each time, so it starts with 3n.",
      "Its zeroth term is 2 − 3 = −1, so what's left is 3n − 1.",
      "The nth term is **2n² + 3n − 1**.",
      "Check with n = 4, one step per line:\n\n    2 × 4² = 2 × 16 = 32\n    3 × 4 = 12\n    32 + 12 − 1 = 43 ✓",
    ],
    commonError:
      "Using the 1st term of the leftover sequence (2) instead of its zeroth term (−1), which gives {{2n^2 + 3n + 2}}, or forgetting to halve the second difference.",
    strategy: "Look at the differences",
  },
  {
    id: "p1-q19",
    topic: "sq",
    section: "sq-generate",
    difficulty: "challenge",
    question:
      "**Extra practice: completing a pattern table** (like 6(a) in your class test).\n\nHana uses dots to create a growing pattern. The first three patterns are shown below. The first pattern uses 3 dots.",
    diagram: dotPatterns([[1, 2], [1, 4, 4], [1, 6, 6, 6]], "dots"),
    table: {
      headers: ["Pattern number", "1", "2", "3", "4"],
      rows: [["Number of dots", "3", "?", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many dots are used for patterns 2, 3 and 4. Pattern 4 is not drawn, so continue the pattern. Type the three numbers in order, separated by commas.",
        marks: 2,
        answer: { type: "list", values: [9, 19, 33], ordered: true },
        verify: "1+2*4, 1+3*6, 1+4*8",
        traps: [
          {
            spec: { type: "list", values: [9, 19, 29], ordered: true },
            feedback: "9 and 19 are right, but the increases aren't the same each time: +6, then +10, so the next is +14. Pattern 4 is 1 dot on top and then 4 rows of 8.",
          },
          {
            spec: { type: "list", values: [9, 19, 25], ordered: true },
            feedback: "9 and 19 are right. Pattern 4 gets one more row **and** longer rows: 1 dot on top, then 4 rows of 8 dots.",
          },
          {
            spec: { type: "list", values: [3, 9, 19, 33], ordered: true },
            feedback: "Those numbers are right, but pattern 1 (3 dots) was already in the table. The answer is the three missing values, for patterns 2, 3 and 4.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Hana correctly identifies the rule for the nth term in this pattern as {{2n^2 + 1}}. Use this formula to calculate the number of dots she needs to create the 15th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 451 },
        verify: "2*15^2+1",
        traps: [
          {
            spec: { type: "number", value: 901 },
            feedback: "901 comes from squaring 2 × 15 = 30. {{2n^2}} means 2 × {{n^2}}: square 15 first, then double it.",
          },
          {
            spec: { type: "number", value: 61 },
            feedback: "{{15^2}} means 15 × 15, not 15 × 2. Square first, then multiply by 2, then add 1.",
          },
          {
            spec: { type: "number", value: 450 },
            feedback: "Nearly: 2 × 225 = 450 is right so far. Now add the 1.",
          },
        ],
      },
    ],
    hints: [
      "Count the dots in patterns 2 and 3. Then look at how each pattern grows into the next: count the rows, and the dots in each row.",
      "Pattern 4 is not drawn, but it has 1 dot on top and then 4 rows. How many dots are in each row? Fill in **every** empty cell: a blank cell scores nothing.",
      "Check your table: the differences between the numbers should go up by the same amount each time, and the rule in (b) should give the same numbers. For (b), work out {{15^2}} first, then × 2, then + 1.",
    ],
    solution: [
      "(a) Count the dots in the drawn patterns.",
      "Pattern 2: 1 + 4 + 4 = 9 dots.",
      "Pattern 3: 1 + 6 + 6 + 6 = 19 dots.",
      "Each new pattern keeps the 1 dot on top, adds one more row, and makes every row 2 dots longer. So pattern 4 is 1 dot and then 4 rows of 8.",
      "Pattern 4: 1 + 8 + 8 + 8 + 8 = 33 dots.",
      "The completed table:\n\n| Pattern number | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Number of dots | 3 | **9** | **19** | **33** |",
      "Check with the differences: 3 → 9 → 19 → 33 goes up by 6, then 10, then 14. These go up by 4 each time, so the table is consistent ✓",
      "(b) Substitute n = 15 into {{2n^2 + 1}}, one step per line:\n\n    15² = 15 × 15 = 225\n    2 × 225 = 450\n    450 + 1 = 451",
      "The 15th pattern needs **451** dots.",
      "Keep the steps on separate lines. A chain like 15 × 15 = 225 × 2 = 450 + 1 = 451 says 225 = 450, which isn't true.",
    ],
    altMethod: {
      label: "Use the rule from (b) to fill the table",
      steps: [
        "Part (b) gives the rule {{2n^2 + 1}}, so you can use it for part (a) too.",
        "n = 2: 2² = 4, then 2 × 4 = 8, then 8 + 1 = 9.",
        "n = 3: 3² = 9, then 2 × 9 = 18, then 18 + 1 = 19.",
        "n = 4: 4² = 16, then 2 × 16 = 32, then 32 + 1 = 33.",
        "These match the dots you counted ✓ Read every part of a question before you start: a later part can help with an earlier one.",
      ],
    },
    commonError:
      "Leaving cells of the table empty, especially the pattern that isn't drawn, and jumping straight to (b). Every \"?\" earns marks: count the drawn patterns, continue the pattern (or use the rule from (b)) for the next one, and check with the differences.",
    strategy: "Find a pattern",
  },
  {
    id: "p1-q20",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "**Extra practice: a changing ratio** (like question 17 in your class test).\n\nIn a car park, {{3/8}} of the cars are white and the rest are other colours. 14 white cars leave the car park. The ratio of white cars to other cars is now 1 : 4. How many cars were in the car park at the start?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 64 },
        verify: "14*4/(4*3/8-(1-3/8))",
        traps: [
          {
            spec: { type: "number", value: 8 },
            feedback: "8 is x, the size of one part. At the start there are 3x + 5x = 8x cars.",
          },
          {
            spec: { type: "number", value: 50 },
            feedback: "50 is the number of cars left after the 14 white cars leave. The question asks how many there were at the **start**.",
          },
          {
            spec: { type: "number", value: 40 },
            feedback: "40 is the number of cars of other colours. The question asks for **all** the cars at the start.",
          },
          {
            spec: { type: "number", value: 24 },
            feedback: "24 is the number of white cars at the start. The question asks for **all** the cars at the start.",
          },
          {
            spec: { type: "number", value: 56 },
            feedback: "56 isn't the number of cars. If it came from 56 = 7x, divide by 7 to find x first. If you said the 14 cars are 2 parts (3 − 1), the parts in 3 : 5 and 1 : 4 aren't the same size: make the other cars match first (3 : 5 = 12 : 20 and 1 : 4 = 5 : 20).",
          },
        ],
      },
    ],
    hints: [
      "Which cars don't change? Use the fraction {{3/8}} to write white : other at the start as a ratio.",
      "At the start white : other = 3 : 5, so let white = 3x and other = 5x. After 14 white cars leave, (3x − 14) : 5x = 1 : 4.",
      "1 : 4 means there are 4 times as many other cars as white cars: 5x = 4(3x − 14). Solve for x, then check what the question asks for.",
    ],
    solution: [
      "{{3/8}} of the cars are white, so {{5/8}} are other colours. White : other = 3 : 5.",
      "Let white = 3x and other = 5x.",
      "14 white cars leave and the other cars don't change, so now (3x − 14) : 5x = 1 : 4.",
      "1 : 4 means other = 4 × white:",
      "5x = 4(3x − 14)",
      "5x = 12x − 56",
      "56 = 7x",
      "x = 8",
      "At the start there were 3x + 5x = 8x cars.",
      "8 × 8 = **64** cars.",
      "Check:\n\n| | White | Other | Total |\n|---|---|---|---|\n| Start | 24 | 40 | 64 |\n| After 14 white cars leave | 10 | 40 | 50 |",
      "24 is {{3/8}} of 64 ✓ and 10 : 40 = 1 : 4 ✓",
    ],
    altMethod: {
      label: "Make the other cars match (bar model)",
      steps: [
        "The other cars don't change. At the start white : other = 3 : 5; afterwards it is 1 : 4.",
        "Make the other cars the same number of parts in both: 3 : 5 = 12 : 20 and 1 : 4 = 5 : 20.",
        "White goes from 12 parts to 5 parts, so the 14 cars that leave are 7 parts.",
        "1 part = 14 ÷ 7 = 2 cars.",
        "At the start there are 12 + 20 = 32 parts, and 32 × 2 = 64 cars.",
      ],
    },
    commonError:
      "Stopping at x = 8, or giving the cars at the end (50) or just one colour (40), when the question asks for all the cars at the start. Also, the parts in 3 : 5 and 1 : 4 are different sizes until you make the other cars match, so the 14 cars are not \"2 parts\".",
    strategy: "Introduce a variable",
  },
];
