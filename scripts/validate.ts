// Structural + machine checks for all authored content.
//   npm run validate            → every topic
//   node scripts/validate.ts fr → one topic (fr | pc | ra | ex | su | sq)
//   node scripts/validate.ts fr mcq   → one topic, one file (guide | mcq | written)
import { GUIDES, MCQ_SETS, WRITTEN_SETS } from "../lib/content/index.ts";
import { checkAnswer, specSample, specSelfCheck } from "../lib/answerCheck.ts";
import { gradeQA, keywordMatches, tokens } from "../lib/grade.ts";
import { optionValue, verifyAnswer, verifyMcq } from "../lib/verify.ts";
import { SECTIONS, TOPIC_IDS } from "../lib/sections.ts";
import type { GuideSection, MCQ, QA, QuestionSet, TopicId } from "../lib/types.ts";

const [onlyTopic, onlyFile] = process.argv.slice(2);
const topics = (onlyTopic ? [onlyTopic] : TOPIC_IDS) as TopicId[];
if (topics.some((t) => !TOPIC_IDS.includes(t))) {
  console.error(`Unknown topic "${onlyTopic}". Use one of ${TOPIC_IDS.join(", ")}.`);
  process.exit(2);
}
const want = (f: "guide" | "mcq" | "written") => !onlyFile || onlyFile === f;

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

const ORDER = { warmup: 0, core: 1, challenge: 2 } as const;
const MCQ_PER_SET = 10;
const QA_PER_SET = 6;
const SETS_PER_TOPIC = 4;
const seen = new Set<string>();

/** Text hygiene shared by every rendered string. */
function checkText(where: string, text: string | undefined) {
  if (text === undefined) return;
  if (/\\(frac|sqrt|times|div|left|right|cdot)/.test(text)) err(`${where}: LaTeX found (${text.slice(0, 40)}…) — use {{ }} maths markup`);
  if (/\$\{/.test(text)) err(`${where}: contains "\${"`);
  const outside = text.replace(/\{\{[\s\S]*?\}\}/g, " ");
  if (/\{\{|\}\}/.test(outside)) err(`${where}: unbalanced {{ }}`);
  // a/b written as plain text (not a date, not a ratio, not inside maths markup)
  const m = outside.match(/(?<![\w/.{])\d+\s?\/\s?\d+(?![\w/}])/);
  if (m) warn(`${where}: plain-text fraction "${m[0]}" — write it as {{${m[0].replace(/\s/g, "")}}}`);
}

function checkSvg(where: string, d: string | undefined) {
  if (!d) return;
  if (!d.trim().startsWith("<svg")) err(`${where}: diagram doesn't start with <svg`);
  if (!/viewBox=/.test(d)) err(`${where}: diagram missing viewBox`);
  if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(d)) err(`${where}: diagram missing xmlns`);
  if (!/role="img"/.test(d) || !/aria-label=/.test(d)) warn(`${where}: diagram missing role/aria-label`);
  if (/<script|<style|href=|\$\{|<image|<foreignObject/i.test(d)) err(`${where}: diagram contains forbidden markup`);
}

function checkCommon(q: MCQ | QA, topic: TopicId) {
  if (seen.has(q.id)) err(`${q.id}: duplicate id`);
  seen.add(q.id);
  const sec = SECTIONS.find((s) => s.id === q.section);
  if (!sec) err(`${q.id}: unknown section ${q.section}`);
  else if (sec.topic !== topic) err(`${q.id}: section ${q.section} is not in topic ${topic}`);
  if (q.topic !== topic) err(`${q.id}: topic ${q.topic}, expected ${topic}`);
  if (!(q.difficulty in ORDER)) err(`${q.id}: bad difficulty ${q.difficulty}`);
  if (!q.question?.trim()) err(`${q.id}: empty question`);
  checkText(`${q.id} question`, q.question);
  q.hints?.forEach((h, i) => checkText(`${q.id} hint ${i + 1}`, h));
  checkSvg(`${q.id}`, q.diagram);
  if (q.table) {
    const w = q.table.headers.length;
    q.table.rows.forEach((r, i) => r.length !== w && err(`${q.id}: table row ${i} has ${r.length} cells, expected ${w}`));
  }
  const wantHints = q.difficulty === "warmup" ? 1 : 2;
  if (!q.hints?.length) err(`${q.id}: no hints`);
  else if (q.hints.length < wantHints) warn(`${q.id}: ${q.hints.length} hint(s) — want ≥ ${wantHints} for ${q.difficulty}`);
}

function checkMcqSets(sets: QuestionSet<MCQ>[], topic: TopicId) {
  if (sets.length !== SETS_PER_TOPIC) err(`${topic} mcq: ${sets.length} sets, expected ${SETS_PER_TOPIC}`);
  sets.forEach((set, si) => {
    const n = si + 1;
    if (set.id !== `${topic}-mcq-${n}`) err(`${set.id}: set id should be ${topic}-mcq-${n}`);
    if (set.topic !== topic) err(`${set.id}: topic ${set.topic}`);
    if (set.questions.length !== MCQ_PER_SET) err(`${set.id}: ${set.questions.length} questions, expected ${MCQ_PER_SET}`);
    const pos = [0, 0, 0, 0];
    let longest = 0;
    let last = 0;
    set.questions.forEach((q, i) => {
      const id = `${topic}-m${n}-q${String(i + 1).padStart(2, "0")}`;
      if (q.id !== id) err(`${set.id}[${i}]: id ${q.id}, expected ${id}`);
      checkCommon(q, topic);
      if (q.options?.length !== 4) err(`${q.id}: ${q.options?.length} options (need 4)`);
      const norm = q.options.map((o) => o.replace(/\s+/g, "").toLowerCase());
      if (new Set(norm).size !== q.options.length) err(`${q.id}: duplicate options`);
      if (!(q.answerIndex >= 0 && q.answerIndex < q.options.length)) err(`${q.id}: answerIndex ${q.answerIndex} out of range`);
      q.options.forEach((o, j) => {
        checkText(`${q.id} option ${j}`, o);
        if (/\b(all|none|both) of the above\b|\boption [a-d]\b/i.test(o)) err(`${q.id}: option ${j} refers to other options`);
      });
      if (q.optionFeedback?.length !== q.options.length) err(`${q.id}: optionFeedback has ${q.optionFeedback?.length} entries`);
      q.optionFeedback?.forEach((f, j) => {
        if (!f || f.trim().length < 15) err(`${q.id}: optionFeedback[${j}] too short`);
        checkText(`${q.id} optionFeedback ${j}`, f);
      });
      if (!q.explanation || q.explanation.length < 60) err(`${q.id}: explanation too short`);
      checkText(`${q.id} explanation`, q.explanation);
      if (/\b(option|answer|choice) [A-D]\b|\b[A-D]\) /.test(q.explanation)) err(`${q.id}: explanation refers to an option by letter (options are shuffled)`);
      const fb = q.optionFeedback?.[q.answerIndex] ?? "";
      if (/^(wrong|incorrect|no[,.]|not quite)/i.test(fb.trim())) err(`${q.id}: feedback for the CORRECT option reads like a rejection`);
      q.optionFeedback?.forEach((f, j) => {
        if (j !== q.answerIndex && /^(correct|yes|right)\b/i.test(f.trim())) err(`${q.id}: feedback for WRONG option ${j} reads like a confirmation`);
      });
      // machine check of the key
      const values = q.options.map(optionValue);
      if (q.verify) {
        verifyMcq(q.options, q.answerIndex, q.verify).forEach((m) => err(`${q.id}: ${m}`));
      } else if (values.every((x) => x !== null)) {
        warn(`${q.id}: all options are numbers — add a \`verify\` expression so the key is machine-checked`);
      }
      pos[q.answerIndex]++;
      const lens = q.options.map((o) => o.length);
      const max = Math.max(...lens);
      if (lens[q.answerIndex] === max && lens.filter((l) => l === max).length === 1) longest++;
      if (ORDER[q.difficulty] < last) warn(`${q.id}: difficulty goes down (${q.difficulty} after harder)`);
      last = ORDER[q.difficulty];
    });
    const diff = { warmup: 0, core: 0, challenge: 0 };
    set.questions.forEach((q) => diff[q.difficulty]++);
    console.log(`${set.id}: answer positions ${pos.join("/")}, correct-is-longest ${longest}/${set.questions.length}, difficulty ${diff.warmup}/${diff.core}/${diff.challenge}`);
    if (longest > set.questions.length * 0.4) warn(`${set.id}: correct option is the longest in ${longest}/${set.questions.length} questions`);
  });
}

function checkWrittenSets(sets: QuestionSet<QA>[], topic: TopicId) {
  if (sets.length !== SETS_PER_TOPIC) err(`${topic} written: ${sets.length} sets, expected ${SETS_PER_TOPIC}`);
  sets.forEach((set, si) => {
    const n = si + 1;
    if (set.id !== `${topic}-written-${n}`) err(`${set.id}: set id should be ${topic}-written-${n}`);
    if (set.topic !== topic) err(`${set.id}: topic ${set.topic}`);
    if (set.questions.length !== QA_PER_SET) err(`${set.id}: ${set.questions.length} questions, expected ${QA_PER_SET}`);
    let marks = 0;
    let last = 0;
    set.questions.forEach((q, i) => {
      const id = `${topic}-w${n}-q${String(i + 1).padStart(2, "0")}`;
      if (q.id !== id) err(`${set.id}[${i}]: id ${q.id}, expected ${id}`);
      checkCommon(q, topic);
      if (!q.parts?.length) err(`${q.id}: no parts`);
      if (!q.solution?.length) err(`${q.id}: no solution steps`);
      q.solution?.forEach((s, j) => checkText(`${q.id} solution ${j + 1}`, s));
      q.altMethod?.steps.forEach((s, j) => checkText(`${q.id} altMethod ${j + 1}`, s));
      if (!q.commonError?.trim()) err(`${q.id}: no commonError`);
      checkText(`${q.id} commonError`, q.commonError);
      if (ORDER[q.difficulty] < last) warn(`${q.id}: difficulty goes down (${q.difficulty} after harder)`);
      last = ORDER[q.difficulty];
      const labels = new Set<string>();
      q.parts?.forEach((p, j) => {
        const where = `${q.id} part ${p.label ?? j + 1}`;
        marks += p.marks;
        if (q.parts.length > 1 && !p.label) err(`${where}: multi-part question needs labels a, b, c…`);
        if (p.label) {
          if (labels.has(p.label)) err(`${where}: duplicate label`);
          labels.add(p.label);
        }
        if (q.parts.length > 1 && !p.prompt?.trim()) err(`${where}: missing prompt`);
        checkText(`${where} prompt`, p.prompt);
        if (!(p.marks >= 1 && p.marks <= 6)) err(`${where}: marks ${p.marks} out of range 1–6`);
        if (!!p.answer === !!p.markScheme) err(`${where}: needs exactly one of answer / markScheme`);
        if (p.answer) {
          const self = specSelfCheck(p.answer);
          if (self.status !== "correct") err(`${where}: the key's own sample "${specSample(p.answer)}" is marked ${self.status} (${self.feedback ?? ""}) — fix the spec`);
          if (p.answer.display) checkText(`${where} display`, p.answer.display);
          if (p.verify) {
            const r = verifyAnswer(p.answer, p.verify);
            if (!r.ok) err(`${where}: KEY MISMATCH — ${r.message}`);
          } else if (p.answer.type !== "text") {
            warn(`${where}: no \`verify\` — add one so the key is machine-checked`);
          }
          p.traps?.forEach((t, k) => {
            try {
              const r = checkAnswer(p.answer!, specSample(t.spec));
              if (r.status === "correct") err(`${where}: trap ${k + 1} (${specSample(t.spec)}) is accepted as CORRECT by the answer spec`);
            } catch {
              err(`${where}: trap ${k + 1} could not be checked`);
            }
            checkText(`${where} trap ${k + 1}`, t.feedback);
          });
          if (p.answer.type === "expression" && /\s[a-z]\s|[A-Z]/.test(p.answer.expr)) warn(`${where}: expression "${p.answer.expr}" — use lower-case letters, no spaces between number and letter`);
        }
        if (p.markScheme) {
          if (p.markScheme.length !== p.marks) err(`${where}: marks ${p.marks} != ${p.markScheme.length} mark points`);
          if (!p.model?.trim()) err(`${where}: explain part needs a \`model\` answer`);
          checkText(`${where} model`, p.model);
          p.markScheme.forEach((mp, k) => {
            if (!mp.point?.trim()) err(`${where} point ${k + 1}: empty`);
            if (!mp.feedback || mp.feedback.length < 15) err(`${where} point ${k + 1}: feedback missing/short`);
            if (!mp.keywords?.length) err(`${where} point ${k + 1}: no keywords`);
            mp.keywords?.forEach((kw) => kw !== kw.toLowerCase() && warn(`${where} point ${k + 1}: keyword not lower-case: "${kw}"`));
            checkText(`${where} point ${k + 1}`, mp.point);
            checkText(`${where} point ${k + 1} feedback`, mp.feedback);
          });
          if (p.model) {
            const r = gradeQA({ markScheme: p.markScheme }, p.model);
            r.credited.forEach((c, k) => !c && warn(`${where}: model answer doesn't trigger keywords for point ${k + 1} ("${p.markScheme![k].point}")`));
          }
          const stem = `${q.question} ${p.prompt ?? ""}`;
          gradeQA({ markScheme: p.markScheme }, stem).credited.forEach((c, k) => {
            if (!c) return;
            const hits = p.markScheme![k].keywords.filter((kw) => keywordMatches(tokens(stem), kw));
            warn(`${where}: copying the question triggers point ${k + 1} via ${JSON.stringify(hits)}`);
          });
        }
      });
    });
    const diff = { warmup: 0, core: 0, challenge: 0 };
    set.questions.forEach((q) => diff[q.difficulty]++);
    console.log(`${set.id}: ${set.questions.length} questions, ${marks} marks, difficulty ${diff.warmup}/${diff.core}/${diff.challenge}`);
  });
}

function checkGuide(sections: GuideSection[], topic: TopicId, flashcards: number, cram: number) {
  const wantIds = SECTIONS.filter((s) => s.topic === topic).map((s) => s.id);
  const got = sections.map((s) => s.id);
  if (JSON.stringify(wantIds) !== JSON.stringify(got)) err(`guide ${topic}: section ids ${got.join(",")} != ${wantIds.join(",")}`);
  sections.forEach((s) => {
    if (s.topic !== topic) err(`${s.id}: topic ${s.topic}`);
    for (const f of ["heading", "lesson", "body", "whyItWorks", "examTip", "thinkDeeper"] as const) {
      if (!s[f]?.trim()) err(`${s.id}: missing ${f}`);
      checkText(`${s.id} ${f}`, s[f]);
    }
    if (!s.discovery?.problem || !s.discovery?.idea) err(`${s.id}: missing discovery`);
    checkText(`${s.id} discovery`, `${s.discovery?.problem} ${s.discovery?.idea}`);
    if ((s.keyPoints?.length ?? 0) < 3) err(`${s.id}: ${s.keyPoints?.length ?? 0} keyPoints (need ≥ 3)`);
    s.keyPoints?.forEach((k, i) => checkText(`${s.id} keyPoint ${i + 1}`, k));
    if ((s.workedExamples?.length ?? 0) < 2) err(`${s.id}: ${s.workedExamples?.length ?? 0} worked examples (need ≥ 2)`);
    s.workedExamples?.forEach((w, i) => {
      if (!w.problem || !w.steps?.length || !w.answer) err(`${s.id} example ${i + 1}: incomplete`);
      checkText(`${s.id} example ${i + 1}`, `${w.problem} ${w.steps?.join(" ")} ${w.answer}`);
    });
    if ((s.quickChecks?.length ?? 0) < 1) err(`${s.id}: needs ≥ 1 quickCheck`);
    s.quickChecks?.forEach((c, i) => {
      const r = specSelfCheck(c.answer);
      if (r.status !== "correct") err(`${s.id} quickCheck ${i + 1}: sample answer "${specSample(c.answer)}" marked ${r.status}`);
      checkText(`${s.id} quickCheck ${i + 1}`, `${c.question} ${c.solution}`);
    });
    checkSvg(s.id, s.diagram);
    const words = s.body.split(/\s+/).length;
    if (words < 120) warn(`${s.id}: body only ${words} words`);
  });
  if (flashcards < 10) err(`guide ${topic}: ${flashcards} flashcards (need ≥ 10)`);
  if (cram < 6) err(`guide ${topic}: ${cram} cram lines (need ≥ 6)`);
  console.log(`guide ${topic}: ${sections.length} sections, ${flashcards} flashcards, ${cram} cram lines`);
}

for (const t of topics) {
  if (want("guide")) {
    const g = GUIDES[t];
    if (g.topic !== t) err(`guide ${t}: topic field is ${g.topic}`);
    checkGuide(g.sections, t, g.flashcards.length, g.cram.length);
    g.flashcards.forEach((f, i) => checkText(`guide ${t} flashcard ${i + 1}`, `${f.front} ${f.back}`));
    g.cram.forEach((c, i) => checkText(`guide ${t} cram ${i + 1}`, c));
  }
  if (want("mcq")) checkMcqSets(MCQ_SETS[t], t);
  if (want("written")) checkWrittenSets(WRITTEN_SETS[t], t);
}

// coverage: every section practised
if (!onlyFile) {
  for (const t of topics) {
    const qs = [...MCQ_SETS[t].flatMap((s) => s.questions), ...WRITTEN_SETS[t].flatMap((s) => s.questions)] as (MCQ | QA)[];
    if (!qs.length) continue;
    const per = new Map<string, number>();
    qs.forEach((q) => per.set(q.section, (per.get(q.section) ?? 0) + 1));
    SECTIONS.filter((s) => s.topic === t).forEach((s) => {
      const c = per.get(s.id) ?? 0;
      if (c < 6) warn(`${s.id}: only ${c} questions`);
    });
    console.log(`${t} questions per section:`, Object.fromEntries([...per.entries()].sort()));
  }
}

if (warnings.length) console.log(`\n⚠️  ${warnings.length} warnings:\n- ` + warnings.join("\n- "));
if (errors.length) {
  console.log(`\n❌ ${errors.length} errors:\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`\n✅ All content checks passed (${seen.size} questions).`);
