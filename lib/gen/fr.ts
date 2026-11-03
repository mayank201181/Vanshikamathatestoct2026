// Fresh-number generators — Fractions (Unit 1).
// fr-add is the reference example for every other generator: read it first.

import { cap, fr, fracSpec, frRaw, gcd, lcm, m, numSpec, pieceName, pieces, reduce, type Generator, type Rng, type Wrong } from "./core.ts";

export { pieces } from "./core.ts";

/** A random proper fraction n/d in lowest terms. */
function properFraction(r: { int(a: number, b: number): number }, d: number): number {
  let n = r.int(1, d - 1);
  while (gcd(n, d) !== 1) n = r.int(1, d - 1);
  return n;
}

// ---------------------------------------------------------------------------
// Shared helpers for the generators below
// ---------------------------------------------------------------------------

interface Person {
  name: string;
  he: string;
  his: string;
}
const she = (name: string): Person => ({ name, he: "she", his: "her" });
const he = (name: string): Person => ({ name, he: "he", his: "his" });
const PEOPLE: Person[] = [she("Asha"), he("Leo"), she("Mei"), he("Sam"), she("Priya"), he("Arjun"), she("Zara"), he("Omar"), she("Hana"), he("Ravi"), she("Wei Ling"), he("Jun")];

const same = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));

/** Wrong answers, keeping only those whose value differs from the answer and from every earlier one. */
function wrongSet(answer: number) {
  const seen = [answer];
  const list: Wrong[] = [];
  const add = (value: number, w: Wrong) => {
    if (!Number.isFinite(value) || value <= 0 || seen.some((v) => same(v, value))) return;
    seen.push(value);
    list.push(w);
  };
  return { list, add };
}

/** A wrong fraction answer shown reduced (as a careful pupil making that one slip would write it). */
function wrongFrac(n: number, d: number, feedback: string): Wrong {
  return { display: fr(n, d), spec: fracSpec(n, d, { simplest: false }), feedback };
}

/** A fraction or mixed number: w wholes and n/d (w = 0 for a proper fraction; n = 0 for a whole number). */
interface Num {
  w: number;
  n: number;
  d: number;
}
/** Top of the improper fraction. */
const topOf = (x: Num) => x.w * x.d + x.n;
const valOf = (x: Num) => topOf(x) / x.d;
/** ASCII for inside {{ }}: "2 1/4", "3/8" or "3". */
const plain = (x: Num) => (x.n === 0 ? `${x.w}` : x.w ? `${x.w} ${x.n}/${x.d}` : `${x.n}/${x.d}`);
/** For a verify expression: "(2+1/4)", "(3/8)", "3". */
const ver = (x: Num) => (x.n === 0 ? `${x.w}` : x.w ? `(${x.w}+${x.n}/${x.d})` : `(${x.n}/${x.d})`);
/** The improper fraction, ASCII: "9/4" (a whole number stays "3"). */
const imp = (x: Num) => (x.n === 0 ? `${x.w}` : `${topOf(x)}/${x.d}`);
const isMixed = (x: Num) => x.w > 0 && x.n > 0;
/** A Num from a reduced fraction value p/q. */
function numFrom(p: number, q: number): Num {
  const [a, b] = reduce(p, q);
  return { w: Math.floor(a / b), n: a % b, d: b };
}
/** "Change the mixed numbers into improper fractions: {{2 1/4 = 9/4}} and …" (empty when there are none). */
function convertText(xs: Num[]): string {
  const mixed = xs.filter(isMixed);
  if (!mixed.length) return "";
  const parts = mixed.map((x) => m(`${plain(x)} = ${imp(x)}`));
  return `Change the mixed number${mixed.length > 1 ? "s into improper fractions" : " into an improper fraction"} first: ${parts.join(" and ")} (${mixed.map((x) => `${x.w} × ${x.d} + ${x.n} = ${topOf(x)}`).join("; ")}). `;
}

/** Explain N1/D1 × N2/D2: multiply, simplify, and the quicker cancel-first route. */
function timesText(N1: number, D1: number, N2: number, D2: number): string {
  const P = N1 * N2;
  const Q = D1 * D2;
  const [rn, rd] = reduce(P, Q);
  const g1 = gcd(N1, D2);
  const g2 = gcd(N2, D1);
  const shares: string[] = [];
  if (g1 > 1) shares.push(`${N1} and ${D2} share ${g1}`);
  if (g2 > 1) shares.push(`${N2} and ${D1} share ${g2}`);
  const simp = rd !== Q ? `, which simplifies to ${fr(rn, rd, false)}` : "";
  const mixed = rn > rd && rd > 1 ? ` = ${fr(rn, rd)}` : "";
  const quick = shares.length ? ` Quicker: cancel first (${shares.join("; ")}) to get ${m(`${N1 / g1}/${D1 / g2} * ${N2 / g2}/${D2 / g1}`)} = ${fr(rn, rd)}.` : "";
  return `Multiply the tops and multiply the bottoms: ${m(`${N1}/${D1} * ${N2}/${D2} = ${P}/${Q}`)}${simp}${mixed}.${quick}`;
}

/** "Give your answer in its simplest form, as a mixed number." when the answer is bigger than 1. */
function formTail(n: number, d: number): string {
  const [a, b] = reduce(n, d);
  return a > b && b > 1 ? "Give your answer as a mixed number in its simplest form." : "Give your answer in its simplest form.";
}
/** Answer spec matching formTail. */
function fracAnswer(n: number, d: number) {
  const [a, b] = reduce(n, d);
  return fracSpec(a, b, { form: a > b && b > 1 ? "mixed" : "any" });
}

// ---------------------------------------------------------------------------
// fr-add — add or subtract two fractions with different denominators
// ---------------------------------------------------------------------------

const frAdd: Generator = {
  id: "fr-add",
  topic: "fr",
  section: "fr-addsub",
  label: "Add or subtract fractions with different denominators",
  kinds: ["mcq", "qa"],
  make(r) {
    // denominators: different, common denominator at most 40
    let b = 2, e = 2;
    while (b === e || lcm(b, e) > 40) {
      b = r.int(2, 10);
      e = r.int(2, 12);
    }
    const a = properFraction(r, b);
    const c = properFraction(r, e);
    const sub = r.chance(0.45) && a / b !== c / e;
    // for subtraction put the bigger fraction first
    const [n1, d1, n2, d2] = sub && a / b < c / e ? [c, e, a, b] : [a, b, c, e];
    const L = lcm(d1, d2);
    const A = (n1 * L) / d1;
    const C = (n2 * L) / d2;
    const resN = sub ? A - C : A + C;
    const [rn, rd] = reduce(resN, L);
    const op = sub ? "-" : "+";
    const opWord = sub ? "subtract" : "add";
    const q = m(`${n1}/${d1} ${op} ${n2}/${d2}`);

    const wrong: Wrong[] = [];
    // 1. add/subtract tops and bottoms
    if (!sub) {
      wrong.push({
        display: frRaw(n1 + n2, d1 + d2),
        spec: fracSpec(n1 + n2, d1 + d2, { simplest: false }),
        feedback: `This comes from adding the tops (${n1} + ${n2}) and adding the bottoms (${d1} + ${d2}). You can only add the numerators once the pieces are the same size — change both fractions to ${pieces(L)} first.`,
      });
    } else if (n1 - n2 > 0 && d1 - d2 > 0) {
      wrong.push({
        display: frRaw(n1 - n2, d1 - d2),
        spec: fracSpec(n1 - n2, d1 - d2, { simplest: false }),
        feedback: `This comes from subtracting the tops (${n1} − ${n2}) and subtracting the bottoms (${d1} − ${d2}). The denominators must be the same before you subtract the numerators — change both to ${pieces(L)} first.`,
      });
    }
    // 2. changed the denominators but not the numerators
    const naive = sub ? n1 - n2 : n1 + n2;
    if (naive > 0) {
      wrong.push({
        display: frRaw(naive, L),
        spec: fracSpec(naive, L, { simplest: false }),
        feedback: `You changed both denominators to ${L} but left the numerators as ${n1} and ${n2}. Scale each numerator by the same number as its denominator: ${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}.`,
      });
    }
    // 3. added the common denominators too
    wrong.push({
      display: frRaw(resN, 2 * L),
      spec: fracSpec(resN, 2 * L, { simplest: false }),
      feedback: `The ${A} and ${C} are right, but you ${sub ? "combined" : "added"} the denominators too (${L} + ${L}). Once the pieces are ${pieces(L)}, the answer is still in ${pieces(L)} — only the numerators change.`,
    });
    // 4. did the opposite operation
    const other = sub ? A + C : A - C;
    if (other > 0) {
      wrong.push({
        display: frRaw(other, L),
        spec: fracSpec(other, L, { simplest: false }),
        feedback: `That's what you get if you ${sub ? "add" : "subtract"}. Read the sign again: the question asks you to ${opWord}.`,
      });
    }

    const simplifyStep =
      rd !== L ? ` ${m(`${resN}/${L}`)} simplifies to ${fr(resN, L, false)} (divide top and bottom by ${L / rd}).` : "";
    const mixedStep = rn > rd ? ` As a mixed number that is ${fr(rn, rd)}.` : "";

    return {
      difficulty: L > 24 ? "core" : r.chance(0.5) ? "warmup" : "core",
      question: `Work out ${q}.`,
      prompt: `Work out ${q}. Give your answer in its simplest form.`,
      answer: fracSpec(rn, rd),
      display: fr(rn, rd),
      correctFeedback: `${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}, so the answer is ${m(`${resN}/${L}`)}${rd !== L || rn > rd ? ` = ${fr(rn, rd)}` : ""}.`,
      wrong,
      explanation: `${cap(pieces(d1))} and ${pieces(d2)} are different-sized pieces, so make them the same first. The lowest common multiple of ${d1} and ${d2} is ${L}: ${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}. Now ${opWord} the numerators only: ${m(`${A}/${L} ${op} ${C}/${L} = ${resN}/${L}`)}.${simplifyStep}${mixedStep}`,
      solution: [
        `The denominators are different, so find a common denominator. The LCM of ${d1} and ${d2} is ${L}.`,
        `${m(`${n1}/${d1} = ${A}/${L}`)} (× ${L / d1} top and bottom) and ${m(`${n2}/${d2} = ${C}/${L}`)} (× ${L / d2} top and bottom).`,
        `${m(`${A}/${L} ${op} ${C}/${L} = ${resN}/${L}`)}.${simplifyStep}${mixedStep}`,
      ],
      hints: [
        `Can you ${opWord} ${pieces(d1)} and ${pieces(d2)} straight away, or do the pieces need to be the same size first?`,
        `Both ${d1} and ${d2} go into ${L}. Write each fraction in ${pieces(L)}.`,
      ],
      verify: `${n1}/${d1}${op}${n2}/${d2}`,
      commonError: sub
        ? "Subtracting the tops and the bottoms separately, or forgetting to scale the numerators when changing the denominators."
        : "Adding the tops and adding the bottoms — the denominators must match before you add the numerators.",
      strategy: "Find a common denominator",
      // the same sum in either order is the same question
      sig: sub ? `${n1}/${d1}-${n2}/${d2}` : [`${n1}/${d1}`, `${n2}/${d2}`].sort().join("+"),
    };
  },
};

// ---------------------------------------------------------------------------
// fr-of — a fraction of an amount (or what is left), whole-number answers
// ---------------------------------------------------------------------------

interface OfContext {
  min: number;
  max: number;
  unit: "money" | "count" | "km" | "litres";
  setup: (p: Person, whole: string, f: string) => string;
  askPart: (p: Person) => string;
  askRest: (p: Person) => string;
  /** What the given fraction describes, e.g. "the number who walk". */
  part: (p: Person) => string;
  /** What is left, e.g. "the number who don't walk". */
  rest: (p: Person) => string;
}

const OF_CONTEXTS: OfContext[] = [
  {
    min: 60, max: 240, unit: "count",
    setup: (_p, A, f) => `There are ${A} students in Year 8. ${f} of them walk to school.`,
    askPart: () => "How many students walk to school?",
    askRest: () => "How many students do not walk to school?",
    part: () => "the number who walk",
    rest: () => "the number who don't walk",
  },
  {
    min: 24, max: 300, unit: "money",
    setup: (p, A, f) => `${p.name} has saved ${A}. ${cap(p.he)} spends ${f} of it on a new pair of trainers.`,
    askPart: (p) => `How much does ${p.he} spend?`,
    askRest: (p) => `How much does ${p.he} have left?`,
    part: (p) => `the amount ${p.he} spends`,
    rest: (p) => `the amount ${p.he} has left`,
  },
  {
    min: 12, max: 120, unit: "km",
    setup: (p, A, f) => `A cycle route is ${A} long. ${p.name} has cycled ${f} of it so far.`,
    askPart: (p) => `How far has ${p.he} cycled?`,
    askRest: (p) => `How far does ${p.he} still have to cycle?`,
    part: (p) => `the distance ${p.he} has cycled`,
    rest: () => "the distance still to go",
  },
  {
    min: 60, max: 360, unit: "count",
    setup: (_p, A, f) => `${A} people went to a concert. ${f} of them were children.`,
    askPart: () => "How many children went to the concert?",
    askRest: () => "How many adults went to the concert?",
    part: () => "the number of children",
    rest: () => "the number of adults",
  },
  {
    min: 24, max: 200, unit: "litres",
    setup: (_p, A, f) => `A water tank holds ${A} when it is full. At the moment it is ${f} full.`,
    askPart: () => "How many litres of water are in the tank?",
    askRest: () => "How many more litres of water are needed to fill the tank?",
    part: () => "the amount of water already in the tank",
    rest: () => "the amount still needed to fill it",
  },
  {
    min: 30, max: 240, unit: "money",
    setup: (_p, A, f) => `A coat costs ${A}. In a sale, the price is reduced by ${f}.`,
    askPart: () => "How much is taken off the price?",
    askRest: () => "What is the sale price of the coat?",
    part: () => "the amount taken off",
    rest: () => "the sale price",
  },
];

const frOf: Generator = {
  id: "fr-of",
  topic: "fr",
  section: "fr-muldiv",
  label: "Find a fraction of an amount (and what is left)",
  kinds: ["mcq", "qa"],
  make(r) {
    const ctx = r.pick(OF_CONTEXTS);
    const p = r.pick(PEOPLE);
    const rest = r.chance(0.4);
    // a/b with a ≥ 2 (a unit fraction makes the slips collapse); for "what is left", a ≤ b − 2 so the
    // part and the rest can't be confused with one piece
    // the whole is a multiple of a × b for "a/b of", so every classic slip (even upside down) gives a whole number
    let a = 2, b = 3, A = 6;
    for (;;) {
      b = r.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
      a = r.int(2, b - 1);
      if (gcd(a, b) !== 1 || (rest && a > b - 2)) continue;
      const unit = rest ? b : a * b;
      const jMin = Math.ceil(ctx.min / unit);
      const jMax = Math.floor(ctx.max / unit);
      if (jMax < jMin) continue;
      A = unit * r.int(jMin, jMax);
      break;
    }
    const k = A / b;
    const part = a * k;
    const left = A - part;
    const cur = r.chance(0.7) ? "£" : "$";
    const show = (x: number) =>
      ctx.unit === "money" ? `${cur}${x}` : ctx.unit === "km" ? `${x} km` : ctx.unit === "litres" ? `${x} litres` : `${x}`;
    const f = fr(a, b);
    const ans = rest ? left : part;
    const question = `${ctx.setup(p, show(A), f)} ${rest ? ctx.askRest(p) : ctx.askPart(p)}`;
    const one = fr(1, b);

    const W = wrongSet(ans);
    const wrongNum = (x: number, feedback: string) => W.add(x, { display: show(x), spec: numSpec(x), feedback });
    if (!rest) {
      wrongNum(k, `${show(k)} is only ${one} of ${show(A)}. You need ${a} of those ${pieces(b)}, so multiply by ${a}: ${a} × ${k} = ${part}.`);
      wrongNum(A * a, `${A * a} is ${A} × ${a}: you multiplied by the numerator but didn't divide by the denominator. Divide by ${b} first (${A} ÷ ${b} = ${k}), then multiply by ${a}.`);
      if (A % a === 0) wrongNum((A / a) * b, `${(A / a) * b} comes from dividing by ${a} and multiplying by ${b} — the fraction is upside down. ${f} of an amount must be less than the amount itself.`);
      wrongNum(left, `${show(left)} is ${ctx.rest(p)} — that's ${fr(b - a, b)} of ${show(A)}. The question asks for ${ctx.part(p)}, which is ${f} of it.`);
      if (A % a === 0) wrongNum(A / a, `${show(A / a)} is ${A} ÷ ${a}: you divided by the numerator. Divide by the denominator, ${b}, then multiply by the numerator, ${a}.`);
    } else {
      wrongNum(part, `${show(part)} is ${ctx.part(p)} (${f} of ${show(A)}). The question asks for ${ctx.rest(p)}: ${A} − ${part} = ${left}.`);
      wrongNum(A - k, `You took away just ${one} of ${show(A)} (${show(k)}). ${cap(ctx.part(p))} is ${f} of ${show(A)}, which is ${a} × ${k} = ${part}, so take away ${part}.`);
      wrongNum(k, `${show(k)} is only ${one} of ${show(A)}. Find ${ctx.part(p)} (${a} × ${k} = ${part}), then take that away from ${show(A)}.`);
      wrongNum(A - a, `You took away ${a}, the numerator, instead of ${f} of ${show(A)}. Work out ${f} of ${show(A)} first: ${A} ÷ ${b} × ${a} = ${part}.`);
    }

    const half = 2 * a < b ? "less" : "more";
    const explanation = rest
      ? `First find ${ctx.part(p)}: ${one} of ${show(A)} is ${A} ÷ ${b} = ${k}, so ${f} of it is ${a} × ${k} = ${part}. ${cap(ctx.rest(p))} is ${A} − ${part} = ${show(left)}. Quicker: ${ctx.rest(p)} is ${fr(b - a, b)} of ${show(A)}, and ${b - a} × ${k} = ${left} ✓`
      : `To find a fraction of an amount, **divide by the denominator, then multiply by the numerator**. ${cap(one)} of ${show(A)} is ${A} ÷ ${b} = ${k}, so ${f} of it is ${a} × ${k} = ${show(part)}. Sense check: ${f} is ${half} than a half, and ${part} is ${half} than half of ${A} ✓`;
    return {
      difficulty: rest ? "core" : A <= 120 ? "warmup" : "core",
      question,
      prompt: question,
      answer: numSpec(ans, show(ans)),
      display: show(ans),
      correctFeedback: rest
        ? `${f} of ${show(A)} is ${part}, and ${A} − ${part} = ${left}.`
        : `${A} ÷ ${b} = ${k} in each ${pieceName(b)}, and ${a} of them make ${a} × ${k} = ${part}.`,
      wrong: W.list,
      explanation,
      solution: rest
        ? [`${cap(one)} of ${show(A)} = ${A} ÷ ${b} = ${k}.`, `${f} of ${show(A)} = ${a} × ${k} = ${part}: that's ${ctx.part(p)}.`, `${cap(ctx.rest(p))}: ${A} − ${part} = ${show(left)}.`, `Check: ${fr(b - a, b)} of ${show(A)} = ${b - a} × ${k} = ${left} ✓`]
        : [`${cap(one)} of ${show(A)} = ${A} ÷ ${b} = ${k}.`, `${f} of ${show(A)} = ${a} × ${k} = ${show(part)}.`],
      hints: rest
        ? [`Start with ${one} of ${show(A)}.`, `Find ${ctx.part(p)} first, then take it away from ${show(A)} — or work out what fraction is left.`]
        : [`What is ${one} of ${show(A)}?`, `You know one ${pieceName(b)}. How many of them do you need?`],
      verify: rest ? `${A}-${a}/${b}*${A}` : `${a}/${b}*${A}`,
      commonError: rest
        ? `Stopping at ${part} — that is ${ctx.part(p)}, not ${ctx.rest(p)}.`
        : "Using the fraction upside down — divide by the denominator (bottom), then multiply by the numerator (top).",
      strategy: "Use a bar model",
      marks: rest || A > 120 ? 2 : 1,
      sig: `${rest ? "rest" : "of"}:${a}/${b}:${A}`,
    };
  },
};

// ---------------------------------------------------------------------------
// fr-mul — multiply fractions (cancelling; mixed numbers)
// ---------------------------------------------------------------------------

const frMul: Generator = {
  id: "fr-mul",
  topic: "fr",
  section: "fr-muldiv",
  label: "Multiply two fractions, including mixed numbers",
  kinds: ["mcq", "qa"],
  make(r) {
    const kind = r.pick(["pp", "pp", "mp", "mp", "mm"] as const);
    let x: Num = { w: 0, n: 1, d: 2 };
    let y: Num = { w: 0, n: 1, d: 2 };
    for (let tries = 0; tries < 500; tries++) {
      if (kind === "pp") {
        const d1 = r.int(2, 12);
        const d2 = r.int(2, 12);
        x = { w: 0, n: properFraction(r, d1), d: d1 };
        y = { w: 0, n: properFraction(r, d2), d: d2 };
      } else if (kind === "mp") {
        const d1 = r.int(2, 8);
        const d2 = r.int(3, 10);
        x = { w: r.int(1, 3), n: properFraction(r, d1), d: d1 };
        y = { w: 0, n: properFraction(r, d2), d: d2 };
      } else {
        const d1 = r.int(2, 6);
        const d2 = r.int(2, 6);
        x = { w: r.int(1, 3), n: properFraction(r, d1), d: d1 };
        y = { w: r.int(1, 2), n: properFraction(r, d2), d: d2 };
      }
      // something must cancel (that's the skill), and the answer must be friendly
      if (gcd(topOf(x), y.d) === 1 && gcd(topOf(y), x.d) === 1) continue;
      const [rn, rd] = reduce(topOf(x) * topOf(y), x.d * y.d);
      if (rd > 20 || rn / rd > 12 || (rn === 1 && rd === 1)) continue;
      if (kind === "pp" && x.n / x.d === y.n / y.d) continue;
      break;
    }
    const ctx = r.chance(0.3);
    // a rectangle's length comes first; otherwise either order
    if (ctx && kind !== "pp" ? valOf(x) < valOf(y) : kind === "mp" && r.chance(0.4)) [x, y] = [y, x];
    const N1 = topOf(x), D1 = x.d, N2 = topOf(y), D2 = y.d;
    const [rn, rd] = reduce(N1 * N2, D1 * D2);
    const R = rn / rd;
    const p = r.pick(PEOPLE);
    const calc = m(`${plain(x)} * ${plain(y)}`);
    let question = `Work out ${calc}.`;
    if (ctx && kind === "pp") {
      question = `${fr(x.n, x.d)} of a cake is left over after a party. ${p.name} eats ${fr(y.n, y.d)} of what is left. What fraction of the whole cake does ${p.he} eat?`;
    } else if (ctx) {
      question = `A rectangular vegetable patch is ${m(plain(x))} m long and ${m(plain(y))} m wide. Work out its area in m².`;
    }

    const W = wrongSet(R);
    // 1. flipped the second fraction, as if dividing
    W.add((N1 * D2) / (D1 * N2), wrongFrac(N1 * D2, D1 * N2, `${fr(N1 * D2, D1 * N2)} comes from flipping ${m(imp(y))} — that's what you do to divide. To multiply, multiply the tops and multiply the bottoms.`));
    if (kind === "mm") {
      // multiplied the whole numbers and the fractions separately
      W.add(x.w * y.w + (x.n * y.n) / (x.d * y.d), wrongFrac(x.w * y.w * x.d * y.d + x.n * y.n, x.d * y.d, `This multiplies the whole numbers (${x.w} × ${y.w}) and the fractions (${m(`${x.n}/${x.d} * ${y.n}/${y.d}`)}) separately. That misses parts of the product, such as ${x.w} × ${m(`${y.n}/${y.d}`)} — change both to improper fractions first.`));
    }
    if (kind === "mp") {
      // kept the whole number and multiplied only the fraction parts
      const mx = isMixed(x) ? x : y;
      const o = isMixed(x) ? y : x;
      W.add(mx.w + (mx.n * o.n) / (mx.d * o.d), wrongFrac(mx.w * mx.d * o.d + mx.n * o.n, mx.d * o.d, `You multiplied the fraction parts (${m(`${mx.n}/${mx.d} * ${o.n}/${o.d}`)}) and kept the ${mx.w} whole${mx.w > 1 ? "s" : ""} as ${mx.w > 1 ? "they were" : "it was"}. The whole${mx.w > 1 ? "s" : ""} must be multiplied too — change ${m(plain(mx))} into ${m(imp(mx))} first.`));
    }
    if (kind !== "pp") {
      // turned a mixed number into an improper fraction by adding the whole number to the top
      const bad = (z: Num) => (isMixed(z) ? (z.w + z.n) / z.d : valOf(z));
      const badTop = (z: Num) => (isMixed(z) ? z.w + z.n : topOf(z));
      const mixed = [x, y].filter(isMixed);
      const turned = mixed.map((z) => `${m(plain(z))} into ${m(`${z.w + z.n}/${z.d}`)}`).join(" and ");
      const right = mixed.map((z) => `${z.w} × ${z.d} + ${z.n} = ${topOf(z)}, so ${m(`${plain(z)} = ${imp(z)}`)}`).join("; ");
      W.add(bad(x) * bad(y), wrongFrac(badTop(x) * badTop(y), x.d * y.d, `You turned ${turned} by adding the whole number to the top. Multiply the whole number by the denominator, then add the numerator: ${right}.`));
    }
    // 2. cancelled a pair but divided only one of the two numbers
    const pairs: [number, number][] = [[N1, D2], [N2, D1]];
    const pair = pairs.find(([t, b]) => gcd(t, b) > 1);
    if (pair) {
      const [t, b] = pair;
      const g = gcd(t, b);
      W.add(R / g, wrongFrac(rn, rd * g, `You cancelled the ${t} on the top with the ${b} on the bottom (both divide by ${g}), but only divided the top number. Cancelling divides the top **and** the bottom by the same factor: ${t} → ${t / g} and ${b} → ${b / g}.`));
    }
    // 3. flipped the first fraction
    W.add((D1 * N2) / (N1 * D2), wrongFrac(D1 * N2, N1 * D2, `${fr(D1 * N2, N1 * D2)} comes from flipping ${m(imp(x))}. You only flip when you divide (and then it's the second fraction). To multiply, multiply the tops and multiply the bottoms.`));
    // 4. cancelled two numbers that are both on top
    const gt = gcd(N1, N2);
    if (gt > 1) W.add(R / (gt * gt), wrongFrac(N1 * N2, D1 * D2 * gt * gt, `You cancelled ${N1} with ${N2}, but they are both on the top. A number on the top can only cancel with a number on the bottom.`));
    // 5. used a common denominator as if adding
    const L = lcm(D1, D2);
    const A = (N1 * L) / D1, C = (N2 * L) / D2;
    W.add((A * C) / L, wrongFrac(A * C, L, `You changed both fractions to ${pieces(L)} and kept ${L} on the bottom. That's the rule for adding. To multiply, multiply the tops and multiply the bottoms — no common denominator needed.`));

    const tail = formTail(rn, rd);
    const convert = convertText([x, y]);
    const product = timesText(N1, D1, N2, D2);
    const area = ctx && kind !== "pp";
    return {
      difficulty: kind === "pp" ? (D1 * D2 <= 30 ? "warmup" : "core") : kind === "mm" && (N1 > 10 || N2 > 10) ? "challenge" : "core",
      question,
      prompt: `${question} ${tail}`,
      answer: fracAnswer(rn, rd),
      display: fr(rn, rd),
      correctFeedback: `${isMixed(x) || isMixed(y) ? `${m(`${plain(x)} * ${plain(y)} = ${imp(x)} * ${imp(y)}`)}, and ` : ""}${m(`${imp(x)} * ${imp(y)} = ${N1 * N2}/${D1 * D2}`)}${reduce(N1 * N2, D1 * D2)[1] !== D1 * D2 || R > 1 ? ` = ${fr(rn, rd)}` : ""}.`,
      wrong: W.list,
      explanation: `${area ? "Area = length × width, so work out " + calc + ". " : ctx ? `"Of" means ×, so work out ${calc}. ` : ""}${convert}${product}`,
      solution: [
        ...(area ? [`Area = length × width = ${calc}.`] : ctx ? [`${fr(y.n, y.d)} of ${fr(x.n, x.d)} means ${calc}.`] : []),
        ...(convert ? [convert.trim()] : []),
        product,
      ],
      hints: [
        isMixed(x) || isMixed(y) ? "Before you multiply, what must you do to a mixed number?" : "To multiply fractions, what do you do with the tops and with the bottoms?",
        `Can you cancel anything first? Look for a number on the top and a number on the bottom that share a factor.`,
      ],
      verify: `${ver(x)}*${ver(y)}`,
      commonError: isMixed(x) && isMixed(y)
        ? "Multiplying the whole numbers and the fractions separately — change mixed numbers to improper fractions first."
        : isMixed(x) || isMixed(y)
          ? "Leaving the whole number out of the multiplication — change the mixed number to an improper fraction first."
          : "Flipping a fraction when multiplying — flipping is only for dividing.",
      strategy: "Spot the common factor",
      marks: kind === "mm" ? 3 : 2,
      sig: [plain(x), plain(y)].sort().join("*"),
    };
  },
};

// ---------------------------------------------------------------------------
// fr-div — divide fractions and mixed numbers (keep, change, flip)
// ---------------------------------------------------------------------------

interface DivContext {
  unit: string;
  text: (p: Person, total: string, each: string) => string;
}
const DIV_CONTEXTS: DivContext[] = [
  { unit: "m", text: (p, T, E) => `${p.name} has a ribbon ${T} m long. ${cap(p.he)} cuts it into pieces that are each ${E} m long. How many pieces does ${p.he} get?` },
  { unit: "litres", text: (_p, T, E) => `A jug holds ${T} litres of lemonade. How many glasses holding ${E} of a litre each can be filled from the jug?` },
  { unit: "kg", text: (p, T, E) => `${p.name} has ${T} kg of rice. ${cap(p.he)} puts it into bags that each hold ${E} kg. How many bags does ${p.he} fill?` },
];

const frDiv: Generator = {
  id: "fr-div",
  topic: "fr",
  section: "fr-muldiv",
  label: "Divide fractions and mixed numbers (keep, change, flip)",
  kinds: ["mcq", "qa"],
  make(r) {
    const kind = r.pick(["pp", "pp", "mp", "wp", "mm", "mm", "ctx"] as const);
    let x: Num = { w: 0, n: 1, d: 2 };
    let y: Num = { w: 0, n: 1, d: 2 };
    for (let tries = 0; tries < 500; tries++) {
      if (kind === "pp") {
        const d1 = r.int(2, 12);
        const d2 = r.int(2, 12);
        x = { w: 0, n: properFraction(r, d1), d: d1 };
        y = { w: 0, n: properFraction(r, d2), d: d2 };
        if (x.n === 1 && y.n === 1) continue;
      } else if (kind === "mp") {
        const d1 = r.int(2, 8);
        const d2 = r.int(3, 10);
        x = { w: r.int(1, 5), n: properFraction(r, d1), d: d1 };
        y = { w: 0, n: properFraction(r, d2), d: d2 };
      } else if (kind === "wp") {
        const d2 = r.int(3, 10);
        x = { w: r.int(2, 9), n: 0, d: 1 };
        y = { w: 0, n: properFraction(r, d2), d: d2 };
        if (y.n === 1) continue;
      } else if (kind === "mm") {
        const d1 = r.int(2, 6);
        const d2 = r.int(2, 6);
        x = { w: r.int(1, 4), n: properFraction(r, d1), d: d1 };
        y = { w: r.int(1, 3), n: properFraction(r, d2), d: d2 };
      } else {
        // a whole number of pieces: total = k lots of the piece size
        const d2 = r.pick([3, 4, 5, 6, 8, 10]);
        y = { w: 0, n: properFraction(r, d2), d: d2 };
        const k = r.int(4, 16);
        x = numFrom(k * y.n, y.d);
        if (x.n === 0 || x.w === 0) continue;
      }
      const [rn, rd] = reduce(topOf(x) * y.d, x.d * topOf(y));
      if (rd > 20 || rn / rd > 20 || rn === rd) continue;
      if (kind !== "ctx" && kind !== "wp" && gcd(topOf(x), topOf(y)) === 1 && gcd(x.d, y.d) === 1) continue; // something should cancel
      break;
    }
    const N1 = topOf(x), D1 = x.d, N2 = topOf(y), D2 = y.d;
    const [rn, rd] = reduce(N1 * D2, D1 * N2);
    const R = rn / rd;
    const p = r.pick(PEOPLE);
    const calc = m(`${plain(x)} ÷ ${plain(y)}`);
    const c = kind === "ctx" ? r.pick(DIV_CONTEXTS) : null;
    const question = c ? c.text(p, m(plain(x)), m(plain(y))) : `Work out ${calc}.`;

    const W = wrongSet(R);
    // 1. multiplied without flipping
    W.add((N1 * N2) / (D1 * D2), wrongFrac(N1 * N2, D1 * D2, `${fr(N1 * N2, D1 * D2)} is ${m(`${imp(x)} * ${imp(y)}`)} — you multiplied without flipping. To divide by ${m(imp(y))}, multiply by ${m(`${D2}/${N2}`)}.`));
    if (kind === "wp") {
      W.add(N2 / (x.w * D2), wrongFrac(N2, x.w * D2, `${fr(N2, x.w * D2)} comes from flipping the ${x.w} (into ${m(`1/${x.w}`)}) instead of ${m(imp(y))}. Keep the first number and flip the one you are dividing by.`));
      W.add(x.w * D2, { display: `${x.w * D2}`, spec: numSpec(x.w * D2), feedback: `${x.w * D2} is the number of ${pieces(D2)} in ${x.w} wholes. Each ${m(imp(y))} uses ${N2} of those ${pieces(D2)}, so divide by ${N2} as well.` });
    }
    if (kind === "mm") {
      // divided the whole numbers and the fractions separately
      const v = x.w / y.w + (x.n * y.d) / (x.d * y.n);
      const [vn, vd] = reduce(x.w * x.d * y.n + x.n * y.d * y.w, y.w * x.d * y.n);
      W.add(v, wrongFrac(vn, vd, `This divides the whole numbers (${x.w} ÷ ${y.w}) and the fractions (${m(`${x.n}/${x.d} ÷ ${y.n}/${y.d}`)}) separately and adds them. Division doesn't split up like that — change both mixed numbers to improper fractions first.`));
    }
    if (isMixed(x)) {
      // added the whole number to the top
      W.add(((x.w + x.n) * D2) / (D1 * N2), wrongFrac((x.w + x.n) * D2, D1 * N2, `You turned ${m(plain(x))} into ${m(`${x.w + x.n}/${x.d}`)} by adding the whole number to the top. It's ${x.w} × ${x.d} + ${x.n} = ${N1}, so ${m(`${plain(x)} = ${imp(x)}`)}.`));
      // forgot the fraction part when converting
      W.add((x.w * D2) / N2, wrongFrac(x.w * D1 * D2, D1 * N2, `You used ${m(`${x.w * x.d}/${x.d}`)} for ${m(plain(x))} — that's only the ${x.w} whole${x.w > 1 ? "s" : ""}. Add the extra ${m(`${x.n}/${x.d}`)}: ${m(`${plain(x)} = ${imp(x)}`)}.`));
    }
    // 2. flipped the first fraction instead of the second (works out the division the wrong way round)
    W.add(1 / R, wrongFrac(rd, rn, `You flipped the first number instead of the second, which works out ${m(`${plain(y)} ÷ ${plain(x)}`)} — the wrong way round. Keep ${m(plain(x))}, change ÷ to ×, and flip ${m(imp(y))}.`));
    // 3. flipped both
    W.add((D1 * D2) / (N1 * N2), wrongFrac(D1 * D2, N1 * N2, `You flipped both fractions. Only the second one — the number you are dividing by — gets flipped.`));

    const flip = `${D2}/${N2}`;
    const convert = convertText([x, y]);
    const product = timesText(N1, D1, D2, N2);
    const sense =
      valOf(y) < 1
        ? `Sense check: dividing by a number less than 1 gives an answer bigger than ${m(plain(x))} ✓`
        : valOf(x) < valOf(y)
          ? `Sense check: ${m(plain(x))} is smaller than ${m(plain(y))}, so the answer must be less than 1 ✓`
          : `Check: ${m(`${plain(numFrom(rn, rd))} * ${plain(y)} = ${plain(x)}`)} ✓`;
    const tail = formTail(rn, rd);
    const ansDisplay = c && rd === 1 ? `${rn}` : fr(rn, rd);
    return {
      difficulty: kind === "mm" ? "challenge" : kind === "pp" && D1 * D2 <= 24 ? "warmup" : "core",
      question,
      prompt: c ? question : `${question} ${tail}`,
      answer: c ? numSpec(rn) : fracAnswer(rn, rd),
      display: ansDisplay,
      correctFeedback: `${[x, y].filter(isMixed).map((z) => m(`${plain(z)} = ${imp(z)}`)).join(" and ")}${convert ? ". " : ""}Keep, change, flip: ${m(`${imp(x)} * ${flip}`)} = ${fr(rn, rd)}.`,
      wrong: W.list,
      explanation: `${c ? `Work out how many lots of ${m(plain(y))} fit into ${m(plain(x))}: that's ${calc}. ` : ""}${convert}${convert ? "Then use" : "Use"} **keep, change, flip**: keep ${m(imp(x))}, change ÷ to ×, and flip ${m(imp(y))} into ${m(flip)}. ${product} ${sense}`,
      solution: [
        ...(c ? [`The number of pieces is ${calc}.`] : []),
        ...(convert ? [convert.trim()] : []),
        `Keep, change, flip: ${m(`${imp(x)} ÷ ${imp(y)} = ${imp(x)} * ${flip}`)}.`,
        product,
        sense,
      ],
      hints: [
        convert ? "Change any mixed numbers into improper fractions first." : "Dividing by a fraction is the same as multiplying by its reciprocal. Which number gets flipped?",
        `Keep ${m(imp(x))}, change ÷ to ×, and flip ${m(imp(y))} — then cancel and multiply.`,
      ],
      verify: `${ver(x)}/${ver(y)}`,
      commonError: isMixed(x) ? "Dividing without converting the mixed number to an improper fraction, or forgetting to flip the second fraction." : "Multiplying without flipping, or flipping the first fraction instead of the second.",
      strategy: "Estimate first",
      marks: kind === "mm" ? 3 : 2,
      sig: `${plain(x)}÷${plain(y)}`,
    };
  },
};

// ---------------------------------------------------------------------------
// fr-mixed-addsub — add or subtract mixed numbers (carrying / exchanging a whole)
// ---------------------------------------------------------------------------

/** "{{3 5/12}}"-style ASCII for a whole number w and a fraction n/d, unreduced (w = 0 → "5/12", n = 0 → "3"). */
const mixedText = (w: number, n: number, d: number) => (n === 0 ? `${w}` : w ? `${w} ${n}/${d}` : `${n}/${d}`);

const ADD_CONTEXTS: ((p: Person, a: string, b: string) => string)[] = [
  (p, a, b) => `${p.name} walks ${a} km to the library and then ${b} km to the park. How far does ${p.he} walk altogether?`,
  (p, a, b) => `${p.name} buys ${a} kg of apples and ${b} kg of pears. What is the total mass of the fruit, in kg?`,
  (p, a, b) => `${p.name} cycles ${a} km before lunch and ${b} km after lunch. How far does ${p.he} cycle altogether, in km?`,
];
const SUB_CONTEXTS: ((p: Person, a: string, b: string) => string)[] = [
  (p, a, b) => `A jug holds ${a} litres of lemonade. ${p.name} pours out ${b} litres. How many litres are left in the jug?`,
  (p, a, b) => `${p.name} has a ${a} m length of ribbon. ${cap(p.he)} cuts off ${b} m. How much ribbon is left, in metres?`,
  (p, a, b) => `${p.name} walks ${a} km on Saturday and ${b} km on Sunday. How much further does ${p.he} walk on Saturday, in km?`,
  (p, a, b) => `A bag holds ${a} kg of rice. ${p.name} uses ${b} kg. How much rice is left in the bag, in kg?`,
];

const frMixedAddSub: Generator = {
  id: "fr-mixed-addsub",
  topic: "fr",
  section: "fr-addsub",
  label: "Add or subtract mixed numbers (carrying or exchanging a whole)",
  kinds: ["mcq", "qa"],
  make(r) {
    const sub = r.chance(0.55);
    const twist = r.chance(sub ? 0.7 : 0.6); // sub: needs exchanging; add: fractions make more than 1
    let x: Num = { w: 2, n: 1, d: 2 };
    let y: Num = { w: 1, n: 1, d: 3 };
    for (let tries = 0; tries < 500; tries++) {
      const b = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
      const e = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
      if (b === e || lcm(b, e) > 24) continue;
      const a = properFraction(r, b);
      const c = properFraction(r, e);
      const L = lcm(b, e);
      const A = (a * L) / b, C = (c * L) / e;
      if (sub) {
        if (twist !== A < C) continue;
        const w1 = r.int(2, 7);
        x = { w: w1, n: a, d: b };
        y = { w: r.int(1, w1 - 1), n: c, d: e };
      } else {
        if (twist !== A + C > L || A + C === L) continue;
        x = { w: r.int(1, 5), n: a, d: b };
        y = { w: r.int(1, 4), n: c, d: e };
      }
      break;
    }
    const L = lcm(x.d, y.d);
    const A = (x.n * L) / x.d, C = (y.n * L) / y.d;
    const T = sub ? x.w * L + A - (y.w * L + C) : x.w * L + A + y.w * L + C; // answer = T/L
    const [rn, rd] = reduce(T, L);
    const op = sub ? "-" : "+";
    const calc = m(`${plain(x)} ${op} ${plain(y)}`);
    const p = r.pick(PEOPLE);
    const ctx = r.chance(0.5);
    const question = ctx ? r.pick(sub ? SUB_CONTEXTS : ADD_CONTEXTS)(p, m(plain(x)), m(plain(y))) : `Work out ${calc}.`;
    const inL = (z: Num) => (z.d === L ? "" : m(`${plain(z)} = ${z.w} ${(z.n * L) / z.d}/${L}`));
    const conv = [inL(x), inL(y)].filter(Boolean).join(" and ");
    const convText = conv ? `Write the fractions in ${pieces(L)} (the LCM of ${x.d} and ${y.d} is ${L}): ${conv}. ` : "";
    const scaled = [x, y].filter((z) => z.d !== L).map((z) => m(`${z.n}/${z.d} = ${(z.n * L) / z.d}/${L}`)).join(" and ");
    const raw = (w: number, n: number, d: number) => ({ display: frRaw(w * d + n, d), spec: fracSpec(w * d + n, d, { simplest: false }) });
    const finish = (n: number, d: number) => (reduce(n, d)[1] !== d ? ` = ${fr(rn, rd)}` : "");

    const W = wrongSet(T / L);
    let explanation: string;
    let solution: string[];
    let hints: string[];
    let commonError: string;
    if (!sub) {
      const S = x.w + y.w;
      const F = A + C;
      if (F > L) W.add(S + (F - L) / L, { ...raw(S, F - L, L), feedback: `${m(`${A}/${L} + ${C}/${L} = ${F}/${L}`)} is more than a whole: it's ${m(`1 ${F - L}/${L}`)}. You dropped that extra whole, so your total is 1 too small.` });
      W.add(S + (x.n + y.n) / (x.d + y.d), { ...raw(S, x.n + y.n, x.d + y.d), feedback: `This adds the tops (${x.n} + ${y.n}) and the bottoms (${x.d} + ${y.d}) of the fractions. Use a common denominator first: ${scaled}.` });
      W.add(S + (x.n + y.n) / L, { ...raw(S, x.n + y.n, L), feedback: `You changed the denominators to ${L} but kept the tops as ${x.n} and ${y.n}. Scale the top as well as the bottom: ${scaled}.` });
      W.add(S + F / (2 * L), { ...raw(S, F, 2 * L), feedback: `The ${A} and ${C} are right, but you added the denominators too (${L} + ${L}). The pieces are still ${pieces(L)}, so the denominator stays ${L}.` });
      W.add(S, { display: `{{${S}}}`, spec: numSpec(S), feedback: `${S} is just the whole numbers added. You still need to add the fractions: ${m(`${A}/${L} + ${C}/${L} = ${F}/${L}`)}.` });
      const fracPart = F > L ? `${m(`${A}/${L} + ${C}/${L} = ${F}/${L} = 1 ${F - L}/${L}`)}. That's another whole, so the total is ${S} + ${m(`1 ${F - L}/${L}`)} = ${m(mixedText(S + 1, F - L, L))}${finish(F - L, L)}.` : `${m(`${A}/${L} + ${C}/${L} = ${F}/${L}`)}, so the total is ${m(mixedText(S, F, L))}${finish(F, L)}.`;
      explanation = `Add the whole numbers and the fractions separately. Wholes: ${x.w} + ${y.w} = ${S}. ${convText}Fractions: ${fracPart} Check with improper fractions: ${m(`${imp(x)} + ${imp(y)} = ${topOf(x) * (L / x.d)}/${L} + ${topOf(y) * (L / y.d)}/${L} = ${T}/${L}`)} = ${fr(rn, rd)} ✓`;
      solution = [`Wholes: ${x.w} + ${y.w} = ${S}.`, `${convText}Fractions: ${fracPart}`, `Check: ${m(`${imp(x)} + ${imp(y)} = ${T}/${L}`)} = ${fr(rn, rd)} ✓`];
      hints = ["Add the whole numbers first, then the fractions.", `Write both fractions as ${pieces(L)}. Is their total more than 1?`];
      commonError = F > L ? "Forgetting the extra whole when the fractions add up to more than 1." : "Adding the tops and the bottoms of the fractions instead of using a common denominator.";
    } else if (A < C) {
      const D = x.w - y.w;
      W.add(D + (C - A) / L, { ...raw(D, C - A, L), feedback: `You did ${x.w} − ${y.w} = ${D} and then ${m(`${C}/${L} - ${A}/${L}`)}, the wrong way round, because ${m(`${x.n}/${x.d}`)} is smaller than ${m(`${y.n}/${y.d}`)}. You can't swap a subtraction round — exchange a whole instead.` });
      W.add(D + (L + A - C) / L, { ...raw(D, L + A - C, L), feedback: `You exchanged a whole to turn ${m(`${A}/${L}`)} into ${m(`${L + A}/${L}`)}, but didn't take that whole off the ${x.w}. It becomes ${x.w - 1}, so the whole numbers give ${x.w - 1} − ${y.w} = ${D - 1}.` });
      W.add(D - 1 + (C - A) / L, { ...raw(D - 1, C - A, L), feedback: `Wholes first gives ${x.w} − ${y.w} = ${D}, and then you must take away ${m(`${C - A}/${L}`)} more (the gap between the fractions). ${D} − ${m(`${C - A}/${L}`)} is ${m(mixedText(D - 1, L - C + A, L))}, not ${m(mixedText(D - 1, C - A, L))} — a whole is ${m(`${L}/${L}`)}, and ${L} − ${C - A} = ${L - C + A}.` });
      if (x.n > y.n && x.d > y.d) W.add(D + (x.n - y.n) / (x.d - y.d), { ...raw(D, x.n - y.n, x.d - y.d), feedback: `This subtracts the tops (${x.n} − ${y.n}) and the bottoms (${x.d} − ${y.d}). Use a common denominator, ${L}, first.` });
      W.add(x.w + y.w + (L + A - C) / L - 1, { ...raw(x.w + y.w - 1, L + A - C, L), feedback: `You added the whole numbers (${x.w} + ${y.w}). Both parts of ${m(plain(y))} have to be taken away.` });
      W.add(D, { display: `{{${D}}}`, spec: numSpec(D), feedback: `${D} is just ${x.w} − ${y.w}. You still have to deal with the fractions: exchange a whole so that you can take ${m(`${C}/${L}`)} away.` });
      const ex = m(`${x.w} ${A}/${L} = ${x.w - 1} ${L + A}/${L}`);
      explanation = `${convText}You can't take ${m(`${C}/${L}`)} away from ${m(`${A}/${L}`)}, so exchange 1 whole for ${m(`${L}/${L}`)}: ${ex}. Now subtract the wholes and the fractions: ${x.w - 1} − ${y.w} = ${D - 1} and ${m(`${L + A}/${L} - ${C}/${L} = ${L + A - C}/${L}`)}, so the answer is ${m(mixedText(D - 1, L + A - C, L))}${finish(L + A - C, L)}. Check with improper fractions: ${m(`${imp(x)} - ${imp(y)} = ${topOf(x) * (L / x.d)}/${L} - ${topOf(y) * (L / y.d)}/${L} = ${T}/${L}`)} = ${fr(rn, rd)} ✓`;
      solution = [
        `${convText}`.trim() || `Both fractions are already in ${pieces(L)}.`,
        `${m(`${A}/${L}`)} is smaller than ${m(`${C}/${L}`)}, so exchange a whole: ${ex}.`,
        `${m(`${x.w - 1} ${L + A}/${L} - ${y.w} ${C}/${L} = ${mixedText(D - 1, L + A - C, L)}`)}${finish(L + A - C, L)}.`,
        `Check: ${m(`${imp(x)} - ${imp(y)} = ${T}/${L}`)} = ${fr(rn, rd)} ✓`,
      ];
      hints = [`Write both fractions as ${pieces(L)}. Can you take ${m(`${C}/${L}`)} away from ${m(`${A}/${L}`)}?`, `If not, exchange 1 whole from the ${x.w} for ${m(`${L}/${L}`)}.`];
      commonError = "Taking the smaller fraction away from the bigger one (the wrong way round) instead of exchanging a whole.";
    } else {
      const D = x.w - y.w;
      if (x.n > y.n && x.d > y.d) W.add(D + (x.n - y.n) / (x.d - y.d), { ...raw(D, x.n - y.n, x.d - y.d), feedback: `This subtracts the tops (${x.n} − ${y.n}) and the bottoms (${x.d} − ${y.d}). Use a common denominator, ${L}, first.` });
      if (x.n > y.n) W.add(D + (x.n - y.n) / L, { ...raw(D, x.n - y.n, L), feedback: `You changed the denominators to ${L} but kept the tops as ${x.n} and ${y.n}. Scale the top as well as the bottom: ${scaled}.` });
      W.add(x.w + y.w + (A - C) / L, { ...raw(x.w + y.w, A - C, L), feedback: `You added the whole numbers (${x.w} + ${y.w}) instead of subtracting them.` });
      W.add(x.w + (A - C) / L, { ...raw(x.w, A - C, L), feedback: `You subtracted the fractions but forgot to take away the ${y.w} whole${y.w > 1 ? "s" : ""}.` });
      W.add(D + (A + C) / L, { ...raw(D, A + C, L), feedback: `You added the fractions instead of subtracting them: it should be ${m(`${A}/${L} - ${C}/${L}`)}.` });
      W.add(D + (A - C) / (2 * L), { ...raw(D, A - C, 2 * L), feedback: `The ${A} and ${C} are right, but the denominator should stay ${L} — the pieces are still ${pieces(L)}.` });
      explanation = `Subtract the whole numbers and the fractions separately. Wholes: ${x.w} − ${y.w} = ${D}. ${convText}Fractions: ${m(`${A}/${L} - ${C}/${L} = ${A - C}/${L}`)}, so the answer is ${m(mixedText(D, A - C, L))}${finish(A - C, L)}. Check by adding back: ${fr(rn, rd)} + ${m(plain(y))} = ${m(plain(x))} ✓`;
      solution = [`Wholes: ${x.w} − ${y.w} = ${D}.`, `${convText}Fractions: ${m(`${A}/${L} - ${C}/${L} = ${A - C}/${L}`)}.`, `Answer: ${m(mixedText(D, A - C, L))}${finish(A - C, L)}.`];
      hints = ["Subtract the whole numbers first, then the fractions.", `Write both fractions as ${pieces(L)} before you subtract.`];
      commonError = "Subtracting the tops and the bottoms of the fractions instead of using a common denominator.";
    }

    return {
      difficulty: !sub ? (A + C > L ? "core" : "warmup") : A < C ? (L > 12 ? "challenge" : "core") : "core",
      question,
      prompt: `${question} ${formTail(rn, rd)}`,
      answer: fracAnswer(rn, rd),
      display: fr(rn, rd),
      correctFeedback: `${m(`${imp(x)} ${op} ${imp(y)} = ${topOf(x) * (L / x.d)}/${L} ${op} ${topOf(y) * (L / y.d)}/${L} = ${T}/${L}`)}${rd !== L || rn > rd ? ` = ${fr(rn, rd)}` : ""}.`,
      wrong: W.list,
      explanation,
      solution,
      hints,
      verify: `${ver(x)}${op}${ver(y)}`,
      commonError,
      strategy: "Find a common denominator",
      marks: sub && A < C && L > 12 ? 3 : 2,
      sig: sub ? `${plain(x)}-${plain(y)}` : [plain(x), plain(y)].sort().join("+"),
    };
  },
};

// ---------------------------------------------------------------------------
// fr-left — "spends 1/3, then 1/4 of what is left": what fraction / how much is left?
// ---------------------------------------------------------------------------

const LEFT_FRACS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [3, 8]];
const BUYS: [string, string][] = [["book", "cinema ticket"], ["new game", "pizza"], ["sketchbook", "bus ticket"], ["jigsaw", "smoothie"]];

const frLeft: Generator = {
  id: "fr-left",
  topic: "fr",
  section: "fr-problems",
  label: "A fraction of what is left (what fraction / how much is left?)",
  kinds: ["mcq", "qa"],
  make(r) {
    const mode = r.pick(["frac", "frac", "money", "items"] as const);
    const p = r.pick(PEOPLE);
    const [buy1, buy2] = r.pick(BUYS);
    let [p1, p2] = r.pick(LEFT_FRACS);
    let [q1, q2] = r.pick(LEFT_FRACS);
    while (p1 === q1 && p2 === q2) [q1, q2] = r.pick(LEFT_FRACS);
    if (r.chance(0.5)) [p1, p2, q1, q2] = [q1, q2, p1, p2];
    const k1 = p2 - p1; // she keeps k1/p2, then k2/q2 of that
    const k2 = q2 - q1;
    const [an, ad] = reduce(k1 * k2, p2 * q2);
    const fp = fr(p1, p2), fq = fr(q1, q2), fk1 = fr(k1, p2), fk2 = fr(k2, q2);
    const cur = r.chance(0.7) ? "£" : "$";
    const amount = mode !== "frac";
    // the whole is a multiple of p2 × q2, so every step is a whole number
    const unit = p2 * q2;
    const lo = Math.ceil((mode === "items" ? 24 : 30) / unit);
    const hi = Math.max(lo, Math.floor((mode === "items" ? 120 : 240) / unit));
    const A = unit * r.int(lo, hi);
    const s1 = (A * p1) / p2, R = A - s1, s2 = (R * q1) / q2, left = R - s2;
    const show = (v: number) => (mode === "money" ? `${cur}${v}` : `${v}`);
    const others = PEOPLE.filter((z) => z.name !== p.name);
    const friend1 = r.pick(others);
    const friend2 = r.pick(others.filter((z) => z.name !== friend1.name));

    let question: string;
    if (mode === "frac") question = `${p.name} spends ${fp} of ${p.his} pocket money on a ${buy1}. Then ${p.he} spends ${fq} of the money ${p.he} has left on a ${buy2}. What fraction of ${p.his} pocket money does ${p.he} have left?`;
    else if (mode === "money") question = `${p.name} has ${show(A)}. ${cap(p.he)} spends ${fp} of it on a ${buy1}. Then ${p.he} spends ${fq} of what is left on a ${buy2}. How much money does ${p.he} have left?`;
    else question = `${p.name} has ${A} stickers. ${cap(p.he)} gives ${fp} of them to ${friend1.name}. Then ${p.he} gives ${fq} of the stickers ${p.he} has left to ${friend2.name}. How many stickers does ${p.name} have now?`;
    const thing1 = mode === "items" ? `giving stickers to ${friend1.name}` : `buying the ${buy1}`;
    const thing2 = mode === "items" ? `giving stickers to ${friend2.name}` : `buying the ${buy2}`;
    const howMuch = mode === "items" ? "how many are left" : "how much is left";

    const W = wrongSet(amount ? left : an / ad);
    if (!amount) {
      const add = (n: number, d: number, feedback: string) => W.add(n / d, wrongFrac(n, d, feedback));
      add(p2 * q2 - p1 * q2 - q1 * p2, p2 * q2, `${fr(p2 * q2 - p1 * q2 - q1 * p2, p2 * q2)} comes from taking ${fp} and ${fq} both off the whole amount. But the ${fq} is a fraction of what was **left** after buying the ${buy1}, not of all ${p.his} money.`);
      add(p2 * q2 - k1 * k2, p2 * q2, `${fr(p2 * q2 - k1 * k2, p2 * q2)} is the fraction ${p.he} spent altogether. The question asks what is left, so take it away from 1.`);
      add(k1 * q1, p2 * q2, `${fr(k1 * q1, p2 * q2)} is the fraction of ${p.his} money spent on the ${buy2} (${fq} of ${fk1}). The question asks what is left.`);
      add(p1 * q1, p2 * q2, `${fr(p1 * q1, p2 * q2)} is ${m(`${p1}/${p2} * ${q1}/${q2}`)}: you multiplied the fractions ${p.he} **spent**. Multiply the fractions ${p.he} **keeps** instead: ${fk1}, then ${fk2} of that.`);
      add(k1, p2, `${fk1} is what ${p.he} had left after buying the ${buy1}. ${cap(p.he)} then spends ${fq} of that, so less is left.`);
    } else {
      const wrongNum = (v: number, feedback: string) => W.add(v, { display: show(v), spec: numSpec(v), feedback });
      const both = A - s1 - (A * q1) / q2;
      wrongNum(both, `${show(both)} comes from taking ${fp} and ${fq} of the whole ${show(A)}. But the ${fq} is a fraction of what was left after ${thing1} (${show(R)}), not of ${show(A)}.`);
      wrongNum(R, `${show(R)} is what ${p.he} had after ${thing1}. ${cap(p.he)} then ${mode === "items" ? "gives away" : "spends"} ${fq} of that.`);
      wrongNum(s2, `${show(s2)} is ${mode === "items" ? `the number given to ${friend2.name}` : `what the ${buy2} cost`} (${fq} of ${show(R)}). The question asks ${howMuch}.`);
      wrongNum(A - left, `${show(A - left)} is how much ${p.he} ${mode === "items" ? "gave away" : "spent"} altogether. The question asks ${howMuch}: ${A} − ${A - left}.`);
      const pq = (A * p1 * q1) / (p2 * q2);
      wrongNum(A - pq, `${show(A - pq)} comes from multiplying the fractions ${p.he} ${mode === "items" ? "gave away" : "spent"} (${m(`${p1}/${p2} * ${q1}/${q2}`)}) and taking that off. Multiply the fractions ${p.he} **keeps** instead: ${fk1}, then ${fk2} of that.`);
      wrongNum(s1, `${show(s1)} is ${mode === "items" ? `the number given to ${friend1.name}` : `what the ${buy1} cost`} (${fp} of ${show(A)}). The question asks ${howMuch} at the end.`);
    }

    const M = p2 * q2;
    const m1 = (M * p1) / p2, mR = M - m1, m2 = (mR * q1) / q2;
    const fracSteps = `After ${thing1} ${p.he} has ${m(`1 - ${p1}/${p2} = ${k1}/${p2}`)} of ${mode === "items" ? "the stickers" : `${p.his} money`} left. ${cap(p.he)} then ${mode === "items" ? "gives away" : "spends"} ${fq} of **that**, so ${p.he} keeps ${fk2} of it. Fraction left: ${m(`${k1}/${p2} * ${k2}/${q2} = ${k1 * k2}/${p2 * q2}`)}${reduce(k1 * k2, p2 * q2)[1] !== p2 * q2 ? ` = ${fr(an, ad)}` : ""}.`;
    const explanation = amount
      ? `Work one step at a time. ${cap(fp)} of ${show(A)} is ${show(s1)}, so ${p.he} has ${A} − ${s1} = ${show(R)} left. ${cap(fq)} of ${show(R)} is ${show(s2)}, so ${p.he} has ${R} − ${s2} = ${show(left)} left. Check with fractions: ${p.he} keeps ${fk1} and then ${fk2} of that, which is ${fr(an, ad)} — and ${fr(an, ad)} of ${A} is ${left} ✓`
      : `${fracSteps} Check with £${M}: ${p.he} spends £${m1}, leaving £${mR}; then spends £${m2}, leaving £${mR - m2}, which is ${m(`${mR - m2}/${M}`)}${reduce(mR - m2, M)[1] !== M ? ` = ${fr(an, ad)}` : ""} of the £${M} ✓`;
    const solution = amount
      ? [`${cap(fp)} of ${show(A)} = ${A} ÷ ${p2}${p1 > 1 ? ` × ${p1}` : ""} = ${show(s1)}, leaving ${A} − ${s1} = ${show(R)}.`, `${cap(fq)} of ${show(R)} = ${R} ÷ ${q2}${q1 > 1 ? ` × ${q1}` : ""} = ${show(s2)}, leaving ${R} − ${s2} = ${show(left)}.`, `Check: ${fk1} × ${fk2} = ${fr(an, ad)}, and ${fr(an, ad)} of ${A} = ${left} ✓`]
      : [`After ${thing1}: ${m(`1 - ${p1}/${p2} = ${k1}/${p2}`)} is left.`, `${cap(p.he)} keeps ${fk2} of that: ${m(`${k1}/${p2} * ${k2}/${q2} = ${k1 * k2}/${p2 * q2}`)}${reduce(k1 * k2, p2 * q2)[1] !== p2 * q2 ? ` = ${fr(an, ad)}` : ""}.`, `Check with £${M}: £${M} → £${mR} → £${mR - m2}, which is ${m(`${mR - m2}/${M}`)}${reduce(mR - m2, M)[1] !== M ? ` = ${fr(an, ad)}` : ""} of the £${M} ✓`];

    return {
      difficulty: p1 > 1 && q1 > 1 ? "challenge" : "core",
      question,
      prompt: amount ? question : `${question} Give your answer in its simplest form.`,
      answer: amount ? numSpec(left, show(left)) : fracSpec(an, ad),
      display: amount ? show(left) : fr(an, ad),
      correctFeedback: amount
        ? `${A} − ${s1} = ${R} after ${thing1}, and ${R} − ${s2} = ${left} after ${thing2}.`
        : `${p.he === "she" ? "She" : "He"} keeps ${fk1}, then ${fk2} of that: ${m(`${k1}/${p2} * ${k2}/${q2}`)} = ${fr(an, ad)}.`,
      wrong: W.list,
      explanation,
      solution,
      hints: [
        `Draw a bar for all of it. What fraction is left after ${thing1}?`,
        `The ${fq} is a fraction of what is **left**, not of the whole. What fraction of the leftover does ${p.he} keep?`,
      ],
      verify: amount ? `${A}*(1-${p1}/${p2})*(1-${q1}/${q2})` : `(1-${p1}/${p2})*(1-${q1}/${q2})`,
      commonError: `Treating the ${fq} as a fraction of the whole amount instead of a fraction of what was left.`,
      strategy: "Use a bar model",
      marks: 3,
      sig: amount ? `amt:${p1}/${p2}:${q1}/${q2}:${A}` : `frac:${p1}/${p2}:${q1}/${q2}`,
    };
  },
};

export const GEN_FR: Generator[] = [frAdd, frOf, frMul, frDiv, frMixedAddSub, frLeft];
