// Fresh-number generators — Expressions (Unit 2). See fr.ts (fr-add) for the reference example.
//
//   ex-collect   (ex-simplify)   collect like terms, incl. x², x³, xy and number terms
//   ex-multiply  (ex-simplify)   products and quotients of terms: 3a × 4ab, 2x × 5x, 12x² ÷ 3x, (3y)²
//   ex-expand    (ex-expand)     single brackets; sums and differences of brackets
//   ex-factorise (ex-factorise)  factorise fully into a single bracket
//   ex-double    (ex-double)     (x + a)(x + b), (px + a)(qx + b), (x ± a)², rectangle areas
//   ex-forming   (ex-forming)    perimeters with algebraic sides; missing angles from angle facts
//
// Every expression is built from coefficients with poly/term, so the text never shows "1x",
// "+-" or "--". Wrong answers are real slips worked out from the same numbers; `distinct`
// drops any that equal the answer or an earlier wrong answer in value (the MCQ check only
// compares each option with the answer, not the options with each other).

import type { Difficulty } from "../types.ts";
import { exprEquivalent, parseExpr } from "../mathParse.ts";
import { cap, exprSpec, gcd, m, num, poly, term, type Draft, type Generator, type Rng, type Wrong } from "./core.ts";

// ---------------------------------------------------------------------------
// A small algebra toolkit: a term is a number times a product of letters.
// ---------------------------------------------------------------------------

/** Letter → power, e.g. {a: 2, b: 1} for a²b. */
type Mono = Record<string, number>;
/** One term: coefficient × letters. */
interface T {
  c: number;
  v: Mono;
}
type Env = Record<string, number>;

const tm = (c: number, v: Mono = {}): T => ({ c, v });
/** The letter L to the power p. */
const pw = (L: string, p = 1): Mono => ({ [L]: p });

/** "a^2b" for {a: 2, b: 1}: letters in alphabetical order, ^ only for powers above 1. */
function monoStr(v: Mono): string {
  return Object.keys(v)
    .filter((k) => v[k] > 0)
    .sort()
    .map((k) => (v[k] === 1 ? k : `${k}^${v[k]}`))
    .join("");
}
const deg = (v: Mono) => Object.values(v).reduce((s, p) => s + p, 0);
const same = (a: Mono, b: Mono) => monoStr(a) === monoStr(b);
function mulMono(a: Mono, b: Mono): Mono {
  const o: Mono = { ...a };
  for (const k of Object.keys(b)) o[k] = (o[k] ?? 0) + b[k];
  return o;
}
const mul = (a: T, b: T): T => tm(a.c * b.c, mulMono(a.v, b.v));
const neg = (a: T): T => tm(-a.c, a.v);
const abs = (a: T): T => tm(Math.abs(a.c), a.v);

/** One term as ASCII maths: "3x", "-x", "x^2y", "5". */
const ts = (a: T) => term(a.c, monoStr(a.v), true) || "0";
/** A term with its sign always shown: "+6", "-4x" (as in −2 × −3 = +6). */
const sg = (a: T) => (a.c > 0 ? `+${ts(a)}` : ts(a));
/** Terms in the order given, e.g. "2x^2+3x-5". */
const P = (xs: T[]) => poly(xs.map((x) => [x.c, monoStr(x.v)] as [number, string]));

/** Highest degree first, then alphabetical; number terms last. */
function byDegree(a: T, b: T): number {
  const d = deg(b.v) - deg(a.v);
  if (d) return d;
  const ka = monoStr(a.v);
  const kb = monoStr(b.v);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

/** Collect like terms, keeping the order in which each kind first appears; zeros dropped. */
function collectKeep(xs: T[]): T[] {
  const out: T[] = [];
  for (const x of xs) {
    const cur = out.find((o) => same(o.v, x.v));
    if (cur) cur.c += x.c;
    else out.push(tm(x.c, { ...x.v }));
  }
  return out.filter((x) => x.c !== 0);
}
/** Collect like terms, highest degree first. */
const collect = (xs: T[]) => collectKeep(xs).sort(byDegree);

const valT = (a: T, env: Env) => Object.keys(a.v).reduce((s, k) => s * env[k] ** a.v[k], a.c);
const valP = (xs: T[], env: Env) => xs.reduce((s, x) => s + valT(x, env), 0);

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/** Plain-text sum of values with real minus signs: "8 + 6 − 2 = 12". */
function sumStr(vals: number[]): string {
  const s = vals.map((v, i) => (i === 0 ? num(v) : v < 0 ? ` − ${num(-v)}` : ` + ${num(v)}`)).join("");
  return vals.length > 1 ? `${s} = ${num(vals.reduce((a, b) => a + b, 0))}` : s;
}
/** "a, b and c". */
function list(xs: string[]): string {
  return xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}
/** A number for plain text, in brackets when negative: "(−3)". */
const brk = (v: number) => (v < 0 ? `(${num(v)})` : num(v));
/** Rename the chosen letters to x, y, z so that a new letter alone doesn't make a new question. */
function canon(s: string, letters: string[]): string {
  const to = ["x", "y", "z"];
  return s.replace(/[a-z]/g, (ch) => {
    const i = letters.indexOf(ch);
    return i >= 0 ? to[i] : ch;
  });
}

// ---------------------------------------------------------------------------
// Wrong answers
// ---------------------------------------------------------------------------

/** A wrong answer written as ASCII algebra: shown as {{expr}}, with the same expression as its trap spec. */
function wrong(expr: string, feedback: string): Wrong {
  return { display: m(expr), spec: exprSpec(expr), feedback };
}

/** Keep the wrong answers whose value differs from the answer and from every earlier one (first wins). */
function distinct(answer: string, ws: (Wrong | null | undefined)[]): Wrong[] {
  const first = parseExpr(answer);
  const seen = first ? [first] : [];
  const out: Wrong[] = [];
  for (const w of ws) {
    if (!w || !w.spec || w.spec.type !== "expression") continue;
    const e = parseExpr(w.spec.expr);
    if (!e || seen.some((s) => exprEquivalent(s, e))) continue;
    seen.push(e);
    out.push(w);
  }
  return out;
}

const LETTERS = ["x", "y", "a", "b", "k", "m", "n", "p", "t", "w"];
const PAIRS: [string, string][] = [
  ["x", "y"],
  ["a", "b"],
  ["m", "n"],
  ["p", "q"],
  ["s", "t"],
];
/** A non-zero whole number from lo to hi, negative with probability pNeg. */
const nz = (r: Rng, lo: number, hi: number, pNeg = 0.5) => (r.chance(pNeg) ? -1 : 1) * r.int(lo, hi);

// ---------------------------------------------------------------------------
// ex-collect — simplify by collecting like terms
// ---------------------------------------------------------------------------

/** A term as written in the question; d is how its letters are written ("yx" for an xy term). */
interface QT extends T {
  d: string;
}

const exCollect: Generator = {
  id: "ex-collect",
  topic: "ex",
  section: "ex-simplify",
  label: "Simplify by collecting like terms (x², x³, xy and number terms)",
  kinds: ["mcq", "qa"],
  make(r) {
    const difficulty = r.pick(["warmup", "core", "core", "challenge"] as const);
    const tpl = difficulty === "challenge" ? r.pick(["sq", "cube", "two"] as const) : r.pick(["sq", "sq", "two"] as const);
    const [L, L2] = tpl === "two" ? r.pick(PAIRS) : [r.pick(LETTERS), ""];
    const kinds: { v: Mono; n: number }[] =
      tpl === "sq"
        ? [
            { v: pw(L, 2), n: 2 },
            { v: pw(L), n: 2 },
          ]
        : tpl === "cube"
          ? [
              { v: pw(L, 3), n: r.int(1, 2) },
              { v: pw(L, 2), n: 2 },
            ]
          : [
              { v: { [L]: 1, [L2]: 1 }, n: 2 },
              { v: pw(L), n: 2 },
            ];
    if (difficulty !== "warmup" && r.chance(0.5)) kinds.push({ v: tpl === "cube" ? pw(L) : {}, n: tpl === "sq" && difficulty === "challenge" ? 2 : 1 });
    const max = difficulty === "warmup" ? 6 : 9;
    const pNeg = difficulty === "challenge" ? 0.4 : 0.3;
    const total = (g: QT[]) => g.reduce((s, x) => s + x.c, 0);

    let terms: QT[] = [];
    for (;;) {
      const raw = kinds.map((k) => Array.from({ length: k.n }, (): QT => ({ c: r.int(1, max), v: k.v, d: monoStr(k.v) })));
      // a term with no number in front (x on its own) — always in the xy questions
      if (tpl === "two" || r.chance(0.4)) r.pick(raw.filter((g) => g.length > 1).flat()).c = 1;
      let order: QT[];
      if (difficulty === "warmup") {
        order = [raw[0][0], raw[1][0], raw[0][1], raw[1][1]];
        order[r.int(1, 3)].c *= -1;
      } else {
        order = r.shuffle(raw.flat());
        for (const x of order) if (r.chance(pNeg)) x.c *= -1;
        const j = order.findIndex((x) => x.c > 0);
        if (j < 0 || !order.some((x) => x.c < 0)) continue;
        order.unshift(...order.splice(j, 1));
      }
      if (kinds.some((k) => total(order.filter((x) => same(x.v, k.v))) === 0)) continue;
      terms = order;
      break;
    }
    // challenge: write one xy term back to front, as yx (it is still a like term)
    if (tpl === "two" && difficulty === "challenge") {
      const xy = terms.filter((x, i) => i > 0 && deg(x.v) === 2);
      if (xy.length) r.pick(xy).d = L2 + L;
    }

    const qStr = poly(terms.map((x) => [x.c, x.d] as [number, string]));
    const answer = collect(terms);
    const ans = P(answer);
    const groups = answer.map((a) => terms.filter((x) => same(x.v, a.v)));
    const gStr = (g: QT[]) => poly(g.map((x) => [x.c, x.d] as [number, string]));
    const gSum = (g: QT[]) => m(`${gStr(g)} = ${ts(tm(total(g), g[0].v))}`);
    const name = (v: Mono) => (deg(v) ? `${m(monoStr(v))} terms` : "number terms");
    const setTotal = (v: Mono, c: number) => P(collect(answer.map((a) => (same(a.v, v) ? tm(c, a.v) : a))));
    const tq = (x: QT) => term(x.c, x.d, true);

    // 1. adding the powers: 2x² + 4x² = 6x⁴
    const powers = groups
      .filter((g) => g.length > 1 && Object.keys(g[0].v).length === 1 && (g[0].v[L] ?? 0) >= 2)
      .map((g) => {
        const big = pw(L, 2 * g[0].v[L]);
        return wrong(
          P(collect(answer.map((a) => (same(a.v, g[0].v) ? tm(a.c, big) : a)))),
          `You added the powers as well: ${gSum(g)}, not ${m(ts(tm(total(g), big)))}. Collecting like terms only changes the number in front — the power stays the same. (Powers add when you **multiply**.)`,
        );
      });
    // 2. the sign of a subtracted term (one slip per group)
    const signs: Wrong[] = [];
    const flippedGroups = new Set<QT[]>();
    terms.forEach((x, i) => {
      const g = groups.find((gr) => gr.includes(x))!;
      if (i === 0 || x.c > 0 || g.length < 2 || flippedGroups.has(g)) return;
      const flipped = g.map((y) => (y === x ? { ...y, c: -y.c } : y));
      const slip = total(flipped);
      if (slip === 0) return;
      flippedGroups.add(g);
      signs.push(
        wrong(
          setTotal(g[0].v, slip),
          `The minus sign belongs to the ${m(term(-x.c, x.d, true))} straight after it, so the ${name(g[0].v)} are ${gSum(g)}, not ${m(`${gStr(flipped)} = ${ts(tm(slip, g[0].v))}`)}. Each term keeps the sign in front of it.`,
        ),
      );
    });
    // 3. combining unlike terms
    let unlike: Wrong | null = null;
    const k0 = answer.find((a) => deg(a.v) === 0);
    const k1 = answer.find((a) => deg(a.v) === 1);
    if (k0 && k1) {
      const merged = tm(k1.c + k0.c, k1.v);
      if (merged.c)
        unlike = wrong(
          P(collect([...answer.filter((a) => a !== k0 && a !== k1), merged])),
          `${m(ts(k1))} and ${m(ts(k0))} are unlike terms — one has ${m(L)} in it and the other is just a number — so they can't be combined into ${m(ts(merged))}.`,
        );
    } else {
      const [hi, lo] = answer.slice(-2);
      const merged = tm(hi.c + lo.c, hi.v);
      if (merged.c)
        unlike = wrong(
          P(collect([...answer.slice(0, -2), merged])),
          `${m(ts(hi))} and ${m(ts(lo))} are unlike terms (${m(monoStr(hi.v))} and ${m(monoStr(lo.v))} are different), so they can't be added together to make ${m(ts(merged))}. Only terms with the same letters **and** the same powers can be collected.`,
        );
    }
    // 4. leaving out a term with no number in front
    let lone: Wrong | null = null;
    for (const x of terms) {
      const g = groups.find((gr) => gr.includes(x))!;
      const slip = total(g) - x.c;
      if (Math.abs(x.c) !== 1 || !deg(x.v) || g.length < 2 || slip === 0) continue;
      lone = wrong(
        setTotal(g[0].v, slip),
        `That leaves out the ${m(tq(x))}. A term with no number in front still counts — it means one ${m(x.d)} — so the ${name(g[0].v)} are ${gSum(g)}.`,
      );
      break;
    }
    // 5. losing the minus sign of a negative total
    const negTotals = groups
      .filter((g) => g.length > 1 && total(g) < 0)
      .map((g) =>
        wrong(
          setTotal(g[0].v, -total(g)),
          `${m(gStr(g))} is ${m(ts(tm(total(g), g[0].v)))}, not ${m(ts(tm(-total(g), g[0].v)))}: more is taken away than added, so the result is negative.`,
        ),
      );

    const singles = groups.filter((g) => g.length === 1).map((g) => m(tq(g[0])));
    const stepsText =
      list(groups.filter((g) => g.length > 1).map(gSum)) +
      (singles.length ? `; ${list(singles)} ${singles.length > 1 ? "have no like terms, so they stay as they are" : "has no like term, so it stays as it is"}` : "");
    const env: Env = tpl === "two" ? { [L]: 2, [L2]: 3 } : { [L]: 2 };
    const envText = tpl === "two" ? `${L} = 2 and ${L2} = 3` : `${L} = 2`;
    const check = `Quick check with ${envText}: the question gives ${sumStr(terms.map((x) => valT(x, env)))}, and ${m(ans)} gives ${sumStr(answer.map((a) => valT(a, env)))} ✓`;
    const unlikePair = tpl === "two" ? `${m(L + L2)} and ${m(L)}` : tpl === "cube" ? `${m(`${L}^3`)} and ${m(`${L}^2`)}` : `${m(`${L}^2`)} and ${m(L)}`;
    const firstPair = groups.find((g) => g.length > 1)!;

    return {
      difficulty,
      question: `Simplify ${m(qStr)}.`,
      prompt: "Collect the like terms and give your answer in its simplest form.",
      answer: exprSpec(ans, "simplified"),
      display: m(ans),
      correctFeedback: `${cap(list(groups.filter((g) => g.length > 1).map(gSum)))}, so the answer is ${m(ans)}.`,
      wrong: distinct(ans, [...powers, signs[0], unlike, lone, ...negTotals, ...signs.slice(1)]),
      explanation: `Like terms have the same letters **and** the same powers. Collect each group, keeping the sign in front of each term: ${stepsText}. So the answer is ${m(ans)}. ${check}.`,
      solution: [
        `Like terms have exactly the same letters with the same powers — ${unlikePair} are **not** like terms. Group the like terms, keeping the sign in front of each one.`,
        `${cap(stepsText)}.`,
        `So the answer is ${m(ans)}.`,
        `${check}.`,
      ],
      hints: [
        `Like terms have exactly the same letters with the same powers — ${unlikePair} are **not** like terms. Which terms belong together?`,
        `Collect one group at a time, keeping each sign: the ${name(firstPair[0].v)} are ${list(firstPair.map((x) => m(tq(x))))}.`,
      ],
      verify: qStr,
      commonError:
        tpl === "two"
          ? `Treating ${m(L + L2)} and ${m(L)} as like terms, or losing the minus sign in front of a term.`
          : "Adding the powers when collecting like terms (the power never changes when you add), or losing the minus sign in front of a term.",
      strategy: "Check by substituting",
      marks: difficulty === "warmup" ? 1 : 2,
      sig: terms
        .map((x) => canon(ts(x), [L, L2]))
        .sort()
        .join(","),
    };
  },
};

// ---------------------------------------------------------------------------
// ex-multiply — simplify products and quotients of terms
// ---------------------------------------------------------------------------

/** "3 * a * a * b" for 3a²b (numbers and letters written out). */
const splitTerm = (f: T) => [String(f.c), ...Object.keys(f.v).sort().flatMap((k) => Array<string>(f.v[k]).fill(k))].join(" * ");
/** "a * a * b" for a²b. */
const lettersOut = (f: T) => Object.keys(f.v).sort().flatMap((k) => Array<string>(f.v[k]).fill(k)).join(" * ");

const exMultiply: Generator = {
  id: "ex-multiply",
  topic: "ex",
  section: "ex-simplify",
  label: "Simplify products and quotients of terms (3a × 4ab, 12x² ÷ 3x, (3y)²)",
  kinds: ["mcq", "qa"],
  make(r) {
    const tpl = r.pick(["xx", "xx", "ab", "ab", "abc", "cube", "div", "div", "divab", "div3", "square"] as const);
    const two = tpl === "ab" || tpl === "abc" || tpl === "divab";
    const [L, L2] = two ? r.pick(PAIRS) : [r.pick(LETTERS), ""];
    const letters = two ? [L, L2] : [L];
    const XY: Mono = { [L]: 1, [L2]: 1 };
    const pq = () => {
      let p = 2;
      let q = 2;
      while (p === 2 && q === 2) {
        p = r.int(2, 9);
        q = r.int(2, 9);
      }
      return [p, q];
    };
    const added = (p: number, q: number) => `You added the numbers (${m(`${p} + ${q} = ${p + q}`)}) instead of multiplying them: ${m(`${p} * ${q} = ${p * q}`)}.`;

    let kind: "prod" | "div" | "sq" = "prod";
    let factors: T[] = [];
    let numer = tm(1);
    let denom = tm(1);
    let base = tm(1);
    let ans = tm(1);
    let why = "";
    let difficulty: Difficulty = "core";
    let cands: (Wrong | null)[] = [];

    if (tpl === "xx") {
      // 2x × 5x
      const [p0, q] = pq();
      const negative = r.chance(0.25);
      const p = negative ? -p0 : p0;
      difficulty = negative ? "challenge" : "warmup";
      factors = [tm(p, pw(L)), tm(q, pw(L))];
      ans = tm(p * q, pw(L, 2));
      const sum = p + q;
      cands = [
        sum ? wrong(ts(tm(sum, pw(L, 2))), `${added(p, q)} The sign is ×, so the numbers multiply.`) : null,
        wrong(ts(tm(p * q, pw(L))), `${m(`${L} * ${L}`)} is ${m(`${L}^2`)}, not ${m(L)} — two ${m(L)}'s multiplied together make ${m(L)} squared.`),
        negative ? wrong(ts(tm(-p * q, pw(L, 2))), `Check the sign: a negative times a positive is negative, so ${m(`${p} * ${q} = ${p * q}`)}.`) : null,
        sum
          ? wrong(
              ts(tm(sum, pw(L))),
              `That's ${m(`${ts(factors[0])} + ${ts(factors[1])}`)} — you added the terms. The sign is ×, so multiply the numbers (${m(`${p} * ${q} = ${p * q}`)}) and the letters (${m(`${L} * ${L} = ${L}^2`)}).`,
            )
          : null,
        wrong(ts(tm(2 * p * q, pw(L))), `${m(`${L} * ${L}`)} is ${m(`${L}^2`)}, not ${m(`2${L}`)} — ${m(`2${L}`)} means ${m(`${L} + ${L}`)}.`),
      ];
    } else if (tpl === "ab") {
      // 3a × 4ab
      const [p, q] = pq();
      const rep = r.chance(0.5) ? L : L2;
      const once = rep === L ? L2 : L;
      factors = rep === L ? [tm(p, pw(L)), tm(q, XY)] : [tm(p, XY), tm(q, pw(L2))];
      ans = tm(p * q, mulMono(factors[0].v, factors[1].v));
      cands = [
        wrong(ts(tm(p + q, ans.v)), added(p, q)),
        wrong(ts(tm(p * q, XY)), `${m(rep)} is in both terms, so ${m(`${rep} * ${rep} = ${rep}^2`)}. The letters multiply to ${m(monoStr(ans.v))}, not ${m(monoStr(XY))}.`),
        wrong(ts(tm(p * q, { [L]: 2, [L2]: 2 })), `Only ${m(rep)} appears twice. ${m(once)} appears once, so it stays as ${m(once)}, not ${m(`${once}^2`)}.`),
        wrong(
          ts(tm(p + q, XY)),
          `You added the numbers and lost the power. Multiply the numbers (${m(`${p} * ${q} = ${p * q}`)}) and the letters (${m(`${monoStr(factors[0].v)} * ${monoStr(factors[1].v)} = ${monoStr(ans.v)}`)}).`,
        ),
      ];
    } else if (tpl === "abc") {
      // 2a × 3b × 4a
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const s = r.int(2, 5);
      difficulty = "challenge";
      factors = [tm(p, pw(L)), tm(q, pw(L2)), tm(s, pw(L))];
      ans = tm(p * q * s, { [L]: 2, [L2]: 1 });
      const c = p * q * s;
      cands = [
        wrong(ts(tm(p + q + s, ans.v)), `You added the numbers (${m(`${p} + ${q} + ${s} = ${p + q + s}`)}) instead of multiplying them: ${m(`${p} * ${q} * ${s} = ${c}`)}.`),
        wrong(ts(tm(c, XY)), `There are two ${m(L)}'s, and ${m(`${L} * ${L} = ${L}^2`)}. The letters multiply to ${m(monoStr(ans.v))}, not ${m(monoStr(XY))}.`),
        wrong(ts(tm(c, { [L]: 1, [L2]: 2 })), `It's ${m(L)} that appears twice, not ${m(L2)}: ${m(`${L} * ${L2} * ${L} = ${monoStr(ans.v)}`)}.`),
        wrong(ts(tm(c, { [L]: 2, [L2]: 2 })), `Only ${m(L)} appears twice. ${m(L2)} appears once, so it stays as ${m(L2)}, not ${m(`${L2}^2`)}.`),
      ];
    } else if (tpl === "cube") {
      // 3x² × 4x
      const [p, q] = pq();
      difficulty = "challenge";
      factors = r.chance(0.5) ? [tm(p, pw(L, 2)), tm(q, pw(L))] : [tm(p, pw(L)), tm(q, pw(L, 2))];
      ans = tm(p * q, pw(L, 3));
      const lets = `${monoStr(factors[0].v)} * ${monoStr(factors[1].v)}`;
      cands = [
        wrong(ts(tm(p + q, pw(L, 3))), added(p, q)),
        wrong(ts(tm(p * q, pw(L, 2))), `${m(lets)} is ${m(`${L} * ${L} * ${L} = ${L}^3`)} — count the ${m(L)}'s: there are three, not two.`),
        wrong(ts(tm(p + q, pw(L, 2))), `You added the numbers and kept ${m(`${L}^2`)}. Multiply the numbers (${m(`${p} * ${q} = ${p * q}`)}) and count the ${m(L)}'s: ${m(`${lets} = ${L}^3`)}.`),
      ];
    } else if (tpl === "square") {
      // (3y)²
      kind = "sq";
      const p = r.int(3, 9);
      base = tm(p, pw(L));
      ans = tm(p * p, pw(L, 2));
      const b = ts(base);
      cands = [
        wrong(ts(tm(p, pw(L, 2))), `You only squared the ${m(L)}. The bracket means the **whole** of ${m(b)} is squared: ${m(`${b} * ${b}`)}.`),
        wrong(ts(tm(2 * p, pw(L, 2))), `Squaring means multiplying a number by itself, not doubling it: ${m(`${p} * ${p} = ${p * p}`)}, not ${m(`${p} * 2 = ${2 * p}`)}.`),
        wrong(ts(tm(p * p, pw(L))), `You squared the ${p} but not the ${m(L)}: ${m(`${L} * ${L} = ${L}^2`)}.`),
        wrong(ts(tm(2 * p, pw(L))), `${m(`(${b})^2`)} means ${m(`${b} * ${b}`)}, not ${m(`${b} + ${b}`)}.`),
      ];
    } else {
      // 12x² ÷ 3x · 12ab ÷ 4b · 12x³ ÷ 3x
      kind = "div";
      const p = r.int(2, 9);
      const q = r.int(2, 9);
      const e = tpl === "div3" ? r.int(1, 2) : 1;
      if (tpl === "div") {
        numer = tm(p * q, pw(L, 2));
        denom = tm(p, pw(L));
        ans = tm(q, pw(L));
        why = `one ${m(L)} on the bottom cancels one of the two on top`;
      } else if (tpl === "divab") {
        numer = tm(p * q, XY);
        denom = tm(p, pw(L2));
        ans = tm(q, pw(L));
        why = `the ${m(L2)}'s cancel and the ${m(L)} stays`;
      } else {
        numer = tm(p * q, pw(L, 3));
        denom = tm(p, pw(L, e));
        ans = tm(q, pw(L, 3 - e));
        why = e === 1 ? `one ${m(L)} cancels, leaving two` : `two ${m(L)}'s cancel, leaving one`;
        difficulty = "challenge";
      }
      const lettersLine = m(`${monoStr(numer.v)} ÷ ${monoStr(denom.v)} = ${monoStr(ans.v)}`);
      const sub = p * q - p;
      const subtracted = sub !== q ? wrong(ts(tm(sub, ans.v)), `You subtracted ${m(`${p * q} - ${p}`)}. ÷ means divide: ${m(`${p * q} ÷ ${p} = ${q}`)}.`) : null;
      const wrongWay = wrong(
        `${monoStr(ans.v)}/${q}`,
        `You divided the numbers the wrong way round (${m(`${p} ÷ ${p * q} = 1/${q}`)}). Divide the top number by the bottom one: ${m(`${p * q} ÷ ${p} = ${q}`)}.`,
      );
      if (tpl === "div")
        cands = [
          wrong(ts(tm(q, pw(L, 2))), `You divided the numbers but not the letters: ${lettersLine} — ${why}.`),
          wrong(String(q), `${m(`${L}^2 ÷ ${L}`)} leaves one ${m(L)}, not nothing: ${m(`${L} * ${L} ÷ ${L} = ${L}`)}.`),
          subtracted,
          wrongWay,
        ];
      else if (tpl === "divab")
        cands = [
          wrong(ts(tm(q, XY)), `You divided the numbers but didn't cancel the ${m(L2)}. There's a ${m(L2)} on the top and on the bottom, and ${m(`${L2} ÷ ${L2} = 1`)}.`),
          subtracted,
          wrongWay,
          wrong(String(q), `The ${m(L2)}'s cancel, but the ${m(L)} has nothing to cancel with, so it stays: ${lettersLine}.`),
        ];
      else
        cands = [
          wrong(ts(tm(q, pw(L, 3))), `You divided the numbers but forgot to cancel the ${m(L)}'s: ${lettersLine} — ${why}.`),
          wrong(ts(tm(q, pw(L, 2 - e))), `You cancelled too many ${m(L)}'s: ${lettersLine} — ${why}.`),
          wrong(ts(tm(q, pw(L, 3 + e))), `When you divide, the powers **subtract** (3 − ${e} = ${3 - e}), so ${lettersLine}, not ${m(monoStr(pw(L, 3 + e)))}.`),
          subtracted,
        ];
    }

    const ansStr = ts(ans);
    const env: Env = two ? { [L]: 2, [L2]: 3 } : { [L]: 2 };
    const envText = two ? `${L} = 2 and ${L2} = 3` : `${L} = 2`;
    const ansCheck = `${[num(ans.c), ...Object.keys(ans.v)
      .sort()
      .filter((k) => ans.v[k] > 0)
      .map((k) => num(env[k] ** ans.v[k]))].join(" × ")} = ${num(valT(ans, env))}`;

    let qText: string;
    let verify: string;
    let sig: string;
    let correctFeedback: string;
    let explanation: string;
    let solution: string[];
    let hints: string[];
    let commonError: string;
    if (kind === "prod") {
      const qExpr = factors.map(ts).join(" * ");
      const nums = factors.map((f) => String(f.c)).join(" * ");
      const lets = factors.map((f) => monoStr(f.v)).join(" * ");
      const rep = Object.keys(ans.v).find((k) => ans.v[k] >= 2) ?? L;
      const count = ans.v[rep];
      const fv = factors.map((f) => valT(f, env));
      const check = `Quick check with ${envText}: ${m(qExpr)} gives ${fv.map(brk).join(" × ")} = ${num(fv.reduce((s, x) => s * x, 1))}, and ${m(ansStr)} gives ${ansCheck} ✓`;
      qText = m(qExpr);
      verify = factors.map(ts).join("*");
      sig = factors
        .map((f) => canon(ts(f), letters))
        .sort()
        .join("*");
      correctFeedback = `Numbers: ${m(`${nums} = ${ans.c}`)}. Letters: ${m(`${lets} = ${monoStr(ans.v)}`)}. So the answer is ${m(ansStr)}.`;
      explanation = `Multiply the numbers, then multiply the letters. Numbers: ${m(`${nums} = ${ans.c}`)}. Letters: ${m(`${lets} = ${monoStr(ans.v)}`)} (${count === 2 ? "two" : "three"} ${m(rep)}'s multiplied together make ${m(`${rep}^${count}`)}). So ${m(`${qExpr} = ${ansStr}`)}. ${check}.`;
      solution = [`Multiply the numbers: ${m(`${nums} = ${ans.c}`)}.`, `Multiply the letters: ${m(`${lets} = ${monoStr(ans.v)}`)}.`, `So ${m(`${qExpr} = ${ansStr}`)}.`, `${check}.`];
      hints = [`Split it up: ${m(factors.map(splitTerm).join(" * "))}. Deal with the numbers and the letters separately.`, "Multiply the numbers together, then count how many of each letter there are altogether."];
      commonError = `Adding the numbers instead of multiplying them, or writing ${m(`${rep} * ${rep}`)} as ${m(rep)} instead of ${m(`${rep}^2`)}.`;
    } else if (kind === "div") {
      const n = ts(numer);
      const d = ts(denom);
      const lettersLine = m(`${monoStr(numer.v)} ÷ ${monoStr(denom.v)} = ${monoStr(ans.v)}`);
      const check = `Check by multiplying back: ${m(`${ansStr} * ${d} = ${n}`)} ✓`;
      qText = r.chance(0.5) ? `${m(n)} ÷ ${m(d)}` : m(`${n}/${d}`);
      verify = `${n}/(${d})`;
      sig = `${canon(n, letters)}/${canon(d, letters)}`;
      correctFeedback = `Numbers: ${m(`${numer.c} ÷ ${denom.c} = ${ans.c}`)}. Letters: ${lettersLine}. So the answer is ${m(ansStr)}.`;
      explanation = `Divide the numbers, then cancel the letters. Numbers: ${m(`${numer.c} ÷ ${denom.c} = ${ans.c}`)}. Letters: ${lettersLine} — ${why}. So the answer is ${m(ansStr)}. ${check}.`;
      solution = [`Divide the numbers: ${m(`${numer.c} ÷ ${denom.c} = ${ans.c}`)}.`, `Cancel the letters: ${lettersLine} — ${why}.`, `So the answer is ${m(ansStr)}.`, `${check}.`];
      hints = [
        `Split it into a number part and a letter part: ${m(`${numer.c} ÷ ${denom.c}`)} and ${m(`${monoStr(numer.v)} ÷ ${monoStr(denom.v)}`)}.`,
        `Write the letters out in full, ${m(`(${lettersOut(numer)})/(${lettersOut(denom)})`)}, then cancel any letter that is on both the top and the bottom.`,
      ];
      commonError = "Dividing the numbers but forgetting to cancel the letters, or cancelling all of them.";
    } else {
      const b = ts(base);
      const p = base.c;
      const check = `Quick check with ${L} = 2: ${m(`(${p} * 2)^2 = ${2 * p}^2 = ${4 * p * p}`)}, and ${m(`${p * p} * 4 = ${4 * p * p}`)} ✓`;
      qText = m(`(${b})^2`);
      verify = `(${b})^2`;
      sig = canon(`(${b})^2`, letters);
      correctFeedback = `${m(`(${b})^2 = ${b} * ${b}`)}: ${m(`${p} * ${p} = ${p * p}`)} and ${m(`${L} * ${L} = ${L}^2`)}, so the answer is ${m(ansStr)}.`;
      explanation = `The square applies to everything in the bracket: ${m(`(${b})^2 = ${b} * ${b}`)}. Multiply the numbers (${m(`${p} * ${p} = ${p * p}`)}) and the letters (${m(`${L} * ${L} = ${L}^2`)}). So ${m(`(${b})^2 = ${ansStr}`)}. ${check}.`;
      solution = [`${m(`(${b})^2 = ${b} * ${b}`)} — the square applies to everything in the bracket.`, `Numbers: ${m(`${p} * ${p} = ${p * p}`)}. Letters: ${m(`${L} * ${L} = ${L}^2`)}.`, `So the answer is ${m(ansStr)}.`, `${check}.`];
      hints = [`Write ${m(`(${b})^2`)} as ${m(`${b} * ${b}`)}.`, "Multiply the numbers together and the letters together."];
      commonError = `Squaring only the letter, e.g. writing ${m(`(${b})^2 = ${p}${L}^2`)} instead of ${m(ansStr)}.`;
    }

    return {
      difficulty,
      question: `Simplify ${qText}.`,
      prompt: "Write your answer as a single term.",
      answer: exprSpec(ansStr, "simplified"),
      display: m(ansStr),
      correctFeedback,
      wrong: distinct(ansStr, cands),
      explanation,
      solution,
      hints,
      verify,
      commonError,
      strategy: kind === "div" ? "Work backwards" : "Check by substituting",
      marks: difficulty === "warmup" ? 1 : 2,
      sig,
    };
  },
};

// ---------------------------------------------------------------------------
// ex-expand — expand single brackets; sums and differences of brackets
// ---------------------------------------------------------------------------

/** k(inner[0] + inner[1]) */
interface Br {
  k: T;
  inner: [T, T];
}
type Part = Br | { t: T };
const isBr = (p: Part): p is Br => "k" in p;
type Mode = "ok" | "firstOnly" | "secondOnly" | "signSecond" | "signFirst" | "ignoreMinus" | "addNotMultiply" | "noSquare";

/** A bracket multiplied out — properly, or with one classic slip. */
function expandPart(p: Part, mode: Mode = "ok"): T[] {
  if (!isBr(p)) return [p.t];
  const [a, b] = p.inner;
  const k = p.k;
  switch (mode) {
    case "firstOnly":
      return [mul(k, a), b];
    case "secondOnly":
      return [a, mul(k, b)];
    case "signSecond":
      return [mul(k, a), neg(mul(k, b))];
    case "signFirst":
      return [neg(mul(k, a)), mul(k, b)];
    case "ignoreMinus":
      return [mul(abs(k), a), mul(abs(k), b)];
    case "addNotMultiply":
      return [mul(k, a), tm(k.c + b.c, b.v)];
    case "noSquare":
      return [tm(k.c * a.c, a.v), mul(k, b)];
    default:
      return [mul(k, a), mul(k, b)];
  }
}
const expandAll = (parts: Part[], modes: Record<number, Mode> = {}) => collect(parts.flatMap((p, i) => expandPart(p, modes[i])));
const exprOf = (parts: Part[]) =>
  parts.map((p, i) => (isBr(p) ? `${term(p.k.c, monoStr(p.k.v), i === 0)}(${P(p.inner)})` : term(p.t.c, monoStr(p.t.v), i === 0))).join("");
/** "-2(2x-3) = -4x+6" */
const bracketLine = (b: Br) => `${ts(b.k)}(${P(b.inner)}) = ${P(expandPart(b))}`;

/** The question's value worked out in plain text: "4 × 3 − 2 × 1 = 10". */
function partsCheck(parts: Part[], env: Env): string {
  let s = "";
  let total = 0;
  parts.forEach((p, i) => {
    const v = isBr(p) ? valT(p.k, env) : valT(p.t, env);
    const inner = isBr(p) ? valP(p.inner, env) : 1;
    const body = isBr(p) ? `${num(Math.abs(v))} × ${brk(inner)}` : num(Math.abs(v));
    total += v * inner;
    s += i === 0 ? `${v < 0 ? "−" : ""}${body}` : `${v < 0 ? " − " : " + "}${body}`;
  });
  return `${s} = ${num(total)}`;
}

/** What one slip in bracket b looks like, and the fix, with these numbers. */
function slipText(mode: Mode, b: Br, L: string, single: boolean): string {
  const K = ts(b.k);
  const [a, c] = b.inner;
  const A = ts(a);
  const C = ts(c);
  const pa = mul(b.k, a);
  const pc = mul(b.k, c);
  const full = m(bracketLine(b));
  switch (mode) {
    case "firstOnly":
      return `You multiplied ${m(A)} by ${m(K)} but left the ${m(C)} alone. The ${m(K)} multiplies **every** term in the bracket: ${m(`${K} * ${C} = ${sg(pc)}`)}, so ${full}.`;
    case "secondOnly":
      return `You only multiplied the ${m(C)}. The ${m(K)} multiplies the ${m(A)} too: ${m(`${K} * ${A} = ${ts(pa)}`)}, so ${full}.`;
    case "signSecond":
      return c.c < 0
        ? `${m(`${K} * ${C}`)} is ${m(sg(pc))}, not ${m(sg(neg(pc)))} — a negative times a negative is positive. So ${full}.`
        : `The minus sign multiplies **both** terms in the bracket: ${m(`${K} * ${C} = ${sg(pc)}`)}, not ${m(sg(neg(pc)))}. So ${full}.`;
    case "signFirst":
      return `${m(`${K} * ${A}`)} is ${m(ts(pa))}, not ${m(sg(neg(pa)))} — a negative times a positive is negative. So ${full}.`;
    case "ignoreMinus":
      return single
        ? `You multiplied by ${m(ts(abs(b.k)))} instead of ${m(K)}. The minus sign belongs to the number in front of the bracket, so ${full}.`
        : `You added ${m(`${ts(abs(b.k))}(${P(b.inner)})`)} instead of subtracting it. The number in front of the bracket is ${m(K)}, so ${full}.`;
    case "addNotMultiply":
      return `You added ${m(`${K} + ${C}`)} instead of multiplying. The ${m(K)} multiplies the ${m(C)}: ${m(`${K} * ${C} = ${ts(pc)}`)}, so ${full}.`;
    case "noSquare":
      return `${m(`${K} * ${A}`)} is ${m(ts(pa))}, not ${m(ts(tm(pa.c, a.v)))} — multiplying two ${m(L)}'s gives ${m(`${L}^2`)}. So ${full}.`;
    default:
      return "";
  }
}

const exExpand: Generator = {
  id: "ex-expand",
  topic: "ex",
  section: "ex-expand",
  label: "Expand and simplify single brackets, and sums and differences of brackets",
  kinds: ["mcq", "qa"],
  make(r) {
    const tpl = r.pick(["one", "one", "sum", "diff", "diff", "mixed", "mixed", "letter"] as const);
    const L = r.pick(LETTERS);
    const X = (c: number) => tm(c, pw(L));
    const N = (c: number) => tm(c);
    let parts: Part[] = [];
    let answer: T[] = [];
    for (;;) {
      if (tpl === "one") parts = [{ k: N(nz(r, 2, 9, 0.4)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9))] }];
      else if (tpl === "sum")
        parts = [
          { k: N(r.int(2, 9)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9, 0.3))] },
          { k: N(r.int(2, 9)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9, 0.4))] },
        ];
      else if (tpl === "diff")
        parts = [
          { k: N(r.int(2, 9)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9, 0.3))] },
          { k: N(-r.int(2, 9)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9, 0.65))] },
        ];
      else if (tpl === "mixed") {
        // 8k − 3(2k − 4) + 7 · 4(5y − 3) + 3y · 6k + 5 + 3(3 − 4k)  (class examples)
        const v = r.int(1, 4);
        if (v <= 2) parts = [{ t: X(r.int(2, 12)) }, { k: N(-r.int(2, 6)), inner: [X(r.int(1, 5)), N(nz(r, 1, 9, 0.6))] }, { t: N(nz(r, 1, 12, 0.3)) }];
        else if (v === 3) parts = [{ k: N(r.int(2, 9)), inner: [X(r.int(1, 9)), N(nz(r, 1, 9))] }, { t: X(r.int(1, 9)) }];
        else parts = [{ t: X(r.int(2, 9)) }, { t: N(r.int(1, 9)) }, { k: N(r.int(2, 6)), inner: [N(r.int(1, 9)), X(-r.int(1, 5))] }];
      } else
        parts = [
          { k: X(r.int(1, 3)), inner: [X(r.int(1, 4)), N(nz(r, 1, 9))] },
          { k: N(nz(r, 2, 6, 0.7)), inner: [X(r.int(1, 5)), N(nz(r, 1, 9, 0.6))] },
        ];
      answer = expandAll(parts);
      // keep every kind of term in the answer (no x-term or number term cancelling out)
      if (answer.length === (tpl === "letter" ? 3 : 2) && answer.every((a) => Math.abs(a.c) <= 99)) break;
    }

    const brs = parts.filter(isBr);
    const q = exprOf(parts);
    const ans = P(answer);
    const single = parts.length === 1;
    const front = tpl === "letter" ? "term" : "number";
    let li = parts.length - 1;
    while (!isBr(parts[li])) li--;
    const lastBr = parts[li] as Br;
    const negBr = brs.find((b) => b.k.c < 0);

    // Which bracket goes wrong, and how — the classic slips first.
    const plan: (Record<number, Mode> | "combine")[] = [];
    const add = (i: number, mode: Mode) => plan.push({ [i]: mode });
    if (tpl === "letter") {
      if (lastBr.k.c < 0) add(1, "signSecond");
      add(0, "noSquare");
      add(0, "firstOnly");
      if (lastBr.k.c < 0) {
        add(1, "ignoreMinus");
        add(1, "signFirst");
      }
      add(1, "firstOnly");
    } else if (tpl === "sum") {
      add(1, "firstOnly");
      add(0, "firstOnly");
      plan.push({ 0: "firstOnly", 1: "firstOnly" });
      plan.push("combine");
      if (lastBr.inner[1].c > 0) add(1, "addNotMultiply");
    } else if (lastBr.k.c < 0) {
      add(li, "signSecond");
      if (single) add(li, "firstOnly");
      add(li, "ignoreMinus");
      if (!single) add(li, "firstOnly");
      add(li, "signFirst");
      plan.push("combine");
    } else {
      add(li, "firstOnly");
      if (deg(lastBr.inner[1].v) === 0 && lastBr.inner[1].c > 0) add(li, "addNotMultiply");
      plan.push("combine");
      add(li, "secondOnly");
    }
    const cands = plan.map((s): Wrong | null => {
      if (s === "combine") {
        if (tpl === "letter") return null;
        const [ax, a0] = answer;
        const merged = tm(ax.c + a0.c, ax.v);
        if (merged.c === 0) return null;
        return wrong(
          ts(merged),
          `${m(ts(ax))} and ${m(ts(a0))} are unlike terms — one has ${m(L)} in it and the other is just a number — so they can't be combined into ${m(ts(merged))}.`,
        );
      }
      const idx = Object.keys(s).map(Number);
      const fb =
        idx.length > 1
          ? `You only multiplied the first term in each bracket. Each number multiplies **every** term in its bracket: ${list(
              idx.map((i) => {
                const b = parts[i] as Br;
                return m(`${ts(b.k)} * ${ts(b.inner[1])} = ${ts(mul(b.k, b.inner[1]))}`);
              }),
            )}.`
          : slipText(s[idx[0]], parts[idx[0]] as Br, L, single);
      return wrong(P(expandAll(parts, s)), fb);
    });

    const x0 = [2, 3, 1, 4, 5].find((v) => brs.every((b) => valP(b.inner, { [L]: v }) !== 0)) ?? 2;
    const env: Env = { [L]: x0 };
    const check = `Quick check with ${L} = ${x0}: ${partsCheck(parts, env)}, and ${m(ans)} gives ${sumStr(answer.map((a) => valT(a, env)))} ✓`;
    const expanded = parts.flatMap((p) => expandPart(p));
    const groups = answer.map((a) => expanded.filter((x) => same(x.v, a.v)));
    const collectLine = list(groups.map((g) => (g.length > 1 ? m(`${P(g)} = ${ts(collect(g)[0])}`) : `${m(ts(g[0]))} stays as it is`)));
    const b0 = brs[0];
    const K = ts(b0.k);
    const each = `${m(`${K} * ${ts(b0.inner[0])} = ${ts(mul(b0.k, b0.inner[0]))}`)} and ${m(`${K} * ${ts(b0.inner[1])} = ${ts(mul(b0.k, b0.inner[1]))}`)}`;
    const difficulty: Difficulty =
      tpl === "one" ? (b0.k.c > 0 ? "warmup" : "core") : tpl === "letter" || (tpl === "diff" && answer[0].c < 0) ? "challenge" : "core";

    return {
      difficulty,
      question: single ? `Expand ${m(q)}.` : `Expand and simplify ${m(q)}.`,
      prompt: single ? "Multiply out the bracket." : "Multiply out the brackets and collect like terms.",
      answer: exprSpec(ans, single ? "expanded" : "simplified"),
      display: m(ans),
      correctFeedback: single
        ? `The ${m(K)} multiplies both terms in the bracket: ${each}.`
        : `${cap(list(brs.map((b) => m(bracketLine(b)))))}, and collecting like terms gives ${m(ans)}.`,
      wrong: distinct(ans, cands),
      explanation: single
        ? `Multiply **every** term inside the bracket by ${m(K)}: ${each}. So ${m(`${q} = ${ans}`)}. ${check}.`
        : `Multiply out each bracket — the ${front} in front, with its sign, multiplies **every** term inside: ${list(brs.map((b) => m(bracketLine(b))))}. Then collect like terms: ${m(`${P(expanded)} = ${ans}`)}. ${check}.`,
      solution: single
        ? [`Multiply each term inside the bracket by ${m(K)}: ${each}.`, `So ${m(`${q} = ${ans}`)}.`, `${check}.`]
        : [
            `Expand each bracket: ${list(brs.map((b) => m(bracketLine(b))))}.`,
            `Write out all the terms: ${m(P(expanded))}.`,
            `Collect like terms: ${collectLine}. So the answer is ${m(ans)}.`,
            `${check}.`,
          ],
      hints: single
        ? ["Multiply the number outside by **each** term inside the bracket.", `Work out ${m(`${K} * ${ts(b0.inner[0])}`)} and ${m(`${K} * ${ts(b0.inner[1])}`)}${b0.k.c < 0 ? " — watch the signs." : "."}`]
        : [
            `Expand each bracket on its own: the ${front} in front${negBr ? ", including its minus sign," : ""} multiplies **every** term inside.`,
            negBr
              ? `What is ${m(`${ts(negBr.k)} * ${ts(negBr.inner[1])}`)}? Then collect like terms.`
              : `Then collect the ${L}-terms and the number terms separately.`,
          ],
      verify: q,
      commonError: negBr
        ? `Forgetting that the minus sign multiplies every term in the bracket, e.g. writing ${m(`${ts(negBr.k)}(${P(negBr.inner)}) = ${P(expandPart(negBr, "signSecond"))}`)} instead of ${m(P(expandPart(negBr)))}.`
        : `Multiplying only the first term in a bracket, e.g. writing ${m(`${ts(lastBr.k)}(${P(lastBr.inner)}) = ${P(expandPart(lastBr, "firstOnly"))}`)} instead of ${m(P(expandPart(lastBr)))}.`,
      strategy: "Check by substituting",
      marks: difficulty === "warmup" ? 1 : tpl === "letter" ? 3 : 2,
      sig: canon(q, [L]),
    };
  },
};

// ---------------------------------------------------------------------------
// ex-factorise — factorise fully into a single bracket
// ---------------------------------------------------------------------------

const exFactorise: Generator = {
  id: "ex-factorise",
  topic: "ex",
  section: "ex-factorise",
  label: "Factorise fully into a single bracket",
  kinds: ["mcq", "qa"],
  make(r) {
    // num 12x − 18 · two 25y − 35z · letter w² − 5w · both 6x² + 9x · high 10x³ − 15x² · highab 8a² − 12ab
    const tpl = r.pick(["num", "num", "two", "letter", "both", "both", "high", "highab"] as const);
    const L = r.pick(LETTERS);
    const [A, B] = r.pick(PAIRS);
    const coprime = (a: number, b: number) => gcd(a, Math.abs(b)) === 1;
    let h = 1;
    let u = 1;
    let v = 1;
    let H: T = tm(1);
    let inner: T[] = [];
    let letters = [L];
    let numberFirst = false;
    if (tpl === "num") {
      do {
        h = r.int(2, 12);
        u = r.int(1, 9);
        v = nz(r, 1, 12, 0.45);
      } while (!coprime(u, v) || h * u > 72 || h * Math.abs(v) > 96);
      H = tm(h);
      numberFirst = r.chance(0.2); // 6 − 9x = 3(2 − 3x)
      inner = numberFirst ? [tm(Math.abs(v)), tm(-u, pw(L))] : [tm(u, pw(L)), tm(v)];
    } else if (tpl === "two") {
      do {
        h = r.int(2, 12);
        u = r.int(1, 9);
        v = nz(r, 1, 9, 0.45);
      } while (!coprime(u, v) || h * u > 72 || h * Math.abs(v) > 96);
      H = tm(h);
      inner = [tm(u, pw(A)), tm(v, pw(B))];
      letters = [A, B];
    } else if (tpl === "letter") {
      do {
        u = r.int(1, 5);
        v = nz(r, 1, 12, 0.5);
      } while (!coprime(u, v));
      H = tm(1, pw(L));
      inner = [tm(u, pw(L)), tm(v)];
    } else if (tpl === "both") {
      do {
        h = r.int(2, 8);
        u = r.int(1, 6);
        v = nz(r, 1, 9, 0.45);
      } while (!coprime(u, v));
      H = tm(h, pw(L));
      inner = [tm(u, pw(L)), tm(v)];
    } else if (tpl === "high") {
      do {
        h = r.int(2, 6);
        u = r.int(1, 5);
        v = nz(r, 1, 7, 0.5);
      } while (!coprime(u, v));
      H = tm(h, pw(L, 2));
      inner = [tm(u, pw(L)), tm(v)];
    } else {
      do {
        h = r.int(2, 6);
        u = r.int(1, 5);
        v = nz(r, 1, 7, 0.5);
      } while (!coprime(u, v));
      H = tm(h, pw(A));
      inner = [tm(u, pw(A)), tm(v, pw(B))];
      letters = [A, B];
    }

    const q = inner.map((x) => mul(H, x));
    const [q0, q1] = q;
    const [i0, i1] = inner;
    const qStr = P(q);
    const Hs = ts(H);
    const ans = `${Hs}(${P(inner)})`;
    const c0 = Math.abs(q0.c);
    const c1 = Math.abs(q1.c);
    const div = (x: T, y: T) => m(`${ts(x)} ÷ ${Hs} = ${ts(y)}`);
    /** A wrong factorisation H2(in2), with what it really expands to. */
    const fw = (H2: T, in2: T[], why: string) => {
      const s = `${ts(H2)}(${P(in2)})`;
      const e = collectKeep(in2.map((x) => mul(H2, x)));
      // a bracket like (b − b) is not a believable slip
      return e.length === 0 ? null : wrong(s, `${why} Expanding ${m(s)} gives ${m(P(e))}, not ${m(qStr)}.`);
    };
    const notDiv2 = fw(H, [i0, q1], `You divided ${m(ts(q0))} by ${m(Hs)} but not ${m(ts(q1))}. Divide **every** term: ${div(q1, i1)}.`);
    const notDiv1 = fw(H, [q0, i1], `You divided ${m(ts(q1))} by ${m(Hs)} but not ${m(ts(q0))}. Divide **every** term: ${div(q0, i0)}.`);
    const flip = fw(H, [i0, neg(i1)], `Check the sign: to get ${m(sg(q1))} the bracket needs ${m(sg(i1))}.`);

    let cands: (Wrong | null)[];
    if (tpl === "num") {
      const nt = deg(q0.v) ? q1 : q0;
      cands = [notDiv2, flip, notDiv1, fw(tm(h, pw(L)), inner, `${m(ts(nt))} has no ${m(L)} in it, so ${m(L)} can't come outside the bracket.`)];
    } else if (tpl === "two") {
      cands = [notDiv2, flip, fw(tm(h, pw(A)), [tm(u), i1], `${m(ts(q1))} has no ${m(A)} in it, so ${m(A)} can't be taken outside.`), notDiv1];
    } else if (tpl === "letter") {
      cands = [
        fw(H, [i0, q1], `You took ${m(L)} out of ${m(ts(q0))} but left it in ${m(ts(q1))}: ${div(q1, i1)}.`),
        flip,
        u === 1 && Math.abs(v) > 1
          ? fw(tm(Math.abs(v), pw(L)), [tm(1, pw(L)), tm(Math.sign(v))], `${m(ts(q0))} has no factor of ${Math.abs(v)}, so ${Math.abs(v)} can't come outside.`)
          : null,
        fw(H, [tm(u, pw(L, 2)), i1], `${m(`${ts(q0)} ÷ ${Hs}`)} is ${m(ts(i0))}, not ${m(ts(tm(u, pw(L, 2))))} — one ${m(L)} cancels.`),
      ];
    } else if (tpl === "both") {
      cands = [
        fw(H, [i0, tm(q1.c, i1.v)], `You divided ${m(ts(q1))} by ${m(L)} but not by ${h}: ${div(q1, i1)}.`),
        fw(H, [i0, tm(i1.c, q1.v)], `You divided ${m(ts(q1))} by ${h} but not by ${m(L)}: ${div(q1, i1)}.`),
        flip,
        fw(H, [tm(u, pw(L, 2)), i1], `${m(`${ts(q0)} ÷ ${Hs}`)} is ${m(ts(i0))}, not ${m(ts(tm(u, pw(L, 2))))} — the ${m(L)} cancels as well as the ${h}.`),
        fw(tm(h), inner, `You divided both terms by ${m(Hs)} but only wrote ${h} outside the bracket. The ${m(L)} you took out has to go outside too.`),
      ];
    } else if (tpl === "high") {
      const hx = tm(h, pw(L));
      cands = [
        fw(hx, [tm(u, pw(L, 2)), i1], `${m(`${ts(q1)} ÷ ${ts(hx)}`)} is ${m(ts(tm(v, pw(L))))}, not ${m(ts(i1))} — and ${m(ts(hx))} isn't the **highest** common factor: ${m(`${L}^2`)} goes into both terms.`),
        fw(H, [i0, tm(v, pw(L))], `${m(`${ts(q1)} ÷ ${Hs}`)} is ${m(ts(i1))}: the ${m(`${L}^2`)} cancels completely.`),
        fw(tm(h, pw(L, 3)), [tm(u), tm(v, pw(L))], `${m(`${L}^3`)} can't come out, because ${m(ts(q1))} only has ${m(`${L}^2`)}. Take out the highest power that goes into **every** term — the smaller power, ${m(`${L}^2`)}.`),
        flip,
      ];
    } else {
      cands = [
        fw(H, [i0, tm(v, { [A]: 1, [B]: 1 })], `You took ${m(Hs)} out of ${m(ts(q1))} but left the ${m(A)} behind: ${div(q1, i1)}.`),
        fw(tm(h, { [A]: 1, [B]: 1 }), [tm(u, pw(A)), tm(v)], `${m(ts(q0))} has no ${m(B)} in it, so ${m(B)} can't come outside.`),
        flip,
        fw(H, [i0, tm(h * v, pw(B))], `You divided ${m(ts(q1))} by ${m(A)} but not by ${h}: ${div(q1, i1)}.`),
      ];
    }

    const why =
      tpl === "num"
        ? `The HCF of ${c0} and ${c1} is ${h}, and the number term has no ${m(L)}, so only ${h} comes out.`
        : tpl === "two"
          ? `The HCF of ${c0} and ${c1} is ${h}. The terms have different letters (${m(A)} and ${m(B)}), so no letter comes out.`
          : tpl === "letter"
            ? `The numbers have no common factor bigger than 1, but both terms contain ${m(L)}, so the HCF is ${m(L)}.`
            : tpl === "both"
              ? `The HCF of ${c0} and ${c1} is ${h}, and both terms contain ${m(L)}, so the HCF is ${m(Hs)}.`
              : tpl === "high"
                ? `The HCF of ${c0} and ${c1} is ${h}. For the letters, ${m(`${L}^3`)} and ${m(`${L}^2`)} share ${m(`${L}^2`)} — the smaller power — so the HCF is ${m(Hs)}.`
                : `The HCF of ${c0} and ${c1} is ${h}. Both terms contain ${m(A)}, but only one contains ${m(B)}, so the HCF is ${m(Hs)}.`;
    const expandBack = `${m(`${Hs} * ${ts(i0)} = ${ts(q0)}`)} and ${m(`${Hs} * ${ts(i1)} = ${ts(q1)}`)}`;
    const smaller = [2, 3, 5, 7].find((f) => h % f === 0 && f < h);
    const partial = (f: T) => `${ts(f)}(${P(collectKeep(q.map((x) => tm(x.c / f.c, mulMono(x.v, Object.fromEntries(Object.entries(f.v).map(([k, p]) => [k, -p])))))))})`;
    const difficulty: Difficulty = tpl === "high" || tpl === "highab" ? "challenge" : tpl === "num" && !numberFirst && v > 0 && h <= 6 ? "warmup" : "core";

    return {
      difficulty,
      question: `Factorise ${m(qStr)} fully.`,
      prompt: "Give your answer fully factorised, and check it by expanding.",
      answer: exprSpec(ans, "factorised"),
      display: m(ans),
      correctFeedback: `The HCF of the terms is ${m(Hs)}: ${expandBack}. Nothing else divides both ${m(ts(i0))} and ${m(ts(i1))}, so it's fully factorised.`,
      wrong: distinct(ans, cands),
      explanation: `Find the highest common factor (HCF) of the numbers **and** the letters. ${why} Divide each term by ${m(Hs)}: ${div(q0, i0)} and ${div(q1, i1)}. So ${m(`${qStr} = ${ans}`)}. Check by expanding: ${expandBack} ✓.`,
      solution: [
        `Find the HCF. ${why}`,
        `Divide each term by ${m(Hs)}: ${div(q0, i0)} and ${div(q1, i1)}.`,
        `So ${m(`${qStr} = ${ans}`)}.`,
        `Check by expanding: ${expandBack} ✓. ${m(ts(i0))} and ${m(ts(i1))} have no common factor left, so it is fully factorised.`,
      ],
      hints:
        tpl === "letter"
          ? [
              "Which letter is in **both** terms? Is there also a number bigger than 1 that divides every term?",
              `Take ${m(L)} outside the bracket. What do you multiply ${m(L)} by to get ${m(ts(q0))}? And to get ${m(ts(q1))}?`,
            ]
          : [`What is the highest number that divides into both ${c0} and ${c1}? Is there a letter in **both** terms?`, "Put the HCF outside a bracket and divide each term by it. Then expand your answer to check."],
      verify: qStr,
      commonError:
        tpl === "both"
          ? `Not factorising fully — e.g. writing ${m(partial(tm(h)))} or ${m(partial(tm(1, pw(L))))}. If the terms in the bracket still share a factor, you haven't finished.`
          : tpl === "high"
            ? `Not taking out the highest power of ${m(L)} — e.g. writing ${m(partial(tm(h, pw(L))))} — or dividing a term wrongly.`
            : tpl === "num" && smaller
              ? `Taking out a common factor that isn't the highest — e.g. ${m(partial(tm(smaller)))} — or forgetting to divide every term.`
              : "Taking out a letter that isn't in every term, or forgetting to divide every term by the common factor.",
      strategy: "Spot the common factor",
      marks: difficulty === "warmup" ? 1 : 2,
      sig: canon(qStr, letters),
    };
  },
};

// ---------------------------------------------------------------------------
// ex-double — expand and simplify double brackets
// ---------------------------------------------------------------------------

const exDouble: Generator = {
  id: "ex-double",
  topic: "ex",
  section: "ex-double",
  label: "Expand and simplify double brackets, including squared brackets",
  kinds: ["mcq", "qa"],
  make(r) {
    // xx (x + a)(x + b) · px (px + a)(qx + b) · sq (x ± a)² · sq2 (px ± a)²
    const tpl = r.pick(["xx", "xx", "px", "px", "sq", "sq2"] as const);
    const area = r.chance(0.3);
    const L = area ? "x" : r.pick(["x", "x", "y", "n", "a", "p", "t"]);
    const X = (c: number) => tm(c, pw(L));
    const square = tpl === "sq" || tpl === "sq2";
    let b1: T[] = [];
    let b2: T[] = [];
    if (tpl === "xx") {
      let a = 0;
      let b = 0;
      do {
        a = nz(r, 1, 9, 0.4);
        b = nz(r, 1, 9, 0.4);
      } while (a + b === 0 || a === b);
      b1 = [X(1), tm(a)];
      b2 = [X(1), tm(b)];
    } else if (tpl === "px") {
      let p = 1;
      let q = 2;
      let a = 1;
      let b = 1;
      do {
        p = r.int(1, 5);
        q = r.int(2, 5);
        a = nz(r, 1, 7, 0.45);
        b = nz(r, 1, 7, 0.45);
      } while (p * b + q * a === 0 || (p === q && a === b) || p * q > 20);
      b1 = [X(p), tm(a)];
      b2 = [X(q), tm(b)];
    } else {
      const p = tpl === "sq2" ? r.int(2, 5) : 1;
      const a = tpl === "sq2" ? nz(r, 1, 7) : nz(r, 2, 9);
      b1 = [X(p), tm(a)];
      b2 = b1;
    }

    const [p, a] = [b1[0].c, b1[1].c];
    const [q, b] = [b2[0].c, b2[1].c];
    const X2 = pw(L, 2);
    const X1 = pw(L);
    const A2 = p * q;
    const A1 = p * b + a * q;
    const A0 = a * b;
    const outer = tm(p * b, X1);
    const innerT = tm(a * q, X1);
    const mk = (k2: number, k1: number, k0: number) => P([tm(k2, X2), tm(k1, X1), tm(k0)]);
    const T1 = (c: number) => ts(tm(c, X1));
    const ans = mk(A2, A1, A0);
    const qExpr = square ? `(${P(b1)})^2` : `(${P(b1)})(${P(b2)})`;
    const twice = `(${P(b1)})(${P(b1)})`;
    const anyNeg = a < 0 || b < 0;

    const cands: (Wrong | null)[] = [];
    if (!square) {
      cands.push(wrong(mk(A2, 0, A0), `You only multiplied first × first and last × last. The grid has four parts — the two middle ones, ${m(ts(outer))} and ${m(ts(innerT))}, make ${m(T1(A1))}.`));
      if (tpl === "px") {
        const cross = ([[b1[0], b2[1], outer], [b1[1], b2[0], innerT]] as [T, T, T][]).find(([, , t]) => t.c < 0);
        if (cross)
          cands.push(
            wrong(
              mk(A2, A1 - 2 * cross[2].c, A0),
              `${m(`${ts(cross[0])} * ${ts(cross[1])}`)} is ${m(ts(cross[2]))}, not ${m(sg(neg(cross[2])))}. The middle terms are ${m(P([outer, innerT]))}, which make ${m(T1(A1))}.`,
            ),
          );
      }
      if (anyNeg) {
        cands.push(
          wrong(
            mk(A2, A1, -A0),
            `${m(`${a} * ${b}`)} is ${m(sg(tm(A0)))}, not ${m(sg(tm(-A0)))} — ${a < 0 && b < 0 ? "a negative times a negative is positive" : "a positive times a negative is negative"}.`,
          ),
        );
        cands.push(wrong(mk(A2, -A1, A0), `The middle terms are ${m(ts(outer))} and ${m(ts(innerT))}, which make ${m(T1(A1))}, not ${m(T1(-A1))}.`));
      } else if (tpl === "xx") {
        cands.push(wrong(mk(1, A1, a + b), `The last part of the grid is ${m(`${a} * ${b} = ${A0}`)}, not ${m(`${a} + ${b} = ${a + b}`)} — every part of the grid is a multiplication.`));
        cands.push(
          wrong(
            mk(1, A0, a + b),
            `You mixed up the two numbers: the ${m(L)}-terms **add** (${m(`${ts(innerT)} + ${ts(outer)} = ${T1(A1)}`)}) and the number term **multiplies** (${m(`${a} * ${b} = ${A0}`)}).`,
          ),
        );
      }
      if (tpl === "px" && p + q !== p * q)
        cands.push(
          wrong(
            mk(p + q, A1, A0),
            `${m(`${ts(b1[0])} * ${ts(b2[0])}`)} is ${m(ts(tm(A2, X2)))}, not ${m(ts(tm(p + q, X2)))} — multiply the numbers (${m(`${p} * ${q} = ${A2}`)}) as well as the letters.`,
          ),
        );
      cands.push(wrong(mk(A2, innerT.c, A0), `You've only included one of the middle terms. The grid has **two** middle parts, ${m(ts(outer))} and ${m(ts(innerT))}, which make ${m(T1(A1))}.`));
    } else {
      const mid = tm(p * a, X1);
      cands.push(wrong(mk(p * p, 0, a * a), `This squares each term separately. ${m(qExpr)} means ${m(twice)}, which has two middle terms as well: ${m(ts(mid))} and ${m(ts(mid))}.`));
      if (a < 0) cands.push(wrong(mk(p * p, 2 * p * a, -a * a), `${m(`${a} * ${a}`)} is ${m(`+${a * a}`)}, not ${m(String(-a * a))} — a negative times a negative is positive.`));
      cands.push(wrong(mk(p * p, p * a, a * a), `There are **two** middle parts in the grid, ${m(ts(mid))} and ${m(ts(mid))}, so the middle term is ${m(T1(2 * p * a))}.`));
      if (p > 1) cands.push(wrong(mk(p, 2 * p * a, a * a), `${m(`${ts(b1[0])} * ${ts(b1[0])}`)} is ${m(ts(tm(p * p, X2)))}, not ${m(ts(tm(p, X2)))} — square the ${p} as well as the ${m(L)}.`));
      cands.push(wrong(mk(p * p, 2 * p * a, 2 * a), `The last part of the grid is ${m(`${a} * ${a} = ${a * a}`)}, not ${m(`2 * ${a} = ${2 * a}`)} — squaring means multiplying by itself, not doubling.`));
      cands.push(wrong(P([tm(2 * p, X1), tm(2 * a)]), `${m(qExpr)} means ${m(twice)}, not ${m(`2(${P(b1)})`)} — squaring isn't doubling.`));
      if (a < 0) cands.push(wrong(mk(p * p, 0, -a * a), `Squaring each term separately loses the two middle terms, and ${m(`${a} * ${a}`)} is ${m(`+${a * a}`)}, so ${m(`${qExpr} = ${ans}`)}.`));
    }

    const pairs: [T, T][] = [
      [b1[0], b2[0]],
      [b1[0], b2[1]],
      [b1[1], b2[0]],
      [b1[1], b2[1]],
    ];
    const cells = pairs.map(([f, g]) => mul(f, g));
    const cellText = list(pairs.map(([f, g], i) => m(`${ts(f)} * ${ts(g)} = ${ts(cells[i])}`)));
    const midLine = m(`${P([cells[1], cells[2]])} = ${T1(A1)}`);
    const cell = (x: T, signed: boolean) => m(signed ? sg(x) : ts(x));
    const grid = [
      `| × | ${cell(b2[0], false)} | ${cell(b2[1], true)} |`,
      `| ${cell(b1[0], false)} | ${cell(cells[0], false)} | ${cell(cells[1], true)} |`,
      `| ${cell(b1[1], true)} | ${cell(cells[2], true)} | ${cell(cells[3], true)} |`,
    ].join("\n");
    // a check value where no bracket is 0 (and, for an area, every side is positive)
    const x0 = (area ? [2, 3, 4, 5, 6, 8, 10] : [2, 3, 1, 4, 5]).find((v) => [b1, b2].every((s) => (area ? valP(s, { [L]: v }) > 0 : valP(s, { [L]: v }) !== 0))) ?? 10;
    const env: Env = { [L]: x0 };
    const v1 = valP(b1, env);
    const v2 = valP(b2, env);
    const check = `Quick check with ${L} = ${x0}: ${brk(v1)} × ${brk(v2)} = ${num(v1 * v2)}, and ${m(ans)} gives ${sumStr([A2 * x0 * x0, A1 * x0, A0])} ✓`;
    const intro = square ? `Write ${m(qExpr)} as ${m(twice)} — squaring means multiplying the bracket by itself.` : "";
    const side = (s: T[]) => m(`(${P(s)})`);
    const difficulty: Difficulty = tpl === "xx" ? (anyNeg ? "core" : "warmup") : tpl === "px" ? (a < 0 && b < 0 ? "challenge" : "core") : tpl === "sq" ? "core" : "challenge";

    return {
      difficulty,
      question: area
        ? square
          ? `A square has sides of length ${side(b1)} cm. Find an expression for its area, expanded and simplified.`
          : `A rectangle measures ${side(b1)} cm by ${side(b2)} cm. Find an expression for its area, expanded and simplified.`
        : `Expand and simplify ${m(qExpr)}.`,
      prompt: area ? "Give the area in cm², with no brackets and the like terms collected." : "Multiply out the brackets and collect like terms.",
      answer: exprSpec(ans, "simplified"),
      display: m(ans),
      correctFeedback: `The grid gives ${m(P(cells))}, and ${midLine}, so the answer is ${m(ans)}.`,
      wrong: distinct(ans, cands),
      explanation: `${intro ? `${intro} ` : ""}Use the grid: ${cellText}. Add the four parts: ${m(P(cells))}. Collect the like terms ${midLine} to get ${m(ans)}. ${check}.`,
      solution: [
        ...(intro ? [intro] : []),
        `Use the grid method:\n\n${grid}`,
        `Add the four parts: ${m(P(cells))}. Collect the like terms: ${midLine}.`,
        `So the answer is ${m(ans)}. ${check}.`,
      ],
      hints: square
        ? [intro, "Use a grid: there are four parts, including **two** middle terms."]
        : [
            `Draw a 2-by-2 grid with ${m(ts(b2[0]))} and ${m(sg(b2[1]))} along the top and ${m(ts(b1[0]))} and ${m(sg(b1[1]))} down the side.`,
            "Fill in all four boxes, keeping the signs, then collect the two middle terms — they are like terms.",
          ],
      verify: qExpr,
      commonError: square
        ? `Squaring each term separately — writing ${m(`${qExpr} = ${mk(p * p, 0, a * a)}`)} — and losing the two middle terms.`
        : "Forgetting the two middle terms (the grid has four parts), or getting the sign of a product wrong.",
      strategy: "Use the grid method",
      marks: difficulty === "challenge" ? 3 : 2,
      sig: square
        ? canon(qExpr, [L])
        : [P(b1), P(b2)]
            .map((s) => canon(s, [L]))
            .sort()
            .join("*"),
    };
  },
};

// ---------------------------------------------------------------------------
// ex-forming — form and simplify an expression: perimeters and missing angles
// ---------------------------------------------------------------------------

const Xx = (c: number) => tm(c, pw("x"));
/** A side or an angle px + a (a may be 0). */
const lin = (p: number, a: number) => [Xx(p), tm(a)].filter((t) => t.c !== 0);
/** A side in the text: "(3x+2)" in brackets, or a single term. */
const sideStr = (s: T[]) => (s.length > 1 ? m(`(${P(s)})`) : m(P(s)));
/** ASCII for adding/subtracting a side or an angle: bracketed when it has two terms. */
const brA = (s: T[]) => (s.length > 1 ? `(${P(s)})` : P(s));
const twice = (s: T[]) => s.map((t) => tm(2 * t.c, t.v));
/** Multiply out a product of two sums. */
const mulP = (a: T[], b: T[]) => collect(a.flatMap((x) => b.map((y) => mul(x, y))));
/** "8 × 5 + 2 = 42": a linear expression worked out at x = x0, in plain text. */
function evalLin(xs: T[], x0: number): string {
  const s = xs
    .map((t, i) => {
      const body = deg(t.v) ? (Math.abs(t.c) === 1 ? `${x0}` : `${Math.abs(t.c)} × ${x0}`) : `${Math.abs(t.c)}`;
      return i === 0 ? `${t.c < 0 ? "−" : ""}${body}` : `${t.c < 0 ? " − " : " + "}${body}`;
    })
    .join("");
  return `${s} = ${num(valP(xs, { x: x0 }))}`;
}

function formPerimeter(r: Rng, tpl: "rect" | "tri" | "iso" | "join"): Draft {
  const at = (s: T[], v: number) => valP(s, { x: v });
  let per: T[] = [];
  let x0 = 5;
  let question = "";
  let verify = "";
  let sig = "";
  let correctFeedback = "";
  let explanation = "";
  let solution: string[] = [];
  let hints: string[] = [];
  let commonError = "";
  let difficulty: Difficulty = "core";
  let cands: (Wrong | null)[] = [];
  let all: T[] = [];

  if (tpl === "rect") {
    let len: T[] = [];
    let wid: T[] = [];
    for (;;) {
      len = lin(r.int(2, 5), nz(r, 1, 9, 0.35));
      wid = r.chance(0.3) ? [tm(r.int(2, 9))] : lin(r.int(1, 3), nz(r, 1, 6, 0.35));
      per = collect([...len, ...len, ...wid, ...wid]);
      const ok = [5, 10].find((v) => at(len, v) > 0 && at(wid, v) > 0);
      if (per.length === 2 && ok && P(len) !== P(wid)) {
        x0 = ok;
        break;
      }
    }
    all = [...len, ...len, ...wid, ...wid];
    const one = [...len, ...wid];
    const consts = all.filter((t) => !deg(t.v)).map((t) => t.c);
    const doubled = P([...twice(len), ...twice(wid)]);
    const lv = at(len, x0);
    const wv = at(wid, x0);
    difficulty = wid.length === 1 ? "warmup" : "core";
    question = `A rectangle is ${sideStr(len)} cm long and ${sideStr(wid)} cm wide. Find an expression for its perimeter, in cm. Simplify it fully.`;
    verify = `2(${P(len)})+2(${P(wid)})`;
    sig = `rect:${P(len)}|${P(wid)}`;
    cands = [
      wrong(P(collect(one)), "That's only one length and one width. A rectangle has **four** sides — two lengths and two widths — so the perimeter is twice this."),
      wrong(P(collect(mulP(len, wid))), "That's the area (length × width). The perimeter is the distance all the way round, so add the four sides."),
      wrong(
        P(collect([...twice(one.filter((t) => deg(t.v))), ...one.filter((t) => !deg(t.v))])),
        `You doubled the x-terms but not the numbers. There are two lengths and two widths, so the numbers are ${sumStr(consts)}.`,
      ),
      wrong(P(collect([...len, ...len, ...wid])), "That's only three of the sides (two lengths and one width). A rectangle has four sides."),
    ];
    correctFeedback = `Two lengths and two widths: ${m(`2(${P(len)}) + 2(${P(wid)}) = ${P(per)}`)}.`;
    const check = `Check with x = ${x0}: the sides are ${num(lv)} cm and ${num(wv)} cm, so the perimeter is ${sumStr([lv, wv, lv, wv])} cm, and ${evalLin(per, x0)} ✓`;
    explanation = `The perimeter is the distance all the way round: two lengths and two widths. ${m(`2(${P(len)}) + 2(${P(wid)}) = ${doubled} = ${P(per)}`)}. ${check}.`;
    solution = [
      `Perimeter = two lengths + two widths = ${m(`2(${P(len)}) + 2(${P(wid)})`)}.`,
      `Multiply out the brackets: ${m(doubled)}.`,
      `Collect like terms: the perimeter is ${m(P(per))} cm.`,
      `${check}.`,
    ];
    hints = ["A rectangle has four sides: two lengths and two widths. The perimeter is all four added together.", "Double the length and double the width, then collect the x-terms and the number terms."];
    commonError = "Adding only one length and one width, or mixing up perimeter (add the sides) and area (multiply them).";
  } else if (tpl === "tri") {
    let sides: T[][] = [];
    for (;;) {
      const ps = [r.int(1, 4), r.int(1, 4), r.int(1, 4)];
      if (r.chance(0.5)) ps[r.int(0, 2)] = 1;
      const as = [nz(r, 1, 12, 0.3), nz(r, 1, 12, 0.3), r.chance(0.25) ? 0 : nz(r, 1, 12, 0.3)];
      if (!as.some((a) => a < 0)) as[r.int(0, 1)] *= -1;
      sides = r.shuffle(ps.map((p, i) => lin(p, as[i])));
      per = collect(sides.flat());
      const ok = [5, 10].find((v) => sides.every((s) => at(s, v) > 0));
      if (per.length === 2 && ok && new Set(sides.map(P)).size === 3) {
        x0 = ok;
        break;
      }
    }
    all = sides.flat();
    const xs = all.filter((t) => deg(t.v));
    const consts = all.filter((t) => !deg(t.v)).map((t) => t.c);
    const sumX = xs.reduce((s, t) => s + t.c, 0);
    const sumC = consts.reduce((s, c) => s + c, 0);
    const negC = consts.find((c) => c < 0) ?? 0;
    const vals = sides.map((s) => at(s, x0));
    question = `A triangle has sides of length ${list(sides.map(sideStr))} cm. Find an expression for its perimeter, in cm. Simplify it fully.`;
    verify = sides.map((s) => `(${P(s)})`).join("+");
    sig = `tri:${sides.map(P).sort().join("|")}`;
    cands = [
      negC ? wrong(P([Xx(sumX), tm(sumC - 2 * negC)]), `Careful with the ${m(String(negC))}: it is taken away, not added. The numbers are ${sumStr(consts)}.`) : null,
      sides.some((s) => s[0].c === 1) ? wrong(P([Xx(sumX - 1), tm(sumC)]), `${m("x")} on its own means one ${m("x")}, so the x-terms are ${m(`${P(xs)} = ${ts(Xx(sumX))}`)}.`) : null,
      wrong(ts(Xx(sumX)), `Don't lose the number terms: ${sumStr(consts)}, so the perimeter is ${m(P(per))}.`),
      wrong(P(collect([...sides[0], ...sides[1]])), "That's only two of the sides. The perimeter is the total of all **three** sides."),
    ];
    correctFeedback = `Add all three sides: ${m(`${sides.map(brA).join(" + ")} = ${P(per)}`)}.`;
    const check = `Check with x = ${x0}: the sides are ${list(vals.map((v) => `${num(v)} cm`))}, which add up to ${num(valP(per, { x: x0 }))} cm, and ${evalLin(per, x0)} ✓`;
    explanation = `The perimeter is the total of the three sides: ${m(sides.map(brA).join(" + "))}. Collect the x-terms, ${m(`${P(xs)} = ${ts(Xx(sumX))}`)}, and the numbers, ${sumStr(consts)}. So the perimeter is ${m(P(per))} cm. ${check}.`;
    solution = [
      `Add the three sides: ${m(sides.map(brA).join(" + "))}.`,
      `The x-terms: ${m(`${P(xs)} = ${ts(Xx(sumX))}`)}. The numbers: ${sumStr(consts)}.`,
      `So the perimeter is ${m(P(per))} cm.`,
      `${check}.`,
    ];
    hints = ["The perimeter is the total length of all three sides.", "Collect the x-terms and the numbers separately — watch the minus sign, and remember that x on its own means one x."];
    commonError = "Losing a minus sign, or forgetting that x on its own means one x.";
  } else if (tpl === "iso") {
    let e: T[] = [];
    let bs: T[] = [];
    for (;;) {
      e = lin(r.int(1, 4), nz(r, 1, 9, 0.3));
      bs = lin(r.int(1, 3), r.chance(0.3) ? 0 : nz(r, 1, 9, 0.4));
      per = collect([...e, ...e, ...bs]);
      const ok = [5, 10].find((v) => at(e, v) > 0 && at(bs, v) > 0);
      if (per.length === 2 && ok && P(e) !== P(bs)) {
        x0 = ok;
        break;
      }
    }
    all = [...e, ...e, ...bs];
    const consts = all.filter((t) => !deg(t.v)).map((t) => t.c);
    const ev = at(e, x0);
    const bv = at(bs, x0);
    question = `An isosceles triangle has two equal sides of length ${sideStr(e)} cm and a third side of length ${sideStr(bs)} cm. Find an expression for its perimeter, in cm. Simplify it fully.`;
    verify = `2(${P(e)})+${brA(bs)}`;
    sig = `iso:${P(e)}|${P(bs)}`;
    cands = [
      wrong(P(collect([...e, ...bs])), `An isosceles triangle has **two** equal sides, so ${sideStr(e)} must be counted twice.`),
      wrong(P(collect([...e, ...bs, ...bs])), `It's the two equal sides that are ${sideStr(e)} cm long; the third side is only counted once.`),
      e.length > 1 ? wrong(P(collect([tm(2 * e[0].c, e[0].v), e[1], ...bs])), `Two equal sides make ${m(`2(${P(e)}) = ${P(twice(e))}`)} — double the number as well as the x-term.`) : null,
      consts.some((c) => c < 0) ? wrong(P(collect([...all.filter((t) => deg(t.v)), tm(consts.reduce((s, c) => s + Math.abs(c), 0))])), `Careful with the minus sign: the numbers are ${sumStr(consts)}.`) : null,
    ];
    correctFeedback = `Two equal sides and the third side: ${m(`2(${P(e)}) + ${brA(bs)} = ${P(per)}`)}.`;
    const check = `Check with x = ${x0}: the sides are ${num(ev)} cm, ${num(ev)} cm and ${num(bv)} cm, which add up to ${num(2 * ev + bv)} cm, and ${evalLin(per, x0)} ✓`;
    explanation = `An isosceles triangle has two equal sides, so its perimeter is ${m(`2(${P(e)}) + ${brA(bs)}`)}. Multiply out and collect like terms: ${m(`${P([...twice(e), ...bs])} = ${P(per)}`)}. ${check}.`;
    solution = [
      `The two equal sides are both ${sideStr(e)} cm, so the perimeter is ${m(`2(${P(e)}) + ${brA(bs)}`)}.`,
      `Multiply out: ${m(P([...twice(e), ...bs]))}.`,
      `Collect like terms: the perimeter is ${m(P(per))} cm.`,
      `${check}.`,
    ];
    hints = ["How many sides of each length does an isosceles triangle have?", "Add two of the equal sides and the third side, then collect like terms."];
    commonError = "Counting the equal side only once — an isosceles triangle has two sides of that length.";
  } else {
    let len: T[] = [];
    let wid: T[] = [];
    let alongLen = true;
    for (;;) {
      len = lin(r.int(1, 4), r.int(1, 9));
      const w = r.int(1, 3);
      wid = r.pick([[tm(r.int(2, 9))], [Xx(w)], lin(w, r.int(1, 5))]);
      alongLen = r.chance(0.5);
      const J0 = alongLen ? len : wid;
      const O0 = alongLen ? wid : len;
      per = collect([...J0, ...J0, ...O0, ...O0, ...O0, ...O0]);
      if (per.length === 2 && P(len) !== P(wid)) break;
    }
    const J = alongLen ? len : wid;
    const O = alongLen ? wid : len;
    const O2 = twice(O);
    all = [...J, ...J, ...O2, ...O2];
    const jv = at(J, x0);
    const ov = at(O, x0);
    difficulty = "challenge";
    question = `Two identical rectangles each measure ${sideStr(len)} cm by ${sideStr(wid)} cm. They are joined along their ${sideStr(J)} cm sides to make one bigger rectangle. Find an expression for the perimeter of the bigger rectangle, in cm. Simplify it fully.`;
    verify = `2(${P(J)})+4(${P(O)})`;
    sig = `join:${P(J)}|${P(O)}`;
    cands = [
      wrong(P(collect([...J, ...J, ...J, ...J, ...O, ...O, ...O, ...O])), `That's the two perimeters added together. The joined ${sideStr(J)} cm sides are inside the bigger rectangle now, so they aren't part of its perimeter.`),
      wrong(P(collect([...J, ...J, ...J, ...O, ...O, ...O, ...O])), `You took off one joined side, but the join hides a side of **each** rectangle, so take ${m(`2(${P(J)})`)} off the two perimeters.`),
      wrong(P(collect([...J, ...J, ...O, ...O])), `That's the perimeter of one small rectangle. The bigger rectangle is ${sideStr(J)} cm by ${sideStr(O2)} cm.`),
      wrong(P(collect([...J, ...J, ...J, ...J, ...O, ...O])), `That's what you'd get by joining along the ${sideStr(O)} cm sides instead. Joining along the ${sideStr(J)} cm sides doubles the **other** side.`),
    ];
    correctFeedback = `The bigger rectangle is ${sideStr(J)} cm by ${sideStr(O2)} cm, so its perimeter is ${m(`2(${P(J)}) + 2(${P(O2)}) = ${P(per)}`)}.`;
    const check = `Check with x = ${x0}: the bigger rectangle is ${num(jv)} cm by ${num(2 * ov)} cm, so its perimeter is ${sumStr([jv, 2 * ov, jv, 2 * ov])} cm, and ${evalLin(per, x0)} ✓`;
    explanation = `Joining along the ${sideStr(J)} cm sides means those sides touch, so the bigger rectangle is ${sideStr(J)} cm by ${m(`2(${P(O)}) = ${P(O2)}`)} cm. Its perimeter is ${m(`2(${P(J)}) + 2(${P(O2)}) = ${P([...twice(J), ...twice(O2)])} = ${P(per)}`)}. The joined sides are inside the shape now, so they don't count. ${check}.`;
    solution = [
      `The ${sideStr(J)} cm sides touch, so the other sides line up: the bigger rectangle is ${sideStr(J)} cm by ${m(`2(${P(O)}) = ${P(O2)}`)} cm.`,
      `Perimeter = ${m(`2(${P(J)}) + 2(${P(O2)}) = ${P([...twice(J), ...twice(O2)])}`)}.`,
      `Collect like terms: ${m(P(per))} cm. (The joined sides are inside the shape, so they don't count.)`,
      `${check}.`,
    ];
    hints = ["Sketch the two rectangles joined together. What are the length and the width of the bigger rectangle?", "The joined sides end up inside the bigger rectangle, so they are not part of its perimeter."];
    commonError = "Adding the two perimeters — the joined sides are inside the new shape, so they don't count.";
  }

  const ans = P(per);
  const [ax, a0] = per;
  const merged = tm(ax.c + a0.c, ax.v);
  if (merged.c)
    cands.push(wrong(ts(merged), `${m(ts(ax))} and ${m(ts(a0))} are unlike terms — one has ${m("x")} in it and the other is just a number — so they can't be combined into ${m(ts(merged))}.`));
  return {
    difficulty,
    question,
    prompt: "Write your expression with no brackets and the like terms collected.",
    answer: exprSpec(ans, "simplified"),
    display: m(ans),
    correctFeedback,
    wrong: distinct(ans, cands),
    explanation,
    solution,
    hints,
    verify,
    commonError,
    strategy: "Draw a diagram",
    marks: difficulty === "challenge" ? 3 : 2,
    sig,
  };
}

function formAngle(r: Rng, tpl: "aTri" | "aLine" | "aPoint" | "aQuad" | "aIsoApex" | "aIsoBase"): Draft {
  const x0 = r.pick([10, 15, 20, 25, 30]);
  const at = (g: T[]) => valP(g, { x: x0 });
  /** An angle px + a whose size at x = x0 is between lo and hi degrees. */
  const pick = (lo: number, hi: number) => {
    for (;;) {
      const g = lin(r.int(1, 5), 5 * r.int(-6, 12));
      if (at(g) >= lo && at(g) <= hi) return g;
    }
  };
  const angStr = (g: T[]) => `${sideStr(g)}°`;
  const y = `${m("y")}°`;
  /** y = K − Px */
  const yOf = (K: number, Pc: number) => P([tm(K), Xx(-Pc)]);
  const findY = `Find an expression for ${m("y")} in terms of ${m("x")}. Simplify it fully.`;

  let question = "";
  let verify = "";
  let sig = "";
  let ans = "";
  let correctFeedback = "";
  let explanation = "";
  let solution: string[] = [];
  let hints: string[] = [];
  let commonError = "";
  let difficulty: Difficulty = "core";
  let cands: (Wrong | null)[] = [];

  if (tpl === "aIsoApex") {
    let p = 1;
    let a = 0;
    for (;;) {
      p = r.int(1, 3);
      a = 5 * r.int(-3, 8);
      const v = 2 * p * x0 + 2 * a;
      if (v >= 20 && v <= 140) break;
    }
    const A = lin(2 * p, 2 * a);
    const both = yOf(180 - 2 * a, 2 * p);
    const A0 = at(A);
    const y0 = (180 - A0) / 2;
    ans = yOf(90 - a, p);
    difficulty = "challenge";
    question = `In an isosceles triangle the two base angles are equal. The third angle is ${angStr(A)} and each base angle is ${y}. ${findY}`;
    verify = `(180-${brA(A)})/2`;
    sig = `isoApex:${P(A)}`;
    cands = [
      wrong(both, `That's the two base angles **together**. They are equal, so each one is half of it: ${m(`y = (${both})/2`)}.`),
      wrong(yOf(90 - 2 * a, 2 * p), `You halved the 180 but not the third angle. Halve **all** of ${m(both)}: ${m(`(${both})/2 = ${ans}`)}.`),
      a ? wrong(yOf(90 + a, p), `${m(`180 - ${brA(A)} = ${P([tm(180), ...A.map(neg)])}`)} — the minus sign changes the sign of **every** term in the bracket. Then halve.`) : null,
      wrong(yOf(180 - a, p), "The angles in a triangle add up to 180°, not 360°."),
    ];
    correctFeedback = `The two base angles together are ${m(`180 - ${brA(A)} = ${both}`)}, so each one is ${m(`(${both})/2 = ${ans}`)}.`;
    const check = `Check with x = ${x0}: the third angle is ${A0}° and each base angle is ${y0}°, and ${A0} + ${y0} + ${y0} = 180 ✓`;
    explanation = `The angles in a triangle add up to 180°. Taking away the third angle leaves the two base angles together: ${m(`180 - ${brA(A)} = ${both}`)}. The base angles are equal, so halve **every** term: ${m(`y = (${both})/2 = ${ans}`)}. ${check}.`;
    solution = [
      `The angles in a triangle add up to 180°, so the two base angles together are ${m(`180 - ${brA(A)} = ${both}`)}.`,
      `The base angles are equal, so halve it: ${m(`y = (${both})/2 = ${ans}`)}.`,
      `${check}.`,
    ];
    hints = ["What do the angles in a triangle add up to? The two base angles are equal.", `Take ${angStr(A)} away from 180°, then share what is left equally between the two base angles.`];
    commonError = "Forgetting to halve: 180° minus the third angle gives both base angles together.";
  } else if (tpl === "aIsoBase") {
    let B: T[] = [];
    for (;;) {
      B = lin(r.int(1, 4), 5 * r.int(-4, 10));
      if (at(B) >= 20 && at(B) <= 80) break;
    }
    const bx = B[0].c;
    const ba = B[1]?.c ?? 0;
    const B0 = at(B);
    const y0 = 180 - 2 * B0;
    const out = P([tm(180), ...B.map((t) => tm(-2 * t.c, t.v))]);
    ans = yOf(180 - 2 * ba, 2 * bx);
    difficulty = "challenge";
    question = `An isosceles triangle has two equal base angles of ${angStr(B)} each. Its third angle is ${y}. ${findY}`;
    verify = `180-2(${P(B)})`;
    sig = `isoBase:${P(B)}`;
    cands = [
      wrong(yOf(180 - ba, bx), `There are **two** base angles of ${angStr(B)}, so take both of them away: ${m(`y = 180 - 2(${P(B)})`)}.`),
      ba ? wrong(yOf(180 - ba, 2 * bx), `Both base angles include the ${m(String(ba))}: ${m(`2(${P(B)}) = ${P(twice(B))}`)}.`) : null,
      ba ? wrong(yOf(180 + 2 * ba, 2 * bx), `${m(`180 - 2(${P(B)}) = ${out}`)} — the minus sign changes the sign of **every** term in the bracket.`) : null,
      wrong(yOf(360 - 2 * ba, 2 * bx), "The angles in a triangle add up to 180°, not 360°."),
    ];
    correctFeedback = `Take both base angles away from 180°: ${m(`y = 180 - 2(${P(B)}) = ${ans}`)}.`;
    const check = `Check with x = ${x0}: the base angles are ${B0}° each and ${m("y")} = ${y0}°, and ${B0} + ${B0} + ${y0} = 180 ✓`;
    explanation = `The angles in a triangle add up to 180°, and there are two base angles of ${angStr(B)}. So ${m(`y = 180 - 2(${P(B)})`)}. Multiply out — the minus sign changes the sign of every term in the bracket: ${m(`y = ${out}`)}. Collect: ${m(`y = ${ans}`)}. ${check}.`;
    solution = [
      `The angles add up to 180° and the two base angles are equal, so ${m(`y = 180 - 2(${P(B)})`)}.`,
      `Multiply out the bracket: ${m(`y = ${out}`)}.`,
      `Collect like terms: ${m(`y = ${ans}`)}.`,
      `${check}.`,
    ];
    hints = ["What do the angles in a triangle add up to?", `There are two base angles of ${angStr(B)} — take both of them away from 180°.`];
    commonError = "Taking away only one base angle — an isosceles triangle has two equal base angles.";
  } else {
    const T0 = tpl === "aTri" || tpl === "aLine" ? 180 : 360;
    const T2 = T0 === 180 ? 360 : 180;
    const count = tpl === "aTri" ? 2 : tpl === "aLine" ? r.int(1, 2) : tpl === "aPoint" ? r.int(2, 3) : 3;
    const [lo, hi] = tpl === "aQuad" ? [40, 150] : tpl === "aPoint" ? [30, 170] : count === 1 ? [20, 160] : [20, 110];
    let G: T[][] = [];
    for (;;) {
      G = Array.from({ length: count }, () => pick(lo, hi));
      const y0 = T0 - G.reduce((s, g) => s + at(g), 0);
      if (y0 >= lo && y0 <= hi && new Set(G.map(P)).size === count) break;
    }
    const S = collect(G.flat());
    const Pc = S.find((t) => deg(t.v))?.c ?? 0;
    const sumA = S.find((t) => !deg(t.v))?.c ?? 0;
    ans = yOf(T0 - sumA, Pc);
    const fact = tpl === "aTri" ? "The angles in a triangle" : tpl === "aLine" ? "Angles on a straight line" : tpl === "aPoint" ? "Angles around a point" : "The angles in a quadrilateral";
    const minus = `${T0} - ${G.map(brA).join(" - ")}`;
    const opened = P([tm(T0), ...G.flat().map(neg)]);
    const vals = [...G.map(at), T0 - G.reduce((s, g) => s + at(g), 0)];
    difficulty = count === 1 ? "warmup" : "core";
    question =
      tpl === "aTri"
        ? `The angles of a triangle are ${list([...G.map(angStr), y])}. ${findY}`
        : tpl === "aLine"
          ? count === 1
            ? `Two angles sit next to each other on a straight line. One is ${angStr(G[0])} and the other is ${y}. ${findY}`
            : `Three angles sit next to each other on a straight line: ${list([...G.map(angStr), y])}. ${findY}`
          : tpl === "aPoint"
            ? `${count === 2 ? "Three" : "Four"} angles meet at a point: ${list([...G.map(angStr), y])}. ${findY}`
            : `Three angles of a quadrilateral are ${list(G.map(angStr))}. The fourth angle is ${y}. ${findY}`;
    verify = `${T0}-${G.map((g) => `(${P(g)})`).join("-")}`;
    sig = `${tpl}:${G.map(P).sort().join("|")}`;
    const g0 = G[0];
    cands = [
      sumA ? wrong(yOf(T0 + sumA, Pc), `Take away **all** of each angle: ${m(`${minus} = ${opened}`)}. The minus sign in front of a bracket changes the sign of **every** term inside it.`) : null,
      wrong(yOf(T2 - sumA, Pc), `${fact} add up to ${T0}°, not ${T2}°.`),
      count > 1 ? wrong(yOf(T0 - (g0[1]?.c ?? 0), g0[0].c), `You only took away ${angStr(g0)}. **Every** other angle comes off ${T0}° too: ${m(`y = ${minus}`)}.`) : null,
      wrong(P([Xx(Pc), tm(sumA - T0)]), `This is the wrong way round — it's the negative of the answer. ${m("y")} is what is **left** when you take the other angles away from ${T0}°.`),
    ];
    correctFeedback = `${fact} add up to ${T0}°, so ${m(`y = ${minus} = ${ans}`)}.`;
    const check = `Check with x = ${x0}: the angles are ${list(vals.map((v) => `${v}°`))}, which add up to ${T0}° ✓`;
    explanation = `${fact} add up to ${T0}°, so ${m(`y = ${minus}`)}. Take away **every** term in each bracket: ${m(`y = ${opened}`)}. Collect the numbers and the x-terms: ${m(`y = ${ans}`)}. ${check}.`;
    solution = [
      `${fact} add up to ${T0}°, so ${m(`y = ${minus}`)}.`,
      `Remove the brackets — each minus sign changes the sign of every term in its bracket: ${m(`y = ${opened}`)}.`,
      `Collect like terms: ${m(`y = ${ans}`)}.`,
      `${check}.`,
    ];
    hints = [`What do ${fact.charAt(0).toLowerCase()}${fact.slice(1)} add up to?`, `Write ${m(`y = ${minus}`)}, then remove the brackets carefully and collect like terms.`];
    const gb = G.find((g) => g.length > 1);
    commonError = gb
      ? `Taking away only the first term of a bracketed angle, e.g. writing ${m(`${T0} - (${P(gb)}) = ${P([tm(T0), neg(gb[0]), gb[1]])}`)} instead of ${m(P([tm(T0), neg(gb[0]), neg(gb[1])]))}.`
      : "Using the wrong angle fact: 180° for a triangle or a straight line, 360° around a point or in a quadrilateral.";
  }

  return {
    difficulty,
    question,
    prompt: `Give ${m("y")} in terms of ${m("x")}, simplified.`,
    answer: exprSpec(ans, "simplified"),
    display: m(ans),
    correctFeedback,
    wrong: distinct(ans, cands),
    explanation,
    solution,
    hints,
    verify,
    commonError,
    strategy: "Check by substituting",
    marks: difficulty === "warmup" ? 1 : difficulty === "challenge" ? 3 : 2,
    sig,
  };
}

const exForming: Generator = {
  id: "ex-forming",
  topic: "ex",
  section: "ex-forming",
  label: "Form and simplify an expression for a perimeter or a missing angle",
  kinds: ["mcq", "qa"],
  make(r) {
    const tpl = r.pick(["rect", "rect", "tri", "iso", "join", "aTri", "aTri", "aLine", "aPoint", "aQuad", "aIsoApex", "aIsoBase"] as const);
    if (tpl === "rect" || tpl === "tri" || tpl === "iso" || tpl === "join") return formPerimeter(r, tpl);
    return formAngle(r, tpl);
  },
};

export const GEN_EX: Generator[] = [exCollect, exMultiply, exExpand, exFactorise, exDouble, exForming];
