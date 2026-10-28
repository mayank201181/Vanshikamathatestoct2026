import type { TopicGuide } from "../../types";

// Ratio & Proportion (Unit 1) — revision guide.
// Class material comes from the OneNote pages "Ratio Problems", "Mixing Paints" and
// "Ratio Puzzles (1 Star, 2 Star)" in docs/syllabus.md.

export const GUIDE_RA: TopicGuide = {
  topic: "ra",
  sections: [
    // ------------------------------------------------------------------ ra-basics
    {
      id: "ra-basics",
      topic: "ra",
      lesson: "Ratio Problems",
      heading: "What a ratio means — and how to simplify it",
      discovery: {
        problem:
          "Priya threads 12 red beads and 18 blue beads onto a bracelet. Marcus threads 2 red beads and 3 blue beads onto his. Both say their bracelet is \"the same mix of colours\". Can they both be right? How could you prove it in one line?",
        idea:
          "They're both right. Put Priya's beads into groups of 6: her 12 red beads make 2 groups and her 18 blue beads make 3 groups. So her bracelet is just Marcus's 2 : 3 pattern repeated six times. In one line: 12 : 18 = 2 : 3 (divide both parts by 6). **Simplifying** a ratio means finding the smallest recipe the whole thing is built from — divide every part by the same number and the mix doesn't change.",
      },
      body:
        "A **ratio** compares the sizes of two or more quantities. If a fruit bowl has 2 mangoes for every 3 bananas, then **mangoes : bananas = 2 : 3** (say \"2 to 3\"). **Order matters**: bananas : mangoes is 3 : 2.\n\n" +
        "**Simplifying.** Multiplying or dividing *every* part by the same number gives an **equivalent ratio**. The mix stays the same; the batch just gets bigger or smaller. To simplify **fully**, divide every part by the **HCF** (highest common factor):\n\n" +
        "    24 : 36    (the HCF of 24 and 36 is 12)\n" +
        "    = 2 : 3    (24 ÷ 12 = 2 and 36 ÷ 12 = 3)\n\n" +
        "Can't spot the HCF? Divide by any common factor, then keep going until the only common factor left is 1. In the picture, 12 : 18 is regrouped into boxes of 6 (the HCF), which gives 2 : 3.\n\n" +
        "**Tidy up first, then simplify:**\n" +
        "- **Units**: make them the same, then leave them out. 50 cm : 2 m = 50 : 200 = 1 : 4.\n" +
        "- **Decimals**: multiply every part by 10 (or 100). 1.5 : 2 = 15 : 20 = 3 : 4.\n" +
        "- **Fractions**: multiply every part by the common denominator. For {{1/2}} : {{1/3}}, multiply by 6 to get 3 : 2.\n\n" +
        "**Ratios and fractions.** A ratio compares **part with part**, but adding the parts gives you the **whole**. If a : b = 2 : 5, there are 2 + 5 = **7 parts** altogether, so a is {{2/7}} of the total and b is {{5/7}}. Comparing the two parts directly gives {{a/b = 2/5}} and {{b/a = 5/2}}, so b is 2.5 times as big as a.\n\n" +
        "**Unit ratios.** Sometimes one side has to be exactly 1. Divide every part by that number (decimals are fine here):\n\n" +
        "    4 : 10 = 1 : 2.5    (both ÷ 4) — the form 1 : n\n" +
        "    10 : 4 = 2.5 : 1    (both ÷ 4) — the form n : 1\n\n" +
        "Unit ratios make comparing easy: squash : water = 1 : 4.5 is weaker than 1 : 4, because there is more water for every part of squash.",
      diagram: `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar model: 12 red beads make 2 boxes of 6 and 18 blue beads make 3 boxes of 6, so 12 : 18 simplifies to 2 : 3" font-family="sans-serif">
<rect width="480" height="240" fill="#ffffff"/>
<text x="240" y="26" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">12 red beads : 18 blue beads</text>
<g stroke="#334155" stroke-width="1.5">
<rect x="70" y="52" width="80" height="34" fill="#fecaca"/>
<rect x="150" y="52" width="80" height="34" fill="#fecaca"/>
<rect x="70" y="102" width="80" height="34" fill="#bae6fd"/>
<rect x="150" y="102" width="80" height="34" fill="#bae6fd"/>
<rect x="230" y="102" width="80" height="34" fill="#bae6fd"/>
</g>
<g font-size="14" fill="#1f2937">
<text x="16" y="74">Red</text>
<text x="16" y="124">Blue</text>
<text x="330" y="74">12 ÷ 6 = 2 boxes</text>
<text x="330" y="124">18 ÷ 6 = 3 boxes</text>
</g>
<g font-size="13" fill="#1f2937" text-anchor="middle">
<text x="110" y="74">6 beads</text>
<text x="190" y="74">6 beads</text>
<text x="110" y="124">6 beads</text>
<text x="190" y="124">6 beads</text>
<text x="270" y="124">6 beads</text>
<text x="240" y="172">Each box holds 6 beads (the HCF of 12 and 18)</text>
<text x="240" y="226">Red is 2 out of every 5 beads</text>
</g>
<text x="240" y="200" text-anchor="middle" font-size="14" font-weight="bold" fill="#1f2937">12 : 18 = 2 : 3</text>
</svg>`,
      diagramCaption:
        "Grouping the beads into boxes of 6 (the HCF) turns 12 : 18 into 2 boxes : 3 boxes. Same mix, written as small as possible.",
      workedExamples: [
        {
          title: "Different units",
          problem: "Write 45 minutes : 2 hours in its simplest form.",
          steps: [
            "Make the units the same: 2 hours = 120 minutes, so the ratio is 45 : 120.",
            "Find the HCF: 45 = 3 × 15 and 120 = 8 × 15, so the HCF is 15.",
            "Divide both parts by 15: 45 ÷ 15 = 3 and 120 ÷ 15 = 8.",
            "Check: 3 and 8 have no common factor except 1, so the ratio is fully simplified.",
          ],
          answer: "3 : 8",
        },
        {
          title: "Decimals and fractions",
          problem: "Simplify (a) 1.5 : 2 and (b) {{1/2}} : {{1/3}}.",
          steps: [
            "(a) Multiply both parts by 10 to clear the decimal: 1.5 : 2 = 15 : 20.",
            "The HCF of 15 and 20 is 5, so 15 : 20 = 3 : 4.",
            "(b) The denominators are 2 and 3, so multiply both parts by 6 (their LCM): {{1/2 * 6 = 3}} and {{1/3 * 6 = 2}}.",
            "So {{1/2}} : {{1/3}} = 3 : 2. Sense check: a half is more than a third, so the first number should be the bigger one ✓.",
          ],
          answer: "(a) 3 : 4   (b) 3 : 2",
        },
        {
          title: "Ratio to fractions, and the form 1 : n (class example)",
          problem: "a : b = 2 : 5. (a) What fraction of the total is a? (b) Write {{a/b}} and {{b/a}} as fractions. (c) Write a : b in the form 1 : n.",
          steps: [
            "(a) The whole is 2 + 5 = 7 parts and a is 2 of them, so a is {{2/7}} of the total.",
            "(b) {{a/b}} compares part with part, so {{a/b = 2/5}}. Turn it upside down for {{b/a = 5/2}}.",
            "(c) Divide both parts by 2 so that the first part becomes 1: 2 ÷ 2 = 1 and 5 ÷ 2 = 2.5.",
            "So a : b = 1 : 2.5. For every 1 of a there are 2.5 of b, which matches {{b/a = 5/2}} = 2.5 ✓.",
          ],
          answer: "(a) {{2/7}}   (b) {{a/b = 2/5}} and {{b/a = 5/2}}   (c) 1 : 2.5",
        },
      ],
      keyPoints: [
        "Order matters: a : b = 2 : 5 is not the same as b : a = 2 : 5.",
        "Simplify fully by dividing every part by the HCF. Stop when the only common factor is 1.",
        "Tidy up first: same units, then clear decimals (× 10) or fractions (× the common denominator).",
        "a : b = 2 : 5 means a is {{2/7}} of the whole, and {{a/b = 2/5}}.",
        "For 1 : n (or n : 1), divide every part by the number that has to become 1.",
      ],
      whyItWorks:
        "A ratio describes a **mix**, not an amount. Multiplying or dividing every part by the same number is like doubling or halving a recipe: the batch changes size but tastes exactly the same. Dividing by the HCF just regroups everything into the biggest equal boxes possible, so the numbers get as small as they can.",
      memoryTrick:
        "Think **recipe**: scale every ingredient by the same number and it still tastes the same. For fractions, \"part over part\" gives {{a/b}}, and \"part over all the parts\" gives a fraction of the total.",
      examTip:
        "Two classic mark-losers: forgetting to convert units (50 cm : 2 m is 1 : 4, **not** 25 : 1) and stopping too early (6 : 9 is equivalent to 2 : 3, but only 2 : 3 is the simplest form). Keep the order the question uses: \"boys to girls\" means boys first.",
      thinkDeeper:
        "Ravi says: \"Adding the same number to both parts of a ratio keeps it the same, just like multiplying does.\" Test his idea on 1 : 3 by adding 2 to both parts. Is he always right, sometimes right or never right?\n\n" +
        "*Check your thinking:* 1 : 3 becomes 3 : 5, a different mix. The first part was {{1/4}} of the whole and is now {{3/8}}. Adding only keeps the ratio when the two parts are equal (2 : 2 → 4 : 4 is still 1 : 1), so he is only *sometimes* right. Scaling a ratio means multiplying, never adding.",
      quickChecks: [
        {
          question: "Write 40 cm : 1.5 m in its simplest form.",
          answer: { type: "ratio", parts: [4, 15], simplest: true },
          solution:
            "Same units first: 1.5 m = 150 cm, so the ratio is 40 : 150. The HCF of 40 and 150 is 10, so it simplifies to 4 : 15.",
        },
        {
          question: "Write 6 : 15 in the form 1 : n.",
          answer: { type: "ratio", parts: [1, 2.5], unitForm: "1:n" },
          solution: "Divide both parts by 6 so the first part becomes 1: 6 ÷ 6 = 1 and 15 ÷ 6 = 2.5. So 6 : 15 = 1 : 2.5.",
        },
      ],
    },
    // ------------------------------------------------------------------ ra-sharing
    {
      id: "ra-sharing",
      topic: "ra",
      lesson: "Ratio Problems (Try Yourself)",
      heading: "Sharing in a ratio: find what one part is worth",
      discovery: {
        problem:
          "Zara and Omar share some sweets in the ratio 2 : 7. Omar gets 25 more sweets than Zara. How many sweets are there altogether? Try drawing it before you calculate anything.",
        idea:
          "Draw Zara's 2 boxes and Omar's 7 boxes, lined up on the left. Omar's bar sticks out by 7 − 2 = 5 boxes, and those 5 boxes are the 25 extra sweets. So 1 box = 25 ÷ 5 = 5 sweets, and all 9 boxes = 45 sweets. Whatever you're told (the total, one share or the difference), match it to its boxes and find **one** box first.",
      },
      body:
        "Every sharing question asks the same thing in disguise: **what is one part worth?** Draw a **bar model** (one equal box for each part), then match the number you're given to the right boxes.\n\n" +
        "**1. You know the total.** Share £40 between Hana and Jun in the ratio 3 : 5.\n\n" +
        "    Total parts: 3 + 5 = 8\n" +
        "    1 part = £40 ÷ 8 = £5\n" +
        "    Hana: 3 × £5 = £15    Jun: 5 × £5 = £25\n" +
        "    Check: £15 + £25 = £40 ✓\n\n" +
        "Another way to see it: Hana has 3 of the 8 parts, so she gets {{3/8}} of £40 = £15. The bar model is just this fraction drawn out.\n\n" +
        "**2. You know one share.** If Mae's share is her 5 boxes, divide *her* amount by 5, not by the total number of parts. Then multiply to get anything else (worked example 1).\n\n" +
        "**3. You know the difference.** Line the two bars up on the left. The boxes that stick out are the difference. For children : adults = 7 : 13, the adults have 13 − 7 = **6 extra parts**, so divide the difference by 6 (worked example 2).\n\n" +
        "| You are told… | It matches… | so 1 part = |\n" +
        "|---|---|---|\n" +
        "| the total | all the parts | total ÷ sum of the parts |\n" +
        "| one person's share | that person's parts | share ÷ their parts |\n" +
        "| the difference | the difference in parts | difference ÷ difference in parts |\n\n" +
        "**Three-part ratios** work in exactly the same way: the total is all three parts added together. Sometimes the ratio is hidden in words, like \"Lucy gets twice as much as Mary\". Build the ratio first by giving boxes to the person everyone is compared with, then share (worked example 3).\n\n" +
        "**Always check** that your shares add up to the total and that they really are in the ratio: £15 : £25 simplifies back to 3 : 5 ✓.",
      diagram: `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two bar models. Top: Mo has 3 boxes and Mae has 5 boxes. Mae's 5 boxes are 45 pounds, so each box is 9 pounds and all 8 boxes are 72 pounds. Bottom: children have 7 boxes and adults have 13 boxes. The 6 extra adult boxes are 42 people, so each box is 7 and there are 49 children." font-family="sans-serif">
<rect width="480" height="300" fill="#ffffff"/>
<g stroke="#334155" stroke-width="1.5" fill="#c7d2fe">
<rect x="56" y="32" width="40" height="30"/>
<rect x="96" y="32" width="40" height="30"/>
<rect x="136" y="32" width="40" height="30"/>
</g>
<g stroke="#334155" stroke-width="1.5" fill="#fde68a">
<rect x="56" y="70" width="40" height="30"/>
<rect x="96" y="70" width="40" height="30"/>
<rect x="136" y="70" width="40" height="30"/>
<rect x="176" y="70" width="40" height="30"/>
<rect x="216" y="70" width="40" height="30"/>
</g>
<g fill="#1f2937" font-size="12" text-anchor="middle">
<text x="76" y="51">£9</text>
<text x="116" y="51">£9</text>
<text x="156" y="51">£9</text>
<text x="76" y="89">£9</text>
<text x="116" y="89">£9</text>
<text x="156" y="89">£9</text>
<text x="196" y="89">£9</text>
<text x="236" y="89">£9</text>
</g>
<path d="M318 32 H326 V100 H318" fill="none" stroke="#334155" stroke-width="1.5"/>
<line x1="12" y1="140" x2="468" y2="140" stroke="#94a3b8" stroke-dasharray="4 4"/>
<g stroke="#334155" stroke-width="1" fill="#bbf7d0">
<rect x="76" y="174" width="26" height="26"/>
<rect x="102" y="174" width="26" height="26"/>
<rect x="128" y="174" width="26" height="26"/>
<rect x="154" y="174" width="26" height="26"/>
<rect x="180" y="174" width="26" height="26"/>
<rect x="206" y="174" width="26" height="26"/>
<rect x="232" y="174" width="26" height="26"/>
</g>
<g stroke="#334155" stroke-width="1" fill="#c7d2fe">
<rect x="76" y="210" width="26" height="26"/>
<rect x="102" y="210" width="26" height="26"/>
<rect x="128" y="210" width="26" height="26"/>
<rect x="154" y="210" width="26" height="26"/>
<rect x="180" y="210" width="26" height="26"/>
<rect x="206" y="210" width="26" height="26"/>
<rect x="232" y="210" width="26" height="26"/>
</g>
<g stroke="#334155" stroke-width="1" fill="#fde68a">
<rect x="258" y="210" width="26" height="26"/>
<rect x="284" y="210" width="26" height="26"/>
<rect x="310" y="210" width="26" height="26"/>
<rect x="336" y="210" width="26" height="26"/>
<rect x="362" y="210" width="26" height="26"/>
<rect x="388" y="210" width="26" height="26"/>
</g>
<path d="M258 242 V248 H414 V242" fill="none" stroke="#334155" stroke-width="1.5"/>
<g fill="#1f2937" font-size="13">
<text x="12" y="20" font-weight="bold">Mo : Mae = 3 : 5, and Mae gets £45</text>
<text x="12" y="52">Mo</text>
<text x="12" y="90">Mae</text>
<text x="186" y="52">= £27</text>
<text x="266" y="90">= £45</text>
<text x="336" y="71">8 parts = £72</text>
<text x="12" y="124">1 part = £45 ÷ 5 = £9</text>
<text x="12" y="162" font-weight="bold">Children : adults = 7 : 13, and there are 42 more adults</text>
<text x="12" y="191">Children</text>
<text x="12" y="227">Adults</text>
<text x="336" y="266" text-anchor="middle">6 extra parts = 42 adults</text>
<text x="12" y="292">1 part = 42 ÷ 6 = 7, so children = 7 × 7 = 49</text>
</g>
</svg>`,
      diagramCaption:
        "Top: Mae's 5 boxes are £45, so each box is £9 and all 8 boxes are £72. Bottom: the 6 adult boxes that stick out are the 42 extra adults, so each box is 7 and the children's 7 boxes make 49.",
      workedExamples: [
        {
          title: "Given one share (class example)",
          problem: "Mo and Mae share some money in the ratio 3 : 5. Mae receives £45. How much money was shared?",
          steps: [
            "Draw a bar model: Mo has 3 boxes and Mae has 5 boxes, so there are 8 boxes altogether.",
            "Mae's 5 boxes are worth £45, so 1 box = £45 ÷ 5 = £9.",
            "The total is 8 boxes: 8 × £9 = £72.",
            "Check: Mo gets 3 × £9 = £27, and £27 + £45 = £72 ✓.",
          ],
          answer: "£72",
        },
        {
          title: "Given the difference (class example)",
          problem: "In a sports club the ratio of children to adults is 7 : 13. There are 42 more adults than children. How many children are in the club?",
          steps: [
            "Line up the bars: children have 7 boxes and adults have 13 boxes.",
            "The adults have 13 − 7 = 6 more boxes, and these 6 boxes are the 42 extra adults.",
            "1 box = 42 ÷ 6 = 7 people.",
            "Children = 7 boxes = 7 × 7 = 49.",
            "Check: adults = 13 × 7 = 91, and 91 − 49 = 42 ✓.",
          ],
          answer: "49 children",
        },
        {
          title: "A three-part ratio hidden in words (class example)",
          problem:
            "Lucy, Mary and Nancy share £180. Lucy receives twice as much as Mary. Nancy receives 50% more than Mary. How much does each person receive?",
          steps: [
            "Everyone is compared with Mary, so start with Mary's boxes. Nancy gets 50% more than Mary, so give Mary **2** boxes to avoid half boxes.",
            "Nancy gets 50% more: 2 + 1 = 3 boxes. Lucy gets twice Mary's share: 4 boxes.",
            "So Lucy : Mary : Nancy = 4 : 2 : 3, which is 4 + 2 + 3 = 9 boxes altogether.",
            "1 box = £180 ÷ 9 = £20.",
            "Lucy = 4 × £20 = £80, Mary = 2 × £20 = £40, Nancy = 3 × £20 = £60.",
            "Check: £80 + £40 + £60 = £180 ✓. Lucy has twice Mary's £40 ✓, and Nancy has £40 + £20 (50% more) ✓.",
          ],
          answer: "Lucy £80, Mary £40, Nancy £60",
        },
      ],
      keyPoints: [
        "Draw a bar model: one equal box for each part.",
        "Match what you know to its boxes: the total → all the parts; one share → that person's parts; the difference → the difference in parts.",
        "Find **1 part** first, then multiply to get whatever the question asks for.",
        "A share is also a fraction of the total: with 3 : 5, the first person gets {{3/8}} of it.",
        "Check that the shares add up to the total and simplify back to the ratio.",
      ],
      whyItWorks:
        "A ratio like 3 : 5 means the amount comes in equal-sized boxes: 3 for one person and 5 for the other. Because every box is the same size, any amount you know (a share, the total or a difference) is just a number of boxes. Divide to get one box, and every other amount follows by multiplying.",
      memoryTrick:
        "**Find ONE, then find ANY.** Once you know what one part is worth, you can build any share, the total or the difference.",
      examTip:
        "The most common slip is dividing ONE person's share by the TOTAL number of parts. Mae's £45 is her 5 parts, so 1 part = £45 ÷ 5 = £9, not £45 ÷ 8. Before you divide, ask yourself: \"How many boxes is this amount?\"",
      thinkDeeper:
        "Ethan says: \"If two people share money in the ratio 3 : 5, the second person gets {{5/3}} of the total.\" What is his mistake? What fraction of the total does the second person really get, and what does {{5/3}} describe?\n\n" +
        "*Check your thinking:* the total is 3 + 5 = 8 parts, so the second person gets {{5/8}} of the total. {{5/3}} compares the two shares (part with part): the second share is {{5/3}} = {{1 2/3}} times the first share.",
      quickChecks: [
        {
          question: "Tom and Jerry share some money in the ratio 4 : 9. Tom gets $24. How much does Jerry get? Give your answer in $.",
          answer: { type: "number", value: 54, display: "$54" },
          solution: "Tom's 4 parts are $24, so 1 part = $24 ÷ 4 = $6. Jerry has 9 parts: 9 × $6 = $54.",
        },
        {
          question:
            "Aisha, Ravi and Siti share some sweets in the ratio 2 : 3 : 7. Siti gets 30 more sweets than Aisha. How many sweets are there altogether?",
          answer: { type: "number", value: 72, display: "72 sweets" },
          solution:
            "Siti has 7 − 2 = 5 more parts than Aisha, and those 5 parts are the 30 extra sweets, so 1 part = 30 ÷ 5 = 6. Altogether there are 2 + 3 + 7 = 12 parts, so 12 × 6 = 72 sweets.",
        },
      ],
    },
    // ------------------------------------------------------------------ ra-proportion
    {
      id: "ra-proportion",
      topic: "ra",
      lesson: "Mixing Paints",
      heading: "Part : part, part : whole, and joining ratios together",
      discovery: {
        problem:
          "Glass A is made with squash : water = 1 : 4. Glass B is made with squash : water = 2 : 7. Wei Ling says B must be weaker, because it has 7 parts of water instead of 4. Is she right?",
        idea:
          "No: B also has twice as much squash! Compare like with like. **Make the squash equal**: A = 1 : 4 = 2 : 8, while B = 2 : 7. Same squash, but B has less water, so **B is stronger**. Or compare each glass as a fraction of the whole drink: A is {{1/5}} squash and B is {{2/9}} squash, and {{2/9 = 10/45}} is bigger than {{1/5 = 9/45}}. A ratio compares part with part; a proportion compares a part with the whole.",
      },
      body:
        "A **ratio** compares **part with part**. A **proportion** compares a **part with the whole**, usually as a fraction or a percentage. Test questions switch between the two, so keep asking: *is this a part, or the whole?*\n\n" +
        "For squash : water = 1 : 4, the whole drink is 1 + 4 = **5 parts**:\n\n" +
        "| Statement | Type | Value |\n" +
        "|---|---|---|\n" +
        "| squash : water | part : part | 1 : 4 |\n" +
        "| squash as a fraction of the drink | part : whole | {{1/5}} (20%) |\n" +
        "| water as a fraction of the drink | part : whole | {{4/5}} (80%) |\n" +
        "| water compared with squash | part : part | 4 times as much |\n\n" +
        "A classic slip is saying the squash is {{1/4}} of the drink. {{1/4}} compares the squash with the *water*, not with the whole drink.\n\n" +
        "**Comparing two mixes.** \"Which squash is stronger?\" or \"Which paint is bluer?\" can't be answered by looking at one number. Use either:\n" +
        "1. **Fractions of the whole**: turn each mix into a fraction of its total, then compare using a common denominator (or percentages).\n" +
        "2. **Make one part equal**: scale both ratios so one ingredient matches, then compare the other one.\n\n" +
        "**Describing one amount using another.** If x : y = 4 : 9, then x is {{4/9}} of y, so {{x = 4y/9}}. The other way round, y is {{9/4}} = 2.25 times x, so y is **125% larger** than x. It works backwards too: profits 75% higher than costs means profit = 1.75 × cost, so profit : cost = 1.75 : 1 = 7 : 4.\n\n" +
        "**Combining ratios: make the shared part equal.** If red : blue = 2 : 3 and blue : green = 2 : 1, you can't just write 2 : 3 : 1. Blue is the same paint in both ratios, but it is 3 parts in one and 2 parts in the other, so the parts must be different sizes. Scale both ratios until blue has the same number, using the LCM of 3 and 2, which is 6:\n\n" +
        "    red : blue = 2 : 3 = 4 : 6    (× 2)\n" +
        "    blue : green = 2 : 1 = 6 : 3    (× 3)\n" +
        "    so red : blue : green = 4 : 6 : 3\n\n" +
        "The picture shows why this is allowed: cutting every box into smaller equal pieces doesn't change the amount of paint. It just lets both ratios use the same size of part.",
      diagram: `<svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Combining ratios with bars. Red to blue is 2 : 3; cutting each box in 2 gives 4 : 6. Blue to green is 2 : 1; cutting each box in 3 gives 6 : 3. Blue is now 6 equal parts in both rows, so red to blue to green is 4 : 6 : 3." font-family="sans-serif">
<rect width="480" height="250" fill="#ffffff"/>
<g stroke="#64748b" stroke-width="1">
<g fill="#fecaca">
<rect x="45" y="26" width="30" height="28"/>
<rect x="75" y="26" width="30" height="28"/>
<rect x="105" y="26" width="30" height="28"/>
<rect x="135" y="26" width="30" height="28"/>
<rect x="45" y="156" width="30" height="28"/>
<rect x="75" y="156" width="30" height="28"/>
<rect x="105" y="156" width="30" height="28"/>
<rect x="135" y="156" width="30" height="28"/>
</g>
<g fill="#bae6fd">
<rect x="165" y="26" width="30" height="28"/>
<rect x="195" y="26" width="30" height="28"/>
<rect x="225" y="26" width="30" height="28"/>
<rect x="255" y="26" width="30" height="28"/>
<rect x="285" y="26" width="30" height="28"/>
<rect x="315" y="26" width="30" height="28"/>
<rect x="165" y="90" width="30" height="28"/>
<rect x="195" y="90" width="30" height="28"/>
<rect x="225" y="90" width="30" height="28"/>
<rect x="255" y="90" width="30" height="28"/>
<rect x="285" y="90" width="30" height="28"/>
<rect x="315" y="90" width="30" height="28"/>
<rect x="165" y="156" width="30" height="28"/>
<rect x="195" y="156" width="30" height="28"/>
<rect x="225" y="156" width="30" height="28"/>
<rect x="255" y="156" width="30" height="28"/>
<rect x="285" y="156" width="30" height="28"/>
<rect x="315" y="156" width="30" height="28"/>
</g>
<g fill="#bbf7d0">
<rect x="345" y="90" width="30" height="28"/>
<rect x="375" y="90" width="30" height="28"/>
<rect x="405" y="90" width="30" height="28"/>
<rect x="345" y="156" width="30" height="28"/>
<rect x="375" y="156" width="30" height="28"/>
<rect x="405" y="156" width="30" height="28"/>
</g>
</g>
<g fill="none" stroke="#1f2937" stroke-width="2.5">
<rect x="45" y="26" width="60" height="28"/>
<rect x="105" y="26" width="60" height="28"/>
<rect x="165" y="26" width="60" height="28"/>
<rect x="225" y="26" width="60" height="28"/>
<rect x="285" y="26" width="60" height="28"/>
<rect x="165" y="90" width="90" height="28"/>
<rect x="255" y="90" width="90" height="28"/>
<rect x="345" y="90" width="90" height="28"/>
</g>
<g fill="#1f2937" font-size="13">
<text x="45" y="18">red : blue = 2 : 3 → cut each box in 2 → 4 : 6</text>
<text x="45" y="82">blue : green = 2 : 1 → cut each box in 3 → 6 : 3</text>
<text x="45" y="148" font-weight="bold">red : blue : green = 4 : 6 : 3</text>
<text x="240" y="212" text-anchor="middle">Blue is the same paint in both ratios, so give it</text>
<text x="240" y="232" text-anchor="middle">the same number: the LCM of 3 and 2 is 6.</text>
</g>
</svg>`,
      diagramCaption:
        "Thick boxes are the original ratios. Cutting them into equal small parts makes blue 6 parts in both rows, so the ratios join up: red : blue : green = 4 : 6 : 3.",
      workedExamples: [
        {
          title: "Which paint is bluer? (Mixing Paints)",
          problem:
            "Arjun mixes blue and yellow paint in the ratio 3 : 5. Mei mixes blue and yellow paint in the ratio 4 : 7. (a) What fraction of Arjun's paint is blue? (b) Whose paint has the greater proportion of blue?",
          steps: [
            "(a) Arjun's paint has 3 + 5 = 8 parts, and 3 of them are blue, so {{3/8}} of his paint is blue.",
            "(b) Method 1, fractions of the whole: Mei's paint has 4 + 7 = 11 parts, so {{4/11}} of it is blue.",
            "Use the common denominator 88: {{3/8 = 33/88}} and {{4/11 = 32/88}}. Since {{33/88}} is bigger, Arjun's paint is bluer.",
            "Method 2, make the blue equal: the LCM of 3 and 4 is 12. Arjun's 3 : 5 = 12 : 20 and Mei's 4 : 7 = 12 : 21.",
            "Same amount of blue, but Mei's paint has more yellow, so hers is less blue. Both methods agree ✓.",
          ],
          answer: "(a) {{3/8}}   (b) Arjun's paint (only just!)",
        },
        {
          title: "Combining two ratios (class example)",
          problem: "In a paint mix, red : blue = 2 : 3 and blue : green = 2 : 1. (a) Find the ratio red : blue : green. (b) What fraction of the mix is green?",
          steps: [
            "Blue is in both ratios, but it is 3 in the first and 2 in the second. Make blue the same: the LCM of 3 and 2 is 6.",
            "red : blue = 2 : 3 = 4 : 6 (multiply both parts by 2).",
            "blue : green = 2 : 1 = 6 : 3 (multiply both parts by 3).",
            "Blue now matches, so red : blue : green = 4 : 6 : 3. The numbers 4, 6 and 3 have no common factor, so this is the simplest form.",
            "(b) The whole mix is 4 + 6 + 3 = 13 parts and green is 3 of them, so green is {{3/13}} of the mix.",
          ],
          answer: "(a) 4 : 6 : 3   (b) {{3/13}}",
        },
        {
          title: "A chain of equal amounts (Ratio Puzzles 1★: Printer Ink)",
          problem:
            "A small printer cartridge prints 600 pages. 3 small cartridges print as many pages as 2 medium cartridges, and 3 medium cartridges print as many pages as 2 large cartridges. How many pages does a large cartridge print?",
          steps: [
            "3 small cartridges print 3 × 600 = 1800 pages. That's the same as 2 medium ones, so 1 medium prints 1800 ÷ 2 = 900 pages.",
            "3 medium cartridges print 3 × 900 = 2700 pages. That's the same as 2 large ones, so 1 large prints 2700 ÷ 2 = 1350 pages.",
            "Another way, make the shared part equal: 3 small do the same job as 2 medium, so 9 small do the same job as 6 medium. And 3 medium do the same job as 2 large, so 6 medium do the same job as 4 large.",
            "So 9 small do the same job as 4 large. 9 small print 9 × 600 = 5400 pages, so 1 large prints 5400 ÷ 4 = 1350 pages ✓.",
            "Sense check: each size prints 1.5 times as much as the size below it (600 → 900 → 1350).",
          ],
          answer: "1350 pages",
        },
      ],
      keyPoints: [
        "Ratio = part : part. Proportion = part ÷ whole. For 1 : 4 the whole is 5 parts, so the first part is {{1/5}} of it, not {{1/4}}.",
        "To compare two mixes, compare fractions of the whole, or scale so that one ingredient is the same.",
        "x : y = 4 : 9 means x is {{4/9}} of y ({{x = 4y/9}}), and y is 2.25 times x, which is 125% larger.",
        "To join a : b and b : c, make the shared part b equal using the LCM, then read off a : b : c.",
      ],
      whyItWorks:
        "A ratio fixes the mix but not the size of a part, so each ratio can be scaled freely. When two ratios share an ingredient, that ingredient is one real amount, so both ratios must give it the same number. Scaling to the LCM makes the parts the same size in both ratios, and then they fit together.",
      memoryTrick: "**Shared part? Make it match!** When the same thing appears in two ratios, match its numbers before you join them.",
      examTip:
        "Never join ratios by writing the numbers side by side: 2 : 3 and 2 : 1 is **not** 2 : 3 : 1. And for \"what fraction of the total\", the denominator is the sum of **all** the parts: the squash in 1 : 4 is {{1/5}} of the drink, not {{1/4}}.",
      thinkDeeper:
        "Mixing More Paints: paint A has red : white = 1 : 3 and paint B has red : white = 1 : 1. Jun mixes 4 litres of A with 6 litres of B. He says the new ratio is 2 : 4, because 1 + 1 = 2 and 3 + 1 = 4. Is he right? What is the real ratio of red to white?\n\n" +
        "*Check your thinking:* no. 4 litres of A is 1 litre of red and 3 litres of white (4 parts of 1 litre). 6 litres of B is 3 litres of red and 3 litres of white (2 parts of 3 litres). Together that's 4 litres of red : 6 litres of white = **2 : 3**. You can add actual amounts, but never the numbers from two different ratios, because their parts are different sizes.",
      quickChecks: [
        {
          question:
            "How Many Swimmers (Ratio Puzzles 2★): in a swimming club, juniors : seniors = 3 : 2 and seniors : veterans = 5 : 2. Write juniors : seniors : veterans as one ratio in its simplest form.",
          answer: { type: "ratio", parts: [15, 10, 4], simplest: true },
          solution:
            "Seniors are 2 in one ratio and 5 in the other, so make them 10 (the LCM). 3 : 2 = 15 : 10 (× 5) and 5 : 2 = 10 : 4 (× 2), so juniors : seniors : veterans = 15 : 10 : 4. That also means the smallest possible club has 15 + 10 + 4 = 29 members.",
        },
        {
          question: "x : y = 4 : 9. By what percentage is y larger than x?",
          answer: { type: "number", value: 125, display: "125%" },
          solution:
            "y is {{9/4}} = 2.25 times x. That's x plus another 1.25x, so y is 125% larger than x. Check with x = 4 and y = 9: the increase is 5, and {{5/4}} = 1.25 = 125%.",
        },
      ],
    },
    // @@NEXT_SECTION@@
  ],
  flashcards: [],
  cram: [],
};
