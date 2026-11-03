// Registry of fresh-number generators, and turning a generator + seed into a real question.
//
// Generated question ids look like  g~fr-add~m~1a2b3c   (generator, m = multiple choice /
// w = written, seed in base 36) and may end with  ~o~<id>  — the mistake it is a "twin" of.
// The same id always rebuilds exactly the same question.

import type { MCQ, QA, SectionId, TopicId } from "../types.ts";
import { checkAnswer } from "../answerCheck.ts";
import { plainOption, verifyAnswer, verifyMcq } from "../verify.ts";
import { rng, type Draft, type Generator, type Wrong } from "./core.ts";
import { GEN_FR } from "./fr.ts";
import { GEN_PC } from "./pc.ts";
import { GEN_RA } from "./ra.ts";
import { GEN_EX } from "./ex.ts";
import { GEN_SU } from "./su.ts";
import { GEN_SQ } from "./sq.ts";

export type { Draft, Generator, Wrong } from "./core.ts";

export const GENERATORS: Generator[] = [...GEN_FR, ...GEN_PC, ...GEN_RA, ...GEN_EX, ...GEN_SU, ...GEN_SQ];

const BY_ID = new Map(GENERATORS.map((g) => [g.id, g]));

export function generator(id: string): Generator | undefined {
  return BY_ID.get(id);
}

export function generatorsFor(section: SectionId | string, kind?: "mcq" | "qa"): Generator[] {
  return GENERATORS.filter((g) => g.section === section && (!kind || g.kinds.includes(kind)));
}

export function generatorsForTopic(topic: TopicId, kind?: "mcq" | "qa"): Generator[] {
  return GENERATORS.filter((g) => g.topic === topic && (!kind || g.kinds.includes(kind)));
}

// ---------------------------------------------------------------------------
// Ids
// ---------------------------------------------------------------------------

export interface GenRef {
  gen: string;
  kind: "mcq" | "qa";
  seed: number;
  /** The question this is a fresh-number twin of (a mistake), if any. */
  origin?: string;
}

export const isGenerated = (id: string) => id.startsWith("g~");

export function genId(ref: GenRef): string {
  return `g~${ref.gen}~${ref.kind === "mcq" ? "m" : "w"}~${ref.seed.toString(36)}${ref.origin ? `~o~${ref.origin}` : ""}`;
}

export function parseGenId(id: string): GenRef | null {
  const m = /^g~([a-z0-9-]+)~([mw])~([0-9a-z]+)(?:~o~(.+))?$/.exec(id);
  if (!m) return null;
  return { gen: m[1], kind: m[2] === "m" ? "mcq" : "qa", seed: parseInt(m[3], 36), origin: m[4] };
}

/** A fresh random seed. */
export function freshSeed(): number {
  return (Math.floor(Math.random() * 0x7fffffff) ^ Date.now()) >>> 0;
}

// ---------------------------------------------------------------------------
// Checking a draft — used at runtime (to skip a bad roll) and by the property tests
// ---------------------------------------------------------------------------

const BAD_TEXT = /\b(NaN|undefined|Infinity|null)\b|\{\{\s*\}\}|--|\+-|-\+/;

/** Pick the 3 distractors shown with the answer: distinct text, and each a different value. */
export function mcqOptions(d: Draft): { options: string[]; wrongs: Wrong[] } {
  const seen = new Set([plainOption(d.display).replace(/\s+/g, "")]);
  const wrongs: Wrong[] = [];
  for (const w of d.wrong) {
    const key = plainOption(w.display).replace(/\s+/g, "");
    if (seen.has(key)) continue;
    const options = [d.display, ...wrongs.map((x) => x.display), w.display];
    if (verifyMcq(options, 0, d.verify).length) continue; // same value as the answer or another option
    seen.add(key);
    wrongs.push(w);
    if (wrongs.length === 3) break;
  }
  return { options: [d.display, ...wrongs.map((w) => w.display)], wrongs };
}

export function draftProblems(d: Draft, kind: "mcq" | "qa"): string[] {
  const problems: string[] = [];
  const texts = [d.question, d.prompt ?? "", d.display, d.correctFeedback, d.explanation, d.commonError, ...d.hints, ...d.solution, ...d.wrong.flatMap((w) => [w.display, w.feedback])];
  for (const t of texts) if (BAD_TEXT.test(t)) problems.push(`bad text: ${t.slice(0, 80)}`);
  if ((d.question.match(/\{\{/g) ?? []).length !== (d.question.match(/\}\}/g) ?? []).length) problems.push("unbalanced {{ }} in question");
  if (!d.hints.length) problems.push("no hints");
  if (!d.solution.length) problems.push("no solution steps");
  const v = verifyAnswer(d.answer, d.verify);
  if (!v.ok) problems.push(`verify: ${v.message}`);
  const self = checkAnswer(d.answer, plainOption(d.display));
  if (self.status !== "correct") problems.push(`the correct option "${d.display}" is not accepted as a typed answer (${self.status})`);
  if (kind === "mcq") {
    const { options, wrongs } = mcqOptions(d);
    if (wrongs.length < 3) problems.push(`only ${wrongs.length} usable distractors`);
    else problems.push(...verifyMcq(options, 0, d.verify));
  } else {
    for (const w of d.wrong) {
      if (!w.spec) continue;
      const r = checkAnswer(d.answer, plainOption(w.display));
      if (r.status === "correct") problems.push(`trap "${w.display}" is marked correct`);
      const own = checkAnswer(w.spec, plainOption(w.display));
      if (own.status !== "correct") problems.push(`trap spec does not match its own display "${w.display}"`);
    }
  }
  return problems;
}

/** Build a valid draft for a seed (re-rolling deterministically if a roll is unusable). */
export function draftFor(g: Generator, seed: number, kind: "mcq" | "qa"): Draft | null {
  for (let k = 0; k < 25; k++) {
    const d = g.make(rng((seed + k * 2654435761) >>> 0));
    if (!draftProblems(d, kind).length) return d;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Materialise
// ---------------------------------------------------------------------------

export interface GeneratedQuestion {
  kind: "mcq" | "qa";
  q: MCQ | QA;
  ref: GenRef;
  sig: string;
}

/**
 * The written card shows the question and then the prompt, so a prompt that repeats the
 * question ("Work out 4/7 + 1/2. Give your answer…") is trimmed to just the instruction.
 */
export function writtenPrompt(d: Pick<Draft, "question" | "prompt">): string | undefined {
  const p = d.prompt?.trim();
  if (!p) return undefined;
  const q = d.question.trim();
  if (p === q) return undefined;
  if (p.startsWith(q)) return p.slice(q.length).trim() || undefined;
  return p;
}

const cache = new Map<string, GeneratedQuestion | null>();

export function materialise(id: string): GeneratedQuestion | null {
  if (cache.has(id)) return cache.get(id)!;
  const ref = parseGenId(id);
  const g = ref && generator(ref.gen);
  const d = ref && g ? draftFor(g, ref.seed, ref.kind) : null;
  let out: GeneratedQuestion | null = null;
  if (ref && g && d) {
    const base = {
      id,
      topic: g.topic,
      section: g.section,
      difficulty: d.difficulty,
      question: d.question,
      hints: d.hints,
      strategy: d.strategy,
      source: "Fresh numbers",
    };
    if (ref.kind === "mcq") {
      const { options, wrongs } = mcqOptions(d);
      const q: MCQ = {
        ...base,
        options,
        answerIndex: 0,
        optionFeedback: [d.correctFeedback, ...wrongs.map((w) => w.feedback)],
        explanation: d.explanation,
        verify: d.verify,
      };
      out = { kind: "mcq", q, ref, sig: d.sig };
    } else {
      const q: QA = {
        ...base,
        parts: [
          {
            prompt: writtenPrompt(d),
            marks: d.marks ?? 2,
            answer: d.answer,
            verify: d.verify,
            traps: d.wrong.filter((w) => w.spec).map((w) => ({ spec: w.spec!, feedback: w.feedback })),
          },
        ],
        solution: d.solution,
        commonError: d.commonError,
      };
      out = { kind: "qa", q, ref, sig: d.sig };
    }
  }
  cache.set(id, out);
  return out;
}

/** The signature (the exact numbers) of a generated question id, without building the page text. */
export function sigOf(id: string): string | null {
  return materialise(id)?.sig ?? null;
}

/**
 * Make a brand-new question for a generator whose numbers are not in `used`
 * (signatures of everything already shown). Returns its id, or null if none found.
 */
export function freshQuestion(
  g: Generator,
  kind: "mcq" | "qa",
  used: Set<string>,
  origin?: string,
  accept?: (q: GeneratedQuestion) => boolean,
): string | null {
  for (let tries = 0; tries < 60; tries++) {
    const id = genId({ gen: g.id, kind, seed: freshSeed(), origin });
    const made = materialise(id);
    if (!made) continue;
    const key = `${g.id}|${made.sig}`;
    if (used.has(key)) continue;
    if (accept && !accept(made)) continue;
    used.add(key);
    return id;
  }
  return null;
}

/** Key used to remember a generated question's numbers ("never show these numbers again"). */
export function usedKey(id: string): string | null {
  const ref = parseGenId(id);
  const sig = sigOf(id);
  return ref && sig ? `${ref.gen}|${sig}` : null;
}
