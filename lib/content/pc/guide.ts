import type { TopicGuide } from "../../types";

// Revision guide — Percentages (Unit 1).
// Sections follow lib/sections.ts: pc-fdp, pc-of-amount, pc-change, pc-percent-change, pc-multipliers.

export const GUIDE_PC: TopicGuide = {
  topic: "pc",
  sections: [
    // -----------------------------------------------------------------------
    // 1. Fractions, decimals & percentages
    // -----------------------------------------------------------------------
    {
      id: "pc-fdp",
      topic: "pc",
      lesson: "Percentage Problems (MathsPAD)",
      heading: "One number, three outfits: fractions, decimals and percentages",
      discovery: {
        problem: "Which is bigger: {{3/8}} or 38%? Decide without a calculator — and without guessing!",
        idea: "Put them in the same 'outfit' first. You know {{1/4}} = 25%, and {{1/8}} is half of a quarter, so {{1/8}} = 12.5%. Then {{3/8}} = 3 × 12.5% = 37.5%. That's just under 38%, so **38% is bigger** — by only half a percent! Once two numbers are written the same way, comparing them is easy.",
      },
      body:
        "**Per cent** means 'out of 100'. So 36% means 36 out of 100 — the fraction {{36/100}}, or the decimal 0.36. Fractions, decimals and percentages are **three ways of writing the same number**, like one person in three different outfits.\n\n" +
        "**How to convert**\n" +
        "- **Percentage → decimal:** divide by 100. 36% = 0.36, 12.5% = 0.125, and 5% = 0.05 (not 0.5!).\n" +
        "- **Decimal → percentage:** multiply by 100. 0.4 = 40% and 0.375 = 37.5%.\n" +
        "- **Percentage → fraction:** write it over 100, then simplify. 35% = {{35/100}} = {{7/20}} (divide the top and bottom by 5).\n" +
        "- **Fraction → percentage:** if the denominator is a factor of 100 (2, 4, 5, 10, 20, 25 or 50), scale it up to 100: {{7/20}} = {{35/100}} = 35%. If it isn't, divide the top by the bottom: {{3/8}} = 3 ÷ 8 = 0.375 = 37.5%.\n\n" +
        "**Must-know equivalents** — learn these like your times tables:\n\n" +
        "| Fraction | Decimal | Percentage |\n" +
        "|---|---|---|\n" +
        "| {{1/2}} | 0.5 | 50% |\n" +
        "| {{1/4}} | 0.25 | 25% |\n" +
        "| {{3/4}} | 0.75 | 75% |\n" +
        "| {{1/5}} | 0.2 | 20% |\n" +
        "| {{1/10}} | 0.1 | 10% |\n" +
        "| {{1/100}} | 0.01 | 1% |\n" +
        "| {{1/8}} | 0.125 | 12.5% |\n" +
        "| {{1/3}} | 0.333… | about 33.3% |\n" +
        "| {{2/3}} | 0.666… | about 66.7% |\n\n" +
        "Use the ones you know to build new ones. {{1/8}} is half of {{1/4}}, so it is half of 25%, which is 12.5%; {{3/8}} is three of those, 37.5%. {{1/3}} and {{2/3}} are **recurring decimals** — the 3s and 6s go on for ever — so 33.3% and 66.7% are rounded. Exactly, {{1/3}} = {{33 1/3}}%.\n\n" +
        "**Ordering a mixed list**\n" +
        "1. Change everything into a **decimal**.\n" +
        "2. Give them all the **same number of decimal places** by adding zeros on the end.\n" +
        "3. Compare digit by digit from the left, then write your answer using the numbers in their **original** form.\n\n" +
        "This beats the classic trap of thinking 0.309 is bigger than 0.31 because '309 is bigger than 31'. Written as 0.310, the 0.31 is clearly the bigger one.",
      diagram: `<svg viewBox="0 0 480 188" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bar from 0 to 1 split into eighths, with three eighths shaded. Fractions above the bar line up with percentages and decimals below it: one eighth is 12.5% or 0.125, one quarter is 25% or 0.25, three eighths is 37.5% or 0.375, one half is 50% or 0.5, and three quarters is 75% or 0.75." font-family="sans-serif" font-size="13" fill="#1f2937">
  <rect width="480" height="188" fill="#ffffff"/>
  <rect x="100" y="58" width="135" height="36" fill="#bbf7d0"/>
  <rect x="100" y="58" width="360" height="36" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M100 52V100M145 52V100M190 52V100M235 52V100M280 52V100M325 52V100M370 52V100M415 52V100M460 52V100" fill="none" stroke="#334155" stroke-width="1.2"/>
  <path d="M138 31H152M183 31H197M228 31H242M273 31H287M363 31H377" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <g font-size="12" fill="#334155">
    <text x="8" y="40">Fraction</text>
    <text x="8" y="122">Percentage</text>
    <text x="8" y="146">Decimal</text>
  </g>
  <g text-anchor="middle">
    <text x="100" y="40">0</text>
    <text x="145" y="26">1</text>
    <text x="145" y="45">8</text>
    <text x="190" y="26">1</text>
    <text x="190" y="45">4</text>
    <text x="235" y="26" font-weight="700">3</text>
    <text x="235" y="45" font-weight="700">8</text>
    <text x="280" y="26">1</text>
    <text x="280" y="45">2</text>
    <text x="370" y="26">3</text>
    <text x="370" y="45">4</text>
    <text x="460" y="40">1</text>
    <text x="100" y="122">0%</text>
    <text x="145" y="122">12.5%</text>
    <text x="190" y="122">25%</text>
    <text x="235" y="122" font-weight="700">37.5%</text>
    <text x="280" y="122">50%</text>
    <text x="370" y="122">75%</text>
    <text x="460" y="122">100%</text>
    <text x="100" y="146">0</text>
    <text x="145" y="146">0.125</text>
    <text x="190" y="146">0.25</text>
    <text x="235" y="146" font-weight="700">0.375</text>
    <text x="280" y="146">0.5</text>
    <text x="370" y="146">0.75</text>
    <text x="460" y="146">1</text>
    <text x="240" y="176">Shaded: 3 of the 8 equal parts = 37.5% = 0.375</text>
  </g>
</svg>`,
      diagramCaption: "A double number line: fractions above the bar, percentages and decimals below. Each eighth is 12.5%, so {{3/8}} = 37.5% = 0.375 — just under 38%.",
      workedExamples: [
        {
          title: "Class starter: put them in order",
          problem: "Put these in ascending order (smallest first): 0.31, 36%, {{7/20}}, 0.309.",
          steps: [
            "Change everything into a decimal. 36% = 36 ÷ 100 = 0.36.",
            "{{7/20}}: 20 is a factor of 100, so multiply the top and bottom by 5. {{7/20}} = {{35/100}} = 0.35.",
            "Give every number three decimal places: 0.310, 0.360, 0.350 and 0.309.",
            "Compare digit by digit from the left: 0.309 < 0.310 < 0.350 < 0.360.",
            "Write the answer using the numbers exactly as they were given.",
          ],
          answer: "0.309, 0.31, {{7/20}}, 36%",
        },
        {
          title: "Who did better?",
          problem: "Arjun scored {{17/20}} in a spelling test. Priya scored 84%. Who did better?",
          steps: [
            "Change Arjun's fraction into a percentage so you are comparing like with like.",
            "20 × 5 = 100, so multiply the top and bottom by 5: {{17/20}} = {{85/100}} = 85%.",
            "85% is more than 84%.",
          ],
          answer: "Arjun did better: 85% beats 84%.",
        },
        {
          title: "Percentage → fraction in its simplest form",
          problem: "Write 12.5% as a fraction in its simplest form.",
          steps: [
            "Write it over 100: 12.5% = {{12.5/100}}.",
            "Clear the decimal by doubling the top and the bottom: {{25/200}}.",
            "The HCF of 25 and 200 is 25, so divide both by 25: {{1/8}}.",
            "Check: 1 ÷ 8 = 0.125 = 12.5% ✓",
          ],
          answer: "{{1/8}}",
        },
      ],
      keyPoints: [
        "Per cent means 'out of 100': 36% = {{36/100}} = 0.36.",
        "Percentage → decimal: ÷ 100 (so 5% = 0.05). Decimal → percentage: × 100.",
        "Fraction → percentage: scale the denominator to 100 if you can ({{7/20}} = {{35/100}} = 35%); otherwise divide the top by the bottom.",
        "Know the key equivalents, including {{1/8}} = 0.125 = 12.5%, {{1/3}} ≈ 33.3% and {{2/3}} ≈ 66.7%.",
        "To order a mixed list, change everything to decimals with the same number of decimal places.",
      ],
      whyItWorks: "A percentage is a fraction with a denominator of 100, and the second decimal place is the hundredths column. So 36%, {{36/100}} and 0.36 all mean '36 hundredths' — the same amount. Multiplying or dividing by 100 just switches between counting in hundredths and counting in wholes.",
      memoryTrick: "*Cent* means 100: a **cent**ury is 100 years and there are 100 **cent**s in a dollar. So per cent = 'per hundred'. Decimal → percentage makes the number look bigger (0.36 → 36), so you × 100; percentage → decimal makes it smaller, so you ÷ 100.",
      examTip: "Watch single-digit percentages: 5% = 0.05, not 0.5 (0.5 is 50%). And never order decimals by how many digits they have — 0.309 is *smaller* than 0.31. Pad with zeros (0.310) before you compare.",
      thinkDeeper: "Siti says: '0.5% is the same as a half.' Is she right? Write 0.5% as a decimal and as a fraction in its simplest form, and explain her mistake. (Hint: 0.5% means 0.5 out of 100.)",
      quickChecks: [
        {
          question: "Write {{7/25}} as a percentage.",
          answer: { type: "number", value: 28, display: "28%" },
          solution: "25 × 4 = 100, so multiply the top and bottom by 4: {{7/25}} = {{28/100}} = 28%.",
        },
        {
          question: "Write 35% as a fraction in its simplest form.",
          answer: { type: "fraction", n: 7, d: 20, simplest: true },
          solution: "35% = {{35/100}}. The HCF of 35 and 100 is 5, so divide the top and bottom by 5: {{7/20}}.",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 2. Percentage of an amount; one number as a percentage of another
    // -----------------------------------------------------------------------
    {
      id: "pc-of-amount",
      topic: "pc",
      lesson: "Percentage Problems (MathsPAD)",
      heading: "Percentages of amounts, and A as a percentage of B",
      discovery: {
        problem: "Which is easier to work out in your head: 8% of 50, or 50% of 8? Work out both. What do you notice?",
        idea: "They are both **4**! '8% of 50' means 8 × 50 ÷ 100, and '50% of 8' means 50 × 8 ÷ 100 — the same numbers, just multiplied in a different order. So x% of y always equals y% of x. When a percentage looks awkward, try flipping it: 4% of 75 = 75% of 4 = 3.",
      },
      body:
        "'r% of' an amount means r hundredths of it. So 10% is {{10/100}} = {{1/10}} of the amount, and 1% is {{1/100}} of it. That gives you a set of **building blocks**:\n\n" +
        "| To find… | Do this |\n" +
        "|---|---|\n" +
        "| 50% | ÷ 2 |\n" +
        "| 25% | ÷ 4 |\n" +
        "| 10% | ÷ 10 |\n" +
        "| 5% | find 10%, then halve it |\n" +
        "| 1% | ÷ 100 |\n\n" +
        "**Without a calculator**, build the percentage you want out of blocks. For 35% of £60:\n\n" +
        "    10% of £60 = £60 ÷ 10 = £6\n" +
        "    30% of £60 = 3 × £6 = £18\n" +
        "    5% of £60 = £6 ÷ 2 = £3\n" +
        "    35% of £60 = £18 + £3 = £21\n\n" +
        "Other useful builds: 15% = 10% + 5%; 2% = 2 × 1%; 17.5% = 10% + 5% + 2.5%; 99% = 100% − 1%.\n\n" +
        "**With a calculator**, change the percentage into a decimal and multiply: 37% of 240 = 0.37 × 240 = 88.8. (That's the start of **multipliers** — see the last section.)\n\n" +
        "**One number as a percentage of another.** Write the part as a **fraction of the whole**, then turn that fraction into a percentage:\n\n" +
        "    percentage = {{part/whole * 100}}\n\n" +
        "For example, 13 out of 20 is {{13/20}} = {{65/100}} = 65%. Without a calculator, simplify the fraction or scale its denominator to 100. With one, type 13 ÷ 20 × 100.\n\n" +
        "Two things to watch:\n" +
        "- The **whole** (the amount after the word 'of') goes on the **bottom**.\n" +
        "- Both amounts must be in the **same units**. 45p as a percentage of £3 is 45 ÷ 300 × 100 = 15%, because £3 = 300p.\n\n" +
        "**A neat trick:** x% of y always equals y% of x, because both mean x × y ÷ 100. So 4% of 25 = 25% of 4 = 1. If a percentage looks awkward, try swapping it round.",
      diagram: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar model of £60 split into ten equal blocks of £6, each worth 10%. Three blocks and half of the fourth block are shaded, showing that 35% of £60 is £18 plus £3, which is £21." font-family="sans-serif" font-size="13" fill="#1f2937">
  <rect width="480" height="200" fill="#ffffff"/>
  <path d="M40 58V50H440V58" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="240" y="42" text-anchor="middle" font-weight="700">100% = £60</text>
  <rect x="40" y="66" width="120" height="40" fill="#bbf7d0"/>
  <rect x="160" y="66" width="20" height="40" fill="#fde68a"/>
  <rect x="40" y="66" width="400" height="40" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M80 66V106M120 66V106M160 66V106M200 66V106M240 66V106M280 66V106M320 66V106M360 66V106M400 66V106" fill="none" stroke="#334155" stroke-width="1.2"/>
  <path d="M180 66V106" fill="none" stroke="#334155" stroke-dasharray="3 3"/>
  <g text-anchor="middle">
    <text x="60" y="91">£6</text>
    <text x="100" y="91">£6</text>
    <text x="140" y="91">£6</text>
    <text x="170" y="90" font-size="12" font-weight="700">£3</text>
    <text x="220" y="91">£6</text>
    <text x="260" y="91">£6</text>
    <text x="300" y="91">£6</text>
    <text x="340" y="91">£6</text>
    <text x="380" y="91">£6</text>
    <text x="420" y="91">£6</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="#334155">
    <text x="40" y="124">0%</text>
    <text x="80" y="124">10%</text>
    <text x="120" y="124">20%</text>
    <text x="160" y="124">30%</text>
    <text x="200" y="124">40%</text>
    <text x="240" y="124">50%</text>
    <text x="280" y="124">60%</text>
    <text x="320" y="124">70%</text>
    <text x="360" y="124">80%</text>
    <text x="400" y="124">90%</text>
    <text x="440" y="124">100%</text>
  </g>
  <path d="M40 134V142H180V134" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <text x="40" y="162" font-weight="700">35% = 30% + 5% = £18 + £3 = £21</text>
  <text x="40" y="184" font-size="12" fill="#334155">10% = £60 ÷ 10 = £6, and 5% is half of 10%, which is £3</text>
</svg>`,
      diagramCaption: "Bar model for 35% of £60: ten blocks of 10%, each worth £6. Three blocks make 30% (£18) and half a block makes 5% (£3).",
      workedExamples: [
        {
          title: "Building blocks (no calculator)",
          problem: "Find 35% of £60 without a calculator.",
          steps: [
            "Find 10% by dividing by 10: £60 ÷ 10 = £6.",
            "30% is three lots of 10%: 3 × £6 = £18.",
            "5% is half of 10%: £6 ÷ 2 = £3.",
            "Add the blocks: 35% = 30% + 5% = £18 + £3 = £21.",
          ],
          answer: "£21",
        },
        {
          title: "From the UKMT Percentage Questions",
          problem: "Work out 6% of 6 plus 8% of 8.",
          steps: [
            "Find 1% of each number first: 1% of 6 = 6 ÷ 100 = 0.06, and 1% of 8 = 8 ÷ 100 = 0.08.",
            "6% of 6 = 6 × 0.06 = 0.36.",
            "8% of 8 = 8 × 0.08 = 0.64.",
            "Add: 0.36 + 0.64 = 1.",
            "A neat way to see it: {{36/100}} + {{64/100}} = {{100/100}} = 1. (And 36 + 64 = 100 because 6² + 8² = 10²!)",
          ],
          answer: "1",
        },
        {
          title: "One number as a percentage of another",
          problem: "Wei Ling scored 18 out of 24 in a quiz. What percentage did she score?",
          steps: [
            "The part is 18 and the whole is 24, so write the fraction {{18/24}}.",
            "Simplify by dividing the top and bottom by 6: {{18/24}} = {{3/4}}.",
            "{{3/4}} = 75%.",
            "With a calculator: 18 ÷ 24 × 100 = 75 ✓",
          ],
          answer: "75%",
        },
      ],
      keyPoints: [
        "Building blocks: 10% → ÷ 10, 1% → ÷ 100, 50% → ÷ 2, 25% → ÷ 4, 5% → half of 10%.",
        "Build any percentage from blocks: 35% = 30% + 5%, and 99% = 100% − 1%.",
        "With a calculator, change the percentage to a decimal and multiply: 37% of 240 = 0.37 × 240.",
        "A as a percentage of B = {{A/B}} × 100 — the part on top, the whole on the bottom.",
        "Put both amounts in the same units first (45p out of £3 → 45 out of 300).",
      ],
      whyItWorks: "10% means {{10/100}} = {{1/10}}, so finding 10% is the same as dividing by 10, and 1% = {{1/100}} means dividing by 100. Percentages of the same amount add up like pieces of one bar, so 30% + 5% = 35%. For 'A as a percentage of B', the fraction {{A/B}} says what part of B you have, and × 100 rewrites that fraction 'out of 100'.",
      memoryTrick: "**'Is' over 'of'**: 'What percentage **is** 18 **of** 24?' → {{18/24}} × 100. The number straight after 'of' is the whole, and it goes underneath.",
      examTip: "Put the whole on the bottom! 18 as a percentage of 24 is {{18/24}} = 75%, not {{24/18}} ≈ 133%. If your answer is over 100% but the part is smaller than the whole, your fraction is upside down.",
      thinkDeeper: "Arjun says: 'To find 20% of something, just divide by 20.' Try his method on 20% of 80, then find the right answer. What percentage does dividing by 20 *actually* find, and why? (Hint: dividing by 20 finds {{1/20}} of the amount.)",
      quickChecks: [
        {
          question: "Work out 15% of £240 without a calculator. Give your answer in £.",
          answer: { type: "number", value: 36, display: "£36" },
          solution: "10% of £240 = £24, and 5% is half of that, £12. So 15% = £24 + £12 = £36.",
        },
        {
          question: "Hana scored 42 out of 60 in a maths quiz. What percentage did she score?",
          answer: { type: "number", value: 70, display: "70%" },
          solution: "{{42/60}}: divide the top and bottom by 6 to get {{7/10}} = 70%. (Or 42 ÷ 60 × 100 = 70.)",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 3. Increase & decrease by a percentage
    // -----------------------------------------------------------------------
    {
      id: "pc-change",
      topic: "pc",
      lesson: "Percentage Change",
      heading: "Increasing and decreasing by a percentage",
      discovery: {
        problem: "A rare trading card was bought for $50. Its value then goes up by 100%. What is it worth now? What if it had gone up by 200%? By 300%? Spot the pattern — then predict its value after a 150% increase.",
        idea: "+100% adds another whole $50, so the value **doubles** to $100. +200% adds two more lots of $50: $150. +300% gives $200. So +150% adds one-and-a-half lots of $50, which is $75, making **$125**. Notice that $125 is 250% of $50: after an increase of r%, you always have (100 + r)% of what you started with.",
      },
      body:
        "When an amount goes **up or down by a percentage**, the percentage is always worked out on the **original** amount. Your class notes use two methods — learn both.\n\n" +
        "**Method 1: find the change, then add it on or take it off.**\n\n" +
        "    Increase 70 by 10%: 10% of 70 = 7, so 70 + 7 = 77\n" +
        "    Decrease 80 by 10%: 10% of 80 = 8, so 80 − 8 = 72\n\n" +
        "**Method 2: work out what percentage you end up with.** The original is 100%. After a 10% increase you have 100% + 10% = **110%** of it. After a 30% decrease you have 100% − 30% = **70%** left.\n\n" +
        "    Decrease 40 by 30%: 70% of 40 = 7 × 4 = 28\n\n" +
        "Method 2 takes one step instead of two, and it leads straight to **multipliers** (110% = × 1.1 and 70% = × 0.7) — the quickest method on a calculator.\n\n" +
        "**Spot the direction.** These words tell you whether to add or subtract:\n\n" +
        "| Increase (add on) | Decrease (take off) |\n" +
        "|---|---|\n" +
        "| VAT (UK sales tax, usually 20%) | discount, sale, '% off' |\n" +
        "| GST (Singapore sales tax, 9%) | depreciation (losing value) |\n" +
        "| pay rise, inflation, interest | reduction, loss |\n\n" +
        "**Increases bigger than 100%.** An increase of 100% adds the whole amount on again, so the amount **doubles**. An increase of 150% adds one-and-a-half lots: increasing 40 by 150% gives 40 + 60 = 100, which is 250% of 40. Increases have no upper limit — but a price or a weight can only fall by 100% at most (down to zero).\n\n" +
        "**Multi-step problems.** Check what each percentage is a percentage *of*. In the class lamps question, the 15% tax is added to the total for all 4 lamps, so work out 4 × £20 = £80 first, then increase that.\n\n" +
        "**Finish the job.** If the question asks for the new price, finding 20% of £800 = £160 is only halfway — the new price is £800 + £160 = £960. Before you write your answer, ask: *is this the change, or the new amount?*",
      diagram: `<svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three bars built from 10% blocks. The original bar has 10 blocks, which is 100%. A 20% increase adds 2 extra blocks to make 120%, multiplier 1.2. A 30% decrease removes 3 blocks, leaving 70%, multiplier 0.7." font-family="sans-serif" font-size="13" fill="#1f2937">
  <rect width="480" height="250" fill="#ffffff"/>
  <path d="M380 30V218" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2 4"/>
  <rect x="130" y="40" width="250" height="30" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M155 40V70M180 40V70M205 40V70M230 40V70M255 40V70M280 40V70M305 40V70M330 40V70M355 40V70" fill="none" stroke="#1f2937"/>
  <rect x="130" y="110" width="250" height="30" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <rect x="380" y="110" width="50" height="30" fill="#bbf7d0" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M155 110V140M180 110V140M205 110V140M230 110V140M255 110V140M280 110V140M305 110V140M330 110V140M355 110V140M405 110V140" fill="none" stroke="#1f2937"/>
  <rect x="130" y="180" width="175" height="30" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <rect x="305" y="180" width="75" height="30" fill="#fecaca" stroke="#1f2937" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M155 180V210M180 180V210M205 180V210M230 180V210M255 180V210M280 180V210" fill="none" stroke="#1f2937"/>
  <path d="M330 180V210M355 180V210" fill="none" stroke="#1f2937" stroke-dasharray="4 3"/>
  <g font-weight="700">
    <text x="8" y="60">Original</text>
    <text x="8" y="122">Increase by 20%</text>
    <text x="8" y="192">Decrease by 30%</text>
    <text x="405" y="102" text-anchor="middle">+20%</text>
    <text x="342" y="172" text-anchor="middle">−30%</text>
    <text x="388" y="60">100%</text>
    <text x="438" y="130">120%</text>
    <text x="388" y="200">70% left</text>
  </g>
  <g font-size="12" fill="#334155">
    <text x="8" y="138">multiplier × 1.2</text>
    <text x="8" y="208">multiplier × 0.7</text>
    <text x="130" y="240">Each block is 10% of the original amount.</text>
  </g>
</svg>`,
      diagramCaption: "Each block is 10% of the original. A 20% increase adds two blocks (you end with 120%, so × 1.2); a 30% decrease removes three (70% is left, so × 0.7).",
      workedExamples: [
        {
          title: "Class Task 1: the basics",
          problem: "a) Increase 70 by 10%.  b) Decrease 40 by 30%.",
          steps: [
            "a) 10% of 70 = 70 ÷ 10 = 7.",
            "Increase means add it on: 70 + 7 = 77.",
            "b) 10% of 40 = 4, so 30% of 40 = 3 × 4 = 12.",
            "Decrease means take it off: 40 − 12 = 28.",
            "Check b) with Method 2: 100% − 30% = 70%, and 70% of 40 = 7 × 4 = 28 ✓",
          ],
          answer: "a) 77  b) 28",
        },
        {
          title: "Class Task 1: lamps and sales tax",
          problem: "A customer buys 4 lamps at £20 each. A sales tax of 15% is then added on. What is the total cost?",
          steps: [
            "Cost before tax: 4 × £20 = £80.",
            "10% of £80 = £8, and 5% is half of that, £4.",
            "15% of £80 = £8 + £4 = £12.",
            "Total cost = £80 + £12 = £92.",
            "Check with Method 2: 115% of £80 = 80 × 1.15 = £92 ✓",
          ],
          answer: "£92",
        },
        {
          title: "Class Task 2: Jordan's cakes",
          problem: "Jordan made 420 cakes to sell. He priced them at £2 and sold 50% of the cakes at this price. Later in the day he reduced the price by 25% and sold another 20 cakes. How much money did he make?",
          steps: [
            "50% of 420 = 420 ÷ 2 = 210 cakes sold at £2.",
            "Money from those: 210 × £2 = £420.",
            "25% of £2 = £2 ÷ 4 = £0.50, so the reduced price is £2 − £0.50 = £1.50.",
            "Another 20 cakes: 20 × £1.50 = £30.",
            "Total: £420 + £30 = £450.",
          ],
          answer: "£450",
        },
      ],
      keyPoints: [
        "The percentage is always worked out on the original amount.",
        "Method 1: find r% of the amount, then add it on (increase) or take it off (decrease).",
        "Method 2: an increase of r% leaves you with (100 + r)%; a decrease of r% leaves (100 − r)%.",
        "VAT, tax, inflation and pay rises go up; discounts, sales and depreciation go down.",
        "An increase of 100% doubles an amount, and increases can be even bigger: +150% gives 250%.",
      ],
      whyItWorks: "The original amount is 100%. Increasing it by r% adds r% more, so you end up with (100 + r)% of it; decreasing by r% removes r%, leaving (100 − r)%. Method 1 adds the two pieces separately and Method 2 adds the percentages first — they always give the same answer.",
      memoryTrick: "**Start at 100.** Up 15%? 100 + 15 → find 115%. Down 20%? 100 − 20 → find 80%.",
      examTip: "Don't stop halfway! 20% of £800 is £160 — that's the *increase*, not the new price. The new price is £800 + £160 = £960. In multi-step questions, like the lamps, find the total first and then add the tax.",
      thinkDeeper: "A price can be increased by 150% — but can a price be *decreased* by 150%? What would that mean? What is the biggest percentage decrease that makes sense for a price, and what would the new price be?",
      quickChecks: [
        {
          question: "Henry sells cookers for £800. He increases the price by 20%. What is the new price? Give your answer in £.",
          answer: { type: "number", value: 960, display: "£960" },
          solution: "10% of £800 = £80, so 20% = £160. New price = £800 + £160 = £960. (Or 120% of £800 = 800 × 1.2 = £960.)",
        },
        {
          question: "Increase 40 by 150%.",
          answer: { type: "number", value: 100 },
          solution: "100% of 40 is 40 and 50% is 20, so 150% of 40 = 60. The new amount is 40 + 60 = 100 — which is 250% of 40.",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 4. Calculating percentage change
    // -----------------------------------------------------------------------
    {
      id: "pc-percent-change",
      topic: "pc",
      lesson: "Percentage Increase",
      heading: "Percentage change: always compare with the original",
      discovery: {
        problem: "A cinema ticket costs £4. The price goes up to £5. A year later it goes back down to £4. Mei says: 'It went up by 25% and then down by 25%.' Is she right?",
        idea: "Only half right! The rise is £1 compared with the original £4: {{1/4}} = 25%. But the fall is £1 compared with £5 — the price it fell *from*: {{1/5}} = 20%. Same £1 change, different starting point, different percentage. A percentage change always compares the change with the **original** amount.",
      },
      body:
        "Sometimes you know the amount **before** and **after** a change, and you need the change as a percentage. The rule from class:\n\n" +
        "    percentage change = {{change/original * 100}}\n\n" +
        "**Step by step**\n" +
        "1. Find the **change**: the difference between the two amounts. Say whether it is an increase or a decrease.\n" +
        "2. Divide it by the **original** amount (the one you started with).\n" +
        "3. Multiply by 100.\n\n" +
        "For the gym, £160 → £200 is a change of £40, and {{40/160}} = {{1/4}} = 25%. Without a calculator, simplify the fraction (or scale it to a denominator of 100) instead of dividing.\n\n" +
        "**Why the original?** A percentage change answers the question 'how big is the change *compared with where we started*?' — so the starting amount is the 100%. Dividing by the new amount compares with the wrong thing: {{40/200}} would give 20%, but 20% of £160 is only £32, not £40.\n\n" +
        "**Increases bigger than 100%.** Gill's weight went from 5 kg to 50 kg. The change is 45 kg, and {{45/5}} = 9, so the increase is **900%**. It is *not* 1000%: 50 kg is 1000% *of* 5 kg, but that includes the original 100%. Check: 900% of 5 kg is 45 kg, and 5 + 45 = 50 ✓\n\n" +
        "**Decreases.** Tea-cosy accidents went down from 3 to 0 — a change of 3, and {{3/3}} = 1, so that's a **100% decrease**. Falling all the way to zero is always a 100% decrease.\n\n" +
        "**Profit and loss.** A percentage profit or loss compares the profit (or loss) with the **cost price** — what was paid at the start. Ravi buys a bike for $250 and sells it for $200: his loss is $50, and {{50/250}} = {{1/5}} = 20%, so it's a **20% loss**.\n\n" +
        "**Check by going forwards:** r% of the original should equal the change. 25% of £160 = £40 ✓, so £160 → £200 really is a 25% increase.",
      diagram: `<svg viewBox="0 0 480 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar model of the gym prices. Last year's £160 is four blocks of £40, each 25%. This year's £200 is five blocks of £40. The extra block of £40 is 25% of the original £160, so the percentage increase is 25%." font-family="sans-serif" font-size="13" fill="#1f2937">
  <rect width="480" height="230" fill="#ffffff"/>
  <path d="M366 28V156" fill="none" stroke="#334155" stroke-dasharray="3 3"/>
  <rect x="110" y="36" width="256" height="36" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M174 36V72M238 36V72M302 36V72" fill="none" stroke="#1f2937"/>
  <rect x="110" y="112" width="256" height="36" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <rect x="366" y="112" width="64" height="36" fill="#fde68a" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M174 112V148M238 112V148M302 112V148" fill="none" stroke="#1f2937"/>
  <text x="8" y="50" font-weight="700">Last year</text>
  <text x="8" y="67">£160</text>
  <text x="8" y="126" font-weight="700">This year</text>
  <text x="8" y="143">£200</text>
  <g text-anchor="middle">
    <text x="142" y="59">£40</text>
    <text x="206" y="59">£40</text>
    <text x="270" y="59">£40</text>
    <text x="334" y="59">£40</text>
    <text x="142" y="135">£40</text>
    <text x="206" y="135">£40</text>
    <text x="270" y="135">£40</text>
    <text x="334" y="135">£40</text>
    <text x="398" y="135" font-weight="700">£40</text>
    <text x="398" y="170" font-weight="700">+£40 = +25%</text>
    <text x="240" y="200" font-weight="700">Percentage change = £40 ÷ £160 × 100 = 25%</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="#334155">
    <text x="142" y="90">25%</text>
    <text x="206" y="90">25%</text>
    <text x="270" y="90">25%</text>
    <text x="334" y="90">25%</text>
    <text x="240" y="220">Not £40 ÷ £200: that divides by the new price.</text>
  </g>
  <g font-size="12" fill="#334155">
    <text x="374" y="59">= 100%</text>
    <text x="436" y="135">125%</text>
  </g>
</svg>`,
      diagramCaption: "The gym price grew by one £40 block. £40 is a quarter of the original £160, so the increase is 25% (the new price is 125% of the old one).",
      workedExamples: [
        {
          title: "Class Task 2: the gym ('show that')",
          problem: "Last year the cost of joining a gym was £160. This year it is £200. Anna says prices have gone up 25%. Show that she is correct.",
          steps: [
            "Change = £200 − £160 = £40 (an increase).",
            "Divide by the original — last year's price: {{40/160}}.",
            "Simplify: {{40/160}} = {{1/4}}.",
            "{{1/4}} × 100 = 25%, so Anna is correct.",
            "Check: 25% of £160 = £40, and £160 + £40 = £200 ✓",
          ],
          answer: "{{40/160}} × 100 = 25% increase ✓",
        },
        {
          title: "Percentage profit",
          problem: "Priya buys a second-hand bike for $150 and sells it for $195. Work out her percentage profit.",
          steps: [
            "Change = $195 − $150 = $45. She sold it for more than she paid, so it's a profit.",
            "Divide by the original (what she paid): {{45/150}}.",
            "Simplify by dividing the top and bottom by 15: {{45/150}} = {{3/10}}.",
            "{{3/10}} = 30%.",
          ],
          answer: "30% profit",
        },
        {
          title: "UKMT Junior Maths Challenge 2009: Gill's weight",
          problem: "When Gill was taken to the clinic as a baby, she weighed 5 kg. She now weighs 50 kg. What is the percentage increase in Gill's weight?",
          steps: [
            "Change = 50 − 5 = 45 kg.",
            "Divide by the original weight: {{45/5}} = 9.",
            "9 × 100 = 900%.",
            "Trap: 50 ÷ 5 × 100 = 1000% is her new weight as a percentage of her old weight. The *increase* leaves out the original 100%: 1000% − 100% = 900%.",
          ],
          answer: "900% increase",
        },
      ],
      keyPoints: [
        "Percentage change = {{change/original}} × 100.",
        "Always divide by the ORIGINAL (starting) amount — never by the new one.",
        "Say whether it's an increase or a decrease (a profit or a loss).",
        "Increases can be over 100%: 5 kg → 50 kg is a 900% increase, not 1000%.",
        "Going all the way down to zero is a 100% decrease.",
      ],
      whyItWorks: "A percentage change measures the change *compared with where you started*, so the starting amount plays the part of 100%. {{change/original}} is the change as a fraction of the start, and × 100 writes that fraction 'out of 100'.",
      memoryTrick: "**D-O-H: Difference ÷ Original × Hundred.** Divide by anything other than the Original and… D'oh!",
      examTip: "The classic slip is dividing by the new amount: £40 ÷ £200 = 20% is wrong — it must be £40 ÷ £160 = 25%. In 'show that' questions, write the fraction {{40/160}} so the marker can see you used the original.",
      thinkDeeper: "**Challenge (UKMT):** A painting that cost 50p is said to be worth £15,000. Roughly what is the percentage profit? (Hint: change both amounts into pence first.)",
      quickChecks: [
        {
          question: "The number of pupils at a school rises from 400 to 460. What is the percentage increase?",
          answer: { type: "number", value: 15, display: "15%" },
          solution: "Change = 460 − 400 = 60. {{60/400}} = {{15/100}} = 15%.",
        },
        {
          question: "A seedling grows from 4 cm to 18 cm. What is the percentage increase?",
          answer: { type: "number", value: 350, display: "350%" },
          solution: "Change = 18 − 4 = 14 cm. {{14/4}} = 3.5, and 3.5 × 100 = 350%. (Not 450% — that's 18 cm as a percentage of 4 cm.)",
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 5. Multipliers & repeated change
    // -----------------------------------------------------------------------
    {
      id: "pc-multipliers",
      topic: "pc",
      lesson: "UKMT Percentage Questions",
      heading: "Multipliers: do every change in one step",
      discovery: {
        problem: "A £100 jumper goes up in price by 10%. A month later, the new price comes down by 10%. Is it back to £100? Predict first, then check.",
        idea: "Up 10%: £100 + £10 = £110. Down 10%: but 10% of £110 is £11, so the price becomes £110 − £11 = **£99**. The second 10% is a percentage of a *bigger* amount, so it takes off more than the first one added. Multipliers show this instantly: × 1.1 × 0.9 = × 0.99, which is 1% less than you started with.",
      },
      body:
        "A **multiplier** is the single number you multiply by to get the new amount in one step.\n\n" +
        "The original amount is 100%, which as a decimal is **1**. So:\n" +
        "- **Increase by r%:** you end with (100 + r)%, so multiply by {{1 + r/100}}.\n" +
        "- **Decrease by r%:** you end with (100 − r)%, so multiply by {{1 - r/100}}.\n\n" +
        "| Change | You end with | Multiplier |\n" +
        "|---|---|---|\n" +
        "| increase by 20% | 120% | × 1.2 |\n" +
        "| increase by 5% | 105% | × 1.05 |\n" +
        "| increase by 150% | 250% | × 2.5 |\n" +
        "| decrease by 30% | 70% | × 0.7 |\n" +
        "| decrease by 10% | 90% | × 0.9 |\n" +
        "| decrease by 1% | 99% | × 0.99 |\n\n" +
        "**Reading a multiplier backwards** gives the percentage change: × 1.08 is an 8% increase, × 0.85 is a 15% decrease and × 3 is a 200% increase. To find the multiplier between two amounts, divide new ÷ original: for the gym, 200 ÷ 160 = 1.25, so prices rose by 25%.\n\n" +
        "**Why bother?** One multiplication does the whole job, which is perfect for a calculator and for awkward numbers: increasing £37.50 by 12% is just 37.5 × 1.12 = £42. (Even a plain percentage is a multiplier: 37% of an amount is × 0.37.)\n\n" +
        "**Repeated changes: multiply the multipliers.** Each change is a percentage of the amount *at that moment*, not of the original, so you can't just add the percentages. Multiply instead:\n\n" +
        "    −10% then +20%: × 0.9 × 1.2 = × 1.08, an 8% increase (not 10%)\n" +
        "    +10% then −10%: × 1.1 × 0.9 = × 0.99, a 1% decrease (not 0%)\n\n" +
        "**A percentage of a percentage** works the same way. In the UKMT 'purple blazers' question, only 20% of the pupils were asked and 80% of those chose purple: 80% of 20% = 0.8 × 0.2 = 0.16, which is **16%** of all the pupils.\n\n" +
        "**Check your decimal.** A 5% increase is × 1.05, not × 1.5 (that's +50%). A 30% decrease is × 0.7, not × 0.3 — multiplying by 0.3 would leave only 30%.",
      diagram: `<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flow diagram for Sam's car. £8000 times 0.9 for the 10% discount gives £7200. £7200 times 1.2 for 20% VAT gives £8640. A curved arrow shows the single multiplier 1.08 taking £8000 straight to £8640, which is an 8% increase, not 10%." font-family="sans-serif" font-size="13" fill="#1f2937">
  <rect width="480" height="210" fill="#ffffff"/>
  <text x="240" y="24" text-anchor="middle" font-weight="700">Sam's car: two changes, one multiplier</text>
  <g text-anchor="middle" font-size="12" fill="#334155">
    <text x="65" y="58">advertised</text>
    <text x="240" y="58">after 10% off</text>
    <text x="415" y="58">after 20% VAT</text>
  </g>
  <rect x="10" y="66" width="110" height="40" rx="8" fill="#c7d2fe" stroke="#1f2937" stroke-width="1.5"/>
  <rect x="185" y="66" width="110" height="40" rx="8" fill="#fecaca" stroke="#1f2937" stroke-width="1.5"/>
  <rect x="360" y="66" width="110" height="40" rx="8" fill="#bbf7d0" stroke="#1f2937" stroke-width="1.5"/>
  <g text-anchor="middle" font-size="14" font-weight="700">
    <text x="65" y="91">£8000</text>
    <text x="240" y="91">£7200</text>
    <text x="415" y="91">£8640</text>
  </g>
  <path d="M123 86H174M298 86H349" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <polygon points="182,86 173,81.5 173,90.5" fill="#1f2937"/>
  <polygon points="357,86 348,81.5 348,90.5" fill="#1f2937"/>
  <g text-anchor="middle">
    <text x="152" y="77" font-weight="700">× 0.9</text>
    <text x="152" y="102" font-size="12">−10%</text>
    <text x="327" y="77" font-weight="700">× 1.2</text>
    <text x="327" y="102" font-size="12">+20%</text>
  </g>
  <path d="M65 110Q240 184 415 110" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <polygon points="415,110 408.5,117.6 405,109.4" fill="#1f2937"/>
  <g text-anchor="middle">
    <text x="240" y="170" font-weight="700">× 0.9 × 1.2 = × 1.08 in one step</text>
    <text x="240" y="194" font-size="12" fill="#334155">× 1.08 is an 8% increase overall, not 10% (not £8800)</text>
  </g>
</svg>`,
      diagramCaption: "Sam's car: × 0.9 and then × 1.2 does the same job as × 1.08 in one step — an 8% increase overall, not 10%.",
      workedExamples: [
        {
          title: "Class Task 1, with multipliers",
          problem: "Use a multiplier for each. a) Paula's washing machine costs £130 + VAT at 20%. Find the total price.  b) A new car bought for £20,000 loses 20% of its value in the first year. Find its value after 1 year.",
          steps: [
            "a) An increase of 20% leaves you with 120%, so the multiplier is 1.2.",
            "£130 × 1.2 = £156.",
            "b) A decrease of 20% leaves 80%, so the multiplier is 0.8.",
            "£20,000 × 0.8 = £16,000.",
          ],
          answer: "a) £156  b) £16,000",
        },
        {
          title: "Class Task 2: Sam's car",
          problem: "Sam is buying a car advertised at £8000. He negotiates a discount of 10%. The dealer then adds 20% VAT. What is the final price?",
          steps: [
            "The 10% discount is × 0.9 and the 20% VAT is × 1.2.",
            "After the discount: £8000 × 0.9 = £7200.",
            "After VAT: £7200 × 1.2 = £8640.",
            "Or in one go: 0.9 × 1.2 = 1.08, and £8000 × 1.08 = £8640 ✓",
            "× 1.08 is an 8% increase overall — not 10%, because the 20% VAT is worked out on the cheaper £7200.",
          ],
          answer: "£8640",
        },
        {
          title: "UKMT: the purple blazers",
          problem: "'80% of the pupils asked preferred purple blazers!' announced the Head — forgetting to mention that 80% of the pupils had not been asked at all. What percentage of all the pupils actually said they preferred purple?",
          steps: [
            "80% were not asked, so 100% − 80% = 20% were asked.",
            "Of those, 80% preferred purple. So you need 80% of 20%.",
            "Multiply the decimals: 0.8 × 0.2 = 0.16.",
            "0.16 = 16%.",
            "Check with 100 pupils: 20 were asked, and 80% of 20 = 16 pupils ✓",
          ],
          answer: "16%",
        },
      ],
      keyPoints: [
        "Increase by r% → × {{(1 + r/100)}}: +20% → × 1.2, +5% → × 1.05, +150% → × 2.5.",
        "Decrease by r% → × {{(1 - r/100)}}: −30% → × 0.7, −10% → × 0.9.",
        "Successive changes: multiply the multipliers — never add the percentages.",
        "−10% then +20% is × 1.08 (+8%); +10% then −10% is × 0.99 (−1%).",
        "A percentage of a percentage multiplies too: 80% of 20% = 0.8 × 0.2 = 16%.",
      ],
      whyItWorks: "The original amount is 100%, which is 1 whole. After a 20% increase you have 120% of it, which is 1.2 wholes — so you multiply by 1.2. Each new change multiplies whatever amount you have *at that moment*, which is why successive changes combine by multiplying, not adding.",
      memoryTrick: "**One whole, plus or minus the change:** +20% → 1 + 0.2 = 1.2; −30% → 1 − 0.3 = 0.7. A multiplier bigger than 1 grows the amount; smaller than 1 shrinks it.",
      examTip: "Never add percentages from different steps: Sam's car is NOT £8000 + 10% = £8800. It's × 0.9 × 1.2 = × 1.08, giving £8640. And check the decimal: a 5% increase is × 1.05, not × 1.5.",
      thinkDeeper: "**Challenge (UKMT):** Minnie increased her average speed in a marathon by 25%. By what percentage did her time decrease? (Hint: the distance stays the same, and distance = speed × time. If her speed is multiplied by 1.25, what must her time be multiplied by? Try a speed going up from 8 km/h to 10 km/h.)",
      quickChecks: [
        {
          question: "What single decimal multiplier increases an amount by 5%?",
          answer: { type: "number", value: 1.05, allowFraction: false },
          solution: "100% + 5% = 105% = 1.05. (Not 1.5 — that would be a 50% increase.)",
        },
        {
          question: "A jacket costs £50. In a sale it is reduced by 20%. Later, the sale price is reduced by a further 10%. What is the final price? Give your answer in £.",
          answer: { type: "number", value: 36, display: "£36" },
          solution: "× 0.8 then × 0.9: £50 × 0.8 = £40, then £40 × 0.9 = £36. Not £35 — the 10% comes off £40, not £50. (Overall × 0.72, a 28% reduction.)",
        },
      ],
    },
  ],
  flashcards: [
    { front: "{{1/2}}, {{1/4}} and {{3/4}} as decimals and percentages", back: "0.5 = 50%, 0.25 = 25% and 0.75 = 75%" },
    { front: "{{1/5}} and {{1/10}} as decimals and percentages", back: "{{1/5}} = 0.2 = 20% and {{1/10}} = 0.1 = 10%" },
    { front: "{{1/8}} as a decimal and a percentage", back: "0.125 = 12.5% (half of {{1/4}}, which is 25%)" },
    { front: "{{1/3}} and {{2/3}} as percentages", back: "About 33.3% and 66.7% (exactly {{33 1/3}}% and {{66 2/3}}%). The decimals recur: 0.333… and 0.666…" },
    { front: "How do you change a percentage into a decimal?", back: "Divide by 100: 36% = 0.36, 5% = 0.05, 12.5% = 0.125." },
    { front: "How do you change {{7/20}} into a percentage?", back: "Scale the denominator to 100: × 5 top and bottom gives {{35/100}} = 35%." },
    { front: "Put in ascending order: 0.31, 36%, {{7/20}}, 0.309", back: "0.309, 0.31, {{7/20}}, 36% (as decimals: 0.309, 0.310, 0.350, 0.360)" },
    { front: "Find 35% of £60 without a calculator", back: "10% = £6, so 30% = £18; 5% = £3; 35% = £18 + £3 = £21." },
    { front: "How do you write A as a percentage of B?", back: "{{A/B}} × 100 — the part over the whole. 18 out of 24 = {{3/4}} = 75%." },
    { front: "Increase 70 by 10%. Decrease 40 by 30%.", back: "77 (70 + 7) and 28 (70% of 40)." },
    { front: "The percentage change formula", back: "{{change/original}} × 100 — always divide by the ORIGINAL amount." },
    { front: "Gym: £160 last year, £200 this year. Percentage increase?", back: "{{40/160}} = {{1/4}} = 25%" },
    { front: "Gill's weight: 5 kg → 50 kg. Percentage increase?", back: "Change = 45 kg, and {{45/5}} = 9, so 900% (not 1000%)." },
    { front: "Multipliers for +15%, +5% and −30%?", back: "× 1.15, × 1.05 and × 0.7" },
    { front: "Sam's car: £8000, 10% off, then 20% VAT. Final price?", back: "£8000 × 0.9 × 1.2 = £8000 × 1.08 = £8640 (+8%, not +10%)." },
    { front: "UKMT purple blazers: 80% of the 20% who were asked", back: "0.8 × 0.2 = 0.16, so 16% of all the pupils." },
  ],
  cram: [
    "Per cent = out of 100. Percentage → decimal: ÷ 100 (5% = 0.05). Decimal → percentage: × 100.",
    "{{1/2}} = 50%, {{1/4}} = 25%, {{3/4}} = 75%, {{1/5}} = 20%, {{1/10}} = 10%, {{1/8}} = 12.5%, {{1/3}} ≈ 33.3%, {{2/3}} ≈ 66.7%.",
    "To order fractions, decimals and percentages, change them all to decimals with the same number of places (0.309 < 0.310).",
    "No calculator: 10% = ÷ 10, 5% = half of 10%, 1% = ÷ 100 — then build (35% = 30% + 5%).",
    "A as a percentage of B = {{A/B}} × 100 (whole on the bottom; same units first).",
    "Increase by r%: find r% and add it on, or find (100 + r)%. Decrease: take it off, or find (100 − r)%.",
    "Percentage change = {{change/original}} × 100 — divide by the ORIGINAL (5 kg → 50 kg is +900%).",
    "Multipliers: +20% → × 1.2, +5% → × 1.05, −30% → × 0.7, +150% → × 2.5.",
    "Successive changes multiply: −10% then +20% → × 0.9 × 1.2 = × 1.08 (+8%, not +10%).",
    "Percentage of a percentage: 80% of 20% = 0.8 × 0.2 = 0.16 = 16%.",
  ],
};
