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
function keepWrongs(answer: number, cands: Cand[]): Wrong[] {
  const seen = [answer];
  const out: Wrong[] = [];
  for (const c of cands) {
    if (!Number.isFinite(c.v) || seen.some((s) => same(s, c.v))) continue;
    if (!Number.isInteger(answer) && answer !== 0 && Math.abs(c.v - answer) <= 0.01 * Math.abs(answer)) continue;
    seen.push(c.v);
    out.push({ display: c.display ?? num(c.v), spec: c.spec ?? numSpec(c.v), feedback: c.feedback });
  }
  return out;
}

/** "{{a = 4}} and {{b = 5}}", "{{a = 4}}, {{b = 5}} and {{c = 3}}" — values given as ASCII maths. */
function given(pairs: [string, string][]): string {
  const parts = pairs.map(([l, x]) => m(`${l} = ${x}`));
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

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

function build(it: Item): Draft {
  return {
    difficulty: it.difficulty,
    question: it.question,
    prompt: it.prompt,
    answer: it.spec ?? numSpec(it.answer),
    display: it.display ?? num(it.answer),
    correctFeedback: it.correct,
    wrong: keepWrongs(it.answer, it.slips),
    explanation: it.explanation,
    solution: it.solution,
    hints: it.hints,
    verify: it.verify,
    commonError: it.commonError,
    strategy: it.strategy ?? "Check by substituting",
    marks: it.marks ?? (it.difficulty === "warmup" ? 1 : it.difficulty === "core" ? 2 : 3),
    sig: it.sig,
  };
}

/** A fraction (or whole number) as {{ }} maths, reduced, mixed if improper: used for slips. */
const frac = (n: number, d: number) => fr(n, d);
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

export const GEN_SU: Generator[] = [suBasics];
