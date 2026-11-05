import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 4, questions 1–10. See docs/papers-blueprint.md. */
export const P4_A: QA[] = [
  {
    id: "p4-q01",
    topic: "sq",
    section: "sq-nth",
    difficulty: "warmup",
    question: "Find the rule for the nth term of each sequence below.",
    parts: [
      {
        label: "a",
        prompt: "1, 9, 17, 25, 33, …",
        marks: 2,
        answer: { type: "expression", expr: "8n-7" },
        verify: "terms:1,9,17,25,33",
        traps: [
          {
            spec: { type: "expression", expr: "8n+1" },
            feedback: "8n + 1 gives 9 when n = 1, which is the 2nd term. The number on its own is the zeroth term, one step before the first term: 1 − 8 = −7.",
          },
          {
            spec: { type: "expression", expr: "n+8" },
            feedback: "n + 8 gives 9, 10, 11, … so it only goes up by 1. The difference, 8, goes in front of n: the rule starts with 8n.",
          },
        ],
      },
      {
        label: "b",
        prompt: "22, 15, 8, 1, −6, …",
        marks: 2,
        answer: { type: "expression", expr: "29-7n" },
        verify: "terms:22,15,8,1,-6",
        traps: [
          {
            spec: { type: "expression", expr: "22-7n" },
            feedback: "22 − 7n gives 15 when n = 1, which is the 2nd term. The number on its own is the zeroth term: the term that comes before 22.",
          },
          {
            spec: { type: "expression", expr: "15-7n" },
            feedback: "15 − 7n gives 8 when n = 1. You stepped back the wrong way: the terms go down by 7, so the term before 22 is 22 + 7.",
          },
          {
            spec: { type: "expression", expr: "7n+15" },
            feedback: "7n + 15 gives 22, 29, 36, … so it goes up. These terms go down by 7, so the difference is −7 and the rule starts with −7n.",
          },
          {
            spec: { type: "expression", expr: "7n+29" },
            feedback: "The terms go down by 7, so the rule needs −7n, not +7n. Check: n = 1 should give 22.",
          },
        ],
      },
    ],
    hints: [
      "What is added or subtracted each time? That difference is the number in front of n.",
      "Now find the zeroth term (the term before the first one): that is the number on its own. In (b) the terms go down, so to step back you add.",
    ],
    solution: [
      "(a) The terms go up by 8, so the difference is 8 and the rule starts with 8n.",
      "Zeroth term = 1 − 8 = −7",
      "nth term = **8n − 7**",
      "Check: n = 3 gives 8 × 3 − 7 = 17 ✓",
      "(b) The terms go down by 7, so the difference is −7 and the rule starts with −7n.",
      "Zeroth term: step back from 22. The terms go down, so stepping back means adding 7: 22 + 7 = 29.",
      "nth term = **29 − 7n** (or −7n + 29)",
      "Check with n = 5:\n\n    7 × 5 = 35\n    29 − 35 = −6 ✓",
    ],
    commonError:
      "Using the first term as the number on its own, e.g. 8n + 1 or 22 − 7n. The number on its own is the zeroth term, one step before the first term: 1 − 8 = −7 and 22 + 7 = 29.",
    strategy: "Look at the differences",
  },
  {
    id: "p4-q02",
    topic: "ex",
    section: "ex-factorise",
    difficulty: "warmup",
    question: "Factorise the following expressions.",
    parts: [
      {
        label: "a",
        prompt: "40k − 24",
        marks: 2,
        answer: { type: "expression", expr: "8(5k-3)", form: "factorised" },
        verify: "40k-24",
        traps: [
          {
            spec: { type: "expression", expr: "8(5k+3)" },
            feedback: "Expand to check: 8 × (+3) = +24, but the expression has −24. The sign inside the bracket must be minus.",
          },
          {
            spec: { type: "expression", expr: "8(5k-24)" },
            feedback: "Divide every term by 8, not just the first one: 24 ÷ 8 = 3. Expand to check: 8 × 24 = 192, not 24.",
          },
        ],
      },
      {
        label: "b",
        prompt: "7x² + 14x",
        marks: 2,
        answer: { type: "expression", expr: "7x(x+2)", form: "factorised" },
        verify: "7x^2+14x",
        traps: [
          {
            spec: { type: "expression", expr: "7x(x+2x)" },
            feedback: "Expand to check: 7x × 2x = 14x², not 14x. Divide 14x by 7x, not just by 7: 14x ÷ 7x = 2.",
          },
          {
            spec: { type: "expression", expr: "7x(x+14)" },
            feedback: "Every term inside the bracket is divided by the 7x outside: 14x ÷ 7x = 2. Expand to check: 7x × 14 = 98x, not 14x.",
          },
        ],
      },
    ],
    hints: [
      "Find the highest common factor (HCF) of the two terms: the biggest number that goes into both, and any letter that is in both.",
      "Write the HCF in front of a bracket, then divide each term by the HCF to see what goes inside. Expand your answer to check it.",
    ],
    solution: [
      "(a) The HCF of 40 and 24 is 8. Only the first term has a k, so k is not a common factor.",
      "40k ÷ 8 = 5k and 24 ÷ 8 = 3",
      "40k − 24 = **8(5k − 3)**",
      "Check: 8 × 5k = 40k and 8 × (−3) = −24 ✓",
      "(b) The HCF of 7 and 14 is 7, and both terms have an x, so the HCF is 7x.",
      "7x² ÷ 7x = x and 14x ÷ 7x = 2",
      "7x² + 14x = **7x(x + 2)**",
      "Check: 7x × x = 7x² and 7x × 2 = 14x ✓",
    ],
    commonError:
      "Not factorising fully, e.g. 4(10k − 6) or 7(x² + 2x): there is still a common factor inside the bracket. Take out the highest common factor of the numbers and the letters: 8 in (a) and 7x in (b).",
    strategy: "Spot the common factor",
  },
  {
    id: "p4-q03",
    topic: "pc",
    section: "pc-change",
    difficulty: "core",
    question:
      "A board game is normally sold for $36. A shop is having a sale where all prices are reduced by 25%. Calculate the sale price of this board game.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 27, display: "$27" },
        verify: "36*(1-25/100)",
        traps: [
          {
            spec: { type: "number", value: 9 },
            feedback: "$9 is the discount, 25% of $36. The sale price is what is left after taking it off: $36 − $9.",
          },
          {
            spec: { type: "number", value: 45 },
            feedback: "$45 is the price after a 25% increase. In a sale the price goes down, so take the $9 away from $36.",
          },
        ],
      },
    ],
    hints: [
      "25% is the same as a quarter. How much is taken off the price?",
      "Take that amount away from $36, or multiply $36 by the multiplier for a 25% decrease.",
    ],
    solution: [
      "25% = {{1/4}}, so the discount is {{1/4}} of $36.",
      "Discount = $36 ÷ 4 = $9",
      "Sale price = $36 − $9 = **$27**",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "A 25% decrease leaves 100% − 25% = 75% of the price, so the multiplier is 0.75.",
        "Sale price = $36 × 0.75 = $27",
      ],
    },
    commonError: "Stopping at the discount and writing $9, instead of taking it away from the normal price of $36.",
    strategy: "Use the multiplier",
  },
  {
    id: "p4-q04",
    topic: "ra",
    section: "ra-basics",
    difficulty: "core",
    question:
      "In a fruit bowl, 15% of the fruit are apples, {{7/20}} of the fruit are bananas and the rest of the fruit are oranges. Express the ratio apples : bananas : oranges as a ratio in its simplest form.",
    parts: [
      {
        marks: 2,
        answer: { type: "ratio", parts: [3, 7, 10], simplest: true },
        verify: "15/100 : 7/20 : 1-15/100-7/20",
        traps: [
          {
            spec: { type: "ratio", parts: [3, 7, 17] },
            feedback: "The oranges are what is left after the apples **and** the bananas: 100% − 15% − 35% = 50%, not 85%.",
          },
          {
            spec: { type: "ratio", parts: [15, 7, 78] },
            feedback: "{{7/20}} is not 7%. Change it to a percentage first: {{7/20 = 35/100}} = 35%.",
          },
        ],
      },
    ],
    hints: [
      "Write all three amounts in the same form. What is {{7/20}} as a percentage?",
      "The rest are oranges: take the apples and the bananas away from 100%. Then divide all three numbers by their HCF.",
    ],
    solution: [
      "Change {{7/20}} to a percentage: {{7/20 = 35/100}}, so 35% of the fruit are bananas.",
      "Oranges = 100% − 15% − 35% = 50%",
      "apples : bananas : oranges = 15 : 35 : 50",
      "The HCF of 15, 35 and 50 is 5. Divide every part by 5: **3 : 7 : 10**",
      "Check: 3 + 7 + 10 = 20 parts, and the bananas are 7 of the 20 parts, which is {{7/20}} ✓",
    ],
    altMethod: {
      label: "Use twentieths",
      steps: [
        "Apples: 15% = {{15/100 = 3/20}}",
        "Bananas: {{7/20}}",
        "Oranges: {{1 - 3/20 - 7/20 = 10/20}}",
        "All three are now in twentieths, so the ratio is just the numerators: 3 : 7 : 10.",
      ],
    },
    commonError:
      "Forgetting to take the bananas away as well when working out the oranges (85% instead of 50%), or mixing a fraction and a percentage in the same ratio. Write all three as percentages first: 15 : 35 : 50.",
    strategy: "Find a common denominator",
  },
  {
    id: "p4-q05",
    topic: "fr",
    section: "fr-problems",
    difficulty: "core",
    question: "Calculate {{3 5/6}} − {{5/8}} × {{4/3}}. Give your answer in its simplest form.",
    parts: [
      {
        marks: 3,
        answer: { type: "fraction", n: 3, d: 1, simplest: true, allowDecimal: true, display: "3" },
        verify: "(3+5/6)-5/8*4/3",
        traps: [
          {
            spec: { type: "fraction", n: 77, d: 18 },
            feedback:
              "{{77/18}} = {{4 5/18}} comes from working left to right (subtracting first). Multiplication comes before subtraction: work out {{5/8}} × {{4/3}} first, then take it away from {{3 5/6}}.",
          },
        ],
      },
    ],
    hints: [
      "BIDMAS: which do you do first here, the subtraction or the multiplication?",
      "Work out {{5/8}} × {{4/3}} and simplify it before you subtract. Cancelling first keeps the numbers small.",
    ],
    solution: [
      "Multiplication comes before subtraction (BIDMAS), so work out {{5/8}} × {{4/3}} first.",
      "{{5/8 * 4/3 = 20/24}}",
      "{{20/24 = 5/6}} (divide the top and the bottom by 4)",
      "Now subtract: {{3 5/6 - 5/6 = 3}}",
      "**Answer: 3**",
      "Estimate to check: {{5/8}} × {{4/3}} is less than 1, so the answer must be a bit less than {{3 5/6}}. An answer bigger than {{3 5/6}}, such as {{4 5/18}}, can't be right, because you are taking something away.",
    ],
    commonError:
      "Working from left to right: subtracting first gives {{77/18}} = {{4 5/18}}. Multiplication comes before subtraction, so work out {{5/8}} × {{4/3}} first.",
    strategy: "Estimate first",
  },
  {
    id: "p4-q06",
    topic: "sq",
    section: "sq-generate",
    difficulty: "core",
    question: "Ana uses coins to create a growing shape pattern. The first three patterns are shown below. The first pattern uses 8 coins.",
    diagram: dotPatterns([[6, 2], [7, 7, 2], [8, 8, 8, 2]], "coins"),
    table: {
      headers: ["Pattern number", "1", "2", "3"],
      rows: [["Number of coins", "8", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt: "Complete the table to show how many coins are used for the other patterns. Give the numbers for patterns 2 and 3, in that order.",
        marks: 1,
        answer: { type: "list", values: [16, 26], ordered: true },
        verify: "7+7+2, 8+8+8+2",
        traps: [
          {
            spec: { type: "list", values: [16, 24], ordered: true },
            feedback: "The number of coins does not go up by 8 every time. Count the coins in pattern 3 row by row.",
          },
          {
            spec: { type: "list", values: [8, 16, 26], ordered: true },
            feedback:
              "These numbers are right, but the 8 for pattern 1 is already in the table. Only the two missing values (patterns 2 and 3) were asked for.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Ana correctly identifies the rule for the nth term in this pattern as {{n^2 + 5n + 2}}. Use this formula to calculate the number of coins she needs to create the 11th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 178 },
        verify: "11^2+5*11+2",
        traps: [
          {
            spec: { type: "number", value: 79 },
            feedback: "79 uses 11² = 22. Squaring means multiplying a number by itself: 11² = 11 × 11 = 121.",
          },
          {
            spec: { type: "number", value: 1388 },
            feedback:
              "1388 comes from working left to right: (121 + 5) × 11 + 2. Multiply before you add: 5n = 5 × 11 = 55, then add 121 + 55 + 2. Write each calculation on its own line.",
          },
        ],
      },
    ],
    hints: [
      "For (a), count the coins in patterns 2 and 3. Add up the rows rather than counting coin by coin.",
      "Check your table with the rule from (b): put n = 2 and n = 3 into {{n^2 + 5n + 2}}.",
      "For (b), put n = 11 into the rule. Work out {{11^2}} on one line and 5 × 11 on the next, then add them and the 2.",
    ],
    solution: [
      "(a) Pattern 2 has two rows of 7 and a row of 2: 7 + 7 + 2 = **16** coins.",
      "Pattern 3 has three rows of 8 and a row of 2: 8 + 8 + 8 + 2 = **26** coins.",
      "Check with the rule: n = 2 gives 4 + 10 + 2 = 16 ✓ and n = 3 gives 9 + 15 + 2 = 26 ✓",
      "(b) Put n = 11 into {{n^2 + 5n + 2}}, one calculation on each line:",
      "{{11^2}} = 11 × 11 = 121",
      "5n = 5 × 11 = 55",
      "121 + 55 + 2 = 178",
      "Ana needs **178** coins for the 11th pattern.",
    ],
    altMethod: {
      label: "Use the picture",
      steps: [
        "Pattern n has n rows of (n + 5) coins, plus a row of 2. That is why the rule is n(n + 5) + 2 = {{n^2 + 5n + 2}}.",
        "Pattern 11 has 11 rows of 16 coins: 11 × 16 = 176",
        "Add the row of 2: 176 + 2 = 178",
      ],
    },
    commonError:
      "Skipping part (a) and jumping straight to the formula in (b). The table is an easy mark: count the coins in patterns 2 and 3 (or put n = 2 and n = 3 into the rule) and fill in both boxes before you move on.",
    strategy: "Find a pattern",
  },
  {
    id: "p4-q07",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "core",
    question: "Write the answer to this calculation in its simplest form: {{(45t^4)/16}} × {{12/(25t^3)}}",
    parts: [
      {
        prompt: "If the bottom of your answer has more than one factor, type it in brackets, e.g. 5/(2a).",
        marks: 2,
        answer: { type: "expression", expr: "27t/20", form: "simplified" },
        verify: "(45t^4/16)*(12/(25t^3))",
        traps: [
          {
            spec: { type: "expression", expr: "27/(20t)" },
            feedback: "Check where the leftover t goes. There are four t's on the top and three on the bottom, so one t is left on the **top**.",
          },
          {
            spec: { type: "expression", expr: "27t^7/20" },
            feedback:
              "{{t^4}} is on the top and {{t^3}} is on the bottom, so they cancel: {{t^4/t^3 = t}}. You only add the powers when you multiply, e.g. {{t^4 * t^3 = t^7}}.",
          },
        ],
      },
    ],
    hints: [
      "Multiply the tops together and the bottoms together, then cancel. Or cancel first to keep the numbers small.",
      "Deal with the numbers and the letters separately. How many t's are on the top and how many are on the bottom?",
      "45 and 25 share a factor of 5, and 12 and 16 share a factor of 4.",
    ],
    solution: [
      "Multiply the tops: {{45t^4 * 12 = 540t^4}}",
      "Multiply the bottoms: {{16 * 25t^3 = 400t^3}}",
      "This gives {{(540t^4)/(400t^3)}}.",
      "Numbers: the HCF of 540 and 400 is 20, so {{540/400 = 27/20}}.",
      "Letters: {{t^4/t^3 = t}}. Three t's cancel and one t stays on the top.",
      "Simplest form: {{27t/20}}",
    ],
    altMethod: {
      label: "Cancel first",
      steps: [
        "Cross-cancel: 45 and 25 share a factor of 5, and 12 and 16 share a factor of 4: {{(9t^4)/4 * 3/(5t^3)}}",
        "Numbers: {{9/4 * 3/5 = 27/20}}",
        "Letters: {{t^4/t^3 = t}}, so the answer is {{27t/20}}: the same answer, with smaller numbers.",
      ],
    },
    commonError:
      "Putting the leftover t on the bottom, or adding the powers to get {{t^7}}. With four t's on the top and three on the bottom, one t is left on the top.",
    strategy: "Spot the common factor",
  },
  {
    id: "p4-q08",
    topic: "su",
    section: "su-negatives",
    difficulty: "core",
    question: "Calculate the value of {{2w - sqrt(k^2 - 3m)}} where w = 11, k = −7, m = 8.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 17 },
        verify: "2*11-sqrt((-7)^2-3*8)",
        traps: [
          {
            spec: { type: "number", value: -3 },
            feedback: "−3 is 22 − 25: the square root has been missed out. {{sqrt(25)}} = 5, and that is what you take away from 22.",
          },
          {
            spec: { type: "number", value: 9.5 },
            feedback: "{{sqrt(25)}} is not half of 25. The square root is the number that multiplies by itself to give 25: 5 × 5 = 25, so {{sqrt(25)}} = 5.",
          },
          {
            spec: { type: "number", value: 27 },
            feedback:
              "27 is 22 + 5, but the square root is taken **away** from 2w. {{sqrt(25)}} is +5 (not −5, even though k is negative), so work out 22 − 5.",
          },
        ],
      },
    ],
    hints: [
      "Substitute using brackets, especially for the negative value: k² becomes (−7)².",
      "Work out everything under the square root first, then take the square root.",
      "Last of all, take the square root away from 2w.",
    ],
    solution: [
      "Substitute, using brackets: {{2 * 11 - sqrt((-7)^2 - 3 * 8)}}",
      "2w = 2 × 11 = 22",
      "k² = (−7)² = (−7) × (−7) = 49",
      "3m = 3 × 8 = 24",
      "k² − 3m = 49 − 24 = 25",
      "{{sqrt(25)}} = 5",
      "2w − {{sqrt(k^2 - 3m)}} = 22 − 5 = **17**",
    ],
    commonError:
      "Writing (−7)² as −49. A negative number squared is positive: (−7) × (−7) = 49. If you end up with a negative number under the square root, check k² again.",
    strategy: "Check by substituting",
  },
  {
    id: "p4-q09",
    topic: "ra",
    section: "ra-sharing",
    difficulty: "core",
    question:
      "Jay, Kim and Leo share some money in the ratio 6 : 1 : 4. When the money is divided between them, Jay is given $90 more than Leo. How much money did Kim receive?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 45, display: "$45" },
        verify: "90/(6-4)*1",
        traps: [
          {
            spec: { type: "number", value: 270 },
            feedback: "$270 is Jay's share (6 parts). The question asks for Kim's share, which is 1 part.",
          },
          {
            spec: { type: "number", value: 180 },
            feedback: "$180 is Leo's share (4 parts). The question asks for Kim's share, which is 1 part.",
          },
          {
            spec: { type: "number", value: 15 },
            feedback: "$90 is not Jay's share: it is how much **more** Jay gets than Leo. That difference is 6 − 4 = 2 parts.",
          },
          {
            spec: { type: "number", value: 8.18, tolerance: 0.05 },
            feedback: "The $90 is not the total. It is the difference between Jay and Leo, which is 6 − 4 = 2 parts, not all 11 parts.",
          },
        ],
      },
    ],
    hints: [
      "Draw a bar model: 6 boxes for Jay, 1 box for Kim and 4 boxes for Leo. How many more boxes does Jay have than Leo?",
      "Those extra boxes are worth $90 altogether. What is one box worth?",
    ],
    solution: [
      "Jay has 6 parts and Leo has 4 parts, so Jay has 6 − 4 = 2 more parts than Leo.",
      "Those 2 parts are the extra $90.",
      "1 part = $90 ÷ 2 = $45",
      "Kim has 1 part, so Kim receives **$45**.",
      "Check: Jay gets 6 × $45 = $270 and Leo gets 4 × $45 = $180, and $270 − $180 = $90 ✓",
    ],
    altMethod: {
      label: "Introduce a variable",
      steps: [
        "Let one part be $p, so Jay gets 6p and Leo gets 4p.",
        "6p − 4p = 90, so 2p = 90 and p = 45.",
        "Kim gets 1 part: $45.",
      ],
    },
    commonError:
      "Answering with Jay's or Leo's share, or sharing the $90 between all 11 parts. The $90 is the difference between Jay and Leo, which is only 6 − 4 = 2 parts.",
    strategy: "Use a bar model",
  },
  {
    id: "p4-q10",
    topic: "pc",
    section: "pc-percent-change",
    difficulty: "core",
    question:
      "Sam buys a guitar for $250. A year later he sells it for $190. Calculate the percentage loss that he has made in selling the guitar.",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 24, display: "24%" },
        verify: "(250-190)/250*100",
        traps: [
          {
            spec: { type: "number", value: 31.58, tolerance: 0.5 },
            feedback: "You divided by the selling price ($190). Percentage loss is worked out from what Sam **paid**: {{60/250}} × 100.",
          },
          {
            spec: { type: "number", value: 76 },
            feedback: "76% is the part of the $250 that Sam got back (190 ÷ 250 = 0.76). The loss is the rest: 100% − 76%.",
          },
          {
            spec: { type: "number", value: 60 },
            feedback: "$60 is the loss in dollars. Now write it as a percentage of the price Sam paid, $250.",
          },
          {
            spec: { type: "number", value: -24 },
            feedback: "Leave out the minus sign. The question asks for the percentage **loss**, and the word 'loss' already tells you the price went down.",
          },
        ],
      },
    ],
    hints: [
      "First work out how much money Sam lost.",
      "Percentage loss = loss ÷ original price × 100. Which price is the original one?",
    ],
    solution: [
      "Loss = $250 − $190 = $60",
      "Percentage loss = loss ÷ original price × 100 = {{60/250}} × 100",
      "Simplify: {{60/250 = 6/25 = 24/100}}",
      "So the percentage loss is **24%**.",
      "Check: 10% of $250 is $25, so 20% is $50 and 4% is $10. 24% of $250 = $50 + $10 = $60 ✓",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "$190 ÷ $250 = 0.76, so Sam got back 76% of what he paid.",
        "100% − 76% = 24%, so the loss is 24%.",
      ],
    },
    commonError:
      "Dividing by the selling price instead of the price Sam paid: {{60/190}} × 100 ≈ 31.6%. Percentage change is always worked out from the original amount, $250.",
    strategy: "Spot the common factor",
  },
];
