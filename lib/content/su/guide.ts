import type { TopicGuide } from "../../types";

// Revision guide — Unit 2 · Substitution (evaluating expressions and formulae).
// Sections follow lib/sections.ts: su-basics, su-negatives, su-formulae, su-powers.
// Every value below was checked by hand and by script.

export const GUIDE_SU: TopicGuide = {
  topic: "su",
  sections: [
    // -----------------------------------------------------------------------
    // 1 · su-basics
    // -----------------------------------------------------------------------
    {
      id: "su-basics",
      topic: "su",
      lesson: "Substitution",
      heading: "Swap the letters for numbers, then follow BIDMAS",
      discovery: {
        problem:
          "Priya and Arjun are both told that x = 3 and asked to work out 2x². Priya gets 18. Arjun gets 36. Only one of them is right. Who is it — and what did the other one actually work out?",
        idea:
          "Priya is right. In 2x² the power touches only the x, and BIDMAS says do Indices before Multiplication: x² = 3² = 9, then 2 × 9 = 18. Arjun multiplied first (2 × 3 = 6) and then squared: 6² = 36. That's the answer to a different expression, (2x)². If you want the 2 squared as well, you need brackets.",
      },
      body:
        "**Substitution** means replacing each letter with the number it stands for, then working out the value. Once the numbers are in, it's ordinary arithmetic — so the order you work in is fixed by **BIDMAS**.\n\n" +
        "**Step 1 — put the numbers in, in brackets.** Write a line with every letter swapped for its value. In algebra, numbers and letters written next to each other are multiplied (**implied multiplication**), so put the hidden × signs back:\n\n" +
        "- 3ab means 3 × a × b. With a = 3 and b = 4 that's 3 × (3) × (4) = 36 — not 334!\n" +
        "- 4(a + 5) means 4 × (a + 5), so with a = 3 it's 4 × 8 = 32\n" +
        "- 3x² means 3 × x², because the power belongs to the x alone\n\n" +
        "**Step 2 — work it out in BIDMAS order.**\n\n" +
        "| Order | What it covers |\n" +
        "|---|---|\n" +
        "| **B**rackets | ( ) — and also the top or bottom of a fraction, and everything under a √ |\n" +
        "| **I**ndices | powers and roots: x², x³, √ |\n" +
        "| **D**ivision and **M**ultiplication | left to right |\n" +
        "| **A**ddition and **S**ubtraction | left to right |\n\n" +
        "**A power belongs only to what it touches.** With x = 5:\n\n" +
        "    3x² = 3 × (5)² = 3 × 25 = 75\n\n" +
        "Multiplying first gives 15² = 225 — the answer to (3x)², which is a different expression. The diagram shows why 2x² and (2x)² are different too.\n\n" +
        "**A fraction line works like a bracket.** It divides the *whole* top by the *whole* bottom, so finish the top first. With x = 5:\n\n" +
        "    {{(x + 7)/4}} = (5 + 7) ÷ 4 = 12 ÷ 4 = 3\n\n" +
        "Writing 5 + {{7/4}} would divide only the 7.\n\n" +
        "**A square root works like a bracket too.** Finish everything under the √, then take the root. With a = 3 and b = 4:\n\n" +
        "    {{sqrt(a^2 + b^2)}} = {{sqrt(9 + 16)}} = {{sqrt(25)}} = 5\n\n" +
        "It is not 3 + 4 = 7 — you can't square-root the pieces separately.\n\n" +
        "**Why brackets, even for positive numbers?** It's a habit that protects you later. When a value is negative, writing (−3)² rather than −3² is the difference between 9 and −9.",
      diagram: `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Area model with x = 3. 2x squared is two 3 by 3 squares, 18 small squares in total. (2x) squared is one 6 by 6 square, 36 small squares, which is four 3 by 3 blocks.">
  <rect x="0" y="0" width="480" height="240" fill="#ffffff"/>
  <rect x="30" y="80" width="60" height="60" fill="#c7d2fe" stroke="#334155" stroke-width="2"/>
  <rect x="110" y="80" width="60" height="60" fill="#c7d2fe" stroke="#334155" stroke-width="2"/>
  <path d="M50 80V140M70 80V140M30 100H90M30 120H90M130 80V140M150 80V140M110 100H170M110 120H170" fill="none" stroke="#334155" stroke-width="1"/>
  <rect x="300" y="50" width="120" height="120" fill="#fde68a" stroke="#334155" stroke-width="2"/>
  <path d="M320 50V170M340 50V170M380 50V170M400 50V170M300 70H420M300 90H420M300 130H420M300 150H420" fill="none" stroke="#334155" stroke-width="1"/>
  <path d="M360 50V170M300 110H420" fill="none" stroke="#334155" stroke-width="3"/>
  <g font-family="sans-serif" fill="#1f2937" text-anchor="middle">
    <text x="100" y="32" font-size="14" font-weight="bold">2x² = 2 × x²</text>
    <text x="360" y="32" font-size="14" font-weight="bold">(2x)² = 2x × 2x</text>
    <text x="100" y="66" font-size="13">each side x = 3</text>
    <text x="60" y="160" font-size="13">x² = 9</text>
    <text x="140" y="160" font-size="13">x² = 9</text>
    <text x="360" y="188" font-size="13">side 2x = 6</text>
    <text x="235" y="115" font-size="14" font-weight="bold">18 ≠ 36</text>
    <text x="100" y="208" font-size="13" font-weight="bold">2 × 9 = 18 squares</text>
    <text x="360" y="208" font-size="13" font-weight="bold">6 × 6 = 36 squares</text>
    <text x="100" y="228" font-size="12" fill="#475569">two lots of x²</text>
    <text x="360" y="228" font-size="12" fill="#475569">four lots of x²</text>
  </g>
</svg>`,
      diagramCaption:
        "With x = 3: 2x² is two squares of side 3 (2 × 9 = 18), but (2x)² is one square of side 6 — that's four lots of x² (36). The power only touches the x.",
      workedExamples: [
        {
          title: "Using the class values a = 3, b = 4",
          problem: "If a = 3 and b = 4, work out 5 + 2a, 3ab and b² − 2a.",
          steps: [
            "**5 + 2a** → 5 + 2 × (3). Multiply before you add: 2 × 3 = 6, then 5 + 6 = **11**. (Adding first would give 7 × 3 = 21.)",
            "**3ab** means 3 × a × b → 3 × (3) × (4) = 9 × 4 = **36**.",
            "**b² − 2a** → (4)² − 2 × (3). Indices first: 4² = 16. Then 2 × 3 = 6. Finally 16 − 6 = **10**.",
          ],
          answer: "5 + 2a = 11, 3ab = 36 and b² − 2a = 10",
        },
        {
          title: "Class recap: b = 4",
          problem: "If b = 4, work out 5b² and {{(b + 2)/3}}.",
          steps: [
            "5b² means 5 × b², so substitute: 5 × (4)².",
            "Indices first: 4² = 16. Then multiply: 5 × 16 = **80**.",
            "Trap: doing 5 × 4 = 20 and then 20² = 400 squares the 5 as well — that would be (5b)².",
            "For {{(b + 2)/3}}, the fraction line groups the top, so work out 4 + 2 = 6 first.",
            "Then divide: 6 ÷ 3 = **2**. (4 + {{2/3}} would divide only the 2.)",
          ],
          answer: "5b² = 80 and {{(b + 2)/3}} = 2",
        },
        {
          title: "A root acts like a bracket",
          problem: "If a = 3 and b = 4, work out {{sqrt(2a^2 + 7) + 3b}}.",
          steps: [
            "Put the numbers in: {{sqrt(2 * 3^2 + 7) + 3 * 4}}.",
            "Everything under the √ comes first. Indices: 3² = 9. Then 2 × 9 = 18. Then 18 + 7 = 25.",
            "Now take the root: {{sqrt(25)}} = 5.",
            "Then 3b = 3 × 4 = 12, so the total is 5 + 12 = **17**.",
            "Self-check: squaring 2 × 3 = 6 by mistake would give {{sqrt(43)}}, which isn't a whole number — a warning sign in a non-calculator question.",
          ],
          answer: "17",
        },
      ],
      keyPoints: [
        "Substitute = swap each letter for its value, written in brackets, then work it out.",
        "Letters written together are multiplied: 3ab = 3 × a × b and 4(a + 5) = 4 × (a + 5).",
        "BIDMAS: Brackets → Indices (powers and roots) → ÷ and × → + and −.",
        "A power only touches what it's attached to: 2x² = 2 × x², which is not (2x)².",
        "A fraction line and a √ sign act like brackets: finish the whole top, or the whole inside, first.",
      ],
      whyItWorks:
        "A letter is just a box holding a number. Once the number goes in, the expression must give exactly the value it would have had if that number had been written there from the start. BIDMAS is the agreement that makes everyone read 5 + 2 × 3 the same way (11, not 21) — so an expression means one thing, whoever works it out.",
      memoryTrick:
        "**Brackets on, then BIDMAS.** Every time you swap a letter for a number, wrap the number in brackets: 5b² becomes 5 × (4)². The brackets show that the power belongs to the 4 alone — and they'll save you when the numbers turn negative.",
      examTip:
        "Always write the line with the numbers in, e.g. 5 × (4)², before you calculate — it earns the method mark even if you slip later. The most common lost mark is multiplying before squaring: 5b² with b = 4 is 80, not 20² = 400.",
      thinkDeeper:
        "Is there any value of x that makes 2x² and (2x)² equal? Hint: (2x)² = 2x × 2x. How many lots of x² is that — and when could two lots of something equal four lots of it?",
      quickChecks: [
        {
          question: "If p = 5 and q = 2, work out 3p² − 4q.",
          answer: { type: "number", value: 67 },
          solution:
            "3p² = 3 × (5)² = 3 × 25 = 75 and 4q = 4 × 2 = 8, so 75 − 8 = **67**. (217 comes from squaring 3 × 5 = 15 first.)",
        },
        {
          question: "If m = 6 and n = 9, work out {{(m + n)/3}}.",
          answer: { type: "number", value: 5 },
          solution:
            "The fraction line groups the top: 6 + 9 = 15, then 15 ÷ 3 = **5**. (9 comes from dividing only the n by 3: 6 + 3.)",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 2 · su-negatives
    // -----------------------------------------------------------------------
    {
      id: "su-negatives",
      topic: "su",
      lesson: "More Substitution",
      heading: "Negatives, decimals and fractions: bracket every value",
      discovery: {
        problem:
          "Type −3² into a scientific calculator and it says −9. But you know that (−3) × (−3) = 9. Is the calculator broken?",
        idea:
          "No — it's following BIDMAS. In −3² the power touches only the 3, so the calculator squares 3 to get 9 and then puts the minus in front: −9. To square negative three you must write (−3)² = (−3) × (−3) = 9. That's why, whenever you substitute a negative number, you put it in brackets.",
      },
      body:
        "The method is the same as before — numbers in, then BIDMAS — but negatives, decimals and fractions need two extra habits.\n\n" +
        "**Habit 1: bracket every negative you substitute.** Watch what the brackets do when x = −3:\n\n" +
        "| Expression | What it means | With x = −3 |\n" +
        "|---|---|---|\n" +
        "| x² | x × x | (−3) × (−3) = **9** |\n" +
        "| −x² | square x, then make it negative | −(9) = **−9** |\n" +
        "| x³ | x × x × x | (−3) × (−3) × (−3) = **−27** |\n" +
        "| 5 − x | 5 subtract x | 5 − (−3) = **8** |\n\n" +
        "Without brackets, (−3)² turns into −3², which means −(3²) = −9. That one slip loses more marks than anything else in this topic.\n\n" +
        "**Habit 2: use the sign rules.**\n\n" +
        "- Multiply or divide two numbers with the **same** sign → **positive**: (−3) × (−3) = 9\n" +
        "- **Different** signs → **negative**: 2 × (−3) = −6\n" +
        "- **Subtracting a negative is the same as adding**: 5 − (−3) = 5 + 3 = 8\n\n" +
        "Why does taking away a negative add? Subtraction measures a gap: 5 − (−3) asks 'how far is it from −3 up to 5?' The number line shows it's 8 steps.\n\n" +
        "**Powers of a negative:** the minus signs pair up and cancel. An **even** power (like x² or x⁴) uses them all up, so the answer is positive. An **odd** power (like x³ or x⁵) leaves one minus over, so the answer is negative.\n\n" +
        "**Decimals and fractions** obey exactly the same rules — just take care with the arithmetic. With the class recap values a = 1.5, b = 4, c = 6, d = 0.5 and e = −3:\n\n" +
        "    4(a + d) = 4 × (1.5 + 0.5) = 4 × 2 = 8\n" +
        "    3(10 − e) = 3 × (10 − (−3)) = 3 × 13 = 39\n" +
        "    abc = 1.5 × 4 × 6 = 6 × 6 = 36\n" +
        "    d² = (0.5)² = 0.5 × 0.5 = 0.25\n\n" +
        "For a fraction, square the top and the bottom: if x = {{1/2}}, then 4x² = 4 × ({{1/2}})² = 4 × {{1/4}} = 1.\n\n" +
        "**BIDMAS still decides the order.** In 8e² + 3 you square e first, then multiply by 8, then add 3 — the negative sign doesn't change the order, it just needs its brackets.",
      diagram: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Number line from −4 to 6. Eight hops of 1 go from −3 up to 5, showing that 5 − (−3) = 8.">
  <rect x="0" y="0" width="480" height="180" fill="#ffffff"/>
  <path d="M24 110H456" fill="none" stroke="#334155" stroke-width="2"/>
  <path d="M40 104V116M80 104V116M120 104V116M160 104V116M200 104V116M240 104V116M280 104V116M320 104V116M360 104V116M400 104V116M440 104V116" fill="none" stroke="#334155" stroke-width="2"/>
  <path d="M80 106Q100 76 120 106Q140 76 160 106Q180 76 200 106Q220 76 240 106Q260 76 280 106Q300 76 320 106Q340 76 360 106Q380 76 400 106" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <circle cx="80" cy="110" r="6" fill="#fecaca" stroke="#334155" stroke-width="2"/>
  <circle cx="400" cy="110" r="6" fill="#bbf7d0" stroke="#334155" stroke-width="2"/>
  <g font-family="sans-serif" fill="#1f2937" text-anchor="middle">
    <text x="240" y="28" font-size="14" font-weight="bold">5 − (−3): how far is it from −3 up to 5?</text>
    <text x="240" y="72" font-size="13" font-weight="bold">8 steps</text>
    <text x="40" y="134" font-size="13">−4</text>
    <text x="80" y="134" font-size="13">−3</text>
    <text x="120" y="134" font-size="13">−2</text>
    <text x="160" y="134" font-size="13">−1</text>
    <text x="200" y="134" font-size="13">0</text>
    <text x="240" y="134" font-size="13">1</text>
    <text x="280" y="134" font-size="13">2</text>
    <text x="320" y="134" font-size="13">3</text>
    <text x="360" y="134" font-size="13">4</text>
    <text x="400" y="134" font-size="13">5</text>
    <text x="440" y="134" font-size="13">6</text>
    <text x="80" y="152" font-size="12" fill="#475569">start</text>
    <text x="400" y="152" font-size="12" fill="#475569">finish</text>
    <text x="240" y="168" font-size="14" font-weight="bold">5 − (−3) = 5 + 3 = 8</text>
  </g>
</svg>`,
      diagramCaption:
        "Subtraction finds the gap. From −3 up to 5 is 8 steps, so 5 − (−3) = 8 — the same as 5 + 3.",
      workedExamples: [
        {
          title: "Class recap: e = −3",
          problem: "If e = −3, work out e³ and 8e² + 3.",
          steps: [
            "Bracket the value: e³ = (−3)³ = (−3) × (−3) × (−3).",
            "Work in pairs: (−3) × (−3) = 9, then 9 × (−3) = **−27**. Three minus signs is an odd number, so the answer is negative.",
            "8e² + 3 = 8 × (−3)² + 3. Indices first: (−3)² = 9 (the two minus signs pair up).",
            "Then multiply: 8 × 9 = 72. Then add: 72 + 3 = **75**.",
            "If you got −69, you squared −3 to get −9 — but (−3) × (−3) is +9.",
          ],
          answer: "e³ = −27 and 8e² + 3 = 75",
        },
        {
          title: "Class recap: c = 6, e = −3",
          problem: "If c = 6 and e = −3, work out {{(2c - e)/4}}.",
          steps: [
            "Substitute, bracketing the negative: {{(2 * 6 - (-3))/4}}.",
            "The fraction line groups the top, so finish it first: 2 × 6 = 12.",
            "12 − (−3): subtracting a negative means adding, so 12 + 3 = 15.",
            "Now divide by 4: {{15/4}} = 3.75.",
            "Trap: doing 12 − 3 = 9 gives {{9/4}} = 2.25 — that loses the double negative.",
          ],
          answer: "{{15/4}} = 3.75",
        },
        {
          title: "Class Task 2: w = 7, T = −6, x = 4, y = −3",
          problem: "Work out y² + x(2w − T).",
          steps: [
            "Substitute with brackets: (−3)² + 4 × (2 × 7 − (−6)).",
            "Brackets first: 2 × 7 = 14, then 14 − (−6) = 14 + 6 = 20.",
            "Indices: (−3)² = 9.",
            "Multiply: 4 × 20 = 80.",
            "Add: 9 + 80 = **89**.",
          ],
          answer: "89",
        },
      ],
      keyPoints: [
        "Always bracket a negative when you substitute it: x = −3 gives x² = (−3)² = 9.",
        "−x² means square first, then apply the minus: with x = −3, −x² = −9.",
        "Subtracting a negative is adding: 5 − (−3) = 8 and 12 − (−3) = 15.",
        "Multiplying negatives: an even number of minus signs gives a positive, an odd number gives a negative, so (−3)³ = −27.",
        "Decimals follow the same rules: 4(a + d) = 4 × (1.5 + 0.5) = 8 and (0.5)² = 0.25.",
      ],
      whyItWorks:
        "Why is negative × negative positive? Follow the pattern: 2 × (−3) = −6, 1 × (−3) = −3, 0 × (−3) = 0. Each answer goes up by 3. Keep the pattern going: (−1) × (−3) = 3, (−2) × (−3) = 6, (−3) × (−3) = 9. The pattern forces the answer to be positive.",
      memoryTrick:
        "**Even power, positive; odd power, negative** — for any negative number. And when two minus signs meet, as in 5 − (−3), they make a plus.",
      examTip:
        "Put the negative in brackets *before* you square it. Writing −3² instead of (−3)² — on paper or on a calculator — gives −9 instead of 9 and wrecks the whole answer.",
      thinkDeeper:
        "With x = −3, put x², x³ and −x² in order of size, smallest first. Now do the same with x = −0.5. Does the order change? Why?",
      quickChecks: [
        {
          question: "If x = −3, work out 2x² − x.",
          answer: { type: "number", value: 21 },
          solution:
            "x² = (−3)² = 9, so 2x² = 2 × 9 = 18. Then 18 − (−3) = 18 + 3 = **21**. (15 comes from doing 18 − 3; 39 comes from squaring 2 × (−3) = −6.)",
        },
        {
          question: "If p = −4 and q = 0.5, work out p² + 6q.",
          answer: { type: "number", value: 19 },
          solution:
            "p² = (−4)² = (−4) × (−4) = 16 and 6q = 6 × 0.5 = 3, so 16 + 3 = **19**. (−13 comes from writing −4² = −16.)",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 3 · su-formulae
    // -----------------------------------------------------------------------
    {
      id: "su-formulae",
      topic: "su",
      lesson: "Substitution (Try Yourself)",
      heading: "Using formulae: from perimeters to K = ½mv²",
      discovery: {
        problem:
          "The kinetic energy of a moving object is K = ½mv² joules, where m is its mass in kg and v is its speed in m/s. Ball A has mass 2 kg and rolls at 3 m/s. Ball B has half the mass (1 kg) but rolls twice as fast (6 m/s). Which ball has more energy — or is it a draw?",
        idea:
          "Ball A: K = ½ × 2 × 3² = ½ × 2 × 9 = 9 J. Ball B: K = ½ × 1 × 6² = ½ × 1 × 36 = 18 J — double! Halving m halves K, but doubling v makes v² four times bigger, because v is squared. Careful substitution (square v first!) shows you things you might never guess.",
      },
      body:
        "A **formula** is a rule that links quantities using letters, such as P = 2(l + w) for the perimeter of a rectangle. The letter on its own on the left (the **subject**) is the thing you're working out. **Using** a formula is just substitution: numbers in, then BIDMAS.\n\n" +
        "**The routine (it earns the method marks):**\n\n" +
        "1. Write the formula.\n" +
        "2. Write it again with every letter replaced by its value, in brackets.\n" +
        "3. Work it out in BIDMAS order, one step per line.\n" +
        "4. Finish with the **units**.\n\n" +
        "**Example.** The distance travelled is {{s = ut + 1/2 at^2}}. Find s when u = 2 m/s, a = 4 m/s² and t = 3 s.\n\n" +
        "    s = (2) × (3) + {{1/2}} × (4) × (3)²\n" +
        "      = 6 + {{1/2}} × 4 × 9      (indices first: 3² = 9)\n" +
        "      = 6 + 18 = 24 m\n\n" +
        "Notice three things: ut means u × t; only the t is squared; and {{1/2}} × 4 × 9 can be done in any order — halving the 4 first is easiest.\n\n" +
        "**Shapes with algebraic sides.** In class Task 1 you found perimeters when x = 3. Substitute x into every side, then add. For the triangle in the diagram, 3x − 1 = 3 × 3 − 1 = 8 and x + 2 = 3 + 2 = 5, so P = 8 + 8 + 5 = 21 cm. Or simplify first: P = 2(3x − 1) + (x + 2) = 7x, so P = 7 × 3 = 21 cm. Two methods that agree make a perfect check.\n\n" +
        "**Formulae you might meet** (the question always gives you the formula):\n\n" +
        "| Formula | What it works out |\n" +
        "|---|---|\n" +
        "| P = 2(l + w) | perimeter of a rectangle |\n" +
        "| {{A = 1/2 bh}} | area of a triangle |\n" +
        "| {{K = 1/2 mv^2}} | kinetic energy, in joules |\n" +
        "| v = u + at | speed after accelerating |\n" +
        "| {{C = (5(F - 32))/9}} | °F changed into °C |\n\n" +
        "Your job is never to remember these. It's to substitute accurately, keep the order right and give the units.",
      diagram: `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Isosceles triangle with two equal sides of 3x − 1 and a base of x + 2. When x = 3 the sides are 8 cm, 8 cm and 5 cm, so the perimeter is 21 cm.">
  <rect x="0" y="0" width="480" height="240" fill="#ffffff"/>
  <path d="M75 205L120 68L165 205Z" fill="#bbf7d0" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
  <path d="M91.8 134.6L103.2 138.4M136.8 138.4L148.2 134.6" fill="none" stroke="#334155" stroke-width="2"/>
  <g font-family="sans-serif" fill="#1f2937">
    <text x="240" y="30" font-size="14" font-weight="bold" text-anchor="middle">Isosceles triangle: perimeter when x = 3</text>
    <text x="86" y="141" font-size="13" text-anchor="end">3x − 1</text>
    <text x="154" y="141" font-size="13">3x − 1</text>
    <text x="120" y="226" font-size="13" text-anchor="middle">x + 2</text>
    <text x="226" y="70" font-size="14" font-weight="bold">Substitute into each side:</text>
    <text x="226" y="100" font-size="13">3x − 1 = 3 × 3 − 1 = 8 cm</text>
    <text x="226" y="126" font-size="13">x + 2 = 3 + 2 = 5 cm</text>
    <text x="226" y="158" font-size="14" font-weight="bold">P = 8 + 8 + 5 = 21 cm</text>
    <text x="226" y="194" font-size="12" fill="#475569">Check: P = 2(3x − 1) + (x + 2)</text>
    <text x="226" y="214" font-size="12" fill="#475569">= 7x = 7 × 3 = 21 cm ✓</text>
  </g>
</svg>`,
      diagramCaption:
        "Like the shapes in class Task 1: substitute x = 3 into each side, then add. Simplifying first (P = 7x) gives the same 21 cm — a built-in check.",
      workedExamples: [
        {
          title: "Class example: kinetic energy",
          problem: "Use {{K = 1/2 mv^2}} to find the kinetic energy of a 10 kg object moving at 2 m/s.",
          steps: [
            "Write the formula: {{K = 1/2 mv^2}}.",
            "Substitute m = 10 and v = 2: K = {{1/2}} × (10) × (2)².",
            "Indices first — only the v is squared: 2² = 4.",
            "Multiply: {{1/2}} × 10 = 5, then 5 × 4 = **20**.",
            "Units: energy is measured in joules, so K = 20 J. (Squaring {{1/2}} × 10 × 2 = 10 instead would give 100 J — five times too big.)",
          ],
          answer: "20 joules",
        },
        {
          title: "Perimeter with algebraic sides",
          problem: "A regular pentagon has sides of length (3x + 1) cm. Find its perimeter when x = 3.",
          steps: [
            "Regular means all five sides are equal.",
            "One side: 3 × (3) + 1 = 9 + 1 = 10 cm.",
            "Perimeter = 5 × 10 = **50 cm**.",
            "Check by simplifying first: P = 5(3x + 1) = 15x + 5, and 15 × 3 + 5 = 45 + 5 = 50 ✓",
          ],
          answer: "50 cm",
        },
        {
          title: "A formula that gives a negative",
          problem: "The formula {{C = (5(F - 32))/9}} changes a temperature in °F into °C. What is 14 °F in °C?",
          steps: [
            "Substitute F = 14: {{C = (5(14 - 32))/9}}.",
            "Bracket first: 14 − 32 = −18.",
            "Multiply: 5 × (−18) = −90 (different signs give a negative).",
            "Divide: −90 ÷ 9 = **−10**.",
            "Shortcut: 9 goes into −18 exactly, so do −18 ÷ 9 = −2 first, then 5 × (−2) = −10. Same answer, smaller numbers.",
          ],
          answer: "14 °F = −10 °C",
        },
      ],
      keyPoints: [
        "A formula is a rule written with letters; using it is substitution — numbers in, then BIDMAS.",
        "Lay it out: formula → numbers in brackets → one step per line → units.",
        "In K = ½mv² only v is squared: m = 10 and v = 2 give ½ × 10 × 4 = 20 J.",
        "Algebraic sides: substitute into every side and add — or simplify the perimeter first and substitute once.",
        "Formulae can give negatives and decimals: 14 °F = −10 °C.",
      ],
      whyItWorks:
        "A formula is a recipe that works for every possible value — that's the point of using letters. Substituting simply picks one case. Because the rule is the same either way, simplifying first (P = 7x) and substituting afterwards must give the same answer as substituting into each side — so you can use one method to check the other.",
      memoryTrick: "**Write it → sub it → work it out → units.** Four lines, every time.",
      examTip:
        "Show the substituted line, such as K = {{1/2}} × 10 × 2², and give the units. The classic slip is multiplying before squaring: {{1/2}} × 10 × 2 = 10, then 10² = 100 J instead of 20 J.",
      thinkDeeper:
        "Always, sometimes or never: *the Celsius number is smaller than the Fahrenheit number*. Test F = 212, F = 50, F = −40 and F = −76 in {{C = (5(F - 32))/9}} before you decide.",
      quickChecks: [
        {
          question: "A car slowing down uses the formula v = u + at. Find v when u = 20, a = −3 and t = 4. Give v in m/s.",
          answer: { type: "number", value: 8, display: "8 m/s" },
          solution: "at = (−3) × 4 = −12, so v = 20 + (−12) = 20 − 12 = **8 m/s**.",
        },
        {
          question:
            "A rectangle has length (2x + 1) cm and width (x + 4) cm. Use P = 2(l + w) to find its perimeter when x = 5. Give your answer in cm.",
          answer: { type: "number", value: 40, display: "40 cm" },
          solution:
            "l = 2 × 5 + 1 = 11 and w = 5 + 4 = 9, so P = 2(11 + 9) = 2 × 20 = **40 cm**. Check: P = 2(3x + 5) = 6x + 10, and 6 × 5 + 10 = 40 ✓",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 4 · su-powers
    // -----------------------------------------------------------------------
    {
      id: "su-powers",
      topic: "su",
      lesson: "More Challenging Substitution",
      heading: "Squares, cubes and roots: bigger, smaller or the same?",
      discovery: {
        problem:
          "Ravi says: 'Squaring always makes a number bigger — look, 3² = 9 and 10² = 100.' Can you find a number that gets smaller when you square it? What about one that stays exactly the same?",
        idea:
          "Try 0.5: 0.5² = 0.5 × 0.5 = 0.25 — smaller! Half of a half is a quarter. Every number between 0 and 1 shrinks when you square it, because you're taking only part of something that's already less than 1. And 0² = 0 and 1² = 1 don't change at all. So Ravi is only sometimes right.",
      },
      body:
        "When you substitute into x², x³ or √x, the **type** of number you put in decides whether the answer is bigger, smaller or the same. Explaining this is the top-level skill in this topic.\n\n" +
        "| Type of number | Squared | Cubed | Square-rooted |\n" +
        "|---|---|---|---|\n" +
        "| Bigger than 1 | bigger: 3² = 9 | bigger: 3³ = 27 | smaller: {{sqrt(9)}} = 3 |\n" +
        "| Between 0 and 1 | smaller: 0.5² = 0.25 | smaller: 0.5³ = 0.125 | bigger: {{sqrt(0.25)}} = 0.5 |\n" +
        "| 0 or 1 | no change | no change | no change |\n" +
        "| Negative | positive: (−3)² = 9 | negative: (−3)³ = −27 | not possible |\n\n" +
        "**Why do numbers between 0 and 1 shrink?** Squaring multiplies a number by itself, and multiplying by something less than 1 keeps only *part* of it. 0.5² is half of 0.5 — a quarter. Fractions make it obvious: ({{1/2}})² = {{1/4}} and ({{1/3}})² = {{1/9}}. Cubing multiplies by the number once more, so it shrinks even further: 0.5³ = 0.125.\n\n" +
        "**Why do square roots go the other way?** A square root undoes squaring. Since 0.5² = 0.25, {{sqrt(0.25)}} = 0.5, which is bigger than 0.25. Numbers above 1 do the opposite: they grow when squared and shrink when rooted. **1 is the tipping point** — see the number line.\n\n" +
        "**Negatives.** In a square the minus signs pair up: (−3) × (−3) = +9. A cube has three factors, so one minus is left over: (−3)³ = −27. Even powers of a negative are positive; odd powers are negative.\n\n" +
        "**The square root of a negative? Not possible.** No number multiplied by itself gives −9, because (+) × (+) and (−) × (−) are both positive. (Cube roots are fine, though: {{cbrt(-27)}} = −3, because (−3)³ = −27.)\n\n" +
        "**√ means the positive root.** Both 3² and (−3)² equal 9, but {{sqrt(9)}} means 3.\n\n" +
        "**Decimals: count the decimal places.** For 0.3² = 0.3 × 0.3, work out 3 × 3 = 9, then count the decimal places in the numbers you multiplied — two — so the answer is 0.09, not 0.9. Likewise 0.2³ = 0.008 (three decimal places).",
      diagram: `<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Number line from 0 to 2.25. Between 0 and 1, squaring moves 0.5 down to 0.25 and square-rooting moves 0.25 back up to 0.5. Above 1, squaring moves 1.5 up to 2.25 and square-rooting moves 2.25 back down to 1.5. 1 squared stays 1.">
  <rect x="0" y="0" width="480" height="210" fill="#ffffff"/>
  <rect x="40" y="36" width="160" height="74" fill="#bae6fd"/>
  <rect x="200" y="36" width="240" height="74" fill="#fde68a"/>
  <path d="M30 110H450" fill="none" stroke="#334155" stroke-width="2"/>
  <path d="M40 104V116M80 104V116M120 104V116M200 104V116M280 104V116M360 104V116M400 104V116" fill="none" stroke="#334155" stroke-width="2"/>
  <path d="M120 104C120 66 80 66 80 98" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <polygon points="80,106 75,97 85,97" fill="#1f2937"/>
  <path d="M280 104C280 52 400 52 400 98" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <polygon points="400,106 395,97 405,97" fill="#1f2937"/>
  <path d="M80 140C80 176 120 176 120 146" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <polygon points="120,138 115,147 125,147" fill="#1f2937"/>
  <path d="M400 140C400 180 280 180 280 146" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <polygon points="280,138 275,147 285,147" fill="#1f2937"/>
  <circle cx="200" cy="110" r="4.5" fill="#1f2937"/>
  <g font-family="sans-serif" fill="#1f2937" text-anchor="middle">
    <text x="120" y="28" font-size="12" font-weight="bold">0 to 1: squaring shrinks</text>
    <text x="320" y="28" font-size="12" font-weight="bold">above 1: squaring grows</text>
    <text x="100" y="60" font-size="12">0.5² = 0.25</text>
    <text x="340" y="56" font-size="12">1.5² = 2.25</text>
    <text x="200" y="92" font-size="12" font-weight="bold">1² = 1</text>
    <text x="40" y="130" font-size="12">0</text>
    <text x="80" y="130" font-size="12">0.25</text>
    <text x="120" y="130" font-size="12">0.5</text>
    <text x="200" y="130" font-size="12">1</text>
    <text x="280" y="130" font-size="12">1.5</text>
    <text x="360" y="130" font-size="12">2</text>
    <text x="400" y="130" font-size="12">2.25</text>
    <text x="100" y="196" font-size="12">√0.25 = 0.5</text>
    <text x="340" y="196" font-size="12">√2.25 = 1.5</text>
  </g>
</svg>`,
      diagramCaption:
        "Arrows above the line show squaring; arrows below show square-rooting. Squaring makes 0.5 smaller (0.25) but 1.5 bigger (2.25), and the square root undoes each move. 1 is the tipping point.",
      workedExamples: [
        {
          title: "A number between 0 and 1",
          problem: "If x = 0.4, work out x² and x³. Then write x, x² and x³ in order of size, smallest first.",
          steps: [
            "x² = 0.4 × 0.4. Work out 4 × 4 = 16; there are two decimal places in total, so x² = 0.16.",
            "x³ = x² × x = 0.16 × 0.4. Work out 16 × 4 = 64; there are three decimal places in total, so x³ = 0.064.",
            "Compare: 0.064 < 0.16 < 0.4. Each extra × 0.4 keeps only 40% of the number, so every power is smaller than the one before.",
          ],
          answer: "x² = 0.16 and x³ = 0.064, so the order is x³, x², x",
        },
        {
          title: "Powers of a negative",
          problem: "If n = −2, work out {{n^2}}, {{n^3}}, {{n^4}} and {{n^5}}. What do you notice?",
          steps: [
            "{{n^2}} = (−2) × (−2) = 4 — the two minus signs pair up.",
            "{{n^3}} = {{n^2}} × n = 4 × (−2) = −8.",
            "{{n^4}} = {{n^3}} × n = (−8) × (−2) = 16.",
            "{{n^5}} = {{n^4}} × n = 16 × (−2) = −32.",
            "The sign flips every time: **even powers are positive, odd powers are negative**. The size doubles each time.",
          ],
          answer: "4, −8, 16, −32",
        },
        {
          title: "Always, sometimes or never?",
          problem: "Is this statement always, sometimes or never true? *Squaring a number makes it bigger.* Explain your answer.",
          steps: [
            "Bigger than 1: 3² = 9, and 9 is bigger than 3 ✓",
            "Between 0 and 1: 0.5² = 0.25, and 0.25 is smaller than 0.5 ✗",
            "0 and 1: 0² = 0 and 1² = 1 — no change ✗",
            "Negative: (−3)² = 9, and any positive number is bigger than a negative one ✓",
            "One counter-example shows it isn't *always* true; one example that works shows it isn't *never* true.",
          ],
          answer: "**Sometimes** — true for numbers bigger than 1 and for negative numbers, but not for numbers from 0 to 1.",
        },
      ],
      keyPoints: [
        "Numbers bigger than 1 get bigger when squared or cubed, and smaller when square-rooted.",
        "Numbers between 0 and 1 get smaller when squared or cubed (0.5² = 0.25) but bigger when square-rooted (√0.25 = 0.5).",
        "0 and 1 stay the same when squared, cubed or square-rooted.",
        "Negatives: squared → positive, cubed → negative, square-rooted → not possible.",
        "√ means the positive square root: √9 = 3.",
      ],
      whyItWorks:
        "Multiplying by a number bigger than 1 scales things up; multiplying by a number between 0 and 1 scales them down (× 0.5 halves). Squaring x means multiplying x by itself, so it scales x up when x is bigger than 1 and down when x is between 0 and 1. A square root undoes squaring, so it must do the opposite.",
      memoryTrick:
        "**1 is the tipping point.** Above 1, powers push numbers up and roots pull them down; between 0 and 1 it flips. For negatives: **even power, positive; odd power, negative.**",
      examTip:
        "Count decimal places when you square a decimal: 0.3² = 0.09, not 0.9. And if you're asked for the square root of a negative, say it isn't possible — don't write {{sqrt(-9)}} = −3.",
      thinkDeeper:
        "Always, sometimes or never: *cubing a negative number makes it smaller*. Test x = −3 and x = −0.5, and mark each answer on a number line before you decide.",
      quickChecks: [
        {
          question: "If y = 0.36, work out {{sqrt(y)}}.",
          answer: { type: "number", value: 0.6 },
          solution:
            "0.6 × 0.6 = 0.36, so {{sqrt(0.36)}} = **0.6**. Check: the root of a number between 0 and 1 should be bigger — and 0.6 is bigger than 0.36 ✓ (0.06 is wrong: 0.06² = 0.0036.)",
        },
        {
          question: "If x = −2, work out x³ − x².",
          answer: { type: "number", value: -12 },
          solution:
            "x³ = (−2)³ = −8 and x² = (−2)² = 4, so x³ − x² = −8 − 4 = **−12**. (−4 comes from using x² = −4.)",
        },
      ],
    },
  ],
  flashcards: [
    {
      front: "What does **substitute** mean?",
      back: "Replace each letter with its value (in brackets), then work out the answer using BIDMAS.",
    },
    {
      front: "BIDMAS — what order?",
      back: "Brackets → Indices (powers and roots) → Division and Multiplication (left to right) → Addition and Subtraction (left to right).",
    },
    {
      front: "3ab when a = 3 and b = 4",
      back: "3 × 3 × 4 = 36. Letters written together are multiplied.",
    },
    {
      front: "Class recap: 5b² when b = 4",
      back: "5 × 4² = 5 × 16 = 80 (not 20² = 400).",
    },
    {
      front: "2x² or (2x)² — which is bigger when x = 3?",
      back: "(2x)² = 6² = 36 is bigger than 2x² = 2 × 9 = 18. The power in 2x² touches only the x.",
    },
    {
      front: "Class recap: {{(b + 2)/3}} when b = 4",
      back: "The fraction line divides the whole top: (4 + 2) ÷ 3 = 2.",
    },
    {
      front: "If x = −3, what are x² and −x²?",
      back: "x² = (−3)² = 9, but −x² = −(9) = −9.",
    },
    {
      front: "Class recap: e³ when e = −3",
      back: "(−3) × (−3) × (−3) = 9 × (−3) = −27.",
    },
    {
      front: "Class recap: 8e² + 3 when e = −3",
      back: "Square first: (−3)² = 9. Then 8 × 9 + 3 = 75.",
    },
    {
      front: "Class recap: {{(2c - e)/4}} when c = 6 and e = −3",
      back: "Top first: 12 − (−3) = 15. Then {{15/4}} = 3.75.",
    },
    {
      front: "5 − (−3) = ?",
      back: "8. Subtracting a negative is the same as adding: 5 + 3.",
    },
    {
      front: "Class Task 2: y² + x(2w − T) when w = 7, T = −6, x = 4, y = −3",
      back: "(−3)² + 4 × (14 + 6) = 9 + 80 = 89.",
    },
    {
      front: "Class formula: {{K = 1/2 mv^2}} when m = 10 and v = 2",
      back: "{{1/2}} × 10 × 2² = 5 × 4 = 20 joules. Only the v is squared.",
    },
    {
      front: "What happens to a number between 0 and 1 when you square it, cube it, square-root it?",
      back: "Squared or cubed → smaller (0.5² = 0.25, 0.5³ = 0.125). Square-rooted → bigger ({{sqrt(0.25)}} = 0.5).",
    },
    {
      front: "What happens to a negative number when you square it, cube it, square-root it?",
      back: "Squared → positive. Cubed → negative. Square-rooted → not possible (no number times itself is negative).",
    },
    {
      front: "0.3² = ?",
      back: "0.09 — 3 × 3 = 9 with two decimal places (not 0.9).",
    },
  ],
  cram: [
    "Substitute: swap each letter for its value **in brackets**, then use BIDMAS.",
    "Letters together multiply: 3ab = 3 × a × b and 4(a + d) = 4 × (a + d).",
    "A power touches only its letter: 5b² = 5 × b² (b = 4 → 80, not 400), so 2x² ≠ (2x)².",
    "A fraction line or a √ sign groups everything: finish the whole top, or the whole inside, first.",
    "x = −3: x² = 9, −x² = −9, x³ = −27, 5 − x = 8.",
    "Minus a negative is plus: with c = 6 and e = −3, {{(2c - e)/4}} = {{(12 + 3)/4}} = {{15/4}} = 3.75.",
    "Formulae: write it → sub it → work it out → units. {{K = 1/2 mv^2}} with m = 10, v = 2 gives 20 J.",
    "Between 0 and 1: squaring and cubing shrink (0.5² = 0.25), rooting grows ({{sqrt(0.25)}} = 0.5). 0 and 1 stay the same.",
    "Negatives: even power → positive, odd power → negative, square root → not possible. √ means the positive root.",
    "Decimals: count the decimal places — 0.3² = 0.09 and 0.2³ = 0.008.",
  ],
};
