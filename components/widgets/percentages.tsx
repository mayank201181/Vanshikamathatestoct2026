"use client";
// Interactive explorables for the "percentages" topic.
//  1. Percentage bar — a double number line that links whole, percentage and
//     part, with three modes (find the part / the percentage / the whole).
//  2. Multiplier chain — successive percentage changes as multipliers, with
//     the overall change, "just adding" comparison and the reverse journey.
import { useState, type ReactNode } from "react";
import { WidgetFrame, Slider, Segmented, Readout, M, type WidgetDef } from "./kit";

/* ------------------------------------------------------------------------ */
/* Number helpers (exact where it matters)                                    */
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

/** A fraction in lowest terms (d > 0). */
interface Q {
  n: number;
  d: number;
}

function frac(n: number, d: number): Q {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Round to `dp` places, drop trailing zeros, use a real minus sign. */
function fmt(v: number, dp = 2): string {
  let s = v.toFixed(dp);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "-0") s = "0";
  return s.replace("-", "−");
}

/** True when v terminates within `dp` decimal places. */
function exactTo(v: number, dp: number): boolean {
  const s = v * 10 ** dp;
  return Math.abs(s - Math.round(s)) < 1e-6;
}

/** The exact value if it terminates within dp places, otherwise "≈" + rounded. */
function approx(v: number, dp = 2): string {
  return (exactTo(v, dp) ? "" : "≈") + fmt(v, dp);
}

/** "= 80" for an exact value, "≈ 83.33" for a rounded one. */
function eq(text: string): string {
  return text.startsWith("≈") ? `≈ ${text.slice(1)}` : `= ${text}`;
}

/** Maths markup for a non-negative fraction: whole number, proper fraction or mixed number. */
function fracMarkup({ n, d }: Q): string {
  if (d === 1) return String(n);
  if (n > d) return `${Math.floor(n / d)} ${n % d}/${d}`;
  return `${n}/${d}`;
}

/** Signed percentage, e.g. +10%, −1%, 0%. */
function signedPct(v: number, dp = 4): string {
  if (Math.abs(v) < 1e-9) return "0%";
  const a = Math.abs(v);
  return `${exactTo(a, dp) ? "" : "≈"}${v > 0 ? "+" : "−"}${fmt(a, dp)}%`;
}

/** Money in dollars: $200, $19.18, ≈$1092.73. */
function money(v: number, signed = false): string {
  const a = Math.abs(v);
  const body = exactTo(a, 0) ? fmt(a, 0) : a.toFixed(2);
  const sign = v < -0.004 ? "−" : signed && v > 0.004 ? "+" : "";
  return `${exactTo(a, 2) ? "" : "≈"}${sign}$${body}`;
}

/** A slider with ±1 buttons for fine control on touch screens. */
function NudgeSlider({
  name,
  label,
  value,
  min,
  max,
  onChange,
  format,
}: {
  name: string;
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  format?: (v: number) => ReactNode;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Slider label={label} value={value} min={min} max={max} onChange={onChange} format={format} />
      </div>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${name}: decrease by 1`}
      >
        −
      </button>
      <button
        type="button"
        className="kbd h-10 min-w-10"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${name}: increase by 1`}
      >
        +
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Percentage bar (double number line)                                     */
/* ------------------------------------------------------------------------ */

type Mode = "part" | "percent" | "whole";

/** How to show a percentage that may not terminate (e.g. 33 1/3 %). */
function pctDisplay(pct: Q): { plain: string; rich: ReactNode } {
  const v = pct.n / pct.d;
  if (exactTo(v, 2)) {
    const s = `${fmt(v, 2)}%`;
    return { plain: s, rich: s };
  }
  const plain = `≈${fmt(v, 1)}%`;
  if (pct.d <= 12) return { plain, rich: <><M>{fracMarkup(pct)}</M>%</> };
  return { plain, rich: plain };
}

function PercentBar() {
  const [mode, setMode] = useState<Mode>("part");
  const [W, setW] = useState(80); // the whole: an input in "part" and "percent" modes
  const [p, setP] = useState(35); // the percentage: an input in "part" and "whole" modes
  const [P, setPart] = useState(28); // the part: an input in "percent" and "whole" modes

  // The three linked quantities, as exact fractions.
  let whole: Q;
  let pct: Q;
  let part: Q;
  if (mode === "part") {
    whole = frac(W, 1);
    pct = frac(p, 1);
    part = frac(W * p, 100);
  } else if (mode === "percent") {
    whole = frac(W, 1);
    part = frac(P, 1);
    pct = frac(100 * P, W);
  } else {
    part = frac(P, 1);
    pct = frac(p, 1);
    whole = frac(100 * P, p);
  }
  const wholeV = whole.n / whole.d;
  const pctV = pct.n / pct.d;
  const partV = part.n / part.d;
  const ratio = frac(pct.n, pct.d * 100); // part ÷ whole
  const ratioV = ratio.n / ratio.d;
  const pctShow = pctDisplay(pct);
  const wholeText = approx(wholeV, 2);
  const partText = approx(partV, 2);
  const decText = approx(ratioV, 4);

  // Switching mode keeps the same picture: today's answer becomes an input.
  const changeMode = (m: Mode) => {
    if (m === mode) return;
    const nw = clamp(Math.round(wholeV), 1, 500);
    const np = clamp(Math.round(pctV), m === "whole" ? 1 : 0, 200);
    const nP = clamp(Math.round(partV), m === "whole" ? 1 : 0, m === "percent" ? 2 * nw : 400);
    setW(nw);
    setP(np);
    setPart(nP);
    setMode(m);
  };

  // ---- the double number line ----
  const X0 = 24;
  const X1 = 336;
  const over = pct.n > 100 * pct.d;
  const scaleMax = over ? 200 : 100;
  const xOf = (t: number) => X0 + (clamp(t, 0, scaleMax) / scaleMax) * (X1 - X0);
  const major = scaleMax / 10; // 10% or 20%
  const ticks: number[] = [];
  for (let t = 0; t <= scaleMax; t += major / 2) ticks.push(t);
  const labelled = ticks.filter((t) => t % major === 0);
  const amounts = labelled.map((t) => ({ t, v: (wholeV * t) / 100 }));
  const dense = amounts.every((a) => exactTo(a.v, 2) && fmt(a.v, 2).length <= 5);
  const amountLabels = dense ? amounts : amounts.filter((a) => a.t % 100 === 0);
  const mx = xOf(pctV);
  const x100 = xOf(100);
  // Rough text widths (SVG units) so labels never overlap or leave the viewBox.
  const textW = (s: string, size: number) => s.length * size * 0.62;
  const inBox = (x: number, w: number) => clamp(x, w / 2 + 2, 358 - w / 2);
  const pctMarkW = textW(pctShow.plain, 12);
  const partMarkW = textW(partText, 12);
  const pctMarkX = inBox(mx, pctMarkW);
  const partMarkX = inBox(mx, partMarkW);
  const clashes = (x: number, w: number, markX: number, markW: number) => Math.abs(x - markX) < (w + markW) / 2 + 3;
  const amountText = (v: number) => (dense ? fmt(v, 2) : approx(v, 2));

  const aria = `Double number line. 0% to 100% matches 0 to ${wholeText}. The marker at ${pctShow.plain} matches ${partText}.`;

  // ---- method panel ----
  let method: ReactNode;
  if (mode === "part") {
    const h = Math.floor(p / 100);
    const t = Math.floor((p % 100) / 10);
    const f = p % 10 >= 5 ? 1 : 0;
    const o = (p % 10) - 5 * f;
    const lines: string[] = [];
    if (h) lines.push(h === 1 ? `100% = ${fmt(W)}` : `${h} × 100% = ${h} × ${fmt(W)} = ${fmt(h * W)}`);
    if (t) lines.push(t === 1 ? `10% = ${fmt(W / 10)}` : `${t} × 10% = ${t} × ${fmt(W / 10)} = ${fmt((t * W) / 10)}`);
    if (f) lines.push(`5% = half of 10% = ${fmt(W / 20)}`);
    if (o) lines.push(o === 1 ? `1% = ${fmt(W / 100)}` : `${o} × 1% = ${o} × ${fmt(W / 100)} = ${fmt((o * W) / 100)}`);
    method = (
      <>
        <p className="font-bold text-ink">Build it from easy chunks (10% = ÷ 10, 1% = ÷ 100)</p>
        {lines.length ? (
          <ul className="mt-1 space-y-0.5 tabular-nums">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
            <li className="font-bold text-good">
              Total: {p}% of {fmt(W)} = {partText}
            </li>
          </ul>
        ) : (
          <p className="mt-1">0% of anything is 0.</p>
        )}
        <p className="mt-2">
          <span className="font-bold text-ink">Calculator way:</span> <M>{`${fmt(p / 100, 2)} * ${fmt(W)} = ${fmt(partV, 2)}`}</M>
        </p>
      </>
    );
  } else if (mode === "percent") {
    const raw = `${P}/${W}`;
    const simp = frac(P, W);
    const simpText = `${simp.n}/${simp.d}`;
    method = (
      <>
        <p className="font-bold text-ink">Write it as a fraction, then make it “out of 100”</p>
        <p className="mt-1 tabular-nums">
          {P} out of {W} = <M>{raw}</M>
          {simpText !== raw && simp.d !== 1 ? (
            <>
              {" "}= <M>{simpText}</M>
            </>
          ) : null}
          {simp.d !== 1 && 100 % simp.d === 0 ? (
            <>
              {" "}= <M>{`${simp.n * (100 / simp.d)}/100`}</M> = <strong className="text-good">{pctShow.rich}</strong>
            </>
          ) : (
            <>
              {" "}→ × 100 → <strong className="text-good">{pctShow.rich}</strong>
              {pctShow.plain.startsWith("≈") && pctShow.rich !== pctShow.plain ? <> ({pctShow.plain})</> : null}
            </>
          )}
        </p>
        <p className="mt-2">
          <span className="font-bold text-ink">Calculator way:</span> {P} ÷ {W} × 100 {eq(pctShow.plain)}
        </p>
      </>
    );
  } else {
    const one = frac(P, p);
    const oneV = one.n / one.d;
    const oneExact = exactTo(oneV, 3);
    const oneNode: ReactNode = oneExact ? fmt(oneV, 3) : <M>{`${one.n}/${one.d}`}</M>;
    method = (
      <>
        <p className="font-bold text-ink">Unitary method: go down to 1%, then up to 100%</p>
        <ul className="mt-1 space-y-0.5 tabular-nums">
          <li>
            {p}% = {P}
          </li>
          {p !== 1 ? (
            <li>
              1% = {P} ÷ {p} = {oneNode}
              {oneExact ? null : " (keep it as a fraction to stay exact)"}
            </li>
          ) : null}
          <li className="font-bold text-good">
            100% = {oneNode} × 100 {eq(wholeText)}
          </li>
        </ul>
        <p className="mt-2">
          <span className="font-bold text-ink">Multiplier way:</span> whole × {fmt(p / 100, 2)} = {P}, so whole = {P} ÷ {fmt(p / 100, 2)}{" "}
          {eq(wholeText)}
        </p>
      </>
    );
  }

  // ---- live caption ----
  let caption: ReactNode;
  if (mode === "part") {
    caption = (
      <>
        <strong>{p}%</strong> means {p} out of every 100, so {p}% of {fmt(W)} is <M>{`${p}/100`}</M> of it. Ten per cent is easy (÷ 10), so build
        up from chunks — or multiply by the decimal {fmt(p / 100, 2)} in one go.
        {over ? (
          <> Over 100% means <strong>more than the whole</strong>: the bar runs past the 100% mark, and the decimal is bigger than 1.</>
        ) : null}
      </>
    );
  } else if (mode === "percent") {
    caption = (
      <>
        To write one amount as a percentage of another, put the part over the whole: <M>{`${P}/${W}`}</M>. Multiplying by 100 says how many
        hundredths that is — {pctShow.plain}. Equivalent fractions give the same percentage, which is why scores out of different totals can be
        compared fairly.
        {over ? <> The part is bigger than the whole here, so the answer is over 100%.</> : null}
      </>
    );
  } else {
    caption = (
      <>
        Here you know a part ({P}) and the percentage it is ({p}%), but not the whole. The whole is always <strong>100%</strong>, so scale from{" "}
        {p}% to 100%: ÷ {p} then × 100. Check: {fmt(p / 100, 2)} × {wholeText.replace("≈", "")} {wholeText.startsWith("≈") ? "≈" : "="} {P}.
        A common slip is to work out {p}% of {P} instead — but {P} is the part, not the 100%.
      </>
    );
  }

  const tone = (m: Mode) => (mode === m ? "good" : "ink") as "good" | "ink";

  return (
    <WidgetFrame
      title="Percentage bar"
      tryThis={[
        "Predict 15% of 260 using 10% and 5% chunks, then set it up to check.",
        "*Find the percentage*: what is 34 marks out of 40? Then try 17 out of 20 — why is it the same?",
        "*Find the whole*: 30% of a number is 24. Predict the whole before you look.",
        "Push the part past the whole. What happens to the percentage, the decimal and the fraction?",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <Segmented<Mode>
          label="What do you want to find?"
          value={mode}
          onChange={changeMode}
          options={[
            { value: "part", label: "Find the part" },
            { value: "percent", label: "Find the %" },
            { value: "whole", label: "Find the whole" },
          ]}
        />

        <svg viewBox="0 0 360 122" className="h-auto w-full" role="img" aria-label={aria}>
          {/* the whole (0% to 100%) */}
          <rect x={X0} y={50} width={x100 - X0} height={36} className="fill-surface-2" />
          {/* the part */}
          {mx > X0 ? <rect x={X0} y={50} width={Math.min(mx, x100) - X0} height={36} className="fill-brand" opacity={0.8} /> : null}
          {over ? <rect x={x100} y={50} width={mx - x100} height={36} className="fill-accent" opacity={0.85} /> : null}
          <rect x={X0} y={50} width={x100 - X0} height={36} fill="none" className="stroke-ink" strokeWidth={1.5} />
          {/* the two number lines */}
          <line x1={X0} x2={X1} y1={50} y2={50} className="stroke-ink-2" strokeWidth={1} />
          <line x1={X0} x2={X1} y1={86} y2={86} className="stroke-ink-2" strokeWidth={1} />
          {ticks.map((t) => {
            const big = t % major === 0;
            return (
              <g key={`t${t}`}>
                <line x1={xOf(t)} x2={xOf(t)} y1={big ? 42 : 46} y2={50} className="stroke-ink-2" strokeWidth={1} />
                <line x1={xOf(t)} x2={xOf(t)} y1={86} y2={big ? 94 : 90} className="stroke-ink-2" strokeWidth={1} />
              </g>
            );
          })}
          {labelled
            .filter((t) => !clashes(xOf(t), textW(`${t}%`, 10), pctMarkX, pctMarkW))
            .map((t) => (
              <text
                key={`p${t}`}
                x={xOf(t)}
                y={34}
                fontSize={10}
                textAnchor="middle"
                className={t === 100 ? "fill-ink" : "fill-ink-2"}
                fontWeight={t === 100 ? 700 : 400}
              >
                {t}%
              </text>
            ))}
          {amountLabels
            .map((a) => ({ ...a, s: amountText(a.v), x: inBox(xOf(a.t), textW(amountText(a.v), 10)) }))
            .filter((a) => !clashes(a.x, textW(a.s, 10), partMarkX, partMarkW))
            .map((a) => (
              <text
                key={`a${a.t}`}
                x={a.x}
                y={110}
                fontSize={10}
                textAnchor="middle"
                className={a.t === 100 ? "fill-ink" : "fill-ink-2"}
                fontWeight={a.t === 100 ? 700 : 400}
              >
                {a.s}
              </text>
            ))}
          {/* the marker */}
          <line x1={mx} x2={mx} y1={38} y2={98} className="stroke-brand" strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={mx} cy={50} r={3.5} className="fill-brand" />
          <circle cx={mx} cy={86} r={3.5} className="fill-brand" />
          <text x={pctMarkX} y={34} fontSize={12} fontWeight={800} textAnchor="middle" className="fill-brand">
            {pctShow.plain}
          </text>
          <text x={partMarkX} y={111} fontSize={12} fontWeight={800} textAnchor="middle" className="fill-brand">
            {partText}
          </text>
        </svg>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mode !== "whole" ? (
            <NudgeSlider name="Whole" label="Whole (100%)" value={W} min={1} max={500} onChange={(v) => {
              setW(v);
              if (mode === "percent") setPart((x) => Math.min(x, 2 * v));
            }} />
          ) : null}
          {mode !== "percent" ? (
            <NudgeSlider name="Percentage" label="Percentage" value={p} min={mode === "whole" ? 1 : 0} max={200} onChange={setP} format={(v) => `${v}%`} />
          ) : null}
          {mode !== "part" ? (
            <NudgeSlider name="Part" label="Part" value={P} min={mode === "whole" ? 1 : 0} max={mode === "percent" ? 2 * W : 400} onChange={setPart} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Readout label={mode === "whole" ? "Whole (answer)" : "Whole"} value={wholeText} tone={tone("whole")} />
          <Readout label={mode === "percent" ? "Percent (answer)" : "Percent"} value={pctShow.rich} tone={tone("percent")} />
          <Readout label={mode === "part" ? "Part (answer)" : "Part"} value={partText} tone={tone("part")} />
        </div>

        <p className="text-sm text-ink-2">
          Same number, three ways: <strong className="text-ink">{pctShow.rich}</strong> = <strong className="text-ink">{decText}</strong>
          {ratio.d === 1 ? (
            <> — {ratio.n === 0 ? "none of the whole" : ratio.n === 1 ? "all of the whole" : `${ratio.n} times the whole`}.</>
          ) : (
            <>
              {" "}= <M>{fracMarkup(ratio)}</M> of the whole.
            </>
          )}
        </p>

        <div className="rounded-xl border border-line p-3 text-sm text-ink-2">{method}</div>
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. Multiplier chain                                                        */
/* ------------------------------------------------------------------------ */

const PRESETS: { label: string; start: number; steps: number[] }[] = [
  { label: "+10% then −10%", start: 200, steps: [10, -10] },
  { label: "+25% then −20%", start: 200, steps: [25, -20] },
  { label: "20% off, then 10% off", start: 150, steps: [-20, -10] },
  { label: "15% off, then 9% GST", start: 80, steps: [-15, 9] },
  { label: "3% interest for 3 years", start: 1000, steps: [3, 3, 3] },
];

function MultiplierChain() {
  const [start, setStart] = useState(200);
  const [count, setCount] = useState(2);
  const [steps, setSteps] = useState<number[]>([10, -10, 5]);

  const active = steps.slice(0, count);
  const mults = active.map((s) => (100 + s) / 100);
  const values: number[] = [start];
  for (const m of mults) values.push(values[values.length - 1] * m);
  const final = values[values.length - 1];
  const overall = mults.reduce((a, b) => a * b, 1);
  const change = (overall - 1) * 100;
  const sum = active.reduce((a, b) => a + b, 0);
  const undo = (1 / overall - 1) * 100;
  const wrongBack = final * (1 - change / 100);
  const noChange = Math.abs(change) < 1e-9;
  const addingWorks = Math.abs(change - sum) < 1e-9;
  const movers = active.filter((s) => s !== 0).length;
  const multText = (m: number) => fmt(m, 2);
  const overallText = fmt(overall, 6);
  // The second step that actually changes something works on an amount that is no longer the start.
  const moving = active.flatMap((s, i) => (s !== 0 ? [i] : []));
  const second = moving.length >= 2 ? moving[1] : -1;
  const absChange = final - start;
  const absChangeText = absChange !== 0 && Math.abs(absChange) < 0.005 ? "less than 1 cent" : money(absChange, true);
  // Show enough decimal places that the undo percentage visibly differs from the change it undoes.
  let undoDp = 2;
  while (undoDp < 12 && fmt(Math.abs(undo), undoDp) === fmt(Math.abs(change), undoDp)) undoDp++;
  const undoText = signedPct(undo, undoDp);
  // When the change is tiny, the wrong answer can round to the start amount: show more places.
  const wrongClose = Math.abs(wrongBack - start) < 0.005;
  let wrongText = money(wrongBack);
  if (wrongClose) {
    let dp = 3;
    while (dp < 12 && wrongBack.toFixed(dp) === start.toFixed(dp)) dp++;
    wrongText = `≈$${wrongBack.toFixed(dp)}`;
  }

  const setStep = (i: number, v: number) => setSteps((prev) => prev.map((s, j) => (j === i ? v : s)));
  const applyPreset = (ps: (typeof PRESETS)[number]) => {
    setStart(ps.start);
    setCount(ps.steps.length);
    setSteps((prev) => [...ps.steps, ...prev.slice(ps.steps.length)]);
  };

  // ---- chart geometry ----
  const k = values.length;
  const L = 16;
  const R = 344;
  const base = 184;
  const Hmax = 120;
  const slot = (R - L) / k;
  const bw = Math.min(64, slot - 30);
  const cx = (i: number) => L + slot * (i + 0.5);
  const maxV = Math.max(...values);
  const hOf = (v: number) => (Hmax * v) / maxV;
  const barClass = (i: number) => {
    if (i === 0) return "fill-brand-soft stroke-brand";
    if (values[i] > values[i - 1] + 1e-9) return "fill-good-soft stroke-good";
    if (values[i] < values[i - 1] - 1e-9) return "fill-bad-soft stroke-bad";
    return "fill-surface-2 stroke-ink-2";
  };
  const aria = `Bar chart. Start ${money(start)}${values
    .slice(1)
    .map((v, i) => `, after step ${i + 1} (${signedPct(active[i])}) ${money(v)}`)
    .join("")}. Overall multiplier ${overallText}.`;

  const chainMarkup = `${mults.map(multText).join(" * ")}${count > 1 ? ` = ${overallText}` : ""}`;

  // ---- live caption ----
  let caption: ReactNode;
  if (count === 1) {
    const s = active[0];
    caption =
      s > 0 ? (
        <>
          Increasing by {s}% keeps the original 100% and adds {s}%, so you end with {100 + s}% of it: multiply by{" "}
          <strong>{multText(mults[0])}</strong>. {money(start)} × {multText(mults[0])} = {money(final)}. One multiplication does the
          “find the percentage, then add it on” in a single step.
        </>
      ) : s < 0 ? (
        <>
          Decreasing by {-s}% leaves {100 + s}% of the original, so multiply by <strong>{multText(mults[0])}</strong>. {money(start)} ×{" "}
          {multText(mults[0])} = {money(final)}. One multiplication does the “find the percentage, then take it off” in a single step.
        </>
      ) : (
        <>A 0% change has multiplier 1 — nothing happens. Move the slider to increase or decrease.</>
      );
  } else {
    caption = (
      <>
        Each step multiplies by its own multiplier, so the whole chain is <strong>one multiplication</strong>: <M>{chainMarkup}</M>, an overall
        change of <strong>{signedPct(change)}</strong>.{" "}
        {addingWorks ? (
          movers <= 1 ? (
            <>Here just adding the percentages gives the same answer, but only because at most one step actually changes anything.</>
          ) : (
            <>Here just adding the percentages happens to give the right answer — a rare coincidence! Nudge any step and it breaks.</>
          )
        ) : (
          <>
            Just adding the percentages gives {signedPct(sum)} — wrong, because each percentage is taken of a <em>different</em> amount: step{" "}
            {second + 1} works on {money(values[second])}, not {money(start)}.
          </>
        )}{" "}
        The change in money is {absChangeText} (the <strong>absolute</strong> change); {signedPct(change)} is the{" "}
        <strong>relative</strong> change.
      </>
    );
  }

  return (
    <WidgetFrame
      title="Multiplier chain"
      tryThis={[
        "Set +10% then −10%. Why don’t you get back to the start — and by exactly how much do you miss?",
        "Find the single decrease that exactly undoes +25%.",
        "Find two discounts that make exactly 40% off overall. (Only one pair of whole numbers works!)",
        "Swap the order of two steps. Does the final amount change? Why not?",
      ]}
      caption={caption}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Examples to try">
          {PRESETS.map((ps) => (
            <button key={ps.label} type="button" className="btn btn-secondary text-sm" onClick={() => applyPreset(ps)}>
              {ps.label}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 360 208" className="h-auto w-full" role="img" aria-label={aria}>
          <line x1={L} x2={R} y1={base} y2={base} className="stroke-ink-2" strokeWidth={1.5} />
          {values.map((v, i) => (
            <rect
              key={`b${i}`}
              x={cx(i) - bw / 2}
              y={base - hOf(v)}
              width={bw}
              height={hOf(v)}
              rx={3}
              className={barClass(i)}
              strokeWidth={i === k - 1 ? 2.5 : 1.5}
            />
          ))}
          {/* the starting level, for comparison */}
          <line
            x1={L}
            x2={R}
            y1={base - hOf(start)}
            y2={base - hOf(start)}
            className="stroke-ink-2"
            strokeWidth={1}
            strokeDasharray="5 4"
          />
          {values.map((v, i) => (
            <text key={`v${i}`} x={cx(i)} y={base - hOf(v) - 6} fontSize={11} fontWeight={700} textAnchor="middle" className="fill-ink">
              {money(v)}
            </text>
          ))}
          {values.map((_, i) => (
            <text key={`s${i}`} x={cx(i)} y={201} fontSize={11} textAnchor="middle" className="fill-ink-2">
              {i === 0 ? "Start" : `After step ${i}`}
            </text>
          ))}
          {mults.map((m, i) => {
            const mid = (cx(i) + cx(i + 1)) / 2;
            const a1 = cx(i) + bw / 2 + 4;
            const a2 = cx(i + 1) - bw / 2 - 4;
            return (
              <g key={`m${i}`}>
                <text x={mid} y={16} fontSize={12} fontWeight={800} textAnchor="middle" className="fill-brand">
                  ×{multText(m)}
                </text>
                <text x={mid} y={30} fontSize={10} textAnchor="middle" className="fill-ink-2">
                  {signedPct(active[i])}
                </text>
                <line x1={a1} x2={a2 - 4} y1={42} y2={42} className="stroke-brand" strokeWidth={1.5} />
                <path d={`M ${a2} 42 L ${a2 - 6} 38 L ${a2 - 6} 46 Z`} className="fill-brand" />
              </g>
            );
          })}
        </svg>
        <p className="-mt-2 text-xs text-ink-2">Dashed line = the starting amount. Green bars went up, orange bars went down.</p>

        <div className="space-y-3">
          <NudgeSlider name="Starting amount" label="Starting amount" value={start} min={10} max={1000} onChange={setStart} format={(v) => `$${v}`} />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-2">Number of steps</span>
            <Segmented<"1" | "2" | "3">
              label="Number of steps"
              value={String(count) as "1" | "2" | "3"}
              onChange={(v) => setCount(Number(v))}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
            />
          </div>
          {active.map((s, i) => (
            <NudgeSlider
              key={`step${i}`}
              name={`Step ${i + 1} change`}
              label={`Step ${i + 1} change`}
              value={s}
              min={-90}
              max={100}
              onChange={(v) => setStep(i, v)}
              format={(v) => `${signedPct(v)} (×${multText((100 + v) / 100)})`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Readout label="Overall multiplier" value={`×${overallText}`} />
          <Readout label="Overall change" value={signedPct(change)} tone={noChange ? "ink" : change > 0 ? "good" : "bad"} />
          <Readout label="Just adding the %s" value={signedPct(sum)} tone="ink" />
          <Readout label="Final amount" value={money(final)} tone="ink" />
        </div>

        <div className="rounded-xl border border-line p-3 text-sm text-ink-2">
          <p className="font-bold text-ink">Going backwards (reverse percentage)</p>
          {noChange ? (
            <p className="mt-1">
              The overall multiplier is exactly 1, so you are already back at {money(start)}.
              {movers > 1 ? " These changes cancel out exactly — and notice they are not equal and opposite percentages." : null}
            </p>
          ) : (
            <>
              <p className="mt-1 tabular-nums">
                Start = final ÷ overall multiplier: <M>{`${fmt(final, 2)} ÷ ${overallText}`}</M> = {money(start)}
                {exactTo(final, 2) ? "" : " (using the unrounded final amount)"}.
              </p>
              <p className="mt-1">
                As one percentage, undoing the chain is a change of <strong className="text-ink">{undoText}</strong>, not{" "}
                {signedPct(-change)}.
              </p>
              <p className="mt-1">
                <span className="font-bold text-bad">Classic mistake:</span> {change < 0 ? "adding" : "taking off"} {approx(Math.abs(change), 4)}% of
                the final {money(final)} gives {wrongText}
                {wrongClose ? ` — very close to ${money(start)} because the change is tiny, but still not exact` : `, not ${money(start)}`}. The
                percentage was of the <em>start</em>, not of the final amount.
              </p>
            </>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------------ */

export const widgets: WidgetDef[] = [
  {
    id: "percent-bar",
    title: "Percentage bar",
    blurb: "One picture, three questions: find the part, the percentage or the whole on a double number line.",
    Component: PercentBar,
  },
  {
    id: "multiplier-chain",
    title: "Multiplier chain",
    blurb: "Chain percentage changes as multipliers — and see why +10% then −10% doesn’t get you back to the start.",
    Component: MultiplierChain,
  },
];
