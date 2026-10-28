"use client";
// Interactive explorables for the "ratio-proportion" topic.
//  1. Ratio bar model — share an amount in a 2- or 3-part ratio when you know
//     the total, one person's share or the difference between two shares.
//  2. Best-buy lines — two packs as points on a price–mass graph. Each pack's
//     line through the origin is "the same deal at any size" (direct
//     proportion); the less steep line is the better buy.
import { useState, type ReactNode } from "react";
import { WidgetFrame, Slider, Segmented, Readout, M, type WidgetDef } from "./kit";

/* ------------------------------------------------------------------------ */
/* Exact number helpers                                                       */
/* ------------------------------------------------------------------------ */

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

/** An exact fraction n/d in lowest terms with d > 0. */
interface Q {
  n: number;
  d: number;
}

function frac(n: number, d: number): Q {
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
}

const isInt = (q: Q) => q.n % q.d === 0;

/** Maths markup for a fraction: "5/3", or "4" when it is whole. */
const fracText = (q: Q) => (q.d === 1 ? String(q.n) : `${q.n}/${q.d}`);

/** Exact decimal when it terminates within maxDp places, otherwise "≈" rounded. */
function decText(q: Q, maxDp = 3, approxDp = 2): string {
  if (isInt(q)) return String(q.n / q.d);
  for (let dp = 1; dp <= maxDp; dp++) {
    if ((q.n * 10 ** dp) % q.d === 0) return (q.n / q.d).toFixed(dp);
  }
  return `≈ ${(q.n / q.d).toFixed(approxDp)}`;
}

/**
 * Money from an exact amount in CENTS (q ≥ 0), rounded half-up to the cent
 * with integer arithmetic. "≈" marks a rounded value.
 */
function moneyCents(q: Q, alwaysCents = false): string {
  const cents = Math.floor((2 * q.n + q.d) / (2 * q.d));
  const whole = Math.floor(cents / 100);
  const c = cents % 100;
  const body = !alwaysCents && c === 0 ? `$${whole}` : `$${whole}.${String(c).padStart(2, "0")}`;
  return isInt(q) ? body : `≈ ${body}`;
}

/** Money from an exact amount in DOLLARS. */
const money = (dollars: Q, alwaysCents = false) => moneyCents(frac(dollars.n * 100, dollars.d), alwaysCents);

/** True when an amount in dollars is an exact number of cents. */
const exactCents = (dollars: Q) => (dollars.n * 100) % dollars.d === 0;

/** Rounded cents of an amount in dollars (half-up). */
const roundCents = (dollars: Q) => Math.floor((200 * dollars.n + dollars.d) / (2 * dollars.d));

const plural = (k: number, word: string) => `${k} ${word}${k === 1 ? "" : "s"}`;

/** "= $45" for an exact value, "≈ $33.33" for a rounded one (never "= ≈"). */
const eq = (s: string) => (s.startsWith("≈") ? s : `= ${s}`);

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
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Slider label={label} value={value} min={min} max={max} step={step} onChange={onChange} format={format} />
      </div>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label={`${name}: decrease`}
      >
        −
      </button>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label={`${name}: increase`}
      >
        +
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Ratio bar model                                                          */
/* ------------------------------------------------------------------------ */

type Known = "total" | "share" | "diff";
const NAMES = ["Aisha", "Wei Ling", "Arjun"];
const MAX_PARTS = 10;

function PartStepper({ name, value, onChange }: { name: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-1.5">
      <span className="text-sm font-semibold text-ink-2">{name}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="kbd h-10 min-w-10"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label={`${name}'s parts: decrease`}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-lg font-extrabold tabular-nums text-ink" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="kbd h-10 min-w-10"
          onClick={() => onChange(Math.min(MAX_PARTS, value + 1))}
          disabled={value >= MAX_PARTS}
          aria-label={`${name}'s parts: increase`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function RatioBarModel() {
  const [count, setCount] = useState<"2" | "3">("2");
  const [parts, setParts] = useState<number[]>([3, 5, 4]);
  const [mode, setMode] = useState<Known>("total");
  const [who, setWho] = useState(0);
  const [known, setKnown] = useState(120);

  const n = count === "3" ? 3 : 2;
  const p = parts.slice(0, n);
  const names = NAMES.slice(0, n);
  const w = Math.min(who, n - 1);
  const N = p.reduce((s, x) => s + x, 0);
  const maxP = Math.max(...p);
  const minP = Math.min(...p);
  const hi = p.indexOf(maxP);
  const lo = p.indexOf(minP);
  const ratioText = p.join(" : ");

  // How many equal parts the known amount covers.
  const covered = mode === "total" ? N : mode === "share" ? p[w] : maxP - minP;
  const ok = covered > 0;
  const one = ok ? frac(known, covered) : null; // dollars
  const shares = ok ? p.map((x) => frac(known * x, covered)) : [];
  const total = ok ? frac(known * N, covered) : null;
  const allExact = ok && one !== null && exactCents(one);

  const setPart = (i: number, v: number) => setParts((ps) => ps.map((x, j) => (j === i ? v : x)));

  // Equivalent forms.
  const g = p.reduce((a, b) => gcd(a, b));
  const simp = p.map((x) => x / g);
  const unit = p.map((x) => frac(x, p[0]));
  const unitPlain = unit.every((u) => !decText(u).startsWith("≈"));
  const fr = p.map((x) => frac(x, N));

  // ---- the bar model (all boxes the same width, so it is to scale) ----
  const VW = 360;
  const LBL = 66;
  const END = 84;
  const boxW = Math.min(46, (VW - LBL - END) / maxP);
  const rowH = 30;
  const gap = 14;
  const top = 10;
  const rowY = (i: number) => top + i * (rowH + gap);
  const VH = rowY(n) + 12;
  const oneLabel = one ? money(one) : "";
  const fitsInBox = oneLabel.length * 6.6 + 6 <= boxW;
  const isKnownBox = (i: number, j: number) =>
    ok && (mode === "total" || (mode === "share" && i === w) || (mode === "diff" && i === hi && j >= minP));

  const aria = `Bar model for the ratio ${ratioText}. ${names
    .map((nm, i) => `${nm}: ${plural(p[i], "part")}${ok ? `, ${money(shares[i])}` : ""}`)
    .join("; ")}.${one ? ` One part is ${money(one)}.` : ""}`;

  // ---- the worked method ----
  const steps: string[] = [];
  if (ok && one && total) {
    const oneStep = `1 part = $${known} ÷ ${covered} ${eq(money(one))}${allExact ? "" : " (not a whole number of cents)"}`;
    if (mode === "total") {
      steps.push(`Count the parts: ${p.join(" + ")} = ${N} parts, and all ${N} parts = $${known}.`);
    } else if (mode === "share") {
      steps.push(`${names[w]}'s share is ${plural(p[w], "part")}, so ${plural(p[w], "part")} = $${known}.`);
    } else {
      steps.push(
        `${names[hi]} has ${maxP} − ${minP} = ${plural(covered, "part")} more than ${names[lo]}, so ${plural(covered, "part")} = $${known}.`,
      );
    }
    steps.push(`${oneStep}.`);
    if (allExact) {
      steps.push(names.map((nm, i) => `${nm}: ${p[i]} × ${money(one)} = ${money(shares[i])}`).join(" · "));
    } else {
      steps.push(
        `Keep it exact — multiply first, then divide: ${names
          .map((nm, i) => `${nm}: $${known} × ${p[i]} ÷ ${covered} ${eq(money(shares[i]))}`)
          .join(" · ")}`,
      );
    }
    if (mode === "total") {
      if (allExact) steps.push(`Check: ${shares.map((s) => money(s)).join(" + ")} = $${known} ✓`);
    } else {
      steps.push(
        allExact
          ? `Total: ${N} parts = ${N} × ${money(one)} = ${money(total)}`
          : `Total: ${N} parts = $${known} × ${N} ÷ ${covered} ${eq(money(total))}`,
      );
      if (mode === "diff" && allExact) steps.push(`Check: ${money(shares[hi])} − ${money(shares[lo])} = $${known} ✓`);
    }
  }
  const roundedSum = ok ? shares.reduce((s, q) => s + roundCents(q), 0) : 0;
  const roundedTotal = total ? roundCents(total) : 0;
  const roundingClash = ok && !allExact && roundedSum !== roundedTotal;

  const knownLabel =
    mode === "total" ? "Total to share" : mode === "share" ? `${names[w]}'s share` : maxP === minP
        ? "Difference between the shares"
        : `Difference (${names[hi]} − ${names[lo]})`;

  const fracOf = (i: number) => {
    const raw = `${p[i]}/${N}`;
    const s = fracText(fr[i]);
    return s === raw ? <M>{raw}</M> : <><M>{raw}</M> = <M>{s}</M></>;
  };

  const caption = (
    <div className="space-y-2">
      <p>
        <strong>{ratioText}</strong> means for every {plural(p[0], "part")} {names[0]} gets, {names[1]} gets {p[1]}
        {n === 3 ? `, and ${names[2]} gets ${p[2]}` : ""}. That is {N} equal parts altogether, so{" "}
        {names.map((nm, i) => (
          <span key={nm}>
            {i > 0 ? (i === n - 1 ? " and " : ", ") : ""}
            {nm} gets {fracOf(i)}
          </span>
        ))}{" "}
        of the total.
      </p>
      {!ok ? (
        <p>
          Every share in {ratioText} is the same size, so the difference is always $0 — it can’t tell you what one part is worth.
          Change the ratio or pick another thing to know.
        </p>
      ) : mode === "total" ? (
        <p>You know the total, which is all {N} parts (amber). Divide by {N} to get one part, then multiply up for each person.</p>
      ) : mode === "share" ? (
        <p>
          You know {names[w]}’s share, which is {plural(p[w], "part")} (amber). Divide by {p[w]} to get one part — you don’t need the total first.
        </p>
      ) : (
        <p>
          You know the difference: {names[hi]}’s bar is {plural(covered, "part")} longer than {names[lo]}’s (amber). So{" "}
          {plural(covered, "part")} = ${known} and one part {eq(money(one ?? frac(0, 1)))}. Classic slip: dividing the difference by all {N} parts.
        </p>
      )}
      {g > 1 ? (
        <p>
          {ratioText} simplifies to <strong>{simp.join(" : ")}</strong> (divide every part by {g}). Sharing in {simp.join(" : ")} gives exactly
          the same fractions — and so exactly the same shares: only the proportions matter, not the size of the numbers.
        </p>
      ) : null}
    </div>
  );

  return (
    <WidgetFrame
      title="Ratio bar model"
      tryThis={[
        "Share $120 in the ratio 3 : 5. Predict both shares before you look.",
        "Compare 2 : 4 with 1 : 2 for the same total. Why are the shares identical?",
        "In the ratio 2 : 7, Wei Ling gets $35 more than Aisha. How much is shared altogether?",
        "Find three totals that share into whole dollars in the ratio 3 : 4 : 5. What do they have in common?",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-2">People</span>
          <Segmented<"2" | "3">
            label="Number of people sharing"
            value={count}
            onChange={setCount}
            options={[
              { value: "2", label: "2 people" },
              { value: "3", label: "3 people" },
            ]}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {names.map((nm, i) => (
            <PartStepper key={nm} name={nm} value={p[i]} onChange={(v) => setPart(i, v)} />
          ))}
        </div>

        <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" role="img" aria-label={aria}>
          {p.map((parts_i, i) => {
            const y = rowY(i);
            return (
              <g key={`row${i}`}>
                <text x={LBL - 8} y={y + rowH / 2 + 4} fontSize={12} fontWeight={700} textAnchor="end" className="fill-ink-2">
                  {names[i]}
                </text>
                {Array.from({ length: parts_i }, (_, j) => (
                  <g key={`b${i}-${j}`}>
                    <rect
                      x={LBL + j * boxW}
                      y={y}
                      width={boxW}
                      height={rowH}
                      rx={3}
                      className={isKnownBox(i, j) ? "fill-accent-soft stroke-accent" : "fill-brand-soft stroke-brand"}
                      strokeWidth={1.5}
                    />
                    {ok && fitsInBox ? (
                      <text x={LBL + (j + 0.5) * boxW} y={y + rowH / 2 + 4} fontSize={11} textAnchor="middle" className="fill-ink">
                        {oneLabel}
                      </text>
                    ) : null}
                  </g>
                ))}
                <text x={LBL + parts_i * boxW + 6} y={y + rowH / 2 + 4} fontSize={12} fontWeight={800} className="fill-ink">
                  {ok ? eq(money(shares[i])) : "?"}
                </text>
              </g>
            );
          })}
          {ok && mode === "diff" ? (
            <line
              x1={LBL + minP * boxW}
              x2={LBL + minP * boxW}
              y1={rowY(Math.min(hi, lo)) - 4}
              y2={rowY(Math.max(hi, lo)) + rowH + 4}
              className="stroke-ink-2"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          ) : null}
          <text x={4} y={rowY(n) + 4} fontSize={12} className="fill-ink-2">
            {ok && one ? `${N} equal parts in total · 1 part ${eq(money(one))}` : "The difference is 0 parts, so one part can’t be found."}
          </text>
        </svg>
        <p className="-mt-2 text-xs text-ink-2">Amber boxes = the amount you are told. Every box is the same size: one part.</p>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-2">You know</span>
            <Segmented<Known>
              label="What you know"
              value={mode}
              onChange={setMode}
              options={[
                { value: "total", label: "the total" },
                { value: "share", label: "one share" },
                { value: "diff", label: "the difference" },
              ]}
            />
          </div>
          {mode === "share" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink-2">Whose share?</span>
              <Segmented<string>
                label="Whose share you know"
                value={String(w)}
                onChange={(v) => setWho(Number(v))}
                options={names.map((nm, i) => ({ value: String(i), label: nm }))}
              />
            </div>
          ) : null}
          <NudgeSlider name={knownLabel} label={knownLabel} value={known} min={1} max={500} onChange={setKnown} format={(v) => `$${v}`} />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Readout label="1 part" value={one ? money(one) : "—"} />
          <Readout label={mode === "total" ? "Shared" : "Total"} value={total ? money(total) : "—"} tone="ink" />
          <Readout label="Simplest form" value={simp.join(" : ")} tone={g > 1 ? "good" : "ink"} />
          <Readout
            label="As 1 : n"
            value={
              unitPlain ? (
                unit.map((u) => decText(u)).join(" : ")
              ) : (
                <span className="text-lg">
                  1
                  {unit.slice(1).map((u, i) => (
                    <span key={`u${i}`}>
                      {" : "}
                      <M>{fracText(u)}</M>
                    </span>
                  ))}
                </span>
              )
            }
            tone="ink"
          />
        </div>

        {ok ? (
          <div className="rounded-xl border border-line p-3 text-sm text-ink-2">
            <p className="font-bold text-ink">Method</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 tabular-nums">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {!unitPlain ? (
              <p className="mt-2">
                As 1 : n with decimals (divide every part by {p[0]}, rounding to 2 d.p. where needed):{" "}
                {unit.map((u) => decText(u).replace(/≈\s*/, "")).join(" : ")}.
              </p>
            ) : null}
            {roundingClash ? (
              mode === "total" ? (
                <p className="mt-2">
                  <span className="font-bold text-bad">Real-life snag:</span> rounded to the nearest cent the shares add to{" "}
                  {moneyCents(frac(roundedSum, 1))}, not {moneyCents(frac(roundedTotal, 1))} — someone has to take the odd cent.
                </p>
              ) : (
                <p className="mt-2">
                  <span className="font-bold text-bad">Rounding snag:</span> the rounded shares add to {moneyCents(frac(roundedSum, 1))}, but the
                  exact total rounds to {moneyCents(frac(roundedTotal, 1))}. Keep values exact and round only at the very end.
                </p>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. Best-buy lines (direct proportion)                                      */
/* ------------------------------------------------------------------------ */

/** A pack: mass in grams, price in cents (integers keep everything exact). */
interface Pack {
  g: number;
  c: number;
}

const PRESETS: { label: string; a: Pack; b: Pack }[] = [
  { label: "Muesli", a: { g: 400, c: 360 }, b: { g: 750, c: 600 } },
  { label: "Pasta", a: { g: 500, c: 240 }, b: { g: 1000, c: 520 } },
  { label: "Peanuts", a: { g: 350, c: 280 }, b: { g: 225, c: 185 } },
];

const XMAX = 2000; // grams
const YMAX = 20; // dollars

const price = (c: number) => moneyCents(frac(c, 1), true);
/** A (non-negative) saving in cents; never shows a misleading "≈ $0.00". */
const saving = (q: Q) => (Math.floor((2 * q.n + q.d) / (2 * q.d)) === 0 ? "less than half a cent" : moneyCents(q, true));
const dollarsPlain = (c: number) => (c / 100).toFixed(2);

function PackControls({ name, tone, pack, onChange }: { name: string; tone: "a" | "b"; pack: Pack; onChange: (p: Pack) => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-line p-3">
      <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
        <span aria-hidden className={`inline-block h-3 w-3 rounded-full ${tone === "a" ? "bg-brand" : "bg-accent"}`} />
        {name}
      </p>
      <NudgeSlider
        name={`${name} mass`}
        label={
          <>
            <span className="sr-only">{name} </span>Mass
          </>
        }
        value={pack.g}
        min={25}
        max={XMAX}
        step={25}
        onChange={(g) => onChange({ ...pack, g })}
        format={(v) => `${v} g`}
      />
      <NudgeSlider
        name={`${name} price`}
        label={
          <>
            <span className="sr-only">{name} </span>Price
          </>
        }
        value={pack.c}
        min={10}
        max={YMAX * 100}
        step={5}
        onChange={(c) => onChange({ ...pack, c })}
        format={price}
      />
    </div>
  );
}

function BestBuyLines() {
  const [A, setA] = useState<Pack>(PRESETS[0].a);
  const [B, setB] = useState<Pack>(PRESETS[0].b);
  const [at, setAt] = useState(1000);

  // Unit prices, exact, in cents per 100 g.
  const per100A = frac(A.c * 100, A.g);
  const per100B = frac(B.c * 100, B.g);
  // Grams per $1.
  const perDollarA = frac(100 * A.g, A.c);
  const perDollarB = frac(100 * B.g, B.c);
  // Cross-multiply to compare exactly: negative → A is cheaper per gram.
  const cmp = A.c * B.g - B.c * A.g;
  const better = cmp < 0 ? "A" : cmp > 0 ? "B" : null;
  const betterPack = better === "A" ? A : B;
  const worsePack = better === "A" ? B : A;
  const savePer100 = frac(Math.abs(cmp) * 100, A.g * B.g); // cents
  const savePerKg = frac(Math.abs(cmp) * 1000, A.g * B.g); // cents
  const bulkTrap = better !== null && betterPack.g < worsePack.g;

  // Prices at the comparison mass (cents).
  const atA = frac(A.c * at, A.g);
  const atB = frac(B.c * at, B.g);
  const multA = frac(at, A.g);
  const multB = frac(at, B.g);

  // ---- graph geometry ----
  const GL = 46;
  const GR = 346;
  const GT = 14;
  const GB = 204;
  const gx = (grams: number) => GL + (grams / XMAX) * (GR - GL);
  const gy = (dollars: number) => GB - (dollars / YMAX) * (GB - GT);
  const lineEnd = (p: Pack) => {
    // price (dollars) = (c / 100) / g × mass; clip to the plot.
    const yAtMax = (p.c * XMAX) / (100 * p.g);
    return yAtMax <= YMAX ? { x: XMAX, y: yAtMax } : { x: (YMAX * 100 * p.g) / p.c, y: YMAX };
  };
  const eA = lineEnd(A);
  const eB = lineEnd(B);
  const xTicks = [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  const yTicks = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20];
  const atAd = atA.n / atA.d / 100;
  const atBd = atB.n / atB.d / 100;
  const atX = gx(at);
  const atRight = at > 1500;

  const verdict = better
    ? `${better}'s line is less steep, so ${better} is cheaper per gram`
    : "Both packs lie on the same line, so they are exactly the same value";
  const aria = `Graph of price against mass. Pack A: ${A.g} g for ${price(A.c)}. Pack B: ${B.g} g for ${price(B.c)}. Each pack has a straight line through the origin. ${verdict}. Dashed comparison line at ${at} g.`;

  const scaleLine = (name: string, p: Pack, mult: Q, result: Q) => (
    <>
      {name}: {price(p.c)} × {mult.d === 1 ? String(mult.n) : <M>{fracText(mult)}</M>} {eq(moneyCents(result, true))}
    </>
  );

  const caption = (
    <div className="space-y-2">
      <p>
        Each line starts at (0, 0) and is straight: twice the mass costs twice as much. That is <strong>direct proportion</strong> — every point on
        a pack’s line is the same deal as that pack, just bigger or smaller.
      </p>
      {better ? (
        <p>
          <strong>{better} is the better buy.</strong> Its line is less steep, so each gram costs less: {better} is cheaper by{" "}
          {saving(savePer100)} per 100 g, or {saving(savePerKg)} per kilogram.
          {bulkTrap ? ` Notice the bigger pack is the worse buy here — bigger is not always cheaper per gram.` : ""}
        </p>
      ) : (
        <p>
          <strong>Same value.</strong> Both points sit on one line through the origin: {moneyCents(per100A, true)} per 100 g for each. Their masses
          and prices are in the same ratio ({A.g} : {B.g} = {A.c} : {B.c} in cents).
        </p>
      )}
    </div>
  );

  return (
    <WidgetFrame
      title="Best-buy lines"
      tryThis={[
        "Make the bigger pack the *worse* buy. How can you tell just from the steepness of the lines?",
        "Make both packs exactly the same value. What happens to the two lines?",
        "Pack A is 400 g for $3.60. Predict the price that makes a 1000 g pack exactly the same value, then test it.",
        "Slide the comparison line to a mass where both prices are easy to work out in your head.",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example packs">
          {PRESETS.map((ps) => (
            <button
              key={ps.label}
              type="button"
              className="btn btn-secondary text-sm"
              onClick={() => {
                setA(ps.a);
                setB(ps.b);
              }}
            >
              {ps.label}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 360 244" className="h-auto w-full" role="img" aria-label={aria}>
          {xTicks.map((t) => (
            <line key={`gx${t}`} x1={gx(t)} x2={gx(t)} y1={GT} y2={GB} className="stroke-line" strokeWidth={1} />
          ))}
          {yTicks.map((t) => (
            <line key={`gy${t}`} x1={GL} x2={GR} y1={gy(t)} y2={gy(t)} className="stroke-line" strokeWidth={1} />
          ))}
          <line x1={GL} x2={GR} y1={GB} y2={GB} className="stroke-ink-2" strokeWidth={1.5} />
          <line x1={GL} x2={GL} y1={GT} y2={GB} className="stroke-ink-2" strokeWidth={1.5} />
          {xTicks
            .filter((t) => t % 500 === 0)
            .map((t) => (
              <text key={`lx${t}`} x={gx(t)} y={GB + 15} fontSize={10} textAnchor="middle" className="fill-ink-2">
                {t}
              </text>
            ))}
          {yTicks
            .filter((t) => t % 5 === 0)
            .map((t) => (
              <text key={`ly${t}`} x={GL - 6} y={gy(t) + 3} fontSize={10} textAnchor="end" className="fill-ink-2">
                ${t}
              </text>
            ))}
          <text x={(GL + GR) / 2} y={GB + 32} fontSize={11} textAnchor="middle" className="fill-ink-2">
            mass (g)
          </text>
          <text x={GL - 6} y={GT - 4} fontSize={11} textAnchor="end" className="fill-ink-2">
            price
          </text>

          {/* comparison line */}
          <line x1={atX} x2={atX} y1={GT} y2={GB} className="stroke-ink-2" strokeWidth={1.25} strokeDasharray="5 4" />
          <text x={atRight ? atX - 4 : atX + 4} y={GT + 10} fontSize={10} textAnchor={atRight ? "end" : "start"} className="fill-ink-2">
            {at} g
          </text>

          {/* proportion lines through the origin */}
          <line x1={gx(0)} y1={gy(0)} x2={gx(eA.x)} y2={gy(eA.y)} className="stroke-brand" strokeWidth={2.5} />
          <line x1={gx(0)} y1={gy(0)} x2={gx(eB.x)} y2={gy(eB.y)} className="stroke-accent" strokeWidth={2.5} strokeDasharray={cmp === 0 ? "7 5" : undefined} />

          {atAd <= YMAX ? <circle cx={atX} cy={gy(atAd)} r={4} className="fill-surface stroke-brand" strokeWidth={2} /> : null}
          {atBd <= YMAX ? <circle cx={atX} cy={gy(atBd)} r={4} className="fill-surface stroke-accent" strokeWidth={2} /> : null}

          {/* the packs */}
          <circle cx={gx(A.g)} cy={gy(A.c / 100)} r={6} className="fill-brand stroke-surface" strokeWidth={2} />
          <circle cx={gx(B.g)} cy={gy(B.c / 100)} r={6} className="fill-accent stroke-surface" strokeWidth={2} />
          <text
            x={A.g < 150 ? gx(A.g) + 9 : gx(A.g) - 9}
            y={A.c > 1850 ? gy(A.c / 100) + 18 : gy(A.c / 100) - 8}
            fontSize={13}
            fontWeight={800}
            textAnchor={A.g < 150 ? "start" : "end"}
            className="fill-ink"
          >
            A
          </text>
          <text
            x={B.g > 1800 ? gx(B.g) - 9 : gx(B.g) + 9}
            y={B.c > 150 ? gy(B.c / 100) + 16 : gy(B.c / 100) - 8}
            fontSize={13}
            fontWeight={800}
            textAnchor={B.g > 1800 ? "end" : "start"}
            className="fill-ink"
          >
            B
          </text>
        </svg>
        <p className="-mt-2 text-xs text-ink-2">
          Big dots = the packs. Small dots = what each deal would cost at the dashed mass.
          {atAd > YMAX || atBd > YMAX
            ? ` (${atAd > YMAX && atBd > YMAX ? "Both are" : atAd > YMAX ? "A’s is" : "B’s is"} above $${YMAX}, off the top of the graph.)`
            : ""}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <PackControls name="Pack A" tone="a" pack={A} onChange={setA} />
          <PackControls name="Pack B" tone="b" pack={B} onChange={setB} />
        </div>
        <NudgeSlider name="Compare at" label="Compare at (dashed line)" value={at} min={25} max={XMAX} step={25} onChange={setAt} format={(v) => `${v} g`} />

        <div className="grid grid-cols-3 gap-2">
          <Readout label="A per 100 g" value={moneyCents(per100A, true)} tone={better === "A" ? "good" : "ink"} />
          <Readout label="B per 100 g" value={moneyCents(per100B, true)} tone={better === "B" ? "good" : "ink"} />
          <Readout label="Better buy" value={better ?? "Same"} tone={better ? "good" : "ink"} />
        </div>

        <div className="rounded-xl border border-line p-3 text-sm text-ink-2">
          <p className="font-bold text-ink">Three ways to compare</p>
          <ol className="mt-1 list-decimal space-y-1.5 pl-5 tabular-nums">
            <li>
              <span className="font-semibold text-ink">Price per 100 g</span> (unitary method — lower is better): A: {price(A.c)} ÷ {A.g} × 100{" "}
              {eq(moneyCents(per100A, true))} · B: {price(B.c)} ÷ {B.g} × 100 {eq(moneyCents(per100B, true))}
            </li>
            <li>
              <span className="font-semibold text-ink">Grams per $1</span> (higher is better): A: {A.g} ÷ {dollarsPlain(A.c)}{" "}
              {eq(decText(perDollarA, 1, 1))} g · B: {B.g} ÷ {dollarsPlain(B.c)} {eq(decText(perDollarB, 1, 1))} g
            </li>
            <li>
              <span className="font-semibold text-ink">Scale both to {at} g</span> (the dashed line): {scaleLine("A", A, multA, atA)} ·{" "}
              {scaleLine("B", B, multB, atB)}
            </li>
          </ol>
          <p className="mt-2">
            All three always agree. Pick whichever makes the numbers friendliest
            {A.g === B.g
              ? " — here the masses are equal, so you can compare the prices directly"
              : A.g % B.g === 0 || B.g % A.g === 0
                ? " — here one mass is a multiple of the other, so scaling is quickest"
                : ""}
            .
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */

export const widgets: WidgetDef[] = [
  {
    id: "ratio-bar-model",
    title: "Ratio bar model",
    blurb: "Share money in a 2- or 3-part ratio — whether you know the total, one share or the difference.",
    Component: RatioBarModel,
  },
  {
    id: "best-buy-lines",
    title: "Best-buy lines",
    blurb: "Plot two packs on a price–mass graph and see direct proportion: the less steep line is the better buy.",
    Component: BestBuyLines,
  },
];
