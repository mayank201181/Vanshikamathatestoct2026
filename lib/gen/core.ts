// Fresh-number question generators.
//
// A generator is a template for one skill ("add two fractions with different denominators").
// Given a seeded random-number generator it picks new numbers and builds the whole question
// from them: the stem, the answer, misconception-based wrong options with feedback, a worked
// explanation, hints and a `verify` expression that is checked exactly like the bank's.
// The same seed always rebuilds the same question, so a mock in progress can be resumed.

import type { AnswerSpec, Difficulty, SectionId, TopicId } from "../types.ts";

// ---------------------------------------------------------------------------
// Seeded randomness
// ---------------------------------------------------------------------------

export interface Rng {
  /** 0 ≤ x < 1 */
  next(): number;
  /** Integer a ≤ x ≤ b */
  int(a: number, b: number): number;
  pick<T>(xs: readonly T[]): T;
  chance(p: number): boolean;
  shuffle<T>(xs: readonly T[]): T[];
}

/** mulberry32 — small, fast, good enough for picking numbers. */
export function rng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r: Rng = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (xs) => xs[Math.floor(next() * xs.length)],
    chance: (p) => next() < p,
    shuffle: (xs) => {
      const out = [...xs];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
  return r;
}

// ---------------------------------------------------------------------------
// What a generator produces
// ---------------------------------------------------------------------------

/** A predictable wrong answer: an MCQ distractor and (with `spec`) a typed-answer trap. */
export interface Wrong {
  /** Option text, e.g. "{{5/12}}" or "£48". */
  display: string;
  /** The same wrong answer as a typed-answer spec, so the written version can give this feedback too. */
  spec?: AnswerSpec;
  /** The exact slip that produces this answer, and why it is wrong. */
  feedback: string;
}

export interface Draft {
  difficulty: Difficulty;
  /** Question text (markdown-lite + {{maths}}), used for multiple choice and as the written stem. */
  question: string;
  /** Written version only: the instruction, e.g. "Give your answer in its simplest form." */
  prompt?: string;
  /** The answer, as a typed-answer spec. */
  answer: AnswerSpec;
  /** The correct option's text. */
  display: string;
  /** Why the correct option is right (short). */
  correctFeedback: string;
  /** At least 3 wrong answers with different values from the answer and from each other. */
  wrong: Wrong[];
  /** Teaching explanation shown after a multiple-choice answer: the method, step by step. */
  explanation: string;
  /** Worked solution for the written version, one step per string. */
  solution: string[];
  /** Hint ladder, gentlest first; never states the answer. */
  hints: string[];
  /** Machine check built from the question's own numbers (same rules as the bank's `verify`). */
  verify: string;
  /** The mistake students most often make on this question (written version). */
  commonError: string;
  strategy?: string;
  /** Marks for the written version (default 2). */
  marks?: number;
  /**
   * The numbers that make this question what it is, e.g. "add:4/5:2/3". Two drafts with the
   * same signature are the same question, so a mock never repeats one.
   */
  sig: string;
}

export interface Generator {
  /** Stable id, e.g. "fr-add". Never rename: saved mocks refer to it. */
  id: string;
  topic: TopicId;
  section: SectionId;
  /** Short name of the skill, shown nowhere yet but useful in reports. */
  label: string;
  /** Which forms it can be asked in. */
  kinds: ("mcq" | "qa")[];
  make(r: Rng): Draft;
}

// ---------------------------------------------------------------------------
// Number helpers
// ---------------------------------------------------------------------------

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Reduce n/d (sign on the numerator). */
export function reduce(n: number, d: number): [number, number] {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d);
  return [n / g, d / g];
}

/** Remove floating-point noise: 0.30000000000000004 → 0.3 */
export function tidy(x: number): number {
  return Number(parseFloat(x.toPrecision(12)));
}

/** A number for text outside {{ }}: unicode minus, no float noise. */
export function num(x: number): string {
  const t = tidy(x);
  return (t < 0 ? "−" : "") + String(Math.abs(t));
}

/** Money with a £ sign: 12 → "£12", 12.5 → "£12.50". */
export function money(x: number): string {
  const t = tidy(x);
  const s = Number.isInteger(t) ? String(Math.abs(t)) : Math.abs(t).toFixed(2);
  return (t < 0 ? "−£" : "£") + s;
}

/**
 * A fraction as {{ }} maths, reduced. mixed: show improper fractions as mixed numbers.
 * Whole numbers come out plain ("{{3}}").
 */
export function fr(n: number, d: number, mixed = true): string {
  const [a, b] = reduce(n, d);
  return `{{${frPlain(a, b, mixed)}}}`;
}

/** Like fr() but without the {{ }} wrapper (for building bigger expressions). Not reduced. */
export function frPlain(n: number, d: number, mixed = true): string {
  if (d === 1) return String(n);
  const neg = n < 0;
  const an = Math.abs(n);
  if (mixed && an > d) {
    const w = Math.floor(an / d);
    const r = an % d;
    return `${neg ? "-" : ""}${w}${r ? ` ${r}/${d}` : ""}`;
  }
  return `${neg ? "-" : ""}${an}/${d}`;
}

/**
 * A fraction exactly as a slip produces it — NOT reduced (e.g. {{10/40}}), shown as a mixed
 * number when it is improper ({{1 7/15}}). Use this for wrong options.
 */
export function frRaw(n: number, d: number, mixed = true): string {
  if (n % d === 0) return `{{${n / d}}}`;
  return `{{${frPlain(n, d, mixed)}}}`;
}

const ONES = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
const TEENS = ["tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const TENS_ORD = ["", "", "twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "seventieth", "eightieth", "ninetieth"];

/** The name of one piece: 2 → "half", 4 → "quarter", 14 → "fourteenth", 24 → "twenty-fourth". */
export function pieceName(d: number): string {
  if (d === 2) return "half";
  if (d === 4) return "quarter";
  if (d < 10) return ONES[d];
  if (d < 20) return TEENS[d - 10];
  if (d < 100) return d % 10 === 0 ? TENS_ORD[d / 10] : `${TENS[Math.floor(d / 10)]}-${ONES[d % 10]}`;
  if (d === 100) return "hundredth";
  return `${d}th`;
}

/** Plural piece name: 2 → "halves", 3 → "thirds", 14 → "fourteenths". */
export function pieces(d: number): string {
  return d === 2 ? "halves" : `${pieceName(d)}s`;
}

/** Capitalise the first letter. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Fraction answer spec in lowest terms (accepts mixed or improper). */
export function fracSpec(n: number, d: number, opts: { simplest?: boolean; form?: "any" | "mixed" | "improper" } = {}): AnswerSpec {
  const [a, b] = reduce(n, d);
  if (b === 1) return { type: "number", value: a };
  return { type: "fraction", n: a, d: b, simplest: opts.simplest ?? true, form: opts.form ?? "any" };
}

/** Plain-number answer spec. */
export function numSpec(value: number, display?: string, extra: Partial<Extract<AnswerSpec, { type: "number" }>> = {}): AnswerSpec {
  return { type: "number", value: tidy(value), ...(display ? { display } : {}), ...extra };
}

// ---------------------------------------------------------------------------
// Algebra helpers (for expressions shown as {{ }} and typed-answer specs)
// ---------------------------------------------------------------------------

/** One term like 3x, −x, x^2, 5 — ASCII for {{ }} (the page turns - into −). first: no leading +. */
export function term(coef: number, v = "", first = false): string {
  if (coef === 0) return "";
  const sign = coef < 0 ? "-" : first ? "" : "+";
  const a = Math.abs(coef);
  const body = v ? (a === 1 ? v : `${a}${v}`) : String(a);
  return sign + body;
}

/** A polynomial from [coef, variable] pairs, skipping zeros: [[2,"x^2"],[3,"x"],[-5,""]] → "2x^2+3x-5". */
export function poly(terms: [number, string][]): string {
  const parts = terms.filter(([c]) => c !== 0);
  if (!parts.length) return "0";
  return parts.map(([c, v], i) => term(c, v, i === 0)).join("");
}

/** Expression answer spec. */
export function exprSpec(expr: string, form: "any" | "factorised" | "expanded" | "simplified" = "any"): AnswerSpec {
  return { type: "expression", expr, form };
}

/** Wrap ASCII maths for display. */
export const m = (ascii: string) => `{{${ascii}}}`;
