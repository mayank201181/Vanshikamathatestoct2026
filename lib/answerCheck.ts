// ---------------------------------------------------------------------------
// Auto-marking for typed maths answers.
//
//   correct   — right value in an acceptable form
//   close     — right value but wrong form (e.g. not simplified), or a
//               near-miss worth a retry; does NOT count as a wrong answer
//   incorrect — wrong
//   invalid   — could not read the input as the expected kind of answer;
//               does not count as an attempt
// ---------------------------------------------------------------------------

import type { AnswerSpec } from "./types.ts";
import {
  countTerms,
  evalExpr,
  exprEquivalent,
  exprVars,
  extractNumbers,
  gcd,
  hasCommonFactorInBracket,
  hasGroup,
  hasLooseGroup,
  hasUncombinedTerm,
  isFactorised,
  normalizeInput,
  parseExpr,
  parseNumberAnswer,
  type Expr,
} from "./mathParse.ts";

export type CheckStatus = "correct" | "close" | "incorrect" | "invalid";

export interface CheckResult {
  status: CheckStatus;
  /** Short, kind feedback for the learner. */
  feedback?: string;
}

const EPS = 1e-9;

function near(a: number, b: number, tol?: number): boolean {
  const t = tol ?? EPS * Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= t + 1e-12;
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toPrecision(10)));
}

/** Canonical display string for an answer spec (may contain {{ }} maths markup). */
export function displayAnswer(spec: AnswerSpec): string {
  if (spec.display) return spec.display;
  switch (spec.type) {
    case "number":
      return fmt(spec.value).replace(/^-/, "−");
    case "fraction": {
      const neg = spec.n * spec.d < 0;
      const n = Math.abs(spec.n), d = Math.abs(spec.d);
      if (spec.form === "mixed" && n > d) {
        const w = Math.floor(n / d), r = n % d;
        return `{{${neg ? "-" : ""}${w}${r ? ` ${r}/${d}` : ""}}}`;
      }
      return `{{${neg ? "-" : ""}${n}/${d}}}`;
    }
    case "list":
      return spec.values.map(fmt).join(spec.ordered ? ", " : ", ").replace(/-/g, "−");
    case "ratio":
      return spec.parts.map(fmt).join(" : ");
    case "expression":
      return `{{${spec.expr}}}`;
    case "text":
      return spec.accept[0] ?? "";
  }
}

/** Normalise free text for comparison. */
export function normText(s: string): string {
  return normalizeInput(s)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\.$/, "")
    .replace(/[“”"']/g, "");
}

export function checkAnswer(spec: AnswerSpec, raw: string): CheckResult {
  const input = (raw ?? "").trim();
  if (!input) return { status: "invalid", feedback: "Type an answer first." };
  try {
    switch (spec.type) {
      case "number":
        return checkNumber(spec, input);
      case "fraction":
        return checkFraction(spec, input);
      case "list":
        return checkList(spec, input);
      case "ratio":
        return checkRatio(spec, input);
      case "expression":
        return checkExpression(spec, input);
      case "text":
        return checkText(spec, input);
    }
  } catch {
    return { status: "invalid", feedback: "I couldn't read that — try writing it another way." };
  }
}

/** `e` with π (parsed as the number Math.PI) replaced by an approximation such as 3.14. */
function withPi(e: Expr, pi: number): Expr {
  switch (e.t) {
    case "num": return e.v === Math.PI ? { t: "num", v: pi } : e;
    case "var": return e;
    case "neg": case "group": case "fn": return { ...e, a: withPi(e.a, pi) };
    default: return { ...e, a: withPi(e.a, pi), b: withPi(e.b, pi) };
  }
}

/**
 * The values of a number typed with π, like "12π" or "x = 12π cm", using the π button,
 * π = 3.14 and π = 22/7 (questions use all three); null if there's no π in it.
 */
function piNumberValues(input: string): number[] | null {
  const s = stripEquation(input);
  if (!input.includes("π") && !/(?<![a-z])pi(?![a-z])/i.test(s)) return null;
  for (const text of [s, stripTrailingUnit(s, new Set())]) {
    const e = text === null ? null : parseExpr(text);
    if (e && exprVars(e).size === 0) return [Math.PI, 3.14, 22 / 7].map((pi) => evalExpr(withPi(e, pi), {}));
  }
  return null; // "6 pieces", "17 pupils" — not π after all
}

/** True if `v` rounds to `target` at the accuracy `target` is written to (37.699 → 37.7). */
function roundsTo(v: number, target: number): boolean {
  const text = String(target);
  if (text.includes("e")) return false;
  const dp = text.split(".")[1]?.length ?? 0;
  return Math.abs(v - target) <= 0.5 * 10 ** -dp + 1e-9;
}

function checkNumber(spec: Extract<AnswerSpec, { type: "number" }>, input: string): CheckResult {
  const pi = piNumberValues(input);
  if (pi !== null) {
    if (pi.some((v) => near(v, spec.value, spec.tolerance) || roundsTo(v, spec.value))) {
      return { status: "close", feedback: "That's the exact value in terms of π — now work it out as a decimal, rounded as the question asks." };
    }
    return { status: "incorrect" };
  }
  const p =
    parseNumberAnswer(input) ??
    parseNumberAnswer(afterLastEquals(input)) ??
    parseNumberAnswer(input.replace(LEADING_LABEL, "")) ??
    parseNumberAnswer(input.replace(/^\s*(?:[×x*]|times)\s*(?=\d|\.\d)/i, "")); // a multiplier typed as "×1.05"
  if (!p) {
    // Maybe they wrote a list or an expression.
    return { status: "invalid", feedback: "Type a single number, like 12, −3.5 or 3/4." };
  }
  const allowFraction = spec.allowFraction !== false;
  if (!allowFraction && p.frac) {
    if (near(p.value, spec.value, spec.tolerance)) {
      return { status: "close", feedback: "Right value — now write it as a decimal." };
    }
    return { status: "incorrect" };
  }
  if (spec.standardForm && near(p.value, spec.value, spec.tolerance ?? 1e-9 * Math.abs(spec.value))) {
    const m = p.standardForm ? Math.abs(p.standardForm.mantissa) : NaN;
    if (!(m >= 1 && m < 10)) {
      return { status: "close", feedback: "Right value — now write it in standard form, A × 10^n with 1 ≤ A < 10." };
    }
    return { status: "correct" };
  }
  if (near(p.value, spec.value, spec.tolerance)) return { status: "correct" };
  if (spec.value !== 0 && near(p.value, -spec.value, spec.tolerance)) {
    return { status: "incorrect", feedback: "Check the sign (+ or −)." };
  }
  // Rounding near-miss: within 1% (but not equal) — likely a rounding slip.
  // Only when decimals are involved: 99 for 100 is simply wrong, not a rounding issue.
  const bothWhole = Number.isInteger(spec.value) && Number.isInteger(p.value);
  if (!bothWhole && spec.value !== 0 && Math.abs(p.value - spec.value) <= 0.01 * Math.abs(spec.value)) {
    return { status: "close", feedback: "Very close — check your rounding or the accuracy asked for." };
  }
  return { status: "incorrect" };
}

/** A label word typed before the number: "Pattern 33", "term 24", "it's 40". (Never "minus".) */
const LEADING_LABEL = /^\s*(?:pattern|term|position|diagram|day|week|year|n|it'?s|it is|answer|about)\s+(?=[-−]?\s*[£$]?\d)/i;

/**
 * "e³ = −27", "8e² + 3 = 75": the learner restated the expression before the answer.
 * Only the part after the last "=" is the answer (used when the whole input isn't a number).
 */
function afterLastEquals(input: string): string {
  const i = input.lastIndexOf("=");
  if (i < 0) return "";
  const left = input.slice(0, i);
  return /[a-zA-Z]/.test(left) ? input.slice(i + 1) : "";
}

function checkFraction(spec: Extract<AnswerSpec, { type: "fraction" }>, input: string): CheckResult {
  const target = spec.n / spec.d;
  const p = parseNumberAnswer(input) ?? parseNumberAnswer(afterLastEquals(input));
  if (!p) return { status: "invalid", feedback: "Type a fraction like 3/4 or a mixed number like 1 1/2." };
  if (!p.frac) {
    // Integer or decimal typed.
    if (p.kind === "integer" && Number.isInteger(target) && near(p.value, target)) return { status: "correct" };
    if (near(p.value, target, 1e-9)) {
      if (spec.allowDecimal) return { status: "correct" };
      return { status: "close", feedback: "Right value — now write it as a fraction." };
    }
    return { status: "incorrect" };
  }
  // Exact rational comparison: (whole*d + n)/d with sign.
  const f = p.frac;
  const num = (f.whole * f.d + f.n) * (f.negative ? -1 : 1);
  const den = f.d;
  const equal = num * spec.d === spec.n * den;
  if (!equal) {
    if (spec.n !== 0 && num * spec.n === spec.d * den) {
      return { status: "incorrect", feedback: "That's the reciprocal — is it upside down?" };
    }
    if (num * spec.d === -spec.n * den && spec.n !== 0) {
      return { status: "incorrect", feedback: "Check the sign (+ or −)." };
    }
    return { status: "incorrect" };
  }
  if (spec.form === "mixed" && Math.abs(num) > den && p.kind !== "mixed") {
    return { status: "close", feedback: "Right value — now write it as a mixed number." };
  }
  if (spec.form === "improper" && p.kind === "mixed") {
    return { status: "close", feedback: "Right value — now write it as an improper (top-heavy) fraction." };
  }
  if (spec.simplest && gcd(f.n, f.d) !== 1) {
    return { status: "close", feedback: "Equivalent — but simplify it fully." };
  }
  if (spec.simplest && p.kind === "mixed" && f.n >= f.d) {
    return { status: "close", feedback: "Equivalent — tidy the mixed number (the fraction part should be less than 1)." };
  }
  return { status: "correct" };
}

function isPrimeInt(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** "2^3 × 3 × 5" (or "360 = 2³ × 3 × 5") → [2, 2, 2, 3, 5]; null if it isn't a product of powers. */
function expandPowerProduct(input: string): number[] | null {
  const s = normalizeInput(input)
    .replace(/^\d+\s*=\s*/, "")
    .replace(/(\d)\s*[xX]\s*(?=\d)/g, "$1*");
  if (s.includes(",") || !/[*^]/.test(s)) return null;
  const out: number[] = [];
  for (const part of s.split("*")) {
    const m = part.trim().match(/^(\d+)(?:\s*\^\s*\(?\s*(\d+)\s*\)?)?$/);
    if (!m) return null;
    const e = m[2] === undefined ? 1 : Number(m[2]);
    if (e < 1 || e > 30) return null;
    for (let i = 0; i < e; i++) out.push(Number(m[1]));
  }
  return out;
}

function checkList(spec: Extract<AnswerSpec, { type: "list" }>, rawInput: string): CheckResult {
  // Labels typed before each value ("U1 = 1, U2 = 7", "T_3=19", "Lucy = £80") are not answers.
  const input = rawInput.replace(/\b[a-z]{1,8}\s*_?\s*\(?\s*\d{0,2}\s*\)?\s*=\s*/gi, "");
  // A list of prime factors may be typed as a product in index form.
  const product = !spec.ordered && spec.values.length > 1 && spec.values.every(isPrimeInt) ? expandPowerProduct(input) : null;
  let got = product ?? extractNumbers(input);
  if (!product && got?.length !== spec.values.length) {
    // "1,400" or "7 560" may be one number with thousands separators, not two values.
    const alt = extractNumbers(input, true);
    if (alt?.length === spec.values.length) got = alt;
  }
  if (!got) return { status: "invalid", feedback: "Separate your answers with commas, e.g. 28, 35." };
  if (got.length !== spec.values.length) {
    const feedback = `I was expecting ${spec.values.length} value${spec.values.length === 1 ? "" : "s"}.`;
    // Too few values is only "almost" when every value given is one of the answers.
    const pool = [...spec.values];
    const partRight = got.length < spec.values.length && got.every((g) => {
      const i = pool.findIndex((v) => near(g, v, spec.tolerance));
      if (i >= 0) pool.splice(i, 1);
      return i >= 0;
    });
    return { status: partRight ? "close" : "incorrect", feedback };
  }
  if (spec.ordered) {
    const ok = spec.values.every((v, i) => near(got[i], v, spec.tolerance));
    if (ok) return { status: "correct" };
    const reversed = spec.values.every((v, i) => near(got[got.length - 1 - i], v, spec.tolerance));
    if (reversed && spec.values.length === 2) {
      return { status: "incorrect", feedback: "Right numbers, wrong order — give them in the order the question asks for." };
    }
    return { status: "incorrect" };
  }
  const remaining = [...got];
  for (const v of spec.values) {
    const i = remaining.findIndex((g) => near(g, v, spec.tolerance));
    if (i < 0) return { status: "incorrect" };
    remaining.splice(i, 1);
  }
  return { status: "correct" };
}

function checkRatio(spec: Extract<AnswerSpec, { type: "ratio" }>, input: string): CheckResult {
  const s = normalizeInput(input).replace(/\bto\b/gi, ":");
  const parts = s.split(":").map((x) => parseNumberAnswer(x.trim()));
  if (parts.length < 2 || parts.some((x) => !x)) {
    return { status: "invalid", feedback: "Write a ratio with colons, like 3 : 4." };
  }
  const got = parts.map((x) => x!.value);
  if (got.length !== spec.parts.length) return { status: "incorrect", feedback: `This ratio has ${spec.parts.length} parts.` };
  const exact = got.every((g, i) => near(g, spec.parts[i]));
  if (exact) return { status: "correct" };
  const k0 = got[0] / spec.parts[0];
  const prop = Number.isFinite(k0) && k0 !== 0 && got.every((g, i) => near(g, spec.parts[i] * k0, 1e-9 * Math.max(1, Math.abs(g))));
  if (prop && spec.unitForm) {
    return { status: "close", feedback: `Equivalent — now write it in the form ${spec.unitForm === "1:n" ? "1 : n" : "n : 1"} (divide every part by the ${spec.unitForm === "1:n" ? "first" : "last"} number).` };
  }
  // Proportional?
  const k = got[0] / spec.parts[0];
  const proportional = Number.isFinite(k) && k !== 0 && got.every((g, i) => near(g, spec.parts[i] * k, 1e-9 * Math.max(1, Math.abs(g))));
  if (proportional) {
    if (spec.simplest) return { status: "close", feedback: "Equivalent — but simplify it fully." };
    return { status: "correct" };
  }
  const reversed = [...got].reverse();
  if (reversed.every((g, i) => near(g, spec.parts[i]))) {
    return { status: "incorrect", feedback: "Right numbers, wrong order — keep the order the question uses." };
  }
  return { status: "incorrect" };
}

function stripEquation(input: string): string {
  const s = normalizeInput(input);
  if (!s.includes("=")) return s;
  const sides = s.split("=");
  if (sides.length !== 2) return s;
  const [l, r] = sides.map((x) => x.trim());
  // "x = …", "Un = …", "u(n) = …", "nth term = …", "area = …"
  const label = /^(?:[a-z]|[ut]\s*_?\s*\(?\s*n\s*\)?|nth\s*term|area|perimeter|answer)$/i;
  if (label.test(l)) return r;
  if (label.test(r)) return l;
  return s;
}

/** "60 + 9π m²" → "60 + 9π" when the unit's letters aren't variables of the answer. */
function stripTrailingUnit(input: string, vars: Set<string>): string | null {
  const m = normalizeInput(input).match(/^(.*?\S)\s*(mm|cm|km|m|ml|l|kg|g|units?|degrees|°)(\s*\^?\s*[23])?\.?$/i);
  if (!m) return null;
  for (const ch of m[2].toLowerCase()) if (vars.has(ch)) return null;
  return m[1];
}

function checkExpression(spec: Extract<AnswerSpec, { type: "expression" }>, input: string): CheckResult {
  const expected = parseExpr(stripEquation(spec.expr));
  if (!expected) return { status: "invalid", feedback: "This question's answer couldn't be checked automatically." };
  let got = parseExpr(stripEquation(input));
  if (!got || !exprEquivalent(expected, got)) {
    // Allow a unit typed after the answer, e.g. "60 + 9π m²".
    const unitless = stripTrailingUnit(input, exprVars(expected));
    const retry = unitless === null ? null : parseExpr(stripEquation(unitless));
    if (retry && exprEquivalent(expected, retry)) got = retry;
  }
  if (!got) {
    return { status: "invalid", feedback: "I couldn't read that expression. Use * or nothing for ×, ^ for powers, e.g. 3x^2 + 2(x − 1)." };
  }
  if (!exprEquivalent(expected, got)) return { status: "incorrect" };
  // "In terms of π": a calculator decimal has the right value but not the asked-for form.
  if (/pi/i.test(normalizeInput(spec.expr)) && !/pi/i.test(normalizeInput(input))) {
    return { status: "close", feedback: "Right value — but leave your answer in terms of π (keep π as a symbol)." };
  }
  const form = spec.form ?? "any";
  if (form === "factorised" && !isFactorised(got)) {
    return { status: "close", feedback: "That's equivalent — but it isn't factorised. Take out the common factor into a bracket." };
  }
  if (form === "factorised" && hasCommonFactorInBracket(got) && !hasCommonFactorInBracket(expected)) {
    return { status: "close", feedback: "Equivalent and factorised — but not fully. There's still a common factor inside the bracket." };
  }
  if (form === "expanded" && hasGroup(got)) {
    return { status: "close", feedback: "That's equivalent — now multiply out the brackets." };
  }
  if (form === "expanded" && countTerms(got) > countTerms(expected)) {
    return { status: "close", feedback: "Expanded — now collect the like terms to simplify fully." };
  }
  if (form === "simplified") {
    if (hasLooseGroup(got) && !hasGroup(expected)) {
      return { status: "close", feedback: "That's equivalent — now remove the brackets and simplify." };
    }
    if (countTerms(got) > countTerms(expected)) {
      return { status: "close", feedback: "That's equivalent — but collect the like terms to simplify fully." };
    }
  }
  if ((form === "simplified" || form === "expanded") && hasUncombinedTerm(got) && !hasUncombinedTerm(expected)) {
    return { status: "close", feedback: "That's equivalent — now finish each term: multiply or cancel the numbers, and combine powers of the same letter." };
  }
  return { status: "correct" };
}

function checkText(spec: Extract<AnswerSpec, { type: "text" }>, input: string): CheckResult {
  const n = normText(input);
  if (spec.accept.some((a) => normText(a) === n)) return { status: "correct" };
  return { status: "incorrect" };
}

/** Check an answer, then (if wrong) look for a matching trap to give targeted feedback. */
export function checkWithTraps(spec: AnswerSpec, raw: string, traps?: { spec: AnswerSpec; feedback: string }[]): CheckResult {
  const r = checkAnswer(spec, raw);
  if (r.status !== "incorrect" || !traps?.length) return r;
  for (const t of traps) {
    try {
      if (checkAnswer(t.spec, raw).status === "correct") return { status: "incorrect", feedback: t.feedback };
    } catch {
      /* ignore bad trap */
    }
  }
  return r;
}

/** A canonical typed string that should satisfy the spec (used by validators). */
export function specSample(spec: AnswerSpec): string {
  switch (spec.type) {
    case "number": {
      if (spec.standardForm) {
        const e = Math.floor(Math.log10(Math.abs(spec.value)));
        return `${parseFloat((spec.value / Math.pow(10, e)).toPrecision(12))} x 10^${e}`;
      }
      return String(spec.value);
    }
    case "fraction": {
      const g = gcd(spec.n, spec.d) || 1;
      const n = spec.n / g, d = spec.d / g;
      const neg = n * d < 0 ? "-" : "";
      const an = Math.abs(n), ad = Math.abs(d);
      if (spec.form === "mixed" && an > ad) {
        const w = Math.trunc(an / ad), r = an % ad;
        return `${neg}${w}${r ? ` ${r}/${ad}` : ""}`;
      }
      return `${neg}${an}/${ad}`;
    }
    case "list": return spec.values.join(", ");
    case "ratio": return spec.parts.join(":");
    case "expression": return spec.expr;
    case "text": return spec.accept[0] ?? "";
  }
}

/** Self-check used by tests and the content validator: does the canonical answer pass its own spec? */
export function specSelfCheck(spec: AnswerSpec): CheckResult {
  return checkAnswer(spec, specSample(spec));
}
