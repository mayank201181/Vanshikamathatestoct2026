import type { QA, QuestionSet } from "../../types";

// Sequences — written (show-your-method) questions, 4 sets × 6.
// Sections: sq-terms · sq-nth · sq-generate · sq-quadratic.
// Every nth-term key is machine-checked with verify "terms:…" (the validator substitutes n = 1, 2, 3 …).
// Quadratic nth terms in warm-up/core questions are two-term (an² + b or an² + bn); three-term only in challenge.

export const WRITTEN_SQ: QuestionSet<QA>[] = [
  // ---------------------------------------------------------------------------
  // SET 1 · Foundations (warm-up 2 / core 3 / challenge 1)
  // ---------------------------------------------------------------------------
  {
    id: "sq-written-1",
    title: "Written 1 · Foundations",
    subtitle: "Fill gaps, use nth-term rules, find an arithmetic nth term and meet quadratic sequences.",
    topic: "sq",
    questions: [
      {
        id: "sq-w1-q01",
        topic: "sq",
        section: "sq-terms",
        difficulty: "warmup",
        question:
          "In an **arithmetic sequence** the same amount is added (or subtracted) each time. Fill in the gaps in these arithmetic sequences.",
        parts: [
          {
            label: "a",
            prompt: "4, 7, ___, ___, 16\n\nWrite the two missing terms, separated by a comma.",
            marks: 1,
            answer: { type: "list", values: [10, 13], ordered: true },
            verify: "4+2*(16-4)/4, 4+3*(16-4)/4",
          },
          {
            label: "b",
            prompt: "6, ___, ___, ___, 18\n\nWrite the three missing terms, separated by commas.",
            marks: 2,
            answer: { type: "list", values: [9, 12, 15], ordered: true },
            verify: "6+(18-6)/4, 6+2*(18-6)/4, 6+3*(18-6)/4",
            traps: [
              {
                spec: { type: "list", values: [10, 14, 18], ordered: true },
                feedback:
                  "From 6 to 18 there are **4 jumps** (count the gaps between the five terms), not 3. Each jump is 12 ÷ 4 = 3, so the missing terms are 9, 12 and 15.",
              },
            ],
          },
          {
            label: "c",
            prompt: "The sequence in part (b) carries on in the same way. Work out its 10th term.",
            marks: 1,
            answer: { type: "number", value: 33 },
            verify: "6+9*(18-6)/4",
            traps: [
              {
                spec: { type: "number", value: 36 },
                feedback: "From the 1st term to the 10th term is **9** jumps, not 10: 6 + 9 × 3 = 33.",
              },
              {
                spec: { type: "number", value: 30 },
                feedback:
                  "30 is the 10th term of the 3 times table. This sequence is always 3 more than the 3 times table (6 = 3 + 3), so its 10th term is 30 + 3 = 33.",
              },
            ],
          },
        ],
        hints: [
          "Count the **jumps** between the two numbers you know — not the blanks.",
          "In (b), the increase from 6 to 18 is 12. Share it equally between the jumps.",
        ],
        solution: [
          "(a) 4 → 7 is a jump of +3, so keep adding 3: 7 + 3 = **10**, 10 + 3 = **13**. Check: 13 + 3 = 16 ✓",
          "(b) Count the jumps: 6 → ▢ → ▢ → ▢ → 18 is **4 jumps** (always one fewer than the number of terms).",
          "The total increase is 18 − 6 = 12, so each jump is 12 ÷ 4 = 3. The missing terms are **9, 12, 15** (check: 15 + 3 = 18 ✓).",
          "(c) The 10th term is 9 jumps after the 1st term: 6 + 9 × 3 = 6 + 27 = **33**.",
        ],
        altMethod: {
          label: "Use the nth term",
          steps: [
            "The difference is 3, so compare with 3n — the 3 times table: 3, 6, 9, …",
            "Each term is 3 more than the 3 times table (6 = 3 + 3), so the nth term is 3n + 3.",
            "10th term: 3 × 10 + 3 = 33.",
          ],
        },
        commonError:
          "Dividing by the number of blanks instead of the number of jumps: 6, ___, ___, ___, 18 has 3 blanks but 4 jumps, so the difference is 3, not 4.",
        strategy: "Look at the differences",
        source: "Class example (Sequences objectives)",
      },
      {
        id: "sq-w1-q02",
        topic: "sq",
        section: "sq-generate",
        difficulty: "warmup",
        question: "Two sequences have these nth-term rules:\n\n- Sequence A: nth term = 5n\n- Sequence B: nth term = 5n − 2",
        parts: [
          {
            label: "a",
            prompt: "Write the first four terms of sequence A, separated by commas.",
            marks: 1,
            answer: { type: "list", values: [5, 10, 15, 20], ordered: true },
            verify: "5*1, 5*2, 5*3, 5*4",
            traps: [
              {
                spec: { type: "list", values: [6, 7, 8, 9], ordered: true },
                feedback: "5n means 5 × n, not 5 + n. For n = 1 the term is 5 × 1 = 5.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Write the first four terms of sequence B, separated by commas.",
            marks: 1,
            answer: { type: "list", values: [3, 8, 13, 18], ordered: true },
            verify: "5*1-2, 5*2-2, 5*3-2, 5*4-2",
            traps: [
              {
                spec: { type: "list", values: [-2, 3, 8, 13], ordered: true },
                feedback: "You started at n = 0. The 1st term uses n = 1: 5 × 1 − 2 = 3.",
              },
            ],
          },
          {
            label: "c",
            prompt: "Work out the 30th term of sequence B.",
            marks: 1,
            answer: { type: "number", value: 148 },
            verify: "3+29*5",
            traps: [
              {
                spec: { type: "number", value: 150 },
                feedback:
                  "150 is the 30th term of sequence A (5 × 30). Every term of B is 2 less than the matching term of A, so it's 150 − 2 = 148.",
              },
              {
                spec: { type: "number", value: 153 },
                feedback: "From the 1st term (3) to the 30th term is 29 jumps of 5, not 30: 3 + 29 × 5 = 148.",
              },
            ],
          },
        ],
        hints: [
          "5n means 5 × n. Substitute n = 1, then n = 2, n = 3, …",
          "Compare sequence B with sequence A. What has happened to every term?",
        ],
        solution: [
          "(a) Substitute n = 1, 2, 3, 4 into 5n: 5 × 1 = 5, 5 × 2 = 10, 5 × 3 = 15, 5 × 4 = 20. Sequence A is the **5 times table**: **5, 10, 15, 20**.",
          "(b) 5n − 2 means 'the 5 times table, then take 2 off': 5 − 2 = 3, 10 − 2 = 8, 15 − 2 = 13, 20 − 2 = 18. Sequence B is **3, 8, 13, 18**.",
          "Both sequences go up in 5s — the number in front of n is always the common difference.",
          "(c) Put n = 30 into 5n − 2: 5 × 30 − 2 = 150 − 2 = **148**.",
        ],
        commonError: "Starting at n = 0 (which makes −2 look like the first term), or reading 5n as 5 + n.",
        strategy: "Check by substituting",
      },
      {
        id: "sq-w1-q03",
        topic: "sq",
        section: "sq-nth",
        difficulty: "core",
        question: "Here are the first four terms of an arithmetic sequence:\n\n5, 8, 11, 14, …",
        parts: [
          {
            label: "a",
            prompt: "Find an expression for the nth term of the sequence.",
            marks: 2,
            answer: { type: "expression", expr: "3n+2" },
            verify: "terms:5,8,11,14",
            traps: [
              {
                spec: { type: "expression", expr: "3n+5" },
                feedback:
                  "5 is the **1st** term, not the zeroth term. One step before 5 is 5 − 3 = 2, so the nth term is 3n + 2. (Check: 3n + 5 gives 8 when n = 1, not 5.)",
              },
              {
                spec: { type: "expression", expr: "n+3" },
                feedback:
                  "n + 3 gives 4, 5, 6, … — it only goes up by 1. The difference 3 goes **in front of n** (3n is the 3 times table), then you adjust with the zeroth term.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Work out the 50th term of the sequence.",
            marks: 1,
            answer: { type: "number", value: 152 },
            verify: "5+49*3",
            traps: [
              {
                spec: { type: "number", value: 155 },
                feedback:
                  "155 comes from 3 × 50 + 5 (or 5 + 50 × 3). From the 1st term to the 50th term there are only 49 jumps: 5 + 49 × 3 = 152 — the same as 3 × 50 + 2.",
              },
            ],
          },
          {
            label: "c",
            prompt: "Is 100 a term in this sequence? Answer yes or no.",
            marks: 1,
            answer: {
              type: "text",
              accept: ["no", "no it is not", "no, it is not", "no it isn't", "no, it isn't", "no it's not", "no, it's not", "not a term"],
              display: "No",
            },
          },
          {
            label: "d",
            prompt: "Explain how you know.",
            marks: 2,
            markScheme: [
              {
                point: "Sets the nth term equal to 100 and solves: 3n + 2 = 100, so 3n = 98 and n = 98 ÷ 3",
                keywords: ["98", "equals 98", "subtract 2", "minus 2", "take away 2", "divide by 3", "divided by 3"],
                feedback: "Make the nth term equal 100 and solve it: 3n + 2 = 100, so 3n = 98, and n = 98 ÷ 3.",
              },
              {
                point:
                  "n = 32.67 (32 remainder 2) is not a whole number, so 100 is not a term — it falls between the 32nd term (98) and the 33rd term (101)",
                keywords: ["32.6", "32.67", "not a whole", "isnt a whole", "not whole", "decimal", "remainder", "101"],
                feedback:
                  "n is a position (1st, 2nd, 3rd …) so it must be a whole number. 98 ÷ 3 = 32.67 isn't whole — 100 falls between the 32nd term (98) and the 33rd term (101).",
              },
            ],
            model:
              "If 100 were a term, then 3n + 2 = 100. Subtract 2: 3n = 98. Divide by 3: n = 32.67 (32 remainder 2). This is not a whole number, so 100 is not a term — it falls between the 32nd term, 98, and the 33rd term, 101.",
          },
        ],
        hints: [
          "What is the common difference? What would the term **before** 5 be?",
          "nth term = (difference) × n + (zeroth term).",
          "For (c), make your nth term equal to 100 and solve. Is n a whole number?",
        ],
        solution: [
          "Put the terms in a table and include the zeroth term (one step back):\n\n| n | 0 | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|---|\n| term | 2 | 5 | 8 | 11 | 14 |\n| difference | | +3 | +3 | +3 | +3 |",
          "(a) The difference is +3, so the sequence is linked to the 3 times table, 3n. The zeroth term is 5 − 3 = 2, so {{U_n = 3n + 2}}: the nth term is **3n + 2**.",
          "Check: n = 1 → 3 + 2 = 5 ✓, n = 2 → 6 + 2 = 8 ✓, n = 3 → 9 + 2 = 11 ✓",
          "(b) 50th term: 3 × 50 + 2 = 150 + 2 = **152**.",
          "(c) and (d): if 100 were a term, 3n + 2 = 100 → 3n = 98 → n = 98 ÷ 3 = 32.67 (32 remainder 2).",
          "n must be a whole number (it's a position), so 100 is **not** a term. It falls between the 32nd term (3 × 32 + 2 = 98) and the 33rd term (3 × 33 + 2 = 101).",
        ],
        commonError: "Writing 3n + 5 — using the first term instead of the zeroth term (the term before the first).",
        strategy: "Look at the differences",
      },
      {
        id: "sq-w1-q04",
        topic: "sq",
        section: "sq-generate",
        difficulty: "core",
        question: "Some quadratic sequences have an nth term of the form {{n^2 + k}}, where k is a number.",
        parts: [
          {
            label: "a",
            prompt: "When k = 3 the nth term is {{n^2 + 3}}. Write the first five terms of this sequence, separated by commas.",
            marks: 2,
            answer: { type: "list", values: [4, 7, 12, 19, 28], ordered: true },
            verify: "1^2+3, 2^2+3, 3^2+3, 4^2+3, 5^2+3",
            traps: [
              {
                spec: { type: "list", values: [5, 7, 9, 11, 13], ordered: true },
                feedback: "{{n^2}} means n × n, not 2 × n. For n = 3: {{3^2}} = 9, so the 3rd term is 9 + 3 = 12.",
              },
              {
                spec: { type: "list", values: [3, 4, 7, 12, 19], ordered: true },
                feedback: "You started at n = 0. The 1st term uses n = 1: {{1^2}} + 3 = 4.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Work out the second difference of the sequence {{n^2 + 3}}.",
            marks: 1,
            answer: { type: "number", value: 2 },
            verify: "((5^2+3)-(4^2+3))-((4^2+3)-(3^2+3))",
            traps: [
              {
                spec: { type: "number", value: 3 },
                feedback:
                  "3 is the first **first** difference (4 → 7). The second difference is the difference between the first differences: 3, 5, 7, 9 go up by 2.",
              },
            ],
          },
          {
            label: "c",
            prompt: "For a different value of k, the 3rd term of the sequence {{n^2 + k}} is 17. Find the value of k.",
            marks: 1,
            answer: { type: "number", value: 8 },
            verify: "17-3^2",
            traps: [
              {
                spec: { type: "number", value: 14 },
                feedback: "When n = 3, {{n^2}} = 9 (not 3). So 9 + k = 17 and k = 8.",
              },
              {
                spec: { type: "number", value: 11 },
                feedback: "{{3^2}} means 3 × 3 = 9, not 3 × 2 = 6. So 9 + k = 17 and k = 8.",
              },
            ],
          },
        ],
        hints: [
          "Square n first, then add 3: the 1st term is {{1^2}} + 3.",
          "First differences are the gaps between terms; second differences are the gaps between the first differences.",
          "For (c), substitute n = 3 into {{n^2 + k}} and set it equal to 17.",
        ],
        solution: [
          "(a) Substitute n = 1 to 5 — square first, then add 3:\n\n| n | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| {{n^2}} | 1 | 4 | 9 | 16 | 25 |\n| {{n^2 + 3}} | 4 | 7 | 12 | 19 | 28 |",
          "So the first five terms are **4, 7, 12, 19, 28**.",
          "(b) First differences: +3, +5, +7, +9. Second differences: +2, +2, +2. The second difference is **2** — it's constant, which is what makes the sequence quadratic.",
          "(c) Put n = 3 into {{n^2 + k}}: {{3^2 + k = 17}}, so 9 + k = 17 and **k = 8**. Check: {{n^2 + 8}} gives 9, 12, 17 ✓",
        ],
        commonError:
          "Treating {{n^2}} as 2 × n (giving 5, 7, 9, 11, 13 for {{n^2 + 3}}), or using 3 instead of {{3^2}} = 9 when finding k.",
        strategy: "Check by substituting",
        source: "Class worksheet (Quadratic Sequences, Task 1)",
      },
      {
        id: "sq-w1-q05",
        topic: "sq",
        section: "sq-quadratic",
        difficulty: "core",
        question: "Each of these is a **quadratic sequence**: its second differences are constant.",
        parts: [
          {
            label: "a",
            prompt: "4, 5, 8, 13, …\n\nWrite the next two terms, separated by a comma.",
            marks: 2,
            answer: { type: "list", values: [20, 29], ordered: true },
            verify: "5^2-2*5+5, 6^2-2*6+5",
            traps: [
              {
                spec: { type: "list", values: [20, 27], ordered: true },
                feedback:
                  "20 is right, but the first differences keep growing by 2: after +7 comes +9 (not +7 again), so the next term is 20 + 9 = 29.",
              },
              {
                spec: { type: "list", values: [18, 23], ordered: true },
                feedback:
                  "Adding 5 each time treats it as a linear sequence. The first differences +1, +3, +5 go up by 2, so the next two are +7 and +9.",
              },
            ],
          },
          {
            label: "b",
            prompt: "1, 8, 19, 34, …\n\nWrite the next two terms, separated by a comma.",
            marks: 2,
            answer: { type: "list", values: [53, 76], ordered: true },
            verify: "2*5^2+5-2, 2*6^2+6-2",
            traps: [
              {
                spec: { type: "list", values: [49, 64], ordered: true },
                feedback:
                  "Adding 15 each time treats it as linear. The first differences +7, +11, +15 go up by 4, so the next two are +19 and +23.",
              },
              {
                spec: { type: "list", values: [53, 72], ordered: true },
                feedback: "53 is right, but the next first difference is +23, not +19 again: 53 + 23 = 76.",
              },
            ],
          },
        ],
        hints: [
          "Work out the first differences, then the differences between those (the second differences).",
          "Continue the second differences, use them to build the next first differences, then add those on to the terms.",
        ],
        solution: [
          "(a) Make a differences table:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 4 | 5 | 8 | 13 | **20** | **29** |\n| 1st difference | | +1 | +3 | +5 | +7 | +9 |\n| 2nd difference | | | +2 | +2 | +2 | +2 |",
          "The second difference is always +2, so the first differences continue +7, +9: 13 + 7 = **20** and 20 + 9 = **29**.",
          "(b) Same method:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 1 | 8 | 19 | 34 | **53** | **76** |\n| 1st difference | | +7 | +11 | +15 | +19 | +23 |\n| 2nd difference | | | +4 | +4 | +4 | +4 |",
          "The second difference is +4, so the first differences continue +19, +23: 34 + 19 = **53** and 53 + 23 = **76**.",
        ],
        commonError:
          "Adding the last first difference again, as if the sequence were linear, instead of letting the first differences keep growing.",
        strategy: "Look at the differences",
        source: "Class worksheet (Quadratic Sequences, Task 1)",
      },
      {
        id: "sq-w1-q06",
        topic: "sq",
        section: "sq-quadratic",
        difficulty: "challenge",
        question: "Here are the first three patterns in a sequence of dot patterns. The patterns continue in the same way.",
        diagram: `<svg viewBox="0 0 350 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pattern 1 is one row of 2 dots. Pattern 2 is two rows of 3 dots. Pattern 3 is three rows of 4 dots."><rect width="350" height="150" fill="#ffffff"/><g fill="#c7d2fe" stroke="#334155" stroke-width="1.5"><circle cx="40" cy="100" r="7"/><circle cx="62" cy="100" r="7"/><circle cx="125" cy="78" r="7"/><circle cx="147" cy="78" r="7"/><circle cx="169" cy="78" r="7"/><circle cx="125" cy="100" r="7"/><circle cx="147" cy="100" r="7"/><circle cx="169" cy="100" r="7"/><circle cx="240" cy="56" r="7"/><circle cx="262" cy="56" r="7"/><circle cx="284" cy="56" r="7"/><circle cx="306" cy="56" r="7"/><circle cx="240" cy="78" r="7"/><circle cx="262" cy="78" r="7"/><circle cx="284" cy="78" r="7"/><circle cx="306" cy="78" r="7"/><circle cx="240" cy="100" r="7"/><circle cx="262" cy="100" r="7"/><circle cx="284" cy="100" r="7"/><circle cx="306" cy="100" r="7"/></g><g font-family="sans-serif" font-size="13" fill="#1f2937" text-anchor="middle"><text x="51" y="132">Pattern 1</text><text x="147" y="132">Pattern 2</text><text x="273" y="132">Pattern 3</text></g></svg>`,
        parts: [
          {
            label: "a",
            prompt: "How many dots are in Pattern 4 and in Pattern 5? Write the two numbers in that order, separated by a comma.",
            marks: 1,
            answer: { type: "list", values: [20, 30], ordered: true },
            verify: "4*5, 5*6",
            traps: [
              {
                spec: { type: "list", values: [18, 24], ordered: true },
                feedback:
                  "Adding 6 each time treats it as linear. The increases are +4, +6, so the next ones are +8 and +10: 12 + 8 = 20, then 20 + 10 = 30.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Find an expression for the number of dots in Pattern n.",
            marks: 2,
            answer: { type: "expression", expr: "n^2+n" },
            verify: "terms:2,6,12,20,30",
            traps: [
              {
                spec: { type: "expression", expr: "2n^2" },
                feedback:
                  "{{2n^2}} gives 2, 8, 18 — but Pattern 2 has 6 dots. The second difference is 2, so the number in front of {{n^2}} is 2 ÷ 2 = 1.",
              },
              {
                spec: { type: "expression", expr: "4n-2" },
                feedback:
                  "4n − 2 only works if the increase stays at 4. Here the increases are 4, 6, 8, … so the sequence is quadratic, not linear.",
              },
            ],
          },
          {
            label: "c",
            prompt: "Is the number of dots in a pattern **always**, **sometimes** or **never** an even number? Write one word.",
            marks: 1,
            answer: {
              type: "text",
              accept: ["always", "always even", "it is always even", "they are always even", "always an even number"],
              display: "Always",
            },
          },
          {
            label: "d",
            prompt: "Explain your answer to (c).",
            marks: 2,
            markScheme: [
              {
                point:
                  "Uses the structure: there are n(n + 1) dots, two consecutive whole numbers multiplied together (or looks at n odd and n even separately)",
                keywords: ["consecutive", "next to each other", "one more than", "multipl", "times", "product", "n is odd", "n is even"],
                feedback:
                  "Use the picture: Pattern n is a rectangle with n rows of n + 1 dots, so it has n(n + 1) dots — two consecutive numbers multiplied together. (Or split it into two cases: n odd and n even.)",
              },
              {
                point: "One of two consecutive numbers is always even, and even × any whole number is even — so the number of dots is always even",
                keywords: ["one is even", "one of them is even", "one must be even", "odd+even", "even times", "times an even", "multiple of 2"],
                feedback:
                  "Say *why* that's even: of two consecutive numbers one must be even, and an even number times any whole number is even (e.g. 4 × 5 = 20, 5 × 6 = 30).",
              },
            ],
            model:
              "Pattern n is a rectangle with n rows of n + 1 dots, so it has n(n + 1) dots — two consecutive numbers multiplied together. Of any two consecutive whole numbers, one is even, and an even number times any whole number is even. So the number of dots is always even, for example 4 × 5 = 20 and 5 × 6 = 30.",
          },
        ],
        hints: [
          "Count the rows and the dots in each row. How do they relate to the pattern number?",
          "Pattern n has n rows. How many dots are in each row?",
          "For (c), the two numbers you multiply are next to each other on the number line. What is always true about two numbers like that?",
        ],
        solution: [
          "Look at the shapes: Pattern 1 is 1 row of 2, Pattern 2 is 2 rows of 3, Pattern 3 is 3 rows of 4. So Pattern n has **n rows of n + 1 dots**.",
          "(a) Pattern 4: 4 × 5 = **20** dots. Pattern 5: 5 × 6 = **30** dots.",
          "(b) Number of dots = n(n + 1) = **{{n^2 + n}}**. Check it with differences:\n\n| n | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| dots | 2 | 6 | 12 | 20 | 30 |\n| 1st difference | | +4 | +6 | +8 | +10 |\n| 2nd difference | | | +2 | +2 | +2 |\n| dots − {{n^2}} | 1 | 2 | 3 | 4 | 5 |",
          "Second difference 2 → 2 ÷ 2 = 1 lot of {{n^2}}. What's left (1, 2, 3, 4, 5) is n, so the nth term is {{n^2 + n}} ✓",
          "(c) **Always.** n and n + 1 are consecutive whole numbers, so one of them is even — and an even number times any whole number is even.",
          "For example 4 × 5 = 20 (4 is even) and 5 × 6 = 30 (6 is even). Whichever pattern you pick, one side of the rectangle has an even number of dots.",
        ],
        altMethod: {
          label: "Odd and even cases",
          steps: [
            "If n is even: {{n^2}} is even and n is even, and even + even = even.",
            "If n is odd: {{n^2}} is odd and n is odd, and odd + odd = even.",
            "Either way {{n^2 + n}} is even — always.",
          ],
        },
        commonError:
          "Writing {{2n^2}} — using the second difference (2) as the number in front of {{n^2}} instead of halving it.",
        strategy: "Find a pattern",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SET 2 · Core skills (warm-up 1 / core 4 / challenge 1)
  // ---------------------------------------------------------------------------
  {
    id: "sq-written-2",
    title: "Written 2 · Core skills",
    subtitle: "Decreasing and pictorial sequences, spotting quadratics, and finding quadratic nth terms.",
    topic: "sq",
    questions: [
      {
        id: "sq-w2-q01",
        topic: "sq",
        section: "sq-terms",
        difficulty: "warmup",
        question: "This arithmetic sequence goes **down** by the same amount each time:\n\n50, ___, ___, 32, …",
        parts: [
          {
            label: "a",
            prompt: "Write the two missing terms, separated by a comma.",
            marks: 2,
            answer: { type: "list", values: [44, 38], ordered: true },
            verify: "50-(50-32)/3, 50-2*(50-32)/3",
            traps: [
              {
                spec: { type: "list", values: [41, 32], ordered: true },
                feedback:
                  "From 50 to 32 there are **3 jumps** (50 → ▢ → ▢ → 32), not 2. Each jump is 18 ÷ 3 = 6, so the missing terms are 44 and 38.",
              },
            ],
          },
          {
            label: "b",
            prompt: "The sequence continues in the same way. What is the first term that is **negative**?",
            marks: 1,
            answer: { type: "number", value: -4 },
            verify: "50-9*(50-32)/3",
            traps: [
              {
                spec: { type: "number", value: 2 },
                feedback: "2 is the last positive term. One more step: 2 − 6 = −4.",
              },
            ],
          },
        ],
        hints: [
          "How many jumps are there from 50 to 32? Count the arrows, not the blanks.",
          "Once you know the size of each jump, keep subtracting it until you go below zero.",
        ],
        solution: [
          "(a) 50 → ▢ → ▢ → 32 is **3 jumps**. The total change is 32 − 50 = −18, so each jump is −18 ÷ 3 = −6.",
          "50 − 6 = **44**, 44 − 6 = **38**, and 38 − 6 = 32 ✓",
          "(b) Keep subtracting 6: 32, 26, 20, 14, 8, 2, −4. The first negative term is **−4**.",
          "Quicker: 50 = 8 × 6 + 2, so after 8 jumps of 6 you reach 2, and the next jump gives 2 − 6 = −4.",
        ],
        commonError: "Dividing the change (18) by the 2 blanks instead of the 3 jumps.",
        strategy: "Look at the differences",
      },
      {
        id: "sq-w2-q02",
        topic: "sq",
        section: "sq-nth",
        difficulty: "core",
        question: "Here is a sequence:\n\n20, 17, 14, 11, …",
        parts: [
          {
            label: "a",
            prompt: "Find an expression for the nth term of the sequence.",
            marks: 2,
            answer: { type: "expression", expr: "23-3n" },
            verify: "terms:20,17,14,11",
            traps: [
              {
                spec: { type: "expression", expr: "3n+17" },
                feedback:
                  "The terms go **down** by 3, so the n-term is −3n, not +3n. The zeroth term is one step back *up*: 20 + 3 = 23. So the nth term is 23 − 3n.",
              },
              {
                spec: { type: "expression", expr: "20-3n" },
                feedback:
                  "20 is the 1st term, not the zeroth term. One step before 20 is 23, so the nth term is 23 − 3n. (Check: 20 − 3n gives 17 when n = 1.)",
              },
            ],
          },
          {
            label: "b",
            prompt: "Which term of the sequence is −13?",
            marks: 2,
            answer: { type: "number", value: 12 },
            verify: "(20-(-13))/3+1",
            traps: [
              {
                spec: { type: "number", value: 11 },
                feedback:
                  "From 20 down to −13 is 33, which is 11 jumps of 3 — but 11 jumps after the **1st** term is the **12th** term. (Or solve 23 − 3n = −13.)",
              },
            ],
          },
        ],
        hints: [
          "The terms go down by 3. What does that make the number in front of n?",
          "Find the zeroth term (one step before 20), then write the nth term as (zeroth term) − 3n.",
          "For (b), set your nth term equal to −13 and solve.",
        ],
        solution: [
          "Include the zeroth term (one step before the 1st term):\n\n| n | 0 | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|---|\n| term | 23 | 20 | 17 | 14 | 11 |\n| difference | | −3 | −3 | −3 | −3 |",
          "(a) The difference is −3, so the n-term is −3n. The zeroth term is 20 + 3 = 23. So the nth term is **23 − 3n** (you can also write −3n + 23).",
          "Check: n = 1 → 23 − 3 = 20 ✓, n = 4 → 23 − 12 = 11 ✓",
          "(b) 23 − 3n = −13 → 23 + 13 = 3n → 3n = 36 → n = **12**. Check: 23 − 3 × 12 = 23 − 36 = −13 ✓",
        ],
        commonError:
          "Writing 3n + 17: for a decreasing sequence the n-term must be negative (−3n), and the zeroth term is one step back *up* (23).",
        strategy: "Look at the differences",
      },
      {
        id: "sq-w2-q03",
        topic: "sq",
        section: "sq-nth",
        difficulty: "core",
        question: "Ethan makes rows of squares from matchsticks. Here are his first three patterns.",
        diagram: `<svg viewBox="0 0 420 105" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pattern 1 is one square made from 4 matchsticks. Pattern 2 is a row of 2 squares made from 7 matchsticks. Pattern 3 is a row of 3 squares made from 10 matchsticks."><rect width="420" height="105" fill="#ffffff"/><g stroke="#334155" stroke-width="4" stroke-linecap="round" fill="none"><path d="M35 20H65M35 60H65M30 25V55M70 25V55"/><path d="M135 20H165M175 20H205M135 60H165M175 60H205M130 25V55M170 25V55M210 25V55"/><path d="M275 20H305M315 20H345M355 20H385M275 60H305M315 60H345M355 60H385M270 25V55M310 25V55M350 25V55M390 25V55"/></g><g font-family="sans-serif" font-size="13" fill="#1f2937" text-anchor="middle"><text x="50" y="88">Pattern 1</text><text x="170" y="88">Pattern 2</text><text x="330" y="88">Pattern 3</text></g></svg>`,
        parts: [
          {
            label: "a",
            prompt: "Find an expression for the number of matchsticks in Pattern n.",
            marks: 2,
            answer: { type: "expression", expr: "3n+1" },
            verify: "terms:4,7,10",
            traps: [
              {
                spec: { type: "expression", expr: "4n" },
                feedback:
                  "4n counts 4 matchsticks for every square, but neighbouring squares **share** a side — each new square only needs 3 more matchsticks. (4n gives 8 for Pattern 2, not 7.)",
              },
              {
                spec: { type: "expression", expr: "3n+4" },
                feedback: "4 is the 1st term, not the zeroth term. The zeroth term is 4 − 3 = 1, so it's 3n + 1.",
              },
            ],
          },
          {
            label: "b",
            prompt: "How many matchsticks does Ethan need for Pattern 50?",
            marks: 1,
            answer: { type: "number", value: 151 },
            verify: "4+49*3",
            traps: [
              {
                spec: { type: "number", value: 200 },
                feedback: "50 × 4 = 200 counts 4 matchsticks per square, but the squares share sides. Use 3n + 1: 3 × 50 + 1 = 151.",
              },
            ],
          },
          {
            label: "c",
            prompt: "Ethan uses exactly 100 matchsticks to make one of the patterns. Which pattern number is it?",
            marks: 2,
            answer: { type: "number", value: 33 },
            verify: "(100-1)/3",
            traps: [
              {
                spec: { type: "number", value: 25 },
                feedback: "100 ÷ 4 = 25 assumes 4 matchsticks per square. Solve 3n + 1 = 100 instead: 3n = 99, so n = 33.",
              },
            ],
          },
        ],
        hints: [
          "How many **extra** matchsticks does each new square need?",
          "Think of one matchstick on the far left, then a group of 3 for every square.",
          "For (c), make your expression equal 100 and solve.",
        ],
        solution: [
          "Count: Pattern 1 has 4 matchsticks, Pattern 2 has 7, Pattern 3 has 10. Each new square adds **3** matchsticks, because it shares its left side with the square before.",
          "| n | 0 | 1 | 2 | 3 |\n|---|---|---|---|---|\n| matchsticks | 1 | 4 | 7 | 10 |\n| difference | | +3 | +3 | +3 |",
          "(a) Difference 3 → 3n. Zeroth term: 4 − 3 = 1. So the number of matchsticks is **3n + 1**.",
          "(b) Pattern 50: 3 × 50 + 1 = **151** matchsticks.",
          "(c) 3n + 1 = 100 → 3n = 99 → n = **33**. Check: 3 × 33 + 1 = 100 ✓",
        ],
        altMethod: {
          label: "See it in the picture",
          steps: [
            "Start with the single matchstick on the far left — that's the + 1.",
            "Each square then adds a top, a bottom and a right-hand side: 3 matchsticks per square, so 3n.",
            "Total: 3n + 1.",
          ],
        },
        commonError: "Using 4n — forgetting that neighbouring squares share a matchstick.",
        strategy: "Find a pattern",
      },
      {
        id: "sq-w2-q04",
        topic: "sq",
        section: "sq-generate",
        difficulty: "core",
        question: "Here are two sequences.\n\n- Sequence A has nth term {{2n^2 - 1}}.\n- Sequence B is 1, 2, 4, 8, 16, 32, …",
        parts: [
          {
            label: "a",
            prompt: "Write the first four terms of sequence A, separated by commas.",
            marks: 2,
            answer: { type: "list", values: [1, 7, 17, 31], ordered: true },
            verify: "2*1^2-1, 2*2^2-1, 2*3^2-1, 2*4^2-1",
            traps: [
              {
                spec: { type: "list", values: [3, 15, 35, 63], ordered: true },
                feedback:
                  "That's {{(2n)^2 - 1}}. In {{2n^2}} only n is squared: square n first, then double. For n = 2: 2 × 4 − 1 = 7.",
              },
              {
                spec: { type: "list", values: [1, 3, 5, 7], ordered: true },
                feedback:
                  "That's 2n − 1 — the square has gone missing. {{2n^2}} means 2 × n × n, so for n = 3 it's 2 × 9 = 18, and 18 − 1 = 17.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Is sequence B a quadratic sequence? Answer yes or no.",
            marks: 1,
            answer: {
              type: "text",
              accept: ["no", "no it is not", "no, it is not", "no it isn't", "no, it isn't", "no it's not", "no, it's not", "not quadratic"],
              display: "No",
            },
          },
          {
            label: "c",
            prompt: "Justify your answer to (b).",
            marks: 2,
            markScheme: [
              {
                point: "Works out the differences of B: first differences 1, 2, 4, 8, 16 and second differences 1, 2, 4, 8",
                keywords: ["difference", "second difference", "2nd difference", "first difference", "goes up by"],
                feedback: "Show the working: B's first differences are 1, 2, 4, 8, 16 and its second differences are 1, 2, 4, 8.",
              },
              {
                point: "The second differences are not constant (they keep doubling), so B is not quadratic — a quadratic sequence has a constant second difference",
                keywords: ["not constant", "not the same", "arent the same", "change", "doubl", "times 2", "multiplied by 2", "keep growing"],
                feedback:
                  "Say what it means: a quadratic sequence has a **constant** second difference. B's second differences keep changing (they double), so B is not quadratic.",
              },
            ],
            model:
              "The first differences of B are 1, 2, 4, 8, 16 and the second differences are 1, 2, 4, 8. A quadratic sequence has a constant second difference, but these are not constant — they keep doubling, just like the sequence itself (each term is multiplied by 2). So B is not a quadratic sequence.",
          },
        ],
        hints: [
          "In {{2n^2 - 1}}: square n first, then multiply by 2, then subtract 1.",
          "For B, write down the first differences, then the second differences.",
          "A quadratic sequence always has a **constant** second difference. Does B?",
        ],
        solution: [
          "(a) Square first, then double, then subtract 1:\n\n| n | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| {{n^2}} | 1 | 4 | 9 | 16 |\n| {{2n^2}} | 2 | 8 | 18 | 32 |\n| {{2n^2 - 1}} | 1 | 7 | 17 | 31 |",
          "Sequence A starts **1, 7, 17, 31**. (Its first differences 6, 10, 14 have a constant second difference of 4, so A *is* quadratic.)",
          "(b) For B:\n\n| n | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| term | 1 | 2 | 4 | 8 | 16 | 32 |\n| 1st difference | | +1 | +2 | +4 | +8 | +16 |\n| 2nd difference | | | +1 | +2 | +4 | +8 |",
          "The second differences 1, 2, 4, 8 are **not constant**, so B is **not** quadratic.",
          "B's term-to-term rule is **× 2** (doubling). Its differences double too, so they never settle down to a constant.",
        ],
        commonError: "Working out {{(2n)^2 - 1}} instead of {{2n^2 - 1}} — the power belongs to n only.",
        strategy: "Look at the differences",
        source: "Class worksheet (Quadratic Sequences, Task 1)",
      },
      {
        id: "sq-w2-q05",
        topic: "sq",
        section: "sq-quadratic",
        difficulty: "core",
        question: "Find the nth term of each of these quadratic sequences.",
        parts: [
          {
            label: "a",
            prompt: "3, 6, 11, 18, 27, …",
            marks: 2,
            answer: { type: "expression", expr: "n^2+2" },
            verify: "terms:3,6,11,18,27",
            traps: [
              {
                spec: { type: "expression", expr: "n^2+3" },
                feedback:
                  "3 is the 1st term, not the number added on. Subtract {{n^2}} from each term: 3 − 1 = 2, 6 − 4 = 2, 11 − 9 = 2 … so it's {{n^2 + 2}}.",
              },
              {
                spec: { type: "expression", expr: "2n^2+1" },
                feedback:
                  "The number in front of {{n^2}} is **half** the second difference: 2 ÷ 2 = 1. ({{2n^2 + 1}} gives 3, 9, 19 — check the 2nd term.)",
              },
            ],
          },
          {
            label: "b",
            prompt: "2, 8, 18, 32, 50, …",
            marks: 2,
            answer: { type: "expression", expr: "2n^2" },
            verify: "terms:2,8,18,32,50",
            traps: [
              {
                spec: { type: "expression", expr: "4n^2" },
                feedback: "The second difference is 4, so the number in front of {{n^2}} is 4 ÷ 2 = 2, not 4. ({{4n^2}} gives 4, 16, 36 …)",
              },
              {
                spec: { type: "expression", expr: "6n-4" },
                feedback:
                  "6n − 4 only works if the differences stay at 6. Here they are 6, 10, 14, 18 — not constant — so use the second difference.",
              },
            ],
          },
          {
            label: "c",
            prompt: "−2, −2, 0, 4, 10, …",
            marks: 2,
            answer: { type: "expression", expr: "n^2-3n" },
            verify: "terms:-2,-2,0,4,10",
            traps: [
              {
                spec: { type: "expression", expr: "n^2+3n" },
                feedback: "After subtracting {{n^2}} the leftovers are −3, −6, −9, … which go **down** by 3: that's −3n, not +3n.",
              },
              {
                spec: { type: "expression", expr: "n^2-3" },
                feedback:
                  "The leftovers −3, −6, −9, −12, −15 aren't all the same, so the extra part isn't a constant — it's linear: −3n.",
              },
            ],
          },
        ],
        hints: [
          "Find the second difference and halve it — that's the number in front of {{n^2}}.",
          "Subtract that many lots of {{n^2}} from each term. Is what's left a constant, or does it go up or down in steps?",
        ],
        solution: [
          "Method: second difference ÷ 2 = the number in front of {{n^2}}. Subtract that from each term, then find the rule for what's left.",
          "(a) First differences 3, 5, 7, 9; second difference 2, so start with 2 ÷ 2 = 1 lot of {{n^2}}.\n\n| n | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| term | 3 | 6 | 11 | 18 | 27 |\n| {{n^2}} | 1 | 4 | 9 | 16 | 25 |\n| term − {{n^2}} | 2 | 2 | 2 | 2 | 2 |",
          "What's left is always 2, so the nth term is **{{n^2 + 2}}**.",
          "(b) First differences 6, 10, 14, 18; second difference 4, so start with 4 ÷ 2 = 2 lots of {{n^2}}. {{2n^2}} gives 2, 8, 18, 32, 50 — exactly the sequence, so the nth term is **{{2n^2}}**.",
          "(c) First differences 0, 2, 4, 6; second difference 2, so start with {{n^2}}.\n\n| n | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| term | −2 | −2 | 0 | 4 | 10 |\n| {{n^2}} | 1 | 4 | 9 | 16 | 25 |\n| term − {{n^2}} | −3 | −6 | −9 | −12 | −15 |",
          "What's left goes down by 3 each time (its zeroth term is 0), so it is −3n. The nth term is **{{n^2 - 3n}}**. Check: n = 5 → 25 − 15 = 10 ✓",
        ],
        commonError: "Using the second difference itself as the number in front of {{n^2}} instead of halving it.",
        strategy: "Look at the differences",
        source: "Class worksheet (Quadratic Sequences, Task 2)",
      },
      {
        id: "sq-w2-q06",
        topic: "sq",
        section: "sq-generate",
        difficulty: "challenge",
        question:
          "A quadratic sequence has nth term {{an^2 + b}}, where a and b are whole numbers. Its **2nd term is 11** and its **5th term is 53**.",
        parts: [
          {
            label: "a",
            prompt: "Find the nth term of the sequence.",
            marks: 3,
            answer: { type: "expression", expr: "2n^2+3" },
            verify: "((53-11)/(5^2-2^2))n^2+(11-2^2*(53-11)/(5^2-2^2))",
            traps: [
              {
                spec: { type: "expression", expr: "2n^2+7" },
                feedback: "a = 2 is right, but when n = 2, {{n^2}} = 4: 2 × 4 + b = 11, so b = 3 (not 7).",
              },
              {
                spec: { type: "expression", expr: "14n-17" },
                feedback:
                  "14n − 17 fits the 2nd and 5th terms, but it's linear — the rule must be {{an^2 + b}}. From n = 2 to n = 5, {{n^2}} goes from 4 to 25 (up 21), so 21a = 42.",
              },
            ],
          },
          {
            label: "b",
            prompt: "Which term of the sequence is 291?",
            marks: 1,
            answer: { type: "number", value: 12 },
            verify: "sqrt((291-3)/2)",
            traps: [
              {
                spec: { type: "number", value: 144 },
                feedback: "144 is the value of {{n^2}}, not n. The term number is {{sqrt(144)}} = 12.",
              },
            ],
          },
        ],
        hints: [
          "Substitute n = 2 and n = 5 into {{an^2 + b}} — remember to square n.",
          "You get 4a + b = 11 and 25a + b = 53. What happens if you subtract one from the other?",
          "For (b), undo the rule step by step: subtract b, divide by a, then square root.",
        ],
        solution: [
          "(a) Substitute the two terms you know into {{an^2 + b}}:\n\n    n = 2: 4a + b = 11\n    n = 5: 25a + b = 53",
          "Subtract the first equation from the second — the b's cancel: 21a = 42, so **a = 2**.",
          "Then 4 × 2 + b = 11, so **b = 3**. The nth term is **{{2n^2 + 3}}**.",
          "Check: n = 2 → 8 + 3 = 11 ✓; n = 5 → 50 + 3 = 53 ✓",
          "(b) {{2n^2 + 3 = 291}} → {{2n^2 = 288}} → {{n^2 = 144}} → n = **12**. Check: 2 × 144 + 3 = 291 ✓",
        ],
        altMethod: {
          label: "Think about the gap",
          steps: [
            "From the 2nd term to the 5th term, b stays the same while {{n^2}} grows from 4 to 25 — an increase of 21.",
            "The terms grow by 53 − 11 = 42, so 21 lots of a make 42, and a = 2.",
            "Then the 2nd term gives b: 11 − 2 × 4 = 3.",
          ],
        },
        commonError: "Forgetting to square n when substituting — writing 2a + b = 11 instead of 4a + b = 11.",
        strategy: "Work backwards",
      },
    ],
  },
];
