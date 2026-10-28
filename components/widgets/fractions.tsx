"use client";
// Interactive explorables for the "fractions" topic.
//  1. Fraction wall — a 1-to-12 wall. One fraction: which rows does it land on
//     exactly (equivalent fractions), and what is its simplest form? Two
//     fractions: the rows that hold both are the common denominators, and a
//     number line shows why the order flips for the negatives.
//  2. How many fit? — division as "how many pieces of this size fit into that
//     amount?", with the leftover measured as a fraction of a PIECE (the classic
//     trap), plus the common-denominator and Keep–Change–Flip calculations.
import { useState, type ReactNode } from "react";
import { WidgetFrame, Segmented, Readout, M, type WidgetDef } from "./kit";

/* ------------------------------------------------------------------------ */
/* Exact fraction helpers                                                     */
/* ------------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** A non-negative fraction in lowest terms (d > 0). */
interface Q {
  n: number;
  d: number;
}

function frac(n: number, d: number): Q {
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

/** Maths markup for a fraction in lowest terms: 3, 3/4 or 2 1/4. */
function mixed({ n, d }: Q): string {
  if (d === 1) return String(n);
  if (n > d) return `${Math.floor(n / d)} ${n % d}/${d}`;
  return `${n}/${d}`;
}

/** Markup for n/d exactly as written (whole numbers stay whole). */
function over(n: number, d: number): string {
  if (n === 0) return "0";
  return d === 1 ? String(n) : `${n}/${d}`;
}

/** Plain words for screen readers: "2 and 1/4", "3/4", "5". */
function spoken({ n, d }: Q): string {
  if (d === 1) return String(n);
  if (n > d) return `${Math.floor(n / d)} and ${n % d}/${d}`;
  return `${n}/${d}`;
}

/** "row 8" or "rows 3, 6, 9". */
const rowsText = (ks: number[]) => (ks.length === 1 ? `row ${ks[0]}` : `rows ${ks.join(", ")}`);

/** Join markup terms with " = ", dropping repeats (e.g. "6 = 6"). */
function chain(terms: string[]): string {
  const out: string[] = [];
  for (const t of terms) if (out[out.length - 1] !== t) out.push(t);
  return out.join(" = ");
}

/* ------------------------------------------------------------------------ */
/* Shared controls                                                            */
/* ------------------------------------------------------------------------ */

function Step({ name, value, min, max, onChange }: { name: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${name}: decrease`}
      >
        −
      </button>
      <output className="min-w-[2.5ch] text-center text-xl font-extrabold tabular-nums text-ink" aria-label={`${name}: ${value}`}>
        {value}
      </output>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${name}: increase`}
      >
        +
      </button>
    </div>
  );
}

/** A fraction typed as a numerator stepper over a denominator stepper. */
function FracPicker({
  label,
  swatch,
  n,
  d,
  nMin,
  nMax,
  dMax,
  onN,
  onD,
  extra,
}: {
  label: string;
  swatch?: ReactNode;
  n: number;
  d: number;
  nMin: number;
  nMax: number;
  dMax: number;
  onN: (v: number) => void;
  onD: (v: number) => void;
  extra?: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-line bg-surface p-3">
      <legend className="flex items-center gap-1.5 px-1 text-sm font-bold text-ink-2">
        {swatch}
        {label}
      </legend>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <Step name={`${label} numerator`} value={n} min={nMin} max={nMax} onChange={onN} />
          <div className="h-[3px] w-24 rounded bg-ink" aria-hidden />
          <Step name={`${label} denominator`} value={d} min={1} max={dMax} onChange={onD} />
        </div>
        {extra ? <div className="min-w-0 flex-1 text-lg text-ink">{extra}</div> : null}
      </div>
    </fieldset>
  );
}

/** A stacked fraction drawn in SVG. (x, y) is the middle of the fraction bar. */
function SvgFrac({ x, y, n, d, neg, tone }: { x: number; y: number; n: number; d: number; neg: boolean; tone: "brand" | "accent" }) {
  const fill = tone === "brand" ? "fill-brand" : "fill-accent";
  const stroke = tone === "brand" ? "stroke-brand" : "stroke-accent";
  if (n === 0 || d === 1) {
    return (
      <text x={x} y={y + 4} fontSize={12} fontWeight={800} textAnchor="middle" className={fill}>
        {neg && n !== 0 ? "−" : ""}
        {n === 0 ? 0 : n}
      </text>
    );
  }
  const w = Math.max(String(n).length, String(d).length) * 7 + 4;
  return (
    <g>
      {neg ? (
        <text x={x - w / 2 - 1.5} y={y + 4} fontSize={12} fontWeight={800} textAnchor="end" className={fill}>
          −
        </text>
      ) : null}
      <text x={x} y={y - 3} fontSize={11} fontWeight={800} textAnchor="middle" className={fill}>
        {n}
      </text>
      <line x1={x - w / 2} x2={x + w / 2} y1={y} y2={y} className={stroke} strokeWidth={1.3} />
      <text x={x} y={y + 11} fontSize={11} fontWeight={800} textAnchor="middle" className={fill}>
        {d}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Fraction wall                                                           */
/* ------------------------------------------------------------------------ */

type WallMode = "equiv" | "compare";

const ROWS = Array.from({ length: 12 }, (_, i) => i + 1);
const WX0 = 40;
const WX1 = 344;
const WW = WX1 - WX0;
const ROW_TOP = 24;
const RH = 17; // row height
const PITCH = 19; // row height + gap
const rowY = (k: number) => ROW_TOP + (k - 1) * PITCH;
const WALL_BOTTOM = rowY(12) + RH;
const NL_Y = WALL_BOTTOM + 70; // the number line (compare mode), clear of its heading
const NX = (v: number) => WX0 + ((v + 1) / 2) * WW; // −1 … 1

function FractionWall() {
  const [mode, setMode] = useState<WallMode>("equiv");
  const [a, setA] = useState(6);
  const [b, setB] = useState(8);
  const [c, setC] = useState(2);
  const [d, setD] = useState(3);
  const compare = mode === "compare";

  const A = frac(a, b);
  const B = frac(c, d);
  const g = gcd(a, b);
  const hitsA = (k: number) => (k * a) % b === 0;
  const hitsB = (k: number) => (k * c) % d === 0;
  const rowsA = ROWS.filter(hitsA);
  const xA = WX0 + (WW * a) / b;
  const xB = WX0 + (WW * c) / d;

  // Comparing: a common denominator and the order (positives, then negatives).
  // The lowest common denominator comes from the SIMPLIFIED denominators
  // (2/4 and 1/3 share row 6, not just row 12).
  const L = lcm(A.d, B.d);
  const aL = (A.n * L) / A.d;
  const cL = (B.n * L) / B.d;
  const sym = aL < cL ? "<" : aL > cL ? ">" : "=";
  const flip = sym === "<" ? ">" : sym === ">" ? "<" : "=";
  const pos = (n: number, den: number) => over(n, den);
  const neg = (n: number, den: number) => (n === 0 ? "0" : `-${over(n, den)}`);
  const vA = a / b;
  const vB = c / d;

  // ---- equivalent fractions on the wall ----
  const eqTerms = rowsA.map((k) => `${(k * a) / b}/${k}`);
  const eqShown = eqTerms.length > 6 ? [...eqTerms.slice(0, 6), "…"] : eqTerms;

  // ---- aria ----
  const aria = compare
    ? `Fraction wall with rows cut into 1 to 12 equal parts. Line A at ${a}/${b} lines up exactly with a piece edge in ${rowsText(rowsA)}. Line B at ${c}/${d} lines up exactly in ${rowsText(ROWS.filter(hitsB))}. ${
        L <= 12 ? `Row ${L} holds both.` : `No row of this wall holds both; the lowest common denominator is ${L}.`
      } Below, a number line from −1 to 1 shows ${a}/${b} and ${c}/${d} and their negatives.`
    : `Fraction wall with rows cut into 1 to 12 equal parts. A line at ${a}/${b} lines up exactly with a piece edge in ${rowsText(rowsA)}, giving the equivalent fractions ${eqTerms.join(", ")}.`;

  // ---- 0 label on the number line: avoid the point labels ----
  // (If A or B is 0, its own label already says 0.)
  const nearZero = (v: number) => Math.abs(v) * (WW / 2) < 16;
  const zeroLabel = vA !== 0 && vB !== 0;
  const zeroBelow = zeroLabel && !nearZero(vB);
  const zeroAbove = zeroLabel && !zeroBelow && !nearZero(vA);

  // ---- live caption ----
  let caption: ReactNode;
  if (!compare) {
    if (a === 0) {
      caption = (
        <>
          No pieces at all is nothing: <M>{`0/${b} = 0`}</M>. The line sits at 0, which is the start of every row — so <M>{"0/1 = 0/2 = 0/3"}</M> and so
          on all name the same number.
        </>
      );
    } else if (a === b) {
      caption = (
        <>
          <M>{`${b}/${b}`}</M> is every piece: one whole. The line sits at the end of every row, so <M>{"1 = 2/2 = 3/3"}</M> and so on. Any fraction with
          equal top and bottom is 1.
        </>
      );
    } else if (rowsA.length === 1) {
      caption = (
        <>
          The line at <M>{`${a}/${b}`}</M> lands exactly on a join only in row {b}. The HCF of {a} and {b} is 1, so it is already in{" "}
          <strong>simplest form</strong>, and no row above can show it exactly. Its equivalent fractions are further down a bigger wall: doubling top
          and bottom cuts every piece in half — twice as many pieces, each half the size, same length — so <M>{`${a}/${b} = ${2 * a}/${2 * b}`}</M>,
          and tripling gives <M>{`${3 * a}/${3 * b}`}</M>.
        </>
      );
    } else {
      caption = (
        <>
          The line at <M>{`${a}/${b}`}</M> lands exactly on a join in rows <strong>{rowsA.join(", ")}</strong> — each of those rows shows an{" "}
          <strong>equivalent fraction</strong>. Multiplying top and bottom by 2 cuts every piece in half: twice as many pieces, each half the size, so
          the length doesn&apos;t change.{" "}
          {g > 1 ? (
            <>
              To simplify, divide top and bottom by their HCF, {g}: <M>{`${a}/${b} = ${A.n}/${A.d}`}</M>. That&apos;s the top row the line hits.
            </>
          ) : (
            <>
              The HCF of {a} and {b} is 1, so <M>{`${a}/${b}`}</M> is already in <strong>simplest form</strong> — the first row the line hits.
            </>
          )}{" "}
          The line only hits rows whose number is a multiple of {A.d}, and it never stops: <M>{`${A.n}/${A.d} = ${A.n * 10}/${A.d * 10} = ${A.n * 100}/${A.d * 100}`}</M>.
        </>
      );
    }
  } else {
    caption = (
      <>
        To compare, count pieces of the <strong>same size</strong>. A lands exactly in rows that are multiples of {A.d}, B in rows that are multiples
        of {B.d}, so rows that are multiples of both hold both fractions
        {L <= 12 ? (
          <>
            {" "}(marked ★). The first of them is row {L}, so {L} is the <strong>lowest common denominator</strong>.
          </>
        ) : (
          <>
            , but the first would be row {L}, off the bottom of this wall. {L} is the <strong>lowest common denominator</strong>.
          </>
        )}{" "}
        {L === 1 ? <>Both are whole numbers here, so</> : <>In pieces of size <M>{`1/${L}`}</M>: A is {aL} of them and B is {cL}, so</>} <M>{`${pos(a, b)} ${sym} ${pos(c, d)}`}</M>.{" "}
        {sym === "=" ? (
          <>They are equivalent — the same point on the number line — so their negatives are equal too.</>
        ) : (
          <>
            On the number line the negatives are mirror images: the fraction further from 0 has its negative further <em>left</em>, so the order flips:{" "}
            <M>{`${neg(a, b)} ${flip} ${neg(c, d)}`}</M>.
          </>
        )}
      </>
    );
  }

  const changeB = (v: number) => {
    setB(v);
    setA((x) => Math.min(x, v));
  };
  const changeD = (v: number) => {
    setD(v);
    setC((x) => Math.min(x, v));
  };

  const height = compare ? NL_Y + 42 : WALL_BOTTOM + 10;

  return (
    <WidgetFrame
      title="Fraction wall"
      tryThis={[
        "Set {{2/3}}. Predict which rows the line will land on exactly, then check. What do those row numbers have in common?",
        "Which fraction between 0 and 1 lands exactly on the most rows of this wall? Predict first.",
        "*Compare*: {{2/3}} and {{3/4}}. Which row gets the ★, and why that row?",
        "{{3/4 > 2/3}}. So which is bigger: {{-3/4}} or {{-2/3}}? Predict, then check on the number line.",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <Segmented<WallMode>
          label="Explore"
          value={mode}
          onChange={setMode}
          options={[
            { value: "equiv", label: "Equivalent fractions" },
            { value: "compare", label: "Compare two" },
          ]}
        />

        <div className={`grid grid-cols-1 gap-3 ${compare ? "sm:grid-cols-2" : ""}`}>
          <FracPicker
            label={compare ? "A" : "Fraction"}
            swatch={compare ? <span className="inline-block h-1 w-5 rounded bg-brand" aria-hidden /> : undefined}
            n={a}
            d={b}
            nMin={0}
            nMax={b}
            dMax={12}
            onN={setA}
            onD={changeB}
            extra={
              !compare && a > 0 && g > 1 ? (
                <>
                  = <M>{mixed(A)}</M>
                </>
              ) : undefined
            }
          />
          {compare ? (
            <FracPicker
              label="B"
              swatch={<span className="inline-block h-1 w-5 rounded border-t-2 border-dashed border-accent" aria-hidden />}
              n={c}
              d={d}
              nMin={0}
              nMax={d}
              dMax={12}
              onN={setC}
              onD={changeD}
            />
          ) : null}
        </div>

        <svg viewBox={`0 0 360 ${height}`} className="h-auto w-full" role="img" aria-label={aria}>
          {/* header */}
          <text x={30} y={14} fontSize={9} textAnchor="end" className="fill-ink-2">
            parts
          </text>
          <text x={WX0} y={14} fontSize={10} textAnchor="middle" className="fill-ink-2">
            0
          </text>
          <text x={WX1} y={14} fontSize={10} textAnchor="middle" className="fill-ink-2">
            1
          </text>

          {/* the wall */}
          {ROWS.map((k) => {
            const y = rowY(k);
            const hA = hitsA(k);
            const hB = compare && hitsB(k);
            const strong = hA || hB;
            const both = compare && hA && hB;
            const w = WW / k;
            const shadeA = hA ? (k * a) / b : 0;
            const shadeB = hB ? (k * c) / d : 0;
            return (
              <g key={k} opacity={strong ? 1 : 0.4}>
                <text x={30} y={y + 12.5} fontSize={11} textAnchor="end" fontWeight={strong ? 800 : 400} className={both ? "fill-good" : "fill-ink-2"}>
                  {k}
                </text>
                <rect x={WX0} y={y} width={WW} height={RH} className="fill-surface-2" />
                {shadeA > 0 ? <rect x={WX0} y={y} width={shadeA * w} height={compare ? RH / 2 : RH} className="fill-brand" opacity={0.8} /> : null}
                {shadeB > 0 ? <rect x={WX0} y={y + RH / 2} width={shadeB * w} height={RH / 2} className="fill-accent" opacity={0.9} /> : null}
                {ROWS.slice(0, k).map((i) => (
                  <rect key={i} x={WX0 + (i - 1) * w} y={y} width={w} height={RH} fill="none" className="stroke-ink-2" strokeWidth={0.75} />
                ))}
                {both ? (
                  <>
                    <rect x={WX0 - 2} y={y - 1.5} width={WW + 4} height={RH + 3} rx={3} fill="none" className="stroke-good" strokeWidth={2} />
                    <text x={353} y={y + 12.5} fontSize={11} textAnchor="middle" className="fill-good">
                      ★
                    </text>
                  </>
                ) : null}
              </g>
            );
          })}

          {/* the lines */}
          <line x1={xA} x2={xA} y1={ROW_TOP - 5} y2={WALL_BOTTOM + 4} className="stroke-brand" strokeWidth={2.25} />
          <path d={`M ${xA - 4} ${ROW_TOP - 9} L ${xA + 4} ${ROW_TOP - 9} L ${xA} ${ROW_TOP - 3} Z`} className="fill-brand" />
          {compare ? (
            <>
              <line x1={xB} x2={xB} y1={ROW_TOP - 5} y2={WALL_BOTTOM + 4} className="stroke-accent" strokeWidth={2.25} strokeDasharray="5 3" />
              <path d={`M ${xB - 4} ${WALL_BOTTOM + 9} L ${xB + 4} ${WALL_BOTTOM + 9} L ${xB} ${WALL_BOTTOM + 3} Z`} className="fill-accent" />
            </>
          ) : null}

          {/* number line with the negatives (compare mode) */}
          {compare ? (
            <g>
              <text x={WX0} y={WALL_BOTTOM + 25} fontSize={11} className="fill-ink-2">
                On the number line (with the negatives):
              </text>
              <line x1={WX0} x2={WX1} y1={NL_Y} y2={NL_Y} className="stroke-ink-2" strokeWidth={1.5} />
              {[-1, -0.5, 0, 0.5, 1].map((t) => (
                <line
                  key={t}
                  x1={NX(t)}
                  x2={NX(t)}
                  y1={NL_Y - (t === 0 ? 8 : Number.isInteger(t) ? 6 : 4)}
                  y2={NL_Y + (t === 0 ? 8 : Number.isInteger(t) ? 6 : 4)}
                  className="stroke-ink-2"
                  strokeWidth={t === 0 ? 2 : 1.2}
                />
              ))}
              <text x={WX0 - 6} y={NL_Y + 4} fontSize={11} textAnchor="end" className="fill-ink-2">
                −1
              </text>
              <text x={WX1 + 6} y={NL_Y + 4} fontSize={11} textAnchor="start" className="fill-ink-2">
                1
              </text>
              {zeroBelow ? (
                <text x={NX(0)} y={NL_Y + 21} fontSize={11} textAnchor="middle" className="fill-ink-2">
                  0
                </text>
              ) : zeroAbove ? (
                <text x={NX(0)} y={NL_Y - 13} fontSize={11} textAnchor="middle" className="fill-ink-2">
                  0
                </text>
              ) : null}
              {/* A and −A (circles, labels above) */}
              {(vA === 0 ? [0] : [-vA, vA]).map((v) => (
                <g key={`a${v}`}>
                  <circle cx={NX(v)} cy={NL_Y} r={4.5} className="fill-brand" />
                  <SvgFrac x={NX(v)} y={NL_Y - 24} n={a} d={b} neg={v < 0} tone="brand" />
                </g>
              ))}
              {/* B and −B (diamonds, labels below) */}
              {(vB === 0 ? [0] : [-vB, vB]).map((v) => (
                <g key={`b${v}`}>
                  <rect x={NX(v) - 3.6} y={NL_Y - 3.6} width={7.2} height={7.2} transform={`rotate(45 ${NX(v)} ${NL_Y})`} className="fill-accent" />
                  <SvgFrac x={NX(v)} y={NL_Y + 23} n={c} d={d} neg={v < 0} tone="accent" />
                </g>
              ))}
            </g>
          ) : null}
        </svg>

        {compare ? (
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
            <span>
              <span className="font-bold text-brand">A</span>: solid line, top half of each row, circles
            </span>
            <span>
              <span className="font-bold text-accent">B</span>: dashed line, bottom half, diamonds
            </span>
          </p>
        ) : null}

        {compare ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Readout label="Lowest common denominator" value={L} tone="ink" />
            <Readout label="A" value={<M>{chain([pos(a, b), over(aL, L)])}</M>} />
            <Readout label="B" value={<M>{chain([pos(c, d), over(cL, L)])}</M>} />
            <Readout label="So" value={<M>{`${pos(a, b)} ${sym} ${pos(c, d)}`}</M>} tone="good" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Readout label="Simplest form" value={<M>{mixed(A)}</M>} tone="good" />
              <Readout label={`HCF(${a}, ${b})`} value={a === 0 ? "—" : g} tone="ink" />
              <Readout label="Rows hit" value={rowsA.length} tone="ink" />
            </div>
            <p className="text-sm text-ink-2">
              On this wall: <M>{eqShown.join(" = ")}</M>
            </p>
          </>
        )}
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. How many fit? (division)                                                */
/* ------------------------------------------------------------------------ */

const BX0 = 24;
const BX1 = 336;
const BW = BX1 - BX0;
const AMT_Y = 22; // amount bar
const AMT_H = 26;
const PCS_Y = 72; // pieces row
const PCS_H = 28;
const AX_Y = 110; // axis

function HowManyFit() {
  const [m, setM] = useState(3); // amount = m/n
  const [n, setN] = useState(1);
  const [p, setP] = useState(2); // piece size = p/q
  const [q, setQ] = useState(3);
  const [hidden, setHidden] = useState(false);

  const X = frac(m, n);
  const Y = frac(p, q);
  // X ÷ Y = (m × q) / (n × p)
  const num = m * q;
  const den = n * p;
  const ans = frac(num, den);
  const k = Math.floor(num / den); // whole pieces that fit
  const r = num - k * den; // the leftover, shared numerator:
  const leftPiece = frac(r, den); //   as a fraction of a PIECE  = r / (n p)
  const leftLen = frac(r, n * q); //   as a LENGTH               = r / (n q)
  const vX = m / n;
  const vY = p / q;

  // Scale: whole numbers 0 … R, enough to show the piece that doesn't fit.
  // (While the answer is hidden, the scale shows only the amount.)
  const R = Math.max(1, r > 0 && !hidden ? Math.ceil(((k + 1) * p) / q) : Math.ceil(m / n));
  const xs = (v: number) => BX0 + (BW * v) / R;
  const unit = BW / R;
  const pieceW = unit * vY;
  const Lc = lcm(n, q); // common denominator
  const mL = (m * Lc) / n;
  const pL = (p * Lc) / q;

  const changeN = (v: number) => {
    setN(v);
    setM((x) => Math.min(x, 4 * v));
  };
  const changeQ = (v: number) => {
    setQ(v);
    setP((x) => Math.min(x, 3 * v));
  };

  const sumMarkup = `${mixed(X)} ÷ ${mixed(Y)}`;
  const aria = hidden
    ? `A bar of length ${spoken(X)}. The pieces of length ${spoken(Y)} are hidden: predict how many fit.`
    : `A bar of length ${spoken(X)}. Pieces of length ${spoken(Y)} laid along it: ${
        k === 0
          ? `not even one whole piece fits, only ${spoken(leftPiece)} of a piece`
          : `${k} whole ${k === 1 ? "piece fits" : "pieces fit"}${r ? `, plus ${spoken(leftPiece)} of another piece` : " exactly"}`
      }. So ${spoken(X)} divided by ${spoken(Y)} is ${spoken(ans)}.`;

  // ---- calculations ----
  const kcf = chain([`${over(m, n)} ÷ ${over(p, q)}`, `${over(m, n)} * ${over(q, p)}`, over(num, den), over(ans.n, ans.d), mixed(ans)]);
  const sameSize = chain([`${over(m, n)} ÷ ${over(p, q)}`, `${over(mL, Lc)} ÷ ${over(pL, Lc)}`]);
  const showContrast = r > 0 && k > 0 && p !== q && leftLen.n < leftLen.d;

  // ---- live caption ----
  let caption: ReactNode;
  if (hidden) {
    caption = (
      <>
        Answer hidden. How many pieces of size <M>{mixed(Y)}</M> fit into <M>{mixed(X)}</M>? Estimate first —{" "}
        {p < q
          ? "the pieces are smaller than 1, so will the answer be bigger or smaller than the amount?"
          : p === q
            ? "each piece is exactly 1, so what must the answer be?"
            : "the pieces are bigger than 1, so will the answer be bigger or smaller than the amount?"}{" "}
        Then
        press Reveal.
      </>
    );
  } else {
    caption = (
      <>
        <M>{sumMarkup}</M> asks: <strong>how many pieces of size <M>{mixed(Y)}</M> fit into <M>{mixed(X)}</M>?</strong>{" "}
        {k === 0 ? (
          <>
            One piece is longer than the whole amount, so not even one fits — only <M>{mixed(leftPiece)}</M> of a piece, and that is the answer.
          </>
        ) : r === 0 ? (
          <>
            Exactly {k} {k === 1 ? "piece fits" : "pieces fit"} with nothing left over, so the answer is {k}.
          </>
        ) : (
          <>
            {k} whole {k === 1 ? "piece fits" : "pieces fit"}, and the length left over is <M>{mixed(leftLen)}</M>. But the question counts{" "}
            <em>pieces</em>, so measure the leftover against one piece: it is <M>{mixed(leftPiece)}</M> of a piece. Answer: <M>{mixed(ans)}</M>
            {showContrast ? (
              <>
                , not <M>{`${k} ${leftLen.n}/${leftLen.d}`}</M>
              </>
            ) : null}
            .
          </>
        )}{" "}
        {p < q
          ? "Each piece is smaller than 1, so the number of pieces is bigger than the amount: dividing by a proper fraction gives a bigger answer."
          : p === q
            ? "Pieces of size 1: dividing by 1 changes nothing."
            : "Each piece is bigger than 1, so the answer is smaller than the amount."}
      </>
    );
  }

  // ---- drawing ----
  const pieces = Array.from({ length: k }, (_, i) => i);
  const guides = Array.from({ length: k + (r > 0 ? 1 : 0) }, (_, i) => (i + 1) * vY);
  const amtTicks = unit / n >= 3 ? Array.from({ length: Math.max(0, m - 1) }, (_, j) => (j + 1) / n) : [];
  const minor = unit / Lc >= 4 ? Array.from({ length: R * Lc - 1 }, (_, j) => (j + 1) / Lc).filter((t) => !Number.isInteger(t)) : [];
  const wholes = Array.from({ length: R + 1 }, (_, i) => i);

  return (
    <WidgetFrame
      title="How many fit?"
      tryThis={[
        "Predict {{3 ÷ 1/4}} before you set it up. Why is the answer bigger than 3?",
        "Set {{2 ÷ 3/4}}. Two pieces fit with {{1/2}} left over — so why is the answer {{2 2/3}} and not {{2 1/2}}?",
        "*Work backwards*: find a piece size that makes {{2 1/4 ÷ ?}} come out to exactly 6.",
        "Make the answer less than 1. What has to be true about the amount and the piece size?",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FracPicker
            label="Amount"
            swatch={<span className="inline-block h-3 w-3 rounded-sm border border-good bg-good-soft" aria-hidden />}
            n={m}
            d={n}
            nMin={1}
            nMax={4 * n}
            dMax={12}
            onN={setM}
            onD={changeN}
            extra={
              X.d !== n || m > n ? (
                <>
                  = <M>{mixed(X)}</M>
                </>
              ) : undefined
            }
          />
          <FracPicker
            label="Piece size"
            swatch={<span className="inline-block h-3 w-3 rounded-sm bg-brand" aria-hidden />}
            n={p}
            d={q}
            nMin={1}
            nMax={3 * q}
            dMax={12}
            onN={setP}
            onD={changeQ}
            extra={
              Y.d !== q || p > q ? (
                <>
                  = <M>{mixed(Y)}</M>
                </>
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xl text-ink">
            <M>{hidden ? `${sumMarkup} = ?` : `${sumMarkup} = ${mixed(ans)}`}</M>
          </p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setHidden((h) => !h)}>
            {hidden ? "Reveal" : "Hide the answer (predict first)"}
          </button>
        </div>

        <svg viewBox="0 0 360 132" className="h-auto w-full" role="img" aria-label={aria}>
          {/* amount */}
          <text x={BX0} y={16} fontSize={11} className="fill-ink-2">
            amount
          </text>
          <rect x={BX0} y={AMT_Y} width={xs(vX) - BX0} height={AMT_H} className="fill-good-soft stroke-good" strokeWidth={1.5} />
          {amtTicks.map((t) => (
            <line
              key={`at${t}`}
              x1={xs(t)}
              x2={xs(t)}
              y1={AMT_Y}
              y2={AMT_Y + AMT_H}
              className="stroke-good"
              strokeWidth={Number.isInteger(t) ? 1.5 : 0.75}
              opacity={Number.isInteger(t) ? 1 : 0.6}
            />
          ))}

          {/* pieces */}
          {hidden ? (
            <rect x={BX0} y={PCS_Y} width={BW} height={PCS_H} rx={4} fill="none" className="stroke-line" strokeWidth={1.5} strokeDasharray="5 4" />
          ) : (
            <>
              {(pieceW >= 10 ? guides : []).map((v) => (
                <line key={`g${v}`} x1={xs(v)} x2={xs(v)} y1={AMT_Y - 2} y2={PCS_Y + PCS_H} className="stroke-ink-2" strokeWidth={0.75} strokeDasharray="2 3" />
              ))}
              {pieces.map((i) => (
                <g key={`p${i}`}>
                  <rect
                    x={xs(i * vY)}
                    y={PCS_Y}
                    width={pieceW}
                    height={PCS_H}
                    className={`${i % 2 ? "fill-brand-2" : "fill-brand"} stroke-surface`}
                    strokeWidth={1.5}
                  />
                  {pieceW >= 16 ? (
                    <text x={xs(i * vY) + pieceW / 2} y={PCS_Y + 18} fontSize={11} fontWeight={800} textAnchor="middle" className="fill-brand-ink">
                      {i + 1}
                    </text>
                  ) : null}
                </g>
              ))}
              {r > 0 ? (
                <>
                  <rect x={xs(k * vY)} y={PCS_Y} width={xs(vX) - xs(k * vY)} height={PCS_H} className="fill-accent" opacity={0.85} />
                  <rect
                    x={xs(k * vY)}
                    y={PCS_Y}
                    width={pieceW}
                    height={PCS_H}
                    fill="none"
                    className="stroke-brand"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                </>
              ) : null}
            </>
          )}

          {/* drawn after the guides, with a halo, so dotted lines never cross the word */}
          <text x={BX0} y={66} fontSize={11} className="fill-ink-2 stroke-surface" strokeWidth={3} paintOrder="stroke">
            pieces
          </text>

          {/* axis */}
          <line x1={BX0} x2={BX1} y1={AX_Y} y2={AX_Y} className="stroke-ink-2" strokeWidth={1.25} />
          {minor.map((t) => (
            <line key={`mt${t}`} x1={xs(t)} x2={xs(t)} y1={AX_Y - 3} y2={AX_Y + 3} className="stroke-ink-2" strokeWidth={0.75} />
          ))}
          {wholes.map((w) => (
            <g key={`w${w}`}>
              <line x1={xs(w)} x2={xs(w)} y1={AX_Y - 6} y2={AX_Y + 6} className="stroke-ink-2" strokeWidth={1.5} />
              <text x={xs(w)} y={AX_Y + 19} fontSize={11} textAnchor="middle" className="fill-ink-2">
                {w}
              </text>
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-3 gap-2">
          <Readout label="Whole pieces" value={hidden ? "?" : k} tone="ink" />
          <Readout
            label="Left over"
            value={hidden ? "?" : r === 0 ? "none" : <><M>{mixed(leftPiece)}</M> <span className="text-sm font-bold">of a piece</span></>}
            tone="ink"
          />
          <Readout label="Answer" value={hidden ? "?" : <M>{mixed(ans)}</M>} tone="good" />
        </div>

        {hidden ? null : (
          <div className="space-y-2 rounded-xl border border-line p-3 text-sm text-ink-2">
            <p>
              <span className="font-bold text-ink">Same-size pieces:</span>{" "}
              {Lc === 1 ? (
                <>
                  both are whole numbers, so just ask how many {p}s fit into {m}: <M>{`${m} ÷ ${p} = ${mixed(ans)}`}</M>.
                </>
              ) : (
                <>
                  <M>{sameSize}</M>. Count in pieces of size <M>{`1/${Lc}`}</M>: how many lots of {pL} fit into {mL}?{" "}
                  <M>{chain([`${mL} ÷ ${pL}`, over(mL, pL), over(ans.n, ans.d), mixed(ans)])}</M>
                </>
              )}
            </p>
            <p>
              <span className="font-bold text-ink">Keep, Change, Flip:</span> <M>{kcf}</M>
              {p === 1 && q === 1 ? null : (
                <>
                  {" "}
                  (dividing by <M>{over(p, q)}</M> is the same as multiplying by its reciprocal, <M>{over(q, p)}</M>)
                </>
              )}
            </p>
            <p>
              <span className="font-bold text-ink">Check by multiplying back:</span> <M>{`${mixed(ans)} * ${mixed(Y)} = ${mixed(X)}`}</M> ✓
            </p>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */

export const widgets: WidgetDef[] = [
  {
    id: "fraction-wall",
    title: "Fraction wall",
    blurb: "See which fractions are equal, find the simplest form, and compare two fractions — including their negatives.",
    Component: FractionWall,
  },
  {
    id: "how-many-fit",
    title: "How many fit?",
    blurb: "Divide by a fraction by laying pieces along a bar — and see why the leftover is a fraction of a piece.",
    Component: HowManyFit,
  },
];
