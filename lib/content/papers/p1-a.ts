import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 1, questions 1–10. See docs/papers-blueprint.md. */
export const P1_A: QA[] = [
  // 1 · nth term of two arithmetic sequences (like class mock Q1)
  {
    id: "p1-q01",
    topic: "sq",
    section: "sq-nth",
    difficulty: "warmup",
    question: "Find the rule for the nth term of each sequence below.",
    parts: [
      {
        label: "a",
        prompt: "7, 13, 19, 25, 31, …",
        marks: 2,
        answer: { type: "expression", expr: "6n+1", display: "{{6n + 1}}" },
        verify: "terms:7,13,19,25,31",
        traps: [
          {
            spec: { type: "expression", expr: "6n+7" },
            feedback: "6n + 7 gives 13 as the first term, not 7. The number you add to 6n is the **zeroth** term, one step back from 7: 7 − 6 = 1.",
          },
          {
            spec: { type: "expression", expr: "n+6" },
            feedback: "n + 6 goes up by 1 each time (7, 8, 9, …). The difference, 6, goes in front of n: start with 6n, then add the zeroth term.",
          },
        ],
      },
      {
        label: "b",
        prompt: "41, 37, 33, 29, 25, …",
        marks: 2,
        answer: { type: "expression", expr: "45-4n", display: "{{45 - 4n}}" },
        verify: "terms:41,37,33,29,25",
        traps: [
          {
            spec: { type: "expression", expr: "41-4n" },
            feedback: "41 − 4n gives 37 as the first term. Use the zeroth term, the term before 41: going back up this sequence you add 4, so it is 41 + 4 = 45.",
          },
          {
            spec: { type: "expression", expr: "37-4n" },
            feedback: "37 − 4n gives 33 as the first term. The sequence goes down by 4, so one step **back** from 41 goes up: 41 + 4 = 45, not 41 − 4.",
          },
          {
            spec: { type: "expression", expr: "4n+45" },
            feedback: "The terms go **down** by 4, so the rule has −4n, not +4n. Your rule gives 49, 53, 57, …",
          },
        ],
      },
    ],
    hints: [
      "What is the difference between the terms? That number goes in front of n.",
      "Then find the zeroth term, one step before the first term. In (b) the terms go down, so the difference is negative and one step back means adding.",
    ],
    solution: [
      "(a) The difference is +6, so the rule starts with 6n.",
      "Zeroth term = 7 − 6 = 1",
      "nth term = **6n + 1**",
      "Check: n = 3 gives 6 × 3 + 1 = 19 ✓",
      "(b) The difference is −4, so the rule has −4n.",
      "Zeroth term = 41 + 4 = 45 (one step back up the sequence)",
      "nth term = **45 − 4n** (you can also write −4n + 45)",
      "Check: n = 4 gives 45 − 4 × 4 = 29 ✓",
    ],
    commonError:
      "Using the first term instead of the zeroth term: 6n + 7 in (a), or 41 − 4n in (b). In (b) the sequence goes down, so one step back from 41 is 41 + 4 = 45, giving 45 − 4n.",
    strategy: "Look at the differences",
  },

  // 2 · factorise into a single bracket (like class mock Q2)
  {
    id: "p1-q02",
    topic: "ex",
    section: "ex-factorise",
    difficulty: "warmup",
    question: "Factorise the following expressions fully.",
    parts: [
      {
        label: "a",
        prompt: "{{18a + 30}}",
        marks: 2,
        answer: { type: "expression", expr: "6(3a+5)", form: "factorised", display: "{{6(3a + 5)}}" },
        verify: "18a+30",
        traps: [
          {
            spec: { type: "expression", expr: "6(3a+30)" },
            feedback: "Divide **both** terms by 6: 30 ÷ 6 = 5. Expanding 6(3a + 30) gives 18a + 180, not 18a + 30.",
          },
        ],
      },
      {
        label: "b",
        prompt: "{{5x^2 - 15x}}",
        marks: 2,
        answer: { type: "expression", expr: "5x(x-3)", form: "factorised", display: "{{5x(x - 3)}}" },
        verify: "5x^2-15x",
        traps: [
          {
            spec: { type: "expression", expr: "5x(x-3x)" },
            feedback: "Divide **both** terms by 5x: 15x ÷ 5x = 3, so no x is left in the second term. 5x(x − 3x) expands to 5x² − 15x².",
          },
          {
            spec: { type: "expression", expr: "5x(x-15)" },
            feedback: "15x ÷ 5x = 3, not 15: divide the number by 5 as well as taking out the x. 5x(x − 15) expands to 5x² − 75x.",
          },
          {
            spec: { type: "expression", expr: "5x(x+3)" },
            feedback: "Check the sign: 5x × (+3) = +15x, but the expression has −15x. The bracket needs (x − 3).",
          },
        ],
      },
    ],
    hints: [
      "Find the highest common factor of the numbers, then check whether a letter is in **every** term. Take all of it outside the bracket.",
      "Check by expanding your answer: you should get back to the expression you started with. If the bracket still has a common factor, take that out too.",
    ],
    solution: [
      "(a) The HCF of 18 and 30 is 6. The second term has no a, so only 6 goes outside the bracket.",
      "18a ÷ 6 = 3a and 30 ÷ 6 = 5",
      "18a + 30 = **6(3a + 5)**",
      "Check: 6 × 3a = 18a and 6 × 5 = 30 ✓",
      "(b) The HCF of 5 and 15 is 5, and x is in both terms, so take out 5x.",
      "5x² ÷ 5x = x and 15x ÷ 5x = 3",
      "5x² − 15x = **5x(x − 3)**",
      "Check: 5x × x = 5x² and 5x × (−3) = −15x ✓",
    ],
    commonError:
      "Not factorising fully in (b): 5(x² − 3x) and x(5x − 15) are equivalent, but each still has a common factor inside the bracket. Take out the HCF of the numbers **and** the letter: 5x.",
    strategy: "Spot the common factor",
  },

  // 3 · new price after a percentage decrease (like class mock Q3)
  {
    id: "p1-q03",
    topic: "pc",
    section: "pc-change",
    difficulty: "core",
    question:
      "A pair of headphones is normally sold for $60. A shop is having a sale where all prices are reduced by 35%. Calculate the sale price of the headphones.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 39, display: "$39" },
        verify: "60*(1-35/100)",
        traps: [
          {
            spec: { type: "number", value: 21 },
            feedback: "$21 is the amount taken off (35% of $60). The sale price is what is left: $60 − $21.",
          },
          {
            spec: { type: "number", value: 81 },
            feedback: "$81 is a 35% **increase**. In a sale the price goes down, so take the 35% away.",
          },
          {
            spec: { type: "number", value: 25 },
            feedback: "You took away $35, but the reduction is 35% **of $60**, not $35. Find 35% of $60 first.",
          },
        ],
      },
    ],
    hints: [
      "Find 10% of $60 first. How can you build 35% out of 10% and 5%?",
      "In a sale the price goes down, so take the 35% away from $60. Or multiply $60 by the decimal for the part that is left (100% − 35%).",
    ],
    solution: [
      "10% of $60 = $6",
      "30% of $60 = 3 × $6 = $18",
      "5% of $60 = $6 ÷ 2 = $3",
      "35% of $60 = $18 + $3 = $21",
      "Sale price = $60 − $21 = **$39**",
    ],
    altMethod: {
      label: "Use a multiplier",
      steps: [
        "A 35% reduction leaves 100% − 35% = 65% of the price.",
        "65% as a decimal multiplier is 0.65",
        "$60 × 0.65 = $39",
      ],
    },
    commonError: "Stopping at $21: that is the amount taken off, not the sale price. Take it away from $60 (or multiply by 0.65 straight away).",
    strategy: "Use the multiplier",
  },

  // 4 · a three-part ratio from a percentage and a fraction (like class mock Q4)
  {
    id: "p1-q04",
    topic: "ra",
    section: "ra-basics",
    difficulty: "core",
    question:
      "Arjun spends 30% of his pocket money on snacks, {{1/4}} of his pocket money on games and he saves the rest. Express the ratio money spent on snacks : money spent on games : money saved as a ratio in its simplest form.",
    parts: [
      {
        marks: 2,
        answer: { type: "ratio", parts: [6, 5, 9], simplest: true, display: "6 : 5 : 9" },
        verify: "30 : 100/4 : 100-30-100/4",
        traps: [
          {
            spec: { type: "ratio", parts: [6, 5, 11] },
            feedback: "55% is what Arjun **spends** (30% + 25%). The money he saves is the rest: 100% − 55% = 45%.",
          },
          {
            spec: { type: "ratio", parts: [12, 7, 21] },
            feedback: "{{1/4}} is a quarter of **all** his pocket money (25%), not a quarter of what is left after the snacks.",
          },
        ],
      },
    ],
    hints: [
      "Write all three amounts as percentages of his pocket money. What percentage is {{1/4}}?",
      "The part he saves is 100% minus the other two. Then divide all three numbers by their highest common factor.",
    ],
    solution: [
      "Write each amount as a percentage of his pocket money.",
      "Snacks: 30%",
      "Games: {{1/4}} = 25%",
      "Saved: 100% − 30% − 25% = 45%",
      "snacks : games : saved = 30 : 25 : 45",
      "The HCF of 30, 25 and 45 is 5, so divide each part by 5.",
      "30 : 25 : 45 = **6 : 5 : 9**",
    ],
    altMethod: {
      label: "Use twentieths",
      steps: [
        "30% = {{3/10}} = {{6/20}} and {{1/4}} = {{5/20}}",
        "Saved: {{20/20 - 6/20 - 5/20 = 9/20}}",
        "Compare the twentieths: 6 : 5 : 9",
      ],
    },
    commonError:
      "Leaving the answer as 30 : 25 : 45 (it still divides by 5), or forgetting to work out the part he saves (100% − 30% − 25%).",
    strategy: "Find a common denominator",
  },

  // 5 · order of operations with fractions and a mixed number (like class mock Q5)
  {
    id: "p1-q05",
    topic: "fr",
    section: "fr-problems",
    difficulty: "core",
    question: "Calculate {{2 3/4}} + {{5/6}} × {{3/5}}. Give your answer in its simplest form.",
    parts: [
      {
        marks: 3,
        answer: { type: "fraction", n: 13, d: 4, simplest: true, allowDecimal: true, display: "{{3 1/4}}" },
        verify: "(2+3/4)+5/6*3/5",
        traps: [
          {
            spec: { type: "fraction", n: 43, d: 20, allowDecimal: true },
            feedback:
              "{{2 3/20}} comes from working left to right: adding {{2 3/4 + 5/6}} first, then multiplying by {{3/5}}. Multiplication comes before addition (BIDMAS), so work out {{5/6 * 3/5}} first.",
          },
          {
            spec: { type: "fraction", n: 8, d: 3 },
            feedback: "It looks like you added the tops and the bottoms: {{3/4 + 1/2}} is not {{4/6}}. Use a common denominator: {{3/4 + 2/4 = 5/4}}.",
          },
        ],
      },
    ],
    hints: [
      "BIDMAS: which comes first here, the + or the ×?",
      "Work out {{5/6 * 3/5}} first (you can cancel before you multiply). Then add it to {{2 3/4}} using a common denominator.",
    ],
    solution: [
      "Multiplication comes before addition (BIDMAS), so work out {{5/6 * 3/5}} first.",
      "{{5/6 * 3/5 = 15/30}}",
      "{{15/30 = 1/2}}",
      "Now add: {{2 3/4 + 1/2}}",
      "{{1/2 = 2/4}}, so {{2 3/4 + 2/4 = 2 5/4}}",
      "{{5/4 = 1 1/4}}, so {{2 5/4 = 3 1/4}}",
      "Answer: **{{3 1/4}}**",
    ],
    altMethod: {
      label: "Use improper fractions",
      steps: ["{{2 3/4 = 11/4}}", "{{11/4 + 1/2 = 11/4 + 2/4 = 13/4}}", "{{13/4 = 3 1/4}}"],
    },
    commonError:
      "Working left to right: {{(2 3/4 + 5/6) * 3/5 = 2 3/20}}. In BIDMAS, multiplication comes before addition, so work out {{5/6 * 3/5}} first and add it on at the end.",
    strategy: "Find a common denominator",
  },

  // 6 · complete a pattern table, then use a given nth-term rule (like class mock Q6)
  {
    id: "p1-q06",
    topic: "sq",
    section: "sq-generate",
    difficulty: "core",
    question: "Noor uses counters to create a growing shape pattern, as shown below. The first pattern uses 7 counters.",
    diagram: dotPatterns([[3, 4], [4, 4, 4], [5, 5, 5, 4]], "counters"),
    table: {
      headers: ["Pattern number", "1", "2", "3"],
      rows: [["Number of counters", "7", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many counters are used for the other patterns. Type the numbers for patterns 2 and 3 in order, separated by commas.",
        marks: 1,
        answer: { type: "list", values: [12, 19], ordered: true, display: "12, 19" },
        verify: "4+4+4, 5+5+5+4",
        traps: [
          {
            spec: { type: "list", values: [12, 17], ordered: true },
            feedback: "Pattern 3 isn't 17: this pattern does not go up by the same amount each time. Count the counters in the picture of pattern 3, row by row.",
          },
          {
            spec: { type: "list", values: [12, 15], ordered: true },
            feedback: "Count every row of pattern 3: three rows of 5 **and** the row of 4 underneath.",
          },
          {
            spec: { type: "list", values: [7, 12, 19], ordered: true },
            feedback: "Your numbers are right: 12 and 19 are the missing values. The 7 was already in the table, so type only the two missing numbers.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Noor correctly identifies the rule for the nth term in this pattern as {{n^2 + 2n + 4}}. Use this formula to calculate the number of counters she needs to create the 10th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 124, display: "124 counters" },
        verify: "10^2+2*10+4",
        traps: [
          {
            spec: { type: "number", value: 44 },
            feedback: "{{10^2}} means 10 × 10 = 100, not 10 × 2 = 20. Then add 2 × 10 = 20 and 4.",
          },
          {
            spec: { type: "number", value: 120 },
            feedback: "Nearly: 100 + 20 = 120 is right so far. Now add the 4.",
          },
        ],
      },
    ],
    hints: [
      "Part (a) uses the pictures: count the counters in patterns 2 and 3, row by row, and put both numbers in the table.",
      "For (b), replace n with 10. Work out {{10^2}} first, then 2 × 10, then add 4. Write each calculation on its own line.",
      "You can check part (a) with the rule too: n = 2 and n = 3 should give your two table values.",
    ],
    solution: [
      "(a) Count the counters in each pattern, row by row.",
      "Pattern 2: 4 + 4 + 4 = 12",
      "Pattern 3: 5 + 5 + 5 + 4 = 19",
      "The missing table values are **12** and **19**.",
      "Check with the rule: n = 2 gives {{2^2 + 2 * 2 + 4 = 4 + 4 + 4 = 12}} ✓",
      "n = 3 gives {{3^2 + 2 * 3 + 4 = 9 + 6 + 4 = 19}} ✓",
      "(b) Substitute n = 10 into {{n^2 + 2n + 4}}, one calculation per line:",
      "{{10^2 = 10 * 10 = 100}}",
      "2 × 10 = 20",
      "100 + 20 + 4 = 124",
      "The 10th pattern uses **124** counters.",
      "Keep every line true. Don't chain it as 10 × 10 = 100 + 20 + 4 = 124: that line says 10 × 10 equals 124.",
    ],
    altMethod: {
      label: "See the rule in the picture",
      steps: [
        "Pattern 1 is 1 row of 3, pattern 2 is 2 rows of 4 and pattern 3 is 3 rows of 5, and each has an extra row of 4 at the bottom.",
        "So pattern n is n rows of (n + 2) counters, plus 4.",
        "n(n + 2) + 4 = n² + 2n + 4, which is Noor's rule.",
        "Pattern 10: 10 rows of 12 = 120 counters, then 120 + 4 = 124 ✓",
      ],
    },
    commonError:
      "Skipping part (a) and going straight to the formula in (b). The table is the easiest mark on the question: count the counters in patterns 2 and 3 and write both numbers in. Never leave a part blank.",
    strategy: "Check by substituting",
  },

  // 7 · multiply two algebraic fractions (like class mock Q7)
  {
    id: "p1-q07",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "core",
    question: "Write the answer to this calculation in its simplest form: {{(18m^3)/25}} × {{15/(4m)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "27m^2/10", form: "simplified", display: "{{(27m^2)/10}}" },
        verify: "(18m^3/25)*(15/(4m))",
        traps: [
          {
            spec: { type: "expression", expr: "24m^4/125" },
            feedback: "You flipped the second fraction. Only flip when you **divide**. To multiply, multiply the tops and multiply the bottoms, then cancel.",
          },
          {
            spec: { type: "expression", expr: "27m^3/10" },
            feedback: "The m on the bottom cancels with **one** of the m's on top: {{m^3/m = m^2}}, so {{m^2}} is left on top, not {{m^3}}.",
          },
        ],
      },
    ],
    hints: [
      "Multiply the tops together and the bottoms together, or cancel common factors first.",
      "Deal with the numbers and the letters separately: 18 and 4 share a factor of 2, 15 and 25 share a factor of 5, and the m on the bottom cancels with one m on top.",
    ],
    solution: [
      "Multiply the tops: 18m³ × 15 = 270m³",
      "Multiply the bottoms: 25 × 4m = 100m",
      "So the product is {{(270m^3)/(100m)}}, which still needs simplifying.",
      "Numbers: the HCF of 270 and 100 is 10, so {{270/100 = 27/10}}",
      "Letters: {{m^3/m = m^2}}, which stays on top",
      "Answer: **{{(27m^2)/10}}**",
    ],
    altMethod: {
      label: "Cancel first",
      steps: [
        "18 and 4 share a factor of 2: 18 ÷ 2 = 9 and 4 ÷ 2 = 2",
        "15 and 25 share a factor of 5: 15 ÷ 5 = 3 and 25 ÷ 5 = 5",
        "One m cancels: m³ on top becomes m², and the m on the bottom goes",
        "{{(9m^2)/5 * 3/2 = (27m^2)/10}}",
      ],
    },
    commonError:
      "Flipping the second fraction (that is only for dividing), or leaving m³ on top after the m on the bottom has cancelled: {{m^3/m = m^2}}.",
    strategy: "Spot the common factor",
  },

  // 8 · substitution with a negative number and a square root (like class mock Q8)
  {
    id: "p1-q08",
    topic: "su",
    section: "su-negatives",
    difficulty: "core",
    question: "Calculate the value of {{m - sqrt(2n + k^2)}} where m = 20, n = 18, k = −8.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 10 },
        verify: "20-sqrt(2*18+(-8)^2)",
        traps: [
          {
            spec: { type: "number", value: 6 },
            feedback: "You can't square-root each part separately: {{sqrt(36 + 64)}} is not {{sqrt(36) + sqrt(64)}}. Add inside the square root first: 36 + 64 = 100.",
          },
          {
            spec: { type: "number", value: -80 },
            feedback: "You haven't taken the square root. Inside the root you get 100, and {{sqrt(100) = 10}}. Then work out 20 − 10.",
          },
          {
            spec: { type: "number", value: 14.71, tolerance: 0.02 },
            feedback:
              "That's about 20 − {{sqrt(28)}}, so you had 28 under the square root. Check {{k^2}}: it is {{(-8)^2 = (-8) * (-8) = 64}} (squared, and positive), so 2n + {{k^2}} = 36 + 64 = 100.",
          },
        ],
      },
    ],
    hints: [
      "Substitute with brackets round the negative number: {{k^2 = (-8)^2}}.",
      "Work out everything inside the square root first, then square-root it, then subtract from m.",
      "If you get a negative number under the square root, check {{(-8)^2}} again: a negative times a negative is positive.",
    ],
    solution: [
      "Substitute, with brackets round the negative number: {{20 - sqrt(2 * 18 + (-8)^2)}}",
      "Inside the square root first: 2 × 18 = 36",
      "{{(-8)^2 = (-8) * (-8) = 64}}",
      "36 + 64 = 100",
      "{{sqrt(100) = 10}}",
      "20 − 10 = **10**",
    ],
    commonError:
      "Working out {{(-8)^2}} as −64. That gives 36 − 64 = −28 under the square root, and you can't square-root a negative number. {{(-8)^2 = 64}}, because a negative times a negative is positive.",
    strategy: "Check by substituting",
  },

  // 9 · sharing in a three-part ratio from a difference (like class mock Q9)
  {
    id: "p1-q09",
    topic: "ra",
    section: "ra-sharing",
    difficulty: "core",
    question:
      "Aisha, Ben and Chloe share some money in the ratio 2 : 5 : 8. When the money is divided between them, Chloe is given $72 more than Ben. How much money did Aisha receive?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 48, display: "$48" },
        verify: "72/(8-5)*2",
        traps: [
          {
            spec: { type: "number", value: 9.6 },
            feedback: "$72 is not the total, so don't share it into all 15 parts. It is the **difference** between Chloe and Ben: 8 − 5 = 3 parts.",
          },
          {
            spec: { type: "number", value: 24 },
            feedback: "$24 is the value of **one** part. Aisha has 2 parts.",
          },
          {
            spec: { type: "number", value: 18 },
            feedback: "You shared $72 into Chloe's 8 parts. But $72 is how much **more** Chloe gets than Ben, which is 8 − 5 = 3 parts.",
          },
        ],
      },
    ],
    hints: [
      "Draw a bar for each person: 2, 5 and 8 equal boxes. How many more boxes does Chloe have than Ben?",
      "Those extra boxes are worth $72. What is one box worth? How many boxes does Aisha have?",
    ],
    solution: [
      "Chloe has 8 parts and Ben has 5 parts.",
      "Chloe has 8 − 5 = 3 parts more than Ben, and those 3 parts are worth $72.",
      "1 part = $72 ÷ 3 = $24",
      "Aisha has 2 parts: 2 × $24 = **$48**",
      "Check: Ben gets 5 × $24 = $120 and Chloe gets 8 × $24 = $192. $192 − $120 = $72 ✓",
    ],
    altMethod: {
      label: "Introduce a variable",
      steps: [
        "Let one part be k: Aisha gets 2k, Ben gets 5k and Chloe gets 8k.",
        "Chloe − Ben = 8k − 5k = 3k, so 3k = 72 and k = 24.",
        "Aisha gets 2k = 2 × 24 = $48.",
      ],
    },
    commonError:
      "Dividing $72 by the total number of parts (2 + 5 + 8 = 15). The $72 is the difference between Chloe and Ben, which is only 8 − 5 = 3 parts.",
    strategy: "Use a bar model",
  },

  // 10 · percentage profit, given exactly (like class mock Q10)
  {
    id: "p1-q10",
    topic: "pc",
    section: "pc-percent-change",
    difficulty: "core",
    question:
      "Rohan buys a phone for $240. A month later he sells it for $280. Calculate the percentage profit that he has made in selling the phone. Give your answer as an exact percentage.",
    parts: [
      {
        marks: 2,
        answer: { type: "fraction", n: 50, d: 3, simplest: true, display: "{{16 2/3}}%" },
        verify: "(280-240)/240*100",
        traps: [
          {
            spec: { type: "number", value: 16.67, tolerance: 0.07 },
            feedback:
              "That's a rounded answer, but the question asks for an **exact** percentage. {{1/6}} × 100 = 16.666…, and the 6s go on for ever, so write the exact value as a mixed number: {{16 2/3}}% (like {{33 1/3}}% rather than 33.3% in your class test).",
          },
          {
            spec: { type: "number", value: 17 },
            feedback:
              "17% is rounded, but the question asks for an **exact** percentage. {{1/6}} × 100 = 16.666…, and the 6s go on for ever, so write the exact value as a mixed number: {{16 2/3}}%.",
          },
          {
            spec: { type: "number", value: 14.29, tolerance: 0.04 },
            feedback: "That divides the profit by the selling price, $280. Percentage profit compares the profit with the price Rohan **paid**: {{40/240}} × 100.",
          },
          {
            spec: { type: "number", value: 116.67, tolerance: 0.07 },
            feedback: "That's $280 as a percentage **of** $240. The profit is only the increase, so take away the 100%.",
          },
          {
            spec: { type: "number", value: 0.167, tolerance: 0.004 },
            feedback: "{{1/6}} is the profit as a fraction of the price he paid. Multiply by 100 to turn it into a percentage.",
          },
          {
            spec: { type: "number", value: 40 },
            feedback: "$40 is the profit in dollars. The question wants it as a percentage of the price Rohan paid, $240.",
          },
        ],
      },
    ],
    hints: [
      "Percentage profit = profit ÷ original price × 100. Which price is the original?",
      "Write the profit as a fraction of the price Rohan paid and simplify it before you multiply by 100. Keep the answer exact: don't round it.",
    ],
    solution: [
      "Profit = $280 − $240 = $40",
      "Percentage profit = profit ÷ original price × 100",
      "Percentage profit = {{40/240}} × 100",
      "{{40/240 = 1/6}}",
      "{{1/6 * 100 = 100/6 = 50/3}}",
      "50 ÷ 3 = 16 remainder 2, so {{50/3 = 16 2/3}}",
      "Percentage profit = **{{16 2/3}}%**",
      "16.7% is a rounded value, so it is not exact. Keep the fraction part: {{16 2/3}}%. (16.6 recurring, written with a dot over the 6, is exact too.)",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "$280 ÷ $240 = {{7/6}} = {{1 1/6}}",
        "{{1 1/6}} as a percentage is {{116 2/3}}%, so Rohan sold the phone for {{116 2/3}}% of what he paid.",
        "Percentage profit = {{116 2/3}}% − 100% = {{16 2/3}}%",
      ],
    },
    commonError:
      "Giving a rounded decimal such as 16.7% when the question asks for an exact percentage. {{1/6}} × 100 = 16.666… recurring, so the exact answer is {{16 2/3}}%. Also make sure you divide by the price he paid ($240), not the price he sold it for.",
    strategy: "Use the multiplier",
  },
];
