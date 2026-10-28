import type { MCQ, QuestionSet } from "../../types";

// Percentages (Unit 1) — multiple-choice sets.
// Sections: pc-fdp, pc-of-amount, pc-change, pc-percent-change, pc-multipliers (2 per set).
// Every numeric key has a `verify` expression built from the question's own numbers.

export const MCQ_PC: QuestionSet<MCQ>[] = [
  // ===========================================================================
  // SET 1 · Foundations  (warm-up 4 / core 5 / challenge 1)
  // ===========================================================================
  {
    id: "pc-mcq-1",
    title: "Set 1 · Foundations",
    subtitle: "FDP equivalents, 10% building blocks, simple increases and decreases, and first steps with percentage change and multipliers",
    topic: "pc",
    questions: [
      {
        id: "pc-m1-q01",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "warmup",
        question: "This bar is split into 8 equal parts. What percentage of the bar is shaded?",
        diagram: `<svg viewBox="0 0 360 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bar split into 8 equal parts, with 3 of the parts shaded">
<rect x="0" y="0" width="360" height="90" fill="#ffffff"/>
<rect x="20" y="12" width="40" height="44" fill="#c7d2fe" stroke="#334155" stroke-width="2"/>
<rect x="60" y="12" width="40" height="44" fill="#c7d2fe" stroke="#334155" stroke-width="2"/>
<rect x="100" y="12" width="40" height="44" fill="#c7d2fe" stroke="#334155" stroke-width="2"/>
<rect x="140" y="12" width="40" height="44" fill="#ffffff" stroke="#334155" stroke-width="2"/>
<rect x="180" y="12" width="40" height="44" fill="#ffffff" stroke="#334155" stroke-width="2"/>
<rect x="220" y="12" width="40" height="44" fill="#ffffff" stroke="#334155" stroke-width="2"/>
<rect x="260" y="12" width="40" height="44" fill="#ffffff" stroke="#334155" stroke-width="2"/>
<rect x="300" y="12" width="40" height="44" fill="#ffffff" stroke="#334155" stroke-width="2"/>
<text x="180" y="78" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#1f2937">8 equal parts</text>
</svg>`,
        options: ["30%", "62.5%", "37.5%", "3.75%"],
        answerIndex: 2,
        optionFeedback: [
          "30% treats each part as 10% — that only works when there are 10 parts. Here there are 8, so each part is {{1/8}} = 12.5%.",
          "62.5% is the **unshaded** part (5 of the 8 parts). The question asks about the shaded part.",
          "3 of the 8 parts are shaded: {{3/8}} = 3 × 12.5% = 37.5%.",
          "{{3/8}} = 0.375, but to change a decimal into a percentage you multiply by 100, not 10: 0.375 × 100 = 37.5%.",
        ],
        explanation:
          "3 of the 8 equal parts are shaded, so the shaded fraction is {{3/8}}. One part is {{1/8}}, and {{1/8}} = 12.5% (half of {{1/4}}, which is 25%). Three parts make 3 × 12.5% = 37.5%. Quick check: the 5 unshaded parts make 62.5%, and 37.5% + 62.5% = 100% ✓.",
        hints: ["Write the shaded part as a fraction. {{1/4}} = 25%, so what is {{1/8}} as a percentage?"],
        strategy: "Use a bar model",
        verify: "3/8*100",
      },
      {
        id: "pc-m1-q02",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "warmup",
        question: "Without a calculator, find 15% of £60.",
        options: ["£9", "£4", "£18", "£51"],
        answerIndex: 0,
        optionFeedback: [
          "10% of £60 is £6 and 5% is half of that, £3. So 15% = £6 + £3 = £9.",
          "£4 is £60 ÷ 15. Finding 15% means finding 15 hundredths of £60, not dividing by 15.",
          "£18 uses 5% = £12 — but £12 is {{1/5}} of £60, which is 20%. 5% is half of 10%, so it's £3.",
          "£51 is £60 − £9, the price after a 15% *decrease*. The question just asks for 15% of £60.",
        ],
        explanation:
          "Build 15% from easy pieces. 10% of £60 = £60 ÷ 10 = £6. 5% is half of 10%, so 5% of £60 = £3. Then 15% = £6 + £3 = £9 (calculator check: 0.15 × 60 = 9 ✓).",
        hints: ["Split 15% into 10% + 5%. What is 10% of £60?"],
        verify: "15/100*60",
      },
      {
        id: "pc-m1-q03",
        topic: "pc",
        section: "pc-change",
        difficulty: "warmup",
        question: "Decrease 40 by 30%.",
        options: ["12", "28", "10", "52"],
        answerIndex: 1,
        optionFeedback: [
          "12 is 30% of 40 — the size of the decrease. You still need to take it away from 40.",
          "30% of 40 is 12, and 40 − 12 = 28. (Or: 70% is left, and 40 × 0.7 = 28.)",
          "10 is 40 − 30. You need to subtract 30% *of 40*, which is 12, not 30 itself.",
          "52 is 40 + 12 — that's an *increase* of 30%. A decrease means take away.",
        ],
        explanation:
          "10% of 40 is 4, so 30% is 3 × 4 = 12. A decrease means take it away: 40 − 12 = 28. Quicker with a multiplier: after a 30% decrease, 70% is left, and 40 × 0.7 = 28.",
        hints: ["Find 10% of 40 first, then 30%. Do you add it on or take it away?"],
        strategy: "Use the multiplier",
        verify: "40*(1-30/100)",
        source: "Class worksheet",
      },
      {
        id: "pc-m1-q04",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "warmup",
        question: "A pair of trainers went up in price from $50 to $60. What is the percentage increase?",
        options: ["10%", "120%", "16.7%", "20%"],
        answerIndex: 3,
        optionFeedback: [
          "The price went up by $10, but that isn't the same as 10%. Compare the $10 with the original $50.",
          "120% is the new price as a percentage of the old one ({{60/50}} × 100). The *increase* is 120% − 100% = 20%.",
          "16.7% comes from {{10/60}} — dividing by the new price. Percentage change always divides by the original price, $50.",
          "The increase is $10 on an original price of $50: {{10/50}} × 100 = 20%.",
        ],
        explanation:
          "Percentage change = change ÷ original × 100. The change is $60 − $50 = $10, and the original price is $50. So the increase is {{10/50}} × 100 = 20%. Check: 20% of $50 is $10, and $50 + $10 = $60 ✓.",
        hints: ["Find the increase in dollars first. Do you compare it with the old price or the new price?"],
        verify: "(60-50)/50*100",
      },
      {
        id: "pc-m1-q05",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "core",
        question: "Put these numbers in **ascending** order (smallest first).\n\n0.31, 36%, {{7/20}}, 0.309",
        options: [
          "0.309, 0.31, {{7/20}}, 36%",
          "0.31, 0.309, {{7/20}}, 36%",
          "0.309, 0.31, 36%, {{7/20}}",
          "36%, {{7/20}}, 0.31, 0.309",
        ],
        answerIndex: 0,
        optionFeedback: [
          "As decimals they are 0.309, 0.310, 0.350 and 0.360 — smallest to largest.",
          "0.309 has more digits, but that doesn't make it bigger. Write 0.31 as 0.310: then 0.309 < 0.310.",
          "This puts {{7/20}} above 36% without converting it. {{7/20}} = {{35/100}} = 35%, just under 36%.",
          "This is **descending** order (largest first). Ascending means smallest first.",
        ],
        explanation:
          "Write everything in the same form — decimals work well. 36% = 0.36 and {{7/20}} = {{35/100}} = 0.35. Give each number three decimal places: 0.309, 0.310, 0.350, 0.360. So the order is 0.309, 0.31, {{7/20}}, 36%. Tip: compare decimals digit by digit from the left, filling any gaps with zeros.",
        hints: [
          "Change every number into a decimal so you are comparing like with like.",
          "{{7/20}} = {{35/100}}. To compare 0.31 with 0.309, write 0.31 as 0.310.",
        ],
        source: "Class example",
      },
      {
        id: "pc-m1-q06",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "core",
        question: "Priya scored 18 out of 24 in a spelling test. What percentage did she score?",
        options: ["25%", "18%", "75%", "133.3%"],
        answerIndex: 2,
        optionFeedback: [
          "25% is the percentage she got *wrong* (6 out of 24). The question asks for her score.",
          "18 is her mark, not a percentage. Compare it with the total of 24 first.",
          "{{18/24}} simplifies to {{3/4}}, and {{3/4}} = 75%.",
          "133.3% comes from {{24/18}} — the fraction is upside down. It's part ÷ whole, so 18 goes on top.",
        ],
        explanation:
          "One number as a percentage of another = part ÷ whole × 100. Her score as a fraction is {{18/24}}. Divide the top and bottom by 6 to get {{3/4}}, and {{3/4}} = 75%. Check: 75% of 24 is 18 ✓.",
        hints: [
          "Write her score as a fraction: marks scored over total marks.",
          "Simplify {{18/24}}. Do you recognise the fraction you get?",
        ],
        strategy: "Spot the common factor",
        verify: "18/24*100",
      },
      {
        id: "pc-m1-q07",
        topic: "pc",
        section: "pc-change",
        difficulty: "core",
        question: "A pair of headphones costs $80 before GST. In Singapore, GST is 9%. How much do the headphones cost with GST added?",
        options: ["$7.20", "$87.20", "$89", "$72.80"],
        answerIndex: 1,
        optionFeedback: [
          "$7.20 is the GST on its own. Add it to the $80 to find the price you pay.",
          "9% of $80 = $8 − $0.80 = $7.20, and $80 + $7.20 = $87.20.",
          "$89 adds $9. But GST is 9% *of $80*, which is $7.20, not $9.",
          "$72.80 is $80 − $7.20. GST is added on, so the price goes up, not down.",
        ],
        explanation:
          "Build 9% from 10% and 1%: 10% of $80 = $8 and 1% of $80 = $0.80, so 9% = $8 − $0.80 = $7.20. GST is added on: $80 + $7.20 = $87.20. Multiplier check: a 9% increase is × 1.09, and 80 × 1.09 = 87.2 ✓.",
        hints: ["9% = 10% − 1%. What are 10% and 1% of $80?", "GST is added on — so add the 9% to the $80."],
        verify: "80*1.09",
      },
      {
        id: "pc-m1-q08",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "core",
        question:
          "Last year it cost £160 to join a gym. This year it costs £200. Anna says the price has gone up by 25%. Marcus says it has gone up by 20%. Who is right, and why?",
        options: [
          "Marcus — divide the £40 rise by this year's £200",
          "Both — it depends which price you divide by",
          "Neither — the price rose by £40, so it's 40%",
          "Anna — divide the £40 rise by last year's £160",
        ],
        answerIndex: 3,
        optionFeedback: [
          "Marcus divided by the *new* price: {{40/200}} = 20%. Percentage change is always worked out on the original amount — last year's £160.",
          "It doesn't depend: percentage change = change ÷ **original** × 100, and the original price is last year's £160.",
          "£40 is the rise in pounds, not a percentage. Compare it with the original price: {{40/160}} = 25%.",
          "The rise is £200 − £160 = £40, and {{40/160}} × 100 = 25%. Anna is right.",
        ],
        explanation:
          "Percentage change = change ÷ original × 100. The change is £200 − £160 = £40, and the original (last year's) price is £160. {{40/160}} = {{1/4}} = 25%, so Anna is correct. Check forwards: 25% of £160 = £40, and £160 + £40 = £200 ✓. Marcus's 20% comes from dividing by the new price — a very common slip.",
        hints: ["Work out the rise in pounds first.", "Percentage change = change ÷ ORIGINAL × 100. Which price is the original?"],
        source: "Class worksheet",
      },
      {
        id: "pc-m1-q09",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "core",
        question:
          "A laptop is reduced by 5% in a sale. Which number do you multiply the original price by to get the sale price in one step?",
        options: ["0.05", "1.05", "0.95", "0.5"],
        answerIndex: 2,
        optionFeedback: [
          "× 0.05 finds 5% of the price — the amount taken off, not the sale price.",
          "× 1.05 gives 105%, which is a 5% *increase*. A decrease needs a multiplier less than 1.",
          "After a 5% reduction, 95% of the price is left, and 95% = 0.95.",
          "0.5 is 50%, so × 0.5 would halve the price. 5% as a decimal is 0.05, which leaves 0.95.",
        ],
        explanation:
          "After a 5% decrease, 100% − 5% = 95% of the original price is left. As a decimal, 95% = 0.95, so you multiply by 0.95. Example: a $600 laptop costs 600 × 0.95 = $570 in the sale, the same as $600 − $30 (5% of $600 is $30) ✓. Rule: an increase has a multiplier bigger than 1; a decrease has a multiplier between 0 and 1.",
        hints: [
          "After a 5% reduction, what percentage of the original price is left?",
          "Write that percentage as a decimal by dividing by 100.",
        ],
        strategy: "Use the multiplier",
        verify: "1-5/100",
      },
      {
        id: "pc-m1-q10",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "challenge",
        question:
          "A bike costs $200. The shop increases the price by 10%. A month later, it reduces the new price by 10%. What is the final price?",
        options: ["$198", "$200", "$220", "$217.80"],
        answerIndex: 0,
        optionFeedback: [
          "$200 × 1.1 = $220, then $220 × 0.9 = $198. The second 10% is taken from the bigger price.",
          "The two changes don't cancel. The 10% decrease is 10% of $220 = $22, which is more than the $20 that was added.",
          "$220 is the price after the increase only. You still need to take 10% off $220.",
          "$217.80 takes off $2.20, which is 1% of $220. 10% of $220 is $22.",
        ],
        explanation:
          "Do one change at a time. Up 10%: 10% of $200 is $20, so the price becomes $220. Down 10%: now the 10% is of $220, which is $22, so the final price is $220 − $22 = $198. With multipliers: 200 × 1.1 × 0.9 = 200 × 0.99 = 198. A rise and then a fall of the same percentage never take you back to the start, because the two percentages are of different amounts.",
        hints: [
          "Work out the price after the increase first.",
          "The 10% decrease is 10% of which amount — $200 or the new price?",
          "With multipliers, what is 1.1 × 0.9?",
        ],
        strategy: "Use the multiplier",
        verify: "200*1.1*0.9",
      },
    ],
  },

  // ===========================================================================
  // SET 2 · Core skills  (warm-up 2 / core 6 / challenge 2)
  // ===========================================================================
  {
    id: "pc-mcq-2",
    title: "Set 2 · Core skills",
    subtitle: "Converting FDP, building-block percentages, pay rises and increases over 100%, percentage change and successive multipliers",
    topic: "pc",
    questions: [
      {
        id: "pc-m2-q01",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "warmup",
        question: "Write {{9/20}} as a percentage.",
        options: ["9%", "45%", "4.5%", "0.45%"],
        answerIndex: 1,
        optionFeedback: [
          "9% would be {{9/100}}. Here the denominator is 20, so scale it up to 100 first.",
          "20 × 5 = 100, so {{9/20}} = {{45/100}} = 45%.",
          "9 ÷ 20 = 0.45, but then you multiply by 100, not 10: 0.45 × 100 = 45%.",
          "0.45 is the decimal. To change a decimal into a percentage, multiply by 100: 0.45 → 45%.",
        ],
        explanation:
          "Percent means 'out of 100'. Since 20 × 5 = 100, multiply the top and bottom by 5: {{9/20}} = {{45/100}} = 45%. Another way: 9 ÷ 20 = 0.45, and 0.45 × 100 = 45%.",
        hints: ["What do you multiply 20 by to make 100? Do the same to the 9."],
        strategy: "Find a common denominator",
        verify: "9/20*100",
      },
      {
        id: "pc-m2-q02",
        topic: "pc",
        section: "pc-change",
        difficulty: "warmup",
        question: "Zara earns $1800 a month. She gets a 5% pay rise. What is her new monthly pay?",
        options: ["$90", "$1805", "$1710", "$1890"],
        answerIndex: 3,
        optionFeedback: [
          "$90 is the pay rise itself (5% of $1800). Add it on to her old pay.",
          "$1805 adds $5, not 5%. 5% of $1800 is $90.",
          "$1710 is $1800 − $90 — that's a pay cut. A rise means add.",
          "10% of $1800 is $180, so 5% is $90, and $1800 + $90 = $1890.",
        ],
        explanation:
          "10% of $1800 is $180, so 5% is half of that: $90. A pay rise is an increase, so her new pay is $1800 + $90 = $1890. Multiplier check: 1800 × 1.05 = 1890 ✓.",
        hints: ["Find 10% of $1800, then halve it to get 5%."],
        verify: "1800*1.05",
      },
      {
        id: "pc-m2-q03",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "core",
        question: "What is 6% of 6 plus 8% of 8?",
        options: ["1", "100", "10", "0.14"],
        answerIndex: 0,
        optionFeedback: [
          "6% of 6 = 0.36 and 8% of 8 = 0.64, and 0.36 + 0.64 = 1.",
          "100 is 6 × 6 + 8 × 8 = 36 + 64 — you forgot to divide by 100. 6% of 6 is {{36/100}} = 0.36.",
          "10 treats 6% as 0.6 and 8% as 0.8. But 6% = 0.06, so 6% of 6 is 0.36, not 3.6.",
          "0.14 is just 6% + 8% written as a decimal. You need 6% *of 6* and 8% *of 8*, then add.",
        ],
        explanation:
          "6% of 6 = {{6/100}} × 6 = {{36/100}} = 0.36. 8% of 8 = {{8/100}} × 8 = {{64/100}} = 0.64. Add them: 0.36 + 0.64 = 1. Neat: 36 + 64 = 100, so the total is exactly {{100/100}} = 1.",
        hints: ["6% of 6 means {{6/100}} × 6. Work out each part on its own.", "Now add your two answers. What is 36 + 64?"],
        verify: "6/100*6+8/100*8",
        source: "UKMT JMC",
      },
      {
        id: "pc-m2-q04",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "core",
        question: "For many years, VAT in the UK was 17.5%. Without a calculator, find 17.5% of £240.",
        options: ["£36", "£48", "£42", "£198"],
        answerIndex: 2,
        optionFeedback: [
          "£36 is 10% + 5% (£24 + £12). You've left out the 2.5%, which is another £6.",
          "£48 uses 2.5% = £12, but £12 is 5%. 2.5% is half of 5%, so it's £6.",
          "10% = £24, 5% = £12 and 2.5% = £6, so 17.5% = £24 + £12 + £6 = £42.",
          "£198 is £240 − £42, the price after taking 17.5% off. The question asks for 17.5% of £240.",
        ],
        explanation:
          "Split 17.5% into 10% + 5% + 2.5%. 10% of £240 = £24. 5% is half of 10%, so £12, and 2.5% is half of 5%, so £6. Add them: £24 + £12 + £6 = £42 (calculator check: 0.175 × 240 = 42 ✓).",
        hints: ["Split 17.5% into 10% + 5% + 2.5%.", "5% is half of 10%. And 2.5% is half of …?"],
        verify: "17.5/100*240",
      },
      {
        id: "pc-m2-q05",
        topic: "pc",
        section: "pc-change",
        difficulty: "core",
        question: "A sunflower is 40 cm tall. Over the summer, its height increases by 150%. How tall is it now?",
        options: ["60 cm", "190 cm", "46 cm", "100 cm"],
        answerIndex: 3,
        optionFeedback: [
          "60 cm is 150% of 40 cm — that's just the increase (× 1.5 gives 150% *of* the height). Add the increase to the original 40 cm.",
          "190 cm adds 150 cm. You need to add 150% *of 40 cm*, which is 60 cm.",
          "46 cm uses × 1.15, as if 150% were 0.15. But 150% = 1.5, so a 150% increase is × (1 + 1.5) = × 2.5.",
          "150% of 40 cm is 60 cm, and 40 + 60 = 100 cm. (Multiplier: × 2.5.)",
        ],
        explanation:
          "150% of 40 = 100% of 40 + 50% of 40 = 40 + 20 = 60 cm. That is the increase, so the new height is 40 + 60 = 100 cm. With a multiplier: the new height is 100% + 150% = 250% of the old height, so 40 × 2.5 = 100 cm. An increase of more than 100% means the amount more than doubles.",
        hints: [
          "150% = 100% + 50%. What is 150% of 40 cm?",
          "That's the increase. Add it to the original height — or multiply by 100% + 150% = 250%.",
        ],
        strategy: "Use the multiplier",
        verify: "40*(1+150/100)",
      },
      {
        id: "pc-m2-q06",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "core",
        question:
          "Gill is 21 this year. At a famous visit to the clinic in 1988, she weighed 5 kg. She now weighs 50 kg. What has been the percentage increase in Gill's weight?",
        options: ["1000%", "900%", "90%", "45%"],
        answerIndex: 1,
        optionFeedback: [
          "1000% is 50 kg as a percentage of 5 kg — her new weight compared with her old weight. The *increase* is 1000% − 100% = 900%.",
          "She gained 45 kg, and {{45/5}} × 100 = 900%.",
          "90% comes from {{45/50}} — dividing by her new weight. Always divide by the original weight, 5 kg.",
          "45 is the gain in kilograms, not a percentage. Compare it with the original 5 kg: {{45/5}} × 100 = 900%.",
        ],
        explanation:
          "Increase = 50 − 5 = 45 kg. Percentage increase = increase ÷ original × 100 = {{45/5}} × 100 = 9 × 100 = 900%. Sense check: a 100% increase would only double 5 kg to 10 kg. Her weight is now 10 times as much — nine extra lots of 5 kg — so the increase is 900%.",
        hints: [
          "How many kilograms has Gill gained?",
          "Divide the gain by her ORIGINAL weight, then × 100. A percentage increase can be more than 100%.",
        ],
        verify: "(50-5)/5*100",
        source: "UKMT JMC 2009",
      },
      {
        id: "pc-m2-q07",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "core",
        question:
          "Sam is buying a car advertised at £8000. He negotiates a 10% discount. The dealer then adds 20% VAT to the discounted price. What is the final price?",
        options: ["£8640", "£8800", "£7200", "£9600"],
        answerIndex: 0,
        optionFeedback: [
          "£8000 × 0.9 = £7200, then £7200 × 1.2 = £8640.",
          "£8800 comes from −10% + 20% = +10%. You can't add the percentages, because the 20% is of the smaller, discounted price.",
          "£7200 is the price after the discount only. You still need to add the 20% VAT.",
          "£9600 adds 20% VAT to £8000 but forgets the 10% discount.",
        ],
        explanation:
          "Discount first: a 10% decrease leaves 90%, so £8000 × 0.9 = £7200. Then VAT: 20% of £7200 is £1440, so the final price is £7200 + £1440 = £8640. In one go: 8000 × 0.9 × 1.2 = 8000 × 1.08 = 8640 — an 8% increase overall, not 10%.",
        hints: ["Do the discount first: what is 90% of £8000?", "Now increase that price by 20% — multiply by 1.2."],
        strategy: "Use the multiplier",
        verify: "8000*0.9*1.2",
        source: "Class worksheet",
      },
      {
        id: "pc-m2-q08",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "core",
        question:
          "In Class 8P, {{1/4}} of the students walk to school, 0.2 of them cycle and 30% come by bus. The rest come by car. What percentage of the class come by car?",
        options: ["75%", "43%", "46%", "25%"],
        answerIndex: 3,
        optionFeedback: [
          "75% is the total that walk, cycle or take the bus. The car group is the rest: 100% − 75%.",
          "43% treats 0.2 as 2%. But 0.2 = 0.20 = 20% (2% would be 0.02).",
          "46% treats {{1/4}} as 4%. But {{1/4}} = {{25/100}} = 25%.",
          "{{1/4}} = 25%, 0.2 = 20% and the bus is 30%: 75% in total, so 100% − 75% = 25% come by car.",
        ],
        explanation:
          "Change everything into percentages: {{1/4}} = 25%, 0.2 = 20%, and the bus is already 30%. Together that's 25% + 20% + 30% = 75%. The whole class is 100%, so 100% − 75% = 25% come by car. Watch out: 0.2 is 20%, not 2%.",
        hints: [
          "Change {{1/4}} and 0.2 into percentages.",
          "The whole class is 100%. How much is left after walking, cycling and the bus?",
        ],
        verify: "100-1/4*100-0.2*100-30",
      },
      {
        id: "pc-m2-q09",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "challenge",
        question:
          "In a sale, the price of a coat falls from £80 to £60. After the sale, it goes back up from £60 to £80. By what percentage does the price **increase** after the sale?",
        options: ["25%", "20%", "{{33 1/3}}%", "{{133 1/3}}%"],
        answerIndex: 2,
        optionFeedback: [
          "25% is the size of the *fall* ({{20/80}}). For the rise, the starting price is £60, so divide by 60.",
          "The price rises by £20, but that isn't 20%. Compare the £20 with the starting price of £60.",
          "The rise is £20 on a starting price of £60: {{20/60}} = {{1/3}} = {{33 1/3}}%.",
          "{{133 1/3}}% is £80 as a percentage of £60. The *increase* is {{133 1/3}}% − 100% = {{33 1/3}}%.",
        ],
        explanation:
          "For the rise, the original price is the sale price, £60. The increase is £80 − £60 = £20, so the percentage increase is {{20/60}} × 100 = {{1/3}} × 100 = {{33 1/3}}%. The fall was only {{20/80}} = 25%: the same £20 is a bigger percentage of the smaller amount. So a 25% fall needs a {{33 1/3}}% rise to undo it.",
        hints: [
          "The price falls by £20 and then rises by £20. Are those the same percentage?",
          "For the rise, which price is the original price?",
          "Write {{20/60}} as a percentage.",
        ],
        verify: "(80-60)/60*100",
      },
      {
        id: "pc-m2-q10",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "challenge",
        question:
          "“80% of the pupils asked preferred purple blazers, so purple blazers it is!” announced the Head — forgetting to mention that 80% of the pupils had not even been asked. What percentage of **all** the pupils had actually told the Head they preferred purple?",
        options: ["20%", "16%", "64%", "80%"],
        answerIndex: 1,
        optionFeedback: [
          "20% is the percentage who were *asked*. Only 80% of those chose purple.",
          "Only 20% were asked, and 80% of 20% = 0.8 × 20% = 16%.",
          "64% is 80% of 80% — but the 80% who weren't asked gave no opinion. Use the 20% who were asked.",
          "80% is what the Head claimed, but that was 80% of the pupils *asked*, not 80% of all the pupils.",
        ],
        explanation:
          "Imagine 100 pupils. 80 were not asked, so only 20 were asked, and 80% of those 20 preferred purple: 0.8 × 20 = 16 pupils. That's 16 out of 100, which is 16%. With decimals: 0.8 × 0.2 = 0.16 = 16% — finding a percentage *of* a percentage means multiplying.",
        hints: [
          "If 80% of the pupils were NOT asked, what percentage WERE asked?",
          "Of the pupils who were asked, 80% chose purple. What is 80% of that group?",
          "Try it with 100 pupils: how many were asked, and how many of those chose purple?",
        ],
        strategy: "Try small cases",
        verify: "(100-80)/100*80",
        source: "UKMT JMC",
      },
    ],
  },

  // ===========================================================================
  // SET 3 · Exam practice  (warm-up 1 / core 6 / challenge 3)
  // ===========================================================================
  {
    id: "pc-mcq-3",
    title: "Set 3 · Exam practice",
    subtitle: "Test-style practice: sales tax, a sale-price table, profit, depreciation, decrease to zero and UKMT puzzles",
    topic: "pc",
    questions: [
      {
        id: "pc-m3-q01",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "warmup",
        question: "Without a calculator, find 3% of £450.",
        options: ["£135", "£150", "£436.50", "£13.50"],
        answerIndex: 3,
        optionFeedback: [
          "£135 is 30% of £450 (3 × £45). For 3% you need 3 × 1%, and 1% is £4.50.",
          "£150 is £450 ÷ 3 — a third of £450, which is about 33%, not 3%.",
          "£436.50 is £450 − £13.50, what's left after a 3% decrease. The question just asks for 3% of £450.",
          "1% of £450 is £4.50, so 3% = 3 × £4.50 = £13.50.",
        ],
        explanation:
          "Use 1% as your building block: 1% of £450 = £450 ÷ 100 = £4.50. Then 3% = 3 × £4.50 = £13.50. Sense check: 10% is £45, and 3% should be a bit less than a third of that — £13.50 ✓.",
        hints: ["Find 1% first by dividing by 100. Then multiply by 3."],
        verify: "3/100*450",
      },
      {
        id: "pc-m3-q02",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "core",
        question: "You know that {{1/8}} = 12.5%. Use this to write {{1/16}} as a percentage.",
        options: ["25%", "6.25%", "16%", "0.625%"],
        answerIndex: 1,
        optionFeedback: [
          "25% is double 12.5%, but {{1/16}} is *smaller* than {{1/8}} — sixteenths are smaller pieces than eighths. Halve instead.",
          "{{1/16}} is half of {{1/8}}, so it's half of 12.5%, which is 6.25%.",
          "{{1/16}} isn't 16%. 16% means 16 out of 100, but {{1/16}} means 1 out of 16 equal parts — much smaller.",
          "1 ÷ 16 = 0.0625, but you multiplied by 10 instead of 100. 0.0625 × 100 = 6.25%.",
        ],
        explanation:
          "Cutting each eighth into two equal pieces makes sixteenths, so {{1/16}} is half of {{1/8}}. Half of 12.5% is 6.25%. Check by dividing: 1 ÷ 16 = 0.0625, and 0.0625 × 100 = 6.25% ✓. Remember: the bigger the denominator, the smaller each piece.",
        hints: ["How are sixteenths related to eighths?", "{{1/16}} is half of {{1/8}}. What is half of 12.5%?"],
        strategy: "Find a pattern",
        verify: "1/16*100",
      },
      {
        id: "pc-m3-q03",
        topic: "pc",
        section: "pc-change",
        difficulty: "core",
        question: "A customer buys 4 lamps at £20 each. A sales tax of 15% is then added on. What is the total cost?",
        options: ["£23", "£95", "£92", "£68"],
        answerIndex: 2,
        optionFeedback: [
          "£23 is the cost of *one* lamp with tax (£20 + £3). The customer buys 4 lamps.",
          "£95 adds £15 to £80. The tax is 15% *of £80*, which is £12.",
          "4 × £20 = £80, 15% of £80 = £12, and £80 + £12 = £92.",
          "£68 is £80 − £12 — the tax has been taken off instead of added on.",
        ],
        explanation:
          "Cost before tax: 4 × £20 = £80. Tax: 10% of £80 = £8 and 5% = £4, so 15% = £12. Total: £80 + £12 = £92. In one step: 80 × 1.15 = 92.",
        hints: ["What do the 4 lamps cost before tax?", "15% = 10% + 5%. Find 15% of that total and add it on."],
        verify: "4*20*1.15",
        source: "Class worksheet",
      },
      {
        id: "pc-m3-q04",
        topic: "pc",
        section: "pc-change",
        difficulty: "core",
        question:
          "A sports shop is having a sale. The table shows the price of each item before the sale and its discount. Once each discount has been taken off, what is the **lowest** sale price of the four items?",
        table: {
          caption: "Sports shop sale",
          headers: ["Item", "Price before the sale", "Discount"],
          rows: [
            ["Hoodie", "$60", "10%"],
            ["Jeans", "$75", "40%"],
            ["Trainers", "$90", "45%"],
            ["Jacket", "$150", "30%"],
          ],
        },
        options: ["$45", "$54", "$49.50", "$35"],
        answerIndex: 0,
        optionFeedback: [
          "Jeans: $75 × 0.6 = $45. The other sale prices are $54, $49.50 and $105, so $45 is the cheapest.",
          "$54 is the hoodie's sale price. It was the cheapest item *before* the sale, but the jeans end up cheaper.",
          "$49.50 is the trainers' sale price. The biggest discount doesn't always give the lowest price — check every item.",
          "$35 is $75 − $40. A 40% discount takes off 40% *of $75*, which is $30, so the jeans cost $45.",
        ],
        explanation:
          "Work out every sale price — don't guess. Hoodie $60 × 0.9 = $54; jeans $75 × 0.6 = $45; trainers $90 × 0.55 = $49.50; jacket $150 × 0.7 = $105. The cheapest is the jeans at $45. Neither the lowest starting price nor the biggest discount told you that — only calculating did.",
        hints: [
          "Work out the sale price of every item before you decide.",
          "A 40% discount leaves 60%, so multiply by 0.6. What multiplier goes with each of the other discounts?",
        ],
        strategy: "Use the multiplier",
        verify: "75*(1-40/100)",
      },
      {
        id: "pc-m3-q05",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "core",
        question:
          "Accidents involving tea-cosies went down from three in 1993 to nil (none at all) in 1994. What percentage decrease was that?",
        options: ["300%", "3%", "0%", "100%"],
        answerIndex: 3,
        optionFeedback: [
          "300% comes from 3 × 100 without dividing by the original number. The decrease is 3 out of an original 3.",
          "The number fell by 3 accidents, but that isn't 3%. Compare the fall with the original 3.",
          "0% is the 1994 number as a percentage of the 1993 number — what's *left*. The decrease is everything.",
          "The fall is 3 and the original is 3: {{3/3}} × 100 = 100%.",
        ],
        explanation:
          "The original number was 3 and it fell to 0, so the decrease is 3. Percentage decrease = decrease ÷ original × 100 = {{3/3}} × 100 = 100%. Anything that drops to zero has fallen by 100% — and since a count like this can't go below zero, it can never fall by more than 100%.",
        hints: ["What is the original number, and how much did it fall by?", "Percentage decrease = decrease ÷ original × 100."],
        verify: "(3-0)/3*100",
        source: "UKMT JMC 1997",
      },
      {
        id: "pc-m3-q06",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "core",
        question: "Ravi buys 20 mangoes for $10 altogether. He sells all of them for 80 cents each. What is his percentage profit?",
        options: ["37.5%", "160%", "60%", "6%"],
        answerIndex: 2,
        optionFeedback: [
          "37.5% comes from {{6/16}} — dividing the profit by the money he took. Profit is a percentage of what he *paid*, $10.",
          "160% is his takings ($16) as a percentage of his cost. The *profit* is 160% − 100% = 60%.",
          "He takes 20 × $0.80 = $16, so his profit is $6, and {{6/10}} × 100 = 60%.",
          "$6 is the profit in dollars, not a percentage. Compare it with the $10 he paid.",
        ],
        explanation:
          "Takings: 20 × $0.80 = $16. Profit = takings − cost = $16 − $10 = $6. Percentage profit = profit ÷ cost × 100 = {{6/10}} × 100 = 60%. Profit and loss percentages are always worked out on the original cost.",
        hints: [
          "How much money does Ravi take for all 20 mangoes?",
          "Profit = takings − cost. Then compare the profit with what he PAID.",
        ],
        verify: "(20*0.8-10)/10*100",
      },
      {
        id: "pc-m3-q07",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "core",
        question: "Jun's new phone cost $400. Its value falls by 25% every year. What is it worth after 2 years?",
        options: ["$200", "$225", "$300", "$25"],
        answerIndex: 1,
        optionFeedback: [
          "$200 takes 50% off in one go (25% + 25%). But the second year's 25% is taken from the lower value, $300.",
          "Each year multiply by 0.75: $400 × 0.75 = $300, then $300 × 0.75 = $225.",
          "$300 is its value after 1 year. Apply the 25% fall a second time.",
          "$25 multiplies by 0.25 twice, but 0.25 finds the amount *lost*. The value left each year is 75%, so use × 0.75.",
        ],
        explanation:
          "A 25% fall leaves 75%, so the multiplier is 0.75 — once for each year. After 1 year: $400 × 0.75 = $300. After 2 years: $300 × 0.75 = $225. The second year's fall is 25% of $300 = $75, not $100, which is why the answer isn't $200.",
        hints: [
          "After a 25% fall, what percentage of the value is left? Write it as a multiplier.",
          "Use that multiplier once for each year.",
        ],
        strategy: "Use the multiplier",
        verify: "400*0.75*0.75",
      },
      {
        id: "pc-m3-q08",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "challenge",
        question:
          "Goldilocks mixes 3 bags of oats with 1 bag that contains 20% wheat bran and 80% oats. All four bags hold the same amount. What percentage of the mixture is wheat bran?",
        options: ["5%", "25%", "20%", "{{6 2/3}}%"],
        answerIndex: 0,
        optionFeedback: [
          "The bran is 20% of one bag, which is 0.2 of a bag, out of 4 bags in total: {{0.2/4}} = 0.05 = 5%.",
          "25% treats the whole special bag as bran. Only 20% of that bag is bran.",
          "20% is the bran in the special bag. Mixing it with 3 bags of oats spreads the bran out, so the percentage must drop.",
          "{{6 2/3}}% compares the bran (0.2 of a bag) with the 3 bags of oats only — part to part. You need bran ÷ the whole mixture of 4 bags.",
        ],
        explanation:
          "Measure everything in bags. The special bag holds 0.2 of a bag of bran (20% of one bag), and the whole mixture is 3 + 1 = 4 bags. So the bran is {{0.2/4}} = 0.05 = 5% of the mixture. Another way: the special bag is {{1/4}} of the mixture, and 20% of {{1/4}} is 0.2 × 0.25 = 0.05 = 5%.",
        hints: [
          "How much bran is in the special bag, measured in bags?",
          "How many bags make up the whole mixture?",
          "Write the bran as a fraction of the whole mixture, then change it into a percentage.",
        ],
        strategy: "Use a bar model",
        verify: "20/100*1/(3+1)*100",
        source: "UKMT JMC",
      },
      {
        id: "pc-m3-q09",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "challenge",
        question: "The square of a non-zero number is equal to 70% of the number. What is the number?",
        options: ["0.49", "70", "{{sqrt(0.7)}}", "0.7"],
        answerIndex: 3,
        optionFeedback: [
          "0.49 is 0.7², the value of *both* sides when the number is 0.7 — not the number itself.",
          "70 forgets to change 70% into 0.7. Check: 70² = 4900, but 70% of 70 is only 49.",
          "{{sqrt(0.7)}} solves x² = 0.7, but the square has to equal 70% *of the number*, which is 0.7x, not 0.7.",
          "If x² = 0.7x, dividing both sides by x gives x = 0.7. Check: 0.7² = 0.49 and 70% of 0.7 = 0.49 ✓.",
        ],
        explanation:
          "Call the number x. 70% of x is 0.7x, so x × x = 0.7 × x. Because x isn't zero, you can divide both sides by x, which gives x = 0.7. Check: 0.7² = 0.49, and 70% of 0.7 = 0.49 ✓. It makes sense: the square is positive, so the number must be positive — and squaring makes a positive number smaller (as taking 70% of it does) only when it is between 0 and 1.",
        hints: [
          "Call the number x. Write '70% of x' using a decimal.",
          "So x × x = 0.7 × x. What can you divide both sides by?",
          "Check your answer: square it, then find 70% of it. Do you get the same?",
        ],
        strategy: "Introduce a variable",
        verify: "70/100",
        source: "UKMT JMC",
      },
      {
        id: "pc-m3-q10",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "challenge",
        question:
          "The base of a triangle is increased by 25%, but its area stays the same. By what percentage has the perpendicular height been decreased?",
        options: ["25%", "12.5%", "20%", "80%"],
        answerIndex: 2,
        optionFeedback: [
          "Cutting the height by 25% too gives 1.25 × 0.75 = 0.9375, so the area would shrink. The height has to be multiplied by 0.8.",
          "12.5% halves the 25% because of the {{1/2}} in the area formula. But the {{1/2}} is there before and after, so it doesn't change the percentages.",
          "The base is × 1.25, so the height must be × 0.8 (because 1.25 × 0.8 = 1). × 0.8 is a 20% decrease.",
          "80% is how much of the height is *left* (× 0.8). The decrease is 100% − 80% = 20%.",
        ],
        explanation:
          "Area = {{1/2}} × base × height. The base is multiplied by 1.25 = {{5/4}}, so for the area to stay the same the height must be multiplied by {{4/5}} = 0.8 (since {{5/4 * 4/5}} = 1). Multiplying by 0.8 is a 20% decrease. Check with numbers: base 4 and height 10 give area 20; base 5 and height 8 also give area 20 ✓.",
        hints: [
          "Area = {{1/2}} × base × height. What multiplier goes with a 25% increase in the base?",
          "The area doesn't change, so (base multiplier) × (height multiplier) = 1. So 1.25 × ? = 1.",
          "1.25 = {{5/4}}. What do you multiply {{5/4}} by to get 1?",
        ],
        strategy: "Use the multiplier",
        verify: "(1-1/1.25)*100",
        source: "UKMT JMC 2014",
      },
    ],
  },

  // ===========================================================================
  // SET 4 · Stretch & challenge  (warm-up 0 / core 5 / challenge 5)
  // ===========================================================================
  {
    id: "pc-mcq-4",
    title: "Set 4 · Stretch & challenge",
    subtitle: "Tiny percentages, multi-step and reverse problems, spot the error and tough UKMT percentage puzzles",
    topic: "pc",
    questions: [
      {
        id: "pc-m4-q01",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "core",
        question: "Write 0.4% as a fraction in its simplest form.",
        options: ["{{1/250}}", "{{2/5}}", "{{1/25}}", "{{1/2500}}"],
        answerIndex: 0,
        optionFeedback: [
          "0.4% = {{0.4/100}} = {{4/1000}} = {{1/250}}.",
          "{{2/5}} is 0.4 as a fraction. But 0.4% means 0.4 out of 100, so you also have to divide by 100.",
          "{{1/25}} = {{4/100}} = 4%. You divided 0.4 by 10 instead of 100: 0.4% is 0.004, not 0.04.",
          "{{1/2500}} = 0.0004, which is 0.04%. You divided by 1000 instead of 100.",
        ],
        explanation:
          "Percent means 'out of 100', so 0.4% = {{0.4/100}}. Multiply the top and bottom by 10 to clear the decimal: {{4/1000}}. Then divide the top and bottom by 4 to simplify: {{1/250}}. Check: 1 ÷ 250 = 0.004, and 0.004 × 100 = 0.4% ✓.",
        hints: [
          "0.4% means 0.4 out of 100. Write it as a fraction with 100 on the bottom.",
          "Multiply the top and bottom by 10 to get whole numbers, then simplify.",
        ],
        strategy: "Spot the common factor",
        verify: "0.4/100",
      },
      {
        id: "pc-m4-q02",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "core",
        question:
          "Hana's maths revision session lasts 2 hours. She spends 48 minutes of it on percentages. What percentage of the session is that?",
        options: ["80%", "24%", "40%", "2400%"],
        answerIndex: 2,
        optionFeedback: [
          "80% compares 48 minutes with 1 hour (60 minutes). The session lasts 2 hours, which is 120 minutes.",
          "24% treats 2 hours as 200 minutes. There are 60 minutes in an hour, so 2 hours = 120 minutes.",
          "2 hours = 120 minutes, and {{48/120}} = {{2/5}} = 40%.",
          "2400% comes from 48 ÷ 2 × 100 — mixing minutes with hours. Change both into minutes first.",
        ],
        explanation:
          "Make the units match first: 2 hours = 120 minutes. Then 48 out of 120 is {{48/120}}, and dividing the top and bottom by 24 gives {{2/5}} = 40%. Always change to the same units before writing one amount as a percentage of another.",
        hints: [
          "Change 2 hours into minutes.",
          "Write 48 as a fraction of the total number of minutes, then change it into a percentage.",
        ],
        verify: "48/(2*60)*100",
      },
      {
        id: "pc-m4-q03",
        topic: "pc",
        section: "pc-change",
        difficulty: "core",
        question:
          "Jordan made 420 cakes to sell on Monday. At first he priced his cakes at £2 each and sold 50% of them at this price. Later in the day he reduced his price by 25%. He then sold another 20 cakes. How much money did he make on Monday?",
        options: ["£460", "£455", "£430", "£450"],
        answerIndex: 3,
        optionFeedback: [
          "£460 sells the last 20 cakes at £2. The price had been cut by 25%, to £1.50.",
          "£455 takes 25p off the price. But 25% of £2 is 50p, so the new price is £1.50, not £1.75.",
          "£430 uses 50p as the new price. 50p is the *reduction*; the new price is £2 − 50p = £1.50.",
          "210 cakes at £2 make £420, and 20 cakes at £1.50 make £30, so he made £450.",
        ],
        explanation:
          "50% of 420 is 210 cakes, and 210 × £2 = £420. A 25% reduction on £2 is 50p, so the new price is £1.50 (or £2 × 0.75 = £1.50). The last 20 cakes make 20 × £1.50 = £30. Total: £420 + £30 = £450.",
        hints: [
          "How many cakes did he sell at £2, and how much money did that make?",
          "What is the new price after a 25% reduction? How much do 20 cakes at that price make?",
        ],
        verify: "420*50/100*2+20*2*(1-25/100)",
        source: "Class worksheet",
      },
      {
        id: "pc-m4-q04",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "core",
        question:
          "A bike's price fell from $250 to $200. Ethan worked out the percentage decrease like this:\n\n    Decrease = 250 − 200 = 50\n    50 ÷ 200 × 100 = 25%\n\nWhat is the correct percentage decrease?",
        options: ["25%", "20%", "50%", "80%"],
        answerIndex: 1,
        optionFeedback: [
          "25% is Ethan's answer. He divided by the new price, $200, but percentage change always divides by the original price, $250.",
          "Ethan's first line is right, but he should divide by the original price: {{50/250}} × 100 = 20%.",
          "$50 is the decrease in dollars, not a percentage. Compare it with the original $250.",
          "80% is $200 as a percentage of $250 — the part that's *left*. The decrease is 100% − 80% = 20%.",
        ],
        explanation:
          "Ethan found the decrease correctly ($50) but divided by the wrong price. Percentage change = change ÷ ORIGINAL × 100, and the original price is $250, so the decrease is {{50/250}} × 100 = {{1/5}} × 100 = 20%. Check: 20% of $250 is $50, and $250 − $50 = $200 ✓. Memory trick: divide by where you *started*.",
        hints: [
          "Ethan's first line is fine. Look carefully at what he divided by.",
          "Which price is the original? Divide the $50 by that.",
        ],
        verify: "(250-200)/250*100",
      },
      {
        id: "pc-m4-q05",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "core",
        question:
          "A price is increased by 20%. The new price is then decreased by 25%. Which single multiplier has the same effect as both changes together?",
        options: ["0.9", "0.95", "1.5", "0.3"],
        answerIndex: 0,
        optionFeedback: [
          "Up 20% is × 1.2 and down 25% is × 0.75, and 1.2 × 0.75 = 0.9.",
          "0.95 comes from adding the percentages: +20% − 25% = −5%. Changes one after another multiply — they don't add.",
          "1.5 uses × 1.25 for the decrease. A 25% decrease leaves 75%, so its multiplier is 0.75, not 1.25.",
          "0.3 uses × 0.25 for the decrease, but 0.25 finds the amount taken off. The amount left is 75%, so use × 0.75.",
        ],
        explanation:
          "Turn each change into a multiplier: up 20% is × 1.2, and down 25% is × 0.75. One change after another means multiplying: 1.2 × 0.75 = 0.9. So the overall effect is × 0.9, a 10% decrease. Check with £100: up 20% gives £120, then 25% of £120 is £30, leaving £90 ✓.",
        hints: [
          "Write each change as a decimal multiplier.",
          "When one change follows another, do you add or multiply the multipliers?",
        ],
        strategy: "Use the multiplier",
        verify: "1.2*0.75",
      },
      {
        id: "pc-m4-q06",
        topic: "pc",
        section: "pc-change",
        difficulty: "challenge",
        question:
          "When a number is increased by 20%, the answer is 60. What do you get if you decrease the **original** number by 20%?",
        options: ["48", "36", "50", "40"],
        answerIndex: 3,
        optionFeedback: [
          "48 is 60 decreased by 20%, but 60 isn't the original number. Find the original first: 60 ÷ 1.2 = 50.",
          "36 takes 20% of 60 off twice (60 − 12 − 12): once to 'undo' the increase and once for the decrease. A 20% decrease doesn't undo a 20% increase — find the original first.",
          "50 is the original number. You still need to decrease it by 20%.",
          "The original × 1.2 = 60, so the original is 60 ÷ 1.2 = 50, and 50 × 0.8 = 40.",
        ],
        explanation:
          "Work backwards. An increase of 20% means × 1.2, so original × 1.2 = 60 and the original is 60 ÷ 1.2 = 50 (or: 60 is 120%, so 10% is 5 and 100% is 50). Now decrease 50 by 20%: 50 × 0.8 = 40. This is a *reverse percentage* — a stretch beyond the test objectives, but great multiplier practice.",
        hints: [
          "Call the original number n. What does n become after a 20% increase, as a multiplier?",
          "60 is 120% of the original. What is 10% of the original? What is 100%?",
          "Now decrease the original number by 20%.",
        ],
        strategy: "Work backwards",
        verify: "60/1.2*0.8",
      },
      {
        id: "pc-m4-q07",
        topic: "pc",
        section: "pc-of-amount",
        difficulty: "challenge",
        question:
          "A page measures 30 cm by 40 cm. It has a margin 2 cm wide on every side. What percentage of the page is taken up by the margins?",
        diagram: `<svg viewBox="0 0 340 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A page 40 cm wide and 30 cm tall with a shaded margin 2 cm wide around every edge">
<rect x="0" y="0" width="340" height="250" fill="#ffffff"/>
<rect x="60" y="20" width="240" height="180" fill="#fde68a" stroke="#1f2937" stroke-width="2"/>
<rect x="72" y="32" width="216" height="156" fill="#ffffff" stroke="#334155" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="180" y="105" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#1f2937">shaded margin:</text>
<text x="180" y="124" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#1f2937">2 cm wide on every side</text>
<text x="180" y="222" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#1f2937">40 cm</text>
<text x="52" y="115" font-size="13" font-family="sans-serif" text-anchor="end" fill="#1f2937">30 cm</text>
</svg>`,
        options: ["78%", "22%", "{{23 1/3}}%", "10%"],
        answerIndex: 1,
        optionFeedback: [
          "78% is the part *inside* the margins (936 cm² out of 1200 cm²). The margins are the rest: 100% − 78% = 22%.",
          "The page is 30 × 40 = 1200 cm² and the inside is 26 × 36 = 936 cm², so the margins are 264 cm², and {{264/1200}} = 22%.",
          "{{23 1/3}}% comes from 280 cm² of margin — adding up four strips counts each 2 cm × 2 cm corner twice. Take off the extra 16 cm².",
          "10% compares lengths (4 cm out of 40 cm), but the margins take up *area*. Work with areas in cm².",
        ],
        explanation:
          "Whole page: 30 × 40 = 1200 cm². The margin comes off both ends of each side, so the inside measures (30 − 4) by (40 − 4), which is 26 × 36 = 936 cm². The margins are 1200 − 936 = 264 cm². As a percentage: {{264/1200}} = {{22/100}} = 22% (divide the top and bottom by 12).",
        hints: [
          "Find the area of the whole page.",
          "The margin is on BOTH sides. How wide and how tall is the part inside the margins?",
          "Margin area = whole page − inside part. Then write it as a percentage of the whole page.",
        ],
        strategy: "Draw a diagram",
        verify: "(30*40-(30-2*2)*(40-2*2))/(30*40)*100",
        source: "UKMT JMC",
      },
      {
        id: "pc-m4-q08",
        topic: "pc",
        section: "pc-percent-change",
        difficulty: "challenge",
        question:
          "A painting that cost 50p is said to be worth £15 000. If it were sold for £15 000, approximately what percentage profit would that be?",
        options: ["30 000%", "100%", "3 000 000%", "30 000 000%"],
        answerIndex: 2,
        optionFeedback: [
          "30 000% mixes pence and pounds ({{15000/50}} × 100), or forgets to × 100 (£15 000 ÷ £0.50 = 30 000). Use pounds for both, then × 100.",
          "100% comes from dividing the profit (about £15 000) by the selling price, £15 000. Percentage profit divides by what was *paid*: 50p.",
          "The profit is about £15 000, which is 30 000 times the 50p cost, so the profit is about 30 000 × 100% = 3 000 000%.",
          "30 000 000% treats 50p as £0.05. 50p is £0.50, so the answer is ten times smaller.",
        ],
        explanation:
          "Use the same units: the cost is £0.50. The profit is £15 000 − £0.50, which is about £15 000. Percentage profit = profit ÷ cost × 100 ≈ 15 000 ÷ 0.5 × 100 = 30 000 × 100 = 3 000 000%. (The exact answer, 2 999 900%, rounds to this.)",
        hints: [
          "Write both amounts in pounds.",
          "Percentage profit = profit ÷ ORIGINAL cost × 100, and the profit is roughly £15 000.",
          "How many times does £0.50 go into £15 000? Then change that into a percentage.",
        ],
        strategy: "Estimate first",
        verify: "15000/0.5*100",
        source: "UKMT JMC",
      },
      {
        id: "pc-m4-q09",
        topic: "pc",
        section: "pc-multipliers",
        difficulty: "challenge",
        question:
          "Inspector Remorse had 20% more cases in 2004 than in 2003. In 2003 he solved 80% of his cases, but in 2004 he solved only 60% of them. By what percentage did the **number** of cases he solved go down?",
        options: ["10%", "20%", "25%", "8%"],
        answerIndex: 0,
        optionFeedback: [
          "With 100 cases in 2003 he solved 80. In 2004 he had 120 cases and solved 60% of them, which is 72. The fall is 8 out of 80, which is 10%.",
          "20% is 80% − 60%, which ignores the fact that he had 20% *more* cases in 2004.",
          "25% compares 60% with 80% as if he had the same number of cases both years. He had 20% more cases in 2004.",
          "8 is the drop in solved cases if he had 100 cases in 2003 — but that's 8 out of the 80 he solved, so the fall is {{8/80}} = 10%.",
        ],
        explanation:
          "Imagine he had 100 cases in 2003, so he solved 80. In 2004 he had 20% more, which is 120 cases, and he solved 60% of them: 0.6 × 120 = 72. The number solved fell from 80 to 72, a drop of 8, and {{8/80}} × 100 = 10%. With multipliers: 1.2 × 0.6 = 0.72 compared with 0.8, and 0.72 ÷ 0.8 = 0.9, a 10% decrease.",
        hints: [
          "Choose an easy number of cases for 2003, such as 100. How many did he solve?",
          "How many cases did he have in 2004, and how many of those did he solve?",
          "Find the percentage change from the 2003 number solved to the 2004 number solved.",
        ],
        strategy: "Try small cases",
        verify: "(0.8-1.2*0.6)/0.8*100",
        source: "UKMT JMC",
      },
      {
        id: "pc-m4-q10",
        topic: "pc",
        section: "pc-fdp",
        difficulty: "challenge",
        question: "The numbers x and y are positive, and x is 40% of y. What is y as a percentage of x?",
        options: ["160%", "250%", "60%", "2.5%"],
        answerIndex: 1,
        optionFeedback: [
          "160% assumes that because x is 60% less than y, y must be 60% more than x. Percentages don't reverse like that — they're percentages of different amounts.",
          "x is {{2/5}} of y, so y is {{5/2}} of x, which is 2.5 × x = 250% of x.",
          "60% is 100% − 40%: how much smaller x is than y, as a percentage of y. The question asks for y compared with x.",
          "y = 2.5x, so 2.5 is right as a multiplier — but as a percentage that's 2.5 × 100 = 250%, not 2.5%.",
        ],
        explanation:
          "40% = {{2/5}}, so x is {{2/5}} of y. Flip it round: y is {{5/2}} of x, which is 2.5x, and 2.5 = 250%. So y is 250% of x. Try numbers to check: if y = 100 then x = 40, and {{100/40}} = 2.5 = 250% ✓.",
        hints: [
          "Try a number: if y = 100, what is x?",
          "Now write y as a fraction of x.",
          "Change that fraction into a percentage. Can the answer be more than 100%?",
        ],
        strategy: "Try small cases",
        verify: "100/40*100",
      },
    ],
  },
];
