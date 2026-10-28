// Core data model for the Year 8 Maths test-prep app:
//   Unit 1 — Fractions, Decimals & Percentages (incl. Ratio & Proportion)
//   Unit 2 — Expressions & Sequences
// Content is authored as typed modules so every answer key is type-checked at build time
// and machine-checked by `npm run validate`.
//
// TEXT FORMAT — every rendered string (questions, options, feedback, guide text …):
//   **bold**   *italic*   blank line = new paragraph   "- " bullet lines   "1. " numbered lines
//   | a | b |  pipe tables (first row = header; second row may be |---|---|)
//   lines indented 4 spaces = a worked-calculation block
//   {{ … }}    inline maths, rendered as real maths:
//              {{3/4}} stacked fraction · {{2 1/3}} mixed number · {{x^2}} power
//              {{sqrt(49)}} root · {{(2x+1)/3}} brackets group a numerator/denominator
//              * → ×   - → −   <= → ≤   >= → ≥
//   Plain unicode (×, ÷, −, ², ³, ≤, ≥) is fine outside {{ }} too.

export type TopicId = "fr" | "pc" | "ra" | "ex" | "su" | "sq";
export type Difficulty = "warmup" | "core" | "challenge";

/** Guide section ids. Every question points at one of these (its `section`). */
export type SectionId =
  // Fractions (Unit 1)
  | "fr-equivalent" // equivalent fractions, simplifying, ordering with a common denominator, improper ↔ mixed
  | "fr-addsub" // adding & subtracting fractions and mixed numbers
  | "fr-muldiv" // multiplying & dividing fractions and mixed numbers, fraction of an amount
  | "fr-problems" // fractions in context: "of what's left", smallest possible number, order of operations
  | "fr-algebraic" // simplifying, multiplying and dividing simple algebraic fractions
  // Percentages (Unit 1)
  | "pc-fdp" // fraction/decimal/percentage equivalents, converting, ordering
  | "pc-of-amount" // percentage of an amount (with/without calculator), one number as a percentage of another
  | "pc-change" // new amount after a percentage increase/decrease (incl. > 100%)
  | "pc-percent-change" // calculating the percentage change from one amount to another (incl. > 100%)
  | "pc-multipliers" // decimal multipliers, repeated / successive percentage changes
  // Ratio & Proportion (Unit 1)
  | "ra-basics" // ratio notation, simplifying, link to fractions, 1 : n and n : 1
  | "ra-sharing" // sharing in a ratio; part : part and part : whole problems; given one share or a difference
  | "ra-proportion" // describing proportion with fractions/ratios, comparing ratios, combining ratios (a:b, b:c)
  | "ra-problems" // ratio problems in unfamiliar contexts (changing ratios, puzzles, speed, mixing)
  // Expressions (Unit 2)
  | "ex-simplify" // collecting like terms incl. x² and x³, simplifying products, algebra notation
  | "ex-expand" // expanding a single bracket; sums and differences of brackets
  | "ex-factorise" // factorising into a single bracket, fully; equivalence and identities (≡)
  | "ex-double" // expanding pairs of brackets incl. (2x + 3)(3x − 4) and (2x − 3)²
  | "ex-forming" // forming expressions from situations: perimeter, area, angles, number puzzles
  // Substitution (Unit 2)
  | "su-basics" // substituting positive integers; order of operations; implied multiplication
  | "su-negatives" // substituting negatives, decimals and fractions; (−3)² vs −3²
  | "su-formulae" // using formulae (perimeter, area, ½mv² …), powers and roots
  | "su-powers" // what happens when negatives / numbers between 0 and 1 are squared, cubed, rooted
  // Sequences (Unit 2)
  | "sq-terms" // term-to-term rules, times-table sequences, filling gaps in arithmetic sequences
  | "sq-nth" // nth term of an arithmetic sequence (an + b); is a number in the sequence?; pictorial
  | "sq-generate" // generating sequences from nth-term rules (linear and non-linear); spotting quadratics
  | "sq-quadratic"; // nth term of a quadratic sequence using the second difference

/** Optional data table shown with a question. */
export interface DataTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

// ---------------------------------------------------------------------------
// Auto-marked answers (checked by lib/answerCheck.ts)
// ---------------------------------------------------------------------------

/**
 * How a typed answer is checked. The checker is forgiving about format (spaces,
 * unicode minus, "x =" prefixes, units, currency symbols) but strict about value
 * and, where asked, form.
 */
export type AnswerSpec =
  /** A single number. Accepts 0.75, 3/4, 1 3/4, −2, 1,200, £46, 12 cm … */
  | {
      type: "number";
      value: number;
      /** Absolute tolerance (default ~1e-9). */
      tolerance?: number;
      /** Set false when the question asks for a decimal (so "3/4" is NOT accepted). Default true. */
      allowFraction?: boolean;
      /** Require standard form a × 10^n with 1 ≤ a < 10. */
      standardForm?: boolean;
      /** How to show the answer, e.g. "£46" or "{{3/4}}". Defaults to the number. */
      display?: string;
    }
  /** A fraction n/d. Accepts equivalent fractions and mixed numbers unless restricted. */
  | {
      type: "fraction";
      n: number;
      d: number;
      /** Require lowest terms (6/8 is then "equivalent — simplify fully"). */
      simplest?: boolean;
      /** "mixed" requires a mixed number (e.g. 2 1/3), "improper" requires a/b. Default any. */
      form?: "any" | "mixed" | "improper";
      /** Also accept the equal decimal (e.g. 0.75 for 3/4). Default false. */
      allowDecimal?: boolean;
      display?: string;
    }
  /** Several numbers: "28, 35". */
  | {
      type: "list";
      values: number[];
      /** true when the order matters (say which order in the question). Default false. */
      ordered?: boolean;
      tolerance?: number;
      display?: string;
    }
  /** A ratio a : b (: c). */
  | {
      type: "ratio";
      parts: number[];
      /** Require simplest form (12:16 → "equivalent — simplify fully"). */
      simplest?: boolean;
      /** Require the form 1 : n or n : 1 (parts then hold e.g. [1, 2.5]). */
      unitForm?: "1:n" | "n:1";
      display?: string;
    }
  /**
   * An algebraic expression, checked by evaluating at random values (so 2(x+3),
   * 2x+6 and 6+2x are all equal). Plain ASCII: "2x+6", "x^2-9", "3(a+2b)", "(x+2)(x+3)".
   */
  | {
      type: "expression";
      expr: string;
      /**
       * factorised: must be a product (e.g. 3(x+2)), fully factorised.
       * expanded:   no brackets left.
       * simplified: no more terms than `expr` (like terms collected).
       */
      form?: "any" | "factorised" | "expanded" | "simplified";
      display?: string;
    }
  /** Free text matched against accepted alternatives (case/space-insensitive). */
  | {
      type: "text";
      accept: string[];
      display?: string;
    };

/** A predictable wrong answer with targeted feedback (checked only after the real answer fails). */
export interface Trap {
  spec: AnswerSpec;
  feedback: string;
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

interface QuestionBase {
  /** Globally unique, e.g. "fr-m2-q07" (MCQ) or "fr-w3-q04" (written). */
  id: string;
  topic: TopicId;
  /** Guide section this question tests (deep-link "Revise this"). */
  section: SectionId;
  difficulty: Difficulty;
  /** Question text (markdown-lite + {{maths}}). */
  question: string;
  /** Optional inline SVG (viewBox, xmlns, role="img", aria-label; no backticks, no "${"). */
  diagram?: string;
  table?: DataTable;
  /** Hint ladder, gentlest first. Never gives the answer away outright. */
  hints: string[];
  /** Named strategy, e.g. "Use a bar model". */
  strategy?: string;
  /** Where it comes from, if it is from her class notes or a competition, e.g. "Class worksheet", "UKMT JMC 2009". */
  source?: string;
}

/** Multiple-choice question. */
export interface MCQ extends QuestionBase {
  /** Exactly 4 options (may contain {{maths}}). Shuffled at display time — never refer to them by letter. */
  options: string[];
  /** Index into options of the single correct answer. */
  answerIndex: number;
  /**
   * One entry per option, same order as `options`.
   * Correct option: why it is right (short). Wrong options: the exact slip that
   * produces this option and why it is wrong — shown when the learner picks it.
   */
  optionFeedback: string[];
  /** The teaching explanation shown after answering: the method, step by step. */
  explanation: string;
  /**
   * Machine check (strongly recommended whenever the answer is a number): an arithmetic
   * expression in plain ASCII built from the QUESTION's numbers, e.g. "(4/5+2/3)" or
   * "20000*0.8". `npm run validate` evaluates it exactly and checks it equals the keyed
   * option's value — and no other option's value.
   */
  verify?: string;
}

/** One credit-worthy point in a written explanation. */
export interface MarkPoint {
  /** What earns the mark, e.g. "Gives a counter-example such as a = 2, b = 1". */
  point: string;
  /**
   * Phrases/numbers that show the point was made (lower case). Used to suggest ticks;
   * the learner confirms honestly. "+" joins parts that must ALL appear, e.g. "1/2+less".
   */
  keywords: string[];
  /** Teaching feedback shown if this point is missing. */
  feedback: string;
}

/** One part of a written (question-and-answer) question. */
export interface QAPart {
  /** "a", "b", "c" … — omit when the question has a single part. */
  label?: string;
  /** This part's own prompt (shared information goes in the question stem). */
  prompt?: string;
  /** Marks for this part. With `markScheme`, must equal markScheme.length. */
  marks: number;
  /** Auto-marked typed answer. Exactly one of `answer` / `markScheme`. */
  answer?: AnswerSpec;
  /** Written explanation ("explain", "show that", "is it true?"), self-marked against these points. */
  markScheme?: MarkPoint[];
  /** Explain parts only: a full-marks model answer for this part (markdown-lite + {{maths}}). */
  model?: string;
  /** Common wrong answers with targeted feedback (auto-marked parts only). */
  traps?: Trap[];
  /**
   * Machine check for auto-marked parts: an expression built from the QUESTION's numbers
   * (or the question's algebra) that must be equivalent to the answer, e.g. "160*1.2",
   * "4/5+2/3", "5(2x+3)+6(3x-4)", "3n^2-3n+1". `npm run validate` checks it.
   */
  verify?: string;
}

/** Written (question-and-answer) question with one or more parts. */
export interface QA extends QuestionBase {
  parts: QAPart[];
  /** Full worked solution, one step per string (markdown-lite + {{maths}}). */
  solution: string[];
  /** Optional second method (AoPS: multiple paths). */
  altMethod?: { label: string; steps: string[] };
  /** The mistake students most often make on this question. */
  commonError: string;
}

export interface QuestionSet<Q> {
  /** e.g. "fr-mcq-1" or "fr-written-1". */
  id: string;
  title: string;
  subtitle: string;
  topic: TopicId;
  questions: Q[];
}

// ---------------------------------------------------------------------------
// Revision guide
// ---------------------------------------------------------------------------

export interface WorkedExample {
  title?: string;
  problem: string;
  steps: string[];
  answer: string;
}

/** A quick auto-marked "your turn" check inside the guide. */
export interface QuickCheck {
  question: string;
  answer: AnswerSpec;
  /** Short worked solution shown after they try. */
  solution: string;
}

/** A section of the revision guide. */
export interface GuideSection {
  id: SectionId;
  topic: TopicId;
  /** Which lesson in her OneNote this matches, e.g. "Calculations with Fractions". */
  lesson: string;
  heading: string;
  /** AoPS-style opener: a puzzle to think about before reading. */
  discovery: { problem: string; idea: string };
  /** Markdown-lite + {{maths}} body. */
  body: string;
  /** Optional inline SVG diagram (backtick string, no backticks or "${" inside). */
  diagram?: string;
  diagramCaption?: string;
  /** 2–3 fully worked examples, building up in difficulty. */
  workedExamples: WorkedExample[];
  keyPoints: string[];
  /** "Why does this work?" — the reason behind the rule. */
  whyItWorks: string;
  /** A memory trick, if a good one exists. */
  memoryTrick?: string;
  /** The mistake that loses marks in tests. */
  examTip: string;
  /** A reasoning question to stretch thinking. */
  thinkDeeper: string;
  /** 1–2 quick auto-marked checks. */
  quickChecks: QuickCheck[];
}

export interface Flashcard {
  front: string;
  back: string;
}

/** Everything the guide author writes for one topic. */
export interface TopicGuide {
  topic: TopicId;
  sections: GuideSection[];
  /** 10–16 flashcards: key facts, vocabulary and methods. */
  flashcards: Flashcard[];
  /** 6–10 one-line must-know facts/methods for the cram sheet. */
  cram: string[];
}
