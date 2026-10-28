"use client";
// Interactive explorables for "Integers, Powers & Roots".
//  1. Counters and zero pairs — +, − and × of directed numbers, step by step,
//     with a number line that shows the same calculation as jumps.
//  2. Index laws — write powers out as repeated factors, then multiply, divide
//     or raise to a power and watch the factors join, cancel or repeat.
import { useMemo, useState, type ReactNode } from "react";
import { WidgetFrame, Slider, Stepper, Segmented, Readout, M, type WidgetDef } from "./kit";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Plain-text number with a real minus sign. */
const txt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));
/** Maths-markup number; `br` wraps negatives in brackets (for a second operand). */
const mm = (n: number, br = false) => (n < 0 ? (br ? `(-${-n})` : `-${-n}`) : String(n));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (v: number) => Math.round(v * 100) / 100;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// ===========================================================================
// 1. Counters and zero pairs
// ===========================================================================

type Op = "add" | "sub" | "mul";
type Status = "start" | "new" | "pair" | "removed" | "cancelled";
type Slot = "pos" | "neg";

/** One column of the counter board: an optional + counter above an optional − counter. */
interface Col {
  pos?: Status;
  neg?: Status;
  /** Group index (used to space out the "lots" in multiplication). */
  group: number;
  /** True for a zero pair that was added to the board. */
  zp?: boolean;
}

interface Stage {
  title: string;
  cols: Col[];
}

const slotOf = (sign: number): Slot => (sign > 0 ? "pos" : "neg");
const withSlot = (c: Col, slot: Slot, st: Status): Col => (slot === "pos" ? { ...c, pos: st } : { ...c, neg: st });
const single = (sign: number, st: Status, group = 0): Col => withSlot({ group }, slotOf(sign), st);
const singles = (count: number, sign: number, st: Status, groupSize = 0): Col[] =>
  Array.from({ length: count }, (_, i) => single(sign, st, groupSize > 0 ? Math.floor(i / groupSize) : 0));
const kind = (sign: number, count: number) => plural(count, sign > 0 ? "positive" : "negative");

function boardValue(cols: Col[]): number {
  let v = 0;
  for (const c of cols) {
    if (c.pos && c.pos !== "removed") v += 1;
    if (c.neg && c.neg !== "removed") v -= 1;
  }
  return v;
}

function resultStage(v: number, groupSize = 0): Stage {
  return {
    title: v === 0 ? "Result: nothing left, so the value is 0" : `Result: ${kind(Math.sign(v), Math.abs(v))} left`,
    cols: singles(Math.abs(v), Math.sign(v), "start", groupSize),
  };
}

function startStage(a: number): Stage {
  return {
    title: a === 0 ? "Start with 0: an empty board" : `Start with ${txt(a)}: ${kind(Math.sign(a), Math.abs(a))}`,
    cols: singles(Math.abs(a), Math.sign(a), "start"),
  };
}

function buildAdd(a: number, b: number): Stage[] {
  const stages: Stage[] = [startStage(a)];
  const A = Math.abs(a);
  const B = Math.abs(b);
  if (b === 0) {
    stages.push({ title: "Put in no counters at all", cols: stages[0].cols });
  } else {
    let cols: Col[];
    if (a === 0 || Math.sign(a) === Math.sign(b)) {
      cols = [...stages[0].cols, ...singles(B, Math.sign(b), "new")];
    } else {
      // New counters slot in beside the opposite counters, so pairs line up.
      const m = Math.min(A, B);
      cols = stages[0].cols.map((c, i) => (i < m ? withSlot(c, slotOf(Math.sign(b)), "new") : c));
      if (B > A) cols = [...cols, ...singles(B - A, Math.sign(b), "new")];
    }
    stages.push({ title: `Put in ${kind(Math.sign(b), B)}`, cols });
    const pairs = cols.filter((c) => c.pos && c.neg).length;
    if (pairs > 0) {
      stages.push({
        title: `Each + with a − makes 0: cancel ${plural(pairs, "zero pair")}`,
        cols: cols.map((c) => (c.pos && c.neg ? { pos: "cancelled", neg: "cancelled", group: 0 } : c)),
      });
    }
  }
  stages.push(resultStage(a + b));
  return stages;
}

/** How many zero pairs a − b needs before b can be taken away. */
function zeroPairsNeeded(a: number, b: number): number {
  if (b === 0) return 0;
  const have = Math.sign(a) === Math.sign(b) ? Math.abs(a) : 0;
  return Math.max(0, Math.abs(b) - have);
}

function buildSub(a: number, b: number): Stage[] {
  const stages: Stage[] = [startStage(a)];
  if (b === 0) {
    stages.push({ title: "Take away nothing", cols: stages[0].cols });
  } else {
    const s = Math.sign(b);
    const B = Math.abs(b);
    const k = zeroPairsNeeded(a, b);
    let cols = stages[0].cols;
    if (k > 0) {
      const have = B - k;
      const word = s > 0 ? "positive" : "negative";
      cols = [...cols, ...Array.from({ length: k }, (): Col => ({ pos: "pair", neg: "pair", group: 0, zp: true }))];
      stages.push({
        title: `${have === 0 ? `No ${word}s` : `Only ${plural(have, word)}`} on the board, so add ${plural(k, "zero pair")}`,
        cols,
      });
    }
    let left = B;
    const slot = slotOf(s);
    const taken = cols.map((c) => {
      if (left > 0 && c[slot]) {
        left -= 1;
        return withSlot(c, slot, "removed");
      }
      return c;
    });
    stages.push({ title: `Take away ${kind(s, B)}`, cols: taken });
  }
  stages.push(resultStage(a - b));
  return stages;
}

function buildMul(a: number, b: number): Stage[] {
  const stages: Stage[] = [{ title: "Start with an empty board (value 0)", cols: [] }];
  const A = Math.abs(a);
  const B = Math.abs(b);
  const n = A * B;
  if (a === 0 || b === 0) {
    stages.push({
      title: a === 0 ? "0 lots: nothing is put in or taken away, so the value stays 0" : "Every lot is empty: nothing to put in or take away, so the value stays 0",
      cols: [],
    });
    return stages;
  }
  const s = Math.sign(b);
  const grp = (i: number) => Math.floor(i / B);
  if (a > 0) {
    stages.push({
      title: `Put in ${plural(A, "lot")} of ${txt(b)}`,
      cols: Array.from({ length: n }, (_, i) => single(s, "new", grp(i))),
    });
  } else {
    const pairs = Array.from({ length: n }, (_, i): Col => ({ pos: "pair", neg: "pair", group: grp(i), zp: true }));
    stages.push({ title: `Nothing to take away yet, so add ${plural(n, "zero pair")}`, cols: pairs });
    stages.push({ title: `Take away ${plural(A, "lot")} of ${txt(b)}`, cols: pairs.map((c) => withSlot(c, slotOf(s), "removed")) });
  }
  stages.push(resultStage(a * b, B));
  return stages;
}

// --- drawing ---------------------------------------------------------------

const BW = 380;
const BH = 58;
const COL_W = 21;
const GROUP_GAP = 10;
const CR = 8.5;
const Y_POS = 16;
const Y_NEG = 42;

function Counter({ x, y, sign, status }: { x: number; y: number; sign: number; status: Status }) {
  const faded = status === "removed" || status === "cancelled";
  const pos = sign > 0;
  return (
    <g>
      <g opacity={faded ? 0.3 : 1}>
        <circle
          cx={x}
          cy={y}
          r={CR}
          className={pos ? "fill-brand-soft stroke-brand" : "fill-bad-soft stroke-bad"}
          strokeWidth={status === "new" ? 3 : 1.5}
        />
        <text x={x} y={y + 4.5} textAnchor="middle" fontSize={14} fontWeight={800} className={pos ? "fill-brand" : "fill-bad"}>
          {pos ? "+" : "−"}
        </text>
      </g>
      {status === "removed" ? (
        <path d={`M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}`} className="stroke-ink" strokeWidth={2} strokeLinecap="round" />
      ) : null}
    </g>
  );
}

function describeBoard(cols: Col[]): string {
  let p = 0;
  let q = 0;
  let removed = 0;
  let zp = 0;
  let cancelled = 0;
  for (const c of cols) {
    if (c.pos === "removed") removed++;
    else if (c.pos) p++;
    if (c.neg === "removed") removed++;
    else if (c.neg) q++;
    if (c.zp) zp++;
    if (c.pos === "cancelled") cancelled++;
  }
  if (!cols.length) return "Empty board. Value 0.";
  const parts = [`${plural(p, "positive counter")} and ${plural(q, "negative counter")}`];
  if (zp) parts.push(`including ${plural(zp, "added zero pair")}`);
  if (cancelled) parts.push(`${plural(cancelled, "zero pair")} cancelling`);
  if (removed) parts.push(`${plural(removed, "counter")} crossed out (taken away)`);
  return `${parts.join(", ")}. Value ${txt(boardValue(cols))}.`;
}

function Board({ cols }: { cols: Col[] }) {
  const groups = cols.length ? Math.max(...cols.map((c) => c.group)) : 0;
  const width = cols.length ? (cols.length - 1) * COL_W + groups * GROUP_GAP : 0;
  const x0 = (BW - width) / 2;
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} className="h-auto w-full" role="img" aria-label={describeBoard(cols)}>
      {!cols.length ? (
        <text x={BW / 2} y={BH / 2 + 4} textAnchor="middle" fontSize={13} className="fill-ink-2">
          empty board — value 0
        </text>
      ) : null}
      {cols.map((c, i) => {
        const x = r2(x0 + i * COL_W + c.group * GROUP_GAP);
        return (
          <g key={i}>
            {c.zp ? (
              <rect x={x - 10} y={4} width={20} height={50} rx={9} fill="none" className="stroke-accent" strokeWidth={1.5} strokeDasharray="4 3" />
            ) : null}
            {c.pos === "cancelled" ? (
              <>
                <rect x={x - 10} y={4} width={20} height={50} rx={9} className="fill-surface-2" />
                <line x1={x} x2={x} y1={Y_POS + CR} y2={Y_NEG - CR} className="stroke-ink-2" strokeWidth={2} />
              </>
            ) : null}
            {c.pos ? <Counter x={x} y={Y_POS} sign={1} status={c.pos} /> : null}
            {c.neg ? <Counter x={x} y={Y_NEG} sign={-1} status={c.neg} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

// Number line showing the same calculation as jumps.
const NW = 380;
const NH = 78;
const NY = 50;
const NPAD = 18;

function arrowHead(x2: number, y2: number, cx: number, cy: number): string {
  const dx = x2 - cx;
  const dy = y2 - cy;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const bx = x2 - 8 * ux;
  const by = y2 - 8 * uy;
  return `M${r2(x2)} ${r2(y2)}L${r2(bx - 4 * uy)} ${r2(by + 4 * ux)}L${r2(bx + 4 * uy)} ${r2(by - 4 * ux)}Z`;
}

function Hop({ x1, x2, h, dashed, label }: { x1: number; x2: number; h: number; dashed?: boolean; label?: string }) {
  const y = NY - 3;
  const cx = (x1 + x2) / 2;
  const cy = y - 2 * h;
  const cls = dashed ? "stroke-ink-2" : "stroke-accent";
  return (
    <g opacity={dashed ? 0.7 : 1}>
      <path d={`M${r2(x1)} ${y}Q${r2(cx)} ${r2(cy)} ${r2(x2)} ${y}`} fill="none" className={cls} strokeWidth={2.5} strokeDasharray={dashed ? "5 4" : undefined} />
      <path d={arrowHead(x2, y, cx, cy)} className={dashed ? "fill-ink-2" : "fill-accent"} />
      {label ? (
        <text x={r2(cx)} y={r2(y - h - 6)} textAnchor="middle" fontSize={12} fontWeight={800} className="fill-ink">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function JumpLine({ op, a, b }: { op: Op; a: number; b: number }) {
  const R = op === "mul" ? 16 : 12;
  const every = op === "mul" ? 4 : 2;
  const ux = (NW - 2 * NPAD) / (2 * R);
  const X = (v: number) => NPAD + (v + R) * ux;
  const ticks = Array.from({ length: 2 * R + 1 }, (_, i) => i - R);
  const hops: ReactNode[] = [];
  let start = 0;
  let end = 0;
  let aria = "";
  if (op === "add" || op === "sub") {
    start = a;
    end = op === "add" ? a + b : a - b;
    const move = end - start;
    const label = op === "add" ? `+${b < 0 ? `(${txt(b)})` : b}` : `−${b < 0 ? `(${txt(b)})` : b}`;
    if (move !== 0) {
      const h = clamp(8 + 0.18 * Math.abs(move) * ux, 10, 26);
      hops.push(<Hop key="h" x1={X(start)} x2={X(end)} h={h} label={label} />);
    }
    aria = `Number line from ${txt(-R)} to ${R}. Start at ${txt(start)}, ${move === 0 ? "stay put" : `move ${Math.abs(move)} to the ${move > 0 ? "right" : "left"}`}, and land on ${txt(end)}.`;
  } else {
    end = a * b;
    const A = Math.abs(a);
    if (a !== 0 && b !== 0) {
      const h = 11;
      // The hops of b (dashed when they are going to be reflected).
      for (let i = 0; i < A; i++) hops.push(<Hop key={`g${i}`} x1={X(i * b)} x2={X((i + 1) * b)} h={h} dashed={a < 0} />);
      if (a < 0) for (let i = 0; i < A; i++) hops.push(<Hop key={`r${i}`} x1={X(-i * b)} x2={X(-(i + 1) * b)} h={h} />);
    }
    aria =
      a === 0 || b === 0
        ? `Number line from ${txt(-R)} to ${R}. No hops, so the answer stays at 0.`
        : a > 0
          ? `Number line from ${txt(-R)} to ${R}. ${plural(A, "hop")} of ${txt(b)} from 0 land on ${txt(end)}.`
          : `Number line from ${txt(-R)} to ${R}. Dashed: ${plural(A, "hop")} of ${txt(b)} from 0. Solid: the same hops reflected through 0, landing on ${txt(end)}.`;
  }
  return (
    <svg viewBox={`0 0 ${NW} ${NH}`} className="h-auto w-full" role="img" aria-label={aria}>
      <line x1={NPAD - 6} x2={NW - NPAD + 6} y1={NY} y2={NY} className="stroke-ink-2" strokeWidth={1.5} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={r2(X(t))} x2={r2(X(t))} y1={NY - (t % every === 0 ? 5 : 3)} y2={NY + (t % every === 0 ? 5 : 3)} className={t === 0 ? "stroke-ink" : "stroke-ink-2"} strokeWidth={t === 0 ? 2 : 1} />
          {t % every === 0 ? (
            <text x={r2(X(t))} y={NY + 19} textAnchor="middle" fontSize={11} fontWeight={t === 0 ? 800 : 500} className="fill-ink-2">
              {txt(t)}
            </text>
          ) : null}
        </g>
      ))}
      {hops}
      <circle cx={r2(X(start))} cy={NY} r={5} className="fill-brand" />
      <circle cx={r2(X(end))} cy={NY} r={6} className="fill-good stroke-surface" strokeWidth={2} />
    </svg>
  );
}

function Legend() {
  const dot = (pos: boolean) => (
    <span
      aria-hidden
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-extrabold ${pos ? "border-brand bg-brand-soft text-brand" : "border-bad bg-bad-soft text-bad"}`}
    >
      {pos ? "+" : "−"}
    </span>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
      <span className="inline-flex items-center gap-1">{dot(true)} = +1</span>
      <span className="inline-flex items-center gap-1">{dot(false)} = −1</span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden className="inline-block h-5 w-3 rounded-md border-2 border-dashed border-accent" /> zero pair: +1 + (−1) = 0
      </span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden className="font-extrabold text-ink">✕</span> taken away
      </span>
    </div>
  );
}

function countersCaption(op: Op, a: number, b: number): ReactNode {
  if (op === "add") {
    const r = a + b;
    const sum = <M>{`${mm(a)} + ${mm(b, true)} = ${mm(r)}`}</M>;
    if (b === 0) return <>Adding 0 changes nothing: {sum}.</>;
    if (a === 0 || Math.sign(a) === Math.sign(b)) {
      return (
        <>
          {a === 0 ? (
            <>Start from an empty board and put in {kind(Math.sign(b), Math.abs(b))}.</>
          ) : (
            <>
              Same signs, so nothing cancels: {kind(Math.sign(a), Math.abs(a))} and {Math.abs(b)} more make {kind(Math.sign(b), Math.abs(r))}.
            </>
          )}{" "}
          {sum}.{" "}
          {b < 0 ? <>Adding a negative moves you <strong>left</strong> on the number line.</> : <>Adding a positive moves you right.</>}
        </>
      );
    }
    const pairs = Math.min(Math.abs(a), Math.abs(b));
    return (
      <>
        A + counter and a − counter together make 0, so {plural(pairs, "zero pair")} cancel{pairs === 1 ? "s" : ""}
        {r === 0 ? <> and nothing is left — {txt(a)} and {txt(b)} are opposites</> : <> and {kind(Math.sign(r), Math.abs(r))} {Math.abs(r) === 1 ? "is" : "are"} left</>}. {sum}.{" "}
        {b < 0 ? <>Adding a negative moves you <strong>left</strong>, just like subtracting {Math.abs(b)}.</> : <>Adding a positive moves you right.</>}
      </>
    );
  }
  if (op === "sub") {
    const r = a - b;
    const diff = <M>{`${mm(a)} - ${mm(b, true)} = ${mm(r)}`}</M>;
    if (b === 0) return <>Taking away nothing leaves {txt(a)}: {diff}.</>;
    const k = zeroPairsNeeded(a, b);
    const B = Math.abs(b);
    const what = b > 0 ? "positives" : "negatives";
    if (k === 0) {
      return (
        <>
          There are enough {what} to take {B} away directly, so {diff}.{" "}
          {b < 0 ? (
            <>
              Check: <M>{`${mm(a)} + ${B} = ${mm(r)}`}</M> too, because <strong>subtracting a negative is the same as adding a positive</strong>.
            </>
          ) : null}
        </>
      );
    }
    return (
      <>
        You need to take away {kind(Math.sign(b), B)}, but there {B - k === 0 ? "are none" : B - k === 1 ? "is only 1" : `are only ${B - k}`}. Adding {plural(k, "zero pair")} doesn&apos;t change the value
        (still {txt(a)}), but it gives you enough {what} to take away. What&apos;s left is {diff}.{" "}
        {b < 0 ? (
          <>
            Taking negatives out of the zero pairs leaves their positive partners behind, so <M>{`${mm(a)} - ${mm(b, true)} = ${mm(a)} + ${B}`}</M>:{" "}
            <strong>subtracting a negative is the same as adding a positive</strong>.
          </>
        ) : (
          <>{a > 0 ? "Taking away more than you have takes you below zero." : "Taking away positives moves you left (down) the number line."}</>
        )}
      </>
    );
  }
  const r = a * b;
  const prod = <M>{`${mm(a)} * ${mm(b, true)} = ${mm(r)}`}</M>;
  if (a === 0 || b === 0) return <>Zero lots of anything, or any number of lots of nothing, is 0: {prod}.</>;
  const A = Math.abs(a);
  const B = Math.abs(b);
  const rule =
    Math.sign(a) === Math.sign(b) ? <>Same signs → <strong>positive</strong> answer.</> : <>Different signs → <strong>negative</strong> answer.</>;
  if (a > 0) {
    return (
      <>
        <M>{`${mm(a)} * ${mm(b, true)}`}</M> means {plural(A, "lot")} of {txt(b)}: put in {plural(A, "group")} of {kind(Math.sign(b), B)}, which is{" "}
        {kind(Math.sign(b), A * B)} altogether. So {prod}. {rule}
      </>
    );
  }
  return (
    <>
      <M>{`${mm(a)} * ${mm(b, true)}`}</M> means <em>take away</em> {plural(A, "lot")} of {txt(b)}. The board is empty, so first add {plural(A * B, "zero pair")}{" "}
      (value still 0). Taking away {kind(Math.sign(b), A * B)} leaves {kind(Math.sign(r), A * B)}: {prod}. On the number line {A === 1 ? "the hop" : "the hops"} of {txt(b)}{" "}
      {A === 1 ? "is" : "are"} <strong>reflected</strong> through 0. {rule}
    </>
  );
}

function CountersWidget() {
  const [op, setOp] = useState<Op>("sub");
  const [a, setA] = useState(3);
  const [b, setB] = useState(-4);
  const lim = op === "mul" ? 4 : 6;
  const changeOp = (o: Op) => {
    const L = o === "mul" ? 4 : 6;
    setOp(o);
    setA((v) => clamp(v, -L, L));
    setB((v) => clamp(v, -L, L));
  };
  const stages = useMemo(() => (op === "add" ? buildAdd(a, b) : op === "sub" ? buildSub(a, b) : buildMul(a, b)), [op, a, b]);
  const result = op === "add" ? a + b : op === "sub" ? a - b : a * b;
  const sym = op === "add" ? "+" : op === "sub" ? "-" : "*";

  return (
    <WidgetFrame
      title="Counters and zero pairs"
      tryThis={[
        "Compare {{3 - (-4)}} with {{3 + 4}}. Why do the counters give the same answer?",
        "In − mode, find a subtraction of two *positive* numbers that still needs zero pairs.",
        "In × mode, make {{-3 * (-2)}}. Where do the 6 positives come from?",
        "Find three different subtractions whose answer is −2.",
      ]}
      caption={countersCaption(op, a, b)}
    >
      <div className="space-y-4">
        <Segmented<Op>
          label="Operation"
          value={op}
          onChange={changeOp}
          options={[
            { value: "add", label: "a + b" },
            { value: "sub", label: "a − b" },
            { value: "mul", label: "a × b" },
          ]}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Slider label={op === "mul" ? "a (how many lots)" : "First number a"} value={a} min={-lim} max={lim} onChange={setA} format={txt} />
          <Slider label={op === "mul" ? "b (in each lot)" : "Second number b"} value={b} min={-lim} max={lim} onChange={setB} format={txt} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Readout label="Calculation" tone="ink" value={<M>{`${mm(a)} ${sym} ${mm(b, true)}`}</M>} />
          <Readout label="Answer" tone={result < 0 ? "bad" : result > 0 ? "brand" : "ink"} value={txt(result)} />
        </div>
        <Legend />
        <ol className="space-y-2" aria-label="Counter steps">
          {stages.map((st, i) => {
            const last = i === stages.length - 1;
            return (
              <li key={`${op}-${i}`} className={`rounded-xl border p-2 ${last ? "border-good bg-good-soft" : "border-line bg-surface"}`}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-bold text-ink">
                    <span className="text-brand">Step {i + 1}</span> · {st.title}
                  </span>
                  <span className="shrink-0 font-extrabold tabular-nums text-ink-2">value {txt(boardValue(st.cols))}</span>
                </div>
                <Board cols={st.cols} />
              </li>
            );
          })}
        </ol>
        <div className="rounded-xl border border-line bg-surface p-2">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-2">Same calculation on a number line</div>
          <JumpLine op={op} a={a} b={b} />
        </div>
      </div>
    </WidgetFrame>
  );
}

// ===========================================================================
// 2. Index laws: count the factors
// ===========================================================================

type Base = "2" | "3" | "10" | "-2" | "x";
type Law = "mul" | "div" | "pow";

const BASE_MARKUP: Record<Base, string> = { "2": "2", "3": "3", "10": "10", "-2": "(-2)", x: "x" };
const BASE_TEXT: Record<Base, string> = { "2": "2", "3": "3", "10": "10", "-2": "(−2)", x: "x" };

/** Maths markup for base^k. */
const pw = (base: Base, k: number) => `${BASE_MARKUP[base]}^${k < 0 ? `(-${-k})` : k}`;
const withCommas = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function Chip({ base, tone, struck }: { base: Base; tone: "a" | "b"; struck?: boolean }) {
  const toneCls = tone === "a" ? "border-brand bg-brand-soft text-brand" : "border-accent bg-accent-soft text-ink";
  return (
    <span
      className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg border px-1.5 text-sm font-extrabold tabular-nums ${toneCls} ${
        struck ? "line-through decoration-bad decoration-2 opacity-40" : ""
      }`}
    >
      {base === "x" ? <em>x</em> : base === "-2" ? "−2" : base}
    </span>
  );
}

const Times = () => (
  <span aria-hidden className="text-sm font-bold text-ink-2">
    ×
  </span>
);

function One() {
  return (
    <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-line bg-surface px-1.5 text-sm font-extrabold text-ink">1</span>
  );
}

/** A row of `count` factors joined by ×. `struck` = how many (from the left) are cancelled. */
function FactorRow({ base, count, tone, struck = 0, toneSplit }: { base: Base; count: number; tone: "a" | "b"; struck?: number; toneSplit?: number }) {
  if (count === 0) return <One />;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 ? <Times /> : null}
          <Chip base={base} tone={toneSplit !== undefined ? (i < toneSplit ? "a" : "b") : tone} struck={i < struck} />
        </span>
      ))}
    </span>
  );
}

function Bracket({ children }: { children: ReactNode }) {
  return <span className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-dashed border-line bg-surface-2 px-1.5 py-1">{children}</span>;
}

function ValueOf({ base, e }: { base: Base; e: number }) {
  if (base === "x") {
    if (e === 0) return <>1</>;
    return <M>{e > 0 ? pw("x", e) : `1/${pw("x", -e)}`}</M>;
  }
  const b = BigInt(Number(base));
  if (e >= 0) return <span className="break-all">{withCommas((b ** BigInt(e)).toString()).replace("-", "−")}</span>;
  const k = -e;
  const den = b ** BigInt(k);
  const negative = den < BigInt(0);
  const absDen = negative ? -den : den;
  const frac = <M>{`${negative ? "-" : ""}1/${absDen.toString()}`}</M>;
  if (base === "3") return frac;
  // 1/2^k = 5^k / 10^k and 1/10^k terminate, so show the exact decimal too.
  const digits = base === "10" ? "1".padStart(k, "0") : (BigInt(5) ** BigInt(k)).toString().padStart(k, "0");
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2">
      {frac}
      <span className="text-base text-ink-2">= {negative ? "−" : ""}0.{digits}</span>
    </span>
  );
}

function indexCaption(base: Base, law: Law, m: number, n: number): ReactNode {
  const B = BASE_TEXT[base];
  const fac = (k: number) => plural(k, `factor of ${B}`, `factors of ${B}`);
  const xNote = base === "x" ? <> (for any <M>{"x != 0"}</M>)</> : null;
  let main: ReactNode;
  if (law === "mul") {
    const eq = <M>{`${pw(base, m)} * ${pw(base, n)} = ${pw(base, m + n)}`}</M>;
    if (m === 0 || n === 0) {
      main = (
        <>
          <M>{pw(base, 0)}</M> has no factors of {B} at all — it is just 1{xNote}, and multiplying by 1 changes nothing. So {eq}: the law still works, because adding 0
          to an index changes nothing.
        </>
      );
    } else {
      main = (
        <>
          <M>{pw(base, m)}</M> is {fac(m)} and <M>{pw(base, n)}</M> is {n} more. Multiplied together that&apos;s {m} + {n} = {fac(m + n)}, so {eq}.{" "}
          <strong>Same base, multiplying → add the indices.</strong>
        </>
      );
    }
  } else if (law === "div") {
    const eq = <M>{`${pw(base, m)} ÷ ${pw(base, n)} = ${pw(base, m - n)}`}</M>;
    if (m > n) {
      main =
        n === 0 ? (
          <>
            Dividing by <M>{pw(base, 0)}</M> = 1 changes nothing{xNote}, so {eq}.
          </>
        ) : (
          <>
            {n === 1 ? <>The factor of {B} on the bottom cancels one on top</> : <>The {fac(n)} on the bottom cancel {n} on top</>}, leaving {m} − {n} ={" "}
            {m - n}. So {eq}. <strong>Same base, dividing → subtract the indices.</strong>
          </>
        );
    } else if (m === 0 && n === 0) {
      main = (
        <>
          There are no factors on top or bottom: this is just 1 ÷ 1 = 1, and the law agrees: {eq}. Try a bigger matching pair, like <M>{"m = n = 3"}</M>, to see{" "}
          <em>why</em> <M>{pw(base, 0)}</M> has to be 1.
        </>
      );
    } else if (m === n) {
      main = (
        <>
          Every factor cancels, so the answer is 1{xNote}. But the law says {eq}. Both must be right, so <M>{`${pw(base, 0)} = 1`}</M>. That is <em>why</em> any
          (non-zero) number to the power 0 is 1.
        </>
      );
    } else {
      const k = n - m;
      main = (
        <>
          {m === 0 ? <>The top is just 1, so {n === 1 ? "the one factor stays" : `all ${n} factors stay`} on the bottom</> :<>{m === 1 ? "The one factor" : `All ${m} factors`} on top cancel{m === 1 ? "s" : ""}, leaving {fac(k)} on the bottom</>}: the answer is{" "}
          <M>{`1/${pw(base, k)}`}</M>. The law says {eq}, so <M>{`${pw(base, -k)} = 1/${pw(base, k)}`}</M>
          {xNote}. <strong>A negative index means “one over”</strong> (a stretch idea).
        </>
      );
    }
  } else {
    const eq = <M>{`(${pw(base, m)})^${n} = ${pw(base, m * n)}`}</M>;
    if (n === 0) {
      main = (
        <>
          Zero copies means nothing gets multiplied, so you are left with 1 — the number every multiplication starts from. The law agrees: {eq}, and{" "}
          <M>{`${pw(base, 0)} = 1`}</M>
          {xNote}.
        </>
      );
    } else if (m === 0) {
      main = (
        <>
          {n === 1 ? <>The one copy is</> : <>Each copy is</>} <M>{pw(base, 0)}</M> = 1{xNote}{n === 1 ? "" : ", and 1 × 1 × … = 1"}. So {eq}.
        </>
      );
    } else {
      main = (
        <>
          <M>{`(${pw(base, m)})^${n}`}</M> means {n === 1 ? "just one copy" : `${n} copies`} of <M>{pw(base, m)}</M>
          {n === 1 ? "" : " multiplied together"}: {plural(n, "lot")} of {m} is {m} × {n} ={" "}
          {fac(m * n)}. So {eq}. <strong>Power of a power → multiply the indices.</strong>
        </>
      );
    }
  }
  const e = law === "mul" ? m + n : law === "div" ? m - n : m * n;
  const signNote =
    base === "-2" && e > 0 ? (
      <>
        {" "}
        Sign check: {e % 2 === 0 ? <>an even number of (−2)s pair up into positives, so the answer is <strong>positive</strong>.</> : <>one (−2) is left without a partner, so the answer is <strong>negative</strong>.</>}{" "}
        Careful: <M>{"-2^4"}</M> means <M>{"-(2^4) = -16"}</M>, but <M>{"(-2)^4 = 16"}</M>.
      </>
    ) : null;
  return (
    <>
      {main}
      {signNote}
    </>
  );
}

function IndexLawWidget() {
  const [base, setBase] = useState<Base>("2");
  const [law, setLaw] = useState<Law>("mul");
  const [m, setM] = useState(3);
  const [n, setN] = useState(4);
  const nMax = law === "pow" ? 4 : 6;
  const changeLaw = (l: Law) => {
    setLaw(l);
    if (l === "pow") setN((v) => Math.min(v, 4));
  };
  const e = law === "mul" ? m + n : law === "div" ? m - n : m * n;
  const B = BASE_MARKUP[base];
  const chain =
    law === "mul"
      ? `${pw(base, m)} * ${pw(base, n)} = ${B}^(${m}+${n}) = ${pw(base, e)}`
      : law === "div"
        ? `${pw(base, m)} ÷ ${pw(base, n)} = ${B}^(${m}-${n}) = ${pw(base, e)}`
        : `(${pw(base, m)})^${n} = ${B}^(${m} * ${n}) = ${pw(base, e)}`;
  const c = Math.min(m, n);
  const bt = BASE_TEXT[base];
  const aria =
    law === "mul"
      ? `${m} factors of ${bt} times ${n} factors of ${bt} make ${m + n} factors of ${bt}.`
      : law === "div"
        ? `${m} factors of ${bt} on top and ${n} on the bottom. ${c} cancel from each, leaving ${e > 0 ? `${e} on top` : e < 0 ? `${-e} on the bottom` : "1"}.`
        : `${n} copies of ${m} factors of ${bt} make ${m * n} factors of ${bt}.`;

  return (
    <WidgetFrame
      title="Index laws: count the factors"
      tryThis={[
        "Use ÷ to make the answer {{2^0}}. What must be true of m and n — and what is the value?",
        "Work out {{3^2 ÷ 3^5}}. Where do the leftover threes end up?",
        "Find three different ways to make {{(2^m)^n = 2^12}}.",
        "Switch the base to −2. Which powers come out negative, and why?",
      ]}
      caption={indexCaption(base, law, m, n)}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Segmented<Law>
            label="Index law"
            value={law}
            onChange={changeLaw}
            options={[
              { value: "mul", label: "multiply" },
              { value: "div", label: "divide" },
              { value: "pow", label: "power of a power" },
            ]}
          />
          <Segmented<Base>
            label="Base"
            value={base}
            onChange={setBase}
            options={[
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "10", label: "10" },
              { value: "-2", label: "−2" },
              { value: "x", label: <em>x</em> },
            ]}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div role="group" aria-label="First index m">
            <Stepper label={<>First index <em>m</em></>} value={m} min={0} max={6} onChange={setM} />
          </div>
          <div role="group" aria-label={law === "pow" ? "Outer index n" : "Second index n"}>
            <Stepper label={law === "pow" ? <>Outer index <em>n</em></> : <>Second index <em>n</em></>} value={n} min={0} max={nMax} onChange={setN} />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-3" role="img" aria-label={aria}>
          {law === "mul" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Bracket>
                  <FactorRow base={base} count={m} tone="a" />
                </Bracket>
                <Times />
                <Bracket>
                  <FactorRow base={base} count={n} tone="b" />
                </Bracket>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-extrabold text-ink-2">=</span>
                <FactorRow base={base} count={m + n} tone="a" toneSplit={m} />
              </div>
            </div>
          ) : law === "div" ? (
            <div className="space-y-3">
              <div className="inline-flex flex-col items-start gap-1">
                <FactorRow base={base} count={m} tone="a" struck={c} />
                <div className="h-0.5 w-full min-w-[3rem] rounded bg-ink" />
                <FactorRow base={base} count={n} tone="b" struck={c} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-extrabold text-ink-2">=</span>
                {e > 0 ? (
                  <FactorRow base={base} count={e} tone="a" />
                ) : e === 0 ? (
                  <One />
                ) : (
                  <span className="inline-flex flex-col items-start gap-1">
                    <One />
                    <span className="h-0.5 w-full min-w-[3rem] rounded bg-ink" />
                    <FactorRow base={base} count={-e} tone="b" />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {n === 0 ? (
                  <span className="text-sm text-ink-2">no copies at all →</span>
                ) : (
                  Array.from({ length: n }, (_, i) => (
                    <span key={i} className="inline-flex items-center gap-2">
                      {i > 0 ? <Times /> : null}
                      <Bracket>
                        <FactorRow base={base} count={m} tone={i % 2 === 0 ? "a" : "b"} />
                      </Bracket>
                    </span>
                  ))
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-extrabold text-ink-2">=</span>
                <FactorRow base={base} count={m * n} tone="a" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl bg-brand-soft px-3 py-2 text-lg text-ink">
          <M>{chain}</M>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Readout label="Index form" value={<M>{pw(base, e)}</M>} />
          <Readout
            label={law !== "div" ? "Number of factors" : e < 0 ? "Factors left on the bottom" : "Factors left"}
            tone="ink"
            value={e === 0 ? "none (just 1)" : `${Math.abs(e)}`}
          />
          <Readout label="Value" tone="ink" value={<ValueOf base={base} e={e} />} />
        </div>
      </div>
    </WidgetFrame>
  );
}

export const widgets: WidgetDef[] = [
  {
    id: "zero-pair-counters",
    title: "Counters and zero pairs",
    blurb: "Add, subtract and multiply negatives with + and − counters, step by step, and see why subtracting a negative adds.",
    Component: CountersWidget,
  },
  {
    id: "index-law-machine",
    title: "Index laws: count the factors",
    blurb: "Write powers out as repeated factors, then multiply, divide or raise to a power and watch the indices add, subtract or multiply.",
    Component: IndexLawWidget,
  },
];
