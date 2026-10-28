import type { TopicGuide } from "../../types";

// Revision guide — Fractions (Year 8, Unit 1).
// Sections follow lib/sections.ts: fr-equivalent · fr-addsub · fr-muldiv · fr-problems · fr-algebraic.
// Class examples used: 4/5 + 2/3, 3 2/5 − 1 2/3, 2 1/4 ÷ 3 1/2, 1 1/5 × 2 1/3, the monkeys-and-peanuts
// starter, the badminton club, 1/3 − (1/3 × 1/3) + (1/3 ÷ 1/3), the shaded-shapes puzzle, 3xy/xz,
// 42xyz/56 and 17cf/34c².

export const GUIDE_FR: TopicGuide = {
  topic: "fr",
  sections: [
    // -------------------------------------------------------------------------------------------
    // 1. Equivalent fractions, simplifying, ordering, improper ↔ mixed
    // -------------------------------------------------------------------------------------------
    {
      id: "fr-equivalent",
      topic: "fr",
      lesson: "Calculations with Fractions",
      heading: "Same amount, new name: equivalent fractions, ordering & mixed numbers",
      discovery: {
        problem:
          "Arjun eats {{5/8}} of a pizza. Mei eats {{3/5}} of an identical pizza. Who eats more — and by how much? Try it without a calculator.",
        idea:
          "Eighths and fifths are different-sized slices, so comparing 5 slices with 3 slices tells you nothing. Cut both pizzas into 40 equal slices instead (40 is in both the 8 and the 5 times tables): {{5/8 = 25/40}} and {{3/5 = 24/40}}. Arjun eats more — but only by {{1/40}} of a pizza! **Make the pieces the same size** is the big idea of this whole topic.",
      },
      body:
        "A fraction has two parts. The **denominator** (bottom) says how many equal pieces the whole is cut into; the **numerator** (top) says how many of those pieces you have.\n\n" +
        "**Equivalent fractions** are different names for the same amount. Cut every piece of {{2/3}} in half and you get {{4/6}}: twice as many pieces, each half the size, so the amount hasn't changed. The rule is: **multiply or divide the top and the bottom by the same number.**\n\n" +
        "    {{2/3 = 4/6 = 8/12 = 20/30}}\n\n" +
        "**Simplifying** goes the other way: divide the top and the bottom by a common factor. A fraction is in its **simplest form** (lowest terms) when the only common factor left is 1. The quickest way is to divide by the **HCF** (highest common factor) in one go:\n\n" +
        "    {{36/48}}: the HCF of 36 and 48 is 12, so {{36/48 = 3/4}}\n\n" +
        "Dividing in smaller steps (÷ 2, ÷ 2, ÷ 3) is fine too — just keep going until nothing else divides both numbers.\n\n" +
        "**Comparing and ordering.** You can't compare fifths with eighths directly, because the pieces are different sizes. So make them the same size: rewrite each fraction with a **common denominator**. The best choice is the **LCM** (lowest common multiple) of the denominators. Then the bigger numerator means the bigger fraction.\n\n" +
        "    {{5/8 = 25/40}} and {{3/5 = 24/40}}, so {{5/8}} is bigger\n\n" +
        "Give your final answer using the *original* fractions, in the order the question asks for (ascending means smallest first).\n\n" +
        "**Improper fractions and mixed numbers.** An **improper** (top-heavy) fraction like {{17/5}} has a numerator bigger than its denominator. A **mixed number** like {{3 2/5}} is a whole number plus a proper fraction. They are two names for the same number:\n\n" +
        "| Improper → mixed | Mixed → improper |\n" +
        "|---|---|\n" +
        "| {{17/5}}: 17 ÷ 5 = 3 remainder 2 | {{3 2/5}}: 3 × 5 + 2 = 17 |\n" +
        "| so {{17/5 = 3 2/5}} | so {{3 2/5 = 17/5}} |\n\n" +
        "Why does 3 × 5 + 2 work? Each whole is {{5/5}}, so 3 wholes are 15 fifths. Add the 2 extra fifths and you have 17 fifths.",
      diagram: `<svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two fraction bars of the same length. The top bar is cut into 8 equal parts with 5 shaded. The bottom bar is cut into 5 equal parts with 3 shaded. Small ticks cut both bars into 40ths: the top shading covers 25 of them and the bottom shading 24, so there is a gap of one fortieth between the two shaded ends." font-family="sans-serif">
  <rect width="480" height="160" fill="#ffffff"/>
  <rect x="60" y="20" width="225" height="36" fill="#c7d2fe"/>
  <rect x="60" y="104" width="216" height="36" fill="#fde68a"/>
  <path d="M105 20V56M150 20V56M195 20V56M240 20V56M285 20V56M330 20V56M375 20V56M132 104V140M204 104V140M276 104V140M348 104V140" stroke="#334155" stroke-width="1.5"/>
  <path d="M69 48V56M78 48V56M87 48V56M96 48V56M105 48V56M114 48V56M123 48V56M132 48V56M141 48V56M150 48V56M159 48V56M168 48V56M177 48V56M186 48V56M195 48V56M204 48V56M213 48V56M222 48V56M231 48V56M240 48V56M249 48V56M258 48V56M267 48V56M276 48V56M285 48V56M294 48V56M303 48V56M312 48V56M321 48V56M330 48V56M339 48V56M348 48V56M357 48V56M366 48V56M375 48V56M384 48V56M393 48V56M402 48V56M411 48V56M69 132V140M78 132V140M87 132V140M96 132V140M105 132V140M114 132V140M123 132V140M132 132V140M141 132V140M150 132V140M159 132V140M168 132V140M177 132V140M186 132V140M195 132V140M204 132V140M213 132V140M222 132V140M231 132V140M240 132V140M249 132V140M258 132V140M267 132V140M276 132V140M285 132V140M294 132V140M303 132V140M312 132V140M321 132V140M330 132V140M339 132V140M348 132V140M357 132V140M366 132V140M375 132V140M384 132V140M393 132V140M402 132V140M411 132V140" stroke="#64748b" stroke-width="1"/>
  <rect x="60" y="20" width="360" height="36" fill="none" stroke="#1f2937" stroke-width="2"/>
  <rect x="60" y="104" width="360" height="36" fill="none" stroke="#1f2937" stroke-width="2"/>
  <rect x="276" y="56" width="9" height="48" fill="#fecaca" stroke="#334155" stroke-width="1"/>
  <text x="294" y="84" font-size="13" fill="#1f2937">gap = one fortieth</text>
  <g font-size="14" text-anchor="middle" fill="#1f2937">
    <text x="30" y="34">5</text>
    <text x="30" y="54">8</text>
    <text x="30" y="118">3</text>
    <text x="30" y="138">5</text>
    <text x="432" y="43">=</text>
    <text x="458" y="34">25</text>
    <text x="458" y="54">40</text>
    <text x="432" y="127">=</text>
    <text x="458" y="118">24</text>
    <text x="458" y="138">40</text>
  </g>
  <path d="M22 39H38M22 123H38M448 39H468M448 123H468" stroke="#1f2937" stroke-width="1.5"/>
</svg>`,
      diagramCaption:
        "Both bars re-cut into 40ths (the small ticks): {{5/8 = 25/40}} and {{3/5 = 24/40}}, so {{5/8}} is bigger — by just {{1/40}}.",
      workedExamples: [
        {
          title: "Simplify fully",
          problem: "Write {{36/48}} in its simplest form.",
          steps: [
            "Find the HCF of 36 and 48. The factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36. The biggest one that also divides 48 is 12.",
            "Divide the top and the bottom by 12: 36 ÷ 12 = 3 and 48 ÷ 12 = 4.",
            "Check: 3 and 4 have no common factor except 1, so {{3/4}} is fully simplified.",
            "Dividing in steps also works: {{36/48 = 18/24 = 9/12 = 3/4}} — just don't stop early at {{9/12}}.",
          ],
          answer: "{{36/48 = 3/4}}",
        },
        {
          title: "Order using a common denominator",
          problem: "Write these fractions in order, smallest first: {{2/3}}, {{3/4}}, {{5/8}}, {{7/12}}.",
          steps: [
            "The denominators are 3, 4, 8 and 12. The LCM is 24, because 24 is in the 3, 4, 8 and 12 times tables.",
            "Rewrite each fraction in 24ths: {{2/3 = 16/24}}, {{3/4 = 18/24}}, {{5/8 = 15/24}}, {{7/12 = 14/24}}.",
            "Compare the numerators: 14 < 15 < 16 < 18.",
            "Write the answer using the original fractions.",
          ],
          answer: "{{7/12}}, {{5/8}}, {{2/3}}, {{3/4}}",
        },
        {
          title: "Improper ↔ mixed",
          problem: "a) Write {{23/6}} as a mixed number. b) Write {{4 3/7}} as an improper fraction.",
          steps: [
            "a) How many whole 6s are in 23? 23 ÷ 6 = 3 remainder 5.",
            "So there are 3 wholes and 5 sixths left over: {{23/6 = 3 5/6}}.",
            "b) Each whole is 7 sevenths, so 4 wholes are 4 × 7 = 28 sevenths.",
            "Add the 3 sevenths: 28 + 3 = 31, so {{4 3/7 = 31/7}}.",
          ],
          answer: "a) {{3 5/6}}   b) {{31/7}}",
        },
      ],
      keyPoints: [
        "Multiply or divide the numerator and the denominator by the **same** number to make an equivalent fraction.",
        "Simplest form: divide the top and the bottom by their HCF, e.g. {{36/48 = 3/4}} (HCF 12).",
        "To compare or order, rewrite with a common denominator (the LCM), then compare the numerators.",
        "Improper → mixed: divide and put the remainder over the denominator ({{23/6 = 3 5/6}}). Mixed → improper: whole × denominator + numerator ({{4 3/7 = 31/7}}).",
      ],
      whyItWorks:
        "Multiplying the top and the bottom by 5 is the same as multiplying by {{5/5}}, which equals 1 — and multiplying by 1 never changes a number. In a picture, cutting every piece into 5 smaller pieces gives 5 times as many pieces *and* 5 times as many shaded ones, so the shaded amount stays the same.",
      memoryTrick:
        "Mixed → improper is a **MAD** face: **M**ultiply the whole by the denominator, **A**dd the numerator, and the **D**enominator stays the same. {{3 2/5}}: 3 × 5 + 2 = 17, so {{17/5}}.",
      examTip:
        "Simplify **fully**. {{18/24 = 9/12}} isn't finished, because 9 and 12 still share a factor of 3: {{9/12 = 3/4}}. And when ordering, write your answer with the original fractions in the order asked — “ascending” means smallest first.",
      thinkDeeper:
        "Which is bigger, {{7/8}} or {{8/9}}? Answer it *without* a common denominator by asking how far each one is from 1. Does the same trick always work for fractions like {{n/(n+1)}}?",
      quickChecks: [
        {
          question: "Write {{45/60}} in its simplest form.",
          answer: { type: "fraction", n: 3, d: 4, simplest: true },
          solution: "The HCF of 45 and 60 is 15. 45 ÷ 15 = 3 and 60 ÷ 15 = 4, so {{45/60 = 3/4}}.",
        },
        {
          question: "Write {{29/4}} as a mixed number.",
          answer: { type: "fraction", n: 29, d: 4, form: "mixed", simplest: true },
          solution: "29 ÷ 4 = 7 remainder 1, so there are 7 wholes and 1 quarter left over: {{29/4 = 7 1/4}}.",
        },
      ],
    },

    // -------------------------------------------------------------------------------------------
    // 2. Adding and subtracting fractions and mixed numbers
    // -------------------------------------------------------------------------------------------
    {
      id: "fr-addsub",
      topic: "fr",
      lesson: "Calculations with Fractions",
      heading: "Adding and subtracting: make the pieces the same size",
      discovery: {
        problem:
          "Zara says {{1/2 + 1/3 = 2/5}}, because 1 + 1 = 2 and 2 + 3 = 5. Without working out the right answer, how can you tell she *must* be wrong?",
        idea:
          "Look at the sizes: {{2/5}} is *less* than {{1/2}} — but {{1/2}} plus a bit more has to be *more* than {{1/2}}! Adding the tops and the bottoms can't be right. Halves and thirds are different-sized pieces, so rename both as sixths first: {{1/2 + 1/3 = 3/6 + 2/6 = 5/6}}.",
      },
      body:
        "Think of the denominator as the **name of the piece** (fifths, thirds, fifteenths) and the numerator as **how many** of them you have. You can only add things with the same name: 3 sevenths + 2 sevenths = 5 sevenths, just like 3 apples + 2 apples = 5 apples. Fifths and thirds are different sizes, so rename them as the same kind of piece first.\n\n" +
        "**Method for + and −**\n" +
        "1. Find a **common denominator**. The LCM of the denominators keeps the numbers smallest (multiplying the denominators together always works too).\n" +
        "2. Convert each fraction: whatever you multiply the bottom by, multiply the top by.\n" +
        "3. Add or subtract the **numerators only**. The denominator stays the same.\n" +
        "4. Simplify, and change to a mixed number if the question asks.\n\n" +
        "    {{4/5 + 2/3 = 12/15 + 10/15 = 22/15 = 1 7/15}}\n\n" +
        "**Mixed numbers: two methods**\n\n" +
        "**Method A — improper fractions first.** It always works and you never have to borrow:\n\n" +
        "    {{3 2/5 - 1 2/3 = 17/5 - 5/3 = 51/15 - 25/15 = 26/15 = 1 11/15}}\n\n" +
        "**Method B — wholes and fractions separately.** Deal with the whole numbers, then the fractions:\n\n" +
        "    {{7 2/3 + 3/5}} = 7 + {{10/15 + 9/15}} = 7 + {{19/15}} = 7 + {{1 4/15}} = {{8 4/15}}\n\n" +
        "When you subtract and the fraction you're taking away is bigger, you must **borrow** a whole. In {{3 2/5 - 1 2/3}} the fractions are {{6/15 - 10/15}}: not enough fifteenths! Borrow 1 from the 3 as {{15/15}}, so {{3 6/15 = 2 21/15}}. Then:\n\n" +
        "    {{2 21/15 - 1 10/15 = 1 11/15}}, the same answer as Method A ✓\n\n" +
        "A whole number minus a fraction works the same way: {{9 - 2/3 = 8 3/3 - 2/3 = 8 1/3}}.\n\n" +
        "**Which is quicker?** Method B keeps the numbers small, so it's great for adding and when the whole numbers are big. Method A is safer for subtracting when you'd need to borrow. If you have time, check one method with the other.",
      diagram: `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two rectangles, each cut into 5 columns and 3 rows to make 15 equal pieces. In the first, 4 of the 5 columns are shaded: 12 pieces, so four fifths equals twelve fifteenths. In the second, 2 of the 3 rows are shaded: 10 pieces, so two thirds equals ten fifteenths. Together that is 22 fifteenths, which is 1 whole and 7 fifteenths." font-family="sans-serif">
  <rect width="480" height="240" fill="#ffffff"/>
  <rect x="30" y="62" width="144" height="90" fill="#c7d2fe"/>
  <rect x="270" y="62" width="180" height="60" fill="#fde68a"/>
  <path d="M30 92H210M30 122H210M306 62V152M342 62V152M378 62V152M414 62V152" stroke="#64748b" stroke-width="1" stroke-dasharray="4 3"/>
  <path d="M66 62V152M102 62V152M138 62V152M174 62V152M270 92H450M270 122H450" stroke="#334155" stroke-width="1.5"/>
  <rect x="30" y="62" width="180" height="90" fill="none" stroke="#1f2937" stroke-width="2"/>
  <rect x="270" y="62" width="180" height="90" fill="none" stroke="#1f2937" stroke-width="2"/>
  <text x="240" y="116" font-size="26" text-anchor="middle" fill="#1f2937">+</text>
  <g font-size="14" text-anchor="middle" fill="#1f2937">
    <text x="96" y="24">4</text>
    <text x="96" y="44">5</text>
    <text x="119" y="34">=</text>
    <text x="142" y="24">12</text>
    <text x="142" y="44">15</text>
    <text x="336" y="24">2</text>
    <text x="336" y="44">3</text>
    <text x="359" y="34">=</text>
    <text x="382" y="24">10</text>
    <text x="382" y="44">15</text>
  </g>
  <path d="M88 29H104M132 29H152M328 29H344M372 29H392" stroke="#1f2937" stroke-width="1.5"/>
  <g font-size="13" text-anchor="middle" fill="#334155">
    <text x="120" y="172">12 of the 15 pieces</text>
    <text x="360" y="172">10 of the 15 pieces</text>
  </g>
  <g font-size="14" text-anchor="middle" fill="#1f2937">
    <text x="240" y="202">12 + 10 = 22 fifteenths</text>
    <text x="240" y="224">= 1 whole and 7 fifteenths</text>
  </g>
</svg>`,
      diagramCaption:
        "Cutting fifths into thirds (dashed lines) and thirds into fifths gives 15 equal pieces in both, so {{4/5 + 2/3 = 12/15 + 10/15 = 22/15 = 1 7/15}}.",
      workedExamples: [
        {
          title: "Class example: different denominators",
          problem: "Show that {{4/5 + 2/3 = 1 7/15}}.",
          steps: [
            "The LCM of 5 and 3 is 15, so use fifteenths.",
            "{{4/5 = 12/15}} (× 3 top and bottom) and {{2/3 = 10/15}} (× 5 top and bottom).",
            "Add the numerators only: {{12/15 + 10/15 = 22/15}}.",
            "15 goes into 22 once with 7 left over, so {{22/15 = 1 7/15}}.",
          ],
          answer: "{{4/5 + 2/3 = 22/15 = 1 7/15}} ✓",
        },
        {
          title: "Class example: subtracting mixed numbers",
          problem: "Show that {{3 2/5 - 1 2/3 = 1 11/15}}.",
          steps: [
            "Change to improper fractions: {{3 2/5 = 17/5}} (3 × 5 + 2) and {{1 2/3 = 5/3}} (1 × 3 + 2).",
            "Use the common denominator 15: {{17/5 = 51/15}} and {{5/3 = 25/15}}.",
            "Subtract the numerators: {{51/15 - 25/15 = 26/15}}.",
            "Change back: 26 ÷ 15 = 1 remainder 11, so {{26/15 = 1 11/15}}.",
          ],
          answer: "{{1 11/15}} ✓",
        },
        {
          title: "Wholes and fractions, with borrowing",
          problem: "Work out {{9 1/4 - 7 2/3}}.",
          steps: [
            "Use a common denominator of 12: {{9 1/4 = 9 3/12}} and {{7 2/3 = 7 8/12}}.",
            "{{3/12}} take away {{8/12}} won't go, so borrow 1 whole from the 9: {{9 3/12 = 8 + 12/12 + 3/12 = 8 15/12}}.",
            "Now subtract the wholes and the fractions: 8 − 7 = 1 and {{15/12 - 8/12 = 7/12}}.",
            "Check with improper fractions: {{37/4 - 23/3 = 111/12 - 92/12 = 19/12 = 1 7/12}} ✓",
          ],
          answer: "{{1 7/12}}",
        },
      ],
      keyPoints: [
        "Only add or subtract the numerators once the denominators match — **never** add the denominators.",
        "Use the LCM of the denominators as the common denominator, and scale each numerator by the same number as its denominator.",
        "Mixed numbers: either change them to improper fractions first, or do the wholes and the fractions separately.",
        "Taking away a bigger fraction part? Borrow 1 whole (e.g. {{3 6/15 = 2 21/15}}) — never swap the fractions round.",
        "Simplify the answer, and write it as a mixed number if the question asks.",
      ],
      whyItWorks:
        "The denominator names the size of the pieces and the numerator counts them. You can only count pieces together when they are the same size: 12 fifteenths + 10 fifteenths = 22 fifteenths, just like 12 cm + 10 cm = 22 cm. Changing {{4/5}} into {{12/15}} renames the amount without changing it.",
      memoryTrick:
        "**The bottom names it, the top counts it.** You add the counts, never the names — so make the names (the denominators) match first.",
      examTip:
        "In {{3 2/5 - 1 2/3}}, the slip that costs marks is doing 3 − 1 = 2 and then {{2/3 - 2/5 = 4/15}} “because it's the bigger one”, giving {{2 4/15}}. The fraction being taken away is {{2/3}}, so you must borrow a whole (or use improper fractions). The correct answer is {{1 11/15}}.",
      thinkDeeper:
        "{{1/2 + 1/3 + 1/6 = 1}}. Can you find **four different** fractions with numerator 1 that add up to exactly 1? (Hint: try twelfths.) How many different sets can you find?",
      quickChecks: [
        {
          question: "Work out {{5/6 + 3/4}}. Give your answer as a mixed number in its simplest form.",
          answer: { type: "fraction", n: 19, d: 12, form: "mixed", simplest: true },
          solution: "The LCM of 6 and 4 is 12: {{5/6 = 10/12}} and {{3/4 = 9/12}}. So {{10/12 + 9/12 = 19/12 = 1 7/12}}.",
        },
        {
          question: "Work out {{5 1/3 - 2 3/4}}. Give your answer as a mixed number in its simplest form.",
          answer: { type: "fraction", n: 31, d: 12, form: "mixed", simplest: true },
          solution:
            "Improper fractions: {{16/3 - 11/4 = 64/12 - 33/12 = 31/12 = 2 7/12}}. Or borrow a whole: {{5 4/12 - 2 9/12 = 4 16/12 - 2 9/12 = 2 7/12}}.",
        },
      ],
    },

    // -------------------------------------------------------------------------------------------
    // 3. Multiplying and dividing fractions and mixed numbers; fraction of an amount
    // -------------------------------------------------------------------------------------------
    {
      id: "fr-muldiv",
      topic: "fr",
      lesson: "Calculations with Fractions",
      heading: "Multiplying and dividing: tops × tops, and Keep, Change, Flip",
      discovery: {
        problem:
          "How many halves are there in 3? How many quarters are there in 3? So what is {{3 ÷ 1/4}}? And why does dividing by a fraction like {{1/4}} make the answer *bigger*?",
        idea:
          "{{3 ÷ 1/4}} asks “how many quarters fit into 3?” Each whole holds 4 quarters, so 3 wholes hold 12: {{3 ÷ 1/4 = 3 × 4 = 12}}. Dividing by {{1/4}} gives the same answer as multiplying by 4 — the fraction flipped upside down. That is exactly why **Keep, Change, Flip** works.",
      },
      body:
        "**Multiplying** is the easy one: no common denominator needed. Multiply the tops, multiply the bottoms:\n\n" +
        "    {{2/3 × 4/5 = (2 × 4)/(3 × 5) = 8/15}}\n\n" +
        "Why? “{{2/3}} of {{4/5}}” means {{2/3 × 4/5}} — **of** means ×. In the area model, cutting a rectangle into 5 columns and 3 rows makes 3 × 5 = 15 small pieces: that's the bottoms multiplying. Taking 4 of the 5 columns, then 2 of the 3 rows of those, gives 2 × 4 = 8 pieces: that's the tops multiplying.\n\n" +
        "**Cancel first.** If a top and a bottom share a factor, divide both by it *before* multiplying. The numbers stay small and the answer comes out already simplified:\n\n" +
        "    {{9/4 × 2/7}}: the 2 and the 4 share 2, so it becomes {{9/2 × 1/7 = 9/14}}\n\n" +
        "**A fraction of an amount**: divide by the bottom, multiply by the top. {{3/5}} of 40 = 40 ÷ 5 × 3 = 24.\n\n" +
        "**Dividing** by a fraction is the same as multiplying by its **reciprocal**: the fraction flipped upside down. (The reciprocal of {{2/5}} is {{5/2}}; the reciprocal of 3 is {{1/3}}.) The class calls this **Keep, Change, Flip**:\n" +
        "- **Keep** the first fraction\n" +
        "- **Change** ÷ to ×\n" +
        "- **Flip** the second fraction\n\n" +
        "    {{3 ÷ 2/5 = 3/1 × 5/2 = 15/2 = 7 1/2}}\n\n" +
        "Why does flipping work? {{3 ÷ 2/5}} asks “how many {{2/5}}s fit into 3?” There are 5 fifths in every whole, so 15 fifths in 3. Each group uses 2 fifths, so there are 15 ÷ 2 = {{7 1/2}} groups. You multiplied by 5 and divided by 2 — that is exactly × {{5/2}}.\n\n" +
        "**Mixed numbers: make them improper first.** You can't multiply or divide a mixed number bit by bit.\n\n" +
        "    {{1 1/5 × 2 1/3 = 6/5 × 7/3 = 42/15 = 14/5 = 2 4/5}}\n" +
        "    {{2 1/4 ÷ 3 1/2 = 9/4 ÷ 7/2 = 9/4 × 2/7 = 18/28 = 9/14}}\n\n" +
        "Notice: dividing by {{3 1/2}} (more than 1) made the answer smaller, but dividing by {{2/5}} (less than 1) made it *bigger* — lots of small pieces fit in.",
      diagram: `<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top: an area model. A rectangle is cut into 5 columns and 3 rows. Four of the five columns are shaded, and the top two rows of those columns are yellow: 8 of the 15 pieces, showing that two thirds of four fifths is eight fifteenths. Bottom: a bar of 3 wholes, each cut into fifths, grouped in pairs of fifths. There are 7 full groups and 1 fifth left over, which is half a group, so 3 divided by two fifths is seven and a half." font-family="sans-serif">
  <rect width="480" height="320" fill="#ffffff"/>
  <rect x="60" y="60" width="128" height="84" fill="#bae6fd"/>
  <rect x="60" y="60" width="128" height="56" fill="#fde68a"/>
  <path d="M92 60V144M124 60V144M156 60V144M188 60V144M60 88H220M60 116H220" stroke="#334155" stroke-width="1"/>
  <rect x="60" y="60" width="160" height="84" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M60 54V50H188V54M54 60H50V116H54" fill="none" stroke="#334155" stroke-width="1.5"/>
  <g font-size="13" text-anchor="middle" fill="#1f2937">
    <text x="124" y="22">4</text>
    <text x="124" y="42">5</text>
    <text x="30" y="84">2</text>
    <text x="30" y="104">3</text>
  </g>
  <path d="M116 27H132M22 89H38" stroke="#1f2937" stroke-width="1.5"/>
  <g font-size="13" fill="#1f2937">
    <text x="245" y="80">Tops: 2 × 4 = 8 yellow pieces</text>
    <text x="245" y="102">Bottoms: 3 × 5 = 15 pieces</text>
    <text x="245" y="124">So the answer is 8 fifteenths</text>
  </g>
  <path d="M20 162H460" stroke="#cbd5e1" stroke-width="1"/>
  <text x="240" y="184" font-size="13" text-anchor="middle" fill="#1f2937">How many groups of 2 fifths fit into 3 wholes?</text>
  <g font-size="12" text-anchor="middle" fill="#334155">
    <text x="100" y="203">whole 1</text>
    <text x="240" y="203">whole 2</text>
    <text x="380" y="203">whole 3</text>
  </g>
  <rect x="30" y="210" width="56" height="36" fill="#c7d2fe"/>
  <rect x="86" y="210" width="56" height="36" fill="#fde68a"/>
  <rect x="142" y="210" width="56" height="36" fill="#c7d2fe"/>
  <rect x="198" y="210" width="56" height="36" fill="#fde68a"/>
  <rect x="254" y="210" width="56" height="36" fill="#c7d2fe"/>
  <rect x="310" y="210" width="56" height="36" fill="#fde68a"/>
  <rect x="366" y="210" width="56" height="36" fill="#c7d2fe"/>
  <rect x="422" y="210" width="28" height="36" fill="#fecaca"/>
  <path d="M58 210V246M86 210V246M114 210V246M142 210V246M198 210V246M226 210V246M254 210V246M282 210V246M338 210V246M366 210V246M394 210V246M422 210V246" stroke="#64748b" stroke-width="1"/>
  <path d="M170 210V246M310 210V246" stroke="#1f2937" stroke-width="3"/>
  <rect x="30" y="210" width="420" height="36" fill="none" stroke="#1f2937" stroke-width="2"/>
  <g font-size="13" text-anchor="middle" fill="#1f2937">
    <text x="58" y="264">1</text>
    <text x="114" y="264">2</text>
    <text x="170" y="264">3</text>
    <text x="226" y="264">4</text>
    <text x="282" y="264">5</text>
    <text x="338" y="264">6</text>
    <text x="394" y="264">7</text>
    <text x="436" y="264">½</text>
    <text x="240" y="288">7 groups and half a group = 7½ groups</text>
    <text x="240" y="309">Keep, Change, Flip: 3 × 5 ÷ 2 = 7½</text>
  </g>
</svg>`,
      diagramCaption:
        "Top: {{2/3}} of {{4/5}} is 8 of the 15 small pieces, so {{2/3 × 4/5 = 8/15}}. Bottom: 3 wholes hold 15 fifths, which make {{7 1/2}} groups of {{2/5}}, so {{3 ÷ 2/5 = 7 1/2}}.",
      workedExamples: [
        {
          title: "Class example: multiplying mixed numbers",
          problem: "Show that {{1 1/5 × 2 1/3 = 2 4/5}}.",
          steps: [
            "Change both to improper fractions: {{1 1/5 = 6/5}} and {{2 1/3 = 7/3}}.",
            "Cancel first: the 6 on top and the 3 underneath share 3, so 6 → 2 and 3 → 1: {{6/5 × 7/3 = 2/5 × 7/1}}.",
            "Multiply the tops and the bottoms: {{2/5 × 7/1 = 14/5}}.",
            "14 ÷ 5 = 2 remainder 4, so {{14/5 = 2 4/5}}.",
          ],
          answer: "{{2 4/5}} ✓",
        },
        {
          title: "Class example: dividing mixed numbers",
          problem: "Show that {{2 1/4 ÷ 3 1/2 = 9/14}}.",
          steps: [
            "Improper fractions first: {{2 1/4 = 9/4}} and {{3 1/2 = 7/2}}.",
            "Keep, Change, Flip: {{9/4 ÷ 7/2 = 9/4 × 2/7}}.",
            "Cancel the 2 and the 4 (both ÷ 2): {{9/2 × 1/7}}.",
            "Multiply: {{9/2 × 1/7 = 9/14}}. Sense check: {{2 1/4}} is smaller than {{3 1/2}}, so the answer should be less than 1 ✓",
          ],
          answer: "{{9/14}} ✓",
        },
        {
          title: "A whole number divided by a fraction",
          problem: "Work out {{3 ÷ 2/5}}.",
          steps: [
            "Write 3 as {{3/1}}. Keep, Change, Flip: {{3/1 × 5/2}}.",
            "Multiply: {{3/1 × 5/2 = 15/2}}.",
            "15 ÷ 2 = 7 remainder 1, so {{15/2 = 7 1/2}}.",
            "Picture check: 3 wholes = 15 fifths. Groups of 2 fifths make 7 full groups with 1 fifth left over, which is half a group ✓",
          ],
          answer: "{{7 1/2}}",
        },
      ],
      keyPoints: [
        "Multiply: tops × tops, bottoms × bottoms — no common denominator needed.",
        "Cancel a top with a bottom before multiplying to keep the numbers small.",
        "Divide: **Keep, Change, Flip** — keep the first fraction, change ÷ to ×, flip the second.",
        "Change mixed numbers to improper fractions **before** you multiply or divide.",
        "“Of” means ×: {{3/5}} of 40 = 40 ÷ 5 × 3 = 24.",
      ],
      whyItWorks:
        "In the area model, {{2/3}} of {{4/5}} cuts the whole into 3 × 5 = 15 pieces and takes 2 × 4 = 8 of them, so the bottoms multiply and the tops multiply. Dividing by {{2/5}} asks how many {{2/5}}s fit: each whole holds 5 fifths but each group needs 2 of them, so you multiply by 5 and divide by 2 — which is × {{5/2}}.",
      memoryTrick:
        "**Keep, Change, Flip** — and only ever flip the *second* fraction, and only when dividing. Mixed numbers? Make them **top-heavy first**, before you multiply or divide.",
      examTip:
        "Never multiply mixed numbers bit by bit: {{1 1/5 × 2 1/3}} is **not** 1 × 2 together with {{1/5 × 1/3}} (that gives {{2 1/15}}). Convert first: {{6/5 × 7/3 = 14/5 = 2 4/5}}. And when dividing, flip the **second** fraction, not the first.",
      thinkDeeper:
        "Without working anything out: is {{5/6 ÷ 3/4}} bigger or smaller than {{5/6}}? What about {{5/6 × 3/4}}? Explain using “how many fit”. When does dividing make a positive number bigger?",
      quickChecks: [
        {
          question: "Work out {{1/4 × 1 2/3}}. Give your answer in its simplest form.",
          answer: { type: "fraction", n: 5, d: 12, simplest: true },
          solution: "Make the mixed number improper: {{1 2/3 = 5/3}}. Then {{1/4 × 5/3 = 5/12}}.",
        },
        {
          question: "Work out {{2 1/2 ÷ 1 1/3}}. Give your answer as a mixed number in its simplest form.",
          answer: { type: "fraction", n: 15, d: 8, form: "mixed", simplest: true },
          solution: "Improper first: {{5/2 ÷ 4/3}}. Keep, Change, Flip: {{5/2 × 3/4 = 15/8 = 1 7/8}}.",
        },
      ],
    },

    // -------------------------------------------------------------------------------------------
    // 4. Fraction problems in context
    // -------------------------------------------------------------------------------------------
    {
      id: "fr-problems",
      topic: "fr",
      lesson: "Questions/Answers",
      heading: "Fraction problems: what's left, smallest totals and puzzles",
      discovery: {
        problem:
          "My four pet monkeys and I harvested a large pile of peanuts. In the night, Monkey A woke and ate half of them. Then Monkey B woke and ate one third of what remained. Then Monkey C ate one quarter of the rest, and finally Monkey D ate one fifth of the much diminished pile. What fraction of the original harvest was left in the morning?",
        idea:
          "Don't add up what was eaten: {{1/2 + 1/3 + 1/4 + 1/5 = 77/60}}, which is more than the whole pile! Each monkey eats a fraction *of what's left*, so track what's left instead. A leaves {{1/2}}, B leaves {{2/3}} of that, C leaves {{3/4}} of that and D leaves {{4/5}} of that. “Of” means ×, so {{1/2 × 2/3 × 3/4 × 4/5 = 1/5}}. The tops and bottoms cancel in a chain, leaving {{1/5}} of the harvest.",
      },
      body:
        "Fraction problems in tests reuse a few big ideas. The skill is spotting which one you need.\n\n" +
        "**1. A fraction of what's LEFT → multiply.** When each fraction is taken from the *remainder*, you can't just add or subtract the fractions. Work out the fraction that is **left** at each stage and multiply. In the monkeys puzzle the monkeys leave {{1/2}}, then {{2/3}}, {{3/4}} and {{4/5}} of what they find:\n\n" +
        "    {{1/2 × 2/3 × 3/4 × 4/5 = 1/5}}\n\n" +
        "Each top cancels with the bottom before it, so only {{1/5}} of the peanuts is left. (Adding the fractions eaten gives {{1/2 + 1/3 + 1/4 + 1/5 = 77/60}} — more than the whole pile, so that can't be right!)\n\n" +
        "**2. Smallest possible number → LCM.** If {{7/12}} of a club are women, the number of members must be a multiple of 12 (you can't have part of a person). If {{3/8}} wear glasses, it must also be a multiple of 8. The smallest number in both times tables is the **LCM**: LCM(12, 8) = 24.\n\n" +
        "**3. Order of operations.** BIDMAS works for fractions too: brackets, then × and ÷, then + and − from left to right.\n\n" +
        "    {{1/3 - (1/3 × 1/3) + (1/3 ÷ 1/3) = 1/3 - 1/9 + 1 = 1 2/9}}\n\n" +
        "**4. Working backwards.** “{{3/5}} of a number is 24.” Draw a bar of 5 equal boxes: 3 boxes = 24, so 1 box = 8, and all 5 boxes = 40.\n\n" +
        "**5. Puzzles.** In a **magic square** every row, column and diagonal has the same total: find the total from a complete line first, then subtract to fill each gap. If two shaded parts of the same shape add up to more than 1 whole, the extra is the **overlap** ({{4/7 + 3/5 - 1 = 6/35}}).\n\n" +
        "**6. “Is it always true?”** One **counterexample** proves a statement false. “If a > b then {{1/a > 1/b}}”: try a = 2 and b = 1. Then {{1/a = 1/2}}, which is *less* than {{1/b = 1}}. False! Dividing 1 by a bigger positive number gives a smaller answer — share one pizza between more people and everyone gets a smaller slice.",
      diagram: `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar model of the monkeys and peanuts puzzle, drawn to scale. Each row shows the pile that is left: monkey A eats half the pile, B eats a third of the rest, C eats a quarter of the rest and D eats a fifth of the rest. The final row shows the whole pile cut into fifths, and the part left over lines up exactly with one fifth." font-family="sans-serif">
  <rect width="480" height="300" fill="#ffffff"/>
  <g stroke="#334155" stroke-width="1.5">
    <rect x="220" y="24" width="120" height="28" fill="#fecaca"/>
    <rect x="340" y="24" width="120" height="28" fill="#bbf7d0"/>
    <rect x="340" y="74" width="40" height="28" fill="#fecaca"/>
    <rect x="380" y="74" width="80" height="28" fill="#bbf7d0"/>
    <rect x="380" y="124" width="20" height="28" fill="#fecaca"/>
    <rect x="400" y="124" width="60" height="28" fill="#bbf7d0"/>
    <rect x="400" y="174" width="12" height="28" fill="#fecaca"/>
    <rect x="412" y="174" width="48" height="28" fill="#bbf7d0"/>
    <rect x="220" y="232" width="192" height="28" fill="#f1f5f9"/>
    <rect x="412" y="232" width="48" height="28" fill="#bbf7d0"/>
    <rect x="220" y="276" width="14" height="12" fill="#fecaca"/>
    <rect x="300" y="276" width="14" height="12" fill="#bbf7d0"/>
  </g>
  <path d="M420 74V102M420 124V152M440 124V152M424 174V202M436 174V202M448 174V202M268 232V260M316 232V260M364 232V260" stroke="#334155" stroke-width="1"/>
  <path d="M340 52V74M380 102V124M400 152V174M412 202V232" stroke="#334155" stroke-width="1" stroke-dasharray="3 3"/>
  <g font-size="13" fill="#1f2937">
    <text x="12" y="43">A eats a half</text>
    <text x="12" y="93">B eats a third of the rest</text>
    <text x="12" y="143">C eats a quarter of the rest</text>
    <text x="12" y="193">D eats a fifth of the rest</text>
    <text x="12" y="251" font-size="12" font-weight="bold">Left: one fifth of the pile</text>
  </g>
  <g font-size="12" fill="#1f2937">
    <text x="240" y="287">eaten</text>
    <text x="320" y="287">left</text>
  </g>
</svg>`,
      diagramCaption:
        "Drawn to scale: each row is the pile that's left, and each monkey eats part of it (red). What's left is {{1/2 × 2/3 × 3/4 × 4/5 = 1/5}} of the pile — it lines up exactly with one fifth of the original bar.",
      workedExamples: [
        {
          title: "Class example: the badminton club",
          problem:
            "{{7/12}} of the members of a badminton club are women. {{3/8}} of the members wear glasses. Work out the smallest possible number of members of the badminton club.",
          steps: [
            "{{7/12}} of the members must be a whole number of people, so the number of members must be a multiple of 12.",
            "{{3/8}} of the members must be a whole number too, so it must also be a multiple of 8.",
            "Multiples of 12: 12, 24, 36, … Multiples of 8: 8, 16, 24, … The lowest common multiple is 24. (12 fails: {{3/8}} of 12 would be 4.5 people.)",
            "Check: {{7/12}} of 24 = 24 ÷ 12 × 7 = 14 women, and {{3/8}} of 24 = 24 ÷ 8 × 3 = 9 people with glasses. Both are whole numbers ✓",
          ],
          answer: "24 members",
        },
        {
          title: "Class example: order of operations",
          problem: "Find {{1/3 - (1/3 × 1/3) + (1/3 ÷ 1/3)}}.",
          steps: [
            "Brackets first: {{1/3 × 1/3 = 1/9}}.",
            "{{1/3 ÷ 1/3 = 1}}, because any number divided by itself is 1. (Keep, Change, Flip agrees: {{1/3 × 3/1 = 3/3 = 1}}.)",
            "Now the calculation is {{1/3 - 1/9 + 1}}. Work left to right: {{1/3 - 1/9 = 3/9 - 1/9 = 2/9}}.",
            "Finally {{2/9 + 1 = 1 2/9}}.",
          ],
          answer: "{{1 2/9}}",
        },
        {
          title: "Class puzzle: overlapping shading",
          problem:
            "Three identical rectangles, A, B and C. In A, the bottom {{4/7}} is shaded, up to a line. In C, the top {{3/5}} is shaded, down to a second, lower line. In B, only the band between the two lines is shaded. What fraction of B is shaded?",
          steps: [
            "Imagine A's shading and C's shading on the same rectangle. Together they cover {{4/7 + 3/5 = 20/35 + 21/35 = 41/35}}, which is more than one whole rectangle.",
            "That is only possible if they overlap. The extra {{41/35 - 35/35 = 6/35}} has been counted twice: that is the overlap.",
            "The overlap is exactly the band between the two lines, which is B's shading.",
            "Check another way: C's line is {{3/5}} down from the top, so it is {{2/5}} up from the bottom. The band runs from {{2/5}} up to {{4/7}}: {{4/7 - 2/5 = 20/35 - 14/35 = 6/35}} ✓",
          ],
          answer: "{{6/35}} of B is shaded",
        },
      ],
      keyPoints: [
        "“A fraction of what's left” → multiply the fractions that are **left** (if {{1/3}} is eaten, {{2/3}} is left).",
        "“Smallest possible number” → the LCM of the denominators (badminton club: LCM(12, 8) = 24).",
        "BIDMAS still applies: brackets, then × and ÷, then + and −.",
        "Working backwards: if {{3/5}} of a number is 24, then {{1/5}} of it is 8 and the number is 40.",
        "One counterexample proves a statement false: a = 2, b = 1 shows that “a > b means {{1/a > 1/b}}” is false.",
      ],
      whyItWorks:
        "Each monkey eats a fraction *of the pile that's left*, and “of” means ×, so the fractions left multiply together. For the smallest number, every fraction of the club must be a whole number of people, so the total has to be in every denominator's times table — a common multiple — and the smallest one is the LCM.",
      memoryTrick:
        "**Of what's left? Multiply what's left.** In {{1/2 × 2/3 × 3/4 × 4/5}} each top knocks out the bottom before it, like dominoes, leaving {{1/5}}.",
      examTip:
        "Read “of the rest” or “of what remains” carefully: the fraction is of a *smaller* amount, so don't take it away from the whole. (For the monkeys, {{1 - 1/2 - 1/3 - 1/4 - 1/5}} is less than 0!) And in “smallest possible number” questions, 12 × 8 = 96 works but it isn't the *smallest* — use the LCM, 24.",
      thinkDeeper:
        "“If a > b, then {{1/a > 1/b}}.” For positive numbers this is false. Can you find a pair of numbers where it IS true? (Hint: let b be negative.) Can you describe exactly when it's true?",
      quickChecks: [
        {
          question: "{{4/7}} of a number is 36. What is the number?",
          answer: { type: "number", value: 63 },
          solution: "4 sevenths = 36, so 1 seventh = 36 ÷ 4 = 9. The whole number is 7 sevenths = 7 × 9 = 63. Check: {{4/7}} of 63 = 63 ÷ 7 × 4 = 36 ✓",
        },
        {
          question:
            "Mei spends {{1/4}} of her pocket money on a book, then {{2/3}} of what is left on a cinema ticket. What fraction of her pocket money does she have left? Give your answer in its simplest form.",
          answer: { type: "fraction", n: 1, d: 4, simplest: true },
          solution:
            "After the book, {{3/4}} is left. She spends {{2/3}} of that, so she keeps {{1/3}} of it: {{1/3 × 3/4 = 3/12 = 1/4}}. (Not {{1 - 1/4 - 2/3 = 1/12}}: the {{2/3}} is of what's left, not of all her money.)",
        },
      ],
    },

    // -------------------------------------------------------------------------------------------
    // 5. Algebraic fractions: simplify, multiply, divide (monomials only)
    // -------------------------------------------------------------------------------------------
    {
      id: "fr-algebraic",
      topic: "fr",
      lesson: "Fractions with algebra & Further Fractions",
      heading: "Algebraic fractions: cancel, multiply and divide with letters",
      discovery: {
        problem:
          "Choose any numbers for x, y and z (not 0). Work out {{3xy/xz}}, then work out {{3y/z}}. Try again with different numbers. What do you notice — and why does it happen?",
        idea:
          "They always match! With x = 2, y = 5 and z = 3 you get {{30/6 = 5}} and {{15/3 = 5}}. The x on the top and the x on the bottom divide to make 1 ({{x/x = 1}}), so they cancel — just like simplifying {{6/10}} to {{3/5}}. Letters are numbers in disguise, so the same fraction rules apply: {{3xy/xz = 3y/z}}.",
      },
      body:
        "An **algebraic fraction** is a fraction with letters in it, like {{3xy/xz}}. The letters stand for numbers, so **every fraction rule you already know still works**. (We assume the letters aren't zero — you can't divide by 0.)\n\n" +
        "**Simplifying = cancelling common factors.** In {{3xy/xz}}, the top is 3 × x × y and the bottom is x × z. There is an x on the top and an x on the bottom, and {{x/x = 1}}, so they cancel:\n\n" +
        "    {{3xy/xz = 3y/z}}\n\n" +
        "It's the same move as simplifying {{6/10}} to {{3/5}}: dividing the top and the bottom by the same thing. When there are numbers and letters, deal with the **numbers** first (divide by their HCF), then the **letters**:\n\n" +
        "    {{42xyz/56}}: the HCF of 42 and 56 is 14, so {{42xyz/56 = 3xyz/4}}\n\n" +
        "**Powers.** {{c^2}} means c × c. Write it out and cancel one c at a time:\n\n" +
        "    {{17cf/(34c^2) = (17 × c × f)/(2 × 17 × c × c) = f/(2c)}}\n\n" +
        "If *everything* on the top cancels, a 1 is left on top, not 0: {{5y/(10y^2) = 1/(2y)}}.\n\n" +
        "**Multiplying**: tops × tops, bottoms × bottoms, then cancel (or cancel first):\n\n" +
        "    {{2a/3 × 9/(4a) = 18a/(12a) = 3/2}}\n\n" +
        "The a's cancel completely and {{18/12 = 3/2}}.\n\n" +
        "**Dividing**: Keep, Change, Flip, then cancel:\n\n" +
        "    {{x/4 ÷ x/8 = x/4 × 8/x = 8x/(4x) = 2}}\n" +
        "    {{3x/y ÷ 6x^2/y^2 = 3x/y × y^2/(6x^2) = 3xy^2/(6x^2y) = y/(2x)}}\n\n" +
        "In the last one, 3 ÷ 6 leaves {{1/2}}, one x cancels (leaving x on the bottom) and one y cancels (leaving y on the top).\n\n" +
        "**Check by substituting.** Put numbers in: with x = 2, y = 5 and z = 3, {{3xy/xz = 30/6 = 5}} and {{3y/z = 15/3 = 5}} ✓\n\n" +
        "**Typing answers in this app:** put a bottom with more than one factor in brackets. Type `y/(2x)`, not `y/2x` — the app reads that as {{y/2}} × x.",
      diagram: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cancelling factors. Top: 3 times x times y over x times z; the x on the top and the x on the bottom are crossed out, leaving 3y over z. Bottom: 17 times c times f over 2 times 17 times c times c; the two 17s and one pair of c's are crossed out, leaving f over 2c." font-family="sans-serif">
  <rect width="480" height="260" fill="#ffffff"/>
  <g stroke="#334155" stroke-width="1.5">
    <rect x="40" y="30" width="32" height="30" fill="#c7d2fe"/>
    <rect x="78" y="30" width="32" height="30" fill="#fecaca"/>
    <rect x="116" y="30" width="32" height="30" fill="#c7d2fe"/>
    <rect x="59" y="80" width="32" height="30" fill="#fecaca"/>
    <rect x="97" y="80" width="32" height="30" fill="#c7d2fe"/>
    <rect x="230" y="30" width="32" height="30" fill="#c7d2fe"/>
    <rect x="268" y="30" width="32" height="30" fill="#c7d2fe"/>
    <rect x="249" y="80" width="32" height="30" fill="#c7d2fe"/>
    <rect x="59" y="160" width="32" height="30" fill="#fecaca"/>
    <rect x="97" y="160" width="32" height="30" fill="#fecaca"/>
    <rect x="135" y="160" width="32" height="30" fill="#c7d2fe"/>
    <rect x="40" y="210" width="32" height="30" fill="#c7d2fe"/>
    <rect x="78" y="210" width="32" height="30" fill="#fecaca"/>
    <rect x="116" y="210" width="32" height="30" fill="#fecaca"/>
    <rect x="154" y="210" width="32" height="30" fill="#c7d2fe"/>
    <rect x="247" y="160" width="32" height="30" fill="#c7d2fe"/>
    <rect x="228" y="210" width="32" height="30" fill="#c7d2fe"/>
    <rect x="266" y="210" width="32" height="30" fill="#c7d2fe"/>
  </g>
  <path d="M36 70H152M226 70H304M36 200H190M224 200H302" stroke="#1f2937" stroke-width="2"/>
  <path d="M78 60L110 30M59 110L91 80M59 190L91 160M97 190L129 160M78 240L110 210M116 240L148 210" stroke="#1f2937" stroke-width="2"/>
  <g font-size="14" text-anchor="middle" fill="#1f2937">
    <text x="56" y="50">3</text>
    <text x="94" y="50" font-style="italic">x</text>
    <text x="132" y="50" font-style="italic">y</text>
    <text x="75" y="100" font-style="italic">x</text>
    <text x="113" y="100" font-style="italic">z</text>
    <text x="246" y="50">3</text>
    <text x="284" y="50" font-style="italic">y</text>
    <text x="265" y="100" font-style="italic">z</text>
    <text x="75" y="180">17</text>
    <text x="113" y="180" font-style="italic">c</text>
    <text x="151" y="180" font-style="italic">f</text>
    <text x="56" y="230">2</text>
    <text x="94" y="230">17</text>
    <text x="132" y="230" font-style="italic">c</text>
    <text x="170" y="230" font-style="italic">c</text>
    <text x="263" y="180" font-style="italic">f</text>
    <text x="244" y="230">2</text>
    <text x="282" y="230" font-style="italic">c</text>
  </g>
  <g font-size="22" text-anchor="middle" fill="#1f2937">
    <text x="192" y="78">=</text>
    <text x="207" y="208">=</text>
  </g>
  <g font-size="13" fill="#1f2937">
    <text x="330" y="74">x ÷ x = 1</text>
    <text x="322" y="186">34 = 2 × 17</text>
    <text x="322" y="206">c² = c × c</text>
    <text x="322" y="226">cancel 17 and one c</text>
  </g>
</svg>`,
      diagramCaption:
        "Write the top and the bottom as factors, then cancel matching pairs (red): {{3xy/xz = 3y/z}} and {{17cf/(34c^2) = f/(2c)}}.",
      workedExamples: [
        {
          title: "Class example: numbers, letters and powers",
          problem: "Simplify {{17cf/(34c^2)}}.",
          steps: [
            "Numbers first: the HCF of 17 and 34 is 17. 17 ÷ 17 = 1 and 34 ÷ 17 = 2.",
            "Letters: {{c^2}} = c × c, so the c on the top cancels with one c underneath, leaving one c on the bottom.",
            "f only appears on the top, so it stays there.",
            "Put it together: {{17cf/(34c^2) = f/(2c)}}.",
          ],
          answer: "{{f/(2c)}}",
        },
        {
          title: "Multiplying",
          problem: "Simplify {{2a/3 × 9/(4a)}}.",
          steps: [
            "Tops × tops and bottoms × bottoms: {{(2a × 9)/(3 × 4a) = 18a/(12a)}}.",
            "Cancel the a's ({{a/a = 1}}), leaving {{18/12}}.",
            "Simplify the numbers (HCF 6): {{18/12 = 3/2}}.",
            "Or cancel before multiplying: 2 with 4, 9 with 3, and a with a — you get {{3/2}} with smaller numbers.",
          ],
          answer: "{{3/2}} (or {{1 1/2}})",
        },
        {
          title: "Dividing",
          problem: "Simplify {{3x/y ÷ 6x^2/y^2}}.",
          steps: [
            "Keep, Change, Flip: {{3x/y × y^2/(6x^2)}}.",
            "Multiply: {{(3x × y^2)/(y × 6x^2) = 3xy^2/(6x^2y)}}.",
            "Numbers: {{3/6 = 1/2}}. Letters: one x cancels, leaving x on the bottom; one y cancels, leaving y on the top.",
            "Check with x = 2 and y = 3: {{6/3 ÷ 24/9 = 2 × 9/24 = 3/4}}, and {{y/(2x) = 3/4}} ✓",
          ],
          answer: "{{y/(2x)}}",
        },
      ],
      keyPoints: [
        "Letters stand for numbers, so the usual fraction rules work (assume the letters aren't 0).",
        "Simplify by cancelling **common factors**: divide the numbers by their HCF, and cancel any letter that is on the top and the bottom ({{x/x = 1}}).",
        "{{c^2}} = c × c: cancel one c at a time. If everything on the top cancels, leave a 1 on top.",
        "Multiply: tops × tops, bottoms × bottoms, then cancel. Divide: Keep, Change, Flip, then cancel.",
        "Check your answer by substituting numbers for the letters.",
      ],
      whyItWorks:
        "For any number x except 0, {{x/x = 1}}, just like {{7/7 = 1}}. Cancelling a factor that is on the top and the bottom divides both by the same number, which makes an equivalent fraction — exactly what you do when you simplify {{6/10}} to {{3/5}}.",
      memoryTrick:
        "**Write it out long-hand, then cross out pairs.** {{3xy/xz}} becomes {{(3 × x × y)/(x × z)}}: one x from the top and one x from the bottom — gone, leaving {{3y/z}}.",
      examTip:
        "Don't lose what's left when things cancel: {{5y/(10y^2)}} is {{1/(2y)}} — not 2y, and not 0. When typing an answer here, bracket the bottom: `y/(2x)`.",
      thinkDeeper:
        "{{10y^2/(5y)}} simplifies to 2y. Test it with y = 3 and with y = −1. Now try y = 0. Why do we say “assume y isn't 0”?",
      quickChecks: [
        {
          question: "Simplify {{30xy/(45y)}} fully. Type it as a fraction, e.g. `5ab/7`.",
          answer: { type: "expression", expr: "2x/3", form: "simplified" },
          solution:
            "Numbers first: the HCF of 30 and 45 is 15, so 30 ÷ 15 = 2 and 45 ÷ 15 = 3. Letters: y is on the top and the bottom, so it cancels, and x stays on top: {{30xy/(45y) = 2x/3}}.",
        },
        {
          question: "Simplify {{4a/5 × 15/(8a^2)}}. Type the bottom in brackets, e.g. `5/(3b)`.",
          answer: { type: "expression", expr: "3/(2a)", form: "simplified" },
          solution:
            "Multiply: {{(4a × 15)/(5 × 8a^2) = 60a/(40a^2)}}. Numbers: {{60/40 = 3/2}}. Letters: one a cancels, leaving a on the bottom. So the answer is {{3/(2a)}}.",
        },
      ],
    },
  ],

  flashcards: [
    {
      front: "Equivalent fractions",
      back: "Same value, different numbers. Multiply or divide the top and the bottom by the same number: {{3/4 = 9/12 = 30/40}}.",
    },
    {
      front: "How do you simplify a fraction fully?",
      back: "Divide the top and the bottom by their HCF. {{36/48}}: the HCF is 12, so {{36/48 = 3/4}}.",
    },
    {
      front: "How do you compare or order fractions? Which is bigger, {{5/8}} or {{3/5}}?",
      back: "Rewrite them with a common denominator (the LCM) and compare the numerators: {{5/8 = 25/40}} and {{3/5 = 24/40}}, so {{5/8}} is bigger.",
    },
    {
      front: "Write {{17/5}} as a mixed number, and {{4 3/7}} as an improper fraction.",
      back: "17 ÷ 5 = 3 remainder 2, so {{17/5 = 3 2/5}}. 4 × 7 + 3 = 31, so {{4 3/7 = 31/7}}.",
    },
    {
      front: "How do you add or subtract fractions?",
      back: "Common denominator first, convert both fractions, then add or subtract the numerators only: {{4/5 + 2/3 = 12/15 + 10/15 = 22/15 = 1 7/15}}.",
    },
    {
      front: "Work out {{3 2/5 - 1 2/3}}.",
      back: "{{17/5 - 5/3 = 51/15 - 25/15 = 26/15 = 1 11/15}}. (Or borrow a whole: {{2 21/15 - 1 10/15 = 1 11/15}}.)",
    },
    {
      front: "How do you multiply fractions?",
      back: "Tops × tops, bottoms × bottoms — cancel first if you can: {{2/3 × 4/5 = 8/15}}.",
    },
    {
      front: "Keep, Change, Flip",
      back: "To divide, multiply by the reciprocal: keep the first fraction, change ÷ to ×, flip the second. {{2 1/4 ÷ 3 1/2 = 9/4 × 2/7 = 9/14}}.",
    },
    {
      front: "Work out {{3 ÷ 2/5}}.",
      back: "Keep, Change, Flip: {{3/1 × 5/2 = 15/2 = 7 1/2}}. ({{7 1/2}} groups of {{2/5}} fit into 3.)",
    },
    {
      front: "Work out {{1 1/5 × 2 1/3}}.",
      back: "Improper first: {{6/5 × 7/3 = 42/15 = 14/5 = 2 4/5}}. Not {{2 1/15}} — never multiply the parts separately.",
    },
    {
      front: "Find {{3/5}} of 40.",
      back: "Divide by the bottom, multiply by the top: 40 ÷ 5 × 3 = 24.",
    },
    {
      front: "Monkeys eat {{1/2}} of the peanuts, then {{1/3}} of the rest, {{1/4}} of the rest and {{1/5}} of the rest. What fraction is left?",
      back: "Multiply what's LEFT: {{1/2 × 2/3 × 3/4 × 4/5 = 1/5}}.",
    },
    {
      front: "{{7/12}} of a club are women and {{3/8}} wear glasses. Smallest possible number of members?",
      back: "The LCM of 12 and 8, which is 24 (14 women, 9 with glasses).",
    },
    {
      front: "If a > b, is {{1/a}} always bigger than {{1/b}}?",
      back: "No. Counterexample: a = 2, b = 1 gives {{1/2}}, which is less than 1. For positive numbers, dividing 1 by a bigger number gives a smaller answer.",
    },
    {
      front: "Simplify {{3xy/xz}} and {{17cf/(34c^2)}}.",
      back: "Cancel common factors: {{3xy/xz = 3y/z}} and {{17cf/(34c^2) = f/(2c)}}.",
    },
    {
      front: "Simplify {{3x/y ÷ 6x^2/y^2}}.",
      back: "Keep, Change, Flip, then cancel: {{3x/y × y^2/(6x^2) = 3xy^2/(6x^2y) = y/(2x)}}.",
    },
  ],

  cram: [
    "Equivalent fractions: × or ÷ the top and the bottom by the same number. Simplest form: divide both by the HCF ({{36/48 = 3/4}}).",
    "Order or compare: rewrite with the LCM as the common denominator, then compare the numerators ({{5/8 = 25/40}} beats {{3/5 = 24/40}}).",
    "Improper ↔ mixed: {{17/5}} → 17 ÷ 5 = 3 r 2 → {{3 2/5}}; {{3 2/5}} → 3 × 5 + 2 = 17 → {{17/5}}.",
    "+ and −: common denominator first, then add or subtract the tops only: {{4/5 + 2/3 = 12/15 + 10/15 = 1 7/15}}.",
    "Mixed-number subtraction: go improper, or borrow a whole: {{3 2/5 - 1 2/3 = 51/15 - 25/15 = 1 11/15}}.",
    "×: tops × tops, bottoms × bottoms, cancel first; mixed numbers → improper first: {{1 1/5 × 2 1/3 = 6/5 × 7/3 = 2 4/5}}.",
    "÷: Keep, Change, Flip: {{2 1/4 ÷ 3 1/2 = 9/4 × 2/7 = 9/14}} and {{3 ÷ 2/5 = 15/2 = 7 1/2}}.",
    "“Of what's left” → multiply what's left: {{1/2 × 2/3 × 3/4 × 4/5 = 1/5}}. Smallest possible number → LCM of the denominators (badminton club: 24).",
    "BIDMAS with fractions: {{1/3 - (1/3 × 1/3) + (1/3 ÷ 1/3) = 1/3 - 1/9 + 1 = 1 2/9}}.",
    "Algebraic fractions: cancel common factors ({{3xy/xz = 3y/z}}, {{17cf/(34c^2) = f/(2c)}}); multiply then cancel; divide with Keep, Change, Flip.",
  ],
};
