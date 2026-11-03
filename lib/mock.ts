// Building mock papers.
//
// Mock test: per topic 2 multiple-choice + 1 written, like the class test. Every slot is a
// fresh-number question whose exact numbers she has never been shown (weakest skills first),
// with the occasional hand-written bank question she has never seen. Nothing is ever repeated.
//
// Mistakes mock: a fresh-number "twin" of each question on her Mistakes list — same skill, new
// numbers. Getting the twin right fixes the original mistake (see noteMistake in store.tsx).

import type { Progress } from "./progressMerge.ts";
import type { TopicId } from "./types.ts";
import { ALL_QUESTIONS, lookup, type IndexedQuestion } from "./content/index.ts";
import { TOPIC_IDS } from "./sections.ts";
import {
  freshQuestion,
  generator,
  generatorsFor,
  generatorsForTopic,
  isGenerated,
  parseGenId,
  usedKey,
  type Generator,
} from "./gen/index.ts";

export const MOCK_RUN = "mock";
export const MISTAKES_MOCK_RUN = "mock-mistakes";

const SLOTS: ("mcq" | "qa")[] = ["mcq", "mcq", "qa"];

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Numbers she has already been shown or answered ("generator|signature"). */
export function usedNumbers(p: Progress): Set<string> {
  const used = new Set<string>();
  for (const k of Object.keys(p.shown ?? {})) if (k.startsWith("g:")) used.add(k.slice(2));
  for (const id of Object.keys(p.stats)) {
    if (!isGenerated(id)) continue;
    const k = usedKey(id);
    if (k) used.add(k);
  }
  for (const a of Object.values(p.attempts)) {
    for (const id of a.ids ?? []) {
      if (!isGenerated(id)) continue;
      const k = usedKey(id);
      if (k) used.add(k);
    }
  }
  return used;
}

/** The key that marks a question as shown. */
export function shownKey(id: string): string | null {
  if (!isGenerated(id)) return `b:${id}`;
  const k = usedKey(id);
  return k ? `g:${k}` : null;
}

const bankSeen = (p: Progress, id: string) => !!p.stats[id] || !!(p.shown ?? {})[`b:${id}`];

/** Average last score per section, over everything she has answered (bank and fresh-number). */
export function sectionScores(p: Progress): Map<string, number> {
  const sum = new Map<string, [number, number]>();
  for (const [id, st] of Object.entries(p.stats)) {
    const section = lookup(id)?.q.section;
    if (!section) continue;
    const [s, n] = sum.get(section) ?? [0, 0];
    sum.set(section, [s + st.lastScore, n + 1]);
  }
  return new Map([...sum].map(([k, [s, n]]) => [k, s / n]));
}

/** Weakest skills first (untried counts as middling), skills not yet in this paper first, with some randomness. */
function rankGenerators(gens: Generator[], scores: Map<string, number>, usedSections: Set<string>): Generator[] {
  const keyed = gens.map((g) => {
    const s = scores.get(g.section) ?? 0.6;
    const fresh = usedSections.has(g.section) ? 1 : 0;
    return { g, k: fresh * 10 + s + Math.random() * 0.35 };
  });
  return keyed.sort((a, b) => a.k - b.k).map((x) => x.g);
}

const notWarmup = (q: { q: { difficulty: string } }) => q.q.difficulty !== "warmup";

function pickFresh(gens: Generator[], kind: "mcq" | "qa", used: Set<string>, origin?: string): string | null {
  // prefer core/challenge numbers, but take a warm-up rather than nothing
  for (const g of gens) {
    const id = freshQuestion(g, kind, used, origin, notWarmup);
    if (id) return id;
  }
  for (const g of gens) {
    const id = freshQuestion(g, kind, used, origin);
    if (id) return id;
  }
  return null;
}

function leastRecentlySeen(p: Progress, topic: TopicId, kind: "mcq" | "qa", exclude: Set<string>): IndexedQuestion | undefined {
  const pool = ALL_QUESTIONS.filter((x) => x.q.topic === topic && x.kind === kind && x.q.difficulty !== "warmup" && !exclude.has(x.q.id));
  const when = (id: string) => Math.max(p.stats[id]?.lastAt ?? 0, (p.shown ?? {})[`b:${id}`] ?? 0);
  return [...pool].sort((a, b) => when(a.q.id) - when(b.q.id))[0];
}

/** Multiple choice first (in topic order), then the written questions — like a real paper. */
function paperOrder(ids: string[]): string[] {
  const kindOf = (id: string) => (lookup(id)?.kind === "mcq" ? 0 : 1);
  return ids.map((id, i) => ({ id, i })).sort((a, b) => kindOf(a.id) - kindOf(b.id) || a.i - b.i).map((x) => x.id);
}

export interface BuiltMock {
  ids: string[];
  /** Keys to remember as shown (store.markShown). */
  shown: string[];
  /** How many questions had to repeat an earlier question (should be 0). */
  repeats: number;
}

export function buildMock(p: Progress): BuiltMock {
  const used = usedNumbers(p);
  const scores = sectionScores(p);
  const ids: string[] = [];
  const takenBank = new Set<string>();
  let repeats = 0;
  for (const t of TOPIC_IDS) {
    const usedSections = new Set<string>();
    const unseenBank = shuffle(ALL_QUESTIONS.filter((x) => x.q.topic === t && x.q.difficulty !== "warmup" && !bankSeen(p, x.q.id)));
    let bankAllowance = Math.random() < 0.34 ? 1 : 0; // keeps the class's own question styles in the mix
    for (const kind of SLOTS) {
      let id: string | null = null;
      if (bankAllowance > 0) {
        const b = unseenBank.find((x) => x.kind === kind && !takenBank.has(x.q.id) && !usedSections.has(x.q.section) && (kind === "mcq" || x.q.difficulty === "core"));
        if (b) {
          id = b.q.id;
          bankAllowance--;
        }
      }
      if (!id) {
        const ranked = rankGenerators(generatorsForTopic(t, kind), scores, usedSections);
        // a skill not yet in this paper, with new numbers
        id = pickFresh(ranked.filter((g) => !usedSections.has(g.section)), kind, used);
        // every template is for a skill already in the paper: a never-seen bank question on another skill
        if (!id) id = unseenBank.find((x) => x.kind === kind && !takenBank.has(x.q.id) && !usedSections.has(x.q.section))?.q.id ?? null;
        // else the same skill again, with new numbers
        if (!id) id = pickFresh(ranked, kind, used);
      }
      if (!id) {
        // no fresh-number template for this topic yet: a never-seen bank question, else the least recently seen
        const b = unseenBank.find((x) => x.kind === kind && !takenBank.has(x.q.id));
        if (b) id = b.q.id;
        else {
          const old = leastRecentlySeen(p, t, kind, takenBank);
          if (old) {
            id = old.q.id;
            repeats++;
          }
        }
      }
      if (!id) continue;
      if (!isGenerated(id)) takenBank.add(id);
      const sec = lookup(id)?.q.section;
      if (sec) usedSections.add(sec);
      ids.push(id);
    }
  }
  const ordered = paperOrder(ids);
  return { ids: ordered, shown: ordered.map(shownKey).filter((k): k is string => !!k), repeats };
}

export interface BuiltMistakesMock extends BuiltMock {
  /** Mistakes asked again with the same numbers because no fresh-number template covers that skill. */
  sameNumbers: number;
  /** Open mistakes in total (the mock takes the most recent `limit`). */
  open: number;
}

/** Open mistakes, most recent first. */
export function openMistakeIds(p: Progress): string[] {
  return Object.entries(p.mistakes)
    .filter(([id, open]) => open && !!lookup(id))
    .map(([id]) => id)
    .sort((a, b) => (p.stats[b]?.lastAt ?? 0) - (p.stats[a]?.lastAt ?? 0));
}

export function buildMistakesMock(p: Progress, limit = 20): BuiltMistakesMock {
  const used = usedNumbers(p);
  const all = openMistakeIds(p);
  const ids: string[] = [];
  let sameNumbers = 0;
  for (const mid of all.slice(0, limit)) {
    const x = lookup(mid);
    if (!x) continue;
    const ref = parseGenId(mid);
    const same = ref ? generator(ref.gen) : undefined;
    // same template first (for a fresh-number mistake), then any template for that skill, same kind first
    let gens = shuffle(generatorsFor(x.q.section, x.kind)).filter((g) => g.id !== same?.id);
    if (same) gens = [same, ...gens];
    let id = pickFresh(gens, x.kind, used, mid);
    if (!id) {
      const other = x.kind === "mcq" ? "qa" : "mcq";
      id = pickFresh(shuffle(generatorsFor(x.q.section, other)), other, used, mid);
    }
    if (!id) {
      id = mid; // no template for this skill: ask the original again
      sameNumbers++;
    }
    ids.push(id);
  }
  const topicIndex = (id: string) => TOPIC_IDS.indexOf((lookup(id)?.q.topic ?? "fr") as TopicId);
  const grouped = ids.map((id, i) => ({ id, i })).sort((a, b) => topicIndex(a.id) - topicIndex(b.id) || a.i - b.i).map((x) => x.id);
  const ordered = paperOrder(grouped);
  return { ids: ordered, shown: ordered.map(shownKey).filter((k): k is string => !!k), repeats: sameNumbers, sameNumbers, open: all.length };
}
