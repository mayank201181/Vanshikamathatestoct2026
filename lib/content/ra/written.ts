import type { QA, QuestionSet } from "../../types";

// Ratio & Proportion — written (show-your-method) questions, 4 sets × 6.
// Sections: ra-basics · ra-sharing · ra-proportion · ra-problems (every set covers all four).
// Class material is marked with `source`; the rest are fresh questions on the same objectives.

export const WRITTEN_RA: QuestionSet<QA>[] = [
  // =========================================================================
  // SET 1 · Foundations (2 warm-up / 3 core / 1 challenge)
  // =========================================================================
  {
    id: "ra-written-1",
    title: "Written 1 · Foundations",
    subtitle: "Simplifying and 1 : n, sharing with a bar model, ratios as fractions, which squash is stronger, and Dean's Mountain.",
    topic: "ra",
    questions: [
      {
        id: "ra-w1-q01",
        topic: "ra",
        section: "ra-basics",
        difficulty: "warmup",
        question: "Simplify each ratio. Type your ratios with a colon, for example 5 : 7.",
        parts: [
          {
            label: "a",
            prompt: "Write 24 : 36 in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [2, 3], simplest: true },
            verify: "24/12:36/12",
          },
          {
            label: "b",
            prompt: "Write 45 cm : 2 m in its simplest form.",
            marks: 2,
            answer: { type: "ratio", parts: [9, 40], simplest: true },
            verify: "45:2*100",
            traps: [
              { spec: { type: "ratio", parts: [45, 2] }, feedback: "45 : 2 compares centimetres with metres. A ratio must use the same units — change 2 m into centimetres first." },
              { spec: { type: "ratio", parts: [9, 4] }, feedback: "2 m is 200 cm, not 20 cm. Use 45 : 200 and then simplify." },
            ],
          },
          {
            label: "c",
            prompt: "Write 6 : 15 in the form 1 : n.",
            marks: 1,
            answer: { type: "ratio", parts: [1, 2.5], unitForm: "1:n" },
            verify: "6/6:15/6",
          },
        ],
        hints: [
          "What is the biggest number that divides into both 24 and 36?",
          "In (b) a ratio must compare the same units — change 2 m into centimetres first. In (c) divide BOTH parts by the first number, 6.",
        ],
        solution: [
          "(a) The HCF of 24 and 36 is 12: 24 ÷ 12 = 2 and 36 ÷ 12 = 3, so 24 : 36 = **2 : 3**.",
          "(b) Change to the same units first: 2 m = 200 cm, so the ratio is 45 : 200.",
          "The HCF of 45 and 200 is 5: 45 ÷ 5 = 9 and 200 ÷ 5 = 40, so 45 cm : 2 m = **9 : 40**.",
          "(c) For the form 1 : n, divide both parts by the first number: 6 ÷ 6 = 1 and 15 ÷ 6 = 2.5, so 6 : 15 = **1 : 2.5**.",
          "Check (c): multiply 1 : 2.5 by 6 and you get back to 6 : 15 ✓",
        ],
        commonError: "Writing 45 : 2 for 45 cm : 2 m (the units must match first), or stopping before the ratio is fully simplified, e.g. 12 : 18 instead of 2 : 3.",
        strategy: "Spot the common factor",
      },
      {
        id: "ra-w1-q02",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "warmup",
        question: "Mo and Mae share some money in the ratio 3 : 5. Mae receives £45.",
        diagram: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar model: Mo has 3 equal boxes and Mae has 5 equal boxes. Mae's 5 boxes are worth £45 altogether."><rect width="300" height="130" fill="#ffffff"/><text x="12" y="40" font-family="sans-serif" font-size="14" fill="#1f2937">Mo</text><rect x="60" y="20" width="40" height="30" fill="#bae6fd" stroke="#1f2937"/><rect x="100" y="20" width="40" height="30" fill="#bae6fd" stroke="#1f2937"/><rect x="140" y="20" width="40" height="30" fill="#bae6fd" stroke="#1f2937"/><text x="12" y="85" font-family="sans-serif" font-size="14" fill="#1f2937">Mae</text><rect x="60" y="65" width="40" height="30" fill="#fde68a" stroke="#1f2937"/><rect x="100" y="65" width="40" height="30" fill="#fde68a" stroke="#1f2937"/><rect x="140" y="65" width="40" height="30" fill="#fde68a" stroke="#1f2937"/><rect x="180" y="65" width="40" height="30" fill="#fde68a" stroke="#1f2937"/><rect x="220" y="65" width="40" height="30" fill="#fde68a" stroke="#1f2937"/><path d="M60 102 V110 H260 V102" fill="none" stroke="#334155" stroke-width="1.5"/><text x="160" y="126" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#1f2937">£45</text></svg>`,
        parts: [
          {
            label: "a",
            prompt: "How much is one part worth? Give your answer in £.",
            marks: 1,
            answer: { type: "number", value: 9, display: "£9" },
            verify: "45/5",
            traps: [
              { spec: { type: "number", value: 15 }, feedback: "£15 is £45 ÷ 3 — but £45 is Mae's share, and Mae has 5 parts. Divide by 5." },
              { spec: { type: "number", value: 5.625, tolerance: 0.01 }, feedback: "£45 is only Mae's share, not the total, so don't divide it by all 8 parts. Mae's £45 is her 5 parts." },
            ],
          },
          {
            label: "b",
            prompt: "How much money was shared altogether? Give your answer in £.",
            marks: 2,
            answer: { type: "number", value: 72, display: "£72" },
            verify: "45/5*(3+5)",
            traps: [
              { spec: { type: "number", value: 27 }, feedback: "£27 is Mo's share (3 parts). The total is Mo's share plus Mae's £45." },
              { spec: { type: "number", value: 120 }, feedback: "£120 = 8 × £15 comes from dividing £45 by 3. Mae's £45 is 5 parts, so find one part with £45 ÷ 5." },
            ],
          },
        ],
        hints: [
          "Look at the bar model: the £45 covers Mae's boxes. How many boxes does Mae have?",
          "Find what one box is worth, then count all the boxes.",
        ],
        solution: [
          "Bar model: Mo has 3 boxes and Mae has 5 boxes, all the same size.",
          "(a) Mae's 5 boxes are worth £45, so one box (one part) = £45 ÷ 5 = **£9**.",
          "(b) There are 3 + 5 = 8 boxes altogether, so the total is 8 × £9 = **£72**.",
          "Check: Mo gets 3 × £9 = £27, and £27 + £45 = £72 ✓",
        ],
        commonError: "Dividing £45 by 3 (Mo's parts) or by 8 (all the parts). £45 is Mae's share, so it is her 5 parts.",
        strategy: "Use a bar model",
        source: "Class worksheet",
      },
      {
        id: "ra-w1-q03",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "core",
        question: "Wei Ling, Omar and Hana share $360 in the ratio 2 : 3 : 4.",
        parts: [
          {
            label: "a",
            prompt: "How much does each person get? Give the amounts in the order Wei Ling, Omar, Hana, separated by commas.",
            marks: 2,
            answer: { type: "list", values: [80, 120, 160], ordered: true, display: "$80, $120, $160" },
            verify: "360/(2+3+4)*2, 360/(2+3+4)*3, 360/(2+3+4)*4",
            traps: [
              { spec: { type: "list", values: [180, 120, 90], ordered: true }, feedback: "Those are $360 ÷ 2, $360 ÷ 3 and $360 ÷ 4 — and they add up to $390, not $360! Add the parts first (2 + 3 + 4) and share $360 into that many equal parts." },
            ],
          },
          {
            label: "b",
            prompt: "What fraction of the money does Omar get? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 1, d: 3, simplest: true },
            verify: "3/(2+3+4)",
            traps: [
              { spec: { type: "fraction", n: 1, d: 2 }, feedback: "{{3/6}} = {{1/2}} compares Omar with the other two people (3 parts : 6 parts). As a fraction of ALL the money, Omar has 3 parts out of 9." },
            ],
          },
          {
            label: "c",
            prompt: "Hana then gives $40 of her share to Wei Ling. Write the new ratio Wei Ling : Omar : Hana in its simplest form.",
            marks: 2,
            answer: { type: "ratio", parts: [1, 1, 1], simplest: true },
            verify: "360/(2+3+4)*2+40:360/(2+3+4)*3:360/(2+3+4)*4-40",
            traps: [
              { spec: { type: "ratio", parts: [2, 3, 3] }, feedback: "You took $40 away from Hana but didn't give it to Wei Ling. Wei Ling's share goes UP by $40." },
            ],
          },
        ],
        hints: [
          "How many parts are there altogether? What is one part worth?",
          "For (c), work out each person's new amount of money first, then simplify the ratio of the amounts.",
        ],
        solution: [
          "Total parts: 2 + 3 + 4 = 9, so one part = $360 ÷ 9 = $40.",
          "(a) Wei Ling: 2 × $40 = **$80**. Omar: 3 × $40 = **$120**. Hana: 4 × $40 = **$160**. Check: 80 + 120 + 160 = 360 ✓",
          "(b) Omar has 3 of the 9 parts: {{3/9}} = **{{1/3}}** of the money. (Check: {{120/360}} = {{1/3}} ✓)",
          "(c) After the gift: Wei Ling has $80 + $40 = $120, Omar still has $120, and Hana has $160 − $40 = $120.",
          "So the new ratio is 120 : 120 : 120 = **1 : 1 : 1** — they now all have the same amount.",
        ],
        commonError: "Dividing $360 by 2, by 3 and by 4 separately. Always add the parts first (9), then find what one part is worth.",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w1-q04",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "In a choir, the ratio of boys to girls is 2 : 5.",
        parts: [
          {
            label: "a",
            prompt: "What fraction of the choir are boys? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 2, d: 7, simplest: true },
            verify: "2/(2+5)",
            traps: [
              { spec: { type: "fraction", n: 2, d: 5 }, feedback: "{{2/5}} compares boys with girls (part : part). For a fraction of the WHOLE choir, use all 2 + 5 = 7 parts." },
            ],
          },
          {
            label: "b",
            prompt: "The number of boys is what fraction of the number of girls? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 2, d: 5, simplest: true },
            verify: "2/5",
            traps: [
              { spec: { type: "fraction", n: 2, d: 7 }, feedback: "{{2/7}} is the boys as a fraction of the whole choir. Here you compare boys with girls only: 2 parts against 5 parts." },
            ],
          },
          {
            label: "c",
            prompt: "There are 35 people in the choir. How many of them are girls?",
            marks: 2,
            answer: { type: "number", value: 25 },
            verify: "35/(2+5)*5",
            traps: [
              { spec: { type: "number", value: 10 }, feedback: "10 is the number of boys (2 parts). The girls are the 5 parts." },
              { spec: { type: "number", value: 87.5, tolerance: 0.1 }, feedback: "35 is the whole choir (all 7 parts), not the boys' 2 parts. Start with one part = 35 ÷ 7." },
            ],
          },
        ],
        hints: [
          "Draw a bar: 2 boxes for boys and 5 boxes for girls. How many boxes make the whole choir?",
          "'A fraction of the choir' uses all the boxes; 'a fraction of the number of girls' uses only the girls' boxes.",
        ],
        solution: [
          "Bar model: boys = 2 boxes, girls = 5 boxes, so the whole choir = 2 + 5 = 7 boxes.",
          "(a) Boys are 2 of the 7 boxes: **{{2/7}}** of the choir.",
          "(b) Compare boys with girls only: 2 boxes against 5 boxes, so the number of boys is **{{2/5}}** of the number of girls. (This is the class rule: b : g = 2 : 5 means {{b/g = 2/5}}.)",
          "(c) 7 boxes = 35 people, so 1 box = 35 ÷ 7 = 5 people. Girls = 5 boxes = 5 × 5 = **25**.",
          "Check: boys = 2 × 5 = 10, and 10 + 25 = 35 ✓, 10 : 25 = 2 : 5 ✓",
        ],
        commonError: "Mixing up part : part with part : whole — saying {{2/5}} of the choir are boys. {{2/5}} compares boys with girls; boys are {{2/7}} of the choir.",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w1-q05",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "Two jugs of orange squash are mixed like this (all the cups are the same size):\n\n- Jug A: 3 cups of squash and 5 cups of water\n- Jug B: 4 cups of squash and 7 cups of water",
        diagram: `<svg viewBox="0 0 400 136" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar pictures of the two jugs. Jug A: 3 cups of squash then 5 cups of water. Jug B: 4 cups of squash then 7 cups of water. All cups are the same size."><rect width="400" height="136" fill="#ffffff"/><text x="10" y="37" font-family="sans-serif" font-size="14" fill="#1f2937">Jug A</text><rect x="70" y="18" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="98" y="18" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="126" y="18" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="154" y="18" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="182" y="18" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="210" y="18" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="238" y="18" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="266" y="18" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><text x="10" y="87" font-family="sans-serif" font-size="14" fill="#1f2937">Jug B</text><rect x="70" y="68" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="98" y="68" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="126" y="68" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="154" y="68" width="28" height="28" fill="#fde68a" stroke="#1f2937"/><rect x="182" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="210" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="238" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="266" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="294" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="322" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="350" y="68" width="28" height="28" fill="#bae6fd" stroke="#1f2937"/><rect x="70" y="108" width="16" height="16" fill="#fde68a" stroke="#1f2937"/><text x="92" y="121" font-family="sans-serif" font-size="13" fill="#1f2937">squash</text><rect x="170" y="108" width="16" height="16" fill="#bae6fd" stroke="#1f2937"/><text x="192" y="121" font-family="sans-serif" font-size="13" fill="#1f2937">water</text></svg>`,
        parts: [
          {
            label: "a",
            prompt: "What fraction of Jug A is squash? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 3, d: 8, simplest: true },
            verify: "3/(3+5)",
            traps: [
              { spec: { type: "fraction", n: 3, d: 5 }, feedback: "{{3/5}} compares squash with water (part : part). Jug A holds 3 + 5 = 8 cups altogether — what fraction of those is squash?" },
            ],
          },
          {
            label: "b",
            prompt: "What fraction of Jug B is squash? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 4, d: 11, simplest: true },
            verify: "4/(4+7)",
            traps: [
              { spec: { type: "fraction", n: 4, d: 7 }, feedback: "{{4/7}} compares squash with water (part : part). Jug B holds 4 + 7 = 11 cups altogether — what fraction of those is squash?" },
            ],
          },
          {
            label: "c",
            prompt: "Which jug is stronger (tastes more of orange)? Explain how you know.",
            marks: 2,
            markScheme: [
              {
                point: "Compares the jugs fairly with numbers, e.g. {{33/88}} and {{32/88}}, or 12 : 20 and 12 : 21, or 0.375 and 0.364",
                keywords: ["33/88+32/88", "12 to 20+12 to 21", "21 to 35+20 to 35", "0.375+0.364", "0.375+0.36", "37.5+36.4", "common denominator", "same amount of squash"],
                feedback: "Compare like with like: write {{3/8}} and {{4/11}} with the same denominator ({{33/88}} and {{32/88}}), or scale both jugs to 12 cups of squash (12 : 20 and 12 : 21).",
              },
              {
                point: "Concludes that Jug A is stronger",
                keywords: ["a is stronger", "a has more squash", "a tastes stronger", "a is more concentrated", "a has a higher", "a has a bigger", "b weaker", "a is more orange"],
                feedback: "Finish with a clear answer: Jug A is stronger, because a bigger fraction of it is squash ({{33/88}} against {{32/88}}).",
              },
            ],
            model: "**Jug A is stronger.** Jug A is {{3/8}} squash and Jug B is {{4/11}} squash. With a common denominator of 88, {{3/8 = 33/88}} and {{4/11 = 32/88}}, so a bigger fraction of Jug A is squash. (Another way: for 12 cups of squash, Jug A is 12 : 20 and Jug B is 12 : 21 — Jug B has more water for the same squash, so it is weaker.)",
          },
        ],
        hints: [
          "More cups of squash doesn't automatically mean stronger — Jug B has more water too. What fraction of each jug is squash?",
          "Compare {{3/8}} and {{4/11}}: rewrite both with the denominator 8 × 11 = 88, or scale both ratios so they have 12 cups of squash.",
        ],
        solution: [
          "(a) Jug A holds 3 + 5 = 8 cups, and 3 of them are squash: **{{3/8}}**.",
          "(b) Jug B holds 4 + 7 = 11 cups, and 4 of them are squash: **{{4/11}}**.",
          "(c) Compare using a common denominator of 8 × 11 = 88: {{3/8 = 33/88}} and {{4/11 = 32/88}}.",
          "{{33/88}} is bigger than {{32/88}}, so a bigger fraction of Jug A is squash: **Jug A is stronger** — even though Jug B has more cups of squash.",
        ],
        altMethod: {
          label: "Make the squash equal",
          steps: [
            "Scale both ratios to 12 cups of squash: Jug A 3 : 5 = 12 : 20 (× 4) and Jug B 4 : 7 = 12 : 21 (× 3).",
            "With the same 12 cups of squash, Jug B has more water (21 cups against 20), so it is weaker.",
            "Jug A is stronger.",
          ],
        },
        commonError: "Saying Jug B is stronger because it has more cups of squash (4 > 3). It also has more water — compare the FRACTION of each jug that is squash.",
        strategy: "Find a common denominator",
      },
      {
        id: "ra-w1-q06",
        topic: "ra",
        section: "ra-problems",
        difficulty: "challenge",
        question: "Dean runs up a mountain road at 8 km/h. It takes him 1 hour to reach the top. He then runs back down the same road at 12 km/h.",
        parts: [
          {
            label: "a",
            prompt: "How long does it take him to run down? Give your answer in minutes.",
            marks: 3,
            answer: { type: "number", value: 40, display: "40 minutes" },
            verify: "8*1/12*60",
            traps: [
              { spec: { type: "number", value: 90 }, feedback: "90 minutes = 60 × {{12/8}}. But running FASTER over the same road must take LESS time than the 60 minutes going up. Find the length of the road first." },
              { spec: { type: "number", value: 2 / 3, tolerance: 0.01 }, feedback: "That's {{2/3}} of an HOUR. The question asks for minutes — multiply by 60." },
            ],
          },
          {
            label: "b",
            prompt: "Write the ratio time going up : time coming down in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [3, 2], simplest: true },
            verify: "60:8*1/12*60",
            traps: [
              { spec: { type: "ratio", parts: [2, 3] }, feedback: "2 : 3 is the ratio of the SPEEDS (8 : 12). Faster means less time, so the times go the other way — compare your two times in minutes." },
            ],
          },
        ],
        hints: [
          "How long is the road? Use 8 km/h for 1 hour.",
          "Time = distance ÷ speed. What fraction of an hour does 8 km take at 12 km/h?",
          "Change that fraction of an hour into minutes by multiplying by 60.",
        ],
        solution: [
          "Going up: 8 km/h for 1 hour, so the road is 8 × 1 = 8 km long.",
          "Going down: time = distance ÷ speed = 8 ÷ 12 = {{8/12}} = {{2/3}} of an hour.",
          "(a) {{2/3}} of 60 minutes = 60 ÷ 3 × 2 = **40 minutes**.",
          "(b) Time up : time down = 60 : 40 = **3 : 2** (divide both by 20).",
          "Notice: the speeds are 8 : 12 = 2 : 3, but the times are 3 : 2. The ratio flips, because covering the same distance faster takes less time.",
        ],
        altMethod: {
          label: "Use the speed ratio",
          steps: [
            "Speed down : speed up = 12 : 8 = 3 : 2, so Dean runs down 1.5 times as fast.",
            "Over the same distance, 1.5 times as fast means the time is divided by 1.5.",
            "60 minutes ÷ 1.5 = 40 minutes.",
          ],
        },
        commonError: "Multiplying instead of dividing (60 × {{12/8}} = 90 minutes). Running faster must take LESS time than the 60 minutes going up.",
        strategy: "Estimate first",
        source: "Ratio Puzzles 1★",
      },
    ],
  },

  // =========================================================================
  // SET 2 · Core skills (1 warm-up / 4 core / 1 challenge)
  // =========================================================================
  {
    id: "ra-written-2",
    title: "Written 2 · Core skills",
    subtitle: "Decimal and fraction ratios, n : 1, sharing from a difference, mixing paints, x : y = 4 : 9, combining ratios, and a changing ratio.",
    topic: "ra",
    questions: [
      {
        id: "ra-w2-q01",
        topic: "ra",
        section: "ra-basics",
        difficulty: "warmup",
        question: "A ratio in its simplest form uses whole numbers with no common factor (unless a form such as n : 1 is asked for).",
        parts: [
          {
            label: "a",
            prompt: "Write 1.5 : 2 in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [3, 4], simplest: true },
            verify: "1.5*2:2*2",
          },
          {
            label: "b",
            prompt: "Write {{1/2}} : {{1/3}} in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [3, 2], simplest: true },
            verify: "1/2*6:1/3*6",
            traps: [
              { spec: { type: "ratio", parts: [2, 3] }, feedback: "2 : 3 comes from reading the denominators. But a half is MORE than a third, so the first part must be bigger. Multiply both parts by 6 to clear the fractions." },
            ],
          },
          {
            label: "c",
            prompt: "Write 18 : 4 in the form n : 1.",
            marks: 1,
            answer: { type: "ratio", parts: [4.5, 1], unitForm: "n:1" },
            verify: "18/4:4/4",
          },
        ],
        hints: [
          "Multiplying or dividing both parts by the same number never changes a ratio. What could you multiply by to get rid of the decimal or the fractions?",
          "For (b), multiply both parts by 6 (the LCM of 2 and 3). For (c), divide both parts by the second number.",
        ],
        solution: [
          "(a) Multiply both parts by 2 to clear the decimal: 1.5 : 2 = 3 : 4. 3 and 4 have no common factor, so the answer is **3 : 4**.",
          "(b) Multiply both parts by 6, the LCM of the denominators: {{1/2}} × 6 = 3 and {{1/3}} × 6 = 2, so {{1/2}} : {{1/3}} = **3 : 2**.",
          "(c) For n : 1, divide both parts by the second number: 18 ÷ 4 = 4.5 and 4 ÷ 4 = 1, so 18 : 4 = **4.5 : 1**.",
        ],
        commonError: "Writing {{1/2}} : {{1/3}} as 2 : 3 by reading the denominators — but a half is bigger than a third, so the answer is 3 : 2.",
        strategy: "Find a common denominator",
      },
      {
        id: "ra-w2-q02",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "core",
        question: "In a sports club, the ratio of children to adults is 7 : 13. There are 42 more adults than children.",
        parts: [
          {
            label: "a",
            prompt: "How many children are in the club?",
            marks: 2,
            answer: { type: "number", value: 49 },
            verify: "42/(13-7)*7",
            traps: [
              { spec: { type: "number", value: 14.7, tolerance: 0.05 }, feedback: "42 is the DIFFERENCE between adults and children. That is 13 − 7 = 6 parts — not all 20 parts." },
              { spec: { type: "number", value: 91 }, feedback: "91 is the number of adults (13 parts). The question asks for the children: 7 parts." },
            ],
          },
          {
            label: "b",
            prompt: "How many members does the club have altogether?",
            marks: 1,
            answer: { type: "number", value: 140 },
            verify: "42/(13-7)*(7+13)",
            traps: [
              { spec: { type: "number", value: 91 }, feedback: "91 is the number of adults (children + 42). Add the children as well to get everyone." },
            ],
          },
          {
            label: "c",
            prompt: "What fraction of the club members are children? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 7, d: 20, simplest: true },
            verify: "7/(7+13)",
            traps: [
              { spec: { type: "fraction", n: 7, d: 13 }, feedback: "{{7/13}} compares children with adults (part : part). As a fraction of the WHOLE club, children are 7 parts out of 7 + 13 = 20." },
            ],
          },
        ],
        hints: [
          "Draw two bars: 7 boxes for children and 13 boxes for adults. How many more boxes do the adults have?",
          "Those extra boxes are the 42 extra adults. What is one box worth?",
        ],
        solution: [
          "Bar model: children = 7 boxes, adults = 13 boxes. The adults have 13 − 7 = 6 more boxes.",
          "Those 6 boxes are the 42 extra adults, so 1 box = 42 ÷ 6 = 7 people.",
          "(a) Children = 7 boxes = 7 × 7 = **49**.",
          "(b) Adults = 13 × 7 = 91, so the total is 49 + 91 = **140** (or 20 boxes × 7 = 140).",
          "(c) Children are 7 of the 20 boxes: **{{7/20}}** of the club.",
          "Check: 91 − 49 = 42 ✓",
        ],
        altMethod: {
          label: "Introduce a variable",
          steps: [
            "Let one part be k: children = 7k and adults = 13k.",
            "Adults − children = 13k − 7k = 6k = 42, so k = 7.",
            "Children = 7 × 7 = 49, and the total is 20k = 140.",
          ],
        },
        commonError: "Dividing 42 by 20 (all the parts). The 42 is the difference between the two groups, which is only 13 − 7 = 6 parts.",
        strategy: "Use a bar model",
        source: "Class worksheet",
      },
      {
        id: "ra-w2-q03",
        topic: "ra",
        section: "ra-problems",
        difficulty: "core",
        question: "To make a shade of green paint, Arjun mixes blue paint and yellow paint in the ratio 3 : 5.",
        parts: [
          {
            label: "a",
            prompt: "He uses 12 litres of blue paint. How much yellow paint does he need? Give your answer in litres.",
            marks: 1,
            answer: { type: "number", value: 20, display: "20 litres" },
            verify: "12/3*5",
            traps: [
              { spec: { type: "number", value: 14 }, feedback: "Ratios multiply, they don't add. Blue goes from 3 parts to 12 litres (× 4), so yellow goes from 5 parts to 5 × 4 litres — not 12 + 2." },
              { spec: { type: "number", value: 7.2, tolerance: 0.05 }, feedback: "You divided the 12 litres by 5. But the blue paint is the 3 parts, so one part = 12 ÷ 3." },
            ],
          },
          {
            label: "b",
            prompt: "Another day he makes 24 litres of the same green paint. How much blue paint does he use? Give your answer in litres.",
            marks: 2,
            answer: { type: "number", value: 9, display: "9 litres" },
            verify: "24/(3+5)*3",
            traps: [
              { spec: { type: "number", value: 14.4, tolerance: 0.05 }, feedback: "{{3/5}} compares blue with yellow. The 24 litres is the WHOLE mix, which is 3 + 5 = 8 parts, so blue is {{3/8}} of it." },
              { spec: { type: "number", value: 15 }, feedback: "15 litres is the yellow paint (5 parts). The question asks for the blue: 3 parts." },
            ],
          },
          {
            label: "c",
            prompt: "He has 6 litres of blue paint and 6 litres of yellow paint. What is the greatest amount of this green paint he can make? Give your answer in litres.",
            marks: 2,
            answer: { type: "number", value: 9.6, display: "9.6 litres" },
            verify: "6/5*(3+5)",
            traps: [
              { spec: { type: "number", value: 12 }, feedback: "Using all 12 litres would mix the colours 6 : 6 = 1 : 1, not 3 : 5. One colour runs out first — which one?" },
              { spec: { type: "number", value: 16 }, feedback: "Using all 6 litres of blue would need 6 ÷ 3 × 5 = 10 litres of yellow, but he only has 6. The yellow runs out first." },
            ],
          },
        ],
        hints: [
          "Blue is 3 parts. In (a), if 3 parts are 12 litres, what is 1 part?",
          "In (b) the 24 litres is the whole mix — how many parts is that? In (c), check which colour runs out first.",
        ],
        solution: [
          "(a) Blue: 3 parts = 12 litres, so 1 part = 12 ÷ 3 = 4 litres. Yellow: 5 parts = 5 × 4 = **20 litres**.",
          "(b) The whole mix is 3 + 5 = 8 parts = 24 litres, so 1 part = 24 ÷ 8 = 3 litres. Blue: 3 parts = 3 × 3 = **9 litres**.",
          "(c) Try using all the blue: 6 litres = 3 parts, so 1 part = 2 litres and he would need 5 × 2 = 10 litres of yellow. He only has 6 litres, so the yellow runs out first.",
          "Use all the yellow instead: 6 litres = 5 parts, so 1 part = 6 ÷ 5 = 1.2 litres. Blue needed: 3 × 1.2 = 3.6 litres (he has enough).",
          "Greatest amount: 6 + 3.6 = **9.6 litres** of green (check: 8 parts × 1.2 = 9.6 ✓).",
        ],
        commonError: "Adding instead of multiplying: thinking yellow is '2 more than blue', so 12 + 2 = 14 litres. Ratios scale by multiplying.",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w2-q04",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "Two positive numbers x and y are in the ratio x : y = 4 : 9.",
        parts: [
          {
            label: "a",
            prompt: "Complete the statement x = ☐ × y. Give the missing number as a fraction in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 4, d: 9, simplest: true },
            verify: "4/9",
            traps: [
              { spec: { type: "fraction", n: 4, d: 13 }, feedback: "{{4/13}} is x as a fraction of x + y (part : whole). Compare x with y only: 4 parts against 9 parts." },
            ],
          },
          {
            label: "b",
            prompt: "By what percentage is y larger than x?",
            marks: 2,
            answer: { type: "number", value: 125, display: "125%" },
            verify: "(9-4)/4*100",
            traps: [
              { spec: { type: "number", value: 225 }, feedback: "225% is y as a percentage OF x (9 ÷ 4 = 2.25). 'Larger than' asks for the increase only." },
              { spec: { type: "number", value: 55.6, tolerance: 0.6 }, feedback: "You divided the difference (5 parts) by y's 9 parts. A percentage increase compares with the starting amount, x, which is 4 parts." },
            ],
          },
          {
            label: "c",
            prompt: "Zara says, 'y is 225% larger than x.' Explain the mistake Zara has made.",
            marks: 2,
            markScheme: [
              {
                point: "225% is y as a percentage OF x: y = 2.25 × x (because 9 ÷ 4 = 2.25)",
                keywords: ["2.25", "9/4", "225 percent of", "percentage of x", "times x", "times bigger"],
                feedback: "Zara's 225% is y as a percentage OF x: 9 ÷ 4 = 2.25, so y = 2.25 × x, which is 225% of x.",
              },
              {
                point: "'Larger than' means the increase: 225% − 100% = 125% (y is 5 parts more than x's 4 parts)",
                keywords: ["125", "minus 100", "take away 100", "subtract 100", "5/4", "1.25", "5 parts"],
                feedback: "'Larger than' is the increase only: y is 5 parts more than x's 4 parts, and {{5/4}} = 125%. That is 225% − 100%.",
              },
            ],
            model: "Zara has worked out y as a percentage **of** x: 9 ÷ 4 = 2.25, so y is 225% of x. But 'larger than' means the increase. y is 9 − 4 = 5 parts more than x's 4 parts, and {{5/4}} = 1.25 = 125%. So y is 125% larger than x (225% − 100% = 125%).",
          },
        ],
        hints: [
          "Picture x as 4 equal boxes and y as 9 boxes of the same size.",
          "How many boxes bigger is y than x? Compare that difference with x's 4 boxes — a percentage change always divides by the starting amount.",
        ],
        solution: [
          "Think of x as 4 equal parts and y as 9 of the same parts.",
          "(a) x compared with y is 4 parts against 9 parts, so x = **{{4/9}}** × y. (The class wrote this as {{x = 4y/9}}.)",
          "(b) y is 9 − 4 = 5 parts bigger than x. As a percentage of x: {{5/4}} × 100 = **125%**.",
          "(c) 9 ÷ 4 = 2.25, so y is 225% **of** x. 'Larger than' means the increase: 225% − 100% = 125%. Zara has given y as a percentage of x, not how much larger it is.",
        ],
        commonError: "Answering 225% (y as a percentage OF x) instead of the increase — or dividing the difference by y to get about 56%.",
        strategy: "Use a bar model",
        source: "Class example",
      },
      {
        id: "ra-w2-q05",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "A bag of party balloons contains red, blue and green balloons. The ratio red : blue is 2 : 3, and the ratio blue : green is 2 : 1.",
        parts: [
          {
            label: "a",
            prompt: "Write the ratio red : blue : green in its simplest form.",
            marks: 2,
            answer: { type: "ratio", parts: [4, 6, 3], simplest: true },
            verify: "2*2:3*2:1*3",
            traps: [
              { spec: { type: "ratio", parts: [2, 3, 1] }, feedback: "2 : 3 : 1 just joins the two ratios together. But blue is 3 parts in one ratio and 2 parts in the other — make the blue parts equal first." },
            ],
          },
          {
            label: "b",
            prompt: "There are 65 balloons in the bag. How many of them are green?",
            marks: 2,
            answer: { type: "number", value: 15 },
            verify: "65/(2*2+3*2+1*3)*(1*3)",
            traps: [
              { spec: { type: "number", value: 65 / 6, tolerance: 0.1 }, feedback: "Using 2 + 3 + 1 = 6 parts comes from the ratio 2 : 3 : 1, which isn't right. Use your three-part ratio from (a)." },
              { spec: { type: "number", value: 5 }, feedback: "5 balloons is ONE part (65 ÷ 13). Green is 3 parts." },
            ],
          },
        ],
        hints: [
          "Blue appears in both ratios. Is blue the same number of parts in each?",
          "Scale both ratios so that blue is 6 parts (the LCM of 3 and 2).",
        ],
        solution: [
          "Blue is in both ratios, but it is 3 parts in one and 2 parts in the other. Make the blue parts equal: the LCM of 3 and 2 is 6.",
          "red : blue = 2 : 3 = 4 : 6 (× 2).",
          "blue : green = 2 : 1 = 6 : 3 (× 3).",
          "(a) Now blue is 6 in both, so red : blue : green = **4 : 6 : 3**.",
          "(b) Total parts = 4 + 6 + 3 = 13, so one part = 65 ÷ 13 = 5 balloons. Green = 3 × 5 = **15**.",
          "Check: red 20, blue 30, green 15 → 20 + 30 + 15 = 65 ✓, 20 : 30 = 2 : 3 ✓, 30 : 15 = 2 : 1 ✓",
        ],
        commonError: "Writing 2 : 3 : 1 — joining the ratios without first making the shared part (blue) the same.",
        strategy: "Make the shared part equal",
        source: "Class worksheet",
      },
      {
        id: "ra-w2-q06",
        topic: "ra",
        section: "ra-problems",
        difficulty: "challenge",
        question: "A box contains red pens and green pens in the ratio 5 : 3. Ali takes out 6 red pens. Now the ratio of red pens to green pens is 1 : 1.",
        parts: [
          {
            label: "a",
            prompt: "How many pens were in the box at the start?",
            marks: 3,
            answer: { type: "number", value: 24 },
            verify: "6/(5-3)*(5+3)",
            traps: [
              { spec: { type: "number", value: 18 }, feedback: "18 is how many pens are left after Ali takes 6 out. The question asks how many there were at the start." },
              { spec: { type: "number", value: 48 }, feedback: "The 6 pens aren't one part — they are the DIFFERENCE between red and green, which is 5 − 3 = 2 parts." },
            ],
          },
          {
            label: "b",
            prompt: "Ali puts the 6 red pens back. Then he adds some more green pens so that the ratio red : green becomes 3 : 4. How many green pens does he add?",
            marks: 2,
            answer: { type: "number", value: 11 },
            verify: "6/(5-3)*5/3*4-6/(5-3)*3",
            traps: [
              { spec: { type: "number", value: 20 }, feedback: "20 is the number of green pens needed altogether. Some green pens are already in the box — how many does he ADD?" },
            ],
          },
        ],
        hints: [
          "Draw 5 boxes for red and 3 boxes for green. After 6 red pens are taken out, red and green are equal. Which boxes did those 6 pens fill?",
          "The 6 pens are the 2 extra red boxes. What is one box worth?",
          "In (b) the number of red pens doesn't change. If red : green = 3 : 4, how many green pens go with that many red pens?",
        ],
        solution: [
          "Bar model: red = 5 boxes and green = 3 boxes, all the same size.",
          "Taking out 6 red pens makes red equal to green, so the 6 pens must be the 2 extra red boxes (5 − 3 = 2).",
          "2 boxes = 6 pens, so 1 box = 3 pens.",
          "(a) At the start: red = 5 × 3 = 15, green = 3 × 3 = 9, so the total is 8 × 3 = **24 pens**.",
          "Check: 15 − 6 = 9 red and 9 green, and 9 : 9 = 1 : 1 ✓",
          "(b) Back to 15 red pens. 3 : 4 = 15 : 20 (× 5), so there must be 20 green pens. He has 9, so he adds 20 − 9 = **11**.",
        ],
        altMethod: {
          label: "Introduce a variable",
          steps: [
            "Let one part be k: red = 5k and green = 3k.",
            "After taking out 6 red pens they are equal: 5k − 6 = 3k, so 2k = 6 and k = 3.",
            "Total at the start = 5k + 3k = 8k = 24 pens.",
          ],
        },
        commonError: "Treating the 6 pens as one part (and getting 48). The 6 pens are the difference between red and green, which is 2 parts.",
        strategy: "Use a bar model",
      },
    ],
  },

  // =========================================================================
  // SET 3 · Exam practice (1 warm-up / 3 core / 2 challenge)
  // =========================================================================
  {
    id: "ra-written-3",
    title: "Written 3 · Exam practice",
    subtitle: "Ratios with units, Lucy–Mary–Nancy, a café survey, football fans, a three-part difference, and adults arriving at a party.",
    topic: "ra",
    questions: [
      {
        id: "ra-w3-q01",
        topic: "ra",
        section: "ra-basics",
        difficulty: "warmup",
        question: "Each ratio below mixes two different units. Change both parts to the same units first.",
        parts: [
          {
            label: "a",
            prompt: "Write 75p : £3 in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [1, 4], simplest: true },
            verify: "75:3*100",
            traps: [
              { spec: { type: "ratio", parts: [25, 1] }, feedback: "75 : 3 compares pence with pounds. Change £3 into pence first." },
            ],
          },
          {
            label: "b",
            prompt: "Write 40 minutes : 2 hours in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [1, 3], simplest: true },
            verify: "40:2*60",
            traps: [
              { spec: { type: "ratio", parts: [20, 1] }, feedback: "40 : 2 compares minutes with hours. Change 2 hours into minutes first." },
            ],
          },
          {
            label: "c",
            prompt: "Write 2.5 kg : 400 g in the form n : 1.",
            marks: 1,
            answer: { type: "ratio", parts: [6.25, 1], unitForm: "n:1" },
            verify: "2.5*1000/400:400/400",
            traps: [
              { spec: { type: "ratio", parts: [0.00625, 1] }, feedback: "2.5 : 400 compares kilograms with grams. Change 2.5 kg into grams first." },
            ],
          },
        ],
        hints: [
          "How many pence are in £3? How many minutes are in 2 hours? How many grams are in 2.5 kg?",
          "Once the units match, divide both parts by their HCF — or, for n : 1, divide both parts by the second number.",
        ],
        solution: [
          "(a) £3 = 300p, so 75p : £3 = 75 : 300. Divide both parts by 75: **1 : 4**.",
          "(b) 2 hours = 120 minutes, so 40 : 120. Divide both parts by 40: **1 : 3**.",
          "(c) 2.5 kg = 2500 g, so 2500 : 400. For n : 1, divide both parts by 400: 2500 ÷ 400 = 6.25, giving **6.25 : 1**.",
        ],
        commonError: "Forgetting to change to the same units — e.g. writing 40 : 2 = 20 : 1 for 40 minutes : 2 hours.",
        strategy: "Spot the common factor",
      },
      {
        id: "ra-w3-q02",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "core",
        question: "Lucy, Mary and Nancy share £180. Lucy receives twice as much as Mary. Nancy receives 50% more than Mary.",
        parts: [
          {
            label: "a",
            prompt: "Write the ratio Lucy : Mary : Nancy in its simplest form, using whole numbers.",
            marks: 1,
            answer: { type: "ratio", parts: [4, 2, 3], simplest: true },
            verify: "2*2:1*2:1.5*2",
            traps: [
              { spec: { type: "ratio", parts: [4, 2, 1] }, feedback: "Nancy gets 50% MORE than Mary, not 50% OF Mary's share. If Mary is 1 part, Nancy is 1 + 0.5 = 1.5 parts." },
            ],
          },
          {
            label: "b",
            prompt: "How much does each of them receive? Give the amounts in the order Lucy, Mary, Nancy, separated by commas.",
            marks: 2,
            answer: { type: "list", values: [80, 40, 60], ordered: true, display: "£80, £40, £60" },
            verify: "180/(2+1+1.5)*2, 180/(2+1+1.5), 180/(2+1+1.5)*1.5",
            traps: [
              { spec: { type: "list", values: [40, 80, 60], ordered: true }, feedback: "Right amounts, wrong order — give them in the order Lucy, Mary, Nancy." },
            ],
          },
          {
            label: "c",
            prompt: "Mary says, 'Nancy gets 50% more than me, so I get 50% less than Nancy.' Is Mary right? Explain your answer.",
            marks: 2,
            markScheme: [
              {
                point: "Finds that Mary gets £20 less than Nancy (£60 − £40)",
                keywords: ["20", "60-40", "60 minus 40"],
                feedback: "Start with the amounts: Nancy has £60 and Mary has £40, so Mary gets £20 less than Nancy.",
              },
              {
                point: "Compares the £20 with Nancy's £60: {{20/60}} = {{1/3}}, about 33%, not 50% — so Mary is wrong",
                keywords: ["1/3", "one third", "a third", "33", "33.3", "33.33", "20/60"],
                feedback: "'Less than Nancy' compares with Nancy's amount: £20 out of £60 is {{1/3}}, about 33% — not 50%. So Mary is wrong.",
              },
            ],
            model: "No, Mary is wrong. Nancy gets £60 and Mary gets £40, so Mary gets £20 less than Nancy. As a fraction of Nancy's share that is {{20/60}} = {{1/3}}, which is about 33% — not 50%. The 50% was worked out from Mary's smaller amount; going the other way you compare with Nancy's bigger amount.",
          },
        ],
        hints: [
          "Call Mary's share 1 part. How many parts do Lucy and Nancy get?",
          "50% more than 1 part is 1.5 parts. Double everything to make whole numbers, then share the £180.",
        ],
        solution: [
          "Let Mary's share be 1 part. Lucy gets twice as much: 2 parts. Nancy gets 50% more than Mary: 1 + 0.5 = 1.5 parts.",
          "(a) Lucy : Mary : Nancy = 2 : 1 : 1.5. Double every part to get whole numbers: **4 : 2 : 3**.",
          "(b) Total parts = 4 + 2 + 3 = 9, so one part = £180 ÷ 9 = £20.",
          "Lucy = 4 × £20 = **£80**, Mary = 2 × £20 = **£40**, Nancy = 3 × £20 = **£60**. Check: 80 + 40 + 60 = 180 ✓",
          "(c) Mary gets £60 − £40 = £20 less than Nancy. As a fraction of Nancy's share that is {{20/60}} = {{1/3}}, about 33% — not 50%. **Mary is wrong.**",
        ],
        commonError: "Treating '50% more than Mary' as half of Mary's share (0.5 parts), giving 4 : 2 : 1. 50% more means 1 + 0.5 = 1.5 parts.",
        strategy: "Use a bar model",
        source: "Class worksheet",
      },
      {
        id: "ra-w3-q03",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "A café asked 240 customers which hot drink they like best. The results were in the ratio coffee : tea : hot chocolate = 9 : 7 : 4.",
        parts: [
          {
            label: "a",
            prompt: "What percentage of the customers chose coffee?",
            marks: 1,
            answer: { type: "number", value: 45, display: "45%" },
            verify: "9/(9+7+4)*100",
            traps: [
              { spec: { type: "number", value: 108 }, feedback: "108 is the NUMBER of customers who chose coffee. The question asks for a percentage: coffee is 9 parts out of how many?" },
            ],
          },
          {
            label: "b",
            prompt: "How many more customers chose coffee than hot chocolate?",
            marks: 2,
            answer: { type: "number", value: 60 },
            verify: "240/(9+7+4)*(9-4)",
            traps: [
              { spec: { type: "number", value: 5 }, feedback: "5 is the difference in PARTS (9 − 4). How many customers is one part?" },
            ],
          },
          {
            label: "c",
            prompt: "Write the ratio tea drinkers : all the customers in its simplest form.",
            marks: 1,
            answer: { type: "ratio", parts: [7, 20], simplest: true },
            verify: "7:9+7+4",
            traps: [
              { spec: { type: "ratio", parts: [7, 13] }, feedback: "7 : 13 compares tea with the other drinks (part : part). 'All the customers' means the whole: all the parts added together." },
            ],
          },
        ],
        hints: [
          "How many parts are there altogether? How many customers is one part?",
          "Percentages and 'all the customers' use the whole — all the parts added together.",
        ],
        solution: [
          "Total parts = 9 + 7 + 4 = 20, so one part = 240 ÷ 20 = 12 customers.",
          "(a) Coffee is 9 of the 20 parts: {{9/20}} = {{45/100}} = **45%**.",
          "(b) Coffee − hot chocolate = 9 − 4 = 5 parts = 5 × 12 = **60** customers. (Check: 108 − 48 = 60 ✓)",
          "(c) Tea is 7 parts and all the customers are 20 parts, so tea : all = **7 : 20**. (In people: 84 : 240, which also simplifies to 7 : 20 when you divide by 12.)",
        ],
        commonError: "Mixing up part : part and part : whole — writing tea : all customers as 7 : 13 (tea compared with the other drinks) instead of 7 : 20.",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w3-q04",
        topic: "ra",
        section: "ra-problems",
        difficulty: "core",
        question: "At a football match, the ratio of away fans to home fans is 5 : 6. For the away fans, the ratio of adults to children is 11 : 4. There are 28 more adult away fans than child away fans.",
        parts: [
          {
            label: "a",
            prompt: "How many away fans are there?",
            marks: 2,
            answer: { type: "number", value: 60 },
            verify: "28/(11-4)*(11+4)",
            traps: [
              { spec: { type: "number", value: 44 }, feedback: "44 is the number of ADULT away fans. All the away fans are adults + children: 11 + 4 = 15 parts." },
            ],
          },
          {
            label: "b",
            prompt: "How many home fans are there?",
            marks: 2,
            answer: { type: "number", value: 72 },
            verify: "28/(11-4)*(11+4)/5*6",
            traps: [
              { spec: { type: "number", value: 50 }, feedback: "That uses the away fans as 6 parts. In away : home = 5 : 6, the away fans are the 5 parts." },
              { spec: { type: "number", value: 132 }, feedback: "132 is ALL the fans (away + home). The question asks for the home fans only." },
            ],
          },
        ],
        hints: [
          "Start with the ratio that comes with a difference: adults : children = 11 : 4 and '28 more'. How many parts is the 28?",
          "Once you know the number of away fans, use away : home = 5 : 6 — the away fans are the 5 parts.",
        ],
        solution: [
          "Start with the away fans, where you know a difference: adults : children = 11 : 4, so the adults have 11 − 4 = 7 more parts.",
          "7 parts = 28 fans, so 1 part = 28 ÷ 7 = 4 fans.",
          "(a) Away fans = 11 + 4 = 15 parts = 15 × 4 = **60** (44 adults and 16 children; 44 − 16 = 28 ✓).",
          "(b) Away : home = 5 : 6, and the 60 away fans are the 5 parts, so 1 part = 60 ÷ 5 = 12.",
          "Home fans = 6 × 12 = **72**.",
        ],
        commonError: "Finding the 60 away fans correctly but then using away : home the wrong way round (60 ÷ 6 × 5 = 50).",
        strategy: "Use a bar model",
        source: "Class worksheet",
      },
      {
        id: "ra-w3-q05",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "challenge",
        question: "In a garden centre display, the ratio of roses to tulips to daisies is 4 : 5 : 11. There are 18 more daisies than roses and tulips put together.",
        parts: [
          {
            label: "a",
            prompt: "How many flowers are in the display altogether?",
            marks: 3,
            answer: { type: "number", value: 180 },
            verify: "18/(11-(4+5))*(4+5+11)",
            traps: [
              { spec: { type: "number", value: 360 }, feedback: "18 isn't one part — it is the difference between the daisies (11 parts) and the roses and tulips together (4 + 5 = 9 parts), which is 2 parts." },
              { spec: { type: "number", value: 9 }, feedback: "9 flowers is ONE part. How many parts are there in the whole display?" },
            ],
          },
          {
            label: "b",
            prompt: "How many tulips are there?",
            marks: 1,
            answer: { type: "number", value: 45 },
            verify: "18/(11-(4+5))*5",
            traps: [
              { spec: { type: "number", value: 90 }, feedback: "That treats the 18 as one part. The 18 is 2 parts, so one part is 18 ÷ 2." },
            ],
          },
        ],
        hints: [
          "Which parts make up 'roses and tulips put together'?",
          "Daisies are 11 parts, and roses and tulips together are 9 parts. How many parts is the 18 extra daisies?",
          "Find one part, then multiply by the total number of parts.",
        ],
        solution: [
          "Roses and tulips together are 4 + 5 = 9 parts. Daisies are 11 parts.",
          "So the daisies have 11 − 9 = 2 more parts than the roses and tulips together.",
          "2 parts = 18 flowers, so 1 part = 18 ÷ 2 = 9 flowers.",
          "(a) Total = 4 + 5 + 11 = 20 parts = 20 × 9 = **180 flowers**.",
          "(b) Tulips = 5 parts = 5 × 9 = **45**.",
          "Check: roses 36, tulips 45, daisies 99. 36 + 45 = 81 and 99 − 81 = 18 ✓",
        ],
        commonError: "Comparing the daisies with only one other flower (e.g. 11 − 4 = 7 parts) instead of with the roses AND tulips together (11 − 9 = 2 parts).",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w3-q06",
        topic: "ra",
        section: "ra-problems",
        difficulty: "challenge",
        question: "At a party there are 45 people. The ratio of adults to children is 1 : 4.",
        parts: [
          {
            label: "a",
            prompt: "How many adults and how many children are at the party? Give your answer in the order adults, children, separated by a comma.",
            marks: 1,
            answer: { type: "list", values: [9, 36], ordered: true, display: "9 adults, 36 children" },
            verify: "45/(1+4)*1, 45/(1+4)*4",
            traps: [
              { spec: { type: "list", values: [36, 9], ordered: true }, feedback: "Right numbers, wrong order — give the adults first, then the children." },
            ],
          },
          {
            label: "b",
            prompt: "No one leaves. How many more adults must arrive so that the ratio of adults to children becomes 2 : 3?",
            marks: 2,
            answer: { type: "number", value: 15 },
            verify: "45/(1+4)*4/3*2-45/(1+4)*1",
            traps: [
              { spec: { type: "number", value: 24 }, feedback: "24 is the number of adults needed altogether. Some adults are already at the party — how many MORE must arrive?" },
              { spec: { type: "number", value: 9 }, feedback: "Sharing 45 in the ratio 2 : 3 assumes the total stays at 45 — but it grows as adults arrive. The 36 children don't change, so they are the 3 parts." },
            ],
          },
          {
            label: "c",
            prompt: "Hana says, 'If some of the children go home instead (and all the adults stay), we can make the ratio adults : children 2 : 3.' Explain why Hana is wrong.",
            marks: 2,
            markScheme: [
              {
                point: "The 9 adults would have to be the 2 parts, so one part = 9 ÷ 2 = 4.5 (9 is odd, so it can't split into 2 equal whole parts)",
                keywords: ["4.5", "9/2", "9 divided by 2", "odd", "4 and a half"],
                feedback: "The adults all stay, so the 9 adults must be the 2 parts of 2 : 3 — one part would be 9 ÷ 2 = 4.5.",
              },
              {
                point: "So there would have to be 3 × 4.5 = 13.5 children — not a whole number of people, so it's impossible",
                keywords: ["13.5", "half a child", "cant have half", "half a person", "not a whole number", "not whole"],
                feedback: "Finish the argument: 3 parts would be 3 × 4.5 = 13.5 children, and you can't have half a child — so it's impossible.",
              },
            ],
            model: "Hana is wrong. All 9 adults stay, so in the ratio 2 : 3 the adults would be the 2 parts: one part = 9 ÷ 2 = 4.5. Then there would have to be 3 × 4.5 = 13.5 children, and you can't have half a child — so it is impossible. (Another way: 9 is odd, so it can't be split into 2 equal whole-number parts.)",
          },
        ],
        hints: [
          "In (b), which group stays the same size? Use it to find one part of the new ratio.",
          "In (b), the 36 children are the 3 parts of 2 : 3. In (c), the 9 adults are the 2 parts — what is one part?",
          "In (c), work out how many children there would have to be. Is that a possible number of people?",
        ],
        solution: [
          "(a) 1 + 4 = 5 parts = 45 people, so 1 part = 9. Adults = **9**, children = 4 × 9 = **36**.",
          "(b) The children don't change, so the 36 children are the 3 parts of 2 : 3: one part = 36 ÷ 3 = 12.",
          "Adults needed = 2 × 12 = 24. There are 9 already, so **15** more adults must arrive.",
          "Check: 24 : 36 = 2 : 3 ✓ (divide both by 12)",
          "(c) Now the adults don't change, so the 9 adults would be the 2 parts: one part = 9 ÷ 2 = 4.5.",
          "The children would then be 3 × 4.5 = 13.5 — you can't have half a child, so Hana is wrong. (Quick reason: 9 is odd, so it can't be split into 2 equal whole parts.)",
        ],
        commonError: "Changing both groups at once (e.g. sharing 45 in the new ratio). First spot which group stays the same — that group fixes the size of one part.",
        strategy: "Use a bar model",
      },
    ],
  },

  // =========================================================================
  // SET 4 · Stretch & challenge (0 warm-up / 3 core / 3 challenge)
  // =========================================================================
  {
    id: "ra-written-4",
    title: "Written 4 · Stretch & challenge",
    subtitle: "Fraction and decimal ratios and a false claim, profit : cost = 7 : 4, a share that changes, linked ratios, Leg It, and coin swaps.",
    topic: "ra",
    questions: [
      {
        id: "ra-w4-q01",
        topic: "ra",
        section: "ra-basics",
        difficulty: "core",
        question: "These questions are about writing ratios in different forms, and checking a claim about equivalent ratios.",
        parts: [
          {
            label: "a",
            prompt: "Write {{2/3}} : {{5/6}} in its simplest form, using whole numbers.",
            marks: 1,
            answer: { type: "ratio", parts: [4, 5], simplest: true },
            verify: "2/3*6:5/6*6",
            traps: [
              { spec: { type: "ratio", parts: [2, 5] }, feedback: "You can't just use the numerators when the denominators are different. Multiply both parts by 6 first." },
            ],
          },
          {
            label: "b",
            prompt: "Write 0.4 : 1.4 in the form 1 : n.",
            marks: 1,
            answer: { type: "ratio", parts: [1, 3.5], unitForm: "1:n" },
            verify: "0.4/0.4:1.4/0.4",
          },
          {
            label: "c",
            prompt: "Jun says, 'If I add 5 to both parts of 3 : 4, I get 8 : 9 — and that is an equivalent ratio.' Is Jun right? Answer yes or no.",
            marks: 1,
            answer: {
              type: "text",
              accept: ["no", "no he is not", "no, he is not", "no he isnt", "no, he isnt", "no he isn’t", "no, he isn’t", "no he is wrong", "no, he is wrong", "he is wrong", "no it is not", "no, it is not", "not right", "wrong", "false"],
              display: "No",
            },
          },
          {
            label: "d",
            prompt: "Explain your answer to part (c).",
            marks: 2,
            markScheme: [
              {
                point: "Equivalent ratios come from multiplying (or dividing) both parts by the same number — not adding",
                keywords: ["multipl", "times", "divid", "scale", "same number"],
                feedback: "Equivalent ratios are made by multiplying or dividing both parts by the same number (3 : 4 = 6 : 8 = 9 : 12). Adding the same number doesn't keep the parts in proportion.",
              },
              {
                point: "Shows the two ratios are different, e.g. {{3/4}} = 0.75 but {{8/9}} ≈ 0.89, or 3 : 4 = 6 : 8, which is not 8 : 9",
                keywords: ["0.75+0.89", "0.75+0.889", "0.75+0.888", "0.75+0.88", "6 to 8", "9 to 12", "27+32", "3/7+8/17"],
                feedback: "Prove it with numbers: {{3/4}} = 0.75 but {{8/9}} = 0.888…, so 3 : 4 and 8 : 9 are not the same ratio.",
              },
            ],
            model: "No. You make an equivalent ratio by multiplying (or dividing) both parts by the same number — for example 3 : 4 = 6 : 8 = 9 : 12. Adding 5 to both parts doesn't do that. Check: {{3/4}} = 0.75 but {{8/9}} = 0.888…, so 3 : 4 and 8 : 9 are different ratios.",
          },
        ],
        hints: [
          "For (a), what can you multiply both fractions by to make whole numbers? For (b), divide both parts by 0.4.",
          "For (c), test Jun's claim: write 3 : 4 and 8 : 9 as fractions or decimals and compare them.",
        ],
        solution: [
          "(a) Multiply both parts by 6 (the LCM of 3 and 6): {{2/3}} × 6 = 4 and {{5/6}} × 6 = 5, so the ratio is **4 : 5**.",
          "(b) For 1 : n, divide both parts by the first number: 0.4 ÷ 0.4 = 1 and 1.4 ÷ 0.4 = 3.5, so 0.4 : 1.4 = **1 : 3.5**.",
          "(c) **No.**",
          "(d) Equivalent ratios come from multiplying (or dividing) both parts by the same number: 3 : 4 = 6 : 8 = 9 : 12 = … and 8 : 9 is not in that list.",
          "Check with decimals: {{3/4}} = 0.75 but {{8/9}} = 0.888…, so 3 : 4 and 8 : 9 are different ratios. Adding 5 increases the small part by a bigger fraction of itself than the large part.",
        ],
        commonError: "Thinking that adding (or subtracting) the same number to both parts keeps a ratio the same. Only multiplying or dividing both parts does that.",
        strategy: "Check by substituting",
      },
      {
        id: "ra-w4-q02",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "core",
        question: "A company's total profits are 75% higher than its costs.",
        parts: [
          {
            label: "a",
            prompt: "Write the ratio profit : cost in its simplest form.",
            marks: 2,
            answer: { type: "ratio", parts: [7, 4], simplest: true },
            verify: "100+75:100",
            traps: [
              { spec: { type: "ratio", parts: [3, 4] }, feedback: "75 : 100 = 3 : 4 compares only the EXTRA profit with the costs. 75% higher means the profit is 100% + 75% of the costs." },
            ],
          },
          {
            label: "b",
            prompt: "The costs were £4 million less than the profits. Work out the profit. Give your answer in £ million, correct to 2 significant figures.",
            marks: 3,
            answer: { type: "number", value: 9.3, display: "£9.3 million" },
            verify: "4/(7-4)*7",
            traps: [
              { spec: { type: "number", value: 28 }, feedback: "£4 million isn't one part — it is the DIFFERENCE between profit and cost: 7 − 4 = 3 parts." },
              { spec: { type: "number", value: 5.3, tolerance: 0.05 }, feedback: "That's the cost (4 parts). The question asks for the profit, which is 7 parts." },
              { spec: { type: "number", value: 9300000, tolerance: 50000 }, feedback: "Right size — but the question asks for the answer in £ million, so type the number of millions (to 2 significant figures)." },
            ],
          },
        ],
        hints: [
          "If the costs are 100%, what percentage are the profits?",
          "Once you have profit : cost, the £4 million is the difference between the profit parts and the cost parts. What is one part worth?",
        ],
        solution: [
          "'75% higher than the costs' means profit = 100% + 75% = 175% of the costs.",
          "(a) profit : cost = 175 : 100. Divide both by 25: **7 : 4**.",
          "(b) Bar model: profit = 7 boxes, cost = 4 boxes. The difference is 7 − 4 = 3 boxes = £4 million.",
          "1 box = £4 million ÷ 3 = £{{4/3}} million (about £1.33 million).",
          "Profit = 7 boxes = 7 × {{4/3}} = {{28/3}} = £9.333… million ≈ **£9.3 million** (2 s.f.).",
          "Check: cost = 4 × {{4/3}} = {{16/3}} ≈ £5.33 million, and 9.33 − 5.33 = 4 ✓",
        ],
        commonError: "Writing profit : cost = 3 : 4 from the '75%'. 75% higher means 175% of the costs, so profit : cost = 7 : 4.",
        strategy: "Use a bar model",
        source: "Class worksheet",
      },
      {
        id: "ra-w4-q03",
        topic: "ra",
        section: "ra-sharing",
        difficulty: "core",
        question: "Priya and Marcus share £150 in the ratio 7 : 3.",
        parts: [
          {
            label: "a",
            prompt: "How much does each of them get? Give the amounts in the order Priya, Marcus, separated by a comma.",
            marks: 1,
            answer: { type: "list", values: [105, 45], ordered: true, display: "£105, £45" },
            verify: "150/(7+3)*7, 150/(7+3)*3",
            traps: [
              { spec: { type: "list", values: [45, 105], ordered: true }, feedback: "Right amounts, wrong order — give Priya's amount first, then Marcus's." },
            ],
          },
          {
            label: "b",
            prompt: "Priya then gives some of her money to Marcus. Now Marcus has twice as much money as Priya. How much did Priya give to Marcus? Give your answer in £.",
            marks: 2,
            answer: { type: "number", value: 55, display: "£55" },
            verify: "150/(7+3)*7-150/(1+2)*1",
            traps: [
              { spec: { type: "number", value: 50 }, feedback: "£50 is how much Priya has LEFT. The question asks how much she gave away." },
              { spec: { type: "number", value: 5 }, feedback: "That gives Priya twice as much as Marcus. It's the other way round: Marcus has twice as much, so Priya : Marcus = 1 : 2." },
            ],
          },
          {
            label: "c",
            prompt: "What fraction of her share did Priya give to Marcus? Give your answer in its simplest form.",
            marks: 1,
            answer: { type: "fraction", n: 11, d: 21, simplest: true },
            verify: "(150/(7+3)*7-150/(1+2))/(150/(7+3)*7)",
            traps: [
              { spec: { type: "fraction", n: 11, d: 30 }, feedback: "{{11/30}} is a fraction of the whole £150. The question asks for a fraction of Priya's own share." },
            ],
          },
        ],
        hints: [
          "When Priya gives money to Marcus, what happens to the TOTAL amount of money they have?",
          "'Marcus has twice as much as Priya' means Priya : Marcus = 1 : 2. Share the same £150 in this new ratio, then compare Priya's old and new amounts.",
        ],
        solution: [
          "(a) 7 + 3 = 10 parts, so 1 part = £150 ÷ 10 = £15. Priya = 7 × £15 = **£105**, Marcus = 3 × £15 = **£45**.",
          "(b) Moving money between them doesn't change the total: it is still £150.",
          "'Marcus has twice as much as Priya' means Priya : Marcus = 1 : 2, which is 3 parts. 1 part = £150 ÷ 3 = £50, so Priya now has £50 and Marcus has £100.",
          "Priya gave away £105 − £50 = **£55**. (Check: Marcus £45 + £55 = £100 ✓)",
          "(c) She gave £55 of her £105: {{55/105}} = **{{11/21}}** (divide the top and bottom by 5).",
        ],
        commonError: "Forgetting that the total stays at £150, or answering with Priya's new amount (£50) instead of how much she gave away (£55).",
        strategy: "Use a bar model",
      },
      {
        id: "ra-w4-q04",
        topic: "ra",
        section: "ra-proportion",
        difficulty: "challenge",
        question: "At a dog show, the ratio of terriers to spaniels is 3 : 4, and the ratio of spaniels to poodles is 6 : 5.",
        parts: [
          {
            label: "a",
            prompt: "Write the ratio terriers : spaniels : poodles in its simplest form.",
            marks: 2,
            answer: { type: "ratio", parts: [9, 12, 10], simplest: true },
            verify: "3*3:4*3:5*2",
            traps: [
              { spec: { type: "ratio", parts: [3, 4, 5] }, feedback: "3 : 4 : 5 just joins the two ratios. The spaniels are 4 parts in one ratio but 6 parts in the other — make the spaniels the same first." },
            ],
          },
          {
            label: "b",
            prompt: "What is the smallest possible number of dogs at the show?",
            marks: 1,
            answer: { type: "number", value: 31 },
            verify: "3*3+4*3+5*2",
            traps: [
              { spec: { type: "number", value: 12 }, feedback: "3 + 4 + 5 = 12 comes from the ratio 3 : 4 : 5, which isn't right. Use your three-part ratio from (a)." },
              { spec: { type: "number", value: 62 }, feedback: "62 dogs would fit the ratios (18 : 24 : 20), but it isn't the smallest number — that ratio simplifies further." },
            ],
          },
          {
            label: "c",
            prompt: "There are actually 93 dogs at the show. How many of them are poodles?",
            marks: 1,
            answer: { type: "number", value: 30 },
            verify: "93/(3*3+4*3+5*2)*(5*2)",
            traps: [
              { spec: { type: "number", value: 3 }, feedback: "3 is the scale factor (93 ÷ 31). The poodles are 10 parts of the three-part ratio — multiply that by 3." },
            ],
          },
        ],
        hints: [
          "Spaniels appear in both ratios. Are they the same number of parts in each?",
          "Make the spaniels 12 parts in both ratios (12 is the LCM of 4 and 6).",
          "With the three-part ratio in its simplest form, the smallest possible show has one dog for each part.",
        ],
        solution: [
          "Spaniels appear in both ratios: 4 parts in one, 6 parts in the other. Make them equal using the LCM of 4 and 6, which is 12.",
          "terriers : spaniels = 3 : 4 = 9 : 12 (× 3).",
          "spaniels : poodles = 6 : 5 = 12 : 10 (× 2).",
          "(a) So terriers : spaniels : poodles = **9 : 12 : 10**. (9, 12 and 10 have no common factor, so this is the simplest form.)",
          "(b) The numbers of dogs must be 9k, 12k and 10k for some whole number k, so the smallest total is 9 + 12 + 10 = **31**.",
          "(c) 93 ÷ 31 = 3, so k = 3: poodles = 10 × 3 = **30**.",
          "Check: 27 terriers, 36 spaniels and 30 poodles. 27 : 36 = 3 : 4 ✓, 36 : 30 = 6 : 5 ✓, 27 + 36 + 30 = 93 ✓",
        ],
        commonError: "Writing 3 : 4 : 5 — joining the ratios without first making the shared part (the spaniels) the same.",
        strategy: "Make the shared part equal",
      },
      {
        id: "ra-w4-q05",
        topic: "ra",
        section: "ra-problems",
        difficulty: "challenge",
        question: "Amina runs 100 m in 12 seconds. Bhavi runs 100 m in 15 seconds. They always run at these speeds. In each race below they must finish at exactly the same time.",
        parts: [
          {
            label: "a",
            prompt: "Amina starts 100 m from the finish line. How many metres in front of Amina should Bhavi start?",
            marks: 2,
            answer: { type: "number", value: 20, display: "20 m" },
            verify: "100-100*12/15",
            traps: [
              { spec: { type: "number", value: 80 }, feedback: "80 m is how far Bhavi runs in 12 seconds — so she starts 80 m from the finish. How far in FRONT of Amina is that?" },
              { spec: { type: "number", value: 25 }, feedback: "This race lasts Amina's 12 seconds, not Bhavi's 15 seconds. How far does Bhavi run in 12 seconds?" },
            ],
          },
          {
            label: "b",
            prompt: "Now Bhavi starts 100 m from the finish line. How many metres behind Bhavi should Amina start?",
            marks: 2,
            answer: { type: "number", value: 25, display: "25 m" },
            verify: "100*15/12-100",
            traps: [
              { spec: { type: "number", value: 125 }, feedback: "125 m is how far Amina runs in 15 seconds — that's her distance from the finish. How far BEHIND Bhavi is that?" },
              { spec: { type: "number", value: 20 }, feedback: "20 m was the head start when the race lasted 12 seconds. This race lasts Bhavi's 15 seconds — how far does Amina run in that time?" },
            ],
          },
          {
            label: "c",
            prompt: "Explain why the answers to (a) and (b) are different.",
            marks: 2,
            markScheme: [
              {
                point: "The two races last different amounts of time: Amina's 12 s in (a) but Bhavi's 15 s in (b)",
                keywords: ["different time", "different amount of time", "different lengths of time", "takes longer", "lasts longer", "longer race", "more time", "race lasts"],
                feedback: "Say what changes: in (a) the race lasts Amina's 12 seconds, but in (b) it lasts Bhavi's 15 seconds — a longer race.",
              },
              {
                point: "Uses the distances: in 12 s Bhavi runs 80 m, but in 15 s Amina runs 125 m (the gap is {{1/5}} of 100 m in (a) and {{1/4}} of 100 m in (b))",
                keywords: ["80+125", "80m+125m", "80m+125", "80+125m", "1/5+1/4", "0.8+1.25", "4/5+5/4", "20 percent+25 percent"],
                feedback: "Back it up with numbers: in 12 s Bhavi runs only 80 m (a gap of 20 m), but in 15 s Amina runs 125 m (a gap of 25 m).",
              },
            ],
            model: "The two races last different amounts of time. In (a) the race lasts Amina's 12 seconds, and in that time Bhavi only runs 80 m, so the gap is 20 m. In (b) the race lasts Bhavi's 15 seconds, which is longer, and in that time Amina runs 125 m, so the gap is 25 m. Their speeds are in the ratio 5 : 4, so the gap is {{1/5}} of 100 m in (a) but {{1/4}} of 100 m in (b).",
          },
        ],
        hints: [
          "In (a), Amina runs exactly 100 m, so the race lasts her 12 seconds. How far does Bhavi run in 12 seconds?",
          "Bhavi runs 100 m in 15 s, so in 12 s she runs {{12/15}} of 100 m. In (b) the race lasts 15 seconds — how far does Amina run in that time?",
          "Amina runs 100 m every 12 s, so in 15 s she runs {{15/12}} of 100 m.",
        ],
        solution: [
          "(a) Amina runs exactly 100 m, so the race lasts her 12 seconds.",
          "In 12 seconds Bhavi runs {{12/15}} = {{4/5}} of 100 m = 80 m, so Bhavi starts 80 m from the finish.",
          "That is 100 − 80 = **20 m** in front of Amina.",
          "(b) Now Bhavi runs exactly 100 m, so the race lasts her 15 seconds.",
          "In 15 seconds Amina runs {{15/12}} = {{5/4}} of 100 m = 125 m, so Amina starts 125 m from the finish.",
          "That is 125 − 100 = **25 m** behind Bhavi.",
          "(c) The races last different times (12 s and 15 s). Amina's speed : Bhavi's speed = 15 : 12 = 5 : 4, so in (a) the gap is {{1/5}} of 100 m, but in (b) it is {{1/4}} of 100 m.",
        ],
        commonError: "Assuming the head start is the same both ways. First work out how long each race lasts — the runner who covers exactly 100 m sets the time.",
        strategy: "Draw a diagram",
        source: "Ratio Puzzles 2★",
      },
      {
        id: "ra-w4-q06",
        topic: "ra",
        section: "ra-problems",
        difficulty: "challenge",
        question: "In a board game, 4 copper coins are worth the same as 3 silver coins, and 5 silver coins are worth the same as 2 gold coins. A copper coin is worth 6 points.",
        parts: [
          {
            label: "a",
            prompt: "How many points is a silver coin worth?",
            marks: 1,
            answer: { type: "number", value: 8 },
            verify: "4*6/3",
            traps: [
              { spec: { type: "number", value: 4.5, tolerance: 0.01 }, feedback: "That's upside down. 4 copper coins = 3 silver coins, so you need FEWER silver coins for the same value — each silver coin is worth MORE than a copper coin." },
            ],
          },
          {
            label: "b",
            prompt: "How many points is a gold coin worth?",
            marks: 1,
            answer: { type: "number", value: 20 },
            verify: "5*(4*6/3)/2",
            traps: [
              { spec: { type: "number", value: 3.2, tolerance: 0.01 }, feedback: "Upside down again: 2 gold coins are worth the same as 5 silver coins, so each gold coin is worth MORE than a silver coin." },
            ],
          },
          {
            label: "c",
            prompt: "Wei Ling swaps 3 gold coins for copper coins of the same total value. How many copper coins does she get?",
            marks: 2,
            answer: { type: "number", value: 10 },
            verify: "3*(5*(4*6/3)/2)/6",
            traps: [
              { spec: { type: "number", value: 60 }, feedback: "60 is the value in POINTS. Each copper coin is worth 6 points — how many copper coins is that?" },
            ],
          },
        ],
        hints: [
          "How many points are 4 copper coins worth? Those points are shared equally between 3 silver coins.",
          "Do the same again: find the value of 5 silver coins, then share it between 2 gold coins.",
          "For (c), turn the 3 gold coins into points, then into copper coins.",
        ],
        solution: [
          "(a) 4 copper coins = 4 × 6 = 24 points. That is the same as 3 silver coins, so 1 silver coin = 24 ÷ 3 = **8 points**.",
          "(b) 5 silver coins = 5 × 8 = 40 points. That is the same as 2 gold coins, so 1 gold coin = 40 ÷ 2 = **20 points**.",
          "(c) 3 gold coins = 3 × 20 = 60 points. Each copper coin is 6 points, so she gets 60 ÷ 6 = **10 copper coins**.",
        ],
        altMethod: {
          label: "Make the shared coin equal",
          steps: [
            "Numbers of coins with the same value: copper : silver = 4 : 3 and silver : gold = 5 : 2. Silver is in both — make it 15 (the LCM of 3 and 5).",
            "4 : 3 = 20 : 15 and 5 : 2 = 15 : 6, so 20 copper = 15 silver = 6 gold.",
            "Halve everything: 10 copper coins = 3 gold coins.",
          ],
        },
        commonError: "Turning an exchange upside down: since 4 copper = 3 silver, a silver coin is worth MORE than a copper coin (8 points, not 4.5).",
        strategy: "Make the shared part equal",
      },
    ],
  },
];
