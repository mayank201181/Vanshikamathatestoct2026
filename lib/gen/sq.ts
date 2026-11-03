// Fresh-number generators — Sequences (Unit 2). See fr.ts (fr-add) for the reference example.
// Methods follow the class notes: the nth term of an arithmetic sequence is (difference)n + (zeroth
// term); for a quadratic sequence, second difference ÷ 2 = coefficient of n², then subtract an² and
// find the linear rule of what is left. Every nth-term answer is checked with a "terms:" verify.

import { cap, exprSpec, m, num, numSpec, poly, tidy, type Draft, type Generator, type Rng, type Wrong } from "./core.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MINUS = "−";
const WORDS = ["zero", "one", "two", "three", "four", "five", "six"];

/** Terms as plain text: "17, 12, 7, −3". */
const seq = (xs: number[]) => xs.map(num).join(", ");

/** A number for an ASCII verify expression, bracketed when negative: −4 → "(-4)". */
const par = (x: number) => (x < 0 ? `(${x})` : String(x));

/** Plain-text subtraction with a negative second number bracketed: "4 − (−3)". */
const sub = (a: number, b: number) => `${num(a)} − ${b < 0 ? `(${num(b)})` : num(b)}`;

/** A number written after another term: 3 → "+ 3", −3 → "− 3". */
const signed = (x: number) => `${x < 0 ? MINUS : "+"} ${num(Math.abs(x))}`;

/** "s" unless there is exactly one. */
const plural = (n: number) => (n === 1 ? "" : "s");

/** "1 step", "3 steps". */
const steps = (n: number) => `${n} step${plural(n)}`;

/** 1 → "1st", 22 → "22nd", 13 → "13th". */
function ord(n: number): string {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** A whole number or a decimal with at most 2 places (recurring decimals make poor options). */
const nice = (x: number) => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;

/** Plain-text linear rule an + b, as the class writes it: "4n + 5", "37 − 5n", "n − 3", "−3n − 2". */
function lin(a: number, b: number): string {
  if (a === 0) return num(b);
  const coef = (x: number) => (x === 1 ? "" : String(x));
  if (a < 0 && b > 0) return `${b} − ${coef(-a)}n`;
  const nPart = `${a < 0 ? MINUS : ""}${coef(Math.abs(a))}n`;
  return b === 0 ? nPart : `${nPart} ${signed(b)}`;
}

/** The same rule as ASCII for {{ }} and answer specs: "4n+5", "37-5n". */
function linA(a: number, b: number): string {
  if (a < 0 && b > 0) return poly([[b, ""], [a, "n"]]);
  return poly([[a, "n"], [b, ""]]);
}

/** Plain-text substitution into an + b: "4 × 20 + 5", "37 − 5 × 3". */
function linAt(a: number, b: number, n: number): string {
  const an = Math.abs(a) === 1 ? `${n}` : `${Math.abs(a)} × ${n}`;
  if (a < 0 && b > 0) return `${b} − ${an}`;
  const first = `${a < 0 ? MINUS : ""}${an}`;
  return b === 0 ? first : `${first} ${signed(b)}`;
}

/** An nth-term rule an² + bn + c (a = 0 for a linear rule). */
interface Q {
  a: number;
  b: number;
  c: number;
}

const val = (q: Q, n: number) => q.a * n * n + q.b * n + q.c;

/** ASCII rule for {{ }} and specs: "2n^2-3n+1"; a negative n² with a positive constant goes last ("8-n^2"). */
function quadA(q: Q): string {
  if (q.a === 0) return linA(q.b, q.c);
  if (q.a < 0 && q.c > 0) return poly([[q.c, ""], [q.b, "n"], [q.a, "n^2"]]);
  return poly([[q.a, "n^2"], [q.b, "n"], [q.c, ""]]);
}

/** How a rule is shown as an option: quadratics as maths, linear rules as plain text (like the bank). */
const ruleText = (q: Q) => (q.a === 0 ? lin(q.b, q.c) : m(quadA(q)));

/** Plain-text value of each part of a quadratic at n, e.g. n² − 3n at 5 → "25 − 15". */
function quadAt(q: Q, n: number): string {
  const parts = q.a < 0 && q.c > 0 ? [q.c, q.b * n, q.a * n * n] : [q.a * n * n, q.b * n, q.c];
  const nz = parts.filter((x) => x !== 0);
  return nz.map((x, i) => (i === 0 ? num(x) : signed(x))).join(" ");
}

interface Cand {
  v: number;
  feedback: string;
}

/** Numeric wrong answers, each a different value from the answer and from the others. */
function numWrongs(ans: number, cs: Cand[]): Wrong[] {
  const seen = new Set([tidy(ans)]);
  const out: Wrong[] = [];
  for (const c of cs) {
    const v = tidy(c.v);
    if (!Number.isFinite(v) || seen.has(v)) continue;
    seen.add(v);
    out.push({ display: num(v), spec: numSpec(v), feedback: c.feedback });
  }
  return out;
}

interface RuleCand {
  q: Q;
  feedback: string;
}

/** nth-term wrong answers: different rules from the answer and from each other (never a constant). */
function ruleWrongs(ans: Q, cs: (RuleCand | null)[]): Wrong[] {
  const key = (q: Q) => `${q.a},${q.b},${q.c}`;
  const seen = new Set([key(ans)]);
  const out: Wrong[] = [];
  for (const c of cs) {
    if (!c || (c.q.a === 0 && c.q.b === 0)) continue;
    const k = key(c.q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ display: ruleText(c.q), spec: exprSpec(quadA(c.q)), feedback: c.feedback });
  }
  return out;
}

/** Wrong lists of terms (ordered), each different from the answer and from the others. */
function listWrongs(ans: number[], cs: { vs: number[]; feedback: string }[]): Wrong[] {
  const seen = new Set([ans.join(",")]);
  const out: Wrong[] = [];
  for (const c of cs) {
    const k = c.vs.join(",");
    if (seen.has(k) || c.vs.some((x) => !Number.isFinite(x))) continue;
    seen.add(k);
    out.push({ display: seq(c.vs), spec: { type: "list", values: c.vs, ordered: true }, feedback: c.feedback });
  }
  return out;
}

// ---------------------------------------------------------------------------
// sq-next — the next term, or a missing term, of an arithmetic sequence
// ---------------------------------------------------------------------------

/** The next term of an arithmetic sequence that crosses zero or is already negative. */
function nextTerm(r: Rng): Draft {
  const up = r.chance(0.4);
  const e = r.int(2, 9);
  const d = up ? e : -e;
  let t1: number;
  if (up) t1 = r.int(1, e - 1) - 4 * e; // the answer is 1 … e − 1, so the 4th term is still negative
  else {
    do t1 = r.int(1 - 4 * e, -1) + 4 * e; // positive first term, negative answer
    while (t1 + 3 * d === 0); // the 4th term is not 0
  }
  const t = [0, 1, 2, 3].map((i) => t1 + i * d);
  const [, t2, t3, t4] = t;
  const ans = t4 + d;
  const op = up ? "+" : MINUS;

  const cands: Cand[] = [];
  const twoJumps: Cand = {
    v: t4 + 2 * d,
    feedback: `That's two jumps on from ${num(t4)}. The next term is just one jump of ${e}: ${num(t4)} ${op} ${e} = ${num(ans)}.`,
  };
  if (up) {
    const below = -t4;
    cands.push({
      v: -ans,
      feedback: `Check the sign. From ${num(t4)}, it takes ${steps(below)} up to reach 0 and ${ans} more to reach ${ans}. So ${num(t4)} + ${e} = ${ans}, not ${num(-ans)}.`,
    });
    cands.push({
      v: below + e,
      feedback: `You ignored the minus sign on ${num(t4)} and worked out ${below} + ${e} = ${below + e}. Start at ${num(t4)} and count up ${e}: ${num(t4)} + ${e} = ${ans}.`,
    });
    cands.push({
      v: t3,
      feedback: `The terms go up by ${e}, so add ${e}. Subtracting ${e} takes you back to ${num(t3)}, the term before.`,
    });
  } else if (t4 > 0) {
    cands.push({
      v: -ans,
      feedback: `Check the sign. Going down ${e} from ${t4}, it takes ${steps(t4)} to reach 0 and ${-ans} more to go below zero: ${t4} − ${e} = ${num(ans)}, not ${-ans}.`,
    });
    cands.push({
      v: t3,
      feedback: `The terms go down by ${e}, so subtract ${e}. Adding ${e} takes you back to ${t3}, the term before.`,
    });
    cands.push({
      v: -t3,
      feedback: `${t4} − ${e} isn't ${num(-t3)} — that would be ${num(-t4)} − ${e}. Count down from ${t4}: it takes ${steps(t4)} to reach 0, then ${-ans} more to reach ${num(ans)}.`,
    });
  } else {
    const below = -t4;
    cands.push({
      v: -ans,
      feedback: `Check the sign: ${num(t4)} is already below zero and the sequence keeps going down, so the next term is ${num(ans)}, not ${-ans}.`,
    });
    cands.push({
      v: t3,
      feedback: `The terms go down by ${e}, so subtract ${e}. Adding ${e} takes you back to ${num(t3)}, the term before.`,
    });
    if (e > below) {
      cands.push({
        v: -(e - below),
        feedback: `You worked out ${e} − ${below} = ${e - below} and made it negative. But ${num(t4)} − ${e} means going ${e} further down from ${num(t4)}, which takes you further below zero: ${num(ans)}.`,
      });
    }
  }
  cands.push(twoJumps);

  const crossing = t4 < 0 !== ans < 0;
  const numberLine = crossing
    ? ` On a number line, it takes ${steps(Math.abs(t4))} to get from ${num(t4)} to 0, and ${Math.abs(ans)} more to reach ${num(ans)}.`
    : ` ${num(t4)} is already below zero, so going down ${e} more makes it more negative.`;

  return {
    difficulty: !up && t4 > 0 ? "warmup" : "core",
    question: `Here are the first four terms of an arithmetic sequence:\n\n${seq(t)}, …\n\nWhat is the next term?`,
    answer: numSpec(ans),
    display: num(ans),
    correctFeedback: `The terms go ${up ? "up" : "down"} by ${e} each time, so the next term is ${num(t4)} ${op} ${e} = ${num(ans)}.`,
    wrong: numWrongs(ans, cands),
    explanation: `The difference between neighbouring terms is ${sub(t2, t1)} = ${num(d)}, so the term-to-term rule is '${up ? "add" : "subtract"} ${e}'. The next term is ${num(t4)} ${op} ${e} = ${num(ans)}.${numberLine} Check: ${num(ans)} ${up ? MINUS : "+"} ${e} = ${num(t4)} ✓`,
    solution: [
      `The difference is ${sub(t2, t1)} = ${num(d)}, so the term-to-term rule is '${up ? "add" : "subtract"} ${e}'.`,
      `Next term: ${num(t4)} ${op} ${e} = ${num(ans)}.${numberLine}`,
      `Check: ${num(ans)} ${up ? MINUS : "+"} ${e} = ${num(t4)} ✓`,
    ],
    hints: [
      "Work out the difference between neighbouring terms. Is the sequence going up or down?",
      `Do the same to the last term, ${num(t4)}. Picture a number line to get the sign right.`,
    ],
    verify: `${par(t4)}+(${par(t4)}-${par(t3)})`,
    commonError: "Getting the sign wrong when the sequence goes below zero — count the steps on a number line.",
    strategy: "Look at the differences",
    marks: 1,
    sig: `next:${t1},${d}`,
  };
}

/** A missing term when the two known terms are not next to each other: 6, __, __, __, 18. */
function gapTerm(r: Rng): Draft {
  for (let tries = 0; ; tries++) {
    const k = r.pick([4, 5, 5, 6]);
    const down = r.chance(0.4);
    const e = r.int(2, 9);
    const d = down ? -e : e;
    const t1 = down ? r.int(-5, 60) : r.int(-12, 30);
    if (t1 === 0) continue;
    const j = r.int(2, k - 1);
    const t = Array.from({ length: k }, (_, i) => t1 + i * d);
    const tk = t[k - 1];
    const ans = t[j - 1];
    const C = tk - t1;
    const jumpCalc = j === 2 ? `${num(t1)} ${signed(d)}` : `${num(t1)} ${down ? MINUS : "+"} ${j - 1} × ${e}`;

    const cands: Cand[] = [];
    const add = (v: number, feedback: string) => {
      // a slip that lands on a number already shown is not a believable option
      if (nice(v) && Math.abs(v - t1) > 1e-9 && Math.abs(v - tk) > 1e-9) cands.push({ v, feedback });
    };
    const jb = C / (k - 2);
    add(
      t1 + (j - 1) * jb,
      `You shared the change of ${num(C)} between the ${k - 2} gaps, giving jumps of ${num(jb)}. But from the 1st term to the ${ord(k)} term there are ${k - 1} jumps (count the commas, not the gaps), so each jump is ${num(C)} ÷ ${k - 1} = ${num(d)}.`,
    );
    if (down) {
      add(
        t1 - (j - 1) * d,
        `The sequence goes down from ${num(t1)} to ${num(tk)}, so each jump is ${num(d)}: subtract ${e} each time instead of adding it.`,
      );
    }
    const rest: [number, string][] = [
      [
        t1 + ((j - 1) * C) / k,
        `You divided the change, ${num(C)}, by ${k} — the number of terms. Count the jumps between the terms instead: there are ${k - 1}, so each jump is ${num(d)}.`,
      ],
      [
        t1 + ((j - 1) * tk) / (k - 1),
        `You divided ${num(tk)} by ${k - 1}, but it's the change from ${num(t1)} to ${num(tk)} that gets shared out: ${sub(tk, t1)} = ${num(C)}, and ${num(C)} ÷ ${k - 1} = ${num(d)}.`,
      ],
      [
        tk - (j - 1) * d,
        `${num(tk - (j - 1) * d)} is the ${ord(k - j + 1)} term: you counted ${j - 1} jump${plural(j - 1)} back from ${num(tk)} instead of forward from ${num(t1)}. The ${ord(j)} term is ${j - 1} jump${plural(j - 1)} after the 1st term.`,
      ],
    ];
    if (j + 1 < k) {
      rest.push([
        t1 + j * d,
        `You added ${j} jumps, but the ${ord(j)} term is only ${j - 1} jump${plural(j - 1)} after the 1st term: ${jumpCalc} = ${num(ans)}.`,
      ]);
    }
    if (j === 2 && !down) {
      rest.push([d, `${d} is the jump between neighbouring terms, not the 2nd term. Add it on to the 1st term: ${num(t1)} + ${d} = ${num(ans)}.`]);
    }
    for (const [v, f] of r.shuffle(rest)) add(v, f);
    const wrong = numWrongs(ans, cands);
    if (wrong.length < 3 && tries < 40) continue;

    const shown = [num(t1), ...Array.from({ length: k - 2 }, () => "__"), num(tk)].join(", ");
    return {
      difficulty: down && (tk < 0 || t1 < 0) ? "challenge" : t1 < 0 ? "challenge" : "core",
      question: `Here is an arithmetic sequence with some terms missing:\n\n${shown}\n\nWhat is the ${ord(j)} term?`,
      answer: numSpec(ans),
      display: num(ans),
      correctFeedback: `Each jump is ${num(C)} ÷ ${k - 1} = ${num(d)}, so the ${ord(j)} term is ${jumpCalc} = ${num(ans)}.`,
      wrong,
      explanation: `The two terms you know are ${k - 1} jumps apart (from the 1st term to the ${ord(k)} term), and the total change is ${sub(tk, t1)} = ${num(C)}. So each jump is ${num(C)} ÷ ${k - 1} = ${num(d)}. The ${ord(j)} term is ${j - 1} jump${plural(j - 1)} after the 1st: ${jumpCalc} = ${num(ans)}. Check: the full sequence is ${seq(t)}, and the last jump lands on ${num(tk)} ✓`,
      solution: [
        `From the 1st term to the ${ord(k)} term there are ${k - 1} jumps (count the commas, not the gaps).`,
        `Total change: ${sub(tk, t1)} = ${num(C)}, so each jump is ${num(C)} ÷ ${k - 1} = ${num(d)}.`,
        `The ${ord(j)} term is ${jumpCalc} = ${num(ans)}.`,
        `Check: ${seq(t)} — the last jump lands on ${num(tk)} ✓`,
      ],
      hints: [
        `How many jumps are there from the 1st term to the ${ord(k)} term? Count the commas, not the gaps.`,
        `Share the total change, ${sub(tk, t1)}, equally between those jumps.`,
      ],
      verify: `${par(t1)}+(${j}-1)*(${par(tk)}-${par(t1)})/(${k}-1)`,
      commonError: "Dividing the change by the number of gaps instead of the number of jumps.",
      strategy: "Look at the differences",
      marks: 2,
      sig: `gap:${t1},${tk},${k},${j}`,
    };
  }
}

/** The first negative term of a decreasing arithmetic sequence. */
function firstNegative(r: Rng): Draft {
  let e: number, t1: number;
  do {
    e = r.int(3, 9);
    t1 = r.int(30, 99);
  } while (t1 % e === 0 || t1 < 5 * e);
  const q = Math.floor(t1 / e);
  const rem = t1 - q * e;
  const ans = rem - e;
  const t = [0, 1, 2, 3].map((i) => t1 - i * e);
  const listing =
    q <= 9 ? ` Listing the terms confirms it: ${seq(Array.from({ length: q + 2 }, (_, i) => t1 - i * e))}.` : "";

  return {
    difficulty: "challenge",
    question: `The sequence ${seq(t)}, … keeps going down by the same amount.\n\nWhat is the first negative term?`,
    answer: numSpec(ans),
    display: num(ans),
    correctFeedback: `Counting down in ${e}s: …, ${rem + e}, ${rem}, ${num(ans)}. The first term below zero is ${num(ans)}.`,
    wrong: numWrongs(ans, [
      { v: rem, feedback: `${rem} is the last positive term. One more step: ${rem} − ${e} = ${num(ans)}.` },
      {
        v: -e,
        feedback: `${num(-e)} would come straight after 0, but ${t1} isn't in the ${e} times table, so this sequence never lands on 0: it goes …, ${rem + e}, ${rem}, ${num(ans)}.`,
      },
      { v: ans - e, feedback: `You went one step too far: after ${rem} comes ${rem} − ${e} = ${num(ans)}, which is already negative.` },
    ]),
    explanation: `The term-to-term rule is 'subtract ${e}'. ${t1} ÷ ${e} = ${q} remainder ${rem}, so after ${q} jumps of ${e} the sequence reaches ${t1} − ${q * e} = ${rem}. One more jump gives ${rem} − ${e} = ${num(ans)}, the first negative term.${listing}`,
    solution: [
      `The term-to-term rule is 'subtract ${e}'.`,
      `${t1} ÷ ${e} = ${q} remainder ${rem}, so after ${q} jumps the sequence reaches ${t1} − ${q * e} = ${rem}, the last positive term.`,
      `One more jump: ${rem} − ${e} = ${num(ans)}. This is the first negative term.`,
    ],
    hints: [
      "What is the term-to-term rule?",
      `${t1} isn't a multiple of ${e}. What is the remainder when you divide ${t1} by ${e} — where does the sequence land just before zero?`,
    ],
    verify: `${t1}-${q + 1}*${e}`,
    commonError: "Stopping at the last positive term, or assuming the sequence lands exactly on 0.",
    strategy: "Find a pattern",
    marks: 2,
    sig: `neg:${t1},${e}`,
  };
}

const sqNext: Generator = {
  id: "sq-next",
  topic: "sq",
  section: "sq-terms",
  label: "Next term or a missing term of an arithmetic sequence",
  kinds: ["mcq", "qa"],
  make(r) {
    const v = r.next();
    return v < 0.35 ? nextTerm(r) : v < 0.8 ? gapTerm(r) : firstNegative(r);
  },
};

// ---------------------------------------------------------------------------
// sq-term-n — a far-away term (e.g. the 20th) from the first few terms
// ---------------------------------------------------------------------------

const sqTermN: Generator = {
  id: "sq-term-n",
  topic: "sq",
  section: "sq-terms",
  label: "Find a far-away term (e.g. the 20th) of an arithmetic sequence",
  kinds: ["mcq", "qa"],
  make(r) {
    const down = r.chance(0.35);
    const e = r.int(2, 9);
    const d = down ? -e : e;
    let t1: number;
    // t1 = d would be a plain times table; t1 = −d makes "one jump too many" equal "just the jumps"
    do t1 = down ? r.int(12, 80) : r.int(-6, 20);
    while (t1 === 0 || t1 === d || t1 === -d);
    const k = r.pick(down ? [10, 12, 15, 20, 25, 30] : [10, 12, 15, 20, 25, 30, 40, 50, 100]);
    const b = t1 - d; // zeroth term
    const t = [0, 1, 2, 3].map((i) => t1 + i * d);
    const [, t2, t3] = t;
    const ans = t1 + (k - 1) * d;
    const jumps = (k - 1) * e;

    let ctx: "" | "sticks" | "seats" = "";
    if (!down && t1 >= 3 && r.chance(0.35)) ctx = t1 >= 8 && t1 <= 20 && e <= 4 && k <= 30 ? "seats" : "sticks";
    const name = (i: number) => (ctx === "sticks" ? `Pattern ${i}` : ctx === "seats" ? `row ${i}` : `the ${ord(i)} term`);
    const result =
      ctx === "sticks" ? `Pattern ${k} uses` : ctx === "seats" ? `row ${k} has` : `the ${ord(k)} term is`;
    const unit = ctx === "sticks" ? " matchsticks" : ctx === "seats" ? " seats" : "";
    const question =
      ctx === "sticks"
        ? `Pattern 1 of a matchstick pattern uses ${t1} matchsticks, Pattern 2 uses ${t2} and Pattern 3 uses ${t3}. Each new pattern adds the same number of matchsticks.\n\nHow many matchsticks are in Pattern ${k}?`
        : ctx === "seats"
          ? `In a theatre, row 1 has ${t1} seats, row 2 has ${t2} and row 3 has ${t3}. Each row has ${e} more seats than the row in front of it.\n\nHow many seats are in row ${k}?`
          : `Here are the first four terms of an arithmetic sequence:\n\n${seq(t)}, …\n\nWork out the ${ord(k)} term.`;
    const startTxt = ctx === "sticks" ? `the ${t1} matchsticks in Pattern 1` : ctx === "seats" ? `the ${t1} seats in row 1` : "the 1st term";
    const each = ctx === "sticks" ? "each pattern uses" : ctx === "seats" ? "each row has" : "each term is";
    const calc = down ? `${t1} − ${k - 1} × ${e} = ${t1} − ${jumps}` : `${num(t1)} + ${k - 1} × ${e} = ${num(t1)} + ${jumps}`;

    let cands: Cand[];
    if (!down) {
      const offByOne: Cand = {
        v: t1 + k * d,
        feedback: `From ${name(1)} to ${name(k)} there are only ${k - 1} jumps, not ${k}: ${num(t1)} + ${k - 1} × ${e} = ${ans}. (${t1 + k * d} is also what ${lin(d, t1)} gives — using the first term instead of the zeroth term.)`,
      };
      const kd: Cand = {
        v: k * d,
        feedback: `${k} × ${e} = ${k * e} is the ${ord(k)} term of the ${e} times table. This sequence is ${b > 0 ? `${b} more` : `${-b} less`} than the ${e} times table (its nth term is ${lin(d, b)}), so the answer is ${k * e} ${signed(b)} = ${ans}.`,
      };
      const tail: Cand[] = [
        {
          v: jumps,
          feedback: `${k - 1} × ${e} = ${jumps} is just the ${k - 1} jumps. Now add them on to ${startTxt}: ${num(t1)} + ${jumps} = ${ans}.`,
        },
      ];
      if (t1 >= 2) {
        tail.push({
          v: t1 * k,
          feedback: `${cap(name(k))} isn't ${k} times ${name(1)} — that only works for a times-table sequence. Start at ${t1} and add on ${k - 1} jumps of ${e}: ${t1} + ${jumps} = ${ans}.`,
        });
      }
      cands = [kd, offByOne, ...r.shuffle(tail)];
    } else {
      const tail: Cand[] = [
        {
          v: -jumps,
          feedback: `${num(-jumps)} is just the ${k - 1} jumps of ${num(d)}. Now start from ${t1}: ${t1} − ${jumps} = ${num(ans)}.`,
        },
        {
          v: k * d,
          feedback: `${num(k * d)} is the ${ord(k)} term of ${lin(d, 0)}. This sequence has nth term ${lin(d, b)}, so the ${ord(k)} term is ${linAt(d, b, k)} = ${num(ans)}.`,
        },
      ];
      cands = [
        {
          v: t1 + k * d,
          feedback: `From ${name(1)} to ${name(k)} there are only ${k - 1} jumps, not ${k}: ${t1} − ${k - 1} × ${e} = ${num(ans)}.`,
        },
        {
          v: t1 + jumps,
          feedback: `The sequence goes down, so take the jumps away: ${t1} − ${jumps} = ${num(ans)}, not ${t1} + ${jumps}.`,
        },
        ...(ans < 0
          ? [
              {
                v: -ans,
                feedback: `Check the sign: ${jumps} is more than ${t1}, so ${t1} − ${jumps} is below zero. The answer is ${num(ans)}, not ${-ans}.`,
              },
            ]
          : []),
        ...r.shuffle(tail),
      ];
    }

    const zero = down ? `${t1} + ${e}` : sub(t1, e);
    return {
      difficulty: down ? (ans < 0 ? "challenge" : "core") : k <= 12 ? "warmup" : "core",
      question,
      answer: numSpec(ans),
      display: num(ans),
      correctFeedback: `There are ${k - 1} jumps of ${num(d)} from ${name(1)} to ${name(k)}: ${calc} = ${num(ans)}.`,
      wrong: numWrongs(ans, cands),
      explanation: `From ${name(1)} to ${name(k)} there are ${k - 1} jumps of ${num(d)} — one less than ${k}. So ${result} ${calc} = ${num(ans)}${unit}. Check with the nth term: the difference is ${num(d)} and the zeroth term is ${zero} = ${num(b)}, so the nth term is ${lin(d, b)}, and ${linAt(d, b, k)} = ${num(ans)} ✓`,
      solution: [
        `The difference is ${sub(t2, t1)} = ${num(d)}, so ${each} ${e} ${down ? "less" : "more"}${unit} than the one before.`,
        `${cap(name(k))} is ${k - 1} jumps after ${name(1)} — one less than ${k}.`,
        `${calc} = ${num(ans)}.`,
        `Check with the nth term ${lin(d, b)}: ${linAt(d, b, k)} = ${num(ans)} ✓`,
      ],
      hints: [
        `How many jumps are there from ${name(1)} to ${name(k)}?`,
        down
          ? `Each jump is ${num(d)}. Start from ${t1} and take away all the jumps — or find the nth term and put n = ${k}.`
          : `Each jump is ${e}. Start from ${num(t1)} and add on all the jumps — or find the nth term and put n = ${k}.`,
      ],
      verify: `${par(t1)}+(${k}-1)*${par(d)}`,
      commonError: `Multiplying ${k} by the difference without adjusting for the first value, or adding ${k} jumps instead of ${k - 1}.`,
      strategy: "Find a pattern",
      marks: 2,
      sig: `${t1},${d},${k}`,
    };
  },
};

// ---------------------------------------------------------------------------
// sq-nth — the nth term an + b of an arithmetic sequence
// ---------------------------------------------------------------------------

/** nth term from the first few terms (or a pattern of counters). */
function nthFromTerms(r: Rng, context: boolean): Draft {
  const down = !context && r.chance(0.4);
  let d: number, t1: number;
  for (;;) {
    const e = context ? r.int(2, 7) : r.int(2, 9);
    d = down ? -e : e;
    t1 = context ? r.int(3, 12) : down ? (r.chance(0.8) ? r.int(8, 60) : r.int(-12, 7)) : r.int(-10, 25);
    if (t1 !== 0 && t1 !== d) break; // zeroth term ≠ 0
  }
  const e = Math.abs(d);
  const b = t1 - d;
  const [, t2, t3, t4] = [0, 1, 2, 3].map((i) => t1 + i * d);
  const shownTerms = context ? [t1, t2, t3] : [t1, t2, t3, t4];
  const ans: Q = { a: 0, b: d, c: b };
  const item = context ? r.pick(["matchsticks", "tiles", "counters", "dots"]) : "";
  const zero = d > 0 ? sub(t1, d) : `${num(t1)} + ${e}`;

  let cands: (RuleCand | null)[];
  if (!down) {
    const firstTerm: RuleCand = {
      q: { a: 0, b: d, c: t1 },
      feedback: `You used the first term, ${num(t1)}, as the number on the end. Use the zeroth term instead: ${sub(t1, d)} = ${num(b)}. (${lin(d, t1)} gives ${seq([t2, t3, t4])}, … — one term too far along.)`,
    };
    const nPlusD: RuleCand = {
      q: { a: 0, b: 1, c: d },
      feedback: `This is the 'n + difference' slip: the difference ${d} multiplies n, so the rule starts ${d}n. (${lin(1, d)} gives ${seq([1 + d, 2 + d, 3 + d])}, … — it only goes up by 1.)`,
    };
    const swapped: RuleCand | null =
      b >= 2
        ? {
            q: { a: 0, b, c: d },
            feedback: `You've swapped the two numbers. The difference (${d}) goes in front of n and the zeroth term (${b}) goes on the end. (${lin(b, d)} goes up in ${b}s.)`,
          }
        : null;
    const signConst: RuleCand = {
      q: { a: 0, b: d, c: -b },
      feedback: `You worked out ${sub(d, t1)} = ${num(-b)} instead of ${sub(t1, d)} = ${num(b)}. The zeroth term is one step before ${num(t1)}, so it's ${sub(t1, d)} = ${num(b)}.`,
    };
    const forward: RuleCand = {
      q: { a: 0, b: d, c: t2 },
      feedback: `You went forwards from ${num(t1)} to ${num(t2)} instead of back. The zeroth term is one step before the 1st term: ${sub(t1, d)} = ${num(b)}.`,
    };
    cands = [firstTerm, ...r.shuffle([nPlusD, swapped, signConst]), forward];
  } else {
    const firstTerm: RuleCand = {
      q: { a: 0, b: d, c: t1 },
      feedback: `You used the first term as the number on the end. Go back one step to the zeroth term: ${num(t1)} + ${e} = ${num(b)}. (${lin(d, t1)} gives ${seq([t2, t3, t4])}, … — one term too far along.)`,
    };
    const positiveD: RuleCand = {
      q: { a: 0, b: e, c: t1 - e },
      feedback: `The sequence is going down, so the difference is −${e}, not +${e}. (${lin(e, t1 - e)} gives ${seq([t1, t1 + e, t1 + 2 * e])}, … — going up.)`,
    };
    const nPlusD: RuleCand = {
      q: { a: 0, b: 1, c: d },
      feedback: `This is the 'n + difference' slip: the difference −${e} multiplies n, so the rule has −${e}n, not ${lin(1, d)}.`,
    };
    const forward: RuleCand = {
      q: { a: 0, b: d, c: t2 },
      feedback: `You found the zeroth term by going forwards: ${num(t1)} − ${e} = ${num(t2)}. Going back one step means undoing the −${e}: ${num(t1)} + ${e} = ${num(b)}.`,
    };
    const signN: RuleCand = {
      q: { a: 0, b: e, c: b },
      feedback: `The terms go down, so the rule must have −${e}n, not +${e}n. (${lin(e, b)} gives ${seq([e + b, 2 * e + b, 3 * e + b])}, … — going up.)`,
    };
    cands = [firstTerm, ...r.shuffle([positiveD, nPlusD, forward]), signN];
  }

  const question = context
    ? `A pattern is made from ${item}. Pattern 1 has ${t1} ${item}, Pattern 2 has ${t2} and Pattern 3 has ${t3}. The pattern continues in the same way.\n\nFind an expression for the number of ${item} in Pattern n.`
    : `Find the nth term of the arithmetic sequence ${seq(shownTerms)}, …`;
  const explanation = context
    ? `The numbers of ${item} go ${seq(shownTerms)}: each pattern adds ${d}, so the rule starts ${d}n. The zeroth term (Pattern 0) is ${sub(t1, d)} = ${num(b)}. So Pattern n has ${lin(d, b)} ${item}. Check: Pattern 3 has ${linAt(d, b, 3)} = ${t3} ✓`
    : d > 0
      ? `The common difference is ${d}, so the nth term starts ${d}n — the ${d} times table, ${seq([d, 2 * d, 3 * d, 4 * d])}. Find the zeroth term by going back one step from the 1st term: ${sub(t1, d)} = ${num(b)}. So {{U_n = ${linA(d, b)}}}. Check: n = 1 gives ${linAt(d, b, 1)} = ${num(t1)} and n = 2 gives ${linAt(d, b, 2)} = ${num(t2)} ✓`
      : `The terms go down by ${e}, so the difference is −${e} and the nth term contains −${e}n. To find the zeroth term, go back one step from ${num(t1)} — for a decreasing sequence that means adding ${e}: ${num(t1)} + ${e} = ${num(b)}. So {{U_n = ${linA(d, b)}}}. Check: n = 1 gives ${linAt(d, b, 1)} = ${num(t1)} and n = 2 gives ${linAt(d, b, 2)} = ${num(t2)} ✓`;
  const diffs = shownTerms.slice(1).map(() => (d > 0 ? `+${d}` : num(d)));

  return {
    difficulty: down ? (t4 < 0 ? "challenge" : "core") : !context && b > 0 && e <= 5 ? "warmup" : "core",
    question,
    prompt: "Give your answer in terms of n.",
    answer: exprSpec(linA(d, b)),
    display: lin(d, b),
    correctFeedback: `The difference is ${num(d)} and the zeroth term is ${zero} = ${num(b)}, so the nth term is ${lin(d, b)}.`,
    wrong: ruleWrongs(ans, cands),
    explanation,
    solution: [
      `Differences: ${diffs.join(", ")} — the same each time, so the sequence is arithmetic with common difference ${num(d)}. The nth term starts ${lin(d, 0)}.`,
      `Zeroth term (one step before the 1st term): ${zero} = ${num(b)}.`,
      `nth term = (difference)n + (zeroth term), so {{U_n = ${linA(d, b)}}}.`,
      `Check: n = 3 gives ${linAt(d, b, 3)} = ${num(t3)} ✓`,
    ],
    hints:
      d > 0
        ? ["What is the common difference? That number goes in front of n.", "Step back one place from the 1st term to find the zeroth term — that's the number on the end."]
        : ["Is the sequence going up or down? What does that tell you about the number in front of n?", `Go back one step before ${num(t1)} to find the zeroth term.`],
    verify: `terms:${shownTerms.join(",")}`,
    commonError: `Using the first term instead of the zeroth term (writing ${lin(d, t1)}), or writing ${lin(1, d)} instead of ${lin(d, 0)}.`,
    strategy: "Look at the differences",
    marks: 2,
    sig: `${t1},${d}`,
  };
}

/** nth term from two terms that are not next to each other (the 3rd term is 14 and the 7th is 26). */
function nthFromTwo(r: Rng): Draft {
  let p: number, g: number, d: number, b: number, tp: number, tq: number;
  do {
    p = r.int(2, 5);
    g = r.int(2, 5);
    const e = r.int(2, 9);
    d = r.chance(0.7) ? e : -e;
    b = r.int(-10, 20);
    tp = d * p + b;
    tq = d * (p + g) + b;
  } while (b === 0 || tp === 0 || tq === 0);
  const q = p + g;
  const e = Math.abs(d);
  const D = tq - tp;
  const back = d > 0 ? `${num(tp)} − ${p} × ${e}` : `${num(tp)} + ${p} × ${e}`;
  const ans: Q = { a: 0, b: d, c: b };

  const cands: RuleCand[] = [
    {
      q: { a: 0, b: d, c: tp - d },
      feedback: `You found the difference ${num(d)} but treated ${num(tp)} as the 1st term. It's the ${ord(p)} term, so go back ${p} jumps to the zeroth term: ${back} = ${num(b)}.`,
    },
    {
      q: { a: 0, b: D, c: tp - p * D },
      feedback: `${num(D)} is the total change from the ${ord(p)} term to the ${ord(q)} term, not the difference between neighbouring terms. Share it over the ${g} jumps: ${num(D)} ÷ ${g} = ${num(d)}.`,
    },
  ];
  if (g - 1 >= 2 && D % (g - 1) === 0) {
    const d1 = D / (g - 1);
    cands.push({
      q: { a: 0, b: d1, c: tp - p * d1 },
      feedback: `You divided ${num(D)} by ${g - 1}, but from the ${ord(p)} term to the ${ord(q)} term there are ${q} − ${p} = ${g} jumps.`,
    });
  }
  if (D % (g + 1) === 0) {
    const d2 = D / (g + 1);
    cands.push({
      q: { a: 0, b: d2, c: tp - p * d2 },
      feedback: `You divided ${num(D)} by ${g + 1}, the number of terms from the ${ord(p)} to the ${ord(q)}, but there are only ${g} jumps between them.`,
    });
  }
  cands.push({
    q: { a: 0, b: d, c: tp },
    feedback: `You used the ${ord(p)} term, ${num(tp)}, as the number on the end. The number on the end is the zeroth term: ${back} = ${num(b)}.`,
  });

  return {
    difficulty: "challenge",
    question: `In an arithmetic sequence, the ${ord(p)} term is ${num(tp)} and the ${ord(q)} term is ${num(tq)}.\n\nFind the nth term of the sequence.`,
    prompt: "Give your answer in terms of n.",
    answer: exprSpec(linA(d, b)),
    display: lin(d, b),
    correctFeedback: `There are ${g} jumps from the ${ord(p)} term to the ${ord(q)} term, so the difference is ${num(D)} ÷ ${g} = ${num(d)}; then ${linAt(d, b, p)} = ${num(tp)} and ${linAt(d, b, q)} = ${num(tq)} ✓`,
    wrong: ruleWrongs(ans, cands),
    explanation: `From the ${ord(p)} term to the ${ord(q)} term there are ${q} − ${p} = ${g} jumps, and the terms change by ${sub(tq, tp)} = ${num(D)}. So the common difference is ${num(D)} ÷ ${g} = ${num(d)}, and the nth term starts ${lin(d, 0)}. When n = ${p}, ${lin(d, 0)} is ${num(d * p)}, but the ${ord(p)} term is ${num(tp)}, so the number on the end is ${sub(tp, d * p)} = ${num(b)}. So {{U_n = ${linA(d, b)}}}. Check the ${ord(q)} term: ${linAt(d, b, q)} = ${num(tq)} ✓`,
    solution: [
      `From the ${ord(p)} term to the ${ord(q)} term there are ${q} − ${p} = ${g} jumps.`,
      `The change is ${sub(tq, tp)} = ${num(D)}, so the common difference is ${num(D)} ÷ ${g} = ${num(d)}.`,
      `The nth term is ${lin(d, 0)} + b. Put n = ${p}: ${num(d * p)} + b = ${num(tp)}, so b = ${sub(tp, d * p)} = ${num(b)}.`,
      `So {{U_n = ${linA(d, b)}}}. Check: n = ${q} gives ${linAt(d, b, q)} = ${num(tq)} ✓`,
    ],
    hints: [
      `How many jumps are there from the ${ord(p)} term to the ${ord(q)} term?`,
      `Share the change, ${sub(tq, tp)}, equally between those jumps to get the common difference. Then use the ${ord(p)} term to find the number on the end.`,
    ],
    verify: `${par(tp)}+(n-${p})*(${par(tq)}-${par(tp)})/(${q}-${p})`,
    commonError: "Treating the given term as the 1st term, or dividing the change by the wrong number of jumps.",
    strategy: "Introduce a variable",
    marks: 3,
    sig: `two:${p},${tp},${q},${tq}`,
  };
}

const sqNth: Generator = {
  id: "sq-nth",
  topic: "sq",
  section: "sq-nth",
  label: "nth term an + b of an arithmetic sequence",
  kinds: ["mcq", "qa"],
  make(r) {
    const v = r.next();
    return v < 0.15 ? nthFromTwo(r) : nthFromTerms(r, v < 0.32);
  },
};

// ---------------------------------------------------------------------------
// sq-in-seq — which term is N? which of these numbers is a term?
// ---------------------------------------------------------------------------

/** "Which term of the sequence is 95?" — only ever asked when it is a term. */
function whichTerm(r: Rng): Draft {
  const rule = r.chance(0.5);
  for (let tries = 0; ; tries++) {
    const down = r.chance(0.25);
    const e = r.int(2, 9);
    const a = down ? -e : e;
    const b = down ? r.int(20, 90) : r.int(-9, 15);
    const k = down ? r.int(6, 30) : r.int(8, 40);
    const N = a * k + b;
    const t1 = a + b;
    if (b === 0 || t1 === 0 || N === 0) continue;
    const t = [0, 1, 2, 3].map((i) => t1 + i * a);
    const rhs = N - b; // a·n = N − b

    const cands: Cand[] = [];
    const subst: Cand | null =
      N > 0
        ? {
            v: a * N + b,
            feedback: `You put n = ${N} into the rule, which gives the ${ord(N)} term. Here ${N} is the term, and you need its position: solve ${lin(a, b)} = ${N}.`,
          }
        : null;
    if (!rule) {
      cands.push({
        v: k - 1,
        feedback: `${k - 1} is the number of jumps from the 1st term to ${num(N)}: (${sub(N, t1)}) ÷ ${a < 0 ? `(${num(a)})` : a} = ${k - 1}. The 1st term is already term 1, so ${num(N)} is ${k - 1} terms after it — the ${ord(k)} term. (Using ${lin(a, t1)}, with the first term instead of the zeroth term, gives the same slip.)`,
      });
    }
    if (down) {
      cands.push({
        v: -k,
        feedback: `A position can't be negative. ${lin(a, b)} = ${num(N)} gives −${e}n = ${num(rhs)}, and dividing by −${e} gives n = ${k} (a negative divided by a negative is positive).`,
      });
      cands.push({
        v: b - N,
        feedback: `You worked out ${sub(b, N)} = ${b - N} but didn't divide by ${e}: ${e}n = ${b - N}, so n = ${b - N} ÷ ${e} = ${k}.`,
      });
      if (subst) cands.push(subst);
    } else {
      cands.push({
        v: rhs,
        feedback: `You ${b > 0 ? `subtracted ${b}` : `added ${-b}`} but didn't divide by ${e}: ${lin(a, 0)} = ${num(rhs)}, so n = ${num(rhs)} ÷ ${e} = ${k}.`,
      });
      if (subst) cands.push(subst);
      const inv = (N + b) / a;
      if (Number.isInteger(inv) && inv > 0) {
        cands.push({
          v: inv,
          feedback: `You ${b > 0 ? `added ${b} instead of subtracting it` : `subtracted ${-b} instead of adding it`}. Undo the ${signed(b)} first: ${num(N)} ${signed(-b)} = ${num(rhs)}, then divide by ${e}.`,
        });
      }
      const ignore = N / a;
      if (nice(ignore) && ignore > 0) {
        cands.push({
          v: ignore,
          feedback: `You divided ${num(N)} by ${e} without dealing with the ${signed(b)} first. ${b > 0 ? `Take ${b} off` : `Add ${-b}`} first: ${num(N)} ${signed(-b)} = ${num(rhs)}, and ${num(rhs)} ÷ ${e} = ${k}.`,
        });
      }
    }
    const wrong = numWrongs(k, cands);
    if (wrong.length < 3 && tries < 40) continue;

    const zero = a > 0 ? sub(t1, a) : `${num(t1)} + ${e}`;
    const findRule = `The difference is ${num(a)} and the zeroth term is ${zero} = ${num(b)}, so the nth term is ${lin(a, b)}.`;
    const solve =
      a > 0
        ? [
            `Set the nth term equal to ${num(N)}: ${lin(a, b)} = ${num(N)}.`,
            `${b > 0 ? `Subtract ${b} from` : `Add ${-b} to`} both sides: ${lin(a, 0)} = ${num(rhs)}.`,
            `Divide by ${e}: n = ${k}. So ${num(N)} is the ${ord(k)} term.`,
          ]
        : [
            `Set the nth term equal to ${num(N)}: ${lin(a, b)} = ${num(N)}.`,
            `Subtract ${b} from both sides: ${lin(a, 0)} = ${num(rhs)}.`,
            `Divide both sides by −${e}: n = ${k}. So ${num(N)} is the ${ord(k)} term.`,
          ];
    const check = `Check: ${linAt(a, b, k)} = ${num(N)} ✓`;
    return {
      difficulty: rule && !down ? "core" : "challenge",
      question: rule
        ? `The nth term of a sequence is ${lin(a, b)}.\n\nWhich term of the sequence is ${num(N)}?`
        : `Here are the first four terms of an arithmetic sequence:\n\n${seq(t)}, …\n\nWhich term of the sequence is ${num(N)}?`,
      prompt: "Give its position in the sequence (the value of n).",
      answer: numSpec(k),
      display: String(k),
      correctFeedback: `${linAt(a, b, k)} = ${num(N)}, so ${num(N)} is the ${ord(k)} term.`,
      wrong,
      explanation: `${rule ? "" : `First find the nth term. ${findRule} `}To find which term ${num(N)} is, set the nth term equal to it and solve: ${lin(a, b)} = ${num(N)}, so ${lin(a, 0)} = ${num(rhs)} and n = ${k}. So ${num(N)} is the ${ord(k)} term. ${check}${rule ? "" : `. You can also count jumps: ${num(N)} is ${k - 1} jumps of ${num(a)} after ${num(t1)}, so it is term 1 + ${k - 1} = ${k}.`}`,
      solution: [...(rule ? [] : [findRule]), ...solve, check],
      hints: rule
        ? [`Set up an equation: ${lin(a, b)} = ${num(N)}.`, "Solve it by undoing the operations in reverse order."]
        : ["Find the nth term of the sequence first.", `Set your nth term equal to ${num(N)} and solve for n.`],
      verify: rule ? `(${par(N)}-${par(b)})/${par(a)}` : `(${par(N)}-${par(t1)})/${par(a)}+1`,
      commonError: rule
        ? `Putting n = ${num(N)} into the rule instead of solving ${lin(a, b)} = ${num(N)} — ${num(N)} is the term, not its position.`
        : "Counting the jumps from the 1st term and forgetting to add 1, or using the first term instead of the zeroth term.",
      strategy: "Introduce a variable",
      marks: rule ? 2 : 3,
      sig: `${rule ? "rule" : "seq"}:${a},${b},${N}`,
    };
  }
}

/** "Which of these numbers is a term of the sequence?" — one term and three near-misses. */
function whichIsTerm(r: Rng): Draft {
  const rule = r.chance(0.4);
  for (let tries = 0; ; tries++) {
    const a = r.int(3, 9);
    const b = r.int(-5, 12);
    const t1 = a + b;
    if (b === 0 || b % a === 0 || t1 < 2) continue;
    const k = r.int(12, 35);
    const N = a * k + b;
    const t = [0, 1, 2, 3].map((i) => t1 + i * a);
    const t2 = t[1];
    const isTerm = (x: number) => (((x - b) % a) + a) % a === 0 && x >= t1;
    const fix = `${b > 0 ? `${b} more` : `${-b} less`}`;
    const test = (x: number) => `${x} ${signed(-b)} = ${x - b} isn't a multiple of ${a}.`;

    const pool: Cand[] = [];
    if ((2 * b) % a !== 0) {
      const kk = k + r.pick([0, 1]);
      const x = a * kk - b;
      pool.push({
        v: x,
        feedback: `${x} = ${a} × ${kk} ${signed(-b)}: it is ${Math.abs(b)} ${b > 0 ? "less" : "more"} than a multiple of ${a}, but the terms are ${fix} than a multiple of ${a} (${lin(a, b)}). ${test(x)}`,
      });
    }
    const x1 = a * (k + r.pick([0, 1]));
    pool.push({
      v: x1,
      feedback: `${x1} is in the ${a} times table, but every term is ${fix} than a multiple of ${a} (the nth term is ${lin(a, b)}). ${test(x1)}`,
    });
    if (a % 2 === 0) {
      const x2 = N + r.pick([-2, 2]);
      const parity = Math.abs(b) % 2 === 0 ? "even" : "odd";
      pool.push({
        v: x2,
        feedback: `All the terms are ${parity}, but not every ${parity} number is a term — they go up in ${a}s. ${test(x2)}`,
      });
    }
    if (t1 >= 3 && t2 % t1 !== 0) {
      const mid = Math.round(N / t1);
      const x3 = [mid, mid + 1, mid - 1].map((mm) => mm * t1).find((x) => x !== N && !isTerm(x) && Math.abs(x - N) <= 3 * a);
      if (x3 !== undefined) {
        pool.push({
          v: x3,
          feedback: `${x3} is a multiple of ${t1}, the first term, but the terms aren't all multiples of ${t1} — ${t2} isn't. ${test(x3)}`,
        });
      }
    }
    const near = N + r.pick([-1, 1]);
    const cands = [
      ...r.shuffle(pool),
      {
        v: near,
        feedback: `${near} is very close to a term, but ${test(near)} The terms near it are ${N - a}, ${N} and ${N + a}.`,
      },
    ].filter((c) => c.v > 0 && !isTerm(c.v));
    const wrong = numWrongs(N, cands).slice(0, 3);
    if (wrong.length < 3 && tries < 40) continue;

    const xs = wrong.map((w) => Number(w.spec && w.spec.type === "number" ? w.spec.value : 0));
    const all = [N, ...xs].sort((x, y) => x - y);
    const intro = rule
      ? `Every term of ${lin(a, b)} is ${fix} than a multiple of ${a}.`
      : `The difference is ${a} and the zeroth term is ${sub(t1, a)} = ${num(b)}, so the nth term is ${lin(a, b)}: every term is ${fix} than a multiple of ${a}.`;
    const how = b > 0 ? `subtracting ${b}` : `adding ${-b}`;
    return {
      difficulty: rule ? "core" : "challenge",
      question: rule
        ? `Which of these numbers is a term of the sequence with nth term ${lin(a, b)}?`
        : `Which of these numbers is a term of the sequence ${seq(t)}, …?`,
      prompt: `The numbers are ${all.slice(0, 3).join(", ")} and ${all[3]}. Write down the one that is a term of the sequence.`,
      answer: numSpec(N),
      display: String(N),
      correctFeedback: `${N} ${signed(-b)} = ${N - b} = ${a} × ${k}, so ${N} is the ${ord(k)} term: ${linAt(a, b, k)} = ${N}.`,
      wrong,
      explanation: `${intro} Test each number by ${how} and checking whether the result divides exactly by ${a}. ${N} ${signed(-b)} = ${N - b} = ${a} × ${k}, so ${N} is the ${ord(k)} term. The others give ${xs
        .map((x) => x - b)
        .join(", ")
        .replace(/, (\d+)$/, " and $1")}, and none of those divide exactly by ${a}.`,
      solution: [
        ...(rule ? [] : [`The difference is ${a} and the zeroth term is ${num(b)}, so the nth term is ${lin(a, b)}.`]),
        `A number is a term if ${how} leaves a multiple of ${a}.`,
        `${N} ${signed(-b)} = ${N - b} = ${a} × ${k}, so ${N} is the ${ord(k)} term ✓`,
        `${xs.map((x) => `${x} ${signed(-b)} = ${x - b}`).join(", ")} — none of these are multiples of ${a}.`,
      ],
      hints: rule
        ? [`What do all the terms of ${lin(a, b)} have in common? Think about the ${a} times table.`, `${b > 0 ? `Subtract ${b} from` : `Add ${-b} to`} each number. Is the result in the ${a} times table?`]
        : ["Find the nth term of the sequence first.", `Every term is ${lin(a, b)}. What do you get if you ${b > 0 ? `subtract ${b} from` : `add ${-b} to`} a term?`],
      verify: rule ? `${a}*${k}+${par(b)}` : `${t1}+(${k}-1)*${a}`,
      commonError: "Choosing a number from the right times table (or with the right odd/even pattern) without checking what is left over.",
      strategy: "Eliminate options",
      marks: 2,
      sig: `pick:${a},${b},${all.join("/")}`,
    };
  }
}

const sqInSeq: Generator = {
  id: "sq-in-seq",
  topic: "sq",
  section: "sq-nth",
  label: "Is a number in the sequence? Which term is it?",
  kinds: ["mcq", "qa"],
  make(r) {
    return r.chance(0.6) ? whichTerm(r) : whichIsTerm(r);
  },
};

// ---------------------------------------------------------------------------
// sq-generate — terms from an nth-term rule (linear and simple quadratic)
// Written only: the answer is an ordered list, and a list can't be machine-checked as an MCQ option.
// ---------------------------------------------------------------------------

const sqGenerate: Generator = {
  id: "sq-generate",
  topic: "sq",
  section: "sq-generate",
  label: "Generate terms from an nth-term rule (linear and quadratic)",
  kinds: ["qa"],
  make(r) {
    const fam = r.pick(["lin", "lin", "sq", "sq", "asq", "asq", "nb", "nb", "br"] as const);
    let count = r.chance(0.5) ? 4 : 5;
    let f: (n: number) => number;
    let rule: string; // as shown in the question
    let piece: (n: number) => string; // ASCII for verify
    let line: (n: number) => string; // worked substitution
    let traps: { vs: number[]; feedback: string }[];
    let hints: string[];
    let commonError: string;
    let difficulty: Draft["difficulty"] = "core";
    let params: string;
    const lists = (g: (n: number) => number, from = 1) => Array.from({ length: count }, (_, i) => g(i + from));

    if (fam === "lin") {
      count = r.chance(0.7) ? 4 : 5;
      const a = r.chance(0.75) ? r.int(2, 9) : -r.int(2, 6);
      const b = a > 0 ? (r.chance(0.5) ? r.int(1, 12) : -r.int(1, 9)) : r.int(10, 30);
      f = (n) => a * n + b;
      rule = lin(a, b);
      piece = (n) => `${par(a)}*${n}+${par(b)}`;
      line = (n) => `n = ${n}: ${linAt(a, b, n)} = ${num(f(n))}`;
      params = `${a},${b}`;
      difficulty = a > 0 && b > 0 ? "warmup" : "core";
      traps = [{ vs: lists(f, 0), feedback: `You started at n = 0. The 1st term uses n = 1: ${linAt(a, b, 1)} = ${num(f(1))}.` }];
      if (a < 0) {
        traps.push(
          {
            vs: lists((n) => -a * n - b),
            feedback: `You worked out ${-a}n − ${b} instead of ${b} − ${-a}n. Take ${-a}n away from ${b}: for n = 1 that's ${b} − ${-a} = ${f(1)}.`,
          },
          {
            vs: lists((n) => (b + a) * n),
            feedback: `You worked out ${b} − ${-a} = ${b + a} first and then multiplied by n. Multiplication comes first: ${-a} × n, then take that away from ${b}.`,
          },
        );
      } else {
        traps.push({ vs: lists((n) => a * n - b), feedback: `The rule says ${signed(b)}, but you ${b > 0 ? "subtracted" : "added"} ${Math.abs(b)}.` });
        traps.unshift({
          vs: lists((n) => a + n + b),
          feedback: `${a}n means ${a} × n, not ${a} + n. For n = 2: ${a} × 2 = ${2 * a}, so the 2nd term is ${linAt(a, b, 2)} = ${num(f(2))}.`,
        });
        traps.push({
          vs: lists((n) => a * (n + b)),
          feedback: `You ${b > 0 ? "added" : "subtracted"} before multiplying, as if the rule were ${a}(n ${signed(b)}). Multiply first: ${a} × 1 = ${a}, then ${b > 0 ? "add" : "subtract"} ${Math.abs(b)}.`,
        });
      }
      hints =
        a > 0
          ? [`Replace n with 1, then 2, then 3 … Remember ${a}n means ${a} × n.`, `Multiply first, then ${b > 0 ? "add" : "subtract"} ${Math.abs(b)}.`]
          : [`Replace n with 1, then 2, then 3 … Remember ${-a}n means ${-a} × n.`, `Work out ${-a} × n first, then take it away from ${b}.`];
      commonError = `Starting at n = 0, or reading ${Math.abs(a)}n as ${Math.abs(a)} + n.`;
    } else if (fam === "sq") {
      const c = r.chance(0.6) ? r.int(1, 12) : -r.int(1, 9);
      f = (n) => n * n + c;
      rule = m(poly([[1, "n^2"], [c, ""]]));
      piece = (n) => `${n}^2+${par(c)}`;
      line = (n) => `n = ${n}: {{${n}^2}} ${signed(c)} = ${n * n} ${signed(c)} = ${num(f(n))}`;
      params = `${c}`;
      const step = f(2) - f(1);
      traps = [
        { vs: lists((n) => 2 * n + c), feedback: `{{n^2}} means n × n, not 2 × n. For n = 3: {{3^2}} = 9, so the 3rd term is 9 ${signed(c)} = ${num(f(3))}.` },
        { vs: lists(f, 0), feedback: `You started at n = 0. The 1st term uses n = 1: {{1^2}} ${signed(c)} = ${num(f(1))}.` },
        {
          vs: lists((n) => f(1) + (n - 1) * step),
          feedback: `You found the first two terms and then kept adding ${step} as if the sequence were linear. Substitute every value of n: the 3rd term is {{3^2}} ${signed(c)} = ${num(f(3))}.`,
        },
        { vs: lists((n) => n * n - c), feedback: `The rule says ${signed(c)}, but you ${c > 0 ? "subtracted" : "added"} ${Math.abs(c)}.` },
      ];
      hints = ["Replace n with 1, then 2, then 3 … one at a time.", `{{n^2}} means n × n. Square first, then ${c > 0 ? "add" : "subtract"} ${Math.abs(c)}.`];
      commonError = "Starting at n = 0, or reading {{n^2}} as 2n.";
    } else if (fam === "asq") {
      const a = r.int(2, 5);
      const c = r.int(-9, 9);
      f = (n) => a * n * n + c;
      rule = m(poly([[a, "n^2"], [c, ""]]));
      piece = (n) => `${a}*${n}^2+${par(c)}`;
      line = (n) => `n = ${n}: ${a} × {{${n}^2}}${c ? ` ${signed(c)}` : ""} = ${a} × ${n * n}${c ? ` ${signed(c)}` : ""} = ${num(f(n))}`;
      params = `${a},${c}`;
      const step = f(2) - f(1);
      const tail = c ? ` ${signed(c)}` : "";
      traps = [
        {
          vs: lists((n) => (a * n) ** 2 + c),
          feedback: `You squared ${a}n. In {{${a}n^2}} only n is squared: for n = 2 it's ${a} × 4 = ${4 * a}, not ${2 * a} × ${2 * a} = ${4 * a * a}.`,
        },
        { vs: lists((n) => 2 * a * n + c), feedback: `{{n^2}} means n × n, not 2 × n. For n = 3: ${a} × {{3^2}} = ${a} × 9 = ${9 * a}, not ${a} × 6 = ${6 * a}.` },
        { vs: lists(f, 0), feedback: `You started at n = 0. The 1st term uses n = 1: ${a} × {{1^2}}${tail} = ${num(f(1))}.` },
        {
          vs: lists((n) => f(1) + (n - 1) * step),
          feedback: `You found the first two terms and then kept adding ${step} as if the sequence were linear. Substitute every value of n: the 3rd term is ${a} × 9${tail} = ${num(f(3))}.`,
        },
      ];
      hints = ["Replace n with 1, then 2, then 3 … one at a time.", `Square n first, then multiply by ${a}${c ? `, then ${c > 0 ? "add" : "subtract"} ${Math.abs(c)}` : ""}.`];
      commonError = `Squaring the ${a} as well as the n — in {{${a}n^2}} only n is squared.`;
    } else if (fam === "nb") {
      const k = r.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
      f = (n) => n * (n + k);
      rule = m(`n(n${k > 0 ? "+" : "-"}${Math.abs(k)})`);
      piece = (n) => `${n}*(${n}+${par(k)})`;
      line = (n) => `n = ${n}: ${n} × (${n} ${signed(k)}) = ${n} × ${num(n + k)} = ${num(f(n))}`;
      params = `${k}`;
      difficulty = f(1) < 0 ? "challenge" : "core";
      const step = f(2) - f(1);
      traps = [
        {
          vs: lists((n) => n * n + k),
          feedback: `You worked out n × n ${signed(k)}, but the bracket means n multiplies the whole of (n ${signed(k)}). For n = 2: 2 × ${num(2 + k)} = ${num(f(2))}.`,
        },
        { vs: lists(f, 0), feedback: `You started at n = 0. The 1st term uses n = 1: 1 × (1 ${signed(k)}) = ${num(f(1))}.` },
        {
          vs: lists((n) => f(1) + (n - 1) * step),
          feedback: `You found the first two terms and then kept adding ${num(step)} as if the sequence were linear. Substitute every value of n: the 3rd term is 3 × ${num(3 + k)} = ${num(f(3))}.`,
        },
        { vs: lists((n) => 2 * n + k), feedback: `n(n ${signed(k)}) means n × (n ${signed(k)}), not n + (n ${signed(k)}). Multiply n by the bracket.` },
      ];
      hints = ["Replace n with 1, then 2, then 3 … one at a time.", "Work out the bracket first, then multiply it by n."];
      commonError = `Ignoring the bracket: n(n ${signed(k)}) means n × (n ${signed(k)}), not n × n ${signed(k)}.`;
    } else {
      const k = r.pick([-2, -1, 1, 2, 3]);
      f = (n) => (n + k) ** 2;
      const br = `(n${k > 0 ? "+" : "-"}${Math.abs(k)})`;
      rule = m(`${br}^2`);
      piece = (n) => `(${n}+${par(k)})^2`;
      line = (n) => `n = ${n}: {{(${n}${k > 0 ? "+" : "-"}${Math.abs(k)})^2}} = {{${par(n + k)}^2}} = ${f(n)}`;
      params = `${k}`;
      difficulty = k < 0 ? "challenge" : "core";
      const step = f(2) - f(1);
      traps = [
        {
          vs: lists((n) => n * n + (k > 0 ? k * k : -k * k)),
          feedback: `{{${br}^2}} is not {{n^2${k > 0 ? "+" : "-"}${k * k}}}: square the whole bracket, (n ${signed(k)}) × (n ${signed(k)}). For n = 3: {{(3${k > 0 ? "+" : "-"}${Math.abs(k)})^2}} = {{${par(3 + k)}^2}} = ${f(3)}, not ${9 + (k > 0 ? k * k : -k * k)}.`,
        },
        { vs: lists((n) => 2 * (n + k)), feedback: `Squaring means multiplying the bracket by itself, not doubling it: {{${br}^2}} = (n ${signed(k)}) × (n ${signed(k)}).` },
        { vs: lists(f, 0), feedback: `You started at n = 0. The 1st term uses n = 1: {{(1${k > 0 ? "+" : "-"}${Math.abs(k)})^2}} = ${f(1)}.` },
        {
          vs: lists((n) => f(1) + (n - 1) * step),
          feedback: `You found the first two terms and then kept adding ${step} as if the sequence were linear. Substitute every value of n: the 3rd term is {{${par(3 + k)}^2}} = ${f(3)}.`,
        },
      ];
      hints = ["Replace n with 1, then 2, then 3 … one at a time.", "Work out the bracket first, then square the answer."];
      commonError = `Writing {{${br}^2}} as {{n^2${k > 0 ? "+" : "-"}${k * k}}} — the whole bracket is squared.`;
    }

    const vals = lists(f);
    const ns = Array.from({ length: count }, (_, i) => i + 1);
    const quad = fam !== "lin";
    const order =
      fam === "lin"
        ? "multiplying before you add or subtract"
        : fam === "nb"
          ? "working out the bracket before you multiply"
          : fam === "br"
            ? "working out the bracket before you square it"
            : "squaring n first";
    const diffs = vals.slice(1).map((x, i) => x - vals[i]);
    const check = quad
      ? `Check: the first differences are ${seq(diffs)} and the second differences are all ${diffs[1] - diffs[0]}, so the sequence is quadratic ✓`
      : `Check: the terms go ${diffs[0] > 0 ? "up" : "down"} by ${Math.abs(diffs[0])} each time — the number in front of n ✓`;
    return {
      difficulty,
      question: `The nth term of a sequence is ${rule}.\n\nWork out the first ${WORDS[count]} terms.`,
      prompt: `Write the first ${WORDS[count]} terms in order, separated by commas.`,
      answer: { type: "list", values: vals, ordered: true },
      display: seq(vals),
      correctFeedback: `Substituting n = 1, 2, 3, … gives ${seq(vals)}.`,
      wrong: listWrongs(vals, traps),
      explanation: `Substitute n = ${ns.join(", ")} into ${rule} one at a time, ${order}: ${ns.map(line).join("; ")}. ${check}`,
      solution: [`Substitute n = ${ns.join(", ")} into ${rule}, ${order}.`, ...ns.map(line), check],
      hints,
      verify: ns.map(piece).join(", "),
      commonError,
      strategy: "Check by substituting",
      marks: 2,
      sig: `${fam}:${params}:${count}`,
    };
  },
};

// ---------------------------------------------------------------------------
// sq-quadratic — nth term of a quadratic sequence using the second difference
// ---------------------------------------------------------------------------

const sqQuadratic: Generator = {
  id: "sq-quadratic",
  topic: "sq",
  section: "sq-quadratic",
  label: "nth term of a quadratic sequence (second difference)",
  kinds: ["mcq", "qa"],
  make(r) {
    // Mostly two-term rules (an² + c, an² + bn) as in the school's assessments; some three-term ones as challenge.
    const v = r.next();
    const fam = v < 0.45 ? "F1" : v < 0.8 ? "F2" : "F3";
    let a: number, b: number, c: number;
    if (fam === "F1") {
      a = r.pick([1, 1, 1, 2, 2, 3, 4, 5, -1, -2]);
      b = 0;
      if (a < 0) c = r.int(3, 20);
      else do c = r.int(-12, 12);
      while (c === 0 && a === 1);
    } else if (fam === "F2") {
      a = r.pick([1, 1, 2, 3]);
      b = r.chance(0.55) ? r.int(1, 6) : -r.int(1, 6);
      c = 0;
    } else {
      a = r.pick([1, 2, 3]);
      b = r.chance(0.5) ? r.int(1, 5) : -r.int(1, 5);
      c = r.chance(0.5) ? r.int(1, 9) : -r.int(1, 9);
    }
    const q: Q = { a, b, c };
    const ns = [1, 2, 3, 4, 5];
    const t = ns.map((n) => val(q, n));
    const [t1, t2] = t;
    const diffs = t.slice(1).map((x, i) => x - t[i]);
    const dd = diffs.slice(1).map((x, i) => x - diffs[i]);
    const an2 = m(poly([[a, "n^2"]]));
    const negA2 = m(poly([[-a, "n^2"]]));
    const sqVals = ns.map((n) => a * n * n);
    const rem = ns.map((n) => b * n + c);
    const pairs = ns.map((n, i) => (a > 0 ? `${sub(t[i], sqVals[i])} = ${num(rem[i])}` : `${num(t[i])} + ${-sqVals[i]} = ${num(rem[i])}`));
    const first3 = (p: Q) => seq([1, 2, 3].map((n) => val(p, n)));

    const s1: Q = { a: 2 * a, b: 0, c: t1 - 2 * a };
    const cands: (RuleCand | null)[] = [
      {
        q: s1,
        feedback: `You used the second difference (${num(2 * a)}) as the coefficient of {{n^2}}. Halve it: ${num(2 * a)} ÷ 2 = ${num(a)}. (${ruleText(s1)} gives ${first3(s1)}, … — it only fits the first term.)`,
      },
      fam === "F1"
        ? {
            q: { a, b: 0, c: t1 },
            feedback: `You used the first term (${num(t1)}) as the constant. Take away the ${an2} part from each term first: ${pairs.slice(0, 2).join(", ")}, … so the constant is ${num(c)}.`,
          }
        : {
            q: { a, b: 0, c: t1 - a },
            feedback: `You used only the first remainder (${num(t1 - a)}) as a constant. ${a > 0 ? `Subtract ${an2} from` : `Add ${negA2} to`} every term: the remainders ${seq(rem)} change, so they make a linear sequence (${lin(b, c)}), not a constant.`,
          },
    ];
    const extra: (RuleCand | null)[] = [];
    if (diffs[0] !== 0) {
      extra.push({
        q: { a: 0, b: diffs[0], c: t1 - diffs[0] },
        feedback: `${lin(diffs[0], t1 - diffs[0])} only fits the first two terms. The differences ${seq(diffs)} keep changing, so the sequence is quadratic, not linear.`,
      });
    }
    if (a > 0) {
      if (fam === "F1" && c !== 0) {
        extra.push({
          q: { a, b: 0, c: -c },
          feedback: `Sign slip: each term minus ${an2} is ${num(c)} (for example ${pairs[0]}), so the constant is ${num(c)}, not ${num(-c)}.`,
        });
      } else if (fam === "F2") {
        extra.push({
          q: { a, b: -b, c: 0 },
          feedback: `Sign slip: the remainders ${seq(rem)} go ${b > 0 ? "up" : "down"} in ${Math.abs(b)}s, so the linear part is ${lin(b, 0)}, not ${lin(-b, 0)}.`,
        });
      } else if (fam === "F3") {
        extra.push({
          q: { a, b: -b, c: -c },
          feedback: `Sign slip: you worked out ${an2} − term instead of term − ${an2}, so every remainder has the wrong sign. The remainders are ${seq(rem)}, which is ${lin(b, c)}.`,
        });
      }
    } else {
      const s5: Q = { a: -a, b: 0, c: t1 + a };
      extra.push({
        q: s5,
        feedback: `The second difference is ${num(2 * a)}, which is negative, so the coefficient of {{n^2}} is ${num(a)}, not ${-a}. (${ruleText(s5)} gives ${first3(s5)}, … — going up.)`,
      });
    }
    cands.push(...r.shuffle(extra));

    const subtract = a > 0 ? `Subtract ${an2} (${seq(sqVals)}) from each term` : `Subtract ${an2} from each term, which means adding ${negA2}`;
    const leftover =
      fam === "F1"
        ? c === 0
          ? `Nothing is left over, so {{U_n = ${quadA(q)}}}.`
          : `The remainder is always ${num(c)}, so {{U_n = ${quadA(q)}}}.`
        : `The remainders ${seq(rem)} go ${b > 0 ? "up" : "down"} by ${Math.abs(b)}${c === 0 ? "" : ` with zeroth term ${num(c)}`}, so they are ${lin(b, c)}. So {{U_n = ${quadA(q)}}}.`;
    const check = `Check: n = 5 gives ${quadAt(q, 5)} = ${num(t[4])} ✓`;

    return {
      difficulty: fam === "F3" || a < 0 || (fam === "F2" && b < 0) ? "challenge" : "core",
      question: `Find the nth term of the quadratic sequence ${seq(t)}, …`,
      prompt: "Give your answer in terms of n.",
      answer: exprSpec(quadA(q)),
      display: m(quadA(q)),
      correctFeedback:
        fam === "F1"
          ? `Second difference ${num(2 * a)} gives ${an2}; taking ${an2} away from each term leaves ${num(c)} every time, so it's ${m(quadA(q))}.`
          : `Second difference ${num(2 * a)} gives ${an2}; taking ${an2} away leaves ${seq(rem)}, which is ${lin(b, c)}. So it's ${m(quadA(q))}.`,
      wrong: ruleWrongs(q, cands),
      explanation: `First differences: ${seq(diffs)}. Second differences: ${seq(dd)} — constant, so the sequence is quadratic and the coefficient of {{n^2}} is ${num(2 * a)} ÷ 2 = ${num(a)}. ${subtract}: ${pairs.slice(0, 4).join(", ")}, … ${leftover} ${check}`,
      solution: [
        `First differences: ${seq(diffs)}.`,
        `Second differences: ${seq(dd)}. They are constant, so the sequence is quadratic, and the coefficient of {{n^2}} is ${num(2 * a)} ÷ 2 = ${num(a)}.`,
        `${a > 0 ? `Subtract ${an2}` : `Add ${negA2}`}: ${pairs.join(", ")}.`,
        ...(fam === "F1"
          ? [c === 0 ? `Nothing is left over, so the nth term is ${m(quadA(q))}.` : `The remainder is always ${num(c)}, so the nth term is ${m(quadA(q))}.`]
          : [
              `The remainders ${seq(rem)} form a linear sequence with difference ${num(b)} and zeroth term ${num(c)}: that's ${lin(b, c)}.`,
              `So the nth term is ${m(quadA(q))}.`,
            ]),
        check,
      ],
      hints: [
        "Find the first differences, then the second differences.",
        "Halve the second difference to get the number in front of {{n^2}}. Then take that many {{n^2}} away from each term and look at what's left.",
      ],
      verify: `terms:${t.join(",")}`,
      commonError: "Using the second difference as the coefficient of {{n^2}} instead of halving it.",
      strategy: "Look at the differences",
      marks: fam === "F1" ? 2 : 3,
      sig: `${a},${b},${c}`,
    };
  },
};

export const GEN_SQ: Generator[] = [sqNext, sqTermN, sqNth, sqInSeq, sqGenerate, sqQuadratic];
