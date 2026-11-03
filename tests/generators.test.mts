// Property tests for the fresh-number generators: every generator is rolled many times and
// every roll is checked the same way the hand-written bank is checked by `npm run validate`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { rng } from "../lib/gen/core.ts";
import { GENERATORS, draftFor, draftProblems, genId, materialise, parseGenId } from "../lib/gen/index.ts";
import { SECTIONS } from "../lib/sections.ts";

const SEEDS = Number(process.env.GEN_SEEDS ?? 600);
const ONLY = process.env.GEN_ONLY; // e.g. GEN_ONLY=fr-add

const gens = GENERATORS.filter((g) => !ONLY || g.id === ONLY);

test("generator ids are unique and point at real sections", () => {
  const ids = GENERATORS.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate generator id");
  for (const g of GENERATORS) {
    assert.match(g.id, /^[a-z0-9-]+$/, `${g.id}: id must be lower-case letters, digits and dashes`);
    const s = SECTIONS.find((x) => x.id === g.section);
    assert.ok(s, `${g.id}: unknown section ${g.section}`);
    assert.equal(s!.topic, g.topic, `${g.id}: topic ${g.topic} doesn't match section ${g.section}`);
    assert.ok(g.kinds.length > 0, `${g.id}: no kinds`);
  }
});

for (const g of gens) {
  test(`${g.id}: every roll is a valid question with a correct, machine-checked answer`, () => {
    for (const kind of g.kinds) {
      let firstRollFailures = 0;
      const examples: string[] = [];
      for (let seed = 1; seed <= SEEDS; seed++) {
        const problems = draftProblems(g.make(rng(seed)), kind);
        if (problems.length) {
          firstRollFailures++;
          if (examples.length < 5) examples.push(`seed ${seed}: ${problems.join(" | ")}`);
        }
        assert.ok(draftFor(g, seed, kind), `${g.id} (${kind}) seed ${seed}: no valid question after re-rolls\n${examples.join("\n")}`);
      }
      const rate = firstRollFailures / SEEDS;
      assert.ok(rate <= 0.2, `${g.id} (${kind}): ${(rate * 100).toFixed(1)}% of first rolls are unusable (max 20%)\n${examples.join("\n")}`);
    }
  });

  test(`${g.id}: plenty of different numbers (so mocks never need to repeat)`, () => {
    const sigs = new Set<string>();
    for (let seed = 1; seed <= SEEDS; seed++) sigs.add(g.make(rng(seed)).sig);
    assert.ok(sigs.size >= Math.min(40, SEEDS / 4), `${g.id}: only ${sigs.size} different questions in ${SEEDS} rolls`);
  });

  test(`${g.id}: ids rebuild the same question, and materialise to well-formed items`, () => {
    for (const kind of g.kinds) {
      for (let seed = 101; seed <= 130; seed++) {
        const id = genId({ gen: g.id, kind, seed, origin: seed % 2 ? "fr-m1-q03" : undefined });
        const ref = parseGenId(id);
        assert.deepEqual(ref, { gen: g.id, kind, seed, origin: seed % 2 ? "fr-m1-q03" : undefined });
        const a = materialise(id);
        assert.ok(a, `${id}: did not materialise`);
        assert.equal(a!.q.id, id);
        assert.equal(a!.q.section, g.section);
        if (a!.kind === "mcq") {
          const q = a!.q as { options: string[]; optionFeedback: string[]; answerIndex: number };
          assert.equal(q.options.length, 4, `${id}: needs 4 options`);
          assert.equal(q.optionFeedback.length, 4);
          assert.equal(q.answerIndex, 0);
        }
        // deterministic: building the draft again gives exactly the same thing
        const again = JSON.stringify(draftFor(g, seed, kind));
        assert.equal(again, JSON.stringify(draftFor(g, seed, kind)));
      }
    }
  });
}
