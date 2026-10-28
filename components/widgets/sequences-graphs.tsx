"use client";
// Interactive explorables for the "sequences-graphs" topic (Sequences & Functions).
//  1. Sequence explorer — arithmetic, geometric, Fibonacci-type and n² + c
//     sequences: terms, differences, a graph (or dot picture), the nth-term rule
//     via the zero term, "jump to term N" and an "is it a term?" checker.
//  2. Function machine — up to three steps (fractions allowed), run forwards or
//     backwards with inverse operations, a live mapping diagram and f(x), and a
//     mystery machine to crack from input → output pairs.
// All arithmetic is exact (fractions with gcd), so nothing is silently rounded.
import { Fragment, useId, useState, type ReactNode } from "react";
import { WidgetFrame, Slider, Segmented, Readout, M, type WidgetDef } from "./kit";

/* ======================================================================== */
/* Exact fractions                                                           */
/* ======================================================================== */

interface Q {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x || 1;
}

/** n/d in lowest terms with d > 0. */
function q(n: number, d = 1): Q {
  const s = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (s * n) / g + 0, d: (s * d) / g };
}

const qAdd = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
const qSub = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
const qMul = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
const qDiv = (a: Q, b: Q): Q => q(a.n * b.d, a.d * b.n);
const qAbs = (a: Q): Q => ({ n: Math.abs(a.n), d: a.d });
const qEq = (a: Q, b: Q) => a.n === b.n && a.d === b.d;
const qVal = (a: Q) => a.n / a.d;
const isOne = (a: Q) => a.n === 1 && a.d === 1;

/* ======================================================================== */
/* Formatting                                                                */
/* ======================================================================== */

/** Real minus signs in plain text. */
const minus = (s: string) => s.replace(/-/g, "−");

/** A whole number as plain text, with thousands commas from 10 000. */
function intText(n: number): string {
  const s = String(Math.abs(n));
  const body = Math.abs(n) >= 10000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s;
  return (n < 0 ? "−" : "") + body;
}

/** Decimal places of n/d if it terminates, otherwise null. */
function decPlaces(d: number): number | null {
  let x = d;
  let p2 = 0;
  let p5 = 0;
  while (x % 2 === 0) {
    x /= 2;
    p2++;
  }
  while (x % 5 === 0) {
    x /= 5;
    p5++;
  }
  return x === 1 ? Math.max(p2, p5) : null;
}

/** Maths markup for a fraction: whole number, a/b, or (mixed) a mixed number. */
function qMark(a: Q, mixed = true): string {
  if (a.d === 1) return String(a.n);
  const sign = a.n < 0 ? "-" : "";
  const n = Math.abs(a.n);
  if (mixed && n > a.d) return `${sign}${Math.floor(n / a.d)} ${n % a.d}/${a.d}`;
  return `${sign}${n}/${a.d}`;
}

/** Maths markup preferring a short exact decimal (2.5, −0.75) to a fraction. */
function qNice(a: Q, maxDp = 4): string {
  if (a.d === 1) return String(a.n);
  const p = decPlaces(a.d);
  if (p !== null && p <= maxDp) return qVal(a).toFixed(p);
  return qMark(a);
}

/** Plain text (aria labels, SVG): exact if short, else ≈ 2 d.p. */
function qPlain(a: Q): string {
  if (a.d === 1) return intText(a.n);
  const p = decPlaces(a.d);
  if (p !== null && p <= 4) return minus(qVal(a).toFixed(p));
  return `≈${minus(qVal(a).toFixed(2))}`;
}

/** Wrap negative markup in brackets: (−5). */
const paren = (s: string) => (s.startsWith("-") ? `(${s})` : s);

/** A value on screen: plain text for whole numbers / short decimals, real maths for fractions. */
function QV({ v, dec = true }: { v: Q; dec?: boolean }) {
  if (v.d === 1) return <>{intText(v.n)}</>;
  const p = decPlaces(v.d);
  if (dec && p !== null && p <= 4) return <>{minus(qVal(v).toFixed(p))}</>;
  return <M>{qMark(v)}</M>;
}

/** A signed change: +3, −0.5, +⅔. */
function Signed({ v, dec = true }: { v: Q; dec?: boolean }) {
  const sign = v.n > 0 ? "+" : v.n < 0 ? "−" : "";
  return (
    <>
      {sign}
      <QV v={qAbs(v)} dec={dec} />
    </>
  );
}

/** Plain-text number for axis ticks and sliders. */
function fmt(v: number, dp = 3): string {
  if (Math.abs(v - Math.round(v)) < 1e-9) return intText(Math.round(v));
  let s = v.toFixed(dp);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return minus(s);
}

/** Parse a typed number: 12, −3.5, 7/2 or 3 1/2. */
function parseQ(raw: string): Q | null {
  const s = raw.trim().replace(/[−–]/g, "-").replace(/,/g, "");
  let m = s.match(/^(-?)(\d{1,10})\s+(\d{1,10})\/(\d{1,10})$/);
  if (m) {
    const den = Number(m[4]);
    if (!den) return null;
    const v = q(Number(m[2]) * den + Number(m[3]), den);
    return m[1] ? q(-v.n, v.d) : v;
  }
  m = s.match(/^(-?\d{1,10})\/(\d{1,10})$/);
  if (m) {
    const den = Number(m[2]);
    return den ? q(Number(m[1]), den) : null;
  }
  m = s.match(/^(-?)(\d{0,10})(?:\.(\d{1,6}))?$/);
  if (m && (m[2] || m[3])) {
    const frac = m[3] ?? "";
    const den = 10 ** frac.length;
    const v = q(Number(m[2] || "0") * den + Number(frac || "0"), den);
    return m[1] ? q(-v.n, v.d) : v;
  }
  return null;
}

/** "Nice" axis scale that always includes lo and hi. */
function niceScale(lo0: number, hi0: number) {
  let lo = lo0;
  let hi = hi0;
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  const raw = (hi - lo) / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const a = Math.floor(lo / step + 1e-9);
  const b = Math.ceil(hi / step - 1e-9);
  const ticks: number[] = [];
  for (let i = a; i <= b; i++) ticks.push(+(i * step).toFixed(10));
  return { lo: a * step, hi: b * step, ticks };
}

/** A slider with − / + buttons for exact control on touch screens. */
function NudgeSlider({
  name,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  name: string;
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => ReactNode;
}) {
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Slider label={label} value={value} min={min} max={max} step={step} onChange={(v) => onChange(snap(v))} format={format ?? ((v) => fmt(v))} />
      </div>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(snap(value - step))}
        disabled={value <= min}
        aria-label={`${name}: decrease`}
      >
        −
      </button>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(snap(value + step))}
        disabled={value >= max}
        aria-label={`${name}: increase`}
      >
        +
      </button>
    </div>
  );
}

/* ======================================================================== */
/* 1. Sequence explorer                                                      */
/* ======================================================================== */

type Kind = "arith" | "geo" | "fib" | "quad";
type RKey = "2" | "3" | "1/2" | "-2";
type View = "graph" | "dots";

const RATIOS: Record<RKey, Q> = { "2": q(2), "3": q(3), "1/2": q(1, 2), "-2": q(-2) };
/** Terms shown in the strip and on the graph. */
const SHOW = 8;

interface Seq {
  kind: Kind;
  /** First term. */
  a: Q;
  /** Common difference (arithmetic). */
  d: Q;
  /** Common ratio (geometric). */
  r: Q;
  /** Second term (Fibonacci-type). */
  b: Q;
  /** Constant in n² + c. */
  c: Q;
}

function seqTerms(s: Seq, count: number): Q[] {
  const out: Q[] = [];
  if (s.kind === "arith") {
    for (let n = 1; n <= count; n++) out.push(qAdd(s.a, qMul(q(n - 1), s.d)));
  } else if (s.kind === "geo") {
    let t = s.a;
    for (let n = 1; n <= count; n++) {
      out.push(t);
      t = qMul(t, s.r);
    }
  } else if (s.kind === "fib") {
    let x = s.a;
    let y = s.b;
    for (let n = 1; n <= count; n++) {
      out.push(x);
      const z = qAdd(x, y);
      x = y;
      y = z;
    }
  } else {
    for (let n = 1; n <= count; n++) out.push(qAdd(q(n * n), s.c));
  }
  return out;
}

function termAt(s: Seq, N: number): Q {
  if (s.kind === "arith") return qAdd(s.a, qMul(q(N - 1), s.d));
  if (s.kind === "quad") return qAdd(q(N * N), s.c);
  return seqTerms(s, N)[N - 1];
}

/** "3n", "−n", "0.5n", "x/4", "2x/3" … */
function coefTerm(m: Q, v: string, dec: boolean): string {
  const am = qAbs(m);
  let body: string;
  if (am.d === 1) body = am.n === 1 ? v : `${am.n}${v}`;
  else if (dec && decPlaces(am.d) !== null) body = `${qNice(am)}${v}`;
  else body = am.n === 1 ? `${v}/${am.d}` : `${am.n}${v}/${am.d}`;
  return m.n < 0 ? `-${body}` : body;
}

/** m·v + c as maths markup, e.g. "3n + 1", "−5n + 28", "x/2 + 3". */
function linMark(m: Q, c: Q, v: string, dec: boolean): string {
  const cs = (x: Q) => (dec ? qNice(x) : qMark(x, false));
  if (m.n === 0) return cs(c);
  const t = coefTerm(m, v, dec);
  if (c.n === 0) return t;
  return `${t} ${c.n > 0 ? "+" : "-"} ${cs(qAbs(c))}`;
}

function quadMark(c: Q): string {
  if (c.n === 0) return "n^2";
  return `n^2 ${c.n > 0 ? "+" : "-"} ${qNice(qAbs(c))}`;
}

/** Up to 6 terms as markup: "3, 6, 12, …, 1536". */
function listMark(ts: Q[], dec: boolean): string {
  const f = (t: Q) => (dec ? qNice(t) : qMark(t));
  if (ts.length <= 6) return ts.map(f).join(", ");
  return [...ts.slice(0, 4).map(f), "…", f(ts[ts.length - 1])].join(", ");
}

interface Verdict {
  yes: boolean;
  /** Positions (1-based) where the number appears. */
  positions: number[];
  /** Working, as maths-markup lines. */
  working: string[];
  note: ReactNode;
}

/** Decide, with an honest reason, whether k is a term of s. */
function checkTerm(s: Seq, k: Q): Verdict {
  const K = <QV v={k} dec={s.kind !== "geo"} />;

  if (s.kind === "arith") {
    const zero = qSub(s.a, s.d);
    if (s.d.n === 0) {
      const yes = qEq(k, s.a);
      return {
        yes,
        positions: yes ? Array.from({ length: SHOW }, (_, i) => i + 1) : [],
        working: [],
        note: yes ? <>The difference is 0, so <strong>every</strong> term is {K}.</> : <>The difference is 0, so every term is <QV v={s.a} /> and {K} never appears.</>,
      };
    }
    const working = [`${linMark(s.d, zero, "n", true)} = ${qNice(k)}`];
    const rhs = qSub(k, zero);
    if (zero.n !== 0) working.push(`${coefTerm(s.d, "n", true)} = ${qNice(k)} ${zero.n > 0 ? "-" : "+"} ${qNice(qAbs(zero))} = ${qNice(rhs)}`);
    const n = qDiv(rhs, s.d);
    if (!isOne(s.d)) working.push(`n = ${qNice(rhs)} ÷ ${paren(qNice(s.d))} = ${qNice(n)}`);
    if (n.d === 1 && n.n >= 1) {
      return { yes: true, positions: [n.n], working, note: <>n is a positive whole number, so {K} is term number <strong>{intText(n.n)}</strong>.</> };
    }
    if (n.d === 1) {
      return {
        yes: false,
        positions: [],
        working,
        note: (
          <>
            That would be position {intText(n.n)}, but positions start at 1 — so {K} is not a term.
            {n.n === 0 ? " (It is the zero term, one step before the start.)" : ""}
          </>
        ),
      };
    }
    const lo = Math.floor(qVal(n));
    return {
      yes: false,
      positions: [],
      working,
      note:
        lo >= 1 ? (
          <>
            n is not a whole number, so {K} is not a term. It falls between term {intText(lo)} (<QV v={termAt(s, lo)} />) and term {intText(lo + 1)} (
            <QV v={termAt(s, lo + 1)} />
            ).
          </>
        ) : (
          <>n is not a whole number (and would come before the first term), so {K} is not a term.</>
        ),
    };
  }

  if (s.kind === "quad") {
    const m = qSub(k, s.c);
    const working = [`${quadMark(s.c)} = ${qNice(k)}`];
    if (s.c.n !== 0) working.push(`n^2 = ${qNice(k)} ${s.c.n > 0 ? "-" : "+"} ${qNice(qAbs(s.c))} = ${qNice(m)}`);
    if (m.d !== 1) return { yes: false, positions: [], working, note: <>A whole number squared is a whole number, so n² can’t be <QV v={m} />: {K} is not a term.</> };
    if (m.n < 1) return { yes: false, positions: [], working, note: <>n² would be {intText(m.n)}, but 1², 2², 3², … are all at least 1 — so {K} is not a term.</> };
    let r = Math.floor(Math.sqrt(m.n));
    while (r * r > m.n) r--;
    while ((r + 1) * (r + 1) <= m.n) r++;
    if (r * r === m.n) {
      working.push(`n = sqrt(${m.n}) = ${r}`);
      return { yes: true, positions: [r], working, note: <>{intText(m.n)} is a square number, so {K} is term number <strong>{intText(r)}</strong>.</> };
    }
    return {
      yes: false,
      positions: [],
      working,
      note: (
        <>
          {intText(m.n)} is not a square number ({r}² = {intText(r * r)}, {r + 1}² = {intText((r + 1) * (r + 1))}), so {K} is not a term: it falls between
          term {r} and term {r + 1}.
        </>
      ),
    };
  }

  if (s.kind === "geo") {
    const rv = qVal(s.r);
    if (k.n === 0) return { yes: false, positions: [], working: [], note: <>Multiplying a non-zero number by <M>{qMark(s.r)}</M> never gives 0, so 0 is never a term.</> };
    if (rv > 0 && k.n < 0)
      return { yes: false, positions: [], working: [], note: <>The first term is positive and the ratio is positive, so every term is positive: {K} can’t appear.</> };
    const growing = Math.abs(rv) > 1;
    const seen: Q[] = [];
    let t = s.a;
    for (let j = 1; j <= 60; j++) {
      seen.push(t);
      if (qEq(t, k)) {
        return { yes: true, positions: [j], working: [listMark(seen, false)], note: <>{K} is term number <strong>{j}</strong>.</> };
      }
      const past = growing ? Math.abs(qVal(t)) > Math.abs(qVal(k)) : Math.abs(qVal(t)) < Math.abs(qVal(k));
      if (past) {
        return {
          yes: false,
          positions: [],
          working: [listMark(seen, false)],
          note: growing ? (
            <>
              By term {j} the terms are already further from 0 than {K}, and each later term is {Math.abs(rv)} times as far out, so {K} never appears.
            </>
          ) : (
            <>By term {j} the terms are already closer to 0 than {K}, and each later term is half the one before, so {K} never appears.</>
          ),
        };
      }
      t = qMul(t, s.r);
    }
    return { yes: false, positions: [], working: [], note: <>{K} is not among the first 60 terms.</> };
  }

  // Fibonacci-type (whole-number starts)
  if (k.d !== 1) return { yes: false, positions: [], working: [], note: <>Every term is a whole number (whole + whole = whole), so {K} can’t be a term.</> };
  const a = s.a.n;
  const b = s.b.n;
  if (a === 0 && b === 0) {
    const yes = k.n === 0;
    return {
      yes,
      positions: yes ? Array.from({ length: SHOW }, (_, i) => i + 1) : [],
      working: [],
      note: yes ? <>Every term is 0.</> : <>Every term is 0, so {K} never appears.</>,
    };
  }
  const ts: number[] = [a, b];
  const positions: number[] = [];
  for (let i = 0; i < 70; i++) {
    if (i >= ts.length) ts.push(ts[i - 1] + ts[i - 2]);
    if (ts[i] === k.n) positions.push(i + 1);
    if (i >= 1) {
      const p = ts[i - 1];
      const t = ts[i];
      if (p !== 0 && t !== 0 && Math.sign(p) === Math.sign(t) && Math.min(Math.abs(p), Math.abs(t)) > Math.abs(k.n)) {
        const listed = ts.slice(0, i + 1).map((x) => q(x));
        if (positions.length) {
          const where =
            positions.length === 1 ? `term ${positions[0]}` : `terms ${positions.slice(0, -1).join(", ")} and ${positions[positions.length - 1]}`;
          return { yes: true, positions, working: [listMark(listed, true)], note: <>{K} is {where}.</> };
        }
        return {
          yes: false,
          positions,
          working: [listMark(listed, true)],
          note: (
            <>
              Terms {i} and {i + 1} have the same sign and are both further from 0 than {K}. Each later term is the sum of the two before it, so from there on the
              terms only get further from 0 — {K} never appears.
            </>
          ),
        };
      }
    }
  }
  return positions.length
    ? { yes: true, positions, working: [], note: <>{K} is term {positions[0]}.</> }
    : { yes: false, positions, working: [], note: <>{K} is not among the first 70 terms.</> };
}

/* ---------------- graph of term against position ---------------- */

function SeqGraph({ seq, terms, zero, kv, hits }: { seq: Seq; terms: Q[]; zero: Q | null; kv: number | null; hits: number[] }) {
  const W = 360;
  const H = 220;
  const L = 50;
  const R = 14;
  const T = 22;
  const B = 34;
  const vals = terms.map(qVal);
  const pool = [...vals, 0];
  if (zero) pool.push(qVal(zero));
  const sc = niceScale(Math.min(...pool), Math.max(...pool));
  const px = (n: number) => L + (n * (W - L - R)) / SHOW;
  const py = (v: number) => H - B - ((v - sc.lo) / (sc.hi - sc.lo)) * (H - T - B);
  const linear = seq.kind === "arith";
  const flat = vals.every((v) => v === vals[0]);
  const showK = kv !== null && kv >= sc.lo && kv <= sc.hi;
  const aria = `Graph of term against position n for n = 1 to ${SHOW}: ${terms.map((t, i) => `(${i + 1}, ${qPlain(t)})`).join(", ")}. ${
    linear
      ? `The points lie on a straight line that meets the vertical axis at the zero term, ${qPlain(zero ?? q(0))}.`
      : flat
        ? "The points all lie on a flat line."
        : "The points do not lie on a straight line."
  }`;

  // Keep the two small labels clear of the points, the dashed lines and the axes.
  type Box = { x0: number; y0: number; x1: number; y1: number };
  type Spot = { x: number; y: number; end?: boolean };
  const boxOf = (c: Spot, chars: number): Box => {
    const w = chars * 6.2;
    return { x0: c.end ? c.x - w : c.x, x1: c.end ? c.x : c.x + w, y0: c.y - 9, y1: c.y + 2 };
  };
  const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  const clashes = (b: Box, marks: [number, number][], avoid: Box[] = []) =>
    b.x0 < L + 2 ||
    b.x1 > W - 2 ||
    b.y0 < T - 8 ||
    b.y1 > H - B - 1 ||
    marks.some(([x, y]) => x > b.x0 - 6 && x < b.x1 + 6 && y > b.y0 - 6 && y < b.y1 + 6) ||
    avoid.some((o) => overlaps(b, o));
  const pick = (cands: Spot[], chars: number, marks: [number, number][], avoid: Box[] = []) =>
    cands.find((c) => Number.isFinite(c.x) && !clashes(boxOf(c, chars), marks, avoid)) ?? cands[0];

  const dots: [number, number][] = vals.map((v, i) => [px(i + 1), py(v)]);
  const zx = px(0);
  const zy = zero ? py(qVal(zero)) : 0;
  const lineMarks: [number, number][] = [];
  if (linear && zero) for (let j = 0; j <= 64; j++) lineMarks.push([zx + ((px(SHOW) - zx) * j) / 64, zy + ((py(vals[SHOW - 1]) - zy) * j) / 64]);

  // "your number": try the right-hand end of its line first, above then below, then the left-hand end
  const ky = kv === null ? 0 : py(kv);
  const kLabel = pick(
    [
      { x: W - R - 2, y: ky - 4, end: true },
      { x: W - R - 2, y: ky + 13, end: true },
      { x: L + 22, y: ky - 4 },
      { x: L + 22, y: ky + 13 },
      { x: (L + W - R) / 2, y: ky - 4 },
      { x: (L + W - R) / 2, y: ky + 13 },
      { x: W - R - 2, y: ky - 16, end: true },
      { x: W - R - 2, y: ky + 25, end: true },
      { x: L + 22, y: ky - 16 },
      { x: L + 22, y: ky + 25 },
    ],
    11,
    [...dots, ...lineMarks, [zx, zy]],
  );
  const kBox = showK ? [boxOf(kLabel, 11)] : [];

  // "zero term": next to the hollow point, on the empty side of the line (below it if
  // the sequence goes up, above it if it goes down), sliding along the line if needed.
  let zeroLabel: Spot = { x: 0, y: 0 };
  if (linear && zero) {
    const chars = `zero term ${qPlain(zero)}`.length;
    const kMarks: [number, number][] = [];
    if (showK) for (let j = 0; j <= 64; j++) kMarks.push([L + ((W - R - L) * j) / 64, ky]);
    const marks: [number, number][] = [...dots, ...lineMarks, ...kMarks, [zx, zy]];
    const up = seq.d.n > 0;
    const down = seq.d.n < 0;
    /** How far the line climbs (or falls), in pixels per pixel across. */
    const slope = Math.abs(py(vals[SHOW - 1]) - zy) / (px(SHOW) - zx);
    const near: Spot = down ? { x: zx + 9, y: zy - 8 } : { x: zx + 9, y: zy + 16 };
    const far: Spot = down ? { x: zx + 9, y: zy + 16 } : { x: zx + 9, y: zy - 8 };
    const slideY = down ? Math.max(zy - 8, T + 2) : Math.min(zy + 16, H - B - 3);
    const slide: Spot = {
      x: up ? zx + 9 + Math.max(0, (zy - slideY + 15) / slope) : down ? zx + 9 + Math.max(0, (slideY + 8 - zy) / slope) : Infinity,
      y: slideY,
    };
    zeroLabel = pick(
      [near, slide, far, { x: L + 6, y: T + 10 }, { x: L + 6, y: H - B - 6 }, { x: W - R - 4 - chars * 6.2, y: T + 10 }, { x: W - R - 4 - chars * 6.2, y: H - B - 6 }],
      chars,
      marks,
      kBox,
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={aria}>
      {/* grid */}
      {sc.ticks.map((t) => (
        <g key={`y${t}`}>
          <line x1={L} x2={W - R} y1={py(t)} y2={py(t)} className={t === 0 ? "stroke-ink-2" : "stroke-line"} strokeWidth={t === 0 ? 1.5 : 1} />
          <text x={L - 6} y={py(t) + 3.5} fontSize={10} textAnchor="end" className="fill-ink-2">
            {fmt(t)}
          </text>
        </g>
      ))}
      {Array.from({ length: SHOW + 1 }, (_, n) => (
        <g key={`x${n}`}>
          <line x1={px(n)} x2={px(n)} y1={T} y2={H - B} className={n === 0 ? "stroke-ink-2" : "stroke-line"} strokeWidth={n === 0 ? 1.5 : 1} />
          <text x={px(n)} y={H - B + 14} fontSize={10} textAnchor="middle" className="fill-ink-2">
            {n}
          </text>
        </g>
      ))}
      <text x={(L + W - R) / 2} y={H - 4} fontSize={11} textAnchor="middle" fontWeight={700} className="fill-ink-2">
        position n
      </text>
      <text x={6} y={12} fontSize={11} fontWeight={700} className="fill-ink-2">
        term ↑
      </text>

      {/* the number being tested */}
      {showK && kv !== null ? (
        <g>
          <line x1={L} x2={W - R} y1={py(kv)} y2={py(kv)} className="stroke-accent" strokeWidth={1.5} strokeDasharray="6 4" />
          <text
            x={kLabel.x}
            y={kLabel.y}
            fontSize={10}
            textAnchor={kLabel.end ? "end" : "start"}
            fontWeight={700}
            className="fill-accent stroke-surface"
            strokeWidth={3}
            paintOrder="stroke"
          >
            your number
          </text>
        </g>
      ) : null}

      {/* straight line through an arithmetic sequence, back to the zero term */}
      {linear && zero ? (
        <g>
          <line x1={px(0)} y1={py(qVal(zero))} x2={px(SHOW)} y2={py(vals[SHOW - 1])} className="stroke-brand" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.75} />
          <circle cx={px(0)} cy={py(qVal(zero))} r={5} className="fill-surface stroke-accent" strokeWidth={2.5} />
          <text
            x={zeroLabel.x}
            y={zeroLabel.y}
            fontSize={10}
            fontWeight={700}
            className="fill-accent stroke-surface"
            strokeWidth={3}
            paintOrder="stroke"
          >
            zero term {qPlain(zero)}
          </text>
        </g>
      ) : null}

      {terms.map((t, i) => (
        <circle
          key={`p${i}`}
          cx={px(i + 1)}
          cy={py(vals[i])}
          r={hits.includes(i + 1) ? 6.5 : 4.5}
          className={hits.includes(i + 1) ? "fill-good stroke-surface" : "fill-brand stroke-surface"}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

/* ---------------- dot picture: pattern n ---------------- */

function DotPicture({ kind, d, c }: { kind: "arith" | "quad"; d: number; c: number }) {
  const S = 10;
  const RAD = 3.4;
  const GAP = 22;
  const ROWS = 6;
  const P = 4;
  const greyCols = c > 0 ? Math.ceil(c / ROWS) : 0;
  const greyW = greyCols ? greyCols * S + 6 : 0;
  const bodyW = (p: number) => (kind === "arith" ? p * (S + 4) : p * S);
  const widths = Array.from({ length: P }, (_, i) => greyW + bodyW(i + 1));
  const total = widths.reduce((x, y) => x + y, 0) + GAP * (P - 1);
  const W = 360;
  const base = 78;
  const starts: number[] = [];
  let cursor = (W - total) / 2;
  for (const w of widths) {
    starts.push(cursor);
    cursor += w + GAP;
  }
  const count = (p: number) => c + (kind === "arith" ? p * d : p * p);
  const greyText = c === 1 ? "1 grey dot" : `${c} grey dots`;
  const aria =
    kind === "arith"
      ? `Dot patterns 1 to 4. Each has ${c > 0 ? `${greyText} plus ` : ""}n columns of ${d} coloured dots: ${[1, 2, 3, 4].map(count).join(", ")} dots.`
      : `Dot patterns 1 to 4. Each is an n by n square of dots${c > 0 ? ` plus ${greyText}` : ""}: ${[1, 2, 3, 4].map(count).join(", ")} dots. The newest L-shaped layer is highlighted.`;

  return (
    <svg viewBox={`0 0 ${W} 118`} className="h-auto w-full" role="img" aria-label={aria}>
      {starts.map((x0, idx) => {
        const p = idx + 1;
        const dots: ReactNode[] = [];
        for (let g = 0; g < c; g++) {
          const col = Math.floor(g / ROWS);
          const row = g % ROWS;
          dots.push(<circle key={`g${g}`} cx={x0 + col * S + S / 2} cy={base - row * S} r={RAD} className="fill-ink-2" opacity={0.45} />);
        }
        const bx = x0 + greyW;
        if (kind === "arith") {
          for (let grp = 0; grp < p; grp++) {
            for (let row = 0; row < d; row++) {
              dots.push(
                <circle
                  key={`a${grp}-${row}`}
                  cx={bx + grp * (S + 4) + S / 2}
                  cy={base - row * S}
                  r={RAD}
                  className={grp % 2 === 0 ? "fill-brand" : "fill-accent"}
                />,
              );
            }
          }
        } else {
          for (let col = 0; col < p; col++) {
            for (let row = 0; row < p; row++) {
              const outer = col === p - 1 || row === p - 1;
              dots.push(<circle key={`s${col}-${row}`} cx={bx + col * S + S / 2} cy={base - row * S} r={RAD} className={outer ? "fill-accent" : "fill-brand"} />);
            }
          }
        }
        const mid = x0 + widths[idx] / 2;
        return (
          <g key={`pat${p}`}>
            {dots}
            <text x={mid} y={base + 20} fontSize={10} textAnchor="middle" className="fill-ink-2">
              n = {p}
            </text>
            <text x={mid} y={base + 34} fontSize={12} fontWeight={800} textAnchor="middle" className="fill-ink">
              {count(p)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- small pieces ---------------- */

function TermBox({ label, children, hit, ghost }: { label: string; children: ReactNode; hit?: boolean; ghost?: boolean }) {
  const tone = hit ? "border-good bg-good-soft" : ghost ? "border-dashed border-accent bg-surface" : "border-line bg-surface";
  return (
    <div className={`min-w-[2.75rem] rounded-lg border-2 px-2 py-1 text-center ${tone}`}>
      <div className={`text-[10px] font-bold ${ghost ? "text-accent" : "text-ink-2"}`}>{label}</div>
      <div className="font-extrabold tabular-nums text-ink">{children}</div>
    </div>
  );
}

function StepArrow({ children }: { children?: ReactNode }) {
  return (
    <span className="flex flex-col items-center px-0.5 leading-none">
      <span className="min-h-[14px] text-[11px] font-bold text-brand">{children}</span>
      <span aria-hidden className="text-sm text-ink-2">
        →
      </span>
    </span>
  );
}

interface SeqPreset {
  label: string;
  kind: Kind;
  a?: number;
  d?: number;
  r?: RKey;
  b?: number;
  c?: number;
  k: string;
}

const SEQ_PRESETS: SeqPreset[] = [
  { label: "4, 7, 10, … (matchsticks)", kind: "arith", a: 4, d: 3, k: "100" },
  { label: "23, 18, 13, …", kind: "arith", a: 23, d: -5, k: "−2" },
  { label: "2, 2.5, 3, …", kind: "arith", a: 2, d: 0.5, k: "10" },
  { label: "3, 6, 12, … (doubling)", kind: "geo", a: 3, r: "2", k: "96" },
  { label: "64, 32, 16, …", kind: "geo", a: 64, r: "1/2", k: "1/4" },
  { label: "Fibonacci", kind: "fib", a: 1, b: 1, k: "144" },
  { label: "Square numbers", kind: "quad", c: 0, k: "50" },
];

const JUMP_MAX: Record<Kind, number> = { arith: 100, quad: 100, geo: 20, fib: 40 };

function SequenceExplorer() {
  const [kind, setKind] = useState<Kind>("arith");
  const [a, setA] = useState(4);
  const [d, setD] = useState(3);
  const [quarters, setQuarters] = useState(false);
  const [ga, setGa] = useState(3);
  const [rKey, setRKey] = useState<RKey>("2");
  const [f1, setF1] = useState(1);
  const [f2, setF2] = useState(1);
  const [c, setC] = useState(0);
  const [view, setView] = useState<View>("graph");
  const [kText, setKText] = useState("100");
  const [jump, setJump] = useState(100);
  const verdictId = useId();

  const seq: Seq = {
    kind,
    a: kind === "arith" ? q(Math.round(a * 4), 4) : kind === "geo" ? q(ga) : q(f1),
    d: q(Math.round(d * 4), 4),
    r: RATIOS[rKey],
    b: q(f2),
    c: q(c),
  };
  const dec = kind !== "geo";
  const terms = seqTerms(seq, SHOW);
  const zero = kind === "arith" ? qSub(seq.a, seq.d) : null;
  const diffs = terms.slice(1).map((t, i) => qSub(t, terms[i]));
  const diffs2 = diffs.slice(1).map((t, i) => qSub(t, diffs[i]));
  const constDiff = diffs.every((x) => qEq(x, diffs[0]));

  // the "is it a term?" checker
  const kq = parseQ(kText);
  const kOk = kq !== null && Math.abs(qVal(kq)) <= 1e9;
  const verdict = kOk && kq ? checkTerm(seq, kq) : null;
  const hits = verdict ? verdict.positions.filter((p) => p <= SHOW) : [];

  // jump straight to term N
  const jmax = JUMP_MAX[kind];
  const N = Math.min(jump, jmax);
  const termN = termAt(seq, N);

  // dot picture availability
  const dotsOk =
    kind === "arith"
      ? zero !== null && seq.d.d === 1 && seq.d.n >= 1 && zero.d === 1 && zero.n >= 0 && zero.n <= 12
      : kind === "quad" && c >= 0 && c <= 12;
  const canPicture = kind === "arith" || kind === "quad";
  const showDots = canPicture && view === "dots" && dotsOk;

  const applyPreset = (p: SeqPreset) => {
    setKind(p.kind);
    if (p.kind === "arith") {
      const frac = !Number.isInteger(p.a ?? 0) || !Number.isInteger(p.d ?? 0);
      setQuarters(frac);
      setA(p.a ?? 0);
      setD(p.d ?? 1);
    } else if (p.kind === "geo") {
      setGa(p.a ?? 1);
      setRKey(p.r ?? "2");
    } else if (p.kind === "fib") {
      setF1(p.a ?? 1);
      setF2(p.b ?? 1);
    } else setC(p.c ?? 0);
    setKText(p.k);
  };

  const stepA = quarters ? 0.25 : 1;
  const arrowLabel = (i: number): ReactNode => {
    if (kind === "arith") return <Signed v={seq.d} />;
    if (kind === "geo") return <>×{seq.r.d !== 1 ? <M>{qMark(seq.r)}</M> : seq.r.n < 0 ? `(${minus(String(seq.r.n))})` : String(seq.r.n)}</>;
    if (kind === "quad") return <Signed v={diffs[i - 1]} />;
    return null;
  };

  // ---- nth-term panel ----
  let rulePanel: ReactNode;
  let jumpWork: ReactNode;
  if (kind === "arith" && zero) {
    const nth = linMark(seq.d, zero, "n", true);
    const alt = seq.d.n < 0 && zero.n > 0 ? ` (or ${qNice(zero)} − ${coefTerm(qAbs(seq.d), "n", true)})` : "";
    const cPart = zero.n === 0 ? "" : ` ${zero.n > 0 ? "+" : "-"} ${qNice(qAbs(zero))}`;
    rulePanel = (
      <>
        <p className="font-bold text-ink">Find the nth term with the zero term</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            Common difference d = <Signed v={seq.d} />. This is the number in front of n.
          </li>
          <li>
            Zero term (one step before the first) = first term − d = <M>{`${qNice(seq.a)} - ${paren(qNice(seq.d))} = ${qNice(zero)}`}</M>.
          </li>
          <li>
            nth term = <strong className="text-ink">
              <M>{nth}</M>
            </strong>
            {alt ? <> {minus(alt)}</> : null}
          </li>
          <li>
            Check with n = 2: <M>{`${paren(qNice(seq.d))} * 2${cPart} = ${qNice(terms[1])}`}</M> ✓ (the 2nd term)
          </li>
        </ol>
      </>
    );
    jumpWork = (
      <>
        = <M>{`${paren(qNice(seq.d))} * ${N}${cPart}`}</M>
      </>
    );
  } else if (kind === "geo") {
    const rM = seq.r.n < 0 || seq.r.d !== 1 ? `(${qMark(seq.r)})` : qMark(seq.r);
    rulePanel = (
      <>
        <p className="font-bold text-ink">Geometric: multiply by the same number each time</p>
        <p className="mt-1">
          Term-to-term rule: × <M>{qMark(seq.r)}</M>. To reach term n you multiply the first term by <M>{qMark(seq.r)}</M>, n − 1 times, so the nth term is{" "}
          <strong className="text-ink">
            <M>{`${seq.a.n} * ${rM}^(n-1)`}</M>
          </strong>{" "}
          <span className="text-xs">(a look-ahead to Year 9)</span>.
        </p>
      </>
    );
    jumpWork = (
      <>
        = <M>{`${seq.a.n} * ${rM}^(${N - 1})`}</M>
      </>
    );
  } else if (kind === "fib") {
    rulePanel = (
      <>
        <p className="font-bold text-ink">Fibonacci-type: add the two terms before</p>
        <p className="mt-1">
          Term-to-term rule: <M>{"T_(n+2) = T_n + T_(n+1)"}</M>. You need <strong>two</strong> starting terms, and there is no simple nth-term rule at this level —
          to reach a far-off term you build every term before it.
        </p>
      </>
    );
    jumpWork = <>(found by building every term up to it)</>;
  } else {
    rulePanel = (
      <>
        <p className="font-bold text-ink">Quadratic: square the position, then adjust</p>
        <p className="mt-1">
          nth term = <strong className="text-ink">
            <M>{quadMark(seq.c)}</M>
          </strong>
          . The first differences change, but the <strong>second</strong> differences are always 2 — the fingerprint of <M>{"n^2"}</M>.
        </p>
      </>
    );
    jumpWork = (
      <>
        = <M>{`${N}^2${seq.c.n === 0 ? "" : ` ${seq.c.n > 0 ? "+" : "-"} ${qNice(qAbs(seq.c))}`}`}</M>
      </>
    );
  }

  // ---- live caption ----
  let caption: ReactNode;
  if (kind === "arith" && zero) {
    if (seq.d.n === 0) {
      caption = (
        <>
          A difference of 0 makes every term <QV v={seq.a} />: the points on the graph sit on a flat line. It is still linear — its nth term is just <QV v={seq.a} />.
        </>
      );
    } else {
      const up = seq.d.n > 0;
      caption = (
        <>
          Each term is <QV v={qAbs(seq.d)} /> {up ? "more" : "less"} than the one before, so the points on the graph go {up ? "up" : "down"} in equal steps and sit on a{" "}
          <strong>straight line</strong> — a <strong>linear</strong> (arithmetic) sequence. Step back once from the first term and you reach the{" "}
          <strong>zero term</strong>, <QV v={zero} />, where the line meets the vertical axis. Term n is the zero term plus n lots of <Signed v={seq.d} />, so the
          nth term is <M>{linMark(seq.d, zero, "n", true)}</M>.
          {up ? "" : " A decreasing sequence has a negative coefficient of n."}
          {seq.d.d !== 1 || zero.d !== 1 ? " Decimals and fractions change nothing: the method is exactly the same." : ""}
        </>
      );
    }
  } else if (kind === "geo") {
    const shape =
      rKey === "-2"
        ? "flip between positive and negative, so the points zig-zag further and further from 0"
        : rKey === "1/2"
          ? "halve each time, curving down towards 0 but never reaching it"
          : "curve upwards faster and faster";
    caption = (
      <>
        Each term is <M>{qMark(seq.r)}</M> times the one before: a <strong>geometric</strong> sequence. The differences are not constant, so it is{" "}
        <strong>not</strong> linear — the terms {shape}.
        {rKey === "2" ? " Doubling looks slow at first, but term 21 is already over a million times the first term (2²⁰ = 1,048,576)." : ""}
        {rKey === "3" ? " Tripling grows faster still: term 11 is 59,049 times the first term (3¹⁰)." : ""}
      </>
    );
  } else if (kind === "fib") {
    const all = seqTerms(seq, 20);
    const t19 = all[18];
    const t20 = all[19];
    const ratio = t19.n !== 0 ? qVal(t20) / qVal(t19) : null;
    caption =
      f1 === 0 && f2 === 0 ? (
        <>
          Each term is the <strong>sum of the two before it</strong>, so you need two starting terms. Starting from 0 and 0, every term is 0 + 0 = 0 — the one
          start that goes nowhere. Change either starting number and watch the terms take off.
        </>
      ) : (
        <>
          Each term is the <strong>sum of the two before it</strong>, so you need two starting terms. Look at the differences: apart from the first, they are
          the terms of the sequence again, shifted one place along. Sooner or later the terms grow further and further from 0, but not by a fixed amount or a
          fixed multiplier.
          {ratio !== null ? (
            <>
              {" "}
              Divide each term by the one before: by term 20 the ratio is {ratio.toFixed(6)}, close to the <strong>golden ratio</strong> 1.618… — whatever two
              whole numbers you start with (as long as they are not both 0).
            </>
          ) : null}
        </>
      );
  } else {
    caption = (
      <>
        The first differences are <span className="tabular-nums">{diffs.slice(0, 4).map((x) => minus(`${x.n >= 0 ? "+" : ""}${x.n}`)).join(", ")}, …</span>:
        they go up by 2 every time. A constant <strong>second</strong> difference of 2 is the fingerprint of <M>{"n^2"}</M> — the square numbers grow by the odd
        numbers 3, 5, 7, … (the orange L-shapes in the dot picture).{" "}
        {c !== 0 ? (
          <>
            Adding {minus(String(c))} slides every term {c > 0 ? "up" : "down"} by {Math.abs(c)} but leaves the differences unchanged.
          </>
        ) : null}
      </>
    );
  }

  const KIND_OPTIONS: { value: Kind; label: ReactNode }[] = [
    { value: "arith", label: "+ d" },
    { value: "geo", label: "× r" },
    { value: "fib", label: "Fibonacci" },
    { value: "quad", label: <M>{"n^2 + c"}</M> },
  ];

  return (
    <WidgetFrame
      title="Sequence explorer"
      tryThis={[
        "Make 23, 18, 13, 8, … Predict its zero term and nth term before you look.",
        "Is 100 a term of 4, 7, 10, …? What about 5, 8, 11, …? Predict, then type 100 into the checker.",
        "Start with 3, 6 twice: once by adding 3, once by doubling. Which sequence passes 100 first, and at which term?",
        "Square numbers: what do the differences of the differences always come to? Does changing c alter that?",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example sequences">
          {SEQ_PRESETS.map((p) => (
            <button key={p.label} type="button" className="btn btn-secondary btn-sm" onClick={() => applyPreset(p)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-ink-2">Rule type</div>
          <Segmented<Kind> label="Rule type" value={kind} onChange={setKind} options={KIND_OPTIONS} />
        </div>

        {/* parameters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {kind === "arith" ? (
            <>
              <NudgeSlider name="First term" label="First term" value={a} min={-20} max={30} step={stepA} onChange={setA} />
              <NudgeSlider
                name="Common difference"
                label="Common difference d"
                value={d}
                min={-6}
                max={6}
                step={stepA}
                onChange={setD}
                format={(v) => (v > 0 ? `+${fmt(v)}` : fmt(v))}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-ink-2 sm:col-span-2">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={quarters}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setQuarters(on);
                    if (!on) {
                      setA(Math.round(a));
                      setD(Math.round(d));
                    }
                  }}
                />
                Allow decimals (steps of 0.25)
              </label>
            </>
          ) : null}
          {kind === "geo" ? (
            <>
              <NudgeSlider name="First term" label="First term" value={ga} min={1} max={100} onChange={setGa} />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-ink-2">Multiply by (common ratio r)</div>
                <Segmented<RKey>
                  label="Common ratio"
                  value={rKey}
                  onChange={setRKey}
                  options={[
                    { value: "2", label: "× 2" },
                    { value: "3", label: "× 3" },
                    {
                      value: "1/2",
                      label: (
                        <>
                          × <M>{"1/2"}</M>
                        </>
                      ),
                    },
                    { value: "-2", label: "× (−2)" },
                  ]}
                />
              </div>
            </>
          ) : null}
          {kind === "fib" ? (
            <>
              <NudgeSlider name="First term" label="First term" value={f1} min={-10} max={20} onChange={setF1} />
              <NudgeSlider name="Second term" label="Second term" value={f2} min={-10} max={20} onChange={setF2} />
            </>
          ) : null}
          {kind === "quad" ? <NudgeSlider name="c" label={<>c in <M>{"n^2 + c"}</M></>} value={c} min={-10} max={10} onChange={setC} /> : null}
        </div>

        {/* the terms */}
        <div className="flex flex-wrap items-end gap-x-0.5 gap-y-2" role="group" aria-label="The first terms of the sequence">
          {zero ? (
            <>
              <TermBox label="n = 0" ghost>
                <QV v={zero} />
              </TermBox>
              <StepArrow>
                <Signed v={seq.d} />
              </StepArrow>
            </>
          ) : null}
          {terms.map((t, i) => (
            <Fragment key={`t${i}`}>
              {i > 0 ? <StepArrow>{arrowLabel(i)}</StepArrow> : null}
              <TermBox label={`n = ${i + 1}`} hit={hits.includes(i + 1)}>
                <QV v={t} dec={dec} />
              </TermBox>
            </Fragment>
          ))}
          <span className="self-center px-1 font-bold text-ink-2">…</span>
        </div>
        {zero ? <p className="-mt-2 text-xs text-ink-2">The dashed box is the zero term: not part of the sequence, but the key to its nth term.</p> : null}

        {/* differences */}
        <div className="space-y-1.5 text-sm text-ink-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold">1st differences:</span>
            {diffs.map((x, i) => (
              <span key={`d${i}`} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-bold tabular-nums text-ink">
                <Signed v={x} dec={dec} />
              </span>
            ))}
            <span className={`font-bold ${constDiff ? "text-good" : "text-bad"}`}>{constDiff ? "constant → linear" : "not constant → not linear"}</span>
          </div>
          {kind === "quad" ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold">2nd differences:</span>
              {diffs2.map((x, i) => (
                <span key={`dd${i}`} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-bold tabular-nums text-ink">
                  <Signed v={x} />
                </span>
              ))}
              <span className="font-bold text-good">constant → quadratic</span>
            </div>
          ) : null}
          {kind === "geo" ? (
            <p>
              <span className="font-semibold">Each term ÷ the one before:</span> <M>{qMark(seq.r)}</M> every time →{" "}
              <span className="font-bold text-good">geometric</span>
            </p>
          ) : null}
        </div>

        {/* graph or dot picture */}
        {canPicture ? (
          <Segmented<View>
            label="Show the sequence as"
            value={view}
            onChange={setView}
            options={[
              { value: "graph", label: "Graph" },
              { value: "dots", label: "Dot picture" },
            ]}
          />
        ) : null}
        {showDots ? (
          <div>
            <DotPicture kind={kind === "quad" ? "quad" : "arith"} d={seq.d.n} c={kind === "quad" ? c : (zero?.n ?? 0)} />
            <p className="text-xs text-ink-2">
              {kind === "arith" ? (
                <>
                  {zero && zero.n !== 0
                    ? `Grey dots: the zero term (${intText(zero.n)}) — the part that never changes.`
                    : "The zero term is 0, so there are no grey dots."}{" "}
                  Each coloured column adds {intText(seq.d.n)} more, so pattern n has <M>{linMark(seq.d, zero ?? q(0), "n", true)}</M> dots.
                </>
              ) : (
                <>
                  Pattern n is an n × n square{c > 0 ? ` plus ${c} grey ${c === 1 ? "dot" : "dots"}` : ""}. The orange L is what was added: 1, 3, 5, 7, … — the odd numbers.
                </>
              )}
            </p>
          </div>
        ) : (
          <>
            {canPicture && view === "dots" ? (
              <p className="rounded-xl bg-surface-2 p-2 text-xs text-ink-2">
                {kind === "arith"
                  ? "The dot picture needs a whole-number difference from 1 to 6 and a zero term from 0 to 12. Showing the graph instead."
                  : "The dot picture needs c to be 0 or more. Showing the graph instead."}
              </p>
            ) : null}
            <SeqGraph seq={seq} terms={terms} zero={zero} kv={kOk && kq ? qVal(kq) : null} hits={hits} />
          </>
        )}

        {/* rule + jump */}
        <div className="rounded-xl border border-line p-3 text-sm text-ink-2">
          {rulePanel}
          <div className="mt-3 space-y-2 border-t border-line pt-3">
            <NudgeSlider name="Jump to term" label="Jump straight to term number" value={N} min={1} max={jmax} onChange={setJump} />
            <div className="flex flex-wrap items-center gap-3">
              <Readout label={`Term ${N}`} value={<QV v={termN} dec={dec} />} />
              <span>{jumpWork}</span>
            </div>
          </div>
        </div>

        {/* is it a term? */}
        <div className="rounded-xl border border-line p-3 text-sm">
          <label className="flex flex-wrap items-center gap-2 font-bold text-ink">
            Is this number a term?
            <input
              type="text"
              inputMode="decimal"
              value={kText}
              onChange={(e) => setKText(e.target.value)}
              className="h-10 w-32 rounded-lg border border-line bg-surface px-2 text-base font-bold tabular-nums text-ink"
              aria-describedby={verdictId}
            />
          </label>
          <div id={verdictId} aria-live="polite" className="mt-2">
            {!kOk ? (
              <p className="text-ink-2">
                {kq === null ? "Type a number, e.g. 100, −7, 2.5 or 7/2." : "Keep the number between −1,000,000,000 and 1,000,000,000."}
              </p>
            ) : verdict ? (
              <div className={`rounded-lg p-2 ${verdict.yes ? "bg-good-soft" : "bg-surface-2"}`}>
                {verdict.working.map((w, i) => (
                  <div key={`w${i}`} className="tabular-nums text-ink">
                    <M>{w}</M>
                  </div>
                ))}
                <p className={`mt-1 font-semibold ${verdict.yes ? "text-good" : "text-ink"}`}>
                  {verdict.yes ? "✓ Yes. " : "✗ No. "}
                  {verdict.note}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

/* ======================================================================== */
/* 2. Function machine                                                       */
/* ======================================================================== */

type Op = "+" | "-" | "*" | "/";
type FMode = "fwd" | "back" | "mystery";

interface Step {
  op: Op;
  /** Index into VALS. */
  v: number;
}

const VALS: Q[] = [q(1, 4), q(1, 3), q(1, 2), q(2, 3), q(3, 4), q(1), q(3, 2), ...Array.from({ length: 11 }, (_, i) => q(i + 2))];
const vi = (n: number, d = 1) => VALS.findIndex((x) => qEq(x, q(n, d)));
const OPS: Op[] = ["+", "-", "*", "/"];
const SYM: Record<Op, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const SYM_MARK: Record<Op, string> = { "+": "+", "-": "-", "*": "*", "/": "÷" };
const INV: Record<Op, Op> = { "+": "-", "-": "+", "*": "/", "/": "*" };

function applyStep(x: Q, s: Step): Q {
  const v = VALS[s.v];
  if (s.op === "+") return qAdd(x, v);
  if (s.op === "-") return qSub(x, v);
  if (s.op === "*") return qMul(x, v);
  return qDiv(x, v);
}
const runSteps = (x: Q, steps: Step[]) => steps.reduce(applyStep, x);
const invStep = (s: Step): Step => ({ op: INV[s.op], v: s.v });
const stepMark = (s: Step) => `${SYM_MARK[s.op]} ${qMark(VALS[s.v], false)}`;
const stepPlain = (s: Step) => `${SYM[s.op]} ${qPlain(VALS[s.v])}`;

/** The machine as one linear map x → m·x + c. */
function linOf(steps: Step[]): { m: Q; c: Q } {
  let m = q(1);
  let c = q(0);
  for (const s of steps) {
    const v = VALS[s.v];
    if (s.op === "+") c = qAdd(c, v);
    else if (s.op === "-") c = qSub(c, v);
    else if (s.op === "*") {
      m = qMul(m, v);
      c = qMul(c, v);
    } else {
      m = qDiv(m, v);
      c = qDiv(c, v);
    }
  }
  return { m, c };
}

/** The expression "as built" (keeps brackets where the order forces them): mult × (inner) + add. */
interface Built {
  inner: Built | null;
  mult: Q;
  add: Q;
}

function builtOf(steps: Step[]): Built {
  let b: Built = { inner: null, mult: q(1), add: q(0) };
  for (const s of steps) {
    const v = VALS[s.v];
    if (s.op === "+") b = { ...b, add: qAdd(b.add, v) };
    else if (s.op === "-") b = { ...b, add: qSub(b.add, v) };
    else {
      const f = s.op === "*" ? v : qDiv(q(1), v);
      b = b.add.n === 0 ? { ...b, mult: qMul(b.mult, f) } : { inner: b, mult: f, add: q(0) };
    }
  }
  return b;
}

function builtMark(b: Built, v = "x"): string {
  let core: string;
  if (b.inner === null) core = coefTerm(b.mult, v, false);
  else {
    const inner = builtMark(b.inner, v);
    const m = b.mult;
    if (isOne(m)) core = inner;
    else if (m.d === 1) core = `${m.n}(${inner})`;
    else if (m.n === 1) core = `(${inner})/${m.d}`;
    else core = `${m.n}/${m.d} (${inner})`;
  }
  if (b.add.n === 0) return core;
  return `${core} ${b.add.n > 0 ? "+" : "-"} ${qMark(qAbs(b.add), false)}`;
}

const MYSTERIES: Step[][] = [
  [
    { op: "*", v: vi(3) },
    { op: "+", v: vi(2) },
  ],
  [
    { op: "*", v: vi(2) },
    { op: "-", v: vi(5) },
  ],
  [
    { op: "+", v: vi(4) },
    { op: "*", v: vi(3) },
  ],
  [
    { op: "/", v: vi(2) },
    { op: "+", v: vi(3) },
  ],
  [
    { op: "-", v: vi(1) },
    { op: "*", v: vi(5) },
  ],
  [
    { op: "*", v: vi(4) },
    { op: "-", v: vi(7) },
  ],
  [
    { op: "+", v: vi(2) },
    { op: "/", v: vi(2) },
  ],
  [
    { op: "*", v: vi(6) },
    { op: "+", v: vi(10) },
  ],
];

/** One value in a box (with an optional tag underneath). */
function ValBox({ v, tag, tone = "ink" }: { v: Q; tag?: string; tone?: "ink" | "good" }) {
  return (
    <div className={`min-w-[3rem] rounded-lg border-2 px-2 py-1 text-center ${tone === "good" ? "border-good bg-good-soft" : "border-line bg-surface"}`}>
      <div className="text-base font-extrabold tabular-nums text-ink">
        <QV v={v} dec={false} />
      </div>
      {tag ? <div className="text-[10px] font-bold uppercase tracking-wide text-ink-2">{tag}</div> : null}
    </div>
  );
}

/** start → [step] → value → [step] → … */
function Pipeline({ start, steps, startTag, endTag }: { start: Q; steps: Step[]; startTag: string; endTag: string }) {
  const vals: Q[] = [start];
  for (const s of steps) vals.push(applyStep(vals[vals.length - 1], s));
  const aria = `${startTag} ${qPlain(start)}${steps.map((s, i) => `, ${stepPlain(s)} gives ${qPlain(vals[i + 1])}`).join("")}.`;
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={aria}>
      <ValBox v={start} tag={startTag} />
      {steps.map((s, i) => (
        <Fragment key={`s${i}`}>
          <span aria-hidden className="text-ink-2">
            →
          </span>
          <span className="rounded-lg bg-brand-soft px-2 py-1.5 text-sm font-extrabold text-brand">
            <M>{stepMark(s)}</M>
          </span>
          <span aria-hidden className="text-ink-2">
            →
          </span>
          <ValBox v={vals[i + 1]} tag={i === steps.length - 1 ? endTag : undefined} tone={i === steps.length - 1 ? "good" : "ink"} />
        </Fragment>
      ))}
    </div>
  );
}

/** A fraction drawn inside an SVG (stacked), or a whole number. */
function SvgQ({ v, x, y }: { v: Q; x: number; y: number }) {
  if (v.d === 1) {
    return (
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-ink">
        {intText(v.n)}
      </text>
    );
  }
  const n = Math.abs(v.n);
  const whole = Math.floor(n / v.d);
  const rem = n % v.d;
  const lead = `${v.n < 0 ? "−" : ""}${whole ? whole : ""}`;
  const leadW = lead.length * 7.5;
  const fw = Math.max(String(rem).length, String(v.d).length) * 6.5 + 4;
  const total = leadW + (leadW ? 2 : 0) + fw;
  const x0 = x - total / 2;
  const fx = x0 + total - fw / 2;
  return (
    <g>
      {lead ? (
        <text x={x0 + leadW} y={y + 4.5} textAnchor="end" fontSize={13} fontWeight={700} className="fill-ink">
          {lead}
        </text>
      ) : null}
      <text x={fx} y={y - 2} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-ink">
        {rem}
      </text>
      <line x1={x0 + total - fw} x2={x0 + total} y1={y + 1} y2={y + 1} className="stroke-ink" strokeWidth={1} />
      <text x={fx} y={y + 11} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-ink">
        {v.d}
      </text>
    </g>
  );
}

/** Mapping diagram for inputs 0–4: every input gets exactly one arrow. */
function MappingDiagram({ steps }: { steps: Step[] }) {
  const ins = [0, 1, 2, 3, 4];
  const outs = ins.map((x) => runSteps(q(x), steps));
  const ys = ins.map((_, i) => 36 + i * 30);
  const aria = `Mapping diagram: ${ins.map((x, i) => `${x} maps to ${qPlain(outs[i])}`).join(", ")}. Each input has exactly one arrow, so this is a function.`;
  return (
    <svg viewBox="0 0 360 178" className="h-auto w-full" role="img" aria-label={aria}>
      <text x={70} y={12} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-ink-2">
        input x
      </text>
      <text x={290} y={12} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-ink-2">
        output f(x)
      </text>
      <ellipse cx={70} cy={96} rx={38} ry={78} className="fill-surface-2 stroke-line" strokeWidth={1.5} />
      <ellipse cx={290} cy={96} rx={52} ry={78} className="fill-surface-2 stroke-line" strokeWidth={1.5} />
      {ins.map((x, i) => (
        <g key={`m${x}`}>
          <line x1={92} x2={226} y1={ys[i]} y2={ys[i]} className="stroke-brand" strokeWidth={1.8} />
          <polygon points={`${234},${ys[i]} ${225},${ys[i] - 4.5} ${225},${ys[i] + 4.5}`} className="fill-brand" />
          <text x={70} y={ys[i] + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-ink">
            {x}
          </text>
          <SvgQ v={outs[i]} x={290} y={ys[i]} />
        </g>
      ))}
    </svg>
  );
}

function StepEditor({ i, step, onChange }: { i: number; step: Step; onChange: (s: Step) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line p-2">
      <span className="w-14 text-sm font-bold text-ink-2">Step {i + 1}</span>
      <Segmented<Op> label={`Step ${i + 1} operation`} value={step.op} onChange={(op) => onChange({ ...step, op })} options={OPS.map((o) => ({ value: o, label: SYM[o] }))} />
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="kbd h-10 min-w-10"
          aria-label={`Step ${i + 1}: smaller number`}
          disabled={step.v <= 0}
          onClick={() => onChange({ ...step, v: step.v - 1 })}
        >
          −
        </button>
        <span className="min-w-[3.5ch] text-center text-lg font-extrabold tabular-nums text-ink">
          <M>{qMark(VALS[step.v], false)}</M>
        </span>
        <button
          type="button"
          className="kbd h-10 min-w-10"
          aria-label={`Step ${i + 1}: bigger number`}
          disabled={step.v >= VALS.length - 1}
          onClick={() => onChange({ ...step, v: step.v + 1 })}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepsInline({ steps }: { steps: Step[] }) {
  return (
    <>
      {steps.map((s, i) => (
        <Fragment key={`i${i}`}>
          {i ? ", then " : ""}
          <M>{stepMark(s)}</M>
        </Fragment>
      ))}
    </>
  );
}

function FunctionMachine() {
  const [mode, setMode] = useState<FMode>("fwd");
  const [steps, setSteps] = useState<Step[]>([
    { op: "*", v: vi(4) },
    { op: "-", v: vi(3) },
    { op: "/", v: vi(2) },
  ]);
  const [count, setCount] = useState(2);
  const [x, setX] = useState(5);
  const [y, setY] = useState(17);
  const [secret, setSecret] = useState(0);
  const [log, setLog] = useState<number[]>([]);
  const [probe, setProbe] = useState(0);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const active = steps.slice(0, count);
  const lin = linOf(active);
  const builtStr = builtMark(builtOf(active));
  const simpStr = linMark(lin.m, lin.c, "x", false);
  const differs = builtStr.replace(/\s/g, "") !== simpStr.replace(/\s/g, "");
  const hasFracMulDiv = active.some((s) => (s.op === "*" || s.op === "/") && VALS[s.v].d !== 1);

  const setStep = (i: number, s: Step) => {
    setSteps((prev) => prev.map((p, j) => (j === i ? s : p)));
    setChecked(false);
  };
  const changeCount = (v: string) => {
    setCount(Number(v));
    setChecked(false);
  };

  // forwards
  const out = runSteps(q(x), active);
  const swapped = [...active].reverse();
  const swappedLin = linOf(swapped);
  const sameWhenSwapped = qEq(swappedLin.m, lin.m) && qEq(swappedLin.c, lin.c);
  /** Has both a + / − step and a × / ÷ step that actually changes the number. */
  const mixesOps = active.some((s) => s.op === "+" || s.op === "-") && active.some((s) => (s.op === "*" || s.op === "/") && !isOne(VALS[s.v]));

  // backwards
  const inv = [...active].reverse().map(invStep);
  const xBack = runSteps(q(y), inv);
  const invStr = builtMark(builtOf(inv));

  // mystery
  const secretSteps = MYSTERIES[secret];
  const secretLin = linOf(secretSteps);
  const solved = qEq(secretLin.m, lin.m) && qEq(secretLin.c, lin.c);
  const sameSteps = active.length === secretSteps.length && active.every((s, i) => s.op === secretSteps[i].op && s.v === secretSteps[i].v);
  const mismatch = log.find((t) => !qEq(runSteps(q(t), active), runSteps(q(t), secretSteps)));
  const feed = () => {
    setLog((prev) => [...prev.filter((t) => t !== probe), probe].slice(-8));
    setChecked(false);
  };
  const newMystery = () => {
    let r = Math.floor(Math.random() * (MYSTERIES.length - 1));
    if (r >= secret) r++;
    setSecret(r);
    setLog([]);
    setChecked(false);
    setRevealed(false);
  };

  let panel: ReactNode;
  let caption: ReactNode;

  if (mode === "fwd") {
    panel = (
      <div className="space-y-3">
        <NudgeSlider name="Input" label="Input x" value={x} min={-20} max={20} onChange={setX} />
        <Pipeline start={q(x)} steps={active} startTag="input" endTag="output" />
        <div className="rounded-xl bg-surface-2 p-3 text-sm text-ink">
          <p>
            <M>{`f(x) = ${builtStr}`}</M>
            {differs ? (
              <>
                {" "}
                = <M>{simpStr}</M>
              </>
            ) : null}
          </p>
          <p className="mt-1">
            <M>{`f(${x}) = ${qMark(out)}`}</M>
          </p>
        </div>
        <MappingDiagram steps={active} />
      </div>
    );
    caption = (
      <>
        The machine does <StepsInline steps={active} />, so an input x comes out as <M>{builtStr}</M>
        {differs ? (
          <>
            , which simplifies to <M>{simpStr}</M>
          </>
        ) : null}
        . Every input gives exactly <strong>one</strong> output — that is what makes it a <strong>function</strong>.{" "}
        {count >= 2 ? (
          sameWhenSwapped ? (
            mixesOps ? (
              <>
                Here the steps in reverse order happen to give the same function — a coincidence of these particular numbers. Change one of them and the order
                will usually matter.
              </>
            ) : (
              <>Here the order doesn’t matter: the steps in reverse order give the same function. Mix a × (by anything except 1) with a + and the order usually matters.</>
            )
          ) : (
            <>
              <strong>Order matters:</strong> the same steps in reverse order give <M>{builtMark(builtOf(swapped))}</M>, so input {minus(String(x))} would give{" "}
              <QV v={runSteps(q(x), swapped)} dec={false} /> instead of <QV v={out} dec={false} />.
            </>
          )
        ) : null}{" "}
        Feed in 1, 2, 3, … and the outputs go up by <QV v={lin.m} dec={false} /> each time: they form the linear sequence with nth term{" "}
        <M>{linMark(lin.m, lin.c, "n", false)}</M>.
      </>
    );
  } else if (mode === "back") {
    panel = (
      <div className="space-y-3">
        <NudgeSlider name="Output" label="Output you want" value={y} min={-30} max={60} onChange={setY} />
        <div className="text-sm text-ink-2">
          The machine: <StepsInline steps={active} />. Undo it <strong>last step first</strong>:
        </div>
        <Pipeline start={q(y)} steps={inv} startTag="output" endTag="input" />
        <div className="grid grid-cols-2 gap-2">
          <Readout label="Output" value={<QV v={q(y)} dec={false} />} tone="ink" />
          <Readout label="Input (answer)" value={<QV v={xBack} dec={false} />} tone="good" />
        </div>
        <div className="rounded-xl bg-surface-2 p-3 text-sm text-ink">
          <p>
            Check forwards: <M>{`f(${qMark(xBack)}) = ${y}`}</M> ✓
          </p>
          <p className="mt-1 text-ink-2">
            Inverse function <span className="text-xs">(look-ahead)</span>: <M>{`f^(-1)(x) = ${invStr}`}</M>
          </p>
        </div>
      </div>
    );
    caption = (
      <>
        To find an input, run the machine <strong>backwards</strong>: undo the <strong>last</strong> step first, using inverse operations (+ ↔ −, × ↔ ÷) — like
        taking off your shoes before your socks. Here that is <StepsInline steps={inv} />, which turns {minus(String(y))} back into <QV v={xBack} dec={false} />.
        {hasFracMulDiv ? (
          <>
            {" "}
            Fractions work the same way: dividing by a fraction is multiplying by its reciprocal, e.g. ÷ <M>{"2/3"}</M> is × <M>{"3/2"}</M>.
          </>
        ) : null}
        {xBack.d !== 1 ? " The input does not have to be a whole number — keep it as an exact fraction." : ""} Always check by running your answer forwards.
      </>
    );
  } else {
    const show = revealed || (checked && solved);
    let feedback: ReactNode = null;
    if (checked) {
      if (solved) {
        feedback = (
          <p className="rounded-lg bg-good-soft p-2 font-semibold text-good">
            ✓ Cracked it! The mystery machine is <M>{`f(x) = ${linMark(secretLin.m, secretLin.c, "x", false)}`}</M>.
            {sameSteps ? null : (
              <> Your steps are different from the hidden ones, yet every input gives the same output — so they are the same function.</>
            )}
          </p>
        );
      } else if (mismatch !== undefined) {
        feedback = (
          <p className="rounded-lg bg-bad-soft p-2 font-semibold text-ink">
            Not yet: input {minus(String(mismatch))} gives <QV v={runSteps(q(mismatch), active)} dec={false} /> on your machine but{" "}
            <QV v={runSteps(q(mismatch), secretSteps)} dec={false} /> on the mystery machine.
          </p>
        );
      } else {
        feedback = (
          <p className="rounded-lg bg-surface-2 p-2 font-semibold text-ink">
            {log.length === 0
              ? "Test the mystery machine first: feed in a few inputs."
              : "Your machine fits your one test — but lots of different machines fit one test. Feed in another input."}
          </p>
        );
      }
    }
    panel = (
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-dashed border-brand p-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-2">Mystery machine (2 hidden steps)</div>
          <div className="mt-1 text-lg font-extrabold text-brand">
            {show ? (
              <>
                x → <StepsInline steps={secretSteps} />
              </>
            ) : (
              "x → ? → ? → output"
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[200px] flex-1">
            <NudgeSlider name="Test input" label="Test input" value={probe} min={-10} max={10} onChange={setProbe} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={feed}>
            Feed {minus(String(probe))} in
          </button>
        </div>
        {log.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm tabular-nums">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-ink-2">
                  <th className="p-1">Input</th>
                  <th className="p-1">Mystery output</th>
                  <th className="p-1">Your machine</th>
                </tr>
              </thead>
              <tbody>
                {[...log]
                  .sort((p1, p2) => p1 - p2)
                  .map((t) => {
                    const theirs = runSteps(q(t), secretSteps);
                    const yours = runSteps(q(t), active);
                    const ok = qEq(theirs, yours);
                    return (
                      <tr key={`l${t}`} className="border-t border-line">
                        <td className="p-1 font-bold text-ink">{minus(String(t))}</td>
                        <td className="p-1 font-bold text-brand">
                          <QV v={theirs} dec={false} />
                        </td>
                        <td className={`p-1 font-bold ${ok ? "text-good" : "text-bad"}`}>
                          <QV v={yours} dec={false} /> {ok ? "✓" : "✗"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink-2">No tests yet. Feed in an input to see what comes out.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setChecked(true)}>
            Check my machine
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRevealed(true)}>
            Reveal
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={newMystery}>
            New mystery machine
          </button>
        </div>
        <div aria-live="polite">{feedback}</div>
      </div>
    );
    caption = (
      <>
        Crack the machine like a detective. Feed in 0, 1, 2, 3 in order: the output for 0 gives the <strong>constant</strong>, and the jump from one output to the
        next is the overall <strong>multiplier</strong> — exactly like the zero term and the common difference of a sequence. Then set the steps of your machine
        so it matches, and check it. Two different tests are enough to pin down what a machine like this does; a single test is not.
      </>
    );
  }

  return (
    <WidgetFrame
      title="Function machine"
      tryThis={[
        "Set × 4 then − 3, then swap the two steps. Do the outputs change? By how much?",
        "*Backwards*: the machine × {{2/3}} then + 5 gives 13. Predict the input, then check.",
        "*Mystery*: feed in 0, 1 and 2. What do the outputs tell you about the hidden steps?",
        "Build two *different* machines that make exactly the same function.",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <Segmented<FMode>
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "fwd", label: "Forwards" },
            { value: "back", label: "Backwards" },
            { value: "mystery", label: "Mystery" },
          ]}
        />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-ink">{mode === "mystery" ? "Your guess" : "Your machine"}</span>
            <Segmented<string>
              label="Number of steps"
              value={String(count)}
              onChange={changeCount}
              options={[
                { value: "1", label: "1 step" },
                { value: "2", label: "2 steps" },
                { value: "3", label: "3 steps" },
              ]}
            />
          </div>
          {active.map((s, i) => (
            <StepEditor key={`e${i}`} i={i} step={s} onChange={(ns) => setStep(i, ns)} />
          ))}
        </div>

        {panel}
      </div>
    </WidgetFrame>
  );
}

/* ======================================================================== */

export const widgets: WidgetDef[] = [
  {
    id: "sequence-explorer",
    title: "Sequence explorer",
    blurb: "Build a sequence and watch its terms, differences and graph — then find its nth term and test whether any number belongs.",
    Component: SequenceExplorer,
  },
  {
    id: "function-machine",
    title: "Function machine",
    blurb: "Chain operations, run them forwards and backwards, and crack a mystery machine from its outputs.",
    Component: FunctionMachine,
  },
];
