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
                keywords: ["common denominator", "same denominator", "denominator+same", "11/12", "8/12", "twelfths", "lcm", "same size"],
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
                keywords: ["once", "fit", "goes into", "cant fit", "doesnt fit", "cant go", "doesnt go", "not even"],
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
            prompt: "More monkeys arrive and the pattern continues: Monkey E eats {{1/6}} of what is left, Monkey F eats {{1/7}} of what is then left, and so on, until the ninth monkey eats {{1/10}} of what is left. What fraction of the original harvest is left now? Give your answer in its simplest form.",
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

  // ─────────────── Set 3 · Exam practice (warm-up 1 · core 3 · challenge 2) ───────────────
  {
    id: "fr-written-3",
    title: "Written 3 · Exam practice",
    subtitle: "Test-style multi-part questions: walking distances, the badminton club, sharing lassi, shaded shapes and algebraic fractions.",
    topic: "fr",
    questions: [
      {
        id: "fr-w3-q01",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "warmup",
        question: "Equivalent fractions: answer each part.",
        parts: [
          {
            label: "a",
            prompt: "Find the missing number: {{5/6 = □/42}}.",
            marks: 1,
            answer: { type: "number", value: 35 },
            verify: "5*42/6",
            traps: [
              { spec: { type: "number", value: 41 }, feedback: "41 comes from adding 36 to the top because 36 was added to the bottom. Equivalent fractions MULTIPLY the top and bottom by the same number: 6 × 7 = 42, so 5 × 7." },
            ],
          },
          {
            label: "b",
            prompt: "Which is bigger, {{7/9}} or {{4/5}}? Type the bigger fraction.",
            marks: 1,
            answer: { type: "fraction", n: 4, d: 5 },
            verify: "36/45",
            traps: [
              { spec: { type: "fraction", n: 7, d: 9 }, feedback: "Write both with denominator 45: {{7/9 = 35/45}} and {{4/5 = 36/45}}. So {{4/5}} is bigger — just!" },
            ],
          },
          {
            label: "c",
            prompt: "Write {{48/180}} in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 4, d: 15, simplest: true },
            verify: "48/180",
          },
        ],
        hints: [
          "(a) What do you multiply 6 by to get 42?",
          "(b) Use 45 as a common denominator. (c) Keep dividing the top and bottom by common factors, or find the HCF of 48 and 180.",
        ],
        solution: [
          "(a) 6 × 7 = 42, so multiply the top by 7 too: 5 × 7 = 35. {{5/6 = 35/42}}.",
          "(b) The LCM of 9 and 5 is 45. {{7/9 = 35/45}} and {{4/5 = 36/45}}, so {{4/5}} is bigger, by {{1/45}}.",
          "(c) The HCF of 48 and 180 is 12: 48 ÷ 12 = 4 and 180 ÷ 12 = 15. So {{48/180 = 4/15}}.",
          "In steps: ÷ 2 gives {{24/90}}, ÷ 2 gives {{12/45}}, ÷ 3 gives {{4/15}}.",
        ],
        commonError: "Adding the same number to the top and the bottom instead of multiplying — for example writing {{41/42}} in (a).",
        strategy: "Find a common denominator",
      },
      {
        id: "fr-w3-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "Hana walks {{4 1/6}} km on Saturday and {{2 3/4}} km on Sunday.",
        parts: [
          {
            label: "a",
            prompt: "How far does she walk altogether? Give your answer as a mixed number in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 83, d: 12, form: "mixed", simplest: true },
            verify: "(4+1/6)+(2+3/4)",
            traps: [
              { spec: { type: "fraction", n: 32, d: 5 }, feedback: "{{6 4/10}} comes from adding the tops and the bottoms of {{1/6}} and {{3/4}}. Use twelfths: {{2/12 + 9/12}}." },
            ],
          },
          {
            label: "b",
            prompt: "How much further does she walk on Saturday than on Sunday? Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 17, d: 12, form: "mixed", simplest: true },
            verify: "(4+1/6)-(2+3/4)",
            traps: [
              { spec: { type: "fraction", n: 31, d: 12 }, feedback: "{{2 7/12}} comes from working out {{3/4 - 1/6}} instead of {{1/6 - 3/4}}. {{2/12}} is less than {{9/12}}, so borrow a whole: {{4 2/12 = 3 14/12}}." },
            ],
          },
          {
            label: "c",
            prompt: "Hana's target for the weekend was 8 km. How much further would she have needed to walk to reach it? Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 13, d: 12, form: "mixed", simplest: true },
            verify: "8-(4+1/6)-(2+3/4)",
            traps: [
              { spec: { type: "fraction", n: 35, d: 12 }, feedback: "{{2 11/12}} comes from doing 8 − 6 = 2 and then keeping the {{11/12}}. You need to take the {{11/12}} away too: {{2 - 11/12 = 1 1/12}}." },
            ],
          },
        ],
        hints: [
          "Use twelfths: {{1/6 = 2/12}} and {{3/4 = 9/12}}.",
          "In (b) you can't take {{9/12}} from {{2/12}} — borrow 1 whole as {{12/12}}.",
          "In (c), write 8 as 7 + {{12/12}}.",
        ],
        solution: [
          "Twelfths: {{1/6 = 2/12}} and {{3/4 = 9/12}}.",
          "(a) {{4 2/12 + 2 9/12 = 6 11/12}} km.",
          "(b) {{4 2/12 - 2 9/12}}: {{2/12}} is less than {{9/12}}, so borrow a whole: {{4 2/12 = 3 14/12}}. Then {{3 14/12 - 2 9/12 = 1 5/12}} km.",
          "(c) {{8 - 6 11/12}}: write 8 as {{7 12/12}}. Then {{7 12/12 - 6 11/12 = 1 1/12}} km.",
          "Check (c): {{6 11/12 + 1 1/12 = 7 12/12 = 8}} ✓",
        ],
        altMethod: {
          label: "Improper fractions",
          steps: [
            "{{4 1/6 = 50/12}} and {{2 3/4 = 33/12}}.",
            "(a) {{50/12 + 33/12 = 83/12 = 6 11/12}}. (b) {{50/12 - 33/12 = 17/12 = 1 5/12}}.",
            "(c) 8 = {{96/12}}, so {{96/12 - 83/12 = 13/12 = 1 1/12}}.",
          ],
        },
        commonError: "Taking the smaller fraction from the bigger one instead of borrowing a whole — for example {{2 7/12}} in (b).",
        strategy: "Find a common denominator",
      },
      {
        id: "fr-w3-q03",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify each expression fully. If the bottom of your answer has more than one factor, type it in brackets, e.g. 7/(2y).",
        parts: [
          {
            label: "a",
            prompt: "{{(15m^2n)/(25mn^2)}}",
            marks: 1,
            answer: { type: "expression", expr: "3m/(5n)", form: "simplified" },
            verify: "15m^2n/(25mn^2)",
            traps: [
              { spec: { type: "expression", expr: "3m/5" }, feedback: "{{n^2}} is n × n. Only one n cancels with the n on top, so one n is left on the bottom." },
              { spec: { type: "expression", expr: "3mn/5" }, feedback: "We read 3m/5n as {{3m/5}} × n. If you mean 3m over 5n, type the bottom in brackets: 3m/(5n)." },
            ],
          },
          {
            label: "b",
            prompt: "{{4a/(3b) * 9b^2/(2a^2)}}",
            marks: 2,
            answer: { type: "expression", expr: "6b/a", form: "simplified" },
            verify: "(4a/(3b))*(9b^2/(2a^2))",
            traps: [
              { spec: { type: "expression", expr: "6a/b" }, feedback: "Check where each leftover letter goes: {{b^2/b}} leaves b on the TOP, and {{a/a^2}} leaves a on the BOTTOM." },
            ],
          },
          {
            label: "c",
            prompt: "{{8x/y ÷ 2x^2/y}}",
            marks: 2,
            answer: { type: "expression", expr: "4/x", form: "simplified" },
            verify: "(8x/y)/(2x^2/y)",
            traps: [
              { spec: { type: "expression", expr: "16x^3/y^2" }, feedback: "You multiplied without flipping. Keep, Change, Flip: {{8x/y * y/(2x^2)}}." },
              { spec: { type: "expression", expr: "4x" }, feedback: "After cancelling, the leftover x is on the BOTTOM: {{8xy/(2x^2y) = 4/x}}." },
            ],
          },
        ],
        hints: [
          "Numbers first: what's the HCF? Then letters: which cancel, and where does any leftover letter end up?",
          "For (b), multiply the tops and the bottoms, then cancel. For (c), flip the second fraction and multiply.",
        ],
        solution: [
          "(a) Numbers: {{15/25 = 3/5}}. m's: {{m^2/m = m}} (stays on top). n's: {{n/n^2 = 1/n}} (one n stays on the bottom). So {{(15m^2n)/(25mn^2) = 3m/(5n)}}.",
          "(b) Tops: 4a × {{9b^2}} = {{36ab^2}}. Bottoms: 3b × {{2a^2}} = {{6a^2b}}.",
          "In {{36ab^2/(6a^2b)}}: 36 ÷ 6 = 6, one a cancels and leaves a on the bottom, one b cancels and leaves b on top. Answer: {{6b/a}}.",
          "(c) Keep, Change, Flip: {{8x/y * y/(2x^2) = 8xy/(2x^2y)}}.",
          "The y cancels, 8 ÷ 2 = 4, and {{x/x^2 = 1/x}}. Answer: {{4/x}}.",
        ],
        commonError: "Cancelling a power completely — thinking {{n/n^2}} cancels to nothing — instead of leaving one letter on the bottom.",
        strategy: "Spot the common factor",
      },
      {
        id: "fr-w3-q04",
        topic: "fr",
        section: "fr-problems",
        difficulty: "core",
        question: "{{7/12}} of the members of a badminton club are women. {{3/8}} of the members wear glasses.",
        parts: [
          {
            label: "a",
            prompt: "Work out the smallest possible number of members of the badminton club.",
            marks: 2,
            answer: { type: "number", value: 24 },
            verify: "12*8/4",
            traps: [
              { spec: { type: "number", value: 96 }, feedback: "96 = 12 × 8 works, but it isn't the smallest. Look for the LOWEST common multiple of 12 and 8." },
              { spec: { type: "number", value: 20 }, feedback: "20 = 12 + 8, but {{7/12}} of 20 isn't a whole number. You need a number that both 12 and 8 divide into." },
            ],
          },
          {
            label: "b",
            prompt: "The club actually has 72 members. How many of the members are men?",
            marks: 2,
            answer: { type: "number", value: 30 },
            verify: "72-7/12*72",
            traps: [
              { spec: { type: "number", value: 42 }, feedback: "42 is the number of women ({{7/12}} of 72). The men are the rest: 72 − 42." },
            ],
          },
          {
            label: "c",
            prompt: "Explain why the club cannot have 60 members.",
            marks: 2,
            markScheme: [
              {
                point: "Works out that {{3/8}} of 60 is 22.5, which is not a whole number of people.",
                keywords: ["22.5", "not a whole", "isnt a whole", "not whole", "half a person", "cant have half", "decimal", "half"],
                feedback: "Test it: {{3/8}} of 60 = 60 ÷ 8 × 3 = 22.5 — you can't have half a person wearing glasses.",
              },
              {
                point: "States the number of members must be a multiple of 8 (and of 12), and 60 is not a multiple of 8.",
                keywords: ["multiple of 8", "not a multiple", "isnt a multiple", "divisible by 8", "8 times table", "60 divided by 8", "multiple of 24", "lcm"],
                feedback: "Give the general reason: the number of members must divide exactly by 8 (and by 12), and 60 ÷ 8 is not a whole number.",
              },
            ],
            model: "{{3/8}} of 60 is 60 ÷ 8 × 3 = 22.5, which is not a whole number — you can't have half a person wearing glasses. The number of members has to be a multiple of 8 (and of 12, so a multiple of 24), and 60 is not a multiple of 8.",
          },
        ],
        hints: [
          "The number of members must divide exactly by 12 (to find {{7/12}}) and by 8 (to find {{3/8}}).",
          "List the multiples of 12: 12, 24, 36, … Which is the first one that 8 also divides into?",
          "For (b), the men are the members who are not women: {{1 - 7/12 = 5/12}} of the club.",
        ],
        solution: [
          "(a) {{7/12}} of the members must be a whole number, so the total is a multiple of 12. {{3/8}} of the members must be a whole number too, so the total is a multiple of 8.",
          "Multiples of 12: 12, 24, … 24 is also a multiple of 8. The LCM of 12 and 8 is 24, so the smallest possible number of members is 24.",
          "(b) Women: {{7/12}} of 72 = 72 ÷ 12 × 7 = 42. Men: 72 − 42 = 30. (Or {{5/12}} of 72 = 30.)",
          "(c) {{3/8}} of 60 = 60 ÷ 8 × 3 = 22.5, which isn't a whole number of people. The total must be a multiple of 8 (and of 12), and 60 isn't a multiple of 8.",
        ],
        commonError: "Multiplying 12 × 8 = 96 in (a) — that's a common multiple, but not the LOWEST common multiple.",
        strategy: "Try small cases",
        source: "Class worksheet",
      },
      {
        id: "fr-w3-q05",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "challenge",
        question: "A café has {{10 1/2}} litres of mango lassi. It pours the lassi into glasses that each hold {{2/3}} of a litre.",
        parts: [
          {
            label: "a",
            prompt: "Work out {{10 1/2 ÷ 2/3}}. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 63, d: 4, form: "mixed", simplest: true },
            verify: "(10+1/2)/(2/3)",
            traps: [
              { spec: { type: "fraction", n: 7, d: 1 }, feedback: "7 comes from multiplying by {{2/3}} instead of dividing. Keep, Change, Flip: {{21/2 * 3/2}}." },
            ],
          },
          {
            label: "b",
            prompt: "How many glasses can the café fill completely?",
            marks: 1,
            answer: { type: "number", value: 15 },
            verify: "10/(2/3)",
            traps: [
              { spec: { type: "number", value: 16 }, feedback: "The 16th glass would only be {{3/4}} full, so it isn't filled completely. Round DOWN: 15 glasses." },
            ],
          },
          {
            label: "c",
            prompt: "How much lassi is left over? Give your answer in litres, as a fraction in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 1, d: 2, simplest: true },
            verify: "(10+1/2)-15*(2/3)",
            traps: [
              { spec: { type: "fraction", n: 3, d: 4 }, feedback: "{{3/4}} is what's left as a fraction of a GLASS. One glass holds {{2/3}} of a litre, so {{3/4}} of a glass is {{3/4 * 2/3}} of a litre." },
            ],
          },
        ],
        hints: [
          "Write {{10 1/2}} as an improper fraction, then Keep, Change, Flip.",
          "Your answer to (a) is a mixed number. What does its whole-number part tell you about full glasses?",
          "For (c), work out how many litres the full glasses use altogether (number of full glasses × {{2/3}}), then take that away from {{10 1/2}} litres.",
        ],
        solution: [
          "(a) {{10 1/2 = 21/2}}, so {{21/2 ÷ 2/3 = 21/2 * 3/2 = 63/4 = 15 3/4}}.",
          "(b) {{15 3/4}} glasses' worth means 15 full glasses and a 16th glass that is only {{3/4}} full. So 15 glasses are filled completely.",
          "(c) 15 glasses use 15 × {{2/3}} = 10 litres, so {{10 1/2 - 10 = 1/2}} litre is left over.",
          "Check: the leftover is {{3/4}} of a glass, and {{3/4 * 2/3 = 1/2}} of a litre ✓",
        ],
        commonError: "Answering {{3/4}} of a litre in (c) — the {{3/4}} in {{15 3/4}} counts GLASSES, not litres.",
        strategy: "Draw a diagram",
      },
      {
        id: "fr-w3-q06",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "Here are three identical rectangles, A, B and C. The same two dashed lines are drawn across all three.\n\n- {{4/7}} of A is shaded: everything **below the upper** dashed line.\n- {{3/5}} of C is shaded: everything **above the lower** dashed line.\n- In B, only the band **between** the two dashed lines is shaded.",
        diagram: `<svg viewBox="0 0 440 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three identical tall rectangles labelled A, B and C, with two dashed lines drawn across all three. In A everything below the upper dashed line is shaded. In C everything above the lower dashed line is shaded. In B only the band between the two dashed lines is shaded.">
<rect x="0" y="0" width="440" height="210" fill="#ffffff"/>
<rect x="40" y="90" width="80" height="80" fill="#c7d2fe"/>
<rect x="180" y="90" width="80" height="24" fill="#c7d2fe"/>
<rect x="320" y="30" width="80" height="84" fill="#c7d2fe"/>
<line x1="25" y1="90" x2="415" y2="90" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 4"/>
<line x1="25" y1="114" x2="415" y2="114" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 4"/>
<rect x="40" y="30" width="80" height="140" fill="none" stroke="#1f2937" stroke-width="2"/>
<rect x="180" y="30" width="80" height="140" fill="none" stroke="#1f2937" stroke-width="2"/>
<rect x="320" y="30" width="80" height="140" fill="none" stroke="#1f2937" stroke-width="2"/>
<text x="80" y="196" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#1f2937">A</text>
<text x="220" y="196" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#1f2937">B</text>
<text x="360" y="196" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#1f2937">C</text>
</svg>`,
        parts: [
          {
            label: "a",
            prompt: "What fraction of rectangle C is **not** shaded? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 2, d: 5, simplest: true },
            verify: "1-3/5",
            traps: [
              { spec: { type: "fraction", n: 3, d: 5 }, feedback: "{{3/5}} is the shaded part of C. The part that is NOT shaded is {{1 - 3/5}}." },
            ],
          },
          {
            label: "b",
            prompt: "What fraction of rectangle B is shaded? Give your answer in its simplest form.",
            marks: 3,
            answer: { type: "fraction", n: 6, d: 35, simplest: true },
            verify: "4/7+3/5-1",
            traps: [
              { spec: { type: "fraction", n: 41, d: 35 }, feedback: "{{41/35}} = {{4/7 + 3/5}} is more than a whole rectangle, so it can't be the band. Subtract the whole rectangle (1) to leave the overlap." },
              { spec: { type: "fraction", n: 1, d: 35 }, feedback: "{{1/35}} is the gap between {{3/5}} and {{4/7}}. But C is shaded from the TOP, so the lower line is only {{2/5}} of the way up. Compare {{4/7}} with {{2/5}}." },
            ],
          },
          {
            label: "c",
            prompt: "Mei says you can also get the answer to part (b) by working out {{4/7 + 3/5 - 1}}. Explain why Mei's method works.",
            marks: 2,
            markScheme: [
              {
                point: "{{4/7 + 3/5 = 41/35}}, which is more than 1 whole rectangle.",
                keywords: ["more than 1", "more than one", "bigger than 1", "bigger than one", "greater than 1", "1 6/35", "41/35", "over 1"],
                feedback: "Add them first: {{4/7 + 3/5 = 20/35 + 21/35 = 41/35}}, which is MORE than one whole rectangle.",
              },
              {
                point: "The shaded parts of A and C overlap — B's band is counted twice — so taking away 1 whole leaves just the band.",
                keywords: ["counted twice", "twice", "overlap", "double", "both", "two times"],
                feedback: "Explain the extra: if you put A's shading and C's shading on one rectangle they overlap, and the overlap (B's band) gets counted twice. Subtracting the 1 whole rectangle leaves just that overlap.",
              },
            ],
            model: "{{4/7 + 3/5 = 20/35 + 21/35 = 41/35}}, which is more than 1 whole rectangle. That's because A's shading and C's shading overlap: the band that is shaded in B is in both of them, so it gets counted twice. Taking away 1 whole rectangle leaves just the double-counted band, {{6/35}}.",
          },
        ],
        hints: [
          "Measure everything from the bottom. How far up is the upper dashed line? How far up is the lower one?",
          "The upper line is {{4/7}} of the way up, because A is shaded up to it. C is shaded from the TOP down to the lower line, so the part of C below that line is the part that is NOT shaded — your answer to part (a).",
          "The band in B is the difference between those two heights. Use 35ths.",
        ],
        solution: [
          "Measure heights from the bottom of each rectangle.",
          "(a) {{3/5}} of C is shaded from the top, so {{1 - 3/5 = 2/5}} is not shaded — the lower dashed line is {{2/5}} of the way up.",
          "The upper dashed line is {{4/7}} of the way up, because A is shaded from the bottom up to it.",
          "(b) The band in B goes from {{2/5}} up to {{4/7}}: {{4/7 - 2/5 = 20/35 - 14/35 = 6/35}}.",
          "(c) {{4/7 + 3/5 = 41/35}} is more than 1 whole. The two shaded parts overlap, and the overlap is exactly B's band, so it has been counted twice. Subtracting the whole rectangle leaves {{41/35 - 35/35 = 6/35}}.",
        ],
        commonError: "Working out {{4/7 - 3/5}} — forgetting that C is shaded from the TOP, so its line is {{2/5}} of the way up, not {{3/5}}.",
        strategy: "Draw a diagram",
        source: "Class worksheet",
      },
    ],
  },

  // ─────────────── Set 4 · Stretch & challenge (core 3 · challenge 3) ───────────────
  {
    id: "fr-written-4",
    title: "Written 4 · Stretch & challenge",
    subtitle: "Reasoning and puzzles: unit-fraction logic, a rectangle puzzle, brackets-first patterns, a fraction magic square and working backwards with algebraic fractions.",
    topic: "fr",
    questions: [
      {
        id: "fr-w4-q01",
        topic: "fr",
        section: "fr-equivalent",
        difficulty: "core",
        question: "Jun is comparing unit fractions — fractions with 1 as the numerator. He says: 'If a > b, then {{1/a > 1/b}}.'",
        parts: [
          {
            label: "a",
            prompt: "Write {{1/5}}, {{1/12}}, {{1/3}} and {{1/8}} in order of size, starting with the smallest. Separate them with commas.",
            marks: 2,
            answer: { type: "list", values: [1 / 12, 1 / 8, 1 / 5, 1 / 3], ordered: true, display: "{{1/12}}, {{1/8}}, {{1/5}}, {{1/3}}" },
            verify: "10/120, 15/120, 24/120, 40/120",
            traps: [
              { spec: { type: "list", values: [1 / 3, 1 / 5, 1 / 8, 1 / 12], ordered: true }, feedback: "That's largest first. For unit fractions, the BIGGER the denominator, the SMALLER the fraction — so {{1/12}} is the smallest." },
            ],
          },
          {
            label: "b",
            prompt: "Is Jun's statement true when a and b are positive whole numbers? Answer yes or no.",
            marks: 1,
            answer: { type: "text", accept: ["no", "false", "not true", "no it is not", "no its not", "no it isnt", "no it is false", "no, it is false", "no, it is not", "it is false", "no, false"] },
          },
          {
            label: "c",
            prompt: "Give a reason for your answer to part (b).",
            marks: 2,
            markScheme: [
              {
                point: "Gives a counter-example, e.g. a = 2 and b = 1: 2 > 1, but {{1/2}} is smaller than 1.",
                keywords: ["example", "counter", "2+1", "1/2", "half"],
                feedback: "Test it with numbers: a = 2 and b = 1 gives 2 > 1, but {{1/2}} is SMALLER than {{1/1}}, which is 1.",
              },
              {
                point: "Explains that dividing 1 by a bigger number gives a smaller answer (bigger denominator, smaller pieces), so {{1/a < 1/b}}.",
                keywords: ["smaller", "less", "bigger denominator", "more pieces", "split into more", "shared between more"],
                feedback: "Give the general reason: the bigger the denominator, the more pieces 1 is split into, so each piece is smaller. If a > b, then {{1/a < 1/b}}.",
              },
            ],
            model: "No. For example, take a = 2 and b = 1. Then a > b, but {{1/2}} is smaller than 1, so {{1/a}} is smaller than {{1/b}}. This always happens with positive numbers: the bigger the denominator, the more pieces 1 is split into, so each piece is smaller. So if a > b, then {{1/a < 1/b}}.",
          },
        ],
        hints: [
          "Would you rather have {{1/3}} of a pizza or {{1/12}} of the same pizza?",
          "Try numbers in Jun's statement: let a = 4 and b = 2. Is {{1/4}} bigger than {{1/2}}?",
        ],
        solution: [
          "(a) A unit fraction is 1 whole split into equal pieces. More pieces means smaller pieces, so the order is {{1/12}}, {{1/8}}, {{1/5}}, {{1/3}}.",
          "Check with a common denominator of 120: {{10/120}}, {{15/120}}, {{24/120}}, {{40/120}} ✓",
          "(b) No — Jun's statement is false for positive numbers.",
          "(c) Counter-example: a = 2 and b = 1. Then a > b, but {{1/a = 1/2}}, which is smaller than {{1/b = 1/1 = 1}}.",
          "In general, dividing 1 by a bigger number gives a smaller answer. So if a > b, then {{1/a < 1/b}} — the opposite of what Jun says.",
        ],
        commonError: "Thinking a bigger denominator makes a bigger fraction — it makes each piece smaller.",
        strategy: "Try small cases",
        source: "Class worksheet",
      },
      {
        id: "fr-w4-q02",
        topic: "fr",
        section: "fr-addsub",
        difficulty: "core",
        question: "A triangle has sides of length {{3 1/2}} cm, {{4 2/3}} cm and {{2 3/4}} cm.",
        parts: [
          {
            label: "a",
            prompt: "Work out the perimeter of the triangle. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 131, d: 12, form: "mixed", simplest: true },
            verify: "(3+1/2)+(4+2/3)+(2+3/4)",
            traps: [
              { spec: { type: "fraction", n: 29, d: 3 }, feedback: "{{9 6/9}} comes from adding the tops (1 + 2 + 3) and the bottoms (2 + 3 + 4). Change the fractions to twelfths first." },
            ],
          },
          {
            label: "b",
            prompt: "A rectangle has the same perimeter as the triangle. Its length is {{3 5/6}} cm. Work out its width. Give your answer as a mixed number in its simplest form.",
            marks: 3,
            answer: { type: "fraction", n: 13, d: 8, form: "mixed", simplest: true },
            verify: "((3+1/2)+(4+2/3)+(2+3/4))/2-(3+5/6)",
            traps: [
              { spec: { type: "fraction", n: 85, d: 12 }, feedback: "{{7 1/12}} is the perimeter minus ONE length. A rectangle has two lengths and two widths, so halve the perimeter first, then subtract the length." },
              { spec: { type: "fraction", n: 13, d: 4 }, feedback: "{{3 1/4}} is both widths together. Halve it to get one width." },
            ],
          },
        ],
        hints: [
          "Add the whole numbers first, then add the fractions using twelfths.",
          "Half the perimeter of a rectangle is one length + one width.",
          "To halve a mixed number, write it as an improper fraction first, then multiply by {{1/2}}.",
        ],
        solution: [
          "(a) Whole numbers: 3 + 4 + 2 = 9.",
          "Fractions: {{1/2 + 2/3 + 3/4 = 6/12 + 8/12 + 9/12 = 23/12 = 1 11/12}}.",
          "Perimeter = 9 + {{1 11/12}} = {{10 11/12}} cm.",
          "(b) Length + width = half the perimeter: {{10 11/12 ÷ 2 = 131/12 * 1/2 = 131/24 = 5 11/24}} cm.",
          "Width = {{5 11/24 - 3 5/6 = 5 11/24 - 3 20/24}}. Borrow a whole: {{4 35/24 - 3 20/24 = 1 15/24 = 1 5/8}} cm.",
          "Check: 2 × {{3 5/6}} + 2 × {{1 5/8}} = {{7 2/3 + 3 1/4 = 10 11/12}} ✓",
        ],
        altMethod: {
          label: "Take off both lengths first",
          steps: [
            "Two lengths: 2 × {{3 5/6}} = {{7 4/6 = 7 2/3}} cm.",
            "Two widths: {{10 11/12 - 7 2/3 = 10 11/12 - 7 8/12 = 3 3/12 = 3 1/4}} cm.",
            "One width: {{3 1/4 ÷ 2 = 13/4 * 1/2 = 13/8 = 1 5/8}} cm.",
          ],
        },
        commonError: "Subtracting only one length from the perimeter (giving {{7 1/12}}) — a rectangle has two lengths and two widths.",
        strategy: "Work backwards",
      },
      {
        id: "fr-w4-q03",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "core",
        question: "Simplify fully. If the bottom of your answer has more than one factor, type it in brackets, e.g. 5/(2a).",
        parts: [
          {
            label: "a",
            prompt: "{{5a/(6b) * 3b^2/(10a^2)}}",
            marks: 2,
            answer: { type: "expression", expr: "b/(4a)", form: "simplified" },
            verify: "(5a/(6b))*(3b^2/(10a^2))",
            traps: [
              { spec: { type: "expression", expr: "a/(4b)" }, feedback: "Check where each leftover letter goes: {{b^2/b}} leaves b on the TOP, and {{a/a^2}} leaves a on the BOTTOM." },
              { spec: { type: "expression", expr: "ab/4" }, feedback: "We read b/4a as {{b/4}} × a. If you mean b over 4a, type the bottom in brackets: b/(4a)." },
            ],
          },
          {
            label: "b",
            prompt: "{{6x^2/y ÷ 3x/(2y)}}",
            marks: 2,
            answer: { type: "expression", expr: "4x", form: "simplified" },
            verify: "(6x^2/y)/(3x/(2y))",
            traps: [
              { spec: { type: "expression", expr: "9x^3/y^2" }, feedback: "You multiplied without flipping. Keep, Change, Flip: {{6x^2/y * (2y)/(3x)}}." },
            ],
          },
          {
            label: "c",
            prompt: "Omar writes {{8a/(4a^2) = 2a}}. Explain the mistake Omar has made, and give the correct answer.",
            marks: 2,
            markScheme: [
              {
                point: "Explains that {{a^2}} = a × a, so only one a cancels and the other a is left on the bottom (the denominator), not the top.",
                keywords: ["denominator", "on the bottom", "underneath", "below", "a times a", "a x a", "only one a", "one a cancels"],
                feedback: "{{a^2}} means a × a. One a cancels with the a on top, but the other a stays on the bottom.",
              },
              {
                point: "Gives the correct answer {{2/a}}.",
                keywords: ["2/a", "2 over a", "2 divided by a"],
                feedback: "8 ÷ 4 = 2 goes on top and the leftover a goes underneath: {{8a/(4a^2) = 2/a}}.",
              },
            ],
            model: "Omar divided the numbers correctly (8 ÷ 4 = 2), but he put the leftover a on the top. {{a^2}} means a × a, so only one a cancels with the a on top, and the other a is left on the bottom, in the denominator. The correct answer is {{2/a}}.",
          },
        ],
        hints: [
          "Multiply the tops and the bottoms (flip the second fraction first if it's a division), then cancel numbers and letters.",
          "Where does a leftover letter end up? Compare its power on the top with its power on the bottom.",
        ],
        solution: [
          "(a) Tops: 5a × {{3b^2}} = {{15ab^2}}. Bottoms: 6b × {{10a^2}} = {{60a^2b}}.",
          "{{15/60 = 1/4}}; {{b^2/b = b}} (stays on top); {{a/a^2 = 1/a}} (one a stays on the bottom). Answer: {{b/(4a)}}.",
          "(b) Keep, Change, Flip: {{6x^2/y * (2y)/(3x) = (12x^2y)/(3xy)}}.",
          "12 ÷ 3 = 4, the y cancels, and {{x^2/x = x}}. Answer: 4x.",
          "(c) 8 ÷ 4 = 2 is right, but {{a/a^2 = a/(a * a) = 1/a}}: after one a cancels, the other a is left on the bottom. The correct answer is {{2/a}}, not 2a.",
        ],
        commonError: "Putting a leftover letter on the wrong side of the fraction — like Omar, who wrote 2a instead of {{2/a}}.",
        strategy: "Spot the common factor",
      },
      {
        id: "fr-w4-q04",
        topic: "fr",
        section: "fr-muldiv",
        difficulty: "challenge",
        question: "Brackets first! Look at this calculation: {{1/3 - (1/3 * 1/3) + (1/3 ÷ 1/3)}}.",
        parts: [
          {
            label: "a",
            prompt: "Work out {{1/3 - (1/3 * 1/3) + (1/3 ÷ 1/3)}}. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 11, d: 9, form: "mixed", simplest: true },
            verify: "1/3-(1/3*1/3)+(1/3)/(1/3)",
            traps: [
              { spec: { type: "fraction", n: 1, d: 3 }, feedback: "That's what you get if you work out {{1/3 ÷ 1/3}} as {{1/9}}. But {{1/3 ÷ 1/3 = 1}} — a third fits into a third exactly once." },
              { spec: { type: "fraction", n: 7, d: 6 }, feedback: "{{1/3 * 1/3}} is {{1/9}} (multiply the bottoms), not {{1/6}}." },
            ],
          },
          {
            label: "b",
            prompt: "Now work out {{1/4 - (1/4 * 1/4) + (1/4 ÷ 1/4)}}. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 19, d: 16, form: "mixed", simplest: true },
            verify: "1/4-(1/4*1/4)+(1/4)/(1/4)",
            traps: [
              { spec: { type: "fraction", n: 9, d: 8 }, feedback: "{{1/4 * 1/4}} is {{1/16}} (multiply the bottoms), not {{1/8}}." },
            ],
          },
          {
            label: "c",
            prompt: "The same pattern with {{1/n}} gives {{1/n - (1/n * 1/n) + (1/n ÷ 1/n) = 1 6/49}}. Find the whole number n.",
            marks: 2,
            answer: { type: "number", value: 7 },
            verify: "sqrt(49)",
            traps: [
              { spec: { type: "number", value: 49 }, feedback: "49 is n × n — it's the bottom of {{1/n * 1/n}}. What number times itself makes 49?" },
              { spec: { type: "number", value: 6 }, feedback: "Look back at (a) and (b): the denominator of the fraction part is n × n, and the numerator is one less than n. Here the denominator is 49." },
            ],
          },
        ],
        hints: [
          "Brackets first: work out {{1/3 * 1/3}} and {{1/3 ÷ 1/3}} before anything else.",
          "Any number (except 0) divided by itself is 1.",
          "Compare the fraction parts of your answers to (a) and (b). How are their denominators linked to 3 and 4? How are their numerators linked?",
        ],
        solution: [
          "(a) Brackets first: {{1/3 * 1/3 = 1/9}} and {{1/3 ÷ 1/3 = 1}}.",
          "So the calculation is {{1/3 - 1/9 + 1 = 3/9 - 1/9 + 1 = 2/9 + 1 = 1 2/9}}.",
          "(b) {{1/4 * 1/4 = 1/16}} and {{1/4 ÷ 1/4 = 1}}, so {{1/4 - 1/16 + 1 = 4/16 - 1/16 + 1 = 1 3/16}}.",
          "(c) The pattern is {{1/n - 1/n^2 + 1}}. With thirds the fraction part was {{2/9}}; with quarters it was {{3/16}}. The bottom is n × n and the top is n − 1.",
          "In {{6/49}}: 49 = 7 × 7 and 6 = 7 − 1, so n = 7.",
          "Check: {{1/7 - 1/49 + 1 = 7/49 - 1/49 + 1 = 1 6/49}} ✓",
        ],
        commonError: "Thinking {{1/3 ÷ 1/3}} is {{1/9}} — any number (except 0) divided by itself is 1.",
        strategy: "Find a pattern",
        source: "Class worksheet",
      },
      {
        id: "fr-w4-q05",
        topic: "fr",
        section: "fr-problems",
        difficulty: "challenge",
        question: "In a magic square, every row, every column and both diagonals add up to the same number, called the magic total. P, Q, R and S stand for the missing numbers in this fraction magic square.",
        diagram: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 3 by 3 fraction magic square. Top row: 1¼, 2½, P. Middle row: 1, 1½, Q. Bottom row: R, S, 1¾.">
<rect x="0" y="0" width="300" height="210" fill="#ffffff"/>
<rect x="190" y="15" width="80" height="60" fill="#fde68a"/>
<rect x="190" y="75" width="80" height="60" fill="#fde68a"/>
<rect x="30" y="135" width="80" height="60" fill="#fde68a"/>
<rect x="110" y="135" width="80" height="60" fill="#fde68a"/>
<rect x="30" y="15" width="240" height="180" fill="none" stroke="#1f2937" stroke-width="2"/>
<line x1="110" y1="15" x2="110" y2="195" stroke="#1f2937" stroke-width="1.5"/>
<line x1="190" y1="15" x2="190" y2="195" stroke="#1f2937" stroke-width="1.5"/>
<line x1="30" y1="75" x2="270" y2="75" stroke="#1f2937" stroke-width="1.5"/>
<line x1="30" y1="135" x2="270" y2="135" stroke="#1f2937" stroke-width="1.5"/>
<g font-family="sans-serif" font-size="14" text-anchor="middle" fill="#1f2937">
<text x="70" y="50">1¼</text>
<text x="150" y="50">2½</text>
<text x="230" y="50" font-weight="bold">P</text>
<text x="70" y="110">1</text>
<text x="150" y="110">1½</text>
<text x="230" y="110" font-weight="bold">Q</text>
<text x="70" y="170" font-weight="bold">R</text>
<text x="150" y="170" font-weight="bold">S</text>
<text x="230" y="170">1¾</text>
</g>
</svg>`,
        parts: [
          {
            label: "a",
            prompt: "Work out the magic total. Give your answer as a mixed number in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 9, d: 2, form: "mixed", simplest: true },
            verify: "(1+1/4)+(1+1/2)+(1+3/4)",
            traps: [
              { spec: { type: "fraction", n: 7, d: 2 }, feedback: "{{3 1/2}} comes from adding the tops and the bottoms of the fraction parts. Use quarters: {{1/4 + 2/4 + 3/4 = 6/4 = 1 1/2}}." },
            ],
          },
          {
            label: "b",
            prompt: "Find the value of P. Give your answer as a fraction in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 3, d: 4, simplest: true },
            verify: "(1+1/4)+(1+1/2)+(1+3/4)-(1+1/4)-(2+1/2)",
          },
          {
            label: "c",
            prompt: "Find the value of R. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 9, d: 4, form: "mixed", simplest: true },
            verify: "(1+1/4)+(1+1/2)+(1+3/4)-(1+1/4)-1",
          },
          {
            label: "d",
            prompt: "Without finding Q and S, work out the total of all nine numbers in the square. Give your answer as a mixed number in its simplest form.",
            marks: 2,
            answer: { type: "fraction", n: 27, d: 2, form: "mixed", simplest: true },
            verify: "3*((1+1/4)+(1+1/2)+(1+3/4))",
            traps: [
              { spec: { type: "fraction", n: 81, d: 2 }, feedback: "{{40 1/2}} is 9 × {{4 1/2}} — but {{4 1/2}} is the total of a whole ROW, not of one box. The nine boxes make three rows." },
            ],
          },
        ],
        hints: [
          "Which line of three numbers is already complete? Add it up.",
          "Each missing number = magic total − the other two numbers in its row, column or diagonal.",
          "The nine numbers make exactly three rows. What does each row add up to?",
        ],
        solution: [
          "(a) The diagonal from top-left to bottom-right is complete: {{1 1/4 + 1 1/2 + 1 3/4}}. Wholes: 3. Fractions: {{1/4 + 2/4 + 3/4 = 6/4 = 1 1/2}}. Magic total = {{4 1/2}}.",
          "(b) Top row: P = {{4 1/2 - 1 1/4 - 2 1/2 = 3/4}}.",
          "(c) Left column: R = {{4 1/2 - 1 1/4 - 1 = 2 1/4}}. Check with the other diagonal: {{3/4 + 1 1/2 + 2 1/4 = 4 1/2}} ✓",
          "(d) The nine numbers make three rows, and each row adds up to {{4 1/2}}: 3 × {{4 1/2}} = {{13 1/2}}.",
          "For checking, the full square is: top row {{1 1/4}}, {{2 1/2}}, {{3/4}}; middle row 1, {{1 1/2}}, 2; bottom row {{2 1/4}}, {{1/2}}, {{1 3/4}}.",
        ],
        commonError: "Multiplying the magic total by 9 in (d) — the magic total is already the sum of three boxes.",
        strategy: "Work backwards",
        source: "Class worksheet",
      },
      {
        id: "fr-w4-q06",
        topic: "fr",
        section: "fr-algebraic",
        difficulty: "challenge",
        question: "Algebraic fractions — working backwards. Give each answer in its simplest form. If the bottom of your answer has more than one factor, type it in brackets, e.g. 5/(3y).",
        parts: [
          {
            label: "a",
            prompt: "Find the missing expression: {{3a/(2b) * □ = 6a^2/b}}.",
            marks: 2,
            answer: { type: "expression", expr: "4a", form: "simplified" },
            verify: "(6a^2/b)/(3a/(2b))",
            traps: [
              { spec: { type: "expression", expr: "9a^3/b^2" }, feedback: "You multiplied the two fractions together. To find a missing factor, DIVIDE: {{6a^2/b ÷ 3a/(2b)}}." },
            ],
          },
          {
            label: "b",
            prompt: "A rectangle has length {{3x/4}} cm and area {{x^2/2}} cm². Find an expression for its width.",
            marks: 2,
            answer: { type: "expression", expr: "2x/3", form: "simplified" },
            verify: "(x^2/2)/(3x/4)",
            traps: [
              { spec: { type: "expression", expr: "3x^3/8" }, feedback: "That's area × length. Since area = length × width, width = area ÷ length." },
              { spec: { type: "expression", expr: "3/(2x)" }, feedback: "That's length ÷ area — upside down. Width = area ÷ length: {{x^2/2 ÷ 3x/4}}." },
            ],
          },
          {
            label: "c",
            prompt: "Simplify {{2a/b * b/(3c) * 6c/a}}.",
            marks: 2,
            answer: { type: "expression", expr: "4", form: "simplified" },
            verify: "(2a/b)*(b/(3c))*(6c/a)",
          },
        ],
        hints: [
          "If {{3a/(2b) * □ = 6a^2/b}}, then □ = {{6a^2/b ÷ 3a/(2b)}}.",
          "Area = length × width, so width = area ÷ length.",
          "In (c), multiply all the tops and all the bottoms, then cancel — every letter appears on both the top and the bottom.",
        ],
        solution: [
          "(a) Undo the multiplication by dividing: {{6a^2/b ÷ 3a/(2b) = 6a^2/b * (2b)/(3a) = (12a^2b)/(3ab)}}.",
          "12 ÷ 3 = 4, the b cancels, and {{a^2/a = a}}. So □ = 4a. Check: {{3a/(2b) * 4a = 12a^2/(2b) = 6a^2/b}} ✓",
          "(b) Width = area ÷ length = {{x^2/2 ÷ 3x/4 = x^2/2 * 4/(3x) = 4x^2/(6x)}}.",
          "{{4/6 = 2/3}} and {{x^2/x = x}}, so the width is {{2x/3}} cm. Check: {{3x/4 * 2x/3 = 6x^2/12 = x^2/2}} ✓",
          "(c) Tops: 2a × b × 6c = 12abc. Bottoms: b × 3c × a = 3abc. So {{12abc/(3abc) = 4}} — every letter cancels.",
        ],
        commonError: "Multiplying instead of dividing when working backwards — to undo × {{3a/(2b)}} you must ÷ {{3a/(2b)}}.",
        strategy: "Work backwards",
      },
    ],
  },
];
