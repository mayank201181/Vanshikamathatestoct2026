import type { TopicGuide } from "../../types";

// Revision guide — Expressions (Unit 2).
// Every expansion/factorisation below was checked by substituting numbers.

export const GUIDE_EX: TopicGuide = {
  topic: "ex",
  sections: [
    // -----------------------------------------------------------------------
    // 1. Simplifying & like terms
    // -----------------------------------------------------------------------
    {
      id: "ex-simplify",
      topic: "ex",
      lesson: "Expanding Brackets",
      heading: "Like terms: what can (and can't) be collected",
      discovery: {
        problem:
          "Aisha simplifies 3x² + 4x³ − 4x² and gets 3x⁵. Wei Ling gets 4x³ − x². Instead of arguing about rules, test both answers: put x = 2 into the original expression and into each answer. Who is right?",
        idea:
          "With x = 2 the original is 3 × 4 + 4 × 8 − 4 × 4 = 12 + 32 − 16 = 28. Wei Ling's answer gives 32 − 4 = 28 ✓, but Aisha's gives 3 × 32 = 96 ✗. The x³ term and the x² terms are different kinds of thing (8 and 4 when x = 2), so they can't merge. Only the two x² terms combine: 3x² − 4x² = −x².",
      },
      body:
        "An **expression** is made of **terms** joined by + and − signs, like 3x² + 4x³ − 4x² + 7. A term is a number, a letter, or numbers and letters multiplied together. The number in front of the letters is the **coefficient**: in −4x² the coefficient is −4. A term with no letter (like 7) is a **constant**.\n\n" +
        "**Like terms** have *exactly* the same letters with the same powers. Only like terms can be added or subtracted — this is called **collecting like terms**.\n\n" +
        "| Like terms | Not like terms |\n" +
        "|---|---|\n" +
        "| 5x and −2x | 5x and 5x² |\n" +
        "| 3x² and −4x² | 3x² and 4x³ |\n" +
        "| 4ab and 2ba | 4ab and 4a |\n\n" +
        "**Why?** 5x means 5 lots of x, so 5x + 3x = 8x, just as 5 bags + 3 bags = 8 bags. But x² and x³ are different sizes: when x = 2, x² = 4 and x³ = 8. You can't count 4s and 8s as one pile, so 3x² + 4x³ can't become a single term — and it is certainly not 7x⁵. (ab and ba *are* like terms, because 3 × 5 = 5 × 3: the order of multiplying doesn't matter.)\n\n" +
        "**How to collect like terms**\n" +
        "1. Ring each term *together with the sign in front of it*.\n" +
        "2. Sort the terms into families: x³ terms, x² terms, x terms, numbers.\n" +
        "3. Add the coefficients in each family, and write the highest power first.\n\n" +
        "    3x² + 4x³ − 4x²\n" +
        "    = 4x³ + 3x² − 4x²\n" +
        "    = 4x³ − x²\n\n" +
        "We write 1x as x, and −1x² as −x².\n\n" +
        "**Multiplying is different.** You can multiply *any* terms, alike or not: multiply the numbers, then the letters.\n\n" +
        "| Adding (like terms only) | Multiplying (any terms) |\n" +
        "|---|---|\n" +
        "| x + x = 2x | x × x = x² |\n" +
        "| 2x + 3x = 5x | 2x × 3x = 6x² |\n" +
        "| 3a + 4b stays as it is | 3a × 4b = 12ab |\n\n" +
        "Dividing works like cancelling a fraction: {{12ab/4b}} = 3a, because 12 ÷ 4 = 3 and the b's cancel.\n\n" +
        "**How the class writes it:** 5 × n = 5n (number first), a × a = a², a × a × a = a³, and b × a = ab (letters in alphabetical order).",
      diagram: `<svg viewBox="0 0 460 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rod of length x, a square of side x and a cube of edge x, showing that x, x squared and x cubed are different kinds of quantity" font-family="sans-serif">
  <rect width="460" height="280" fill="#ffffff"/>
  <text x="230" y="26" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Different powers are different kinds of thing</text>
  <rect x="40" y="124" width="70" height="12" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
  <text x="75" y="116" text-anchor="middle" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <rect x="180" y="66" width="70" height="70" fill="#bbf7d0" stroke="#334155" stroke-width="1.5"/>
  <text x="215" y="153" text-anchor="middle" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="170" y="105" text-anchor="end" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <rect x="318" y="66" width="70" height="70" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <polygon points="318,66 388,66 412,46 342,46" fill="#fef3c7" stroke="#334155" stroke-width="1.5"/>
  <polygon points="388,66 412,46 412,116 388,136" fill="#fcd34d" stroke="#334155" stroke-width="1.5"/>
  <text x="353" y="153" text-anchor="middle" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="418" y="86" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="75" y="180" text-anchor="middle" font-size="13" fill="#1f2937">x is a length</text>
  <text x="215" y="180" text-anchor="middle" font-size="13" fill="#1f2937">x² is an area</text>
  <text x="365" y="180" text-anchor="middle" font-size="13" fill="#1f2937">x³ is a volume</text>
  <text x="230" y="214" text-anchor="middle" font-size="13" fill="#166534">x² + x² = 2x²  (same shape, so just count them)</text>
  <text x="230" y="238" text-anchor="middle" font-size="13" fill="#991b1b">x² + x³ is not x⁵  (different shapes stay separate)</text>
  <text x="230" y="266" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">So 3x² + 4x³ − 4x² = 4x³ − x²</text>
</svg>`,
      diagramCaption:
        "x, x² and x³ are a length, an area and a volume — different kinds of thing — so they can never be collected into one term.",
      workedExamples: [
        {
          title: "Squared and cubed terms (class objective)",
          problem: "Simplify 3x² + 4x³ − 4x².",
          steps: [
            "Ring each term with the sign in front of it: +3x², +4x³, −4x².",
            "Sort into families. The x³ family is just +4x³. The x² family is +3x² and −4x².",
            "Collect the x² family: 3x² − 4x² = −1x², which we write as −x². The 4x³ has nothing to join, so it stays.",
            "Write the highest power first: 4x³ − x².",
            "Check with x = 2: 3 × 4 + 4 × 8 − 4 × 4 = 28, and 4 × 8 − 4 = 28 ✓",
          ],
          answer: "4x³ − x²",
        },
        {
          title: "Two letters and some numbers",
          problem: "Simplify 6ab + 3a² + 5 − 2ba − a² + 4a − 8.",
          steps: [
            "ba means b × a, which is the same as a × b, so −2ba is a like term with 6ab.",
            "a² terms: 3a² − a² = 2a².",
            "ab terms: 6ab − 2ab = 4ab.",
            "a terms: just 4a. Numbers: 5 − 8 = −3.",
            "Check with a = 1 and b = 2: the question gives 12 + 3 + 5 − 4 − 1 + 4 − 8 = 11, and the answer gives 2 + 8 + 4 − 3 = 11 ✓",
          ],
          answer: "2a² + 4ab + 4a − 3",
        },
        {
          title: "Multiplying and dividing terms",
          problem: "Simplify (a) 2x × 3x (b) 3a × 4b (c) 12ab ÷ 4b (d) 2y × 5y²",
          steps: [
            "(a) Multiply the numbers: 2 × 3 = 6. Multiply the letters: x × x = x². So 2x × 3x = 6x².",
            "(b) 3 × 4 = 12 and a × b = ab, so 3a × 4b = 12ab. They aren't like terms, but you can still multiply them.",
            "(c) Write it as a fraction and cancel: in {{12ab/4b}}, 12 ÷ 4 = 3 and b ÷ b = 1, leaving 3a.",
            "(d) 2 × 5 = 10 and y × y² = y × y × y = y³, so 2y × 5y² = 10y³.",
          ],
          answer: "(a) 6x²  (b) 12ab  (c) 3a  (d) 10y³",
        },
      ],
      keyPoints: [
        "Like terms have exactly the same letters with the same powers: 5x² and −2x² are like terms, but 5x² and 5x are not.",
        "Collect like terms by adding their coefficients — the sign in front of a term belongs to that term.",
        "x² and x³ never combine: 3x² + 4x³ − 4x² = 4x³ − x² (not 3x⁵).",
        "Adding is not multiplying: x + x = 2x but x × x = x², and 2x × 3x = 6x².",
        "ab and ba are like terms, and dividing cancels like a fraction: 12ab ÷ 4b = 3a.",
      ],
      whyItWorks:
        "5x means 5 lots of x, so 5x + 3x is 8 lots of x — like 5 bags + 3 bags = 8 bags. But x² and x³ are different amounts (4 and 8 when x = 2), so they can't be counted as one pile. Multiplying is different: x × x = x² because a square with side x has area x².",
      memoryTrick:
        "The sign is the term's backpack: ring each term together with the sign in front of it, and the sign goes wherever the term goes. Then highlight each family (x³, x², x, numbers) in its own colour.",
      examTip:
        "Powers only change when you multiply. 3x² + 4x³ is NOT 7x⁵, and x² + x² is 2x², not x⁴. Keep the sign with its term too: in 3x² − 4x² the 4x² is being subtracted, so the answer is −x², not x².",
      thinkDeeper:
        "2x + 3y and 5xy both equal 5 when x = 1 and y = 1. So is 2x + 3y = 5xy a correct simplification? Test x = 2 and y = 3, and explain what this tells you about like terms.",
      quickChecks: [
        {
          question: "Simplify 5x² + 2x³ − 3x² + x³.",
          answer: { type: "expression", expr: "3x^3+2x^2", form: "simplified" },
          solution:
            "x³ terms: 2x³ + x³ = 3x³. x² terms: 5x² − 3x² = 2x². The x³ and x² terms can't be combined, so the answer is 3x³ + 2x².",
        },
        {
          question: "Simplify 4y × 3y − 5y².",
          answer: { type: "expression", expr: "7y^2", form: "simplified" },
          solution: "Multiply first: 4y × 3y = 12y² (4 × 3 = 12 and y × y = y²). Then collect: 12y² − 5y² = 7y².",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 2. Expanding single brackets
    // -----------------------------------------------------------------------
    {
      id: "ex-expand",
      topic: "ex",
      lesson: "Expanding Brackets",
      heading: "Expanding brackets: multiply every term inside",
      discovery: {
        problem:
          "Work out 3 × 23 in your head. Most people do 3 × 20 and 3 × 3, then add. Now use the same idea to write 3 × (2x + 5) without a bracket.",
        idea:
          "3 × 23 = 3 × 20 + 3 × 3 = 60 + 9 = 69 — you multiplied both parts of 23 by 3. In the same way, 3(2x + 5) = 3 × 2x + 3 × 5 = 6x + 15. That is all expanding is: the term outside multiplies every term inside.",
      },
      body:
        "To **expand** (or *multiply out*) a bracket, multiply the term outside by **every** term inside. 3(2x + 5) means 3 lots of (2x + 5):\n\n" +
        "    3(2x + 5) = 3 × 2x + 3 × 5 = 6x + 15\n\n" +
        "**The grid method** (the class method) keeps it organised. The outside term goes on the left; each term inside goes along the top *with its sign*:\n\n" +
        "| × | 2x | +5 |\n" +
        "|---|---|---|\n" +
        "| 3 | 6x | +15 |\n\n" +
        "**Why it works:** picture a rectangle 3 wide and (2x + 5) long. Cut it into two pieces with areas 3 × 2x = 6x and 3 × 5 = 15. Same rectangle, same area — so 3(2x + 5) and 6x + 15 are the same expression. It's the trick you use for 3 × 23 = 3 × 20 + 3 × 3.\n\n" +
        "**A letter outside** works the same way — multiply the letters too: x(2x + 1) = 2x² + x and 4x(x − 3) = 4x² − 12x.\n\n" +
        "**A negative outside.** The sign in front of a bracket belongs to the term outside. In 8k − 3(2k − 4) + 7 the outside term is **−3**, so\n\n" +
        "    (−3) × 2k = −6k   and   (−3) × (−4) = +12\n\n" +
        "giving −3(2k − 4) = −6k + 12. Same signs give +, different signs give −, so a minus outside flips the sign of every term inside: −6(7x − 9) = −42x + 54.\n\n" +
        "**Sums and differences of brackets.** Expand each bracket separately, then collect like terms:\n\n" +
        "    5(2x + 3) + 6(3x − 4) = 10x + 15 + 18x − 24 = 28x − 9\n" +
        "    x(2x + 1) − 3(2x − 4) = 2x² + x − 6x + 12 = 2x² − 5x + 12\n\n" +
        "**Check by substituting.** Put x = 1 into the question and into your answer. For 5(2x + 3) + 6(3x − 4): 5 × 5 + 6 × (−1) = 19, and 28 − 9 = 19 ✓. If the two numbers are different, there's a slip somewhere.\n\n" +
        "**In context:** a rectangle 5 cm wide and (3x + 7) cm long has area 5(3x + 7) = 15x + 35 cm². A triangle with base 2x and height (x + 5) has area {{1/2}} × 2x × (x + 5) = x(x + 5) = x² + 5x.",
      diagram: `<svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a rectangle 3 by (2x + 5) split into areas 6x and 15. Right: a grid for minus 3 times (2k minus 4) giving minus 6k plus 12" font-family="sans-serif">
  <rect width="480" height="250" fill="#ffffff"/>
  <text x="132" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Area model</text>
  <rect x="36" y="56" width="112" height="48" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
  <rect x="148" y="56" width="80" height="48" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <text x="92" y="48" text-anchor="middle" font-size="13" fill="#1f2937">2x</text>
  <text x="188" y="48" text-anchor="middle" font-size="13" fill="#1f2937">5</text>
  <text x="28" y="85" text-anchor="end" font-size="13" fill="#1f2937">3</text>
  <text x="92" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">6x</text>
  <text x="188" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">15</text>
  <text x="132" y="132" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">3(2x + 5) = 6x + 15</text>
  <text x="132" y="154" text-anchor="middle" font-size="12" fill="#334155">3 × 2x = 6x  and  3 × 5 = 15</text>
  <text x="365" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Grid method</text>
  <rect x="281" y="40" width="56" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="337" y="40" width="56" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="393" y="40" width="56" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="281" y="76" width="56" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="337" y="76" width="56" height="36" fill="#bbf7d0" stroke="#334155" stroke-width="1.5"/>
  <rect x="393" y="76" width="56" height="36" fill="#bbf7d0" stroke="#334155" stroke-width="1.5"/>
  <text x="309" y="63" text-anchor="middle" font-size="14" fill="#1f2937">×</text>
  <text x="365" y="63" text-anchor="middle" font-size="14" fill="#1f2937">2k</text>
  <text x="421" y="63" text-anchor="middle" font-size="14" fill="#1f2937">−4</text>
  <text x="309" y="99" text-anchor="middle" font-size="14" fill="#1f2937">−3</text>
  <text x="365" y="99" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">−6k</text>
  <text x="421" y="99" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">+12</text>
  <text x="365" y="132" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">−3(2k − 4) = −6k + 12</text>
  <text x="365" y="154" text-anchor="middle" font-size="12" fill="#334155">(−3) × (−4) = +12</text>
  <text x="240" y="196" text-anchor="middle" font-size="13" fill="#1f2937">The term outside multiplies EVERY term inside the bracket.</text>
  <text x="240" y="220" text-anchor="middle" font-size="12" fill="#334155">Signs: same signs give +, different signs give −</text>
</svg>`,
      diagramCaption:
        "Left: the area model shows why 3(2x + 5) = 6x + 15. Right: the class grid method with a negative outside, where (−3) × (−4) = +12.",
      workedExamples: [
        {
          title: "Class examples: one bracket",
          problem: "Expand (a) 3(2x + 5) (b) 4(5y − 3) + 3y",
          steps: [
            "(a) Grid: 3 × 2x = 6x and 3 × (+5) = +15. So 3(2x + 5) = 6x + 15.",
            "(b) Expand first: 4 × 5y = 20y and 4 × (−3) = −12, giving 20y − 12 + 3y.",
            "Then collect the y terms: 20y + 3y = 23y. So the answer is 23y − 12.",
            "Check (b) with y = 1: 4 × 2 + 3 = 11, and 23 − 12 = 11 ✓",
          ],
          answer: "(a) 6x + 15  (b) 23y − 12",
        },
        {
          title: "Class examples: watch the signs",
          problem: "Expand and simplify (a) 6k + 5 + 3(3 − 4k) (b) 8k − 3(2k − 4) + 7",
          steps: [
            "(a) 3 × 3 = 9 and 3 × (−4k) = −12k, so the expression becomes 6k + 5 + 9 − 12k.",
            "Collect: 6k − 12k = −6k and 5 + 9 = 14, giving −6k + 14.",
            "(b) The term outside the bracket is −3 (the minus belongs to it): (−3) × 2k = −6k and (−3) × (−4) = +12.",
            "So 8k − 6k + 12 + 7 = 2k + 19.",
            "Check (b) with k = 1: 8 − 3 × (−2) + 7 = 8 + 6 + 7 = 21, and 2 + 19 = 21 ✓",
          ],
          answer: "(a) −6k + 14 (or 14 − 6k)  (b) 2k + 19",
        },
        {
          title: "Sums and differences of brackets",
          problem: "Expand and simplify (a) 5(2x + 3) + 6(3x − 4) (b) x(2x + 1) − 3(2x − 4)",
          steps: [
            "(a) 5(2x + 3) = 10x + 15 and 6(3x − 4) = 18x − 24.",
            "Collect: 10x + 18x = 28x and 15 − 24 = −9, so the answer is 28x − 9.",
            "(b) x(2x + 1) = 2x² + x. In the second bracket the outside term is −3: (−3) × 2x = −6x and (−3) × (−4) = +12.",
            "So 2x² + x − 6x + 12 = 2x² − 5x + 12.",
            "Check (b) with x = 2: 2 × 5 − 3 × 0 = 10, and 8 − 10 + 12 = 10 ✓",
          ],
          answer: "(a) 28x − 9  (b) 2x² − 5x + 12",
        },
      ],
      keyPoints: [
        "Multiply the term outside by EVERY term inside: 3(2x + 5) = 6x + 15.",
        "A letter outside multiplies the letters too: 4x(x − 3) = 4x² − 12x.",
        "The sign in front of a bracket belongs to the outside term: −3(2k − 4) = −6k + 12.",
        "For sums and differences, expand each bracket, then collect like terms: 5(2x + 3) + 6(3x − 4) = 28x − 9.",
        "Check by substituting a small number (x = 1 or 2) into the question and into your answer.",
      ],
      whyItWorks:
        "Multiplication spreads over addition: 3 × 23 = 3 × 20 + 3 × 3. In a picture, a 3 by (2x + 5) rectangle splits into a 3 by 2x piece and a 3 by 5 piece, so its area is 6x + 15. A negative outside follows the same rule with negative numbers, and (−3) × (−4) = +12.",
      memoryTrick:
        "Rainbow arrows: draw an arc from the outside term to every term inside — one arrow per term, no term left behind. For the signs: same signs make +, different signs make −.",
      examTip:
        "The classic mark-loser is −3(2k − 4) = −6k − 12. The second product is (−3) × (−4) = +12, so the answer is −6k + 12. Also make sure you multiply the second term: 3(2x + 5) is 6x + 15, not 6x + 5.",
      thinkDeeper:
        "From the class worksheet: expand 2(9b − 13a), 3(2b − 11a), 4(3a − 5b), 5(2a − 3b), 6(3a − b) and 7(3a + 2b). Which three of them add up to zero? (The a-terms must total 0, and so must the b-terms.)",
      quickChecks: [
        {
          question: "Expand and simplify 4(5y + 4) − 3(y − 2).",
          answer: { type: "expression", expr: "17y+22", form: "simplified" },
          solution:
            "4(5y + 4) = 20y + 16. In the second bracket the outside term is −3: (−3) × y = −3y and (−3) × (−2) = +6. So 20y + 16 − 3y + 6 = 17y + 22.",
        },
        {
          question: "Expand and simplify 2x(x + 3) − x(x − 4).",
          answer: { type: "expression", expr: "x^2+10x", form: "simplified" },
          solution:
            "2x(x + 3) = 2x² + 6x. The outside term of the second bracket is −x: (−x) × x = −x² and (−x) × (−4) = +4x. Collect: 2x² − x² = x² and 6x + 4x = 10x, giving x² + 10x.",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 3. Factorising & identities
    // -----------------------------------------------------------------------
    {
      id: "ex-factorise",
      topic: "ex",
      lesson: "Factorising Single Brackets",
      heading: "Factorising fully, equivalence and identities (≡)",
      discovery: {
        problem:
          "Marcus, Priya and Zara were asked to factorise 6x² + 9x. Marcus wrote 3(2x² + 3x), Priya wrote x(6x + 9) and Zara wrote 3x(2x + 3). Expand all three. Are they all correct? Whose answer gets full marks for “factorise fully”, and why?",
        idea:
          "All three expand back to 6x² + 9x, so they are all equivalent. But only Zara's is fully factorised: she took out the HCF of the numbers (3) AND the common letter (x). Marcus left an x in both terms inside his bracket; Priya left 6 and 9 inside, and they still share a 3.",
      },
      body:
        "**Factorising** is expanding in reverse: you take a common factor *out* of every term and put what's left inside a bracket.\n\n" +
        "    3x(2x + 3) → expand → 6x² + 9x\n" +
        "    6x² + 9x → factorise → 3x(2x + 3)\n\n" +
        "**Method: take out the HCF**\n" +
        "1. Find the HCF of the **numbers** (for 6x² + 9x, the HCF of 6 and 9 is 3).\n" +
        "2. Find the **letters** that are in *every* term (both terms contain x).\n" +
        "3. Write the HCF outside a bracket: 3x( … ).\n" +
        "4. Divide each term by it to fill the bracket: 6x² ÷ 3x = 2x and 9x ÷ 3x = 3.\n" +
        "5. **Check** by expanding — you must get back exactly what you started with.\n\n" +
        "**“Factorise fully”** means nothing common is left inside the bracket. All three of these expand to 6x² + 9x, but only one is fully factorised:\n\n" +
        "| Answer | Fully factorised? |\n" +
        "|---|---|\n" +
        "| 3(2x² + 3x) | No: x is still in both terms |\n" +
        "| x(6x + 9) | No: 6 and 9 still share 3 |\n" +
        "| 3x(2x + 3) | Yes |\n\n" +
        "More class examples: 4x + 6 = 2(2x + 3), 22a + 55 = 11(2a + 5), 25y − 35z = 5(5y − 7z) and w² − 5w = w(w − 5). If the HCF is a whole term, a 1 is left behind: 2y² + 2y = 2y(y + 1).\n\n" +
        "**Equivalent forms.** Unsimplified, expanded and factorised versions of an expression are **equivalent** — they give the same value for every x:\n\n" +
        "    2(x + 3) + 4x  ≡  6x + 6  ≡  6(x + 1)\n\n" +
        "**Identity or equation?** The symbol **≡** means “is identical to”. An **identity** is true for **every** value of the letter: 3(x + 2) ≡ 3x + 6. An **equation** is only true for particular values: 3x + 6 = 21 is only true when x = 5. To show that something is an identity, expand and simplify both sides until they match. To show it is *not*, one value that makes the two sides different is enough.\n\n" +
        "**Area link.** If a rectangle has area 6x² + 9x and one side is 3x, factorising tells you the other side: 2x + 3 (see the diagram).",
      diagram: `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Factorising 6x squared plus 9x with an area rectangle: the areas 6x squared and 9x share a side of 3x, so the other sides are 2x and 3, giving 3x(2x + 3)" font-family="sans-serif">
  <rect width="460" height="240" fill="#ffffff"/>
  <text x="230" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Factorising = the grid backwards</text>
  <rect x="60" y="64" width="80" height="120" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
  <rect x="140" y="64" width="40" height="120" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <text x="100" y="129" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">6x²</text>
  <text x="160" y="129" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">9x</text>
  <text x="100" y="56" text-anchor="middle" font-size="13" font-weight="bold" fill="#b45309">2x</text>
  <text x="160" y="56" text-anchor="middle" font-size="13" font-weight="bold" fill="#b45309">3</text>
  <text x="52" y="129" text-anchor="end" font-size="13" font-weight="bold" fill="#b45309">3x</text>
  <text x="205" y="66" font-size="13" fill="#1f2937">Start with the areas: 6x² + 9x</text>
  <text x="205" y="92" font-size="13" fill="#1f2937">1. HCF of 6 and 9 is 3</text>
  <text x="205" y="114" font-size="13" fill="#1f2937">2. Both terms contain x</text>
  <text x="205" y="136" font-size="13" fill="#1f2937">3. Take out 3x (the shared side)</text>
  <text x="205" y="158" font-size="13" fill="#1f2937">4. 6x² ÷ 3x = 2x and 9x ÷ 3x = 3</text>
  <text x="205" y="192" font-size="14" font-weight="bold" fill="#1f2937">6x² + 9x = 3x(2x + 3)</text>
  <text x="205" y="216" font-size="12" fill="#334155">Check: 3x × 2x = 6x² and 3x × 3 = 9x</text>
</svg>`,
      diagramCaption:
        "Factorising runs the grid backwards: the HCF 3x is the side both areas share, and dividing each area by it gives the other sides, 2x and 3 (orange). Drawn to scale for x = 3.",
      workedExamples: [
        {
          title: "Take out the HCF of the numbers",
          problem: "Factorise (a) 4x + 6 (b) 22a + 55 (c) 25y − 35z",
          steps: [
            "(a) The HCF of 4 and 6 is 2. 4x ÷ 2 = 2x and 6 ÷ 2 = 3, so 4x + 6 = 2(2x + 3).",
            "(b) The HCF of 22 and 55 is 11. 22a ÷ 11 = 2a and 55 ÷ 11 = 5, so 22a + 55 = 11(2a + 5).",
            "(c) The HCF of 25 and 35 is 5. 25y ÷ 5 = 5y and 35z ÷ 5 = 7z, so 25y − 35z = 5(5y − 7z). The minus sign stays inside the bracket.",
            "Check (c) by expanding: 5 × 5y = 25y and 5 × (−7z) = −35z ✓",
          ],
          answer: "(a) 2(2x + 3)  (b) 11(2a + 5)  (c) 5(5y − 7z)",
        },
        {
          title: "Factorise fully: numbers AND letters",
          problem: "Factorise fully (a) w² − 5w (b) 6x² + 9x (c) 8p² − 12p",
          steps: [
            "(a) There's no common number, but both terms contain w. w² ÷ w = w and 5w ÷ w = 5, so w² − 5w = w(w − 5).",
            "(b) The HCF of 6 and 9 is 3, and both terms contain x, so take out 3x: 6x² ÷ 3x = 2x and 9x ÷ 3x = 3. Answer: 3x(2x + 3).",
            "(c) The HCF of 8 and 12 is 4, and both terms contain p, so take out 4p: 8p² ÷ 4p = 2p and 12p ÷ 4p = 3. Answer: 4p(2p − 3).",
            "Why not 2p(4p − 6)? Look inside the bracket: 4p and 6 still share a factor of 2, so it isn't fully factorised.",
            "Check (c) with p = 2: 8 × 4 − 12 × 2 = 32 − 24 = 8, and 4 × 2 × (4 − 3) = 8 ✓",
          ],
          answer: "(a) w(w − 5)  (b) 3x(2x + 3)  (c) 4p(2p − 3)",
        },
        {
          title: "Identity or equation?",
          problem:
            "Is each statement an identity (true for every value of x) or an equation (true only for some values)? (a) 4(x + 3) = 4x + 12 (b) 4(x + 3) = 20 (c) 5(x + 2) − 2x = 3(x + 3) + 1",
          steps: [
            "(a) Expanding the left side gives 4x + 12, exactly the right side. It's true for every x, so it is an identity: 4(x + 3) ≡ 4x + 12.",
            "(b) Try x = 0: 4 × 3 = 12, not 20 ✗ — so it is not true for every x. Expanding gives 4x + 12 = 20, so 4x = 8 and x = 2: it is true only when x = 2, so it is an equation.",
            "(c) Left side: 5x + 10 − 2x = 3x + 10. Right side: 3x + 9 + 1 = 3x + 10.",
            "Both sides simplify to 3x + 10, so (c) is an identity: 5(x + 2) − 2x ≡ 3(x + 3) + 1.",
          ],
          answer: "(a) identity  (b) equation (true only when x = 2)  (c) identity",
        },
      ],
      keyPoints: [
        "Factorising is expanding in reverse: 6x² + 9x = 3x(2x + 3).",
        "Take out the HCF of the numbers AND any letter that is in every term: w² − 5w = w(w − 5).",
        "Fully factorised means nothing common is left inside the bracket — 3(2x² + 3x) is not fully factorised.",
        "Always check by expanding your answer back out.",
        "≡ means identical for every value (an identity), e.g. 3(x + 2) ≡ 3x + 6; an equation is only true for some values.",
      ],
      whyItWorks:
        "Expanding uses a(b + c) = ab + ac. Read it backwards — ab + ac = a(b + c) — and that's factorising: if every term contains the factor a, you can take it out once and leave the rest in the bracket. Taking out the *highest* common factor means nothing shared is left behind.",
      memoryTrick:
        "HCF out, leftovers in, expand to check. Outside the bracket goes what every term shares; inside goes what each term has left over.",
      examTip:
        "Read the word *fully*. 3(2x² + 3x) is equivalent to 6x² + 9x but isn't fully factorised, so it loses a mark. Before you finish, look inside your bracket: if the terms still share a number or a letter, take it out too. And if a whole term is taken out, a 1 is left: 2y² + 2y = 2y(y + 1), not 2y(y).",
      thinkDeeper:
        "x(x + 2) and x² + 2 both give 3 when x = 1. Are they identical? Try x = 0 and x = 3. Why can a single number prove that two expressions are *not* identical, while checking lots of numbers can never quite prove that they are?",
      quickChecks: [
        {
          question: "Factorise fully 10x² − 15x.",
          answer: { type: "expression", expr: "5x(2x-3)", form: "factorised" },
          solution:
            "The HCF of 10 and 15 is 5, and both terms contain x, so take out 5x: 10x² ÷ 5x = 2x and 15x ÷ 5x = 3. Answer: 5x(2x − 3). Check: 5x × 2x − 5x × 3 = 10x² − 15x ✓",
        },
        {
          question: "Factorise fully 4y² + 2y.",
          answer: { type: "expression", expr: "2y(2y+1)", form: "factorised" },
          solution:
            "The HCF of 4 and 2 is 2, and both terms contain y, so take out 2y: 4y² ÷ 2y = 2y and 2y ÷ 2y = 1. Answer: 2y(2y + 1) — don't forget the 1!",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 4. Expanding double brackets
    // -----------------------------------------------------------------------
    {
      id: "ex-double",
      topic: "ex",
      lesson: "Expanding Double Brackets",
      heading: "Double brackets with the grid",
      discovery: {
        problem:
          "Work out 23 × 14 by splitting the numbers: 23 = 20 + 3 and 14 = 10 + 4. How many separate multiplications do you need? Then try (x + 3)(x + 4) the same way.",
        idea:
          "Four: 20 × 10 = 200, 20 × 4 = 80, 3 × 10 = 30 and 3 × 4 = 12, which total 322. Double brackets also need four products: x × x = x², x × 4 = 4x, 3 × x = 3x and 3 × 4 = 12, so (x + 3)(x + 4) = x² + 7x + 12. If you only find two products, you've missed half of the rectangle!",
      },
      body:
        "To expand two brackets, **every term in the first bracket multiplies every term in the second**. Two terms × two terms gives **four** products; then you collect the like terms.\n\n" +
        "**The grid method.** Put one bracket down the side and the other along the top, each term *with its sign*:\n\n" +
        "| × | x | +4 |\n" +
        "|---|---|---|\n" +
        "| x | x² | +4x |\n" +
        "| +3 | +3x | +12 |\n\n" +
        "    (x + 3)(x + 4) = x² + 4x + 3x + 12 = x² + 7x + 12\n\n" +
        "The two middle cells (4x and 3x) are like terms, so they combine.\n\n" +
        "**Why four pieces?** It's how you multiply 23 × 14 with a grid: (20 + 3)(10 + 4) = 200 + 80 + 30 + 12 = 322. With letters, the grid is the area of a rectangle cut into four parts — see the diagram.\n\n" +
        "**Negatives and coefficients** — the class example (2x + 3)(3x − 4):\n\n" +
        "| × | 3x | −4 |\n" +
        "|---|---|---|\n" +
        "| 2x | 6x² | −8x |\n" +
        "| +3 | +9x | −12 |\n\n" +
        "    6x² − 8x + 9x − 12 = 6x² + x − 12\n\n" +
        "**Squaring a bracket.** (2x − 3)² means (2x − 3)(2x − 3), so write it out twice and use the grid. The four cells are 4x², −6x, −6x and +9:\n\n" +
        "    (2x − 3)² = 4x² − 6x − 6x + 9 = 4x² − 12x + 9\n\n" +
        "It is **not** 4x² + 9: squaring each term separately misses the two middle cells. Test x = 1: (2 − 3)² = 1 and 4 − 12 + 9 = 1 ✓, but 4 + 9 = 13 ✗.\n\n" +
        "**Another path: FOIL.** For (a + b)(c + d), multiply the **F**irst terms, **O**uter terms, **I**nner terms and **L**ast terms: ac + ad + bc + bd. It's the same four products and is quicker for simple brackets, but the grid is safer with negatives, because every sign sits on an edge where you can see it.\n\n" +
        "**Area problems.** A rectangle with sides (x + 4) cm and (x + 2) cm has area (x + 4)(x + 2) = x² + 6x + 8 cm². For a border or a shaded region, work out the big area and subtract the small one.",
      diagram: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Left: a rectangle (x + 4) by (x + 2) split into four areas x squared, 4x, 2x and 8. Right: a grid for (2x + 3)(3x − 4) with cells 6x squared, −8x, +9x and −12" font-family="sans-serif">
  <rect width="480" height="270" fill="#ffffff"/>
  <text x="116" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Area: (x + 4)(x + 2)</text>
  <rect x="50" y="50" width="84" height="84" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
  <rect x="134" y="50" width="48" height="84" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <rect x="50" y="134" width="84" height="24" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <rect x="134" y="134" width="48" height="24" fill="#fecaca" stroke="#334155" stroke-width="1.5"/>
  <text x="92" y="44" text-anchor="middle" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="158" y="44" text-anchor="middle" font-size="13" fill="#1f2937">4</text>
  <text x="42" y="97" text-anchor="end" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="42" y="151" text-anchor="end" font-size="13" fill="#1f2937">2</text>
  <text x="92" y="97" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">x²</text>
  <text x="158" y="97" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">4x</text>
  <text x="92" y="151" text-anchor="middle" font-size="13" font-weight="bold" fill="#1f2937">2x</text>
  <text x="158" y="151" text-anchor="middle" font-size="13" font-weight="bold" fill="#1f2937">8</text>
  <text x="116" y="186" text-anchor="middle" font-size="13" fill="#1f2937">= x² + 4x + 2x + 8</text>
  <text x="116" y="210" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">= x² + 6x + 8</text>
  <text x="365" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">Grid: (2x + 3)(3x − 4)</text>
  <rect x="278" y="40" width="58" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="336" y="40" width="58" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="394" y="40" width="58" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="278" y="76" width="58" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="336" y="76" width="58" height="36" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
  <rect x="394" y="76" width="58" height="36" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <rect x="278" y="112" width="58" height="36" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
  <rect x="336" y="112" width="58" height="36" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <rect x="394" y="112" width="58" height="36" fill="#fecaca" stroke="#334155" stroke-width="1.5"/>
  <text x="307" y="63" text-anchor="middle" font-size="14" fill="#1f2937">×</text>
  <text x="365" y="63" text-anchor="middle" font-size="14" fill="#1f2937">3x</text>
  <text x="423" y="63" text-anchor="middle" font-size="14" fill="#1f2937">−4</text>
  <text x="307" y="99" text-anchor="middle" font-size="14" fill="#1f2937">2x</text>
  <text x="365" y="99" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">6x²</text>
  <text x="423" y="99" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">−8x</text>
  <text x="307" y="135" text-anchor="middle" font-size="14" fill="#1f2937">+3</text>
  <text x="365" y="135" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">+9x</text>
  <text x="423" y="135" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">−12</text>
  <text x="365" y="186" text-anchor="middle" font-size="13" fill="#1f2937">= 6x² − 8x + 9x − 12</text>
  <text x="365" y="210" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">= 6x² + x − 12</text>
  <text x="240" y="250" text-anchor="middle" font-size="12" fill="#334155">Same colour = like terms. Collect them to finish.</text>
</svg>`,
      diagramCaption:
        "Left: four areas make (x + 4)(x + 2) = x² + 6x + 8 (drawn to scale for x = 7). Right: the grid for the class example — the two yellow cells are like terms.",
      workedExamples: [
        {
          title: "Area of a rectangle",
          problem: "A rectangle has sides (x + 4) cm and (x + 2) cm. Write an expression for its area, fully expanded.",
          steps: [
            "Area = length × width = (x + 4)(x + 2).",
            "Grid cells: x × x = x², x × 2 = 2x, 4 × x = 4x and 4 × 2 = 8.",
            "Add the four cells: x² + 2x + 4x + 8.",
            "Collect the x terms: 2x + 4x = 6x.",
            "Check with x = 1: the sides are 5 cm and 3 cm, so the area is 15 cm², and 1 + 6 + 8 = 15 ✓",
          ],
          answer: "x² + 6x + 8 cm²",
        },
        {
          title: "Class example with a negative",
          problem: "Expand and simplify (2x + 3)(3x − 4).",
          steps: [
            "Edges of the grid: 2x and +3 down the side, 3x and −4 along the top.",
            "Cells: 2x × 3x = 6x², 2x × (−4) = −8x, 3 × 3x = +9x and 3 × (−4) = −12.",
            "Collect the x terms: −8x + 9x = +1x, which we write as just x.",
            "So (2x + 3)(3x − 4) = 6x² + x − 12.",
            "Check with x = 2: 7 × 2 = 14, and 24 + 2 − 12 = 14 ✓",
          ],
          answer: "6x² + x − 12",
        },
        {
          title: "Squaring a bracket (class example)",
          problem: "Expand and simplify (2x − 3)².",
          steps: [
            "Squared means multiplied by itself: (2x − 3)² = (2x − 3)(2x − 3).",
            "Cells: 2x × 2x = 4x², 2x × (−3) = −6x, (−3) × 2x = −6x and (−3) × (−3) = +9.",
            "Collect the x terms: −6x − 6x = −12x.",
            "So (2x − 3)² = 4x² − 12x + 9.",
            "Check with x = 1: (2 − 3)² = (−1)² = 1, and 4 − 12 + 9 = 1 ✓. The wrong answer 4x² + 9 would give 13.",
          ],
          answer: "4x² − 12x + 9",
        },
      ],
      keyPoints: [
        "Every term in the first bracket multiplies every term in the second: 2 × 2 = 4 products.",
        "Use the grid with each term's sign on the edge, then collect the like terms (usually the two x terms).",
        "(2x + 3)(3x − 4) = 6x² − 8x + 9x − 12 = 6x² + x − 12.",
        "A squared bracket is two brackets: (2x − 3)² = (2x − 3)(2x − 3) = 4x² − 12x + 9.",
        "Check with x = 1 or 2: the question and your answer must give the same number.",
      ],
      whyItWorks:
        "Each bracket is a length made of two parts, so the rectangle they make splits into 2 × 2 = 4 smaller rectangles. Adding the four areas gives the expansion — exactly like the grid for 23 × 14 = (20 + 3)(10 + 4) = 200 + 80 + 30 + 12.",
      memoryTrick:
        "FOIL — First, Outer, Inner, Last — names the four products in (a + b)(c + d). But draw the grid whenever there are negatives: every sign sits on an edge where you can see it. Count your cells: four products before you collect.",
      examTip:
        "(2x − 3)² is NOT 4x² + 9 (and not 4x² − 9). Write the bracket out twice, (2x − 3)(2x − 3), and fill in all four grid cells: the two middle cells give −6x − 6x = −12x, and (−3) × (−3) = +9.",
      thinkDeeper:
        "Expand (x + 5)(x − 5) and (x + 1)(x − 1). What happens to the x terms, and why? Use the pattern to work out 101 × 99 in your head. (Hint: 101 = 100 + 1.)",
      quickChecks: [
        {
          question: "Expand and simplify (x + 5)(x − 3).",
          answer: { type: "expression", expr: "x^2+2x-15", form: "simplified" },
          solution:
            "Grid cells: x × x = x², x × (−3) = −3x, 5 × x = 5x and 5 × (−3) = −15. Collect −3x + 5x = 2x, giving x² + 2x − 15.",
        },
        {
          question: "Expand and simplify (3x − 2)².",
          answer: { type: "expression", expr: "9x^2-12x+4", form: "simplified" },
          solution:
            "Write it as (3x − 2)(3x − 2). Grid cells: 9x², −6x, −6x and +4. Collect −6x − 6x = −12x, giving 9x² − 12x + 4 (not 9x² + 4).",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 5. Forming expressions
    // -----------------------------------------------------------------------
    {
      id: "ex-forming",
      topic: "ex",
      lesson: "Algebraic Magic Squares",
      heading: "Forming expressions: shapes, angles and number puzzles",
      discovery: {
        problem:
          "Think of a number. Double it. Add 10. Halve the result. Subtract the number you first thought of. Try it with 3, then 7, then 100. What do you notice? Can you explain why it always happens?",
        idea:
          "You always finish on 5. Call the number n: doubling gives 2n, adding 10 gives 2n + 10, halving gives n + 5, and subtracting n leaves 5. The n cancels out, so it works for every number. Forming an expression turns “it worked for my examples” into a proof.",
      },
      body:
        "**Forming** an expression means turning words, shapes or puzzles into algebra. Choose a letter for the unknown, then build the expression one step at a time, in the order things happen.\n\n" +
        "| Words | Expression |\n" +
        "|---|---|\n" +
        "| 5 more than n | n + 5 |\n" +
        "| 5 less than n | n − 5 |\n" +
        "| subtract n from 10 | 10 − n |\n" +
        "| double n, then add 3 | 2n + 3 |\n" +
        "| add 3, then double | 2(n + 3) |\n" +
        "| half of n | {{n/2}} |\n" +
        "| n squared | n² |\n\n" +
        "Order matters for − and ÷, and you need **brackets** when a whole expression is multiplied: “add 3, then double” is 2(n + 3) = 2n + 6, not 2n + 3.\n\n" +
        "**Stuck? Try a number first.** Ask “if the number were 10, what would I do?”, then repeat exactly the same steps with the letter. *Pens cost p pence each, and Ravi pays for 4 pens with a £5 note.* With p = 50 his change is 500 − 4 × 50 pence, so in general it is **500 − 4p** pence.\n\n" +
        "**Shapes**\n" +
        "- **Perimeter:** add all the sides, then simplify. A rectangle (2x + 3) by x has perimeter 2(2x + 3) + 2x = 6x + 6.\n" +
        "- **Area of a rectangle:** length × width, then expand: x(2x + 3) = 2x² + 3x.\n" +
        "- **Area of a triangle:** {{1/2}} × base × height.\n\n" +
        "**Angles:** angles in a triangle add up to 180°, angles on a straight line add up to 180°, and angles around a point add up to 360°. Write the sum of the angles, simplify it, and set it equal to the right total.\n\n" +
        "**Number puzzles:** three consecutive whole numbers are n, n + 1 and n + 2. Their sum is 3n + 3 = 3(n + 1), which proves that the sum of any three consecutive numbers is a multiple of 3.\n\n" +
        "**Algebraic magic squares:** every row, column and diagonal has the same total. Add one complete line to find the magic total, then subtract to find a missing cell. Every line in this square adds up to 6x (try x = 5 to get a number magic square with total 30):\n\n" +
        "| Left | Middle | Right |\n" +
        "|---|---|---|\n" +
        "| 2x + 1 | x − 1 | 3x |\n" +
        "| 3x − 1 | 2x | x + 1 |\n" +
        "| x | 3x + 1 | 2x − 1 |",
      diagram: `<svg viewBox="0 0 480 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top: a rectangle (2x + 3) by x with perimeter 6x + 6 and area 2x squared + 3x. Bottom: a triangle with angles x, 2x and x + 20, which add to 4x + 20 = 180, so x = 40" font-family="sans-serif">
  <rect width="480" height="310" fill="#ffffff"/>
  <rect x="30" y="40" width="150" height="60" fill="#bae6fd" stroke="#334155" stroke-width="1.5"/>
  <text x="105" y="32" text-anchor="middle" font-size="13" fill="#1f2937">2x + 3</text>
  <text x="22" y="75" text-anchor="end" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="205" y="48" font-size="13" fill="#1f2937">Perimeter: add all four sides</text>
  <text x="205" y="70" font-size="13" fill="#1f2937">(2x + 3) + x + (2x + 3) + x = 6x + 6</text>
  <text x="205" y="98" font-size="13" fill="#1f2937">Area: length × width</text>
  <text x="205" y="120" font-size="13" fill="#1f2937">x(2x + 3) = 2x² + 3x</text>
  <line x1="20" y1="148" x2="460" y2="148" stroke="#cbd5e1" stroke-width="1"/>
  <polygon points="30,290 200,290 144.5,193.9" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
  <path d="M48,290 A18,18 0 0,0 43.8,278.4" fill="none" stroke="#334155" stroke-width="1.2"/>
  <path d="M182,290 A18,18 0 0,1 191,274.4" fill="none" stroke="#334155" stroke-width="1.2"/>
  <path d="M130.7,205.5 A18,18 0 0,0 153.5,209.5" fill="none" stroke="#334155" stroke-width="1.2"/>
  <text x="60" y="284" text-anchor="middle" font-size="13" font-style="italic" fill="#1f2937">x</text>
  <text x="160" y="276" text-anchor="middle" font-size="13" fill="#1f2937">x + 20</text>
  <text x="139" y="230" text-anchor="middle" font-size="13" fill="#1f2937">2x</text>
  <text x="225" y="200" font-size="13" fill="#1f2937">Angles in a triangle add up to 180°</text>
  <text x="225" y="224" font-size="13" fill="#1f2937">x + 2x + (x + 20) = 4x + 20</text>
  <text x="225" y="248" font-size="13" fill="#1f2937">4x + 20 = 180</text>
  <text x="225" y="272" font-size="13" fill="#1f2937">4x = 160, so x = 40</text>
  <text x="225" y="296" font-size="13" fill="#1f2937">The angles are 40°, 80° and 60°</text>
</svg>`,
      diagramCaption:
        "Forming expressions from shapes: add the sides for the perimeter, multiply for the area, and use an angle fact to make an equation. The angles are in degrees, and the triangle is drawn accurately for x = 40.",
      workedExamples: [
        {
          title: "Perimeter and area",
          problem:
            "(a) An isosceles triangle has two sides of (2x + 5) cm and a base of (x − 3) cm. Write a simplified expression for its perimeter. (b) A rectangle is 4x cm long and (x − 3) cm wide. Write an expression for its area.",
          steps: [
            "(a) Perimeter = add all three sides: (2x + 5) + (2x + 5) + (x − 3).",
            "Collect: 2x + 2x + x = 5x and 5 + 5 − 3 = 7, so the perimeter is 5x + 7 cm.",
            "(b) Area = length × width = 4x(x − 3). Expand: 4x × x = 4x² and 4x × (−3) = −12x.",
            "So the area is 4x² − 12x cm².",
            "Check (a) with x = 4: the sides are 13, 13 and 1 cm, which total 27 cm, and 5 × 4 + 7 = 27 ✓",
          ],
          answer: "(a) 5x + 7 cm  (b) 4x² − 12x cm²",
        },
        {
          title: "Angles on a straight line",
          problem:
            "Two angles on a straight line are (3x + 15)° and (2x − 5)°. (a) Write a simplified expression for their sum. (b) Find x and the size of each angle.",
          steps: [
            "(a) Sum = (3x + 15) + (2x − 5) = 5x + 10.",
            "(b) Angles on a straight line add up to 180°, so 5x + 10 = 180.",
            "Take 10 from both sides: 5x = 170. Divide by 5: x = 34.",
            "The angles are 3 × 34 + 15 = 117° and 2 × 34 − 5 = 63°.",
            "Check: 117 + 63 = 180 ✓",
          ],
          answer: "(a) 5x + 10  (b) x = 34, so the angles are 117° and 63°",
        },
        {
          title: "Algebraic magic square",
          problem:
            "In a 3 × 3 algebraic magic square, every row, column and diagonal has the same total. The top row is 3x + 1, x − 1, 2x + 3 and the centre square is 2x + 1. Find (a) the magic total (b) the bottom-right square (c) the bottom-left square (d) the middle-left square.",
          steps: [
            "(a) Add the top row: (3x + 1) + (x − 1) + (2x + 3) = 6x + 3.",
            "(b) The diagonal from top-left to bottom-right has (3x + 1) + (2x + 1) = 5x + 2 so far, so the bottom-right square is (6x + 3) − (5x + 2) = x + 1.",
            "(c) The other diagonal has (2x + 3) + (2x + 1) = 4x + 4 so far, so the bottom-left square is (6x + 3) − (4x + 4) = 2x − 1.",
            "(d) The left column has (3x + 1) + (2x − 1) = 5x so far, so the middle-left square is (6x + 3) − 5x = x + 3.",
            "Check with x = 3: the top row is 10, 2, 9 (total 21 = 6 × 3 + 3), and the diagonals are 10 + 7 + 4 = 21 and 9 + 7 + 5 = 21 ✓",
          ],
          answer: "(a) 6x + 3  (b) x + 1  (c) 2x − 1  (d) x + 3",
        },
      ],
      keyPoints: [
        "Choose a letter for the unknown and build the expression step by step, in the order the words happen.",
        "Order matters for − and ÷: “5 less than n” is n − 5, and “subtract n from 10” is 10 − n.",
        "Use brackets when a whole expression is multiplied: “add 3, then double” is 2(n + 3).",
        "Perimeter: add all the sides. Area of a rectangle: length × width. Angles: a triangle or a straight line makes 180°, a full turn makes 360°.",
        "Stuck? Do it with a real number first, then repeat exactly the same steps with the letter.",
      ],
      whyItWorks:
        "A letter stands for *any* number, so an expression is a rule that works for every case at once. That's why algebra can prove things — like the think-of-a-number trick always ending on 5 — that trying examples can only suggest.",
      memoryTrick:
        "Number first, letter second: if you can't see the algebra, do the problem with a real number like 10, then repeat exactly the same steps with the letter.",
      examTip:
        "Use brackets when an operation applies to a whole expression: “add 3, then multiply by 4” is 4(n + 3) = 4n + 12, not 4n + 3. Give perimeters fully simplified (6x + 6, not a list of sides), and write units such as cm, cm² or ° when the question uses them.",
      thinkDeeper:
        "Three consecutive numbers always add up to a multiple of 3, because n + (n + 1) + (n + 2) = 3(n + 1). Do four consecutive numbers always add up to a multiple of 4? Decide *always, sometimes or never*, and prove it with algebra. (Start with n, n + 1, n + 2, n + 3.)",
      quickChecks: [
        {
          question:
            "A rectangle has length (3x + 2) cm and width 4 cm. Write an expression for its perimeter in its simplest form, without brackets.",
          answer: { type: "expression", expr: "6x+12", form: "simplified" },
          solution:
            "Perimeter = (3x + 2) + 4 + (3x + 2) + 4. Collect: 3x + 3x = 6x and 2 + 4 + 2 + 4 = 12, so the perimeter is 6x + 12 cm.",
        },
        {
          question:
            "I think of a number n. I add 3, multiply the result by 4, then subtract 2n. Write a simplified expression (without brackets) for my answer.",
          answer: { type: "expression", expr: "2n+12", form: "simplified" },
          solution:
            "Add 3: n + 3. Multiply by 4: 4(n + 3) = 4n + 12. Subtract 2n: 4n + 12 − 2n = 2n + 12. Check with n = 1: 4 × 4 − 2 = 14, and 2 + 12 = 14 ✓",
        },
      ],
    },
  ],
  flashcards: [
    {
      front: "Term",
      back: "One part of an expression: a number, a letter, or numbers and letters multiplied together, e.g. 5x, −3y² or 7. Terms are separated by + and − signs.",
    },
    {
      front: "Expression",
      back: "Terms joined by + and − with no equals sign, e.g. 3x² + 4x − 1. You can simplify, expand or factorise an expression, but you can't solve it.",
    },
    {
      front: "Equation",
      back: "Two sides joined by = that are only equal for certain values: 3x + 6 = 21 is true only when x = 5. You solve an equation.",
    },
    {
      front: "Identity (≡)",
      back: "A statement that is true for EVERY value of the letter, e.g. 3(x + 2) ≡ 3x + 6. The symbol ≡ means “is identical to”.",
    },
    {
      front: "Coefficient",
      back: "The number multiplying the letters in a term: in 7x² − 3x, the coefficient of x² is 7 and the coefficient of x is −3.",
    },
    {
      front: "Like terms",
      back: "Terms with exactly the same letters and powers, e.g. 4x² and −x², or 3ab and 2ba. 4x² and 4x are NOT like terms. Only like terms can be added or subtracted.",
    },
    {
      front: "Simplify 3x² + 4x³ − 4x²",
      back: "4x³ − x². The x² terms combine (3x² − 4x² = −x²); the x³ term stays separate.",
    },
    {
      front: "x + x compared with x × x",
      back: "x + x = 2x (adding two lots of x), but x × x = x² (multiplying). In the same way, 2x × 3x = 6x².",
    },
    {
      front: "Expand",
      back: "Multiply out the brackets: the term outside multiplies EVERY term inside, e.g. 3(2x + 5) = 6x + 15.",
    },
    {
      front: "Expand −3(2k − 4)",
      back: "−6k + 12, because (−3) × (−4) = +12. The classic slip is −6k − 12.",
    },
    {
      front: "Factorise",
      back: "The reverse of expanding: take out the highest common factor (HCF) and put what's left in a bracket, e.g. 4x + 6 = 2(2x + 3).",
    },
    {
      front: "What does “factorise fully” mean?",
      back: "Take out the HCF of the numbers AND the letters, so nothing common is left inside: 6x² + 9x = 3x(2x + 3), not 3(2x² + 3x).",
    },
    {
      front: "Factorise w² − 5w",
      back: "w(w − 5). Both terms contain w: w² ÷ w = w and 5w ÷ w = 5.",
    },
    {
      front: "Expand (2x + 3)(3x − 4)",
      back: "Grid cells 6x², −8x, +9x, −12, so 6x² − 8x + 9x − 12 = 6x² + x − 12.",
    },
    {
      front: "Expand (2x − 3)²",
      back: "(2x − 3)(2x − 3) = 4x² − 6x − 6x + 9 = 4x² − 12x + 9. Never 4x² + 9: that misses the two middle terms.",
    },
    {
      front: "Sum of three consecutive numbers n, n + 1, n + 2",
      back: "3n + 3 = 3(n + 1), so it is always a multiple of 3.",
    },
  ],
  cram: [
    "Like terms have the same letters AND powers: 3x² + 4x³ − 4x² = 4x³ − x² (x² and x³ never combine).",
    "Adding vs multiplying: x + x = 2x but x × x = x²; 2x × 3x = 6x²; 3a × 4b = 12ab; 12ab ÷ 4b = 3a.",
    "Expand: the term outside multiplies EVERY term inside: 3(2x + 5) = 6x + 15 and 4x(x − 3) = 4x² − 12x.",
    "A negative outside changes every sign inside: −3(2k − 4) = −6k + 12.",
    "Sums and differences: expand each bracket, then collect: 5(2x + 3) + 6(3x − 4) = 28x − 9 and x(2x + 1) − 3(2x − 4) = 2x² − 5x + 12.",
    "Factorise fully: take out the HCF of the numbers AND letters: 6x² + 9x = 3x(2x + 3) and w² − 5w = w(w − 5). Check by expanding.",
    "≡ means identical for every value (an identity), e.g. 3(x + 2) ≡ 3x + 6; an equation such as 3x + 6 = 21 is only true for some values.",
    "Double brackets: four grid cells, then collect: (2x + 3)(3x − 4) = 6x² + x − 12.",
    "Squared brackets: (2x − 3)² = (2x − 3)(2x − 3) = 4x² − 12x + 9, never 4x² + 9.",
    "Forming: perimeter = add all the sides; rectangle area = length × width; triangle angles add to 180°. Check any answer by substituting x = 1 or 2.",
  ],
};
