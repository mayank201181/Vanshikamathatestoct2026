// Fresh-number generators — Substitution (Unit 2). See fr.ts (fr-add) for the reference example.
//
// Every generator here works the same way: pick values, build the expression, then build the
// answer, every misconception and every worked step from those values. `verify` is the
// question's own expression with the numbers put in (negatives in brackets), so it is
// evaluated independently of the answer we compute.

import type { AnswerSpec, Difficulty } from "../types.ts";
import { fr, fracSpec, m, num, numSpec, tidy, type Draft, type Generator, type Rng, type Wrong } from "./core.ts";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** A candidate wrong answer: its value, how it is shown, and the slip that produces it. */
interface Cand {
  v: number;
  /** Option text; defaults to the plain number. */
  display?: string;
  /** Typed-answer spec; defaults to the number. */
  spec?: AnswerSpec;
  feedback: string;
}

const same = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/**
 * Keep the candidates that are real alternatives: a finite value, different from the answer and
 * from every earlier candidate, and not so close to a decimal answer that the checker would call
 * it "nearly right" (then its feedback could never be shown).
 */
function keepWrongs(answer: number, cands: Cand[], unit = ""): Wrong[] {
  const seen = [answer];
  const out: Wrong[] = [];
  for (const c of cands) {
    if (!Number.isFinite(c.v) || seen.some((s) => same(s, c.v))) continue;
    if (!Number.isInteger(answer) && answer !== 0 && Math.abs(c.v - answer) <= 0.01 * Math.abs(answer)) continue;
    seen.push(c.v);
    out.push({ display: (c.display ?? num(c.v)) + unit, spec: c.spec ?? numSpec(c.v), feedback: c.feedback });
  }
  return out;
}

/** "{{a = 4}} and {{b = 5}}", "{{a = 4}}, {{b = 5}} and {{c = 3}}" — values given as ASCII maths. */
function given(pairs: [string, string][]): string {
  const parts = pairs.map(([l, x]) => m(`${l} = ${x}`));
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** A value as ASCII maths for {{ }} and verify: negatives get brackets, −3 → (-3). */
const v = (x: number) => (tidy(x) < 0 ? `(-${num(-x)})` : num(x));
/** A value in plain text, with brackets round a negative: (−3). */
const vb = (x: number) => (tidy(x) < 0 ? `(${num(x)})` : num(x));

/** Letters for questions with two or three values (no i, l, o; never "pi"). */
const PAIRS: [string, string][] = [["a", "b"], ["p", "q"], ["m", "n"], ["x", "y"], ["s", "t"], ["h", "k"], ["c", "d"], ["f", "g"]];
const TRIPLES: [string, string, string][] = [["a", "b", "c"], ["p", "q", "r"], ["x", "y", "z"], ["m", "n", "k"], ["f", "g", "h"]];

/** Everything one roll of a substitution template needs; `build` turns it into a Draft. */
interface Item {
  difficulty: Difficulty;
  question: string;
  prompt?: string;
  answer: number;
  /** Answer display (default: the number) and spec (default: a number spec). */
  display?: string;
  spec?: AnswerSpec;
  correct: string;
  /** Unit shown after the answer and every option, e.g. " m/s", " cm²", "°F". */
  unit?: string;
  slips: Cand[];
  explanation: string;
  solution: string[];
  hints: string[];
  verify: string;
  commonError: string;
  strategy?: string;
  marks?: number;
  sig: string;
}

/** Outside {{ }}, a "-" before a digit (an interpolated negative number) becomes the real minus "−". */
function fixMinus(s: string): string {
  return s
    .split(/(\{\{[\s\S]*?\}\})/)
    .map((part, i) => (i % 2 ? part : part.replace(/-(?=\d)/g, "−")))
    .join("");
}

function build(it: Item): Draft {
  return {
    difficulty: it.difficulty,
    question: fixMinus(it.question),
    prompt: it.prompt && fixMinus(it.prompt),
    answer: it.spec ?? numSpec(it.answer, it.unit ? num(it.answer) + it.unit : undefined),
    display: (it.display ?? num(it.answer)) + (it.unit ?? ""),
    correctFeedback: fixMinus(it.correct),
    wrong: keepWrongs(it.answer, it.slips, it.unit).map((w) => ({ ...w, feedback: fixMinus(w.feedback) })),
    explanation: fixMinus(it.explanation),
    solution: it.solution.map(fixMinus),
    hints: it.hints.map(fixMinus),
    verify: it.verify,
    commonError: fixMinus(it.commonError),
    strategy: it.strategy ?? "Check by substituting",
    marks: it.marks ?? (it.difficulty === "warmup" ? 1 : it.difficulty === "core" ? 2 : 3),
    sig: it.sig,
  };
}

/** A fraction (or whole number) as {{ }} maths, reduced, mixed if improper: used for slips. */
const frac = (n: number, d: number) => fr(n, d);
/** The same, but improper (4/3 rather than 1 1/3) — how a power-of-a-fraction slip comes out. */
const fracI = (n: number, d: number) => fr(n, d, false);
/** The spec for a fractional slip: any equal fraction or mixed number she might type. */
const fracTrap = (n: number, d: number) => fracSpec(n, d, { simplest: false });

/** Pick one of several weighted template functions. */
function pickTemplate<T>(r: Rng, list: [number, (r: Rng) => T][]): T {
  const total = list.reduce((s, [w]) => s + w, 0);
  let x = r.next() * total;
  for (const [w, f] of list) {
    if ((x -= w) < 0) return f(r);
  }
  return list[list.length - 1][1](r);
}

const asc = (a: number, b: number) => a - b;

// ---------------------------------------------------------------------------
// su-basics — positive whole numbers: hidden ×, brackets, powers, BIDMAS
// ---------------------------------------------------------------------------

/** 3a + 2b */
function basicsTwoTerms(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const p = r.int(2, 9), q = r.int(2, 9), A = r.int(2, 9);
  let B = r.int(2, 9);
  while (B === A) B = r.int(2, 9);
  const ans = p * A + q * B;
  const e = `${p}${L1} + ${q}${L2}`;
  return {
    difficulty: "warmup",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`${p}${L1}`)} = ${p} × ${A} = ${p * A} and ${m(`${q}${L2}`)} = ${q} × ${B} = ${q * B}, so the total is ${p * A} + ${q * B} = ${ans}.`,
    slips: [
      {
        v: 10 * p + A + (10 * q + B),
        feedback: `This comes from reading ${m(`${p}${L1}`)} as the number ${p}${A} and ${m(`${q}${L2}`)} as ${q}${B}. A number written next to a letter means multiply: ${m(`${p}${L1}`)} = ${p} × ${A} = ${p * A}.`,
      },
      {
        v: p + A + q + B,
        feedback: `This comes from adding everything (${p} + ${A} + ${q} + ${B}). ${m(`${p}${L1}`)} means ${p} × ${L1}, not ${p} + ${L1}, so ${m(`${p}${L1}`)} = ${p * A} and ${m(`${q}${L2}`)} = ${q * B}.`,
      },
      {
        v: (p * A + q) * B,
        feedback: `This comes from working left to right: ${p} × ${A} = ${p * A}, then + ${q} = ${p * A + q}, then × ${B}. Multiplication comes before addition, so work out ${m(`${q}${L2}`)} = ${q * B} first and then add.`,
      },
    ],
    explanation: `Letters written next to numbers are multiplied, so ${m(`${p}${L1}`)} = ${p} × ${A} = ${p * A} and ${m(`${q}${L2}`)} = ${q} × ${B} = ${q * B}. Multiplication comes before addition (BIDMAS), so work out both terms first, then add: ${p * A} + ${q * B} = ${ans}. Writing the × signs back in — ${p} × ${A} + ${q} × ${B} — makes the order clear.`,
    solution: [
      `Put the numbers in: ${m(`${e} = ${p} * ${A} + ${q} * ${B}`)}.`,
      `Multiply first: ${p} × ${A} = ${p * A} and ${q} × ${B} = ${q * B}.`,
      `Then add: ${p * A} + ${q * B} = **${ans}**.`,
    ],
    hints: [`Put the hidden × signs back in: what does ${m(`${p}${L1}`)} mean?`, `Work out each term on its own before you add.`],
    verify: `${p}*${A}+${q}*${B}`,
    commonError: `Reading ${m(`${p}${L1}`)} as the two-digit number ${p}${A} — a number next to a letter means multiply.`,
    sig: `2t:${[`${p}*${A}`, `${q}*${B}`].sort().join("+")}`,
  };
}

/** 4(a + b), 4(a − b) */
function basicsBracket(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const sub = r.chance(0.5);
  const p = r.int(2, 9);
  let A: number, B: number;
  if (sub) {
    A = r.int(4, 12);
    B = r.int(2, A - 1);
  } else {
    A = r.int(2, 9);
    B = r.int(2, 9);
  }
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  const inside = sub ? A - B : A + B;
  const other = sub ? A + B : A - B;
  const ans = p * inside;
  const e = `${p}(${L1} ${op} ${L2})`;
  const slips: Cand[] = [
    {
      v: sub ? p * A - B : p * A + B,
      feedback: `This comes from multiplying only the ${L1} by ${p} (${p} × ${A} ${opT} ${B}). The ${p} multiplies everything in the bracket, so work out ${A} ${opT} ${B} = ${inside} first.`,
    },
    {
      v: p + inside,
      feedback: `This comes from adding the ${p} (${p} + ${inside}). A number written right next to a bracket means multiply: ${p} × ${inside}.`,
    },
    {
      v: p * other,
      feedback: `This comes from ${sub ? "adding" : "subtracting"} inside the bracket. Read the sign again: it is ${A} ${opT} ${B} = ${inside}.`,
    },
  ];
  if (!sub) {
    slips.push({
      v: p * A * B,
      feedback: `This comes from multiplying everything (${p} × ${A} × ${B}). There's a + inside the bracket, so add first: ${A} + ${B} = ${inside}.`,
    });
  }
  return {
    difficulty: r.chance(0.5) ? "warmup" : "core",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `Brackets first: ${A} ${opT} ${B} = ${inside}, then ${p} × ${inside} = ${ans}.`,
    slips,
    explanation: `Swap each letter for its number and keep the bracket: ${m(`${p}(${A} ${op} ${B})`)}. Brackets come first in BIDMAS, so ${A} ${opT} ${B} = ${inside}. A number next to a bracket means multiply, so ${p} × ${inside} = ${ans}. Quick check by expanding: ${p} × ${A} ${opT} ${p} × ${B} = ${p * A} ${opT} ${p * B} = ${ans} too.`,
    solution: [
      `Put the numbers in, keeping the bracket: ${m(`${e} = ${p}(${A} ${op} ${B})`)}.`,
      `Bracket first: ${A} ${opT} ${B} = ${inside}.`,
      `A number next to a bracket means multiply: ${p} × ${inside} = **${ans}**.`,
    ],
    hints: [`Write the numbers in place of the letters, keeping the bracket. Which part do you work out first?`, `What does a number written right next to a bracket tell you to do?`],
    verify: `${p}*(${A}${op}${B})`,
    commonError: `Multiplying only the first letter by ${p} — the ${p} multiplies the whole bracket.`,
    sig: `br:${p}(${sub ? `${A}-${B}` : [A, B].sort(asc).join("+")})`,
  };
}

/** 5b² (class recap) */
function basicsCoefSquare(r: Rng): Item {
  const L = r.pick(["a", "b", "x", "y", "n", "t", "k", "p"]);
  const A = r.int(3, 9);
  let q = r.int(2, 9);
  while (q === A) q = r.int(2, 9);
  const ans = q * A * A;
  const e = `${q}${L}^2`;
  return {
    difficulty: q * A > 30 ? "core" : r.chance(0.5) ? "warmup" : "core",
    question: `If ${given([[L, `${A}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `Only ${L} is squared: ${m(`${A}^2`)} = ${A * A}, then ${q} × ${A * A} = ${ans}.`,
    slips: [
      {
        v: (q * A) ** 2,
        feedback: `${(q * A) ** 2} is ${m(`(${q}${L})^2`)} = ${m(`${q * A}^2`)}. In ${m(e)} the little 2 belongs to ${L} only, so square the ${A} first, then multiply by ${q}.`,
      },
      {
        v: q * A * 2,
        feedback: `This comes from doubling instead of squaring (${q} × ${A} × 2). ${m(`${L}^2`)} means ${L} × ${L} = ${A} × ${A} = ${A * A}.`,
      },
      {
        v: q * q * A,
        feedback: `This comes from squaring the ${q} instead of the ${L} (${m(`${q}^2`)} × ${A}). The power is on the ${L}, so only ${L} is squared.`,
      },
      {
        v: q + A * A,
        feedback: `This comes from adding the ${q} (${q} + ${A * A}). ${m(e)} means ${q} × ${m(`${L}^2`)} — a number next to a letter means multiply.`,
      },
    ],
    explanation: `${m(e)} means ${q} × ${m(`${L}^2`)} — a power only applies to the thing it touches. Powers come before multiplying (BIDMAS), so first ${m(`${A}^2`)} = ${A} × ${A} = ${A * A}, then ${q} × ${A * A} = ${ans}. If the ${q} were meant to be squared too, it would be written ${m(`(${q}${L})^2`)}, which is ${(q * A) ** 2}.`,
    solution: [
      `${m(e)} means ${q} × ${m(`${L}^2`)}, so put the number in: ${m(`${q} * ${A}^2`)}.`,
      `Indices first: ${m(`${A}^2`)} = ${A} × ${A} = ${A * A}.`,
      `Then multiply: ${q} × ${A * A} = **${ans}**.`,
    ],
    hints: [`Which part does the little 2 belong to — the ${q}, the ${L}, or both?`, `Square ${A} first, then multiply by ${q}.`],
    verify: `${q}*${A}^2`,
    commonError: `Multiplying before squaring: ${m(e)} is ${q} × ${m(`${A}^2`)} = ${ans}, not ${m(`${q * A}^2`)} = ${(q * A) ** 2}.`,
    sig: `cs:${q}*${A}^2`,
  };
}

/** a² + 3b, a² − 3b */
function basicsSquarePlus(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const A = r.int(3, 9), q = r.int(2, 6), B = r.int(2, 9);
  const sub = r.chance(0.4) && A * A > q * B;
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  const s = sub ? -1 : 1;
  const ans = A * A + s * q * B;
  const e = `${L1}^2 ${op} ${q}${L2}`;
  return {
    difficulty: "core",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`${A}^2`)} = ${A * A} and ${m(`${q}${L2}`)} = ${q * B}, so ${A * A} ${opT} ${q * B} = ${ans}.`,
    slips: [
      {
        v: 2 * A + s * q * B,
        feedback: `This comes from doubling instead of squaring: ${m(`${L1}^2`)} = ${A} × 2. But ${m(`${L1}^2`)} means ${L1} × ${L1} = ${A} × ${A} = ${A * A}.`,
      },
      {
        v: (A * A + s * q) * B,
        feedback: `This comes from working left to right: ${A * A} ${opT} ${q} = ${A * A + s * q}, then × ${B}. ${m(`${q}${L2}`)} is one term (${q} × ${B} = ${q * B}) and it must be worked out before you ${sub ? "subtract" : "add"}.`,
      },
      {
        v: A * A + s * (10 * q + B),
        feedback: `This comes from reading ${m(`${q}${L2}`)} as the number ${q}${B}. ${m(`${q}${L2}`)} means ${q} × ${B} = ${q * B}.`,
      },
    ],
    explanation: `Follow BIDMAS. Indices first: ${m(`${L1}^2`)} = ${A} × ${A} = ${A * A}. Then multiplication: ${m(`${q}${L2}`)} = ${q} × ${B} = ${q * B}. ${sub ? "Subtraction" : "Addition"} last: ${A * A} ${opT} ${q * B} = ${ans}.`,
    solution: [
      `Put the numbers in: ${m(`${e} = ${A}^2 ${op} ${q} * ${B}`)}.`,
      `Indices: ${m(`${A}^2`)} = ${A * A}. Multiplication: ${q} × ${B} = ${q * B}.`,
      `${sub ? "Subtract" : "Add"}: ${A * A} ${opT} ${q * B} = **${ans}**.`,
    ],
    hints: [`Split it into two terms: ${m(`${L1}^2`)} and ${m(`${q}${L2}`)}.`, `${m(`${L1}^2`)} means ${L1} × ${L1}. Work out both terms before you ${sub ? "subtract" : "add"}.`],
    verify: `${A}^2${op}${q}*${B}`,
    commonError: `Doubling instead of squaring: ${m(`${L1}^2`)} = ${A} × ${A} = ${A * A}, not ${A} × 2.`,
    sig: `sq:${A}^2${op}${q}*${B}`,
  };
}

/** (a + b)/c with c a number, or (b + 2)/3 */
function basicsFractionLine(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const oneLetter = r.chance(0.4);
  let c = 2, A = 2, B = 2;
  for (let k = 0; k < 60; k++) {
    c = r.int(2, 6);
    A = r.int(2, 15);
    B = oneLetter ? r.int(1, 9) : r.int(2, 15);
    if ((A + B) % c === 0 && A !== B && (A + B) / c >= 2 && (A % c !== 0 || B % c !== 0)) break;
  }
  const top = A + B;
  const ans = top / c;
  const second = oneLetter ? `${B}` : L2;
  const e = `(${L1} + ${second})/${c}`;
  const pairs: [string, string][] = oneLetter ? [[L1, `${A}`]] : [[L1, `${A}`], [L2, `${B}`]];
  return {
    difficulty: oneLetter ? "warmup" : "core",
    question: `If ${given(pairs)}, work out ${m(e)}.`,
    answer: ans,
    correct: `The top is ${A} + ${B} = ${top}, and ${top} ÷ ${c} = ${ans}.`,
    slips: [
      {
        v: A + B / c,
        display: frac(A * c + B, c),
        spec: fracTrap(A * c + B, c),
        feedback: `This comes from dividing only the ${oneLetter ? B : L2} by ${c} (${A} + ${m(`${B}/${c}`)}). The fraction line acts like a bracket: add the whole top first.`,
      },
      {
        v: A / c + B,
        display: frac(A + B * c, c),
        spec: fracTrap(A + B * c, c),
        feedback: `This comes from dividing only the ${L1} by ${c} (${m(`${A}/${c}`)} + ${B}). The whole top, ${m(`${L1} + ${second}`)}, is divided by ${c}.`,
      },
      {
        v: top * c,
        feedback: `This comes from multiplying by ${c} instead of dividing (${top} × ${c}). The line in a fraction means divide.`,
      },
    ],
    explanation: `The fraction line works like a bracket round the whole top, so ${m(e)} means (${m(`${L1} + ${second}`)}) ÷ ${c}. Work out the top first: ${A} + ${B} = ${top}. Then divide: ${top} ÷ ${c} = ${ans}. If only the ${oneLetter ? B : L2} were meant to be divided by ${c}, it would be written ${m(`${L1} + ${second}/${c}`)} instead.`,
    solution: [
      `Put the numbers in: ${m(`${e} = (${A} + ${B})/${c}`)}.`,
      `The fraction line groups the top, so add first: ${A} + ${B} = ${top}.`,
      `Then divide by the bottom: ${top} ÷ ${c} = **${ans}**.`,
    ],
    hints: [`The fraction line acts like a bracket. What is the whole of the top?`, `Work out the top as one number, then divide it by ${c}.`],
    verify: `(${A}+${B})/${c}`,
    commonError: `Dividing only part of the top by ${c} — the fraction line divides the whole top.`,
    sig: `fl:(${oneLetter ? `${A}+${B}` : [A, B].sort(asc).join("+")})/${c}`,
  };
}

/** 6 + 3mn */
function basicsProduct(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const p = r.int(2, 5), D = r.int(2, 12), A = r.int(2, 9);
  let B = r.int(2, 9);
  while (B === A) B = r.int(2, 9);
  const prod = p * A * B;
  const ans = D + prod;
  const e = `${D} + ${p}${L1}${L2}`;
  return {
    difficulty: "core",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`${p}${L1}${L2}`)} = ${p} × ${A} × ${B} = ${prod}, and ${D} + ${prod} = ${ans}.`,
    slips: [
      {
        v: (D + p) * A * B,
        feedback: `This comes from doing ${D} + ${p} first and then multiplying by ${A} and ${B}. Multiplication comes before addition, so work out ${m(`${p}${L1}${L2}`)} first.`,
      },
      {
        v: D + p + A + B,
        feedback: `This comes from adding everything (${D} + ${p} + ${A} + ${B}). Letters written next to each other are multiplied: ${m(`${p}${L1}${L2}`)} = ${p} × ${L1} × ${L2}.`,
      },
      {
        v: D + p * (10 * A + B),
        feedback: `This comes from writing ${L1} and ${L2} side by side as the number ${A}${B} (${D} + ${p} × ${A}${B}). In algebra ${m(`${L1}${L2}`)} means ${L1} × ${L2} = ${A * B}.`,
      },
    ],
    explanation: `Letters written next to each other are multiplied, so ${m(`${p}${L1}${L2}`)} = ${p} × ${L1} × ${L2} = ${p} × ${A} × ${B} = ${prod}. By BIDMAS the multiplying happens before the adding, so the answer is ${D} + ${prod} = ${ans}. Writing the × signs back in — ${D} + ${p} × ${A} × ${B} — makes the order clear.`,
    solution: [
      `Put the numbers in: ${m(`${e} = ${D} + ${p} * ${A} * ${B}`)}.`,
      `Multiply first: ${p} × ${A} × ${B} = ${prod}.`,
      `Then add: ${D} + ${prod} = **${ans}**.`,
    ],
    hints: [`Put the hidden × signs back in: what does ${m(`${p}${L1}${L2}`)} mean?`, `Work out ${p} × ${A} × ${B} before you do any adding.`],
    verify: `${D}+${p}*${A}*${B}`,
    commonError: `Adding ${D} + ${p} before multiplying — multiplication comes first.`,
    sig: `pr:${D}+${p}*${[A, B].sort(asc).join("*")}`,
  };
}

/** ab/c */
function basicsAbOverC(r: Rng): Item {
  const [L1, L2, L3] = r.pick(TRIPLES);
  let A = 2, B = 3, c = 2;
  for (let k = 0; k < 60; k++) {
    c = r.int(2, 6);
    A = r.int(2, 12);
    B = r.int(2, 12);
    if ((A * B) % c === 0 && A !== B && A !== c && B !== c && A * B <= 72) break;
  }
  const top = A * B;
  const ans = top / c;
  const e = `${L1}${L2}/${L3}`;
  const slips: Cand[] = [
    {
      v: top * c,
      feedback: `This comes from multiplying by ${L3} instead of dividing (${A} × ${B} × ${c}). The fraction line means divide the top by ${L3}.`,
    },
    {
      v: (A + B) / c,
      display: frac(A + B, c),
      spec: fracTrap(A + B, c),
      feedback: `This comes from adding ${L1} and ${L2} (${A} + ${B} = ${A + B}) on the top. ${m(`${L1}${L2}`)} means ${L1} × ${L2} = ${top}.`,
    },
  ];
  if ((10 * A + B) % c === 0 && A < 10 && B < 10) {
    slips.push({
      v: (10 * A + B) / c,
      feedback: `This comes from reading ${m(`${L1}${L2}`)} as the number ${A}${B}. Letters next to each other are multiplied: ${A} × ${B} = ${top}.`,
    });
  }
  slips.push({
    v: top,
    feedback: `${top} is just the top, ${m(`${L1}${L2}`)} = ${A} × ${B}. The fraction line still tells you to divide it by ${L3} = ${c}.`,
  });
  return {
    difficulty: "core",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`], [L3, `${c}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `The top is ${m(`${L1}${L2}`)} = ${A} × ${B} = ${top}, and ${top} ÷ ${c} = ${ans}.`,
    slips,
    explanation: `${m(e)} means ${L1} × ${L2} ÷ ${L3}: letters next to each other are multiplied, and the fraction line means divide. Work out the top first: ${A} × ${B} = ${top}. Then divide by the bottom: ${top} ÷ ${c} = ${ans}. Check: ${ans} × ${c} = ${top} ✓`,
    solution: [
      `Put the numbers in: ${m(`${e} = (${A} * ${B})/${c}`)}.`,
      `Top first: ${A} × ${B} = ${top}.`,
      `Divide by the bottom: ${top} ÷ ${c} = **${ans}**.`,
    ],
    hints: [`What does ${m(`${L1}${L2}`)} mean when two letters sit side by side?`, `Work out the whole top, then divide by ${c}.`],
    verify: `${A}*${B}/${c}`,
    commonError: `Reading ${m(`${L1}${L2}`)} as ${L1} + ${L2} — letters next to each other are multiplied.`,
    sig: `abc:${[A, B].sort(asc).join("*")}/${c}`,
  };
}

/** 2x² − 3x (positive x) or (a + b)² − 4c */
function basicsChallenge(r: Rng): Item {
  if (r.chance(0.5)) {
    const L = r.pick(["x", "n", "y", "t", "k"]);
    let q = 2, s = 3, X = 3;
    for (let k = 0; k < 60; k++) {
      q = r.int(2, 5);
      s = r.int(2, 9);
      X = r.int(3, 7);
      if (q * X > s && q !== s) break;
    }
    const sq = X * X;
    const ans = q * sq - s * X;
    const e = `${q}${L}^2 - ${s}${L}`;
    const d = q - s;
    const combined = d === 1 ? L : d === -1 ? `-${L}` : `${d}${L}`;
    return {
      difficulty: "challenge",
      question: `If ${given([[L, `${X}`]])}, work out ${m(e)}.`,
      answer: ans,
      correct: `${m(`${L}^2`)} = ${sq}, so ${m(`${q}${L}^2`)} = ${q * sq}; ${m(`${s}${L}`)} = ${s * X}; and ${q * sq} − ${s * X} = ${ans}.`,
      slips: [
        {
          v: (q * X) ** 2 - s * X,
          feedback: `This comes from ${m(`(${q}${L})^2`)} = ${m(`${q * X}^2`)} = ${(q * X) ** 2}, then − ${s * X}. In ${m(`${q}${L}^2`)} only the ${L} is squared: ${q} × ${sq} = ${q * sq}.`,
        },
        {
          v: q * 2 * X - s * X,
          feedback: `This comes from doubling instead of squaring (${q} × ${X} × 2 = ${2 * q * X}, then − ${s * X}). ${m(`${L}^2`)} means ${L} × ${L} = ${sq}.`,
        },
        {
          v: (q * sq - s) * X,
          feedback: `This comes from working left to right: ${q * sq} − ${s} = ${q * sq - s}, then × ${X}. ${m(`${s}${L}`)} is one term, ${s} × ${X} = ${s * X}, and it must be worked out before subtracting.`,
        },
        {
          v: d * X,
          feedback: `This comes from combining ${m(e)} into ${m(combined)} first. ${m(`${L}^2`)} and ${L} are not like terms, so they can't be combined — substitute into each term.`,
        },
      ],
      explanation: `Work out each term separately. First term: powers before multiplying, so ${m(`${L}^2`)} = ${X} × ${X} = ${sq} and ${m(`${q}${L}^2`)} = ${q} × ${sq} = ${q * sq}. Second term: ${m(`${s}${L}`)} = ${s} × ${X} = ${s * X}. Then ${q * sq} − ${s * X} = ${ans}. Remember ${m(`${q}${L}^2`)} means ${q} × ${m(`${L}^2`)}, not ${m(`(${q}${L})^2`)}.`,
      solution: [
        `Put the number in: ${m(`${e} = ${q} * ${X}^2 - ${s} * ${X}`)}.`,
        `Indices first: ${m(`${X}^2`)} = ${sq}, so ${m(`${q}${L}^2`)} = ${q} × ${sq} = ${q * sq}.`,
        `Next term: ${s} × ${X} = ${s * X}.`,
        `Subtract: ${q * sq} − ${s * X} = **${ans}**.`,
      ],
      hints: [`Split it into two terms: ${m(`${q}${L}^2`)} and ${m(`${s}${L}`)}.`, `In ${m(`${q}${L}^2`)}, which part is squared — the ${q}, the ${L}, or both?`],
      verify: `${q}*${X}^2-${s}*${X}`,
      commonError: `Squaring ${m(`${q}${L}`)} instead of just ${L}: ${m(`${q}${L}^2`)} = ${q} × ${sq}, not ${m(`${q * X}^2`)}.`,
      sig: `qx2:${q}*${X}^2-${s}*${X}`,
    };
  }
  const [L1, L2, L3] = r.pick(TRIPLES);
  let A = 2, B = 3, q = 2, C = 2;
  for (let k = 0; k < 60; k++) {
    A = r.int(2, 7);
    B = r.int(2, 7);
    q = r.int(2, 5);
    C = r.int(2, 9);
    if ((A + B) ** 2 > q * C) break; // keep the answer positive
  }
  const S = A + B;
  const ans = S * S - q * C;
  const e = `(${L1} + ${L2})^2 - ${q}${L3}`;
  return {
    difficulty: "challenge",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`], [L3, `${C}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `Bracket first: ${A} + ${B} = ${S}, and ${m(`${S}^2`)} = ${S * S}. Then ${m(`${q}${L3}`)} = ${q * C}, and ${S * S} − ${q * C} = ${ans}.`,
    slips: [
      {
        v: A * A + B * B - q * C,
        feedback: `This comes from squaring each letter separately (${m(`${A}^2 + ${B}^2`)} − ${q * C}). ${m(`(${L1} + ${L2})^2`)} means add first, then square: ${m(`${S}^2`)} = ${S * S}.`,
      },
      {
        v: 2 * S - q * C,
        feedback: `This comes from doubling the bracket instead of squaring it (${S} × 2 − ${q * C}). ${m(`${S}^2`)} means ${S} × ${S} = ${S * S}.`,
      },
      {
        v: (S * S - q) * C,
        feedback: `This comes from working left to right: ${S * S} − ${q} = ${S * S - q}, then × ${C}. ${m(`${q}${L3}`)} is one term (${q} × ${C} = ${q * C}), and it must be worked out before subtracting.`,
      },
    ],
    explanation: `Follow BIDMAS. Brackets: ${L1} + ${L2} = ${A} + ${B} = ${S}. Indices: ${m(`${S}^2`)} = ${S * S}. Multiplication: ${m(`${q}${L3}`)} = ${q} × ${C} = ${q * C}. Subtraction last: ${S * S} − ${q * C} = ${ans}. Notice ${m(`(${L1} + ${L2})^2`)} is not the same as ${m(`${L1}^2 + ${L2}^2`)}: here it's ${S * S}, not ${A * A} + ${B * B} = ${A * A + B * B}.`,
    solution: [
      `Put the numbers in: ${m(`${e} = (${A} + ${B})^2 - ${q} * ${C}`)}.`,
      `Bracket first: ${A} + ${B} = ${S}. Then square: ${m(`${S}^2`)} = ${S * S}.`,
      `Multiply: ${q} × ${C} = ${q * C}.`,
      `Subtract: ${S * S} − ${q * C} = **${ans}**.`,
    ],
    hints: [`Work out the bracket first, then square the result.`, `${m(`${q}${L3}`)} means ${q} × ${L3}. Work it out before you subtract.`],
    verify: `(${A}+${B})^2-${q}*${C}`,
    commonError: `Squaring each letter separately: ${m(`(${L1} + ${L2})^2`)} is ${m(`${S}^2`)} = ${S * S}, not ${A * A} + ${B * B}.`,
    sig: `br2:(${[A, B].sort(asc).join("+")})^2-${q}*${C}`,
  };
}

/** √(a² + b²) with a Pythagorean triple */
function basicsRoot(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const [a0, b0, c0] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [12, 16, 20]] as const);
  const [A, B] = r.chance(0.5) ? [a0, b0] : [b0, a0];
  const inside = A * A + B * B;
  const e = `sqrt(${L1}^2 + ${L2}^2)`;
  return {
    difficulty: "challenge",
    question: `If ${given([[L1, `${A}`], [L2, `${B}`]])}, work out ${m(e)}.`,
    answer: c0,
    correct: `${m(`${A}^2 + ${B}^2`)} = ${A * A} + ${B * B} = ${inside}, and ${m(`sqrt(${inside})`)} = ${c0} because ${c0} × ${c0} = ${inside}.`,
    slips: [
      {
        v: A + B,
        feedback: `This comes from square-rooting each term separately (${m(`sqrt(${A * A})`)} + ${m(`sqrt(${B * B})`)} = ${A} + ${B}). The √ sign works like a bracket: add everything underneath first, then take the root.`,
      },
      {
        v: inside,
        feedback: `${inside} is what's under the root sign — you stopped one step early. Finish by square-rooting: ${m(`sqrt(${inside})`)}.`,
      },
      {
        v: A + B * B,
        feedback: `This comes from square-rooting only the first term (${m(`sqrt(${A * A})`)} + ${B * B}). The √ sign covers everything under it, so work out ${A * A} + ${B * B} = ${inside} first.`,
      },
    ],
    explanation: `A square root works like a bracket: finish everything underneath it first. ${m(`${L1}^2`)} = ${A * A} and ${m(`${L2}^2`)} = ${B * B}, so the inside is ${A * A} + ${B * B} = ${inside}. Then ${m(`sqrt(${inside})`)} = ${c0}, because ${c0} × ${c0} = ${inside}. It is not ${A} + ${B} = ${A + B} — you can't square-root the pieces separately.`,
    solution: [
      `Put the numbers in: ${m(`${e} = sqrt(${A}^2 + ${B}^2)`)}.`,
      `Work under the root first: ${m(`${A}^2 + ${B}^2`)} = ${A * A} + ${B * B} = ${inside}.`,
      `Square-root: ${m(`sqrt(${inside})`)} = **${c0}** (check: ${c0} × ${c0} = ${inside}).`,
    ],
    hints: [`The √ sign acts like a bracket. What is the whole of the inside?`, `Once you have a single number under the root, ask: which number times itself makes it?`],
    verify: `sqrt(${A}^2+${B}^2)`,
    commonError: `Square-rooting each term separately: ${m(`sqrt(${L1}^2 + ${L2}^2)`)} is ${c0}, not ${A} + ${B} = ${A + B}.`,
    sig: `rt:${[A, B].sort(asc).join(",")}`,
  };
}

const suBasics: Generator = {
  id: "su-basics",
  topic: "su",
  section: "su-basics",
  label: "Substitute positive whole numbers (hidden ×, brackets, powers, BIDMAS)",
  kinds: ["mcq", "qa"],
  make(r) {
    return build(
      pickTemplate(r, [
        [2, basicsTwoTerms],
        [2, basicsBracket],
        [2, basicsCoefSquare],
        [2, basicsSquarePlus],
        [2, basicsFractionLine],
        [2, basicsProduct],
        [1, basicsAbOverC],
        [2, basicsChallenge],
        [1, basicsRoot],
      ]),
    );
  },
};

// ---------------------------------------------------------------------------
// su-negatives — substituting negative numbers: (−a)² vs −a², subtracting a negative
// ---------------------------------------------------------------------------

/** x², x³ or 3x² with x negative — one step */
function negWarm(r: Rng): Item {
  const L = r.pick(["x", "y", "n", "e", "t", "k"]);
  const kind = r.pick(["sq", "cube", "coef"] as const);
  if (kind === "cube") {
    const K = r.int(2, 5);
    const ans = -(K ** 3);
    return {
      difficulty: "warmup",
      question: `If ${given([[L, `-${K}`]])}, work out ${m(`${L}^3`)}.`,
      answer: ans,
      correct: `(−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = ${ans}. Three negatives multiplied give a negative.`,
      slips: [
        { v: K ** 3, feedback: `${K ** 3} forgets the sign. The first two negatives make +${K * K}, but the third one makes it negative again: ${K * K} × (−${K}) = ${ans}.` },
        { v: -3 * K, feedback: `This comes from multiplying by 3 instead of cubing (−${K} × 3). ${m(`${L}^3`)} means ${L} × ${L} × ${L}.` },
        { v: K * K, feedback: `${K * K} is ${m(`(-${K})^2`)} — you squared instead of cubing. Multiply by −${K} one more time.` },
      ],
      explanation: `${m(`${L}^3`)} means ${L} × ${L} × ${L} = (−${K}) × (−${K}) × (−${K}). Do it in pairs: (−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = ${ans}. An odd number of negatives multiplied together gives a negative answer, so the cube of a negative number is always negative.`,
      solution: [
        `Put the value in with brackets: ${m(`${L}^3 = (-${K})^3 = (-${K}) * (-${K}) * (-${K})`)}.`,
        `First pair: (−${K}) × (−${K}) = ${K * K} (negative × negative = positive).`,
        `Then ${K * K} × (−${K}) = **${ans}**.`,
      ],
      hints: [`Write it out: (−${K}) × (−${K}) × (−${K}). What do the first two make?`],
      verify: `(-${K})^3`,
      commonError: `Losing the sign: ${m(`(-${K})^3`)} is ${ans}, not ${K ** 3} — three negatives multiply to a negative.`,
      sig: `nw:cube:${K}`,
    };
  }
  if (kind === "sq") {
    const K = r.int(3, 9);
    const ans = K * K;
    return {
      difficulty: "warmup",
      question: `If ${given([[L, `-${K}`]])}, work out ${m(`${L}^2`)}.`,
      answer: ans,
      correct: `(−${K}) × (−${K}) = ${ans} — a negative times a negative is positive.`,
      slips: [
        { v: -ans, feedback: `−${ans} comes from writing −${K}² without brackets, which squares only the ${K}. Put the negative in brackets: ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = +${ans}.` },
        { v: -2 * K, feedback: `This comes from doubling instead of squaring: 2 × (−${K}). ${m(`${L}^2`)} means ${L} × ${L}.` },
        { v: 2 * K, feedback: `This comes from doubling ${K} instead of squaring −${K}. ${m(`${L}^2`)} means ${L} × ${L} = (−${K}) × (−${K}).` },
      ],
      explanation: `${m(`${L}^2`)} means ${L} × ${L}, so put the value in with its brackets: ${m(`(-${K})^2`)} = (−${K}) × (−${K}). A negative times a negative is positive, so the answer is ${ans}. Without the brackets, −${K}² means −(${K}²) = −${ans} — that's why you always bracket a negative when you substitute it.`,
      solution: [
        `Put the value in with brackets: ${m(`${L}^2 = (-${K})^2 = (-${K}) * (-${K})`)}.`,
        `Negative × negative = positive, so the answer is **${ans}**.`,
      ],
      hints: [`Put the −${K} in brackets first. What is (−${K}) × (−${K})?`],
      verify: `(-${K})^2`,
      commonError: `Writing −${K}² instead of ${m(`(-${K})^2`)}: squaring a negative gives a positive, ${ans}.`,
      sig: `nw:sq:${K}`,
    };
  }
  const K = r.int(3, 6);
  const q = r.int(2, 5);
  const sq = K * K;
  const ans = q * sq;
  const e = `${q}${L}^2`;
  return {
    difficulty: "warmup",
    question: `If ${given([[L, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`(-${K})^2`)} = ${sq}, then ${q} × ${sq} = ${ans}.`,
    slips: [
      { v: -ans, feedback: `This comes from thinking ${m(`(-${K})^2`)} = −${sq}. A negative times a negative is positive, so ${m(`${L}^2`)} = +${sq} and ${m(e)} = ${q} × ${sq}.` },
      { v: (q * K) ** 2, feedback: `${(q * K) ** 2} is ${m(`(${q}${L})^2`)} = ${m(`(-${q * K})^2`)}. In ${m(e)} only the ${L} is squared: square −${K} first, then multiply by ${q}.` },
      { v: -2 * q * K, feedback: `This comes from doubling instead of squaring (${q} × (−${K}) × 2). ${m(`${L}^2`)} means ${L} × ${L} = (−${K}) × (−${K}).` },
    ],
    explanation: `Powers come before multiplying, and the power belongs only to the ${L}. So first ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = ${sq} — squaring a negative gives a positive. Then ${q} × ${sq} = ${ans}.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${q} * (-${K})^2`)}.`,
      `Indices first: ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = ${sq}.`,
      `Then multiply: ${q} × ${sq} = **${ans}**.`,
    ],
    hints: [`Which part is squared — the ${q}, the ${L}, or both? Work out ${m(`(-${K})^2`)} first.`],
    verify: `${q}*(-${K})^2`,
    commonError: `Thinking ${m(`(-${K})^2`)} = −${sq}; a negative squared is positive.`,
    sig: `nw:coef:${q}:${K}`,
  };
}

/** 2x² − 3x or 2x² + 3x with x negative (spec example: x = −4) */
function negQuadratic(r: Rng): Item {
  const L = r.pick(["x", "y", "n", "t", "k"]);
  const sub = r.chance(0.6);
  let q = 2, s = 3, K = 4;
  for (let k = 0; k < 60; k++) {
    q = r.int(2, 5);
    s = r.int(2, 9);
    K = r.int(2, 6);
    if (q !== s && q * K !== s) break;
  }
  const x = -K;
  const sq = K * K;
  const t1 = q * sq; // q·x²
  const t2 = s * x; // s·x (negative)
  const ans = sub ? t1 - t2 : t1 + t2;
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  const e = `${q}${L}^2 ${op} ${s}${L}`;
  const finish = sub ? `${t1} − (${t2}) = ${t1} + ${-t2} = ${ans}` : `${t1} + (${t2}) = ${t1} − ${-t2} = ${ans}`;
  return {
    difficulty: K >= 4 && sub ? "challenge" : "core",
    question: `If ${given([[L, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`(-${K})^2`)} = ${sq}, so ${m(`${q}${L}^2`)} = ${t1}; ${m(`${s}${L}`)} = ${t2}; and ${finish}.`,
    slips: [
      {
        v: sub ? -t1 - t2 : -t1 + t2,
        feedback: `This comes from thinking ${m(`(-${K})^2`)} = −${sq}. A negative times a negative is positive, so ${m(`${L}^2`)} = +${sq} and ${m(`${q}${L}^2`)} = +${t1}.`,
      },
      {
        v: sub ? t1 + t2 : t1 - t2,
        feedback: sub
          ? `This comes from losing the double negative: ${m(`${s}${L}`)} = ${s} × (−${K}) = ${t2}, and subtracting ${t2} is the same as adding ${-t2}. So it's ${t1} + ${-t2}, not ${t1} − ${-t2}.`
          : `This comes from using ${m(`${s}${L}`)} = +${-t2}. But ${s} × (−${K}) = ${t2}, so you add ${t2} — which takes away ${-t2}.`,
      },
      {
        v: sub ? (q * K) ** 2 - t2 : (q * K) ** 2 + t2,
        feedback: `This comes from squaring ${m(`${q}${L}`)} (${m(`(-${q * K})^2`)} = ${(q * K) ** 2}). In ${m(`${q}${L}^2`)} only the ${L} is squared: ${q} × ${sq} = ${t1}.`,
      },
      {
        v: sub ? -2 * q * K - t2 : -2 * q * K + t2,
        feedback: `This comes from doubling instead of squaring: ${q} × (−${K}) × 2 = ${-2 * q * K}. ${m(`${L}^2`)} means ${L} × ${L} = (−${K}) × (−${K}) = ${sq}.`,
      },
    ],
    explanation: `Put the value in with brackets: ${m(`${q} * (-${K})^2 ${op} ${s} * (-${K})`)}. Powers first: ${m(`(-${K})^2`)} = ${sq} (negative × negative is positive), so ${m(`${q}${L}^2`)} = ${q} × ${sq} = ${t1}. Next, ${s} × (−${K}) = ${t2}. Finally ${finish}${sub ? " — subtracting a negative is the same as adding" : ""}.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${q} * (-${K})^2 ${op} ${s} * (-${K})`)}.`,
      `Indices first: ${m(`(-${K})^2`)} = ${sq}, so ${m(`${q}${L}^2`)} = ${q} × ${sq} = ${t1}.`,
      `Next term: ${s} × (−${K}) = ${t2}.`,
      sub ? `Subtracting a negative adds: ${t1} − (${t2}) = ${t1} + ${-t2} = **${ans}**.` : `Adding a negative takes away: ${t1} + (${t2}) = ${t1} − ${-t2} = **${ans}**.`,
    ],
    hints: [`Write every ${L} as (−${K}), in brackets. What is ${m(`(-${K})^2`)}?`, `Work out ${s} × (−${K}) and watch the two signs next to each other: ${opT} (${t2}).`],
    verify: `${q}*(-${K})^2${op}${s}*(-${K})`,
    commonError: sub
      ? `Writing ${m(`(-${K})^2`)} as −${sq}, or forgetting that − ${s} × (−${K}) is + ${s * K}.`
      : `Writing ${m(`(-${K})^2`)} as −${sq}, or treating ${s} × (−${K}) as positive.`,
    sig: `nq:${q}*${x}^2${op}${s}*${x}`,
  };
}

/** 10 − x² with x negative */
function negMinusSquare(r: Rng): Item {
  const L = r.pick(["x", "y", "n", "t", "k"]);
  let c = 10, K = 3;
  for (let k = 0; k < 60; k++) {
    c = r.int(5, 30);
    K = r.int(3, 6);
    if (c !== K * K) break;
  }
  const sq = K * K;
  const ans = c - sq;
  const e = `${c} - ${L}^2`;
  return {
    difficulty: "core",
    question: `If ${given([[L, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`(-${K})^2`)} = (−${K}) × (−${K}) = ${sq}, and ${c} − ${sq} = ${ans}.`,
    slips: [
      { v: c + sq, feedback: `This comes from thinking ${m(`${L}^2`)} = −${sq}, so you did ${c} − (−${sq}). A negative times a negative is positive: (−${K}) × (−${K}) = ${sq}, so it's ${c} − ${sq}.` },
      { v: (c + K) ** 2, feedback: `This comes from subtracting before squaring: ${m(`(${c} - (-${K}))^2`)} = ${m(`${c + K}^2`)}. Powers come before subtraction, so square ${L} first.` },
      { v: c + 2 * K, feedback: `This comes from doubling instead of squaring: ${c} − 2 × (−${K}) = ${c} + ${2 * K}. ${m(`${L}^2`)} means ${L} × ${L}, not 2 × ${L}.` },
    ],
    explanation: `Powers come before subtraction (BIDMAS), so work out ${m(`${L}^2`)} first: ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = ${sq} — a negative times a negative is positive. Then ${c} − ${sq} = ${ans}. Keep the brackets round −${K} when you square it, so you square the whole of −${K}.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${c} - (-${K})^2`)}.`,
      `Indices first: ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = ${sq}.`,
      `Then subtract: ${c} − ${sq} = **${ans}**.`,
    ],
    hints: [`Which comes first in BIDMAS here: the subtraction or the square?`, `Work out ${m(`(-${K})^2`)} carefully — what is a negative times a negative?`],
    verify: `${c}-(-${K})^2`,
    commonError: `Thinking ${m(`(-${K})^2`)} = −${sq} and getting ${c + sq}; a negative squared is positive.`,
    sig: `nms:${c}-${K}`,
  };
}

/** 3(10 − e) with e negative (class recap) */
function negBracket(r: Rng): Item {
  const L = r.pick(["e", "x", "y", "n", "t", "k"]);
  let p = 3, c = 10, K = 3;
  for (let k = 0; k < 60; k++) {
    p = r.int(2, 6);
    c = r.int(3, 12);
    K = r.int(2, 9);
    if (c !== K && p !== c) break;
  }
  const inside = c + K;
  const ans = p * inside;
  const e = `${p}(${c} - ${L})`;
  return {
    difficulty: "core",
    question: `If ${given([[L, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${c} − (−${K}) = ${c} + ${K} = ${inside}, and ${p} × ${inside} = ${ans}.`,
    slips: [
      { v: p * (c - K), feedback: `This comes from ${p} × (${c} − ${K}). Subtracting −${K} is the same as adding ${K}, so the bracket is ${inside}, not ${c - K}.` },
      { v: p * c + K, feedback: `This comes from multiplying only the ${c} by ${p} (${p * c} − (−${K})). The ${p} multiplies the whole bracket: ${p} × ${inside}.` },
      { v: p * c - K, feedback: `This comes from ${p} × ${c} − ${K}: the ${p} didn't multiply the ${L}, and the double minus was missed. Work out the bracket first: ${c} − (−${K}) = ${inside}.` },
      { v: p + inside, feedback: `This comes from adding the ${p}. A number written next to a bracket means multiply: ${p} × ${inside}.` },
    ],
    explanation: `Put the value in with its own brackets: ${m(`${p}(${c} - (-${K}))`)}. Subtracting a negative is the same as adding, so ${c} − (−${K}) = ${c} + ${K} = ${inside}. Then ${p} × ${inside} = ${ans}. Always put a negative substitution in brackets so you can see both minus signs.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${p}(${c} - (-${K}))`)}.`,
      `Bracket first: ${c} − (−${K}) = ${c} + ${K} = ${inside} (taking away a negative adds).`,
      `Multiply: ${p} × ${inside} = **${ans}**.`,
    ],
    hints: [`Write it as ${m(`${p}(${c} - (-${K}))`)}. What is ${c} − (−${K})?`, `Subtracting a negative number is the same as adding the positive number.`],
    verify: `${p}*(${c}-(-${K}))`,
    commonError: `Working out ${c} − (−${K}) as ${c - K}; subtracting a negative adds, so it's ${inside}.`,
    sig: `nb:${p}(${c}-${-K})`,
  };
}

/** 5x − 3y + 8 or 4(2w + 3y) with y negative (class Task 2) */
function negTwoLetters(r: Rng): Item {
  const [L1, L2] = r.pick([["x", "y"], ["w", "y"], ["a", "b"], ["p", "q"], ["m", "n"]] as [string, string][]);
  if (r.chance(0.5)) {
    const q = r.int(2, 6), X = r.int(2, 9), s = r.int(2, 6), K = r.int(2, 9), c = r.int(2, 12);
    const ans = q * X + s * K + c;
    const e = `${q}${L1} - ${s}${L2} + ${c}`;
    return {
      difficulty: "core",
      question: `If ${given([[L1, `${X}`], [L2, `-${K}`]])}, work out ${m(e)}.`,
      answer: ans,
      correct: `${q} × ${X} = ${q * X}, and −${s} × (−${K}) = +${s * K}, so ${q * X} + ${s * K} + ${c} = ${ans}.`,
      slips: [
        {
          v: q * X - s * K + c,
          feedback: `This comes from ${q * X} − ${s * K} + ${c}. But −${s}${L2} = −${s} × (−${K}) = +${s * K} — a negative times a negative is positive — so it's ${q * X} + ${s * K} + ${c}.`,
        },
        {
          v: (q * X - s) * -K + c,
          feedback: `This comes from working left to right: ${q * X} − ${s} = ${q * X - s}, then × (−${K}). ${m(`${s}${L2}`)} is one term, ${s} × (−${K}) = ${-s * K}, and it must be worked out before subtracting.`,
        },
        {
          v: q * X - (s - K) + c,
          feedback: `This comes from reading ${m(`${s}${L2}`)} as ${s} + ${L2} = ${s - K}. A number next to a letter means multiply: ${s} × (−${K}) = ${-s * K}.`,
        },
      ],
      explanation: `Substitute with brackets round the negative: ${m(`${q} * ${X} - ${s} * (-${K}) + ${c}`)}. Multiply first: ${q} × ${X} = ${q * X} and ${s} × (−${K}) = ${-s * K}. Subtracting ${-s * K} is the same as adding ${s * K}, so the total is ${q * X} + ${s * K} + ${c} = ${ans}.`,
      solution: [
        `Put the values in with brackets: ${m(`${e} = ${q} * ${X} - ${s} * (-${K}) + ${c}`)}.`,
        `Multiply first: ${q} × ${X} = ${q * X} and ${s} × (−${K}) = ${-s * K}.`,
        `So it's ${q * X} − (${-s * K}) + ${c} = ${q * X} + ${s * K} + ${c} = **${ans}**.`,
      ],
      hints: [`Write ${L2} as (−${K}). What is ${s} × (−${K})?`, `Two minus signs next to each other — taking away a negative — make a plus.`],
      verify: `${q}*${X}-${s}*(-${K})+${c}`,
      commonError: `Getting −${s} × (−${K}) wrong: two negatives multiply to a positive, +${s * K}.`,
      sig: `n2a:${q}*${X}-${s}*${-K}+${c}`,
    };
  }
  let q = 4, rr = 2, X = 7, s = 3, K = 3;
  for (let k = 0; k < 60; k++) {
    q = r.int(2, 6);
    rr = r.int(2, 5);
    X = r.int(2, 9);
    s = r.int(2, 5);
    K = r.int(2, 6);
    if (rr * X > s * K) break;
  }
  const inside = rr * X - s * K;
  const ans = q * inside;
  const e = `${q}(${rr}${L1} + ${s}${L2})`;
  return {
    difficulty: "core",
    question: `If ${given([[L1, `${X}`], [L2, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${rr} × ${X} = ${rr * X} and ${s} × (−${K}) = ${-s * K}, so the bracket is ${inside} and ${q} × ${inside} = ${ans}.`,
    slips: [
      {
        v: q * (rr * X + s * K),
        feedback: `This comes from ${q} × (${rr * X} + ${s * K}). But ${m(`${s}${L2}`)} = ${s} × (−${K}) = ${-s * K}, so the bracket is ${rr * X} − ${s * K} = ${inside}.`,
      },
      {
        v: q * rr * X - s * K,
        feedback: `This comes from multiplying only the first term by ${q}. The ${q} multiplies the whole bracket, so work out ${rr * X} + (${-s * K}) = ${inside} first.`,
      },
      {
        v: q + inside,
        feedback: `This comes from adding the ${q}. A number written next to a bracket means multiply: ${q} × ${inside}.`,
      },
      {
        v: q * (rr * X + s - K),
        feedback: `This comes from reading ${m(`${s}${L2}`)} as ${s} + ${L2}. A number next to a letter means multiply: ${s} × (−${K}) = ${-s * K}.`,
      },
    ],
    explanation: `Brackets first. Inside: ${m(`${rr}${L1}`)} = ${rr} × ${X} = ${rr * X} and ${m(`${s}${L2}`)} = ${s} × (−${K}) = ${-s * K} (positive × negative is negative). So the bracket is ${rr * X} + (${-s * K}) = ${inside}. Then ${q} × ${inside} = ${ans}.`,
    solution: [
      `Put the values in with brackets: ${m(`${e} = ${q}(${rr} * ${X} + ${s} * (-${K}))`)}.`,
      `Inside the bracket: ${rr * X} + (${-s * K}) = ${rr * X} − ${s * K} = ${inside}.`,
      `Multiply: ${q} × ${inside} = **${ans}**.`,
    ],
    hints: [`Work out the bracket first. What is ${s} × (−${K})?`, `Adding a negative number is the same as subtracting.`],
    verify: `${q}*(${rr}*${X}+${s}*(-${K}))`,
    commonError: `Treating ${s} × (−${K}) as +${s * K}; a positive times a negative is negative.`,
    sig: `n2b:${q}(${rr}*${X}+${s}*${-K})`,
  };
}

/** wx − (x + T) and y² + x(2w − T) style (class Task 2 challenges) */
function negChallenge(r: Rng): Item {
  if (r.chance(0.5)) {
    const [L1, L2, L3] = r.pick([["w", "x", "T"], ["a", "b", "c"], ["p", "q", "r"], ["m", "n", "k"]] as [string, string, string][]);
    let A = 7, B = 4, K = 6;
    for (let k = 0; k < 60; k++) {
      A = r.int(2, 9);
      B = r.int(2, 8);
      K = r.int(B + 1, B + 8);
      if (K !== 2 * B) break;
    }
    const inside = B - K; // negative
    const ab = A * B;
    const ans = ab - inside;
    const e = `${L1}${L2} - (${L2} + ${L3})`;
    return {
      difficulty: "challenge",
      question: `If ${given([[L1, `${A}`], [L2, `${B}`], [L3, `-${K}`]])}, work out ${m(e)}.`,
      answer: ans,
      correct: `${L2} + ${L3} = ${B} + (−${K}) = ${inside}, and ${ab} − (${inside}) = ${ab} + ${-inside} = ${ans}.`,
      slips: [
        {
          v: ab - (B + K),
          feedback: `This comes from using ${L3} = ${K}: ${ab} − (${B} + ${K}) = ${ab} − ${B + K}. But ${L3} is −${K}, so ${L2} + ${L3} = ${B} + (−${K}) = ${inside}.`,
        },
        {
          v: ab - -inside,
          feedback: `The bracket is ${inside} ✓ — but ${ab} − (${inside}) is not ${ab - -inside}. Subtracting a negative adds: ${ab} − (${inside}) = ${ab} + ${-inside}.`,
        },
        {
          v: A * (B - inside),
          feedback: `This comes from multiplying ${L1} by everything after it: ${A} × (${B} − (${inside})). ${m(`${L1}${L2}`)} is a term on its own: ${A} × ${B} = ${ab}.`,
        },
      ],
      explanation: `Work out the pieces first. ${m(`${L1}${L2}`)} = ${A} × ${B} = ${ab}. The bracket: ${L2} + ${L3} = ${B} + (−${K}) = ${inside}. Then ${ab} − (${inside}) = ${ab} + ${-inside} = ${ans}. Two minus signs next to each other — taking away a negative — make a plus.`,
      solution: [
        `Put the values in with brackets: ${m(`${e} = ${A} * ${B} - (${B} + (-${K}))`)}.`,
        `${m(`${L1}${L2}`)} = ${A} × ${B} = ${ab}. Bracket: ${B} + (−${K}) = ${inside}.`,
        `Subtracting a negative adds: ${ab} − (${inside}) = ${ab} + ${-inside} = **${ans}**.`,
      ],
      hints: [`Work out ${m(`${L1}${L2}`)} and the bracket (${m(`${L2} + ${L3}`)}) separately.`, `You'll end up subtracting a negative number. What does that do?`],
      verify: `${A}*${B}-(${B}+(-${K}))`,
      commonError: `Finishing with ${ab} − ${-inside} instead of ${ab} − (${inside}) = ${ab} + ${-inside}.`,
      sig: `nc1:${A}*${B}-(${B}${-K})`,
    };
  }
  const [L1, L2] = r.pick([["x", "y"], ["a", "b"], ["p", "q"], ["m", "n"], ["s", "t"]] as [string, string][]);
  let A = 4, c = 5, K = 3;
  for (let k = 0; k < 60; k++) {
    A = r.int(2, 6);
    c = r.int(2, 9);
    K = r.int(2, 6);
    if (c !== K && A !== K) break;
  }
  const sq = K * K;
  const inside = c + K;
  const ans = sq + A * inside;
  const e = `${L2}^2 + ${L1}(${c} - ${L2})`;
  return {
    difficulty: "challenge",
    question: `If ${given([[L1, `${A}`], [L2, `-${K}`]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`(-${K})^2`)} = ${sq} and ${c} − (−${K}) = ${inside}, so ${sq} + ${A} × ${inside} = ${sq} + ${A * inside} = ${ans}.`,
    slips: [
      {
        v: -sq + A * inside,
        feedback: `This comes from thinking ${m(`(-${K})^2`)} = −${sq}. (−${K}) × (−${K}) = +${sq}, so it's ${sq} + ${A * inside}.`,
      },
      {
        v: sq + A * (c - K),
        feedback: `This comes from ${c} − ${K} = ${c - K} in the bracket. ${L2} is −${K}, so ${c} − (−${K}) = ${c} + ${K} = ${inside}.`,
      },
      {
        v: (sq + A) * inside,
        feedback: `This comes from adding ${sq} + ${A} before multiplying by ${inside}. Multiplication comes before addition: ${A} × ${inside} first.`,
      },
      {
        v: -sq + A * (c - K),
        feedback: `Two sign slips: ${m(`(-${K})^2`)} is +${sq} (not −${sq}), and ${c} − (−${K}) is ${inside} (not ${c - K}).`,
      },
    ],
    explanation: `Do it in stages. ${m(`${L2}^2`)} = (−${K}) × (−${K}) = ${sq}. Inside the bracket: ${c} − (−${K}) = ${c} + ${K} = ${inside}. Then ${m(`${L1}(${c} - ${L2})`)} = ${A} × ${inside} = ${A * inside}. Finally ${sq} + ${A * inside} = ${ans}. Three traps in one question: the square of a negative, subtracting a negative, and multiplying before adding.`,
    solution: [
      `Put the values in with brackets: ${m(`${e} = (-${K})^2 + ${A}(${c} - (-${K}))`)}.`,
      `${m(`(-${K})^2`)} = ${sq}. Bracket: ${c} − (−${K}) = ${inside}.`,
      `Multiply: ${A} × ${inside} = ${A * inside}.`,
      `Add: ${sq} + ${A * inside} = **${ans}**.`,
    ],
    hints: [`Work out ${m(`${L2}^2`)} and the bracket separately first.`, `Inside the bracket you subtract −${K}. What does that become?`, `${m(`${L1}(…)`)} means ${L1} × the bracket — do that before adding.`],
    verify: `(-${K})^2+${A}*(${c}-(-${K}))`,
    commonError: `Writing ${m(`(-${K})^2`)} as −${sq} or ${c} − (−${K}) as ${c - K}.`,
    sig: `nc2:${A}:${c}:${K}`,
  };
}

const suNegatives: Generator = {
  id: "su-negatives",
  topic: "su",
  section: "su-negatives",
  label: "Substitute negative numbers: (−a)² vs −a², subtracting a negative",
  kinds: ["mcq", "qa"],
  make(r) {
    return build(
      pickTemplate(r, [
        [2, negWarm],
        [3, negQuadratic],
        [2, negMinusSquare],
        [2, negBracket],
        [2, negTwoLetters],
        [2, negChallenge],
      ]),
    );
  },
};

// ---------------------------------------------------------------------------
// su-formula — using a formula: v = u + at, ½bh, ½(a + b)h, ½mv², 2(l + w), 9C/5 + 32
// ---------------------------------------------------------------------------

/** v = u + at, sometimes braking (a negative) */
function formulaSpeed(r: Rng): Item {
  const slow = r.chance(0.4);
  let u: number, a: number, t: number;
  if (slow) {
    a = -r.int(2, 4);
    t = r.int(2, 5);
    u = r.int(-a * t + 1, -a * t + 10);
  } else {
    a = r.int(2, 4);
    t = r.int(a === 2 ? 3 : 2, 8);
    u = r.int(2, 15);
  }
  const at = a * t;
  const ans = u + at;
  const intro = slow
    ? `A car is braking, so its acceleration a is negative. Its speed v (in m/s) after t seconds is given by ${m("v = u + at")}.`
    : `A train is speeding up. Its speed v (in m/s) after t seconds is given by ${m("v = u + at")}.`;
  const slips: Cand[] = [
    { v: (u + a) * t, feedback: `This comes from adding u + a first: (${u} + ${vb(a)}) × ${t}. Multiplication comes before addition, so work out at = ${vb(a)} × ${t} first.` },
    { v: u + a + t, feedback: `This comes from adding all three numbers. at means a × t, not a + t.` },
    { v: u * a * t, feedback: `This comes from multiplying all three numbers. The formula adds u; only a and t are multiplied.` },
  ];
  if (slow) {
    slips.unshift({
      v: u - at,
      feedback: `This comes from adding ${-at} instead of ${at}. With a = ${a}, at = (${a}) × ${t} = ${at}, and adding a negative takes away: ${u} + (${at}) = ${u} − ${-at}.`,
    });
  }
  return {
    difficulty: slow ? "core" : r.chance(0.4) ? "warmup" : "core",
    question: `${intro} Work out v when ${given([["u", `${u}`], ["a", `${a}`], ["t", `${t}`]])}.`,
    prompt: "Give your answer in m/s.",
    answer: ans,
    unit: " m/s",
    correct: `at = ${vb(a)} × ${t} = ${at}, and ${u} + ${vb(at)} = ${ans} m/s.`,
    slips,
    explanation: `Substitute: ${m(`v = ${u} + ${slow ? `(${a})` : a} * ${t}`)}. "at" means a × t, and multiplication comes before addition, so ${vb(a)} × ${t} = ${at} first. Then v = ${u} + ${vb(at)} = ${ans} m/s. ${slow ? `It makes sense: the car starts at ${u} m/s and loses ${-a} m/s every second for ${t} seconds.` : `It makes sense: the train starts at ${u} m/s and speeds up by ${a} m/s every second for ${t} seconds.`}`,
    solution: [
      `Write the formula with the numbers in: ${m(`v = ${u} + ${slow ? `(${a})` : a} * ${t}`)}.`,
      `Multiply first: ${vb(a)} × ${t} = ${at}.`,
      slow ? `Then add: ${u} + (${at}) = ${u} − ${-at} = **${ans} m/s**.` : `Then add: ${u} + ${at} = **${ans} m/s**.`,
    ],
    hints: [`Which operation is hiding between a and t?`, `Do the multiplication before the addition.`],
    verify: `${u}+(${a})*${t}`,
    commonError: `Working out (u + a) × t instead of u + (a × t): multiplication comes before addition.`,
    marks: slow ? 2 : undefined,
    sig: `v:${u}:${a}:${t}`,
  };
}

/** A = ½bh */
function formulaTriangle(r: Rng): Item {
  let b = 6, h = 4;
  for (let k = 0; k < 60; k++) {
    b = r.int(3, 16);
    h = r.int(3, 14);
    if ((b * h) % 2 === 0 && b !== h) break;
  }
  const ans = (b * h) / 2;
  return {
    difficulty: "warmup",
    question: `The area of a triangle is ${m("A = 1/2 bh")}, where b is the base and h is the height. Find A when ${given([["b", `${b}`], ["h", `${h}`]])} (all in centimetres).`,
    prompt: "Give your answer in cm².",
    answer: ans,
    unit: " cm²",
    correct: `${m("1/2")} × ${b} × ${h} = ${m("1/2")} × ${b * h} = ${ans} cm².`,
    slips: [
      { v: b * h, feedback: `${b * h} cm² is b × h = ${b} × ${h} — you forgot to halve. The ${m("1/2")} at the front means divide by 2.` },
      { v: (b + h) / 2, feedback: `This comes from adding b and h (${b} + ${h} = ${b + h}) and halving. bh means b × h.` },
      { v: (b * h) / 4, feedback: `This comes from halving twice (half of ${b} times half of ${h}). The ${m("1/2")} is used once: ${m("1/2")} × ${b} × ${h}.` },
      { v: 2 * b * h, feedback: `This comes from doubling instead of halving. ${m("1/2")} × ${b * h} means half of ${b * h}.` },
    ],
    explanation: `Substitute: ${m(`A = 1/2 * ${b} * ${h}`)}. bh means b × h = ${b * h}, and ${m("1/2")} of that is ${ans}. So A = ${ans} cm². It works because a triangle is half of a rectangle measuring ${b} cm by ${h} cm.`,
    solution: [
      `Write the formula with the numbers in: ${m(`A = 1/2 * ${b} * ${h}`)}.`,
      `Multiply: ${b} × ${h} = ${b * h}.`,
      `Halve: ${m("1/2")} × ${b * h} = **${ans} cm²**.`,
    ],
    hints: [`What does bh mean when the letters sit side by side?`, `Multiply b by h, then take half.`],
    verify: `1/2*${b}*${h}`,
    commonError: `Forgetting the ${m("1/2")} and giving b × h, the area of the whole rectangle.`,
    sig: `tri:${[b, h].sort(asc).join("*")}`,
  };
}

/** Trapezium A = ½(a + b)h */
function formulaTrapezium(r: Rng): Item {
  let a = 5, b = 9, h = 4;
  for (let k = 0; k < 60; k++) {
    a = r.int(2, 14);
    b = r.int(2, 14);
    h = r.int(2, 12);
    if (a !== b && ((a + b) * h) % 2 === 0 && a !== h && b !== h) break;
  }
  const s = a + b;
  const ans = (s * h) / 2;
  return {
    difficulty: "core",
    question: `The area of a trapezium is ${m("A = 1/2 (a + b)h")}, where a and b are the parallel sides and h is the height. Find A when ${given([["a", `${a}`], ["b", `${b}`], ["h", `${h}`]])} (all in centimetres).`,
    prompt: "Give your answer in cm².",
    answer: ans,
    unit: " cm²",
    correct: `a + b = ${s}, then ${m("1/2")} × ${s} × ${h} = ${ans} cm².`,
    slips: [
      { v: s * h, feedback: `${s * h} cm² is (${a} + ${b}) × ${h} — you forgot to halve. The ${m("1/2")} at the front means divide by 2.` },
      { v: a / 2 + b * h, feedback: `This comes from ignoring the bracket (${m("1/2")} × ${a} + ${b} × ${h}). The bracket means add a and b first.` },
      { v: (a + b * h) / 2, feedback: `This comes from working out a + bh = ${a} + ${b * h} first and then halving. The bracket comes first: (${a} + ${b}) × ${h}.` },
      { v: s / 2 + h, feedback: `This comes from adding h instead of multiplying by it. (a + b)h means (a + b) × h.` },
    ],
    explanation: `Brackets first: a + b = ${a} + ${b} = ${s}. Then multiply by h: ${s} × ${h} = ${s * h}. Finally halve: ${m("1/2")} × ${s * h} = ${ans} cm². It works because two copies of the trapezium fit together to make a parallelogram with base (a + b) and height h.`,
    solution: [
      `Write the formula with the numbers in: ${m(`A = 1/2 (${a} + ${b}) * ${h}`)}.`,
      `Bracket first: ${a} + ${b} = ${s}.`,
      `Multiply by h: ${s} × ${h} = ${s * h}.`,
      `Halve: ${m("1/2")} × ${s * h} = **${ans} cm²**.`,
    ],
    hints: [`What does the bracket tell you to do first?`, `After the bracket, multiply by h and halve (in either order).`],
    verify: `1/2*(${a}+${b})*${h}`,
    commonError: `Forgetting the ${m("1/2")}, or not adding a and b before multiplying by h.`,
    sig: `trap:(${[a, b].sort(asc).join("+")})*${h}`,
  };
}

/** E = ½mv², sometimes with a negative velocity */
function formulaEnergy(r: Rng): Item {
  const back = r.chance(0.35);
  const mass = r.pick([4, 6, 8, 10, 12, 16, 20, 30, 40, 50, 60]);
  const V = r.int(2, mass >= 30 ? 4 : 6);
  const vel = back ? -V : V;
  const sq = V * V;
  const ans = (mass * sq) / 2;
  const intro = back
    ? `A trolley of mass m = ${mass} kg rolls backwards, so its velocity is negative: v = ${num(vel)} m/s.`
    : `An object of mass m = ${mass} kg moves with velocity v = ${vel} m/s.`;
  const slips: Cand[] = [];
  if (back) {
    slips.push({ v: -ans, feedback: `This comes from thinking ${m(`(-${V})^2`)} = −${sq}. A negative times a negative is positive, so ${m("v^2")} = ${sq} and the energy is positive.` });
  }
  slips.push(
    { v: mass * sq, feedback: `This is m × ${m("v^2")} = ${mass} × ${sq} — you forgot to halve. The ${m("1/2")} at the front means divide by 2.` },
    { v: (mass * vel) / 2, feedback: `This comes from forgetting to square v (${m("1/2")} × ${mass} × ${vb(vel)}). Square the velocity first: ${m(`${v(vel)}^2`)} = ${sq}.` },
    { v: ((mass * V) / 2) ** 2, feedback: `This comes from squaring the whole of ${m("1/2")} × ${mass} × ${vb(vel)} = ${num((mass * vel) / 2)}. Only the v is squared.` },
    { v: ((mass * V) ** 2) / 2, feedback: `This comes from squaring m as well as v (${m("1/2")} × ${m(`${mass * V}^2`)}). In ${m("1/2 mv^2")} only the v is squared.` },
  );
  return {
    difficulty: back ? "challenge" : "core",
    question: `${intro} Use ${m("E = 1/2 mv^2")} to find its kinetic energy E, in joules (J).`,
    prompt: "Give your answer in joules.",
    answer: ans,
    unit: " J",
    correct: `${m("v^2")} = ${m(`${v(vel)}^2`)} = ${sq}, then ${m("1/2")} × ${mass} × ${sq} = ${ans} J.`,
    slips,
    explanation: `Substitute m = ${mass} and v = ${num(vel)}: ${m(`E = 1/2 * ${mass} * ${v(vel)}^2`)}. Powers first: ${m(`${v(vel)}^2`)} = ${sq}${back ? " (a negative squared is positive)" : ""}. Then multiply: half of ${mass} is ${mass / 2}, and ${mass / 2} × ${sq} = ${ans}, so E = ${ans} J. The squared sign belongs to v only, not to m.`,
    solution: [
      `Write the formula with the numbers in: ${m(`E = 1/2 * ${mass} * ${v(vel)}^2`)}.`,
      `Indices first: ${m(`${v(vel)}^2`)} = ${sq}.`,
      `Then ${m("1/2")} × ${mass} = ${mass / 2}, and ${mass / 2} × ${sq} = **${ans} J**.`,
    ],
    hints: [`Which letter is squared in ${m("1/2 mv^2")}? Work that part out first.`, back ? `What is ${m(`(-${V})^2`)}? Watch the sign.` : `After squaring, halve the mass and multiply.`],
    verify: `1/2*${mass}*${v(vel)}^2`,
    commonError: back ? `Writing ${m(`(-${V})^2`)} as −${sq}, or forgetting the ${m("1/2")}.` : `Forgetting the ${m("1/2")}, or squaring m × v instead of just v.`,
    sig: `ke:${mass}:${vel}`,
  };
}

/** P = 2(l + w) */
function formulaPerimeter(r: Rng): Item {
  const l = r.int(5, 20);
  let w = r.int(2, 12);
  while (w >= l) w = r.int(2, 12);
  const s = l + w;
  const ans = 2 * s;
  return {
    difficulty: "warmup",
    question: `The perimeter of a rectangle is ${m("P = 2(l + w)")}, where l is the length and w is the width. Find P when ${given([["l", `${l}`], ["w", `${w}`]])} (all in centimetres).`,
    prompt: "Give your answer in cm.",
    answer: ans,
    unit: " cm",
    correct: `l + w = ${s}, and 2 × ${s} = ${ans} cm.`,
    slips: [
      { v: 2 * l + w, feedback: `This comes from doubling only the l (2 × ${l} + ${w}). The 2 multiplies the whole bracket: 2 × (${l} + ${w}).` },
      { v: s, feedback: `${s} cm is l + w — only two of the four sides. The 2 in front means double it.` },
      { v: 2 * l * w, feedback: `This comes from multiplying l and w (2 × ${l} × ${w}). There's a + inside the bracket, so add first.` },
      { v: 2 + s, feedback: `This comes from adding the 2. A number next to a bracket means multiply: 2 × ${s}.` },
    ],
    explanation: `Substitute: ${m(`P = 2(${l} + ${w})`)}. Bracket first: ${l} + ${w} = ${s}. Then double it: 2 × ${s} = ${ans} cm. It makes sense: a rectangle has two lengths and two widths, so P = ${l} + ${w} + ${l} + ${w} = ${ans} too.`,
    solution: [
      `Write the formula with the numbers in: ${m(`P = 2(${l} + ${w})`)}.`,
      `Bracket first: ${l} + ${w} = ${s}.`,
      `Multiply: 2 × ${s} = **${ans} cm**.`,
    ],
    hints: [`What does the bracket tell you to do first?`, `A number next to a bracket means multiply the whole bracket.`],
    verify: `2*(${l}+${w})`,
    commonError: `Doubling only the length: 2 × ${l} + ${w} instead of 2 × (${l} + ${w}).`,
    sig: `per:${l}:${w}`,
  };
}

/** F = 9C/5 + 32, including negative temperatures */
function formulaFahrenheit(r: Rng): Item {
  const C = r.pick([-40, -30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 100]);
  const nine = 9 * C;
  const part = nine / 5;
  const ans = part + 32;
  const slips: Cand[] = [];
  if (C < 0) {
    slips.push({ v: -part + 32, feedback: `This comes from losing the minus sign and using C = ${-C} (${-part} + 32). But 9 × (${C}) = ${nine}, so ${m("(9C)/5")} = ${part}, and ${part} + 32 = ${ans}.` });
  }
  slips.push(
    { v: part, feedback: `This is just ${m("(9C)/5")} = ${part} — you forgot to add the 32 at the end.` },
    { v: (nine + 32) / 5, feedback: `This comes from dividing the 32 by 5 as well (${nine} + 32 = ${nine + 32}, then ÷ 5). Only 9C is over the 5, so work out ${m("(9C)/5")} = ${part} first and then add 32.` },
    { v: (9 * (C + 32)) / 5, feedback: `This comes from adding 32 to C first (${C} + 32 = ${C + 32}). Multiplication and division come before addition, so work out ${m("(9C)/5")} first.` },
  );
  if (C % 9 === 0) {
    slips.push({ v: (5 * C) / 9 + 32, feedback: `This comes from using ${m("5/9")} instead of ${m("9/5")}. The formula multiplies C by 9 and then divides by 5.` });
  }
  return {
    difficulty: C < 0 ? "challenge" : "core",
    question: `To change a temperature from °C to °F you can use the formula ${m("F = (9C)/5 + 32")}. Change ${num(C)}°C into °F.`,
    prompt: "Give your answer in °F.",
    answer: ans,
    unit: "°F",
    correct: `9 × ${vb(C)} = ${nine}, ${nine} ÷ 5 = ${part}, and ${part} + 32 = ${ans}°F.`,
    slips,
    explanation: `Substitute C = ${num(C)}: ${m(`F = (9 * ${v(C)})/5 + 32`)}. Multiply and divide first: 9 × ${vb(C)} = ${nine}, and ${nine} ÷ 5 = ${part}. Then add: ${part} + 32 = ${ans}. So ${num(C)}°C is ${ans}°F.${C < 0 ? " With a negative temperature, keep the sign all the way through." : ""}`,
    solution: [
      `Write the formula with the number in: ${m(`F = (9 * ${v(C)})/5 + 32`)}.`,
      `Multiply: 9 × ${vb(C)} = ${nine}. Divide: ${nine} ÷ 5 = ${part}.`,
      `Add 32: ${part} + 32 = **${ans}°F**.`,
    ],
    hints: [`Work out the fraction part, ${m("(9C)/5")}, before you add the 32.`, C < 0 ? `9 × ${vb(C)} is negative. What is it?` : `Multiply ${C} by 9, then divide by 5.`],
    verify: `9*${v(C)}/5+32`,
    commonError: `Adding the 32 too early, or dividing it by 5 as well — only 9C is divided by 5.`,
    sig: `f:${C}`,
  };
}

const suFormula: Generator = {
  id: "su-formula",
  topic: "su",
  section: "su-formulae",
  label: "Use a formula (v = u + at, ½bh, ½(a + b)h, ½mv², 2(l + w), 9C/5 + 32)",
  kinds: ["mcq", "qa"],
  make(r) {
    return build(
      pickTemplate(r, [
        [3, formulaSpeed],
        [2, formulaTriangle],
        [2, formulaTrapezium],
        [3, formulaEnergy],
        [1, formulaPerimeter],
        [2, formulaFahrenheit],
      ]),
    );
  },
};

// ---------------------------------------------------------------------------
// su-decimals — substituting decimals and simple fractions (no calculator)
// ---------------------------------------------------------------------------

/** Decimal places in a number such as 0.25 (2) or 1.5 (1). */
const dp = (x: number) => (String(tidy(Math.abs(x))).split(".")[1] ?? "").length;

/** 6 + hk with decimals (hk = 2.5 × 0.4 = 1) */
function decProduct(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const [h, k] = r.pick([[2.5, 0.4], [0.5, 6], [1.5, 4], [0.2, 15], [0.25, 8], [1.2, 5], [0.3, 20], [2.5, 6], [0.5, 0.4], [0.6, 0.5], [1.5, 0.2], [0.8, 2.5], [0.4, 0.5], [3.5, 2], [0.7, 3], [0.9, 2], [0.3, 0.3], [0.4, 0.2], [1.2, 0.5]] as const);
  const [x, y] = r.chance(0.5) ? [h, k] : [k, h];
  const prod = tidy(x * y);
  const sub = r.chance(0.35) && prod < 9;
  const c = sub ? r.int(Math.ceil(prod) + 1, 12) : r.int(2, 9);
  const ans = tidy(sub ? c - prod : c + prod);
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  const e = `${c} ${op} ${L1}${L2}`;
  const big = tidy(prod * 10);
  const places = dp(x) + dp(y);
  const ix = Math.round(x * 10 ** dp(x)), iy = Math.round(y * 10 ** dp(y));
  return {
    difficulty: dp(prod) >= 2 || sub ? "core" : r.chance(0.4) ? "warmup" : "core",
    question: `If ${given([[L1, num(x)], [L2, num(y)]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`${L1}${L2}`)} = ${num(x)} × ${num(y)} = ${num(prod)}, and ${c} ${opT} ${num(prod)} = ${num(ans)}.`,
    slips: [
      {
        v: tidy(sub ? c - big : c + big),
        feedback: `This comes from ${num(x)} × ${num(y)} = ${num(big)} — the decimal point is in the wrong place. Multiply without the decimal points, then put back ${places} decimal place${places === 1 ? "" : "s"}: ${num(x)} × ${num(y)} = ${num(prod)}.`,
      },
      {
        v: tidy(sub ? c - (x + y) : c + x + y),
        feedback: `This comes from adding ${L1} and ${L2} (${num(x)} + ${num(y)}). ${m(`${L1}${L2}`)} means ${L1} × ${L2}.`,
      },
      {
        v: tidy((sub ? c - x : c + x) * y),
        feedback: `This comes from working left to right: ${c} ${opT} ${num(x)} = ${num(tidy(sub ? c - x : c + x))}, then × ${num(y)}. Multiply before you ${sub ? "subtract" : "add"}: work out ${m(`${L1}${L2}`)} first.`,
      },
    ],
    explanation: `${m(`${L1}${L2}`)} means ${L1} × ${L2} = ${num(x)} × ${num(y)}. Multiply without the decimal points (${ix} × ${iy} = ${ix * iy}), then put back the ${places} decimal place${places === 1 ? "" : "s"} from the numbers you multiplied: ${num(x)} × ${num(y)} = ${num(prod)}. Multiplication comes before ${sub ? "subtraction" : "addition"}, so the answer is ${c} ${opT} ${num(prod)} = ${num(ans)}.`,
    solution: [
      `Put the numbers in: ${m(`${e} = ${c} ${op} ${num(x)} * ${num(y)}`)}.`,
      `Multiply first: ${num(x)} × ${num(y)} = ${num(prod)}.`,
      `Then ${sub ? "subtract" : "add"}: ${c} ${opT} ${num(prod)} = **${num(ans)}**.`,
    ],
    hints: [`What does ${m(`${L1}${L2}`)} mean? Put the × sign back in.`, `Work out ${num(x)} × ${num(y)} before you ${sub ? "subtract" : "add"} — and count the decimal places.`],
    verify: `${c}${op}${x}*${y}`,
    commonError: `Putting the decimal point in the wrong place: ${num(x)} × ${num(y)} = ${num(prod)}, not ${num(big)}.`,
    strategy: "Estimate first",
    sig: `dp:${c}${op}${[x, y].sort(asc).join("*")}`,
  };
}

/** 4(a + d) with decimals (class recap: a = 1.5, d = 0.5) */
function decBracket(r: Rng): Item {
  const [L1, L2] = r.pick(PAIRS);
  const vals = [0.5, 1.5, 2.5, 0.2, 0.4, 1.2, 0.8, 0.3, 0.7, 1.6, 2.4, 3.5, 0.6, 1.4];
  let a = 1.5, b = 0.5;
  for (let k = 0; k < 60; k++) {
    a = r.pick(vals);
    b = r.pick(vals);
    if (a !== b) break;
  }
  const sub = r.chance(0.35);
  if (sub && a < b) [a, b] = [b, a];
  const p = r.int(2, 6);
  const inside = tidy(sub ? a - b : a + b);
  const ans = tidy(p * inside);
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  const e = `${p}(${L1} ${op} ${L2})`;
  const slips: Cand[] = [
    { v: tidy(sub ? p * a - b : p * a + b), feedback: `This comes from multiplying only the ${L1} by ${p} (${p} × ${num(a)} ${opT} ${num(b)}). The ${p} multiplies the whole bracket, so work out ${num(a)} ${opT} ${num(b)} = ${num(inside)} first.` },
    { v: tidy(p + inside), feedback: `This comes from adding the ${p}. A number written next to a bracket means multiply: ${p} × ${num(inside)}.` },
    { v: tidy(p * (sub ? a + b : a - b)), feedback: `This comes from ${sub ? "adding" : "subtracting"} inside the bracket. Read the sign again: it is ${num(a)} ${opT} ${num(b)} = ${num(inside)}.` },
  ];
  if (!sub) slips.push({ v: tidy(p * a * b), feedback: `This comes from multiplying everything (${p} × ${num(a)} × ${num(b)}). There's a + inside the bracket, so add first.` });
  return {
    difficulty: "core",
    question: `If ${given([[L1, num(a)], [L2, num(b)]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${num(a)} ${opT} ${num(b)} = ${num(inside)}, and ${p} × ${num(inside)} = ${num(ans)}.`,
    slips,
    explanation: `Brackets first: ${num(a)} ${opT} ${num(b)} = ${num(inside)} (line up the decimal points). A number next to a bracket means multiply, so ${p} × ${num(inside)} = ${num(ans)}. Quick check by expanding: ${p} × ${num(a)} ${opT} ${p} × ${num(b)} = ${num(tidy(p * a))} ${opT} ${num(tidy(p * b))} = ${num(ans)} too.`,
    solution: [
      `Put the numbers in, keeping the bracket: ${m(`${e} = ${p}(${num(a)} ${op} ${num(b)})`)}.`,
      `Bracket first: ${num(a)} ${opT} ${num(b)} = ${num(inside)}.`,
      `Multiply: ${p} × ${num(inside)} = **${num(ans)}**.`,
    ],
    hints: [`Work out the bracket first — line up the decimal points.`, `A number next to a bracket means multiply the whole bracket.`],
    verify: `${p}*(${a}${op}${b})`,
    commonError: `Multiplying only the first number in the bracket by ${p}.`,
    sig: `db:${p}(${sub ? `${a}-${b}` : [a, b].sort(asc).join("+")})`,
  };
}

/** 2x² with x a decimal (class recap: d² with d = 0.5), sometimes negative */
function decSquare(r: Rng): Item {
  const L = r.pick(["x", "d", "y", "n", "t"]);
  const x = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.5, 1.2, -0.5, -0.3, -0.2, -0.4, -0.6]);
  const k = r.pick([2, 3, 4, 5]);
  const sq = tidy(x * x);
  const ans = tidy(k * sq);
  const e = `${k}${L}^2`;
  const X = Math.abs(x);
  const slips: Cand[] = [];
  if (x < 0) slips.push({ v: -ans, feedback: `This comes from thinking ${m(`(${num(x).replace("−", "-")})^2`)} is negative. A negative times a negative is positive: (${num(x)}) × (${num(x)}) = ${num(sq)}.` });
  slips.push({ v: tidy((k * x) ** 2), feedback: `This comes from squaring ${m(`${k}${L}`)} (${m(`(${k} * ${v(x)})^2`)} = ${m(`${v(tidy(k * x))}^2`)}). In ${m(e)} only the ${L} is squared.` });
  slips.push({ v: tidy(k * 2 * x), feedback: `This comes from doubling instead of squaring (${k} × ${vb(x)} × 2). ${m(`${L}^2`)} means ${L} × ${L}.` });
  slips.push({ v: tidy(k + sq), feedback: `This comes from adding the ${k} (${k} + ${num(sq)}). ${m(e)} means ${k} × ${m(`${L}^2`)}.` });
  if (X < 1) slips.push({ v: tidy(k * sq * 10), feedback: `This comes from ${m(`${v(x)}^2`)} = ${num(tidy(sq * 10))} — the decimal point is in the wrong place. ${num(X)} × ${num(X)} has ${2 * dp(X)} decimal places, so it is ${num(sq)}.` });
  return {
    difficulty: x < 0 || X > 1 ? "challenge" : "core",
    question: `If ${given([[L, num(x).replace("−", "-")]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`${v(x)}^2`)} = ${num(sq)}, then ${k} × ${num(sq)} = ${num(ans)}.`,
    slips,
    explanation: `Powers come before multiplying, and only the ${L} is squared. ${m(`${v(x)}^2`)} = ${vb(x)} × ${vb(x)}: work out ${String(Math.round(X * 10 ** dp(X)))} × ${String(Math.round(X * 10 ** dp(X)))} = ${Math.round(X * 10 ** dp(X)) ** 2}, then put back ${2 * dp(X)} decimal places to get ${num(sq)}${x < 0 ? " (negative × negative is positive)" : ""}. Then ${k} × ${num(sq)} = ${num(ans)}.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${k} * ${v(x)}^2`)}.`,
      `Indices first: ${m(`${v(x)}^2`)} = ${vb(x)} × ${vb(x)} = ${num(sq)}.`,
      `Then multiply: ${k} × ${num(sq)} = **${num(ans)}**.`,
    ],
    hints: [`Which part is squared — the ${k}, the ${L}, or both?`, `Work out ${num(X)} × ${num(X)} first: multiply without the decimal points, then count the decimal places.`],
    verify: `${k}*${v(x)}^2`,
    commonError: `Getting ${m(`${v(x)}^2`)} wrong — ${num(X)} × ${num(X)} = ${num(tidy(X * X))}, with ${2 * dp(X)} decimal places.`,
    sig: `ds:${k}*${x}^2`,
  };
}

/** 8x² with x = 1/2 (a simple fraction), answer a whole number */
function decFraction(r: Rng): Item {
  const L = r.pick(["x", "y", "n", "t", "a"]);
  const [p, q] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 5], [3, 5]] as const);
  const j = r.pick(q >= 4 ? [1, 2] : q === 2 ? [2, 3] : [1, 2, 3]);
  const k = q * q * j;
  const ans = j * p * p;
  const e = `${k}${L}^2`;
  const fx = `${p}/${q}`;
  const sqT = `${p * p}/${q * q}`;
  return {
    difficulty: p > 1 ? "challenge" : "core",
    question: `If ${given([[L, fx]])}, work out ${m(e)}.`,
    answer: ans,
    correct: `${m(`(${fx})^2 = ${sqT}`)}, and ${k} × ${m(sqT)} = ${ans}.`,
    slips: [
      { v: (k * p / q) ** 2, feedback: `This is ${m(`(${k}${L})^2`)} = ${m(`${(k * p) / q}^2`)}. Only ${L} is squared, so square ${m(fx)} first and then multiply by ${k}.` },
      { v: (k * p * p) / q, feedback: `This comes from squaring only the top of the fraction (${m(`${p * p}/${q}`)}). Square the top AND the bottom: ${m(`(${fx})^2 = ${sqT}`)}.` },
      { v: (k * p) / q, feedback: `This comes from not squaring at all (${k} × ${m(fx)}). ${m(`${L}^2`)} means ${m(fx)} × ${m(fx)}.` },
      { v: (2 * k * p) / q, feedback: `This comes from doubling instead of squaring (${k} × ${m(fx)} × 2). ${m(`${L}^2`)} means ${L} × ${L}.` },
      {
        v: k + (p * p) / (q * q),
        display: frac(k * q * q + p * p, q * q),
        spec: fracTrap(k * q * q + p * p, q * q),
        feedback: `This comes from adding the ${k} (${k} + ${m(sqT)}). ${m(e)} means ${k} × ${m(`${L}^2`)} — a number next to a letter means multiply.`,
      },
    ],
    explanation: `Powers before multiplication, so square ${L} first: ${m(`(${fx})^2`)} = ${m(fx)} × ${m(fx)} = ${m(sqT)} (square the top and the bottom). Then ${k} × ${m(sqT)} = ${k} ÷ ${q * q} × ${p * p} = ${ans}. Notice that squaring ${m(fx)} made it smaller — that happens to every number between 0 and 1.`,
    solution: [
      `Put the value in with brackets: ${m(`${e} = ${k} * (${fx})^2`)}.`,
      `Square the top and the bottom: ${m(`(${fx})^2 = ${sqT}`)}.`,
      `Multiply: ${k} × ${m(sqT)} = ${m(`${k * p * p}/${q * q}`)} = **${ans}**.`,
    ],
    hints: [`What is ${m(fx)} × ${m(fx)}? Multiply the tops and multiply the bottoms.`, `Multiplying by ${m(sqT)} is the same as dividing by ${q * q} and multiplying by ${p * p}.`],
    verify: `${k}*(${fx})^2`,
    commonError: `Squaring only the top of the fraction, or squaring ${k}${L} instead of just ${L}.`,
    sig: `df:${k}*${fx}^2`,
  };
}

const suDecimals: Generator = {
  id: "su-decimals",
  topic: "su",
  section: "su-negatives",
  label: "Substitute decimals and simple fractions",
  kinds: ["mcq", "qa"],
  make(r) {
    return build(
      pickTemplate(r, [
        [3, decProduct],
        [2, decBracket],
        [3, decSquare],
        [2, decFraction],
      ]),
    );
  },
};

// ---------------------------------------------------------------------------
// su-powers — squares, cubes and roots of negatives and of numbers between 0 and 1
// ---------------------------------------------------------------------------

/** 0.3² — and is it bigger or smaller than 0.3? */
function powDecSquare(r: Rng): Item {
  const k = r.int(2, 9);
  const x = k / 10;
  const ans = tidy(x * x);
  const X = num(x);
  const style = r.int(0, 2);
  const L = r.pick(["d", "x", "p", "y"]);
  const question =
    style === 0
      ? `Is ${m(`${X}^2`)} bigger or smaller than ${X}? Work out ${m(`${X}^2`)} to find out.`
      : style === 1
        ? `Work out ${m(`${X}^2`)} without a calculator.`
        : `If ${given([[L, X]])}, work out ${m(`${L}^2`)}.`;
  return {
    difficulty: k <= 5 ? "warmup" : "core",
    question,
    answer: ans,
    correct: `${X} × ${X} = ${num(ans)} (${k} × ${k} = ${k * k}, with 2 decimal places).`,
    slips: [
      { v: tidy(2 * x), feedback: `${num(tidy(2 * x))} is ${X} × 2 — you doubled instead of squaring. Squaring means multiplying the number by itself: ${X} × ${X}.` },
      { v: tidy(ans * 10), feedback: `Check the decimal point: ${k} × ${k} = ${k * k}, and ${X} × ${X} has two decimal places in total (one from each ${X}), so it is ${num(ans)}.` },
      { v: tidy(ans / 10), feedback: `That has one decimal place too many. ${X} × ${X} has 1 + 1 = 2 decimal places, so it is ${num(ans)}.` },
      { v: tidy(x / 2), feedback: `${num(tidy(x / 2))} is half of ${X}. Squaring isn't halving: ${X}² = ${X} × ${X}.` },
    ],
    explanation: `${m(`${X}^2`)} means ${X} × ${X}. Work out ${k} × ${k} = ${k * k}, then count decimal places: 1 + 1 = 2, so the answer is ${num(ans)}. Notice ${num(ans)} is *smaller* than ${X}: squaring a number between 0 and 1 makes it smaller, because you are taking a part (${X}) of something that is already less than 1.`,
    solution: [
      `${m(`${X}^2`)} = ${X} × ${X}.`,
      `${k} × ${k} = ${k * k}, and there are 2 decimal places in total, so ${m(`${X}^2`)} = **${num(ans)}**.`,
      `${num(ans)} < ${X}: squaring a number between 0 and 1 makes it smaller.`,
    ],
    hints: [`${m(`${X}^2`)} means ${X} × ${X}. Try ${k} × ${k} first, then count the decimal places.`, `How many decimal places are there altogether in ${X} × ${X}?`],
    verify: `${X}^2`,
    commonError: `Writing ${m(`${X}^2`)} = ${num(tidy(ans * 10))} (decimal point in the wrong place) or ${num(tidy(2 * x))} (doubling).`,
    sig: `p2:${X}`,
  };
}

/** 0.2³ */
function powDecCube(r: Rng): Item {
  const k = r.int(2, 5);
  const x = k / 10;
  const ans = tidy(x ** 3);
  const X = num(x);
  const sq = tidy(x * x);
  const L = r.pick(["x", "y", "n", "a"]);
  const asLetter = r.chance(0.5);
  return {
    difficulty: "core",
    question: asLetter ? `If ${given([[L, X]])}, work out ${m(`${L}^3`)}.` : `Work out ${m(`${X}^3`)} without a calculator.`,
    answer: ans,
    correct: `${X} × ${X} × ${X} = ${num(ans)} (${k} × ${k} × ${k} = ${k ** 3}, with 3 decimal places).`,
    slips: [
      { v: tidy(3 * x), feedback: `${num(tidy(3 * x))} is ${X} × 3 — you multiplied by 3 instead of cubing. Cubing means ${X} × ${X} × ${X}.` },
      { v: sq, feedback: `${num(sq)} is ${m(`${X}^2`)} — you squared instead of cubing. Multiply by ${X} once more.` },
      { v: tidy(ans * 10), feedback: `Check the decimal point: ${k} × ${k} × ${k} = ${k ** 3}, and there are 1 + 1 + 1 = 3 decimal places, so the answer is ${num(ans)}.` },
    ],
    explanation: `${m(`${X}^3`)} means ${X} × ${X} × ${X}. Work out ${k} × ${k} × ${k} = ${k ** 3}, then count decimal places: 1 + 1 + 1 = 3, so the answer is ${num(ans)}. It's much smaller than ${X} — every extra multiplication by a number between 0 and 1 makes the answer smaller still (${m(`${X}^2`)} = ${num(sq)}, ${m(`${X}^3`)} = ${num(ans)}).`,
    solution: [
      `${m(`${X}^3`)} = ${X} × ${X} × ${X}.`,
      `${X} × ${X} = ${num(sq)}, then ${num(sq)} × ${X} = **${num(ans)}**.`,
      `Check: ${k}³ = ${k ** 3} and there are 3 decimal places in total.`,
    ],
    hints: [`Write it out: ${X} × ${X} × ${X}. What is ${X} × ${X}?`, `Count the decimal places: one from each ${X}.`],
    verify: `${X}^3`,
    commonError: `Multiplying by 3 instead of cubing, or putting the decimal point in the wrong place.`,
    sig: `p3:${X}`,
  };
}

/** √0.49 */
function powDecRoot(r: Rng): Item {
  const k = r.int(2, 9);
  const ans = k / 10;
  const inside = tidy(ans * ans);
  const I = num(inside);
  const L = r.pick(["p", "y", "x", "w"]);
  const style = r.int(0, 2);
  const question =
    style === 0
      ? `Work out ${m(`sqrt(${I})`)} without a calculator.`
      : style === 1
        ? `If ${given([[L, I]])}, work out ${m(`sqrt(${L})`)}.`
        : `Which positive number, multiplied by itself, gives ${I}? Work out ${m(`sqrt(${I})`)}.`;
  return {
    difficulty: "core",
    question,
    answer: ans,
    correct: `${num(ans)} × ${num(ans)} = ${I}, so ${m(`sqrt(${I})`)} = ${num(ans)}.`,
    slips: [
      { v: tidy(ans / 10), feedback: `${num(tidy(ans / 10))} has the decimal point in the wrong place: ${num(tidy(ans / 10))} × ${num(tidy(ans / 10))} = ${num(tidy(inside / 100))}. Check by squaring: ${num(ans)} × ${num(ans)} = ${I}.` },
      { v: tidy(inside / 2), feedback: `${num(tidy(inside / 2))} is half of ${I} — you halved instead of square-rooting. The square root is the number that multiplies by itself to give ${I}.` },
      { v: tidy(inside * inside), feedback: `${num(tidy(inside * inside))} is ${m(`${I}^2`)} — you squared instead of square-rooting.` },
      { v: k, feedback: `${k} is ${m(`sqrt(${k * k})`)}, not ${m(`sqrt(${I})`)}. ${I} is ${k * k} hundredths, so its square root is ${k} tenths: ${num(ans)}.` },
    ],
    explanation: `${m(`sqrt(${I})`)} asks: which number times itself makes ${I}? Since ${k} × ${k} = ${k * k}, try ${num(ans)}: ${num(ans)} × ${num(ans)} = ${I} (two decimal places). So ${m(`sqrt(${I})`)} = ${num(ans)}. Notice the root is *bigger* than ${I} — square-rooting a number between 0 and 1 makes it bigger.`,
    solution: [
      `Look for a number that squares to ${I}. Since ${k} × ${k} = ${k * k}, try ${num(ans)}.`,
      `Check: ${num(ans)} × ${num(ans)} = ${I} ✓, so ${m(`sqrt(${I})`)} = **${num(ans)}**.`,
      `${num(ans)} > ${I}: square-rooting a number between 0 and 1 makes it bigger.`,
    ],
    hints: [`Which number multiplied by itself gives ${I}? Think about ${k} × ${k} = ${k * k}.`, `Check your answer by squaring it — count the decimal places.`],
    verify: `sqrt(${I})`,
    commonError: `Getting ${m(`sqrt(${I})`)} = ${num(tidy(ans / 10))}: check by squaring — ${num(tidy(ans / 10))} × ${num(tidy(ans / 10))} = ${num(tidy(inside / 100))}.`,
    strategy: "Work backwards",
    sig: `pr:${I}`,
  };
}

/** (−2)³, (−5)², −5², (−0.3)², ∛(−27) */
function powNegative(r: Rng): Item {
  const kind = r.pick(["cube", "square", "minusSquare", "decSquare", "cbrt"] as const);
  if (kind === "cube" || kind === "square") {
    const K = kind === "cube" ? r.int(2, 5) : r.int(3, 9);
    const n = kind === "cube" ? 3 : 2;
    const ans = (-K) ** n;
    const pw = kind === "cube" ? "cube" : "square";
    return {
      difficulty: "warmup",
      question: `Work out ${m(`(-${K})^${n}`)}.`,
      answer: ans,
      correct: kind === "cube" ? `(−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = ${ans}.` : `(−${K}) × (−${K}) = ${ans}: negative × negative is positive.`,
      slips:
        kind === "cube"
          ? [
              { v: K ** 3, feedback: `The size is right but the sign isn't: (−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = ${ans}. Three negatives multiplied give a negative.` },
              { v: -3 * K, feedback: `This is −${K} × 3. Cubing means multiplying three copies: (−${K}) × (−${K}) × (−${K}).` },
              { v: K * K, feedback: `${K * K} is ${m(`(-${K})^2`)} — you squared instead of cubing. Multiply by −${K} once more.` },
            ]
          : [
              { v: -K * K, feedback: `Two negatives multiplied give a positive: (−${K}) × (−${K}) = +${K * K}. (−${K * K} would be ${m(`-${K}^2`)}, with no brackets.)` },
              { v: -2 * K, feedback: `This is −${K} × 2. Squaring means multiplying the number by itself: (−${K}) × (−${K}).` },
              { v: 2 * K, feedback: `This comes from doubling ${K} instead of squaring −${K}. Squaring means (−${K}) × (−${K}).` },
            ],
      explanation:
        kind === "cube"
          ? `${m(`(-${K})^3`)} means (−${K}) × (−${K}) × (−${K}). Do it in pairs: (−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = ${ans}. An odd power of a negative number is negative; an even power is positive.`
          : `${m(`(-${K})^2`)} means (−${K}) × (−${K}). The two minus signs pair up, so the answer is positive: ${ans}. The ${pw} of any negative number is positive.`,
      solution: [
        `Write out the multiplication: ${m(`(-${K})^${n}`)} = ${Array(n).fill(`(−${K})`).join(" × ")}.`,
        kind === "cube" ? `(−${K}) × (−${K}) = ${K * K}, then ${K * K} × (−${K}) = **${ans}**.` : `Negative × negative = positive, so the answer is **${ans}**.`,
      ],
      hints: [kind === "cube" ? `Write it out: (−${K}) × (−${K}) × (−${K}). What do the first two make?` : `What is a negative number times a negative number?`],
      verify: `(-${K})^${n}`,
      commonError: kind === "cube" ? `Losing the sign: an odd number of negatives multiplied gives a negative.` : `Writing ${m(`(-${K})^2`)} = −${K * K}; a negative squared is positive.`,
      sig: `pn:${kind}:${K}`,
    };
  }
  if (kind === "minusSquare") {
    const K = r.int(3, 9);
    const ans = -K * K;
    return {
      difficulty: "core",
      question: `Work out ${m(`-${K}^2`)}.`,
      answer: ans,
      correct: `The power is on the ${K} only: ${K}² = ${K * K}, and the minus in front makes it −${K * K}.`,
      slips: [
        { v: K * K, feedback: `${K * K} is ${m(`(-${K})^2`)}, with brackets. Here the power belongs to the ${K} only, so square ${K} first and then apply the minus: −(${K * K}) = −${K * K}.` },
        { v: -2 * K, feedback: `This comes from doubling instead of squaring. ${m(`${K}^2`)} = ${K} × ${K} = ${K * K}, so ${m(`-${K}^2`)} = −${K * K}.` },
        { v: 2 * K, feedback: `This comes from doubling ${K} and dropping the minus. Square first: ${K} × ${K} = ${K * K}, then the minus in front gives −${K * K}.` },
      ],
      explanation: `In ${m(`-${K}^2`)} the power touches only the ${K} — BIDMAS does the power first. So work out ${K}² = ${K * K}, then put the minus in front: −${K * K}. Compare ${m(`(-${K})^2`)} = (−${K}) × (−${K}) = +${K * K}: the brackets make all the difference, which is why you always bracket a negative when you substitute it.`,
      solution: [
        `The power belongs to the ${K} only: ${m(`-${K}^2`)} = −(${K} × ${K}).`,
        `${K} × ${K} = ${K * K}, so ${m(`-${K}^2`)} = **−${K * K}**.`,
        `(With brackets it would be different: ${m(`(-${K})^2`)} = +${K * K}.)`,
      ],
      hints: [`Is the minus sign inside the power or outside it? There are no brackets.`, `Square ${K} first, then apply the minus sign.`],
      verify: `-${K}^2`,
      commonError: `Treating ${m(`-${K}^2`)} as ${m(`(-${K})^2`)}: without brackets only the ${K} is squared.`,
      sig: `pn:ms:${K}`,
    };
  }
  if (kind === "decSquare") {
    const k = r.int(2, 9);
    const x = -k / 10;
    const ans = tidy(x * x);
    const X = num(-x);
    return {
      difficulty: "core",
      question: `Work out ${m(`(-${X})^2`)}.`,
      answer: ans,
      correct: `(−${X}) × (−${X}) = ${num(ans)}: negative × negative is positive, and ${k} × ${k} = ${k * k} with 2 decimal places.`,
      slips: [
        { v: -ans, feedback: `A negative times a negative is positive: (−${X}) × (−${X}) = +${num(ans)}.` },
        { v: tidy(2 * x), feedback: `This is −${X} × 2 — you doubled instead of squaring. Squaring means (−${X}) × (−${X}).` },
        { v: tidy(ans * 10), feedback: `Check the decimal point: ${k} × ${k} = ${k * k}, and there are 2 decimal places in total, so it is ${num(ans)}.` },
      ],
      explanation: `${m(`(-${X})^2`)} means (−${X}) × (−${X}). The signs: negative × negative is positive. The size: ${k} × ${k} = ${k * k}, with 1 + 1 = 2 decimal places, so ${num(ans)}. Squaring a negative number always gives a positive answer.`,
      solution: [`${m(`(-${X})^2`)} = (−${X}) × (−${X}).`, `Negative × negative is positive, and ${X} × ${X} = ${num(ans)}, so the answer is **${num(ans)}**.`],
      hints: [`Do the sign and the size separately. What sign does negative × negative give?`, `Then work out ${X} × ${X}: try ${k} × ${k} and count the decimal places.`],
      verify: `(-${X})^2`,
      commonError: `Giving a negative answer, or putting the decimal point in the wrong place.`,
      sig: `pn:ds:${k}`,
    };
  }
  const K = r.pick([3, 4]);
  const inside = K ** 3;
  const slips: Cand[] = [
    { v: K, feedback: `Check by cubing: ${K} × ${K} × ${K} = +${inside}, not −${inside}. Three negatives multiply to a negative, so the cube root of a negative number is negative: −${K}.` },
  ];
  if (K === 3) {
    slips.push(
      { v: -9, feedback: `This is −27 ÷ 3. A cube root isn't dividing by 3: it asks which number, multiplied by itself three times, gives −27.` },
      { v: 9, feedback: `This comes from dividing 27 by 3 and losing the sign. A cube root asks which number cubes to −27: (−3)³ = −27.` },
    );
  } else {
    slips.push(
      { v: -8, feedback: `−8 comes from taking the square root of 64 (8 × 8 = 64). A cube root needs three equal factors: (−4) × (−4) × (−4) = −64.` },
      { v: 8, feedback: `8 is the square root of 64, and the sign is lost too. A cube root needs three equal factors: (−4) × (−4) × (−4) = −64.` },
    );
  }
  return {
    difficulty: "core",
    question: `Work out ${m(`cbrt(-${inside})`)}, the cube root of −${inside}.`,
    answer: -K,
    correct: `(−${K}) × (−${K}) × (−${K}) = −${inside}, so ${m(`cbrt(-${inside})`)} = −${K}.`,
    slips,
    explanation: `${m(`cbrt(-${inside})`)} asks: which number, multiplied by itself three times, gives −${inside}? Since ${K}³ = ${inside}, try −${K}: (−${K}) × (−${K}) = ${K * K}, and ${K * K} × (−${K}) = −${inside} ✓. Cube roots of negative numbers are fine (unlike square roots, which can't be negative inside).`,
    solution: [`Look for a number that cubes to −${inside}. Since ${K}³ = ${inside}, try −${K}.`, `(−${K}) × (−${K}) × (−${K}) = ${K * K} × (−${K}) = −${inside} ✓, so the answer is **−${K}**.`],
    hints: [`Which whole number cubes to ${inside}?`, `Will the answer be positive or negative? Think about (−) × (−) × (−).`],
    verify: `cbrt(-${inside})`,
    commonError: `Giving +${K}: a positive number cubed is positive, so the cube root of −${inside} must be negative.`,
    strategy: "Work backwards",
    sig: `pn:cb:${K}`,
  };
}

/** (2/3)², (1/2)³, √(4/9) */
function powFraction(r: Rng): Item {
  const kind = r.pick(["sq", "cube", "root"] as const);
  const [p, q] =
    kind === "cube"
      ? r.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]] as const)
      : r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7]] as const);
  const fx = `${p}/${q}`;
  if (kind === "root") {
    const top = p * p, bot = q * q;
    return {
      difficulty: "core",
      question: `Work out ${m(`sqrt(${top}/${bot})`)}.`,
      prompt: "Give your answer as a fraction.",
      answer: p / q,
      display: m(fx),
      spec: fracSpec(p, q),
      correct: `${m(`${fx} * ${fx} = ${top}/${bot}`)}, so ${m(`sqrt(${top}/${bot}) = ${fx}`)}.`,
      slips: [
        { v: top / q, display: fracI(top, q), spec: fracTrap(top, q), feedback: `This comes from square-rooting only the bottom. Root the top and the bottom: ${m(`sqrt(${top}) = ${p}`)} and ${m(`sqrt(${bot}) = ${q}`)}.` },
        { v: p / bot, display: fracI(p, bot), spec: fracTrap(p, bot), feedback: `This comes from square-rooting only the top. Root the top and the bottom: ${m(`sqrt(${bot}) = ${q}`)} as well.` },
        { v: (top * top) / (bot * bot), display: fracI(top * top, bot * bot), spec: fracTrap(top * top, bot * bot), feedback: `That is ${m(`(${top}/${bot})^2`)} — you squared instead of square-rooting.` },
        { v: top / (2 * bot), display: fracI(top, 2 * bot), spec: fracTrap(top, 2 * bot), feedback: `That is half of ${m(`${top}/${bot}`)}. A square root isn't halving: it's the number that multiplies by itself to give ${m(`${top}/${bot}`)}.` },
      ],
      explanation: `Square-root the top and the bottom separately: ${m(`sqrt(${top}) = ${p}`)} and ${m(`sqrt(${bot}) = ${q}`)}, so ${m(`sqrt(${top}/${bot}) = ${fx}`)}. Check: ${m(`${fx} * ${fx} = ${top}/${bot}`)} ✓. The root (${m(fx)}) is bigger than ${m(`${top}/${bot}`)} — square-rooting a number between 0 and 1 makes it bigger.`,
      solution: [`Root the top: ${m(`sqrt(${top}) = ${p}`)}. Root the bottom: ${m(`sqrt(${bot}) = ${q}`)}.`, `So ${m(`sqrt(${top}/${bot})`)} = **${m(fx)}**. Check: ${m(`${fx} * ${fx} = ${top}/${bot}`)} ✓`],
      hints: [`Which fraction multiplied by itself gives ${m(`${top}/${bot}`)}?`, `Square-root the top and the bottom separately.`],
      verify: `sqrt(${top}/${bot})`,
      commonError: `Square-rooting only the top or only the bottom of the fraction.`,
      strategy: "Work backwards",
      sig: `pf:root:${fx}`,
    };
  }
  const n = kind === "sq" ? 2 : 3;
  const top = p ** n, bot = q ** n;
  const slips: Cand[] = [
    { v: top / q, display: fracI(top, q), spec: fracTrap(top, q), feedback: `This comes from ${kind === "sq" ? "squaring" : "cubing"} only the top. The power applies to the whole fraction: ${m(`(${fx})^${n} = ${top}/${bot}`)}.` },
    { v: (n * p) / q, display: fracI(n * p, q), spec: fracTrap(n * p, q), feedback: `This comes from multiplying by ${n} instead of ${kind === "sq" ? "squaring" : "cubing"}. ${m(`(${fx})^${n}`)} means ${Array(n).fill(m(fx)).join(" × ")}.` },
  ];
  if (kind === "cube") {
    slips.push({ v: (p * p) / (q * q), display: fracI(p * p, q * q), spec: fracTrap(p * p, q * q), feedback: `${m(`${p * p}/${q * q}`)} is ${m(`(${fx})^2`)} — you squared instead of cubing. Multiply by ${m(fx)} once more.` });
  } else {
    slips.push({ v: p / (q * q), display: fracI(p, q * q), spec: fracTrap(p, q * q), feedback: `This comes from squaring only the bottom. Square the top AND the bottom: ${m(`(${fx})^2 = ${top}/${bot}`)}.` });
  }
  slips.push({ v: (n * p) / (n * q), display: m(`${n * p}/${n * q}`), spec: fracTrap(n * p, n * q), feedback: `This comes from multiplying the top and the bottom by ${n}, which leaves the fraction the same size. ${kind === "sq" ? "Squaring" : "Cubing"} means multiplying the fraction by itself: ${Array(n).fill(m(fx)).join(" × ")}.` });
  return {
    difficulty: kind === "cube" && q >= 4 ? "challenge" : "core",
    question: `Work out ${m(`(${fx})^${n}`)}.`,
    prompt: "Give your answer as a fraction.",
    answer: top / bot,
    display: m(`${top}/${bot}`),
    spec: fracSpec(top, bot),
    correct: `${kind === "sq" ? "Square" : "Cube"} the top (${top}) and the bottom (${bot}) to get ${m(`${top}/${bot}`)}.`,
    slips,
    explanation: `${m(`(${fx})^${n}`)} means ${Array(n).fill(m(fx)).join(" × ")}. Multiply the tops: ${Array(n).fill(p).join(" × ")} = ${top}. Multiply the bottoms: ${Array(n).fill(q).join(" × ")} = ${bot}. So the answer is ${m(`${top}/${bot}`)}. It's smaller than ${m(fx)} — ${kind === "sq" ? "squaring" : "cubing"} any number between 0 and 1 makes it smaller.`,
    solution: [
      `Write it out: ${m(`(${fx})^${n}`)} = ${Array(n).fill(m(fx)).join(" × ")}.`,
      `Tops: ${Array(n).fill(p).join(" × ")} = ${top}. Bottoms: ${Array(n).fill(q).join(" × ")} = ${bot}.`,
      `So ${m(`(${fx})^${n}`)} = **${m(`${top}/${bot}`)}**.`,
    ],
    hints: [`Write it out as ${Array(n).fill(m(fx)).join(" × ")}.`, `Multiply the tops together and the bottoms together.`],
    verify: `(${fx})^${n}`,
    commonError: `${kind === "sq" ? "Squaring" : "Cubing"} only the top of the fraction: the power applies to the top and the bottom.`,
    sig: `pf:${kind}:${fx}`,
  };
}

/** x³ + x² or x³ − x² with x negative */
function powNegMix(r: Rng): Item {
  const L = r.pick(["x", "n", "a", "t"]);
  const K = r.int(2, 4);
  const sub = r.chance(0.5);
  const c3 = -(K ** 3), c2 = K * K;
  const ans = sub ? c3 - c2 : c3 + c2;
  const op = sub ? "-" : "+";
  const opT = sub ? "−" : "+";
  return {
    difficulty: "challenge",
    question: `If ${given([[L, `-${K}`]])}, work out ${m(`${L}^3 ${op} ${L}^2`)}.`,
    answer: ans,
    correct: `${m(`${L}^3`)} = ${c3} and ${m(`${L}^2`)} = ${c2}, so ${c3} ${opT} ${c2} = ${ans}.`,
    slips: [
      { v: sub ? -c3 - c2 : -c3 + c2, feedback: `This comes from thinking ${m(`(-${K})^3`)} = +${K ** 3}. Three negatives multiplied give a negative: (−${K}) × (−${K}) × (−${K}) = ${c3}.` },
      { v: sub ? c3 + c2 : c3 - c2, feedback: `This comes from thinking ${m(`(-${K})^2`)} = −${c2}. Two negatives multiplied give a positive: (−${K}) × (−${K}) = +${c2}.` },
      { v: sub ? -3 * K + 2 * K : -3 * K - 2 * K, feedback: `This comes from multiplying by the powers instead (3 × (−${K}) ${opT} 2 × (−${K})). ${m(`${L}^3`)} means ${L} × ${L} × ${L}, not 3 × ${L}.` },
      { v: sub ? -c3 + c2 : -c3 - c2, feedback: `Both signs are flipped here. ${m(`(-${K})^3`)} = ${c3} (odd power: negative) and ${m(`(-${K})^2`)} = +${c2} (even power: positive).` },
    ],
    explanation: `Do each power carefully, with brackets. ${m(`${L}^2`)} = (−${K}) × (−${K}) = +${c2} (two negatives make a positive). ${m(`${L}^3`)} = ${m(`${L}^2`)} × ${L} = ${c2} × (−${K}) = ${c3} (one more negative makes it negative again). So ${m(`${L}^3 ${op} ${L}^2`)} = ${c3} ${opT} ${c2} = ${ans}. Rule of thumb: an even power of a negative number is positive, an odd power is negative.`,
    solution: [
      `Put the value in with brackets: ${m(`(-${K})^3 ${op} (-${K})^2`)}.`,
      `${m(`(-${K})^2`)} = ${c2} and ${m(`(-${K})^3`)} = ${c2} × (−${K}) = ${c3}.`,
      `${c3} ${opT} ${c2} = **${ans}**.`,
    ],
    hints: [`Work out ${m(`(-${K})^2`)} and ${m(`(-${K})^3`)} separately.`, `Count the negative numbers being multiplied: is it an even or an odd number of them?`],
    verify: `(-${K})^3${op}(-${K})^2`,
    commonError: `Getting a sign wrong: ${m(`(-${K})^3`)} is negative but ${m(`(-${K})^2`)} is positive.`,
    sig: `pm:${op}:${K}`,
  };
}

const suPowers: Generator = {
  id: "su-powers",
  topic: "su",
  section: "su-powers",
  label: "Squares, cubes and roots of negatives and of numbers between 0 and 1",
  kinds: ["mcq", "qa"],
  make(r) {
    return build(
      pickTemplate(r, [
        [3, powDecSquare],
        [2, powDecCube],
        [2, powDecRoot],
        [3, powNegative],
        [2, powFraction],
        [1, powNegMix],
      ]),
    );
  },
};

export const GEN_SU: Generator[] = [suBasics, suNegatives, suFormula, suDecimals, suPowers];
