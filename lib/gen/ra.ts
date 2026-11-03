// Fresh-number generators — Ratio & Proportion (Unit 1). See fr.ts (fr-add) for the reference example.
//
// ra-simplify and ra-combine have ratio answers, so they are written-only: verifyMcq (lib/verify.ts)
// cannot read a ratio verify ("4:6:3") or a ratio option ("4 : 6 : 3"), so no multiple-choice roll of
// theirs could pass draftProblems. Their wrong answers are already MCQ-ready (all different ratios, never
// an equivalent one). ra-unit asks for the value of n (like the bank's ra-m1-q05), so it works as both.

import type { AnswerSpec } from "../types.ts";
import { cap, fr, fracSpec, frRaw, gcd, lcm, m, num, numSpec, tidy, type Draft, type Generator, type Rng, type Wrong } from "./core.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NAMES = ["Aisha", "Wei Ling", "Arjun", "Priya", "Marcus", "Siti", "Ethan", "Mei", "Ravi", "Hana", "Jun", "Zara", "Omar", "Leo", "Nadia", "Kavya", "Daniel", "Sofia", "Yusuf", "Lily", "Amir", "Anya", "Kai", "Isha"];

/** k different names. */
const names = (r: Rng, k: number) => r.shuffle(NAMES).slice(0, k);

type Cur = "£" | "$";

/** Money with the given sign: 12 → "£12", 7.5 → "£7.50". */
function cash(x: number, c: Cur): string {
  const t = tidy(x);
  return c + (Number.isInteger(t) ? String(t) : t.toFixed(2));
}

const isWhole = (x: number) => Math.abs(x - Math.round(x)) < 1e-9;
/** x can be written with at most dp decimal places. */
const hasDp = (x: number, dp: number) => isWhole(tidy(x * 10 ** dp));

/** A ratio for display: [3, 5] → "3 : 5". */
const rat = (parts: number[]) => parts.map(num).join(" : ");
/** A ratio for a verify expression or a sig: [3, 5] → "3:5". */
const ratKey = (parts: number[]) => parts.map((p) => String(tidy(p))).join(":");

const hcf = (xs: number[]) => xs.reduce((a, b) => gcd(a, b));

/** The same ratio in whole numbers with no common factor (decimal parts are scaled up first). */
function lowest(xs: number[]): number[] {
  let k = 1;
  while (!xs.every((x) => isWhole(x * k)) && k < 1e6) k *= 10;
  const w = xs.map((x) => Math.round(x * k));
  const g = hcf(w);
  return w.map((x) => x / g);
}

/** "12 and 18", "12, 18 and 30" */
const andList = (xs: (string | number)[]) => (xs.length < 2 ? String(xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** Wrong numeric answers: skips a value equal to the answer or to an earlier wrong. */
function numSlips(answer: number, allowZero = false) {
  const seen = [answer];
  const list: Wrong[] = [];
  return {
    list,
    add(value: number, display: string, feedback: string, spec: AnswerSpec = numSpec(value)) {
      if (!Number.isFinite(value) || value < 0 || (value === 0 && !allowZero)) return;
      if (seen.some((v) => Math.abs(v - value) <= 1e-9 * Math.max(1, Math.abs(v)))) return;
      seen.push(value);
      list.push({ display, spec, feedback });
    },
  };
}

/** Wrong ratio answers: skips one that is equivalent to the answer or to an earlier wrong. */
function ratioSlips(answer: number[]) {
  const seen = new Set([ratKey(lowest(answer))]);
  const list: Wrong[] = [];
  return {
    list,
    add(parts: number[], feedback: string) {
      if (parts.length !== answer.length || !parts.every((p) => p > 0 && Number.isFinite(p))) return;
      const k = ratKey(lowest(parts));
      if (seen.has(k)) return;
      seen.add(k);
      list.push({ display: rat(parts), spec: { type: "ratio", parts }, feedback });
    },
  };
}

interface UnitPair {
  small: string;
  big: string;
  /** small units in one big unit */
  f: number;
  /** the wrong conversion factor students use (2 m = 20 cm, 2 kg = 200 g) */
  slipF?: number;
  /** small amounts are multiples of this */
  step: number;
  /** names for sentences */
  sw: string;
  bw: string;
}

const UNITS: UnitPair[] = [
  { small: "cm", big: "m", f: 100, slipF: 10, step: 5, sw: "centimetres", bw: "metres" },
  { small: "m", big: "km", f: 1000, slipF: 100, step: 50, sw: "metres", bw: "kilometres" },
  { small: "g", big: "kg", f: 1000, slipF: 100, step: 50, sw: "grams", bw: "kilograms" },
  { small: "ml", big: "litre", f: 1000, slipF: 100, step: 50, sw: "millilitres", bw: "litres" },
  { small: "minute", big: "hour", f: 60, step: 5, sw: "minutes", bw: "hours" },
  { small: "p", big: "£", f: 100, step: 5, sw: "pence", bw: "pounds" },
];

/** "40 cm", "2 m", "1 litre", "1.5 litres", "45 minutes", "75p", "£3". */
function qty(x: number, unit: string): string {
  if (unit === "p") return `${num(x)}p`;
  if (unit === "£") return cash(x, "£");
  const plural = unit === "minute" || unit === "hour" || unit === "litre";
  return `${num(x)} ${unit}${plural && x !== 1 ? "s" : ""}`;
}

/** The wrong factor a student might use for this unit and amount, if there is a classic one. */
function slipFactor(u: UnitPair, big: number): number | undefined {
  if (u.small === "minute") return isWhole(big) ? undefined : 100; // 1.5 hours = 150 minutes
  return u.slipF;
}

/** Feedback for the wrong-conversion slip. */
function slipFactorFeedback(u: UnitPair, big: number, slipF: number): string {
  if (u.small === "minute") {
    return `Time isn't decimal: there are 60 minutes in an hour, so ${qty(big, "hour")} = ${num(big * 60)} minutes, not ${num(big * slipF)}.`;
  }
  return `There are ${qty(u.f, u.small)} in 1 ${u.big}, so ${qty(big, u.big)} = ${qty(big * u.f, u.small)}, not ${qty(big * slipF, u.small)}.`;
}

// ---------------------------------------------------------------------------
// ra-simplify — simplify a ratio (2 or 3 parts; sometimes convert units first)
// ---------------------------------------------------------------------------

interface ListCtx {
  /** short names used in "red : green : yellow" */
  labels: string[];
  /** full names used in sentences */
  nouns: string[];
  intro: (v: number[]) => string;
}

const PAIR_CTX: ListCtx[] = [
  { labels: ["boys", "girls"], nouns: ["boys", "girls"], intro: ([x, y]) => `A choir has ${x} boys and ${y} girls.` },
  { labels: ["red beads", "blue beads"], nouns: ["red beads", "blue beads"], intro: ([x, y]) => `A bracelet has ${x} red beads and ${y} blue beads.` },
  { labels: ["fiction books", "non-fiction books"], nouns: ["fiction books", "non-fiction books"], intro: ([x, y]) => `A class library has ${x} fiction books and ${y} non-fiction books.` },
  { labels: ["sunflowers", "tulips"], nouns: ["sunflowers", "tulips"], intro: ([x, y]) => `A school garden has ${x} sunflowers and ${y} tulips.` },
  { labels: ["Year 7 pupils", "Year 8 pupils"], nouns: ["Year 7 pupils", "Year 8 pupils"], intro: ([x, y]) => `On a school trip there are ${x} Year 7 pupils and ${y} Year 8 pupils.` },
  { labels: ["cats", "dogs"], nouns: ["cats", "dogs"], intro: ([x, y]) => `An animal shelter is looking after ${x} cats and ${y} dogs.` },
];

const TRIO_CTX: ListCtx[] = [
  { labels: ["red", "green", "yellow"], nouns: ["red sweets", "green sweets", "yellow sweets"], intro: ([x, y, z]) => `A jar has ${x} red sweets, ${y} green sweets and ${z} yellow sweets.` },
  { labels: ["Year 7s", "Year 8s", "Year 9s"], nouns: ["Year 7s", "Year 8s", "Year 9s"], intro: ([x, y, z]) => `A chess club has ${x} Year 7s, ${y} Year 8s and ${z} Year 9s.` },
  { labels: ["roses", "lilies", "daisies"], nouns: ["roses", "lilies", "daisies"], intro: ([x, y, z]) => `A florist has ${x} roses, ${y} lilies and ${z} daisies.` },
  { labels: ["red", "blue", "white"], nouns: ["red paint", "blue paint", "white paint"], intro: ([x, y, z]) => `A paint mix uses ${x} ml of red paint, ${y} ml of blue paint and ${z} ml of white paint.` },
];

/** Smallest prime factor of n (n ≥ 2). */
function smallestFactor(n: number): number {
  for (let f = 2; f * f <= n; f++) if (n % f === 0) return f;
  return n;
}

function simplifyCounts(r: Rng, n: 2 | 3): Draft {
  // the answer (no common factor, all parts different) and the HCF k
  let base: number[] = [];
  let k = 1;
  const maxPart = n === 2 ? 150 : 120;
  do {
    base = Array.from({ length: n }, () => r.int(1, n === 2 ? 12 : 9));
    k = r.int(2, n === 2 ? 15 : 10);
  } while (new Set(base).size < n || hcf(base) !== 1 || Math.max(...base) * k > maxPart || Math.min(...base) * k < 4);
  const vals = base.map((b) => b * k);

  const useCtx = r.chance(0.6);
  const ctx = r.pick(n === 2 ? PAIR_CTX : TRIO_CTX);
  let order = Array.from({ length: n }, (_, i) => i);
  if (useCtx && r.chance(0.4)) {
    while (order.every((x, i) => x === i)) order = r.shuffle(order);
  }
  const permuted = !order.every((x, i) => x === i);
  const asked = order.map((i) => vals[i]);
  const ans = order.map((i) => base[i]);
  const askText = n === 2 ? `the ratio of ${ctx.nouns[order[0]]} to ${ctx.nouns[order[1]]}` : `the ratio ${order.map((i) => ctx.labels[i]).join(" : ")}`;

  const question = useCtx ? `${ctx.intro(vals)} Write ${askText} in its simplest form.` : `Write ${rat(vals)} in its simplest form.`;

  const slips = ratioSlips(ans);
  if (permuted) {
    slips.add(base, `${rat(base)} keeps the order the amounts are listed in. The question asks for ${askText}, so the parts must go in that order: ${rat(ans)}.`);
  } else if (n === 2) {
    const why = useCtx
      ? `the question asks for the ratio of ${ctx.nouns[0]} to ${ctx.nouns[1]}, so the number for ${ctx.nouns[0]} goes first`
      : `${vals[0]} comes first in the question, so its part comes first`;
    slips.add([ans[1], ans[0]], `${rat([ans[1], ans[0]])} has the parts the wrong way round. Order matters in a ratio: ${why}.`);
  }

  const divs = asked.map((v) => `${v} ÷ ${k} = ${v / k}`);
  const noFactor = `${andList(ans)} have no common factor except 1`;
  const f = smallestFactor(k);
  const partial = asked.map((v) => v / f);
  const max = Math.max(...vals);
  let difficulty: Draft["difficulty"] = n === 2 ? (max <= 40 ? "warmup" : max <= 100 ? "core" : "challenge") : max <= 60 ? "core" : "challenge";
  if (permuted && difficulty === "warmup") difficulty = "core";
  const orderStep = useCtx ? `In the order asked, ${askText} is ${rat(asked)}.` : "";

  return {
    difficulty,
    question,
    prompt: `Type your ratio with ${n === 2 ? "a colon" : "colons"} between the parts.`,
    answer: { type: "ratio", parts: ans, simplest: true },
    display: rat(ans),
    correctFeedback: `Dividing every part by the HCF, ${k}, gives ${rat(ans)}, and ${noFactor}.`,
    wrong: slips.list,
    explanation: `${orderStep ? `${orderStep} ` : ""}The highest common factor (HCF) of ${andList(asked)} is ${k}. Divide every part by ${k}: ${andList(divs)}, so ${rat(asked)} = ${rat(ans)}. Check: ${noFactor}, so the ratio can't be simplified any further.`,
    solution: [
      ...(orderStep ? [orderStep] : []),
      `The HCF of ${andList(asked)} is ${k}.`,
      `${andList(divs)}, so the ratio in its simplest form is **${rat(ans)}**.`,
      `Check: ${noFactor} ✓`,
    ],
    hints: [
      permuted ? `Write the numbers in the order the ratio asks for first: ${order.map((i) => ctx.labels[i]).join(", ")}.` : `What is the biggest number that divides into ${andList(asked)}?`,
      `Divide every part by the same number. Can the new numbers still be divided by something? Keep going until they can't.`,
    ],
    verify: ratKey(asked),
    commonError:
      f < k
        ? `Stopping too soon, e.g. dividing by ${f} to get ${rat(partial)} — the parts still share a factor, so keep dividing until the only common factor is 1.`
        : `Writing the parts in a different order from the question, or not dividing every part by the same number.`,
    strategy: "Spot the common factor",
    marks: difficulty === "warmup" ? 1 : 2,
    sig: ratKey(asked),
  };
}

function simplifyUnits(r: Rng): Draft {
  let u = UNITS[0];
  let big = 1;
  let small = 5;
  let bf = 100;
  for (let t = 0; t < 200; t++) {
    u = r.pick(UNITS);
    const half = u.small !== "p" && r.chance(0.3);
    big = half ? r.pick([1.5, 2.5]) : r.int(1, 4);
    bf = tidy(big * u.f);
    small = u.step * r.int(1, Math.floor((u.f - 1) / u.step));
    const g = gcd(small, bf);
    if (bf / g <= 20 && bf / g > 1) break;
  }
  const bigFirst = r.chance(0.3);
  const parts = bigFirst ? [bf, small] : [small, bf];
  const raw = bigFirst ? [big, small] : [small, big];
  const g = gcd(small, bf);
  const ans = parts.map((p) => p / g);
  const qBig = qty(big, u.big);
  const qSmall = qty(small, u.small);
  const qText = bigFirst ? `${qBig} : ${qSmall}` : `${qSmall} : ${qBig}`;
  const half = !isWhole(big);

  const slips = ratioSlips(ans);
  const lr = lowest(raw);
  const cmp = bigFirst ? `${u.bw} with ${u.sw}` : `${u.sw} with ${u.bw}`;
  const head = ratKey(lr) === ratKey(raw) ? `${rat(lr)} compares` : `${rat(lr)} comes from ${rat(raw)}, which compares`;
  slips.add(lr, `${head} ${cmp}. Change ${qBig} into ${u.sw} first (${qBig} = ${qty(bf, u.small)}), then simplify.`);
  const sf = slipFactor(u, big);
  if (sf) {
    const wrongBig = tidy(big * sf);
    const w = lowest(bigFirst ? [wrongBig, small] : [small, wrongBig]);
    slips.add(w, `${rat(w)} comes from changing ${qBig} into ${qty(wrongBig, u.small)}. ${slipFactorFeedback(u, big, sf)}`);
  }
  slips.add([ans[1], ans[0]], `${rat([ans[1], ans[0]])} has the parts the wrong way round. ${bigFirst ? qBig : qSmall} comes first in the question, so its part of the ratio comes first.`);

  const conv = `${qBig} = ${qty(bf, u.small)}`;
  const halfNote = half && u.small === "minute" ? ` (${qBig} is ${num(Math.floor(big))} hour${Math.floor(big) === 1 ? "" : "s"} and 30 minutes)` : "";
  return {
    difficulty: half ? "challenge" : "core",
    question: `Write ${qText} as a ratio in its simplest form.`,
    prompt: "Type your ratio with a colon between the parts.",
    answer: { type: "ratio", parts: ans, simplest: true },
    display: rat(ans),
    correctFeedback: `${conv}, so the ratio is ${rat(parts)}, and dividing both parts by ${g} gives ${rat(ans)}.`,
    wrong: slips.list,
    explanation: `Make the units the same before you simplify: ${conv}${halfNote}, so the ratio is ${rat(parts)}. The HCF of ${parts[0]} and ${parts[1]} is ${g}, so divide both parts by ${g} to get ${rat(ans)}. Quick check: multiply ${rat(ans)} by ${g} and you get back to ${rat(parts)} ✓.`,
    solution: [
      `Change to the same units: ${conv}${halfNote}.`,
      `So the ratio is ${rat(parts)}.`,
      `The HCF of ${parts[0]} and ${parts[1]} is ${g}: ${parts[0]} ÷ ${g} = ${ans[0]} and ${parts[1]} ÷ ${g} = ${ans[1]}, so the ratio is **${rat(ans)}**.`,
    ],
    hints: [`Both parts must be in the same unit. How many ${u.sw} are there in ${qBig}?`, "Now divide both parts by their highest common factor."],
    verify: bigFirst ? `${big}*${u.f}:${small}` : `${small}:${big}*${u.f}`,
    commonError: `Simplifying ${rat(raw)} without changing the units first — both parts of a ratio must be in the same unit.`,
    strategy: "Spot the common factor",
    marks: 2,
    sig: bigFirst ? `${big}${u.big}:${small}${u.small}` : `${small}${u.small}:${big}${u.big}`,
  };
}

const raSimplify: Generator = {
  id: "ra-simplify",
  topic: "ra",
  section: "ra-basics",
  label: "Simplify a ratio (2 or 3 parts, converting units first)",
  kinds: ["qa"],
  make(r) {
    const kind = r.pick(["pair", "pair", "trio", "units", "units"] as const);
    if (kind === "units") return simplifyUnits(r);
    return simplifyCounts(r, kind === "pair" ? 2 : 3);
  },
};

// ---------------------------------------------------------------------------
// ra-unit — write a ratio in the form 1 : n or n : 1 (n terminates)
// ---------------------------------------------------------------------------

function unitDraft(r: Rng): Draft {
  const form: "1:n" | "n:1" = r.chance(0.5) ? "1:n" : "n:1";
  const style = r.pick(["plain", "plain", "plain", "units", "units", "below1"] as const);
  // `ratio` is the question's ratio; n = top ÷ bottom
  let ratio: number[] = [];
  let u: UnitPair | undefined;
  let big = 0;
  let small = 0;
  let bigFirst = false;
  let difficulty: Draft["difficulty"] = "core";
  if (style === "units") {
    for (let t = 0; t < 200; t++) {
      u = r.pick(UNITS);
      big = r.int(1, 3);
      small = u.step * r.int(1, Math.floor((big * u.f - 1) / u.step));
      const n = (big * u.f) / small;
      if (!isWhole(n) && hasDp(n, 2) && n > 1 && n < 20) break;
    }
    bigFirst = form === "n:1";
    ratio = bigFirst ? [big * u!.f, small] : [small, big * u!.f];
  } else {
    // n = N/D in lowest terms, D = 2, 4 or 5; the 1-side is D·k and the other side is N·k
    let N = 3;
    let D = 2;
    do {
      D = r.pick([2, 2, 4, 5]);
      N = style === "below1" ? r.pick(D === 5 ? [8] : [5]) : r.int(D + 1, 9 * D);
    } while (gcd(N, D) !== 1);
    const k = r.int(1, style === "below1" ? 4 : 6);
    const one = D * k;
    const other = N * k;
    // below1: the side that has to become 1 is the bigger one, so n < 1
    const [oneSide, otherSide] = style === "below1" ? [other, one] : [one, other];
    ratio = form === "1:n" ? [oneSide, otherSide] : [otherSide, oneSide];
    if (style === "below1") difficulty = "challenge";
    else difficulty = D === 2 && other <= 30 ? "warmup" : "core";
  }
  const [x, y] = ratio;
  // n = top ÷ bottom: 1 : n divides by the first part, n : 1 by the second
  const top = form === "1:n" ? y : x;
  const bot = form === "1:n" ? x : y;
  const n = tidy(top / bot);
  const formText = form === "1:n" ? "1 : n" : "n : 1";
  const shown = u ? (bigFirst ? `${qty(big, u.big)} : ${qty(small, u.small)}` : `${qty(small, u.small)} : ${qty(big, u.big)}`) : rat(ratio);
  const which = form === "1:n" ? "first" : "second";
  const unitForm = form === "1:n" ? `1 : ${num(n)}` : `${num(n)} : 1`;

  const slips = numSlips(n);
  // 1. dividing the wrong way
  const flip = tidy(bot / top);
  if (hasDp(flip, 3)) {
    slips.add(flip, num(flip), `${num(flip)} is ${bot} ÷ ${top} — dividing the wrong way. To turn the ${bot} into 1 you divide it by ${bot}, so n = ${top} ÷ ${bot}.`);
  }
  // 2. subtracting instead of dividing
  if (n > 1) slips.add(top - bot, num(top - bot), `${top - bot} is ${top} − ${bot}. Ratios scale by multiplying or dividing both parts by the same number, never by subtracting.`);
  // 3. the remainder written as the decimal part
  if (top > bot && isWhole(top) && isWhole(bot)) {
    const q = Math.floor(top / bot);
    const rem = top - q * bot;
    if (rem > 0 && rem < 10) {
      const v = Number(`${q}.${rem}`);
      slips.add(v, num(v), `${top} ÷ ${bot} is ${q} remainder ${rem}, but the remainder isn't 0.${rem}. The ${rem} left over is ${m(`${rem}/${bot}`)} = ${num(tidy(rem / bot))}, so ${top} ÷ ${bot} = ${num(n)}.`);
    }
  }
  // 4. simplified to whole numbers and stopped
  const low = lowest(ratio);
  const lowOther = form === "1:n" ? low[1] : low[0];
  if (low[0] !== ratio[0]) {
    slips.add(lowOther, num(lowOther), `${lowOther} comes from simplifying ${rat(ratio)} to ${rat(low)}. That's the simplest whole-number form, but in the form ${formText} the ${which} part must be exactly 1 — divide both parts by ${bot}.`);
  }
  // 5. changed one part into 1 but left the other alone
  slips.add(top, num(top), `${top} comes from turning the ${bot} into 1 but leaving the ${top} as it is. Whatever you do to one part you must do to the other: ${top} ÷ ${bot} = ${num(n)}.`);
  // 6. units slips
  if (u) {
    const plain = bigFirst ? [big, small] : [small, big];
    const v = tidy(form === "1:n" ? plain[1] / plain[0] : plain[0] / plain[1]);
    if (hasDp(v, 4)) slips.add(v, num(v), `${num(v)} comes from ${rat(plain)} — that compares ${u.sw} with ${u.bw}. Change ${qty(big, u.big)} into ${qty(big * u.f, u.small)} first.`);
    const sf = slipFactor(u, big);
    if (sf) {
      const wb = big * sf;
      const w = tidy(form === "1:n" ? (bigFirst ? small / wb : wb / small) : bigFirst ? wb / small : small / wb);
      if (hasDp(w, 3)) slips.add(w, num(w), `${num(w)} comes from changing ${qty(big, u.big)} into ${qty(wb, u.small)}. ${slipFactorFeedback(u, big, sf)}`);
    }
  }

  const unitStep = u ? `Make the units the same first: ${qty(big, u.big)} = ${qty(big * u.f, u.small)}, so the ratio is ${rat(ratio)}.` : "";
  const divide =
    form === "1:n"
      ? `${x} ÷ ${x} = 1 and ${y} ÷ ${x} = ${num(n)}`
      : `${x} ÷ ${y} = ${num(n)} and ${y} ÷ ${y} = 1`;
  const below = n < 1 ? ` Here n is less than 1, because the ${which} part was the bigger one.` : "";
  return {
    difficulty: u ? "core" : difficulty,
    question: `Write ${shown} in the form ${formText}. What is the value of n?`,
    prompt: "Type just the value of n (a decimal or a fraction).",
    answer: numSpec(n),
    display: num(n),
    correctFeedback: `Dividing both parts by ${bot} gives ${divide.replace(" and ", " and ")}, so ${rat(ratio)} = ${unitForm}.`,
    wrong: slips.list,
    explanation: `${unitStep ? `${unitStep} ` : ""}To write a ratio in the form ${formText}, divide **both** parts by the ${which} part, ${bot}: ${divide}. So ${rat(ratio)} = ${unitForm} and n = ${num(n)}.${below} Check by multiplying back: ${num(n)} × ${bot} = ${top} ✓. In this form n doesn't have to be a whole number — that's what makes it handy for comparing ratios.`,
    solution: [
      ...(unitStep ? [unitStep] : []),
      `For the form ${formText}, divide both parts by the ${which} part, ${bot}.`,
      `${divide}, so ${rat(ratio)} = ${unitForm} and **n = ${num(n)}**.`,
      `Check: ${num(n)} × ${bot} = ${top} ✓`,
    ],
    hints: [
      `${u ? `Change both amounts into ${u.sw} first. ` : ""}To make the ${which} part 1, what must you divide it by? Do the same to the other part.`,
      `Work out ${top} ÷ ${bot} carefully — n doesn't have to be a whole number.`,
    ],
    verify: u ? (bigFirst ? `${big}*${u.f}/${small}` : `${big}*${u.f}/${small}`) : `${top}/${bot}`,
    commonError: `Dividing the wrong way (${bot} ÷ ${top}). To make the ${which} part 1, divide both parts by the ${which} part.`,
    strategy: "Use the multiplier",
    marks: (u ? "core" : difficulty) === "warmup" ? 1 : 2,
    sig: u ? `${form}|${bigFirst ? `${big}${u.big}:${small}${u.small}` : `${small}${u.small}:${big}${u.big}`}` : `${form}|${ratKey(ratio)}`,
  };
}

const raUnit: Generator = {
  id: "ra-unit",
  topic: "ra",
  section: "ra-basics",
  label: "Write a ratio in the form 1 : n or n : 1",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = unitDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = unitDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// Sharing helpers
// ---------------------------------------------------------------------------

const ORD = ["first", "second", "third"];
const partsWord = (p: number) => `${p} part${p === 1 ? "" : "s"}`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** What is being shared: money, or a number of things. */
interface Stuff {
  money: boolean;
  cur: Cur;
  noun: string;
  fmt: (x: number) => string;
  /** can a slip's value be shown as a real amount? (money to the penny, whole things) */
  nice: (x: number) => boolean;
}

function pickStuff(r: Rng): Stuff {
  if (r.chance(0.6)) {
    const cur: Cur = r.pick(["£", "$"]);
    return { money: true, cur, noun: "money", fmt: (x) => cash(x, cur), nice: (x) => hasDp(x, 2) };
  }
  const noun = r.pick(["stickers", "marbles", "sweets", "football cards", "beads", "stamps"]);
  return { money: false, cur: "£", noun, fmt: (x) => num(x), nice: isWhole };
}

/** Distinct ratio parts with no common factor. */
function pickParts(r: Rng, n: number, max: number): number[] {
  let parts: number[] = [];
  do parts = Array.from({ length: n }, () => r.int(1, max));
  while (new Set(parts).size < n || hcf(parts) !== 1);
  return parts;
}

// ---------------------------------------------------------------------------
// ra-share — share an amount in a ratio (2 or 3 parts)
// ---------------------------------------------------------------------------

function shareDraft(r: Rng): Draft {
  const three = r.chance(0.4);
  const parts = pickParts(r, three ? 3 : 2, three ? 7 : 9);
  const T = sum(parts);
  const s = pickStuff(r);
  const pence = s.money && three && r.chance(0.3);
  const u = s.money ? (pence ? r.int(2, 12) + 0.5 : r.int(2, 30)) : r.int(2, 15);
  const total = tidy(T * u);
  const who = names(r, parts.length);
  const askLargest = r.chance(0.3);
  const i = askLargest ? parts.indexOf(Math.max(...parts)) : r.int(0, parts.length - 1);
  const X = who[i];
  const ans = tidy(parts[i] * u);
  const f = s.fmt;
  const sumText = parts.join(" + ");
  const thing = s.money ? "money" : s.noun;

  const slips = numSlips(ans);
  // the other person's share
  if (askLargest) {
    const j = parts.indexOf(Math.min(...parts));
    const v = tidy(parts[j] * u);
    slips.add(v, f(v), `${f(v)} is the **smallest** share (${who[j]}'s ${partsWord(parts[j])}). The largest share goes with the biggest number in the ratio, ${parts[i]}.`);
  } else {
    const j = parts.length === 2 ? 1 - i : (i + 1) % 3;
    const v = tidy(parts[j] * u);
    slips.add(v, f(v), `${f(v)} is ${who[j]}'s share (${partsWord(parts[j])}). ${X} is ${ORD[i]} in the list of names, so ${X} has the ${partsWord(parts[i])}.`);
  }
  // one part only
  if (parts[i] !== 1) slips.add(u, f(u), `${f(u)} is just one part (${f(total)} ÷ ${T}). ${X} has ${partsWord(parts[i])}, so multiply by ${parts[i]}.`);
  // divided by one ratio number instead of the total number of parts
  const byOwn = tidy(total / parts[i]);
  if (parts[i] !== 1 && s.nice(byOwn)) {
    slips.add(byOwn, f(byOwn), `${f(byOwn)} comes from dividing ${f(total)} by ${parts[i]}, ${X}'s number in the ratio. Divide by the **total** number of parts first: ${sumText} = ${T}.`);
  }
  // part : part (or part : rest) used as a fraction of the total
  const rest = T - parts[i];
  const pp = tidy((total / rest) * parts[i]);
  if (parts[i] < rest && s.nice(pp)) {
    slips.add(
      pp,
      f(pp),
      parts.length === 2
        ? `${f(pp)} is ${m(`${parts[i]}/${rest}`)} of ${f(total)}, but ${rat(parts)} is part : part. ${X} has ${parts[i]} of the ${T} parts, so ${X} gets ${fr(parts[i], T)} of the ${thing}.`
        : `${f(pp)} is ${m(`${parts[i]}/${rest}`)} of ${f(total)}: that compares ${X}'s ${partsWord(parts[i])} with the other ${rest} parts. ${X} has ${parts[i]} parts out of all ${T}, so ${X} gets ${fr(parts[i], T)} of the ${thing}.`,
    );
  }
  // shared equally
  const eq = tidy(total / parts.length);
  if (s.nice(eq)) slips.add(eq, f(eq), `${f(eq)} is what everyone would get if the ${thing} were shared **equally**. With the ratio ${rat(parts)}, ${X} gets ${parts[i]} of the ${T} parts.`);
  // multiplied the ratio numbers instead of adding them
  if (parts.length === 2) {
    const prod = parts[0] * parts[1];
    const v = tidy((total / prod) * parts[i]);
    if (prod !== T && s.nice(v)) {
      slips.add(v, f(v), `${f(v)} comes from multiplying ${parts[0]} × ${parts[1]} = ${prod} parts. The total number of parts is ${sumText} = ${T}: add the parts, don't multiply them.`);
    }
  }

  const shares = parts.map((p) => f(tidy(p * u)));
  const largestNote = askLargest ? `The largest share goes to ${X}, who has the most parts. ` : "";
  const ask = askLargest ? (s.money ? "How much is the largest share?" : `How many ${s.noun} are in the largest share?`) : s.money ? `How much does ${X} get?` : `How many ${s.noun} does ${X} get?`;
  return {
    difficulty: pence ? "challenge" : !three && T <= 8 && total <= 60 ? "warmup" : "core",
    question: `${andList(who)} share ${s.money ? f(total) : `${total} ${s.noun}`} in the ratio ${rat(parts)}. ${ask}`,
    prompt: s.money ? `Give your answer in ${s.cur}.` : undefined,
    answer: numSpec(ans, f(ans)),
    display: f(ans),
    correctFeedback: `There are ${T} parts, so 1 part is ${f(total)} ÷ ${T} = ${f(u)}, and ${X}'s ${partsWord(parts[i])} ${parts[i] === 1 ? "makes" : "make"} ${f(ans)}.`,
    wrong: slips.list,
    explanation: `Add the parts: ${sumText} = ${T} parts. One part is ${f(total)} ÷ ${T} = ${f(u)}. ${largestNote}${X} has ${partsWord(parts[i])}, so ${X} gets ${parts[i]} × ${f(u)} = ${f(ans)}. Check: ${shares.join(" + ")} = ${f(total)} ✓.`,
    solution: [
      `Total number of parts: ${sumText} = ${T}.`,
      `One part: ${f(total)} ÷ ${T} = ${f(u)}.`,
      `${largestNote}${X} has ${partsWord(parts[i])}: ${parts[i]} × ${f(u)} = **${f(ans)}**.`,
      `Check: ${shares.join(" + ")} = ${f(total)} ✓`,
    ],
    hints: ["Draw a bar model with one box for each part. How many boxes are there altogether?", `What is one box worth? ${askLargest ? "Which person has the most boxes?" : `${X} has ${parts[i]} of the boxes.`}`],
    verify: `${total}/(${parts.join("+")})*${parts[i]}`,
    commonError: `Dividing ${f(total)} by ${X}'s ${parts[i]} instead of by the total number of parts, ${T}.`,
    strategy: "Use a bar model",
    marks: !pence && !three && T <= 8 && total <= 60 ? 1 : 2,
    sig: `${total}|${ratKey(parts)}|${i}`,
  };
}

const raShare: Generator = {
  id: "ra-share",
  topic: "ra",
  section: "ra-sharing",
  label: "Share an amount in a ratio",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = shareDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = shareDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-given-part — given one share (or two people's shares together), find another share or the total
// ---------------------------------------------------------------------------

function givenDraft(r: Rng): Draft {
  const three = r.chance(0.35);
  const parts = pickParts(r, three ? 3 : 2, three ? 7 : 9);
  const T = sum(parts);
  const n = parts.length;
  const s = pickStuff(r);
  const u = s.money ? r.int(2, 25) : r.int(2, 12);
  const who = names(r, n);
  const f = s.fmt;
  // who we are told about
  const i = r.int(0, n - 1);
  const pair = three && r.chance(0.4);
  const j = (i + 1) % n;
  const knownIdx = pair ? [i, j].sort((a, b) => a - b) : [i];
  const kp = sum(knownIdx.map((x) => parts[x]));
  const knownVal = tidy(kp * u);
  // what we ask for: the total, or someone we weren't told about
  const others = parts.map((_, x) => x).filter((x) => !knownIdx.includes(x));
  const askTotal = r.chance(0.4);
  const k = askTotal ? -1 : r.pick(others);
  const target = askTotal ? T : parts[k];
  // the answer must not just repeat the amount in the question
  if (target === kp) return givenDraft(r);
  const ans = tidy(target * u);
  const knownWho = andList(knownIdx.map((x) => who[x]));
  const sumText = parts.join(" + ");
  const thing = s.money ? "money" : s.noun;

  const slips = numSlips(ans);
  // 1. treated the known share as the total
  if (!askTotal) {
    const v = tidy((knownVal / T) * target);
    if (s.nice(v)) slips.add(v, f(v), `${f(v)} comes from sharing ${f(knownVal)} into all ${T} parts. But ${f(knownVal)} is only what ${knownWho} ${pair ? "get together" : "gets"}, not the total: it is ${partsWord(kp)}.`);
  }
  // 2. matched the known amount to the wrong number in the ratio
  if (pair) {
    const only = Math.max(...knownIdx.map((x) => parts[x]));
    const v = tidy((knownVal / only) * target);
    if (s.nice(v)) slips.add(v, f(v), `${f(v)} comes from dividing ${f(knownVal)} by ${only} only. ${f(knownVal)} is what ${knownWho} get together, so it covers ${parts[knownIdx[0]]} + ${parts[knownIdx[1]]} = ${kp} parts.`);
  } else {
    const w = askTotal ? (i + 1) % n : k;
    const v = tidy((knownVal / parts[w]) * (askTotal ? T : parts[i]));
    if (s.nice(v)) slips.add(v, f(v), `${f(v)} comes from treating ${who[i]}'s ${f(knownVal)} as ${partsWord(parts[w])}. ${who[i]} is ${ORD[i]} in the list of names, so ${who[i]} has the ${partsWord(parts[i])}: ${f(knownVal)} ÷ ${parts[i]} = ${f(u)} per part.`);
  }
  // 3. the total instead of a share, or a share instead of the total
  if (askTotal) {
    const v = tidy((T - kp) * u);
    slips.add(v, f(v), `${f(v)} is what ${andList(others.map((x) => who[x]))} ${others.length > 1 ? "get together" : "gets"}. The total must include ${knownWho}'s ${f(knownVal)} as well.`);
  } else {
    slips.add(tidy(T * u), f(tidy(T * u)), `${f(tidy(T * u))} is the **total** (all ${T} parts). The question asks only for ${who[k]}'s share, which is ${partsWord(parts[k])}.`);
  }
  // 4. one part only
  if (target !== 1) slips.add(u, f(u), `${f(u)} is one part (${f(knownVal)} ÷ ${kp}). ${askTotal ? `There are ${T} parts altogether` : `${who[k]} has ${partsWord(parts[k])}`}, so multiply by ${target}.`);
  // 5. adding instead of multiplying (2 people)
  if (!three && !askTotal) {
    const diff = parts[k] - parts[i];
    const v = tidy(knownVal + diff);
    slips.add(v, f(v), `${f(v)} comes from ${diff > 0 ? "adding" : "taking away"} ${Math.abs(diff)}, because ${who[k]} has ${Math.abs(diff)} ${diff > 0 ? "more" : "fewer"} part${Math.abs(diff) === 1 ? "" : "s"}. Ratios work by multiplying: one part is worth ${f(u)}, not ${s.money ? f(1) : "1"}.`);
  }
  // 6. multiplying the ratio numbers to get the total number of parts (2 people)
  if (!three && askTotal && Math.min(...parts) > 1) {
    const v = tidy(u * parts[0] * parts[1]);
    if (s.nice(v)) slips.add(v, f(v), `${f(v)} comes from multiplying ${parts[0]} × ${parts[1]} = ${parts[0] * parts[1]} parts. The total number of parts is ${sumText} = ${T}: add the parts, don't multiply them.`);
  }

  const knownSentence = pair ? `${knownWho} have ${parts[knownIdx[0]]} + ${parts[knownIdx[1]]} = ${kp} parts between them` : `${who[i]} has ${partsWord(parts[i])}`;
  const targetSentence = askTotal ? `Altogether there are ${sumText} = ${T} parts, so the total is ${T} × ${f(u)} = ${f(ans)}.` : `${who[k]} has ${partsWord(parts[k])}, so ${who[k]} gets ${parts[k]} × ${f(u)} = ${f(ans)}.`;
  const told = pair ? `${knownWho} get ${s.money ? f(knownVal) : `${knownVal} ${s.noun}`} between them.` : `${who[i]} gets ${s.money ? f(knownVal) : `${knownVal} ${s.noun}`}.`;
  const ask = askTotal ? (s.money ? "How much money is shared altogether?" : `How many ${s.noun} are there altogether?`) : s.money ? `How much does ${who[k]} get?` : `How many ${s.noun} does ${who[k]} get?`;
  const difficulty: Draft["difficulty"] = pair ? "challenge" : !three && !askTotal && T <= 8 && u <= 10 ? "warmup" : "core";
  return {
    difficulty,
    question: `${andList(who)} share some ${thing} in the ratio ${rat(parts)}. ${told} ${ask}`,
    prompt: s.money ? `Give your answer in ${s.cur}.` : undefined,
    answer: numSpec(ans, f(ans)),
    display: f(ans),
    correctFeedback: `${kp} part${kp === 1 ? "" : "s"} = ${f(knownVal)}, so 1 part = ${f(u)} and ${askTotal ? `all ${T} parts` : `${who[k]}'s ${partsWord(parts[k])}`} = ${f(ans)}.`,
    wrong: slips.list,
    explanation: `${knownSentence}, and they are worth ${f(knownVal)}. So 1 part = ${f(knownVal)} ÷ ${kp} = ${f(u)}. ${targetSentence} Check: ${f(knownVal)} ÷ ${kp} and ${f(ans)} ÷ ${target} both give ${f(u)} per part ✓.`,
    solution: [
      `${knownSentence}: ${kp} part${kp === 1 ? "" : "s"} = ${f(knownVal)}.`,
      `1 part = ${f(knownVal)} ÷ ${kp} = ${f(u)}.`,
      askTotal ? `Total: ${sumText} = ${T} parts, and ${T} × ${f(u)} = **${f(ans)}**.` : `${who[k]}: ${parts[k]} × ${f(u)} = **${f(ans)}**.`,
    ],
    hints: [
      `${pair ? `${knownWho}'s shares together` : `${who[i]}'s share`} match how many parts of the ratio?`,
      `Find what one part is worth, then ${askTotal ? "count all the parts" : `use ${who[k]}'s number in the ratio`}.`,
    ],
    verify: `${knownVal}/(${knownIdx.map((x) => parts[x]).join("+")})*${askTotal ? `(${parts.join("+")})` : parts[k]}`,
    commonError: pair
      ? `Dividing ${f(knownVal)} by just one of the numbers — it is ${knownWho}'s shares together, so it covers ${kp} parts.`
      : `Dividing ${f(knownVal)} by the total number of parts (${T}). ${f(knownVal)} is only ${who[i]}'s share, so it is ${who[i]}'s ${partsWord(parts[i])}.`,
    strategy: "Use a bar model",
    marks: difficulty === "warmup" ? 1 : difficulty === "challenge" ? 3 : 2,
    sig: `${ratKey(parts)}|${knownIdx.join("+")}=${knownVal}|${askTotal ? "all" : k}`,
  };
}

const raGivenPart: Generator = {
  id: "ra-given-part",
  topic: "ra",
  section: "ra-sharing",
  label: "Given one share, find another share or the total",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = givenDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = givenDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-difference — given the difference between two shares, find a share or the total
// ---------------------------------------------------------------------------

interface GroupCtx {
  intro: string;
  labels: [string, string];
  whole: string;
}

const DIFF_CTX: GroupCtx[] = [
  { intro: "In a sports club", labels: ["children", "adults"], whole: "How many people are in the club altogether?" },
  { intro: "In a choir", labels: ["boys", "girls"], whole: "How many singers are in the choir altogether?" },
  { intro: "In a class library", labels: ["fiction books", "non-fiction books"], whole: "How many books are there altogether?" },
  { intro: "In a car park", labels: ["red cars", "silver cars"], whole: "How many red and silver cars are there altogether?" },
  { intro: "At a school concert", labels: ["adults", "children"], whole: "How many people are at the concert altogether?" },
];

function differenceDraft(r: Rng): Draft {
  const three = r.chance(0.3);
  const parts = pickParts(r, three ? 3 : 2, three ? 7 : 13);
  const n = parts.length;
  const T = sum(parts);
  // the two shares being compared: hi has more parts than lo
  let hi = 0;
  let lo = 1;
  do {
    hi = r.int(0, n - 1);
    lo = r.int(0, n - 1);
  } while (hi === lo || parts[hi] <= parts[lo]);
  const dp = parts[hi] - parts[lo];
  const money = three || r.chance(0.45);
  const cur: Cur = r.pick(["£", "$"]);
  const u = money ? r.int(2, 20) : r.int(2, 12);
  const D = dp * u;
  const ctx = r.pick(DIFF_CTX);
  const who = money ? names(r, n) : ctx.labels;
  const f = (x: number) => (money ? cash(x, cur) : num(x));
  const askTotal = r.chance(0.3);
  const k = askTotal ? -1 : three ? r.int(0, 2) : r.pick([hi, lo]);
  const target = askTotal ? T : parts[k];
  const ans = tidy(target * u);
  // wording for one share
  const nameOf = (x: number) => (money ? who[x] : `the ${who[x]}`);
  const shareOf = (x: number) => (money ? `${who[x]}'s share` : `the number of ${who[x]}`);
  const has = (x: number) => (money ? `${who[x]} has` : `the ${who[x]} have`);
  const sumText = parts.join(" + ");

  const slips = numSlips(ans);
  // 1. the difference shared over all the parts
  const v1 = tidy((D / T) * target);
  if (!askTotal && (money ? hasDp(v1, 2) : isWhole(v1))) {
    slips.add(v1, f(v1), `${f(v1)} comes from dividing ${f(D)} by all ${T} parts. ${f(D)} is the **difference**, which is only ${parts[hi]} − ${parts[lo]} = ${partsWord(dp)}.`);
  }
  // 2. the difference used as one part
  if (dp > 1 && target !== 1) {
    const v = D * target;
    slips.add(v, f(v), `${f(v)} treats the ${f(D)} as one part. It is the difference between ${nameOf(hi)} and ${nameOf(lo)}, which is ${parts[hi]} − ${parts[lo]} = ${dp} parts, so 1 part = ${f(D)} ÷ ${dp} = ${f(u)}.`);
  }
  // 3. the wrong share
  if (askTotal) {
    const v = parts[hi] * u;
    slips.add(v, f(v), `${f(v)} is just ${shareOf(hi)} (${partsWord(parts[hi])}). The total needs all ${T} parts.`);
  } else {
    const other = k === hi ? lo : hi;
    const v = parts[other] * u;
    slips.add(v, f(v), `${f(v)} is ${shareOf(other)} (${partsWord(parts[other])}). The question asks for ${shareOf(k)}, which is ${partsWord(parts[k])}.`);
    // 4. the total instead of a share
    slips.add(T * u, f(T * u), `${f(T * u)} is the **total** (all ${T} parts). The question asks only for ${shareOf(k)}.`);
  }
  // 5. one part only
  if (target !== 1) slips.add(u, f(u), `${f(u)} is ${dp === 1 ? "the difference, which is just one part" : `one part (${f(D)} ÷ ${dp})`}. ${askTotal ? `There are ${T} parts altogether` : `${cap(shareOf(k))} is ${partsWord(parts[k])}`}, so multiply by ${target}.`);

  const question = money
    ? `${andList(who)} share some money in the ratio ${rat(parts)}. ${who[hi]} gets ${f(D)} more than ${who[lo]}. ${askTotal ? "How much money is shared altogether?" : `How much does ${who[k]} get?`}`
    : `${ctx.intro}, the ratio of ${who[0]} to ${who[1]} is ${rat(parts)}. There are ${D} more ${who[hi]} than ${who[lo]}. ${askTotal ? ctx.whole : `How many ${who[k]} are there?`}`;
  const targetSentence = askTotal ? `Altogether there are ${sumText} = ${T} parts, so the total is ${T} × ${f(u)} = ${f(ans)}.` : `${cap(shareOf(k))} is ${partsWord(parts[k])}: ${parts[k]} × ${f(u)} = ${f(ans)}.`;
  const difficulty: Draft["difficulty"] = three ? "challenge" : dp === 1 && !askTotal ? "warmup" : "core";
  return {
    difficulty,
    question,
    prompt: money ? `Give your answer in ${cur}.` : undefined,
    answer: numSpec(ans, f(ans)),
    display: f(ans),
    correctFeedback: `The difference is ${partsWord(dp)} = ${f(D)}, so 1 part = ${f(u)} and ${askTotal ? `all ${T} parts make` : `${shareOf(k)} is`} ${f(ans)}.`,
    wrong: slips.list,
    explanation: `Line the two bars up: ${has(hi)} ${partsWord(parts[hi])} and ${nameOf(lo)} ${partsWord(parts[lo])}, so the difference of ${f(D)} is ${parts[hi]} − ${parts[lo]} = ${partsWord(dp)}. 1 part = ${f(D)} ÷ ${dp} = ${f(u)}. ${targetSentence} Check: ${f(parts[hi] * u)} − ${f(parts[lo] * u)} = ${f(D)} ✓.`,
    solution: [
      `The difference is ${parts[hi]} − ${parts[lo]} = ${partsWord(dp)}, and it is worth ${f(D)}.`,
      `1 part = ${f(D)} ÷ ${dp} = ${f(u)}.`,
      askTotal ? `Total: ${sumText} = ${T} parts, and ${T} × ${f(u)} = **${f(ans)}**.` : `${cap(shareOf(k))}: ${parts[k]} × ${f(u)} = **${f(ans)}**.`,
      `Check: ${f(parts[hi] * u)} − ${f(parts[lo] * u)} = ${f(D)} ✓`,
    ],
    hints: [
      `Draw the two bars lined up. The ${f(D)} difference matches the boxes that stick out — how many boxes is that?`,
      `Find what one box is worth, then ${askTotal ? "count all the boxes" : `use the ${parts[k]} in the ratio`}.`,
    ],
    verify: `${D}/(${parts[hi]}-${parts[lo]})*${askTotal ? `(${parts.join("+")})` : parts[k]}`,
    commonError: `Dividing the difference (${f(D)}) by the total number of parts (${T}) instead of by the difference in parts (${dp}).`,
    strategy: "Use a bar model",
    marks: difficulty === "warmup" ? 1 : difficulty === "challenge" ? 3 : 2,
    sig: `${ratKey(parts)}|${hi}-${lo}=${D}|${askTotal ? "all" : k}`,
  };
}

const raDifference: Generator = {
  id: "ra-difference",
  topic: "ra",
  section: "ra-sharing",
  label: "Given the difference between two shares, find a share or the total",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = differenceDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = differenceDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-fraction — ratio ↔ fractions (part of the whole, part of another part, and back)
// ---------------------------------------------------------------------------

interface FracCtx {
  /** short names used in the question */
  labels: string[];
  /** names used in sentences, and their verb ("the squash is", "the boys are") */
  nouns: string[];
  be: "is" | "are";
  stem: (R: string) => string;
  ask: (label: string) => string;
  whole: string;
}

const FRAC2: FracCtx[] = [
  { labels: ["boys", "girls"], nouns: ["boys", "girls"], be: "are", stem: (R) => `In a class, the ratio of boys to girls is ${R}.`, ask: (l) => `What fraction of the class are ${l}?`, whole: "class" },
  { labels: ["red", "white"], nouns: ["red paint", "white paint"], be: "is", stem: (R) => `Siti mixes red paint and white paint in the ratio ${R} to make pink paint.`, ask: (l) => `What fraction of the pink paint is ${l}?`, whole: "pink paint" },
  { labels: ["squash", "water"], nouns: ["squash", "water"], be: "is", stem: (R) => `A drink is made by mixing squash and water in the ratio ${R}.`, ask: (l) => `What fraction of the drink is ${l}?`, whole: "drink" },
  { labels: ["red", "blue"], nouns: ["red counters", "blue counters"], be: "are", stem: (R) => `A bag holds red counters and blue counters in the ratio ${R}.`, ask: (l) => `What fraction of the counters are ${l}?`, whole: "bag of counters" },
];

const FRAC3: FracCtx[] = [
  { labels: ["red", "blue", "green"], nouns: ["red counters", "blue counters", "green counters"], be: "are", stem: (R) => `A bag holds red, blue and green counters in the ratio ${R}.`, ask: (l) => `What fraction of the counters are ${l}?`, whole: "bag of counters" },
  { labels: ["apples", "pears", "plums"], nouns: ["apples", "pears", "plums"], be: "are", stem: (R) => `A fruit bowl has apples, pears and plums in the ratio ${R}.`, ask: (l) => `What fraction of the fruit are ${l}?`, whole: "fruit bowl" },
];

const BACK_CTX: { place: string; groups: [string, string] }[] = [
  { place: "the members of a chess club", groups: ["boys", "girls"] },
  { place: "the counters in a bag", groups: ["red", "blue"] },
  { place: "the flowers in a garden", groups: ["tulips", "daisies"] },
  { place: "the books on a shelf", groups: ["non-fiction", "fiction"] },
];

/** Ratio → fraction of the whole (2 or 3 parts). */
function fracOfWhole(r: Rng): Draft {
  const three = r.chance(0.3);
  const parts = pickParts(r, three ? 3 : 2, three ? 7 : 9);
  const T = sum(parts);
  const ctx = r.pick(three ? FRAC3 : FRAC2);
  const k = r.int(0, parts.length - 1);
  const o = parts.length === 2 ? 1 - k : (k + 1) % 3;
  const pk = parts[k];
  const L = ctx.labels;
  const slips = numSlips(pk / T);
  // a slip's fraction exactly as worked out: not simplified, top-heavy rather than mixed
  const raw = (n: number, d: number) => frRaw(n, d, false);
  const add = (n: number, d: number, feedback: string) => slips.add(n / d, raw(n, d), feedback, fracSpec(n, d, { simplest: false }));
  const N = ctx.nouns;
  const be = ctx.be;
  if (parts.length === 2) {
    add(pk, parts[o], `${raw(pk, parts[o])} compares the ${N[k]} with the ${N[o]} (part : part). A fraction of the ${ctx.whole} compares the ${N[k]} with the **whole**: ${pk} parts out of ${T}.`);
    add(parts[o], pk, `${raw(parts[o], pk)} is ${L[o]} ÷ ${L[k]}: part : part, and the wrong way up. ${parts[o] > pk ? "A fraction of the whole can't be bigger than 1. " : ""}The ${N[k]} ${be} ${pk} of the ${T} parts.`);
  } else {
    add(pk, T - pk, `${raw(pk, T - pk)} compares the ${N[k]} with the other two together (${pk} : ${T - pk}, part : part). As a fraction of the whole, the ${N[k]} ${be} ${pk} parts out of ${T}.`);
    add(pk, parts[o], `${raw(pk, parts[o])} compares the ${N[k]} with the ${N[o]} only. A fraction of the ${ctx.whole} compares with all ${T} parts.`);
  }
  add(parts[o], T, `${raw(parts[o], T)} is the fraction for the ${N[o]}. The ${N[k]} ${be} ${partsWord(pk)}, not ${parts[o]}.`);
  if (pk !== 1) add(1, T, `${raw(1, T)} is just one part. The ${N[k]} ${be} ${partsWord(pk)}, so multiply by ${pk}.`);

  const reduces = gcd(pk, T) !== 1;
  const frac = `${m(`${pk}/${T}`)}${reduces ? ` = ${fr(pk, T)}` : ""}`;
  return {
    difficulty: three ? "core" : "warmup",
    question: `${ctx.stem(rat(parts))} ${ctx.ask(L[k])}`,
    prompt: "Give your answer as a fraction in its simplest form.",
    answer: fracSpec(pk, T),
    display: fr(pk, T),
    correctFeedback: `There are ${parts.join(" + ")} = ${T} equal parts and the ${N[k]} ${be} ${pk} of them, so the fraction is ${frac}.`,
    wrong: slips.list,
    explanation: `A ratio of ${rat(parts)} splits the ${ctx.whole} into ${parts.join(" + ")} = ${T} equal parts, and the ${N[k]} ${be} ${pk} of them. So the ${N[k]} ${be} ${frac} of the ${ctx.whole}.${reduces ? ` (Divide the top and bottom by ${gcd(pk, T)} to simplify.)` : ""} A ratio compares part with part; a fraction of the ${ctx.whole} compares a part with the **whole**.`,
    solution: [
      `Total number of parts: ${parts.join(" + ")} = ${T}.`,
      `The ${N[k]} ${be} ${pk} of those ${T} parts, so the fraction is ${frac}.`,
    ],
    hints: [`How many equal parts make up the whole ${ctx.whole}?`, `How many of those parts are for the ${N[k]}?`],
    verify: `${pk}/(${parts.join("+")})`,
    commonError:
      parts.length === 2
        ? `Writing ${raw(pk, parts[o])}, which compares the ${N[k]} with the ${N[o]} (part : part) instead of with the whole.`
        : `Comparing the ${N[k]} with the rest (${pk} : ${T - pk}) instead of with the whole (${pk} out of ${T}).`,
    strategy: "Use a bar model",
    marks: three ? 2 : 1,
    sig: `whole|${ratKey(parts)}|${k}`,
  };
}

/** Ratio → one part as a fraction of another part. */
function fracOfPart(r: Rng): Draft {
  const [p, q] = pickParts(r, 2, 9).map((x) => x + 1); // no 1s, so the answer is never a whole number
  if (gcd(p, q) !== 1) return fracOfPart(r);
  const style = r.int(0, 3);
  const [A, B] = names(r, 2);
  const letters = style === 2 ? ["x", "y"] : ["a", "b"];
  // top / bottom of the fraction asked for
  const flip = style === 1;
  const [tv, bv] = flip ? [q, p] : [p, q];
  const [top, bot] = style === 3 ? [`${A}'s savings`, `${B}'s savings`] : flip ? [letters[1], letters[0]] : [letters[0], letters[1]];
  if (style >= 2 && p > q) return fracOfPart(r);
  const T = p + q;
  const question =
    style === 3
      ? `The ratio of ${A}'s savings to ${B}'s savings is ${p} : ${q}. ${A}'s savings are what fraction of ${B}'s savings?`
      : style === 2
        ? `x : y = ${p} : ${q}. x is what fraction of y?`
        : `a : b = ${p} : ${q}. What is ${m(`${top}/${bot}`)}?`;
  const slips = numSlips(tv / bv);
  const add = (n: number, d: number, feedback: string) => slips.add(n / d, frRaw(n, d, false), feedback, fracSpec(n, d, { simplest: false }));
  add(bv, tv, `${frRaw(bv, tv, false)} is ${bot} ÷ ${top} — the fraction turned upside down. You want ${top} compared with ${bot}, so ${tv} goes on top.`);
  add(tv, T, `${frRaw(tv, T, false)} is ${top} as a fraction of the **total** (${tv} parts out of ${p} + ${q} = ${T}). The question compares ${top} with ${bot} only.`);
  add(bv, T, `${frRaw(bv, T, false)} is ${bot} as a fraction of the total. You need ${top} compared with ${bot}, which is ${tv} ÷ ${bv}.`);
  return {
    difficulty: "core",
    question,
    prompt: "Give your answer as a fraction in its simplest form.",
    answer: fracSpec(tv, bv),
    display: fr(tv, bv, false),
    correctFeedback: `For every ${tv} of ${top} there are ${bv} of ${bot}, so ${top} is ${m(`${tv}/${bv}`)} of ${bot}.`,
    wrong: slips.list,
    explanation: `The ratio ${p} : ${q} means that for every ${p} of the first there are ${q} of the second. Comparing ${top} with ${bot} gives ${top} ÷ ${bot} = ${m(`${tv}/${bv}`)}. Don't mix this up with a fraction of the total: there are ${p} + ${q} = ${T} parts altogether, so the first is ${m(`${p}/${T}`)} of the total and the second is ${m(`${q}/${T}`)}.`,
    solution: [`${top} is ${partsWord(tv)} and ${bot} is ${partsWord(bv)}.`, `So ${top} ÷ ${bot} = **${m(`${tv}/${bv}`)}**.`],
    hints: [`The ratio says that for every ${p} of the first there are ${q} of the second. Which number goes with ${top}?`, `You are comparing ${top} with ${bot} — not with the total.`],
    verify: `${tv}/${bv}`,
    commonError: `Mixing up part : part with part : whole (writing ${m(`${tv}/${T}`)}), or turning the fraction upside down.`,
    strategy: "Use a bar model",
    marks: 2,
    sig: `part|${p}:${q}|${flip ? "b/a" : "a/b"}`,
  };
}

/** Back the other way: a fraction of the whole and the size of one group → the other group. */
function fracBack(r: Rng): Draft {
  let n = 1;
  let d = 3;
  do {
    d = r.int(5, 10);
    n = r.int(1, d - 1);
  } while (gcd(n, d) !== 1 || 2 * n === d || n < 2 || d - n < 2);
  const j = r.int(1, d <= 5 ? 3 : 2);
  const u = d * j; // keeps every slip a whole number
  const ctx = r.pick(BACK_CTX);
  const [ga, gb] = ctx.groups;
  const A = n * u;
  const B = (d - n) * u;
  const total = d * u;
  const fromB = r.chance(0.5); // told B (the rest), asked A — or told A, asked B
  const ans = fromB ? A : B;
  const label = (g: string) => (ctx.groups[0] === "red" ? `${g} counters` : ctx.groups[0] === "non-fiction" ? `${g} books` : g);
  const frac = m(`${n}/${d}`);
  const slips = numSlips(ans);
  if (fromB) {
    slips.add((B * n) / d, num((B * n) / d), `${num((B * n) / d)} is ${frac} of the ${B} ${label(gb)}. But ${frac} is a fraction of the **whole** group, so ${label(ga)} : ${label(gb)} = ${n} : ${d - n}, not ${n} : ${d}.`);
  } else {
    slips.add((A * (d - n)) / d, num((A * (d - n)) / d), `${num((A * (d - n)) / d)} is ${m(`${d - n}/${d}`)} of the ${A} ${label(ga)}. ${m(`${d - n}/${d}`)} is a fraction of the whole group, not of the ${label(ga)} — use the ratio ${n} : ${d - n} instead.`);
  }
  slips.add(total, num(total), `${total} is the **whole** group (${d} parts). ${frac} means ${n} out of every ${d} are ${label(ga)}, so the ${label(gb)} are the other ${d - n} parts — the question asks for the ${label(fromB ? ga : gb)} only.`);
  slips.add(u, num(u), `${u} is just one part (${fromB ? B : A} ÷ ${fromB ? d - n : n}). The ${label(fromB ? ga : gb)} are ${partsWord(fromB ? n : d - n)}, so multiply by ${fromB ? n : d - n}.`);
  const given = fromB ? `There are ${B} ${label(gb)}.` : `There are ${A} ${label(ga)}.`;
  const challenge = total > 100;
  return {
    difficulty: challenge ? "challenge" : "core",
    question: `${frac} of ${ctx.place} are ${ga} and the rest are ${gb}. ${given} How many ${label(fromB ? ga : gb)} are there?`,
    prompt: undefined,
    answer: numSpec(ans),
    display: num(ans),
    correctFeedback: `${label(ga)} : ${label(gb)} = ${n} : ${d - n}, so 1 part = ${u} and the ${label(fromB ? ga : gb)} are ${fromB ? n : d - n} × ${u} = ${ans}.`,
    wrong: slips.list,
    explanation: `${frac} are ${ga}, so the other ${m(`${d - n}/${d}`)} are ${gb}: out of every ${d}, ${n} are ${ga} and ${d - n} are ${gb}. So ${label(ga)} : ${label(gb)} = ${n} : ${d - n}. The ${fromB ? `${B} ${label(gb)} are ${partsWord(d - n)}` : `${A} ${label(ga)} are ${partsWord(n)}`}, so 1 part = ${fromB ? B : A} ÷ ${fromB ? d - n : n} = ${u}, and the ${label(fromB ? ga : gb)} are ${fromB ? n : d - n} × ${u} = ${ans}. Check: ${A} out of ${A} + ${B} = ${total} is ${m(`${A}/${total}`)} = ${frac} ✓.`,
    solution: [
      `${frac} are ${ga}, so ${m(`${d - n}/${d}`)} are ${gb}. That makes ${label(ga)} : ${label(gb)} = ${n} : ${d - n}.`,
      `${fromB ? `${d - n} parts = ${B}` : `${n} part${n === 1 ? "" : "s"} = ${A}`}, so 1 part = ${u}.`,
      `${cap(label(fromB ? ga : gb))}: ${fromB ? n : d - n} × ${u} = **${ans}**.`,
      `Check: ${m(`${A}/${total}`)} = ${frac} ✓`,
    ],
    hints: [`If ${frac} are ${ga}, what fraction are ${gb}? Write ${label(ga)} : ${label(gb)} as a ratio.`, `Use the ${fromB ? B : A} ${label(fromB ? gb : ga)} to find what one part is worth.`],
    verify: fromB ? `${B}/(${d}-${n})*${n}` : `${A}/${n}*(${d}-${n})`,
    commonError: `Treating ${frac} as the ratio ${label(ga)} : ${label(gb)} = ${n} : ${d}. The ${d} is the whole group, so the ${label(gb)} are ${d} − ${n} = ${d - n} parts.`,
    strategy: "Use a bar model",
    marks: challenge ? 3 : 2,
    sig: `back|${n}/${d}|${fromB ? `b=${B}` : `a=${A}`}`,
  };
}

const raFraction: Generator = {
  id: "ra-fraction",
  topic: "ra",
  section: "ra-proportion",
  label: "Link ratios and fractions (part : whole and part : part)",
  kinds: ["mcq", "qa"],
  make(r) {
    const x = r.next();
    let d = x < 0.5 ? fracOfWhole(r) : x < 0.75 ? fracOfPart(r) : fracBack(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = x < 0.5 ? fracOfWhole(r) : x < 0.75 ? fracOfPart(r) : fracBack(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-combine — combine a : b and b : c into a : b : c (or a : c)
// ---------------------------------------------------------------------------

const COMBINE_CTX: { labels: [string, string, string]; intro: (ab: string, bc: string) => string }[] = [
  { labels: ["a", "b", "c"], intro: (ab, bc) => `a : b = ${ab} and b : c = ${bc}.` },
  { labels: ["red", "blue", "green"], intro: (ab, bc) => `In a bag of balloons, red : blue = ${ab} and blue : green = ${bc}.` },
  { labels: ["juniors", "seniors", "veterans"], intro: (ab, bc) => `In a swimming club, juniors : seniors = ${ab} and seniors : veterans = ${bc}.` },
  { labels: ["apples", "pears", "plums"], intro: (ab, bc) => `In a fruit bowl, apples : pears = ${ab} and pears : plums = ${bc}.` },
  { labels: ["flour", "sugar", "butter"], intro: (ab, bc) => `In a biscuit recipe, flour : sugar = ${ab} and sugar : butter = ${bc} by weight.` },
  { labels: ["strings", "brass", "percussion"], intro: (ab, bc) => `In a school orchestra, strings : brass = ${ab} and brass : percussion = ${bc}.` },
];

function combineDraft(r: Rng): Draft {
  let p = 1, q = 1, b2 = 1, s = 1;
  do {
    [p, q] = pickParts(r, 2, 9);
    [b2, s] = pickParts(r, 2, 9);
  } while (q === b2 || lcm(q, b2) > 30 || Math.max(p * (lcm(q, b2) / q), s * (lcm(q, b2) / b2)) > 60);
  const L = lcm(q, b2);
  const m1 = L / q;
  const m2 = L / b2;
  const abc = [p * m1, L, s * m2];
  const askAC = r.chance(0.25);
  const ans = askAC ? lowest([abc[0], abc[2]]) : abc;
  const ctx = r.pick(COMBINE_CTX);
  const [A, B, C] = ctx.labels;
  const want = askAC ? `${A} : ${C}` : `${A} : ${B} : ${C}`;
  // a wrong three-part answer, cut down to a : c when that is what's asked
  const pick3 = (x: number[]) => (askAC ? [x[0], x[2]] : x);

  // "the blue part", "the b part", "the seniors part"
  const bp = `the ${B} part`;
  const slips = ratioSlips(ans);
  slips.add(pick3([p, q, s]), `${rat(pick3([p, q, s]))} just joins the two ratios together. But ${bp} is ${q} in one ratio and ${b2} in the other, so the parts are different sizes — make ${bp} equal first.`);
  slips.add(pick3([p, b2, s]), `${rat(pick3([p, b2, s]))} joins the ratios without making ${bp} match: it is ${q} in ${A} : ${B} but ${b2} in ${B} : ${C}. Use the LCM of ${q} and ${b2}, which is ${L}.`);
  if (m1 !== 1) slips.add(pick3([p, L, s * m2]), `${rat(pick3([p, L, s * m2]))} scales ${B} : ${C} up to ${L} : ${s * m2} but leaves ${A} : ${B} as ${p} : ${q}. If ${bp} becomes ${L}, ${A} must be multiplied by ${m1} as well.`);
  if (m2 !== 1) slips.add(pick3([p * m1, L, s]), `${rat(pick3([p * m1, L, s]))} scales ${A} : ${B} up to ${p * m1} : ${L} but leaves ${B} : ${C} as ${b2} : ${s}. If ${bp} becomes ${L}, ${C} must be multiplied by ${m2} as well.`);
  if (m1 !== 1 && m2 !== 1) slips.add(pick3([p * m2, q * m2, s * m1]), `${rat(pick3([p * m2, q * m2, s * m1]))} uses the multipliers the wrong way round: ${p} : ${q} × ${m2} makes ${bp} ${q * m2}, but ${b2} : ${s} × ${m1} makes it ${b2 * m1}. Multiply the first ratio by ${m1} and the second by ${m2}, so ${bp} is ${L} in both.`);
  const gap = Math.abs(q - b2);
  const added = q > b2 ? [p, q, s + gap] : [p + gap, b2, s];
  slips.add(pick3(added), `${rat(pick3(added))} comes from adding ${gap} to both parts of ${q > b2 ? `${B} : ${C}` : `${A} : ${B}`} to make ${bp} match. Adding the same number changes a ratio — multiply both parts by the same number instead.`);

  const scale = (x: number, y: number, k: number) => (k === 1 ? `${x} : ${y} (already ${L})` : `${x} : ${y} = ${x * k} : ${y * k} (× ${k})`);
  const acNote = askAC ? ` So ${A} : ${C} = ${abc[0]} : ${abc[2]}${ans[0] !== abc[0] ? ` = ${rat(ans)} (dividing both by ${abc[0] / ans[0]})` : ""}.` : "";
  const hard = askAC || (m1 !== 1 && m2 !== 1 && L >= 12);
  const checks = [
    ...(m1 !== 1 ? [`${abc[0]} : ${L} simplifies to ${p} : ${q}`] : []),
    ...(m2 !== 1 ? [`${L} : ${abc[2]} simplifies to ${b2} : ${s}`] : []),
  ];
  const shared = `The two ratios share ${B}: ${bp} is ${q} in ${A} : ${B} and ${b2} in ${B} : ${C}.`;
  return {
    difficulty: hard ? "challenge" : "core",
    question: `${ctx.intro(rat([p, q]), rat([b2, s]))} Write ${want} in its simplest form.`,
    prompt: "Type the ratio with colons between the parts.",
    answer: { type: "ratio", parts: ans, simplest: true },
    display: rat(ans),
    correctFeedback: `Making ${bp} ${L} in both ratios gives ${rat([abc[0], L])} and ${rat([L, abc[2]])}, so ${A} : ${B} : ${C} = ${rat(abc)}.${acNote}`,
    wrong: slips.list,
    explanation: `${shared} Make it the same in both: the LCM of ${q} and ${b2} is ${L}, so ${A} : ${B} = ${scale(p, q, m1)} and ${B} : ${C} = ${scale(b2, s, m2)}. Now ${bp} is ${L} in both, so ${A} : ${B} : ${C} = ${rat(abc)}.${acNote} Check: ${andList(checks)} ✓.`,
    solution: [
      `${shared} The LCM of ${q} and ${b2} is ${L}.`,
      `${A} : ${B} = ${scale(p, q, m1)}.`,
      `${B} : ${C} = ${scale(b2, s, m2)}.`,
      askAC ? `${A} : ${B} : ${C} = ${rat(abc)}, so ${A} : ${C} = **${rat(ans)}**.` : `So ${A} : ${B} : ${C} = **${rat(abc)}**.`,
    ],
    hints: [`In one ratio ${bp} is ${q}, and in the other it is ${b2}. What is the smallest number that both ${q} and ${b2} go into?`, `Rewrite both ratios so that ${bp} is that number, then put them together.`],
    verify: askAC ? `${p}*${b2}:${q}*${s}` : `${p}*${b2}:${q}*${b2}:${q}*${s}`,
    commonError: `Joining the ratios as ${p} : ${q} : ${s} without first making ${bp} the same in both.`,
    strategy: "Make the shared part equal",
    marks: hard ? 3 : 2,
    sig: `${p}:${q}|${b2}:${s}|${askAC ? "ac" : "abc"}`,
  };
}

const raCombine: Generator = {
  id: "ra-combine",
  topic: "ra",
  section: "ra-proportion",
  label: "Combine a : b and b : c into a : b : c",
  kinds: ["qa"],
  make: combineDraft,
};

// ---------------------------------------------------------------------------
// ra-recipe — direct proportion: a recipe for n people, the cost of k items
// ---------------------------------------------------------------------------

interface Ingredient {
  dish: string;
  what: string;
  unit: "g" | "ml" | "";
  step: number;
  max: number;
  /** a realistic amount for one person */
  per: [number, number];
}

const INGREDIENTS: Ingredient[] = [
  { dish: "dal", what: "lentils", unit: "g", step: 25, max: 900, per: [40, 100] },
  { dish: "pancakes", what: "flour", unit: "g", step: 25, max: 600, per: [25, 75] },
  { dish: "pancakes", what: "milk", unit: "ml", step: 50, max: 1000, per: [50, 150] },
  { dish: "vegetable curry", what: "coconut milk", unit: "ml", step: 50, max: 1000, per: [40, 120] },
  { dish: "pasta bake", what: "pasta", unit: "g", step: 25, max: 1000, per: [60, 125] },
  { dish: "flapjacks", what: "oats", unit: "g", step: 25, max: 600, per: [25, 75] },
  { dish: "paneer tikka", what: "paneer", unit: "g", step: 25, max: 1000, per: [50, 125] },
  { dish: "vegetable risotto", what: "rice", unit: "g", step: 25, max: 800, per: [50, 100] },
  { dish: "fruit smoothies", what: "bananas", unit: "", step: 1, max: 12, per: [0.5, 2] },
  { dish: "tomato soup", what: "tomatoes", unit: "", step: 1, max: 15, per: [1, 3] },
  { dish: "lemonade", what: "lemons", unit: "", step: 1, max: 9, per: [0.5, 1.5] },
];

/** [one, many, cheapest and dearest believable price of one] */
const ITEMS: [string, string, number, number][] = [
  ["pen", "pens", 0.5, 3],
  ["notebook", "notebooks", 1, 5],
  ["bus ticket", "bus tickets", 1.5, 4],
  ["packet of seeds", "packets of seeds", 1, 3],
  ["mango", "mangoes", 0.5, 2],
  ["glue stick", "glue sticks", 0.5, 2.5],
];

function recipeDraft(r: Rng): Draft {
  const cost = r.chance(0.35);
  const ing = r.pick(INGREDIENTS);
  const [item, items, lo, hi] = r.pick(ITEMS);
  const cur: Cur = r.pick(["£", "$"]);
  let P = 4, R = 6, Q = 300;
  for (let t = 0; t < 500; t++) {
    P = cost ? r.int(2, 8) : r.pick([2, 3, 4, 5, 6, 8, 10]);
    R = r.int(2, cost ? 15 : 20);
    Q = cost ? tidy(r.int(lo * 4, hi * 4) * 0.25 * P) : ing.step * r.int(1, Math.floor(ing.max / ing.step));
    const per = Q / P;
    // per-person amounts must be believable, and exactly 1 each would make adding and scaling agree
    const ok = cost ? hasDp(per, 2) && Q <= 60 && per !== 1 : (ing.unit ? hasDp(per, 1) : hasDp(per, 2)) && per >= ing.per[0] && per <= ing.per[1] && per !== 1;
    if (R !== P && ok && isWhole((Q * R) / P)) break;
  }
  const A = tidy((Q * R) / P);
  const per = tidy(Q / P);
  const f = (x: number) => (cost ? cash(x, cur) : ing.unit ? `${num(x)} ${ing.unit}` : num(x));
  const count = !cost && !ing.unit;
  const who = cost ? items : "people";
  const one = cost ? item : "person";
  const up = R > P;
  const gap = Math.abs(R - P);
  const nice = (x: number) => (cost ? hasDp(x, 2) : ing.unit ? hasDp(x, 1) : isWhole(x));

  const slips = numSlips(A);
  // 1. multiplied by the new number straight away
  slips.add(tidy(Q * R), f(tidy(Q * R)), cost
    ? `${f(tidy(Q * R))} is ${f(Q)} for **each** of the ${R} ${items}. ${f(Q)} is what ${P} ${items} cost together, so find the cost of 1 ${item} first.`
    : `${f(tidy(Q * R))} is ${f(Q)} for **each** of the ${R} people. The ${f(Q)} already feeds ${P} people, so find the amount for 1 person first.`);
  // 2. scaled the wrong way
  const wrongWay = tidy((Q * P) / R);
  const moreLess = cost ? (up ? `More ${who} cost more` : `Fewer ${who} cost less`) : up ? "More people need more" : "Fewer people need less";
  if (nice(wrongWay)) slips.add(wrongWay, f(wrongWay), `${f(wrongWay)} comes from multiplying by ${m(`${P}/${R}`)} instead of ${m(`${R}/${P}`)}. ${moreLess}, so the answer must be ${up ? "more" : "less"} than ${f(Q)}.`);
  // 3. stopped at one
  const amountFor = cost ? "the cost of" : "the amount for";
  if (nice(per)) slips.add(per, f(per), `${f(per)} is ${amountFor} **one** ${one}. Multiply by ${R} to get ${amountFor} ${R} ${who}.`);
  // 4. only the change
  const change = tidy((gap * Q) / P);
  const gapWho = `${gap} ${gap === 1 ? one : who}`;
  if (nice(change) && change !== Q) slips.add(change, f(change), up
    ? `${f(change)} is only ${amountFor} the ${gap} extra ${gap === 1 ? one : who}. Add it on to the ${f(Q)} for the first ${P}.`
    : `${f(change)} is ${amountFor} the ${gapWho} ${cost ? "you aren't buying" : "who aren't eating"}. Take it away from ${f(Q)} to get the answer.`);
  // 5. adding the difference instead of scaling (only believable for small counts and prices)
  if (count || cost) {
    const v = tidy(Q + (R - P));
    slips.add(v, f(v), `${f(v)} comes from ${up ? "adding" : "taking away"} ${cost ? f(gap) : gap} because there ${gap === 1 ? "is" : "are"} ${gap} ${up ? "more" : "fewer"} ${gap === 1 ? one : who}. Amounts in proportion are **scaled** (multiplied by the same number), not changed by adding or taking away the difference.`);
  }

  const amountText = count ? `${Q} ${ing.what}` : cost ? f(Q) : `${f(Q)} of ${ing.what}`;
  const question = cost
    ? `${P} ${items} cost ${f(Q)}. How much do ${R} ${items} cost?`
    : `A recipe for ${ing.dish} for ${P} people uses ${amountText}. How ${ing.unit === "g" ? `many grams of ${ing.what} are` : ing.unit === "ml" ? `many millilitres of ${ing.what} are` : `many ${ing.what} are`} needed for ${R} people?`;
  const scaleWhole = isWhole(R / P) || isWhole(P / R);
  const difficulty: Draft["difficulty"] = scaleWhole ? "warmup" : !isWhole(per) ? "challenge" : "core";
  const firstStep = cost ? `Find the cost of 1 ${item} first: ${f(Q)} ÷ ${P} = ${f(per)}.` : `Find the amount for 1 person first: ${f(Q)} ÷ ${P} = ${f(per)}.`;
  const secondStep = `For ${R} ${who}: ${f(per)} × ${R} = ${f(A)}.`;
  return {
    difficulty,
    question,
    prompt: cost ? `Give your answer in ${cur}.` : ing.unit === "g" ? "Give your answer in grams." : ing.unit === "ml" ? "Give your answer in millilitres." : undefined,
    answer: numSpec(A, f(A)),
    display: f(A),
    correctFeedback: `${cost ? `1 ${item} costs` : "1 person needs"} ${f(Q)} ÷ ${P} = ${f(per)}, so ${R} ${who} ${cost ? "cost" : "need"} ${R} × ${f(per)} = ${f(A)}.`,
    wrong: slips.list,
    explanation: `${firstStep} ${secondStep} Another way: ${R} ${who} is ${m(`${R}/${P}`)} times as many as ${P}, and ${f(Q)} × ${m(`${R}/${P}`)} = ${f(A)}. Sense check: ${up ? "more" : "fewer"} ${who} ${cost ? (up ? "cost more" : "cost less") : up ? "need more" : "need less"}, so the answer should be ${up ? "bigger" : "smaller"} than ${f(Q)} ✓.`,
    solution: [firstStep, `${secondStep.replace(f(A), `**${f(A)}**`)}`, `Check: ${up ? "more" : "fewer"} ${who}, so ${up ? "more" : "less"} than ${f(Q)} ✓`],
    hints: [cost ? `How much does 1 ${item} cost?` : `How much ${count ? `of the ${ing.what}` : ing.what} does 1 person need?`, `Multiply the amount for one ${one} by ${R} — or scale ${f(Q)} by ${m(`${R}/${P}`)}.`],
    verify: `${Q}/${P}*${R}`,
    commonError: cost
      ? `Multiplying ${f(Q)} by ${R} as if it were the price of one ${item} — it is the price of ${P} ${items}, so divide by ${P} first.`
      : `Multiplying ${f(Q)} by ${R} as if it fed one person, or adding the extra people on instead of scaling the whole recipe.`,
    strategy: "Use the multiplier",
    marks: difficulty === "warmup" ? 1 : 2,
    sig: `${Q}/${P}*${R}`,
  };
}

const raRecipe: Generator = {
  id: "ra-recipe",
  topic: "ra",
  section: "ra-proportion",
  label: "Direct proportion: recipes and costs",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = recipeDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = recipeDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-inverse — inverse proportion: more workers (or a faster speed) means less time
// ---------------------------------------------------------------------------

type TimeUnit = "hour" | "minute" | "day";
/** "1 hour", "6 hours", "40 minutes" */
const tm = (x: number, unit: TimeUnit) => `${num(x)} ${unit}${x === 1 ? "" : "s"}`;
/** 45 → "45 minutes", 60 → "1 hour", 90 → "1 hour 30 minutes" */
function minutesText(x: number): string {
  const h = Math.floor(x / 60);
  const mins = x % 60;
  if (!h) return tm(mins, "minute");
  return mins ? `${tm(h, "hour")} ${tm(mins, "minute")}` : tm(h, "hour");
}

interface CrewCtx {
  one: string;
  many: string;
  task: string;
  unit: TimeUnit;
  /** the starting time */
  time: [number, number];
  step: number;
}

const CREWS: CrewCtx[] = [
  { one: "volunteer", many: "volunteers", task: "sort the books for a school book sale", unit: "hour", time: [2, 12], step: 1 },
  { one: "painter", many: "painters", task: "paint the school hall", unit: "day", time: [2, 12], step: 1 },
  { one: "builder", many: "builders", task: "build a garden wall", unit: "day", time: [2, 15], step: 1 },
  { one: "tap", many: "taps", task: "fill a paddling pool", unit: "minute", time: [10, 90], step: 5 },
  { one: "printer", many: "printers", task: "print the school magazine", unit: "minute", time: [10, 90], step: 5 },
  { one: "machine", many: "machines", task: "pack a day's orders at a fruit farm", unit: "hour", time: [2, 12], step: 1 },
  { one: "pupil", many: "pupils", task: "pick up the litter on the school field", unit: "minute", time: [10, 60], step: 5 },
];

function crewDraft(r: Rng): Draft {
  const c = r.pick(CREWS);
  let W1 = 4, W2 = 3, T1 = 6;
  for (let t = 0; t < 500; t++) {
    W1 = r.int(2, 8);
    W2 = r.int(2, 10);
    T1 = c.step * r.int(Math.ceil(c.time[0] / c.step), Math.floor(c.time[1] / c.step));
    const easy = W1 % W2 === 0 || W2 % W1 === 0;
    if (easy && r.chance(0.6)) continue;
    if (W1 !== W2 && isWhole((W1 * T1) / W2) && (W1 * T1) / W2 >= (c.unit === "minute" ? 5 : 1)) break;
  }
  const work = W1 * T1;
  const T2 = work / W2;
  const fewer = W2 < W1;
  const f = (x: number) => tm(x, c.unit);
  const workUnit = `${c.one}-${c.unit}s`;
  const slips = numSlips(T2);
  const direct = tidy((T1 * W2) / W1);
  if (c.unit === "minute" ? isWhole(direct) : hasDp(direct, 1)) {
    slips.add(direct, f(direct), `${f(direct)} treats this as direct proportion (${T1} × ${m(`${W2}/${W1}`)}). ${fewer ? "Fewer" : "More"} ${c.many} take ${fewer ? "**longer**" : "**less** time"}, so the answer must be ${fewer ? "more" : "less"} than ${f(T1)}.`);
  }
  const gap = Math.abs(W1 - W2);
  const added = fewer ? T1 + gap : T1 - gap;
  slips.add(added, f(added), `${f(added)} ${fewer ? "adds" : "takes off"} one ${c.unit} for each ${fewer ? "missing" : "extra"} ${c.one}. The time depends on how the work is shared out, so multiply and divide — don't add or take away.`);
  slips.add(work, f(work), `${f(work)} is the whole job done by **one** ${c.one} (${W1} × ${T1} = ${work} ${workUnit}). It still has to be shared between the ${W2} ${c.many}.`);

  return {
    difficulty: "core",
    question: `It takes ${W1} ${c.many} ${f(T1)} to ${c.task}. How long would it take ${W2} ${c.many} working at the same rate?`,
    prompt: `Give your answer in ${c.unit}s.`,
    answer: numSpec(T2, f(T2)),
    display: f(T2),
    correctFeedback: `The job is ${W1} × ${T1} = ${work} ${workUnit} of work, and ${work} ÷ ${W2} = ${num(T2)}.`,
    wrong: slips.list,
    explanation: `Work out the size of the whole job first: ${W1} ${c.many} for ${f(T1)} is ${W1} × ${T1} = ${work} ${workUnit} of work. Shared between ${W2} ${c.many}, it takes ${work} ÷ ${W2} = ${f(T2)}. This is **inverse** proportion: ${fewer ? "fewer" : "more"} ${c.many} means ${fewer ? "more" : "less"} time, so the answer must be ${fewer ? "more" : "less"} than ${f(T1)} ✓.`,
    solution: [
      `Whole job: ${W1} × ${T1} = ${work} ${workUnit}.`,
      `${W2} ${c.many}: ${work} ÷ ${W2} = **${f(T2)}**.`,
      `Check: ${W2} × ${num(T2)} = ${work} ${workUnit}, the same job ✓`,
    ],
    hints: [`Will ${W2} ${c.many} take more time or less time than ${W1} ${c.many}?`, `How many ${workUnit} of work is the whole job? Share that between the ${W2} ${c.many}.`],
    verify: `${W1}*${T1}/${W2}`,
    commonError: `Treating it as direct proportion (${T1} × ${m(`${W2}/${W1}`)}). ${fewer ? "Fewer" : "More"} ${c.many} take ${fewer ? "longer" : "less time"}, so scale the inverse way.`,
    strategy: "Estimate first",
    marks: 2,
    sig: `crew|${W1}x${T1}${c.unit}->${W2}`,
  };
}

interface TripCtx {
  /** speed range in km/h */
  speed: [number, number];
  /** the way back must be faster (running downhill) */
  faster: boolean;
  stem: (name: string, s1: number, t1: string, s2: number) => string;
}

const TRIPS: TripCtx[] = [
  { speed: [6, 15], faster: true, stem: (n, s1, t1, s2) => `${n} runs up a hill path at ${s1} km/h, and it takes ${t1}. ${n} then runs back down the same path at ${s2} km/h. How long does it take to run down?` },
  { speed: [10, 24], faster: false, stem: (n, s1, t1, s2) => `${n} cycles to the library at ${s1} km/h, and the journey takes ${t1}. On the way home ${n} cycles along the same route at ${s2} km/h. How long does the journey home take?` },
  { speed: [3, 6], faster: false, stem: (n, s1, t1, s2) => `${n} walks to the park at ${s1} km/h, and it takes ${t1}. ${n} walks back along the same route at ${s2} km/h. How long does the walk back take?` },
  { speed: [30, 72], faster: false, stem: (_n, s1, t1, s2) => `A bus travels between two towns at an average speed of ${s1} km/h and takes ${t1}. On the way back it averages ${s2} km/h. How long does the journey back take?` },
];

function tripDraft(r: Rng): Draft {
  const c = r.pick(TRIPS);
  const [name] = names(r, 1);
  let S1 = 8, S2 = 12, T1 = 60;
  for (let t = 0; t < 500; t++) {
    S1 = r.int(c.speed[0], c.speed[1]);
    S2 = r.int(c.speed[0], c.speed[1]);
    T1 = r.pick([20, 24, 30, 36, 40, 45, 48, 60, 60, 60, 72, 75, 80, 90, 120]);
    if (S1 !== S2 && (!c.faster || S2 > S1) && isWhole((T1 * S1) / S2) && hasDp((S1 * T1) / 60, 1)) break;
  }
  const T2 = (T1 * S1) / S2;
  const d = tidy((S1 * T1) / 60);
  const faster = S2 > S1;
  const f = (x: number) => tm(x, "minute");
  const slips = numSlips(T2);
  const direct = tidy((T1 * S2) / S1);
  if (hasDp(direct, 1)) slips.add(direct, f(direct), `${f(direct)} comes from multiplying by ${m(`${S2}/${S1}`)} — scaling the direct way. ${faster ? "Going faster over the same distance takes **less** time" : "Going slower over the same distance takes **more** time"}, so multiply by ${m(`${S1}/${S2}`)} instead.`);
  const h = T2 / 60;
  if (!isWhole(h)) {
    const whole = Math.floor(h);
    const dec = Math.round((h - whole) * 100);
    const v = whole * 60 + dec;
    const hText = num(Number(h.toFixed(2)));
    slips.add(v, f(v), `${f(v)} comes from reading ${hText} hours as ${whole ? `${tm(whole, "hour")} ` : ""}${dec} minutes. The decimal part is a fraction of an **hour** (60 minutes), not of 100 minutes: ${fr(T2, 60)} of an hour is ${f(T2)}.`);
  }
  const gap = Math.abs(S2 - S1);
  const added = faster ? T1 - gap : T1 + gap;
  if (gap <= 10) slips.add(added, f(added), `${f(added)} ${faster ? "takes off" : "adds"} one minute for each km/h ${faster ? "faster" : "slower"}. Speed and time are in inverse proportion, so multiply by ${m(`${S1}/${S2}`)} — don't add or take away.`);
  if (isWhole(d)) slips.add(d, f(d), `${d} is the **distance** in km (${S1} km/h for ${minutesText(T1)}), not the time. Now divide the ${d} km by the new speed, ${S2} km/h.`);

  const t1 = minutesText(T1);
  // the time in hours: 2, or {{1 1/5}}
  const hrs = T1 % 60 === 0 ? String(T1 / 60) : fr(T1, 60);
  const core = T1 % 60 === 0;
  return {
    difficulty: core ? "core" : "challenge",
    question: c.stem(name, S1, t1, S2),
    prompt: "Give your answer in minutes.",
    answer: numSpec(T2, f(T2)),
    display: f(T2),
    correctFeedback: `The route is ${num(d)} km, and ${num(d)} ÷ ${S2} = ${fr(T2, 60)} of an hour, which is ${f(T2)}.`,
    wrong: slips.list,
    explanation: `Find the distance first: ${S1} km/h for ${t1} is ${S1} × ${hrs} = ${num(d)} km. At ${S2} km/h the same ${num(d)} km takes ${num(d)} ÷ ${S2} = ${fr(T2, 60)} of an hour, which is ${f(T2)}. Ratio view: speed and time are in **inverse** proportion, so the time is multiplied by ${m(`${S1}/${S2}`)}: ${T1} × ${m(`${S1}/${S2}`)} = ${num(T2)} minutes. Check: ${faster ? "faster" : "slower"} means ${faster ? "less" : "more"} time than ${t1} ✓.`,
    solution: [
      `Distance = speed × time = ${S1} × ${hrs} = ${num(d)} km.`,
      `Time back = distance ÷ speed = ${num(d)} ÷ ${S2} = ${fr(T2, 60)} of an hour.`,
      `${fr(T2, 60)} × 60 = **${f(T2)}**.`,
      `Check: ${faster ? "faster" : "slower"}, so ${faster ? "less" : "more"} than ${t1} ✓`,
    ],
    hints: [`How long is the route? Use distance = speed × time${T1 % 60 ? ` (careful: ${t1} is ${hrs} of an hour)` : ""}.`, "Divide the distance by the new speed, then change the hours into minutes."],
    verify: `${T1}*${S1}/${S2}`,
    commonError: `Scaling the direct way (× ${m(`${S2}/${S1}`)}), or reading a decimal of an hour as minutes.`,
    strategy: "Draw a diagram",
    marks: core ? 2 : 3,
    sig: `trip|${S1}:${T1}->${S2}`,
  };
}

const raInverse: Generator = {
  id: "ra-inverse",
  topic: "ra",
  section: "ra-problems",
  label: "Inverse proportion: workers and time, speed and time",
  kinds: ["mcq", "qa"],
  make(r) {
    const trip = r.chance(0.4);
    let d = trip ? tripDraft(r) : crewDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = trip ? tripDraft(r) : crewDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-mix-fix — a mix made in the wrong ratio: how much more of one ingredient puts it right?
// ---------------------------------------------------------------------------

interface MixCtx {
  a: string;
  b: string;
  make: string;
  unit: "litre" | "ml" | "kg";
  /** the first ingredient is always the smaller part (squash : water, cement : sand) */
  aSmaller?: boolean;
  /** "the right shade" / "the right mix" */
  fix: string;
}

const MIXES: MixCtx[] = [
  { a: "red paint", b: "blue paint", make: "a shade of purple", unit: "litre", fix: "shade" },
  { a: "blue paint", b: "yellow paint", make: "a shade of green", unit: "litre", fix: "shade" },
  { a: "white paint", b: "red paint", make: "a shade of pink", unit: "litre", fix: "shade" },
  { a: "orange squash", b: "water", make: "a jug of orange drink", unit: "ml", fix: "strength", aSmaller: true },
  { a: "mango juice", b: "lemonade", make: "fruit punch", unit: "ml", fix: "mix" },
  { a: "cement", b: "sand", make: "mortar for a garden wall", unit: "kg", fix: "mix", aSmaller: true },
];

function mixFixDraft(r: Rng): Draft {
  const c = r.pick(MIXES);
  const [name] = names(r, 1);
  const ml = c.unit === "ml";
  let [p, q] = pickParts(r, 2, ml ? 6 : 5);
  if (c.aSmaller && p > q) [p, q] = [q, p];
  const u = ml ? r.pick([20, 25, 40, 50]) : r.int(1, 5);
  // which ingredient is already the right amount (F) and which one is short (G)
  const fixA = r.chance(0.5);
  const [pF, pG] = fixA ? [p, q] : [q, p];
  const [F, G] = fixA ? [c.a, c.b] : [c.b, c.a];
  const fx = pF * u;
  const need = pG * u;
  const step = ml ? 5 : 1;
  // a near miss: at least half of the right amount is already in
  const add = step * r.int(1, Math.max(1, Math.floor(need / 2 / step)));
  const g = need - add;
  if (g <= 0) return mixFixDraft(r);
  const amtA = fixA ? fx : g;
  const amtB = fixA ? g : fx;
  const f = (x: number) => qty(x, c.unit);

  const slips = numSlips(add, true);
  slips.add(need, f(need), `${f(need)} is the **total** amount of ${G} needed. ${name} has already put in ${f(g)}, so only the rest has to be added.`);
  if (!ml) {
    const v = fx + (pG - pF) - g;
    slips.add(v, f(v), `${f(v)} comes from thinking the ${G} should be ${f(Math.abs(pG - pF))} ${pG > pF ? "more" : "less"} than the ${F}, because ${pG} is ${Math.abs(pG - pF)} ${pG > pF ? "more" : "less"} than ${pF}. Ratios work by multiplying: ${f(fx)} of ${F} is ${partsWord(pF)}, so the ${G} must be ${partsWord(pG)}.`);
  }
  slips.add(need - fx, f(need - fx), `${f(need - fx)} is ${f(need)} − ${f(fx)}, taking away the ${F}. Compare the ${f(need)} of ${G} needed with the ${f(g)} of ${G} already in the mix.`);
  if (pF !== 1) slips.add(u, f(u), `${f(u)} is just one part (${f(fx)} ÷ ${pF}). The ${G} needs ${pG} parts = ${f(need)} altogether, and ${f(g)} is already there.`);

  const check = `${rat([amtA + (fixA ? 0 : add), amtB + (fixA ? add : 0)])}`;
  return {
    difficulty: "core",
    question: `To make ${c.make}, ${name} mixes ${c.a} and ${c.b} in the ratio ${p} : ${q}. ${name} has already mixed ${f(amtA)} of ${c.a} with ${f(amtB)} of ${c.b}. How much more ${G} must ${name} add to get the right ${c.fix}?`,
    prompt: `Give your answer in ${c.unit === "kg" ? "kilograms" : c.unit === "ml" ? "millilitres" : "litres"}.`,
    answer: numSpec(add, f(add)),
    display: f(add),
    correctFeedback: `1 part = ${f(fx)} ÷ ${pF} = ${f(u)}, so the ${G} should be ${pG} × ${f(u)} = ${f(need)}; ${f(need)} − ${f(g)} = ${f(add)}.`,
    wrong: slips.list,
    explanation: `The ${F} is right as it is: ${f(fx)} is ${pF} part${pF === 1 ? "" : "s"}, so 1 part = ${f(fx)} ÷ ${pF} = ${f(u)}. The ${G} should be ${pG} parts = ${pG} × ${f(u)} = ${f(need)}. There is already ${f(g)} of ${G}, so ${name} must add ${f(need)} − ${f(g)} = ${f(add)}. Check: ${c.a} : ${c.b} is then ${check}${u === 1 ? "" : `, which simplifies to ${p} : ${q}`} ✓.`,
    solution: [
      `${cap(F)}: ${pF} part${pF === 1 ? "" : "s"} = ${f(fx)}, so 1 part = ${f(u)}.`,
      `${cap(G)} needed: ${pG} × ${f(u)} = ${f(need)}.`,
      `Add ${f(need)} − ${f(g)} = **${f(add)}**.`,
      `Check: ${check}${u === 1 ? "" : ` simplifies to ${p} : ${q}`} ✓`,
    ],
    hints: [`The ${F} doesn't change. How much is 1 part, if ${f(fx)} of ${F} is ${pF} part${pF === 1 ? "" : "s"}?`, `How much ${G} should there be altogether? Compare that with the ${f(g)} already in the mix.`],
    verify: `${fx}/${pF}*${pG}-${g}`,
    commonError: `Giving the total amount of ${G} needed (${f(need)}) instead of how much more to add, or thinking the amounts must differ by ${Math.abs(pG - pF)} because the ratio numbers do.`,
    strategy: "Use a bar model",
    marks: 2,
    sig: `${p}:${q}|${amtA}:${amtB}|${c.unit}`,
  };
}

const raMixFix: Generator = {
  id: "ra-mix-fix",
  topic: "ra",
  section: "ra-problems",
  label: "Put a mix right: how much more of one ingredient?",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = mixFixDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = mixFixDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-change — a ratio changes when some of one kind are added or taken away
// ---------------------------------------------------------------------------

interface ChangeCtx {
  /** the two groups [one, many], in the order the ratio is written */
  groups: [[string, string], [string, string]];
  intro: string;
  /** [singular, plural] verbs for taking away and for adding */
  out: [string, string];
  into: [string, string];
  all: string;
}

const CHANGE_CTX: ChangeCtx[] = [
  { groups: [["apple", "apples"], ["orange", "oranges"]], intro: "In a fruit bowl", out: ["is eaten", "are eaten"], into: ["is added", "are added"], all: "pieces of fruit" },
  { groups: [["red pen", "red pens"], ["green pen", "green pens"]], intro: "In a box of pens", out: ["is taken out", "are taken out"], into: ["is put in", "are put in"], all: "pens" },
  { groups: [["blue marble", "blue marbles"], ["white marble", "white marbles"]], intro: "In a bag of marbles", out: ["is taken out", "are taken out"], into: ["is put in", "are put in"], all: "marbles" },
  { groups: [["adult", "adults"], ["child", "children"]], intro: "At a party", out: ["goes home", "go home"], into: ["arrives", "arrive"], all: "people" },
];

function changeDraft(r: Rng): Draft {
  const c = r.pick(CHANGE_CTX);
  let a = 3, b = 8, cc = 1, dd = 3, ch = 0, s = 1;
  let oU = 8, nU = 3, L = 24, oX = 9, nX = 8;
  for (let t = 0; t < 1000; t++) {
    [a, b] = pickParts(r, 2, 9);
    cc = r.int(1, 9);
    dd = r.int(1, 9);
    ch = r.int(0, 1);
    s = r.int(2, 6);
    if (gcd(cc, dd) !== 1) continue;
    const old = [a, b];
    const nw = [cc, dd];
    oU = old[1 - ch];
    nU = nw[1 - ch];
    L = lcm(oU, nU);
    oX = (old[ch] * L) / oU;
    nX = (nw[ch] * L) / nU;
    const k = Math.abs(nX - oX) * s;
    if (nX !== oX && k <= 30 && L * s <= 120 && Math.max(oX, nX) * s <= 120 && nX >= 1 && (nX > oX || k * 2 <= oX * s)) break;
  }
  const old = [a, b];
  const nw = [cc, dd];
  const gone = nX < oX;
  const dParts = Math.abs(nX - oX);
  const k = dParts * s;
  const X = c.groups[ch];
  const Yg = c.groups[1 - ch];
  const Y = L * s;
  const X0 = oX * s;
  const X1 = nX * s;
  const ask = r.pick(["y", "x0", "all"] as const);
  const ans = ask === "y" ? Y : ask === "x0" ? X0 : X0 + Y;
  const verb = (gone ? c.out : c.into)[k === 1 ? 0 : 1];
  const what = `${k} ${k === 1 ? X[0] : X[1]}`;
  const g0 = c.groups[0][1];
  const g1 = c.groups[1][1];
  const inOrder = (x: number, y: number) => (ch === 0 ? [x, y] : [y, x]);

  const slips = numSlips(ans);
  // 1. the ratio numbers taken as the real numbers
  const realV = ask === "y" ? oU : ask === "x0" ? old[ch] : a + b;
  const tryX = gone ? old[ch] - k : old[ch] + k;
  const test = tryX <= 0 ? `with only ${old[ch]} ${X[1]} you couldn't take ${k} away` : `that would give ${rat(inOrder(tryX, oU))}, which isn't ${cc} : ${dd}`;
  slips.add(realV, num(realV), `${realV} assumes the ratio numbers are the real numbers (${a} ${a === 1 ? c.groups[0][0] : g0} and ${b} ${b === 1 ? c.groups[1][0] : g1}). Test it: ${test}. The real numbers are a multiple of ${a} : ${b}.`);
  // 2. the wrong group, or the wrong moment
  if (ask === "y") slips.add(X0, num(X0), `${X0} is the number of ${X[1]} at the start. The question asks for the ${Yg[1]}.`);
  if (ask === "x0") slips.add(X1, num(X1), `${X1} is the number of ${X[1]} **after** ${what} ${verb}. The question asks how many there were at the start.`);
  if (ask === "all") slips.add(X1 + Y, num(X1 + Y), `${X1 + Y} is how many ${c.all} there are **after** the change. The question asks about the start.`);
  // 3. the change used as one part
  const kPart = k * realV;
  slips.add(kPart, num(kPart), `${kPart} treats the ${what} as one part of ${a} : ${b}. They are the **change** in the ${X[1]}: match the ${Yg[1]} in both ratios first, then the change is ${dParts} part${dParts === 1 ? "" : "s"}.`);
  // 4. a group instead of the total, or the total instead of a group
  if (ask === "all") slips.add(Y, num(Y), `${Y} is just the ${Yg[1]}. The question asks for all the ${c.all} at the start.`);
  else slips.add(X0 + Y, num(X0 + Y), `${X0 + Y} is all the ${c.all} at the start. The question asks only for the ${ask === "y" ? Yg[1] : X[1]}.`);

  const match = oU === nU ? `The ${Yg[1]} are already ${oU} parts in both ratios.` : `The ${Yg[1]} are ${oU} in ${a} : ${b} and ${nU} in ${cc} : ${dd}; the LCM of ${oU} and ${nU} is ${L}, so write both with ${L} for the ${Yg[1]}: before ${rat(inOrder(oX, L))}, after ${rat(inOrder(nX, L))}.`;
  const answerStep =
    ask === "y" ? `The ${Yg[1]} are ${L} parts: ${L} × ${s} = ${Y}.` : ask === "x0" ? `At the start the ${X[1]} were ${oX} parts: ${oX} × ${s} = ${X0}.` : `At the start there were ${oX} + ${L} = ${oX + L} parts: ${oX + L} × ${s} = ${X0 + Y} ${c.all}.`;
  const base = `${k}/(${gone ? `${old[ch]}/${oU}-${nw[ch]}/${nU}` : `${nw[ch]}/${nU}-${old[ch]}/${oU}`})`;
  return {
    difficulty: "challenge",
    question: `${c.intro}, the ratio of ${g0} to ${g1} is ${a} : ${b}. Then ${what} ${verb}, and the ratio of ${g0} to ${g1} becomes ${cc} : ${dd}. ${ask === "y" ? `How many ${Yg[1]} are there?` : ask === "x0" ? `How many ${X[1]} were there at the start?` : `How many ${c.all} were there at the start?`}`,
    prompt: undefined,
    answer: numSpec(ans),
    display: num(ans),
    correctFeedback: `With the ${Yg[1]} matched, the ${X[1]} change by ${dParts} part${dParts === 1 ? "" : "s"} = ${k}, so 1 part = ${s}. Start: ${rat(inOrder(X0, Y))}; after: ${rat(inOrder(X1, Y))} = ${cc} : ${dd}.`,
    wrong: slips.list,
    explanation: `The number of ${Yg[1]} doesn't change, so make the ${Yg[1]} the same number of parts in both ratios. ${match} The ${X[1]} go from ${oX} parts to ${nX} parts, so the ${what} ${gone ? "taken away" : "added"} are ${dParts} part${dParts === 1 ? "" : "s"}, and 1 part = ${k} ÷ ${dParts} = ${s}. ${answerStep} Check: at the start ${g0} : ${g1} = ${rat(inOrder(X0, Y))}, and afterwards ${rat(inOrder(X1, Y))}, which simplifies to ${cc} : ${dd} ✓.`,
    solution: [
      `The ${Yg[1]} don't change. ${match}`,
      `The ${X[1]} change from ${oX} to ${nX} parts: ${dParts} part${dParts === 1 ? "" : "s"} = ${k}, so 1 part = ${s}.`,
      answerStep.replace(/= (\d+)( [a-z ]+)?\.$/, "= **$1$2**."),
      `Check: ${rat(inOrder(X0, Y))} at the start, ${rat(inOrder(X1, Y))} = ${cc} : ${dd} afterwards ✓`,
    ],
    hints: [
      `Which group doesn't change? Make its number of parts the same in both ratios.`,
      `Compare the ${X[1]} parts before and after: the ${what} are that many parts.`,
      `Find one part, then the number the question asks for.`,
    ],
    verify: ask === "y" ? base : ask === "x0" ? `${base}*${old[ch]}/${oU}` : `${base}*(${old[ch]}+${oU})/${oU}`,
    commonError: `Taking the ratio numbers as the real numbers, or treating the ${k} as one part instead of matching the group that doesn't change.`,
    strategy: "Make the shared part equal",
    marks: 3,
    sig: `chg|${a}:${b}|${ch}${gone ? "-" : "+"}${k}|${cc}:${dd}|${ask}`,
  };
}

interface ArriveCtx {
  intro: (n: number) => string;
  groups: [string, string];
  stay: string;
  ask: string;
  verb: string;
  /** "more adults arrive" */
  more: string;
}

const ARRIVE_CTX: ArriveCtx[] = [
  { intro: (n) => `There are ${n} people at a party.`, groups: ["adults", "children"], stay: "No one leaves.", ask: "How many more adults must arrive", verb: "arrive", more: "more adults arrive" },
  { intro: (n) => `A chess club has ${n} members.`, groups: ["girls", "boys"], stay: "Nobody leaves the club.", ask: "How many more girls must join", verb: "join", more: "more girls join" },
  { intro: (n) => `A shelf holds ${n} books.`, groups: ["fiction books", "non-fiction books"], stay: "No books are taken away.", ask: "How many more fiction books must be added", verb: "be added", more: "more fiction books are added" },
];

function arriveDraft(r: Rng): Draft {
  const c = r.pick(ARRIVE_CTX);
  let a = 3, b = 5, cc = 5, dd = 3, s0 = 6;
  for (let t = 0; t < 1000; t++) {
    [a, b] = pickParts(r, 2, 9);
    [cc, dd] = pickParts(r, 2, 9);
    s0 = r.int(2, 12);
    const N = (a + b) * s0;
    const Y = b * s0;
    if (cc * b > a * dd && N <= 120 && Y % dd === 0 && (cc * Y) / dd - a * s0 <= Math.min(80, N)) break;
  }
  const N = (a + b) * s0;
  const X0 = a * s0;
  const Y = b * s0;
  const part = Y / dd;
  const X1 = cc * part;
  const k = X1 - X0;
  const [g0, g1] = c.groups;
  const slips = numSlips(k);
  slips.add(X1, num(X1), `${X1} is the number of ${g0} needed **altogether**. ${X0} ${g0} are already there, so fewer than ${X1} must ${c.verb}.`);
  const same = (N * cc) / (cc + dd) - X0;
  if (isWhole(same)) slips.add(same, num(same), `${num(same)} assumes the total stays at ${N} and shares it in the ratio ${cc} : ${dd}. But the ${g1} stay the same — the total grows as ${c.more}.`);
  slips.add(X1 - Y, num(X1 - Y), `${X1 - Y} is ${X1} − ${Y}, taking away the ${g1}. Take away the ${X0} ${g0} already there.`);
  slips.add((cc - a) * s0, num((cc - a) * s0), `${(cc - a) * s0} comes from (${cc} − ${a}) × ${s0}, using the old part size. When the ratio changes the parts change size: in ${cc} : ${dd}, 1 part is ${Y} ÷ ${dd} = ${part}.`);
  return {
    difficulty: "challenge",
    question: `${c.intro(N)} The ratio of ${g0} to ${g1} is ${a} : ${b}. ${c.stay} ${c.ask} to make the ratio of ${g0} to ${g1} ${cc} : ${dd}?`,
    prompt: undefined,
    answer: numSpec(k),
    display: num(k),
    correctFeedback: `There are ${X0} ${g0} and ${Y} ${g1}. The ${g1} stay, so ${dd} parts = ${Y}, 1 part = ${part}, and ${cc} parts of ${g0} = ${X1}: ${X1} − ${X0} = ${k}.`,
    wrong: slips.list,
    explanation: `At the start ${a} + ${b} = ${a + b} parts = ${N}, so 1 part = ${s0}: ${X0} ${g0} and ${Y} ${g1}. The ${g1} don't change, so in the new ratio ${cc} : ${dd} the ${g1} are ${dd} parts = ${Y}, and 1 part = ${Y} ÷ ${dd} = ${part}. The ${g0} must be ${cc} × ${part} = ${X1}, so ${X1} − ${X0} = ${k} more must ${c.verb}. Check: ${X1} : ${Y} simplifies to ${cc} : ${dd} ✓.`,
    solution: [
      `Start: 1 part = ${N} ÷ ${a + b} = ${s0}, so ${X0} ${g0} and ${Y} ${g1}.`,
      `The ${g1} stay at ${Y}. In ${cc} : ${dd} they are ${dd} parts, so 1 part = ${Y} ÷ ${dd} = ${part}.`,
      `${cap(g0)} needed: ${cc} × ${part} = ${X1}, so **${k}** more.`,
      `Check: ${X1} : ${Y} = ${cc} : ${dd} ✓`,
    ],
    hints: [`How many ${g0} and how many ${g1} are there at the start?`, `Which group stays the same? In the new ratio, it is ${dd} parts.`, `Find how many ${g0} are needed altogether, then subtract the ones already there.`],
    verify: `${N}/(${a}+${b})*${b}/${dd}*${cc}-${N}/(${a}+${b})*${a}`,
    commonError: `Sharing ${N} in the new ratio as if the total stayed the same — only the ${g1} stay the same.`,
    strategy: "Work backwards",
    marks: 3,
    sig: `arr|${N}|${a}:${b}->${cc}:${dd}`,
  };
}

const raChange: Generator = {
  id: "ra-change",
  topic: "ra",
  section: "ra-problems",
  label: "A changing ratio: some are added or taken away",
  kinds: ["mcq", "qa"],
  make(r) {
    const arrive = r.chance(0.35);
    let d = arrive ? arriveDraft(r) : changeDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = arrive ? arriveDraft(r) : changeDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-chain — exchange chains: 3 small = 2 medium, 3 medium = 2 large
// ---------------------------------------------------------------------------

type Kind = [string, string];
/** "1 gold coin", "3 gold coins" */
const cnt = (n: number, k: Kind) => `${n} ${n === 1 ? k[0] : k[1]}`;

interface ChainCtx {
  kinds: [Kind, Kind, Kind];
  /** "print" / "are worth" / "hold", and the comparisons for one item */
  worth: string;
  more: string;
  up: string;
  /** what the value is measured in */
  unit: string;
  base: (v: number) => string;
  same: (n1: number, k1: Kind, n2: number, k2: Kind) => string;
  askValue: string;
  askCount: (n: number, name: string) => string;
  values: number[];
}

const CHAINS: ChainCtx[] = [
  {
    kinds: [["small cartridge", "small cartridges"], ["medium cartridge", "medium cartridges"], ["large cartridge", "large cartridges"]],
    unit: "pages",
    worth: "print",
    more: "prints more",
    up: "bigger",
    base: (v) => `A small printer cartridge prints ${v} pages.`,
    same: (n1, k1, n2, k2) => `${cnt(n1, k1)} print the same number of pages as ${cnt(n2, k2)}.`,
    askValue: "How many pages does one large cartridge print?",
    askCount: (n) => `How many small cartridges print the same number of pages as ${n} large cartridges?`,
    values: [200, 300, 400, 450, 500, 600, 800, 900],
  },
  {
    kinds: [["copper coin", "copper coins"], ["silver coin", "silver coins"], ["gold coin", "gold coins"]],
    unit: "points",
    worth: "are worth",
    more: "is worth more",
    up: "worth more",
    base: (v) => `In a board game, a copper coin is worth ${v} points.`,
    same: (n1, k1, n2, k2) => `${cnt(n1, k1)} ${n1 === 1 ? "is" : "are"} worth the same as ${cnt(n2, k2)}.`,
    askValue: "How many points is a gold coin worth?",
    askCount: (n, name) => `${name} swaps ${n} gold coins for copper coins of the same total value. How many copper coins does ${name} get?`,
    values: [2, 3, 4, 5, 6, 8, 9, 10, 12, 15],
  },
  {
    kinds: [["small bottle", "small bottles"], ["medium bottle", "medium bottles"], ["large bottle", "large bottles"]],
    unit: "ml",
    worth: "hold",
    more: "holds more",
    up: "bigger",
    base: (v) => `A small bottle holds ${v} ml of water.`,
    same: (n1, k1, n2, k2) => `${cnt(n1, k1)} ${n1 === 1 ? "holds" : "hold"} the same amount of water as ${cnt(n2, k2)}.`,
    askValue: "How many millilitres does a large bottle hold?",
    askCount: (n) => `How many small bottles hold the same amount of water as ${n} large bottles?`,
    values: [150, 200, 250, 300, 330, 500],
  },
];

function chainDraft(r: Rng): Draft {
  const c = r.pick(CHAINS);
  const [name] = names(r, 1);
  let a1 = 3, b1 = 2, a2 = 3, b2 = 2, v1 = 600, n = 2;
  for (let t = 0; t < 1000; t++) {
    [b1, a1] = pickParts(r, 2, 6).sort((x, y) => x - y);
    [b2, a2] = pickParts(r, 2, 6).sort((x, y) => x - y);
    if (b1 < 2 || b2 < 2) continue;
    v1 = r.pick(c.values);
    n = r.int(2, 5);
    const v2 = (a1 * v1) / b1;
    const v3 = (a2 * v2) / b2;
    if (isWhole(v2) && isWhole(v3) && v3 <= (c.unit === "points" ? 200 : 5000) && isWhole((n * v3) / v1) && (n * v3) / v1 <= 60) break;
  }
  const [k0, k1, k2] = c.kinds;
  const v2 = (a1 * v1) / b1;
  const v3 = (a2 * v2) / b2;
  const askCount = r.chance(0.3);
  const N = (n * v3) / v1;
  const ans = askCount ? N : v3;
  const fv = (x: number) => (c.unit === "ml" ? `${num(x)} ml` : `${num(x)} ${x === 1 ? c.unit.replace(/s$/, "") : c.unit}`);
  const f = (x: number) => (askCount ? num(x) : fv(x));
  const slips = numSlips(ans);
  if (askCount) {
    const pts = n * v3;
    slips.add(pts, f(pts), `${pts} is the ${n} ${k2[1]} measured in ${c.unit === "ml" ? "millilitres" : c.unit}, not a number of ${k0[1]}. Each ${k0[0]} is ${fv(v1)}, so divide by ${v1}.`);
    slips.add(v3 / v1, f(v3 / v1), `${num(v3 / v1)} is the number of ${k0[1]} for just **one** ${k2[0]}. There are ${n} ${k2[1]}, so multiply by ${n}.`);
    const mid = (n * v2) / v1;
    if (isWhole(mid)) slips.add(mid, f(mid), `${mid} uses a ${k1[0]} (${fv(v2)}) instead of a ${k2[0]}. Do the second step as well: 1 ${k2[0]} = ${fv(v3)}.`);
  } else {
    slips.add(v2, f(v2), `${fv(v2)} is one **${k1[0]}**. Do the same step once more to get from ${k1[1]} to ${k2[1]}.`);
    slips.add(a1 * v1, f(a1 * v1), `${fv(a1 * v1)} is what ${a1} ${k0[1]} ${c.worth} — that's ${cnt(b1, k1)}, not one ${k2[0]}. Divide by ${b1} to get one ${k1[0]}, then repeat the step.`);
    if (b2 !== 1) slips.add(a2 * v2, f(a2 * v2), `${fv(a2 * v2)} is what ${a2} ${k1[1]} ${c.worth}, which is ${b2} ${k2[1]}. Divide by ${b2} to get one ${k2[0]}.`);
    const flip = tidy(((v1 * b1) / a1) * (b2 / a2));
    if (hasDp(flip, 1)) slips.add(flip, f(flip), `${fv(flip)} comes from turning the swaps upside down (× ${m(`${b1}/${a1}`)}${a1 === a2 && b1 === b2 ? " each time" : `, then × ${m(`${b2}/${a2}`)}`}). It takes ${a1} ${k0[1]} to match ${cnt(b1, k1)}, so a ${k1[0]} **${c.more}** than a ${k0[0]}.`);
  }
  const steps = [
    `${a1} ${k0[1]}: ${a1} × ${v1} = ${fv(a1 * v1)}, the same as ${cnt(b1, k1)}, so 1 ${k1[0]} = ${fv(a1 * v1)} ÷ ${b1} = ${fv(v2)}.`,
    `${a2} ${k1[1]}: ${a2} × ${v2} = ${fv(a2 * v2)}, the same as ${cnt(b2, k2)}, so 1 ${k2[0]} = ${fv(a2 * v2)} ÷ ${b2} = ${fv(v3)}.`,
  ];
  const countStep = `${n} ${k2[1]} = ${n} × ${v3} = ${fv(n * v3)}, and ${n * v3} ÷ ${v1} = ${N}, so that's ${N} ${k0[1]}.`;
  return {
    difficulty: "challenge",
    question: `${c.base(v1)} ${c.same(a1, k0, b1, k1)} ${c.same(a2, k1, b2, k2)} ${askCount ? c.askCount(n, name) : c.askValue}`,
    prompt: askCount ? undefined : `Give your answer in ${c.unit === "ml" ? "millilitres" : c.unit}.`,
    answer: numSpec(ans, f(ans)),
    display: f(ans),
    correctFeedback: `1 ${k1[0]} = ${fv(v2)} and 1 ${k2[0]} = ${fv(v3)}${askCount ? `, so ${n} ${k2[1]} = ${fv(n * v3)} = ${N} ${k0[1]}` : ""}.`,
    wrong: slips.list,
    explanation: `Go one swap at a time. ${steps.join(" ")}${askCount ? ` ${countStep}` : ""} Each step multiplies by a number bigger than 1 (${m(`${a1}/${b1}`)}, then ${m(`${a2}/${b2}`)}), because each swap goes up to something ${c.up}. Check: ${v1} × ${m(`${a1}/${b1}`)} × ${m(`${a2}/${b2}`)} = ${v3} ✓.`,
    solution: [...steps, ...(askCount ? [countStep.replace(`${N} ${k0[1]}.`, `**${N}** ${k0[1]}.`)] : [`So one ${k2[0]} is worth **${fv(v3)}**.`]), `Check: ${v1} × ${m(`${a1}/${b1}`)} × ${m(`${a2}/${b2}`)} = ${v3} ✓`],
    hints: [`How much are ${a1} ${k0[1]} worth altogether? That's the same as ${cnt(b1, k1)}.`, `Find the value of one ${k1[0]}, then do the same step again for the ${k2[1]}.`, ...(askCount ? [`Work out the value of ${n} ${k2[1]}, then see how many ${k0[1]} make that value.`] : [])],
    verify: askCount ? `${n}*${v1}*${a1}/${b1}*${a2}/${b2}/${v1}` : `${v1}*${a1}/${b1}*${a2}/${b2}`,
    commonError: `Stopping after the first swap, or turning a swap upside down (a ${k1[0]} is worth more than a ${k0[0]}, not less).`,
    strategy: "Use the multiplier",
    marks: 3,
    sig: `chain|${v1}|${a1}:${b1}|${a2}:${b2}|${askCount ? `n${n}` : "v"}`,
  };
}

const raChain: Generator = {
  id: "ra-chain",
  topic: "ra",
  section: "ra-problems",
  label: "Exchange chains: 3 small = 2 medium, 3 medium = 2 large",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = chainDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = chainDraft(r);
    return d;
  },
};

// ---------------------------------------------------------------------------
// ra-nested — a ratio inside a ratio, with a difference (away : home fans, adults : children)
// ---------------------------------------------------------------------------

interface NestCtx {
  /** the two big groups, and the two kinds inside the first group */
  outer: [string, string];
  inner: [string, string];
  intro: (a: number, h: number) => string;
  among: (p: number, q: number) => string;
  diff: (d: number) => string;
  askOther: string;
  askAll: string;
  all: string;
}

const NESTS: NestCtx[] = [
  {
    outer: ["away fans", "home fans"],
    inner: ["adults", "children"],
    intro: (a, h) => `At a football match, the ratio of away fans to home fans is ${a} : ${h}.`,
    among: (p, q) => `Among the away fans, the ratio of adults to children is ${p} : ${q}.`,
    diff: (d) => `There are ${d} more adult away fans than child away fans.`,
    askOther: "How many home fans are there?",
    askAll: "How many fans are at the match altogether?",
    all: "fans",
  },
  {
    outer: ["Year 7s", "Year 8s"],
    inner: ["girls", "boys"],
    intro: (a, h) => `On a school trip, the ratio of Year 7s to Year 8s is ${a} : ${h}.`,
    among: (p, q) => `Among the Year 7s, the ratio of girls to boys is ${p} : ${q}.`,
    diff: (d) => `There are ${d} more Year 7 girls than Year 7 boys.`,
    askOther: "How many Year 8s are on the trip?",
    askAll: "How many pupils are on the trip altogether?",
    all: "pupils",
  },
];

function nestedDraft(r: Rng): Draft {
  const c = r.pick(NESTS);
  let p = 11, q = 4, w = 4, a = 5, h = 6;
  for (let t = 0; t < 1000; t++) {
    [q, p] = pickParts(r, 2, 13).sort((x, y) => x - y);
    w = r.int(2, 8);
    [a, h] = pickParts(r, 2, 9);
    const away = (p + q) * w;
    if (p - q >= 2 && Math.min(a, h) >= 2 && away % a === 0 && away / a >= 2 && away / a !== w && away <= 200 && (away / a) * h <= 300) break;
  }
  const D = (p - q) * w;
  const away = (p + q) * w;
  const z = away / a;
  const home = h * z;
  const askAll = r.chance(0.35);
  const ans = askAll ? away + home : home;
  const [A, H] = c.outer;
  const [I1, I2] = c.inner;
  const slips = numSlips(ans);
  slips.add(away, num(away), `${away} is the number of ${A}. One more step: they are the ${a} parts of ${A} : ${H} = ${a} : ${h}.`);
  slips.add(askAll ? (a + h) * w : h * w, num(askAll ? (a + h) * w : h * w), `${askAll ? (a + h) * w : h * w} uses the ${w} ${c.all} per part from ${I1} : ${I2} inside ${A} : ${H}. The two ratios have different-sized parts — find a new part from the ${away} ${A}.`);
  const turned = (away / h) * a;
  if (isWhole(turned)) {
    const v = askAll ? away + turned : turned;
    slips.add(v, num(v), `${v} comes from treating the ${away} ${A} as ${h} parts. In ${A} : ${H} = ${a} : ${h}, the ${A} are the ${a} parts.`);
  }
  if (askAll) slips.add(home, num(home), `${home} is just the ${H}. The question asks for all the ${c.all}, so add the ${away} ${A}.`);
  else slips.add(away + home, num(away + home), `${away + home} is all the ${c.all} (${A} + ${H}). The question asks only for the ${H}.`);
  slips.add(D * (p + q), num(D * (p + q)), `${D * (p + q)} treats the ${D} as one part. It is the **difference** between the ${I1} and the ${I2}: ${p} − ${q} = ${p - q} parts.`);

  const step1 = `Among the ${A}, ${I1} : ${I2} = ${p} : ${q}. The ${D} extra ${I1} are ${p} − ${q} = ${p - q} parts, so 1 part = ${D} ÷ ${p - q} = ${w}, and there are ${p + q} × ${w} = ${away} ${A}.`;
  const step2 = `In ${A} : ${H} = ${a} : ${h}, the ${A} are ${a} parts = ${away}, so 1 part = ${away} ÷ ${a} = ${z}, and the ${H} are ${h} × ${z} = ${home}.`;
  return {
    difficulty: "challenge",
    question: `${c.intro(a, h)} ${c.among(p, q)} ${c.diff(D)} ${askAll ? c.askAll : c.askOther}`,
    prompt: undefined,
    answer: numSpec(ans),
    display: num(ans),
    correctFeedback: `There are ${away} ${A} (1 part of ${I1} : ${I2} is ${w}), so 1 part of ${A} : ${H} is ${z} and there are ${home} ${H}${askAll ? `: ${away} + ${home} = ${away + home} altogether` : ""}.`,
    wrong: slips.list,
    explanation: `Work with one ratio at a time. ${step1} ${step2}${askAll ? ` Altogether there are ${away} + ${home} = ${away + home} ${c.all}.` : ""} Notice that the parts in the two ratios are different sizes (${w} and ${z}) — don't mix them up. Check: ${away} : ${home} simplifies to ${a} : ${h} ✓.`,
    solution: [step1, step2.replace(`= ${home}.`, `= ${askAll ? home : `**${home}**`}.`), ...(askAll ? [`Altogether: ${away} + ${home} = **${away + home}**.`] : []), `Check: ${away} : ${home} = ${a} : ${h} ✓`],
    hints: [`Start with the ${A}. The ${D} extra ${I1} are how many parts of ${p} : ${q}?`, `Find 1 part, then the total number of ${A}.`, `The ${A} are the ${a} parts of ${a} : ${h}. Find one of those parts — it is a different size.`],
    verify: askAll ? `${D}/(${p}-${q})*(${p}+${q})/${a}*(${a}+${h})` : `${D}/(${p}-${q})*(${p}+${q})/${a}*${h}`,
    commonError: `Using the part size from ${I1} : ${I2} (${w}) in ${A} : ${H} — the two ratios have different-sized parts.`,
    strategy: "Use a bar model",
    marks: 3,
    sig: `nest|${a}:${h}|${p}:${q}|${D}|${askAll ? "all" : "other"}`,
  };
}

const raNested: Generator = {
  id: "ra-nested",
  topic: "ra",
  section: "ra-problems",
  label: "A ratio inside a ratio, with a difference",
  kinds: ["mcq", "qa"],
  make(r) {
    let d = nestedDraft(r);
    for (let t = 0; t < 30 && d.wrong.length < 3; t++) d = nestedDraft(r);
    return d;
  },
};

export const GEN_RA: Generator[] = [raSimplify, raUnit, raShare, raGivenPart, raDifference, raFraction, raCombine, raRecipe, raInverse, raMixFix, raChange, raChain, raNested];
