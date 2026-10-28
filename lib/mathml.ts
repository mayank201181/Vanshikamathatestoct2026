// ---------------------------------------------------------------------------
// Tiny "maths markup" → MathML converter for {{ … }} spans in content.
// Native MathML is rendered by all modern browsers (Chrome 109+, Safari,
// Firefox) — no fonts or libraries needed.
//
//   {{3/4}}  {{2 1/3}}  {{x^2}}  {{10^(-3)}}  {{sqrt(49)}}  {{cbrt(27)}}
//   {{(2x+1)/3}}  {{a_1}}  {{3 * 4}}  {{x <= 5}}  {{pi r^2}}  {{"area"}}
//
// A run like 2x or 3ab is one term (so {{2x/3}} = two-x over three).
// Brackets around a numerator / denominator / exponent are dropped in display.
// Any parse failure falls back to the escaped raw text.
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type T =
  | { k: "num"; v: string }
  | { k: "word"; v: string }
  | { k: "text"; v: string }
  | { k: "op"; v: string }
  | { k: "lp"; v: string }
  | { k: "rp"; v: string }
  | { k: "sp" };

const FUNCS = new Set(["sin", "cos", "tan", "log", "ln", "max", "min", "mod", "HCF", "LCM", "hcf", "lcm"]);
const UNITS = new Set([
  "cm", "mm", "km", "kg", "mg", "ml", "mph", "kmh", "min", "hr", "hrs", "sec", "km/h", "m/s",
  "cm2", "cm3", "m2", "m3", "litres", "litre", "days", "day", "hours", "hour", "mins", "secs",
]);

const OPS2: Record<string, string> = {
  "<=": "≤", ">=": "≥", "!=": "≠", "+-": "±", "->": "→", "~=": "≈", "=>": "⇒", "<-": "←",
};
const OPS1: Record<string, string> = {
  "+": "+", "-": "−", "*": "×", "=": "=", "<": "&lt;", ">": "&gt;", ",": ",", ":": "∶",
  "!": "!", "%": "%", "°": "°", "×": "×", "÷": "÷", "−": "−", "±": "±", "≤": "≤", "≥": "≥",
  "≠": "≠", "≈": "≈", "→": "→", "|": "|", "'": "′", ";": ";", "∠": "∠", "△": "△", "⊥": "⊥",
  "∥": "∥", "∞": "∞", "·": "·", "…": "…", ".": ".", "≡": "≡", "∴": "∴", "∪": "∪", "∩": "∩",
  "∈": "∈", "?": "?", "£": "£", "$": "$", "#": "#", "~": "~", "&": "&amp;",
};

function lex(src: string): T[] | null {
  const out: T[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      while (i < src.length && /\s/.test(src[i])) i++;
      out.push({ k: "sp" });
      continue;
    }
    if (c === '"') {
      const j = src.indexOf('"', i + 1);
      if (j < 0) return null;
      out.push({ k: "text", v: src.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      const m = src.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/)!;
      out.push({ k: "num", v: m[0] });
      i += m[0].length;
      continue;
    }
    if (/[A-Za-zα-ωΑ-Ωθπ]/.test(c)) {
      const m = src.slice(i).match(/^[A-Za-zα-ωΑ-Ωθπ]+/)!;
      out.push({ k: "word", v: m[0] });
      i += m[0].length;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") { out.push({ k: "lp", v: c }); i++; continue; }
    if (c === ")" || c === "]" || c === "}") { out.push({ k: "rp", v: c }); i++; continue; }
    const two = src.slice(i, i + 2);
    if (OPS2[two]) { out.push({ k: "op", v: two }); i += 2; continue; }
    if (c === "/" || c === "^" || c === "_") { out.push({ k: "op", v: c }); i++; continue; }
    if (c in OPS1) { out.push({ k: "op", v: c }); i++; continue; }
    // Superscript digits typed directly (x²) become powers.
    if ("²³".includes(c)) { out.push({ k: "op", v: "^" }); out.push({ k: "num", v: c === "²" ? "2" : "3" }); i++; continue; }
    // Anything else: pass through as an operator glyph.
    out.push({ k: "op", v: c });
    i++;
  }
  return out;
}

interface Node {
  ml: string;
  /** For bracket groups: the inner MathML without the brackets. */
  inner?: string;
}

function mi(letter: string): string {
  if (letter === "π") return "<mi>π</mi>";
  return `<mi>${esc(letter)}</mi>`;
}

function wordML(w: string): string {
  if (w === "pi") return "<mi>π</mi>";
  if (w === "theta") return "<mi>θ</mi>";
  if (FUNCS.has(w) || UNITS.has(w)) return `<mi mathvariant="normal">${esc(w)}</mi>`;
  if (w.length > 3 && /^[a-z]+$/i.test(w)) return `<mtext>${esc(w)}</mtext>`; // a real word
  return w.split("").map(mi).join("");
}

class P {
  i = 0;
  t: T[];
  constructor(t: T[]) {
    this.t = t;
  }
  peek(): T | undefined { return this.t[this.i]; }
  skipSp() { while (this.peek()?.k === "sp") this.i++; }

  seq(stopAtRp: boolean): string {
    const parts: string[] = [];
    let spaced = false;
    for (;;) {
      const t = this.peek();
      if (!t) break;
      if (t.k === "rp") {
        if (stopAtRp) break;
        this.i++;
        parts.push(`<mo>${esc(t.v)}</mo>`);
        spaced = false;
        continue;
      }
      if (t.k === "sp") { this.i++; spaced = true; continue; }
      const ml = this.frac().ml;
      // Keep the gap between two words ("average speed"), which MathML would otherwise close up.
      if (spaced && /<\/mtext>(?:<\/mrow>)*$/.test(parts[parts.length - 1] ?? "") && /^(?:<mrow>)*<mtext>/.test(ml)) parts.push('<mspace width="0.3em"/>');
      parts.push(ml);
      spaced = false;
    }
    return parts.join("");
  }

  frac(): Node {
    let left = this.powered();
    for (;;) {
      const save = this.i;
      this.skipSpNoMixed();
      const t = this.peek();
      if (t && t.k === "op" && t.v === "/") {
        this.i++;
        this.skipSp();
        const right = this.powered();
        left = { ml: `<mfrac><mrow>${left.inner ?? left.ml}</mrow><mrow>${right.inner ?? right.ml}</mrow></mfrac>` };
      } else {
        this.i = save;
        return left;
      }
    }
  }

  // Allow "a / b" with spaces around the slash.
  skipSpNoMixed() {
    if (this.peek()?.k === "sp" && this.t[this.i + 1]?.k === "op" && (this.t[this.i + 1] as { v: string }).v === "/") this.i++;
  }

  script(): string {
    const t = this.peek();
    if (t && t.k === "op" && (t.v === "-" || t.v === "+")) {
      this.i++;
      const n = this.base();
      return `<mrow><mo>${t.v === "-" ? "−" : "+"}</mo>${n.inner ?? n.ml}</mrow>`;
    }
    const n = this.base(true);
    return `<mrow>${n.inner ?? n.ml}</mrow>`;
  }

  powered(): Node {
    let b = this.base();
    for (;;) {
      const t = this.peek();
      if (t && t.k === "op" && (t.v === "^" || t.v === "_")) {
        this.i++;
        const s = this.script();
        // Superscript on a bracket group keeps the brackets: (x+1)^2.
        const baseMl = b.ml;
        b = { ml: t.v === "^" ? `<msup><mrow>${baseMl}</mrow>${s}</msup>` : `<msub><mrow>${baseMl}</mrow>${s}</msub>` };
      } else return b;
    }
  }

  base(single = false): Node {
    const t = this.peek();
    if (!t) return { ml: "" };
    if (t.k === "lp") {
      this.i++;
      const inner = this.seq(true);
      const close = this.peek();
      if (close?.k === "rp") this.i++;
      const open = t.v === "{" ? "" : t.v;
      const shut = close?.k === "rp" ? (close.v === "}" ? "" : close.v) : "";
      return {
        ml: `<mrow>${open ? `<mo>${open}</mo>` : ""}${inner}${shut ? `<mo>${shut}</mo>` : ""}</mrow>`,
        inner: `<mrow>${inner}</mrow>`,
      };
    }
    if (t.k === "text") { this.i++; return { ml: `<mtext>${esc(t.v)}</mtext>` }; }
    if (t.k === "num") {
      this.i++;
      let ml = `<mn>${esc(t.v)}</mn>`;
      if (single) return { ml };
      // Glue a following word (2x, 3ab) into one term.
      const n = this.peek();
      if (n && n.k === "word" && !FUNCS.has(n.v) && n.v !== "sqrt" && n.v !== "cbrt" && !UNITS.has(n.v)) {
        this.i++;
        ml += this.wordWithPowers(n.v);
      }
      return { ml: `<mrow>${ml}</mrow>` };
    }
    if (t.k === "word") {
      this.i++;
      if (t.v === "sqrt" || t.v === "cbrt") {
        this.skipSp();
        const arg = this.base();
        const inner = arg.inner ?? arg.ml;
        return { ml: t.v === "sqrt" ? `<msqrt>${inner}</msqrt>` : `<mroot><mrow>${inner}</mrow><mn>3</mn></mroot>` };
      }
      if (single) return { ml: wordML(t.v) };
      return { ml: `<mrow>${this.wordWithPowers(t.v)}</mrow>` };
    }
    if (t.k === "op") {
      this.i++;
      const glyph = OPS2[t.v] ?? OPS1[t.v] ?? esc(t.v);
      return { ml: `<mo>${glyph}</mo>` };
    }
    if (t.k === "sp") { this.i++; return { ml: "" }; }
    this.i++;
    return { ml: "" };
  }

  /** A word, where a ^ directly after it applies to its last letter only (handled by powered()). */
  wordWithPowers(w: string): string {
    return wordML(w);
  }
}

/**
 * Preview a learner's typed answer (already passed through normalizeInput).
 * The marker (parseExpr in lib/mathParse.ts) divides by the single factor straight
 * after a "/", so "A/2h" is (A/2)·h and "1/2x" is ½x. Content markup glues 2h or bh
 * into one term, which would show A over 2h — the opposite of how the answer is
 * marked — so split that first factor off before rendering.
 *
 * Only `algebra` answers (type "expression") are marked by parseExpr. Number, list and
 * ratio answers read the letters after a "/" as one unit (60 km/hr, £3.50/kg, 2.7 g/cm³),
 * so those previews keep the content grouping.
 */
export function typedToMathML(normalized: string, algebra = true): string {
  let s = normalized.replace(/\bsqrt\s*\(/g, "sqrt(").replace(/\*/g, " * ");
  if (algebra) s = s.replace(/\/\s*(?!sqrt|cbrt)(\d+(?:\.\d+)?|\.\d+|pi|(?!pi)[a-z])(?=[a-z])/gi, "/$1 ");
  return toMathML(s);
}

/** Convert maths markup (the inside of {{ }}) to a MathML string. */
export function toMathML(src: string): string {
  try {
    const toks = lex(src.trim());
    if (!toks) throw new Error("lex");
    const p = new P(toks);
    const body = p.seq(false);
    if (p.i < toks.length) throw new Error("trailing");
    return `<math displaystyle="true">${body}</math>`;
  } catch {
    return `<span class="math-raw">${esc(src)}</span>`;
  }
}
