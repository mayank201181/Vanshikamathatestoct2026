import type { MCQ } from "./types";
import { optionValue, plainOption } from "./verify";

// Authored answer keys can cluster on one position, so a learner could score well by
// always picking the same letter. Each question is therefore shown in its own fixed order:
// the same on every visit and device, but unrelated to where it was authored.
// Answers are still stored as authored option indices, so saved attempts and
// explanations that quote option text are unaffected.

/** Seeded PRNG (mulberry32) so the order is stable for a given question id. */
function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Display order of a question's options, as authored option indices. */
export function optionOrder(q: Pick<MCQ, "id" | "options">): number[] {
  const order = q.options.map((_, i) => i);
  // Numeric answers in one unit read best smallest-first, as in exam papers.
  const values = q.options.map(optionValue);
  const units = new Set(q.options.map((o) => plainOption(o).replace(/[-−\d.,/\s£$]/g, "").toLowerCase()));
  if (values.every((v) => v !== null) && units.size === 1 && new Set(values).size === values.length) {
    return order.sort((a, b) => values[a]! - values[b]!);
  }
  const next = random(hash(q.id));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
