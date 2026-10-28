"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_PROGRESS,
  mergeAttempt,
  mergeProgress,
  normaliseProgress,
  type Finished,
  type LastPlace,
  type Progress,
  type QuestionStat,
  type QuickCheckState,
  type SetAttempt,
} from "./progressMerge";

// All progress lives in this browser (localStorage) — no login needed, so the
// link can simply be opened and used. Every answer, half-typed draft, hint and the
// place she was reading is saved as she goes, so she can always pick up where she left off.
// The share button sends a summary to a parent.

const KEY = "y8-maths-test-prep-v1";

export type { SetAttempt, QuestionStat, Finished, Progress, LastPlace, QuickCheckState } from "./progressMerge";
export { emptyAttempt } from "./progressMerge";

const EMPTY = EMPTY_PROGRESS;

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Progress {
  if (!raw) return EMPTY;
  try {
    return normaliseProgress(JSON.parse(raw) as Partial<Progress>);
  } catch {
    return EMPTY;
  }
}

export const RANKS: { min: number; title: string; emoji: string }[] = [
  { min: 0, title: "Number Rookie", emoji: "🔢" },
  { min: 50, title: "Fraction Fixer", emoji: "🍕" },
  { min: 130, title: "Percentage Pro", emoji: "💯" },
  { min: 250, title: "Ratio Ranger", emoji: "⚖️" },
  { min: 400, title: "Algebra Ace", emoji: "🧮" },
  { min: 600, title: "Sequence Sage", emoji: "📈" },
  { min: 850, title: "Maths Champion", emoji: "🏆" },
];

export function rankFor(stars: number) {
  let r = RANKS[0];
  for (const x of RANKS) if (stars >= x.min) r = x;
  const next = RANKS.find((x) => x.min > stars);
  return { ...r, next };
}

interface Store {
  ready: boolean;
  p: Progress;
  setName: (name: string) => void;
  getAttempt: (setId: string) => SetAttempt | undefined;
  saveAttempt: (setId: string, a: SetAttempt) => void;
  resetAttempt: (setId: string) => void;
  /** Record a marked answer. score is 0..1; "good" means it counts as right. */
  recordAnswer: (qid: string, score: number, good: boolean) => void;
  /** Correct the last recorded result (e.g. after an honest written-answer override). */
  adjustAnswer: (qid: string, score: number, good: boolean) => void;
  award: (key: string, stars: number) => void;
  finishSet: (f: Finished) => void;
  markGuideRead: (sectionId: string, read?: boolean) => void;
  setCard: (term: string, state: "known" | "learning") => void;
  togglePlan: (key: string) => void;
  /** Remember where she is, for "Continue where you left off". */
  setLast: (place: Omit<LastPlace, "at">) => void;
  /** Remember which guide section she was reading. */
  setGuidePos: (topic: string, sectionId: string) => void;
  setQuick: (key: string, state: QuickCheckState) => void;
  setTestDate: (date: string | undefined) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<Progress>(EMPTY);
  /** The exact JSON this tab last read from / wrote to storage. */
  const synced = useRef<string | null>(null);

  const adopt = useCallback((next: Progress) => {
    latest.current = next;
    setP(next);
  }, []);

  /** Save now. If another tab saved since we last synced, merge first so neither loses answers. */
  const writeNow = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    try {
      const raw = readRaw();
      let toSave = latest.current;
      if (raw && raw !== synced.current) {
        toSave = mergeProgress(parse(raw), latest.current);
        adopt(toSave);
      }
      const json = JSON.stringify(toSave);
      window.localStorage.setItem(KEY, json);
      synced.current = json;
    } catch {
      /* storage full or blocked — progress just won't persist */
    }
  }, [adopt]);

  /** Pull in anything another tab saved. */
  const pullFromStorage = useCallback(
    (raw: string | null) => {
      if (!raw || raw === synced.current) return;
      const merged = mergeProgress(parse(raw), latest.current);
      const json = JSON.stringify(merged);
      adopt(merged);
      synced.current = raw;
      if (json !== raw) writeNow(); // we had something the other copy lacked
    },
    [adopt, writeNow],
  );

  useEffect(() => {
    const raw = readRaw();
    synced.current = raw;
    // Hydrate from localStorage after mount: the server render has no storage to read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    adopt(parse(raw));
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) pullFromStorage(e.newValue);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") pullFromStorage(readRaw());
      else writeNow();
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", writeNow);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", writeNow);
    };
  }, [adopt, pullFromStorage, writeNow]);

  const update = useCallback(
    (fn: (prev: Progress) => Progress) => {
      setP((prev) => {
        const next = fn(prev);
        latest.current = next;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(writeNow, 200);
        return next;
      });
    },
    [writeNow],
  );

  const store = useMemo<Store>(
    () => ({
      ready,
      p,
      setName: (name) => update((s) => ({ ...s, name: name.slice(0, 40) })),
      getAttempt: (setId) => latest.current.attempts[setId],
      saveAttempt: (setId, a) =>
        update((s) => ({ ...s, attempts: { ...s.attempts, [setId]: mergeAttempt(s.attempts[setId], a)! } })),
      resetAttempt: (setId) => {
        const at = Date.now(); // taken now, so a run started right after is never older than its reset
        update((s) => {
          const attempts = { ...s.attempts };
          delete attempts[setId];
          const resets = { ...s.resets, [setId]: at };
          // allow stars to be earned again on a fresh attempt
          const awarded = Object.fromEntries(
            Object.entries(s.awarded).filter(([k]) => !k.startsWith(`${setId}:`)),
          ) as Record<string, true>;
          return { ...s, attempts, resets, awarded };
        });
      },
      recordAnswer: (qid, score, good) =>
        update((s) => {
          const prev = s.stats[qid];
          const stat: QuestionStat = {
            attempts: (prev?.attempts ?? 0) + 1,
            correct: (prev?.correct ?? 0) + (good ? 1 : 0),
            lastCorrect: good,
            lastScore: score,
            lastAt: Date.now(),
          };
          const mistakes = { ...s.mistakes };
          if (!good) mistakes[qid] = true;
          else if (qid in mistakes) mistakes[qid] = false;
          const day = todayKey();
          return {
            ...s,
            stats: { ...s.stats, [qid]: stat },
            mistakes,
            days: { ...s.days, [day]: (s.days[day] ?? 0) + 1 },
          };
        }),
      adjustAnswer: (qid, score, good) =>
        update((s) => {
          const prev = s.stats[qid];
          if (!prev) return s;
          const stat: QuestionStat = {
            ...prev,
            correct: Math.max(0, prev.correct + (good ? 1 : 0) - (prev.lastCorrect ? 1 : 0)),
            lastCorrect: good,
            lastScore: score,
          };
          const mistakes = { ...s.mistakes };
          if (!good) mistakes[qid] = true;
          else if (qid in mistakes) mistakes[qid] = false;
          return { ...s, stats: { ...s.stats, [qid]: stat }, mistakes };
        }),
      award: (key, stars) =>
        update((s) => (s.awarded[key] || stars <= 0 ? s : { ...s, stars: s.stars + stars, awarded: { ...s.awarded, [key]: true } })),
      finishSet: (f) =>
        update((s) => {
          const prevBest = s.best[f.setId];
          const best = !prevBest || f.pct >= prevBest.pct ? f : prevBest;
          return { ...s, best: { ...s.best, [f.setId]: best }, history: [...s.history, f].slice(-60) };
        }),
      markGuideRead: (sectionId, read = true) =>
        update((s) => {
          const guidesRead = { ...s.guidesRead };
          if (read) guidesRead[sectionId] = true;
          else delete guidesRead[sectionId];
          return { ...s, guidesRead };
        }),
      setCard: (term, state) => update((s) => ({ ...s, cards: { ...s.cards, [term]: state } })),
      togglePlan: (key) =>
        update((s) => {
          const plan = { ...s.plan };
          if (plan[key]) delete plan[key];
          else plan[key] = true;
          return { ...s, plan };
        }),
      setLast: (place) =>
        update((s) =>
          s.last && s.last.href === place.href && s.last.label === place.label && Date.now() - s.last.at < 5000
            ? s
            : { ...s, last: { ...place, at: Date.now() } },
        ),
      setGuidePos: (topic, sectionId) =>
        update((s) => (s.guidePos[topic] === sectionId ? s : { ...s, guidePos: { ...s.guidePos, [topic]: sectionId } })),
      setQuick: (key, state) => update((s) => ({ ...s, quick: { ...s.quick, [key]: state } })),
      setTestDate: (date) => update((s) => ({ ...s, testDate: date })),
      resetAll: () => update(() => ({ ...EMPTY, resets: {} })),
    }),
    [p, ready, update],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside <ProgressProvider>");
  return s;
}

/** Days in a row (ending today or yesterday) with at least one answer. */
export function streak(days: Record<string, number>): number {
  let n = 0;
  const d = new Date();
  if (!days[todayKey(d)]) d.setDate(d.getDate() - 1);
  while (days[todayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
