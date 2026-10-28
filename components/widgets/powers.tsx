"use client";
// Squares, cubes and square roots of different kinds of number — the Unit 2
// objective "explain what happens when negatives and numbers between 0 and 1 are
// squared, cubed and rooted". Slide x and compare x, x², x³ and √x on one number line.
import { useState } from "react";
import { WidgetFrame, Slider, Readout, M, type WidgetDef } from "./kit";

const fmt = (v: number) => {
  if (!Number.isFinite(v)) return "—";
  const r = Math.round(v * 10000) / 10000;
  return String(r).replace("-", "−");
};

function kind(x: number): string {
  if (x < -1) return "a negative number less than −1";
  if (x === -1) return "−1";
  if (x < 0) return "a negative number between −1 and 0";
  if (x === 0) return "zero";
  if (x < 1) return "a number between 0 and 1";
  if (x === 1) return "1";
  return "a number bigger than 1";
}

function PowersExplorer() {
  const [x, setX] = useState(0.5);
  const sq = x * x;
  const cu = x * x * x;
  const rt = x >= 0 ? Math.sqrt(x) : NaN;
  const W = 460, H = 120, lo = -3, hi = 3;
  const px = (v: number) => 20 + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (W - 40);
  const marks = [
    { v: x, label: "x", fill: "#4f46e5" },
    { v: sq, label: "x²", fill: "#0d9488" },
    { v: cu, label: "x³", fill: "#db2777" },
    ...(x >= 0 ? [{ v: rt, label: "√x", fill: "#ea580c" }] : []),
  ];
  let caption: string;
  if (x < 0) caption = `x is ${kind(x)}. Squaring makes it positive (negative × negative = positive), cubing keeps it negative, and a negative number has no square root you can work out in Year 8.`;
  else if (x === 0 || x === 1) caption = `x is ${kind(x)}: squaring, cubing and square-rooting all leave it the same.`;
  else if (x < 1) caption = `x is ${kind(x)}. Squaring and cubing make it SMALLER (you take a fraction of a fraction), but the square root is BIGGER than x.`;
  else caption = `x is ${kind(x)}. Squaring and cubing make it bigger; the square root is smaller than x.`;
  return (
    <WidgetFrame
      title="Squares, cubes and roots"
      tryThis={["Make {{x^2}} smaller than x. Which values of x do it?", "Find a value where {{sqrt(x)}} is bigger than x.", "What happens to {{x^3}} when x is negative?"]}
      caption={caption}
    >
      <Slider label={<span>x</span>} value={x} min={-2} max={2} step={0.1} onChange={(v) => setX(Math.round(v * 10) / 10)} format={fmt} />
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label={<M>{"x"}</M>} value={fmt(x)} tone="ink" />
        <Readout label={<M>{"x^2"}</M>} value={fmt(sq)} />
        <Readout label={<M>{"x^3"}</M>} value={fmt(cu)} />
        <Readout label={<M>{"sqrt(x)"}</M>} value={x >= 0 ? fmt(rt) : "not possible"} tone={x >= 0 ? "brand" : "bad"} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Number line showing x, x squared, x cubed and root x">
        <line x1={20} x2={W - 20} y1={70} y2={70} stroke="#334155" strokeWidth={1.5} />
        {[-3, -2, -1, 0, 1, 2, 3].map((t) => (
          <g key={t}>
            <line x1={px(t)} x2={px(t)} y1={64} y2={76} stroke="#334155" />
            <text x={px(t)} y={92} fontSize={12} textAnchor="middle" fill="#334155">{String(t).replace("-", "−")}</text>
          </g>
        ))}
        {marks.map((m, i) => (
          <g key={m.label}>
            <circle cx={px(m.v)} cy={70} r={6} fill={m.fill} />
            <text x={px(m.v)} y={50 - (i % 2) * 18} fontSize={13} fontWeight={700} textAnchor="middle" fill={m.fill}>{m.label}</text>
          </g>
        ))}
      </svg>
      <p className="mt-1 text-xs text-ink-2">Values beyond ±3 sit at the end of the line.</p>
    </WidgetFrame>
  );
}

export const widgets: WidgetDef[] = [
  {
    id: "powers-explorer",
    title: "Squares, cubes and roots",
    blurb: "Slide x through negatives, 0 to 1 and bigger numbers, and watch what squaring, cubing and square-rooting do.",
    Component: PowersExplorer,
  },
];
