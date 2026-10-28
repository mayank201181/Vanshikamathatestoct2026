// Try typed answers against a written question's answer checker.
//   node scripts/try-answer.ts <qa-id> <part-label-or-number> "answer"
//   node scripts/try-answer.ts fr-w1-q03 b "1 7/15"
// Explain parts show which mark points the keywords would tick.
import { WRITTEN_SETS } from "../lib/content/index.ts";
import { checkWithTraps } from "../lib/answerCheck.ts";
import { gradeQA, keywordMatches, tokens } from "../lib/grade.ts";
import type { QA } from "../lib/types.ts";

const [id, partArg, ...rest] = process.argv.slice(2);
const answer = rest.join(" ");
const qa = (Object.values(WRITTEN_SETS).flat().flatMap((s) => s.questions) as QA[]).find((q) => q.id === id);
if (!qa || !partArg || !answer) {
  console.log('Usage: node scripts/try-answer.ts <qa-id> <part label or number> "answer"');
  process.exit(1);
}
const part = qa.parts.find((p) => p.label === partArg) ?? qa.parts[Number(partArg) - 1] ?? (qa.parts.length === 1 ? qa.parts[0] : undefined);
if (!part) {
  console.log(`No part "${partArg}" in ${qa.id} (parts: ${qa.parts.map((p, i) => p.label ?? i + 1).join(", ")})`);
  process.exit(1);
}
if (part.answer) {
  const r = checkWithTraps(part.answer, answer, part.traps);
  console.log(`${qa.id} ${part.label ?? ""}: "${answer}" → ${r.status}${r.feedback ? ` — ${r.feedback}` : ""}`);
} else if (part.markScheme) {
  const r = gradeQA({ markScheme: part.markScheme }, answer);
  const toks = tokens(answer);
  console.log(`${qa.id} ${part.label ?? ""}: ${r.hit}/${r.total} suggested`);
  part.markScheme.forEach((mp, i) => {
    const matched = mp.keywords.filter((k) => keywordMatches(toks, k));
    console.log(`  ${r.credited[i] ? "✅" : "❌"} ${mp.point}${matched.length ? `   [matched: ${matched.join(" | ")}]` : ""}`);
  });
}
