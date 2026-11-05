import type { QA } from "../../types.ts";
import { dotPatterns } from "./dots.ts";

/** Practice paper 3, questions 1–10. See docs/papers-blueprint.md. */
export const P3_A: QA[] = [
  // 1 · nth term of two arithmetic sequences (like class mock Q1)
  {
    id: "p3-q01",
    topic: "sq",
    section: "sq-nth",
    difficulty: "warmup",
    question: "Find the rule for the nth term of each sequence below.",
    parts: [
      {
        label: "a",
        prompt: "11, 14, 17, 20, 23, …",
        marks: 2,
        answer: { type: "expression", expr: "3n+8", display: "{{3n + 8}}" },
        verify: "terms:11,14,17,20,23",
        traps: [
          {
            spec: { type: "expression", expr: "3n+11" },
            feedback: "3n + 11 gives 14 as the first term. The number you add to 3n is the **zeroth** term, one step back from 11: 11 − 3 = 8.",
          },
          {
            spec: { type: "expression", expr: "n+3" },
            feedback: "\"Add 3\" is the term-to-term rule. The nth-term rule multiplies n by the difference (3n), then adds the zeroth term.",
          },
        ],
      },
      {
        label: "b",
        prompt: "12, 10, 8, 6, 4, …",
        marks: 2,
        answer: { type: "expression", expr: "14-2n", display: "{{14 - 2n}}" },
        verify: "terms:12,10,8,6,4",
        traps: [
          {
            spec: { type: "expression", expr: "10-2n" },
            feedback: "10 − 2n gives 8 as the first term. The zeroth term is one step **back** from 12, and going back up this sequence you add 2: 12 + 2 = 14.",
          },
          {
            spec: { type: "expression", expr: "12-2n" },
            feedback: "12 − 2n gives 10 as the first term. Use the zeroth term (the term before 12), not the first term.",
          },
          {
            spec: { type: "expression", expr: "2n+10" },
            feedback: "The terms go **down** by 2, so the rule has −2n, not +2n. Your rule gives 12, 14, 16, …",
          },
          {
            spec: { type: "expression", expr: "n-2" },
            feedback: "\"Subtract 2\" is the term-to-term rule. The nth-term rule multiplies n by the difference (−2n), then adds the zeroth term.",
          },
        ],
      },
    ],
    hints: [
      "What is the difference between the terms? That number goes in front of n.",
      "Then find the zeroth term: the term one step before the first term. In (b) the terms go down, so the difference is negative.",
    ],
    solution: [
      "(a) The difference is +3, so the rule starts with 3n.",
      "Zeroth term = 11 − 3 = 8",
      "nth term = **3n + 8**",
      "Check: n = 2 gives 3 × 2 + 8 = 14 ✓",
      "(b) The difference is −2, so the rule has −2n.",
      "Zeroth term = 12 + 2 = 14 (one step back up the sequence)",
      "nth term = **14 − 2n** (you can also write −2n + 14)",
      "Check: n = 5 gives 14 − 2 × 5 = 4 ✓",
    ],
    commonError:
      "In (b), working out the zeroth term as 12 − 2 = 10. The sequence goes down, so one step back from 12 goes up: 12 + 2 = 14, which gives 14 − 2n.",
    strategy: "Look at the differences",
  },

  // 2 · factorise into a single bracket (like class mock Q2)
  {
    id: "p3-q02",
    topic: "ex",
    section: "ex-factorise",
    difficulty: "warmup",
    question: "Factorise the following expressions fully.",
    parts: [
      {
        label: "a",
        prompt: "{{36t + 27}}",
        marks: 2,
        answer: { type: "expression", expr: "9(4t+3)", form: "factorised", display: "{{9(4t + 3)}}" },
        verify: "36t+27",
        traps: [
          {
            spec: { type: "expression", expr: "9(4t+27)" },
            feedback: "Divide **both** terms by 9: 27 ÷ 9 = 3. Expanding 9(4t + 27) gives 36t + 243, not 36t + 27.",
          },
        ],
      },
      {
        label: "b",
        prompt: "{{6p^2 - 8p}}",
        marks: 2,
        answer: { type: "expression", expr: "2p(3p-4)", form: "factorised", display: "{{2p(3p - 4)}}" },
        verify: "6p^2-8p",
        traps: [
          {
            spec: { type: "expression", expr: "2p(3p-4p)" },
            feedback: "When you take 2p out, divide **both** terms by 2p: 8p ÷ 2p = 4, so no p is left in the second term. 2p(3p − 4p) expands to 6p² − 8p².",
          },
          {
            spec: { type: "expression", expr: "2p(3p+4)" },
            feedback: "Check the sign: 2p × (+4) = +8p, but the expression has −8p. The bracket needs (3p − 4).",
          },
          {
            spec: { type: "expression", expr: "2p(3p-8)" },
            feedback: "Divide the second term by 2p, not just by p: 8p ÷ 2p = 4. Expanding 2p(3p − 8) gives 6p² − 16p.",
          },
        ],
      },
    ],
    hints: [
      "Find the highest common factor of the numbers, then check whether a letter is in **every** term. Take all of it outside the bracket.",
      "Check by expanding your answer: you should get back to the expression you started with.",
    ],
    solution: [
      "(a) The HCF of 36 and 27 is 9. The second term has no t, so only 9 goes outside the bracket.",
      "36t ÷ 9 = 4t and 27 ÷ 9 = 3",
      "36t + 27 = **9(4t + 3)**",
      "Check: 9 × 4t = 36t and 9 × 3 = 27 ✓",
      "(b) The HCF of 6 and 8 is 2, and p is in both terms, so take out 2p.",
      "6p² ÷ 2p = 3p and 8p ÷ 2p = 4",
      "6p² − 8p = **2p(3p − 4)**",
      "Check: 2p × 3p = 6p² and 2p × (−4) = −8p ✓",
    ],
    commonError:
      "Not factorising fully in (b): p(6p − 8) and 2(3p² − 4p) are equivalent, but each still has a common factor inside the bracket. Take out the HCF of the numbers **and** the letter: 2p.",
    strategy: "Spot the common factor",
  },

  // 3 · new price after a percentage decrease (like class mock Q3)
  {
    id: "p3-q03",
    topic: "pc",
    section: "pc-change",
    difficulty: "core",
    question:
      "A skateboard is normally sold for $120. A shop is having a sale where all prices are reduced by 45%. Calculate the sale price of this skateboard.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 66, display: "$66" },
        verify: "120*(1-45/100)",
        traps: [
          {
            spec: { type: "number", value: 54 },
            feedback: "$54 is the amount taken off (45% of $120). The sale price is what is left: $120 − $54.",
          },
          {
            spec: { type: "number", value: 174 },
            feedback: "$174 is a 45% **increase**. In a sale the price goes down, so take the 45% away.",
          },
          {
            spec: { type: "number", value: 75 },
            feedback: "You took away $45, but the reduction is 45% **of $120**, not $45. Find 45% of $120 first.",
          },
        ],
      },
    ],
    hints: [
      "What percentage of the normal price is left after a 45% reduction?",
      "Multiply $120 by that percentage written as a decimal. Or find 45% of $120 from 10% and 5%, then take it away from $120.",
    ],
    solution: [
      "A 45% reduction leaves 100% − 45% = 55% of the price.",
      "55% as a decimal multiplier is 0.55",
      "Sale price = $120 × 0.55",
      "$120 × 0.5 = $60 and $120 × 0.05 = $6",
      "$60 + $6 = **$66**",
    ],
    altMethod: {
      label: "Find 45% with 10% and 5%",
      steps: [
        "10% of $120 = $12, so 40% = 4 × $12 = $48",
        "5% of $120 = $12 ÷ 2 = $6, so 45% = $48 + $6 = $54",
        "Sale price = $120 − $54 = $66",
      ],
    },
    commonError: "Stopping at $54: that is the amount taken off, not the sale price. Take it away from $120 (or multiply by 0.55 straight away).",
    strategy: "Use the multiplier",
  },

  // 4 · a three-part ratio from a percentage and a fraction (like class mock Q4)
  {
    id: "p3-q04",
    topic: "ra",
    section: "ra-basics",
    difficulty: "core",
    question:
      "In a sports club, 40% of the members play football, {{1/3}} of the members play basketball and the rest of the members play cricket. Express the ratio football : basketball : cricket as a ratio in its simplest form.",
    parts: [
      {
        marks: 2,
        answer: { type: "ratio", parts: [6, 5, 4], simplest: true, display: "6 : 5 : 4" },
        verify: "40/100 : 1/3 : 1-40/100-1/3",
        traps: [
          {
            spec: { type: "ratio", parts: [40, 33, 27] },
            feedback: "{{1/3}} is not 33%: it is {{33 1/3}}%, so rounding it changes the ratio. Keep it exact by writing 40% and {{1/3}} as fifteenths.",
          },
          {
            spec: { type: "ratio", parts: [40, 33.3, 26.7] },
            feedback: "33.3% is a rounded value of {{1/3}}, so this ratio is not exact. Write 40% and {{1/3}} as fractions with denominator 15 instead.",
          },
          {
            spec: { type: "ratio", parts: [40, 33.33, 26.67] },
            feedback: "33.33% is a rounded value of {{1/3}}, so this ratio is not exact. Write 40% and {{1/3}} as fractions with denominator 15 instead.",
          },
          {
            spec: { type: "ratio", parts: [4, 3, 3] },
            feedback: "{{1/3}} is not 30% (30% is {{3/10}}). {{1/3}} = {{33 1/3}}%. Write 40% and {{1/3}} as fifteenths to compare them exactly.",
          },
        ],
      },
    ],
    hints: [
      "Write 40% as a fraction in its simplest form, so both amounts are fractions.",
      "Use a common denominator of 15. What fraction of the members is left for cricket?",
      "When all three are fifteenths, the ratio is the three numerators. Check it will not simplify any further.",
    ],
    solution: [
      "Write 40% as a fraction: 40% = {{40/100}} = {{2/5}}",
      "The LCM of 5 and 3 is 15, so use fifteenths: {{2/5 = 6/15}} and {{1/3 = 5/15}}",
      "Cricket is the rest: {{15/15 - 6/15 - 5/15 = 4/15}}",
      "football : basketball : cricket = 6 : 5 : 4",
      "6, 5 and 4 have no common factor, so **6 : 5 : 4** is in its simplest form.",
    ],
    altMethod: {
      label: "Work in percentages, keeping the thirds",
      steps: [
        "{{1/3}} = {{33 1/3}}%",
        "Cricket = 100% − 40% − {{33 1/3}}% = {{26 2/3}}%",
        "The ratio is 40 : {{33 1/3}} : {{26 2/3}}. Multiply every part by 3 to clear the thirds: 120 : 100 : 80",
        "Divide every part by 20: 6 : 5 : 4",
      ],
    },
    commonError:
      "Rounding {{1/3}} to 33% (or 33.3%) and writing 40 : 33 : 27. Keep {{1/3}} exact: change both amounts into fifteenths.",
    strategy: "Find a common denominator",
  },

  // 5 · order of operations with fractions (like class mock Q5)
  {
    id: "p3-q05",
    topic: "fr",
    section: "fr-problems",
    difficulty: "core",
    question: "Calculate {{1 2/5}} + {{4/7}} × {{7/10}}\n\nGive your answer in its simplest form.",
    parts: [
      {
        marks: 3,
        answer: { type: "fraction", n: 9, d: 5, simplest: true, allowDecimal: true, display: "{{1 4/5}}" },
        verify: "(1+2/5)+(4/7)*(7/10)",
        traps: [
          {
            spec: { type: "fraction", n: 69, d: 50, allowDecimal: true },
            feedback:
              "You worked from left to right: ({{1 2/5}} + {{4/7}}) × {{7/10}} = {{1 19/50}}. Multiplication comes before addition, so work out {{4/7}} × {{7/10}} first.",
          },
          {
            spec: { type: "fraction", n: 4, d: 5, allowDecimal: true },
            feedback: "You have lost the whole number. {{4/7}} × {{7/10}} = {{2/5}}, and adding it to {{1 2/5}} keeps the 1 at the front.",
          },
        ],
      },
    ],
    hints: [
      "Which comes first, the + or the ×?",
      "Work out {{4/7}} × {{7/10}} first: the 7s cancel. Then add the result to {{1 2/5}}.",
    ],
    solution: [
      "Multiplication comes before addition, so work out {{4/7}} × {{7/10}} first.",
      "The 7s cancel: {{4/7}} × {{7/10}} = {{4/10}} = {{2/5}}",
      "{{1 2/5}} + {{2/5}} = **{{1 4/5}}**",
      "(As an improper fraction this is {{9/5}}, and as a decimal it is 1.8.)",
    ],
    commonError:
      "Working from left to right: adding {{1 2/5}} + {{4/7}} first and then multiplying by {{7/10}} gives {{1 19/50}}. Do the × before the +.",
    strategy: "Spot the common factor",
  },

  // 6 · a growing pattern: complete the table, then use the given rule (like class mock Q6)
  {
    id: "p3-q06",
    topic: "sq",
    section: "sq-generate",
    difficulty: "core",
    question: "Zara uses buttons to create a growing shape pattern, as shown below. The first pattern uses 5 buttons.",
    diagram: dotPatterns([[2, 3], [3, 3, 3], [4, 4, 4, 3]], "buttons"),
    table: { headers: ["Pattern number", "1", "2", "3"], rows: [["Number of buttons", "5", "?", "?"]] },
    parts: [
      {
        label: "a",
        prompt: "Complete the table to show how many buttons are used for patterns 2 and 3.",
        marks: 1,
        answer: { type: "list", values: [9, 15], ordered: true, display: "9, 15" },
        verify: "3+3+3, 4+4+4+3",
        traps: [
          {
            spec: { type: "list", values: [9, 13], ordered: true },
            feedback:
              "Count pattern 3 instead of carrying on with +4: it has three rows of 4 and a row of 3, so 15 buttons. This pattern does not go up by the same amount each time.",
          },
          {
            spec: { type: "list", values: [5, 9, 15], ordered: true },
            feedback: "Pattern 1 (5 buttons) is already in the table. Type just the two missing numbers, for pattern 2 and then pattern 3.",
          },
        ],
      },
      {
        label: "b",
        prompt:
          "Zara correctly identifies the rule for the nth term in this pattern as {{n^2 + n + 3}}. Use this formula to calculate the number of buttons she needs to create the 20th pattern of this sequence.",
        marks: 2,
        answer: { type: "number", value: 423 },
        verify: "20^2+20+3",
        traps: [
          {
            spec: { type: "number", value: 63 },
            feedback: "20² means 20 × 20 = 400, not 2 × 20. Then add the other two terms: 400 + 20 + 3.",
          },
        ],
      },
    ],
    hints: [
      "Start with (a): count the buttons in patterns 2 and 3 and fill in the table. It is a quick mark, so don't skip it.",
      "For (b), replace n with 20 in {{n^2 + n + 3}}. Work out 20² first.",
      "Write each calculation on its own line: first 20², then the addition on the next line.",
    ],
    solution: [
      "(a) Count the buttons in each pattern.",
      "Pattern 2: 3 + 3 + 3 = 9",
      "Pattern 3: 4 + 4 + 4 + 3 = 15",
      "So the table reads 5, **9**, **15**.",
      "Check with the rule: 2² + 2 + 3 = 9 ✓ and 3² + 3 + 3 = 15 ✓",
      "(b) Substitute n = 20 into {{n^2 + n + 3}}.",
      "20² = 20 × 20 = 400",
      "400 + 20 + 3 = 423",
      "Zara needs **423** buttons for the 20th pattern.",
      "Set it out one calculation per line, as above. A chain like 20 × 20 = 400 + 20 + 3 = 423 says 400 = 423, which is not true.",
    ],
    altMethod: {
      label: "See the rule in the picture",
      steps: [
        "Pattern n has n rows of (n + 1) buttons, plus a bottom row of 3. That is n(n + 1) + 3 = {{n^2 + n + 3}}.",
        "Pattern 20 has 20 rows of 21 buttons: 20 × 21 = 420",
        "Add the bottom row: 420 + 3 = 423 ✓",
      ],
    },
    commonError:
      "Leaving part (a) blank and jumping straight to the formula in (b). Part (a) is just counting the buttons in the pictures, so it is a quick mark: fill in the table first, then use it to check the rule works for patterns 1, 2 and 3.",
    strategy: "Find a pattern",
  },

  // 7 · multiplying algebraic fractions (like class mock Q7)
  {
    id: "p3-q07",
    topic: "fr",
    section: "fr-algebraic",
    difficulty: "core",
    question: "Write the answer to this calculation in its simplest form: {{(24k^2)/49}} × {{35/(16k)}}",
    parts: [
      {
        marks: 2,
        answer: { type: "expression", expr: "15k/14", form: "simplified", display: "{{(15k)/14}}" },
        verify: "(24k^2/49)*(35/(16k))",
        traps: [
          {
            spec: { type: "expression", expr: "15k^2/14" },
            feedback: "Only one k cancels: {{k^2}} ÷ k = k. So a single k is left on the top, not {{k^2}}.",
          },
          {
            spec: { type: "expression", expr: "15/(14k)" },
            feedback: "The k belongs on the top: {{k^2}} on the top divided by k on the bottom leaves k on the top.",
          },
          {
            spec: { type: "expression", expr: "384k^3/1715" },
            feedback: "You flipped the second fraction, but you only flip when you divide. To multiply, multiply the tops and the bottoms (cancelling first).",
          },
        ],
      },
    ],
    hints: [
      "Multiply the tops together and the bottoms together. It is easier if you cancel first.",
      "24 and 16 share a factor of 8, and 35 and 49 share a factor of 7. What is {{k^2}} ÷ k?",
    ],
    solution: [
      "Cancel common factors before multiplying.",
      "24 and 16 share a factor of 8: 24 ÷ 8 = 3 and 16 ÷ 8 = 2",
      "35 and 49 share a factor of 7: 35 ÷ 7 = 5 and 49 ÷ 7 = 7",
      "{{k^2}} ÷ k = k, so one k is left on the top.",
      "Tops: 3k × 5 = 15k. Bottoms: 7 × 2 = 14",
      "Answer: **{{(15k)/14}}**",
    ],
    altMethod: {
      label: "Multiply first, then simplify",
      steps: [
        "Tops: 24k² × 35 = 840k²",
        "Bottoms: 49 × 16k = 784k",
        "{{(840k^2)/(784k)}}: divide the top and the bottom by 56k to get {{(15k)/14}}",
      ],
    },
    commonError:
      "Cancelling the k's wrongly. {{k^2}} ÷ k = k, so one k stays on the top: {{(15k^2)/14}} and {{15/(14k)}} are both wrong.",
    strategy: "Spot the common factor",
  },

  // 8 · substituting a negative number, with a square root (like class mock Q8)
  {
    id: "p3-q08",
    topic: "su",
    section: "su-negatives",
    difficulty: "core",
    question: "Calculate the value of {{a^2 - sqrt(6b - c^2)}} where a = 4, b = 15, c = −3.",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 7 },
        verify: "4^2-sqrt(6*15-(-3)^2)",
        traps: [
          {
            // c² taken as −9: 16 − √99 ≈ 6.05, typed as 6, 6.05 or 6.1
            spec: { type: "number", value: 16 - Math.sqrt(99), tolerance: 0.06 },
            feedback:
              "(−3)² is not −9. A negative times a negative is positive: (−3)² = (−3) × (−3) = 9, so 6b − c² = 90 − 9 = 81. (Getting {{sqrt(99)}}, which is not a whole number, was a clue.)",
          },
          {
            spec: { type: "number", value: -1 },
            feedback: "a² means a × a = 4 × 4 = 16, not 2 × 4 = 8.",
          },
          {
            spec: { type: "number", value: -65 },
            feedback: "Don't forget the square root. 6b − c² = 81, and then {{sqrt(81)}} = 9.",
          },
        ],
      },
    ],
    hints: [
      "Work out each piece separately: a², then 6b, then c².",
      "Put brackets round the negative: c² = (−3)² = (−3) × (−3). Is that positive or negative?",
      "Work out 6b − c² and take its square root. Then take that away from a².",
    ],
    solution: [
      "a² = 4² = 16",
      "6b = 6 × 15 = 90",
      "c² = (−3)² = (−3) × (−3) = 9",
      "6b − c² = 90 − 9 = 81",
      "{{sqrt(81)}} = 9",
      "{{a^2 - sqrt(6b - c^2)}} = 16 − 9 = **7**",
    ],
    commonError:
      "Writing (−3)² as −9. A negative number squared is positive: (−3)² = (−3) × (−3) = 9. With −9 you get {{sqrt(99)}}, which is not a whole number: a sign that something has gone wrong.",
    strategy: "Check by substituting",
  },

  // 9 · sharing in a ratio when you know the difference between two shares (like class mock Q9)
  {
    id: "p3-q09",
    topic: "ra",
    section: "ra-sharing",
    difficulty: "core",
    question:
      "Grace, Hari and Ivy share some prize money in the ratio 5 : 3 : 11. When the money is divided between them, Ivy is given $240 more than Grace. How much money did Hari receive?",
    parts: [
      {
        marks: 3,
        answer: { type: "number", value: 120, display: "$120" },
        verify: "240/(11-5)*3",
        traps: [
          {
            spec: { type: "number", value: 200 },
            feedback: "$200 is Grace's share (5 parts). The question asks for Hari's share, which is 3 parts.",
          },
          {
            spec: { type: "number", value: 440 },
            feedback: "$440 is Ivy's share (11 parts). The question asks for Hari's share, which is 3 parts.",
          },
          {
            spec: { type: "number", value: 40 },
            feedback: "$40 is one part. Hari has 3 parts, so multiply by 3.",
          },
          {
            // $240 shared out as if it were the total: 240 ÷ 19 × 3 ≈ 37.89 (typed as 37.89, 37.9 or 38)
            spec: { type: "number", value: 720 / 19, tolerance: 0.15 },
            feedback: "$240 is not the total. It is the **difference** between Ivy's and Grace's shares, which is 11 − 5 = 6 parts.",
          },
        ],
      },
    ],
    hints: [
      "Ivy has 11 parts and Grace has 5 parts. How many more parts does Ivy have than Grace?",
      "Those extra parts are worth $240. Find what one part is worth, then Hari's share.",
    ],
    solution: [
      "Ivy has 11 parts and Grace has 5 parts, so Ivy has 11 − 5 = 6 more parts.",
      "6 parts = $240",
      "1 part = $240 ÷ 6 = $40",
      "Hari has 3 parts: 3 × $40 = **$120**",
      "Check: Grace gets 5 × $40 = $200 and Ivy gets 11 × $40 = $440, and $440 − $200 = $240 ✓",
    ],
    commonError:
      "Sharing $240 in the ratio 5 : 3 : 11 as if it were the total. The $240 is the **difference** between Ivy and Grace, which is 6 parts. Then make sure you give Hari's share, not Grace's or Ivy's.",
    strategy: "Use a bar model",
  },

  // 10 · percentage profit with a recurring answer, given exactly (like class mock Q10)
  {
    id: "p3-q10",
    topic: "pc",
    section: "pc-percent-change",
    difficulty: "core",
    question:
      "Mia buys a bike for $360. Three weeks later she sells it for $390. Calculate the percentage profit that she has made in selling the bike. Give your answer as an exact percentage.",
    parts: [
      {
        marks: 2,
        answer: { type: "fraction", n: 25, d: 3, simplest: true, display: "{{8 1/3}}%" },
        verify: "(390-360)/360*100",
        traps: [
          {
            // The checker reads "recurring" as a unit, so "8.3 recurring" would otherwise meet the "rounded" trap below.
            // ("8.3 recurring %" can't be read as a number at all, so it never reaches the traps.)
            spec: {
              type: "text",
              accept: [
                "8.3 recurring",
                "8.33 recurring",
                "8.333 recurring",
                "8.3333 recurring",
                "8.3 recurring percent",
                "8.3 repeating",
                "8.33 repeating",
                "8.3 rec",
                "8.3r",
              ],
            },
            feedback:
              "8.3 recurring means the same as {{8 1/3}}, so your value is exact. On paper, show that it recurs with a dot over the 3, or (better, the way your teacher wrote {{33 1/3}}%) give the fraction: {{8 1/3}}%.",
          },
          {
            spec: { type: "number", value: 8.33, tolerance: 0.04 },
            feedback:
              "8.3% and 8.33% are rounded. {{1/12}} × 100 = {{8 1/3}}, a recurring decimal, so the exact answer is {{8 1/3}}%. When a question says exact, keep the fraction (like {{33 1/3}}% rather than 33.3% in your class test).",
          },
          {
            spec: { type: "number", value: 3000 / 390, tolerance: 0.02 },
            feedback: "You divided the profit by the selling price, $390. Percentage profit is worked out from what she **paid**: $30 ÷ $360 × 100.",
          },
          {
            spec: { type: "number", value: 325 / 3, tolerance: 0.04 },
            feedback: "{{108 1/3}}% is $390 as a percentage of $360. The profit is the part above 100%, so take away 100.",
          },
          {
            spec: { type: "number", value: 30 },
            feedback: "$30 is the profit in dollars. Now write it as a percentage of what she paid, $360.",
          },
          {
            spec: { type: "number", value: 1 / 12, tolerance: 0.001 },
            feedback: "{{1/12}} is the profit as a fraction of what she paid. Multiply by 100 to turn it into a percentage.",
          },
        ],
      },
    ],
    hints: [
      "How much profit does Mia make, in dollars?",
      "Percentage profit = profit ÷ original price × 100. Which price is the original?",
      "Simplify the fraction before you multiply by 100. Exact means no rounding, so keep a fraction or mixed number.",
    ],
    solution: [
      "Profit = $390 − $360 = $30",
      "Percentage profit = {{30/360}} × 100 (divide by what she paid, the original price)",
      "{{30/360 = 1/12}}",
      "{{1/12}} × 100 = {{100/12}} = {{25/3}} = {{8 1/3}}",
      "Percentage profit = **{{8 1/3}}%**",
      "8.3% or 8.33% would be rounded. The question asks for an exact percentage, so keep the fraction: {{8 1/3}}%.",
    ],
    commonError:
      "Rounding to 8.3% or 8.33% when the question asks for an exact percentage (like writing 33.3% instead of {{33 1/3}}% in the class test). {{1/12}} of 100 is {{8 1/3}}, so write {{8 1/3}}%.",
    strategy: "Spot the common factor",
  },
];
