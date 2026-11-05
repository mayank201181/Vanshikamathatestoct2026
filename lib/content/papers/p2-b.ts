import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 2, questions 11–20. See docs/papers-blueprint.md. */
export const P2_B: QA[] = [
  // Q11 · expand and simplify a difference of brackets (2 marks)
  {
    id: "p2-q11",
    topic: "ex",
    section: "ex-expand",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{5(3y - 1) - 2(4y + 3)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "7y-11", form: "simplified" },
        verify: "5(3y-1)-2(4y+3)",
        traps: [
          {
            spec: { type: "expression", expr: "7y+1" },
            feedback: "The second bracket is multiplied by **−2**, so −2 × 3 = **−6**, not +6. That gives 15y − 5 − 8y − 6.",
          },
          {
            spec: { type: "expression", expr: "23y+1" },
            feedback: "You've added 2(4y + 3) instead of subtracting it. Multiply the second bracket by −2: −2 × 4y = −8y and −2 × 3 = −6.",
          },
          {
            spec: { type: "expression", expr: "7y-2" },
            feedback: "Multiply **every** term in the second bracket by −2: −2 × 4y = −8y and −2 × 3 = −6.",
          },
          {
            spec: { type: "expression", expr: "7y-7" },
            feedback: "Multiply **every** term in the first bracket by 5: 5 × 3y = 15y and 5 × (−1) = −5.",
          },
        ],
      },
    ],
    hints: [
      "Expand each bracket on its own first. The second bracket is multiplied by −2, so keep the minus sign with the 2.",
      "−2 × 4y and −2 × 3 are both negative. Then collect the y terms and the number terms separately.",
    ],
    solution: [
      "Expand the first bracket:\n\n    5 × 3y = 15y\n    5 × (−1) = −5\n\nSo {{5(3y - 1) = 15y - 5}}.",
      "Expand the second bracket. It is multiplied by **−2**:\n\n    −2 × 4y = −8y\n    −2 × 3 = −6\n\nSo {{-2(4y + 3) = -8y - 6}}.",
      "Put the two parts together: {{15y - 5 - 8y - 6}}.",
      "Collect the like terms:\n\n    15y − 8y = 7y\n    −5 − 6 = −11",
      "Answer: **7y − 11**",
      "Check by substituting y = 1 into the question and into the answer:\n\n    5 × (3 − 1) = 10\n    2 × (4 + 3) = 14\n    10 − 14 = −4\n    7 × 1 − 11 = −4 ✓",
    ],
    commonError: "Writing −2(4y + 3) as −8y + 6. The minus belongs to the 2, so it multiplies both terms: −2 × 3 = −6.",
    strategy: "Check by substituting",
  },

  // Q12 · increase by more than 100% (2 marks)
  {
    id: "p2-q12",
    topic: "pc",
    section: "pc-change",
    difficulty: "warmup",
    question: "Increase $350 by 120%",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 770, display: "$770" },
        verify: "350*(1+120/100)",
        traps: [
          {
            spec: { type: "number", value: 420 },
            feedback: "$420 is 120% **of** $350 (350 × 1.2). That is only the increase: add it on to the $350 you started with.",
          },
          {
            spec: { type: "number", value: 470 },
            feedback: "$470 adds on $120, but the increase is 120% of $350, not $120. Work out 120% of $350 first.",
          },
        ],
      },
    ],
    hints: [
      "Increasing by 120% means you keep the original 100% and add another 120% on top. What percentage of $350 do you end up with?",
      "Change that percentage into a multiplier (divide by 100), then multiply $350 by it.",
    ],
    solution: [
      "Increasing by 120% means you end up with 100% + 120% = 220% of the original amount.",
      "Change 220% into a multiplier:\n\n    220 ÷ 100 = 2.2",
      "Multiply:\n\n    350 × 2.2 = 770\n\nThe answer is **$770**.",
      "Check using 10%:\n\n    10% of $350 = $35\n    120% is 12 lots of 10%: 12 × $35 = $420\n    $350 + $420 = $770 ✓",
    ],
    commonError: "Working out 120% of $350 ($420) and stopping there. An increase of 120% means you add the $420 on to the original $350.",
    strategy: "Use the multiplier",
  },

  // Q13 · expand a pair of brackets (2 marks)
  {
    id: "p2-q13",
    topic: "ex",
    section: "ex-double",
    difficulty: "core",
    question: "Expand the brackets and simplify this expression: {{(x - 6)(x - 4)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "x^2-10x+24", form: "expanded" },
        verify: "(x-6)(x-4)",
        traps: [
          {
            spec: { type: "expression", expr: "x^2-10x-24" },
            feedback: "Check the last box: −6 × (−4) = **+24**. A negative times a negative is positive.",
          },
          {
            spec: { type: "expression", expr: "x^2+10x+24" },
            feedback: "Check the middle terms: x × (−4) = −4x and −6 × x = −6x, so together they make −10x, not +10x.",
          },
          {
            spec: { type: "expression", expr: "x^2-24" },
            feedback: "The grid has four boxes. You've lost the two middle ones (−4x and −6x), and −6 × (−4) = +24, not −24.",
          },
          {
            spec: { type: "expression", expr: "x^2+24" },
            feedback: "The grid has four boxes, not two. Don't lose the middle terms: x × (−4) = −4x and −6 × x = −6x.",
          },
        ],
      },
    ],
    hints: [
      "Use the grid method: put x and −6 down the side, and x and −4 along the top. Fill in all four boxes.",
      "Keep each sign with its number: −6 × (−4) is positive. Then collect the two x terms.",
    ],
    solution: [
      "Grid method for (x − 6)(x − 4):\n\n| × | x | −4 |\n|---|---|---|\n| x | {{x^2}} | −4x |\n| −6 | −6x | +24 |",
      "The four boxes, one calculation on each line:\n\n    x × x = x²\n    x × (−4) = −4x\n    −6 × x = −6x\n    −6 × (−4) = +24",
      "Add the four boxes: {{x^2 - 4x - 6x + 24}}.",
      "Collect the x terms:\n\n    −4x − 6x = −10x",
      "Answer: **x² − 10x + 24**",
      "Check by substituting x = 1 into the question and into the answer:\n\n    1 − 6 = −5\n    1 − 4 = −3\n    (−5) × (−3) = 15\n    1 − 10 + 24 = 15 ✓",
    ],
    commonError: "Getting a sign wrong: −6 × (−4) = +24 (not −24), and −4x − 6x = −10x (not +10x).",
    strategy: "Use the grid method",
  },

  // Q14 · single multiplier for a small increase (2 marks)
  {
    id: "p2-q14",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Mei is asked to increase $380 by 6%. Using a calculator, she multiplies 380 by a single number to get the correct answer. What single number does she use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 1.06 },
        verify: "1+6/100",
        traps: [
          {
            spec: { type: "number", value: 1.6 },
            feedback: "1.6 is the multiplier for a **60%** increase (1.6 = 160%). 6% as a decimal is 6 ÷ 100 = 0.06, not 0.6, so the multiplier is 1 + 0.06.",
          },
          {
            spec: { type: "number", value: 0.06 },
            feedback: "× 0.06 finds only the 6% that is added on ($22.80). Mei wants the new amount, which is 100% + 6% = 106% of $380.",
          },
          {
            spec: { type: "number", value: 106 },
            feedback: "106 is the percentage (106%). To turn it into a multiplier, divide by 100.",
          },
          {
            spec: { type: "number", value: 402.8 },
            feedback: "$402.80 is the answer to the calculation. The question asks for the single number she multiplies 380 by.",
          },
          {
            spec: { type: "number", value: 0.94 },
            feedback: "× 0.94 would decrease $380 by 6%. Mei is increasing it, so add the 6% on: 100% + 6% = 106%.",
          },
        ],
      },
    ],
    hints: [
      "Mei keeps all of the $380 (100%) and adds another 6%. What percentage of $380 does she end up with?",
      "Change that percentage into a decimal by dividing by 100. Careful: 6% is 6 hundredths.",
    ],
    solution: [
      "Increasing by 6% means you end up with 100% + 6% = 106% of the original amount.",
      "Change 106% into a decimal:\n\n    106 ÷ 100 = 1.06",
      "So she multiplies by **1.06**.",
      "Check that it works:\n\n    380 × 1.06 = 402.8\n    6% of 380 = 22.8\n    380 + 22.8 = 402.8 ✓\n\nThe new amount is $402.80.",
    ],
    commonError: "Writing 6% as 0.6 and using 1.6, which is the multiplier for a 60% increase. 6% = 0.06, so the multiplier is 1.06.",
    strategy: "Use the multiplier",
  },

  // Q15 · single multiplier for a decrease (2 marks)
  {
    id: "p2-q15",
    topic: "pc",
    section: "pc-multipliers",
    difficulty: "core",
    question:
      "Omar is asked to decrease $1340 by 37%. He multiplies 1340 by a single number to get the correct answer. What single number does he use?",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 0.63 },
        verify: "1-37/100",
        traps: [
          {
            spec: { type: "number", value: 0.37 },
            feedback: "× 0.37 finds the 37% that comes **off**. The multiplier is what is left: 100% − 37% = 63%.",
          },
          {
            spec: { type: "number", value: 1.37 },
            feedback: "1.37 is the multiplier for a 37% **increase**. For a decrease, take the 37% away from 100%.",
          },
          {
            spec: { type: "number", value: 63 },
            feedback: "63 is the percentage that is left (63%). To turn it into a multiplier, divide by 100.",
          },
          {
            spec: { type: "number", value: 844.2 },
            feedback: "$844.20 is the answer to the calculation. The question asks for the single number he multiplies 1340 by.",
          },
        ],
      },
    ],
    hints: [
      "After a 37% decrease, what percentage of the $1340 is left?",
      "Change that percentage into a decimal by dividing by 100.",
    ],
    solution: [
      "Decreasing by 37% leaves 100% − 37% = 63% of the original amount.",
      "Change 63% into a decimal:\n\n    63 ÷ 100 = 0.63",
      "So he multiplies by **0.63**.",
      "Check that it works:\n\n    1340 × 0.63 = 844.2\n    37% of 1340 = 495.8\n    1340 − 495.8 = 844.2 ✓\n\nThe new amount is $844.20.",
    ],
    commonError: "Using 0.37 (the part taken off) instead of 0.63 (the part that is left).",
    strategy: "Use the multiplier",
  },

  // Q16 · divide algebraic fractions (3 marks)
  {
    id: "p2-q16",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "challenge",
    question: "Write the answer to this calculation in its simplest form: {{(18p^2q)/5}} ÷ {{(6pq^2)/25}}",
    parts: [
      {
        marks: 3,
        answer: { type: "expression", expr: "15p/q", form: "simplified" },
        verify: "((18p^2q)/5)/((6pq^2)/25)",
        traps: [
          {
            spec: { type: "expression", expr: "108p^3q^3/125" },
            feedback: "You multiplied without flipping. To divide, Keep the first fraction, Change ÷ to ×, and Flip the second: {{(18p^2q)/5 * 25/(6pq^2)}}.",
          },
          {
            spec: { type: "expression", expr: "q/(15p)" },
            feedback: "Your answer is upside down: you flipped the first fraction instead of the second. Keep {{(18p^2q)/5}} and flip {{(6pq^2)/25}} to {{25/(6pq^2)}}.",
          },
          {
            spec: { type: "expression", expr: "15p" },
            feedback: "The q's don't cancel completely: {{q/q^2 = 1/q}}, so one q is left on the bottom.",
          },
          {
            spec: { type: "expression", expr: "15q/p" },
            feedback: "Check where each leftover letter goes: {{p^2/p}} leaves a p on the top, and {{q/q^2}} leaves a q on the bottom.",
          },
        ],
      },
    ],
    hints: [
      "Dividing by a fraction is the same as multiplying by its reciprocal: Keep, Change, Flip.",
      "After flipping, multiply the tops together and the bottoms together (or cancel common factors first).",
      "Simplify the numbers, then deal with each letter on its own: does it end up on the top or on the bottom?",
    ],
    solution: [
      "Keep, Change, Flip: keep the first fraction, change ÷ to ×, and flip the second fraction.\n\n    {{(18p^2q)/5 * 25/(6pq^2)}}",
      "Multiply the tops:\n\n    18p²q × 25 = 450p²q",
      "Multiply the bottoms:\n\n    5 × 6pq² = 30pq²",
      "So the answer is {{(450p^2q)/(30pq^2)}} before it is simplified.",
      "Simplify the numbers:\n\n    450 ÷ 30 = 15",
      "Simplify the letters:\n\n    {{p^2/p = p}} (one p is left on the top)\n    {{q/q^2 = 1/q}} (one q is left on the bottom)",
      "Answer: **{{15p/q}}**",
    ],
    altMethod: {
      label: "Cancel before you multiply",
      steps: [
        "After flipping, the calculation is {{(18p^2q)/5 * 25/(6pq^2)}}.",
        "18 and 6 share a factor of 6: 18 ÷ 6 = 3 and 6 ÷ 6 = 1.",
        "25 and 5 share a factor of 5: 25 ÷ 5 = 5 and 5 ÷ 5 = 1.",
        "The numbers left on the top are 3 and 5, and 3 × 5 = 15.",
        "Letters: {{p^2/p = p}} stays on the top, and {{q/q^2 = 1/q}} puts a q on the bottom.",
        "Answer: {{15p/q}} ✓",
      ],
    },
    commonError: "Multiplying straight across without flipping the second fraction. To divide, Keep, Change, Flip, and only then multiply and cancel.",
    strategy: "Spot the common factor",
  },

  // Q17 · changing ratio: one group grows (3 marks)
  {
    id: "p2-q17",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "Mr Lim has a class library. Some of the books are fiction, and the rest are non-fiction. He notices that 25% of the books are fiction. He adds 30 new fiction books to the library. He observes that the ratio of fiction books to non-fiction books is now 2 : 3. How many non-fiction books are in the library?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 90, display: "90 non-fiction books" },
        verify: "(1-25/100)*(3*30)/(2*(1-25/100)-3*25/100)",
        traps: [
          {
            spec: { type: "number", value: 120 },
            feedback: "120 is the total number of books at the start. The question asks for the non-fiction books only.",
          },
          {
            spec: { type: "number", value: 150 },
            feedback: "150 is the total number of books after the new ones are added. The question asks for the non-fiction books only.",
          },
          {
            spec: { type: "number", value: 30 },
            feedback: "30 is the number of fiction books at the start (1 part). At the start fiction : non-fiction = 1 : 3, so there are 3 times as many non-fiction books.",
          },
          {
            spec: { type: "number", value: 60 },
            feedback: "60 is the number of fiction books after the new ones are added. The question asks for the non-fiction books.",
          },
          {
            spec: { type: "number", value: 72 },
            feedback: "25% fiction means fiction is 1 part out of 4 altogether, so fiction : non-fiction = 25 : 75 = 1 : 3, not 1 : 4. Let fiction = x and non-fiction = 3x.",
          },
        ],
      },
    ],
    hints: [
      "25% of the books are fiction. What percentage are non-fiction? Write fiction : non-fiction as a ratio in its simplest form.",
      "Call the number of fiction books x and write the non-fiction books in terms of x. Which of the two numbers changes when the new books arrive?",
      "Write the new ratio as (fiction + 30) : non-fiction = 2 : 3, turn it into an equation and solve it. Then answer the question that is asked.",
    ],
    solution: [
      "25% of the books are fiction, so 100% − 25% = 75% are non-fiction.",
      "Fiction : non-fiction = 25 : 75 = 1 : 3. So let fiction = x and non-fiction = 3x.",
      "He adds 30 fiction books. The non-fiction books don't change, and the new ratio is 2 : 3:\n\n    (x + 30) : 3x = 2 : 3",
      "Write the ratios as equal fractions, cross-multiply and solve:\n\n    {{(x + 30)/(3x) = 2/3}}\n    3(x + 30) = 2 × 3x\n    3x + 90 = 6x\n    90 = 3x\n    x = 30",
      "The non-fiction books are 3x:\n\n    3 × 30 = 90\n\nThere are **90 non-fiction books**.",
      "Check with a table:\n\n| | Fiction | Non-fiction | Total |\n|---|---|---|---|\n| At the start | 30 | 90 | 120 |\n| After adding 30 | 60 | 90 | 150 |\n\n30 out of 120 is 25% ✓ and 60 : 90 = 2 : 3 (divide both by 30) ✓",
    ],
    altMethod: {
      label: "Bar model: make the parts match",
      steps: [
        "At the start, fiction : non-fiction = 1 : 3. Draw 1 box for fiction and 3 boxes for non-fiction.",
        "At the end, fiction : non-fiction = 2 : 3. The non-fiction books haven't changed and are 3 boxes in both ratios, so the boxes are the same size as before.",
        "Fiction has grown from 1 box to 2 boxes. The extra box is the 30 new books, so 1 box = 30 books.",
        "Non-fiction is 3 boxes: 3 × 30 = 90 books.",
      ],
    },
    commonError: "Using 1 : 4 as the starting ratio (25% is 1 part out of 4 in total, so fiction : non-fiction is 1 : 3), or giving the total number of books instead of the non-fiction books the question asks for.",
    strategy: "Introduce a variable",
  },

  // Q18 · quadratic sequence: next term and nth term (5 marks)
  {
    id: "p2-q18",
    topic: "sq",
    section: "sq-quadratic",
    difficulty: "challenge",
    question: "Here are the first six terms of a sequence: 1, 12, 29, 52, 81, 116.",
    parts: [
      {
        label: "a",
        prompt: "Find the next term in the sequence.",
        marks: 1,
        answer: { type: "number", value: 157 },
        verify: "116+(116-81)+((116-81)-(81-52))",
        traps: [
          {
            spec: { type: "number", value: 151 },
            feedback: "151 adds the last first difference (35) again, as if the sequence were linear. The first differences go up by 6 each time, so the next one is 35 + 6 = 41.",
          },
          {
            spec: { type: "number", value: 122 },
            feedback: "122 adds the second difference (6) to the last term. Add the next **first** difference instead: 35 + 6 = 41.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the nth term in this sequence.",
        marks: 4,
        answer: { type: "expression", expr: "3n^2+2n-4" },
        verify: "terms:1,12,29,52,81,116",
        traps: [
          {
            spec: { type: "expression", expr: "3n^2-2" },
            feedback: "After subtracting {{3n^2}}, what's left is −2, 0, 2, 4, 6, 8. That isn't a constant: it goes up by 2, so it needs its own nth term.",
          },
          {
            spec: { type: "expression", expr: "3n^2+2n-2" },
            feedback: "What's left after subtracting {{3n^2}} is −2, 0, 2, 4, … Its zeroth term is −2 − 2 = −4, not −2, so the linear part is 2n − 4.",
          },
          {
            spec: { type: "expression", expr: "3n^2+2n" },
            feedback: "Don't drop the number on the end: what's left after subtracting {{3n^2}} is 2n − 4, not 2n.",
          },
        ],
      },
    ],
    hints: [
      "Write the first differences between the terms, then the second differences.",
      "For (a), the second difference stays the same, so use it to find the next first difference.",
      "For (b), halve the second difference to get the number in front of {{n^2}}. Subtract that many lots of {{n^2}} from each term, then find the nth term of what's left.",
    ],
    solution: [
      "(a) Find the differences:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| term | 1 | 12 | 29 | 52 | 81 | 116 | **157** |\n| 1st difference | | 11 | 17 | 23 | 29 | 35 | **41** |\n| 2nd difference | | | 6 | 6 | 6 | 6 | **6** |",
      "The second difference is always 6, so the next first difference is:\n\n    35 + 6 = 41",
      "The next term is:\n\n    116 + 41 = 157\n\nThe next term is **157**.",
      "(b) The second difference is 6, so the number in front of {{n^2}} is:\n\n    6 ÷ 2 = 3\n\nStart with {{3n^2}}.",
      "Subtract {{3n^2}} from each term:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 1 | 12 | 29 | 52 | 81 | 116 |\n| {{3n^2}} | 3 | 12 | 27 | 48 | 75 | 108 |\n| term − {{3n^2}} | −2 | 0 | 2 | 4 | 6 | 8 |",
      "What's left (−2, 0, 2, 4, 6, 8) goes up by 2, so it is 2n + something. Its zeroth term is:\n\n    −2 − 2 = −4\n\nSo what's left is 2n − 4.",
      "Put the two parts together. The nth term is **3n² + 2n − 4**.",
      "Check with n = 5:\n\n    3 × 5² = 75\n    2 × 5 = 10\n    75 + 10 − 4 = 81 ✓",
    ],
    commonError: "Putting the whole second difference (6) in front of {{n^2}} instead of half of it (3), or stopping after subtracting {{3n^2}}: what's left (−2, 0, 2, 4, …) still goes up in steps, so it needs its own linear rule.",
    strategy: "Look at the differences",
  },

  // Q19 · extra practice: complete a pattern table, then the rule (4 marks)
  {
    id: "p2-q19",
    topic: "sq",
    section: "sq-nth",
    difficulty: "challenge",
    question:
      "**Extra practice: completing a pattern table** (like 6(a) in your class test).\n\nHana uses dots to make a growing pattern of plus shapes. The first three patterns are shown below. The first pattern uses 5 dots.",
    diagram: dotPatterns([[1, 3, 1], [1, 1, 5, 1, 1], [1, 1, 1, 7, 1, 1, 1]], "dots"),
    table: {
      headers: ["Pattern number", "1", "2", "3", "4"],
      rows: [["Number of dots", "5", "?", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many dots are used for the other patterns. Pattern 4 is not drawn: continue the pattern. Write the numbers for patterns 2, 3 and 4 in that order, separated by commas.",
        marks: 2,
        answer: { type: "list", values: [9, 13, 17], ordered: true },
        verify: "1+4*2, 1+4*3, 1+4*4",
        traps: [
          {
            spec: { type: "list", values: [10, 15, 20], ordered: true },
            feedback: "The patterns don't go up in 5s. Count the dots in pattern 2: each new pattern adds 1 dot to the end of each of the 4 arms, so it goes up by 4 each time.",
          },
          {
            spec: { type: "list", values: [5, 9, 13], ordered: true },
            feedback: "Pattern 1 (5 dots) is already in the table. Fill in the three empty cells: patterns 2, 3 and 4.",
          },
          {
            spec: { type: "list", values: [5, 9, 13, 17], ordered: true },
            feedback: "Your table is right, but the 5 for pattern 1 was already given. Type only the three new numbers, for patterns 2, 3 and 4.",
          },
        ],
      },
      {
        label: "b",
        prompt: "Find an expression for the number of dots in pattern n.",
        marks: 1,
        answer: { type: "expression", expr: "4n+1" },
        verify: "terms:5,9,13,17",
        traps: [
          {
            spec: { type: "expression", expr: "4n+5" },
            feedback: "5 is the first term, not the zeroth term. Go back one step from pattern 1: 5 − 4 = 1, so the rule is 4n + 1.",
          },
          {
            spec: { type: "expression", expr: "n+4" },
            feedback: "The difference (4) goes in front of n, so start with 4n. Then compare 4n with your table to see what to add.",
          },
          {
            spec: { type: "expression", expr: "5n" },
            feedback: "5n gives 5, 10, 15, … but the patterns go up by 4 each time, so start with 4n.",
          },
        ],
      },
      {
        label: "c",
        prompt: "Which pattern uses 81 dots?",
        marks: 1,
        answer: { type: "number", value: 20, display: "Pattern 20" },
        verify: "(81-1)/4",
        traps: [
          {
            spec: { type: "number", value: 325 },
            feedback: "325 = 4 × 81 + 1 is the number of dots in pattern 81. Here you know the number of dots, so solve 4n + 1 = 81.",
          },
          {
            spec: { type: "number", value: 20.5 },
            feedback: "To undo the + 1, subtract 1: 81 − 1 = 80. Then divide by 4.",
          },
          {
            spec: { type: "number", value: 20.25 },
            feedback: "81 ÷ 4 forgets the + 1 in 4n + 1. Undo it first: 81 − 1 = 80, then divide by 4.",
          },
          {
            spec: { type: "number", value: 19 },
            feedback: "19 comes from solving 4n + 5 = 81. Check your rule with pattern 1: it must give 5 dots. The rule is 4n + 1.",
          },
        ],
      },
    ],
    hints: [
      "Fill in the table first. Count the dots in patterns 2 and 3 and write each number in its cell.",
      "Pattern 4 isn't drawn, so continue the pattern: how many dots does each new pattern add, and where do they go? Then check that the differences in your table are all the same.",
      "For (b), the difference goes in front of n; then work out the zeroth term. For (c), set your expression equal to 81 and solve.",
    ],
    solution: [
      "(a) Each pattern is a centre dot with 4 arms. Each new pattern adds 1 dot to the end of every arm, so it has 4 more dots than the one before.",
      "Pattern 2 has arms of 2 dots:\n\n    4 × 2 + 1 = 9",
      "Pattern 3 has arms of 3 dots:\n\n    4 × 3 + 1 = 13",
      "Pattern 4 is not drawn, so continue the pattern. It has arms of 4 dots:\n\n    4 × 4 + 1 = 17",
      "Fill in every cell of the table:\n\n| Pattern number | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Number of dots | 5 | **9** | **13** | **17** |\n\nCheck the differences:\n\n    9 − 5 = 4\n    13 − 9 = 4\n    17 − 13 = 4 ✓",
      "(b) The difference is 4, so start with 4n. The zeroth term is:\n\n    5 − 4 = 1\n\nSo the number of dots in pattern n is **4n + 1**.",
      "Check with pattern 3:\n\n    4 × 3 + 1 = 13 ✓",
      "(c) Solve 4n + 1 = 81:\n\n    4n + 1 = 81\n    4n = 80\n    n = 20\n\nIt is **pattern 20**.",
    ],
    commonError: "Leaving the table blank and jumping straight to the rule. The table earns marks on its own: fill in every cell (count patterns 2 and 3, then continue the pattern for pattern 4) and check the differences are the same each time.",
    strategy: "Find a pattern",
  },

  // Q20 · extra practice: changing ratio with two changes (3 marks)
  {
    id: "p2-q20",
    topic: "ra",
    section: "ra-problems",
    difficulty: "challenge",
    question:
      "**Extra practice: a changing ratio** (like question 17 in your class test).\n\nA youth club has some members. Some of them are girls, and the rest are boys. 60% of the members are girls. Then 4 girls leave the club and 8 boys join it. The ratio of girls to boys is now 1 : 1. How many members did the club have at the start?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 60, display: "60 members" },
        verify: "(4+8)/(60/100-(100-60)/100)",
        traps: [
          {
            spec: { type: "number", value: 64 },
            feedback: "64 is the number of members now (32 girls and 32 boys). The question asks how many there were at the start.",
          },
          {
            spec: { type: "number", value: 12 },
            feedback: "12 is the size of one part. At the start there are 3 parts of girls and 2 parts of boys, so 5 parts altogether.",
          },
          {
            spec: { type: "number", value: 36 },
            feedback: "36 is the number of girls at the start. Add the boys to get the total number of members.",
          },
          {
            spec: { type: "number", value: 24 },
            feedback: "24 is the number of boys at the start. Add the girls to get the total number of members.",
          },
          {
            spec: { type: "number", value: 20 },
            feedback: "Use both changes with the right signs: the girls go **down** by 4 (3x − 4) and the boys go **up** by 8 (2x + 8). Then set the two equal.",
          },
          {
            spec: { type: "number", value: 40 },
            feedback: "Use both changes: 4 girls leave as well as 8 boys joining, so girls = 3x − 4 and boys = 2x + 8.",
          },
        ],
      },
    ],
    hints: [
      "60% of the members are girls. What percentage are boys? Write girls : boys as a ratio in its simplest form.",
      "Write the girls and the boys at the start in terms of x. Then write each number after 4 girls leave and 8 boys join.",
      "A ratio of 1 : 1 means the two numbers are equal. Make an equation, solve it for x, then find the total at the start.",
    ],
    solution: [
      "60% of the members are girls, so 100% − 60% = 40% are boys.",
      "Girls : boys = 60 : 40 = 3 : 2. So let girls = 3x and boys = 2x.",
      "4 girls leave and 8 boys join:\n\n    girls now = 3x − 4\n    boys now = 2x + 8",
      "The new ratio is 1 : 1, so the two numbers are equal:\n\n    3x − 4 = 2x + 8\n    3x = 2x + 12\n    x = 12",
      "Members at the start = 3x + 2x = 5x:\n\n    5 × 12 = 60\n\nThe club had **60 members** at the start.",
      "Check with a table:\n\n| | Girls | Boys | Total |\n|---|---|---|---|\n| At the start | 36 | 24 | 60 |\n| After the changes | 32 | 32 | 64 |\n\n36 out of 60 is 60% ✓ and 32 : 32 = 1 : 1 ✓",
    ],
    altMethod: {
      label: "Bar model: close the gap",
      steps: [
        "Girls : boys = 3 : 2. Draw 3 boxes for the girls and 2 boxes for the boys, all the same size. The girls have 1 box more than the boys.",
        "4 girls leave and 8 boys join, so the gap between them shrinks by 4 + 8 = 12 members.",
        "Now there are as many boys as girls (1 : 1), so the gap has closed completely: 1 box = 12 members.",
        "Members at the start = 5 boxes: 5 × 12 = 60.",
      ],
    },
    commonError: "Changing only one of the groups, or giving the number of members after the changes (64). Write both changes in terms of x: girls 3x − 4 and boys 2x + 8.",
    strategy: "Introduce a variable",
  },
];
