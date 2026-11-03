// Fresh-number generators — Percentages (Unit 1). See fr.ts (fr-add) for the reference example.
//
//   pc-of              a percentage of an amount, built from 10%, 5% and 1% (non-calculator)
//   pc-change          increase or decrease an amount by a percentage (incl. increases over 100%)

import { cap, fr, fracSpec, gcd, m, money, num, numSpec, reduce, tidy, type Draft, type Generator, type Rng, type Wrong } from "./core.ts";
import type { Difficulty } from "../types.ts";

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/** A percentage for text: 35 → "35%", 12.5 → "12.5%". */
const pct = (x: number) => `${num(x)}%`;

/** "a" or "an" before a number said aloud: an 8%, an 18%, an 80% — but a 110%. */
const an = (x: number) => (/^(8|11(?!\d)|18(?!\d))/.test(num(x)) ? "an" : "a");

/** Least common multiple of two whole numbers. */
const lcm2 = (a: number, b: number) => (a * b) / gcd(a, b);

/** Space between thousands from five digits up, as the bank writes them: 12600 → "12 600", 8640 → "8640". */
function group(s: string): string {
  const [i, f] = s.split(".");
  const g = i.length >= 5 ? i.replace(/\B(?=(\d{3})+$)/g, " ") : i;
  return f === undefined ? g : `${g}.${f}`;
}

/** A plain number for text, with thousands spaced: 12600 → "12 600". */
const big = (x: number) => group(num(x));

type Cur = "£" | "$";

/** Money in £ (the class worksheets) or $ (Singapore): 12.5 → "£12.50", 12600 → "£12 600". */
const cash = (x: number, c: Cur = "£") => money(x).replace("£", c).replace(/[\d.]+$/, (d) => group(d));

/** A fraction exactly as written, unreduced: {{35/100}}. */
const raw = (n: number, d: number) => m(`${n}/${d}`);

/** True if x is a whole number of pennies (or cents). */
const pennies = (x: number) => Number.isInteger(tidy(x * 100));

const NAMES = ["Aisha", "Wei Ling", "Arjun", "Priya", "Marcus", "Siti", "Ethan", "Mei", "Ravi", "Hana", "Jun", "Zara", "Omar"];

/** Keep only wrong answers whose value differs from the answer (a trap equal to the answer would be marked correct). */
function distinct(wrong: (Wrong & { v: number })[], ans: number): Wrong[] {
  return wrong.filter((w) => Math.abs(w.v - ans) > 1e-9).map(({ v: _v, ...w }) => w);
}

/** The smallest whole number A for which p% of A is a whole number. */
const wholeStep = (p: number) => {
  const t = tidy(p * 10); // work in tenths so 2.5% is handled too
  return 1000 / gcd(t, 1000);
};

/** A random multiple of `step` between lo and hi (at least one multiple of step). */
function multiple(r: Rng, step: number, lo: number, hi: number): number {
  const a = Math.ceil(lo / step);
  const b = Math.max(a, Math.floor(hi / step));
  return step * r.int(a, b);
}

// ---------------------------------------------------------------------------
// Building up a percentage from easy pieces (100%, 50%, 25%, 10%, 5%, 2.5%, 1%)
// ---------------------------------------------------------------------------

interface Piece {
  pc: number;
  val: number;
}

/** The working for "p% of A" in sentences, and the pieces it adds up. */
function buildUp(p: number, A: number, f: (x: number) => string): { steps: string[]; pieces: Piece[] } {
  const steps: string[] = [];
  const pieces: Piece[] = [];
  const h = Math.floor(p / 100);
  const rest = tidy(p - 100 * h);
  if (h) {
    pieces.push({ pc: 100 * h, val: h * A });
    steps.push(h === 1 ? `100% of ${f(A)} is all of it: ${f(A)}.` : `${100 * h}% of ${f(A)} is ${h} lots of ${f(A)}: ${f(h * A)}.`);
  }
  if (rest === 50 || rest === 25 || rest === 75) {
    const v = tidy((A * rest) / 100);
    pieces.push({ pc: rest, val: v });
    steps.push(rest === 50 ? `50% is half of ${f(A)}: ${f(v)}.` : rest === 25 ? `25% is a quarter of ${f(A)}: ${f(v)}.` : `25% is a quarter of ${f(A)}, ${f(A / 4)}, so 75% is 3 × ${f(A / 4)} = ${f(v)}.`);
  } else if (rest > 0) {
    const t = Math.floor(rest / 10);
    const rem = tidy(rest - 10 * t);
    const ten = tidy(A / 10);
    // 10% is needed for the tens, and for 5% / 2.5% (which come from halving it)
    if (t > 0 || rem === 2.5 || rem >= 5) {
      steps.push(`10% of ${f(A)} is ${f(A)} ÷ 10 = ${f(ten)}${t > 1 ? `, so ${10 * t}% is ${t} × ${f(ten)} = ${f(t * ten)}` : ""}.`);
    }
    if (t > 0) pieces.push({ pc: 10 * t, val: tidy(t * ten) });
    const five = tidy(A / 20);
    const half5 = tidy(A / 40);
    const one = tidy(A / 100);
    if (rem === 5) {
      steps.push(`5% is half of 10%: ${f(five)}.`);
      pieces.push({ pc: 5, val: five });
    } else if (rem === 2.5 || rem === 7.5) {
      steps.push(`5% is half of 10%, ${f(five)}, and 2.5% is half of 5%, ${f(half5)}.`);
      if (rem === 7.5) pieces.push({ pc: 5, val: five });
      pieces.push({ pc: 2.5, val: half5 });
    } else if (rem > 0) {
      const u = rem > 5 ? rem - 5 : rem;
      if (rem > 5) {
        steps.push(`5% is half of 10%: ${f(five)}.`);
        pieces.push({ pc: 5, val: five });
      }
      steps.push(`1% of ${f(A)} is ${f(A)} ÷ 100 = ${f(one)}${u > 1 ? `, so ${u}% is ${u} × ${f(one)} = ${f(u * one)}` : ""}.`);
      pieces.push({ pc: u, val: tidy(u * one) });
    }
  }
  if (pieces.length > 1) {
    const total = tidy(pieces.reduce((s, x) => s + x.val, 0));
    steps.push(`So ${pct(p)} = ${pieces.map((x) => f(x.val)).join(" + ")} = ${f(total)}.`);
  }
  return { steps, pieces };
}

/** How p% splits into the pieces buildUp uses: "35% → 30% + 5%", "18% → 10% + 5% + 3%", "150% → 100% + 50%". */
function splitText(p: number): string {
  const out: string[] = [];
  const h = Math.floor(p / 100);
  let rest = tidy(p - 100 * h);
  if (h) out.push(`${100 * h}%`);
  if (rest === 50 || rest === 25 || rest === 75) return [...out, `${rest}%`].join(" + ");
  const t = Math.floor(rest / 10);
  if (t) out.push(`${10 * t}%`);
  rest = tidy(rest - 10 * t);
  if (rest >= 5) {
    out.push("5%");
    rest = tidy(rest - 5);
  }
  if (rest > 0) out.push(pct(rest));
  return out.join(" + ");
}

// ---------------------------------------------------------------------------
// pc-fdp — convert between fractions, decimals and percentages
// ---------------------------------------------------------------------------

/** Fraction (denominator a factor of 100, or eighths) → percentage. */
function fracToPct(r: Rng): Draft {
  const eighths = r.chance(0.2);
  const d = eighths ? 8 : r.pick([4, 5, 10, 20, 25, 50]);
  let n = r.int(1, d - 1);
  while (gcd(n, d) !== 1) n = r.int(1, d - 1);
  const p = tidy((100 * n) / d);
  const dec = tidy(n / d);
  const k = 100 / d; // whole number unless d = 8
  const f = m(`${n}/${d}`);

  const wrong: Wrong[] = [
    {
      display: pct(n),
      spec: numSpec(n),
      feedback: eighths
        ? `${pct(n)} would be ${m(`${n}/100`)}, but here the whole is split into 8 equal parts, not 100. Each eighth is 12.5%, so ${f} = ${n} × 12.5% = ${pct(p)}.`
        : `${pct(n)} would be ${m(`${n}/100`)}. Here the denominator is ${d}, so scale it up to 100 first: ${d} × ${k} = 100, so ${f} = ${raw(p, 100)}.`,
    },
    {
      display: pct(p / 10),
      spec: numSpec(p / 10),
      feedback: `${n} ÷ ${d} = ${num(dec)}, but to change a decimal into a percentage you multiply by 100, not 10: ${num(dec)} × 100 = ${pct(p)}.`,
    },
    {
      display: pct(dec),
      spec: numSpec(dec),
      feedback: `${num(dec)} is ${f} as a decimal, not as a percentage. Multiply it by 100 to make a percentage: ${num(dec)} × 100 = ${pct(p)}.`,
    },
    eighths
      ? {
          display: pct(10 * n),
          spec: numSpec(10 * n),
          feedback: `That treats each eighth as 10%, but 10% pieces would need 10 equal parts. Each eighth is 12.5% (half of 25%), so ${f} = ${pct(p)}.`,
        }
      : {
          display: pct(n + 100 - d),
          spec: numSpec(n + 100 - d),
          feedback: `You added ${100 - d} to the top and the bottom to make the denominator 100. Adding changes the size of a fraction — multiply instead: ${d} × ${k} = 100, so the top becomes ${n} × ${k} = ${p}.`,
        },
  ];

  const times = n === 1 ? "" : `${n} × 12.5% = `;
  return {
    difficulty: eighths ? "core" : d <= 10 ? "warmup" : r.chance(0.5) ? "warmup" : "core",
    question: `Write ${f} as a percentage.`,
    answer: numSpec(p, pct(p)),
    display: pct(p),
    correctFeedback: eighths ? `${m("1/8")} = 12.5%, so ${f} = ${times}${pct(p)}.` : `${d} × ${k} = 100, so ${f} = ${raw(p, 100)} = ${pct(p)}.`,
    wrong,
    explanation: eighths
      ? `8 is not a factor of 100, so use a fact you know: ${m("1/4")} = 25%, and ${m("1/8")} is half of ${m("1/4")}, so ${m("1/8")} = 12.5%.${n === 1 ? "" : ` Then ${f} = ${times}${pct(p)}.`} Check by dividing: ${n} ÷ 8 = ${num(dec)}, and ${num(dec)} × 100 = ${num(p)} ✓.`
      : `*Per cent* means "out of 100". ${d} × ${k} = 100, so multiply the top and the bottom by ${k}: ${f} = ${raw(p, 100)} = ${pct(p)}. Check by dividing: ${n} ÷ ${d} = ${num(dec)}, and ${num(dec)} × 100 = ${num(p)} ✓.`,
    solution: eighths
      ? [
          `8 does not go into 100 exactly, so use ${m("1/8")} = 12.5% (half of ${m("1/4")} = 25%).`,
          `${f} = ${times}**${pct(p)}**.`,
          `Check: ${n} ÷ 8 = ${num(dec)}, and ${num(dec)} × 100 = ${num(p)} ✓`,
        ]
      : [
          `*Per cent* means "out of 100", so rewrite ${f} with a denominator of 100.`,
          `${d} × ${k} = 100, so multiply the top and the bottom by ${k}: ${f} = ${raw(p, 100)}.`,
          `${raw(p, 100)} = **${pct(p)}**.`,
        ],
    hints: eighths
      ? [`8 doesn't go into 100 exactly. What is ${m("1/4")} as a percentage, and how is ${m("1/8")} related to ${m("1/4")}?`, `${m("1/8")} is half of 25%. How many eighths do you need?`]
      : [`*Per cent* means "out of 100". What do you multiply ${d} by to make 100?`, "Whatever you multiply the bottom by, multiply the top by the same number."],
    verify: `${n}/${d}*100`,
    commonError: `Writing the numerator as the percentage (${f} = ${pct(n)}), or stopping at the decimal ${num(dec)} instead of multiplying by 100.`,
    strategy: eighths ? "Find a pattern" : "Find a common denominator",
    marks: eighths ? 2 : 1,
    sig: `f>p:${n}/${d}`,
  };
}

/** Decimal (less than 1) → percentage. */
function decToPct(r: Rng): Draft {
  const three = r.chance(0.3);
  // two decimal places (0.35, 0.4, 0.07), or three ending in 5 (0.465 = 46.5%)
  const x = tidy(three ? (r.int(1, 98) * 10 + 5) / 1000 : r.int(1, 99) / 100);
  const p = tidy(x * 100);
  const oneDp = !three && p % 10 === 0; // 0.4
  const tiny = !three && p < 10; // 0.07
  const xs = num(x);

  const wrong: Wrong[] = [
    {
      display: pct(x * 10),
      spec: numSpec(x * 10),
      feedback: oneDp
        ? `${xs} is ${num(p / 10)} *tenths*, which is ${num(p)} hundredths — so ${xs} = ${pct(p)}, not ${pct(x * 10)}. Multiply by 100, not 10.`
        : `You multiplied by 10. Multiplying by 100 moves every digit two places, not one: ${xs} × 100 = ${num(p)}, so ${xs} = ${pct(p)}.`,
    },
    {
      display: pct(x * 1000),
      spec: numSpec(x * 1000),
      feedback: tiny
        ? `${xs} is ${num(p)} *hundredths*, not ${num(p)} tenths (${num(p / 10)} would be ${pct(p * 10)}). Per cent means hundredths, so ${xs} = ${pct(p)}.`
        : `You moved the digits three places (× 1000). Multiplying by 100 moves them two places: ${xs} × 100 = ${num(p)}, so ${xs} = ${pct(p)}.`,
    },
    {
      display: pct(x),
      spec: numSpec(x),
      feedback: `${pct(x)} means ${xs} out of 100 — less than 1%. To change a decimal into a percentage, multiply by 100: ${xs} × 100 = ${num(p)}, so ${pct(p)}.`,
    },
    {
      display: pct(x / 100),
      spec: numSpec(x / 100),
      feedback: `You divided by 100. Going from a decimal to a percentage the number gets bigger, so multiply by 100: ${xs} × 100 = ${num(p)}.`,
    },
  ];

  const why = oneDp ? `Think of ${xs} as ${xs}0: that's ${num(p)} hundredths, and per cent means hundredths.` : `${xs} is ${num(p)} hundredths, and per cent means hundredths.`;
  return {
    difficulty: three || tiny ? "core" : "warmup",
    question: `Write ${xs} as a percentage.`,
    answer: numSpec(p, pct(p)),
    display: pct(p),
    correctFeedback: `${xs} × 100 = ${num(p)}, so ${xs} = ${pct(p)}.`,
    wrong,
    explanation: `To change a decimal into a percentage, multiply by 100 — every digit moves two places to the left. ${xs} × 100 = ${num(p)}, so ${xs} = ${pct(p)}. ${why} Check: ${pct(p)} = ${num(p)} ÷ 100 = ${xs} ✓.`,
    solution: [`*Per cent* means "out of 100", so multiply the decimal by 100.`, `${xs} × 100 = ${num(p)} (every digit moves two places to the left).`, `So ${xs} = **${pct(p)}**.`],
    hints: [`*Per cent* means "out of 100". How many hundredths is ${xs}?`, `Multiply ${xs} by 100 — every digit moves two places to the left.`],
    verify: `${xs}*100`,
    commonError: oneDp ? `Writing ${xs} as ${pct(x * 10)} — ${xs} is ${num(p)} hundredths, so it is ${pct(p)}.` : "Multiplying by 10 instead of 100, or just putting a % sign on the decimal.",
    marks: 1,
    sig: `d>p:${xs}`,
  };
}

/** Percentage (less than 100%) → fraction in its simplest form. */
function pctToFrac(r: Rng): Draft {
  const half = r.chance(0.2);
  let p: number;
  if (half) p = r.pick([2.5, 7.5, 12.5, 17.5, 37.5, 62.5, 87.5]);
  else {
    p = r.int(2, 98);
    while (gcd(p, 100) === 1 || (p % 10 === 0 && p !== 20 && p !== 50)) p = r.int(2, 98);
  }
  // p% = top/bot in whole numbers: p/100, or 2p/200 to clear a half
  const top = half ? 2 * p : p;
  const bot = half ? 200 : 100;
  const g = gcd(top, bot);
  const [a, b] = reduce(top, bot);
  const ans = fr(a, b);
  const P = pct(p);
  const over100 = half ? m(`${num(p)}/100`) : raw(p, 100);

  const wrong: Wrong[] = [];
  // out of 10 instead of out of 100 (for a half: cleared the decimal on the top only)
  const [tn, td] = reduce(half ? 2 * p : p, half ? 20 : 10);
  if (td !== 1) {
    wrong.push({
      display: fr(tn, td, false),
      spec: fracSpec(tn, td, { simplest: false }),
      feedback: half
        ? `You turned ${num(p)} into ${num(p * 10)} (× 10) but left 100 on the bottom, and ${raw(p * 10, 100)} is ${pct(p * 10)}. Whatever you do to the top, do to the bottom: ${over100} = ${raw(top, bot)}.`
        : `This is ${raw(p, 10)} simplified — ${p} out of 10. But per cent means out of **100**: ${P} = ${raw(p, 100)}, which simplifies to ${ans}.`,
    });
  }
  // "p% = 1/p"
  if (!half && 100 % p === 0 && p * p !== 100) {
    wrong.push({
      display: fr(1, p),
      spec: fracSpec(1, p, { simplest: false }),
      feedback: `${fr(1, p)} means 1 out of ${p}, which is ${pct(100 / p)}, not ${P}. ${P} means ${p} out of 100: ${raw(p, 100)} = ${ans}.`,
    });
  }
  // divided the top by the common factor but not the bottom
  wrong.push({
    display: raw(a, bot),
    spec: fracSpec(a, bot, { simplest: false }),
    feedback: `You divided the top by ${g} but not the bottom. A fraction keeps its value only if you divide the top **and** the bottom by the same number: ${raw(top, bot)} = ${ans}.`,
  });
  // out of 1000
  const [kn, kd] = reduce(top, bot * 10);
  wrong.push({
    display: fr(kn, kd),
    spec: fracSpec(kn, kd, { simplest: false }),
    feedback: `${fr(kn, kd)} is ${num(top)} out of ${big(bot * 10)}, which is only ${pct(p / 10)}. Per cent means out of 100: ${P} = ${over100} = ${ans}.`,
  });

  const start = half ? `${P} = ${over100}. Double the top and the bottom to clear the decimal: ${raw(top, bot)}.` : `${P} = ${raw(p, 100)}.`;
  return {
    difficulty: half ? "challenge" : b <= 10 ? "warmup" : "core",
    question: `Write ${P} as a fraction in its simplest form.`,
    answer: fracSpec(a, b),
    display: ans,
    correctFeedback: `${start} Divide the top and the bottom by ${g}: ${ans}.`,
    wrong,
    explanation: `*Per cent* means "out of 100". ${start} The highest common factor of ${top} and ${bot} is ${g}, so divide the top and the bottom by ${g}: ${raw(top, bot)} = ${ans}. Check: ${a} ÷ ${b} = ${num(a / b)}, which is ${P} ✓.`,
    solution: [
      half ? `${P} = ${over100}, and doubling the top and the bottom clears the decimal: ${raw(top, bot)}.` : `*Per cent* means "out of 100", so ${P} = ${raw(p, 100)}.`,
      `The highest common factor of ${top} and ${bot} is ${g}. Divide the top and the bottom by ${g}: ${raw(top, bot)} = **${ans}**.`,
      `Check: ${a} ÷ ${b} = ${num(a / b)} = ${P} ✓`,
    ],
    hints: half
      ? [`Write ${P} over 100, then double the top and the bottom to get rid of the decimal.`, "Now find the highest common factor of the top and the bottom, and divide both by it."]
      : [`*Per cent* means "out of 100". Write ${P} as a fraction with 100 on the bottom.`, "Find the highest common factor of the top and the bottom, and divide both by it."],
    verify: `${num(p)}/100`,
    commonError: "Not simplifying fully, or dividing the top by a number but forgetting to divide the bottom by it too.",
    strategy: "Spot the common factor",
    marks: half ? 2 : b <= 10 ? 1 : 2,
    sig: `p>f:${num(p)}`,
  };
}

/** Percentage → decimal. */
function pctToDec(r: Rng): Draft {
  const half = r.chance(0.25);
  const p = half ? r.int(1, 99) + 0.5 : r.int(1, 99);
  const x = tidy(p / 100);
  const P = pct(p);
  const xs = num(x);

  const wrong: Wrong[] = [
    {
      display: num(p / 10),
      spec: numSpec(p / 10, undefined, { allowFraction: false }),
      feedback: `${num(p / 10)} is ${pct(p * 10)}. You divided by 10, but ${P} means ${num(p)} out of 100, so divide by 100: ${num(p)} ÷ 100 = ${xs}.`,
    },
    {
      display: num(p / 1000),
      spec: numSpec(p / 1000, undefined, { allowFraction: false }),
      feedback: `${num(p / 1000)} is only ${pct(p / 10)} — you divided by 1000. Dividing by 100 moves the digits two places: ${num(p)} ÷ 100 = ${xs}.`,
    },
  ];
  if (!half && [2, 4, 5, 8].includes(p)) {
    wrong.push({
      display: num(1 / p),
      spec: numSpec(1 / p, undefined, { allowFraction: false }),
      feedback: `${num(1 / p)} is ${fr(1, p)} as a decimal, and ${fr(1, p)} is ${pct(100 / p)}, not ${P}. ${P} = ${raw(p, 100)} = ${xs}.`,
    });
  }
  wrong.push({
    display: big(p * 100),
    spec: numSpec(p * 100, undefined, { allowFraction: false }),
    feedback: `You multiplied by 100. Going from a percentage to a decimal the number gets smaller, so divide by 100: ${num(p)} ÷ 100 = ${xs}.`,
  });

  const placeholder = p < 10 ? ` You need a 0 straight after the point as a placeholder: ${xs}, not ${num(p / 10)}.` : "";
  return {
    difficulty: half ? "core" : "warmup",
    question: `Write ${P} as a decimal.`,
    answer: numSpec(x, undefined, { allowFraction: false }),
    display: xs,
    correctFeedback: `${P} = ${num(p)} ÷ 100 = ${xs}.`,
    wrong,
    explanation: `*Per cent* means "out of 100", so ${P} = ${num(p)} ÷ 100. Dividing by 100 moves every digit two places to the right: ${num(p)} ÷ 100 = ${xs}.${placeholder} Check: ${xs} × 100 = ${num(p)} ✓.`,
    solution: [`*Per cent* means "out of 100", so ${P} = ${num(p)} ÷ 100.`, `Dividing by 100 moves every digit two places to the right: ${num(p)} ÷ 100 = **${xs}**.`, `Check: ${xs} × 100 = ${num(p)} ✓`],
    hints: [`*Per cent* means "out of 100". What do you divide by?`, "Dividing by 100 moves every digit two places to the right."],
    verify: `${num(p)}/100`,
    commonError: p < 10 ? `Writing ${P} as ${num(p / 10)} — that is ${pct(p * 10)}. ${P} = ${xs}.` : `Dividing by 10 instead of 100 (${P} → ${num(p / 10)}).`,
    marks: 1,
    sig: `p>d:${num(p)}`,
  };
}

const pcFdp: Generator = {
  id: "pc-fdp",
  topic: "pc",
  section: "pc-fdp",
  label: "Convert between fractions, decimals and percentages",
  kinds: ["mcq", "qa"],
  make(r) {
    const dir = r.int(0, 3);
    return dir === 0 ? fracToPct(r) : dir === 1 ? decToPct(r) : dir === 2 ? pctToFrac(r) : pctToDec(r);
  },
};

// ---------------------------------------------------------------------------
// pc-of — a percentage of an amount, without a calculator
// ---------------------------------------------------------------------------

const pcOf: Generator = {
  id: "pc-of",
  topic: "pc",
  section: "pc-of-amount",
  label: "Find a percentage of an amount without a calculator",
  kinds: ["mcq", "qa"],
  make(r) {
    const type = r.pick(["tens", "fives", "fives", "ones", "ones", "halves"] as const);
    let p: number;
    let step: number;
    if (type === "tens") {
      p = r.pick([20, 30, 40, 60, 70, 80, 90]);
      step = 10;
    } else if (type === "fives") {
      p = r.pick([5, 15, 25, 35, 45, 55, 65, 75, 85, 95]);
      step = 20;
    } else if (type === "ones") {
      p = r.pick([1, 2, 3, 4, 6, 7, 8, 9]) + 10 * r.int(0, 7);
      step = 10;
    } else {
      p = r.pick([2.5, 7.5, 12.5, 17.5, 22.5, 37.5, 62.5, 87.5]);
      step = p % 12.5 === 0 && r.chance(0.5) ? 8 : 40;
    }
    let A = multiple(r, step, 40, 900);
    while (A === 100 || A === 200) A = multiple(r, step, 40, 900);
    const isMoney = r.chance(0.7);
    const cur: Cur = r.chance(0.7) ? "£" : "$";
    const f = (x: number) => (isMoney ? cash(x, cur) : big(x));
    const ans = tidy((A * p) / 100);
    const { steps, pieces } = buildUp(p, A, f);
    const eighth = p % 12.5 === 0 && p % 25 !== 0;

    const wrong: (Wrong & { v: number })[] = [];
    const add = (v: number, feedback: string) => {
      v = tidy(v);
      if (v > 0 && (!isMoney || pennies(v))) wrong.push({ v, display: f(v), spec: numSpec(v), feedback });
    };
    // missing the last building block
    if (pieces.length > 1) {
      const last = pieces[pieces.length - 1];
      add(ans - last.val, `${f(ans - last.val)} is only ${pct(p - last.pc)} of ${f(A)}. You've left out the ${pct(last.pc)}, which is another ${f(last.val)}.`);
    }
    // the other slips, in a different order each time so mocks show different ones
    const others: (() => void)[] = [
      // the amount left after a decrease
      () => add(A - ans, `${f(A - ans)} is ${f(A)} − ${f(ans)}, what's left after ${an(p)} ${pct(p)} decrease. The question just asks for ${pct(p)} of ${f(A)}.`),
      // mixing up 10% and 1%
      () =>
        p < 10 && Number.isInteger(p)
          ? add(10 * ans, `${f(10 * ans)} is ${pct(10 * p)} of ${f(A)}: you used ${f(A / 10)} for 1%, but that's 10%. 1% is ${f(A)} ÷ 100 = ${f(A / 100)}.`)
          : add(ans / 10, `${f(ans / 10)} is only ${pct(p / 10)} of ${f(A)}. Dividing by 100 gives 1%, not 10%: 10% of ${f(A)} is ${f(A)} ÷ 10 = ${f(A / 10)}.`),
    ];
    // 5% taken as a fifth
    if (pieces.some((x) => x.pc === 5)) {
      others.push(() => add(ans - A / 20 + A / 5, `This uses 5% = ${f(A / 5)}, but ${f(A / 5)} is a fifth of ${f(A)}, which is 20%. 5% is half of 10%: ${f(A / 20)}.`));
    }
    // dividing by the percentage
    if (Number.isInteger(p) && p > 1 && pennies(A / p)) {
      others.push(() => add(A / p, `${f(A / p)} is ${f(A)} ÷ ${p}. Finding ${pct(p)} means finding ${p} hundredths of ${f(A)}, not dividing by ${p}.`));
    }
    for (const o of r.shuffle(others)) o();
    // forgetting to divide by 100
    add(A * p, `${f(A * p)} is ${big(A)} × ${num(p)} — you forgot to divide by 100. ${pct(p)} of ${f(A)} is ${big(A)} × ${num(p)} ÷ 100 = ${f(ans)}.`);

    const shortcut = eighth ? ` Or use ${pct(12.5)} = {{1/8}}: ${num(A)} ÷ 8 = ${num(A / 8)}${p === 12.5 ? "" : `, and ${num(p / 12.5)} × ${num(A / 8)} = ${num(ans)}`}.` : "";
    const blocks = type === "halves" ? "10%, 5% and 2.5%" : type === "ones" ? "10%, 5% and 1%" : "10% and 5%";
    const sum = pieces.length > 1 ? `${pieces.map((x) => f(x.val)).join(" + ")} = ${f(ans)}` : f(ans);
    const split = pieces.length > 1 ? `${pct(p)} = ${splitText(p)}, so ` : "";
    return {
      difficulty: type === "tens" ? "warmup" : type === "fives" ? (r.chance(0.5) ? "warmup" : "core") : "core",
      question: `Without a calculator, find ${pct(p)} of ${f(A)}.`,
      prompt: isMoney ? `Give your answer in ${cur}.` : undefined,
      answer: numSpec(ans, isMoney ? f(ans) : undefined),
      display: f(ans),
      correctFeedback: `${split}${pct(p)} of ${f(A)} = ${sum}.`,
      wrong: distinct(wrong, ans),
      explanation: `Build ${pct(p)} from easy pieces${pieces.length > 1 ? `: ${pct(p)} = ${splitText(p)}` : ""}. ${steps.join(" ")}${shortcut} Calculator check: ${num(p / 100)} × ${big(A)} = ${big(ans)} ✓.`,
      solution: [
        ...(pieces.length > 1 ? [`Split ${pct(p)} into pieces you can find easily: ${pct(p)} = ${splitText(p)}.`] : []),
        ...steps.slice(0, pieces.length > 1 ? -1 : undefined),
        `So ${pct(p)} of ${f(A)} = ${pieces.length > 1 ? `${pieces.map((x) => f(x.val)).join(" + ")} = ` : ""}**${f(ans)}**.`,
      ],
      hints: [
        `Split ${pct(p)} into pieces you can find easily, using ${blocks}.`,
        type === "halves" ? "10% means ÷ 10. 5% is half of 10%, and 2.5% is half of 5%." : "10% means ÷ 10 and 1% means ÷ 100. 5% is half of 10%.",
      ],
      verify: `${num(p)}/100*${A}`,
      commonError: "Leaving out one of the building blocks, or dividing by 100 when you want 10% (that gives 1%).",
      strategy: "Use a bar model",
      marks: type === "tens" ? 1 : 2,
      sig: `${num(p)}%of${A}`,
    };
  },
};

// ---------------------------------------------------------------------------
// pc-as-percent — one number as a percentage of another
// ---------------------------------------------------------------------------

interface AsPctCtx {
  wholes: number[];
  money?: boolean;
  /** Hours, for the "minutes of a session" context (the whole is then 60 × hours). */
  hours?: boolean;
  q: (a: string, b: string, n: string, extra: string) => string;
  /** Feedback for 100% − answer: what the rest stands for. */
  rest?: (n: string) => string;
}

const AS_PCT_CTX: AsPctCtx[] = [
  {
    wholes: [20, 24, 25, 30, 32, 40, 48, 50, 60, 64, 75, 80, 120],
    q: (a, b, n, subject) => `${n} scored ${a} out of ${b} in a ${subject} test. What percentage did ${n} score?`,
    rest: (n) => `the percentage of the marks ${n} *lost*`,
  },
  {
    wholes: [20, 24, 25, 30, 32, 40],
    q: (a, b) => `In a class of ${b} students, ${a} walk to school. What percentage of the class walk to school?`,
    rest: () => "the percentage who *don't* walk",
  },
  {
    wholes: [40, 60, 80, 120, 150, 200, 250, 300, 400, 500],
    money: true,
    q: (a, b, n) => `${n} has saved ${a} towards a bike that costs ${b}. What percentage of the price has ${n} saved?`,
    rest: () => "the percentage still left to save",
  },
  {
    wholes: [8, 12, 16, 20, 24, 25, 30, 40, 48, 50, 60, 64, 75, 80, 120, 150, 200, 250, 300, 400],
    q: (a, b) => `Write ${a} as a percentage of ${b}.`,
  },
  {
    wholes: [1, 2],
    hours: true,
    q: (a, b, n, hrs) => `${n}'s maths revision session lasts ${hrs}. ${n} spends ${a} minutes of it on percentages. What percentage of the session is that?`,
  },
];

const pcAsPercent: Generator = {
  id: "pc-as-percent",
  topic: "pc",
  section: "pc-of-amount",
  label: "Write one number as a percentage of another",
  kinds: ["mcq", "qa"],
  make(r) {
    const c = r.pick(AS_PCT_CTX);
    const h = c.hours ? r.pick(c.wholes) : 0;
    const b = c.hours ? 60 * h : r.pick(c.wholes);
    // a part whose percentage has at most one decimal place (1000a/b is whole)
    const parts: number[] = [];
    for (let a = 1; a < b; a++) if ((1000 * a) % b === 0 && a * 2 !== b) parts.push(a);
    const a = r.pick(parts);
    const q = tidy((100 * a) / b);
    const cur: Cur = r.chance(0.7) ? "£" : "$";
    const f = (x: number) => (c.money ? cash(x, cur) : big(x));
    const name = r.pick(NAMES);
    const hrs = `${h} hour${h > 1 ? "s" : ""}`;
    const extra = c.hours ? hrs : r.pick(["spelling", "science", "maths", "French", "history"]);
    const [sa, sb] = reduce(a, b);
    const dec = tidy(a / b);
    const frac = raw(a, b);
    const simp = sb !== b ? ` = ${fr(a, b)}` : "";
    const whole = c.hours ? `${b} minutes` : f(b);

    const wrong: (Wrong & { v: number })[] = [];
    const add = (v: number, feedback: string, tolerance?: number) => {
      v = tidy(v);
      if (v > 0) wrong.push({ v, display: pct(v), spec: numSpec(v, undefined, tolerance ? { tolerance } : {}), feedback });
    };
    const flipExact = tidy((100 * b) / a);
    const flip = Math.round(flipExact * 10) / 10;
    add(flip, `${pct(flip)} comes from ${raw(b, a)} — the fraction is upside down. It's part ÷ whole, so ${a} goes on top: ${frac} × 100 = ${pct(q)}.`, flip === flipExact ? undefined : 0.07);
    const others: (() => void)[] = [
      () => add(q / 100, `${num(dec)} is ${frac} as a decimal. To make it a percentage, multiply by 100: ${num(dec)} × 100 = ${pct(q)}.`),
    ];
    if (c.rest) {
      const rest = c.rest(name);
      others.push(() => add(100 - q, `${pct(100 - q)} is ${rest} (${f(b - a)} out of ${f(b)}). The question asks about the ${f(a)}.`));
    }
    if (c.hours) {
      others.push(() => add(a / h, `This treats ${hrs} as ${100 * h} minutes. There are 60 minutes in an hour, so ${hrs} = ${b} minutes, and ${frac} × 100 = ${pct(q)}.`));
      if (h > 1) others.push(() => add((100 * a) / h, `This divides ${a} minutes by ${h} hours — mixing minutes with hours. Change both into minutes first: ${frac} × 100 = ${pct(q)}.`));
    } else {
      others.push(() => add(a, `${f(a)} is the ${c.money ? "amount saved" : "part"}, not a percentage. Compare it with the whole, ${f(b)}, first: ${frac} × 100 = ${pct(q)}.`));
    }
    for (const o of r.shuffle(others)) o();

    const unitStep = c.hours ? `First make the units match: ${hrs} = ${b} minutes. ` : "";
    return {
      difficulty: c.hours ? "core" : b <= 50 && Number.isInteger(q) ? "warmup" : "core",
      question: c.q(c.money ? f(a) : String(a), c.money ? f(b) : String(b), name, extra),
      prompt: "Give your answer as a percentage.",
      answer: numSpec(q, pct(q)),
      display: pct(q),
      correctFeedback: `${frac}${simp} = ${num(dec)}, and ${num(dec)} × 100 = ${pct(q)}.`,
      wrong: distinct(wrong, q),
      explanation: `One number as a percentage of another = part ÷ whole × 100. ${unitStep}As a fraction of the whole, it's ${frac}${simp}. As a decimal that's ${num(dec)}, and ${num(dec)} × 100 = ${pct(q)}. Check: ${pct(q)} of ${whole} is ${c.money ? f(a) : c.hours ? `${a} minutes` : a} ✓.`,
      solution: [
        ...(c.hours ? [`Make the units match: ${hrs} = ${b} minutes.`] : []),
        `Write the part as a fraction of the whole: ${frac}${simp}.`,
        `${sa} ÷ ${sb} = ${num(dec)}, and ${num(dec)} × 100 = **${pct(q)}**.`,
        `Check: ${pct(q)} of ${whole} = ${c.money ? f(a) : c.hours ? `${a} minutes` : a} ✓`,
      ],
      hints: [
        c.hours ? "Change the hours into minutes first, so both amounts are in the same units." : "Write the part as a fraction of the whole: part over whole.",
        "Simplify the fraction, then change it into a percentage (× 100).",
      ],
      verify: c.hours ? `${a}/(${h}*60)*100` : `${a}/${b}*100`,
      commonError: c.hours ? "Comparing minutes with hours — change both into minutes first." : `Putting the fraction upside down (${raw(b, a)}), or leaving the answer as the decimal ${num(dec)}.`,
      strategy: "Spot the common factor",
      marks: 2,
      sig: `${a}/${b}`,
    };
  },
};

// ---------------------------------------------------------------------------
// pc-change — increase or decrease an amount by a percentage
// ---------------------------------------------------------------------------

type Mode = "up" | "down" | "over";

interface ChangeCtx {
  lo: number;
  hi: number;
  /** "money", "cm" or a plain number */
  unit: "money" | "cm" | "plain";
  /** Extra divisibility for a realistic amount, e.g. car prices in 500s. */
  round?: number;
  ok?: (p: number) => boolean;
  q: (f: (x: number) => string, A: number, p: number, name: string) => string;
}

const CHANGE_CTX: Record<Mode, ChangeCtx[]> = {
  up: [
    { lo: 20, hi: 900, unit: "money", q: (f, A, p) => `Increase ${f(A)} by ${pct(p)}.` },
    { lo: 20, hi: 900, unit: "plain", q: (f, A, p) => `Increase ${f(A)} by ${pct(p)}.` },
    { lo: 100, hi: 900, unit: "money", q: (f, A, p) => `A school trip cost ${f(A)} last year. This year the price has gone up by ${pct(p)}. What does the trip cost now?` },
    { lo: 1000, hi: 3000, unit: "money", round: 50, ok: (p) => p <= 10, q: (f, A, p, n) => `${n} earns ${f(A)} a month and gets ${an(p)} ${pct(p)} pay rise. How much does ${n} earn each month now?` },
    { lo: 60, hi: 900, unit: "money", ok: (p) => p >= 5 && p <= 20, q: (f, A, p) => `A bike costs ${f(A)} before tax. A sales tax of ${pct(p)} is then added on. What is the total price?` },
  ],
  down: [
    { lo: 20, hi: 900, unit: "money", q: (f, A, p) => `Decrease ${f(A)} by ${pct(p)}.` },
    { lo: 20, hi: 900, unit: "plain", q: (f, A, p) => `Decrease ${f(A)} by ${pct(p)}.` },
    { lo: 20, hi: 400, unit: "money", q: (f, A, p) => `A coat costs ${f(A)}. In a sale, its price is reduced by ${pct(p)}. What is the sale price?` },
    { lo: 4000, hi: 20000, unit: "money", round: 500, ok: (p) => p <= 40, q: (f, A, p) => `A new car is bought for ${f(A)}. A year later it is worth ${pct(p)} less. How much is the car worth now?` },
  ],
  over: [
    { lo: 10, hi: 200, unit: "plain", q: (f, A, p) => `Increase ${f(A)} by ${pct(p)}.` },
    { lo: 4, hi: 60, unit: "cm", q: (f, A, p) => `A sunflower seedling is ${f(A)} tall. By the end of the summer, its height has increased by ${pct(p)}. How tall is it now?` },
    { lo: 10, hi: 200, unit: "money", q: (f, A, p) => `A rare trading card was bought for ${f(A)}. Its value has since increased by ${pct(p)}. What is it worth now?` },
  ],
};

const pcChange: Generator = {
  id: "pc-change",
  topic: "pc",
  section: "pc-change",
  label: "Increase or decrease an amount by a percentage",
  kinds: ["mcq", "qa"],
  make(r) {
    const mode = r.pick(["up", "up", "down", "down", "over"] as const);
    const p =
      mode === "over"
        ? r.pick([110, 120, 125, 150, 150, 175, 200, 250, 300, 350, 400])
        : mode === "up"
          ? r.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75])
          : r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80]);
    const ctxs = CHANGE_CTX[mode].filter((c) => !c.ok || c.ok(p));
    const c = r.pick(ctxs);
    const cur: Cur = r.chance(0.7) ? "£" : "$";
    const f = (x: number) => (c.unit === "money" ? cash(x, cur) : c.unit === "cm" ? `${num(x)} cm` : big(x));
    // whole-number answers, and round amounts like the class worksheets (70, 4100, £800) — seedling heights can be any whole cm
    const step = lcm2(wholeStep(p), c.round ?? (c.unit === "cm" ? 1 : 10));
    // a decrease must leave something even after a "took off p" slip, so keep A above p
    const lo = mode === "down" ? Math.max(c.lo, p + 1) : c.lo;
    let A = multiple(r, step, lo, Math.max(c.hi, lo));
    for (let k = 0; A === 100 && k < 10; k++) A = multiple(r, step, lo, Math.max(c.hi, lo));
    const up = mode !== "down";
    const X = tidy((A * p) / 100);
    const mult = tidy(up ? 1 + p / 100 : 1 - p / 100);
    const ans = tidy(up ? A + X : A - X);
    const name = r.pick(NAMES);
    const { steps, pieces } = buildUp(p, A, f);
    const isMoney = c.unit === "money";
    const unitWord = isMoney ? cash(p, cur) : c.unit === "cm" ? `${p} cm` : String(p);

    const wrong: (Wrong & { v: number })[] = [];
    const add = (v: number, feedback: string) => {
      v = tidy(v);
      if (v > 0 && (!isMoney || pennies(v))) wrong.push({ v, display: f(v), spec: numSpec(v), feedback });
    };
    add(
      X,
      up
        ? `${f(X)} is ${pct(p)} of ${f(A)} — that's the increase on its own. Add it on to the original: ${f(A)} + ${f(X)} = ${f(ans)}.`
        : `${f(X)} is ${pct(p)} of ${f(A)} — the amount taken off. The new amount is ${f(A)} − ${f(X)} = ${f(ans)}.`,
    );
    // the other slips, in a different order each time so mocks show different ones
    const others: (() => void)[] = [
      () =>
        add(
          up ? A + p : A - p,
          `You ${up ? "added" : "took off"} ${unitWord}, not ${pct(p)}. ${pct(p)} of ${f(A)} is ${f(X)}, so the answer is ${f(A)} ${up ? "+" : "−"} ${f(X)} = ${f(ans)}.`,
        ),
    ];
    if (mode === "up") others.push(() => add(A - X, `${f(A - X)} is ${f(A)} *decreased* by ${pct(p)}. An increase means you add the ${f(X)} on.`));
    if (mode === "down") others.push(() => add(A + X, `${f(A + X)} is ${f(A)} *increased* by ${pct(p)}. A decrease means you take the ${f(X)} away.`));
    if (mode !== "over" && pieces.length > 1) {
      const last = pieces[pieces.length - 1];
      const part = tidy(X - last.val);
      others.push(() =>
        add(
          up ? A + part : A - part,
          `This ${up ? "adds on" : "takes off"} only ${pct(p - last.pc)} (${f(part)}). You've left out the ${pct(last.pc)}, which is another ${f(last.val)}: ${pct(p)} of ${f(A)} is ${f(X)}.`,
        ),
      );
    }
    for (const o of r.shuffle(others)) o();
    if (mode === "over") {
      const wm = tidy(1 + p / 1000);
      add(A * wm, `This multiplies by ${num(wm)}, which is only ${an(p / 10)} ${pct(p / 10)} increase. ${pct(p)} = ${num(p / 100)}, so the multiplier is 1 + ${num(p / 100)} = ${num(mult)}, and ${big(A)} × ${num(mult)} = ${big(ans)}.`);
    } else if (p < 10) {
      const wm = tidy(up ? 1 + p / 10 : 1 - p / 10);
      add(A * wm, `This multiplies by ${num(wm)}, which is ${an(10 * p)} ${pct(10 * p)} ${up ? "increase" : "decrease"}. ${pct(p)} = ${num(p / 100)}, not ${num(p / 10)}, so the multiplier is ${num(mult)}: ${big(A)} × ${num(mult)} = ${big(ans)}.`);
    }

    const how = up ? `100% + ${pct(p)} = ${pct(100 + p)}` : `100% − ${pct(p)} leaves ${pct(100 - p)}`;
    const over = mode === "over" ? " An increase of more than 100% means the amount more than doubles." : "";
    return {
      difficulty: mode === "over" ? ([150, 200, 300].includes(p) ? "core" : "challenge") : p % 10 === 0 && A <= 200 ? "warmup" : "core",
      question: c.q(f, A, p, name),
      prompt: isMoney ? `Give your answer in ${cur}.` : c.unit === "cm" ? "Give your answer in cm." : undefined,
      answer: numSpec(ans, c.unit === "plain" ? undefined : f(ans)),
      display: f(ans),
      correctFeedback: `${pct(p)} of ${f(A)} is ${f(X)}, and ${f(A)} ${up ? "+" : "−"} ${f(X)} = ${f(ans)}.`,
      wrong: distinct(wrong, ans),
      explanation: `First find ${pct(p)} of ${f(A)}. ${steps.join(" ")} ${up ? "It's an increase, so add it on" : "It's a decrease, so take it off"}: ${f(A)} ${up ? "+" : "−"} ${f(X)} = ${f(ans)}. Multiplier check: ${how}, so multiply by ${num(mult)}: ${big(A)} × ${num(mult)} = ${big(ans)} ✓.${over}`,
      solution: [`Find ${pct(p)} of ${f(A)}.`, ...steps, `${up ? "Increase" : "Decrease"}: ${f(A)} ${up ? "+" : "−"} ${f(X)} = **${f(ans)}**.`, `Check with a multiplier: ${how} = ${num(mult)}, and ${big(A)} × ${num(mult)} = ${big(ans)} ✓`],
      hints:
        mode === "over"
          ? [`${pct(p)} = ${splitText(p)}. What is ${pct(p)} of ${f(A)}?`, `That's the increase. Add it to the original amount — or multiply by 100% + ${pct(p)} = ${pct(100 + p)}.`]
          : [`Find ${pct(p)} of ${f(A)} first${splitText(p).includes("+") ? ` (${pct(p)} = ${splitText(p)})` : ""}.`, up ? "It's an increase, so add it on. Or multiply by 100% + the increase, as a decimal." : "It's a decrease, so take it off. Or multiply by the percentage that's left, as a decimal."],
      verify: `${A}*(1${up ? "+" : "-"}${p}/100)`,
      commonError:
        mode === "over"
          ? `Finding ${pct(p)} of ${f(A)} (${f(X)}) and forgetting to add it on to the original amount.`
          : `Stopping after finding ${pct(p)} (${f(X)}) instead of ${up ? "adding it on" : "taking it off"}.`,
      strategy: "Use the multiplier",
      marks: mode !== "over" && p % 10 === 0 && A <= 200 ? 1 : 2,
      sig: `${A}${up ? "+" : "-"}${p}%`,
    };
  },
};

// ---------------------------------------------------------------------------
// pc-percent-change — the percentage change from one amount to another
// ---------------------------------------------------------------------------

interface PctChangeCtx {
  lo: number;
  hi: number;
  unit: "money" | "kg" | "cm" | "plain";
  round?: number;
  ok?: (q: number) => boolean;
  /** What changes, for feedback: "price", "value", "weight" … */
  what: string;
  /** Profit/loss wording: the word for the change, and what the new amount is called. */
  pl?: { word: "profit" | "loss"; did: string };
  q: (f: (x: number) => string, A: number, B: number, name: string) => string;
}

const PCT_CHANGE_CTX: Record<Mode, PctChangeCtx[]> = {
  up: [
    { lo: 20, hi: 200, unit: "money", round: 10, what: "price", q: (f, A, B) => `A pair of trainers went up in price from ${f(A)} to ${f(B)}. What is the percentage increase?` },
    { lo: 100, hi: 500, unit: "money", round: 10, what: "price", q: (f, A, B) => `Last year it cost ${f(A)} to join a gym. This year it costs ${f(B)}. What is the percentage increase in the price?` },
    { lo: 20, hi: 400, unit: "money", round: 10, what: "money", pl: { word: "profit", did: "made" }, q: (f, A, B, n) => `${n} buys a second-hand bike for ${f(A)}, fixes it up and sells it for ${f(B)}. What is ${n}'s percentage profit?` },
    { lo: 20, hi: 400, unit: "plain", round: 10, what: "number of members", q: (f, A, B) => `A chess club had ${f(A)} members last year. This year it has ${f(B)} members. What is the percentage increase in the number of members?` },
  ],
  down: [
    { lo: 20, hi: 400, unit: "money", round: 10, what: "price", q: (f, A, B) => `In a sale, the price of a jacket falls from ${f(A)} to ${f(B)}. What is the percentage decrease?` },
    { lo: 4000, hi: 20000, unit: "money", round: 1000, ok: (q) => [10, 15, 20, 25, 30, 40].includes(q), what: "value", q: (f, A, B) => `A car was bought for ${f(A)}. A year later it was worth ${f(B)}. What is the percentage decrease in its value?` },
    { lo: 40, hi: 400, unit: "money", round: 10, what: "money", pl: { word: "loss", did: "lost" }, q: (f, A, B, n) => `${n} buys a bike for ${f(A)} and later sells it for ${f(B)}. What is ${n}'s percentage loss?` },
    { lo: 200, hi: 1200, unit: "plain", round: 10, ok: (q) => q <= 40, what: "number of students", q: (f, A, B) => `A school had ${f(A)} students last year and ${f(B)} students this year. What is the percentage decrease in the number of students?` },
  ],
  over: [
    { lo: 2, hi: 12, unit: "kg", what: "weight", q: (f, A, B) => `A puppy weighed ${f(A)} when it was born. It now weighs ${f(B)}. What is the percentage increase in its weight?` },
    { lo: 2, hi: 60, unit: "money", what: "value", q: (f, A, B) => `A trading card was bought for ${f(A)}. It is now worth ${f(B)}. What is the percentage increase in its value?` },
    { lo: 10, hi: 60, unit: "cm", what: "height", q: (f, A, B) => `A sunflower was ${f(A)} tall in May and ${f(B)} tall in August. What is the percentage increase in its height?` },
  ],
};

const pcPercentChange: Generator = {
  id: "pc-percent-change",
  topic: "pc",
  section: "pc-percent-change",
  label: "Work out the percentage change from one amount to another",
  kinds: ["mcq", "qa"],
  make(r) {
    const mode = r.pick(["up", "up", "down", "down", "over"] as const);
    const q = mode === "over" ? r.pick([120, 150, 200, 250, 300, 400, 500, 900]) : r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
    const c = r.pick(PCT_CHANGE_CTX[mode].filter((x) => !x.ok || x.ok(q)));
    const cur: Cur = r.chance(0.7) ? "£" : "$";
    const f = (x: number) => (c.unit === "money" ? cash(x, cur) : c.unit === "plain" ? big(x) : `${num(x)} ${c.unit}`);
    const step = lcm2(wholeStep(q), c.round ?? 1);
    let A = multiple(r, step, c.lo, c.hi);
    for (let k = 0; A === 100 && k < 10; k++) A = multiple(r, step, c.lo, c.hi);
    const up = mode !== "down";
    const D = tidy((A * q) / 100); // the change
    const B = tidy(up ? A + D : A - D);
    const name = r.pick(NAMES);
    const word = c.pl ? c.pl.word : up ? "increase" : "decrease";
    const newWord = c.pl ? "selling price" : `new ${c.what}`;
    const origWord = c.pl ? "the price paid" : "the **original** amount";
    const dec = tidy(D / A);
    const frac = m(`${num(D)}/${num(A)}`);

    const wrong: (Wrong & { v: number })[] = [];
    const add = (v: number, feedback: string, tolerance?: number) => {
      v = tidy(v);
      if (v > 0) wrong.push({ v, display: pct(v), spec: numSpec(v, undefined, tolerance ? { tolerance } : {}), feedback });
    };
    // the classic slip: dividing by the new amount
    const byNew = tidy((D / B) * 100);
    const byNew1 = Math.round(byNew * 10) / 10;
    add(
      byNew1,
      `${pct(byNew1)} comes from ${m(`${num(D)}/${num(B)}`)} — dividing by the ${newWord}. Percentage ${c.pl ? c.pl.word : "change"} always divides by ${origWord}, ${f(A)}: ${frac} × 100 = ${pct(q)}.`,
      byNew1 === byNew ? undefined : 0.07,
    );
    const others: (() => void)[] = [
      () =>
        up
          ? add(100 + q, `${pct(100 + q)} is ${f(B)} as a percentage of ${f(A)} — the new amount compared with the old one. The *${word}* is ${pct(100 + q)} − 100% = ${pct(q)}.`)
          : add(100 - q, `${pct(100 - q)} is ${f(B)} as a percentage of ${f(A)} — the part that's left. The *${word}* is 100% − ${pct(100 - q)} = ${pct(q)}.`),
      () => add(q / 100, `${frac} = ${num(dec)} is right so far, but it's a decimal. Multiply by 100 to make it a percentage: ${num(dec)} × 100 = ${pct(q)}.`),
    ];
    if (D <= 200) {
      const moved = c.pl ? `${name} ${c.pl.did} ${f(D)}` : `The ${c.what} went ${up ? "up" : "down"} by ${f(D)}`;
      others.push(() =>
        add(D, `${moved}, but that isn't ${pct(D)}. Compare the ${f(D)} with ${c.pl ? "the price paid," : "the original"} ${f(A)}: ${frac} × 100 = ${pct(q)}.`),
      );
    }
    if (mode === "over") {
      const k = tidy(B / A);
      others.push(() => add(k, `${f(B)} is ${num(k)} times ${f(A)}, but "${num(k)} times" isn't ${pct(k)}. Percentage increase = increase ÷ original × 100 = ${frac} × 100 = ${pct(q)}.`));
    }
    for (const o of r.shuffle(others)) o();

    const sense =
      mode === "over"
        ? ` Sense check: a 100% increase would only double ${f(A)} to ${f(2 * A)}, so an increase to ${f(B)} must be more than 100%.`
        : "";
    return {
      difficulty: mode === "over" ? "challenge" : [10, 20, 25, 50].includes(q) && A <= 100 ? "warmup" : "core",
      question: c.q(f, A, B, name),
      prompt: "Give your answer as a percentage.",
      answer: numSpec(q, pct(q)),
      display: pct(q),
      correctFeedback: `The ${word} is ${f(D)} on ${c.pl ? "a price paid of" : "an original"} ${f(A)}: ${frac} × 100 = ${pct(q)}.`,
      wrong: distinct(wrong, q),
      explanation: `Percentage ${c.pl ? `${word} = ${word} ÷ price paid` : "change = change ÷ original"} × 100. The ${word} is ${up ? `${f(B)} − ${f(A)}` : `${f(A)} − ${f(B)}`} = ${f(D)}, and the ${c.pl ? "price paid" : "original amount"} is ${f(A)}. So the percentage ${word} is ${frac} × 100 = ${num(dec)} × 100 = ${pct(q)}. Check: ${pct(q)} of ${f(A)} is ${f(D)}, and ${f(A)} ${up ? "+" : "−"} ${f(D)} = ${f(B)} ✓.${sense}`,
      solution: [
        `${cap(word)} = ${up ? `${f(B)} − ${f(A)}` : `${f(A)} − ${f(B)}`} = ${f(D)}.`,
        `Divide by ${origWord}, ${f(A)}: ${frac} = ${num(dec)}.`,
        `Multiply by 100: ${num(dec)} × 100 = **${pct(q)}**.`,
        `Check: ${pct(q)} of ${f(A)} is ${f(D)}, and ${f(A)} ${up ? "+" : "−"} ${f(D)} = ${f(B)} ✓`,
      ],
      hints: [
        `Work out the ${word} first.`,
        c.pl ? `Percentage ${word} = ${word} ÷ what ${name} PAID × 100.` : "Percentage change = change ÷ ORIGINAL × 100. Which amount is the original one?",
      ],
      verify: up ? `(${B}-${A})/${A}*100` : `(${A}-${B})/${A}*100`,
      commonError: `Dividing by the ${c.pl ? "selling price" : "new amount"} (${f(B)}) instead of ${c.pl ? "the price paid" : "the original amount"} (${f(A)}).`,
      marks: 2,
      sig: `${A}>${B}`,
    };
  },
};

// ---------------------------------------------------------------------------
// pc-multiplier — decimal multipliers, and two changes one after another
// ---------------------------------------------------------------------------

/** The multiplier for a change: +20% → 1.2, −30% → 0.7. */
const multOf = (up: boolean, p: number) => tidy(up ? 1 + p / 100 : 1 - p / 100);

/** Why: "100% + 20% = 120% = 1.2" or "100% − 30% = 70% = 0.7". */
const multWhy = (up: boolean, p: number) => `100% ${up ? "+" : "−"} ${pct(p)} = ${pct(up ? 100 + p : 100 - p)} = ${num(multOf(up, p))}`;

/** "+20%" / "−10%" for text. */
const signed = (up: boolean, p: number) => `${up ? "+" : "−"}${pct(p)}`;

/** A signed percentage for text: 10 → "+10%", −12 → "−12%", 0 → "0%". */
const net = (x: number) => (x === 0 ? "0%" : `${x > 0 ? "+" : "−"}${pct(Math.abs(x))}`);

/** One change as a multiplier, for the written single-multiplier question. */
function singleMultiplier(r: Rng) {
  const up = r.chance(0.5);
  const p = up ? r.pick([2, 3, 4, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 150, 200, 250]) : r.pick([1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 70, 75, 80, 85, 90]);
  const M = multOf(up, p);
  const word = up ? "increase" : "decrease";
  const wrong: (Wrong & { v: number })[] = [];
  const add = (v: number, feedback: string) => {
    v = tidy(v);
    if (v > 0) wrong.push({ v, display: num(v), spec: numSpec(v, undefined, { allowFraction: false }), feedback });
  };
  add(p / 100, `× ${num(p / 100)} finds ${pct(p)} of the amount — the ${word} itself, not the new amount. The new amount is ${pct(up ? 100 + p : 100 - p)} of the old one, so the multiplier is ${num(M)}.`);
  const others: (() => void)[] = [
    () => add(multOf(!up, p), `× ${num(multOf(!up, p))} is the multiplier for ${up ? "a decrease" : "an increase"} of ${pct(p)}. ${up ? "An increase needs a multiplier bigger than 1" : "A decrease needs a multiplier less than 1"}: ${multWhy(up, p)}.`),
    () => add(up ? 100 + p : 100 - p, `${num(up ? 100 + p : 100 - p)} is the percentage, ${pct(up ? 100 + p : 100 - p)}, not a decimal. Divide by 100: ${pct(up ? 100 + p : 100 - p)} = ${num(M)}.`),
  ];
  if (p < 10) {
    const v = tidy(up ? 1 + p / 10 : 1 - p / 10);
    others.push(() => add(v, `× ${num(v)} is the multiplier for ${up ? "an increase" : "a decrease"} of ${pct(10 * p)}. ${pct(p)} = ${num(p / 100)}, not ${num(p / 10)}, so the multiplier is ${num(M)}.`));
  } else if (p >= 100) {
    const v = tidy(1 + p / 1000);
    others.push(() => add(v, `× ${num(v)} is only ${an(p / 10)} ${pct(p / 10)} increase. ${pct(p)} = ${num(p / 100)}, so the multiplier is 1 + ${num(p / 100)} = ${num(M)}.`));
  }
  for (const o of r.shuffle(others)) o();
  return {
    difficulty: (p >= 100 || p < 10 ? "core" : "warmup") as Difficulty,
    question: `What decimal multiplier ${up ? "increases" : "decreases"} an amount by ${pct(p)} in one step?`,
    answer: numSpec(M, undefined, { allowFraction: false }),
    display: num(M),
    correctFeedback: `${multWhy(up, p)}, so multiply by ${num(M)}.`,
    wrong: distinct(wrong, M),
    explanation: `The original amount is 100%, which is 1 as a decimal. After ${up ? "an increase" : "a decrease"} of ${pct(p)} you ${up ? "have" : "are left with"} ${multWhy(up, p)}, so you multiply by ${num(M)}. Example: ${up ? "increasing" : "decreasing"} £200 by ${pct(p)} gives 200 × ${num(M)} = £${num(200 * M)}, the same as 200 ${up ? "+" : "−"} ${num(2 * p)} (${pct(p)} of £200 is £${num(2 * p)}) ✓. ${up ? "An increase always has a multiplier bigger than 1." : "A decrease always has a multiplier between 0 and 1."}`,
    solution: [
      "The original amount is 100%, which is 1 as a decimal.",
      `${cap(word)} by ${pct(p)}: ${multWhy(up, p)}.`,
      `So the multiplier is **${num(M)}**.`,
    ],
    hints: [`Start from 100%. After ${up ? "an increase" : "a decrease"} of ${pct(p)}, what percentage of the amount do you have?`, "Write that percentage as a decimal by dividing by 100."],
    verify: `1${up ? "+" : "-"}${p}/100`,
    commonError: up ? `Using ${num(p / 100)} (just the ${pct(p)}) instead of 1 + ${num(p / 100)}.` : `Using ${num(p / 100)} (the part taken off) instead of ${num(M)} (the part that is left).`,
    strategy: "Use the multiplier",
    marks: 1,
    sig: `x${up ? "+" : "-"}${p}`,
  };
}

/** Two changes one after another: the final amount. */
function successiveAmount(r: Rng) {
  const kind = r.pick(["updown", "downup", "repeat", "growth"] as const);
  let up1 = true, up2 = false, p1 = 10, p2 = 10;
  if (kind === "updown") [up1, up2, p1, p2] = [true, false, r.pick([10, 20, 25, 30, 40, 50]), r.pick([10, 20, 25, 30, 40, 50])];
  else if (kind === "downup") [up1, up2, p1, p2] = [false, true, r.pick([5, 10, 15, 20, 25, 30]), r.pick([5, 10, 15, 20, 25])];
  else if (kind === "repeat") { up1 = up2 = false; p1 = p2 = r.pick([10, 20, 25, 30, 40]); }
  else [up1, up2, p1, p2] = [true, true, r.pick([2, 3, 4, 5, 10]), r.pick([2, 3, 4, 5, 10])];
  const m1 = multOf(up1, p1), m2 = multOf(up2, p2);
  const cur: Cur = r.chance(0.7) ? "£" : "$";
  const f = (x: number) => cash(x, cur);
  const [lo, hi, step] = kind === "downup" ? [4000, 20000, 1000] : kind === "growth" ? [200, 3000, 100] : [40, 900, 20];
  let A = multiple(r, step, lo, hi);
  for (let k = 0; k < 20 && !(pennies(A * m1) && pennies(A * m1 * m2)); k++) A = multiple(r, step, lo, hi);
  const V1 = tidy(A * m1);
  const F = tidy(V1 * m2);
  const name = r.pick(NAMES);
  const item = r.pick(["bike", "games console", "guitar", "tent", "scooter"]);
  const thing = kind === "repeat" ? "value" : kind === "growth" ? "amount" : "price";
  const question =
    kind === "updown"
      ? `A ${item} costs ${f(A)}. The shop increases its price by ${pct(p1)}. A month later, the new price is reduced by ${pct(p2)}. What is the final price?`
      : kind === "downup"
        ? `${name} is buying a car advertised at ${f(A)}. ${name} gets a discount of ${pct(p1)}. Then ${pct(p2)} tax is added to the discounted price. What is the final price?`
        : kind === "repeat"
          ? `${name}'s new phone cost ${f(A)}. Its value falls by ${pct(p1)} every year. What is it worth after 2 years?`
          : `${name} puts ${f(A)} into a savings account. The money grows by ${pct(p1)} in the first year and by ${pct(p2)} in the second year. How much is in the account after 2 years?`;

  const wrong: (Wrong & { v: number })[] = [];
  const add = (v: number, feedback: string) => {
    v = tidy(v);
    if (v > 0 && pennies(v)) wrong.push({ v, display: f(v), spec: numSpec(v), feedback });
  };
  const sum = (up1 ? p1 : -p1) + (up2 ? p2 : -p2);
  add(
    A * (1 + sum / 100),
    kind === "repeat"
      ? `This takes off ${pct(p1)} + ${pct(p2)} = ${pct(p1 + p2)} in one go. But the second year's ${pct(p2)} is taken from the lower value, ${f(V1)}, not from ${f(A)}.`
      : `This adds the percentages: ${signed(up1, p1)} and ${signed(up2, p2)} make ${net(sum)}. But the second change is ${pct(p2)} of the *new* ${thing}, ${f(V1)}, not of ${f(A)} — so do one change at a time.`,
  );
  const others: (() => void)[] = [
    () => add(V1, `${f(V1)} is the ${thing} after the first change only. Now ${up2 ? "increase" : "decrease"} it by ${pct(p2)}: ${f(V1)} × ${num(m2)} = ${f(F)}.`),
    () => add(V1 * p2 / 100, `${f(V1 * p2 / 100)} is ${pct(p2)} of ${f(V1)} — the size of the second change on its own. ${up2 ? `Add it on to ${f(V1)}` : `Take it away from ${f(V1)}`}.`),
  ];
  if (kind !== "repeat") others.push(() => add(A * m2, `${f(A * m2)} ${up2 ? "increases" : "decreases"} ${f(A)} by ${pct(p2)} but leaves out the first change (${signed(up1, p1)}). Do both changes, one after the other.`));
  for (const o of r.shuffle(others)) o();

  return {
    difficulty: (kind === "repeat" || kind === "growth" ? "core" : "challenge") as Difficulty,
    question,
    prompt: `Give your answer in ${cur}.`,
    answer: numSpec(F, f(F)),
    display: f(F),
    correctFeedback: `${f(A)} × ${num(m1)} = ${f(V1)}, then ${f(V1)} × ${num(m2)} = ${f(F)}.`,
    wrong: distinct(wrong, F),
    explanation: `Do one change at a time. ${signed(up1, p1)} is × ${num(m1)} (${multWhy(up1, p1)}): ${f(A)} × ${num(m1)} = ${f(V1)}. ${signed(up2, p2)} is × ${num(m2)}, and now it's a percentage of ${f(V1)}: ${f(V1)} × ${num(m2)} = ${f(F)}. In one go: ${big(A)} × ${num(m1)} × ${num(m2)} = ${big(F)}. You can't just add the percentages, because the second change is a percentage of a different amount.`,
    solution: [
      `First change, ${signed(up1, p1)}: ${multWhy(up1, p1)}, so ${f(A)} × ${num(m1)} = ${f(V1)}.`,
      `Second change, ${signed(up2, p2)} of the new ${thing}: ${f(V1)} × ${num(m2)} = **${f(F)}**.`,
      `Check in one go: ${big(A)} × ${num(m1)} × ${num(m2)} = ${big(F)} ✓`,
    ],
    hints: [`Work out the ${thing} after the first change.`, `The second ${pct(p2)} is a percentage of which amount — ${f(A)} or the new ${thing}?`],
    verify: `${A}*(1${up1 ? "+" : "-"}${p1}/100)*(1${up2 ? "+" : "-"}${p2}/100)`,
    commonError: "Adding the percentages and doing one change — the second change is a percentage of the new amount, so multiply the multipliers.",
    strategy: "Use the multiplier",
    marks: 2,
    sig: `${A}${signed(up1, p1)}${signed(up2, p2)}`,
  };
}

/** Two changes one after another: the overall percentage change, or the single multiplier. */
function successiveOverall(r: Rng, asMultiplier: boolean) {
  let up1 = true, up2 = false, p1 = 10, p2 = 10, P = 1, overall = 0;
  for (let k = 0; k < 50; k++) {
    up1 = r.chance(0.5);
    up2 = r.chance(0.5);
    p1 = r.pick([10, 20, 25, 30, 40, 50]);
    p2 = r.pick([10, 20, 25, 30, 40, 50]);
    P = tidy(multOf(up1, p1) * multOf(up2, p2));
    overall = tidy((P - 1) * 100);
    if (Math.abs(overall) >= 1 && Number.isInteger(tidy(overall * 10)) && (up1 !== up2 || r.chance(0.3))) break;
  }
  const m1 = multOf(up1, p1), m2 = multOf(up2, p2);
  const sum = (up1 ? p1 : -p1) + (up2 ? p2 : -p2);
  const gain = overall > 0;
  const O = Math.abs(overall);
  const did = (up: boolean) => (up ? "increased" : "decreased");
  const stem = `A price is ${did(up1)} by ${pct(p1)}. The new price is then ${did(up2)} by ${pct(p2)}.`;
  const hundred = `Check with £100: × ${num(m1)} gives £${num(100 * m1)}, then × ${num(m2)} gives £${num(100 * P)} ✓.`;
  const wrong: (Wrong & { v: number })[] = [];
  const both = `${num(m1)} × ${num(m2)} = ${num(P)}`;
  if (asMultiplier) {
    const add = (v: number, feedback: string) => {
      v = tidy(v);
      if (v > 0) wrong.push({ v, display: num(v), spec: numSpec(v, undefined, { allowFraction: false }), feedback });
    };
    add(1 + sum / 100, `This adds the percentages: ${signed(up1, p1)} and ${signed(up2, p2)} make ${net(sum)}. But changes one after another multiply: ${both}.`);
    // using the percentage itself as a multiplier (× 0.3 for "30%") — for the decrease if there is one, else the second change
    const slipFirst = !up1 && up2;
    const [sp, sup] = slipFirst ? [p1, up1] : [p2, up2];
    const others: (() => void)[] = [
      () => add(m1 + m2, `This adds the two multipliers. One change after another means multiplying them: ${both}.`),
      () =>
        add(
          slipFirst ? (p1 / 100) * m2 : m1 * (p2 / 100),
          `This uses × ${num(sp / 100)} for the ${pct(sp)} ${sup ? "increase" : "decrease"}, but × ${num(sp / 100)} only finds the ${sup ? "increase" : "amount taken off"}. The multiplier is ${multWhy(sup, sp)}.`,
        ),
      () => add(m1, `× ${num(m1)} is just the first change (${signed(up1, p1)}). The second change multiplies again: ${both}.`),
    ];
    for (const o of r.shuffle(others)) o();
    return {
      difficulty: "core" as Difficulty,
      question: `${stem} Which single decimal multiplier has the same effect as both changes together?`,
      answer: numSpec(P, undefined, { allowFraction: false }),
      display: num(P),
      correctFeedback: `${signed(up1, p1)} is × ${num(m1)} and ${signed(up2, p2)} is × ${num(m2)}, and ${both}.`,
      wrong: distinct(wrong, P),
      explanation: `Turn each change into a multiplier: ${multWhy(up1, p1)} and ${multWhy(up2, p2)}. One change after another means multiplying: ${both}. So the overall effect is × ${num(P)}, ${gain ? "an increase" : "a decrease"} of ${pct(O)}. ${hundred}`,
      solution: [`${signed(up1, p1)}: ${multWhy(up1, p1)}.`, `${signed(up2, p2)}: ${multWhy(up2, p2)}.`, `One change after another: ${num(m1)} × ${num(m2)} = **${num(P)}**.`],
      hints: ["Write each change as a decimal multiplier.", "When one change follows another, do you add or multiply the multipliers?"],
      verify: `(1${up1 ? "+" : "-"}${p1}/100)*(1${up2 ? "+" : "-"}${p2}/100)`,
      commonError: "Adding the percentages (or the multipliers) instead of multiplying the multipliers.",
      strategy: "Use the multiplier",
      marks: 2,
      sig: `single${signed(up1, p1)}${signed(up2, p2)}`,
    };
  }
  const add = (v: number, feedback: string) => {
    v = tidy(v);
    if (v >= 0) wrong.push({ v, display: pct(v), spec: numSpec(v), feedback });
  };
  add(Math.abs(sum), `This adds the percentages: ${signed(up1, p1)} and ${signed(up2, p2)} make ${net(sum)}. But the second change is ${pct(p2)} of the *new* price, so multiply the multipliers instead: ${both}.`);
  const others: (() => void)[] = [
    () => add(100 * P, `${pct(100 * P)} is the final price as a percentage of the original (× ${num(P)}). The overall ${gain ? "increase" : "decrease"} is ${gain ? `${pct(100 * P)} − 100%` : `100% − ${pct(100 * P)}`} = ${pct(O)}.`),
    () => add(O / 100, `${num(O / 100)} is the change as a decimal. Multiply by 100 to make it a percentage: ${pct(O)}.`),
    () => add(p1, `${pct(p1)} is just the first change. The second change is ${pct(p2)} of the new price — combine them: ${both}.`),
  ];
  for (const o of r.shuffle(others)) o();
  return {
    difficulty: "challenge" as Difficulty,
    question: `${stem} By what percentage has the price ${gain ? "increased" : "decreased"} overall?`,
    prompt: "Give your answer as a percentage.",
    answer: numSpec(O, pct(O)),
    display: pct(O),
    correctFeedback: `${both}, which is ${pct(100 * P)} of the original price: ${gain ? "an increase" : "a decrease"} of ${pct(O)}.`,
    wrong: distinct(wrong, O),
    explanation: `Write each change as a multiplier: ${multWhy(up1, p1)} and ${multWhy(up2, p2)}. One change after another means multiplying: ${both}. So the final price is ${pct(100 * P)} of the original — ${gain ? "an increase" : "a decrease"} of ${pct(O)}. ${hundred} Adding the percentages (${net(sum)}) doesn't work, because the second change is a percentage of a different amount.`,
    solution: [
      `${signed(up1, p1)} is × ${num(m1)} and ${signed(up2, p2)} is × ${num(m2)}.`,
      `Both together: ${both}.`,
      `${num(P)} = ${pct(100 * P)} of the original price, so the price has ${gain ? "increased" : "decreased"} by **${pct(O)}**.`,
    ],
    hints: ["Write each change as a decimal multiplier.", "Multiply the two multipliers. What percentage of the original price is the answer?", "Try it with a price of £100."],
    verify: gain ? `((1${up1 ? "+" : "-"}${p1}/100)*(1${up2 ? "+" : "-"}${p2}/100)-1)*100` : `(1-(1${up1 ? "+" : "-"}${p1}/100)*(1${up2 ? "+" : "-"}${p2}/100))*100`,
    commonError: `Adding the percentages (${net(sum)}) — the second change is a percentage of the new price, so multiply: ${both}.`,
    strategy: "Use the multiplier",
    marks: 3,
    sig: `overall${signed(up1, p1)}${signed(up2, p2)}`,
  };
}

const pcMultiplier: Generator = {
  id: "pc-multiplier",
  topic: "pc",
  section: "pc-multipliers",
  label: "Decimal multipliers and successive percentage changes",
  kinds: ["mcq", "qa"],
  make(r) {
    const v = r.int(0, 3);
    return v === 0 ? singleMultiplier(r) : v === 1 ? successiveAmount(r) : successiveOverall(r, v === 2);
  },
};

export const GEN_PC: Generator[] = [pcFdp, pcOf, pcAsPercent, pcChange, pcPercentChange, pcMultiplier];
