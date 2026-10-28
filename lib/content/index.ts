import type { GuideSection, MCQ, QA, QuestionSet, SectionId, TopicGuide, TopicId } from "../types.ts";
import { GUIDE_FR } from "./fr/guide.ts";
import { MCQ_FR } from "./fr/mcq.ts";
import { WRITTEN_FR } from "./fr/written.ts";
import { GUIDE_PC } from "./pc/guide.ts";
import { MCQ_PC } from "./pc/mcq.ts";
import { WRITTEN_PC } from "./pc/written.ts";
import { GUIDE_RA } from "./ra/guide.ts";
import { MCQ_RA } from "./ra/mcq.ts";
import { WRITTEN_RA } from "./ra/written.ts";
import { GUIDE_EX } from "./ex/guide.ts";
import { MCQ_EX } from "./ex/mcq.ts";
import { WRITTEN_EX } from "./ex/written.ts";
import { GUIDE_SU } from "./su/guide.ts";
import { MCQ_SU } from "./su/mcq.ts";
import { WRITTEN_SU } from "./su/written.ts";
import { GUIDE_SQ } from "./sq/guide.ts";
import { MCQ_SQ } from "./sq/mcq.ts";
import { WRITTEN_SQ } from "./sq/written.ts";

export const GUIDES: Record<TopicId, TopicGuide> = {
  fr: GUIDE_FR,
  pc: GUIDE_PC,
  ra: GUIDE_RA,
  ex: GUIDE_EX,
  su: GUIDE_SU,
  sq: GUIDE_SQ,
};

export const MCQ_SETS: Record<TopicId, QuestionSet<MCQ>[]> = {
  fr: MCQ_FR,
  pc: MCQ_PC,
  ra: MCQ_RA,
  ex: MCQ_EX,
  su: MCQ_SU,
  sq: MCQ_SQ,
};

export const WRITTEN_SETS: Record<TopicId, QuestionSet<QA>[]> = {
  fr: WRITTEN_FR,
  pc: WRITTEN_PC,
  ra: WRITTEN_RA,
  ex: WRITTEN_EX,
  su: WRITTEN_SU,
  sq: WRITTEN_SQ,
};

export type AnySet = { kind: "mcq"; set: QuestionSet<MCQ> } | { kind: "qa"; set: QuestionSet<QA> };

const TOPIC_ORDER: TopicId[] = ["fr", "pc", "ra", "ex", "su", "sq"];

export const ALL_SETS: AnySet[] = TOPIC_ORDER.flatMap((t) => [
  ...MCQ_SETS[t].map((set) => ({ kind: "mcq" as const, set })),
  ...WRITTEN_SETS[t].map((set) => ({ kind: "qa" as const, set })),
]);

export function setsForTopic(topic: TopicId): AnySet[] {
  return ALL_SETS.filter((s) => s.set.topic === topic);
}

export function getSet(id: string): AnySet | undefined {
  return ALL_SETS.find((s) => s.set.id === id);
}

export function guideSection(id: SectionId | string): GuideSection | undefined {
  for (const t of TOPIC_ORDER) {
    const s = GUIDES[t].sections.find((x) => x.id === id);
    if (s) return s;
  }
  return undefined;
}

export interface IndexedQuestion {
  kind: "mcq" | "qa";
  q: MCQ | QA;
  setId: string;
  setTitle: string;
  number: number;
}

function build(): Record<string, IndexedQuestion> {
  const idx: Record<string, IndexedQuestion> = {};
  for (const { kind, set } of ALL_SETS) {
    set.questions.forEach((q, i) => {
      idx[q.id] = { kind, q, setId: set.id, setTitle: set.title, number: i + 1 };
    });
  }
  return idx;
}

export const QUESTION_INDEX: Record<string, IndexedQuestion> = build();

export function lookup(qid: string): IndexedQuestion | undefined {
  return QUESTION_INDEX[qid];
}

/** Every question, for per-section mastery and practice-by-section. */
export const ALL_QUESTIONS: IndexedQuestion[] = Object.values(QUESTION_INDEX);

export function questionsForSection(section: string): IndexedQuestion[] {
  return ALL_QUESTIONS.filter((x) => x.q.section === section);
}

/** Marks available for a written question. */
export function qaMarks(q: QA): number {
  return q.parts.reduce((s, p) => s + p.marks, 0);
}
