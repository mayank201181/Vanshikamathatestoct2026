import type { TopicGuide } from "../../types";

// Sequences (Unit 2) — revision guide.
// Sections follow lib/sections.ts: sq-terms, sq-nth, sq-generate, sq-quadratic.
// Methods match the class notes: nth term = (difference)n + (zeroth term);
// quadratic: second difference ÷ 2 = coefficient of n², subtract an², find what's left.

export const GUIDE_SQ: TopicGuide = {
  topic: "sq",
  sections: [
    // -----------------------------------------------------------------------
    // 1. Term-to-term rules, times tables, filling gaps, pictorial sequences
    // -----------------------------------------------------------------------
    {
      id: "sq-terms",
      topic: "sq",
      lesson: "Sequences",
      heading: "Term-to-term rules and filling the gaps",
      discovery: {
        problem:
          "Fill in the gaps so that the sequence goes up by the same amount each time: 6, __, __, __, 18. Lots of people split the 12 into 3 equal jumps, because there are 3 blanks. Try it. Does it work?",
        idea:
          "Jumps of 4 give 6, 10, 14, 18, which reaches 18 one place too early and leaves a blank unfilled. Count the **jumps**, not the blanks: from the 1st term to the 5th term there are 4 jumps. So each jump is 12 ÷ 4 = 3, and the sequence is 6, 9, 12, 15, 18.",
      },
      body:
        "A **sequence** is a list of numbers that follows a rule. Each number is a **term**, and its place in the list is its **position**. In 5, 8, 11, 14, … the 1st term is 5 and the 4th term is 14.\n\n" +
        "**Term-to-term rules**\n\n" +
        "A **term-to-term rule** tells you how to get from one term to the next. For 5, 8, 11, 14 the rule is ‘add 3’. Your notes put it like this: a **linear**, or **arithmetic**, sequence is one where you add or subtract the same amount each time. That amount is the **common difference**.\n\n" +
        "- 4, 7, 10, 13, … is **ascending**: the difference is +3.\n" +
        "- 30, 26, 22, 18, … is **descending**: the difference is −4.\n\n" +
        "**Times-table sequences**\n\n" +
        "The 3 times table, 3, 6, 9, 12, …, also has a **position-to-term rule**: term = 3 × position. Writing n for the position, that's {{3n}}. In the same way, {{2n}} gives 2, 4, 6, 8, … and {{4n}} gives 4, 8, 12, 16, … Notice that the number in front of n is the common difference. Hold on to that idea for the next section.\n\n" +
        "**Filling gaps**\n\n" +
        "1. Find the total change between two terms you know.\n" +
        "2. Count the **jumps** between them (how many places apart they are), not the blanks.\n" +
        "3. Common difference = total change ÷ number of jumps.\n\n" +
        "    6, _, _, _, 18: the change is 18 − 6 = 12, spread over 4 jumps\n" +
        "    Difference = 12 ÷ 4 = 3, so the sequence is 6, 9, 12, 15, 18\n\n" +
        "When two terms sit side by side, they give you the difference straight away. In 4, 7, _, _, 16 the difference is 7 − 4 = 3, so the gaps are 10 and 13. Check the last jump: 13 + 3 = 16 ✓\n\n" +
        "**Pictorial sequences**\n\n" +
        "In the matchstick pattern, Pattern 1 uses 4 sticks and each new square adds 3 more: a top, a bottom and a right-hand side. So the pattern makes 4, 7, 10, … It's linear because the picture grows by the same amount every time.\n\n" +
        "**Jumping ahead**\n\n" +
        "You don't have to write out the whole list to find a far-away term. Pattern 10 is 9 jumps after Pattern 1, so it needs 4 + 9 × 3 = 31 sticks. The number of jumps is always **one less than the position**.",
      diagram: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matchstick squares in a row. Pattern 1 is one square made from 4 sticks, Pattern 2 is two squares made from 7 sticks and Pattern 3 is three squares made from 10 sticks. Each pattern is one starting stick plus 3 sticks for every square." font-family="sans-serif">
<rect width="480" height="180" fill="#ffffff"/>
<g stroke="#334155" stroke-width="1">
<rect x="57" y="53" width="6" height="34" rx="2" fill="#fecaca"/>
<rect x="63" y="47" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="63" y="87" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="97" y="53" width="6" height="34" rx="2" fill="#c7d2fe"/>
<rect x="157" y="53" width="6" height="34" rx="2" fill="#fecaca"/>
<rect x="163" y="47" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="163" y="87" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="197" y="53" width="6" height="34" rx="2" fill="#c7d2fe"/>
<rect x="203" y="47" width="34" height="6" rx="2" fill="#bbf7d0"/>
<rect x="203" y="87" width="34" height="6" rx="2" fill="#bbf7d0"/>
<rect x="237" y="53" width="6" height="34" rx="2" fill="#bbf7d0"/>
<rect x="297" y="53" width="6" height="34" rx="2" fill="#fecaca"/>
<rect x="303" y="47" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="303" y="87" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="337" y="53" width="6" height="34" rx="2" fill="#c7d2fe"/>
<rect x="343" y="47" width="34" height="6" rx="2" fill="#bbf7d0"/>
<rect x="343" y="87" width="34" height="6" rx="2" fill="#bbf7d0"/>
<rect x="377" y="53" width="6" height="34" rx="2" fill="#bbf7d0"/>
<rect x="383" y="47" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="383" y="87" width="34" height="6" rx="2" fill="#c7d2fe"/>
<rect x="417" y="53" width="6" height="34" rx="2" fill="#c7d2fe"/>
</g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#1f2937">
<text x="80" y="32">Pattern 1</text>
<text x="200" y="32">Pattern 2</text>
<text x="360" y="32">Pattern 3</text>
</g>
<g font-size="13" text-anchor="middle" fill="#1f2937">
<text x="80" y="118">1 + 3 = 4</text>
<text x="200" y="118">1 + 3 + 3 = 7</text>
<text x="360" y="118">1 + 3 + 3 + 3 = 10</text>
</g>
<g font-size="14" font-weight="bold" text-anchor="middle" fill="#b45309">
<text x="130" y="75">+3</text>
<text x="270" y="75">+3</text>
</g>
<rect x="60" y="146" width="14" height="14" rx="2" fill="#fecaca" stroke="#334155"/>
<text x="80" y="157" font-size="12" fill="#334155">starting stick</text>
<rect x="190" y="146" width="14" height="14" rx="2" fill="#c7d2fe" stroke="#334155"/>
<rect x="207" y="146" width="14" height="14" rx="2" fill="#bbf7d0" stroke="#334155"/>
<text x="228" y="157" font-size="12" fill="#334155">3 sticks for each square</text>
</svg>`,
      diagramCaption:
        "Each pattern is 1 starting stick (pink) plus 3 sticks for every square, so each new square adds 3: 4, 7, 10, … The term-to-term rule is +3.",
      workedExamples: [
        {
          title: "Class example: two terms side by side",
          problem: "Fill in the gaps in this arithmetic sequence: 4, 7, __, __, 16.",
          steps: [
            "The first two terms are next to each other, so the common difference is 7 − 4 = 3.",
            "Keep adding 3: 7 + 3 = 10, then 10 + 3 = 13.",
            "Check that the last jump lands on the given term: 13 + 3 = 16 ✓",
          ],
          answer: "4, 7, **10**, **13**, 16",
        },
        {
          title: "Gaps in a descending sequence",
          problem: "Fill in the gaps in this arithmetic sequence: 40, __, __, 19.",
          steps: [
            "Total change from 40 to 19: 19 − 40 = −21, so the sequence goes down by 21 altogether.",
            "From the 1st term to the 4th term there are 3 jumps (count the commas).",
            "Common difference: −21 ÷ 3 = −7, so subtract 7 each time.",
            "40 − 7 = 33 and 33 − 7 = 26. Check: 26 − 7 = 19 ✓",
          ],
          answer: "40, **33**, **26**, 19 (the term-to-term rule is ‘subtract 7’)",
        },
        {
          title: "A matchstick pattern",
          problem:
            "In the matchstick pattern, Pattern 1 uses 4 sticks, Pattern 2 uses 7 sticks and Pattern 3 uses 10 sticks. How many sticks does Pattern 20 use?",
          steps: [
            "Term-to-term rule: +3, because each new square adds a top, a bottom and a right-hand side.",
            "Pattern 20 is 19 jumps after Pattern 1 (one less than the position).",
            "4 + 19 × 3 = 4 + 57 = 61.",
            "Check with the picture: 1 starting stick + 3 sticks for each of the 20 squares = 1 + 60 = 61 ✓",
          ],
          answer: "61 matchsticks",
        },
      ],
      keyPoints: [
        "A term-to-term rule gets you from one term to the next (‘add 3’). A position-to-term rule gets a term straight from its position n (‘3 × position’).",
        "A linear (arithmetic) sequence adds or subtracts the same amount each time: the common difference.",
        "Filling gaps: common difference = total change ÷ number of jumps. Jumps = places apart, not blanks.",
        "{{2n}}, {{3n}} and {{4n}} are the 2, 3 and 4 times tables. The number in front of n is the difference.",
        "To jump ahead: 1st term + (position − 1) × difference.",
      ],
      whyItWorks:
        "Every blank is one equal jump on from the term before it. From the 1st term to the 5th term there are 4 jumps, so the total change of 12 is shared between 4 equal jumps. That's why you divide by 4, not by the 3 blanks. It's like fence posts: 5 posts have only 4 gaps between them.",
      memoryTrick:
        "**Count the commas, not the blanks.** In 6, _, _, _, 18 there are 4 commas between the 6 and the 18, so there are 4 jumps.",
      examTip:
        "Don't divide by the number of blanks. For 6, _, _, _, 18, working out 12 ÷ 3 = 4 gives 6, 10, 14, 18, which reaches 18 one place too early. Always check that your last jump lands exactly on the term you were given.",
      thinkDeeper:
        "Sequence A is 4, 7, 10, 13, … and Sequence B is 3, 8, 13, 18, … The number 13 is in both. Find the next two numbers that are in both sequences. Why do the shared numbers go up in 15s?",
      quickChecks: [
        {
          question:
            "Fill in the gaps in this arithmetic sequence: 7, __, __, __, 27. Type the three missing terms in order, separated by commas.",
          answer: { type: "list", values: [12, 17, 22], ordered: true },
          solution:
            "The change is 27 − 7 = 20, spread over 4 jumps, so the difference is 20 ÷ 4 = 5. The sequence is 7, 12, 17, 22, 27.",
        },
        {
          question: "The sequence 50, 46, 42, 38, … goes down by 4 each time. What is the 10th term?",
          answer: { type: "number", value: 14 },
          solution:
            "The 10th term is 9 jumps after the 1st term, so it is 50 − 9 × 4 = 50 − 36 = 14.",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 2. nth term of an arithmetic sequence
    // -----------------------------------------------------------------------
    {
      id: "sq-nth",
      topic: "sq",
      lesson: "Arithmetic Sequences",
      heading: "The nth term of an arithmetic sequence",
      discovery: {
        problem:
          "Here's a sequence: 5, 8, 11, 14, … What is the 100th term? You really don't want to add on 3 ninety-nine times. Try writing the 3 times table underneath it.",
        idea:
          "Underneath 5, 8, 11, 14 the 3 times table is 3, 6, 9, 12, and every term is exactly 2 more. So each term is 3 × position + 2, and the 100th term is 3 × 100 + 2 = 302. That rule, {{3n + 2}}, is called the **nth term**.",
      },
      body:
        "The **nth term** is a position-to-term rule: put in the position n and out comes the term. We write it as {{U_n}}. So {{U_1}} is the 1st term, {{U_2}} is the 2nd term, and {{U_n = 3n + 2}} means ‘3 lots of the position, plus 2’.\n\n" +
        "**Why the difference goes in front of n**\n\n" +
        "The sequence 5, 8, 11, 14, … goes up by 3 each time, just like the 3 times table. Line them up:\n\n" +
        "| position n | 1 | 2 | 3 | 4 |\n" +
        "|---|---|---|---|---|\n" +
        "| {{3n}} | 3 | 6 | 9 | 12 |\n" +
        "| sequence | 5 | 8 | 11 | 14 |\n\n" +
        "Every term is exactly 2 more than the times table, so {{U_n = 3n + 2}}. An arithmetic sequence is always a times table **shifted** up or down.\n\n" +
        "**The class method: difference and zeroth term**\n\n" +
        "1. Find the common difference d. That gives you {{dn}}.\n" +
        "2. Find the **zeroth term**: step back one place from the 1st term (1st term − d).\n" +
        "3. nth term = {{dn}} + zeroth term.\n\n" +
        "    5, 8, 11, 14: the difference is 3, so start with {{3n}}\n" +
        "    Zeroth term: 5 − 3 = 2\n" +
        "    nth term: {{3n + 2}}\n\n" +
        "Why the zeroth term? When n = 0, the {{3n}} part is 0, so the zeroth term is exactly the number on the end.\n\n" +
        "Always **check** by substituting n = 1 and n = 2: 3 × 1 + 2 = 5 ✓ and 3 × 2 + 2 = 8 ✓\n\n" +
        "**Descending sequences** have a negative difference. For 20, 17, 14, 11, … the difference is −3, and stepping back from 20 gives 20 + 3 = 23. So {{U_n = 23 - 3n}} (you can also write it as {{-3n + 23}}).\n\n" +
        "**Using the nth term**\n\n" +
        "- **Any term:** the 50th term of {{3n + 2}} is 3 × 50 + 2 = 152.\n" +
        "- **Is a number in the sequence?** Make the nth term equal to it and solve. A whole-number answer for n means yes. Anything else means no.\n\n" +
        "    Is 100 a term of {{3n + 2}}? Solve {{3n + 2 = 100}}, so {{3n = 98}}\n" +
        "    n = 98 ÷ 3 = 32.666…, which is not a whole number, so no\n\n" +
        "**Pictures:** the matchstick squares (4, 7, 10, …) have difference 3 and zeroth term 1, so the nth term is {{3n + 1}}. The picture shows why: 1 starting stick, plus 3 sticks for every square.",
      diagram: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar chart of the sequence 3n + 2. For n = 1, 2, 3 and 4 each bar is a blue part of 3, 6, 9 and 12 (the 3 times table) with a green part of 2 on top, making 5, 8, 11 and 14. At n = 0 there is only the green 2, which is the zeroth term." font-family="sans-serif">
<rect width="480" height="270" fill="#ffffff"/>
<rect x="24" y="12" width="14" height="14" rx="2" fill="#bae6fd" stroke="#334155"/>
<text x="44" y="24" font-size="13" fill="#1f2937">3n: the 3 times table</text>
<rect x="24" y="34" width="14" height="14" rx="2" fill="#bbf7d0" stroke="#334155"/>
<text x="44" y="46" font-size="13" fill="#1f2937">+ 2 on every term</text>
<g stroke="#334155" stroke-width="1">
<rect x="46" y="196" width="48" height="24" fill="#bbf7d0" stroke-dasharray="4 3"/>
<rect x="126" y="184" width="48" height="36" fill="#bae6fd"/>
<rect x="126" y="160" width="48" height="24" fill="#bbf7d0"/>
<rect x="206" y="148" width="48" height="72" fill="#bae6fd"/>
<rect x="206" y="124" width="48" height="24" fill="#bbf7d0"/>
<rect x="286" y="112" width="48" height="108" fill="#bae6fd"/>
<rect x="286" y="88" width="48" height="24" fill="#bbf7d0"/>
<rect x="366" y="76" width="48" height="144" fill="#bae6fd"/>
<rect x="366" y="52" width="48" height="24" fill="#bbf7d0"/>
</g>
<line x1="20" y1="220" x2="460" y2="220" stroke="#334155" stroke-width="1.5"/>
<g font-size="12" text-anchor="middle" fill="#1f2937">
<text x="70" y="212">+2</text>
<text x="150" y="176">+2</text>
<text x="230" y="140">+2</text>
<text x="310" y="104">+2</text>
<text x="390" y="68">+2</text>
<text x="150" y="206">3</text>
<text x="230" y="188">6</text>
<text x="310" y="170">9</text>
<text x="390" y="152">12</text>
</g>
<g font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">
<text x="70" y="190">2</text>
<text x="150" y="154">5</text>
<text x="230" y="118">8</text>
<text x="310" y="82">11</text>
<text x="390" y="46">14</text>
</g>
<g font-size="13" text-anchor="middle" fill="#334155">
<text x="70" y="238">n = 0</text>
<text x="150" y="238">n = 1</text>
<text x="230" y="238">n = 2</text>
<text x="310" y="238">n = 3</text>
<text x="390" y="238">n = 4</text>
</g>
<text x="70" y="256" font-size="12" text-anchor="middle" fill="#475569">zeroth term</text>
</svg>`,
      diagramCaption:
        "3n + 2 is the 3 times table (blue) with the same 2 (green) added to every term. At n = 0 only the 2 is left: that's the zeroth term.",
      workedExamples: [
        {
          title: "Class example",
          problem: "Find the nth term of 5, 8, 11, 14, … and use it to find the 50th term.",
          steps: [
            "Common difference: 8 − 5 = 3 (and 11 − 8 = 3, 14 − 11 = 3), so start with {{3n}}.",
            "Zeroth term: step back one place, 5 − 3 = 2.",
            "nth term = {{3n + 2}}.",
            "Check: n = 1 gives 3 × 1 + 2 = 5 ✓, n = 2 gives 3 × 2 + 2 = 8 ✓, n = 3 gives 3 × 3 + 2 = 11 ✓",
            "50th term: 3 × 50 + 2 = 152.",
          ],
          answer: "{{U_n = 3n + 2}}, and the 50th term is 152.",
        },
        {
          title: "A descending sequence",
          problem: "Find the nth term of 20, 17, 14, 11, …",
          steps: [
            "Common difference: 17 − 20 = −3, so start with {{-3n}}.",
            "Zeroth term: step back one place. Going backwards undoes the −3, so 20 + 3 = 23.",
            "nth term = {{-3n + 23}}, which is usually written {{23 - 3n}}.",
            "Check: n = 1 gives 23 − 3 = 20 ✓, n = 2 gives 23 − 6 = 17 ✓, n = 3 gives 23 − 9 = 14 ✓",
          ],
          answer: "{{U_n = 23 - 3n}}",
        },
        {
          title: "Is it in the sequence?",
          problem: "Is 100 a term of the sequence 5, 8, 11, 14, …? Explain how you know.",
          steps: [
            "From the class example, the nth term is {{3n + 2}}.",
            "If 100 is a term, then {{3n + 2 = 100}} for some position n.",
            "Subtract 2: {{3n = 98}}. Divide by 3: n = 32.666…",
            "Positions are whole numbers (there's no 32.666…th term), so 100 is not in the sequence.",
            "Sense check: the 32nd term is 3 × 32 + 2 = 98 and the 33rd term is 3 × 33 + 2 = 101. 100 falls in between.",
          ],
          answer: "No. Solving {{3n + 2 = 100}} gives n = 32.666…, which is not a whole number.",
        },
      ],
      keyPoints: [
        "nth term = {{dn}} + zeroth term, where d is the common difference.",
        "Zeroth term = 1st term − d (step back one place).",
        "A descending sequence has a negative d: 20, 17, 14, … has nth term {{23 - 3n}}.",
        "Is x in the sequence? Solve nth term = x. A whole-number n means yes.",
        "Always check your nth term by substituting n = 1 and n = 2.",
      ],
      whyItWorks:
        "Adding d every time is exactly what the d times table does, so an arithmetic sequence is just {{dn}} moved up or down by a fixed amount. That fixed amount is what's left when n = 0, which is why it's called the zeroth term.",
      memoryTrick:
        "**Difference in front, zeroth term on the end.** For 5, 8, 11, 14: the difference 3 gives {{3n}}, then step back from 5 to 2 to get {{3n + 2}}.",
      examTip:
        "Two classic slips: putting the 1st term on the end ({{3n + 5}} gives 8, 11, 14, …, not 5, 8, 11, …) and adding the difference instead of multiplying ({{n + 3}} gives 4, 5, 6, …). Substituting n = 1 catches both in seconds.",
      thinkDeeper:
        "From your class starter: find the nth term of p + r, p, p − r, p − 2r, … It's still arithmetic. What is the common difference? What is the zeroth term? Check your answer by putting n = 1 and n = 2 back in.",
      quickChecks: [
        {
          question: "Find the nth term of 7, 11, 15, 19, …",
          answer: { type: "expression", expr: "4n+3" },
          solution:
            "The difference is 4, so start with {{4n}}. Zeroth term: 7 − 4 = 3. So {{U_n = 4n + 3}}. Check: n = 1 gives 7 ✓, n = 2 gives 11 ✓",
        },
        {
          question: "Find the nth term of 30, 26, 22, 18, …",
          answer: { type: "expression", expr: "34-4n" },
          solution:
            "The difference is −4, so start with {{-4n}}. Zeroth term: 30 + 4 = 34. So {{U_n = 34 - 4n}}. Check: n = 1 gives 34 − 4 = 30 ✓, n = 2 gives 34 − 8 = 26 ✓",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 3. Generating sequences from rules; recognising quadratic sequences
    // -----------------------------------------------------------------------
    {
      id: "sq-generate",
      topic: "sq",
      lesson: "Quadratic Sequences",
      heading: "Generating sequences and spotting quadratics",
      discovery: {
        problem:
          "Here are the square numbers: 1, 4, 9, 16, 25. Work out the gaps between them. Then work out the gaps between the gaps. What do you notice? Can you explain it with a picture made of dots?",
        idea:
          "The gaps are 3, 5, 7, 9 (the odd numbers), and the gaps between those are always 2. In the picture, each square is the last square plus an L-shaped border, and each new border is 2 dots longer than the one before. A **constant second difference** like this is the fingerprint of a quadratic sequence.",
      },
      body:
        "To **generate** a sequence from its nth term, substitute n = 1, 2, 3, … in turn. Use BIDMAS: brackets first, then powers, then multiplying, then adding and subtracting.\n\n" +
        "    {{4n - 1}}: 4 × 1 − 1, 4 × 2 − 1, 4 × 3 − 1, 4 × 4 − 1 → 3, 7, 11, 15\n" +
        "    {{3n^2}}: 3 × 1, 3 × 4, 3 × 9, 3 × 16 → 3, 12, 27, 48\n" +
        "    {{n(n + 1)}}: 1 × 2, 2 × 3, 3 × 4, 4 × 5 → 2, 6, 12, 20\n" +
        "    {{(n + 1)^2}}: 2², 3², 4², 5² → 4, 9, 16, 25\n\n" +
        "Careful: {{3n^2}} means 3 × n², so **square first, then multiply**. When n = 2 it's 3 × 4 = 12, not 6² = 36.\n\n" +
        "**Linear or quadratic?**\n\n" +
        "Find the gaps between the terms: the **first differences**. If they're all the same, the sequence is linear. If not, find the gaps between the gaps: the **second differences**.\n\n" +
        "| nth term | terms | 1st differences | 2nd differences | type |\n" +
        "|---|---|---|---|---|\n" +
        "| {{2n + 3}} | 5, 7, 9, 11 | 2, 2, 2 | 0, 0 | linear |\n" +
        "| {{n(n + 1)}} | 2, 6, 12, 20 | 4, 6, 8 | 2, 2 | quadratic |\n" +
        "| {{n^3}} | 1, 8, 27, 64 | 7, 19, 37 | 12, 18 | cubic |\n" +
        "| {{2^n}} | 2, 4, 8, 16 | 2, 4, 8 | 2, 4 | doubling |\n\n" +
        "A sequence is **quadratic** when its second differences are all the same (and not zero). Its nth term has {{n^2}} as the highest power of n.\n\n" +
        "**Which rules make quadratic sequences?** Multiply out any brackets, then look for the highest power of n.\n\n" +
        "- {{3(n^2 - 4) = 3n^2 - 12}}: the highest power is {{n^2}}, so it's quadratic ✓\n" +
        "- {{n(2n - 3) = 2n^2 - 3n}}: quadratic ✓\n" +
        "- {{(n - 3)(n^2 - 1)}}: n × n² makes {{n^3}}, so it's **cubic**, not quadratic ✗\n\n" +
        "**Doubling is not quadratic.** In 1, 2, 4, 8, 16, … the first differences are 1, 2, 4, 8 and the second differences are 1, 2, 4. They keep doubling and never settle down.\n\n" +
        "**Pictures:** patterns that grow as squares make quadratic sequences, because they grow in two directions at once. Each new square gains an L-shaped border, and each border is 2 dots bigger than the last (see the diagram).",
      diagram: `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Square dot patterns for n = 1 to 4 with 1, 4, 9 and 16 dots. Each square is the previous square plus an L-shaped border of 3, 5 and 7 dots. The first differences 3, 5, 7 go up by 2 each time, so the second differences are both 2." font-family="sans-serif">
<rect width="480" height="240" fill="#ffffff"/>
<circle cx="30" cy="22" r="6" fill="#c7d2fe" stroke="#334155"/>
<text x="42" y="26" font-size="12" fill="#334155">dots from the previous square</text>
<circle cx="250" cy="22" r="6" fill="#fde68a" stroke="#334155"/>
<text x="262" y="26" font-size="12" fill="#334155">new L-shaped border</text>
<g stroke="#334155" stroke-width="1">
<circle cx="60" cy="150" r="6" fill="#fde68a"/>
<circle cx="135" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="153" cy="150" r="6" fill="#fde68a"/>
<circle cx="135" cy="132" r="6" fill="#fde68a"/>
<circle cx="153" cy="132" r="6" fill="#fde68a"/>
<circle cx="225" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="243" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="225" cy="132" r="6" fill="#c7d2fe"/>
<circle cx="243" cy="132" r="6" fill="#c7d2fe"/>
<circle cx="261" cy="150" r="6" fill="#fde68a"/>
<circle cx="261" cy="132" r="6" fill="#fde68a"/>
<circle cx="261" cy="114" r="6" fill="#fde68a"/>
<circle cx="225" cy="114" r="6" fill="#fde68a"/>
<circle cx="243" cy="114" r="6" fill="#fde68a"/>
<circle cx="335" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="353" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="371" cy="150" r="6" fill="#c7d2fe"/>
<circle cx="335" cy="132" r="6" fill="#c7d2fe"/>
<circle cx="353" cy="132" r="6" fill="#c7d2fe"/>
<circle cx="371" cy="132" r="6" fill="#c7d2fe"/>
<circle cx="335" cy="114" r="6" fill="#c7d2fe"/>
<circle cx="353" cy="114" r="6" fill="#c7d2fe"/>
<circle cx="371" cy="114" r="6" fill="#c7d2fe"/>
<circle cx="389" cy="150" r="6" fill="#fde68a"/>
<circle cx="389" cy="132" r="6" fill="#fde68a"/>
<circle cx="389" cy="114" r="6" fill="#fde68a"/>
<circle cx="389" cy="96" r="6" fill="#fde68a"/>
<circle cx="335" cy="96" r="6" fill="#fde68a"/>
<circle cx="353" cy="96" r="6" fill="#fde68a"/>
<circle cx="371" cy="96" r="6" fill="#fde68a"/>
</g>
<g font-size="13" text-anchor="middle" fill="#334155">
<text x="60" y="75">n = 1</text>
<text x="144" y="75">n = 2</text>
<text x="243" y="75">n = 3</text>
<text x="362" y="75">n = 4</text>
</g>
<g font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">
<text x="60" y="182">1</text>
<text x="144" y="182">4</text>
<text x="243" y="182">9</text>
<text x="362" y="182">16</text>
</g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#b45309">
<text x="102" y="204">+3</text>
<text x="194" y="204">+5</text>
<text x="302" y="204">+7</text>
</g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#15803d">
<text x="148" y="226">+2</text>
<text x="248" y="226">+2</text>
</g>
<g font-size="12" text-anchor="end" fill="#475569">
<text x="470" y="182">total dots</text>
<text x="470" y="204">1st differences</text>
<text x="470" y="226">2nd differences</text>
</g>
</svg>`,
      diagramCaption:
        "Each square of dots is the previous square (blue) plus an L-shaped border (yellow) of 3, then 5, then 7 dots. The borders grow by 2 each time, so the second difference is always 2.",
      workedExamples: [
        {
          title: "Generate the first five terms",
          problem:
            "A sequence has nth term {{n^2 + 3}}. Work out the first five terms and show that it is a quadratic sequence.",
          steps: [
            "Substitute n = 1 to 5: 1² + 3 = 4, 2² + 3 = 7, 3² + 3 = 12, 4² + 3 = 19, 5² + 3 = 28.",
            "First differences: 3, 5, 7, 9. They change, so the sequence is not linear.",
            "Second differences: 2, 2, 2. They are constant, so the sequence is quadratic ✓",
          ],
          answer: "4, 7, 12, 19, 28. It's quadratic because the second difference is always 2.",
        },
        {
          title: "Class question: is it quadratic?",
          problem: "Is 1, 2, 4, 8, 16, 32, … a quadratic sequence? Justify your answer.",
          steps: [
            "First differences: 1, 2, 4, 8, 16.",
            "Second differences: 1, 2, 4, 8. These are not all the same.",
            "A quadratic sequence must have a constant second difference, so this one isn't quadratic. Each term is double the one before, so the differences keep doubling too.",
          ],
          answer:
            "No. The second differences (1, 2, 4, 8) are not constant, because the sequence doubles each time.",
        },
        {
          title: "Class question: work backwards",
          problem: "A quadratic sequence has nth term {{n^2 + k}}. The 3rd term is 17. Find k.",
          steps: [
            "The 3rd term means n = 3, so substitute: 3² + k = 17.",
            "9 + k = 17, so k = 17 − 9 = 8.",
            "Check: {{n^2 + 8}} gives 9, 12, 17, 24, … and the 3rd term is 17 ✓",
          ],
          answer: "k = 8",
        },
      ],
      keyPoints: [
        "Generate terms by substituting n = 1, 2, 3, … and using BIDMAS: {{2n^2}} means 2 × n², not {{(2n)^2}}.",
        "Constant 1st differences → linear. Constant (non-zero) 2nd differences → quadratic.",
        "A rule makes a quadratic sequence if, once multiplied out, its highest power of n is {{n^2}}.",
        "Doubling sequences (1, 2, 4, 8, …) and cubic rules such as {{n^3}} are not quadratic: their 2nd differences keep changing.",
        "Working backwards: substitute the position you know and solve. If {{n^2 + k}} has 3rd term 17, then 9 + k = 17, so k = 8.",
      ],
      whyItWorks:
        "Going from one square to the next adds an L-shaped border: n dots along the top, n dots down the side and 1 in the corner, which makes {{2n + 1}} dots. Each time n goes up by 1, the border gains 2 more dots. That's why the first differences of the square numbers go up by 2 and the second differences are always 2.",
      memoryTrick:
        "**Which row goes steady?** If the 1st differences are constant, the sequence is linear (n). If you have to go down to the 2nd differences, it's quadratic ({{n^2}}).",
      examTip:
        "{{2n^2}} is not {{(2n)^2}}. For n = 3, {{2n^2}} = 2 × 9 = 18, but {{(2n)^2}} = 6² = 36. Square the n first, then multiply.",
      thinkDeeper:
        "Arjun says: ‘If the first differences keep getting bigger, the sequence must be quadratic.’ Find a sequence that proves him wrong. What test should he use instead?",
      quickChecks: [
        {
          question:
            "Work out the first four terms of the sequence with nth term {{2n^2 - 1}}. Type them in order, separated by commas.",
          answer: { type: "list", values: [1, 7, 17, 31], ordered: true },
          solution:
            "Square n, double it, then subtract 1: 2 × 1 − 1 = 1, 2 × 4 − 1 = 7, 2 × 9 − 1 = 17, 2 × 16 − 1 = 31.",
        },
        {
          question: "A sequence has nth term {{n^2 + k}}. Its 4th term is 20. Find k.",
          answer: { type: "number", value: 4 },
          solution:
            "Substitute n = 4: 4² + k = 20, so 16 + k = 20 and k = 4. Check: {{n^2 + 4}} gives 5, 8, 13, 20 ✓",
        },
      ],
    },
    // -----------------------------------------------------------------------
    // 4. nth term of a quadratic sequence (second difference ÷ 2, subtract an²)
    // -----------------------------------------------------------------------
    {
      id: "sq-quadratic",
      topic: "sq",
      lesson: "More Quadratic Sequences",
      heading: "The nth term of a quadratic sequence",
      discovery: {
        problem:
          "The square numbers 1, 4, 9, 16, 25 have a second difference of 2. Before you work anything out, predict the second difference of 2, 8, 18, 32, 50 (double the squares, {{2n^2}}) and of 3, 12, 27, 48, 75 (three times the squares, {{3n^2}}). Then check.",
        idea:
          "Doubling every term doubles every difference, so {{2n^2}} has a second difference of 4. Tripling gives {{3n^2}} a second difference of 6. In general {{an^2}} has a second difference of 2a, so to find the number in front of {{n^2}} you **halve the second difference**. That's exactly why the class method says ‘second difference ÷ 2’.",
      },
      body:
        "**Finding the next term**\n\n" +
        "You don't need the nth term to continue a quadratic sequence. Extend the rows of differences instead. For 4, 5, 8, 13, …\n\n" +
        "    Terms: 4, 5, 8, 13, __\n" +
        "    1st differences: +1, +3, +5, so the next one is +7\n" +
        "    2nd differences: +2, +2, +2\n" +
        "    Next term: 13 + 7 = 20\n\n" +
        "Add the second difference to the last first difference (5 + 2 = 7), then add that to the last term: 13 + 7 = **20**.\n\n" +
        "**Finding the nth term: the class method**\n\n" +
        "1. Work out the first and second differences. The second differences must be constant.\n" +
        "2. **Coefficient of {{n^2}} = second difference ÷ 2.** A second difference of 2 gives {{n^2}}, 4 gives {{2n^2}} and 6 gives {{3n^2}}.\n" +
        "3. Write out {{an^2}} for n = 1, 2, 3, … and **subtract** it from each term.\n" +
        "4. Look at what's left. If it's the same number every time, add that number on. If it's a linear sequence, find its nth term and add that on.\n" +
        "5. Check your answer with n = 1, 2 and 3.\n\n" +
        "For 3, 6, 11, 18, 27 (see the diagram), the second difference is 2, so start with {{n^2}}. Taking away 1, 4, 9, 16, 25 leaves 2 every time, so {{U_n = n^2 + 2}}.\n\n" +
        "**Two-term quadratics**\n\n" +
        "Your assessments stick to quadratics with just two terms, like these:\n\n" +
        "| type | sequence | subtract | what's left | nth term |\n" +
        "|---|---|---|---|---|\n" +
        "| {{an^2}} | 2, 8, 18, 32, 50 | {{2n^2}} | 0, 0, 0, … | {{2n^2}} |\n" +
        "| {{an^2 + c}} | −4, −1, 4, 11, 20 | {{n^2}} | −5, −5, −5, … | {{n^2 - 5}} |\n" +
        "| {{an^2 + bn}} | −2, −2, 0, 4, 10 | {{n^2}} | −3, −6, −9, … | {{n^2 - 3n}} |\n\n" +
        "In the last row, what's left goes down by 3 and its zeroth term is 0, so it is {{-3n}}.\n\n" +
        "If the second differences are *not* constant, the sequence isn't quadratic and this method won't work, so look again!",
      diagram: `<svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Differences diagram for the sequence 3, 6, 11, 18, 27. The first differences are 3, 5, 7, 9 and the second differences are 2, 2, 2. 2 divided by 2 is 1, so compare with n squared: 1, 4, 9, 16, 25. Subtracting leaves 2 every time, so the nth term is n squared plus 2." font-family="sans-serif">
<rect width="480" height="250" fill="#ffffff"/>
<g font-size="12" fill="#475569">
<text x="12" y="36">sequence</text>
<text x="12" y="80">1st difference</text>
<text x="12" y="116">2nd difference</text>
<text x="12" y="164">n²</text>
<text x="12" y="198">sequence − n²</text>
</g>
<g stroke="#94a3b8" stroke-width="1">
<line x1="148" y1="46" x2="164" y2="64"/>
<line x1="192" y1="46" x2="176" y2="64"/>
<line x1="208" y1="46" x2="224" y2="64"/>
<line x1="252" y1="46" x2="236" y2="64"/>
<line x1="268" y1="46" x2="284" y2="64"/>
<line x1="312" y1="46" x2="296" y2="64"/>
<line x1="328" y1="46" x2="344" y2="64"/>
<line x1="372" y1="46" x2="356" y2="64"/>
<line x1="176" y1="84" x2="195" y2="100"/>
<line x1="224" y1="84" x2="205" y2="100"/>
<line x1="236" y1="84" x2="255" y2="100"/>
<line x1="284" y1="84" x2="265" y2="100"/>
<line x1="296" y1="84" x2="315" y2="100"/>
<line x1="344" y1="84" x2="325" y2="100"/>
</g>
<g stroke="#334155" stroke-width="1">
<rect x="120" y="18" width="40" height="26" rx="6" fill="#c7d2fe"/>
<rect x="180" y="18" width="40" height="26" rx="6" fill="#c7d2fe"/>
<rect x="240" y="18" width="40" height="26" rx="6" fill="#c7d2fe"/>
<rect x="300" y="18" width="40" height="26" rx="6" fill="#c7d2fe"/>
<rect x="360" y="18" width="40" height="26" rx="6" fill="#c7d2fe"/>
<rect x="120" y="180" width="40" height="26" rx="6" fill="#bbf7d0"/>
<rect x="180" y="180" width="40" height="26" rx="6" fill="#bbf7d0"/>
<rect x="240" y="180" width="40" height="26" rx="6" fill="#bbf7d0"/>
<rect x="300" y="180" width="40" height="26" rx="6" fill="#bbf7d0"/>
<rect x="360" y="180" width="40" height="26" rx="6" fill="#bbf7d0"/>
</g>
<g font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">
<text x="140" y="36">3</text>
<text x="200" y="36">6</text>
<text x="260" y="36">11</text>
<text x="320" y="36">18</text>
<text x="380" y="36">27</text>
<text x="140" y="198">2</text>
<text x="200" y="198">2</text>
<text x="260" y="198">2</text>
<text x="320" y="198">2</text>
<text x="380" y="198">2</text>
</g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#b45309">
<text x="170" y="80">+3</text>
<text x="230" y="80">+5</text>
<text x="290" y="80">+7</text>
<text x="350" y="80">+9</text>
</g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#15803d">
<text x="200" y="116">+2</text>
<text x="260" y="116">+2</text>
<text x="320" y="116">+2</text>
</g>
<text x="345" y="116" font-size="13" font-weight="bold" fill="#1f2937">2 ÷ 2 = 1 → n²</text>
<line x1="12" y1="134" x2="468" y2="134" stroke="#cbd5e1" stroke-dasharray="5 4"/>
<g font-size="14" text-anchor="middle" fill="#1f2937">
<text x="140" y="164">1</text>
<text x="200" y="164">4</text>
<text x="260" y="164">9</text>
<text x="320" y="164">16</text>
<text x="380" y="164">25</text>
</g>
<text x="240" y="236" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">2 is left every time, so the nth term is n² + 2</text>
</svg>`,
      diagramCaption:
        "The class table method for 3, 6, 11, 18, 27: the second difference is 2, and 2 ÷ 2 = 1, so compare the sequence with n². Subtracting leaves 2 every time, so the nth term is n² + 2.",
      workedExamples: [
        {
          title: "Class example: a constant left over",
          problem: "Find the nth term of 3, 6, 11, 18, 27, …",
          steps: [
            "First differences: 3, 5, 7, 9. Second differences: 2, 2, 2.",
            "Coefficient of {{n^2}}: 2 ÷ 2 = 1, so start with {{n^2}}.",
            "Subtract {{n^2}} from each term: 3 − 1 = 2, 6 − 4 = 2, 11 − 9 = 2, 18 − 16 = 2, 27 − 25 = 2.",
            "The same number, 2, is left every time, so add 2.",
            "Check: n = 1 gives 1 + 2 = 3 ✓, n = 2 gives 4 + 2 = 6 ✓, n = 3 gives 9 + 2 = 11 ✓",
          ],
          answer: "{{U_n = n^2 + 2}}",
        },
        {
          title: "Class example: a linear part left over",
          problem: "Find the nth term of 2, 6, 12, 20, 30, …",
          steps: [
            "First differences: 4, 6, 8, 10. Second differences: 2, 2, 2, so start with {{n^2}} (2 ÷ 2 = 1).",
            "Subtract {{n^2}} from each term: 2 − 1 = 1, 6 − 4 = 2, 12 − 9 = 3, 20 − 16 = 4, 30 − 25 = 5.",
            "What's left is 1, 2, 3, 4, 5. That's linear, and its nth term is n.",
            "So the nth term is {{n^2 + n}}, which is the same as {{n(n + 1)}}.",
            "Check: n = 1 gives 1 + 1 = 2 ✓, n = 2 gives 4 + 2 = 6 ✓, n = 3 gives 9 + 3 = 12 ✓",
          ],
          answer: "{{U_n = n^2 + n}}",
        },
        {
          title: "Challenge: the Review starter (centred hexagonal numbers)",
          problem:
            "The numbers of dots in the centred hexagon patterns are 1, 7, 19, 37, 61, … Find a rule for the number of dots in the nth pattern.",
          steps: [
            "First differences: 6, 12, 18, 24. Second differences: 6, 6, 6.",
            "Coefficient of {{n^2}}: 6 ÷ 2 = 3, so start with {{3n^2}}, which gives 3, 12, 27, 48, 75.",
            "Subtract: 1 − 3 = −2, 7 − 12 = −5, 19 − 27 = −8, 37 − 48 = −11, 61 − 75 = −14.",
            "What's left, −2, −5, −8, −11, −14, is linear. The difference is −3 and the zeroth term is −2 + 3 = 1, so it's {{-3n + 1}}.",
            "Put the parts together: {{3n^2 - 3n + 1}}.",
            "Check: n = 1 gives 3 − 3 + 1 = 1 ✓, n = 2 gives 12 − 6 + 1 = 7 ✓, n = 3 gives 27 − 9 + 1 = 19 ✓",
            "The other Review starter works the same way: the centred pentagonal numbers 1, 6, 16, 31, 51 have second difference 5, so they start with {{2.5n^2}} and come out as {{2.5n^2 - 2.5n + 1}}.",
          ],
          answer: "{{U_n = 3n^2 - 3n + 1}}",
        },
      ],
      keyPoints: [
        "Next term: add the 2nd difference to the last 1st difference, then add that to the last term.",
        "Coefficient of {{n^2}} = 2nd difference ÷ 2.",
        "Subtract {{an^2}} from every term. A constant left over gets added on ({{n^2 + 2}}). A linear sequence left over: find its nth term and add it on ({{n^2 + n}}).",
        "Your assessments use two-term quadratics: {{an^2}}, {{an^2 + c}} or {{an^2 + bn}}.",
        "Check your answer with n = 1, 2 and 3.",
      ],
      whyItWorks:
        "The {{an^2}} part makes a second difference of 2a, and any linear part ({{bn + c}}) adds a second difference of 0. So the second difference only ‘sees’ the {{n^2}} part: halve it to get a. Once {{an^2}} is taken away, what's left is constant or linear, and you already know how to deal with those.",
      memoryTrick:
        "**Halve, subtract, spot.** Halve the second difference, subtract {{an^2}}, then spot what's left.",
      examTip:
        "Don't use the second difference itself as the coefficient. 2, 8, 18, 32, 50 has a second difference of 4, but its nth term is {{2n^2}}, not {{4n^2}}. Halve it, then check with n = 1.",
      thinkDeeper:
        "Siti says 1, 4, 9, 16, 25 and 4, 9, 16, 25, 36 must have the same nth term, because both have a second difference of 2. Is she right? Use the table method to find the nth term of 4, 9, 16, 25, 36. What do you notice when you compare your answer with {{(n + 1)^2}}?",
      quickChecks: [
        {
          question: "Find the next term of the sequence 19, 16, 11, 4, __",
          answer: { type: "number", value: -5 },
          solution:
            "First differences: −3, −5, −7. Second differences: −2, −2. The next first difference is −7 − 2 = −9, so the next term is 4 − 9 = −5.",
        },
        {
          question: "Find the nth term of 5, 11, 21, 35, 53, …",
          answer: { type: "expression", expr: "2n^2+3" },
          solution:
            "First differences: 6, 10, 14, 18. Second difference: 4, and 4 ÷ 2 = 2, so start with {{2n^2}}: 2, 8, 18, 32, 50. Subtracting leaves 3 every time, so {{U_n = 2n^2 + 3}}.",
        },
      ],
    },
  ],
  flashcards: [
    {
      front: "Term-to-term rule vs position-to-term rule",
      back: "Term-to-term: how to get from one term to the next (5, 8, 11, … is ‘add 3’). Position-to-term: a rule that uses the position n, like {{3n + 2}}.",
    },
    {
      front: "Fill the gaps: 6, __, __, __, 18",
      back: "There are 4 jumps (count the commas), so the difference is 12 ÷ 4 = 3: 6, 9, 12, 15, 18.",
    },
    {
      front: "What is the zeroth term?",
      back: "The term before the 1st term: 1st term − common difference. For 5, 8, 11, … it's 5 − 3 = 2.",
    },
    {
      front: "nth term of 5, 8, 11, 14, …",
      back: "{{3n + 2}}: the difference is 3 and the zeroth term is 2.",
    },
    {
      front: "nth term of 20, 17, 14, 11, …",
      back: "{{23 - 3n}}: the difference is −3 and the zeroth term is 23.",
    },
    {
      front: "Is 100 a term of {{3n + 2}}?",
      back: "Solve {{3n + 2 = 100}}: n = 32.666…, which is not a whole number, so no.",
    },
    {
      front: "Work out {{2n^2}} when n = 3",
      back: "2 × 3² = 2 × 9 = 18. Square first, then multiply (it is not 6² = 36).",
    },
    {
      front: "How can you tell a sequence is quadratic?",
      back: "Its second differences are constant (and not zero).",
    },
    {
      front: "Is 1, 2, 4, 8, 16, … a quadratic sequence?",
      back: "No. It doubles each time, and its second differences (1, 2, 4, 8) are not constant.",
    },
    {
      front: "Which is NOT quadratic: {{n^2 + 3}}, {{3(n^2 - 4)}}, {{n(2n - 3)}} or {{(n - 3)(n^2 - 1)}}?",
      back: "{{(n - 3)(n^2 - 1)}}. Multiplied out, it has an {{n^3}} term, so it's cubic.",
    },
    {
      front: "{{n^2 + k}} has 3rd term 17. Find k.",
      back: "Substitute n = 3: 9 + k = 17, so k = 8.",
    },
    {
      front: "Next term: 4, 5, 8, 13, __",
      back: "20. The differences 1, 3, 5 go up by 2, so the next difference is 7, and 13 + 7 = 20.",
    },
    {
      front: "Coefficient of {{n^2}} in a quadratic nth term",
      back: "Second difference ÷ 2. A second difference of 6 means {{3n^2}}.",
    },
    {
      front: "nth term of 3, 6, 11, 18, 27, …",
      back: "{{n^2 + 2}}. Subtract {{n^2}} and 2 is left every time.",
    },
    {
      front: "nth term of 2, 6, 12, 20, 30, …",
      back: "{{n^2 + n}}. Subtract {{n^2}} to leave 1, 2, 3, 4, 5, which is n.",
    },
    {
      front: "nth term of −2, −2, 0, 4, 10, …",
      back: "{{n^2 - 3n}}. Subtract {{n^2}} to leave −3, −6, −9, …, which is {{-3n}}.",
    },
  ],
  cram: [
    "Filling gaps: common difference = total change ÷ number of jumps (6, _, _, _, 18 → 12 ÷ 4 = 3).",
    "Arithmetic nth term = {{dn}} + zeroth term, where zeroth term = 1st term − d (5, 8, 11, … → {{3n + 2}}).",
    "Descending sequences have a negative difference: 20, 17, 14, … → {{23 - 3n}}.",
    "Is x a term? Solve nth term = x. A whole-number n means yes.",
    "Generating terms: BIDMAS, so {{2n^2}} = 2 × n², not {{(2n)^2}}.",
    "Constant 1st differences = linear. Constant 2nd differences = quadratic. Doubling sequences are neither.",
    "Next term of a quadratic: last 1st difference + 2nd difference, then add it to the last term (4, 5, 8, 13 → 20).",
    "Quadratic nth term: a = 2nd difference ÷ 2, subtract {{an^2}}, then add on what's left (3, 6, 11, 18, … → {{n^2 + 2}}).",
    "Always check an nth term by substituting n = 1, 2 and 3.",
  ],
};
