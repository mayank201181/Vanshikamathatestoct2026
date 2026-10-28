"use client";
// Interactive explorables for the "expressions" topic.
//  1. Bracket grid — expand a single bracket with the grid method (negatives,
//     a letter outside, a live substitution check that both forms agree),
//     then run the grid backwards to factorise by taking out the HCF.
//  2. Formula machine — build a formula from up to three operations, run it
//     forwards (substitution) and backwards (changing the subject), with exact
//     fractions throughout.
import { Fragment, useState, type ReactNode } from "react";
import { WidgetFrame, Slider, Stepper, Segmented, Readout, M, type WidgetDef } from "./kit";

/* ------------------------------------------------------------------------ */
/* Shared helpers                                                            */
/* ------------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x;
}

/** Integer as plain text with a real minus sign, e.g. −12 or 1,250. */
function intTx(v: number): string {
  const s = Math.abs(v).toLocaleString("en-GB");
  return v < 0 ? `−${s}` : s;
}

/** A negative number in brackets for maths markup: −2 → (-2). */
function pn(v: number): string {
  return v < 0 ? `(${v})` : String(v);
}

/** Join signed markup pieces into a sum: ["3", "-5", "2"] → "3 - 5 + 2". */
function sumMk(parts: string[]): string {
  return parts.map((s, i) => (i === 0 ? s : s.startsWith("-") ? ` - ${s.slice(1)}` : ` + ${s}`)).join("");
}

/**
 * A long maths line split into pieces (e.g. at each "=") with spaces between,
 * so it can wrap on a phone — a single maths span never line-breaks.
 */
function MathChain({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className="inline-block">
            <M>{p}</M>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Bracket grid                                                           */
/* ------------------------------------------------------------------------ */

/** A term c·x^p. */
interface Term {
  c: number;
  p: number;
}

const SUP: Record<number, string> = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };

/** Unsigned term as maths markup: 3x^2, x, 7. */
function absTermMk(c: number, p: number): string {
  const a = Math.abs(c);
  if (p === 0) return String(a);
  return `${a === 1 ? "" : a}x${p > 1 ? `^${p}` : ""}`;
}

/** Unsigned term as plain text: 3x², x, 7. */
function absTermTx(c: number, p: number): string {
  const a = Math.abs(c);
  if (p === 0) return String(a);
  return `${a === 1 ? "" : a}x${p > 1 ? (SUP[p] ?? `^${p}`) : ""}`;
}

function termMk(t: Term): string {
  return `${t.c < 0 ? "-" : ""}${absTermMk(t.c, t.p)}`;
}

function termTx(t: Term): string {
  return `${t.c < 0 ? "−" : ""}${absTermTx(t.c, t.p)}`;
}

function polyMk(ts: Term[]): string {
  return ts.map((t, i) => (i === 0 ? termMk(t) : `${t.c < 0 ? " - " : " + "}${absTermMk(t.c, t.p)}`)).join("");
}

function polyTx(ts: Term[]): string {
  return ts.map((t, i) => (i === 0 ? termTx(t) : `${t.c < 0 ? " − " : " + "}${absTermTx(t.c, t.p)}`)).join("");
}

/** The multiplier written in front of a bracket: 1 → "", −1 → "-", otherwise the term. */
function frontMk(t: Term): string {
  if (t.p === 0 && Math.abs(t.c) === 1) return t.c < 0 ? "-" : "";
  return termMk(t);
}

function frontTx(t: Term): string {
  if (t.p === 0 && Math.abs(t.c) === 1) return t.c < 0 ? "−" : "";
  return termTx(t);
}

const wrapNeg = (s: string) => (s.startsWith("-") ? `(${s})` : s);

/** c·v^p written out for substitution, e.g. -6 * (-2)^2. */
function subMk(c: number, p: number, v: number): string {
  if (p === 0) return String(c);
  const base = p === 1 ? pn(v) : `${pn(v)}^${p}`;
  if (c === 1) return base;
  if (c === -1) return `-${base}`;
  return `${c} * ${base}`;
}

const valueOf = (t: Term, x: number) => t.c * x ** t.p;

/** Stepper handler that skips 0 (a coefficient of 0 would delete the term). */
const skipZero = (prev: number, next: number) => (next === 0 ? (prev > 0 ? -1 : 1) : next);

const signed = (v: number) => (v < 0 ? `−${-v}` : String(v));

type Tone = "plain" | "pos" | "neg" | "bad" | "good" | "brand";
const TONE: Record<Tone, string> = {
  plain: "bg-surface-2 text-ink",
  pos: "bg-info-soft text-ink",
  neg: "bg-warn-soft text-ink",
  bad: "bg-bad-soft text-bad",
  good: "bg-good-soft text-good",
  brand: "bg-brand-soft text-brand",
};

interface Cell {
  body: ReactNode;
  sub?: ReactNode;
  tone: Tone;
}

/** The multiplication grid: outside term down the side, bracket terms along the top. */
function GridTable({ left, heads, cells, summary }: { left: Cell; heads: Cell[]; cells: Cell[]; summary: string }) {
  return (
    <table className="w-full table-fixed border-separate border-spacing-1.5 text-center">
      <caption className="sr-only">{summary}</caption>
      <thead>
        <tr>
          <th scope="col" className="w-16 text-lg font-extrabold text-ink-2">
            ×
          </th>
          {heads.map((h, i) => (
            <th key={i} scope="col" className={`rounded-lg px-1 py-2 text-lg font-extrabold ${TONE[h.tone]}`}>
              {h.body}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className={`rounded-lg px-1 py-3 text-lg font-extrabold ${TONE[left.tone]}`}>
            {left.body}
          </th>
          {cells.map((c, i) => (
            <td key={i} className={`rounded-lg px-1 py-3 ${TONE[c.tone]}`}>
              <div className="text-lg font-extrabold">{c.body}</div>
              {c.sub ? <div className="mt-1 text-xs text-ink-2">{c.sub}</div> : null}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/** Expressions to factorise (each has a non-trivial HCF). */
const TARGETS: Term[][] = [
  [{ c: 6, p: 1 }, { c: 9, p: 0 }], // 3(2x + 3)
  [{ c: 12, p: 1 }, { c: -18, p: 0 }], // 6(2x − 3)
  [{ c: 6, p: 2 }, { c: 9, p: 1 }], // 3x(2x + 3)
  [{ c: 8, p: 2 }, { c: -20, p: 1 }], // 4x(2x − 5)
  [{ c: -4, p: 1 }, { c: -10, p: 0 }], // −2(2x + 5)
  [{ c: 15, p: 1 }, { c: 10, p: 2 }], // 5x(3 + 2x)
  [{ c: 1, p: 2 }, { c: 7, p: 1 }], // x(x + 7)
  [{ c: 14, p: 3 }, { c: 21, p: 2 }], // 7x²(2x + 3)
  [{ c: 18, p: 2 }, { c: -24, p: 0 }], // 6(3x² − 4)
  [{ c: 9, p: 2 }, { c: -6, p: 1 }, { c: 12, p: 0 }], // 3(3x² − 2x + 4)
  [{ c: 4, p: 3 }, { c: -10, p: 2 }, { c: 6, p: 1 }], // 2x(2x² − 5x + 3)
  [{ c: 20, p: 2 }, { c: -30, p: 3 }], // 10x²(2 − 3x)
];

interface FactorCheck {
  trivial: boolean;
  /** Per term: why the factor fails, or null if it divides exactly. */
  problems: (null | "number" | "letter")[];
  valid: boolean;
  inside: Term[];
  /** Common factor still left inside the bracket (c = 1, p = 0 means none). */
  leftover: Term;
  full: boolean;
}

function checkFactor(terms: Term[], k: number, kp: number): FactorCheck {
  const problems = terms.map((t) => (t.c % k !== 0 ? "number" : t.p < kp ? "letter" : null));
  const valid = problems.every((p) => p === null);
  const inside = terms.map((t) => ({ c: t.c / k, p: t.p - kp }));
  const g = valid ? inside.reduce((acc, t) => gcd(acc, t.c), 0) : 1;
  const minP = valid ? Math.min(...inside.map((t) => t.p)) : 0;
  return {
    trivial: k === 1 && kp === 0,
    problems,
    valid,
    inside,
    leftover: { c: g, p: minP },
    full: valid && g === 1 && minP === 0,
  };
}

type Mode = "expand" | "factorise";
type Pow01 = "0" | "1";
type Pow012 = "0" | "1" | "2";

function BracketGrid() {
  const [mode, setMode] = useState<Mode>("expand");
  // Expand: a·x^ap (b·x + c)
  const [a, setA] = useState(-2);
  const [ap, setAp] = useState<Pow01>("0");
  const [b, setB] = useState(3);
  const [c, setC] = useState(-5);
  const [xv, setXv] = useState(2);
  // Factorise
  const [ti, setTi] = useState(0);
  const [k, setK] = useState(1);
  const [kp, setKp] = useState<Pow012>("0");
  const [hint, setHint] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);

  /* ---------------- expand ---------------- */
  const outT: Term = { c: a, p: Number(ap) };
  const inT: Term[] = [
    { c: b, p: 1 },
    { c, p: 0 },
  ];
  const prods: Term[] = inT.map((t) => ({ c: outT.c * t.c, p: outT.p + t.p }));
  const bracketMk = `${frontMk(outT)}(${polyMk(inT)})`;
  const bracketTx = `${frontTx(outT)}(${polyTx(inT)})`;
  const expandedMk = polyMk(prods);
  const expandedTx = polyTx(prods);

  const outVal = valueOf(outT, xv);
  const brVal = b * xv + c;
  const leftVal = outVal * brVal;
  const rightVals = prods.map((t) => valueOf(t, xv));
  const rightVal = rightVals.reduce((s, v) => s + v, 0);
  // Each chain is split at its "=" signs so it can wrap on a narrow (360 px) screen.
  const leftMk = [
    `${outT.p === 0 ? String(a) : subMk(a, 1, xv)} * (${sumMk([subMk(b, 1, xv), String(c)])})`,
    `= ${outVal} * ${pn(brVal)}`,
    `= ${leftVal}`,
  ];
  const rightMk = [sumMk(prods.map((t) => subMk(t.c, t.p, xv))), `= ${sumMk(rightVals.map(String))}`, `= ${rightVal}`];

  /* ---------------- factorise ---------------- */
  const terms = TARGETS[ti];
  const kpN = Number(kp);
  const factor: Term = { c: k, p: kpN };
  const chk = checkFactor(terms, k, kpN);
  const targetMk = polyMk(terms);
  const hcfC = terms.reduce((acc, t) => gcd(acc, t.c), 0);
  const hcfP = Math.min(...terms.map((t) => t.p));
  const hcf: Term = { c: hcfC, p: hcfP };

  const setFactor = (nk: number, nkp: Pow012) => {
    setK(nk);
    setKp(nkp);
    if (checkFactor(terms, nk, Number(nkp)).full) setSolved((s) => (s.includes(ti) ? s : [...s, ti]));
  };
  const nextTarget = () => {
    setTi((i) => (i + 1) % TARGETS.length);
    setK(1);
    setKp("0");
    setHint(0);
  };

  const hints: ReactNode[] = [
    <>
      Look at the numbers {terms.map((t, i) => (
        <Fragment key={i}>
          {i > 0 ? (i === terms.length - 1 ? " and " : ", ") : null}
          <strong>{Math.abs(t.c)}</strong>
        </Fragment>
      ))}
      . What is the biggest whole number that divides all of them?
    </>,
    hcfP > 0 ? (
      <>
        Every term contains <M>{absTermMk(1, hcfP)}</M> (that&apos;s the lowest power of x), so it can come out too.
      </>
    ) : (
      <>Not every term has an x in it, so no x can come out — only a number.</>
    ),
    <>
      The HCF is <M>{termMk(hcf)}</M>. Set the factor to that and read the bracket off the top of the grid.
    </>,
  ];

  /* ---------------- render ---------------- */
  const tryThis = [
    "Set up {{-4(2x - 3)}}. Predict both cells before you look — which sign do people usually get wrong?",
    "Put an x outside the bracket. Where does the {{x^2}} term come from?",
    "Factorise mode: find two different factors that work for {{12x - 18}}. Which one makes it *fully* factorised?",
    "Can you fully factorise all 12? For {{-4x - 10}}, try taking out a negative number.",
  ];

  let caption: ReactNode;
  if (mode === "expand") {
    caption = (
      <div className="space-y-2">
        <p>
          Multiply the outside term by <strong>every</strong> term inside:{" "}
          <M>{`${termMk(outT)} * ${wrapNeg(termMk(inT[0]))} = ${termMk(prods[0])}`}</M> and{" "}
          <M>{`${termMk(outT)} * ${wrapNeg(termMk(inT[1]))} = ${termMk(prods[1])}`}</M>.
        </p>
        {a < 0 ? (
          <p>
            A negative outside flips the sign of every term inside.{" "}
            {b < 0 && c < 0
              ? "Both terms inside are negative, so both answers come out positive: negative × negative is positive. That's the classic slip."
              : b < 0 || c < 0
                ? "The negative term inside becomes positive: negative × negative is positive. That's the classic slip."
                : "Both terms inside are positive, so both answers come out negative."}
          </p>
        ) : null}
        {outT.p === 1 ? (
          <p>
            <M>{"x * x = x^2"}</M>: when you multiply powers of x you add the indices, so the x outside raises every power by one.
          </p>
        ) : null}
        <p>
          Change the check value of x: the two forms <em>always</em> agree, so <M>{`${bracketMk} ≡ ${expandedMk}`}</M> is an{" "}
          <strong>identity</strong> — true for every x, not just one.
        </p>
      </div>
    );
  } else {
    caption = (
      <div className="space-y-2">
        <p>
          Factorising is expanding <strong>backwards</strong>: the grid&apos;s answers are given and you hunt for the outside term. Each
          bracket term is a target term ÷ the factor.
        </p>
        {chk.trivial ? (
          <p>Right now the factor is 1, which always works but changes nothing. Look for the biggest factor shared by every term — the HCF.</p>
        ) : !chk.valid ? (
          <p>
            <M>{termMk(factor)}</M> doesn&apos;t go into every term exactly, so it can&apos;t come out of the bracket.
          </p>
        ) : !chk.full ? (
          <p>
            That works — expand it and you get back to <M>{targetMk}</M>. But the bracket still has a common factor of{" "}
            <M>{termMk(chk.leftover)}</M>, so it isn&apos;t <em>fully</em> factorised yet.
          </p>
        ) : (
          <p>
            Fully factorised: nothing else divides every term in the bracket. Expanding <M>{`${frontMk(factor)}(${polyMk(chk.inside)})`}</M> takes you
            straight back to <M>{targetMk}</M>.
            {k > 0 && chk.inside.every((t) => t.c < 0) ? " You could also take out the negative factor to make the bracket terms positive." : ""}
          </p>
        )}
      </div>
    );
  }

  return (
    <WidgetFrame title="Bracket grid: expand ⇄ factorise" tryThis={tryThis} caption={caption}>
      <div className="space-y-4">
        <Segmented<Mode>
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "expand", label: "Expand" },
            { value: "factorise", label: "Factorise" },
          ]}
        />

        {mode === "expand" ? (
          <>
            <div className="rounded-xl bg-surface-2 p-3 text-center text-xl font-extrabold text-ink" aria-live="polite">
              <MathChain parts={[bracketMk, `= ${expandedMk}`]} />
            </div>

            <GridTable
              summary={`Grid for ${bracketTx}: ${termTx(outT)} times ${termTx(inT[0])} is ${termTx(prods[0])}, ${termTx(outT)} times ${termTx(inT[1])} is ${termTx(prods[1])}. Expanded: ${expandedTx}.`}
              left={{ body: <M>{termMk(outT)}</M>, tone: "brand" }}
              heads={inT.map((t) => ({ body: <M>{termMk(t)}</M>, tone: "plain" as Tone }))}
              cells={prods.map((t, i) => ({
                body: <M>{termMk(t)}</M>,
                sub: <M>{`${termMk(outT)} * ${wrapNeg(termMk(inT[i]))}`}</M>,
                tone: (t.c < 0 ? "neg" : "pos") as Tone,
              }))}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2" aria-hidden>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded border border-line bg-info-soft" /> positive term
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded border border-line bg-warn-soft" /> negative term
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-line p-3">
                <p className="text-sm font-bold text-ink-2">Outside the bracket</p>
                <Stepper label="Number" value={a} min={-6} max={6} onChange={(v) => setA(skipZero(a, v))} format={signed} />
                <Segmented<Pow01>
                  label="Letter outside the bracket"
                  value={ap}
                  onChange={setAp}
                  options={[
                    { value: "0", label: "no x" },
                    { value: "1", label: "× x" },
                  ]}
                />
              </div>
              <div className="space-y-2 rounded-xl border border-line p-3">
                <p className="text-sm font-bold text-ink-2">Inside the bracket</p>
                <Stepper label="Coefficient of x" value={b} min={-6} max={6} onChange={(v) => setB(skipZero(b, v))} format={signed} />
                <Stepper label="Constant" value={c} min={-9} max={9} onChange={(v) => setC(skipZero(c, v))} format={signed} />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-line p-3">
              <Slider label="Check by substituting x =" value={xv} min={-5} max={5} onChange={setXv} format={signed} />
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-bold text-ink-2">Bracket: </span>
                  <MathChain parts={leftMk} />
                </p>
                <p>
                  <span className="font-bold text-ink-2">Expanded: </span>
                  <MathChain parts={rightMk} />
                </p>
                <p className={`font-bold ${leftVal === rightVal ? "text-good" : "text-bad"}`}>
                  {leftVal === rightVal ? `✓ Both give ${intTx(leftVal)} when x = ${signed(xv)}.` : "✗ The two forms disagree."}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 p-3">
              <div className="text-xl font-extrabold text-ink" aria-live="polite">
                {chk.valid && !chk.trivial ? (
                  <MathChain parts={[targetMk, `= ${frontMk(factor)}(${polyMk(chk.inside)})`]} />
                ) : (
                  <>
                    Factorise <M>{targetMk}</M>
                  </>
                )}
              </div>
              <button type="button" className="btn btn-secondary" onClick={nextTarget}>
                Next expression ›
              </button>
            </div>

            <GridTable
              summary={`Factorising ${polyTx(terms)} with factor ${termTx(factor)}. ${
                chk.valid ? `Bracket: ${polyTx(chk.inside)}.` : "The factor does not divide every term."
              }`}
              left={{ body: <M>{termMk(factor)}</M>, tone: "brand" }}
              heads={chk.inside.map((t, i) => ({
                body: chk.problems[i] ? "?" : <M>{termMk(t)}</M>,
                tone: (chk.problems[i] ? "bad" : chk.full ? "good" : "plain") as Tone,
              }))}
              cells={terms.map((t, i) => ({
                body: <M>{termMk(t)}</M>,
                sub:
                  chk.problems[i] === "number" ? (
                    <span className="text-bad">
                      {Math.abs(k)} doesn&apos;t divide {Math.abs(t.c)}
                    </span>
                  ) : chk.problems[i] === "letter" ? (
                    <span className="text-bad">{t.p === 0 ? "no x here" : `only x${t.p > 1 ? SUP[t.p] : ""} here`}</span>
                  ) : (
                    <MathChain parts={[termMk(t), `÷ ${wrapNeg(termMk(factor))}`, `= ${termMk(chk.inside[i])}`]} />
                  ),
                tone: (t.c < 0 ? "neg" : "pos") as Tone,
              }))}
            />

            <div className="space-y-2 rounded-xl border border-line p-3">
              <p className="text-sm font-bold text-ink-2">Factor to take out</p>
              <Stepper label="Number part" value={k} min={-12} max={12} onChange={(v) => setFactor(skipZero(k, v), kp)} format={signed} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink-2">Letter part</span>
                <Segmented<Pow012>
                  label="Letter part of the factor"
                  value={kp}
                  onChange={(v) => setFactor(k, v)}
                  options={[
                    { value: "0", label: "none" },
                    { value: "1", label: "x" },
                    { value: "2", label: "x²" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Readout
                label="Status"
                value={chk.trivial ? "Pick a factor" : !chk.valid ? "✗ Not a factor" : chk.full ? "✓ Done" : "Not fully yet"}
                tone={chk.trivial ? "ink" : !chk.valid ? "bad" : chk.full ? "good" : "brand"}
              />
              <Readout label="Fully factorised" value={`${solved.length} / ${TARGETS.length}`} tone="good" />
            </div>

            <div className="space-y-2">
              {hints.slice(0, hint).map((h, i) => (
                <p key={i} className="rounded-xl bg-brand-soft p-3 text-sm text-ink">
                  <strong>Hint {i + 1}:</strong> {h}
                </p>
              ))}
              {hint < hints.length ? (
                <button type="button" className="btn btn-ghost" onClick={() => setHint((h) => h + 1)}>
                  💡 {hint === 0 ? "Show a hint" : "Next hint"}
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. Formula machine                                                        */
/* ------------------------------------------------------------------------ */

type Op = "add" | "sub" | "mul" | "div" | "sq";
type AnyOp = Op | "sqrt";

interface Step {
  op: Op;
  n: number;
}

const INVERSE: Record<Op, AnyOp> = { add: "sub", sub: "add", mul: "div", div: "mul", sq: "sqrt" };

function opBox(op: AnyOp, n: number): string {
  switch (op) {
    case "add":
      return `+ ${n}`;
    case "sub":
      return `− ${n}`;
    case "mul":
      return `× ${n}`;
    case "div":
      return `÷ ${n}`;
    case "sq":
      return "square";
    case "sqrt":
      return "√";
  }
}

function opWords(op: AnyOp, n: number): string {
  switch (op) {
    case "add":
      return `add ${n}`;
    case "sub":
      return `subtract ${n}`;
    case "mul":
      return `multiply by ${n}`;
    case "div":
      return `divide by ${n}`;
    case "sq":
      return "square it";
    case "sqrt":
      return "take the square root";
  }
}

/* ---- exact values: rationals, with a fallback for irrational roots ---- */

interface Rat {
  n: number;
  d: number;
}

type Val = { k: "q"; q: Rat } | { k: "approx"; v: number } | { k: "none" };

function rat(n: number, d = 1): Val {
  const s = d < 0 ? -1 : 1;
  const g = gcd(n, d) || 1;
  return { k: "q", q: { n: (s * n) / g, d: (s * d) / g } };
}

function applyVal(v: Val, op: AnyOp, n: number): Val {
  if (v.k === "none") return v;
  if (v.k === "approx") {
    const x = v.v;
    switch (op) {
      case "add":
        return { k: "approx", v: x + n };
      case "sub":
        return { k: "approx", v: x - n };
      case "mul":
        return { k: "approx", v: x * n };
      case "div":
        return { k: "approx", v: x / n };
      case "sq":
        return { k: "approx", v: x * x };
      case "sqrt":
        return x < 0 ? { k: "none" } : { k: "approx", v: Math.sqrt(x) };
    }
  }
  const { n: p, d: q } = v.q;
  switch (op) {
    case "add":
      return rat(p + n * q, q);
    case "sub":
      return rat(p - n * q, q);
    case "mul":
      return rat(p * n, q);
    case "div":
      return rat(p, q * n);
    case "sq":
      return rat(p * p, q * q);
    case "sqrt": {
      if (p < 0) return { k: "none" };
      const rp = Math.round(Math.sqrt(p));
      const rq = Math.round(Math.sqrt(q));
      if (rp * rp === p && rq * rq === q) return rat(rp, rq);
      return { k: "approx", v: Math.sqrt(p / q) };
    }
  }
}

function sameVal(a: Val, b: Val): boolean {
  return a.k === "q" && b.k === "q" && a.q.n === b.q.n && a.q.d === b.q.d;
}

function decTx(v: number): string {
  const s = String(Number(v.toFixed(3)));
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}

function ValView({ v }: { v: Val }) {
  if (v.k === "none") return <>no real value</>;
  if (v.k === "approx") return <>≈ {decTx(v.v)}</>;
  if (v.q.d === 1) return <>{intTx(v.q.n)}</>;
  return <M>{`${v.q.n < 0 ? "-" : ""}${Math.abs(v.q.n)}/${v.q.d}`}</M>;
}

function valTx(v: Val): string {
  if (v.k === "none") return "no real value";
  if (v.k === "approx") return `about ${decTx(v.v)}`;
  return v.q.d === 1 ? intTx(v.q.n) : `${v.q.n < 0 ? "−" : ""}${Math.abs(v.q.n)} over ${v.q.d}`;
}

/* ---- symbolic formula with exact simplification ---- */

type Ex =
  | { t: "v"; name: string }
  | { t: "add"; e: Ex; n: number }
  | { t: "mul"; e: Ex; k: number }
  | { t: "div"; e: Ex; d: number }
  | { t: "pow"; e: Ex; n: number }
  | { t: "sqrt"; e: Ex };

// Smart constructors keep the formula tidy: (x + 3) + 2 → x + 5, 2(3x) → 6x,
// (6x)/4 → (3x)/2, (3x)² → 9x², (x/2)² → x²/4. All exact.
function exAdd(e: Ex, n: number): Ex {
  if (e.t === "add") return exAdd(e.e, e.n + n);
  if (n === 0) return e;
  return { t: "add", e, n };
}

function exMul(e: Ex, k: number): Ex {
  if (k === 1) return e;
  if (e.t === "mul") return exMul(e.e, e.k * k);
  if (e.t === "div") {
    const g = gcd(k, e.d);
    return exDiv(exMul(e.e, k / g), e.d / g);
  }
  return { t: "mul", e, k };
}

function exDiv(e: Ex, d: number): Ex {
  if (d === 1) return e;
  if (e.t === "div") return exDiv(e.e, e.d * d);
  if (e.t === "mul") {
    const g = gcd(e.k, d);
    if (g > 1) return exDiv(exMul(e.e, e.k / g), d / g);
  }
  return { t: "div", e, d };
}

function exPow(e: Ex, n: number): Ex {
  if (e.t === "pow") return exPow(e.e, e.n * n);
  if (e.t === "mul") return exMul(exPow(e.e, n), e.k ** n);
  if (e.t === "div") return exDiv(exPow(e.e, n), e.d ** n);
  return { t: "pow", e, n };
}

function applyEx(e: Ex, op: AnyOp, n: number): Ex {
  switch (op) {
    case "add":
      return exAdd(e, n);
    case "sub":
      return exAdd(e, -n);
    case "mul":
      return exMul(e, n);
    case "div":
      return exDiv(e, n);
    case "sq":
      return exPow(e, 2);
    case "sqrt":
      return { t: "sqrt", e };
  }
}

const SUM = 0;
const PROD = 1;
const POW = 2;
const ATOM = 3;

/** Print as maths markup, tracking precedence so brackets appear only where needed. */
function pr(e: Ex): { s: string; p: number } {
  switch (e.t) {
    case "v":
      return { s: e.name, p: ATOM };
    case "sqrt":
      return { s: `sqrt(${pr(e.e).s})`, p: ATOM };
    case "pow": {
      const b = pr(e.e);
      return { s: `${b.p === ATOM ? b.s : `(${b.s})`}^${e.n}`, p: POW };
    }
    case "mul": {
      const b = pr(e.e);
      return { s: b.p === SUM ? `${e.k}(${b.s})` : `${e.k}${b.s}`, p: PROD };
    }
    case "div":
      return { s: `(${pr(e.e).s})/${e.d}`, p: PROD };
    case "add": {
      const b = pr(e.e);
      return { s: `${b.s} ${e.n < 0 ? "-" : "+"} ${Math.abs(e.n)}`, p: SUM };
    }
  }
}

/** Does a sum end up inside a product or quotient (so it needs a bracket or fraction bar)? */
function sumInsideProduct(e: Ex, under = false): boolean {
  switch (e.t) {
    case "v":
      return false;
    case "add":
      return under || sumInsideProduct(e.e, under);
    case "mul":
    case "div":
      return sumInsideProduct(e.e, true);
    case "pow":
    case "sqrt":
      return sumInsideProduct(e.e, under);
  }
}

/* ---- machine rows ---- */

function MachineRow({ startName, endName, ops, vals, label }: { startName: string; endName: string; ops: { op: AnyOp; n: number }[]; vals: Val[]; label: string }) {
  const aria = `${label}: ${startName} = ${valTx(vals[0])}${ops.map((o, i) => `, ${opWords(o.op, o.n)} gives ${valTx(vals[i + 1])}`).join("")}, so ${endName} = ${valTx(vals[vals.length - 1])}.`;
  return (
    <div role="group" aria-label={aria} className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      <span className="rounded-lg border border-line bg-surface px-2.5 py-1.5 font-bold tabular-nums text-ink">
        <span className="text-ink-2">{startName} =</span> <ValView v={vals[0]} />
      </span>
      {ops.map((o, i) => (
        <Fragment key={i}>
          <span aria-hidden className="text-ink-2">
            →
          </span>
          <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-sm font-extrabold text-brand">{opBox(o.op, o.n)}</span>
          <span aria-hidden className="text-ink-2">
            →
          </span>
          {i === ops.length - 1 ? (
            <span className="rounded-lg border-2 border-brand bg-surface px-2.5 py-1.5 font-extrabold tabular-nums text-ink">
              <ValView v={vals[i + 1]} /> <span className="text-ink-2">= {endName}</span>
            </span>
          ) : (
            <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 font-bold tabular-nums text-ink">
              <ValView v={vals[i + 1]} />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

type Count = "1" | "2" | "3";

interface Preset {
  label: string;
  inName: string;
  outName: string;
  steps: Step[];
  x: number;
}

const PRESETS: Preset[] = [
  { label: "y = 3x + 5", inName: "x", outName: "y", steps: [{ op: "mul", n: 3 }, { op: "add", n: 5 }], x: 4 },
  { label: "°C → °F", inName: "C", outName: "F", steps: [{ op: "mul", n: 9 }, { op: "div", n: 5 }, { op: "add", n: 32 }], x: 20 },
  { label: "Squared (stretch)", inName: "x", outName: "y", steps: [{ op: "sq", n: 2 }, { op: "mul", n: 3 }], x: 2 },
];

const OP_OPTIONS: { value: Op; label: ReactNode }[] = [
  { value: "add", label: "+" },
  { value: "sub", label: "−" },
  { value: "mul", label: "×" },
  { value: "div", label: "÷" },
  { value: "sq", label: "( )²" },
];

const IN_MIN = -40;
const IN_MAX = 40;

function FormulaMachine() {
  const [inName, setInName] = useState("x");
  const [outName, setOutName] = useState("y");
  const [steps, setSteps] = useState<Step[]>([
    { op: "mul", n: 3 },
    { op: "add", n: 5 },
    { op: "sub", n: 1 },
  ]);
  const [count, setCount] = useState<Count>("2");
  const [input, setInput] = useState(4);

  const active = steps.slice(0, Number(count));
  const setStep = (i: number, patch: Partial<Step>) => setSteps((ss) => ss.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const load = (p: Preset) => {
    setInName(p.inName);
    setOutName(p.outName);
    setSteps([0, 1, 2].map((i) => p.steps[i] ?? { op: "add", n: 1 }));
    setCount(String(p.steps.length) as Count);
    setInput(p.x);
  };

  // Forwards: substitution.
  const fwdVals: Val[] = [rat(input)];
  for (const s of active) fwdVals.push(applyVal(fwdVals[fwdVals.length - 1], s.op, s.n));
  const output = fwdVals[fwdVals.length - 1];

  // Backwards: inverse operations in reverse order.
  const invOps = [...active].reverse().map((s) => ({ op: INVERSE[s.op], n: s.n }));
  const backVals: Val[] = [output];
  for (const s of invOps) backVals.push(applyVal(backVals[backVals.length - 1], s.op, s.n));
  const recovered = backVals[backVals.length - 1];

  // Formulae.
  let fwdEx: Ex = { t: "v", name: inName };
  for (const s of active) fwdEx = applyEx(fwdEx, s.op, s.n);
  let invEx: Ex = { t: "v", name: outName };
  for (const s of invOps) invEx = applyEx(invEx, s.op, s.n);
  const fwdF = `${outName} = ${pr(fwdEx).s}`;
  const invF = `${inName} = ${pr(invEx).s}`;

  const last = active[active.length - 1];
  const hasSq = active.some((s) => s.op === "sq");
  // Checked on the simplified formula, so e.g. "+ 5, × 1" or "+ 5, − 5, × 3" (no bracket left) don't trigger it.
  const addThenMul = sumInsideProduct(fwdEx);
  const fixed = sameVal(fwdVals[0], output);
  const backOk = sameVal(recovered, fwdVals[0]);
  const words = `Start with ${inName}, ${active.map((s) => opWords(s.op, s.n)).join(", then ")}.`;

  const tryThis = [
    "Build {{y = 3(x + 5)}}. Which order do the two steps have to go in?",
    "Build a machine whose rearranged formula is {{x = 2y - 6}}.",
    "Load °C → °F. Find the one temperature that is the same in both scales.",
    "Stretch: load the squared machine and try the inputs 2 and −2. Why does the reverse machine give back 2 both times?",
  ];

  const caption = (
    <div className="space-y-2">
      <p>
        The machine&apos;s last step is <strong>{opWords(last.op, last.n)}</strong>, so it is the first thing to undo. Reverse the order{" "}
        <strong>and</strong> swap each step for its inverse (+ ↔ −, × ↔ ÷, square ↔ √).
      </p>
      <p>
        That turns <M>{fwdF}</M> into <M>{invF}</M>: now <M>{inName}</M> is the <strong>subject</strong>, so you can find it straight from{" "}
        <M>{outName}</M>.
      </p>
      {addThenMul ? (
        <p>Order matters: you add or subtract <em>before</em> multiplying or dividing, so the whole sum gets multiplied — that&apos;s why the formula needs a bracket or a fraction bar.</p>
      ) : null}
      {hasSq ? (
        <p>
          Squaring hides the sign: <M>{"2^2"}</M> and <M>{"(-2)^2"}</M> are both 4. The √ step only gives the positive root, so there can be a
          second answer that comes from the negative root — that&apos;s why full solutions use ±.
        </p>
      ) : null}
    </div>
  );

  return (
    <WidgetFrame title="Formula machine: do and undo" tryThis={tryThis} caption={caption}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-2">Load an example:</span>
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className="btn btn-secondary" onClick={() => load(p)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 rounded-xl border border-line p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-ink-2">Number of steps</span>
            <Segmented<Count>
              label="Number of steps"
              value={count}
              onChange={setCount}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
            />
          </div>
          {active.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-2">
              <span className="w-14 text-sm font-bold text-ink-2">Step {i + 1}</span>
              <Segmented<Op> label={`Step ${i + 1} operation`} value={s.op} onChange={(op) => setStep(i, { op })} options={OP_OPTIONS} />
              {s.op !== "sq" ? (
                <div className="min-w-[9rem]">
                  <Stepper label={<span className="sr-only">Step {i + 1} number</span>} value={s.n} min={1} max={50} onChange={(n) => setStep(i, { n })} />
                </div>
              ) : null}
            </div>
          ))}
          <p className="text-sm text-ink-2">{words}</p>
        </div>

        <div className="flex items-end gap-2">
          <button type="button" className="kbd" aria-label={`decrease ${inName} by 1`} onClick={() => setInput((v) => Math.max(IN_MIN, v - 1))}>
            −
          </button>
          <div className="min-w-0 flex-1">
            <Slider label={`Input ${inName}`} value={input} min={IN_MIN} max={IN_MAX} onChange={setInput} format={signed} />
          </div>
          <button type="button" className="kbd" aria-label={`increase ${inName} by 1`} onClick={() => setInput((v) => Math.min(IN_MAX, v + 1))}>
            +
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-2">Forwards (substitute)</p>
            <MachineRow label="Forward machine" startName={inName} endName={outName} ops={active} vals={fwdVals} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-2">Backwards (undo)</p>
            <MachineRow label="Reverse machine" startName={outName} endName={inName} ops={invOps} vals={backVals} />
          </div>
          <p className={`text-sm font-bold ${backOk ? "text-good" : "text-bad"}`} aria-live="polite">
            {backOk ? (
              <>
                ✓ The reverse machine takes {outName} straight back to {inName} = <ValView v={recovered} />.
              </>
            ) : (
              <>
                The reverse machine gives <ValView v={recovered} />, not <ValView v={fwdVals[0]} />: the inputs <ValView v={fwdVals[0]} /> and{" "}
                <ValView v={recovered} /> both give {outName} = <ValView v={output} />, because squaring hid the sign.
              </>
            )}
          </p>
          {fixed ? (
            <p className="rounded-xl bg-accent-soft p-3 text-sm font-bold text-ink">
              Input = output! This machine leaves {inName} = {signed(input)} unchanged.
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Readout label="Formula" value={<M>{fwdF}</M>} />
          <Readout label={`Rearranged: ${inName} as the subject`} value={<M>{invF}</M>} tone="good" />
        </div>
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */

export const widgets: WidgetDef[] = [
  {
    id: "bracket-grid",
    title: "Bracket grid",
    blurb: "Expand a bracket with the grid method and check it by substituting — then run the grid backwards to factorise.",
    Component: BracketGrid,
  },
  {
    id: "formula-machine",
    title: "Formula machine",
    blurb: "Build a formula from steps, run it forwards, then undo it in reverse to change the subject.",
    Component: FormulaMachine,
  },
];
