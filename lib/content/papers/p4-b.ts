import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 4, questions 11–20. See docs/papers-blueprint.md. */
export const P4_B: QA[] = [
  // Q11 · expand and simplify a difference of brackets
  {
    id: "p4-q11",
    topic: "ex",
    section: "ex-expand",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{6(2m + 1) - 5(m - 4)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "7m+26", form: "simplified" },
        verify: "6(2m+1)-5(m-4)",
        traps: [
          {
            spec: { type: "expression", expr: "7m-14" },
            feedback:
              "Check the second bracket: −5 × (−4) = **+20**, not −20. A negative times a negative is positive, so −5(m − 4) = −5m + 20.",
          },
          {
            spec: { type: "expression", expr: "7m+21" },
            feedback:
              "Multiply **both** terms in the first bracket by 6: 6 × 2m = 12m and 6 × 1 = 6. So 6(2m + 1) = 12m + 6, not 12m + 1.",
          },
        ],
      },
    ],
    hints: [
      "Expand each bracket on its own first. The second bracket is multiplied by **−5**, so keep the minus sign with the 5.",
      "In the second bracket, −5 × (−4) is a negative times a negative. Then collect the m terms and the number terms separately.",
    ],
    solution: [
      "Expand the first bracket: multiply both terms by 6.\n\n| × | 2m | +1 |\n|---|---|---|\n| 6 | 12m | +6 |\n\nSo 6(2m + 1) = 12m + 6.",
      "Expand the second bracket: multiply both terms by **−5** (the minus sign belongs to the 5).\n\n| × | m | −4 |\n|---|---|---|\n| −5 | −5m | +20 |\n\nSo −5(m − 4) = −5m + 20.",
      "Write all four terms in one line: 12m + 6 − 5m + 20",
      "Collect the m terms: 12m − 5m = 7m",
      "Collect the numbers: 6 + 20 = 26",
      "Answer: **7m + 26**",
      "Check by putting m = 1 into the question: 6(2m + 1) − 5(m − 4) becomes 6 × 3 − 5 × (−3).\n\n    6 × 3 = 18\n    5 × (−3) = −15\n    18 − (−15) = 33\n\nAnd the answer: 7 × 1 + 26 = 33 ✓",
    ],
    commonError:
      "Writing −5(m − 4) = −5m − 20. The 5 is being subtracted, so multiply the bracket by −5: −5 × (−4) = +20.",
    strategy: "Use the grid method",
  },

  // Q12 · increase by more than 100%
  {
    id: "p4-q12",
    topic: "pc",
    section: "pc-change",
    difficulty: "warmup",
    question: "Increase $1200 by 175%",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 3300, display: "$3300" },
        verify: "1200*(100+175)/100",
        traps: [
          {
            spec: { type: "number", value: 2100 },
            feedback:
              "$2100 is 175% **of** $1200: that's only the increase. Add it on to the original amount: $1200 + $2100.",
          },
          {
            spec: { type: "number", value: 1375 },
            feedback:
              "You've added $175, not 175%. Work out 175% of $1200 first (100% + 50% + 25%), then add it on to $1200.",
          },
        ],
      },
    ],
    hints: [
      "Increasing by 175% means you keep the original 100% **and** add another 175% on top.",
      "So the new amount is 275% of $1200. Write 275% as a decimal multiplier, or build it up from 100%, 50% and 25%.",
    ],
    solution: [
      "Increasing by 175% means the new amount is 100% + 175% = 275% of $1200.",
      "As a multiplier: 275% = 2.75",
      "Work out 1200 × 2.75 in two parts:\n\n    1200 × 2 = 2400\n    1200 × 0.75 = 900\n    2400 + 900 = 3300",
      "The new amount is **$3300**.",
    ],
    altMethod: {
      label: "Find 175% first, then add it on",
      steps: [
        "100% of $1200 = $1200",
        "50% of $1200 = $600",
        "25% of $1200 = $300",
        "175% of $1200: $1200 + $600 + $300 = $2100",
        "New amount: $1200 + $2100 = $3300",
      ],
    },
    commonError:
      "Stopping at 175% of $1200, which is $2100. That's the increase, not the new amount: you still have to add it to the original $1200.",
    strategy: "Use the multiplier",
  },

  // Q13 · expand a pair of brackets
  {
    id: "p4-q13",
    topic: "ex",
    section: "ex-double",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{(x - 9)(x + 3)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "x^2-6x-27", form: "simplified" },
        verify: "(x-9)(x+3)",
        traps: [
          {
            spec: { type: "expression", expr: "x^2+6x-27" },
            feedback: "Check the sign of the middle term: −9x + 3x = **−6x**, not +6x. You go down 9 and back up 3.",
          },
          {
            spec: { type: "expression", expr: "x^2-27" },
            feedback: "You've missed the two middle terms. The grid has four boxes: {{x^2}}, −9x, +3x and −27.",
          },
          {
            spec: { type: "expression", expr: "x^2-6x+27" },
            feedback: "Check the last box: −9 × (+3) = **−27**. A negative times a positive is negative.",
          },
        ],
      },
    ],
    hints: [
      "Use a 2 × 2 grid: put x and −9 along the top and x and +3 down the side. Keep each sign with its number.",
      "Fill in all four boxes, then collect the two x terms. Watch the signs.",
    ],
    solution: [
      "Grid method for (x − 9)(x + 3):\n\n| × | x | −9 |\n|---|---|---|\n| x | {{x^2}} | −9x |\n| +3 | +3x | −27 |",
      "Write down the four terms: {{x^2}} − 9x + 3x − 27",
      "Collect the x terms: −9x + 3x = −6x",
      "Answer: **{{x^2 - 6x - 27}}**",
      "Check by putting x = 10 into both:\n\n    (10 − 9)(10 + 3) = 1 × 13\n    1 × 13 = 13\n    {{10^2}} − 6 × 10 − 27 = 100 − 60 − 27\n    100 − 60 − 27 = 13 ✓",
    ],
    altMethod: {
      label: "FOIL (First, Outer, Inner, Last)",
      steps: [
        "First: x × x = {{x^2}}",
        "Outer: x × (+3) = +3x",
        "Inner: −9 × x = −9x",
        "Last: −9 × (+3) = −27",
        "Add them: {{x^2 + 3x - 9x - 27}}, then collect the x terms to get {{x^2 - 6x - 27}}.",
      ],
    },
    commonError:
      "A sign slip in the middle term (writing {{x^2 + 6x - 27}}), or leaving out the two middle terms and writing {{x^2 - 27}}.",
    strategy: "Use the grid method",
  },

  // Q14 · single multiplier for an increase
  {
    id: "p4-q14",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Tom is asked to increase $275 by {{32 1/2}}%. Using a calculator, he multiplies 275 by a single number to get the correct answer. What single number does he use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 1.325 },
        verify: "(100+(32+1/2))/100",
        traps: [
          {
            spec: { type: "number", value: 0.325 },
            feedback:
              "0.325 only gives the {{32 1/2}}% that is added on. Tom needs the original 100% as well: 100% + 32.5% = 132.5%.",
          },
          {
            spec: { type: "number", value: 132.5 },
            feedback: "132.5 is the percentage. To turn it into a multiplier, divide by 100: 132.5% = 1.325.",
          },
          {
            spec: { type: "number", value: 0.675 },
            feedback:
              "0.675 would **decrease** the amount by {{32 1/2}}%. The multiplier for an increase is bigger than 1.",
          },
          {
            spec: { type: "number", value: 1.32 },
            feedback:
              "1.32 is the multiplier for a 32% increase: the {{1/2}}% has gone missing. 100% + 32.5% = 132.5%, so the multiplier is 1.325.",
          },
          {
            spec: { type: "number", value: 1.33 },
            feedback:
              "Don't round the multiplier: 1.33 would be a 33% increase. 100% + 32.5% = 132.5% exactly, so the multiplier is 1.325.",
          },
        ],
      },
    ],
    hints: [
      "After the increase, Tom has the original 100% plus another {{32 1/2}}%. What percentage is that altogether?",
      "Write {{32 1/2}}% as 32.5%. Then change the total percentage into a decimal by dividing by 100.",
    ],
    solution: [
      "An increase of {{32 1/2}}% means the new amount is 100% + {{32 1/2}}% of the original.",
      "{{32 1/2}}% = 32.5%",
      "100% + 32.5% = 132.5%",
      "As a decimal: 132.5 ÷ 100 = 1.325",
      "So Tom multiplies by **1.325**.",
      "Check: 1.325 is bigger than 1, so it makes the amount bigger ✓",
      "Using it on a calculator: 275 × 1.325 = 364.375, so the new amount is $364.38 (to the nearest cent).",
    ],
    commonError:
      "Using 0.325 (just the part that is added on) instead of 1.325, or losing the {{1/2}} and writing 1.32.",
    strategy: "Use the multiplier",
  },

  // Q15 · single multiplier for a decrease
  {
    id: "p4-q15",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Aditi is asked to decrease $3100 by {{15 1/2}}%. She multiplies 3100 by a single number to get the correct answer. What single number does she use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 0.845 },
        verify: "(100-(15+1/2))/100",
        traps: [
          {
            spec: { type: "number", value: 0.155 },
            feedback:
              "0.155 is the {{15 1/2}}% that comes **off**. The multiplier is what is left: 100% − 15.5% = 84.5%.",
          },
          {
            spec: { type: "number", value: 0.85 },
            feedback:
              "0.85 is the multiplier for a 15% decrease: the {{1/2}}% has gone missing. 100% − 15.5% = 84.5%, so the multiplier is 0.845.",
          },
          {
            spec: { type: "number", value: 84.5 },
            feedback: "84.5 is the percentage that is left. To turn it into a multiplier, divide by 100: 84.5% = 0.845.",
          },
          {
            spec: { type: "number", value: 0.84 },
            feedback:
              "Don't round the multiplier: 0.84 would be a 16% decrease. 100% − 15.5% = 84.5% exactly, so the multiplier is 0.845.",
          },
          {
            spec: { type: "number", value: 1.155 },
            feedback:
              "1.155 would **increase** the amount by {{15 1/2}}%. The multiplier for a decrease is less than 1: 100% − 15.5% = 84.5%.",
          },
        ],
      },
    ],
    hints: [
      "After a decrease of {{15 1/2}}%, what percentage of the original amount is left?",
      "Write {{15 1/2}}% as 15.5% and take it away from 100%. Then divide by 100 to make it a decimal.",
    ],
    solution: [
      "A decrease of {{15 1/2}}% leaves 100% − {{15 1/2}}% of the original amount.",
      "{{15 1/2}}% = 15.5%",
      "100% − 15.5% = 84.5%",
      "As a decimal: 84.5 ÷ 100 = 0.845",
      "So Aditi multiplies by **0.845**.",
      "Check: 0.845 is less than 1, so it makes the amount smaller ✓",
      "Using it: 3100 × 0.845 = 2619.5, so the new amount is $2619.50.",
    ],
    commonError:
      "Using 0.155 (the part that comes off) instead of 0.845 (the part that is left), or dropping the {{1/2}}% and writing 0.85, which is the multiplier for a 15% decrease.",
    strategy: "Use the multiplier",
  },

  // Q16 · dividing algebraic fractions
  {
    id: "p4-q16",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "challenge",
    question: "Write the answer to this calculation in its simplest form: {{(21k^2)/10}} ÷ {{(14k)/(25m)}}",
    parts: [
      {
        prompt: "If the bottom of your answer has more than one factor, type it in brackets, e.g. 5/(2a).",
        marks: 3,
        answer: { type: "expression", expr: "15km/4", form: "simplified", display: "{{(15k m)/4}}" },
        verify: "(21k^2/10)/(14k/(25m))",
        traps: [
          {
            spec: { type: "expression", expr: "147k^3/(125m)" },
            feedback:
              "You multiplied straight across without flipping. Keep, Change, Flip: {{(21k^2)/10}} × {{(25m)/(14k)}}.",
          },
          {
            spec: { type: "expression", expr: "15m/4" },
            feedback:
              "{{k^2}} means k × k. Only one k cancels with the k on the bottom, so one k is left on the top: {{(15k m)/4}}.",
          },
          {
            spec: { type: "expression", expr: "4/(15km)" },
            feedback:
              "Your answer is upside down: you flipped the first fraction instead of the second. Keep the first fraction, change ÷ to ×, and flip the second one.",
          },
        ],
      },
    ],
    hints: [
      "Dividing by a fraction is the same as multiplying by its reciprocal: Keep, Change, Flip.",
      "After flipping, look for common factors: 21 and 14 share a factor of 7, and 25 and 10 share a factor of 5.",
      "{{k^2}} is k × k. One k cancels with the k on the bottom. Where does the other k end up?",
    ],
    solution: [
      "Keep, Change, Flip: keep the first fraction, change ÷ to ×, flip the second fraction.\n\n    {{(21k^2)/10}} ÷ {{(14k)/(25m)}} = {{(21k^2)/10}} × {{(25m)/(14k)}}",
      "Multiply the tops: 21 × 25 = 525, so the top is {{525k^2m}}.",
      "Multiply the bottoms: 10 × 14 = 140, so the bottom is 140k.",
      "So far: {{(525k^2m)/(140k)}}",
      "Cancel the numbers. The HCF of 525 and 140 is 35:\n\n    525 ÷ 35 = 15\n    140 ÷ 35 = 4",
      "Cancel the k's: {{k^2/k = k}}, which stays on the top. The m stays on the top too.",
      "Answer: **{{(15k m)/4}}**",
    ],
    altMethod: {
      label: "Cancel before you multiply (quicker)",
      steps: [
        "After flipping: {{(21k^2)/10}} × {{(25m)/(14k)}}",
        "21 and 14 share 7: 21 ÷ 7 = 3 and 14 ÷ 7 = 2",
        "25 and 10 share 5: 25 ÷ 5 = 5 and 10 ÷ 5 = 2",
        "{{k^2}} and k share k: {{k^2}} ÷ k = k, and k ÷ k = 1",
        "Multiply the tops: 3 × 5 = 15, so the top is {{15k m}}",
        "Multiply the bottoms: 2 × 2 = 4",
        "Answer: {{(15k m)/4}}",
      ],
    },
    commonError:
      "Forgetting to flip the second fraction (or flipping the first one instead), or cancelling {{k^2}} with k completely so that no k is left.",
    strategy: "Spot the common factor",
  },

  // Q17 · a changing ratio: adults arrive
  {
    id: "p4-q17",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "At a concert, some of the audience are adults and the rest are children. 45% of the audience are adults. Then 22 more adults arrive. The ratio of adults to children is now 1 : 1. How many children are at the concert?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 121, display: "121 children" },
        verify: "22/((100-45)-45)*(100-45)",
        traps: [
          {
            spec: { type: "number", value: 220 },
            feedback:
              "220 is the number of people at the concert **before** the 22 adults arrive. The question asks how many children there are.",
          },
          {
            spec: { type: "number", value: 242 },
            feedback:
              "242 is everyone at the concert **after** the 22 adults arrive (121 adults and 121 children). The question asks for the children only.",
          },
          {
            spec: { type: "number", value: 99 },
            feedback: "99 is the number of adults at the start. The question asks for the number of children.",
          },
          {
            spec: { type: "number", value: 11 },
            feedback: "11 is x, the size of one part. The number of children is 11x.",
          },
        ],
      },
    ],
    hints: [
      "45% are adults, so what percentage are children? Write adults : children as a ratio in its simplest form.",
      "Call the number of adults 9x and the number of children 11x. After 22 more adults arrive, how many adults are there? Do the children change?",
      "The new ratio 1 : 1 means the two groups are now equal. Write an equation, solve it for x, then answer the question that is asked.",
    ],
    solution: [
      "The rest of the audience are children: 100% − 45% = 55%.",
      "Adults : children = 45 : 55 = 9 : 11 (divide both by 5).",
      "Let the number of adults be 9x and the number of children be 11x.",
      "22 more adults arrive, so there are now 9x + 22 adults. The children don't change: there are still 11x.",
      "The new ratio is (9x + 22) : 11x = 1 : 1, so the two groups are equal:\n\n    9x + 22 = 11x",
      "Take 9x from both sides:\n\n    22 = 2x",
      "Divide both sides by 2:\n\n    x = 11",
      "Children = 11x:\n\n    11 × 11 = 121",
      "There are **121 children** at the concert.",
      "Check:\n\n    adults at the start: 9 × 11 = 99\n    adults after: 99 + 22 = 121\n    121 : 121 = 1 : 1 ✓",
    ],
    altMethod: {
      label: "Use a bar model",
      steps: [
        "Adults : children = 45 : 55 = 9 : 11, so draw 9 equal boxes for the adults and 11 equal boxes for the children.",
        "The children have 11 − 9 = 2 more boxes than the adults.",
        "The 22 new adults make the two groups equal, so they fill exactly those 2 boxes.",
        "1 box = 22 ÷ 2 = 11 people.",
        "Children = 11 boxes: 11 × 11 = 121.",
      ],
    },
    commonError:
      "Giving a total (220 people at the start, or 242 after the adults arrive) instead of the number of children, or changing the number of children too. Only the adults change: the children stay at 11x.",
    strategy: "Introduce a variable",
  },

  // Q18 · next term and nth term of a quadratic sequence
  {
    id: "p4-q18",
    topic: "sq",
    section: "sq-quadratic",
    difficulty: "challenge",
    question: "Here are the first six terms of a sequence:\n\n0, 13, 36, 69, 112, 165",
    parts: [
      {
        label: "a",
        prompt: "Find the next term in the sequence.",
        marks: 1,
        answer: { type: "number", value: 228 },
        verify: "165+(165-112)+((165-112)-(112-69))",
        traps: [
          {
            spec: { type: "number", value: 218 },
            feedback:
              "218 adds on 53 again, as if the sequence were linear. The first differences go up by 10 each time, so the next one is 53 + 10 = 63.",
          },
          {
            spec: { type: "number", value: 175 },
            feedback:
              "175 adds the second difference (10) on to the last term. Add the next **first** difference instead: 53 + 10 = 63.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the nth term in this sequence.",
        marks: 4,
        answer: { type: "expression", expr: "5n^2-2n-3" },
        verify: "terms:0,13,36,69,112,165",
        traps: [
          {
            spec: { type: "expression", expr: "5n^2-2n-5" },
            feedback:
              "After taking away {{5n^2}} you get −5, −7, −9, … The −5 is the 1st term of that linear sequence, not the zeroth term. One step back is −5 + 2 = −3, so the linear part is −2n − 3.",
          },
          {
            spec: { type: "expression", expr: "5n^2+2n-3" },
            feedback:
              "After taking away {{5n^2}}, what's left goes **down** by 2 each time (−5, −7, −9, …), so the n term is −2n, not +2n.",
          },
        ],
      },
    ],
    hints: [
      "Work out the first differences, then the second differences. What do you notice about the second differences?",
      "Halve the second difference to get the number in front of {{n^2}}. Then take that many lots of {{n^2}} away from each term.",
      "What's left is a linear sequence. Find its nth term (difference × n + zeroth term) and add it on.",
    ],
    solution: [
      "Find the differences:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 0 | 13 | 36 | 69 | 112 | 165 |\n| 1st difference | | +13 | +23 | +33 | +43 | +53 |\n| 2nd difference | | | +10 | +10 | +10 | +10 |",
      "The second difference is always +10, so the sequence is quadratic.",
      "(a) The next first difference is 10 more than the last one:\n\n    53 + 10 = 63",
      "Add it on to the last term:\n\n    165 + 63 = 228\n\nThe next term is **228**.",
      "(b) Halve the second difference to get the number in front of {{n^2}}:\n\n    10 ÷ 2 = 5\n\nSo the nth term starts with {{5n^2}}.",
      "Take {{5n^2}} away from each term:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 0 | 13 | 36 | 69 | 112 | 165 |\n| {{5n^2}} | 5 | 20 | 45 | 80 | 125 | 180 |\n| term − {{5n^2}} | −5 | −7 | −9 | −11 | −13 | −15 |",
      "What's left (−5, −7, −9, −11, …) is linear: it goes down by 2 each time, so it starts with −2n.",
      "Its zeroth term is one step back from −5:\n\n    −5 + 2 = −3\n\nSo what's left is −2n − 3.",
      "Put the two parts together: the nth term is **{{5n^2 - 2n - 3}}**.",
      "Check with n = 4:\n\n    5 × 4² = 80\n    2 × 4 = 8\n    80 − 8 − 3 = 69 ✓",
    ],
    commonError:
      "Using the second difference (10) as the number in front of {{n^2}} instead of halving it, or using the first leftover (−5) as the constant instead of the zeroth term (−3).",
    strategy: "Look at the differences",
  },

  // Q19 · extra practice: completing a pattern table (like 6(a) in the class test)
  {
    id: "p4-q19",
    topic: "sq",
    section: "sq-nth",
    difficulty: "challenge",
    question:
      "**Extra practice: completing a pattern table** (like 6(a) in your class test).\n\nSiti uses dots to make a growing T-shaped pattern, as shown below. The first pattern uses 4 dots.",
    diagram: dotPatterns([[3, 1], [6, 1, 1, 1], [9, 1, 1, 1, 1, 1]], "dots"),
    table: {
      headers: ["Pattern number", "1", "2", "3", "4"],
      rows: [["Number of dots", "4", "?", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many dots are used for patterns 2, 3 and 4. Pattern 4 is not drawn, so continue the pattern. Type the three numbers in order, separated by commas.",
        marks: 2,
        answer: { type: "list", values: [9, 14, 19], ordered: true },
        verify: "6+3, 9+5, 12+7",
        traps: [
          {
            spec: { type: "list", values: [7, 10, 13], ordered: true },
            feedback:
              "You've only counted the 3 extra dots on the top row. The stem grows too: it gets 2 more dots each time. So each pattern has 3 + 2 = 5 more dots than the one before.",
          },
          {
            spec: { type: "list", values: [9, 14, 18], ordered: true },
            feedback:
              "9 and 14 are right, but check pattern 4: its top row has 12 dots and its stem has 7 dots. Then check the differences: they should all be the same.",
          },
          {
            spec: { type: "list", values: [4, 9, 14, 19], ordered: true },
            feedback:
              "These numbers are right, but the 4 for pattern 1 is already in the table. Only the three missing values (patterns 2, 3 and 4) were asked for.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the number of dots in pattern n.",
        marks: 1,
        answer: { type: "expression", expr: "5n-1" },
        verify: "terms:3+1, 6+3, 9+5",
        traps: [
          {
            spec: { type: "expression", expr: "5n+4" },
            feedback:
              "4 is the 1st term, not the zeroth term. One step back from 4 is 4 − 5 = −1, so the expression is 5n − 1. (Check: 5n + 4 gives 9 dots for pattern 1, not 4.)",
          },
          {
            spec: { type: "expression", expr: "n+5" },
            feedback: "n + 5 only goes up by 1 each time. The difference, 5, goes **in front of** n: start with 5n, then adjust.",
          },
          {
            spec: { type: "expression", expr: "5n+1" },
            feedback: "Check it with pattern 1: 5 × 1 + 1 = 6, but pattern 1 has 4 dots. The zeroth term is 4 − 5 = −1, so it's 5n − 1.",
          },
        ],
      },
      {
        label: "c",
        prompt: "Which pattern uses 124 dots?",
        marks: 1,
        answer: { type: "number", value: 25, display: "Pattern 25" },
        verify: "(124-(3+1))/((6+3)-(3+1))+1",
        traps: [
          {
            spec: { type: "number", value: 619 },
            feedback:
              "619 is the number of dots in pattern 124 (5 × 124 − 1). The question asks which pattern has 124 dots, so solve 5n − 1 = 124.",
          },
          {
            spec: { type: "number", value: 24 },
            feedback:
              "From pattern 1 (4 dots) up to 124 dots is 120 ÷ 5 = 24 jumps of 5, so it's 24 patterns after pattern 1, which is pattern 25.",
          },
          {
            spec: { type: "number", value: 24.8, tolerance: 0.01 },
            feedback:
              "124 ÷ 5 = 24.8 comes from solving 5n = 124, but the expression is 5n − 1. Add the 1 first: 5n − 1 = 124, so 5n = 125. A pattern number is always a whole number.",
          },
          {
            spec: { type: "number", value: 24.6, tolerance: 0.01 },
            feedback: "That's solving 5n = 123. The expression is 5n − 1, so add 1 to both sides: 5n = 125, n = 25.",
          },
        ],
      },
    ],
    hints: [
      "Fill in **every** empty cell before you look for a rule. Count the dots in patterns 2 and 3 from the picture: the top row, then the stem.",
      "Pattern 4 isn't drawn. What changes from one pattern to the next? Look at the top row and the stem separately, or sketch pattern 4.",
      "Check your finished row with the differences: are they all the same? That difference goes in front of n. For (c), make your expression equal to 124 and solve.",
    ],
    solution: [
      "(a) Count the dots in each pattern: the top row plus the stem.",
      "Pattern 1: 3 + 1 = 4 (given)",
      "Pattern 2: 6 + 3 = 9",
      "Pattern 3: 9 + 5 = 14",
      "Pattern 4 is not drawn. Each time, the top row gets 3 more dots and the stem gets 2 more dots, so pattern 4 has a top row of 12 dots and a stem of 7 dots:\n\n    12 + 7 = 19",
      "The completed table:\n\n| Pattern number | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Number of dots | 4 | **9** | **14** | **19** |",
      "Check with the differences: 4 → 9 → 14 → 19 goes +5, +5, +5 ✓ (all the same).",
      "(b) The difference is 5, so the expression starts with 5n.",
      "The zeroth term is one step back from pattern 1:\n\n    4 − 5 = −1\n\nSo the number of dots in pattern n is **5n − 1**.",
      "Check with pattern 4:\n\n    5 × 4 − 1 = 19 ✓",
      "(c) Make the expression equal to 124 and solve:\n\n    5n − 1 = 124\n    5n = 125\n    n = 25",
      "So **pattern 25** uses 124 dots. Check: 5 × 25 − 1 = 124 ✓",
    ],
    altMethod: {
      label: "Use the picture",
      steps: [
        "Pattern n has a top row of 3n dots and a stem of 2n − 1 dots (pattern 3: a top row of 9 and a stem of 5).",
        "Total: 3n + (2n − 1) = 5n − 1 dots.",
        "For 124 dots: 5n − 1 = 124, so 5n = 125 and n = 25.",
        "Check: pattern 25 has a top row of 75 dots and a stem of 49 dots, and 75 + 49 = 124 ✓",
      ],
    },
    commonError:
      "Leaving the table blank and jumping straight to the rule (6(a) in the class test was left blank and lost its mark). Fill in every '?', including pattern 4, which isn't drawn, and check that the differences are all the same before you find the nth term.",
    strategy: "Look at the differences",
  },

  // Q20 · extra practice: a changing ratio (like question 17 in the class test)
  {
    id: "p4-q20",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "**Extra practice: a changing ratio** (like question 17 in your class test).\n\nA rescue centre looks after some cats and dogs. 35% of the animals are cats, and the rest are dogs. Then 9 of the cats go to new homes. The ratio of cats to dogs is now 2 : 5. How many dogs are at the rescue centre?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 65, display: "65 dogs" },
        verify: "9/(35-2/5*(100-35))*(100-35)",
        traps: [
          {
            spec: { type: "number", value: 100 },
            feedback: "100 is the number of animals at the start. The question asks how many dogs there are.",
          },
          {
            spec: { type: "number", value: 91 },
            feedback:
              "91 is the number of animals after the 9 cats leave (26 cats and 65 dogs). The question asks for the dogs only.",
          },
          {
            spec: { type: "number", value: 35 },
            feedback: "35 is the number of cats at the start. The question asks for the number of dogs.",
          },
          {
            spec: { type: "number", value: 5 },
            feedback: "5 is x, the size of one part. The number of dogs is 13x.",
          },
        ],
      },
    ],
    hints: [
      "35% are cats, so what percentage are dogs? Write cats : dogs as a ratio in its simplest form.",
      "Call the number of cats 7x and the number of dogs 13x. After 9 cats leave, how many cats are there? Do the dogs change?",
      "Set (7x − 9) : 13x equal to 2 : 5 and solve for x. Then answer the question that is asked: the dogs.",
    ],
    solution: [
      "The rest of the animals are dogs: 100% − 35% = 65%.",
      "Cats : dogs = 35 : 65 = 7 : 13 (divide both by 5).",
      "Let the number of cats be 7x and the number of dogs be 13x.",
      "9 cats leave, so there are now 7x − 9 cats. The dogs don't change: there are still 13x.",
      "The new ratio is 2 : 5:\n\n    (7x − 9) : 13x = 2 : 5",
      "Write both ratios as fractions, then cross-multiply:\n\n    {{(7x - 9)/(13x) = 2/5}}\n    5(7x − 9) = 2 × 13x",
      "Multiply out both sides:\n\n    35x − 45 = 26x",
      "Take 26x from both sides:\n\n    9x − 45 = 0",
      "Add 45 to both sides:\n\n    9x = 45",
      "Divide both sides by 9:\n\n    x = 5",
      "Dogs = 13x:\n\n    13 × 5 = 65",
      "There are **65 dogs** at the rescue centre.",
      "Check:\n\n    cats at the start: 7 × 5 = 35\n    cats after: 35 − 9 = 26\n    26 : 65 = 2 : 5 ✓ (divide both by 13)",
    ],
    altMethod: {
      label: "Make the dogs' part the same in both ratios (ratio table)",
      steps: [
        "The dogs don't change, so give the dogs the same number of parts in both ratios.",
        "Before: cats : dogs = 7 : 13. After: cats : dogs = 2 : 5.",
        "The LCM of 13 and 5 is 65, so 7 : 13 = 35 : 65 (× 5) and 2 : 5 = 26 : 65 (× 13).",
        "The cats go from 35 parts to 26 parts, so they lose 35 − 26 = 9 parts.",
        "Those 9 parts are the 9 cats that left, so 1 part = 9 ÷ 9 = 1 animal.",
        "Dogs = 65 parts = 65 × 1 = 65 dogs.",
      ],
    },
    commonError:
      "Giving a total (100 animals at the start, or 91 after the cats leave) instead of the number of dogs, or changing the number of dogs too. Only the cats change: the dogs stay at 13x.",
    strategy: "Introduce a variable",
  },
];
