// Fresh-number generators — Fractions (Unit 1).
// fr-add is the reference example for every other generator: read it first.

import { cap, fr, fracSpec, frRaw, gcd, lcm, m, pieces, reduce, type Generator, type Wrong } from "./core.ts";

export { pieces } from "./core.ts";

/** A random proper fraction n/d in lowest terms. */
function properFraction(r: { int(a: number, b: number): number }, d: number): number {
  let n = r.int(1, d - 1);
  while (gcd(n, d) !== 1) n = r.int(1, d - 1);
  return n;
}

// ---------------------------------------------------------------------------
// fr-add — add or subtract two fractions with different denominators
// ---------------------------------------------------------------------------

const frAdd: Generator = {
  id: "fr-add",
  topic: "fr",
  section: "fr-addsub",
  label: "Add or subtract fractions with different denominators",
  kinds: ["mcq", "qa"],
  make(r) {
    // denominators: different, common denominator at most 40
    let b = 2, e = 2;
    while (b === e || lcm(b, e) > 40) {
      b = r.int(2, 10);
      e = r.int(2, 12);
    }
    const a = properFraction(r, b);
    const c = properFraction(r, e);
    const sub = r.chance(0.45) && a / b !== c / e;
    // for subtraction put the bigger fraction first
    const [n1, d1, n2, d2] = sub && a / b < c / e ? [c, e, a, b] : [a, b, c, e];
    const L = lcm(d1, d2);
    const A = (n1 * L) / d1;
    const C = (n2 * L) / d2;
    const resN = sub ? A - C : A + C;
    const [rn, rd] = reduce(resN, L);
    const op = sub ? "-" : "+";
    const opWord = sub ? "subtract" : "add";
    const q = m(`${n1}/${d1} ${op} ${n2}/${d2}`);

    const wrong: Wrong[] = [];
    // 1. add/subtract tops and bottoms
    if (!sub) {
      wrong.push({
        display: frRaw(n1 + n2, d1 + d2),
        spec: fracSpec(n1 + n2, d1 + d2, { simplest: false }),
        feedback: `This comes from adding the tops (${n1} + ${n2}) and adding the bottoms (${d1} + ${d2}). You can only add the numerators once the pieces are the same size — change both fractions to ${pieces(L)} first.`,
      });
    } else if (n1 - n2 > 0 && d1 - d2 > 0) {
      wrong.push({
        display: frRaw(n1 - n2, d1 - d2),
        spec: fracSpec(n1 - n2, d1 - d2, { simplest: false }),
        feedback: `This comes from subtracting the tops (${n1} − ${n2}) and subtracting the bottoms (${d1} − ${d2}). The denominators must be the same before you subtract the numerators — change both to ${pieces(L)} first.`,
      });
    }
    // 2. changed the denominators but not the numerators
    const naive = sub ? n1 - n2 : n1 + n2;
    if (naive > 0) {
      wrong.push({
        display: frRaw(naive, L),
        spec: fracSpec(naive, L, { simplest: false }),
        feedback: `You changed both denominators to ${L} but left the numerators as ${n1} and ${n2}. Scale each numerator by the same number as its denominator: ${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}.`,
      });
    }
    // 3. added the common denominators too
    wrong.push({
      display: frRaw(resN, 2 * L),
      spec: fracSpec(resN, 2 * L, { simplest: false }),
      feedback: `The ${A} and ${C} are right, but you ${sub ? "combined" : "added"} the denominators too (${L} + ${L}). Once the pieces are ${pieces(L)}, the answer is still in ${pieces(L)} — only the numerators change.`,
    });
    // 4. did the opposite operation
    const other = sub ? A + C : A - C;
    if (other > 0) {
      wrong.push({
        display: frRaw(other, L),
        spec: fracSpec(other, L, { simplest: false }),
        feedback: `That's what you get if you ${sub ? "add" : "subtract"}. Read the sign again: the question asks you to ${opWord}.`,
      });
    }

    const simplifyStep =
      rd !== L ? ` ${m(`${resN}/${L}`)} simplifies to ${fr(resN, L, false)} (divide top and bottom by ${L / rd}).` : "";
    const mixedStep = rn > rd ? ` As a mixed number that is ${fr(rn, rd)}.` : "";

    return {
      difficulty: L > 24 ? "core" : r.chance(0.5) ? "warmup" : "core",
      question: `Work out ${q}.`,
      prompt: `Work out ${q}. Give your answer in its simplest form.`,
      answer: fracSpec(rn, rd),
      display: fr(rn, rd),
      correctFeedback: `${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}, so the answer is ${m(`${resN}/${L}`)}${rd !== L || rn > rd ? ` = ${fr(rn, rd)}` : ""}.`,
      wrong,
      explanation: `${cap(pieces(d1))} and ${pieces(d2)} are different-sized pieces, so make them the same first. The lowest common multiple of ${d1} and ${d2} is ${L}: ${m(`${n1}/${d1} = ${A}/${L}`)} and ${m(`${n2}/${d2} = ${C}/${L}`)}. Now ${opWord} the numerators only: ${m(`${A}/${L} ${op} ${C}/${L} = ${resN}/${L}`)}.${simplifyStep}${mixedStep}`,
      solution: [
        `The denominators are different, so find a common denominator. The LCM of ${d1} and ${d2} is ${L}.`,
        `${m(`${n1}/${d1} = ${A}/${L}`)} (× ${L / d1} top and bottom) and ${m(`${n2}/${d2} = ${C}/${L}`)} (× ${L / d2} top and bottom).`,
        `${m(`${A}/${L} ${op} ${C}/${L} = ${resN}/${L}`)}.${simplifyStep}${mixedStep}`,
      ],
      hints: [
        `Can you ${opWord} ${pieces(d1)} and ${pieces(d2)} straight away, or do the pieces need to be the same size first?`,
        `Both ${d1} and ${d2} go into ${L}. Write each fraction in ${pieces(L)}.`,
      ],
      verify: `${n1}/${d1}${op}${n2}/${d2}`,
      commonError: sub
        ? "Subtracting the tops and the bottoms separately, or forgetting to scale the numerators when changing the denominators."
        : "Adding the tops and adding the bottoms — the denominators must match before you add the numerators.",
      strategy: "Find a common denominator",
      // the same sum in either order is the same question
      sig: sub ? `${n1}/${d1}-${n2}/${d2}` : [`${n1}/${d1}`, `${n2}/${d2}`].sort().join("+"),
    };
  },
};

export const GEN_FR: Generator[] = [frAdd];
