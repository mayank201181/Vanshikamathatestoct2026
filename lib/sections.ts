import type { SectionId, TopicId } from "./types";

export const TOPIC_IDS: TopicId[] = ["fr", "pc", "ra", "ex", "su", "sq"];

export const TOPICS: Record<TopicId, { title: string; short: string; unit: 1 | 2; emoji: string; color: string; blurb: string }> = {
  fr: { title: "Fractions", short: "Fractions", unit: 1, emoji: "🍕", color: "#4f46e5", blurb: "Order, add, subtract, multiply and divide fractions — including mixed numbers and algebraic fractions." },
  pc: { title: "Percentages", short: "Percentages", unit: 1, emoji: "💯", color: "#0d9488", blurb: "FDP equivalents, percentages of amounts, increases and decreases, percentage change and multipliers." },
  ra: { title: "Ratio & Proportion", short: "Ratio", unit: 1, emoji: "⚖️", color: "#ea580c", blurb: "Simplify ratios, share in a ratio, part : part vs part : whole, and ratio puzzles." },
  ex: { title: "Expressions", short: "Expressions", unit: 2, emoji: "🧮", color: "#7c3aed", blurb: "Collect like terms, expand single and double brackets, factorise, and form expressions." },
  su: { title: "Substitution", short: "Substitution", unit: 2, emoji: "🔢", color: "#db2777", blurb: "Evaluate expressions and formulae with positive, negative, decimal and fraction values." },
  sq: { title: "Sequences", short: "Sequences", unit: 2, emoji: "📈", color: "#0369a1", blurb: "Term-to-term rules, nth terms of arithmetic sequences, and quadratic sequences." },
};

export const UNITS: { unit: 1 | 2; title: string; topics: TopicId[] }[] = [
  { unit: 1, title: "Unit 1 · Fractions, Decimals & Percentages", topics: ["fr", "pc", "ra"] },
  { unit: 2, title: "Unit 2 · Expressions & Sequences", topics: ["ex", "su", "sq"] },
];

export const SECTIONS: { id: SectionId; topic: TopicId; label: string; emoji: string }[] = [
  { id: "fr-equivalent", topic: "fr", label: "Equivalent, ordering & mixed numbers", emoji: "🧱" },
  { id: "fr-addsub", topic: "fr", label: "Adding & subtracting fractions", emoji: "➕" },
  { id: "fr-muldiv", topic: "fr", label: "Multiplying & dividing fractions", emoji: "✖️" },
  { id: "fr-problems", topic: "fr", label: "Fraction problems in context", emoji: "🐒" },
  { id: "fr-algebraic", topic: "fr", label: "Algebraic fractions", emoji: "🔤" },
  { id: "pc-fdp", topic: "pc", label: "Fractions, decimals & percentages", emoji: "🔁" },
  { id: "pc-of-amount", topic: "pc", label: "Percentage of an amount", emoji: "🎯" },
  { id: "pc-change", topic: "pc", label: "Increase & decrease by a %", emoji: "📈" },
  { id: "pc-percent-change", topic: "pc", label: "Calculating percentage change", emoji: "📊" },
  { id: "pc-multipliers", topic: "pc", label: "Multipliers & repeated change", emoji: "✖️" },
  { id: "ra-basics", topic: "ra", label: "Ratio notation & simplifying", emoji: "🔗" },
  { id: "ra-sharing", topic: "ra", label: "Sharing in a ratio", emoji: "💰" },
  { id: "ra-proportion", topic: "ra", label: "Proportion & combining ratios", emoji: "🧃" },
  { id: "ra-problems", topic: "ra", label: "Ratio puzzles", emoji: "🧩" },
  { id: "ex-simplify", topic: "ex", label: "Simplifying & like terms", emoji: "🧹" },
  { id: "ex-expand", topic: "ex", label: "Expanding single brackets", emoji: "📦" },
  { id: "ex-factorise", topic: "ex", label: "Factorising & identities", emoji: "🔐" },
  { id: "ex-double", topic: "ex", label: "Expanding double brackets", emoji: "🔲" },
  { id: "ex-forming", topic: "ex", label: "Forming expressions", emoji: "📐" },
  { id: "su-basics", topic: "su", label: "Substitution basics", emoji: "🔢" },
  { id: "su-negatives", topic: "su", label: "Negatives, decimals & fractions", emoji: "➖" },
  { id: "su-formulae", topic: "su", label: "Using formulae", emoji: "🧪" },
  { id: "su-powers", topic: "su", label: "Squares, cubes & roots of any number", emoji: "²" },
  { id: "sq-terms", topic: "sq", label: "Term-to-term rules & gaps", emoji: "🔜" },
  { id: "sq-nth", topic: "sq", label: "nth term of arithmetic sequences", emoji: "📏" },
  { id: "sq-generate", topic: "sq", label: "Generating sequences from rules", emoji: "⚙️" },
  { id: "sq-quadratic", topic: "sq", label: "Quadratic sequences", emoji: "📈" },
];

export function sectionMeta(id: string) {
  return SECTIONS.find((s) => s.id === id);
}

export function sectionHref(id: string) {
  const s = sectionMeta(id);
  return s ? `/guide/${s.topic}#${s.id}` : "/guide/fr";
}

export const DIFFICULTY_META = {
  warmup: { label: "Warm-up", className: "bg-sky-100 text-sky-800" },
  core: { label: "Core", className: "bg-violet-100 text-violet-800" },
  challenge: { label: "Challenge", className: "bg-amber-100 text-amber-900" },
} as const;
