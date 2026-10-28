import type { QA, QuestionSet } from "../../types";

// Fractions — written (show-your-method) questions: 4 sets × 6 questions.
// Every auto-marked part has a `verify` expression rebuilt from the question's own numbers or algebra.

export const WRITTEN_FR: QuestionSet<QA>[] = [
  // ─────────────── Set 1 · Foundations (warm-up 2 · core 3 · challenge 1) ───────────────
  {
    id: "fr-written-1",
    title: "Written 1 · Foundations",
    subtitle: "Simplifying, mixed numbers, the four operations and your first algebraic fractions.",
    topic: "fr",
    questions: [
      {
        id: "fr-w1-q01",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "warmup",
        question: "The same amount can be written as lots of different fractions. Answer each part.",
        parts: [
          {
            label: "a",
            prompt: "Write {{36/48}} in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 3, d: 4, simplest: true },
            verify: "36/48",
          },
          {
            label: "b",
            prompt: "Write {{23/6}} as a mixed number.",
            marks: 1,
            answer: { type: "fraction", n: 23, d: 6, form: "mixed", simplest: true },
            verify: "23/6",
            traps: [
              { spec: { type: "fraction", n: 11, d: 2 }, feedback: "You've swapped the whole number and the remainder. 23 ÷ 6 = 3 remainder 5, so it's 3 wholes and 5 sixths left over." },
            ],
          },
          {
            label: "c",
            prompt: "Write {{4 3/7}} as an improper (top-heavy) fraction.",
            marks: 1,
            answer: { type: "fraction", n: 31, d: 7, form: "improper", simplest: true },
            verify: "4+3/7",
            traps: [
              { spec: { type: "fraction", n: 28, d: 7 }, feedback: "{{28/7}} is just the 4 wholes. Don't forget to add the extra {{3/7}}: 28 + 3 = 31 sevenths." },
            ],
          },
        ],
        hints: [
          "(a) What is the biggest number that divides exactly into both 36 and 48?",
          "(b) How many whole 6s fit into 23, and how many are left over? (c) How many sevenths make 4 wholes?",
        ],
        solution: [
          "(a) The HCF of 36 and 48 is 12. Divide the top and the bottom by 12: {{36/48 = 3/4}}.",
          "You can also simplify in steps: ÷ 4 gives {{9/12}}, then ÷ 3 gives {{3/4}}.",
          "(b) 23 ÷ 6 = 3 remainder 5. That's 3 wholes and 5 sixths: {{23/6 = 3 5/6}}.",
          "(c) Each whole is {{7/7}}, so 4 wholes = {{28/7}}. Add the {{3/7}}: {{28/7 + 3/7 = 31/7}}.",
          "Shortcut for (c): whole number × denominator + numerator = 4 × 7 + 3 = 31, over the same denominator, 7.",
        ],
        commonError: "Swapping the whole number and the remainder in (b) (writing {{5 3/6}}), or forgetting to add the extra {{3/7}} in (c).",
        strategy: "Spot the common factor",
      },
      {
        id: "fr-w1-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "warmup",
        question: "Here is a fraction sum: {{2/3 + 1/4}}.",
        parts: [
          {
            label: "a",
            prompt: "Work out {{2/3 + 1/4}}. Give your answer in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 11, d: 12, simplest: true },
            verify: "2/3+1/4",
            traps: [
              { spec: { type: "fraction", n: 3, d: 7 }, feedback: "{{3/7}} comes from adding the numerators and adding the denominators. Thirds and quarters are different-sized pieces — change both to twelfths first." },
            ],
          },
          {
            label: "b",
            prompt: "Arjun says {{2/3 + 1/4 = 3/7}}. Explain the mistake Arjun has made.",
            marks: 2,
            markScheme: [
              {
                point: "Says Arjun added the numerators (2 + 1) and added the denominators (3 + 4).",
                keywords: ["added+numerator", "added+top", "add+numerator", "add+top", "adding+numerator", "adding+top", "added+denominator", "added+bottom"],
                feedback: "Name the slip: Arjun added the tops (2 + 1 = 3) and added the bottoms (3 + 4 = 7).",
              },
              {
                point: "Says you need a common denominator first, giving {{8/12 + 3/12 = 11/12}}.",
                keywords: ["common denominator", "same denominator", "11/12", "8/12", "twelfths", "lcm", "same size"],
                feedback: "Say what he should have done: rewrite both fractions with a common denominator (12), then add the numerators: {{8/12 + 3/12 = 11/12}}.",
              },
            ],
            model: "Arjun added the numerators (2 + 1 = 3) and added the denominators (3 + 4 = 7). You can only add fractions when they have a common denominator, because the denominator tells you the size of the pieces. {{2/3 = 8/12}} and {{1/4 = 3/12}}, so the answer is {{11/12}}. Also, {{3/7}} is smaller than {{2/3}} on its own, so it can't be right.",
          },
        ],
        hints: [
          "Can you add thirds and quarters straight away, or do the pieces need to be the same size?",
          "3 and 4 both go into 12. Write each fraction as twelfths, then add the numerators.",
        ],
        solution: [
          "The denominators are different, so find a common denominator. The LCM of 3 and 4 is 12.",
          "{{2/3 = 8/12}} (multiply top and bottom by 4) and {{1/4 = 3/12}} (multiply top and bottom by 3).",
          "{{8/12 + 3/12 = 11/12}}. 11 and 12 have no common factor, so this is in its simplest form.",
          "(b) Arjun added the tops (2 + 1) and the bottoms (3 + 4). But the denominator is the size of the pieces — you can only add the numerators once the pieces are the same size.",
          "Sense check: {{3/7}} is less than {{2/3}} on its own, and adding {{1/4}} can't make the total smaller.",
        ],
        commonError: "Adding the numerators and adding the denominators: {{2/3 + 1/4 = 3/7}}.",
        strategy: "Find a common denominator",
      },
      {
        id: "fr-w1-q03",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "Work out each of these. Give each answer as a mixed number in its simplest form.",
        parts: [
          {
            label: "a",
            prompt: "{{4/5 + 2/3}}",
            marks: 2,
            answer: { type: "fraction", n: 22, d: 15, form: "mixed", simplest: true },
            verify: "4/5+2/3",
            traps: [
              { spec: { type: "fraction", n: 3, d: 4 }, feedback: "{{6/8}} comes from adding the tops (4 + 2) and the bottoms (5 + 3). Change both fractions to fifteenths first." },
            ],
          },
          {
            label: "b",
            prompt: "{{3 2/5 - 1 2/3}}",
            marks: 2,
            answer: { type: "fraction", n: 26, d: 15, form: "mixed", simplest: true },
            verify: "(3+2/5)-(1+2/3)",
            traps: [
              { spec: { type: "fraction", n: 34, d: 15 }, feedback: "{{2 4/15}} comes from working out {{2/3 - 2/5}} instead of {{2/5 - 2/3}}. Because {{2/5}} is smaller than {{2/3}}, you have to borrow a whole (or use improper fractions)." },
            ],
          },
        ],
        hints: [
          "What is the lowest common multiple of 5 and 3?",
          "In (b), change both mixed numbers to improper fractions first: {{3 2/5 = 17/5}}.",
          "Write both fractions as fifteenths, add or subtract the numerators, then change the answer back to a mixed number.",
        ],
        solution: [
          "(a) The LCM of 5 and 3 is 15. {{4/5 = 12/15}} and {{2/3 = 10/15}}.",
          "{{12/15 + 10/15 = 22/15}}. 15 goes into 22 once with 7 left over, so the answer is {{1 7/15}}.",
          "(b) Change to improper fractions: {{3 2/5 = 17/5}} and {{1 2/3 = 5/3}}.",
          "Use fifteenths: {{17/5 = 51/15}} and {{5/3 = 25/15}}.",
          "{{51/15 - 25/15 = 26/15 = 1 11/15}}.",
        ],
        altMethod: {
          label: "(b) Whole numbers and fractions separately",
          steps: [
            "{{3 2/5 = 3 6/15}} and {{1 2/3 = 1 10/15}}.",
            "You can't take {{10/15}} from {{6/15}}, so borrow 1 whole: {{3 6/15 = 2 21/15}}.",
            "{{2 21/15 - 1 10/15 = 1 11/15}}.",
          ],
        },
        commonError: "In (b), doing 3 − 1 = 2 and then {{2/3 - 2/5}} the wrong way round to get {{2 4/15}}. When the first fraction is smaller, borrow a whole.",
        strategy: "Find a common denominator",
        source: "Class worksheet",
      },
      {
        id: "fr-w1-q04",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "Multiplying and dividing with fractions. Show your working for each part.",
        parts: [
          {
            label: "a",
            prompt: "Work out {{3/8}} of 56 kg.",
            marks: 1,
            answer: { type: "number", value: 21, display: "21 kg" },
            verify: "3/8*56",
            traps: [
              { spec: { type: "number", value: 7 }, feedback: "7 kg is only {{1/8}} of 56 kg. You need 3 eighths: 7 × 3." },
              { spec: { type: "number", value: 168 }, feedback: "168 is 56 × 3 — you still need to divide by 8." },
            ],
          },
          {
            label: "b",
            prompt: "Work out {{5/6 * 9/10}}. Give your answer in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 3, d: 4, simplest: true },
            verify: "5/6*9/10",
            traps: [
              { spec: { type: "fraction", n: 25, d: 27 }, feedback: "You flipped the second fraction — only flip when you divide. To multiply, multiply the tops and multiply the bottoms." },
            ],
          },
          {
            label: "c",
            prompt: "Work out {{2 ÷ 3/7}}. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 14, d: 3, form: "mixed", simplest: true },
            verify: "2/(3/7)",
            traps: [
              { spec: { type: "fraction", n: 6, d: 7 }, feedback: "{{6/7}} is {{2 * 3/7}} — you multiplied without flipping. Keep, Change, Flip: {{2 * 7/3}}." },
              { spec: { type: "fraction", n: 3, d: 14 }, feedback: "You flipped the 2 instead of {{3/7}}. Keep the first number, change ÷ to ×, and flip the second: {{2 * 7/3}}." },
            ],
          },
        ],
        hints: [
          "(a) Find {{1/8}} of 56 kg first.",
          "(b) Cancel before you multiply: 5 and 10 share a factor, and so do 9 and 6.",
          "(c) Dividing by {{3/7}} is the same as multiplying by its reciprocal, {{7/3}}.",
        ],
        solution: [
          "(a) {{1/8}} of 56 kg = 56 ÷ 8 = 7 kg, so {{3/8}} of 56 kg = 7 × 3 = 21 kg.",
          "(b) Cancel first: 5 and 10 share 5 (leaving 1 and 2), and 9 and 6 share 3 (leaving 3 and 2).",
          "That leaves {{(1 * 3)/(2 * 2) = 3/4}}. (Or multiply first to get {{45/60}}, then divide the top and bottom by 15.)",
          "(c) Keep, Change, Flip: {{2 ÷ 3/7 = 2 * 7/3 = 14/3}}.",
          "{{14/3 = 4 2/3}}, because 3 goes into 14 four times with 2 left over.",
          "Sense check: {{3/7}} is a bit less than a half, and 4 halves fit into 2 — so a bit more than 4 makes sense.",
        ],
        commonError: "Forgetting to flip when dividing ({{2 * 3/7 = 6/7}}), or flipping when multiplying.",
        strategy: "Spot the common factor",
      },
      {
        id: "fr-w1-q05",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify each algebraic fraction fully by cancelling common factors. If the bottom of your answer has more than one factor, type it in brackets, e.g. 2/(5a).",
        parts: [
          {
            label: "a",
            prompt: "{{3xy/xz}}",
            marks: 1,
            answer: { type: "expression", expr: "3y/z", form: "simplified" },
            verify: "3xy/(xz)",
            traps: [
              { spec: { type: "expression", expr: "3y/(xz)" }, feedback: "When a letter cancels, it goes from the top AND the bottom. The x on top cancels with the x on the bottom." },
            ],
          },
          {
            label: "b",
            prompt: "{{42xyz/56}}",
            marks: 1,
            answer: { type: "expression", expr: "3xyz/4", form: "simplified" },
            verify: "42xyz/56",
            traps: [
              { spec: { type: "expression", expr: "6xyz/7" }, feedback: "You divided 42 by 7 but 56 by 8. Divide the top and the bottom by the SAME number — the HCF of 42 and 56 is 14." },
            ],
          },
          {
            label: "c",
            prompt: "{{17cf/(34c^2)}}",
            marks: 2,
            answer: { type: "expression", expr: "f/(2c)", form: "simplified" },
            verify: "17cf/(34c^2)",
            traps: [
              { spec: { type: "expression", expr: "f/2" }, feedback: "{{c^2}} means c × c. Only one c cancels with the c on top, so one c is left on the bottom." },
              { spec: { type: "expression", expr: "cf/2" }, feedback: "We read f/2c as {{f/2}} × c. If you mean f over 2c, type the bottom in brackets: f/(2c)." },
            ],
          },
        ],
        hints: [
          "Deal with the numbers and the letters separately. Which numbers share a factor? Which letters are on both the top and the bottom?",
          "42 and 56 are both in the 7 times table, and both are even. In (c), remember {{c^2 = c * c}}.",
        ],
        solution: [
          "(a) x is a factor of the top and of the bottom, so it cancels: {{3xy/xz = 3y/z}}.",
          "(b) The HCF of 42 and 56 is 14: 42 ÷ 14 = 3 and 56 ÷ 14 = 4. No letters cancel, so {{42xyz/56 = 3xyz/4}}.",
          "(c) Numbers: 17 ÷ 17 = 1 and 34 ÷ 17 = 2. Letters: {{c/c^2 = c/(c * c) = 1/c}}, and f stays on top.",
          "So {{17cf/(34c^2) = f/(2c)}}. Type it as f/(2c).",
        ],
        commonError: "Cancelling both c's in (c) to get {{f/2}} — {{c^2}} is c × c, so one c is left on the bottom.",
        strategy: "Spot the common factor",
        source: "Class example",
      },
      {
        id: "fr-w1-q06",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "Priya gets some birthday money. She spends {{1/4}} of it on a book. She then spends {{2/3}} of the money she has **left** on a concert ticket. She now has £12.",
        parts: [
          {
            label: "a",
            prompt: "What fraction of her **original** money did the concert ticket cost? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 1, d: 2, simplest: true },
            verify: "2/3*(1-1/4)",
            traps: [
              { spec: { type: "fraction", n: 2, d: 3 }, feedback: "{{2/3}} is the ticket as a fraction of what was LEFT after the book. As a fraction of her original money it's {{2/3}} of {{3/4}}." },
            ],
          },
          {
            label: "b",
            prompt: "What fraction of her original money does she have left? Give your answer in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 1, d: 4, simplest: true },
            verify: "1-1/4-2/3*(1-1/4)",
            traps: [
              { spec: { type: "fraction", n: 1, d: 12 }, feedback: "{{1 - 1/4 - 2/3 = 1/12}} treats the {{2/3}} as a fraction of ALL her money. It's {{2/3}} of the {{3/4}} that was left, which is {{1/2}} of the original." },
            ],
          },
          {
            label: "c",
            prompt: "How much birthday money did Priya start with? Give your answer in £.",
            marks: 2,
            answer: { type: "number", value: 48, display: "£48" },
            verify: "12/((1-2/3)*(1-1/4))",
            traps: [
              { spec: { type: "number", value: 144 }, feedback: "£144 comes from thinking £12 is {{1/12}} of her money. Look again at part (b): she has {{1/4}} left." },
              { spec: { type: "number", value: 3 }, feedback: "£3 is {{1/4}} of £12 — but £12 IS the quarter she has left. Work backwards: the whole amount is 4 × £12." },
            ],
          },
        ],
        hints: [
          "Draw a bar for all her money and split it into quarters. Shade the quarter spent on the book.",
          "The ticket is {{2/3}} of the 3 quarters that are left. How many quarters is that?",
          "£12 is what is left at the end. What fraction of the whole bar is it?",
        ],
        solution: [
          "After the book she has {{1 - 1/4 = 3/4}} of her money left.",
          "(a) The ticket costs {{2/3}} of that: {{2/3 * 3/4 = 6/12 = 1/2}} of her original money.",
          "(b) Fraction left: {{1 - 1/4 - 1/2 = 1/4}}. (Or: she keeps {{1/3}} of the {{3/4}}, and {{1/3 * 3/4 = 1/4}}.)",
          "(c) {{1/4}} of her money is £12, so all of it is 4 × £12 = £48.",
          "Check: the book costs £12, leaving £36. The ticket is {{2/3}} of £36 = £24, leaving £12 ✓",
        ],
        altMethod: {
          label: "Bar model",
          steps: [
            "Draw a bar in 4 equal parts. The book takes 1 part, leaving 3 parts.",
            "The ticket takes {{2/3}} of those 3 parts, which is 2 parts. That leaves 1 part.",
            "1 part = £12, so 4 parts = £48.",
          ],
        },
        commonError: "Taking {{2/3}} of the ORIGINAL money instead of {{2/3}} of what was left — that gives {{1/12}} left and £144.",
        strategy: "Use a bar model",
      },
    ],
  },

  // ─────────────── Set 2 · Core skills (warm-up 1 · core 4 · challenge 1) ───────────────
  {
    id: "fr-written-2",
    title: "Written 2 · Core skills",
    subtitle: "Ordering, mixed-number calculations, fractions of amounts, algebraic × and ÷, and the monkeys puzzle.",
    topic: "fr",
    questions: [
      {
        id: "fr-w2-q01",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "warmup",
        question: "Here are four fractions: {{5/8}}, {{3/5}}, {{7/10}}, {{13/20}}.",
        parts: [
          {
            label: "a",
            prompt: "Write the four fractions in order of size, starting with the smallest. Separate them with commas.",
            marks: 2,
            answer: { type: "list", values: [3 / 5, 5 / 8, 13 / 20, 7 / 10], ordered: true, display: "{{3/5}}, {{5/8}}, {{13/20}}, {{7/10}}" },
            verify: "24/40, 25/40, 26/40, 28/40",
            traps: [
              { spec: { type: "list", values: [7 / 10, 13 / 20, 5 / 8, 3 / 5], ordered: true }, feedback: "Right order, wrong way round — the question asks for the smallest first." },
              { spec: { type: "list", values: [3 / 5, 5 / 8, 7 / 10, 13 / 20], ordered: true }, feedback: "Check {{7/10}} and {{13/20}}: as fortieths they are {{28/40}} and {{26/40}}, so {{13/20}} is the smaller one." },
            ],
          },
          {
            label: "b",
            prompt: "Work out the difference between the largest and the smallest of the four fractions. Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 1, d: 10, simplest: true },
            verify: "7/10-3/5",
            traps: [
              { spec: { type: "fraction", n: 4, d: 5 }, feedback: "{{4/5}} comes from subtracting the tops (7 − 3) and the bottoms (10 − 5). Use a common denominator: {{3/5 = 6/10}}." },
            ],
          },
        ],
        hints: [
          "Find a number that 8, 5, 10 and 20 all divide into.",
          "40 works. Write each fraction as fortieths and compare the numerators.",
        ],
        solution: [
          "The LCM of 8, 5, 10 and 20 is 40.",
          "{{5/8 = 25/40}}, {{3/5 = 24/40}}, {{7/10 = 28/40}} and {{13/20 = 26/40}}.",
          "Order the numerators 24, 25, 26, 28: {{3/5}}, {{5/8}}, {{13/20}}, {{7/10}}.",
          "(b) Largest − smallest: {{7/10 - 3/5 = 7/10 - 6/10 = 1/10}}. (Or {{28/40 - 24/40 = 4/40 = 1/10}}.)",
        ],
        commonError: "Ordering by the size of the numerators or the denominators instead of rewriting every fraction with a common denominator.",
        strategy: "Find a common denominator",
      },
      {
        id: "fr-w2-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "Ravi has a {{7 1/4}} m length of ribbon. He cuts off {{1 2/3}} m to wrap a present and {{2 5/6}} m for a banner.",
        parts: [
          {
            label: "a",
            prompt: "How much ribbon has he cut off altogether? Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 9, d: 2, form: "mixed", simplest: true },
            verify: "(1+2/3)+(2+5/6)",
            traps: [
              { spec: { type: "fraction", n: 34, d: 9 }, feedback: "{{3 7/9}} comes from adding the tops (2 + 5) and the bottoms (3 + 6). Use sixths: {{2/3 = 4/6}}." },
            ],
          },
          {
            label: "b",
            prompt: "How much ribbon is left? Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 11, d: 4, form: "mixed", simplest: true },
            verify: "(7+1/4)-(1+2/3)-(2+5/6)",
            traps: [
              { spec: { type: "fraction", n: 13, d: 4 }, feedback: "{{3 1/4}} comes from doing {{1/2 - 1/4}} instead of {{1/4 - 1/2}}. {{1/4}} is smaller than {{1/2}}, so borrow a whole: {{7 1/4 = 6 5/4}}." },
            ],
          },
        ],
        hints: [
          "Add the two pieces first: the whole numbers, then the fractions using a common denominator.",
          "{{2/3 + 5/6 = 4/6 + 5/6}}. Is that more than a whole?",
          "For (b), take your answer to (a) away from {{7 1/4}}. You may need to borrow a whole.",
        ],
        solution: [
          "(a) Whole numbers: 1 + 2 = 3. Fractions: {{2/3 + 5/6 = 4/6 + 5/6 = 9/6 = 1 3/6 = 1 1/2}}.",
          "Total cut off: 3 + {{1 1/2}} = {{4 1/2}} m.",
          "(b) Ribbon left: {{7 1/4 - 4 1/2 = 7 1/4 - 4 2/4}}.",
          "{{1/4}} is smaller than {{2/4}}, so borrow a whole: {{7 1/4 = 6 5/4}}. Then {{6 5/4 - 4 2/4 = 2 3/4}} m.",
          "Check: {{4 1/2 + 2 3/4 = 7 1/4}} ✓",
        ],
        altMethod: {
          label: "Improper fractions",
          steps: [
            "(a) {{5/3 + 17/6 = 10/6 + 17/6 = 27/6 = 9/2 = 4 1/2}}.",
            "(b) {{29/4 - 9/2 = 29/4 - 18/4 = 11/4 = 2 3/4}}.",
          ],
        },
        commonError: "Subtracting the fractions the wrong way round in (b) ({{1/2 - 1/4}}) instead of borrowing a whole, which gives {{3 1/4}}.",
        strategy: "Find a common denominator",
      },
      {
        id: "fr-w2-q03",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "Work out each of these. Give each answer in its simplest form, as a mixed number if it is more than 1.",
        parts: [
          {
            label: "a",
            prompt: "{{1 1/5 * 2 1/3}}",
            marks: 2,
            answer: { type: "fraction", n: 14, d: 5, form: "mixed", simplest: true },
            verify: "(1+1/5)*(2+1/3)",
            traps: [
              { spec: { type: "fraction", n: 31, d: 15 }, feedback: "{{2 1/15}} comes from multiplying the whole numbers (1 × 2) and the fractions ({{1/5 * 1/3}}) separately. Change both to improper fractions first." },
            ],
          },
          {
            label: "b",
            prompt: "{{2 1/4 ÷ 3 1/2}}",
            marks: 2,
            answer: { type: "fraction", n: 9, d: 14, simplest: true },
            verify: "(2+1/4)/(3+1/2)",
            traps: [
              { spec: { type: "fraction", n: 63, d: 8 }, feedback: "{{63/8}} comes from multiplying {{9/4 * 7/2}} without flipping. Keep, Change, Flip: {{9/4 * 2/7}}." },
            ],
          },
          {
            label: "c",
            prompt: "Without doing the calculation, explain how you can tell that the answer to part (b) must be less than 1.",
            marks: 2,
            markScheme: [
              {
                point: "{{2 1/4}} is smaller than {{3 1/2}} — you are dividing by a bigger number.",
                keywords: ["smaller", "larger", "less than 3", "bigger than 2", "greater than 2", "more than 2", "dividing by a bigger", "divide by a bigger"],
                feedback: "Compare the two numbers first: {{2 1/4}} is smaller than {{3 1/2}}.",
              },
              {
                point: "So {{3 1/2}} doesn't fit into {{2 1/4}} even once.",
                keywords: ["once", "fit", "goes into", "go into", "not even one", "not even 1", "less than one whole"],
                feedback: "Division asks how many lots of {{3 1/2}} fit into {{2 1/4}}. It doesn't fit even once, so the answer is less than 1.",
              },
            ],
            model: "{{2 1/4}} is smaller than {{3 1/2}}. Dividing asks how many lots of {{3 1/2}} fit into {{2 1/4}}. Because {{3 1/2}} is bigger, it doesn't fit in even once, so the answer must be less than 1.",
          },
        ],
        hints: [
          "Change each mixed number into an improper fraction first.",
          "For (a), multiply the tops and the bottoms (cancel first if you can). For (b), Keep the first fraction, Change ÷ to ×, Flip the second.",
          "For (c), think about what dividing means: how many lots of {{3 1/2}} fit into {{2 1/4}}?",
        ],
        solution: [
          "(a) {{1 1/5 = 6/5}} and {{2 1/3 = 7/3}}.",
          "Cancel the 3 into the 6 first: {{6/5 * 7/3 = (2 * 7)/(5 * 1) = 14/5}}.",
          "{{14/5 = 2 4/5}} (5 goes into 14 twice, remainder 4).",
          "(b) {{2 1/4 = 9/4}} and {{3 1/2 = 7/2}}. Keep, Change, Flip: {{9/4 * 2/7 = 18/28 = 9/14}}.",
          "(c) {{2 1/4}} is smaller than {{3 1/2}}, so {{3 1/2}} doesn't fit into {{2 1/4}} even once — the answer must be less than 1. ✓ {{9/14}} is less than 1.",
        ],
        commonError: "Multiplying the whole numbers and the fractions separately in (a), which gives {{2 1/15}} instead of {{2 4/5}}.",
        strategy: "Estimate first",
        source: "Class worksheet",
      },
      {
        id: "fr-w2-q04",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "core",
        question: "In a survey, {{3/8}} of the students in Year 8 said they walk to school. 45 students walk to school.",
        parts: [
          {
            label: "a",
            prompt: "How many students are in Year 8?",
            marks: 2,
            answer: { type: "number", value: 120 },
            verify: "45/3*8",
            traps: [
              { spec: { type: "number", value: 360 }, feedback: "360 = 45 × 8 treats 45 as one eighth. But 45 is three eighths, so one eighth is 45 ÷ 3 = 15." },
              { spec: { type: "number", value: 15 }, feedback: "15 is one eighth of Year 8. The whole year group is all 8 eighths." },
            ],
          },
          {
            label: "b",
            prompt: "{{2/5}} of the students who do **not** walk come by bus. How many students come by bus?",
            marks: 2,
            answer: { type: "number", value: 30 },
            verify: "2/5*(45/3*8-45)",
            traps: [
              { spec: { type: "number", value: 48 }, feedback: "48 is {{2/5}} of all 120 students. The {{2/5}} is only of the students who don't walk: 120 − 45 = 75." },
            ],
          },
          {
            label: "c",
            prompt: "What fraction of all the Year 8 students come by bus? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 1, d: 4, simplest: true },
            verify: "2/5*(1-3/8)",
            traps: [
              { spec: { type: "fraction", n: 2, d: 5 }, feedback: "{{2/5}} is a fraction of the students who don't walk. As a fraction of everyone, it's 30 out of 120." },
            ],
          },
        ],
        hints: [
          "45 students are 3 of the 8 equal parts. How many students are in one part?",
          "Find how many students don't walk before you find {{2/5}} of them.",
          "For (c), write the bus students as a fraction of the whole year group, then simplify.",
        ],
        solution: [
          "(a) {{3/8}} of Year 8 is 45, so {{1/8}} is 45 ÷ 3 = 15, and the whole year is 15 × 8 = 120 students.",
          "(b) Students who don't walk: 120 − 45 = 75. {{2/5}} of 75 = 75 ÷ 5 × 2 = 30 students.",
          "(c) {{30/120 = 1/4}}.",
          "Check another way: {{5/8}} of the year don't walk, and {{2/5 * 5/8 = 10/40 = 1/4}} ✓",
        ],
        altMethod: {
          label: "Bar model",
          steps: [
            "Draw a bar in 8 equal parts. 3 parts (the walkers) = 45, so 1 part = 15 and 8 parts = 120.",
            "The other 5 parts (75 students) don't walk. Split those 5 parts into fifths: each fifth is 1 part = 15.",
            "{{2/5}} of them is 2 parts = 30 students, and 2 parts out of 8 is {{2/8 = 1/4}} of the year.",
          ],
        },
        commonError: "Multiplying 45 by 8 in (a) — 45 is three eighths, not one eighth, so divide by 3 first.",
        strategy: "Use a bar model",
      },
      {
        id: "fr-w2-q05",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify each expression fully. If the bottom of your answer has more than one factor, type it in brackets, e.g. 3/(4x).",
        parts: [
          {
            label: "a",
            prompt: "{{12ab/(18b)}}",
            marks: 1,
            answer: { type: "expression", expr: "2a/3", form: "simplified" },
            verify: "12ab/(18b)",
            traps: [
              { spec: { type: "expression", expr: "3a/2" }, feedback: "The numbers are upside down: 12 is on the top, so {{12/18 = 2/3}}." },
            ],
          },
          {
            label: "b",
            prompt: "{{3x/5 * 10/(9x)}}",
            marks: 2,
            answer: { type: "expression", expr: "2/3", form: "simplified" },
            verify: "(3x/5)*(10/(9x))",
            traps: [
              { spec: { type: "expression", expr: "27x^2/50" }, feedback: "You flipped the second fraction — only flip when you divide. Multiply the tops and the bottoms, then cancel the x's." },
            ],
          },
          {
            label: "c",
            prompt: "{{2a/5 ÷ a/10}}",
            marks: 2,
            answer: { type: "expression", expr: "4", form: "simplified" },
            verify: "(2a/5)/(a/10)",
            traps: [
              { spec: { type: "expression", expr: "a^2/25" }, feedback: "You multiplied without flipping. Keep, Change, Flip: {{2a/5 * 10/a}}." },
              { spec: { type: "expression", expr: "1/4" }, feedback: "You flipped the first fraction instead of the second. Keep {{2a/5}}, change ÷ to ×, and flip {{a/10}} to {{10/a}}." },
            ],
          },
        ],
        hints: [
          "Deal with the numbers and the letters separately. What cancels?",
          "To multiply, multiply the tops and the bottoms, then cancel. To divide, flip the SECOND fraction and multiply.",
        ],
        solution: [
          "(a) 12 and 18 share 6: 12 ÷ 6 = 2 and 18 ÷ 6 = 3. The b cancels. {{12ab/(18b) = 2a/3}}.",
          "(b) Tops: 3x × 10 = 30x. Bottoms: 5 × 9x = 45x. In {{30x/(45x)}} the x cancels, and {{30/45 = 2/3}}.",
          "(c) Keep, Change, Flip: {{2a/5 ÷ a/10 = 2a/5 * 10/a = 20a/(5a)}}.",
          "The a cancels and 20 ÷ 5 = 4. So the answer is just 4.",
        ],
        commonError: "Forgetting to flip the second fraction when dividing — {{2a/5 * a/10 = a^2/25}} is a multiplication, not a division.",
        strategy: "Spot the common factor",
      },
      {
        id: "fr-w2-q06",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "My four pet monkeys and I harvested a large pile of peanuts. In the night, Monkey A woke and ate half of them. Then Monkey B woke and ate one third of what remained. Then Monkey C woke and ate one quarter of the rest. Finally, Monkey D ate one fifth of the much diminished pile.",
        parts: [
          {
            label: "a",
            prompt: "What fraction of the original harvest was left in the morning? Give your answer in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 1, d: 5, simplest: true },
            verify: "(1-1/2)*(1-1/3)*(1-1/4)*(1-1/5)",
            traps: [
              { spec: { type: "fraction", n: 1, d: 120 }, feedback: "{{1/120}} is {{1/2 * 1/3 * 1/4 * 1/5}} — you multiplied the fractions that were EATEN. Multiply the fractions that are LEFT each time: {{1/2}}, {{2/3}}, {{3/4}}, {{4/5}}." },
            ],
          },
          {
            label: "b",
            prompt: "In the morning there were 36 peanuts left. How many peanuts were in the original pile?",
            marks: 1,
            answer: { type: "number", value: 180 },
            verify: "36/((1-1/2)*(1-1/3)*(1-1/4)*(1-1/5))",
            traps: [
              { spec: { type: "number", value: 7.2 }, feedback: "7.2 is {{1/5}} of 36 — but 36 IS the {{1/5}} that's left. Work backwards: 36 × 5." },
            ],
          },
          {
            label: "c",
            prompt: "How many peanuts did Monkey C eat?",
            marks: 1,
            answer: { type: "number", value: 15 },
            verify: "1/4*36/((1-1/4)*(1-1/5))",
            traps: [
              { spec: { type: "number", value: 45 }, feedback: "45 is {{1/4}} of the ORIGINAL pile. Monkey C ate {{1/4}} of what was left after Monkeys A and B." },
            ],
          },
          {
            label: "d",
            prompt: "More monkeys arrive and the pattern continues: Monkey E eats {{1/6}} of what is left, Monkey F eats {{1/7}} of what is then left, and so on, until the ninth monkey eats {{1/10}} of what is left. What fraction of the original harvest is left now?",
            marks: 2,
            answer: { type: "fraction", n: 1, d: 10, simplest: true },
            verify: "(1/2)*(2/3)*(3/4)*(4/5)*(5/6)*(6/7)*(7/8)*(8/9)*(9/10)",
            traps: [
              { spec: { type: "fraction", n: 1, d: 9 }, feedback: "Write out the fractions LEFT each time: {{1/2}}, {{2/3}}, … up to {{9/10}}. Each bottom cancels with the next top, leaving the first top (1) over the last bottom (10)." },
            ],
          },
        ],
        hints: [
          "After Monkey A, what fraction of the pile is left? After Monkey B, what fraction of THAT is left?",
          "Left each time: {{1/2}} of the pile, then {{2/3}} of that, then {{3/4}} of that, then {{4/5}} of that. Multiply them.",
          "Look at the product: each denominator cancels with the next numerator.",
        ],
        solution: [
          "Monkey A eats {{1/2}}, leaving {{1/2}} of the pile.",
          "Monkey B eats {{1/3}} of that, leaving {{2/3}} of it: {{1/2 * 2/3 = 1/3}} of the pile.",
          "Monkey C leaves {{3/4}} of that: {{1/3 * 3/4 = 1/4}}. Monkey D leaves {{4/5}} of that: {{1/4 * 4/5 = 1/5}}.",
          "(a) So {{1/2 * 2/3 * 3/4 * 4/5 = 1/5}} of the harvest is left.",
          "(b) {{1/5}} of the pile is 36, so the pile was 36 × 5 = 180 peanuts.",
          "(c) After A and B, {{1/3}} of 180 = 60 peanuts were left. Monkey C ate {{1/4}} of 60 = 15.",
          "(d) {{1/2 * 2/3 * 3/4 * … * 9/10}}: every denominator cancels with the next numerator, leaving {{1/10}}.",
        ],
        altMethod: {
          label: "Follow the peanuts",
          steps: [
            "Start with 180. A eats 90, leaving 90.",
            "B eats {{1/3}} of 90 = 30, leaving 60. C eats {{1/4}} of 60 = 15, leaving 45.",
            "D eats {{1/5}} of 45 = 9, leaving 36 ✓ — and 36 is {{1/5}} of 180.",
          ],
        },
        commonError: "Multiplying (or adding) the fractions EATEN instead of multiplying the fractions LEFT each time.",
        strategy: "Find a pattern",
        source: "Class worksheet",
      },
    ],
  },
];
