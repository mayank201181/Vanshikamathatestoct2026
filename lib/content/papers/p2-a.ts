import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 2, questions 1–10. See docs/papers-blueprint.md. */
export const P2_A: QA[] = [
  {
    id: "p2-q01",
    topic: "sq",
    section: "sq-nth",
    difficulty: "warmup",
    question: "Find the rule for the nth term of each sequence below.",
    parts: [
      {
        label: "a",
        prompt: "4, 11, 18, 25, 32, …",
        marks: 2,
        answer: { type: "expression", expr: "7n-3" },
        verify: "terms:4,11,18,25,32",
        traps: [
          {
            spec: { type: "expression", expr: "7n+4" },
            feedback:
              "4 is the **1st** term, not the zeroth term. Go one step back from 4: 4 − 7 = −3. (Check: 7n + 4 gives 11 when n = 1, not 4.)",
          },
          {
            spec: { type: "expression", expr: "n+7" },
            feedback:
              "n + 7 gives 8, 9, 10, … and only goes up by 1. The difference, 7, goes **in front of n** (7n is the 7 times table), then you adjust with the zeroth term.",
          },
        ],
      },
      {
        label: "b",
        prompt: "25, 20, 15, 10, 5, …",
        marks: 2,
        answer: { type: "expression", expr: "30-5n" },
        verify: "terms:25,20,15,10,5",
        traps: [
          {
            spec: { type: "expression", expr: "25-5n" },
            feedback:
              "25 is the **1st** term, not the zeroth term. One step before 25 is 25 + 5 = 30. (Check: 25 − 5n gives 20 when n = 1, not 25.)",
          },
          {
            spec: { type: "expression", expr: "5n+20" },
            feedback:
              "5n + 20 gives 25, 30, 35, … so it goes **up**. These terms go down by 5, so the rule needs −5n, and the zeroth term is one step back up from 25.",
          },
          {
            spec: { type: "expression", expr: "5n+30" },
            feedback: "The zeroth term, 30, is right. But the terms go **down** by 5, so it's −5n, not +5n.",
          },
        ],
      },
    ],
    hints: [
      "What is added or taken away each time? That number, with its sign, goes in front of n.",
      "Find the zeroth term: the term one step *before* the 1st term. That's the number on its own in the rule.",
    ],
    solution: [
      "(a) The terms go up by 7 each time, so the rule starts with 7n.",
      "The zeroth term is one step before the 1st term: 4 − 7 = −3.",
      "So the nth term is **7n − 3**. Check: n = 1 gives 7 − 3 = 4 ✓ and n = 5 gives 35 − 3 = 32 ✓",
      "(b) The terms go down by 5 each time, so the rule has −5n.",
      "The zeroth term is one step before 25, going back up: 25 + 5 = 30.",
      "So the nth term is **30 − 5n** (or −5n + 30). Check: n = 1 gives 30 − 5 = 25 ✓ and n = 5 gives 30 − 25 = 5 ✓",
    ],
    commonError:
      "Using the 1st term instead of the zeroth term (7n + 4, or 25 − 5n), and writing +5n instead of −5n when the sequence goes down.",
    strategy: "Look at the differences",
  },
  {
    id: "p2-q02",
    topic: "ex",
    section: "ex-factorise",
    difficulty: "warmup",
    question: "Factorise the following expressions.",
    parts: [
      {
        label: "a",
        prompt: "{{28m - 21}}",
        marks: 2,
        answer: { type: "expression", expr: "7(4m-3)", form: "factorised" },
        verify: "28m-21",
        traps: [
          {
            spec: { type: "expression", expr: "7(4m+3)" },
            feedback: "Check the sign: 7(4m + 3) expands to 28m **+** 21. The expression has −21.",
          },
          {
            spec: { type: "expression", expr: "7(4m-21)" },
            feedback: "Divide **both** terms by 7, not just the first one. Expanding 7(4m − 21) gives 28m − 147.",
          },
        ],
      },
      {
        label: "b",
        prompt: "{{4y^2 + 10y}}",
        marks: 2,
        answer: { type: "expression", expr: "2y(2y+5)", form: "factorised" },
        verify: "4y^2+10y",
        traps: [
          {
            spec: { type: "expression", expr: "2y(2y+5y)" },
            feedback: "Divide **both** terms by 2y: in 10y ÷ 2y the y's cancel, so no y is left. Expanding 2y(2y + 5y) gives 4y² + 10y², not 10y.",
          },
          {
            spec: { type: "expression", expr: "2y(2y^2+5)" },
            feedback: "y² ÷ y = y, so 4y² ÷ 2y = 2y, not 2y². Expanding 2y(2y² + 5) gives 4y³ + 10y.",
          },
        ],
      },
    ],
    hints: [
      "Find the highest common factor (HCF) of the numbers. Is the same letter in both terms too?",
      "y² means y × y, so both terms in (b) have a factor of y. Check each answer by expanding the bracket.",
    ],
    solution: [
      "(a) The HCF of 28 and 21 is 7 (28 = 7 × 4 and 21 = 7 × 3). Only the first term has an m, so m stays inside the bracket.",
      "28m − 21 = **7(4m − 3)**. Check by expanding: 7 × 4m = 28m and 7 × (−3) = −21 ✓",
      "(b) Numbers: the HCF of 4 and 10 is 2. Letters: 4y² = 4 × y × y and 10y = 10 × y, so y is common too. The HCF is 2y.",
      "Divide each term by 2y: 4y² ÷ 2y = 2y and 10y ÷ 2y = 5.",
      "4y² + 10y = **2y(2y + 5)**. Check by expanding: 2y × 2y = 4y² and 2y × 5 = 10y ✓",
      "2y + 5 has no common factor left, so it is fully factorised. 2(2y² + 5y) or y(4y + 10) would only get 1 of the 2 marks.",
    ],
    commonError:
      "Not factorising fully in (b): 2(2y² + 5y) and y(4y + 10) still have a common factor inside the bracket. Take out the number **and** the letter: 2y.",
    strategy: "Spot the common factor",
  },
  {
    id: "p2-q03",
    topic: "pc",
    section: "pc-change",
    difficulty: "core",
    question:
      "A jacket is normally sold for $85. A shop is having a sale where all prices are reduced by 20%. Calculate the sale price of this jacket.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 68, display: "$68" },
        verify: "85*(1-20/100)",
        traps: [
          {
            spec: { type: "number", value: 17 },
            feedback: "$17 is the amount taken off (20% of $85). The sale price is what's left after you take it away from $85.",
          },
          {
            spec: { type: "number", value: 102 },
            feedback: "$102 is a 20% **increase**. In a sale the price goes down, so subtract the 20% instead of adding it.",
          },
          {
            spec: { type: "number", value: 65 },
            feedback: "You took $20 off, not 20%. Work out 20% of $85 first (10% of $85 is $8.50).",
          },
        ],
      },
    ],
    hints: [
      "Find 10% of $85 first, then double it to get 20%.",
      "The price is *reduced*, so take the 20% away from $85. (Or use a multiplier: what percentage of the price is left?)",
    ],
    solution: [
      "10% of $85 = 85 ÷ 10 = $8.50",
      "20% of $85 = 2 × $8.50 = $17",
      "Sale price = $85 − $17 = **$68**",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "A 20% decrease leaves 100% − 20% = 80% of the price, so the multiplier is 0.8.",
        "$85 × 0.8 = $68",
      ],
    },
    commonError: "Stopping at the discount ($17) instead of taking it off the normal price. The question asks for the sale price.",
    strategy: "Use the multiplier",
  },
  {
    id: "p2-q04",
    topic: "ra",
    section: "ra-basics",
    difficulty: "core",
    question:
      "In a garden, {{3/8}} of the flowers are roses, 25% of the flowers are tulips and the rest of the flowers are daisies. Express the ratio number of roses : number of tulips : number of daisies as a ratio in its simplest form.",
    parts: [
      {
        marks: 2,
        answer: { type: "ratio", parts: [3, 2, 3], simplest: true },
        verify: "3/8 : 25/100 : 1-3/8-25/100",
        traps: [
          {
            spec: { type: "ratio", parts: [3, 1, 4] },
            feedback:
              "{{3/8}} and {{1/4}} have different denominators, so you can't just use the tops, 3 and 1. Change 25% into eighths first: 25% = {{1/4}} = {{2/8}}.",
          },
          {
            spec: { type: "ratio", parts: [3, 2, 5] },
            feedback: "The daisies are what's left after the roses **and** the tulips: {{1 - 3/8 - 2/8}}, not just {{1 - 3/8}}.",
          },
        ],
      },
    ],
    hints: [
      "Write the roses and the tulips in the same form: both as eighths, or both as percentages.",
      "The daisies are the rest: take the roses and the tulips away from the whole.",
      "Once all three are in eighths, the ratio is just the three numerators. Can it be simplified?",
    ],
    solution: [
      "Change 25% into eighths: 25% = {{1/4}} = {{2/8}}",
      "Daisies are the rest: {{1 - 3/8 - 2/8 = 3/8}}",
      "roses : tulips : daisies = {{3/8}} : {{2/8}} : {{3/8}}",
      "Multiply every part by 8: **3 : 2 : 3**. 3, 2 and 3 have no common factor, so this is the simplest form.",
    ],
    altMethod: {
      label: "Use percentages",
      steps: [
        "{{3/8}} = 37.5%, so the daisies are 100% − 37.5% − 25% = 37.5%.",
        "roses : tulips : daisies = 37.5 : 25 : 37.5",
        "Multiply by 2 to clear the decimals: 75 : 50 : 75",
        "Divide by 25: 3 : 2 : 3",
      ],
    },
    commonError:
      "Using the tops of fractions with different denominators: {{3/8}} and {{1/4}} give 3 : 1 : 4. Write every part as eighths (or as percentages) before you compare them.",
    strategy: "Find a common denominator",
  },
  {
    id: "p2-q05",
    topic: "fr",
    section: "fr-problems",
    difficulty: "core",
    question: "Calculate {{5 1/2}} − {{3/4}} × {{2/9}}. Give your answer in its simplest form.",
    parts: [
      {
        marks: 3,
        answer: { type: "fraction", n: 16, d: 3, simplest: true, display: "{{5 1/3}}" },
        verify: "(5+1/2)-(3/4)*(2/9)",
        traps: [
          {
            spec: { type: "fraction", n: 19, d: 18 },
            feedback:
              "You worked from left to right: ({{5 1/2}} − {{3/4}}) × {{2/9}}. BIDMAS: multiply **before** you subtract, so work out {{3/4}} × {{2/9}} first.",
          },
          {
            spec: { type: "number", value: 5.33, tolerance: 0.035 },
            feedback: "That's a rounded decimal. {{1/3}} = 0.333… goes on for ever, so give the exact answer as a fraction or a mixed number.",
          },
        ],
      },
    ],
    hints: [
      "Which do you do first: the − or the ×?",
      "Cancel before you multiply: 3 and 9 have a common factor, and so do 2 and 4.",
      "To subtract, write {{1/2}} with the same denominator as your answer to the multiplication.",
    ],
    solution: [
      "BIDMAS: multiplication comes before subtraction, so start with {{3/4}} × {{2/9}}.",
      "Cancel first (3 with 9, and 2 with 4): {{3/4}} × {{2/9}} = {{1/2}} × {{1/3}} = {{1/6}}",
      "Now subtract: {{5 1/2}} − {{1/6}}",
      "Use sixths: {{1/2}} = {{3/6}}, so {{5 3/6}} − {{1/6}} = {{5 2/6}}",
      "Simplify: {{5 2/6}} = **{{5 1/3}}** (or {{16/3}})",
      "Check: you only took a small amount, {{1/6}}, away from {{5 1/2}}, so an answer just under {{5 1/2}} makes sense ✓",
    ],
    altMethod: {
      label: "Improper fractions",
      steps: [
        "{{3/4}} × {{2/9}} = {{6/36}} = {{1/6}}",
        "{{5 1/2}} = {{11/2}} = {{33/6}}",
        "{{33/6}} − {{1/6}} = {{32/6}} = {{16/3}} = {{5 1/3}}",
      ],
    },
    commonError:
      "Working from left to right: doing {{5 1/2}} − {{3/4}} first and then multiplying by {{2/9}} gives {{1 1/18}}. Multiplication comes before subtraction.",
    strategy: "Estimate first",
  },
  {
    id: "p2-q06",
    topic: "sq",
    section: "sq-generate",
    difficulty: "core",
    question: "Kai uses coins to create a growing shape pattern, as shown below. The first pattern uses 6 coins.",
    diagram: dotPatterns([[2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4, 4]], "coins"),
    table: {
      headers: ["Pattern number", "1", "2", "3"],
      rows: [["Number of coins", "6", "?", "?"]],
    },
    parts: [
      {
        label: "a",
        prompt:
          "Complete the table to show how many coins are used for the other patterns. Write the numbers for patterns 2 and 3 in that order, separated by a comma.",
        marks: 1,
        answer: { type: "list", values: [12, 20], ordered: true },
        verify: "4*3, 5*4",
        traps: [
          {
            spec: { type: "list", values: [12, 18], ordered: true },
            feedback: "The pattern doesn't go up by the same amount each time. Count the coins in pattern 3: it has 5 rows of 4.",
          },
          {
            spec: { type: "list", values: [12, 24], ordered: true },
            feedback: "The pattern doesn't double each time. Count the coins in pattern 3: it has 5 rows of 4.",
          },
          {
            spec: { type: "list", values: [6, 12, 20], ordered: true },
            feedback: "Your table is right, but the 6 for pattern 1 was already given. Give only the two new numbers, for patterns 2 and 3.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Kai correctly identifies the rule for the nth term in this pattern as {{n^2 + 3n + 2}}. Use this formula to calculate the number of coins he needs to create the 15th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 272 },
        verify: "15^2+3*15+2",
        traps: [
          {
            spec: { type: "number", value: 77 },
            feedback: "15² means 15 × 15 = 225, not 15 × 2 = 30.",
          },
          {
            spec: { type: "number", value: 270 },
            feedback: "Nearly: 15² = 225 and 3 × 15 = 45 are right, but you've left off the + 2 at the end of the rule.",
          },
        ],
      },
    ],
    hints: [
      "Do part (a) first: it's a mark just for counting. How many rows does pattern 2 have, and how many coins are in each row?",
      "For (b), put n = 15 into the rule. Work out 15² on one line and 3 × 15 on the next, then add them and the 2.",
    ],
    solution: [
      "(a) Each pattern is a rectangle of coins, so count the rows and the coins in each row.",
      "Pattern 2: 4 rows of 3 coins, 4 × 3 = **12** coins.",
      "Pattern 3: 5 rows of 4 coins, 5 × 4 = **20** coins.",
      "Check with the rule from (b): n = 2 gives 4 + 6 + 2 = 12 ✓ and n = 3 gives 9 + 9 + 2 = 20 ✓",
      "(b) Substitute n = 15 into {{n^2 + 3n + 2}}, with each calculation on its own line:\n\n    {{n^2}} = 15 × 15 = 225\n    3n = 3 × 15 = 45\n    {{n^2 + 3n + 2}} = 225 + 45 + 2 = 272",
      "Kai needs **272** coins for the 15th pattern.",
      "Avoid one long chain like 15 × 15 = 225 + 45 = 270 + 2 = 272: it says 15 × 15 equals 225 + 45, which isn't true. Give each calculation its own line.",
    ],
    altMethod: {
      label: "Use the picture",
      steps: [
        "Pattern 1 is 3 rows of 2, pattern 2 is 4 rows of 3 and pattern 3 is 5 rows of 4.",
        "So pattern n is (n + 2) rows of (n + 1) coins, and (n + 2)(n + 1) = {{n^2 + 3n + 2}}, the rule Kai found ✓",
        "Pattern 15 is 17 rows of 16 coins: 17 × 16 = 272.",
      ],
    },
    commonError:
      "Leaving the table in (a) blank and jumping straight to the formula in (b), which throws away the easiest mark on the question. Fill in the table first: count the coins, or put n = 2 and n = 3 into the rule.",
    strategy: "Find a pattern",
  },
  {
    id: "p2-q07",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "core",
    question: "Write the answer to this calculation in its simplest form: {{(14a^5)/9}} × {{15/(28a^2)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "5a^3/6", form: "simplified", display: "{{(5a^3)/6}}" },
        verify: "(14a^5/9)*(15/(28a^2))",
        traps: [
          {
            spec: { type: "expression", expr: "5a^7/6" },
            feedback:
              "{{a^2}} is on the **bottom**, so it cancels with the {{a^5}} on top: subtract the powers, don't add them. Adding the powers is for when both are on top.",
          },
          {
            spec: { type: "expression", expr: "392a^7/135" },
            feedback: "You flipped the second fraction. Only flip when you **divide**. To multiply, multiply the tops and the bottoms, then cancel.",
          },
        ],
      },
    ],
    hints: [
      "Deal with the numbers and the letters separately.",
      "Cancel before you multiply: 14 goes into 28, and 3 goes into both 15 and 9.",
      "{{a^5}} = a × a × a × a × a is on top and {{a^2}} = a × a is on the bottom. How many a's are left after cancelling?",
    ],
    solution: [
      "Cancel the numbers first: 14 and 28 share a factor of 14 (14 ÷ 14 = 1 and 28 ÷ 14 = 2); 15 and 9 share a factor of 3 (15 ÷ 3 = 5 and 9 ÷ 3 = 3).",
      "Numbers: {{(1 * 5)/(3 * 2) = 5/6}}",
      "Letters: {{a^5/a^2 = a^3}} (two a's cancel, three are left on top).",
      "So the answer is **{{(5a^3)/6}}**.",
    ],
    altMethod: {
      label: "Multiply, then simplify",
      steps: [
        "Tops: 14a⁵ × 15 = 210a⁵. Bottoms: 9 × 28a² = 252a².",
        "The HCF of 210 and 252 is 42: 210 ÷ 42 = 5 and 252 ÷ 42 = 6.",
        "{{a^5/a^2 = a^3}}, so {{(210a^5)/(252a^2) = (5a^3)/6}}",
      ],
    },
    commonError:
      "Adding the powers to get {{a^7}} instead of subtracting them: {{a^5}} on top and {{a^2}} on the bottom leave {{a^3}}. And only flip a fraction when you are dividing.",
    strategy: "Spot the common factor",
  },
  {
    id: "p2-q08",
    topic: "su",
    section: "su-negatives",
    difficulty: "core",
    question: "Calculate the value of {{3x + sqrt(y^2 - 4z)}} where {{x = -5}}, {{y = -6}} and {{z = 5}}.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: -11 },
        verify: "3*(-5)+sqrt((-6)^2-4*5)",
        traps: [
          {
            spec: { type: "number", value: 19 },
            feedback: "3x = 3 × (−5) = **−15**, not 15: a positive times a negative is negative.",
          },
          {
            spec: { type: "number", value: 1 },
            feedback: "{{y^2 - 4z}} = 16 ✓, but you didn't square-root it. Find {{sqrt(16)}} and add that to 3x.",
          },
          {
            spec: { type: "number", value: -19 },
            feedback: "−19 is −15 − 4. The square root is **+**4, so it's −15 + 4: start at −15 and count 4 up.",
          },
          {
            spec: { type: "number", value: 11 },
            feedback: "Check the sign: −15 + 4 is still below zero, because 15 is bigger than 4.",
          },
          {
            spec: { type: "number", value: -71 },
            feedback:
              "−71 comes from writing (−6)² as −36 and then leaving out the square root. (−6)² = (−6) × (−6) = +36, so the part under the root is 36 − 20.",
          },
        ],
      },
    ],
    hints: [
      "Put brackets round each negative number when you substitute: 3 × (−5) and (−6)².",
      "Work out the part under the square root first, then take the square root, then add it to 3x.",
      "(−6)² means (−6) × (−6). Is that positive or negative?",
    ],
    solution: [
      "Substitute, with brackets round the negatives: {{3 * (-5) + sqrt((-6)^2 - 4 * 5)}}",
      "3x = 3 × (−5) = −15",
      "y² = (−6) × (−6) = 36 (negative × negative = positive, so not −36)",
      "4z = 4 × 5 = 20",
      "{{y^2 - 4z}} = 36 − 20 = 16",
      "{{sqrt(16)}} = 4",
      "{{3x + sqrt(y^2 - 4z)}} = −15 + 4 = **−11**",
    ],
    commonError:
      "Writing (−6)² as −36: a negative times a negative is positive, so (−6)² = 36. (A negative number under the square root is the sign to check your squaring.) Also watch 3 × (−5) = −15, not 15.",
    strategy: "Check by substituting",
  },
  {
    id: "p2-q09",
    topic: "ra",
    section: "ra-sharing",
    difficulty: "core",
    question:
      "Dev, Ella and Finn share some money in the ratio 4 : 7 : 2. When the money is divided between them, Ella is given $45 more than Dev. How much money was shared altogether?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 195, display: "$195" },
        verify: "45/(7-4)*(4+7+2)",
        traps: [
          {
            spec: { type: "number", value: 105 },
            feedback: "$105 is Ella's share. The question asks for the money shared **altogether**: how many parts are there in total?",
          },
          {
            spec: { type: "number", value: 60 },
            feedback: "$60 is Dev's share. The question asks for the money shared **altogether**: how many parts are there in total?",
          },
          {
            spec: { type: "number", value: 30 },
            feedback: "$30 is Finn's share. The question asks for the money shared **altogether**: how many parts are there in total?",
          },
          {
            spec: { type: "number", value: 15 },
            feedback: "$15 is the value of one part. Now multiply it by the total number of parts, 4 + 7 + 2.",
          },
          {
            spec: { type: "number", value: 585 },
            feedback: "The $45 is not one part. Ella has 7 − 4 = 3 parts more than Dev, so it's 3 parts that are worth $45.",
          },
        ],
      },
    ],
    hints: [
      "How many more parts does Ella have than Dev?",
      "Those extra parts are worth $45. What is one part worth?",
      "Read the question again: it wants the total, not one person's share.",
    ],
    solution: [
      "Ella has 7 parts and Dev has 4 parts, so Ella has 7 − 4 = 3 parts more.",
      "3 parts = $45, so 1 part = $45 ÷ 3 = $15",
      "Total number of parts = 4 + 7 + 2 = 13",
      "Total shared = 13 × $15 = **$195**",
      "Check: Dev gets 4 × $15 = $60, Ella gets 7 × $15 = $105 and Finn gets 2 × $15 = $30. $105 − $60 = $45 ✓ and $60 + $105 + $30 = $195 ✓",
    ],
    altMethod: {
      label: "Bar model",
      steps: [
        "Draw Dev's bar as 4 equal boxes, Ella's as 7 and Finn's as 2.",
        "Ella's bar is 3 boxes longer than Dev's, and those 3 boxes are the $45, so each box is $15.",
        "There are 13 boxes altogether: 13 × $15 = $195.",
      ],
    },
    commonError:
      "Stopping at one person's share (such as Ella's $105) when the question asks for the total. Also, the $45 difference is 3 parts, not 1 part.",
    strategy: "Use a bar model",
  },
  {
    id: "p2-q10",
    topic: "pc",
    section: "pc-percent-change",
    difficulty: "core",
    question:
      "A shopkeeper buys a lamp for $80. A month later he sells it for $108. Calculate the percentage profit that he has made in selling the lamp.",
    parts: [
      {
        marks: 2,
        answer: { type: "number", value: 35, display: "35%" },
        verify: "(108-80)/80*100",
        traps: [
          {
            spec: { type: "number", value: 25.93, tolerance: 0.5 },
            feedback: "You divided by the selling price ($108). Percentage profit is out of the price he **paid**: divide the profit by $80.",
          },
          {
            spec: { type: "number", value: 135 },
            feedback: "$108 is 135% **of** what he paid (108 ÷ 80 = 1.35). The profit is only the part above 100%.",
          },
          {
            spec: { type: "number", value: 28 },
            feedback: "$28 is the profit in dollars. Now write it as a percentage of the $80 he paid.",
          },
          {
            spec: { type: "number", value: 0.35 },
            feedback: "0.35 is the profit as a decimal of what he paid. Multiply by 100 to make it a percentage.",
          },
          {
            spec: { type: "number", value: 1.35 },
            feedback: "1.35 is the multiplier (108 ÷ 80): he sold the lamp for 135% of what he paid. The profit is only the part above 100%.",
          },
        ],
      },
    ],
    hints: [
      "Work out the profit in dollars first.",
      "Percentage profit = profit ÷ the **original** price (what he paid) × 100.",
      "{{28/80}} simplifies. Can you write it as a fraction out of 100?",
    ],
    solution: [
      "Profit = $108 − $80 = $28",
      "Percentage profit = {{28/80}} × 100 (divide by the price he paid, because that's where the change started)",
      "{{28/80}} = {{7/20}} = {{35/100}}",
      "So the percentage profit is **35%**.",
    ],
    altMethod: {
      label: "Use the multiplier",
      steps: [
        "108 ÷ 80 = 1.35, so he sold the lamp for 135% of what he paid.",
        "135% − 100% = 35% profit.",
      ],
    },
    commonError:
      "Dividing by the selling price ({{28/108}} ≈ 25.9%) instead of the price he paid. Percentage profit is always worked out from the original (cost) price.",
    strategy: "Use the multiplier",
  },
];
