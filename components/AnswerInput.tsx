"use client";
// Typed-answer box with a maths keypad and a live "we read this as" preview.
import { useId, useRef } from "react";
import type { AnswerSpec } from "@/lib/types";
import { typedToMathML } from "@/lib/mathml";
import { normalizeInput } from "@/lib/mathParse";

// No π for number answers: they want the decimal value (exact "in terms of π" answers are expressions).
const KEYS_BY_TYPE: Record<AnswerSpec["type"], string[]> = {
  number: ["−", "/", ".", "×10^"],
  fraction: ["−", "/", "␣"],
  list: [",", "−", "/", "(", ")"],
  ratio: [":", "/", "."],
  expression: ["x", "y", "n", "^", "(", ")", "−", "/", "√", "π"],
  text: ["<", ">", "≤", "≥", "−", "x"],
};

const PLACEHOLDER: Record<AnswerSpec["type"], string> = {
  number: "e.g. 12, −3.5 or 3/4",
  fraction: "e.g. 3/4 or 1 2/3",
  list: "e.g. 28, 35",
  ratio: "e.g. 3 : 4",
  expression: "e.g. 3x + 2 or 2(x − 1)",
  text: "Type your answer",
};

/** Convert typed input into display maths for the preview, read the way the marker reads it. */
function previewMarkup(raw: string, type: AnswerSpec["type"]): string {
  return typedToMathML(normalizeInput(raw), type === "expression");
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  type,
  disabled,
  autoFocus,
  label = "Your answer",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  type: AnswerSpec["type"];
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const keys = KEYS_BY_TYPE[type] ?? [];
  const showPreview = value.trim().length > 0 && /[/^√π*×]|sqrt|\d\s+\d+\//.test(value);

  function insert(key: string) {
    const el = ref.current;
    const text = key === "␣" ? " " : key === "−" ? "-" : key === "√" ? "sqrt(" : key === "×10^" ? " x 10^" : key;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-ink-2">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="input font-semibold tabular-nums"
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
        placeholder={PLACEHOLDER[type]}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      {!disabled && keys.length ? (
        <div className="flex flex-wrap gap-1.5" aria-label="Maths keys">
          {keys.map((key) => (
            <button key={key} type="button" className="kbd text-sm" onClick={() => insert(key)} aria-label={`insert ${key === "␣" ? "space" : key}`}>
              {key}
            </button>
          ))}
        </div>
      ) : null}
      {showPreview ? (
        <div className="text-sm text-ink-2" aria-live="polite">
          We read this as: <span className="math align-middle text-ink" dangerouslySetInnerHTML={{ __html: previewMarkup(value, type) }} />
        </div>
      ) : null}
    </div>
  );
}
