// Machine checks for answer keys, used by `npm run validate` (scripts/validate.ts).
// Content authors give a `verify` expression built from the QUESTION's numbers; we evaluate
// it independently and compare it with the keyed answer, so a slip in the key is caught.

import type { AnswerSpec } from "./types.ts";
import { evalExpr, exprEquivalent, exprVars, normalizeInput, parseExpr, parseNumberAnswer } from "./mathParse.ts";

/** Strip {{ }} maths markup and markdown so an option reads as plain typed text. */
export function plainOption(text: string): string {
  return text
    .replace(/\{\{([\s\S]+?)\}\}/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The numeric value of an option such as "{{1 7/15}}", "£16 000", "22%", "0.7", "40 minutes"; null if not a plain number. */
export function optionValue(text: string): number | null {
  const p = parseNumberAnswer(plainOption(text));
  return p ? p.value : null;
}

/** Evaluate a numeric verify expression like "(4/5+2/3)" or "20000*0.8"; null if it can't be read or has letters. */
export function evalNumber(expr: string): number | null {
  const e = parseExpr(expr);
  if (!e) return null;
  const v = evalExpr(e, {});
  return Number.isFinite(v) ? v : null;
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** Does `v` round to `target` at the precision `target` is written to (decimal places or significant figures)? */
export function roundsTo(v: number, target: number): boolean {
  if (close(v, target)) return true;
  const text = String(target);
  if (text.includes("e")) return false;
  const dp = text.split(".")[1]?.length ?? 0;
  if (Math.abs(v - target) <= 0.5 * 10 ** -dp + 1e-9 && dp > 0) return true;
  // significant figures for whole numbers like 9300000 (2 s.f.)
  const digits = text.replace("-", "").replace(".", "").replace(/^0+/, "");
  const sf = digits.replace(/0+$/, "").length || 1;
  if (sf < 1 || v === 0) return false;
  const rounded = Number(v.toPrecision(sf));
  return close(rounded, target);
}

export interface VerifyResult {
  ok: boolean;
  /** What the verify expression evaluated to (for messages). */
  got?: string;
  message?: string;
}

/** Check a written part's answer spec against its verify expression. */
export function verifyAnswer(spec: AnswerSpec, verify: string): VerifyResult {
  switch (spec.type) {
    case "number": {
      const v = evalNumber(verify);
      if (v === null) return { ok: false, message: `verify "${verify}" could not be evaluated as a number` };
      if (spec.tolerance !== undefined ? Math.abs(v - spec.value) <= spec.tolerance + 1e-9 : roundsTo(v, spec.value)) return { ok: true, got: String(v) };
      return { ok: false, got: String(v), message: `verify "${verify}" = ${v} but the key is ${spec.value}` };
    }
    case "fraction": {
      const v = evalNumber(verify);
      if (v === null) return { ok: false, message: `verify "${verify}" could not be evaluated as a number` };
      if (close(v, spec.n / spec.d)) return { ok: true, got: String(v) };
      return { ok: false, got: String(v), message: `verify "${verify}" = ${v} but the key is ${spec.n}/${spec.d} = ${spec.n / spec.d}` };
    }
    case "list": {
      const vs = verify.split(",").map((x) => evalNumber(x.trim()));
      if (vs.some((x) => x === null)) return { ok: false, message: `verify "${verify}" — every comma-separated item must evaluate to a number` };
      const got = vs as number[];
      if (got.length !== spec.values.length) return { ok: false, message: `verify has ${got.length} values, key has ${spec.values.length}` };
      if (spec.ordered) {
        const ok = got.every((g, i) => roundsTo(g, spec.values[i]));
        return ok ? { ok } : { ok, message: `verify gives ${got.join(", ")} but key is ${spec.values.join(", ")} (ordered)` };
      }
      const pool = [...spec.values];
      for (const g of got) {
        const i = pool.findIndex((x) => roundsTo(g, x));
        if (i < 0) return { ok: false, message: `verify gives ${got.join(", ")} but key is ${spec.values.join(", ")}` };
        pool.splice(i, 1);
      }
      return { ok: true };
    }
    case "ratio": {
      const vs = verify.split(":").map((x) => evalNumber(x.trim()));
      if (vs.some((x) => x === null) || vs.length !== spec.parts.length) return { ok: false, message: `verify "${verify}" must be ${spec.parts.length} numeric parts separated by ":"` };
      const got = vs as number[];
      const k = got[0] / spec.parts[0];
      const ok = got.every((g, i) => close(g, spec.parts[i] * k));
      return ok ? { ok } : { ok, message: `verify ratio ${got.join(":")} is not equivalent to key ${spec.parts.join(":")}` };
    }
    case "expression": {
      if (verify.trim().startsWith("terms:")) {
        const terms = parseTerms(verify);
        if (!terms) return { ok: false, message: `verify "${verify}" — terms must be numbers` };
        const r = generates(spec.expr, terms);
        return r === true ? { ok: true } : { ok: false, message: `the key "${spec.expr}" does not generate ${terms.join(", ")} (${r})` };
      }
      const a = parseExpr(verify);
      const b = parseExpr(spec.expr);
      if (!a) return { ok: false, message: `verify "${verify}" could not be parsed` };
      if (!b) return { ok: false, message: `answer expr "${spec.expr}" could not be parsed` };
      return exprEquivalent(a, b) ? { ok: true } : { ok: false, message: `verify "${verify}" is NOT equivalent to the key "${spec.expr}"` };
    }
    case "text":
      return { ok: true };
  }
}

/** "terms:5,8,11,14" → [5, 8, 11, 14] */
export function parseTerms(verify: string): number[] | null {
  const vs = verify.trim().replace(/^terms:/, "").split(",").map((x) => evalNumber(x.trim()));
  return vs.length && vs.every((x) => x !== null) ? (vs as number[]) : null;
}

/** Does an nth-term expression produce exactly these terms for n = 1, 2, 3 …? true, or a reason. */
export function generates(expr: string, terms: number[]): true | string {
  const e = parseExpr(plainOption(expr).replace(/^\s*(?:u\s*_?\s*n|t\s*n|nth term)\s*=\s*/i, ""));
  if (!e) return "could not parse";
  const vars = [...exprVars(e)];
  if (vars.some((v) => v !== "n")) return `uses letters other than n: ${vars.join(", ")}`;
  const got = terms.map((_, i) => evalExpr(e, { n: i + 1 }));
  const ok = got.every((g, i) => close(g, terms[i]));
  return ok ? true : `gives ${got.map((g) => +g.toFixed(6)).join(", ")}`;
}

/** Parse an option as algebra ("28x − 9", "{{6x^2+x-12}}"); null if it isn't plain algebra. */
function optionExpr(text: string) {
  const s = normalizeInput(plainOption(text));
  if (/[a-z]{3,}/i.test(s.replace(/sqrt|cbrt/g, ""))) return null; // words
  return parseExpr(s);
}

/** Check an MCQ key against its verify expression. Returns a list of problems (empty = fine). */
export function verifyMcq(options: string[], answerIndex: number, verify: string): string[] {
  const problems: string[] = [];
  const v = verify.trim();
  if (v.startsWith("terms:")) {
    const terms = parseTerms(v);
    if (!terms) return [`verify "${v}" — terms must be numbers`];
    const r = generates(options[answerIndex], terms);
    if (r !== true) problems.push(`KEY MISMATCH — keyed option "${options[answerIndex]}" does not generate ${terms.join(", ")} (${r})`);
    options.forEach((o, j) => {
      if (j !== answerIndex && generates(o, terms) === true) problems.push(`option ${j} "${o}" ALSO generates ${terms.join(", ")}`);
    });
    return problems;
  }
  const ve = parseExpr(v);
  if (!ve) return [`verify "${v}" could not be parsed`];
  if (exprVars(ve).size > 0) {
    // algebra: keyed option must be equivalent to the verify expression, and no other option may be
    const keyed = optionExpr(options[answerIndex]);
    if (!keyed) return [`verify is algebra but the keyed option "${options[answerIndex]}" is not plain algebra`];
    if (!exprEquivalent(ve, keyed)) problems.push(`KEY MISMATCH — keyed option "${options[answerIndex]}" is NOT equivalent to verify "${v}"`);
    options.forEach((o, j) => {
      if (j === answerIndex) return;
      const e = optionExpr(o);
      if (e && exprEquivalent(ve, e)) problems.push(`option ${j} "${o}" is ALSO equivalent to "${v}"`);
    });
    return problems;
  }
  const val = evalExpr(ve, {});
  const values = options.map(optionValue);
  if (!Number.isFinite(val)) return [`verify "${v}" did not evaluate to a number`];
  if (values[answerIndex] === null) return [`verify given but the keyed option "${options[answerIndex]}" is not a plain number`];
  if (!close(val, values[answerIndex]!)) problems.push(`KEY MISMATCH — verify "${v}" = ${val} but keyed option is "${options[answerIndex]}" (${values[answerIndex]})`);
  values.forEach((x, j) => {
    if (j !== answerIndex && x !== null && close(x, val)) problems.push(`option ${j} "${options[j]}" has the same value as the answer`);
  });
  return problems;
}
