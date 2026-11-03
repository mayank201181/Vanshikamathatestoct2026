// Print a few rolls of a generator as she would see them, to eyeball wording and numbers.
// Usage: node --no-warnings scripts/gen-sample.ts fr-add [count=3] [firstSeed=1]
import { GENERATORS, draftFor, draftProblems, genId, materialise } from "../lib/gen/index.ts";
import { rng } from "../lib/gen/core.ts";

const [id, countArg, seedArg] = process.argv.slice(2);
const gens = id ? GENERATORS.filter((g) => g.id === id) : GENERATORS;
if (!gens.length) {
  console.log(`Unknown generator "${id}". Known: ${GENERATORS.map((g) => g.id).join(", ")}`);
  process.exit(1);
}
const count = Number(countArg ?? 3);
const first = Number(seedArg ?? 1);

for (const g of gens) {
  console.log(`\n================ ${g.id} · ${g.section} · ${g.label}`);
  for (let seed = first; seed < first + count; seed++) {
    const raw = draftProblems(g.make(rng(seed)), g.kinds[0]);
    if (raw.length) console.log(`  (seed ${seed} first roll re-rolled: ${raw[0]})`);
    for (const kind of g.kinds) {
      const q = materialise(genId({ gen: g.id, kind, seed }));
      if (!q) {
        console.log(`  seed ${seed} ${kind}: FAILED`);
        continue;
      }
      const x = q.q as unknown as Record<string, unknown>;
      console.log(`\n--- seed ${seed} · ${kind} · ${q.q.difficulty} · sig ${q.sig}`);
      console.log(`Q: ${q.q.question}`);
      if (q.kind === "mcq") {
        (x.options as string[]).forEach((o, i) => console.log(`  ${i === 0 ? "✔" : "✘"} ${o}  — ${(x.optionFeedback as string[])[i]}`));
        console.log(`  Explanation: ${x.explanation}`);
      } else {
        const p = (x.parts as Record<string, unknown>[])[0];
        console.log(`  Prompt: ${p.prompt ?? "(none)"} [${p.marks} marks]  Answer: ${JSON.stringify(p.answer)}`);
        for (const t of (p.traps as { spec: unknown; feedback: string }[]) ?? []) console.log(`  trap ${JSON.stringify(t.spec)} — ${t.feedback}`);
        (x.solution as string[]).forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
        console.log(`  Common error: ${x.commonError}`);
      }
      console.log(`  Hints: ${(x.hints as string[]).join(" / ")}`);
    }
  }
}
void draftFor;
