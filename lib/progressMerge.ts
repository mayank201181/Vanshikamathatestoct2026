// Merging two copies of saved progress so that nothing is ever lost — e.g. when the
// app is open in two tabs, or an older copy in storage meets newer answers in memory.
// Pure functions (no browser APIs) so they can be unit-tested.

export interface SetAttempt {
  /** mcq: chosen option index (authored index); written: the marked answers, one string per part */
  answers: Record<string, number | string[]>;
  /** written: marks earned per part (after any honest corrections) */
  partMarks: Record<string, number[]>;
  /** written explain parts: credited mark points per part ([] for auto-marked parts) */
  ticks: Record<string, boolean[][]>;
  /** written auto-marked parts the learner says the checker got wrong (full marks given) */
  overrides: Record<string, boolean[]>;
  /** number of hints revealed per question */
  hintsUsed: Record<string, number>;
  /** written answers being typed but not yet marked, one string per part */
  drafts?: Record<string, string[]>;
  /** multiple-choice option picked but not yet checked */
  picks?: Record<string, number>;
  /** for runs over a chosen list of questions (the Mistakes run): the question ids */
  ids?: string[];
  index: number;
  completed: boolean;
  startedAt: number;
  updatedAt: number;
}

export interface QuestionStat {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  /** 0..1 — last score (1/0 for MCQs, fraction of marks for written) */
  lastScore: number;
  lastAt: number;
}

export interface Finished {
  setId: string;
  correct: number;
  total: number;
  pct: number;
  at: number;
}

/** Where she was last working — powers "Continue where you left off". */
export interface LastPlace {
  href: string;
  label: string;
  at: number;
}

export interface QuickCheckState {
  answer: string;
  status: "correct" | "close" | "incorrect";
}

export interface Progress {
  version: 1;
  name: string;
  attempts: Record<string, SetAttempt>;
  /** setId → when it was last restarted (older copies of that attempt are dropped) */
  resets: Record<string, number>;
  best: Record<string, Finished>;
  history: Finished[];
  stats: Record<string, QuestionStat>;
  /** question id → open (true) or fixed (false) */
  mistakes: Record<string, boolean>;
  stars: number;
  awarded: Record<string, true>;
  guidesRead: Record<string, true>;
  cards: Record<string, "known" | "learning">;
  plan: Record<string, true>;
  /** yyyy-mm-dd → answers given that day */
  days: Record<string, number>;
  last?: LastPlace;
  /** topic → id of the guide section she was last reading */
  guidePos: Record<string, string>;
  /** guide quick checks, keyed "sectionId:index" */
  quick: Record<string, QuickCheckState>;
  /** the class-test date (yyyy-mm-dd), if set */
  testDate?: string;
}

export const EMPTY_PROGRESS: Progress = {
  version: 1,
  name: "Vanshika",
  attempts: {},
  resets: {},
  best: {},
  history: [],
  stats: {},
  mistakes: {},
  stars: 0,
  awarded: {},
  guidesRead: {},
  cards: {},
  plan: {},
  days: {},
  guidePos: {},
  quick: {},
};

export function emptyAttempt(ids?: string[]): SetAttempt {
  const now = Date.now();
  return { answers: {}, partMarks: {}, ticks: {}, overrides: {}, hintsUsed: {}, drafts: {}, picks: {}, ids, index: 0, completed: false, startedAt: now, updatedAt: now };
}

/** Fill in any missing fields of a parsed (possibly older) save. */
export function normaliseProgress(raw: Partial<Progress> | null | undefined): Progress {
  const p = { ...EMPTY_PROGRESS, ...(raw ?? {}) } as Progress;
  const attempts: Record<string, SetAttempt> = {};
  for (const [k, a] of Object.entries(p.attempts ?? {})) attempts[k] = { ...emptyAttempt(), ...a };
  return {
    ...p,
    attempts,
    name: p.name || EMPTY_PROGRESS.name,
    resets: p.resets ?? {},
    guidePos: p.guidePos ?? {},
    quick: p.quick ?? {},
    version: 1,
  };
}

const keys = (...objs: (object | undefined)[]) => [...new Set(objs.flatMap((o) => (o ? Object.keys(o) : [])))];

function maxRecord(a: Record<string, number> = {}, b: Record<string, number> = {}) {
  const out: Record<string, number> = {};
  for (const k of keys(a, b)) out[k] = Math.max(a[k] ?? 0, b[k] ?? 0);
  return out;
}

/** Combine two copies of the same attempt: keep every answer from both; the newer wins a clash. */
export function mergeAttempt(x?: SetAttempt, y?: SetAttempt): SetAttempt | undefined {
  if (!x) return y;
  if (!y) return x;
  const [o, n] = x.updatedAt <= y.updatedAt ? [x, y] : [y, x];
  const answers = { ...o.answers, ...n.answers };
  const drafts = { ...(o.drafts ?? {}), ...(n.drafts ?? {}) };
  const picks = { ...(o.picks ?? {}), ...(n.picks ?? {}) };
  // a draft/pick is only useful until that question has been answered
  for (const id of Object.keys(answers)) {
    delete drafts[id];
    delete picks[id];
  }
  return {
    ...n,
    answers,
    partMarks: { ...(o.partMarks ?? {}), ...(n.partMarks ?? {}) },
    ticks: { ...(o.ticks ?? {}), ...(n.ticks ?? {}) },
    overrides: { ...(o.overrides ?? {}), ...(n.overrides ?? {}) },
    hintsUsed: maxRecord(o.hintsUsed, n.hintsUsed),
    drafts,
    picks,
    ids: n.ids ?? o.ids,
    completed: n.completed || o.completed,
    startedAt: Math.min(o.startedAt, n.startedAt),
    updatedAt: n.updatedAt,
  };
}

/** Merge two whole progress saves. `b` is treated as the newer copy where there is no better rule. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const resets = maxRecord(a.resets, b.resets);

  const attempts: Record<string, SetAttempt> = {};
  for (const k of keys(a.attempts, b.attempts)) {
    const cut = resets[k] ?? 0;
    const x = a.attempts[k] && a.attempts[k].updatedAt >= cut ? a.attempts[k] : undefined;
    const y = b.attempts[k] && b.attempts[k].updatedAt >= cut ? b.attempts[k] : undefined;
    const m = mergeAttempt(x, y);
    if (m) attempts[k] = m;
  }

  const best: Record<string, Finished> = {};
  for (const k of keys(a.best, b.best)) {
    const x = a.best[k];
    const y = b.best[k];
    best[k] = !x ? y : !y ? x : y.pct > x.pct || (y.pct === x.pct && y.at >= x.at) ? y : x;
  }

  const seen = new Set<string>();
  const history = [...a.history, ...b.history]
    .filter((f) => {
      const id = `${f.setId}:${f.at}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((p, q) => p.at - q.at)
    .slice(-80);

  const stats: Record<string, QuestionStat> = {};
  const mistakes: Record<string, boolean> = {};
  for (const k of keys(a.stats, b.stats, a.mistakes, b.mistakes)) {
    const x = a.stats[k];
    const y = b.stats[k];
    const fromB = !x || (!!y && y.lastAt >= x.lastAt);
    const chosen = fromB ? y : x;
    if (chosen) stats[k] = chosen;
    const m = fromB ? b.mistakes[k] ?? a.mistakes[k] : a.mistakes[k] ?? b.mistakes[k];
    if (m !== undefined) mistakes[k] = m;
  }

  const last = !a.last ? b.last : !b.last ? a.last : b.last.at >= a.last.at ? b.last : a.last;

  return {
    version: 1,
    name: b.name || a.name,
    attempts,
    resets,
    best,
    history,
    stats,
    mistakes,
    stars: Math.max(a.stars, b.stars),
    awarded: { ...a.awarded, ...b.awarded },
    guidesRead: { ...a.guidesRead, ...b.guidesRead },
    cards: { ...a.cards, ...b.cards },
    plan: { ...a.plan, ...b.plan },
    days: maxRecord(a.days, b.days),
    last,
    guidePos: { ...(a.guidePos ?? {}), ...(b.guidePos ?? {}) },
    quick: { ...(a.quick ?? {}), ...(b.quick ?? {}) },
    testDate: b.testDate ?? a.testDate,
  };
}
