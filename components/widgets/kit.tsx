"use client";
// Shared building blocks for interactive widgets ("explorables").
// Widgets live in components/widgets/<topicId>.tsx and export
//   export const widgets: WidgetDef[]
import { useId, type ReactNode } from "react";
import { renderInline } from "../Rich";

export interface WidgetDef {
  /** Unique, kebab-case. */
  id: string;
  title: string;
  /** One line shown above the widget: what to explore. */
  blurb: string;
  Component: () => ReactNode;
}

/** Card wrapper with a title, a "try this" prompt and a live caption. */
export function WidgetFrame({
  title,
  tryThis,
  children,
  caption,
}: {
  title: string;
  /** Short challenge prompts, e.g. "Can you make the gradient −2?" */
  tryThis?: string[];
  children: ReactNode;
  /** Live plain-language explanation of what the learner is seeing. */
  caption?: ReactNode;
}) {
  return (
    <section className="card p-4 sm:p-5">
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      {tryThis?.length ? (
        <ul className="mt-2 space-y-1 text-sm text-ink-2">
          {tryThis.map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden>🎯</span>
              <span>{renderInline(t)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4">{children}</div>
      {caption ? <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-ink">{caption}</div> : null}
    </section>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <label htmlFor={id} className="font-semibold text-ink-2">{label}</label>
        <span className="font-extrabold tabular-nums text-ink">{format ? format(value) : value}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => ReactNode;
}) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(10)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(10)));
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-ink-2">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" className="kbd" onClick={dec} disabled={value <= min} aria-label="decrease">−</button>
        <span className="min-w-[3ch] text-center text-lg font-extrabold tabular-nums">{format ? format(value) : value}</span>
        <button type="button" className="kbd" onClick={inc} disabled={value >= max} aria-label="increase">+</button>
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${o.value === value ? "bg-surface text-brand shadow-sm" : "text-ink-2 hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A labelled big number/result. */
export function Readout({ label, value, tone = "brand" }: { label: ReactNode; value: ReactNode; tone?: "brand" | "good" | "bad" | "ink" }) {
  const color = tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : tone === "ink" ? "text-ink" : "text-brand";
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2">
      <div className="text-xs font-bold uppercase tracking-wide text-ink-2">{label}</div>
      <div className={`text-xl font-extrabold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

/** Inline maths in widget text: <M>{"3/4"}</M> renders {{3/4}}. */
export function M({ children }: { children: string }) {
  return <>{renderInline(`{{${children}}}`)}</>;
}

/**
 * Coordinate-plane helper for SVG widgets. Maps maths coordinates to SVG
 * pixels and draws a grid with axes. Use inside an <svg viewBox="0 0 W H">.
 */
export function makePlane(opts: { width: number; height: number; xMin: number; xMax: number; yMin: number; yMax: number; pad?: number }) {
  const pad = opts.pad ?? 24;
  const sx = (opts.width - 2 * pad) / (opts.xMax - opts.xMin);
  const sy = (opts.height - 2 * pad) / (opts.yMax - opts.yMin);
  const px = (x: number) => pad + (x - opts.xMin) * sx;
  const py = (y: number) => opts.height - pad - (y - opts.yMin) * sy;
  return { px, py, sx, sy, pad, ...opts };
}

export function PlaneGrid({ plane, step = 1, labels = true }: { plane: ReturnType<typeof makePlane>; step?: number; labels?: boolean }) {
  const { px, py, xMin, xMax, yMin, yMax } = plane;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let x = Math.ceil(xMin / step) * step; x <= xMax + 1e-9; x += step) xs.push(+x.toFixed(6));
  for (let y = Math.ceil(yMin / step) * step; y <= yMax + 1e-9; y += step) ys.push(+y.toFixed(6));
  return (
    <g>
      {xs.map((x) => (
        <line key={`gx${x}`} x1={px(x)} x2={px(x)} y1={py(yMin)} y2={py(yMax)} className="stroke-line" strokeWidth={1} />
      ))}
      {ys.map((y) => (
        <line key={`gy${y}`} y1={py(y)} y2={py(y)} x1={px(xMin)} x2={px(xMax)} className="stroke-line" strokeWidth={1} />
      ))}
      {xMin <= 0 && xMax >= 0 ? <line x1={px(0)} x2={px(0)} y1={py(yMin)} y2={py(yMax)} className="stroke-ink-2" strokeWidth={1.5} /> : null}
      {yMin <= 0 && yMax >= 0 ? <line y1={py(0)} y2={py(0)} x1={px(xMin)} x2={px(xMax)} className="stroke-ink-2" strokeWidth={1.5} /> : null}
      {labels
        ? xs.filter((x) => x !== 0).map((x) => (
            <text key={`lx${x}`} x={px(x)} y={py(Math.max(yMin, Math.min(0, yMax))) + 14} fontSize={10} textAnchor="middle" className="fill-ink-2">{x}</text>
          ))
        : null}
      {labels
        ? ys.filter((y) => y !== 0).map((y) => (
            <text key={`ly${y}`} x={px(Math.max(xMin, Math.min(0, xMax))) - 6} y={py(y) + 3} fontSize={10} textAnchor="end" className="fill-ink-2">{y}</text>
          ))
        : null}
    </g>
  );
}
